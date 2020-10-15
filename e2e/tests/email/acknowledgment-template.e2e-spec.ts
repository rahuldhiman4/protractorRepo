import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import consoleAcknowledgmentTemplatePo from '../../pageobject/settings/email/console-acknowledgment-template.po';
import createAcknowledgmentTemplatesPo from '../../pageobject/settings/email/create-acknowledgment-template.po';
import editAcknowledgmentTemplatePo from '../../pageobject/settings/email/edit-acknowledgment-template.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilGrid from '../../utils/util.grid';
import utilityCommon from '../../utils/utility.common';
import { SAMPLE_MENU_ITEM } from '../../data/ui/ticketing/menu.item.ui';
import { cloneDeep } from 'lodash';

describe('Acknowledgment Template', () => {
    let label = "POSH";
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
        await apiHelper.apiLogin('qkatawazi');
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //ankagraw
    it('[DRDMV-10897]: Acknowledgment Template : Acknowledgment Template creation UI validations', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Email--Acknowledgment Templates', 'Email Ack Template Console - Business Workflows');
        await consoleAcknowledgmentTemplatePo.clickOnAddAcknowlegeTemplateButton();
        expect(await createAcknowledgmentTemplatesPo.isTemplateNameRequired()).toBeTruthy();
        expect(await createAcknowledgmentTemplatesPo.isCompanyRequired()).toBeTruthy();
        expect(await createAcknowledgmentTemplatesPo.isStatusRequired()).toBeTruthy();
        expect(await createAcknowledgmentTemplatesPo.isSubjectRequired()).toBeTruthy();
        expect(await createAcknowledgmentTemplatesPo.islineOfBusinessDisabled()).toBeTruthy();
        expect(await createAcknowledgmentTemplatesPo.isLocaleDisabled()).toBeTruthy();
        await createAcknowledgmentTemplatesPo.clickOnCancelButton();
        await utilCommon.clickOnWarningOk();
    });

    //kgaikwad
    describe('[DRDMV-10896,DRDMV-10901,DRDMV-10922,DRDMV-10895]: Acknowledgment Template : Acknowledgment Template creation', async () => {
        let templateName = 'Private' + [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateName2 = 'Public' + [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let description = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let subject = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let body = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let arr: string[] = ["Label"];

        it('[DRDMV-10896,DRDMV-10901,DRDMV-10922,DRDMV-10895]: Acknowledgment Template : Acknowledgment Template creation', async () => {
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
            await utilCommon.closePopUpMessage();
        });
        it('[DRDMV-10896,DRDMV-10901,DRDMV-10922,DRDMV-10895]: Acknowledgment Template : Acknowledgment Template creation', async () => {
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
            await utilCommon.closePopUpMessage();
        });
        it('[DRDMV-10896,DRDMV-10901,DRDMV-10922,DRDMV-10895]: Acknowledgment Template : Acknowledgment Template creation', async () => {
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
            expect(await consoleAcknowledgmentTemplatePo.isGridRecordPresent(templateName)).toBeFalsy('Private template name is preset on grid')
            await consoleAcknowledgmentTemplatePo.clearGridSearchBox();
            await consoleAcknowledgmentTemplatePo.searchAndSelectGridRecord(templateName2);
            await consoleAcknowledgmentTemplatePo.clickOnDeleteButton();
            expect(await consoleAcknowledgmentTemplatePo.isGridRecordPresent(templateName2)).toBeFalsy('Public template name is preset on grid')
        });
    });

    //kgaikwad
    describe('[DRDMV-10900,DRDMV-10924,DRDMV-10923]: Acknowledgment Template : Edit Acknowledgment Template UI validation', async () => {
        let templateName = 'Private' + [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateName2 = 'Public' + [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let description = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let description2 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let subject = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let subject2 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let body = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let body2 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let arr2: string[] = ["Label"];
        it('[DRDMV-10900,DRDMV-10924,DRDMV-10923]: Acknowledgment Template : Edit Acknowledgment Template UI validation', async () => {
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
            await utilCommon.closePopUpMessage();
        });
        it('[DRDMV-10900,DRDMV-10924,DRDMV-10923]: Acknowledgment Template : Edit Acknowledgment Template UI validation', async () => {
            await consoleAcknowledgmentTemplatePo.clickOnAddAcknowlegeTemplateButton();
            await createAcknowledgmentTemplatesPo.setTemplateName(templateName2);
            await createAcknowledgmentTemplatesPo.selectCompanyDropDown('- Global -');
            await createAcknowledgmentTemplatesPo.selectStatusDropDown('Active');
            await createAcknowledgmentTemplatesPo.selectLabelDropDown(label);
            await createAcknowledgmentTemplatesPo.setDescription(description);
            await createAcknowledgmentTemplatesPo.setSubject(subject);
            await createAcknowledgmentTemplatesPo.setBody(body);
            await createAcknowledgmentTemplatesPo.clickOnSaveButton();
            await utilCommon.closePopUpMessage();
        });
        it('[DRDMV-10900,DRDMV-10924,DRDMV-10923]: Acknowledgment Template : Edit Acknowledgment Template UI validation', async () => {
            // DRDMV-10900
            await utilGrid.clearFilter();
            await consoleAcknowledgmentTemplatePo.searchAndOpenAcknowledgmentTemplate(templateName);
            expect(await editAcknowledgmentTemplatePo.isModuleNameDisabled()).toBeTruthy('Module Name is enabled');
            expect(await editAcknowledgmentTemplatePo.isCompanyDropDownDisabled()).toBeTruthy('Company drop down is enabled');
            await editAcknowledgmentTemplatePo.updateDescription(description2);
            await editAcknowledgmentTemplatePo.selectStatusDropDown('Active');
            expect(await editAcknowledgmentTemplatePo.isLocalizedMessageButtonDisplayed()).toBeTruthy('Localize message button is missing');
            await editAcknowledgmentTemplatePo.selectlocaleDropDown('English (United States)');
            let arr: string[] = ["Danish (Denmark)", "Dutch (Netherlands)", "English (United States)", "French (France)", "German (Germany)", "Italian (Italy)", "Portuguese (Brazil)", "Spanish (International Sort)", "Swedish (Sweden)"]
            expect(await editAcknowledgmentTemplatePo.isLocaleDropDownValueDisplayed(arr)).toBeTruthy('Values not displayed in locale drop down');

            await editAcknowledgmentTemplatePo.clickOnGridSearchIcon();
            await editAcknowledgmentTemplatePo.searchAndSelectGridRecord('body');
            await editAcknowledgmentTemplatePo.clickOnGridEditButton();
            await editAcknowledgmentTemplatePo.updateEditMessageTextBladeBody(body2);
            await editAcknowledgmentTemplatePo.clickOnEditMessageTextBladeSaveButton();
            await utilCommon.closePopUpMessage();
        });
        it('[DRDMV-10900,DRDMV-10924,DRDMV-10923]: Acknowledgment Template : Edit Acknowledgment Template UI validation', async () => {
            await editAcknowledgmentTemplatePo.searchAndSelectGridRecord('subject');
            await editAcknowledgmentTemplatePo.clickOnGridEditButton();
            await editAcknowledgmentTemplatePo.updateEditMessageTextBladeSubject(subject2);
            await editAcknowledgmentTemplatePo.clickOnEditMessageTextBladeSaveButton();
            await utilCommon.closePopUpMessage();
            await consoleAcknowledgmentTemplatePo.searchOnGridConsole('body');
            expect(await editAcknowledgmentTemplatePo.getSelectedGridRecordValue('Message')).toContain(body2, 'body not updated correctly');
            await consoleAcknowledgmentTemplatePo.searchOnGridConsole('subject');
            expect(await editAcknowledgmentTemplatePo.getSelectedGridRecordValue('Message')).toBe(subject2, 'subject not updated correctly');
            await editAcknowledgmentTemplatePo.clickOnSaveButton();
        });
        it('[DRDMV-10900,DRDMV-10924,DRDMV-10923]: Acknowledgment Template : Edit Acknowledgment Template UI validation', async () => {
            // DRDMV-10924
            await consoleAcknowledgmentTemplatePo.clearGridFilter();
            await consoleAcknowledgmentTemplatePo.clearGridSearchBox();
           await consoleAcknowledgmentTemplatePo.addColumnOnGrid(arr2);
            await consoleAcknowledgmentTemplatePo.addFilter('Template Name', templateName2, 'text');
            expect(await consoleAcknowledgmentTemplatePo.getSelectedGridRecordValue('Template Name')).toBe(templateName2, 'Filter Template Name is missing in column');
            await utilGrid.clearFilter();
            await consoleAcknowledgmentTemplatePo.addFilter('Label', label, 'text');
            expect(await consoleAcknowledgmentTemplatePo.getSelectedGridRecordValue('Label')).toBe(label, ' Filter Label is missing in column');
            await consoleAcknowledgmentTemplatePo.addFilter('Status', 'Active', 'checkbox');
            expect(await consoleAcknowledgmentTemplatePo.getSelectedGridRecordValue('Status')).toBe('Active', 'Filter Label is missing in column');
            await consoleAcknowledgmentTemplatePo.addFilter('Company', 'Petramco', 'text');
            expect(await consoleAcknowledgmentTemplatePo.getSelectedGridRecordValue('Company')).toBe('Petramco', 'Filter Company is missing in column');
        });
        it('[DRDMV-10900,DRDMV-10924,DRDMV-10923]: Acknowledgment Template : Edit Acknowledgment Template UI validation', async () => {
            await consoleAcknowledgmentTemplatePo.addFilter('Subject', subject2, 'text');
            expect(await consoleAcknowledgmentTemplatePo.getSelectedGridRecordValue('Subject')).toBe(subject2, 'Filter Subject is missing in column');
            await consoleAcknowledgmentTemplatePo.removeColumnOnGrid(arr2);
            await consoleAcknowledgmentTemplatePo.clearGridFilter();
            // DRDMV-10923
            await consoleAcknowledgmentTemplatePo.searchOnGridConsole(templateName2);
            expect(await consoleAcknowledgmentTemplatePo.getSelectedGridRecordValue('Template Name')).toBe(templateName2, 'Search Template Name is missing in column');
            await consoleAcknowledgmentTemplatePo.searchOnGridConsole(subject);
            expect(await consoleAcknowledgmentTemplatePo.getSelectedGridRecordValue('Subject')).toBe(subject, 'Search Subject is missing in column');
            await consoleAcknowledgmentTemplatePo.searchOnGridConsole('Petramco');
            expect(await consoleAcknowledgmentTemplatePo.getSelectedGridRecordValue('Company')).toBe('Petramco', 'Search Company is missing in column');
        });
    });

    //ptidke
    describe('[DRDMV-10902]: Acknowledgment Template: Acknowledgment Template creation with same name', async () => {
        let templateName4 = 'Private' + [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateName5 = 'Private' + [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let description = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let subject = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let body = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        it('[DRDMV-10902]: Acknowledgment Template: Acknowledgment Template creation with same name', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Acknowledgment Templates', 'Email Ack Template Console - Business Workflows');
            await consoleAcknowledgmentTemplatePo.clickOnAddAcknowlegeTemplateButton();
            await createAcknowledgmentTemplatesPo.setTemplateName(templateName4);
            await createAcknowledgmentTemplatesPo.selectCompanyDropDown('Petramco');
            await createAcknowledgmentTemplatesPo.selectStatusDropDown('Active');
            await createAcknowledgmentTemplatesPo.selectLabelDropDown(label);
            await createAcknowledgmentTemplatesPo.setDescription(description);
            await createAcknowledgmentTemplatesPo.setSubject(subject);
            await createAcknowledgmentTemplatesPo.setBody(body);
            await createAcknowledgmentTemplatesPo.clickOnSaveButton();
        });
        it('[DRDMV-10902]: Acknowledgment Template: Acknowledgment Template creation with same name', async () => {
            await consoleAcknowledgmentTemplatePo.clickOnAddAcknowlegeTemplateButton();
            await createAcknowledgmentTemplatesPo.setTemplateName(templateName4);
            await createAcknowledgmentTemplatesPo.selectCompanyDropDown('Petramco');
            await createAcknowledgmentTemplatesPo.selectStatusDropDown('Active');
            await createAcknowledgmentTemplatesPo.selectLabelDropDown(label);
            await createAcknowledgmentTemplatesPo.setDescription(description);
            await createAcknowledgmentTemplatesPo.setSubject(subject);
            await createAcknowledgmentTemplatesPo.setBody(body);
            await createAcknowledgmentTemplatesPo.clickOnSaveButton();

            expect(await utilCommon.isPopUpMessagePresent('ERROR (222108): Template Already exist with given name:' + templateName4)).toBeTruthy('Duplicate private template name error message is missing');
            await utilCommon.closePopUpMessage();
            await createAcknowledgmentTemplatesPo.clickOnCancelButton();
            await utilCommon.clickOnWarningOk();
        });
        it('[DRDMV-10902]: Acknowledgment Template: Acknowledgment Template creation with same name', async () => {
            await consoleAcknowledgmentTemplatePo.clickOnAddAcknowlegeTemplateButton();
            await createAcknowledgmentTemplatesPo.setTemplateName(templateName5);
            await createAcknowledgmentTemplatesPo.selectCompanyDropDown('- Global -');
            await createAcknowledgmentTemplatesPo.selectStatusDropDown('Active');
            await createAcknowledgmentTemplatesPo.selectLabelDropDown(label);
            await createAcknowledgmentTemplatesPo.setDescription(description);
            await createAcknowledgmentTemplatesPo.setSubject(subject);
            await createAcknowledgmentTemplatesPo.setBody(body);
            await createAcknowledgmentTemplatesPo.clickOnSaveButton();
        });
        it('[DRDMV-10902]: Acknowledgment Template: Acknowledgment Template creation with same name', async () => {
            await consoleAcknowledgmentTemplatePo.clickOnAddAcknowlegeTemplateButton();
            await createAcknowledgmentTemplatesPo.setTemplateName(templateName5);
            await createAcknowledgmentTemplatesPo.selectCompanyDropDown('- Global -');
            await createAcknowledgmentTemplatesPo.selectStatusDropDown('Active');
            await createAcknowledgmentTemplatesPo.selectLabelDropDown(label);
            await createAcknowledgmentTemplatesPo.setDescription(description);
            await createAcknowledgmentTemplatesPo.setSubject(subject);
            await createAcknowledgmentTemplatesPo.setBody(body);
            await createAcknowledgmentTemplatesPo.clickOnSaveButton();

            expect(await utilCommon.isPopUpMessagePresent('ERROR (222108): Template Already exist with given name:' + templateName5)).toBeTruthy('Duplicate private template name error message is missing');
            await utilCommon.closePopUpMessage();
            await createAcknowledgmentTemplatesPo.clickOnCancelButton();
            await utilCommon.clickOnWarningOk();
        });
    });
});
