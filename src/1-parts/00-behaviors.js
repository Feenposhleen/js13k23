const rotateBehavior = radsPerSec => (sprite, dt) => sprite[ROTATION] += (radsPerSec * dt);

const jitterBehavior = (state, amount) => (sprite, dt) => {
  sprite[POSITION][0] += Math.cos(state.time) * amount;
  sprite[POSITION][1] += Math.sin(state.time) * amount;
};

const pulseBehavior = (min, max) => {
  let tick = 0;
  return (sprite, dt) => {
    tick += (dt * 10);
    sprite[SCALE] = min + ((max - min) * (0.5 + (Math.cos(tick) / 2)));
  };
};

const fadeOutBehavior = () => {
  return (sprite, dt) => {
    sprite[OPACITY] = Math.max(0, sprite[OPACITY] - (dt / 2));
  };
};

const clickableBehavior = (state, callback, radius = 80) => {
  return () => {
    if (state.input.pointer) {
    }
  };
};

const fadeInBehavior = (targetOpacity = 1, speed = 2) => {
  var opacity = 0;
  return (sprite, dt) => {
    sprite[OPACITY] = Math.min(targetOpacity, opacity += (dt * speed));
  };
};

const inputCallbackBehavior = (state, callback) => {
  let previousT = state.input.t;
  return () => {
    if (state.input.t !== previousT) {
      previousT = state.input.t;
      callback(state.input);
    }
  }
};

const absolutePositionedBehavior = (state, offset = [0, 0]) => (sprite) => {
  sprite[POSITION] = vectorAdd(
    state.player.anchor[POSITION],
    offset
  );
};

