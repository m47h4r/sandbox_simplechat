import React, { useEffect, useState } from "react";

import ContactList from "../components/ContactList";

import "./Home.css";

function Home(props) {
	return (
		<>
			{props.isLoggedIn ? (
				<ContactList
					setMessage={props.setMessage}
					setMessageType={props.setMessageType}
					sessionCookie={props.sessionCookie}
				/>
			) : (
				<p>You should sign in.</p>
			)}
		</>
	);
}

export default Home;
