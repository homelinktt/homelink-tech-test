import { z } from "zod";
import deviceModel from "../models";
import { DeviceStatus } from "../types";
import type { Context } from "koa";

const DeviceTypeSchema = z.enum(["AirSensor", "TemperatureSensor"]);

const DeviceLocationSchema = z.object({
  room: z.string().optional(),
  building: z.string().optional(),
});

const DeviceBaseSchema = z.object({
  deviceName: z.string().min(1),
  macAddress: z.string().regex(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/),
  deviceStatus: z.nativeEnum(DeviceStatus),
  batteryLevel: z.number().min(0).max(100).optional(),
  signalStrength: z.number().optional(),
  location: DeviceLocationSchema.optional(),
  deviceType: DeviceTypeSchema,
});

const AirSensorSchema = DeviceBaseSchema.extend({
  deviceType: z.literal("AirSensor"),
  moistureLevel: z.number(),
});

const TemperatureSensorSchema = DeviceBaseSchema.extend({
  deviceType: z.literal("TemperatureSensor"),
  tempC: z.number(),
});

const DeviceSchema = z.discriminatedUnion("deviceType", [
  AirSensorSchema,
  TemperatureSensorSchema,
]);

export default class DeviceController {
  static async createDevice(ctx: Context) {
    try {
      const deviceData = ctx.request.body;
      const validatedDevice = DeviceSchema.parse(deviceData);
      const newDevice = await deviceModel.createDevice(validatedDevice);

      ctx.status = 201;
      ctx.body = newDevice;
    } catch (e: unknown) {
      ctx.status = 400;
      const error = e as Error;
      ctx.body = {
        error: e instanceof z.ZodError ? e.errors : error.message,
      };
    }
  }
}
