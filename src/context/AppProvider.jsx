import { collection, onSnapshot, query, where } from "firebase/firestore";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { db } from "../firebase/config";

import useFirestore from "../hook/useFireStore.js";
import { AuthContext } from "./AuthContext.jsx";
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
	const currentUser = useContext(AuthContext).currentUser;
	//*************************************************** */
	const [isAddRoomVisible, setIsAddRoomVisible] = useState(false);
	const [isFindRoomOpen, setIsFindRoomOpen] = useState(false);
	const [isEditInfoRoomOpen, setIsEditInfoRoomOpen] = useState(false);
	const [isInviteMemberVisible, setIsInviteMemberVisible] = useState(false);
	const [isSelectedRoomId, setIsSelectedRoomId] = useState("");
	const [members, setMembers] = useState([]);
	//*************************************************** */
	//*************************************************** */
	const uid = currentUser?.uid;
	//
	// Tạo điều kiện tải các phòng chat của người dùng
	const roomsCondition = useMemo(() => {
		return {
			fieldName: "members",
			operator: "array-contains",
			compareValues: uid,
		};
	}, [uid]);
	//
	//
	// tải các phòng
	const rooms = useFirestore("rooms", roomsCondition);
	//
	//
	// Tìm ra phòng người dùng chọn vào
	const selectedRoom = useMemo(() => {
		return rooms.find((room) => room.id === isSelectedRoomId);
	}, [rooms, isSelectedRoomId]);
	useEffect(() => {
		setMembers([]);
		if (selectedRoom && selectedRoom.members) {
			let q = query(
				collection(db, "users"),
				where("uid", "in", selectedRoom.members),
			);
			const unsubscribe = onSnapshot(q, (snapshot) => {
				const docs = snapshot.docs.map((doc) => ({
					...doc.data(),
					id: doc.id,
				}));
				setMembers(docs);
			});
			return () => {
				unsubscribe();
			};
		}
	}, [uid, selectedRoom]);

	//*************************************************** */
	//*************************************************** */
	return (
		<AppContext.Provider
			value={{
				rooms,
				members,
				selectedRoom,
				isAddRoomVisible,
				setIsAddRoomVisible,
				isFindRoomOpen,
				setIsFindRoomOpen,
				isSelectedRoomId,
				setIsSelectedRoomId,
				isInviteMemberVisible,
				setIsInviteMemberVisible,
				isEditInfoRoomOpen,
				setIsEditInfoRoomOpen,
			}}>
			{children}
		</AppContext.Provider>
	);
};
