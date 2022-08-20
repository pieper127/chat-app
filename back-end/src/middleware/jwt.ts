import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const JWT_KEY = process.env.JWT_SECRET || "123456";

function authenticateJWT(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader !== "null") {
        jwt.verify(authHeader, JWT_KEY, (err: any, user: any) => {
            if (err) {
                return res
                    .status(403)
                    .send({ success: false, message: "Token Expired" });
            }
            (req as any).user = user;
            next();
        })
    } else {
        res.status(403).json({ success: false, message: "UnAuthorized" });
    }
}
export default authenticateJWT;