import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Login from './Login';
import { isElectron } from '../../core/handleElectron';
// import { act } from 'react-dom/test-utils';
// import intl from "./helper";

describe('Login component tests', () => {
	test('Should render Login component without error', () => {
		render(<Login />);
	});
	describe('Offline test', () => {
    if (isElectron()){
      test('Should switch from online to offline', async () => {
        const { getByRole } = render(<Login />);
        const myComponent = getByRole('checkbox');
        expect(myComponent).toHaveAttribute('checked', '');
        fireEvent.change(myComponent, { target: { value:false } });
        expect(myComponent).toHaveAttribute('value', 'false');
      });
    }
		test('Should have autocomplete as user field', async () => {
			const { getByRole } = render(<Login />);
			const autocomplete = getByRole('textbox');
			expect(autocomplete.value).toEqual('');
    });
    test('Should have login button', async () => {
			const { getByTestId } = render(<Login />);
      const loginButton = getByTestId('login-button');
      expect(loginButton.type).toEqual("button");
    });
  });
  
	// describe('Online test', () => {
	// 	test('Update state on password change', async () => {
	// 		const { getByTestId } = render(<Login />);
	// 		const element = getByTestId('password-textfield');
	// 		const passwordTextfield = element.children[0];
	// 		await act(async () => {
	// 			fireEvent.change(passwordTextfield, {target: { value: 'testPassword' },});
	// 		});
	// 		expect(passwordTextfield.value).toEqual('testPassword');
	// 	});
	// });

	// test('Should click login button', async () => {
	//   const mockLogin = jest.fn();
	//   React.useState = jest.fn(() => ['', mockLogin]);
	//   const { getByTestId } = render(<Login />);
	//   const usernameTextfield = getByTestId('username-textfield');
	//   const element = getByTestId('password-textfield');
	//   const passwordTextfield = element.children[0];
	//   const loginButton = getByTestId('login-button');
	//   await act(async () => {
	//     fireEvent.change(usernameTextfield, { target: { value: 'testUser' } });
	//     fireEvent.change(passwordTextfield, {
	//       target: { value: 'testPassword' },
	//     });
	//     fireEvent.click(loginButton);
	//   });
	//   expect(mockLogin).toHaveBeenCalled();
	//   // expect(mockLogin).toBeCalledWith({
	//   //   username: "testUser",
	//   //   password: "testPassword",
	//   //   showPassword: false,
	//   // });
	// });
});
