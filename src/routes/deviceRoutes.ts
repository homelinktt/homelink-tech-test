import Router from "@koa/router";
import DeviceController from "../controllers/deviceController";

const router = new Router({ prefix: "/api/devices" });

router.post("/", DeviceController.createDevice);
router.get("/", DeviceController.getDevices);

export default router;
