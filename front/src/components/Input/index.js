import React from "react";

import "./index.css";

function Input(props) {
	return (
		<>
			<p className="input__label">{props.name}:</p>
			<input
				className="input__entry"
				name={props.name}
				type={props.type}
				placeholder={props.placeholder}
				value={props.value}
				onChange={props.handleChange}
			/>
		</>
	);
}

export default Input;
