import express from "express";
import { addMessage, getMessages } from "../controllers/MessageController";

const router = express.Router();

router.post("/addMessage", addMessage);
router.get("/:chatId", getMessages);

export default router;
