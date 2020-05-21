import React from "react";

import ChatInput from "../components/ChatInput";

function Chat(props) {
	return (
		<>
		<p>I am chatting with: {props.renderProps.location.state.contact}</p>
		<ChatInput />
		</>
	);
}

export default Chat;
