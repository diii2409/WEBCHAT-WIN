/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/rules-of-hooks */
import { Stack } from "react-bootstrap";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import avatar from "../../assets/avtDefault.svg";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { unReadeNotificationsFuc } from "../../hooks/unReadNotifcationsFuc";
import { useFetchLatestMessage } from "../../hooks/useFetchLatestMessage";
import moment from "moment";

const UserChat = ({ chat, user }) => {
	const { recipientUser } = useFetchRecipientUser(chat, user);
	const { onlineUsers, notifications, markThisUserNotificationsAsRead } =
		useContext(ChatContext);
	const { latestMessage } = useFetchLatestMessage(chat);

	const unReadeNotifications = unReadeNotificationsFuc(notifications);
	const thisUserNotifications = unReadeNotifications?.filter(
		(n) => n.senderId === recipientUser?._id,
	);

	const isOnline = onlineUsers.some(
		(user) => user.userId === recipientUser?._id,
	) && <span className='user-online'></span>;

	// const truncateText = (text) => {
	// 	let shortText = text.substring(0, 20);
	// 	if (text.length > 20) {
	// 		shortText = shortText + "...";
	// 	}

	// 	return shortText;
	// };

	return (
		<Stack
			direction='horizontal'
			gap={3}
			className='user-card align-items-center p-2 justify-content-between'
			role='button'
			onClick={() => {
				if (thisUserNotifications?.length != 0) {
					markThisUserNotificationsAsRead(thisUserNotifications, notifications);
				}
			}}>
			<div className='d-flex '>
				<div className='me-2'>
					<img src={avatar} height={35} style={{ borderRadius: "50%" }} />
				</div>
				<div className='text-content'>
					<div className='name'>{recipientUser?.name} </div>
					<div
						className='text'
						style={{
							whiteSpace: "nowrap",
							overflow: "hidden",
							textOverflow: "ellipsis",
						}}>
						{latestMessage?.text && <span>{latestMessage?.text}</span>}
					</div>
				</div>
			</div>
			<div className='d-flex flex-column align-items-end'>
				{latestMessage?.createdAt && (
					<div className='date'>
						{moment(latestMessage?.createdAt).calendar()}
					</div>
				)}
				{thisUserNotifications?.length > 0 && (
					<div className='this-user-notifications'>
						{thisUserNotifications?.length}
					</div>
				)}
				{/* <span className='user-online'></span> */}
				{isOnline}
			</div>
		</Stack>
	);
};

export default UserChat;
