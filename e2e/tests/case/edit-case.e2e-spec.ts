import { browser } from "protractor";
import loginPage from "../../pageobject/login.po";
import navigationPage from "../../pageobject/navigation.po";
import createCasePage from '../../pageobject/case/create-case.po';
import utilCommon from '../../utils/ui/util.common';
import viewCasePage from "../../pageobject/case/view-case.po"
import editCasePage from '../../pageobject/case/edit-case.po';
import personProfilePage from '../../pageobject/case/person-profile.po';
import composemailPage from '../../pageobject/email/compose-mail.po';
import changeAssignmentPage from '../../pageobject/change-assignemet-blade.po'
import caseTemplatePage from '../../pageobject/case/select-casetemplate-blade.po';

describe('Edit Case', () => {
    beforeAll(async () => {
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    it('DRDMV-3765: [Case] [Edit Case] Edit Case view (UI verification)', async () => {
        let Summary = 'Summary' + Math.floor(Math.random() * 1000000);

        await navigationPage.signOut();
        await loginPage.login('qtao');
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + Summary);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.setContactName('qtao');
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();

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
        await expect(editCasePage.isDescriptionClickable()).toBeTruthy();

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
        console.log("Activity");

        await expect(editCasePage.isRequesterTextDisplayed()).toBeTruthy();
        await expect(editCasePage.isRequesterImageDisplayed()).toBeTruthy();
        await expect(editCasePage.isSiteTextPresent()).toBeTruthy();
        console.log("Requester Text: ");

        await editCasePage.clickOnRequesterName();
        await utilCommon.switchToNewWidnow(1);
        await expect(personProfilePage.getPersonName()).toBe('Adam Pavlik ');
        await browser.close();
        await utilCommon.switchToNewWidnow(0);
        await editCasePage.clickOnRequesterMail();
        await composemailPage.clickOnDiscardButton();
        await utilCommon.clickOnWarningOk();

        await editCasePage.waitForEditCasePageToBeDisplayed();
        await browser.sleep(1000);
        await editCasePage.clickChangeAssignmentButton();
        await expect(changeAssignmentPage.isAssignToMeCheckBoxPresent()).toBeTruthy();
        await expect(changeAssignmentPage.isCompanyDrpDwnDisplayed()).toBeTruthy();
        await expect(changeAssignmentPage.isDepartmentDrpDwnDisplayed()).toBeTruthy();
        await expect(changeAssignmentPage.isBuisnessUnitDrpDwnDisplayed()).toBeTruthy();
        await expect(changeAssignmentPage.isSupportGroupDrpDwnDisplayed()).toBeTruthy();
        await expect(changeAssignmentPage.isAssigneeListPresent()).toBeTruthy();
        await changeAssignmentPage.clickOnCancelButton();
        await editCasePage.waitForEditCasePageToBeDisplayed();
        await expect(editCasePage.getSelectCaseTemplate()).toBe('Select Case Template');
        await editCasePage.clickOnSelectCaseTemplate();
        await caseTemplatePage.clickOnAllTemplateTab();
        await browser.sleep(2000);
        await caseTemplatePage.clickOnFirstCheckBox();
        await caseTemplatePage.clickOnApplyButton();

        await expect(editCasePage.getChangeCaseTemplate()).toBe('Change Case Template');
        await editCasePage.clickSaveCase();
        await expect(editCasePage.isActivityFeedPresent()).toBeTruthy();
        await navigationPage.signOut();
        await loginPage.login('qkatawazi');
    }, 150 * 1000);
});