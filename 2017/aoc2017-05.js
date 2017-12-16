const assert = require('assert');

function part1(seq) {
  var pc = 0;
  var count = 0;
  while(pc < seq.length) {
    const new_pc = pc + seq[pc];
    count++;
    seq[pc]++;
    pc = new_pc;
  }
  return count;
}

assert.equal(part1([0,3,0,1,-3]), 5);

function part2(seq) {
  var pc = 0;
  var count = 0;
  while(pc < seq.length) {
    const new_pc = pc + seq[pc];
    count++;
    seq[pc] += seq[pc] > 2 ? -1 : 1;
    pc = new_pc;
  }
  return count;
}
assert.equal(part2([0,3,0,1,-3]), 10);

assert.equal(p1c([0,3,0,1,-3]), 5);
assert.equal(p2c([0,3,0,1,-3]), 10);
var data = '';
process.stdin.on('data', chunk => data += chunk);
process.stdin.on('end', () => {
  console.log(part1(data.trim().split('\n').map(Number)));
  console.log(part2(data.trim().split('\n').map(Number)));
});
