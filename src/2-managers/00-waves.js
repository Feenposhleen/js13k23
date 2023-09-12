const waveManager = (state, layer) => {
  const exports = {};

  const waveBehavior = (sprite, dt) => {
    sprite._wt += dt;
    sprite[POSITION][0] += dt * 5;

    if (sprite._wt < 1) {
      sprite[OPACITY] = sprite._wt / 2;
    } else if (sprite._wt > 2 && sprite._wt < 3) {
      sprite[OPACITY] = (3 - sprite._wt) / 2;
    } else if (sprite._wt > 3) {
      sprite[OPACITY] = 0;
      sprite._wt = 0;
      const position = rndRadius(state.player.position, 200);
      sprite[POSITION][0] = position[0];
      sprite[POSITION][1] = position[1];
    };
  };

  const waveSprites = [];

  for (var i = 0; i < 10; i++) {
    const position = rndRadius(state.player.position, 200);
    const sprite = createSprite([position[0], position[1]], 1 - (rndFloat() / 2), 0, POLY_WAVE_1);
    prerenderSprite(sprite);
    sprite._wt = rndFloat() * 3;
    addBehavior(sprite, waveBehavior);
    addSprite(layer, sprite);
    waveSprites.push(sprite);
  }

  return exports;
};