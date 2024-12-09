import pgPromise from "pg-promise";
import type { AirSensor, TemperatureSensor } from "../types";

const connectionOptions = {
  connectionString: process.env.DB_CSTRING,
  password: process.env.DB_PASSWORD || "your_password",
};

const pgp = pgPromise();
const db = pgp(connectionOptions);

class DeviceModel {
  private db: any;

  constructor() {
    this.initDatabase();
  }

  private async initDatabase() {
    try {
      console.log("Initializing database connection...");
      await db
        .connect()
        .then((obj) => {
          console.log("Database connected successfully");
          obj.done();
        })
        .catch((error) => {
          console.error("ERROR:", error.message || error);
        });

      // create table if it doesn't exist
      await db.none(`
        CREATE TABLE IF NOT EXISTS devices (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          device_name TEXT NOT NULL,
          mac_address TEXT NOT NULL UNIQUE,
          device_status TEXT NOT NULL,
          battery_level INTEGER,
          signal_strength INTEGER,
          room TEXT,
          building TEXT,
          moisture_level REAL,
          temp_c REAL,
          device_type TEXT NOT NULL
        )
      `);
    } catch (e: unknown) {
      console.error("Database initialization error:", e as Error);
    }
  }

  async createDevice(device: AirSensor | TemperatureSensor) {
    console.log("creatingDevice", device);
    const {
      deviceType,
      deviceName,
      macAddress,
      deviceStatus,
      batteryLevel,
      signalStrength,
      location,
      ...specificProps
    } = device;

    const query = `
      INSERT INTO devices(
          device_name, mac_address, device_status, battery_level, 
        signal_strength, room, building, moisture_level, temp_c, device_type
      ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
      ) RETURNING *
    `;

    const values = [
      deviceName,
      macAddress,
      deviceStatus,
      batteryLevel,
      signalStrength,
      location?.room,
      location?.building,
      "moistureLevel" in specificProps ? specificProps.moistureLevel : null,
      "tempC" in specificProps ? specificProps.tempC : null,
      deviceType,
    ];

    try {
      const newDevice = await db.one(query, values);
      return newDevice;
    } catch (e: unknown) {
      console.error("error creating device", e as Error);
    }
  }

  async getAllDevices() {
    try {
      return await db.many("SELECT * FROM devices");
    } catch (e) {
      console.error("error getting all devices", e as Error);
    }
  }
}

export default new DeviceModel();
