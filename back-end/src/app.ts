import express, { Application } from "express";
import bodyParser from "body-parser";
import Connect from "./connect-db";
import apiRouter from "./router";
import http from "http";
import { createRoom } from "./api/rooms";
import { setupSocket } from "./socket";

const app: Application = express();
const server = http.createServer(app);

const PORT = 3000;
const db = process.env.MONGO_URL || "mongodb://root:root@localhost:27017/";

Connect({ db });

setupSocket(server);

// tune parameters of the express server
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', apiRouter);

// start express service
server.listen(PORT, () => {
  console.log(`server is running on PORT ${PORT}`);

  // create default room for testing
  createRoom('undefined', 'main-room');
})