import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
    {
        id: {
            type: String,
        },
        type: {
            type: String,
        },
        from: {
            type: String,
        },
        to: {
            type: Array,
        },
        created_time: {
            type: String,
        },
        expired_time: {
            type: String,
        },
        body: {
            text: {
                type: String,
            },
        },
        chatId: {
            type: String,
        },
        senderId: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const MessageModel = mongoose.model("Message", MessageSchema);
export default MessageModel;
