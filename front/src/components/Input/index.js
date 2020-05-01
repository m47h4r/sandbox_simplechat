import React from 'react';

import './index.css';

function Input(props) {
	return (
		<input
			type={props.type}
			placeholder={props.placeholder}
			value={props.value}
			onChange={props.handleChange}
		/>
	);
}

export default Input;
