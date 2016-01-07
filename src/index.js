import assert from 'assert';
import WebSocket from 'ws';

import { log, error } from './log';
import * as tunnelClient from './tunnel-client';
import {} from './ws-monkey-patch';

const serverUrl = process.env.TC_SERVER_URL || 'ws://localhost:8080/ws';
const networkId = process.env.TC_NETWORK_ID;
const reconnectInterval = process.env.TC_PING_INTERVAL || 10;

assert(networkId, 'Must provide a valid network ID');

log(`Connecting to ${serverUrl}`);

let ws;

function connect() {
  ws = new WebSocket(serverUrl);

  ws.on('open', () => {
    log('Succesful connection established');

    ws.sendCommand('REGISTER_NETWORK', networkId);
  });

  ws.on('close', (code, message) => log('Connection closed.', code, message));
  ws.on('error', err => log('An error was thrown, connection closed.', err));

  ws.onCommand('OPEN_TUNNEL', data => {
    const { tunnelPort, tunnelServerUrl, netloc } = data;
    tunnelClient.open(tunnelPort, tunnelServerUrl, netloc);
  });

  ws.monitor(reconnectInterval * 1000, () => {
    error('Disconnected from server. Trying to reconnect.');
    ws.terminate();
    connect();
  });
}

connect();
