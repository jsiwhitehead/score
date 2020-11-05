const mod = (a, n) => ((a % n) + n) % n;
const moddist = (a, b, n) => Math.min(mod(a - b, n), mod(b - a, n));

const draw = SVG().addTo('body').size('100%', '100%').css({ display: 'block' });

// const colors = ['#eee', '#ccc', '#aaa', '#888'];
const colors = ['#e1f5fe', '#b3e5fc', '#4fc3f7', '#0288d1'];
// const colors = ['yellow', 'orange', 'red', 'darkred'];

const width = 6;

const drawBar = (num, key, notes) => {
  const x = num % width;
  const y = Math.floor(num / width);
  const baseX = 40 + x * 160;
  const baseY = 20 + y * 200;
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
          .move(20, baseY + 200 + pos * 5)
          .fill(colors[s - 1]);
      }
    }
  }
  draw
    .rect(1, 140)
    .move(baseX, baseY + 5)
    .fill(colors[3]);
  for (const [i, n] of notes.entries()) {
    const pos = 28 - n;
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

const pi6 = Math.PI / 6;
const getRotationKey = (fifths) => {
  const rotations = Array.from({ length: 12 }).map((_, i) => {
    const bits = fifths.reduce(
      (res, n) => ({ ...res, [mod(n + i, 12)]: true }),
      {}
    );
    return parseInt(
      Array.from({ length: 12 })
        .map((_, i) => (bits[i] ? 1 : 0))
        .reverse()
        .join(''),
      2
    );
  });
  const index = rotations.findIndex((r) => r === Math.min(...rotations));
  if (rotations[index] < 2) return -index - 3;
  if (rotations[index] < 8) return -index - 2;
  if (rotations[index] < 32) return -index - 1;
  if (rotations[index] < 128) return -index;
  return false;
};
const getKeyBase = (fifths) => {
  const full = getRotationKey(fifths);
  if (full !== false) return full;
  for (const f of fifths) {
    const partial = getRotationKey(fifths.filter((x) => x !== f));
    if (partial !== false) return partial;
  }
  return (
    Math.round(
      Math.atan2(
        fifths.reduce((res, s) => res + Math.sin(s * pi6), 0),
        fifths.reduce((res, s) => res + Math.cos(s * pi6), 0)
      ) / pi6
    ) - 3
  );
};

const getKeyAndNotes = (notes) => {
  const fifths = Object.keys(
    notes
      .filter((n) => typeof n === 'number')
      .reduce((res, n) => ({ ...res, [mod(n * 7, 12)]: true }), {})
  ).map((k) => parseInt(k, 10));
  const base = mod(getKeyBase(fifths) * 7, 12) - 12;
  const key = { 0: true, 2: true, 3: true, 6: true };
  const scaleNotes = notes
    .map((n) => parseInt(n, 10))
    .map((n) => {
      const aboveBase = n - base;
      const octave = Math.floor(aboveBase / 12);
      const note = mod(aboveBase, 12);
      const scaleNote = note * 0.5 + (note > 6 ? 0.5 : 0);
      if (scaleNote === 0) delete key[0];
      if (scaleNote === 3) delete key[2];
      return octave * 7 + scaleNote;
    });
  return {
    notes: scaleNotes,
    key: Object.keys(key).map((k) => parseInt(k)),
    base,
  };
};

const updateKey = (base, key) => {
  if (!base) return key.map((k) => [k, 2]);
  let result = base.filter((x) => key.includes(x[0]));
  for (const k of key) {
    if (!result.some((x) => x[0] === k)) {
      for (const x of result) {
        if (moddist(k, x[0], 7) === 1) x[1] = Math.max(x[1] - 2, 0);
      }
      result = [...result, [k, 0]];
    }
  }
  for (const k of result) {
    k[1] = Math.min(
      k[1] + (result.some((x) => moddist(x[0], k[0], 7) === 1) ? 1 : 2),
      4
    );
  }
  return result;
};

const lines = [
  [10, 17, 26, 24, 26, 22, 26, 22],
  [10, 17, 26, 24, 26, 22, 26, 22],
  [10, 19, 27, 26, 27, 19, 27, 19],
  [10, 19, 27, 26, 27, 19, 27, 19],
  [10, 21, 27, 26, 27, 21, 27, 21],
  [10, 21, 27, 26, 27, 21, 27, 21],
  [10, 17, 26, 24, 26, 22, 26, 22],
  [10, 17, 26, 24, 26, 22, 26, 21],

  [10, 17, 26, 24, 26, 22, 21, 22],
  [19, 22, 21, 22, 14, 17, 16, 14],
  [16, 22, 24, 22, 24, 22, 24, 22],
  [16, 22, 24, 22, 24, 22, 24, 22],
  [21, 24, 29, 28, 29, 24, 22, 24],
  [21, 24, 22, 24, 17, 21, 19, 17],
  [7, 14, 22, 21, 22, 14, 22, 14],
  [7, 14, 22, 21, 22, 14, 22, 14],

  [7, 16, 17, 19, 17, 16, 14, 12],
  [22, 21, 19, 29, 28, 26, 24, 22],
  [21, 19, 17, 29, 24, 29, 21, 24],
  [17, 19, 21, 24, 22, 21, 19, 17],
  ['23', 17, 20, 19, 20, 17, '23', 17, 26],
  [26, 17, 20, 19, 20, 17, 26, 17],
  [15, 19, 24, 26, 27, 24, 19, 17],
  [15, 19, 24, 26, 27, 24, 21, 19],

  ['18', 21, '18', 21, 24, 21, 24, 21, 27],
  ['18', 21, '18', 21, 24, 21, 24, 21, 27],
  [22, 21, 19, 22, 21, 22, 24, 21],
  [22, 21, 19, 17, 15, 14, 12, 10],
  [9, 15, 17, 15, 17, 15, 17, 15],
  [9, 15, 17, 15, 17, 15, 17, 15],
  [10, 14, 20, 19, 20, 14, 20, 14],
  [10, 14, 20, 19, 20, 14, 20, 14],

  [10, 15, 19, 17, 19, 15, 19, 15],
  [10, 15, 19, 17, 19, 15, 19, 15],
  [10, 21, 27, 26, 27, 21, 27, 21],
  [10, 21, 27, 26, 27, 21, 27, 21],
  [10, 22, 26, 24, 26, 22, 21, 19],
  [17, 15, 14, 12, 10, 9, 7, 5],
  [4, 12, 19, 21, 22, 19, 21, 22],
  [4, 12, 19, 21, 22, 19, 21, 22],

  [5, 12, 17, 19, 21, 17, 19, 21],
  [5, 12, 17, 19, 21, 17, 19, 21],
  [5, 12, 16, 19, 22, 28, 29],
  [12, 14, 15, 17, 19, 21, 22],
  [24, 21, 17, 19, 21, 22, 24, 26],
  [27, 24, 21, 22, 24, 26, 27, 29],
  ['30', 29, 28, 29, 29, 27, 26, 27],
  [27, 24, 21, 19, 17, 12, 14, 15],

  [5, 12, 17, 21, 24, 26, 27, 24],
  [26, 22, 17, 15, 14, 10, 12, 14],
  [5, 12, 16, 19, 22, 24, '25', 22],
  [28, 26, 24, '25', '25', 24, '23', 24, 22],
  [24, 22, 21, 22, 22, 19, 16, 14],
  [12, 16, 19, 22, 24, 28, 29, 28],
  [29, 24, 21, 19, 21, 24, 17, 21],
  [12, 17, 16, 14, 12, 10, 9, 7],

  [5, 27, 26, 24, 22, 21, 19],
  [17, 27, 26, 24, 22, 21, 19, 17],
  [16, 26, 24, 22, 21, 19, 17, 16],
  [14, 24, 22, 21, 19, 17, 16, 14],
  [12, 22, 21, 19, 21, 24, 17, 24],
  [19, 24, 21, 24, 22, 24, 19, 24],
  [21, 24, 17, 24, 22, 24, 19, 24],
  [21, 24, 17, 24, 22, 24, 19, 24],

  [21, 24, 17, 24, 19, 24, 21, 24],
  [22, 24, 24, 24, 26, 24, 17, 24],
  [24, 24, 26, 24, 27, 24, 17, 24],
  [26, 24, 27, 24, 29, 24, 26, 24],
  [27, 24, 26, 24, 27, 24, 24, 24],
  [26, 24, 24, 24, 26, 24, 22, 24],
  [24, 24, 22, 24, 24, 24, 21, 24],
  [22, 24, 21, 24, 22, 24, 19, 24],

  [21, 24, 17, 19, '20', 17, 21, 17],
  [22, 17, '23', 17, 24, 17, '25', 17],
  [26, 17, 27, 17, '28', 17, 29, 17],
  ['30', 17, 31, 17, '32', 17, 33, 17],
  [34, 26, 17, 26, 34, 26, 34, 26],
  [34, 26, 17, 26, 34, 26, 34, 26],
  [34, 24, 17, 24, 34, 24, 34, 24],
  [34, 24, 17, 24, 34, 24, 34, 24],

  [33, 27, 17, 27, 33, 27, 33, 27],
  [33, 27, 17, 27, 33, 27, 33, 27],
  [10, 22, 26, 34],
];

let prevBase;
let baseKey;
let prevOffset = 0;
for (const [i, l] of lines.entries()) {
  const { key, notes, base } = getKeyAndNotes(l);
  const diff = prevBase === undefined ? 0 : base - prevBase;
  const offset =
    prevOffset + (diff < 0 ? -1 : 1) * Math.ceil(Math.abs(diff / 2));
  baseKey = updateKey(
    baseKey,
    key.map((k) => mod(k + offset, 7))
  );
  drawBar(
    i,
    baseKey,
    notes.slice(0, 8).map((n) => n + offset)
  );
  prevBase = base;
  prevOffset = offset;
}
