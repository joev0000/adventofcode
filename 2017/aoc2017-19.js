const assert = require('assert');
//up:   -1,  0
//down:  1,  0
//left:  0, -1
//right: 0,  1
function findStart(diagram) {
  const firstRow = diagram[0];
  for(let i = 0; i < firstRow.length; i++) {
    if(firstRow[i] == '|') {
      return { pos: [0, i], dir: [1, 0], letters: []};
    }
  }
  const lastRow = diagram[diagram.length-1];
  for(let i = 0; i < lastRow.length; i++) {
    if(lastRow[i] == '|') {
      return { pos: [diagram.length-1, i], dir: [-1, 0], letters: []};
    }
  }

  for(let i = 0; i < diagram.length; i++) {
    if(diagram[i][0] == '-') {
      return { pos: [i, 0], dir: [0, 1]};
    }
    if(diagram[i][diagram[i].length-1] == '-') {
      return { pos: [i, diagram[i].length - 1], dir: [0, -1], letters: []};
    }
  }
}

function follow(diagram, state) {
  const pos = state.pos;
  const dir = state.dir;
  const letters = state.letters;

  const next = diagram[pos[0] + dir[0]][pos[1] + dir[1]];
  if(next == '|' || next == '-') {
    return { pos: [pos[0] + dir[0], pos[1] + dir[1]], dir, letters };
  }
  if(next == ' ') {
    return { pos: [pos[0] + dir[0], pos[1] + dir[1]], dir: [0, 0], letters };
  }
  if(next == '+') {
    if(dir[0] == 0) { // currently moving horizontally
      if(diagram[pos[0]-1][pos[1]+dir[1]] != ' ') {
        return { pos: [pos[0], pos[1]+dir[1]], dir: [-1, 0], letters }; //up
      }

      if(diagram[pos[0]+1][pos[1]+dir[1]] != ' ') {
        return { pos: [pos[0], pos[1]+dir[1]], dir: [1, 0], letters }; //down
      }
    }
    else { // currently moving vertically
      if(diagram[pos[0]+dir[0]][pos[1]+dir[1]-1] != ' ') {
        return { pos: [pos[0]+dir[0], pos[1]], dir: [0, -1], letters }; //left
      }

      if(diagram[pos[0]+dir[0]][pos[1]+1] != ' ') {
        return { pos: [pos[0]+dir[0], pos[1]], dir: [0, 1], letters }; //right
      }
    }
  }
  else {
    letters.push(next);
    return { pos: [pos[0] + dir[0], pos[1] + dir[1]], dir, letters };
  }

  console.log(`Fell off the bottom.  ${state.pos}, ${state.dir}`);
}



function parse(input) {
  return input.split('\n').map(e => Array.from(e));
}


const testData = 
`     |          
     |  +--+    
     A  |  C    
 F---|----E|--+ 
     |  |  |  D 
     +B-+  +--+ 
                `

let testDiagram = parse(testData);
let testState = findStart(testDiagram);
let steps = 0;
while(!(testState.dir[0] == 0 && testState.dir[1] == 0)) {
  testState = follow(testDiagram, testState);
  steps++;
}
assert.equal(testState.letters.join(''), 'ABCDEF');
assert.equal(steps, 38);

var data = '';
process.stdin.on('data', chunk => data+=chunk);
process.stdin.on('end', () => {
  const diagram = parse(data);
  let state = findStart(diagram);
  let steps = 0;
  while(!(state.dir[0] == 0 && state.dir[1] == 0)) {
    state = follow(diagram, state);
    steps++;
  }
  console.log(state.letters.join(''));
  console.log(steps);
});

