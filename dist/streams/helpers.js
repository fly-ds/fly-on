"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
class StreamHelpers {
    writableToTransform(writable) {
        let rtn = new stream_1.Transform({
            objectMode: true,
            transform: function (data, _, done) {
                writable.write(data, done);
                done();
            },
        });
        writable.on('data', data => {
            console.log('testing', data);
            rtn.push(data);
        });
        writable.on('end', () => {
            console.log('testing end');
            rtn.emit('end');
        });
        writable.on('close', () => {
            console.log('testing close');
            rtn.emit('close');
        });
        return rtn;
    }
}
exports.StreamHelpers = StreamHelpers;
//# sourceMappingURL=helpers.js.map