const assert = require('assert');

const dirIndex = {
  se: 0,
  ne: 1,
   n: 2,
  nw: 3,
  sw: 4,
   s: 5
};

function step(state, dir) {
  const d = dirIndex[dir];
  const steps = state.steps;

  if(steps[(d + 3) % 6] > 0) {
    steps[(d + 3) % 6]--;
  }
  else if(steps[(d + 2) % 6] > 0) {
    steps[(d + 1) % 6]++;
    steps[(d + 2) % 6]--;
  }
  else if(steps[(d - 2) % 6] > 0) {
    steps[(d - 1) % 6]++;
    steps[(d - 2) % 6]--;
  }
  else {
    steps[d]++;
  }

  const count = steps.reduce((a,e) => a + e, 0)
  
  return { steps, max: count > state.max ? count: state.max };
}

function steps(s) {
  const result = s.split(',').reduce(step, { steps: [0,0,0,0,0,0], max: 0});
  return {
    distance: result.steps.reduce((a,e) => a + e, 0),
    max: result.max
  }
}

assert.deepEqual(steps('ne,ne,ne'), { distance: 3, max: 3});
assert.deepEqual(steps('ne,ne,sw,sw'), { distance: 0, max: 2});
assert.deepEqual(steps('ne,ne,s,s'), { distance: 2, max: 2});
assert.deepEqual(steps('se,sw,se,sw,sw'), { distance: 3, max: 3});

var data = '';
process.stdin.on('data', chunk => data += chunk);
process.stdin.on('end', () => {
  console.log(steps(data.trim()));
});
