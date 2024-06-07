import express from "express";
import RoomController from "../controller/room.C";

const router = express.Router();

/**
 * @description POST /api/room
 */

router.post("/", RoomController.createRoom);
