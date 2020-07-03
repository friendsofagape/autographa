import React from "react";
import { mount } from "enzyme";
import TranslationSettings from "./TranslationSettings";
import { cleanup } from "@testing-library/react";

afterEach(cleanup);

const findByTestAttr = (wrapper, val) => {
  return wrapper.find(`[data-test="${val}"]`);
};
const setup = () => {
  return mount(<TranslationSettings />);
};

test("TranslationSettings renders without error", () => {
  const wrapper = setup();
  const sliderComponent = findByTestAttr(wrapper, "component-panel");
  expect(sliderComponent.length).toBe(1);
});
