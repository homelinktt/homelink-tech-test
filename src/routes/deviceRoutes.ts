import Router from "@koa/router";
import DeviceController from "../controllers/deviceController";

const router = new Router({ prefix: "/api/devices" });

router.post("/", DeviceController.createDevice);
router.get("/", DeviceController.getDevices);
router.get("/:id", DeviceController.getDeviceById);
router.put("/:id", DeviceController.updateDevice);

export default router;
