const iter = require('./iter');
const process = require('process');
const assert = require('assert');

function atZero(time, depth) {
  if(depth == 0) {
    return false;
  }
  if(depth == 1) {
    return true;
  }
  return (time % ((depth - 1) * 2)) == 0;
}

function parse(s) {
  function expand(a, length, value) {
    while(a.length < length) {
      a.push(value);
    }
    return a;
  }
  return s.trim().split('\n').reduce((a,e) => {
    const [_, depth, range] =  /([0-9]+): ([0-9]+)/.exec(e);
    a = expand(a, Number(depth), 0);
    a[Number(depth)] = Number(range);
    return a;
  }, []);
}

function severity(layers,delay=0) {
  return layers.reduce((a, e, i) => a + (atZero(delay+i, e) ? i * layers[i] : 0),delay);
}

function pass(layers, delay=0) {
  return layers.reduce((a, e, i) => a && !atZero(delay+i, e), true);
}

function safe(layers) {
  return iter.FI(iter.generator.integers()).takeWhile(n => !pass(layers, n)).toArray().slice(-1)[0] + 1;
}

const sample = parse('0: 3\n1: 2\n4: 4\n6: 4');
assert.equal(severity(sample), 24);
assert.equal(safe(sample), 10);

var data = '';
process.stdin.on('data', chunk => data += chunk);
process.stdin.on('end', () => {
  const layers = parse(data);
  console.log(severity(layers));
  console.log(safe(layers));
});

