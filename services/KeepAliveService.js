const Client = require("../clients/GenericClient");
const WAKEUP_ROUTE = "/wakeup";

module.exports = class KeepAliveService {
  #app;
  #cron;
  #client;

  constructor(app, cron) {
    this.#app = app;
    this.#cron = cron;
    this.#client = new Client().client;
  }

  async start() {
    this.#setRoute();
    this.#setCron();
  }

  #setRoute() {
    this.#app.get(WAKEUP_ROUTE, (req, res) => {
      console.log("Im awake");
      res.send("Im awake");
    });
  }

  #setCron() {
    this.#cron.schedule("*/10 * * * *", async () => {
      console.log("Wake up!");
      await this.#wakeUp();
    });
  }

  async #wakeUp() {
    await this.#client.get(`${process.env.APP_URL}${WAKEUP_ROUTE}`);
  }
};
