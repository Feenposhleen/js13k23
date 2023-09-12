const playerManager = (state, layer) => {
  const exports = {
    position: [0, 0],
    blockInput: false,
    credits: 2000,
    inventory: {},
    timeLeft: 15 * 60,
  };

  let angularVelocity = 0;
  let speed = 0;
  let maxSpeed = 80;
  let particleTick = 0;

  var startPos = [0, 0];

  exports.bounceBack = () => speed = -(maxSpeed * 1.1);

  exports.wares = () => Object.keys(exports.inventory).filter((x) =>
    exports.inventory[x] > 0
  );

  exports.anchor = createSprite([startPos[0] + 200, startPos[1] + 100], 2, 0, POLY_WANG_LAND[0]);

  exports.anchor[OPACITY] = 0;

  const arrowSprite = createSprite([0, 50], 1, 0, POLY_ARROW_UP);
  arrowSprite[OPACITY] = 0;

  const playerSprite = createSprite([startPos[0], startPos[1]], 2, 0, POLY_PLAYER_SHIP);

  exports.trackPosition = (otherPosition) => {
    const angle = vectorAngle(playerSprite[POSITION], otherPosition);

    arrowSprite[POSITION] = [
      Math.sin(angle + Math.PI) * 50,
      Math.cos(angle + Math.PI) * 50,
    ];

    arrowSprite[ROTATION] = -angle;

    if (arrowSprite[OPACITY] === 0) {
      addBehavior(arrowSprite, fadeInBehavior(1));
    }
  };

  exports.stopTracking = () => {
    if (arrowSprite[OPACITY] === 1) {
      arrowSprite[BEHAVIORS] = [fadeOutBehavior()];
    }
  };

  addBehavior(playerSprite, (sprite, dt) => {
    if (exports.blockInput) return;

    // Time
    exports.timeLeft -= dt;

    // Rotation
    if (state.input.keys['d']) angularVelocity = Math.min(20, angularVelocity + (dt * 20));
    if (state.input.keys['a']) angularVelocity = Math.max(-20, angularVelocity - (dt * 20));
    angularVelocity *= (0.9 - Math.min(dt, 0.9));
    sprite[ROTATION] += (angularVelocity * dt);

    // Speed
    if (state.input.keys['w']) speed = Math.min(maxSpeed, speed + (maxSpeed * (dt)));
    else speed *= (0.99 * dt);

    sprite[POSITION][0] += speed * Math.cos(sprite[ROTATION] - (Math.PI / 2)) * dt;
    sprite[POSITION][1] += speed * Math.sin(sprite[ROTATION] - (Math.PI / 2)) * dt;

    exports.position = [sprite[POSITION][0], sprite[POSITION][1]];

    // Wake
    if ((speed > 10) && ((particleTick += (dt * 4)) > (1 - speed))) {
      state.particlesWater.addParticle(sprite[POSITION][0], sprite[POSITION][1], '17', 1.4, 0.6);
      particleTick = 0;
    }

    // Anchor
    exports.anchor[POSITION][0] += (playerSprite[POSITION][0] - exports.anchor[POSITION][0]) * 0.05;
    exports.anchor[POSITION][1] += (playerSprite[POSITION][1] - exports.anchor[POSITION][1]) * 0.05;
  });

  addBehavior(playerSprite, jitterBehavior(state, 0.01));

  addSprite(layer, playerSprite);

  addSprite(exports.anchor, arrowSprite);
  addSprite(layer, exports.anchor);

  prerenderSprite(playerSprite);

  return exports;
};