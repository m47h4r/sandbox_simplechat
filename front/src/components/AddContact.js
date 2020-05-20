import React, { useState } from "react";

import axios from "axios";

import Button from "./Button";
import Input from "./Input";

import config from "../config/";

import "./AddContact.css";

function AddContact(props) {
	const [contactEmail, setContactEmail] = useState("");

	const makeAddContactRequest = async (fields) => {
		try {
			return await axios.post(config.backend.url + "/user/addContact", fields);
		} catch (error) {
			props.setMessageType("failure");
			props.setMessage("Can not contact servers :(");
		}
	};

	const handleAddContact = async () => {
		let fields = {
			claimedSessionSecret: props.sessionCookie,
			email: contactEmail
		};
		let result = await makeAddContactRequest(fields);
		console.log(result);
	};

	const handleChange = (e) => {
		switch (e.target.name) {
			case "email":
				setContactEmail(e.target.value);
				break;
			default:
		}
	};

	return (
		<div className="add-contact-wrapper">
			<Input
				name="email"
				type="text"
				placeholder="john@doe.com"
				value={contactEmail}
				handleChange={handleChange}
				noMargin={true}
			/>
			<Button type="button" onClick={handleAddContact} text="Add" />
		</div>
	);
}

export default AddContact;
