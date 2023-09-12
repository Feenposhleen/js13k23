const uiManager = (state, layer) => {
  const exports = {
    current: null,
  };

  const holdBarBehavior = (state) => {
    let previousInventory = 0;
    let ctx

    const draw = (sprite) => {
      const canvas = sprite[PRERENDER] || new OffscreenCanvas(100, 100);
      ctx = ctx || canvas.getContext('2d');

      ctx.clearRect(0, 0, 100, 100);

      ctx.font = '12px serif';
      ctx.fillStyle = PALETTE[17];

      let i = 0;
      for (let ware of Object.keys(state.player.inventory)) {
        const ownedQty = state.player.inventory[ware];
        if (ownedQty > 0) {
          ctx.textAlign = 'center';
          ctx.fillText(`${state.player.inventory[ware]}x ${ware}`, 50, 8 + (i * 14));
          i++;
        }
      }

      sprite[PRERENDER] = canvas;
    };

    return (sprite, dt) => {
      let inventory = Object.values(state.player.inventory).reduce((x, y) => x + y, 0);
      if (inventory !== previousInventory) {
        previousInventory = inventory;
        draw(sprite);
      }
    };
  }

  const topBarBehavior = (state) => {
    let previousCredits = state.player.credits;
    let previousTime = Math.floor(state.player.timeLeft);

    const draw = (sprite, flashCredits, flashTime) => {
      const canvas = sprite[PRERENDER] || new OffscreenCanvas(240, 24);
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, 240, 30);

      drawPanelBg(ctx);

      ctx.textAlign = 'center';
      ctx.font = 'bold 16px serif';
      ctx.fontWeight = 'bold';

      ctx.fillStyle = PALETTE[4];
      ctx.fillText(`${previousCredits} ƒ`, 60, 19);
      ctx.fillText(`${previousTime > 0 ? formatSeconds(previousTime) : '∞'}`, 180, 19);

      ctx.fillStyle = PALETTE[1];
      ctx.fillText(`${previousCredits} ƒ`, 59, 17);
      ctx.fillText(`${previousTime > 0 ? formatSeconds(previousTime) : '∞'}`, 179, 17);

      sprite[PRERENDER] = canvas;
    };

    return (sprite, dt) => {
      if (!sprite[PRERENDER]
        || (previousCredits != state.player.credits)
        || (previousTime !== Math.floor(state.player.timeLeft))) {
        previousCredits = state.player.credits;
        previousTime = Math.floor(state.player.timeLeft);
        draw(sprite);
        if (previousTime === 0) {
          if (previousCredits >= 10000) {
            showDialogPanel(state, characterPortraits[0], [
              `"Your time is up!"`,
            ]).then(() => delay(200)).then(() => showDialogPanel(state, characterPortraits[0], [
              `"Looks like you made it!`,
              `Good job. We had high hopes.`,
              `You did not disappoint."`,
            ])).then(() => delay(200)).then(() => showDialogPanel(state, characterPortraits[0], [
              `"We will take our money,`,
              `and leave you to it.`,
              `Bon voyage!"`
            ])).then(() => delay(1100))
              .then(() => state.player.credits -= 10000);
          } else {
            showDialogPanel(state, characterPortraits[0], [
              `"Your time is up!"`,
            ]).then(() => delay(200)).then(() => showDialogPanel(state, characterPortraits[0], [
              `"Now, where is our money?`,
              `You don\'t have it?!"`,
            ])).then(() => delay(200)).then(() => showDialogPanel(state, characterPortraits[0], [
              `"Well, then. This ship is ours.`,
              `Your cargo and money, too."`,
            ])).then(() => delay(200)).then(() => showDialogPanel(state, characterPortraits[0], [
              `"Our men will escort you off."`,
            ])).then(() => {
              state.over = true;
            });
          }
        }
      }
    };
  }

  const topBarSprite = createSprite([0, 0], 2, 0, []);
  addBehavior(topBarSprite, absolutePositionedBehavior(state, [0, -210]));
  addBehavior(topBarSprite, topBarBehavior(state));
  addSprite(layer, topBarSprite);

  const holdBarSprite = createSprite([0, 0], 2, 0, []);
  addBehavior(holdBarSprite, absolutePositionedBehavior(state, [0, 140]));
  addBehavior(holdBarSprite, holdBarBehavior(state));
  addSprite(layer, holdBarSprite);

  exports.removeCurrentPanel = () => {
    if (exports.currentPanel) {
      state.player.blockInput = false;
      removeSprite(layer, exports.currentPanel);
      exports.currentPanel = null;
    }
  };

  exports.showStaticPanel = (width, height, offset = [0, 0], bgColor = PALETTE[3]) => {
    exports.removeCurrentPanel();

    var canvas = new OffscreenCanvas(width, height);
    var ctx = canvas.getContext('2d');

    drawPanelBg(ctx, bgColor);

    const sprite = createSprite(vectorAdd(state.player.position, offset), 1, 0, null);
    sprite[OPACITY] = 0;
    sprite[PRERENDER] = canvas;
    addBehavior(sprite, absolutePositionedBehavior(state, offset));
    addBehavior(sprite, fadeInBehavior(1));
    addSprite(layer, sprite);
    sprite._d = { offset };

    exports.currentPanel = sprite;

    return ctx;
  };

  exports.showInteractivePanel = (width, height, offset, renderCallback) => {
    exports.removeCurrentPanel();
    state.player.blockInput = true;

    const ctx = exports.showStaticPanel(width, height, offset);
    addBehavior(exports.currentPanel, inputCallbackBehavior(state, (input) => {
      ctx.clearRect(0, 0, width, height);
      ctx.beginPath();
      drawPanelBg(ctx);

      ctx.save();
      renderCallback(ctx, input);
      ctx.restore();
    }));

    ctx.save();
    renderCallback(ctx, state.input);
    ctx.restore();
  }

  return exports;
};