import React, { useState, useEffect } from "react";

import Button from "./Button";
import AddContact from "./AddContact";

import axios from "axios";

import config from "../config/";

import "./ContactList.css";

function ContactList(props) {
	const [isAddContactPresent, setIsAddContactPresent] = useState(false);
	const [contactList, setContactList] = useState(null);

	useEffect(() => {
		const getContactList = async () => {
			const result = await axios.post(
				config.backend.url + "/user/getContactList",
				{ claimedSessionSecret: props.sessionCookie }
			);
			console.log(result);
			setContactList(result.data.contactList);
		};
		getContactList();
	}, [props.sessionCookie]);

	const toggleAddContact = () => {
		setIsAddContactPresent(!isAddContactPresent);
	};

	// TODO: v
	const someFunc = () => { console.log('will be implemented') };

	const generateContactList = () => {
		if (contactList) {
			return contactList.map((currentContact) => (
				<div
					className="contact"
					key={currentContact.name + currentContact.surname}
					onClick={someFunc}
				>
					<div className="contact__name">{currentContact.name}</div>
					<div className="contact__surname">{currentContact.surname}</div>
				</div>
			));
		}
	};

	return (
		<>
			<div className="contact-list">
				<div className="contact-list-header">
					<div className="contact-list-header__title">Contacts</div>
					<div className="contact-list-header__add-contact">
						<Button
							type="button"
							onClick={toggleAddContact}
							text={isAddContactPresent ? "Close" : "Add contact"}
						/>
					</div>
				</div>
				{isAddContactPresent ? (
					<AddContact sessionCookie={props.sessionCookie} />
				) : null}
				<div className="contact-list-body">{generateContactList()}</div>
			</div>
		</>
	);
}

export default ContactList;
