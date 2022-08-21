"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const connect_db_1 = __importDefault(require("./connect-db"));
const router_1 = __importDefault(require("./router"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const jwt_1 = require("./middleware/jwt");
const rooms_1 = require("./api/rooms");
;
const roomToUsers = new Map();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use('/api', router_1.default);
const PORT = 3000;
const db = "mongodb://root:root@localhost:27017/";
(0, connect_db_1.default)({ db });
io.use(jwt_1.authenticateJWTForSocketIo);
io.on('connection', (socket) => {
    const emailCurrentUser = (0, jwt_1.getEmailFromToken)(socket.handshake.auth.token);
    console.log('connection from', emailCurrentUser);
    // creation of a room
    socket.on("create-room", async ({ requestId }) => {
        const roomId = await (0, rooms_1.createRoom)(emailCurrentUser);
        socket.emit("created-room", { requestId, roomId });
    });
    // join the room
    socket.on("join-room", async ({ roomId }) => {
        await (0, rooms_1.joinRoom)((0, jwt_1.getEmailFromToken)(emailCurrentUser), roomId);
        const currentUsers = roomToUsers.get(roomId) ? roomToUsers.get(roomId) : [];
        const updatedUsers = currentUsers.concat({ emailOfUser: emailCurrentUser, socket });
        roomToUsers.set(roomId, updatedUsers);
    });
    // sending a message to a room
    socket.on("message-to-room", async ({ roomId, message }) => {
        console.log(message);
        /// send messages to to all users of the room
        roomToUsers.get(roomId)
            ?.filter(({ emailOfUser }) => emailCurrentUser != emailOfUser)
            .forEach(({ socket }) => {
            socket.emit('message-from-room', message);
        });
        //  persist message
        await (0, rooms_1.addMessageToRoom)(roomId, message);
    });
});
server.listen(PORT, () => {
    console.log(`server is running on PORT ${PORT}`);
    // create default room for testing
    (0, rooms_1.createRoom)('undefined', 'main-room');
});
