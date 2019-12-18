import { browser, protractor, ProtractorExpectedConditions } from "protractor";
import apiHelper from '../../api/api.helper';
import caseConsole from '../../pageobject/case/case-console.po';
import quickCase from "../../pageobject/case/quick-case.po";
import viewCasePo from '../../pageobject/case/view-case.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import composeMail from '../../pageobject/email/compose-mail.po';
import utilCommon from "../../utils/util.common";
import utilGrid from '../../utils/util.grid';
import selectEmailTemplateBladePo from '../../pageobject/email/select-email-template-blade.po';


describe("compose email", () => {
    const EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    const requester = "Requester";
    const contact = "Contact";

    beforeAll(async () => {
        browser.waitForAngularEnabled(false);
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
        await loginPage.login("qkatawazi");
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
        var newCase = await apiHelper.createCase(caseData);
        var caseId: string = newCase.displayId;
        await caseConsole.searchAndOpenCase(caseId);
        expect(await viewCasePo.isEmailLinkPresent()).toBeTruthy('Email Link is missing');
        await viewCasePo.clickOnEmailLink();
        expect(await composeMail.isComposeEmailTitlePreset('Compose Email')).toBeTruthy('Compose email title missing');
        expect(await composeMail.isToOrCCInputTetxboxPresent('To')).toBeTruthy('To title missing');
        expect(await composeMail.isToOrCCInputTetxboxPresent('Cc')).toBeTruthy('Cc title missing');
        expect(await composeMail.isSubjectPresent()).toBeTruthy('Subject title missing');
        expect(await composeMail.getSubject()).toBe(caseId + ":  ");
        expect(await composeMail.isSelectEmailTemplateLinkPresent()).toBeTruthy('SelectEmailTemplateLink is missing');
        expect(await composeMail.isMessageBodyFontPannelBarPresent()).toBeTruthy('MessageBodyFontPannelBar is missing');
        expect(await composeMail.isAttachLinkPresent()).toBeTruthy('Attach Link is  missing');
        expect(await composeMail.isSendButtonPresent()).toBeTruthy('Send Button is missing');
        expect(await composeMail.isDiscardButtonPresent()).toBeTruthy('Discard Button is missing');
        await composeMail.CloseComposeEmail();
        await viewCasePo.isEmailLinkPresent();

        await navigationPage.gotoQuickCase();
        await quickCase.setAndSelectRequesterName('adam');
        await quickCase.setCaseSummary('new case');
        await quickCase.createCaseButton();
        await utilCommon.closePopUpMessage();
        await quickCase.gotoCaseButton();
        var quickCaseId: string = await viewCasePo.getCaseID();
        await viewCasePo.clickOnEmailLink();
        expect(await composeMail.isComposeEmailTitlePreset('Compose Email')).toBeTruthy('Compose email title missing');
        expect(await composeMail.isToOrCCInputTetxboxPresent('To')).toBeTruthy('To title missing');
        expect(await composeMail.isToOrCCInputTetxboxPresent('Cc')).toBeTruthy('Cc title missing');
        expect(await composeMail.isSubjectPresent()).toBeTruthy('Subject title missing');
        expect(await composeMail.getSubject()).toBe(quickCaseId + ":  ");
        expect(await composeMail.isSelectEmailTemplateLinkPresent()).toBeTruthy('SelectEmailTemplateLink is missing');
        expect(await composeMail.isMessageBodyFontPannelBarPresent()).toBeTruthy('MessageBodyFontPannelBar is missing');
        expect(await composeMail.isAttachLinkPresent()).toBeTruthy('Attach Link is  missing');
        expect(await composeMail.isSendButtonPresent()).toBeTruthy('Send Button is missing');
        expect(await composeMail.isDiscardButtonPresent()).toBeTruthy('Discard Button is missing');
        await composeMail.CloseComposeEmail();
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
        expect(await composeMail.getTextOfDiscardButtonWarningMessage()).toBe('Email not sent. Do you want to continue?');
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
        expect(await selectEmailTemplateBladePo.getTextOfGridColumnHeader('Template Name')).toBe('Template Name');
        expect(await selectEmailTemplateBladePo.getTextOfGridColumnHeader('Message Subject')).toBe('Message Subject');
        expect(await selectEmailTemplateBladePo.getTextOfGridColumnHeader('Locale')).toBe('Locale');
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
        await selectEmailTemplateBladePo.clickOnColumnListIcon();
        await selectEmailTemplateBladePo.clickOnAddColumnCheckBox('Company');
        await selectEmailTemplateBladePo.clickOnAddColumnCheckBox('Description');
        await selectEmailTemplateBladePo.clickOnAddColumnCheckBox('Display ID');
        await selectEmailTemplateBladePo.clickOnAddColumnCheckBox('ID');
        await selectEmailTemplateBladePo.clickOnAddColumnCheckBox('Label');
        await selectEmailTemplateBladePo.clickOnAddColumnCheckBox('Template Id');
        await selectEmailTemplateBladePo.clickOnColumnListIcon();
        await utilCommon.waitUntilSpinnerToHide();
        expect(await selectEmailTemplateBladePo.getTextOfGridColumnHeader('Template Name')).toBe('Template Name');
        expect(await selectEmailTemplateBladePo.getTextOfGridColumnHeader('Message Subject')).toBe('Message Subject');
        expect(await selectEmailTemplateBladePo.getTextOfGridColumnHeader('Locale')).toBe('Locale');
        expect(await selectEmailTemplateBladePo.getTextOfGridColumnHeader('Company')).toBe('Company');
        expect(await selectEmailTemplateBladePo.getTextOfGridColumnHeader('Description')).toBe('Description');
        expect(await selectEmailTemplateBladePo.getTextOfGridColumnHeader('Display ID')).toBe('Display ID');
        expect(await selectEmailTemplateBladePo.getTextOfGridColumnHeader('ID')).toBe('ID');
        expect(await selectEmailTemplateBladePo.getTextOfGridColumnHeader('Label')).toBe('Label');
        expect(await selectEmailTemplateBladePo.getTextOfGridColumnHeader('Template Id')).toBe('Template Id');
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
        expect (selectEmailTemplateBladePo.isApplyButtonDisabled()).toBeFalsy('Apply button is clickable');
    })
})