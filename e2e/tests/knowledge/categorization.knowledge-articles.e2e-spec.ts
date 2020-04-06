import { browser } from "protractor";
import apiCoreUtil from '../../api/api.core.util';
import apiHelper from '../../api/api.helper';
import previewCasePo from '../../pageobject/case/case-preview.po';
import createCasePage from '../../pageobject/case/create-case.po';
import editCasePage from '../../pageobject/case/edit-case.po';
import quickCase from '../../pageobject/case/quick-case.po';
import viewCasePage from "../../pageobject/case/view-case.po";
import changeAssignmentBlade from "../../pageobject/common/change-assignment-blade.po";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import resources from '../../pageobject/common/resources-tab.po';
import createKnowledgePage from "../../pageobject/knowledge/create-knowlege.po";
import editKnowledgePage from '../../pageobject/knowledge/edit-knowledge.po';
import knowledgeConsole from '../../pageobject/knowledge/knowledge-articles-console.po';
import viewKnowledgeArticlePo from '../../pageobject/knowledge/view-knowledge-article.po';
import createDocumentLibraryPage from '../../pageobject/settings/document-management/create-document-library.po';
import documentLibraryConsolePage from '../../pageobject/settings/document-management/document-library-console.po';
import editDocumentLibraryPage from '../../pageobject/settings/document-management/edit-document-library.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilGrid from "../../utils/util.grid";
import previewKnowledgePo from '../../pageobject/knowledge/preview-knowledge.po';

let caseBAUser = 'qkatawazi';
let caseAgentUser = 'qtao';
let caseManagerUser = 'qdu';
let knowledgeCandidateUser = 'kayo';
let knowledgeContributorUser = 'kkohri';
let knowledgePublisherUser = 'kmills';
let knowledgeCoachUser = 'kWilliamson';
let categoryTier1 = 'Category Tier 1';
let categoryTier2 = 'Category Tier 2';
let categoryTier3 = 'Category Tier 3';
let categoryTier4 = 'Category Tier 4';
let categoryTier1FieldVal = 'Applications';
let categoryTier1FieldVal1 = 'Employee Relations';
let categoryTier2FieldVal = 'Help Desk';
let categoryTier3FieldVal = 'Incident';
let knowledgeManagementApp = "Knowledge Management";
let knowledgeArticlesTitleStr = "Knowledge Articles";
let advancedSearchOptionCategoryTier1 = "Operational Category Tier 1";
let advancedSearchOptionCategoryTier1ForDocumentLibrary = "Operational Category 1";
let knowledgeArticlesStr = "Knowledge Articles ";
let recommendedKnowledgeStr = "Recommended Knowledge ";
let applyBtn = "Apply";
let emptyStr = undefined;
let articleInDraftStatus = 'DRDMV-19004 KnowledgeArticle_Draft';
let articleInSMEReviewStatus = 'DRDMV-19004 KnowledgeArticle_SMEReview';
let articleInPublishedStatus = 'DRDMV-19004 KnowledgeArticle_Published';
let articleInRetiredStatus = 'DRDMV-19004 KnowledgeArticle_Retired';
let articleInClosedStatus = 'DRDMV-19004 KnowledgeArticle_Closed';
let articleInCanceledStatus = 'DRDMV-19004 KnowledgeArticle_Canceled';
let companyStr = "Petramco";
let ownerSupportGroup = "Compensation and Benefits";
let documentLibraryStr = "Document Library ";
let documentLibraryStatus = "Published";
let draftStatus = "Draft";
let inProgressStatus = "In Progress";
let smeReviewStatus = "SMEReview";
let publishedStatus = "Published";
let retiredStatus = "Retired";
let closedStatus = "Closed";
let canceledStatus = "Canceled";
let title = "DRDMV-19004 KnowledgeArticle";

describe('Knowledge Articles - Categorization Tests', () => {
    const filePath = '../../../data/ui/attachment/articleStatus.png';
    const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
    const businessDataFile = require('../../data/ui/foundation/businessUnit.ui.json');
    const departmentDataFile = require('../../data/ui/foundation/department.ui.json');
    const supportGrpDataFile = require('../../data/ui/foundation/supportGroup.ui.json');
    const personDataFile = require('../../data/ui/foundation/person.ui.json');
    const domainTagDataFile = require('../../data/ui/foundation/domainTag.ui.json');

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login(caseBAUser);
        await apiHelper.apiLogin(knowledgePublisherUser);
        let articleData = {
            "knowledgeSet": "HR",
            "title": "KnowledgeArticle",
            "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
            "categoryTier1": "Applications",
            "categoryTier2": "Help Desk",
            "categoryTier3": "Incident",
            "region": "Australia",
            "site": "Canberra",
            "assignee": "KMills",
            "assigneeSupportGroup": "GB Support 2"
        }
        // Create article in in progress status
        articleData.title = title + "_" + inProgressStatus;
        let knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
        //Create article in draft status
        articleData.title = title + "_" + draftStatus;
        knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
        let knowledgeArticleGUID = knowledgeArticleData.id;
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, draftStatus)).toBeTruthy("Article with Draft status not updated.");

        //Create article in SMEReview status
        articleData.title = title + "_" + smeReviewStatus;
        knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
        knowledgeArticleGUID = knowledgeArticleData.id;
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, draftStatus)).toBeTruthy("Article with Draft status not updated.");
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, smeReviewStatus, "KMills", 'GB Support 2', 'Petramco')).toBeTruthy("Article with SME Review status not updated.");

        //Create article in Published status
        articleData.title = title + "_" + publishedStatus;
        knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
        knowledgeArticleGUID = knowledgeArticleData.id;
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, draftStatus)).toBeTruthy("Article with Draft status not updated.");
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, publishedStatus)).toBeTruthy("Article with Published status not updated.");

        //Create article in Retired status
        articleData.title = title + "_" + retiredStatus;
        knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
        knowledgeArticleGUID = knowledgeArticleData.id;
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, draftStatus)).toBeTruthy("Article with Draft status not updated.");
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, publishedStatus)).toBeTruthy("Article with Published status not updated.");
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, retiredStatus)).toBeTruthy("Article with Retired status not updated.");

        //Create article in Closed status
        articleData.title = title + "_" + closedStatus;
        knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
        knowledgeArticleGUID = knowledgeArticleData.id;
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, draftStatus)).toBeTruthy("Article with Draft status not updated.");
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, publishedStatus)).toBeTruthy("Article with Published status not updated.");
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, closedStatus)).toBeTruthy("Article with Closed status not updated.");

        //Create article in Canceled status
        articleData.title = title + "_" + canceledStatus;
        knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
        knowledgeArticleGUID = knowledgeArticleData.id;
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, canceledStatus)).toBeTruthy("Article with Canceled status not updated.");
    }, 180 * 1000);

    afterEach(async () => {
        await browser.refresh();
    });

    afterEach(async () => {
        await browser.refresh();
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    async function foundationData2002(company: string) {
        await apiHelper.apiLogin('tadmin');
        let domainTagData = domainTagDataFile['DomainTagDataPsilon'];
        let businessData = (businessDataFile['BusinessUnitData2002']);
        let departmentData = departmentDataFile['DepartmentData2002'];
        let suppGrpData = supportGrpDataFile['SuppGrpData2002'];
        // let personData = personDataFile['PersonData2002'];
        let domainTag = await apiHelper.createDomainTag(domainTagData);
        let orgId = await apiCoreUtil.getOrganizationGuid(company);
        businessData.relatedOrgId = orgId;
        let businessUnitId = await apiHelper.createBusinessUnit(businessData);
        departmentData.relatedOrgId = businessUnitId;
        let depId = await apiHelper.createDepartment(departmentData);
        suppGrpData.relatedOrgId = depId;
        await apiHelper.createSupportGroup(suppGrpData);
        await apiHelper.associatePersonToSupportGroup('dbomei', suppGrpData.orgName);
        await apiHelper.associateCategoryUnderDomainTag('Applications', domainTag);
    }



    it('[DRDMV-18999,DRDMV-19000,DRDMV-19002]:Verify the search functionality of knowledge articles console for category tiers 1,2 and 3', async () => {
        let categoryTierFieldColumns: string[] = ["Category Tier 1", "Category Tier 2", "Category Tier 3"];
        let knowledgeGridColumnFields: string[] = ["Article ID", "Title", "Knowledge Set", "Status", "Assignee", "Company", "Template Name", "Reviewer", "Modified By", "Created Date", "Modified Date", "Flagged", "Category Tier 1", "Category Tier 2", "Category Tier 3"];

        try {
            //* Login with Case BA
            await navigationPage.gotoKnowledgeConsole();
            await utilGrid.clearFilter();
            await knowledgeConsole.addColumnOnGrid(categoryTierFieldColumns);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFields)).toBe(true);
            await knowledgeConsole.searchOnGridConsole(categoryTier1FieldVal);
            let categoryTier1Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier1);
            await knowledgeConsole.searchOnGridConsole(categoryTier2FieldVal);
            let categoryTier2Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier2);
            await knowledgeConsole.searchOnGridConsole(categoryTier3FieldVal);
            let categoryTier3Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier3);

            expect(categoryTier1Val).toEqual(categoryTier1FieldVal);
            expect(categoryTier2Val).toEqual(categoryTier2FieldVal);
            expect(categoryTier3Val).toEqual(categoryTier3FieldVal);
            await knowledgeConsole.removeColumnOnGrid(categoryTierFieldColumns);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFields)).toBe(false);
            await knowledgeConsole.searchOnGridConsole(categoryTier1FieldVal);
            categoryTier1Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier1);
            await knowledgeConsole.searchOnGridConsole(categoryTier2FieldVal);
            categoryTier2Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier2);
            await knowledgeConsole.searchOnGridConsole(categoryTier3FieldVal);
            categoryTier3Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier3); expect(categoryTier1Val).toEqual(emptyStr);
            expect(categoryTier1Val).toEqual(emptyStr);
            expect(categoryTier2Val).toEqual(emptyStr);
            expect(categoryTier3Val).toEqual(emptyStr);
            await navigationPage.signOut();

            //Login with case Manager
            await loginPage.login(caseManagerUser);
            await navigationPage.gotoKnowledgeConsole();
            await utilGrid.clearFilter();
            await knowledgeConsole.addColumnOnGrid(categoryTierFieldColumns);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFields)).toBe(true);
            await knowledgeConsole.searchOnGridConsole(categoryTier1FieldVal);
            categoryTier1Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier1);
            await knowledgeConsole.searchOnGridConsole(categoryTier2FieldVal);
            categoryTier2Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier2);
            await knowledgeConsole.searchOnGridConsole(categoryTier3FieldVal);
            categoryTier3Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier3);
            expect(categoryTier1Val).toEqual(categoryTier1FieldVal);
            expect(categoryTier2Val).toEqual(categoryTier2FieldVal);
            expect(categoryTier3Val).toEqual(categoryTier3FieldVal);
            await knowledgeConsole.removeColumnOnGrid(categoryTierFieldColumns);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFields)).toBe(false);
            await knowledgeConsole.searchOnGridConsole(categoryTier1FieldVal);
            categoryTier1Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier1);
            await knowledgeConsole.searchOnGridConsole(categoryTier2FieldVal);
            categoryTier2Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier2);
            await knowledgeConsole.searchOnGridConsole(categoryTier3FieldVal);
            categoryTier3Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier3);
            expect(categoryTier1Val).toEqual(emptyStr);
            expect(categoryTier2Val).toEqual(emptyStr);
            expect(categoryTier3Val).toEqual(emptyStr);
            await navigationPage.signOut();

            //Login with Case Agent user
            await loginPage.login(caseAgentUser);
            await navigationPage.gotoKnowledgeConsole();
            await utilGrid.clearFilter();
            await knowledgeConsole.addColumnOnGrid(categoryTierFieldColumns);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFields)).toBe(true);
            await knowledgeConsole.searchOnGridConsole(categoryTier1FieldVal);
            categoryTier1Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier1);
            await knowledgeConsole.searchOnGridConsole(categoryTier2FieldVal);
            categoryTier2Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier2);
            await knowledgeConsole.searchOnGridConsole(categoryTier3FieldVal);
            categoryTier3Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier3);
            expect(categoryTier1Val).toEqual(categoryTier1FieldVal);
            expect(categoryTier2Val).toEqual(categoryTier2FieldVal);
            expect(categoryTier3Val).toEqual(categoryTier3FieldVal);
            await knowledgeConsole.removeColumnOnGrid(categoryTierFieldColumns);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFields)).toBe(false);
            await knowledgeConsole.searchOnGridConsole(categoryTier1FieldVal);
            categoryTier1Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier1);
            await knowledgeConsole.searchOnGridConsole(categoryTier2FieldVal);
            categoryTier2Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier2);
            await knowledgeConsole.searchOnGridConsole(categoryTier3FieldVal);
            categoryTier3Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier3);
            expect(categoryTier1Val).toEqual(emptyStr);
            expect(categoryTier2Val).toEqual(emptyStr);
            expect(categoryTier3Val).toEqual(emptyStr);
            await navigationPage.signOut();

            //Login with knowledge candidate user
            await loginPage.login(knowledgeCandidateUser);
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            expect(await knowledgeConsole.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilGrid.clearFilter();
            await knowledgeConsole.addColumnOnGrid(categoryTierFieldColumns);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFields)).toBe(true);
            await knowledgeConsole.searchOnGridConsole(categoryTier1FieldVal);
            categoryTier1Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier1);
            await knowledgeConsole.searchOnGridConsole(categoryTier2FieldVal);
            categoryTier2Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier2);
            await knowledgeConsole.searchOnGridConsole(categoryTier3FieldVal);
            categoryTier3Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier3);
            expect(categoryTier1Val).toEqual(categoryTier1FieldVal);
            expect(categoryTier2Val).toEqual(categoryTier2FieldVal);
            expect(categoryTier3Val).toEqual(categoryTier3FieldVal);
            await knowledgeConsole.removeColumnOnGrid(categoryTierFieldColumns);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFields)).toBe(false);
            await knowledgeConsole.searchOnGridConsole(categoryTier1FieldVal);
            categoryTier1Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier1);
            await knowledgeConsole.searchOnGridConsole(categoryTier2FieldVal);
            categoryTier2Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier2);
            await knowledgeConsole.searchOnGridConsole(categoryTier3FieldVal);
            categoryTier3Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier3);
            expect(categoryTier1Val).toEqual(emptyStr);
            expect(categoryTier2Val).toEqual(emptyStr);
            expect(categoryTier3Val).toEqual(emptyStr);
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();

            //Login with knowledge contributor 
            await loginPage.login(knowledgeContributorUser);
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            expect(await knowledgeConsole.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilGrid.clearFilter();
            await knowledgeConsole.addColumnOnGrid(categoryTierFieldColumns);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFields)).toBe(true);
            await knowledgeConsole.searchOnGridConsole(categoryTier1FieldVal);
            categoryTier1Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier1);
            await knowledgeConsole.searchOnGridConsole(categoryTier2FieldVal);
            categoryTier2Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier2);
            await knowledgeConsole.searchOnGridConsole(categoryTier3FieldVal);
            categoryTier3Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier3);
            expect(categoryTier1Val).toEqual(categoryTier1FieldVal);
            expect(categoryTier2Val).toEqual(categoryTier2FieldVal);
            expect(categoryTier3Val).toEqual(categoryTier3FieldVal);
            await knowledgeConsole.removeColumnOnGrid(categoryTierFieldColumns);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFields)).toBe(false);
            await knowledgeConsole.searchOnGridConsole(categoryTier1FieldVal);
            categoryTier1Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier1);
            await knowledgeConsole.searchOnGridConsole(categoryTier2FieldVal);
            categoryTier2Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier2);
            await knowledgeConsole.searchOnGridConsole(categoryTier3FieldVal);
            categoryTier3Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier3);
            expect(categoryTier1Val).toEqual(emptyStr);
            expect(categoryTier2Val).toEqual(emptyStr);
            expect(categoryTier3Val).toEqual(emptyStr);
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();

            //Login with knowledge Publisher
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            expect(await knowledgeConsole.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilGrid.clearFilter();
            await knowledgeConsole.addColumnOnGrid(categoryTierFieldColumns);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFields)).toBe(true);
            await knowledgeConsole.searchOnGridConsole(categoryTier1FieldVal);
            categoryTier1Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier1);
            await knowledgeConsole.searchOnGridConsole(categoryTier2FieldVal);
            categoryTier2Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier2);
            await knowledgeConsole.searchOnGridConsole(categoryTier3FieldVal);
            categoryTier3Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier3);
            expect(categoryTier1Val).toEqual(categoryTier1FieldVal);
            expect(categoryTier2Val).toEqual(categoryTier2FieldVal);
            expect(categoryTier3Val).toEqual(categoryTier3FieldVal);
            await knowledgeConsole.removeColumnOnGrid(categoryTierFieldColumns);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFields)).toBe(false);
            await knowledgeConsole.searchOnGridConsole(categoryTier1FieldVal);
            categoryTier1Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier1);
            await knowledgeConsole.searchOnGridConsole(categoryTier2FieldVal);
            categoryTier2Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier2);
            await knowledgeConsole.searchOnGridConsole(categoryTier3FieldVal);
            categoryTier3Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier3);
            expect(categoryTier1Val).toEqual(emptyStr);
            expect(categoryTier2Val).toEqual(emptyStr);
            expect(categoryTier3Val).toEqual(emptyStr);
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();

            //Login with knowledge coach 
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            expect(await knowledgeConsole.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilGrid.clearFilter();
            await knowledgeConsole.addColumnOnGrid(categoryTierFieldColumns);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFields)).toBe(true);
            await knowledgeConsole.searchOnGridConsole(categoryTier1FieldVal);
            categoryTier1Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier1);
            await knowledgeConsole.searchOnGridConsole(categoryTier2FieldVal);
            categoryTier2Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier2);
            await knowledgeConsole.searchOnGridConsole(categoryTier3FieldVal);
            categoryTier3Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier3);
            expect(categoryTier1Val).toEqual(categoryTier1FieldVal);
            expect(categoryTier2Val).toEqual(categoryTier2FieldVal);
            expect(categoryTier3Val).toEqual(categoryTier3FieldVal);
            await knowledgeConsole.removeColumnOnGrid(categoryTierFieldColumns);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFields)).toBe(false);
            await knowledgeConsole.searchOnGridConsole(categoryTier1FieldVal);
            categoryTier1Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier1);
            await knowledgeConsole.searchOnGridConsole(categoryTier2FieldVal);
            categoryTier2Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier2);
            await knowledgeConsole.searchOnGridConsole(categoryTier3FieldVal);
            categoryTier3Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier3);
            expect(categoryTier1Val).toEqual(emptyStr);
            expect(categoryTier2Val).toEqual(emptyStr);
            expect(categoryTier3Val).toEqual(emptyStr);
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
        }
        catch (error) {
            throw error;
        }
        finally {
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await browser.refresh();
            await utilCommon.waitUntilSpinnerToHide();
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        }
    }, 650 * 1000);

    it('[DRDMV-19004]:Verify the knowledge articles search based on category tier on Quick case / Create case', async () => {
        try {
            //* Check the Availability of Category Tiers with Case BA
            await navigationPage.gotoQuickCase();
            await quickCase.selectRequesterName(caseAgentUser);
            await quickCase.setCaseSummary(articleInDraftStatus);
            //Search with knowledge article with draft status
            await resources.clickOnAdvancedSearchOptions(recommendedKnowledgeStr);
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(recommendedKnowledgeStr)).toEqual(articleInDraftStatus);

            //Search with knowledge article with SMEReview status
            await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(recommendedKnowledgeStr)).toEqual(articleInSMEReviewStatus);

            //Search with knowledge article with Published status
            await resources.enterAdvancedSearchText(articleInPublishedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(recommendedKnowledgeStr)).toEqual(articleInPublishedStatus);

            //Search with knowledge article with Retired status
            await resources.enterAdvancedSearchText(articleInRetiredStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(recommendedKnowledgeStr)).toEqual(articleInRetiredStatus);

            //Search with knowledge article with Closed status
            await resources.enterAdvancedSearchText(articleInClosedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(recommendedKnowledgeStr)).toEqual(articleInClosedStatus);

            //Search with knowledge article with Canceled status
            await resources.enterAdvancedSearchText(articleInCanceledStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(recommendedKnowledgeStr)).toEqual(articleInCanceledStatus);

            //Navigate to Create case
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary(articleInDraftStatus);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePage.clickOnTab('Resources');

            //Search with knowledge article with draft status
            await resources.clickOnAdvancedSearchOptions(knowledgeArticlesStr);
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInDraftStatus);

            //Search with knowledge article with SMEReview status
            await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInSMEReviewStatus);

            //Search with knowledge article with Published status
            await resources.enterAdvancedSearchText(articleInPublishedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInPublishedStatus);

            //Search with knowledge article with Retired status
            await resources.enterAdvancedSearchText(articleInRetiredStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInRetiredStatus);

            //Search with knowledge article with Closed status
            await resources.enterAdvancedSearchText(articleInClosedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInClosedStatus);

            //Search with knowledge article with Canceled status
            await resources.enterAdvancedSearchText(articleInCanceledStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInCanceledStatus);
            await navigationPage.signOut();

            //Login with Case Manager
            await loginPage.login(caseManagerUser);
            await navigationPage.gotoQuickCase();
            await quickCase.selectRequesterName(caseAgentUser);
            await quickCase.setCaseSummary(articleInDraftStatus);
            //Search with knowledge article with draft status
            await resources.clickOnAdvancedSearchOptions(recommendedKnowledgeStr);
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(recommendedKnowledgeStr)).toEqual(articleInDraftStatus);

            //Search with knowledge article with SMEReview status
            await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(recommendedKnowledgeStr)).toEqual(articleInSMEReviewStatus);

            //Search with knowledge article with Published status
            await resources.enterAdvancedSearchText(articleInPublishedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(recommendedKnowledgeStr)).toEqual(articleInPublishedStatus);

            //Search with knowledge article with Retired status
            await resources.enterAdvancedSearchText(articleInRetiredStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(recommendedKnowledgeStr)).toEqual(articleInRetiredStatus);

            //Search with knowledge article with Closed status
            await resources.enterAdvancedSearchText(articleInClosedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(recommendedKnowledgeStr)).toEqual(articleInClosedStatus);

            //Search with knowledge article with Canceled status
            await resources.enterAdvancedSearchText(articleInCanceledStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(recommendedKnowledgeStr)).toEqual(articleInCanceledStatus);

            //Navigate to Create case
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary(articleInDraftStatus);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePage.clickOnTab('Resources');

            //Search with knowledge article with draft status
            await resources.clickOnAdvancedSearchOptions(knowledgeArticlesStr);
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInDraftStatus);

            //Search with knowledge article with SMEReview status
            await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInSMEReviewStatus);

            //Search with knowledge article with Published status
            await resources.enterAdvancedSearchText(articleInPublishedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInPublishedStatus);

            //Search with knowledge article with Retired status
            await resources.enterAdvancedSearchText(articleInRetiredStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInRetiredStatus);

            //Search with knowledge article with Closed status
            await resources.enterAdvancedSearchText(articleInClosedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInClosedStatus);

            //Search with knowledge article with Canceled status
            await resources.enterAdvancedSearchText(articleInCanceledStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInCanceledStatus);
            await navigationPage.signOut();

            //Login with Case Agent
            await loginPage.login(caseAgentUser);
            await navigationPage.gotoQuickCase();
            await quickCase.selectRequesterName(caseManagerUser);
            await quickCase.setCaseSummary(articleInDraftStatus);
            //Search with knowledge article with draft status
            await resources.clickOnAdvancedSearchOptions(recommendedKnowledgeStr);
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(recommendedKnowledgeStr)).toEqual(articleInDraftStatus);

            //Search with knowledge article with SMEReview status
            await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(recommendedKnowledgeStr)).toEqual(articleInSMEReviewStatus);

            //Search with knowledge article with Published status
            await resources.enterAdvancedSearchText(articleInPublishedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(recommendedKnowledgeStr)).toEqual(articleInPublishedStatus);

            //Search with knowledge article with Retired status
            await resources.enterAdvancedSearchText(articleInRetiredStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(recommendedKnowledgeStr)).toEqual(articleInRetiredStatus);

            //Search with knowledge article with Closed status
            await resources.enterAdvancedSearchText(articleInClosedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(recommendedKnowledgeStr)).toEqual(articleInClosedStatus);

            //Search with knowledge article with Canceled status
            await resources.enterAdvancedSearchText(articleInCanceledStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(recommendedKnowledgeStr)).toEqual(articleInCanceledStatus);

            //Navigate to Create case
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary(articleInDraftStatus);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePage.clickOnTab('Resources');

            //Search with knowledge article with draft status
            await resources.clickOnAdvancedSearchOptions(knowledgeArticlesStr);
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInDraftStatus);

            //Search with knowledge article with SMEReview status
            await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInSMEReviewStatus);

            //Search with knowledge article with Published status
            await resources.enterAdvancedSearchText(articleInPublishedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInPublishedStatus);

            //Search with knowledge article with Retired status
            await resources.enterAdvancedSearchText(articleInRetiredStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInRetiredStatus);

            //Search with knowledge article with Closed status
            await resources.enterAdvancedSearchText(articleInClosedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInClosedStatus);

            //Search with knowledge article with Canceled status
            await resources.enterAdvancedSearchText(articleInCanceledStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInCanceledStatus);
        }
        catch (error) {
            throw error;
        }
        finally {
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await browser.refresh();
            await utilCommon.waitUntilSpinnerToHide();
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        }
    }, 780 * 1000);

    it('[DRDMV-19005]:Verify the document search based on category tier from attachments', async () => {
        //Create a document library
        try {
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Document Management--Library', 'Document Library Console - Business Workflows'))
                .toEqual('Document Library Console - Business Workflows');
            let title = `Document-${new Date().valueOf()}`;
            title = "DRDMV-19005Case " + title;
            await createDocumentLibraryPage.openAddNewDocumentBlade();
            await createDocumentLibraryPage.addAttachment(filePath);
            await createDocumentLibraryPage.setTitle(title);
            await createDocumentLibraryPage.selectCompany(companyStr);
            await createDocumentLibraryPage.selectOwnerGroup(ownerSupportGroup);
            await createDocumentLibraryPage.selectCategoryTier1(categoryTier1FieldVal);
            await createDocumentLibraryPage.selectCategoryTier2(categoryTier2FieldVal);
            await createDocumentLibraryPage.selectCategoryTier3(categoryTier3FieldVal);
            await createDocumentLibraryPage.saveNewDocument();
            await documentLibraryConsolePage.searchAndOpenDocumentLibrary(title);
            await editDocumentLibraryPage.selectStatus(documentLibraryStatus);
            await editDocumentLibraryPage.clickOnSaveButton();
            await utilCommon.waitUntilSpinnerToHide();
            await navigationPage.signOut();

            //Login with Case Manager
            await loginPage.login(caseManagerUser);
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary(title);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePage.clickEditCaseButton();
            await editCasePage.clickOnAttachLink();

            await resources.clickOnAdvancedSearchOptions(documentLibraryStr);
            await resources.enterAdvancedSearchText(title);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1ForDocumentLibrary, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(documentLibraryStr)).toEqual(title);
            await navigationPage.signOut();

            //Login with Case Agent
            await loginPage.login(caseAgentUser);
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary(title);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePage.clickEditCaseButton();
            await editCasePage.clickOnAttachLink();

            await resources.clickOnAdvancedSearchOptions(documentLibraryStr);
            await resources.enterAdvancedSearchText(title);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1ForDocumentLibrary, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(documentLibraryStr)).toEqual(title);
            await navigationPage.signOut();

            await loginPage.login(caseBAUser);
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary(title);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePage.clickEditCaseButton();
            await editCasePage.clickOnAttachLink();
            await resources.clickOnAdvancedSearchOptions(documentLibraryStr);
            await resources.enterAdvancedSearchText(title);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1ForDocumentLibrary, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(documentLibraryStr)).toEqual(title);
        }
        catch (error) {
            throw error;
        }
        finally {
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await browser.refresh();
            await utilCommon.waitUntilSpinnerToHide();
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        }
    }, 480 * 1000);

    it('[DRDMV-19356,DRDMV-19082]:Verify the domain configurations are honored while selecting category tiers on Knowledge articles and documents library', async () => {
        await foundationData2002('Psilon');
        let knowledgeDataFile = require("../../data/ui/knowledge/knowledgeArticle.ui.json");
        let knowledgeSetTitleStr = 'versionedKnowledgeSet_' + randomStr;
        let knowledgeSetData = {
            knowledgeSetTitle: `${knowledgeSetTitleStr}`,
            knowledgeSetDesc: `${knowledgeSetTitleStr}+'Desc'`,
            company: 'Psilon'
        }

        await apiHelper.apiLogin('gderuno');
        await apiHelper.createKnowledgeSet(knowledgeSetData);

        try {
            await navigationPage.signOut();
            let businessData = businessDataFile['BusinessUnitData2002'];
            let departmentData = departmentDataFile['DepartmentData2002'];
            let suppGrpData = supportGrpDataFile['SuppGrpData2002'];
            let knowledgeDataFile = require("../../data/ui/knowledge/knowledgeArticle.ui.json")
            let knowledgeData = knowledgeDataFile['DRDMV-2002'];
            await loginPage.login('werusha');
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate(knowledgeData.TemplateName);
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeData.KnowledgeTitle);
            await createKnowledgePage.selectKnowledgeSet(knowledgeSetTitleStr);
            expect(await createKnowledgePage.isCategoryTier1FieldLabelDisplayed(categoryTier1)).toBe(true);
            expect(await createKnowledgePage.isCategoryTier2FieldLabelDisplayed(categoryTier2)).toBe(true);
            expect(await createKnowledgePage.isCategoryTier3FieldLabelDisplayed(categoryTier3)).toBe(true);
            expect(await createKnowledgePage.isCategoryTier4FieldLabelDisplayed(categoryTier4)).toBe(true);
            await createKnowledgePage.clickChangeAssignmentButton();
            await changeAssignmentBlade.selectCompany(knowledgeData.Company);
            await changeAssignmentBlade.selectBusinessUnit(businessData.orgName);
            await changeAssignmentBlade.selectDepartment(departmentData.orgName);
            await changeAssignmentBlade.selectSupportGroup(suppGrpData.orgName);
            await changeAssignmentBlade.selectAssignee('Doomi');
            await changeAssignmentBlade.clickOnAssignButton();
            await createKnowledgePage.selectCategoryTier1Option(categoryTier1FieldVal);
            await createKnowledgePage.selectCategoryTier2Option(categoryTier2FieldVal);
            await createKnowledgePage.selectCategoryTier3Option(categoryTier3FieldVal);
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await previewKnowledgePo.clickOnViewArticleLink();
            await utilCommon.switchToNewWidnow(1);
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            expect(await editKnowledgePage.getCategoryTier1SelectedValue(categoryTier1)).toBe(categoryTier1FieldVal);
        }
        catch (error) {
            throw error;
        }
        finally {
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await browser.refresh();
            await apiHelper.apiLogin('tadmin');
            let domainTagData = domainTagDataFile['DomainTagDataPsilon'];
            let domainTag = await apiHelper.createDomainTag(domainTagData);
            await apiHelper.disableDomainTag(domainTag);
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        }
    }, 240 * 1000);
})
