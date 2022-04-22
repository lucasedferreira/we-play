const NotionClient = require("./Client");
const notionDatabases = require("../../enums/NotionDatabase");
const notionUsers = require("../../enums/NotionUser");
const telegramChats = require("../../enums/TelegramChat");
const YouTubeVideo = require("../YouTube/Video");

module.exports = class NotionVideoCreator {
  #notion;

  constructor() {
    this.#notion = new NotionClient();
  }

  async create(url, options = {}) {
    console.log("entrou", url);
    const video = await new YouTubeVideo().getByUrl(url);

    const groupsIds = await this.#getGroups(video.tags);
    const createdById = this.#getCreator(options.userId);
    const content = this.#getEmbedVideo(video.url);

    await this.#notion.createPage(
      notionDatabases.VIDEOS_TO_WATCH,
      {
        title: video.title,
        Thumb: video.thumbnail,
        Duration: video.duration,
        Channel: video.channel,
        Url: url,
        Group: groupsIds,
        "Published At": video.publishedAt,
        "Created By": createdById,
      },
      content
    );
    console.log("saiu");
  }

  async #getGroups(tags) {
    let groupsIds = [];
    if (tags?.length > 0) {
      const groups = await this.#notion.searchGroupsByName(tags);
      groupsIds = groups.results.map((group) => group.id);
    }
    return groupsIds;
  }

  #getCreator(userId) {
    return {
      [telegramChats.LUCAS]: notionUsers.LUCAS,
      [telegramChats.ARTHUR]: notionUsers.ARTHUR,
    }[userId];
  }

  #getEmbedVideo(url) {
    console.log(url);
    return [
      {
        type: "block",
        type: "embed",
        embed: { url },
      },
    ];
  }
};
