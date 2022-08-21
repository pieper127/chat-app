import express, { Application, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import Connect from "./connect-db";
import apiRouter from "./router";
import http from "http";
import { Server, Socket } from "socket.io";
import { authenticateJWTForSocketIo, getEmailFromToken } from "./middleware/jwt";
import { addMessageToRoom, createRoom, joinRoom } from "./api/rooms";

interface SocketAndUser  {
  socket: Socket,
  emailOfUser: string,
};
const roomToUsers = new Map<string, SocketAndUser[]>();

const app: Application = express();
const server = http.createServer(app);
const io = new Server(server)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', apiRouter);

const PORT = 3000;
const db = process.env.MONGO_URL || "mongodb://root:root@localhost:27017/";
console.log(db);

Connect({ db });

io.use(authenticateJWTForSocketIo);

io.on('connection', (socket) => {
  const emailCurrentUser = getEmailFromToken(socket.handshake.auth.token);
  console.log('connection from', emailCurrentUser);
  // creation of a room
  socket.on("create-room", async ({ requestId }) => { 
    const roomId = await createRoom(emailCurrentUser);
    socket.emit("created-room", { requestId, roomId });
  });

  // join the room
  socket.on("join-room", async ({ roomId }) => {
    await joinRoom(getEmailFromToken(emailCurrentUser), roomId);
    const currentUsers = roomToUsers.get(roomId) ? roomToUsers.get(roomId) as SocketAndUser[] : []; 
    const updatedUsers = currentUsers.concat({emailOfUser: emailCurrentUser, socket});
    roomToUsers.set(roomId, updatedUsers);
  });

  // sending a message to a room
  socket.on("message-to-room", async ({ roomId, message }) => {
    console.log(message);
    /// send messages to to all users of the room
    roomToUsers.get(roomId)
      ?.filter(({ emailOfUser }) => emailCurrentUser != emailOfUser)
      .forEach(({ socket }) => { 
        socket.emit('message-from-room', message)
      });
    //  persist message
    await addMessageToRoom(roomId, message);
  });
});

server.listen(PORT, () => {
  console.log(`server is running on PORT ${PORT}`);

  // create default room for testing
  createRoom('undefined', 'main-room');
})