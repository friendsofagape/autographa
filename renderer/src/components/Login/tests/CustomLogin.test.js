import React from 'react';
import { render } from '@testing-library/react';
import CustomLogin from '../CustomLogin'

describe('Login component tests', () => {
	test('Should render CustomLogin component without error', () => {
		render(<CustomLogin />);
	});
  test('Should have login button', async () => {
    const { getByTestId } = render(<CustomLogin />);
    const button = getByTestId('login-button');
    expect(button.type).toEqual('submit');
  });
});
