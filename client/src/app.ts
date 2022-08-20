import { io } from "socket.io-client";
import axios from "axios";

async function main() {
    const host = "localhost";
    const socket = io(`ws://${host}:3000`);

    const { data } = await axios.post(
        'http://localhost:3000/api/user/login',
        { email: "something@test.com", password: "something" }
    );


    socket.on("connect_error", (err) => {
        console.log(err instanceof Error); // true
        console.log(err.message); // not authorized
    });


    const socketAuthenticated = io(`ws://${host}:3000`, {
        auth: {
            token: (data).token,
        },
    });

    socketAuthenticated.emit("message-to-room", "something");
}
main()
    .then(() => { process.exit(0) })
    .catch((err) => { 
        console.log(err); 
        process.exit(1);
    });