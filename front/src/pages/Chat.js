import React from "react";

function Chat(props) {
	return (
		<>
		<p>I am chatting with: {props.renderProps.location.state.contact}</p>
		</>
	);
}

export default Chat;
