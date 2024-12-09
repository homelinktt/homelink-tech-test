import Koa from "koa";
import bodyParser from "koa-bodyparser";
import deviceRoutes from "./routes/deviceRoutes";

const app = new Koa();
const PORT = process.env.PORT || 3000;

// configure middleware
app.use(bodyParser());

app.use(deviceRoutes.routes());
app.use(deviceRoutes.allowedMethods());

app.on("error", (err) => {
  console.error("Server error", err);
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default server;
