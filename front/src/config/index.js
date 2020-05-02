export default {
  regex: {
    name: /^[\w-]{3,}$/,
    surname: /^[\w-]{3,}$/,
    email: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
		passLength: /[a-z0-9]{8,}/,
		passCharInclusion: /[a-z]/,
		passNumInclusion: /[0-9]/,
  },
};
