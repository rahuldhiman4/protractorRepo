import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import attachDocumentBladePo from '../../pageobject/common/attach-document-blade.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import consoleEmailTemplatePo from '../../pageobject/settings/email/console-email-template.po';
import createEmailTemplatePo from '../../pageobject/settings/email/create-email-template.po';
import editEmailTemplatePo from '../../pageobject/settings/email/edit-email-template.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';


describe('EmailTemplate', () => {
    const emailTemplateData = require('../../data/ui/email/email.template.api.json');
    let label, menuItemDataFile = require('../../data/ui/ticketing/menuItem.ui.json');
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
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

    //kgaikwad
    describe('[DRDMV-10813,DRDMV-10796,DRDMV-10787,DRDMV-10804,DRDMV-10789]: Email Template : User Is Not able to Create Duplicate Email Template', async () => {
        let randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateName1 = 'TemplateName1' + randomStr;
        let templateName2 = 'TemplateName2' + randomStr;
        let description = 'Description' + randomStr;
        let subject = 'Subject' + randomStr;
        let body = 'Body' + randomStr;
        it('Create Duplicate Email Template1', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Templates', 'Email Template Console - Business Workflows');
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
        it('Create Duplicate Email Template2', async () => {
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
        it('Create Duplicate Email Template3', async () => {
            await consoleEmailTemplatePo.searchOnGridConsole(templateName1);
            expect(await consoleEmailTemplatePo.getSelectedGridRecordValue('Template Name')).toBe(templateName1, 'Template Name for Petramco compnay is missing')
            expect(await consoleEmailTemplatePo.getSelectedGridRecordValue('Subject')).toBe(subject, 'Subject for Petramco compnay is missing')
            expect(await consoleEmailTemplatePo.getSelectedGridRecordValue('Company')).toBe('Petramco', 'Petramco for Petramco compnay is missing')
            expect(await consoleEmailTemplatePo.getSelectedGridRecordValue('Status')).toBe('Active', 'Active for Petramco compnay is missing')
            await consoleEmailTemplatePo.searchOnGridConsole(templateName2);
            expect(await consoleEmailTemplatePo.getSelectedGridRecordValue('Template Name')).toBe(templateName2, 'Template Name for Petramco compnay is missing')
            expect(await consoleEmailTemplatePo.getSelectedGridRecordValue('Subject')).toBe(subject, 'Subject for Petramco compnay is missing')
            expect(await consoleEmailTemplatePo.getSelectedGridRecordValue('Company')).toBe('- Global -', 'Petramco for Petramco compnay is missing')
            expect(await consoleEmailTemplatePo.getSelectedGridRecordValue('Status')).toBe('Active', 'Active for Petramco compnay is missing')
        });
        it('Create Duplicate Email Template4', async () => {
            await consoleEmailTemplatePo.clickOnAddEmailTemplateButton();
            await createEmailTemplatePo.setTemplateName(templateName1);
            await createEmailTemplatePo.selectCompany('Petramco');
            await createEmailTemplatePo.selectStatusDropDown('Active');
            await createEmailTemplatePo.selectLabelDropDown(label);
            await createEmailTemplatePo.setDescription(description);
            await createEmailTemplatePo.setSubject(subject);
            await createEmailTemplatePo.setBody(body);
            await createEmailTemplatePo.clickOnSaveButton();
            expect(await utilCommon.isPopUpMessagePresent('ERROR (222108): Template Already exist with given name:' + templateName1)).toBeTruthy('Duplicate Template Error messsage missing.');
            await utilCommon.closePopUpMessage();
            await createEmailTemplatePo.clickOnCancelButton();
            await utilCommon.clickOnWarningOk();
        });
        it('[DRDMV-10813,DRDMV-10796,DRDMV-10787,DRDMV-10804,DRDMV-10789]: Email Template : User Is Not able to Create Duplicate Email Template', async () => {
            await consoleEmailTemplatePo.searchAndOpenEmailTemplate(templateName1);
            expect(await editEmailTemplatePo.isModuleNameDisabled()).toBeTruthy('Module Name is enabled');
            expect(await editEmailTemplatePo.isCompanyDropDownDisabled()).toBeTruthy('Company drop down is enabled');
            await editEmailTemplatePo.updateDescription(description);
            await editEmailTemplatePo.selectStatusDropDown('Active');
            await editEmailTemplatePo.selectLabelDropDown(label);
            await editEmailTemplatePo.selectlocaleDropDown('English (United States)');
            await editEmailTemplatePo.clickOnGridSearchIcon();
            await editEmailTemplatePo.searchOnGridConsole('body');
            expect(await editEmailTemplatePo.isLocalizedMessageButtonDisplayed()).toBeTruthy('Localize Message button is missing');
            expect(await editEmailTemplatePo.getSelectedGridRecordValue('Message Type')).toBe('body', 'Body is missing from Grid');
            await editEmailTemplatePo.searchOnGridConsole('subject');
            expect(await editEmailTemplatePo.getSelectedGridRecordValue('Message Type')).toBe('subject', 'subject is missing from Grid');
        });
    });

    //kgaikwad
    describe('[DRDMV-10801,DRDMV-10805,DRDMV-10786,DRDMV-11092,DRDMV-11093,DRDMV-11091,DRDMV-10798]: Email Template : User Is able to delete Email Template', async () => {
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

        it('User Is able to delete Email Template1', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Templates', 'Email Template Console - Business Workflows');
            await consoleEmailTemplatePo.clickOnAddEmailTemplateButton();
            await createEmailTemplatePo.setTemplateName(templateName1);
            await createEmailTemplatePo.selectCompany('Petramco');
            await createEmailTemplatePo.selectStatusDropDown('Active');
            await createEmailTemplatePo.selectLabelDropDown(label);
            await createEmailTemplatePo.setDescription(description1);
            await createEmailTemplatePo.setSubject(subject1);
            await createEmailTemplatePo.setBody(body1);
            await createEmailTemplatePo.clickOnSaveButton();
            await utilCommon.waitUntilSpinnerToHide();
            await consoleEmailTemplatePo.clearGridFilter();
        });
        it('User Is able to delete Email Template2', async () => {
            // DRDMV-10786
            await consoleEmailTemplatePo.addColumnOnGrid(arr1);
            expect(await consoleEmailTemplatePo.areGridColumnHeaderMatches(arr2)).toBeTruthy('Column header not matches');
            expect(consoleEmailTemplatePo.isGridColumnSorted('Label', 'descending')).toBeTruthy('Label column is not sorted correctly with descending order')
            // DRDMV-11092
            await consoleEmailTemplatePo.addFilter('Template Name', templateName1, 'text');
            expect(await consoleEmailTemplatePo.getSelectedGridRecordValue('Template Name')).toBe(templateName1, 'Filter Template Name is missing in column');
            await consoleEmailTemplatePo.clearGridFilter();
            await consoleEmailTemplatePo.addFilter('Label', label, 'text');
            expect(await consoleEmailTemplatePo.getSelectedGridRecordValue('Label')).toBe(label, ' Filter Label is missing in column');
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
        it('User Is able to delete Email Template3', async () => {
            await consoleEmailTemplatePo.clearGridFilter();
            await consoleEmailTemplatePo.searchOnGridConsole(templateName1);
            expect(await consoleEmailTemplatePo.getSelectedGridRecordValue('Template Name')).toBe(templateName1, 'Search Template Name is missing in column');
            await consoleEmailTemplatePo.searchOnGridConsole(subject1);
            expect(await consoleEmailTemplatePo.getSelectedGridRecordValue('Subject')).toBe(subject1, 'Search Subject is missing in column');
            await consoleEmailTemplatePo.searchOnGridConsole('Petramco');
            expect(await consoleEmailTemplatePo.getSelectedGridRecordValue('Company')).toBe('Petramco', 'Search Company is missing in column');

            // DRDMV-10805
            await consoleEmailTemplatePo.searchAndOpenEmailTemplate(templateName1);
            // DRDMV-10798
            expect(await editEmailTemplatePo.isSaveButtonEnabled()).toBeFalsy('Save button is enabled');
            await editEmailTemplatePo.updateTemplateName(templateName2);
            expect(await editEmailTemplatePo.isModuleNameDisabled()).toBeTruthy('Module Name is enabled');
            expect(await editEmailTemplatePo.isCompanyDropDownDisabled()).toBeTruthy('Company drop down is enabled');
            await editEmailTemplatePo.updateDescription(description2);
            await editEmailTemplatePo.selectStatusDropDown('Active');
            await editEmailTemplatePo.selectLabelDropDown(label);
            expect(await editEmailTemplatePo.isLocalizedMessageButtonDisplayed()).toBeTruthy('Localize Message button is missing');
            await editEmailTemplatePo.selectlocaleDropDown('English (United States)');
        });
        it('User Is able to delete Email Template4', async () => {
            await editEmailTemplatePo.clickOnGridSearchIcon();
            await editEmailTemplatePo.searchAndSelectGridRecord('body');
            await editEmailTemplatePo.clickOnGridEditButton();
            await editEmailTemplatePo.updateEditMessageTextBladeBody(body2);
            await editEmailTemplatePo.clickEditBodySaveButton();
            await utilCommon.closePopUpMessage();
            await editEmailTemplatePo.searchAndSelectGridRecord('subject');
            await editEmailTemplatePo.clickOnGridEditButton();
            await editEmailTemplatePo.updateEditMessageTextBladeSubject(subject2);
            await editEmailTemplatePo.clickEditSubjectSaveButton();
            await utilCommon.waitUntilSpinnerToHide();
            await consoleEmailTemplatePo.searchOnGridConsole('body');
            expect(await editEmailTemplatePo.getSelectedGridRecordValue('Message')).toBe('<body><p>' + body2 + '</p></body>', 'body not updated correctly');
            await consoleEmailTemplatePo.searchOnGridConsole('subject');
            expect(await editEmailTemplatePo.getSelectedGridRecordValue('Message')).toBe(subject2, 'subject not updated correctly');
        });
        it('[DRDMV-10801,DRDMV-10805,DRDMV-10786,DRDMV-11092,DRDMV-11093,DRDMV-11091,DRDMV-10798]: Email Template : User Is able to delete Email Template', async () => {
            // DRDMV-11093
            await editEmailTemplatePo.clickOnLocalizeMessageButton();
            await editEmailTemplatePo.setSubjectOfNewLocalizedEmailMessage(subject1);
            await editEmailTemplatePo.setBody(body1);
            await editEmailTemplatePo.clickLocalizeMessageSaveButton();
            expect(await utilCommon.isPopUpMessagePresent('ERROR (10000): Message already exists with given locale.')).toBeTruthy('Localize already exist error message missing');
            await utilCommon.closePopUpMessage();
            await editEmailTemplatePo.clickOnCancelButton();
            await utilCommon.waitUntilSpinnerToHide();
            await editEmailTemplatePo.clickOnSaveButton();
            await utilCommon.closePopUpMessage();
            // DRDMV-11091
            await consoleEmailTemplatePo.searchOnGridConsole(templateName2);
            expect(await consoleEmailTemplatePo.getSelectedGridRecordValue('Template Name')).toBe(templateName2, 'Search Template Name is missing in column');
            expect(await consoleEmailTemplatePo.getSelectedGridRecordValue('Subject')).toBe(subject2, 'Search Subject is missing in column');
            expect(await consoleEmailTemplatePo.getSelectedGridRecordValue('Status')).toBe('Active', 'Search Active2 is missing in column');
            expect(await consoleEmailTemplatePo.getSelectedGridRecordValue('Label')).toBe(label, 'Label is missing in column');
            await consoleEmailTemplatePo.removeColumnOnGrid(arr1);
            //DRDMV-10801
            await consoleEmailTemplatePo.searchAndSelectGridRecord(templateName2);
            await consoleEmailTemplatePo.clickOnDeleteButton();
            await utilCommon.waitUntilSpinnerToHide();
            expect(await consoleEmailTemplatePo.isGridRecordPresent(templateName2)).toBeFalsy('Public template name is preset on grid')
        });
    });

    //tzope
    describe('[DRDMV-21497,DRDMV-21498,DRDMV-21507]: Email Template : User Creates Email Template and Add/Delete Attachment and check error message', async () => {
        let filePath1 = 'e2e/data/ui/attachment/bwfJpg1.jpg';
        let filePath2 = 'e2e/data/ui/attachment/bwfJpg2.jpg';
        let publishDocData1, publishDocData2, emailTemplateName, randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            //step 1 login and goto doc lib and create two doc lib
            publishDocData1 = {
                docLibTitle: 'Public holiday list',
                company: 'Petramco',
                businessUnit: "United States Support",
                ownerGroup: "US Support 3"
            }
            publishDocData2 = {
                docLibTitle: 'Bonus Chart',
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
        it('[DRDMV-21497,DRDMV-21498,DRDMV-21507]: Email Template : User Creates Email Template and Add/Delete Attachment and check error message', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Templates', 'Email Template Console - Business Workflows');
            await consoleEmailTemplatePo.searchAndOpenEmailTemplate(emailTemplateName);
            await editEmailTemplatePo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(publishDocData1.docLibTitle);
            expect(await editEmailTemplatePo.isAttachedFileNameDisplayed('bwfJpg1.jpg')).toBeTruthy('Failed as bwfJpg1.jpg is not attached to Email Template');
            await editEmailTemplatePo.clickOnSaveButton();
            expect(await utilCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Attachment is not added in Email Template');
            //Add another Document lib to the Email Template with same name
            await consoleEmailTemplatePo.searchAndOpenEmailTemplate(emailTemplateName);
            await editEmailTemplatePo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(publishDocData1.docLibTitle);
            expect(await utilCommon.isPopUpMessagePresent('The document is already attached.')).toBeTruthy('No Error message seen for duplicate attachment');
            await editEmailTemplatePo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(publishDocData2.docLibTitle);
            expect(await editEmailTemplatePo.isAttachedFileNameDisplayed('bwfJpg2.jpg')).toBeTruthy('Failed as bwfJpg2.jpg is not attached to Email Template');
            await editEmailTemplatePo.clickOnSaveButton();
            expect(await utilCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Attachment is not added in Email Template');
            //Delete doc lib from Email Template
            await consoleEmailTemplatePo.searchAndOpenEmailTemplate(emailTemplateName);
            await editEmailTemplatePo.removeAttachedDocument(1);
            expect(await editEmailTemplatePo.isAttachedFileNameDisplayed('bwfJpg1.jpg')).toBeFalsy('Failed as bwfJpg1.jpg is not removed from Email Template');
            await editEmailTemplatePo.clickOnSaveButton();
            expect(await utilCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Attachment is not deleted from Email Template');
        });
    });
});
