const assert = require("assert");

function layer(n) {
  return Math.floor((Math.sqrt(n) + 1)/2)
}

function distance(n) {
  const l = layer(n);
  const mids = [0,1,2,3].map(q => Math.pow(2*l-1,2) + (2*q+1)*l - 1);
  return l + mids.reduce((a,e) => Math.abs(n - e) < a ? Math.abs(n - e) : a, Number.MAX_SAFE_INTEGER);
}

assert.equal(distance(1-1), 0);
assert.equal(distance(12-1), 3);
assert.equal(distance(23-1), 2);
assert.equal(distance(1024-1), 31);
console.log(distance(347991-1));

function x_prime(x) {
  if(x==0) { return 0; }
  return x>0? x*2 : (-x)*2-1;
}
function y_prime(y) {
  if(y==0) { return 0; }
  return y>0? y*2 : (-y)*2-1;
}

function getElement(matrix, x, y) {
  const x_p = x_prime(x);
  const y_p = y_prime(y);
  if(x_p >= matrix.length) {
    return 0;
  }
  if(y_p >= matrix[x_p].length) {
    return 0;
  }
  return matrix[x_p][y_p];
}

function putElement(matrix, x, y, value) {
  const x_p = x_prime(x);
  const y_p = y_prime(y);
  while(matrix.length < x_p + 1) {
    matrix.push([]);
  }
  const row = matrix[x_p];
  while(row.length < y_p + 1) {
    row.push(0);
  }
  matrix[x_p][y_p] = value;
}

var matrix = [];
putElement(matrix, 0, 0, 1);
var state = {
  x: 1,
  y: 0,
  x_dir: 1,
  y_dir: 0,
  value: 1
};

function next(matrix, state) {
  const x = state.x;
  const y = state.y;
  const v_mm = getElement(matrix, x-1,y-1);
  const v_zm = getElement(matrix, x,y-1);
  const v_pm = getElement(matrix, x+1,y-1);
  const v_mz = getElement(matrix, x-1,y);
  const v_pz = getElement(matrix, x+1,y);
  const v_mp = getElement(matrix, x-1,y+1);
  const v_zp = getElement(matrix, x,y+1);
  const v_pp = getElement(matrix, x+1,y+1);
  const value = v_mm + v_zm + v_pm + v_mz + v_pz + v_mp + v_zp + v_pp;

  let x_dir = state.x_dir;
  let y_dir = state.y_dir; 
  putElement(matrix, x, y, value);
  if(x_dir == 1 && v_zp == 0) {
    x_dir = 0;
    y_dir = 1;
  } else if(y_dir == 1 && v_mz == 0) {
    x_dir = -1;
    y_dir = 0;
  } else if(x_dir == -1 && v_zm == 0) {
    x_dir = 0;
    y_dir = -1;
  } else if(state.y_dir == -1 && v_pz == 0) {
    x_dir = 1;
    y_dir = 0;
  }
  return { x: x + x_dir, y: y + y_dir, x_dir, y_dir, value };
}

while(state.value < 347991) {
  state = next(matrix, state);
  console.log(state);
}
console.log(matrix)
