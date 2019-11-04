import { AppPage } from './app.po';
import { browser, logging, By } from 'protractor';
import { async } from 'q';
import { createCase } from "./API/create.case.api";

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(async () => {
    page = new AppPage();
    await browser.waitForAngularEnabled(false);
  });

  it('Should verify required field error message',async () => {
    await page.launchApp();
    await page.doLogin("qtao@petramco.com", "Password_1234");
    await page.navigateTo(browser.baseUrl.concat(page.urls.createCase));
    await page.typeAndSelectRequester('harry potter');
    await page.clickCreateCaseButton();
    expect(page.getErrorMessage()).toBe("Resolve the field validation errors and then try again.");
  });

  it('Should create case',async () => {
    await page.launchApp();
    await page.doLogin("qtao@petramco.com", "Password_1234");
    await page.createCase('harry potter', 'protractor case');
  });

  it('Should create case using api', async () => {
    var createCaseResponse = await createCase();
    console.log(createCaseResponse.summary);
  });

  it('Should create Quick Case and add tasks',async () => {
    await page.launchApp();
    await page.doLogin("qtao@petramco.com", "Password_1234");
    await page.createQuickCase('harry potter', 'protractor quick case');
    await page.clickGoToCaseButton();
    await page.clickAddTaskButton();
    await page.addTaskFromTaskTemplate("Add User");
    await page.addTaskFromTaskTemplate("Troubleshoot");
    await page.doLogout();
  });

  afterEach(async () => { 

  });
});
