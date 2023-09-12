const marketModalHeight = 400;
const marketItemHeight = 48;
const padding = 10;

const characterPortraits = prerenderCanvases([
  POLY_CHAR_1,
  POLY_CHAR_2,
  POLY_CHAR_3,
  POLY_CHAR_4,
  POLY_CHAR_5,
]);

const showMarketPanel = (state) => {
  let itemIndex = 0;
  let selectedQty = 0;
  const market = state.markets.nearby;
  const marketType = state.markets.nearbyType;
  const marketLength = Object.keys(market).length;

  state.ui.showInteractivePanel(240, marketModalHeight, [0, 10], (ctx, input) => {
    const ware = Object.keys(market)[itemIndex];
    if (input.keys['q']) {
      state.ui.removeCurrentPanel();
      return;
    } else if (input.keys['e'] && selectedQty) {
      if (selectedQty > 0) {
        state.player.inventory[ware] = state.player.inventory[ware] || 0;
        state.player.inventory[ware] += selectedQty;
        state.player.credits -= (market[ware].p * selectedQty);
        market[ware].q -= selectedQty;
        selectedQty = 0;
      } else {
        state.player.inventory[ware] += selectedQty;
        state.player.credits += (market[ware].p * Math.abs(selectedQty));
        market[ware].q += Math.abs(selectedQty);
        selectedQty = 0;
      }
    } else if (input.keys['s']) {
      itemIndex = Math.min(marketLength - 1, itemIndex + 1);
      selectedQty = 0;
    } else if (input.keys['w']) {
      itemIndex = Math.max(0, itemIndex - 1);
      selectedQty = 0;
    } else if (input.keys['a']) {
      selectedQty = (selectedQty <= 0)
        ? (Math.max(-state.player.inventory[ware] || 0, selectedQty - 1))
        : (selectedQty - 1);
    } else if (input.keys['d']) {
      const affordable = ((market[ware].p * (selectedQty + 1)) < state.player.credits);
      selectedQty = ((selectedQty >= 0) && affordable)
        ? (Math.min(market[ware].q, selectedQty + 1))
        : ((selectedQty >= 0) ? selectedQty : selectedQty + 1);
    }

    ctx.fillStyle = PALETTE[4];
    ctx.fillRect(2, 2, 237, marketItemHeight * 2);

    ctx.fillStyle = PALETTE[17];
    ctx.font = "14px serif";
    ctx.textAlign = "left";
    ctx.fillText(marketType === 'd' ? 'Den' : (marketType === 'a' ? 'Anchorage' : 'Outpost'), padding, padding * 2);

    drawHelpText(ctx, padding, marketModalHeight - padding, [
      `[W,S] WARE, [A,D] QUANTITY`,
      `[Q] CLOSE, [E] CONFIRM`,
    ]);

    ctx.translate(0, marketItemHeight);

    const portrait = characterPortraits[Math.min(Object.keys(market).length, 4)];
    ctx.drawImage(portrait, padding, 0);

    ctx.font = "12px serif";
    ctx.fillStyle = PALETTE[1];

    let message = [
      `Welcome.`,
      `Please browse our wares.`
    ];

    const specialWare = Object.keys(market).find((ware) =>
      market[ware].h || market[ware].l
    );

    if (specialWare) {
      if (market[specialWare].h) {
        message = [
          `Looking for ${specialWare.toLowerCase()}?`,
          `You better pay. Demand is up!`
        ];
      } else {
        message = [
          `We\'re getting rid of ${specialWare.toLowerCase()}!`,
          `Fill your holds!`
        ];
      }
    }

    drawQuipText(ctx, 80, 6 + padding, message);

    ctx.translate(0, marketItemHeight * 1.5);
    let i = 0;
    Object.keys(market).forEach((itemName, idx) => {
      const item = market[itemName];
      const selected = idx === itemIndex;
      const qty = selected ? selectedQty : 0;
      const buy = qty > 0;

      drawSelectable(ctx, 10, 2, 220, marketItemHeight - 8, selected);

      let offset = 18;

      ctx.fillStyle = selected ? PALETTE[17] : PALETTE[2];
      ctx.textAlign = "left";
      ctx.fillText(`${itemName} (${item.q})`, 20, offset);

      ctx.textAlign = "right";
      ctx.fillText(`◄ ${qty ? (buy ? `Buy ${qty}` : `Sell ${Math.abs(qty)}`) : `0`} ►`, 220, offset);

      offset += 16;

      ctx.textAlign = "left";
      ctx.fillText(`${item.p} ƒ`, 20, offset);

      ctx.textAlign = "right";
      ctx.font = "12px serif";
      ctx.fillText(qty ? `${qty > 0 ? 'Cost:' : 'Gain:'} ${Math.abs(qty * item.p)} ƒ` : `In hold: ${state.player.inventory[itemName] || 0}`, 220, offset);

      i++;
      ctx.translate(0, marketItemHeight);
    });
  });
};

const showAlertPanel = (state, textLines) => {
  state.ui.showInteractivePanel(200, 110, [0, 10], (ctx, input) => {
    if (input.keys['q']) {
      state.ui.removeCurrentPanel();
    }

    drawQuipText(ctx, padding, 18 + padding, textLines);
    drawHelpText(ctx, padding, 100, [`[Q] CLOSE`]);
  });
};

const showDialogPanel = (state, imageCanvas, textLines) =>
  new Promise(resolve => {
    state.ui.showInteractivePanel(180, 180, [0, 10], (ctx, input) => {
      if (input.keys['q']) {
        state.ui.removeCurrentPanel();
        resolve();
      }

      ctx.drawImage(imageCanvas, padding, padding);

      drawQuipText(ctx, padding, 80 + padding, textLines);
      drawHelpText(ctx, padding, 180 - padding, [`[Q] CLOSE`]);
    });
  });

const showEventPanel = (state, textLines, options, spriteCanvas = characterPortraits[rndInt(5)]) => {
  const optionsLength = options.length;
  let optionIdx = 0;

  state.ui.showInteractivePanel(260, 180, [0, 10], (ctx, input) => {
    if (input.keys['e']) {
      state.ui.removeCurrentPanel();
      options[optionIdx][1]();
      return;
    } else if (input.keys['s']) {
      optionIdx = Math.min(optionsLength - 1, optionIdx + 1);
    } else if (input.keys['w']) {
      optionIdx = Math.max(0, optionIdx - 1);
    }

    drawHelpText(ctx, padding, 170, [`[W,S] SELECT, [E] CONFIRM`]);

    if (spriteCanvas) {
      ctx.drawImage(spriteCanvas, padding, padding);
    }

    drawQuipText(ctx, spriteCanvas ? 80 : padding, 18 + padding, textLines);

    ctx.translate(0, 80);

    options.forEach((option, idx) => {
      const selected = optionIdx === idx;
      drawSelectable(ctx, padding, 0, 240, 28, selected);

      ctx.fillStyle = selected ? PALETTE[17] : PALETTE[2];
      ctx.font = "14px serif";
      ctx.textAlign = "left";
      ctx.fillText(option[0], padding * 2, 18);

      ctx.translate(0, 34);
    });
  });
};