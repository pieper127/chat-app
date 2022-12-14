import { Router } from "express";
import * as bcrypt from "bcrypt";
import User, { IUser }  from "../../models/User.model";
import { generateJWT } from "../../api/jwt-service";

const userRouter = Router();

userRouter.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      email: req.body.email,
      password: hashedPassword,
      token: generateJWT(req.body),
    });

    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const mightBeUser = await User.findOne({ email: req.body.email });

    if (!mightBeUser) {
      res.status(404).json("user can not be found or the password is incorrect");
    }
    const user = mightBeUser as IUser;


    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) {
      res.status(404).json("user can not be found or the password is incorrect");
    }

    const updatedToken = generateJWT({ email: user.email as string, password: user.password});

    res.status(200).json({ ...user, token: updatedToken });
  } catch (err) {
    res.status(500).json(err);
  }
});

export default userRouter;