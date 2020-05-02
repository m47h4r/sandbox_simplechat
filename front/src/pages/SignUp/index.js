import React, { useState } from "react";

import Input from "../../components/Input/";
import Button from "../../components/Button";

import "./index.css";

function signUpHandler() {
  console.log("hi from signUp function");
}

function SignUp() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleChange = (e) => {
    switch (e.target.name) {
      case "name":
        setName(e.target.value);
        break;
      case "surname":
        setSurname(e.target.value);
        break;
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
        name="name"
        type="text"
        placeholder="John"
        value={name}
        handleChange={handleChange}
      />
      <Input
        name="surname"
        type="text"
        placeholder="Doe"
        value={surname}
        handleChange={handleChange}
      />
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
      <div className="signup-button-container">
        <Button type="button" onClick={signUpHandler} text="Sign Up" />
      </div>
    </>
  );
}

export default SignUp;
