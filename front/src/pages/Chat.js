import React, { useState, useEffect } from "react";

import ChatInput from "../components/ChatInput";
import ChatMessageList from "../components/ChatMessageList";
import socketIOClient from "socket.io-client";

import config from '../config/';

function Chat(props) {
	const [messages, setMessages] = useState(null);

	const getChatMessages = (socket) => {
	}

	useEffect(() => {
		const socket = socketIOClient(config.backend.url);
		let result = getChatMessages(socket);
	}, []);

	return (
		<>
		<p>{props.renderProps.location.state.contact.name} {props.renderProps.location.state.contact.surname}</p>
		<ChatMessageList 
			messages={messages}
		/>
		<ChatInput />
		</>
	);
}

export default Chat;
