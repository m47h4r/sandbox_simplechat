import React from "react";

import "./Input.css";

function Input(props) {
	return (
		<>
			{props.noLabel ? null : 
				<p className="input__label">{props.name}:</p>
			}
			<input
				className={
					props.noMargin
						? "input__entry input__entry--no-margin"
						: "input__entry"
				}
				name={props.name}
				type={props.type}
				placeholder={props.placeholder}
				value={props.value}
				onChange={props.handleChange}
				style={props.style}
			/>
		</>
	);
}

export default Input;
