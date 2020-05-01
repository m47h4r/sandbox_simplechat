import React , { useState } from 'react';

import Input from '../../components/Input/';

import './index.css';

function SignUp() {
	const [name, setName] = useState('John');

	const handleChange = (e) => {
		setName(e.target.value);
	}
	return (
		<div>
			<Input 
				type="text"
				placeholder="John"
				value={name}
				handleChange={handleChange}
			/>
			<p>{name}</p>
		</div>
	);
}

export default SignUp;
