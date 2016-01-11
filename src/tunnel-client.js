/* eslint new-cap: 0 */
import wts from 'node-reverse-wstunnel';

/**
 * open a reverse tunnel on `serverUrl` from port `tunnelPort` pointing to
 * `netloc`
 */
export function open(tunnelPort, serverUrl, netloc, headers) {
  const reverseClient = new wts.client_reverse();
  reverseClient.start(tunnelPort, serverUrl, netloc, headers);
}
