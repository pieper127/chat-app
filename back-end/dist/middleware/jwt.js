"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWTForSocketIo = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_service_1 = require("../api/jwt-service");
function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    const valid = (0, jwt_service_1.verifyJWT)(authHeader);
    if (valid.ok) {
        const payload = jsonwebtoken_1.default.decode(authHeader);
        req.userEmail = payload.email;
        next();
    }
    else {
        res
            .status(403)
            .send({ success: false, message: valid.err });
    }
}
function authenticateJWTForSocketIo(socket, next) {
    const authHeader = socket.handshake.auth.token;
    const valid = (0, jwt_service_1.verifyJWT)(authHeader);
    if (valid.ok) {
        next();
    }
    else {
        console.log(valid.err);
        next(new Error(valid.err));
    }
}
exports.authenticateJWTForSocketIo = authenticateJWTForSocketIo;
exports.default = authenticateJWT;
