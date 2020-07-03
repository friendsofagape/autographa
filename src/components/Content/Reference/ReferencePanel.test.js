import React from "react";
import { mount } from "enzyme";
import "@testing-library/jest-dom";
import ReferencePanel from "./ReferencePanel";
import { cleanup } from "@testing-library/react";
import { checkProps } from "../../../../test/testUtils";

afterEach(cleanup);

const findByTestAttr = (wrapper, val) => {
  return wrapper.find(`[data-test="${val}"]`);
};
const setup = (refContent = "should pass some string") => {
  return mount(<ReferencePanel refContent={refContent} />);
};

test("ReferencePanel renders without error", () => {
  const wrapper = setup();
  const ReferencePanel = findByTestAttr(wrapper, "reference-panel");
  expect(ReferencePanel.length).toBe(1);
});

test("ReferencePanel doesnt thow warning with expected props", () => {
  checkProps(ReferencePanel, { refContent: "string refernce content" });
});
