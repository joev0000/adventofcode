function* map(it, fn) {
  let next = it.next();
  while(!next.done) {
    yield fn(next.value);
    next = it.next();
  }
}

function* filter(it, predicate) {
  let next = it.next();
  while(!next.done) {
    while(!(next.done || predicate(next.value))) {
      next = it.next();
    }
    if(!next.done) {
      yield next.value;
    }
    next = it.next();
  }
}

function* flatten(it) {
  let next = it.next();
  while(!next.done) {
    let inner = next.value[Symbol.iterator]();
    let innerNext = inner.next();
    while(!innerNext.done) {
      yield innerNext.value;
      innerNext = inner.next();
    }
    next = it.next();
  }
}

function* takeWhile(it, predicate) {
  let next = it.next();
  while(!next.done && predicate(next.value)) {
    yield next.value;
    next = it.next();
  }
}

function* dropWhile(it, predicate) {
  let next = it.next();
  while(!next.done && predicate(next.value)) {
    next = it.next();
  }
  while(!next.done) {
    yield next.value;
    next = it.next();
  }
}

function* zip(it, other) {
  let next = it.next();
  while(!next.done) {
    yield [next.value, other.next().value];
    next = it.next();
  }
}

class FunctionalIterator {
  constructor(it) {
    this.it = it[Symbol.iterator]();
    this[Symbol.iterator] = () => this;
  }

  next() {
    return this.it.next();
  }

  done() {
    return this.it.done();
  }

  reduce(fn, a) {
    let next = this.next();
    while(!next.done) {
      a = fn(a, next.value);
      next = this.next();
    }
    return a;
  }

  zip(other) {
    return new FunctionalIterator(zip(this, other));
  }

  map(fn) {
    return new FunctionalIterator(map(this, fn));
  }

  flatten() {
    return new FunctionalIterator(flatten(this));
  }

  flatMap(fn) {
    return new FunctionalIterator(flatten(map(this,fn)));
  }

  filter(predicate) {
    return new FunctionalIterator(filter(this, predicate));
  }

  dropWhile(predicate) {
    return new FunctionalIterator(dropWhile(this, predicate));
  }

  drop(count) {
    return this.dropWhile(() => count-- > 0);
  }

  takeWhile(predicate) {
    return new FunctionalIterator(takeWhile(this, predicate));
  }

  take(count) {
    return this.takeWhile(() => count-- > 0);
  }

  toArray() {
    return Array.from(this);
  }
}

function FI(it) {
  return new FunctionalIterator(it);
}

function* range(start, end) {
  while(start < end) {
    yield start++;
  }
}

function* integers(start=0) {
  while(true) {
    yield start++;
  }
}

function* fibonacci() {
  let [a,b] = [0,1];
  while(true) {
    yield a;
    [a,b] = [b, a+b];
  }
}

function* random(max) {
  if(max) {
    max = Math.floor(max);
    while(true) {
      yield Math.floor(Math.random() * max);
    }
  }
  else {
    while(true) {
      yield Math.random();
    }
  }
}

module.exports = {
  FI,
  fn: {
    map,
    flatten,
    filter,
    takeWhile,
    dropWhile,
    zip
  },

  generator: {
    range,
    integers,
    fibonacci,
    random
  }
}
