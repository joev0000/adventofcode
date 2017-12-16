const assert = require('assert');
const process = require('process');

function redistribute(banks, i) {
  let blocks = banks[i];
  banks[i] = 0;
  while(blocks-- > 0) {
    i++;
    if(i == banks.length) {
      i = 0;
    }
    banks[i]++;
  }
  return banks;
}

function maxIndex(seq) {
  return seq.reduce((a,e,i) => a = e > seq[a] ? i : a, 0);
}
assert.equal(maxIndex([0,2,7,0]), 2);
assert.equal(maxIndex([2,4,1,2]), 1);
assert.equal(maxIndex([3,1,2,3]), 0);

function run(banks) {
  let cycle = 0;
  let seen = {};

  while(!seen[banks.join(',')]) {
    seen[banks.join(',')] = cycle;
    redistribute(banks, maxIndex(banks));
    cycle++;
  }
  return { cycle, length: cycle - seen[banks.join(',')] }
}
assert.equal(run([0,2,7,0]).cycle, 5);
assert.equal(run([0,2,7,0]).length, 4);

var data = '';
process.stdin.on('data', chunk => data += chunk);
process.stdin.on('end', () => {
  const result = run(data.trim().split('\t').map(Number));
  process.stdout.write(result.cycle + '\n' + result.length + '\n');
});


