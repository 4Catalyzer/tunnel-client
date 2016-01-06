/* eslint new-cap: 0 */
import wts from 'node-reverse-wstunnel';

/**
 * open a reverse tunnel on `serverUrl` from port `tunnelPort` pointing to
 * `remoteUrl`
 */
export function open(tunnelPort, serverUrl, remoteUrl) {
  const reverseClient = new wts.client_reverse();
  reverseClient.start(tunnelPort, serverUrl, remoteUrl);
}
