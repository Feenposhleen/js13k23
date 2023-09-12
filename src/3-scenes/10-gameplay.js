const gameplayScene = (canvas, input) => new Promise(next => {
  const ctx = canvas.getContext('2d');
  const root = createSprite();

  // Set up layers in order
  const backgroundLayer = createSprite();
  addSprite(root, backgroundLayer);

  const landLayer = createSprite();
  addSprite(root, landLayer);

  const foregroundLayer = createSprite();
  addSprite(root, foregroundLayer);

  const shipLayer = createSprite();
  addSprite(root, shipLayer);

  const fxLayer = createSprite();
  addSprite(root, fxLayer);

  const uiLayer = createSprite();
  addSprite(root, uiLayer);

  // Set up state
  const state = {
    time: 0,
    canvas,
    input,
  };

  state.particlesWater = particleManager(state, backgroundLayer);
  state.particlesAir = particleManager(state, fxLayer);
  state.player = playerManager(state, shipLayer);
  state.waves = waveManager(state, backgroundLayer);
  state.markets = marketManager(state, foregroundLayer);
  state.islands = islandManager(state, landLayer);
  state.ui = uiManager(state, uiLayer);

  delay(2000).then(() => showDialogPanel(state, characterPortraits[0], [
    `"There you go, as requested.`,
    `A fine ship, and some initial`,
    `capital."`,
  ])).then(() => delay(200)).then(() => showDialogPanel(state, characterPortraits[0], [
    `"We have faith in you, but`,
    `you better be ready in time`,
    `to pay back. With interest."`,
  ])).then(() => delay(200)).then(() => showDialogPanel(state, characterPortraits[0], [
    `"We will expect 10 000 ƒ."`,
  ]));

  // Main gameplay loop
  runLoop(0, (_, dt) => {
    state.time += dt;
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#768';
    ctx.fillRect(0, 0, state.canvas.width, state.canvas.height);

    runSpriteTree(ctx, root, dt, state.player.anchor);

    return state.over ? 0 : 1;
  });
});
