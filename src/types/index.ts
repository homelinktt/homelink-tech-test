export enum DeviceStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  OFFLINE = "offline",
  MAINTENANCE = "maintenance",
  ERROR = "error",
}

export type DeviceType = "AirSensor" | "TemperatureSensor";

export interface DeviceBase {
  deviceType: DeviceType;
  id?: string;
  deviceName: string;
  macAddress: string;
  deviceStatus: DeviceStatus;
  batteryLevel?: number;
  signalStrength?: number;
  location?: {
    room?: string;
    building?: string;
  };
}

export interface AirSensor extends DeviceBase {
  moistureLevel: number;
}

export interface TemperatureSensor extends DeviceBase {
  tempC: number;
}

export type Device = AirSensor | TemperatureSensor;
