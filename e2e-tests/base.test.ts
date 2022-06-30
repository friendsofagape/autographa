// import { _electron as electron } from 'playwright';
import { test, expect } from '@playwright/test';

const fs = require('fs');
const { _electron: electron } = require('playwright');

let electronApp;
let appPath;
let window;

test('Check for autographa app render', async () => {
	electronApp = await electron.launch({ args: ['main/index.js'] });
	appPath = await electronApp.evaluate(async ({ app }) => app.getAppPath());
	window = await electronApp.firstWindow();
	expect(await window.title()).toBe('Autographa');
	//   await electronApp.close();
});

// test('Create a new user and Navigate project', async () => {
// 	await window.fill('#username', 'new user');
// 	await window.click('[data-testid=login-button]');
// 	const title = await window.textContent('[aria-label=projects]');
// 	expect(title).toBe('Projects');
// });

test('Click user and Navigate projects', async () => {
	await window.click('id=new user');
	const title = await window.textContent('[aria-label=projects]');
	expect(title).toBe('Projects');
	// await electronApp.close();
});

test('Fill and test new project page', async () => {
	// await window.click('id=new user');
	await window.click('[aria-label=new]');
	await window.fill('#project_name', 'aatest project');
	await window.fill('#project_description', 'test version');
	await window.fill('#version_abbreviated', 'test');
	await window.click('#open-advancesettings');
	await window.click('[aria-label=new-testament]');
	await window.click('[aria-label=close-custombiblenavigation]');
	await window.click('[aria-label=create]');
	const title = await window.textContent('[aria-label=projects]');
	expect(title).toBe('Projects');
});

test('Star the project', async () => {
	// await window.click('id=new user');
	await window.click('[aria-label=unstar-project]');
	const projectname = await window.innerText('[aria-label=project-name]');
	expect(projectname).toBe('aatest project');
});

test('Unstar the project', async () => {
	await window.click('[aria-label=star-project]');
	const projectname = await window.innerText(
		'[aria-label=unstar-project-name]',
	);
	expect(projectname).toBe('aatest project');
});

test('Search and test for resulting project', async () => {
	await window.fill('#search_box', 'aatest');
	const projectname = await window.innerText('[aria-label=star-project]');
	expect(projectname).toBe('aatest project');
});

test('Update User profile and Navigate projects', async () => {
	await window.click('text=Open user menu');
	await window.click('id=profile');
	await window.fill('#organisation', 'The vidya foundations');
	await window.click('button:text("Save")');
	await window.click('[aria-label=projectList]');
	const projectname = await window.innerText('[aria-label=star-project]');
	console.log(projectname);
	expect(projectname).toBe('aatest project');
});

test('Test for edit project with updated description', async () => {
	await window.click('[aria-label=star-expand-project]');
	await window.click('[aria-label=star-menu-project]');
	await window.click('[aria-label=edit-project]');
	await window.fill('#project_description', 'test version edit');
	await window.click('[aria-label=save-edit-project]');
	await window.click('[aria-label=cancel-edit-project]');
	await window.click('[aria-label=expand-project]');
	const description = await window.textContent(
		'[aria-label=project-description-display]',
	);
	expect(description).toBe('test version edit');
});

test('Sign out and return to Autographa app', async () => {
	await window.click('text=Open user menu');
	await window.click('text=Sign out');
	const title = await window.textContent('text=Sign In');
	expect(title).toBe('Sign In');
});

// // test('Click on project to open editor page', async () => {
// //     await window.click('[aria-label=unstar-projectname]');
// //     const editorpane = await window.innerText('[aria-label=editor-pane]');
// //     expect(editorpane).toBe('EDITOR');
// // });

// // test('Check project name', async () => {
// //     const projectname = await window.innerText('[aria-label=editor-project-name]');
// //     expect(projectname).toBe('AATEST PROJECT');
// // });

// // test('Testing about', async () => {
// //     await window.click('[aria-label=about-button]');
// //     const developedby = await window.innerText('[aria-label=developed-by]');
// //     expect(developedby).toBe('Developed by Bridge Connectivity Solutions');
// //     await window.click('[aria-label=license-button]');
// //     await window.click('[aria-label=close-about]');
// // });

// // test('Testing notificaton', async () => {
// //     await window.click('[aria-label=notification-button]');
// //     const title = await window.innerText('[aria-label=notification-title]');
// //     expect(title).toBe('NOTIFICATIONS');
// //     await window.click('[aria-label=close-notification]');
// // });

// // test('Checking resources', async () => {
// //     await window.click('[aria-label=add-panels]');
// //     let title = await window.innerText('[aria-label=number-of-panels]');
// //     expect(title).toBe('2');
// //     await window.hover('[aria-label=resources-panel]');
// //     await window.click('[aria-label=resources-selector]');
// //     title = await window.innerText('[aria-label=resources-title]');
// //     expect(title).toBe('RESOURCES');
// //     await window.click('[aria-label=close-resources]');
// // });

// // test('Testing by adding the panels', async () => {
// //     await window.click('[aria-label=add-panels]');
// //     let title = await window.innerText('[aria-label=number-of-panels]');
// //     expect(title).toBe('3');
// //     await window.click('[aria-label=add-panels]');
// //     title = await window.innerText('[aria-label=number-of-panels]');
// //     expect(title).toBe('1');
// // });

// // test('Testing font size changer', async () => {
// //     await window.click('[aria-label=decrease-font]');
// //     await window.click('[aria-label=increase-font]');
// // });

// // test('Testing bookmarks window', async () => {
// //     await window.click('[aria-label=select-menu-file]');
// //     await window.click('[aria-label=select-bookmarks]');
// //     await window.click('[aria-label=close-button]');
// // });

// // test('Checking scroll lock', async () => {
// //     await window.click('[aria-label=add-panels]');
// //     const editoreBookname = await window.innerText('[aria-label=editor-bookname]');
// //     const panel = await window.innerText('[aria-label=number-of-panels]');
// //     expect(panel).toBe('2');
// //     await window.click('[aria-label=close-lock]');
// //     const resourceBookname = await window.innerText('[aria-label=resource-bookname]');
// //     expect(resourceBookname).toBe(editoreBookname);
// //     await window.click('[aria-label=open-lock]');
// // });
