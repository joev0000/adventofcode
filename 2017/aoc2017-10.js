const assert = require('assert');
const iter = require('./iter');
const hash = require('./util').hash;

function reverse(a, start, length) {
  let copy = a.slice();
  let i = start;
  let j = start + length - 1;

  while(i < j) {
    let temp = copy[i % a.length];
    copy[i % a.length] = copy[j % a.length];
    copy[j % a.length] = temp;
    i++;
    j--;
  }
  return copy;
}

function round(hashState, lengths) {
  return lengths.reduce((a,e) => {
    const r =  {
      array: reverse(a.array, a.currentPos, e),
      currentPos: (a.currentPos + a.skipSize + e) % a.array.length,
      skipSize: (a.skipSize + 1) % a.array.length
    }
    return r;
  }, hashState);
}

function oneRound(size, lengths) {
  const array = iter.FI(iter.generator.integers()).take(size).toArray();
  const hashState = { array: array, currentPos: 0, skipSize: 0}
  const r = round(hashState, lengths);
  return r.array[0] * r.array[1];
}

assert.deepEqual(oneRound(5, [3,4,1,5]), 12);

assert.equal(hash(''), 'a2582a3a0e66e6e86e3812dcb672a272');
assert.equal(hash('AoC 2017'), '33efeb34ea91902bb2f59c9920caa6cd');
assert.equal(hash('1,2,3'), '3efbe78a8d82f29979031a4aa0b16a9d');
assert.equal(hash('1,2,4'), '63960835bcdc130f0b66d7ff4f6a5a8e');

var data = '';
process.stdin.on('data', chunk => data += chunk);
process.stdin.on('end', () => {
  process.stdout.write(oneRound(256, data.trim().split(',').map(Number)) + '\n');
  process.stdout.write(hash(data.trim()) + '\n');
})
