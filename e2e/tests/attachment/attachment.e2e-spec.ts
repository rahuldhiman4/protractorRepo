import { browser, protractor, ProtractorExpectedConditions } from "protractor";
import apiHelper from '../../api/api.helper';
import attachmentBladePo from '../../pageobject/attachment/attachment-blade.po';
import attachmentInformationBladePo from '../../pageobject/attachment/attachment-information-blade.po';
import caseConsole from '../../pageobject/case/case-console.po';
import previewCasePo from '../../pageobject/case/case-preview.po';
import createCasePo from '../../pageobject/case/create-case.po';
import editCasePo from '../../pageobject/case/edit-case.po';
import viewCasePo from '../../pageobject/case/view-case.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import composeMail from '../../pageobject/email/compose-mail.po';
import activityTabPo from '../../pageobject/social/activity-tab.po';
import adhoctaskTemplate from "../../pageobject/task/create-adhoc-task.po";
import editTaskPo from '../../pageobject/task/edit-task.po';
import manageTaskPo from "../../pageobject/task/manage-task-blade.po";
import viewTaskPo from '../../pageobject/task/view-task.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

describe("Attachment", () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login("qtao");
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    //kgaikwad
    it('[DRDMV-11707,DRDMV-11703,DRDMV-11704]: Upload attachment while creating case via BWF & verify all attachments Grid	', async () => {
        let caseSummary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let filePath = '../../data/ui/attachment/bwfJpg.jpg';
        await navigationPage.gotoCreateCase();
        await createCasePo.selectRequester('Elizabeth Peters');
        await createCasePo.setSummary(caseSummary);
        await createCasePo.addDescriptionAttachment([filePath]);
        await createCasePo.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        await viewCasePo.clickAttachmentsLink();
        expect(await utilCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('File is delete sucessfully');
        await attachmentBladePo.searchAndSelectCheckBox('bwfJpg');
        expect(await attachmentBladePo.getTextOfColumnHeader('Attachments ')).toBe('Attachments', 'Attachment column header is missing');
        expect(await attachmentBladePo.getTextOfColumnHeader('Attached to ')).toBe('Attached to', 'Attached to column header is missing');
        expect(await attachmentBladePo.getTextOfColumnHeader('Media type ')).toBe('Media type', 'Media type  column header is missing');
        expect(await attachmentBladePo.getTextOfColumnHeader('Created date ')).toBe('Created date', 'Created date column header is missing');
        expect(await attachmentBladePo.getRecordValue('Attachments')).toBe('bwfJpg', 'Attachment file name is missing');
        expect(await attachmentBladePo.getRecordValue('Attached to')).toBe('Case', 'Attach to column value is missing');
        expect(await attachmentBladePo.getRecordValue('Media type')).toBe('image/jpeg', 'Media type column value is missing');

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
        await attachmentBladePo.clickDownloadButton();
        expect(await utilCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('File is not downloaded.');

        await attachmentBladePo.clickFileName('bwfJpg');
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
        await attachmentInformationBladePo.clickDownloadButton();
        expect(await utilCommon.isFileDownloaded('bwfJpg.jpg')).toBeTruthy('File is not downloaded.');
        expect(await utilCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('File is delete sucessfully');
        await attachmentInformationBladePo.clickCloseButton();
        await attachmentBladePo.clickCloseButton();
    });

    //kgaikwad
    it('[DRDMV-11697]: All attachments grid verification', async () => {
        let caseSummary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotoCreateCase();
        await createCasePo.selectRequester('Elizabeth Peters');
        await createCasePo.setSummary(caseSummary);
        await createCasePo.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        await viewCasePo.clickAttachmentsLink();

        expect(await attachmentBladePo.isDownloadButtonDisplayed()).toBeTruthy('Download button is missing');
        expect(await attachmentBladePo.isCloseButtonDisplayed()).toBeTruthy('Close button is missing');
        expect(await attachmentBladePo.getTextOfColumnHeader('Attachments ')).toBe('Attachments', 'Attachment column header is missing');
        expect(await attachmentBladePo.getTextOfColumnHeader('Attached to ')).toBe('Attached to', 'Attached to column header is missing');
        expect(await attachmentBladePo.getTextOfColumnHeader('Media type ')).toBe('Media type', 'Media type  column header is missing');
        expect(await attachmentBladePo.getTextOfColumnHeader('Created date ')).toBe('Created date', 'Created date column header is missing');
        await attachmentBladePo.clickCloseButton();
    });

    //kgaikwad
    it('[DRDMV-11713]: Upload attachment via compose email & verify all attachments grid', async () => {
        await navigationPage.gotoCaseConsole();
        let caseData = {
            "Requester": "araisin",
            "Summary": "Test case for DRDMV-11713",
            "Assigned Company": "Petramco",
            "Business Unit": "United States Support",
            "Support Group": "US Support 1",
            "Assignee": "qtao"
        }
        await apiHelper.apiLogin('qkatawazi');
        let newCase = await apiHelper.createCase(caseData);
        await caseConsole.searchAndOpenCase(newCase.displayId);
        await viewCasePo.clickOnEmailLink();
        await composeMail.setToOrCCInputTetxbox('To', 'fritz.schulz@petramco.com');
        await composeMail.addAttachment(['../../data/ui/attachment/demo.txt']);
        await composeMail.clickOnSendButton();
        await viewCasePo.clickAttachmentsLink();
        expect(await utilCommon.deleteAlreadyDownloadedFile('demo.txt')).toBeTruthy('File is delete sucessfully');
        await attachmentBladePo.searchAndSelectCheckBox('demo');
        expect(await attachmentBladePo.getRecordValue('Attachments')).toBe('demo', 'demo txt file name is missing');
        await attachmentBladePo.clickDownloadButton();
        expect(await utilCommon.isFileDownloaded('demo.txt')).toBeTruthy('File is not downloaded.');
        await attachmentBladePo.clickCloseButton();
    });

    //kgaikwad
    fit('[DRDMV-11710,DRDMV-11698]: Upload attachment from Social & verify all attachments grid', async () => {
        let filePath = '../../data/ui/attachment/bwfPdf.pdf';
        let caseBodyText = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseData = {
            "Requester": "araisin",
            "Summary": "Test case for DRDMV-8377RandVal" + summary,
            "Assigned Company": "Petramco",
            "Business Unit": "United States Support",
            "Support Group": "US Support 1",
            "Assignee": "qtao"
        }
        await apiHelper.apiLogin('qkatawazi');
        let newCase = await apiHelper.createCase(caseData);
        let caseId: string = newCase.displayId;
        await caseConsole.searchAndOpenCase(caseId);
        await activityTabPo.addActivityNote(caseBodyText);
        await activityTabPo.addAttachment([filePath]);
        await activityTabPo.clickOnPostButton();
        expect(await activityTabPo.isAttachedFileNameDisplayed('bwfPdf.pdf')).toBeTruthy('Attached file name is missing');
        await viewCasePo.clickAttachmentsLink();
        expect(await attachmentBladePo.getTextOfColumnHeader('Attached to ')).toBe('Attached to', 'Attached to column header is missing');
        expect(await attachmentBladePo.getRecordValue('Attachments')).toBe('bwfPdf', 'Attachment file name is missing');
        expect(await utilCommon.deleteAlreadyDownloadedFile('bwfPdf.pdf')).toBeTruthy('File is deleted sucessfully');
        // DRDMV-11698
        expect(await attachmentBladePo.isDownloadButtonEnabled()).toBeFalsy('Download button is enabled');
        await attachmentBladePo.searchAndSelectCheckBox('bwfPdf');
        expect(await attachmentBladePo.isDownloadButtonEnabled()).toBeTruthy('Download button is disabled');
        await attachmentBladePo.clickDownloadButton();
        expect(await utilCommon.isFileDownloaded('bwfPdf.pdf')).toBeTruthy('File is not downloaded.');
        await attachmentBladePo.clickCloseButton();
        await activityTabPo.clickOnHyperlinkFromActivity(1, 'Qianru Tao');
        expect(await activityTabPo.isAttachedFileNameDisplayed('bwfPdf.pdf')).toBeTruthy('Attached file name is missing');
        expect(await utilCommon.deleteAlreadyDownloadedFile('bwfPdf.pdf')).toBeTruthy('File is delete sucessfully');
        await navigationPage.gotoPersonProfile();
        expect(await activityTabPo.isAttachedFileNameDisplayed('bwfPdf.pdf')).toBeTruthy('Attached file name is missing');
    });

    //kgaikwad
    it('[DRDMV-11708]: Upload attachment from task activity & verify all attachments grid', async () => {
        let xlsxFilePath = '../../data/ui/attachment/bwfXlsx.xlsx';
        let wordFilePath = '../../data/ui/attachment/bwfWord1.rtf';
        let adhocTaskSummary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseSummary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let addNotes = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');

        let caseData = {
            "Requester": "araisin",
            "Summary": caseSummary,
            "Assigned Company": "Petramco",
            "Business Unit": "United States Support",
            "Support Group": "US Support 3",
            "Assignee": "qkatawazi"
        }
        await apiHelper.apiLogin('qtao');
        let newCase = await apiHelper.createCase(caseData);
        let caseId: string = newCase.displayId;

        // Create Task Template
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let manualTaskTemplateData = {
            "templateName": "manualTaskTemplateDraft" + randomStr,
            "templateSummary": "manualTaskTemplateDraft" + randomStr,
            "templateStatus": "Active",
            "taskCompany": "Petramco",
            "ownerCompany": "Petramco",
            "ownerBusinessUnit": "Facilities Support",
            "ownerGroup": "Facilities"
        }
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createManualTaskTemplate(manualTaskTemplateData);
        await navigationPage.gotoCaseConsole();
        await caseConsole.searchAndOpenCase(caseId);
        await viewCasePo.clickAddTaskButton();
        await manageTaskPo.clickAddAdhocTaskButton();
        await adhoctaskTemplate.setSummary(adhocTaskSummary);
        await adhoctaskTemplate.addAttachment([xlsxFilePath]);
        await adhoctaskTemplate.clickSaveAdhoctask();
        await manageTaskPo.clickCloseButton();
        await viewCasePo.clickAttachmentsLink();
        expect(await attachmentBladePo.getRecordValue('Attachments')).toBe('bwfXlsx', 'Attachment file name is missing');
        expect(await attachmentBladePo.getRecordValue('Attached to')).toBe('Task', 'Attach to column value is missing');
        expect(await utilCommon.deleteAlreadyDownloadedFile('bwfXlsx.xlsx')).toBeTruthy('File is delete sucessfully');
        await attachmentBladePo.searchAndSelectCheckBox('bwfXlsx');
        await attachmentBladePo.clickDownloadButton();
        await attachmentBladePo.clickCloseButton();

        // //Add Manual task and Automation Task in Case
        await viewCasePo.clickAddTaskButton();
        await manageTaskPo.addTaskFromTaskTemplate(manualTaskTemplateData.templateName);
        await manageTaskPo.clickTaskLink(manualTaskTemplateData.templateName);
        await activityTabPo.addActivityNote(addNotes);
        await activityTabPo.addAttachment([wordFilePath]);
        await activityTabPo.clickOnPostButton();
        expect(await activityTabPo.isAttachedFileNameDisplayed('bwfWord1.rtf')).toBeTruthy('Attached file name is missing');
        await viewTaskPo.clickOnViewCase();
        await viewCasePo.clickAttachmentsLink();
        await attachmentBladePo.searchAttachment('bwfWord1');
        expect(await attachmentBladePo.getRecordValue('Attachments')).toBe('bwfWord1', 'Attachment file name is missing');
        expect(await attachmentBladePo.getRecordValue('Attached to')).toBe('Social', 'Attach to column value is missing');
        expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfWord1.rtf')).toBeTruthy('File is delete sucessfully');
        await attachmentBladePo.searchAndSelectCheckBox('bwfWord1');
        await attachmentBladePo.clickDownloadButton();
        expect(await utilityCommon.isFileDownloaded('bwfWord1.rtf')).toBeTruthy('File is not downloaded.');
        expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfWord1.rtf')).toBeTruthy('File is delete sucessfully');
        await attachmentBladePo.clickCloseButton();
        await navigationPage.gotoPersonProfile();
        expect(await activityTabPo.isAttachedFileNameDisplayed('bwfWord1.rtf')).toBeTruthy('Attached file name is missing');
    });

    //kgaikwad
    describe('[DRDMV-11718,DRDMV-11720]: Large number of attachments verification', async () => {
        let fileName: string[];
        it('Create case with Large number of attachments', async () => {
            let caseSummary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('Elizabeth Peters');
            await createCasePo.setSummary(caseSummary);
            fileName = ['articleStatus.png', 'bwfJpg.jpg', 'bwfJpg1.jpg', 'bwfJpg2.jpg', 'bwfJpg3.jpg', 'bwfJpg4.jpg', 'bwfJson1.json', 'bwfJson2.json', 'bwfJson3.json', 'bwfJson4.json', 'bwfJson5.json', 'bwfPdf.pdf', 'bwfPdf1.pdf', 'bwfPdf2.pdf', 'bwfPdf3.pdf', 'bwfPdf4.pdf', 'bwfWord1.rtf', 'bwfWord2.rtf', 'bwfXlsx.xlsx', 'demo.txt'];
            let filesToUpload = fileName.map((file) => { return `../../data/ui/attachment/${file}` });
            await createCasePo.addDescriptionAttachment(filesToUpload);
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePo.clickAttachmentsLink();
            await utilityGrid.sortGridColumn("Attachments", "asc");
        });
        it('[DRDMV-11718,DRDMV-11720]: Large number of attachments verification', async () => {
            for (let j: number = 0; j < fileName.length; j++) {
                let file: string = fileName[j].substring(0, fileName[j].indexOf("."));
                await utilCommon.deleteAlreadyDownloadedFile(file);
                await attachmentBladePo.searchAndSelectCheckBox(file);
                await attachmentBladePo.clickDownloadButton(); // select file checkbox
                expect(await utilCommon.isFileDownloaded(fileName[j])).toBeTruthy(`${fileName[j]} File is not downloaded.`);
                expect(await utilCommon.deleteAlreadyDownloadedFile(file)).toBeTruthy('File is deleted sucessfully');
                await attachmentBladePo.searchAndSelectCheckBox(file); // unselect file checkbox
            }
        });
        afterAll(async () => {
            await attachmentBladePo.clickCloseButton();
        });
    });

    //kgaikwad
    describe('[DRDMV-11721,DRDMV-11746]: Multiple tasks on same case with attachments verification with task id', async () => {
        let randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let newCase, fileName: string[] = [], taskId: string[] = [];
        beforeAll(async () => {
            // Create case API
            let caseData = {
                "Requester": "araisin",
                "Summary": "Summary" + randomStr,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
            }
            await apiHelper.apiLogin('qtao');
            newCase = await apiHelper.createCase(caseData);
        });

        it('Multiple tasks on same case with attachments', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(newCase.displayId);
            //Create Task API
            fileName = ['bwfJpg.jpg', 'bwfXlsx.xlsx', 'bwfXml.xml'];
            for (let i: number = 0; i < fileName.length; i++) {
                let manualTaskTemplateData = {
                    "templateName": `TaskTemplateName${i}${randomStr}`,
                    "templateSummary": `TaskTemplateSummary${i}${randomStr}`,
                    "templateStatus": "Active",
                    "taskCompany": "Petramco",
                    "ownerCompany": "Petramco",
                    "ownerBusinessUnit": "Facilities Support",
                    "ownerGroup": "Facilities"
                }
                await apiHelper.apiLogin('qkatawazi');
                await apiHelper.createManualTaskTemplate(manualTaskTemplateData);
                //Add Task into Blade
                await viewCasePo.clickAddTaskButton();
                await manageTaskPo.addTaskFromTaskTemplate(manualTaskTemplateData.templateSummary);
                await manageTaskPo.clickTaskLink(manualTaskTemplateData.templateSummary);

                await viewTaskPo.clickOnEditTask();
                await editTaskPo.addAttachment([`../../data/ui/attachment/${fileName[i]}`]);
                await editTaskPo.clickOnAssignToMe();
                await editTaskPo.clickOnSaveButton();
                taskId[i] = await viewTaskPo.getTaskID();
                await utilCommon.scrollUpOrDownTillElement(viewTaskPo.selectors.viewCaseLink);
                await viewTaskPo.clickOnViewCase();
            }
        });
        it('[DRDMV-11721,DRDMV-11746]: Multiple tasks on same case with attachments verification with task id', async () => {
            await viewCasePo.clickAttachmentsLink();
            for (let j: number = 0; j < fileName.length; j++) {
                let file: string = fileName[j].substring(0, fileName[j].indexOf("."));
                await attachmentBladePo.clickFileName(file);
                expect(await attachmentInformationBladePo.getValuesOfInformation(taskId[j])).toContain(taskId[j]);
                await attachmentInformationBladePo.clickCloseButton();
            }
            expect(await attachmentBladePo.getAttachmentToolTipText('bwfJpg')).toBeTruthy('ToolTip is missing of attachment');
            await attachmentBladePo.clickAllCheckboxButton();
            await attachmentBladePo.clickRefreshButton();
            expect(await attachmentBladePo.isCheckBoxSelected('bwfJpg')).toBeFalsy('bwfJpg CheckBox is selected');
            expect(await attachmentBladePo.isCheckBoxSelected('bwfXlsx')).toBeFalsy('bwfXlsx CheckBox is selected');
            expect(await attachmentBladePo.isCheckBoxSelected('bwfXml')).toBeFalsy('bwfXml CheckBox is selected');
        });
        afterAll(async () => {
            await attachmentBladePo.clickCloseButton();
        });
    });

    //kgaikwad
    describe('[DRDMV-11714,DRDMV-11705]: Remove attachment which is added via case console & verify all attachments grid', async () => {
        let caseSummary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        it('Create case with attachment', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('Elizabeth Peters');
            await createCasePo.setSummary(caseSummary);
            await createCasePo.addDescriptionAttachment(['../../data/ui/attachment/bwfJpg.jpg', '../../data/ui/attachment/articleStatus.png']);
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePo.clickAttachmentsLink();
            await attachmentBladePo.searchAttachment('bwfJpg');
            expect(await attachmentBladePo.isAttachmentPresent('bwfJpg')).toBeTruthy('bwfJpg Attachment is missing on grid');
            await attachmentBladePo.searchAttachment('articleStatus');
            expect(await attachmentBladePo.isAttachmentPresent('articleStatus')).toBeTruthy('articleStatus.png Attachment is missing on grid');
        });
        it('[DRDMV-11714,DRDMV-11705]: Remove attachment which is added via case console & verify all attachments grid', async () => {
            await attachmentBladePo.clickCloseButton();
            await viewCasePo.clickEditCaseButton();
            await editCasePo.removeAttachment();
            await editCasePo.removeAttachment();
            await editCasePo.clickSaveCase();
            await viewCasePo.clickAttachmentsLink();
            expect(await attachmentBladePo.isAttachmentPresent('bwfJpg')).toBeFalsy('bwfJpg Attachment displayed on grid');
            expect(await attachmentBladePo.isAttachmentPresent('bwfXlsx')).toBeFalsy('bwfXlsx Attachment displayed on grid');
        });
        afterAll(async () => {
            await attachmentBladePo.clickCloseButton();
        });
    });

    //kgaikwad
    it('[DRDMV-11702]: Multiple attachments download', async () => {
        let caseSummary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotoCreateCase();
        await createCasePo.selectRequester('Elizabeth Peters');
        await createCasePo.setSummary(caseSummary);
        let fileName: string[] = ['articleStatus.png', 'bwfJpg.jpg'];
        await createCasePo.addDescriptionAttachment(['../../data/ui/attachment/articleStatus.png', '../../data/ui/attachment/bwfJpg.jpg']);
        await createCasePo.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        await viewCasePo.clickAttachmentsLink();
        await attachmentBladePo.clickAllCheckboxButton();
        expect(await utilCommon.deleteAlreadyDownloadedFile(`${fileName[0]}`)).toBeTruthy('File is delete sucessfully');
        expect(await utilCommon.deleteAlreadyDownloadedFile(`${fileName[1]}`)).toBeTruthy('File is delete sucessfully');
        await attachmentBladePo.clickDownloadButton();
        await browser.sleep(3000); // hard wait to download all files
        for (let j: number = 0; j < fileName.length; j++) {
            let file: string = fileName[j].substring(0, fileName[j].indexOf("."));
            expect(await utilCommon.isFileDownloaded(file)).toBeTruthy('File is not downloaded.');
            expect(await utilCommon.deleteAlreadyDownloadedFile(file)).toBeTruthy('File is delete sucessfully');
        }
        await attachmentBladePo.clickCloseButton();
    });

    //kgaikwad
    describe('[DRDMV-11701,DRDMV-11706,DRDMV-11722]: Multiple attachments selection from different pages', async () => {
        it('Uplaod 50 attachments', async () => {
            let caseSummary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('Elizabeth Peters');
            await createCasePo.setSummary(caseSummary);
            let fileName1: string[] = ['bwfJpg1.jpg', 'bwfJpg2.jpg', 'bwfJpg3.jpg', 'bwfJpg4.jpg', 'bwfJson1.json', 'bwfJson2.json', 'bwfJson3.json', 'bwfJson4.json', 'bwfJson5.json', 'bwfPdf.pdf'];
            let filesToUpload1 = fileName1.map((file) => { return `../../data/ui/attachment/${file}` });
            await createCasePo.addDescriptionAttachment(filesToUpload1);
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await activityTabPo.addActivityNote("Total 20 Files");
            await activityTabPo.addAttachment(filesToUpload1);
            await activityTabPo.clickOnPostButton();
            await activityTabPo.addActivityNote("Total 30 Files");
            await activityTabPo.addAttachment(filesToUpload1);
            await activityTabPo.clickOnPostButton();
            await activityTabPo.addActivityNote("Total 40 Files");
            await activityTabPo.addAttachment(filesToUpload1);
            await activityTabPo.clickOnPostButton();
            await activityTabPo.addActivityNote("Total 50 Files");
            await activityTabPo.addAttachment(filesToUpload1);
            await activityTabPo.clickOnPostButton();
        });
        it('[DRDMV-11701,DRDMV-11706,DRDMV-11722]: Multiple attachments selection from different pages', async () => {
            let fileName2: string[] = ['articleStatus.png', 'bwfJpg.jpg'];
            let filesToUpload2 = fileName2.map((file) => { return `../../data/ui/attachment/${file}` });
            await activityTabPo.addActivityNote("Total 52 Files");
            await activityTabPo.addAttachment(filesToUpload2);
            await activityTabPo.clickOnPostButton();
            await viewCasePo.clickAttachmentsLink();
            await attachmentBladePo.clickAllCheckboxButton();
            expect(await attachmentBladePo.getSelectedCheckBoxCount()).toBe('50/50 files selected', 'selected checkbox count is missing for page1');
            await attachmentBladePo.clickPaginationNext();
            expect(await attachmentBladePo.getSelectedCheckBoxCount()).toBe('50/2 files selected', 'selected checkbox count is missing for page2');
            expect(await utilCommon.deleteAlreadyDownloadedFile('bwfJpg1.jpg')).toBeTruthy('File is delete sucessfully');
            expect(await utilCommon.deleteAlreadyDownloadedFile('articleStatus.png')).toBeTruthy('File is delete sucessfully');
            await attachmentBladePo.clickDownloadButton();
            await browser.sleep(5000); // hard wait to download 52 all files
            // File from first page is downloaded
            expect(await utilCommon.isFileDownloaded('bwfJpg1.jpg')).toBeTruthy('bwfJpg1.jpg File is not downloaded.');
            // File from last page is not downloaded
            expect(await utilCommon.isFileDownloaded('articleStatus.png')).toBeFalsy('articleStatus.png File is downloaded.');
            await attachmentBladePo.clickPaginationPrevious();
            expect(await attachmentBladePo.isCheckBoxSelected('bwfPdf')).toBeFalsy('bwfPdf CheckBox is selected');
            expect(await attachmentBladePo.isCheckBoxSelected('bwfJson5')).toBeFalsy('bwfJson5 CheckBox is selected');
        });
        afterAll(async () => {
            await attachmentBladePo.clickCloseButton();
        });
    });
});