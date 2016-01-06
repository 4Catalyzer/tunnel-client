/**
 * Monkey patching ws with some utility methods
 */

import assert from 'assert';
import WebSocket from 'ws';

/**
 * send a json message serialized to string
 */
WebSocket.prototype.sendJson = function(data, options, callback) {
  data = JSON.stringify(data);
  return this.send(data, options, callback);
};

/**
 * Send a message in the following format:
 *
 *    {
 *      command: command,
 *      data: data
 *    }
 */
WebSocket.prototype.sendCommand = function(command, data, options, callback) {
  return this.sendJson({command, data}, options, callback)
}


/**
 * Register a function to be called when a given command is received.
 * The message received must be of the form
 *
 *    {
 *      command: 'command',
 *      data: {}
 *    }
 */
WebSocket.prototype.onCommand = function(command, listener) {
  this.registeredCommands = this.registeredCommands || {}

  this._onCommand = this._onCommand || this.on('message', msg => {
    msg = JSON.parse(msg);
    const { command, data } = msg;
    assert(command && data, 'invalid message received', data);

    const callback = this.registeredCommands[command];
    assert(callback,
      'the callback for the incoming command was not registered', command);

    callback(data);
  });

  this.registeredCommands[command] = listener;
};
