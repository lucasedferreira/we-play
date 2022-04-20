require("dotenv").config();
const cron = require("node-cron");
const express = require("express");
const app = express();

const WePlay = require("./domains/main");
new WePlay().init();

const AlertService = require("./domains/Alert/Checker");
new AlertService(cron).start();

const KeepAliveService = require("./domains/KeepAlive/KeepAlive");
new KeepAliveService(app, cron).start();

app.listen(process.env.PORT || 5000, () => {
  console.log("App is started");
});
