import { randomUUID } from "crypto";
import Room from "../models/Room.model";

export async function createRoom(creator: string, roomId = randomUUID()) {
    const knownRoom = await Room.findOne({ roomId });

    if (knownRoom) return roomId;

    const room = new Room({
        users: [creator],
        messages: [],
        roomId: roomId,
    });
    await room.save();
    return roomId;
}

export async function joinRoom(user: string, roomId: string) {
    const room = await Room.findOne({ roomId });

    if (!room) return;

    const alreadyIn = room.users.some((u) => u == user);

    if (alreadyIn) return;
    

    await Room.updateOne(
    { roomId }, 
    { $push: { users: user } });
}

export async function addMessageToRoom(roomId: string, message: string) {
    await Room.updateOne(
    { roomId }, 
    { $push: { messages: message } });
}