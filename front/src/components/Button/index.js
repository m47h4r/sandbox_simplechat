import React from 'react';
import { Link } from 'react-router-dom';

import './index.css';

function Button(props) {
	return (
		<>
		{props.isRouterLink === "true"
		?
			<Link to={props.destination} className="button">
				{props.text}
			</Link>
		:
			<a href={props.destination} className="button">
				{props.text}
			</a>
		}
		</>
	);
}

export default Button;
