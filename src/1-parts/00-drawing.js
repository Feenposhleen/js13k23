const drawPanelBg = (ctx, centerColor = PALETTE[3]) => {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  ctx.fillStyle = PALETTE[5];
  ctx.beginPath();
  ctx['roundRect'](0, 0, width, height, 4);
  ctx.fill();

  ctx.fillStyle = PALETTE[4];
  ctx.beginPath();
  ctx['roundRect'](0, 1, width, height - 1, 4);
  ctx.fill();

  ctx.fillStyle = centerColor;
  ctx.beginPath();
  ctx['roundRect'](3, 3, width - 6, height - 6, 4);
  ctx.fill();
};

const drawQuipText = (ctx, x, y, textLines) => {
  ctx.font = "13px serif";
  ctx.textAlign = "left";
  ctx.fillStyle = PALETTE[14];
  textLines.forEach((line, idx) => {
    ctx.fillText(line, x + 1, y + 2 + (14 * idx));
  });
  ctx.fillStyle = PALETTE[1];
  textLines.forEach((line, idx) => {
    ctx.fillText(line, x, y + (14 * idx));
  });
};

const drawSelectable = (ctx, x, y, w, h, selected) => {
  ctx.fillStyle = PALETTE[4];
  ctx.fillRect(x, y, w, h);

  if (selected) {
    ctx.strokeStyle = PALETTE[17];
    ctx.strokeWidth = 2;

    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.stroke();
  }
};

const drawHelpText = (ctx, x, y, textLines) => {
  ctx.fillStyle = PALETTE[2];
  ctx.font = "10px serif";
  ctx.textAlign = "left";

  textLines.forEach((line, idx) => {
    ctx.fillText(line, x, y - (idx * 14));
  });
};
