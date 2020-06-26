import React from "react";
import "@testing-library/jest-dom";
import Enzyme, { shallow } from "enzyme";
import EnzymeAdapter from "enzyme-adapter-react-16";
import { cleanup, render, getByTestId } from "@testing-library/react";
import CustomizedSlider from "./FontSlider";

Enzyme.configure({ adapter: new EnzymeAdapter() });
afterEach(cleanup);
/**
 * Return node(s) with the given data-test attribute.
 * @param {ShallowWrapper} wrapper - Enzyme shallow wrapper.
 * @param {string} val - Value of data-test attribute for search.
 * @returns {ShallowWrapper}
 */
const findByTestAttr = (wrapper, val) => {
  return wrapper.find(`[data-test="${val}"]`);
};

/**
 * Factory function to create a ShallowWrapper for the Congrats component.
 * @function setup
 * @param {object} props - Component props specific to this setup.
 * @returns {ShallowWrapper}
 */
const setup = (props = {}) => {
  const setupProps = { ...props };
  return shallow(<CustomizedSlider {...setupProps} />);
};

test("Slider renders without error", () => {
  const wrapper = setup();
  const sliderComponent = findByTestAttr(
    wrapper,
    "component-customized-slider"
  );
  expect(sliderComponent.length).toBe(1);
});

describe("state controlled inc and dec button", () => {
  test("state update with value on every inc click", () => {
    const mockSetfontValue = jest.fn();
    React.useState = jest.fn(() => [15, mockSetfontValue]);

    const wrapper = setup();
    const incButton = findByTestAttr(wrapper, "increment-button");

    const mockEvent = { target: { value: +2 } };
    incButton.simulate("click", mockEvent);

    expect(mockSetfontValue).toHaveBeenCalledWith(17);
  });
  test("state update with value on every decrement click", () => {
    const mockSetfontValue = jest.fn();
    React.useState = jest.fn(() => [18, mockSetfontValue]);

    const wrapper = setup();
    const decButton = findByTestAttr(wrapper, "decrement-button");

    const mockEvent = { target: { value: -2 } };
    decButton.simulate("click", mockEvent);

    expect(mockSetfontValue).toHaveBeenCalledWith(16);
  });

  test("render slider without error", () => {
    const mockSetfontValue = jest.fn();
    React.useState = jest.fn(() => [20, mockSetfontValue]);

    const { container } = render(<CustomizedSlider />);
    const sliderButton = getByTestId(container, "slide-button");
    expect(sliderButton.textContent).toBe("20");
  });
});
