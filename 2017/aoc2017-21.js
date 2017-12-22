const assert = require('assert');
const start = '.#...####';

function flatten(seq) {
  return seq.reduce((a,e) => {e.forEach(e2 => a.push(e2)); return a;}, []);
}

const permutations2x2 = [
  [0, 1, 2, 3],
  [2, 0, 3, 1],
  [3, 2, 1, 0],
  [1, 3, 0, 2],
  [2, 3, 0, 1],
  [3, 1, 2, 0],
  [1, 0, 3, 2],
  [0, 2, 1, 3]
];


const permutations3x3 = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8],
  [6, 3, 0, 7, 4, 1, 8, 5, 2],
  [8, 7, 6, 5, 4, 3, 2, 1, 0],
  [2, 5, 8, 1, 4, 7, 0, 3, 6],
  [6, 7, 8, 3, 4, 5, 0, 1, 2],
  [8, 5, 2, 7, 4, 1, 6, 3, 0],
  [2, 1, 0, 5, 4, 3, 8, 7, 6],
  [0, 3, 6, 1, 4, 7, 2, 5, 8]
];

function parse(data) {
  return data.trim().split('\n').reduce((a, e) => {
    const [i,o] = e.split(' => ');
    const perms = i.length == 5 ? permutations2x2 : permutations3x3;
    const r = i.split('').filter(c => c != '/');
    const out = o.split('').filter(c => c != '/').join('');
    a[r.join('')] = out;
    return a;
  }, {});
}

function lookup(rules, image) {
  const perms = image.length == 4 ? permutations2x2: permutations3x3;

  for(let i = 0; i < perms.length; i++) {
    const rule = perms[i].map(i => image[i]).join('');
    if(rules[rule]) {
      return rules[rule];
    }
  }
}

function apply(rules, image) {
  const length = image.length;
  if(length == 4 || length == 9) {
    return lookup(rules, image);
  }

  const sideLength = Math.sqrt(length);

  const newImage = [];

  if(length % 2 == 0) {
    const newSideLength = sideLength / 2 * 3;
    for(let i = 0; i < sideLength/2; i++) {
      const firstRow = i * 2 * sideLength;
      const secondRow = firstRow + sideLength; // == (i*2+1)*sideLength;
      const newFirstRow = i * 3 * newSideLength;
      const newSecondRow = newFirstRow + newSideLength;
      const newThirdRow = newSecondRow + newSideLength;
      for(let j = 0; j < sideLength/2; j++) {
        const j2 = j * 2;
        const j3 = j * 3;
        const sub = [
          image[firstRow + j2], image[firstRow + j2 + 1],
          image[secondRow + j2], image[secondRow + j2 + 1]
        ].join('');

        const newSub = lookup(rules, sub);

        newImage[newFirstRow + j3] = newSub[0];
        newImage[newFirstRow + j3 + 1] = newSub[1];
        newImage[newFirstRow + j3 + 2] = newSub[2];
        newImage[newSecondRow + j3] = newSub[3];
        newImage[newSecondRow + j3 + 1] = newSub[4];
        newImage[newSecondRow + j3 + 2] = newSub[5];
        newImage[newThirdRow + j3] = newSub[6];
        newImage[newThirdRow + j3 + 1] = newSub[7];
        newImage[newThirdRow + j3 + 2] = newSub[8];
      }
    }
  }
  else {
    const newSideLength = sideLength / 3 * 4;
    for(let i = 0; i < sideLength/3; i++) {
      const firstRow = i * 3 * sideLength;
      const secondRow = firstRow + sideLength;
      const thirdRow = secondRow + sideLength;
      const newFirstRow = i * 4 * newSideLength;
      const newSecondRow = newFirstRow + newSideLength;
      const newThirdRow = newSecondRow + newSideLength;
      const newFourthRow = newThirdRow + newSideLength;
      for(let j = 0; j < sideLength/3; j++) {
        const j3 = j * 3;
        const j4 = j * 4;
        const sub = [
          image[firstRow + j3], image[firstRow + j3 + 1], image[firstRow + j3 +2],
          image[secondRow + j3], image[secondRow + j3 + 1], image[secondRow + j3 +2],
          image[thirdRow + j3], image[thirdRow + j3 + 1], image[thirdRow + j3 +2]
        ].join('');
        const newSub = lookup(rules, sub);;

        newImage[newFirstRow + j4] = newSub[0];
        newImage[newFirstRow + j4 + 1] = newSub[1];
        newImage[newFirstRow + j4 + 2] = newSub[2];
        newImage[newFirstRow + j4 + 3] = newSub[3];
        newImage[newSecondRow + j4] = newSub[4];
        newImage[newSecondRow + j4 + 1] = newSub[5];
        newImage[newSecondRow + j4 + 2] = newSub[6];
        newImage[newSecondRow + j4 + 3] = newSub[7];
        newImage[newThirdRow + j4] = newSub[8];
        newImage[newThirdRow + j4 + 1] = newSub[9];
        newImage[newThirdRow + j4 + 2] = newSub[10];
        newImage[newThirdRow + j4 + 3] = newSub[11];
        newImage[newFourthRow + j4] = newSub[12];
        newImage[newFourthRow + j4 + 1] = newSub[13];
        newImage[newFourthRow + j4 + 2] = newSub[14];
        newImage[newFourthRow + j4 + 3] = newSub[15];
      }
    }
  }
  return newImage.join('');
}


function iterate(rules, image, times) {
  for(let i = 0; i < times; i++) {
    image = apply(rules, image);
  }
  return image;
}


const testData = `
../.# => ##./#../...
.#./..#/### => #..#/..../..../#..#
`.trim();

const testRules = parse(testData);
assert.equal(iterate(testRules, start, 2).split('').reduce((a, e) => e == '#'? a + 1: a, 0), 12);

let data = '';
process.stdin.on('data', chunk => data += chunk);
process.stdin.on('end', () => {
  const rules = parse(data.trim());
  console.log(iterate(rules, start, 5).split('').reduce((a,e) => e == '#'? a + 1: a, 0));
  console.log(iterate(rules, start, 18).split('').reduce((a,e) => e == '#'? a + 1: a, 0));
});

