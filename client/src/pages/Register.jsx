import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
	const {
		registerInfo,
		updateRegisterInfo,
		registerUser,
		registerError,
		isRegisterLoading,
	} = useContext(AuthContext);

	return (
		<>
			<Form onSubmit={registerUser} style={{ display: "grid", justifyContent: "center", paddingTop: "130px" }}>
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
							<h2 style={{ textAlign: "center", color: "black", fontFamily: "-moz-initial" }}>REGISTER</h2>

							<Form.Control
								type='text'
								placeholder='Name'
								onChange={(e) => {
									updateRegisterInfo({
										...registerInfo,
										name: e.target.value.trim(),
									});
								}}
							/>
							<Form.Control
								type='email'
								placeholder='Email'
								onChange={(e) => {
									updateRegisterInfo({
										...registerInfo,
										email: e.target.value.trim(),
									});
								}}
							/>
							<Form.Control
								type='text'
								placeholder='password'
								onChange={(e) => {
									updateRegisterInfo({
										...registerInfo,
										password: e.target.value,
									});
								}}
							/>
							<Button variant='primary' type='submit' style={{ backgroundColor: '#fb6f92' }}>
								{isRegisterLoading ? "Creating your account..." : "Register"}
							</Button>

							{registerError?.error && (
								<Alert variant='danger'>
									<p>{registerError.message}</p>
								</Alert>
							)}
						</Stack>
					</Col>
				</Row>
			</Form>
		</>
	);
};

export default Register;
