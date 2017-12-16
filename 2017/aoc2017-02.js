const assert = require('assert');
const process = require('process');

function calculateChecksum(rows) {
  return rows.map((row) => {
    const m = row.reduce((a, e) => {
      return {
        min: e < a.min ? e : a.min,
        max: e > a.max ? e : a.max
      }
    }, {min: Number.MAX_SAFE_INTEGER, max: Number.MIN_SAFE_INTEGER});
    return m.max - m.min;
  }).
    reduce((a, e) => a + e);
}

function sumDivisible(rows) {
  function findDivisible(row) {
    for(let i = 0; i < row.length - 1; i++) {
      for(let j = i+1; j < row.length; j++) {
        if(row[i] % row[j] == 0) return row[i] / row[j];
        if(row[j] % row[i] == 0) return row[j] / row[i];
      }
    }
  }
  return rows.map(findDivisible).reduce((a, e) => a + e);
}

assert.equal(calculateChecksum([[5,1,9,5],[7,5,3],[2,4,6,8]]), 18);
assert.equal(sumDivisible(
  [[5,9,2,8],
   [9,4,7,3],
   [3,8,6,5]]), 9);

var data = '';
process.stdin.on('data', (chunk) => data += chunk );
process.stdin.on('end', () => {
  const input = data.trim().split('\n').filter(r => r.length > 0).map(r => r.split('\t').map(Number));
  process.stdout.write(calculateChecksum(input) + '\n' + sumDivisible(input) + '\n');
});
