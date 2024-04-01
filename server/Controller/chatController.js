const chatModel = require("../Models/chatModel");

const creatChat = async (req, res) => {
	const { firstId, secondId } = req.body;

	try {
		const chat = await chatModel.findOne({
			members: { $all: [firstId, secondId] },
		});

		if (chat) return res.status(200).json(chat);

		const newChat = new chatModel({
			members: [firstId, secondId],
		});

		const response = await newChat.save();

		res.status(200).json(response);
	} catch (error) {
		console.log("\nError : " + error.toString());
		res.status(500).json("Error : " + error);
	}
};

const findUserChats = async (req, res) => {
	const userId = req.params.userId;

	try {
		const chats = await chatModel.find({
			members: userId,
		});

		res.status(200).json(chats);
	} catch (error) {
		console.log("\nError : " + error.toString());
		res.status(500).json("Error : " + error);
	}
};

const findChat = async (req, res) => {
	const { firstId, secondId } = req.params;

	try {
		const chat = await chatModel.find({
			members: { $all: [firstId, secondId] },
		});

		res.status(200).json(chat);
	} catch (error) {
		console.log("\nError : " + error.toString());
		res.status(500).json("Error : " + error);
	}
};

module.exports = { creatChat, findChat, findUserChats };
