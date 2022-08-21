import mongoose, { Schema, Document } from "mongoose";
export interface IRoom extends Document {
  users: string[];
  messages: string[];
  roomId: string;
};

const roomSchema: Schema = new Schema({
  users: {
    type: Array,
    required: true,
  },
  messages: {
    type: Array,
    required: true,
  },
  roomId: {
    type: String,
    required: true,
    unique: true,
  }
});

const RoomModel = mongoose.model<IRoom>("Room", roomSchema);
export default RoomModel;
