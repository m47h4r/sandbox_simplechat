import React, { useState } from "react";

import Input from "../../components/Input/";
import Button from "../../components/Button";

import "./index.css";

function signInHandler() {
  console.log("hi from signIn function");
}

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleChange = (e) => {
    switch (e.target.name) {
      case "email":
        setEmail(e.target.value);
        break;
      case "password":
        setPassword(e.target.value);
        break;
      default:
    }
  };

  return (
    <>
      <Input
        name="email"
        type="email"
        placeholder="John@Doe.com"
        value={email}
        handleChange={handleChange}
      />
      <Input
        name="password"
        type="password"
        placeholder="********"
        value={password}
        handleChange={handleChange}
      />
      <div className="signin-button-container">
        <Button type="button" onClick={signInHandler} text="Sign In" />
      </div>
    </>
  );
}

export default SignIn;
