export const unReadeNotificationsFuc = (notifications) => {
	return notifications.filter((n) => !n.isRead);
};
