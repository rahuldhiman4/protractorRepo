
import { $, browser } from "protractor";
import apiHelper from '../../api/api.helper';
import caseConsole from '../../pageobject/case/case-console.po';
import previewCasePo from '../../pageobject/case/case-preview.po';
import createCasePage from '../../pageobject/case/create-case.po';
import editCasePage from '../../pageobject/case/edit-case.po';
import quickCasePo from '../../pageobject/case/quick-case.po';
import viewCasePage from "../../pageobject/case/view-case.po";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import updateStatusBladePo from '../../pageobject/common/update.status.blade.po';
import manageTask from "../../pageobject/task/manage-task-blade.po";
import viewTask from "../../pageobject/task/view-task.po";
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';
import changeAssignmentPo from '../../pageobject/common/change-assignment.po';

describe('Case Status Change', () => {
    let statusNew: string = "New";
    let statusInProgress: string = "In Progress";
    let statusAssigned: string = "Assigned";
    let statusPending: string = "Pending";
    let statusCanceled: string = "Canceled";
    let statusResolved: string = "Resolved";
    let statusClosed: string = "Closed";
    const caseModule = 'Case';

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    // passed
    describe('[5981]: [Case Status] Case status change from New', async () => {
        let priority: string = "Medium";
        let summary: string = "Test case for 5981";
        let newCase1, newCase2, newCase3;
        let caseId1: string, caseId2: string, caseId3: string;
        beforeAll(async () => {
            let caseData = {
                "Requester": "qtao",
                "Summary": "Test case for 5981",
            }
            await apiHelper.apiLogin('qkatawazi');
            newCase1 = await apiHelper.createCase(caseData);
            caseId1 = newCase1.displayId;
            newCase2 = await apiHelper.createCase(caseData);
            caseId2 = newCase2.displayId;
            newCase3 = await apiHelper.createCase(caseData);
            caseId3 = newCase3.displayId;
        });
        it('[5981]: Checking change case template button for In Progress', async () => {
            await caseConsole.searchAndOpenCase(caseId1);
            await viewCasePage.clickEditCaseButton();
            expect(await viewCasePage.isEditLinkDisplay()).toBeFalsy('edit link should not display');
            await editCasePage.clickOnCancelCaseButton();
            await viewCasePage.clickOnStatus();
            let statuses: string[] = ["New", "Assigned", "In Progress", "Pending", "Canceled"];
            expect(await updateStatusBladePo.allStatusValuesPresent(statuses)).toBeTruthy('Status does not match On view case');
            await updateStatusBladePo.clickCancelButton();
            expect(await viewCasePage.getTextOfStatus()).toBe(statusNew);
            await navigationPage.gotoCaseConsole();
            await caseConsole.searchCase(caseId1);
            expect(await caseConsole.isCaseIdPresent(caseId1)).toBeTruthy("CaseID not matching");
            expect(await caseConsole.isCasePriorityPresent(priority)).toBeTruthy("Priority not matching");
            expect(await caseConsole.isCaseStatusPresent(statusNew)).toBeTruthy("Status New not matching");
            expect(await caseConsole.isCaseSummaryPresent(summary)).toBeTruthy("Summary not matching");
        });
        it('[5981]: Checking change case template button for Resolved', async () => {
            await caseConsole.searchAndOpenCase(caseId1);
            await updateStatusBladePo.changeStatus(statusAssigned);
            await updateStatusBladePo.clickSaveStatus(statusAssigned);
            expect(await viewCasePage.getTextOfStatus()).toBe(statusAssigned);
            await navigationPage.gotoCaseConsole();
            await caseConsole.searchCase(caseId1);
            expect(await caseConsole.isCaseIdPresent(caseId1)).toBeTruthy("CaseID not matching");
            expect(await caseConsole.isCasePriorityPresent(priority)).toBeTruthy("Priority not matching");
            expect(await caseConsole.isCaseStatusPresent(statusAssigned)).toBeTruthy("Status Assigned not matching");
            expect(await caseConsole.isCaseSummaryPresent(summary)).toBeTruthy("Summary not matching");
        });
        it('[5981]: Checking change case template button for Closed', async () => {
            await caseConsole.searchCase(caseId2);
            expect(await caseConsole.isCaseIdPresent(caseId2)).toBeTruthy("CaseID not matching");
            expect(await caseConsole.isCasePriorityPresent(priority)).toBeTruthy("Priority not matching");
            expect(await caseConsole.isCaseStatusPresent(statusNew)).toBeTruthy("Status New not matching");
            expect(await caseConsole.isCaseSummaryPresent(summary)).toBeTruthy("Summary not matching");
            await caseConsole.searchAndOpenCase(caseId2);
            expect(await viewCasePage.getTextOfStatus()).toBe(statusNew);
            await updateStatusBladePo.changeStatus(statusCanceled);
            let cancelStatusReasons: string[] = ['None', 'Approval Rejected', 'Customer Canceled'];
            expect(await updateStatusBladePo.allStatusReasonValuesPresent(cancelStatusReasons)).toBeTruthy('Cancel status reason options mismatch');
            await updateStatusBladePo.selectStatusReason('Customer Canceled');
            await updateStatusBladePo.clickSaveStatus();
            await expect(await viewCasePage.getTextOfStatus()).toBe(statusCanceled), 'Status should be New to Cancelled';
            await navigationPage.gotoCaseConsole();
            await caseConsole.searchCase(caseId2);
            expect(await caseConsole.isCaseIdPresent(caseId2)).toBeTruthy("CaseID not matching");
            expect(await caseConsole.isCasePriorityPresent(priority)).toBeTruthy("Priority not matching");
            expect(await caseConsole.isCaseStatusPresent(statusCanceled)).toBeTruthy("Status Cancelled not matching");
            expect(await caseConsole.isCaseSummaryPresent(summary)).toBeTruthy("Summary not matching");
        });
        it('[5981]: [Case Status] Case status change from New', async () => {
            await caseConsole.searchCase(caseId3);
            expect(await caseConsole.isCaseIdPresent(caseId3)).toBeTruthy("CaseID not matching");
            expect(await caseConsole.isCasePriorityPresent(priority)).toBeTruthy("Priority not matching");
            expect(await caseConsole.isCaseStatusPresent(statusNew)).toBeTruthy("Status New not matching");
            expect(await caseConsole.isCaseSummaryPresent(summary)).toBeTruthy("Summary not matching");
            await caseConsole.searchAndOpenCase(caseId3);
            expect(await viewCasePage.getTextOfStatus()).toBe(statusNew), 'status should be new of status';
            await updateStatusBladePo.changeStatus(statusPending);
            let pendingStatusReasons: string[] = ['None', 'Approval', 'Customer Response', 'Error', 'Required Fields Are Missing', 'Third Party'];
            expect(await updateStatusBladePo.allStatusReasonValuesPresent(pendingStatusReasons)).toBeTruthy('Pending status reason options mismatch');
            await updateStatusBladePo.selectStatusReason('Approval');
            await updateStatusBladePo.clickSaveStatus();
            expect(await utilityCommon.getAllPopupMsg()).toContain('Case status updated to Pending for Approval only when approval is initiated. You cannot manually select this status.');
            await utilityCommon.closePopUpMessage();
            await updateStatusBladePo.selectStatusReason('Customer Response');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe(statusPending), 'status should be new of Pending';
            await navigationPage.gotoCaseConsole();
            await caseConsole.searchCase(caseId3);
            expect(await caseConsole.isCaseIdPresent(caseId3)).toBeTruthy("CaseID not matching");
            expect(await caseConsole.isCasePriorityPresent(priority)).toBeTruthy("Priority not matching");
            expect(await caseConsole.isCaseStatusPresent(statusPending)).toBeTruthy("Status Pending not matching");
            expect(await caseConsole.isCaseSummaryPresent(summary)).toBeTruthy("Summary not matching");
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    // passed
    describe('[6082,3498]: [Case] Fields validation for case In Progress status', async () => {
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        it('[6082,3498]: Checking change case template button for In Progress', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary('Summary ' + summary);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.setContactName('qtao');
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await updateStatusBladePo.changeStatus(statusInProgress);
            await updateStatusBladePo.clickSaveStatus(statusInProgress);
            expect(await viewCasePage.getTextOfStatus()).toBe(statusInProgress);
            await viewCasePage.clickEditCaseButton();
        });
        it('[6082,3498]: Checking change case template button for Resolved', async () => {
            expect(await editCasePage.isSummaryRequiredText()).toBeTruthy('Required Text not displayed for Summary');
            expect(await $(editCasePage.selectors.contact).isPresent()).toBeTruthy('Contact not present');
            expect(await $(editCasePage.selectors.descriptionLabel).isPresent()).toBeTruthy('Description not present');
            expect(await $(editCasePage.selectors.categoryTier1Drpbox).isPresent()).toBeTruthy('Categ1 not present');
            expect(await $(editCasePage.selectors.categoryTier2Drpbox).isPresent()).toBeTruthy('Categ2 not present');
            expect(await $(editCasePage.selectors.categoryTier3Drpbox).isPresent()).toBeTruthy('Categ3 not present');
            expect(await changeAssignmentPo.isDropDownDisplayed('Assignee')).toBeTruthy('Assignee not present');
            await editCasePage.clearCaseSummary();
            await editCasePage.clickSaveCase();
            expect(await utilityCommon.getAllPopupMsg()).toContain('Resolve the field validation errors and then try again.');
            await utilityCommon.closePopUpMessage();
            await editCasePage.setCaseSummary('pendingAC');
            await editCasePage.clickSaveCase();
            expect(await utilityCommon.getAllPopupMsg()).toContain('Saved successfully.');
        });
        it('[6082,3498]: Checking change case template button for Closed', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary('Summary ' + summary);
            await createCasePage.setContactName('qtao');
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await updateStatusBladePo.changeStatus(statusInProgress);
            expect(await viewCasePage.getErrorMsgOfInprogressStatus()).toBe('Assignee is required for this case status.  Please select an assignee. ');
            await updateStatusBladePo.clickCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            expect(await viewCasePage.getTextOfStatus()).toBe(statusNew);
        });
        it('[6082,3498]: Checking change case template button for Pending', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary('Summary ' + summary);
            await createCasePage.setContactName('qtao');
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await updateStatusBladePo.changeStatus(statusAssigned);
            await updateStatusBladePo.clickSaveStatus(statusAssigned);
            expect(await viewCasePage.getTextOfStatus()).toBe(statusAssigned);
            await updateStatusBladePo.changeStatus(statusInProgress);
            expect(await viewCasePage.getErrorMsgOfInprogressStatus()).toBe('Assignee is required for this case status.  Please select an assignee. ');
            await updateStatusBladePo.clickCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            expect(await viewCasePage.getTextOfStatus()).toBe(statusAssigned);
        });
        it('[6082,3498]: [Case] Fields validation for case In Progress status', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary('Summary ' + summary);
            await createCasePage.setContactName('qtao');
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await updateStatusBladePo.changeStatus(statusPending);
            await updateStatusBladePo.selectStatusReason('Customer Response');
            await updateStatusBladePo.clickSaveStatus(statusPending);
            expect(await viewCasePage.getTextOfStatus()).toBe(statusPending);
            await updateStatusBladePo.changeStatus(statusInProgress);
            expect(await viewCasePage.getErrorMsgOfInprogressStatus()).toBe('Assignee is required for this case status.  Please select an assignee. ');
            await updateStatusBladePo.clickCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    // passed
    describe('[6330]: [Case Status] Case status change from In Progress', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let summary1: string = randomStr + "Summary 1";
        let summary2: string = randomStr + "Summary 2";
        let summary3 = randomStr + "Summary 3";
        let manualTask = 'manual task' + randomStr;
        let manualSummary = 'manual' + randomStr;
        let newCase1, newCase2, newCase3;
        let caseId1: string, caseId2: string, caseId3: string;
        let statusOptions: string[] = ["In Progress", "Pending", "Resolved", "Canceled"];
        beforeAll(async () => {
            let caseData1 =
            {
                "Requester": "qtao",
                "Summary": summary1,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi",
                "Status": "3000",
            }
            let caseData2 =
            {
                "Requester": "qtao",
                "Summary": summary2,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi",
                "Status": "3000",
            }
            let caseData3 =
            {
                "Requester": "qtao",
                "Summary": summary3,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi",
                "Status": "3000",
            }
            let templateData1 = {
                "templateName": manualTask,
                "templateSummary": manualSummary,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            newCase1 = await apiHelper.createCase(caseData1);
            caseId1 = newCase1.displayId;
            newCase2 = await apiHelper.createCase(caseData2);
            caseId2 = newCase2.displayId;
            newCase3 = await apiHelper.createCase(caseData3);
            caseId3 = newCase3.displayId;
            await apiHelper.createManualTaskTemplate(templateData1);

        });
        it('[6330]: Updating the case status -Pending', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId1);
            await viewCasePage.clickOnStatus();
            expect(await updateStatusBladePo.allStatusValuesPresent(statusOptions)).toBeTruthy("Status Options is not present");
            await updateStatusBladePo.clickCancelButton();
            await viewCasePage.clickAddTaskButton();
            await manageTask.addTaskFromTaskTemplate(manualTask);
            await manageTask.clickCloseButton();
            await updateStatusBladePo.changeStatus('Pending');
            await updateStatusBladePo.selectStatusReason('Third Party');
            await updateStatusBladePo.clickSaveStatus();
            await utilityCommon.closePopUpMessage();
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(manualSummary);
            expect(await viewTask.getTaskStatusValue()).toBe('Assigned', 'Assigned status not found');
        });
        it('[6330]: Updating the case status -Resolved', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(caseId2);
            await updateStatusBladePo.changeStatus('Resolved');
            await updateStatusBladePo.selectStatusReason('Auto Resolved');
            await updateStatusBladePo.clickSaveStatus();
            await utilityCommon.closePopUpMessage();
        });
        it('[6330]: [Case Status] Case status change from In Progress', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(caseId3);
            await viewCasePage.clickAddTaskButton();
            await manageTask.addTaskFromTaskTemplate(manualTask);
            await manageTask.clickCloseButton();
            await updateStatusBladePo.changeStatus('Canceled');
            await updateStatusBladePo.selectStatusReason('Approval Rejected');
            await updateStatusBladePo.clickSaveStatus();
            await utilityCommon.closePopUpMessage();
            await viewCasePage.clickOnRefreshTaskList();
            await viewCasePage.clickOnTaskLink(manualSummary);
            expect(await viewTask.getTaskStatusValue()).toBe('Canceled', 'canceled status not found');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    // passed
    describe('[6333]: [Case Status] Case status change from Resolved', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let summary1: string = randomStr + "Summary 1";
        let summary2: string = randomStr + "Summary 2";
        let summary3 = randomStr + "Summary 3";
        let summary4 = randomStr + "Summary 4";
        let newCase1, newCase2, newCase3, newCase4;
        let caseId1: string, caseId2: string, caseId3: string, caseId4: string;
        let statusOptions: string[] = ["Resolved", "Assigned", "In Progress", "Pending", "Closed"];
        beforeAll(async () => {
            let caseData1 =
            {
                "Requester": "qtao",
                "Summary": summary1,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi",
                "Status": "Resolved",
            }
            let caseData2 =
            {
                "Requester": "qtao",
                "Summary": summary2,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi",
                "Status": "Resolved",
            }
            let caseData3 =
            {
                "Requester": "qtao",
                "Summary": summary3,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi",
                "Status": "Resolved",
            }
            let caseData4 =
            {
                "Requester": "qtao",
                "Summary": summary4,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi",
                "Status": "Resolved",
            }
            await apiHelper.apiLogin('qkatawazi');
            newCase1 = await apiHelper.createCase(caseData1);
            caseId1 = newCase1.displayId;
            newCase2 = await apiHelper.createCase(caseData2);
            caseId2 = newCase2.displayId;
            newCase3 = await apiHelper.createCase(caseData3);
            caseId3 = newCase3.displayId;
            newCase4 = await apiHelper.createCase(caseData4);
            caseId4 = newCase4.displayId;
        });
        it('[6333]: Case status change from -Pending', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(caseId4);
            await viewCasePage.clickOnStatus();
            expect(await updateStatusBladePo.allStatusValuesPresent(statusOptions)).toBeTruthy("Status Options is not present");
            await updateStatusBladePo.clickCancelButton();
            await updateStatusBladePo.changeStatus('Pending');
            expect(await updateStatusBladePo.isStatusReasonRequiredTextPresent()).toBeTruthy();
            await updateStatusBladePo.selectStatusReason('Third Party');
            await updateStatusBladePo.clickSaveStatus('Pending');
            expect(await viewCasePage.getTextOfStatus()).toBe('Pending');
        });
        it('[6333]: Case status change from -In Progress', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(caseId2);
            await updateStatusBladePo.changeStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus('In Progress');
            expect(await viewCasePage.getTextOfStatus()).toBe('In Progress');
        });
        it('[6333]: Case status change from -Assigned', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(caseId3);
            await updateStatusBladePo.changeStatus('Assigned');
            await updateStatusBladePo.clickSaveStatus('Assigned');
            expect(await viewCasePage.getTextOfStatus()).toBe('Assigned');
        });
        it('[6333]: [Case Status] Case status change from Resolved', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(caseId4);
            await updateStatusBladePo.changeStatus('Closed');
            await updateStatusBladePo.clickSaveStatus('Closed');
            expect(await viewCasePage.getTextOfStatus()).toBe('Closed');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    // failed : defect for quick case - case template search
    describe('[6079]: [Case] Fields validation for case in Canceled status', async () => {
        let templateData, randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let summary1: string = randomStr + "Summary 1";
        let summary2: string = randomStr + "Summary 2";
        let summary3 = randomStr + "Summary 3";
        let summary4 = randomStr + "Summary 4";
        let newCase1, newCase2, newCase3, newCase4;
        let caseId1: string, caseId2: string, caseId3: string, caseId4: string;
        let caseData1, caseData2, caseData3, caseData4;
        let caseTemplateName1 = randomStr + "Petramco";
        beforeAll(async () => {
            caseData1 =
                {
                    "Requester": "qtao",
                    "Summary": summary1,
                    "Assigned Company": "Petramco",
                    "Business Unit": "United States Support",
                    "Support Group": "US Support 3",
                    "Assignee": "qkatawazi",
                    "Status": "New",
                }
            caseData2 =
                {
                    "Requester": "qtao",
                    "Summary": summary2,
                    "Assigned Company": "Petramco",
                    "Business Unit": "United States Support",
                    "Support Group": "US Support 3",
                    "Assignee": "qkatawazi",
                    "Status": "Assigned",
                }
            caseData3 =
                {
                    "Requester": "qtao",
                    "Summary": summary3,
                    "Assigned Company": "Petramco",
                    "Business Unit": "United States Support",
                    "Support Group": "US Support 3",
                    "Assignee": "qkatawazi",
                    "Status": "In Progress",
                }
            caseData4 =
                {
                    "Requester": "qtao",
                    "Summary": summary4,
                    "Assigned Company": "Petramco",
                    "Business Unit": "United States Support",
                    "Support Group": "US Support 3",
                    "Assignee": "qkatawazi",
                    "Status": "Pending",
                }
            templateData = {
                "templateName": caseTemplateName1,
                "templateSummary": caseTemplateName1,
                "categoryTier1": "Purchasing Card",
                "categoryTier2": "Policies",
                "categoryTier3": "Card Issuance",
                "casePriority": "Low",
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createCaseTemplate(templateData);
            newCase1 = await apiHelper.createCase(caseData1);
            caseId1 = newCase1.displayId;
            newCase2 = await apiHelper.createCase(caseData2);
            caseId2 = newCase2.displayId;
            newCase3 = await apiHelper.createCase(caseData3);
            caseId3 = newCase3.displayId;
            newCase4 = await apiHelper.createCase(caseData4);
            caseId4 = newCase4.displayId;
        });
        // defect
        it('[6079]: Fields validation for case in Canceled status 1', async () => {
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName("adam");
            await quickCasePo.selectCaseTemplate(caseTemplateName1);
            await quickCasePo.saveCase();
            await previewCasePo.clickGoToCaseButton();
            await updateStatusBladePo.changeStatus('Canceled');
            await updateStatusBladePo.selectStatusReason('Approval Rejected');
            await updateStatusBladePo.clickSaveStatus();
            await viewCasePage.clickEditCaseButton();
            await editCasePage.setCaseSummary(summary1);
            await expect(editCasePage.isSaveCaseEnable()).toBeFalsy("Save button enabled");
            await editCasePage.clickOnCancelCaseButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });
        it('[6079]: Fields validation for case in Canceled status 2', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(caseId1);
            await viewCasePage.clickEditCaseButton();
            await editCasePage.setCaseSummary(summary1 + " new");
            expect(await editCasePage.isSummaryRequiredText()).toBeTruthy("Summary Required text not present");
            await editCasePage.clickSaveCase();
            await updateStatusBladePo.changeStatus('Canceled');
            await updateStatusBladePo.selectStatusReason('Approval Rejected');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Canceled');
        });
        it('[6079]: Fields validation for case in Canceled status 3', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(caseId2);
            await viewCasePage.clickEditCaseButton();
            await editCasePage.setCaseSummary(summary2 + " new");
            expect(await editCasePage.isSummaryRequiredText()).toBeTruthy("Summary Required text not present");
            await editCasePage.clickSaveCase();
            await updateStatusBladePo.changeStatus('Canceled');
            await updateStatusBladePo.selectStatusReason('Approval Rejected');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Canceled');
        });
        it('[6079]: Fields validation for case in Canceled status 4', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(caseId3);
            await viewCasePage.clickEditCaseButton();
            await editCasePage.setCaseSummary(summary3 + " new");
            expect(await editCasePage.isSummaryRequiredText()).toBeTruthy("Summary Required text not present");
            await editCasePage.clickOnAssignToMe();
            await editCasePage.clickSaveCase();
            await updateStatusBladePo.changeStatus('Canceled');
            await updateStatusBladePo.selectStatusReason('Approval Rejected');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Canceled');
        });
        it('[6079]: [Case] Fields validation for case in Canceled status 5', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(caseId4);
            await viewCasePage.clickEditCaseButton();
            await editCasePage.setCaseSummary(summary4 + " new");
            expect(await editCasePage.isSummaryRequiredText()).toBeTruthy("Summary Required text not present");
            await editCasePage.clickOnAssignToMe();
            await editCasePage.clickSaveCase();
            await updateStatusBladePo.changeStatus('Canceled');
            await updateStatusBladePo.selectStatusReason('Approval Rejected');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Canceled');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    // passed
    describe('[6329]: [Case Status] Case status change from Pending', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let summary1: string = randomStr + "Summary 1";
        let summary2: string = randomStr + "Summary 2";
        let summary3 = randomStr + "Summary 3";
        let summary4 = randomStr + "Summary 4";
        let summary5 = randomStr + "Summary 5";
        let newCase1, newCase2, newCase3, newCase4, newCase5;
        let caseId1: string, caseId2: string, caseId3: string, caseId4: string, caseId5: string;
        let statusOptions: string[] = ["Pending", "Assigned", "In Progress", "Resolved", "Canceled", "Closed", "Approval Rejected"];
        beforeAll(async () => {
            let caseData1 =
            {
                "Requester": "qtao",
                "Summary": summary1,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi",
                "Status": "Pending",
            }
            let caseData2 =
            {
                "Requester": "qtao",
                "Summary": summary2,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi",
                "Status": "Pending",
            }
            let caseData3 =
            {
                "Requester": "qtao",
                "Summary": summary3,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi",
                "Status": "Pending",
            }
            let caseData4 =
            {
                "Requester": "qtao",
                "Summary": summary4,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi",
                "Status": "Pending",
            }
            let caseData5 =
            {
                "Requester": "qtao",
                "Summary": summary5,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi",
                "Status": "Pending",
            }
            await apiHelper.apiLogin('qkatawazi');
            newCase1 = await apiHelper.createCase(caseData1);
            caseId1 = newCase1.displayId;
            newCase2 = await apiHelper.createCase(caseData2);
            caseId2 = newCase2.displayId;
            newCase3 = await apiHelper.createCase(caseData3);
            caseId3 = newCase3.displayId;
            newCase4 = await apiHelper.createCase(caseData4);
            caseId4 = newCase4.displayId;
            newCase5 = await apiHelper.createCase(caseData5);
            caseId5 = newCase5.displayId;
        });
        it('[6329]: Case status change from Pending', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(caseId1);
            await viewCasePage.clickOnStatus();
            expect(await updateStatusBladePo.allStatusValuesPresent(statusOptions)).toBeTruthy("Status Options is not present");
            await updateStatusBladePo.clickCancelButton();
            await updateStatusBladePo.changeStatus('Resolved');
            expect(await updateStatusBladePo.isStatusReasonRequiredTextPresent()).toBeTruthy();
            await updateStatusBladePo.selectStatusReason('Auto Resolved');
            await updateStatusBladePo.clickSaveStatus('Resolved');
            await expect(await viewCasePage.getTextOfStatus()).toBe('Resolved');
        });
        it('[6329]: Case status change from Pending', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(caseId2);
            await updateStatusBladePo.changeStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus('In Progress');
            await expect(await viewCasePage.getTextOfStatus()).toBe('In Progress');
        });
        it('[6329]: Case status change from Pending', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(caseId3);
            await updateStatusBladePo.changeStatus('Assigned');
            await updateStatusBladePo.clickSaveStatus('Assigned');
            await expect(await viewCasePage.getTextOfStatus()).toBe('Assigned');
            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(caseId4);
            await updateStatusBladePo.changeStatus('Closed');
            await updateStatusBladePo.clickSaveStatus('Closed');
            await expect(await viewCasePage.getTextOfStatus()).toBe('Closed');
        });
        it('[6329]: [Case Status] Case status change from Pending', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(caseId5);
            await updateStatusBladePo.changeStatus('Canceled');
            expect(await updateStatusBladePo.isStatusReasonRequiredTextPresent()).toBeTruthy();
            await updateStatusBladePo.selectStatusReason('Customer Canceled');
            await updateStatusBladePo.clickSaveStatus('Canceled');
            await expect(await viewCasePage.getTextOfStatus()).toBe('Canceled');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    // passed
    describe('[5742]: [Status Blade] Case Status Blade view', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let summary1: string = randomStr + "Summary 1";
        let summary2: string = randomStr + "Summary 2";
        let newCase1, newCase2;
        let caseId1: string, caseId2: string;
        beforeAll(async () => {
            let caseData1 =
            {
                "Requester": "qtao",
                "Summary": summary1,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi",
                "Status": "Pending",
            }
            let caseData2 =
            {
                "Requester": "qtao",
                "Summary": summary2,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi",
                "Status": "New",
            }
            await apiHelper.apiLogin('qkatawazi');
            newCase1 = await apiHelper.createCase(caseData1);
            caseId1 = newCase1.displayId;
            newCase2 = await apiHelper.createCase(caseData2);
            caseId2 = newCase2.displayId;
        });
        it('[5742]: Case Status Blade view', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(caseId1);
            await viewCasePage.clickOnStatus();
            await updateStatusBladePo.isChangeStatusFieldPresent();
            await updateStatusBladePo.isCancelUpdateStatusButtonPresent();
            await updateStatusBladePo.isStatusReasonFieldPresent();
            expect(await updateStatusBladePo.isSaveUpdateStatusButtonEnabled()).toBeFalsy("Save Button is enabled");
            await updateStatusBladePo.clickCancelButton();
        });
        it('[5742]: [Status Blade] Case Status Blade view', async () => {
            await updateStatusBladePo.changeStatus('Resolved');
            expect(await updateStatusBladePo.isStatusReasonRequiredTextPresent()).toBeTruthy();
            await updateStatusBladePo.selectStatusReason('Auto Resolved');
            expect(await updateStatusBladePo.isSaveUpdateStatusButtonEnabled()).toBeTruthy("Save Button is enabled");
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Resolved');
            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(caseId2);
            await updateStatusBladePo.changeStatus('In Progress');
            await updateStatusBladePo.clickCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    // passed
    it('[6080]: [Case] Fields validation for case in Resolved status', async () => {
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.deleteApprovalMapping(caseModule);
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await changeAssignmentPo.setDropDownValue("AssignedGroup", "US Support 3");
        await changeAssignmentPo.setDropDownValue("Assignee", "Qadim Katawazi");
        await createCasePage.setContactName('qtao');
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        expect(await viewCasePage.getTextOfStatus()).toBe(statusAssigned);
        await updateStatusBladePo.changeStatus(statusResolved);
        await updateStatusBladePo.selectStatusReason('Auto Resolved');
        await updateStatusBladePo.clickSaveStatus(statusResolved);
        expect(await viewCasePage.getTextOfStatus()).toBe(statusResolved);
        await viewCasePage.clickEditCaseButton();
        expect(await editCasePage.isSummaryRequiredText()).toBeTruthy('Required Text not displayed');
        // * Optional fields are: Contact, Description, Category Tiers (1-3), Assignee.
        expect(await $(editCasePage.selectors.contact).isPresent()).toBeTruthy('Contact not present');
        expect(await $(editCasePage.selectors.descriptionLabel).isPresent()).toBeTruthy('Description not present');
        expect(await $(editCasePage.selectors.categoryTier1Drpbox).isPresent()).toBeTruthy('Categ1 not present');
        expect(await $(editCasePage.selectors.categoryTier2Drpbox).isPresent()).toBeTruthy('Categ2 not present');
        expect(await $(editCasePage.selectors.categoryTier3Drpbox).isPresent()).toBeTruthy('Categ3 not present');
        expect(await editCasePage.getAssigneeValue()).toBe('Qadim Katawazi');
        await editCasePage.clearCaseSummary();
        await editCasePage.clickSaveCase();
        expect(await utilityCommon.isPopUpMessagePresent('Resolve the field validation errors and then try again.')).toBeTruthy();
        await utilityCommon.closePopUpMessage();
        await editCasePage.setCaseSummary('Pending AC');
        await editCasePage.clickSaveCase();
        expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy();
    });

    // passed
    it('[6332]: [Case Status] Case status change from Closed', async () => {
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await changeAssignmentPo.setDropDownValue("AssignedGroup", "US Support 3");
        await changeAssignmentPo.setDropDownValue("Assignee", "Qadim Katawazi");
        await createCasePage.setContactName('qtao');
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        await updateStatusBladePo.changeStatus(statusResolved);
        await updateStatusBladePo.selectStatusReason('Customer Follow-Up Required');
        await updateStatusBladePo.clickSaveStatus(statusResolved);
        expect(await viewCasePage.getTextOfStatus()).toBe(statusResolved);
        await updateStatusBladePo.changeStatus(statusClosed);
        await updateStatusBladePo.clickSaveStatus(statusClosed);
        expect(await viewCasePage.getTextOfStatus()).toBe(statusClosed);
        await viewCasePage.clickOnStatus();
        expect(await $(updateStatusBladePo.selectors.saveUpdateStatus).isPresent()).toBeFalsy('Update Statue blade is displayed');
    });

    // passed
    it('[6301]: [Case Status Reason] Status Reason change without status transition', async () => {
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await changeAssignmentPo.setDropDownValue("AssignedGroup", "US Support 3");
        await changeAssignmentPo.setDropDownValue("Assignee", "Qadim Katawazi");
        await createCasePage.setContactName('qtao');
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        await updateStatusBladePo.changeStatus(statusPending);
        let pendingStatusReasons: string[] = ['None', 'Approval', 'Customer Response', 'Error', 'Required Fields Are Missing', 'Third Party'];
        expect(await updateStatusBladePo.allStatusReasonValuesPresent(pendingStatusReasons)).toBeTruthy('Pending status reason options mismatch');
        await updateStatusBladePo.selectStatusReason('Approval');
        await updateStatusBladePo.clickSaveStatus();
        await expect(await utilityCommon.getAllPopupMsg()).toContain('Case status updated to Pending for Approval only when approval is initiated. You cannot manually select this status.');
        await utilityCommon.closePopUpMessage();
        await updateStatusBladePo.selectStatusReason('Customer Response');
        await updateStatusBladePo.clickSaveStatus();
        expect(await viewCasePage.getTextOfStatus()).toBe(statusPending);
        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await changeAssignmentPo.setDropDownValue("AssignedGroup", "US Support 3");
        await changeAssignmentPo.setDropDownValue("Assignee", "Qadim Katawazi");
        await createCasePage.setContactName('qtao');
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        await updateStatusBladePo.changeStatus(statusResolved);
        let resolvedStatusReasons: string[] = ['None', 'Auto Resolved', 'Customer Follow-Up Required', 'No Further Action Required'];
        await expect(await updateStatusBladePo.allStatusReasonValuesPresent(resolvedStatusReasons)).toBeTruthy('Resolved status reason options mismatch');
        await updateStatusBladePo.selectStatusReason('Auto Resolved');
        await updateStatusBladePo.clickSaveStatus();
    });

    // passed
    it('[6307]: [Case Status] Case status change from Canceled', async () => {
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await changeAssignmentPo.setDropDownValue("AssignedGroup", "US Support 3");
        await changeAssignmentPo.setDropDownValue("Assignee", "Qadim Katawazi");
        await createCasePage.setContactName('qtao');
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        await updateStatusBladePo.changeStatus(statusCanceled);
        await updateStatusBladePo.selectStatusReason('Approval Rejected');
        await updateStatusBladePo.clickSaveStatus(statusCanceled);
        expect(await viewCasePage.getTextOfStatus()).toBe(statusCanceled);
        await viewCasePage.clickOnStatus();
        expect(await $(updateStatusBladePo.selectors.saveUpdateStatus).isPresent()).toBeFalsy('Update Statue blade is displayed');
    });

    // passed
    it('[6083]: [Case] Fields validation for case in Assigned status', async () => {
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await changeAssignmentPo.setDropDownValue("AssignedGroup", "US Support 3");
        await changeAssignmentPo.setDropDownValue("Assignee", "Qadim Katawazi");
        await createCasePage.setContactName('qtao');
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        expect(await viewCasePage.getTextOfStatus()).toBe(statusAssigned);
        await viewCasePage.clickEditCaseButton();
        expect(await editCasePage.isSummaryRequiredText()).toBeTruthy('Required Text not displayed');
        // * Optional fields are: Contact, Description, Category Tiers (1-3), Assignee.
        expect(await $(editCasePage.selectors.contact).isPresent()).toBeTruthy('Contact not present');
        expect(await $(editCasePage.selectors.descriptionLabel).isPresent()).toBeTruthy('Description not present');
        expect(await $(editCasePage.selectors.categoryTier1Drpbox).isPresent()).toBeTruthy('Categ1 not present');
        expect(await $(editCasePage.selectors.categoryTier2Drpbox).isPresent()).toBeTruthy('Categ2 not present');
        expect(await $(editCasePage.selectors.categoryTier3Drpbox).isPresent()).toBeTruthy('Categ3 not present');
        expect(await editCasePage.getAssigneeValue()).toBe('Qadim Katawazi');
        await editCasePage.clearCaseSummary();
        await editCasePage.clickSaveCase();
        expect(await utilityCommon.getAllPopupMsg()).toContain('Resolve the field validation errors and then try again.');
        await utilityCommon.closePopUpMessage();
        await editCasePage.setCaseSummary('pendingAC');
        await editCasePage.clickSaveCase();
        expect(await utilityCommon.getAllPopupMsg()).toContain('Saved successfully.');
    });

    // passed
    it('[6081]: [Case] Fields validation for case in Pending status', async () => {
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await changeAssignmentPo.setDropDownValue("AssignedGroup", "US Support 3");
        await changeAssignmentPo.setDropDownValue("Assignee", "Qadim Katawazi");
        await createCasePage.setContactName('qtao');
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        await updateStatusBladePo.changeStatus(statusPending);
        await updateStatusBladePo.selectStatusReason('Customer Response');
        await updateStatusBladePo.clickSaveStatus(statusPending);
        expect(await viewCasePage.getTextOfStatus()).toBe(statusPending);
        await viewCasePage.clickEditCaseButton();
        expect(await editCasePage.isSummaryRequiredText()).toBeTruthy('Required Text not displayed');
        // * Optional fields are: Contact, Description, Category Tiers (1-3), Assignee.
        expect(await $(editCasePage.selectors.contact).isPresent()).toBeTruthy('Contact not present');
        expect(await $(editCasePage.selectors.descriptionLabel).isPresent()).toBeTruthy('Description not present');
        expect(await $(editCasePage.selectors.categoryTier1Drpbox).isPresent()).toBeTruthy('Categ1 not present');
        expect(await $(editCasePage.selectors.categoryTier2Drpbox).isPresent()).toBeTruthy('Categ2 not present');
        expect(await $(editCasePage.selectors.categoryTier3Drpbox).isPresent()).toBeTruthy('Categ3 not present');
        expect(await editCasePage.getAssigneeValue()).toBe('Qadim Katawazi');
        await editCasePage.clearCaseSummary();
        await editCasePage.clickSaveCase();
        expect(await utilityCommon.getAllPopupMsg()).toContain('Resolve the field validation errors and then try again.');
        await utilityCommon.closePopUpMessage();
        await editCasePage.setCaseSummary('pendingAC');
        await editCasePage.clickSaveCase();
        expect(await utilityCommon.getAllPopupMsg()).toContain('Saved successfully.');
    });
});
