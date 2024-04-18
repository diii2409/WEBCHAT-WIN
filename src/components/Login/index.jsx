// import React from "react";
import { Button, Col, Row, Typography } from "antd";
import {
	FacebookAuthProvider,
	GoogleAuthProvider,
	getAdditionalUserInfo,
	signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom"; // Sử dụng useNavigate thay vì useHistory
import styled from "styled-components";
import chatIcon from "../../../public/chatIcon.svg";
import facebookIcon from "../../../public/facebook.svg";
import googleIcon from "../../../public/google.svg";
import { auth } from "../../firebase/config";
import { addDocument, generateKeywords } from "../../firebase/service";

const { Title } = Typography;

const fbProvider = new FacebookAuthProvider();
const googleProvider = new GoogleAuthProvider();

const ContainerLoginStyled = styled.div`
	height: 100%;
	width: 100%;
	display: flex;
	margin: auto;
	background: linear-gradient(45deg, rgb(9, 132, 184), rgb(145, 222, 221));
`;

export default function Login() {
	const navigate = useNavigate(); // Sử dụng useNavigate

	const handleLogin = async (provider) => {
		try {
			const result = await signInWithPopup(auth, provider);
			const { isNewUser } = getAdditionalUserInfo(result);
			const { providerId, user } = result;
			if (isNewUser) {
				addDocument("users", {
					displayName: user.displayName,
					email: user.email,
					photoURL: user.photoURL,
					uid: user.uid,
					providerId: providerId,
					keywords: generateKeywords(user.displayName?.toLowerCase()),
				});
			}

			auth.onAuthStateChanged((user) => {
				if (user) {
					navigate("/");
				}
			});
		} catch (error) {
			console.error("Error signing in:", error);
		}
	};

	return (
		<ContainerLoginStyled>
			<Row
				className='container__login'
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					width: "100%",
				}}>
				<Col
					span={4}
					style={{
						background: "white",
						padding: "12px",
						borderRadius: "10px",
						boxShadow: "10px 10px #2d92d1",
					}}>
					<img
						src={chatIcon}
						style={{
							width: "85px",
							display: "flex",
							margin: "auto",
							borderRadius: "15px",
							boxShadow: "4px 4px #ade8f4",
						}}
					/>
					<Title style={{ textAlign: "center", color: "" }} level={4}></Title>
					<Button
						style={{
							width: "85%",
							display: "flex",
							margin: "auto",
						}}
						onClick={() => handleLogin(googleProvider)}>
						<img
							src={googleIcon}
							width='22px'
							style={{
								display: "inline-block",
								marginRight: "12px",
							}}
						/>
						<p
							style={{
								whiteSpace: "nowrap",
								overflow: "hidden",
								textOverflow: "ellipsis",
							}}>
							Đăng nhập bằng Google
						</p>
					</Button>
					<Title style={{ textAlign: "center", color: "" }} level={4}></Title>
					<Button
						style={{
							width: "85%",
							display: "flex",
							margin: "auto",
						}}
						onClick={() => handleLogin(fbProvider)}>
						<img
							src={facebookIcon}
							width='22px'
							style={{
								display: "inline-block",
								marginRight: "12px",
							}}
						/>
						<p
							style={{
								whiteSpace: "nowrap",
								overflow: "hidden",
								textOverflow: "ellipsis",
							}}>
							Đăng nhập bằng Facebook
						</p>
					</Button>
				</Col>
			</Row>
		</ContainerLoginStyled>
	);
}
