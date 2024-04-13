// import React from "react";
import { useNavigate } from "react-router-dom"; // Sử dụng useNavigate thay vì useHistory
import {
	signInWithPopup,
	GoogleAuthProvider,
	FacebookAuthProvider,
	getAdditionalUserInfo,
} from "firebase/auth";
import { db, auth } from "../../firebase/config";
import { addDoc, collection } from "firebase/firestore";
import { Row, Col, Button, Typography } from "antd";
import { addDocument, generateKeywords } from "../../firebase/service";

const { Title } = Typography;

const fbProvider = new FacebookAuthProvider();
const googleProvider = new GoogleAuthProvider();

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
		<div>
			<Row justify='center' style={{ height: 800 }}>
				<Col span={8}>
					<Title style={{ textAlign: "center" }} level={3}>
						WIN CHAT
					</Title>
					<Button
						style={{ width: "100%", marginBottom: 5 }}
						onClick={() => handleLogin(googleProvider)}>
						Đăng nhập bằng Google
					</Button>
					<Button
						style={{ width: "100%" }}
						onClick={() => handleLogin(fbProvider)}>
						Đăng nhập bằng Facebook
					</Button>
				</Col>
			</Row>
		</div>
	);
}
