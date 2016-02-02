const ID_LENGTH = 4;
const NETLOC_LENGTH = 21;
const ENCODING = 'utf8';

/**
 * encode the buffer with an identifier
 */
export function encode(buffer, id) {
  const idBuffer = new Buffer(ID_LENGTH);
  idBuffer.writeUInt32BE(id, 0);
  const bufferLength = buffer.length + ID_LENGTH;
  return Buffer.concat([idBuffer, buffer], bufferLength);
}

/**
 * decode a buffer encoded with the `encode` method and return
 * the original chunk and the identifier
 */
export function decodeIdentifier(buffer) {
  return {
    identifier: buffer.readUInt32BE(),
    chunk: buffer.slice(ID_LENGTH, buffer.length),
  };
}

/**
 * decode the netloc from the chunk and return it along with the
 * original payload
 */
export function decodeNetloc(buffer) {
  return {
    netloc: buffer.toString(ENCODING, 0, NETLOC_LENGTH),
    chunk: buffer.slice(NETLOC_LENGTH, buffer.length),
  };
}
