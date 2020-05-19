import React from "react";
import { Link } from "react-router-dom";

import "./index.css";

function Button(props) {
	function routerLink() {
		return (
			<Link to={props.destination} className="button">
				{props.text}
			</Link>
		);
	}
	function regularLink() {
		return (
			<a href={props.destination} className="button">
				{props.text}
			</a>
		);
	}
	function button() {
		return (
			<button type="button" className="button" onClick={props.onClick}>
				{props.text}
			</button>
		);
	}
	switch (props.type) {
		case "routerLink":
			return routerLink();
		case "regularLink":
			return regularLink();
		case "button":
			return button();
		default:
	}
}

export default Button;
