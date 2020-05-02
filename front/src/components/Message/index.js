import React from "react";

import "./index.css";

function Message(props) {
  return (
    <div className="message-outer">
      <div className="message-inner">
        <p>message type: {props.messageType}</p>
        <p>message: {props.message}</p>
      </div>
    </div>
  );
}

export default Message;
