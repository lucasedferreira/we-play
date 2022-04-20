const { Telegraf, Extra, Markup } = require("telegraf");

module.exports = class AlertSender {
  #bot;

  constructor() {
    this.#bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
  }

  async sendMessage(chat, message) {
    await this.#bot.telegram.sendMessage(chat, message);
  }

  async sendInlineMessage(chat, message, options) {
    return await this.#bot.telegram.sendMessage(chat, message, options);
  }
};
