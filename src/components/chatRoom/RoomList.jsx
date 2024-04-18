import { PlusSquareOutlined } from "@ant-design/icons";
import {
	Alert,
	Avatar,
	Button,
	Collapse,
	Dropdown,
	Menu,
	Modal,
	Spin,
	Typography,
	message,
} from "antd";
import {
	collection,
	deleteDoc,
	doc,
	getDocs,
	query,
	updateDoc,
	where,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useContext, useState } from "react";
import styled from "styled-components";
import avatarDefault from "../../../public/roomDefault.svg";
import { AppContext } from "../../context/AppProvider";
import { AuthContext } from "../../context/AuthContext";
import { db, storage } from "../../firebase/config";
const { Panel } = Collapse;
const { Link } = Typography;

const PanelStyled = styled(Panel)`
	&&& {
		.ant-collapse-header,
		p {
			color: white;
		}

		.ant-collapse-content-box {
			padding: 0 40px;
		}

		.add-room {
			color: white;
			padding: 0;
		}
	}
`;

const LinkStyled = styled(Link)`
	display: block;
	margin-bottom: 5px;
	color: white;
	&:hover {
		background-color: rgba(240, 240, 240, 0.5);
	}
	border-radius: 8px;
`;

export default function RoomList() {
	const { rooms, setIsAddRoomVisible, setIsSelectedRoomId } =
		useContext(AppContext);
	const {
		currentUser: { uid },
	} = useContext(AuthContext);
	//*************************************************** */
	const [selectedRoom, setSelectedRoom] = useState(null);
	const [isModalConfirmDeleteRoom, setIsModalConfirmDeleteRoom] =
		useState(false);
	const [isModalConfirmLeaveRoom, setIsModalConfirmLeaveRoom] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	//*************************************************** */
	//*************************************************** */
	//
	//
	//
	// khu vực xử lý delete room
	const handleDeleteRoom = () => {
		setIsModalConfirmDeleteRoom(true);
	};
	const handleModalDeleteRoomOk = async () => {
		try {
			setIsLoading(true);
			// remove all messages in room
			const querySnapshot = await getDocs(
				query(
					collection(db, "messages"),
					where("roomId", "==", selectedRoom.id),
				),
			);
			const deletePromises = [];
			querySnapshot.forEach((doc) => {
				deletePromises.push(deleteDoc(doc.ref));
			});
			await Promise.all(deletePromises);

			// remove rooms
			if (selectedRoom?.avatar !== "default") {
				const imgRef = ref(storage, `AvatarRoom/${selectedRoom?.avatarId}`);
				await deleteObject(imgRef).then(() => {
					message.info("remove avatar room successfull");
				});
			}
			await deleteDoc(doc(db, "rooms", selectedRoom.id));
			message.info("remove room successfull");
		} catch (error) {
			console.error("error : ", error);
		} finally {
			setIsLoading(false);
			setSelectedRoom(null);
			setIsModalConfirmDeleteRoom(false);
		}
	};
	const handleModalDeleteRoomCancel = () => {
		setSelectedRoom(null);
		setIsModalConfirmDeleteRoom(false);
	};
	//
	//
	//
	//
	//khu vực xử lý ra khỏi phòng
	const handleLeaveRoom = () => {
		if (selectedRoom?.members.length > 1) {
			setIsModalConfirmLeaveRoom(true);
		} else {
			setIsModalConfirmDeleteRoom(true);
		}
	};

	const handleModalLeaveRoomOk = async () => {
		try {
			setIsLoading(true);
			const seletedRoomRef = doc(db, "rooms", selectedRoom?.id);
			const newMemebers = selectedRoom.members.filter((item) => item !== uid);

			await updateDoc(seletedRoomRef, {
				members: newMemebers,
			});
			message.info("leave room successfull");
		} catch (error) {
			console.log("error", error);
		} finally {
			setIsLoading(false);
			setSelectedRoom(null);
			setIsModalConfirmLeaveRoom(false);
		}
	};
	const handleModalLeaveRoomCancel = () => {
		setSelectedRoom(null);
		setIsModalConfirmLeaveRoom(false);
	};
	//
	//
	//
	//
	// khu vực xử lý menu chuột phải
	const handleContextMenu = (e, room) => {
		e.preventDefault();
		setSelectedRoom(room);
	};

	const contextMenu = (
		<Menu>
			<Menu.Item key='leaveRoom' onClick={handleLeaveRoom}>
				Rời phòng
			</Menu.Item>
			<Menu.Item key='deleteRoom' onClick={handleDeleteRoom}>
				Xóa phòng
			</Menu.Item>
		</Menu>
	);

	//mở Modal thêm phòng
	const handleAddRoom = () => {
		setIsAddRoomVisible(true);
	};

	return (
		<>
			<Modal
				title='Xác nhận hủy phòng'
				open={isModalConfirmDeleteRoom}
				closable={false}
				onCancel={handleModalDeleteRoomCancel}
				onOk={handleModalDeleteRoomOk}>
				{isLoading ? <Spin /> : <Alert message={`${selectedRoom?.name}`} />}
			</Modal>

			<Modal
				title='Xác nhận ra khỏi phòng'
				open={isModalConfirmLeaveRoom}
				closable={false}
				onCancel={handleModalLeaveRoomCancel}
				onOk={handleModalLeaveRoomOk}>
				{isLoading ? <Spin /> : <Alert message={`${selectedRoom?.name}`} />}
			</Modal>

			<Collapse ghost defaultActiveKey={["1"]}>
				<PanelStyled header='Danh sách các phòng' key={1}>
					{rooms.map((room, index) => {
						return (
							<div
								key={index}
								onContextMenu={(e) => handleContextMenu(e, room)}>
								<Dropdown overlay={contextMenu} trigger={["contextMenu"]}>
									<div>
										<LinkStyled
											style={{
												color: "white",
											}}
											onClick={() => {
												setIsSelectedRoomId(room.id);
											}}>
											<Avatar
												style={{ marginRight: "10px" }}
												src={
													room?.avatar === "default"
														? avatarDefault
														: room?.avatar
												}
											/>
											{room.name}
										</LinkStyled>
										<p
											style={{
												width: "100%",
												border: "1px solid rgb(255, 255, 255,0.5)",
											}}></p>
									</div>
								</Dropdown>
							</div>
						);
					})}
					<Button
						type='text'
						icon={<PlusSquareOutlined />}
						className='add-room'
						onClick={handleAddRoom}>
						Thêm phòng
					</Button>
				</PanelStyled>
			</Collapse>
		</>
	);
}
