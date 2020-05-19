import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { Redirect } from 'react-router-dom';

import config from "../../config/";
import { checkUserSession } from '../../utils/session';

import Button from "../Button";

import "./index.css";

function Header(props) {
  const [cookies, setCookie] = useCookies(["session-cookie"]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

	const checkSession = async () => {
		setIsLoggedIn(await checkUserSession(cookies["session-cookie"]));
	};

  useEffect(() => {
		checkSession();
  }, [cookies["session-cookie"]]);

	async function makeSignOutRequest(fields) {
		try {
			return await axios.post(config.backend.url + "/user/signout", fields);
		} catch(error) {
			props.setMessageType("failure");
			props.setMessage("Can not contact securechat server :(");
		}
	}

  const signOutHandler = async () => {
		let fields = {sessionSecret: cookies['session-cookie']};
    let signOutResult = await makeSignOutRequest(fields);
    if (signOutResult.data.status === "success") {
      props.setMessageType("success");
      props.setMessage("Successfully signed out!");
    } else {
			props.setMessageType("failure");
			props.setMessage(signOutResult.data.error);
		}
		setCookie("session-cookie", null, { path: "/" });
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
      {isLoggedIn ? renderSignOutButton() : renderSignUpSignInButtons()}
			{!isLoggedIn ? <Redirect to="/signin" /> : null}
    </ul>
  );
}

export default Header;
