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
	await window.getByPlaceholder('Username').fill('obs user')
	await window.click('[type=submit]');
	const title = await window.textContent('[aria-label=projects]');
	expect(title).toBe('Projects');
});
test('Create English OBS project', async () => {
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

test('Check projects Notifications', async () => {
    await window.getByRole('button', {name: "notification-button"}).click()
    const title = await window.innerText('[aria-label=notification-title]');
    expect(title).toBe('NOTIFICATIONS');
    await window.getByRole('button', {name: "close-notification"}).click()

});

test('About and Licence of Scribe Scripture', async () => {
	await window.click('[aria-label=about-button]');
	const developedby = await window.innerText('[aria-label=developed-by]');
	expect(developedby).toBe('Developed by Bridge Connectivity Solutions');
	await window.click('[aria-label=license-button]');
	await window.click('[aria-label=close-about]');
});


test('Edit the editor heading tilte ', async () => {
	await window.getByText('1. The Creation').fill("1. The Creation edit");
	const editorpane = await window.innerText('[aria-label=editor-pane]');
	expect(editorpane).toBe('EDITOR');
});
test('add text in the verse 1 and 2  ', async () => {
	await window.locator('div:nth-child(2) > .flex-grow').fill("god created heavens and earth");
	await window.locator('div:nth-child(3) > .flex-grow').fill("story content added in verse 3");
	const editorpane = await window.innerText('[aria-label=editor-pane]');
	expect(editorpane).toBe('EDITOR');
});

test('Change obs navigation story  1 to 12', async () => {
	await window.getByRole('button', {name:"obs-navigation"}).click();
	await window.getByRole('button', {name:"12"}).click();
	const editorpane = await window.innerText('[aria-label=editor-pane]');
	expect(editorpane).toBe('EDITOR');
});


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


// test('Sync the project', async () => {
// 	await window.locator('.w-2\\/5 > .flex > div:nth-child(2)').click();
// 	await window.getByRole('button', {name: "Login"}).click();
// 	await window.locator('input[name="username"]').fill('bobby')
// 	await window.locator('input[name="password"]').fill('Bobby@123')

// 	// await window.locator('div:nth-child(3) > .flex-grow').fill("story content added in verse 3");
// 	// const editorpane = await window.innerText('[aria-label=editor-pane]');
// 	// expect(editorpane).toBe('EDITOR');
// });

test('Return to projects page', async () => {
	await window.getByRole('button', {name: "Back"}).click();
	const title = await window.textContent('[aria-label=projects]');
	expect(title).toBe('Projects');
});

test('Create OBS project with urdu language and licence', async () => {
	await window.getByRole('link', {name: 'new'}).click()
	await window.click('[aria-label=open-popover]')
	await window.getByRole('link', {name: 'OBS'}).click()
	await window.fill('#project_name', 'urdu project');
	await window.fill('#project_description', 'test version');
	await window.fill('#version_abbreviated', 'up');
	//adding a urdu language
	await window.getByRole('button', {name: 'add-language'}).click()
	await window.locator('input[name="search_box"]').fill('urdu')
	await window.locator('input[type="radio"]').nth(1).click()
	await window.getByRole('button', {name: 'edit-language'}).click()
	//select a new license
	await window.getByRole('button', {name: 'CC BY-SA'}).click()
	await window.getByRole('option', {name: 'CC BY'}).click()
	await window.click('[aria-label=create]');
})

test('Update the Urdu project', async () => {
	const table =  window.getByTestId('tablelayout')
	const headers = table.locator('thead')
	const rows = table.locator('tbody tr')
	// const cols = rows.first().locator('td')
	for (let i = 0; i < await rows.count(); i++) {
		const row = rows.nth(i);
		const tds = row.locator('td');
		for (let j = 0; j < await tds.count(); j++) {
			if (await tds.nth(j).textContent() == "urdu project") {
				 console.log(await tds.nth(1).textContent())
				await tds.last().locator('[aria-label=unstar-expand-project]').click()
			}
			
		}
	}
	await window.locator('[aria-label=unstar-menu-project]').click()
	await window.getByRole('menuitem', {name: "edit-project"}).click()
	await window.getByText('test version').fill('edit test version')
	await window.locator('input[name="version_abbreviated"]').fill('ep')
	await window.getByRole('button', {name:"save-edit-project"}).click();
	const title = await window.textContent('[aria-label=projects]');
	expect(title).toBe('Projects');
})

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
