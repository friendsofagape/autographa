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
test('Create OBS project', async () => {
	await window.getByRole('link', {name: 'new'}).click()
	await window.click('[aria-label=open-popover]')
	await window.getByRole('link', {name: 'OBS'}).click()
	await window.fill('#project_name', 'Obs project');
	await window.fill('#project_description', 'test version');
	await window.fill('#version_abbreviated', 'op');
	await window.click('[aria-label=create]');
})

test('Star the obs project', async () => {
	await window.getByRole('button', {name: 'unstar-project'}).click()
	
});

test('Untar the obs project', async () => {
	await window.getByRole('button', {name: 'star-project'}).click()
});

test('Search and test audio for resulting project', async () => {
	await window.fill('#search_box', 'obs');
	const projectname = await window.innerText(
		'[aria-label=unstar-project-name]',
	);
	expect(projectname).toBe('Obs project');
});


// test('Click user and Navigate projects', async () => {
// 	await window.click('#bobby');
// 	const title = await window.textContent('[aria-label=projects]');
// 	expect(title).toBe('Projects');
// 	// await electronApp.close();
// });

/* OBS Editor */
test('Click on project to open editor page', async () => {
	await window.click('id=Obs project');
	const editorpane = await window.innerText('[aria-label=editor-pane]');
	expect(editorpane).toBe('EDITOR');
});

test('Check project name', async () => {
	const projectname = await window.innerText(
		'[aria-label=editor-project-name]',
	);
	expect(projectname).toBe('OBS PROJECT');
});

test('Testing Notificaton', async () => {
	await window.click('[aria-label=notification-button]');
	const title = await window.innerText('[aria-label=notification-title]');
	expect(title).toBe('NOTIFICATIONS');
	await window.click('[aria-label=close-notification]');
});

test('Increase font size', async () => {
	await window.click('[aria-label=increase-font]');
	await window.click('[aria-label=increase-font]');
});

test('Decrease font size', async () => {
	await window.click('[aria-label=decrease-font]');
	await window.click('[aria-label=decrease-font]');
});

test('Testing About', async () => {
	await window.click('[aria-label=about-button]');
	const developedby = await window.innerText('[aria-label=developed-by]');
	expect(developedby).toBe('Developed by Bridge Connectivity Solutions');
	await window.click('[aria-label=license-button]');
	await window.click('[aria-label=close-about]');
});

test('Testing Font Family', async () => {
	await window.click('[aria-label=select-menu-file]');
	await window.click('[aria-label=selected-font]');
	await window.click('[aria-label=AnjaliOldLipi]');
});

// test('Checking resources in added panel', async () => {
// 	await window.click('[aria-label=add-panels]');
// 	let title = await window.innerText('[aria-label=number-of-panels]');
// 	console.log(title);
// 	expect(title).toBe('2');
// 	await window.hover('[aria-label=resources-panel]');
// 	await window.click('[aria-label=resources-selector]');
// 	title = await window.innerText('[aria-label=resources-title]');
// 	expect(title).toBe('RESOURCES');
// 	await window.click('[aria-label=close-resources]');
// });

// test('Testing by adding the panels', async () => {
// 	await window.click('[aria-label=add-panels]');
// 	let title = await window.innerText('[aria-label=number-of-panels]');
// 	expect(title).toBe('3');
// 	await window.click('[aria-label=add-panels]');
// 	title = await window.innerText('[aria-label=number-of-panels]');
// 	expect(title).toBe('1');
// });

// test('Checking scroll lock', async () => {
// 	await window.click('[aria-label=add-panels]');
// 	const editoreBookname = await window.innerText(
// 		'[aria-label=editor-bookname]',
// 	);
// 	const panel = await window.innerText('[aria-label=number-of-panels]');
// 	expect(panel).toBe('2');
// 	await window.click('[aria-label=close-lock]');
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
