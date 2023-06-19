import mongoose from "mongoose";
import { messageModel } from "./models/message.model.js";

class MessageManager {
    connection = mongoose.connect("mongodb+srv://Juamba02:Juamba02@cluster0.qfqgbxb.mongodb.net/?retryWrites=true&w=majority");
    
    saveMessage = async (data) => {
        let result = await messageModel.create(data);
    }

    getMessages = async () => {
        let result = await messageModel.find().lean()
        return result;
    }
}

export default MessageManager;