import React, { useState, useEffect } from "react";

import Button from "./Button";
import Input from "./Input";

import "./ChatInput.css";

function ChatInput(props) {
	const [message, setMessage] = useState("");

	const handleChange = (e) => {
		switch(e.target.name) {
			case "message":
				setMessage(e.target.value);
				break;
			default:
		}
	}

	// TODO: v
	const sendMessage = () => {}

	return (
		<>
			<div className="chat-input">
				<Input 
					name="message"
					type="text"
					placeholder="..."
					value={message}
					handleChange={handleChange}
					noMargin={true}
					noLabel={true}
					style={{flexGrow: 1}}
				/>
				<Button
					type="button"
					text="Send"
					onClick={sendMessage}
				/>
			</div>
		</>
	);
}

export default ChatInput;
