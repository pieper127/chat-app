import express, { Application, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import Connect from "./connect-db";
import apiRouter from "./router";
import http from "http";
import { Server } from "socket.io";
import authenticateJWT, { authenticateJWTForSockIo } from "./middleware/jwt";

const app: Application = express();
const server = http.createServer(app);
const io = new Server(server)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', apiRouter);

const PORT = 3000;
const db = "mongodb://root:root@localhost:27017/";

Connect({ db });

io.use(authenticateJWTForSockIo);

io.on('connection', (socket) => {
  socket.on("message-to-room", (_arg) => console.log("here"));
})

server.listen(PORT, () => {
  console.log(`server is running on PORT ${PORT}`);
})