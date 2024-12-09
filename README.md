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

`get-devices`

```bash
curl --request GET \
  --url http://0.0.0.0:3000/api/devices
```

`get-device-by-id`

```bash
curl --request GET \
  --url http://0.0.0.0:3000/api/devices/425e7e8d-4b49-4dbe-a6f8-2f0b2850e6c0
```

`update-device`

```bash
curl --request POST \
  --url http://0.0.0.0:3000/api/devices/f7ace5d6-6b73-4c69-bd38-2f36363f1a91 \
  --header 'content-type: application/json' \
  --data '{
  "deviceType": "TemperatureSensor",
  "deviceName": "Kitchen Temp",
  "macAddress": "AA:BB:CC:DD:EE:FF",
  "deviceStatus": "active",
  "tempC": 99.0, // woah thats hot
  "location": {
    "room": "Kitchen",
    "building": "1"
  }
}'
```

`delete-device`

```bash
curl --request DELETE \
  --url http://0.0.0.0:3000/api/devices/f7ace5d6-6b73-4c69-bd38-2f36363f1a91 \
  --header 'content-type: application/json'
```

`update-device-status`

```bash
curl --request PUT \
  --url http://0.0.0.0:3000/api/devices/425e7e8d-4b49-4dbe-a6f8-2f0b2850e6c0/update-status \
  --header 'content-type: application/json' \
  --data '{
  "deviceStatus": "offline"
}'
```

This project was created using `bun init` in bun v1.1.38. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
