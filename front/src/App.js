import React, { useEffect, useState } from "react";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from "react-router-dom";
import { useCookies } from "react-cookie";

import "./assets/css/global.css";

import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Header from "./components/Header";
import Message from "./components/Message";
import Chat from "./pages/Chat";

import { checkUserSession, updateSessionTime } from "./utils/session";

import "./App.css";

function App() {
	const [message, setMessage] = useState("");
	const [messageType, setMessageType] = useState("");
	const [cookies, setCookie] = useCookies(["session-cookie"]);
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		const checkSession = async () => {
			setIsLoggedIn(await checkUserSession(cookies["session-cookie"]));
		};
		checkSession();
	}, [cookies["session-cookie"]]);

	useEffect(() => {
		if (isLoggedIn) {
			const updateSession = async () => {
				updateSessionTime(cookies["session-cookie"]);
			};
			updateSession();
		}
	}, [isLoggedIn]);

	return (
		<div className="app-container">
			<Message
				messageType={messageType}
				message={message}
				setMessage={setMessage}
				setMessageType={setMessageType}
			/>
			<Router>
				<div className="page">
					<div className="page__header">
						<Header
							setMessage={setMessage}
							setMessageType={setMessageType}
							sessionCookie={cookies["session-cookie"]}
							setSessionCookie={setCookie}
							isLoggedIn={isLoggedIn}
						/>
					</div>

					<div className="page__main">
						<div className="page__main__inner">
							<Switch>
								<Route exact path="/">
									<Home
										setMessage={setMessage}
										setMessageType={setMessageType}
										sessionCookie={cookies["session-cookie"]}
										setSessionCookie={setCookie}
										isLoggedIn={isLoggedIn}
									/>
								</Route>
								<Route path="/signin">
									<SignIn
										setMessage={setMessage}
										setMessageType={setMessageType}
										sessionCookie={cookies["session-cookie"]}
										setSessionCookie={setCookie}
										isLoggedIn={isLoggedIn}
										setIsLoggedIn={setIsLoggedIn}
									/>
								</Route>
								<Route path="/signup">
									<SignUp
										setMessage={setMessage}
										setMessageType={setMessageType}
										sessionCookie={cookies["session-cookie"]}
										setSessionCookie={setCookie}
										isLoggedIn={isLoggedIn}
										setIsLoggedIn={setIsLoggedIn}
									/>
								</Route>
								<Route path="/chat"
									render={renderProps => (
										<Chat 
											setMessage={setMessage}
											setMessageType={setMessageType}
											sessionCookie={cookies["session-cookie"]}
											setSessionCookie={setCookie}
											isLoggedIn={isLoggedIn}
											setIsLoggedIn={setIsLoggedIn}
											renderProps={renderProps}
										/>
									)}
									>
								</Route>
							</Switch>
						</div>
					</div>
				</div>
				{isLoggedIn ? <Redirect to="/" /> : <Redirect to="/signin" />}
			</Router>
		</div>
	);
}

export default App;
