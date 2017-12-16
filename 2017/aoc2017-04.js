const assert = require('assert');
const process = require('process');

function validate(s) {
  return s.split(' ').reduce((a, e) => {
    const result = a.result && !a.words[e];
    const words = Object.assign({}, a.words);
    words[e] = true;
    return {
      result: result,
      words: words
    }
  }, { words: {}, result: true }).result;
}

assert.equal(validate('aa bb cc dd ee'), true);
assert.equal(validate('aa bb cc dd aa'), false);
assert.equal(validate('aa bb cc dd aaa'), true);

function sortLetters(s) {
  return Array.from(s).sort().join('');
}

function count(fn) {
  return (a,e) => fn(e)?a+1:a;
}

var data = '';
process.stdin.on('data', chunk => data += chunk);
process.stdin.on('end', () => {
  process.stdout.write(data.trim().split('\n').reduce(count(validate), 0) + '\n');
  process.stdout.write(data.trim().split('\n').map(s => s.split(' ').map(sortLetters).join(' ')).reduce(count(validate), 0) + '\n');
});
