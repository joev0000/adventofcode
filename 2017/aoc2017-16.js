const assert = require('assert');
const process = require('process');
const iter = require('./iter');
const rotate = require('./util').rotate;

function compile(ins) {
  if(ins[0] == 's') {
    const n = -Number(ins.slice(1));
    return a => rotate(a,n);
  }
  else if(ins[0] == 'x') {
    const [_, i, j] = /([0-9]+)\/([0-9]+)/.exec(ins.slice(1));
    return (a) => {
      const tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
      return a;
    };
  }
  else if(ins[0] == 'p') {
    const [_, i, j] = /([a-z]+)\/([a-z]+)/.exec(ins.slice(1));
    return a => a.map(e => e==i ? j : (e==j ? i : e));
  }
  else {
    throw new Error(`Unknown instruction ${ins}`);
  }
}

function dance(input, prg) {
  return prg.reduce((a, e) => e(a), Array.from(input)).join('');
}

assert.equal(dance('abcde', ['s1'].map(compile)), 'eabcd');
assert.equal(dance('eabcd', ['x3/4'].map(compile)), 'eabdc');
assert.equal(dance('eabdc', ['pe/b'].map(compile)), 'baedc');

assert.equal(dance('abcde', ['s1', 'x3/4', 'pe/b'].map(compile)), 'baedc');

var data = '';
process.stdin.on('data', chunk => data += chunk);
process.stdin.on('end', () => {
  const start = 'abcdefghijklmnop';
  const prg = data.trim().split(',').map(compile);
  console.log(dance(start, prg));
  var a = start;
  var cycle = -1;
  const positions = [];
  for(var i = 0; cycle < 0 && i < 1000000000; i++) {
    a = dance(a, prg);
    if(a == start) {
      cycle = i;
    }
    else {
      positions[i] = a;
    }
  }
  console.log(positions[1000000000 % (cycle+1) - 1]);
});
