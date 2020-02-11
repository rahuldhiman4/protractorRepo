import { browser, protractor, ProtractorExpectedConditions } from "protractor";
import apiHelper from '../../api/api.helper';
import attachmentBladePo from '../../pageobject/attachment/attachment-blade.po';
import caseConsole from '../../pageobject/case/case-console.po';
import createCasePo from '../../pageobject/case/create-case.po';
import viewCasePo from '../../pageobject/case/view-case.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import composeMail from '../../pageobject/email/compose-mail.po';
import utilCommon from '../../utils/util.common';

describe("Attachment", () => {
    const EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    beforeAll(async () => {
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
        await loginPage.login("qtao");
    });

    afterEach(async () => {
        await browser.refresh();
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    it('[DRDMV-11697]: All attachments grid verification', async () => {
        let caseSummary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotCreateCase();
        await createCasePo.selectRequester('Elizabeth Peters');
        await createCasePo.setSummary(caseSummary);
        await createCasePo.clickSaveCaseButton();
        await createCasePo.clickGoToCaseButton();
        await viewCasePo.clickAttachmentsLink();

        expect(await attachmentBladePo.isDownloadButtonDisplayed()).toBeTruthy('Download button is missing');
        expect(await attachmentBladePo.isCloseButtonDisplayed()).toBeTruthy('Close button is missing');
        await expect(await attachmentBladePo.getTextOfColumnHeader('Attachments ')).toBe('Attachments', 'Attachment column header is missing');
        expect(await attachmentBladePo.getTextOfColumnHeader('Attached to ')).toBe('Attached to', 'Attached to column header is missing');
        expect(await attachmentBladePo.getTextOfColumnHeader('Media type ')).toBe('Media type', 'Media type  column header is missing');
        expect(await attachmentBladePo.getTextOfColumnHeader('Created date ')).toBe('Created date', 'Created date column header is missing');
    })

    it('[DRDMV-11707,DRDMV-11703]: Upload attachment while creating case via BWF & verify all attachments Grid	', async () => {
        let caseSummary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let filePath = '../../data/ui/attachment/demo.txt';
        await navigationPage.gotCreateCase();
        await createCasePo.selectRequester('Elizabeth Peters');
        await createCasePo.setSummary(caseSummary);
        await createCasePo.addDescriptionAttachment(filePath);
        await createCasePo.clickSaveCaseButton();
        await createCasePo.clickGoToCaseButton();
        await viewCasePo.clickAttachmentsLink();
        expect(await utilCommon.deleteAlreadyDownloadedFile('demo.txt')).toBeTruthy('File is delete sucessfully');
        await attachmentBladePo.searchAndSelectCheckBox('demo');
        await expect(await attachmentBladePo.getTextOfColumnHeader('Attachments ')).toBe('Attachments', 'Attachment column header is missing');
        expect(await attachmentBladePo.getTextOfColumnHeader('Attached to ')).toBe('Attached to', 'Attached to column header is missing');
        expect(await attachmentBladePo.getTextOfColumnHeader('Media type ')).toBe('Media type', 'Media type  column header is missing');
        expect(await attachmentBladePo.getTextOfColumnHeader('Created date ')).toBe('Created date', 'Created date column header is missing');
        await expect(await attachmentBladePo.getRecordValue('demo')).toBe('demo', 'Attachment file name is missing');
        await expect(await attachmentBladePo.getRecordValue('Case')).toBe('Case', 'Attach to column value is missing');
        await expect(await attachmentBladePo.getRecordValue('text/plain')).toBe('text/plain', 'Media type column value is missing');

        let year: string;
        let month: string;
        let date: string;
        let finalDate;

        let objDate: Date = new Date();
        let numYear: number = objDate.getFullYear();
        year = new Number(numYear).toString();

        let numMonth: number = objDate.getUTCMonth() + 1;
        let month1 = new Number(numMonth);
        if (month1 <= 9) {
            month = '0' + month1.toString();
        } else {
            month = month1.toString();
        }
        let numDate: number = objDate.getUTCDate();
        let date1 = new Number(numDate);
        if (date1 <= 9) {
            date = '0' + date1.toString();
        } else {
            date = date1.toString();
        }

        finalDate = date + '/' + month + '/' + year;
        expect(await attachmentBladePo.getRecordValue(finalDate)).toContain(finalDate);
        expect(await attachmentBladePo.isDownloadButtonDisplayed()).toBeTruthy('Download button is missing');
        expect(await attachmentBladePo.isCloseButtonDisplayed()).toBeTruthy('Close button is missing');
        await attachmentBladePo.clickOnDownloadButton();
        expect(await utilCommon.isFileDownloaded('demo.txt')).toBeTruthy('File is not downloaded.');
    })

    it('DRDMV-11713]: Upload attachment via compose email & verify all attachments grid', async () => {
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
        await composeMail.setToOrCCInputTetxbox('To', 'fritz.schulz@petramco.com');
        await composeMail.addAttachment();
        await composeMail.clickOnSendButton();
        await viewCasePo.clickAttachmentsLink();
        expect(await utilCommon.deleteAlreadyDownloadedFile('demo.txt')).toBeTruthy('File is delete sucessfully');
        await attachmentBladePo.searchAndSelectCheckBox('demo');
        await expect(await attachmentBladePo.getRecordValue('demo')).toBe('demo', 'demo txt file name is missing');
        await attachmentBladePo.clickOnDownloadButton();
        expect(await utilCommon.isFileDownloaded('demo.txt')).toBeTruthy('File is not downloaded.');
    });
});