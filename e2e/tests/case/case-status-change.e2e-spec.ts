import { $, browser } from "protractor";
import apiHelper from '../../api/api.helper';
import caseConsole from '../../pageobject/case/case-console.po';
import createCasePage from '../../pageobject/case/create-case.po';
import editCasePage from '../../pageobject/case/edit-case.po';
import viewCasePage from "../../pageobject/case/view-case.po";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import manageTask from "../../pageobject/task/manage-task-blade.po";
import viewTask from "../../pageobject/task/view-task.po";
import utilCommon from '../../utils/util.common';
import quickCasePo from '../../pageobject/case/quick-case.po';
import updateStatusBlade from '../../pageobject/common/update.status.blade.po';


describe('Case Status Change', () => {
    let statusNew: string = "New";
    let statusInProgress: string = "In Progress";
    let statusAssigned: string = "Assigned";
    let statusPending: string = "Pending";
    let statusCanceled: string = "Canceled";
    let statusResolved: string = "Resolved";
    let statusClosed: string = "Closed";

    beforeAll(async () => {
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    afterEach(async () => {
        await browser.refresh();
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
        let boln: boolean = await viewCasePage.allStatusOptionsPresent(statuses);
        expect(boln).toBeTruthy('Status does not match On view case');
        await viewCasePage.clickOnCancelButtonOfUpdateStatus();
        expect(await viewCasePage.getTextOfStatus()).toBe(statusNew);
        await navigationPage.gotoCaseConsole();
        await caseConsole.searchCase(caseId1);
        expect(await caseConsole.isCaseIdPresent(caseId1)).toBeTruthy("CaseID not matching");
        expect(await caseConsole.isCasePriorityPresent(priority)).toBeTruthy("Priority not matching");
        expect(await caseConsole.isCaseStatusPresent(statusNew)).toBeTruthy("Status New not matching");
        expect(await caseConsole.isCaseSummaryPresent(summary)).toBeTruthy("Summary not matching");
        await caseConsole.searchAndOpenCase(caseId1);
        // Select Assigned status and save.
        await viewCasePage.changeCaseStatus(statusAssigned);
        await viewCasePage.clickSaveStatus(statusAssigned);
        expect(await viewCasePage.getTextOfStatus()).toBe(statusAssigned);
        await navigationPage.gotoCaseConsole();
        await caseConsole.searchCase(caseId1);
        expect(await caseConsole.isCaseIdPresent(caseId1)).toBeTruthy("CaseID not matching");
        expect(await caseConsole.isCasePriorityPresent(priority)).toBeTruthy("Priority not matching");
        expect(await caseConsole.isCaseStatusPresent(statusAssigned)).toBeTruthy("Status Assigned not matching");
        expect(await caseConsole.isCaseSummaryPresent(summary)).toBeTruthy("Summary not matching");
        console.log('Assigned status success');
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
        await viewCasePage.changeCaseStatus(statusCanceled);
        let cancelStatusReasons: string[] = [' ', 'Approval Rejected', 'Customer Canceled'];
        expect(await viewCasePage.allStatusReasonOptionsPresent(cancelStatusReasons)).toBeTruthy('Cancel status reason options mismatch');
        await viewCasePage.setStatusReason('Customer Canceled');
        await viewCasePage.clickSaveStatus(statusCanceled);
        expect(await viewCasePage.getTextOfStatus()).toBe(statusCanceled), 'Status should be New to Cancelled';

        await navigationPage.gotoCaseConsole();
        await caseConsole.searchCase(caseId2);
        expect(await caseConsole.isCaseIdPresent(caseId2)).toBeTruthy("CaseID not matching");
        expect(await caseConsole.isCasePriorityPresent(priority)).toBeTruthy("Priority not matching");
        expect(await caseConsole.isCaseStatusPresent(statusCanceled)).toBeTruthy("Status Cancelled not matching");
        expect(await caseConsole.isCaseSummaryPresent(summary)).toBeTruthy("Summary not matching");
        console.log('Canceled status success');
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
        await viewCasePage.changeCaseStatus(statusPending);
        let pendingStatusReasons: string[] = [' ', 'Approval', 'Customer Response', 'Error', 'Required Fields Are Missing', 'Third Party'];
        expect(await viewCasePage.allStatusReasonOptionsPresent(pendingStatusReasons)).toBeTruthy('Pending status reason options mismatch');
        await viewCasePage.setStatusReason('Approval');
        await viewCasePage.clickSaveStatus();
        expect(await utilCommon.getPopUpMessage()).toBe('ERROR (10000): Case status updated to Pending for Approval only when approval is initiated. You cannot manually select this status.');
//        await utilCommon.closePopUpMessage();
        await viewCasePage.setStatusReason('Customer Response');
        await viewCasePage.clickSaveStatus(statusPending);
        expect(await viewCasePage.getTextOfStatus()).toBe(statusPending), 'status should be new of Pending';
        await navigationPage.gotoCaseConsole();
        await caseConsole.searchCase(caseId3);
        expect(await caseConsole.isCaseIdPresent(caseId3)).toBeTruthy("CaseID not matching");
        expect(await caseConsole.isCasePriorityPresent(priority)).toBeTruthy("Priority not matching");
        expect(await caseConsole.isCaseStatusPresent(statusPending)).toBeTruthy("Status Pending not matching");
        expect(await caseConsole.isCaseSummaryPresent(summary)).toBeTruthy("Summary not matching");
    }, 240 * 1000);

    //kgaikwad
    it('[DRDMV-1618]: [Case] Fields validation for case in Resolved status', async () => {
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.setContactName('qtao');
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        console.log(await viewCasePage.getCaseID());
        expect(await viewCasePage.getTextOfStatus()).toBe(statusAssigned);
        await viewCasePage.changeCaseStatus(statusResolved);
        await viewCasePage.setStatusReason('Auto Resolved');
        await viewCasePage.clickSaveStatus(statusResolved);
        expect(await viewCasePage.getTextOfStatus()).toBe(statusResolved);
        await viewCasePage.clickEditCaseButton();
        expect(await editCasePage.isSummaryRequiredText()).toBeTruthy('Required Text not displayed');
        expect(await editCasePage.isPriorityRequiredText()).toBeTruthy('Required Text not displayed');
        // * Optional fields are: Contact, Description, Category Tiers (1-3), Assignee.
        expect(await $(editCasePage.selectors.contact).isPresent()).toBeTruthy('Contact not present');
        expect(await $(editCasePage.selectors.caseDescription).isPresent()).toBeTruthy('Description not present');
        expect(await $(editCasePage.selectors.categoryTier1Drpbox).isPresent()).toBeTruthy('Categ1 not present');
        expect(await $(editCasePage.selectors.categoryTier2Drpbox).isPresent()).toBeTruthy('Categ2 not present');
        expect(await $(editCasePage.selectors.categoryTier3Drpbox).isPresent()).toBeTruthy('Categ3 not present');
        expect(await $(editCasePage.selectors.assigneee).isPresent()).toBeTruthy('Description not present');
        await editCasePage.clearCaseSummary();
        await editCasePage.clickSaveCase();
        expect(await utilCommon.getPopUpMessage()).toBe('Resolve the field validation errors and then try again.');
//        await utilCommon.closePopUpMessage();
        await editCasePage.updateCaseSummary('Pending AC');
        await editCasePage.clickSaveCase();
        expect(await utilCommon.getPopUpMessage()).toBe('Saved successfully.');
    }, 180 * 1000);

    //kgaikwad
    it('[DRDMV-1197]: [Case Status] Case status change from Closed', async () => {
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.setContactName('qtao');
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        console.log(await viewCasePage.getCaseID());
        await viewCasePage.changeCaseStatus(statusResolved);
        await viewCasePage.setStatusReason('Customer Follow-Up Required');
        await viewCasePage.clickSaveStatus(statusResolved);
        expect(await viewCasePage.getTextOfStatus()).toBe(statusResolved);
        await viewCasePage.changeCaseStatus(statusClosed);
        await viewCasePage.clickSaveStatus(statusClosed);
        expect(await viewCasePage.getTextOfStatus()).toBe(statusClosed);
        await viewCasePage.clickOnStatus();
        expect(await $(updateStatusBlade.selectors.saveUpdateStatus).isPresent()).toBeFalsy('Update Statue blade is displayed');
    });

    //kgaikwad
    it('[DRDMV-1233]: [Case Status Reason] Status Reason change without status transition', async () => {
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.setContactName('qtao');
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        await viewCasePage.changeCaseStatus(statusPending);
        let pendingStatusReasons: string[] = [' ', 'Approval', 'Customer Response', 'Error', 'Required Fields Are Missing', 'Third Party'];
        expect(await viewCasePage.allStatusReasonOptionsPresent(pendingStatusReasons)).toBeTruthy('Pending status reason options mismatch');
        await viewCasePage.setStatusReason('Approval');
        await viewCasePage.clickSaveStatus();
        expect(await utilCommon.getPopUpMessage()).toBe('ERROR (10000): Case status updated to Pending for Approval only when approval is initiated. You cannot manually select this status.');
//        await utilCommon.closePopUpMessage();
        await viewCasePage.setStatusReason('Customer Response');
        await viewCasePage.clickSaveStatus(statusPending);
        expect(await viewCasePage.getTextOfStatus()).toBe(statusPending);
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.setContactName('qtao');
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        await viewCasePage.changeCaseStatus(statusResolved);
        let resolvedStatusReasons: string[] = [' ', 'Auto Resolved', 'Customer Follow-Up Required', 'No Further Action Required'];
        expect(await viewCasePage.allStatusReasonOptionsPresent(resolvedStatusReasons)).toBeTruthy('Resolved status reason options mismatch');
        await viewCasePage.setStatusReason('Auto Resolved');
        await viewCasePage.clickSaveStatus(statusResolved);
    });

    //kgaikwad
    it('[DRDMV-1616]: [Case] Fields validation for case In Progress status', async () => {
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.setContactName('qtao');
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        await viewCasePage.changeCaseStatus(statusInProgress);
        await viewCasePage.clickSaveStatus(statusInProgress);
        expect(await viewCasePage.getTextOfStatus()).toBe(statusInProgress);
        await viewCasePage.clickEditCaseButton();
        expect(await editCasePage.isSummaryRequiredText()).toBeTruthy('Required Text not displayed');
        expect(await editCasePage.isPriorityRequiredText()).toBeTruthy('Required Text not displayed');
        expect(await $(editCasePage.selectors.contact).isPresent()).toBeTruthy('Contact not present');
        expect(await $(editCasePage.selectors.caseDescription).isPresent()).toBeTruthy('Description not present');
        expect(await $(editCasePage.selectors.categoryTier1Drpbox).isPresent()).toBeTruthy('Categ1 not present');
        expect(await $(editCasePage.selectors.categoryTier2Drpbox).isPresent()).toBeTruthy('Categ2 not present');
        expect(await $(editCasePage.selectors.categoryTier3Drpbox).isPresent()).toBeTruthy('Categ3 not present');
        expect(await $(editCasePage.selectors.assigneee).isPresent()).toBeTruthy('Assignee not present');
        await editCasePage.clearCaseSummary();
        await editCasePage.clickSaveCase();
        expect(await utilCommon.getPopUpMessage()).toBe('Resolve the field validation errors and then try again.');
//        await utilCommon.closePopUpMessage();
        await editCasePage.updateCaseSummary('pendingAC');
        await editCasePage.clickSaveCase();
        expect(await utilCommon.getPopUpMessage()).toBe('Saved successfully.');
        
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await createCasePage.setContactName('qtao');
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        await viewCasePage.changeCaseStatus(statusInProgress);
        expect(await viewCasePage.getErrorMsgOfInprogressStatus()).toBe('Assignee is required for this case status.  Please select an assignee. ');
        await viewCasePage.clickOnCancelButtonOfUpdateStatus();
        await utilCommon.clickOnWarningOk();
        expect(await viewCasePage.getTextOfStatus()).toBe(statusNew);

        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await createCasePage.setContactName('qtao');
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        await viewCasePage.changeCaseStatus(statusAssigned);
        await viewCasePage.clickSaveStatus(statusAssigned);
        expect(await viewCasePage.getTextOfStatus()).toBe(statusAssigned);
        await viewCasePage.changeCaseStatus(statusInProgress);
        expect(await viewCasePage.getErrorMsgOfInprogressStatus()).toBe('Assignee is required for this case status.  Please select an assignee. ');
        await viewCasePage.clickOnCancelButtonOfUpdateStatus();
        await utilCommon.clickOnWarningOk();
        expect(await viewCasePage.getTextOfStatus()).toBe(statusAssigned);

        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await createCasePage.setContactName('qtao');
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        await viewCasePage.changeCaseStatus(statusPending);
        await viewCasePage.setStatusReason('Customer Response');
        await viewCasePage.clickSaveStatus(statusPending);
        expect(await viewCasePage.getTextOfStatus()).toBe(statusPending);
        await viewCasePage.changeCaseStatus(statusInProgress);
        expect(await viewCasePage.getErrorMsgOfInprogressStatus()).toBe('Assignee is required for this case status.  Please select an assignee. ');
    }, 180 * 1000);

    //kgaikwad
    it('[DRDMV-1227]: [Case Status] Case status change from Canceled', async () => {
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.setContactName('qtao');
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        console.log(await viewCasePage.getCaseID());
        await viewCasePage.changeCaseStatus(statusCanceled);
        await viewCasePage.setStatusReason('Approval Rejected');
        await viewCasePage.clickSaveStatus(statusCanceled);
        expect(await viewCasePage.getTextOfStatus()).toBe(statusCanceled);
        await viewCasePage.clickOnStatus();
        expect(await $(updateStatusBlade.selectors.saveUpdateStatus).isPresent()).toBeFalsy('Update Statue blade is displayed');
    });

    //kgaikwad
    it('[DRDMV-1615]: [Case] Fields validation for case in Assigned status', async () => {
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.setContactName('qtao');
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        console.log(await viewCasePage.getCaseID());
        expect(await viewCasePage.getTextOfStatus()).toBe(statusAssigned);
        await viewCasePage.clickEditCaseButton();
        expect(await editCasePage.isSummaryRequiredText()).toBeTruthy('Required Text not displayed');
        expect(await editCasePage.isPriorityRequiredText()).toBeTruthy('Required Text not displayed');
        // * Optional fields are: Contact, Description, Category Tiers (1-3), Assignee.
        expect(await $(editCasePage.selectors.contact).isPresent()).toBeTruthy('Contact not present');
        expect(await $(editCasePage.selectors.caseDescription).isPresent()).toBeTruthy('Description not present');
        expect(await $(editCasePage.selectors.categoryTier1Drpbox).isPresent()).toBeTruthy('Categ1 not present');
        expect(await $(editCasePage.selectors.categoryTier2Drpbox).isPresent()).toBeTruthy('Categ2 not present');
        expect(await $(editCasePage.selectors.categoryTier3Drpbox).isPresent()).toBeTruthy('Categ3 not present');
        expect(await $(editCasePage.selectors.assigneee).isPresent()).toBeTruthy('Description not present');
        await editCasePage.clearCaseSummary();
        await editCasePage.clickSaveCase();
        expect(await utilCommon.getPopUpMessage()).toBe('Resolve the field validation errors and then try again.');
//        await utilCommon.closePopUpMessage();
        await editCasePage.updateCaseSummary('pendingAC');
        await editCasePage.clickSaveCase();
        expect(await utilCommon.getPopUpMessage()).toBe('Saved successfully.');
    });

    //kgaikwad
    it('[DRDMV-1617]: [Case] Fields validation for case in Pending status', async () => {
        try{
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.setContactName('qtao');
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        console.log(await viewCasePage.getCaseID());
        await viewCasePage.changeCaseStatus(statusPending);
        await viewCasePage.setStatusReason('Customer Response');
        await viewCasePage.clickSaveStatus(statusPending);
        expect(await viewCasePage.getTextOfStatus()).toBe(statusPending);
        await viewCasePage.clickEditCaseButton();
        expect(await editCasePage.isSummaryRequiredText()).toBeTruthy('Required Text not displayed');
        expect(await editCasePage.isPriorityRequiredText()).toBeTruthy('Required Text not displayed');
        // * Optional fields are: Contact, Description, Category Tiers (1-3), Assignee.
        expect(await $(editCasePage.selectors.contact).isPresent()).toBeTruthy('Contact not present');
        expect(await $(editCasePage.selectors.caseDescription).isPresent()).toBeTruthy('Description not present');
        expect(await $(editCasePage.selectors.categoryTier1Drpbox).isPresent()).toBeTruthy('Categ1 not present');
        expect(await $(editCasePage.selectors.categoryTier2Drpbox).isPresent()).toBeTruthy('Categ2 not present');
        expect(await $(editCasePage.selectors.categoryTier3Drpbox).isPresent()).toBeTruthy('Categ3 not present');
        expect(await $(editCasePage.selectors.assigneee).isPresent()).toBeTruthy('Assignee not present');
        await editCasePage.clearCaseSummary();
        await editCasePage.clickSaveCase();
        expect(await utilCommon.getPopUpMessage()).toBe('Resolve the field validation errors and then try again.');
//        await utilCommon.closePopUpMessage();
        await editCasePage.updateCaseSummary('pendingAC');
        await editCasePage.clickSaveCase();
        expect(await utilCommon.getPopUpMessage()).toBe('Saved successfully.');
    } catch (e) {
        throw e;
    } finally {
        await navigationPage.signOut();
        await loginPage.login('qkatawazi');
    }
    }, 140 * 1000);

    //ankagraw
    it('[DRDMV-1199]: [Case Status] Case status change from In Progress', async () => {
        try {
            await navigationPage.signOut();
            await loginPage.login('qtao');
            const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let summary1: string = randomStr + "Summary 1";
            let summary2: string = randomStr + "Summary 2";
            let summary3 = randomStr + "Summary 3";
            let manualTask = 'manual task' + randomStr;
            let manualSummary = 'manual Summary' + randomStr;
            let caseData1 =
            {
                "Requester": "qtao",
                "Summary": summary1,
                "Support Group": "Compensation and Benefits",
                "Assignee": "qkatawazi",
                "Status": "3000",
            }

            let caseData2 =
            {
                "Requester": "qtao",
                "Summary": summary2,
                "Support Group": "Compensation and Benefits",
                "Assignee": "qkatawazi",
                "Status": "3000",
            }

            let caseData3 =
            {
                "Requester": "qtao",
                "Summary": summary3,
                "Support Group": "Compensation and Benefits",
                "Assignee": "qkatawazi",
                "Status": "3000",
            }

            let templateData1 = {
                "templateName": manualTask,
                "templateSummary": manualSummary,
                "templateStatus": "Active",
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
            expect(await viewCasePage.allStatusOptionsPresent(statusOptions)).toBeTruthy("Status Options is not present");
            await viewCasePage.clickOnCancelButtonOfUpdateStatus();
            await viewCasePage.clickAddTaskButton();
            await manageTask.addTaskFromTaskTemplate(manualTask);
            await manageTask.clickOnCloseButton();
            await viewCasePage.changeCaseStatus('Pending');
            await viewCasePage.setStatusReason('Third Party');
            await viewCasePage.clickSaveStatus();
            await viewCasePage.clickAddTaskButton();
            await manageTask.clickTaskLinkOnManageTask(manualSummary);
            expect(await viewTask.getTaskStatusValue()).toBe('Assigned', 'Assigned status not found');

            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(caseId2);
            await viewCasePage.changeCaseStatus('Resolved');
            await viewCasePage.setStatusReason('Auto Resolved');
            await viewCasePage.clickSaveStatus();

            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(caseId3);
            await viewCasePage.clickAddTaskButton();
            await manageTask.addTaskFromTaskTemplate(manualTask);
            await manageTask.clickOnCloseButton();
            await viewCasePage.changeCaseStatus('Canceled');
            await viewCasePage.setStatusReason('Approval Rejected');
            await viewCasePage.clickSaveStatus();
            await viewCasePage.openTaskCard(1);
            await manageTask.clickTaskLinkOnManageTask(manualSummary);
            expect(await viewTask.getTaskStatusValue()).toBe('Canceled', 'canceled status not found');
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 160 * 1000);
  
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
                "Support Group": "Compensation and Benefits",
                "Assignee": "qkatawazi",
                "Status": "Resolved",
            }
            let caseData2 =
            {
                "Requester": "qtao",
                "Summary": summary2,
                "Support Group": "Compensation and Benefits",
                "Assignee": "qkatawazi",
                "Status": "Resolved",
            }
            let caseData3 =
            {
                "Requester": "qtao",
                "Summary": summary3,
                "Support Group": "Compensation and Benefits",
                "Assignee": "qkatawazi",
                "Status": "Resolved",
            }
            let caseData4 =
            {
                "Requester": "qtao",
                "Summary": summary4,
                "Support Group": "Compensation and Benefits",
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
  
            let statusOptions: string[] = ["Resolved","Assigned","In Progress", "Pending","Closed"];
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(caseId4);
            await viewCasePage.clickOnStatus();
            expect(await viewCasePage.allStatusOptionsPresent(statusOptions)).toBeTruthy("Status Options is not present");
            await viewCasePage.clickOnCancelButtonOfUpdateStatus();
            await viewCasePage.changeCaseStatus('Pending');
            await updateStatusBlade.isStatusReasonRequiredTextPresent();
            await viewCasePage.setStatusReason('Third Party');
            await viewCasePage.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Pending');

            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(caseId2);
            await viewCasePage.changeCaseStatus('In Progress');
            await viewCasePage.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('In Progress');

            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(caseId3);
            await viewCasePage.changeCaseStatus('Assigned');
            await viewCasePage.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Assigned');

            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(caseId4);
            await viewCasePage.changeCaseStatus('Closed');
            await viewCasePage.clickSaveStatus();
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
            let caseTemplateName1 = randomStr + "DRDMV1087Petramco4";
            let caseData1 =
            {
                "Requester": "qtao",
                "Summary": summary1,
                "Support Group": "Compensation and Benefits",
                "Assignee": "qkatawazi",
                "Status": "New",
            }
            let caseData2 =
            {
                "Requester": "qtao",
                "Summary": summary2,
                "Support Group": "Compensation and Benefits",
                "Assignee": "qkatawazi",
                "Status": "Assigned",
            }
            let caseData3 =
            {
                "Requester": "qtao",
                "Summary": summary3,
                "Support Group": "Compensation and Benefits",
                "Assignee": "qkatawazi",
                "Status": "In Progress",
            }
            let caseData4 =
            {
                "Requester": "qtao",
                "Summary": summary4,
                "Support Group": "Compensation and Benefits",
                "Assignee": "qkatawazi",
                "Status": "Pending",
            }
            let templateData1 = {
                "templateName": caseTemplateName1,
                "templateSummary": caseTemplateName1,
                "categoryTier1": "Purchasing Card",
                "categoryTier2": "Policies",
                "categoryTier3": "Card Issuance",
                "casePriority": "Low",
                "templateStatus": "Active",
                "company": "Petramco",
                "caseStatus": "New"
            }
            await apiHelper.apiLogin('qkatawazi');
            let newCase1 = await apiHelper.createCase(caseData1);
            let caseId1: string = newCase1.displayId;
            let newCase2 = await apiHelper.createCase(caseData2);
            let caseId2: string = newCase2.displayId;
            let newCase3 = await apiHelper.createCase(caseData3);
            let caseId3: string = newCase3.displayId;
            let newCase4 = await apiHelper.createCase(caseData4);
            let caseId4: string = newCase3.displayId;
            await apiHelper.createCaseTemplate(templateData1);
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName("adam");
            await quickCasePo.selectCaseTemplate(caseTemplateName1);
            await quickCasePo.saveCase();
            await createCasePage.clickGoToCaseButton();
            await viewCasePage.changeCaseStatus('Canceled');
            await viewCasePage.setStatusReason('Approval Rejected');
            await viewCasePage.clickSaveStatus();   
            await viewCasePage.clickEditCaseButton();
            await editCasePage.updateCaseSummary(summary1);
            await expect(editCasePage.isSaveCaseEnable()).toBeFalsy("Save button Visible");
         
            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(caseId1);
            await viewCasePage.clickEditCaseButton();
            expect(await editCasePage.isSummaryRequiredText()).toBeTruthy("Summary Required text not present");
            expect(await editCasePage.isPriorityRequiredText()).toBeTruthy("Priority Required text not present");
            expect(await editCasePage.isAssignedCompanyRequiredText()).toBeTruthy("Assigned Company Required text not present");
            expect(await editCasePage.isAssignedGroupRequiredText()).toBeTruthy("Assigned Group Required text not present");
            await editCasePage.updateCaseSummary(summary1);
            await editCasePage.clickSaveCase();
            await viewCasePage.changeCaseStatus('Canceled');
            await viewCasePage.setStatusReason('Approval Rejected');
            await viewCasePage.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Canceled');
        
            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(caseId2);
            await viewCasePage.clickEditCaseButton();
            expect(await editCasePage.isSummaryRequiredText()).toBeTruthy("Summary Required text not present");
            expect(await editCasePage.isPriorityRequiredText()).toBeTruthy("Priority Required text not present");
            expect(await editCasePage.isAssignedCompanyRequiredText()).toBeTruthy("Assigned Company Required text not present");
            expect(await editCasePage.isAssignedGroupRequiredText()).toBeTruthy("Assigned Group Required text not present");
            await editCasePage.updateCaseSummary(summary2);
            await editCasePage.clickSaveCase();
            await viewCasePage.changeCaseStatus('Canceled');
            await viewCasePage.setStatusReason('Approval Rejected');
            await viewCasePage.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Canceled');
        
            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(caseId3);
            await viewCasePage.clickEditCaseButton();
            expect(await editCasePage.isSummaryRequiredText()).toBeTruthy("Summary Required text not present");
            expect(await editCasePage.isPriorityRequiredText()).toBeTruthy("Priority Required text not present");
            expect(await editCasePage.isAssignedCompanyRequiredText()).toBeTruthy("Assigned Company Required text not present");
            expect(await editCasePage.isAssignedGroupRequiredText()).toBeTruthy("Assigned Group Required text not present");
            await editCasePage.updateCaseSummary(summary3);
            await editCasePage.clickSaveCase(); 
            await viewCasePage.changeCaseStatus('Canceled');
            await viewCasePage.setStatusReason('Approval Rejected');
            await viewCasePage.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Canceled');
        
            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(caseId4);
            await viewCasePage.clickEditCaseButton();
            expect(await editCasePage.isSummaryRequiredText()).toBeTruthy("Summary Required text not present");
            expect(await editCasePage.isPriorityRequiredText()).toBeTruthy("Priority Required text not present");
            expect(await editCasePage.isAssignedCompanyRequiredText()).toBeTruthy("Assigned Company Required text not present");
            expect(await editCasePage.isAssignedGroupRequiredText()).toBeTruthy("Assigned Group Required text not present");
            await editCasePage.updateCaseSummary(summary4);
            await editCasePage.clickSaveCase();
            await viewCasePage.changeCaseStatus('Canceled');
            await viewCasePage.setStatusReason('Approval Rejected');
            await viewCasePage.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Canceled');
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 380 * 1000);

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
                "Support Group": "Compensation and Benefits",
                "Assignee": "qkatawazi",
                "Status": "Pending",
            }
            let caseData2 =
            {
                "Requester": "qtao",
                "Summary": summary2,
                "Support Group": "Compensation and Benefits",
                "Assignee": "qkatawazi",
                "Status": "Pending",
            }
            let caseData3 =
            {
                "Requester": "qtao",
                "Summary": summary3,
                "Support Group": "Compensation and Benefits",
                "Assignee": "qkatawazi",
                "Status": "Pending",
            }
            let caseData4 =
            {
                "Requester": "qtao",
                "Summary": summary4,
                "Support Group": "Compensation and Benefits",
                "Assignee": "qkatawazi",
                "Status": "Pending",
            }
            let caseData5 =
            {
                "Requester": "qtao",
                "Summary": summary5,
                "Support Group": "Compensation and Benefits",
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
  
            let statusOptions: string[] = ["Assigned","In Progress", "Resolved","Canceled","Closed"];
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(caseId1);
            await viewCasePage.clickOnStatus();
            expect(await viewCasePage.allStatusOptionsPresent(statusOptions)).toBeTruthy("Status Options is not present");
            await viewCasePage.clickOnCancelButtonOfUpdateStatus();
            await viewCasePage.changeCaseStatus('Resolved');
            await updateStatusBlade.isStatusReasonRequiredTextPresent();
            await viewCasePage.setStatusReason('Auto Resolved');
            await viewCasePage.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Resolved');

            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(caseId2);
            await viewCasePage.clickEditCaseButton();
            await createCasePage.clickAssignToMeButton();
            await editCasePage.clickSaveCase();
            await viewCasePage.changeCaseStatus('In Progress');
            await viewCasePage.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('In Progress');

            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(caseId3);
            await viewCasePage.changeCaseStatus('Assigned');
            await viewCasePage.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Assigned');

            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(caseId4);
            await viewCasePage.changeCaseStatus('Closed');
            await viewCasePage.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Closed');

            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(caseId5);
            await viewCasePage.changeCaseStatus('Canceled');
            await updateStatusBlade.isStatusReasonRequiredTextPresent();
            await viewCasePage.setStatusReason('Customer Canceled');
            await viewCasePage.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Canceled');
       
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 420 * 1000);

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
                "Support Group": "Compensation and Benefits",
                "Assignee": "qkatawazi",
                "Status": "Pending",
            }
            let caseData2 =
            {
                "Requester": "qtao",
                "Summary": summary2,
                "Support Group": "Compensation and Benefits",
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
            await viewCasePage.changeCaseStatus('Resolved');
            await updateStatusBlade.isStatusReasonRequiredTextPresent();
            await viewCasePage.setStatusReason('Auto Resolved');
            expect(await updateStatusBlade.isSaveUpdateStatusButtonPresent()).toBeTruthy("Save Button is enabled");
            await viewCasePage.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Resolved');

            await navigationPage.gotoCaseConsole();
            await caseConsole.searchAndOpenCase(caseId2);
            await viewCasePage.clickOnStatus();
            await viewCasePage.changeCaseStatus('In Progress');
            await viewCasePage.clickOnCancelButtonOfUpdateStatus();
            expect(await utilCommon.getWarningDialogMsg()).toBe('You have unsaved data. Do you want to continue without saving?');          
            await utilCommon.clickOnWarningOk();
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    },280 * 1000);
});