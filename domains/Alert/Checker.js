const Sender = require("./Sender");
const VideoFinder = require("../Notion/VideoFinder");
const notionUsers = require("../../enums/NotionUser");
const telegramChats = require("../../enums/TelegramChat");
const moment = require("moment");

module.exports = class AlertChecker {
  #cron;
  sender;

  constructor(cron) {
    this.#cron = cron;
    this.sender = new Sender();
  }

  async start() {
    this.#setCron();
  }

  #setCron() {
    this.#cron.schedule("0 21 * * *", async () => {
      console.log("Runnning daily check!");
      await this.check();
    });
  }

  async check() {
    await this.sendUnwatchedVideos();
  }

  async sendUnwatchedVideos() {
    for (const userName of ["LUCAS", "ARTHUR"]) {
      const videos = await new VideoFinder().getUnwatchedVideosUntilLastMonth(
        notionUsers[userName]
      );

      let warnings = { yesterday: false, lastWeek: false, lastMonth: false };
      for (const video of videos) {
        const videoId = video.id;
        const videoUrl = video.properties.Url.url;
        const videoCreatedAt = video.properties["Created At"].created_time;

        const today = moment();

        const createdYesterday = today.diff(videoCreatedAt, "days") <= 1;
        if (createdYesterday && !warnings.yesterday) {
          warnings.yesterday = true;
          await this.sender.sendMessage(
            telegramChats[userName],
            "Há vídeos de ontem que você ainda não viu 😴"
          );
        }

        const createdLastWeek = today.diff(videoCreatedAt, "weeks") === 1;
        if (createdLastWeek && !warnings.lastWeek) {
          warnings.lastWeek = true;
          await this.sender.sendMessage(
            telegramChats[userName],
            "Há vídeos de semana passada que você ainda não viu 😬"
          );
        }

        const createdLastMonth = today.diff(videoCreatedAt, "months") === 1;
        if (createdLastMonth && !warnings.lastMonth) {
          warnings.lastMonth = true;
          await this.sender.sendMessage(
            telegramChats[userName],
            "Há vídeos do mês passado que você ainda não viu 😱"
          );
        }

        await this.#sendInlineMessage(
          telegramChats[userName],
          videoId,
          videoUrl
        );
      }
    }
  }

  async #sendInlineMessage(chatId, videoId, videoUrl) {
    const replyOptions = {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "✅ Já assisti",
              callback_data: `set-as-watched-${videoId}`,
            },
            { text: "❌ Ainda não vi", callback_data: "clear-message" },
          ],
        ],
      },
    };

    await this.sender.sendInlineMessage(chatId, videoUrl, replyOptions);
  }
};
