const assert = require('assert');
function xy2i(x, y) {
  if(y == undefined) {
    y = x.y;
    x = x.x;
  }
  x = x < 0 ? -2*x-1 : 2*x;
  y = y < 0 ? -2*y-1 : 2*y;

  return (x+y)*(x+y+1)/2 + y;
}
function i2xy(i) {
  const xy = Math.floor((Math.sqrt(8*i+1) - 1) / 2);
  const base = xy*(xy+1)/2;
  const yy = i - base;
  const xx = xy - yy;

  const x = xx%2 ? (-1-xx)/2 : xx/2;
  const y = yy%2 ? (-1-yy)/2 : yy/2;

  return { x, y };
}

function set(a, x, y, v) {
  a[xy2i(x, y)] = v;
}

function get(a, x, y) {
  return a[xy2i(x, y)];
}

const testData = `
..#
#..
...
`.trim();

function parse(data) {
  const a = [];
  const lines = data.trim().split('\n');
  const xoff = (lines.length-1)/2;
  const yoff = (lines[0].length-1)/2;
  for(let i = 0; i < lines.length; i++) {
    const cells = lines[i].split('');
    for(let j = 0; j < cells.length; j++) {
      set(a, j-xoff, yoff-i, cells[j]);
    }
  }
  const height = lines.length;
  const width = lines[0].length;
  return {a, x: 0, y: 0, dir: 'up', infections: 0 }
}

const left = {
  'up': 'left',
  'left': 'down',
  'down': 'right',
  'right': 'up'
}

const right = {
  'up': 'right',
  'right': 'down',
  'down': 'left',
  'left': 'up'
}

const move = {
  'up': {x:0, y:1},
  'down': {x:0, y:-1},
  'left': {x:-1,y:0},
  'right': {x:1,y:0}
}

function step1(state) {
  let { a, x, y, dir, infections } = state;
  let v = get(a,x,y);
  v = v == undefined ? '.':v;
  const infected = v == '#';
  dir = infected ? right[dir] : left[dir];
  set(a, x, y, infected?'.':'#');
  return { a, x: x+move[dir].x, y: y+move[dir].y, dir, infections: infected?infections:infections+1 };
}

function step2(state) {
  let { a, x, y, dir, infections } = state;
  let v = get(a,x,y);
  v = v == undefined ? '.' : v;

  if(v == '.') {
    dir = left[dir];
    set(a,x,y,'W');
  }
  else if(v == 'W') {
    infections++;
    set(a,x,y,'#');
  }
  else if(v == '#') {
    dir = right[dir];
    set(a,x,y,'F');
  }
  else if(v == 'F') {
    dir = right[right[dir]];
    set(a,x,y,'.');
  }

  return { a, x: x+move[dir].x, y: y+move[dir].y, dir, infections };
}

function applyN(fn, initial, times) {
  let data = initial;
  for(; times > 0; times--) {
    data = fn(data);
  }
  return data;
}

assert.equal(applyN(step1, parse(testData), 7).infections, 5);
assert.equal(applyN(step1, parse(testData), 70).infections, 41);
assert.equal(applyN(step1, parse(testData), 10000).infections, 5587);
assert.equal(applyN(step2, parse(testData), 100).infections, 26);
assert.equal(applyN(step2, parse(testData), 10000000).infections, 2511944);
let data = '';
process.stdin.on('data', chunk => data += chunk);
process.stdin.on('end', () => {
  console.log(applyN(step1, parse(data), 10000).infections);
  console.log(applyN(step2, parse(data), 10000000).infections);
});
