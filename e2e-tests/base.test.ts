// @ts-check

// import { _electron as electron } from 'playwright';
import { test, expect } from '@playwright/test';

const fs = require('fs');
const { _electron: electron } = require('playwright');

let electronApp;
let appPath;
let window;

test('Check for Scribe Scripture app render', async () => {
	electronApp = await electron.launch({ args: ['main/index.js'] });
	appPath = await electronApp.evaluate(async ({ app }) => app.getAppPath());
	window = await electronApp.firstWindow();
	expect(await window.title()).toBe('Scribe Scripture');
	//   await electronApp.close();
});

test('Create a new user and Navigate the projects page', async () => {
	await window.getByRole('button', {name: 'Create New Account'}).click()
	await window.getByPlaceholder('Username').fill('testing')
	await window.click('[type=submit]');
	const title = await window.textContent('[aria-label=projects]');
	expect(title).toBe('Projects');
});

// // /* Translation Project    */
// test('Click New and Fill translation project page details to creating a new project', async () => {
// 	await window.getByRole('link', {name : 'new'}).click()
// 	await window.fill('#project_name', 'translation project');
// 	await window.fill('#project_description', 'test version');
// 	await window.fill('#version_abbreviated', 'test');
// 	await window.click('#open-advancesettings');
// 	await window.click('[aria-label=new-testament]');
// 	await window.click('[aria-label=close-custombiblenavigation]');
// 	await window.click('[aria-label=create]');
// });

// test('Click user and Navigate projects', async () => {
// 	await window.getByRole('button', {name: "testing"}).click()
// 	const title = await window.textContent('[aria-label=projects]');
// 	expect(title).toBe('Projects');
// });


// test('Star the project', async () => {
// 	await window.getByRole('button', {name: 'unstar-project'}).click()
// });

// test('Untar the project', async () => {
// 	await window.getByRole('button', {name: 'star-project'}).click()
// });

// test('Search and test translation for resulting project', async () => {
// 	await window.fill('#search_box', 'translation');
// 	const projectname = await window.innerText(
// 		'[aria-label=unstar-project-name]',
// 	);
// 	expect(projectname).toBe('translation project');
// });

// test('Export the project Audio ', async () => {
// 	const table = window.getByTestId('tablelayout')
// 	const rows = table.locator('tbody tr')
// 	const cols = rows.first().locator('td')
// 	for(let i = 0; i < await rows.count(); i++){
// 		const row = rows.nth(i)
// 		const tds = row.locator('td')
// 		console.log(row)
// 		console.log(tds)
// 	}
// 	// await expect(window.getByText('OBS project')).toBeVisible();
// 	// await window.click('[aria-label=unstar-expand-project]')
// 	// await window.click('[aria-label=unstar-menu-project]')
// 	// await window.getByRole('menuitem', {name: "Export"}).click()
// 	// await window.getByRole('button', {name: "open folder location"}).click()
// 	// await window.locator('input[name="location"]').fill('/home/bobby/Downloads')
// 	// await window.getByRole('button', {name: "Export"}).click()
// });

// test('Export the project', async () => {
// 	await window.click('[aria-label=unstar-expand-project]')
// 	await window.click('[aria-label=unstar-menu-project]')
// 	await window.getByRole('menuitem', {name: "Export"}).click()
// 	await window.getByRole('button', {name: "open folder location"}).click()
// 	await window.locator('input[name="location"]').fill('/home/bobby/Downloads')
// 	await window.getByRole('button', {name: "Export"}).click()
// });

// test('Cancel the export project', async () => {
// 	// await window.click('[aria-label=unstar-expand-project]')
// 	await window.click('[aria-label=unstar-menu-project]')
// 	await window.getByRole('menuitem', {name: "Export"}).click()
// 	await window.getByRole('button', {name: "open folder location"}).click()
// 	// await window.locator('input[name="location"]').fill('/home/bobby/Downloads')
// 	await window.getByRole('button', {name: "Cancel"}).click()
// });

// test('Archive the project', async () => {
// 	// await window.click('[aria-label=unstar-expand-project]')
// 	await window.click('[aria-label=unstar-menu-project]')
// 	await window.getByRole('menuitem', {name: "Archive"}).click()
// });

// test('Restore the project from archive tab and return to projects', async () => {
// 	await window.getByRole('button', {name: "Archived"}).click()
// 	await window.click('[aria-label=unstar-expand-project]')
// 	await window.click('[aria-label=unstar-menu-project]')
// 	await window.getByRole('menuitem', {name: "Restore"}).click()
// 	await window.getByRole('button', {name: 'Active'}).click()
// });

// test('Click on project to open editor page', async () => {
// 	await window.click('id=translation project');
// 	const editorpane = await window.innerText('[aria-label=editor-pane]');
// 	expect(editorpane).toBe('EDITOR');
// });

// test('Check project name', async () => {
// 	const projectname = await window.innerText(
// 		'[aria-label=editor-project-name]',
// 	);
// 	expect(projectname).toBe('TRANSLATION PROJECT');
// });

// test('Increase font size', async () => {
// 	await window.click('[aria-label=increase-font]');
// });

// test('Decrease font size', async () => {
// 	await window.click('[aria-label=decrease-font]');
// });

// test('Update user profile', async () => {
// 	await window.getByRole('button', {name: "Open user menu"}).click()
// 	await window.getByRole('menuitem', {name: "Your Profile"}).click()
// 	await window.locator('input[name="given-name"]').fill('Bobby')
// 	await window.locator('input[name="family-name"]').fill('kumar')
// 	await window.locator('input[name="email"]').fill('kumar@gmal.com')
// 	await window.locator('input[name="organization"]').fill('vidya')
// 	await window.locator('input[name="selectedregion"]').fill('india')
// 	await window.getByRole('button', {name: "Save"}).click()
// });

// test("Update the app language for the user", async () => {
// 	await window.getByRole('button', {name: "Open user menu"}).click()
// 	await window.getByRole('menuitem', {name: "Your Profile"}).click()
// 	await window.getByRole('button', {name: "English"}).click()
// 	await window.getByRole('option', {name: "Hindi"}).click()
// 	await window.getByRole('button', {name: "Save"}).click()
// 	await window.getByRole('button', {name: "Hindi"}).click()
// 	await window.getByRole('option', {name: "English"}).click()
// 	await window.getByRole('button', {name: "Save"}).click()
// })

// test('Sign out and return to Autographa app', async () => {
// 	await window.getByRole('button', {name: "Open user menu"}).click()
// 	await window.getByRole('menuitem', {name: "Sign out"}).click()
// 	// expect(await window.title()).toBe('Scribe Scripture');
// });

// test('Click the View More button, see active users in the tab, and click See the project. ',async () => {
// 	await window.getByRole('button', {name: "View More"}).click()
// 	const active = await window.getByRole('tab').allInnerTexts()
// 	expect(active[0]).toBe('Active')
// 	await window.getByRole('tabpanel', {name: "Active"}).getByRole("button", {name: "testing"}).click()
// 	const title = await window.textContent('[aria-label=projects]');
// 	expect(title).toBe('Projects');
// })

// test('Sign out return app', async () => {
// 	await window.getByRole('button', {name: "Open user menu"}).click()
// 	await window.getByRole('menuitem', {name: "Sign out"}).click()
// 	expect(await window.title()).toBe('Scribe Scripture');
// });

// test('Delete the user from the active tab',async () => {
// 	await window.getByRole('button', {name: "View More"}).click()
// 	await window.getByRole('tabpanel', {name: "Active"}).locator('button').click()
// 	const active = await window.getByRole('tab').allInnerTexts()
// 	expect(active[0]).toBe('Active')
// })

// test('Restore the deleted user from Archive tab',async () => {
// 	// await window.getByRole('button', {name: "View More"}).click()
// 	await window.getByRole('tab', {name: "Archived"}).click()
// 	await window.getByRole('tabpanel', {name: "Archived"}).locator('button').click()
// 	const archive = await window.getByRole('tab').allInnerTexts()
// 	expect(archive[1]).toBe('Archived')
// })





//OBS
// test('Click New and Fill OBS project page details to creating a new project', async () => {
// 	// await window.click('#bobby');
// 	await window.click('[aria-label=new]');
// 	await window.click('#headlessui-popover-button-13');
// 	await window.click('[data-id=OBS]');
// 	await window.fill('#project_name', 'obs testing');
// 	await window.fill('#project_description', 'obs version');
// 	await window.fill('#version_abbreviated', 'ot');
// 	await window.click('[aria-label=create]');
// });

// test('Search and OBS for resulting project', async () => {
// 	await window.fill('#search_box', 'obs');
// 	const projectname = await window.innerText(
// 		'[aria-label=unstar-project-name]',
// 	);
// 	expect(projectname).toBe('obs testing');
// });

// test('Update User profile and Navigate projects', async () => {
// 	await window.click('text=Open user menu');
// 	await window.click('id=profile');
// 	await window.fill('#organisation', 'The vidya');
// 	await window.click('button:text("Save")');
// 	await window.click('[aria-label=projectList]');
// });



// test.afterAll(async () => {
// 	await window.context().close();

// 	await window.close();
// });
