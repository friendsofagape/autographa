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
	await window.getByPlaceholder('Username').fill('audioUser')
	await window.click('[type=submit]');
	const title = await window.textContent('[aria-label=projects]');
	expect(title).toBe('Projects');
});

// test('Click user and Navigate projects', async () => {
// 	await window.getByRole('button', {name: "audioUser"}).click()
// 	const title = await window.textContent('[aria-label=projects]');
// 	expect(title).toBe('Projects');
// });

test('Create Audio project', async () => {
	await window.getByRole('link', {name: 'new'}).click()
	await window.click('[aria-label=open-popover]')
	await window.getByRole('link', {name: 'Audio'}).click()
	await window.fill('#project_name', 'Audio project');
	await window.fill('#project_description', 'test version');
	await window.fill('#version_abbreviated', 'ap');
	await window.click('#open-advancesettings');
	await window.click('[aria-label=new-testament]');
	await window.click('[aria-label=close-custombiblenavigation]');
	await window.click('[aria-label=create]');
})

test('Star the audio project', async () => {
	await window.getByRole('button', {name: 'unstar-project'}).click()
});

test('Untar the audio project', async () => {
	await window.getByRole('button', {name: 'star-project'}).click()
});

test('Search and test audio for resulting project', async () => {
	await window.fill('#search_box', 'audio');
	const projectname = await window.innerText(
		'[aria-label=unstar-project-name]',
	);
	expect(projectname).toBe('Audio project');
});

test('Click on project to open editor page', async () => {
	await window.click('id=Audio project');
	const editorpane = await window.innerText('[aria-label=editor-pane]');
	expect(editorpane).toBe('EDITOR');
});

test('Check project name', async () => {
	const projectname = await window.innerText(
		'[aria-label=editor-project-name]',
	);
	expect(projectname).toBe('AUDIO PROJECT');
});

test('Increase font size', async () => {
	await window.click('[aria-label=increase-font]');
	await window.click('[aria-label=increase-font]');
});

test('Decrease font size', async () => {
	await window.click('[aria-label=decrease-font]');
	await window.click('[aria-label=decrease-font]');
});

test('Check projects Notifications', async () => {
    await window.getByRole('button', {name: "notification-button"}).click()
    const title = await window.innerText('[aria-label=notification-title]');
    expect(title).toBe('NOTIFICATIONS');
    await window.getByRole('button', {name: "close-notification"}).click()

});

test('About and Licence of Scribe Scripture', async () => {
    await window.getByRole('button', {name: "about-button"}).click()
    const developedby = await window.innerText('[aria-label=developed-by]');
	expect(developedby).toBe('Developed by Bridge Connectivity Solutions');
    await window.getByRole('button', {name: "license-button"}).click()
    await window.getByRole('button', {name: "close-about"}).click()
});

test('Check book bookmarks and close', async () => {
    await window.getByRole('button', {name: "select-menu-file"}).click()
    await window.getByRole('button', {name: "select-bookmarks"}).click()
    await window.getByRole('button', {name: "close-button"}).click()    
});

test('Saving bookmark for the book and check the all bookmarks', async ()=>{
	await window.getByRole('button', {name: "save-bookmark"}).click()
	await window.getByRole('button', {name: "select-menu-file"}).click()
    await window.getByRole('button', {name: "select-bookmarks"}).click()
	await window.getByRole('button', {name: "close-button"}).click()
	const editorpane = await window.innerText('[aria-label=editor-pane]');
		expect(editorpane).toBe('EDITOR');  
} )

// test('Check book bookmarks and by clicking go to the 1 Timothy-1', async () => {
//     await window.getByRole('button', {name: "select-menu-file"}).click()
//     await window.getByRole('button', {name: "select-bookmarks"}).click()
//     await window.getByRole('button', {name: "1 Timothy-1"}).click()
//     const editorpane = await window.innerText('[aria-label=editor-pane]');
// 	   expect(editorpane).toBe('EDITOR');
// });

test('Lock/Unlock the editor', async () => {
	await window.click('[aria-label=close-lock]');
	await window.click('[aria-label=open-lock]');
	const editorpane = await window.innerText('[aria-label=editor-pane]');
	expect(editorpane).toBe('EDITOR');
});

test('Change font-family', async () => {
    await window.getByRole('button', {name: "select-menu-file"}).click()
    await window.getByRole('none', {name: "selected-font"}).click()
    await window.getByRole('option', {name: "aakar"}).click()  
    const editorpane = await window.innerText('[aria-label=editor-pane]');
	expect(editorpane).toBe('EDITOR');  
});

test('Change navigation timothy book to matthew book, chapter and verse', async ()=>{
	await window.getByRole('button', {name: "open-book"}).click()
	//select matthew book
	await window.locator('div[role="presentation"]:has-text("Matthew")').click()
	//select chapter 5
	await window.locator('div[role="presentation"]:has-text("5")').first().click()
	//select verse 21
	await window.locator('div[role="presentation"]:has-text("21")').click()
	const editorpane = await window.innerText('[aria-label=editor-pane]');
		expect(editorpane).toBe('EDITOR');  
} )

test('Change navigation current book chapter and verse', async ()=>{
	await window.getByRole('button', {name: "open-chapter"}).click()
	//select chapter 6
	await window.locator('div[role="presentation"]:has-text("6")').first().click()
	//select verse 21
	await window.locator('div[role="presentation"]:has-text("21")').click()
	const editorpane = await window.innerText('[aria-label=editor-pane]');
		expect(editorpane).toBe('EDITOR');  
} )

test('change audio speed 1 to 1.5', async ()=>{
	await window.locator('button:has-text("1")').click()
	await window.getByRole('option', {name: "1.5"}).click()
	const editorpane = await window.innerText('[aria-label=editor-pane]');
		expect(editorpane).toBe('EDITOR');  
} )

test('start recoring audio and stop', async ()=>{
	await window.locator('.flex > div > .p-2').first().click();
	await window.locator('.flex > div:nth-child(2) > .p-2').first().click()
	const editorpane = await window.innerText('[aria-label=editor-pane]');
		expect(editorpane).toBe('EDITOR');  
} )

// test('Add panel and Checking hindi bible resources in added panel', async () => {
//     await window.getByRole('button', {name: "add-panels"}).click()
//     let title = await window.innerText('[aria-label=number-of-panels]');
// 	expect(title).toBe('2');
// 	await window.click('[aria-label=add-panels]');
// 	title = await window.innerText('[aria-label=number-of-panels]');
// 	expect(title).toBe('3');
// 	await window.click('[aria-label=add-panels]');
// 	title = await window.innerText('[aria-label=number-of-panels]');
// 	expect(title).toBe('1');
//     // await window.getByRole('button', {name: "resources-selector"}).hover()
//     // await window.getByRole('tab', {name: "Resource"}).hover().click()
//     // await window.getByPlaceholder('Select Language').fill('hindi')
//     // await window.getByRole('option', {name: "Hindi"}).click()
//     // await window.getByRole('button', {name: "Save Filter"}).click()
//     // await window.getByRole('row', {name: "hi_udb Bible Door43-Catalog 2022-04-21 (v5.7) download"}).getByRole('button', {name:'download'}).click()
//     // await window.getByRole('tab', {name: "bible"}).click()

//     // const editorpane = await window.innerText('[aria-label=editor-pane]');
// 	// expect(editorpane).toBe('EDITOR');  
// });

// test('Remove the added panel and Resources', async () => {
//     await window.getByRole('button', {name: "remove section"}).click()
//     await window.getByRole('button', {name: "Remove"}).click()
//     const editorpane = await window.innerText('[aria-label=editor-pane]');
// 	expect(editorpane).toBe('EDITOR');  
// });