import { Socket } from "socket.io";
import { RoomToUsers } from "../../socket";
import { addMessageToRoom } from "../rooms";

async function messageToRoomEndpoint(socket: Socket, emailCurrentUser: string, roomToUsers: RoomToUsers) {
    socket.on("message-to-room", async ({ roomId, message }) => {
        console.log(message);
        // send messages to to all users of the room
        roomToUsers.get(roomId)
            ?.filter(({ emailOfUser }) => emailCurrentUser != emailOfUser)
            .forEach(({ socket }) => {
                socket.emit('message-from-room', message)
            });
        //  persist message
        await addMessageToRoom(roomId, message);
    });
}

export default messageToRoomEndpoint;
