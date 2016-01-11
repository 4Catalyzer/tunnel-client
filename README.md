# tunnel-client

Client for tunneling connections to different locations in a private network. Used in combination with https://github.com/4Catalyzer/tunnel-server

## Build and Run

```sh
docker build . -t tunnel-client
docker run \
  -e "TC_SERVER_URL=ws://TUNNEL_SERVER_LOCATION/ws" \
  -e "TC_NETWORK_ID=MY_PRIVATE_NETWORK_0001" \
  -e "TC_PING_INTERVAL=5" \
  -e "TC_ACCESS_TOKEN=Bearer XXXXXXXXXXXXXXXXXXXXXXXX" \
  tunnel-client
```
