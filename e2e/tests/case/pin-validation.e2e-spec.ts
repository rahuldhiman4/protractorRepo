import { element, browser, $, ProtractorExpectedConditions, protractor } from "protractor";
import loginPage from "../../pageobject/login.po";
import navigationPage from "../../pageobject/navigation.po";
import { createCaseTemplate } from "../../api/create.casetemplate.api";
import createQuickCasePage from '../../pageobject/case/create-case-quick.po';

describe('Pin Validation testing', () => {
    const EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    const templateName = 'PinValidationOptional_abc';
    beforeAll(async () => {
        await browser.manage().window().maximize();
        await browser.get(`${browser.baseUrl}/innovationsuite/index.html#/com.bmc.dsm.bwfa`);
        browser.waitForAngularEnabled(false);
    });

    it('should login correctly', async () => {
        await loginPage.login('qtao');
    });

    xit('Should create case template using api', async () => {
        var createCaseResponse = await createCaseTemplate(templateName);
        console.log("template created!!");
    });

    it('should create quick case using case template', async () => {
        await navigationPage.gotoQuickCase();
        await createQuickCasePage.selectRequester();
        await createQuickCasePage.selectCaseTemplate(templateName);
        await createQuickCasePage.validatePin();
        expect(createQuickCasePage.getPopUpMessage()).toContain('WARNING (232053)');
        await createQuickCasePage.waitUntilPopUpDisappear();
        await createQuickCasePage.saveCase();
    },)
})