const assert = require('assert');
const process = require('process');

const conditions = { 
  '>': (a,b) => a > b,
  '<': (a,b) => a < b,
  '>=': (a,b) => a >= b,
  '<=': (a,b) => a <= b,
  '==': (a,b) => a == b,
  '!=': (a,b) => a != b
};

function execute(registers, cmd) {
  const [dst, dir, amount, _, src, op, value] = cmd.split(' ');
  const srcVal = registers[src]? registers[src]: 0;
  if(conditions[op](srcVal, value)) {
    if(!registers[dst]) {
      registers[dst] = 0;
    }
    const n = Number(amount);
    registers[dst] += dir == 'inc' ? n : -n;

    registers['>'] = registers['>']? registers['>']:0;
    registers['>'] = registers[dst] > registers['>'] ? registers[dst]: registers['>'];
  }

  return registers;
}


const registers = {};
const cmds = [
 'b inc 5 if a > 1',
 'a inc 1 if b < 5',
 'c dec -10 if a >= 1',
 'c inc -20 if c == 10'];

assert.deepEqual(cmds.reduce(execute, {}), { a: 1, c: -10, '>': 10 });


var data = '';
process.stdin.on('data', chunk => data += chunk);
process.stdin.on('end', () => {
  const registers = data.trim().split('\n').reduce(execute, {});
  console.log(Object.keys(registers).filter(r => r != '>').reduce((a, e) => registers[e] > a ? registers[e] : a, 0));
  console.log(registers['>']);
});

