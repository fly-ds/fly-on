declare module 'ndjson' {
  function parse(): NodeJS.WritableStream & NodeJS.ReadableStream;
}
