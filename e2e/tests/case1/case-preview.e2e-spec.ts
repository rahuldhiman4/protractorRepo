import { cloneDeep } from 'lodash';
import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import { SAMPLE_MENU_ITEM } from '../../data/ui/ticketing/menu.item.ui';
import casePreviewPo from '../../pageobject/case/case-preview.po';
import createCasePo from '../../pageobject/case/create-case.po';
import quickCasePo from '../../pageobject/case/quick-case.po';
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import resources from '../../pageobject/common/resources-tab.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';

let caseTemplateName = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('') + "Preview";

describe("Case Preview", () => {

    let caseTemplateData;

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login("qtao");
        let templateData = {
            "templateName": caseTemplateName,
            "templateSummary": 'My legal name has changed and I need it updated.',
            "categoryTier1": "Employee Relations",
            "categoryTier2": "Compensation",
            "categoryTier3": "Bonus",
            "casePriority": "Medium",
            "templateStatus": "Active",
            "company": "Petramco",
            "businessUnit": "United States Support",
            "supportGroup": "US Support 3",
            "assignee": "qkatawazi",
            "ownerBU": "United States Support",
            "ownerGroup": "US Support 3"
        }
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createCaseTemplate(templateData);

        caseTemplateData = {
            "templateName": 'Paid Time Off Request ' + caseTemplateName,
            "templateSummary": 'Employee has asked for time off.',
            "description": "Register the time off in the HCM system and verify they have enough PTO remaining.",
            "categoryTier1": "Total Rewards",
            "categoryTier2": "Leave",
            "categoryTier3": "PTO",
            "casePriority": "High",
            "templateStatus": "Active",
            "caseStatus": "Assigned",
            "company": "Petramco",
            "businessUnit": "HR Support",
            "supportGroup": "Compensation and Benefits",
            "ownerBU": "United States Support",
            "ownerGroup": "US Support 3"
        }
        await apiHelper.apiLogin('tadmin');
        await apiHelper.createCaseTemplate(caseTemplateData);
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //kgaikwad
    it('[4675]: Create a Case via Quick Case and check Case Preview screen', async () => {
        let caseSummary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotoQuickCase();
        await quickCasePo.selectRequesterName('qkatawazi');
        await quickCasePo.selectCaseTemplate(caseTemplateName);
        await quickCasePo.setCaseSummary(caseSummary);
        await quickCasePo.saveCase();
        expect(await casePreviewPo.isTitleDisplayed()).toBeTruthy('Case Preview Title is missing');
        expect(await casePreviewPo.isCaseSummaryDisplayed(caseSummary)).toBeTruthy('Summary is missing');
        expect(await casePreviewPo.isCaseIdDisplayed()).toBeTruthy('Case ID is missing');
        expect(await casePreviewPo.isPriorityDisplayed('Medium')).toBeTruthy('Priority is missing');
        expect(await casePreviewPo.isCaseStatusDisplayed('Assigned')).toBeTruthy('Case Status is missing');
        expect(await casePreviewPo.isRequesterNameDisplayed('Qadim Katawazi')).toBeTruthy('Requester name is missing');
        expect(await casePreviewPo.isRequesterPhoneDisplayed('1 512 343-1923')).toBeTruthy('Requester phone number is missing');
        expect(await casePreviewPo.isRequesterEmailIdDisplayed('qkatawazi@petramco.com')).toBeTruthy('Requester email id is missing');
        expect(await casePreviewPo.isCaseTemplateDisplayed(caseTemplateName)).toBeTruthy('Case Template is missing');
        expect(await casePreviewPo.isDescriptionDisplayed('Qadim Katawazi ' + caseTemplateName + ' ' + caseSummary)).toBeTruthy('Description is missing');
        expect(await casePreviewPo.isCategoryTier1Displayed('Employee Relations')).toBeTruthy('CategoryTier1 is missing');
        expect(await casePreviewPo.isCategoryTier2Displayed('Compensation')).toBeTruthy('CategoryTier2 is missing');
        expect(await casePreviewPo.isCategoryTier3Displayed('Bonus')).toBeTruthy('CategoryTier3 is missing');
        expect(await casePreviewPo.isAssigneeDisplayed('Qadim Katawazi')).toBeTruthy('Assignee name is missing');
        expect(await casePreviewPo.getAssigneeDetails()).toContain('US Support 3', 'Assigned group name is missing');
        expect(await casePreviewPo.getAssigneeDetails()).toContain('Petramco', 'Assigned company name is missing');
        expect(await casePreviewPo.isCreateNewCaseButtonDisplayed()).toBeTruthy('Create New Case button is missing');
        await casePreviewPo.clickGoToCaseButton();
    });

    //kgaikwad
    it('[4582]: Create a Case without template via Quick Case and check Case Preview screen', async () => {
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
        expect(await casePreviewPo.isRequesterPhoneDisplayed('1 512 343-1923')).toBeTruthy('Requester phone number is missing');
        expect(await casePreviewPo.isRequesterEmailIdDisplayed('qkatawazi@petramco.com')).toBeTruthy('Requester email id is missing');
        expect(await casePreviewPo.isDescriptionDisplayed('Qadim Katawazi ' + caseSummary)).toBeTruthy('Description is missing');
        expect(await casePreviewPo.isCategoryTier1Displayed('-')).toBeTruthy('CategoryTier1 is missing');
        expect(await casePreviewPo.isCategoryTier2Displayed('-')).toBeTruthy('CategoryTier2 is missing');
        expect(await casePreviewPo.isCategoryTier3Displayed('-')).toBeTruthy('CategoryTier3 is missing');
        expect(await casePreviewPo.isAssigneeDisplayed('None')).toBeTruthy('Assignee name is missing');
        expect(await casePreviewPo.getAssigneeDetails()).toContain('Workforce Administration', 'Assigned group name is missing'); // defect
        expect(await casePreviewPo.getAssigneeDetails()).toContain('Petramco', 'Assigned company name is missing');
        expect(await casePreviewPo.isCreateNewCaseButtonDisplayed()).toBeTruthy('Create New Case button is missing');
        await casePreviewPo.clickGoToCaseButton();
    });

    //kgaikwad
    it('[4673,4674]: Create a Case from console with Template and check Case Preview', async () => {
        let caseSummary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotoCreateCase();
        await createCasePo.selectRequester('qkatawazi');
        await createCasePo.setSummary(caseSummary);
        await createCasePo.clickSelectCaseTemplateButton();
        await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateData.templateName);
        await createCasePo.clickSaveCaseButton();
        expect(await casePreviewPo.isCaseSummaryDisplayed(caseSummary)).toBeTruthy('Summary is missing');
        expect(await casePreviewPo.isCaseIdDisplayed()).toBeTruthy('Case ID is missing');
        expect(await casePreviewPo.isPriorityDisplayed('High')).toBeTruthy('Priority is missing');
        expect(await casePreviewPo.isCaseStatusDisplayed('Assigned')).toBeTruthy('Case Status is missing');
        expect(await casePreviewPo.isRequesterNameDisplayed('Qadim Katawazi')).toBeTruthy('Requester name is missing');
        expect(await casePreviewPo.isRequesterPhoneDisplayed('1 512 343-1923')).toBeTruthy('Requester phone number is missing');
        expect(await casePreviewPo.isRequesterEmailIdDisplayed('qkatawazi@petramco.com')).toBeTruthy('Requester email id is missing');
        expect(await casePreviewPo.isCaseTemplateDisplayed(caseTemplateData.templateName)).toBeTruthy('Case Template is missing');
        expect(await casePreviewPo.isDescriptionDisplayed('Register the time off in the HCM system and verify they have enough PTO remaining.')).toBeTruthy('Description is missing');
        expect(await casePreviewPo.isCategoryTier1Displayed('Total Rewards')).toBeTruthy('CategoryTier1 is missing');
        expect(await casePreviewPo.isCategoryTier2Displayed('Leave')).toBeTruthy('CategoryTier2 is missing');
        expect(await casePreviewPo.isCategoryTier3Displayed('PTO')).toBeTruthy('CategoryTier3 is missing');
        expect(await casePreviewPo.isAssigneeDisplayed('None')).toBeTruthy('Assignee name is missing');
        expect(await casePreviewPo.getAssigneeDetails()).toContain('Compensation and Benefits', 'Assigned group name is missing'); // defect
        expect(await casePreviewPo.getAssigneeDetails()).toContain('Petramco', 'Assigned company name is missing');
        expect(await casePreviewPo.isCreateNewCaseButtonDisplayed()).toBeTruthy('Create New Case button is missing');
        expect(await casePreviewPo.isTitleDisplayed()).toBeTruthy('Case Preview Title is missing');
        await casePreviewPo.clickGoToCaseButton();
    });

    //kgaikwad
    it('[4668,4667]: Create a Quick Case and Click on Back button on Case Preview blade', async () => {
        let caseSummary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotoQuickCase();
        await quickCasePo.selectRequesterName('qkatawazi');
        await quickCasePo.setCaseSummary(caseSummary);
        await quickCasePo.saveCase();
        await casePreviewPo.clickOncreateNewCaseButton();
        expect(await quickCasePo.getTextOfSummaryTextBox()).toBe('', 'Quick case summary text box is not empty');
    });

    //kgaikwad
    it('[4664]: UI Validation for Fields on Case Preview Page', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let menuItemData = cloneDeep(SAMPLE_MENU_ITEM);
        menuItemData.menuItemName = menuItemData.menuItemName + randomStr;
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createNewMenuItem(menuItemData);

        await navigationPage.gotoCreateCase();
        await createCasePo.selectRequester('Elizabeth Peters');
        await createCasePo.setSummary('caseSummary ' + randomStr);
        await createCasePo.setContactName('qtao');
        await createCasePo.setDescription('description ' + randomStr);
        await createCasePo.clickSelectCaseTemplateButton();
        await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
        await createCasePo.setLabel(menuItemData.menuItemName);
        await createCasePo.clickSaveCaseButton();
        expect(await casePreviewPo.isCaseSummaryDisplayed('caseSummary ' + randomStr)).toBeTruthy('Summary is missing');
        expect(await casePreviewPo.isCaseIdDisplayed()).toBeTruthy('Case ID is missing');
        expect(await casePreviewPo.isPriorityDisplayed('Medium')).toBeTruthy('Priority is missing');
        expect(await casePreviewPo.isCaseStatusDisplayed('Assigned')).toBeTruthy('Case Status is missing');
        expect(await casePreviewPo.isRequesterNameDisplayed('Elizabeth Peters')).toBeTruthy('Requester name is missing');
        expect(await casePreviewPo.isRequesterPhoneDisplayed('1 925 5553456')).toBeTruthy('Requester phone number is missing');
        expect(await casePreviewPo.isRequesterEmailIdDisplayed('elizabeth@bwflabs.localdomain')).toBeTruthy('Requester email id is missing');
        expect(await casePreviewPo.isSourceDisplayed('Agent')).toBeTruthy('Agent is missing');
        expect(await casePreviewPo.isLabelDisplayed(menuItemData.menuItemName)).toBeTruthy('label is missing');
        expect(await casePreviewPo.isCaseSiteDisplayed('Rochester')).toBeTruthy('Case site is missing');
        expect(await casePreviewPo.isCaseTemplateDisplayed(caseTemplateName)).toBeTruthy('Case Template is missing');
        expect(await casePreviewPo.isDescriptionDisplayed('description ' + randomStr)).toBeTruthy('Description is missing');
        expect(await casePreviewPo.isCategoryTier1Displayed('Employee Relations')).toBeTruthy('CategoryTier1 is missing');
        expect(await casePreviewPo.isCategoryTier2Displayed('Compensation')).toBeTruthy('CategoryTier2 is missing');
        expect(await casePreviewPo.isCategoryTier3Displayed('Bonus')).toBeTruthy('CategoryTier3 is missing');
        expect(await casePreviewPo.isAssigneeDisplayed('Qadim Katawazi')).toBeTruthy('Assignee name is missing');
        expect(await casePreviewPo.getAssigneeDetails()).toContain('Petramco > United States Support > US Support 3', 'Assigned group name is missing');
        expect(await casePreviewPo.getAssigneeDetails()).toContain('Petramco', 'Assigned company name is missing');
        expect(await casePreviewPo.isCreateNewCaseButtonDisplayed()).toBeTruthy('Create New Case button is missing');
        expect(await casePreviewPo.isTitleDisplayed()).toBeTruthy('Case Preview Title is missing');
        await casePreviewPo.clickGoToCaseButton();
    });

    //kgaikwad
    it('[4672]: Create a Case via Quick Case by pinning articles and cases and check Case Preview on save', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateName = randomStr + 'caseTemplateName';
        let templateData = {
            "templateName": caseTemplateName,
            "templateSummary": caseTemplateName,
            "templateStatus": "Active",
            "company": "Petramco",
            "categoryTier1": "Employee Relations",
            "categoryTier2": "Compensation",
            "categoryTier3": "Bonus",
            "casePriority": "Low",
            "businessUnit": "United States Support",
            "assignee": "qtao",
            "supportGroup": "US Support 1",
            "caseStatus": "Assigned"
        }
        let articleData1 = {
            "knowledgeSet": "HR",
            "title": caseTemplateName,
            "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
            "assignedCompany": "Petramco",
            "assigneeBusinessUnit": "United States Support",
            "assigneeSupportGroup": "US Support 1",
            "assignee": "kayo",
            "categoryTier1": "Applications",
            "region": "Australia",
            "site": "Canberra",
        }
        let caseData = {
            "Requester": "apavlik",
            "Summary": caseTemplateName,
            "Assigned Company": "Petramco",
            "Business Unit": "United States Support",
            "Support Group": "US Support 1",
            "Assignee": "qtao",
            "Status": "3000",
        }
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createCase(caseData);
        await apiHelper.createCaseTemplate(templateData);
        let knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData1);
        let knowledgeArticleGUID = knowledgeArticleData.id;
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'Draft')).toBeTruthy('Status Not Set');
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'PublishApproval')).toBeTruthy('Status Not Set');
        await navigationPage.gotoQuickCase();
        await quickCasePo.selectRequesterName('qkatawazi');
        await quickCasePo.selectCaseTemplate(caseTemplateName);
        await quickCasePo.setCaseSummary(caseTemplateName);
        await resources.clickOnAdvancedSearchOptions();
        await resources.enterAdvancedSearchText(caseTemplateName);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.clickOnAdvancedSearchFiltersButton("Apply");
        await resources.pinRecommendedKnowledgeArticles(1); // defect, resource not searched
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await quickCasePo.pinRecommendedCases(1);
        await quickCasePo.saveCase();
        expect(await casePreviewPo.isTitleDisplayed()).toBeTruthy('failureMsg: Case Preview Title is missing');
        expect(await casePreviewPo.isCaseSummaryDisplayed(caseTemplateName)).toBeTruthy('failureMsg: Summary is missing');
        expect(await casePreviewPo.isCaseIdDisplayed()).toBeTruthy('failureMsg: Case ID is missing');
        expect(await casePreviewPo.isPriorityDisplayed('Low')).toBeTruthy('failureMsg: Priority is missing');
        expect(await casePreviewPo.isCaseStatusDisplayed('Assigned')).toBeTruthy('failureMsg: Case Status is missing');
        expect(await casePreviewPo.isRequesterNameDisplayed('Qadim Katawazi')).toBeTruthy('failureMsg: Requester name is missing');
        expect(await casePreviewPo.isRequesterPhoneDisplayed('1 512 343-1923')).toBeTruthy('Requester phone number is missing');
        expect(await casePreviewPo.isRequesterEmailIdDisplayed('qkatawazi@petramco.com')).toBeTruthy('failureMsg: Requester email id is missing');
        expect(await casePreviewPo.isCaseTemplateDisplayed('Change My Legal Name')).toBeFalsy('failureMsg: Case Template is displayed');
        expect(await casePreviewPo.isDescriptionDisplayed('Qadim Katawazi' + " " + caseTemplateName)).toBeTruthy('failureMsg: Description is missing');
        expect(await casePreviewPo.isCategoryTier1Displayed("Employee Relations")).toBeTruthy('failureMsg: CategoryTier1 is missing');
        expect(await casePreviewPo.isCategoryTier2Displayed("Compensation")).toBeTruthy('failureMsg: CategoryTier2 is missing');
        expect(await casePreviewPo.isCategoryTier3Displayed("Bonus")).toBeTruthy('failureMsg: CategoryTier3 is missing');
        expect(await casePreviewPo.isAssigneeDisplayed('Qianru Tao')).toBeTruthy('failureMsg: Assignee name is missing');
        expect(await casePreviewPo.getAssigneeDetails()).toContain('US Support 1', 'failureMsg: Assigned group name is missing'); // defect
        expect(await casePreviewPo.getAssigneeDetails()).toContain('Petramco', 'failureMsg: Assigned company name is missing');
        expect(await casePreviewPo.isCreateNewCaseButtonDisplayed()).toBeTruthy('failureMsg: Create New Case button is missing');
        await casePreviewPo.clickGoToCaseButton();
    });
});
