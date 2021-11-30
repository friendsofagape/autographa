import { _electron as electron } from 'playwright';
import { test, expect } from '@playwright/test';

test('Launch electron app and Navgate to projects', async () => {
  // Print the title.
  const electronApp = await electron.launch({ args: ['electron/index.js'] });
  const appPath = await electronApp.evaluate(async ({ app }) => app.getAppPath());
  const window = await electronApp.firstWindow();
  expect(await window.title()).toBe('Autographa');
  // Capture a screenshot.
  // Direct Electron console to Node terminal.
  // Click button.
    // await window.click('[aria-label=import]');
    await window.click('[aria-label=new]');
    await window.click('[aria-label=create]');
    await window.click('[aria-label=projectList]');
    await window.fill('#search_box', 'new');
    const title = await window.textContent('[aria-label=projects]');
    console.log(title);
    expect(title).toBe('Projects');

    //   await electronApp.close();
});
