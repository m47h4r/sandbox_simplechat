import React, { useEffect, useState } from "react";

import "./index.css";

function Home(props) {
	return (
		<>
			<p>{JSON.stringify(props.isLoggedIn)}</p>
		</>
	);
}

export default Home;
