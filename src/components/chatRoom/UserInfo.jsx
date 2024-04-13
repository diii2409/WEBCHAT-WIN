import { Avatar, Button, Typography } from "antd";
import styled from "styled-components";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useContext } from "react";

import { AuthContext } from "../../context/AuthContext";

const { Text } = Typography;

const WrapperStyled = styled.div`
	display: flex;
	justify-content: space-between;
	padding: 12px 16px;
	border-bottom: 1px solid rgba(82, 38, 83);

	.username {
		color: white;
		margin-left: 5px;
	}
`;

export default function UserInfo() {
	const handleLogout = async () => {
		await signOut(auth);
	};

	const {
		currentUser: { photoURL, displayName },
	} = useContext(AuthContext);

	return (
		<WrapperStyled>
			<div>
				<Avatar src={photoURL}>
					{photoURL ? "" : displayName.charAt(0).toUpperCase()}
				</Avatar>
				<Text className='username'>{displayName}</Text>
			</div>
			<Button ghost onClick={handleLogout}>
				Đăng xuất
			</Button>
		</WrapperStyled>
	);
}
