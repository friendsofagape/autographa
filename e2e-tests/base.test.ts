import { _electron as electron } from 'playwright';
import { test, expect } from '@playwright/test';

const fs = require('fs');

let electronApp;
let appPath;
let window;

test.only('Check for autographa app render', async () => {
    // Print the title.
      electronApp = await electron.launch({ args: ['main/index.js'] });
      appPath = await electronApp.evaluate(async ({ app }) => app.getAppPath());
      window = await electronApp.firstWindow();
      expect(await window.title()).toBe('Autographa');

    //   console.log(process);
    // Capture a screenshot.
    // Direct Electron console to Node terminal.
    // Click button.
      // await window.click('[aria-label=import]');

      //   await electronApp.close();
});
test('Navigate to and from projects', async () => {
  // Capture a screenshot.
  // Direct Electron console to Node terminal.
  // Click button.
    // await window.click('[aria-label=import]');
    await window.click('[aria-label=new]');
    await window.click('[aria-label=create]');
    await window.click('[aria-label=projectList]');
    await window.fill('#search_box', 'new');
    const title = await window.textContent('[aria-label=projects]');
    expect(title).toBe('Projects');

    //   await electronApp.close();
});

test('Fill and test new project page', async () => {
    await window.click('[aria-label=new]');
    await window.fill('#project_name', 'aatest project');
    await window.fill('#project_description', 'test version');
    await window.fill('#version_abbreviated', 'test abbreviation');
    await window.click('#open-advancesettings');
    await window.click('[aria-label=new-testament]');
    await window.click('[aria-label=close-custombiblenavigation]');
    await window.click('[aria-label=create]');
});

test('Check for newly created project and starred', async () => {
    await window.click('[aria-label=star-project]');
    const projectname = await window.innerText('[aria-label=project-name]');
    expect(projectname).toBe('aatest project');
});

test('Unstar the project', async () => {
    await window.click('[aria-label=unstar-project]');
    const projectname = await window.innerText('[aria-label=unstar-projectname]');
    expect(projectname).toBe('aatest project');
});

test('Search and test for resulting project', async () => {
    await window.fill('#search_box', 'aatest');
    const projectname = await window.innerText('[aria-label=unstar-projectname]');
    expect(projectname).toBe('aatest project');
});

test.only('Test for edit project with updated description', async () => {
    console.log(appPath);
    await window.click('[aria-label=expand-project]');
    await window.click('[aria-label=menu-project]');
    await window.click('[aria-label=edit-project]');
    await window.fill('#project_description', 'test version edit');
    await window.click('[aria-label=save-edit-project]');
    await window.click('[aria-label=expand-project]');
    const description = await window.textContent('[aria-label=project-description-display]');
    expect(description).toBe('test version edit');
});
