const assert = require('assert');
const stdin = require('process').stdin;
const number = /^-?[0-9]+$/;

const process = [ ];

function value(registers, val) {
  return number.test(val) ? Number(val) : (registers[val] ? registers[val]: 0);
}

function snd(val) {
  return function(p) {
    const other = (process.length == 1) ? 0: (p.pid==1?0:1);
    process[other].queue.push(value(p.registers, val));
    if(process[other].state == 'waiting') {
      process[other].state = 'running';
    }
    p.pc++;
  }
}

function set(reg, val) {
  return function(p) {
    p.registers[reg] = value(p.registers, val);
    p.pc++;
  }
}

function add(reg, val) {
  return function(p) {
    p.registers[reg] += value(p.registers, val);
    p.pc++;
  }
}

function mul(reg, val) {
  return function(p) {
    p.registers[reg] *= value(p.registers, val);
    p.pc++;
  }
}

function mod(reg, val) {
  return function(p) {
    p.registers[reg] = p.registers[reg] % value(p.registers, val);
    p.pc++;
  }
}

function rcv(reg) {
  return function(p) {
    if(process.length == 1) {
      p.queue.shift();
      p.pc++;
    }
    else if(p.queue.length > 0) {
      p.registers[reg] = p.queue.shift();
      p.pc++;
    }
    else {
      p.state = 'waiting';
    }
  }
}

function jgz(val, offset) {
  return function(p) {
    p.pc += value(p.registers, val) > 0 ? value(p.registers, offset) : 1;
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

function ps(p) {
  function dump(p) {
    const r = Object.getOwnPropertyNames(p.registers).map(e => `${e}: ${p.registers[e]?p.registers[e]:0}`).join(', ');
    return `pid: ${p.pid}, pc: ${p.pc}, state: ${p.state}, queue: [${p.queue}], reg: { ${r} }`;
  }
  if(p) {
    return dump(p);
  }
  return process.map(dump).join('\n');
}


function compile(instr) {
  const [cmd, a, b]  = instr.split(' ');
  return instructions[cmd](a, b);
}

function firstNonZeroRcv(input) {
  process.length = 0;
  process.push({ state: 'running', pc: 0, registers: {}, queue: [] });
  const prg = input.split('\n').map(e => e.trim());
  const compiled = prg.map(compile);
  const p = process[0];
  let t = 0;
  while(p.state == 'running' && p.pc >= 0 && p.pc < prg.length) {
    const qEnd = p.queue.slice(-1)[0];
    const length = p.queue.length;
    compiled[p.pc](p);
    if(p.queue.length < length) {
      return qEnd;
    }
    t++;
  }
}

function p1SendCount(input) {
  process.length = 0;
  process.push({ state: 'running', pid: 0, pc: 0, registers: { p: 0 }, queue: [] });
  process.push({ state: 'running', pid: 1, pc: 0, registers: { p: 1 }, queue: [] });
  const prg = input.split('\n').map(e => e.trim());
  const compiled = prg.map(compile);
  let pid = 0;
  let t = 0;
  let p0qLength = 0;
  let p1send = 0;
  while(process.reduce((a, e) => a + (e.state == 'running')?1:0, 0) > 0) {
    while(process[pid].state == 'running' && process[pid].pc >= 0 && process[pid].pc < compiled.length) {
      p0qLength = process[0].queue.length;
      compiled[process[pid].pc](process[pid]);
      if(p0qLength < process[0].queue.length) {
        p1send++;
      }
      if(process[pid].pc < 0 || process[pid].pc >= compiled.length) {
        process[pid].state = 'terminated';
      }
      t++;
    }
    pid++;
    if(pid == process.length) {
      pid = 0;
    }
  }
  return p1send;
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

process.length = 0;
process.push({ state: 'running', pc: 0, registers: {}, queue: [] });
assert.equal(firstNonZeroRcv(testInput), 4);

var data = '';
stdin.on('data', chunk => data += chunk);
stdin.on('end', () => {
  console.log(firstNonZeroRcv(data.trim()));
  console.log(p1SendCount(data.trim()));
});
