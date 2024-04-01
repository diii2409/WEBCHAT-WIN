import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";

import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

const Login = () => {
	const { loginInfo, updateLoginInfo, loginUser, loginError, isLoginLoading } =
		useContext(AuthContext);
	return (
		<>
			<Form onSubmit={loginUser}
				style={{
					display: "grid",
					justifyContent: "center",
					paddingTop: "130px"
				}}>
				<Row
					style={{
						height: "400px",
						justifyContent: "center",
						paddingTop: "50px",
						backgroundColor: "#f8f9fa",
						width: "400px",
						borderRadius: "20px",
					}}>
					<Col xs='9'>
						<Stack gap='3'>
							<h2 style={{ textAlign: "center", color: "black", fontFamily: "-moz-initial" }}>LOGIN</h2>

							<Form.Control
								type='email'
								placeholder='Email'
								onChange={(e) => {
									updateLoginInfo({
										...loginInfo,
										email: e.target.value.trim(),
									});
								}}
							/>
							<Form.Control
								type='password'
								placeholder='password'
								onChange={(e) => {
									updateLoginInfo({ ...loginInfo, password: e.target.value });
								}}
							/>
							<Button variant='primary' type='submit' style={{ backgroundColor: '#fb6f92' }}>
								{isLoginLoading ? "Wating..." : "Register"}
							</Button>

							{loginError?.error && (
								<Alert variant='danger'>
									<p>{loginError.message}</p>
								</Alert>
							)}
						</Stack>
					</Col>
				</Row>
			</Form >
		</>
	);
};

export default Login;
