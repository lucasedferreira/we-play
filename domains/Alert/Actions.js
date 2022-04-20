const VideoUpdater = require("../Notion/VideoUpdater");

module.exports = class AlertActions {
  #bot;

  constructor(bot) {
    this.#bot = bot;
  }

  async create() {
    this.#bot.action("clear-message", async (ctx) => {
      const messageId = ctx.update.callback_query.message.message_id;
      await ctx.deleteMessage(messageId);
    });

    this.#bot.action(/set-as-watched-(.*)/, async (ctx) => {
      const chatId = ctx.update.callback_query.from.id.toString();
      const videoId = ctx.match[1];
      await new VideoUpdater().setAsWatched(chatId, videoId);

      const messageId = ctx.update.callback_query.message.message_id;
      await ctx.deleteMessage(messageId);
    });
  }
};
