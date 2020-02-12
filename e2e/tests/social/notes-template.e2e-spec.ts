import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import viewCasePage from "../../pageobject/case/view-case.po";
import addFieldPo from '../../pageobject/common/add-fields-pop.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import createKnowlegePo from '../../pageobject/knowledge/create-knowlege.po';
import viewKnowledgeArticlePo from '../../pageobject/knowledge/view-knowledge-article.po';
import consoleNotesTemplate from '../../pageobject/settings/common/console-notestemplate.po';
import createNotesTemplate from '../../pageobject/settings/common/create-notestemplate.po';
import editNotetemplate from '../../pageobject/settings/common/edit-notestemplate.po';
import activityTabPo from '../../pageobject/social/activity-tab.po';
import notesTemplateUsage from '../../pageobject/social/note-template-usage.po';
import editTask from "../../pageobject/task/edit-task.po";
import manageTask from "../../pageobject/task/manage-task-blade.po";
import viewTask from "../../pageobject/task/view-task.po";
import utilCommon from '../../utils/util.common';
import utilGrid from '../../utils/util.grid';

describe('Notes template', () => {
    beforeAll(async () => {
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
        await loginPage.login("elizabeth");
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    afterEach(async () => {
        await browser.refresh();
    });

    //ptidke
    it('[DRDMV-16026]: [Design Time] Verify case Business analyst is able create ,edit and delete Knowledge Notes template', async () => {
        await navigationPage.gotoSettingsPage();
        let templateName: string = "activityNotesTemplate" + Math.floor(Math.random() * 100000);
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
        await expect(await editNotetemplate.getStatusValue()).toContain('Inactive');
        await expect(await editNotetemplate.getBodyValue()).toContain(updateBody);
        await editNotetemplate.clickOnCancelButton();
        await browser.refresh();
        await consoleNotesTemplate.searchAndClickNotesTemplateCheckBox(templateName);
        await consoleNotesTemplate.clickOnDeleteButton();
        await utilCommon.clickOnWarningOk();
        await expect(await utilCommon.getPopUpMessage()).toContain('Record deleted successfully.');
    });

    //ptidke
    it('[DRDMV-16010]: [Design Time] Verify that case Business analyst is able create ,edit and delete case Notes template', async () => {
        await navigationPage.gotoCaseConsole();
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
        await expect(editNotetemplate.getStatusValue()).toContain('Inactive');
        await expect(editNotetemplate.getBodyValue()).toContain(updateBody);
        await editNotetemplate.clickOnCancelButton();
        await browser.refresh();
        await consoleNotesTemplate.searchAndClickNotesTemplateCheckBox(templateName);
        await consoleNotesTemplate.clickOnDeleteButton();
        await utilCommon.clickOnWarningOk();
        await expect(await utilCommon.getPopUpMessage()).toContain('Record deleted successfully.');
    });

    //ptidke
    it('[DRDMV-16028]: [Design Time] Verify case Business analyst is able create ,edit and delete People Notes template', async () => {
        await navigationPage.gotoCaseConsole();
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
        await expect(editNotetemplate.getStatusValue()).toContain('Inactive');
        await expect(editNotetemplate.getBodyValue()).toContain(updateBody);
        await editNotetemplate.clickOnCancelButton();
        await browser.refresh();
        await consoleNotesTemplate.searchAndClickNotesTemplateCheckBox(templateName);
        await consoleNotesTemplate.clickOnDeleteButton();
        await utilCommon.clickOnWarningOk();
        await expect(await utilCommon.getPopUpMessage()).toContain('Record deleted successfully.');
    });

    //ptidke
    it('[DRDMV-16027]: [Design Time] Verify case Business analyst is able create ,edit and delete Task Notes template', async () => {
        await navigationPage.gotoCaseConsole();
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
        await expect(editNotetemplate.getStatusValue()).toContain('Inactive');
        await expect(editNotetemplate.getBodyValue()).toContain(updateBody);
        await editNotetemplate.clickOnCancelButton();
        await browser.refresh();
        await consoleNotesTemplate.searchAndClickNotesTemplateCheckBox(templateName);
        await consoleNotesTemplate.clickOnDeleteButton();
        await utilCommon.clickOnWarningOk();
        await expect(await utilCommon.getPopUpMessage()).toContain('Record deleted successfully.');
    });

    //ptidke
    it('[DRDMV-16181]: [Design Time] Knowledge user is able to create,edit(update), Delete Knowledge Notes Template', async () => {
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
            await expect(await editNotetemplate.getStatusValue()).toContain('Inactive');
            await expect(await editNotetemplate.getBodyValue()).toContain(updateBody);
            await editNotetemplate.clickOnCancelButton();
            // await utilCommon.waitUntilSpinnerToHide();
            await consoleNotesTemplate.searchAndClickNotesTemplateCheckBox(templateName);
            await consoleNotesTemplate.clickOnDeleteButton();
            await utilCommon.clickOnWarningOk();
            await expect(await utilCommon.getPopUpMessage()).toContain('Record deleted successfully.');
        }
        catch (e) {
            throw e;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login("elizabeth");
        }
    }, 120 * 1000);

    //ptidke
    it('[DRDMV-15999]: [DesignTime] Verify Notes templates UI should be displayed as per prototype(mockups)', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Notes Template', 'Activity Notes Template Console - Case - Business Workflows');
        await expect(await consoleNotesTemplate.isNotesTemplateUIConsolePresent()).toBeTruthy();
        await consoleNotesTemplate.clickOnCreateNotesTemplate();
        await expect(await createNotesTemplate.isSaveButtonDisabled()).toBeFalsy();
        await expect(await createNotesTemplate.isCreateNotesTemplateUIPresent()).toBeTruthy();
        //await utilCommon.waitUntilSpinnerToHide();
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('People--Notes Template', 'Activity Notes Template Console - Person - Business Workflows');
        await expect(await consoleNotesTemplate.isNotesTemplateUIConsolePresent()).toBeTruthy();
        await consoleNotesTemplate.clickOnCreateNotesTemplate();
        await expect(await createNotesTemplate.isSaveButtonDisabled()).toBeFalsy();
        await expect(await createNotesTemplate.isCreateNotesTemplateUIPresent()).toBeTruthy();
        //await utilCommon.waitUntilSpinnerToHide();
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Notes Template', 'Activity Notes Template Console - Task - Business Workflows');
        await expect(await consoleNotesTemplate.isNotesTemplateUIConsolePresent()).toBeTruthy();
        await consoleNotesTemplate.clickOnCreateNotesTemplate();
        await expect(await createNotesTemplate.isSaveButtonDisabled()).toBeFalsy();
        await expect(await createNotesTemplate.isCreateNotesTemplateUIPresent()).toBeTruthy();
        //await utilCommon.waitUntilSpinnerToHide();
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Knowledge Management--Notes Template', 'Activity Notes Template Console - Knowledge - Business Workflows');
        await expect(await consoleNotesTemplate.isNotesTemplateUIConsolePresent()).toBeTruthy();
        await consoleNotesTemplate.clickOnCreateNotesTemplate();
        await expect(await createNotesTemplate.isSaveButtonDisabled()).toBeFalsy();
        await expect(await createNotesTemplate.isCreateNotesTemplateUIPresent()).toBeTruthy();
        //await utilCommon.waitUntilSpinnerToHide();
    });

    //ptidke
    it('[DRDMV-16111]: [Design Time] Verify warning Message for locale values if template message is not configured against that locale value', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Notes Template', 'Activity Notes Template Console - Case - Business Workflows');
        let caseNotesTemplate1 = await createNotesTemplate.createNotesTemplate('Petramco');
        await consoleNotesTemplate.searchAndClickOnNotesTemplate(caseNotesTemplate1);
        await editNotetemplate.changeLanguageValue('Italian (Italy)');
        await expect(await editNotetemplate.getLocaleNotPresentMessage()).toContain('Please add the required localized message.');
        await editNotetemplate.clickOnCancelButton();
        await utilCommon.clickOnWarningOk();
        //await utilCommon.waitUntilSpinnerToHide();
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('People--Notes Template', 'Activity Notes Template Console - Person - Business Workflows');
        let caseNotesTemplate2 = await createNotesTemplate.createNotesTemplate('Petramco');
        await consoleNotesTemplate.searchAndClickOnNotesTemplate(caseNotesTemplate2);
        await editNotetemplate.changeLanguageValue('Italian (Italy)');
        await expect(await editNotetemplate.getLocaleNotPresentMessage()).toContain('Please add the required localized message.')
        await editNotetemplate.clickOnCancelButton();
        await utilCommon.clickOnWarningOk();
        //await utilCommon.waitUntilSpinnerToHide();
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Notes Template', 'Activity Notes Template Console - Task - Business Workflows');
        let caseNotesTemplate3 = await createNotesTemplate.createNotesTemplate('Petramco');
        await consoleNotesTemplate.searchAndClickOnNotesTemplate(caseNotesTemplate3);
        await editNotetemplate.changeLanguageValue('Italian (Italy)');
        await expect(await editNotetemplate.getLocaleNotPresentMessage()).toContain('Please add the required localized message.');
        await editNotetemplate.clickOnCancelButton();
        await utilCommon.clickOnWarningOk();
        //await utilCommon.waitUntilSpinnerToHide();
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Knowledge Management--Notes Template', 'Activity Notes Template Console - Knowledge - Business Workflows');
        let caseNotesTemplate4 = await createNotesTemplate.createNotesTemplate('Petramco');
        await consoleNotesTemplate.searchAndClickOnNotesTemplate(caseNotesTemplate4);
        await editNotetemplate.changeLanguageValue('Italian (Italy)');
        await expect(await editNotetemplate.getLocaleNotPresentMessage()).toContain('Please add the required localized message.');
        await editNotetemplate.clickOnCancelButton();
        await utilCommon.clickOnWarningOk();
        //await utilCommon.waitUntilSpinnerToHide();
    }, 140 * 1000);

    //ptidke
    it('[DRDMV-16040]: [Run Time] Verify that case BA is able to consume more than one Enabled case notes templates on case (one at a time can post)', async () => {
        //task template 1
        await apiHelper.apiLogin('tadmin');
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let notesTemplateData = require('../../data/ui/social/notesTemplate.ui.json');
        let notesTemplateName: string = await notesTemplateData['notesTemplateWithMandatoryField'].templateName + randomStr;
        let notesTemplateBody: string = await notesTemplateData['notesTemplateWithMandatoryField'].body + randomStr;
        notesTemplateData['notesTemplateWithMandatoryField'].body = notesTemplateBody;
        notesTemplateData['notesTemplateWithMandatoryField'].templateName = notesTemplateName;
        await apiHelper.createNotesTemplate("Case", notesTemplateData['notesTemplateWithMandatoryField']);
        //task template 2
        let randomStr1 = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let notesTemplateName1: string = await notesTemplateData['notesTemplateWithMandatoryField'].templateName + randomStr1;
        let notesTemplateBody1: string = await notesTemplateData['notesTemplateWithMandatoryField'].body + randomStr1;
        notesTemplateData['notesTemplateWithMandatoryField'].body = notesTemplateBody1;
        notesTemplateData['notesTemplateWithMandatoryField'].templateName = notesTemplateName1;
        await apiHelper.createNotesTemplate("Case", notesTemplateData['notesTemplateWithMandatoryField']);
        //task template 3
        let randomStr2 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let notesTemplateName2: string = await notesTemplateData['notesTemplateWithMandatoryField'].templateName + randomStr2;
        let notesTemplateBody2: string = await notesTemplateData['notesTemplateWithMandatoryField'].body + randomStr2;
        notesTemplateData['notesTemplateWithMandatoryField'].body = notesTemplateBody2;
        notesTemplateData['notesTemplateWithMandatoryField'].templateName = notesTemplateName2;
        await apiHelper.createNotesTemplate("Case", notesTemplateData['notesTemplateWithMandatoryField']);
        //task template 4
        let randomStr3 = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let notesTemplateName3: string = await notesTemplateData['notesTemplateWithMandatoryField'].templateName + randomStr3;
        let notesTemplateBody3: string = await notesTemplateData['notesTemplateWithMandatoryField'].body + randomStr3;
        notesTemplateData['notesTemplateWithMandatoryField'].body = notesTemplateBody3;
        notesTemplateData['notesTemplateWithMandatoryField'].templateName = notesTemplateName3;
        await apiHelper.createNotesTemplate("Case", notesTemplateData['notesTemplateWithMandatoryField']);
        let caseData = {
            "Requester": "qkatawazi",
            "Summary": "Testing case creation with minimal input data"
        };
        await apiHelper.apiLogin('qtao');
        let newCase = await apiHelper.createCase(caseData);
        let displayId: string = newCase.displayId;
        await navigationPage.gotoCaseConsole();
        await utilGrid.clearFilter();
        await utilGrid.searchAndOpenHyperlink(displayId);
        await notesTemplateUsage.clickOnAddNoteAndAddNoteTemplate(notesTemplateName);
        await activityTabPo.clickOnPostButton();
        await expect(await activityTabPo.isTextPresentInNote(notesTemplateBody)).toBeTruthy();
        await notesTemplateUsage.clickOnAddNoteAndAddNoteTemplate(notesTemplateName1);
        await activityTabPo.clickOnPostButton();
        await expect(await activityTabPo.isTextPresentInNote(notesTemplateBody1)).toBeTruthy();
        await notesTemplateUsage.clickOnAddNoteAndAddNoteTemplate(notesTemplateName2);
        await activityTabPo.clickOnPostButton();
        await expect(await activityTabPo.isTextPresentInNote(notesTemplateBody2)).toBeTruthy();
        await notesTemplateUsage.clickOnAddNoteAndAddNoteTemplate(notesTemplateName3);
        await activityTabPo.clickOnPostButton();
        await expect(await activityTabPo.isTextPresentInNote(notesTemplateBody3)).toBeTruthy();
    }, 110 * 1000);

    //ptidke
    it('[DRDMV-16578]: Case Agent/Case Manger Should be able to consume People Notes Template in People profile', async () => {
        try {
            await navigationPage.signOut();
            await loginPage.login('franz');
            await apiHelper.apiLogin('elizabeth');
            let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let notesTemplateData = require('../../data/ui/social/notesTemplate.ui.json');
            let notesTemplateName: string = await notesTemplateData['notesTemplateWithMandatoryField'].templateName + randomStr;
            let notesTemplateBody: string = await notesTemplateData['notesTemplateWithMandatoryField'].body + randomStr;
            notesTemplateData['notesTemplateWithMandatoryField'].body = notesTemplateBody;
            notesTemplateData['notesTemplateWithMandatoryField'].templateName = notesTemplateName;
            await apiHelper.createNotesTemplate("People", notesTemplateData['notesTemplateWithMandatoryField']);
            let caseData1 = {
                "Requester": "qdu",
                "Summary": "Testing case creation with minimal input data"
            };
            await apiHelper.apiLogin('franz');
            let newCase1 = await apiHelper.createCase(caseData1);
            let displayId: string = newCase1.displayId;
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(displayId);
            await notesTemplateUsage.clickOnRequsterName();
            await notesTemplateUsage.clickOnAddNoteAndAddNoteTemplate(notesTemplateName);
            await activityTabPo.clickOnPostButton();
            await expect(await activityTabPo.isTextPresentInNote(notesTemplateBody)).toBeTruthy();
            await navigationPage.signOut();
            await loginPage.login('qdu');
            let caseData2 = {
                "Requester": "qtao",
                "Summary": "Testing case creation with minimal input data"
            };
            await apiHelper.apiLogin('qdu');
            let newCase2 = await apiHelper.createCase(caseData2);
            console.log("case is created ===", newCase2.displayId);
            let displayIdnew: string = newCase2.displayId;
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(displayIdnew);
            await notesTemplateUsage.clickOnRequsterName();
            await notesTemplateUsage.clickOnAddNoteAndAddNoteTemplate(notesTemplateName);
            await activityTabPo.clickOnPostButton();
            await expect(await activityTabPo.isTextPresentInNote(notesTemplateBody)).toBeTruthy();
        }
        catch (e) {
            throw e;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        }
    }, 120 * 1000);

    //ptidke
    it('[DRDMV-16045]: [Run Time] Verify case BA is able to select and utilize Active Task notes templates in Activity for Manual', async () => {
        try {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            let taskTemplateName = 'Manual  task' + [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let manualTaskSummary = 'Summary' + [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let templateData = {
                "templateName": `${taskTemplateName}`,
                "templateSummary": `${manualTaskSummary}`,
                "templateStatus": "Active",
            };
            await apiHelper.apiLogin('fritz');
            let manualTaskTemplate = await apiHelper.createManualTaskTemplate(templateData);
            console.log("active task Template is created===", manualTaskTemplate.displayId);
            await apiHelper.apiLogin('qkatawazi');
            let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let notesTemplateData = require('../../data/ui/social/notesTemplate.ui.json');
            let notesTemplateName: string = await notesTemplateData['notesTemplateWithMandatoryField'].templateName + randomStr;
            let notesTemplateBody: string = await notesTemplateData['notesTemplateWithMandatoryField'].body + randomStr;
            notesTemplateData['notesTemplateWithMandatoryField'].body = notesTemplateBody;
            notesTemplateData['notesTemplateWithMandatoryField'].templateName = notesTemplateName;
            await apiHelper.createNotesTemplate("Task", notesTemplateData['notesTemplateWithMandatoryField']);
            let caseData = {
                "Requester": "qtao",
                "Company": "Petramco",
                "Summary": "Create case for me postman1",
                "Support Group": "Compensation and Benefits",
                "Assignee": "Qadim Katawazi"
            };
            await apiHelper.apiLogin('fritz');
            let newCaseTemplate = await apiHelper.createCase(caseData);
            let displayId: string = newCaseTemplate.displayId;
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(displayId);
            await viewCasePage.clickAddTaskButton();
            await manageTask.addTaskFromTaskTemplate(manualTaskSummary);
            //await utilCommon.waitUntilSpinnerToHide();
            await manageTask.clickTaskLinkOnManageTask(manualTaskSummary);
            await viewTask.clickOnEditTask();
            await editTask.clickOnAssignToMe();
            await editTask.clickOnSaveButton();
            await notesTemplateUsage.clickOnAddNoteAndAddNoteTemplate(notesTemplateName);
            await activityTabPo.clickOnPostButton();
            await expect(await activityTabPo.isTextPresentInNote(notesTemplateBody)).toBeTruthy();
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
        await apiHelper.apiLogin('qkatawazi');
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let notesTemplateData = require('../../data/ui/social/notesTemplate.ui.json');
        let notesTemplateName: string = await notesTemplateData['notesTemplateWithMandatoryField'].templateName + randomStr;
        let notesTemplateBody: string = await notesTemplateData['notesTemplateWithMandatoryField'].body + randomStr;
        notesTemplateData['notesTemplateWithMandatoryField'].body = notesTemplateBody;
        notesTemplateData['notesTemplateWithMandatoryField'].templateName = notesTemplateName;
        await apiHelper.createNotesTemplate("Knowledge", notesTemplateData['notesTemplateWithMandatoryField']);
        //create Knowledge
        await navigationPage.gotoCreateKnowledge();
        await expect(await browser.getTitle()).toBe('Knowledge Article Templates Preview - Business Workflows');
        await createKnowlegePo.clickOnTemplate('Reference');
        await createKnowlegePo.clickOnUseSelectedTemplateButton();
        await createKnowlegePo.addTextInKnowlegeTitleField('test case for DRDMV-16754');
        await createKnowlegePo.selectKnowledgeSet('HR');
        await createKnowlegePo.clickOnSaveKnowledgeButton();
        await createKnowlegePo.clickOnviewArticleLinkButton();
        // View Knowledege Page
        await utilCommon.switchToNewWidnow(1);
        await viewKnowledgeArticlePo.clickOnActivityTab();
        await notesTemplateUsage.clickOnAddNoteAndAddNoteTemplate(notesTemplateName);
        await activityTabPo.clickOnPostButton();
        await expect(await activityTabPo.isTextPresentInNote(notesTemplateBody)).toBeTruthy();
    });
})