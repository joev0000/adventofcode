const assert = require('assert');
const process = require('process');

function parse(it, depth=0) {
  let score = depth;
  let garbage = 0;
  let next = it.next();
  while(!next.done) {
    const n = next.value;
    if(n == '{') {
      depth++;
    } else if(n == '}') {
      score += depth;
      depth--;
    } else if(n == '<') {
      garbage += drainGarbage(it);
    }
    next = it.next();
  }
  return [score, garbage];
}

function drainGarbage(it) {
  let done = false;
  let count = 0;
  while(!done) {
    const next = it.next().value;
    if(next == '>') {
      done = true;
    } else if(next == '!') {
      it.next();
    } else {
      count++;
    }
  }
  return count;
}


function score(s) {
  const it = s.split('')[Symbol.iterator]();
  return parse(it);
}


assert.equal(score('{}')[0], 1);
assert.equal(score('{{{}}}')[0], 6);
assert.equal(score('{{},{}}')[0], 5);
assert.equal(score('{{{},{},{{}}}}')[0], 16);
assert.equal(score('{<{},{},{{}}>}')[0], 1);
assert.equal(score('{<a>,<a>,<a>,<a>}')[0], 1);
assert.equal(score('{{<ab>},{<ab>},{<ab>},{<ab>}}')[0], 9);
assert.equal(score('{{<!!>},{<!!>},{<!!>},{<!!>}}')[0], 9);
assert.equal(score('{{<a!>},{<a!>},{<a!>},{<ab>}}')[0], 3);

assert.equal(drainGarbage('>'.split('')[Symbol.iterator]()), 0);
assert.equal(drainGarbage('random characters>'.split('')[Symbol.iterator]()), 17);
assert.equal(drainGarbage('<<<>'.split('')[Symbol.iterator]()), 3);
assert.equal(drainGarbage('{!>}>'.split('')[Symbol.iterator]()), 2);
assert.equal(drainGarbage('!!>'.split('')[Symbol.iterator]()), 0);
assert.equal(drainGarbage('!!!>>'.split('')[Symbol.iterator]()), 0);
assert.equal(drainGarbage('{o"i!a,<{i<a>'.split('')[Symbol.iterator]()), 10);

var data = '';
process.stdin.on('data', chunk => data += chunk);
process.stdin.on('end', () => {
  process.stdout.write(score(data.trim()) + '\n');
});

