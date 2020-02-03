import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import consoleAcknowledgmentTemplatePo from '../../pageobject/settings/email/console-acknowledgment-template.po';
import createAcknowledgmentTemplatesPo from '../../pageobject/settings/email/create-acknowledgment-template.po';
import editAcknowledgmentTemplatePo from '../../pageobject/settings/email/edit-acknowledgment-template.po';
import utilCommon from '../../utils/util.common';

describe('AcknowledgmentTemplate', () => {
    let label: string;
    let menuItemDataFile = require('../../data/ui/ticketing/menuItem.ui.json');
    beforeAll(async () => {
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
        await loginPage.login('qkatawazi');

        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
        await loginPage.login('qkatawazi');
        await apiHelper.apiLogin('qkatawazi');
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        label = await menuItemDataFile['sampleMenuItem'].menuItemName + randomStr;
        menuItemDataFile['sampleMenuItem'].menuItemName = label;
        await apiHelper.createNewMenuItem(menuItemDataFile['sampleMenuItem']);
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    afterEach(async () => {
        await browser.refresh();
        await utilCommon.waitUntilSpinnerToHide();
    });

    //kgaikwad
    it('[DRDMV-10896,DRDMV-10901,DRDMV-10922,DRDMV-10895]: Acknowledgment Template : Acknowledgment Template creation', async () => {
        let templateName = 'Private' + [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateName2 = 'Public' + [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
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
        await navigationPage.gotoSettingsMenuItem('Email--Acknowledgment Templates', 'Email Ack Template Console - Business Workflows');
        await consoleAcknowledgmentTemplatePo.clickOnAddAcknowlegeTemplateButton();
        await createAcknowledgmentTemplatesPo.setTemplateName(templateName);
        await createAcknowledgmentTemplatesPo.selectCompanyDropDown('Petramco');
        await createAcknowledgmentTemplatesPo.selectStatusDropDown('Active');
        await createAcknowledgmentTemplatesPo.selectLabelDropDown(label);
        await createAcknowledgmentTemplatesPo.setDescription(description);
        await createAcknowledgmentTemplatesPo.setSubject(subject);
        await createAcknowledgmentTemplatesPo.setBody(body);
        await createAcknowledgmentTemplatesPo.clickOnSaveButton();
        await utilCommon.waitUntilPopUpDisappear();

        let arr: string[] = ["Label"];
        await consoleAcknowledgmentTemplatePo.addColumnOnGrid(arr);
        let arr2: string[] = ['Template Name', 'Subject', "Company", "Status", "Label"];
        expect(await consoleAcknowledgmentTemplatePo.areGridColumnHeaderMatches(arr2)).toBeTruthy('Column header not matches');

        await consoleAcknowledgmentTemplatePo.searchOnGridConsole(templateName);
        expect(await consoleAcknowledgmentTemplatePo.getSelectedGridRecordValue('Template Name')).toBe(templateName, 'Private template name is missing');
        expect(await consoleAcknowledgmentTemplatePo.getSelectedGridRecordValue('Subject')).toBe(subject, 'Private template subject is missing');
        expect(await consoleAcknowledgmentTemplatePo.getSelectedGridRecordValue('Company')).toBe('Petramco', 'Private template company name is missing');
        expect(await consoleAcknowledgmentTemplatePo.getSelectedGridRecordValue('Status')).toBe('Active', 'Private template status is missing');
        expect(await consoleAcknowledgmentTemplatePo.getSelectedGridRecordValue('Label')).toBe(label, 'Private template label is missing');

        await consoleAcknowledgmentTemplatePo.clickOnAddAcknowlegeTemplateButton();
        await createAcknowledgmentTemplatesPo.setTemplateName(templateName2);
        await createAcknowledgmentTemplatesPo.selectCompanyDropDown('- Global -');
        await createAcknowledgmentTemplatesPo.selectStatusDropDown('Active');
        await createAcknowledgmentTemplatesPo.selectLabelDropDown(label);
        await createAcknowledgmentTemplatesPo.setDescription(description);
        await createAcknowledgmentTemplatesPo.setSubject(subject);
        await createAcknowledgmentTemplatesPo.setBody(body);
        await createAcknowledgmentTemplatesPo.clickOnSaveButton();
        await utilCommon.waitUntilPopUpDisappear();

        await consoleAcknowledgmentTemplatePo.searchOnGridConsole(templateName2);
        expect(await consoleAcknowledgmentTemplatePo.getSelectedGridRecordValue('Template Name')).toBe(templateName2, 'Public template name is missing');
        expect(await consoleAcknowledgmentTemplatePo.getSelectedGridRecordValue('Subject')).toBe(subject, 'Public template subject is missing');
        expect(await consoleAcknowledgmentTemplatePo.getSelectedGridRecordValue('Company')).toBe('- Global -', 'Public template company name is missing');
        expect(await consoleAcknowledgmentTemplatePo.getSelectedGridRecordValue('Status')).toBe('Active', 'Public template status is missing');
        expect(await consoleAcknowledgmentTemplatePo.getSelectedGridRecordValue('Label')).toBe(label, 'Public template label is missing');
        await consoleAcknowledgmentTemplatePo.removeColumnOnGrid(arr);

        await consoleAcknowledgmentTemplatePo.clearGridSearchBox();
        await consoleAcknowledgmentTemplatePo.searchAndSelectGridRecord(templateName);
        await consoleAcknowledgmentTemplatePo.clickOnDeleteButton();
        await utilCommon.waitUntilSpinnerToHide();
        expect(await consoleAcknowledgmentTemplatePo.isGridRecordPresent(templateName)).toBeFalsy('Public template name is preset on grid')

        await consoleAcknowledgmentTemplatePo.clearGridSearchBox();
        await consoleAcknowledgmentTemplatePo.searchAndSelectGridRecord(templateName2);
        await consoleAcknowledgmentTemplatePo.clickOnDeleteButton();
        await utilCommon.waitUntilSpinnerToHide();
        expect(await consoleAcknowledgmentTemplatePo.isGridRecordPresent(templateName2)).toBeFalsy('Public template name is preset on grid')
    }, 180 * 1000)

    //kgaikwad
    it('[DRDMV-10902,DRDMV-10900,DRDMV-10924,DRDMV-10923]: Acknowledgment Template: Acknowledgment Template creation with same name', async () => {
        let templateName = 'Private' + [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateName2 = 'Public' + [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateName3 = 'Private' + [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let description = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let description2 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let subject = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let subject2 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let body = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let body2 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Email--Acknowledgment Templates', 'Email Ack Template Console - Business Workflows');
        await consoleAcknowledgmentTemplatePo.clickOnAddAcknowlegeTemplateButton();
        await createAcknowledgmentTemplatesPo.setTemplateName(templateName);
        await createAcknowledgmentTemplatesPo.selectCompanyDropDown('Petramco');
        await createAcknowledgmentTemplatesPo.selectStatusDropDown('Active');
        await createAcknowledgmentTemplatesPo.selectLabelDropDown(label);
        await createAcknowledgmentTemplatesPo.setDescription(description);
        await createAcknowledgmentTemplatesPo.setSubject(subject);
        await createAcknowledgmentTemplatesPo.setBody(body);
        await createAcknowledgmentTemplatesPo.clickOnSaveButton();
        await utilCommon.waitUntilPopUpDisappear();

        await consoleAcknowledgmentTemplatePo.clickOnAddAcknowlegeTemplateButton();
        await createAcknowledgmentTemplatesPo.setTemplateName(templateName2);
        await createAcknowledgmentTemplatesPo.selectCompanyDropDown('- Global -');
        await createAcknowledgmentTemplatesPo.selectStatusDropDown('Active');
        await createAcknowledgmentTemplatesPo.selectLabelDropDown(label);
        await createAcknowledgmentTemplatesPo.setDescription(description);
        await createAcknowledgmentTemplatesPo.setSubject(subject);
        await createAcknowledgmentTemplatesPo.setBody(body);
        await createAcknowledgmentTemplatesPo.clickOnSaveButton();
        await utilCommon.waitUntilPopUpDisappear();
        // DRDMV-10900
        await consoleAcknowledgmentTemplatePo.searchAndOpenAcknowledgmentTemplate(templateName);
        await utilCommon.waitUntilSpinnerToHide();
        await editAcknowledgmentTemplatePo.updateTemplateName(templateName3);
        expect(await editAcknowledgmentTemplatePo.isModuleNameDisabled()).toBeTruthy('Module Name is enabled');
        expect(await editAcknowledgmentTemplatePo.isCompanyDropDownDisabled()).toBeTruthy('Company drop down is enabled');
        await editAcknowledgmentTemplatePo.updateDescription(description2);
        await editAcknowledgmentTemplatePo.selectStatusDropDown('Active');
        expect(await editAcknowledgmentTemplatePo.isLocalizedMessageButtonDisplayed()).toBeTruthy('Localize message button is missing');
        await editAcknowledgmentTemplatePo.selectlocaleDropDown('English (United States)');
        let arr: string[] = ["Dutch (Netherlands)", "English (United States)", "French (France)", "German (Germany)", "Italian (Italy)", "Portuguese (Brazil)", "Spanish (International Sort)", "Swedish (Sweden)"]
        expect(await editAcknowledgmentTemplatePo.isLocaleDropDownValueDisplayed(arr)).toBeTruthy('Values not displayed in locale drop down');


        await editAcknowledgmentTemplatePo.clickOnGridSearchIcon();
        await editAcknowledgmentTemplatePo.searchAndSelectGridRecord('body');
        await editAcknowledgmentTemplatePo.clickOnGridEditButton();
        await editAcknowledgmentTemplatePo.updateEditMessageTextBladeBody(body2);
        await editAcknowledgmentTemplatePo.clickOnEditMessageTextBladeSaveButton();
        await utilCommon.waitUntilPopUpDisappear();

        await editAcknowledgmentTemplatePo.searchAndSelectGridRecord('subject');
        await editAcknowledgmentTemplatePo.clickOnGridEditButton();
        await editAcknowledgmentTemplatePo.updateEditMessageTextBladeSubject(subject2);
        await editAcknowledgmentTemplatePo.clickOnEditMessageTextBladeSaveButton();
        await utilCommon.waitUntilPopUpDisappear();

        await consoleAcknowledgmentTemplatePo.searchOnGridConsole('body');
        expect(await editAcknowledgmentTemplatePo.getSelectedGridRecordValue('Message')).toBe('<p>' + body2 + '</p>', 'body not updated correctly');
        await consoleAcknowledgmentTemplatePo.searchOnGridConsole('subject');
        expect(await editAcknowledgmentTemplatePo.getSelectedGridRecordValue('Message')).toBe(subject2, 'subject not updated correctly');
        await editAcknowledgmentTemplatePo.clickOnSaveButton();

        // DRDMV-10924
        await consoleAcknowledgmentTemplatePo.clearGridFilter();
        await consoleAcknowledgmentTemplatePo.clearGridSearchBox();
        let arr2: string[] = ["Label"];
        await consoleAcknowledgmentTemplatePo.addColumnOnGrid(arr2);
        await consoleAcknowledgmentTemplatePo.addFilter('Template Name', templateName3, 'text');
        expect(await consoleAcknowledgmentTemplatePo.getSelectedGridRecordValue('Template Name')).toBe(templateName3, 'Filter Template Name is missing in column');
        await consoleAcknowledgmentTemplatePo.addFilter('Label', label, 'text');
        expect(await consoleAcknowledgmentTemplatePo.getSelectedGridRecordValue('Label')).toBe(label, ' Filter Label is missing in column');
        await consoleAcknowledgmentTemplatePo.addFilter('Status', 'Active', 'checkbox');
        expect(await consoleAcknowledgmentTemplatePo.getSelectedGridRecordValue('Status')).toBe('Active', 'Filter Label is missing in column');
        await consoleAcknowledgmentTemplatePo.addFilter('Company', 'Petramco', 'text');
        expect(await consoleAcknowledgmentTemplatePo.getSelectedGridRecordValue('Company')).toBe('Petramco', 'Filter Company is missing in column');
        await consoleAcknowledgmentTemplatePo.addFilter('Subject', subject2, 'text');
        expect(await consoleAcknowledgmentTemplatePo.getSelectedGridRecordValue('Subject')).toBe(subject2, 'Filter Subject is missing in column');
        await consoleAcknowledgmentTemplatePo.removeColumnOnGrid(arr2);
        await consoleAcknowledgmentTemplatePo.clearGridFilter();

        // DRDMV-10923
        await consoleAcknowledgmentTemplatePo.searchOnGridConsole(templateName3);
        expect(await consoleAcknowledgmentTemplatePo.getSelectedGridRecordValue('Template Name')).toBe(templateName3, 'Search Template Name is missing in column');
        await consoleAcknowledgmentTemplatePo.searchOnGridConsole(subject);
        expect(await consoleAcknowledgmentTemplatePo.getSelectedGridRecordValue('Subject')).toBe(subject, 'Search Subject is missing in column');
        await consoleAcknowledgmentTemplatePo.searchOnGridConsole('Petramco');
        expect(await consoleAcknowledgmentTemplatePo.getSelectedGridRecordValue('Company')).toBe('Petramco', 'Search Company is missing in column');

        // DRDMV-10902
        await consoleAcknowledgmentTemplatePo.clickOnAddAcknowlegeTemplateButton();
        await createAcknowledgmentTemplatesPo.setTemplateName(templateName3);
        await createAcknowledgmentTemplatesPo.selectCompanyDropDown('Petramco');
        await createAcknowledgmentTemplatesPo.selectStatusDropDown('Active');
        await createAcknowledgmentTemplatesPo.selectLabelDropDown(label);
        await createAcknowledgmentTemplatesPo.setDescription(description);
        await createAcknowledgmentTemplatesPo.setSubject(subject);
        await createAcknowledgmentTemplatesPo.setBody(body);
        await createAcknowledgmentTemplatesPo.clickOnSaveButton();
        expect(await utilCommon.getPopUpMessage()).toBe('ERROR (222108): Template Already exist with given name:' + templateName3, 'Duplicate private template name error message is missing');
        await utilCommon.closePopUpMessage();
        await createAcknowledgmentTemplatesPo.clickOnCancelButton();
        await utilCommon.clickOnWarningOk();

        await consoleAcknowledgmentTemplatePo.clickOnAddAcknowlegeTemplateButton();
        await createAcknowledgmentTemplatesPo.setTemplateName(templateName2);
        await createAcknowledgmentTemplatesPo.selectCompanyDropDown('- Global -');
        await createAcknowledgmentTemplatesPo.selectStatusDropDown('Active');
        await createAcknowledgmentTemplatesPo.selectLabelDropDown(label);
        await createAcknowledgmentTemplatesPo.setDescription(description);
        await createAcknowledgmentTemplatesPo.setSubject(subject);
        await createAcknowledgmentTemplatesPo.setBody(body);
        await createAcknowledgmentTemplatesPo.clickOnSaveButton();
        expect(await utilCommon.getPopUpMessage()).toBe('ERROR (222108): Template Already exist with given name:' + templateName2, 'Duplicate private template name error message is missing');
        await utilCommon.closePopUpMessage();
        await createAcknowledgmentTemplatesPo.clickOnCancelButton();
        await utilCommon.clickOnWarningOk();
    }, 240 * 1000)
})
