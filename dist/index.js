"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ndjson = require("ndjson");
const util = require("util");
const streamWrapper_1 = require("./streamWrapper");
const fs = require("fs");
const stream_1 = require("stream");
let args = process.argv.slice(2);
fs.fstat(0, (err, status) => {
    if (err) {
        throw err;
    }
    else if (!status.isFIFO()) {
        console.log('No data sent to stdin. Exiting now.');
        return;
    }
    else {
        main();
    }
});
function main() {
    let streams = [];
    for (let arg of args) {
        let op = arg.split(':')[0];
        let func = arg
            .split(':')
            .slice(1)
            .join(':');
        switch (op) {
            case 'map': {
                streams.push(streamWrapper_1.wrapMap(func));
                break;
            }
            case 'select': {
                streams.push(streamWrapper_1.wrapSelect(func));
                break;
            }
            case 'sort': {
                streams.push(streamWrapper_1.wrapSort(func));
                break;
            }
            case 'reduce': {
                streams.push(streamWrapper_1.wrapReduce(func));
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
        finalPipe.pipe(new stream_1.Writable({
            objectMode: true,
            write: (data, _, done) => {
                console.log(util.inspect(data, false, Infinity, true));
                done();
            },
        }));
    }
    else {
        finalPipe.pipe(new stream_1.Writable({
            objectMode: true,
            write: (data, _, done) => {
                console.log(JSON.stringify(data));
                done();
            },
        }));
    }
    finalPipe.on('end', () => {
        process.exit(0);
    });
}
//# sourceMappingURL=index.js.map