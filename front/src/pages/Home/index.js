import React, { useState } from 'react';
import axios from 'axios';
import Button from "../../components/Button";

import './index.css';
import config from "../../config/";

function Home() {
	const [user, setUser] = useState("");

	const buttonHandler = async () => {
		let result = await axios.get(config.backend.url);
		console.log(result);
		console.log(result.data);
	}

	return (
		<>
			<Button type="button" onClick={buttonHandler} text="Sign In" />
			<p>{user}</p>
		</>
	);
}

export default Home;
