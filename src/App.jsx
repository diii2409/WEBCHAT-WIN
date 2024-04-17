import {
	Navigate,
	Route,
	BrowserRouter as Router,
	Routes,
} from "react-router-dom";
import Login from "./components/Login/index.jsx";
import ChatRoom from "./components/chatRoom/index.jsx";

import { useContext } from "react";
import AddRoomModal from "./Modals/AddRoomModal.jsx";
import EditInfoRoomModal from "./Modals/EditInfoRoomModal.jsx";
import FindRoomModal from "./Modals/FindRoomModal.jsx";
import InviteMemberModal from "./Modals/InviteMemberModal.jsx";
import { AuthContext } from "./context/AuthContext";

function App() {
	const { currentUser } = useContext(AuthContext);
	// console.log("currentUser : ", currentUser);

	function isCurrentUserEmpty(currentUser) {
		return !currentUser || Object.keys(currentUser).length === 0;
	}

	let isCurrentUser = isCurrentUserEmpty(currentUser);
	return (
		<Router>
			{/* <InviteMemberModal> */}
			<Routes>
				<Route
					path='/login'
					element={!isCurrentUser ? <ChatRoom /> : <Login />}
				/>
				<Route path='/*' element={<Navigate to='/' />} />
				<Route path='/' element={!isCurrentUser ? <ChatRoom /> : <Login />} />
			</Routes>
			<AddRoomModal />
			<EditInfoRoomModal />
			<InviteMemberModal />
			<FindRoomModal />
		</Router>
	);
}

export default App;
