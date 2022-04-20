const NotionClient = require("./Client");
const telegramChats = require("../../enums/TelegramChat");
const notionDatabases = require("../../enums/NotionDatabase");
const notionUsers = require("../../enums/NotionUser");
const moment = require("moment");

module.exports = class NotionVideoFinder {
  #notion;

  constructor(ctx) {
    this.#notion = new NotionClient();
  }

  async getUnwatchedVideosUntilLastMonth(userId) {
    const userName = userId === notionUsers.LUCAS ? "Lucas" : "Arthur";
    const { results } = await this.#notion.notion.databases.query({
      database_id: notionDatabases.VIDEOS_TO_WATCH,
      sorts: [{ property: "Created At", direction: "descending" }],
      filter: {
        and: [
          {
            property: "Created By",
            people: {
              contains: userId,
            },
          },
          {
            property: `${userName} Watched At`,
            date: {
              is_empty: true,
            },
          },
          {
            or: [
              {
                property: "Created At",
                date: {
                  after: moment().subtract(1, "days").format("YYYY-MM-DD"),
                },
              },
              {
                property: "Created At",
                date: {
                  equals: moment().subtract(1, "weeks").format("YYYY-MM-DD"),
                },
              },
              {
                property: "Created At",
                date: {
                  equals: moment().subtract(1, "months").format("YYYY-MM-DD"),
                },
              },
            ],
          },
        ],
      },
    });
    return results;
  }
};
