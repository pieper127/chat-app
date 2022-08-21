"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmailFromToken = exports.verifyJWT = exports.generateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_KEY = process.env.JWT_SECRET || "123456";
const tokenExpirationInSeconds = 36000;
;
function generateJWT(body) {
    return jsonwebtoken_1.default.sign(body, JWT_KEY, {
        expiresIn: tokenExpirationInSeconds,
    });
}
exports.generateJWT = generateJWT;
function verifyJWT(token) {
    console.log('token', token);
    if (token && token !== "null") {
        try {
            jsonwebtoken_1.default.verify(token, JWT_KEY);
            return { ok: true };
        }
        catch (e) {
            return {
                ok: false,
                err: "Token Expired"
            };
        }
    }
    console.log('token', token);
    return { ok: false, err: "UnAuthorized" };
}
exports.verifyJWT = verifyJWT;
function getEmailFromToken(token) {
    const body = jsonwebtoken_1.default.decode(token);
    if (body) {
        return body.email;
    }
    else {
        return '';
    }
}
exports.getEmailFromToken = getEmailFromToken;
