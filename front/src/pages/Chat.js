import React, { useState, useEffect } from "react";

import ChatInput from "../components/ChatInput";
import ChatMessageList from "../components/ChatMessageList";
import io from "socket.io-client";

import config from "../config/";

let socket = null;

function Chat(props) {
	const [messages, setMessages] = useState(null);

	const setMessageList = () => {
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

	const updateMessageList = (message) => {
		socket.emit('check-is-user-sender',
			{ session_id: props.sessionCookie, from: message.from_id },
			(result) => {
				if (result.result) {
					message.isSender = true;
				} else {
					message.isSender = false;
				}
				setMessages((oldMessages) => [...oldMessages, message]);
			}
		);
	}

	useEffect(() => {
		socket = io(config.backend.url);
		setMessageList();
		socket.on('new-message', (data) => {
			updateMessageList(data.message);
		});
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
