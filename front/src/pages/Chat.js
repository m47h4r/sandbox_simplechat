import React, { useState, useEffect } from "react";

import ChatInput from "../components/ChatInput";
import ChatMessageList from "../components/ChatMessageList";
import io from "socket.io-client";

import config from '../config/';

function Chat(props) {
	const [messages, setMessages] = useState(null);

	const updateMessages = (socket) => {
		socket.emit(
			'get-chat-messages',
			{
				contact_id: props.renderProps.location.state.contact._id,
				session_id: props.sessionCookie
			},
			(returnedData) => {
				setMessages(returnedData.data)
			}
		);
	}

	useEffect(() => {
		const socket = io(config.backend.url);
		updateMessages(socket);
	}, []);

	return (
		<>
		<p>
			{props.renderProps.location.state.contact.name}
			{props.renderProps.location.state.contact.surname}
		</p>
		<ChatMessageList 
			messages={messages}
		/>
		<ChatInput />
		</>
	);
}

export default Chat;
