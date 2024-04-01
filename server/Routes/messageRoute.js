const express = require("express");
const {
	creatMessage,
	getMessages,
} = require("../Controller/messageController");

const router = express.Router();

router.post("/", creatMessage);
router.get("/:chatId", getMessages);

module.exports = router;
