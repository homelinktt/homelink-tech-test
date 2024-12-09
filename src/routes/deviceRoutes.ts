import Router from "@koa/router";
import DeviceController from "../controllers/deviceController";

const router = new Router({ prefix: "/api/devices" });

router.post("/", DeviceController.createDevice);
router.get("/", DeviceController.getAllDevices);
router.get("/:id", DeviceController.getDeviceById);
router.put("/:id", DeviceController.updateDevice);
router.del("/:id", DeviceController.deleteDevice);
router.put("/:id/update-status", DeviceController.updateDeviceStatus);

export default router;
