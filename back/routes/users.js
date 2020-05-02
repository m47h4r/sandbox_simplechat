const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const debug = require('debug')('back:server');

/* GET users listing. */
router.get('/', (request, res, next) => {
	//let mazhar = new User({
	//	name: 'mazhar',
	//	surname: 'zandsalimi',
	//	username: 'm47h4r',
	//	email: 'm47h4r@gmail.com',
	//	bio: '',
	//	pass: '12341234'
	//});
	//mazhar.save((err, mz) => {
	//	if (err) return console.error(err);
	//	console.log(mz);
	//});
  res.send('respond with a resource');
});

router.post('/signup', (request, response) => {
	let user = new User({
		name: request.body.name,
		surname: request.body.surname,
		email: request.body.email,
		bio: request.body.bio,
		pass: request.body.pass
	});
	user.save((error) => {
		if (error) debug(error);
		response.status(200).end();
	});
	response.sendStatus(200);
});

module.exports = router;
