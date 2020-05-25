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

	const clickHandler = () => {
		props.sendMessage(
			props.sessionCookie,
			props.contact._id,
			message,
			(result) => {
				// TODO: must handle error here
				// successful ones are not important because they will
				// be calling 'new-message' event and will be shown
			}
		);
	}

	return (
		<>
			<div className="chat-input">
				<Input 
					name="message"
					type="text"
					placeholder=". . ."
					value={message}
					handleChange={handleChange}
					noMargin={true}
					noLabel={true}
					style={{flexGrow: 1}}
				/>
				<Button
					type="button"
					text="Send"
					onClick={clickHandler}
				/>
			</div>
		</>
	);
}

export default ChatInput;
