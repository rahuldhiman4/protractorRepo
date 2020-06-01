import { browser } from "protractor";
import previewCasePo from '../../pageobject/case/case-preview.po';
import createCasePage from '../../pageobject/case/create-case.po';
import editCasePage from '../../pageobject/case/edit-case.po';
import caseTemplatePage from '../../pageobject/case/select-casetemplate-blade.po';
import viewCasePage from "../../pageobject/case/view-case.po";
import changeAssignmentPage from '../../pageobject/common/change-assignment-blade.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import personProfilePage from '../../pageobject/common/person-profile.po';
import composemailPage from '../../pageobject/email/compose-mail.po';
import activityTabPo from '../../pageobject/social/activity-tab.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/utility.common';
import utilityCommon from '../../utils/utility.common';

describe('Edit Case', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    afterEach(async () => {
        await utilityCommon.refresh();
    });

    //ankagraw
    it('[DRDMV-3765]: [Case] [Edit Case] Edit Case view (UI verification)', async () => {
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
        await expect(viewCasePage.getRequesterPhoneNo()).toBe('+19254694006');
        await expect(viewCasePage.getRequesterEmail()).toBe('apavlik@petramco.com');

        await viewCasePage.clickOnContactPersonerDrpDwn();
        await expect(viewCasePage.getContactPersonName()).toBe('Qianru Tao');
        await expect(viewCasePage.getContactPersonerPhoneNo()).toBe('+15123431921');
        await expect(viewCasePage.getContactPersonalEmail()).toBe('qtao@petramco.com');
        await viewCasePage.clickEditCaseButton();

        await expect(editCasePage.getRequesterName()).toBe('Adam Pavlik');
        await expect(editCasePage.getRequesterPhoneNo()).toBe('+19254694006');
        await expect(editCasePage.getRequesterEmail()).toBe('apavlik@petramco.com');

        await expect(editCasePage.isCategoryTier1Disabled()).toBeFalsy();
        await expect(editCasePage.isCategoryTier2Disabled()).toBeFalsy();
        await expect(editCasePage.isCategoryTier3Disabled()).toBeFalsy();
        await expect(editCasePage.isAttachmentLinkClickable()).toBeTruthy();
        await expect(editCasePage.isClearSiteButtonClickable()).toBeTruthy();
        //await expect(editCasePage.isDescriptionClickable()).toBeTruthy(); Is it defect? commented because description CKEditor is always eanbled

        await expect(editCasePage.getAssignedCompanyReadable()).toBeTruthy();
        await expect(editCasePage.getDepartmentCompanyReadable()).toBeTruthy();
        await expect(editCasePage.getAssigneeReadable()).toBeTruthy();
        await expect(editCasePage.getBuisnessUnitReadable()).toBeTruthy();
        await expect(editCasePage.getAssignedGroupReadable()).toBeTruthy();
        await expect(editCasePage.isChangeAssignmentButtonPresent()).toBeTruthy();
        await expect(editCasePage.isAssignToMePresent()).toBeTruthy();

        await expect(editCasePage.isResourcePresent()).toBeTruthy();
        await expect(editCasePage.isActivityPresent()).toBeTruthy();
        await expect(editCasePage.isActivityFeedPresent()).toBeTruthy();
        await expect(editCasePage.isRequesterTextDisplayed()).toBeTruthy();
        await expect(editCasePage.isRequesterImageDisplayed()).toBeTruthy();
        await expect(editCasePage.isSiteTextPresent()).toBeTruthy();

        await editCasePage.clickChangeAssignmentButton();
        await expect(changeAssignmentPage.isCompanyDrpDwnDisplayed()).toBeTruthy();
        await expect(changeAssignmentPage.isDepartmentDrpDwnDisplayed()).toBeTruthy();
        await expect(changeAssignmentPage.isBuisnessUnitDrpDwnDisplayed()).toBeTruthy();
        await expect(changeAssignmentPage.isSupportGroupDrpDwnDisplayed()).toBeTruthy();
        await expect(changeAssignmentPage.isAssigneeListPresent()).toBeTruthy();
        await changeAssignmentPage.clickOnCancelButton();
        await editCasePage.waitForEditCasePageToBeDisplayed();
        await expect(editCasePage.getSelectCaseTemplate()).toBe('Select Case Template');
        await editCasePage.clickOnSelectCaseTemplate();
        await caseTemplatePage.selectCaseTemplate('401K Status');

        await expect(editCasePage.getChangeCaseTemplate()).toBe('Change Case Template');
        await editCasePage.clickSaveCase();
        await expect(editCasePage.isActivityFeedPresent()).toBeTruthy();
        await viewCasePage.clickOnRequestersEmail();
        await composemailPage.clickOnDiscardButton();
        await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");

        await viewCasePage.clickEditCaseButton();
        await editCasePage.clickOnRequesterName();
        await utilityCommon.switchToNewTab(1);
        await expect(personProfilePage.getPersonName()).toBe('Adam Pavlik');
        await utilityCommon.switchToNewTab(0);
   
        await navigationPage.signOut();
        await loginPage.login('qkatawazi');
    });

    //ankagraw
    it('[DRDMV-7063]: [Case Edit] [Assignment] Changing the Assignment when editing the case by the member of one Support Group', async () => {
        let Summary = 'Summary' + Math.floor(Math.random() * 1000000);

        await navigationPage.signOut();
        await loginPage.login('franz');
        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + Summary);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        await viewCasePage.clickEditCaseButton();
        await editCasePage.clickOnAssignToMe();
        await editCasePage.clickChangeAssignmentButton();
        expect(await changeAssignmentPage.isAssignToMeCheckBoxSelected()).toBeFalsy("Checkbox is selected");
        expect(await changeAssignmentPage.getCompanyDefaultValue()).toBe('Petramco');
        expect(await changeAssignmentPage.getSupportGroupDefaultValue()).toBe('Facilities');
        expect(await changeAssignmentPage.isSupportGroupDrpDwnDisplayed()).toBeTruthy();
        await changeAssignmentPage.selectAssignee('Fritz Schulz');
        await changeAssignmentPage.clickOnAssignButton();
        await editCasePage.clickSaveCase();
        expect(await viewCasePage.getAssigneeText()).toBe('Fritz Schulz');

        await viewCasePage.clickEditCaseButton();
        await editCasePage.clickChangeAssignmentButton();
        await changeAssignmentPage.selectBusinessUnit('Australia Support');
        await changeAssignmentPage.selectSupportGroup('AU Support 1');
        await changeAssignmentPage.selectAssigneeAsSupportGroup('AU Support 1');
        await changeAssignmentPage.clickOnAssignButton();
        await editCasePage.clickSaveCase();
        await activityTabPo.clickShowMoreLinkInActivity(1);
        expect(await viewCasePage.getAssignedGroupText()).toBe('AU Support 1');
        expect(await activityTabPo.getAllTaskActivity('AU Support 1')).toBe('AU Support 1');
        await viewCasePage.clickEditCaseButton();
        await editCasePage.clickChangeAssignmentButton();
        await changeAssignmentPage.selectBusinessUnit('United States Support');
        await changeAssignmentPage.selectSupportGroup('US Support 3');
        await changeAssignmentPage.selectAssignee('Qadim Katawazi');
        await changeAssignmentPage.clickOnAssignButton();
        await editCasePage.clickSaveCase();
        await activityTabPo.clickShowMoreLinkInActivity(1);
        expect(await activityTabPo.getAllTaskActivity('US Support 3')).toBe('US Support 3');
        await viewCasePage.clickEditCaseButton();
        await editCasePage.clickOnAssignToMe();
        await editCasePage.clickSaveCase();
        expect(await activityTabPo.isTextPresentInActivityLog('Facilities')).toBeTruthy();
        await viewCasePage.clickEditCaseButton();
        await editCasePage.clickChangeAssignmentButton();
        await changeAssignmentPage.selectBusinessUnit('Facilities Support');
        await changeAssignmentPage.selectSupportGroup('Facilities');
        await changeAssignmentPage.selectAssigneeAsSupportGroup('Facilities');
        await changeAssignmentPage.clickOnAssignButton();
        await editCasePage.clickSaveCase();
        await utilCommon.closePopUpMessage();
    });//, 170 * 1000);
});