import {
	Alert,
	Avatar,
	Button,
	Dropdown,
	Menu,
	Modal,
	Spin,
	Typography,
} from "antd";
import { signOut } from "firebase/auth";
import { useContext, useState } from "react";
import styled from "styled-components";
import { auth } from "../../firebase/config";

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
	const {
		currentUser: { photoURL, displayName },
	} = useContext(AuthContext);

	const [isModalConfirmLogOut, setIsModalConfirmLogOut] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	// khu vực này xử lý khi chuột phải
	const handleLogout = () => {
		setIsModalConfirmLogOut(true);
	};
	const handleModalLogOutOk = async () => {
		try {
			setIsLoading(true);
			await signOut(auth);
			setIsModalConfirmLogOut(false);
		} catch (error) {
			console.log("error", error);
		} finally {
			setIsLoading(false);
			setIsModalConfirmLogOut(false);
		}
	};
	const handleModalLogOutCancel = () => {
		setIsModalConfirmLogOut(false);
	};

	const contextMenu = (
		<Menu>
			<Menu.Item key='logOut' onClick={handleLogout}>
				Thay đổi tài khoản
			</Menu.Item>
		</Menu>
	);

	return (
		<div>
			<Modal
				open={isModalConfirmLogOut}
				title='Xác nhận đăng xuất tài khoản'
				closable={false}
				onOk={handleModalLogOutOk}
				onCancel={handleModalLogOutCancel}>
				{isLoading ? <Spin /> : <Alert message={`${displayName}`} />}
			</Modal>
			<WrapperStyled>
				<div onContextMenu={(e) => e.preventDefault()}>
					<Dropdown overlay={contextMenu} trigger={["contextMenu"]}>
						<div>
							<Avatar src={photoURL}>
								{photoURL ? "" : displayName.charAt(0).toUpperCase()}
							</Avatar>
							<Text className='username'>{displayName}</Text>
						</div>
					</Dropdown>
				</div>
				<Button ghost>Tìm phòng</Button>
			</WrapperStyled>
		</div>
	);
}
