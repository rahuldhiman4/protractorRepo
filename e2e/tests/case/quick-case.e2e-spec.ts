import { browser, protractor, ProtractorExpectedConditions } from "protractor";
import apiHelper from '../../api/api.helper';
import casePreviewPo from '../../pageobject/case/case-preview.po';
import createCasePo from '../../pageobject/case/create-case.po';
import { default as quickCase, default as quickCasePo } from "../../pageobject/case/quick-case.po";
import viewCasePo from '../../pageobject/case/view-case.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import editCaseTemplate from "../../pageobject/settings/case-management/edit-casetemplate.po";
import utilCommon from '../../utils/util.common';
import utilGrid from '../../utils/util.grid';

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
        expect(await quickCase.validatePersonAndHisRelation(requester)).toEqual(caseData[expectedJsonName].requester1);
        expect(await quickCase.isCreateButtonDisabled()).toBeTruthy;
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa/quickcase?customer=qliu@petramco.com&desc=&contact=');
        expect(await quickCase.validatePersonAndHisRelation(requester)).toEqual(caseData[expectedJsonName].requester2);
        expect(await quickCase.isCreateButtonDisabled()).toBeTruthy;
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa/quickcase?customer=qliu&desc=&contact=');
        expect(await quickCase.validatePersonAndHisRelation(requester)).toEqual(caseData[expectedJsonName].requester2);
        expect(await quickCase.isCreateButtonDisabled()).toBeTruthy;
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa/quickcase?customer=+61288992922&desc=&contact=');
        expect(await quickCase.validatePersonAndHisRelation(requester)).toEqual(caseData[expectedJsonName].requester2);
        expect(await quickCase.isCreateButtonDisabled()).toBeTruthy();
    });

    //radhiman
    it('[DRDMV-18973]: Populating fields in Quick Case when all parameters are specified', async () => {
        let caseData = require('../../data/ui/case/case.ui.json');
        let expectedJsonName = 'caseData_DRDMV18973';
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa/quickcase?customer=qliu@petramco.com&desc=Change my Last Name&contact=PET000000000484');
        await browser.sleep(1000);
        expect(await quickCase.validatePersonAndHisRelation(requester)).toBe(caseData[expectedJsonName].requester);
        expect(await quickCase.validatePersonAndHisRelation(contact)).toBe(caseData[expectedJsonName].contact);
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa/quickcase?customer=qliu@petramco.com&desc=Change my Last Name&contact=tesser@petramco.com');
        await browser.sleep(1000);
        expect(await quickCase.validatePersonAndHisRelation(requester)).toBe(caseData[expectedJsonName].requester);
        expect(await quickCase.validatePersonAndHisRelation(contact)).toBe(caseData[expectedJsonName].contact);
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa/quickcase?customer=qliu@petramco.com&desc=Change my Last Name&contact=+14085719604');
        await browser.sleep(1000);
        expect(await quickCase.validatePersonAndHisRelation(requester)).toBe(caseData[expectedJsonName].requester);
        expect(await quickCase.validatePersonAndHisRelation(contact)).toBe(caseData[expectedJsonName].contact);
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa/quickcase?customer=qliu@petramco.com&desc=Change my Last Name&contact=tesser');
        await browser.sleep(1000);
        expect(await quickCase.validatePersonAndHisRelation(requester)).toBe(caseData[expectedJsonName].requester);
        expect(await quickCase.validatePersonAndHisRelation(contact)).toBe(caseData[expectedJsonName].contact);
    });

    //radhiman
    it('[DRDMV-18980]: Populating fields in Quick Case with Required and one optional parameter', async () => {
        let caseData = require('../../data/ui/case/case.ui.json');
        let expectedJsonName = 'caseData_DRDMV18980';
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa/quickcase?customer=qliu&desc=Change my Last Name&contact');
        expect(await quickCase.validatePersonAndHisRelation(requester)).toBe(caseData[expectedJsonName].requester);
        expect(await quickCase.isSummOrDescPopulatedAtSmartTextArea(caseData[expectedJsonName].description)).not.toBe(-1);
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa/quickcase?customer=qliu&desc=&contact=+14085719604');
        expect(await quickCase.validatePersonAndHisRelation(requester)).toBe(caseData[expectedJsonName].requester);
        expect(await quickCase.validatePersonAndHisRelation(contact)).toBe(caseData[expectedJsonName].contact);
        expect(await quickCase.isCreateButtonDisabled()).toBeTruthy();
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa/quickcase?customer=qdu&desc=Change my Last Name&contact=');
        expect(await quickCase.validatePersonAndHisRelation(requester)).toBe(caseData[expectedJsonName].requester2);
        expect(await quickCase.isSummOrDescPopulatedAtSmartTextArea(caseData[expectedJsonName].description)).not.toBe(-1);
    });

    //radhiman
    it('[DRDMV-18977]: [-ve] Populating fields in Quick Case if Required parameter is empty', async () => {
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa/quickcase?customer=&desc=Change my Last Name&contact=PET000000000484');
        expect(await quickCase.getTextOfSummaryTextBox()).toBe('', 'Quick case summary text box is not empty');
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa/quickcase?customer=&desc=Change my Last Name&contact=');
        expect(await quickCase.getTextOfSummaryTextBox()).toBe('', 'Quick case summary text box is not empty');
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa/quickcase?customer=&desc=&contact=PET000000000484');
        expect(await quickCase.getTextOfSummaryTextBox()).toBe('', 'Quick case summary text box is not empty');
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa/quickcase?customer=&desc=&contact=');
        expect(await quickCase.getTextOfSummaryTextBox()).toBe('', 'Quick case serch box is not empty');
    });

    //radhiman
    it('[DRDMV-18983]: [-ve] Populating fields in Quick Case if Required parameter is empty', async () => {
        let caseData = require('../../data/ui/case/case.ui.json');
        let expectedJsonName = 'caseData_DRDMV18983';
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa/quickcase?customer=Test1&desc=Change my Last Name&contact=qliu');
        await browser.sleep(2000);
        expect(await quickCase.getPopUpMessage()).toContain(caseData[expectedJsonName].warningMsg);
        expect(await quickCase.getTextOfSummaryTextBox()).toBe('', 'Quick case summary text box is not empty');
        expect(await quickCase.isCreateButtonDisabled()).toBeTruthy();
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa/quickcase?customer=qliu&desc=Change my Last Name&contact=test1');
        expect(await quickCase.validatePersonAndHisRelation(requester)).toBe(caseData[expectedJsonName].requester);
        expect(await quickCase.isSummOrDescPopulatedAtSmartTextArea(caseData[expectedJsonName].description)).not.toBe(-1);
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
            qcSummary = false ? result = false : result = true;
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
        expect(await utilCommon.getPopUpMessage()).toBe('ERROR (10000): Template is Inactive. Cannot create case.', 'FailureMsg: Pop up Msg is missing for draft template');
        await apiHelper.updateCaseTemplateStatus(caseTemplateId797, 'Inactive');
        await quickCasePo.saveCase();
        expect(await utilCommon.getPopUpMessage()).toBe('ERROR (10000): Template is Inactive. Cannot create case.', 'FailureMsg: Pop up Msg is missing for inactive template');
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
        expect(await utilCommon.isPopupMsgsMatches(['Saved successfully'])).toBeTruthy('Success message not validated');
        await quickCase.gotoCaseButton();
        expect(await viewCasePo.getRequesterName()).toBe('Person1 Person1');
    });

    it('[DRDMV-794]: [Quick Case] Requester, Contact, Subject Employee people selection', async () => {
        await navigationPage.gotoQuickCase();
        await quickCase.selectRequesterName('allen');
        expect(await quickCase.getDrpDownValueByIndex(1)).toBe('Requester');
        await quickCase.selectRequesterName('adam');
        expect(await quickCase.getDrpDownValueByIndex(2)).toBe('Related to');
        await quickCase.selectRequesterName('bpitt');
        expect(await quickCase.getDrpDownValueByIndex(3)).toBe('Related to');
        await quickCase.selectRequesterName('brain');
        expect(await quickCase.getDrpDownValueByIndex(4)).toBe('Related to');
        await quickCase.selectDrpDownValueByIndex('Target', 1);
        expect(await quickCase.isCreateButtonDisabled()).toBeTruthy('Save button Enabled');
        await quickCase.selectRequesterName('kye');
        expect(await quickCase.getDrpDownValueByIndex(5)).toBe('Requester');
        expect(await quickCase.getDrpDownValueByIndex(1)).toBe('Target');
        await quickCase.selectDrpDownValueByIndex('The requester of the case', 1);
        expect(await quickCase.getDrpDownValueByIndex(1)).toBe('Requester');
        expect(await quickCase.getDrpDownValueByIndex(5)).toBe('Contact');
        await quickCase.selectDrpDownValueByIndex('Another person contacting on behalf of the requester', 1);
        expect(await quickCase.getDrpDownValueByIndex(5)).toBe('Requester');
        expect(await quickCase.getDrpDownValueByIndex(1)).toBe('Contact');
        await quickCase.setCaseSummary('address');
        await quickCase.saveCase();
        expect(await casePreviewPo.isRequesterNameDisplayed('Kye Petersen')).toBeTruthy();
        expect(await casePreviewPo.isContactNameDisplayed('Al Allbrook')).toBeTruthy();
    });

    it('[DRDMV-1205]: [Quick Case] People search', async () => {
        await navigationPage.gotoQuickCase();
        await quickCase.selectRequesterName('Allen');
        expect(await quickCase.validatePersonAndHisRelation(requester)).toBe('Al Allbrook');
        await quickCase.clearInputBox();
        await quickCase.selectRequesterName('@Allbrook');
        expect(await quickCase.validatePersonAndHisRelation(requester)).toBe('Al Allbrook');
        await quickCase.clearInputBox();
        await quickCase.selectRequesterName('@all');
        expect(await quickCase.validatePersonAndHisRelation(requester)).toBe('Al Allbrook');
        await quickCase.clearInputBox();
        await quickCase.selectRequesterName('@aallbrook');
        expect(await quickCase.validatePersonAndHisRelation(requester)).toBe('Al Allbrook');
        await quickCase.clearInputBox();
        await quickCase.selectRequesterName('@Al Allbrook');
        expect(await quickCase.validatePersonAndHisRelation(requester)).toBe('Al Allbrook');
        await quickCase.clearInputBox();
        await quickCase.selectRequesterName('@allen.allbrook@petramco.com');
        expect(await quickCase.validatePersonAndHisRelation(requester)).toBe('Al Allbrook');
    });

    //apdeshmu
    it('[DRDMV-1087]:[Quick Case] Case Template search via !', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let assignmentMappingName = "DRDMV-1087 " + randomStr;
        let caseTemplateName = randomStr + "DRDMV1087Petramco";
        let caseTemplateName1 = randomStr + "DRDMV1087Psilon";
        let threeCharacterString = randomStr.substr(0, 3);

        let assignmentData =
        {
            "assignmentMappingName": assignmentMappingName,
            "company": "Petramco",
            "supportCompany": "Petramco",
            "supportGroup": "Employee Relations",
            "assignee": "qliu",
            "categoryTier1": "Purchasing Card",
            "categoryTier2": "Policies",
            "categoryTier3": "Card Issuance",
            "priority": "Low",
        }
        let templateData = {
            "templateName": caseTemplateName,
            "templateSummary": caseTemplateName,
            "categoryTier1": "Purchasing Card",
            "categoryTier2": "Policies",
            "categoryTier3": "Card Issuance",
            "casePriority": "Low",
            "templateStatus": "Draft",
            "company": "Petramco",
        }
        let templateData1 = {
            "templateName": caseTemplateName1,
            "templateSummary": caseTemplateName1,
            "templateStatus": "Active",
            "company": 'Psilon'
        }
        try {
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createCaseTemplate(templateData);
            await apiHelper.createCaseAssignmentMapping(assignmentData);
            await apiHelper.apiLogin('gwixillian');
            await apiHelper.createCaseTemplate(templateData1);

            //Draft Template Search 
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName("adam");
            await quickCasePo.selectCaseTemplate(caseTemplateName);
            expect(await quickCasePo.selectCaseTemplate(caseTemplateName)).toBeFalsy("Draft Template is founded");;

            //Different Company Search
            await quickCasePo.clickStartOverButton();
            await quickCasePo.selectRequesterName("adam");
            expect(await quickCasePo.selectCaseTemplate(caseTemplateName1)).toBeFalsy("Template is same as employee comapny");;

            //3 Character Search Template Verification
            await quickCasePo.clickStartOverButton();
            await quickCasePo.selectRequesterName("adam");
            expect(await quickCasePo.selectCaseTemplate(threeCharacterString)).toBeTruthy("Template is not founded");

            //Active Template Verification
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(caseTemplateName);
            await editCaseTemplate.clickOnEditCaseTemplateMetadata();
            await editCaseTemplate.changeTemplateStatusDropdownValue('Active');
            await editCaseTemplate.clickOnSaveCaseTemplateMetadata();
            await navigationPage.gotoQuickCase();
            await quickCasePo.clickStartOverButton();
            await quickCasePo.selectRequesterName("adam");
            expect(await quickCasePo.selectCaseTemplate(caseTemplateName)).toBeTruthy("Active Template is Not founded");
            await quickCasePo.selectCaseTemplate(caseTemplateName);
            await quickCasePo.saveCase();
            await createCasePo.clickGoToCaseButton();
        } catch (e) {
            throw e;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 500 * 1000);

    //apdeshmu
    it('[DRDMV-786]:[Quick Case] Case creation with all case statuses in template', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateName1 = randomStr + "DRDMV1087Petramco1";
        let caseTemplateName2 = randomStr + "DRDMV1087Petramco2";
        let caseTemplateName3 = randomStr + "DRDMV1087Petramco3";
        let caseTemplateName4 = randomStr + "DRDMV1087Petramco4";

        let templateData1 = {
            "templateName": caseTemplateName1,
            "templateSummary": caseTemplateName1,
            "categoryTier1": "Purchasing Card",
            "categoryTier2": "Policies",
            "categoryTier3": "Card Issuance",
            "casePriority": "Low",
            "templateStatus": "Active",
            "company": "Petramco",
            "caseStatus": "New"
        }
        let templateData2 = {
            "templateName": caseTemplateName2,
            "templateSummary": caseTemplateName2,
            "categoryTier1": "Purchasing Card",
            "categoryTier2": "Policies",
            "categoryTier3": "Card Issuance",
            "casePriority": "Low",
            "templateStatus": "Active",
            "company": "Petramco",
            "caseStatus": "Assigned"
        }
        let templateData3 = {
            "templateName": caseTemplateName3,
            "templateSummary": caseTemplateName3,
            "caseStatus": "InProgress",
            "templateStatus": "Active",
            "assignee": "Fritz",
            "company": "Petramco",
            "supportGroup": "Facilities",
            "ownerGroup": "Facilities"
        }
        let templateData4 = {
            "templateName": caseTemplateName4,
            "templateSummary": caseTemplateName4,
            "caseStatus": "Resolved",
            "templateStatus": "Active",
            "assignee": "Fritz",
            "company": "Petramco",
            "supportGroup": "Facilities",
            "ownerGroup": "Facilities"
        }
        try {
            console.log("Template Name" + caseTemplateName1);
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createCaseTemplate(templateData1);
            await apiHelper.createCaseTemplate(templateData2);
            await apiHelper.apiLogin('fritz');
            await apiHelper.createCaseTemplate(templateData3);
            await apiHelper.createCaseTemplate(templateData4);
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName("adam");
            await quickCasePo.selectCaseTemplate(caseTemplateName1);
            await quickCasePo.saveCase();
            await createCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getCaseStatusValue()).toContain('New');
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName("adam");
            await quickCasePo.selectCaseTemplate(caseTemplateName2);
            await quickCasePo.saveCase();
            await createCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getCaseStatusValue()).toContain('Assigned');

            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName("fritz");
            await quickCasePo.selectCaseTemplate(caseTemplateName4);
            await quickCasePo.saveCase();
            await createCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getCaseStatusValue()).toContain('Resolved');
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName("fritz");
            await quickCasePo.selectCaseTemplate(caseTemplateName3);
            await quickCasePo.saveCase();
            await createCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getCaseStatusValue()).toContain('In Progress');
        } catch (e) {
            throw e;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 500 * 1000);

})
