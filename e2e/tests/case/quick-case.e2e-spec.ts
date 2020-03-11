import { browser, protractor, ProtractorExpectedConditions } from "protractor";
import apiHelper from '../../api/api.helper';
import createCasePo from '../../pageobject/case/create-case.po';
import { default as quickCase, default as quickCasePo } from "../../pageobject/case/quick-case.po";
import viewCasePo from '../../pageobject/case/view-case.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import consoleCasetemplatePo from '../../pageobject/settings/case-management/console-casetemplate.po';
import editCasetemplatePo from '../../pageobject/settings/case-management/edit-casetemplate.po';
import utilCommon from '../../utils/util.common';

describe("Quick Case", () => {
    const EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    const requester = "Requester";
    const contact = "Contact";
    let loginId = 'caseagentbwf';

    beforeAll(async () => {
        browser.waitForAngularEnabled(false);
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
        await loginPage.login("qkatawazi");
    });

    afterEach(async () => {
        await browser.refresh();
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    //radhiman
    it('[DRDMV-18972]: Populating fields in Quick Case if only Required parameter is specified', async () => {
        let caseData = require('../../data/ui/case/case.ui.json');
        let expectedJsonName = 'caseData_DRDMV18972';
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa/quickcase?customer=PET000000000484&desc=&contact=');
        await expect(quickCase.validatePersonAndHisRelation(requester)).toEqual(caseData[expectedJsonName].requester1);
        await expect(quickCase.isCreateButtonDisabled).toBeTruthy;
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa/quickcase?customer=qliu@petramco.com&desc=&contact=');
        await expect(quickCase.validatePersonAndHisRelation(requester)).toEqual(caseData[expectedJsonName].requester2);
        await expect(quickCase.isCreateButtonDisabled).toBeTruthy;
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa/quickcase?customer=qliu&desc=&contact=');
        await expect(quickCase.validatePersonAndHisRelation(requester)).toEqual(caseData[expectedJsonName].requester2);
        await expect(quickCase.isCreateButtonDisabled).toBeTruthy;
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa/quickcase?customer=+61288992922&desc=&contact=');
        await expect(quickCase.validatePersonAndHisRelation(requester)).toEqual(caseData[expectedJsonName].requester2);
        await expect(quickCase.isCreateButtonDisabled).toBeTruthy();
    });

    //radhiman
    it('[DRDMV-18973]: Populating fields in Quick Case when all parameters are specified', async () => {
        let caseData = require('../../data/ui/case/case.ui.json');
        let expectedJsonName = 'caseData_DRDMV18973';
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa/quickcase?customer=qliu@petramco.com&desc=Change my Last Name&contact=PET000000000484');
        await browser.sleep(1000);
        await expect(quickCase.validatePersonAndHisRelation(requester)).toBe(caseData[expectedJsonName].requester);
        await expect(quickCase.validatePersonAndHisRelation(contact)).toBe(caseData[expectedJsonName].contact);
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa/quickcase?customer=qliu@petramco.com&desc=Change my Last Name&contact=tesser@petramco.com');
        await browser.sleep(1000);
        await expect(quickCase.validatePersonAndHisRelation(requester)).toBe(caseData[expectedJsonName].requester);
        await expect(quickCase.validatePersonAndHisRelation(contact)).toBe(caseData[expectedJsonName].contact);
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa/quickcase?customer=qliu@petramco.com&desc=Change my Last Name&contact=+14085719604');
        await browser.sleep(1000);
        await expect(quickCase.validatePersonAndHisRelation(requester)).toBe(caseData[expectedJsonName].requester);
        await expect(quickCase.validatePersonAndHisRelation(contact)).toBe(caseData[expectedJsonName].contact);
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa/quickcase?customer=qliu@petramco.com&desc=Change my Last Name&contact=tesser');
        await browser.sleep(1000);
        await expect(quickCase.validatePersonAndHisRelation(requester)).toBe(caseData[expectedJsonName].requester);
        await expect(quickCase.validatePersonAndHisRelation(contact)).toBe(caseData[expectedJsonName].contact);
    });

    //radhiman
    it('[DRDMV-18980]: Populating fields in Quick Case with Required and one optional parameter', async () => {
        let caseData = require('../../data/ui/case/case.ui.json');
        let expectedJsonName = 'caseData_DRDMV18980';
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa/quickcase?customer=qliu&desc=Change my Last Name&contact');
        await expect(quickCase.validatePersonAndHisRelation(requester)).toBe(caseData[expectedJsonName].requester);
        await expect(quickCase.isSummOrDescPopulatedAtSmartTextArea(caseData[expectedJsonName].description)).not.toBe(-1);
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa/quickcase?customer=qliu&desc=&contact=+14085719604');
        await expect(quickCase.validatePersonAndHisRelation(requester)).toBe(caseData[expectedJsonName].requester);
        await expect(quickCase.validatePersonAndHisRelation(contact)).toBe(caseData[expectedJsonName].contact);
        await expect(quickCase.isCreateButtonDisabled).toBeTruthy();
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa/quickcase?customer=qdu&desc=Change my Last Name&contact=');
        await expect(quickCase.validatePersonAndHisRelation(requester)).toBe(caseData[expectedJsonName].requester2);
        await expect(quickCase.isSummOrDescPopulatedAtSmartTextArea(caseData[expectedJsonName].description)).not.toBe(-1);
    });

    //radhiman
    it('[DRDMV-18977]: [-ve] Populating fields in Quick Case if Required parameter is empty', async () => {
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa/quickcase?customer=&desc=Change my Last Name&contact=PET000000000484');
        await expect(await quickCase.getTextOfSummaryTextBox()).toBe('', 'Quick case summary text box is not empty');
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa/quickcase?customer=&desc=Change my Last Name&contact=');
        await expect(await quickCase.getTextOfSummaryTextBox()).toBe('', 'Quick case summary text box is not empty');
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa/quickcase?customer=&desc=&contact=PET000000000484');
        await expect(await quickCase.getTextOfSummaryTextBox()).toBe('', 'Quick case summary text box is not empty');
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa/quickcase?customer=&desc=&contact=');
        await expect(await quickCase.getTextOfSummaryTextBox()).toBe('', 'Quick case serch box is not empty');
    });

    //radhiman
    it('[DRDMV-18983]: [-ve] Populating fields in Quick Case if Required parameter is empty', async () => {
        let caseData = require('../../data/ui/case/case.ui.json');
        let expectedJsonName = 'caseData_DRDMV18983';
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa/quickcase?customer=Test1&desc=Change my Last Name&contact=qliu');
        await browser.sleep(2000);
        await expect(quickCase.getPopUpMessage()).toContain(caseData[expectedJsonName].warningMsg);
        await expect(await quickCase.getTextOfSummaryTextBox()).toBe('', 'Quick case summary text box is not empty');
        await expect(quickCase.isCreateButtonDisabled).toBeTruthy();
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa/quickcase?customer=qliu&desc=Change my Last Name&contact=test1');
        await expect(quickCase.validatePersonAndHisRelation(requester)).toBe(caseData[expectedJsonName].requester);
        await expect(quickCase.isSummOrDescPopulatedAtSmartTextArea(caseData[expectedJsonName].description)).not.toBe(-1);
    });

    //kgaikwad
    it('[DRDMV-771]: [Quick Case] Similar cases search in Resources', async () => {
        let caseSummary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseDescription = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotCreateCase();
        await createCasePo.selectRequester("Adam Pavlik");
        await createCasePo.setSummary(caseSummary);
        await createCasePo.setDescription(caseDescription);
        await createCasePo.clickSaveCaseButton();
        await createCasePo.clickGoToCaseButton();
        await viewCasePo.clickOnTab('Case Access');

        await navigationPage.gotoQuickCase();
        let categoryvalues: string[] = [caseSummary, caseDescription];
        for (let i = 0; i < categoryvalues.length; i++) {
            let result;
            for (let j = 0; i < 3; j++) {
                await browser.refresh();
                await quickCasePo.selectRequesterName('Adam Pavlik');
                await quickCasePo.setCaseSummary(categoryvalues[i]);
                await utilCommon.waitUntilSpinnerToHide();
                let qcSummary = await quickCasePo.isCaseSummaryPresentInRecommendedCases(categoryvalues[i]);
                if (qcSummary == false) {
                    await browser.sleep(3000);
                    result = false;
                }
                else {
                    result = true
                    break;
                }
            }
            await expect(result).toBeTruthy(`FailureMsg: Case Summary does not match for ${categoryvalues[i]}`);
        }
    });

    //kgaikwad
    it('[DRDMV-797]: [Quick Case] Case creation with inactive template (negative)', async () => {
        let templateName = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateSummary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        var templateData = {
            "templateName": 'drdmv_797_templateName' + templateName,
            "templateSummary": 'drdmv_797_templateName' + templateSummary,
            "templateStatus": "Active",
            "company": 'Petramco'
        }
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createCaseTemplate(templateData);
        // Quick case 
        await navigationPage.gotoQuickCase();
        for (let i = 0; i < 6; i++) {
            await quickCasePo.selectRequesterName("Adam Pavlik");
            let kk = await quickCasePo.isCaseTemplatePresent(templateData.templateName);
            if (kk == false) {
                await browser.refresh();
                await browser.sleep(5000);
            }
            else {
                await browser.refresh();
                await quickCasePo.selectRequesterName("Adam Pavlik");
                await quickCasePo.selectCaseTemplate(templateData.templateName);
                break;
            }
        }
        await browser.executeScript("window.open('about:blank','_blank');");
        await utilCommon.switchToNewWidnow(1);
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        await consoleCasetemplatePo.searchAndClickOnCaseTemplate(templateData.templateName);
        await editCasetemplatePo.clickOnEditCaseTemplateMetadata();
        await editCasetemplatePo.changeTemplateStatusDropdownValue('Draft');
        await editCasetemplatePo.changeOwnerGroupDropdownValue('Compensation and Benefits');
        await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
        await utilCommon.switchToNewWidnow(0);
        await quickCasePo.saveCase();
        await expect(await utilCommon.getPopUpMessage()).toBe('ERROR (10000): Template is Inactive. Cannot create case.', 'FailureMsg: Pop up Msg is missing for inactive template');

        await utilCommon.switchToNewWidnow(1);
        await editCasetemplatePo.clickOnEditCaseTemplateMetadata();
        await editCasetemplatePo.changeTemplateStatusDropdownValue('Inactive');
        await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
        await utilCommon.switchToNewWidnow(0);
        await quickCasePo.saveCase();
        await expect(await utilCommon.getPopUpMessage()).toBe('ERROR (10000): Template is Inactive. Cannot create case.', 'FailureMsg: Pop up Msg is missing for inactive template');
    });
})