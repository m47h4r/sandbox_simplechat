import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import config from "../../config/";

import Button from "../Button";

import "./index.css";

function Header() {
  const [cookies, setCookie] = useCookies(["session-cookie"]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkUserSession = async () => {
    let result = await axios.post(config.backend.url + "/user/checkSession", {
      claimedSessionSecret: cookies["session-cookie"],
    });
    setIsLoggedIn(result.data.result);
    console.log(result);
  };

  useEffect(() => {
		checkUserSession();
	}, [cookies["session-cookie"]]);

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

  return (
    <ul className="header">
      <li className="header__item header__item-home">
        <Button type="routerLink" destination="/" text="Home" />
      </li>
      {isLoggedIn ? null : renderSignUpSignInButtons()}
    </ul>
  );
}

export default Header;
