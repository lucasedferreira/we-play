const { Client } = require("@notionhq/client");

module.exports = class NotionClient {
  constructor() {
    this.notion = new Client({
      auth: process.env.NOTION_TOKEN,
    });
  }

  async createPage(data, databaseId) {
    await this.notion.pages.create({
      parent: {
        database_id: databaseId,
      },
      properties: this.#parseData(data),
    });
  }

  #parseData(properties) {
    const propertiesInArray = Object.entries(properties);

    const parsedProperties = {};
    for (const property of propertiesInArray) {
      const propertyName = property[0];
      const propertyValue = property[1];

      if (propertyName === "title") {
        parsedProperties.title = [{ text: { content: propertyValue } }];
        continue;
      }

      parsedProperties[propertyName] = propertyValue;
    }
console.log(parsedProperties);
    return parsedProperties;
  }
};
