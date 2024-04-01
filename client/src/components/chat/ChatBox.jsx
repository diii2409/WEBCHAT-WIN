import { useContext, useEffect, useRef, useState } from "react";
import moment from "moment";
import { Stack } from "react-bootstrap";
import InputEmoji from "react-input-emoji";

import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import sendFillIcon from "../../assets/send-fill.svg";

const ChatBox = () => {
	const { user } = useContext(AuthContext);
	const { currentChat, messages, isMessagesLoading, sendTextMessage } =
		useContext(ChatContext);
	const { recipientUser } = useFetchRecipientUser(currentChat, user);

	const [textMessage, setTextMessage] = useState("");

	const scroll = useRef();

	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			if (textMessage.trim() !== "") {
				sendTextMessage(textMessage, user, currentChat?._id, setTextMessage);
				console.log("has message", textMessage);
			}
		}
	};

	useEffect(() => {
		scroll.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	if (!recipientUser)
		return (
			<p style={{ textAlign: "center", width: "100%" }}>
				No conversation selection yet....
			</p>
		);

	if (isMessagesLoading)
		return (
			<p style={{ textAlign: "center", width: "100%" }}>Loading chat...</p>
		);

	return (

		<Stack gap={4} className='chat-box'>
			<div className='chat-header'>
				<strong>{recipientUser?.name}</strong>
			</div>
			<Stack gap={2} className='messages'>
				{messages &&
					messages.map(
						(message, index) =>
							message.chatId === currentChat._id && (
								<Stack
									key={index}
									className={`${message?.senderId === user?._id
										? "message self align-self-end flex-grow-0"
										: "message align-self-start flex-grow-0"
										}`}
									ref={index === messages.length - 1 ? scroll : null}>
									<span>{message.text}</span>
									<span className='message-footer'>
										{moment(message.createdAt).calendar()}
									</span>
								</Stack>
							),
					)}
			</Stack>
			<Stack direction='horizontal' gap={3} className='chat-input flex-grow-0'>
				<InputEmoji
					value={textMessage}
					onChange={setTextMessage}
					fontFamily='nunito'
					borderColor='rgba(72,112,223,0.2)'
					onKeyDown={handleKeyDown}
				/>
				<button
					className='send-btn'
					onClick={() =>
						sendTextMessage(textMessage, user, currentChat._id, setTextMessage)
					}>
					<img src={sendFillIcon} />
				</button>
			</Stack>
		</Stack>
	);
};

export default ChatBox;
