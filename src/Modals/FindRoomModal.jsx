import { Avatar, Form, Modal, Select, Spin } from "antd";
import {
	collection,
	doc,
	getDocs,
	query,
	updateDoc,
	where,
} from "firebase/firestore";
import { useContext, useEffect, useMemo, useState } from "react";
import { AppContext } from "../context/AppProvider";
import { db } from "../firebase/config";

function DebounceSelect({
	fetchOptions,
	debounceTimeout = 300,
	curMembers,
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

			fetchOptions(value, curMembers).then((newOptions) => {
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
				<Select.Option key={opt.value} value={opt.value} title={opt.label}>
					<Avatar size='small' src={opt.photoURL}>
						{opt.photoURL ? "" : opt.label?.charAt(0)?.toUpperCase()}
					</Avatar>
					<Typography.Text>{` ${opt.label}`}</Typography.Text>
				</Select.Option>
			))}
		</Select>
	);
}
// **********************************************************
const fetchUserList = async (search, curMembers) => {
	try {
		let q = collection(db, "rooms");
		if (search) {
			q = query(
				collection(db, "rooms"),
				where("keywords", "array-contains", search.toLowerCase()),
			);
		}
		const snapshot = await getDocs(q);
		console.log(snapshot);
		const userList = snapshot.docs
			.map((doc) => ({
				label: doc.data().name,
				value: doc.data().uid,
				photoURL: doc.data().avatar,
			}))
			.filter((opt) => !curMembers.includes(opt.value));

		return userList;
	} catch (error) {
		console.error("Error fetching user list:", error);
		return [];
	}
};
// **********************************************************
export default function InviteMemberModal() {
	const { isFindRoomOpen, setIsFindRoomOpen, isSelectedRoomId, selectedRoom } =
		useContext(AppContext);
	const [value, setValue] = useState([]);
	const [form] = Form.useForm();

	const handleOk = async () => {
		form.resetFields();
		setValue([]);

		const newMembers = value.map((val) => val.value);
		const updatedMembers = [...selectedRoom.members, ...newMembers];
		console.log("newMember", newMembers);
		try {
			await updateDoc(doc(db, "rooms", isSelectedRoomId), {
				members: updatedMembers,
			});

			setIsFindRoomOpen(false);
		} catch (error) {
			console.error("Error inviting members:", error);
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
				title='Tìm phòng'
				open={false}
				onOk={handleOk}
				onCancel={handleCancel}
				destroyOnClose={true}>
				<Form form={form} layout='vertical'>
					<DebounceSelect
						mode='multiple'
						name='search-user'
						label='Tên phòng'
						value={value}
						placeholder='Nhập tên phòng'
						fetchOptions={fetchUserList}
						onChange={(newValue) => setValue(newValue)}
						style={{ width: "100%" }}
						curMembers={selectedRoom?.uid}
					/>
				</Form>
			</Modal>
		</div>
	);
}
