import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import { BWF_BASE_URL } from '../../utils/constants';
import utilityGrid from '../../utils/utility.grid';
import viewCasePage from '../../pageobject/case/view-case.po';
import manageTaskBlade from "../../pageobject/task/manage-task-blade.po";
import utilityCommon from '../../utils/utility.common';
import coreApi from '../../api/api.core.util';
import updateStatusBlade from '../../pageobject/common/update.status.blade.po';
import taskViewPage from '../../pageobject/task/view-task.po';
import editTaskPo from '../../pageobject/task/edit-task.po';
import notificationPo from '../../pageobject/notification/notification.po';
import activityTabPo from '../../pageobject/social/activity-tab.po';
import createCasePo from '../../pageobject/case/create-case.po';
import previewCasePo from '../../pageobject/case/case-preview.po';
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import statusUpdateBladePo from '../../pageobject/common/update.status.blade.po';

describe('Failed Task', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('fritz');
        await apiHelper.apiLogin('tadmin');
        await apiHelper.setDefaultNotificationForUser('Franz', 'Alert');
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //asahitya
    describe('[DRDMV-10057]: Task behaviour when 2 of 3 tasks on same sequence and first task is failed(Condition set is Proceed further)', () => {
        const randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplatePetramco, newCaseTemplate, manualTaskTemplateData, automatedTaskTemplateSummary1, automatedTaskTemplateSummary2, caseDisplayId;
        beforeAll(async () => {
            await apiHelper.apiLogin('fritz');
            caseTemplatePetramco = {
                "templateName": 'caseTemplateName DRDMV-10057' + randomStr,
                "templateSummary": 'caseTemplateName DRDMV-10057' + randomStr,
                "templateStatus": "Active",
                "casePriority": "Low",
                "caseStatus": "New",
                "company": "Petramco",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "ownerBU": "Facilities Support",
                "ownerGroup": "Facilities",
                "taskFailureConfiguration": "Proceed With Next Task"
            }
            newCaseTemplate = await apiHelper.createCaseTemplate(caseTemplatePetramco);

            manualTaskTemplateData = {
                "templateName": 'Manual task10057' + randomStr,
                "templateSummary": 'Manual task10057' + randomStr,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
            }
            let manualTaskTemplate = await apiHelper.createManualTaskTemplate(manualTaskTemplateData);

            let automatedTaskTemplateData = {
                "templateName": 'Automated1 task10057' + randomStr,
                "templateSummary": 'Automated1 task10057' + randomStr,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": 'Auto Proces1' + randomStr,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
            }
            automatedTaskTemplateSummary1 = automatedTaskTemplateData.templateSummary;
            let automatedTaskTemplate1 = await apiHelper.createAutomatedTaskTemplate(automatedTaskTemplateData);
            automatedTaskTemplateSummary2 = automatedTaskTemplateData.templateSummary = automatedTaskTemplateData.templateName = 'Automated2 task10057' + randomStr;
            automatedTaskTemplateData.processName = 'Auto Proces2' + randomStr;
            let automatedTaskTemplate2 = await apiHelper.createAutomatedTaskTemplate(automatedTaskTemplateData);
            await apiHelper.apiLogin('fritz');
            await apiHelper.enableDisableProcess(`${automatedTaskTemplateData.processBundle}:${automatedTaskTemplateData.processName}`, false);
            await apiHelper.associateCaseTemplateWithThreeTaskTemplate(newCaseTemplate.displayId, automatedTaskTemplate2.displayId, automatedTaskTemplate1.displayId, manualTaskTemplate.displayId, 'THREE_TASKFLOW_SEQUENTIAL_PARALLEL');

            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.setSummary('Summary');
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplatePetramco.templateSummary);
            await createCasePo.clickAssignToMeButton();
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            caseDisplayId = await viewCasePage.getCaseID();
        });

        it('[DRDMV-10057]: Task behaviour when 2 of 3 tasks on same sequence and first task is failed(Condition set is Proceed further)', async () => {
            await statusUpdateBladePo.changeCaseStatus('In Progress');
            await statusUpdateBladePo.clickSaveStatus('In Progress');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(caseDisplayId);
            await viewCasePage.openTaskCard(1);
            expect(await manageTaskBlade.getTaskStatus(manualTaskTemplateData.templateSummary)).toContain('Assigned');
            await utilityCommon.closeAllBlades();

            await viewCasePage.openTaskCard(2);
            expect(await manageTaskBlade.getTaskStatus(automatedTaskTemplateSummary2)).toContain('Failed');
            await utilityCommon.closeAllBlades();

            await viewCasePage.openTaskCard(3);
            expect(await manageTaskBlade.getTaskStatus(automatedTaskTemplateSummary1)).toContain('Completed');
            await utilityCommon.closeAllBlades();

            await apiHelper.apiLogin('tadmin');
            let manualTaskGuid = await coreApi.getTaskGuid(manualTaskTemplateData.templateSummary);
            await apiHelper.apiLogin('fritz');
            await apiHelper.updateTaskStatus(manualTaskGuid, 'Completed', 'Successful');

            await updateStatusBlade.changeCaseStatus('Resolved');
            await updateStatusBlade.setStatusReason('Auto Resolved');
            await updateStatusBlade.clickSaveStatus('Resolved');
            expect(await viewCasePage.getTextOfStatus()).toBe('Resolved');
        });

        afterAll(async () => {
            await utilityCommon.closeAllBlades();
        });
    });

    //asahitya
    describe('[DRDMV-10056]: Task behaviour when 2 of 3 automated tasks on same sequence and first task is failed(Condition set is Do not Proceed)', () => {
        const randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplatePetramco, newCaseTemplate, manualTaskTemplateData, automatedTaskTemplateSummary1, automatedTaskTemplateSummary2, caseResponse, caseDisplayId;
        beforeAll(async () => {
            await apiHelper.apiLogin('fritz');
            caseTemplatePetramco = {
                "templateName": 'caseTemplateName DRDMV-10056' + randomStr,
                "templateSummary": 'caseTemplateName DRDMV-10056' + randomStr,
                "templateStatus": "Active",
                "casePriority": "Low",
                "caseStatus": "New",
                "company": "Petramco",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "ownerBU": "Facilities Support",
                "ownerGroup": "Facilities",
                "taskFailureConfiguration": "Do Not Proceed"
            }
            newCaseTemplate = await apiHelper.createCaseTemplate(caseTemplatePetramco);
            await newCaseTemplate.displayId;

            manualTaskTemplateData = {
                "templateName": 'Manual task10056' + randomStr,
                "templateSummary": 'Manual task10056' + randomStr,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
            }
            let manualTaskTemplate = await apiHelper.createManualTaskTemplate(manualTaskTemplateData);

            let automatedTaskTemplateData = {
                "templateName": 'Automated task10056' + randomStr,
                "templateSummary": 'Automated task10056' + randomStr,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": 'Auto Proces' + randomStr,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
            }
            automatedTaskTemplateSummary1 = automatedTaskTemplateData.templateSummary;
            let automatedTaskTemplate1 = await apiHelper.createAutomatedTaskTemplate(automatedTaskTemplateData);
            automatedTaskTemplateSummary2 = automatedTaskTemplateData.templateSummary = automatedTaskTemplateData.templateName = 'Automated2 task10057' + randomStr;
            automatedTaskTemplateData.processName = 'Auto Proces2' + randomStr;
            let automatedTaskTemplate2 = await apiHelper.createAutomatedTaskTemplate(automatedTaskTemplateData);
            await apiHelper.apiLogin('fritz');
            await apiHelper.enableDisableProcess(`${automatedTaskTemplateData.processBundle}:${automatedTaskTemplateData.processName}`, false);
            await apiHelper.associateCaseTemplateWithThreeTaskTemplate(newCaseTemplate.displayId, automatedTaskTemplate2.displayId, automatedTaskTemplate1.displayId, manualTaskTemplate.displayId, 'THREE_TASKFLOW_SEQUENTIAL_PARALLEL');

            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.setSummary('Summary');
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplatePetramco.templateSummary);
            await createCasePo.clickAssignToMeButton();
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            caseDisplayId = await viewCasePage.getCaseID();
            
        });

        it('[DRDMV-10056]: Task behaviour when 2 of 3 automated tasks on same sequence and first task is failed(Condition set is Do not Proceed)', async () => {
            await statusUpdateBladePo.changeCaseStatus('In Progress');
            await statusUpdateBladePo.clickSaveStatus('In Progress');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(caseDisplayId);

            await viewCasePage.openTaskCard(1);
            expect(await manageTaskBlade.getTaskStatus(automatedTaskTemplateSummary2)).toContain('Failed');
            await utilityCommon.closeAllBlades();
            await editTaskPo.clickOnRefreshActivity();
            await viewCasePage.openTaskCard(2);
            expect(await manageTaskBlade.getTaskStatus(manualTaskTemplateData.templateSummary)).toContain('Staged');
            await utilityCommon.closeAllBlades();

            await viewCasePage.openTaskCard(3);
            expect(await manageTaskBlade.getTaskStatus(automatedTaskTemplateSummary1)).toContain('Staged');
            await utilityCommon.closeAllBlades();
        });
    });

    //asahitya
    describe('[DRDMV-10000]: "ReRun"action of failed Automated task', () => {
        const randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let automatedTaskTemplateData, caseResponse;
        beforeAll(async () => {
            //Creating the Automated Task template and disabling the Process
            await apiHelper.apiLogin('fritz');
            automatedTaskTemplateData = {
                "templateName": 'Automated task10000' + randomStr,
                "templateSummary": 'Automated task10000' + randomStr,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": 'Auto Proces' + randomStr,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
            }
            await apiHelper.createAutomatedTaskTemplate(automatedTaskTemplateData);

            //Creating the Case and Task with the Automated Template and associating them
            const caseData = {
                "Description": "DRDMV-10000 Desc",
                "Requester": "qkatawazi",
                "Summary": "DRDMV-10000 Summary",
                "Assigned Company": "Petramco",
                "Business Unit": "Facilities Support",
                "Support Group": "Facilities",
                "Assignee": "Fritz"
            }
            caseResponse = await apiHelper.createCase(caseData);

            const taskData = {
                "company": "Petramco",
                "requesterId": "qkatawazi",
                "templateName": automatedTaskTemplateData.templateSummary
            }
            await apiHelper.enableDisableProcess(`${automatedTaskTemplateData.processBundle}:${automatedTaskTemplateData.processName}`, false);
            await apiHelper.addTaskToCase(taskData, caseResponse.id);

            //Update the Case to In Progress status
            await apiHelper.updateCaseStatus(caseResponse.id, 'InProgress');
        });

        it('[DRDMV-10000]: "ReRun"action of failed Automated task', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(caseResponse.displayId);
            await viewCasePage.clickOnTaskLink(automatedTaskTemplateData.templateSummary);
            expect(await taskViewPage.getTaskStatusValue()).toBe('Failed');
            expect(await taskViewPage.getStatusReason()).toBe('Error');
            await taskViewPage.clickOnViewCase();
            expect(await viewCasePage.getCaseStatusValue()).toBe('In Progress');
            await apiHelper.enableDisableProcess(`${automatedTaskTemplateData.processBundle}:${automatedTaskTemplateData.processName}`, true);
            await viewCasePage.openTaskCard(1);
            expect(await manageTaskBlade.getTaskStatus(automatedTaskTemplateData.templateSummary)).toBe('Failed');
            await manageTaskBlade.clickRerunBtn();
            expect(await utilityCommon.isPopUpMessagePresent('Task rerun completed successfully')).toBeTruthy();
            await utilityCommon.closePopUpMessage();
            expect(await manageTaskBlade.getTaskStatus(automatedTaskTemplateData.templateSummary)).toBe('Completed');
            await utilityCommon.closeAllBlades();
            await editTaskPo.clickOnRefreshActivity();
            expect(await viewCasePage.isAllTaskUnderStatusTitleMatches('Completed Tasks', [automatedTaskTemplateData.templateSummary])).toBeTruthy();
            await viewCasePage.clickOnTaskLink(automatedTaskTemplateData.templateSummary);
            expect(await taskViewPage.getTaskStatusValue()).toBe('Completed');
            expect(await taskViewPage.getStatusReason()).toBe('Successful');
            await utilityCommon.closeAllBlades();
            expect(await activityTabPo.isTextPresentInActivityLog('Fritz Schulz')).toBeTruthy();
            expect(await activityTabPo.isTextPresentInActivityLog('has rerun the task')).toBeTruthy();
        });
    });

    //asahitya
    it('[DRDMV-10031]: Verify Manual Tasks can set to Failed Status', async () => {
        const randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await apiHelper.apiLogin('fritz');
        let manualTaskTemplateData = {
            "templateName": 'Manual task10031' + randomStr,
            "templateSummary": 'Manual task10031' + randomStr,
            "templateStatus": "Active",
            "taskCompany": "Petramco",
            "ownerCompany": "Petramco",
            "ownerBusinessUnit": "Facilities Support",
            "ownerGroup": "Facilities",
            "businessUnit": "Facilities Support",
            "supportGroup": "Facilities",
            "assignee": "Fritz",
        }
        await apiHelper.createManualTaskTemplate(manualTaskTemplateData);

        const caseData = {
            "Description": "DRDMV-10031 Desc",
            "Requester": "qkatawazi",
            "Summary": "DRDMV-10031 Summary",
            "Assigned Company": "Petramco",
            "Business Unit": "Facilities Support",
            "Support Group": "Facilities",
            "Assignee": "Fritz"
        }
        let caseResponse = await apiHelper.createCase(caseData);

        const taskData = {
            "company": "Petramco",
            "requesterId": "qkatawazi",
            "templateName": manualTaskTemplateData.templateSummary
        }
        await apiHelper.addTaskToCase(taskData, caseResponse.id);
        await apiHelper.updateCaseStatus(caseResponse.id, 'InProgress');
        await navigationPage.gotoCaseConsole();
        await utilityGrid.clearFilter();
        await utilityGrid.searchAndOpenHyperlink(caseResponse.displayId);
        await viewCasePage.clickOnTaskLink(manualTaskTemplateData.templateSummary);
        await taskViewPage.clickOnChangeStatus();
        await taskViewPage.changeTaskStatus('Completed');
        await updateStatusBlade.setStatusReason('Failed');
        await updateStatusBlade.clickSaveStatus();
        expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy();
    });

    //asahitya
    describe('[DRDMV-10044]: Task behaviour when one manual task is closed and other sequenced automated task is failed', () => {
        const randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let manualTaskTemplateData1, manualTaskTemplateData2, automatedTaskTemplateData, caseResponse, manualTaskGuid1;
        beforeAll(async () => {
            await apiHelper.apiLogin('fritz');
            manualTaskTemplateData1 = {
                "templateName": 'Manual task10044_1' + randomStr,
                "templateSummary": 'Manual task10044_1' + randomStr,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
            }
            await apiHelper.createManualTaskTemplate(manualTaskTemplateData1);

            manualTaskTemplateData2 = {
                "templateName": 'Manual task10044_2' + randomStr,
                "templateSummary": 'Manual task10044_2' + randomStr,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
            }
            await apiHelper.createManualTaskTemplate(manualTaskTemplateData2);

            automatedTaskTemplateData = {
                "templateName": 'Automated task10000' + randomStr,
                "templateSummary": 'Automated task10000' + randomStr,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": 'Auto Proces' + randomStr,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
            }
            await apiHelper.createAutomatedTaskTemplate(automatedTaskTemplateData);

            const caseData = {
                "Description": "DRDMV-10000 Desc",
                "Requester": "qkatawazi",
                "Summary": "DRDMV-10000 Summary",
                "Assigned Company": "Petramco",
                "Business Unit": "Facilities Support",
                "Support Group": "Facilities",
                "Assignee": "Fritz"
            }
            caseResponse = await apiHelper.createCase(caseData);

            const taskDataManual1 = {
                "company": "Petramco",
                "requesterId": "qkatawazi",
                "templateName": manualTaskTemplateData1.templateSummary
            }

            const taskDataManual2 = {
                "company": "Petramco",
                "requesterId": "qkatawazi",
                "templateName": manualTaskTemplateData2.templateSummary
            }

            const taskDataAutomated = {
                "company": "Petramco",
                "requesterId": "qkatawazi",
                "templateName": automatedTaskTemplateData.templateSummary
            }

            await apiHelper.addTaskToCase(taskDataManual1, caseResponse.id);
            await apiHelper.addTaskToCase(taskDataAutomated, caseResponse.id);
            await apiHelper.addTaskToCase(taskDataManual2, caseResponse.id);
            await apiHelper.enableDisableProcess(`${automatedTaskTemplateData.processBundle}:${automatedTaskTemplateData.processName}`, false);

            await apiHelper.apiLogin('tadmin');
            manualTaskGuid1 = await coreApi.getTaskGuid(manualTaskTemplateData1.templateSummary);
            await apiHelper.apiLogin('fritz');
            await apiHelper.updateCaseStatus(caseResponse.id, 'InProgress');
        });

        it('[[DRDMV-10044]: Task behaviour when one manual task is closed and other sequenced automated task is failed', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(caseResponse.displayId);
            await viewCasePage.openTaskCard(1);
            expect(await manageTaskBlade.getTaskStatus(manualTaskTemplateData1.templateSummary)).toBe('Assigned');
            await utilityCommon.closeAllBlades();

            await apiHelper.updateTaskStatus(manualTaskGuid1, 'Completed', 'Successful');
            await editTaskPo.clickOnRefreshActivity();

            await viewCasePage.openTaskCard(1);
            expect(await manageTaskBlade.getTaskStatus(manualTaskTemplateData1.templateSummary)).toBe('Completed');
            expect(await manageTaskBlade.getTaskStatus(automatedTaskTemplateData.templateSummary)).toBe('Failed');
            expect(await manageTaskBlade.getTaskStatus(manualTaskTemplateData2.templateSummary)).toBe('Staged');

            await manageTaskBlade.clickTaskLink(automatedTaskTemplateData.templateSummary);
            await activityTabPo.clickOnRefreshButton();
            expect(await taskViewPage.getTaskStatusValue()).toBe('Failed');
            expect(await taskViewPage.getStatusReason()).toBe('Error');
        });
    });

    describe('[DRDMV-10045]: Case Status when one automated task got failed and other 2 automated task got passed', () => {
        const randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplatePetramco, caseTemplateResponse, automatedTaskTemplateData1, automatedTaskTemplateData2, automatedTaskTemplateData3, caseResponse;
        beforeAll(async () => {
            //Create a case template with Proceed with Next task config
            await apiHelper.apiLogin('fritz');
            caseTemplatePetramco = {
                "templateName": 'caseTemplateName DRDMV-10045' + randomStr,
                "templateSummary": 'caseTemplateName DRDMV-10045' + randomStr,
                "templateStatus": "Active",
                "casePriority": "Low",
                "caseStatus": "New",
                "company": "Petramco",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "ownerBU": "Facilities Support",
                "ownerGroup": "Facilities",
                "taskFailureConfiguration": "Proceed With Next Task",
                "resolveCaseonLastTaskCompletion": "1"
            }
            caseTemplateResponse = await apiHelper.createCaseTemplate(caseTemplatePetramco);

            //Create 2 Automated task which will pass and 1 which will fail
            automatedTaskTemplateData1 = {
                "templateName": 'Automated task10045_1' + randomStr,
                "templateSummary": 'Automated task10045_1' + randomStr,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": 'Auto Proces1' + randomStr,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
            }
            await apiHelper.createAutomatedTaskTemplate(automatedTaskTemplateData1);
            await apiHelper.enableDisableProcess(`${automatedTaskTemplateData1.processBundle}:${automatedTaskTemplateData1.processName}`, false);

            automatedTaskTemplateData2 = {
                "templateName": 'Automated task10045_2' + randomStr,
                "templateSummary": 'Automated task10045_2' + randomStr,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": 'Auto Proces2' + randomStr,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
            }
            await apiHelper.createAutomatedTaskTemplate(automatedTaskTemplateData2);

            automatedTaskTemplateData3 = {
                "templateName": 'Automated task10045_3' + randomStr,
                "templateSummary": 'Automated task10045_3' + randomStr,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": 'Auto Proces3' + randomStr,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
            }
            await apiHelper.createAutomatedTaskTemplate(automatedTaskTemplateData3);

            //Create a case using the above Case Template
            let caseData = {
                "Requester": "qkatawazi",
                "Summary": `DRDMV-10045 Medium Priority ${randomStr}`,
                "Origin": "Agent",
                "Case Template ID": caseTemplateResponse.displayId
            }
            caseResponse = await apiHelper.createCase(caseData);

            //Create task with above created Automated templates
            const taskData1 = {
                "company": "Petramco",
                "requesterId": "qkatawazi",
                "templateName": automatedTaskTemplateData1.templateSummary
            }

            const taskData2 = {
                "company": "Petramco",
                "requesterId": "qkatawazi",
                "templateName": automatedTaskTemplateData2.templateSummary
            }

            const taskData3 = {
                "company": "Petramco",
                "requesterId": "qkatawazi",
                "templateName": automatedTaskTemplateData3.templateSummary
            }

            await apiHelper.addTaskToCase(taskData1, caseResponse.id);
            await apiHelper.addTaskToCase(taskData2, caseResponse.id);
            await apiHelper.addTaskToCase(taskData3, caseResponse.id);

            //Update the Case to In Progress
            await apiHelper.updateCaseStatus(caseResponse.id, 'InProgress');
        });

        it('[DRDMV-10045]: Case Status when one automated task got failed and other 2 automated task got passed', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(caseResponse.displayId);
            await viewCasePage.openTaskCard(1);
            expect(await manageTaskBlade.getTaskStatus(automatedTaskTemplateData1.templateSummary)).toBe('Failed');
            expect(await manageTaskBlade.getTaskStatus(automatedTaskTemplateData2.templateSummary)).toBe('Completed');
            expect(await manageTaskBlade.getTaskStatus(automatedTaskTemplateData3.templateSummary)).toBe('Completed');
            await utilityCommon.closeAllBlades();
            expect(await viewCasePage.getTextOfStatus()).toBe('Resolved');
        });
    });

    //asahitya
    describe('[DRDMV-9997]: Automated task= Failed, Case created with case template check Default Action', () => {
        const randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplatePetramco, caseTemplateResponse, automatedTaskTemplateData1, automatedTaskTemplateData2, caseResponse;
        beforeAll(async () => {
            //Create a case template with Do Not Proceed task config
            await apiHelper.apiLogin('fritz');
            caseTemplatePetramco = {
                "templateName": 'caseTemplateName DRDMV-9997' + randomStr,
                "templateSummary": 'caseTemplateName DRDMV-9997' + randomStr,
                "templateStatus": "Active",
                "casePriority": "Low",
                "caseStatus": "New",
                "company": "Petramco",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "ownerBU": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            caseTemplateResponse = await apiHelper.createCaseTemplate(caseTemplatePetramco);

            //Create 2 Automated tasks(1 with disabled process)
            automatedTaskTemplateData1 = {
                "templateName": 'Automated task9997_1' + randomStr,
                "templateSummary": 'Automated task9997_1' + randomStr,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": 'Auto Proces1' + randomStr,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
            }
            await apiHelper.createAutomatedTaskTemplate(automatedTaskTemplateData1);
            await apiHelper.enableDisableProcess(`${automatedTaskTemplateData1.processBundle}:${automatedTaskTemplateData1.processName}`, false);

            automatedTaskTemplateData2 = {
                "templateName": 'Automated task9997_2' + randomStr,
                "templateSummary": 'Automated task9997_2' + randomStr,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": 'Auto Proces2' + randomStr,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
            }
            await apiHelper.createAutomatedTaskTemplate(automatedTaskTemplateData2);

            //Create a case using the above Case Template
            let caseData = {
                "Requester": "qkatawazi",
                "Summary": `DRDMV-9997 Medium Priority ${randomStr}`,
                "Origin": "Agent",
                "Case Template ID": caseTemplateResponse.displayId
            }
            caseResponse = await apiHelper.createCase(caseData);

            //Create task with above created Automated templates
            const taskData1 = {
                "company": "Petramco",
                "requesterId": "qkatawazi",
                "templateName": automatedTaskTemplateData1.templateSummary
            }

            const taskData2 = {
                "company": "Petramco",
                "requesterId": "qkatawazi",
                "templateName": automatedTaskTemplateData2.templateSummary
            }

            await apiHelper.addTaskToCase(taskData1, caseResponse.id);
            await apiHelper.addTaskToCase(taskData2, caseResponse.id);
        });

        it('[DRDMV-9997]: Automated task= Failed, Case created with case template check Default Action', async () => {
            await apiHelper.updateCaseStatus(caseResponse.id, 'InProgress');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(caseResponse.displayId);
            await viewCasePage.openTaskCard(1);
            expect(await manageTaskBlade.getTaskStatus(automatedTaskTemplateData1.templateSummary)).toBe('Failed');
            expect(await manageTaskBlade.getTaskStatus(automatedTaskTemplateData2.templateSummary)).toBe('Staged');
            await manageTaskBlade.clickTaskLink(automatedTaskTemplateData1.templateSummary);
            expect(await taskViewPage.getTaskStatusValue()).toBe('Failed');
            expect(await taskViewPage.getStatusReason()).toBe('Error');
        });
    });

    //asahitya
    describe('[DRDMV-10413]: [Alerts] Notification alerts on Task Activation to Task Support Group', () => {
        const randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplatePetramco, caseTemplateResponse, automatedTaskTemplateData, caseResponse, taskDisplayId;
        beforeAll(async () => {
            await apiHelper.apiLogin('fritz');
            caseTemplatePetramco = {
                "templateName": 'caseTemplateName DRDMV-10413' + randomStr,
                "templateSummary": 'caseTemplateName DRDMV-10413' + randomStr,
                "templateStatus": "Active",
                "casePriority": "Low",
                "caseStatus": "New",
                "company": "Petramco",
                "ownerBU": "Facilities Support",
                "ownerGroup": "Facilities",
                "taskFailureConfiguration": "Proceed With Next Task"
            }
            caseTemplateResponse = await apiHelper.createCaseTemplate(caseTemplatePetramco);

            automatedTaskTemplateData = {
                "templateName": 'Automated task10413' + randomStr,
                "templateSummary": 'Automated task10413' + randomStr,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": 'Auto Proces' + randomStr,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
            }
            await apiHelper.createAutomatedTaskTemplate(automatedTaskTemplateData);

            let caseData = {
                "Requester": "qkatawazi",
                "Summary": `DRDMV-10413 Summary ${randomStr}`,
                "Origin": "Agent",
                "Case Template ID": caseTemplateResponse.displayId,
                "Business Unit": "Facilities Support",
                "Support Group": "Facilities",
                "Assignee": "Franz",
            }
            caseResponse = await apiHelper.createCase(caseData);

            const taskData = {
                "company": "Petramco",
                "requesterId": "qkatawazi",
                "templateName": automatedTaskTemplateData.templateSummary
            }
            let taskResponse = await apiHelper.addTaskToCase(taskData, caseResponse.id);

            await apiHelper.apiLogin('tadmin');
            taskDisplayId = (await apiHelper.getCreatedTaskIds(taskResponse)).displayId;
        });

        it('[DRDMV-10413]: [Alerts] Notification alerts on Task Activation to Task Support Group', async () => {
            await apiHelper.apiLogin('fritz');
            await apiHelper.updateCaseStatus(caseResponse.id, 'InProgress');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(caseResponse.displayId);
            await viewCasePage.openTaskCard(1);
            expect(await manageTaskBlade.getTaskStatus(automatedTaskTemplateData.templateSummary)).toBe('Completed');
            await utilityCommon.closeAllBlades();

            await navigationPage.signOut();
            await loginPage.login('franz');
            await notificationPo.clickOnNotificationIcon();
            expect(await notificationPo.isAlertPresent(`Fritz Schulz changed status of ${taskDisplayId} to Completed`)).toBeTruthy('Notification is not present');
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
        });
    });

});