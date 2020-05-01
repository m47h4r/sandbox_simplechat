import React from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route
} from 'react-router-dom';

import './assets/css/global.css';

import Home from './pages/Home/';
import SignIn from './pages/SignIn/';
import SignUp from './pages/SignUp/';
import Header from './components/Header/';

import './App.css';

function App() {
  return (
		<Router>
			<div className="page">
				<div className="page__header">
					<Header />
				</div>

				<div className="page__main">
					<div className="page__main__inner">
						<Switch>
							<Route exact path="/">
								<Home />
							</Route>
							<Route path="/signin">
								<SignIn />
							</Route>
							<Route path="/signup">
								<SignUp />
							</Route>
						</Switch>
					</div>
				</div>
			</div>
		</Router>
  );
}

export default App;
