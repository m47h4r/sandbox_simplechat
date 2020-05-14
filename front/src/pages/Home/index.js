import React, { useState } from 'react';
import { useCookies } from 'react-cookie';

import './index.css';

function Home() {
	const [cookies, setCookie] = useCookies(['session-cookie']);

	return (
		<>
      <p>{cookies['session-cookie']}</p>
		</>
	);
}

export default Home;
