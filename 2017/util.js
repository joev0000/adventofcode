const iter = require('./iter');

function rotate(seq, distance) {
  return seq.slice(distance).concat(seq.slice(0,distance));
}

function zip(seq0, seq1) {
  return seq0.reduce((a, e) => {
    return {
      zipped: a.zipped.concat([[e, a.seq1Tail[0]]]),
      seq1Tail: a.seq1Tail.slice(1)
    };
  }, { zipped: [], seq1Tail: seq1 }).zipped;
}

function hash(s) {
  function reverse(a, start, length) {
    let copy = a.slice();
    let i = start;
    let j = start + length - 1;

    while(i < j) {
      let temp = copy[i % a.length];
      copy[i % a.length] = copy[j % a.length];
      copy[j % a.length] = temp;
      i++;
      j--;
    }
    return copy;
  }
  function round(hashState, lengths) {
    return lengths.reduce((a,e) => {
      const r =  {
        array: reverse(a.array, a.currentPos, e),
        currentPos: (a.currentPos + a.skipSize + e) % a.array.length,
        skipSize: (a.skipSize + 1) % a.array.length
      }
      return r;
    }, hashState);
  }

  function toHex(n) {
    return (n < 16 ? '0':'') + n.toString(16);
  }
  function sparseHash(s) {
    const lengths = s.split('').map(c => c.charCodeAt()).concat([17,31,73,47,23]);
    let hashState = {
      array: iter.FI(iter.generator.integers()).take(256).toArray(),
      currentPos: 0,
      skipSize: 0
    };

    return iter.FI(iter.generator.integers()).take(64).reduce((a,e) => round(a, lengths), hashState);
  }

  const sparse = iter.FI(sparseHash(s).array);

  const blocks = [];
  for(let i = 0; i < 16; i++) {
    const inner = [];
    for(let j = 0; j < 16; j++) {
      inner.push(sparse.next().value);
    }
    blocks.push(inner);
  }
  return blocks.map(b => b.reduce((a, e) => a ^ e, 0)).map(toHex).join('');

}

module.exports = {
  hash,
  rotate,
  zip
};

