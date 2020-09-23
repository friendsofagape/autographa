import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import Projects from "../ProjectsPane/Projects";
import "@testing-library/jest-dom/extend-expect";
import intl from "./helper";

jest.useFakeTimers();

test("Projects pane renders without error", () => {
  render(intl(<Projects />));
});

const starrted = [
  {
    name: "English NIV",
    language: "English(eng)",
    date: "2 May 2020",
    view: "2020-08-29 14:33:26",
  },
  {
    name: "Malayalam NIV",
    language: "Malyalam(mal)",
    date: "7 Sep 2020",
    view: "2020-08-29 14:33:26",
  },
  {
    name: "Hindi new",
    language: "Hindi(hin)",
    date: "6 Apr 2020",
    view: "2020-08-29 14:33:26",
  },
  {
    name: "Hindi NIV",
    language: "Hindi(hin)",
    date: "5 Apr 2020",
    view: "2020-08-29 14:33:26",
  },
];
const unstarrted = [
  {
    name: "Arabic NIV",
    language: "Arabic(arb)",
    date: "2 May 2020",
    view: "2020-08-29 14:33:26",
  },
  {
    name: "tamil new",
    language: "tam(tam)",
    date: "10 May 2020",
    view: "2020-08-29 14:33:26",
  },
  {
    name: "Hindi NIV",
    language: "Hindi(hin)",
    date: "5 Apr 2020",
    view: "2020-08-29 14:33:26",
  },
  {
    name: "Malayalam NET",
    language: "Malyalam(mal)",
    date: "4 Jun 2020",
    view: "2020-08-29 14:33:26",
  },
];

describe("Starred content table test", () => {
  test("Check each content in the starred row", () => {
    render(intl(<Projects starrted={starrted} unstarrted={unstarrted} />));
    const starredrowname = document.querySelector("#starredrow-name");
    expect(starredrowname.textContent).toBe("English NIV");
    const starredrowlanguage = document.querySelector("#starredrow-language");
    expect(starredrowlanguage.textContent).toBe("English(eng)");
    const starredrowdate = document.querySelector("#starredrow-date");
    expect(starredrowdate.textContent).toBe("2 May 2020");
    const starredrowtime = document.querySelector("#starredrow-time");
    expect(starredrowtime.textContent).toBe("4 weeks ago");
  });

  test("Check for starrred rows gets unstarred", () => {
    render(intl(<Projects starrted={starrted} unstarrted={unstarrted} />));
    const starredrow = document.querySelector("#starredrow");
    expect(starredrow.children.length).toBe(4);
    const starredbutton = document.querySelector("#starredicon");
    fireEvent.click(starredbutton);
    expect(starredrow.children.length).toBe(3);
  });

  test("check for search state change", async () => {
    const { getByTestId } = render(
      intl(<Projects starrted={starrted} unstarrted={unstarrted} />)
    );
    const searchbox = getByTestId("searchfield");
    await act(async () => {
      fireEvent.change(searchbox, { target: { value: "eng" } });
    });
    expect(searchbox).toHaveValue("eng");
  });

  test("Check content after search in the starred row", async () => {
    const { getByTestId } = render(
      intl(<Projects starrted={starrted} unstarrted={unstarrted} />)
    );
    const searchbox = getByTestId("searchfield");
    await act(async () => {
      fireEvent.change(searchbox, { target: { value: "mal" } });
    });
    const starredrowname = document.querySelector("#starredrow-name");
    expect(starredrowname.textContent).toBe("Malayalam NIV");
    const starredrowlanguage = document.querySelector("#starredrow-language");
    expect(starredrowlanguage.textContent).toBe("Malyalam(mal)");
    const starredrowdate = document.querySelector("#starredrow-date");
    expect(starredrowdate.textContent).toBe("7 Sep 2020");
    const starredrowtime = document.querySelector("#starredrow-time");
    expect(starredrowtime.textContent).toBe("4 weeks ago");
  });
});

describe("Unstarred content fields test", () => {
  test("Check each content in the unstarred row", () => {
    render(intl(<Projects starrted={starrted} unstarrted={unstarrted} />));
    const unstarredrowname = document.querySelector("#unstarredrow-name");
    expect(unstarredrowname.textContent).toBe("Arabic NIV");
    const unstarredrowlanguage = document.querySelector(
      "#unstarredrow-language"
    );
    expect(unstarredrowlanguage.textContent).toBe("Arabic(arb)");
    const unstarredrowdate = document.querySelector("#unstarredrow-date");
    expect(unstarredrowdate.textContent).toBe("2 May 2020");
    const unstarredrowtime = document.querySelector("#unstarredrow-time");
    expect(unstarredrowtime.textContent).toBe("4 weeks ago");
  });
  test("Check for unstarrred rows gets starred", () => {
    render(intl(<Projects starrted={starrted} unstarrted={unstarrted} />));
    const unstarredrow = document.querySelector("#unstarredrow");
    expect(unstarredrow.children.length).toBe(5);
    const unstarredbutton = document.querySelector("#unstarredicon");
    fireEvent.click(unstarredbutton);
    expect(unstarredrow.children.length).toBe(4);
  });

  test("Check content after search in the unstarred row", async () => {
    const { getByTestId } = render(
      intl(<Projects starrted={starrted} unstarrted={unstarrted} />)
    );
    const searchbox = getByTestId("searchfield");
    await act(async () => {
      fireEvent.change(searchbox, { target: { value: "Hin" } });
    });
    const unstarredrowname = document.querySelector("#unstarredrow-name");
    expect(unstarredrowname.textContent).toBe("Hindi NIV");
    const unstarredrowlanguage = document.querySelector(
      "#unstarredrow-language"
    );
    expect(unstarredrowlanguage.textContent).toBe("Hindi(hin)");
    const unstarredrowdate = document.querySelector("#unstarredrow-date");
    expect(unstarredrowdate.textContent).toBe("5 Apr 2020");
    const unstarredrowtime = document.querySelector("#unstarredrow-time");
    expect(unstarredrowtime.textContent).toBe("4 weeks ago");
  });
});

describe("Sorting check", () => {
  test("Check whether items gets sorted", () => {
    render(intl(<Projects starrted={starrted} unstarrted={unstarrted} />));
    const sortbar = document.querySelector("#sorthead");
    fireEvent.click(sortbar);
    const starredrowname = document.querySelector("#starredrow-name");
    const starredrowlanguage = document.querySelector("#starredrow-language");
    const starredrowdate = document.querySelector("#starredrow-date");
    const starredrowtime = document.querySelector("#starredrow-time");
    expect(starredrowname.textContent).toBe("Malayalam NIV");
    expect(starredrowlanguage.textContent).toBe("Malyalam(mal)");
    expect(starredrowdate.textContent).toBe("7 Sep 2020");
    expect(starredrowtime.textContent).toBe("4 weeks ago");
    fireEvent.click(sortbar);
    expect(starredrowname.textContent).toBe("Arabic NIV");
    expect(starredrowlanguage.textContent).toBe("Arabic(arb)");
    expect(starredrowdate.textContent).toBe("2 May 2020");
    expect(starredrowtime.textContent).toBe("4 weeks ago");
  });
});
