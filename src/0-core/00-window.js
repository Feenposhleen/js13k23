const initWindow = () => {
  const canvas = document.querySelector('#c');
  const offscreen = canvas.transferControlToOffscreen();

  const jsUrl = URL.createObjectURL(new Blob(
    [document.querySelector('script').innerHTML],
    { type: 'text/javascript' },
  ));
  const worker = new Worker(jsUrl);

  const addDocListener = document.addEventListener;
  const addWinListener = window.addEventListener;

  let marginX = 0;
  let marginY = 0;

  const handleCanvasSize = () => {
    const ratio = Math.max(0.55, Math.min(1.5, window.innerWidth / window.innerHeight));
    const height = 480;
    const width = 480 * ratio;
    const scale = window.innerHeight / 480;
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    canvas.style.height = `${height * scale}px`;
    canvas.style.width = `${width * scale}px`;

    marginX = (window.innerWidth - (width * scale)) / 2;
    marginY = (window.innerHeight - (height * scale)) / 2;

    worker.postMessage({ size: [width, height] })
    window.onresize = window.onresize || handleCanvasSize;
  };

  const wireInput = () => {
    const inputState = {
      keys: {},
      pointer: null,
    };

    const updateKeys = (down) => (ev) => {
      if (inputState.keys[ev.key] != down) {
        inputState.keys[ev.key] = down;
        worker.postMessage({ input: inputState });
      }
    };

    const updatePointer = (down) => async (ev) => {
      if (!down) {
        inputState.pointer = null;
      } else {
        inputState.pointer = [
          ev.clientX - marginX,
          ev.clientY - marginY,
        ];
      }
      worker.postMessage({ input: inputState });
    };

    addWinListener('keydown', updateKeys(true));
    addWinListener('keyup', updateKeys(false));
    addDocListener('pointerend', updatePointer(false));
    addDocListener('pointercancel', updatePointer(false));
    addDocListener('pointerdown', updatePointer(true));
  }

  worker.postMessage({ canvas: offscreen }, [offscreen]);

  wireInput();
  handleCanvasSize();
};