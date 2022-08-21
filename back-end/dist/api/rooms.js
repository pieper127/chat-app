"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMessageToRoom = exports.joinRoom = exports.createRoom = void 0;
const crypto_1 = require("crypto");
const Room_model_1 = __importDefault(require("../models/Room.model"));
async function createRoom(creator, roomId = (0, crypto_1.randomUUID)()) {
    const knownRoom = await Room_model_1.default.findOne({ roomId });
    if (knownRoom)
        return roomId;
    const room = new Room_model_1.default({
        users: [creator],
        messages: [],
        roomId: roomId,
    });
    await room.save();
    return roomId;
}
exports.createRoom = createRoom;
async function joinRoom(user, roomId) {
    const room = await Room_model_1.default.findOne({ roomId });
    if (!room)
        return;
    const alreadyIn = room.users.some((u) => u == user);
    if (alreadyIn)
        return;
    await Room_model_1.default.updateOne({ roomId }, { $push: { users: user } });
}
exports.joinRoom = joinRoom;
async function addMessageToRoom(roomId, message) {
    await Room_model_1.default.updateOne({ roomId }, { $push: { messages: message } });
}
exports.addMessageToRoom = addMessageToRoom;
