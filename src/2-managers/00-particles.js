const particleManager = (state, layer) => {
  const exports = {};
  const particleCache = [];

  const particleBurstBehavior = (sprite, dt) => {
    if (sprite[OPACITY] < 0) return;
    sprite[POSITION][0] += sprite._pl[0] * 20 * dt;
    sprite[POSITION][1] += sprite._pl[1] * 20 * dt;
    sprite[SCALE] *= (1 - (dt * 1));
    sprite[OPACITY] -= (dt);
    sprite[ROTATION] -= sprite._pl[0] * 12 * dt;

    if (sprite[OPACITY] < 0) {
      particleCache.push(sprite);
    }
  };

  exports.addParticle = (x, y, color, scale, initialOpacity = 1) => {
    let particleSprite;
    if (particleCache.length) {
      particleSprite = particleCache.pop();
    } else {
      particleSprite = createSprite();
      particleSprite[DATA] = [...POLY_TRI];
      addSprite(layer, particleSprite);
    }

    particleSprite[POSITION][0] = x;
    particleSprite[POSITION][1] = y;
    particleSprite[DATA][0] = color;
    particleSprite[SCALE] = scale;
    particleSprite[OPACITY] = initialOpacity;
    particleSprite[BEHAVIORS] = [particleBurstBehavior];

    particleSprite._pl = [rndOne(), rndOne()];
  };

  exports.addBurst = (x, y, color, radius, qty = 10) => {
    for (let i = 0; i < qty; i++) {
      exports.addParticle(x, y, color, radius + (rndOne() * 0.5 * radius), particleBurstBehavior);
    }
  };

  return exports;
};