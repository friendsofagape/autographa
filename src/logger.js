import moment from "moment";
const winston = window.winston;
const { printf } = window.format

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${dateFormat()} [${level}]: ${message}`;
});

const dateFormat = () => {
  let localTime = moment.utc().toDate();
  localTime = moment(localTime).format('YYYY-MM-DD HH:mm:ss');
  return localTime
}
export const logger = winston.createLogger({
  transports: [
  new winston.transports.File({
      level: "debug",
      filename: "Aglog-warn.log",
      format: winston.format.combine(
        myFormat,
      ),
    }),
  ]
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