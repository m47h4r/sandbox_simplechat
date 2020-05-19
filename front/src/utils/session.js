import config from "../config/";

import axios from "axios";

const checkUserSession = async (claimedSessionSecret) => {
	// result := true | false
	let result = await axios.post(config.backend.url + "/user/checkSession", {
		claimedSessionSecret: claimedSessionSecret,
	});
	return result.data.result;
};

export { checkUserSession };
