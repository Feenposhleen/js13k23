const POSITION = 0;
const SCALE = 1;
const ROTATION = 2;
const DATA = 3;
const FLIP = 4;
const OPACITY = 5;
const CHILDREN = 6;
const BEHAVIORS = 7;
const PRERENDER = 8;
const SEED = 9;

const FLIP_X = 4;
const FLIP_Y = 8;
const FLIP_XY = 12;

const REMOVE = 4;
const STOP = 8;
const STOP_AND_REMOVE = 12;

const PALETTE = [
  '#AA7939',
  '#EAD0AE',
  '#CAA26D',
  '#8A5712',
  '#6A3D00',

  '#AA8E39',
  '#EADBAE',
  '#CAB36D',
  '#8A6C12',
  '#6A5000',

  '#AA5939',
  '#EABFAE',
  '#CA876D',
  '#8A3412',
  '#6A1E00',

  '#000',
  '#666',
  '#FFF',
];


const createSprite = (pos = [0, 0], scale = 1, rotation = 0, data = []) =>
  [pos, scale, rotation, data, 0, 1, [], [], null, rndOne()];

const prerenderSprite = (sprite, width = 24, height = 24, absolute = false) => {
  var canvas = new OffscreenCanvas(
    width * sprite[SCALE],
    height * sprite[SCALE]
  );

  var ctx = canvas.getContext('2d');
  ctx.translate(canvas.width / 2, canvas.height / 2);
  drawPrerenderTree(ctx, sprite);

  sprite[PRERENDER] = canvas;
}

const drawPrerenderTree = (ctx, sprite, root = true) => {
  ctx.save();
  ctx.globalAlpha = Math.max(0, sprite[OPACITY]);

  if (!root) {
    ctx.translate(sprite[POSITION][0], sprite[POSITION][1]);
  }

  ctx.scale(sprite[SCALE], sprite[SCALE]);
  drawSprite(ctx, sprite);

  for (let i = 0; i < sprite[CHILDREN].length; i++) {
    drawPrerenderTree(ctx, sprite[CHILDREN][i], false);
  }

  ctx.restore();
}

const allSprites = (parent, cb, deep = true) => {
  for (let i = parent[CHILDREN].length - 1; i >= 0; i--) {
    const child = parent[CHILDREN][i];
    const res = cb(child, i);

    if (res && (res & REMOVE)) parent[CHILDREN].splice(i, 1);
    if (res && (res & STOP)) return;

    if (deep && child[CHILDREN].length) {
      allSprites(child, cb);
    }
  }
}

const addSprite = (parent, sprite) => parent[CHILDREN].push(sprite);

const addBehavior = (sprite, behavior) => sprite[BEHAVIORS].push(behavior);

const removeSprite = (parent, sprite) =>
  allSprites(parent, child => (child === sprite ? STOP_AND_REMOVE : 0));

const drawSprite = (ctx, sprite) => {
  let i = 0;
  while (i < sprite[DATA].length) {
    ctx.beginPath();
    ctx.fillStyle = PALETTE[parseInt(sprite[DATA][i])];

    ctx.moveTo(
      sprite[DATA][i + 1] * ((sprite[FLIP] & FLIP_X) ? -1 : 1),
      sprite[DATA][i + 2] * ((sprite[FLIP] & FLIP_Y) ? -1 : 1),
    );

    i += 3;

    while (typeof sprite[DATA][i] === 'number') {
      ctx.lineTo(
        sprite[DATA][i] * ((sprite[FLIP] & FLIP_X) ? -1 : 1),
        sprite[DATA][i + 1] * ((sprite[FLIP] & FLIP_Y) ? -1 : 1),
      );
      i += 2;
    }

    ctx.fill();
  }
}

const runBehaviors = (sprite, dt, ctx) => {
  for (let i = 0; i < sprite[BEHAVIORS].length; i++) {
    sprite[BEHAVIORS][i](sprite, dt, ctx);
  }
};

const runSpriteTree = (ctx, sprite, dt, focusSprite) => {
  ctx.save();
  ctx.globalAlpha = Math.max(0, sprite[OPACITY]);

  if (focusSprite) {
    ctx.translate(
      sprite[POSITION][0] - focusSprite[POSITION][0] + (ctx.canvas.width / 2),
      sprite[POSITION][1] - focusSprite[POSITION][1] + (ctx.canvas.height / 2)
    );
  } else {
    ctx.translate(sprite[POSITION][0], sprite[POSITION][1]);
  }

  if (sprite[PRERENDER]) {
    ctx.rotate(sprite[ROTATION]);
    ctx.drawImage(
      sprite[PRERENDER],
      -(sprite[PRERENDER].width / 2),
      -(sprite[PRERENDER].height / 2)
    );
  } else {
    ctx.scale(sprite[SCALE], sprite[SCALE]);
    ctx.rotate(sprite[ROTATION]);
    drawSprite(ctx, sprite);

    for (let i = 0; i < sprite[CHILDREN].length; i++) {
      runSpriteTree(ctx, sprite[CHILDREN][i], dt);
    }
  }

  ctx.restore();

  runBehaviors(sprite, dt, ctx);
};

const prerenderCanvases = (polys, scale = 2.5) => polys.map((poly) => {
  const sprite = createSprite([0, 0], scale, 0, poly);
  prerenderSprite(sprite);
  return sprite[PRERENDER];
});