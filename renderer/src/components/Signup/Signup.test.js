import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import intl from "../ProjectsPage/tests/helper";
import Signup from "./Signup";
import CustomLogin from '../Login/CustomLogin'

describe('Signup component tests', () => {
  test("renders without fail", () => {
    render(intl(<Signup />));
  });
  test('Should have called CustomLogin', async () => {
    render(<CustomLogin />);
  });
  test("Signup should have link to Login page.", () => {
    const { getByTestId } = render(intl(<Signup />));
    const link = getByTestId('signup');
    expect(link.href).toBe("http://localhost/login");
  });
});
