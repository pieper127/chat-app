import { Socket } from "socket.io";
import { createRoom } from "../rooms";

async function createRoomEndpoint(socket: Socket, emailCurrentUser: string) {
    socket.on("create-room", async ({ requestId }) => {
        const roomId = await createRoom(emailCurrentUser);
        socket.emit("created-room", { requestId, roomId });
    });
}

export default createRoomEndpoint;