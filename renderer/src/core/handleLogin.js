import { handleJson } from './handleJson';

export const createUser = (values, fs) => {
  const obj = {
    firstname: '',
    lastname: '',
    email: values.username,
    work: 'Individual',
    organization: '',
    selectedregion: '',
    password: '',
    confirmpassword: '',
  };
  return handleJson(obj, fs).then(() => obj);
};

export const handleLogin = (users, values) => {
  if (users) {
    const user = users.find((value) => value.email === values.username);
    if (user) {
      return user;
    }
  }
  return null;
};
