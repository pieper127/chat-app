import jwt from "jsonwebtoken";
import { IUser } from "../models/User.model";

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

interface Error<T> {
    ok: false;
    err: T;
}
interface Ok {
    ok: true;
}
type Result<T> = Error<T> | Ok;
export function verifyJWT(token: string | undefined): Result<string> {
    if (token && token !== "null") {
        try {
            jwt.verify(token, JWT_KEY);
            return { ok: true };
        } catch (e) {
                return {
                    ok: false,
                    err: "Token Expired"
                };
        }
    }
    return { ok: false, err: "UnAuthorized" };
}

export function getEmailFromToken(token: string): string {
    const body = jwt.decode(token);
    if (body) {
        return (body as IUser).email as string;
    } else {
        return '';
    }
}