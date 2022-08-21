"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocket = void 0;
const socket_io_1 = require("socket.io");
const jwt_service_1 = require("./api/jwt-service");
const rooms_1 = require("./api/rooms");
const message_to_room_1 = __importDefault(require("./api/socker-endpoints/message-to-room"));
const jwt_1 = require("./middleware/jwt");
;
const roomToUsers = new Map();
function setupSocket(server) {
    const io = new socket_io_1.Server(server);
    // auth for the socket endpoint
    io.use(jwt_1.authenticateJWTForSocketIo);
    io.on('connection', (socket) => {
        const emailCurrentUser = (0, jwt_service_1.getEmailFromToken)(socket.handshake.auth.token);
        console.log('connection from', emailCurrentUser);
        // creation of a room
        socket.on("create-room", async ({ requestId }) => {
            const roomId = await (0, rooms_1.createRoom)(emailCurrentUser);
            socket.emit("created-room", { requestId, roomId });
        });
        (0, message_to_room_1.default)(socket, emailCurrentUser, roomToUsers);
        // sending a message to a room
        socket.on("message-to-room", async ({ roomId, message }) => {
            console.log(message);
            // send messages to to all users of the room
            roomToUsers.get(roomId)
                ?.filter(({ emailOfUser }) => emailCurrentUser != emailOfUser)
                .forEach(({ socket }) => {
                socket.emit('message-from-room', message);
            });
            //  persist message
            await (0, rooms_1.addMessageToRoom)(roomId, message);
        });
    });
}
exports.setupSocket = setupSocket;
