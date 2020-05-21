import React from "react";

import "./ChatMessageList.css";

function ChatMessageList(props) {
	return (
		<div className="chat-message-list">
			<div className="chat-message chat-message--receiver">
				I am someone
			</div>
			<div className="chat-message chat-message--sender">
				I am mazhar
			</div>
		</div>
	);
}

export default ChatMessageList;
