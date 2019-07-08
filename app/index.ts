import * as ndjson from 'ndjson';
import * as util from 'util';
import {wrapMap, wrapSelect, wrapSort, wrapReduce} from './streamWrapper';
import * as fs from 'fs';
import {Writable} from 'stream';

let args = process.argv.slice(2);

fs.fstat(0, (err, status) => {
  if (err) {
    throw err;
  } else if (!status.isFIFO()) {
    console.log('No data sent to stdin. Exiting now.');
    return;
  } else {
    main();
  }
});

function main() {
  let streams: (NodeJS.WritableStream & NodeJS.ReadableStream)[] = [];

  for (let arg of args) {
    let op = arg.split(':')[0];
    let func = arg
      .split(':')
      .slice(1)
      .join(':');
    switch (op) {
      case 'map': {
        streams.push(wrapMap(func));
        break;
      }
      case 'select': {
        streams.push(wrapSelect(func));
        break;
      }
      case 'sort': {
        streams.push(wrapSort(func));
        break;
      }
      case 'reduce': {
        streams.push(wrapReduce(func));
        break;
      }
    }
  }

  let finalPipe = process.stdin.pipe(ndjson.parse());

  for (let stream of streams) {
    finalPipe = finalPipe.pipe(stream);
  }

  // only colorize if we are piping to a terminal
  if (fs.fstatSync(1).isFIFO()) {
    finalPipe.pipe(
      new Writable({
        objectMode: true,
        write: (data, _, done) => {
          console.log(util.inspect(data, false, Infinity, true));
          done();
        },
      })
    );
  } else {
    finalPipe.pipe(
      new Writable({
        objectMode: true,
        write: (data, _, done) => {
          console.log(JSON.stringify(data));
          done();
        },
      })
    );
  }

  finalPipe.on('end', () => {
    process.exit(0);
  });
}
