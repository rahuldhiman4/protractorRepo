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

describe('Notes template', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login("elizabeth");
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
            "Summary": "Testing case creation with minimal input data"
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
            await manageTask.clickTaskLink(templateData.templateSummary);
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
});
