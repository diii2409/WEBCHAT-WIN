import {
	DeleteOutlined,
	UploadOutlined,
	UserAddOutlined,
} from "@ant-design/icons";
import {
	Alert,
	Avatar,
	Button,
	Dropdown,
	Form,
	Input,
	Menu,
	Modal,
	Spin,
	Tooltip,
	message,
} from "antd";
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	serverTimestamp,
	updateDoc,
} from "firebase/firestore";
import {
	deleteObject,
	getDownloadURL,
	ref,
	uploadBytesResumable,
} from "firebase/storage";
import moment from "moment";
import {
	useContext,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import styled from "styled-components";
import { v4 } from "uuid";
import avatarDefault from "../../../public/vite.svg";
import { AppContext } from "../../context/AppProvider";
import { AuthContext } from "../../context/AuthContext";
import { db, storage } from "../../firebase/config";
import useFirestore from "../../hook/useFireStore";
import Message from "./Message";

// chỉnh css cho các phần tử bên trong
const HeaderStyled = styled.div`
	display: flex;
	justify-content: space-between;
	height: 56px;
	padding: 0 16px;
	align-items: center;
	border-bottom: 1px solid rgb(230, 230, 230);

	.header {
		&__info_avt {
			display: flex;
			flex-direction: row;
		}
		&__avt {
			margin-right: 10px;
		}
		&__info {
			display: flex;
			flex-direction: column;
			justify-content: center;
		}

		&__title {
			margin: 0;
			font-weight: bold;
		}

		&__description {
			font-size: 12px;
		}
	}
`;

const ContentStyled = styled.div`
	height: calc(100% - 56px);
	display: flex;
	flex-direction: column;
	padding: 0 11px;
	justify-content: flex-end;
`;

const ButtonGroupStyled = styled.div`
	display: flex;
	align-items: center;
`;

const MessageListStyled = styled.div`
	max-height: 100%;
	overflow-y: auto;
	border-radius: 8px;
`;

const WrapperMessage = styled.div`
	&:hover {
		background-color: #f0f0f0;
	}
`;

const WrapperStyled = styled.div`
	height: 99vh;
`;

const FormStyled = styled(Form)`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 2px 2px 2px 0;
	border: 1px solid rgb(230, 230, 230);
	border-radius: 2px;

	.ant-form-item {
		margin-bottom: 0;
		margin-right: 8px;
	}
	.form_input {
		&__message {
			flex: 1;
			border: 1px solid #999;
			border-radius: 8px;
		}
	}
`;
//*************************************************** */
//*************************************************** */
//*************************************************** */

export default function ChatWindow() {
	const {
		members,
		selectedRoom,
		setIsInviteMemberVisible,
		setIsEditInfoRoomOpen,
	} = useContext(AppContext);
	const { currentUser } = useContext(AuthContext);
	//*************************************************** */
	const uid = currentUser?.uid;
	const photoURL = currentUser?.photoURL;
	const displayName = currentUser?.displayName;
	//*************************************************** */
	const [form] = Form.useForm();
	const [formEditMessage] = Form.useForm();
	//*************************************************** */
	const [inputValue, setInputValue] = useState("");
	const [isInputDefault, setIsInputDefault] = useState(true);
	const [messageFiles, setMessageFiles] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [selectedMessage, setSelectedMessage] = useState(null);
	const [isOpenModalEditMessage, setIsOpenModalEditMessage] = useState(false);
	//*************************************************** */
	const messageListRef = useRef(null);
	const inputRef = useRef();
	const inputNewMessageRef = useRef(null);
	const fileInputRef = useRef();
	//*************************************************** */
	//*************************************************** */
	//
	//
	//
	//
	// xử lý input
	// chuyển trạng thái thanh input
	const handleSetStationUInput = () => {
		setIsInputDefault(!isInputDefault);
	};
	// lưu nội dung input
	const handleInputChange = (e) => {
		setInputValue(e.target.value);
	};
	// xử lý khi thay đổi ảnh đưa lên để gửi
	const handleUploadChange = (event) => {
		setIsLoading(true);
		const fileList = Array.from(event.target.files);
		// fileList.forEach((f) => {
		// 	const fileName = f.type.split("/").shift();
		// 	console.log("fileType", fileName);
		// });
		setMessageFiles(fileList, ...messageFiles);
		event.target.value = null;
		setIsLoading(false);
	};
	//
	//
	//
	// 2 hàm dung để thực hiện việc kéo thả ảnh vào
	const handleDragOver = (e) => {
		e.preventDefault();
	};
	const handleDrop = (e) => {
		e.preventDefault();
		const fileList = Array.from(e.dataTransfer.files);
		setMessageFiles(fileList, ...messageFiles);
	};

	const handleRemoveFile = (index) => {
		const updatedFiles = [...messageFiles];
		updatedFiles.splice(index, 1);
		setMessageFiles(updatedFiles);
	};
	//
	//
	// khu vực xử lý gửi tin nhắn
	const handleOnSubmit = async () => {
		try {
			setIsLoading(true); // Bắt đầu quá trình loading

			if (messageFiles.length > 0) {
				const uploadPromises = messageFiles.map((messageFile) => {
					return new Promise((resolve, reject) => {
						const fileID = v4();
						const fileType = messageFile.type.split("/").shift();
						const fileFullName = messageFile.name.split(".");
						const fileName = fileFullName.shift();
						const fileExtension = fileFullName.pop();
						const storageRef = ref(storage, `MessageFiles/${fileID}`);
						const uploadTask = uploadBytesResumable(storageRef, messageFile);

						uploadTask.on(
							"state_changed",
							(snapshot) => {
								// Cập nhật trạng thái upload nếu cần
							},
							(error) => {
								console.log("error", error);
								reject(error);
							},
							() => {
								getDownloadURL(uploadTask.snapshot.ref)
									.then(async (downloadURL) => {
										await addDoc(collection(db, "messages"), {
											fileURL: downloadURL,
											fileID,
											fileName,
											fileType,
											fileExtension,
											uid,
											photoURL,
											roomId: selectedRoom?.id,
											displayName,
											createdAt: serverTimestamp(),
										});
										resolve();
									})
									.catch((error) => {
										console.log("error", error);
										reject(error);
									});
							},
						);
					});
				});

				await Promise.all(uploadPromises);
				setMessageFiles([]);
			} else {
				if (inputValue.trim() !== "") {
					await addDoc(collection(db, "messages"), {
						text: inputValue.trim(),
						uid,
						photoURL,
						roomId: selectedRoom?.id,
						displayName,
						createdAt: serverTimestamp(),
					});
				}
				if (inputRef?.current) {
					setTimeout(() => {
						inputRef.current.focus();
					});
				}
				form.resetFields(["message"]);
				setInputValue("");
			}
		} catch (error) {
			message.error("send message fail");
			console.error("Error adding document: ", error);
		} finally {
			setIsLoading(false);
		}
	};
	// lập điều kiện để tải tin nhắn
	const condition = useMemo(
		() => ({
			fieldName: "roomId",
			operator: "==",
			compareValues: selectedRoom?.id,
		}),
		[selectedRoom?.id],
	);
	// Gọi tin nhăn ra để hiển thị
	const messages = useFirestore("messages", condition);

	const handleContextMenu = (e, message) => {
		e.preventDefault();
		setSelectedMessage(message);
	};
	//
	//
	//
	//
	// Xử lý xóa tin nhắn
	const handleDeleteMessage = async () => {
		try {
			setIsLoading(true);
			if (!selectedMessage) {
				message.error("No message selected for deletion.");
				return;
			}
			if (!selectedMessage?.img) {
				selectedRoom?.avatar === "default"
					? avatarDefault
					: selectedRoom?.avatar;
				await deleteDoc(doc(db, "messages", selectedMessage.id));
				message.info("remove mess successfull");
			} else {
				const imgRef = ref(storage, `MessageImages/${selectedMessage.imgID}`);
				await deleteObject(imgRef).then(() => {
					message.info("remove img successfull");
				});
				await deleteDoc(doc(db, "messages", selectedMessage.id));
			}
			setSelectedMessage(null);
		} catch (error) {
			console.log("error", error);
		} finally {
			setIsLoading(false);
		}
	};
	//
	//
	//
	// khu vực hàm xử lý việc edit messages
	const handleEditMessage = () => {
		setIsOpenModalEditMessage(true);
	};
	const handleModalEditMessageOk = async () => {
		try {
			await formEditMessage.validateFields();
			const { newMessage } = formEditMessage.getFieldsValue();
			setIsLoading(true);
			const messageDocRef = doc(db, "messages", selectedMessage?.id);
			await updateDoc(messageDocRef, {
				text: newMessage,
			});
			message.info("edit mess successfull");
			formEditMessage.resetFields();
		} catch (error) {
			console.log("error", error);
		} finally {
			setIsLoading(false);
			setSelectedMessage(null);
			setIsOpenModalEditMessage(false);
		}
	};
	const handleModalEditMessageCancel = () => {
		setSelectedMessage(null);
		setIsOpenModalEditMessage(false);
	};
	//
	//
	//
	// Xử lý lưu file khi file lớn ( dùng check % kki tải )
	// const handleSaveFile = async () => {
	// 	if (!selectedMessage || !selectedMessage?.fileURL) {
	// 		message.error("Không có file để lưu.");
	// 		return;
	// 	}
	// 	const xhr = new XMLHttpRequest();
	// 	xhr.responseType = "blob";
	// 	xhr.onload = (event) => {
	// 		const blob = xhr.response;
	// 		const fileURL = URL.createObjectURL(blob);

	// 		const link = document.createElement("a");
	// 		link.href = fileURL;
	// 		link.download = `${selectedMessage.fileName}.${selectedMessage.fileExtension}`;
	// 		document.body.appendChild(link);
	// 		link.click();
	// 		document.body.removeChild(link);
	// 	};
	// 	xhr.open("GET", selectedMessage?.fileURL);
	// 	xhr.send();
	// };
	//
	// Xử lý lưu file
	const handleSaveFile = async () => {
		if (!selectedMessage || !selectedMessage?.fileURL) {
			message.error("Không có file để lưu.");
			return;
		}

		const file = await fetch(selectedMessage?.fileURL);
		const fileBlog = await file.blob();
		const fileURL = URL.createObjectURL(fileBlog);

		const link = document.createElement("a");
		link.href = fileURL;
		link.download = `${selectedMessage.fileName}.${selectedMessage.fileExtension}`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};
	//
	//
	//
	// mở Modal Edit Info Room
	const handleEidInfoRoom = () => {
		setIsEditInfoRoomOpen(true);
	};

	// khu vực thiết kế menu khi click chuột phải khi ấn vào tin nhắn
	const contextMenu = selectedMessage ? (
		<Menu>
			{!selectedMessage?.text && (
				<Menu.Item key='saveImg' onClick={handleSaveFile}>
					Lưu file {selectedMessage?.fileType}
				</Menu.Item>
			)}
			{selectedMessage?.text && (
				<Menu.Item key='edit' onClick={handleEditMessage}>
					Chỉnh sửa tin nhắn
				</Menu.Item>
			)}
			<Menu.Item key='delete' onClick={handleDeleteMessage}>
				Xóa tin nhắn
			</Menu.Item>
		</Menu>
	) : (
		<Menu>
			<Menu.Item key='editInfoRoom' onClick={handleEidInfoRoom}>
				Thay đổi thông tin phòng
			</Menu.Item>
		</Menu>
	);
	//*************************************************** */
	//*************************************************** */
	//*************************************************** */
	// khu vực xử lý useEffect
	useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.keyCode === 27 && !isLoading) {
				handleSetStationUInput();
				handleModalEditMessageCancel();
			}
		};

		if (!isInputDefault || !isLoading) {
			document.addEventListener("keydown", handleKeyDown);
		}

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [isInputDefault, isLoading]);

	useLayoutEffect(() => {
		messageListRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "end",
		});
	}, [messages, selectedRoom, inputValue]);

	useEffect(() => {
		if (isOpenModalEditMessage && inputNewMessageRef?.current) {
			inputNewMessageRef?.current.focus();
		}
	}, [isOpenModalEditMessage]);

	//*************************************************** */
	//*************************************************** */

	return (
		<WrapperStyled>
			{selectedRoom?.id ? (
				<>
					<Modal
						title={isLoading ? "Loading.." : "Chỉnh sửa tin nhắn"}
						open={isOpenModalEditMessage}
						onOk={handleModalEditMessageOk}
						onCancel={handleModalEditMessageCancel}
						closable={false}>
						<Form form={formEditMessage} layout='vertical'>
							<Form.Item label='Tin nhắn'>
								<Alert type='info' message={selectedMessage?.text} />
							</Form.Item>
							<Form.Item
								label='Tin nhắn mới'
								hasFeedback
								name='newMessage'
								validateStatus={isLoading ? "validating" : ""}>
								<Input
									ref={inputNewMessageRef}
									placeholder='Nhập tin nhắn mới'
									autoFocus={true}
									onPressEnter={handleModalEditMessageOk}></Input>
							</Form.Item>
						</Form>
					</Modal>
					<HeaderStyled>
						<div className='header__info_avt'>
							<div
								onContextMenu={(e) => {
									e.preventDefault();
								}}>
								<Dropdown overlay={contextMenu} trigger={["contextMenu"]}>
									<div style={{ display: "flex" }}>
										<Avatar
											className='header__avt'
											size={"large"}
											src={
												selectedRoom?.avatar === "default"
													? avatarDefault
													: selectedRoom?.avatar
											}
										/>
										<div className='header__info'>
											<p className='header__title'>{selectedRoom?.name}</p>
											<span className='header__discription'>
												{selectedRoom.description}
											</span>
										</div>
									</div>
								</Dropdown>
							</div>
						</div>
						<ButtonGroupStyled>
							<Button
								icon={<UserAddOutlined />}
								type='text'
								onClick={() => {
									setIsInviteMemberVisible(true);
								}}>
								Mời
							</Button>
							<Avatar.Group size='small' maxCount={2}>
								{members.map((member, index) => {
									return (
										<Tooltip title={member.displayName} key={index}>
											<Avatar src={member.photoURL}></Avatar>
										</Tooltip>
									);
								})}
							</Avatar.Group>
						</ButtonGroupStyled>
					</HeaderStyled>
					<ContentStyled>
						<MessageListStyled>
							{messages.map((mes) => (
								<div
									key={mes?.id}
									onContextMenu={(e) => handleContextMenu(e, mes)}>
									<Dropdown overlay={contextMenu} trigger={["contextMenu"]}>
										<WrapperMessage ref={messageListRef}>
											<Message
												text={mes?.text}
												photoUrl={mes?.photoURL}
												displayName={mes?.displayName}
												fileURL={mes?.fileURL}
												fileName={mes?.fileName}
												fileExtension={mes?.fileExtension}
												fileType={mes?.fileType}
												createdAt={
													mes?.createdAt
														? moment(mes.createdAt.toDate()).calendar()
														: ""
												}
											/>
										</WrapperMessage>
									</Dropdown>
								</div>
							))}
						</MessageListStyled>
						{/*  input message */}
						<FormStyled form={form} className='form_ipunt'>
							<Form.Item
								name='message'
								className='form_input__message'
								hidden={!isInputDefault}>
								<Input
									ref={inputRef}
									placeholder='nhập tin nhắn đi ku'
									variant={false}
									autoFocus={true}
									disabled={isLoading}
									autoComplete='off'
									onChange={handleInputChange}
									onPressEnter={handleOnSubmit}
								/>
							</Form.Item>
							{/* Butonn input img */}
							<Form.Item hidden={!isInputDefault}>
								<Button
									onClick={handleSetStationUInput}
									icon={<UploadOutlined />}></Button>
							</Form.Item>

							<Form.Item
								name='Image'
								style={{ flex: "1" }}
								hidden={isInputDefault}>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
									}}
									onDragOver={handleDragOver}
									onDrop={handleDrop}
									draggable={true}>
									<input
										type='file'
										multiple={true}
										style={{ display: "none" }}
										onChange={handleUploadChange}
										ref={fileInputRef}
									/>
									<Button
										icon={<UploadOutlined />}
										disabled={isLoading}
										style={{ justifySelf: "center" }}
										onClick={() => fileInputRef.current.click()}>
										Chọn file
									</Button>
									<div style={{ marginLeft: "10px" }}>
										{messageFiles?.map((file, index) => (
											<div
												key={index}
												style={{ display: "flex", alignItems: "center" }}>
												{isLoading && <Spin size='small'></Spin>}
												<span
													style={{
														whiteSpace: "nowrap",
														overflow: "hidden",
														textOverflow: "ellipsis",
														flex: "1",
													}}>
													{"  "}
													{file?.name}
												</span>
												<Button
													type='link'
													onClick={() => handleRemoveFile(index)}
													icon={<DeleteOutlined />}
													style={{ marginLeft: "auto" }}
												/>
											</div>
										))}
									</div>
								</div>
							</Form.Item>

							<Button
								type='primary'
								onClick={handleOnSubmit}
								disabled={isLoading}>
								Gửi
							</Button>
						</FormStyled>
					</ContentStyled>
				</>
			) : (
				<Alert
					message='Hãy chọn phòng'
					type='info'
					showIcon
					style={{ margin: 5 }}
					closable
				/>
			)}
		</WrapperStyled>
	);
}
