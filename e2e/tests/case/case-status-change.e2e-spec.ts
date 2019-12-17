import { $, browser } from "protractor";
import { protractor } from 'protractor/built/ptor';
import apiHelper from '../../api/api.helper';
import caseConsole from '../../pageobject/case/case-console.po';
import createCasePage from '../../pageobject/case/create-case.po';
import editCasePage from '../../pageobject/case/edit-case.po';
import { default as caseViewPage, default as viewCasePo } from '../../pageobject/case/view-case.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import utilCommon from '../../utils/util.common';

describe('Case Status Change', () => {
    var statusNew: string = "New";
    var statusInProgress: string = "In Progress";
    var statusAssigned: string = "Assigned";
    var statusPending: string = "Pending";
    var statusCanceled: string = "Canceled";
    var statusResolved: string = "Resolved";
    var statusClosed: string = "Closed";

    beforeAll(async () => {
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    afterEach(async () => {
        await browser.refresh();
        await utilCommon.waitUntilSpinnerToHide();
    });

    //kgaikwad
    it('DRDMV-2530: [Case Status] Case status change from New', async () => {
        var priority: string = "Medium";
        var summary: string = "Test case for DRDMV-2530";
        var caseData =
        {
            "Requester": "qtao",
            "Summary": "Test case for DRDMV-2530",
        }
        await apiHelper.apiLogin('qkatawazi');
        var newCase1 = await apiHelper.createCase(caseData);
        var caseId1: string = newCase1.displayId;

        await caseConsole.searchAndOpenCase(caseId1);
        await viewCasePo.clickEditCaseButton();
        expect(await viewCasePo.isEditLinkDisplay()).toBeFalsy('edit link should not display');
        await editCasePage.clickOnCancelCaseButton();
        await viewCasePo.clickOnStatus();
        let statuses: string[] = ["New", "Assigned", "In Progress", "Pending", "Canceled"];
        var boln: boolean = await viewCasePo.isCaseStatusesDisplayed(statuses);
        expect(boln).toBeTruthy('Status does not match On view case');
        await viewCasePo.clickOnCancelButtonOfUpdateStatus();
        expect(await viewCasePo.getTextOfStatus()).toBe(statusNew);
        await navigationPage.gotoCaseConsole();
        await caseConsole.searchCase(caseId1);
        expect(await caseConsole.isCaseIdPresent(caseId1)).toBeTruthy("CaseID not matching");
        expect(await caseConsole.isCasePriorityPresent(priority)).toBeTruthy("Priority not matching");
        expect(await caseConsole.isCaseStatusPresent(statusNew)).toBeTruthy("Status New not matching");
        expect(await caseConsole.isCaseSummaryPresent(summary)).toBeTruthy("Summary not matching");
        await caseConsole.searchAndOpenCase(caseId1);
        // Select Assigned status and save.
        await viewCasePo.changeCaseStatus(statusAssigned);
        await viewCasePo.clickSaveStatus(statusAssigned);
        expect(await viewCasePo.getTextOfStatus()).toBe(statusAssigned);
        await navigationPage.gotoCaseConsole();
        await caseConsole.searchCase(caseId1);
        expect(await caseConsole.isCaseIdPresent(caseId1)).toBeTruthy("CaseID not matching");
        expect(await caseConsole.isCasePriorityPresent(priority)).toBeTruthy("Priority not matching");
        expect(await caseConsole.isCaseStatusPresent(statusAssigned)).toBeTruthy("Status Assigned not matching");
        expect(await caseConsole.isCaseSummaryPresent(summary)).toBeTruthy("Summary not matching");
        console.log('Assigned status success');
        // - Change status from New to Canceled.
        var newCase2 = await apiHelper.createCase(caseData);
        var caseId2: string = newCase2.displayId;
        await caseConsole.searchCase(caseId2);
        expect(await caseConsole.isCaseIdPresent(caseId2)).toBeTruthy("CaseID not matching");
        expect(await caseConsole.isCasePriorityPresent(priority)).toBeTruthy("Priority not matching");
        expect(await caseConsole.isCaseStatusPresent(statusNew)).toBeTruthy("Status New not matching");
        expect(await caseConsole.isCaseSummaryPresent(summary)).toBeTruthy("Summary not matching");
        await caseConsole.searchAndOpenCase(caseId2);
        expect(await viewCasePo.getTextOfStatus()).toBe(statusNew);
        await viewCasePo.changeCaseStatus(statusCanceled);
        let cancelStatusReasons: string[] = [' ', 'Approval Rejected', 'Customer Canceled'];
        expect(await viewCasePo.allStatusReasonOptionsPresent(cancelStatusReasons)).toBeTruthy('Cancel status reason options mismatch');
        await browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
        await viewCasePo.setStatusReason('Customer Canceled');
        await viewCasePo.clickSaveStatus(statusCanceled);
        expect(await viewCasePo.getTextOfStatus()).toBe(statusCanceled), 'Status should be New to Cancelled';

        await navigationPage.gotoCaseConsole();
        await caseConsole.searchCase(caseId2);
        expect(await caseConsole.isCaseIdPresent(caseId2)).toBeTruthy("CaseID not matching");
        expect(await caseConsole.isCasePriorityPresent(priority)).toBeTruthy("Priority not matching");
        expect(await caseConsole.isCaseStatusPresent(statusCanceled)).toBeTruthy("Status Cancelled not matching");
        expect(await caseConsole.isCaseSummaryPresent(summary)).toBeTruthy("Summary not matching");
        console.log('Canceled status success');
        // - Change status from New to Pending.
        var newCase3 = await apiHelper.createCase(caseData);
        var caseId3: string = newCase3.displayId;
        await caseConsole.searchCase(caseId3);
        expect(await caseConsole.isCaseIdPresent(caseId3)).toBeTruthy("CaseID not matching");
        expect(await caseConsole.isCasePriorityPresent(priority)).toBeTruthy("Priority not matching");
        expect(await caseConsole.isCaseStatusPresent(statusNew)).toBeTruthy("Status New not matching");
        expect(await caseConsole.isCaseSummaryPresent(summary)).toBeTruthy("Summary not matching");
        await caseConsole.searchAndOpenCase(caseId3);
        expect(await viewCasePo.getTextOfStatus()).toBe(statusNew), 'status should be new of status';
        await viewCasePo.changeCaseStatus(statusPending);
        let pendingStatusReasons: string[] = [' ', 'Approval', 'Customer Response', 'Error', 'Required Fields Are Missing', 'Third Party'];
        expect(await viewCasePo.allStatusReasonOptionsPresent(pendingStatusReasons)).toBeTruthy('Pending status reason options mismatch');
        await browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
        await viewCasePo.setStatusReason('Approval');
        await viewCasePo.clickSaveStatus();
        expect(await utilCommon.getPopUpMessage()).toBe('ERROR (10000): Case status updated to Pending for Approval only when approval is initiated. You cannot manually select this status.');
        await utilCommon.closePopUpMessage();
        await viewCasePo.setStatusReason('Customer Response');
        await viewCasePo.clickSaveStatus(statusPending);
        expect(await viewCasePo.getTextOfStatus()).toBe(statusPending), 'status should be new of Pending';
        await navigationPage.gotoCaseConsole();
        await caseConsole.searchCase(caseId3);
        expect(await caseConsole.isCaseIdPresent(caseId3)).toBeTruthy("CaseID not matching");
        expect(await caseConsole.isCasePriorityPresent(priority)).toBeTruthy("Priority not matching");
        expect(await caseConsole.isCaseStatusPresent(statusPending)).toBeTruthy("Status Pending not matching");
        expect(await caseConsole.isCaseSummaryPresent(summary)).toBeTruthy("Summary not matching");
        console.log('Pending status success');
    }, 330 * 1000);

    //kgaikwad
    it('DRDMV-1618: [Case] Fields validation for case in Resolved status', async () => {
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.setContactName('qtao');
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        console.log(await viewCasePo.getCaseID());
        await expect(viewCasePo.getTextOfStatus()).toBe(statusAssigned);
        await viewCasePo.changeCaseStatus(statusResolved);
        await viewCasePo.setStatusReason('Auto Resolved');
        await viewCasePo.clickSaveStatus(statusResolved);
        await expect(viewCasePo.getTextOfStatus()).toBe(statusResolved);
        await caseViewPage.clickEditCaseButton();
        await expect(editCasePage.isSummaryRequiredText()).toBeTruthy('Required Text not displayed');
        await expect(editCasePage.isPriorityRequiredText()).toBeTruthy('Required Text not displayed');
        // * Optional fields are: Contact, Description, Category Tiers (1-3), Assignee.
        expect(await $(editCasePage.selectors.contact).isPresent()).toBeTruthy('Contact not present');
        expect(await $(editCasePage.selectors.caseDescription).isPresent()).toBeTruthy('Description not present');
        expect(await $(editCasePage.selectors.categoryTier1Drpbox).isPresent()).toBeTruthy('Categ1 not present');
        expect(await $(editCasePage.selectors.categoryTier2Drpbox).isPresent()).toBeTruthy('Categ2 not present');
        expect(await $(editCasePage.selectors.categoryTier3Drpbox).isPresent()).toBeTruthy('Categ3 not present');
        expect(await $(editCasePage.selectors.assigneee).isPresent()).toBeTruthy('Description not present');
        await editCasePage.clearCaseSummary();
        await editCasePage.clickSaveCase();
        var str: string = await utilCommon.getPopUpMessage();
        await expect(str).toBe('Resolve the field validation errors and then try again.');
        await utilCommon.closePopUpMessage();
        await utilCommon.waitUntilSpinnerToHide();
        await editCasePage.updateCaseSummary('Pending AC');
        await editCasePage.clickSaveCase();
        await expect(await utilCommon.getPopUpMessage()).toBe('Saved successfully.');
    }, 180 * 1000);

    //kgaikwad
    it('DRDMV-1197: [Case Status] Case status change from Closed', async () => {
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.setContactName('qtao');
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        console.log(await viewCasePo.getCaseID());
        await caseViewPage.changeCaseStatus(statusResolved);
        await caseViewPage.setStatusReason('Customer Follow-Up Required');
        await caseViewPage.clickSaveStatus(statusResolved);
        await expect(await viewCasePo.getTextOfStatus()).toBe(statusResolved);
        await caseViewPage.changeCaseStatus(statusClosed);
        await caseViewPage.clickSaveStatus(statusClosed);
        await expect(await viewCasePo.getTextOfStatus()).toBe(statusClosed);
        await caseViewPage.clickOnStatus();
        expect(await $(viewCasePo.selectors.saveUpdateStatus).isPresent()).toBeFalsy('Update Statue blade is displayed');
    });

    //kgaikwad
    fit('DRDMV-1233: [Case Status Reason] Status Reason change without status transition', async () => {
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.setContactName('qtao');
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        await viewCasePo.changeCaseStatus(statusPending);
        let pendingStatusReasons: string[] = [' ', 'Approval', 'Customer Response', 'Error', 'Required Fields Are Missing', 'Third Party'];
        expect(await viewCasePo.allStatusReasonOptionsPresent(pendingStatusReasons)).toBeTruthy('Pending status reason options mismatch');
        await browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
        await viewCasePo.setStatusReason('Approval');
        await viewCasePo.clickSaveStatus();
        expect(await utilCommon.getPopUpMessage()).toBe('ERROR (10000): Case status updated to Pending for Approval only when approval is initiated. You cannot manually select this status.');
        await utilCommon.closePopUpMessage();
        await viewCasePo.setStatusReason('Customer Response');
        await viewCasePo.clickSaveStatus(statusPending);
        expect(await viewCasePo.getTextOfStatus()).toBe(statusPending);
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.setContactName('qtao');
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        await viewCasePo.changeCaseStatus(statusResolved);
        let resolvedStatusReasons: string[] = [' ', 'Auto Resolved', 'Customer Follow-Up Required', 'No Further Action Required'];
        expect(await viewCasePo.allStatusReasonOptionsPresent(resolvedStatusReasons)).toBeTruthy('Resolved status reason options mismatch');
        await browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
        await viewCasePo.setStatusReason('Auto Resolved');
        await viewCasePo.clickSaveStatus(statusResolved);
    });

    it('DRDMV-1616: [Case] Fields validation for case In Progress status', async () => {
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.setContactName('qtao');
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        console.log(await viewCasePo.getCaseID());
        await caseViewPage.changeCaseStatus(statusInProgress);
        await caseViewPage.clickSaveStatus(statusInProgress);
        expect(await viewCasePo.getTextOfStatus()).toBe(statusInProgress);
        await caseViewPage.clickEditCaseButton();
        await expect(editCasePage.isSummaryRequiredText()).toBeTruthy('Required Text not displayed');
        await expect(editCasePage.isPriorityRequiredText()).toBeTruthy('Required Text not displayed');
        expect(await $(editCasePage.selectors.contact).isPresent()).toBeTruthy('Contact not present');
        expect(await $(editCasePage.selectors.caseDescription).isPresent()).toBeTruthy('Description not present');
        expect(await $(editCasePage.selectors.categoryTier1Drpbox).isPresent()).toBeTruthy('Categ1 not present');
        expect(await $(editCasePage.selectors.categoryTier2Drpbox).isPresent()).toBeTruthy('Categ2 not present');
        expect(await $(editCasePage.selectors.categoryTier3Drpbox).isPresent()).toBeTruthy('Categ3 not present');
        expect(await $(editCasePage.selectors.assigneee).isPresent()).toBeTruthy('Assignee not present');
        await editCasePage.clearCaseSummary();
        await editCasePage.clickSaveCase();
        var str: string = await utilCommon.getPopUpMessage();
        await expect(str).toBe('Resolve the field validation errors and then try again.');
        await utilCommon.closePopUpMessage();
        await editCasePage.updateCaseSummary('pendingAC');
        await editCasePage.clickSaveCase();
        var str: string = await utilCommon.getPopUpMessage();
        await expect(str).toBe('Saved successfully.');
        await utilCommon.waitUntilPopUpDisappear();

        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await createCasePage.setContactName('qtao');
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        console.log(await viewCasePo.getCaseID());
        await caseViewPage.changeCaseStatus(statusInProgress);
        await expect(viewCasePo.getErrorMsgOfInprogressStatus()).toBe('Assignee is required for this case status.  Please select an assignee. ');
        await caseViewPage.clickOnCancelButtonOfUpdateStatus();
        await utilCommon.clickOnWarningOk();
        expect(await viewCasePo.getTextOfStatus()).toBe(statusNew);

        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await createCasePage.setContactName('qtao');
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        console.log(await viewCasePo.getCaseID());
        await caseViewPage.changeCaseStatus(statusAssigned);
        await caseViewPage.clickSaveStatus(statusAssigned);
        expect(await viewCasePo.getTextOfStatus()).toBe(statusAssigned);
        await caseViewPage.changeCaseStatus(statusInProgress);
        await expect(viewCasePo.getErrorMsgOfInprogressStatus()).toBe('Assignee is required for this case status.  Please select an assignee. ');
        await viewCasePo.clickOnCancelButtonOfUpdateStatus();
        await utilCommon.clickOnWarningOk();
        expect(await viewCasePo.getTextOfStatus()).toBe(statusAssigned);

        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await createCasePage.setContactName('qtao');
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        console.log(await viewCasePo.getCaseID());
        await caseViewPage.changeCaseStatus(statusPending);
        await caseViewPage.setStatusReason('Customer Response');
        await caseViewPage.clickSaveStatus(statusPending);
        expect(await viewCasePo.getTextOfStatus()).toBe(statusPending);
        await caseViewPage.changeCaseStatus(statusInProgress);
        await expect(viewCasePo.getErrorMsgOfInprogressStatus()).toBe('Assignee is required for this case status.  Please select an assignee. ');
    }, 120 * 1000);

    it('DRDMV-1227: [Case Status] Case status change from Canceled', async () => {
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.setContactName('qtao');
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        console.log(await viewCasePo.getCaseID());
        await caseViewPage.changeCaseStatus(statusCanceled);
        await caseViewPage.setStatusReason('Approval Rejected');
        await caseViewPage.clickSaveStatus(statusCanceled);
        await expect(await viewCasePo.getTextOfStatus()).toBe(statusCanceled);
        await caseViewPage.clickOnStatus();
        expect(await $(viewCasePo.selectors.saveUpdateStatus).isPresent()).toBeFalsy('Update Statue blade is displayed');
    });

    it('DRDMV-1615: [Case] Fields validation for case in Assigned status', async () => {
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.setContactName('qtao');
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        console.log(await viewCasePo.getCaseID());
        await expect(viewCasePo.getTextOfStatus()).toBe(statusAssigned);
        await caseViewPage.clickEditCaseButton();
        await expect(editCasePage.isSummaryRequiredText()).toBeTruthy('Required Text not displayed');
        await expect(editCasePage.isPriorityRequiredText()).toBeTruthy('Required Text not displayed');
        // * Optional fields are: Contact, Description, Category Tiers (1-3), Assignee.
        expect(await $(editCasePage.selectors.contact).isPresent()).toBeTruthy('Contact not present');
        expect(await $(editCasePage.selectors.caseDescription).isPresent()).toBeTruthy('Description not present');
        expect(await $(editCasePage.selectors.categoryTier1Drpbox).isPresent()).toBeTruthy('Categ1 not present');
        expect(await $(editCasePage.selectors.categoryTier2Drpbox).isPresent()).toBeTruthy('Categ2 not present');
        expect(await $(editCasePage.selectors.categoryTier3Drpbox).isPresent()).toBeTruthy('Categ3 not present');
        expect(await $(editCasePage.selectors.assigneee).isPresent()).toBeTruthy('Description not present');
        await editCasePage.clearCaseSummary();
        await editCasePage.clickSaveCase();
        var str: string = await utilCommon.getPopUpMessage();
        await expect(str).toBe('Resolve the field validation errors and then try again.');
        await utilCommon.closePopUpMessage();
        await editCasePage.updateCaseSummary('pendingAC');
        await editCasePage.clickSaveCase();
        var str: string = await utilCommon.getPopUpMessage();
        await expect(str).toBe('Saved successfully.');
    });

    it('DRDMV-1617: [Case] Fields validation for case in Pending status', async () => {
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.setContactName('qtao');
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        console.log(await viewCasePo.getCaseID());
        await caseViewPage.changeCaseStatus(statusPending);
        await caseViewPage.setStatusReason('Customer Response');
        await caseViewPage.clickSaveStatus(statusPending);
        await expect(await viewCasePo.getTextOfStatus()).toBe(statusPending);
        await caseViewPage.clickEditCaseButton();
        await expect(editCasePage.isSummaryRequiredText()).toBeTruthy('Required Text not displayed');
        await expect(editCasePage.isPriorityRequiredText()).toBeTruthy('Required Text not displayed');
        // * Optional fields are: Contact, Description, Category Tiers (1-3), Assignee.
        expect(await $(editCasePage.selectors.contact).isPresent()).toBeTruthy('Contact not present');
        expect(await $(editCasePage.selectors.caseDescription).isPresent()).toBeTruthy('Description not present');
        expect(await $(editCasePage.selectors.categoryTier1Drpbox).isPresent()).toBeTruthy('Categ1 not present');
        expect(await $(editCasePage.selectors.categoryTier2Drpbox).isPresent()).toBeTruthy('Categ2 not present');
        expect(await $(editCasePage.selectors.categoryTier3Drpbox).isPresent()).toBeTruthy('Categ3 not present');
        expect(await $(editCasePage.selectors.assigneee).isPresent()).toBeTruthy('Assignee not present');
        await editCasePage.clearCaseSummary();
        await editCasePage.clickSaveCase();
        var str: string = await utilCommon.getPopUpMessage();
        await expect(str).toBe('Resolve the field validation errors and then try again.');
        await utilCommon.closePopUpMessage();
        await editCasePage.updateCaseSummary('pendingAC');
        await editCasePage.clickSaveCase();
        var str: string = await utilCommon.getPopUpMessage();
        await expect(str).toBe('Saved successfully.');
    });
})