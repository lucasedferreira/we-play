const { Client } = require("@notionhq/client");
const notionDatabases = require("../../enums/NotionDatabase");

module.exports = class NotionClient {
  constructor() {
    this.notion = new Client({
      auth: process.env.NOTION_TOKEN,
    });
  }

  async createPage(databaseId, data) {
    await this.notion.pages.create({
      parent: {
        database_id: databaseId,
      },
      properties: this.#parseData(data),
    });
  }

  async searchGroupsByName(groupsNames) {
    if (!(groupsNames instanceof Array)) groupsNames = [groupsNames];

    const filters = groupsNames.map((groupName) => {
      return {
        property: "Name",
        rich_text: {
          contains: groupName,
        },
      };
    });

    return await this.notion.databases.query({
      database_id: notionDatabases.GROUPS,
      filter: {
        or: filters,
      },
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

      if (propertyName === "Thumb") {
        parsedProperties.Thumb = [
          {
            type: "external",
            name: "thumbnail",
            external: {
              url: propertyValue,
            },
          },
        ];
        continue;
      }

      if (propertyName === "Group") {
        parsedProperties.Group = propertyValue.map((groupId) => {
          return { id: groupId };
        });
        continue;
      }

      if (propertyName === "Published At") {
        parsedProperties["Published At"] = {
          start: propertyValue,
        };
        continue;
      }

      if (propertyName === "Created By") {
        parsedProperties["Created By"] = [{ id: propertyValue }];
        continue;
      }

      if (propertyName === "Channel") {
        parsedProperties.Channel = [{ text: { content: propertyValue } }];
        continue;
      }

      parsedProperties[propertyName] = propertyValue;
    }

    return parsedProperties;
  }
};
