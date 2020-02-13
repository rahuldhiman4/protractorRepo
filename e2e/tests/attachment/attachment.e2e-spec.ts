import { browser, protractor, ProtractorExpectedConditions } from "protractor";
import apiHelper from '../../api/api.helper';
import attachmentBladePo from '../../pageobject/attachment/attachment-blade.po';
import attachmentInformationBladePo from '../../pageobject/attachment/attachment-information-blade.po';
import caseConsole from '../../pageobject/case/case-console.po';
import createCasePo from '../../pageobject/case/create-case.po';
import viewCasePo from '../../pageobject/case/view-case.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import composeMail from '../../pageobject/email/compose-mail.po';
import activityTabPo from '../../pageobject/social/activity-tab.po';
import adhoctaskTemplate from "../../pageobject/task/create-adhoc-task.po";
import editTaskPo from '../../pageobject/task/edit-task.po';
import { default as manageTask, default as manageTaskBladePo } from "../../pageobject/task/manage-task-blade.po";
import viewTaskPo from '../../pageobject/task/view-task.po';
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

    it('[DRDMV-11707,DRDMV-11703,DRDMV-11704]: Upload attachment while creating case via BWF & verify all attachments Grid	', async () => {
        let caseSummary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let filePath = '../../data/ui/attachment/bwfJpg.jpg';
        await navigationPage.gotCreateCase();
        await createCasePo.selectRequester('Elizabeth Peters');
        await createCasePo.setSummary(caseSummary);
        await createCasePo.addDescriptionAttachment(filePath);
        await createCasePo.clickSaveCaseButton();
        await createCasePo.clickGoToCaseButton();
        await viewCasePo.clickAttachmentsLink();
        expect(await utilCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('File is delete sucessfully');
        await attachmentBladePo.searchAndSelectCheckBox('bwfJpg');
        await expect(await attachmentBladePo.getTextOfColumnHeader('Attachments ')).toBe('Attachments', 'Attachment column header is missing');
        expect(await attachmentBladePo.getTextOfColumnHeader('Attached to ')).toBe('Attached to', 'Attached to column header is missing');
        expect(await attachmentBladePo.getTextOfColumnHeader('Media type ')).toBe('Media type', 'Media type  column header is missing');
        expect(await attachmentBladePo.getTextOfColumnHeader('Created date ')).toBe('Created date', 'Created date column header is missing');
        await expect(await attachmentBladePo.getRecordValue('bwfJpg')).toBe('bwfJpg', 'Attachment file name is missing');
        await expect(await attachmentBladePo.getRecordValue('Case')).toBe('Case', 'Attach to column value is missing');
        await expect(await attachmentBladePo.getRecordValue('image/jpeg')).toBe('image/jpeg', 'Media type column value is missing');

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
        expect(await utilCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('File is not downloaded.');

        await attachmentBladePo.clickOnFileName('bwfJpg');
        expect(await attachmentInformationBladePo.isDownloadButtonDisplayed()).toBeTruthy('download button is missing');
        expect(await attachmentInformationBladePo.isCloseButtonDisplayed()).toBeTruthy('close button is missing');
        expect(await attachmentInformationBladePo.getValuesOfInformation('File Name')).toBe('File Name: bwfJpg', 'FileName is missing');
        expect(await attachmentInformationBladePo.getValuesOfInformation(' Case')).toBe('Type: Case', 'Type is missing');
        expect(await attachmentInformationBladePo.getValuesOfInformation(' image/jpeg')).toBe('Media type: image/jpeg', 'Media Type is missing');
        expect(await attachmentInformationBladePo.getValuesOfInformation(' 49.9 KB')).toBe('Size: 49.9 KB', 'FileSize is missing');
        expect(await attachmentInformationBladePo.getValuesOfInformation(finalDate)).toContain(finalDate, 'Created date is missing');
        expect(await attachmentInformationBladePo.getValuesOfInformation(' Qianru Tao')).toBe('Created by: Qianru Tao', 'Created by is missing');
        expect(await attachmentInformationBladePo.isTitleNameDisplayed()).toBeTruthy('Title is missing');
        expect(await utilCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('File is delete sucessfully');
        await attachmentInformationBladePo.clickOnDonwloadButton();
        expect(await utilCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('File is not downloaded.');
        expect(await utilCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('File is delete sucessfully');
    }, 90 * 1000);

    it('[DRDMV-11713]: Upload attachment via compose email & verify all attachments grid', async () => {
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

    it('[DRDMV-11710,DRDMV-11698]: Upload attachment from Social & verify all attachments grid', async () => {
        let filePath = '../../data/ui/attachment/bwfPdf.pdf';
        let caseBodyText = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
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
        await activityTabPo.addActivityNote(caseBodyText);
        await activityTabPo.addAttachment(filePath);
        await activityTabPo.clickOnPostButton();
        await expect(await activityTabPo.isAttachedFileNameDisplayed('bwfPdf.pdf')).toBeTruthy('Attached file name is missing');
        await viewCasePo.clickAttachmentsLink();
        await expect(await attachmentBladePo.getTextOfColumnHeader('Attached to ')).toBe('Attached to', 'Attached to column header is missing');
        await expect(await attachmentBladePo.getRecordValue('bwfPdf')).toBe('bwfPdf', 'Attachment file name is missing');
        await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfPdf.pdf')).toBeTruthy('File is delete sucessfully');
        // DRDMV-11698
        await expect(await attachmentBladePo.isDownloadButtonEnabled()).toBeFalsy('Download button is enabled');
        await attachmentBladePo.searchAndSelectCheckBox('bwfPdf');
        await expect(await attachmentBladePo.isDownloadButtonEnabled()).toBeTruthy('Download button is disabled');

        await attachmentBladePo.clickOnDownloadButton();
        await expect(await utilCommon.isFileDownloaded('bwfPdf.pdf')).toBeTruthy('File is not downloaded.');
        await attachmentBladePo.clickOnCloseButton();
        await activityTabPo.clickOnHyperlinkFromActivity(caseBodyText, 'Qianru Tao');
        await expect(await activityTabPo.isAttachedFileNameDisplayed('bwfPdf.pdf')).toBeTruthy('Attached file name is missing');
        await expect(await utilCommon.deleteAlreadyDownloadedFile('bwfPdf.pdf')).toBeTruthy('File is delete sucessfully');
        await navigationPage.goToPersonProfile();
        await expect(await activityTabPo.isAttachedFileNameDisplayed('bwfPdf.pdf')).toBeTruthy('Attached file name is missing');
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
    });

    it('[DRDMV-11708]: Upload attachment from task activity & verify all attachments grid', async () => {
        let xlsxFilePath = '../../data/ui/attachment/bwfXlsx.xlsx';
        let wordFilePath = '../../data/ui/attachment/bwfWord.rtf';
        let adhocTaskSummary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseSummary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let addNotes = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');

        var caseData =
        {
            "Requester": "qtao",
            "Summary": caseSummary,
            "Support Group": "Compensation and Benefits",
            "Assignee": "qkatawazi"
        }
        await apiHelper.apiLogin('qtao');
        var newCase = await apiHelper.createCase(caseData);
        var caseId: string = newCase.displayId;

        // Create Task Template
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let manualTaskTemplateData = {
            "templateName": `manualTaskTemplateDraft ${randomStr}`,
            "templateSummary": `manualTaskTemplateDraft ${randomStr}`,
            "templateStatus": "Active",
        }
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createManualTaskTemplate(manualTaskTemplateData);

        await caseConsole.searchAndOpenCase(caseId);
        await viewCasePo.clickAddTaskButton();
        await manageTask.clickAddAdhocTaskButton();
        await adhoctaskTemplate.setSummary(adhocTaskSummary);
        await adhoctaskTemplate.addAttachment(xlsxFilePath);
        await adhoctaskTemplate.clickOnSaveAdhoctask();
        await manageTask.clickOnCloseButton();
        await viewCasePo.clickAttachmentsLink();
        await expect(await attachmentBladePo.getRecordValue('bwfXlsx')).toBe('bwfXlsx', 'Attachment file name is missing');
        await expect(await attachmentBladePo.getRecordValue('Task')).toBe('Task', 'Attach to column value is missing');
        expect(await utilCommon.deleteAlreadyDownloadedFile('bwfXlsx.xlsx')).toBeTruthy('File is delete sucessfully');
        await attachmentBladePo.searchAndSelectCheckBox('bwfXlsx');
        await attachmentBladePo.clickOnDownloadButton();
        await attachmentBladePo.clickOnCloseButton();

        // //Add Manual task and Automation Task in Case
        await viewCasePo.clickAddTaskButton();
        await manageTask.addTaskFromTaskTemplate(`manualTaskTemplateDraft ${randomStr}`);
        await manageTask.clickTaskLinkOnManageTask(`manualTaskTemplateDraft ${randomStr}`);
        await activityTabPo.addActivityNote(addNotes);
        await activityTabPo.addAttachment(wordFilePath);
        await activityTabPo.clickOnPostButton();
        await expect(await activityTabPo.isAttachedFileNameDisplayed('bwfWord.rtf')).toBeTruthy('Attached file name is missing');
        await viewTaskPo.clickOnViewCase();
        await viewCasePo.clickAttachmentsLink();
        await expect(await attachmentBladePo.getRecordValue('bwfWord')).toBe('bwfWord', 'Attachment file name is missing');
        await expect(await attachmentBladePo.getRecordValue('Social')).toBe('Social', 'Attach to column value is missing');
        expect(await utilCommon.deleteAlreadyDownloadedFile('bwfWord.rtf')).toBeTruthy('File is delete sucessfully');
        await attachmentBladePo.searchAndSelectCheckBox('bwfWord');
        await attachmentBladePo.clickOnDownloadButton();
        await expect(await utilCommon.isFileDownloaded('bwfWord.rtf')).toBeTruthy('File is not downloaded.');
        expect(await utilCommon.deleteAlreadyDownloadedFile('bwfWord.rtf')).toBeTruthy('File is delete sucessfully');
        await attachmentBladePo.clickOnCloseButton();
        await navigationPage.goToPersonProfile();
        await expect(await activityTabPo.isAttachedFileNameDisplayed('bwfWord.rtf')).toBeTruthy('Attached file name is missing');
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
    }, 110 * 1000);



});