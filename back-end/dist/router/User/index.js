"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt = __importStar(require("bcrypt"));
const User_model_1 = __importDefault(require("../../models/User.model"));
const jwt_service_1 = require("../../api/jwt-service");
const userRouter = (0, express_1.Router)();
userRouter.post("/register", async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const newUser = new User_model_1.default({
            email: req.body.email,
            password: hashedPassword,
            token: (0, jwt_service_1.generateJWT)(req.body),
        });
        const user = await newUser.save();
        res.status(200).json(user);
    }
    catch (err) {
        res.status(500).json(err);
    }
});
userRouter.post("/login", async (req, res) => {
    try {
        const mightBeUser = await User_model_1.default.findOne({ email: req.body.email });
        if (!mightBeUser) {
            res.status(404).json("user can not be found or the password is incorrect");
        }
        const user = mightBeUser;
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            res.status(404).json("user can not be found or the password is incorrect");
        }
        const updatedToken = (0, jwt_service_1.generateJWT)({ email: user.email, password: user.password });
        res.status(200).json({ ...user, token: updatedToken });
    }
    catch (err) {
        res.status(500).json(err);
    }
});
exports.default = userRouter;
