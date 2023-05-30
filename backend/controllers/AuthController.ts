import { Request, Response } from "express";
import UserModel from "../models/UserModel";

export const registerUser = async (req: Request, res: Response) => {
    const { did } = req.body;
    const user = await UserModel.findOne({ did });
    if (!user) {
        const user = await UserModel.create({
            did,
        });
        res.status(201).json({ message: user });
    } else {
        res.status(400).json({ message: "User already exists" });
    }
};
export const loginUser = async (req: Request, res: Response) => {
    const { did } = req.body;

    const user = await UserModel.findOne({ did });
    if (!user) {
        res.status(404).json({ message: "User not found" });
    } else {
        res.status(200).json({ message: user });
    }
};
