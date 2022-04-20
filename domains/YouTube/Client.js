const axios = require("axios");

module.exports = class YouTubeClient {
  #client;
  #baseUrl;

  constructor() {
    this.#client = axios.create();
    this.#client.interceptors.request.use(function (config) {
      config.url = config.url.concat(`&key=${process.env.YOUTUBE_TOKEN}`);
      return config;
    });

    this.#baseUrl = `https://www.googleapis.com/youtube/v3`;
  }

  async getVideoByUrl(url, ...options) {
    const youtubeId = this.#extractCodeFromUrl(url);
    const parts = options.join(",");

    return await this.#client.get(
      `${this.#baseUrl}/videos?id=${youtubeId}&part=${parts}`
    );
  }

  #extractCodeFromUrl(url) {
    const youtubeIdLength = 11;
    const youtubeShortenedLink = "https://youtu.be/";
    const youtubeFullLink = "https://www.youtube.com/watch?v=";
    const isShortenedLink = url.includes(youtubeShortenedLink);
    const cutQuantity = isShortenedLink
      ? youtubeShortenedLink.length
      : youtubeFullLink.length;

    return url.slice(cutQuantity, cutQuantity + youtubeIdLength);
  }
};
