import React from "react";
import axios from "axios";

import config from "../config/";

import Button from "./Button";

import "./Header.css";

function Header(props) {
	async function makeSignOutRequest(fields) {
		try {
			return await axios.post(config.backend.url + "/user/signout", fields);
		} catch (error) {
			props.setMessageType("failure");
			props.setMessage("Can not contact securechat server :(");
		}
	}

	const signOutHandler = async () => {
		let fields = { sessionSecret: props.sessionCookie };
		let signOutResult = await makeSignOutRequest(fields);
		if (signOutResult.data.result === "success") {
			props.setMessageType("success");
			props.setMessage("Successfully signed out!");
		} else {
			props.setMessageType("failure");
			props.setMessage(signOutResult.data.error);
		}
		props.setSessionCookie("session-cookie", null, { path: "/" });
	};

	const renderSignUpSignInButtons = () => {
		return (
			<>
				<li className="header__item">
					<Button type="routerLink" destination="/signin" text="Sign In" />
				</li>
				<li className="header__item">
					<Button type="routerLink" destination="/signup" text="Sign Up" />
				</li>
			</>
		);
	};

	const renderSignOutButton = () => {
		return (
			<li className="header__item">
				<Button type="button" text="Sign Out" onClick={signOutHandler} />
			</li>
		);
	};

	return (
		<ul className="header">
			<li className="header__item header__item-home">
				<Button type="routerLink" destination="/" text="Home" />
			</li>
			{props.isLoggedIn ? renderSignOutButton() : renderSignUpSignInButtons()}
		</ul>
	);
}

export default Header;
