import { browser, protractor, ProtractorExpectedConditions } from "protractor";
import apiHelper from '../../api/api.helper';
import caseConsole from '../../pageobject/case/case-console.po';
import quickCase from "../../pageobject/case/quick-case.po";
import viewCasePo from '../../pageobject/case/view-case.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import composeMail from '../../pageobject/email/compose-mail.po';
import { default as emailTemplateBladePo, default as selectEmailTemplateBladePo } from '../../pageobject/email/select-email-template-blade.po';
import activityTabPo from '../../pageobject/social/activity-tab.po';
import utilCommon from "../../utils/util.common";
import utilGrid from '../../utils/util.grid';
import tablePropertiesPo from '../../pageobject/common/ck-editor.popups.po.ts/table-properties.po';
import linkPropertiesPo from '../../pageobject/common/ck-editor.popups.po.ts/link-properties.po';
import imagePropertiesPo from '../../pageobject/settings/common/image-properties.po';
import consoleEmailTemplatePo from '../../pageobject/settings/email/console-email-template.po';
import createEmailTemplatePo from '../../pageobject/settings/email/create-email-template.po';
import addFieldsPopPo from '../../pageobject/common/add-fields-pop.po';
import consoleNotificationTemplatePo from '../../pageobject/settings/notification-config/console-notification-template.po';
import editNotificationTemplatePo from '../../pageobject/settings/notification-config/edit-notification-template.po';
import editMessageTextBladePo from '../../pageobject/settings/notification-config/edit-Message-Text-Blade.po';
import copyNotificationTemplatePo from '../../pageobject/settings/notification-config/copy-notification-template.po';
import apiCoreUtil from 'e2e/api/api.core.util';

let emailTemplateData = require('../../data/ui/email/email.template.api.json');
let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
const manageNotificationTempNavigation = 'Notification Configuration--Manage Templates';
const notifTempGridPageTitle = 'Manage Notification Template - Business Workflows';
let uploadURL = "https://www.google.com/homepage/images/hero-dhp-chrome-win.jpg?mmfb=90bec8294f441f5c41987596ca1b8cff";

describe("Compose Email", () => {
    let emailGuid;
    let incomingGUID, outgoingGUID, emailconfigGUID;
    let row = 0;
    let displayText = 0;
    let column = 1;
    let URL = 1;
    let width: number = 3;
    let height: number = 4;
    let target = 4;
    let cellCaption: number = 7;
    let cellSummary: number = 8;
    let tagAdd = 'img(attrib=align,alt,height,src,title,width$proto=src,http,https,cid,data),table(attrib=border,cellspacing,cellpadding,width),span(attrib=style),p(attrib=style)';
    let domainName = 'onbmc-s,drivespark.com';

    const EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    beforeAll(async () => {
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
        await loginPage.login("qtao");
        await apiHelper.apiLogin('tadmin');
        emailGuid = await apiHelper.createEmailConfiguration();
        incomingGUID=emailGuid.incomingMailGUID;
        outgoingGUID=emailGuid.outGoingMailGUID;
        emailconfigGUID=emailGuid.emailConfigurationEmailGUID;       
    });

    afterAll(async () => {
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteIncomingOrOutgoingEmailConfiguration(incomingGUID);
        await apiHelper.deleteIncomingOrOutgoingEmailConfiguration(outgoingGUID);
        await apiHelper.deleteEmailConfiguration(emailconfigGUID);
        await navigationPage.signOut();
    });

    afterEach(async () => {
        await browser.refresh();
    });

    //kgaikwad
    it('[DRDMV-8377]: UI validation Email Option via Create New Case', async () => {
        await navigationPage.gotoCaseConsole();
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseData =
        {
            "Requester": "qtao",
            "Summary": "Test case for DRDMV-8377RandVal" + summary,
            "Support Group": "Compensation and Benefits",
            "Assignee": "qkatawazi"
        }
        await apiHelper.apiLogin('qkatawazi');
        let newCase = await apiHelper.createCase(caseData);
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
        await composeMail.closeComposeEmail();
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
        await composeMail.closeComposeEmail();
    });

    //kgaikwad
    it('[DRDMV-8391]: Negative:Compose email discard changes validation', async () => {
        await navigationPage.gotoCaseConsole();
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseData =
        {
            "Requester": "qtao",
            "Summary": "Test case for DRDMV-8377RandVal" + summary,
            "Support Group": "Compensation and Benefits",
            "Assignee": "qkatawazi"
        }
        await apiHelper.apiLogin('qkatawazi');
        let newCase = await apiHelper.createCase(caseData);
        let caseId: string = newCase.displayId;
        await caseConsole.searchAndOpenCase(caseId);
        expect(await viewCasePo.isEmailLinkPresent()).toBeTruthy('Email Link is missing');
        await viewCasePo.clickOnEmailLink();
        await composeMail.clickOnDiscardButton();
        expect(await composeMail.getTextOfDiscardButtonWarningMessage()).toBe('Email not sent. Do you want to continue?'), 'Warning Email message is missing';
    });

    //kgaikwad
    it('[DRDMV-10453]: Email Template grid columns', async () => {
        await navigationPage.gotoCaseConsole();
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseData =
        {
            "Requester": "qtao",
            "Summary": "Test case for DRDMV-8377RandVal" + summary,
            "Support Group": "Compensation and Benefits",
            "Assignee": "qkatawazi"
        }
        await apiHelper.apiLogin('qkatawazi');
        let newCase = await apiHelper.createCase(caseData);
        let caseId: string = newCase.displayId;
        await caseConsole.searchAndOpenCase(caseId);
        expect(await viewCasePo.isEmailLinkPresent()).toBeTruthy('Email Link is missing');
        await viewCasePo.clickOnEmailLink();
        await composeMail.clickOnSelectEmailTemplateLink();
        let columnHeaders: string[] = ["Template Name", "Message Subject", "Locale"];
        expect(await selectEmailTemplateBladePo.areColumnHeaderMatches(columnHeaders)).toBeTruthy('wrong column headers');
    });

    //kgaikwad
    it('[DRDMV-10390]: Visible Columns on Email Template Grid on Compose Email UI', async () => {
        await navigationPage.gotoCaseConsole();
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseData =
        {
            "Requester": "qtao",
            "Summary": "Test case for DRDMV-8377RandVal" + summary,
            "Support Group": "Compensation and Benefits",
            "Assignee": "qkatawazi"
        }
        await apiHelper.apiLogin('qkatawazi');
        let newCase = await apiHelper.createCase(caseData);
        let caseId: string = newCase.displayId;
        await caseConsole.searchAndOpenCase(caseId);
        expect(await viewCasePo.isEmailLinkPresent()).toBeTruthy('Email Link is missing');
        await viewCasePo.clickOnEmailLink();
        await composeMail.clickOnSelectEmailTemplateLink();
        await utilCommon.waitUntilSpinnerToHide();
        let columns: string[] = ["ID", "Display ID", "Company", "Description", "Label", "Template Id",];
        await selectEmailTemplateBladePo.addGridColumn(columns);
        let columnHeaders: string[] = ["Template Name", "Message Subject", "Locale", "ID", "Display ID", "Company", "Description", "Label", "Template Id"];
        expect(await selectEmailTemplateBladePo.areColumnHeaderMatches(columnHeaders)).toBeTruthy('wrong column headers');
        await selectEmailTemplateBladePo.removeGridColumn(columns);
    });

    //kgaikwad
    it('[DRDMV-10409]: Apply button disable', async () => {
        await navigationPage.gotoCaseConsole();
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseData =
        {
            "Requester": "qtao",
            "Summary": "Test case for DRDMV-8377RandVal" + summary,
            "Support Group": "Compensation and Benefits",
            "Assignee": "qkatawazi"
        }
        await apiHelper.apiLogin('qkatawazi');
        let newCase = await apiHelper.createCase(caseData);
        let caseId: string = newCase.displayId;
        await caseConsole.searchAndOpenCase(caseId);
        expect(await viewCasePo.isEmailLinkPresent()).toBeTruthy('Email Link is missing');
        await viewCasePo.clickOnEmailLink();
        await composeMail.clickOnSelectEmailTemplateLink();
        await utilCommon.waitUntilSpinnerToHide();
        expect(selectEmailTemplateBladePo.isApplyButtonEnabled()).toBeFalsy('Apply button is clickable');
    });

    //kgaikwad
    it('[DRDMV-10394,DRDMV-10397]: Apply Email Template', async () => {
        await navigationPage.gotoCaseConsole();
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await apiHelper.apiLogin('qkatawazi');
        let emailTemplateName: string = await emailTemplateData['emailTemplateWithMandatoryField'].TemplateName + summary;
        emailTemplateData['emailTemplateWithMandatoryField'].TemplateName = emailTemplateName;
        await apiHelper.createEmailTemplate(emailTemplateData['emailTemplateWithMandatoryField']);
        let caseData =
        {
            "Requester": "qtao",
            "Summary": "Test case for DRDMV-10394 RandVal" + summary,
            "Support Group": "Compensation and Benefits",
            "Assignee": "qkatawazi"
        }
        await apiHelper.apiLogin('qtao');
        let newCase = await apiHelper.createCase(caseData);
        let caseId: string = newCase.displayId;
        await utilGrid.clearFilter();
        await caseConsole.searchAndOpenCase(caseId);
        expect(await viewCasePo.isEmailLinkPresent()).toBeTruthy('Email Link is missing');
        await viewCasePo.clickOnEmailLink();
        await composeMail.clickOnSelectEmailTemplateLink();
        await utilCommon.waitUntilSpinnerToHide();
        await emailTemplateBladePo.searchAndSelectEmailTemplate(emailTemplateName);
        await emailTemplateBladePo.clickOnApplyButton();
        await composeMail.setToOrCCInputTetxbox('To', 'fritz.schulz@petramco.com');
        expect(await composeMail.getEmailBody()).toContain('Hi Team ,\n\nI am taking leave today.\n\nThanks.');
        expect(await composeMail.getSubject()).toContain(caseId);
        expect(await composeMail.getSubjectInputValue()).toContain('Leave summary');
        await composeMail.clickOnSendButton();
        expect(await activityTabPo.getemailContent()).toContain('Qianru Tao sent an email');
        expect(await activityTabPo.getemailContent()).toContain(emailTemplateName);
        expect(await activityTabPo.getemailContent()).toContain('TO: Fritz Schulz');
        expect(await activityTabPo.getemailContent()).toContain(caseId + ':' + 'Leave summary');
        await activityTabPo.clickShowMoreForEmailActivity();
        expect(await activityTabPo.getemailContent()).toContain('I am taking leave today.');
    });

    //kgaikwad
    it('[DRDMV-10401,DRDMV-10393]: Email Body override with template details', async () => {
        await navigationPage.gotoCaseConsole();
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await apiHelper.apiLogin('qkatawazi');
        let emailTemplateName: string = await emailTemplateData['emailTemplateWithMandatoryField'].TemplateName + summary;
        emailTemplateData['emailTemplateWithMandatoryField'].TemplateName = emailTemplateName;
        await apiHelper.createEmailTemplate(emailTemplateData['emailTemplateWithMandatoryField']);
        let caseData =
        {
            "Requester": "qtao",
            "Summary": "Test case for DRDMV-10401 RandVal" + summary,
            "Support Group": "Compensation and Benefits",
            "Assignee": "qkatawazi"
        }
        await apiHelper.apiLogin('qtao');
        let newCase = await apiHelper.createCase(caseData);
        let caseId: string = newCase.displayId;
        await utilGrid.clearFilter();
        await caseConsole.searchAndOpenCase(caseId);
        expect(await viewCasePo.isEmailLinkPresent()).toBeTruthy('Email Link is missing');
        await viewCasePo.clickOnEmailLink();
        expect(await composeMail.getSubject()).toContain(caseId);//part of DRDMV-10393
        //Below lines are commented as signature has been removed Feature: DRDMV-19708
        // await expect(await composeMail.getEmailBody()).toContain('Regards');
        // await expect(await composeMail.getEmailBody()).toContain('Qianru Tao');
        // await expect(await composeMail.getEmailBody()).toContain('qtao@petramco.com');
        await composeMail.clickOnSelectEmailTemplateLink();
        await utilCommon.waitUntilSpinnerToHide();
        await emailTemplateBladePo.searchAndSelectEmailTemplate(emailTemplateName);
        await emailTemplateBladePo.clickOnApplyButton();
        await composeMail.setToOrCCInputTetxbox('To', 'fritz.schulz@petramco.com');
        expect(await composeMail.getEmailBody()).toContain('Hi Team ,\n\nI am taking leave today.\n\nThanks.');
        expect(await composeMail.getSubject()).toContain(caseId); ////part of DRDMV-10393
        expect(await composeMail.getSubjectInputValue()).toContain('Leave summary');
        expect((await composeMail.isTextPresentInEmailBody('qtao@petramco.com'))).toBeFalsy();
        expect((await composeMail.isTextPresentInEmailBody('Qianru Tao'))).toBeFalsy();
        await composeMail.clickOnSendButton();
    });

    //ptidke
    it('[DRDMV-10398,DRDMV-10396,DRDMV-10402]:Email Template List Update in case compose email', async () => {
        await navigationPage.gotoCaseConsole();
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await apiHelper.apiLogin('qkatawazi');
        let emailTemplateName: string = await emailTemplateData['emailTemplateWithMandatoryField'].TemplateName + summary;
        emailTemplateData['emailTemplateWithMandatoryField'].TemplateName = emailTemplateName;
        await apiHelper.createEmailTemplate(emailTemplateData['emailTemplateWithMandatoryField']);
        let caseData =
        {
            "Requester": "qtao",
            "Summary": "Test case for DRDMV-10398 RandVal" + summary,
            "Support Group": "Compensation and Benefits",
            "Assignee": "qkatawazi"
        }
        await apiHelper.apiLogin('qtao');
        let newCase = await apiHelper.createCase(caseData);
        let caseId: string = newCase.displayId;
        await utilGrid.clearFilter();
        await caseConsole.searchAndOpenCase(caseId);
        expect(await viewCasePo.isEmailLinkPresent()).toBeTruthy('Email Link is missing');
        await viewCasePo.clickOnRequestersEmail();
        await composeMail.clickOnSelectEmailTemplateLink();
        //await utilCommon.waitUntilSpinnerToHide();
        await emailTemplateBladePo.searchAndSelectEmailTemplate(emailTemplateName);
        await emailTemplateBladePo.clickOnApplyButton();
        await composeMail.setToOrCCInputTetxbox('To', 'fritz.schulz@petramco.com');
        expect(await composeMail.getEmailBody()).toContain('Hi Team ,\n\nI am taking leave today.\n\nThanks.');
        expect(await composeMail.getSubject()).toContain(caseId);
        expect(await composeMail.getSubjectInputValue()).toContain('Leave summary');
        expect(await composeMail.getEmailTemplateNameHeading()).toContain(emailTemplateName);
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteEmailOrNotificationTemplate(emailTemplateName);
        await composeMail.clickOnSelectEmailTemplateLink();
        await utilCommon.waitUntilSpinnerToHide();
        await utilGrid.searchRecord(emailTemplateName);
        expect(await emailTemplateBladePo.isEmailTemplateGridEmpty(emailTemplateName)).toBeFalsy('Email template grid is not empty');
        await emailTemplateBladePo.clickOnCancelButton();
        await composeMail.clickOnSendButton();
    });

    //kgaikwad
    it('[DRDMV-10395]: Email template Update', async () => {
        await navigationPage.gotoCaseConsole();
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await apiHelper.apiLogin('qkatawazi');
        let emailTemplate1: string = await emailTemplateData['emailTemplateWithMandatoryField'].TemplateName + summary;
        emailTemplateData['emailTemplateWithMandatoryField'].TemplateName = emailTemplate1;
        await apiHelper.createEmailTemplate(emailTemplateData['emailTemplateWithMandatoryField']);
        let emailTemplate2: string = await emailTemplateData['emailTemplateForSalary'].TemplateName + summary;
        emailTemplateData['emailTemplateForSalary'].TemplateName = emailTemplate2;
        await apiHelper.createEmailTemplate(emailTemplateData['emailTemplateForSalary']);
        let caseData = {
            "Requester": "qtao",
            "Summary": "Test case for DRDMV-10395 RandVal" + summary,
            "Support Group": "Compensation and Benefits",
            "Assignee": "qkatawazi"
        };
        await apiHelper.apiLogin('qtao');
        let newCase = await apiHelper.createCase(caseData);
        let caseId: string = newCase.displayId;
        await utilGrid.clearFilter();
        await caseConsole.searchAndOpenCase(caseId);
        await viewCasePo.clickOnEmailLink();
        await composeMail.clickOnSelectEmailTemplateLink();
        await utilCommon.waitUntilSpinnerToHide();
        await emailTemplateBladePo.searchAndSelectEmailTemplate(emailTemplate1);
        await emailTemplateBladePo.clickOnApplyButton();
        await composeMail.setToOrCCInputTetxbox('To', 'fritz.schulz@petramco.com');
        expect(await composeMail.getEmailBody()).toContain('I am taking leave today.', 'Email Body 1 does not match');
        expect(await composeMail.getSubject()).toContain(caseId);
        expect(await composeMail.getSubjectInputValue()).toContain('Leave summary', 'Subject value 1 does not match');
        expect(await composeMail.getEmailTemplateNameHeading()).toContain(emailTemplate1, 'email Template Name 1 does not match');
        await composeMail.clickOnSelectEmailTemplateLink();
        await utilCommon.waitUntilSpinnerToHide();
        await emailTemplateBladePo.searchAndSelectEmailTemplate(emailTemplate2);
        await emailTemplateBladePo.clickOnApplyButton();
        expect(await composeMail.getEmailBody()).toContain('I have checked my salary.', 'Email Body 2 does not match');
        expect(await composeMail.getSubject()).toContain(caseId);
        expect(await composeMail.getSubjectInputValue()).toContain('Salary summary', 'Subject 2 does not match');
        expect(await composeMail.getEmailTemplateNameHeading()).toContain(emailTemplate2, 'Email Template name heading does not match');
        await composeMail.clickOnSendButton();
    });

    //kgaikwad
    it('[DRDMV-8392,DRDMV-10384]: Negative: In Email "To" and "cc" should be user from Foundation data ', async () => {
        await navigationPage.gotoCaseConsole();
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseData =
        {
            "Requester": "qtao",
            "Summary": "Test case for DRDMV-8392 RandVal" + summary,
            "Support Group": "Compensation and Benefits",
            "Assignee": "qkatawazi"
        }
        await apiHelper.apiLogin('qtao');
        let newCase = await apiHelper.createCase(caseData);
        let caseId: string = newCase.displayId;
        await utilGrid.clearFilter();
        await caseConsole.searchAndOpenCase(caseId);
        expect(await viewCasePo.isEmailLinkPresent()).toBeTruthy('Email Link is missing');
        await viewCasePo.clickOnEmailLink();
        await composeMail.isSelectEmailTemplateButtonPresent();
        await utilCommon.waitUntilSpinnerToHide();
        expect(await composeMail.isUserPopulatedInToOrCc('To', 'xyxd')).toBeFalsy();
        await composeMail.setToOrCCInputTetxbox('To', 'fritz.schulz@petramco.com');
        expect(await composeMail.getToEmailPerson()).toContain('Fritz Schulz');
        expect(await composeMail.isUserPopulatedInToOrCc('Cc', 'xyxd')).toBeFalsy();
        await composeMail.setToOrCCInputTetxbox('Cc', 'fritz.schulz@petramco.com');
        expect(await composeMail.getCcEmailPerson()).toContain('Fritz Schulz');
        await composeMail.clickOnDiscardButton();
        expect(await composeMail.getTextOfDiscardButtonWarningMessage()).toBe('Email not sent. Do you want to continue?'), 'Warning Email message is missing';
        await utilCommon.clickOnWarningOk();
    });

    it('[DRDMV-20365,DRDMV-20366]: Verify Able to insert table,hyperlink, images (All images) and Copy paste images in compose email and its send successfully', async () => {
        try {
            await navigationPage.gotoCaseConsole();
            let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let caseData =
            {
                "Requester": "qtao",
                "Summary": "Test case for DRDMV-20365 RandVal" + summary,
                "Support Group": "Compensation and Benefits",
                "Assignee": "qkatawazi"
            }
            await apiHelper.apiLogin('fritz');
            let newCase = await apiHelper.createCase(caseData);
            await utilGrid.clearFilter();
            await caseConsole.searchAndOpenCase(newCase.displayId);
            await viewCasePo.clickOnEmailLink();
            await composeMail.setEmailBody('new execution');
            await composeMail.clickOnImageIcon();
            let sourceValue = await imagePropertiesPo.addImageOnEmail('Upload', '../../../data/ui/attachment/articleStatus.png', 2, 0);
            await composeMail.setEmailBody("This is Uploaded Image");
            await composeMail.clickOnImageIcon();
            await imagePropertiesPo.setInputBoxValue(uploadURL, 9);
            await imagePropertiesPo.setInputBoxValue('200', 11);
            await imagePropertiesPo.clickOnOkButton();
            await composeMail.setEmailBody("this is new ");
            await composeMail.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('Google', displayText);
            await linkPropertiesPo.setValueOfLinkProperties('www.google.com', URL);
            await linkPropertiesPo.clickOnTargetTab();
            await linkPropertiesPo.selectDropDown('_blank', target);
            await linkPropertiesPo.clickOnOkBtn(0);
            await composeMail.setEmailBody("");
            await composeMail.clickOnTableIcon();
            await tablePropertiesPo.setValueOfTableProperties('4', row);
            await tablePropertiesPo.setValueOfTableProperties('10', column);
            await tablePropertiesPo.setValueOfTableProperties('500', width);
            await tablePropertiesPo.setValueOfTableProperties('200', height);
            await tablePropertiesPo.setValueOfTableProperties('new' + randomStr, cellCaption);
            await tablePropertiesPo.setValueOfTableProperties('tableSummary', cellSummary);
            await tablePropertiesPo.clickOnOkButton();
            //bold
            await composeMail.clickInTableRow(0, 'tableSummary');
            await composeMail.clickOnBoldIcon();
            await composeMail.setDataInTable(0, 'FritstBold', 'tableSummary');
            //italic
            await composeMail.clickInTableRow(1, 'tableSummary');
            await composeMail.clickOnItalicIcon();
            await composeMail.setDataInTable(1, 'FritstItalic', 'tableSummary');
            //underline
            await composeMail.clickInTableRow(2, 'tableSummary');
            await composeMail.clickOnUnderLineIcon();
            await composeMail.setDataInTable(2, 'FritstUnderLine', 'tableSummary');
            //left Align
            await composeMail.clickInTableRow(3, 'tableSummary');
            await composeMail.clickOnLeftAlignIcon();
            await composeMail.setDataInTable(3, 'FritstLeftAlign', 'tableSummary');
            //Right Align
            await composeMail.clickInTableRow(4, 'tableSummary');
            await composeMail.clickOnRightAlignIcon();
            await composeMail.setDataInTable(4, 'FritstRightAlign', 'tableSummary');
            //Center Align
            await composeMail.clickInTableRow(5, 'tableSummary');
            await composeMail.clickOnCenterAlignIcon();
            await composeMail.setDataInTable(5, 'FritstCenterAlign', 'tableSummary');
            //set color
            await composeMail.clickInTableRow(6, 'tableSummary');
            await composeMail.selectColor('Bright Blue');
            await composeMail.setDataInTable(6, 'SettingColor', 'tableSummary');
            //set font
            await composeMail.clickInTableRow(7, 'tableSummary');
            await composeMail.clickOnFontSizeIcon();
            await composeMail.selectFontTypeOrSize('18');
            await composeMail.setDataInTable(7, 'SettingFontSize', 'tableSummary');
            //set fontType
            await composeMail.clickInTableRow(8, 'tableSummary');
            await composeMail.clickOnFontTypeIcon();
            await composeMail.selectFontTypeOrSize('Courier New');
            await composeMail.setDataInTable(8, 'SettingFontType', 'tableSummary');
            await composeMail.setEmailBody("");
            //checking number and bullot points and setting values for them
            await composeMail.setBulletPointAndNumer('PlusOne');
            await composeMail.setBulletPointAndNumer('PlusTwo');
            await composeMail.setBulletPointAndNumer('PlusThree');
            await composeMail.setToOrCCInputTetxbox('To', 'fritz.schulz@petramco.com');
            await composeMail.clickOnSendButton();
            //activity verify
            await activityTabPo.clickOnShowMore();
            //defect/https://jira.bmc.com/browse/DRDMV-20526
            expect(await activityTabPo.isImageDisplayedInActivity(sourceValue)).toBeTruthy('Image is not displayed');
            expect(await activityTabPo.isImageDisplayedInActivity(uploadURL)).toBeTruthy('Image is not displayed');
            expect(await activityTabPo.isLinkDisplayedInActivity('http://www.google.com')).toBeTruthy('Link is not displayed');
            expect(await activityTabPo.getTextOfTD('tableSummary', 'strong')).toContain('FritstBold');
            expect(await activityTabPo.getTextOfTD('tableSummary', 'em')).toContain('FritstItalic');
            expect(await activityTabPo.getTextOfTD('tableSummary', 'u')).toContain('FritstUnderLine');
            expect(await activityTabPo.getTextOfAlignment('text-align: center;')).toContain('FritstCenterAlign');
            expect(await activityTabPo.getTextOfAlignment('text-align: right;')).toContain('FritstRightAlign');
            expect(await activityTabPo.getColorOrFontOfText('font-family:Courier New,Courier,monospace;')).toContain('SettingFontType');
            expect(await activityTabPo.getColorOrFontOfText('font-size:18px;')).toContain('SettingFontSize');
            await activityTabPo.clickOnHyperlink('http://www.google.com');
            await utilCommon.switchToNewWidnow(1);
            expect(await browser.getTitle()).toContain('Google');
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await activityTabPo.clickOnReplyAll();
            expect(await composeMail.isImageDisplayedComposeEmail(uploadURL)).toBeTruthy('Image is not displayed');
            expect(await composeMail.isLinkDisplayedComposeEmail('http://www.google.com')).toBeTruthy('Image is not displayed');
            expect(await composeMail.getColorOrFontOfTextComposeEmail('font-family:Courier New,Courier,monospace;')).toContain('SettingFontType');
            expect(await composeMail.getColorOrFontOfTextComposeEmail('font-size:18px;')).toContain('SettingFontSize');
            await composeMail.setEmailBody("");
            await composeMail.clickOnImageIcon();
            let sourceValue2 = await imagePropertiesPo.addImageOnEmail('Upload', '../../../data/ui/attachment/articleStatus.png', 2, 0);
            expect(await composeMail.isImageDisplayedComposeEmail(sourceValue2)).toBeTruthy('Image is not displayed');
            await composeMail.clickOnSendButton();
            expect(await activityTabPo.isImageDisplayedInActivity(sourceValue2)).toBeTruthy('Image is not displayed');
        } catch (e) {
            throw (e);
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qtao');
        }
    }, 500 * 1000);

    it('[DRDMV-20369]: Verify able to apply email template with images tables and hyperlinks ', async () => {
        try {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            let recDeleted = await apiHelper.deleteDynamicFieldAndGroup();
            console.log("Record deleted...", recDeleted);
            let caseTemplateName = 'caseTempRDMV-20369lp3ir' + randomStr;
            let caseTemaplateSummary = 'caseTempRDMV-20369Template' + randomStr;
            var casetemplateData = {
                "templateName": `${caseTemplateName}`,
                "templateSummary": `${caseTemaplateSummary}`,
                "templateStatus": "Active",
            }
            await apiHelper.apiLogin('fritz');
            var newCaseTemplate = await apiHelper.createCaseTemplate(casetemplateData);
            await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'CASE_TEMPLATE_WITH_CONFIDENTIAL');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Templates', 'Email Template Console - Business Workflows');
            await consoleEmailTemplatePo.clickOnAddEmailTemplateButton();
            await createEmailTemplatePo.setTemplateName("templateName" + randomStr);
            console.log("templateName" + randomStr);
            await createEmailTemplatePo.selectCompany('Petramco');
            await createEmailTemplatePo.selectStatusDropDown('Active');
            await createEmailTemplatePo.setDescription(randomStr);
            await createEmailTemplatePo.setSubject("templateRandomStr" + randomStr);
            //adding dynamic fields
            await createEmailTemplatePo.setBody('');
            await composeMail.clickOnImageIcon();
            let sourceValue1 = await imagePropertiesPo.addImageOnEmail('Upload', '../../../data/ui/attachment/articleStatus.png', 2, 0);
            //upload images via URL
            await composeMail.clickOnImageIcon();
            await imagePropertiesPo.setInputBoxValue(uploadURL, 0);
            await imagePropertiesPo.setInputBoxValue('200', 2);
            await imagePropertiesPo.clickOnOkButton();
            await composeMail.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('Google', 14);
            await linkPropertiesPo.setValueOfLinkProperties('www.google.com', 15);
            await linkPropertiesPo.clickOnTargetTab();
            await linkPropertiesPo.selectDropDown('_blank', 7);
            await linkPropertiesPo.clickOnOkBtn(1);
            await createEmailTemplatePo.setBody('');
            await createEmailTemplatePo.setBody(' Empty New things');
            await composeMail.clickOnTableIcon();
            await tablePropertiesPo.setValueOfTableProperties('4', row);
            await tablePropertiesPo.setValueOfTableProperties('3', column);
            await tablePropertiesPo.setValueOfTableProperties('500', width);
            await tablePropertiesPo.setValueOfTableProperties('200', height);
            await tablePropertiesPo.setValueOfTableProperties('new' + randomStr, cellCaption);
            await tablePropertiesPo.setValueOfTableProperties('tableEmail', cellSummary);
            await linkPropertiesPo.clickOnOkBtn(2);
            //bold
            await createEmailTemplatePo.clickInTableRowOfEmailTemplate(0, 'tableEmail');
            await createEmailTemplatePo.clickOnInsertField();
            await addFieldsPopPo.clickOnCase();
            await addFieldsPopPo.selectDynamicField('Assignee');
            await addFieldsPopPo.clickOnOkButtonOfEditor();
            await createEmailTemplatePo.clickInTableRowOfEmailTemplate(1, 'tableEmail');
            await createEmailTemplatePo.clickOnInsertField();
            await addFieldsPopPo.navigateToDynamicFieldInCaseTemplate(caseTemplateName);
            await addFieldsPopPo.selectDynamicField('OuterNonConfidential');
            await addFieldsPopPo.clickOnOkButtonOfEditor();
            //bold
            await createEmailTemplatePo.clickInTableRowOfEmailTemplate(2, 'tableEmail');
            await composeMail.clickOnBoldIcon();
            await createEmailTemplatePo.setDataInEmailTemplateTable(2, 'FritstBold', 'tableEmail');
            //italic
            await createEmailTemplatePo.clickInTableRowOfEmailTemplate(3, 'tableEmail');
            await composeMail.clickOnItalicIcon();
            await createEmailTemplatePo.setDataInEmailTemplateTable(3, 'FritstItalic', 'tableEmail');
            //underline
            await createEmailTemplatePo.clickInTableRowOfEmailTemplate(4, 'tableEmail');
            await composeMail.clickOnUnderLineIcon();
            await createEmailTemplatePo.setDataInEmailTemplateTable(4, 'FritstUnderLine', 'tableEmail');
            //left Align
            await createEmailTemplatePo.clickInTableRowOfEmailTemplate(5, 'tableEmail');
            await composeMail.clickOnLeftAlignIcon();
            await createEmailTemplatePo.setDataInEmailTemplateTable(5, 'FritstLeftAlign', 'tableEmail');
            //Right Align
            await createEmailTemplatePo.clickInTableRowOfEmailTemplate(6, 'tableEmail');
            await composeMail.clickOnRightAlignIcon();
            await createEmailTemplatePo.setDataInEmailTemplateTable(6, 'FritstRightAlign', 'tableEmail');
            //Center Align
            await createEmailTemplatePo.clickInTableRowOfEmailTemplate(7, 'tableEmail');
            await composeMail.clickOnCenterAlignIcon();
            await createEmailTemplatePo.setDataInEmailTemplateTable(7, 'FritstCenterAlign', 'tableEmail');
            //set color
            await createEmailTemplatePo.clickInTableRowOfEmailTemplate(8, 'tableEmail');
            await composeMail.selectColor('Bright Blue');
            await createEmailTemplatePo.setDataInEmailTemplateTable(8, 'SettingColor', 'tableEmail');
            //set font
            await createEmailTemplatePo.clickInTableRowOfEmailTemplate(9, 'tableEmail');
            await composeMail.clickOnFontSizeIcon();
            await composeMail.selectFontTypeOrSize('18');
            await createEmailTemplatePo.setDataInEmailTemplateTable(9, 'SettingFontSize', 'tableEmail');
            await createEmailTemplatePo.setBody('');
            await createEmailTemplatePo.clickOnSaveButton();
            await navigationPage.gotoCaseConsole();
            let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let caseData =
            {
                "Requester": "qtao",
                "Summary": "Test case for DRDMV-20365 RandVal" + summary,
                "Support Group": "Compensation and Benefits",
                "Assignee": "qkatawazi"
            }
            await apiHelper.apiLogin('fritz');
            let newCase = await apiHelper.createCase(caseData);
            await utilGrid.clearFilter();
            await caseConsole.searchAndOpenCase(newCase.displayId);
            expect(await viewCasePo.isEmailLinkPresent()).toBeTruthy('Email Link is missing');
            await viewCasePo.clickOnEmailLink();
            await composeMail.setToOrCCInputTetxbox('To', 'fritz.schulz@petramco.com');
            await composeMail.clickOnSelectEmailTemplateLink();
            await emailTemplateBladePo.searchAndSelectEmailTemplate("templateName" + randomStr);
            await emailTemplateBladePo.clickOnApplyButton();
            expect(await composeMail.getEmailTemplateNameHeading()).toContain("templateName" + randomStr);
            await composeMail.setEmailBody('this is newly added text');
            await composeMail.clickOnSendButton();
            await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.getFirstPostContent()).toContain('Fritz Schulz sent an email', 'not');
            expect(await activityTabPo.isLinkDisplayedInActivity('http://www.google.com')).toBeTruthy('Link is not displayed');
            expect(await activityTabPo.getTextOfTD('tableEmail', 'strong')).toContain('FritstBold');
            expect(await activityTabPo.getTextOfTD('tableEmail', 'em')).toContain('FritstItalic');
            expect(await activityTabPo.getTextOfTD('tableEmail', 'u')).toContain('FritstUnderLine');
            expect(await activityTabPo.getTextOfAlignment('text-align: center;')).toContain('FritstCenterAlign');
            expect(await activityTabPo.getTextOfAlignment('text-align: right;')).toContain('FritstRightAlign');
            expect(await activityTabPo.getColorOrFontOfText('font-size:18px;')).toContain('SettingFontSize');
            expect(await activityTabPo.isImageDisplayedInActivity(sourceValue1)).toBeTruthy('Image is not displayed');
        } catch (e) {
            throw (e);
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qtao');
        }
    }, 180 * 1000);

    it('[DRDMV-20368,DRDMV-20371]: Verify Able to insert table,hyperlink, images and Copy paste images in Notification template and notifications received by user with these contents', async () => {
        try {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, notifTempGridPageTitle);
            await utilGrid.clearFilter();
            await utilGrid.searchAndSelectGridRecord('Case Status Change');
            await consoleNotificationTemplatePo.clickCopyTmplate();
            await copyNotificationTemplatePo.setCompanyValue('Petramco');
            await copyNotificationTemplatePo.clickOnCreateCopyButton();
            await editNotificationTemplatePo.clickOnEmailTab();
            await editNotificationTemplatePo.selectCheckBoxOfBody();
            await editNotificationTemplatePo.clickOnEditButtonOfEmailTab();
            await editMessageTextBladePo.setMessageBody('new');
            await composeMail.clickOnImageIcon();
            await imagePropertiesPo.addImageOnEmail('Upload', '../../../data/ui/attachment/articleStatus.png', 2, 0);
            await editMessageTextBladePo.setMessageBody('');
            await editMessageTextBladePo.setMessageBody('this is link');
            await composeMail.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('Google', 14);
            await linkPropertiesPo.setValueOfLinkProperties('www.google.com', 15);
            await linkPropertiesPo.clickOnTargetTab();
            await linkPropertiesPo.selectDropDown('_blank', 7);
            await linkPropertiesPo.clickOnOkBtn(1);
            await editMessageTextBladePo.setMessageBody('');
            await editMessageTextBladePo.setMessageBody('this is link');
            await composeMail.clickOnTableIcon();
            await tablePropertiesPo.setValueOfTableProperties('4', row);
            await tablePropertiesPo.setValueOfTableProperties('3', column);
            await tablePropertiesPo.setValueOfTableProperties('500', width);
            await tablePropertiesPo.setValueOfTableProperties('200', height);
            await tablePropertiesPo.setValueOfTableProperties('new' + randomStr, cellCaption);
            await tablePropertiesPo.setValueOfTableProperties('NotiFicationT', cellSummary);
            await linkPropertiesPo.clickOnOkBtn(2);
            //bold
            await createEmailTemplatePo.clickInTableRowOfEmailTemplate(0, 'NotiFicationT');
            await composeMail.clickOnBoldIcon();
            await createEmailTemplatePo.setDataInEmailTemplateTable(0, 'FritstBold', 'NotiFicationT');
            //italic
            await createEmailTemplatePo.clickInTableRowOfEmailTemplate(3, 'NotiFicationT');
            await composeMail.clickOnItalicIcon();
            await createEmailTemplatePo.setDataInEmailTemplateTable(3, 'FritstItalic', 'NotiFicationT');
            //underline
            await createEmailTemplatePo.clickInTableRowOfEmailTemplate(4, 'NotiFicationT');
            await composeMail.clickOnUnderLineIcon();
            await createEmailTemplatePo.setDataInEmailTemplateTable(4, 'FritstUnderLine', 'NotiFicationT');
            //left Align
            await createEmailTemplatePo.clickInTableRowOfEmailTemplate(5, 'NotiFicationT');
            await composeMail.clickOnLeftAlignIcon();
            await createEmailTemplatePo.setDataInEmailTemplateTable(5, 'FritstLeftAlign', 'NotiFicationT');
            //Right Align
            await createEmailTemplatePo.clickInTableRowOfEmailTemplate(6, 'NotiFicationT');
            await composeMail.clickOnRightAlignIcon();
            await createEmailTemplatePo.setDataInEmailTemplateTable(6, 'FritstRightAlign', 'NotiFicationT');
            //Center Align
            await createEmailTemplatePo.clickInTableRowOfEmailTemplate(7, 'NotiFicationT');
            await composeMail.clickOnCenterAlignIcon();
            await createEmailTemplatePo.setDataInEmailTemplateTable(7, 'FritstCenterAlign', 'NotiFicationT');
            //set color
            await createEmailTemplatePo.clickInTableRowOfEmailTemplate(8, 'NotiFicationT');
            await composeMail.selectColor('Bright Blue');
            await createEmailTemplatePo.setDataInEmailTemplateTable(8, 'SettingColor', 'NotiFicationT');
            //set font
            await createEmailTemplatePo.clickInTableRowOfEmailTemplate(9, 'NotiFicationT');
            await composeMail.clickOnFontSizeIcon();
            await composeMail.selectFontTypeOrSize('18');
            await createEmailTemplatePo.setDataInEmailTemplateTable(9, 'SettingFontSize', 'NotiFicationT');
            await editMessageTextBladePo.setMessageBody('');
            await editMessageTextBladePo.clickOnSaveButton();
            await editNotificationTemplatePo.clickOnCancelButton();
            await apiHelper.apiLogin('tadmin');
            await apiHelper.updateEmailWhiteList(tagAdd, domainName);
            await navigationPage.gotoCaseConsole();
            let caseData =
            {
                "Requester": "qkatawazi",
                "Summary": "Test case for DRDMV-20368 RandVal" + randomStr,
                "Support Group": "Compensation and Benefits",
                "Assignee": "qkatawazi"
            }
            await apiHelper.apiLogin('fritz');
            let newCase = await apiHelper.createCase(caseData);
            await utilGrid.clearFilter();
            await caseConsole.searchAndOpenCase(newCase.displayId);
            await viewCasePo.changeCaseStatus('In Progress');
            await viewCasePo.clickSaveStatus();
            await browser.sleep(8000);
            let subject = `Fritz Schulz changed the status of '${newCase.displayId}' to In Progress`;
            await apiHelper.apiLogin('tadmin');
            let body = await apiHelper.getHTMLBodyOfEmail(subject);
            //color span
            await expect(body.includes('<td><span style="color:#3498db;">SettingColor</span></td>')).toBeTruthy('color is not available');
            //table width size attaribute
            await expect(body.includes('<table border="1" cellspacing="1" cellpadding="1">')).toBeTruthy('table properties displaying');
            //image
            await expect(body.includes('<p>new<img alt="">this is li<a>Google</a>nkthis is link</p>')).toBeFalsy('image and link tag is not displaying');
            //font 
            await expect(body.includes('<td><span style="font-size:18px;">SettingFontSize</span></td>')).toBeFalsy('alignment is not present');
            //right allign
            await expect(body.includes('<td style="text-align: right;">FritstRightAlign</td>')).toBeFalsy('alignment is not present');
            //center align
            await expect(body.includes('<td style="text-align: center;">FritstCenterAlign</td>')).toBeFalsy('alignment is not present');
            //italic
            await expect(body.includes('<td><em>FritstItalic</em></td>')).toBeFalsy('font is not present');
            //underline
            await expect(body.includes('<td><u>FritstUnderLine</u></td>')).toBeFalsy('font is not present');
            //removing tags added
            await apiHelper.apiLogin('tadmin');
            await apiHelper.updateEmailWhiteList('a', domainName);
            await navigationPage.gotoCaseConsole();
            let caseDataOne =
            {
                "Requester": "qkatawazi",
                "Summary": "Test case for DRDMV-20368 RandVal" + randomStr,
                "Support Group": "Compensation and Benefits",
                "Assignee": "qkatawazi"
            }
            await apiHelper.apiLogin('fritz');
            let newCaseOne = await apiHelper.createCase(caseDataOne);
            await utilGrid.clearFilter();
            await caseConsole.searchAndOpenCase(newCaseOne.displayId);
            await viewCasePo.changeCaseStatus('In Progress');
            await viewCasePo.clickSaveStatus();
            let subjectOne = `Fritz Schulz changed the status of '${newCaseOne.displayId}' to In Progress`;
            await apiHelper.apiLogin('tadmin');
            await browser.sleep(8000);
            let emailBody = await apiHelper.getHTMLBodyOfEmail(subjectOne);
            await expect(emailBody.includes('<p>new<img alt="">this is link<a>Google</a>this is link</p>')).toBeTruthy('Image is present in email');
            await expect(emailBody.includes('<td><span>SettingColor</span></td>')).toBeTruthy('span color is present in email');
            await expect(emailBody.includes('<table border="1" cellspacing="1" cellpadding="1">')).toBeFalsy('table border , cellspacing , cellpading displayed in email');
        } catch (e) {
            throw e;
        }
        finally {
            await apiHelper.apiLogin('fritz');
            await apiHelper.deleteEmailOrNotificationTemplate('Case Status Change','Petramco');
            await navigationPage.signOut();
            await loginPage.login("qtao");
        }
    }, 150 * 1000);

    it('[DRDMV-20370]: Verify tags which are not in white list for email', async () => {
        try {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Templates', 'Email Template Console - Business Workflows');
            await consoleEmailTemplatePo.clickOnAddEmailTemplateButton();
            await createEmailTemplatePo.setTemplateName("templateName" + randomStr);
            await createEmailTemplatePo.selectCompany('Petramco');
            await createEmailTemplatePo.selectStatusDropDown('Active');
            await createEmailTemplatePo.setDescription(randomStr);
            await createEmailTemplatePo.setSubject("templateRandomStr" + randomStr);
            //adding dynamic fields
            await createEmailTemplatePo.setBody('');
            await composeMail.clickOnImageIcon();
            await imagePropertiesPo.addImageOnEmail('Upload', '../../../data/ui/attachment/articleStatus.png', 2, 0);
            await createEmailTemplatePo.setBody('');
            await createEmailTemplatePo.setBody('new link');
            await composeMail.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('Google', 14);
            await linkPropertiesPo.setValueOfLinkProperties('www.google.com', 15);
            await linkPropertiesPo.clickOnTargetTab();
            await linkPropertiesPo.selectDropDown('_blank', 7);
            await linkPropertiesPo.clickOnOkBtn(1);
            await createEmailTemplatePo.setBody('');
            await createEmailTemplatePo.setBody('    New things');
            await composeMail.clickOnTableIcon();
            await tablePropertiesPo.setValueOfTableProperties('4', row);
            await tablePropertiesPo.setValueOfTableProperties('3', column);
            await tablePropertiesPo.setValueOfTableProperties('500', width);
            await tablePropertiesPo.setValueOfTableProperties('200', height);
            await tablePropertiesPo.setValueOfTableProperties('new' + randomStr, cellCaption);
            await tablePropertiesPo.setValueOfTableProperties('tableEmail', cellSummary);
            await linkPropertiesPo.clickOnOkBtn(2);
            //bold
            await createEmailTemplatePo.clickInTableRowOfEmailTemplate(0, 'tableEmail');
            await createEmailTemplatePo.clickOnInsertField();
            await addFieldsPopPo.clickOnCase();
            await addFieldsPopPo.selectDynamicField('Assignee');
            await addFieldsPopPo.clickOnOkButtonOfEditor();
            await createEmailTemplatePo.clickInTableRowOfEmailTemplate(1, 'tableEmail');
            //bold
            await createEmailTemplatePo.clickInTableRowOfEmailTemplate(2, 'tableEmail');
            await composeMail.clickOnBoldIcon();
            await createEmailTemplatePo.setDataInEmailTemplateTable(2, 'FritstBold', 'tableEmail');
            //italic
            await createEmailTemplatePo.clickInTableRowOfEmailTemplate(3, 'tableEmail');
            await composeMail.clickOnItalicIcon();
            await createEmailTemplatePo.setDataInEmailTemplateTable(3, 'FritstItalic', 'tableEmail');
            //underline
            await createEmailTemplatePo.clickInTableRowOfEmailTemplate(4, 'tableEmail');
            await composeMail.clickOnUnderLineIcon();
            await createEmailTemplatePo.setDataInEmailTemplateTable(4, 'FritstUnderLine', 'tableEmail');
            //left Align
            await createEmailTemplatePo.clickInTableRowOfEmailTemplate(5, 'tableEmail');
            await composeMail.clickOnLeftAlignIcon();
            await createEmailTemplatePo.setDataInEmailTemplateTable(5, 'FritstLeftAlign', 'tableEmail');
            //Right Align
            await createEmailTemplatePo.clickInTableRowOfEmailTemplate(6, 'tableEmail');
            await composeMail.clickOnRightAlignIcon();
            await createEmailTemplatePo.setDataInEmailTemplateTable(6, 'FritstRightAlign', 'tableEmail');
            //Center Align
            await createEmailTemplatePo.clickInTableRowOfEmailTemplate(7, 'tableEmail');
            await composeMail.clickOnCenterAlignIcon();
            await createEmailTemplatePo.setDataInEmailTemplateTable(7, 'FritstCenterAlign', 'tableEmail');
            //set color
            await createEmailTemplatePo.clickInTableRowOfEmailTemplate(8, 'tableEmail');
            await composeMail.selectColor('Bright Blue');
            await createEmailTemplatePo.setDataInEmailTemplateTable(8, 'SettingColor', 'tableEmail');
            //set font
            await createEmailTemplatePo.clickInTableRowOfEmailTemplate(9, 'tableEmail');
            await composeMail.clickOnFontSizeIcon();
            await composeMail.selectFontTypeOrSize('18');
            await createEmailTemplatePo.setDataInEmailTemplateTable(9, 'SettingFontSize', 'tableEmail');
            await createEmailTemplatePo.setBody('This is new test');
            await composeMail.clickOnFontSizeIcon();
            await composeMail.selectFontTypeOrSize('72');
            await createEmailTemplatePo.setFontBody('Font 72');
            await createEmailTemplatePo.setBody('Font 72');
            await createEmailTemplatePo.clickOnSaveButton();
            // adding whitelist image , table and style p tags
            await apiHelper.apiLogin('tadmin');
            await apiHelper.updateEmailWhiteList(tagAdd, domainName);
            await navigationPage.gotoCaseConsole();
            let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let caseData =
            {
                "Requester": "qtao",
                "Summary": "Test case for DRDMV-20370 RandVal" + summary,
                "Support Group": "Compensation and Benefits",
                "Assignee": "qkatawazi"
            }
            await apiHelper.apiLogin('fritz');
            let newCase = await apiHelper.createCase(caseData);
            await utilGrid.clearFilter();
            await caseConsole.searchAndOpenCase(newCase.displayId);
            expect(await viewCasePo.isEmailLinkPresent()).toBeTruthy('Email Link is missing');
            await viewCasePo.clickOnEmailLink();
            await composeMail.setToOrCCInputTetxbox('To', 'fritz.schulz@petramco.com');
            await composeMail.clickOnSelectEmailTemplateLink();
            await emailTemplateBladePo.searchAndSelectEmailTemplate("templateName" + randomStr);
            await emailTemplateBladePo.clickOnApplyButton();
            expect(await composeMail.getEmailTemplateNameHeading()).toContain("templateName" + randomStr);
            await composeMail.setEmailBody('this is newly added text');
            let newSubject = 'NewDescription' + randomStr;
            await composeMail.setSubject(newSubject);
            await composeMail.clickOnSendButton();
            await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.getFirstPostContent()).toContain('Fritz Schulz sent an email');
            await browser.sleep(8000);
            let valueOfBody: string = await apiHelper.getHTMLBodyOfEmail(newCase.displayId + ':' + newSubject);
            //color span
            await expect(valueOfBody.includes('<td><span style="color:#3498db;">SettingColor</span></td>')).toBeTruthy(1);
            //font
            await expect(valueOfBody.includes('<p>This is new test<span style="font-size:72px;">Font 72Font 72this is newly added text</span></p>')).toBeTruthy(2);
            //table width size attaribute
            await expect(valueOfBody.includes('<table border="1" cellspacing="1" cellpadding="1">')).toBeTruthy(3);
            //image
            await expect(valueOfBody.includes('<p><img alt="">new link<a>Google</a> New things</p>')).toBeFalsy(4);
            // removing tags added
            await navigationPage.gotoCaseConsole();
            let tagRemove = 'a';
            await apiHelper.updateEmailWhiteList(tagRemove, domainName);
            let caseDataOne =
            {
                "Requester": "qtao",
                "Summary": "Test casefor DRDMV-20370 " + summary,
                "Support Group": "Compensation and Benefits",
                "Assignee": "qkatawazi"
            }
            await apiHelper.apiLogin('fritz');
            let newCaseOne = await apiHelper.createCase(caseDataOne);
            await utilGrid.clearFilter();
            await caseConsole.searchAndOpenCase( newCaseOne.displayId);
            await viewCasePo.clickOnEmailLink();
            await composeMail.setToOrCCInputTetxbox('To', 'fritz.schulz@petramco.com');
            await composeMail.clickOnSelectEmailTemplateLink();
            await emailTemplateBladePo.searchAndSelectEmailTemplate("templateName" + randomStr);
            await emailTemplateBladePo.clickOnApplyButton();
            expect(await composeMail.getEmailTemplateNameHeading()).toContain("templateName" + randomStr);
            await composeMail.setEmailBody('this is newly added text');
            let newSubject1 = 'NewDescriptionsub' + randomStr;
            await composeMail.setSubject(newSubject1);
            await composeMail.clickOnSendButton();
            await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.getFirstPostContent()).toContain('Fritz Schulz sent an email');
            await browser.sleep(8000);
            let valueBody: string = await apiHelper.getHTMLBodyOfEmail( newCaseOne.displayId + ':' + newSubject1);
            await expect(valueBody.includes('<p><img alt="">new link<a>Google</a> New things</p>')).toBeTruthy('Image is present in email');
            await expect(valueBody.includes('<td><span>SettingColor</span></td> ')).toBeTruthy('span color is present in email');
            await expect(valueBody.includes('<table border="1" cellspacing="1" cellpadding="1">')).toBeFalsy('table border , cellspacing , cellpading displayed in email');
            await expect(valueBody.includes('<p>This is new test<span>Font 72Font 72this is newly added text</span></p>')).toBeTruthy('Font is displaying in email');
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qtao');
        }
    }, 300 * 1000);

    it('[DRDMV-9033]: Negative - Verify Discard button on adding attachment in Compose Email', async () => {
        await navigationPage.gotoCaseConsole();
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseData =
        {
            "Requester": "qtao",
            "Summary": "Test case for DRDMV-9033 RandVal" + summary,
            "Support Group": "Compensation and Benefits",
            "Assignee": "qkatawazi"
        }
        await apiHelper.apiLogin('qtao');
        let newCase = await apiHelper.createCase(caseData);
        await utilGrid.clearFilter();
        await caseConsole.searchAndOpenCase(newCase.displayId);
        await viewCasePo.clickOnEmailLink();
        await composeMail.addAttachment();
        expect(await composeMail.getFileDisplayedFileName()).toContain('demo.txt');
        await composeMail.clickOnDiscardButton();
        await utilCommon.clickOnWarningOk();
        expect(await activityTabPo.isFileAttachedOnActivity()).toBeFalsy('file is attached on activity');
    });

    it('[DRDMV-9028]: Send Email to requester with attachments VIA Compose Email', async () => {
        await navigationPage.gotoCaseConsole();
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseData =
        {
            "Requester": "qtao",
            "Summary": "Test case for DRDMV-9028 RandVal" + summary,
            "Support Group": "Compensation and Benefits",
            "Assignee": "qkatawazi"
        }
        await apiHelper.apiLogin('qtao');
        let newCase = await apiHelper.createCase(caseData);
        await utilGrid.clearFilter();
        await caseConsole.searchAndOpenCase(newCase.displayId);
        await viewCasePo.clickOnEmailLink();
        await composeMail.addAttachment();
        expect(await composeMail.getFileDisplayedFileName()).toContain('demo.txt');
        await composeMail.setToOrCCInputTetxbox('To', 'franz.schwarz@petramco.com');
        expect(await composeMail.getToEmailPerson()).toContain('Franz Schwarz');
        await composeMail.setToOrCCInputTetxbox('Cc', 'franz.schwarz@petramco.com');
        expect(await composeMail.getToEmailPerson()).toContain('Franz Schwarz');
        await composeMail.setEmailBody('This is email body');
        await composeMail.clickOnSendButton();
        await activityTabPo.clickShowMoreForEmailActivity();
        expect(await activityTabPo.getFirstPostContent()).toContain('This is email body');
        expect(await activityTabPo.getFirstPostContent()).toContain('Qianru Tao sent an email');
        expect(activityTabPo.isAttachedFileNameDisplayed('demo.txt')).toBeTruthy('Attached file not Present');
    });

    it('[DRDMV-9032]: Negative -Verify large number of attachments. Click on Send button in Compose Email', async () => {
        await navigationPage.gotoCaseConsole();
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseData =
        {
            "Requester": "qtao",
            "Summary": "Test case for DRDMV-9028 RandVal" + summary,
            "Support Group": "Compensation and Benefits",
            "Assignee": "qkatawazi"
        }
        await apiHelper.apiLogin('qtao');
        let newCase = await apiHelper.createCase(caseData);
        await utilGrid.clearFilter();
        await caseConsole.searchAndOpenCase(newCase.displayId);
        await viewCasePo.clickOnEmailLink();
        for (let i = 0; i <= 20; i++) {
            await composeMail.addAttachment();
        }
        await composeMail.setToOrCCInputTetxbox('To', 'franz.schwarz@petramco.com');
        await composeMail.clickOnSendButton();
        await activityTabPo.clickShowMoreForEmailActivity();
        expect(await activityTabPo.getAttachmentCount()).toBe(21);
    });
})