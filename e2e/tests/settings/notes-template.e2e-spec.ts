import { browser } from "protractor";
import loginPage from "../../pageobject/login.po";
import navigationPage from "../../pageobject/navigation.po";
import consoleNotesTemplate from '../../pageobject/settings/console-notestemplate.po';
import createNotesTemplate from '../../pageobject/settings/create-notestemplate.po';
import addFieldPo from '../../pageobject/settings/add-fields-pop.po';
import utilCommon from '../../utils/ui/util.common';
import editNotetemplate from '../../pageobject/settings/edit-notestemplate.po';

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
})