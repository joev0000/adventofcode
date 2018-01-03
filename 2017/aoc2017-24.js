const iter = require('./iter');

const testData = `
0/2
2/2
2/3
3/4
3/5
0/1
10/1
9/10`.trim();

function parse(data) {
  return data.
    trim().
    split('\n').
    map(e => e.trim().split('/').map(Number));
}

function partition(seq, predicate) {
  return seq.reduce((a,e) => {
    a[predicate(e)?0:1].push(e);
    return a;
  }, [[],[]]);
}

function buildTree(components, pins=0) {
  const [roots, rest] = partition(components, e => e[0] == pins || e[1] == pins);
  return roots.map(e => {
    return {
      component: e,
      children: buildTree(rest, e[0] == pins? e[1]: e[0])
    }
  });
}

function bridges(tree) {
console.log(`tree is ${tree}`);
/*
  return tree.map(e => {
    return [e.component.join('/')].concat(bridges(e.children));
  });
  */
  return Array.from(iter.FI(tree).flatMap(e => {
    return [e.component.join('/')].concat(bridges(e.children));
  }));
}


// component: [a,b]
// children: [...]

console.log(Array.from(bridges(buildTree(parse(testData)))));
