
import editCasePo from '../../pageobject/case/edit-case.po';
import activityTabPo from '../../pageobject/social/activity-tab.po';
import { browser } from "protractor";
import previewCasePo from '../../pageobject/case/case-preview.po';
import createCasePage from '../../pageobject/case/create-case.po';
import selectCaseTemplateBlade from '../../pageobject/case/select-casetemplate-blade.po';
import viewCasePage from "../../pageobject/case/view-case.po";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import consoleCasetemplatePo from '../../pageobject/settings/case-management/console-casetemplate.po';
import createCaseTemplate from '../../pageobject/settings/case-management/create-casetemplate.po';
import { BWF_BASE_URL } from '../../utils/constants';
import viewCasetemplatePo from '../../pageobject/settings/case-management/view-casetemplate.po';
import updateStatusBladePo from '../../pageobject/common/update.status.blade.po';
import caseAccessTabPo from '../../pageobject/common/case-access-tab.po';
import caseConsolePo from '../../pageobject/case/case-console.po';
import changeAssignmentBladePo from '../../pageobject/common/change-assignment-blade.po';

describe('Case Status Change', () => {
    let statusNew: string = "New";
    let statusInProgress: string = "In Progress";
    let statusAssigned: string = "Assigned";
    let statusPending: string = "Pending";
    let statusCanceled: string = "Canceled";
    let statusResolved: string = "Resolved";
    let statusClosed: string = "Closed";
    let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
    let caseTemplate1 = 'CaseTemplateCaseReopenYesAndStatusResolved' + randomStr;
    let caseTemplate2 = 'createCaseTemplateAsCaseReopenNoAndStatusResolved' + randomStr;
    let caseTemplate3 = 'createCaseTemplateCaseReopenYesAndStatusClosed' + randomStr;
    let CaseTemplate4 = 'createCaseTemplateAsCaseReopenNoAndStatusClosed' + randomStr;



    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        await createCaseTemplateCaseReopenYesAndStatusResolved();
        await createCaseTemplateAsCaseReopenNoAndStatusResolved();
        await createCaseTemplateCaseReopenYesAndStatusClosed();
        await createCaseTemplateAsCaseReopenNoAndStatusClosed();
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    async function createCaseTemplateCaseReopenYesAndStatusResolved() {
        await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
        await createCaseTemplate.setTemplateName(caseTemplate1);
        await createCaseTemplate.setCompanyName('Petramco');
        await createCaseTemplate.setCaseSummary(caseTemplate1);
        await createCaseTemplate.setCaseStatusValue(statusResolved);
        await createCaseTemplate.setStatusReasonValue("Auto Resolved");
        await createCaseTemplate.setAllowCaseReopenValue('Yes');
        await createCaseTemplate.setTemplateStatusDropdownValue('Active');
        await createCaseTemplate.clickSaveCaseTemplate();
        await viewCasetemplatePo.gotoCaseTemplateConsole();
    }

    async function createCaseTemplateAsCaseReopenNoAndStatusResolved() {
        await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
        await createCaseTemplate.setTemplateName(caseTemplate2);
        await createCaseTemplate.setCompanyName('Petramco');
        await createCaseTemplate.setCaseSummary(caseTemplate2);
        await createCaseTemplate.setCaseStatusValue(statusResolved);
        await createCaseTemplate.setStatusReasonValue("Auto Resolved");
        await createCaseTemplate.setAllowCaseReopenValue('No');
        await createCaseTemplate.setTemplateStatusDropdownValue('Active');
        await createCaseTemplate.clickSaveCaseTemplate();
        await viewCasetemplatePo.gotoCaseTemplateConsole();
    }

    async function createCaseTemplateCaseReopenYesAndStatusClosed() {
        await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
        await createCaseTemplate.setTemplateName(caseTemplate3);
        await createCaseTemplate.setCompanyName('Petramco');
        await createCaseTemplate.setCaseSummary(caseTemplate3);
        await createCaseTemplate.setCaseStatusValue(statusClosed);
        await createCaseTemplate.setStatusReasonValue("Auto Resolved");
        await createCaseTemplate.setAllowCaseReopenValue('Yes');
        await createCaseTemplate.setTemplateStatusDropdownValue('Active');
        await createCaseTemplate.clickSaveCaseTemplate();
        await viewCasetemplatePo.gotoCaseTemplateConsole();
    }

    async function createCaseTemplateAsCaseReopenNoAndStatusClosed() {
        await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
        await createCaseTemplate.setTemplateName(CaseTemplate4);
        await createCaseTemplate.setCompanyName('Petramco');
        await createCaseTemplate.setCaseSummary(CaseTemplate4);
        await createCaseTemplate.setCaseStatusValue(statusClosed);
        await createCaseTemplate.setStatusReasonValue("Auto Resolved");
        await createCaseTemplate.setAllowCaseReopenValue('No');
        await createCaseTemplate.setTemplateStatusDropdownValue('Active');
        await createCaseTemplate.clickSaveCaseTemplate();
        await viewCasetemplatePo.gotoCaseTemplateConsole();
    }

    describe('[DRDMV-22306]: Reopen Case With Resolved Status Without And With Case Template Configuration', async () => {
        it('[DRDMV-22306]: Create case1 without case template', async () => {
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('Summary');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await updateStatusBladePo.changeCaseStatus('Resolved');
            await updateStatusBladePo.setStatusReason('Auto Resolved');
            await updateStatusBladePo.clickSaveStatus();
        });

        it('[DRDMV-22306]: Verify case1 without case template', async () => {
            expect(await viewCasePage.isCaseReopenLinkPresent()).toBeTruthy('FailureMsg1: reopen button is missing');
            expect(await viewCasePage.getTextOfStatus()).toBe(statusResolved, 'FailureMsg2: Resolved status is missing');
            await viewCasePage.clickOnReopenCaseLink();
            expect(await viewCasePage.getTextOfStatus()).toBe(statusInProgress, 'FailureMsg3: In-Progress status is missing');
            expect(await activityTabPo.isTextPresentInActivityLog('Qianru Tao reopened the case')).toBeTruthy('FailureMsg4: Text is missing');
            expect(await activityTabPo.isTextPresentInActivityLog(statusResolved)).toBeTruthy('FailureMsg5: Text is missing');
            expect(await activityTabPo.isTextPresentInActivityLog('The case was reopened for 1 time')).toBeTruthy('FailureMsg6: Text is missing');
        });

        it('[DRDMV-22306]: Create case2 with case template1 (', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('Summary');
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCaseTemplateBlade.selectCaseTemplate(caseTemplate1);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
        });

        it('[DRDMV-22306]: Verify case2 with case template (Allow Case Reopen =Yes)', async () => {
            expect(await viewCasePage.isCaseReopenLinkPresent()).toBeTruthy('FailureMsg1: reopen button is missing');
            expect(await viewCasePage.getTextOfStatus()).toBe(statusResolved, 'FailureMsg2: Resolved status is missing');
            await viewCasePage.clickOnReopenCaseLink();
            expect(await viewCasePage.getTextOfStatus()).toBe(statusInProgress, 'FailureMsg3: In-Progress status is missing');
            expect(await activityTabPo.isTextPresentInActivityLog('Qianru Tao reopened the case')).toBeTruthy('FailureMsg4: Text is missing');
            await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.isTextPresentInActivityLog(statusResolved)).toBeTruthy('FailureMsg5: Text is missing');
            expect(await activityTabPo.isTextPresentInActivityLog('The case was reopened for 1 time')).toBeTruthy('FailureMsg6: Text is missing');
        });

        it('[DRDMV-22306]: Create case3 with case template2 & verify reopen not display (', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('Summary');
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCaseTemplateBlade.selectCaseTemplate(caseTemplate2);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePage.isCaseReopenLinkPresent()).toBeFalsy('FailureMsg1: reopen button is missing');
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[DRDMV-22321]: Reopen Case With Closed Status Without And With Case Template Configuration', async () => {
        it('Create case1 without case template', async () => {
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('case1_Summary');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
        });

        it('[DRDMV-22321]: Verify case1 without case template', async () => {
            await updateStatusBladePo.changeCaseStatus(statusResolved);
            await updateStatusBladePo.setStatusReason("Auto Resolved");
            await updateStatusBladePo.clickSaveStatus();
            await updateStatusBladePo.changeCaseStatus(statusClosed);
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.isCaseReopenLinkPresent()).toBeTruthy('FailureMsg1: reopen button is missing');
            expect(await viewCasePage.getTextOfStatus()).toBe(statusClosed, 'FailureMsg2: Closed status is missing');
            await viewCasePage.clickOnReopenCaseLink();
            expect(await viewCasePage.getTextOfStatus()).toBe(statusInProgress, 'FailureMsg3: In-Progress status is missing');
            expect(await activityTabPo.isTextPresentInActivityLog('Qianru Tao reopened the case')).toBeTruthy('FailureMsg4: Text is missing');
            expect(await activityTabPo.isTextPresentInActivityLog(statusClosed)).toBeTruthy('FailureMsg5: Text is missing');
            expect(await activityTabPo.isTextPresentInActivityLog('The case was reopened for 1 time')).toBeTruthy('FailureMsg6: Text is missing');
        });

        it('[DRDMV-22321]: Create case2 with case template1', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('case2_Summary');
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCaseTemplateBlade.selectCaseTemplate(caseTemplate3);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
        });

        it('[DRDMV-22321]: Verify case2 with case template (Allow Case Reopen =Yes)', async () => {
            expect(await viewCasePage.isCaseReopenLinkPresent()).toBeTruthy('FailureMsg1: reopen button is missing');
            expect(await viewCasePage.getTextOfStatus()).toBe(statusClosed, 'FailureMsg2: Resolved status is missing');
            await viewCasePage.clickOnReopenCaseLink();
            expect(await viewCasePage.getTextOfStatus()).toBe(statusInProgress, 'FailureMsg3: In Progress status is missing');
            expect(await activityTabPo.isTextPresentInActivityLog('Qianru Tao reopened the case')).toBeTruthy('FailureMsg4: Text is missing');
            await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.isTextPresentInActivityLog(statusClosed)).toBeTruthy('FailureMsg5: Text is missing');
            expect(await activityTabPo.isTextPresentInActivityLog('The case was reopened for 1 time')).toBeTruthy('FailureMsg6: Text is missing');
        });

        it('[DRDMV-22321]: Create case3 with case template2 & verify reopen not display', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('case3_Summary');
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCaseTemplateBlade.selectCaseTemplate(CaseTemplate4);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePage.isCaseReopenLinkPresent()).toBeFalsy('FailureMsg1: reopen button is missing');
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    it('[DRDMV-22322]: Verify Reopen Button Not Displayed With Some Case Statuses', async () => {
        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester('adam');
        await createCasePage.setSummary('Summary');
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();

        expect(await viewCasePage.getTextOfStatus()).toBe(statusNew, 'FailureMsg1: New status is missing');
        expect(await viewCasePage.isCaseReopenLinkPresent()).toBeFalsy('FailureMsg2: Case Reopen link displayed');
        await viewCasePage.clickEditCaseButton();
        await editCasePo.clickOnAssignToMe();
        await editCasePo.clickSaveCase();
        expect(await viewCasePage.getTextOfStatus()).toBe(statusAssigned, 'FailureMsg3: Assigned status is missing');
        expect(await viewCasePage.isCaseReopenLinkPresent()).toBeFalsy('FailureMsg4: Case Reopen link displayed');
        await updateStatusBladePo.changeCaseStatus(statusInProgress);
        await updateStatusBladePo.clickSaveStatus();
        expect(await viewCasePage.getTextOfStatus()).toBe(statusInProgress, 'FailureMsg5: In progress status is missing');
        expect(await viewCasePage.isCaseReopenLinkPresent()).toBeFalsy('FailureMsg6: Case Reopen link displayed');
        await updateStatusBladePo.changeCaseStatus(statusPending);
        await updateStatusBladePo.setStatusReason('Error');
        await updateStatusBladePo.clickSaveStatus();
        expect(await viewCasePage.getTextOfStatus()).toBe(statusPending, 'FailureMsg7: Pending status is missing');
        expect(await viewCasePage.isCaseReopenLinkPresent()).toBeFalsy('FailureMsg8: Case Reopen link displayed');
        await updateStatusBladePo.changeCaseStatus(statusCanceled);
        await updateStatusBladePo.setStatusReason('Approval Rejected');
        await updateStatusBladePo.clickSaveStatus();
        expect(await viewCasePage.getTextOfStatus()).toBe(statusCanceled, 'FailureMsg9: Pending status is missing');
        expect(await viewCasePage.isCaseReopenLinkPresent()).toBeFalsy('FailureMsg10: Case Reopen link displayed');
    });

    describe('[DRDMV-22361]: Verify Case Reopen Functionailty with Assignee/Write Access/Read Access Users', async () => {
        let case1, case2;
        it('[DRDMV-22361]: Create case1  With Resolved Status', async () => {
            await navigationPage.signOut();
            await loginPage.login('qtao');
            // Create case1
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('Case1_Summary');
            await createCasePage.clickChangeAssignmentButton();
            await changeAssignmentBladePo.selectBusinessUnit('Facilities Support');
            await changeAssignmentBladePo.selectSupportGroup('Facilities');
            await changeAssignmentBladePo.selectAssignee('Fritz');
            await changeAssignmentBladePo.clickOnAssignButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            case1 = await viewCasePage.getCaseID();
        });

        it('[DRDMV-22361]: Give Access To Users For case1', async () => {
            //Give Read Access User3
            await viewCasePage.clickOnTab('Case Access');
            await caseAccessTabPo.clickOnSupportGroupAccessORAgentAccessButton('Agent Access');
            await caseAccessTabPo.selectAndAddAgent('Qing Yuan');
            await expect(await caseAccessTabPo.isCaseAccessEntityAdded('Qing Yuan')).toBeTruthy('Failuer: Qing Yuan Agent Name is missing');
            //Give Write Access User3
            await caseAccessTabPo.selectAgentWithWriteAccess('qstrong');
            expect(await caseAccessTabPo.isCaseAccessEntityAdded('Quin Strong')).toBeTruthy('Failuer: Quin Strong Agent Name is missing');
            await updateStatusBladePo.changeCaseStatus(statusResolved);
            await updateStatusBladePo.setStatusReason('Auto Resolved');
            await updateStatusBladePo.clickSaveStatus();
        });

        it('[DRDMV-22361]: Create case2  With Closed Status', async () => {
            // Create case2
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('Case2_Summary');
            await createCasePage.clickChangeAssignmentButton();
            await changeAssignmentBladePo.selectBusinessUnit('Facilities Support');
            await changeAssignmentBladePo.selectSupportGroup('Facilities');
            await changeAssignmentBladePo.selectAssignee('Fritz');
            await changeAssignmentBladePo.clickOnAssignButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            case2 = await viewCasePage.getCaseID();
        });

        it('[DRDMV-22361]: Give Access To Users For Case2 And Change Case Status To Closed', async () => {
            //Give Read Access User3
            await viewCasePage.clickOnTab('Case Access');
            await caseAccessTabPo.clickOnSupportGroupAccessORAgentAccessButton('Agent Access');
            await caseAccessTabPo.selectAndAddAgent('Qing Yuan');
            await expect(await caseAccessTabPo.isCaseAccessEntityAdded('Qing Yuan')).toBeTruthy('Failuer: Qing Yuan Agent Name is missing');
            //Give Write Access User3
            await caseAccessTabPo.selectAgentWithWriteAccess('qstrong');
            expect(await caseAccessTabPo.isCaseAccessEntityAdded('Quin Strong')).toBeTruthy('Failuer: Quin Strong Agent Name is missing');
            await updateStatusBladePo.changeCaseStatus(statusResolved);
            await updateStatusBladePo.setStatusReason('Auto Resolved');
            await updateStatusBladePo.clickSaveStatus();
            await updateStatusBladePo.changeCaseStatus(statusClosed);
            await updateStatusBladePo.clickSaveStatus();
        });

        it('[DRDMV-22361]: Verify Reopen Button With Read Only Users3', async () => {
            await navigationPage.signOut();
            await loginPage.login('qyuan');
            await caseConsolePo.searchAndOpenCase(case1); 
            await viewCasePage.clickOnReopenCaseLink();
            expect(await viewCasePage.getTextOfStatus()).toBe(statusResolved, 'FailureMsg1: Resolved status is missing');
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(case2);
            await viewCasePage.clickOnReopenCaseLink();
            expect(await viewCasePage.getTextOfStatus()).toBe(statusClosed, 'FailureMsg2: Close status is missing');
        });

        it('[DRDMV-22361]: Verify Reopen Button With Write Access Users2', async () => {
            await navigationPage.signOut();
            await loginPage.login('qstrong');
            await caseConsolePo.searchAndOpenCase(case1); 

            expect(await viewCasePage.isCaseReopenLinkPresent()).toBeTruthy('FailureMsg1: reopen button is missing');
            expect(await viewCasePage.getTextOfStatus()).toBe(statusResolved, 'FailureMsg2: Resolved status is missing');
            await viewCasePage.clickOnReopenCaseLink();
            expect(await viewCasePage.getTextOfStatus()).toBe(statusInProgress, 'FailureMsg3: In-Progress status is missing');
            expect(await activityTabPo.isTextPresentInActivityLog('Quin Strong reopened the case')).toBeTruthy('FailureMsg4: Text is missing');
            await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.isTextPresentInActivityLog(statusResolved)).toBeTruthy('FailureMsg5: Text is missing');
            expect(await activityTabPo.isTextPresentInActivityLog('The case was reopened for 1 time')).toBeTruthy('FailureMsg6: Text is missing');
            await updateStatusBladePo.changeCaseStatus(statusResolved);
            await updateStatusBladePo.setStatusReason('Auto Resolved');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe(statusResolved, 'FailureMsg14: Resolved status is missing');

            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(case2);
            expect(await viewCasePage.isCaseReopenLinkPresent()).toBeTruthy('FailureMsg7: reopen button is missing');
            expect(await viewCasePage.getTextOfStatus()).toBe(statusClosed, 'FailureMsg8: Resolved status is missing');
            await viewCasePage.clickOnReopenCaseLink();
            expect(await viewCasePage.getTextOfStatus()).toBe(statusInProgress, 'FailureMsg9: In Progress status is missing');
            expect(await activityTabPo.isTextPresentInActivityLog('Quin Strong reopened the case')).toBeTruthy('FailureMsg10: Text is missing');
            await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.isTextPresentInActivityLog(statusClosed)).toBeTruthy('FailureMsg11: Text is missing');
            expect(await activityTabPo.isTextPresentInActivityLog('The case was reopened for 1 time')).toBeTruthy('FailureMsg12: Text is missing');
            await updateStatusBladePo.changeCaseStatus(statusResolved);
            await updateStatusBladePo.setStatusReason('Auto Resolved');
            await updateStatusBladePo.clickSaveStatus();
            await updateStatusBladePo.changeCaseStatus(statusClosed);
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe(statusClosed, 'FailureMsg13: Closed status is missing');
        });

        it('[DRDMV-22361]: Verify Reopen Button With Assignee Users1', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz')
            await caseConsolePo.searchAndOpenCase(case1); 

            expect(await viewCasePage.isCaseReopenLinkPresent()).toBeTruthy('FailureMsg1: reopen button is missing');
            expect(await viewCasePage.getTextOfStatus()).toBe(statusResolved, 'FailureMsg2: Resolved status is missing');
            await viewCasePage.clickOnReopenCaseLink();
            expect(await viewCasePage.getTextOfStatus()).toBe(statusInProgress, 'FailureMsg3: In-Progress status is missing');
            expect(await activityTabPo.isTextPresentInActivityLog('Fritz Schulz reopened the case')).toBeTruthy('FailureMsg4: Text is missing');
            await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.isTextPresentInActivityLog(statusResolved)).toBeTruthy('FailureMsg5: Text is missing');
            expect(await activityTabPo.isTextPresentInActivityLog('The case was reopened for 2 time')).toBeTruthy('FailureMsg6: Text is missing');

            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(case2);
            expect(await viewCasePage.isCaseReopenLinkPresent()).toBeTruthy('FailureMsg7: reopen button is missing');
            expect(await viewCasePage.getTextOfStatus()).toBe(statusClosed, 'FailureMsg8: Resolved status is missing');
            await viewCasePage.clickOnReopenCaseLink();
            expect(await viewCasePage.getTextOfStatus()).toBe(statusInProgress, 'FailureMsg9: In Progress status is missing');
            expect(await activityTabPo.isTextPresentInActivityLog('Fritz Schulz reopened the case')).toBeTruthy('FailureMsg10: Text is missing');
            await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.isTextPresentInActivityLog(statusClosed)).toBeTruthy('FailureMsg11: Text is missing');
            expect(await activityTabPo.isTextPresentInActivityLog('The case was reopened for 2 time')).toBeTruthy('FailureMsg12: Text is missing');
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

});
