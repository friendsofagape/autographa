const isElectron = require('is-electron');

let log;
if (process.env.NODE_ENV === 'test') {
  // eslint-disable-next-line global-require
  log = require('electron-log');
} else if (isElectron()) {
  log = global.log;
}

export const logger = (level, filename, text) => {
  if (isElectron()) {
    log.transports.file.level = process.env.NODE_ENV === 'production' ? 'warn' : 'debug';
    log.transports.file.file = 'aglogger.log';
    log.transports.file.maxSize = 15 * 1024 * 1024;
    log.transports.file.streamConfig = { encoding: 'utf8', flags: 'a' };
    log.transports.console.level = false;
    log.transports.file.format = '{y}-{m}-{d} {h}:{i}:{s} [{level}] {text}';

    switch (level) {
      case 'error':
        log.error(`${filename}: ${text}`);
        break;
      case 'warn':
        log.warn(`${filename}: ${text}`);
        break;
      case 'info':
        log.info(`${filename}: ${text}`);
        break;
      case 'debug':
        log.debug(`${filename}: ${text}`);
        break;
      default:
        return null;
    }
  }
  //   else {
  //     log.transports.file.level = process.env.NODE_ENV === 'production' ? 'warn' : 'debug';
  //     log.transports.console.level = false;
  //     log.transports.file.format = '{y}-{m}-{d} {h}:{i}:{s} [{level}] {text}';
  //   }
  return null;
};
