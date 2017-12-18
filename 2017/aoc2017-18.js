const assert = require('assert');

const number = /^-?[0-9]+$/;

function value(registers, val) {
  return number.test(val) ? Number(val) : registers[val];
}


function snd(val) {
  return function(registers) {
    registers['__snd__'] = value(registers, val);
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

function rcv(val) {
  return function(registers) {
    if(value(registers, val) != 0 && registers['__rcv__']) {
      return registers['__rcv__'](registers['__snd__']);
    }
    return 1;
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
  let result = undefined;
  const registers = {
    '__rcv__': v => { result = v; return 10000000; }
  }
  const prg = input.split('\n').map(e => e.trim());
  const compiled = prg.map(e => compile(registers, e));
  let pc = 0;
  while(pc >= 0 && pc < prg.length) {
    pc += compiled[pc](registers);
  }
  return result;
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
