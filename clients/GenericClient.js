const axios = require("axios").default;

module.exports = class GenericClient {
  constructor() {
    this.client = axios;
  }
};
