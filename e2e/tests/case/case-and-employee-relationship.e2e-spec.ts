import { element, browser, $, ProtractorExpectedConditions, protractor } from "protractor";
import loginPage from "../../pageobject/login.po";
import createCasePage from '../../pageobject/case/create-case.po';
import navigationPage from "../../pageobject/navigation.po";
import caseEditPage from '../../pageobject/case/edit-case.po';
import relatedTabPage from '../../pageobject/case/related-person-tab.po';
import addRelatedPopupPage from '../../pageobject/case/add-relation-pop.po';

describe('Case And Employee Relationship', () => {
    const EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    beforeAll(async () => {
        await browser.manage().window().maximize();
        await browser.get(`${browser.baseUrl}/innovationsuite/index.html#/com.bmc.dsm.bwfa`);
        browser.waitForAngularEnabled(false);
    });

    it('should login correctly', async () => {
        await loginPage.login('qtao');
    });

    it('should change case status to resolve', async () => {
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester();
        await createCasePage.typeSummary();
        await createCasePage.assignToMe();
        await createCasePage.saveCase();
        await createCasePage.clickGoToCase();
        await caseEditPage.navigateToRelatedPersonsTab();
        await relatedTabPage.addRelatedPerson();
        await addRelatedPopupPage.searchAndSelectPerson('Qianru Tao');
        // await addRelatedPopupPage.clickNextBtn();
        // await addRelatedPopupPage.selectRelationshipType('Inspector');
        // await addRelatedPopupPage.clickSaveBtn();
    },)

})