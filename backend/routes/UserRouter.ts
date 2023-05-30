import { getAllUsers, getUser } from "../controllers/UserController";
import express from "express";
const router = express.Router();

router.get("/:id", getUser);
router.get("/", getAllUsers);

export default router;
