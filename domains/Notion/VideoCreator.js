const NotionClient = require("./Client");
const notionDatabases = require("../../enums/NotionDatabase");

module.exports = class NotionVideoCreator {
  #notion;

  constructor() {
    this.#notion = new NotionClient();
  }

  async create(url) {
    console.log("entrou", url);
    await this.#notion.createPage(
      {
        title: "test",
        Url: url,
      },
      notionDatabases.VIDEOS_TO_WATCH
    );
  }
};
