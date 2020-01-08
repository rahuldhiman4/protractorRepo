import { browser, protractor } from "protractor";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import knowledgeConsole from '../../pageobject/knowledge/knowledge-articles-console.po';
import resources from '../../pageobject/common/resources-tab.po';
import utilCommon from '../../utils/util.common';
import apiHelper from '../../api/api.helper';
import quickCase from '../../pageobject/case/quick-case.po';
import createCasePage from '../../pageobject/case/create-case.po';
import editCasePage from '../../pageobject/case/edit-case.po';
import createDocumentLibraryPage from '../../pageobject/settings/document-management/create-document-library.po';
import utilGrid from "../../utils/util.grid";
import viewCasePage from "../../pageobject/case/view-case.po";
import createKnowledgePage from "../../pageobject/knowledge/create-knowlege.po";
import editKnowledgePage from '../../pageobject/knowledge/edit-knowledge.po';
import { Knowledge } from '../../api/constant.api';
var caseBAUser = 'qkatawazi';
var caseAgentUser = 'qtao';
var caseManagerUser = 'qdu';
var knowledgeCandidateUser = 'kayo';
var knowledgeContributorUser = 'kkohri';
var knowledgePublisherUser = 'kmills';
var knowledgeCoachUser = 'kWilliamson';
var articleName = 'Knowledge Article';
var categoryTier1 = 'Category Tier 1';
var categoryTier2 = 'Category Tier 2';
var categoryTier3 = 'Category Tier 3';
var categoryTier4 = 'Category Tier 4';
var categoryTier1FieldVal = 'Applications';
var categoryTier1FieldVal1 = 'Employee Relations';
var categoryTier2FieldVal = 'Help Desk';
var categoryTier3FieldVal = 'Incident';
var knowledgeManagementApp = "Knowledge Management";
var knowledgeArticlesTitleStr = "Knowledge Articles";
var knowledgeArticlesGuid = "0df18e99-4315-457c-aef0-3abc96fb08ee";
var advancedSearchOptionCategoryTier1 = "Operational Category Tier 1";
var advancedSearchOptionCategoryTier1ForDocumentLibrary = "Operational Category 1";
var knowledgeArticlesStr = "Knowledge Articles ";
var recommendedKnowledgeStr = "Recommended Knowledge ";
var applyBtn = "Apply";
var emptyStr = '';
var articleInDraftStatus = 'Knowledge Article_Draft';
var articleInSMEReviewStatus = 'Knowledge Article_SMEReview';
var articleInPublishedStatus = 'Knowledge Article_Published';
var articleInRetiredStatus = 'Knowledge Article_Retired';
var articleInClosedStatus = 'Knowledge Article_Closed';
var articleInCanceledStatus = 'Knowledge Article_Canceled';
var companyStr = "Petramco";
var ownerSupportGroup = "Compensation and Benefits";
var documentLibraryColumnHeader = "Title";
var documentLibraryStr = "Document Library ";
var successMsg = "Saved successfully.";
var documentLibraryStatus = "Published";
var draftStatus="Draft";
var inProgressStatus="In Progress";
var smeReviewStatus = "SME Review";
var publishedStatus = "Published";
var retiredStatus = "Retired";
var closedStatus = "Closed";
var canceledStatus = "Canceled";

describe('Knowledge Articles Tests', () => {
    const draft: any = Knowledge.Draft;
    const smeReview: any = Knowledge.SMEReview;
    const published: any = Knowledge.Published;
    const retired: any = Knowledge.Retired;
    const closed: any = Knowledge.Closed;
    const canceled: any = Knowledge.Canceled;
    const regionGuid = 'cec69daa-b696-415b-b2ab-ebec81251d10';
    const siteGuid = '1a4afa56-0b87-45ea-9456-f251b0848c70';
    const knowledgeHamburgerGuid = 'a9dfa448-2900-4a2b-a230-503f4a0ac12e';
    const filePath = '../../api/attachment/articleStatus.png';

    beforeAll(async () => {
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
        await loginPage.login(caseBAUser);
        await apiHelper.apiLogin(caseBAUser);
        var articleData = {
            "knowledgeSet": "HR",
            "title": "DRDMV18670KnowledgeArticle",
            "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
            "categoryTier1": "cddc9f6098ac421a1aa40ec9be503abb0fda61530bc9dbb22e7049cba9c5839018ba7205a392cd9f37141091bbe33e28405caff795929e4d805fa787dfea2c0c",
            "categoryTier2": "a1390bbfc100bd7ad0fbe10210092865d8d968ff75c6fc7c68cc9b3cb727b6b9d0fff90f7a2f85aeb5d0d7903ac2b08002e172bfec02e807e4a863dce4716dea",
            "categoryTier3": "a30287ce17b81c1cc85a1ee1fba666cc810274ce2f5e3817057a9d1ec85a459802cd2c5240376d2e85cd6914115b1696badd1db19604cf840ab0c6d084cf5a80",
            "region": "56628a427b547dbcfacb771aa3bdafba4a35e453a860d1e2ec96193f347c6de11c10cb3ed7ac44797862c6e30d233f3bf8b2514717b7bc70d134b9b9a8d17099",
            "site": "0e3cfe8c958e46bd54722d6cc274399504633acb02011b950228abcf10d02cb59145466d4ac3512155204ac6849562c049c9a719e1f961c4a010eb62dc983a8c"
        }
        //Create article in draft status
        let knowledgeArticleTitle: string = articleData.title + "_" + inProgressStatus;
        articleData.title = knowledgeArticleTitle;
        var knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);


        //Create article in draft status
        knowledgeArticleTitle = articleData.title + "_" + draftStatus;
        articleData.title = knowledgeArticleTitle;
        var knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
        var knowledgeArticleGUID = knowledgeArticleData.id;
        var updateArticle: boolean = await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, draft);
        expect(updateArticle).toBe(true);

        //Create article in SMEReview status
        knowledgeArticleTitle = articleData.title + "_" + smeReviewStatus;
        articleData.title = knowledgeArticleTitle;
        var knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
        var knowledgeArticleGUID = knowledgeArticleData.id;
        var updateArticle: boolean = await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, draft);
        expect(updateArticle).toBe(true);
        var updateArticle: boolean = await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, smeReview);
        expect(updateArticle).toBe(true);

        //Create article in Published status
        knowledgeArticleTitle = articleData.title + "_" + publishedStatus;
        articleData.title = knowledgeArticleTitle;
        var knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
        var knowledgeArticleGUID = knowledgeArticleData.id;
        var updateArticle: boolean = await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, draft);
        expect(updateArticle).toBe(true);
        var updateArticle: boolean = await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, draft);
        expect(updateArticle).toBe(true);
        var updateArticle: boolean = await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, published);
        expect(updateArticle).toBe(true);

        //Create article in Retired status
        knowledgeArticleTitle = articleData.title + "_" + retiredStatus;
        articleData.title = knowledgeArticleTitle;
        var knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
        var knowledgeArticleGUID = knowledgeArticleData.id;
        var updateArticle: boolean = await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, draft);
        expect(updateArticle).toBe(true);
        var updateArticle: boolean = await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, draft);
        expect(updateArticle).toBe(true);
        var updateArticle: boolean = await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, published);
        expect(updateArticle).toBe(true);
        var updateArticle: boolean = await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, retired);
        expect(updateArticle).toBe(true);

        //Create article in Closed status
        knowledgeArticleTitle = articleData.title + "_" + closedStatus;
        articleData.title = knowledgeArticleTitle;
        var knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
        var knowledgeArticleGUID = knowledgeArticleData.id;
        var updateArticle: boolean = await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, draft);
        expect(updateArticle).toBe(true);
        var updateArticle: boolean = await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, draft);
        expect(updateArticle).toBe(true);
        var updateArticle: boolean = await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, published);
        expect(updateArticle).toBe(true);
        var updateArticle: boolean = await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, closed);
        expect(updateArticle).toBe(true);

        //Create article in Canceled status
        knowledgeArticleTitle = articleData.title + "_" + canceledStatus;
        articleData.title = knowledgeArticleTitle;
        var knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
        var knowledgeArticleGUID = knowledgeArticleData.id;
        var updateArticle: boolean = await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, canceledStatus);
        expect(updateArticle).toBe(true);
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    it('DRDMV-18999,DRDMV-19000,DRDMV-19002:Verify the search functionality of knowledge articles console for category tiers 1,2 and 3', async () => {
        let categoryTierFieldColumns:string[] = ["Category Tier 1","Category Tier 2","Category Tier 3"];
        let knowledgeGridColumnFields:string[] = ["Article ID","Title","Knowledge Set","Status","Assignee","Company","Template Name","Reviewer","Modified By","Created Date","Modified Date","Flagged","Category Tier 1","Category Tier 2","Category Tier 3"];

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
            categoryTier3Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier3);            expect(categoryTier1Val).toEqual(emptyStr);
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
            await navigationPage.signOut();
        }
        catch (Error) {
            expect(fail);
        }
        finally {
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await browser.refresh();
            await utilCommon.waitUntilSpinnerToHide();
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        }

    },500 * 1000);

    it('DRDMV-19004:Verify the knowledge articles search based on category tier on Quick case / Create case', async () => {
        try {
            //* Check the Availability of Category Tiers with Case BA
            await navigationPage.gotoQuickCase();
            await quickCase.setAndSelectRequesterName(caseAgentUser);
            await quickCase.setCaseSummary(articleInDraftStatus);
            //Search with knowledge article with draft status
            await resources.clickOnAdvancedSearchOptions(recommendedKnowledgeStr);
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResult()).toEqual(articleInDraftStatus);

            //Search with knowledge article with SMEReview status
            await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResult()).toEqual(articleInSMEReviewStatus);

            //Search with knowledge article with Published status
            await resources.enterAdvancedSearchText(articleInPublishedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResult()).toEqual(articleInPublishedStatus);

            //Search with knowledge article with Retired status
            await resources.enterAdvancedSearchText(articleInRetiredStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResult()).toEqual(articleInRetiredStatus);

            //Search with knowledge article with Closed status
            await resources.enterAdvancedSearchText(articleInClosedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResult()).toEqual(articleInClosedStatus);

            //Search with knowledge article with Canceled status
            await resources.enterAdvancedSearchText(articleInCanceledStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResult()).toEqual(articleInCanceledStatus);

            //Navigate to Create case
            await navigationPage.gotCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary(articleInDraftStatus);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await createCasePage.clickGoToCaseButton();
            await editCasePage.navigateToResourcesTab();

            //Search with knowledge article with draft status
            await resources.clickOnAdvancedSearchOptions(knowledgeArticlesStr);
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResult()).toEqual(articleInDraftStatus);

            //Search with knowledge article with SMEReview status
            await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResult()).toEqual(articleInSMEReviewStatus);

            //Search with knowledge article with Published status
            await resources.enterAdvancedSearchText(articleInPublishedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResult()).toEqual(articleInPublishedStatus);

            //Search with knowledge article with Retired status
            await resources.enterAdvancedSearchText(articleInRetiredStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResult()).toEqual(articleInRetiredStatus);

            //Search with knowledge article with Closed status
            await resources.enterAdvancedSearchText(articleInClosedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResult()).toEqual(articleInClosedStatus);

            //Search with knowledge article with Canceled status
            await resources.enterAdvancedSearchText(articleInCanceledStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResult()).toEqual(articleInCanceledStatus);
            await navigationPage.signOut();

            //Login with Case Manager
            await loginPage.login(caseManagerUser);
            await navigationPage.gotoQuickCase();
            await quickCase.setAndSelectRequesterName(caseAgentUser);
            await quickCase.setCaseSummary(articleInDraftStatus);
            //Search with knowledge article with draft status
            await resources.clickOnAdvancedSearchOptions(recommendedKnowledgeStr);
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResult()).toEqual(articleInDraftStatus);

            //Search with knowledge article with SMEReview status
            await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResult()).toEqual(articleInSMEReviewStatus);

            //Search with knowledge article with Published status
            await resources.enterAdvancedSearchText(articleInPublishedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResult()).toEqual(articleInPublishedStatus);

            //Search with knowledge article with Retired status
            await resources.enterAdvancedSearchText(articleInRetiredStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResult()).toEqual(articleInRetiredStatus);

            //Search with knowledge article with Closed status
            await resources.enterAdvancedSearchText(articleInClosedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResult()).toEqual(articleInClosedStatus);

            //Search with knowledge article with Canceled status
            await resources.enterAdvancedSearchText(articleInCanceledStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResult()).toEqual(articleInCanceledStatus);

            //Navigate to Create case
            await navigationPage.gotCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary(articleInDraftStatus);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await createCasePage.clickGoToCaseButton();
            await editCasePage.navigateToResourcesTab();

            //Search with knowledge article with draft status
            await resources.clickOnAdvancedSearchOptions(knowledgeArticlesStr);
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResult()).toEqual(articleInDraftStatus);

            //Search with knowledge article with SMEReview status
            await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResult()).toEqual(articleInSMEReviewStatus);

            //Search with knowledge article with Published status
            await resources.enterAdvancedSearchText(articleInPublishedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResult()).toEqual(articleInPublishedStatus);

            //Search with knowledge article with Retired status
            await resources.enterAdvancedSearchText(articleInRetiredStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResult()).toEqual(articleInRetiredStatus);

            //Search with knowledge article with Closed status
            await resources.enterAdvancedSearchText(articleInClosedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResult()).toEqual(articleInClosedStatus);

            //Search with knowledge article with Canceled status
            await resources.enterAdvancedSearchText(articleInCanceledStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResult()).toEqual(articleInCanceledStatus);
            await navigationPage.signOut();

            //Login with Case Agent
            await loginPage.login(caseAgentUser);
            await navigationPage.gotoQuickCase();
            await quickCase.setAndSelectRequesterName(caseManagerUser);
            await quickCase.setCaseSummary(articleInDraftStatus);
            //Search with knowledge article with draft status
            await resources.clickOnAdvancedSearchOptions(recommendedKnowledgeStr);
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResult()).toEqual(articleInDraftStatus);

            //Search with knowledge article with SMEReview status
            await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResult()).toEqual(articleInSMEReviewStatus);

            //Search with knowledge article with Published status
            await resources.enterAdvancedSearchText(articleInPublishedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResult()).toEqual(articleInPublishedStatus);

            //Search with knowledge article with Retired status
            await resources.enterAdvancedSearchText(articleInRetiredStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResult()).toEqual(articleInRetiredStatus);

            //Search with knowledge article with Closed status
            await resources.enterAdvancedSearchText(articleInClosedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResult()).toEqual(articleInClosedStatus);

            //Search with knowledge article with Canceled status
            await resources.enterAdvancedSearchText(articleInCanceledStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResult()).toEqual(articleInCanceledStatus);

            //Navigate to Create case
            await navigationPage.gotCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary(articleInDraftStatus);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await createCasePage.clickGoToCaseButton();
            await editCasePage.navigateToResourcesTab();

            //Search with knowledge article with draft status
            await resources.clickOnAdvancedSearchOptions(knowledgeArticlesStr);
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResult()).toEqual(articleInDraftStatus);

            //Search with knowledge article with SMEReview status
            await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResult()).toEqual(articleInSMEReviewStatus);

            //Search with knowledge article with Published status
            await resources.enterAdvancedSearchText(articleInPublishedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResult()).toEqual(articleInPublishedStatus);

            //Search with knowledge article with Retired status
            await resources.enterAdvancedSearchText(articleInRetiredStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResult()).toEqual(articleInRetiredStatus);

            //Search with knowledge article with Closed status
            await resources.enterAdvancedSearchText(articleInClosedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResult()).toEqual(articleInClosedStatus);

            //Search with knowledge article with Canceled status
            await resources.enterAdvancedSearchText(articleInCanceledStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResult()).toEqual(articleInCanceledStatus);
            await navigationPage.signOut();
        }
        catch (Error) {
            expect(fail);
        }
        finally {
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await browser.refresh();
            await utilCommon.waitUntilSpinnerToHide();
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        }

    },300 * 1000);

    it('DRDMV-19005:Verify the document search based on category tier from attachments', async () => {
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
            await createDocumentLibraryPage.clickOnSelectedGridRecord(documentLibraryColumnHeader);
            await createDocumentLibraryPage.selectStatus(documentLibraryStatus);
            await createDocumentLibraryPage.saveUpdatedDocument();
            await navigationPage.signOut();

            //Login with Case Manager
            await loginPage.login(caseManagerUser);
            await navigationPage.gotCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary(title);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await createCasePage.clickGoToCaseButton();
            await viewCasePage.clickEditCaseButton();
            await editCasePage.clickOnAttachLink();

            await resources.clickOnAdvancedSearchOptions(documentLibraryStr);
            await resources.enterAdvancedSearchText(title);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1ForDocumentLibrary, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResult()).toEqual(title);
            await navigationPage.signOut();

            //Login with Case Agent
            await loginPage.login(caseAgentUser);
            await navigationPage.gotCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary(title);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await createCasePage.clickGoToCaseButton();
            await viewCasePage.clickEditCaseButton();
            await editCasePage.clickOnAttachLink();

            await resources.clickOnAdvancedSearchOptions(documentLibraryStr);
            await resources.enterAdvancedSearchText(title);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1ForDocumentLibrary, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResult()).toEqual(title);
            await navigationPage.signOut();

            await loginPage.login(caseBAUser);
            await navigationPage.gotCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary(title);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await createCasePage.clickGoToCaseButton();
            await viewCasePage.clickEditCaseButton();
            await editCasePage.clickOnAttachLink();
            await resources.clickOnAdvancedSearchOptions(documentLibraryStr);
            await resources.enterAdvancedSearchText(title);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(advancedSearchOptionCategoryTier1ForDocumentLibrary, categoryTier1FieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResult()).toEqual(title);
            await navigationPage.signOut();
        }
        catch (Error) {
            expect(fail);
        }
        finally {
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await browser.refresh();
            await utilCommon.waitUntilSpinnerToHide();
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        }
    },300 * 1000);

    it('DRDMV-19356:Verify the domain configurations are honored while selecting category tiers on Knowledge articles and documents library', async () => {
        var domainTagData = {
            domainTagName: 'HR'
        }
        let knowledgeDataFile = require("../../data/ui/knowledge/knowledgeArticle.ui.json");
        let knowledgeData = knowledgeDataFile['DRDMV-19020'];

        await apiHelper.apiLogin("tadmin");
        let domainTag = await apiHelper.createDomainTag(domainTagData);
        await apiHelper.associateCategoryUnderDomainTag(categoryTier1FieldVal, domainTag);
        await apiHelper.associateCategoryUnderDomainTag(categoryTier1FieldVal1, domainTag);

        try {
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate(knowledgeData.TemplateName);
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeData.KnowledgeTitle);
            await createKnowledgePage.selectKnowledgeSet(knowledgeData.KnowledgeSet);
            expect(await createKnowledgePage.isCategoryTier1FieldLabelDisplayed(categoryTier1)).toBe(true);
            expect(await createKnowledgePage.isCategoryTier2FieldLabelDisplayed(categoryTier2)).toBe(true);
            expect(await createKnowledgePage.isCategoryTier3FieldLabelDisplayed(categoryTier3)).toBe(true);
            expect(await createKnowledgePage.isCategoryTier4FieldLabelDisplayed(categoryTier4)).toBe(true);

            await createKnowledgePage.selectCategoryTier1Option(categoryTier1FieldVal);
            await createKnowledgePage.selectCategoryTier2Option(categoryTier2FieldVal);
            await createKnowledgePage.selectCategoryTier3Option(categoryTier3FieldVal);
            await createKnowledgePage.clickAssignToMeButton();
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await createKnowledgePage.clickOnviewArticleLinkButton();
            await utilCommon.switchToNewWidnow(1);
            await editKnowledgePage.editKnowledgeMedataData();
            expect(await editKnowledgePage.getCategoryTier1SelectedValue(categoryTier1)).toBe(categoryTier1FieldVal);
        }
        catch (Error) {
            expect(fail);
        }
        finally {
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await browser.refresh();
            await utilCommon.waitUntilSpinnerToHide();
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        }
    });

})
