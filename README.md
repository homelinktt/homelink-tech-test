# home-automation

## Summary

This is my submission for Homelink's take-home test.

I was asked to create a REST api for handling smart home devices. I chose to use NodeJS, TypeScript, Koa and Postgres to give me flexibility, speed to get up and running, and potential headroom to expand in the future.

To run this locally you will need to install [bun](https://bun.sh/) and follow the steps below. There is an included `.env` file with a connection string to a postgresql database I created in supabase, although you could connect this to your own postgresql instance and the init script would create the required table for you. There are several endpoints listed below with example curl requests.

The app structure follows a typical koa / express style, with routes, controllers and models for each slice of the api stack. Routes define what endpoints the app expose to the node runtime for consumption from clients. Controllers are an abstraction over the request context and interact with models (data layer).

## Assumptions and shortcomings

I was asked to complete this in a few hours and so I had to cut some corners so as to not spend too much time. Notably:

- there are no tests
- the database is totally decoupled from the app logic
- the zod validation and model shapes are not tied together properly
- the error handling could be expanded and improved
- the schema itself is basic and doesn't scale

Given more time I would have written a suite of both unit and integration tests. Unit to provide some fast, in memory validation that individual components behave as expected by mocking their dependencies. For example does the `deviceController.createDevice` method return a mocked value given a set of inputs. Integrations tests demonstrate that larger components interact together in an expected way. For example, given a database with some test data, does the route `/api/` return a list of devices.

There is no relationship between the database table and the schema in the app logic. I would have used an ORM like Prisma to define a database schema which would in turn generate a schema which could be interpreted by zod, rather than duplicating in code.

There is a `types/` module and a schema definition in the device controller. This works as is, but is not particularly scaleable or maintainable (duplication).

I could utilize koa middleware to write an error handling middleware that could intercept throws and return appropriate information depending on the error (ie zod validation or a database error - the latter of which we wouldn't want to expose to clients).

The schema is basic and serves its purpose, but I would definitely want to gather more requirements and implement something a bit more thought out for a production app. For example, what range of different devices would we be storing, how would they relate to one another, would there be any relationships for example parent > child etc. Would each device generate any data ie telemetry, logs. I included the concept of locations in my schema but this could be expanded to include clusters of devices, organisations etc.

I also had a stretch goal of setting up a websocket endpoint which could have provided some dummy data stream for a given device id but I didn't have the time to implement.

## Setup

To install dependencies:

Install [bun](https://bun.sh/)

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
curl --request PUT \
  --url http://0.0.0.0:3000/api/devices/f7ace5d6-6b73-4c69-bd38-2f36363f1a91 \
  --header 'content-type: application/json' \
  --data '{
  "deviceType": "TemperatureSensor",
  "deviceName": "Kitchen Temp",
  "macAddress": "AA:BB:CC:DD:EE:FF",
  "deviceStatus": "active",
  "tempC": 23.5,
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
