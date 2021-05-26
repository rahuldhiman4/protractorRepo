import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import previewCasePo from '../../pageobject/case/case-preview.po';
import createCasePage from '../../pageobject/case/create-case.po';
import editCasePage from '../../pageobject/case/edit-case.po';
import caseTemplatePage from '../../pageobject/case/select-casetemplate-blade.po';
import viewCasePage from "../../pageobject/case/view-case.po";
import changeAssignmentPage from '../../pageobject/common/change-assignment.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import personProfilePage from '../../pageobject/common/person-profile.po';
import composemailPage from '../../pageobject/email/compose-mail.po';
import activityTabPo from '../../pageobject/social/activity-tab.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import caseConsolePo from '../../pageobject/case/case-console.po';
import viewCasePo from '../../pageobject/case/view-case.po';

describe('Edit Case', () => {
    let caseTemplateData;

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await utilityCommon.closeAllBlades();
        await loginPage.login('qkatawazi');

        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        caseTemplateData = {
            "templateName": 'case_template' + randomStr,
            "templateSummary": 'case_template_summary' + randomStr,
            "categoryTier1": 'Workforce Administration',
            "templateStatus": "Active",
            "company": "Petramco",
            "businessUnit": "United States Support",
            "supportGroup": "US Support 3",
            "assignee": "qfeng",
            "ownerBU": "United States Support",
            "ownerGroup": "US Support 3"
        }

        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createCaseTemplate(caseTemplateData);

    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //ankagraw
    it('[5804]: [Case] [Edit Case] Edit Case view (UI verification)', async () => {
        let Summary = 'Summary' + Math.floor(Math.random() * 1000000);

        await navigationPage.signOut();
        await loginPage.login('qtao');
        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + Summary);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.setContactName('qtao');
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();

        await expect(viewCasePage.getRequesterName()).toBe('Adam Pavlik');
        await expect(viewCasePage.getRequesterPhoneNo()).toBe('1 925 469-4006');
        await expect(viewCasePage.getRequesterEmail()).toBe('apavlik@petramco.com');

        await viewCasePage.clickOnContactPersonerDrpDwn();
        await expect(viewCasePage.getContactPersonName()).toBe('Qianru Tao');
        await expect(viewCasePage.getContactPersonerPhoneNo()).toBe('1 512 343-1921');
        await expect(viewCasePage.getContactPersonalEmail()).toBe('qtao@petramco.com');
        await viewCasePage.clickEditCaseButton();

        await expect(editCasePage.getRequesterName()).toBe('Adam Pavlik');
        await expect(editCasePage.getRequesterPhoneNo()).toBe('1 925 469-4006');
        await expect(editCasePage.getRequesterEmail()).toBe('apavlik@petramco.com');

        await expect(editCasePage.isCategoryTier1Disabled()).toBeFalsy();
        await expect(editCasePage.isCategoryTier2Disabled()).toBeFalsy();
        await expect(editCasePage.isCategoryTier3Disabled()).toBeFalsy();
        await expect(editCasePage.isAttachmentLinkClickable()).toBeTruthy();
        //await expect(editCasePage.isDescriptionClickable()).toBeTruthy(); Is it defect? commented because description CKEditor is always eanbled

        //Commented below lines as these are getting covered in Change Assignment test cases
        // await expect(editCasePage.getAssignedCompanyReadable()).toBeTruthy();
        // await expect(editCasePage.getAssigneeReadable()).toBeTruthy();
        // await expect(editCasePage.getBuisnessUnitReadable()).toBeTruthy();
        // await expect(editCasePage.getAssignedGroupReadable()).toBeTruthy();
        // await expect(editCasePage.isChangeAssignmentButtonPresent()).toBeTruthy();
        // await expect(editCasePage.isAssignToMePresent()).toBeTruthy();

        await expect(editCasePage.isResourcePresent()).toBeTruthy();
        await expect(editCasePage.isActivityPresent()).toBeTruthy();
        await activityTabPo.clickOnRefreshButton();
        await expect(editCasePage.isActivityFeedPresent()).toBeTruthy();
        await expect(editCasePage.isRequesterTextDisplayed()).toBeTruthy();
        await expect(editCasePage.isRequesterImageDisplayed()).toBeTruthy();
        await expect(editCasePage.isSiteTextPresent()).toBeTruthy();

        await expect(changeAssignmentPage.isDropDownDisplayed("AssignedGroup")).toBeTruthy();
        await expect(changeAssignmentPage.isDropDownDisplayed("Assignee")).toBeTruthy();
        
        await expect(editCasePage.getSelectCaseTemplate()).toBe('Select Case Template');
        await editCasePage.clickOnSelectCaseTemplate();
        await caseTemplatePage.selectCaseTemplate(caseTemplateData.templateName);

        await expect(editCasePage.getChangeCaseTemplate()).toBe('Change Case Template');
        await editCasePage.clickSaveCase();
        await expect(editCasePage.isActivityFeedPresent()).toBeTruthy('Activity Feed is not visible');
        await viewCasePage.clickOnRequestersEmail();
        await composemailPage.clickOnDiscardButton();
        await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");

        await viewCasePage.clickEditCaseButton();
        await editCasePage.clickOnRequesterName();
        await utilityCommon.switchToNewTab(1);
        await browser.sleep(5000); // wait until new window gets loaded
        await expect(personProfilePage.getPersonName()).toBe('Adam Pavlik');
        await utilityCommon.switchToNewTab(0);

        await navigationPage.signOut();
        await loginPage.login('qkatawazi');
    });

    //ankagraw
    it('[5577]: [Case Edit] [Assignment] Changing the Assignment when editing the case by the member of one Support Group', async () => {
        let Summary = 'Summary' + Math.floor(Math.random() * 1000000);

        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + Summary);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        let caseID = await viewCasePo.getCaseID();
        await viewCasePage.clickEditCaseButton();
        await changeAssignmentPage.clickAssignToMeBtn();
        expect(await changeAssignmentPage.isDropDownDisplayed("AssignedGroup")).toBeTruthy();
        await changeAssignmentPage.setDropDownValue('Assignee', 'Qiao Feng');
        await editCasePage.clickSaveCase();
        expect(await viewCasePage.getAssigneeText()).toBe('Qiao Feng');

        await viewCasePage.clickEditCaseButton();
        await changeAssignmentPage.setDropDownValue('AssignedGroup', 'AU Support 3');
        await changeAssignmentPage.setDropDownValue('Assignee', 'Qiwei Liu');
        await editCasePage.clickSaveCase();

        await navigationPage.signOut();
        await loginPage.login('qliu');
        await caseConsolePo.searchAndOpenCase(caseID);

        expect(await viewCasePage.getAssignedGroupValue()).toBe('AU Support 3');
        await activityTabPo.clickShowMoreLinkInActivity(1);
        expect(await activityTabPo.getTaskActivity('AU Support 3')).toContain('AU Support 3');
        await viewCasePage.clickEditCaseButton();
        await changeAssignmentPage.setDropDownValue('AssignedGroup', 'US Support 3');
        await changeAssignmentPage.setDropDownValue('Assignee', 'Qadim Katawazi');
        await editCasePage.clickSaveCase();

        await navigationPage.signOut();
        await loginPage.login('qkatawazi');
        await caseConsolePo.searchAndOpenCase(caseID);

        expect(await viewCasePage.getAssignedGroupValue()).toBe('US Support 3');
        await viewCasePage.clickEditCaseButton();
        await changeAssignmentPage.clickAssignToMeBtn();
        await editCasePage.clickSaveCase();
        await activityTabPo.clickShowMoreLinkInActivity(1);
        expect(await activityTabPo.isTextPresentInActivityLog('US Support 3')).toBeTruthy();
        await viewCasePage.clickEditCaseButton();
        await changeAssignmentPage.setDropDownValue('AssignedGroup', 'Compensation and Benefits');
        await editCasePage.clickSaveCase();
        await utilityCommon.closePopUpMessage();
    });

    describe('[59943]: UI fields should be visible for user with login ID contains @ sign', async () => {
        let personData = {
            "firstName": "at Rate",
            "lastName": "test",
            "userId": "j@an",
            "emailId": "j@an@petramco.com",
            "userPermission": ["Case Agent", "Human Resource"]
        }
        let personData1 = {
            "firstName": "at Rate1",
            "lastName": "test",
            "userId": "r@han",
            "emailId": "r@han@petramco.com",
            "userPermission": ["Case Agent", "Human Resource"]
        }
        beforeAll(async () => {
            // await apiHelper.apiLogin('tadmin');
            // await apiHelper.createNewUser(personData);
            // await apiHelper.associatePersonToCompany(personData.userId, 'Petramco');
            // await apiHelper.associatePersonToSupportGroup(personData.userId, 'US Support 1');
            // await apiHelper.createNewUser(personData1);
            // await apiHelper.associatePersonToCompany(personData1.userId, 'Petramco');

            // await browser.sleep(10000); //Wait to update the user in backend
            await navigationPage.signOut();
            await loginPage.login('qheroux');
        });
        it('[59943]: UI fields should be visible for user with login ID contains @ sign', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary('Summary of Customer defect');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.setContactName('qtao');
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePage.isDuplicateFieldsAreNotPresentOnCase()).toBeTruthy();

            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("qtao");
            await createCasePage.setSummary('Summary of Customer defect 1');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePage.isDuplicateFieldsAreNotPresentOnCase()).toBeTruthy();
        });
    });
});
