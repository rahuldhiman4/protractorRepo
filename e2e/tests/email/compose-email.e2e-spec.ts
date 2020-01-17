import { browser, protractor, ProtractorExpectedConditions } from "protractor";
import apiHelper from '../../api/api.helper';
import caseConsole from '../../pageobject/case/case-console.po';
import quickCase from "../../pageobject/case/quick-case.po";
import viewCasePo from '../../pageobject/case/view-case.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import composeMail from '../../pageobject/email/compose-mail.po';
import selectEmailTemplateBladePo from '../../pageobject/email/select-email-template-blade.po';
import utilCommon from "../../utils/util.common";
import utilGrid from '../../utils/util.grid';
import emailTemplateBladePo from '../../pageobject/email/select-email-template-blade.po';
import activityTabPo from '../../pageobject/social/activity-tab.po';

var emailTemplateData = require('../../data/ui/email/email.template.api.json');

describe("compose email", () => {
    const EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    beforeAll(async () => {
        browser.waitForAngularEnabled(false);
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
        await loginPage.login("qtao");
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    afterEach(async () => {
        await browser.refresh();
        await utilCommon.waitUntilSpinnerToHide();
    });

    it('DRDMV-8377: UI validation Email Option via Create New Case', async () => {
        await navigationPage.gotoCaseConsole();
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        var caseData =
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
        expect(await composeMail.getSubject()).toBe(caseId + ":  ");
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
        expect(await composeMail.getSubject()).toBe(quickCaseId + ":  ");
        expect(await composeMail.isSelectEmailTemplateLinkPresent()).toBeTruthy('SelectEmailTemplateLink is missing');
        expect(await composeMail.isMessageBodyFontPannelBarPresent()).toBeTruthy('MessageBodyFontPannelBar is missing');
        expect(await composeMail.isAttachLinkPresent()).toBeTruthy('Attach Link is  missing');
        expect(await composeMail.isSendButtonPresent()).toBeTruthy('Send Button is missing');
        expect(await composeMail.isDiscardButtonPresent()).toBeTruthy('Discard Button is missing');
        await composeMail.closeComposeEmail();
    })

    it('DRDMV-8391: Negative:Compose email discard changes validation', async () => {
        await navigationPage.gotoCaseConsole();
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        var caseData =
        {
            "Requester": "qtao",
            "Summary": "Test case for DRDMV-8377RandVal" + summary,
            "Support Group": "Compensation and Benefits",
            "Assignee": "qkatawazi"
        }
        await apiHelper.apiLogin('qkatawazi');
        var newCase = await apiHelper.createCase(caseData);
        var caseId: string = newCase.displayId;
        await caseConsole.searchAndOpenCase(caseId);
        expect(await viewCasePo.isEmailLinkPresent()).toBeTruthy('Email Link is missing');
        await viewCasePo.clickOnEmailLink();
        await composeMail.clickOnDiscardButton();
        expect(await composeMail.getTextOfDiscardButtonWarningMessage()).toBe('Email not sent. Do you want to continue?'), 'Warning Email message is missing';
    })

    it('DRDMV-10453: Email Template grid columns', async () => {
        await navigationPage.gotoCaseConsole();
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        var caseData =
        {
            "Requester": "qtao",
            "Summary": "Test case for DRDMV-8377RandVal" + summary,
            "Support Group": "Compensation and Benefits",
            "Assignee": "qkatawazi"
        }
        await apiHelper.apiLogin('qkatawazi');
        var newCase = await apiHelper.createCase(caseData);
        var caseId: string = newCase.displayId;
        await caseConsole.searchAndOpenCase(caseId);
        expect(await viewCasePo.isEmailLinkPresent()).toBeTruthy('Email Link is missing');
        await viewCasePo.clickOnEmailLink();
        await composeMail.clickOnSelectEmailTemplateLink();
        let columnHeaders: string[] = ["Template Name", "Message Subject", "Locale"];
        expect(await selectEmailTemplateBladePo.areColumnHeaderMatches(columnHeaders)).toBeTruthy('wrong column headers');
    })

    it('DRDMV-10390: Visible Columns on Email Template Grid on Compose Email UI', async () => {
        await navigationPage.gotoCaseConsole();
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        var caseData =
        {
            "Requester": "qtao",
            "Summary": "Test case for DRDMV-8377RandVal" + summary,
            "Support Group": "Compensation and Benefits",
            "Assignee": "qkatawazi"
        }
        await apiHelper.apiLogin('qkatawazi');
        var newCase = await apiHelper.createCase(caseData);
        var caseId: string = newCase.displayId;
        await caseConsole.searchAndOpenCase(caseId);
        expect(await viewCasePo.isEmailLinkPresent()).toBeTruthy('Email Link is missing');
        await viewCasePo.clickOnEmailLink();
        await composeMail.clickOnSelectEmailTemplateLink();
        await utilCommon.waitUntilSpinnerToHide();
        let columns: string[] = ["ID", "Display ID", "Company", "Description", "Label", "Template Id",];
        await selectEmailTemplateBladePo.addGridColumn(columns);
        let columnHeaders: string[] = ["Template Name", "Message Subject", "Locale", "ID", "Display ID", "Company", "Description", "Label", "Template Id"];
        expect(await selectEmailTemplateBladePo.areColumnHeaderMatches(columnHeaders)).toBeTruthy('wrong column headers');
    })

    it('DRDMV-10409: Apply button disable', async () => {
        await navigationPage.gotoCaseConsole();
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        var caseData =
        {
            "Requester": "qtao",
            "Summary": "Test case for DRDMV-8377RandVal" + summary,
            "Support Group": "Compensation and Benefits",
            "Assignee": "qkatawazi"
        }
        await apiHelper.apiLogin('qkatawazi');
        var newCase = await apiHelper.createCase(caseData);
        var caseId: string = newCase.displayId;
        await caseConsole.searchAndOpenCase(caseId);
        expect(await viewCasePo.isEmailLinkPresent()).toBeTruthy('Email Link is missing');
        await viewCasePo.clickOnEmailLink();
        await composeMail.clickOnSelectEmailTemplateLink();
        await utilCommon.waitUntilSpinnerToHide();
        expect(selectEmailTemplateBladePo.isApplyButtonEnabled()).toBeFalsy('Apply button is clickable');
    })
   
    it('DRDMV-10394,DRDMV-10397: Apply Email Template', async () => {
        await navigationPage.gotoCaseConsole();
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await apiHelper.apiLogin('qkatawazi');
        let emailTemplateName: string = await emailTemplateData['emailTemplateWithMandatoryField'].TemplateName + summary;
        emailTemplateData['emailTemplateWithMandatoryField'].TemplateName = emailTemplateName;
        await apiHelper.createEmailTemplate(emailTemplateData['emailTemplateWithMandatoryField']);
        var caseData =
        {
            "Requester": "qtao",
            "Summary": "Test case for DRDMV-10394 RandVal" + summary,
            "Support Group": "Compensation and Benefits",
            "Assignee": "qkatawazi"
        }
        await apiHelper.apiLogin('qtao');
        var newCase = await apiHelper.createCase(caseData);
        var caseId: string = newCase.displayId;
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
        expect(await activityTabPo.getemailContent()).toContain('To: Fritz Schulz');
        expect(await activityTabPo.getemailContent()).toContain(caseId+ ':'+'Leave summary');
        expect(await activityTabPo.getemailContent()).toContain('I am taking leave today.');
    }),
    
    it('DRDMV-10401,DRDMV-10393: Email Body override with template details', async () => {
        await navigationPage.gotoCaseConsole();
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await apiHelper.apiLogin('qkatawazi');
        let emailTemplateName: string = await emailTemplateData['emailTemplateWithMandatoryField'].TemplateName + summary;
        emailTemplateData['emailTemplateWithMandatoryField'].TemplateName = emailTemplateName;
        await apiHelper.createEmailTemplate(emailTemplateData['emailTemplateWithMandatoryField']);
        var caseData =
        {
            "Requester": "qtao",
            "Summary": "Test case for DRDMV-10401 RandVal" + summary,
            "Support Group": "Compensation and Benefits",
            "Assignee": "qkatawazi"
        }
        await apiHelper.apiLogin('qtao');
        var newCase = await apiHelper.createCase(caseData);
        var caseId: string = newCase.displayId;
        await utilGrid.clearFilter();
        await caseConsole.searchAndOpenCase(caseId);
        expect(await viewCasePo.isEmailLinkPresent()).toBeTruthy('Email Link is missing');
        await viewCasePo.clickOnEmailLink();
        expect(await composeMail.getSubject()).toContain(caseId);//part of DRDMV-10393
        await expect(await composeMail.getEmailBody()).toContain('Regards');
        await expect(await composeMail.getEmailBody()).toContain('Qianru Tao');
        await expect(await composeMail.getEmailBody()).toContain('qtao@petramco.com');
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
    }),

    it('DRDMV-10398,DRDMV-10396: Email Template List Update in case compose email', async () => {
        await navigationPage.gotoCaseConsole();
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await apiHelper.apiLogin('qkatawazi');
        let emailTemplateName: string = await emailTemplateData['emailTemplateWithMandatoryField'].TemplateName + summary;
        emailTemplateData['emailTemplateWithMandatoryField'].TemplateName = emailTemplateName;
        await apiHelper.createEmailTemplate(emailTemplateData['emailTemplateWithMandatoryField']);
        var caseData =
        {
            "Requester": "qtao",
            "Summary": "Test case for DRDMV-10398 RandVal" + summary,
            "Support Group": "Compensation and Benefits",
            "Assignee": "qkatawazi"
        }
        await apiHelper.apiLogin('qtao');
        var newCase = await apiHelper.createCase(caseData);
        var caseId: string = newCase.displayId;
        await utilGrid.clearFilter();
        await caseConsole.searchAndOpenCase(caseId);
        expect(await viewCasePo.isEmailLinkPresent()).toBeTruthy('Email Link is missing');
        await viewCasePo.clickOnRequestersEmail();
        await composeMail.clickOnSelectEmailTemplateLink();
        await utilCommon.waitUntilSpinnerToHide();
        await emailTemplateBladePo.searchAndSelectEmailTemplate(emailTemplateName);
        await emailTemplateBladePo.clickOnApplyButton();
        await composeMail.setToOrCCInputTetxbox('To', 'fritz.schulz@petramco.com');
        expect(await composeMail.getEmailBody()).toContain('Hi Team ,\n\nI am taking leave today.\n\nThanks.');
        expect(await composeMail.getSubject()).toContain(caseId);
        expect(await composeMail.getSubjectInputValue()).toContain('Leave summary');
        expect(await composeMail.getEmailTemplateNameHeading()).toContain(emailTemplateName);
        await composeMail.clickOnSendButton();
    }),

    it('DRDMV-10395: Email template Update', async () => {
        await navigationPage.gotoCaseConsole();
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await apiHelper.apiLogin('qkatawazi');
        let emailTemplateName: string = await emailTemplateData['emailTemplateWithMandatoryField'].TemplateName + summary;
        emailTemplateData['emailTemplateWithMandatoryField'].TemplateName = emailTemplateName;
        await apiHelper.createEmailTemplate(emailTemplateData['emailTemplateWithMandatoryField']);
        let emailTemplate1: string = await emailTemplateData['emailTemplateForSalary'].TemplateName + summary;
        emailTemplateData['emailTemplateForSalary'].TemplateName = emailTemplate1;
        await apiHelper.createEmailTemplate(emailTemplateData['emailTemplateForSalary']);
        var caseData =
        {
            "Requester": "qtao",
            "Summary": "Test case for DRDMV-10395 RandVal" + summary,
            "Support Group": "Compensation and Benefits",
            "Assignee": "qkatawazi"
        }
        await apiHelper.apiLogin('qtao');
        var newCase = await apiHelper.createCase(caseData);
        var caseId: string = newCase.displayId;
        await utilGrid.clearFilter();
        await caseConsole.searchAndOpenCase(caseId);
        await viewCasePo.clickOnEmailLink();
        await composeMail.clickOnSelectEmailTemplateLink();
        await utilCommon.waitUntilSpinnerToHide();
        await emailTemplateBladePo.searchAndSelectEmailTemplate(emailTemplateName);
        await emailTemplateBladePo.clickOnApplyButton();
        await composeMail.setToOrCCInputTetxbox('To', 'fritz.schulz@petramco.com');
        expect(await composeMail.getEmailBody()).toContain('Hi Team ,\n\nI am taking leave today.\n\nThanks.');
        expect(await composeMail.getSubject()).toContain(caseId);
        expect(await composeMail.getSubjectInputValue()).toContain('Leave summary');
        expect(await composeMail.getEmailTemplateNameHeading()).toContain(emailTemplateName);
        await composeMail.clickOnSelectEmailTemplateLink();
        await utilCommon.waitUntilSpinnerToHide();
        await emailTemplateBladePo.searchAndSelectEmailTemplate(emailTemplate1);
        await emailTemplateBladePo.clickOnApplyButton();
        expect(await composeMail.getEmailBody()).toContain('Hi Team ,\n\nI have checked my salary.\n\nThanks.');
        expect(await composeMail.getSubject()).toContain(caseId);
        expect(await composeMail.getSubjectInputValue()).toContain('Salary summary');
        expect(await composeMail.getEmailTemplateNameHeading()).toContain(emailTemplate1);        
        await composeMail.clickOnSendButton();
    }),

    it('DRDMV-8392,DRDMV-10384: Negative: In Email "To" and "cc" should be user from Foundation data ', async () => {
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
        expect(await composeMail.isUserPopulatedInToOrCc('To','xyxd')).toBeFalsy();
        await composeMail.setToOrCCInputTetxbox('To', 'fritz.schulz@petramco.com');
        expect(await composeMail.getToEmailPerson()).toContain('Fritz Schulz');
        expect(await composeMail.isUserPopulatedInToOrCc('Cc','xyxd')).toBeFalsy();
        await composeMail.setToOrCCInputTetxbox('Cc', 'fritz.schulz@petramco.com');
        expect(await composeMail.getCcEmailPerson()).toContain('Fritz Schulz');
        await composeMail.clickOnDiscardButton();
        expect(await composeMail.getTextOfDiscardButtonWarningMessage()).toBe('Email not sent. Do you want to continue?'), 'Warning Email message is missing';
        await utilCommon.clickOnWarningOk();
    })
})