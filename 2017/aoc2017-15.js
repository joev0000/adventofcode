const assert = require('assert');
const iter = require('./iter');

function* generator(factor, value) {
  while(true) {
    const next = (value * factor) % 2147483647;
    yield next;
    value = next;
  }
}

function countMatches(it1, it2) {
  return it1.zip(it2).filter(e => (e[0] & 65535) == (e[1] & 65535)).reduce((a, e) => a + 1, 0);
}

//assert.equal(countMatches(iter.FI(generator(16807, 65)).take(40000000), iter.FI(generator(48271, 8921))), 588);
//assert.equal(countMatches(iter.FI(generator(16807, 65)).filter(e => (e & 3) == 0).take(5000000), iter.FI(generator(48271, 8921)).filter(e => (e & 7) == 0)), 309);

console.log(countMatches(iter.FI(generator(16807, 783)).filter(e => (e & 3) == 0).take(5000000), iter.FI(generator(48271, 325)).filter(e => (e & 7) == 0)));

