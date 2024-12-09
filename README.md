# home-automation

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run src/index.ts
```

## Example requests

`create-device`

```bash
curl --request POST \
  --url http://0.0.0.0:3000/api/devices \
  --header 'content-type: application/json' \
  --data '{
  "deviceName": "Cool Device",
  "macAddress": "00:11:22:33:44:55",
  "deviceStatus": "active",
  "batteryLevel": 72,
  "signalStrength": 3,
  "deviceType": "AirSensor",
  "moistureLevel": 58,
  "location": {
    "room": "office-1",
    "building": "1"
  }
}'
```

This project was created using `bun init` in bun v1.1.38. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
