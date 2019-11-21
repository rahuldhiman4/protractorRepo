import { browser, ProtractorExpectedConditions, protractor } from "protractor";
import loginPage from "../../pageobject/login.po";
import navigationPage from "../../pageobject/navigation.po";
import activityTabPage from '../../pageobject/activity-tab.po';
import createCase from '../../pageobject/case/create-case.po';

describe('case activity', () => {
    const EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    beforeAll(async () => {
        await browser.manage().window().maximize();
        await browser.get(`${browser.baseUrl}/innovationsuite/index.html#/com.bmc.dsm.bwfa`);
        await browser.waitForAngularEnabled(false);
        await loginPage.login('qkatawazi');
    });

    beforeEach(async () => {
        await browser.get(`${browser.baseUrl}/innovationsuite/index.html#/com.bmc.dsm.bwfa`);
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    it('DRDMV-18048: While adding a note on Case one or more agent can be tagged in Comment', async () => {
        await navigationPage.gotCreateCase();
        await createCase.selectRequester('Al Allbrook');
        await createCase.selectContact('Angelina Jolie');
        await createCase.setSummary('test case for DRDMV-18048');
        await createCase.clickSaveCaseButton();
        await createCase.clickGoToCaseButton();
        var personPopupCount: number = await activityTabPage.getPersonCount('Hi hello @Allen');
        await expect(personPopupCount).toBeGreaterThan(3);
        await activityTabPage.clearActivityNote();
        await activityTabPage.addPersonInActivityNote('Angelina');//FirstName
        await activityTabPage.addPersonInActivityNote('Steyn');//LastName
        await activityTabPage.addPersonInActivityNote('aborder@petramco.com');//Email
        await activityTabPage.addPersonInActivityNote('qtao');//Login ID
        await activityTabPage.clickOnPostButton();
        var firstName: boolean = await activityTabPage.isLinkedTextPresentInBodyOfFirstActivity('Angelina Jolie');
        await expect(firstName).toBeTruthy("FirstName user is present");
        var lastName: boolean = await activityTabPage.isLinkedTextPresentInBodyOfFirstActivity('Dale Steyn');
        await expect(lastName).toBeTruthy("LastName user is present");
        var emailId: boolean = await activityTabPage.isLinkedTextPresentInBodyOfFirstActivity('Allen Border');
        await expect(emailId).toBeTruthy("EmailID user is present");
        var loginId: boolean = await activityTabPage.isLinkedTextPresentInBodyOfFirstActivity('Qianru Tao');
        await expect(loginId).toBeTruthy("LoginID user is present");
    });
})
