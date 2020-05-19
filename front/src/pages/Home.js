import React, { useEffect, useState } from "react";

import ContactList from '../components/ContactList';

import "./Home.css";

function Home(props) {
	return (
		<>
			{props.isLoggedIn ? <ContactList /> : <p>You should sign in :)</p>}
		</>
	);
}

export default Home;
