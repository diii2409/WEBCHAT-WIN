import { Col, Row } from "antd";
import styled from "styled-components";
import RoomList from "./RoomList";
import UserInfo from "./UserInfo";

const SidebarStyled = styled.div`
	background: rgb(32, 98, 119);
	color: white;
	height: 100vh;
`;

export default function Sidebar() {
	return (
		<SidebarStyled>
			<Row>
				<Col span={24}>
					<UserInfo />
				</Col>
				<Col span={24}>
					<RoomList />
				</Col>
			</Row>
		</SidebarStyled>
	);
}
