import { browser, ProtractorExpectedConditions, protractor } from "protractor";
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

    it('DRDMV-16241:Add person with different relations', async () => {
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("Allen");
        await createCasePage.setSummary("DRDMV-16241");
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        await caseEditPage.navigateToRelatedPersonsTab();
        await relatedTabPage.addRelatedPerson();
        await addRelatedPopupPage.addPerson('Qianru Tao', 'Inspector');
        await relatedTabPage.waitUntilNewRelatedPersonAdded(1);
        expect(await relatedTabPage.isPersonRelatedHasCorrectRelation('Qianru Tao', 'Inspector')).toBeTruthy();
        await relatedTabPage.addRelatedPerson();
        await addRelatedPopupPage.addPerson('Harry Potter', 'Related to');
        await relatedTabPage.waitUntilNewRelatedPersonAdded(2);
        expect(await relatedTabPage.isPersonRelatedHasCorrectRelation('Harry Potter', 'Related to')).toBeTruthy();
        await relatedTabPage.addRelatedPerson();
        await addRelatedPopupPage.addPerson('Lily Anthony', 'Target');
        await relatedTabPage.waitUntilNewRelatedPersonAdded(3);
        expect(await relatedTabPage.isPersonRelatedHasCorrectRelation('Lily Anthony', 'Target')).toBeTruthy();
        await relatedTabPage.addRelatedPerson();
        await addRelatedPopupPage.addPerson('Demi Moore', 'Victim');
        await relatedTabPage.waitUntilNewRelatedPersonAdded(4);
        expect(await relatedTabPage.isPersonRelatedHasCorrectRelation('Demi Moore', 'Victim')).toBeTruthy();
        await relatedTabPage.addRelatedPerson();
        await addRelatedPopupPage.addPerson('Brain Adams', 'Witness');
        await relatedTabPage.waitUntilNewRelatedPersonAdded(5);
        expect(await relatedTabPage.isPersonRelatedHasCorrectRelation('Brain Adams', 'Witness')).toBeTruthy();
    }, 90 * 1000)

    it('DRDMV-12896:Add multiple person with same relation', async () => {
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("Allen");
        await createCasePage.setSummary("DRDMV-12896");
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        await caseEditPage.navigateToRelatedPersonsTab();
        await relatedTabPage.addRelatedPerson();
        await addRelatedPopupPage.addPerson('Qianru Tao', 'Inspector');
        await relatedTabPage.waitUntilNewRelatedPersonAdded(1);
        await relatedTabPage.addRelatedPerson();
        await addRelatedPopupPage.addPerson('Harry Potter', 'Inspector');
        await relatedTabPage.waitUntilNewRelatedPersonAdded(2);
        await relatedTabPage.addRelatedPerson();
        await addRelatedPopupPage.addPerson('Lily Anthony', 'Inspector');
        await relatedTabPage.waitUntilNewRelatedPersonAdded(3);
        expect(await relatedTabPage.isPersonRelatedHasCorrectRelation('Qianru Tao', 'Inspector')).toBeTruthy();
        expect(await relatedTabPage.isPersonRelatedHasCorrectRelation('Harry Potter', 'Inspector')).toBeTruthy();
        expect(await relatedTabPage.isPersonRelatedHasCorrectRelation('Lily Anthony', 'Inspector')).toBeTruthy();
    });

})