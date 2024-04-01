const express = require("express");
const {
	creatChat,
	findChat,
	findUserChats,
} = require("../Controller/chatController");

const router = express.Router();

router.post("/", creatChat);
router.get("/:userId", findUserChats);
router.get("/find/:firstId/:secondId", findChat);

module.exports = router;
