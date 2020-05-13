const express = require('express');
const router = express.Router();
const debug = require("debug")("back:server");

/* GET home page. */
router.get('/', function(req, res, next) {
	debug(req.session);
  res.send(200);
});

module.exports = router;
