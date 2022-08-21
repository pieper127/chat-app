"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
const axios_1 = __importDefault(require("axios"));
const crypto_1 = require("crypto");
const sendMessage = (socket) => {
    socket.emit('message-to-room', { message: (0, crypto_1.randomUUID)(), roomId: 'main-room' });
};
axios_1.default.post('http://localhost:3000/api/user/register', { email: (0, crypto_1.randomUUID)(), password: "something" }).then(({ data }) => {
    const token = data.token;
    const socketauthenticated = (0, socket_io_client_1.io)(`ws://localhost:3000`, {
        auth: {
            token,
        },
    });
    socketauthenticated.emit('join-room', { roomId: 'main-room' });
    setInterval(() => sendMessage(socketauthenticated), 1000);
});
