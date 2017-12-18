const assert = require('assert');

const number = /^-?[0-9]+$/;

const queue = [[],[]];

let waiter = undefined;

let singleProcess = false;
function value(registers, val) {
  return number.test(val) ? Number(val) : registers[val];
}


function snd(val) {
  return function(registers) {
    const other = singleProcess? 0: (registers.p?0:1);
    queue[other].push(value(registers, val));
    return 1;
  }
}

function set(reg, val) {
  return function(registers) {
    registers[reg] = value(registers, val);
    return 1;
  }
}

function add(reg, val) {
  return function(registers) {
    registers[reg] += value(registers, val);
    return 1;
  }
}

function mul(reg, val) {
  return function(registers) {
    registers[reg] *= value(registers, val);
    return 1;
  }
}

function mod(reg, val) {
  return function(registers) {
    registers[reg] = registers[reg] % value(registers, val);
    return 1;
  }
}

function rcv(reg) {
  return function(registers) {
    if(singleProcess) {
      queue[0].shift();
      return 1;
    }
    else if(queue[registers.p].length > 0) {
      registers[reg] = queue[registers.p].shift();
      return 1;
    }
    else if(waiter == undefined) {
      return Number.MAX_SAFE_INTEGER;
    }
    else {
      return Number.MAX_SAFE_INTEGER - 1;  // deadlock
    }
  }
}

function jgz(val, offset) {
  return function(registers) {
    return value(registers, val) > 0 ? Number(offset) : 1;
  }
}

const instructions = {
  'snd': snd,
  'set': set,
  'add': add,
  'mul': mul,
  'mod': mod,
  'rcv': rcv,
  'jgz': jgz
}

function compile(registers, instr) {
  const [cmd, a, b]  = instr.split(' ');
  return instructions[cmd](a, b);
}

function firstNonZeroRcv(input) {
  singleProcess = true;
  const registers = { p: 0 };
  const prg = input.split('\n').map(e => e.trim());
  const compiled = prg.map(e => compile(registers, e));
  let pc = 0;
  while(pc >= 0 && pc < prg.length) {
    const q0 = queue[0][0];
    pc += compiled[pc](registers);
    if(q0 != undefined && queue[0][0] == undefined) {
      return q0;
    }
  }
}

const testInput = 
`set a 1
add a 2
mul a a
mod a 5
snd a
set a 0
rcv a
jgz a -1
set a 1
jgz a -2`;


assert.equal(firstNonZeroRcv(testInput), 4);

var data = '';
process.stdin.on('data', chunk => data += chunk);
process.stdin.on('end', () => {
  console.log(firstNonZeroRcv(data.trim()));
});
