import React from 'react';

import Button from '../Button';

import './index.css';

function Header() {
	return (
		<ul className="header">
			<li className="header__item header__item-home">
				<Button isRouterLink="true" destination="/" text="Home" />
			</li>
			<li className="header__item">
				<Button isRouterLink="true" destination="/signin" text="Sign In" />
			</li>
			<li className="header__item">
				<Button isRouterLink="true" destination="/signup" text="Sign Up" />
			</li>
		</ul>
	);
}

export default Header;
