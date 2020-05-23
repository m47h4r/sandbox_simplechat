import React, { useEffect } from "react";

import ChatInput from "../components/ChatInput";
import ChatMessageList from "../components/ChatMessageList";
import socketIOClient from "socket.io-client";

import config from '../config/';

function Chat(props) {
	useEffect(() => {
		const socket = socketIOClient(config.backend.url);
		socket.on('connect', () => {
			console.log('connected to backend io')
		})
	}, []);

	return (
		<>
		<p>I am chatting with: {props.renderProps.location.state.contact}</p>
		<ChatMessageList />
		<ChatInput />
		</>
	);
}

export default Chat;
