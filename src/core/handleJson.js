import * as localForage from "localforage";
import { logger } from "../logger";
import { HashPassword } from "./hashing.";
const path = require("path");
const remote = window.require("electron").remote;
const app = remote.app;
const fs = remote.require("fs");

export const handleJson = (values) => {
  logger.debug("handleJson.js, Inside handleJson");
  let file = path.join(app.getPath("userData"), "DB.json");
  let hashedPassword = HashPassword(values.password);
  values.password = hashedPassword.password;
  values.salt = hashedPassword.salt;
  if (fs.existsSync(file)) {
    fs.readFile(file, function (err, data) {
      if (err) {
        logger.error("handleJson.js,Failed to read the data from file");
        return;
      }
      logger.debug("handleJson.js,Successfully read the data from file");
      var json = JSON.parse(data);
      json.push(values);
      try {
        fs.writeFileSync(file, JSON.stringify(json));
        logger.debug(
          "handleJson.js,Successfully added new user to the existing list in file"
        );
      } catch (err) {
        logger.error("handleJson.js,Failed to add new user to the file");
      }
      // Add new user to localForage:
      localForage.setItem("users", json, function (err) {
        if (err) {
          logger.error(
            "handleJson.js, Failed to add new user to existing list"
          );
        }
        logger.debug("handleJson.js, Added new user to existing list");
      });
    });
  } else {
    var array = [];
    array.push(values);
    try {
      fs.writeFileSync(file, JSON.stringify(array));
      logger.debug(
        "handleJson.js,Successfully created and written to the file"
      );
    } catch (err) {
      logger.error("handleJson.js,Failed to create and write to the file");
    }
    // Add new user to localForage:
    localForage.setItem("users", array, function (err) {
      if (err) {
        logger.error(
          "handleJson.js, Failed to Create a file and add user to LocalForage"
        );
      }
      logger.debug(
        "handleJson.js, Created a file and added user to LocalForage"
      );
    });
  }
  logger.debug("handleJson.js, Exiting from handleJson");
  window.location.reload();
};
