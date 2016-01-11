/* eslint new-cap: 0 */
import { reverseClient } from 'reverse-wstunnel';

/**
 * open a reverse tunnel on `serverUrl` from port `tunnelPort` pointing to
 * `netloc`
 */
export function open(tunnelPort, serverUrl, netloc, headers) {
  new reverseClient().start(tunnelPort, serverUrl, netloc, headers);
}
