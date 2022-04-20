require("dotenv").config();

(async () => {
  console.log("entrou");
  const AlertService = require("./domains/Alert/Checker");
  await new AlertService().sendYesterdayVideos();
  console.log("saiu");
})();
