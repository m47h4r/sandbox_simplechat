import React, { useState, useEffect } from "react";

import ChatInput from "../components/ChatInput";
import ChatMessageList from "../components/ChatMessageList";
import io from "socket.io-client";

import config from "../config/";

let socket = null;

function Chat(props) {
	const [messages, setMessages] = useState(null);

	const updateMessages = () => {
		socket.emit(
			"get-chat-messages",
			{
				contact_id: props.renderProps.location.state.contact._id,
				session_id: props.sessionCookie,
			},
			(returnedData) => {
				setMessages(returnedData.data);
			}
		);
	};

	const sendMessage = (session_id, contact_id, message, cb) => {
		socket.emit(
			"send-message",
			{
				session_id: session_id,
				contact_id: contact_id,
				message: message,
			},
			(result) => {
				cb(result);
			}
		);
	};

	useEffect(() => {
		socket = io(config.backend.url);
		updateMessages(socket);
	}, []);

	return (
		<>
			<p>
				{props.renderProps.location.state.contact.name}
				{props.renderProps.location.state.contact.surname}
			</p>
			<ChatMessageList messages={messages} />
			<ChatInput
				sendMessage={sendMessage}
				contact={props.renderProps.location.state.contact}
				sessionCookie={props.sessionCookie}
			/>
		</>
	);
}

export default Chat;
