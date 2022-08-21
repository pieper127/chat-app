import { io } from "socket.io-client";
import axios from "axios";
import { randomUUID } from "crypto";

const host = process.env.HOST || "localhost";

axios.post(
    `http://${host}:3000/api/user/register`,
    { email: randomUUID(), password: "something" }
).then(({ data }) => {
    const token = data.token;
    const socketauthenticated = io(`ws://${host}:3000`, {
        auth: {
            token,
        },
    });
    
    socketauthenticated.emit('join-room', { roomId: 'main-room' });

    socketauthenticated.on('message-from-room', (message) => {
        console.log(message);
    })
});

