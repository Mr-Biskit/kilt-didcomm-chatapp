import { Request, Response } from "express";
import MessageModel from "../models/MessageModel";

export const addMessage = async (req: Request, res: Response) => {
    const { chatId, from, to, body, created_time, expired_time, type } =
        req.body;
    const message = new MessageModel(req.body);
    try {
        const result = await message.save();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

export const getMessages = async (req: Request, res: Response) => {
    const { chatId } = req.params;
    try {
        const result = await MessageModel.find({ chatId });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
};
