import { FileTextTwoTone } from "@ant-design/icons";
import { Avatar, Card, Typography } from "antd";
import React from "react";
import styled from "styled-components";

const WrapperStyled = styled.div`
	margin-bottom: 10px;
	padding: 4px;
	.author {
		margin-left: 5px;
		font-weight: bold;
	}

	.date {
		margin-left: 10px;
		font-size: 11px;
		color: #a7a7a7;
	}

	.content {
		margin-left: 30px;
	}
`;

export default function Message({
	text,
	displayName,
	createdAt,
	photoUrl,
	fileURL,
	fileName,
	fileExtension,
	fileType,
}) {
	return (
		<WrapperStyled>
			<div>
				<Avatar size={"small"} src={photoUrl}></Avatar>
				<Typography.Text className='author'>{displayName}</Typography.Text>
				<Typography.Text className='date'>{createdAt}</Typography.Text>
			</div>
			<div>
				{text && <Typography.Text className='content'>{text}</Typography.Text>}
				{fileType === "image" && (
					<img
						src={fileURL}
						style={{ maxWidth: "320px", margin: "10px" }}></img>
				)}
				{fileType === "video" && (
					<video src={fileURL} controls style={{ maxWidth: "320px" }} />
				)}
				{!text && fileType !== "image" && fileType !== "video" && (
					<Card
						size='small'
						title={fileType}
						style={{
							width: 300,
							backgroundColor: "rgba(229, 239, 255, 0.2)",
							margin: "10px",
							border: "1px solid #999",
							color: "rgb(22, 119, 255)",
						}}>
						<p
							style={{
								whiteSpace: "nowrap",
								overflow: "hidden",
								textOverflow: "ellipsis",
							}}>
							<FileTextTwoTone /> {fileName}.{fileExtension}
						</p>
					</Card>
				)}
			</div>
		</WrapperStyled>
	);
}
