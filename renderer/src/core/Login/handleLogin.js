import { handleJson } from './handleJson';
import * as logger from '../../logger';

export const createUser = (values, fs) => {
  logger.debug('handleLogin.js', 'In createUser to create a new user');
  const obj = {
    username: values.username,
    name: '',
    email: '',
    work: 'Individual',
    organization: '',
    selectedregion: '',
    offlineuser: true,
  };
  return handleJson(obj, fs).then(() => obj);
};

export const handleLogin = (users, values) => {
  logger.debug('handleLogin.js', 'In handleLogin function');
  if (users) {
    const user = users.find((value) => value.username === values.username);
    if (user) {
      return user;
    }
  }
  return null;
};
