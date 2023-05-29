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

// test('Create a new user and Navigate the projects page', async () => {
// 	await window.getByRole('button', {name: 'Create New Account'}).click()
// 	await window.getByPlaceholder('Username').fill('playwright user')
// 	await window.click('[type=submit]');
// 	const title = await window.textContent('[aria-label=projects]');
// 	expect(title).toBe('Projects');
// });

// test('Click New and Fill translation project page details to create a new project', async () => {
// 	await window.getByRole('link', {name : 'new'}).click()
// 	await window.fill('#project_name', 'translation');
// 	await window.fill('#project_description', 'test version');
// 	await window.fill('#version_abbreviated', 'test');
// 	await window.click('#open-advancesettings');
// 	await window.click('[aria-label=new-testament]');
// 	await window.click('[aria-label=close-custombiblenavigation]');
// 	await window.click('[aria-label=create]');
// });

// test('Archive the textTranslation project', async () => {
// 	const table =  window.getByTestId('tablelayout')
// 	const headers = table.locator('thead')
// 	console.log(await headers.allTextContents());
	
// 	const rows = table.locator('tbody tr')
// 	// const cols = rows.first().locator('td')
// 	for (let i = 0; i < await rows.count(); i++) {
// 		const row = rows.nth(i);
// 		const tds = row.locator('td');
// 		for (let j = 0; j < await tds.count(); j++) {
// 			if (await tds.nth(j).textContent() === "translation project") {
// 				 console.log(await tds.nth(1).textContent())
// 				await tds.last().locator('[aria-label=unstar-expand-project]').click()
// 				await window.locator('.pl-5 > div > div').click()
// 				await window.getByRole('menuitem', {name: "Archive"}).click()
// 				const title = await window.textContent('[aria-label=projects]');
// 				expect(title).toBe('Projects');
// 			}
			
// 		}

// 	}
// });

test('Restore the textTranslation project from the archive tab and return to the projects', async () => {
	await window.getByRole('button', {name: "Archived"}).click()
	const table =  window.getByTestId('tablelayout')
	const headers = table.locator('thead')
	console.log(await headers.allTextContents());
	
	const rows = table.locator('tbody tr')
	// const cols = rows.first().locator('td')
	for (let i = 0; i < await rows.count(); i++) {
		const row = rows.nth(i);
		const tds = row.locator('td');
		for (let j = 0; j < await tds.count(); j++) {
			if (await tds.nth(j).textContent() === "translation") {
				 console.log(await tds.nth(1).textContent())
				await tds.last().locator('[aria-label=unstar-expand-project]').click()
				await window.locator('.pl-5 > div > div').click()
				await window.getByRole('menuitem', {name: "Restore"}).click()
				expect(await window.locator('[id="__next"] div:has-text("Archived Projects") >> nth=4'));
			}
			
		}

	}
	await window.getByRole('button', {name: 'Active'}).click()
});

// test('Click user and Navigate projects', async () => {
// 	await window.click('#bobby');
// 	const title = await window.textContent('[aria-label=projects]');
// 	expect(title).toBe('Projects');
// 	// await electronApp.close();
// });

/* Translation Editor */
// test('Click on project to open editor page', async () => {
// 	await window.click('id=translation testing');
// 	const editorpane = await window.innerText('[aria-label=editor-pane]');
// 	expect(editorpane).toBe('EDITOR');
// });

// test('Check project name', async () => {
// 	const projectname = await window.innerText(
// 		'[aria-label=editor-project-name]',
// 	);
// 	expect(projectname).toBe('TRANSLATION TESTING');
// });

// test('Increase font size', async () => {
// 	await window.click('[aria-label=increase-font]');
// });

// test('Decrease font size', async () => {
// 	await window.click('[aria-label=decrease-font]');
// });

// test('Saving bookmark and Testing bookmarks window', async () => {
// 	await window.click('[aria-label=save-bookmark]');
// 	await window.click('[aria-label=select-menu-file]');
// 	await window.click('[aria-label=select-bookmarks]');
// 	await window.click('[aria-label=close-button]');
// 	await window.click('[aria-label=save-bookmark]');
// });

// test('Testing Navigation', async () => {
// 	await window.click('[aria-label=open-book]');
// 	const title = await window.innerText('text=NEW');
// 	expect(title).toBe('NEW TESTAMENT');
// 	await window.click('[aria-label=nt-Mark]');
// 	// const label = await window.click('role=presentation[aria-label="nt-Mark"]');
// 	// await window.click('text=1');
// 	// await window.click('text=1');

// 	// 	expect(developedby).toBe('Developed by Bridge Connectivity Solutions');
// });

// test('Testing About', async () => {
// 	await window.click('[aria-label=about-button]');
// 	const developedby = await window.innerText('[aria-label=developed-by]');
// 	expect(developedby).toBe('Developed by Bridge Connectivity Solutions');
// 	await window.click('[aria-label=license-button]');
// 	await window.click('[aria-label=close-about]');
// });

// test('Testing Section Heading', async () => {
// 	await window.click('[aria-label=select-menu-edit]');
// 	await window.click('[aria-label=section-header]');
// });

// test('Testing Font Family', async () => {
// 	await window.click('[aria-label=select-menu-file]');
// 	await window.click('[aria-label=selected-font]');
// 	await window.click('[aria-label=AnjaliOldLipi]');
// });

// test('Testing Notificaton', async () => {
// 	await window.click('[aria-label=notification-button]');
// 	const title = await window.innerText('[aria-label=notification-title]');
// 	expect(title).toBe('NOTIFICATIONS');
// 	await window.click('[aria-label=close-notification]');
// });

// test('Testing by adding the panels', async () => {
// 	await window.click('[aria-label=add-panels]');
// 	let title = await window.innerText('[aria-label=number-of-panels]');
// 	expect(title).toBe('2');
// 	await window.click('[aria-label=add-panels]');
// 	title = await window.innerText('[aria-label=number-of-panels]');
// 	expect(title).toBe('3');
// 	await window.click('[aria-label=add-panels]');
// 	title = await window.innerText('[aria-label=number-of-panels]');
// 	expect(title).toBe('1');
// });

// test('Checking resources in added panel', async () => {
// 	await window.click('[aria-label=add-panels]');
// 	let title = await window.innerText('[aria-label=number-of-panels]');
// 	console.log(title);
// 	expect(title).toBe('1');
// 	await window.hover('[aria-label=resources-panel]');
// 	await window.click('[aria-label=resources-selector]');
// 	title = await window.innerText('[aria-label=resources-title]');
// 	expect(title).toBe('RESOURCES');
// 	await window.click('[aria-label=close-resources]');
// });

// test('Testing Resource Select', async () => {
// 	await window.click('[aria-label=resources-selector]');
// 	const title = await window.textContent('[aria-label=resources-title]');
// 	expect(title).toBe('Resources');
// 	await window.click('#tn');
// 	// await window.click('#English');
// 	console.log(title);
// });

// test('Checking scroll lock/unlock', async () => {
// 	await window.click('[aria-label=close-lock]');
// 	const editoreBookname = await window.innerText(
// 		'[aria-label=editor-bookname]',
// 	);
// 	const resourceBookname = await window.innerText(
// 		'[aria-label=resource-bookname]',
// 	);
// 	expect(resourceBookname).toBe(editoreBookname);
// 	await window.click('[aria-label=open-lock]');
// });

// test.afterAll(async () => {
// 	await window.context().close();
// 	await window.close();
// });

// test('Restore the OBS project from the archive tab and return to the projects', async () => {
// 	await window.getByRole('button', {name: "Archived"}).click()
// 	await window.click('[aria-label=unstar-expand-project]')
// 	await window.click('[aria-label=unstar-menu-project]')
// 	await window.getByRole('menuitem', {name: "Restore"}).click()
// 	await window.getByRole('button', {name: 'Active'}).click()
// });