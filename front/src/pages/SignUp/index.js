import React, { useState } from "react";

import config from "../../config/";

import Input from "../../components/Input/";
import Button from "../../components/Button";

import "./index.css";

function checkFieldsAgainstRegex(fields) {
  if (!config.regex.name.test(fields["name"])) {
    return { status: false, errorString: "Name is too short." };
  }
  if (!config.regex.surname.test(fields["surname"])) {
    return { status: false, errorString: "Surname is too short." };
  }
  if (!config.regex.email.test(fields["email"])) {
    return { status: false, errorString: "Email is not valid." };
  }
  if (!config.regex.passLength.test(fields["password"])) {
    return {
      status: false,
      errorString: "Password length must be 8 at least.",
    };
  }
  if (!config.regex.passCharInclusion.test(fields["password"])) {
    return {
      status: false,
      errorString: "Password must at least include an alphabtical letter.",
    };
  }
  if (!config.regex.passNumInclusion.test(fields["password"])) {
    return {
      status: false,
      errorString: "Password must at least include a numerical letter.",
    };
  }
  return { status: true, errorString: "" };
}

function checkFieldsForEmptiness(fields) {
  for (let field in fields) {
    if (fields[field].length <= 0) {
      return { status: false, errorString: field + " is empty." };
    }
  }
  return { status: true, errorString: "" };
}

function formValidator(fields) {
  let result = checkFieldsForEmptiness(fields);
  if (!result.status) return result;
  result = checkFieldsAgainstRegex(fields);
  if (!result.status) return result;
  return result;
}

function SignUp() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signUpHandler = () => {
    let result = formValidator({
      name: name,
      surname: surname,
      email: email,
      password: password,
    });
    console.log(result);
  };

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
