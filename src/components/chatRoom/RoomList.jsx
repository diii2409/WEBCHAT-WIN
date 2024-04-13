import { PlusSquareOutlined } from "@ant-design/icons";
import { Avatar, Button, Collapse, Typography } from "antd";
import { useContext } from "react";
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
`;

export default function RoomList() {
	const { rooms } = useContext(AppContext);
	const { setIsAddRoomVisible, setIsSelectedRoomId } = useContext(AppContext);

	const handleAddRoom = () => {
		setIsAddRoomVisible(true);
	};
	return (
		<Collapse ghost defaultActiveKey={["1"]}>
			<PanelStyled header='Danh sách các phòng' key={1}>
				{rooms.map((room, index) => {
					return (
						<LinkStyled
							key={index}
							onClick={() => {
								setIsSelectedRoomId(room.id);
							}}>
							<Avatar
								style={{ marginRight: "10px" }}
								src={room?.avatar === "default" ? avatarDefault : room?.avatar}
							/>
							{room.name}
						</LinkStyled>
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
