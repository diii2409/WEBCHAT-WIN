import { Avatar, Form, Modal, Select, Spin, Typography, message } from "antd";
import {
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	updateDoc,
	where,
} from "firebase/firestore";
import { useContext, useEffect, useMemo, useState } from "react";
import avatarDefault from "../../public/vite.svg";
import { AppContext } from "../context/AppProvider";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase/config";
function DebounceSelect({
	fetchOptions,
	debounceTimeout = 300,
	curMembers,
	currentUser,
	...props
}) {
	const [fetching, setFetching] = useState(false);
	const [options, setOptions] = useState([]);
	const debounce = (func, wait) => {
		let timeoutId;
		return (...args) => {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				func(...args);
			}, wait);
		};
	};
	const debounceFetcher = useMemo(() => {
		const loadOptions = (value) => {
			setOptions([]);
			setFetching(true);
			fetchOptions(value, currentUser).then((newOptions) => {
				setOptions(newOptions);
				setFetching(false);
			});
		};

		return debounce(loadOptions, debounceTimeout);
	}, [debounceTimeout, fetchOptions, curMembers]);

	useEffect(() => {
		return () => {
			setOptions([]);
		};
	}, []);

	return (
		<Select
			labelInValue
			filterOption={false}
			onSearch={debounceFetcher}
			notFoundContent={fetching ? <Spin size='small' /> : null}
			{...props}>
			{options.map((opt) => (
				<Select.Option
					key={opt.value}
					value={opt.value}
					title={opt.label}
					fieldNames={opt}>
					<div style={{ display: "flex", alignItems: "center" }}>
						<div style={{ marginRight: "10px" }}>
							<Avatar
								size='small'
								src={
									opt?.photoURL === "default" ? avatarDefault : opt?.photoURL
								}>
								{opt.photoURL ? "" : opt.label?.charAt(0)?.toUpperCase()}
							</Avatar>
							<Typography.Text>{` ${opt.label}`}</Typography.Text>
						</div>
						<div style={{ marginLeft: "auto" }}>
							<Typography.Text>
								{` ${opt.members.length} members`}{" "}
							</Typography.Text>
						</div>
					</div>
				</Select.Option>
			))}
		</Select>
	);
}
// **********************************************************
const fetchRoomList = async (search, currentUser) => {
	try {
		let q = collection(db, "rooms");
		if (search) {
			q = query(
				collection(db, "rooms"),
				where("keywords", "array-contains", search.toLowerCase()),
			);
		}
		const snapshot = await getDocs(q);
		const roomList = snapshot.docs
			.map((doc) => ({
				label: doc.data().name,
				value: doc.id,
				photoURL: doc.data().avatar,
				members: doc.data().members,
			}))
			.filter((opt) => !opt.members.includes(currentUser.uid));
		return roomList;
	} catch (error) {
		console.error("Error fetching user list:", error);
		return [];
	}
};
// **********************************************************
export default function InviteRoomModal() {
	const { isFindRoomOpen, setIsFindRoomOpen, rooms } = useContext(AppContext);
	const { currentUser } = useContext(AuthContext);
	const [value, setValue] = useState([]);
	const [form] = Form.useForm();
	const [isLoading, setIsLoading] = useState(false);

	const handleOk = async () => {
		form.resetFields();
		setValue([]);
		const newRooms = value.map((opt) => opt.value);

		try {
			setIsLoading(true);
			await Promise.all(
				newRooms.map(async (newRoom) => {
					const roomDocRef = doc(db, "rooms", newRoom);
					const roomDoc = await getDoc(roomDocRef);
					const newMembers = [...roomDoc.data().members, currentUser.uid];
					await updateDoc(roomDocRef, {
						members: newMembers,
					});
				}),
			);
		} catch (error) {
			console.error("Error inviting members:", error);
		} finally {
			setIsLoading(false);
			message.info("join room successfull");
			setIsFindRoomOpen(false);
		}
	};

	const handleCancel = () => {
		form.resetFields();
		setValue([]);
		setIsFindRoomOpen(false);
	};

	return (
		<div>
			<Modal
				title={isLoading ? "Loading..." : "Tìm phòng"}
				open={isFindRoomOpen}
				onOk={handleOk}
				onCancel={handleCancel}
				destroyOnClose={true}>
				<Form form={form} layout='vertical' disabled={isLoading}>
					<DebounceSelect
						mode='multiple'
						name='search-room'
						label='Tên phòng'
						value={value}
						placeholder='Nhập tên phòng'
						fetchOptions={fetchRoomList}
						onChange={(newValue) => setValue(newValue)}
						style={{ width: "100%" }}
						currentUser={currentUser}
					/>
				</Form>
			</Modal>
		</div>
	);
}
