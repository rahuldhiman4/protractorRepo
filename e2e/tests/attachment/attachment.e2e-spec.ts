import { browser, protractor, ProtractorExpectedConditions, ActionSequence } from "protractor";
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
import { default as manageTask } from "../../pageobject/task/manage-task-blade.po";
import viewTaskPo from '../../pageobject/task/view-task.po';
import utilCommon from '../../utils/util.common';
import editCasePo from '../../pageobject/case/edit-case.po';
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
        await attachmentInformationBladePo.clickOnDownloadButton();
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
        let wordFilePath = '../../data/ui/attachment/bwfWord1.rtf';
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
        await expect(await activityTabPo.isAttachedFileNameDisplayed('bwfWord1.rtf')).toBeTruthy('Attached file name is missing');
        await viewTaskPo.clickOnViewCase();
        await viewCasePo.clickAttachmentsLink();
        await expect(await attachmentBladePo.getRecordValue('bwfWord1')).toBe('bwfWord1', 'Attachment file name is missing');
        await expect(await attachmentBladePo.getRecordValue('Social')).toBe('Social', 'Attach to column value is missing');
        expect(await utilCommon.deleteAlreadyDownloadedFile('bwfWord1.rtf')).toBeTruthy('File is delete sucessfully');
        await attachmentBladePo.searchAndSelectCheckBox('bwfWord1');
        await attachmentBladePo.clickOnDownloadButton();
        await expect(await utilCommon.isFileDownloaded('bwfWord1.rtf')).toBeTruthy('File is not downloaded.');
        expect(await utilCommon.deleteAlreadyDownloadedFile('bwfWord1.rtf')).toBeTruthy('File is delete sucessfully');
        await attachmentBladePo.clickOnCloseButton();
        await navigationPage.goToPersonProfile();
        await expect(await activityTabPo.isAttachedFileNameDisplayed('bwfWord1.rtf')).toBeTruthy('Attached file name is missing');
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
    }, 110 * 1000);

    it('[DRDMV-11718,DRDMV-11720]: Large number of attachments verification', async () => {
        let caseSummary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotCreateCase();
        await createCasePo.selectRequester('Elizabeth Peters');
        await createCasePo.setSummary(caseSummary);
        let fileName1: string[] = ['articleStatus.png', 'bwfJpg.jpg', 'bwfJpg1.jpg', 'bwfJpg2.jpg', 'bwfJpg3.jpg', 'bwfJpg4.jpg', 'bwfJson1.json', 'bwfJson2.json', 'bwfJson3.json', 'bwfJson4.json', 'bwfJson5.json', 'bwfPdf.pdf', 'bwfPdf1.pdf', 'bwfPdf2.pdf', 'bwfPdf3.pdf', 'bwfPdf4.pdf', 'bwfWord1.rtf', 'bwfWord2.rtf', 'bwfXlsx.xlsx', 'demo.txt'];

        for (let i: number = 0; i < fileName1.length; i++) {
            await createCasePo.addDescriptionAttachment(`../../data/ui/attachment/${fileName1[i]}`);
        }
        await createCasePo.clickSaveCaseButton();
        await createCasePo.clickGoToCaseButton();
        await viewCasePo.clickAttachmentsLink();

        let fileName2: string[] = ['articleStatus', 'bwfJpg', 'bwfJpg1', 'bwfJpg2', 'bwfJpg3', 'bwfJpg4', 'bwfJson1', 'bwfJson2', 'bwfJson3', 'bwfJson4', 'bwfJson5', 'bwfPdf', 'bwfPdf1', 'bwfPdf2', 'bwfPdf3', 'bwfPdf4', 'bwfWord1', 'bwfWord2', 'bwfXlsx', 'demo'];
        let j: number;
        for (j = 0; j < fileName2.length; j++) {
            await attachmentBladePo.searchRecord(`${fileName2[j]}`);
            await attachmentBladePo.searchAndSelectCheckBox(`${fileName2[j]}`);
            await expect(await attachmentBladePo.getRecordValue(`${fileName2[j]}`)).toBe(`${fileName2[j]}`, 'Attachment file name is missing');
            await attachmentBladePo.clickOnDownloadButton();
            await expect(await utilCommon.deleteAlreadyDownloadedFile(`${fileName1[j]}`)).toBeTruthy('File is delete sucessfully');
            await attachmentBladePo.searchAndSelectCheckBox(`${fileName2[j]}`);
            await expect(await utilCommon.isFileDownloaded(`${fileName1[j]}`)).toBeTruthy('File is not downloaded.');
            await expect(await utilCommon.deleteAlreadyDownloadedFile(`${fileName1[j]}`)).toBeTruthy('File is delete sucessfully');
        }

    }, 240 * 1000);

    it('[DRDMV-11721,DRDMV-11746]: Multiple tasks on same case with attachments verification with task id', async () => {
        let caseSummary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let randTask1 = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let randTask2 = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let randTask3 = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let taskId: string[] = [];

        // Create case API
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
        await caseConsole.searchAndOpenCase(caseId);
        //Create Task API

        let taskRandString: string[] = [randTask1, randTask2, randTask3];
        let fileName: string[] = ['bwfJpg.jpg', 'bwfXlsx.xlsx', 'bwfXml.xml'];
        for (let i: number = 0; i < taskRandString.length; i++) {

            let manualTaskTemplateData = {
                "templateName": `manualTaskTemplateDraft ${taskRandString[i]}`,
                "templateSummary": `manualTaskTemplateDraft ${taskRandString[i]}`,
                "templateStatus": "Active",
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createManualTaskTemplate(manualTaskTemplateData);
            //Add Task into Blade
            await viewCasePo.clickAddTaskButton();
            await manageTask.addTaskFromTaskTemplate(`manualTaskTemplateDraft ${taskRandString[i]}`);
            await manageTask.clickTaskLinkOnManageTask(`manualTaskTemplateDraft ${taskRandString[i]}`);

            await viewTaskPo.clickOnEditTask();
            await editTaskPo.addAttachment(`../../data/ui/attachment/${fileName[i]}`);
            await editTaskPo.clickOnAssignToMe();
            await editTaskPo.clickOnSaveButton();
            let taskIdText: string = await viewTaskPo.getTaskID();
            taskId[i] = taskIdText;
            await utilCommon.scrollUpOrDownTillElement(viewTaskPo.selectors.viewCaseLink);
            await viewTaskPo.clickOnViewCase();
        }
        await viewCasePo.clickAttachmentsLink();

        let fileName2: string[] = ['bwfJpg', 'bwfXlsx', 'bwfXml'];
        for (let j: number = 0; j < taskRandString.length; j++) {

            await attachmentBladePo.clickOnFileName(fileName2[j]);
            await expect(await attachmentInformationBladePo.getValuesOfInformation(taskId[j])).toContain(taskId[j]);
            await attachmentInformationBladePo.clickOnCloseButton();
        }
        
        await expect(await attachmentBladePo.getAttachmentToolTipText('bwfJpg')).toBeTruthy('ToolTip is missing of attachment');
        await attachmentBladePo.clickOnAllCheckboxButton();
        await attachmentBladePo.clickOnRefreshButton();
        await expect(await attachmentBladePo.isCheckBoxSelected('bwfJpg')).toBeFalsy('bwfJpg CheckBox is selected');
        await expect(await attachmentBladePo.isCheckBoxSelected('bwfXlsx')).toBeFalsy('bwfXlsx CheckBox is selected');
        await expect(await attachmentBladePo.isCheckBoxSelected('bwfXml')).toBeFalsy('bwfXml CheckBox is selected');
        await attachmentBladePo.clickOnCloseButton();
    }, 170 * 1000);

    it('[DRDMV-11701,DRDMV-11706]: Pagination on all attachments grid', async () => {
        let caseSummary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotCreateCase();
        await createCasePo.selectRequester('Elizabeth Peters');
        await createCasePo.setSummary(caseSummary);
        let fileName1: string[] = ['articleStatus.png','articleStatus.png','articleStatus.png', 'bwfJpg.jpg', 'bwfJpg1.jpg', 'bwfJpg2.jpg', 'bwfJpg3.jpg', 'bwfJpg4.jpg', 'bwfJson1.json', 'bwfJson2.json', 'bwfJson3.json', 'bwfJson4.json', 'bwfJson5.json', 'bwfPdf.pdf', 'bwfPdf1.pdf', 'bwfPdf2.pdf', 'bwfPdf3.pdf', 'bwfPdf4.pdf', 'bwfWord1.rtf', 'bwfWord2.rtf'];
        for (let i: number = 0; i < fileName1.length; i++) {
            await createCasePo.addDescriptionAttachment(`../../data/ui/attachment/${fileName1[i]}`);
        }
        await createCasePo.clickSaveCaseButton();
        await createCasePo.clickGoToCaseButton();
        await viewCasePo.clickAttachmentsLink();
        await expect(await attachmentBladePo.getAttachmentNameCount('articleStatus')).toEqual(3);
        await expect(await attachmentBladePo.getAttachmentSize()).toBe('1 - 10 of 20');
        await attachmentBladePo.clickOnPaginationNextButton();
        await expect(await attachmentBladePo.getAttachmentSize()).toBe('11 - 20 of 20');
        await attachmentBladePo.clickOnPaginationPreviousButton();
        await attachmentBladePo.clickOnCloseButton();
    });

    it('[DRDMV-11714,DRDMV-11705]: Remove attachment which is added via case console & verify all attachments grid', async () => {
        let caseSummary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotCreateCase();
        await createCasePo.selectRequester('Elizabeth Peters');
        await createCasePo.setSummary(caseSummary);
        let fileName1: string[] = ['bwfJpg.jpg', 'articleStatus.png'];
        for (let i: number = 0; i < fileName1.length; i++) {
            await createCasePo.addDescriptionAttachment(`../../data/ui/attachment/${fileName1[i]}`);
        }
        await createCasePo.clickSaveCaseButton();
        await createCasePo.clickGoToCaseButton();
        await viewCasePo.clickAttachmentsLink();
        await attachmentBladePo.searchRecord('bwf');
        await expect(await attachmentBladePo.isAttachmentPresent('bwfJpg')).toBeTruthy('bwfJpg Attachment is missing on grid');
        await attachmentBladePo.searchRecord('art');
        await expect(await attachmentBladePo.isAttachmentPresent('articleStatus')).toBeTruthy('articleStatus.png Attachment is missing on grid');
        await attachmentBladePo.clickOnCloseButton();
        await viewCasePo.clickEditCaseButton();
        await editCasePo.removeAttachment('bwfJpg.jpg');
        await editCasePo.removeAttachment('articleStatus.png');
        await editCasePo.clickSaveCase();
        await viewCasePo.clickAttachmentsLink();
        await expect(await attachmentBladePo.isAttachmentPresent('bwfJpg')).toBeFalsy('bwfJpg Attachment displayed on grid');
        await expect(await attachmentBladePo.isAttachmentPresent('bwfXlsx')).toBeFalsy('bwfXlsx Attachment displayed on grid');
        await attachmentBladePo.clickOnCloseButton();
    });
});