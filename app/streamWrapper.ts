import {Transform} from 'stream';

let implicitValueRegex = /(\s|^)(\.)/g;

export function wrapMap(func: string): NodeJS.WritableStream & NodeJS.ReadableStream {
  func = func.replace(implicitValueRegex, (match, p1) => p1 + 'x.');
  func = 'function fn(x) { ' + func + '; return x; }; fn';
  console.error('testing map', func);
  let callable = eval(func);
  return new Transform({
    objectMode: true,
    transform(data, _, done) {
      this.push(callable(data));
      done(undefined);
    },
  });
}

export function wrapSelect(func: string): NodeJS.WritableStream & NodeJS.ReadableStream {
  func = func.replace(implicitValueRegex, (match, p1) => p1 + 'x.');
  func = 'function fn(x) { return ' + func + '; }; fn';
  console.error('testing select', func);
  let callable = eval(func);
  return new Transform({
    objectMode: true,
    transform(data, _, done) {
      let shouldEmit = callable(data);
      if (shouldEmit) {
        this.push(data);
      }
      done(undefined);
    },
  });
}

export function wrapSort(func: string): NodeJS.WritableStream & NodeJS.ReadableStream {
  func = 'function fn(a, b) { return ' + func + '; }; fn';
  console.log();
  let callable = eval(func);

  return new Transform({
    objectMode: true,
    transform(data, _, done) {},
  });
}

export function wrapReduce(func: string): NodeJS.WritableStream & NodeJS.ReadableStream {
  func = 'function fn(c, p) { return ' + func + '; }; fn';
  return eval(func);
}
