import { handleJson } from './handleJson';
import { HashPassword } from './hashing';

const createUser = (values, fs) => {
	console.log('createUser', values);
	const token = HashPassword(values.username);
	let obj = {
		firstname: '',
		lastname: '',
		email: values.username,
		work: 'Individual',
		organization: '',
		selectedregion: '',
		password: '',
		confirmpassword: '',
		access_token: token.password,
	};
	// return obj;
	const result = handleJson(obj, fs);
	result.then((response) => {
		console.log(response, result);
		if (response.fetchFile === true) {
			console.log('Unable to fetch Data from file');
			// logger.error('Singup.js, Unable to fetch Data from file');
		} else {
			console.log('obj', obj);
			return obj;
			// logger.debug('Singup.js, End handleSubmit');
		}
	});
};
const handleLogin = (users, values, fs) => {
	console.log('handleLogin', users, values);
	if (values.online === false) {
		if (users) {
			const user = users.find((value) => value.email === values.username);
			if (user) {
				return user;
			}
		}
		const user = createUser(values, fs);
		console.log(user);
		return user;
	}
};
export default handleLogin;
