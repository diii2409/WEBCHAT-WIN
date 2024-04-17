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

import { AppContext } from "../../context/AppProvider";

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
	//*************************************************** */
	const { setIsFindRoomOpen } = useContext(AppContext);
	const [isModalConfirmSginOut, setIsModalConfirmSginOut] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	//*************************************************** */
	//*************************************************** */
	//
	//
	// Xử lý đăng xuất
	const handleModalSginOutOk = async () => {
		try {
			setIsLoading(true);
			await signOut(auth);
			setIsModalConfirmSginOut(false);
		} catch (error) {
			console.log("error", error);
		} finally {
			setIsLoading(false);
			setIsModalConfirmSginOut(false);
		}
	};
	const handleModalSginOutCancel = () => {
		setIsModalConfirmSginOut(false);
	};
	//
	//
	//
	//
	// khu vực này xử lý khi chuột phải
	const handleSginOut = () => {
		setIsModalConfirmSginOut(true);
	};
	const contextMenu = (
		<Menu>
			<Menu.Item key='SginOut' onClick={handleSginOut}>
				Thay đổi tài khoản
			</Menu.Item>
		</Menu>
	);
	//
	//
	//
	// khu vực xử lý Modal tìm phòng
	const handleFindRoom = () => {
		setIsFindRoomOpen(true);
	};
	return (
		<div>
			<Modal
				open={isModalConfirmSginOut}
				title='Xác nhận đăng xuất tài khoản'
				closable={false}
				onOk={handleModalSginOutOk}
				onCancel={handleModalSginOutCancel}>
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
				<Button ghost onClick={handleFindRoom}>
					Tìm phòng
				</Button>
			</WrapperStyled>
		</div>
	);
}
