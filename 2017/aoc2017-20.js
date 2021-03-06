const assert = require('assert');

function parse(data) {
  return data.trim().split('\n').map(e => {
    const [_, px, py, pz, vx, vy, vz, ax, ay, az] =
      /p=<(-?\d+),(-?\d+),(-?\d+)>, v=<(-?\d+),(-?\d+),(-?\d+)>, a=<(-?\d+),(-?\d+),(-?\d+)>/.exec(e);

    return { p: {x: Number(px), y: Number(py), z: Number(pz)},
             v: {x: Number(vx), y: Number(vy), z: Number(vz)},
             a: {x: Number(ax), y: Number(ay), z: Number(az)} };
  });
}

function lowestAcceleration(particles) {
  return particles.map(e => Math.abs(e.a.x) + Math.abs(e.a.y) + Math.abs(e.a.z)).reduce((a,e,i) => e < a.min? {min: e, i: i} : a, {min: Number.MAX_SAFE_INTEGER}).i;
}


function particleToString(p) {
  return p?`p=<${p.p.x},${p.p.y},${p.p.z}>, v=<${p.v.x},${p.v.y},${p.v.z}>, a=<${p.a.x},${p.a.y},${p.a.z}>`:undefined;
}

function tick(particles) {
  function update(p) {
    p.v.x += p.a.x;
    p.v.y += p.a.y;
    p.v.z += p.a.z;

    p.p.x += p.v.x;
    p.p.y += p.v.y;
    p.p.z += p.v.z;

    return p;
  }

  function removeCollisions(particles) {
    const locations = particles.map(p => `<${p.p.x},${p.p.y},${p.p.z}>`).reduce((a,p,i) => { a[p] ? a[p].push(i) : a[p] = [i]; return a;}, {});

    Object.keys(locations).forEach(k => {
      if(locations[k].length > 1) {
        locations[k].forEach(i => particles[i] = undefined);
      }
    });

    return particles.filter(p => p);
  }

  return removeCollisions(particles.map(update));
}
const testData = `
p=<3,0,0>, v=<2,0,0>, a=<-1,0,0>
p=<4,0,0>, v=<0,0,0>, a=<-2,0,0>
`.trim()

assert.equal(lowestAcceleration(parse(testData)), 0);

var data = '';
process.stdin.on('data', chunk => data += chunk);
process.stdin.on('end', () => {
  let particles = parse(data);
  console.log(lowestAcceleration(particles));

  // This is unsatisfactory.  Should end when we prove no further
  // collisions are possible.
  for(let i = 0; i < 1000; i++) {
    particles = tick(particles);
  }

  console.log(particles.length);
});
