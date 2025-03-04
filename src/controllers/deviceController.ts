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

const DeviceStatusUpdateSchema = z
  .object({
    deviceStatus: z.nativeEnum(DeviceStatus),
  })
  .strict();

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

  static async getAllDevices(ctx: Context) {
    try {
      const devices = await deviceModel.getAllDevices();
      ctx.body = devices;
    } catch (error) {
      ctx.status = 500;
      ctx.body = { message: "Error fetching devices", error };
    }
  }

  static async getDeviceById(ctx: Context) {
    try {
      const device = await deviceModel.getDeviceById(ctx.params.id);

      ctx.body = device;
    } catch (error) {
      ctx.status = 500;
      ctx.body = { message: "Error fetching device", error };
    }
  }

  static async updateDevice(ctx: Context) {
    try {
      const deviceData = ctx.request.body;

      const validatedUpdates = DeviceSchema.parse(deviceData);
      const updatedDevice = await deviceModel.updateDevice(
        ctx.params.id,
        validatedUpdates,
      );

      ctx.body = updatedDevice;
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        error:
          error instanceof z.ZodError ? error.errors : "Error updating device",
      };
    }
  }

  static async updateDeviceStatus(ctx: Context) {
    try {
      const updateData = ctx.request.body;

      const validatedUpdates = DeviceStatusUpdateSchema.parse(updateData);
      const updatedDevice = await deviceModel.updateDeviceStatus(
        ctx.params.id,
        validatedUpdates.deviceStatus,
      );

      ctx.body = updatedDevice;
    } catch (error) {
      ctx.status = 400;
      ctx.body = {
        error:
          error instanceof z.ZodError ? error.errors : "Error updating device",
      };
    }
  }

  static async deleteDevice(ctx: Context) {
    try {
      await deviceModel.deleteDevice(ctx.params.id);
      ctx.status = 204;
    } catch (error) {
      ctx.status = 500;
      ctx.body = { message: "Error deleting device", error };
    }
  }
}
