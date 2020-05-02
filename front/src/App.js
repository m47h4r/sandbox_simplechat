import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./assets/css/global.css";

import Home from "./pages/Home/";
import SignIn from "./pages/SignIn/";
import SignUp from "./pages/SignUp/";
import Header from "./components/Header/";
import Message from "./components/Message/";

import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  return (
    <div className="app-container">
      <Message messageType={messageType} message={message} />
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
                  <SignUp
                    setMessage={setMessage}
                    setMessageType={setMessageType}
                  />
                </Route>
              </Switch>
            </div>
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;
