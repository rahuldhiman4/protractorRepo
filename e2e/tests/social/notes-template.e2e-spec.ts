import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import * as notesTemplateData from '../../data/ui/Social/notesTemplate.api';
import viewCasePage from "../../pageobject/case/view-case.po";
import addFieldPo from '../../pageobject/common/add-fields-pop.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import createKnowlegePo from '../../pageobject/knowledge/create-knowlege.po';
import previewKnowledgePo from '../../pageobject/knowledge/preview-knowledge.po';
import viewKnowledgeArticlePo from '../../pageobject/knowledge/view-knowledge-article.po';
import consoleNotesTemplate from '../../pageobject/settings/common/console-notestemplate.po';
import createNotesTemplate from '../../pageobject/settings/common/create-notestemplate.po';
import editNotetemplate from '../../pageobject/settings/common/edit-notestemplate.po';
import activityTabPo from '../../pageobject/social/activity-tab.po';
import notesTemplateUsage from '../../pageobject/social/note-template-usage.po';
import editTask from "../../pageobject/task/edit-task.po";
import manageTask from "../../pageobject/task/manage-task-blade.po";
import viewTask from "../../pageobject/task/view-task.po";
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';
import ckeditorOpsPo from '../../pageobject/common/ck-editor/ckeditor-ops.po';
import tablePropertiesPo from '../../pageobject/common/ck-editor/table-properties.po';
import linkPropertiesPo from '../../pageobject/common/ck-editor/link-properties.po';
import ckeditorValidationPo from '../../pageobject/common/ck-editor/ckeditor-validation.po';
import createCasePo from '../../pageobject/case/create-case.po';
import casePreviewPo from '../../pageobject/case/case-preview.po';
import accessTabPo from '../../pageobject/common/access-tab.po';
import changeAssignmentBladePo from '../../pageobject/common/change-assignment-blade.po';
import knowledgeArticlesConsolePo from '../../pageobject/knowledge/knowledge-articles-console.po';
import quickCasePo from '../../pageobject/case/quick-case.po';
import viewTaskPo from '../../pageobject/task/view-task.po';
import personProfilePo from '../../pageobject/common/person-profile.po';
import utilGrid from '../../utils/util.grid';
import consoleNotestemplatePo from '../../pageobject/settings/common/console-notestemplate.po';
import relatedTabPage from '../../pageobject/common/related-person-tab.po';
import addRelatedPopupPage from '../../pageobject/case/add-relation-pop.po';
import { cloneDeep } from 'lodash';
import createAdhocTaskPo from '../../pageobject/task/create-adhoc-task.po';
import activityPage from '../../pageobject/social/activity-tab.po';


let tableRowFieldIndex = 0;
let tableColumnFieldIndex = 1;
let tableWidthFieldIndex = 3;
let tableHeightFieldIndex = 4;
let cellCaption: number = 7;
let cellSummary: number = 8;
let imageUrlFieldIndex = 0;
let imageWidthFieldIndex = 2;
let linkDisplayTextFieldIndex = 0;
let linkUrlFieldIndex = 1;
let linkTargetDropDownIndex = 4;
let boldText = "this is text bold";
let lefAlignText = "this is text left align";
let centerAlignText = "this is text center align";
let rightAlignText = "this is text right align";
let italicText = "this is text italic";
let underLineText = "this is text underline";
let redColorText = "this is text red";
let formatText = "this is text Styles";
let fontText = "this is text Font";
let justifyAlignText = "this is text Justify align";
let strikeThroughText = "this is text strikeThrough";
let imageSource, imageSource1, imageSource2;
let uploadURL = "https://www.google.com/homepage/images/hero-dhp-chrome-win.jpg?mmfb=90bec8294f441f5c41987596ca1b8cff";
let userData,userData1 = undefined;
describe('Notes template', () => {
    beforeAll(async () => {
        const caseModule = 'Case';
        await browser.get(BWF_BASE_URL);
        await loginPage.login("elizabeth");
        // await apiHelper.apiLogin('tadmin');
        // await apiHelper.deleteApprovalMapping(caseModule);
        userData = {
            "firstName": "Petramco",
            "lastName": "SGUser1",
            "userId": "22653User",
            "userPermission": ["Case Business Analyst", "Foundation Read", "Knowledge Coach", "Knowledge Publisher", "Knowledge Contributor", "Knowledge Candidate", "Case Catalog Administrator", "Person Activity Read"]
        }
        // await apiHelper.createNewUser(userData);
        // await apiHelper.associatePersonToCompany(userData.userId, "Petramco");
        // await apiHelper.associatePersonToSupportGroup(userData.userId, "Facilities");
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //ptidke
    fit('[DRDMV-16026]: [Design Time] Verify case Business analyst is able create, edit and delete Knowledge Notes template', async () => {
        let templateName: string = "activityNotesTemplate" + Math.floor(Math.random() * 100000);
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Knowledge Management--Notes Template', 'Activity Notes Template Console - Knowledge - Business Workflows');
        await consoleNotesTemplate.clickOnCreateNotesTemplate();
        await createNotesTemplate.setTemplateName(templateName);
        await createNotesTemplate.setStatusValue('Active');
        await createNotesTemplate.setCompanyValue('- Global -');
        await createNotesTemplate.setLanguageValue('English (United States)');
        await createNotesTemplate.clickOnInsertFieldLink();
        await addFieldPo.setValueOfField('Knowledge Article', 'Assignee');
        await addFieldPo.clickOnOkButtonOfEditor();
        await createNotesTemplate.setBody("this is new actiivty notes template");
        await createNotesTemplate.clickOnSaveButton();
        await consoleNotesTemplate.searchAndClickOnNotesTemplate(templateName);
        let updateBody: string = "UpdateNotesTemplate" + Math.floor(Math.random() * 100000);
        await editNotetemplate.changeStatusValue('Inactive');
        await editNotetemplate.updateBody(updateBody);
        await editNotetemplate.clickOnSaveButton();
        await consoleNotesTemplate.searchAndClickOnNotesTemplate(templateName);
        expect(await editNotetemplate.getStatusValue()).toContain('Inactive');
        expect(await editNotetemplate.getBodyValue()).toContain(updateBody);
        await editNotetemplate.clickOnCancelButton();
        await utilCommon.clickOnWarningOk();
        await consoleNotesTemplate.searchAndClickNotesTemplateCheckBox(templateName);
        await consoleNotesTemplate.clickOnDeleteButton();
        await utilCommon.clickOnWarningOk();
        expect(await utilCommon.isPopupMsgsMatches(['Record deleted successfully.'])).toBeTruthy('Record deleted successfully. pop up message missing');
    });

    //ptidke
    it('[DRDMV-16010]: [Design Time] Verify that case Business analyst is able create ,edit and delete case Notes template', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Notes Template', 'Activity Notes Template Console - Case - Business Workflows');
        await consoleNotesTemplate.clickOnCreateNotesTemplate();
        let templateName: string = "activityNotesTemplate" + Math.floor(Math.random() * 100000);
        await createNotesTemplate.setTemplateName(templateName);
        await createNotesTemplate.setStatusValue('Active');
        await createNotesTemplate.setCompanyValue('Petramco');
        await createNotesTemplate.setLanguageValue('English (United States)');
        await createNotesTemplate.clickOnInsertFieldLink();
        await addFieldPo.setValueOfField('Case', 'Company');
        await addFieldPo.clickOnOkButtonOfEditor();
        await createNotesTemplate.setBody("this is new actiivty notes template");
        await createNotesTemplate.clickOnSaveButton();
        await consoleNotesTemplate.searchAndClickOnNotesTemplate(templateName);
        let updateBody: string = "UpdateNotesTemplate" + Math.floor(Math.random() * 100000);
        await editNotetemplate.changeStatusValue('Inactive');
        await editNotetemplate.updateBody(updateBody);
        await editNotetemplate.clickOnSaveButton();
        await consoleNotesTemplate.searchAndClickOnNotesTemplate(templateName);
        expect(await editNotetemplate.getStatusValue()).toContain('Inactive');
        expect(await editNotetemplate.getBodyValue()).toContain(updateBody);
        await editNotetemplate.clickOnCancelButton();
        await utilCommon.clickOnWarningOk();
        await consoleNotesTemplate.searchAndClickNotesTemplateCheckBox(templateName);
        await consoleNotesTemplate.clickOnDeleteButton();
        await utilCommon.clickOnWarningOk();
        expect(await utilCommon.isPopupMsgsMatches(['Record deleted successfully.'])).toBeTruthy('Record deleted successfully. pop up message missing');
    });

    //ptidke
    it('[DRDMV-16028]: [Design Time] Verify case Business analyst is able create ,edit and delete People Notes template', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('People--Notes Template', 'Activity Notes Template Console - Person - Business Workflows');
        await consoleNotesTemplate.clickOnCreateNotesTemplate();
        let templateName: string = "activityNotesTemplate" + Math.floor(Math.random() * 100000);
        await createNotesTemplate.setTemplateName(templateName);
        await createNotesTemplate.setStatusValue('Active');
        await createNotesTemplate.setCompanyValue('Petramco');
        await createNotesTemplate.setLanguageValue('English (United States)');
        await createNotesTemplate.clickOnInsertFieldLink();
        await addFieldPo.setValueOfField('Person', 'Agent');
        await addFieldPo.clickOnOkButtonOfEditor();
        await createNotesTemplate.setBody("this is new actiivty notes template");
        await createNotesTemplate.clickOnSaveButton();
        await consoleNotesTemplate.searchAndClickOnNotesTemplate(templateName);
        let updateBody: string = "UpdateNotesTemplate" + Math.floor(Math.random() * 100000);
        await editNotetemplate.changeStatusValue('Inactive');
        await editNotetemplate.updateBody(updateBody);
        await editNotetemplate.clickOnSaveButton();
        await consoleNotesTemplate.searchAndClickOnNotesTemplate(templateName);
        expect(await editNotetemplate.getStatusValue()).toContain('Inactive');
        expect(await editNotetemplate.getBodyValue()).toContain(updateBody);
        await editNotetemplate.clickOnCancelButton();
        await utilCommon.clickOnWarningOk();
        await consoleNotesTemplate.searchAndClickNotesTemplateCheckBox(templateName);
        await consoleNotesTemplate.clickOnDeleteButton();
        await utilCommon.clickOnWarningOk();
        expect(await utilCommon.isPopupMsgsMatches(['Record deleted successfully.'])).toBeTruthy('Record deleted successfully. pop up message missing');
    });

    //ptidke
    it('[DRDMV-16027]: [Design Time] Verify case Business analyst is able create, edit and delete Task Notes template', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Notes Template', 'Activity Notes Template Console - Task - Business Workflows');
        await consoleNotesTemplate.clickOnCreateNotesTemplate();
        let templateName: string = "activityNotesTemplate" + Math.floor(Math.random() * 100000);
        await createNotesTemplate.setTemplateName(templateName);
        await createNotesTemplate.setStatusValue('Active');
        await createNotesTemplate.setCompanyValue('- Global -');
        await createNotesTemplate.setLanguageValue('English (United States)');
        await createNotesTemplate.clickOnInsertFieldLink();
        await addFieldPo.setValueOfField('Task', 'Assignee');
        await addFieldPo.clickOnOkButtonOfEditor();
        await createNotesTemplate.setBody("this is new actiivty notes template");
        await createNotesTemplate.clickOnSaveButton();
        await consoleNotesTemplate.searchAndClickOnNotesTemplate(templateName);
        let updateBody: string = "UpdateNotesTemplate" + Math.floor(Math.random() * 100000);
        await editNotetemplate.changeStatusValue('Inactive');
        await editNotetemplate.updateBody(updateBody);
        await editNotetemplate.clickOnSaveButton();
        await consoleNotesTemplate.searchAndClickOnNotesTemplate(templateName);
        expect(await editNotetemplate.getStatusValue()).toContain('Inactive');
        expect(await editNotetemplate.getBodyValue()).toContain(updateBody);
        await editNotetemplate.clickOnCancelButton();
        await utilCommon.clickOnWarningOk();
        await consoleNotesTemplate.searchAndClickNotesTemplateCheckBox(templateName);
        await consoleNotesTemplate.clickOnDeleteButton();
        await utilCommon.clickOnWarningOk();
        expect(await utilCommon.isPopupMsgsMatches(['Record deleted successfully.'])).toBeTruthy('Record deleted successfully. pop up message missing');
    });

    //ptidke
    it('[DRDMV-16181]: [Design Time] Knowledge user is able to create, edit and Delete Knowledge Notes Template', async () => {
        try {
            await navigationPage.signOut();
            await loginPage.login("khardison");
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Notes Template', 'Activity Notes Template Console - Knowledge - Business Workflows');
            await consoleNotesTemplate.clickOnCreateNotesTemplate();
            let templateName: string = "activityNotesTemplate" + Math.floor(Math.random() * 100000);
            await createNotesTemplate.setTemplateName(templateName);
            await createNotesTemplate.setStatusValue('Active');
            await createNotesTemplate.setCompanyValue('Petramco');
            await createNotesTemplate.setLanguageValue('English (United States)');
            await createNotesTemplate.clickOnInsertFieldLink();
            await addFieldPo.setValueOfField('Knowledge Article', 'Assignee');
            await addFieldPo.clickOnOkButtonOfEditor();
            await createNotesTemplate.setBody("this is new actiivty notes template");
            await createNotesTemplate.clickOnSaveButton();
            await consoleNotesTemplate.searchAndClickOnNotesTemplate(templateName);
            let updateBody: string = "UpdateNotesTemplate" + Math.floor(Math.random() * 100000);
            await editNotetemplate.changeStatusValue('Inactive');
            await editNotetemplate.updateBody(updateBody);
            await editNotetemplate.clickOnSaveButton();
            await consoleNotesTemplate.searchAndClickOnNotesTemplate(templateName);
            expect(await editNotetemplate.getStatusValue()).toContain('Inactive');
            expect(await editNotetemplate.getBodyValue()).toContain(updateBody);
            await editNotetemplate.clickOnCancelButton();
            await utilCommon.clickOnWarningOk();
            await consoleNotesTemplate.searchAndClickNotesTemplateCheckBox(templateName);
            await consoleNotesTemplate.clickOnDeleteButton();
            await utilCommon.clickOnWarningOk();
            expect(await utilCommon.isPopupMsgsMatches(['Record deleted successfully.'])).toBeTruthy('Record deleted successfully. pop up message missing');
        }
        catch (e) {
            throw e;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login("elizabeth");
        }
    });

    //ptidke
    it('[DRDMV-15999]: [DesignTime] Verify Notes templates UI should be displayed as per prototype(mockups)', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Notes Template', 'Activity Notes Template Console - Case - Business Workflows');
        expect(await consoleNotesTemplate.isNotesTemplateUIConsolePresent()).toBeTruthy();
        await consoleNotesTemplate.clickOnCreateNotesTemplate();
        expect(await createNotesTemplate.isSaveButtonDisabled()).toBeFalsy();
        expect(await createNotesTemplate.isCreateNotesTemplateUIPresent()).toBeTruthy();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('People--Notes Template', 'Activity Notes Template Console - Person - Business Workflows');
        expect(await consoleNotesTemplate.isNotesTemplateUIConsolePresent()).toBeTruthy();
        await consoleNotesTemplate.clickOnCreateNotesTemplate();
        expect(await createNotesTemplate.isSaveButtonDisabled()).toBeFalsy();
        expect(await createNotesTemplate.isCreateNotesTemplateUIPresent()).toBeTruthy();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Notes Template', 'Activity Notes Template Console - Task - Business Workflows');
        expect(await consoleNotesTemplate.isNotesTemplateUIConsolePresent()).toBeTruthy();
        await consoleNotesTemplate.clickOnCreateNotesTemplate();
        expect(await createNotesTemplate.isSaveButtonDisabled()).toBeFalsy();
        expect(await createNotesTemplate.isCreateNotesTemplateUIPresent()).toBeTruthy();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Knowledge Management--Notes Template', 'Activity Notes Template Console - Knowledge - Business Workflows');
        expect(await consoleNotesTemplate.isNotesTemplateUIConsolePresent()).toBeTruthy();
        await consoleNotesTemplate.clickOnCreateNotesTemplate();
        expect(await createNotesTemplate.isSaveButtonDisabled()).toBeFalsy();
        expect(await createNotesTemplate.isCreateNotesTemplateUIPresent()).toBeTruthy();
    });

    //ptidke
    describe('[DRDMV-16111]: [Design Time] Verify warning Message for locale values', async () => {
        it('Case and People Notes template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Notes Template', 'Activity Notes Template Console - Case - Business Workflows');
            let caseNotesTemplate1 = await createNotesTemplate.createNotesTemplate('Petramco');
            await consoleNotesTemplate.searchAndClickOnNotesTemplate(caseNotesTemplate1);
            await editNotetemplate.changeLanguageValue('Italian (Italy)');
            expect(await editNotetemplate.getLocaleNotPresentMessage()).toContain('Please add the required localized message.');
            await editNotetemplate.clickOnCancelButton();
            await utilCommon.clickOnWarningOk();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('People--Notes Template', 'Activity Notes Template Console - Person - Business Workflows');
            let caseNotesTemplate2 = await createNotesTemplate.createNotesTemplate('Petramco');
            await consoleNotesTemplate.searchAndClickOnNotesTemplate(caseNotesTemplate2);
            await editNotetemplate.changeLanguageValue('Italian (Italy)');
            expect(await editNotetemplate.getLocaleNotPresentMessage()).toContain('Please add the required localized message.')
            await editNotetemplate.clickOnCancelButton();
            await utilCommon.clickOnWarningOk();
        });
        it('[DRDMV-16111]: [Design Time] Verify warning Message for locale values if template message is not configured against that locale value', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Notes Template', 'Activity Notes Template Console - Task - Business Workflows');
            let caseNotesTemplate3 = await createNotesTemplate.createNotesTemplate('Petramco');
            await consoleNotesTemplate.searchAndClickOnNotesTemplate(caseNotesTemplate3);
            await editNotetemplate.changeLanguageValue('Italian (Italy)');
            expect(await editNotetemplate.getLocaleNotPresentMessage()).toContain('Please add the required localized message.');
            await editNotetemplate.clickOnCancelButton();
            await utilCommon.clickOnWarningOk();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Notes Template', 'Activity Notes Template Console - Knowledge - Business Workflows');
            let caseNotesTemplate4 = await createNotesTemplate.createNotesTemplate('Petramco');
            await consoleNotesTemplate.searchAndClickOnNotesTemplate(caseNotesTemplate4);
            await editNotetemplate.changeLanguageValue('Italian (Italy)');
            expect(await editNotetemplate.getLocaleNotPresentMessage()).toContain('Please add the required localized message.');
            await editNotetemplate.clickOnCancelButton();
            await utilCommon.clickOnWarningOk();
        });
    });

    //ptidke
    it('[DRDMV-16040]: [Run Time] Verify that case BA is able to consume more than one Enabled case notes templates on case (one at a time can post)', async () => {
        //task template 1
        await apiHelper.apiLogin('tadmin');
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let tempNotesTemplateData1 = cloneDeep(notesTemplateData.NOTES_TEMPLATE_MANDATORY_FIELD);
        let notesTemplateName: string = tempNotesTemplateData1.templateName + randomStr;
        let notesTemplateBody: string = tempNotesTemplateData1.body + randomStr;
        tempNotesTemplateData1.body = notesTemplateBody;
        tempNotesTemplateData1.templateName = notesTemplateName;
        await apiHelper.createNotesTemplate("Case", tempNotesTemplateData1);
        //task template 2
        let randomStr1 = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let tempNotesTemplateData2 = cloneDeep(notesTemplateData.NOTES_TEMPLATE_MANDATORY_FIELD);
        let notesTemplateName1: string = tempNotesTemplateData2.templateName + randomStr1;
        let notesTemplateBody1: string = tempNotesTemplateData2.body + randomStr1;
        tempNotesTemplateData2.body = notesTemplateBody1;
        tempNotesTemplateData2.templateName = notesTemplateName1;
        await apiHelper.createNotesTemplate("Case", tempNotesTemplateData2);
        //task template 3
        let randomStr2 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let tempNotesTemplateData3 = cloneDeep(notesTemplateData.NOTES_TEMPLATE_MANDATORY_FIELD);
        let notesTemplateName2: string = tempNotesTemplateData3.templateName + randomStr2;
        let notesTemplateBody2: string = tempNotesTemplateData3.body + randomStr2;
        tempNotesTemplateData3.body = notesTemplateBody2;
        tempNotesTemplateData3.templateName = notesTemplateName2;
        await apiHelper.createNotesTemplate("Case", tempNotesTemplateData3);
        //task template 4
        let randomStr3 = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let tempNotesTemplateData4 = cloneDeep(notesTemplateData.NOTES_TEMPLATE_MANDATORY_FIELD);
        let notesTemplateName3: string = tempNotesTemplateData4.templateName + randomStr3;
        let notesTemplateBody3: string = tempNotesTemplateData4.body + randomStr3;
        tempNotesTemplateData4.body = notesTemplateBody3;
        tempNotesTemplateData4.templateName = notesTemplateName3;
        await apiHelper.createNotesTemplate("Case", tempNotesTemplateData4);
        let caseData = {
            "Requester": "qkatawazi",
            "Summary": "DRDMV-16040 Summary",
            "Assigned Company": "Petramco",
            "Business Unit": "HR Support",
            "Support Group": "Compensation and Benefits"
        };
        await apiHelper.apiLogin('qtao');
        let newCase = await apiHelper.createCase(caseData);
        await navigationPage.gotoCaseConsole();
        await utilityGrid.clearFilter();
        await utilityGrid.searchAndOpenHyperlink(newCase.displayId);
        await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(notesTemplateName);
        await activityTabPo.clickOnPostButton();
        expect(await activityTabPo.isTextPresentInNote(notesTemplateBody)).toBeTruthy();
        await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(notesTemplateName1);
        await activityTabPo.clickOnPostButton();
        expect(await activityTabPo.isTextPresentInNote(notesTemplateBody1)).toBeTruthy();
        await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(notesTemplateName2);
        await activityTabPo.clickOnPostButton();
        expect(await activityTabPo.isTextPresentInNote(notesTemplateBody2)).toBeTruthy();
        await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(notesTemplateName3);
        await activityTabPo.clickOnPostButton();
        expect(await activityTabPo.isTextPresentInNote(notesTemplateBody3)).toBeTruthy();
    });

    //ptidke
    describe('[DRDMV-16578]: Consume People Notes Template in People profile', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let newCase1, newCase2;
        let tempNotesTemplateData = cloneDeep(notesTemplateData.NOTES_TEMPLATE_MANDATORY_FIELD);
        beforeAll(async () => {
            tempNotesTemplateData.templateName = tempNotesTemplateData.templateName + randomStr;
            tempNotesTemplateData.body = tempNotesTemplateData.body + randomStr;
            let caseData1 = {
                "Requester": "qdu",
                "Summary": "Testing case creation with minimal input data"
            };
            let caseData2 = {
                "Requester": "qtao",
                "Summary": "Testing case creation with minimal input data"
            };
            // create People notes template
            await apiHelper.apiLogin('elizabeth');
            await apiHelper.createNotesTemplate("People", tempNotesTemplateData);
            // create case1 & case2
            await apiHelper.apiLogin('franz');
            newCase1 = await apiHelper.createCase(caseData1);
            await apiHelper.apiLogin('qdu');
            newCase2 = await apiHelper.createCase(caseData2);
        });
        it('[DRDMV-16578]: Case Agent consume People Notes Template in People profile', async () => {
            await navigationPage.signOut();
            await loginPage.login('franz');
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(newCase1.displayId);
            await viewCasePage.clickRequsterName();
            await utilityCommon.switchToNewTab(1);
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(tempNotesTemplateData.templateName);
            await activityTabPo.clickOnPostButton();
            expect(await activityTabPo.isTextPresentInActivityLog(tempNotesTemplateData.body)).toBeTruthy();
        });
        it('[DRDMV-16578]: Case Agent/Case Manger Should be able to consume People Notes Template in People profile', async () => {
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(newCase2.displayId);
            await viewCasePage.clickRequsterName();
            await utilityCommon.switchToNewTab(1);
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(tempNotesTemplateData.templateName);
            await activityTabPo.clickOnPostButton();
            expect(await activityTabPo.isTextPresentInActivityLog(tempNotesTemplateData.body)).toBeTruthy();
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        });
    });

    //ptidke
    describe('[DRDMV-16045]: [Run Time] Verify case BA is able to select and utilize Active Task notes templates in Activity for Manual Task', async () => {
        let randomStr: string = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let tempNotesTemplateData, templateManualData, templateManualData1, templateAutomatedData, templateAutomatedData1, templateExternalData, caseResponse1, caseResponse2, caseData, adhocTaskData, notesTemplateGlobalData, notesTemplatePsilonlData, templateExternalData1, caseData1;
        beforeAll(async () => {

            // create task notes template
            tempNotesTemplateData = cloneDeep(notesTemplateData.NOTES_TEMPLATE_MANDATORY_FIELD);
            tempNotesTemplateData.templateName = tempNotesTemplateData.templateName + randomStr + '123';
            tempNotesTemplateData.body = tempNotesTemplateData.body + randomStr + '123';
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createNotesTemplate("Task", tempNotesTemplateData);


            //Creating Global task notes Template
            notesTemplateGlobalData = cloneDeep(notesTemplateData.NOTES_TEMPLATE_MANDATORY_FIELD_GLOBAL);
            notesTemplateGlobalData.templateName = notesTemplateGlobalData.templateName + randomStr + '456';
            notesTemplateGlobalData.body = notesTemplateGlobalData.body + randomStr + '456';
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createNotesTemplate("Task", notesTemplateGlobalData);

            //Creating Global task notes Template
            notesTemplatePsilonlData = cloneDeep(notesTemplateData.NOTES_TEMPLATE_PSILON);
            notesTemplatePsilonlData.templateName = notesTemplatePsilonlData.templateName + randomStr + '789';
            notesTemplatePsilonlData.body = notesTemplatePsilonlData.body + randomStr + '789';
            await apiHelper.apiLogin('gderuno');
            await apiHelper.createNotesTemplate("Task", notesTemplatePsilonlData);

            await apiHelper.apiLogin('fritz');

            // create manual task template
            templateManualData = {
                "templateName": 'ManualTask' + randomStr,
                "templateSummary": 'Manualtask Summary' + randomStr,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
            }
            await apiHelper.createManualTaskTemplate(templateManualData);

            templateManualData1 = {
                "templateName": 'ManualTask1' + randomStr,
                "templateSummary": 'Manualtask Summary1' + randomStr,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities",
            }
            await apiHelper.createManualTaskTemplate(templateManualData1);

            // create Automated task template
            templateAutomatedData = {
                "templateName": 'AutomatedTask' + randomStr,
                "templateSummary": 'AutomatedTask Summary' + randomStr,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": 'Auto Proces' + randomStr,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
            }
            await apiHelper.createAutomatedTaskTemplate(templateAutomatedData);

            templateAutomatedData1 = {
                "templateName": 'AutomatedTask1' + randomStr,
                "templateSummary": 'AutomatedTask Summary1' + randomStr,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": 'Auto Process1' + randomStr,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities",
            }
            await apiHelper.createAutomatedTaskTemplate(templateAutomatedData1);

            // create External task template
            templateExternalData = {
                "templateName": 'ExternalTask' + randomStr,
                "templateSummary": 'ExternalTask Summary' + randomStr,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
            }
            await apiHelper.createExternalTaskTemplate(templateExternalData);

            templateExternalData1 = {
                "templateName": 'ExternalTask1' + randomStr,
                "templateSummary": 'ExternalTask Summary1' + randomStr,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities",
            }
            await apiHelper.createExternalTaskTemplate(templateExternalData1);


            caseData = {
                "Requester": "qtao",
                "Company": "Petramco",
                "Summary": "Create case for me postman1",
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
            }
            caseResponse1 = await apiHelper.createCase(caseData);

            caseData1 = {
                "Requester": "qtao",
                "Company": "Petramco",
                "Summary": "Create case for me postman1",
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
            }
            caseResponse2 = await apiHelper.createCase(caseData1);

            const automatedTaskData = {
                "company": "Petramco",
                "requesterId": "qtao",
                "templateName": templateAutomatedData.templateName
            }
            await apiHelper.addTaskToCase(automatedTaskData, caseResponse1.id);


            const manualTaskData = {
                "company": "Petramco",
                "requesterId": "qtao",
                "templateName": templateManualData.templateName
            }
            await apiHelper.addTaskToCase(manualTaskData, caseResponse1.id);

            const externalTaskData = {
                "company": "Petramco",
                "requesterId": "qtao",
                "templateName": templateExternalData.templateName
            }

            await apiHelper.addTaskToCase(externalTaskData, caseResponse1.id);

            const automatedTaskData1 = {
                "company": "Petramco",
                "requesterId": "qtao",
                "templateName": templateAutomatedData1.templateName
            }
            await apiHelper.addTaskToCase(automatedTaskData1, caseResponse2.id);


            const manualTaskData1 = {
                "company": "Petramco",
                "requesterId": "qtao",
                "templateName": templateManualData1.templateName
            }
            await apiHelper.addTaskToCase(manualTaskData1, caseResponse2.id);


            const externalTaskData1 = {
                "company": "Petramco",
                "requesterId": "qtao",
                "templateName": templateExternalData1.templateName
            }
            await apiHelper.addTaskToCase(externalTaskData1, caseResponse2.id);

            await apiHelper.updateCaseStatus(caseResponse1.id, 'InProgress');


        });

        it('[DRDMV-16045]: [Run Time] Verify case BA is able to select and utilize Active Task notes templates in Activity for Manual Task', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(caseResponse2.displayId);
            await viewCasePage.openTaskCard(1);
            await manageTask.clickTaskLink(templateManualData1.templateSummary);
            await activityTabPo.clickActivityNoteTextBox();
            await activityTabPo.clickOnNotesTemplate();
            expect(await notesTemplateUsage.isTemplatePresent(tempNotesTemplateData.templateName)).toBeFalsy(); // Notes Template of Petramco not visible
            expect(await notesTemplateUsage.isTemplatePresent(notesTemplateGlobalData.templateName)).toBeTruthy();
            expect(await notesTemplateUsage.isTemplatePresent(notesTemplatePsilonlData.templateName)).toBeFalsy();//Notes Template of Psilon not visible
            await notesTemplateUsage.clickOnCancelBtn();
            await activityTabPo.clickOnCancelButton();

            await viewTaskPo.clickOnViewCase();
            await viewCasePage.openTaskCard(1);
            await manageTask.clickTaskLink(templateExternalData1.templateSummary);
            await activityTabPo.clickActivityNoteTextBox();
            await activityTabPo.clickOnNotesTemplate();
            expect(await notesTemplateUsage.isTemplatePresent(tempNotesTemplateData.templateName)).toBeFalsy(); // Notes Template of Petramco not visible
            expect(await notesTemplateUsage.isTemplatePresent(notesTemplateGlobalData.templateName)).toBeTruthy();
            expect(await notesTemplateUsage.isTemplatePresent(notesTemplatePsilonlData.templateName)).toBeFalsy();//Notes Template of Psilon not visible
            await notesTemplateUsage.clickOnCancelBtn();
            await activityTabPo.clickOnCancelButton();

            await viewTaskPo.clickOnViewCase();
            await viewCasePage.openTaskCard(1);
            await manageTask.clickTaskLink(templateAutomatedData1.templateSummary);
            await activityTabPo.clickActivityNoteTextBox();
            await activityTabPo.clickOnNotesTemplate();
            expect(await notesTemplateUsage.isTemplatePresent(tempNotesTemplateData.templateName)).toBeFalsy(); // Notes Template of Petramco not visible
            expect(await notesTemplateUsage.isTemplatePresent(notesTemplateGlobalData.templateName)).toBeTruthy();
            expect(await notesTemplateUsage.isTemplatePresent(notesTemplatePsilonlData.templateName)).toBeFalsy();//Notes Template of Psilon not visible
            await notesTemplateUsage.clickOnCancelBtn();
            await activityTabPo.clickOnCancelButton();

            await apiHelper.updateCaseStatus(caseResponse2.id, 'InProgress');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseResponse2.displayId);
            await viewCasePage.openTaskCard(1);
            await manageTask.clickTaskLink(templateManualData1.templateSummary);
            await activityTabPo.clickActivityNoteTextBox();
            await activityTabPo.clickOnNotesTemplate();
            expect(await notesTemplateUsage.isTemplatePresent(tempNotesTemplateData.templateName)).toBeTruthy(); // Notes Template of Petramco not visible
            expect(await notesTemplateUsage.isTemplatePresent(notesTemplateGlobalData.templateName)).toBeTruthy();
            expect(await notesTemplateUsage.isTemplatePresent(notesTemplatePsilonlData.templateName)).toBeFalsy();
            await notesTemplateUsage.clickOnCancelBtn();
            await activityTabPo.clickOnCancelButton();

            await viewTaskPo.clickOnViewCase();
            await viewCasePage.openTaskCard(1);
            await manageTask.clickTaskLink(templateAutomatedData1.templateSummary);
            await activityTabPo.clickActivityNoteTextBox();
            await activityTabPo.clickOnNotesTemplate();
            expect(await notesTemplateUsage.isTemplatePresent(tempNotesTemplateData.templateName)).toBeTruthy(); // Notes Template of Petramco not visible
            expect(await notesTemplateUsage.isTemplatePresent(notesTemplateGlobalData.templateName)).toBeTruthy();
            expect(await notesTemplateUsage.isTemplatePresent(notesTemplatePsilonlData.templateName)).toBeFalsy();//Notes Template of Psilon not visible
            await notesTemplateUsage.clickOnCancelBtn();
            await activityTabPo.clickOnCancelButton();

            await viewTaskPo.clickOnViewCase();
            await viewCasePage.openTaskCard(1);
            await manageTask.clickTaskLink(templateExternalData1.templateSummary);
            await activityTabPo.clickActivityNoteTextBox();
            await activityTabPo.clickOnNotesTemplate();
            expect(await notesTemplateUsage.isTemplatePresent(tempNotesTemplateData.templateName)).toBeFalsy(); // Notes Template of Petramco not visible
            expect(await notesTemplateUsage.isTemplatePresent(notesTemplateGlobalData.templateName)).toBeTruthy();
            expect(await notesTemplateUsage.isTemplatePresent(notesTemplatePsilonlData.templateName)).toBeFalsy();//Notes Template of Psilon not visible
            await notesTemplateUsage.clickOnCancelBtn();
            await activityTabPo.clickOnCancelButton();

        });

        it('[DRDMV-16045]: [Run Time] Verify case BA is able to select and utilize Active Task notes templates in Activity for Manual Task', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseResponse1.displayId);
            await viewCasePage.openTaskCard(1);
            await manageTask.clickTaskLink(templateManualData.templateSummary);
            await activityTabPo.clickActivityNoteTextBox();
            await activityTabPo.clickOnNotesTemplate();
            expect(await notesTemplateUsage.isTemplatePresent(tempNotesTemplateData.templateName)).toBeTruthy();
            expect(await notesTemplateUsage.isTemplatePresent(notesTemplateGlobalData.templateName)).toBeTruthy();
            expect(await notesTemplateUsage.isTemplatePresent(notesTemplatePsilonlData.templateName)).toBeFalsy();
            await notesTemplateUsage.clickOnCancelBtn();
            await activityTabPo.clickOnCancelButton();
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(tempNotesTemplateData.templateName);// notes template not shown
            await activityTabPo.addActivityNote('ManualTemplateData');
            await activityTabPo.clickOnPostButton();
            expect(await activityTabPo.isTextPresentInActivityLog('ManualTemplateData'+tempNotesTemplateData.body)).toBeTruthy();


            await viewTaskPo.clickOnViewCase();
            await viewCasePage.openTaskCard(1);
            await manageTask.clickTaskLink(templateAutomatedData.templateSummary);
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(tempNotesTemplateData.templateName);// notes template not shown
            await activityTabPo.addActivityNote('AutomatedTemplateData');
            await activityTabPo.clickOnPostButton();
            expect(await activityTabPo.isTextPresentInActivityLog('AutomatedTemplateData'+tempNotesTemplateData.body)).toBeTruthy();

            await viewTaskPo.clickOnViewCase();
            await viewCasePage.openTaskCard(1);
            await manageTask.clickTaskLink(templateExternalData.templateSummary);
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(tempNotesTemplateData.templateName);// notes template not shown
            await activityTabPo.addActivityNote('ExternalTemplateData');
            await activityTabPo.clickOnPostButton();
            expect(await activityTabPo.isTextPresentInActivityLog('ExternalTemplateData'+tempNotesTemplateData.body)).toBeTruthy();
        });
        it('[DRDMV-16045]: [Run Time] Verify case BA is able to select and utilize Active Task notes templates in Activity for Manual Task', async () => {
            await viewTaskPo.clickOnViewCase();
            await viewCasePage.clickAddTaskButton();
            await manageTask.clickAddAdhocTaskButton();
            await createAdhocTaskPo.setSummary('AdhocTask_DRDMV_16045');
            await createAdhocTaskPo.setDescription("Description");
            await createAdhocTaskPo.selectPriority('Low');
            await createAdhocTaskPo.clickSaveAdhoctask();
            await utilityCommon.closePopUpMessage();
            await utilityCommon.closeAllBlades();
            await viewCasePage.openTaskCard(1);
            await manageTask.clickTaskLink('AdhocTask_DRDMV_16045');
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(tempNotesTemplateData.templateName);// notes template not shown
            await activityTabPo.addActivityNote('AdhocTemplateData');
            await activityTabPo.clickOnPostButton();
            expect(await activityTabPo.isTextPresentInActivityLog('AdhocTemplateData' + tempNotesTemplateData.body)).toBeTruthy();
        });
        it('[DRDMV-16045]: [Run Time] Verify case BA is able to select and utilize Active Task notes templates in Activity for Manual Task', async () => {
            await navigationPage.gotoPersonProfile();
            expect(await activityTabPo.isTextPresentInActivityLog('AdhocTemplateData' + tempNotesTemplateData.body)).toBeTruthy();
            expect(await activityTabPo.isTextPresentInActivityLog('AutomatedTemplateData' + tempNotesTemplateData.body)).toBeTruthy();
            expect(await activityTabPo.isTextPresentInActivityLog('ManualTemplateData' + tempNotesTemplateData.body)).toBeTruthy();
            expect(await activityTabPo.isTextPresentInActivityLog('ExternalTemplateData' + tempNotesTemplateData.body)).toBeTruthy();
        });
            afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        });
    });

    //ptidke
    it('[DRDMV-16047]: [Run Time] Validate that case BA is able to select and utilize Active Knowledge notes templates in Knowledge Article ', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let tempNotesTemplateData = cloneDeep(notesTemplateData.NOTES_TEMPLATE_MANDATORY_FIELD);
        tempNotesTemplateData.templateName = tempNotesTemplateData.templateName + randomStr;
        tempNotesTemplateData.body = tempNotesTemplateData.body + randomStr;
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createNotesTemplate("Knowledge", tempNotesTemplateData);
        //create Knowledge
        await navigationPage.gotoCreateKnowledge();
        expect(await browser.getTitle()).toBe('Knowledge Article Templates Preview - Business Workflows');
        await createKnowlegePo.clickOnTemplate('Reference');
        await createKnowlegePo.clickOnUseSelectedTemplateButton();
        await createKnowlegePo.addTextInKnowlegeTitleField('test case for DRDMV-16754');
        await createKnowlegePo.selectKnowledgeSet('HR');
        await createKnowlegePo.clickOnSaveKnowledgeButton();
        await previewKnowledgePo.clickGoToArticleButton();

        // View Knowledege Page
        await utilityCommon.closePopUpMessage();
        await viewKnowledgeArticlePo.clickOnTab('Activity');
        await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(tempNotesTemplateData.templateName);
        await activityTabPo.clickOnPostButton();
        expect(await activityTabPo.isTextPresentInActivityLog(tempNotesTemplateData.body)).toBeTruthy();
    });

    //asahitya
    it('[DRDMV-16008]: [DesignTime] Verify "Case Notes templates", grid operation searching , sorting columns and filter on company', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        //Creating Petramco Template
        let notesTemplatePetramcoData = cloneDeep(notesTemplateData.NOTES_TEMPLATE_MANDATORY_FIELD);
        notesTemplatePetramcoData.templateName = notesTemplatePetramcoData.templateName + randomStr + '123';
        notesTemplatePetramcoData.body = notesTemplatePetramcoData.body + randomStr + '123';
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createNotesTemplate("Case", notesTemplatePetramcoData);

        //Creating Global Template
        let notesTemplateGlobalData = cloneDeep(notesTemplateData.NOTES_TEMPLATE_MANDATORY_FIELD_GLOBAL);
        notesTemplateGlobalData.templateName = notesTemplateGlobalData.templateName + randomStr + '456';
        notesTemplateGlobalData.body = notesTemplateGlobalData.body + randomStr + '456';
        await apiHelper.createNotesTemplate("Case", notesTemplateGlobalData);

        //Creating Inactive Template
        let notesTemplateInactiveData = cloneDeep(notesTemplateData.NOTES_TEMPLATE_CASE_INACTIVE);
        notesTemplateInactiveData.templateName = notesTemplateInactiveData.templateName + randomStr + '789';
        await apiHelper.createNotesTemplate("Case", notesTemplateInactiveData);

        let menuItemData = {
            "menuItemName": "TestMenuItemName" + randomStr,
            "menuItemStatus": "Active",
            "menuType": "Label"
        }
        await apiHelper.createNewMenuItem(menuItemData);

        let notesTemplateWithLabelData = {
            "templateName": "Notes template with label",
            "company": "Petramco",
            "templateStatus": 2,
            "body": "this is template description",
            "label": "TestMenuItemName"
        }

        //Creating Template with Label
        notesTemplateWithLabelData.templateName = notesTemplateWithLabelData.templateName + randomStr;
        notesTemplateWithLabelData.label = notesTemplateWithLabelData.label + randomStr;
        await apiHelper.createNotesTemplate("Case", notesTemplateWithLabelData);

        try {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Notes Template', 'Activity Notes Template Console - Case - Business Workflows');
            await utilGrid.clearFilter();
            await consoleNotestemplatePo.addColumns(['Label', 'ID']);
            await utilGrid.searchOnGridConsole(notesTemplateInactiveData.templateName);
            expect(await utilGrid.getNumberOfRecordsInGrid()).toEqual(1);
            let templateGuid = await consoleNotestemplatePo.getGuidValue();
            await utilGrid.clearGridSearchBox();
            expect(await consoleNotestemplatePo.isGridColumnSorted('Template Name')).toBeTruthy('Column is not sorted');
            await utilGrid.clearFilter();
            await utilGrid.addFilter('Company', 'Petramco', 'text');
            expect(await utilGrid.isGridRecordPresent(notesTemplatePetramcoData.templateName)).toBeTruthy('Petramco Company Filter is not applied');
            expect(await utilGrid.isGridRecordPresent(notesTemplateGlobalData.templateName)).toBeFalsy('Petramco Company Filter is not applied');
            await utilGrid.clearFilter();
            await utilGrid.addFilter('Company', '- Global -', 'text');
            expect(await utilGrid.isGridRecordPresent(notesTemplatePetramcoData.templateName)).toBeFalsy('Global Company Filter is not applied');
            expect(await utilGrid.isGridRecordPresent(notesTemplateGlobalData.templateName)).toBeTruthy('Global Company Filter is not applied');
            await utilGrid.clearFilter();
            await utilGrid.addFilter('Status', 'Inactive', 'checkbox');
            expect(await utilGrid.isGridRecordPresent(notesTemplatePetramcoData.templateName)).toBeFalsy('Status Filter is not applied');
            expect(await utilGrid.isGridRecordPresent(notesTemplateInactiveData.templateName)).toBeTruthy('Status Filter is not applied');
            await utilGrid.clearFilter();
            await utilGrid.addFilter('Template Name', notesTemplatePetramcoData.templateName, 'text');
            expect(await utilGrid.isGridRecordPresent(notesTemplatePetramcoData.templateName)).toBeTruthy('Template Name Filter is not applied');
            expect(await utilGrid.isGridRecordPresent(notesTemplateInactiveData.templateName)).toBeFalsy('Template Name Filter is not applied');
            await utilGrid.clearFilter();
            await utilGrid.addFilter('Label', 'TestMenuItemName' + randomStr, 'text');
            expect(await utilGrid.isGridRecordPresent(notesTemplateWithLabelData.templateName)).toBeTruthy('Label Filter is not applied');
            expect(await utilGrid.isGridRecordPresent(notesTemplateInactiveData.templateName)).toBeFalsy('Label Filter is not applied');
            await utilGrid.clearFilter();
            await utilGrid.addFilter('ID', templateGuid, 'text');
            expect(await utilGrid.isGridRecordPresent(notesTemplateInactiveData.templateName)).toBeTruthy('ID Filter is not applied');
            expect(await utilGrid.isGridRecordPresent(notesTemplateWithLabelData.templateName)).toBeFalsy('ID Filter is not applied');
            await consoleNotestemplatePo.removeColumns(['Label', 'ID']);
        }
        catch (ex) { throw ex }
        finally {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        }
    });

    //asahitya
    describe('[DRDMV-16051,DRDMV-16013]: Verify People notes template / Task Note template should not be displayed on case in activity template and vice versa for all other', () => {
        let response1 = undefined;
        let response2 = undefined;
        let response3 = undefined;
        let caseActiveTemplateName: string = undefined;
        let taskActiveTemplateName: string = undefined;
        let peopleActiveTemplateName: string = undefined;
        let knowledgeActiveTemplateName: string = undefined;
        let caseInactiveTemplateName: string = undefined;
        let taskInactiveTemplateName: string = undefined;
        let peopleInactiveTemplateName: string = undefined;
        let knowledgeInactiveTemplateName: string = undefined;

        beforeAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            //Creating Active Case Notes Template
            let activeCaseTemplateData = cloneDeep(notesTemplateData.NOTES_TEMPLATE_MANDATORY_FIELD);
            caseActiveTemplateName = activeCaseTemplateData.templateName + randomStr + 'Case';
            activeCaseTemplateData.templateName = caseActiveTemplateName;
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createNotesTemplate("Case", activeCaseTemplateData);

            //Creating Active Task Notes Template
            let activeTaskTemplateData = cloneDeep(notesTemplateData.NOTES_TEMPLATE_TASK);
            taskActiveTemplateName = activeTaskTemplateData.templateName + randomStr + 'Task';
            activeTaskTemplateData.templateName = taskActiveTemplateName;
            await apiHelper.createNotesTemplate("Task", activeTaskTemplateData);

            //Creating Active Knowledge Notes Template
            let activeKnowledgeTemplateData = cloneDeep(notesTemplateData.NOTES_TEMPLATE_KNOWLEDGE_ARTICLE);
            knowledgeActiveTemplateName = activeKnowledgeTemplateData.templateName + randomStr + 'Article';
            activeKnowledgeTemplateData.templateName = knowledgeActiveTemplateName;
            await apiHelper.createNotesTemplate("Knowledge", activeKnowledgeTemplateData);

            //Creating Active People Notes Template
            let activePeopleTemplateData = cloneDeep(notesTemplateData.NOTES_TEMPLATE_PEOPLE);
            peopleActiveTemplateName = activePeopleTemplateData.templateName + randomStr + 'People';
            activePeopleTemplateData.templateName = peopleActiveTemplateName;
            await apiHelper.createNotesTemplate("People", activePeopleTemplateData);

            //Creating Inactive Case Notes Template
            let inactiveCaseTemplateData = cloneDeep(notesTemplateData.NOTES_TEMPLATE_CASE_INACTIVE);
            caseInactiveTemplateName = inactiveCaseTemplateData.templateName + randomStr + 'Case';
            inactiveCaseTemplateData.templateName = caseInactiveTemplateName;
            await apiHelper.createNotesTemplate("Case", inactiveCaseTemplateData);

            //Creating Inactive Task Notes Template
            let inactiveTaskTemplateData = cloneDeep(notesTemplateData.NOTES_TEMPLATE_TASK_INACTIVE);
            taskInactiveTemplateName = inactiveTaskTemplateData.templateName + randomStr + 'Task';
            inactiveTaskTemplateData.templateName = taskInactiveTemplateName;
            await apiHelper.createNotesTemplate("Task", inactiveTaskTemplateData);

            //Creating Inactive Knowledge Notes Template
            let inactiveKnowledgeTemplateData = cloneDeep(notesTemplateData.NOTES_TEMPLATE_KNOWLEDGE_INACTIVE);
            knowledgeInactiveTemplateName = inactiveKnowledgeTemplateData.templateName + randomStr + 'Article';
            inactiveKnowledgeTemplateData.templateName = knowledgeInactiveTemplateName;
            await apiHelper.createNotesTemplate("Knowledge", inactiveKnowledgeTemplateData);

            //Creating Inactive People Notes Template
            let inactivePeopleTemplateData = cloneDeep(notesTemplateData.NOTES_TEMPLATE_PEOPLE_INACTIVE);
            peopleInactiveTemplateName = inactivePeopleTemplateData.templateName + randomStr + 'People';
            inactivePeopleTemplateData.templateName = peopleInactiveTemplateName;
            await apiHelper.createNotesTemplate("People", inactivePeopleTemplateData);

            //Creating the Run time data
            let caseData = require('../../data/ui/case/case.ui.json');
            response1 = await apiHelper.createCase(caseData['simpleCase']);
            let taskData = {
                "taskName": "DRDMV-16051",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qfeng"
            }
            response2 = await apiHelper.createAdhocTask(response1.id, taskData);
            let articleData = {
                "knowledgeSet": "HR",
                "title": 'DRDMV-16051',
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United States Support",
                "assigneeSupportGroup": "US Support 1",
                "assignee": "kayo"
            }
            response3 = await apiHelper.createKnowledgeArticle(articleData);
        });

        it('[DRDMV-16051,DRDMV-16013]: Verify People notes template / Task Note template should not be displayed on case in activity template and vice versa for all other', async () => {
            //Validating the Case Notes
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(response1.displayId);
            await activityTabPo.clickActivityNoteTextBox();
            await activityTabPo.clickOnNotesTemplate();
            expect(await notesTemplateUsage.isTemplatePresent(taskActiveTemplateName)).toBeFalsy();
            expect(await notesTemplateUsage.isTemplatePresent(knowledgeActiveTemplateName)).toBeFalsy();
            expect(await notesTemplateUsage.isTemplatePresent(peopleActiveTemplateName)).toBeFalsy();
            expect(await notesTemplateUsage.isTemplatePresent(caseInactiveTemplateName)).toBeFalsy();
            await notesTemplateUsage.clickOnCancelBtn();

            //Validating the Task Notes
            await navigationPage.gotoTaskConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(response2.displayId);
            await activityTabPo.clickActivityNoteTextBox();
            await activityTabPo.clickOnNotesTemplate();
            expect(await notesTemplateUsage.isTemplatePresent(caseActiveTemplateName)).toBeFalsy();
            expect(await notesTemplateUsage.isTemplatePresent(knowledgeActiveTemplateName)).toBeFalsy();
            expect(await notesTemplateUsage.isTemplatePresent(peopleActiveTemplateName)).toBeFalsy();
            expect(await notesTemplateUsage.isTemplatePresent(taskInactiveTemplateName)).toBeFalsy();
            await notesTemplateUsage.clickOnCancelBtn();
        });

        it('[DRDMV-16051,DRDMV-16013]: Verify People notes template / Task Note template should not be displayed on case in activity template and vice versa for all other', async () => {
            //Validating the People Notes
            await navigationPage.gotoQuickCase();
            await navigationPage.gotoPersonProfile();
            await relatedTabPage.addRelatedPerson();
            await addRelatedPopupPage.addPerson('Qiang Du', 'Parent');
            await relatedTabPage.clickRelatedPersonName('Qiang Du');
            await utilityCommon.switchToNewTab(1);
            await activityTabPo.clickActivityNoteTextBox();
            await activityTabPo.clickOnNotesTemplate();
            expect(await notesTemplateUsage.isTemplatePresent(caseActiveTemplateName)).toBeFalsy();
            expect(await notesTemplateUsage.isTemplatePresent(taskActiveTemplateName)).toBeFalsy();
            expect(await notesTemplateUsage.isTemplatePresent(knowledgeActiveTemplateName)).toBeFalsy();
            expect(await notesTemplateUsage.isTemplatePresent(peopleInactiveTemplateName)).toBeFalsy();
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();

            //Validating the Knowledge Notes
            await navigationPage.gotoKnowledgeConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(response3.displayId);
            await viewKnowledgeArticlePo.clickOnTab('Activity');
            await activityTabPo.clickActivityNoteTextBox();
            await activityTabPo.clickOnNotesTemplate();
            expect(await notesTemplateUsage.isTemplatePresent(caseActiveTemplateName)).toBeFalsy();
            expect(await notesTemplateUsage.isTemplatePresent(taskActiveTemplateName)).toBeFalsy();
            expect(await notesTemplateUsage.isTemplatePresent(peopleActiveTemplateName)).toBeFalsy();
            expect(await notesTemplateUsage.isTemplatePresent(knowledgeInactiveTemplateName)).toBeFalsy();
            await notesTemplateUsage.clickOnCancelBtn();
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        });
    });

    //asahitya
    describe('[DRDMV-16112]: Verify Case Notes template is displayed as per to be assignee company(operating organisation)', () => {
        let petramcoTemplateName = undefined;
        let psilonTemplateName = undefined;
        let globalTemplateName = undefined;
        let petramcoCaseResponse = undefined;
        let psilonCaseResponse = undefined;

        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
             userData1 = {
                "firstName": "Multiple Companies",
                "lastName": "Access",
                "userId": "DRDMV-16112_User",
                "emailId": "DRDMV-16112_User@petramco.com",
                "userPermission": ["Case Agent", "Foundation Read", "Document Manager", "Case Business Analyst"]
            }
            await apiHelper.createNewUser(userData1);
            await apiHelper.associatePersonToCompany(userData1.userId, "Petramco");
            await apiHelper.associatePersonToCompany(userData1.userId, "Psilon");
            await browser.sleep(15000); //Hard Wait to reflect the new person

            await apiHelper.apiLogin(userData1.userId + '@petramco.com', 'Password_1234');
            let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let petramcoNotesTemplateData = cloneDeep(notesTemplateData.NOTES_TEMPLATE_MANDATORY_FIELD);
            petramcoTemplateName = petramcoNotesTemplateData.templateName + randomStr + 'Petramco';
            petramcoNotesTemplateData.templateName = petramcoTemplateName;
            await apiHelper.createNotesTemplate('Case', petramcoNotesTemplateData);

            let psilonNotesTemplateData = cloneDeep(notesTemplateData.NOTES_TEMPLATE_PSILON);
            psilonTemplateName = psilonNotesTemplateData.templateName + randomStr + 'Psilon';
            psilonNotesTemplateData.templateName = psilonTemplateName;
            await apiHelper.createNotesTemplate('Case', psilonNotesTemplateData);

            let globalNotesTemplateData = cloneDeep(notesTemplateData.NOTES_TEMPLATE_MANDATORY_FIELD_GLOBAL);
            globalTemplateName = globalNotesTemplateData.templateName + randomStr + 'Global';
            globalNotesTemplateData.templateName = globalTemplateName;
            await apiHelper.createNotesTemplate('Case', globalNotesTemplateData);

            let caseDataPetramco = {
                "Description": "DRDMV-16112 Petramco",
                "Requester": "qkatawazi",
                "Summary": "DRDMV-16112 Petramco",
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qfeng"
            }
            petramcoCaseResponse = await apiHelper.createCase(caseDataPetramco);

            let caseDataPsilon = {
                "Description": "DRDMV-16112 Psilon",
                "Requester": "gderuno",
                "Summary": "DRDMV-16112 Psilon",
                "Assigned Company": "Psilon",
                "Business Unit": "Psilon Support Org2",
                "Support Group": "Psilon Support Group2",
                "Assignee": "gwixillian"
            }
            psilonCaseResponse = await apiHelper.createCase(caseDataPsilon);
        });

        it('[DRDMV-16112]: Verify Case Notes template is displayed as per to be assignee company(operating organisation)', async () => {
            await navigationPage.signOut();
            await loginPage.login(userData1.userId + "@petramco.com", 'Password_1234');
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(petramcoCaseResponse.displayId);
            await activityTabPo.clickActivityNoteTextBox();
            await activityTabPo.clickOnNotesTemplate();
            expect(await notesTemplateUsage.isTemplatePresent(psilonTemplateName)).toBeFalsy();
            await notesTemplateUsage.clickOnCancelBtn();
            await activityTabPo.clickOnCancelButton();
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(petramcoTemplateName);
            await activityTabPo.clickOnPostButton();
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(globalTemplateName);
            await activityTabPo.clickOnPostButton();

            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(psilonCaseResponse.displayId);
            await activityTabPo.clickActivityNoteTextBox();
            await activityTabPo.clickOnNotesTemplate();
            expect(await notesTemplateUsage.isTemplatePresent(petramcoTemplateName)).toBeFalsy();
            await notesTemplateUsage.clickOnCancelBtn();
            await activityTabPo.clickOnCancelButton();
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(psilonTemplateName);
            await activityTabPo.clickOnPostButton();
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(globalTemplateName);
            await activityTabPo.clickOnPostButton();
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        });
    });

    describe('[DRDMV-22642,DRDMV-22646,DRDMV-22657]: Verify CKE functionality on Create and Edit Case Notes template', async () => {
        let templateName: string, newCase, readAccessMappingData, randomString = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            let caseData = {
                "Requester": "qtao",
                "Company": "Petramco",
                "Summary": "Create case for me postman1" + randomString,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "Qadim Katawazi"
            };
            readAccessMappingData = {
                "configName": randomString + '1ReadAccessMappingName',
                "assignedCompany": 'Petramco',
                "businessUnit": 'United States Support',
                "supportGroup": 'US Support 3',
                "company": 'Petramco',
                "priority": "Low",
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createReadAccessMapping(readAccessMappingData);
            newCase = await apiHelper.createCase(caseData);
        });
        it('[DRDMV-22642,DRDMV-22646,DRDMV-22657]: Verify CKE functionality on Create and Edit Case Notes template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Notes Template', 'Activity Notes Template Console - Case - Business Workflows');
            await consoleNotesTemplate.clickOnCreateNotesTemplate();
            templateName = "caseNotesTemplate" + Math.floor(Math.random() * 100000);
            await createNotesTemplate.setTemplateName(templateName);
            await createNotesTemplate.setStatusValue('Active');
            await createNotesTemplate.setCompanyValue('Petramco');
            await createNotesTemplate.setBody("this is new actiivty notes template");
            // bold
            await ckeditorOpsPo.updateDescription("this is text ");
            await ckeditorOpsPo.clickOnBoldIcon();
            await ckeditorOpsPo.updateDescription(boldText);
            expect(await ckeditorValidationPo.isBoldTextDisplayedInCkEditorTextArea(boldText)).toBeTruthy('Text is not get Bold In Ck Editor');
            await ckeditorOpsPo.clickOnBoldIcon();
            //italic
            await ckeditorOpsPo.clickOnItalicIcon();
            await ckeditorOpsPo.updateDescription(italicText);
            expect(await ckeditorValidationPo.isItalicTextDisplayedInCkEditorTextArea(italicText)).toBeTruthy('Text is not Italic In Ck Editor');
            await ckeditorOpsPo.clickOnItalicIcon();
            //StrikeThrough
            await ckeditorOpsPo.clickOnStrikeThroughIcon();
            await ckeditorOpsPo.updateDescription(strikeThroughText);
            expect(await ckeditorValidationPo.isStrikeThroughTextDisplayedInCkEditorTextArea(strikeThroughText)).toBeTruthy('Text is not Strike Through In Ck Editor');
            await ckeditorOpsPo.clickOnStrikeThroughIcon();
            //underline
            await ckeditorOpsPo.clickOnUnderLineIcon();
            await ckeditorOpsPo.updateDescription(underLineText);
            expect(await ckeditorValidationPo.isUnderlineTextDisplayedInCkEditorTextArea(underLineText)).toBeTruthy('Text is not Underline In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnUnderLineIcon();
        });
        it('[DRDMV-22642,DRDMV-22646,DRDMV-22657]: Verify CKE functionality on Create and Edit Case Notes template', async () => {
            //left Align
            await ckeditorOpsPo.clickOnLeftAlignIcon();
            await ckeditorOpsPo.updateDescription(lefAlignText);
            expect(await ckeditorValidationPo.isTextLeftAlignInCkEditorTextArea(lefAlignText)).toBeTruthy('Text is not Left Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnLeftAlignIcon();
            //Right Align
            await ckeditorOpsPo.clickOnRightAlignIcon();
            await ckeditorOpsPo.updateDescription(rightAlignText);
            expect(await ckeditorValidationPo.isTextRightAlignInCkEditorTextArea(rightAlignText)).toBeTruthy('Text is not right Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnRightAlignIcon();
            //Center Align
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            await ckeditorOpsPo.updateDescription(centerAlignText);
            expect(await ckeditorValidationPo.isTextCenterAlignInCkEditorTextArea(centerAlignText)).toBeTruthy('Text is not center Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            //Justify Align
            await ckeditorOpsPo.clickOnJustifyAlignIcon();
            await ckeditorOpsPo.updateDescription(justifyAlignText);
            expect(await ckeditorValidationPo.isTextJustifyAlignInCkEditorTextArea(justifyAlignText)).toBeTruthy('Text is not justify Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnJustifyAlignIcon();
            //set color
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.selectColor('Strong Red');
            await ckeditorOpsPo.updateDescription(redColorText);
            expect(await ckeditorValidationPo.isColorTextDisplayedInCkEditorTextArea(redColorText, 'color:#c0392b;')).toBeTruthy('Color is not set In Ck Editor');
            //checking number list
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.setNumberList(['PlusOne']);
            expect(await ckeditorValidationPo.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('Number List is not In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            // checking bullot points
            await ckeditorOpsPo.setBulletList(['BulletOne']);
            expect(await ckeditorValidationPo.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('Bulleted List is not In Ck Editor');
            expect(await ckeditorValidationPo.getTextCkEditorMinimizeOrMiximize()).toBe('Maximize');
            await ckeditorOpsPo.clickMaximizeMinimizeIcon();
            expect(await ckeditorValidationPo.getTextCkEditorMinimizeOrMiximize()).toBe('Minimize');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickMaximizeMinimizeIcon();
        });
        it('[DRDMV-22642,DRDMV-22646,DRDMV-22657]: Verify CKE functionality on Create and Edit Case Notes template', async () => {
            //add style
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.updateDescription(formatText);
            await ckeditorOpsPo.selectStyles('Heading 2');
            expect(await ckeditorValidationPo.isStyleApplied(formatText, 'h2')).toBeTruthy('Heading not set');
            //add Font Size 
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.updateDescription(fontText);
            await ckeditorOpsPo.selectFont('11');
            expect(await ckeditorValidationPo.isFontApplied(11, 'span')).toBeTruthy('Font not set');
            //upload image with URL
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnImageIcon();
            await ckeditorOpsPo.imageUploadWithURL(uploadURL, imageUrlFieldIndex, imageWidthFieldIndex, '100');
            expect(await ckeditorValidationPo.isImageDisplayedInCKE(uploadURL)).toBeTruthy('Image with URL not uploaded');
            //upload image with Local
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnImageIcon();
            imageSource = await ckeditorOpsPo.uploadImageFromLocal('Upload', '../../../data/ui/attachment/articleStatus.png', imageWidthFieldIndex, imageUrlFieldIndex, '50');
            expect(await ckeditorValidationPo.isImageDisplayedInCKE(imageSource)).toBeTruthy();
            // Link added
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('Google', linkDisplayTextFieldIndex);
            await linkPropertiesPo.setValueOfLinkProperties('www.google.com', linkUrlFieldIndex);
            await linkPropertiesPo.clickOnTargetTab();
            await linkPropertiesPo.selectDropDown('_blank', linkTargetDropDownIndex);
            await linkPropertiesPo.clickOnOkBtn();
            expect(await ckeditorValidationPo.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('Link is not In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            //add table
            await ckeditorOpsPo.clickOnTableIcon();
            await tablePropertiesPo.setValueOfTableProperties('4', tableRowFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('10', tableColumnFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('500', tableWidthFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('200', tableHeightFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('new' + randomString, cellCaption);
            await tablePropertiesPo.setValueOfTableProperties('tableSummary', cellSummary);
            await tablePropertiesPo.clickOnOkButton();
            await ckeditorOpsPo.clickInTableCell(2, 2, 'tableSummary');
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            await ckeditorOpsPo.setDataInTable(2, 2, randomString, 'tableSummary');
            await ckeditorOpsPo.clickInTableCell(1, 2, 'tableSummary');
            await ckeditorOpsPo.clickOnRightAlignIcon();
            await ckeditorOpsPo.setDataInTable(1, 2, randomString, 'tableSummary');
            expect(await ckeditorValidationPo.getTableCellAlignText("text-align: center;")).toContain(randomString);
            await createNotesTemplate.clickOnSaveButton();
            await utilCommon.closePopUpMessage();
        });
        it('[DRDMV-22642,DRDMV-22646,DRDMV-22657]: Verify CKE functionality on Create and Edit Case Notes template', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(newCase.displayId);
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(templateName);
            await activityTabPo.addActivityNote(randomString);
            expect(await ckeditorValidationPo.isBoldTextDisplayedInCkEditorTextArea(boldText)).toBeTruthy('Text is not get Bold In Ck Editor');
            expect(await ckeditorValidationPo.isItalicTextDisplayedInCkEditorTextArea(italicText)).toBeTruthy('Text is not Italic In Ck Editor');
            expect(await ckeditorValidationPo.isUnderlineTextDisplayedInCkEditorTextArea(underLineText)).toBeTruthy('Text is not Underline In Ck Editor');
            expect(await ckeditorValidationPo.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('Text is not center Align In Ck Editor');
            expect(await ckeditorValidationPo.isTextLeftAlignInCkEditorTextArea(lefAlignText)).toBeTruthy('Text is not Left Align In Ck Editor');
            expect(await ckeditorValidationPo.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('Text is not center Align In Ck Editor');
            expect(await ckeditorValidationPo.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('Text is not center Align In Ck Editor');
            await activityTabPo.clickOnPostButton();
            await activityTabPo.clickOnRefreshButton();
            await activityTabPo.clickShowMoreLinkInActivity(1);
            expect(await activityTabPo.isBoldTextDisplayedInActivity(boldText, 1)).toBeTruthy('FailureMsg Bold Text is missing in Activity');
            expect(await activityTabPo.isItalicTextDisplayedInActivity(italicText, 1)).toBeTruthy('FailureMsg Italic Text is missing In Activity');
            expect(await activityTabPo.isUnderlineTextDisplayedInActivity(underLineText, 1)).toBeTruthy('FailureMsg Underline Text is missing In Activity');
            expect(await activityTabPo.isRightAlignTextDisplayedInActivity(rightAlignText, 1)).toBeTruthy('FailureMsg Right Align Text is missing In Activity');
            expect(await activityTabPo.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 1)).toBeTruthy('FailureMsg Link Text is missing In Activity');
            expect(await activityTabPo.isNumberListTextDisplayedInActivity('PlusOne', 1)).toBeTruthy('FailureMsg Number List Text is missing In Activity');
            expect(await activityTabPo.isBulletListTextDisplayedInActivity('BulletOne', 1)).toBeTruthy('FailureMsg Bullet List Text is missing In Activity');
            expect(await ckeditorValidationPo.isTableCaptionDisplayedInCkEditorTextArea('tableSummary', 'new' + randomString)).toBeTruthy('Text is not Left Align In Ck Editor');
            expect(await ckeditorValidationPo.isTableSummaryDisplayedInCkEditorTextArea('tableSummary')).toBeTruthy('Text is not Left Align In Ck Editor');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.setSummary('NotesTemplateCase1' + randomString);
            await createCasePo.setPriority('Low');
            await createCasePo.clickAssignToMeButton();
            await createCasePo.clickSaveCaseButton();
            await casePreviewPo.clickGoToCaseButton();
            await viewCasePage.clickOnTab('Case Access');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('US Support 3', 'Write')).toBeTruthy('Support Group does not have read access');
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(templateName);
            await activityTabPo.addActivityNote(randomString);
            await activityTabPo.clickOnPostButton();
            await activityTabPo.clickOnRefreshButton();
            await activityTabPo.clickShowMoreLinkInActivity(1);
            expect(await activityTabPo.isBoldTextDisplayedInActivity(boldText, 1)).toBeTruthy('FailureMsg Bold Text is missing in Activity');
            expect(await activityTabPo.isItalicTextDisplayedInActivity(italicText, 1)).toBeTruthy('FailureMsg Italic Text is missing In Activity');
            expect(await activityTabPo.isUnderlineTextDisplayedInActivity(underLineText, 1)).toBeTruthy('FailureMsg Underline Text is missing In Activity');
            expect(await activityTabPo.isRightAlignTextDisplayedInActivity(rightAlignText, 1)).toBeTruthy('FailureMsg Right Align Text is missing In Activity');
            expect(await activityTabPo.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 1)).toBeTruthy('FailureMsg Link Text is missing In Activity');
            expect(await activityTabPo.isNumberListTextDisplayedInActivity('PlusOne', 1)).toBeTruthy('FailureMsg Number List Text is missing In Activity');
            expect(await activityTabPo.isBulletListTextDisplayedInActivity('BulletOne', 1)).toBeTruthy('FailureMsg Bullet List Text is missing In Activity');
            expect(await ckeditorValidationPo.isTableCaptionDisplayedInCkEditorTextArea('tableSummary', 'new' + randomString)).toBeTruthy('Text is not Left Align In Ck Editor');
            expect(await ckeditorValidationPo.isTableSummaryDisplayedInCkEditorTextArea('tableSummary')).toBeTruthy('Text is not Left Align In Ck Editor');
        });
        it('[DRDMV-22642,DRDMV-22646,DRDMV-22657]: Verify CKE functionality on Create and Edit Case Notes template', async () => {
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink('NotesTemplateCase1' + randomString);
            await activityTabPo.clickOnRefreshButton();
            await activityTabPo.clickShowMoreLinkInActivity(1);
            expect(await activityTabPo.isBoldTextDisplayedInActivity(boldText, 1)).toBeTruthy('FailureMsg Bold Text is missing in Activity');
            expect(await activityTabPo.isItalicTextDisplayedInActivity(italicText, 1)).toBeTruthy('FailureMsg Italic Text is missing In Activity');
            expect(await activityTabPo.isUnderlineTextDisplayedInActivity(underLineText, 1)).toBeTruthy('FailureMsg Underline Text is missing In Activity');
            expect(await activityTabPo.isRightAlignTextDisplayedInActivity(rightAlignText, 1)).toBeTruthy('FailureMsg Right Align Text is missing In Activity');
            expect(await activityTabPo.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 1)).toBeTruthy('FailureMsg Link Text is missing In Activity');
            expect(await activityTabPo.isNumberListTextDisplayedInActivity('PlusOne', 1)).toBeTruthy('FailureMsg Number List Text is missing In Activity');
            expect(await activityTabPo.isBulletListTextDisplayedInActivity('BulletOne', 1)).toBeTruthy('FailureMsg Bullet List Text is missing In Activity');
            expect(await ckeditorValidationPo.isTableCaptionDisplayedInCkEditorTextArea('tableSummary', 'new' + randomString)).toBeTruthy('Text is not Left Align In Ck Editor');
            expect(await ckeditorValidationPo.isTableSummaryDisplayedInCkEditorTextArea('tableSummary')).toBeTruthy('Text is not Left Align In Ck Editor');
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink('NotesTemplateCase1' + randomString);
            await activityTabPo.clickOnRefreshButton();
            await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.isBoldTextDisplayedInActivity(boldText, 1)).toBeTruthy('FailureMsg Bold Text is missing in Activity');
            expect(await activityTabPo.isItalicTextDisplayedInActivity(italicText, 1)).toBeTruthy('FailureMsg Italic Text is missing In Activity');
            expect(await activityTabPo.isUnderlineTextDisplayedInActivity(underLineText, 1)).toBeTruthy('FailureMsg Underline Text is missing In Activity');
            expect(await activityTabPo.isRightAlignTextDisplayedInActivity(rightAlignText, 1)).toBeTruthy('FailureMsg Right Align Text is missing In Activity');
            expect(await activityTabPo.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 1)).toBeTruthy('FailureMsg Link Text is missing In Activity');
            expect(await activityTabPo.isNumberListTextDisplayedInActivity('PlusOne', 1)).toBeTruthy('FailureMsg Number List Text is missing In Activity');
            expect(await activityTabPo.isBulletListTextDisplayedInActivity('BulletOne', 1)).toBeTruthy('FailureMsg Bullet List Text is missing In Activity');
            expect(await ckeditorValidationPo.isTableCaptionDisplayedInCkEditorTextArea('tableSummary', 'new' + randomString)).toBeTruthy('Text is not Left Align In Ck Editor');
            expect(await ckeditorValidationPo.isTableSummaryDisplayedInCkEditorTextArea('tableSummary')).toBeTruthy('Text is not Left Align In Ck Editor');
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[DRDMV-22638,DRDMV-22644,DRDMV-22654]: Verify CKE functionality on Create and Edit Knowledge Notes template', async () => {
        let templateName: string, randomString = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        it('[DRDMV-22638,DRDMV-22644,DRDMV-22654]: Verify CKE functionality on Create and Edit Knowledge Notes template', async () => {
            await navigationPage.signOut();
            await loginPage.login('peter');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Notes Template', 'Activity Notes Template Console - Knowledge - Business Workflows');
            await consoleNotesTemplate.clickOnCreateNotesTemplate();
            templateName = "knowledgeNotesTemplate" + Math.floor(Math.random() * 100000);
            await createNotesTemplate.setTemplateName(templateName);
            await createNotesTemplate.setStatusValue('Active');
            await createNotesTemplate.setCompanyValue('Petramco');
            await createNotesTemplate.setBody("this is new actiivty notes template");
            // bold
            await ckeditorOpsPo.updateDescription("this is text ");
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnBoldIcon();
            await ckeditorOpsPo.updateDescription(boldText);
            expect(await ckeditorValidationPo.isBoldTextDisplayedInCkEditorTextArea(boldText)).toBeTruthy('Text is not get Bold In Ck Editor');
            await ckeditorOpsPo.clickOnBoldIcon();
            //italic
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnItalicIcon();
            await ckeditorOpsPo.updateDescription(italicText);
            expect(await ckeditorValidationPo.isItalicTextDisplayedInCkEditorTextArea(italicText)).toBeTruthy('Text is not Italic In Ck Editor');
            await ckeditorOpsPo.clickOnItalicIcon();
            //strikethrough
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnStrikeThroughIcon();
            await ckeditorOpsPo.updateDescription(strikeThroughText);
            expect(await ckeditorValidationPo.isStrikeThroughTextDisplayedInCkEditorTextArea(strikeThroughText)).toBeTruthy('Text is not Strike Through In Ck Editor');
            await ckeditorOpsPo.clickOnStrikeThroughIcon();
            //underline
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnUnderLineIcon();
            await ckeditorOpsPo.updateDescription(underLineText);
            expect(await ckeditorValidationPo.isUnderlineTextDisplayedInCkEditorTextArea(underLineText)).toBeTruthy('Text is not Underline In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnUnderLineIcon();
        });
        it('[DRDMV-22638,DRDMV-22644,DRDMV-22654]: Verify CKE functionality on Create and Edit Knowledge Notes template', async () => {
            //left Align
            await ckeditorOpsPo.clickOnLeftAlignIcon();
            await ckeditorOpsPo.updateDescription(lefAlignText);
            expect(await ckeditorValidationPo.isTextLeftAlignInCkEditorTextArea(lefAlignText)).toBeTruthy('Text is not Left Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnLeftAlignIcon();
            //Right Align
            await ckeditorOpsPo.clickOnRightAlignIcon();
            await ckeditorOpsPo.updateDescription(rightAlignText);
            expect(await ckeditorValidationPo.isTextRightAlignInCkEditorTextArea(rightAlignText)).toBeTruthy('Text is not right Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnRightAlignIcon();
            //Center Align
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            await ckeditorOpsPo.updateDescription(centerAlignText);
            expect(await ckeditorValidationPo.isTextCenterAlignInCkEditorTextArea(centerAlignText)).toBeTruthy('Text is not center Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            //Justify Align
            await ckeditorOpsPo.clickOnJustifyAlignIcon();
            await ckeditorOpsPo.updateDescription(justifyAlignText);
            expect(await ckeditorValidationPo.isTextJustifyAlignInCkEditorTextArea(justifyAlignText)).toBeTruthy('Text is not justify Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnJustifyAlignIcon();
            //set color
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.selectColor('Strong Red');
            await ckeditorOpsPo.updateDescription(redColorText);
            expect(await ckeditorValidationPo.isColorTextDisplayedInCkEditorTextArea(redColorText, 'color:#c0392b;')).toBeTruthy('Color is not set In Ck Editor');
            //checking number list
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.setNumberList(['PlusOne']);
            expect(await ckeditorValidationPo.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('Number List is not In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            // checking bullot points
            await ckeditorOpsPo.setBulletList(['BulletOne']);
            expect(await ckeditorValidationPo.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('Bulleted List is not In Ck Editor');
            expect(await ckeditorValidationPo.getTextCkEditorMinimizeOrMiximize()).toBe('Maximize');
            await ckeditorOpsPo.clickMaximizeMinimizeIcon();
            expect(await ckeditorValidationPo.getTextCkEditorMinimizeOrMiximize()).toBe('Minimize');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickMaximizeMinimizeIcon();
        });
        it('[DRDMV-22638,DRDMV-22644,DRDMV-22654]: Verify CKE functionality on Create and Edit Knowledge Notes template', async () => {
            //add style
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.updateDescription(formatText);
            await ckeditorOpsPo.selectStyles('Heading 2');
            expect(await ckeditorValidationPo.isStyleApplied(formatText, 'h2')).toBeTruthy('Heading not set');
            //add Font Size 
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.selectFont("11");
            await ckeditorOpsPo.updateDescription(fontText);
            expect(await ckeditorValidationPo.isFontApplied(11, 'span')).toBeTruthy('Font not set');
            //upload image with URL
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnImageIcon();
            await ckeditorOpsPo.imageUploadWithURL(uploadURL, imageUrlFieldIndex, imageWidthFieldIndex, '100');
            expect(await ckeditorValidationPo.isImageDisplayedInCKE(uploadURL)).toBeTruthy('Image with URL not uploaded');
            //upload image with Local
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnImageIcon();
            imageSource = await ckeditorOpsPo.uploadImageFromLocal('Upload', '../../../data/ui/attachment/articleStatus.png', imageWidthFieldIndex, imageUrlFieldIndex, '50');
            expect(await ckeditorValidationPo.isImageDisplayedInCKE(imageSource)).toBeTruthy();
            // Link added
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('Google', linkDisplayTextFieldIndex);
            await linkPropertiesPo.setValueOfLinkProperties('www.google.com', linkUrlFieldIndex);
            await linkPropertiesPo.clickOnTargetTab();
            await linkPropertiesPo.selectDropDown('_blank', linkTargetDropDownIndex);
            await linkPropertiesPo.clickOnOkBtn();
            expect(await ckeditorValidationPo.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('Link is not In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            //add table
            await ckeditorOpsPo.clickOnTableIcon();
            await tablePropertiesPo.setValueOfTableProperties('4', tableRowFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('10', tableColumnFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('500', tableWidthFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('200', tableHeightFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('new' + randomString, cellCaption);
            await tablePropertiesPo.setValueOfTableProperties('tableSummary', cellSummary);
            await tablePropertiesPo.clickOnOkButton();
            await ckeditorOpsPo.clickInTableCell(2, 2, 'tableSummary');
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            await ckeditorOpsPo.setDataInTable(2, 2, randomString, 'tableSummary');
            await ckeditorOpsPo.clickInTableCell(1, 2, 'tableSummary');
            await ckeditorOpsPo.clickOnRightAlignIcon();
            await ckeditorOpsPo.setDataInTable(1, 2, randomString, 'tableSummary');
            await createNotesTemplate.clickOnSaveButton();
            await utilCommon.closePopUpMessage();
        });
        it('[DRDMV-22638,DRDMV-22644,DRDMV-22654]: Verify CKE functionality on Create and Edit Knowledge Notes template', async () => {
            await navigationPage.gotoCreateKnowledge();
            await createKnowlegePo.clickOnTemplate("Reference");
            await createKnowlegePo.clickOnUseSelectedTemplateButton();
            await createKnowlegePo.addTextInKnowlegeTitleField("KnowledgeTitle_" + randomString);
            await createKnowlegePo.selectKnowledgeSet("HR");
            await createKnowlegePo.clickChangeAssignmentButton();
            await changeAssignmentBladePo.selectCompany('Petramco');
            await changeAssignmentBladePo.selectBusinessUnit('HR Support');
            await changeAssignmentBladePo.selectSupportGroup('Employee Relations');
            await changeAssignmentBladePo.selectAssignee('Elizabeth');
            await changeAssignmentBladePo.clickOnAssignButton();
            await createKnowlegePo.clickOnSaveKnowledgeButton();
            await previewKnowledgePo.clickGoToArticleButton();
            await viewKnowledgeArticlePo.clickEditKnowledgeAccess();
            await accessTabPo.clickToExpandAccessEntitiySearch('Support Group Access', 'Knowledge');
            await accessTabPo.selectAccessEntityDropDown('Petramco', 'Select Company');
            await accessTabPo.selectAccessEntityDropDown('Facilities Support', 'Select Business Unit');
            await accessTabPo.selectAccessEntityDropDown('Facilities', 'Select Support Group');
            await accessTabPo.clickAccessEntitiyAddButton('Support Group');
            await accessTabPo.clickCloseKnowledgeAccessBlade();
            await viewKnowledgeArticlePo.clickOnTab('Activity');
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(templateName);
            expect(await ckeditorValidationPo.isBoldTextDisplayedInCkEditorTextArea(boldText)).toBeTruthy('Text is not get Bold In Ck Editor');
            expect(await ckeditorValidationPo.isItalicTextDisplayedInCkEditorTextArea(italicText)).toBeTruthy('Text is not Italic In Ck Editor');
            expect(await ckeditorValidationPo.isUnderlineTextDisplayedInCkEditorTextArea(underLineText)).toBeTruthy('Text is not Underline In Ck Editor');
            expect(await ckeditorValidationPo.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('Text is not center Align In Ck Editor');
            expect(await ckeditorValidationPo.isTextLeftAlignInCkEditorTextArea(lefAlignText)).toBeTruthy('Text is not Left Align In Ck Editor');
            expect(await ckeditorValidationPo.isTableCaptionDisplayedInCkEditorTextArea('tableSummary', 'new' + randomString)).toBeTruthy('Text is not Left Align In Ck Editor');
            expect(await ckeditorValidationPo.isTableSummaryDisplayedInCkEditorTextArea('tableSummary')).toBeTruthy('Text is not Left Align In Ck Editor');
            await activityTabPo.clickOnPostButton();
            await navigationPage.gotoKnowledgeConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink("KnowledgeTitle_" + randomString);
            await viewKnowledgeArticlePo.clickOnTab('Activity');
            await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.isBoldTextDisplayedInActivity(boldText, 1)).toBeTruthy('FailureMsg Bold Text is missing in Activity');
            expect(await activityTabPo.isItalicTextDisplayedInActivity(italicText, 1)).toBeTruthy('FailureMsg Italic Text is missing In Activity');
            expect(await activityTabPo.isUnderlineTextDisplayedInActivity(underLineText, 1)).toBeTruthy('FailureMsg Underline Text is missing In Activity');
            expect(await activityTabPo.isRightAlignTextDisplayedInActivity(rightAlignText, 1)).toBeTruthy('FailureMsg Right Align Text is missing In Activity');
            expect(await activityTabPo.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 1)).toBeTruthy('FailureMsg Link Text is missing In Activity');
            expect(await activityTabPo.isNumberListTextDisplayedInActivity('PlusOne', 1)).toBeTruthy('FailureMsg Number List Text is missing In Activity');
            expect(await activityTabPo.isBulletListTextDisplayedInActivity('BulletOne', 1)).toBeTruthy('FailureMsg Bullet List Text is missing In Activity');
            expect(await ckeditorValidationPo.isTableCaptionDisplayedInCkEditorTextArea('tableSummary', 'new' + randomString)).toBeTruthy('Text is not Left Align In Ck Editor');
            expect(await ckeditorValidationPo.isTableSummaryDisplayedInCkEditorTextArea('tableSummary')).toBeTruthy('Text is not Left Align In Ck Editor');
        });
        it('[DRDMV-22638,DRDMV-22644,DRDMV-22654]: Verify CKE functionality on Create and Edit Knowledge Notes template', async () => {
            await navigationPage.signOut();
            await loginPage.login('kWilliamson');
            await navigationPage.switchToApplication("Knowledge Management");
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual("Knowledge Articles", 'title not correct');
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink("KnowledgeTitle_" + randomString);
            await viewKnowledgeArticlePo.clickOnTab('Activity');
            await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.isBoldTextDisplayedInActivity(boldText, 1)).toBeTruthy('FailureMsg Bold Text is missing in Activity');
            expect(await activityTabPo.isItalicTextDisplayedInActivity(italicText, 1)).toBeTruthy('FailureMsg Italic Text is missing In Activity');
            expect(await activityTabPo.isUnderlineTextDisplayedInActivity(underLineText, 1)).toBeTruthy('FailureMsg Underline Text is missing In Activity');
            expect(await activityTabPo.isRightAlignTextDisplayedInActivity(rightAlignText, 1)).toBeTruthy('FailureMsg Right Align Text is missing In Activity');
            expect(await activityTabPo.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 1)).toBeTruthy('FailureMsg Link Text is missing In Activity');
            expect(await activityTabPo.isNumberListTextDisplayedInActivity('PlusOne', 1)).toBeTruthy('FailureMsg Number List Text is missing In Activity');
            expect(await activityTabPo.isBulletListTextDisplayedInActivity('BulletOne', 1)).toBeTruthy('FailureMsg Bullet List Text is missing In Activity');
            expect(await ckeditorValidationPo.isTableCaptionDisplayedInCkEditorTextArea('tableSummary', 'new' + randomString)).toBeTruthy('Text is not Left Align In Ck Editor');
            expect(await ckeditorValidationPo.isTableSummaryDisplayedInCkEditorTextArea('tableSummary')).toBeTruthy('Text is not Left Align In Ck Editor');
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoKnowledgeConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink("KnowledgeTitle_" + randomString);
            await viewKnowledgeArticlePo.clickOnTab('Activity');
            await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.isBoldTextDisplayedInActivity(boldText, 1)).toBeTruthy('FailureMsg Bold Text is missing in Activity');
            expect(await activityTabPo.isItalicTextDisplayedInActivity(italicText, 1)).toBeTruthy('FailureMsg Italic Text is missing In Activity');
            expect(await activityTabPo.isUnderlineTextDisplayedInActivity(underLineText, 1)).toBeTruthy('FailureMsg Underline Text is missing In Activity');
            expect(await activityTabPo.isRightAlignTextDisplayedInActivity(rightAlignText, 1)).toBeTruthy('FailureMsg Right Align Text is missing In Activity');
            expect(await activityTabPo.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 1)).toBeTruthy('FailureMsg Link Text is missing In Activity');
            expect(await activityTabPo.isNumberListTextDisplayedInActivity('PlusOne', 1)).toBeTruthy('FailureMsg Number List Text is missing In Activity');
            expect(await activityTabPo.isBulletListTextDisplayedInActivity('BulletOne', 1)).toBeTruthy('FailureMsg Bullet List Text is missing In Activity');
            expect(await ckeditorValidationPo.isTableCaptionDisplayedInCkEditorTextArea('tableSummary', 'new' + randomString)).toBeTruthy('Text is not Left Align In Ck Editor');
            expect(await ckeditorValidationPo.isTableSummaryDisplayedInCkEditorTextArea('tableSummary')).toBeTruthy('Text is not Left Align In Ck Editor');
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //Covered DefectID-DRDMV-22228
   describe('[DRDMV-22637,DRDMV-22643,DRDMV-22653]: Verify CKE functionality on Create and Edit People Notes template', async () => {
        let templateName: string, caseData, newCase, randomString = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            caseData = {
                "Requester": "qtao",
                "Summary": "Test case for inProgress task",
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qfeng"
            };
            newCase = await apiHelper.createCase(caseData);
        });
        it('[DRDMV-22637,DRDMV-22643,DRDMV-22653]: Verify CKE functionality on Create and Edit People Notes template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('People--Notes Template', 'Activity Notes Template Console - Person - Business Workflows');
            await consoleNotesTemplate.clickOnCreateNotesTemplate();
            templateName = "PeopleNotesTemplate" + Math.floor(Math.random() * 100000);
            await createNotesTemplate.setTemplateName(templateName);
            await createNotesTemplate.setStatusValue('Active');
            await createNotesTemplate.setCompanyValue('Petramco');
            await createNotesTemplate.setBody("this is new actiivty notes template");
            // bold
            await ckeditorOpsPo.updateDescription("this is text ");
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnBoldIcon();
            await ckeditorOpsPo.updateDescription(boldText);
            expect(await ckeditorValidationPo.isBoldTextDisplayedInCkEditorTextArea(boldText)).toBeTruthy('Text is not get Bold In Ck Editor');
            await ckeditorOpsPo.clickOnBoldIcon();
            //italic
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnItalicIcon();
            await ckeditorOpsPo.updateDescription(italicText);
            expect(await ckeditorValidationPo.isItalicTextDisplayedInCkEditorTextArea(italicText)).toBeTruthy('Text is not Italic In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnItalicIcon();
            //strikethrough
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnStrikeThroughIcon();
            await ckeditorOpsPo.updateDescription(strikeThroughText);
            expect(await ckeditorValidationPo.isStrikeThroughTextDisplayedInCkEditorTextArea(strikeThroughText)).toBeTruthy('Text is not Strike Through In Ck Editor');
            await ckeditorOpsPo.clickOnStrikeThroughIcon();
            //underline
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnUnderLineIcon();
            await ckeditorOpsPo.updateDescription(underLineText);
            expect(await ckeditorValidationPo.isUnderlineTextDisplayedInCkEditorTextArea(underLineText)).toBeTruthy('Text is not Underline In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnUnderLineIcon();
        });
        it('[DRDMV-22637,DRDMV-22643,DRDMV-22653]: Verify CKE functionality on Create and Edit People Notes template', async () => {
            //left Align
            await ckeditorOpsPo.clickOnLeftAlignIcon();
            await ckeditorOpsPo.updateDescription(lefAlignText);
            expect(await ckeditorValidationPo.isTextLeftAlignInCkEditorTextArea(lefAlignText)).toBeTruthy('Text is not Left Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnLeftAlignIcon();
            //Right Align
            await ckeditorOpsPo.clickOnRightAlignIcon();
            await ckeditorOpsPo.updateDescription(rightAlignText);
            expect(await ckeditorValidationPo.isTextRightAlignInCkEditorTextArea(rightAlignText)).toBeTruthy('Text is not right Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnRightAlignIcon();
            //Center Align
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            await ckeditorOpsPo.updateDescription(centerAlignText);
            expect(await ckeditorValidationPo.isTextCenterAlignInCkEditorTextArea(centerAlignText)).toBeTruthy('Text is not center Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            //Justify Align
            await ckeditorOpsPo.clickOnJustifyAlignIcon();
            await ckeditorOpsPo.updateDescription(justifyAlignText);
            expect(await ckeditorValidationPo.isTextJustifyAlignInCkEditorTextArea(justifyAlignText)).toBeTruthy('Text is not justify Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnJustifyAlignIcon();
            //set color
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.selectColor('Strong Red');
            await ckeditorOpsPo.updateDescription(redColorText);
            expect(await ckeditorValidationPo.isColorTextDisplayedInCkEditorTextArea(redColorText, 'color:#c0392b;')).toBeTruthy('Color is not set In Ck Editor');
            //checking number list
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.setNumberList(['PlusOne']);
            expect(await ckeditorValidationPo.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('Number List is not In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            // checking bullot points
            await ckeditorOpsPo.setBulletList(['BulletOne']);
            expect(await ckeditorValidationPo.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('Bulleted List is not In Ck Editor');
            expect(await ckeditorValidationPo.getTextCkEditorMinimizeOrMiximize()).toBe('Maximize');
            await ckeditorOpsPo.clickMaximizeMinimizeIcon();
            expect(await ckeditorValidationPo.getTextCkEditorMinimizeOrMiximize()).toBe('Minimize');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickMaximizeMinimizeIcon();
        });
        it('[DRDMV-22637,DRDMV-22643,DRDMV-22653]: Verify CKE functionality on Create and Edit People Notes template', async () => {
            //add style
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.updateDescription(formatText);
            await ckeditorOpsPo.selectStyles('Heading 2');
            expect(await ckeditorValidationPo.isStyleApplied(formatText, 'h2')).toBeTruthy('Heading not set');
            //add Font Size 
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.selectFont("11");
            await ckeditorOpsPo.updateDescription(fontText);
            expect(await ckeditorValidationPo.isFontApplied(11, 'span')).toBeTruthy('Font not set');
            //upload image with URL
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnImageIcon();
            await ckeditorOpsPo.imageUploadWithURL(uploadURL, imageUrlFieldIndex, imageWidthFieldIndex, '100');
            expect(await ckeditorValidationPo.isImageDisplayedInCKE(uploadURL)).toBeTruthy('Image with URL not uploaded');
            //upload image with Local
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnImageIcon();
            imageSource1 = await ckeditorOpsPo.uploadImageFromLocal('Upload', '../../../data/ui/attachment/articleStatus.png', imageWidthFieldIndex, imageUrlFieldIndex, '50');
            expect(await ckeditorValidationPo.isImageDisplayedInCKE(imageSource1)).toBeTruthy();
            // Link added
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('Google', linkDisplayTextFieldIndex);
            await linkPropertiesPo.setValueOfLinkProperties('www.google.com', linkUrlFieldIndex);
            await linkPropertiesPo.clickOnTargetTab();
            await linkPropertiesPo.selectDropDown('_blank', linkTargetDropDownIndex);
            await linkPropertiesPo.clickOnOkBtn();
            expect(await ckeditorValidationPo.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('Link is not In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            //add table
            await ckeditorOpsPo.clickOnTableIcon();
            await tablePropertiesPo.setValueOfTableProperties('4', tableRowFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('10', tableColumnFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('500', tableWidthFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('200', tableHeightFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('new' + randomString, cellCaption);
            await tablePropertiesPo.setValueOfTableProperties('tableSummary', cellSummary);
            await tablePropertiesPo.clickOnOkButton();
            await ckeditorOpsPo.clickInTableCell(2, 2, 'tableSummary');
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            await ckeditorOpsPo.setDataInTable(2, 2, randomString, 'tableSummary');
            await ckeditorOpsPo.clickInTableCell(1, 2, 'tableSummary');
            await ckeditorOpsPo.clickOnRightAlignIcon();
            await ckeditorOpsPo.setDataInTable(1, 2, randomString, 'tableSummary');
            //upload image with Local
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnImageIcon();
            imageSource2 = await ckeditorOpsPo.uploadImageFromLocal('Upload', '../../../data/ui/attachment/bwfJpg.jpg', imageWidthFieldIndex, imageUrlFieldIndex, '50');
            expect(await ckeditorValidationPo.isImageDisplayedInCKE(imageSource2)).toBeTruthy();
            //upload image with URL
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnImageIcon();
            await ckeditorOpsPo.imageUploadWithURL(uploadURL, imageUrlFieldIndex, imageWidthFieldIndex, '100');
            expect(await ckeditorValidationPo.isImageDisplayedInCKE(uploadURL)).toBeTruthy('Image with URL not uploaded');
            //upload image with Local
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnImageIcon();
            imageSource1 = await ckeditorOpsPo.uploadImageFromLocal('Upload', '../../../data/ui/attachment/articleStatus.png', imageWidthFieldIndex, imageUrlFieldIndex, '50');
            expect(await ckeditorValidationPo.isImageDisplayedInCKE(imageSource1)).toBeTruthy();
            await createNotesTemplate.clickOnSaveButton();
            await utilCommon.closePopUpMessage();
        });
        it('[DRDMV-22637,DRDMV-22643,DRDMV-22653]: Verify CKE functionality on Create and Edit People Notes template', async () => {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(newCase.displayId);
            await viewCasePage.clickAssigneeLink();
            await utilityCommon.switchToNewTab(1);
            await personProfilePo.clickOnTab('Related Cases');
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(templateName);
            expect(await ckeditorValidationPo.isBoldTextDisplayedInCkEditorTextArea(boldText)).toBeTruthy('Text is not get Bold In Ck Editor');
            expect(await ckeditorValidationPo.isItalicTextDisplayedInCkEditorTextArea(italicText)).toBeTruthy('Text is not Italic In Ck Editor');
            expect(await ckeditorValidationPo.isUnderlineTextDisplayedInCkEditorTextArea(underLineText)).toBeTruthy('Text is not Underline In Ck Editor');
            expect(await ckeditorValidationPo.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('Text is not center Align In Ck Editor');
            expect(await ckeditorValidationPo.isTextLeftAlignInCkEditorTextArea(lefAlignText)).toBeTruthy('Text is not Left Align In Ck Editor');
            expect(await ckeditorValidationPo.isTableSummaryDisplayedInCkEditorTextArea('tableSummary')).toBeTruthy('Text is not Left Align In Ck Editor');
            await activityTabPo.clickOnPostButton();
            await activityTabPo.clickOnRefreshButton();
            await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.isBoldTextDisplayedInActivity(boldText, 1)).toBeTruthy('FailureMsg Bold Text is missing in Activity');
            expect(await activityTabPo.isItalicTextDisplayedInActivity(italicText, 1)).toBeTruthy('FailureMsg Italic Text is missing In Activity');
            expect(await activityTabPo.isUnderlineTextDisplayedInActivity(underLineText, 1)).toBeTruthy('FailureMsg Underline Text is missing In Activity');
            expect(await activityTabPo.isRightAlignTextDisplayedInActivity(rightAlignText, 1)).toBeTruthy('FailureMsg Right Align Text is missing In Activity');
            expect(await activityTabPo.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 1)).toBeTruthy('FailureMsg Link Text is missing In Activity');
            expect(await activityTabPo.isNumberListTextDisplayedInActivity('PlusOne', 1)).toBeTruthy('FailureMsg Number List Text is missing In Activity');
            expect(await activityTabPo.isBulletListTextDisplayedInActivity('BulletOne', 1)).toBeTruthy('FailureMsg Bullet List Text is missing In Activity');
            expect(await ckeditorValidationPo.isTableSummaryDisplayedInCkEditorTextArea('tableSummary')).toBeTruthy('Text is not Left Align In Ck Editor');
            expect(await activityTabPo.isCKImageDisplayedInActivity(imageSource1)).toBeTruthy('Image is not displayed');
            expect(await activityTabPo.isCKImageDisplayedInActivity(imageSource2)).toBeTruthy('Image is not displayed');
            expect(await activityTabPo.isCKImageDisplayedInActivity(uploadURL)).toBeTruthy('Image is not displayed');
        });
        it('[DRDMV-22637,DRDMV-22643,DRDMV-22653]: Verify CKE functionality on Create and Edit People Notes template', async () => {
            await navigationPage.signOut();
            await loginPage.login('22653User@petramco.com', 'Password_1234');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(newCase.displayId);
            await viewCasePage.clickAssigneeLink();
            await utilityCommon.switchToNewTab(1);
            await activityTabPo.clickOnRefreshButton();
            await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.isBoldTextDisplayedInActivity(boldText, 1)).toBeTruthy('FailureMsg Bold Text is missing in Activity');
            expect(await activityTabPo.isItalicTextDisplayedInActivity(italicText, 1)).toBeTruthy('FailureMsg Italic Text is missing In Activity');
            expect(await activityTabPo.isUnderlineTextDisplayedInActivity(underLineText, 1)).toBeTruthy('FailureMsg Underline Text is missing In Activity');
            expect(await activityTabPo.isRightAlignTextDisplayedInActivity(rightAlignText, 1)).toBeTruthy('FailureMsg Right Align Text is missing In Activity');
            expect(await activityTabPo.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 1)).toBeTruthy('FailureMsg Link Text is missing In Activity');
            expect(await activityTabPo.isNumberListTextDisplayedInActivity('PlusOne', 1)).toBeTruthy('FailureMsg Number List Text is missing In Activity');
            expect(await activityTabPo.isBulletListTextDisplayedInActivity('BulletOne', 1)).toBeTruthy('FailureMsg Bullet List Text is missing In Activity');
            expect(await ckeditorValidationPo.isTableSummaryDisplayedInCkEditorTextArea('tableSummary')).toBeTruthy('Text is not Left Align In Ck Editor');
            expect(await activityTabPo.isCKImageDisplayedInActivity(imageSource1)).toBeTruthy('Image is not displayed');
            expect(await activityTabPo.isCKImageDisplayedInActivity(uploadURL)).toBeTruthy('Image is not displayed');
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        });
    });

    describe('[DRDMV-22659]: Verify access of notes template to Case BA of Support group 2 which is created by other SG case BA', async () => {
        let updateBody: string, caseTemplateName: string, knowledgeTemplateName: string, peopleTemplateName: string, taskTemplateName: string, randomString = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        //Case
        it('[DRDMV-22659]: Verify access of notes template to Case BA of Support group 2 which is created by other SG case BA', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Notes Template', 'Activity Notes Template Console - Case - Business Workflows');
            await consoleNotesTemplate.clickOnCreateNotesTemplate();
            caseTemplateName = "caseNotesTemplate" + Math.floor(Math.random() * 100000);
            await createNotesTemplate.setTemplateName(caseTemplateName);
            await createNotesTemplate.setStatusValue('Active');
            await createNotesTemplate.setCompanyValue('Petramco');
            await createNotesTemplate.setBody("this is new actiivty notes template");
            // bold
            await ckeditorOpsPo.updateDescription("this is text ");
            await ckeditorOpsPo.clickOnBoldIcon();
            await ckeditorOpsPo.updateDescription(boldText);
            expect(await ckeditorValidationPo.isBoldTextDisplayedInCkEditorTextArea(boldText)).toBeTruthy('Text is not get Bold In Ck Editor');
            await ckeditorOpsPo.clickOnBoldIcon();
            //italic
            await ckeditorOpsPo.clickOnItalicIcon();
            await ckeditorOpsPo.updateDescription(italicText);
            expect(await ckeditorValidationPo.isItalicTextDisplayedInCkEditorTextArea(italicText)).toBeTruthy('Text is not Italic In Ck Editor');
            await ckeditorOpsPo.clickOnItalicIcon();
            //StrikeThrough
            await ckeditorOpsPo.clickOnStrikeThroughIcon();
            await ckeditorOpsPo.updateDescription(strikeThroughText);
            expect(await ckeditorValidationPo.isStrikeThroughTextDisplayedInCkEditorTextArea(strikeThroughText)).toBeTruthy('Text is not Strike Through In Ck Editor');
            await ckeditorOpsPo.clickOnStrikeThroughIcon();
            //underline
            await ckeditorOpsPo.clickOnUnderLineIcon();
            await ckeditorOpsPo.updateDescription(underLineText);
            expect(await ckeditorValidationPo.isUnderlineTextDisplayedInCkEditorTextArea(underLineText)).toBeTruthy('Text is not Underline In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnUnderLineIcon();
        });
        it('[DRDMV-22659]: Verify access of notes template to Case BA of Support group 2 which is created by other SG case BA', async () => {
            //left Align
            await ckeditorOpsPo.clickOnLeftAlignIcon();
            await ckeditorOpsPo.updateDescription(lefAlignText);
            expect(await ckeditorValidationPo.isTextLeftAlignInCkEditorTextArea(lefAlignText)).toBeTruthy('Text is not Left Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnLeftAlignIcon();
            //Right Align
            await ckeditorOpsPo.clickOnRightAlignIcon();
            await ckeditorOpsPo.updateDescription(rightAlignText);
            expect(await ckeditorValidationPo.isTextRightAlignInCkEditorTextArea(rightAlignText)).toBeTruthy('Text is not right Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnRightAlignIcon();
            //Center Align
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            await ckeditorOpsPo.updateDescription(centerAlignText);
            expect(await ckeditorValidationPo.isTextCenterAlignInCkEditorTextArea(centerAlignText)).toBeTruthy('Text is not center Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            //Justify Align
            await ckeditorOpsPo.clickOnJustifyAlignIcon();
            await ckeditorOpsPo.updateDescription(justifyAlignText);
            expect(await ckeditorValidationPo.isTextJustifyAlignInCkEditorTextArea(justifyAlignText)).toBeTruthy('Text is not justify Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnJustifyAlignIcon();
            //set color
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.selectColor('Strong Red');
            await ckeditorOpsPo.updateDescription(redColorText);
            expect(await ckeditorValidationPo.isColorTextDisplayedInCkEditorTextArea(redColorText, 'color:#c0392b;')).toBeTruthy('Color is not set In Ck Editor');
            //checking number list
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.setNumberList(['PlusOne']);
            expect(await ckeditorValidationPo.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('Number List is not In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            // checking bullot points
            await ckeditorOpsPo.setBulletList(['BulletOne']);
            expect(await ckeditorValidationPo.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('Bulleted List is not In Ck Editor');
            expect(await ckeditorValidationPo.getTextCkEditorMinimizeOrMiximize()).toBe('Maximize');
            await ckeditorOpsPo.clickMaximizeMinimizeIcon();
            expect(await ckeditorValidationPo.getTextCkEditorMinimizeOrMiximize()).toBe('Minimize');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickMaximizeMinimizeIcon();
        });
        it('[DRDMV-22659]: Verify access of notes template to Case BA of Support group 2 which is created by other SG case BA', async () => {
            //add style
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.updateDescription(formatText);
            await ckeditorOpsPo.selectStyles('Heading 2');
            expect(await ckeditorValidationPo.isStyleApplied(formatText, 'h2')).toBeTruthy('Heading not set');
            //add Font Size 
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.updateDescription(fontText);
            await ckeditorOpsPo.selectFont('11');
            expect(await ckeditorValidationPo.isFontApplied(11, 'span')).toBeTruthy('Font not set');
            //upload image with URL
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnImageIcon();
            await ckeditorOpsPo.imageUploadWithURL(uploadURL, imageUrlFieldIndex, imageWidthFieldIndex, '100');
            expect(await ckeditorValidationPo.isImageDisplayedInCKE(uploadURL)).toBeTruthy('Image with URL not uploaded');
            //upload image with Local
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnImageIcon();
            imageSource = await ckeditorOpsPo.uploadImageFromLocal('Upload', '../../../data/ui/attachment/articleStatus.png', imageWidthFieldIndex, imageUrlFieldIndex, '50');
            expect(await ckeditorValidationPo.isImageDisplayedInCKE(imageSource)).toBeTruthy();
            // Link added
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('Google', linkDisplayTextFieldIndex);
            await linkPropertiesPo.setValueOfLinkProperties('www.google.com', linkUrlFieldIndex);
            await linkPropertiesPo.clickOnTargetTab();
            await linkPropertiesPo.selectDropDown('_blank', linkTargetDropDownIndex);
            await linkPropertiesPo.clickOnOkBtn();
            expect(await ckeditorValidationPo.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('Link is not In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            //add table
            await ckeditorOpsPo.clickOnTableIcon();
            await tablePropertiesPo.setValueOfTableProperties('4', tableRowFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('10', tableColumnFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('500', tableWidthFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('200', tableHeightFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('new' + randomString, cellCaption);
            await tablePropertiesPo.setValueOfTableProperties('tableSummary', cellSummary);
            await tablePropertiesPo.clickOnOkButton();
            await ckeditorOpsPo.clickInTableCell(2, 2, 'tableSummary');
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            await ckeditorOpsPo.setDataInTable(2, 2, randomString, 'tableSummary');
            await ckeditorOpsPo.clickInTableCell(1, 2, 'tableSummary');
            await ckeditorOpsPo.clickOnRightAlignIcon();
            await ckeditorOpsPo.setDataInTable(1, 2, randomString, 'tableSummary');
            expect(await ckeditorValidationPo.getTableCellAlignText("text-align: center;")).toContain(randomString);
            await createNotesTemplate.clickOnSaveButton();
            await utilCommon.closePopUpMessage();
        });
        //Knowledge
        it('[DRDMV-22659]: Verify access of notes template to Case BA of Support group 2 which is created by other SG case BA', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Notes Template', 'Activity Notes Template Console - Knowledge - Business Workflows');
            await consoleNotesTemplate.clickOnCreateNotesTemplate();
            knowledgeTemplateName = "knowledgeNotesTemplate" + Math.floor(Math.random() * 100000);
            await createNotesTemplate.setTemplateName(knowledgeTemplateName);
            await createNotesTemplate.setStatusValue('Active');
            await createNotesTemplate.setCompanyValue('Petramco');
            await createNotesTemplate.setBody("this is new actiivty notes template");
            // bold
            await ckeditorOpsPo.updateDescription("this is text ");
            await ckeditorOpsPo.clickOnBoldIcon();
            await ckeditorOpsPo.updateDescription(boldText);
            expect(await ckeditorValidationPo.isBoldTextDisplayedInCkEditorTextArea(boldText)).toBeTruthy('Text is not get Bold In Ck Editor');
            await ckeditorOpsPo.clickOnBoldIcon();
            //italic
            await ckeditorOpsPo.clickOnItalicIcon();
            await ckeditorOpsPo.updateDescription(italicText);
            expect(await ckeditorValidationPo.isItalicTextDisplayedInCkEditorTextArea(italicText)).toBeTruthy('Text is not Italic In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnItalicIcon();
            //strikethrough
            await ckeditorOpsPo.clickOnStrikeThroughIcon();
            await ckeditorOpsPo.updateDescription(strikeThroughText);
            expect(await ckeditorValidationPo.isStrikeThroughTextDisplayedInCkEditorTextArea(strikeThroughText)).toBeTruthy('Text is not Strike Through In Ck Editor');
            await ckeditorOpsPo.clickOnStrikeThroughIcon();
            //underline
            await ckeditorOpsPo.clickOnUnderLineIcon();
            await ckeditorOpsPo.updateDescription(underLineText);
            expect(await ckeditorValidationPo.isUnderlineTextDisplayedInCkEditorTextArea(underLineText)).toBeTruthy('Text is not Underline In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnUnderLineIcon();
        });
        it('[DRDMV-22659]: Verify access of notes template to Case BA of Support group 2 which is created by other SG case BA', async () => {
            //left Align
            await ckeditorOpsPo.clickOnLeftAlignIcon();
            await ckeditorOpsPo.updateDescription(lefAlignText);
            expect(await ckeditorValidationPo.isTextLeftAlignInCkEditorTextArea(lefAlignText)).toBeTruthy('Text is not Left Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnLeftAlignIcon();
            //Right Align
            await ckeditorOpsPo.clickOnRightAlignIcon();
            await ckeditorOpsPo.updateDescription(rightAlignText);
            expect(await ckeditorValidationPo.isTextRightAlignInCkEditorTextArea(rightAlignText)).toBeTruthy('Text is not right Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnRightAlignIcon();
            //Center Align
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            await ckeditorOpsPo.updateDescription(centerAlignText);
            expect(await ckeditorValidationPo.isTextCenterAlignInCkEditorTextArea(centerAlignText)).toBeTruthy('Text is not center Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            //Justify Align
            await ckeditorOpsPo.clickOnJustifyAlignIcon();
            await ckeditorOpsPo.updateDescription(justifyAlignText);
            expect(await ckeditorValidationPo.isTextJustifyAlignInCkEditorTextArea(justifyAlignText)).toBeTruthy('Text is not justify Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnJustifyAlignIcon();
            //set color
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.selectColor('Strong Red');
            await ckeditorOpsPo.updateDescription(redColorText);
            expect(await ckeditorValidationPo.isColorTextDisplayedInCkEditorTextArea(redColorText, 'color:#c0392b;')).toBeTruthy('Color is not set In Ck Editor');
            //checking number list
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.setNumberList(['PlusOne']);
            expect(await ckeditorValidationPo.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('Number List is not In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            // checking bullot points
            await ckeditorOpsPo.setBulletList(['BulletOne']);
            expect(await ckeditorValidationPo.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('Bulleted List is not In Ck Editor');
            expect(await ckeditorValidationPo.getTextCkEditorMinimizeOrMiximize()).toBe('Maximize');
            await ckeditorOpsPo.clickMaximizeMinimizeIcon();
            expect(await ckeditorValidationPo.getTextCkEditorMinimizeOrMiximize()).toBe('Minimize');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickMaximizeMinimizeIcon();
        });
        it('[DRDMV-22659]: Verify access of notes template to Case BA of Support group 2 which is created by other SG case BA', async () => {
            //add style
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.updateDescription(formatText);
            await ckeditorOpsPo.selectStyles('Heading 2');
            expect(await ckeditorValidationPo.isStyleApplied(formatText, 'h2')).toBeTruthy('Heading not set');
            //add Font Size 
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.selectFont("11");
            await ckeditorOpsPo.updateDescription(fontText);
            expect(await ckeditorValidationPo.isFontApplied(11, 'span')).toBeTruthy('Font not set');
            //upload image with URL
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnImageIcon();
            await ckeditorOpsPo.imageUploadWithURL(uploadURL, imageUrlFieldIndex, imageWidthFieldIndex, '100');
            expect(await ckeditorValidationPo.isImageDisplayedInCKE(uploadURL)).toBeTruthy('Image with URL not uploaded');
            //upload image with Local
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnImageIcon();
            imageSource = await ckeditorOpsPo.uploadImageFromLocal('Upload', '../../../data/ui/attachment/articleStatus.png', imageWidthFieldIndex, imageUrlFieldIndex, '50');
            expect(await ckeditorValidationPo.isImageDisplayedInCKE(imageSource)).toBeTruthy();
            // Link added
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('Google', linkDisplayTextFieldIndex);
            await linkPropertiesPo.setValueOfLinkProperties('www.google.com', linkUrlFieldIndex);
            await linkPropertiesPo.clickOnTargetTab();
            await linkPropertiesPo.selectDropDown('_blank', linkTargetDropDownIndex);
            await linkPropertiesPo.clickOnOkBtn();
            expect(await ckeditorValidationPo.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('Link is not In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            //add table
            await ckeditorOpsPo.clickOnTableIcon();
            await tablePropertiesPo.setValueOfTableProperties('4', tableRowFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('10', tableColumnFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('500', tableWidthFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('200', tableHeightFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('new' + randomString, cellCaption);
            await tablePropertiesPo.setValueOfTableProperties('tableSummary', cellSummary);
            await tablePropertiesPo.clickOnOkButton();
            await ckeditorOpsPo.clickInTableCell(2, 2, 'tableSummary');
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            await ckeditorOpsPo.setDataInTable(2, 2, randomString, 'tableSummary');
            await ckeditorOpsPo.clickInTableCell(1, 2, 'tableSummary');
            await ckeditorOpsPo.clickOnRightAlignIcon();
            await ckeditorOpsPo.setDataInTable(1, 2, randomString, 'tableSummary');
            await createNotesTemplate.clickOnSaveButton();
            await utilCommon.closePopUpMessage();
        });
        //Pepole
        it('[DRDMV-22659]: Verify access of notes template to Case BA of Support group 2 which is created by other SG case BA', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('People--Notes Template', 'Activity Notes Template Console - Person - Business Workflows');
            await consoleNotesTemplate.clickOnCreateNotesTemplate();
            peopleTemplateName = "PeopleNotesTemplate" + Math.floor(Math.random() * 100000);
            await createNotesTemplate.setTemplateName(peopleTemplateName);
            await createNotesTemplate.setStatusValue('Active');
            await createNotesTemplate.setCompanyValue('Petramco');
            await createNotesTemplate.setBody("this is new actiivty notes template");
            // bold
            await ckeditorOpsPo.updateDescription("this is text ");
            await ckeditorOpsPo.clickOnBoldIcon();
            await ckeditorOpsPo.updateDescription(boldText);
            expect(await ckeditorValidationPo.isBoldTextDisplayedInCkEditorTextArea(boldText)).toBeTruthy('Text is not get Bold In Ck Editor');
            await ckeditorOpsPo.clickOnBoldIcon();
            //italic
            await ckeditorOpsPo.clickOnItalicIcon();
            await ckeditorOpsPo.updateDescription(italicText);
            expect(await ckeditorValidationPo.isItalicTextDisplayedInCkEditorTextArea(italicText)).toBeTruthy('Text is not Italic In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnItalicIcon();
            //strikethrough
            await ckeditorOpsPo.clickOnStrikeThroughIcon();
            await ckeditorOpsPo.updateDescription(strikeThroughText);
            expect(await ckeditorValidationPo.isStrikeThroughTextDisplayedInCkEditorTextArea(strikeThroughText)).toBeTruthy('Text is not Strike Through In Ck Editor');
            await ckeditorOpsPo.clickOnStrikeThroughIcon();
            //underline
            await ckeditorOpsPo.clickOnUnderLineIcon();
            await ckeditorOpsPo.updateDescription(underLineText);
            expect(await ckeditorValidationPo.isUnderlineTextDisplayedInCkEditorTextArea(underLineText)).toBeTruthy('Text is not Underline In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnUnderLineIcon();
        });
        it('[DRDMV-22659]: Verify access of notes template to Case BA of Support group 2 which is created by other SG case BA', async () => {
            //left Align
            await ckeditorOpsPo.clickOnLeftAlignIcon();
            await ckeditorOpsPo.updateDescription(lefAlignText);
            expect(await ckeditorValidationPo.isTextLeftAlignInCkEditorTextArea(lefAlignText)).toBeTruthy('Text is not Left Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnLeftAlignIcon();
            //Right Align
            await ckeditorOpsPo.clickOnRightAlignIcon();
            await ckeditorOpsPo.updateDescription(rightAlignText);
            expect(await ckeditorValidationPo.isTextRightAlignInCkEditorTextArea(rightAlignText)).toBeTruthy('Text is not right Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnRightAlignIcon();
            //Center Align
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            await ckeditorOpsPo.updateDescription(centerAlignText);
            expect(await ckeditorValidationPo.isTextCenterAlignInCkEditorTextArea(centerAlignText)).toBeTruthy('Text is not center Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            //Justify Align
            await ckeditorOpsPo.clickOnJustifyAlignIcon();
            await ckeditorOpsPo.updateDescription(justifyAlignText);
            expect(await ckeditorValidationPo.isTextJustifyAlignInCkEditorTextArea(justifyAlignText)).toBeTruthy('Text is not justify Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnJustifyAlignIcon();
            //set color
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.selectColor('Strong Red');
            await ckeditorOpsPo.updateDescription(redColorText);
            expect(await ckeditorValidationPo.isColorTextDisplayedInCkEditorTextArea(redColorText, 'color:#c0392b;')).toBeTruthy('Color is not set In Ck Editor');
            //checking number list
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.setNumberList(['PlusOne']);
            expect(await ckeditorValidationPo.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('Number List is not In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            // checking bullot points
            await ckeditorOpsPo.setBulletList(['BulletOne']);
            expect(await ckeditorValidationPo.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('Bulleted List is not In Ck Editor');
            expect(await ckeditorValidationPo.getTextCkEditorMinimizeOrMiximize()).toBe('Maximize');
            await ckeditorOpsPo.clickMaximizeMinimizeIcon();
            expect(await ckeditorValidationPo.getTextCkEditorMinimizeOrMiximize()).toBe('Minimize');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickMaximizeMinimizeIcon();
        });
        it('[DRDMV-22659]: Verify access of notes template to Case BA of Support group 2 which is created by other SG case BA', async () => {
            //add style
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.updateDescription(formatText);
            await ckeditorOpsPo.selectStyles('Heading 2');
            expect(await ckeditorValidationPo.isStyleApplied(formatText, 'h2')).toBeTruthy('Heading not set');
            //add Font Size 
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.selectFont("11");
            await ckeditorOpsPo.updateDescription(fontText);
            expect(await ckeditorValidationPo.isFontApplied(11, 'span')).toBeTruthy('Font not set');
            //upload image with URL
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnImageIcon();
            await ckeditorOpsPo.imageUploadWithURL(uploadURL, imageUrlFieldIndex, imageWidthFieldIndex, '100');
            expect(await ckeditorValidationPo.isImageDisplayedInCKE(uploadURL)).toBeTruthy('Image with URL not uploaded');
            //upload image with Local
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnImageIcon();
            imageSource1 = await ckeditorOpsPo.uploadImageFromLocal('Upload', '../../../data/ui/attachment/articleStatus.png', imageWidthFieldIndex, imageUrlFieldIndex, '50');
            expect(await ckeditorValidationPo.isImageDisplayedInCKE(imageSource1)).toBeTruthy();
            // Link added
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('Google', linkDisplayTextFieldIndex);
            await linkPropertiesPo.setValueOfLinkProperties('www.google.com', linkUrlFieldIndex);
            await linkPropertiesPo.clickOnTargetTab();
            await linkPropertiesPo.selectDropDown('_blank', linkTargetDropDownIndex);
            await linkPropertiesPo.clickOnOkBtn();
            expect(await ckeditorValidationPo.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('Link is not In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            //add table
            await ckeditorOpsPo.clickOnTableIcon();
            await tablePropertiesPo.setValueOfTableProperties('4', tableRowFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('10', tableColumnFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('500', tableWidthFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('200', tableHeightFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('new' + randomString, cellCaption);
            await tablePropertiesPo.setValueOfTableProperties('tableSummary', cellSummary);
            await tablePropertiesPo.clickOnOkButton();
            await ckeditorOpsPo.clickInTableCell(2, 2, 'tableSummary');
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            await ckeditorOpsPo.setDataInTable(2, 2, randomString, 'tableSummary');
            await ckeditorOpsPo.clickInTableCell(1, 2, 'tableSummary');
            await ckeditorOpsPo.clickOnRightAlignIcon();
            await ckeditorOpsPo.setDataInTable(1, 2, randomString, 'tableSummary');
            //upload image with Local
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnImageIcon();
            imageSource2 = await ckeditorOpsPo.uploadImageFromLocal('Upload', '../../../data/ui/attachment/bwfJpg.jpg', imageWidthFieldIndex, imageUrlFieldIndex, '50');
            expect(await ckeditorValidationPo.isImageDisplayedInCKE(imageSource2)).toBeTruthy();
            await createNotesTemplate.clickOnSaveButton();
            await utilCommon.closePopUpMessage();
        });
        //Task
        it('[DRDMV-22659]: Verify access of notes template to Case BA of Support group 2 which is created by other SG case BA', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Notes Template', 'Activity Notes Template Console - Task - Business Workflows');
            await consoleNotesTemplate.clickOnCreateNotesTemplate();
            taskTemplateName = "taskNotesTemplate" + Math.floor(Math.random() * 100000);
            await createNotesTemplate.setTemplateName(taskTemplateName);
            await createNotesTemplate.setStatusValue('Active');
            await createNotesTemplate.setCompanyValue('Petramco');
            await createNotesTemplate.setBody("this is new actiivty notes template");
            // bold
            await ckeditorOpsPo.updateDescription("this is text ");
            await ckeditorOpsPo.clickOnBoldIcon();
            await ckeditorOpsPo.updateDescription(boldText);
            expect(await ckeditorValidationPo.isBoldTextDisplayedInCkEditorTextArea(boldText)).toBeTruthy('Text is not get Bold In Ck Editor');
            await ckeditorOpsPo.clickOnBoldIcon();
            //italic
            await ckeditorOpsPo.clickOnItalicIcon();
            await ckeditorOpsPo.updateDescription(italicText);
            expect(await ckeditorValidationPo.isItalicTextDisplayedInCkEditorTextArea(italicText)).toBeTruthy('Text is not Italic In Ck Editor');
            await ckeditorOpsPo.clickOnItalicIcon();
            //underline
            await ckeditorOpsPo.clickOnUnderLineIcon();
            await ckeditorOpsPo.updateDescription(underLineText);
            expect(await ckeditorValidationPo.isUnderlineTextDisplayedInCkEditorTextArea(underLineText)).toBeTruthy('Text is not Underline In Ck Editor');
        });
        it('[DRDMV-22659]: Verify access of notes template to Case BA of Support group 2 which is created by other SG case BA', async () => {
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnUnderLineIcon();
            //left Align
            await ckeditorOpsPo.clickOnLeftAlignIcon();
            await ckeditorOpsPo.updateDescription(lefAlignText);
            expect(await ckeditorValidationPo.isTextLeftAlignInCkEditorTextArea(lefAlignText)).toBeTruthy('Text is not Left Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnLeftAlignIcon();
            //Right Align
            await ckeditorOpsPo.clickOnRightAlignIcon();
            await ckeditorOpsPo.updateDescription(rightAlignText);
            expect(await ckeditorValidationPo.isTextRightAlignInCkEditorTextArea(rightAlignText)).toBeTruthy('Text is not right Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnRightAlignIcon();
            //Center Align
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            await ckeditorOpsPo.updateDescription(centerAlignText);
            expect(await ckeditorValidationPo.isTextCenterAlignInCkEditorTextArea(centerAlignText)).toBeTruthy('Text is not center Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            //set color
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.selectColor('Strong Red');
            await ckeditorOpsPo.updateDescription(redColorText);
            expect(await ckeditorValidationPo.isColorTextDisplayedInCkEditorTextArea(redColorText, 'color:#c0392b;')).toBeTruthy('Color is not set In Ck Editor');
            //checking number list
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.setNumberList(['PlusOne']);
            expect(await ckeditorValidationPo.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('Number List is not In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            // checking bullot points
            await ckeditorOpsPo.setBulletList(['BulletOne']);
            expect(await ckeditorValidationPo.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('Bulleted List is not In Ck Editor');
            expect(await ckeditorValidationPo.getTextCkEditorMinimizeOrMiximize()).toBe('Maximize');
            await ckeditorOpsPo.clickMaximizeMinimizeIcon();
            expect(await ckeditorValidationPo.getTextCkEditorMinimizeOrMiximize()).toBe('Minimize');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickMaximizeMinimizeIcon();
        });
        it('[DRDMV-22659]: Verify access of notes template to Case BA of Support group 2 which is created by other SG case BA', async () => {
            //add style
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.updateDescription(formatText);
            await ckeditorOpsPo.selectStyles('Heading 2');
            expect(await ckeditorValidationPo.isStyleApplied(formatText, 'h2')).toBeTruthy('Heading not set');
            //upload image with URL
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnImageIcon();
            await ckeditorOpsPo.imageUploadWithURL(uploadURL, imageUrlFieldIndex, imageWidthFieldIndex, '100');
            expect(await ckeditorValidationPo.isImageDisplayedInCKE(uploadURL)).toBeTruthy('Image with URL not uploaded');
            //upload image with Local
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnImageIcon();
            imageSource = await ckeditorOpsPo.uploadImageFromLocal('Upload', '../../../data/ui/attachment/articleStatus.png', imageWidthFieldIndex, imageUrlFieldIndex, '50');
            expect(await ckeditorValidationPo.isImageDisplayedInCKE(imageSource)).toBeTruthy();
            // Link added
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('Google', linkDisplayTextFieldIndex);
            await linkPropertiesPo.setValueOfLinkProperties('www.google.com', linkUrlFieldIndex);
            await linkPropertiesPo.clickOnTargetTab();
            await linkPropertiesPo.selectDropDown('_blank', linkTargetDropDownIndex);
            await linkPropertiesPo.clickOnOkBtn();
            expect(await ckeditorValidationPo.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('Link is not In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            //add table
            await ckeditorOpsPo.clickOnTableIcon();
            await tablePropertiesPo.setValueOfTableProperties('4', tableRowFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('10', tableColumnFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('500', tableWidthFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('200', tableHeightFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('new' + randomString, cellCaption);
            await tablePropertiesPo.setValueOfTableProperties('tableSummary', cellSummary);
            await tablePropertiesPo.clickOnOkButton();
            await ckeditorOpsPo.clickInTableCell(2, 2, 'tableSummary');
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            await ckeditorOpsPo.setDataInTable(2, 2, randomString, 'tableSummary');
            await ckeditorOpsPo.clickInTableCell(1, 2, 'tableSummary');
            await ckeditorOpsPo.clickOnRightAlignIcon();
            await ckeditorOpsPo.setDataInTable(1, 2, randomString, 'tableSummary');
            await createNotesTemplate.clickOnSaveButton();
            await utilCommon.closePopUpMessage();
        });
        it('[DRDMV-22659]: Verify access of notes template to Case BA of Support group 2 which is created by other SG case BA', async () => {
            await navigationPage.signOut();
            await loginPage.login('22653User@petramco.com', 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Notes Template', 'Activity Notes Template Console - Task - Business Workflows');
            await consoleNotesTemplate.searchAndClickOnNotesTemplate(taskTemplateName);
            updateBody = "UpdateTaskNotesTemplate" + Math.floor(Math.random() * 100000);
            await editNotetemplate.changeStatusValue('Inactive');
            await editNotetemplate.updateBody(updateBody);
            await editNotetemplate.clickOnSaveButton();
            await consoleNotesTemplate.searchAndClickOnNotesTemplate(taskTemplateName);
            expect(await editNotetemplate.getBodyValue()).toContain(updateBody);
            await editNotetemplate.clickOnCancelButton();
            await utilCommon.clickOnWarningOk();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('People--Notes Template', 'Activity Notes Template Console - Person - Business Workflows');
            await consoleNotesTemplate.searchAndClickOnNotesTemplate(peopleTemplateName);
            updateBody = "UpdatePeopleNotesTemplate" + Math.floor(Math.random() * 100000);
            await editNotetemplate.changeStatusValue('Inactive');
            await editNotetemplate.updateBody(updateBody);
            await editNotetemplate.clickOnSaveButton();
            await consoleNotesTemplate.searchAndClickOnNotesTemplate(peopleTemplateName);
            expect(await editNotetemplate.getBodyValue()).toContain(updateBody);
            await editNotetemplate.clickOnCancelButton();
            await utilCommon.clickOnWarningOk();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Notes Template', 'Activity Notes Template Console - Knowledge - Business Workflows');
            await consoleNotesTemplate.searchAndClickOnNotesTemplate(knowledgeTemplateName);
            updateBody = "UpdateKnowledgeNotesTemplate" + Math.floor(Math.random() * 100000);
            await editNotetemplate.changeStatusValue('Inactive');
            await editNotetemplate.updateBody(updateBody);
            await editNotetemplate.clickOnSaveButton();
            await consoleNotesTemplate.searchAndClickOnNotesTemplate(knowledgeTemplateName);
            expect(await editNotetemplate.getBodyValue()).toContain(updateBody);
            await editNotetemplate.clickOnCancelButton();
            await utilCommon.clickOnWarningOk();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Notes Template', 'Activity Notes Template Console - Case - Business Workflows');
            await consoleNotesTemplate.searchAndClickOnNotesTemplate(caseTemplateName);
            updateBody = "UpdateCaseNotesTemplate" + Math.floor(Math.random() * 100000);
            await editNotetemplate.changeStatusValue('Inactive');
            await editNotetemplate.updateBody(updateBody);
            await editNotetemplate.clickOnSaveButton();
            await consoleNotesTemplate.searchAndClickOnNotesTemplate(caseTemplateName);
            expect(await editNotetemplate.getBodyValue()).toContain(updateBody);
            await editNotetemplate.clickOnCancelButton();
            await utilCommon.clickOnWarningOk();
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //Fail Due to DRDMV-22994
    describe('[DRDMV-22641,DRDMV-22645,DRDMV-22656]: Verify CKE functionality on Create and Edit Task Notes template', async () => {
        let templateName: string, templateData, casetemplatePetramco, externaltemplateData, newCaseTemplate, automatedtemplateData, readAccessMappingData, newCase, randomString = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            casetemplatePetramco = {
                "templateName": 'caseTemplateName' + randomString,
                "templateSummary": 'caseTemplateName' + randomString,
                "templateStatus": "Active",
                "categoryTier1": "Purchasing Card",
                "categoryTier2": "Policies",
                "categoryTier3": "Card Issuance",
                "casePriority": "Low",
                "caseStatus": "New",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }
            newCaseTemplate = await apiHelper.createCaseTemplate(casetemplatePetramco);
            templateData = {
                "templateName": 'Manual task' + randomString,
                "templateSummary": 'Manual task' + randomString,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
            }
            let manualTaskTemplate = await apiHelper.createManualTaskTemplate(templateData);
            externaltemplateData = {
                "templateName": 'External task' + randomString,
                "templateSummary": 'External task' + randomString,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
            }
            let externalTaskTemplate = await apiHelper.createExternalTaskTemplate(externaltemplateData);
            automatedtemplateData = {
                "templateName": 'Automated task' + randomString,
                "templateSummary": 'Automated task' + randomString,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": 'Auto Proces' + randomString,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
            }
            readAccessMappingData = {
                "configName": randomString + '1ReadAccessMappingName',
                "assignedCompany": 'Petramco',
                "businessUnit": 'Facilities Support',
                "supportGroup": 'Facilities',
                "company": 'Petramco',
                "priority": "Low",
            }
            await apiHelper.createReadAccessMapping(readAccessMappingData);
            let automatedTaskTemplate = await apiHelper.createAutomatedTaskTemplate(automatedtemplateData);
            await apiHelper.associateCaseTemplateWithThreeTaskTemplate(newCaseTemplate.displayId, manualTaskTemplate.displayId, externalTaskTemplate.displayId, automatedTaskTemplate.displayId);
        });
        it('[DRDMV-22641,DRDMV-22645,DRDMV-22656]: Verify CKE functionality on Create and Edit Task Notes template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Notes Template', 'Activity Notes Template Console - Task - Business Workflows');
            await consoleNotesTemplate.clickOnCreateNotesTemplate();
            templateName = "taskNotesTemplate" + Math.floor(Math.random() * 100000);
            await createNotesTemplate.setTemplateName(templateName);
            await createNotesTemplate.setStatusValue('Active');
            await createNotesTemplate.setCompanyValue('Petramco');
            await createNotesTemplate.setBody("this is new actiivty notes template");
            // bold
            await ckeditorOpsPo.updateDescription("this is text ");
            await ckeditorOpsPo.clickOnBoldIcon();
            await ckeditorOpsPo.updateDescription(boldText);
            expect(await ckeditorValidationPo.isBoldTextDisplayedInCkEditorTextArea(boldText)).toBeTruthy('Text is not get Bold In Ck Editor');
            await ckeditorOpsPo.clickOnBoldIcon();
            //italic
            await ckeditorOpsPo.clickOnItalicIcon();
            await ckeditorOpsPo.updateDescription(italicText);
            expect(await ckeditorValidationPo.isItalicTextDisplayedInCkEditorTextArea(italicText)).toBeTruthy('Text is not Italic In Ck Editor');
            await ckeditorOpsPo.clickOnItalicIcon();
            //underline
            await ckeditorOpsPo.clickOnUnderLineIcon();
            await ckeditorOpsPo.updateDescription(underLineText);
            expect(await ckeditorValidationPo.isUnderlineTextDisplayedInCkEditorTextArea(underLineText)).toBeTruthy('Text is not Underline In Ck Editor');
        });
        it('[DRDMV-22641,DRDMV-22645,DRDMV-22656]: Verify CKE functionality on Create and Edit Task Notes template', async () => {
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnUnderLineIcon();
            //left Align
            await ckeditorOpsPo.clickOnLeftAlignIcon();
            await ckeditorOpsPo.updateDescription(lefAlignText);
            expect(await ckeditorValidationPo.isTextLeftAlignInCkEditorTextArea(lefAlignText)).toBeTruthy('Text is not Left Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnLeftAlignIcon();
            //Right Align
            await ckeditorOpsPo.clickOnRightAlignIcon();
            await ckeditorOpsPo.updateDescription(rightAlignText);
            expect(await ckeditorValidationPo.isTextRightAlignInCkEditorTextArea(rightAlignText)).toBeTruthy('Text is not right Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnRightAlignIcon();
            //Center Align
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            await ckeditorOpsPo.updateDescription(centerAlignText);
            expect(await ckeditorValidationPo.isTextCenterAlignInCkEditorTextArea(centerAlignText)).toBeTruthy('Text is not center Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            //set color
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.selectColor('Strong Red');
            await ckeditorOpsPo.updateDescription(redColorText);
            expect(await ckeditorValidationPo.isColorTextDisplayedInCkEditorTextArea(redColorText, 'color:#c0392b;')).toBeTruthy('Color is not set In Ck Editor');
            //checking number list
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.setNumberList(['PlusOne']);
            expect(await ckeditorValidationPo.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('Number List is not In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            // checking bullot points
            await ckeditorOpsPo.setBulletList(['BulletOne']);
            expect(await ckeditorValidationPo.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('Bulleted List is not In Ck Editor');
            expect(await ckeditorValidationPo.getTextCkEditorMinimizeOrMiximize()).toBe('Maximize');
            await ckeditorOpsPo.clickMaximizeMinimizeIcon();
            expect(await ckeditorValidationPo.getTextCkEditorMinimizeOrMiximize()).toBe('Minimize');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickMaximizeMinimizeIcon();
        });
        it('[DRDMV-22641,DRDMV-22645,DRDMV-22656]: Verify CKE functionality on Create and Edit Task Notes template', async () => {
            //add style
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.updateDescription(formatText);
            await ckeditorOpsPo.selectStyles('Heading 2');
            expect(await ckeditorValidationPo.isStyleApplied(formatText, 'h2')).toBeTruthy('Heading not set');
            //upload image with URL
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnImageIcon();
            await ckeditorOpsPo.imageUploadWithURL(uploadURL, imageUrlFieldIndex, imageWidthFieldIndex, '100');
            expect(await ckeditorValidationPo.isImageDisplayedInCKE(uploadURL)).toBeTruthy('Image with URL not uploaded');
            //upload image with Local
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnImageIcon();
            imageSource = await ckeditorOpsPo.uploadImageFromLocal('Upload', '../../../data/ui/attachment/articleStatus.png', imageWidthFieldIndex, imageUrlFieldIndex, '50');
            expect(await ckeditorValidationPo.isImageDisplayedInCKE(imageSource)).toBeTruthy();
            // Link added
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('Google', linkDisplayTextFieldIndex);
            await linkPropertiesPo.setValueOfLinkProperties('www.google.com', linkUrlFieldIndex);
            await linkPropertiesPo.clickOnTargetTab();
            await linkPropertiesPo.selectDropDown('_blank', linkTargetDropDownIndex);
            await linkPropertiesPo.clickOnOkBtn();
            expect(await ckeditorValidationPo.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('Link is not In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            //add table
            await ckeditorOpsPo.clickOnTableIcon();
            await tablePropertiesPo.setValueOfTableProperties('4', tableRowFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('10', tableColumnFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('500', tableWidthFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('200', tableHeightFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('new' + randomString, cellCaption);
            await tablePropertiesPo.setValueOfTableProperties('tableSummary', cellSummary);
            await tablePropertiesPo.clickOnOkButton();
            await ckeditorOpsPo.clickInTableCell(2, 2, 'tableSummary');
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            await ckeditorOpsPo.setDataInTable(2, 2, randomString, 'tableSummary');
            await ckeditorOpsPo.clickInTableCell(1, 2, 'tableSummary');
            await ckeditorOpsPo.clickOnRightAlignIcon();
            await ckeditorOpsPo.setDataInTable(1, 2, randomString, 'tableSummary');
            await createNotesTemplate.clickOnSaveButton();
            await utilCommon.closePopUpMessage();
        });
        it('[DRDMV-22641,DRDMV-22645,DRDMV-22656]: Verify CKE functionality on Create and Edit Task Notes template', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName("adam");
            await quickCasePo.selectCaseTemplate(casetemplatePetramco.templateName);
            await quickCasePo.setCaseSummary("CaseSummary" + randomString);
            await quickCasePo.saveCase();
            await quickCasePo.gotoCaseButton();
            await viewCasePage.clickOnTab('Case Access');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('Facilities', 'Read')).toBeTruthy('FailuerMsg1: Support Group Name is missing');
            await viewCasePage.clickOnTab('Tasks');
            await viewCasePage.clickOnTaskLink(templateData.templateName);
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate('taskNotesTemplate87163');
            await activityTabPo.addActivityNote(randomString);
            expect(await ckeditorValidationPo.isBoldTextDisplayedInCkEditorTextArea(boldText)).toBeTruthy('Text is not get Bold In Ck Editor');
            expect(await ckeditorValidationPo.isItalicTextDisplayedInCkEditorTextArea(italicText)).toBeTruthy('Text is not Italic In Ck Editor');
            expect(await ckeditorValidationPo.isUnderlineTextDisplayedInCkEditorTextArea(underLineText)).toBeTruthy('Text is not Underline In Ck Editor');
            expect(await ckeditorValidationPo.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('Text is not center Align In Ck Editor');
            expect(await ckeditorValidationPo.isTextLeftAlignInCkEditorTextArea(lefAlignText)).toBeTruthy('Text is not Left Align In Ck Editor');
            expect(await ckeditorValidationPo.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('Text is not center Align In Ck Editor');
            expect(await ckeditorValidationPo.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('Text is not center Align In Ck Editor');
            await activityTabPo.clickOnPostButton();
            await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.isBoldTextDisplayedInActivity(boldText, 1)).toBeTruthy('FailureMsg Bold Text is missing in Activity');
            expect(await activityTabPo.isItalicTextDisplayedInActivity(italicText, 1)).toBeTruthy('FailureMsg Italic Text is missing In Activity');
            expect(await activityTabPo.isUnderlineTextDisplayedInActivity(underLineText, 1)).toBeTruthy('FailureMsg Underline Text is missing In Activity');
            expect(await activityTabPo.isRightAlignTextDisplayedInActivity(rightAlignText, 1)).toBeTruthy('FailureMsg Right Align Text is missing In Activity');
            expect(await activityTabPo.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 1)).toBeTruthy('FailureMsg Link Text is missing In Activity');
            expect(await activityTabPo.isNumberListTextDisplayedInActivity('PlusOne', 1)).toBeTruthy('FailureMsg Number List Text is missing In Activity');
            expect(await activityTabPo.isBulletListTextDisplayedInActivity('BulletOne', 1)).toBeTruthy('FailureMsg Bullet List Text is missing In Activity');
            await viewTaskPo.clickOnViewCase();
        });
        it('[DRDMV-22641,DRDMV-22645,DRDMV-22656]: Verify CKE functionality on Create and Edit Task Notes template', async () => {
            await viewCasePage.clickOnTaskLink(externaltemplateData.templateName);
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate('taskNotesTemplate87163');
            await activityTabPo.addActivityNote(randomString);
            expect(await ckeditorValidationPo.isBoldTextDisplayedInCkEditorTextArea(boldText)).toBeTruthy('Text is not get Bold In Ck Editor');
            expect(await ckeditorValidationPo.isItalicTextDisplayedInCkEditorTextArea(italicText)).toBeTruthy('Text is not Italic In Ck Editor');
            expect(await ckeditorValidationPo.isUnderlineTextDisplayedInCkEditorTextArea(underLineText)).toBeTruthy('Text is not Underline In Ck Editor');
            expect(await ckeditorValidationPo.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('Text is not center Align In Ck Editor');
            expect(await ckeditorValidationPo.isTextLeftAlignInCkEditorTextArea(lefAlignText)).toBeTruthy('Text is not Left Align In Ck Editor');
            expect(await ckeditorValidationPo.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('Text is not center Align In Ck Editor');
            expect(await ckeditorValidationPo.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('Text is not center Align In Ck Editor');
            await activityTabPo.clickOnPostButton();
            await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.isBoldTextDisplayedInActivity(boldText, 1)).toBeTruthy('FailureMsg Bold Text is missing in Activity');
            expect(await activityTabPo.isItalicTextDisplayedInActivity(italicText, 1)).toBeTruthy('FailureMsg Italic Text is missing In Activity');
            expect(await activityTabPo.isUnderlineTextDisplayedInActivity(underLineText, 1)).toBeTruthy('FailureMsg Underline Text is missing In Activity');
            expect(await activityTabPo.isRightAlignTextDisplayedInActivity(rightAlignText, 1)).toBeTruthy('FailureMsg Right Align Text is missing In Activity');
            expect(await activityTabPo.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 1)).toBeTruthy('FailureMsg Link Text is missing In Activity');
            expect(await activityTabPo.isNumberListTextDisplayedInActivity('PlusOne', 1)).toBeTruthy('FailureMsg Number List Text is missing In Activity');
            expect(await activityTabPo.isBulletListTextDisplayedInActivity('BulletOne', 1)).toBeTruthy('FailureMsg Bullet List Text is missing In Activity');
            await viewTaskPo.clickOnViewCase();
            await activityTabPo.clickOnShowMore();
        });
        it('[DRDMV-22641,DRDMV-22645,DRDMV-22656]: Verify CKE functionality on Create and Edit Task Notes template', async () => {
            await viewCasePage.clickOnTaskLink(automatedtemplateData.templateName);
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate('taskNotesTemplate87163');
            await activityTabPo.addActivityNote(randomString);
            expect(await ckeditorValidationPo.isBoldTextDisplayedInCkEditorTextArea(boldText)).toBeTruthy('Text is not get Bold In Ck Editor');
            expect(await ckeditorValidationPo.isItalicTextDisplayedInCkEditorTextArea(italicText)).toBeTruthy('Text is not Italic In Ck Editor');
            expect(await ckeditorValidationPo.isUnderlineTextDisplayedInCkEditorTextArea(underLineText)).toBeTruthy('Text is not Underline In Ck Editor');
            expect(await ckeditorValidationPo.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('Text is not center Align In Ck Editor');
            expect(await ckeditorValidationPo.isTextLeftAlignInCkEditorTextArea(lefAlignText)).toBeTruthy('Text is not Left Align In Ck Editor');
            expect(await ckeditorValidationPo.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('Text is not center Align In Ck Editor');
            expect(await ckeditorValidationPo.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('Text is not center Align In Ck Editor');
            await activityTabPo.clickOnPostButton();
            await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.isBoldTextDisplayedInActivity(boldText, 1)).toBeTruthy('FailureMsg Bold Text is missing in Activity');
            expect(await activityTabPo.isItalicTextDisplayedInActivity(italicText, 1)).toBeTruthy('FailureMsg Italic Text is missing In Activity');
            expect(await activityTabPo.isUnderlineTextDisplayedInActivity(underLineText, 1)).toBeTruthy('FailureMsg Underline Text is missing In Activity');
            expect(await activityTabPo.isRightAlignTextDisplayedInActivity(rightAlignText, 1)).toBeTruthy('FailureMsg Right Align Text is missing In Activity');
            expect(await activityTabPo.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 1)).toBeTruthy('FailureMsg Link Text is missing In Activity');
            expect(await activityTabPo.isNumberListTextDisplayedInActivity('PlusOne', 1)).toBeTruthy('FailureMsg Number List Text is missing In Activity');
            expect(await activityTabPo.isBulletListTextDisplayedInActivity('BulletOne', 1)).toBeTruthy('FailureMsg Bullet List Text is missing In Activity');
            await viewTaskPo.clickOnViewCase();
        });
        it('[DRDMV-22641,DRDMV-22645,DRDMV-22656]: Verify CKE functionality on Create and Edit Task Notes template', async () => {
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(casetemplatePetramco.templateSummary);
            await viewCasePage.clickOnTaskLink(templateData.templateName);
            await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.isBoldTextDisplayedInActivity(boldText, 1)).toBeTruthy('FailureMsg Bold Text is missing in Activity');
            expect(await activityTabPo.isItalicTextDisplayedInActivity(italicText, 1)).toBeTruthy('FailureMsg Italic Text is missing In Activity');
            expect(await activityTabPo.isUnderlineTextDisplayedInActivity(underLineText, 1)).toBeTruthy('FailureMsg Underline Text is missing In Activity');
            expect(await activityTabPo.isRightAlignTextDisplayedInActivity(rightAlignText, 1)).toBeTruthy('FailureMsg Right Align Text is missing In Activity');
            expect(await activityTabPo.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 1)).toBeTruthy('FailureMsg Link Text is missing In Activity');
            expect(await activityTabPo.isNumberListTextDisplayedInActivity('PlusOne', 1)).toBeTruthy('FailureMsg Number List Text is missing In Activity');
            expect(await activityTabPo.isBulletListTextDisplayedInActivity('BulletOne', 1)).toBeTruthy('FailureMsg Bullet List Text is missing In Activity');
            await viewTaskPo.clickOnViewCase();
            await viewCasePage.clickOnTaskLink(automatedtemplateData.templateName);
            await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.isBoldTextDisplayedInActivity(boldText, 1)).toBeTruthy('FailureMsg Bold Text is missing in Activity');
            expect(await activityTabPo.isItalicTextDisplayedInActivity(italicText, 1)).toBeTruthy('FailureMsg Italic Text is missing In Activity');
            expect(await activityTabPo.isUnderlineTextDisplayedInActivity(underLineText, 1)).toBeTruthy('FailureMsg Underline Text is missing In Activity');
            expect(await activityTabPo.isRightAlignTextDisplayedInActivity(rightAlignText, 1)).toBeTruthy('FailureMsg Right Align Text is missing In Activity');
            expect(await activityTabPo.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 1)).toBeTruthy('FailureMsg Link Text is missing In Activity');
            expect(await activityTabPo.isNumberListTextDisplayedInActivity('PlusOne', 1)).toBeTruthy('FailureMsg Number List Text is missing In Activity');
            expect(await activityTabPo.isBulletListTextDisplayedInActivity('BulletOne', 1)).toBeTruthy('FailureMsg Bullet List Text is missing In Activity');
            await viewTaskPo.clickOnViewCase();
            await viewCasePage.clickOnTaskLink(externaltemplateData.templateName);
            await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.isBoldTextDisplayedInActivity(boldText, 1)).toBeTruthy('FailureMsg Bold Text is missing in Activity');
            expect(await activityTabPo.isItalicTextDisplayedInActivity(italicText, 1)).toBeTruthy('FailureMsg Italic Text is missing In Activity');
            expect(await activityTabPo.isUnderlineTextDisplayedInActivity(underLineText, 1)).toBeTruthy('FailureMsg Underline Text is missing In Activity');
            expect(await activityTabPo.isRightAlignTextDisplayedInActivity(rightAlignText, 1)).toBeTruthy('FailureMsg Right Align Text is missing In Activity');
            expect(await activityTabPo.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 1)).toBeTruthy('FailureMsg Link Text is missing In Activity');
            expect(await activityTabPo.isNumberListTextDisplayedInActivity('PlusOne', 1)).toBeTruthy('FailureMsg Number List Text is missing In Activity');
            expect(await activityTabPo.isBulletListTextDisplayedInActivity('BulletOne', 1)).toBeTruthy('FailureMsg Bullet List Text is missing In Activity');
            await viewTaskPo.clickOnViewCase();
        });
        it('[DRDMV-22641,DRDMV-22645,DRDMV-22656]: Verify CKE functionality on Create and Edit Task Notes template', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(casetemplatePetramco.templateSummary);
            await viewCasePage.clickOnTaskLink(templateData.templateName);
            await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.isBoldTextDisplayedInActivity(boldText, 1)).toBeTruthy('FailureMsg Bold Text is missing in Activity');
            expect(await activityTabPo.isItalicTextDisplayedInActivity(italicText, 1)).toBeTruthy('FailureMsg Italic Text is missing In Activity');
            expect(await activityTabPo.isUnderlineTextDisplayedInActivity(underLineText, 1)).toBeTruthy('FailureMsg Underline Text is missing In Activity');
            expect(await activityTabPo.isRightAlignTextDisplayedInActivity(rightAlignText, 1)).toBeTruthy('FailureMsg Right Align Text is missing In Activity');
            expect(await activityTabPo.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 1)).toBeTruthy('FailureMsg Link Text is missing In Activity');
            expect(await activityTabPo.isNumberListTextDisplayedInActivity('PlusOne', 1)).toBeTruthy('FailureMsg Number List Text is missing In Activity');
            expect(await activityTabPo.isBulletListTextDisplayedInActivity('BulletOne', 1)).toBeTruthy('FailureMsg Bullet List Text is missing In Activity');
            await viewTaskPo.clickOnViewCase();
            await viewCasePage.clickOnTaskLink(automatedtemplateData.templateName);
            await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.isBoldTextDisplayedInActivity(boldText, 1)).toBeTruthy('FailureMsg Bold Text is missing in Activity');
            expect(await activityTabPo.isItalicTextDisplayedInActivity(italicText, 1)).toBeTruthy('FailureMsg Italic Text is missing In Activity');
            expect(await activityTabPo.isUnderlineTextDisplayedInActivity(underLineText, 1)).toBeTruthy('FailureMsg Underline Text is missing In Activity');
            expect(await activityTabPo.isRightAlignTextDisplayedInActivity(rightAlignText, 1)).toBeTruthy('FailureMsg Right Align Text is missing In Activity');
            expect(await activityTabPo.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 1)).toBeTruthy('FailureMsg Link Text is missing In Activity');
            expect(await activityTabPo.isNumberListTextDisplayedInActivity('PlusOne', 1)).toBeTruthy('FailureMsg Number List Text is missing In Activity');
            expect(await activityTabPo.isBulletListTextDisplayedInActivity('BulletOne', 1)).toBeTruthy('FailureMsg Bullet List Text is missing In Activity');
            await viewTaskPo.clickOnViewCase();
            await viewCasePage.clickOnTaskLink(externaltemplateData.templateName);
            await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.isBoldTextDisplayedInActivity(boldText, 1)).toBeTruthy('FailureMsg Bold Text is missing in Activity');
            expect(await activityTabPo.isItalicTextDisplayedInActivity(italicText, 1)).toBeTruthy('FailureMsg Italic Text is missing In Activity');
            expect(await activityTabPo.isUnderlineTextDisplayedInActivity(underLineText, 1)).toBeTruthy('FailureMsg Underline Text is missing In Activity');
            expect(await activityTabPo.isRightAlignTextDisplayedInActivity(rightAlignText, 1)).toBeTruthy('FailureMsg Right Align Text is missing In Activity');
            expect(await activityTabPo.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 1)).toBeTruthy('FailureMsg Link Text is missing In Activity');
            expect(await activityTabPo.isNumberListTextDisplayedInActivity('PlusOne', 1)).toBeTruthy('FailureMsg Number List Text is missing In Activity');
            expect(await activityTabPo.isBulletListTextDisplayedInActivity('BulletOne', 1)).toBeTruthy('FailureMsg Bullet List Text is missing In Activity');
            await viewTaskPo.clickOnViewCase();
        });
    });
});
