const YouTubeClient = require("./Client");
const moment = require("moment");

module.exports = class YouTubeVideo {
  #youtube;

  constructor() {
    this.#youtube = new YouTubeClient();
  }

  async getByUrl(url) {
    const response = await this.#youtube.getVideoByUrl(
      url,
      "snippet",
      "contentDetails"
    );

    if (!response?.data?.items || response.data.items.length === 0)
      throw new Error("Video not found");

    const video = response.data.items[0];
    return {
      title: video.snippet.title,
      url: `https://www.youtube.com/watch?v=${video.id}`,
      channel: video.snippet.channelTitle,
      thumbnail:
        video.snippet.thumbnails?.maxres?.url ??
        video.snippet.thumbnails.high.url,
      publishedAt: video.snippet.publishedAt,
      tags: video.snippet.tags,
      duration: this.#parseDuration(video.contentDetails.duration),
    };
  }

  #parseDuration(duration) {
    const durationAsMinutes = moment.duration(duration).asMinutes();
    return Number((Math.round(durationAsMinutes * 2) / 2).toFixed(1));
  }
};
