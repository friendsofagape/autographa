const winston = window.winston;

module.exports.logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      level: "info",
      filename: "Aglog-info.log",
      json: true,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.prettyPrint()
      ),
    }),
    new winston.transports.File({
      level: "error",
      filename: "Aglog-error.log",
      json: true,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.prettyPrint()
      ),
    }),
    new winston.transports.File({
      level: "warn",
      filename: "Aglog-warn.log",
      json: true,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.prettyPrint()
      ),
    }),
  ],
});
