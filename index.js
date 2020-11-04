const mod = (a, n) => ((a % n) + n) % n;
const moddist = (a, b, n) => Math.min(mod(a - b, n), mod(b - a, n));

const draw = SVG().addTo('body').size('100%', '100%').css({ display: 'block' });

// const colors = ['#eee', '#ccc', '#aaa', '#888'];
const colors = ['#e1f5fe', '#b3e5fc', '#81d4fa', '#0288d1'];
// const colors = ['yellow', 'orange', 'red', 'darkred'];

const width = 6;

const drawBar = (num, key, notes) => {
  const x = num % width;
  const y = Math.floor(num / width);
  const baseX = 40 + x * 160;
  const baseY = 20 + y * 170;
  for (let i = 0; i < 4; i++) {
    for (const [k, s] of key) {
      const pos = 28 - (i * 7 + k);
      draw
        .rect(160, 5)
        .move(baseX, baseY + pos * 5)
        .fill(colors[s - 1]);
    }
  }
  if (x === width - 1) {
    for (let i = 0; i < 4; i++) {
      for (const [k, s] of key) {
        const pos = 28 - (i * 7 + k);
        draw
          .rect(20, 5)
          .move(20, baseY + 170 + pos * 5)
          .fill(colors[s - 1]);
      }
    }
  }
  draw
    .rect(1, 140)
    .move(baseX, baseY + 5)
    .fill(colors[3]);
  for (const [i, n] of notes.entries()) {
    const pos = 27 - n;
    if (mod(n, 1) === 0.5) {
      draw
        .rect(9, 5)
        .move(baseX + 5.5 + i * 20, baseY + 2.5 + pos * 5)
        .fill('black');
    } else {
      draw
        .circle(9)
        .move(baseX + 5.5 + i * 20, baseY + 0.5 + pos * 5)
        .fill('black');
    }
  }
};

const startKey = [0, 1, 3, 4];
const lines = [
  [4, 8, 13, 12, 13, 11, 13, 11],
  [4, 8, 13, 12, 13, 11, 13, 11],
  { key: [1] }, // [0, 3, 4]
  [4, 9, 14, 13, 14, 9, 14, 9],
  [4, 9, 14, 13, 14, 9, 14, 9],
  { key: [3] }, // [0, 4]
  [4, 10, 14, 13, 14, 10, 14, 10],
  [4, 10, 14, 13, 14, 10, 14, 10],
  { key: [1, 3] }, // [0, 1, 3, 4]
  [4, 8, 13, 12, 13, 11, 13, 11],
  { key: [3] }, // [0, 1, 4]
  [4, 8, 13, 12, 13, 11, 13, 10],
  [4, 8, 13, 12, 13, 11, 10, 11],
  { key: [0] }, // [1, 4]
  [9, 11, 10, 11, 6, 8, 7, 6],
  [7, 11, 12, 11, 12, 11, 12, 11],
  [7, 11, 12, 11, 12, 11, 12, 11],
  [10, 12, 15, 14, 15, 12, 11, 12],
  { key: [0] }, // [0, 1, 4]
  [10, 12, 11, 12, 8, 10, 9, 8],
  [2, 6, 11, 10, 11, 6, 11, 6],
  [2, 6, 11, 10, 11, 6, 11, 6],
  { key: [0, 5] }, // [1, 4, 5]
  [2, 7, 8, 9, 8, 7, 6, 5],
  { key: [5] }, // [1, 4]
  [11, 10, 9, 15, 14, 13, 12, 11],
  { key: [0, 5] }, // [0, 1, 4, 5]
  [10, 9, 8, 15, 12, 15, 10, 12],
  { key: [5] }, // [0, 1, 4]
  [8, 9, 10, 12, 11, 10, 9, 8],
  { key: [1, 3, 4, 6] }, // [0, 3, 6]
  [11.5, 8, 10, 9, 10, 8, 11.5, 8],
  { key: [6] }, // [0, 3]
  [13, 8, 10, 9, 10, 8, 13, 8],
  { key: [4] }, // [0, 3, 4]
  [7, 9, 12, 13, 14, 12, 9, 8],
  { key: [3] }, // [0, 4]
  [7, 9, 12, 13, 14, 12, 10, 9],
  { key: [1] }, // [0, 1, 4]
  [8.5, 10, 8.5, 10, 12, 10, 12, 10],
  [8.5, 10, 8.5, 10, 12, 10, 12, 10],
  [11, 10, 9, 11, 10, 11, 12, 10],
  { key: [1] }, // [0, 4]
  [11, 10, 9, 8, 7, 6, 5, 4],
  [3, 7, 8, 7, 8, 7, 8, 7],
  [3, 7, 8, 7, 8, 7, 8, 7],
  { key: [3, 4] }, // [0, 3]
  [4, 6, 10, 9, 10, 6, 10, 6],
  [4, 6, 10, 9, 10, 6, 10, 6],
  { key: [4, 6] }, // [0, 3, 4, 6]
  [4, 7, 9, 8, 9, 7, 9, 7],
  [4, 7, 9, 8, 9, 7, 9, 7],
];

let key = startKey.map((k) => [k, 1]);
let i = 0;
for (const l of lines) {
  if (!Array.isArray(l)) {
    for (const v of l.key) {
      if (key.find((x) => x[0] === v)) {
        key = key.filter((x) => x[0] !== v);
      } else {
        key = [...key, [v, 0]];
      }
    }
    for (const k of key) {
      for (const v of l.key) {
        if (key.find((x) => x[0] === v)) {
          k[1] = Math.max(k[1] - (moddist(v, k[0], 7) === 1 ? 2 : 0), 0);
        }
      }
    }
  } else {
    for (const k of key) {
      k[1] = Math.min(
        k[1] + (key.some((x) => moddist(x[0], k[0], 7) === 1) ? 1 : 2),
        4
      );
    }
    drawBar(i, key, l);
    i++;
  }
}
