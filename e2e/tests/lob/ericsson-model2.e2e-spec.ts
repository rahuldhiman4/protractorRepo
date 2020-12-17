import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import previewCasePage from '../../pageobject/case/case-preview.po';
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import viewCasePage from '../../pageobject/case/view-case.po';
import changeAssignmentBladePo from '../../pageobject/common/change-assignment-blade.po';
import editCasePo from '../../pageobject/case/edit-case.po';
import utilityGrid from '../../utils/utility.grid';
import quickCasePo from '../../pageobject/case/quick-case.po';
import previewCaseTemplateCasesPo from '../../pageobject/settings/case-management/preview-case-template.po';
import resourcesPo from '../../pageobject/common/resources-tab.po';

describe('Ericsson Model Test Extended', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    describe('[DRDMV-23634]:[Ericsson Model][Quick Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
        let ericssonSAMcaseTemplateData, caseTemplateDataEricssonSAMGlobal;
        let articleData,caseTemplateDataGlobal, ericssonGlobalcaseTemplateData, ericssonHRcaseTemplateData, randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let commonName = randomStr + "Case DRDMV23488";
        let commonNameForOtherLoB = randomStr + "ericssonSAMDRDMV23488";
        beforeAll(async () => {
            ericssonHRcaseTemplateData = {
                "templateName": commonName,
                "templateSummary": randomStr + 'Summary DRDMV23488',
                "caseStatus": "Assigned",
                "templateStatus": "Active",
                "company": "Ericsson HR",
                "businessUnit": "Ericsson United States Support",
                "supportGroup": "US Support 1",
                "assignee": "rwillie",
                "casePriority": "Low",
                "ownerCompany": "Ericsson HR",
                "ownerBusinessUnit": "Ericsson United States Support",
                "ownerGroup": "US Support 1",
                "lineOfBusiness": "Ericsson HR"
            };
            ericssonGlobalcaseTemplateData = {
                "templateName": commonName,
                "templateSummary": randomStr + 'Summary DRDMV23488',
                "caseStatus": "Assigned",
                "templateStatus": "Active",
                "company": "Ericsson Global",
                "casePriority": "Low",
                "ownerCompany": "Ericsson HR",
                "ownerBusinessUnit": "Ericsson United States Support",
                "ownerGroup": "US Support 1",
                "lineOfBusiness": "Ericsson HR"
            };
            caseTemplateDataGlobal = {
                "templateName": commonName,
                "templateSummary": randomStr + 'Summary DRDMV23488',
                "caseStatus": "Assigned",
                "templateStatus": "Active",
                "company": "- Global -",
                "casePriority": "Low",
                "ownerCompany": "Ericsson HR",
                "ownerBusinessUnit": "Ericsson United States Support",
                "ownerGroup": "US Support 1",
                "lineOfBusiness": "Ericsson HR"
            };
            let caseData = {
                "Requester": "rdonald",
                "Summary": commonName,
                "Assigned Company": "Ericsson HR",
                "Business Unit": "Ericsson United States Support",
                "Support Group": "US Support 1",
                "categoryTier1": "Employee Relations",
                "categoryTier2": "Compensation",
                "categoryTier3": "Bonus",
                "Assignee": "rdustin",
                "Line Of Business": "Ericsson HR"
            };
            let knowledgeSetData = {
                knowledgeSetTitle: 'KnowledgeSet_' + randomStr,
                knowledgeSetDesc: 'KnowledgeSetDesc' + randomStr,
                company: 'Ericsson HR',
                lineOfBusiness: "Ericsson HR"
            }
            await apiHelper.apiLogin('rwillie');
            await apiHelper.createKnowledgeSet(knowledgeSetData);
            articleData = {
                "knowledgeSet": knowledgeSetData.knowledgeSetTitle,
                "title": commonName,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Ericsson HR",
                "assigneeBusinessUnit": "Ericsson United States Support",
                "assigneeSupportGroup": "US Support 1",
                "assignee": "rdustin",
                "lineOfBusiness": "Ericsson HR"
            };
            await apiHelper.apiLogin('rwillie');
            await apiHelper.createCaseTemplate(ericssonHRcaseTemplateData);
            await apiHelper.createCaseTemplate(ericssonGlobalcaseTemplateData);
            await apiHelper.createCaseTemplate(caseTemplateDataGlobal);
            await apiHelper.createCase(caseData);
            let knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
            let knowledgeArticleGUID = knowledgeArticleData.id;
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'Draft')).toBeTruthy('Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'SMEReview', 'rwillie', 'US Support 1', 'Ericsson HR')).toBeTruthy("Article with SME Review status not updated.");
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'PublishApproval', 'rwillie', 'US Support 1', 'Ericsson HR')).toBeTruthy('Status Not Set');
            ericssonSAMcaseTemplateData = {
                "templateName": commonNameForOtherLoB,
                "templateStatus": "Active",
                "templateSummary": `Summary1${randomStr}`,
                "caseStatus": "New",
                "casePriority": "Medium",
                "ownerComapny": "Ericsson SAM",
                "ownerBU": "Ericsson Asset Management - USA",
                "ownerGroup": "Asset Disposal",
                "company": "Ericsson SAM",
                "lineOfBusiness": "Ericsson SAM",
            }
            caseTemplateDataEricssonSAMGlobal = {
                "templateName": commonNameForOtherLoB,
                "templateSummary": randomStr + 'Summary DRDMV23488',
                "caseStatus": "Assigned",
                "templateStatus": "Active",
                "company": "Ericsson Global",
                "casePriority": "Low",
                "ownerComapny": "Ericsson SAM",
                "ownerBU": "Ericsson Asset Management - USA",
                "ownerGroup": "Asset Disposal",
                "lineOfBusiness": "Ericsson SAM",
            };
            await apiHelper.apiLogin('sbruce');
            await apiHelper.createCaseTemplate(ericssonSAMcaseTemplateData);
            await apiHelper.createCaseTemplate(caseTemplateDataEricssonSAMGlobal);
        });
        it('[DRDMV-23634]:[Ericsson Model][Quick Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('rwillie');
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('rdustin');
            expect(await quickCasePo.selectCaseTemplate(ericssonSAMcaseTemplateData.templateName)).toBeFalsy('template is present');
            expect(await quickCasePo.selectCaseTemplate(caseTemplateDataEricssonSAMGlobal.templateName)).toBeFalsy('template is present');
            await quickCasePo.selectCaseTemplate(ericssonHRcaseTemplateData.templateName);
            await quickCasePo.clickArrowFirstRecommendedCaseTemplate();
            expect(await previewCaseTemplateCasesPo.getLineOfBusinessValue()).toBe('Ericsson HR');
            await previewCaseTemplateCasesPo.clickOnBackButton();
        });
        it('[DRDMV-23634]:[Ericsson Model][Quick Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await browser.sleep(7000); //Hard wait for KA Indexing
            expect(await resourcesPo.getKnowledgeArticleInfo()).toContain('Ericsson HR', 'LOB is not correct');
            await resourcesPo.clickOnAdvancedSearchOptions();
            await resourcesPo.enterAdvancedSearchText(articleData.title);
            await resourcesPo.clickOnAdvancedSearchSettingsIconToOpen();
            await resourcesPo.clickOnAdvancedSearchFiltersButton('Apply');
            await resourcesPo.clickOnAdvancedSearchSettingsIconToClose();
            expect(await resourcesPo.getKnowledgeArticleInfo()).toContain('Ericsson HR', 'LOB is not correct');
            await quickCasePo.clickFirstRecommendedCases();
            expect(await previewCasePage.getLineOfBusinessValue()).toBe('Ericsson HR');
            await previewCasePage.clickBackButton();
            await quickCasePo.createCaseButton();
            await previewCasePage.clickGoToCaseButton();
        });
        it('[DRDMV-23634]:[Ericsson Model][Quick Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await viewCasePage.clickEditCaseButton();
            expect(await editCasePo.isValuePresentInDropdown("Category Tier 1", 'Fixed Assets')).toBeFalsy('Value is present in  Category Tier 1 drop down');
            expect(await editCasePo.isLineOfBusinessReadOnly()).toBeTruthy('Field is enabled');
            await editCasePo.updateCasePriority('High');
            await editCasePo.updateCaseCategoryTier1('Employee Relations');
            await editCasePo.updateCaseCategoryTier2('Compensation');
            await editCasePo.updateCaseCategoryTier3('Bonus');
            await editCasePo.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.businessUnitOptionsPresent('Ericsson Asset Management - India')).toBeFalsy();
            await changeAssignmentBladePo.clickOnCancelButton();
            await editCasePo.clickChangeAssignmentButton();
            await changeAssignmentBladePo.selectBusinessUnit('Ericsson United States Support');
            await changeAssignmentBladePo.selectSupportGroup('US Support 2');
            await changeAssignmentBladePo.selectAssignee('Rudner Rita');
            await changeAssignmentBladePo.clickOnAssignButton();
            await editCasePo.clickSaveCase();
            expect(await viewCasePage.getCategoryTier1Value()).toBe('Employee Relations');
            expect(await viewCasePage.getCategoryTier2Value()).toBe('Compensation');
            expect(await viewCasePage.getCategoryTier3Value()).toBe('Bonus');
            expect(await viewCasePage.getAssignedGroupText()).toBe("US Support 2");
            expect(await viewCasePage.getAssigneeText()).toBe("Rudner Rita");
        });
        it('[DRDMV-23634]:[Ericsson Model][Quick Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await viewCasePage.clickEditCaseButton();
            await editCasePo.clickOnChangeCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(ericssonGlobalcaseTemplateData.templateName);
            await editCasePo.clickSaveCase();
            await utilityCommon.closePopUpMessage();
            await navigationPage.gotoCaseConsole();
            expect(await utilityGrid.isGridRecordPresent(ericssonGlobalcaseTemplateData.templateName)).toBeTruthy(ericssonGlobalcaseTemplateData.templateName);
            await navigationPage.signOut();
            await loginPage.login('ttristan');
            await utilityGrid.clearFilter();
            expect(await utilityGrid.isGridRecordPresent(ericssonGlobalcaseTemplateData.templateName)).toBeFalsy(ericssonGlobalcaseTemplateData.templateName);
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('tkenneth');
            await quickCasePo.setCaseSummary('new case');
            await quickCasePo.createCaseButton();
            await utilityCommon.closePopUpMessage();
            expect(await previewCasePage.getLineOfBusinessValue()).toBe('Ericsson SAM');
            await quickCasePo.gotoCaseButton();
            await viewCasePage.clickEditCaseButton();
            expect(await editCasePo.isValuePresentInDropdown("Category Tier 1", 'Employee Relations')).toBeFalsy('Value is present in  Category Tier 1 drop down');
            expect(await editCasePo.isLineOfBusinessReadOnly()).toBeTruthy('Field is enabled');
            await editCasePo.updateCasePriority('High');
            await editCasePo.updateCaseCategoryTier1('Fixed Assets');
            await editCasePo.updateCaseCategoryTier2('Impairment');
            await editCasePo.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.businessUnitOptionsPresent('Ericsson United States Support')).toBeFalsy();
            await changeAssignmentBladePo.clickOnCancelButton();
            await editCasePo.clickChangeAssignmentButton();
            await changeAssignmentBladePo.selectBusinessUnit('Ericsson Asset Management - India');
            await changeAssignmentBladePo.selectSupportGroup('Old Asset Management');
            await changeAssignmentBladePo.selectAssignee('Tynan Kenneth');
            await changeAssignmentBladePo.clickOnAssignButton();
            await editCasePo.clickSaveCase();
            expect(await viewCasePage.getCategoryTier1Value()).toBe('Fixed Assets');
            expect(await viewCasePage.getCategoryTier2Value()).toBe('Impairment');
            expect(await viewCasePage.getCategoryTier3Value()).toBe('Bonus');
            expect(await viewCasePage.getAssignedGroupText()).toBe("Old Asset Management");
            expect(await viewCasePage.getAssigneeText()).toBe("Tynan Kenneth");
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('tkenneth');
            await quickCasePo.selectCaseTemplate(ericssonSAMcaseTemplateData.templateName);
            await quickCasePo.createCaseButton();
            await utilityCommon.closePopUpMessage();
            expect(await previewCasePage.getLineOfBusinessValue()).toBe('Ericsson SAM');
            await quickCasePo.gotoCaseButton();
        });
        it('[DRDMV-23634]:[Ericsson Model][Quick Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('tkenneth');
            await quickCasePo.selectCaseTemplate(caseTemplateDataEricssonSAMGlobal.templateName);
            await quickCasePo.clickArrowFirstRecommendedCaseTemplate();
            expect(await previewCaseTemplateCasesPo.getLineOfBusinessValue()).toBe('Ericsson SAM');
            await previewCaseTemplateCasesPo.clickOnBackButton();
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('tkenneth');
            expect(await quickCasePo.selectCaseTemplate(caseTemplateDataGlobal.templateName)).toBeFalsy('template is present');
            await quickCasePo.setCaseSummary('new case');
            await resourcesPo.clickOnAdvancedSearchOptions();
            await resourcesPo.enterAdvancedSearchText(articleData.title);
            await resourcesPo.clickOnAdvancedSearchSettingsIconToOpen();
            await resourcesPo.clickOnAdvancedSearchFiltersButton('Apply');
            await resourcesPo.clickOnAdvancedSearchSettingsIconToClose();
            expect(await resourcesPo.isRecommendedKnowledgePresent(articleData.title)).toBeFalsy();
            await quickCasePo.clickStartOverButton();
            await quickCasePo.selectRequesterName('tkenneth');
            expect(await quickCasePo.selectCaseTemplate(ericssonGlobalcaseTemplateData.templateName)).toBeFalsy('template is present');
            expect(await quickCasePo.selectCaseTemplate(ericssonHRcaseTemplateData.templateName)).toBeFalsy('template is present');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });
});