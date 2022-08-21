"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const connect_db_1 = __importDefault(require("./connect-db"));
const router_1 = __importDefault(require("./router"));
const http_1 = __importDefault(require("http"));
const rooms_1 = require("./api/rooms");
const socket_1 = require("./socket");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const PORT = 3000;
const db = process.env.MONGO_URL || "mongodb://root:root@localhost:27017/";
(0, connect_db_1.default)({ db });
(0, socket_1.setupSocket)(server);
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use('/api', router_1.default);
// start express service
server.listen(PORT, () => {
    console.log(`server is running on PORT ${PORT}`);
    // create default room for testing
    (0, rooms_1.createRoom)('undefined', 'main-room');
});
