import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { Socket } from "socket.io";
import { IUser } from "../models/User.model";
import { verifyJWT } from "../api/jwt-service";

function authenticateJWT(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const valid = verifyJWT(authHeader);

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

export function getEmailFromToken(token: string): string {
    const body = jwt.decode(token);
    if (body) {
        return (body as IUser).email as string;
    } else {
        return '';
    }
}

// type is defined because socket.io doesn't export this type
type ExtendedError = any;
export function authenticateJWTForSocketIo(socket: Socket, next: (err?: ExtendedError | undefined) => void) {
    const authHeader = socket.handshake.auth.token;
    const valid = verifyJWT(authHeader);
    if (valid.ok) {
        next();
    } else {
        console.log(valid.err);
        next(new Error(valid.err));
    }
}


export default authenticateJWT;