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
// 	await window.fill('#username', 'bobby');
// 	await window.click('[data-testid=login-button]');
// 	const title = await window.textContent('[aria-label=projects]');
// 	expect(title).toBe('Projects');
// });

test('Click user and Navigate projects', async () => {
	await window.click('#bobby');
	const title = await window.textContent('[aria-label=projects]');
	expect(title).toBe('Projects');
});

/* Translation Project    */
// test('Click New and Fill translation project page details to creating a new project', async () => {
// 	// await window.click('#bobby');
// 	await window.click('[aria-label=new]');
// 	await window.fill('#project_name', 'translation testing');
// 	await window.fill('#project_description', 'test version');
// 	await window.fill('#version_abbreviated', 'test');
// 	await window.click('#open-advancesettings');
// 	await window.click('[aria-label=new-testament]');
// 	await window.click('[aria-label=close-custombiblenavigation]');
// 	await window.click('[aria-label=create]');
// 	const projectname = await window.innerText('[aria-label=project-name]');
// 	console.log(projectname);
// 	expect(projectname).toBe('translation testing');
// });

// test('Star the project', async () => {
// 	await window.click('[aria-label=unstar-project]');
// 	const projectname = await window.innerText(
// 		'[aria-label=unstar-project-name]',
// 	);
// 	console.log(projectname, 'hello');
// 	expect(projectname).toBe('translation testing');
// });

// test('Untar the project', async () => {
// 	await window.click('[aria-label=star-project]');
// 	const projectname = await window.innerText(
// 		'[aria-label=star-project-name]',
// 	);
// 	console.log(projectname, 'hi');
// 	expect(projectname).toBe('translation testing');
// });

// test('Search and test translation for resulting project', async () => {
// 	await window.fill('#search_box', 'translation');
// 	const projectname = await window.innerText(
// 		'[aria-label=unstar-project-name]',
// 	);
// 	expect(projectname).toBe('translation testing');
// });

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

// test('Sign out and return to Autographa app', async () => {
// 	await window.click('text=Open user menu');
// 	await window.click('id=signout');
// 	const title = await window.textContent('text=Sign In');
// 	expect(title).toBe('Sign In');
// });

// test.afterAll(async () => {
// 	await window.context().close();

// 	await window.close();
// });
