import { Socket } from "socket.io";
import { RoomToUsers, SocketAndUser } from "../../socket";
import { getEmailFromToken } from "../jwt-service";
import { joinRoom } from "../rooms";

async function joinRoomEndpoint(socket: Socket, emailCurrentUser: string, roomToUsers: RoomToUsers) {
  socket.on("join-room", async ({ roomId }) => {
    await joinRoom(getEmailFromToken(emailCurrentUser), roomId);
    const currentUsers = roomToUsers.get(roomId) ? roomToUsers.get(roomId) as SocketAndUser[] : []; 
    const updatedUsers = currentUsers.concat({emailOfUser: emailCurrentUser, socket});
    roomToUsers.set(roomId, updatedUsers);
  });
}

export default joinRoomEndpoint;