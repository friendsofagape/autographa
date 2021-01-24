import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import Profile from '../Profile';
import '@testing-library/jest-dom/extend-expect';
import intl from './helper';

jest.mock('localforage');
jest.useFakeTimers();

test('renders without fail', () => {
  render(intl(<Profile />));
});

describe('state controlled profile fields', () => {
  test('state update on first name upon change', async () => {
    const { getByTestId } = render(intl(<Profile />));
    const firstnameBox = getByTestId('firstnamefield');
    await act(async () => {
      fireEvent.change(firstnameBox, { target: { value: 'John' } });
    });
    expect(firstnameBox).toHaveValue('John');
  });
  test('state update on last name upon change', async () => {
    const { getByTestId } = render(intl(<Profile />));
    const firstnameBox = getByTestId('lastnamefield');
    await act(async () => {
      fireEvent.change(firstnameBox, { target: { value: 'Philip' } });
    });
    expect(firstnameBox).toHaveValue('Philip');
  });

  test('state update on email upon change', async () => {
    const { getByTestId } = render(intl(<Profile />));
    const firstnameBox = getByTestId('emailfield');
    await act(async () => {
      fireEvent.change(firstnameBox, {
        target: { value: 'testmail@mail.com' },
      });
    });
    expect(firstnameBox).toHaveValue('testmail@mail.com');
  });

  // test("should check for autocomplete region selector", async() => {
  //     const { container } = render(intl(<Profile />));
  //     const autocomplete = getByRole(container, 'textbox')

  //     // click into the component
  //     autocomplete.focus()

  //     // type "a"
  //     fireEvent.change(document.activeElement, { target: { value: 'a' } })

  //     // arrow down to first option
  //     fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' })

  //     // select element
  //     fireEvent.keyDown(document.activeElement, { key: 'Enter' })

  //     expect(autocomplete.value).toEqual('Arkansas')
  //     expect(someChangeHandler).toHaveBeenCalledTimes(1)
  // })

  test('should check password field and state set', async () => {
    const { getByTestId } = render(intl(<Profile />));
    const passwordbox = getByTestId('passwordbox');
    await act(async () => {
      fireEvent.change(passwordbox, { target: { value: 'password123' } });
    });
    expect(passwordbox).toHaveValue('password123');
  });

  test('should check language selector', async () => {
    const mockSetLanguage = jest.fn();
    React.useState = jest.fn(() => ['', mockSetLanguage]);
    const utils = render(intl(<Profile />));
    await act(async () => {
      const selectButtons = utils.getAllByRole('button'); // get all button list
      const accessButton = selectButtons.find(
        (button) => button.id === 'localeList',
      ); // find by id
      fireEvent.mouseDown(accessButton);
      const accessOption = await waitFor(() => utils.getByText('English'));
      fireEvent.mouseDown(accessOption);
      utils.getByText('Hindi');
      const { getByText } = render(intl(<Profile />));
      const selector = document.querySelector('#localeList');
      fireEvent.mouseDown(selector);
      const choice = getByText('Hindi');
      fireEvent.click(choice);
      expect(mockSetLanguage).toHaveBeenCalledWith('hi');
    });
  });

  test('should save profile settings', async () => {
    const mockSetProfile = jest.fn();
    React.useState = jest.fn(() => ['', mockSetProfile]);
    const { getByTestId } = render(intl(<Profile />));
    const saveButton = getByTestId('submit-button');
    await act(async () => {
      userEvent.click(saveButton);
    });
    expect(mockSetProfile).toHaveBeenCalled();
  });

  // test("should check language selector", async() => {
  //     const changeLangauge = jest.fn().mockImplementation(() => {
  //         console.log("changeHandler mock triggered");
  //       });
  //       let {
  //         getByText,
  //         getByTestId,
  //         getByRole,
  //         getAllByRole,
  //         container
  //       } = render(intl(<Profile onChange={changeLangauge} />));
  //       const selectNode = getByTestId("select-input");
  //       const selectButton = getAllByRole('button')[0];
  //       expect(selectButton).not.toBeNull();
  //       expect(selectNode).not.toBeNull();
  //       userEvent.click(selectButton);
  //       await waitForElement(() => getByText("Hindi"), { container });
  //       const itemClickable = getByText("Hindi");
  //       userEvent.click(itemClickable);
  //       expect(changeHandler).toHaveBeenCalled();
  //     })
});
