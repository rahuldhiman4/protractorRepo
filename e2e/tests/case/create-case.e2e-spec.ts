import { $, browser, protractor, ProtractorExpectedConditions, Key } from "protractor";
import createCasePage from "../../pageobject/case/create-case.po";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import utilCommon from '../../utils/util.common';
import createMenuItems from '../../pageobject/settings/application-config/create-menu-items-blade.po';
import apiHelper from '../../api/api.helper';
import caseConsole from '../../pageobject/case/case-console.po';
import viewCasePo from "../../pageobject/case/view-case.po";
import editCasePo from '../../pageobject/case/edit-case.po';
import utilGrid from '../../utils/util.grid';



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

    fit('DRDMV-17653: Check Resolution Code and Resolution Description fields added on Case View and Status Change blade', async () => {
        let randVal = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        // var randVal:string='DRDMV'+str;
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Application Configuration--Menu Items', 'Menu Items - Business Workflows');
        await createMenuItems.clickOnMenuOptionLink();
        await createMenuItems.selectMenuNameDropDown('Resolution Code');
        await createMenuItems.clickOnLocalizeLink();
        await utilCommon.waitUntilSpinnerToHide();
        await createMenuItems.valueTextBox(randVal);
        await createMenuItems.clickOnSaveButtonOfLocalizeValue();        
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
})
