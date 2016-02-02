import net from 'net';

import { info } from './log';
import { decodeIdentifier, decodeNetloc, encode } from './decoder';

export default class TunnelClient {

  constructor(ws) {
    this._wsConn = ws;
    this._connections = {};
  }

  _sendBack(buffer, identifier) {
    if (this._wsConn.readyState === this._wsConn.OPEN) {
      const chunk = encode(buffer, identifier);
      this._wsConn.send(chunk, { binary: true, mask: true });
    }
  }

  _closeConnection(identifier) {
    const emptyBuffer = new Buffer(0);
    this._sendBack(emptyBuffer, identifier);
    delete this._connections[identifier];
  }

  _openConnection(identifier, data, onOpen) {
    let tcpConn = this._connections[identifier];
    if (!tcpConn) {
      const { chunk, netloc } = decodeNetloc(data);
      const [targetHost, targetPort] = netloc.split(':');
      tcpConn = net.connect({ host: targetHost, port: targetPort });
      this._connections[identifier] = tcpConn;

      tcpConn.on('drain', () => info('TCP connection drain'));
      tcpConn.on('lookup', (error) => info('TCP connection lookup', error));
      tcpConn.on('timeout', () => info('TCP connection timeout'));
      tcpConn.on('end', () => info('TCP connection end'));
      tcpConn.on('error', error => info('TCP connection error', error));
      tcpConn.on('close', () => {
        info('TCP connection closed');
        this._closeConnection(identifier);
      });
      tcpConn.on('data', tcpChunk => {
        info('TCP connection data');
        this._sendBack(tcpChunk, identifier);
      });

      tcpConn.once('connect', () => {
        info('TCP connection established');
        onOpen(tcpConn, chunk);
      });
    } else {
      return onOpen(tcpConn, data);
    }
  }

  _handleIncomingRequest(data) {
    info('ws message received');
    const { chunk, identifier } = decodeIdentifier(data);
    this._openConnection(identifier, chunk, (tcpConn, decodedChunk) => {
      tcpConn.write(decodedChunk);
    });
  }

  start() {
    this._wsConn.on('message', data => this._handleIncomingRequest(data));
  }
}
