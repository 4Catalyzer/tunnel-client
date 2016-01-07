# tunnel-client

Client for tunneling connections to different locations in a private network.

## Usage

to start:

```sh
npm install
export QSI_AUTH0_ORIGIN="https://qsi.auth0.com"
export TC_SERVER_URL="ws://TUNNEL_SERVER_LOCATION/ws"
export TC_NETWORK_ID=MY_PRIVATE_NETWORK_0001
export TC_PING_INTERVAL=5 # keep-alive interval in seconds
npm start
```
