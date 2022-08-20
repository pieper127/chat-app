import mongoose, { Schema, Document } from "mongoose";
export interface IUser extends Document {
  email: String;
  password: string,
};
const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: false,
  }
});

const UserModel = mongoose.model<IUser>("User", UserSchema);
export default UserModel;