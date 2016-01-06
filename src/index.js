/* eslint no-use-before-define: 0 */
import assert from 'assert';
import WebSocket from 'ws';

import {} from './ws-monkey-patch';

const serverUrl = process.env.BFLY_SERVER_URL || 'ws://127.0.0.1:8080/ws';
const hospitalId = process.env.BFLY_HOSPITAL_ID;
const reconnectInterval = process.env.BFLY_RECONNECT_INTERVAL || 4;

assert(hospitalId, 'Must provide a valid hospital ID');

console.log(`Connecting to ${serverUrl}`);

function connect() {
  const ws = new WebSocket(serverUrl);

  ws.on('open', () => {
    console.log('Succesful connection established');

    ws.sendCommand('REGISTER_HOSPITAL', hospitalId);
  });

  ws.on('close', onClose);
  ws.on('error', onClose);

  ws.onCommand('OPEN_TUNNEL', data => {
    console.log('received open', data);
  });
}

function onClose() {
  console.log('Connection with the server interrupted.' +
    `Trying to reconnect in ${reconnectInterval} seconds`);

  setTimeout(connect, 1000 * reconnectInterval);
}

connect();
