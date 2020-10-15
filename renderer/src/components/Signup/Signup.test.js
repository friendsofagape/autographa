import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import intl from "../tests/helper";
import { act } from "react-dom/test-utils";
import Signup from "./Signup";
window.require = require;
test("renders without fail", () => {
  render(intl(<Signup />));
});

describe("state control of Signup fields", () => {
  test("state update on first name upon change", async () => {
    const { getByTestId } = render(intl(<Signup />));
    const firstnameBox = getByTestId("firstnamefield");
    await act(async () => {
      fireEvent.change(firstnameBox, { target: { value: "Mark" } });
    });
    expect(firstnameBox).toHaveValue("Mark");
  });

  test("state update on last name upon change", async () => {
    const { getByTestId } = render(intl(<Signup />));
    const LastnameBox = getByTestId("lastnamefield");
    await act(async () => {
      fireEvent.change(LastnameBox, { target: { value: "Luke" } });
    });
    expect(LastnameBox).toHaveValue("Luke");
  });

  test("state update on email upon change", async () => {
    const { getByTestId } = render(intl(<Signup />));
    const emailBox = getByTestId("emailfield");
    await act(async () => {
      fireEvent.change(emailBox, {
        target: { value: "testmail@tmail.com" },
      });
    });
    expect(emailBox).toHaveValue("testmail@tmail.com");
  });

  test("state update from Individual to Organisation on select", async () => {
    const { getByLabelText } = render(intl(<Signup />));
    const radioIndividual = getByLabelText("Individual");
    const radioOrg = getByLabelText("Organization");
    fireEvent.click(radioOrg);
    expect(radioIndividual).not.toBeChecked();
    expect(radioOrg).toBeChecked();
    expect(radioOrg.value).toBe("Organization");
  });

  test("Name of Organisation field should be disabled", async () => {
    const { getByTestId } = render(intl(<Signup />));
    const orgBox = getByTestId("orgfield");
    expect(orgBox.disabled).toEqual(true);
  });

  test("should check password field and state set", async () => {
    const { getByTestId } = render(intl(<Signup />));
    const passwordbox = getByTestId("passwordfield");
    await act(async () => {
      fireEvent.change(passwordbox, { target: { value: "testPassword" } });
    });
    expect(passwordbox).toHaveValue("testPassword");
  });

  test("should check confirm password field and state set", async () => {
    const { getByTestId } = render(intl(<Signup />));
    const passwordbox = getByTestId("confirmpassfield");
    await act(async () => {
      fireEvent.change(passwordbox, { target: { value: "conPassword" } });
    });
    expect(passwordbox).toHaveValue("conPassword");
  });

  test("should Signup", async () => {
    const mockSetSignup = jest.fn();
    React.useState = jest.fn(() => ["", mockSetSignup]);
    const { getByTestId } = render(intl(<Signup />));
    const signupButton = getByTestId("submitButton");
    await act(async () => {
      userEvent.click(signupButton);
    });
    expect(mockSetSignup).toHaveBeenCalled();
  });
});