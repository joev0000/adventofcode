const assert = require('assert');
const process = require('process');
const iter = require('./iter');

function parse(s) {
  return s.split('\n').map(e => /[0-9]+ <-> ([0-9, ]+)/.exec(e)[1].split(',').map(e => e.trim()).map(Number))
}

function nodesInNet(net, visited, start) {
  function peers(node) {
    visited[node] = true;
    return [node].concat(iter.FI(net[node]).filter(n => !visited[n]).flatMap(peers).toArray());
  }

  return peers(start);
}

function groups(net) {
  const visited = [];
  for(let i = 0; i < net.length; i++) {
    visited.push(false);
  }

  function firstUnvisited() {
    for(let i = 0; i < visited.length; i++) {
      if(!visited[i]) {
        return i;
      }
    }
    return -1;
  }
  const groups = [];
  let unvisited = firstUnvisited();
  while(unvisited >= 0) {
    groups.push(nodesInNet(net, visited, unvisited));
    unvisited = firstUnvisited();
  }
  return groups;
}

var data = '';
process.stdin.on('data', chunk => data += chunk);
process.stdin.on('end', () => {
  console.log(groups(parse(data.trim()))[0].length);
  console.log(groups(parse(data.trim())).length);
  console.log(groups(parse(data.trim())));
  
});
