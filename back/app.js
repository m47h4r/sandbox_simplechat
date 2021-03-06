const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const config = require("./config/");
const mongoose = require("mongoose");
const debug = require("debug")("back:server");

require("./models/User");
require("./models/Message");

const userRouter = require("./routes/user");
const sessionRouter = require("./routes/session");

const app = express();

app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

mongoose.connect(config.db.uri, { useNewUrlParser: true });
mongoose.connection.once("open", () => {
	debug("connected to database");
});

app.use("/user", userRouter);
app.use("/session", sessionRouter);

module.exports = app;
