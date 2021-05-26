import { browser } from "protractor";
import coreApi from '../../api/api.core.util';
import apiHelper from '../../api/api.helper';
import editCasePage from '../../pageobject/case/edit-case.po';
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import viewCasePage from '../../pageobject/case/view-case.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import updateStatusBlade from '../../pageobject/common/update.status.blade.po';
import activityPage from '../../pageobject/social/activity-tab.po';
import manageTaskBlade from "../../pageobject/task/manage-task-blade.po";
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

describe('Conditional Task Life Cycle', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('fritz');
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //asahitya
    describe('[4503]: [Task] Case created with CaseTemplate (with no TaskFlow) and without CaseTemplate', () => {
        const randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateDoNotProceed, caseTemplateProceedWithNextTask, manualTaskTemplateData, externalTaskTemplateData, responseCaseDNP, responseCasePWNT, responseCaseNT, adhocTaskData, manualTaskDNPResponse, manualTaskNTResponse, manualTaskPWNTResponse, externalTaskDNPResponse, externalTaskNTResponse, externalTaskPWNTResponse, automatedTaskDNPResponse, automatedTaskNTResponse, automatedTaskPWNTResponse, manualTaskDNPId, manualTaskNTId, manualTaskPWNTId, externalTaskDNPId, externalTaskNTId, externalTaskPWNTId, automatedTaskTemplateData, automatedTaskDNPId, automatedTaskNTId, automatedTaskPWNTId;
        let completedStr: string = 'Completed';
        let assignedStr: string = 'Assigned';
        beforeAll(async () => {
            await apiHelper.apiLogin('fritz');
            //Create Case Templates
            caseTemplateDoNotProceed = {
                "templateName": 'caseTemplateNameDNP' + randomStr,
                "templateSummary": 'caseTemplateNameDNP' + randomStr,
                "templateStatus": "Active",
                "casePriority": "Low",
                "caseStatus": "New",
                "company": "Petramco",
                "lineOfBusiness": "Facilities",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "ownerBU": "Facilities Support",
                "ownerGroup": "Facilities",
                "taskFailureConfiguration": "Do Not Proceed"
            }
            let caseTemplateDNPResponse = await apiHelper.createCaseTemplate(caseTemplateDoNotProceed);
            let caseTemplateDNPDisplayId = caseTemplateDNPResponse.displayId;

            caseTemplateProceedWithNextTask = {
                "templateName": 'caseTemplateNamePWNT' + randomStr,
                "templateSummary": 'caseTemplateNamePWNT' + randomStr,
                "templateStatus": "Active",
                "casePriority": "Low",
                "caseStatus": "New",
                "company": "Petramco",
                "lineOfBusiness": "Facilities",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "ownerBU": "Facilities Support",
                "ownerGroup": "Facilities",
                "taskFailureConfiguration": "Proceed With Next Task"
            }
            let caseTemplatePWNTResponse = await apiHelper.createCaseTemplate(caseTemplateProceedWithNextTask);
            let caseTemplatePWNTDisplayId = caseTemplatePWNTResponse.displayId;

            //Create Task Templates
            manualTaskTemplateData = {
                "templateName": 'Manual task 14996' + randomStr,
                "templateSummary": 'Manual task 14996' + randomStr,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "lineOfBusiness": "Facilities",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
            }
            await apiHelper.createManualTaskTemplate(manualTaskTemplateData);

            externalTaskTemplateData = {
                "templateName": 'External task 14996' + randomStr,
                "templateSummary": 'External task 14996' + randomStr,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "lineOfBusiness": "Facilities",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
            }
            await apiHelper.createExternalTaskTemplate(externalTaskTemplateData);

            automatedTaskTemplateData = {
                "templateName": 'Automated task 14996' + randomStr,
                "templateSummary": 'Automated task 14996' + randomStr,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": 'Auto Proces' + randomStr,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "lineOfBusiness": "Facilities",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
            }
            await apiHelper.createAutomatedTaskTemplate(automatedTaskTemplateData);
            await apiHelper.enableDisableProcess(`${automatedTaskTemplateData.processBundle}:${automatedTaskTemplateData.processName}`, false);

            //Create Cases
            let caseDataDNP = {
                "Requester": "qkatawazi",
                "Summary": `4503 Summary DNP ${randomStr}`,
                "Line of Business": "Facilities",
                "Origin": "Agent",
                "Case Template ID": caseTemplateDNPDisplayId
            }
            responseCaseDNP = await apiHelper.createCase(caseDataDNP);

            let caseDataPWNT = {
                "Requester": "qkatawazi",
                "Summary": `4503 Summary PWNT ${randomStr}`,
                "Line of Business": "Facilities",
                "Origin": "Agent",
                "Case Template ID": caseTemplatePWNTDisplayId
            }
            responseCasePWNT = await apiHelper.createCase(caseDataPWNT);

            let caseDataWithoutTemplate = {
                "Requester": "qkatawazi",
                "Summary": `4503 Summary NT ${randomStr}`,
                "Assigned Company": "Petramco",
                "Line of Business": "Facilities",
                "Business Unit": "Facilities Support",
                "Support Group": "Facilities",
                "Assignee": "Fritz"
            }
            responseCaseNT = await apiHelper.createCase(caseDataWithoutTemplate);

            //Add Adhoc Task in all Cases
            adhocTaskData = {
                "taskName": `4503 ${randomStr}`,
                "company": "Petramco",
                "lineOfBusiness": "Facilities",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz"
            }
            let adhocTaskDNPResponse = await apiHelper.createAdhocTask(responseCaseDNP.id, adhocTaskData);
            let adhocTaskNTResponse = await apiHelper.createAdhocTask(responseCaseNT.id, adhocTaskData);
            let adhocTaskPWNTResponse = await apiHelper.createAdhocTask(responseCasePWNT.id, adhocTaskData);

            //Add Manual Task in all cases
            let manualTaskData = {
                "company": "Petramco",
                "requesterId": "qkatawazi",
                "templateName": manualTaskTemplateData.templateName
            }
            manualTaskDNPResponse = await apiHelper.addTaskToCase(manualTaskData, responseCaseDNP.id);
            manualTaskNTResponse = await apiHelper.addTaskToCase(manualTaskData, responseCaseNT.id);
            manualTaskPWNTResponse = await apiHelper.addTaskToCase(manualTaskData, responseCasePWNT.id);

            //Add Automated Task(Will Fail)
            let automatedTaskData = {
                "company": "Petramco",
                "requesterId": "qkatawazi",
                "templateName": automatedTaskTemplateData.templateName
            }
            automatedTaskDNPResponse = await apiHelper.addTaskToCase(automatedTaskData, responseCaseDNP.id);
            automatedTaskNTResponse = await apiHelper.addTaskToCase(automatedTaskData, responseCaseNT.id);
            automatedTaskPWNTResponse = await apiHelper.addTaskToCase(automatedTaskData, responseCasePWNT.id);

            //Add External Task in all cases
            let externalTaskData = {
                "company": "Petramco",
                "requesterId": "qkatawazi",
                "templateName": externalTaskTemplateData.templateName
            }
            externalTaskDNPResponse = await apiHelper.addTaskToCase(externalTaskData, responseCaseDNP.id);
            externalTaskNTResponse = await apiHelper.addTaskToCase(externalTaskData, responseCaseNT.id);
            externalTaskPWNTResponse = await apiHelper.addTaskToCase(externalTaskData, responseCasePWNT.id);

            //Get Id of all the tasks created from task template
            await apiHelper.apiLogin('tadmin');
            manualTaskDNPId = (await apiHelper.getCreatedTaskIds(manualTaskDNPResponse)).id;
            automatedTaskDNPId = (await apiHelper.getCreatedTaskIds(automatedTaskDNPResponse)).id;
            externalTaskDNPId = (await apiHelper.getCreatedTaskIds(externalTaskDNPResponse)).id;

            manualTaskNTId = (await apiHelper.getCreatedTaskIds(manualTaskNTResponse)).id;
            automatedTaskNTId = (await apiHelper.getCreatedTaskIds(automatedTaskNTResponse)).id;
            externalTaskNTId = (await apiHelper.getCreatedTaskIds(externalTaskNTResponse)).id;

            manualTaskPWNTId = (await apiHelper.getCreatedTaskIds(manualTaskPWNTResponse)).id;
            automatedTaskPWNTId = (await apiHelper.getCreatedTaskIds(automatedTaskPWNTResponse)).id;
            externalTaskPWNTId = (await apiHelper.getCreatedTaskIds(externalTaskPWNTResponse)).id;

            //Update the adhoc task status of all Cases to Completed
            await apiHelper.apiLogin('fritz');
            await apiHelper.updateCaseStatus(responseCaseDNP.id, 'InProgress');
            await apiHelper.updateTaskStatus(adhocTaskDNPResponse.id, 'Completed', 'Successful');
            await apiHelper.updateCaseStatus(responseCaseNT.id, 'InProgress');
            await apiHelper.updateTaskStatus(adhocTaskNTResponse.id, 'Completed', 'Successful');
            await apiHelper.updateCaseStatus(responseCasePWNT.id, 'InProgress');
            await apiHelper.updateTaskStatus(adhocTaskPWNTResponse.id, 'Completed', 'Successful');
        });
        it('[4503]: [Task] Case created with CaseTemplate (with no TaskFlow) and without CaseTemplate', async () => {
            //Update Adhoc task to Completed and check manual task status(CASE 1)
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(responseCaseDNP.displayId);
            await viewCasePage.openTaskCard(1);
            expect(await manageTaskBlade.getTaskStatus(adhocTaskData.taskName)).toContain(completedStr);
            expect(await manageTaskBlade.getTaskStatus(manualTaskTemplateData.templateName)).toContain(assignedStr);
            await manageTaskBlade.clickCloseButton();

            //Update Manual task to completed and verify Automated Task status(CASE 1)
            await apiHelper.updateTaskStatus(manualTaskDNPId, 'Completed', 'Successful');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(responseCaseDNP.displayId);
            await viewCasePage.openTaskCard(1);
            expect(await manageTaskBlade.getTaskStatus(manualTaskTemplateData.templateName)).toContain(completedStr);
            expect(await manageTaskBlade.getTaskStatus(automatedTaskTemplateData.templateName)).toContain('Failed');
            expect(await manageTaskBlade.getTaskStatus(externalTaskTemplateData.templateName)).toContain('Staged');
            await manageTaskBlade.clickCloseButton();
        });
        it('[4503]: [Task] Case created with CaseTemplate (with no TaskFlow) and without CaseTemplate', async () => {
            //Update Adhoc task to Completed and check manual task status(CASE 2)
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(responseCaseNT.displayId);
            await viewCasePage.clickOnRefreshTaskList();
            await viewCasePage.openTaskCard(1);
            expect(await manageTaskBlade.getTaskStatus(adhocTaskData.taskName)).toContain(completedStr);
            expect(await manageTaskBlade.getTaskStatus(manualTaskTemplateData.templateName)).toContain(assignedStr);
            await manageTaskBlade.clickCloseButton();

            //Update Manual task to completed and verify Automated Task status(CASE 2)
            await apiHelper.updateTaskStatus(manualTaskNTId, 'Completed', 'Successful');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(responseCaseNT.displayId);
            await viewCasePage.clickOnRefreshTaskList();
            await viewCasePage.openTaskCard(1);
            expect(await manageTaskBlade.getTaskStatus(manualTaskTemplateData.templateName)).toContain(completedStr);
            expect(await manageTaskBlade.getTaskStatus(automatedTaskTemplateData.templateName)).toContain('Failed');
            expect(await manageTaskBlade.getTaskStatus(externalTaskTemplateData.templateName)).toContain('Staged');
            await manageTaskBlade.clickCloseButton();

            //Verify Case 2 can be Resolved
            await updateStatusBlade.changeStatus('Resolved');
            await updateStatusBlade.selectStatusReason('Auto Resolved');
            await updateStatusBlade.clickSaveStatus();
            expect(await utilityCommon.isPopUpMessagePresent('The case contains active tasks. Please close all the tasks and resolve the case.')).toBeTruthy();
            await updateStatusBlade.clickCancelButton();
        });
        it('[4503]: [Task] Case created with CaseTemplate (with no TaskFlow) and without CaseTemplate', async () => {
            //Update Adhoc task to Completed and check manual task status(CASE 3)
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(responseCasePWNT.displayId);
            await viewCasePage.openTaskCard(1);
            expect(await manageTaskBlade.getTaskStatus(adhocTaskData.taskName)).toContain(completedStr);
            expect(await manageTaskBlade.getTaskStatus(manualTaskTemplateData.templateName)).toContain(assignedStr);
            await manageTaskBlade.clickCloseButton();

            //Update Manual task to completed and verify Automated Task status(CASE 3)
            await apiHelper.updateTaskStatus(manualTaskPWNTId, 'Completed', 'Successful');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(responseCasePWNT.displayId);
            await viewCasePage.openTaskCard(1);
            expect(await manageTaskBlade.getTaskStatus(manualTaskTemplateData.templateName)).toContain(completedStr);
            expect(await manageTaskBlade.getTaskStatus(automatedTaskTemplateData.templateName)).toContain('Failed');
            expect(await manageTaskBlade.getTaskStatus(externalTaskTemplateData.templateName)).toContain('Assigned');
            await manageTaskBlade.clickCloseButton();

            //Update External task to completed and verify External Task status(CASE 3)
            await apiHelper.updateTaskStatus(externalTaskPWNTId, 'Completed', 'Successful');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(responseCasePWNT.displayId);
            await viewCasePage.openTaskCard(1);
            expect(await manageTaskBlade.getTaskStatus(externalTaskTemplateData.templateName)).toContain(completedStr);
            await manageTaskBlade.clickCloseButton();

            //Verify Case 2 can be Resolved
            await updateStatusBlade.changeStatus('Resolved');
            await updateStatusBlade.selectStatusReason('Auto Resolved');
            await updateStatusBlade.clickSaveStatus('Resolved');
            expect(await viewCasePage.getTextOfStatus()).toBe('Resolved');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
        });
    });

    //asahitya
    describe('[4499]: [Task] - Adhoc task in Case with multiple Series and parallel tasks with condition', () => {
        const randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplatePetramco, newCaseTemplate, manualTaskTemplateData, externalTaskTemplateData, automatedTaskTemplateData, caseResponseMeduimPriority, caseResponseCriticalPriority;
        beforeAll(async () => {
            await apiHelper.apiLogin('fritz');
            caseTemplatePetramco = {
                "templateName": 'caseTemplateName 4499' + randomStr,
                "templateSummary": 'caseTemplateName 4499' + randomStr,
                "templateStatus": "Active",
                "categoryTier1": "Purchasing Card",
                "categoryTier2": "Policies",
                "categoryTier3": "Card Issuance",
                "casePriority": "Low",
                "caseStatus": "New",
                "company": "Petramco",
                "lineOfBusiness": "Facilities",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "ownerBU": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            newCaseTemplate = await apiHelper.createCaseTemplate(caseTemplatePetramco);
            let caseTemplateDisplayId = await newCaseTemplate.displayId;
            manualTaskTemplateData = {
                "templateName": 'Manual task15000' + randomStr,
                "templateSummary": 'Manual task15000' + randomStr,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "lineOfBusiness": "Facilities",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
            }
            let manualTaskTemplate = await apiHelper.createManualTaskTemplate(manualTaskTemplateData);

            externalTaskTemplateData = {
                "templateName": 'External task15000' + randomStr,
                "templateSummary": 'External task15000' + randomStr,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "lineOfBusiness": "Facilities",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
            }
            let externalTaskTemplate = await apiHelper.createExternalTaskTemplate(externalTaskTemplateData);

            automatedTaskTemplateData = {
                "templateName": 'Automated task15000' + randomStr,
                "templateSummary": 'Automated task15000' + randomStr,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": 'Auto Proces' + randomStr,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "lineOfBusiness": "Facilities",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
            }
            let automatedTaskTemplate = await apiHelper.createAutomatedTaskTemplate(automatedTaskTemplateData);
            await apiHelper.associateCaseTemplateWithThreeTaskTemplate(newCaseTemplate.displayId, automatedTaskTemplate.displayId, manualTaskTemplate.displayId, externalTaskTemplate.displayId, 'DRDMV_15000');

            let caseDataMediumPriority = {
                "Requester": "qkatawazi",
                "Summary": `4499 Medium Priority ${randomStr}`,
                "Line of Business": "Facilities",
                "Origin": "Agent",
                "Case Template ID": caseTemplateDisplayId,
                "Priority": "3000"
            }
            caseResponseMeduimPriority = await apiHelper.createCase(caseDataMediumPriority);

            let caseDataCriticalPriority = {
                "Requester": "qkatawazi",
                "Summary": `4499 Medium Priority ${randomStr}`,
                "Line of Business": "Facilities",
                "Origin": "Agent",
                "Case Template ID": caseTemplateDisplayId,
                "Priority": "1000"
            }
            caseResponseCriticalPriority = await apiHelper.createCase(caseDataCriticalPriority);
            await apiHelper.updateCaseStatus(caseResponseCriticalPriority.id, 'InProgress');
        });

        it('[4499]: [Task] - Adhoc task in Case with multiple Series and parallel tasks with condition', async () => {
            //Verify Case 1 with Automated task
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseResponseMeduimPriority.displayId);
            expect(await viewCasePage.getTaskCardCount()).toEqual(0);
            let adhocTaskData = {
                "taskName": `4499 ${randomStr}`,
                "company": "Petramco",
                "lineOfBusiness": "Facilities",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz"
            }
            let adhocTaskResponse = await apiHelper.createAdhocTask(caseResponseMeduimPriority.id, adhocTaskData);

            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseResponseMeduimPriority.displayId);
            expect(await viewCasePage.isAllTaskUnderStatusTitleMatches('Upcoming Tasks', [adhocTaskData.taskName])).toBeTruthy();
            await apiHelper.updateCaseStatus(caseResponseMeduimPriority.id, 'InProgress');

            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseResponseMeduimPriority.displayId);
            expect(await viewCasePage.isTaskCountPresentOnAnyTaskCard()).toBeFalsy();
            expect(await viewCasePage.isAllTaskUnderStatusTitleMatches('In Progress Tasks', [adhocTaskData.taskName])).toBeTruthy();
            expect(await viewCasePage.isAllTaskUnderStatusTitleMatches('Completed Tasks', [automatedTaskTemplateData.templateSummary])).toBeTruthy();
            expect(await viewCasePage.getTaskCardCount()).toEqual(2);
            await viewCasePage.clickOnTaskViewTypeBtn('Task Flow');
            expect(await viewCasePage.isTaskBoxColorCodeMatches(automatedTaskTemplateData.templateSummary, '#999999')).toBeTruthy('Color Code is not matching1');
            await apiHelper.updateTaskStatus(adhocTaskResponse.id, 'Completed', 'Successful');
            await updateStatusBlade.changeStatus('Resolved');
            await updateStatusBlade.selectStatusReason('Auto Resolved');
            await updateStatusBlade.clickSaveStatus('Resolved');
            expect(await viewCasePage.getTextOfStatus()).toBe('Resolved');

            // //Verify Case 2 with Automated task
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseResponseCriticalPriority.displayId);
            await viewCasePage.openTaskCard(1);
            expect(await manageTaskBlade.getTaskStatus(manualTaskTemplateData.templateSummary)).toContain('Assigned');
            await manageTaskBlade.clickCloseButton();
            await viewCasePage.openTaskCard(2);
            expect(await manageTaskBlade.getTaskStatus(externalTaskTemplateData.templateSummary)).toContain('Assigned');
            await manageTaskBlade.clickCloseButton();
            expect(await viewCasePage.isTaskCountPresentOnAnyTaskCard()).toBeFalsy();
            expect(await viewCasePage.isTaskCardPresent(manualTaskTemplateData.templateSummary)).toBeTruthy('Template Name not present');
            expect(await viewCasePage.isTaskCardPresent(externalTaskTemplateData.templateSummary)).toBeTruthy('Template Name not present');
            expect(await viewCasePage.getTaskCardCount()).toEqual(2);
        });

        it('[4499]: [Task] - Adhoc task in Case with multiple Series and parallel tasks with condition', async () => {
            //Get taskguid of External and Manual Task
            await apiHelper.apiLogin('fritz');
            let manualTaskGuid = await coreApi.getTaskGuid(manualTaskTemplateData.templateSummary);
            let externalTaskGuid = await coreApi.getTaskGuid(externalTaskTemplateData.templateSummary);

            await apiHelper.apiLogin('fritz');
            await apiHelper.updateTaskStatus(manualTaskGuid, 'Completed', 'Successful');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseResponseCriticalPriority.displayId);
            await viewCasePage.openTaskCard(2);
            expect(await manageTaskBlade.getTaskStatus(manualTaskTemplateData.templateSummary)).toContain('Completed');
            await manageTaskBlade.clickCloseButton();
            await viewCasePage.openTaskCard(1);
            expect(await manageTaskBlade.getTaskStatus(externalTaskTemplateData.templateSummary)).toContain('Assigned');
            await manageTaskBlade.clickCloseButton();

            expect(await viewCasePage.isAllTaskUnderStatusTitleMatches('In Progress Tasks', [externalTaskTemplateData.templateSummary])).toBeTruthy('External task is missing from In Progress Task section');
            expect(await viewCasePage.isAllTaskUnderStatusTitleMatches('Completed Tasks', [manualTaskTemplateData.templateSummary])).toBeTruthy('Manual task is missing from Completed Task section');

            await viewCasePage.clickOnTaskViewTypeBtn('Task Flow');
            expect(await viewCasePage.isTaskBoxColorCodeMatches(manualTaskTemplateData.templateSummary, '#999999')).toBeTruthy('Color Code is not matching2');
            expect(await viewCasePage.isTaskBoxColorCodeMatches(externalTaskTemplateData.templateSummary, '#89c341')).toBeTruthy('Color Code is not matching3');
            expect(await viewCasePage.isTaskBoxColorCodeMatches(automatedTaskTemplateData.templateSummary, '#000000')).toBeTruthy('Color Code is not matching3');

            await apiHelper.updateTaskStatus(externalTaskGuid, 'Completed', 'Successful');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseResponseCriticalPriority.displayId);
            expect(await viewCasePage.isAllTaskUnderStatusTitleMatches('Completed Tasks', [manualTaskTemplateData.templateSummary, externalTaskTemplateData.templateSummary])).toBeTruthy();
            await viewCasePage.clickOnTaskViewTypeBtn('Task Flow');
            expect(await viewCasePage.isTaskBoxColorCodeMatches(manualTaskTemplateData.templateSummary, '#999999')).toBeTruthy('Color Code is not matching4');
            expect(await viewCasePage.isTaskBoxColorCodeMatches(externalTaskTemplateData.templateSummary, '#999999')).toBeTruthy('Color Code is not matching5');

            await updateStatusBlade.changeStatus('Resolved');
            await updateStatusBlade.selectStatusReason('Auto Resolved');
            await updateStatusBlade.clickSaveStatus('Resolved');
            expect(await viewCasePage.getTextOfStatus()).toBe('Resolved');
        });

        it('[4499]: Validate the status of Task Activities', async () => {
            let taskDisplayIds = await viewCasePage.getAllTasksDisplayId();
            await navigationPage.gotoPersonProfile();
            await activityPage.applyActivityFilter('Status Change');
            await activityPage.clickOnRefreshButton();
            expect(await activityPage.isTextPresentInActivityLog('Completed')).toBeTruthy('Completed is not present in Activity Log');
            expect(await activityPage.isTextPresentInActivityLog('Successful')).toBeTruthy('Successful is not present in Activity Log');
            expect(await activityPage.isTextPresentInActivityLog(taskDisplayIds[0])).toBeTruthy(`Task1:${taskDisplayIds[0]} is not present in Activity Log`);
            expect(await activityPage.isTextPresentInActivityLog(taskDisplayIds[1])).toBeTruthy(`Task2:${taskDisplayIds[1]} is not present in Activity Log`);
        });
    });

    //asahitya
    describe('[4498]: [Task] Change Case Template in a Case which already have some tasks', () => {
        const randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateData1, caseTemplateData2, manualTaskTemplateData1, externalTaskTemplateData1, automatedTaskTemplateData1, manualTaskTemplateData2, externalTaskTemplateData2, caseTemplateResponse1, caseTemplateResponse2, caseResponse1, caseResponse2;
        beforeAll(async () => {
            await apiHelper.apiLogin('fritz');
            //Creating Case Template 1
            caseTemplateData1 = {
                "templateName": 'CT_4498_1' + randomStr,
                "templateSummary": 'CT_4498_1' + randomStr,
                "templateStatus": "Active",
                "casePriority": "Low",
                "caseStatus": "New",
                "company": "Petramco",
                "lineOfBusiness": "Facilities",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "ownerBU": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            caseTemplateResponse1 = await apiHelper.createCaseTemplate(caseTemplateData1);

            //Creating Case Template 2
            caseTemplateData2 = {
                "templateName": 'CT_4498_2' + randomStr,
                "templateSummary": 'CT_4498_2' + randomStr,
                "templateStatus": "Active",
                "casePriority": "Low",
                "caseStatus": "New",
                "company": "Petramco",
                "lineOfBusiness": "Facilities",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "ownerBU": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            caseTemplateResponse2 = await apiHelper.createCaseTemplate(caseTemplateData2);

            //Creating the task templates for Case Template 1 and associate with Tempkate 1
            manualTaskTemplateData1 = {
                "templateName": 'MTT_4498_1' + randomStr,
                "templateSummary": 'MTT_4498_1' + randomStr,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "lineOfBusiness": "Facilities",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
            }
            let manualTasktemplateResponse1 = await apiHelper.createManualTaskTemplate(manualTaskTemplateData1);

            externalTaskTemplateData1 = {
                "templateName": 'ETT_4498_1' + randomStr,
                "templateSummary": 'ETT_4498_1' + randomStr,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "lineOfBusiness": "Facilities",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
            }
            let externalTasktemplateResponse1 = await apiHelper.createExternalTaskTemplate(externalTaskTemplateData1);

            automatedTaskTemplateData1 = {
                "templateName": 'ATT_4498_1' + randomStr,
                "templateSummary": 'ATT_4498_1' + randomStr,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": 'Auto Proces' + randomStr,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "lineOfBusiness": "Facilities",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
            }
            let automatedTasktemplateResponse1 = await apiHelper.createAutomatedTaskTemplate(automatedTaskTemplateData1);
            await apiHelper.associateCaseTemplateWithThreeTaskTemplate(caseTemplateResponse1.displayId, manualTasktemplateResponse1.displayId, externalTasktemplateResponse1.displayId, automatedTasktemplateResponse1.displayId);

            //Creating the task templates for Case Template 2 and associate with Tempkate 2
            manualTaskTemplateData2 = {
                "templateName": 'MTT_4498_2' + randomStr,
                "templateSummary": 'MTT_4498_2' + randomStr,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "lineOfBusiness": "Facilities",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
            }
            let manualTasktemplateResponse2 = await apiHelper.createManualTaskTemplate(manualTaskTemplateData2);

            externalTaskTemplateData2 = {
                "templateName": 'ETT_4498_2' + randomStr,
                "templateSummary": 'ETT_4498_2' + randomStr,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "lineOfBusiness": "Facilities",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
            }
            let externalTasktemplateResponse2 = await apiHelper.createExternalTaskTemplate(externalTaskTemplateData2);
            await apiHelper.associateCaseTemplateWithTwoTaskTemplate(caseTemplateResponse2.displayId, manualTasktemplateResponse2.displayId, externalTasktemplateResponse2.displayId, 'parallel');

            //Create Case 1 without template
            let caseData1 = {
                "Description": "Simple test case desc",
                "Requester": "qfeng",
                "Summary": "Simple test case summary",
                "Line of Business": "Facilities",
                "Assigned Company": "Petramco",
                "Business Unit": "Facilities Support",
                "Support Group": "Facilities",
                "Assignee": "Fritz"
            }
            caseResponse1 = await apiHelper.createCase(caseData1);

            //Adding 2 Adhoc tasks to Case 1
            let adhocTaskData1 = {
                "taskName": `4498_1 ${randomStr}`,
                "company": "Petramco",
                "lineOfBusiness": "Facilities",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz"
            }

            let adhocTaskData2 = {
                "taskName": `4498_2 ${randomStr}`,
                "company": "Petramco",
                "lineOfBusiness": "Facilities",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz"
            }
            await apiHelper.createAdhocTask(caseResponse1.id, adhocTaskData1);
            await apiHelper.createAdhocTask(caseResponse1.id, adhocTaskData2);
        });

        it('[4498]: [Task] Change Case Template in a Case which already have some tasks', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseResponse1.displayId);
            await viewCasePage.openTaskCard(1);
            expect(await manageTaskBlade.getTaskStatus(`4498_1 ${randomStr}`)).toContain('Staged');
            expect(await manageTaskBlade.getTaskStatus(`4498_2 ${randomStr}`)).toContain('Staged');
            await manageTaskBlade.clickCloseButton();

            await viewCasePage.clickEditCaseButton();
            await editCasePage.clickOnSelectCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateData1.templateSummary);
            await editCasePage.clickSaveCase();
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseResponse1.displayId);
            expect(await viewCasePage.isAllTaskUnderStatusTitleMatches('Upcoming Tasks', [manualTaskTemplateData1.templateSummary, externalTaskTemplateData1.templateSummary, automatedTaskTemplateData1.templateSummary])).toBeTruthy();

            await apiHelper.updateCaseStatus(caseResponse1.id, 'InProgress');
            await apiHelper.apiLogin('fritz');
            let manualTaskGuid = await coreApi.getTaskGuid(manualTaskTemplateData1.templateSummary);
            let externalTaskGuid = await coreApi.getTaskGuid(externalTaskTemplateData1.templateSummary);

            await apiHelper.apiLogin('fritz');
            await apiHelper.updateTaskStatus(manualTaskGuid, 'Completed', 'Successful');
            await browser.sleep(1000); //Need time to update the Task status
            await apiHelper.updateTaskStatus(externalTaskGuid, 'Completed', 'Successful');

            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseResponse1.displayId);
            expect(await viewCasePage.isAllTaskUnderStatusTitleMatches('Completed Tasks', [manualTaskTemplateData1.templateSummary, externalTaskTemplateData1.templateSummary, automatedTaskTemplateData1.templateSummary])).toBeTruthy();

            await updateStatusBlade.changeStatus('Resolved');
            await updateStatusBlade.selectStatusReason('Auto Resolved');
            await updateStatusBlade.clickSaveStatus('Resolved');
            expect(await viewCasePage.getTextOfStatus()).toBe('Resolved');
        });

        it('[4498]: [Task] Change Case Template in a Case which already have some tasks', async () => {
            //Create Case 2 with case template 1
            let caseData2 = {
                "Requester": "qkatawazi",
                "Summary": `4499 Medium Priority ${randomStr}`,
                "Line of Business": "Facilities",
                "Origin": "Agent",
                "Case Template ID": caseTemplateResponse1.displayId
            }
            caseResponse2 = await apiHelper.createCase(caseData2);
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseResponse2.displayId);
            expect(await viewCasePage.isAllTaskUnderStatusTitleMatches('Upcoming Tasks', [manualTaskTemplateData1.templateSummary, externalTaskTemplateData1.templateSummary, automatedTaskTemplateData1.templateSummary])).toBeTruthy();
            await viewCasePage.clickEditCaseButton();
            await editCasePage.clickOnChangeCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateData2.templateSummary);
            await editCasePage.clickSaveCase();
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseResponse2.displayId);

            expect(await viewCasePage.isAllTaskUnderStatusTitleMatches('Upcoming Tasks', [manualTaskTemplateData2.templateSummary, externalTaskTemplateData2.templateSummary])).toBeTruthy();
            await apiHelper.updateCaseStatus(caseResponse2.id, 'InProgress');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseResponse2.displayId);

            expect(await viewCasePage.isAllTaskUnderStatusTitleMatches('In Progress Tasks', [manualTaskTemplateData2.templateSummary, externalTaskTemplateData2.templateSummary])).toBeTruthy();

            await apiHelper.apiLogin('fritz');
            let manualTaskGuid = await coreApi.getTaskGuid(manualTaskTemplateData2.templateSummary);
            let externalTaskGuid = await coreApi.getTaskGuid(externalTaskTemplateData2.templateSummary);

            await apiHelper.apiLogin('fritz');
            await apiHelper.updateTaskStatus(manualTaskGuid, 'Completed', 'Successful');
            await apiHelper.updateTaskStatus(externalTaskGuid, 'Completed', 'Successful');

            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseResponse2.displayId);
            expect(await viewCasePage.isAllTaskUnderStatusTitleMatches('Completed Tasks', [manualTaskTemplateData2.templateSummary, externalTaskTemplateData2.templateSummary])).toBeTruthy();

            await updateStatusBlade.changeStatus('Resolved');
            await updateStatusBlade.selectStatusReason('Auto Resolved');
            await updateStatusBlade.clickSaveStatus('Resolved');
            expect(await viewCasePage.getTextOfStatus()).toBe('Resolved');
        });
    });
});