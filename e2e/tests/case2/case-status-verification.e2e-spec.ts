import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import caseConsolePo from '../../pageobject/case/case-console.po';
import previewCasePo from '../../pageobject/case/case-preview.po';
import createCasePage from '../../pageobject/case/create-case.po';
import editCasePo from '../../pageobject/case/edit-case.po';
import selectCaseTemplateBlade from '../../pageobject/case/select-casetemplate-blade.po';
import viewCasePage from "../../pageobject/case/view-case.po";
import accessTabPo from '../../pageobject/common/access-tab.po';
import changeAssignmentPo from '../../pageobject/common/change-assignment.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import updateStatusBladePo from '../../pageobject/common/update.status.blade.po';
import activityTabPo from '../../pageobject/social/activity-tab.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';

describe('Case Status Verification', () => {
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

        let caseTemplateData = {
            "templateName": caseTemplate1,
            "templateSummary": caseTemplate1,
            "caseStatus": "Resolved",
            "statusReason": "Auto Resolved",
            "templateStatus": "Active",
            "company": "Petramco",
            "businessUnit": "United States Support",
            "supportGroup": "US Support 3",
            "assignee": "qkatawazi",
            "ownerBU": 'United States Support',
            "ownerGroup": "US Support 3",
            "allowCaseReopen": true
        }
        await apiHelper.apiLogin('qkatawazi');
        // Create Case Template Case Reopen Yes And Status Resolved
        await apiHelper.createCaseTemplate(caseTemplateData);

        // Create Case Template Case Reopen Yes And Status Closed
        caseTemplateData.templateName = caseTemplate3;
        caseTemplateData.templateSummary = caseTemplate3;
        caseTemplateData.caseStatus = "Closed";
        await apiHelper.createCaseTemplate(caseTemplateData);

        // Create Case Template As Case Reopen No And Status Closed
        caseTemplateData.templateName = CaseTemplate4;
        caseTemplateData.templateSummary = CaseTemplate4;
        caseTemplateData.caseStatus = "Closed";
        caseTemplateData.allowCaseReopen = false;
        await apiHelper.createCaseTemplate(caseTemplateData);

        // Create Case Template As Case Reopen No And Status Resolved
        caseTemplateData.templateName = caseTemplate2;
        caseTemplateData.templateSummary = caseTemplate2;
        caseTemplateData.allowCaseReopen = false;
        await apiHelper.createCaseTemplate(caseTemplateData);
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    describe('[3490]: Reopen Case With Resolved Status Without And With Case Template Configuration', async () => {
        it('[3490]: Create case1 without case template', async () => {
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('Summary');
            await changeAssignmentPo.setAssignee("US Support 3", "Qadim Katawazi");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await updateStatusBladePo.changeStatus('Resolved');
            await updateStatusBladePo.selectStatusReason('Auto Resolved');
            await updateStatusBladePo.clickSaveStatus('Resolved');
        });

        it('[3490]: Verify case1 without case template', async () => {
            expect(await viewCasePage.isCaseReopenLinkPresent()).toBeTruthy('FailureMsg1: reopen button is missing');
            expect(await viewCasePage.getTextOfStatus()).toBe(statusResolved, 'FailureMsg2: Resolved status is missing');
            await viewCasePage.clickOnReopenCaseLink();
            await utilityCommon.closePopUpMessage();
            await browser.sleep(2000); // wait for the data reflect on UI
            await activityTabPo.clickOnRefreshButton();
            expect(await viewCasePage.getTextOfStatus()).toBe(statusInProgress, 'FailureMsg3: In-Progress status is missing');
            expect(await activityTabPo.isTextPresentInActivityLog('Qianru Tao reopened the case')).toBeTruthy('FailureMsg4: Text is missing');
            expect(await activityTabPo.isTextPresentInActivityLog(statusResolved)).toBeTruthy('FailureMsg5: Text is missing');
            expect(await activityTabPo.isTextPresentInActivityLog('The case was reopened for 1 time')).toBeTruthy('FailureMsg6: Text is missing');
        });

        it('[3490]: Create case2 with case template1', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('Summary');
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCaseTemplateBlade.selectCaseTemplate(caseTemplate1);
            await changeAssignmentPo.setAssignee("US Support 3", "Qadim Katawazi");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
        });

        it('[3490]: Verify case2 with case template (Allow Case Reopen =Yes)', async () => {
            expect(await viewCasePage.isCaseReopenLinkPresent()).toBeTruthy('FailureMsg1: reopen button is missing');
            expect(await viewCasePage.getTextOfStatus()).toBe(statusResolved, 'FailureMsg2: Resolved status is missing');
            await viewCasePage.clickOnReopenCaseLink();
            expect(await viewCasePage.getTextOfStatus()).toBe(statusInProgress, 'FailureMsg3: In-Progress status is missing');
            expect(await activityTabPo.isTextPresentInActivityLog('Qianru Tao reopened the case')).toBeTruthy('FailureMsg4: Text is missing');
            // await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.isTextPresentInActivityLog(statusResolved)).toBeTruthy('FailureMsg5: Text is missing');
            expect(await activityTabPo.isTextPresentInActivityLog('The case was reopened for 1 time')).toBeTruthy('FailureMsg6: Text is missing');
        });

        it('[3490]: Create case3 with case template2 & verify reopen not display (', async () => {
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
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[3489]: Reopen Case With Closed Status Without And With Case Template Configuration', async () => {
        it('[3489]: Create case1 without case template', async () => {
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('case1_Summary');
            await changeAssignmentPo.setAssignee("US Support 1", "Qianru Tao");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
        });

        it('[3489]: Verify case1 without case template', async () => {
            await updateStatusBladePo.changeStatus(statusResolved);
            await updateStatusBladePo.selectStatusReason("Auto Resolved");
            await updateStatusBladePo.clickSaveStatus();
            await updateStatusBladePo.changeStatus(statusClosed);
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.isCaseReopenLinkPresent()).toBeTruthy('FailureMsg1: reopen button is missing');
            expect(await viewCasePage.getTextOfStatus()).toBe(statusClosed, 'FailureMsg2: Closed status is missing');
            await viewCasePage.clickOnReopenCaseLink();
            await utilityCommon.closePopUpMessage();
            await browser.sleep(2000);
            await activityTabPo.clickOnRefreshButton();
            expect(await viewCasePage.getTextOfStatus()).toBe(statusInProgress, 'FailureMsg3: In-Progress status is missing');
            expect(await activityTabPo.isTextPresentInActivityLog('Qianru Tao reopened the case')).toBeTruthy('FailureMsg4: Text is missing');
            expect(await activityTabPo.isTextPresentInActivityLog(statusClosed)).toBeTruthy('FailureMsg5: Text is missing');
            expect(await activityTabPo.isTextPresentInActivityLog('The case was reopened for 1 time')).toBeTruthy('FailureMsg6: Text is missing');
        });

        it('[3489]: Create case2 with case template1', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('case2_Summary');
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCaseTemplateBlade.selectCaseTemplate(caseTemplate3);
            await changeAssignmentPo.setAssignee("US Support 1", "Qianru Tao");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
        });

        it('[3489]: Verify case2 with case template (Allow Case Reopen =Yes)', async () => {
            expect(await viewCasePage.isCaseReopenLinkPresent()).toBeTruthy('FailureMsg1: reopen button is missing');
            expect(await viewCasePage.getTextOfStatus()).toBe(statusClosed, 'FailureMsg2: Resolved status is missing');
            await viewCasePage.clickOnReopenCaseLink();
            expect(await viewCasePage.getTextOfStatus()).toBe(statusInProgress, 'FailureMsg3: In Progress status is missing');
            expect(await activityTabPo.isTextPresentInActivityLog('Qianru Tao reopened the case')).toBeTruthy('FailureMsg4: Text is missing');
            // await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.isTextPresentInActivityLog(statusClosed)).toBeTruthy('FailureMsg5: Text is missing');
            expect(await activityTabPo.isTextPresentInActivityLog('The case was reopened for 1 time')).toBeTruthy('FailureMsg6: Text is missing');
        });

        it('[3489]: Create case3 with case template2 & verify reopen not display', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('case3_Summary');
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCaseTemplateBlade.selectCaseTemplate(CaseTemplate4);
            await changeAssignmentPo.setAssignee("US Support 1", "Qianru Tao");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePage.isCaseReopenLinkPresent()).toBeFalsy('FailureMsg1: reopen button is missing');
        });

        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    it('[3488]: Verify Reopen Button Not Displayed With Some Case Statuses', async () => {
        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester('adam');
        await createCasePage.setSummary('Summary');
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();

        expect(await viewCasePage.getTextOfStatus()).toBe(statusNew, 'FailureMsg1: New status is missing');
        expect(await viewCasePage.isCaseReopenLinkPresent()).toBeFalsy('FailureMsg2: Case Reopen link displayed');
        await viewCasePage.clickEditCaseButton();
        await changeAssignmentPo.setAssignee("US Support 3", "Qadim Katawazi");
        await editCasePo.clickSaveCase();
        expect(await viewCasePage.getTextOfStatus()).toBe(statusAssigned, 'FailureMsg3: Assigned status is missing');
        expect(await viewCasePage.isCaseReopenLinkPresent()).toBeFalsy('FailureMsg4: Case Reopen link displayed');
        await updateStatusBladePo.changeStatus(statusInProgress);
        await updateStatusBladePo.clickSaveStatus();
        expect(await viewCasePage.getTextOfStatus()).toBe(statusInProgress, 'FailureMsg5: In progress status is missing');
        expect(await viewCasePage.isCaseReopenLinkPresent()).toBeFalsy('FailureMsg6: Case Reopen link displayed');
        await updateStatusBladePo.changeStatus(statusPending);
        await updateStatusBladePo.selectStatusReason('Error');
        await updateStatusBladePo.clickSaveStatus();
        expect(await viewCasePage.getTextOfStatus()).toBe(statusPending, 'FailureMsg7: Pending status is missing');
        expect(await viewCasePage.isCaseReopenLinkPresent()).toBeFalsy('FailureMsg8: Case Reopen link displayed');
        await updateStatusBladePo.changeStatus(statusCanceled);
        await updateStatusBladePo.selectStatusReason('Approval Rejected');
        await updateStatusBladePo.clickSaveStatus();
        expect(await viewCasePage.getTextOfStatus()).toBe(statusCanceled, 'FailureMsg9: Pending status is missing');
        expect(await viewCasePage.isCaseReopenLinkPresent()).toBeFalsy('FailureMsg10: Case Reopen link displayed');
    });

    describe('[3484]: Verify Case Reopen Functionailty with Assignee/Write Access/Read Access Users', async () => {
        let case1, case2;
        it('[3484]: Create case1  With Resolved Status', async () => {
            await navigationPage.signOut();
            await loginPage.login('qtao');
            // Create case1
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('Case1_Summary');
            await changeAssignmentPo.setAssignee("CA Support 3", "Quigley Heroux");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            case1 = await viewCasePage.getCaseID();
        });

        it('[3484]: Give Access To Users For case1', async () => {
            //Give Read Access User3
            await viewCasePage.clickOnTab('Case Access');
            await accessTabPo.clickToExpandAccessEntitiySearch('Agent Access', 'Case');
            await accessTabPo.selectAgent('Qing Yuan', 'Agent');
            await accessTabPo.clickAccessEntitiyAddButton('Agent');

            //Give Write Access User3
            await accessTabPo.selectAgent('qstrong', 'Agent');
            await accessTabPo.clickAssignWriteAccessCheckbox('Agent');
            await accessTabPo.clickAccessEntitiyAddButton('Agent');

            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('Qing Yuan', 'Read')).toBeTruthy('Failuer: Qing Yuan Agent Name is missing');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('Quin Strong', 'Write')).toBeTruthy('Failuer: Quin Strong Agent Name is missing');
            await updateStatusBladePo.changeStatus(statusResolved);
            await updateStatusBladePo.selectStatusReason('Auto Resolved');
            await updateStatusBladePo.clickSaveStatus();
        });

        it('[3484]: Create case2  With Closed Status', async () => {
            // Create case2
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('Case2_Summary');
            await changeAssignmentPo.setAssignee("CA Support 3", "Quigley Heroux");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            case2 = await viewCasePage.getCaseID();
        });

        it('[3484]: Give Access To Users For Case2 And Change Case Status To Closed', async () => {
            //Give Read Access User3
            await viewCasePage.clickOnTab('Case Access');
            await accessTabPo.clickToExpandAccessEntitiySearch('Agent Access', 'Case');
            await accessTabPo.selectAgent('Qing Yuan', 'Agent');
            await accessTabPo.clickAccessEntitiyAddButton('Agent');
            await expect(await accessTabPo.isAccessTypeOfEntityDisplayed('Qing Yuan', 'Read')).toBeTruthy('Failuer: Qing Yuan Agent Name is missing');
            //Give Write Access User3
            await accessTabPo.selectAgent('qstrong', 'Agent');
            await accessTabPo.clickAssignWriteAccessCheckbox('Agent');
            await accessTabPo.clickAccessEntitiyAddButton('Agent');

            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('Quin Strong', 'Write')).toBeTruthy('Failuer: Quin Strong Agent Name is missing');
            await updateStatusBladePo.changeStatus(statusResolved);
            await updateStatusBladePo.selectStatusReason('Auto Resolved');
            await updateStatusBladePo.clickSaveStatus();
            await updateStatusBladePo.changeStatus(statusClosed);
            await updateStatusBladePo.clickSaveStatus();
        });

        it('[3484]: Verify Reopen Button With Read Only Users3', async () => {
            await navigationPage.signOut();
            await loginPage.login('qyuan');
            await caseConsolePo.searchAndOpenCase(case1);
            expect(await viewCasePage.isCaseReopenLinkDisabled()).toBeTruthy('FailureMsg1: Reopen button is not disabled');
            await viewCasePage.clickOnReopenCaseLink();
            expect(await viewCasePage.getTextOfStatus()).toBe(statusResolved, 'FailureMsg2: Resolved status is missing');
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(case2);
            expect(await viewCasePage.isCaseReopenLinkDisabled()).toBeTruthy('FailureMsg3: Reopen button is not disabled');
            await viewCasePage.clickOnReopenCaseLink();
            expect(await viewCasePage.getTextOfStatus()).toBe(statusClosed, 'FailureMsg4: Close status is missing');
        });

        it('[3484]: Verify Reopen Button With Write Access Users2', async () => {
            await navigationPage.signOut();
            await loginPage.login('qstrong');
            await caseConsolePo.searchAndOpenCase(case1);

            expect(await viewCasePage.isCaseReopenLinkPresent()).toBeTruthy('FailureMsg1: reopen button is missing');
            expect(await viewCasePage.getTextOfStatus()).toBe(statusResolved, 'FailureMsg2: Resolved status is missing');
            await viewCasePage.clickOnReopenCaseLink();
            await utilityCommon.closePopUpMessage();
            await activityTabPo.clickOnRefreshButton();
            expect(await viewCasePage.getTextOfStatus()).toBe(statusInProgress, 'FailureMsg3: In-Progress status is missing');
            expect(await activityTabPo.isTextPresentInActivityLog('Quin Strong reopened the case')).toBeTruthy('FailureMsg4: Text is missing');
            // await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.isTextPresentInActivityLog(statusResolved)).toBeTruthy('FailureMsg5: Text is missing');
            expect(await activityTabPo.isTextPresentInActivityLog('The case was reopened for 1 time')).toBeTruthy('FailureMsg6: Text is missing');
            await updateStatusBladePo.changeStatus(statusResolved);
            await updateStatusBladePo.selectStatusReason('Auto Resolved');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe(statusResolved, 'FailureMsg14: Resolved status is missing');

            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(case2);
            expect(await viewCasePage.isCaseReopenLinkPresent()).toBeTruthy('FailureMsg7: reopen button is missing');
            expect(await viewCasePage.getTextOfStatus()).toBe(statusClosed, 'FailureMsg8: Resolved status is missing');
            await viewCasePage.clickOnReopenCaseLink();
            await utilityCommon.closePopUpMessage();
            await activityTabPo.clickOnRefreshButton();
            expect(await viewCasePage.getTextOfStatus()).toBe(statusInProgress, 'FailureMsg9: In Progress status is missing');
            expect(await activityTabPo.isTextPresentInActivityLog('Quin Strong reopened the case')).toBeTruthy('FailureMsg10: Text is missing');
            // await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.isTextPresentInActivityLog(statusClosed)).toBeTruthy('FailureMsg11: Text is missing');
            expect(await activityTabPo.isTextPresentInActivityLog('The case was reopened for 1 time')).toBeTruthy('FailureMsg12: Text is missing');
            await updateStatusBladePo.changeStatus(statusResolved);
            await updateStatusBladePo.selectStatusReason('Auto Resolved');
            await updateStatusBladePo.clickSaveStatus();
            await updateStatusBladePo.changeStatus(statusClosed);
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe(statusClosed, 'FailureMsg13: Closed status is missing');
        });

        it('[3484]: Verify Reopen Button With Assignee Users1', async () => {
            await navigationPage.signOut();
            await loginPage.login('qheroux')
            await caseConsolePo.searchAndOpenCase(case1);

            expect(await viewCasePage.isCaseReopenLinkPresent()).toBeTruthy('FailureMsg1: reopen button is missing');
            expect(await viewCasePage.getTextOfStatus()).toBe(statusResolved, 'FailureMsg2: Resolved status is missing');
            await viewCasePage.clickOnReopenCaseLink();
            await utilityCommon.closePopUpMessage();
            await activityTabPo.clickOnRefreshButton();
            expect(await viewCasePage.getTextOfStatus()).toBe(statusInProgress, 'FailureMsg3: In-Progress status is missing');
            expect(await activityTabPo.isTextPresentInActivityLog('Quigley Heroux reopened the case')).toBeTruthy('FailureMsg4: Text is missing');
            // await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.isTextPresentInActivityLog(statusResolved)).toBeTruthy('FailureMsg5: Text is missing');
            expect(await activityTabPo.isTextPresentInActivityLog('The case was reopened for 2 time')).toBeTruthy('FailureMsg6: Text is missing');

            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(case2);
            expect(await viewCasePage.isCaseReopenLinkPresent()).toBeTruthy('FailureMsg7: reopen button is missing');
            expect(await viewCasePage.getTextOfStatus()).toBe(statusClosed, 'FailureMsg8: Resolved status is missing');
            await viewCasePage.clickOnReopenCaseLink();
            await utilityCommon.closePopUpMessage();
            await activityTabPo.clickOnRefreshButton();
            expect(await viewCasePage.getTextOfStatus()).toBe(statusInProgress, 'FailureMsg9: In Progress status is missing');
            expect(await activityTabPo.isTextPresentInActivityLog('Quigley Heroux reopened the case')).toBeTruthy('FailureMsg10: Text is missing');
            // await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.isTextPresentInActivityLog(statusClosed)).toBeTruthy('FailureMsg11: Text is missing');
            expect(await activityTabPo.isTextPresentInActivityLog('The case was reopened for 2 time')).toBeTruthy('FailureMsg12: Text is missing');
        });
    });
});
