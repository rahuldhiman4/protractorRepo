import { $, browser } from "protractor";
import apiHelper from '../../api/api.helper';
import createCasePage from '../../pageobject/case/create-case.po';
import editCasePage from '../../pageobject/case/edit-case.po';
import { default as caseViewPage, default as viewCasePo } from '../../pageobject/case/view-case.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import utilCommon from '../../utils/util.common';
import caseConsole from '../../pageobject/case/case-console.po';

describe('Case Status Change', () => {
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
    fit('DRDMV-2530: [Case Status] Case status change from New', async () => {
        var priority: string = "Medium";
        var statusNew: string = "New";
        var statusAssigned: string = "Assigned";
        var statusPending: string = "Pending";
        var statusCancled: string = "Canceled";
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
        let statuses: string[] = [];
        statuses = ["New", "Assigned", "In Progress", "Pending", "Canceled"]
        var boln: boolean = await viewCasePo.isCaseStatusesDisplayed(statuses);
        expect(boln).toBeTruthy('Statues does not match On view case');
        await viewCasePo.clickOnCancelButtonOfUpdateStatus();
        expect(await viewCasePo.getTextOfStatus()).toBe(statusNew);
        await navigationPage.gotoCaseConsole();
        await caseConsole.searchCase(caseId1);
        expect(await caseConsole.isCaseIdPresent(caseId1)).toBeTruthy("Case priority not matching");
        expect(await caseConsole.isCasePriorityPresent(priority)).toBeTruthy(" priority not matching");
        expect(await caseConsole.isCaseStatusPresent(statusNew)).toBeTruthy("statusNew  not matching");
        expect(await caseConsole.isCaseSummaryPresent(summary)).toBeTruthy("summary priority not matching");       
        await caseConsole.searchAndOpenCase(caseId1);
        // Select Assigned status and save.
        await viewCasePo.changeCaseStatus(statusAssigned);
        await viewCasePo.clickSaveStatus();
        await utilCommon.waitUntilPopUpDisappear();
        expect(await viewCasePo.getTextOfStatus()).toBe(statusAssigned);
        await navigationPage.gotoCaseConsole();
        await caseConsole.searchCase(caseId1);

        expect(await caseConsole.isCaseIdPresent(caseId1)).toBeTruthy("Caseid  not matching");
        expect(await caseConsole.isCasePriorityPresent(priority)).toBeTruthy(" priority not matching");
        expect(await caseConsole.isCaseStatusPresent(statusAssigned)).toBeTruthy("statusAssigned  not matching");
        expect(await caseConsole.isCaseSummaryPresent(summary)).toBeTruthy("summary priority not matching"); 
        console.log('Assigned status success');
        // - Change status from New to Canceled.
        var newCase2 = await apiHelper.createCase(caseData);
        var caseId2: string = newCase2.displayId;
        await caseConsole.searchCase(caseId2);
        expect(await caseConsole.isCaseIdPresent(caseId2)).toBeTruthy("caseId  not matching");
        expect(await caseConsole.isCasePriorityPresent(priority)).toBeTruthy(" priority not matching");
        expect(await caseConsole.isCaseStatusPresent(statusNew)).toBeTruthy("statusNew  not matching");
        expect(await caseConsole.isCaseSummaryPresent(summary)).toBeTruthy("summary priority not matching");
        await caseConsole.searchAndOpenCase(caseId2);
        expect(await viewCasePo.getTextOfStatus()).toBe(statusNew);
        await viewCasePo.changeCaseStatus(statusCancled);
        expect(await viewCasePo.isStatusReasonOptionDisplayed('Approval Rejected')).toBeTruthy('Approval Rejected option not displayed');
        await viewCasePo.clearStatusReason();
        expect(await viewCasePo.isStatusReasonOptionDisplayed('Customer Canceled')).toBeTruthy('Customer Canceled option not displayed');
        await viewCasePo.clearStatusReason();
        // await viewCasePo.clickOnStatus();
        await viewCasePo.setStatusReason('Customer Canceled');
        await viewCasePo.clickSaveStatus();
        await utilCommon.waitUntilPopUpDisappear();
        expect(await viewCasePo.getTextOfStatus()).toBe(statusCancled), 'status should be new of Cancelled';
        await navigationPage.gotoCaseConsole();
        await caseConsole.searchCase(caseId2);

        expect(await caseConsole.isCaseIdPresent(caseId2)).toBeTruthy("caseId  not matching");
        expect(await caseConsole.isCasePriorityPresent(priority)).toBeTruthy(" priority not matching");
        expect(await caseConsole.isCaseStatusPresent(statusCancled)).toBeTruthy("statusCancled  not matching");
        expect(await caseConsole.isCaseSummaryPresent(summary)).toBeTruthy("summary priority not matching");
        console.log('Canceled status success');
        // - Change status from New to Pending.
        var newCase3 = await apiHelper.createCase(caseData);
        var caseId3: string = newCase3.displayId;
        await caseConsole.searchCase(caseId3);
        expect(await caseConsole.isCaseIdPresent(caseId3)).toBeTruthy("caseId  not matching");
        expect(await caseConsole.isCasePriorityPresent(priority)).toBeTruthy(" priority not matching");
        expect(await caseConsole.isCaseStatusPresent(statusNew)).toBeTruthy("statusNew  not matching");
        expect(await caseConsole.isCaseSummaryPresent(summary)).toBeTruthy("summary priority not matching");
        await caseConsole.searchAndOpenCase(caseId3);
        expect(await viewCasePo.getTextOfStatus()).toBe(statusNew), 'status should be new of status';
        await viewCasePo.changeCaseStatus(statusPending);
        await viewCasePo.setStatusReason('Approval');
        await viewCasePo.clickSaveStatus();
        expect(utilCommon.getPopUpMessage()).toBe('ERROR (10000): Case status updated to Pending for Approval only when approval is initiated. You cannot manually select this status.');
        await utilCommon.closePopUpMessage();
        expect(await viewCasePo.isStatusReasonOptionDisplayed('Approval')).toBeTruthy('Approval option not displayed');
        await viewCasePo.clearStatusReason();
        expect(await viewCasePo.isStatusReasonOptionDisplayed('Customer Response')).toBeTruthy('Customer Response option not displayed');
        await viewCasePo.clearStatusReason();
        expect(await viewCasePo.isStatusReasonOptionDisplayed('Error')).toBeTruthy('Error option not displayed');
        await viewCasePo.clearStatusReason();
        expect(await viewCasePo.isStatusReasonOptionDisplayed('Required Fields Are Missing')).toBeTruthy('Required Fields Are Missing option not displayed');
        await viewCasePo.clearStatusReason();
        expect(await viewCasePo.isStatusReasonOptionDisplayed('Third Party')).toBeTruthy('Third Party option not displayed');
        await viewCasePo.clearStatusReason();
        await viewCasePo.setStatusReason('Customer Response');
        await viewCasePo.clickSaveStatus();
        await utilCommon.waitUntilPopUpDisappear();
        expect(await viewCasePo.getTextOfStatus()).toBe(statusPending), 'status should be new of Pending';
        await navigationPage.gotoCaseConsole();
        await caseConsole.searchCase(caseId3);
        expect(await caseConsole.isCaseIdPresent(caseId3)).toBeTruthy("caseId  not matching");
        expect(await caseConsole.isCasePriorityPresent(priority)).toBeTruthy(" priority not matching");
        expect(await caseConsole.isCaseStatusPresent(statusPending)).toBeTruthy("statusPending  not matching");
        expect(await caseConsole.isCaseSummaryPresent(summary)).toBeTruthy("summary priority not matching");
        console.log('Pending status success');
    }, 270 * 1000);

    it('DRDMV-1618: [Case] Fields validation for case in Resolved status', async () => {
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.setContactName('qtao');
        await createCasePage.clickSaveCaseButton();
        await utilCommon.closePopUpMessage();
        await createCasePage.clickGoToCaseButton();
        console.log(await viewCasePo.getCaseID());
        await expect(viewCasePo.getTextOfStatus()).toBe('Assigned');
        await viewCasePo.changeCaseStatus('Resolved');
        await viewCasePo.setStatusReason('Auto Resolved');
        await viewCasePo.clickSaveStatus();
        await utilCommon.waitUntilPopUpDisappear();
        await expect(viewCasePo.getTextOfStatus()).toBe('Resolved');
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
        await expect(await utilCommon.getPopUpMessage()).toBe('Saved successfully.');
    });

    it('DRDMV-1197: [Case Status] Case status change from Closed', async () => {
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.setContactName('qtao');
        await createCasePage.clickSaveCaseButton();
        await utilCommon.closePopUpMessage();
        await createCasePage.clickGoToCaseButton();
        console.log(await viewCasePo.getCaseID());
        await caseViewPage.changeCaseStatus('Resolved');
        await caseViewPage.setStatusReason('Customer Follow-Up Required');
        await caseViewPage.clickSaveStatus();
        await utilCommon.waitUntilPopUpDisappear();
        await expect(await viewCasePo.getTextOfStatus()).toBe('Resolved');
        await caseViewPage.changeCaseStatus('Closed');
        await caseViewPage.clickSaveStatus();
        await utilCommon.waitUntilPopUpDisappear();
        await expect(await viewCasePo.getTextOfStatus()).toBe('Closed');
        await caseViewPage.clickOnStatus();
        expect(await $(viewCasePo.selectors.saveUpdateStatus).isPresent()).toBeFalsy('Update Statue blade is displayed');
    });

    it('DRDMV-1233: [Case Status Reason] Status Reason change without status transition', async () => {
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.setContactName('qtao');
        await createCasePage.clickSaveCaseButton();
        await utilCommon.closePopUpMessage();
        await createCasePage.clickGoToCaseButton();
        console.log(await viewCasePo.getCaseID());
        await caseViewPage.changeCaseStatus('Pending');
        expect(await viewCasePo.isStatusReasonOptionDisplayed('Approval')).toBeTruthy('Approval option not displayed');
        await viewCasePo.clearStatusReason();
        expect(await viewCasePo.isStatusReasonOptionDisplayed('Customer Response')).toBeTruthy('Customer Response option not displayed');
        await viewCasePo.clearStatusReason();
        expect(await viewCasePo.isStatusReasonOptionDisplayed('Error')).toBeTruthy('Error option not displayed');
        await viewCasePo.clearStatusReason();
        expect(await viewCasePo.isStatusReasonOptionDisplayed('Required Fields Are Missing')).toBeTruthy('Required Fields Are Missing option not displayed');
        await viewCasePo.clearStatusReason();
        expect(await viewCasePo.isStatusReasonOptionDisplayed('Third Party')).toBeTruthy('Third Party option not displayed');
        await viewCasePo.clearStatusReason();
        await viewCasePo.setStatusReason('Approval');
        await viewCasePo.clickSaveStatus();
        expect(await utilCommon.getPopUpMessage()).toBe('ERROR (10000): Case status updated to Pending for Approval only when approval is initiated. You cannot manually select this status.');
        await utilCommon.closePopUpMessage();
        await viewCasePo.setStatusReason('Customer Response');
        await viewCasePo.clickSaveStatus();
        await utilCommon.waitUntilPopUpDisappear();
        expect(await viewCasePo.getTextOfStatus()).toBe('Pending');

        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.setContactName('qtao');
        await createCasePage.clickSaveCaseButton();
        await utilCommon.closePopUpMessage();
        await createCasePage.clickGoToCaseButton();
        console.log(await viewCasePo.getCaseID());
        await caseViewPage.changeCaseStatus('Resolved');
        expect(await viewCasePo.isStatusReasonOptionDisplayed('Auto Resolved')).toBeTruthy('Auto Resolved option not displayed');
        await viewCasePo.clearStatusReason();
        expect(await viewCasePo.isStatusReasonOptionDisplayed('Customer Follow-Up Required')).toBeTruthy('Customer Follow-Up Required option not displayed');
        await viewCasePo.clearStatusReason();
        expect(await viewCasePo.isStatusReasonOptionDisplayed('No Further Action Required')).toBeTruthy('No Further Action Required option not displayed');
        await viewCasePo.clearStatusReason();
        await viewCasePo.setStatusReason('Auto Resolved');
        await viewCasePo.clickSaveStatus();
        expect(await utilCommon.getPopUpMessage()).toBe('Saved successfully.');
    }, 90 * 1000);

    it('DRDMV-1616: [Case] Fields validation for case In Progress status', async () => {
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.setContactName('qtao');
        await createCasePage.clickSaveCaseButton();
        await utilCommon.closePopUpMessage();
        await createCasePage.clickGoToCaseButton();
        console.log(await viewCasePo.getCaseID());
        await caseViewPage.changeCaseStatus('In Progress');
        await caseViewPage.clickSaveStatus();
        await utilCommon.waitUntilPopUpDisappear();
        expect(await viewCasePo.getTextOfStatus()).toBe('In Progress');
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
        await utilCommon.closePopUpMessage();
        await createCasePage.clickGoToCaseButton();
        console.log(await viewCasePo.getCaseID());
        await caseViewPage.changeCaseStatus('In Progress');
        await expect(viewCasePo.getErrorMsgOfInprogressStatus()).toBe('Assignee is required for this case status.  Please select an assignee. ');
        await caseViewPage.clickOnCancelButtonOfUpdateStatus();
        await utilCommon.clickOnWarningOk();
        expect(await viewCasePo.getTextOfStatus()).toBe('New');

        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await createCasePage.setContactName('qtao');
        await createCasePage.clickSaveCaseButton();
        await utilCommon.closePopUpMessage();
        await createCasePage.clickGoToCaseButton();
        console.log(await viewCasePo.getCaseID());
        await caseViewPage.changeCaseStatus('Assigned');
        await caseViewPage.clickSaveStatus();
        await utilCommon.waitUntilPopUpDisappear();
        expect(await viewCasePo.getTextOfStatus()).toBe('Assigned');
        await caseViewPage.changeCaseStatus('In Progress');
        await expect(viewCasePo.getErrorMsgOfInprogressStatus()).toBe('Assignee is required for this case status.  Please select an assignee. ');
        await viewCasePo.clickOnCancelButtonOfUpdateStatus();
        await utilCommon.clickOnWarningOk();
        expect(await viewCasePo.getTextOfStatus()).toBe('Assigned');

        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await createCasePage.setContactName('qtao');
        await createCasePage.clickSaveCaseButton();
        await utilCommon.closePopUpMessage();
        await createCasePage.clickGoToCaseButton();
        console.log(await viewCasePo.getCaseID());
        await caseViewPage.changeCaseStatus('Pending');
        await caseViewPage.setStatusReason('Customer Response');
        await caseViewPage.clickSaveStatus();
        await utilCommon.waitUntilPopUpDisappear();
        expect(await viewCasePo.getTextOfStatus()).toBe('Pending');
        await caseViewPage.changeCaseStatus('In Progress');
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
        await utilCommon.closePopUpMessage();
        await createCasePage.clickGoToCaseButton();
        console.log(await viewCasePo.getCaseID());
        await caseViewPage.changeCaseStatus('Canceled');
        await caseViewPage.setStatusReason('Approval Rejected');
        await caseViewPage.clickSaveStatus();
        await utilCommon.waitUntilPopUpDisappear();
        await expect(await viewCasePo.getTextOfStatus()).toBe('Canceled');
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
        await utilCommon.closePopUpMessage();
        await createCasePage.clickGoToCaseButton();
        console.log(await viewCasePo.getCaseID());
        await expect(viewCasePo.getTextOfStatus()).toBe('Assigned');
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
        await utilCommon.closePopUpMessage();
        await createCasePage.clickGoToCaseButton();
        console.log(await viewCasePo.getCaseID());
        await caseViewPage.changeCaseStatus('Pending');
        await caseViewPage.setStatusReason('Customer Response');
        await caseViewPage.clickSaveStatus();
        browser.sleep(3000);
        await expect(await viewCasePo.getTextOfStatus()).toBe('Pending');
        // await expect(value).toBeTruthy('Status is not pending');
        await utilCommon.closePopUpMessage();
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