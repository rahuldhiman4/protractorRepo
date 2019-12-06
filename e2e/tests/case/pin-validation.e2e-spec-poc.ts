import { element, browser, $, ProtractorExpectedConditions, protractor } from "protractor";
import loginPage from "../../pageobject/login.po";
import navigationPage from "../../pageobject/navigation.po";
import apiHelper from "../../api/api.helper";
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
        var templateData = {
            "templateName": `${templateName}`,
            "templateStatus": "Active",
            "templateSummary": `Summary ${templateName}`,
        }
        await apiHelper.apiLogin('qkatawazi');
        var newCaseTemplate = await apiHelper.createCaseTemplate(templateData);
        console.log("active case Template is created===", newCaseTemplate.id);
    });

    it('should create quick case using case template', async () => {
        await navigationPage.gotoQuickCase();
        await createQuickCasePage.selectRequester();
        await createQuickCasePage.selectCaseTemplate(templateName);
        await createQuickCasePage.validatePin();
        expect(createQuickCasePage.getPopUpMessage()).toContain('WARNING (232053)');
        await createQuickCasePage.waitUntilPopUpDisappear();
        await createQuickCasePage.saveCase();
    })
})