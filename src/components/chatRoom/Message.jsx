import { Avatar, Typography } from "antd";
import React from "react";
import styled from "styled-components";

const WrapperStyled = styled.div`
	margin-bottom: 10px;

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
	img,
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
				{img && <img src={img} style={{ maxWidth: "200px" }}></img>}
			</div>
		</WrapperStyled>
	);
}
