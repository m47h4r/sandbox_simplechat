import React from "react";

import "./index.css";

function Message(props) {
  function handleClick() {
    props.setMessage("");
    props.setMessageType("");
  }

  function setVisibility() {
    if (props.message.length > 0) {
      return { visibility: "visible" };
    } else {
      return { visibility: "hidden" };
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
    <div
      className="message-outer"
      style={setVisibility()}
      onClick={handleClick}
    >
      <div className="message-inner" style={setMessageType()}>
        <p>{props.message}</p>
      </div>
    </div>
  );
}

export default Message;
