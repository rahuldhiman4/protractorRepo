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
import { default as updateStatusBlade, default as updateStatusBladePo } from '../../pageobject/common/update.status.blade.po';
import manageTask from "../../pageobject/task/manage-task-blade.po";
import viewTask from "../../pageobject/task/view-task.po";
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';

describe('Case Status Change', () => {
    let statusNew: string = "New";
    let statusInProgress: string = "In Progress";
    let statusAssigned: string = "Assigned";
    let statusPending: string = "Pending";
    let statusCanceled: string = "Canceled";
    let statusResolved: string = "Resolved";
    let statusClosed: string = "Closed";

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    //kgaikwad
    it('[DRDMV-2530]: [Case Status] Case status change from New', async () => {
        let priority: string = "Medium";
        let summary: string = "Test case for DRDMV-2530";
        let caseData =
        {
            "Requester": "qtao",
            "Summary": "Test case for DRDMV-2530",
        }
        await apiHelper.apiLogin('qkatawazi');
        let newCase1 = await apiHelper.createCase(caseData);
        let caseId1: string = newCase1.displayId;

        await caseConsole.searchAndOpenCase(caseId1);
        await viewCasePage.clickEditCaseButton();
        expect(await viewCasePage.isEditLinkDisplay()).toBeFalsy('edit link should not display');
        await editCasePage.clickOnCancelCaseButton();
        await viewCasePage.clickOnStatus();
        let statuses: string[] = ["New", "Assigned", "In Progress", "Pending", "Canceled"];
        let boln: boolean = await updateStatusBladePo.allStatusOptionsPresent(statuses);
        expect(boln).toBeTruthy('Status does not match On view case');
        await updateStatusBladePo.clickCancelButton();
        expect(await viewCasePage.getTextOfStatus()).toBe(statusNew);
        await navigationPage.gotoCaseConsole();
        await caseConsole.searchCase(caseId1);
        expect(await caseConsole.isCaseIdPresent(caseId1)).toBeTruthy("CaseID not matching");
        expect(await caseConsole.isCasePriorityPresent(priority)).toBeTruthy("Priority not matching");
        expect(await caseConsole.isCaseStatusPresent(statusNew)).toBeTruthy("Status New not matching");
        expect(await caseConsole.isCaseSummaryPresent(summary)).toBeTruthy("Summary not matching");
        await caseConsole.searchAndOpenCase(caseId1);
        // Select Assigned status and save.
        await updateStatusBladePo.changeCaseStatus(statusAssigned);
        await updateStatusBladePo.clickSaveStatus(statusAssigned);
        expect(await viewCasePage.getTextOfStatus()).toBe(statusAssigned);
        await navigationPage.gotoCaseConsole();
        await caseConsole.searchCase(caseId1);
        expect(await caseConsole.isCaseIdPresent(caseId1)).toBeTruthy("CaseID not matching");
        expect(await caseConsole.isCasePriorityPresent(priority)).toBeTruthy("Priority not matching");
        expect(await caseConsole.isCaseStatusPresent(statusAssigned)).toBeTruthy("Status Assigned not matching");
        expect(await caseConsole.isCaseSummaryPresent(summary)).toBeTruthy("Summary not matching");
        // - Change status from New to Canceled.
        let newCase2 = await apiHelper.createCase(caseData);
        let caseId2: string = newCase2.displayId;
        await caseConsole.searchCase(caseId2);
        expect(await caseConsole.isCaseIdPresent(caseId2)).toBeTruthy("CaseID not matching");
        expect(await caseConsole.isCasePriorityPresent(priority)).toBeTruthy("Priority not matching");
        expect(await caseConsole.isCaseStatusPresent(statusNew)).toBeTruthy("Status New not matching");
        expect(await caseConsole.isCaseSummaryPresent(summary)).toBeTruthy("Summary not matching");
        await caseConsole.searchAndOpenCase(caseId2);
        expect(await viewCasePage.getTextOfStatus()).toBe(statusNew);
        await updateStatusBladePo.changeCaseStatus(statusCanceled);
        let cancelStatusReasons: string[] = ['Select None', 'Approval Rejected', 'Customer Canceled'];
        expect(await updateStatusBladePo.allStatusReasonOptionsPresent(cancelStatusReasons)).toBeTruthy('Cancel status reason options mismatch');
        await updateStatusBladePo.clickOnstatusReason();
        await updateStatusBladePo.setStatusReason('Customer Canceled');
        await updateStatusBladePo.clickSaveStatus();
        await expect(await viewCasePage.getTextOfStatus()).toBe(statusCanceled), 'Status should be New to Cancelled';
        await navigationPage.gotoCaseConsole();
        await caseConsole.searchCase(caseId2);
        expect(await caseConsole.isCaseIdPresent(caseId2)).toBeTruthy("CaseID not matching");
        expect(await caseConsole.isCasePriorityPresent(priority)).toBeTruthy("Priority not matching");
        expect(await caseConsole.isCaseStatusPresent(statusCanceled)).toBeTruthy("Status Cancelled not matching");
        expect(await caseConsole.isCaseSummaryPresent(summary)).toBeTruthy("Summary not matching");
        // - Change status from New to Pending.
        let newCase3 = await apiHelper.createCase(caseData);
        let caseId3: string = newCase3.displayId;
        await caseConsole.searchCase(caseId3);
        expect(await caseConsole.isCaseIdPresent(caseId3)).toBeTruthy("CaseID not matching");
        expect(await caseConsole.isCasePriorityPresent(priority)).toBeTruthy("Priority not matching");
        expect(await caseConsole.isCaseStatusPresent(statusNew)).toBeTruthy("Status New not matching");
        expect(await caseConsole.isCaseSummaryPresent(summary)).toBeTruthy("Summary not matching");
        await caseConsole.searchAndOpenCase(caseId3);
        expect(await viewCasePage.getTextOfStatus()).toBe(statusNew), 'status should be new of status';
        await updateStatusBladePo.changeCaseStatus(statusPending);
        let pendingStatusReasons: string[] = ['Select None', 'Approval', 'Customer Response', 'Error', 'Required Fields Are Missing', 'Third Party'];
        expect(await updateStatusBladePo.allStatusReasonOptionsPresent(pendingStatusReasons)).toBeTruthy('Pending status reason options mismatch');
        await updateStatusBladePo.clickOnstatusReason();
        await updateStatusBladePo.setStatusReason('Approval');
        await updateStatusBladePo.clickSaveStatus();
        expect(await utilityCommon.getAllPopupMsg()).toContain('Case status updated to Pending for Approval only when approval is initiated. You cannot manually select this status.');
        await utilityCommon.closePopUpMessage();
        await updateStatusBladePo.setStatusReason('Customer Response');
        await updateStatusBladePo.clickSaveStatus();
        expect(await viewCasePage.getTextOfStatus()).toBe(statusPending), 'status should be new of Pending';
        await navigationPage.gotoCaseConsole();
        await caseConsole.searchCase(caseId3);
        expect(await caseConsole.isCaseIdPresent(caseId3)).toBeTruthy("CaseID not matching");
        expect(await caseConsole.isCasePriorityPresent(priority)).toBeTruthy("Priority not matching");
        expect(await caseConsole.isCaseStatusPresent(statusPending)).toBeTruthy("Status Pending not matching");
        expect(await caseConsole.isCaseSummaryPresent(summary)).toBeTruthy("Summary not matching");
    }, 450 * 1000);

    //kgaikwad
    it('[DRDMV-1618]: [Case] Fields validation for case in Resolved status', async () => {
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.setContactName('qtao');
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        expect(await viewCasePage.getTextOfStatus()).toBe(statusAssigned);
        await updateStatusBladePo.changeCaseStatus(statusResolved);
        await updateStatusBladePo.setStatusReason('Auto Resolved');
        await updateStatusBladePo.clickSaveStatus(statusResolved);
        expect(await viewCasePage.getTextOfStatus()).toBe(statusResolved);
        await viewCasePage.clickEditCaseButton();
        expect(await editCasePage.isSummaryRequiredText()).toBeTruthy('Required Text not displayed');
        expect(await editCasePage.isPriorityRequiredText()).toBeTruthy('Required Text not displayed');
        // * Optional fields are: Contact, Description, Category Tiers (1-3), Assignee.
        expect(await $(editCasePage.selectors.contact).isPresent()).toBeTruthy('Contact not present');
        expect(await $(editCasePage.selectors.descriptionLabel).isPresent()).toBeTruthy('Description not present');
        expect(await $(editCasePage.selectors.categoryTier1Drpbox).isPresent()).toBeTruthy('Categ1 not present');
        expect(await $(editCasePage.selectors.categoryTier2Drpbox).isPresent()).toBeTruthy('Categ2 not present');
        expect(await $(editCasePage.selectors.categoryTier3Drpbox).isPresent()).toBeTruthy('Categ3 not present');
        expect(await $(editCasePage.selectors.assigneee).isPresent()).toBeTruthy('Description not present');
        await editCasePage.clearCaseSummary();
        await editCasePage.clickSaveCase();
        expect(await utilityCommon.isPopUpMessagePresent('Resolve the field validation errors and then try again.')).toBeTruthy();
        await utilityCommon.closePopUpMessage();
        await editCasePage.setCaseSummary('Pending AC');
        await editCasePage.clickSaveCase();
        expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy();
    });//, 180 * 1000);

    //kgaikwad
    it('[DRDMV-1197]: [Case Status] Case status change from Closed', async () => {
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.setContactName('qtao');
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        await updateStatusBladePo.changeCaseStatus(statusResolved);
        await updateStatusBladePo.setStatusReason('Customer Follow-Up Required');
        await updateStatusBladePo.clickSaveStatus(statusResolved);
        expect(await viewCasePage.getTextOfStatus()).toBe(statusResolved);
        await updateStatusBladePo.changeCaseStatus(statusClosed);
        await updateStatusBladePo.clickSaveStatus(statusClosed);
        expect(await viewCasePage.getTextOfStatus()).toBe(statusClosed);
        await viewCasePage.clickOnStatus();
        expect(await $(updateStatusBlade.selectors.saveUpdateStatus).isPresent()).toBeFalsy('Update Statue blade is displayed');
    });

    //kgaikwad
    it('[DRDMV-1233]: [Case Status Reason] Status Reason change without status transition', async () => {
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.setContactName('qtao');
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        await updateStatusBladePo.changeCaseStatus(statusPending);
        let pendingStatusReasons: string[] = ['Select None', 'Approval', 'Customer Response', 'Error', 'Required Fields Are Missing', 'Third Party'];
        expect(await updateStatusBladePo.allStatusReasonOptionsPresent(pendingStatusReasons)).toBeTruthy('Pending status reason options mismatch');
        await updateStatusBladePo.clickOnstatusReason();
        await updateStatusBladePo.setStatusReason('Approval');
        await updateStatusBladePo.clickSaveStatus();
        await expect(await utilityCommon.getAllPopupMsg()).toContain('Case status updated to Pending for Approval only when approval is initiated. You cannot manually select this status.');
        await utilityCommon.closePopUpMessage();
        await updateStatusBladePo.setStatusReason('Customer Response');
        await updateStatusBladePo.clickSaveStatus();
        expect(await viewCasePage.getTextOfStatus()).toBe(statusPending);
        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.setContactName('qtao');
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        await updateStatusBladePo.changeCaseStatus(statusResolved);
        let resolvedStatusReasons: string[] = ['Select None', 'Auto Resolved', 'Customer Follow-Up Required', 'No Further Action Required'];
        await expect(await updateStatusBladePo.allStatusReasonOptionsPresent(resolvedStatusReasons)).toBeTruthy('Resolved status reason options mismatch');
        await updateStatusBladePo.clickOnstatusReason();
        await updateStatusBladePo.setStatusReason('Auto Resolved');
        await updateStatusBladePo.clickSaveStatus();
    });//, 180 * 1000);

    //kgaikwad
    it('[DRDMV-1616]: [Case] Fields validation for case In Progress status', async () => {
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.setContactName('qtao');
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        await updateStatusBladePo.changeCaseStatus(statusInProgress);
        await updateStatusBladePo.clickSaveStatus(statusInProgress);
        expect(await viewCasePage.getTextOfStatus()).toBe(statusInProgress);
        await viewCasePage.clickEditCaseButton();
        expect(await editCasePage.isSummaryRequiredText()).toBeTruthy('Required Text not displayed');
        expect(await editCasePage.isPriorityRequiredText()).toBeTruthy('Required Text not displayed');
        expect(await $(editCasePage.selectors.contact).isPresent()).toBeTruthy('Contact not present');
        expect(await $(editCasePage.selectors.descriptionLabel).isPresent()).toBeTruthy('Description not present');
        expect(await $(editCasePage.selectors.categoryTier1Drpbox).isPresent()).toBeTruthy('Categ1 not present');
        expect(await $(editCasePage.selectors.categoryTier2Drpbox).isPresent()).toBeTruthy('Categ2 not present');
        expect(await $(editCasePage.selectors.categoryTier3Drpbox).isPresent()).toBeTruthy('Categ3 not present');
        expect(await $(editCasePage.selectors.assigneee).isPresent()).toBeTruthy('Assignee not present');
        await editCasePage.clearCaseSummary();
        await editCasePage.clickSaveCase();
        expect(await utilityCommon.getAllPopupMsg()).toContain('Resolve the field validation errors and then try again.');
        await utilityCommon.closePopUpMessage();
        await editCasePage.setCaseSummary('pendingAC');
        await editCasePage.clickSaveCase();
        expect(await utilityCommon.getAllPopupMsg()).toContain('Saved successfully.');

        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await createCasePage.setContactName('qtao');
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        await updateStatusBladePo.changeCaseStatus(statusInProgress);
        expect(await viewCasePage.getErrorMsgOfInprogressStatus()).toBe('Assignee is required for this case status.  Please select an assignee. ');
        await updateStatusBladePo.clickCancelButton();
        await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        expect(await viewCasePage.getTextOfStatus()).toBe(statusNew);

        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await createCasePage.setContactName('qtao');
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        await updateStatusBladePo.changeCaseStatus(statusAssigned);
        await updateStatusBladePo.clickSaveStatus(statusAssigned);
        expect(await viewCasePage.getTextOfStatus()).toBe(statusAssigned);
        await updateStatusBladePo.changeCaseStatus(statusInProgress);
        expect(await viewCasePage.getErrorMsgOfInprogressStatus()).toBe('Assignee is required for this case status.  Please select an assignee. ');
        await updateStatusBladePo.clickCancelButton();
        await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        expect(await viewCasePage.getTextOfStatus()).toBe(statusAssigned);

        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await createCasePage.setContactName('qtao');
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        await updateStatusBladePo.changeCaseStatus(statusPending);
        await updateStatusBladePo.setStatusReason('Customer Response');
        await updateStatusBladePo.clickSaveStatus(statusPending);
        expect(await viewCasePage.getTextOfStatus()).toBe(statusPending);
        await updateStatusBladePo.changeCaseStatus(statusInProgress);
        expect(await viewCasePage.getErrorMsgOfInprogressStatus()).toBe('Assignee is required for this case status.  Please select an assignee. ');
        await updateStatusBladePo.clickCancelButton();
        await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
    }, 450 * 1000);

    //kgaikwad
    it('[DRDMV-1227]: [Case Status] Case status change from Canceled', async () => {
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.setContactName('qtao');
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        await updateStatusBladePo.changeCaseStatus(statusCanceled);
        await updateStatusBladePo.setStatusReason('Approval Rejected');
        await updateStatusBladePo.clickSaveStatus(statusCanceled);
        expect(await viewCasePage.getTextOfStatus()).toBe(statusCanceled);
        await viewCasePage.clickOnStatus();
        expect(await $(updateStatusBlade.selectors.saveUpdateStatus).isPresent()).toBeFalsy('Update Statue blade is displayed');
    });

    //kgaikwad
    it('[DRDMV-1615]: [Case] Fields validation for case in Assigned status', async () => {
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.setContactName('qtao');
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        expect(await viewCasePage.getTextOfStatus()).toBe(statusAssigned);
        await viewCasePage.clickEditCaseButton();
        expect(await editCasePage.isSummaryRequiredText()).toBeTruthy('Required Text not displayed');
        expect(await editCasePage.isPriorityRequiredText()).toBeTruthy('Required Text not displayed');
        // * Optional fields are: Contact, Description, Category Tiers (1-3), Assignee.
        expect(await $(editCasePage.selectors.contact).isPresent()).toBeTruthy('Contact not present');
        expect(await $(editCasePage.selectors.descriptionLabel).isPresent()).toBeTruthy('Description not present');
        expect(await $(editCasePage.selectors.categoryTier1Drpbox).isPresent()).toBeTruthy('Categ1 not present');
        expect(await $(editCasePage.selectors.categoryTier2Drpbox).isPresent()).toBeTruthy('Categ2 not present');
        expect(await $(editCasePage.selectors.categoryTier3Drpbox).isPresent()).toBeTruthy('Categ3 not present');
        expect(await $(editCasePage.selectors.assigneee).isPresent()).toBeTruthy('Description not present');
        await editCasePage.clearCaseSummary();
        await editCasePage.clickSaveCase();
        expect(await utilityCommon.getAllPopupMsg()).toContain('Resolve the field validation errors and then try again.');
        await utilityCommon.closePopUpMessage();
        await editCasePage.setCaseSummary('pendingAC');
        await editCasePage.clickSaveCase();
        expect(await utilityCommon.getAllPopupMsg()).toContain('Saved successfully.');
    });

    //kgaikwad
    it('[DRDMV-1617]: [Case] Fields validation for case in Pending status', async () => {
        try {
            let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary('Summary ' + summary);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.setContactName('qtao');
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await updateStatusBladePo.changeCaseStatus(statusPending);
            await updateStatusBladePo.setStatusReason('Customer Response');
            await updateStatusBladePo.clickSaveStatus(statusPending);
            expect(await viewCasePage.getTextOfStatus()).toBe(statusPending);
            await viewCasePage.clickEditCaseButton();
            expect(await editCasePage.isSummaryRequiredText()).toBeTruthy('Required Text not displayed');
            expect(await editCasePage.isPriorityRequiredText()).toBeTruthy('Required Text not displayed');
            // * Optional fields are: Contact, Description, Category Tiers (1-3), Assignee.
            expect(await $(editCasePage.selectors.contact).isPresent()).toBeTruthy('Contact not present');
            expect(await $(editCasePage.selectors.descriptionLabel).isPresent()).toBeTruthy('Description not present');
            expect(await $(editCasePage.selectors.categoryTier1Drpbox).isPresent()).toBeTruthy('Categ1 not present');
            expect(await $(editCasePage.selectors.categoryTier2Drpbox).isPresent()).toBeTruthy('Categ2 not present');
            expect(await $(editCasePage.selectors.categoryTier3Drpbox).isPresent()).toBeTruthy('Categ3 not present');
            expect(await $(editCasePage.selectors.assigneee).isPresent()).toBeTruthy('Assignee not present');
            await editCasePage.clearCaseSummary();
            await editCasePage.clickSaveCase();
            expect(await utilityCommon.getAllPopupMsg()).toContain('Resolve the field validation errors and then try again.');
            await utilityCommon.closePopUpMessage();
            await editCasePage.setCaseSummary('pendingAC');
            await editCasePage.clickSaveCase();
            expect(await utilityCommon.getAllPopupMsg()).toContain('Saved successfully.');
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });//, 180 * 1000);

    //ankagraw
    it('[DRDMV-1199]: [Case Status] Case status change from In Progress', async () => {
        try {
            const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let summary1: string = randomStr + "Summary 1";
            let summary2: string = randomStr + "Summary 2";
            let summary3 = randomStr + "Summary 3";
            let manualTask = 'manual task' + randomStr;
            let manualSummary = 'manual' + randomStr;
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
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            await apiHelper.apiLogin('qkatawazi');
            let newCase1 = await apiHelper.createCase(caseData1);
            let caseId1: string = newCase1.displayId;
            let newCase2 = await apiHelper.createCase(caseData2);
            let caseId2: string = newCase2.displayId;
            let newCase3 = await apiHelper.createCase(caseData3);
            let caseId3: string = newCase3.displayId;
            let temp1 = await apiHelper.createManualTaskTemplate(templateData1);
            let statusOptions: string[] = ["In Progress", "Pending", "Resolved", "Canceled"];

            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(caseId1);
            await viewCasePage.clickOnStatus();
            expect(await updateStatusBladePo.allStatusOptionsPresent(statusOptions)).toBeTruthy("Status Options is not present");
            await updateStatusBladePo.clickCancelButton();
            await viewCasePage.clickAddTaskButton();
            await manageTask.addTaskFromTaskTemplate(manualTask);
            await manageTask.clickCloseButton();
            await updateStatusBladePo.changeCaseStatus('Pending');
            await updateStatusBladePo.setStatusReason('Third Party');
            await updateStatusBladePo.clickSaveStatus();
            await viewCasePage.clickAddTaskButton();
            await manageTask.clickTaskLink(manualSummary);
            expect(await viewTask.getTaskStatusValue()).toBe('Assigned', 'Assigned status not found');

            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(caseId2);
            await updateStatusBladePo.changeCaseStatus('Resolved');
            await updateStatusBladePo.setStatusReason('Auto Resolved');
            await updateStatusBladePo.clickSaveStatus();

            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(caseId3);
            await viewCasePage.clickAddTaskButton();
            await manageTask.addTaskFromTaskTemplate(manualTask);
            await manageTask.clickCloseButton();
            await updateStatusBladePo.changeCaseStatus('Canceled');
            await updateStatusBladePo.setStatusReason('Approval Rejected');
            await updateStatusBladePo.clickSaveStatus();
            await viewCasePage.openTaskCard(1);
            await manageTask.clickTaskLink(manualSummary);
            expect(await viewTask.getTaskStatusValue()).toBe('Canceled', 'canceled status not found');
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 500 * 1000);

    //apdeshmu
    it('[DRDMV-1196]: [Case Status] Case status change from Resolved', async () => {
        try {
            const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let summary1: string = randomStr + "Summary 1";
            let summary2: string = randomStr + "Summary 2";
            let summary3 = randomStr + "Summary 3";
            let summary4 = randomStr + "Summary 4";
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
            let newCase1 = await apiHelper.createCase(caseData1);
            let caseId1: string = newCase1.displayId;
            let newCase2 = await apiHelper.createCase(caseData2);
            let caseId2: string = newCase2.displayId;
            let newCase3 = await apiHelper.createCase(caseData3);
            let caseId3: string = newCase3.displayId;
            let newCase4 = await apiHelper.createCase(caseData4);
            let caseId4: string = newCase4.displayId;

            let statusOptions: string[] = ["Resolved", "Assigned", "In Progress", "Pending", "Closed"];
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(caseId4);
            await viewCasePage.clickOnStatus();
            expect(await updateStatusBladePo.allStatusOptionsPresent(statusOptions)).toBeTruthy("Status Options is not present");
            await updateStatusBladePo.clickCancelButton();
            await updateStatusBladePo.changeCaseStatus('Pending');
            await updateStatusBlade.isStatusReasonRequiredTextPresent();
            await updateStatusBladePo.setStatusReason('Third Party');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Pending');

            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(caseId2);
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('In Progress');

            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(caseId3);
            await updateStatusBladePo.changeCaseStatus('Assigned');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Assigned');

            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(caseId4);
            await updateStatusBladePo.changeCaseStatus('Closed');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Closed');
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 420 * 1000);

    //apdeshmu
    it('[DRDMV-1619]: [Case] Fields validation for case in Canceled status', async () => {
        try {
            const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let summary1: string = randomStr + "Summary 1";
            let summary2: string = randomStr + "Summary 2";
            let summary3 = randomStr + "Summary 3";
            let summary4 = randomStr + "Summary 4";
            let caseTemplateName1 = randomStr + "Petramco";
            let caseData1 =
            {
                "Requester": "qtao",
                "Summary": summary1,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 1",
                "Assignee": "qkatawazi",
                "Status": "New",
            }
            let caseData2 =
            {
                "Requester": "qtao",
                "Summary": summary2,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 1",
                "Assignee": "qkatawazi",
                "Status": "Assigned",
            }
            let caseData3 =
            {
                "Requester": "qtao",
                "Summary": summary3,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 1",
                "Assignee": "qkatawazi",
                "Status": "In Progress",
            }
            let caseData4 =
            {
                "Requester": "qtao",
                "Summary": summary4,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 1",
                "Assignee": "qkatawazi",
                "Status": "Pending",
            }
            let templateData1 = {
                "templateName": caseTemplateName1,
                "templateSummary": caseTemplateName1,
                "templateStatus": "Active",
                "company": "Petramco",
                "ownerCompany": "Petramco",
                "categoryTier1": "Purchasing Card",
                "categoryTier2": "Policies",
                "categoryTier3": "Card Issuance",
                "casePriority": "Low",
                "caseStatus": "New",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
            }
            await apiHelper.apiLogin('qkatawazi');
            let newCase1 = await apiHelper.createCase(caseData1);
            let caseId1: string = newCase1.displayId;
            let newCase2 = await apiHelper.createCase(caseData2);
            let caseId2: string = newCase2.displayId;
            let newCase3 = await apiHelper.createCase(caseData3);
            let caseId3: string = newCase3.displayId;
            let newCase4 = await apiHelper.createCase(caseData4);
            let caseId4: string = newCase4.displayId;
            await apiHelper.createCaseTemplate(templateData1);
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName("adam");
            await quickCasePo.selectCaseTemplate(caseTemplateName1);
            await quickCasePo.saveCase();
            await previewCasePo.clickGoToCaseButton();
            await updateStatusBladePo.changeCaseStatus('Canceled');
            await updateStatusBladePo.setStatusReason('Approval Rejected');
            await updateStatusBladePo.clickSaveStatus();
            await viewCasePage.clickEditCaseButton();
            await editCasePage.setCaseSummary(summary1);
            await expect(editCasePage.isSaveCaseEnable()).toBeFalsy("Save button Visible");
            await editCasePage.clickOnCancelCaseButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
           
            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(caseId1);
            await viewCasePage.clickEditCaseButton();
            expect(await editCasePage.isSummaryRequiredText()).toBeTruthy("Summary Required text not present");
            expect(await editCasePage.isPriorityRequiredText()).toBeTruthy("Priority Required text not present");
            expect(await editCasePage.isAssignedCompanyRequiredText()).toBeTruthy("Assigned Company Required text not present");
            expect(await editCasePage.isAssignedGroupRequiredText()).toBeTruthy("Assigned Group Required text not present");
            await editCasePage.setCaseSummary(summary1);
            await editCasePage.clickSaveCase();
            await updateStatusBladePo.changeCaseStatus('Canceled');
            await updateStatusBladePo.setStatusReason('Approval Rejected');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Canceled');

            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(caseId2);
            await viewCasePage.clickEditCaseButton();
            expect(await editCasePage.isSummaryRequiredText()).toBeTruthy("Summary Required text not present");
            expect(await editCasePage.isPriorityRequiredText()).toBeTruthy("Priority Required text not present");
            expect(await editCasePage.isAssignedCompanyRequiredText()).toBeTruthy("Assigned Company Required text not present");
            expect(await editCasePage.isAssignedGroupRequiredText()).toBeTruthy("Assigned Group Required text not present");
            await editCasePage.setCaseSummary(summary2);
            await editCasePage.clickSaveCase();
            await updateStatusBladePo.changeCaseStatus('Canceled');
            await updateStatusBladePo.setStatusReason('Approval Rejected');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Canceled');

            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(caseId3);
            await viewCasePage.clickEditCaseButton();
            expect(await editCasePage.isSummaryRequiredText()).toBeTruthy("Summary Required text not present");
            expect(await editCasePage.isPriorityRequiredText()).toBeTruthy("Priority Required text not present");
            expect(await editCasePage.isAssignedCompanyRequiredText()).toBeTruthy("Assigned Company Required text not present");
            expect(await editCasePage.isAssignedGroupRequiredText()).toBeTruthy("Assigned Group Required text not present");
            await editCasePage.clickOnAssignToMe();
            await editCasePage.setCaseSummary(summary3);
            await editCasePage.clickSaveCase();
            await updateStatusBladePo.changeCaseStatus('Canceled');
            await updateStatusBladePo.setStatusReason('Approval Rejected');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Canceled');
           
            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(caseId4);
            await viewCasePage.clickEditCaseButton();
            expect(await editCasePage.isSummaryRequiredText()).toBeTruthy("Summary Required text not present");
            expect(await editCasePage.isPriorityRequiredText()).toBeTruthy("Priority Required text not present");
            expect(await editCasePage.isAssignedCompanyRequiredText()).toBeTruthy("Assigned Company Required text not present");
            expect(await editCasePage.isAssignedGroupRequiredText()).toBeTruthy("Assigned Group Required text not present");
            await editCasePage.clickOnAssignToMe();
            await editCasePage.setCaseSummary(summary4);
            await editCasePage.clickSaveCase();
            await updateStatusBladePo.changeCaseStatus('Canceled');
            await updateStatusBladePo.setStatusReason('Approval Rejected');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Canceled');
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 680 * 1000);

    //apdeshmu
    it('[DRDMV-1200]: [Case Status] Case status change from Pending', async () => {
        try {
            const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let summary1: string = randomStr + "Summary 1";
            let summary2: string = randomStr + "Summary 2";
            let summary3 = randomStr + "Summary 3";
            let summary4 = randomStr + "Summary 4";
            let summary5 = randomStr + "Summary 5";
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
            let newCase1 = await apiHelper.createCase(caseData1);
            let caseId1: string = newCase1.displayId;
            let newCase2 = await apiHelper.createCase(caseData2);
            let caseId2: string = newCase2.displayId;
            let newCase3 = await apiHelper.createCase(caseData3);
            let caseId3: string = newCase3.displayId;
            let newCase4 = await apiHelper.createCase(caseData4);
            let caseId4: string = newCase4.displayId;
            let newCase5 = await apiHelper.createCase(caseData5);
            let caseId5: string = newCase5.displayId;
            let statusOptions: string[] = ["Pending", "Assigned", "In Progress", "Resolved", "Canceled", "Closed", "Approval Rejected"];
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(caseId1);
            await viewCasePage.clickOnStatus();
            expect(await updateStatusBladePo.allStatusOptionsPresent(statusOptions)).toBeTruthy("Status Options is not present");
            await updateStatusBladePo.clickCancelButton();
            await browser.refresh();
            await updateStatusBladePo.changeCaseStatus('Resolved');
            await updateStatusBlade.isStatusReasonRequiredTextPresent();
            await updateStatusBladePo.setStatusReason('Auto Resolved');
            await updateStatusBladePo.clickSaveStatus();
            await expect(await viewCasePage.getTextOfStatus()).toBe('Resolved');
            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(caseId2);
            await viewCasePage.clickEditCaseButton();
            await editCasePage.clickOnAssignToMe();
            await editCasePage.clickSaveCase();
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            await expect(await viewCasePage.getTextOfStatus()).toBe('In Progress');
            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(caseId3);
            await updateStatusBladePo.changeCaseStatus('Assigned');
            await updateStatusBladePo.clickSaveStatus();
            await expect(await viewCasePage.getTextOfStatus()).toBe('Assigned');
            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(caseId4);
            await updateStatusBladePo.changeCaseStatus('Closed');
            await updateStatusBladePo.clickSaveStatus();
            await expect(await viewCasePage.getTextOfStatus()).toBe('Closed');
            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(caseId5);
            await updateStatusBladePo.changeCaseStatus('Canceled');
            await updateStatusBlade.isStatusReasonRequiredTextPresent();
            await updateStatusBladePo.setStatusReason('Customer Canceled');
            await updateStatusBladePo.clickSaveStatus();
            await expect(await viewCasePage.getTextOfStatus()).toBe('Canceled');
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 540 * 1000);

    //apdeshmu
    it('[DRDMV-4680]: [Status Blade] Case Status Blade view', async () => {
        try {
            const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let summary1: string = randomStr + "Summary 1";
            let summary2: string = randomStr + "Summary 2";
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
            let newCase1 = await apiHelper.createCase(caseData1);
            let caseId1: string = newCase1.displayId;
            let newCase2 = await apiHelper.createCase(caseData2);
            let caseId2: string = newCase2.displayId;

            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(caseId1);
            await viewCasePage.clickOnStatus();
            await updateStatusBlade.isChangeStatusFieldPresent();
            await updateStatusBlade.isCancelUpdateStatusButtonPresent();
            await updateStatusBlade.isStatusReasonFieldPresent();
            expect(await updateStatusBlade.isSaveUpdateStatusButtonPresent()).toBeFalsy("Save Button is enabled");
            await updateStatusBladePo.clickCancelButton();
            await updateStatusBladePo.changeCaseStatus('Resolved');
            await updateStatusBlade.isStatusReasonRequiredTextPresent();
            await updateStatusBladePo.setStatusReason('Auto Resolved');
            expect(await updateStatusBlade.isSaveUpdateStatusButtonPresent()).toBeTruthy("Save Button is enabled");
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Resolved');
            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(caseId2);
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 380 * 1000);
});