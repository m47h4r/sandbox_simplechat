import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

import config from "../../config/";

import Input from "../../components/Input/";
import Button from "../../components/Button";

import "./index.css";

function checkFieldsAgainstRegex(fields) {
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

function SignIn(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cookies, setCookie] = useCookies(["session-cookie"]);

  async function makeSignInRequest(fields) {
    try {
      return await axios.post(config.backend.url + "/user/signin", fields);
    } catch (error) {
      props.setMessageType("failure");
      props.setMessage("Can not contact securechat servers :(");
    }
  }

  const signInHandler = async () => {
    let fields = {
      email: email,
      password: password,
    };
    let result = formValidator(fields);
    if (result.status) {
      let signInResult = await makeSignInRequest(fields);
      if (signInResult.data.status === "success") {
        props.setMessageType("success");
        props.setMessage(
          "Welcome " +
            signInResult.data.user.name +
            " " +
            signInResult.data.user.surname +
            "."
        );
        setCookie("session-cookie", signInResult.data.user.sessionSecret, {
          path: "/",
        });
				// TODO: redirect user to home here
        // TODO: must redirect here
        // TODO: must handle empty fields from backend and default to
        // a predefined error
      } else if (signInResult.data.status === "failure") {
        props.setMessageType("failure");
        props.setMessage(signInResult.data.error);
      }
    } else {
      props.setMessageType("failure");
      props.setMessage(result.errorString);
    }
  };

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
