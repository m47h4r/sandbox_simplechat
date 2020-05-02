import React from "react";

import Button from "../Button";

import "./index.css";

function Header() {
  return (
    <ul className="header">
      <li className="header__item header__item-home">
        <Button type="routerLink" destination="/" text="Home" />
      </li>
      <li className="header__item">
        <Button type="routerLink" destination="/signin" text="Sign In" />
      </li>
      <li className="header__item">
        <Button type="routerLink" destination="/signup" text="Sign Up" />
      </li>
    </ul>
  );
}

export default Header;
