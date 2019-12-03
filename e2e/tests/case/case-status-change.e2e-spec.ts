import { browser, $ } from "protractor";
import loginPage from "../../pageobject/login.po";
import navigationPage from "../../pageobject/navigation.po";
import createCasePage from '../../pageobject/case/create-case.po';
import editCasePage from '../../pageobject/case/edit-case.po';
import caseViewPage from '../../pageobject/case/view-case.po';
import utilCommon from '../../utils/ui/util.common';
import viewCasePo from '../../pageobject/case/view-case.po';

describe('Case Status Change', () => {
    beforeAll(async () => {
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });    
    
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
        utilCommon.waitUntilPopUpDisappear();
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
        await browser.wait(this.EC.visibilityOf($(this.selectors.editLink)));

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
        utilCommon.waitUntilPopUpDisappear();
        expect(await viewCasePo.getTextOfStatus()).toBe('Assigned');
        await caseViewPage.changeCaseStatus('In Progress');
        await expect(viewCasePo.getErrorMsgOfInprogressStatus()).toBe('Assignee is required for this case status.  Please select an assignee. ');
        await viewCasePo.clickOnCancelButtonOfUpdateStatus();
        await utilCommon.clickOnWarningOk();
        await browser.wait(this.EC.visibilityOf($(this.selectors.editLink)));

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
     }, 180 * 1000);

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