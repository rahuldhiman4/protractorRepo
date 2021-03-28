import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import attachmentBladePo from '../../pageobject/attachment/attachment-blade.po';
import attachmentInformationBladePo from '../../pageobject/attachment/attachment-information-blade.po';
import caseConsolePo from '../../pageobject/case/case-console.po';
import previewCasePo from '../../pageobject/case/case-preview.po';
import createCasePage from '../../pageobject/case/create-case.po';
import viewCasePage from "../../pageobject/case/view-case.po";
import changeAssignmentBladePo from '../../pageobject/common/change-assignment.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import updateStatusBladePo from '../../pageobject/common/update.status.blade.po';
import activityTabPo from '../../pageobject/social/activity-tab.po';
import taskConsole from "../../pageobject/task/console-task.po";
import adhoctaskTemplate from "../../pageobject/task/create-adhoc-task.po";
import editTask from "../../pageobject/task/edit-task.po";
import manageTask from "../../pageobject/task/manage-task-blade.po";
import viewTask from "../../pageobject/task/view-task.po";
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

describe('Create Adhoc task', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qtao');
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    describe('[5794,6296,5793,5566,6087,4977]: Adhoc Task details view (UI verification)', async () => {
        let taskSummary = 'Adhoc task Summary' + Math.floor(Math.random() * 1000000);
        let caseSummary = 'Case Summary' + Math.floor(Math.random() * 1000000);
        it('[5794,6296,5793,5566,6087,4977]: Adhoc Task details view (UI verification)', async () => {
            //Create Case
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary(caseSummary);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();

            //Adhoc task validation
            await viewCasePage.clickAddTaskButton();
            await manageTask.clickAddAdhocTaskButton();
            expect(await adhoctaskTemplate.isTaskSummaryRequiredTextPresent()).toBeTruthy("Summary");
            expect(await adhoctaskTemplate.isPriorityRequiredTextPresent()).toBeTruthy("priority");
            expect(await adhoctaskTemplate.getSaveButtonAttribute('disabled')).toBeFalsy();
            expect(await adhoctaskTemplate.getStatusAttribute()).toBeTruthy("status");
            expect(await adhoctaskTemplate.isAttachmentButtonDisplayed()).toBeTruthy();
            await adhoctaskTemplate.setSummary(taskSummary);
            await adhoctaskTemplate.setDescription("Description");
            await adhoctaskTemplate.selectPriority('High');
            await adhoctaskTemplate.selectCategoryTier1('Employee Relations');
            await adhoctaskTemplate.selectCategoryTier2('Compensation');
            await adhoctaskTemplate.selectCategoryTier3('Bonus');
            await adhoctaskTemplate.selectCategoryTier4('GICP');
            await adhoctaskTemplate.clickAssignToMeButton();
            await adhoctaskTemplate.clickSaveAdhoctask();
            await utilityCommon.closePopUpMessage();
        });
        it('[5794,6296,5793,5566,6087,4977]: Adhoc Task details view (UI verification)', async () => {
            await manageTask.clickTaskLink(taskSummary);
            expect(await adhoctaskTemplate.isProcessFieldPresent()).toBeFalsy("Process field seen");
            expect(await viewTask.getTaskTypeValue()).toBe('Manual');
            expect(await viewTask.isProcessNameValue()).toBeFalsy("Process name seen");
            expect(await viewTask.isTaskSummaryDisplayed()).toBeTruthy("Summary not seen");
            expect(await viewTask.isTaskIdTextDisplayed()).toBeTruthy("Task ID not seen");
            expect(await viewTask.isTaskIconDisplayed()).toBeTruthy("Task Icon not seen");
            expect(await viewTask.isTaskPriorityDisplayed()).toBeTruthy("Task Prioriy not seen");
            expect(await viewTask.isTaskTimeDetailsDisplayed()).toBeTruthy("Task Time not seen");
            expect(await viewTask.isCaseSummaryDisplayed()).toBeTruthy("Case Summary not seen");
            expect(await viewTask.isRequesterNameDisplayed()).toBeTruthy("Requester Name not seen");
            expect(await viewTask.isRequesterContactDisplayed()).toBeTruthy("Requester Contact not seen");
            expect(await viewTask.isRequesterMailDisplayed()).toBeTruthy("Requester mail not seen");
            expect(await viewTask.isEditLinkDisplayed()).toBeTruthy("Edit link not seen");
            expect(await viewTask.getCategoryTier1Value()).toBe("Employee Relations");
            expect(await viewTask.getCategoryTier2Value()).toBe("Compensation");
            expect(await viewTask.getCategoryTier3Value()).toBe("Bonus");
            expect(await viewTask.getCategoryTier4Value()).toBe("GICP");
            expect(await viewTask.isAssigneeNameDisplayed()).toBeTruthy("Assignee Name not seen");
            expect(await viewTask.isAssignCompanyDisplayed()).toBeTruthy("Assigned company not seen");
            expect(await viewTask.clickOnTab('Activity')); // validation to check activity tab is present
            await viewTask.clickOnViewCase();
            expect(await viewCasePage.getCaseSummary()).toBe(caseSummary);
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
        });
    });

    //Data issue
    describe('[6105]: [Permissions] Navigating to case from the task', async () => {
        let randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let newCase, taskTemplateData;
        beforeAll(async () => {
            // create manual task template
            taskTemplateData = {
                "templateName": `${randomStr} Manual task`,
                "templateSummary": `${randomStr} Manual task summary`,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "buisnessUnit": "Australia Support",
                "supportGroup": "AU Support 1",
                "assignee": "qliu",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Australia Support",
                "ownerGroup": "AU Support 1"
            }
            // create case
            let caseData = {
                "Requester": "apavlik",
                "Summary": 'Summary ' + randomStr,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 1",
                "Assignee": "qtao"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createManualTaskTemplate(taskTemplateData);
            newCase = await apiHelper.createCase(caseData);
        });
        it('[6105]: Add task to Case and set case to In Progress', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(newCase.displayId);
            await viewCasePage.clickAddTaskButton();
            await manageTask.addTaskFromTaskTemplate(taskTemplateData.templateSummary);
            await manageTask.clickCloseButton();
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(newCase.displayId);
            await updateStatusBladePo.changeStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus('In Progress');
        });
        it('[6105]: Case View link is not visible', async () => {
            await navigationPage.signOut();
            await loginPage.login('qliu');
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchRecord(taskTemplateData.templateSummary);
            expect(await utilityGrid.getFirstGridRecordColumnValue('Case ID')).toBe("", " Case Id Displayed in Task console");
            await utilityGrid.searchAndOpenHyperlink(taskTemplateData.templateSummary);
            expect(await viewTask.isCaseViewLinkDisplayed()).toBeFalsy('Case View Link is displayed');
        });
        it('[6105]: [Permissions] Navigating to case from the task', async () => {
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await navigationPage.gotoTaskConsole();
            await utilityGrid.clearFilter();
            await taskConsole.setTaskSearchBoxValue(taskTemplateData.templateSummary);
            expect(await utilityGrid.getFirstGridRecordColumnValue('Case ID')).toBe(newCase.displayId, " Case Id NOT displayed in Task console");
            await utilityGrid.searchAndOpenHyperlink(taskTemplateData.templateSummary);
            expect(await viewTask.isCaseViewLinkDisplayed()).toBeTruthy('Case View Link is not displayed');
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login("qtao");
        });
    });

    describe('[4971,4976]: Verify task creation with attachments & Verify attachment grid from case', async () => {
        let filePath = '../../data/ui/attachment/demo.txt';
        let summary = 'Adhoc task' + Math.floor(Math.random() * 1000000);
        beforeAll(async () => {
            let caseData = {
                "Requester": "qkatawazi",
                "Summary": summary
            }
            await apiHelper.apiLogin('qtao');
            let newCaseTemplate = await apiHelper.createCase(caseData);
            await caseConsolePo.searchAndOpenCase(newCaseTemplate.displayId);
        });
        it('[4971,4976]: Verify task creation with attachments & Verify attachment grid from case', async () => {
            //Adhoc task validation
            await viewCasePage.clickAddTaskButton();
            await manageTask.clickAddAdhocTaskButton();
            expect(await adhoctaskTemplate.isAttachmentButtonDisplayed()).toBeTruthy();
            await adhoctaskTemplate.setSummary(summary);
            await adhoctaskTemplate.setDescription("Description");
            await adhoctaskTemplate.addAttachment([filePath]);
            await adhoctaskTemplate.clickSaveAdhoctask();
            let finalDate: string = await utilityCommon.getCurrentDate();
            await utilityCommon.closePopUpMessage();
            await manageTask.clickCloseButton();
            await viewCasePage.clickOnRefreshTaskList();
            await viewCasePage.clickOnTaskLink(summary);
            expect(await viewTask.isAttachedFileNamePresent('demo.txt')).toBeTruthy('Attached file name is missing');
            await utilityCommon.deleteAlreadyDownloadedFile('demo.txt');
            await viewTask.clickOnAttachments('demo.txt');
            expect(await utilityCommon.isFileDownloaded('demo.txt')).toBeTruthy('File is not downloaded.');

            //Navigated To Case and Verify attachments grid for task attachments
            await viewTask.clickOnViewCase();
            await viewCasePage.clickAttachmentsLink();
            await attachmentBladePo.clickFileName('demo');
            expect(await attachmentInformationBladePo.isDownloadButtonDisplayed()).toBeTruthy('download button is missing');
            expect(await attachmentInformationBladePo.isCloseButtonDisplayed()).toBeTruthy('close button is missing');
            expect(await attachmentInformationBladePo.getValuesOfInformation('File Name')).toBe('File Name: demo', 'FileName is missing');
            expect(await attachmentInformationBladePo.getValuesOfInformation('Task')).toBe('Type: Task', 'Type is missing');
            expect(await attachmentInformationBladePo.getValuesOfInformation('text/plain')).toBe('Media type: text/plain', 'Media Type is missing');
            expect(await attachmentInformationBladePo.getValuesOfInformation('Created date')).toContain(finalDate);
            expect(await attachmentInformationBladePo.getValuesOfInformation(' Qianru Tao')).toBe('Created by: Qianru Tao', 'Created by is missing');
            expect(await attachmentInformationBladePo.isTitleNameDisplayed()).toBeTruthy('Title is missing');
            expect(await utilityCommon.deleteAlreadyDownloadedFile('demo.txt')).toBeTruthy('File is delete sucessfully');
            await attachmentInformationBladePo.clickDownloadButton();
            expect(await utilityCommon.isFileDownloaded('demo.txt')).toBeTruthy('File is not downloaded.');
            await utilityCommon.deleteAlreadyDownloadedFile('demo.txt');
            await attachmentInformationBladePo.clickCloseButton();
            await attachmentBladePo.clickCloseButton();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
        });
    });

    it('[4975]: Verify task attachments deletion', async () => {
        let filePath = '../../data/ui/attachment/demo.txt';
        let summary = 'Adhoc task' + Math.floor(Math.random() * 1000000);
        let caseData = {
            "Requester": "qkatawazi",
            "Summary": summary,
        }
        await apiHelper.apiLogin('qtao');
        let newCaseTemplate = await apiHelper.createCase(caseData);
        await navigationPage.gotoCaseConsole();
        await caseConsolePo.searchAndOpenCase(newCaseTemplate.displayId);

        //Adhoc task validation
        await viewCasePage.clickAddTaskButton();
        await manageTask.clickAddAdhocTaskButton();
        expect(await adhoctaskTemplate.isAttachmentButtonDisplayed()).toBeTruthy();
        await adhoctaskTemplate.setSummary(summary);
        await adhoctaskTemplate.setDescription("Description");
        await adhoctaskTemplate.addAttachment([filePath]);
        await adhoctaskTemplate.clickSaveAdhoctask();
        await utilityCommon.closePopUpMessage();
        await manageTask.clickCloseButton();
        await viewCasePage.clickOnRefreshTaskList();
        await viewCasePage.clickOnTaskLink(summary);
        expect(await viewTask.isAttachedFileNamePresent('demo.txt')).toBeTruthy('Attached file name is not available');
        await viewTask.clickOnEditTask();
        await editTask.removeAttachment('demo.txt');
        await viewTask.clickOnSaveViewAdhoctask();
        expect(await viewTask.isAttachedFileNamePresent('demo.txt')).toBeFalsy('Attached file name is available');
    });

    it('[4974]: Verify attachment addition on edit task mode', async () => {
        let filePath = '../../data/ui/attachment/demo.txt';
        let summary = 'Adhoc task' + Math.floor(Math.random() * 1000000);
        let caseData = {
            "Requester": "qkatawazi",
            "Summary": summary,
        }
        await apiHelper.apiLogin('qtao');
        let newCaseTemplate = await apiHelper.createCase(caseData);
        await navigationPage.gotoCaseConsole();
        await caseConsolePo.searchAndOpenCase(newCaseTemplate.displayId);

        //Adhoc task validation
        await viewCasePage.clickAddTaskButton();
        await manageTask.clickAddAdhocTaskButton();
        await adhoctaskTemplate.setSummary(summary);
        await adhoctaskTemplate.setDescription("Description");
        await adhoctaskTemplate.clickSaveAdhoctask();
        await utilityCommon.closePopUpMessage();
        await manageTask.clickCloseButton();
        await viewCasePage.clickOnRefreshTaskList();
        await viewCasePage.clickOnTaskLink(summary);
        await viewTask.clickOnEditTask();
        await editTask.addAttachment([filePath]);
        await viewTask.clickOnSaveViewAdhoctask();
        expect(await viewTask.isAttachedFileNamePresent('demo')).toBeTruthy('Attached file name is not available');
    });

    it('[4972,4973,4970]: Verify max attachments added to task', async () => {
        let summary = 'Adhoc task' + Math.floor(Math.random() * 1000000);
        let caseData = {
            "Requester": "qkatawazi",
            "Summary": summary
        }
        await apiHelper.apiLogin('qtao');
        let newCase = await apiHelper.createCase(caseData);
        await navigationPage.gotoCaseConsole();
        await caseConsolePo.searchAndOpenCase(newCase.displayId);

        //Adhoc task validation
        await viewCasePage.clickAddTaskButton();
        await manageTask.clickAddAdhocTaskButton();
        expect(await adhoctaskTemplate.isAttachmentButtonDisplayed()).toBeTruthy();
        await adhoctaskTemplate.setSummary(summary);
        await adhoctaskTemplate.setDescription("Description");
        expect(await adhoctaskTemplate.isAttachmentButtonEnabled()).toBeTruthy('Attachment button is disabled');
        let fileName1: string[] = ['articleStatus.png', 'bwfJpg.jpg', 'bwfJpg1.jpg', 'bwfJpg2.jpg', 'bwfJpg3.jpg', 'bwfJpg4.jpg', 'bwfJson1.json', 'bwfJson2.json', 'bwfJson3.json', 'bwfJson4.json', 'bwfJson5.json', 'bwfPdf.pdf', 'bwfPdf1.pdf', 'bwfPdf2.pdf', 'bwfPdf3.pdf', 'bwfPdf4.pdf', 'bwfWord1.rtf', 'bwfWord2.rtf', 'bwfXlsx.xlsx', 'demo.txt'];
        const filesToUpload1 = fileName1.map((file) => { return `../../data/ui/attachment/${file}` });
        await adhoctaskTemplate.addAttachmentInDescription(filesToUpload1);
        expect(await adhoctaskTemplate.isAttachmentButtonEnabled()).toBeFalsy('Attachment button is enabled');
        expect(await adhoctaskTemplate.getAttachmentLimitWarningText()).toBe('The maximum number of attachments allowed is 20');
        await adhoctaskTemplate.clickSaveAdhoctask();
        await utilityCommon.closePopUpMessage();
        await browser.sleep(10000); // hardwait to upload multiple files
        await manageTask.clickTaskLink(summary);
        await viewTask.clickShowMoreShowLessLink();
        let fileName2: string[] = ['articleStatus.png', 'bwfJpg.jpg', 'bwfJpg1.jpg', 'bwfJpg2.jpg', 'bwfJpg3.jpg', 'bwfJpg4.jpg', 'bwfJson1.json', 'bwfJson2.json', 'bwfJson3.json', 'bwfJson4.json', 'bwfJson5.json', 'bwfPdf.pdf', 'bwfPdf1.pdf', 'bwfPdf2.pdf', 'bwfPdf3.pdf', 'bwfPdf4.pdf', 'bwfWord1.rtf', 'bwfWord2.rtf', 'bwfXlsx.xlsx', 'demo.txt'];
        for (let j: number = 0; j < fileName2.length; j++) {
            expect(await viewTask.isAttachedFileNamePresent(`${fileName2[j]}`)).toBeTruthy(`${fileName2[j]} Attached file name is missing`);
        }
        await viewTask.clickShowMoreShowLessLink();
        expect(await viewTask.getShowMoreLessAttachmentsLinkText()).toBe('18 more');
    });

    describe('[5658]: [Assignment] Changing the Assignment', async () => {
        let summary = 'Adhoc task' + Math.floor(Math.random() * 1000000);
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateData1, caseData, newCase;
        beforeAll(async () => {
            //Create Manual Task
            templateData1 = {
                "templateName": `manualTaskTemplate1 ${randomStr}`,
                "templateSummary": `manualTaskTemplateSummary1 ${randomStr}`,
                "templateStatus": "Active",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 1",
                "assignee": "qtao",
                "buisnessUnit": "United States Support",
                "supportGroup": "US Support 1",
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createManualTaskTemplate(templateData1);
            //Create Case
            caseData = {
                "Requester": "apavlik",
                "Summary": 'Summary ' + summary,

            }
            await apiHelper.apiLogin('qtao');
            newCase = await apiHelper.createCase(caseData);
        });
        it('[5658]: Assignee validation1', async () => {
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await caseConsolePo.searchAndOpenCase(newCase.displayId);
            await viewCasePage.clickAddTaskButton();
            await manageTask.clickAddAdhocTaskButton();
            await adhoctaskTemplate.setSummary("test" + summary);
            await adhoctaskTemplate.clickAssignButton();
            await adhoctaskTemplate.clickSaveAdhoctask();
            await utilityCommon.closePopUpMessage();
            await manageTask.addTaskFromTaskTemplate(templateData1.templateSummary);
            await manageTask.clickTaskLink("test" + summary);
            await viewTask.clickOnEditTask();
            await editTask.clickOnAssignToMe();
            await editTask.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
            expect((await viewTask.getAssigneeText()).trim()).toBe('Qianru Tao');
        });
        it('[5658]: Assignee validation2', async () => {
            await viewTask.clickOnEditTask();
            await changeAssignmentBladePo.setDropDownValue('Assignee', "Priscilla Presley");
            await editTask.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
            expect(await viewTask.getAssigneeText()).toBe('Priscilla Presley');
            await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.getAllTaskActivity('Priscilla Presley')).toBe('Priscilla Presley');
            await viewTask.clickOnEditTask();
            await changeAssignmentBladePo.clickAssignToMeBtn();
            await editTask.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
            expect(await viewTask.getAssigneeText()).toBe('Qianru Tao');
        });
        it('[5658]: Assignee validation3', async () => {
            await viewTask.clickOnEditTask();
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'US Support 1');
            await editTask.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
            expect(await changeAssignmentBladePo.getAssignedGroupText()).toBe('US Support 1');
            await viewTask.clickOnEditTask();
            await changeAssignmentBladePo.isDropDownDisplayed("AssignedGroup");
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'US Support 3');
            await changeAssignmentBladePo.setDropDownValue('Assignee', 'Qadim Katawazi');
            await editTask.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
            expect(await activityTabPo.getAllTaskActivity('Qadim Katawazi')).toBe('Qadim Katawazi');
            expect(await viewTask.getAssigneeText()).toBe('Qadim Katawazi');
        });
        it('[5658]: Assignee validation4', async () => {
            await viewTask.clickOnEditTask();
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'US Support 1');
            await editTask.clickOnAssignToMe(); // Failing due to slow API response, check with dev
            await editTask.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
            expect(await viewTask.getAssigneeText()).toBe('Qianru Tao');
            await viewTask.clickOnEditTask();
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'US Support 1');
            await editTask.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
            expect(await changeAssignmentBladePo.getAssignedGroupText()).toBe('US Support 1');
            await viewTask.clickOnEditTask();
            await editTask.clickOnAssignToMe();
            await editTask.clickOnSaveButton();
            expect(await viewTask.getAssigneeText()).toBe('Qianru Tao');
        });
        it('[5658]: Second Task validation1', async () => {
            await viewTask.clickOnViewCase()
            await viewCasePage.clickAddTaskButton();
            await manageTask.clickTaskLink(`manualTaskTemplateSummary1 ${randomStr}`);
            await viewTask.clickOnEditTask();
            await editTask.clickOnAssignToMe();
            await editTask.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
            expect((await viewTask.getAssigneeText()).trim()).toBe('Qianru Tao');
            await viewTask.clickOnEditTask();
            await changeAssignmentBladePo.setDropDownValue('Assignee', "Priscilla Presley");
            await editTask.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
            expect(await viewTask.getAssigneeText()).toBe('Priscilla Presley');
            await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.getAllTaskActivity('Priscilla Presley')).toBe('Priscilla Presley');
            await viewTask.clickOnEditTask();
            await changeAssignmentBladePo.clickAssignToMeBtn();
            await editTask.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
            expect(await viewTask.getAssigneeText()).toBe('Qianru Tao');
        });
        it('[5658]: Second Task validation2', async () => {
            await viewTask.clickOnEditTask();
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'US Support 1');
            await editTask.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
            expect(await changeAssignmentBladePo.getAssignedGroupText()).toBe('US Support 1');
            await viewTask.clickOnEditTask();
            await changeAssignmentBladePo.isDropDownDisplayed("AssignedGroup");
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'US Support 3');
            await changeAssignmentBladePo.setDropDownValue('Assignee', 'Qadim Katawazi');
            await editTask.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
            expect(await activityTabPo.getAllTaskActivity('Qadim Katawazi')).toBe('Qadim Katawazi');
            expect(await viewTask.getAssigneeText()).toBe('Qadim Katawazi');
        });
        it('[5658]: [Assignment] Changing the Assignment when editing the task by the member of one Support Group', async () => {
            await viewTask.clickOnEditTask();
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'US Support 1');
            await editTask.clickOnAssignToMe();
            await editTask.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
            expect(await viewTask.getAssigneeText()).toBe('Qianru Tao');
            await viewTask.clickOnEditTask();
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'US Support 1');
            await editTask.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
            expect(await changeAssignmentBladePo.getAssignedGroupText()).toBe('US Support 1');
            await viewTask.clickOnEditTask();
            await editTask.clickOnAssignToMe();
            await editTask.clickOnSaveButton();
            expect(await viewTask.getAssigneeText()).toBe('Qianru Tao');
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login("qtao");
        });
    });

    it('[5792]: [Task Workspace] Task Workspace verification', async () => {
        await navigationPage.gotoTaskConsole();
        await utilityGrid.clearFilter();
        let allHeaders: string[] = ["Task ID", "Case ID", "Priority", "Task Type", "Status", "Summary", "Assigned Group", "Assignee", "Modified Date", "SLM Status"];
        let remainingHeaders: string[] = ["Task ID", "Case ID", "Priority", "Task Type", "Status", "Summary", "Assigned Group", "Assignee", "Modified Date"]
        let removeHeader: string[] = ["SLM Status"];
        await utilityGrid.areColumnHeaderMatches(allHeaders);
        await utilityGrid.removeGridColumn(removeHeader);
        await utilityGrid.areColumnHeaderMatches(remainingHeaders);
        await utilityGrid.addGridColumn(removeHeader);
        await utilityGrid.areColumnHeaderMatches(allHeaders);
        await utilityGrid.isGridColumnSorted("Task ID", "ascending");
        await utilityGrid.isGridColumnSorted("Task ID", "descending");
        await utilityGrid.isGridColumnSorted("Case ID", "ascending");
        await utilityGrid.isGridColumnSorted("Case ID", "descending");
        await utilityGrid.isGridColumnSorted("Priority", "ascending");
        await utilityGrid.isGridColumnSorted("Priority", "descending");
        await utilityGrid.isGridColumnSorted("Task Type", "ascending");
        await utilityGrid.isGridColumnSorted("Task Type", "descending");
        await utilityGrid.isGridColumnSorted("Status", "ascending");
        await utilityGrid.isGridColumnSorted("Status", "descending");
        await utilityGrid.isGridColumnSorted("Summary", "ascending");
        await utilityGrid.isGridColumnSorted("Summary", "descending");
        await utilityGrid.isGridColumnSorted("Assigned Group", "ascending");
        await utilityGrid.isGridColumnSorted("Assigned Group", "descending");
        await utilityGrid.isGridColumnSorted("Assignee", "ascending");
        await utilityGrid.isGridColumnSorted("Assignee", "descending");
        await utilityGrid.isGridColumnSorted("Modified Date", "ascending");
        await utilityGrid.isGridColumnSorted("Modified Date", "descending");
    });

    it('[3494]: Manual Task status should not be changed to "In Progress" from "Staged" if assignee is empty', async () => {
        await apiHelper.apiLogin('qfeng');
        let caseData = {
            "Description": "Case 5792",
            "Requester": "Elizabeth",
            "Summary": "Simple test case summary",
            "Assigned Company": "Petramco",
            "Business Unit": "United States Support",
            "Support Group": "US Support 1",
            "Assignee": "qtao"
        }

        let taskData = {
            "taskName": "Task 5792",
            "company": "Petramco",
            "businessUnit": "United States Support",
            "supportGroup": "US Support 3",
        }

        await navigationPage.gotoTaskConsole();
        let caseCreationResponse = await apiHelper.createCase(caseData);
        let taskCreationResponse = await apiHelper.createAdhocTask(caseCreationResponse.id, taskData);
        await apiHelper.changeCaseAssignment(caseCreationResponse.id, 'United States Support', 'US Support 1', 'qtao');
        await apiHelper.updateCaseStatus(caseCreationResponse.id, 'InProgress');
        await utilityGrid.searchAndOpenHyperlink(taskCreationResponse.displayId);
        await updateStatusBladePo.changeStatus("In Progress");
        expect(await updateStatusBladePo.isSaveUpdateStatusButtonEnabled()).toBeFalsy('Save button is enabled');
        expect(await updateStatusBladePo.getValidationMessage()).toBe('Assignee is required for this task status.  Please select an assignee.');
        await utilityCommon.closeAllBlades();
        await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
    });
});
