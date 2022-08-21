"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_service_1 = require("../jwt-service");
const rooms_1 = require("../rooms");
async function joinRoomEndpoint(socket, emailCurrentUser, roomToUsers) {
    socket.on("join-room", async ({ roomId }) => {
        await (0, rooms_1.joinRoom)((0, jwt_service_1.getEmailFromToken)(emailCurrentUser), roomId);
        const currentUsers = roomToUsers.get(roomId) ? roomToUsers.get(roomId) : [];
        const updatedUsers = currentUsers.concat({ emailOfUser: emailCurrentUser, socket });
        roomToUsers.set(roomId, updatedUsers);
    });
}
exports.default = joinRoomEndpoint;
