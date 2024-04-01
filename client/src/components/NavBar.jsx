import { useContext } from "react";
import { Container, Nav, Navbar, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Notificaiton from "./chat/Notification";

const NavBar = () => {
	const { user, logoutUser } = useContext(AuthContext);

	return (
		<Navbar bg='dark' className='mb-4' >
			<Container>
				<h2>
					<Link to='/' className='link-light text-decoration-none'>
						Chat App
					</Link>
				</h2>
				{user?.name && (
					<span className='text-warning'> Logged is as {user?.name}</span>
				)}

				<Nav>
					<Stack direction='horizontal' gap={3}>
						{user && (
							<>
								<Notificaiton />
								<Link
									to='/login'
									className='link-light text-decoration-none'
									onClick={logoutUser}>
									Logout
								</Link>
							</>
						)}
						{!user && (
							<>
								<Link to='/login' className='link-light text-decoration-none'>
									Login
								</Link>
								<Link
									to='/register'
									className='link-light text-decoration-none'>
									Register
								</Link>
							</>
						)}
					</Stack>
				</Nav>
			</Container>
		</Navbar>
	);
};

export default NavBar;
