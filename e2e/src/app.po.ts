import { browser, by, element, ExpectedConditions, $, until, By, promise, ElementFinder, WebDriver, WebElement } from 'protractor';
import { GridOperation } from './grid.po';
import { Util } from './util.po';
import { async } from 'q';

export class AppPage {
  taskTemplateGrid: GridOperation;
  utility: Util;
  constructor() {
    this.taskTemplateGrid = new GridOperation();
    this.utility = new Util();
  }

  urls = {
    appUrl: '/innovationsuite/index.html#/com.bmc.dsm.bwfa',
    caseConsoleUrl: '/com.bmc.dsm.bwfa/view/com.bmc.dsm.case-lib:Cases',
    createCase: '/innovationsuite/index.html#/com.bmc.dsm.bwfa/view/com.bmc.dsm.case-lib:Case%20Create',
    quickCase: '/innovationsuite/index.html#/com.bmc.dsm.bwfa/view/com.bmc.dsm.case-lib:Case%20Create%20-%20Quick%20Case'
  }

  loginSelectors = {
    usernameField: 'credentials.userName',
    passwordField: 'credentials.password',
    loginButton: '[type="submit"]',
  }

  createCaseLocators = {
    createButton: '[rx-view-component-id="cdb4375b-706d-4efc-be66-a8f32b1434ed"] button',
    requesterName: '[name="personGroup"]',
    requesterPopup: '.popup-person',
    summaryField: '[name="com.bmc.dsm.case-lib:Case-Summary-39"]',
    errorMsgLocator: '.rx-growl-item__message'
  }

  quickCaseLocators = {
    summaryField: '.smart-recorder-textarea',
    requesterPopupList: '[ng-if="!uxSmartRecorderModel.loadingListOfPerson"]',
    requesterPopup: '.smart-recorder__popup-item-highlight',
    createButton: '.d-button.d-button_primary.d-icon-left-undefined'
  }

  casePreviewLocators = {
    goToCaseButton: '[rx-view-component-id="529287cb-4d9d-4729-aa6c-5676980df72e"] button',
  }

  caseViewLocators = {
    addTaskButton: '[rx-view-component-id="db1c57fc-c332-40fa-b1c0-759e21d9ad5c"] button',
  }

  manageTaskBladeLocators = {
    addTaskFromTemplateButton: '[rx-view-component-id="d02d64d8-5a76-4cdc-8263-1d45b2da4dd1"] button',
    taskSummaryLocator: '[title*="${templateName}"]'
  }

  selectTaskTemplateLocators = {
    gridId: "da1ffbb0-567a-4199-b94f-413bee7f149b",
    saveButton: '[rx-view-component-id="b7f9f666-5c22-463a-bc86-4cb66e26fa35"] button',
  }

  launchApp() {
    browser.waitForAngularEnabled(true);
    browser.manage().window().setSize(1400, 800);
    browser.manage().timeouts().implicitlyWait(20000);
    return browser.get(browser.baseUrl.concat(this.urls.appUrl), 30000) as Promise<any>;
  }

  navigateTo(url:string) {
    browser.waitForAngularEnabled(true);
    return browser.get(url, 30000) as Promise<any>;
  }

  async doLogin(userName:string, password:string) {
    await element(by.model(this.loginSelectors.usernameField)).sendKeys(userName);
    await element(by.model(this.loginSelectors.passwordField)).sendKeys(password);
    await element(by.css(this.loginSelectors.loginButton)).click();
    await browser.wait(ExpectedConditions.urlContains(this.urls.caseConsoleUrl), 30000);
  }

  async doLogout() {
    await browser.refresh();
    await browser.wait(until.elementLocated(By.css(".d-profile__image-image")),10000);
    await this.utility.clickOnElement(by.css('.header-profile__username'));
    await this.utility.clickOnElement(by.css('[ng-click="logout()"]'));
    await browser.wait(ExpectedConditions.urlContains("/login"), 30000);
  }

  async typeAndSelectRequester(requesterName: string) {
    await browser.wait(until.elementLocated(By.css(this.createCaseLocators.requesterName)), 10000).sendKeys(requesterName);
    await browser.wait(until.elementLocated(By.css(this.createCaseLocators.requesterPopup)), 10000).click();
  }
  
  async provideCaseSummary(summaryText: string) {
    await browser.wait(until.elementLocated(By.css(this.createCaseLocators.summaryField)), 10000).sendKeys(summaryText);
  }

  async clickCreateCaseButton() {
    browser.sleep(3000);
    await browser.wait(until.elementLocated(By.css(this.createCaseLocators.createButton)), 10000).click();
  }

  async getErrorMessage() {
    return await browser.wait(until.elementLocated(By.css(this.createCaseLocators.errorMsgLocator)), 10000).getText();
  }

  async createCase(requester:string, summary:string){
    await this.navigateTo(browser.baseUrl.concat(this.urls.createCase));
    await this.typeAndSelectRequester(requester);
    await this.provideCaseSummary(summary);
    await this.clickCreateCaseButton();
  }

  async typeAndSelectRequesterOnQuickCase(requesterName: string) {
    await browser.wait(until.elementLocated(By.css(this.quickCaseLocators.summaryField)), 10000).sendKeys("@" + requesterName);
    browser.sleep(2000);
//    await browser.wait(until.elementLocated(By.css(this.quickCaseLocators.requesterPopupList)), 10000);
    await browser.wait(until.elementLocated(By.css(this.quickCaseLocators.requesterPopup)), 10000).click();
  }
  
  async provideCaseSummaryOnQuickCase(summaryText: string) {
    await browser.wait(until.elementLocated(By.css(this.quickCaseLocators.summaryField)), 10000).sendKeys(summaryText);
  }

  async clickCreateCaseButtonOnQuickCase() {
    //browser.sleep(3000);
    //await browser.wait(until.elementLocated(By.css(this.quickCaseLocators.createButton)), 10000).click();
    await this.utility.clickOnElement(By.css(this.quickCaseLocators.createButton));
  }

  async createQuickCase(requester:string, summary:string){
    await this.navigateTo(browser.baseUrl.concat(this.urls.quickCase));
    await this.typeAndSelectRequesterOnQuickCase(requester);
    await this.provideCaseSummaryOnQuickCase(summary);
    await this.clickCreateCaseButtonOnQuickCase();
  }

  async clickGoToCaseButton() {
    await browser.wait(until.elementLocated(By.css('[rx-view-component-id="6934b23e-3403-4b21-b4aa-a7a10283c8eb"]')), 10000);
    await browser.wait(until.elementLocated(By.css(this.casePreviewLocators.goToCaseButton)), 10000).click();
  }

  async clickAddTaskButton() {
    await browser.wait(until.elementLocated(By.css('[rx-view-component-id="7b47ca08-e9d4-4656-8f96-3bc751c098b0"]')), 10000);
    await this.utility.clickOnElement(By.css(this.caseViewLocators.addTaskButton));

/*    await browser.wait(until.elementLocated(By.css(this.caseViewLocators.addTaskButton)), 10000).click();
      
      await browser.wait(until.elementIsEnabled(await element(by.css(this.caseViewLocators.addTaskButton))), 10000).click();

      await browser.wait(until.elementLocated(By.css(this.caseViewLocators.addTaskButton)), 10000)
      .then(
            await browser.wait(ExpectedConditions.elementToBeClickable($(this.caseViewLocators.addTaskButton)),3000)
      );*/
  }

  async addTaskFromTaskTemplate(templateName: string) {
//    browser.sleep(2000);
    await browser.wait(until.elementLocated(By.css('[rx-view-component-id="59ee2763-b1f5-4b1c-9bab-9375fccab3b4"] button')), 10000);
//    await browser.wait(until.elementLocated(By.css(this.manageTaskBladeLocators.addTaskFromTemplateButton)), 10000).click();
    await this.utility.clickOnElement(By.css(this.manageTaskBladeLocators.addTaskFromTemplateButton));
    await this.taskTemplateGrid.searchAndSelectFirstCheckBox(this.selectTaskTemplateLocators.gridId, templateName);
    await this.utility.clickOnElement(By.css(this.selectTaskTemplateLocators.saveButton));
  }

/*  async selectDomainAddress( domainAddress ) {
    const selector = By.css( `[data-e2e-domain="${ domainAddress }"]` );
    await browser.wait(
      until.elementLocated( selector ),
      10000,
      'Could not locate the select button for the paid address: ' + domainAddress
    );
    const element = await browser.findElement( selector );
    await browser.wait(
      until.elementIsEnabled( element ),
      10000,
      'The paid address button for ' + domainAddress + ' does not appear to be enabled to click'
    );
  }*/
}