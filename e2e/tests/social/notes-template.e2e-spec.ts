import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import viewCasePage from "../../pageobject/case/view-case.po";
import addFieldPo from '../../pageobject/common/add-fields-pop.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import createKnowlegePo from '../../pageobject/knowledge/create-knowlege.po';
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
        loginPage.login("elizabeth");
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    it('DRDMV-16026 : [Design Time] Verify case Business analyst is able create ,edit and delete Knowledge Notes template', async () => {
        await navigationPage.gotoSettingsPage();
        var templateName: string = "activityNotesTemplate" + Math.floor(Math.random() * 100000);
        expect(await navigationPage.gotoSettingsMenuItem('Knowledge Management--Notes Template', 'Activity Notes Template Console - Knowledge - Business Workflows')).toEqual('Activity Notes Template Console - Knowledge - Business Workflows');
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
        var updateBody: string = "UpdateNotesTemplate" + Math.floor(Math.random() * 100000);
        await editNotetemplate.changeStatusValue('Inactive');
        await editNotetemplate.updateBody(updateBody);
        await editNotetemplate.clickOnSaveButton();
        await consoleNotesTemplate.searchAndClickOnNotesTemplate(templateName);
        await expect(editNotetemplate.getStatusValue()).toContain('Inactive');
        await expect(editNotetemplate.getBodyValue()).toContain(updateBody);
        await editNotetemplate.clickOnCancelButton();
        await consoleNotesTemplate.selectCheckBox();
        await consoleNotesTemplate.clickOnDeleteButton();
        await utilCommon.clickOnWarningOk();
        await expect(utilCommon.getPopUpMessage()).toContain('Record deleted successfully.');
    });

    it('DRDMV-16010 : [Design Time] Verify that case Business analyst is able create ,edit and delete case Notes template', async () => {
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Case Management--Notes Template', 'Activity Notes Template Console - Case - Business Workflows')).toEqual('Activity Notes Template Console - Case - Business Workflows');
        await consoleNotesTemplate.clickOnCreateNotesTemplate();
        var templateName: string = "activityNotesTemplate" + Math.floor(Math.random() * 100000);
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
        var updateBody: string = "UpdateNotesTemplate" + Math.floor(Math.random() * 100000);
        await editNotetemplate.changeStatusValue('Inactive');
        await editNotetemplate.updateBody(updateBody);
        await editNotetemplate.clickOnSaveButton();
        await consoleNotesTemplate.searchAndClickOnNotesTemplate(templateName);
        await expect(editNotetemplate.getStatusValue()).toContain('Inactive');
        await expect(editNotetemplate.getBodyValue()).toContain(updateBody);
        await editNotetemplate.clickOnCancelButton();
        await consoleNotesTemplate.selectCheckBox();
        await consoleNotesTemplate.clickOnDeleteButton();
        await utilCommon.clickOnWarningOk();
        await expect(utilCommon.getPopUpMessage()).toContain('Record deleted successfully.');
    });

    it('DRDMV-16028 : [Design Time] Verify case Business analyst is able create ,edit and delete People Notes template', async () => {
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('People--Notes Template', 'Activity Notes Template Console - Person - Business Workflows')).toEqual('Activity Notes Template Console - Person - Business Workflows');
        await consoleNotesTemplate.clickOnCreateNotesTemplate();
        var templateName: string = "activityNotesTemplate" + Math.floor(Math.random() * 100000);
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
        var updateBody: string = "UpdateNotesTemplate" + Math.floor(Math.random() * 100000);
        await editNotetemplate.changeStatusValue('Inactive');
        await editNotetemplate.updateBody(updateBody);
        await editNotetemplate.clickOnSaveButton();
        await consoleNotesTemplate.searchAndClickOnNotesTemplate(templateName);
        await expect(editNotetemplate.getStatusValue()).toContain('Inactive');
        await expect(editNotetemplate.getBodyValue()).toContain(updateBody);
        await editNotetemplate.clickOnCancelButton();
        await consoleNotesTemplate.selectCheckBox();
        await consoleNotesTemplate.clickOnDeleteButton();
        await utilCommon.clickOnWarningOk();
        await expect(utilCommon.getPopUpMessage()).toContain('Record deleted successfully.');
    }, 200 * 1000);

    it('DRDMV-16027 : [Design Time] Verify case Business analyst is able create ,edit and delete Task Notes template', async () => {
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Task Management--Notes Template', 'Activity Notes Template Console - Task - Business Workflows')).toEqual('Activity Notes Template Console - Task - Business Workflows');
        await consoleNotesTemplate.clickOnCreateNotesTemplate();
        var templateName: string = "activityNotesTemplate" + Math.floor(Math.random() * 100000);
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
        var updateBody: string = "UpdateNotesTemplate" + Math.floor(Math.random() * 100000);
        await editNotetemplate.changeStatusValue('Inactive');
        await editNotetemplate.updateBody(updateBody);
        await editNotetemplate.clickOnSaveButton();
        await consoleNotesTemplate.searchAndClickOnNotesTemplate(templateName);
        await expect(editNotetemplate.getStatusValue()).toContain('Inactive');
        await expect(editNotetemplate.getBodyValue()).toContain(updateBody);
        await editNotetemplate.clickOnCancelButton();
        await consoleNotesTemplate.selectCheckBox();
        await consoleNotesTemplate.clickOnDeleteButton();
        await utilCommon.clickOnWarningOk();
        await expect(utilCommon.getPopUpMessage()).toContain('Record deleted successfully.');
    });

    it('DRDMV-16181 : [Design Time ] Knowledge user is able to create,edit(update), Delete Knowledge Notes Template', async () => {
        try {
            await navigationPage.signOut();
            await loginPage.login("khardison");
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Knowledge Management--Notes Template', 'Activity Notes Template Console - Knowledge - Business Workflows')).toEqual('Activity Notes Template Console - Knowledge - Business Workflows');
            await consoleNotesTemplate.clickOnCreateNotesTemplate();
            var templateName: string = "activityNotesTemplate" + Math.floor(Math.random() * 100000);
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
            var updateBody: string = "UpdateNotesTemplate" + Math.floor(Math.random() * 100000);
            await editNotetemplate.changeStatusValue('Inactive');
            await editNotetemplate.updateBody(updateBody);
            await editNotetemplate.clickOnSaveButton();
            await consoleNotesTemplate.searchAndClickOnNotesTemplate(templateName);
            await expect(editNotetemplate.getStatusValue()).toContain('Inactive');
            await expect(editNotetemplate.getBodyValue()).toContain(updateBody);
            await editNotetemplate.clickOnCancelButton();
            await browser.sleep(1000);
            await consoleNotesTemplate.clickOnDeleteButton();
            await utilCommon.clickOnWarningOk();
            await expect(utilCommon.getPopUpMessage()).toContain('Record deleted successfully.');
        }
        catch (e) {
            console.log(e)
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login("elizabeth");
        }
    });

    it('DRDMV-15999 : [DesignTime] Verify Notes templates UI should be displayed as per prototype(mockups)', async () => {
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Case Management--Notes Template', 'Activity Notes Template Console - Case - Business Workflows')).toEqual('Activity Notes Template Console - Case - Business Workflows');
        await expect(consoleNotesTemplate.isNotesTemplateUIConsolePresent()).toBeTruthy
        await consoleNotesTemplate.clickOnCreateNotesTemplate();
        await expect(createNotesTemplate.isSaveButtonDisabled()).toBeFalsy();
        await expect(createNotesTemplate.isCreateNotesTemplateUIPresent()).toBeTruthy();
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('People--Notes Template', 'Activity Notes Template Console - Person - Business Workflows')).toEqual('Activity Notes Template Console - Person - Business Workflows');
        await expect(consoleNotesTemplate.isNotesTemplateUIConsolePresent()).toBeTruthy
        await consoleNotesTemplate.clickOnCreateNotesTemplate();
        await expect(createNotesTemplate.isSaveButtonDisabled()).toBeFalsy();
        await expect(createNotesTemplate.isCreateNotesTemplateUIPresent()).toBeTruthy();
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Task Management--Notes Template', 'Activity Notes Template Console - Task - Business Workflows')).toEqual('Activity Notes Template Console - Task - Business Workflows');
        await expect(consoleNotesTemplate.isNotesTemplateUIConsolePresent()).toBeTruthy
        await consoleNotesTemplate.clickOnCreateNotesTemplate();
        await expect(createNotesTemplate.isSaveButtonDisabled()).toBeFalsy();
        await expect(createNotesTemplate.isCreateNotesTemplateUIPresent()).toBeTruthy();
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Knowledge Management--Notes Template', 'Activity Notes Template Console - Knowledge - Business Workflows')).toEqual('Activity Notes Template Console - Knowledge - Business Workflows');
        await expect(consoleNotesTemplate.isNotesTemplateUIConsolePresent()).toBeTruthy
        await consoleNotesTemplate.clickOnCreateNotesTemplate();
        await expect(createNotesTemplate.isSaveButtonDisabled()).toBeFalsy();
        await expect(createNotesTemplate.isCreateNotesTemplateUIPresent()).toBeTruthy();
    }, 200 * 1000);

    it('DRDMV-16111 : [DesignTime] Verify Notes templates UI should be displayed as per prototype(mockups)', async () => {
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Case Management--Notes Template', 'Activity Notes Template Console - Case - Business Workflows')).toEqual('Activity Notes Template Console - Case - Business Workflows');
        var caseNotesTemplate = await createNotesTemplate.createNotesTemplate('Petramco');
        await consoleNotesTemplate.searchAndClickOnNotesTemplate(caseNotesTemplate);
        await editNotetemplate.changeLanguageValue('Italian (Italy)');
        await expect(editNotetemplate.getLocaleNotPresentMessage()).toContain('Please add the required localized message.')
        await editNotetemplate.clickOnCancelButton();
        await utilCommon.clickOnWarningOk();
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('People--Notes Template', 'Activity Notes Template Console - Person - Business Workflows')).toEqual('Activity Notes Template Console - Person - Business Workflows');
        var caseNotesTemplate = await createNotesTemplate.createNotesTemplate('Petramco');
        await consoleNotesTemplate.searchAndClickOnNotesTemplate(caseNotesTemplate);
        await editNotetemplate.changeLanguageValue('Italian (Italy)');
        await expect(editNotetemplate.getLocaleNotPresentMessage()).toContain('Please add the required localized message.')
        await editNotetemplate.clickOnCancelButton();
        await utilCommon.clickOnWarningOk();
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Task Management--Notes Template', 'Activity Notes Template Console - Task - Business Workflows')).toEqual('Activity Notes Template Console - Task - Business Workflows');
        var caseNotesTemplate = await createNotesTemplate.createNotesTemplate('Petramco');
        await consoleNotesTemplate.searchAndClickOnNotesTemplate(caseNotesTemplate);
        await editNotetemplate.changeLanguageValue('Italian (Italy)');
        await expect(editNotetemplate.getLocaleNotPresentMessage()).toContain('Please add the required localized message.')
        await editNotetemplate.clickOnCancelButton();
        await utilCommon.clickOnWarningOk();
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Knowledge Management--Notes Template', 'Activity Notes Template Console - Knowledge - Business Workflows')).toEqual('Activity Notes Template Console - Knowledge - Business Workflows');
        var caseNotesTemplate = await createNotesTemplate.createNotesTemplate('Petramco');
        await consoleNotesTemplate.searchAndClickOnNotesTemplate(caseNotesTemplate);
        await editNotetemplate.changeLanguageValue('Italian (Italy)');
        await expect(editNotetemplate.getLocaleNotPresentMessage()).toContain('Please add the required localized message.')
        await editNotetemplate.clickOnCancelButton();
        await utilCommon.clickOnWarningOk();
    }, 200 * 1000);

    it('DRDMV-16040 :[Run Time] Verify that case BA is able to consume more than one Enabled case notes templates on case ( one at a time can post)', async () => {
        await navigationPage.gotoSettingsPage();
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
        var caseData = {
            "Requester": "qtao",
            "Summary": "Testing case creation with minimal input data"
        }
        await apiHelper.apiLogin('qtao');
        var newCaseTemplate = await apiHelper.createCase(caseData);
        var displayId: string = newCaseTemplate.displayId;
        await navigationPage.gotoCaseConsole();
        await utilGrid.clearFilter();
        await utilGrid.searchAndOpenHyperlink(displayId);
        await notesTemplateUsage.clickOnAddNoteAndAddNoteTemplate(notesTemplateName);
        await activityTabPo.clickOnPostButton();
        expect(await activityTabPo.isTextPresentInNote(notesTemplateBody)).toBeTruthy();
        await notesTemplateUsage.clickOnAddNoteAndAddNoteTemplate(notesTemplateName1);
        await activityTabPo.clickOnPostButton();
        expect(await activityTabPo.isTextPresentInNote(notesTemplateBody1)).toBeTruthy();
        await notesTemplateUsage.clickOnAddNoteAndAddNoteTemplate(notesTemplateName2);
        await activityTabPo.clickOnPostButton();
        expect(await activityTabPo.isTextPresentInNote(notesTemplateBody2)).toBeTruthy();
        await notesTemplateUsage.clickOnAddNoteAndAddNoteTemplate(notesTemplateName3);
        await activityTabPo.clickOnPostButton();
        expect(await activityTabPo.isTextPresentInNote(notesTemplateBody3)).toBeTruthy();
    }, 200 * 1000)

    it('DRDMV-16578: Case Agent/Case Manger Should be able to consume People Notes Template in People profile', async () => {
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
            var caseData = {
                "Requester": "qdu",
                "Summary": "Testing case creation with minimal input data"
            }
            await apiHelper.apiLogin('franz');
            var newCaseTemplate = await apiHelper.createCase(caseData);
            var displayId: string = newCaseTemplate.displayId;
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(displayId);
            await notesTemplateUsage.clickOnRequsterName();
            await notesTemplateUsage.clickOnAddNoteAndAddNoteTemplate(notesTemplateName);
            await activityTabPo.clickOnPostButton();
            expect(await activityTabPo.isTextPresentInNote(notesTemplateBody)).toBeTruthy();
            await navigationPage.signOut();
            await loginPage.login('qdu');
            var caseData = {
                "Requester": "qtao",
                "Summary": "Testing case creation with minimal input data"
            }
            await apiHelper.apiLogin('qdu');
            var newCaseTemplate = await apiHelper.createCase(caseData);
            console.log("case is created===", newCaseTemplate.displayId);
            var displayIdnew: string = newCaseTemplate.displayId;
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(displayIdnew);
            await notesTemplateUsage.clickOnRequsterName();
            await notesTemplateUsage.clickOnAddNoteAndAddNoteTemplate(notesTemplateName);
            await activityTabPo.clickOnPostButton();
            expect(await activityTabPo.isTextPresentInNote(notesTemplateBody)).toBeTruthy();
        }
        catch (e) {
            console.log(e);
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        }
    }, 200 * 1000)

    it('DRDMV-16045: [Run Time] Verify case BA is able to select and utilize Active Task notes templates in Activity for Manual', async () => {
        try {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            let taskTemplateName = 'Manual  task' + [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let manualTaskSummary = 'Summary' + [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            var templateData = {
                "templateName": `${taskTemplateName}`,
                "templateSummary": `${manualTaskSummary}`,
                "templateStatus": "Active",
            }
            await apiHelper.apiLogin('fritz');
            var manualTaskTemplate = await apiHelper.createManualTaskTemplate(templateData);
            console.log("active task Template is created===", manualTaskTemplate.displayId);
            await apiHelper.apiLogin('qkatawazi');
            let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let notesTemplateData = require('../../data/ui/social/notesTemplate.ui.json');
            let notesTemplateName: string = await notesTemplateData['notesTemplateWithMandatoryField'].templateName + randomStr;
            let notesTemplateBody: string = await notesTemplateData['notesTemplateWithMandatoryField'].body + randomStr;
            notesTemplateData['notesTemplateWithMandatoryField'].body = notesTemplateBody;
            notesTemplateData['notesTemplateWithMandatoryField'].templateName = notesTemplateName;
            await apiHelper.createNotesTemplate("Task", notesTemplateData['notesTemplateWithMandatoryField']);
            var caseData = {
                "Requester": "qtao",
                "Company": "Petramco",
                "Summary": "Create case for me postman1",
                "Support Group": "Compensation and Benefits",
                "Assignee": "Qadim Katawazi"
            }
            await apiHelper.apiLogin('fritz');
            var newCaseTemplate = await apiHelper.createCase(caseData);
            var displayId: string = newCaseTemplate.displayId;
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(displayId);
            await viewCasePage.clickAddTaskButton();
            await viewCasePage.addTaskFromTaskTemplate(taskTemplateName);
            await browser.sleep(2000);
            await manageTask.clickTaskLinkOnManageTask(taskTemplateName);
            await viewTask.clickOnEditTask();
            await editTask.clickOnAssignToMe();
            await editTask.clickOnSaveButton();
            await notesTemplateUsage.clickOnAddNoteAndAddNoteTemplate(notesTemplateName);
            await activityTabPo.clickOnPostButton();
            expect(await activityTabPo.isTextPresentInNote(notesTemplateBody)).toBeTruthy();
        } catch (e) {
            console.log(e);
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        }
    })

    it('DRDMV-16047: [Run Time] Validate that case BA is able to select and utilize Active Knowledge notes templates in Knowledge Article ', async () => {
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
        await expect(browser.getTitle()).toBe('Knowledge Article Templates Preview - Business Workflows');
        await createKnowlegePo.clickOnTemplate('Reference');
        await createKnowlegePo.clickOnUseSelectedTemplateButton();
        await createKnowlegePo.addTextInKnowlegeTitleField('test case for DRDMV-16754');
        await createKnowlegePo.selectKnowledgeSet('HR');
        await createKnowlegePo.clickOnSaveKnowledgeButton();
        await createKnowlegePo.clickOnviewArticleLinkButton();
        // View Knowledege Page
        await utilCommon.switchToNewWidnow(1);
        await createKnowlegePo.clickOnActivityTab();
        await notesTemplateUsage.clickOnAddNoteAndAddNoteTemplate(notesTemplateName);
        await activityTabPo.clickOnPostButton();
        expect(await activityTabPo.isTextPresentInNote(notesTemplateBody)).toBeTruthy();
    })
})