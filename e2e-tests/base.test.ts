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

// test('Create a new user and Navigate the projects page', async () => {
// 	await window.getByRole('button', {name: 'Create New Account'}).click()
// 	await window.getByPlaceholder('Username').fill('testing')
// 	await window.click('[type=submit]');
// 	const title = await window.textContent('[aria-label=projects]');
// 	expect(title).toBe('Projects');
// });

// // /* Translation Project    */
test('Click New and Fill translation project page details to creating a new project', async () => {
	await window.getByRole('link', {name : 'new'}).click()
	await window.fill('#project_name', 'translation project');
	await window.fill('#project_description', 'test version');
	await window.fill('#version_abbreviated', 'test');
	await window.click('#open-advancesettings');
	await window.click('[aria-label=new-testament]');
	await window.click('[aria-label=close-custombiblenavigation]');
	await window.click('[aria-label=create]');
});

test('Click user and Navigate projects', async () => {
	await window.getByRole('button', {name: "testing"}).click()
	const title = await window.textContent('[aria-label=projects]');
	expect(title).toBe('Projects');
});


test('Star the project', async () => {
	await window.getByRole('button', {name: 'unstar-project'}).click()
});

test('Untar the project', async () => {
	await window.getByRole('button', {name: 'star-project'}).click()
});

test('Search and test translation for resulting project', async () => {
	await window.fill('#search_box', 'translation');
	const projectname = await window.innerText(
		'[aria-label=unstar-project-name]',
	);
	expect(projectname).toBe('translation project');
});
//text editor
test('Click on project to open editor page for textTranslation', async () => {
	await window.click('id=translation project');
	const editorpane = await window.innerText('[aria-label=editor-pane]');
	expect(editorpane).toBe('EDITOR');
});

test('Check textTranslation project name', async () => {
	const projectname = await window.innerText(
		'[aria-label=editor-project-name]',
	);
	expect(projectname).toBe('TRANSLATION PROJECT');
});

test('Increase font size of textTranslation project', async () => {
	await window.click('[aria-label=increase-font]');
	await window.click('[aria-label=increase-font]');
});

test('Decrease font size textTranslation project', async () => {
	await window.click('[aria-label=decrease-font]');
	await window.click('[aria-label=decrease-font]');
});

test('Check OBS project Notifications', async () => {
    await window.getByRole('button', {name: "notification-button"}).click()
    const title = await window.innerText('[aria-label=notification-title]');
    expect(title).toBe('NOTIFICATIONS');
    await window.getByRole('button', {name: "close-notification"}).click()

});

test('About and Licence of textTranslation Scribe Scripture', async () => {
	await window.click('[aria-label=about-button]');
	const developedby = await window.innerText('[aria-label=developed-by]');
	expect(developedby).toBe('Developed by Bridge Connectivity Solutions');
	await window.click('[aria-label=license-button]');
	await window.click('[aria-label=close-about]');
});

test('Write full name book MAT of textTranslation Scribe Scripture', async () => {
	await window.locator('p:has-text("MAT")').fill("MATTHEW")
	const editorpane = await window.innerText('[aria-label=editor-pane]');
	expect(editorpane).toBe('EDITOR');
});

test('Add verse in the book of MAT of textTranslation Scribe Scripture', async () => {
	await window.locator('#ch1v1').fill("MATTHEWThis is the genealogy[a] of Jesus the Messiah[b] the son of David")
	const editorpane = await window.innerText('[aria-label=editor-pane]');
	expect(editorpane).toBe('EDITOR');
});

test('Return to projects page', async () => {
	await window.getByRole('button', {name: "Back"}).click();
	const title = await window.textContent('[aria-label=projects]');
	expect(title).toBe('Projects');
});

// ///Obs translation project
// test('Create English OBS project', async () => {
// 	await window.getByRole('link', {name: 'new'}).click()
// 	await window.click('[aria-label=open-popover]')
// 	await window.getByRole('link', {name: 'OBS'}).click()
// 	await window.fill('#project_name', 'Obs project');
// 	await window.fill('#project_description', 'test version');
// 	await window.fill('#version_abbreviated', 'op');
// 	await window.click('[aria-label=create]');
// })

// test('Create OBS project with urdu language and licence', async () => {
// 	await window.getByRole('link', {name: 'new'}).click()
// 	await window.click('[aria-label=open-popover]')
// 	await window.getByRole('link', {name: 'OBS'}).click()
// 	await window.fill('#project_name', 'urdu project');
// 	await window.fill('#project_description', 'test version');
// 	await window.fill('#version_abbreviated', 'up');
// 	//adding a urdu language
// 	await window.getByRole('button', {name: 'add-language'}).click()
// 	await window.locator('input[name="search_box"]').fill('urdu')
// 	await window.locator('input[type="radio"]').nth(1).click()
// 	await window.getByRole('button', {name: 'edit-language'}).click()
// 	//select a new license
// 	await window.getByRole('button', {name: 'CC BY-SA'}).click()
// 	await window.getByRole('option', {name: 'CC BY'}).click()
// 	await window.click('[aria-label=create]');
// })

// test('Update the Urdu project', async () => {
// 	const table =  window.getByTestId('tablelayout')
// 	const headers = table.locator('thead')
// 	console.log(await headers.allTextContents());
// 	const rows = table.locator('tbody tr')
// 	// const cols = rows.first().locator('td')
// 	for (let i = 0; i < await rows.count(); i++) {
// 		const row = rows.nth(i);
// 		const tds = row.locator('td');
// 		for (let j = 0; j < await tds.count(); j++) {
// 			if (await tds.nth(j).textContent() === "urdu project") {
// 				 console.log(await tds.nth(1).textContent())
// 				await tds.last().locator('[aria-label=unstar-expand-project]').click()
// 			}
			
// 		}
		
// 	}
// 		await window.locator('[aria-label=unstar-menu-project]').click()
// 		await window.getByRole('menuitem', {name: "edit-project"}).click()
// 		await window.getByText('test version').fill('edit test version')
// 		await window.locator('input[name="version_abbreviated"]').fill('ep')
// 		await window.getByRole('button', {name:"save-edit-project"}).click();
// 		const title = await window.textContent('[aria-label=projects]');
// 		expect(title).toBe('Projects');
// })

// test('Star the obs project', async () => {
// 	const table =  window.locator('table#tablelayout')
// 	const headers = table.locator('thead')
// 	console.log(await headers.allTextContents());
	
// 	const rows = table.locator('tbody tr')
// 	// const cols = rows.first().locator('td')
// 	for (let i = 0; i < await rows.count(); i++) {
// 		const row = rows.nth(i);
// 		const tds = row.locator('td');
// 		for (let j = 0; j < await tds.count(); j++) {
// 			if (await tds.nth(j).textContent() === "Obs project") {
// 				 console.log(await tds.nth(1).textContent())
// 				await tds.first().locator('[aria-label=unstar-project]').click()
// 				expect(await tds.nth(1).textContent()).toBe("Obs project")
// 			}
			
// 		}

// 	}
// });

// test('Unstar the obs project', async () => {
// 	const table =  window.locator('table#tablelayout')
// 	const headers = table.locator('thead')
// 	console.log(await headers.allTextContents());
	
// 	const rows = table.locator('tbody tr')
// 	// const cols = rows.first().locator('td')
// 	for (let i = 0; i < await rows.count(); i++) {
// 		const row = rows.nth(i);
// 		const tds = row.locator('td');
// 		for (let j = 0; j < await tds.count(); j++) {
// 			if (await tds.nth(j).textContent() === "Obs project") {
// 				 console.log(await tds.nth(1).textContent())
// 				await tds.first().locator('[aria-label=star-project]').click()
// 				expect(await tds.nth(1).textContent()).toBe("Obs project")
// 			}
			
// 		}

// 	}
// });

// test('Search and test obs project for resulting project', async () => {
// 	await window.fill('#search_box', 'obs');
// 	const projectname = await window.innerText(
// 		'[aria-label=unstar-project-name]',
// 	);
// 	expect(projectname).toBe('Obs project');
// });

// test('Click on project to open OBS editor page', async () => {
// 	await window.click('id=Obs project');
// 	const editorpane = await window.innerText('[aria-label=editor-pane]');
// 	expect(editorpane).toBe('EDITOR');
// });

// test('Check OBS project name', async () => {
// 	const projectname = await window.innerText(
// 		'[aria-label=editor-project-name]',
// 	);
// 	expect(projectname).toBe('OBS PROJECT');
// });

// test('Testing OBS Notificaton', async () => {
// 	await window.click('[aria-label=notification-button]');
// 	const title = await window.innerText('[aria-label=notification-title]');
// 	expect(title).toBe('NOTIFICATIONS');
// 	await window.click('[aria-label=close-notification]');
// });

// test('Increase font size of OBS project', async () => {
// 	await window.click('[aria-label=increase-font]');
// 	await window.click('[aria-label=increase-font]');
// });

// test('Decrease font size of OBS project', async () => {
// 	await window.click('[aria-label=decrease-font]');
// 	await window.click('[aria-label=decrease-font]');
// });

// test('Check OBS project Notifications', async () => {
//     await window.getByRole('button', {name: "notification-button"}).click()
//     const title = await window.innerText('[aria-label=notification-title]');
//     expect(title).toBe('NOTIFICATIONS');
//     await window.getByRole('button', {name: "close-notification"}).click()

// });

// test('About and Licence of OBS Scribe Scripture', async () => {
// 	await window.click('[aria-label=about-button]');
// 	const developedby = await window.innerText('[aria-label=developed-by]');
// 	expect(developedby).toBe('Developed by Bridge Connectivity Solutions');
// 	await window.click('[aria-label=license-button]');
// 	await window.click('[aria-label=close-about]');
// });

// test('Edit the OBS editor heading tilte ', async () => {
// 	await window.getByText('1. The Creation').fill("1. The Creation edit");
// 	const editorpane = await window.innerText('[aria-label=editor-pane]');
// 	expect(editorpane).toBe('EDITOR');
// });
// test('Add content in the verse 1 and 2 OBS editor ', async () => {
// 	await window.locator('div:nth-child(2) > .flex-grow').fill("god created heavens and earth");
// 	await window.locator('div:nth-child(3) > .flex-grow').fill("story content added in verse 3");
// 	const editorpane = await window.innerText('[aria-label=editor-pane]');
// 	expect(editorpane).toBe('EDITOR');
// });
// test('change OBS editor footer ', async () => {
// 	await window.getByText('text=A Bible story from: Genesis 1-2').fill("text=A Bible story from: Genesis 1-2 edit footer");
// 	const editorpane = await window.innerText('[aria-label=editor-pane]');
// 	expect(editorpane).toBe('EDITOR');
// });

// test('Change obs navigation story  from 1 to 12 and edit the title', async () => {
// 	await window.getByRole('button', {name:"obs-navigation"}).click();
// 	await window.getByRole('button', {name:"12"}).click();
// 	await window.getByText('12. The Exodus').fill("12. The Exodus edit");
// 	const editorpane = await window.innerText('[aria-label=editor-pane]');
// 	expect(editorpane).toBe('EDITOR');
// });

// test('Lock/Unlock the OBS editor', async () => {
// 	await window.click('[aria-label=close-lock]');
// 	await window.click('[aria-label=open-lock]');
// 	const editorpane = await window.innerText('[aria-label=editor-pane]');
// 	expect(editorpane).toBe('EDITOR');
// });

// test('Change the OBS font-family', async () => {
// 	await window.getByRole('button', {name: "select-menu-file"}).click()
//     await window.getByRole('none', {name: "selected-font"}).click()
//     await window.getByRole('option', {name: "aakar"}).click()  
//     const editorpane = await window.innerText('[aria-label=editor-pane]');
// 	expect(editorpane).toBe('EDITOR');  
// });

// test('Return to projects page to see all projects has been created already', async () => {
// 	await window.getByRole('button', {name: "Back"}).click();
// 	const title = await window.textContent('[aria-label=projects]');
// 	expect(title).toBe('Projects');
// });

// test('Archive the OBS project', async () => {
// 	const table =  window.getByTestId('tablelayout')
// 	const headers = table.locator('thead')
// 	console.log(await headers.allTextContents());
	
// 	const rows = table.locator('tbody tr')
// 	// const cols = rows.first().locator('td')
// 	for (let i = 0; i < await rows.count(); i++) {
// 		const row = rows.nth(i);
// 		const tds = row.locator('td');
// 		for (let j = 0; j < await tds.count(); j++) {
// 			if (await tds.nth(j).textContent() === "urdu project") {
// 				 console.log(await tds.nth(1).textContent())
// 				await tds.first().locator('[aria-label=unstar-expand-project]').click()
// 				await window.click('[aria-laArchivebel=unstar-menu-project]')
// 				await window.getByRole('menuitem', {name: "Archive"}).click()

// 			}
			
// 		}

// 	}
// });

// test('Restore the OBS project from archive tab and return to projects', async () => {
// 	await window.getByRole('button', {name: "Archived"}).click()
// 	await window.click('[aria-label=unstar-expand-project]')
// 	await window.click('[aria-label=unstar-menu-project]')
// 	await window.getByRole('menuitem', {name: "Restore"}).click()
// 	await window.getByRole('button', {name: 'Active'}).click()
// });


// ///Audio project
// test('Create Audio project', async () => {
// 	await window.getByRole('link', {name: 'new'}).click()
// 	await window.click('[aria-label=open-popover]')
// 	await window.getByRole('link', {name: 'Audio'}).click()
// 	await window.fill('#project_name', 'Audio project');
// 	await window.fill('#project_description', 'test version');
// 	await window.fill('#version_abbreviated', 'ap');
// 	await window.click('#open-advancesettings');
// 	await window.click('[aria-label=new-testament]');
// 	await window.click('[aria-label=close-custombiblenavigation]');
// 	await window.click('[aria-label=create]');
// })

// test('Star the audio project', async () => {
// 	await window.getByRole('button', {name: 'unstar-project'}).click()
// });

// test('Untar the audio project', async () => {
// 	await window.getByRole('button', {name: 'star-project'}).click()
// });

// test('Search and test audio for resulting project', async () => {
// 	await window.fill('#search_box', 'audio');
// 	const projectname = await window.innerText(
// 		'[aria-label=unstar-project-name]',
// 	);
// 	expect(projectname).toBe('Audio project');
// });

// test('Click on Audio project to open editor page', async () => {
// 	await window.click('id=Audio project');
// 	const editorpane = await window.innerText('[aria-label=editor-pane]');
// 	expect(editorpane).toBe('EDITOR');
// });

// test('Check Audio project name', async () => {
// 	const projectname = await window.innerText(
// 		'[aria-label=editor-project-name]',
// 	);
// 	expect(projectname).toBe('AUDIO PROJECT');
// });

// test('Increase font size Audio project', async () => {
// 	await window.click('[aria-label=increase-font]');
// 	await window.click('[aria-label=increase-font]');
// });

// test('Decrease font size of Audio project', async () => {
// 	await window.click('[aria-label=decrease-font]');
// 	await window.click('[aria-label=decrease-font]');
// });

// test('Check Audio projects Notifications', async () => {
//     await window.getByRole('button', {name: "notification-button"}).click()
//     const title = await window.innerText('[aria-label=notification-title]');
//     expect(title).toBe('NOTIFICATIONS');
//     await window.getByRole('button', {name: "close-notification"}).click()

// });

// test('About and Licence of Audio Scribe Scripture', async () => {
//     await window.getByRole('button', {name: "about-button"}).click()
//     const developedby = await window.innerText('[aria-label=developed-by]');
// 	expect(developedby).toBe('Developed by Bridge Connectivity Solutions');
//     await window.getByRole('button', {name: "license-button"}).click()
//     await window.getByRole('button', {name: "close-about"}).click()
// });

// test('Check Audio book bookmarks and close', async () => {
//     await window.getByRole('button', {name: "select-menu-file"}).click()
//     await window.getByRole('button', {name: "select-bookmarks"}).click()
//     await window.getByRole('button', {name: "close-button"}).click()    
// });

// test('Saving bookmark for the Audio book and check the all bookmarks', async ()=>{
// 	await window.getByRole('button', {name: "save-bookmark"}).click()
// 	await window.getByRole('button', {name: "select-menu-file"}).click()
//     await window.getByRole('button', {name: "select-bookmarks"}).click()
// 	await window.getByRole('button', {name: "close-button"}).click()
// 	const editorpane = await window.innerText('[aria-label=editor-pane]');
// 		expect(editorpane).toBe('EDITOR');  
// } )
// test('Lock/Unlock the Audio editor', async () => {
// 	await window.click('[aria-label=close-lock]');
// 	await window.click('[aria-label=open-lock]');
// 	const editorpane = await window.innerText('[aria-label=editor-pane]');
// 	expect(editorpane).toBe('EDITOR');
// });

// test('Change Audio font-family', async () => {
//     await window.getByRole('button', {name: "select-menu-file"}).click()
//     await window.getByRole('none', {name: "selected-font"}).click()
//     await window.getByRole('option', {name: "aakar"}).click()  
//     const editorpane = await window.innerText('[aria-label=editor-pane]');
// 	expect(editorpane).toBe('EDITOR');  
// });

///////------/>

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

test('Sign out and return to Autographa app', async () => {
	await window.getByRole('button', {name: "Open user menu"}).click()
	await window.getByRole('menuitem', {name: "Sign out"}).click()
	// expect(await window.title()).toBe('Scribe Scripture');
});

test('Click the View More button, see active users in the tab, and click See the project. ',async () => {
	await window.getByRole('button', {name: "View More"}).click()
	const active = await window.getByRole('tab').allInnerTexts()
	expect(active[0]).toBe('Active')
	await window.getByRole('tabpanel', {name: "Active"}).getByRole("button", {name: "testing"}).click()
	const title = await window.textContent('[aria-label=projects]');
	expect(title).toBe('Projects');
})

test('Sign out return app', async () => {
	await window.getByRole('button', {name: "Open user menu"}).click()
	await window.getByRole('menuitem', {name: "Sign out"}).click()
	expect(await window.title()).toBe('Scribe Scripture');
});

test('Delete the user from the active tab',async () => {
	await window.getByRole('button', {name: "View More"}).click()
	await window.getByRole('tabpanel', {name: "Active"}).locator('button').click()
	const active = await window.getByRole('tab').allInnerTexts()
	expect(active[0]).toBe('Active')
})

test('Restore the deleted user from Archive tab',async () => {
	// await window.getByRole('button', {name: "View More"}).click()
	await window.getByRole('tab', {name: "Archived"}).click()
	await window.getByRole('tabpanel', {name: "Archived"}).locator('button').click()
	const archive = await window.getByRole('tab').allInnerTexts()
	expect(archive[1]).toBe('Archived')
})
