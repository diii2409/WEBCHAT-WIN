import { PlusSquareOutlined } from "@ant-design/icons";
import { Avatar, Button, Collapse, Dropdown, Menu, Typography } from "antd";
import { useContext, useState } from "react";
import styled from "styled-components";
import avatarDefault from "../../../public/vite.svg";
import { AppContext } from "../../context/AppProvider";
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
		background-color: #f0f0f0;
	}
	border-radius: 8px;
`;

export default function RoomList() {
	const { rooms } = useContext(AppContext);
	const { setIsAddRoomVisible, setIsSelectedRoomId } = useContext(AppContext);
	const [contextMenuVisible, setContextMenuVisible] = useState(false);

	const [selectedRoom, setSelectedRoom] = useState(null);

	const handleContextMenu = (e, room) => {
		e.preventDefault();
		setContextMenuVisible(!contextMenuVisible);
		setSelectedRoom(room);
	};

	const contextMenu = (
		<Menu>
			<Menu.Item key='delete'>Xóa nhóm</Menu.Item>
		</Menu>
	);

	const handleAddRoom = () => {
		setIsAddRoomVisible(true);
	};

	return (
		<Collapse ghost defaultActiveKey={["1"]}>
			<PanelStyled header='Danh sách các phòng' key={1}>
				{rooms.map((room, index) => {
					return (
						<div key={index} onContextMenu={(e) => handleContextMenu(e, room)}>
							<Dropdown overlay={contextMenu} trigger={["contextMenu"]}>
								<LinkStyled
									onClick={() => {
										setIsSelectedRoomId(room.id);
									}}>
									<Avatar
										style={{ marginRight: "10px" }}
										src={
											room?.avatar === "default" ? avatarDefault : room?.avatar
										}
									/>
									{room.name}
								</LinkStyled>
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
	);
}
