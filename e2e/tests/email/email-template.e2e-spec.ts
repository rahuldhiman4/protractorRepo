import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import viewCasePo from '../../pageobject/case/view-case.po';
import attachDocumentBladePo from '../../pageobject/common/attach-document-blade.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import composeMailPo from '../../pageobject/email/compose-mail.po';
import selectEmailTemplateBladePo from '../../pageobject/email/select-email-template-blade.po';
import consoleEmailTemplatePo from '../../pageobject/settings/email/console-email-template.po';
import createEmailTemplatePo from '../../pageobject/settings/email/create-email-template.po';
import editEmailTemplatePo from '../../pageobject/settings/email/edit-email-template.po';
import { BWF_BASE_URL, BWF_PAGE_TITLES } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

describe('Email Template', () => {
    const emailTemplateData = require('../../data/ui/email/email.template.api.json');
    let label = "POSH";
    let label1 = "Benefits";
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //kgaikwad
    describe('[5165,5173,5177,5167,5176]: Email Template : User Is Not able to Create Duplicate Email Template', async () => {
        let randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateName1 = 'TemplateName1' + randomStr;
        let templateName2 = 'TemplateName2' + randomStr;
        let description = 'Description' + randomStr;
        let subject = 'Subject' + randomStr;
        let body = 'Body' + randomStr;
        it('[5165,5173,5177,5167,5176]: Create Duplicate Email Template1', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Templates', BWF_PAGE_TITLES.EMAIL.TEMPLATES);
            await consoleEmailTemplatePo.clickOnAddEmailTemplateButton();
            await createEmailTemplatePo.setTemplateName(templateName1);
            await createEmailTemplatePo.selectCompany('Petramco');
            await createEmailTemplatePo.selectStatusDropDown('Active');
            await createEmailTemplatePo.selectLabelDropDown(label);
            await createEmailTemplatePo.setDescription(description);
            await createEmailTemplatePo.setSubject(subject);
            await createEmailTemplatePo.setBody(body);
            await createEmailTemplatePo.clickOnSaveButton();
        });
        it('[5165,5173,5177,5167,5176]: Create Duplicate Email Template2', async () => {
            await consoleEmailTemplatePo.clickOnAddEmailTemplateButton();
            await createEmailTemplatePo.setTemplateName(templateName2);
            await createEmailTemplatePo.selectCompany('- Global -');
            await createEmailTemplatePo.selectStatusDropDown('Active');
            await createEmailTemplatePo.selectLabelDropDown(label);
            await createEmailTemplatePo.setDescription(description);
            await createEmailTemplatePo.setSubject(subject);
            await createEmailTemplatePo.setBody(body);
            await createEmailTemplatePo.clickOnSaveButton();
        });
        it('[5165,5173,5177,5167,5176]: Create Duplicate Email Template3', async () => {
            await consoleEmailTemplatePo.searchOnGridConsole(templateName1);
            expect(await consoleEmailTemplatePo.getSelectedGridRecordValue('Template Name')).toBe(templateName1, 'Template1 Name for Petramco company is missing')
            expect(await consoleEmailTemplatePo.getSelectedGridRecordValue('Subject')).toBe(subject, 'Subject1 for Petramco compnay is missing')
            expect(await consoleEmailTemplatePo.getSelectedGridRecordValue('Company')).toBe('Petramco', 'Petramco1 for Petramco compnay is missing')
            expect(await consoleEmailTemplatePo.getSelectedGridRecordValue('Status')).toBe('Active', 'Active for Petramco compnay is missing')
            await consoleEmailTemplatePo.searchOnGridConsole(templateName2);
            expect(await consoleEmailTemplatePo.getSelectedGridRecordValue('Template Name')).toBe(templateName2, 'Template2 Name for Petramco compnay is missing')
            expect(await consoleEmailTemplatePo.getSelectedGridRecordValue('Subject')).toBe(subject, 'Subject for Petramco compnay is missing')
            expect(await consoleEmailTemplatePo.getSelectedGridRecordValue('Company')).toBe('- Global -', 'Global compnay is missing')
            expect(await consoleEmailTemplatePo.getSelectedGridRecordValue('Status')).toBe('Active', 'Active1 for Petramco compnay is missing')
        });
        it('[5165,5173,5177,5167,5176]: Create Duplicate Email Template4', async () => {
            await consoleEmailTemplatePo.clickOnAddEmailTemplateButton();
            await createEmailTemplatePo.setTemplateName(templateName1);
            await createEmailTemplatePo.selectCompany('Petramco');
            await createEmailTemplatePo.selectStatusDropDown('Active');
            await createEmailTemplatePo.selectLabelDropDown(label);
            await createEmailTemplatePo.setDescription(description);
            await createEmailTemplatePo.setSubject(subject);
            await createEmailTemplatePo.setBody(body);
            await createEmailTemplatePo.clickOnSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Template Already exist with given name:' + templateName1)).toBeTruthy('Duplicate Template Error messsage missing.');
            await utilityCommon.closePopUpMessage();
            await createEmailTemplatePo.clickOnCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });
        it('[5165,5173,5177,5167,5176]: Email Template : User Is Not able to Create Duplicate Email Template', async () => {
            await consoleEmailTemplatePo.searchAndOpenEmailTemplate(templateName1);
            expect(await editEmailTemplatePo.isModuleNameDisabled()).toBeTruthy('Module Name is enabled');
            expect(await editEmailTemplatePo.isCompanyDropDownDisabled()).toBeTruthy('Company drop down is enabled');
            await editEmailTemplatePo.updateDescription(description);
            await editEmailTemplatePo.selectStatusDropDown('Active');
            await editEmailTemplatePo.selectLabelDropDown(label);
            await editEmailTemplatePo.selectlocaleDropDown('English (United States)');
            // await editEmailTemplatePo.clickOnGridSearchIcon();
            await editEmailTemplatePo.searchOnGridConsole('body');
            expect(await editEmailTemplatePo.isLocalizedMessageButtonDisplayed()).toBeTruthy('Localize Message button is missing');
            expect(await editEmailTemplatePo.getSelectedGridRecordValue('Message Type')).toBe('body', 'Body is missing from Grid');
            await editEmailTemplatePo.searchOnGridConsole('subject');
            expect(await editEmailTemplatePo.getSelectedGridRecordValue('Message Type')).toBe('subject', 'subject is missing from Grid');
        });
        it('[5165,5173,5177,5167,5176]: Verify if email templates are accessible to same LOB Case Manager', async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Templates', BWF_PAGE_TITLES.EMAIL.TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(templateName1)).toBeTruthy('Human Resources LOB email template is not visible to same LOB case manager');
            expect(await utilityGrid.isGridRecordPresent(templateName2)).toBeTruthy('Human Resources LOB email template is not visible to same LOB case manager');
        });
        it('[5165,5173,5177,5167,5176]: Verify if email templates are accessible to different LOB Case BA', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Templates', BWF_PAGE_TITLES.EMAIL.TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(templateName1)).toBeFalsy('Human Resources LOB email template is not visible to different LOB case BA');
            expect(await utilityGrid.isGridRecordPresent(templateName2)).toBeFalsy('Human Resources LOB email template is not visible to different LOB case BA');
        });
        it('[5165,5173,5177,5167,5176]: Verify if email templates are accessible to different LOB Case Manager', async () => {
            await navigationPage.signOut();
            await loginPage.login('frieda');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Templates', BWF_PAGE_TITLES.EMAIL.TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(templateName1)).toBeFalsy('Human Resources LOB email template is not visible to different LOB case manager');
            expect(await utilityGrid.isGridRecordPresent(templateName2)).toBeFalsy('Human Resources LOB email template is not visible to different LOB case manager');
        });
        it('[5165,5173,5177,5167,5176]: Verify if email templates are accessible to Case BA belonging to different company with same LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('gwixillian');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Templates', BWF_PAGE_TITLES.EMAIL.TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(templateName1)).toBeTruthy('Human Resources LOB email template is not visible to same LOB with different case BA');
            expect(await utilityGrid.isGridRecordPresent(templateName2)).toBeTruthy('Human Resources LOB email template is not visible to same LOB with different case BA');
        });
        it('[5165,5173,5177,5167,5176]: Verify if email templates are accessible to Case Manager user having access to multiple LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('qyuan');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Templates', BWF_PAGE_TITLES.EMAIL.TEMPLATES);
            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(templateName1)).toBeTruthy('Human Resources LOB email template is not visible to case manager with multiple LOB access');
            expect(await utilityGrid.isGridRecordPresent(templateName2)).toBeTruthy('Human Resources LOB email template is not visible to case manager with multiple LOB access');
            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await utilityGrid.isGridRecordPresent(templateName1)).toBeFalsy('Human Resources LOB email template is visible to case manager with multiple LOB access');
            expect(await utilityGrid.isGridRecordPresent(templateName2)).toBeFalsy('Human Resources LOB email template is visible to case manager with multiple LOB access');
        });
        it('[5165,5173,5177,5167,5176]: Verify if email templates are accessible to Case BA user having access to multiple LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Templates', BWF_PAGE_TITLES.EMAIL.TEMPLATES);
            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await utilityGrid.isGridRecordPresent(templateName1)).toBeFalsy('Human Resources LOB email template is visible to case BA with multiple LOB access');
            expect(await utilityGrid.isGridRecordPresent(templateName2)).toBeFalsy('Human Resources LOB email template is visible to case BA with multiple LOB access');
            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(templateName1)).toBeTruthy('Human Resources LOB email template is not visible to case BA with multiple LOB access');
            expect(await utilityGrid.isGridRecordPresent(templateName2)).toBeTruthy('Human Resources LOB email template is not visible to case BA with multiple LOB access');
            await consoleEmailTemplatePo.searchAndOpenEmailTemplate(templateName1);
            await editEmailTemplatePo.updateDescription(description);
            await editEmailTemplatePo.selectStatusDropDown('Active');
            await editEmailTemplatePo.clickOnSaveButton();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades(); // escape is working on these settings pages
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //kgaikwad
    describe('[5169,5166,5178,5096,5095,5097,5172]: Email Template : User Is able to delete Email Template', async () => {
        let randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateName1 = 'TemplateName1' + randomStr;
        let templateName2 = 'TemplateName2' + randomStr;
        let description1 = 'Description1' + randomStr;
        let description2 = 'Description2' + randomStr;
        let subject1 = 'Subject1' + randomStr;
        let subject2 = 'Subject2' + randomStr;
        let body1 = 'Body1' + randomStr;
        let body2 = 'Body2' + randomStr;
        let arr1: string[] = ["Label"];
        let arr2: string[] = ['Template Name', 'Subject', "Company", "Status", "Label"];

        it('[5169,5166,5178,5096,5095,5097,5172]: User Is able to delete Email Template1', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Templates', BWF_PAGE_TITLES.EMAIL.TEMPLATES);
            await consoleEmailTemplatePo.clickOnAddEmailTemplateButton();
            await createEmailTemplatePo.setTemplateName(templateName1);
            await createEmailTemplatePo.selectCompany('Petramco');
            await createEmailTemplatePo.selectStatusDropDown('Active');
            await createEmailTemplatePo.selectLabelDropDown(label1);
            await createEmailTemplatePo.setDescription(description1);
            await createEmailTemplatePo.setSubject(subject1);
            await createEmailTemplatePo.setBody(body1);
            await createEmailTemplatePo.clickOnSaveButton();

            await consoleEmailTemplatePo.clickOnAddEmailTemplateButton();
            await createEmailTemplatePo.setTemplateName(templateName2);
            await createEmailTemplatePo.selectCompany('- Global -');
            await createEmailTemplatePo.selectStatusDropDown('Active');
            await createEmailTemplatePo.selectLabelDropDown(label1);
            await createEmailTemplatePo.setDescription(description1);
            await createEmailTemplatePo.setSubject(subject1);
            await createEmailTemplatePo.setBody(body1);
            await createEmailTemplatePo.clickOnSaveButton();
            await consoleEmailTemplatePo.clearGridFilter();
        });
        it('[5169,5166,5178,5096,5095,5097,5172]: User Is able to delete Email Template2', async () => {
            // 5178
            await consoleEmailTemplatePo.addColumnOnGrid(arr1);
            expect(await consoleEmailTemplatePo.areGridColumnHeaderMatches(arr2)).toBeTruthy('Column header not matches');
            await utilityGrid.sortGridColumn('Subject', 'descending');
            await utilityGrid.sortGridColumn('Subject', 'ascending');
            await utilityGrid.sortGridColumn('Label', 'descending');
            await utilityGrid.sortGridColumn('Label', 'ascending');
            // this valition is commented becasue we need required modification in common method
            //expect(await consoleEmailTemplatePo.isGridColumnSorted('Label', 'descending')).toBeTruthy('Label column is not sorted correctly with descending order');

            // 5096
            await consoleEmailTemplatePo.addFilter('Template Name', templateName1, 'text');
            expect(await consoleEmailTemplatePo.getSelectedGridRecordValue('Template Name')).toBe(templateName1, 'Filter Template Name is missing in column');
            await consoleEmailTemplatePo.clearGridFilter();
            await consoleEmailTemplatePo.addFilter('Label', label1, 'text');
            expect(await consoleEmailTemplatePo.getSelectedGridRecordValue('Label')).toBe(label1, ' Filter Label is missing in column');
            await consoleEmailTemplatePo.clearGridFilter();
            await consoleEmailTemplatePo.addFilter('Status', 'Active', 'checkbox');
            expect(await consoleEmailTemplatePo.getSelectedGridRecordValue('Status')).toBe('Active', 'Filter Label is missing in column');
            await consoleEmailTemplatePo.clearGridFilter();
            await consoleEmailTemplatePo.addFilter('Company', 'Petramco', 'text');
            expect(await consoleEmailTemplatePo.getSelectedGridRecordValue('Company')).toBe('Petramco', 'Filter Company is missing in column');
            await consoleEmailTemplatePo.clearGridFilter();
            await consoleEmailTemplatePo.addFilter('Subject', subject1, 'text');
            expect(await consoleEmailTemplatePo.getSelectedGridRecordValue('Subject')).toBe(subject1, 'Filter Subject is missing in column');
        });
        it('[5169,5166,5178,5096,5095,5097,5172]: User Is able to delete Email Template3', async () => {
            await consoleEmailTemplatePo.clearGridFilter();
            await consoleEmailTemplatePo.searchOnGridConsole(templateName1);
            expect(await consoleEmailTemplatePo.getSelectedGridRecordValue('Template Name')).toBe(templateName1, 'Search Template Name is missing in column');
            await consoleEmailTemplatePo.searchOnGridConsole(subject1);
            expect(await consoleEmailTemplatePo.getSelectedGridRecordValue('Subject')).toBe(subject1, 'Search Subject is missing in column');
            await consoleEmailTemplatePo.searchOnGridConsole('Petramco');
            expect(await consoleEmailTemplatePo.getSelectedGridRecordValue('Company')).toBe('Petramco', 'Search Company is missing in column');
            // 5166
            await consoleEmailTemplatePo.searchAndOpenEmailTemplate(templateName1);
            // 5172
            expect(await editEmailTemplatePo.isSaveButtonEnabled()).toBeFalsy('Save button is enabled');
            expect(await editEmailTemplatePo.isModuleNameDisabled()).toBeTruthy('Module Name is enabled');
            expect(await editEmailTemplatePo.isCompanyDropDownDisabled()).toBeTruthy('Company drop down is enabled');
            await editEmailTemplatePo.updateDescription(description2);
            await editEmailTemplatePo.selectStatusDropDown('Active');
            await editEmailTemplatePo.selectLabelDropDown(label1);
            expect(await editEmailTemplatePo.isLocalizedMessageButtonDisplayed()).toBeTruthy('Localize Message button is missing');
            await editEmailTemplatePo.selectlocaleDropDown('English (United States)');
        });
        it('[5169,5166,5178,5096,5095,5097,5172]: User Is able to delete Email Template4', async () => {
            await editEmailTemplatePo.clickOnGridSearchIcon();
            await editEmailTemplatePo.searchAndSelectGridRecord('body');
            await editEmailTemplatePo.clickOnGridEditButton();
            await editEmailTemplatePo.updateEditMessageTextBladeBody(body2);
            await editEmailTemplatePo.clickEditBodySaveButton();
            await utilityCommon.closePopUpMessage();
            await editEmailTemplatePo.searchAndSelectGridRecord('subject');
            await editEmailTemplatePo.clickOnGridEditButton();
            await editEmailTemplatePo.updateEditMessageTextBladeSubject(subject2);
            await editEmailTemplatePo.clickEditSubjectSaveButton();
            await editEmailTemplatePo.searchOnGridConsole('body');
            expect(await editEmailTemplatePo.getSelectedGridRecordValue('Message')).toContain(body2, 'body not updated correctly');
            await editEmailTemplatePo.searchOnGridConsole('subject');
            expect(await editEmailTemplatePo.getSelectedGridRecordValue('Message')).toBe(subject2, 'subject not updated correctly');
        });
        it('[5169,5166,5178,5096,5095,5097,5172]: Email Template : User Is able to delete Email Template', async () => {
            // 5095
            await editEmailTemplatePo.clickOnLocalizeMessageButton();
            await editEmailTemplatePo.setSubjectOfNewLocalizedEmailMessage(subject1);
            await editEmailTemplatePo.setBody(body1);
            await editEmailTemplatePo.clickLocalizeMessageSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Message already exists with given locale.')).toBeTruthy('Localize already exist error message missing');
            await utilityCommon.closePopUpMessage();
            await editEmailTemplatePo.clickOnCancelButton();
            await editEmailTemplatePo.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
            // 5097
            await consoleEmailTemplatePo.searchOnGridConsole(templateName1);
            expect(await consoleEmailTemplatePo.getSelectedGridRecordValue('Template Name')).toBe(templateName1, 'Search Template Name is missing in column');
            expect(await consoleEmailTemplatePo.getSelectedGridRecordValue('Subject')).toBe(subject2, 'Search Subject is missing in column');
            expect(await consoleEmailTemplatePo.getSelectedGridRecordValue('Status')).toBe('Active', 'Search Active2 is missing in column');
            expect(await consoleEmailTemplatePo.getSelectedGridRecordValue('Label')).toBe(label1, 'Label is missing in column');
            await consoleEmailTemplatePo.removeColumnOnGrid(arr1);
            //5169
            await consoleEmailTemplatePo.searchAndSelectGridRecord(templateName1);
            await consoleEmailTemplatePo.clickOnDeleteButton();
            expect(await consoleEmailTemplatePo.isGridRecordPresent(templateName1)).toBeFalsy('Public template name is preset on grid')

            //create email template
            await consoleEmailTemplatePo.clickOnAddEmailTemplateButton();
            await createEmailTemplatePo.setTemplateName(templateName1);
            await createEmailTemplatePo.selectCompany('Petramco');
            await createEmailTemplatePo.selectStatusDropDown('Active');
            await createEmailTemplatePo.selectLabelDropDown(label1);
            await createEmailTemplatePo.setDescription(description1);
            await createEmailTemplatePo.setSubject(subject1);
            await createEmailTemplatePo.setBody(body1);
            await createEmailTemplatePo.clickOnSaveButton();
        });
        it('[5169,5166,5178,5096,5095,5097,5172]: Verify if email templates are accessible to same LOB Case Manager', async () => {
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Templates', BWF_PAGE_TITLES.EMAIL.TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(templateName1)).toBeTruthy('Human Resources LOB email template is not visible to same LOB case manager');
            expect(await utilityGrid.isGridRecordPresent(templateName2)).toBeTruthy('Human Resources LOB email template is not visible to same LOB case manager');
        });
        it('[5169,5166,5178,5096,5095,5097,5172]: Verify if email templates are accessible to different LOB Case BA', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Templates', BWF_PAGE_TITLES.EMAIL.TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(templateName1)).toBeFalsy('Human Resources LOB email template is not visible to different LOB case BA');
            expect(await utilityGrid.isGridRecordPresent(templateName2)).toBeFalsy('Human Resources LOB email template is not visible to different LOB case BA');
        });
        it('[5169,5166,5178,5096,5095,5097,5172]: Verify if email templates are accessible to different LOB Case Manager', async () => {
            await navigationPage.signOut();
            await loginPage.login('frieda');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Templates', BWF_PAGE_TITLES.EMAIL.TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(templateName1)).toBeFalsy('Human Resources LOB email template is not visible to different LOB case manager');
            expect(await utilityGrid.isGridRecordPresent(templateName2)).toBeFalsy('Human Resources LOB email template is not visible to different LOB case manager');
        });
        it('[5169,5166,5178,5096,5095,5097,5172]: Verify if email templates are accessible to Case BA belonging to different company with same LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('gwixillian');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Templates', BWF_PAGE_TITLES.EMAIL.TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(templateName1)).toBeTruthy('Human Resources LOB email template is not visible to same LOB with different case BA');
            expect(await utilityGrid.isGridRecordPresent(templateName2)).toBeTruthy('Human Resources LOB email template is not visible to same LOB with different case BA');
        });
        it('[5169,5166,5178,5096,5095,5097,5172]: Verify if email templates are accessible to Case Manager user having access to multiple LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('qyuan');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Templates', BWF_PAGE_TITLES.EMAIL.TEMPLATES);
            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(templateName1)).toBeTruthy('Human Resources LOB email template is not visible to case manager with multiple LOB access');
            expect(await utilityGrid.isGridRecordPresent(templateName2)).toBeTruthy('Human Resources LOB email template is not visible to case manager with multiple LOB access');
            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await utilityGrid.isGridRecordPresent(templateName1)).toBeFalsy('Human Resources LOB email template is visible to case manager with multiple LOB access');
            expect(await utilityGrid.isGridRecordPresent(templateName2)).toBeFalsy('Human Resources LOB email template is visible to case manager with multiple LOB access');
        });
        it('[5169,5166,5178,5096,5095,5097,5172]: Verify if email templates are accessible to Case BA user having access to multiple LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Templates', BWF_PAGE_TITLES.EMAIL.TEMPLATES);
            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await utilityGrid.isGridRecordPresent(templateName1)).toBeFalsy('Human Resources LOB email template is visible to case BA with multiple LOB access');
            expect(await utilityGrid.isGridRecordPresent(templateName2)).toBeFalsy('Human Resources LOB email template is visible to case BA with multiple LOB access');

            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(templateName1)).toBeTruthy('Human Resources LOB email template is not visible to case BA with multiple LOB access');
            expect(await utilityGrid.isGridRecordPresent(templateName2)).toBeTruthy('Human Resources LOB email template is not visible to case BA with multiple LOB access');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades(); // escape is working on these settings pages
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //tzope
    describe('[3602,3601,3595]: Email Template : User Creates Email Template and Add/Delete Attachment and check error message', async () => {
        let filePath1 = 'e2e/data/ui/attachment/bwfJpg1.jpg';
        let filePath2 = 'e2e/data/ui/attachment/bwfJpg2.jpg';
        let publishDocData1, publishDocData2, emailTemplateName, randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            //step 1 login and goto doc lib and create two doc lib
            publishDocData1 = {
                docLibTitle: 'Public holiday Doc ' + randomStr,
                company: 'Petramco',
                businessUnit: "United States Support",
                ownerGroup: "US Support 3"
            }
            publishDocData2 = {
                docLibTitle: 'Bonus Chart Doc ' + randomStr,
                company: 'Petramco',
                businessUnit: "United States Support",
                ownerGroup: "US Support 3"
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(publishDocData1.docLibTitle);
            await apiHelper.deleteDocumentLibrary(publishDocData2.docLibTitle);
            await apiHelper.apiLogin('qkatawazi');
            let docLib1 = await apiHelper.createDocumentLibrary(publishDocData1, filePath1);
            await apiHelper.publishDocumentLibrary(docLib1);
            let docLib2 = await apiHelper.createDocumentLibrary(publishDocData2, filePath2);
            await apiHelper.publishDocumentLibrary(docLib2);
            //step 2 add email template using API
            emailTemplateName = emailTemplateData['emailTemplateWithAttachment'].TemplateName = await emailTemplateData['emailTemplateWithAttachment'].TemplateName + randomStr;
            await apiHelper.createEmailTemplate(emailTemplateData['emailTemplateWithAttachment']);
        });
        it('[3602,3601,3595]: Email Template : User Creates Email Template and Add/Delete Attachment and check error message', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Templates', BWF_PAGE_TITLES.EMAIL.TEMPLATES);
            await consoleEmailTemplatePo.searchAndOpenEmailTemplate(emailTemplateName);
            await editEmailTemplatePo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(publishDocData1.docLibTitle);
            expect(await editEmailTemplatePo.isAttachedFileNameDisplayed('bwfJpg1.jpg')).toBeTruthy('Failed as bwfJpg1.jpg is not attached to Email Template');
            await editEmailTemplatePo.clickOnSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Attachment is not added in Email Template');
            //Add another Document lib to the Email Template with same name
            await consoleEmailTemplatePo.searchAndOpenEmailTemplate(emailTemplateName);
            await editEmailTemplatePo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(publishDocData1.docLibTitle);
            expect(await utilityCommon.isPopUpMessagePresent('The document is already attached.')).toBeTruthy('No Error message seen for duplicate attachment');
            await editEmailTemplatePo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(publishDocData2.docLibTitle);
            expect(await editEmailTemplatePo.isAttachedFileNameDisplayed('bwfJpg2.jpg')).toBeTruthy('Failed as bwfJpg2.jpg is not attached to Email Template');
            await editEmailTemplatePo.clickOnSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Attachment is not added in Email Template');
            //Delete doc lib from Email Template
            await consoleEmailTemplatePo.searchAndOpenEmailTemplate(emailTemplateName);
            await editEmailTemplatePo.removeAttachedDocument(1);
            expect(await editEmailTemplatePo.isAttachedFileNameDisplayed('bwfJpg1.jpg')).toBeFalsy('Failed as bwfJpg1.jpg is not removed from Email Template');
            await editEmailTemplatePo.clickOnSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Attachment is not deleted from Email Template');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
        });
    });

    //ankagraw
    describe('[5171,5170]: Email Template:if user goes away from both edit and create view warning should be appeared', async () => {
        let emailTemplateName, randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            emailTemplateName = emailTemplateData['emailTemplateWithMandatoryField'].TemplateName = await emailTemplateData['emailTemplateWithMandatoryField'].TemplateName + randomStr;
            await apiHelper.createEmailTemplate(emailTemplateData['emailTemplateWithMandatoryField']);
        });
        it('[5171,5170]: Email Template:if user goes away from both edit and create view warning should be appeared', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Templates', BWF_PAGE_TITLES.EMAIL.TEMPLATES);
            await consoleEmailTemplatePo.clickOnAddEmailTemplateButton();
            expect(await createEmailTemplatePo.isTemplateRequiredTextPresent()).toBeTruthy('Template Name is not tagged as required');
            expect(await createEmailTemplatePo.isCompanyRequiredTextPresent()).toBeTruthy('Company Name is not tagged as required');
            expect(await createEmailTemplatePo.islineOfBusinessRequiredTextPresent()).toBeTruthy('LOB is not tagged as required');
            expect(await createEmailTemplatePo.isStatusRequiredTextPresent()).toBeTruthy('Status is not tagged as required');
            expect(await createEmailTemplatePo.isDescriptionRequiredTextPresent()).toBeTruthy('Description is not tagged as required');
            expect(await createEmailTemplatePo.isSubjectRequiredTextPresent()).toBeTruthy('Subject is not tagged as required');
            await createEmailTemplatePo.setTemplateName("templateName1");
            await createEmailTemplatePo.clickOnCancelButton();
            expect(await utilityCommon.getDialoguePopupMessage()).toBe('You have unsaved data. Do you want to continue without saving?');
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');;
            await consoleEmailTemplatePo.searchAndOpenEmailTemplate(emailTemplateName);
            await editEmailTemplatePo.updateDescription("test");
            await editEmailTemplatePo.clickOnCancelButton();
            expect(await utilityCommon.getDialoguePopupMessage()).toBe('You have unsaved data. Do you want to continue without saving?');
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });
        it('[5171,5170]: create same name record in same LOB', async () => {
            //create same name record in same LOB
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Templates', BWF_PAGE_TITLES.EMAIL.TEMPLATES);
            await utilityGrid.selectLineOfBusiness('Human Resource');
            await consoleEmailTemplatePo.clickOnAddEmailTemplateButton();
            await createEmailTemplatePo.setTemplateName(emailTemplateName);
            await createEmailTemplatePo.selectCompany("Petramco");
            await createEmailTemplatePo.setDescription("emailTemplateName");
            await createEmailTemplatePo.setSubject("emailTemplateName");
            await createEmailTemplatePo.clickOnSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent(`Template Already exist with given name:${emailTemplateName}`)).toBeTruthy("Error message absent");
            // expect(await utilityCommon.isPopUpMessagePresent(`Template Already exist with given name:${emailTemplateName}`)).toBeTruthy("Error message absent");
            // await utilityCommon.closePopUpMessage();
            await createEmailTemplatePo.clickOnCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            await utilityCommon.closePopUpMessage();
        });
        it('[5171,5170]: create same name record in different LOB', async () => {
            //create same name record in different LOB
            await utilityGrid.selectLineOfBusiness('Facilities');
            await consoleEmailTemplatePo.clickOnAddEmailTemplateButton();
            await createEmailTemplatePo.setTemplateName(emailTemplateName);
            await createEmailTemplatePo.selectCompany("Petramco");
            await createEmailTemplatePo.setDescription("email desc");
            await createEmailTemplatePo.setSubject("email subject");
            // verify LOB is there
            expect(await createEmailTemplatePo.getLobValue()).toBe("Facilities");
            await createEmailTemplatePo.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
            //    expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy("Success message absent");
            // open the record and verify LOB is on edit screen
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Templates', BWF_PAGE_TITLES.EMAIL.TEMPLATES);
            await consoleEmailTemplatePo.searchAndOpenEmailTemplate(emailTemplateName);
            expect(await editEmailTemplatePo.getLobValue()).toBe("Facilities");
            await editEmailTemplatePo.clickOnCancelButton();
            await utilityGrid.selectLineOfBusiness('Human Resource');
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //ankagraw
    describe('[5291]: Active Email Template list in Grid', async () => {
        let randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseData, newCase, emailTemplateNamePsilon, emailTemplateNameDraft, emailTemplateName;
        beforeAll(async () => {
            caseData = {
                "Requester": "qtao",
                "Summary": "Test case for 3600RandVal" + randomStr,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
            }
            await apiHelper.apiLogin('qkatawazi');
            newCase = await apiHelper.createCase(caseData);
            //create an email template
            emailTemplateName = await emailTemplateData['emailTemplateToComposeEmail'].TemplateName + randomStr;
            emailTemplateData['emailTemplateToComposeEmail'].TemplateName = emailTemplateName;
            await apiHelper.createEmailTemplate(emailTemplateData['emailTemplateToComposeEmail']);
            emailTemplateNameDraft = await emailTemplateData['emailTemplateDraft'].TemplateName + randomStr;
            emailTemplateData['emailTemplateDraft'].TemplateName = emailTemplateNameDraft;
            await apiHelper.createEmailTemplate(emailTemplateData['emailTemplateDraft']);
            await apiHelper.apiLogin('gwixillian');
            emailTemplateNamePsilon = await emailTemplateData['emailTemplatePsilon'].TemplateName + randomStr;
            emailTemplateData['emailTemplatePsilon'].TemplateName = emailTemplateNamePsilon;
            await apiHelper.createEmailTemplate(emailTemplateData['emailTemplatePsilon']);
        });
        it('[5291]: Active Email Temlate list in Grid', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(newCase.displayId)
            await viewCasePo.clickOnEmailLink();
            await composeMailPo.clickOnSelectEmailTemplateLink();
            expect(await selectEmailTemplateBladePo.getGridRecordValue(emailTemplateName)).toBeTruthy("emailTemplateName");
        });
        it('[5291]: Active Email Temlate list in Grid', async () => {
            expect(await selectEmailTemplateBladePo.isRecordPresent(emailTemplateNameDraft)).toBeFalsy();
            expect(await selectEmailTemplateBladePo.isRecordPresent(emailTemplateNamePsilon)).toBeFalsy();
        });

        afterAll(async () => {
            await selectEmailTemplateBladePo.clickOnCancelButton();
            await composeMailPo.clickOnDiscardButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });
    });
});