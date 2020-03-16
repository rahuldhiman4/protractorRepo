import { browser, protractor, ProtractorExpectedConditions } from "protractor";
import apiHelper from '../../api/api.helper';
import createCasePo from '../../pageobject/case/create-case.po';
import { default as quickCase, default as quickCasePo } from "../../pageobject/case/quick-case.po";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import utilCommon from '../../utils/util.common';
import casePreviewPo from '../../pageobject/case/case-preview.po';
import viewCasePo from '../../pageobject/case/view-case.po';

describe("Quick Case", () => {
    const EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    const requester = "Requester";
    const contact = "Contact";
    let loginId = 'caseagentbwf';
    let caseSummary771 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
    let caseDescription771 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
    let templateName797 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
    let templateSummary797 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
    let caseTemplateId797 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');

    beforeAll(async () => {
        browser.waitForAngularEnabled(false);
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
        await loginPage.login("qkatawazi");
        await testData771();
        await testData797();
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

    async function testData771() {
        await navigationPage.gotCreateCase();
        await createCasePo.selectRequester("Adam Pavlik");
        await createCasePo.setSummary(caseSummary771);
        await createCasePo.setDescription(caseDescription771);
        await createCasePo.clickSaveCaseButton();
        await createCasePo.clickGoToCaseButton();
    }
    //kgaikwad
    it('[DRDMV-771]: [Quick Case] Similar cases search in Resources', async () => {
        await navigationPage.gotoQuickCase();
        let categoryvalues: string[] = [caseSummary771, caseDescription771];
        for (let i = 0; i < categoryvalues.length; i++) {
            let result;
            await browser.refresh();
            await quickCasePo.selectRequesterName('Adam Pavlik');
            await quickCasePo.setCaseSummary(categoryvalues[i]);
            await utilCommon.waitUntilSpinnerToHide();
            let qcSummary = await quickCasePo.isCaseSummaryPresentInRecommendedCases(categoryvalues[0]);
            if (qcSummary == false) {
                result = false;
            }
            else {
                result = true
            }

            await expect(result).toBeTruthy(`FailureMsg: Case Summary does not match for ${categoryvalues[i]}`);
        }
    });

    async function testData797() {
        let templateData = {
            "templateName": templateName797,
            "templateSummary": templateSummary797,
            "templateStatus": "Active",
            "company": 'Petramco'
        }
        await apiHelper.apiLogin('qkatawazi');
        let newCaseTemplate = await apiHelper.createCaseTemplate(templateData);
        caseTemplateId797 = newCaseTemplate.id;
    }
    //kgaikwad
    it('[DRDMV-797]: [Quick Case] Case creation with inactive template (negative)', async () => {
        await navigationPage.gotoQuickCase();
        await quickCasePo.selectRequesterName("Adam Pavlik");
        await quickCasePo.selectCaseTemplate(templateName797);
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.updateCaseTemplateStatus(caseTemplateId797, 'Draft');
        await quickCasePo.saveCase();
        await expect(await utilCommon.getPopUpMessage()).toBe('ERROR (10000): Template is Inactive. Cannot create case.', 'FailureMsg: Pop up Msg is missing for draft template');
        await apiHelper.updateCaseTemplateStatus(caseTemplateId797, 'Inactive');
        await quickCasePo.saveCase();
        await expect(await utilCommon.getPopUpMessage()).toBe('ERROR (10000): Template is Inactive. Cannot create case.', 'FailureMsg: Pop up Msg is missing for inactive template');
    });
    it('[DRDMV-800]: [Quick Case] Case creation with requester having same name as other company users', async () => {

        let userData1 = {
            "firstName": "Person1",
            "lastName": "Person1",
            "userId": "userData1",
        }

        let userData2 = {
            "firstName": "Person1",
            "lastName": "Person1",
            "userId": "userData2",
        }

        let userData3 = {
            "firstName": "Person1",
            "lastName": "Person1",
            "userId": "userData3",
        }

        let userData4 = {
            "firstName": "Person1",
            "lastName": "Person1",
            "userId": "userData4",
        }

        await apiHelper.apiLogin('tadmin');
        await apiHelper.createNewUser(userData1);
        await apiHelper.createNewUser(userData2);
        await apiHelper.createNewUser(userData3);
        await apiHelper.createNewUser(userData4);

        await navigationPage.gotoQuickCase();
        await quickCase.selectRequesterName('Person1');
        await quickCase.setCaseSummary('caseSummary');
        await quickCase.createCaseButton();
        await expect(utilCommon.getPopUpMessage()).toBe('Saved successfully');
        await quickCase.gotoCaseButton();
        await expect(viewCasePo.getRequesterName()).toBe('Person1 Person1');
    });

})
