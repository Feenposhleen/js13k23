const initWorker = () => {
  let canvas;
  let running = false;

  const input = {
    keys: {},
    pointers: [],
  };

  const runGame = async () => {
    await introScene(canvas, input);
    await gameplayScene(canvas, input);
  };

  self.onmessage = async ({ data }) => {
    if (data.canvas) {
      if (running) {
        return;
      }

      canvas = data.canvas;
      runGame();
      running = true;
    }

    if (data.input) {
      Object.assign(input, data.input, { t: Math.random() });
    }

    if (data.size && canvas) {
      canvas.width = data.size[0];
      canvas.height = data.size[1];
    }
  }
}
