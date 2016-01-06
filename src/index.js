import assert from 'assert';
import WebSocket from 'ws';

import {} from './ws-monkey-patch';

const serverUrl = process.env.BFLY_SERVER_URL || 'ws://127.0.0.1:8080/ws';
const hospitalId = process.env.BFLY_HOSPITAL_ID;

assert(hospitalId, 'must provide a valid hospital ID');

console.log(` connecting to ${serverUrl}`)

const ws = new WebSocket(serverUrl);

ws.onJsonMessage =

ws.on('open', () => {

  ws.sendCommand('REGISTER_HOSPITAL', hospitalId);

});

ws.on('close', () => {

  console.log('Connection with the server interrupted.' +
    'Trying to reconnect in 10 seconds')

});

ws.onCommand('open', data => {
  console.log('received open', data)
})
