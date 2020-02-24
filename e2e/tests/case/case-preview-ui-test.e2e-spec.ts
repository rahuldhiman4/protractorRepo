import { browser, protractor, ProtractorExpectedConditions } from "protractor";
import apiHelper from '../../api/api.helper';
import casePreviewPo from '../../pageobject/case/case-preview.po';
import createCasePo from '../../pageobject/case/create-case.po';
import quickCasePo from '../../pageobject/case/quick-case.po';
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import viewCasePo from '../../pageobject/case/view-case.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import utilCommon from '../../utils/util.common';

describe("Case Preview", () => {
    const EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    beforeAll(async () => {
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
        await loginPage.login("qtao");
    });

    afterEach(async () => {
        await browser.refresh();
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    //kgaikwad
    it('[DRDMV-13703]: Navigate the Case from Quick Case->Preview Case->Case Full view', async () => {
        let caseSummary = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotoQuickCase();
        await quickCasePo.selectRequesterName('qkatawazi');
        await quickCasePo.setCaseSummary(caseSummary);
        await quickCasePo.saveCase();
        await casePreviewPo.clickOnViewCaseButton();
        expect(await viewCasePo.isEditLinkDisplay()).toBeTruthy('On View Case page edit button not present');
    });

    //kgaikwad
    it('[DRDMV-13640]: Create a Case via Quick Case and check Case Preview screen', async () => {
        let caseSummary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotoQuickCase();
        await quickCasePo.selectRequesterName('qkatawazi');
        await quickCasePo.selectCaseTemplate('Change My Legal Name');
        await quickCasePo.setCaseSummary(caseSummary);
        await quickCasePo.saveCase();
        expect(await casePreviewPo.isTitleDisplayed()).toBeTruthy('Case Preview Title is missing');
        expect(await casePreviewPo.isCaseSummaryDisplayed(caseSummary)).toBeTruthy('Summary is missing');
        expect(await casePreviewPo.isCaseIdDisplayed()).toBeTruthy('Case ID is missing');
        expect(await casePreviewPo.isPriorityDisplayed('Medium')).toBeTruthy('Priority is missing');
        expect(await casePreviewPo.isCaseStatusDisplayed('Assigned')).toBeTruthy('Case Status is missing');
        expect(await casePreviewPo.isRequesterNameDisplayed('Qadim Katawazi')).toBeTruthy('Requester name is missing');
        expect(await casePreviewPo.isRequesterPhoneDisplayed('+15123431923')).toBeTruthy('Requester phone number is missing');
        expect(await casePreviewPo.isRequesterEmailIdDisplayed('qkatawazi@petramco.com')).toBeTruthy('Requester email id is missing');
        expect(await casePreviewPo.isCaseTemplateDisplayed('Change My Legal Name')).toBeTruthy('Case Template is missing');
        expect(await casePreviewPo.isDescriptionDisplayed('Qadim Katawazi Change My Legal Name ' + caseSummary)).toBeTruthy('Description is missing');
        expect(await casePreviewPo.isCategoryTier1Displayed('Workforce Administration')).toBeTruthy('CategoryTier1 is missing');
        expect(await casePreviewPo.isCategoryTier2Displayed('HR Operations')).toBeTruthy('CategoryTier2 is missing');
        expect(await casePreviewPo.isCategoryTier3Displayed('Adjustments')).toBeTruthy('CategoryTier3 is missing');
        expect(await casePreviewPo.isAssigneeDisplayed('Al Allbrook')).toBeTruthy('Assignee name is missing');
        expect(await casePreviewPo.isAssignedGroupDisplayed('Workforce Administration')).toBeTruthy('Assigned group name is missing');
        expect(await casePreviewPo.isAssignedCompanyDisplayed('Petramco')).toBeTruthy('Assigned company name is missing');
        expect(await casePreviewPo.isViewCaseButtonDisplayed()).toBeTruthy('View Case button is missing');
        expect(await casePreviewPo.isCreateNewCaseButtonDisplayed()).toBeTruthy('Create New Case button is missing');
    });

    //kgaikwad
    it('[DRDMV-14110]: Create a Case without template via Quick Case and check Case Preview screen', async () => {
        let caseSummary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotoQuickCase();
        await quickCasePo.selectRequesterName('qkatawazi');
        await quickCasePo.setCaseSummary(caseSummary);
        await quickCasePo.saveCase();
        expect(await casePreviewPo.isTitleDisplayed()).toBeTruthy('Case Preview Title is missing');
        expect(await casePreviewPo.isCaseSummaryDisplayed(caseSummary)).toBeTruthy('Summary is missing');
        expect(await casePreviewPo.isCaseIdDisplayed()).toBeTruthy('Case ID is missing');
        expect(await casePreviewPo.isPriorityDisplayed('Medium')).toBeTruthy('Priority is missing');
        expect(await casePreviewPo.isCaseStatusDisplayed('New')).toBeTruthy('Case Status is missing');
        expect(await casePreviewPo.isRequesterNameDisplayed('Qadim Katawazi')).toBeTruthy('Requester name is missing');
        expect(await casePreviewPo.isRequesterPhoneDisplayed('+15123431923')).toBeTruthy('Requester phone number is missing');
        expect(await casePreviewPo.isRequesterEmailIdDisplayed('qkatawazi@petramco.com')).toBeTruthy('Requester email id is missing');
        expect(await casePreviewPo.isCaseTemplateDisplayed('Change My Legal Name')).toBeFalsy('Case Template is displayed');
        expect(await casePreviewPo.isDescriptionDisplayed('Qadim Katawazi ' + caseSummary)).toBeTruthy('Description is missing');
        expect(await casePreviewPo.isCategoryTier1Displayed('')).toBeTruthy('CategoryTier1 is missing');
        expect(await casePreviewPo.isCategoryTier2Displayed('')).toBeTruthy('CategoryTier2 is missing');
        expect(await casePreviewPo.isCategoryTier3Displayed('')).toBeTruthy('CategoryTier3 is missing');
        expect(await casePreviewPo.isAssigneeDisplayed('None')).toBeTruthy('Assignee name is missing');
        expect(await casePreviewPo.isAssignedGroupDisplayed('Workforce Administration')).toBeTruthy('Assigned group name is missing');
        expect(await casePreviewPo.isAssignedCompanyDisplayed('Petramco')).toBeTruthy('Assigned company name is missing');
        expect(await casePreviewPo.isViewCaseButtonDisplayed()).toBeTruthy('View Case button is missing');
        expect(await casePreviewPo.isCreateNewCaseButtonDisplayed()).toBeTruthy('Create New Case button is missing');
    });

    //kgaikwad
    it('[DRDMV-13642,DRDMV-13641]: Create a Case from console with Template and check Case Preview', async () => {
        let caseSummary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotCreateCase();
        await createCasePo.selectRequester('qkatawazi');
        await createCasePo.setSummary(caseSummary);
        await createCasePo.clickSelectCaseTemplateButton();
        await selectCasetemplateBladePo.selectCaseTemplate('Change My Legal Name');
        await createCasePo.clickSaveCaseButton();
        expect(await casePreviewPo.isCaseSummaryDisplayed(caseSummary)).toBeTruthy('Summary is missing');
        expect(await casePreviewPo.isCaseIdDisplayed()).toBeTruthy('Case ID is missing');
        expect(await casePreviewPo.isPriorityDisplayed('Medium')).toBeTruthy('Priority is missing');
        expect(await casePreviewPo.isCaseStatusDisplayed('Assigned')).toBeTruthy('Case Status is missing');
        expect(await casePreviewPo.isRequesterNameDisplayed('Qadim Katawazi')).toBeTruthy('Requester name is missing');
        expect(await casePreviewPo.isRequesterPhoneDisplayed('+15123431923')).toBeTruthy('Requester phone number is missing');
        expect(await casePreviewPo.isRequesterEmailIdDisplayed('qkatawazi@petramco.com')).toBeTruthy('Requester email id is missing');
        expect(await casePreviewPo.isCaseTemplateDisplayed('Change My Legal Name')).toBeTruthy('Case Template is missing');
        expect(await casePreviewPo.isDescriptionDisplayed('The employee has changed their name and needs our records updated.')).toBeTruthy('Description is missing');
        expect(await casePreviewPo.isCategoryTier1Displayed('Workforce Administration')).toBeTruthy('CategoryTier1 is missing');
        expect(await casePreviewPo.isCategoryTier2Displayed('HR Operations')).toBeTruthy('CategoryTier2 is missing');
        expect(await casePreviewPo.isCategoryTier3Displayed('Adjustments')).toBeTruthy('CategoryTier3 is missing');
        expect(await casePreviewPo.isAssigneeDisplayed('Al Allbrook')).toBeTruthy('Assignee name is missing');
        expect(await casePreviewPo.isAssignedGroupDisplayed('Workforce Administration')).toBeTruthy('Assigned group name is missing');
        expect(await casePreviewPo.isAssignedCompanyDisplayed('Petramco')).toBeTruthy('Assigned company name is missing');
        expect(await casePreviewPo.isViewCaseButtonDisplayed()).toBeTruthy('View Case button is missing');
        expect(await casePreviewPo.isCreateNewCaseButtonDisplayed()).toBeTruthy('Create New Case button is missing');
        expect(await casePreviewPo.isTitleDisplayed()).toBeTruthy('Case Preview Title is missing');
    }, 120 * 1000);

    //kgaikwad
    it('[DRDMV-13666,DRDMV-13672]: Create a Quick Case and Click on Back button on Case Preview blade', async () => {
        let caseSummary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotoQuickCase();
        await quickCasePo.selectRequesterName('qkatawazi');
        await quickCasePo.setCaseSummary(caseSummary);
        await quickCasePo.saveCase();
        await expect(await utilCommon.getPopUpMessage()).toBe('Saved successfully');
        await casePreviewPo.clickOncreateNewCaseButton();
        await expect(await quickCasePo.getTextOfSummaryTextBox()).toBe('', 'Quick case summary text box is not empty');
    });

    //kgaikwad
    it('[DRDMV-13680]: UI Validation for Fields on Case Preview Page', async () => {
        let caseSummary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let description = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let filePath = '../../../data/ui/attachment/demo.txt';
        let menuItemDataFile = require('../../data/ui/ticketing/menuItem.ui.json');
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let label = await menuItemDataFile['sampleMenuItem'].menuItemName + randomStr;
        menuItemDataFile['sampleMenuItem'].menuItemName = label;
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createNewMenuItem(menuItemDataFile['sampleMenuItem']);

        await navigationPage.gotCreateCase();
        await createCasePo.selectRequester('Elizabeth Peters');
        await createCasePo.setLabel(label);
        await createCasePo.setSummary(caseSummary);
        await createCasePo.setContactName('qtao');
        await createCasePo.setDescription(description);
        await createCasePo.clickSelectCaseTemplateButton();
        await selectCasetemplateBladePo.selectCaseTemplate('Change My Legal Name');
        await createCasePo.clickAssignToMeButton();
        await createCasePo.clickSaveCaseButton();

        expect(await casePreviewPo.isCaseSummaryDisplayed(caseSummary)).toBeTruthy('Summary is missing');
        expect(await casePreviewPo.isCaseIdDisplayed()).toBeTruthy('Case ID is missing');
        expect(await casePreviewPo.isPriorityDisplayed('Medium')).toBeTruthy('Priority is missing');
        expect(await casePreviewPo.isCaseStatusDisplayed('Assigned')).toBeTruthy('Case Status is missing');
        expect(await casePreviewPo.isRequesterNameDisplayed('Elizabeth Peters')).toBeTruthy('Requester name is missing');
        expect(await casePreviewPo.isRequesterPhoneDisplayed('+19255553456')).toBeTruthy('Requester phone number is missing');
        expect(await casePreviewPo.isRequesterEmailIdDisplayed('elizabeth.peters@petramco.com')).toBeTruthy('Requester email id is missing');
        expect(await casePreviewPo.isSourceDisplayed('Agent')).toBeTruthy('Agent is missing');
        expect(await casePreviewPo.isLabelDisplayed(label)).toBeTruthy('label is missing');
        expect(await casePreviewPo.isCaseSiteDisplayed('Rochester')).toBeTruthy('Case site is missing');
        expect(await casePreviewPo.isCaseTemplateDisplayed('Change My Legal Name')).toBeTruthy('Case Template is missing');
        expect(await casePreviewPo.isDescriptionDisplayed(description)).toBeTruthy('Description is missing');
        expect(await casePreviewPo.isCategoryTier1Displayed('Workforce Administration')).toBeTruthy('CategoryTier1 is missing');
        expect(await casePreviewPo.isCategoryTier2Displayed('HR Operations')).toBeTruthy('CategoryTier2 is missing');
        expect(await casePreviewPo.isCategoryTier3Displayed('Adjustments')).toBeTruthy('CategoryTier3 is missing');
        expect(await casePreviewPo.isAssigneeDisplayed('Qianru Tao')).toBeTruthy('Assignee name is missing');
        expect(await casePreviewPo.isAssignedGroupDisplayed('Compensation and Benefits')).toBeTruthy('Assigned group name is missing');
        expect(await casePreviewPo.isAssignedCompanyDisplayed('Petramco')).toBeTruthy('Assigned company name is missing');
        expect(await casePreviewPo.isViewCaseButtonDisplayed()).toBeTruthy('View Case button is missing');
        expect(await casePreviewPo.isCreateNewCaseButtonDisplayed()).toBeTruthy('Create New Case button is missing');
        expect(await casePreviewPo.isTitleDisplayed()).toBeTruthy('Case Preview Title is missing');
    });

    //kgaikwad
    it('[DRDMV-13644]: Create a Case via Quick Case by pinning articles and cases and check Case Preview on save', async () => {
        let caseSummary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotoQuickCase();
        await quickCasePo.selectRequesterName('qkatawazi');
        await quickCasePo.selectCaseTemplate('Generate Employee Verification Letter');
        await quickCasePo.setCaseSummary(caseSummary);
        await quickCasePo.pinRecommendedKnowledgeArticles(2);
        await quickCasePo.pinRecommendedCases(2);
        await quickCasePo.saveCase();

        expect(await casePreviewPo.isTitleDisplayed()).toBeTruthy('failureMsg: Case Preview Title is missing');
        expect(await casePreviewPo.isCaseSummaryDisplayed(caseSummary)).toBeTruthy('failureMsg: Summary is missing');
        expect(await casePreviewPo.isCaseIdDisplayed()).toBeTruthy('failureMsg: Case ID is missing');
        expect(await casePreviewPo.isPriorityDisplayed('High')).toBeTruthy('failureMsg: Priority is missing');
        expect(await casePreviewPo.isCaseStatusDisplayed('Assigned')).toBeTruthy('failureMsg: Case Status is missing');
        expect(await casePreviewPo.isRequesterNameDisplayed('Qadim Katawazi')).toBeTruthy('failureMsg: Requester name is missing');
        expect(await casePreviewPo.isRequesterPhoneDisplayed('+15123431923')).toBeTruthy('Requester phone number is missing');
        expect(await casePreviewPo.isRequesterEmailIdDisplayed('qkatawazi@petramco.com')).toBeTruthy('failureMsg: Requester email id is missing');
        expect(await casePreviewPo.isCaseTemplateDisplayed('Change My Legal Name')).toBeFalsy('failureMsg: Case Template is displayed');
        expect(await casePreviewPo.isDescriptionDisplayed('Qadim Katawazi Generate Employee Verification Letter ' + caseSummary)).toBeTruthy('failureMsg: Description is missing');
        expect(await casePreviewPo.isCategoryTier1Displayed('Workforce Administration')).toBeTruthy('failureMsg: CategoryTier1 is missing');
        expect(await casePreviewPo.isCategoryTier2Displayed('HR Operations')).toBeTruthy('failureMsg: CategoryTier2 is missing');
        expect(await casePreviewPo.isCategoryTier3Displayed('Employment Verification')).toBeTruthy('failureMsg: CategoryTier3 is missing');
        expect(await casePreviewPo.isAssigneeDisplayed('Al Allbrook')).toBeTruthy('failureMsg: Assignee name is missing');
        expect(await casePreviewPo.isAssignedGroupDisplayed('Workforce Administration')).toBeTruthy('failureMsg: Assigned group name is missing');
        expect(await casePreviewPo.isAssignedCompanyDisplayed('Petramco')).toBeTruthy('failureMsg: Assigned company name is missing');
        expect(await casePreviewPo.isViewCaseButtonDisplayed()).toBeTruthy('failureMsg: View Case button is missing');
        expect(await casePreviewPo.isCreateNewCaseButtonDisplayed()).toBeTruthy('failureMsg: Create New Case button is missing');
    });
}) 