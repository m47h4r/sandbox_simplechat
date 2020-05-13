const express = require('express');
const router = express.Router();
const debug = require("debug")("back:server");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json('some');
});

module.exports = router;
