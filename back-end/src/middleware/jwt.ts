import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { Socket } from "socket.io";

const JWT_KEY = process.env.JWT_SECRET || "123456";

function authenticateJWT(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const valid = checkValidity(authHeader);

    if (valid.ok) {
        const payload = jwt.decode(authHeader as string);
        (req as any).userEmail = (payload as any).email;
        next();
    } else {
        res
            .status(403)
            .send({ success: false, message: valid.err });
    }
}

// type is defined because socket.io doesn't export this type
type ExtendedError = any;
export function authenticateJWTForSockIo(socket: Socket, next: (err?: ExtendedError | undefined) => void) {
    const authHeader = socket.handshake.auth.token;
    const valid = checkValidity(authHeader);

    if (valid.ok) {
        next();
    } else {
        next(new Error(valid.err));
    }
}

interface Error<T> {
    ok: false;
    err: T;
}
interface Ok {
    ok: true;
}
type Result<T> = Error<T> | Ok;
function checkValidity(token: string | undefined): Result<string> {
    if (token && token !== "null") {
        const validatedToken = jwt.verify(token, JWT_KEY);

        if (!validatedToken) {
            return {
                ok: false,
                err: "Token Expired"
            };
        }
        return { ok: true };
    } 
    return { ok: false, err: "UnAuthorized" };
}

export default authenticateJWT;