import config from "../config/";

import axios from "axios";

const checkUserSession = async (claimedSessionSecret) => {
	// result := true | false
	let result = await axios.get(
		config.backend.url + "/session/check/",
		{ headers: { claimedsession: claimedSessionSecret } }
	);
	return result.data.result;
};

const updateSessionTime = async (claimedSessionSecret) => {
	// result := true | false
	let result = await axios.post(
		config.backend.url + "/session/update",
		{ claimedSessionSecret: claimedSessionSecret }
	);
	return result.data.result;
};

export { checkUserSession, updateSessionTime };
