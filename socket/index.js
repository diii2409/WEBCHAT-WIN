const { Server } = require("socket.io");

const io = new Server({ cors: "http://localhost:3000" });

let onLineUsers = [];

io.on("connection", (socket) => {
	console.log("new connection ", socket.id);
	socket.on("addNewUser", (userId) => {
		!onLineUsers.some((user) => user.userId === userId) &&
			onLineUsers.push({
				userId,
				socketId: socket.id,
			});

		console.log("onLineUsers : ", onLineUsers);

		io.emit("getOnlineUsers", onLineUsers);
	});

	socket.on("sendMessage", (message) => {
		const user = onLineUsers.find(
			(user) => user.userId === message.recipientId,
		);

		if (user) {
			io.to(user.socketId).emit("getMessage", message);
			io.to(user.socketId).emit("getNotification", {
				senderId: message.senderId,
				isRead: false,
				date: new Date(),
			});
		}
	});

	socket.on("disconnect", () => {
		onLineUsers = onLineUsers.filter((user) => user.socketId !== socket.id);
		console.log("user disconnected ", socket.id);
		io.emit("getOnlineUsers", onLineUsers);
	});
});

io.listen(3000);
