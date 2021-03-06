import assert from 'assert';
import WebSocket from 'ws';
import wsmp from 'websocket-monkeypatch';

import { log, error } from './log';
import TunnelClient from './tunnel-client';

wsmp(WebSocket);

const serverUrl = process.env.TC_SERVER_URL || 'ws://localhost:8080/ws';
const networkId = process.env.TC_NETWORK_ID;
const pingInterval = process.env.TC_PING_INTERVAL || 10;
const authorization = process.env.TC_ACCESS_TOKEN || '';

assert(networkId, 'Must provide a valid network ID');

log(`Connecting to ${serverUrl}`);

let ws;
let retries = 0;

function connect() {
  const headers = { Authorization: authorization };
  ws = new WebSocket(serverUrl, { headers });

  ws.on('open', () => {
    if (ws.readyState === ws.OPEN) {
      log('Succesful connection established');
      retries = 0;
      ws.sendCommand('REGISTER_NETWORK', networkId);
    }
  });

  ws.on('close', (code, message) => log('Connection closed.', code, message));
  ws.on('error', err => log('An error was thrown, connection closed.', err));
  new TunnelClient(ws).start();

  ws.monitor(pingInterval * 1000, () => {
    const nextRetrySeconds = (2**Math.min(5, retries++));
    error('Disconnected from server.' +
      `Trying to reconnect in ${nextRetrySeconds} seconds.`, retries);
    ws.terminate();
    setTimeout(connect, nextRetrySeconds * 1000);
  });
}

connect();
