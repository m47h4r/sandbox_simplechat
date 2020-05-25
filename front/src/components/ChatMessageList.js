import React, { useEffect } from "react";

import "./ChatMessageList.css";

function ChatMessageList(props) {
	// useEffect(() => {
	//
	// }, [props.data])

	const renderMessages = () => {
		return (
			<>
				{props.messages.map((message) =>
					message.isSender ? (
						<div
							className="chat-message chat-message--sender"
							key={message._id}
						>
							{message.text}
						</div>
					) : (
						<div
							className="chat-message chat-message--receiver"
							key={message._id}
						>
							{message.text}
						</div>
					)
				)}
			</>
		);
	};

	return (
		<div className="chat-message-list">
			{props.messages ? renderMessages() : <p>There are no messages.</p>}
			<div className="chat-message-list-end"></div>
		</div>
	);
}

export default ChatMessageList;
