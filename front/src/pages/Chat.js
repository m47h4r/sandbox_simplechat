import React from "react";

import ChatInput from "../components/ChatInput";
import ChatMessageList from "../components/ChatMessageList";

function Chat(props) {
	return (
		<>
		<p>I am chatting with: {props.renderProps.location.state.contact}</p>
		<ChatMessageList />
		<ChatInput />
		</>
	);
}

export default Chat;
