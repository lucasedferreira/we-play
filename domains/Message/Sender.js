module.exports = class MessageSender {
  ctx;

  constructor(ctx) {
    this.ctx = ctx;
  }

  sendMessage(message) {
    this.ctx.reply(message);
  }
};
