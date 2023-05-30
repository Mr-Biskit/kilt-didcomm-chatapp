import { Request, Response } from "express";
import UserModel from "../models/UserModel";

export const getUser = async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
        const user = await UserModel.findById(id);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json("No such User");
        }
    } catch (error) {
        res.status(500).json(error);
    }
};
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        let users = await UserModel.find();
        users = users.map((user) => {
            return user;
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json(error);
    }
};
