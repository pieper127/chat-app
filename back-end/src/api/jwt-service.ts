import jwt from "jsonwebtoken";

const JWT_KEY = process.env.JWT_SECRET || "123456";
const tokenExpirationInSeconds = 36000;

interface JWTBody {
    email: string,
    password: string,
};

type JWTToken = string;

export function generateJWT(body: JWTBody): JWTToken {
    return jwt.sign(body, JWT_KEY, {
        expiresIn: tokenExpirationInSeconds,
    });
}