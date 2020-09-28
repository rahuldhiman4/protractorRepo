import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import caseConsolePo from '../../pageobject/case/case-console.po';
import viewCasePo from '../../pageobject/case/view-case.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import updateStatusBladePo from '../../pageobject/common/update.status.blade.po';
import activityTabPage from '../../pageobject/social/activity-tab.po';
import editTaskPo from '../../pageobject/task/edit-task.po';
import manageTaskBladePo from '../../pageobject/task/manage-task-blade.po';
import viewTaskPo from "../../pageobject/task/view-task.po";
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import knowledgeArticlesConsolePo from '../../pageobject/knowledge/knowledge-articles-console.po';
import viewKnowledgeArticlePo from '../../pageobject/knowledge/view-knowledge-article.po';
import showApproversBladePo from "../../pageobject/common/show-approvers-list-tab.po";
import approvalConsolePage from "../../pageobject/approval/approvals-console.po";
import approvalConfigurationPage from "../../pageobject/settings/approval/approval-configuration.po";
import utilCommon from '../../utils/util.common';
import utilityGrid from '../../utils/utility.grid';
import editCasePo from '../../pageobject/case/edit-case.po';
import composeMailPo from '../../pageobject/email/compose-mail.po';
import accessTabPo from '../../pageobject/common/access-tab.po';
import changeAssignmentBladePo from '../../pageobject/common/change-assignment-blade.po';

describe('Case Activity Multi Logs', () => {

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //kgaikwad
    it('[DRDMV-16756]:Validate Show More/Less option in Task Activity Tab', async () => {
        let randomStr = [...Array(30)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let addNoteBodyText1 = `${randomStr}\n${randomStr}\n${randomStr}\n${randomStr}\n${randomStr}`;
        let addNoteBodyText2 = `${randomStr}\n${randomStr}\n${randomStr}\n${randomStr}\n${randomStr}\n${randomStr}`;

        let fileName: string[] = ['articleStatus.png', 'bwfJpg.jpg', 'bwfJpg2.jpg', 'bwfJpg3.jpg', 'bwfJson1.json', 'bwfJson2.json', 'bwfJson3.json', 'bwfJson4.json', 'bwfJson5.json'];
        let filePath = fileName.map((file) => { return `../../data/ui/attachment/${file}` });
        // Create Case
        let caseData = {
            "Requester": "Fritz",
            "Summary": "DRDMV-16730_TC" + randomStr,
            "Assigned Company": "Petramco",
            "Business Unit": "United States Support",
            "Support Group": "US Support 3",
            "Assignee": "qfeng"
        }

        await apiHelper.apiLogin('qkatawazi');
        let newCase = await apiHelper.createCase(caseData);

        // Create manual task template
        let manualTemplateData = {
            "templateName": "DRDMV-16756 template" + randomStr,
            "templateSummary": "DRDMV-16756_Manual_task template summary" + randomStr,
            "templateStatus": "Active",
            "taskCompany": '- Global -',
            "ownerCompany": "Petramco",
            "ownerBusinessUnit": "Facilities Support",
            "ownerGroup": "Facilities"
        }
        await apiHelper.createManualTaskTemplate(manualTemplateData);

        await caseConsolePo.searchAndOpenCase(newCase.displayId);
        await viewCasePo.clickAddTaskButton();
        await manageTaskBladePo.addTaskFromTaskTemplate(manualTemplateData.templateSummary);
        await manageTaskBladePo.clickTaskLink(manualTemplateData.templateSummary);

        // Verify logs with 5 lines or less than 5 lines
        await activityTabPage.addActivityNote(addNoteBodyText1);
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isAddNoteTextDisplayedInActivity(addNoteBodyText1, 1)).toBeTruthy('FailureMsg1: BodyText is missing');
        expect(await activityTabPage.clickShowMoreLinkInActivity(1)).toBeFalsy('FailureMsg2: Show more link is displayed');
        // Verify logs with more than 5 lines
        await activityTabPage.addActivityNote(addNoteBodyText2);
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isAddNoteTextDisplayedInActivity(addNoteBodyText2, 1)).toBeTruthy('FailureMsg3: BodyText is missing');
        expect(await activityTabPage.clickShowMoreLinkInActivity(1)).toBeTruthy('FailureMsg4: Show more link is displayed');
        expect(await activityTabPage.isAddNoteTextDisplayedInActivity(addNoteBodyText2, 1)).toBeTruthy('FailureMsg5: BodyText is missing');
        expect(await activityTabPage.clickShowLessLinkInActivity(1)).toBeTruthy('FailureMsg6: Show less missing for body text');
        expect(await activityTabPage.clickShowMoreLinkInActivity(1)).toBeTruthy('FailureMsg7: Show more link is displayed');
        expect(await activityTabPage.isAddNoteTextDisplayedInActivity(addNoteBodyText2, 1)).toBeTruthy('FailureMsg8: BodyText is missing');
        // Verify logs with 5 lines  with 3 attachment
        await activityTabPage.addActivityNote(addNoteBodyText1);
        await activityTabPage.addAttachment([filePath[0], filePath[1]]);
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.clickShowMoreLinkInAttachmentActivity(1)).toBeFalsy('FailureMsg12: Show more link for attachment is missing')
        expect(await activityTabPage.isAttachedFileNameDisplayed('articleStatus.png')).toBeTruthy(`FailureMsg9: ${filePath[0]} is missing`);
        expect(await activityTabPage.isAttachedFileNameDisplayed('bwfJpg.jpg')).toBeTruthy(`FailureMsg10: ${filePath[1]} is missing`);
        expect(await activityTabPage.isAddNoteTextDisplayedInActivity(addNoteBodyText1, 1)).toBeTruthy('FailureMsg13: BodyText is missing');
        expect(await activityTabPage.clickShowMoreLinkInActivity(1)).toBeFalsy('FailureMsg14: Show more link is displayed');
        // Verify logs with more than 5 lines  with 3 attachment
        await activityTabPage.addActivityNote(addNoteBodyText2);
        await activityTabPage.addAttachment([filePath[2], filePath[3]]);
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.clickShowMoreLinkInAttachmentActivity(1)).toBeFalsy('FailureMsg18: Show more link for attachment is missing')
        expect(await activityTabPage.isAttachedFileNameDisplayed('bwfJpg2.jpg')).toBeTruthy(`FailureMsg15: ${filePath[2]} is missing`);
        expect(await activityTabPage.isAttachedFileNameDisplayed('bwfJpg3.jpg')).toBeTruthy(`FailureMsg16: ${filePath[3]} is missing`);
        expect(await activityTabPage.clickShowMoreLinkInActivity(1)).toBeTruthy('FailureMsg19: Show more link is displayed');
        expect(await activityTabPage.isAddNoteTextDisplayedInActivity(addNoteBodyText2, 1)).toBeTruthy('FailureMsg20: BodyText is missing');
        expect(await activityTabPage.clickShowLessLinkInActivity(1)).toBeTruthy('FailureMsg21: Show less missing for body text');
        // Verify logs with more than 5 lines  with more than 4 attachment
        await activityTabPage.addActivityNote(addNoteBodyText2);
        await activityTabPage.addAttachment([filePath[4], filePath[5], filePath[6], filePath[7], filePath[8]]);

        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isAddNoteTextDisplayedInActivity(addNoteBodyText2, 1)).toBeTruthy('FailureMsg22: BodyText is missing');
        expect(await activityTabPage.clickShowMoreLinkInActivity(1)).toBeTruthy('FailureMsg23: Show More missing for body text');
        expect(await activityTabPage.clickShowMoreLinkInAttachmentActivity(1)).toBeTruthy('FailureMsg24: Show more link for attachment is missing')
        expect(await activityTabPage.isAddNoteTextDisplayedInActivity(addNoteBodyText2, 1)).toBeTruthy('FailureMsg25: BodyText is missing');
        expect(await activityTabPage.clickShowLessLinkInActivity(1)).toBeTruthy('FailureMsg43: ShowLess link is missing')
        expect(await activityTabPage.isAddNoteTextDisplayedInActivity(addNoteBodyText2, 1)).toBeTruthy('FailureMsg26: BodyText is missing');

        expect(await activityTabPage.isAttachedFileNameDisplayed('bwfJson1.json')).toBeTruthy(`FailureMsg27: ${filePath[4]} is missing`);
        expect(await activityTabPage.isAttachedFileNameDisplayed('bwfJson2.json')).toBeTruthy(`FailureMsg28: ${filePath[5]} is missing`);
        expect(await activityTabPage.isAttachedFileNameDisplayed('bwfJson3.json')).toBeTruthy(`FailureMsg29: ${filePath[6]} is missing`);
        expect(await activityTabPage.isAttachedFileNameDisplayed('bwfJson4.json')).toBeTruthy(`FailureMsg30: ${filePath[7]} is missing`);
        expect(await activityTabPage.isAttachedFileNameDisplayed('bwfJson5.json')).toBeTruthy(`FailureMsg31: ${filePath[8]} is missing`);

        // Download Attachments Files
        expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfJson1.json')).toBeTruthy('FailureMsg32: bwfJson1.json File is delete sucessfully');
        await activityTabPage.clickAndDownloadAttachmentFile('bwfJson1.json')
        expect(await utilityCommon.isFileDownloaded('bwfJson1.json')).toBeTruthy('FailureMsg33.json File is not downloaded.');

        expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfJson2.json')).toBeTruthy('FailureMsg34: bwfJson2.json File is delete sucessfully');
        await activityTabPage.clickAndDownloadAttachmentFile('bwfJson2.json')
        expect(await utilityCommon.isFileDownloaded('bwfJson2.json')).toBeTruthy('FailureMsg35: bwfJson2.json File is not downloaded.');

        expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfJson3.json')).toBeTruthy('FailureMsg36: bwfJson3.json File is delete sucessfully');
        await activityTabPage.clickAndDownloadAttachmentFile('bwfJson3.json')
        expect(await utilityCommon.isFileDownloaded('bwfJson3.json')).toBeTruthy('FailureMsg37: bwfJson3.json File is not downloaded.');

        expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfJson4.json')).toBeTruthy('FailureMsg38: bwfJson4.json File is delete sucessfully');
        await activityTabPage.clickAndDownloadAttachmentFile('bwfJson4.json')
        expect(await utilityCommon.isFileDownloaded('bwfJson4.json')).toBeTruthy('FailureMsg39: bwfJson4.json File is not downloaded.');

        expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfJson5.json')).toBeTruthy('FailureMsg40: bwfJson5.json File is delete sucessfully');
        await activityTabPage.clickAndDownloadAttachmentFile('bwfJson5.json')
        expect(await utilityCommon.isFileDownloaded('bwfJson5.json')).toBeTruthy('FailureMsg41: bwfJson5.json File is not downloaded.');
        expect(await activityTabPage.clickShowLessLinkInAttachmentActivity(1)).toBeTruthy('FailureMsg42: Show less link for attachment is missing');
    });

    //kgaikwad
    describe('[DRDMV-16755]: All type of social activities are displayed correctly in Task Activity tab', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let manualTemplateSummary, autoTemplateData, externalTemplateSummary, newCase;

        beforeAll(async () => {
            // Create Automated Task Template
            autoTemplateData = {
                "templateName": "DRDMV-21619 auto task template" + randomStr,
                "templateSummary": "DRDMV-21619 auto task template summary" + randomStr,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": `Case Process ${randomStr}`,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createAutomatedTaskTemplate(autoTemplateData);

            // Create Manual / External Task Template
            let taskTemplateData = {
                "templateName": "DRDMV-21619_templateName" + randomStr,
                "templateSummary": "DRDMV-21617_templateSummary" + randomStr,
                "templateStatus": "Active",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            // Create manual Task Template
            taskTemplateData.templateName = 'DRDMV-21619_ManualTaskTemplateName' + randomStr;
            manualTemplateSummary = taskTemplateData.templateSummary = 'DRDMV-21619_ManualTaskTemplateSummary_' + randomStr;
            await apiHelper.createManualTaskTemplate(taskTemplateData);

            // Create External Task Template
            taskTemplateData.templateName = 'DRDMV-21619_ExternalTaskTemplateName' + randomStr;
            externalTemplateSummary = taskTemplateData.templateSummary = 'DRDMV-21619_ExternalTaskTemplateSummary_' + randomStr;
            await apiHelper.createExternalTaskTemplate(taskTemplateData);

            // Create Case
            let caseData = {
                "Requester": "qtao",
                "Summary": "DRDMV-21619_TC",
                "Assigned Company": "Petramco",
                "Business Unit": "Canada Support",
                "Support Group": "CA Support 1",
                "Assignee": "qdu"
            }
            newCase = await apiHelper.createCase(caseData);
        });

        it('[DRDMV-16755]: Add Automation, Manual, External Task In Case And Change Case Status To In-Progress', async () => {
            // Adding Task
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(newCase.displayId);
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.addTaskFromTaskTemplate(autoTemplateData.templateSummary);
            await manageTaskBladePo.addTaskFromTaskTemplate(manualTemplateSummary);
            await manageTaskBladePo.addTaskFromTaskTemplate(externalTemplateSummary);
            await manageTaskBladePo.clickCloseButton();
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
        });

        it('[DRDMV-16755]: Goto Automation Task and verify Create Task Activity', async () => {
            // Goto Automated Task
            await activityTabPage.clickOnRefreshButton();
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickTaskLink(autoTemplateData.templateSummary);
            expect(await viewTaskPo.getTaskStatusValue()).toBe('Completed', 'FailureMsg1: Automated task status is not completed');
            // Create Task Activity 
            expect(await activityTabPage.isLogIconDisplayedInActivity('filePlus', 3)).toBeTruthy('FailureMsg2: log icon is missing');
            expect(await activityTabPage.isTitleTextDisplayedInActivity('Qadim Katawazi created the task', 3)).toBeTruthy('FailureMsg4: log title is missing');
            expect(await activityTabPage.isTextPresentInActivityLog('Summary')).toBeTruthy('FailureMsg5: Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog(autoTemplateData.templateSummary)).toBeTruthy('FailureMsg6: Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Status')).toBeTruthy('FailureMsg7: Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Staged')).toBeTruthy('FailureMsg8: Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('In Progress')).toBeTruthy('FailureMsg9: Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Completed')).toBeTruthy('FailureMsg10: Text is missing in activity log');
            expect(await activityTabPage.isLockIconDisplayedInActivity(3)).toBeTruthy('FailureMsg3: lock icon missing in activity logs');
        });

        it('[DRDMV-16755]: Automation Task Validate Add Notes Activity', async () => {
            await activityTabPage.addActivityNote('DRDMV-21619 Activity Note');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isLogIconDisplayedInActivity('note_pencil', 1)).toBeTruthy('FailureMsg11: log icon is missing');
            expect(await activityTabPage.isLockIconDisplayedInActivity(1)).toBeTruthy('FailureMsg12: lock icon missing in activity logs');
            expect(await activityTabPage.isTitleTextDisplayedInActivity('Qadim Katawazi added a note', 1)).toBeTruthy('FailureMsg13: log title is missing');
            expect(await activityTabPage.isTextPresentInActivityLog('DRDMV-21619 Activity Note')).toBeTruthy('FailureMsg14: Text is missing in activity log');
        });

        it('[DRDMV-16755]: Automation Task Change Priority And Validate It In Activity ', async () => {
            await viewTaskPo.clickOnEditTask();
            await editTaskPo.selectPriorityValue('Low');
            await editTaskPo.clickOnSaveButton();
            expect(await activityTabPage.isLogIconDisplayedInActivity('arrow_exclamation_circle', 1)).toBeTruthy('FailureMsg15: log icon is missing');
            expect(await activityTabPage.isLockIconDisplayedInActivity(1)).toBeTruthy('FailureMsg16: lock icon missing in activity logs');
            expect(await activityTabPage.isTitleTextDisplayedInActivity('Qadim Katawazi changed the task priority', 1)).toBeTruthy('FailureMsg17: log title is missing');
            expect(await activityTabPage.isTextPresentInActivityLog('Low')).toBeTruthy('FailureMsg18: Text is missing in activity log');
        });

        it('[DRDMV-16755]: Automation Task Change Catergory Tier And Validate It In Activity', async () => {
            await viewTaskPo.clickOnEditTask();
            await editTaskPo.selectTaskCategoryTier1('Accounts Receivable');
            await editTaskPo.selectTaskCategoryTier2('Collection');
            await editTaskPo.selectTaskCategoryTier3('Past Due');
            await editTaskPo.clickOnSaveButton();
            expect(await activityTabPage.isLogIconDisplayedInActivity('squares_arrows', 1)).toBeTruthy('FailureMsg19: log icon is missing');
            expect(await activityTabPage.isLockIconDisplayedInActivity(1)).toBeTruthy('FailureMsg20: lock icon missing in activity logs');
            expect(await activityTabPage.isTitleTextDisplayedInActivity('Qadim Katawazi changed the task category', 1)).toBeTruthy('FailureMsg21: log title is missing');
            expect(await activityTabPage.isTextPresentInActivityLog('Category Tier 1')).toBeTruthy('FailureMsg22: Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Accounts Receivable')).toBeTruthy('FailureMsg23: Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Category Tier 2')).toBeTruthy('FailureMsg24: Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Collection')).toBeTruthy('FailureMsg25: Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Category Tier 3')).toBeTruthy('FailureMsg26: Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Past Due')).toBeTruthy('FailureMsg27: Text is missing in activity log');
        });

        it('[DRDMV-16755]: Automation Task Update Multiple Fields At a Time And Validate It In Activity', async () => {
            await viewTaskPo.clickOnEditTask();
            await editTaskPo.setDescription('DRDMV-16756 Task Description');
            await editTaskPo.selectPriorityValue('Critical');
            await editTaskPo.clickOnSaveButton();
            expect(await activityTabPage.isLogIconDisplayedInActivity('files_change', 1)).toBeTruthy('FailureMsg28: log icon is missing');
            expect(await activityTabPage.isLockIconDisplayedInActivity(1)).toBeTruthy('FailureMsg29: lock icon missing in activity logs');
            expect(await activityTabPage.isTitleTextDisplayedInActivity('Qadim Katawazi changed the following task fields', 1)).toBeTruthy('FailureMsg30: log title is missing');
            expect(await activityTabPage.isTextPresentInActivityLog('Description')).toBeTruthy('FailureMsg31: Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('DRDMV-16756 Task Description')).toBeTruthy('FailureMsg32: Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Priority')).toBeTruthy('FailureMsg33: Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Critical')).toBeTruthy('FailureMsg34: Text is missing in activity log');
            await viewTaskPo.clickOnViewCase();
        });

        it('[DRDMV-16755]: Goto Manual Task and verify Create Task Activity', async () => {
            // Goto Manual Task
            await activityTabPage.clickOnRefreshButton();
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickTaskLink(manualTemplateSummary);
            // Create Task Activity 
            expect(await activityTabPage.isLogIconDisplayedInActivity('filePlus', 2)).toBeTruthy('FailureMsg2: log icon is missing');
            expect(await activityTabPage.isLockIconDisplayedInActivity(2)).toBeTruthy('FailureMsg3: lock icon missing in activity logs');
            expect(await activityTabPage.isTitleTextDisplayedInActivity('Qadim Katawazi created the task', 2)).toBeTruthy('FailureMsg4: log title is missing');
            expect(await activityTabPage.isTextPresentInActivityLog('Summary')).toBeTruthy('FailureMsg5: Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog(manualTemplateSummary)).toBeTruthy('FailureMsg6: Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Status')).toBeTruthy('FailureMsg7: Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Staged')).toBeTruthy('FailureMsg8: Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Assigned')).toBeTruthy('FailureMsg10: Text is missing in activity log');
        });

        it('[DRDMV-16755]: Manual Task Validate Add Notes Activity', async () => {
            await activityTabPage.addActivityNote('DRDMV-21619 Activity Note');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isLogIconDisplayedInActivity('note_pencil', 1)).toBeTruthy('FailureMsg11: log icon is missing');
            expect(await activityTabPage.isLockIconDisplayedInActivity(1)).toBeTruthy('FailureMsg12: lock icon missing in activity logs');
            expect(await activityTabPage.isTitleTextDisplayedInActivity('Qadim Katawazi added a note', 1)).toBeTruthy('FailureMsg13: log title is missing');
            expect(await activityTabPage.isTextPresentInActivityLog('DRDMV-21619 Activity Note')).toBeTruthy('FailureMsg14: Text is missing in activity log');
        });

        it('[DRDMV-16755]: Manual Task Change Priority And Validate It In Activity', async () => {
            // Priority change activity
            await viewTaskPo.clickOnEditTask();
            await editTaskPo.selectPriorityValue('Low');
            await editTaskPo.clickOnSaveButton();
            expect(await activityTabPage.isLogIconDisplayedInActivity('arrow_exclamation_circle', 1)).toBeTruthy('FailureMsg15: log icon is missing');
            expect(await activityTabPage.isLockIconDisplayedInActivity(1)).toBeTruthy('FailureMsg16: lock icon missing in activity logs');
            expect(await activityTabPage.isTitleTextDisplayedInActivity('Qadim Katawazi changed the task priority', 1)).toBeTruthy('FailureMsg17: log title is missing');
            expect(await activityTabPage.isTextPresentInActivityLog('Low')).toBeTruthy('FailureMsg18: Text is missing in activity log');
        });

        it('[DRDMV-16755]: Manual Task Change Catergory Tier And Validate It In Activity', async () => {
            await viewTaskPo.clickOnEditTask();
            await editTaskPo.selectTaskCategoryTier1('Accounts Receivable');
            await editTaskPo.selectTaskCategoryTier2('Collection');
            await editTaskPo.selectTaskCategoryTier3('Past Due');
            await editTaskPo.clickOnSaveButton();
            expect(await activityTabPage.isLogIconDisplayedInActivity('squares_arrows', 1)).toBeTruthy('FailureMsg19: log icon is missing');
            expect(await activityTabPage.isLockIconDisplayedInActivity(1)).toBeTruthy('FailureMsg20: lock icon missing in activity logs');
            expect(await activityTabPage.isTitleTextDisplayedInActivity('Qadim Katawazi changed the task category', 1)).toBeTruthy('FailureMsg21: log title is missing');
            expect(await activityTabPage.isTextPresentInActivityLog('Category Tier 1')).toBeTruthy('FailureMsg22: Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Accounts Receivable')).toBeTruthy('FailureMsg23: Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Category Tier 2')).toBeTruthy('FailureMsg24: Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Collection')).toBeTruthy('FailureMsg25: Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Category Tier 3')).toBeTruthy('FailureMsg26: Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Past Due')).toBeTruthy('FailureMsg27: Text is missing in activity log');
        });

        it('[DRDMV-16755]: Manual Task Update Multiple Fields At a Time And Validate It In Activity', async () => {
            await viewTaskPo.clickOnEditTask();
            await editTaskPo.setDescription('DRDMV-16756 Task Description');
            await editTaskPo.selectPriorityValue('Critical');
            await editTaskPo.clickOnSaveButton();
            expect(await activityTabPage.isLogIconDisplayedInActivity('files_change', 1)).toBeTruthy('FailureMsg28: log icon is missing');
            expect(await activityTabPage.isLockIconDisplayedInActivity(1)).toBeTruthy('FailureMsg29: lock icon missing in activity logs');
            expect(await activityTabPage.isTitleTextDisplayedInActivity('Qadim Katawazi changed the following task fields', 1)).toBeTruthy('FailureMsg30: log title is missing');
            expect(await activityTabPage.isTextPresentInActivityLog('Description')).toBeTruthy('FailureMsg31: Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('DRDMV-16756 Task Description')).toBeTruthy('FailureMsg32: Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Priority')).toBeTruthy('FailureMsg33: Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Critical')).toBeTruthy('FailureMsg34: Text is missing in activity log');
        });

        it('[DRDMV-16755]: Assign Manual Task Validate Its Activity', async () => {
            await viewTaskPo.clickOnEditTask();
            await editTaskPo.clickOnAssignToMe();
            await editTaskPo.clickOnSaveButton();
            expect(await activityTabPage.clickShowMoreLinkInActivity(1)).toBeTruthy('FailureMsg: show more button is missing');
            expect(await activityTabPage.isLogIconDisplayedInActivity('files_change', 1)).toBeTruthy('FailureMsg: multiple field log icon is missing');
            expect(await activityTabPage.isLockIconDisplayedInActivity(1)).toBeTruthy('FailureMsg: multiple field lock icon missing');
            expect(await activityTabPage.isTitleTextDisplayedInActivity('Qadim Katawazi changed the following task fields', 1)).toBeTruthy('FailureMsg: Assignment change field log header');
            expect(await activityTabPage.isTextPresentInActivityLog('Assignee')).toBeTruthy('FailureMsg: Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Qadim Katawazi')).toBeTruthy('FailureMsg: Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Assigned Business Unit')).toBeTruthy('FailureMsg: Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('United States Support')).toBeTruthy('FailureMsg: Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Assigned Group')).toBeTruthy('FailureMsg: Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('US Support 3')).toBeTruthy('FailureMsg: Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Description')).toBeTruthy('FailureMsg: Text is missing in activity log');
            await viewTaskPo.clickOnChangeStatus();
            await viewTaskPo.changeTaskStatus('Completed');
            await updateStatusBladePo.setStatusReason('Successful');
            await updateStatusBladePo.clickSaveStatus();
            await viewTaskPo.clickOnViewCase();
        });

        it('[DRDMV-16755]: Goto External Task And Verify Create Task Activity', async () => {
            await activityTabPage.clickOnRefreshButton();
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickTaskLink(externalTemplateSummary);
            // Verify Task Activity 
            expect(await activityTabPage.isLogIconDisplayedInActivity('filePlus', 2)).toBeTruthy('FailureMsg2: log icon is missing');
            expect(await activityTabPage.isLockIconDisplayedInActivity(2)).toBeTruthy('FailureMsg3: lock icon missing in activity logs');
            expect(await activityTabPage.isTextPresentInActivityLog('Qadim Katawazi created the task')).toBeTruthy('FailureMsg4: log title is missing');
            expect(await activityTabPage.isTextPresentInActivityLog('Summary')).toBeTruthy('FailureMsg5: Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog(externalTemplateSummary)).toBeTruthy('FailureMsg6: Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Status')).toBeTruthy('FailureMsg7: Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Staged')).toBeTruthy('FailureMsg80: Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Assigned')).toBeTruthy('FailureMsg10: Text is missing in activity log');
        });

        it('[DRDMV-16755]: External Task Validate Add Notes Activity', async () => {
            await activityTabPage.addActivityNote('DRDMV-21619 Activity Note');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isLogIconDisplayedInActivity('note_pencil', 1)).toBeTruthy('FailureMsg11: log icon is missing');
            expect(await activityTabPage.isLockIconDisplayedInActivity(1)).toBeTruthy('FailureMsg12: lock icon missing in activity logs');
            expect(await activityTabPage.isTitleTextDisplayedInActivity('Qadim Katawazi added a note', 1)).toBeTruthy('FailureMsg13: log title is missing');
            expect(await activityTabPage.isTextPresentInActivityLog('DRDMV-21619 Activity Note')).toBeTruthy('FailureMsg14: Text is missing in activity log');
        });

        it('[DRDMV-16755]: External Task Change Priority And Validate It In Activity', async () => {
            // Priority change activity
            await viewTaskPo.clickOnEditTask();
            await editTaskPo.selectPriorityValue('Low');
            await editTaskPo.clickOnSaveButton();
            expect(await activityTabPage.isLogIconDisplayedInActivity('arrow_exclamation_circle', 1)).toBeTruthy('FailureMsg15: log icon is missing');
            expect(await activityTabPage.isLockIconDisplayedInActivity(1)).toBeTruthy('FailureMsg16: lock icon missing in activity logs');
            expect(await activityTabPage.isTitleTextDisplayedInActivity('Qadim Katawazi changed the task priority', 1)).toBeTruthy('FailureMsg17: log title is missing');
            expect(await activityTabPage.isTextPresentInActivityLog('Low')).toBeTruthy('FailureMsg18: Text is missing in activity log');
        });

        it('[DRDMV-16755]: External Task Change Catergory Tier And Validate It In Activity', async () => {
            await viewTaskPo.clickOnEditTask();
            await editTaskPo.selectTaskCategoryTier1('Accounts Receivable');
            await editTaskPo.selectTaskCategoryTier2('Collection');
            await editTaskPo.selectTaskCategoryTier3('Past Due');
            await editTaskPo.clickOnSaveButton();
            expect(await activityTabPage.isLogIconDisplayedInActivity('squares_arrows', 1)).toBeTruthy('FailureMsg19: log icon is missing');
            expect(await activityTabPage.isLockIconDisplayedInActivity(1)).toBeTruthy('FailureMsg20: lock icon missing in activity logs');
            expect(await activityTabPage.isTitleTextDisplayedInActivity('Qadim Katawazi changed the task category', 1)).toBeTruthy('FailureMsg21: log title is missing');
            expect(await activityTabPage.isTextPresentInActivityLog('Category Tier 1')).toBeTruthy('FailureMsg22: Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Accounts Receivable')).toBeTruthy('FailureMsg23: Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Category Tier 2')).toBeTruthy('FailureMsg24: Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Collection')).toBeTruthy('FailureMsg25: Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Category Tier 3')).toBeTruthy('FailureMsg26: Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Past Due')).toBeTruthy('FailureMsg27: Text is missing in activity log');
        });

        it('[DRDMV-16755]: External Task Update Multiple Fields At a Time And Validate It In Activity', async () => {
            // Task multiple fields activity
            await viewTaskPo.clickOnEditTask();
            await editTaskPo.setDescription('DRDMV-16756 Task Description');
            await editTaskPo.selectPriorityValue('Critical');
            await editTaskPo.clickOnSaveButton();
            expect(await activityTabPage.isLogIconDisplayedInActivity('files_change', 1)).toBeTruthy('FailureMsg28: log icon is missing');
            expect(await activityTabPage.isLockIconDisplayedInActivity(1)).toBeTruthy('FailureMsg29: lock icon missing in activity logs');
            expect(await activityTabPage.isTitleTextDisplayedInActivity('Qadim Katawazi changed the following task fields', 1)).toBeTruthy('FailureMsg30: log title is missing');
            expect(await activityTabPage.isTextPresentInActivityLog('Description')).toBeTruthy('FailureMsg31: Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('DRDMV-16756 Task Description')).toBeTruthy('FailureMsg32: Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Priority')).toBeTruthy('FailureMsg33: Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Critical')).toBeTruthy('FailureMsg34: Text is missing in activity log');
        });

        it('[DRDMV-16755]: Assign External Task Validate Its Activity', async () => {
            // Assign Task 
            await viewTaskPo.clickOnEditTask();
            await editTaskPo.clickOnAssignToMe();
            await editTaskPo.clickOnSaveButton();
            expect(await activityTabPage.clickShowMoreLinkInActivity(1)).toBeTruthy('FailureMsg: show more button is missing');
            expect(await activityTabPage.isLogIconDisplayedInActivity('files_change', 1)).toBeTruthy('FailureMsg: multiple field log icon is missing');
            expect(await activityTabPage.isLockIconDisplayedInActivity(1)).toBeTruthy('FailureMsg: multiple field lock icon missing');
            expect(await activityTabPage.isTitleTextDisplayedInActivity('Qadim Katawazi changed the following task fields', 1)).toBeTruthy('FailureMsg: Assignment change field log header');
            expect(await activityTabPage.isTextPresentInActivityLog('Assignee')).toBeTruthy('FailureMsg: Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Qadim Katawazi')).toBeTruthy('FailureMsg: Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Assigned Business Unit')).toBeTruthy('FailureMsg: Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('United States Support')).toBeTruthy('FailureMsg: Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Assigned Group')).toBeTruthy('FailureMsg: Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('US Support 3')).toBeTruthy('FailureMsg: Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Description')).toBeTruthy('FailureMsg: Text is missing in activity log');
        });
    });

    //kgaikwad
    describe('[DRDMV-16737]: [-ve] - Case having large no. of activities eg. more then 100', async () => {
        let newCase;
        beforeAll(async () => {
            // Create Case
            let caseData = {
                "Requester": "qtao",
                "Summary": "DRDMV-21619_TC",
                "Assigned Company": "Petramco",
                "Business Unit": "Canada Support",
                "Support Group": "CA Support 1",
                "Assignee": "qdu"
            }

            await apiHelper.apiLogin('qkatawazi');
            newCase = await apiHelper.createCase(caseData);

            // Create General Notes 
            for (let a = 0; a < 100; a++) {
                await browser.sleep(1000);
                await apiHelper.postActivityCommentsWithoutAttachments(`DRDMV-16737 Activity Notes ${a}`, 'Case', newCase.id);
            }

            // Create Second Activity  
            for (let b = 0; b < 20; b++) {
                let updatecase1 = {
                    "description": "Case_Description_" + b
                }
                await browser.sleep(1000);
                await apiHelper.updateCase(newCase.id, updatecase1);
            }

            // Create First Activity  
            for (let i = 0; i < 10; i++) {
                let updatecase2 = {
                    "casePriority": "Low"
                }
                let updatecase3 = {
                    "casePriority": "High"
                }
                await browser.sleep(1000);
                await apiHelper.updateCase(newCase.id, updatecase2);
                await apiHelper.updateCase(newCase.id, updatecase3);
            }
        });

        it('[DRDMV-16737]: Verify count for first 20 Activity', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(newCase.displayId);
            for (let i = 1; i <= 20; i++) {
                await activityTabPage.scrollToActivity(i);
                expect(await activityTabPage.isTitleTextDisplayedInActivity('Qadim Katawazi changed the case priority', i)).toBeTruthy(`Changed the case priority is missing ${i}`);
            }
        });

        it('[DRDMV-16737]: Verify count for second 20 Activity', async () => {
            for (let j = 21; j <= 40; j++) {
                await activityTabPage.scrollToActivity(j);
                expect(await activityTabPage.isTitleTextDisplayedInActivity('Qadim Katawazi changed the following case fields', j)).toBeTruthy(`Changed the following case fields is missing ${j}`);
            }
        });

        it('[DRDMV-16737]: Verify Gerneral Notes 100 Activity', async () => {
            await activityTabPage.clickOnFilterButton();
            await activityTabPage.selectFilterCheckBox('General Notes');
            await activityTabPage.clickOnFilterApplyButton();
            for (let k = 1; k <= 100; k++) {
                await activityTabPage.scrollToActivity(k);
                expect(await activityTabPage.isTitleTextDisplayedInActivity('Qadim Katawazi added a note', k)).toBeTruthy(`Changed the following case fields is missing ${k}`);
            }
        });
    });

    //kgaikwad
    describe('[DRDMV-16763]: [-ve] - Task having large no. of activities eg. more then 100', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let newCase, adhocTaskTemplateData;
        beforeAll(async () => {
            // Create Case
            let caseData = {
                "Requester": "qtao",
                "Summary": "DRDMV-16763_TC",
                "Assigned Company": "Petramco",
                "Business Unit": "Canada Support",
                "Support Group": "CA Support 1",
                "Assignee": "qdu"
            }
            await apiHelper.apiLogin('qkatawazi');
            newCase = await apiHelper.createCase(caseData);
            // Create Manual Task
            adhocTaskTemplateData = {
                "taskName": "DRDMV-16763_" + randomStr,
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qfeng",
            }
            let task = await apiHelper.createAdhocTask(newCase.id, adhocTaskTemplateData);
            await apiHelper.updateCaseStatus(newCase.id, 'InProgress');

            // Create General Notes 
            for (let a = 0; a < 100; a++) {
                await browser.sleep(1000);
                await apiHelper.postActivityCommentsWithoutAttachments(`DRDMV-16737 Task Activity Notes ${a}`, 'Task', task.id);
            }
            // Create Second Activity  
            for (let b = 0; b < 20; b++) {
                let updateTask1 = { "description": "Task_Description_" + b };
                await browser.sleep(1000);
                await apiHelper.updateTask(task.id, updateTask1);
            }

            // Create First Activity  
            for (let c = 0; c < 10; c++) {
                let updateTask2 = { "priority": "Low" };
                let updateTask3 = { "priority": "High" };
                await browser.sleep(1000);
                await apiHelper.updateTask(task.id, updateTask2);
                await apiHelper.updateTask(task.id, updateTask3);
            }
        });

        it('[DRDMV-16763]: Verify count for first 20 Activity', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(newCase.displayId);
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickTaskLink(adhocTaskTemplateData.taskName);
            for (let i = 1; i <= 20; i++) {
                await activityTabPage.scrollToActivity(i);
                expect(await activityTabPage.isTitleTextDisplayedInActivity('Qadim Katawazi changed the task priority', i)).toBeTruthy(`Changed the case priority is missing ${i}`);
            }
        });

        it('[DRDMV-16763]: Verify count for second 20 Activity', async () => {
            for (let j = 21; j <= 40; j++) {
                await activityTabPage.scrollToActivity(j);
                expect(await activityTabPage.isTitleTextDisplayedInActivity('Qadim Katawazi changed the following task fields', j)).toBeTruthy(`Changed the following case fields is missing ${j}`);
            }
        });

        it('[DRDMV-16763]: Verify Gerneral Notes 100 Activity', async () => {
            await activityTabPage.clickOnFilterButton();
            await activityTabPage.selectFilterCheckBox('General Notes');
            await activityTabPage.clickOnFilterApplyButton();
            for (let k = 1; k <= 100; k++) {
                await activityTabPage.scrollToActivity(k);
                expect(await activityTabPage.isTitleTextDisplayedInActivity('Qadim Katawazi added a note', k)).toBeTruthy(`Changed the following case fields is missing ${k}`);
            }
        });
    });

    //kgaikwad
    describe('[DRDMV-16771]: [-ve] - KA having large no. of activities eg. more then 100', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let knowledgeArticleData;
        beforeAll(async () => {
            // Create knowledge Article task template
            let articleData = {
                "knowledgeSet": "HR",
                "title": "DRDMV-16771_KA" + randomStr,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United Kingdom Support",
                "assigneeSupportGroup": "GB Support 1",
                "assignee": "KMills"
            }

            await apiHelper.apiLogin('qkatawazi');
            knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData.id, 'Draft')).toBeTruthy('FailureMsg Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData.id, 'PublishApproval', "qkatawazi", "Compensation and Benefits")).toBeTruthy('Status Not Set');

            // Create General Notes 
            for (let a = 0; a < 100; a++) {
                await browser.sleep(1000);
                await apiHelper.postActivityCommentsWithoutAttachments(`DRDMV-16771 KA Activity Notes ${a}`, 'KnowledgeArticleTemplate', knowledgeArticleData.id);
            }

            // Create General Notes 
            for (let a = 0; a < 20; a++) {
                await browser.sleep(1000);
                await apiHelper.apiLogin('qkatawazi');
                await apiHelper.flagAndUnflagKnowledgeArticle(knowledgeArticleData.id, "FlagComment1", 1);
                await apiHelper.apiLogin('kmills');
                await apiHelper.flagAndUnflagKnowledgeArticle(knowledgeArticleData.id, "FlagComment2", 0);
            }
        });

        it('[DRDMV-16771]: Verify count for first & Second 20 Activity', async () => {
            await navigationPage.gotoKnowledgeConsole();
            await knowledgeArticlesConsolePo.searchAndOpenKnowledgeArticle(knowledgeArticleData.displayId);
            await viewKnowledgeArticlePo.clickOnActivityTab();
            expect(await activityTabPage.isTitleTextDisplayedInActivity('Kyle Mills has provided the feedback for the article', 1)).toBeTruthy('Kyle Mills has provided the feedback for the article for 1 activity');
            expect(await activityTabPage.isTitleTextDisplayedInActivity('Qadim Katawazi flagged the article', 2)).toBeTruthy('Qadim Katawazi flagged the article for 2 activity');

            for (let i = 3; i <= 40; i++) {
                await activityTabPage.scrollToActivity(i);
                if (i % 2 == 0) {
                    expect(await activityTabPage.isTitleTextDisplayedInActivity('Qadim Katawazi flagged the article', i)).toBeTruthy(`Qadim Katawazi flagged the article for 2 activity ${i}`);
                } else {
                    expect(await activityTabPage.isTitleTextDisplayedInActivity('Kyle Mills has provided the feedback for the article', i)).toBeTruthy(`Kyle Mills has provided the feedback for the article for activity ${i}`);
                }
            }
        });

        it('[DRDMV-16771]: Verify Gerneral Notes 100 Activity', async () => {
            await activityTabPage.clickOnFilterButton();
            await activityTabPage.selectFilterCheckBox('General Notes');
            await activityTabPage.clickOnFilterApplyButton();
            for (let k = 1; k <= 100; k++) {
                await activityTabPage.scrollToActivity(k);
                expect(await activityTabPage.isTitleTextDisplayedInActivity('Qadim Katawazi added a note', k)).toBeTruthy(`Changed the following case fields is missing ${k}`);
            }
        });
    });

    //kgaikwad
    describe('[DRDMV-16729]: All type of social activities are displayed correctly in Case Activity tab', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseData = undefined;
        let caseId: string;
        let caseTemplateDataWithMatchingSummary;
        let caseModule = 'Case';
        let automatedTaskTemplateSummary = 'AutomatedTaskTemplateSummaryDRDMV16729' + randomStr;
        let manualTaskTemplateSummary = 'ManualTaskTemplateSummaryDRDMV16729' + randomStr;
        let externalTaskTemplateSummary = 'ExternalTaskTemplateSummaryDRDMV16729' + randomStr;
        let automatedTaskTemplateDetails;
        let manualTaskTemplateDetails;
        let externalTaskTemplateDetails;
        let caseApprovalRecordDefinition = 'com.bmc.dsm.case-lib:Case';
        let caseResponseDetails;
        let categName1 = 'DemoCateg1';
        let categName2 = 'DemoCateg2';
        let categName3 = 'DemoCateg3';
        let categName4 = 'DemoCateg4';
        let manualTaskId;
        let approvalStr = "Automated Self Approval without process " + randomStr;
        let confidentialSupportGroup = "Employee Relations Sensitive Data Access";

        beforeAll(async () => {
            // Create Case Template through API
            caseTemplateDataWithMatchingSummary = {
                "templateName": 'caseTemplateForSelfApprovalWithoutProcessWithCriticalPriority' + randomStr,
                "templateSummary": approvalStr,
                "categoryTier1": 'Applications',
                "categoryTier2": 'Social',
                "categoryTier3": 'Chatter',
                "casePriority": "Medium",
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qfeng",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }

            await apiHelper.apiLogin('qkatawazi');
            let caseTemplateWithMatchingSummaryResponse = await apiHelper.createCaseTemplate(caseTemplateDataWithMatchingSummary);
            let caseTemplateDisplayId = caseTemplateWithMatchingSummaryResponse.displayId;

            //Create Approval Mapping through API
            let approvalMappingData = {
                "triggerStatus": "Assigned",
                "errorStatus": "New",
                "approvedStatus": "InProgress",
                "noApprovalFoundStatus": "Assigned",
                "rejectStatus": "Canceled",
                "company": "Petramco",
                "mappingName": "Approval Mapping for Self Approval"
            }
            await apiHelper.deleteApprovalMapping(caseModule);
            let approvalMappingId = await apiHelper.createApprovalMapping(caseModule, approvalMappingData);
            await apiHelper.associateTemplateWithApprovalMapping(caseModule, caseTemplateWithMatchingSummaryResponse.id, approvalMappingId.id);


            let autoTaskTemplateData = {
                "templateName": `AutomatedTaskTemplateActive` + randomStr,
                "templateSummary": `Automated Approval for task`,
                "templateStatus": "Active",
                "category1": 'Facilities',
                "category2": 'Kitchen',
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": `Case Process 1 ${randomStr}`,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities",
            }

            let tasktemplateData = {
                "templateName": 'TaskTemplateName',
                "templateSummary": 'task Summary task16729',
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "category1": 'Facilities',
                "category2": 'Kitchen',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
            }

            autoTaskTemplateData.templateSummary = automatedTaskTemplateSummary;
            automatedTaskTemplateDetails = await apiHelper.createAutomatedTaskTemplate(autoTaskTemplateData);
            // Create Manual Task
            tasktemplateData.templateName = 'ManualTaskTemplateNameDRDMV16729' + randomStr;
            tasktemplateData.templateSummary = manualTaskTemplateSummary;
            manualTaskTemplateDetails = await apiHelper.createManualTaskTemplate(tasktemplateData);
            // Create External Task
            tasktemplateData.templateName = 'ExternalTaskTemplateNameDRDMV16729' + randomStr;
            tasktemplateData.templateSummary = externalTaskTemplateSummary;
            externalTaskTemplateDetails = await apiHelper.createExternalTaskTemplate(tasktemplateData);

            await apiHelper.associateCaseTemplateWithThreeTaskTemplate(caseTemplateDisplayId, manualTaskTemplateDetails.displayId, externalTaskTemplateDetails.displayId, automatedTaskTemplateDetails.displayId);

            // create case json
            caseData = {
                "Requester": "qdu",
                "Summary": approvalStr,
                "Origin": "Agent",
                "Case Template ID": caseTemplateDisplayId
            }

            // Create category tier 4
            await apiHelper.apiLogin('tadmin');
            await apiHelper.createOperationalCategory(categName1);
            await apiHelper.createOperationalCategory(categName2);
            await apiHelper.createOperationalCategory(categName3);
            await apiHelper.createOperationalCategory(categName4);
            await apiHelper.associateCategoryToOrganization(categName1, 'Petramco');
            await apiHelper.associateCategoryToCategory(categName1, categName2);
            await apiHelper.associateCategoryToCategory(categName2, categName3);
            await apiHelper.associateCategoryToCategory(categName3, categName4);
            await apiHelper.associateCategoryToOrganization(categName1, '- Global -');
        });

        it('[DRDMV-16729]:Create Self Approval Flow Without Process', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Approvals--Approval Configuration', 'Approval Configuration - Administration - Business Workflows');
            await approvalConfigurationPage.searchAndOpenApprovalConfiguration(caseApprovalRecordDefinition);
            expect(await approvalConfigurationPage.isCreateNewApprovalFlowPopUpDisplayed()).toBeTruthy();
            expect(await approvalConfigurationPage.getCreateNewApprovalFlowPopUpTitle()).toContain('Edit Approval Flow');
            await approvalConfigurationPage.clickApprovalConfigurationTab('Self Approval');
            await approvalConfigurationPage.clickNewSelfApprovalFlowButton();
            expect(await approvalConfigurationPage.isCreateNewApprovalFlowPopUpDisplayed()).toBeTruthy();
            expect(await approvalConfigurationPage.getCreateNewApprovalFlowPopUpTitle()).toContain('Create Approval Flow');
            await browser.sleep(5000); //sleep added for expression builder loading
            await approvalConfigurationPage.searchExpressionFieldOption('Summary');
            await approvalConfigurationPage.clickRecordOption('Record Definition');
            await approvalConfigurationPage.clickRecordOption('Case');
            await approvalConfigurationPage.selectExpressionFieldOption();
            await browser.sleep(1000); //sleep added for expression builder loading
            await approvalConfigurationPage.selectExpressionOperator('=');
            await browser.sleep(1000); //sleep added for expression builder loading
            await approvalConfigurationPage.setExpressionValueForParameter(`"${approvalStr}"`);
            await approvalConfigurationPage.clickNextbuttonOnSelfApproval();
            await approvalConfigurationPage.setAuditInformationValue('test self approval');
            await approvalConfigurationPage.clickNewApprovalFlowSaveButton();
            await approvalConfigurationPage.closeEditApprovalFlowPopUpWindow('Close');
        });

        it('[DRDMV-16729]:Create case and verify self approval without process', async () => {
            await apiHelper.apiLogin('qfeng');
            caseResponseDetails = await apiHelper.createCase(caseData);
            caseId = caseResponseDetails.displayId;
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await caseConsolePo.searchAndOpenCase(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("In Progress");
            expect(await activityTabPage.isLogIconDisplayedInActivity('check_circle', 4)).toBeTruthy('FailureMsg11: log icon is missing');
            expect(await activityTabPage.isTextPresentInActivityLog('Case was auto-approved')).toBeTruthy('FailureMsg23: In Progress Text is missing in activity log');
            expect(await activityTabPage.isLockIconDisplayedInActivity(5)).toBeFalsy('FailureMsg12: lock icon displayed on activity logs');
        });

        it('[DRDMV-16729]:Verify case creation', async () => {
            await activityTabPage.clickOnShowMore();
            expect(await activityTabPage.isLogIconDisplayedInActivity('filePlus', 3)).toBeTruthy('FailureMsg11: log icon is missing');
            expect(await activityTabPage.isLockIconDisplayedInActivity(3)).toBeTruthy('FailureMsg12: lock icon missing in activity logs');
            expect(await activityTabPage.isTextPresentInActivityLog(approvalStr)).toBeTruthy(`FailureMsg23: ${approvalStr} Text is missing in activity log`);
            expect(await activityTabPage.isTextPresentInActivityLog('Status ')).toBeTruthy('FailureMsg23: Status  Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Assigned ')).toBeTruthy('FailureMsg23: Assigned  Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Assignee ')).toBeTruthy('FailureMsg23: Assignee  Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Qiao Feng')).toBeTruthy('FailureMsg23: Qiao Feng Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Site ')).toBeTruthy('FailureMsg23: Site  Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Vancouver  ')).toBeTruthy('FailureMsg23: Vancouver   Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Assigned Company')).toBeTruthy('FailureMsg23: Assigned Company Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Petramco')).toBeTruthy('FailureMsg23: Petramco Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Assigned Business Unit')).toBeTruthy('FailureMsg23: Assigned Business Unit Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('United States Support')).toBeTruthy('FailureMsg23: United States Support Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Description')).toBeTruthy('FailureMsg23: Description  Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Case Template description')).toBeTruthy('FailureMsg23: Case Template description Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Category Tier 1')).toBeTruthy('FailureMsg23: Category Tier 1 Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Applications ')).toBeTruthy('FailureMsg23: Applications   Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Category Tier 2')).toBeTruthy('FailureMsg23: Category Tier 2 Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Social')).toBeTruthy('FailureMsg23: Social Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Category Tier 3')).toBeTruthy('FailureMsg23: Category Tier 3 Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Chatter')).toBeTruthy('FailureMsg23: Chatter Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Priority')).toBeTruthy('FailureMsg23: Priority Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Medium')).toBeTruthy('FailureMsg23: Medium Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Assigned Group')).toBeTruthy('FailureMsg23: Assigned Group Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('US Support 3')).toBeTruthy('FailureMsg23: US Support 3 Text is missing in activity log');
        });

        it('[DRDMV-16729]:Verify social activity with Task activity', async () => {
            // Verify manual task on case activity
            await viewCasePo.clickOnTaskLink(manualTaskTemplateSummary);
            manualTaskId = await viewTaskPo.getTaskID();
            await activityTabPage.addActivityNote('manualTaskActivityNote');
            await activityTabPage.clickOnPostButton();

            await viewTaskPo.clickOnChangeStatus();
            await viewTaskPo.changeTaskStatus('Completed');
            await updateStatusBladePo.setStatusReason('Successful');
            await updateStatusBladePo.clickSaveStatus();

            await viewTaskPo.clickOnViewCase();

            expect(await activityTabPage.isLogIconDisplayedInActivity('note_pencil', 1)).toBeTruthy('FailureMsg19: log icon is missing');
            expect(await activityTabPage.isLockIconDisplayedInActivity(1)).toBeTruthy('FailureMsg20: lock icon missing in activity logs');
            expect(await activityTabPage.isTextPresentInActivityLog(`Qiao Feng added a note to ${manualTaskId}`)).toBeTruthy(`FailureMsg21: Qiao Feng added a note to ${manualTaskTemplateDetails.displayId} log title is missing`);
            expect(await activityTabPage.isTextPresentInActivityLog('manualTaskActivityNote')).toBeTruthy('FailureMsg23: manualTaskActivityNote Text is missing in activity log');

            // Verify External Task on case activity
            await viewCasePo.clickOnTaskLink(externalTaskTemplateSummary);
            let externalTaskId = await viewTaskPo.getTaskID();
            await activityTabPage.addActivityNote('externalTaskActivityNote');
            await activityTabPage.clickOnPostButton();

            await viewTaskPo.clickOnChangeStatus();
            await viewTaskPo.changeTaskStatus('Completed');
            await updateStatusBladePo.setStatusReason('Successful');
            await updateStatusBladePo.clickSaveStatus();

            await viewTaskPo.clickOnViewCase();

            expect(await activityTabPage.isLogIconDisplayedInActivity('note_pencil', 1)).toBeTruthy('FailureMsg19: log icon is missing');
            expect(await activityTabPage.isLockIconDisplayedInActivity(1)).toBeTruthy('FailureMsg20: lock icon missing in activity logs');
            expect(await activityTabPage.isTextPresentInActivityLog(`Qiao Feng added a note to ${externalTaskId}`)).toBeTruthy(`FailureMsg21: Qiao Feng added a note to ${externalTaskId} log title is missing`);
            expect(await activityTabPage.isTextPresentInActivityLog('manualTaskActivityNote')).toBeTruthy('FailureMsg23: manualTaskActivityNote Text is missing in activity log');

            // Verify Automated Task on case activity
            await viewCasePo.clickOnTaskLink(automatedTaskTemplateSummary);
            let automatedTaskId = await viewTaskPo.getTaskID();
            await activityTabPage.addActivityNote('automatedTaskActivityNote');
            await activityTabPage.clickOnPostButton();

            await viewTaskPo.clickOnViewCase();

            expect(await activityTabPage.isLogIconDisplayedInActivity('note_pencil', 1)).toBeTruthy('FailureMsg19: log icon is missing');
            expect(await activityTabPage.isLockIconDisplayedInActivity(1)).toBeTruthy('FailureMsg20: lock icon missing in activity logs');
            expect(await activityTabPage.isTextPresentInActivityLog(`Qiao Feng added a note to ${automatedTaskId}`)).toBeTruthy(`FailureMsg21: Qiao Feng added a note to ${automatedTaskId} log title is missing`);
            expect(await activityTabPage.isTextPresentInActivityLog('automatedTaskActivityNote')).toBeTruthy('FailureMsg23: automatedTaskActivityNote Text is missing in activity log');
        });

        it('[DRDMV-16729]:Verify social activity with status change and reopen case', async () => {
            await updateStatusBladePo.changeCaseStatus('Resolved');
            await updateStatusBladePo.setStatusReason('Auto Resolved');
            await updateStatusBladePo.clickSaveStatus('Resolved');
            expect(await viewCasePo.getCaseStatusValue()).toBe('Resolved', 'FailureMsg19: Case status not displayed');

            expect(await activityTabPage.isLogIconDisplayedInActivity('arrow_squares', 1)).toBeTruthy('FailureMsg19: log icon is missing');
            expect(await activityTabPage.isTextPresentInActivityLog('Qiao Feng changed the case status')).toBeTruthy('FailureMsg23: Qiao Feng changed the case status Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Resolved')).toBeTruthy('FailureMsg23: In Progress Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Status Reason')).toBeTruthy('FailureMsg23: Status Reason Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Auto Resolved')).toBeTruthy('FailureMsg23: Auto Resolved Text is missing in activity log');

            await viewCasePo.clickOnReopenCaseLink();

            expect(await activityTabPage.isLogIconDisplayedInActivity('right-refresh', 1)).toBeTruthy('FailureMsg19: log icon is missing');
            expect(await activityTabPage.isLockIconDisplayedInActivity(1)).toBeTruthy('FailureMsg20: lock icon missing in activity logs');
            expect(await activityTabPage.isTitleTextDisplayedInActivity('Qiao Feng reopened the case', 1)).toBeTruthy('FailureMsg21: log title is missing');
            expect(await activityTabPage.isTextPresentInActivityLog('The case was reopened for 1 time')).toBeTruthy('FailureMsg22: title Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('In Progress')).toBeTruthy('FailureMsg23: In Progress Text is missing in activity log');
        });

        // add defect for error in following it block
        it('[DRDMV-16729]:Verify social activity with change priority', async () => {
            let updatePriority = { "casePriority": "Low" };
            await apiHelper.updateCase(caseResponseDetails.id, updatePriority);
            await activityTabPage.clickOnRefreshButton();

            expect(await activityTabPage.isLogIconDisplayedInActivity('arrow_exclamation_circle', 1)).toBeTruthy('FailureMsg19: log icon is missing');
            expect(await activityTabPage.isLockIconDisplayedInActivity(1)).toBeTruthy('FailureMsg20: lock icon missing in activity logs');
            expect(await activityTabPage.isTextPresentInActivityLog('Qiao Feng changed the case priority')).toBeTruthy('FailureMsg21: log title is missing');
            expect(await activityTabPage.isTextPresentInActivityLog('Low')).toBeTruthy('FailureMsg21: Low text is missing');
        });

        it('[DRDMV-16729]:Verify social activity with change asssignment', async () => {
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickChangeAssignmentButton();
            await changeAssignmentBladePo.selectCompany('Petramco')
            await changeAssignmentBladePo.selectBusinessUnit('Facilities Support');
            await changeAssignmentBladePo.selectSupportGroup('Facilities');
            await changeAssignmentBladePo.selectAssignee('Fritz');
            await changeAssignmentBladePo.clickOnAssignButton();
            await editCasePo.clickSaveCase();
            await activityTabPage.clickOnShowMore();
            expect(await activityTabPage.isLogIconDisplayedInActivity('files_change', 1)).toBeTruthy('FailureMsg19: log icon is missing');
            expect(await activityTabPage.isLockIconDisplayedInActivity(1)).toBeTruthy('FailureMsg20: lock icon missing in activity logs');
            expect(await activityTabPage.isTextPresentInActivityLog('Qiao Feng changed the following case fields')).toBeTruthy('FailureMsg23: Qiao Feng changed the following case fields Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Assignee')).toBeTruthy('FailureMsg23: Assignee Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Fritz Schulz ')).toBeTruthy('FailureMsg23: Fritz Schulz  Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Assigned Business Unit')).toBeTruthy('FailureMsg23: Assigned Business Unit Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Facilities Support')).toBeTruthy('FailureMsg23: Facilities Support Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Assigned Group')).toBeTruthy('FailureMsg23: Assigned Group Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Facilities')).toBeTruthy('FailureMsg23: Facilities  Text is missing in activity log');
        });

        it('[DRDMV-16729]:Verify social activity with status change activity', async () => {
            await viewCasePo.clickEditCaseButton();
            await editCasePo.updateCaseCategoryTier1(categName1);
            await editCasePo.updateCaseCategoryTier2(categName2);
            await editCasePo.updateCaseCategoryTier3(categName3);
            await editCasePo.updateCaseCategoryTier4(categName4);
            await editCasePo.clickSaveCase();

            expect(await activityTabPage.isLogIconDisplayedInActivity('squares_arrows', 1)).toBeTruthy('FailureMsg19: log icon is missing');
            expect(await activityTabPage.isLockIconDisplayedInActivity(1)).toBeTruthy('FailureMsg20: lock icon missing in activity logs');
            expect(await activityTabPage.isTextPresentInActivityLog('Qiao Feng changed the case category')).toBeTruthy('FailureMsg23: Qiao Feng changed the case category Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Category Tier 1')).toBeTruthy('FailureMsg23: Category Tier 1  Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog(categName1)).toBeTruthy('FailureMsg23: categName1  Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Category Tier 2')).toBeTruthy('FailureMsg23: Category Tier 2  Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog(categName2)).toBeTruthy('FailureMsg23: categName2  Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Category Tier 3')).toBeTruthy('FailureMsg23: Category Tier 3  Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog(categName3)).toBeTruthy('FailureMsg23: categName3  Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Category Tier 4')).toBeTruthy('FailureMsg23: Category Tier 4  Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog(categName4)).toBeTruthy('FailureMsg23: categName4  Text is missing in activity log');
        });

        it('[DRDMV-16729]:Verify social activity with multiple activity', async () => {
            await viewCasePo.clickEditCaseButton();
            await editCasePo.updateCasePriority('High');
            await editCasePo.setCaseSummary('caseSummary');
            await editCasePo.updateDescription('caseDescription');
            await editCasePo.clickSaveCase();
            await activityTabPage.clickOnRefreshButton();
            await activityTabPage.clickOnShowMore();

            expect(await activityTabPage.isLogIconDisplayedInActivity('files_change', 1)).toBeTruthy('FailureMsg19: log icon is missing');
            expect(await activityTabPage.isLockIconDisplayedInActivity(1)).toBeTruthy('FailureMsg20: lock icon missing in activity logs');
            expect(await activityTabPage.isTextPresentInActivityLog('Qiao Feng changed the following case fields')).toBeTruthy('FailureMsg23: Qiao Feng changed the following case fields Text is missing in activity log');

            expect(await activityTabPage.isTextPresentInActivityLog('Summary')).toBeTruthy('FailureMsg23: Summary  Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('caseSummary')).toBeTruthy('FailureMsg23: caseSummary  Text is missing in activity log');

            expect(await activityTabPage.isTextPresentInActivityLog('caseDescription')).toBeTruthy('FailureMsg23: caseDescription  Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Priority')).toBeTruthy('FailureMsg23: Priority  Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('High')).toBeTruthy('FailureMsg23: High Text is missing in activity log');
        });

        it('[DRDMV-16729]:Verify social activity with sendimg email to requester', async () => {
            await viewCasePo.clickOnEmailLink();
            await browser.sleep(1000); // Sleep till open conmpose email pop up
            await composeMailPo.setToOrCCInputTextbox('To', 'apavlik@petramco.com');
            await composeMailPo.clickOnSendButton();
            await activityTabPage.clickOnRefreshButton();

            expect(await activityTabPage.isLogIconDisplayedInActivity('envelope', 1)).toBeTruthy('FailureMsg19: log icon is missing');
            expect(await activityTabPage.isLockIconDisplayedInActivity(1)).toBeTruthy('FailureMsg20: lock icon displayed activity logs');
            expect(await activityTabPage.isTextPresentInActivityLog('Qiao Feng sent an email')).toBeTruthy('FailureMsg21: Qiao Feng sent an email Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Adam Pavlik')).toBeTruthy('FailureMsg22: Adam Pavlik Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog(`${caseId}:caseSummary`)).toBeTruthy(`FailureMsg23: ${caseId}:caseSummary Text is missing in activity log`);
            expect(await activityTabPage.isTextPresentInActivityLog('------ While replying, please do not add information below this line -----')).toBeTruthy('FailureMsg24: ------ While replying, please do not add information below this line ----- Text is missing in activity log');
        });

        it('[DRDMV-16729]:Verify social activity with public private and private comment', async () => {
            // private activity note
            await activityTabPage.addActivityNote('privateActivityNote');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isLogIconDisplayedInActivity('note_pencil', 1)).toBeTruthy('FailureMsg19: log icon is missing');
            expect(await activityTabPage.isLockIconDisplayedInActivity(1)).toBeTruthy('FailureMsg20: lock icon missing in activity logs');
            expect(await activityTabPage.isTextPresentInActivityLog('Qiao Feng added a note')).toBeTruthy('FailureMsg21: Qiao Feng added a note Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('privateActivityNote')).toBeTruthy('FailureMsg22: privateActivityNote Text is missing in activity log');

            // Private activity note
            await activityTabPage.addActivityNote('publicActivityNote');
            await activityTabPage.clickPublicCheckbox();
            await activityTabPage.clickOnPostButton();

            expect(await activityTabPage.isLogIconDisplayedInActivity('note_pencil', 1)).toBeTruthy('FailureMsg19: log icon is missing');
            expect(await activityTabPage.isLockIconDisplayedInActivity(1)).toBeFalsy('FailureMsg20: lock icon displayed in activity logs');
            expect(await activityTabPage.isTextPresentInActivityLog('Qiao Feng added a note')).toBeTruthy('FailureMsg21: Qiao Feng added a note Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('publicActivityNote')).toBeTruthy('FailureMsg22: publicActivityNote Text is missing in activity log');
        });

        it('[DRDMV-16729]:Verify social activity with sendimg email to other than requester', async () => {
            await viewCasePo.clickOnEmailLink();
            await browser.sleep(1000); // Sleep till open conmpose email pop up
            await composeMailPo.setToOrCCInputTextbox('To', 'fritz');
            await composeMailPo.clickOnSendButton();
            await activityTabPage.clickOnRefreshButton();

            expect(await activityTabPage.isLogIconDisplayedInActivity('envelope', 1)).toBeTruthy('FailureMsg19: log icon is missing');
            expect(await activityTabPage.isLockIconDisplayedInActivity(1)).toBeTruthy('FailureMsg20: lock icon missing in activity logs');
            expect(await activityTabPage.isTextPresentInActivityLog('Qiao Feng sent an email')).toBeTruthy('FailureMsg21: Qiao Feng sent an email Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Fritz Schulz')).toBeTruthy('FailureMsg22: Fritz Schulz Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog(`${caseId}:caseSummary`)).toBeTruthy(`FailureMsg23: ${caseId}:caseSummary Text is missing in activity log`);
            expect(await activityTabPage.isTextPresentInActivityLog('------ While replying, please do not add information below this line -----')).toBeTruthy('FailureMsg24: ------ While replying, please do not add information below this line ----- Text is missing in activity log');
        });

        it('[DRDMV-16729]:Verify social activity with confendial support group', async () => {
            await viewCasePo.clickOnTab('Case Access');
            await accessTabPo.clickToExpandAccessEntitiySearch('Support Group Access', 'Confidential Group');
            await accessTabPo.selectAccessEntityDropDown(confidentialSupportGroup, 'Select Support Group', true);
            await accessTabPo.clickAccessEntitiyAddButton('Support Group');

            expect(await activityTabPage.isLogIconDisplayedInActivity('lock_shield', 1)).toBeTruthy('FailureMsg19: log icon is missing');
            expect(await activityTabPage.isLockIconDisplayedInActivity(1)).toBeTruthy('FailureMsg20: lock icon missing in activity logs');
            expect(await activityTabPage.isTextPresentInActivityLog('Qiao Feng added the confidential support group')).toBeTruthy('FailureMsg21: Qiao Feng added the confidential support group Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog(confidentialSupportGroup)).toBeTruthy(`FailureMsg21: ${confidentialSupportGroup} Text is missing in activity log`);

            // Remove Confedential Group
            await accessTabPo.clickRemoveAccess(confidentialSupportGroup);
            await activityTabPage.clickOnRefreshButton();
            expect(await activityTabPage.isLogIconDisplayedInActivity('lock_shield', 1)).toBeTruthy('FailureMsg19: log icon is missing');
            expect(await activityTabPage.isLockIconDisplayedInActivity(1)).toBeTruthy('FailureMsg20: lock icon missing in activity logs');
            expect(await activityTabPage.isTextPresentInActivityLog('Qiao Feng removed the confidential support group')).toBeTruthy('FailureMsg21: Qiao Feng removed the confidential support group Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog(confidentialSupportGroup)).toBeTruthy(`FailureMsg21: ${confidentialSupportGroup} Text is missing in activity log`);
        });

        it('[DRDMV-16729]:Verify social activity with task email activity', async () => {
            await viewCasePo.clickOnTab('Tasks');
            await viewCasePo.clickOnTaskLink(manualTaskTemplateSummary);
            await activityTabPage.clickOnRefreshButton();
            await viewTaskPo.clickEmailLink();
            await browser.sleep(2000); // Need this sleep till open conmpose email pop up
            await composeMailPo.setToOrCCInputTextbox('To', 'qkatawazi');
            await composeMailPo.clickOnSendButton();
            await viewTaskPo.clickOnViewCase()
            await activityTabPage.clickOnRefreshButton();

            expect(await activityTabPage.isLogIconDisplayedInActivity('envelope', 1)).toBeTruthy('FailureMsg19: log icon is missing');
            expect(await activityTabPage.isLockIconDisplayedInActivity(1)).toBeTruthy('FailureMsg20: lock icon missing in activity logs');
            expect(await activityTabPage.isTextPresentInActivityLog('Qiao Feng sent an email')).toBeTruthy('FailureMsg21: Qiao Feng sent an email Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog('Qadim Katawazi')).toBeTruthy('FailureMsg22: Qadim Katawazi Text is missing in activity log');
            expect(await activityTabPage.isTextPresentInActivityLog(`${caseId}:${manualTaskId}:${manualTaskTemplateSummary}`)).toBeTruthy(`FailureMsg23: ${manualTaskId}:${manualTaskTemplateSummary} Text is missing in activity log`);
            expect(await activityTabPage.isTextPresentInActivityLog('------ While replying, please do not add information below this line -----')).toBeTruthy('FailureMsg24: ------ While replying, please do not add information below this line ----- Text is missing in activity log');
        });
    });
});