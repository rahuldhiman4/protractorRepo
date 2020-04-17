import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import attachmentBladePage from "../../pageobject/attachment/attachment-blade.po";
import previewCasePo from '../../pageobject/case/case-preview.po';
import createCasePo from '../../pageobject/case/create-case.po';
import editCasePo from '../../pageobject/case/edit-case.po';
import { default as quickCase, default as quickCasePo } from "../../pageobject/case/quick-case.po";
import { default as viewCasePage, default as viewCasePo } from '../../pageobject/case/view-case.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import resources from '../../pageobject/common/resources-tab.po';
import previewKnowledgePo from '../../pageobject/knowledge/preview-knowledge.po';
import consoleCasetemplatePo from '../../pageobject/settings/case-management/console-casetemplate.po';
import editCaseTemplate from "../../pageobject/settings/case-management/edit-casetemplate.po";
import previewCaseTemplateCasesPo from '../../pageobject/settings/case-management/preview-case-template-cases.po';
import { default as activityPo, default as activityTabPo } from '../../pageobject/social/activity-tab.po';
import adhoctaskTemplate from "../../pageobject/task/create-adhoc-task.po";
import { default as manageTask } from "../../pageobject/task/manage-task-blade.po";
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilGrid from '../../utils/util.grid';
import utilityCommon from '../../utils/utility.common';

let RecommendedKnowledgeStr = "Recommended Knowledge ";
let applyBtn = "Apply";
describe("Quick Case", () => {
    const requester = "The requester of the case";
    const contact = "Contact";
    let caseSummary771 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
    let caseDescription771 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
    let templateName797 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
    let templateSummary797 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
    let caseTemplateId797 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login("qkatawazi");
        await testData771();
        await testData797();
    });

    afterEach(async () => {
        await utilityCommon.refresh();
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
        await navigationPage.gotoCreateCase();
        await createCasePo.selectRequester("Adam Pavlik");
        await createCasePo.setSummary(caseSummary771);
        await createCasePo.setDescription(caseDescription771);
        await createCasePo.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
    }

    //kgaikwad
    it('[DRDMV-771]: [Quick Case] Similar cases search in Resources', async () => {
        await navigationPage.gotoQuickCase();
        let categoryvalues: string[] = [caseSummary771, caseDescription771];
        for (let i = 0; i < categoryvalues.length; i++) {
            let result;
            await utilityCommon.refresh();
            await quickCasePo.selectRequesterName('Adam Pavlik');
            await quickCasePo.setCaseSummary(categoryvalues[i]);
            await utilityCommon.waitUntilSpinnerToHide();
            let qcSummary = await quickCasePo.isCaseSummaryPresentInRecommendedCases(categoryvalues[0]);
            qcSummary = false ? result = false : result = true;
            await expect(result).toBeTruthy(`FailureMsg: Case Summary does not match for ${categoryvalues[i]}`);
        }
    });

    async function testData797() {
        let templateData = {
            "templateName": templateName797,
            "templateSummary": templateSummary797,
            "templateStatus": 'Active',
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
        expect(await utilityCommon.getAllPopupMsg()).toContain('Template is Inactive. Cannot create case.', 'FailureMsg: Pop up Msg is missing for inactive template');
        await apiHelper.updateCaseTemplateStatus(caseTemplateId797, 'Inactive');
        await quickCasePo.saveCase();
        expect(await utilityCommon.getAllPopupMsg()).toContain('Template is Inactive. Cannot create case.', 'FailureMsg: Pop up Msg is missing for inactive template');
     },200 * 1000);

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
        await quickCase.selectRequesterName('Person1 Person1');
        await quickCase.setCaseSummary('caseSummary');
        await quickCase.createCaseButton();
        expect(await utilityCommon.isPopUpMessagePresent('Saved successfully')).toBeTruthy('Success message not validated');
        await quickCase.gotoCaseButton();
        expect(await viewCasePo.getRequesterName()).toBe('Person1 Person1');
    });

    //pending contact bug
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
        expect(await quickCase.getDrpDownValueByIndex(5)).toBe('The requester of the case');
        expect(await quickCase.getDrpDownValueByIndex(1)).toBe('Target');
        await quickCase.selectDrpDownValueByIndex('The requester of the case', 1);
        expect(await quickCase.getDrpDownValueByIndex(1)).toBe('The requester of the case');
        expect(await quickCase.getDrpDownValueByIndex(5)).toBe('Another person contacting on behalf of the requester');
        await quickCase.selectDrpDownValueByIndex('Another person contacting on behalf of the requester', 1);
        expect(await quickCase.getDrpDownValueByIndex(5)).toBe('The requester of the case');
        expect(await quickCase.getDrpDownValueByIndex(1)).toBe('Another person contacting on behalf of the requester');
        await quickCase.setCaseSummary('address');
        await quickCase.saveCase();
        expect(await previewCasePo.isRequesterNameDisplayed('Kye Petersen')).toBeTruthy();
        expect(await previewCasePo.isContactNameDisplayed('Al Allbrook')).toBeTruthy();
    });

    it('[DRDMV-1205]: [Quick Case] People search', async () => {
        await navigationPage.gotoQuickCase();
        await quickCase.selectRequesterName('Allen');
        expect(await quickCase.validatePersonAndHisRelation(requester)).toBe('Al Allbrook');
        await quickCase.clickStartOverButton();
        await quickCase.selectRequesterName('Allbrook');
        expect(await quickCase.validatePersonAndHisRelation(requester)).toBe('Al Allbrook');
        await quickCase.clickStartOverButton();
        await quickCase.selectRequesterName('all');
        expect(await quickCase.validatePersonAndHisRelation(requester)).toBe('Al Allbrook');
        await quickCase.clickStartOverButton();
        await quickCase.selectRequesterName('aallbrook');
        expect(await quickCase.validatePersonAndHisRelation(requester)).toBe('Al Allbrook');
        await quickCase.clickStartOverButton();
        await quickCase.selectRequesterName('Al Allbrook');
        expect(await quickCase.validatePersonAndHisRelation(requester)).toBe('Al Allbrook');
        await quickCase.clickStartOverButton();
        await quickCase.selectRequesterName('allen.allbrook@petramco.com');
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
            await previewCasePo.clickGoToCaseButton();
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
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getCaseStatusValue()).toContain('New');
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName("adam");
            await quickCasePo.selectCaseTemplate(caseTemplateName2);
            await quickCasePo.saveCase();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getCaseStatusValue()).toContain('Assigned');

            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName("fritz");
            await quickCasePo.selectCaseTemplate(caseTemplateName4);
            await quickCasePo.saveCase();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getCaseStatusValue()).toContain('Resolved');
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName("fritz");
            await quickCasePo.selectCaseTemplate(caseTemplateName3);
            await quickCasePo.saveCase();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getCaseStatusValue()).toContain('In Progress');
        } catch (e) {
            throw e;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 500 * 1000);

    // Failed due to defect
    //ankagraw
    it('[DRDMV-796]: [Quick Case] Resources preview', async () => {
        let userData1 = {
            "firstName": "Person1",
            "lastName": "Person1",
            "userId": "userData1",
        }
        await apiHelper.apiLogin('tadmin');
        await apiHelper.createNewUser(userData1);
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateName = randomStr + 'caseTemplateName';
        let casTemplateSummary = 'CaseSummaryName' + randomStr;
        let knowledgeTitile = 'knowledge2985' + randomStr;
        let manualTaskTemplateData = {
            "templateName": `manualTaskTemplateDraft ${randomStr}`,
            "templateSummary": `manualTaskTemplateDraft ${randomStr}`,
            "templateStatus": "Active",
        }
        let CaseTemplateData = {
            "templateName": `${caseTemplateName}`,
            "templateSummary": `${casTemplateSummary}`,
            "caseStatus": "InProgress",
            "templateStatus": "Active",
            "assignee": "Fritz",
            "company": "Petramco",
            "supportGroup": "Facilities",
            "ownerGroup": "Facilities"
        }

        let articleData = {
            "knowledgeSet": "HR",
            "title": `${caseTemplateName}`,
            "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
            "assignee": "KWilliamson",
            "assigneeSupportGroup": "AU Support 3",
            "company": "Petramco"
        }

        await apiHelper.apiLogin('qkatawazi');
        let manualTaskTemplate = await apiHelper.createManualTaskTemplate(manualTaskTemplateData);
        let newCaseTemplate = await apiHelper.createCaseTemplate(CaseTemplateData);
        await apiHelper.associateCaseTemplateWithOneTaskTemplate(newCaseTemplate.displayId, manualTaskTemplate.displayId);
        let knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);

        let knowledgeArticleGUID = knowledgeArticleData.id;
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'Draft')).toBeTruthy('Status Not Set');
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'SMEReview', "KMills", 'GB Support 2', 'Petramco')).toBeTruthy("Article with SME Review status not updated.");
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'Published')).toBeTruthy('Status Not Set');

        await navigationPage.gotoQuickCase();
        await quickCase.selectRequesterName('Person1');
        await quickCase.selectCaseTemplate(`${caseTemplateName}`);
        await quickCase.clickArrowFirstRecommendedCase();
        expect(await previewCaseTemplateCasesPo.getCaseSummary()).toBe(`${casTemplateSummary}`);
        expect(await previewCaseTemplateCasesPo.getCaseStatus()).toBe("In Progress");
        expect(await previewCaseTemplateCasesPo.getCaseCompanyValue()).toBe("Petramco");
        expect(await previewCaseTemplateCasesPo.getCaseTemplateName()).toBe(`${caseTemplateName}`);
        expect(await previewCaseTemplateCasesPo.getCasePriority()).toBe("Medium");
        await previewCaseTemplateCasesPo.clickOnBackButton();
        await quickCase.clickArrowFirstRecommendedKnowledge();
        expect(await previewKnowledgePo.isViewArticleLInkDisplay()).toBeTruthy('View article link not present');
        expect(await previewKnowledgePo.isStatusOfKADisplay()).toBeTruthy('Knowledge status not present');
        expect(await previewKnowledgePo.isBackButtonDisplay()).toBeTruthy('back button not present');
        await previewKnowledgePo.clickOnBackButton();
        await quickCase.createCaseButton();
        expect(await utilCommon.getPopUpMessage()).toBe('Saved successfully');
        expect(await previewCasePo.isRequesterNameDisplayed('Person1 Person1')).toBeTruthy();
        expect(await previewCasePo.isCaseSummaryDisplayed(`${caseTemplateName}`)).toBeTruthy();
        expect(await previewCasePo.isAssignedCompanyDisplayed('Petramco')).toBeTruthy();
        expect(await previewCasePo.isRequesterEmailIdDisplayed('test@petramco.com')).toBeTruthy();
        expect(await previewCasePo.isDescriptionDisplayed('Person1 Person1 2bvfcaseTemplateName')).toBeTruthy();
        await previewCasePo.clickOncreateNewCaseButton();
        expect(await viewCasePo.getRequesterName()).toBe('Person1 Person1');
    }, 480 * 1000);

    //ankagraw
    it('[DRDMV-795]: [Quick Case] Case template search in Resources', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateName = randomStr + 'caseTemplateName';
        let casTemplateSummary = 'CaseSummaryName' + randomStr;
        let CaseTemplateDataInDraftStatus = {
            "templateName": `${caseTemplateName}` + 'InDraftStatus',
            "templateSummary": `${casTemplateSummary}` + 'InDraftStatus',
            "caseStatus": "InProgress",
            "templateStatus": "Draft",
            "description": "DRDMV-795 verify",
            "assignee": "Fritz",
            "company": "Petramco",
            "supportGroup": "Facilities",
            "ownerGroup": "Facilities"
        }

        let CaseTemplateDataWithDifferentOrganization = {
            "templateName": `${caseTemplateName}` + 'WithDifferentOrganization',
            "templateSummary": `${casTemplateSummary}`,
            "caseStatus": "InProgress",
            "templateStatus": "Active",
            "assignee": "gderuno",
            "company": "Psilon",
            "supportGroup": "Psilon Support Group1",
            "ownerGroup": "Psilon Support Group1"
        }
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createCaseTemplate(CaseTemplateDataInDraftStatus);
        await apiHelper.apiLogin('gderuno');
        await apiHelper.createCaseTemplate(CaseTemplateDataWithDifferentOrganization);
        await navigationPage.gotoQuickCase();
        await quickCase.selectRequesterName('adam');
        expect(await quickCase.selectCaseTemplate(`${caseTemplateName}` + 'InDraftStatus')).toBeFalsy("Draft case template present");
        await quickCase.clearInputBox();
        await navigationPage.gotoQuickCase();
        await quickCase.selectRequesterName('adam');
        expect(await quickCase.selectCaseTemplate(`${caseTemplateName}` + 'WithDifferentOrganization')).toBeFalsy('Different organization case template present');
        await quickCase.clearInputBox();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        await consoleCasetemplatePo.searchAndClickOnCaseTemplate(`${caseTemplateName}` + 'InDraftStatus');
        await editCaseTemplate.clickOnEditCaseTemplateMetadata();
        await editCaseTemplate.changeTemplateStatusDropdownValue('Active');
        await editCaseTemplate.clickOnSaveCaseTemplateMetadata();
        await navigationPage.gotoQuickCase();
        await quickCase.selectRequesterName('adam');
        expect(await quickCase.selectCaseTemplate(`${caseTemplateName}` + 'InDraftStatus')).toBeTruthy("template not present");
        await quickCase.clearInputBox();
        await quickCase.clickStartOverButton();
        await quickCase.selectRequesterName('adam');
        expect(await quickCase.selectCaseTemplate(`${casTemplateSummary}` + 'InDraftStatus')).toBeTruthy("template not present");
        await quickCase.clickStartOverButton();
        await quickCase.selectRequesterName('adam');
        expect(await quickCase.selectCaseTemplate("DRDMV-795 verify")).toBeTruthy("template not present");
        await quickCase.clickStartOverButton();
    });

    //apdeshmu
    it('[DRDMV-767]:[Quick Case] Case creation with template (end-to-end)', async () => {
        let randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let assignmentMappingName = "DRDMV-1087 " + randomStr;
        let caseTemplateName = randomStr + "DRDMV-1087 Petramco";
        let caseTemplateSummary = 'CaseSummaryName' + randomStr;
        let tasktemplateData = {
            "templateName": `${caseTemplateName}`,
            "templateSummary": `${caseTemplateName}`,
            "templateStatus": "Active",
            "processBundle": "com.bmc.dsm.case-lib",
            "processName": `Case Process 1 ${randomStr}`,
            "categoryTier1": "Purchasing Card",
            "categoryTier2": "Policies",
            "categoryTier3": "Card Issuance",
        }
        let CaseTemplateData = {
            "templateName": `${caseTemplateName}`,
            "templateSummary": `${caseTemplateSummary}`,
            "caseStatus": "InProgress",
            "templateStatus": "Active",
            "assignee": "Fritz",
            "company": "Petramco",
            "supportGroup": "Facilities",
            "ownerGroup": "Facilities",
            "supportCompany": "Petramco",
            "categoryTier1": "Purchasing Card",
            "categoryTier2": "Policies",
            "categoryTier3": "Card Issuance",
            "priority": "Low",
        }
        let caseData =
        {
            "Requester": "qtao",
            "Summary": caseTemplateName,
            "Support Group": "Compensation and Benefits",
            "Assignee": "qkatawazi",
        }
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
        let articleData = {
            "knowledgeSet": "HR",
            "title": caseTemplateName,
            "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
            "assignee": "KWilliamson",
            "categoryTier1": "Applications",
            "categoryTier2": "Help Desk",
            "categoryTier3": "Incident",
            "region": "Australia",
            "site": "Canberra",
            "assigneeSupportGroup": "AU Support 3",
            "company": "Petramco",
        }
        await apiHelper.apiLogin('fritz');
        let automationTaskTemplate = await apiHelper.createAutomatedTaskTemplate(tasktemplateData);
        let newCaseTemplate = await apiHelper.createCaseTemplate(CaseTemplateData);
        console.log("active case Template is created===", newCaseTemplate.id);
        console.log("active case Template is created===", newCaseTemplate.displayId);
        await apiHelper.associateCaseTemplateWithOneTaskTemplate(newCaseTemplate.displayId, automationTaskTemplate.displayId);
        await apiHelper.createCaseAssignmentMapping(assignmentData);
        await apiHelper.createCase(caseData);
        await apiHelper.createKnowledgeArticle(articleData);
        try {
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName("adam");
            await quickCasePo.selectCaseTemplate(caseTemplateName);
            await quickCasePo.selectRequesterName("friz");
            await quickCase.selectDrpDownValueByIndex('Another person contacting on behalf of the requester', 1);
            await quickCasePo.selectRequesterName("chetan");
            await quickCasePo.setCaseSummary(caseTemplateName);
            await utilCommon.waitUntilSpinnerToHide();
            await quickCase.pinFirstRecommendedCase();
            await resources.clickOnAdvancedSearchOptions(RecommendedKnowledgeStr);
            await resources.enterAdvancedSearchText(caseTemplateName);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await quickCasePo.pinRecommendedKnowledgeArticles(3);
            await quickCasePo.saveCase();
            await utilCommon.waitUntilSpinnerToHide();
            await utilCommon.waitUntilPopUpDisappear();
            await previewCasePo.clickGoToCaseButton();
            await utilCommon.waitUntilSpinnerToHide();
            expect(await viewCasePage.getCaseSummary()).toBe(`${caseTemplateName}`, "Template is not Found");
            expect(await viewCasePage.getCategoryTier1Value()).toBe('Purchasing Card', "Category is not displaying");
            expect(await viewCasePage.getCategoryTier2Value()).toBe('Policies', "Category is not displaying");
            expect(await viewCasePage.getCategoryTier3Value()).toBe('Card Issuance', "Category is not displaying");
            expect(await viewCasePage.getCaseStatusValue()).toBe('In Progress', "Status is not displaying");
            expect(await viewCasePage.getAssignedGroupText()).toBe('Facilities');
            expect(await viewCasePage.getAssignedCompanyText()).toBe('Petramco');
            expect(await viewCasePage.getCaseTemplateText()).toBe(`${caseTemplateName}`);
            expect(await activityPo.isTextPresentInActivityLog("created the case")).toBeTruthy("Text is not present in activiy tab1");
            expect(await activityPo.isTextPresentInActivityLog("created the case")).toBeTruthy("Text is not present in activiy tab1");
            await utilCommon.scrollUpOrDownTillElement(viewCasePage.selectors.addedTaskFromCaseTemplate);
            expect(await viewCasePage.isCoreTaskPresent(caseTemplateName)).toBeTruthy("Task Is not added from Case Template");
            await viewCasePage.clickOnTab('Resources');
            await resources.clickOnAdvancedSearchOptions(caseTemplateName);
            await resources.enterAdvancedSearchText(caseTemplateName);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            expect(await resources.getAdvancedSearchResultForParticularSection(caseTemplateName)).toEqual(caseTemplateName);
        } catch (e) {
            throw e;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 500 * 1000);

    it('[DRDMV-624]:  Advanced Search UI verification on the Quick Case view', async () => {
        let randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let knowledgeTitile = 'knowledge3542' + randomStr;
        console.log(knowledgeTitile);
        await apiHelper.apiLogin('fritz');
        let articleData1 = {
            "knowledgeSet": "HR",
            "title": `${knowledgeTitile}`,
            "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
            "assignee": "kayo",
            "assigneeSupportGroup": "US Support 1",
            "company": "Petramco",
            "categoryTier1": "Applications",
            "region": "Australia",
            "site": "Canberra",
        }
        let articleData2 = {
            "knowledgeSet": "HR",
            "title": `${knowledgeTitile}`,
            "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
            "assignee": "kayo",
            "assigneeSupportGroup": "US Support 1",
            "company": "Petramco",
            "categoryTier1": "Applications",
            "region": "Australia",
            "site": "Canberra",
        }
        let articleData3 = {
            "knowledgeSet": "HR",
            "title": `${knowledgeTitile}`,
            "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
            "assignee": "kayo",
            "assigneeSupportGroup": "US Support 1",
            "company": "Petramco",
            "categoryTier1": "Applications",
            "region": "Australia",
            "site": "Canberra",
        }
        let articleData4 = {
            "knowledgeSet": "HR",
            "title": `${knowledgeTitile}`,
            "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
            "assignee": "kayo",
            "assigneeSupportGroup": "US Support 1",
            "company": "Petramco",
            "categoryTier1": "Applications",
            "region": "Australia",
            "site": "Canberra",
        }
        let articleData5 = {
            "knowledgeSet": "HR",
            "title": `${knowledgeTitile}`,
            "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
            "assignee": "kayo",
            "assigneeSupportGroup": "US Support 1",
            "company": "Petramco",
            "categoryTier1": "Applications",
            "region": "Australia",
            "site": "Canberra",
        }
        let articleData6 = {
            "knowledgeSet": "HR",
            "title": `${knowledgeTitile}`,
            "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
            "assignee": "kayo",
            "assigneeSupportGroup": "US Support 1",
            "company": "Petramco",
            "categoryTier1": "Applications",
            "region": "Australia",
            "site": "Canberra",
        }

        await apiHelper.createKnowledgeArticle(articleData1);
        await apiHelper.createKnowledgeArticle(articleData2);
        await apiHelper.createKnowledgeArticle(articleData3);
        await apiHelper.createKnowledgeArticle(articleData4);
        await apiHelper.createKnowledgeArticle(articleData5);
        await apiHelper.createKnowledgeArticle(articleData6);

        await navigationPage.gotoQuickCase();
        await quickCasePo.selectRequesterName("fritz");
        await quickCasePo.setCaseSummary(knowledgeTitile);
        await utilCommon.waitUntilSpinnerToHide();
        await resources.clickOnAdvancedSearchOptions(RecommendedKnowledgeStr);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        expect(await quickCasePo.isFilterAvailable('Status')).toBeTruthy();
        expect(await quickCasePo.isFilterAvailable('Knowledge Set')).toBeTruthy();
        expect(await quickCasePo.isFilterAvailable('Site')).toBeTruthy();
        expect(await quickCasePo.isFilterAvailable('Region')).toBeTruthy();
        expect(await quickCasePo.isFilterAvailable('Operational Category Tier 1')).toBeTruthy();
        let statusFieldValues: string[] = ["Closed", "Retired", "Canceled", "In Progress", "Draft", "SME Review", "Published", "Publish Approval", "Retire Approval", "Cancel Approval"];
        expect(await resources.isAdvancedSearchFilterOptionDropDownValueDisplayed('Status', statusFieldValues)).toBeTruthy();
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption('Status', 'In Progress');
        await resources.selectAdvancedSearchFilterOption('Knowledge Set', 'HR');
        await resources.selectAdvancedSearchFilterOption('Operational Category Tier 1', 'Applications');
        await resources.selectAdvancedSearchFilterOption('Region', 'Australia');
        await resources.selectAdvancedSearchFilterOption('Site', 'Canberra');
        await resources.clickOnAdvancedSearchFiltersButton('Apply');
        let getCurrentDate = utilCommon.getCurrentDate();
        let currentDate = new Date();
        let dateFormate = currentDate.getDate() + ", " + currentDate.getFullYear();
        expect(await quickCasePo.getKnowledgeArticleInfo(1)).toContain(knowledgeTitile, 'title not correct');
        expect(await quickCasePo.getKnowledgeArticleInfo(1)).toContain('Fritz Schulz', 'Author not correct');
        expect(await quickCasePo.getKnowledgeArticleInfo(1)).toContain('In Progress', 'status not correct');
        expect(await quickCasePo.getKnowledgeArticleInfo(1)).toContain('KA-', 'KA ID not correct');
        expect(await quickCasePo.getKnowledgeArticleInfo(1)).toContain(dateFormate, 'KA ID not correct');
        await quickCasePo.clickArrowFirstRecommendedKnowledge();
        expect(await previewKnowledgePo.getKnowledgeArticleTitle()).toContain(knowledgeTitile, 'title not correct');
        expect(await previewKnowledgePo.isBackButtonDisplay()).toBeTruthy('back button not present');
        expect(await previewKnowledgePo.isViewArticleLInkDisplay()).toBeTruthy('viewArticle link Not peresent');
        expect(await previewKnowledgePo.isStatusOfKADisplay()).toBeTruthy('Status not displaying');
        await previewKnowledgePo.clickOnBackButton();
    }, 360 * 1000);

    it('[DRDMV-11700]: Verify  sort on all attachments grid', async () => {
        let summary = 'Adhoc task' + Math.floor(Math.random() * 1000000);
        let activityNoteText = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseSummary = 'DRDMV-11700' + summary;
        await navigationPage.gotoCreateCase();
        await createCasePo.selectRequester('adam');
        await createCasePo.setSummary(caseSummary);
        let fileName: string[] = ['bwfPdf.pdf', 'bwfPdf1.pdf', 'bwfPdf2.pdf', 'bwfPdf3.pdf', 'bwfPdf4.pdf'];
        for (let i: number = 0; i < fileName.length; i++) {
            await editCasePo.addDescriptionAttachment(`../../data/ui/attachment/${fileName[i]}`);
        }
        await createCasePo.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        await activityTabPo.addActivityNote(activityNoteText);
        let fileName1: string[] = ['bwfWord1.rtf', 'bwfWord2.rtf', 'demo.txt', 'bwfJson1.json', 'bwfJson2.json'];
        for (let i: number = 0; i < fileName1.length; i++) {
            await adhoctaskTemplate.addAttachmentInDescription(`../../data/ui/attachment/${fileName1[i]}`);
        }
        await activityTabPo.clickOnPostButton();
        await utilCommon.waitUntilSpinnerToHide();
        await utilCommon.waitUntilSpinnerToHide();
        await viewCasePage.clickAddTaskButton();
        await manageTask.clickAddAdhocTaskButton();
        expect(await adhoctaskTemplate.isAttachmentButtonDisplayed()).toBeTruthy();
        await adhoctaskTemplate.setSummary(summary);
        await adhoctaskTemplate.setDescription("Description");
        expect(await adhoctaskTemplate.isAttachmentButtonEnabled()).toBeTruthy('Attachment button is disabled');
        let fileName2: string[] = ['bwfXsl.xsl', 'bwfXml.xml', 'bwfJson3.json', 'bwfJson4.json', 'bwfJson5.json'];
        for (let i: number = 0; i < fileName2.length; i++) {
            await adhoctaskTemplate.addAttachmentInDescription(`../../data/ui/attachment/${fileName2[i]}`);
        }
        await adhoctaskTemplate.clickOnSaveAdhoctask();
        await manageTask.clickOnCloseButton();
        await utilCommon.waitUntilPopUpDisappear();
        await viewCasePage.clickAttachmentsLink();
        await attachmentBladePage.clickOnColumnHeader('Attachment');
        expect(await attachmentBladePage.isAttachTableColumnSorted('Attachment', true)).toBeTruthy("Attachment Not Sorted Desecnding");
        await attachmentBladePage.clickOnPaginationNextButton();
        await attachmentBladePage.clickOnColumnHeader('Attachment');
        expect(await attachmentBladePage.isAttachTableColumnSorted('Attachment')).toBeTruthy("Attachment Not Sorted Ascending");

        await attachmentBladePage.clickOnColumnHeader('Attached to');
        expect(await attachmentBladePage.isAttachTableColumnSorted('Attached to', true)).toBeTruthy("Attached to Not Sorted Desecnding");
        await attachmentBladePage.clickOnPaginationNextButton();
        await attachmentBladePage.clickOnColumnHeader('Attached to');
        expect(await attachmentBladePage.isAttachTableColumnSorted('Attached to')).toBeTruthy("Attached to Not Sorted Ascending");

        await attachmentBladePage.clickOnColumnHeader('Media type');
        expect(await attachmentBladePage.isAttachTableColumnSorted('Media type', true)).toBeTruthy("Media type Not Sorted Desecnding");
        await attachmentBladePage.clickOnPaginationNextButton();
        await attachmentBladePage.clickOnColumnHeader('Media type');
        expect(await attachmentBladePage.isAttachTableColumnSorted('Media type')).toBeTruthy("Media type Not Sorted Ascending");

        await attachmentBladePage.clickOnColumnHeader('Created date');
        expect(await attachmentBladePage.isAttachTableColumnSorted('Created date', true)).toBeTruthy("Created date Not Sorted Desecnding");
        await attachmentBladePage.clickOnPaginationNextButton();
        await attachmentBladePage.clickOnColumnHeader('Created date');
        expect(await attachmentBladePage.isAttachTableColumnSorted('Created date')).toBeTruthy("Created date Not Sorted Ascending");
    }, 400 * 1000);
})
