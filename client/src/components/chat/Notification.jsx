import { useContext, useState } from "react";
import NotificaitonIcon from "../../assets/chat-svgrepo.svg";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import { unReadeNotificationsFuc } from "../../hooks/unReadNotifcationsFuc";
import moment from "moment";

const Notificaiton = () => {
	const [isOpen, setIsOpen] = useState(false);
	const { user } = useContext(AuthContext);
	const {
		notifications,
		userChats,
		allUsers,
		markAllNotificationsAsRead,
		markNotificationAsRead,
	} = useContext(ChatContext);

	const unReadeNotifications = unReadeNotificationsFuc(notifications);
	const modifiedNotifications = notifications.map((n) => {
		const sender = allUsers.find((user) => user._id === n.senderId);

		return {
			...n,
			senderName: sender?.name,
		};
	});
	const toggleOpen = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div className='notifications'>
			<div className='notifications-icon' onClick={toggleOpen}>
				<img src={NotificaitonIcon} width={30} />
				{unReadeNotifications?.length === 0 ? null : (
					<span className='notification-count'>
						<span>{unReadeNotifications?.length}</span>
					</span>
				)}
			</div>
			{isOpen && (
				<div className='notifications-box'>
					<div className='notifications-header'>
						<h3>Notifications</h3>
						<div
							className='mark-as-read'
							onClick={() => markAllNotificationsAsRead(notifications)}>
							Make all as read
						</div>
					</div>
					{modifiedNotifications?.length === 0 && (
						<span className='notification'>No notification yet</span>
					)}
					{modifiedNotifications &&
						modifiedNotifications.map((n, index) => (
							<div
								key={index}
								className={n.isRead ? "notification" : "notification not-read"}
								onClick={() => {
									markNotificationAsRead(n, userChats, user, notifications);
									setIsOpen(false);
								}}>
								<span>{`${n.senderName} sent you new message`}</span>
								<span className='notification-time'>
									{moment(n.date).calendar()}
								</span>{" "}
							</div>
						))}
				</div>
			)}
		</div>
	);
};

export default Notificaiton;
