const NotionClient = require("./Client");
const telegramChats = require("../../enums/TelegramChat");
const moment = require("moment");

module.exports = class NotionVideoUpdater {
  #notion;

  constructor(ctx) {
    this.#notion = new NotionClient();
  }

  async setAsWatched(chatId, videoId) {
    const property = chatId === telegramChats.LUCAS ? "Lucas" : "Arthur";
    await this.#notion.notion.pages.update({
      page_id: videoId,
      properties: {
        [`${property} Watched At`]: {
          date: {
            start: moment().format("YYYY-MM-DD"),
          },
        },
      },
    });
  }
};
