const assert = require('assert');

function day17p1(input) {
  function step(state, input) {
    const buffer = state.buffer;
    let pos = (((state.pos + input) % buffer.length) + 1);
    buffer.splice(pos, 0, state.next);

    return { buffer, next: state.next + 1, pos };
  }

  let state = {buffer: [0], next: 1, pos: 0};
  for(let i = 0; i < 2017; i++) {
    state = step(state, input);
  }
  return state.buffer[(state.pos + 1) % state.buffer.length];
}

function day17p2(input, iterations) {
  let pos = 0;
  let a1 = undefined;
  for(let i = 0; i < iterations; i++) {
    pos = ((pos + input) % (i + 1)) + 1;
    if(pos == 1) {
      a1 = i + 1;
    }
  }
  return a1;
}

assert.equal(day17p1(3), 638);

const input = 337;
console.log(day17p1(input));
console.log(day17p2(input, 50000000));
