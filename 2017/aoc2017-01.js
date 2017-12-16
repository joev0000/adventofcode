const assert = require('assert');
const rotate = require('./util').rotate;
const FI = require('./iter').FI;

function sumRotateMatch(s, offset) {
  const seq = Array.from(s).map(Number);
  return FI(seq).zip(FI(rotate(seq,offset))).reduce((a, e) => e[0] == e[1] ? a + e[0] : a, 0);
}

function advent1a(s) {
  return sumRotateMatch(s, 1);
}

assert.equal(advent1a('1122'), 3);
assert.equal(advent1a('1111'), 4);
assert.equal(advent1a('1234'), 0);
assert.equal(advent1a('91212129'), 9);

function advent1b(s) {
  return sumRotateMatch(s, s.length/2);
}

assert.equal(advent1b('1212'), 6);
assert.equal(advent1b('1221'), 0);
assert.equal(advent1b('123425'), 4);
assert.equal(advent1b('123123'), 12);
assert.equal(advent1b('12131415'), 4);

var data = '';
process.stdin.on('data', (chunk) => data += chunk);
process.stdin.on('end', () => {
  const trimmed = data.trim();
  process.stdout.write(advent1a(trimmed) + '\n' + advent1b(trimmed) + '\n');
});
