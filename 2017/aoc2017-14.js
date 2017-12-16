const hash = require('./util').hash;
const iter = require('./iter');
const assert = require('assert');

const bits = {
  '0': [ 0, 0, 0, 0],
  '1': [ 0, 0, 0,-1],
  '2': [ 0, 0,-1, 0],
  '3': [ 0, 0,-1,-1],
  '4': [ 0,-1, 0, 0],
  '5': [ 0,-1, 0,-1],
  '6': [ 0,-1,-1, 0],
  '7': [ 0,-1,-1,-1],
  '8': [-1, 0, 0, 0],
  '9': [-1, 0, 0,-1],
  'a': [-1, 0,-1, 0],
  'b': [-1, 0,-1,-1],
  'c': [-1,-1, 0, 0],
  'd': [-1,-1, 0,-1],
  'e': [-1,-1,-1, 0],
  'f': [-1,-1,-1,-1]
};

function generate(input) {
  return iter.FI(iter.generator.range(0,128)).map(n => input + '-' + n).map(hash).flatMap(Array.from).flatMap(e => bits[e]).toArray();
}

function countUsed(input) {
  return input.reduce((a,e) => a - e, 0);
}

function countGroups(input) {
  function infect(i,j,group) {
    input[i*128+j] = group;
    if(j != 0 && input[i*128+j-1] == -1) { // check left
      infect(i, j-1, group);
    }
    if(j != 127 && input[i*128+j+1] == -1) { // check right
      infect(i, j+1, group);
    }
    if(i != 0 && input[(i-1)*128+j] == -1) { // check up
      infect(i-1, j, group);
    }
    if(i != 127 && input[(i+1)*128+j] == -1) { // check down
      infect(i+1,j,group);
    }
  }
  let group = 0;
  for(let i = 0; i < 128; i++) {
    for(let j = 0; j < 128; j++) {
      if(input[i*128+j] == -1) {
        group++;
        infect(i,j,group);
      }
    }
  }

  return group;
}

assert.equal(countUsed(generate('flqrgnkx')), 8108);
assert.equal(countGroups(generate('flqrgnkx')), 1242);

const input = 'vbqugkhl';
console.log(countUsed(generate(input)));
console.log(countGroups(generate(input)));
