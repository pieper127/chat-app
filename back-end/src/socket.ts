import http from "http";
import { Server, Socket } from "socket.io";
import { getEmailFromToken } from "./api/jwt-service";
import { addMessageToRoom, createRoom, joinRoom } from "./api/rooms";
import createRoomEndpoint from "./api/socker-endpoints/create-room";
import joinRoomEndpoint from "./api/socker-endpoints/join-room";
import messageToRoomEndpoint from "./api/socker-endpoints/message-to-room";
import { authenticateJWTForSocketIo  } from "./middleware/jwt";

export interface SocketAndUser {
    socket: Socket,
    emailOfUser: string,
};
export type RoomToUsers = Map<string, SocketAndUser[]>;
const roomToUsers = new Map<string, SocketAndUser[]>();

export function setupSocket(server: http.Server) {
    const io = new Server(server)

    // auth for the socket endpoint
    io.use(authenticateJWTForSocketIo);

    io.on('connection', (socket) => {
        const emailCurrentUser = getEmailFromToken(socket.handshake.auth.token);
        console.log('connection from', emailCurrentUser);

        createRoomEndpoint(socket, emailCurrentUser);
        joinRoomEndpoint(socket, emailCurrentUser, roomToUsers);
        messageToRoomEndpoint(socket, emailCurrentUser, roomToUsers);
    });
}