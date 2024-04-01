/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { baseUrl, getRequest } from "../utils/services";

export const useFetchRecipientUser = (chat, user) => {
	const [recipientUser, setRecipientUdser] = useState(null);
	const [error, setError] = useState(null);

	const recipientId = chat?.members.find((id) => id !== user?._id);

	useEffect(() => {
		const getUser = async () => {
			if (!recipientId) return null;
			const response = await getRequest(`${baseUrl}/users/find/${recipientId}`);

			if (response.error) return setError(response);

			setRecipientUdser(response);
		};

		getUser();
	}, [recipientId]);

	return { recipientUser };
};
