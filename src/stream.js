import  { pipe } from 'it-pipe';
import * as lp from 'it-length-prefixed';
import map from 'it-map';
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string';
import { toString as uint8ArrayToString } from 'uint8arrays/to-string';

export const stdinToStream = async (stream) => {
  process.stdin.setEncoding('utf8')
  pipe(
    process.stdin,
    (source) => map(source, (string) => uint8ArrayFromString(string)),
    lp.encode(),
    stream.sink
  )
}
export const streamToConsole = async (stream) => {
  pipe(
    stream.source,
    lp.decode(),
    (source) => map(source, (buf) => uint8ArrayToString(buf)),
    async (source) => {
      for await (const msg of source) {
        console.log('> ' + msg.toString().replace('\n', ''))
      }
    }
  )
}