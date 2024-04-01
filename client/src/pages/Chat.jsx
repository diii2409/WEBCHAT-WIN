/* eslint-disable no-unused-vars */

import { useContext } from "react";
import { Container, Stack } from "react-bootstrap";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import UserChat from "../components/chat/UserChat";
import PotentialChats from "../components/chat/PotentialChats";
import ChatBox from "../components/chat/ChatBox";

const Chat = () => {
	const { user } = useContext(AuthContext);
	const { userChats, isUserChatsLoading, userChatsError, updateCurrentChat } =
		useContext(ChatContext);

	return (
		<Container >
			<PotentialChats></PotentialChats>
			{userChats?.length < 1 ? null : (
				<Stack direction='horizontal' gap={0} className='align-items-start'>
					<Stack className='messages-box flex-grow-0 pe-3' gap={0}>
						{isUserChatsLoading && <p>Loading charts...</p>}
						{userChats?.map((chat, index) => {
							return (
								<div
									key={index}
									onClick={() => {
										updateCurrentChat(chat);
									}}>
									<UserChat chat={chat} user={user} />
								</div>
							);
						})}
					</Stack>
					<ChatBox />
				</Stack>
			)}
		</Container>
	);
};

export default Chat;
