import app from "./app.js";
import "./database.js";
import { config } from "./src/config.js";

async function main() {
  app.listen(config.server.PORT);
  console.log("server runing", "", +config.server.PORT);
}

main();
