const assert = require('assert');
const process = require('process');

function parseLine(line) {
  const [towerAndWeight, childList] = line.split(' -> ');
  const [match, name, weight] = /([a-z]+) \(([0-9]+)\)/.exec(towerAndWeight);
  children = childList? childList.split(',').map(s => s.trim()) :[];
  return { name, weight: Number(weight), children };
}

function findRoot(seq) {
  const o = seq.reduce((a, e) => {
    a.names.push(e.name);
    e.children.map(c => a.children[c] = true);
    return a;
  }, { names: [], children: {} });

  return o.names.filter(n => !o.children[n])[0];
}

/*
 * { 'aaaa': { weight: 23, children: ['bbbb', 'cccc'] }
 */
function buildIndex(seq) {
  return seq.reduce((a, e) => {
    const o = {};
    o[e.name] = { weight: e.weight, children: e.children };
    return Object.assign({}, a, o);
  }, {});
}

function totalWeight(index, name) {
  return index[name].children.reduce((a,e) => a + totalWeight(index,e), 0) + index[name].weight;
}

/*
 * if(no children) return true;
 * if(all children have same value) return true;
 * figure out which child has a different weight- and what the difference is.
 */
function inconsistent(seq, extractor) {
  if(seq.length > 2) {
    const seq0 = extractor(seq[0]);
    const seq1 = extractor(seq[1]);
    const seq2 = extractor(seq[2]);
    const point = (seq0 == seq1 || seq0 == seq2) ? seq0 : seq1;
    const culprit = seq.filter(e => extractor(e) != point);
    if(culprit.length > 0) {
      return culprit[0];
    }
  } else if(seq.length == 2 && extractor(seq[0]) != extractor(seq[1])) {
    return seq[0];
  }
}

function calculateAdjustments(index, name,a = []) {
  //index[name].children.map(n => { console.log(n); calculateAdjustments(index, n)});
  
  const check =  inconsistent(index[name].children.map(n => { return {
    name: n, 
    childWeights: index[n].children.map(m  => index[m].weight),
    totalWeight: totalWeight(index, n)}}), n => n.totalWeight)
  if(check) {
    return a.concat(check).concat(calculateAdjustments(index, check.name, a));
  }
  return a;
}

var data = '';
process.stdin.on('data', chunk => data += chunk);
process.stdin.on('end', () => {
  const lines = data.trim().split('\n').map(parseLine);
  const index = buildIndex(lines);
  const root = findRoot(lines);
  console.log('root: ', root);
  console.log(calculateAdjustments(index, root));
});
