const islandManager = (state, layer) => {
  const exports = {};

  const tileSize = 45;

  const generateProto = (size) => {
    const center = size / 2;
    const proto = [];
    for (let y = 0; y < size; y++) {
      const yDistance = Math.abs(center - y);
      const row = [];
      for (let x = 0; x < size; x++) {
        const xDistance = Math.abs(center - x);
        row.push((Math.random() * size * 2.5) > (xDistance + yDistance) ? 1 : 0);
      }
      proto.push(row);
    }
    return proto;
  }

  const padProto = (proto) => {
    let empty = Array.from({ length: proto[0].length + 2 }, () => 0);
    return [empty, ...proto.map((val) => [0, ...val, 0,]), empty];
  }

  const islandBehavior = () => {
    let found = false;
    return (sprite) => {
      const dist = vectorDistance(state.player.position, sprite._i.islandCenter);

      // Collision
      if (dist < ((sprite[PRERENDER].width - 60) / 2)) {
        state.player.bounceBack();
      }

      // Tracking
      if (dist > (sprite[PRERENDER].width * 2)) {
        removeSprite(layer, exports.island);
        state.markets.removeAll();

        const currentAngle = vectorAngle(state.player.position, sprite[POSITION]);
        exports.island = generateIsland(vectorAdd(
          state.player.position,
          vectorRotate(
            [0, sprite[PRERENDER].width * 1.8],
            (currentAngle + (rndOne() * 0.2)) - Math.PI,
          )
        ));

        addSprite(layer, exports.island);
      } else if (dist > (sprite[PRERENDER].width) && !found) {
        state.player.trackPosition(sprite._i.islandCenter);
      } else {
        if (!found) {
          found = true;
          state.player.stopTracking();
          if (rndFloat() > 0.4) triggerEvent(state);
        }
      }
    }
  };

  const generateIsland = (position) => {
    const size = rndInt(5, 3);
    const centerOffset = -((size / 2) * tileSize) - (tileSize / 2);
    const proto = generateProto(size);
    const islandCenter = createSprite(position, 1, 0, POLY_WANG_LAND[0]);
    const padded = padProto(proto);

    let outpostSpawned = false;
    let extraSpawned = false;

    const wangGrid = [];
    for (let x = 1; x < (proto[0].length + 2); x++) {
      const wangRow = [];
      for (let y = 1; y < (proto.length + 2); y++) {
        let nw = padded[y - 1][x - 1] ? 8 : 0;
        let ne = padded[y - 1][x] ? 1 : 0;
        let sw = padded[y][x - 1] ? 4 : 0;
        let se = padded[y][x] ? 2 : 0;
        let wangNr = nw + ne + sw + se;
        wangRow.push(wangNr);

        let poly = POLY_WANG_LAND[nw + ne + sw + se];
        let offsetX = centerOffset + (x * tileSize);
        let offsetY = centerOffset + (y * tileSize);

        let sprite = createSprite([offsetX, offsetY], 2, 0, poly);
        addSprite(islandCenter, sprite);

        const marketPos = [
          islandCenter[POSITION][0] + offsetX,
          islandCenter[POSITION][1] + offsetY
        ];

        if ((wangNr == 12) && (x > (size)) && (y > 2) && !outpostSpawned) {
          state.markets.createMarket('x', marketPos)
          outpostSpawned = true;
        } else if ((wangNr == 3) && (x < 2) && (y > 2) && !extraSpawned) {
          extraSpawned = true;
          if (rndFloat() < 0.3) {
            state.markets.createMarket('a', marketPos);
          } else if (rndFloat() < 0.4) {
            state.markets.createMarket('d', marketPos)
          } else if (rndFloat() < 0.3) {
            // Spawn treasure chest
          }
        }

        if ((ne && !se) || (ne && se && nw && sw)) {
          for (let i = 0; i < 2; i++) {
            const palmPos = [offsetX + rndInt(-8, 8), offsetY + rndInt(-8, 8)];
            let sprite = createSprite(palmPos, 1.5 + (rndFloat()), 0, POLY_PALM);

            sprite[ROTATION] = rndFloat() * Math.PI;
            addSprite(islandCenter, sprite);
          }
        }
      }
      wangGrid.push(wangRow);
    }

    islandCenter._i = {
      centerOffset,
      wangGrid,
      islandCenter: vectorAdd(islandCenter[POSITION], [22, 22]),
    };

    prerenderSprite(islandCenter, padded[0].length * 45, padded.length * 45, true);
    addBehavior(islandCenter, islandBehavior());
    return islandCenter;
  }

  exports.island = generateIsland([300, 0]);
  addSprite(layer, exports.island);

  return exports;
};