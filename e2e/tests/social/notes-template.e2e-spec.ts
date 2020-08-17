import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import { NOTES_TEMPLATE_MANDATORY_FIELD } from '../../data/ui/Social/notesTemplate.api';
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
import caseAccessTabPo from '../../pageobject/common/case-access-tab.po';
import editKnowledgeAccessPo from '../../pageobject/knowledge/knowledge-access-tab.po';
import changeAssignmentBladePo from '../../pageobject/common/change-assignment-blade.po';
import knowledgeArticlesConsolePo from '../../pageobject/knowledge/knowledge-articles-console.po';
import quickCasePo from '../../pageobject/case/quick-case.po';
import viewTaskPo from '../../pageobject/task/view-task.po';
import personProfilePo from '../../pageobject/common/person-profile.po';

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
let userData = undefined;
describe('Notes template', () => {
    beforeAll(async () => {
        const caseModule = 'Case';
        await browser.get(BWF_BASE_URL);
        await loginPage.login("elizabeth");
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteApprovalMapping(caseModule);
        userData = {
            "firstName": "Petramco",
            "lastName": "SGUser1",
            "userId": "22653User",
            "userPermission": "AGGAA5V0GE9Z4AOR7DBBOQLAW74PH7;AGGAA5V0GEON8AOZHHGIOY0UZNXGOR;AGGAA5V0H3XY6AOTLKINOSP72R7YAE;AGGAA5V0H3XY6AOTLL9ROSP8NW7YD9;AGGAA5V0H3XY6AOTLLLEOSP8PI7YDM;AGGAA5V0H3XY6AOTLLPTOSP8TY7YDT;AGGADG1AANVNMAP1JE54P02183EGA9;AGGADG1AAO0VGAPSXWAEPSA6PDZAG6",
        }
        await apiHelper.createNewUser(userData);
        await apiHelper.associatePersonToCompany(userData.userId, "Petramco");
        await apiHelper.associatePersonToSupportGroup(userData.userId, "Facilities");
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //ptidke
    it('[DRDMV-16026]: [Design Time] Verify case Business analyst is able create, edit and delete Knowledge Notes template', async () => {
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
        expect(await utilCommon.isPopUpMessagePresent('Record deleted successfully.')).toBeTruthy();
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
        expect(await utilCommon.isPopUpMessagePresent('Record deleted successfully.')).toBeTruthy();
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
        expect(await utilCommon.isPopUpMessagePresent('Record deleted successfully.')).toBeTruthy();
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
        expect(await utilCommon.isPopUpMessagePresent('Record deleted successfully.')).toBeTruthy();
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
            expect(await utilCommon.isPopUpMessagePresent('Record deleted successfully.')).toBeTruthy();
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
        let notesTemplateName: string = NOTES_TEMPLATE_MANDATORY_FIELD.templateName + randomStr;
        let notesTemplateBody: string = NOTES_TEMPLATE_MANDATORY_FIELD.body + randomStr;
        NOTES_TEMPLATE_MANDATORY_FIELD.body = notesTemplateBody;
        NOTES_TEMPLATE_MANDATORY_FIELD.templateName = notesTemplateName;
        await apiHelper.createNotesTemplate("Case", NOTES_TEMPLATE_MANDATORY_FIELD);
        //task template 2
        let randomStr1 = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let notesTemplateName1: string = NOTES_TEMPLATE_MANDATORY_FIELD.templateName + randomStr1;
        let notesTemplateBody1: string = NOTES_TEMPLATE_MANDATORY_FIELD.body + randomStr1;
        NOTES_TEMPLATE_MANDATORY_FIELD.body = notesTemplateBody1;
        NOTES_TEMPLATE_MANDATORY_FIELD.templateName = notesTemplateName1;
        await apiHelper.createNotesTemplate("Case", NOTES_TEMPLATE_MANDATORY_FIELD);
        //task template 3
        let randomStr2 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let notesTemplateName2: string = NOTES_TEMPLATE_MANDATORY_FIELD.templateName + randomStr2;
        let notesTemplateBody2: string = NOTES_TEMPLATE_MANDATORY_FIELD.body + randomStr2;
        NOTES_TEMPLATE_MANDATORY_FIELD.body = notesTemplateBody2;
        NOTES_TEMPLATE_MANDATORY_FIELD.templateName = notesTemplateName2;
        await apiHelper.createNotesTemplate("Case", NOTES_TEMPLATE_MANDATORY_FIELD);
        //task template 4
        let randomStr3 = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let notesTemplateName3: string = NOTES_TEMPLATE_MANDATORY_FIELD.templateName + randomStr3;
        let notesTemplateBody3: string = NOTES_TEMPLATE_MANDATORY_FIELD.body + randomStr3;
        NOTES_TEMPLATE_MANDATORY_FIELD.body = notesTemplateBody3;
        NOTES_TEMPLATE_MANDATORY_FIELD.templateName = notesTemplateName3;
        await apiHelper.createNotesTemplate("Case", NOTES_TEMPLATE_MANDATORY_FIELD);
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
        beforeAll(async () => {
            NOTES_TEMPLATE_MANDATORY_FIELD.templateName = NOTES_TEMPLATE_MANDATORY_FIELD.templateName + randomStr;
            NOTES_TEMPLATE_MANDATORY_FIELD.body = NOTES_TEMPLATE_MANDATORY_FIELD.body + randomStr;
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
            await apiHelper.createNotesTemplate("People", NOTES_TEMPLATE_MANDATORY_FIELD);
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
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(NOTES_TEMPLATE_MANDATORY_FIELD.templateName);
            await activityTabPo.clickOnPostButton();
            expect(await activityTabPo.isTextPresentInActivityLog(NOTES_TEMPLATE_MANDATORY_FIELD.body)).toBeTruthy();
        });
        it('[DRDMV-16578]: Case Agent/Case Manger Should be able to consume People Notes Template in People profile', async () => {
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(newCase2.displayId);
            await viewCasePage.clickRequsterName();
            await utilityCommon.switchToNewTab(1);
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(NOTES_TEMPLATE_MANDATORY_FIELD.templateName);
            await activityTabPo.clickOnPostButton();
            expect(await activityTabPo.isTextPresentInActivityLog(NOTES_TEMPLATE_MANDATORY_FIELD.body)).toBeTruthy();
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        });
    });

    //ptidke
    it('[DRDMV-16045]: [Run Time] Verify case BA is able to select and utilize Active Task notes templates in Activity for Manual Task', async () => {
        let randomStr: string = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        try {
            // create task notes template
            NOTES_TEMPLATE_MANDATORY_FIELD.templateName = NOTES_TEMPLATE_MANDATORY_FIELD.templateName + randomStr;
            NOTES_TEMPLATE_MANDATORY_FIELD.body = NOTES_TEMPLATE_MANDATORY_FIELD.body + randomStr;
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createNotesTemplate("Task", NOTES_TEMPLATE_MANDATORY_FIELD);
            // create manual task template
            let templateData = {
                "templateName": 'ManualTask' + randomStr,
                "templateSummary": 'TaskSummary' + randomStr,
                "templateStatus": "Active",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            };
            await apiHelper.apiLogin('fritz');
            await apiHelper.createManualTaskTemplate(templateData);
            // create case
            let caseData = {
                "Requester": "qtao",
                "Company": "Petramco",
                "Summary": "Create case for me postman1",
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "Qadim Katawazi"
            };
            await apiHelper.apiLogin('fritz');
            let newCase = await apiHelper.createCase(caseData);
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(newCase.displayId);
            await viewCasePage.clickAddTaskButton();
            await manageTask.addTaskFromTaskTemplate(templateData.templateName);
            await viewCasePage.clickOnTaskLink(templateData.templateSummary);
            await viewTask.clickOnEditTask();
            await editTask.clickOnAssignToMe();
            await editTask.clickOnSaveButton();
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(NOTES_TEMPLATE_MANDATORY_FIELD.templateName);// notes template not shown
            await activityTabPo.clickOnPostButton();
            expect(await activityTabPo.isTextPresentInActivityLog(NOTES_TEMPLATE_MANDATORY_FIELD.body)).toBeTruthy();
        } catch (e) {
            throw e;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        }
    });

    //ptidke
    it('[DRDMV-16047]: [Run Time] Validate that case BA is able to select and utilize Active Knowledge notes templates in Knowledge Article ', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        NOTES_TEMPLATE_MANDATORY_FIELD.templateName = NOTES_TEMPLATE_MANDATORY_FIELD.templateName + randomStr;
        NOTES_TEMPLATE_MANDATORY_FIELD.body = NOTES_TEMPLATE_MANDATORY_FIELD.body + randomStr;
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createNotesTemplate("Knowledge", NOTES_TEMPLATE_MANDATORY_FIELD);
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
        await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(NOTES_TEMPLATE_MANDATORY_FIELD.templateName);
        await activityTabPo.clickOnPostButton();
        expect(await activityTabPo.isTextPresentInActivityLog(NOTES_TEMPLATE_MANDATORY_FIELD.body)).toBeTruthy();
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
                "businessUnit": 'Facilities Support',
                "supportGroup": 'Facilities',
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
            expect(await ckeditorOpsPo.isBoldTextDisplayedInCkEditorTextArea(boldText)).toBeTruthy('Text is not get Bold In Ck Editor');
            await ckeditorOpsPo.clickOnBoldIcon();
            //italic
            await ckeditorOpsPo.clickOnItalicIcon();
            await ckeditorOpsPo.updateDescription(italicText);
            expect(await ckeditorOpsPo.isItalicTextDisplayedInCkEditorTextArea(italicText)).toBeTruthy('Text is not Italic In Ck Editor');
            await ckeditorOpsPo.clickOnItalicIcon();
            //StrikeThrough
            await ckeditorOpsPo.clickOnStrikeThroughIcon();
            await ckeditorOpsPo.updateDescription(strikeThroughText);
            expect(await ckeditorOpsPo.isStrikeThroughTextDisplayedInCkEditorTextArea(strikeThroughText)).toBeTruthy('Text is not Strike Through In Ck Editor');
            await ckeditorOpsPo.clickOnStrikeThroughIcon();
            //underline
            await ckeditorOpsPo.clickOnUnderLineIcon();
            await ckeditorOpsPo.updateDescription(underLineText);
            expect(await ckeditorOpsPo.isUnderlineTextDisplayedInCkEditorTextArea(underLineText)).toBeTruthy('Text is not Underline In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnUnderLineIcon();
        });
        it('[DRDMV-22642,DRDMV-22646,DRDMV-22657]: Verify CKE functionality on Create and Edit Case Notes template', async () => {
            //left Align
            await ckeditorOpsPo.clickOnLeftAlignIcon();
            await ckeditorOpsPo.updateDescription(lefAlignText);
            expect(await ckeditorOpsPo.isTextLeftAlignInCkEditorTextArea(lefAlignText)).toBeTruthy('Text is not Left Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnLeftAlignIcon();
            //Right Align
            await ckeditorOpsPo.clickOnRightAlignIcon();
            await ckeditorOpsPo.updateDescription(rightAlignText);
            expect(await ckeditorOpsPo.isTextRightAlignInCkEditorTextArea(rightAlignText)).toBeTruthy('Text is not right Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnRightAlignIcon();
            //Center Align
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            await ckeditorOpsPo.updateDescription(centerAlignText);
            expect(await ckeditorOpsPo.isTextCenterAlignInCkEditorTextArea(centerAlignText)).toBeTruthy('Text is not center Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            //Justify Align
            await ckeditorOpsPo.clickOnJustifyAlignIcon();
            await ckeditorOpsPo.updateDescription(justifyAlignText);
            expect(await ckeditorOpsPo.isTextJustifyAlignInCkEditorTextArea(justifyAlignText)).toBeTruthy('Text is not justify Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnJustifyAlignIcon();
            //set color
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.selectColor('Strong Red');
            await ckeditorOpsPo.updateDescription(redColorText);
            expect(await ckeditorOpsPo.isColorTextDisplayedInCkEditorTextArea(redColorText, 'color:#c0392b;')).toBeTruthy('Color is not set In Ck Editor');
            //checking number list
            await ckeditorOpsPo.enterNewLineInCKE();
            await activityTabPo.setInsertRemoveNumberList('PlusOne');
            expect(await ckeditorOpsPo.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('Number List is not In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            // checking bullot points
            await activityTabPo.setInsertRemoveBulletedList('BulletOne');
            expect(await activityTabPo.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('Bulleted List is not In Ck Editor');
            expect(await ckeditorOpsPo.getTextCkEditorMinimizeOrMiximize()).toBe('Maximize');
            await ckeditorOpsPo.clickMaximizeMinimizeIcon();
            expect(await ckeditorOpsPo.getTextCkEditorMinimizeOrMiximize()).toBe('Minimize');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickMaximizeMinimizeIcon();
        });
        it('[DRDMV-22642,DRDMV-22646,DRDMV-22657]: Verify CKE functionality on Create and Edit Case Notes template', async () => {
            //add style
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.updateDescription(formatText);
            await ckeditorOpsPo.selectStyles('Heading 2');
            expect(await ckeditorOpsPo.isStyleApplied(formatText, 'h2')).toBeTruthy('Heading not set');
            //add Font Size 
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.updateDescription(fontText);
            await ckeditorOpsPo.selectFont('11');
            expect(await ckeditorOpsPo.isFontApplied(11, 'span')).toBeTruthy('Font not set');
            //upload image with URL
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnImageIcon();
            await ckeditorOpsPo.imageUploadWithURL(uploadURL, imageUrlFieldIndex, imageWidthFieldIndex, '200');
            expect(await ckeditorOpsPo.isImageDisplayedInCKE(uploadURL)).toBeTruthy('Image with URL not uploaded');
            //upload image with Local
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnImageIcon();
            imageSource = await ckeditorOpsPo.uploadImageFromLocal('Upload', '../../../data/ui/attachment/articleStatus.png', imageWidthFieldIndex, imageUrlFieldIndex, '200');
            expect(await ckeditorOpsPo.isImageDisplayedInCKE(imageSource)).toBeTruthy();
            // Link added
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('Google', linkDisplayTextFieldIndex);
            await linkPropertiesPo.setValueOfLinkProperties('www.google.com', linkUrlFieldIndex);
            await linkPropertiesPo.clickOnTargetTab();
            await linkPropertiesPo.selectDropDown('_blank', linkTargetDropDownIndex);
            await linkPropertiesPo.clickOnOkBtn();
            expect(await ckeditorOpsPo.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('Link is not In Ck Editor');
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
            expect(await ckeditorOpsPo.getTableCellAlignText("text-align: center;")).toContain(randomString);
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
            expect(await activityTabPo.isBoldTextDisplayedInCkEditorTextArea(boldText)).toBeTruthy('Text is not get Bold In Ck Editor');
            expect(await activityTabPo.isItalicTextDisplayedInCkEditorTextArea(italicText)).toBeTruthy('Text is not Italic In Ck Editor');
            expect(await activityTabPo.isUnderlineTextDisplayedInCkEditorTextArea(underLineText)).toBeTruthy('Text is not Underline In Ck Editor');
            expect(await activityTabPo.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('Text is not center Align In Ck Editor');
            expect(await activityTabPo.isTextLeftAlignInCkEditorTextArea(lefAlignText)).toBeTruthy('Text is not Left Align In Ck Editor');
            expect(await activityTabPo.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('Text is not center Align In Ck Editor');
            expect(await activityTabPo.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('Text is not center Align In Ck Editor');
            await activityTabPo.clickOnPostButton();
            await activityTabPo.clickShowMoreLinkInActivity(1);
            expect(await activityTabPo.isBoldTextDisplayedInActivity(boldText, 1)).toBeTruthy('FailureMsg Bold Text is missing in Activity');
            expect(await activityTabPo.isItalicTextDisplayedInActivity(italicText, 1)).toBeTruthy('FailureMsg Italic Text is missing In Activity');
            expect(await activityTabPo.isUnderlineTextDisplayedInActivity(underLineText, 1)).toBeTruthy('FailureMsg Underline Text is missing In Activity');
            expect(await activityTabPo.isRightAlignTextDisplayedInActivity(rightAlignText, 1)).toBeTruthy('FailureMsg Right Align Text is missing In Activity');
            expect(await activityTabPo.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 1)).toBeTruthy('FailureMsg Link Text is missing In Activity');
            expect(await activityTabPo.isNumberListTextDisplayedInActivity('PlusOne', 1)).toBeTruthy('FailureMsg Number List Text is missing In Activity');
            expect(await activityTabPo.isBulletListTextDisplayedInActivity('BulletOne', 1)).toBeTruthy('FailureMsg Bullet List Text is missing In Activity');
            expect(await activityTabPo.isTableCaptionDisplayedInCkEditorTextArea('tableSummary', 'new' + randomString)).toBeTruthy('Text is not Left Align In Ck Editor');
            expect(await activityTabPo.isTableSummaryDisplayedInCkEditorTextArea('tableSummary')).toBeTruthy('Text is not Left Align In Ck Editor');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.setSummary('NotesTemplateCase1' + randomString);
            await createCasePo.setPriority('Low');
            await createCasePo.clickAssignToMeButton();
            await createCasePo.clickSaveCaseButton();
            await casePreviewPo.clickGoToCaseButton();
            await viewCasePage.clickOnTab('Case Access');
            expect(await caseAccessTabPo.isCaseAccessEntityAdded('Facilities')).toBeTruthy('FailuerMsg1: Support Group Name is missing');
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(templateName);
            await activityTabPo.addActivityNote(randomString);
            await activityTabPo.clickOnPostButton();
            await activityTabPo.clickShowMoreLinkInActivity(1);
            expect(await caseAccessTabPo.isSupportGroupReadAccessDisplayed('Facilities')).toBeTruthy('Support Group does not have read access');
            expect(await activityTabPo.isBoldTextDisplayedInActivity(boldText, 1)).toBeTruthy('FailureMsg Bold Text is missing in Activity');
            expect(await activityTabPo.isItalicTextDisplayedInActivity(italicText, 1)).toBeTruthy('FailureMsg Italic Text is missing In Activity');
            expect(await activityTabPo.isUnderlineTextDisplayedInActivity(underLineText, 1)).toBeTruthy('FailureMsg Underline Text is missing In Activity');
            expect(await activityTabPo.isRightAlignTextDisplayedInActivity(rightAlignText, 1)).toBeTruthy('FailureMsg Right Align Text is missing In Activity');
            expect(await activityTabPo.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 1)).toBeTruthy('FailureMsg Link Text is missing In Activity');
            expect(await activityTabPo.isNumberListTextDisplayedInActivity('PlusOne', 1)).toBeTruthy('FailureMsg Number List Text is missing In Activity');
            expect(await activityTabPo.isBulletListTextDisplayedInActivity('BulletOne', 1)).toBeTruthy('FailureMsg Bullet List Text is missing In Activity');
            expect(await activityTabPo.isTableCaptionDisplayedInCkEditorTextArea('tableSummary', 'new' + randomString)).toBeTruthy('Text is not Left Align In Ck Editor');
            expect(await activityTabPo.isTableSummaryDisplayedInCkEditorTextArea('tableSummary')).toBeTruthy('Text is not Left Align In Ck Editor');
        });
        it('[DRDMV-22642,DRDMV-22646,DRDMV-22657]: Verify CKE functionality on Create and Edit Case Notes template', async () => {
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink('NotesTemplateCase1' + randomString);
            await activityTabPo.clickShowMoreLinkInActivity(1);
            expect(await activityTabPo.isBoldTextDisplayedInActivity(boldText, 1)).toBeTruthy('FailureMsg Bold Text is missing in Activity');
            expect(await activityTabPo.isItalicTextDisplayedInActivity(italicText, 1)).toBeTruthy('FailureMsg Italic Text is missing In Activity');
            expect(await activityTabPo.isUnderlineTextDisplayedInActivity(underLineText, 1)).toBeTruthy('FailureMsg Underline Text is missing In Activity');
            expect(await activityTabPo.isRightAlignTextDisplayedInActivity(rightAlignText, 1)).toBeTruthy('FailureMsg Right Align Text is missing In Activity');
            expect(await activityTabPo.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 1)).toBeTruthy('FailureMsg Link Text is missing In Activity');
            expect(await activityTabPo.isNumberListTextDisplayedInActivity('PlusOne', 1)).toBeTruthy('FailureMsg Number List Text is missing In Activity');
            expect(await activityTabPo.isBulletListTextDisplayedInActivity('BulletOne', 1)).toBeTruthy('FailureMsg Bullet List Text is missing In Activity');
            expect(await activityTabPo.isTableCaptionDisplayedInCkEditorTextArea('tableSummary', 'new' + randomString)).toBeTruthy('Text is not Left Align In Ck Editor');
            expect(await activityTabPo.isTableSummaryDisplayedInCkEditorTextArea('tableSummary')).toBeTruthy('Text is not Left Align In Ck Editor');
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink('NotesTemplateCase1' + randomString);
            await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.isBoldTextDisplayedInActivity(boldText, 1)).toBeTruthy('FailureMsg Bold Text is missing in Activity');
            expect(await activityTabPo.isItalicTextDisplayedInActivity(italicText, 1)).toBeTruthy('FailureMsg Italic Text is missing In Activity');
            expect(await activityTabPo.isUnderlineTextDisplayedInActivity(underLineText, 1)).toBeTruthy('FailureMsg Underline Text is missing In Activity');
            expect(await activityTabPo.isRightAlignTextDisplayedInActivity(rightAlignText, 1)).toBeTruthy('FailureMsg Right Align Text is missing In Activity');
            expect(await activityTabPo.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 1)).toBeTruthy('FailureMsg Link Text is missing In Activity');
            expect(await activityTabPo.isNumberListTextDisplayedInActivity('PlusOne', 1)).toBeTruthy('FailureMsg Number List Text is missing In Activity');
            expect(await activityTabPo.isBulletListTextDisplayedInActivity('BulletOne', 1)).toBeTruthy('FailureMsg Bullet List Text is missing In Activity');
            expect(await activityTabPo.isTableCaptionDisplayedInCkEditorTextArea('tableSummary', 'new' + randomString)).toBeTruthy('Text is not Left Align In Ck Editor');
            expect(await activityTabPo.isTableSummaryDisplayedInCkEditorTextArea('tableSummary')).toBeTruthy('Text is not Left Align In Ck Editor');
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
            await ckeditorOpsPo.clickOnBoldIcon();
            await ckeditorOpsPo.updateDescription(boldText);
            expect(await ckeditorOpsPo.isBoldTextDisplayedInCkEditorTextArea(boldText)).toBeTruthy('Text is not get Bold In Ck Editor');
            await ckeditorOpsPo.clickOnBoldIcon();
            //italic
            await ckeditorOpsPo.clickOnItalicIcon();
            await ckeditorOpsPo.updateDescription(italicText);
            expect(await ckeditorOpsPo.isItalicTextDisplayedInCkEditorTextArea(italicText)).toBeTruthy('Text is not Italic In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnItalicIcon();
            //strikethrough
            await ckeditorOpsPo.clickOnStrikeThroughIcon();
            await ckeditorOpsPo.updateDescription(strikeThroughText);
            expect(await ckeditorOpsPo.isStrikeThroughTextDisplayedInCkEditorTextArea(strikeThroughText)).toBeTruthy('Text is not Strike Through In Ck Editor');
            await ckeditorOpsPo.clickOnStrikeThroughIcon();
            //underline
            await ckeditorOpsPo.clickOnUnderLineIcon();
            await ckeditorOpsPo.updateDescription(underLineText);
            expect(await ckeditorOpsPo.isUnderlineTextDisplayedInCkEditorTextArea(underLineText)).toBeTruthy('Text is not Underline In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnUnderLineIcon();
        });
        it('[DRDMV-22638,DRDMV-22644,DRDMV-22654]: Verify CKE functionality on Create and Edit Knowledge Notes template', async () => {
            //left Align
            await ckeditorOpsPo.clickOnLeftAlignIcon();
            await ckeditorOpsPo.updateDescription(lefAlignText);
            expect(await ckeditorOpsPo.isTextLeftAlignInCkEditorTextArea(lefAlignText)).toBeTruthy('Text is not Left Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnLeftAlignIcon();
            //Right Align
            await ckeditorOpsPo.clickOnRightAlignIcon();
            await ckeditorOpsPo.updateDescription(rightAlignText);
            expect(await ckeditorOpsPo.isTextRightAlignInCkEditorTextArea(rightAlignText)).toBeTruthy('Text is not right Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnRightAlignIcon();
            //Center Align
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            await ckeditorOpsPo.updateDescription(centerAlignText);
            expect(await ckeditorOpsPo.isTextCenterAlignInCkEditorTextArea(centerAlignText)).toBeTruthy('Text is not center Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            //Justify Align
            await ckeditorOpsPo.clickOnJustifyAlignIcon();
            await ckeditorOpsPo.updateDescription(justifyAlignText);
            expect(await ckeditorOpsPo.isTextJustifyAlignInCkEditorTextArea(justifyAlignText)).toBeTruthy('Text is not justify Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnJustifyAlignIcon();
            //set color
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.selectColor('Strong Red');
            await ckeditorOpsPo.updateDescription(redColorText);
            expect(await ckeditorOpsPo.isColorTextDisplayedInCkEditorTextArea(redColorText, 'color:#c0392b;')).toBeTruthy('Color is not set In Ck Editor');
            //checking number list
            await ckeditorOpsPo.enterNewLineInCKE();
            await activityTabPo.setInsertRemoveNumberList('PlusOne');
            expect(await ckeditorOpsPo.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('Number List is not In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            // checking bullot points
            await activityTabPo.setInsertRemoveBulletedList('BulletOne');
            expect(await activityTabPo.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('Bulleted List is not In Ck Editor');
            expect(await ckeditorOpsPo.getTextCkEditorMinimizeOrMiximize()).toBe('Maximize');
            await ckeditorOpsPo.clickMaximizeMinimizeIcon();
            expect(await ckeditorOpsPo.getTextCkEditorMinimizeOrMiximize()).toBe('Minimize');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickMaximizeMinimizeIcon();
        });
        it('[DRDMV-22638,DRDMV-22644,DRDMV-22654]: Verify CKE functionality on Create and Edit Knowledge Notes template', async () => {
            //add style
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.updateDescription(formatText);
            await ckeditorOpsPo.selectStyles('Heading 2');
            expect(await ckeditorOpsPo.isStyleApplied(formatText, 'h2')).toBeTruthy('Heading not set');
            //add Font Size 
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.selectFont("11");
            await ckeditorOpsPo.updateDescription(fontText);
            expect(await ckeditorOpsPo.isFontApplied(11, 'span')).toBeTruthy('Font not set');
            //upload image with URL
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnImageIcon();
            await ckeditorOpsPo.imageUploadWithURL(uploadURL, imageUrlFieldIndex, imageWidthFieldIndex, '200');
            expect(await ckeditorOpsPo.isImageDisplayedInCKE(uploadURL)).toBeTruthy('Image with URL not uploaded');
            //upload image with Local
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnImageIcon();
            imageSource = await ckeditorOpsPo.uploadImageFromLocal('Upload', '../../../data/ui/attachment/articleStatus.png', imageWidthFieldIndex, imageUrlFieldIndex, '200');
            expect(await ckeditorOpsPo.isImageDisplayedInCKE(imageSource)).toBeTruthy();
            // Link added
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('Google', linkDisplayTextFieldIndex);
            await linkPropertiesPo.setValueOfLinkProperties('www.google.com', linkUrlFieldIndex);
            await linkPropertiesPo.clickOnTargetTab();
            await linkPropertiesPo.selectDropDown('_blank', linkTargetDropDownIndex);
            await linkPropertiesPo.clickOnOkBtn();
            expect(await ckeditorOpsPo.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('Link is not In Ck Editor');
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
            await editKnowledgeAccessPo.clickOnSupportGroupAccessORAgentAccessButton('Support Group Access');
            await editKnowledgeAccessPo.selectCompany('Petramco');
            await editKnowledgeAccessPo.selectBusinessUnit('Facilities Support');
            await editKnowledgeAccessPo.selectSupportGroup('Facilities');
            await editKnowledgeAccessPo.clickAddSupportGroupAccessButton();
            await editKnowledgeAccessPo.clickCloseKnowledgeAccessBlade();
            await viewKnowledgeArticlePo.clickOnTab('Activity');
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(templateName);
            expect(await activityTabPo.isBoldTextDisplayedInCkEditorTextArea(boldText)).toBeTruthy('Text is not get Bold In Ck Editor');
            expect(await activityTabPo.isItalicTextDisplayedInCkEditorTextArea(italicText)).toBeTruthy('Text is not Italic In Ck Editor');
            expect(await activityTabPo.isUnderlineTextDisplayedInCkEditorTextArea(underLineText)).toBeTruthy('Text is not Underline In Ck Editor');
            expect(await activityTabPo.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('Text is not center Align In Ck Editor');
            expect(await activityTabPo.isTextLeftAlignInCkEditorTextArea(lefAlignText)).toBeTruthy('Text is not Left Align In Ck Editor');
            expect(await activityTabPo.isTableCaptionDisplayedInCkEditorTextArea('tableSummary', 'new' + randomString)).toBeTruthy('Text is not Left Align In Ck Editor');
            expect(await activityTabPo.isTableSummaryDisplayedInCkEditorTextArea('tableSummary')).toBeTruthy('Text is not Left Align In Ck Editor');
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
            expect(await activityTabPo.isTableCaptionDisplayedInCkEditorTextArea('tableSummary', 'new' + randomString)).toBeTruthy('Text is not Left Align In Ck Editor');
            expect(await activityTabPo.isTableSummaryDisplayedInCkEditorTextArea('tableSummary')).toBeTruthy('Text is not Left Align In Ck Editor');
        });
        it('[DRDMV-22638,DRDMV-22644,DRDMV-22654]: Verify CKE functionality on Create and Edit Knowledge Notes template', async () => {
            await navigationPage.signOut();
            await loginPage.login('kWilliamson');
            await navigationPage.switchToApplication("Knowledge Management");
            await utilityCommon.switchToNewTab(1);
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
            expect(await activityTabPo.isTableCaptionDisplayedInCkEditorTextArea('tableSummary', 'new' + randomString)).toBeTruthy('Text is not Left Align In Ck Editor');
            expect(await activityTabPo.isTableSummaryDisplayedInCkEditorTextArea('tableSummary')).toBeTruthy('Text is not Left Align In Ck Editor');
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
            expect(await activityTabPo.isTableCaptionDisplayedInCkEditorTextArea('tableSummary', 'new' + randomString)).toBeTruthy('Text is not Left Align In Ck Editor');
            expect(await activityTabPo.isTableSummaryDisplayedInCkEditorTextArea('tableSummary')).toBeTruthy('Text is not Left Align In Ck Editor');
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
            await apiHelper.apiLogin('elizabeth');
            caseData = {
                "Requester": "araisin",
                "Summary": "Test case for DRDMV-16803",
                "Assigned Company": "Petramco",
                "Business Unit": "Facilities Support",
                "Support Group": "Facilities",
                "Assignee": "Fritz"
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
            await ckeditorOpsPo.clickOnBoldIcon();
            await ckeditorOpsPo.updateDescription(boldText);
            expect(await ckeditorOpsPo.isBoldTextDisplayedInCkEditorTextArea(boldText)).toBeTruthy('Text is not get Bold In Ck Editor');
            await ckeditorOpsPo.clickOnBoldIcon();
            //italic
            await ckeditorOpsPo.clickOnItalicIcon();
            await ckeditorOpsPo.updateDescription(italicText);
            expect(await ckeditorOpsPo.isItalicTextDisplayedInCkEditorTextArea(italicText)).toBeTruthy('Text is not Italic In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnItalicIcon();
            //strikethrough
            await ckeditorOpsPo.clickOnStrikeThroughIcon();
            await ckeditorOpsPo.updateDescription(strikeThroughText);
            expect(await ckeditorOpsPo.isStrikeThroughTextDisplayedInCkEditorTextArea(strikeThroughText)).toBeTruthy('Text is not Strike Through In Ck Editor');
            await ckeditorOpsPo.clickOnStrikeThroughIcon();
            //underline
            await ckeditorOpsPo.clickOnUnderLineIcon();
            await ckeditorOpsPo.updateDescription(underLineText);
            expect(await ckeditorOpsPo.isUnderlineTextDisplayedInCkEditorTextArea(underLineText)).toBeTruthy('Text is not Underline In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnUnderLineIcon();
        });
        it('[DRDMV-22637,DRDMV-22643,DRDMV-22653]: Verify CKE functionality on Create and Edit People Notes template', async () => {
            //left Align
            await ckeditorOpsPo.clickOnLeftAlignIcon();
            await ckeditorOpsPo.updateDescription(lefAlignText);
            expect(await ckeditorOpsPo.isTextLeftAlignInCkEditorTextArea(lefAlignText)).toBeTruthy('Text is not Left Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnLeftAlignIcon();
            //Right Align
            await ckeditorOpsPo.clickOnRightAlignIcon();
            await ckeditorOpsPo.updateDescription(rightAlignText);
            expect(await ckeditorOpsPo.isTextRightAlignInCkEditorTextArea(rightAlignText)).toBeTruthy('Text is not right Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnRightAlignIcon();
            //Center Align
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            await ckeditorOpsPo.updateDescription(centerAlignText);
            expect(await ckeditorOpsPo.isTextCenterAlignInCkEditorTextArea(centerAlignText)).toBeTruthy('Text is not center Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            //Justify Align
            await ckeditorOpsPo.clickOnJustifyAlignIcon();
            await ckeditorOpsPo.updateDescription(justifyAlignText);
            expect(await ckeditorOpsPo.isTextJustifyAlignInCkEditorTextArea(justifyAlignText)).toBeTruthy('Text is not justify Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnJustifyAlignIcon();
            //set color
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.selectColor('Strong Red');
            await ckeditorOpsPo.updateDescription(redColorText);
            expect(await ckeditorOpsPo.isColorTextDisplayedInCkEditorTextArea(redColorText, 'color:#c0392b;')).toBeTruthy('Color is not set In Ck Editor');
            //checking number list
            await ckeditorOpsPo.enterNewLineInCKE();
            await activityTabPo.setInsertRemoveNumberList('PlusOne');
            expect(await ckeditorOpsPo.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('Number List is not In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            // checking bullot points
            await activityTabPo.setInsertRemoveBulletedList('BulletOne');
            expect(await activityTabPo.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('Bulleted List is not In Ck Editor');
            expect(await ckeditorOpsPo.getTextCkEditorMinimizeOrMiximize()).toBe('Maximize');
            await ckeditorOpsPo.clickMaximizeMinimizeIcon();
            expect(await ckeditorOpsPo.getTextCkEditorMinimizeOrMiximize()).toBe('Minimize');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickMaximizeMinimizeIcon();
        });
        it('[DRDMV-22637,DRDMV-22643,DRDMV-22653]: Verify CKE functionality on Create and Edit People Notes template', async () => {
            //add style
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.updateDescription(formatText);
            await ckeditorOpsPo.selectStyles('Heading 2');
            expect(await ckeditorOpsPo.isStyleApplied(formatText, 'h2')).toBeTruthy('Heading not set');
            //add Font Size 
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.selectFont("11");
            await ckeditorOpsPo.updateDescription(fontText);
            expect(await ckeditorOpsPo.isFontApplied(11, 'span')).toBeTruthy('Font not set');
            //upload image with URL
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnImageIcon();
            await ckeditorOpsPo.imageUploadWithURL(uploadURL, imageUrlFieldIndex, imageWidthFieldIndex, '200');
            expect(await ckeditorOpsPo.isImageDisplayedInCKE(uploadURL)).toBeTruthy('Image with URL not uploaded');
            //upload image with Local
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnImageIcon();
            imageSource1 = await ckeditorOpsPo.uploadImageFromLocal('Upload', '../../../data/ui/attachment/articleStatus.png', imageWidthFieldIndex, imageUrlFieldIndex, '100');
            expect(await ckeditorOpsPo.isImageDisplayedInCKE(imageSource1)).toBeTruthy();
            // Link added
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('Google', linkDisplayTextFieldIndex);
            await linkPropertiesPo.setValueOfLinkProperties('www.google.com', linkUrlFieldIndex);
            await linkPropertiesPo.clickOnTargetTab();
            await linkPropertiesPo.selectDropDown('_blank', linkTargetDropDownIndex);
            await linkPropertiesPo.clickOnOkBtn();
            expect(await ckeditorOpsPo.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('Link is not In Ck Editor');
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
            imageSource2 = await ckeditorOpsPo.uploadImageFromLocal('Upload', '../../../data/ui/attachment/bwfJpg.jpg', imageWidthFieldIndex, imageUrlFieldIndex, '100');
            expect(await ckeditorOpsPo.isImageDisplayedInCKE(imageSource2)).toBeTruthy();
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
            expect(await activityTabPo.isBoldTextDisplayedInCkEditorTextArea(boldText)).toBeTruthy('Text is not get Bold In Ck Editor');
            expect(await activityTabPo.isItalicTextDisplayedInCkEditorTextArea(italicText)).toBeTruthy('Text is not Italic In Ck Editor');
            expect(await activityTabPo.isUnderlineTextDisplayedInCkEditorTextArea(underLineText)).toBeTruthy('Text is not Underline In Ck Editor');
            expect(await activityTabPo.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('Text is not center Align In Ck Editor');
            expect(await activityTabPo.isTextLeftAlignInCkEditorTextArea(lefAlignText)).toBeTruthy('Text is not Left Align In Ck Editor');
            expect(await activityTabPo.isTableSummaryDisplayedInCkEditorTextArea('tableSummary')).toBeTruthy('Text is not Left Align In Ck Editor');
            await activityTabPo.clickOnPostButton();
            await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.isBoldTextDisplayedInActivity(boldText, 1)).toBeTruthy('FailureMsg Bold Text is missing in Activity');
            expect(await activityTabPo.isItalicTextDisplayedInActivity(italicText, 1)).toBeTruthy('FailureMsg Italic Text is missing In Activity');
            expect(await activityTabPo.isUnderlineTextDisplayedInActivity(underLineText, 1)).toBeTruthy('FailureMsg Underline Text is missing In Activity');
            expect(await activityTabPo.isRightAlignTextDisplayedInActivity(rightAlignText, 1)).toBeTruthy('FailureMsg Right Align Text is missing In Activity');
            expect(await activityTabPo.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 1)).toBeTruthy('FailureMsg Link Text is missing In Activity');
            expect(await activityTabPo.isNumberListTextDisplayedInActivity('PlusOne', 1)).toBeTruthy('FailureMsg Number List Text is missing In Activity');
            expect(await activityTabPo.isBulletListTextDisplayedInActivity('BulletOne', 1)).toBeTruthy('FailureMsg Bullet List Text is missing In Activity');
            expect(await activityTabPo.isTableSummaryDisplayedInCkEditorTextArea('tableSummary')).toBeTruthy('Text is not Left Align In Ck Editor');
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
            await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.isBoldTextDisplayedInActivity(boldText, 1)).toBeTruthy('FailureMsg Bold Text is missing in Activity');
            expect(await activityTabPo.isItalicTextDisplayedInActivity(italicText, 1)).toBeTruthy('FailureMsg Italic Text is missing In Activity');
            expect(await activityTabPo.isUnderlineTextDisplayedInActivity(underLineText, 1)).toBeTruthy('FailureMsg Underline Text is missing In Activity');
            expect(await activityTabPo.isRightAlignTextDisplayedInActivity(rightAlignText, 1)).toBeTruthy('FailureMsg Right Align Text is missing In Activity');
            expect(await activityTabPo.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 1)).toBeTruthy('FailureMsg Link Text is missing In Activity');
            expect(await activityTabPo.isNumberListTextDisplayedInActivity('PlusOne', 1)).toBeTruthy('FailureMsg Number List Text is missing In Activity');
            expect(await activityTabPo.isBulletListTextDisplayedInActivity('BulletOne', 1)).toBeTruthy('FailureMsg Bullet List Text is missing In Activity');
            expect(await activityTabPo.isTableSummaryDisplayedInCkEditorTextArea('tableSummary')).toBeTruthy('Text is not Left Align In Ck Editor');
            expect(await activityTabPo.isCKImageDisplayedInActivity(imageSource1)).toBeTruthy('Image is not displayed');
            expect(await activityTabPo.isCKImageDisplayedInActivity(uploadURL)).toBeTruthy('Image is not displayed');
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });
});
