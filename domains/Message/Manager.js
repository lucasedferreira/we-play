const MessageSender = require("./Sender");
const NotionVideoCreator = require("../Notion/VideoCreator");

module.exports = class MessageManager {
  sender;
  message;
  userId;

  constructor(ctx) {
    this.sender = new MessageSender(ctx);
    this.message = ctx.update.message.text;
    this.userId = ctx.update.message.chat.id;
  }

  async handle() {
    const splittedMessage = this.message.split(" ");
    if (splittedMessage.length === 1) {
      if (this.#isUrl(this.message)) {
        await new NotionVideoCreator().create(this.message, {
          userId: this.userId,
        });
      }
    }
  }

  #isUrl(string) {
    const urlRegex =
      /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return urlRegex.test(string);
  }
};
