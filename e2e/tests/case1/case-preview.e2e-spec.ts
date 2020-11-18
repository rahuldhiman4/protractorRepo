import { browser, protractor, ProtractorExpectedConditions } from "protractor";
import apiHelper from '../../api/api.helper';
import casePreviewPo from '../../pageobject/case/case-preview.po';
import createCasePo from '../../pageobject/case/create-case.po';
import quickCasePo from '../../pageobject/case/quick-case.po';
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import resources from '../../pageobject/common/resources-tab.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import { SAMPLE_MENU_ITEM } from '../../data/ui/ticketing/menu.item.ui';
import { cloneDeep } from 'lodash';

let caseTemplateName = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('') + " Case Preview Sample";

describe("Case Preview", () => {
    const EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
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
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //kgaikwad
    it('[DRDMV-13640]: Create a Case via Quick Case and check Case Preview screen', async () => {
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
        expect(await casePreviewPo.isRequesterPhoneDisplayed('+15123431923')).toBeTruthy('Requester phone number is missing');
        expect(await casePreviewPo.isRequesterEmailIdDisplayed('qkatawazi@petramco.com')).toBeTruthy('Requester email id is missing');
        expect(await casePreviewPo.isCaseTemplateDisplayed(caseTemplateName)).toBeTruthy('Case Template is missing');
        expect(await casePreviewPo.isDescriptionDisplayed('Qadim Katawazi ' + caseTemplateName + ' ' + caseSummary)).toBeTruthy('Description is missing');
        expect(await casePreviewPo.isCategoryTier1Displayed('Employee Relations')).toBeTruthy('CategoryTier1 is missing');
        expect(await casePreviewPo.isCategoryTier2Displayed('Compensation')).toBeTruthy('CategoryTier2 is missing');
        expect(await casePreviewPo.isCategoryTier3Displayed('Bonus')).toBeTruthy('CategoryTier3 is missing');
        expect(await casePreviewPo.isAssigneeDisplayed('Qadim Katawazi')).toBeTruthy('Assignee name is missing');
        expect(await casePreviewPo.isAssignedGroupDisplayed('US Support 3')).toBeTruthy('Assigned group name is missing');
        expect(await casePreviewPo.isAssignedCompanyDisplayed('Petramco')).toBeTruthy('Assigned company name is missing');
        expect(await casePreviewPo.isCreateNewCaseButtonDisplayed()).toBeTruthy('Create New Case button is missing');
        await casePreviewPo.clickGoToCaseButton();
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
        expect(await casePreviewPo.isDescriptionDisplayed('Qadim Katawazi ' + caseSummary)).toBeTruthy('Description is missing');
        expect(await casePreviewPo.isCategoryTier1Displayed('-')).toBeTruthy('CategoryTier1 is missing');
        expect(await casePreviewPo.isCategoryTier2Displayed('-')).toBeTruthy('CategoryTier2 is missing');
        expect(await casePreviewPo.isCategoryTier3Displayed('-')).toBeTruthy('CategoryTier3 is missing');
        expect(await casePreviewPo.isAssigneeDisplayed('None')).toBeTruthy('Assignee name is missing');
        expect(await casePreviewPo.isAssignedGroupDisplayed('Workforce Administration')).toBeTruthy('Assigned group name is missing');
        expect(await casePreviewPo.isAssignedCompanyDisplayed('Petramco')).toBeTruthy('Assigned company name is missing');
        expect(await casePreviewPo.isCreateNewCaseButtonDisplayed()).toBeTruthy('Create New Case button is missing');
        await casePreviewPo.clickGoToCaseButton();
    });

    //kgaikwad
    it('[DRDMV-13642,DRDMV-13641]: Create a Case from console with Template and check Case Preview', async () => {
        let caseSummary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotoCreateCase();
        await createCasePo.selectRequester('qkatawazi');
        await createCasePo.setSummary(caseSummary);
        await createCasePo.clickSelectCaseTemplateButton();
        await selectCasetemplateBladePo.selectCaseTemplate('Paid Time Off Request');
        await createCasePo.clickSaveCaseButton();
        expect(await casePreviewPo.isCaseSummaryDisplayed(caseSummary)).toBeTruthy('Summary is missing');
        expect(await casePreviewPo.isCaseIdDisplayed()).toBeTruthy('Case ID is missing');
        expect(await casePreviewPo.isPriorityDisplayed('High')).toBeTruthy('Priority is missing');
        expect(await casePreviewPo.isCaseStatusDisplayed('Assigned')).toBeTruthy('Case Status is missing');
        expect(await casePreviewPo.isRequesterNameDisplayed('Qadim Katawazi')).toBeTruthy('Requester name is missing');
        expect(await casePreviewPo.isRequesterPhoneDisplayed('+15123431923')).toBeTruthy('Requester phone number is missing');
        expect(await casePreviewPo.isRequesterEmailIdDisplayed('qkatawazi@petramco.com')).toBeTruthy('Requester email id is missing');
        expect(await casePreviewPo.isCaseTemplateDisplayed('Paid Time Off Request')).toBeTruthy('Case Template is missing');
        expect(await casePreviewPo.isDescriptionDisplayed('Register the time off in the HCM system and verify they have enough PTO remaining.')).toBeTruthy('Description is missing');
        expect(await casePreviewPo.isCategoryTier1Displayed('Total Rewards')).toBeTruthy('CategoryTier1 is missing');
        expect(await casePreviewPo.isCategoryTier2Displayed('Leave')).toBeTruthy('CategoryTier2 is missing');
        expect(await casePreviewPo.isCategoryTier3Displayed('PTO')).toBeTruthy('CategoryTier3 is missing');
        expect(await casePreviewPo.isAssigneeDisplayed('Peter Kahn')).toBeTruthy('Assignee name is missing');
        expect(await casePreviewPo.isAssignedGroupDisplayed('Compensation and Benefits')).toBeTruthy('Assigned group name is missing');
        expect(await casePreviewPo.isAssignedCompanyDisplayed('Petramco')).toBeTruthy('Assigned company name is missing');
        expect(await casePreviewPo.isCreateNewCaseButtonDisplayed()).toBeTruthy('Create New Case button is missing');
        expect(await casePreviewPo.isTitleDisplayed()).toBeTruthy('Case Preview Title is missing');
        await casePreviewPo.clickGoToCaseButton();
    });

    //kgaikwad
    it('[DRDMV-13666,DRDMV-13672]: Create a Quick Case and Click on Back button on Case Preview blade', async () => {
        let caseSummary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotoQuickCase();
        await quickCasePo.selectRequesterName('qkatawazi');
        await quickCasePo.setCaseSummary(caseSummary);
        await quickCasePo.saveCase();
        await casePreviewPo.clickOncreateNewCaseButton();
        expect(await quickCasePo.getTextOfSummaryTextBox()).toBe('', 'Quick case summary text box is not empty');
    });

    //kgaikwad
    it('[DRDMV-13680]: UI Validation for Fields on Case Preview Page', async () => {
        let caseSummary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let description = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let menuItemData = cloneDeep(SAMPLE_MENU_ITEM);
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let label = await menuItemData.menuItemName + randomStr;
        menuItemData.menuItemName = label;
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createNewMenuItem(menuItemData);

        await navigationPage.gotoCreateCase();
        await createCasePo.selectRequester('Elizabeth Peters');
        await createCasePo.setSummary(caseSummary);
        await createCasePo.setContactName('qtao');
        await createCasePo.setDescription(description);
        await createCasePo.clickSelectCaseTemplateButton();
        await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
        await createCasePo.setLabel(label);
        await createCasePo.clickAssignToMeButton();
        await createCasePo.clickSaveCaseButton();
        expect(await casePreviewPo.isCaseSummaryDisplayed(caseSummary)).toBeTruthy('Summary is missing');
        expect(await casePreviewPo.isCaseIdDisplayed()).toBeTruthy('Case ID is missing');
        expect(await casePreviewPo.isPriorityDisplayed('Medium')).toBeTruthy('Priority is missing');
        expect(await casePreviewPo.isCaseStatusDisplayed('Assigned')).toBeTruthy('Case Status is missing');
        expect(await casePreviewPo.isRequesterNameDisplayed('Elizabeth Peters')).toBeTruthy('Requester name is missing');
        expect(await casePreviewPo.isRequesterPhoneDisplayed('+19255553456')).toBeTruthy('Requester phone number is missing');
        expect(await casePreviewPo.isRequesterEmailIdDisplayed('elizabeth@bwflabs.localdomain')).toBeTruthy('Requester email id is missing');
        expect(await casePreviewPo.isSourceDisplayed('Agent')).toBeTruthy('Agent is missing');
        expect(await casePreviewPo.isLabelDisplayed(label)).toBeTruthy('label is missing');
        expect(await casePreviewPo.isCaseSiteDisplayed('Rochester')).toBeTruthy('Case site is missing');
        expect(await casePreviewPo.isCaseTemplateDisplayed(caseTemplateName)).toBeTruthy('Case Template is missing');
        expect(await casePreviewPo.isDescriptionDisplayed(description)).toBeTruthy('Description is missing');
        expect(await casePreviewPo.isCategoryTier1Displayed('Employee Relations')).toBeTruthy('CategoryTier1 is missing');
        expect(await casePreviewPo.isCategoryTier2Displayed('Compensation')).toBeTruthy('CategoryTier2 is missing');
        expect(await casePreviewPo.isCategoryTier3Displayed('Bonus')).toBeTruthy('CategoryTier3 is missing');
        expect(await casePreviewPo.isAssigneeDisplayed('Qianru Tao')).toBeTruthy('Assignee name is missing');
        expect(await casePreviewPo.isAssignedGroupDisplayed('US Support 1')).toBeTruthy('Assigned group name is missing');
        expect(await casePreviewPo.isAssignedCompanyDisplayed('Petramco')).toBeTruthy('Assigned company name is missing');
        expect(await casePreviewPo.isCreateNewCaseButtonDisplayed()).toBeTruthy('Create New Case button is missing');
        expect(await casePreviewPo.isTitleDisplayed()).toBeTruthy('Case Preview Title is missing');
        await casePreviewPo.clickGoToCaseButton();
    });

    //kgaikwad
    it('[DRDMV-13644]: Create a Case via Quick Case by pinning articles and cases and check Case Preview on save', async () => {
        let RecommendedKnowledgeStr = "Recommended Knowledge";
        let applyBtn = "Apply";
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateName = randomStr + 'caseTemplateName';
        let templateData = {
            "templateName": `${caseTemplateName}`,
            "templateSummary": `${caseTemplateName}`,
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
            "title": `${caseTemplateName}`,
            "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
            "assignedCompany": "Petramco",
            "assigneeBusinessUnit": "United States Support",
            "assigneeSupportGroup": "US Support 1",
            "assignee": "kayo",
            "categoryTier1": "Applications",
            "region": "Australia",
            "site": "Canberra",
        }
        let caseData =
        {
            "Requester": "apavlik",
            "Summary": `${caseTemplateName}`,
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
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.pinRecommendedKnowledgeArticles(1);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await quickCasePo.pinRecommendedCases(1);
        await quickCasePo.saveCase();
        expect(await casePreviewPo.isTitleDisplayed()).toBeTruthy('failureMsg: Case Preview Title is missing');
        expect(await casePreviewPo.isCaseSummaryDisplayed(caseTemplateName)).toBeTruthy('failureMsg: Summary is missing');
        expect(await casePreviewPo.isCaseIdDisplayed()).toBeTruthy('failureMsg: Case ID is missing');
        expect(await casePreviewPo.isPriorityDisplayed('Low')).toBeTruthy('failureMsg: Priority is missing');
        expect(await casePreviewPo.isCaseStatusDisplayed('Assigned')).toBeTruthy('failureMsg: Case Status is missing');
        expect(await casePreviewPo.isRequesterNameDisplayed('Qadim Katawazi')).toBeTruthy('failureMsg: Requester name is missing');
        expect(await casePreviewPo.isRequesterPhoneDisplayed('+15123431923')).toBeTruthy('Requester phone number is missing');
        expect(await casePreviewPo.isRequesterEmailIdDisplayed('qkatawazi@petramco.com')).toBeTruthy('failureMsg: Requester email id is missing');
        expect(await casePreviewPo.isCaseTemplateDisplayed('Change My Legal Name')).toBeFalsy('failureMsg: Case Template is displayed');
        expect(await casePreviewPo.isDescriptionDisplayed('Qadim Katawazi' + " " + caseTemplateName)).toBeTruthy('failureMsg: Description is missing');
        expect(await casePreviewPo.isCategoryTier1Displayed("Employee Relations")).toBeTruthy('failureMsg: CategoryTier1 is missing');
        expect(await casePreviewPo.isCategoryTier2Displayed("Compensation")).toBeTruthy('failureMsg: CategoryTier2 is missing');
        expect(await casePreviewPo.isCategoryTier3Displayed("Bonus")).toBeTruthy('failureMsg: CategoryTier3 is missing');
        expect(await casePreviewPo.isAssigneeDisplayed('Qianru Tao')).toBeTruthy('failureMsg: Assignee name is missing');
        expect(await casePreviewPo.isAssignedGroupDisplayed('US Support 1')).toBeTruthy('failureMsg: Assigned group name is missing');
        expect(await casePreviewPo.isAssignedCompanyDisplayed('Petramco')).toBeTruthy('failureMsg: Assigned company name is missing');
        expect(await casePreviewPo.isCreateNewCaseButtonDisplayed()).toBeTruthy('failureMsg: Create New Case button is missing');
        await casePreviewPo.clickGoToCaseButton();
    });
});
