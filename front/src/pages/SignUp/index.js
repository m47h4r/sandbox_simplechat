import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

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
  return result;
}

function SignUp(props) {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cookies, setCookie] = useCookies(["session-cookie"]);

  async function makeSignUpRequest(fields) {
    try {
      return await axios.post(config.backend.url + "/user/signup", fields);
    } catch (error) {
      props.setMessageType("failure");
      props.setMessage("Can not contact securechat servers :(");
    }
  }

  const signUpHandler = async () => {
    let fields = {
      name: name,
      surname: surname,
      email: email,
      password: password,
    };
    let result = formValidator(fields);
    if (result.status) {
      let signUpResult = await makeSignUpRequest(fields);
				console.log(signUpResult)
      if (signUpResult.data.status === "success") {
        props.setMessageType("success");
        props.setMessage("Successfully signed up!");
        setCookie("session-cookie", signUpResult.data.user.sessionSecret, {
          path: "/",
        });
				// TODO: redirect user to home here
      } else if (signUpResult.data.status === "failure") {
        // TODO: must identify error cases and differentiate between 'em
        props.setMessageType("failure");
        props.setMessage(signUpResult.data.error);
      }
    } else {
      props.setMessageType("failure");
      props.setMessage(result.errorString);
    }
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
