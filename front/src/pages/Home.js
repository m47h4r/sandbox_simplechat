import React, { useEffect, useState } from "react";

import "./Home.css";

function Home(props) {
	return (
		<>
			<p>{JSON.stringify(props.isLoggedIn)}</p>
		</>
	);
}

export default Home;
