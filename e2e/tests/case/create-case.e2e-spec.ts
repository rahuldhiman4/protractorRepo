import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";
import caseConsolePage from '../../pageobject/case/case-console.po';
import createCasePage from "../../pageobject/case/create-case.po";
import editCasePage from '../../pageobject/case/edit-case.po';
import selectCaseTemplateBlade from '../../pageobject/case/select-casetemplate-blade.po';
import viewCasePage from "../../pageobject/case/view-case.po";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import consoleCasetemplatePo from '../../pageobject/settings/case-management/console-casetemplate.po';
import createCaseTemplate from '../../pageobject/settings/case-management/create-casetemplate.po';
import utilCommon from '../../utils/util.common';
import createMenuItems from '../../pageobject/settings/application-config/create-menu-items-blade.po';
import apiHelper from '../../api/api.helper';
import caseConsole from '../../pageobject/case/case-console.po';
import viewCasePo from "../../pageobject/case/view-case.po";
import editCasePo from '../../pageobject/case/edit-case.po';
import utilGrid from '../../utils/util.grid';
import menuItemConsole from '../../pageobject/settings/application-config/menu-items-config-console.po';
import editMenuItemsConfigPo from '../../pageobject/settings/application-config/edit-menu-items-config.po';
import localizeValuePopPo from '../../pageobject/common/localize-value-pop.po';

describe("Create Case", () => {
    const EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    const requester = "Requester";
    const contact = "Contact";

    beforeAll(async () => {
        browser.waitForAngularEnabled(false);
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
        await loginPage.login("qkatawazi");
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    afterEach(async () => {
        await browser.refresh();
        await utilCommon.waitUntilSpinnerToHide();
    });

    it('DRDMV-15253: Verify Category Tier 4 Can be Populated After Tier 3 selection', async () => {
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester('adam');
        await createCasePage.setSummary('set summary');
        await createCasePage.selectCategoryTier1('Applications');
        await createCasePage.selectCategoryTier2('Social');
        await createCasePage.selectCategoryTier3('Chatter');
        await createCasePage.selectCategoryTier4('Failure');
    })

    it('DRDMV-17653: Check Resolution Code and Resolution Description fields added on Case View and Status Change blade', async () => {
        let randVal = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        // var randVal:string='DRDMV'+str;
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Application Configuration--Menu Items', 'Menu Items - Business Workflows');
        await createMenuItems.clickOnMenuOptionLink();
        await createMenuItems.selectMenuNameDropDown('Resolution Code');
        await createMenuItems.clickOnLocalizeLink();
        await utilCommon.waitUntilSpinnerToHide();
        await localizeValuePopPo.valueTextBox(randVal);
        await localizeValuePopPo.clickOnSaveButton();
        await createMenuItems.clickOnSaveButton();
        await utilCommon.waitUntilPopUpDisappear();
        await utilGrid.searchRecord(randVal);
        await navigationPage.gotoCaseConsole();
        var caseData =
        {
            "Requester": "qtao",
            "Summary": "Test case for DRDMV-2530",
            "Support Group": "Compensation and Benefits",
            "Assignee": "qkatawazi"
        }
        await apiHelper.apiLogin('qkatawazi');
        var newCase1 = await apiHelper.createCase(caseData);
        var caseId: string = newCase1.displayId;
        await caseConsole.searchAndOpenCase(caseId);
        expect(await $(viewCasePo.selectors.resolutionCodeText).isDisplayed()).toBeTruthy('Missing Resolution Text');
        expect(await $(viewCasePo.selectors.resolutionDescriptionText).isDisplayed()).toBeTruthy('Missing Resolution Description Text');
        await viewCasePo.clickEditCaseButton();
        await editCasePo.updateResolutionCode(randVal);
        await editCasePo.updateResolutionDescription(randVal);
        await editCasePo.clickSaveCase();
        await utilCommon.waitUntilSpinnerToHide();
        await viewCasePo.changeCaseStatus('Resolved');
        await viewCasePo.setStatusReason('Customer Follow-Up Required');
        await viewCasePo.selectResolutionCodeDropDown(randVal);
        expect(await viewCasePo.isResolutionDescriptionTextBoxEmpty()).toBeFalsy('Resolution Description Text Box is not empty');
        await viewCasePo.clickSaveStatus();
        await utilCommon.waitUntilPopUpDisappear();
        expect(await viewCasePo.getTextOfStatus()).toBe('Resolved');
        await viewCasePo.changeCaseStatus('Closed');
        await viewCasePo.selectResolutionCodeDropDown(randVal);
        expect(await viewCasePo.isResolutionDescriptionTextBoxEmpty()).toBeFalsy('Resolution Description Text Box is not empty');
        await viewCasePo.clickSaveStatus();
        await utilCommon.waitUntilPopUpDisappear();
        expect(await viewCasePo.getTextOfStatus()).toBe('Closed');
    }, 130 * 1000);

    it('DRDMV-18031: [UI]Resolution Code can be view on Case with respect to input in field "Available on UI"', async () => {
        let randVal = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Application Configuration--Menu Items', 'Menu Items - Business Workflows');
        await createMenuItems.clickOnMenuOptionLink();
        await createMenuItems.selectMenuNameDropDown('Resolution Code');
        await createMenuItems.clickOnLocalizeLink();
        await utilCommon.waitUntilSpinnerToHide();
        await localizeValuePopPo.valueTextBox(randVal);
        await localizeValuePopPo.clickOnSaveButton();
        await utilCommon.waitUntilSpinnerToHide();
        await createMenuItems.selectStatusDropDown('Active');
        await createMenuItems.selectAvailableOnUiToggleButton(true);
        await createMenuItems.clickOnSaveButton();
        await utilCommon.waitUntilPopUpDisappear();

        await navigationPage.gotoCaseConsole();
        var caseData1 =
        {
            "Requester": "qtao",
            "Summary": "Test case for DRDMV-2530",
            "Support Group": "Compensation and Benefits",
            "Assignee": "qkatawazi"
        }
        await apiHelper.apiLogin('qkatawazi');
        var newCase1 = await apiHelper.createCase(caseData1);
        var caseId1: string = newCase1.displayId;
        await caseConsole.searchAndOpenCase(caseId1);
        await viewCasePo.clickEditCaseButton();
        await editCasePo.updateResolutionCode(randVal);
        await editCasePo.clickSaveCase();
        await utilCommon.waitUntilSpinnerToHide();

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Application Configuration--Menu Items', 'Menu Items - Business Workflows');
        await utilCommon.waitUntilSpinnerToHide();
        await menuItemConsole.searchAndEditMenuOption(randVal);
        await editMenuItemsConfigPo.selectAvailableOnUIToggleButton(false);
        await editMenuItemsConfigPo.clickOnSaveButton();
        await utilCommon.waitUntilPopUpDisappear();

        await navigationPage.gotoCaseConsole();
        var caseData2 =
        {
            "Requester": "qtao",
            "Summary": "Test case for DRDMV-2530",
            "Support Group": "Compensation and Benefits",
            "Assignee": "qkatawazi"
        }
        await apiHelper.apiLogin('qkatawazi');
        var newCase2 = await apiHelper.createCase(caseData2);
        var caseId2: string = newCase2.displayId;
        await caseConsole.searchAndOpenCase(caseId2);
        await viewCasePo.clickEditCaseButton();
        expect(await editCasePo.isValuePresentInResolutionCode(randVal)).toBeFalsy('RandomCode is missing');
        await editCasePo.clickOnCancelCaseButton();
        await utilCommon.clickOnWarningOk();
        await utilCommon.waitUntilSpinnerToHide();
        await navigationPage.gotoCaseConsole();
        await caseConsole.searchAndOpenCase(caseId1);
        await viewCasePo.clickEditCaseButton();
        expect(await editCasePo.isValuePresentInResolutionCode(randVal)).toBeFalsy('RandomCode is missing');
    }, 180 * 1000);

    it('DRDMV-16081: Verify allow case reopen tag in case template', async () => {
        try {
            await browser.refresh();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let caseTemplate1 = 'Case Template 1' + randomStr;
            let caseTemplate2 = 'Case Template 2' + randomStr;

            let caseTemplateSummary1 = 'Summary 1' + randomStr;
            let caseTemplateSummary2 = 'Summary 2' + randomStr;

            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');

            //case template with reopen case
            await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
            await createCaseTemplate.setTemplateName(caseTemplate1);
            await createCaseTemplate.setCompanyName('Petramco');
            await createCaseTemplate.setCaseSummary(caseTemplateSummary1);
            await createCaseTemplate.setAllowCaseReopenValue('Yes');
            await createCaseTemplate.setTemplateStatusDropdownValue('Active')
            await createCaseTemplate.clickSaveCaseTemplate();

            //case template with reopen case
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows')).toEqual('Case Templates - Business Workflows');
            await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
            await createCaseTemplate.setTemplateName(caseTemplate2);
            await createCaseTemplate.setCompanyName('Petramco');
            await createCaseTemplate.setCaseSummary(caseTemplateSummary2);
            await createCaseTemplate.setAllowCaseReopenValue('No');
            await createCaseTemplate.setTemplateStatusDropdownValue('Active')
            await createCaseTemplate.clickSaveCaseTemplate();

            //create case
            await navigationPage.gotCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('Summary');
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCaseTemplateBlade.selectCaseTemplate(caseTemplate1);
            await createCasePage.clickAssignToMeButton();

            await createCasePage.clickSaveCaseButton();
            await createCasePage.clickGoToCaseButton();
            await viewCasePage.changeCaseStatus('In Progress');
            await viewCasePage.clickSaveStatus();
            await viewCasePage.changeCaseStatus('Resolved');
            await viewCasePage.setStatusReason('Auto Resolved');
            await viewCasePage.clickSaveStatus();
            await viewCasePage.changeCaseStatus('Closed');
            await viewCasePage.clickSaveStatus();
            await viewCasePage.clickOnReopenCaseLink();

            //add second case template
            await viewCasePage.clickEditCaseButton();
            await editCasePage.clickOnChangeCaseTemplate();
            await selectCaseTemplateBlade.selectCaseTemplate(caseTemplate2);
            await createCasePage.clickSaveCaseButton();
            await createCasePage.clickGoToCaseButton();
            await viewCasePage.changeCaseStatus('In Progress');
            await viewCasePage.clickSaveStatus();
            await viewCasePage.changeCaseStatus('Resolved');
            await viewCasePage.setStatusReason('Auto Resolved');
            await viewCasePage.clickSaveStatus();
            await viewCasePage.changeCaseStatus('Closed');
            await viewCasePage.clickSaveStatus();
            await expect(viewCasePage.isCaseReopenLinkPresent()).toBeFalsy();
        } catch (error) {
            console.log(error);
            await expect(true).toBeFalsy();
        } finally {
            await browser.refresh();
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        }
    })

    it('DRDMV-1191,DRDMV-1198: [Case Creation] Case creation with/without mandatory fields populated ', async () => {
        try {
            let prioirtyValue: string[] = ["Critical", "High", "Medium", "Low"];
            const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let caseSummary = 'Case Summary ' + randomStr;

            await navigationPage.gotCreateCase();
            await expect(createCasePage.isSaveCaseButtonEnabled()).toBeFalsy("Save button is enabled");
            await createCasePage.selectRequester('adam');
            await createCasePage.clickSaveCaseButtonWithoutMessageDisappear();
            await expect(await utilCommon.getPopUpMessage()).toBe('Resolve the field validation errors and then try again.');
            await utilCommon.closePopUpMessage();
            await utilCommon.waitUntilPopUpDisappear();
            await createCasePage.setSummary(caseSummary);
            await createCasePage.allPriorityOptionsPresent(prioirtyValue);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await createCasePage.clickGoToCaseButton();
            await expect(viewCasePage.getPriorityValue()).toBe('Medium');
            await navigationPage.gotoCaseConsole();
            await caseConsolePage.setCaseSearchBoxValue(caseSummary);
            await expect(caseConsolePage.isCaseIdHyperlinked()).toBeTruthy('Unable to find the created case');
        } catch (error) {
            console.log(error);
            await expect(true).toBeFalsy();
        } finally {
            await browser.refresh();
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        }
    });

    it('DRDMV-1193,DRDMV-1190: [Case Creation] Case Create view (UI verification) ', async () => {
        try {
            await browser.refresh();
            await navigationPage.signOut();
            await loginPage.login('qtao');
            const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let caseSummary = 'Summary ' + randomStr;

            await navigationPage.gotCreateCase();
            await expect(createCasePage.isRequesterRequiredTextPresent()).toBeTruthy("required text present in Request");
            await expect(createCasePage.isSummaryRequiredTextPresent()).toBeTruthy("required text present in Summary");
            await expect(createCasePage.isPriorityRequiredTextPresent()).toBeTruthy("required text present in Priority");
            await expect(createCasePage.isAssignedCompanyRequiredTextPresent()).toBeTruthy("required text present in Assigned Company");
            await expect(createCasePage.isSelectCaseTemplateButtonEnabled()).toBeFalsy("Select Case template is Disabled");
            await expect(createCasePage.isClearTemplateButtonEnabled()).toBeFalsy("Clear Template is Disabled");
            await expect(createCasePage.isAutocategorizationEnabled()).toBeFalsy("Autocategorization is Disabled");
            await expect(createCasePage.isAssignedCompanyReadOnly()).toBeTruthy("Assigned Company read only");
            await expect(createCasePage.isBuisnessUnitReadOnly()).toBeTruthy("BuisnessUnit read only");
            await expect(createCasePage.isDepartmentReadOnly()).toBeTruthy("Department read only");
            await expect(createCasePage.isAssignedGroupReadOnly()).toBeTruthy("Assigned group read only");
            await expect(createCasePage.isAssigneeReadOnly()).toBeTruthy("Assignee read only");
            await expect(createCasePage.isAttachmentButtonDisplayed()).toBeTruthy("Attachment button not displayed");
            await expect(createCasePage.isSaveCaseButtonEnabled()).toBeFalsy("Save button is enables")
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary(caseSummary);
            await createCasePage.setDescription('Description');
            await createCasePage.setContactName('kye');
            await createCasePage.selectCategoryTier1('Applications');
            await createCasePage.selectCategoryTier2('Social');
            await createCasePage.selectCategoryTier3('Chatter');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await createCasePage.clickGoToCaseButton();
            await expect(viewCasePage.getCaseSummary()).toBe(caseSummary);
            await expect(viewCasePage.getCategoryTier1Value()).toBe('Applications');
            await expect(viewCasePage.getCategoryTier2Value()).toBe('Social');
            await expect(viewCasePage.getCategoryTier3Value()).toBe('Chatter');
            await navigationPage.gotoCaseConsole();
            await caseConsolePage.setCaseSearchBoxValue(caseSummary);
            await expect(caseConsolePage.isCaseIdHyperlinked()).toBeTruthy('Unable to find the created case');
        } catch (error) {
            console.log(error);
            await expect(true).toBeFalsy();
        } finally {
            await browser.refresh();
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        }

    })
});
