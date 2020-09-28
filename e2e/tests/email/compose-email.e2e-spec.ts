import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import caseConsole from '../../pageobject/case/case-console.po';
import quickCase from "../../pageobject/case/quick-case.po";
import viewCasePo from '../../pageobject/case/view-case.po';
import addFieldsPopPo from '../../pageobject/common/add-fields-pop.po';
import attachDocumentBladePo from '../../pageobject/common/attach-document-blade.po';
import linkPropertiesPo from '../../pageobject/common/ck-editor/link-properties.po';
import tablePropertiesPo from '../../pageobject/common/ck-editor/table-properties.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import updateStatusBladePo from '../../pageobject/common/update.status.blade.po';
import composeMail from '../../pageobject/email/compose-mail.po';
import selectEmailTemplateBladePo from '../../pageobject/email/select-email-template-blade.po';
import imagePropertiesPo from '../../pageobject/settings/common/image-properties.po';
import consoleEmailTemplatePo from '../../pageobject/settings/email/console-email-template.po';
import createEmailTemplatePo from '../../pageobject/settings/email/create-email-template.po';
import editEmailTemplatePo from '../../pageobject/settings/email/edit-email-template.po';
import consoleNotificationTemplatePo from '../../pageobject/settings/notification-config/console-notification-template.po';
import copyNotificationTemplatePo from '../../pageobject/settings/notification-config/copy-notification-template.po';
import editMessageTextBladePo from '../../pageobject/settings/notification-config/edit-Message-Text-Blade.po';
import editNotificationTemplatePo from '../../pageobject/settings/notification-config/edit-notification-template.po';
import activityTabPo from '../../pageobject/social/activity-tab.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from "../../utils/util.common";
import utilGrid from '../../utils/util.grid';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';
let emailTemplateData = require('../../data/ui/email/email.template.api.json');
const manageNotificationTempNavigation = 'Notification Configuration--Manage Templates';
const notifTempGridPageTitle = 'Manage Notification Template - Business Workflows';
let uploadURL = "https://www.google.com/homepage/images/hero-dhp-chrome-win.jpg?mmfb=90bec8294f441f5c41987596ca1b8cff";

describe("Compose Email", () => {
    let imageUrlFieldIndex = 0;
    let imageWidthFieldIndex = 2;
    let tableRowFieldIndex = 0;
    let tableColumnFieldIndex = 1;
    let tableWidthFieldIndex = 3;
    let tableHeightFieldIndex = 4;
    let linkDisplayTextFieldIndex = 0;
    let linkUrlFieldIndex = 1;
    let linkTargetDropDownIndex = 4;
    let cellCaption: number = 7;
    let cellSummary: number = 8;

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login("qtao");
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteAllEmailConfiguration();
        await apiHelper.createEmailConfiguration();
    });

    afterAll(async () => {
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteAllEmailConfiguration();
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    describe('[DRDMV-20368,DRDMV-20371]: Verify Able to insert table,hyperlink, images and Copy paste images in Notification template and notifications received by user with these contents', async () => {
        let randomString = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let newCase;
        beforeAll(async () => {
            let caseData = {
                "Requester": "qkatawazi",
                "Summary": "Test case for DRDMV-20368 RandVal" + randomString,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
            }
            await apiHelper.apiLogin('fritz');
            newCase = await apiHelper.createCase(caseData);
        });
        it('[DRDMV-20368,DRDMV-20371]: Verify Able to insert table,hyperlink, images and Copy paste images in Notification template and notifications received by user with these contents', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, notifTempGridPageTitle);
            await utilGrid.clearFilter();
            await utilGrid.searchAndSelectGridRecord('Case Status Change');
            await consoleNotificationTemplatePo.clickCopyTemplate();
            await copyNotificationTemplatePo.setCompanyValue('Petramco');
            await copyNotificationTemplatePo.clickOnCreateCopyButton();
            await editNotificationTemplatePo.selectDefaultNotificationMethod('Email');
            await editNotificationTemplatePo.clickOnEmailTab();
            await editNotificationTemplatePo.selectCheckBoxOfBody();
            await editNotificationTemplatePo.clickOnEditButtonOfEmailTab();
            await editMessageTextBladePo.setMessageBody('new');
            await editMessageTextBladePo.clickOnImageIcon();
            await imagePropertiesPo.addImageOnEmail('Upload', '../../../data/ui/attachment/articleStatus.png', imageWidthFieldIndex, imageUrlFieldIndex);
            await editMessageTextBladePo.setMessageBody('this is link ');
            await editMessageTextBladePo.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('Google', linkDisplayTextFieldIndex);
            await linkPropertiesPo.setValueOfLinkProperties('www.google.com', linkUrlFieldIndex);
            await linkPropertiesPo.clickOnTargetTab();
            await linkPropertiesPo.selectDropDown('_blank', linkTargetDropDownIndex);
            await linkPropertiesPo.clickOnOkBtn();
            await editMessageTextBladePo.setMessageBody('this is table');
            await editMessageTextBladePo.clickOnTableIcon();
            await tablePropertiesPo.setValueOfTableProperties('4', tableRowFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('3', tableColumnFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('500', tableWidthFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('200', tableHeightFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('new' + randomString, cellCaption);
            await tablePropertiesPo.setValueOfTableProperties('NotiFicationT', cellSummary);
            await tablePropertiesPo.clickOnOkButton();
            //bold
            await createEmailTemplatePo.clickInTableRowOfEmailTemplate(1, 1, 'NotiFicationT');
            await editMessageTextBladePo.clickOnBoldIcon();
            await createEmailTemplatePo.setDataInEmailTemplateTable(1, 1, 'FirstBold', 'NotiFicationT');
            //italic
            await createEmailTemplatePo.clickInTableRowOfEmailTemplate(1, 2, 'NotiFicationT');
            await editMessageTextBladePo.clickOnItalicIcon();
            await createEmailTemplatePo.setDataInEmailTemplateTable(1, 2, 'FirstItalic', 'NotiFicationT');
            //underline
            await createEmailTemplatePo.clickInTableRowOfEmailTemplate(1, 3, 'NotiFicationT');
            await editMessageTextBladePo.clickOnUnderLineIcon();
            await createEmailTemplatePo.setDataInEmailTemplateTable(1, 3, 'FirstUnderLine', 'NotiFicationT');
            //left Align
            await createEmailTemplatePo.clickInTableRowOfEmailTemplate(2, 1, 'NotiFicationT');
            await editMessageTextBladePo.clickOnLeftAlignIcon();
            await createEmailTemplatePo.setDataInEmailTemplateTable(2, 1, 'FirstLeftAlign', 'NotiFicationT');
            //Right Align
            await createEmailTemplatePo.clickInTableRowOfEmailTemplate(2, 2, 'NotiFicationT');
            await editMessageTextBladePo.clickOnRightAlignIcon();
            await createEmailTemplatePo.setDataInEmailTemplateTable(2, 2, 'FirstRightAlign', 'NotiFicationT');
            //Center Align
            await createEmailTemplatePo.clickInTableRowOfEmailTemplate(2, 3, 'NotiFicationT');
            await editMessageTextBladePo.clickOnCenterAlignIcon();
            await createEmailTemplatePo.setDataInEmailTemplateTable(2, 3, 'FirstCenterAlign', 'NotiFicationT');
            //set color
            await createEmailTemplatePo.clickInTableRowOfEmailTemplate(3, 1, 'NotiFicationT');
            await editMessageTextBladePo.selectColor('Bright Blue');
            await createEmailTemplatePo.setDataInEmailTemplateTable(3, 1, 'SettingColor', 'NotiFicationT');
            //set font
            await createEmailTemplatePo.clickInTableRowOfEmailTemplate(3, 2, 'NotiFicationT');
            await editMessageTextBladePo.clickOnFontSizeIcon();
            await editMessageTextBladePo.selectFontTypeOrSize('18');
            await createEmailTemplatePo.setDataInEmailTemplateTable(3, 2, 'SettingFontSize', 'NotiFicationT');
            await editMessageTextBladePo.setMessageBody('');
            await editMessageTextBladePo.clickOnSaveButton();
            await editNotificationTemplatePo.clickOnCancelButton();
        });
        it('[DRDMV-20368,DRDMV-20371]: Verify Able to insert table,hyperlink, images and Copy paste images in Notification template and notifications received by user with these contents', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await caseConsole.searchAndOpenCase(newCase.displayId);
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            await utilityCommon.closePopUpMessage();
            let subject = `Fritz Schulz changed the status of ${newCase.displayId} to In Progress`;
            console.log("Subject of the email: ", subject);
            await browser.sleep(5000); // hardwait to appear email message in "AR System Email Messages"
            await apiHelper.apiLogin('tadmin');
            let body = await apiHelper.getHTMLBodyOfEmail(subject);
            console.log('body:', body);
            //color span
            await expect(body.includes('<td><span style="color:#3498db;">SettingColor</span></td>')).toBeTruthy('Color is not available');
            //table width size attaribute
            await expect(body.includes('<table summary="NotiFicationT" border="1" cellspacing="1" cellpadding="1" style="height:200px;width:500px;">')).toBeTruthy('Table properties not displayed');
            //image
            await expect(body.includes('<a target="_blank">Google</a>')).toBeTruthy('link tag is not displaying');
            //font 
            await expect(body.includes('<td><span style="font-size:18px;">SettingFontSize</span></td>')).toBeTruthy('Font Size is not present');
            //right allign
            await expect(body.includes('<td style="text-align: right;">FirstRightAlign</td>')).toBeTruthy('Right Alignment is not present');
            //center align
            await expect(body.includes('<td style="text-align: center;">FirstCenterAlign</td>')).toBeTruthy('Center Alignment is not present');
            //italic
            await expect(body.includes('<td><em>FirstItalic</em></td>')).toBeTruthy('Italic Font is not present');
            //underline
            await expect(body.includes('<td><u>FirstUnderLine</u></td>')).toBeTruthy('Underline Font is not present');
        });
        afterAll(async () => {
            await apiHelper.apiLogin('fritz');
            await apiHelper.deleteEmailOrNotificationTemplate('Case Status Change', 'Petramco');
            await navigationPage.signOut();
            await loginPage.login("qtao");
        });
    });

    //kgaikwad
    describe('[DRDMV-8377]: UI validation Email Option via Create New Case', async () => {
        let randomString = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let newCase;
        beforeAll(async () => {
            let caseData = {
                "Requester": "qkatawazi",
                "Summary": "Test case for DRDMV-8377RandVal" + randomString,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
            }
            await apiHelper.apiLogin('qtao');
            newCase = await apiHelper.createCase(caseData);
        });
        it('[DRDMV-8377]: UI validation Email Option via Create New Case', async () => {
            await navigationPage.gotoCaseConsole();
            let caseId: string = newCase.displayId;
            await caseConsole.searchAndOpenCase(caseId);
            expect(await viewCasePo.isEmailLinkPresent()).toBeTruthy('Email Link is missing');
            await viewCasePo.clickOnEmailLink();
            expect(await composeMail.isComposeEmailTitlePresent('Compose Email')).toBeTruthy('Compose email title missing');
            expect(await composeMail.isToOrCCInputTetxboxPresent('To')).toBeTruthy('To title missing');
            expect(await composeMail.isToOrCCInputTetxboxPresent('Cc')).toBeTruthy('Cc title missing');
            expect(await composeMail.isSubjectPresent()).toBeTruthy('Subject title missing');
            expect(await composeMail.getSubject()).toBe(caseId + ":");
            expect(await composeMail.isSelectEmailTemplateLinkPresent()).toBeTruthy('SelectEmailTemplateLink is missing');
            expect(await composeMail.isMessageBodyFontPannelBarPresent()).toBeTruthy('MessageBodyFontPannelBar is missing');
            expect(await composeMail.isAttachLinkPresent()).toBeTruthy('Attach Link is  missing');
            expect(await composeMail.isSendButtonPresent()).toBeTruthy('Send Button is missing');
            expect(await composeMail.isDiscardButtonPresent()).toBeTruthy('Discard Button is missing');
            await composeMail.clickOnDiscardButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            await viewCasePo.isEmailLinkPresent();
            await navigationPage.gotoQuickCase();
            await quickCase.selectRequesterName('adam');
            await quickCase.setCaseSummary('new case');
            await quickCase.createCaseButton();
            await utilCommon.closePopUpMessage();
            await quickCase.gotoCaseButton();
            let quickCaseId: string = await viewCasePo.getCaseID();
            await viewCasePo.clickOnEmailLink();
            expect(await composeMail.isComposeEmailTitlePresent('Compose Email')).toBeTruthy('Compose email title missing');
            expect(await composeMail.isToOrCCInputTetxboxPresent('To')).toBeTruthy('To title missing');
            expect(await composeMail.isToOrCCInputTetxboxPresent('Cc')).toBeTruthy('Cc title missing');
            expect(await composeMail.isSubjectPresent()).toBeTruthy('Subject title missing');
            expect(await composeMail.getSubject()).toBe(quickCaseId + ":");
            expect(await composeMail.isSelectEmailTemplateLinkPresent()).toBeTruthy('SelectEmailTemplateLink is missing');
            expect(await composeMail.isMessageBodyFontPannelBarPresent()).toBeTruthy('MessageBodyFontPannelBar is missing');
            expect(await composeMail.isAttachLinkPresent()).toBeTruthy('Attach Link is  missing');
            expect(await composeMail.isSendButtonPresent()).toBeTruthy('Send Button is missing');
            expect(await composeMail.isDiscardButtonPresent()).toBeTruthy('Discard Button is missing');
        });
        afterAll(async () => {
            await composeMail.clickOnDiscardButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });
    });

    //kgaikwad
    describe('[DRDMV-8391]: Negative:Compose email discard changes validation', async () => {
        it('[DRDMV-8391]: Negative:Compose email discard changes validation', async () => {
            await navigationPage.gotoCaseConsole();
            let randomString = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let caseData = {
                "Requester": "qkatawazi",
                "Summary": "Test case for DRDMV-8377RandVal" + randomString,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
            }
            await apiHelper.apiLogin('qtao');
            let newCase = await apiHelper.createCase(caseData);
            let caseId: string = newCase.displayId;
            await caseConsole.searchAndOpenCase(caseId);
            expect(await viewCasePo.isEmailLinkPresent()).toBeTruthy('Email Link is missing');
            await viewCasePo.clickOnEmailLink();
            await composeMail.clickOnDiscardButton();
            expect(await composeMail.getTextOfDiscardButtonWarningMessage()).toBe('Email not sent. Do you want to continue?'), 'Warning Email message is missing';
        });
        afterAll(async () => {
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });
    });

    //kgaikwad
    describe('[DRDMV-10453]: Email Template grid columns', async () => {
        it('[DRDMV-10453]: Email Template grid columns', async () => {
            await navigationPage.gotoCaseConsole();
            let randomString = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let caseData = {
                "Requester": "qkatawazi",
                "Summary": "Test case for DRDMV-8377RandVal" + randomString,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
            }
            await apiHelper.apiLogin('qtao');
            let newCase = await apiHelper.createCase(caseData);
            let caseId: string = newCase.displayId;
            await caseConsole.searchAndOpenCase(caseId);
            expect(await viewCasePo.isEmailLinkPresent()).toBeTruthy('Email Link is missing');
            await viewCasePo.clickOnEmailLink();
            await composeMail.clickOnSelectEmailTemplateLink();
            let columnHeaders: string[] = ["Template Name", "Message Subject", "Locale"];
            expect(await selectEmailTemplateBladePo.areColumnHeaderMatches(columnHeaders)).toBeTruthy('wrong column headers');
            await selectEmailTemplateBladePo.clickOnCancelButton();
        });
        afterAll(async () => {
            await composeMail.clickOnDiscardButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });
    });

    //kgaikwad
    describe('[DRDMV-10390]: Visible Columns on Email Template Grid on Compose Email UI', async () => {
        it('[DRDMV-10390]: Visible Columns on Email Template Grid on Compose Email UI', async () => {
            await navigationPage.gotoCaseConsole();
            let randomString = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let caseData =
            {
                "Requester": "qkatawazi",
                "Summary": "Test case for DRDMV-8377RandVal" + randomString,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
            }
            await apiHelper.apiLogin('qtao');
            let newCase = await apiHelper.createCase(caseData);
            let caseId: string = newCase.displayId;
            await caseConsole.searchAndOpenCase(caseId);
            expect(await viewCasePo.isEmailLinkPresent()).toBeTruthy('Email Link is missing');
            await viewCasePo.clickOnEmailLink();
            await composeMail.clickOnSelectEmailTemplateLink();
            let columns: string[] = ["ID", "Display ID", "Company", "Description", "Label", "Template Id",];
            await selectEmailTemplateBladePo.addGridColumn(columns);
            let columnHeaders: string[] = ["Template Name", "Message Subject", "Locale", "ID", "Display ID", "Company", "Description", "Label", "Template Id"];
            expect(await selectEmailTemplateBladePo.areColumnHeaderMatches(columnHeaders)).toBeTruthy('wrong column headers');
            await selectEmailTemplateBladePo.removeGridColumn(columns);
            await selectEmailTemplateBladePo.clickOnCancelButton();
        });
        afterAll(async () => {
            await composeMail.clickOnDiscardButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });
    });

    //kgaikwad
    describe('[DRDMV-10409, DRDMV-9033]: Negative - Verify Discard button on adding attachment in Compose Email', async () => {
        it('[DRDMV-10409, DRDMV-9033]: Negative - Verify Discard button on adding attachment in Compose Email', async () => {
            await navigationPage.gotoCaseConsole();
            let randomString = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let caseData = {
                "Requester": "qkatawazi",
                "Summary": "Test case for DRDMV-8377RandVal" + randomString,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
            }
            await apiHelper.apiLogin('qtao');
            let newCase = await apiHelper.createCase(caseData);
            let caseId: string = newCase.displayId;
            await caseConsole.searchAndOpenCase(caseId);
            expect(await viewCasePo.isEmailLinkPresent()).toBeTruthy('Email Link is missing');
            await viewCasePo.clickOnEmailLink();
            await composeMail.addAttachment(['../../data/ui/attachment/demo.txt']);
            expect(await composeMail.getFileDisplayedFileName()).toContain('demo.txt');
            await composeMail.clickOnSelectEmailTemplateLink();
            expect(await selectEmailTemplateBladePo.isApplyButtonEnabled()).toBeFalsy('Apply button is clickable');
            await selectEmailTemplateBladePo.clickOnCancelButton();
            await composeMail.clickOnDiscardButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            expect(await activityTabPo.isFileAttachedOnActivity()).toBeFalsy('file is attached on activity');
        });
        afterAll(async () => {
            await composeMail.clickOnDiscardButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });
    });

    //kgaikwad
    //Failed due to application issue...defect logged DRDMV-21883
    describe('[DRDMV-10394,DRDMV-10397]: Apply Email Template', async () => {
        let randomString = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let newCase, emailTemplateDataForTest;
        beforeAll(async () => {
            emailTemplateDataForTest = await emailTemplateData['emailTemplateWithMandatoryField'];
            emailTemplateDataForTest.TemplateName = 'TemplateWithMandatoryField' + randomString;
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createEmailTemplate(emailTemplateDataForTest);
            let caseData = {
                "Requester": "qkatawazi",
                "Summary": "Test case for DRDMV-10394 RandVal" + randomString,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
            }
            await apiHelper.apiLogin('qtao');
            newCase = await apiHelper.createCase(caseData);
        });
        it('[DRDMV-10394,DRDMV-10397]: Apply Email Template', async () => {
            await navigationPage.gotoCaseConsole();
            let caseId: string = newCase.displayId;
            await utilityGrid.clearFilter();
            await caseConsole.searchAndOpenCase(caseId);
            expect(await viewCasePo.isEmailLinkPresent()).toBeTruthy('Email Link is missing');
            await viewCasePo.clickOnEmailLink();
            await composeMail.clickOnSelectEmailTemplateLink();
            await selectEmailTemplateBladePo.searchAndSelectEmailTemplate(emailTemplateDataForTest.TemplateName);
            await selectEmailTemplateBladePo.clickOnApplyButton();
            await composeMail.setToOrCCInputTextbox('To', 'fritz.schulz@petramco.com');
            expect(await composeMail.getEmailBody()).toContain('Hi Team ,\n\nI am taking leave today.\n\nThanks.');
            expect(await composeMail.getSubject()).toContain(caseId);
            expect(await composeMail.getSubjectInputValue()).toContain(emailTemplateDataForTest.EmailMessageSubject);
            await composeMail.clickOnSendButton();
            await utilityCommon.closePopUpMessage();
            expect(await activityTabPo.getEmailTitle()).toContain('Qianru Tao sent an email');
            expect(await activityTabPo.getEmailTemplateDetails()).toContain(emailTemplateDataForTest.TemplateName);
            expect(await activityTabPo.getRecipientInTo()).toContain('To: Fritz Schulz');
            expect(await activityTabPo.getEmailSubject()).toContain(caseId + ':' + emailTemplateDataForTest.EmailMessageSubject);
            await activityTabPo.clickShowMoreForEmailActivity();
            expect(await activityTabPo.getEmailBody()).toContain('I am taking leave today.');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await composeMail.clickOnDiscardButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });
    });

    //kgaikwad
    describe('[DRDMV-10401,DRDMV-10393]: Email Body override with template details', async () => {
        let randomString = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let newCase, emailTemplateDataForTest;
        beforeAll(async () => {
            emailTemplateDataForTest = await emailTemplateData['emailTemplateWithMandatoryField'];
            emailTemplateDataForTest.TemplateName = 'TemplateWithMandatoryField' + randomString;
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createEmailTemplate(emailTemplateDataForTest);
            let caseData = {
                "Requester": "qkatawazi",
                "Summary": "Test case for DRDMV-10401 RandVal" + randomString,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
            }
            await apiHelper.apiLogin('qtao');
            newCase = await apiHelper.createCase(caseData);
        });
        it('[DRDMV-10401,DRDMV-10393]: Email Body override with template details', async () => {
            let caseId: string = newCase.displayId;
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await caseConsole.searchAndOpenCase(caseId);
            expect(await viewCasePo.isEmailLinkPresent()).toBeTruthy('Email Link is missing');
            await viewCasePo.clickOnEmailLink();
            expect(await composeMail.getSubject()).toContain(caseId);
            await composeMail.clickOnSelectEmailTemplateLink();
            await utilCommon.waitUntilSpinnerToHide();
            await selectEmailTemplateBladePo.searchAndSelectEmailTemplate(emailTemplateDataForTest.TemplateName);
            await selectEmailTemplateBladePo.clickOnApplyButton();
            await composeMail.setToOrCCInputTextbox('To', 'fritz.schulz@petramco.com');
            expect(await composeMail.getEmailBody()).toContain('Hi Team ,\n\nI am taking leave today.\n\nThanks.');
            expect(await composeMail.getSubject()).toContain(caseId); ////part of DRDMV-10393
            expect(await composeMail.getSubjectInputValue()).toContain(emailTemplateDataForTest.EmailMessageSubject);
            expect((await composeMail.isTextPresentInEmailBody('qtao@petramco.com'))).toBeFalsy();
            expect((await composeMail.isTextPresentInEmailBody('Qianru Tao'))).toBeFalsy();
            await composeMail.clickOnSendButton();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await composeMail.clickOnDiscardButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });
    });

    //ptidke
    describe('[DRDMV-10398,DRDMV-10396,DRDMV-10402]:Email Template List Update in case compose email', async () => {
        let randomString = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let newCase, emailTemplateDataForTest;
        beforeAll(async () => {
            emailTemplateDataForTest = await emailTemplateData['emailTemplateWithMandatoryField'];
            emailTemplateDataForTest.TemplateName = 'TemplateWithMandatoryField' + randomString;
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createEmailTemplate(emailTemplateDataForTest);
            let caseData = {
                "Requester": "qdu",
                "Summary": "Test case for DRDMV-10398 RandVal" + randomString,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
            }
            await apiHelper.apiLogin('qtao');
            newCase = await apiHelper.createCase(caseData);
        });
        it('[DRDMV-10398,DRDMV-10396,DRDMV-10402]:Email Template List Update in case compose email', async () => {
            let caseId: string = newCase.displayId;
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await caseConsole.searchAndOpenCase(caseId);
            expect(await viewCasePo.isEmailLinkPresent()).toBeTruthy('Email Link is missing');
            await viewCasePo.clickOnRequestersEmail();
            await composeMail.clickOnSelectEmailTemplateLink();
            await selectEmailTemplateBladePo.searchAndSelectEmailTemplate(emailTemplateDataForTest.TemplateName);
            await selectEmailTemplateBladePo.clickOnApplyButton();
            await composeMail.setToOrCCInputTextbox('To', 'fritz.schulz@petramco.com');
            expect(await composeMail.getEmailBody()).toContain('Hi Team ,\n\nI am taking leave today.\n\nThanks.');
            expect(await composeMail.getSubject()).toContain(caseId);
            expect(await composeMail.getSubjectInputValue()).toContain(emailTemplateDataForTest.EmailMessageSubject);
            expect(await composeMail.getEmailTemplateNameHeading()).toContain(emailTemplateDataForTest.TemplateName);
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteEmailOrNotificationTemplate(emailTemplateDataForTest.TemplateName);
            await composeMail.clickOnSelectEmailTemplateLink();
            await utilityGrid.searchRecord(emailTemplateDataForTest.TemplateName);
            expect(await selectEmailTemplateBladePo.isEmailTemplateGridEmpty(emailTemplateDataForTest.TemplateName)).toBeFalsy('Email template grid is not empty');
            await selectEmailTemplateBladePo.clickOnCancelButton();
            await composeMail.clickOnSendButton();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await composeMail.clickOnDiscardButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });
    });

    //kgaikwad
    describe('[DRDMV-10395]: Email template Update', async () => {
        let randomString = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let newCase, emailTemplateDataForTest1, emailTemplateDataForTest2;
        beforeAll(async () => {
            emailTemplateDataForTest1 = await emailTemplateData['emailTemplateWithMandatoryField'];
            emailTemplateDataForTest1.TemplateName = 'TemplateWithMandatoryField' + randomString;
            emailTemplateDataForTest2 = await emailTemplateData['emailTemplateForSalary'];
            emailTemplateDataForTest2.TemplateName = 'TemplateForSalary' + randomString;
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createEmailTemplate(emailTemplateDataForTest1);
            await apiHelper.createEmailTemplate(emailTemplateDataForTest2);
            let caseData = {
                "Requester": "qdu",
                "Summary": "Test case for DRDMV-10395 RandVal" + randomString,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
            };
            await apiHelper.apiLogin('qtao');
            newCase = await apiHelper.createCase(caseData);
        });
        it('[DRDMV-10395]: Email template Update', async () => {
            await navigationPage.gotoCaseConsole();
            let caseId: string = newCase.displayId;
            await utilityGrid.clearFilter();
            await caseConsole.searchAndOpenCase(caseId);
            expect(await viewCasePo.isEmailLinkPresent()).toBeTruthy('Email Link is missing');
            await viewCasePo.clickOnEmailLink();
            expect(await composeMail.getSubject()).toContain(caseId);
            await composeMail.clickOnSelectEmailTemplateLink();
            await utilCommon.waitUntilSpinnerToHide();
            await selectEmailTemplateBladePo.searchAndSelectEmailTemplate(emailTemplateDataForTest1.TemplateName);
            await selectEmailTemplateBladePo.clickOnApplyButton();
            await composeMail.setToOrCCInputTextbox('To', 'fritz.schulz@petramco.com');
            expect(await composeMail.getEmailBody()).toContain('I am taking leave today.', 'Email Body 1 does not match');
            expect(await composeMail.getSubject()).toContain(caseId);
            expect(await composeMail.getSubjectInputValue()).toContain(emailTemplateDataForTest1.EmailMessageSubject, 'Subject value 1 does not match');
            expect(await composeMail.getEmailTemplateNameHeading()).toContain(emailTemplateDataForTest1.TemplateName, 'email Template Name 1 does not match');
            await composeMail.clickOnSelectEmailTemplateLink();
            await selectEmailTemplateBladePo.searchAndSelectEmailTemplate(emailTemplateDataForTest2.TemplateName);
            await selectEmailTemplateBladePo.clickOnApplyButton();
            expect(await composeMail.getEmailBody()).toContain('I have checked my salary.', 'Email Body 2 does not match');
            expect(await composeMail.getSubject()).toContain(caseId);
            expect(await composeMail.getSubjectInputValue()).toContain(emailTemplateDataForTest2.EmailMessageSubject, 'Subject 2 does not match');
            expect(await composeMail.getEmailTemplateNameHeading()).toContain(emailTemplateDataForTest2.TemplateName, 'Email Template name heading does not match');
            await composeMail.clickOnSendButton();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await composeMail.clickOnDiscardButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });
    });

    //kgaikwad
    describe('[DRDMV-8392,DRDMV-10384]: Negative: In Email "To" and "cc" should be user from Foundation data ', async () => {
        let randomString = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let newCase;
        beforeAll(async () => {
            let caseData = {
                "Requester": "qdu",
                "Summary": "Test case for DRDMV-8392 RandVal" + randomString,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
            }
            await apiHelper.apiLogin('qtao');
            newCase = await apiHelper.createCase(caseData);
        });
        it('[DRDMV-8392,DRDMV-10384]: Negative: In Email "To" and "cc" should be user from Foundation data ', async () => {
            let caseId: string = newCase.displayId;
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await caseConsole.searchAndOpenCase(caseId);
            expect(await viewCasePo.isEmailLinkPresent()).toBeTruthy('Email Link is missing');
            await viewCasePo.clickOnEmailLink();
            await composeMail.isSelectEmailTemplateButtonPresent();
            expect(await composeMail.isUserPopulatedInToOrCc('To', 'xyxd')).toBeFalsy();
            expect(await composeMail.isUserPopulatedInToOrCc('Cc', 'xyxd')).toBeFalsy();
            await composeMail.setToOrCCInputTextbox('To', 'fritz.schulz@petramco.com');
            expect(await composeMail.getToEmailPerson()).toContain('Fritz Schulz');
            await composeMail.setToOrCCInputTextbox('Cc', 'fritz.schulz@petramco.com');
            expect(await composeMail.getCcEmailPerson()).toContain('Fritz Schulz');
            await composeMail.clickOnDiscardButton();
            expect(await composeMail.getTextOfDiscardButtonWarningMessage()).toBe('Email not sent. Do you want to continue?'), 'Warning Email message is missing';
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });
        afterAll(async () => {
            await composeMail.clickOnDiscardButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });
    });

    describe('[DRDMV-20369]: Verify able to apply email template with images tables and hyperlinks ', async () => {
        let randomString = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let newCase, caseTemplateName, sourceValue1;
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            let recDeleted = await apiHelper.deleteDynamicFieldAndGroup();
            console.log("Record deleted...", recDeleted);
            caseTemplateName = 'caseTempRDMV-20369lp3ir' + randomString;
            let caseTemaplateSummary = 'caseTempRDMV-20369Template' + randomString;
            let casetemplateData = {
                "templateName": `${caseTemplateName}`,
                "templateSummary": `${caseTemaplateSummary}`,
                "templateStatus": "Active",
            }
            await apiHelper.apiLogin('fritz');
            let newCaseTemplate = await apiHelper.createCaseTemplate(casetemplateData);
            await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'CASE_TEMPLATE_WITH_CONFIDENTIAL');
            let caseData = {
                "Requester": "qdu",
                "Summary": "Test case for DRDMV-20369 RandVal" + randomString,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
            }
            await apiHelper.apiLogin('fritz');
            newCase = await apiHelper.createCase(caseData);
        });
        it('[DRDMV-20369]: Verify able to apply email template with images tables and hyperlinks ', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Templates', 'Email Template Console - Business Workflows');
            await consoleEmailTemplatePo.clickOnAddEmailTemplateButton();
            await createEmailTemplatePo.setTemplateName("templateName" + randomString);
            console.log("templateName" + randomString);
            await createEmailTemplatePo.selectCompany('Petramco');
            await createEmailTemplatePo.selectStatusDropDown('Active');
            await createEmailTemplatePo.setDescription(randomString);
            await createEmailTemplatePo.setSubject("templateRandomString" + randomString);
        });
        it('[DRDMV-20369]: Verify able to apply email template with images tables and hyperlinks ', async () => {
            //adding dynamic fields
            await createEmailTemplatePo.setBody('Setting Body');
            await createEmailTemplatePo.clickOnImageIcon();
            sourceValue1 = await imagePropertiesPo.addImageOnEmail('Upload', '../../../data/ui/attachment/articleStatus.png', imageWidthFieldIndex, imageUrlFieldIndex);
            //upload images via URL
            await createEmailTemplatePo.clickOnImageIcon();
            await imagePropertiesPo.setInputBoxValue(uploadURL, imageUrlFieldIndex);
            await imagePropertiesPo.setInputBoxValue('200', imageWidthFieldIndex);
            await imagePropertiesPo.clickOnOkButton();
            await createEmailTemplatePo.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('Google', linkDisplayTextFieldIndex);
            await linkPropertiesPo.setValueOfLinkProperties('www.google.com', linkUrlFieldIndex);
            await linkPropertiesPo.clickOnTargetTab();
            await linkPropertiesPo.selectDropDown('_blank', linkTargetDropDownIndex);
            await linkPropertiesPo.clickOnOkBtn();
            await createEmailTemplatePo.setBody(' Empty New things');
            await createEmailTemplatePo.clickOnTableIcon();
            await tablePropertiesPo.setValueOfTableProperties('4', tableRowFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('3', tableColumnFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('500', tableWidthFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('200', tableHeightFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('new' + randomString, cellCaption);
            await tablePropertiesPo.setValueOfTableProperties('tableEmail', cellSummary);
            await tablePropertiesPo.clickOnOkButton();
            //bold
            await createEmailTemplatePo.clickInTableRowOfEmailTemplate(1, 1, 'tableEmail');
            await createEmailTemplatePo.clickOnInsertField();
            await addFieldsPopPo.clickOnCase();
            await addFieldsPopPo.selectDynamicField('Assignee');
            await addFieldsPopPo.clickOnOkButtonOfEditor();
            await createEmailTemplatePo.clickInTableRowOfEmailTemplate(1, 2, 'tableEmail');
            await createEmailTemplatePo.clickOnInsertField();
            await addFieldsPopPo.navigateToDynamicFieldInCaseTemplate(caseTemplateName);
            await addFieldsPopPo.selectDynamicField('OuterNonConfidential');
            await addFieldsPopPo.clickOnOkButtonOfEditor();
            //bold
            await createEmailTemplatePo.clickInTableRowOfEmailTemplate(1, 3, 'tableEmail');
            await createEmailTemplatePo.clickOnBoldIcon();
            await createEmailTemplatePo.setDataInEmailTemplateTable(1, 3, 'FirstBold', 'tableEmail');
            //italic
            await createEmailTemplatePo.clickInTableRowOfEmailTemplate(2, 1, 'tableEmail');
            await createEmailTemplatePo.clickOnItalicIcon();
            await createEmailTemplatePo.setDataInEmailTemplateTable(2, 1, 'FirstItalic', 'tableEmail');
            //underline
            await createEmailTemplatePo.clickInTableRowOfEmailTemplate(2, 2, 'tableEmail');
            await createEmailTemplatePo.clickOnUnderLineIcon();
            await createEmailTemplatePo.setDataInEmailTemplateTable(2, 2, 'FirstUnderLine', 'tableEmail');
            //left Align
            await createEmailTemplatePo.clickInTableRowOfEmailTemplate(2, 3, 'tableEmail');
            await createEmailTemplatePo.clickOnLeftAlignIcon();
            await createEmailTemplatePo.setDataInEmailTemplateTable(2, 3, 'FirstLeftAlign', 'tableEmail');
            //Right Align
            await createEmailTemplatePo.clickInTableRowOfEmailTemplate(3, 1, 'tableEmail');
            await createEmailTemplatePo.clickOnRightAlignIcon();
            await createEmailTemplatePo.setDataInEmailTemplateTable(3, 1, 'FirstRightAlign', 'tableEmail');
            //Center Align
            await createEmailTemplatePo.clickInTableRowOfEmailTemplate(3, 2, 'tableEmail');
            await createEmailTemplatePo.clickOnCenterAlignIcon();
            await createEmailTemplatePo.setDataInEmailTemplateTable(3, 2, 'FirstCenterAlign', 'tableEmail');
            //set color
            await createEmailTemplatePo.clickInTableRowOfEmailTemplate(3, 3, 'tableEmail');
            await createEmailTemplatePo.selectColor('Bright Blue');
            await createEmailTemplatePo.setDataInEmailTemplateTable(3, 3, 'SettingColor', 'tableEmail');
            //set font
            await createEmailTemplatePo.clickInTableRowOfEmailTemplate(4, 1, 'tableEmail');
            await createEmailTemplatePo.clickOnFontSizeIcon();
            await createEmailTemplatePo.selectFontTypeOrSize('18');
            await createEmailTemplatePo.setDataInEmailTemplateTable(4, 1, 'SettingFontSize', 'tableEmail');
            await createEmailTemplatePo.setBody('Ending Email');
            await createEmailTemplatePo.clickOnSaveButton();
        });
        it('[DRDMV-20369]: Verify able to apply email template with images tables and hyperlinks ', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await caseConsole.searchAndOpenCase(newCase.displayId);
            expect(await viewCasePo.isEmailLinkPresent()).toBeTruthy('Email Link is missing');
            await viewCasePo.clickOnEmailLink();
            await composeMail.setToOrCCInputTextbox('To', 'fritz.schulz@petramco.com');
            await composeMail.clickOnSelectEmailTemplateLink();
            await selectEmailTemplateBladePo.searchAndSelectEmailTemplate("templateName" + randomString);
            await selectEmailTemplateBladePo.clickOnApplyButton();
            expect(await composeMail.getEmailTemplateNameHeading()).toContain("templateName" + randomString);
            await composeMail.setEmailBody('this is newly added text');
            await composeMail.clickOnSendButton();
            await utilityCommon.closePopUpMessage();
            await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.getFirstPostContent()).toContain('Fritz Schulz sent an email', 'not');
            expect(await activityTabPo.isLinkDisplayedInActivity('http://www.google.com')).toBeTruthy('Link is not displayed');
            expect(await activityTabPo.getTextOfTD('strong')).toContain('FirstBold');
            expect(await activityTabPo.getTextOfTD('em')).toContain('FirstItalic');
            expect(await activityTabPo.getTextOfTD('u')).toContain('FirstUnderLine');
            expect(await activityTabPo.getTextOnActivityTable(3, 1)).toContain('FirstRightAlign');
            expect(await activityTabPo.getTextOnActivityTable(3, 2)).toContain('FirstCenterAlign');
            expect(await activityTabPo.getTextOnActivityTable(4, 1)).toContain('SettingFontSize');
            expect(await activityTabPo.isImageDisplayedInActivity(sourceValue1)).toBeTruthy('Image is not displayed');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await composeMail.clickOnDiscardButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            await navigationPage.signOut();
            await loginPage.login('qtao');
        });
    });

    describe('[DRDMV-20365,DRDMV-20366]: Verify Able to insert table,hyperlink, images (All images) and Copy paste images in compose email and its send successfully', async () => {
        let randomString = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let sourceValue, newCase;
        beforeAll(async () => {
            let caseData = {
                "Requester": "qdu",
                "Summary": "Test case for DRDMV-20365 RandVal" + randomString,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
            }
            await apiHelper.apiLogin('fritz');
            newCase = await apiHelper.createCase(caseData);
        });
        it('[DRDMV-20365,DRDMV-20366]: Verify Able to insert table,hyperlink, images (All images) and Copy paste images in compose email and its send successfully', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await utilityGrid.clearFilter();
            await caseConsole.searchAndOpenCase(newCase.displayId);
            await viewCasePo.clickOnEmailLink();
            await composeMail.clickOnSelectEmailTemplateLink();
            await selectEmailTemplateBladePo.clickOnCancelButton();
            await composeMail.setEmailBody('Uploading Image through Browsing');
            await composeMail.clickOnImageIcon();
            sourceValue = await imagePropertiesPo.addImageOnEmail('Upload', '../../../data/ui/attachment/articleStatus.png', imageWidthFieldIndex, imageUrlFieldIndex);
            await composeMail.setEmailBody("Uploading Image through URL");
            await composeMail.clickOnImageIcon();
            await imagePropertiesPo.setInputBoxValue(uploadURL, imageUrlFieldIndex);
            await imagePropertiesPo.setInputBoxValue('200', imageWidthFieldIndex);
            await imagePropertiesPo.clickOnOkButton();
            await composeMail.setEmailBody("Adding a Link: ");
            await composeMail.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('Google', linkDisplayTextFieldIndex);
            await linkPropertiesPo.setValueOfLinkProperties('www.google.com', linkUrlFieldIndex);
            await linkPropertiesPo.clickOnTargetTab();
            await linkPropertiesPo.selectDropDown('_blank', linkTargetDropDownIndex);
            await linkPropertiesPo.clickOnOkBtn();
            await composeMail.setEmailBody("Table: ");
            await composeMail.clickOnTableIcon();
            await tablePropertiesPo.setValueOfTableProperties('4', tableRowFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('9', tableColumnFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('500', tableWidthFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('200', tableHeightFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('new' + randomString, cellCaption);
            await tablePropertiesPo.setValueOfTableProperties('tableSummary', cellSummary);
            await tablePropertiesPo.clickOnOkButton();
            //bold
            await composeMail.clickInTableCell(1, 1, 'tableSummary');
            await composeMail.clickOnBoldIcon();
            await composeMail.setDataInTable(1, 1, 'FirstBold', 'tableSummary');
            //italic
            await composeMail.clickInTableCell(1, 2, 'tableSummary');
            await composeMail.clickOnItalicIcon();
            await composeMail.setDataInTable(1, 2, 'FirstItalic', 'tableSummary');
            //underline
            await composeMail.clickInTableCell(1, 3, 'tableSummary');
            await composeMail.clickOnUnderLineIcon();
            await composeMail.setDataInTable(1, 3, 'FirstUnderLine', 'tableSummary');
            //left Align
            await composeMail.clickInTableCell(1, 4, 'tableSummary');
            await composeMail.clickOnLeftAlignIcon();
            await composeMail.setDataInTable(1, 4, 'FirstLeftAlign', 'tableSummary');
            //Right Align
            await composeMail.clickInTableCell(1, 5, 'tableSummary');
            await composeMail.clickOnRightAlignIcon();
            await composeMail.setDataInTable(1, 5, 'FirstRightAlign', 'tableSummary');
            //Center Align
            await composeMail.clickInTableCell(1, 6, 'tableSummary');
            await composeMail.clickOnCenterAlignIcon();
            await composeMail.setDataInTable(1, 6, 'FirstCenterAlign', 'tableSummary');
            //set color
            await browser.sleep(1000); //wait to set font size in proper table cell
            await composeMail.clickInTableCell(1, 7, 'tableSummary');
            await composeMail.selectColor('Bright Blue');
            await composeMail.setDataInTable(1, 7, 'SettingColor', 'tableSummary');
            //set font
            await browser.sleep(1000); //wait to set font size in proper table cell
            await composeMail.clickInTableCell(1, 8, 'tableSummary');
            await composeMail.clickOnFontSizeIcon();
            await composeMail.selectFontTypeOrSize('18');
            await composeMail.setDataInTable(1, 8, 'SettingFontSize', 'tableSummary');
            //set fontType
            await browser.sleep(1000); //wait to set font size in proper table cell
            await composeMail.clickInTableCell(1, 9, 'tableSummary');
            await composeMail.clickOnFontTypeIcon();
            await composeMail.selectFontTypeOrSize('Courier New');
            await composeMail.setDataInTable(1, 9, 'SettingFontType', 'tableSummary');
            //checking number and bullot points and setting values for them
            await composeMail.setBulletPointAndNumer('PlusOne');
            await composeMail.setBulletPointAndNumer('PlusTwo');
            await composeMail.setBulletPointAndNumer('PlusThree');
            await composeMail.setToOrCCInputTextbox('To', 'fritz.schulz@petramco.com');
            await composeMail.clickOnSendButton();
            await utilityCommon.closePopUpMessage();
        });
        it('[DRDMV-20365,DRDMV-20366]: Verify Able to insert table,hyperlink, images (All images) and Copy paste images in compose email and its send successfully', async () => {
            //activity verify
            await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.isImageDisplayedInActivity(sourceValue)).toBeTruthy('Image is not displayed');
            expect(await activityTabPo.isImageDisplayedInActivity(uploadURL)).toBeTruthy('Image is not displayed');
            expect(await activityTabPo.isLinkDisplayedInActivity('http://www.google.com')).toBeTruthy('Link is not displayed');
            expect(await activityTabPo.getTextOfTD('strong')).toContain('FirstBold');
            expect(await activityTabPo.getTextOfTD('em')).toContain('FirstItalic');
            expect(await activityTabPo.getTextOfTD('u')).toContain('FirstUnderLine');
            expect(await activityTabPo.getTextOnActivityTable(1, 4)).toContain('FirstLeftAlign');
            expect(await activityTabPo.getTextOnActivityTable(1, 5)).toContain('FirstRightAlign');
            expect(await activityTabPo.getTextOnActivityTable(1, 6)).toContain('FirstCenterAlign');
            expect(await activityTabPo.getColorFontStyleOfText(1, 7, "color:#3498db;")).toContain('SettingColor');
            expect(await activityTabPo.getColorFontStyleOfText(1, 8, "font-size:18px;")).toContain('SettingFontSize');
            expect(await activityTabPo.getColorFontStyleOfText(1, 9, "font-family:Courier New,Courier,monospace;")).toContain('SettingFontType');
            await activityTabPo.clickOnHyperlink('http://www.google.com');
            await utilityCommon.switchToNewTab(1);
            await browser.waitForAngularEnabled(false);
            expect(await browser.getTitle()).toContain('Google');
            await browser.waitForAngularEnabled(true);
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            expect(await browser.getTitle()).toContain('Business Workflows');
            await activityTabPo.clickOnRefreshButton();
            await activityTabPo.clickOnReplyAll();
            expect(await composeMail.isImageDisplayedComposeEmail(uploadURL)).toBeTruthy('Image is not displayed');
            expect(await composeMail.isLinkDisplayedComposeEmail('http://www.google.com')).toBeTruthy('Image is not displayed');
            expect(await composeMail.getColorOrFontOfTextComposeEmail('font-family:Courier New,Courier,monospace;')).toContain('SettingFontType');
            expect(await composeMail.getColorOrFontOfTextComposeEmail('font-size:18px;')).toContain('SettingFontSize');
            await composeMail.clickOnImageIcon();
            let sourceValue2 = await imagePropertiesPo.addImageOnEmail('Upload', '../../../data/ui/attachment/articleStatus.png', imageWidthFieldIndex, imageUrlFieldIndex);
            expect(await composeMail.isImageDisplayedComposeEmail(sourceValue2)).toBeTruthy('Image is not displayed');
            await composeMail.clickOnSendButton();
            await utilityCommon.closePopUpMessage();
            await activityTabPo.clickOnRefreshButton();
            await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.isImageDisplayedInActivity(sourceValue2)).toBeTruthy('Image not displayed');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await composeMail.clickOnDiscardButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            await navigationPage.signOut();
            await loginPage.login('qtao');
        });
    });

    //tzope
    describe('[DRDMV-21499]: Compose email using email template and check attachments are added', async () => {
        let filePath1 = 'e2e/data/ui/attachment/bwfJpg1.jpg';
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseData, newCase, publishDocData, emailTemplateName;
        beforeAll(async () => {
            caseData = {
                "Requester": "qtao",
                "Summary": "Test case for DRDMV-21499RandVal" + summary,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
            }
            publishDocData = {
                docLibTitle: 'Holiday Calender',
                company: 'Petramco',
                businessUnit: "United States Support",
                ownerGroup: "US Support 3",
                shareExternally: true
            }
            //create a doc lib
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDocumentLibrary(publishDocData.docLibTitle);
            await apiHelper.apiLogin('qkatawazi');
            let docLib = await apiHelper.createDocumentLibrary(publishDocData, filePath1);
            await apiHelper.publishDocumentLibrary(docLib);
            //create an email template
            emailTemplateName = await emailTemplateData['emailTemplateToComposeEmail'].TemplateName + summary;
            emailTemplateData['emailTemplateToComposeEmail'].TemplateName = emailTemplateName;
            await apiHelper.createEmailTemplate(emailTemplateData['emailTemplateToComposeEmail']);
            newCase = await apiHelper.createCase(caseData);
        });
        it('[DRDMV-21499]: Compose email using email template and check attachments are added', async () => {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
            //link doc to email template
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Templates', 'Email Template Console - Business Workflows');
            await consoleEmailTemplatePo.searchAndOpenEmailTemplate(emailTemplateName);
            await editEmailTemplatePo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(publishDocData.docLibTitle);
            await editEmailTemplatePo.clickOnSaveButton();
            expect(await utilCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Attachment is not added in Email Template');
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            //Create a Case and compose email and send it
            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(newCase.displayId);
            expect(await viewCasePo.isEmailLinkPresent()).toBeTruthy('Email Link is missing');
            await viewCasePo.clickOnEmailLink();
            await composeMail.clickOnSelectEmailTemplateLink();
            await selectEmailTemplateBladePo.searchAndSelectEmailTemplate(emailTemplateName);
            await selectEmailTemplateBladePo.clickOnApplyButton();
            await composeMail.setToOrCCInputTextbox('To', 'fritz.schulz@petramco.com');
            expect(await composeMail.getEmailBody()).toContain('Hi Team ,Company Financial Calender will be from March. Thanks.');
            expect(await composeMail.getSubject()).toContain(newCase.displayId);
            expect(await composeMail.getSubjectInputValue()).toContain('Declared Company Holidays');
            expect(await composeMail.getFileDisplayedFileName()).toContain('bwfJpg1.jpg');
            await composeMail.clickOnSendButton();
            expect(await utilityCommon.isPopUpMessagePresent('Email sent successfully')).toBeTruthy('Email is not sent successfully');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await composeMail.clickOnDiscardButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            await navigationPage.signOut();
            await loginPage.login("qtao");
        });
    });

    //radhiman
    //Bug-21778
    describe('[DRDMV-10388]: Search on Email Template Grid on Compose Email UI', async () => {
        let randomString = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let newCase, emailTemplateDataForTest;
        beforeAll(async () => {
            emailTemplateDataForTest = await emailTemplateData['emailTemplateWithMandatoryField'];
            emailTemplateDataForTest.TemplateName = 'TemplateWithMandatoryField' + randomString;
            emailTemplateDataForTest.Description = 'MandatoryFieldDescription' + randomString;
            emailTemplateDataForTest.EmailMessageSubject = 'MandatoryFieldSubject' + randomString;
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createEmailTemplate(emailTemplateDataForTest);
            let caseData = {
                "Requester": "apavlik",
                "Summary": "Test case for DRDMV-10388 RandVal" + randomString
            }
            await apiHelper.apiLogin('qtao');
            newCase = await apiHelper.createCase(caseData);
        });
        it('[DRDMV-10388]: Search on Email Template Grid on Compose Email UI', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await caseConsole.searchAndOpenCase(newCase.displayId);
            await viewCasePo.clickOnEmailLink();
            await composeMail.clickOnSelectEmailTemplateLink();
            let columns: string[] = ["Description"];
            await selectEmailTemplateBladePo.addGridColumn(columns);
            await selectEmailTemplateBladePo.searchEmailTemplate(emailTemplateDataForTest.TemplateName);
            expect(await selectEmailTemplateBladePo.getGridRecordValue("Template Name")).toBe(emailTemplateDataForTest.TemplateName);
            await selectEmailTemplateBladePo.searchEmailTemplate(emailTemplateDataForTest.Description);
            expect(await selectEmailTemplateBladePo.getGridRecordValue("Template Name")).toBe(emailTemplateDataForTest.TemplateName);
            await selectEmailTemplateBladePo.searchEmailTemplate(emailTemplateDataForTest.EmailMessageSubject);
            expect(await selectEmailTemplateBladePo.getGridRecordValue("Template Name")).toBe(emailTemplateDataForTest.TemplateName);
            await selectEmailTemplateBladePo.removeGridColumn(columns);
            await selectEmailTemplateBladePo.clickOnCancelButton();
        });
        afterAll(async () => {
            await composeMail.clickOnDiscardButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });
    });

    describe('[DRDMV-8388]: Compose and Send Email to Requester', async () => {
        let randomString = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseData, newCase;
        beforeAll(async () => {
            caseData = {
                "Requester": "fritz",
                "Summary": "TC DRDMV-8388 " + randomString,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Contact": "qtao",
                "Assignee": "qkatawazi"
            }
            await apiHelper.apiLogin('qtao');
            newCase = await apiHelper.createCase(caseData);
        });
        it('[DRDMV-8388]: Compose and Send Email to Requester', async () => {
            await navigationPage.gotoCaseConsole();
            let caseId: string = newCase.displayId;
            await utilityGrid.clearFilter();
            await caseConsole.searchAndOpenCase(newCase.displayId);
            await viewCasePo.clickOnRequestersEmail();
            expect(await composeMail.isComposeEmailTitlePresent('Compose Email')).toBeTruthy('Compose email title missing');
            expect(await composeMail.getSubject()).toBe(caseId + ":");
            expect(await composeMail.getToEmailPerson()).toContain('Fritz Schulz');
            await composeMail.setToOrCCInputTextbox('Cc', 'qtao@petramco.com');
            expect(await composeMail.getCcEmailPerson()).toContain('Qianru Tao');
            await composeMail.setEmailBody('Text added for DRDMV-8388');
            expect(await composeMail.isAttachLinkPresent()).toBeTruthy('Attach Link is  missing');
            await composeMail.addAttachment(['../../data/ui/attachment/demo.txt']);
            expect(await composeMail.getFileDisplayedFileName()).toContain('demo.txt');
            await composeMail.clickOnSendButton();
            await utilityCommon.closePopUpMessage();
            await activityTabPo.clickOnRefreshButton();
            await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.getRecipientInTo()).toContain('To: Fritz Schulz');
            expect(await activityTabPo.getRecipientInCc()).toContain('CC: Qianru Tao');
            expect(await activityTabPo.getEmailSubject()).toContain(caseId + ':' + caseData.Summary);
            expect(await activityTabPo.isFileAttachedOnActivity()).toBeTruthy('file is not attached on activity');
            expect(await activityTabPo.getEmailBody()).toContain('Text added for DRDMV-8388');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await composeMail.clickOnDiscardButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });
    });

    //radhiman
    //@Bug(DRDMV-21808)
    describe('[DRDMV-10387]: Filters on Email Template Grid on Compose Email UI', async () => {
        let randomString = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let newCase, emailTemplateDataForTest;
        beforeAll(async () => {
            emailTemplateDataForTest = await emailTemplateData['emailTemplateWithMandatoryField'];
            emailTemplateDataForTest.TemplateName = 'TemplateWithMandatoryField' + randomString;
            emailTemplateDataForTest.Description = 'MandatoryFieldDescription' + randomString;
            emailTemplateDataForTest.EmailMessageSubject = 'MandatoryFieldSubject' + randomString;
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createEmailTemplate(emailTemplateDataForTest);
            let caseData = {
                "Requester": "apavlik",
                "Summary": "Test case for DRDMV-10387 RandVal" + randomString,
            }
            await apiHelper.apiLogin('qtao');
            newCase = await apiHelper.createCase(caseData);
        });
        it('[DRDMV-10387]: Filters on Email Template Grid on Compose Email UI', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await caseConsole.searchAndOpenCase(newCase.displayId);
            await viewCasePo.clickOnEmailLink();
            await composeMail.clickOnSelectEmailTemplateLink();
            await selectEmailTemplateBladePo.clearFilter();
            await selectEmailTemplateBladePo.addFilter("Template Name", emailTemplateDataForTest.TemplateName, "searchbox");
            expect(await selectEmailTemplateBladePo.getGridRecordValue("Template Name")).toBe(emailTemplateDataForTest.TemplateName);
            await selectEmailTemplateBladePo.clearFilter();
            await selectEmailTemplateBladePo.addFilter("Message Subject", emailTemplateDataForTest.EmailMessageSubject, "searchbox");
            expect(await selectEmailTemplateBladePo.getGridRecordValue("Template Name")).toBe(emailTemplateDataForTest.TemplateName);
            await selectEmailTemplateBladePo.clearFilter();
            await selectEmailTemplateBladePo.addFilter("Description", emailTemplateDataForTest.Description, "searchbox");
            expect(await selectEmailTemplateBladePo.getGridRecordValue("Template Name")).toBe(emailTemplateDataForTest.TemplateName);
            await selectEmailTemplateBladePo.clearFilter();
            await selectEmailTemplateBladePo.addFilter("Company", "Petramco", "searchbox");
            //Searching and validating with filtering to company as, there can be multiple records for 1 company
            await selectEmailTemplateBladePo.searchEmailTemplate(emailTemplateDataForTest.TemplateName);
            expect(await selectEmailTemplateBladePo.getGridRecordValue("Template Name")).toBe(emailTemplateDataForTest.TemplateName);
            await selectEmailTemplateBladePo.clearFilter();
            await selectEmailTemplateBladePo.clickOnCancelButton();
        });
        afterAll(async () => {
            await composeMail.clickOnDiscardButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });
    });

    describe('[DRDMV-10399]: Compose email UI changes via different way', async () => {
        let randomString = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let newCase;
        beforeAll(async () => {
            let caseData = {
                "Requester": "fritz",
                "Summary": "TC DRDMV-10399 " + randomString,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Contact": "qtao",
                "Assignee": "qkatawazi"
            }
            await apiHelper.apiLogin('qtao');
            newCase = await apiHelper.createCase(caseData);
        });
        it('[DRDMV-10399]: Compose email UI changes via different way', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await caseConsole.searchAndOpenCase(newCase.displayId);
            await viewCasePo.clickOnRequestersEmail();
            expect(await composeMail.isComposeEmailTitlePresent('Compose Email')).toBeTruthy('Compose email title missing');
            expect(await composeMail.isSelectEmailTemplateLinkPresent()).toBeTruthy('SelectEmailTemplateLink is missing');
            expect(await composeMail.isSendButtonPresent()).toBeTruthy('Send Button is missing');
            await composeMail.clickOnDiscardButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            await viewCasePo.clickOnEmailLink();
            expect(await composeMail.isComposeEmailTitlePresent('Compose Email')).toBeTruthy('Compose email title missing');
            expect(await composeMail.isSelectEmailTemplateLinkPresent()).toBeTruthy('SelectEmailTemplateLink is missing');
            expect(await composeMail.isSendButtonPresent()).toBeTruthy('Send Button is missing');
            await composeMail.clickOnDiscardButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            await viewCasePo.clickOnContactPersonerDrpDwn();
            await viewCasePo.clickOnContactEmail();
            expect(await composeMail.isComposeEmailTitlePresent('Compose Email')).toBeTruthy('Compose email title missing');
            expect(await composeMail.isSelectEmailTemplateLinkPresent()).toBeTruthy('SelectEmailTemplateLink is missing');
            expect(await composeMail.isSendButtonPresent()).toBeTruthy('Send Button is missing');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await composeMail.clickOnDiscardButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });
    });
});
