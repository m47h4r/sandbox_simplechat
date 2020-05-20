import React, { useState } from "react";

import Button from "./Button";
import AddContact from "./AddContact";

import "./ContactList.css";

function ContactList(props) {
	const [isAddContactPresent, setIsAddContactPresent] = useState(false);

	const toggleAddContact = () => {
		setIsAddContactPresent(!isAddContactPresent);
	};

	return (
		<>
			<div className="contact-list">
				<div className="contact-list-header">
					<div className="contact-list-header__title">title here</div>
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
				<div className="contact-list-body">contacts will be here</div>
			</div>
		</>
	);
}

export default ContactList;
