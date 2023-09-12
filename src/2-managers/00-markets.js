const addMarketEvents = (market) => {
  if (rndFloat() > 0.5) {
    const high = rndFloat() > 0.5;
    const marketWares = Object.keys(market);
    const ware = marketWares[rndInt(marketWares.length)];
    market[ware].p *= (high ? (1 + rndFloat()) : (0.2 + (0.4 * rndFloat())));
    market[ware].p = Math.round(market[ware].p);
    market[ware][high ? 'h' : 'l'] = true;
  }
};

const marketManager = (state, layer) => {
  const exports = {
    nearby: null,
    nearbyType: null,
  };

  let markets = [];

  const generateMarket = (type, position) => {
    const market = {};

    let poly = POLY_OUTPOST_2;
    if (type === 'a') {
      poly = POLY_OUTPOST_3
      if (rndFloat() < 0.8) market['Oars'] = {
        p: 120 + (rndInt(60)),
        q: 10 + rndInt(20),
      };
      if (rndFloat() < 0.6) market['Sails'] = {
        p: 400 + (rndInt(200)),
        q: 8 + rndInt(10),
      };
      if (rndFloat() < 0.4) market['Anchors'] = {
        p: 2000 + (rndInt(1000)),
        q: 6 + rndInt(6),
      };
    } else if (type === 'd') {
      poly = POLY_OUTPOST_2;
      if (rndFloat() < 0.4) market['Khat'] = {
        p: 18 + (rndInt(18)),
        q: 20 + rndInt(30),
      };
      if (rndFloat() < 0.4) market['Hashish'] = {
        p: 82 + (rndInt(82)),
        q: 10 + rndInt(40),
      };
      if (rndFloat() < 0.4 || !market.length) market['Opium'] = {
        p: 1858 + (rndInt(1800)),
        q: 4 + rndInt(12),
      };
    } else {
      poly = POLY_OUTPOST_1;
      if (rndFloat() < 0.8) market['Wheat'] = {
        p: 12 + (rndInt(4)),
        q: 10 + rndInt(40),
      };
      if (rndFloat() < 0.7) market['Cotton'] = {
        p: 93 + (rndInt(30)),
        q: 5 + rndInt(20),
      };
      if (rndFloat() < 0.6) market['Tools'] = {
        p: 171 + (rndInt(80)),
        q: 5 + rndInt(10),
      };
      if (rndFloat() < 0.5) market['Weapons'] = {
        p: 718 + (rndInt(400)),
        q: 5 + rndInt(15),
      };
      if (rndFloat() < 0.5) market['Spices'] = {
        p: 1918 + (rndInt(1000)),
        q: 4 + rndInt(10),
      };
      if (Object.keys(market).length < 4) market['Gold'] = {
        p: 3742 + (rndInt(2500)),
        q: 3 + rndInt(6),
      };
    }

    addMarketEvents(market);

    const sprite = createSprite([position[0], position[1]], 2, rndOne() * 0.1, poly);
    sprite._m = market;
    sprite._mt = type;
    addBehavior(sprite, marketBehavior());
    prerenderSprite(sprite);

    return sprite;
  };

  const marketBehavior = () => {
    let marketModal = false;

    return (sprite, dt) => {
      const dist = Math.max(
        Math.abs(state.player.position[0] - sprite[POSITION][0]),
        Math.abs(state.player.position[1] - sprite[POSITION][1])
      );

      if ((dist < 50) && (exports.nearby !== sprite._m)) {
        exports.nearby = sprite._m;
        exports.nearbyType = sprite._mt;

        state.particlesAir.addBurst(sprite[POSITION][0], sprite[POSITION][1], '17', 1);

        const ctx = state.ui.showStaticPanel(120, 24, [0, 60], PALETTE[0]);
        ctx.fillStyle = PALETTE[17];
        ctx.font = "12px serif";
        ctx.textAlign = "center";
        ctx.fillText("[E] TRADE", 60, 15);
      } else if ((exports.nearby === sprite._m) && state.input.keys['e'] && !marketModal) {
        marketModal = true;
        showMarketPanel(state);
      } else if ((dist > 50) && (exports.nearby === sprite._m)) {
        exports.nearby = null;
        exports.nearbyType = null;
        marketModal = false;

        state.ui.removeCurrentPanel();
      }
    };
  };

  exports.removeAll = () => {
    for (let market of markets) {
      removeSprite(layer, market);
      markets = [];
    }
  };

  exports.createMarket = (type, pos) => {
    const marketSprite = generateMarket(type, pos);
    addSprite(layer, marketSprite);
    markets.push(marketSprite);
  };

  // /DEV ---------
  // exports.nearby = generateMarket('a', [0, -100])._m;
  // exports.nearbyType = 'a';
  // setTimeout(() => showMarketPanel(state), 500);
  // DEV/ ---------

  return exports;
};