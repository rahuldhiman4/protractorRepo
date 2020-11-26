import { browser } from "protractor";
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
import manageTask from "../../pageobject/task/manage-task-blade.po";
import consoleCasetemplatePo from '../../pageobject/settings/case-management/console-casetemplate.po';
import createCasetemplatePo from '../../pageobject/settings/case-management/create-casetemplate.po';
import viewCasetemplatePo from '../../pageobject/settings/case-management/view-casetemplate.po';
import editCasetemplatePo from '../../pageobject/settings/case-management/edit-casetemplate.po';
import createTasktemplatePo from '../../pageobject/settings/task-management/create-tasktemplate.po';
import selectTaskTemplate from "../../pageobject/settings/task-management/console-tasktemplate.po";
import viewTasktemplatePo from '../../pageobject/settings/task-management/view-tasktemplate.po';
import editTasktemplatePo from '../../pageobject/settings/task-management/edit-tasktemplate.po';
import assignmentsConfigConsolePo from '../../pageobject/settings/case-management/assignments-config-console.po';
import createAssignmentsConfigPo from '../../pageobject/settings/case-management/create-assignments-config.po';
import editAssignmentsConfigPo from '../../pageobject/settings/case-management/edit-assignments-config.po';
import consoleReadAcess from '../../pageobject/settings/case-management/read-access-console.po';
import addReadAccess from '../../pageobject/settings/case-management/add-read-access-configuration.po';
import utilGrid from '../../utils/util.grid';
import editReadAccess from "../../pageobject/settings/case-management/edit-read-access-config.po";
import documentLibraryConsolePo from '../../pageobject/settings/document-management/document-library-console.po';
import createDocumentLibraryPo from '../../pageobject/settings/document-management/create-document-library.po';
import editDocumentLibraryPo from '../../pageobject/settings/document-management/edit-document-library.po';
import { default as createKnowledgePage } from "../../pageobject/knowledge/create-knowlege.po";
import previewKnowledgePo from '../../pageobject/knowledge/preview-knowledge.po';
import viewKnowledgeArticlePo from '../../pageobject/knowledge/view-knowledge-article.po';
import serviceTargetConfig from '../../pageobject/settings/slm/service-target-blade.po';
import slmExpressionBuilder from '../../pageobject/settings/slm/slm-expressionbuilder.pop.po';
import approvalConfigurationPage from "../../pageobject/settings/approval/approval-configuration.po";
import { SAMPLE_MENU_ITEM } from '../../data/ui/ticketing/menu.item.ui';
import { cloneDeep } from 'lodash';
import attachDocumentBladePo from '../../pageobject/common/attach-document-blade.po';
import knowledgeArticlesConsolePo from '../../pageobject/knowledge/knowledge-articles-console.po';
import editKnowledgePo from '../../pageobject/knowledge/edit-knowledge.po';
import dynamicFieldsPo from '../../pageobject/common/dynamic-fields.po';
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import casePreviewPo from '../../pageobject/case/case-preview.po';


describe("Attachment", () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login("qtao");
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
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
    describe('[DRDMV-11713, DRDMV-9028]: Upload attachment via compose email & verify all attachments grid', async () => {
        let caseData, newCase;
        beforeAll(async () => {
            caseData = {
                "Requester": "araisin",
                "Summary": "Test case for DRDMV-11713",
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 1",
                "Assignee": "qtao"
            }
            await apiHelper.apiLogin('qkatawazi');
            newCase = await apiHelper.createCase(caseData);
        });
        it('[DRDMV-11713, DRDMV-9028]: Upload attachment via compose email & verify all attachments grid', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(newCase.displayId);
            await viewCasePo.clickOnEmailLink();

            await composeMail.addAttachment(['../../data/ui/attachment/demo.txt']);
            expect(await composeMail.getFileDisplayedFileName()).toContain('demo.txt');

            await composeMail.setToOrCCInputTextbox('To', 'franz@bwflabs.localdomain');
            expect(await composeMail.getToEmailPerson()).toContain('Franz Schwarz');
            await composeMail.setToOrCCInputTextbox('Cc', 'franz@bwflabs.localdomain');
            expect(await composeMail.getToEmailPerson()).toContain('Franz Schwarz');
            await composeMail.setEmailBody('This is email body');
            await composeMail.clickOnSendButton();

            await activityTabPo.clickShowMoreForEmailActivity();
            expect(await activityTabPo.getFirstPostContent()).toContain('This is email body');
            expect(await activityTabPo.getFirstPostContent()).toContain('Qianru Tao sent an email');
            expect(await activityTabPo.isAttachedFileNameDisplayed('demo.txt')).toBeTruthy('Attached file not Present');

            await viewCasePo.clickAttachmentsLink();
            expect(await utilCommon.deleteAlreadyDownloadedFile('demo.txt')).toBeTruthy('File is delete sucessfully');
            await attachmentBladePo.searchAndSelectCheckBox('demo');
            expect(await (await attachmentBladePo.getGridColumnValues('Attachments')).includes('demo')).toBeTruthy('demo txt file name is missing');
            await attachmentBladePo.clickDownloadButton();
            expect(await utilCommon.isFileDownloaded('demo.txt')).toBeTruthy('File is not downloaded.');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
        });
    });

    //kgaikwad
    it('[DRDMV-11710,DRDMV-11698]: Upload attachment from Social & verify all attachments grid', async () => {
        let filePath = '../../data/ui/attachment/bwfPdf.pdf';
        let randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseData = {
            "Requester": "araisin",
            "Summary": "Test case for DRDMV-8377RandVal" + randomStr,
            "Assigned Company": "Petramco",
            "Business Unit": "United States Support",
            "Support Group": "US Support 1",
            "Assignee": "qtao"
        }
        await apiHelper.apiLogin('qkatawazi');
        let newCase = await apiHelper.createCase(caseData);
        await navigationPage.gotoCaseConsole();
        await caseConsole.searchAndOpenCase(newCase.displayId);
        await activityTabPo.addActivityNote('CaseBodyText' + randomStr);
        await activityTabPo.addAttachment([filePath]);
        await activityTabPo.clickOnPostButton();
        expect(await activityTabPo.isAttachedFileNameDisplayed('bwfPdf.pdf')).toBeTruthy('Attached file name is missing');
        await viewCasePo.clickAttachmentsLink();
        expect(await attachmentBladePo.getTextOfColumnHeader('Attached to ')).toBe('Attached to', 'Attached to column header is missing');
        expect(await (await attachmentBladePo.getGridColumnValues('Attachments')).includes('bwfPdf')).toBeTruthy('Attachment file name is missing');
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
    describe('[DRDMV-11708]: Upload attachment from task activity & verify all attachments grid', async () => {
        let xlsxFilePath = '../../data/ui/attachment/bwfXlsx.xlsx';
        let wordFilePath = '../../data/ui/attachment/bwfWord1.rtf';
        let randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseData, manualTaskTemplateData, newCase;
        beforeAll(async () => {
            caseData = {
                "Requester": "araisin",
                "Summary": "CaseSummary" + randomStr,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
            }
            await apiHelper.apiLogin('qtao');
            newCase = await apiHelper.createCase(caseData);
            // Create Task Template
            manualTaskTemplateData = {
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
        });
        it('[DRDMV-11708]: Upload attachment from task activity & verify all attachments grid', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(newCase.displayId);
            await viewCasePo.clickAddTaskButton();
            await manageTaskPo.clickAddAdhocTaskButton();
            await adhoctaskTemplate.setSummary('AdhocTaskSummary' + randomStr);
            await adhoctaskTemplate.addAttachment([xlsxFilePath]);
            await adhoctaskTemplate.clickSaveAdhoctask();
            await utilityCommon.closePopUpMessage();
            await manageTaskPo.clickCloseButton();
            await viewCasePo.clickAttachmentsLink();
            expect(await (await attachmentBladePo.getGridColumnValues('Attachments')).includes('bwfXlsx')).toBeTruthy('Attachment file name is missing');
            expect(await (await attachmentBladePo.getGridColumnValues('Attached to')).includes('Task')).toBeTruthy('Attach to column value is missing');
            expect(await utilCommon.deleteAlreadyDownloadedFile('bwfXlsx.xlsx')).toBeTruthy('File is delete sucessfully');
            await attachmentBladePo.searchAndSelectCheckBox('bwfXlsx');
            await attachmentBladePo.clickDownloadButton();
            await attachmentBladePo.clickCloseButton();
        });
        it('[DRDMV-11708]: Upload attachment from task activity & verify all attachments grid', async () => {
            //Add Manual task and Automation Task in Case
            await viewCasePo.clickAddTaskButton();
            await manageTaskPo.addTaskFromTaskTemplate(manualTaskTemplateData.templateName);
            await manageTaskPo.clickTaskLink(manualTaskTemplateData.templateName);
            await activityTabPo.addActivityNote('AddNotes' + randomStr);
            await activityTabPo.addAttachment([wordFilePath]);
            await activityTabPo.clickOnPostButton();
            expect(await activityTabPo.isAttachedFileNameDisplayed('bwfWord1.rtf')).toBeTruthy('Attached file name is missing');
            await viewTaskPo.clickOnViewCase();
            await viewCasePo.clickAttachmentsLink();
            expect(await (await attachmentBladePo.getGridColumnValues('Attachments')).includes('bwfWord1')).toBeTruthy('Attachment file name is missing');
            expect(await (await attachmentBladePo.getGridColumnValues('Attached to')).includes('Social')).toBeTruthy('Attach to column value is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfWord1.rtf')).toBeTruthy('File is delete sucessfully');
            await attachmentBladePo.searchAndSelectCheckBox('bwfWord1');
            await attachmentBladePo.clickDownloadButton();
            expect(await utilityCommon.isFileDownloaded('bwfWord1.rtf')).toBeTruthy('File is not downloaded.');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfWord1.rtf')).toBeTruthy('File is delete sucessfully');
            await attachmentBladePo.clickCloseButton();
            await navigationPage.gotoPersonProfile();
            expect(await activityTabPo.isAttachedFileNameDisplayed('bwfWord1.rtf')).toBeTruthy('Attached file name is missing');
        });
        afterAll(async () => {
            await utilityCommon.closePopUpMessage();
        });
    });

    //kgaikwad
    describe('[DRDMV-11718,DRDMV-11720]: Large number of attachments verification', async () => {
        let fileName: string[];
        it('[DRDMV-11718,DRDMV-11720]: Create case with Large number of attachments', async () => {
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
        it('[DRDMV-11721,DRDMV-11746]: Multiple tasks on same case with attachments', async () => {
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
        it('[DRDMV-11714,DRDMV-11705]: Create case with attachment', async () => {
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
            await utilityCommon.closePopUpMessage();
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
        await browser.sleep(5000); // hard wait to download all files
        for (let j: number = 0; j < fileName.length; j++) {
            expect(await utilCommon.isFileDownloaded(fileName[j])).toBeTruthy('File is not downloaded.');
            expect(await utilCommon.deleteAlreadyDownloadedFile(fileName[j])).toBeTruthy('File is delete sucessfully');
        }
        await attachmentBladePo.clickCloseButton();
    });

    //kgaikwad
    describe('[DRDMV-11701,DRDMV-11706,DRDMV-11722]: Multiple attachments selection from different pages', async () => {
        it('[DRDMV-11701,DRDMV-11706,DRDMV-11722]: Uplaod 50 attachments', async () => {
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

    describe('[DRDMV-9032]: Negative -Verify large number of attachments. Click on Send button in Compose Email', async () => {
        let newCase;
        beforeAll(async () => {
            let randomString = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let caseData = {
                "Requester": "qdu",
                "Summary": "Test case for DRDMV-9028 RandVal" + randomString,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
            }
            await apiHelper.apiLogin('qtao');
            newCase = await apiHelper.createCase(caseData);
        });
        it('[DRDMV-9032]: Negative -Verify large number of attachments. Click on Send button in Compose Email', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(newCase.displayId);
            await viewCasePo.clickOnEmailLink();
            await composeMail.setToOrCCInputTextbox('To', 'franz@bwflabs.localdomain');
            await composeMail.setEmailBody("With mutiple attachmnents");
            let filesToUpload: string[] = [];
            for (let i = 0; i <= 20; i++) {
                filesToUpload.push('../../data/ui/attachment/demo.txt');
            }
            await composeMail.addAttachment(filesToUpload);
            await composeMail.clickOnSendButton();
            await utilityCommon.closePopUpMessage();
            await activityTabPo.clickShowMoreForEmailActivity();
            await activityTabPo.clickPlusIconOnMultipleAttachmentInActivity();
            expect(await activityTabPo.getAttachmentCount()).toBe(21);
        });
        afterAll(async () => {
            await composeMail.clickOnDiscardButton();
        });
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
        let year: string, month: string, date: string, finalDate;
        let objDate: Date = new Date();
        let numYear: number = objDate.getFullYear();
        year = new Number(numYear).toString();
        let numMonth: number = objDate.getUTCMonth() + 1;
        let month1 = new Number(numMonth);
        if (month1 <= 9) month = '0' + month1.toString();
        else month = month1.toString();
        let numDate: number = objDate.getDate();
        let date1 = new Number(numDate);
        if (date1 <= 9) date = '0' + date1.toString();
        else date = date1.toString();
        finalDate = date + '/' + month + '/' + year;
        await previewCasePo.clickGoToCaseButton();
        await viewCasePo.clickAttachmentsLink();
        expect(await utilCommon.deleteAlreadyDownloadedFile('bwfJpg.jpg')).toBeTruthy('File is delete sucessfully');
        await attachmentBladePo.searchAndSelectCheckBox('bwfJpg');
        expect(await attachmentBladePo.getTextOfColumnHeader('Attachments ')).toBe('Attachments', 'Attachment column header is missing');
        expect(await attachmentBladePo.getTextOfColumnHeader('Attached to ')).toBe('Attached to', 'Attached to column header is missing');
        expect(await attachmentBladePo.getTextOfColumnHeader('Media type ')).toBe('Media type', 'Media type  column header is missing');
        expect(await attachmentBladePo.getTextOfColumnHeader('Created date ')).toBe('Created date', 'Created date column header is missing');
        expect((await attachmentBladePo.getGridColumnValues('Attachments')).includes('bwfJpg')).toBeTruthy('Attachment file name is missing');
        expect((await attachmentBladePo.getGridColumnValues('Attached to')).includes('Case')).toBeTruthy('Attach to column value is missing');
        expect((await attachmentBladePo.getGridColumnValues('Media type')).includes('image/jpeg')).toBeTruthy('Media type column value is missing');
        expect((await attachmentBladePo.getGridColumnValues('Created date'))[0].includes(finalDate)).toBeTruthy('CreateDate is not present');
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
    describe('[DRDMV-15252]: Verify Category tier 4 and Label field is added on views', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let categName1 = 'Employee Relations';
        let categName2 = 'Compensation';
        let categName3 = 'Bonus';
        let categName4 = 'Retention Bonus';
        let label = 'Payroll';
        let summary= 'summaryDRDMV15252'+randomStr;
        let title= 'titleDRDMV15252'+randomStr;

        beforeAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });

        it('[DRDMV-15252]: Verify Category Tier 4 With Case ', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('adam');
            await createCasePo.setSummary(summary);
            await createCasePo.setLabel(label);
            await createCasePo.selectCategoryTier1(categName1);
            await createCasePo.selectCategoryTier2(categName2);
            await createCasePo.selectCategoryTier3(categName3);
            await createCasePo.selectCategoryTier4(categName4);
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect (await viewCasePo.getCategoryTier4Value()).toBe(categName4,'FailureMsg1: CategoryTier4 is displayed');
            expect (await viewCasePo.getlabel()).toBe(label,'FailureMsg2: Label is displayed');
            // Verify CategoryTier4 on Edit Case
            await viewCasePo.clickEditCaseButton();
            expect (await editCasePo.getCategoryTier4()).toBe(categName4,'FailureMsg3: CategoryTier4 is displayed');
            expect (await editCasePo.isCaseLabelValueDisplayed(label)).toBeTruthy('FailureMsg2: Case Label is missing');
            await editCasePo.clickOnCancelCaseButton();
        });

        it('[DRDMV-15252]: Verify Category Tier 4 With Task ', async () => {
            await viewCasePo.clickAddTaskButton();
            await manageTask.clickAddAdhocTaskButton();
            await adhoctaskTemplate.setSummary(summary);
            await adhoctaskTemplate.setDescription("Description");
            await adhoctaskTemplate.selectLabel(label);
            expect (await adhoctaskTemplate.getCategoryTier1()).toBe(categName1,'FailureMsg1: CategoryTier1 is displayed');
            expect (await adhoctaskTemplate.getCategoryTier2()).toBe(categName2,'FailureMsg2: CategoryTier2 is displayed');
            expect (await adhoctaskTemplate.getCategoryTier3()).toBe(categName3,'FailureMsg3: CategoryTier3 is displayed');
            expect (await adhoctaskTemplate.getCategoryTier4()).toBe(categName4,'FailureMsg4: CategoryTier4 is displayed');
            await adhoctaskTemplate.clickSaveAdhoctask();
            await manageTask.clickTaskLink(summary);
            expect (await viewTaskPo.getCategoryTier4Value()).toBe(categName4,'FailureMsg5: CategoryTier4 is displayed');
            expect (await viewTaskPo.getLabelValue()).toContain(label,'FailureMsg5: label is displayed');

            await viewTaskPo.clickOnEditTask();
            expect (await editTaskPo.getTaskCategoryTier4()).toBe(categName4,'FailureMsg6: CategoryTier4 is displayed');
            expect (await editTaskPo.isTaskLabelValueDisplayed(label)).toBeTruthy('FailureMsg5: Task label is displayed');
            await editTaskPo.clickOnCancelButton();
        });

        it('[DRDMV-15252]: Verify Category Tier 4 With Case Template ', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
            
            await createCasetemplatePo.setTemplateName(title);
            await createCasetemplatePo.setCompanyName('Petramco');
            await createCasetemplatePo.setCaseSummary(summary);
            await createCasetemplatePo.setLabelValue(label);
            await createCasetemplatePo.setCategoryTier1(categName1);
            await createCasetemplatePo.setCategoryTier2(categName2);
            await createCasetemplatePo.setCategoryTier3(categName3);
            await createCasetemplatePo.setCategoryTier4(categName4);
            
            await createCasetemplatePo.clickSaveCaseTemplate();
            
            expect (await viewCasetemplatePo.getCategoryTier4()).toBe(categName4,'FailureMsg7: CategoryTier4 is displayed');
            expect (await viewCasetemplatePo.getLabelValue()).toBe(label,'FailureMsg7: Label is displayed');
            await viewCasetemplatePo.clickOnEditCaseTemplateButton();
            expect (await editCasetemplatePo.getValueOfTier4()).toBe(categName4,'FailureMsg6: CategoryTier4 is displayed');
            expect (await editCasetemplatePo.isCaseTemplateLabelValueDisplayed(label)).toBeTruthy('FailureMsg6: label is missing');
            await editCasetemplatePo.clickOnCancelButton();
            await utilCommon.clickOnWarningOk();
        });
     
        it('[DRDMV-15252]: Verify Category Tier 4 With Assignment Mapping ', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', 'Configure Case Assignments - Business Workflows');
            await assignmentsConfigConsolePo.clickOnCreateAssignmentConfiguration();
            await createAssignmentsConfigPo.setAssignmentMapName(title);
            await createAssignmentsConfigPo.setCompany("Petramco");
            await createAssignmentsConfigPo.setCategoryTier1(categName1);
            await createAssignmentsConfigPo.setCategoryTier2(categName2);
            await createAssignmentsConfigPo.setCategoryTier3(categName3);
            await createAssignmentsConfigPo.setCategoryTier4(categName4);
            await createAssignmentsConfigPo.setLabel(label);
            await createAssignmentsConfigPo.setSupportCompany("Petramco");
            await createAssignmentsConfigPo.setBusinessUnit('Canada Support');
            await createAssignmentsConfigPo.setSupportGroup("CA Support 1");
            await createAssignmentsConfigPo.clickonSaveButton();

            await assignmentsConfigConsolePo.searchAndClickOnAssignmentConfig(title);
            expect (await editAssignmentsConfigPo.getCategoryTier4()).toBe(categName4,'FailureMsg8: CategoryTier4 is displayed');
            expect (await editAssignmentsConfigPo.isLabelValueDisplayed(label)).toBeTruthy('FailureMsg6: label is missing');

            await editAssignmentsConfigPo.clickOnCancelButton();
        });

        it('[DRDMV-15252]: Verify Category Tier 4 With Case Read Access ', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Read Access', 'Case Read Access Configuration - Business Workflows');
            await consoleReadAcess.clickOnReadAccessConfiguration();
            await addReadAccess.setReadAccessConfigurationName(title);
            await addReadAccess.selectCompany('Petramco');
            await addReadAccess.selectSupportCompany('Petramco');
            await addReadAccess.selectBusinessUnit('Canada Support');
            await addReadAccess.selectSupportGroup('CA Support 1');
            await addReadAccess.selectCategoryTier1(categName1);
            await addReadAccess.selectCategoryTier2(categName2);
            await addReadAccess.selectCategoryTier3(categName3);
            await addReadAccess.selectCategoryTier4(categName4);
            await addReadAccess.selectLabel(label);
            await addReadAccess.clickOnSave();
            await utilGrid.searchAndOpenHyperlink(title);
            expect (await editReadAccess.getCategoryTier4()).toBe(categName4,'FailureMsg8: CategoryTier4 is displayed');
            expect (await editReadAccess.isLabelValueDisplayed(label)).toBeTruthy('FailureMsg6: label is missing');
            await editReadAccess.clickOnCancel();
        });

        it('[DRDMV-15252]: Verify Category Tier 4 With Document Library ', async () => {
        let filePath = '../../../data/ui/attachment/demo.txt';
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Document Management--Library', 'Document Library Console - Business Workflows');
        await createDocumentLibraryPo.openAddNewDocumentBlade();
        await createDocumentLibraryPo.addAttachment(filePath);
        await createDocumentLibraryPo.setTitle(title);
        await createDocumentLibraryPo.selectCompany('Petramco');
        await createDocumentLibraryPo.selectBusinessUnit('Canada Support');
        await createDocumentLibraryPo.selectOwnerGroup('CA Support 1');
        await createDocumentLibraryPo.selectCategoryTier1(categName1);
        await createDocumentLibraryPo.selectCategoryTier2(categName2);
        await createDocumentLibraryPo.selectCategoryTier3(categName3);
        await createDocumentLibraryPo.selectCategoryTier4(categName4);
        await createDocumentLibraryPo.clickOnSaveButton();
        await utilGrid.searchRecord(title);
        await documentLibraryConsolePo.searchAndOpenDocumentLibrary(title);
        expect (await editDocumentLibraryPo.getCategoryTier4()).toBe(categName4,'FailureMsg8: CategoryTier4 is displayed');
        });

        it('[DRDMV-15252]: Verify Category Tier 4 With Knowledge Article ', async () => {
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate('Reference');
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField('Knowledge' + randomStr);
            await createKnowledgePage.setReferenceValue('KnowledgeReference' + randomStr);
            await createKnowledgePage.selectKnowledgeSet('HR');
            await createKnowledgePage.selectCategoryTier1Option(categName1);
            await createKnowledgePage.selectCategoryTier2Option(categName2);
            await createKnowledgePage.selectCategoryTier3Option(categName3);
            await createKnowledgePage.selectCategoryTier4Option(categName4);
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await previewKnowledgePo.clickGoToArticleButton();
            expect (await viewKnowledgeArticlePo.getCategoryTier4Value()).toBe(categName4,'FailureMsg1: CategoryTier4 is displayed');
        });

        it('[DRDMV-15252]: Verify Category Tier 4 With SLM Build Expression ', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
        await serviceTargetConfig.createServiceTargetConfig('SVT with all fields', 'Petramco', 'Case Management');
        await slmExpressionBuilder.selectFields('category Tier 4');
        await slmExpressionBuilder.clearSearchField();
        await slmExpressionBuilder.selectFields('Label');
        });

        it('[DRDMV-15252]: Verify Category Tier 4 With Approval Configuration ', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Approvals--Approval Configuration', 'Approval Configuration - Administration - Business Workflows');
            await approvalConfigurationPage.searchAndOpenApprovalConfiguration('com.bmc.dsm.case-lib:Case');
            expect(await approvalConfigurationPage.isCreateNewApprovalFlowPopUpDisplayed()).toBeTruthy();
            expect(await approvalConfigurationPage.getCreateNewApprovalFlowPopUpTitle()).toContain('Edit Approval Flow');
            await approvalConfigurationPage.clickApprovalConfigurationTab('Approval Flows');
            await approvalConfigurationPage.clickApprovalGroup('BWFA Group');
            // await approvalConfigurationPage.deleteApprovalConfiguration('Approval Flows');
            await approvalConfigurationPage.clickAddNewFlowLinkButton();
            await approvalConfigurationPage.selectApprovalFlowOption('General Approval Flow');
            await approvalConfigurationPage.clickExpressionLink();

            await browser.sleep(5000); // sleep added for expression builder loading time
            expect(await approvalConfigurationPage.isCreateNewApprovalFlowPopUpDisplayed()).toBeTruthy();
            expect(await approvalConfigurationPage.getCreateNewApprovalFlowPopUpTitle()).toContain('Create New Approval Flow');
            await browser.sleep(3000); // sleep added for expression builder loading time
            await approvalConfigurationPage.searchExpressionFieldOption('Category Tier 4');
            
            await approvalConfigurationPage.clickRecordOption('Record Definition');
            await approvalConfigurationPage.clickRecordOption('Case');
            
            await browser.sleep(2000); // sleep added for expression builder loading time
            await approvalConfigurationPage.selectExpressionFieldOption();
            await browser.sleep(2000); // sleep added for expression builder loading time
            await approvalConfigurationPage.selectExpressionOperator('=');
            
            await approvalConfigurationPage.searchExpressionFieldOption('LABEL_ID');
            await browser.sleep(2000); // sleep added for expression builder loading time
            await approvalConfigurationPage.selectExpressionFieldOption();
            await browser.sleep(2000); // sleep added for expression builder loading time
        });

        it('[DRDMV-15252]: Verify Category Tier 4 With Task Template ', async () => {
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows')).toEqual('Task Templates - Business Workflows');
            await selectTaskTemplate.clickOnManualTaskTemplateButton();
            await createTasktemplatePo.setTemplateName(title);
            await createTasktemplatePo.setTaskSummary(summary);
            await createTasktemplatePo.selectCompanyByName('Petramco');
            await createTasktemplatePo.selectTaskCategoryTier1(categName1);
            await createTasktemplatePo.selectTaskCategoryTier2(categName2);
            await createTasktemplatePo.selectTaskCategoryTier3(categName3);
            await createTasktemplatePo.selectTaskCategoryTier4(categName4);
            await createTasktemplatePo.selectLabel(label);
            await createTasktemplatePo.clickOnSaveTaskTemplate();
            expect (await viewTasktemplatePo.getCategoryTier4Value()).toBe(categName4,'FailureMsg7: CategoryTier4 is displayed');
            expect (await viewTasktemplatePo.getLabelValue()).toBe(label,'FailureMsg7: label is displayed');
            await viewTasktemplatePo.clickOnEditLink();
            expect (await editTasktemplatePo.getTaskCategoryTier4()).toBe(categName4,'FailureMsg8: CategoryTier4 is displayed');
            expect (await editTasktemplatePo.getLabelValue()).toBe(label,'FailureMsg8: label is displayed');

            await navigationPage.gotoCaseConsole();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qtao');

        });
    });

    //kgaikwad
	describe('[DRDMV-23413]: Verify Thai Character On Multiple Screens', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTempateName = 'caseTemplateNameDRDMV23413' +randomStr;
        let newCase1;
        let newCase2;
        let caseData1;
        let caseTemplateData;
        let docLibTitle = 'docLibTitleDRDMV23413'+randomStr;
        let knowledgeArticleData;
        let newCaseTemplate;
        let fileName1 = '1!@#$%^&()+_-={}[}.,123.jpg';
        let fileName2 = '1ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf';
        let fileName3 = '1ทรัพยากรมนุษย์-นโยบายการแพทย์-รายงานการต__รวจสอบ.docx';
        let fileName4 = '1Google+Translate+เป็นบริการแปลระบบประสาทด้วยเครื่องฟรีหลายภาษาที่พัฒนาโดย+Google.xlsx';

        let fileName5 = '2!@#$%^&()+_-={}[}.,123.jpg';
        let fileName6 = '2ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf';
        let fileName7 = '2ทรัพยากรมนุษย์-นโยบายการแพทย์-รายงานการต__รวจสอบ.docx';
        let fileName8 = '2Google+Translate+เป็นบริการแปลระบบประสาทด้วยเครื่องฟรีหลายภาษาที่พัฒนาโดย+Google.xlsx';

        let fileName9 = '3!@#$%^&()+_-={}[}.,123.jpg';
        let fileName10 = '3ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf';
        let fileName11 = '3ทรัพยากรมนุษย์-นโยบายการแพทย์-รายงานการต__รวจสอบ.docx';
        let fileName12 = '3Google+Translate+เป็นบริการแปลระบบประสาทด้วยเครื่องฟรีหลายภาษาที่พัฒนาโดย+Google.xlsx';

        let addNoteRandomText = 'addNoteDRDMV23413'+randomStr;
        
        beforeAll(async () => {

            caseTemplateData = {
                "templateName": 'caseTemplateName1',
                "templateSummary": 'Case Template Summary',
                "categoryTier1": 'Phones',
                "categoryTier2": 'Infrastructure',
                "templateStatus": "Draft",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qfeng",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            };

            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();

            await apiHelper.apiLogin('qkatawazi');
            caseTemplateData.templateName = caseTempateName;
            newCaseTemplate = await apiHelper.createCaseTemplate(caseTemplateData);
            await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'MULTIPLE_ATTACHMENTS');
           
            //  Create Case
            caseData1 = {
                "Requester": "araisin",
                "Summary": "Test case for DRDMV23413" + randomStr,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 1",
                "Assignee": "qtao",
            }
            newCase1 = await apiHelper.createCase(caseData1);
            newCase2 = await apiHelper.createCase(caseData1);
            
            // Create Document Library
            let publishDocData = {
                docLibTitle: 'docLibTitle',
                company: 'Petramco',
                businessUnit: "United States Support",
                ownerGroup: "US Support 1",
            }

            publishDocData.docLibTitle = docLibTitle+1;
            let docLib1 = await apiHelper.createDocumentLibrary(publishDocData, `e2e/data/ui/attachment/${fileName9}`);
            await apiHelper.publishDocumentLibrary(docLib1);

            publishDocData.docLibTitle =docLibTitle+2;
            let docLib2 = await apiHelper.createDocumentLibrary(publishDocData, `e2e/data/ui/attachment/${fileName10}`);
            await apiHelper.publishDocumentLibrary(docLib2);

            publishDocData.docLibTitle =docLibTitle+3;
            let docLib3 = await apiHelper.createDocumentLibrary(publishDocData, `e2e/data/ui/attachment/${fileName11}`);
            await apiHelper.publishDocumentLibrary(docLib3);

            publishDocData.docLibTitle =docLibTitle+4;
            let docLib4 = await apiHelper.createDocumentLibrary(publishDocData, `e2e/data/ui/attachment/${fileName12}`);
            await apiHelper.publishDocumentLibrary(docLib4);
        
        // Create Knowledge
            let articleData = {
                "knowledgeSet": "HR",
                "title": "KATitle",
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United States Support",
                "assigneeSupportGroup": "US Support 1",
                "assignee": "qtao"
            }
            knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
        });

        it('[DRDMV-23413]: Verify Attachment With Case Description Attach Button ', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(newCase1.displayId);
            await viewCasePo.clickEditCaseButton();
            await editCasePo.addDescriptionAttachment([`../../data/ui/attachment/${fileName1}`,`../../data/ui/attachment/${fileName2}`,`../../data/ui/attachment/${fileName3}`,`../../data/ui/attachment/${fileName4}`]);
            await editCasePo.clickSaveCase();
            await viewCasePo.clickShowMoreShowLessLink();
            
            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName1}`)).toBeTruthy(`FailuerMsg: ${fileName1} File is delete sucessfully`);
            await viewCasePo.clickOnAttachedDocumentFile(`${fileName1}`);
            expect(await utilityCommon.isFileDownloaded(`${fileName1}`)).toBeTruthy(`FailuerMsg: ${fileName1} File is not downloaded.`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile('1ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf')).toBeTruthy(`FailuerMsg: ${fileName2} File is delete sucessfully`);
            await viewCasePo.clickOnAttachedDocumentFile(`${fileName2}`);
            expect(await utilityCommon.isFileDownloaded('1ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf')).toBeTruthy(`FailuerMsg: '1ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf' File is not downloaded.`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName3}`)).toBeTruthy(`FailuerMsg: ${fileName3} File is delete sucessfully`);
            await viewCasePo.clickOnAttachedDocumentFile(`${fileName3}`);
            expect(await utilityCommon.isFileDownloaded(`${fileName3}`)).toBeTruthy(`FailuerMsg: ${fileName3} File is not downloaded.`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName4}`)).toBeTruthy(`FailuerMsg: ${fileName4} File is delete sucessfully`);
            await viewCasePo.clickOnAttachedDocumentFile(`${fileName4}`);
            expect(await utilityCommon.isFileDownloaded(`${fileName4}`)).toBeTruthy(`FailuerMsg: ${fileName4} File is not downloaded.`);

            await viewCasePo.clickAttachmentsLink();
            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName1}`)).toBeTruthy(`FailuerMsg: ${fileName1} File is delete sucessfully`);
            await attachmentBladePo.selectCheckBox(1);
            await attachmentBladePo.clickDownloadButton();
            await attachmentBladePo.selectCheckBox(1);
            expect(await utilityCommon.isFileDownloaded(`${fileName1}`)).toBeTruthy(`FailuerMsg: ${fileName1} File is not downloaded.`);
            
            expect(await utilityCommon.deleteAlreadyDownloadedFile('1ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf')).toBeTruthy(`FailuerMsg: ${fileName2} File is delete sucessfully`);
            await attachmentBladePo.selectCheckBox(2);
            await attachmentBladePo.clickDownloadButton();
            await attachmentBladePo.selectCheckBox(2);
            expect(await utilityCommon.isFileDownloaded('1ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf')).toBeTruthy(`FailuerMsg: '1ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf' File is not downloaded.`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName3}`)).toBeTruthy(`FailuerMsg: ${fileName3} File is delete sucessfully`);
            await attachmentBladePo.selectCheckBox(3);
            await attachmentBladePo.clickDownloadButton();
            await attachmentBladePo.selectCheckBox(3);
            expect(await utilityCommon.isFileDownloaded(`${fileName3}`)).toBeTruthy(`FailuerMsg: ${fileName3} File is not downloaded.`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName4}`)).toBeTruthy(`FailuerMsg: ${fileName4} File is delete sucessfully`);
            await attachmentBladePo.selectCheckBox(4);
            await attachmentBladePo.clickDownloadButton();
            await attachmentBladePo.selectCheckBox(4);
            expect(await utilityCommon.isFileDownloaded(`${fileName4}`)).toBeTruthy(`FailuerMsg: ${fileName4} File is not downloaded.`);
            await attachmentBladePo.clickCloseButton();
        });

        it('[DRDMV-23413]: Verify Locally Attachment On Case Activity Tab', async () => {
            await activityTabPo.addActivityNote(addNoteRandomText);
            await activityTabPo.addAttachment([`../../data/ui/attachment/${fileName5}`,`../../data/ui/attachment/${fileName6}`,`../../data/ui/attachment/${fileName7}`,`../../data/ui/attachment/${fileName8}`]);
            await activityTabPo.clickOnPostButton();
            await activityTabPo.clickShowMoreLinkInAttachmentActivity(1);

            expect(await activityTabPo.isAttachedFileNameDisplayed(fileName5)).toBeTruthy(`${fileName5} Attached file name is missing`);
            expect(await activityTabPo.isAttachedFileNameDisplayed(fileName6)).toBeTruthy(`${fileName6} Attached file name is missing`);
            expect(await activityTabPo.isAttachedFileNameDisplayed(fileName7)).toBeTruthy(`${fileName7} Attached file name is missing`);
            expect(await activityTabPo.isAttachedFileNameDisplayed(fileName8)).toBeTruthy(`${fileName8} Attached file name is missing`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName5}`)).toBeTruthy(`FailuerMsg: ${fileName5} File is delete sucessfully`);
            await activityTabPo.clickAttachedFile(`${fileName5}`);
            expect(await utilityCommon.isFileDownloaded(`${fileName5}`)).toBeTruthy(`FailuerMsg: ${fileName5} File is not downloaded.`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile('2ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf')).toBeTruthy(`FailuerMsg: 2ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf File is delete sucessfully`);
            await activityTabPo.clickAttachedFile(`${fileName6}`);
            expect(await utilityCommon.isFileDownloaded('2ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf')).toBeTruthy(`FailuerMsg: '1ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf' File is not downloaded.`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName7}`)).toBeTruthy(`FailuerMsg: ${fileName7} File is delete sucessfully`);
            await activityTabPo.clickAttachedFile(`${fileName7}`);
            expect(await utilityCommon.isFileDownloaded(`${fileName7}`)).toBeTruthy(`FailuerMsg: ${fileName7} File is not downloaded.`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName8}`)).toBeTruthy(`FailuerMsg: ${fileName8} File is delete sucessfully`);
            await activityTabPo.clickAttachedFile(`${fileName8}`);
            expect(await utilityCommon.isFileDownloaded(`${fileName8}`)).toBeTruthy(`FailuerMsg: ${fileName8} File is not downloaded.`);
            
            await viewCasePo.clickAttachmentsLink();
            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName5}`)).toBeTruthy(`FailuerMsg: ${fileName5} File is delete sucessfully`);
            await attachmentBladePo.selectCheckBox(5);
            await attachmentBladePo.clickDownloadButton();
            await attachmentBladePo.selectCheckBox(5);
            expect(await utilityCommon.isFileDownloaded(`${fileName5}`)).toBeTruthy(`FailuerMsg: ${fileName5} File is not downloaded.`);
            
            expect(await utilityCommon.deleteAlreadyDownloadedFile('2ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf')).toBeTruthy(`FailuerMsg: 2ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf File is delete sucessfully`);
            await attachmentBladePo.selectCheckBox(6);
            await attachmentBladePo.clickDownloadButton();
            await attachmentBladePo.selectCheckBox(6);
            expect(await utilityCommon.isFileDownloaded('2ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf')).toBeTruthy(`FailuerMsg: '2ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf' File is not downloaded.`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName7}`)).toBeTruthy(`FailuerMsg: ${fileName7} File is delete sucessfully`);
            await attachmentBladePo.selectCheckBox(7);
            await attachmentBladePo.clickDownloadButton();
            await attachmentBladePo.selectCheckBox(7);
            expect(await utilityCommon.isFileDownloaded(`${fileName7}`)).toBeTruthy(`FailuerMsg: ${fileName7} File is not downloaded.`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName8}`)).toBeTruthy(`FailuerMsg: ${fileName8} File is delete sucessfully`);
            await attachmentBladePo.selectCheckBox(8);
            await attachmentBladePo.clickDownloadButton();
            await attachmentBladePo.selectCheckBox(8);
            expect(await utilityCommon.isFileDownloaded(`${fileName8}`)).toBeTruthy(`FailuerMsg: ${fileName8} File is not downloaded.`);
            await attachmentBladePo.clickCloseButton();
        });

        it('[DRDMV-23413]: Verify Document Libaray Attachment On Case Activity Tab ', async () => {
            await activityTabPo.addActivityNote(addNoteRandomText);
            await activityTabPo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(docLibTitle+1);
            await activityTabPo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(docLibTitle+2);
            await activityTabPo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(docLibTitle+3);
            await activityTabPo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(docLibTitle+4);
            await activityTabPo.clickOnPostButton();
            await activityTabPo.clickShowMoreLinkInAttachmentActivity(1);


            expect(await activityTabPo.isAttachedFileNameDisplayed(fileName9)).toBeTruthy(`${fileName9} Attached file name is missing`);
            expect(await activityTabPo.isAttachedFileNameDisplayed(fileName10)).toBeTruthy(`${fileName10} Attached file name is missing`);
            expect(await activityTabPo.isAttachedFileNameDisplayed(fileName11)).toBeTruthy(`${fileName11} Attached file name is missing`);
            expect(await activityTabPo.isAttachedFileNameDisplayed(fileName12)).toBeTruthy(`${fileName12} Attached file name is missing`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName9}`)).toBeTruthy(`FailuerMsg: ${fileName9} File is delete sucessfully`);
            await activityTabPo.clickAttachedFile(`${fileName9}`);
            expect(await utilityCommon.isFileDownloaded(`${fileName9}`)).toBeTruthy(`FailuerMsg: ${fileName9} File is not downloaded.`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile('3ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf')).toBeTruthy(`FailuerMsg: ${fileName10} File is delete sucessfully`);
            await activityTabPo.clickAttachedFile(`${fileName10}`);
            expect(await utilityCommon.isFileDownloaded('3ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf')).toBeTruthy(`FailuerMsg: '1ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf' File is not downloaded.`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName11}`)).toBeTruthy(`FailuerMsg: ${fileName11} File is delete sucessfully`);
            await activityTabPo.clickAttachedFile(`${fileName11}`);
            expect(await utilityCommon.isFileDownloaded(`${fileName11}`)).toBeTruthy(`FailuerMsg: ${fileName11} File is not downloaded.`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName12}`)).toBeTruthy(`FailuerMsg: ${fileName12} File is delete sucessfully`);
            await activityTabPo.clickAttachedFile(`${fileName12}`);
            expect(await utilityCommon.isFileDownloaded(`${fileName12}`)).toBeTruthy(`FailuerMsg: ${fileName12} File is not downloaded.`);
            
            await viewCasePo.clickAttachmentsLink();
            expect(await attachmentBladePo.isCheckBoxSelected(fileName12)).toBeFalsy(`${fileName12} CheckBox is selected`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName9}`)).toBeTruthy(`FailuerMsg: ${fileName9} File is delete sucessfully`);
            await attachmentBladePo.selectCheckBox(9);
            await attachmentBladePo.clickDownloadButton();
            await attachmentBladePo.selectCheckBox(9);
            expect(await utilityCommon.isFileDownloaded(`${fileName9}`)).toBeTruthy(`FailuerMsg: ${fileName9} File is not downloaded.`);
            
            expect(await utilityCommon.deleteAlreadyDownloadedFile('3ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf')).toBeTruthy(`FailuerMsg: 3ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf File is delete sucessfully`);
            await attachmentBladePo.selectCheckBox(10);
            await attachmentBladePo.clickDownloadButton();
            await attachmentBladePo.selectCheckBox(10);
            expect(await utilityCommon.isFileDownloaded('3ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf')).toBeTruthy(`FailuerMsg: '3ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf' File is not downloaded.`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName11}`)).toBeTruthy(`FailuerMsg: ${fileName11} File is delete sucessfully`);
            await attachmentBladePo.selectCheckBox(11);
            await attachmentBladePo.clickDownloadButton();
            await attachmentBladePo.selectCheckBox(11);
            expect(await utilityCommon.isFileDownloaded(`${fileName11}`)).toBeTruthy(`FailuerMsg: ${fileName11} File is not downloaded.`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName12}`)).toBeTruthy(`FailuerMsg: ${fileName12} File is delete sucessfully`);
            await attachmentBladePo.selectCheckBox(12);
            await attachmentBladePo.clickDownloadButton();
            await attachmentBladePo.selectCheckBox(12);
            expect(await utilityCommon.isFileDownloaded(`${fileName12}`)).toBeTruthy(`FailuerMsg: ${fileName12} File is not downloaded.`);
            await attachmentBladePo.clickCloseButton();
        });

        it('[DRDMV-23413]: Verify Attachment With Task Description Attach Button ', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(newCase2.displayId);
            await viewCasePo.clickAddTaskButton();
            await manageTaskPo.clickAddAdhocTaskButton();
            await adhoctaskTemplate.setSummary('AdhocTaskSummaryDRDMV15252');
            await adhoctaskTemplate.clickSaveAdhoctask();
            await manageTaskPo.clickTaskLink('AdhocTaskSummaryDRDMV15252');

            await viewTaskPo.clickOnEditTask();
            await editTaskPo.addAttachment([`../../data/ui/attachment/${fileName1}`,`../../data/ui/attachment/${fileName2}`,`../../data/ui/attachment/${fileName3}`,`../../data/ui/attachment/${fileName4}`]);
            await editTaskPo.clickOnSaveButton();
            await viewCasePo.clickShowMoreShowLessLink();
            
            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName1}`)).toBeTruthy(`FailuerMsg: ${fileName1} File is delete sucessfully`);
            await viewTaskPo.isAttachedFileNamePresent(fileName1);
            await viewTaskPo.clickOnAttachedDocumentFile(`${fileName1}`);
            expect(await utilityCommon.isFileDownloaded(`${fileName1}`)).toBeTruthy(`FailuerMsg: ${fileName1} File is not downloaded.`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile('1ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf')).toBeTruthy(`FailuerMsg: ${fileName2} File is delete sucessfully`);
            await viewTaskPo.isAttachedFileNamePresent(fileName2);
            await viewTaskPo.clickOnAttachedDocumentFile(`${fileName2}`);
            expect(await utilityCommon.isFileDownloaded('1ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf')).toBeTruthy(`FailuerMsg: '1ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf' File is not downloaded.`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName3}`)).toBeTruthy(`FailuerMsg: ${fileName3} File is delete sucessfully`);
            await viewTaskPo.isAttachedFileNamePresent(fileName3);
            await viewTaskPo.clickOnAttachedDocumentFile(`${fileName3}`);
            expect(await utilityCommon.isFileDownloaded(`${fileName3}`)).toBeTruthy(`FailuerMsg: ${fileName3} File is not downloaded.`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName4}`)).toBeTruthy(`FailuerMsg: ${fileName4} File is delete sucessfully`);
            await viewTaskPo.isAttachedFileNamePresent(fileName4);
            await viewTaskPo.clickOnAttachedDocumentFile(`${fileName4}`);
            expect(await utilityCommon.isFileDownloaded(`${fileName4}`)).toBeTruthy(`FailuerMsg: ${fileName4} File is not downloaded.`);
        });

        it('[DRDMV-23413]: Verify Locally Attachment On Task Activity Tab', async () => {
            await activityTabPo.addActivityNote(addNoteRandomText);
            await activityTabPo.addAttachment([`../../data/ui/attachment/${fileName5}`,`../../data/ui/attachment/${fileName6}`,`../../data/ui/attachment/${fileName7}`,`../../data/ui/attachment/${fileName8}`]);
            await activityTabPo.clickOnPostButton();
            await activityTabPo.clickShowMoreLinkInAttachmentActivity(1);

            expect(await activityTabPo.isAttachedFileNameDisplayed(fileName5)).toBeTruthy(`${fileName5} Attached file name is missing`);
            expect(await activityTabPo.isAttachedFileNameDisplayed(fileName6)).toBeTruthy(`${fileName6} Attached file name is missing`);
            expect(await activityTabPo.isAttachedFileNameDisplayed(fileName7)).toBeTruthy(`${fileName7} Attached file name is missing`);
            expect(await activityTabPo.isAttachedFileNameDisplayed(fileName8)).toBeTruthy(`${fileName8} Attached file name is missing`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName5}`)).toBeTruthy(`FailuerMsg: ${fileName5} File is delete sucessfully`);
            await activityTabPo.clickAttachedFile(`${fileName5}`);
            expect(await utilityCommon.isFileDownloaded(`${fileName5}`)).toBeTruthy(`FailuerMsg: ${fileName5} File is not downloaded.`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile('2ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf')).toBeTruthy(`FailuerMsg: 2ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf File is delete sucessfully`);
            await activityTabPo.clickAttachedFile(`${fileName6}`);
            expect(await utilityCommon.isFileDownloaded('2ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf')).toBeTruthy(`FailuerMsg: 2ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf File is not downloaded.`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName7}`)).toBeTruthy(`FailuerMsg: ${fileName7} File is delete sucessfully`);
            await activityTabPo.clickAttachedFile(`${fileName7}`);
            expect(await utilityCommon.isFileDownloaded(`${fileName7}`)).toBeTruthy(`FailuerMsg: ${fileName7} File is not downloaded.`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName8}`)).toBeTruthy(`FailuerMsg: ${fileName8} File is delete sucessfully`);
            await activityTabPo.clickAttachedFile(`${fileName8}`);
            expect(await utilityCommon.isFileDownloaded(`${fileName8}`)).toBeTruthy(`FailuerMsg: ${fileName8} File is not downloaded.`);
        });

        it('[DRDMV-23413]: Verify Document Libaray Attachment On Task Activity Tab ', async () => {
            await activityTabPo.addActivityNote(addNoteRandomText);
            await activityTabPo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(docLibTitle+1);
            await activityTabPo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(docLibTitle+2);
            await activityTabPo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(docLibTitle+3);
            await activityTabPo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(docLibTitle+4);
            await activityTabPo.clickOnPostButton();
            await activityTabPo.clickShowMoreLinkInAttachmentActivity(1);

            expect(await activityTabPo.isAttachedFileNameDisplayed(fileName9)).toBeTruthy(`${fileName9} Attached file name is missing`);
            expect(await activityTabPo.isAttachedFileNameDisplayed(fileName10)).toBeTruthy(`${fileName10} Attached file name is missing`);
            expect(await activityTabPo.isAttachedFileNameDisplayed(fileName11)).toBeTruthy(`${fileName11} Attached file name is missing`);
            expect(await activityTabPo.isAttachedFileNameDisplayed(fileName12)).toBeTruthy(`${fileName12} Attached file name is missing`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName9}`)).toBeTruthy(`FailuerMsg: ${fileName9} File is delete sucessfully`);
            await activityTabPo.clickAttachedFile(`${fileName9}`);
            expect(await utilityCommon.isFileDownloaded(`${fileName9}`)).toBeTruthy(`FailuerMsg: ${fileName9} File is not downloaded.`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile('3ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf')).toBeTruthy(`FailuerMsg: 3ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf File is delete sucessfully`);
            await activityTabPo.clickAttachedFile(`${fileName10}`);
            expect(await utilityCommon.isFileDownloaded('3ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf')).toBeTruthy(`FailuerMsg: '3ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf' File is not downloaded.`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName11}`)).toBeTruthy(`FailuerMsg: ${fileName11} File is delete sucessfully`);
            await activityTabPo.clickAttachedFile(`${fileName11}`);
            expect(await utilityCommon.isFileDownloaded(`${fileName11}`)).toBeTruthy(`FailuerMsg: ${fileName11} File is not downloaded.`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName12}`)).toBeTruthy(`FailuerMsg: ${fileName12} File is delete sucessfully`);
            await activityTabPo.clickAttachedFile(`${fileName12}`);
            expect(await utilityCommon.isFileDownloaded(`${fileName12}`)).toBeTruthy(`FailuerMsg: ${fileName12} File is not downloaded.`);
        });

        it('[DRDMV-23413]: Verify Files On Attachment Blade ', async () => {
            await viewTaskPo.clickOnViewCase();
            await viewCasePo.clickAttachmentsLink();

            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName1}`)).toBeTruthy(`FailuerMsg: ${fileName1} File is delete sucessfully`);
            await attachmentBladePo.selectCheckBox(1);
            await attachmentBladePo.clickDownloadButton();
            await attachmentBladePo.selectCheckBox(1);
            expect(await utilityCommon.isFileDownloaded(`${fileName1}`)).toBeTruthy(`FailuerMsg: ${fileName1} File is not downloaded.`);
            
            expect(await utilityCommon.deleteAlreadyDownloadedFile('1ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf')).toBeTruthy(`FailuerMsg: ${fileName2} File is delete sucessfully`);
            await attachmentBladePo.selectCheckBox(2);
            await attachmentBladePo.clickDownloadButton();
            await attachmentBladePo.selectCheckBox(2);
            expect(await utilityCommon.isFileDownloaded('1ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf')).toBeTruthy(`FailuerMsg: '1ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf' File is not downloaded.`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName3}`)).toBeTruthy(`FailuerMsg: ${fileName3} File is delete sucessfully`);
            await attachmentBladePo.selectCheckBox(3);
            await attachmentBladePo.clickDownloadButton();
            await attachmentBladePo.selectCheckBox(3);
            expect(await utilityCommon.isFileDownloaded(`${fileName3}`)).toBeTruthy(`FailuerMsg: ${fileName3} File is not downloaded.`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName4}`)).toBeTruthy(`FailuerMsg: ${fileName4} File is delete sucessfully`);
            await attachmentBladePo.selectCheckBox(4);
            await attachmentBladePo.clickDownloadButton();
            await attachmentBladePo.selectCheckBox(4);
            expect(await utilityCommon.isFileDownloaded(`${fileName4}`)).toBeTruthy(`FailuerMsg: ${fileName4} File is not downloaded.`);
       
            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName5}`)).toBeTruthy(`FailuerMsg: ${fileName5} File is delete sucessfully`);
            await attachmentBladePo.selectCheckBox(5);
            await attachmentBladePo.clickDownloadButton();
            await attachmentBladePo.selectCheckBox(5);
            expect(await utilityCommon.isFileDownloaded(`${fileName5}`)).toBeTruthy(`FailuerMsg: ${fileName5} File is not downloaded.`);
            
            expect(await utilityCommon.deleteAlreadyDownloadedFile('2ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf')).toBeTruthy(`FailuerMsg: '2ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf' File is delete sucessfully`);
            await attachmentBladePo.selectCheckBox(6);
            await attachmentBladePo.clickDownloadButton();
            await attachmentBladePo.selectCheckBox(6);
            expect(await utilityCommon.isFileDownloaded('2ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf')).toBeTruthy(`FailuerMsg: '2ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf' File is not downloaded.`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName7}`)).toBeTruthy(`FailuerMsg: ${fileName7} File is delete sucessfully`);
            await attachmentBladePo.selectCheckBox(7);
            await attachmentBladePo.clickDownloadButton();
            await attachmentBladePo.selectCheckBox(7);
            expect(await utilityCommon.isFileDownloaded(`${fileName7}`)).toBeTruthy(`FailuerMsg: ${fileName7} File is not downloaded.`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName8}`)).toBeTruthy(`FailuerMsg: ${fileName8} File is delete sucessfully`);
            await attachmentBladePo.selectCheckBox(8);
            await attachmentBladePo.clickDownloadButton();
            await attachmentBladePo.selectCheckBox(8);
            expect(await utilityCommon.isFileDownloaded(`${fileName8}`)).toBeTruthy(`FailuerMsg: ${fileName8} File is not downloaded.`);
       
            expect(await attachmentBladePo.isCheckBoxSelected(fileName12)).toBeFalsy(`${fileName12} CheckBox is selected`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName9}`)).toBeTruthy(`FailuerMsg: ${fileName9} File is delete sucessfully`);
            await attachmentBladePo.selectCheckBox(9);
            await attachmentBladePo.clickDownloadButton();
            await attachmentBladePo.selectCheckBox(9);
            expect(await utilityCommon.isFileDownloaded(`${fileName9}`)).toBeTruthy(`FailuerMsg: ${fileName9} File is not downloaded.`);
            
            expect(await utilityCommon.deleteAlreadyDownloadedFile('3ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf')).toBeTruthy(`FailuerMsg: 3ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf File is delete sucessfully`);
            await attachmentBladePo.selectCheckBox(10);
            await attachmentBladePo.clickDownloadButton();
            await attachmentBladePo.selectCheckBox(10);
            expect(await utilityCommon.isFileDownloaded('3ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf')).toBeTruthy(`FailuerMsg: '3ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf' File is not downloaded.`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName11}`)).toBeTruthy(`FailuerMsg: ${fileName11} File is delete sucessfully`);
            await attachmentBladePo.selectCheckBox(11);
            await attachmentBladePo.clickDownloadButton();
            await attachmentBladePo.selectCheckBox(11);
            expect(await utilityCommon.isFileDownloaded(`${fileName11}`)).toBeTruthy(`FailuerMsg: ${fileName11} File is not downloaded.`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName12}`)).toBeTruthy(`FailuerMsg: ${fileName12} File is delete sucessfully`);
            await attachmentBladePo.selectCheckBox(12);
            await attachmentBladePo.clickDownloadButton();
            await attachmentBladePo.selectCheckBox(12);
            expect(await utilityCommon.isFileDownloaded(`${fileName12}`)).toBeTruthy(`FailuerMsg: ${fileName12} File is not downloaded.`);
            await attachmentBladePo.clickCloseButton();
        });
        
        it('[DRDMV-23413]: Verify Files On Edit Knowledge MetaData', async () => {
            await navigationPage.gotoKnowledgeConsole();
            await knowledgeArticlesConsolePo.searchAndOpenKnowledgeArticle(knowledgeArticleData.displayId);
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            await editKnowledgePo.setCategoryTier1('Employee Relations');
            await editKnowledgePo.addAttachment([`../../data/ui/attachment/${fileName1}`,`../../data/ui/attachment/${fileName2}`,`../../data/ui/attachment/${fileName3}`,`../../data/ui/attachment/${fileName4}`]);
            await editKnowledgePo.clickSaveKnowledgeMetadata();

            await viewKnowledgeArticlePo.clickShowMoreButton();

            expect(await viewKnowledgeArticlePo.isAttachedFileNamePresent(fileName1)).toBeTruthy(`${fileName1}File is missing`);
            expect(await viewKnowledgeArticlePo.isAttachedFileNamePresent(fileName2)).toBeTruthy(`${fileName2}File is missing`);
            expect(await viewKnowledgeArticlePo.isAttachedFileNamePresent(fileName3)).toBeTruthy(`${fileName3}File is missing`);
            expect(await viewKnowledgeArticlePo.isAttachedFileNamePresent(fileName4)).toBeTruthy(`${fileName4}File is missing`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName1}`)).toBeTruthy(`FailuerMsg: ${fileName1} File is delete sucessfully`);
            await viewKnowledgeArticlePo.clickOnAttachment(`${fileName1}`);
            expect(await utilityCommon.isFileDownloaded(`${fileName1}`)).toBeTruthy(`FailuerMsg: ${fileName1} File is not downloaded.`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName2}`)).toBeTruthy(`FailuerMsg: ${fileName2} File is delete sucessfully`);
            await viewKnowledgeArticlePo.clickOnAttachment(`${fileName2}`);
            expect(await utilityCommon.isFileDownloaded(`${fileName2}`)).toBeTruthy(`FailuerMsg: ${fileName2} File is not downloaded.`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName3}`)).toBeTruthy(`FailuerMsg: ${fileName3} File is delete sucessfully`);
            await viewKnowledgeArticlePo.clickOnAttachment(`${fileName3}`);
            expect(await utilityCommon.isFileDownloaded(`${fileName3}`)).toBeTruthy(`FailuerMsg: ${fileName3} File is not downloaded.`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName4}`)).toBeTruthy(`FailuerMsg: ${fileName4} File is delete sucessfully`);
            await viewKnowledgeArticlePo.clickOnAttachment(`${fileName4}`);
            expect(await utilityCommon.isFileDownloaded(`${fileName4}`)).toBeTruthy(`FailuerMsg: ${fileName4} File is not downloaded.`);
        });

        it('[DRDMV-23413]: Verify Locally Attachment On Case Activity Tab ', async () => {
            await viewKnowledgeArticlePo.clickOnActivityTab();

            await activityTabPo.addActivityNote(addNoteRandomText);
            await activityTabPo.addAttachment([`../../data/ui/attachment/${fileName5}`,`../../data/ui/attachment/${fileName6}`,`../../data/ui/attachment/${fileName7}`,`../../data/ui/attachment/${fileName8}`]);
            await activityTabPo.clickOnPostButton();
            await activityTabPo.clickShowMoreLinkInAttachmentActivity(1);

            expect(await activityTabPo.isAttachedFileNameDisplayed(fileName5)).toBeTruthy(`${fileName5} Attached file name is missing`);
            expect(await activityTabPo.isAttachedFileNameDisplayed(fileName6)).toBeTruthy(`${fileName6} Attached file name is missing`);
            expect(await activityTabPo.isAttachedFileNameDisplayed(fileName7)).toBeTruthy(`${fileName7} Attached file name is missing`);
            expect(await activityTabPo.isAttachedFileNameDisplayed(fileName8)).toBeTruthy(`${fileName8} Attached file name is missing`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName5}`)).toBeTruthy(`FailuerMsg: ${fileName5} File is delete sucessfully`);
            await activityTabPo.clickAttachedFile(`${fileName5}`);
            expect(await utilityCommon.isFileDownloaded(`${fileName5}`)).toBeTruthy(`FailuerMsg: ${fileName5} File is not downloaded.`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile('2ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf')).toBeTruthy(`FailuerMsg: 2ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf File is delete sucessfully`);
            await activityTabPo.clickAttachedFile(`${fileName6}`);
            expect(await utilityCommon.isFileDownloaded('2ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf')).toBeTruthy(`FailuerMsg: '2ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf' File is not downloaded.`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName7}`)).toBeTruthy(`FailuerMsg: ${fileName7} File is delete sucessfully`);
            await activityTabPo.clickAttachedFile(`${fileName7}`);
            expect(await utilityCommon.isFileDownloaded(`${fileName7}`)).toBeTruthy(`FailuerMsg: ${fileName7} File is not downloaded.`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName8}`)).toBeTruthy(`FailuerMsg: ${fileName8} File is delete sucessfully`);
            await activityTabPo.clickAttachedFile(`${fileName8}`);
            expect(await utilityCommon.isFileDownloaded(`${fileName8}`)).toBeTruthy(`FailuerMsg: ${fileName8} File is not downloaded.`);
        });
       
        it('[DRDMV-23413]: Verify Document Libaray Attachment On Knowledge Activity Tab ', async () => {
            await activityTabPo.addActivityNote(addNoteRandomText);
            await activityTabPo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(docLibTitle+1);
            await activityTabPo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(docLibTitle+2);
            await activityTabPo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(docLibTitle+3);
            await activityTabPo.clickOnAttachLink();
            await attachDocumentBladePo.searchAndAttachDocument(docLibTitle+4);
            await activityTabPo.clickOnPostButton();
            await activityTabPo.clickShowMoreLinkInAttachmentActivity(1);

            expect(await activityTabPo.isAttachedFileNameDisplayed(fileName9)).toBeTruthy(`${fileName9} Attached file name is missing`);
            expect(await activityTabPo.isAttachedFileNameDisplayed(fileName10)).toBeTruthy(`${fileName10} Attached file name is missing`);
            expect(await activityTabPo.isAttachedFileNameDisplayed(fileName11)).toBeTruthy(`${fileName11} Attached file name is missing`);
            expect(await activityTabPo.isAttachedFileNameDisplayed(fileName12)).toBeTruthy(`${fileName12} Attached file name is missing`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName9}`)).toBeTruthy(`FailuerMsg: ${fileName9} File is delete sucessfully`);
            await activityTabPo.clickAttachedFile(`${fileName9}`);
            expect(await utilityCommon.isFileDownloaded(`${fileName9}`)).toBeTruthy(`FailuerMsg: ${fileName9} File is not downloaded.`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile('3ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf')).toBeTruthy(`FailuerMsg: 3ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf File is delete sucessfully`);
            await activityTabPo.clickAttachedFile(`${fileName10}`);
            expect(await utilityCommon.isFileDownloaded('3ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf')).toBeTruthy(`FailuerMsg: '3ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf' File is not downloaded.`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName11}`)).toBeTruthy(`FailuerMsg: ${fileName11} File is delete sucessfully`);
            await activityTabPo.clickAttachedFile(`${fileName11}`);
            expect(await utilityCommon.isFileDownloaded(`${fileName11}`)).toBeTruthy(`FailuerMsg: ${fileName11} File is not downloaded.`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName12}`)).toBeTruthy(`FailuerMsg: ${fileName12} File is delete sucessfully`);
            await activityTabPo.clickAttachedFile(`${fileName12}`);
            expect(await utilityCommon.isFileDownloaded(`${fileName12}`)).toBeTruthy(`FailuerMsg: ${fileName12} File is not downloaded.`);
        });

        it('[DRDMV-23413]: Attach Files From UI Dynamic Field And Create Case', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await consoleCasetemplatePo.searchAndClickOnCaseTemplate(caseTempateName);
            await viewCasetemplatePo.clickOnEditCaseTemplateButton();
            await editCasetemplatePo.clickOnMangeDyanmicLink();
            await browser.sleep(3000); // Wait for attach elements gets load.
            await dynamicFieldsPo.addAttachment([`../../data/ui/attachment/${fileName5}`], 1);
            await dynamicFieldsPo.addAttachment([`../../data/ui/attachment/${fileName6}`], 2);
            await dynamicFieldsPo.addAttachment([`../../data/ui/attachment/${fileName7}`], 3);
            await dynamicFieldsPo.addAttachment([`../../data/ui/attachment/${fileName8}`], 4);
            await dynamicFieldsPo.clickSaveButton();
            await editCasetemplatePo.clickOnEditCaseTemplateMetadata();
            await editCasetemplatePo.changeTemplateStatusDropdownValue('Active');
            await editCasetemplatePo.changeOwnerGroupDropdownValue('US Support 1');
            await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
            //Create Case
            await navigationPage.gotoCaseConsole();
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('Elizabeth Peters');
            await createCasePo.setSummary('caseSummary');
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTempateName);
            await createCasePo.clickAssignToMeButton();
            await createCasePo.clickSaveCaseButton();
            await casePreviewPo.clickGoToCaseButton();
            await viewCasePo.clickEditCaseButton();
        });
        
        it('[DRDMV-23413]: Verify Dynamic Fields On Case', async () => {
            await browser.sleep(15000);//Wait untile download icon displayed.
            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName5}`)).toBeTruthy(`FailuerMsg: ${fileName5} File is delete sucessfully`);
            await editCasePo.clickDownloadDynamicFile(1);
            expect(await utilityCommon.isFileDownloaded(`${fileName5}`)).toBeTruthy(`FailuerMsg: ${fileName5} File is not downloaded.`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile('2ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf')).toBeTruthy(`FailuerMsg: 2ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf File is delete sucessfully`);
            await editCasePo.clickDownloadDynamicFile(2);
            expect(await utilityCommon.isFileDownloaded('2ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf')).toBeTruthy(`FailuerMsg: '2ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf' File is not downloaded.`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName7}`)).toBeTruthy(`FailuerMsg: ${fileName7} File is delete sucessfully`);
            await editCasePo.clickDownloadDynamicFile(3);
            expect(await utilityCommon.isFileDownloaded(`${fileName7}`)).toBeTruthy(`FailuerMsg: ${fileName7} File is not downloaded.`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName8}`)).toBeTruthy(`FailuerMsg: ${fileName8} File is delete sucessfully`);
            await editCasePo.clickDownloadDynamicFile(4);
            expect(await utilityCommon.isFileDownloaded(`${fileName8}`)).toBeTruthy(`FailuerMsg: ${fileName8} File is not downloaded.`);

            await editCasePo.addAttachment('attachmentFirst', [`../../data/ui/attachment/${fileName1}`]);
            await editCasePo.addAttachment('attachmentSecond', [`../../data/ui/attachment/${fileName2}`]);
            await editCasePo.addAttachment('attachmentThird', [`../../data/ui/attachment/${fileName3}`]);
            await editCasePo.addAttachment('attachmentFour', [`../../data/ui/attachment/${fileName4}`]);
            await editCasePo.clickSaveCase();
        });
        
        it('[DRDMV-23413]: Verify Dynamic Fields On View Case & Activity', async () => {
            await activityTabPo.clickShowMoreLinkInActivity(1);
            await activityTabPo.isTextPresentInActivityLog('1Google+Translate+เป็นบริการแปลระบบประสาทด้วยเครื่องฟรีหลายภาษาที่พัฒนาโดย+Google.xlsx(+)')
            await activityTabPo.isTextPresentInActivityLog('1ทรัพยากรมนุษย์-นโยบายการแพทย์-รายงานการต__รวจสอบ.docx(+)');
            await activityTabPo.isTextPresentInActivityLog('1ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf(+)');
            await activityTabPo.isTextPresentInActivityLog('1!@#$%^&()+_-={}[}.');
            await activityTabPo.isTextPresentInActivityLog('123.jpg(+)');
             
            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName1}`)).toBeTruthy(`FailuerMsg: ${fileName1} File is delete sucessfully`);
            await viewCasePo.clickDynamicAttachmentValue(fileName1);
            expect(await utilityCommon.isFileDownloaded(`${fileName1}`)).toBeTruthy(`FailuerMsg: ${fileName1} File is not downloaded.`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile('1ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf')).toBeTruthy(`FailuerMsg: 1ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf File is delete sucessfully`);
            await viewCasePo.clickDynamicAttachmentValue(fileName2);
            expect(await utilityCommon.isFileDownloaded('1ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf')).toBeTruthy(`FailuerMsg: '1ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf' File is not downloaded.`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName3}`)).toBeTruthy(`FailuerMsg: ${fileName3} File is delete sucessfully`);
            await viewCasePo.clickDynamicAttachmentValue(fileName3);
            expect(await utilityCommon.isFileDownloaded(`${fileName3}`)).toBeTruthy(`FailuerMsg: ${fileName3} File is not downloaded.`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName4}`)).toBeTruthy(`FailuerMsg: ${fileName4} File is delete sucessfully`);
            await viewCasePo.clickDynamicAttachmentValue(fileName4);
            expect(await utilityCommon.isFileDownloaded(`${fileName4}`)).toBeTruthy(`FailuerMsg: ${fileName4} File is not downloaded.`);
        });
        
        it('[DRDMV-23413]: Verify Dynamic Fields On Attachment', async () => {
            await viewCasePo.clickAttachmentsLink();
            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName1}`)).toBeTruthy(`FailuerMsg: ${fileName1} File is delete sucessfully`);
            await attachmentBladePo.selectCheckBox(1);
            await attachmentBladePo.clickDownloadButton();
            await attachmentBladePo.selectCheckBox(1);
            expect(await utilityCommon.isFileDownloaded(`${fileName1}`)).toBeTruthy(`FailuerMsg: ${fileName1} File is not downloaded.`);
            
            expect(await utilityCommon.deleteAlreadyDownloadedFile('1ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf')).toBeTruthy(`FailuerMsg: 1ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf file is delete sucessfully`);
            await attachmentBladePo.selectCheckBox(2);
            await attachmentBladePo.clickDownloadButton();
            await attachmentBladePo.selectCheckBox(2);
            expect(await utilityCommon.isFileDownloaded('1ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf')).toBeTruthy(`FailuerMsg: '1ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf' File is not downloaded.`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName3}`)).toBeTruthy(`FailuerMsg: ${fileName3} File is delete sucessfully`);
            await attachmentBladePo.selectCheckBox(3);
            await attachmentBladePo.clickDownloadButton();
            await attachmentBladePo.selectCheckBox(3);
            expect(await utilityCommon.isFileDownloaded(`${fileName3}`)).toBeTruthy(`FailuerMsg: ${fileName3} File is not downloaded.`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName4}`)).toBeTruthy(`FailuerMsg: ${fileName4} File is delete sucessfully`);
            await attachmentBladePo.selectCheckBox(4);
            await attachmentBladePo.clickDownloadButton();
            await attachmentBladePo.selectCheckBox(4);
            expect(await utilityCommon.isFileDownloaded(`${fileName4}`)).toBeTruthy(`FailuerMsg: ${fileName4} File is not downloaded.`);
            await attachmentBladePo.clickCloseButton();
        });
        
        it('[DRDMV-23413]: Verify thai character on social', async () => {
            await viewCasePo.clickOnEmailLink();
            await composeMail.setToOrCCInputTextbox('To', 'qtao@petramco.com');
            await composeMail.setEmailBody("With thai attachmnents");
            await composeMail.addAttachment([`../../data/ui/attachment/${fileName9}`,`../../data/ui/attachment/${fileName10}`,`../../data/ui/attachment/${fileName11}`,`../../data/ui/attachment/${fileName12}`]);
            await composeMail.clickOnSendButton();
            
            await activityTabPo.clickOnRefreshButton();
            await activityTabPo.clickShowMoreLinkInAttachmentActivity(1);
            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName9}`)).toBeTruthy(`FailuerMsg: ${fileName9} File is delete sucessfully`);
            await activityTabPo.clickAndDownloadAttachmentFile(fileName9);
            expect(await utilityCommon.isFileDownloaded(`${fileName9}`)).toBeTruthy(`FailuerMsg: ${fileName9} File is not downloaded.`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile('3ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf')).toBeTruthy(`FailuerMsg: 3ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf File is delete sucessfully`);
            await activityTabPo.clickAndDownloadAttachmentFile(fileName10);
            expect(await utilityCommon.isFileDownloaded('3ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf')).toBeTruthy(`FailuerMsg: '3ทรัพยากรมนุษย์ นโยบายการแพทย์.pdf' File is not downloaded.`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName11}`)).toBeTruthy(`FailuerMsg: ${fileName11} File is delete sucessfully`);
            await activityTabPo.clickAndDownloadAttachmentFile(fileName11);
            expect(await utilityCommon.isFileDownloaded(`${fileName11}`)).toBeTruthy(`FailuerMsg: ${fileName11} File is not downloaded.`);

            expect(await utilityCommon.deleteAlreadyDownloadedFile(`${fileName12}`)).toBeTruthy(`FailuerMsg: ${fileName12} File is delete sucessfully`);
            await activityTabPo.clickAndDownloadAttachmentFile(fileName12);
            expect(await utilityCommon.isFileDownloaded(`${fileName12}`)).toBeTruthy(`FailuerMsg: ${fileName12} File is not downloaded.`);
        });
     
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qtao');
        });
    });
});
