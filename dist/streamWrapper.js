"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
let implicitValueRegex = /(\s|^)(\.)/g;
function wrapMap(func) {
    func = func.replace(implicitValueRegex, (match, p1) => p1 + 'x.');
    func = 'function fn(x) { ' + func + '; return x; }; fn';
    console.error('testing map', func);
    let callable = eval(func);
    return new stream_1.Transform({
        objectMode: true,
        transform(data, _, done) {
            this.push(callable(data));
            done(undefined);
        },
    });
}
exports.wrapMap = wrapMap;
function wrapSelect(func) {
    func = func.replace(implicitValueRegex, (match, p1) => p1 + 'x.');
    func = 'function fn(x) { return ' + func + '; }; fn';
    console.error('testing select', func);
    let callable = eval(func);
    return new stream_1.Transform({
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
exports.wrapSelect = wrapSelect;
function wrapSort(func) {
    func = 'function fn(a, b) { return ' + func + '; }; fn';
    console.log();
    let callable = eval(func);
    return new stream_1.Transform({
        objectMode: true,
        transform(data, _, done) { },
    });
}
exports.wrapSort = wrapSort;
function wrapReduce(func) {
    func = 'function fn(c, p) { return ' + func + '; }; fn';
    return eval(func);
}
exports.wrapReduce = wrapReduce;
//# sourceMappingURL=streamWrapper.js.map