import { browser } from "protractor";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import consoleEmailTemplatePo from '../../pageobject/settings/email/console-email-template.po';
import createEmailTemplatePo from '../../pageobject/settings/email/create-email-template.po';
import utilCommon from '../../utils/util.common';
import apiHelper from '../../api/api.helper';
import editEmailTemplatePo from '../../pageobject/settings/email/edit-email-template.po';
import utilGrid from 'e2e/utils/util.grid';
describe('EmailTemplate', () => {

    beforeAll(async () => {
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    afterEach(async () => {
        await browser.refresh();
        await utilCommon.waitUntilSpinnerToHide();
    });

    //kgaikwad
    fit('DRDMV-10813,DRDMV-10796,DRDMV-10787,DRDMV-10804,DRDMV-10789 : Email Template : User Is Not able to Create Duplicate Email Template', async () => {
        let templateName = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateName2 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let description = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let subject = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let body = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');

        await apiHelper.apiLogin('qkatawazi');
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let menuItemDataFile = require('../../data/ui/ticketing/menuItem.ui.json');
        let label: string = await menuItemDataFile['sampleMenuItem'].menuItemName + randomStr;
        menuItemDataFile['sampleMenuItem'].menuItemName = label;
        await apiHelper.createNewMenuItem(menuItemDataFile['sampleMenuItem']);

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Email--Templates', 'Email Template Console - Business Workflows');
        await consoleEmailTemplatePo.clickOnAddEmailTemplateButton();
        await createEmailTemplatePo.setTemplateName(templateName);
        await createEmailTemplatePo.selectCompanyDropDown('Petramco');
        await createEmailTemplatePo.selectStatusDropDown('Active');
        await createEmailTemplatePo.selectLabelDropDown(label);
        await createEmailTemplatePo.setDescription(description);
        await createEmailTemplatePo.setSubject(subject);
        await createEmailTemplatePo.setBody(body);
        await createEmailTemplatePo.clickOnSaveButton();

        await consoleEmailTemplatePo.clickOnAddEmailTemplateButton();
        await createEmailTemplatePo.setTemplateName(templateName2);
        await createEmailTemplatePo.selectCompanyDropDown('- Global -');
        await createEmailTemplatePo.selectStatusDropDown('Active');
        await createEmailTemplatePo.selectLabelDropDown(label);
        await createEmailTemplatePo.setDescription(description);
        await createEmailTemplatePo.setSubject(subject);
        await createEmailTemplatePo.setBody(body);
        await createEmailTemplatePo.clickOnSaveButton();

        await consoleEmailTemplatePo.searchOnGridConsole(templateName);
        expect(await consoleEmailTemplatePo.getSelectedGridRecordValue('Template Name')).toBe(templateName,'Template Name for Petramco compnay is missing')
        expect(await consoleEmailTemplatePo.getSelectedGridRecordValue('Subject')).toBe(subject,'Subject for Petramco compnay is missing')
        expect(await consoleEmailTemplatePo.getSelectedGridRecordValue('Company')).toBe('Petramco','Petramco for Petramco compnay is missing')
        expect(await consoleEmailTemplatePo.getSelectedGridRecordValue('Status')).toBe('Active','Active for Petramco compnay is missing')

        await consoleEmailTemplatePo.searchOnGridConsole(templateName2);
        expect(await consoleEmailTemplatePo.getSelectedGridRecordValue('Template Name')).toBe(templateName2,'Template Name for Petramco compnay is missing')
        expect(await consoleEmailTemplatePo.getSelectedGridRecordValue('Subject')).toBe(subject,'Subject for Petramco compnay is missing')
        expect(await consoleEmailTemplatePo.getSelectedGridRecordValue('Company')).toBe('- Global -','Petramco for Petramco compnay is missing')
        expect(await consoleEmailTemplatePo.getSelectedGridRecordValue('Status')).toBe('Active','Active for Petramco compnay is missing')
        await consoleEmailTemplatePo.clickOnAddEmailTemplateButton();
        await createEmailTemplatePo.setTemplateName(templateName);
        await createEmailTemplatePo.selectCompanyDropDown('Petramco');
        await createEmailTemplatePo.selectStatusDropDown('Active');
        await createEmailTemplatePo.selectLabelDropDown(label);
        await createEmailTemplatePo.setDescription(description);
        await createEmailTemplatePo.setSubject(subject);
        await createEmailTemplatePo.setBody(body);
        await createEmailTemplatePo.clickOnSaveButton();
        expect(await utilCommon.getPopUpMessage()).toBe('ERROR (222108): Template Already exist with given name:'+templateName,'Duplicate Template Error messsage missing.');
        await utilCommon.closePopUpMessage();
        await createEmailTemplatePo.clickOnCancelButton();
        await utilCommon.clickOnWarningOk();

        await consoleEmailTemplatePo.searchAndOpenEmailTemplate(templateName);
        expect(await editEmailTemplatePo.isModuleNameDisabled()).toBeTruthy('Module Name is enabled');
        expect(await editEmailTemplatePo.isCompanyDropDownDisabled()).toBeTruthy('Company drop down is enabled');
        await editEmailTemplatePo.updateDescription(description);
        await editEmailTemplatePo.selectStatusDropDown('Active');
        await editEmailTemplatePo.selectLabelDropDown(label);
        await editEmailTemplatePo.selectlocaleDropDown('English (United States)');
        await editEmailTemplatePo.clickOnGridSearchIcon();
        await editEmailTemplatePo.searchOnGridConsole('body');
        expect(await editEmailTemplatePo.isLocalizedMessageButtonDisplayed()).toBeTruthy('Localize Message button is missing');
        expect(await editEmailTemplatePo.getSelectedGridRecordValue('Message Type')).toBe('body','Body is missing from Grid');
        await editEmailTemplatePo.searchOnGridConsole('subject');
        expect(await editEmailTemplatePo.getSelectedGridRecordValue('Message Type')).toBe('subject','subject is missing from Grid');
    }, 160 * 1000)

    it('DRDMV-10813,DRDMV-10796,DRDMV-10787,DRDMV-10804,DRDMV-10789 : Email Template : User Is Not able to Create Duplicate Email Template', async () => {
        let templateName = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateName2 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let description = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let subject = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let body = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');

        await apiHelper.apiLogin('qkatawazi');
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let menuItemDataFile = require('../../data/ui/ticketing/menuItem.ui.json');
        let label: string = await menuItemDataFile['sampleMenuItem'].menuItemName + randomStr;
        menuItemDataFile['sampleMenuItem'].menuItemName = label;
        await apiHelper.createNewMenuItem(menuItemDataFile['sampleMenuItem']);

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Email--Templates', 'Email Template Console - Business Workflows');
        await consoleEmailTemplatePo.clickOnAddEmailTemplateButton();
        await createEmailTemplatePo.setTemplateName(templateName);
        await createEmailTemplatePo.selectCompanyDropDown('Petramco');
        await createEmailTemplatePo.selectStatusDropDown('Active');
        await createEmailTemplatePo.selectLabelDropDown(label);
        await createEmailTemplatePo.setDescription(description);
        await createEmailTemplatePo.setSubject(subject);
        await createEmailTemplatePo.setBody(body);
        await createEmailTemplatePo.clickOnSaveButton();

        await consoleEmailTemplatePo.clearGridSearchBox();
        await consoleEmailTemplatePo.searchAndSelectGridRecord(templateName);
        await consoleEmailTemplatePo.clickOnDeleteButton();
        await utilCommon.waitUntilSpinnerToHide();
        expect(await consoleEmailTemplatePo.isGridRecordPresent(templateName2)).toBeFalsy('Public template name is preset on grid')

        // await consoleEmailTemplatePo.clickOnAddEmailTemplateButton();
        // await createEmailTemplatePo.setTemplateName(templateName2);
        // await createEmailTemplatePo.selectCompanyDropDown('- Global -');
        // await createEmailTemplatePo.selectStatusDropDown('Active');
        // await createEmailTemplatePo.selectLabelDropDown(label);
        // await createEmailTemplatePo.setDescription(description);
        // await createEmailTemplatePo.setSubject(subject);
        // await createEmailTemplatePo.setBody(body);
        // await createEmailTemplatePo.clickOnSaveButton();

        // await consoleEmailTemplatePo.searchOnGridConsole(templateName);
        // expect(await consoleEmailTemplatePo.getSelectedGridRecordValue('Template Name')).toBe(templateName,'Template Name for Petramco compnay is missing')
        // expect(await consoleEmailTemplatePo.getSelectedGridRecordValue('Subject')).toBe(subject,'Subject for Petramco compnay is missing')
        // expect(await consoleEmailTemplatePo.getSelectedGridRecordValue('Company')).toBe('Petramco','Petramco for Petramco compnay is missing')
        // expect(await consoleEmailTemplatePo.getSelectedGridRecordValue('Status')).toBe('Active','Active for Petramco compnay is missing')

        // await consoleEmailTemplatePo.searchOnGridConsole(templateName2);
        // expect(await consoleEmailTemplatePo.getSelectedGridRecordValue('Template Name')).toBe(templateName2,'Template Name for Petramco compnay is missing')
        // expect(await consoleEmailTemplatePo.getSelectedGridRecordValue('Subject')).toBe(subject,'Subject for Petramco compnay is missing')
        // expect(await consoleEmailTemplatePo.getSelectedGridRecordValue('Company')).toBe('- Global -','Petramco for Petramco compnay is missing')
        // expect(await consoleEmailTemplatePo.getSelectedGridRecordValue('Status')).toBe('Active','Active for Petramco compnay is missing')
        // await consoleEmailTemplatePo.clickOnAddEmailTemplateButton();
        // await createEmailTemplatePo.setTemplateName(templateName);
        // await createEmailTemplatePo.selectCompanyDropDown('Petramco');
        // await createEmailTemplatePo.selectStatusDropDown('Active');
        // await createEmailTemplatePo.selectLabelDropDown(label);
        // await createEmailTemplatePo.setDescription(description);
        // await createEmailTemplatePo.setSubject(subject);
        // await createEmailTemplatePo.setBody(body);
        // await createEmailTemplatePo.clickOnSaveButton();
        // expect(await utilCommon.getPopUpMessage()).toBe('ERROR (222108): Template Already exist with given name:'+templateName,'Duplicate Template Error messsage missing.');
        // await utilCommon.closePopUpMessage();
        // await createEmailTemplatePo.clickOnCancelButton();
        // await utilCommon.clickOnWarningOk();

        // await consoleEmailTemplatePo.searchAndOpenEmailTemplate('nc7wnhs4k4');
        // expect(await editEmailTemplatePo.isModuleNameDisabled()).toBeTruthy('Module Name is enabled');
        // expect(await editEmailTemplatePo.isCompanyDropDownDisabled()).toBeTruthy('Company drop down is enabled');
        // await editEmailTemplatePo.updateDescription(description);
        // await editEmailTemplatePo.selectStatusDropDown('Active');
        // await editEmailTemplatePo.selectLabelDropDown(label);
        // await editEmailTemplatePo.selectlocaleDropDown('English (United States)');
        // await editEmailTemplatePo.clickOnGridSearchIcon();
        // await editEmailTemplatePo.searchOnGridConsole('body');
        // expect(await editEmailTemplatePo.isLocalizedMessageButtonDisplayed()).toBeTruthy('Localize Message button is missing');
        // expect(await editEmailTemplatePo.getSelectedGridRecordValue('Message Type')).toBe('body','Body is missing from Grid');
        // await editEmailTemplatePo.searchOnGridConsole('subject');
        // expect(await editEmailTemplatePo.getSelectedGridRecordValue('Message Type')).toBe('subject','subject is missing from Grid');
    }, 160 * 1000)
})
