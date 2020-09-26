import moment from "moment";
let winston;
let printf;
let app, fs, remote, filepath;
const path = require("path");

if (process.env.NODE_ENV === "test") {
  remote = require("electron").remote;
  app = remote.app
  winston = require("winston");
  printf = require("winston").format.printf;
  fs = require("fs");
  filepath = 'Ag-debug.log'
} else {
  fs = window.require("fs");
  remote = window.require("electron").remote;
  app = remote.app;
  winston = window.require("winston");
  printf = window.require("winston").format.printf;
  filepath = path.join(
    app.getPath("userData"),
    "Autogrpha-log",
    'Ag-debug.log'
  );
  fs.mkdirSync(path.join(
    app.getPath("userData"),
    "Autogrpha-log"), { recursive: true });
}


const myFormat = printf(({ level, message, label, timestamp }) => {
  const customMessage = message.split(",");
  const fileName = customMessage[0];
  const filenameIndex = customMessage.indexOf(customMessage[0]);
  customMessage.splice(filenameIndex, 1);
  const resultingMessage = customMessage.join(",");
  return `${dateFormat()} [${level}] ${fileName}:${resultingMessage}`;
});

const dateFormat = () => {
  let localTime = moment.utc().toDate();
  localTime = moment(localTime).format("YYYY-MM-DD HH:mm:ss");
  return localTime;
};
export const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      level: "debug",
      filename: filepath,
      format: winston.format.combine(myFormat),
    }),
  ],
});

// new winston.transports.File({
//   level: "warn",
//   filename: "Aglog-warn.log",
//   json: true,
//   format: winston.format.combine(
//     winston.format.timestamp(),
//     winston.format.json(),
//     winston.format.prettyPrint()
//   ),
// }),
