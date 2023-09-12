const introScene = (canvas, input) => new Promise(async next => {
  const ctx = canvas.getContext('2d');
  const centerX = (canvas.width / 2);
  const root = createSprite();
  let over = false;

  const clear = () => {
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  delay(400)
    .then(() => clear() || drawQuipText(ctx, centerX - 10, 250, ['Adventure!']))
    .then(() => delay(800))
    .then(() => clear() || drawQuipText(ctx, centerX - 20, 230, ['Gold!']))
    .then(() => delay(800))
    .then(() => clear() || drawQuipText(ctx, centerX + 20, 320, ['Pirates!']))
    .then(() => delay(800))
    .then(() => clear() || drawQuipText(ctx, centerX - 5, 210, ['Profit!']))
    .then(() => delay(800))
    .then(() => clear())
    .then(() => delay(2000))
    .then(() => {
      clear();
      drawQuipText(ctx, centerX - 100, 200, [
        'I always wanted to earn my fortune on the high seas.',
      ])
    })
    .then(() => delay(2000))
    .then(() => {
      clear();
      drawQuipText(ctx, centerX - 100, 200, [
        'I always wanted to earn my fortune on the high seas.',
        'But it\'s expensive to get rich.',
      ])
    })
    .then(() => delay(3000))
    .then(() => clear())
    .then(() => delay(1000))
    .then(() => {
      clear();
      drawQuipText(ctx, centerX - 100, 200, [
        'I\'ve found a shady broker that is willing to bet on me.',
      ])
    })
    .then(() => delay(3000))
    .then(() => {
      clear();
      drawQuipText(ctx, centerX - 100, 200, [
        'I\'ve found a shady broker that is willing to bet on me.',
        'The terms are lousy, but it\'s my only shot.',
      ])
    })
    .then(() => delay(3000))
    .then(() => {
      clear();
      drawQuipText(ctx, centerX - 100, 200, [
        'I\'ve found a shady broker that is willing to bet on me.',
        'The terms are lousy, but it\'s my only shot.',
        'It\'s time for some big...',
      ])
    })
    .then(() => delay(3000))
    .then(() => {
      clear();
      ctx.save();
      ctx.translate(centerX + 60, 200);
      ctx.scale(14, 14);
      drawSprite(ctx, createSprite([centerX, 200], 20, 0, POLY_LOGO));
      ctx.restore();
    })
    .then(() => delay(3000))
    .then(next);
});
