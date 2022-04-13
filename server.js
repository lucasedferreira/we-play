require("dotenv").config();
const cron = require("node-cron");
const express = require("express");
const app = express();

// const TelegramService = require("./services/Telegraf/TelegrafService");
// new TelegramService().init();

const KeepAliveService = require("./services/KeepAliveService");
new KeepAliveService(app, cron).start();

app.listen(process.env.PORT || 5000, () => {
  console.log("App is started");
});