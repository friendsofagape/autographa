// import moment from "moment";
// let winston;
// let printf;
// let app, fs, remote, filepath;
// const path = require("path");
//   winston = require("winston");
//   printf = require("winston").format.printf;
//   fs = require("fs");
//   filepath = "Ag-debug.log";

// const myFormat = printf(({ level, message, label, timestamp }) => {
//   const customMessage = message.split(",");
//   const fileName = customMessage[0];
//   const filenameIndex = customMessage.indexOf(customMessage[0]);
//   customMessage.splice(filenameIndex, 1);
//   const resultingMessage = customMessage.join(",");
//   return `${dateFormat()} [${level.toUpperCase()}] ${fileName}:${resultingMessage}`;
// });

// const dateFormat = () => {
//   let localTime = moment.utc().toDate();
//   localTime = moment(localTime).format("YYYY-MM-DD HH:mm:ss");
//   return localTime;
// };
// export const logger = winston.createLogger({
//   transports: [
//     new winston.transports.File({
//       level: process.env.NODE_ENV === "production" ? "warn" : "debug",
//       filename: filepath,
//       format: winston.format.combine(myFormat),
//     }),
//   ],
// });
