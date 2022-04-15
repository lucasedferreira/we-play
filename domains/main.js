const { Telegraf } = require("telegraf");
const MessageManager = require("./Message/Manager");

module.exports = class WePlay {
  bot;
  ctx;

  constructor() {
    this.bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
  }

  init() {
    this.bot.start((ctx) => ctx.reply("https://youtu.be/qfVuRQX0ydQ"));
    this.bot.help((ctx) => ctx.reply("Bot para gerenciar vídeos"));

    // this.#setCommands();

    this.bot.hears("ping", (ctx) => ctx.reply("pong"));
    this.bot.on("message", async (ctx) => {
      await new MessageManager(ctx).handle();
    });

    this.bot.launch();
  }

  async manageMessage(ctx) {
    this.ctx = ctx;
    await new MessageManagerService().handle();
  }
};
