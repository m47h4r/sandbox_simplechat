import React from "react";

import "./Message.css";

function Message(props) {
	function handleClick() {
		props.setMessage("");
		props.setMessageType("");
	}

	function setClassName() {
		if (props.message.length > 0) {
			return "message-outer";
		} else {
			return "message-outer message-outer__disabled";
		}
	}

	function setMessageType() {
		if (props.messageType === "failure") {
			return { backgroundColor: "#ff8657" };
		} else if (props.messageType === "success") {
			return { backgroundColor: "#74ff57" };
		}
	}

	return (
		<div className={setClassName()} onClick={handleClick}>
			<div className="message-inner" style={setMessageType()}>
				<p className="message-text">{props.message}</p>
			</div>
		</div>
	);
}

export default Message;
