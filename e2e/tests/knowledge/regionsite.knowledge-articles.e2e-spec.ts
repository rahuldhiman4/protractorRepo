import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import previewCasePo from '../../pageobject/case/case-preview.po';
import createCasePage from '../../pageobject/case/create-case.po';
import quickCase from '../../pageobject/case/quick-case.po';
import viewCasePage from "../../pageobject/case/view-case.po";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import resources from '../../pageobject/common/resources-tab.po';
import composeMailPo from '../../pageobject/email/compose-mail.po';
import createKnowledgePage from "../../pageobject/knowledge/create-knowlege.po";
import editKnowledgePo from '../../pageobject/knowledge/edit-knowledge.po';
import knowledgeConsole from '../../pageobject/knowledge/knowledge-articles-console.po';
import previewKnowledgePo from '../../pageobject/knowledge/preview-knowledge.po';
import viewKnowledgeArticlePo from '../../pageobject/knowledge/view-knowledge-article.po';
import createDocumentLibraryPage from '../../pageobject/settings/document-management/create-document-library.po';
import documentLibraryPage from '../../pageobject/settings/document-management/document-library-console.po';
import editDocumentLibraryPo from '../../pageobject/settings/document-management/edit-document-library.po';
import activityTabPo from '../../pageobject/social/activity-tab.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilGrid from "../../utils/util.grid";
import utilityGrid from "../../utils/utility.grid";
import utilityCommon from '../../utils/utility.common';
import changeAssignmentBladePo from '../../pageobject/common/change-assignment-blade.po';

let caseBAUser = 'qkatawazi';
let caseAgentUser = 'qtao';
let caseManagerUser = 'qdu';
let knowledgeCandidateUser = 'kayo';
let knowledgeContributorUser = 'kkohri';
let knowledgePublisherUser = 'kmills';
let knowledgeCoachUser = 'kWilliamson';
let emptyStr = "";
let articleInDraftStatus = 'DRDMV-19572 KnowledgeArticle_Draft';
let articleInSMEReviewStatus = 'DRDMV-19572 KnowledgeArticle_SME Review';
let articleInPublishedStatus = 'DRDMV-19572 KnowledgeArticle_PublishApproval';
let articleInRetiredStatus = 'DRDMV-19572 KnowledgeArticle_RetireApproval';
let articleInClosedStatus = 'DRDMV-19572 KnowledgeArticle_Closed';
let articleInCanceledStatus = 'DRDMV-19572 KnowledgeArticle_CancelApproval';
let regionField = "Region";
let siteField = "Site";
let regionFieldVal = "Australia";
let siteFieldVal = "Canberra";
let regionFieldVal2 = "Central America";
let siteFieldVal1 = "Mexico City";
let knowledgeManagementApp = "Knowledge Management";
let companyStr = "Petramco";
let hrSupportStr = "HR Support";
let ownerSupportGroup = "Compensation and Benefits";
let documentLibraryColumnHeader = "Title";
let applyBtn = "Apply";
let documentLibraryStr = "Document Library ";
let RecommendedKnowledgeStr = "Recommended Knowledge ";
let successMsg = "Saved successfully.";
let documentLibraryStatus = "Published";
let knowledgeArticlesStr = "Knowledge Articles ";
let draftStatus = "Draft";
let inProgressStatus = "In Progress";
let smeReviewStatus = "SME Review";
let publishedApprovalStatus = "PublishApproval";
let retiredApprovalStatus = "RetireApproval";
let closedStatus = "Closed";
let canceledApprovalStatus = "CancelApproval";
let title = "DRDMV-19572 KnowledgeArticle";

describe('Knowledge Articles - Location (Region / Site) Tests', () => {
    const filePath = '../../../data/ui/attachment/articleStatus.png';
    let knowledgeModule = 'Knowledge';
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login(caseBAUser);
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteApprovalMapping(knowledgeModule);
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
            "company": "Petramco",
            "assignedCompany": "Petramco",
            "assigneeBusinessUnit": "United Kingdom Support",
            "assigneeSupportGroup": "GB Support 1",
            "assignee": "KMills"
        }
        // Create article in in progress status
        articleData.title = title + "_" + inProgressStatus;
        await apiHelper.createKnowledgeArticle(articleData);

        //Create article in draft status
        articleData.title = title + "_" + draftStatus;
        let knowledgeArticleData1 = await apiHelper.createKnowledgeArticle(articleData);
        let knowledgeArticleGUID1 = knowledgeArticleData1.id;
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID1, draftStatus)).toBeTruthy("Article with Draft status not updated.");

        //Create article in SMEReview status
        articleData.title = title + "_" + smeReviewStatus;
        let knowledgeArticleData2 = await apiHelper.createKnowledgeArticle(articleData);
        let knowledgeArticleGUID2 = knowledgeArticleData2.id;
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID2, draftStatus)).toBeTruthy("Article with Draft status not updated.");
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID2, "SMEReview", "KMills", 'GB Support 2', 'Petramco')).toBeTruthy("Article with SME Review status not updated.");

        //Create article in Published status
        articleData.title = title + "_" + publishedApprovalStatus;
        let knowledgeArticleData3 = await apiHelper.createKnowledgeArticle(articleData);
        let knowledgeArticleGUID3 = knowledgeArticleData3.id;
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID3, draftStatus)).toBeTruthy("Article with Draft status not updated.");
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID3, publishedApprovalStatus)).toBeTruthy("Article with Published status not updated.");

        //Create article in Retired status
        articleData.title = title + "_" + retiredApprovalStatus;
        let knowledgeArticleData4 = await apiHelper.createKnowledgeArticle(articleData);
        let knowledgeArticleGUID4 = knowledgeArticleData4.id;
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID4, draftStatus)).toBeTruthy("Article with Draft status not updated.");
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID4, publishedApprovalStatus)).toBeTruthy("Article with Published status not updated.");
        await browser.sleep(5000); // To Wait Until Publish Approval Status Change
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID4, retiredApprovalStatus)).toBeTruthy("Article with Retired status not updated.");

        //Create article in Closed status
        articleData.title = title + "_" + closedStatus;
        let knowledgeArticleData5 = await apiHelper.createKnowledgeArticle(articleData);
        let knowledgeArticleGUID5 = knowledgeArticleData5.id;
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID5, draftStatus)).toBeTruthy("Article with Draft status not updated.");
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID5, publishedApprovalStatus)).toBeTruthy("Article with Published status not updated.");
        await browser.sleep(5000); // To Wait Until Publish Approval Status Change.
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID5, retiredApprovalStatus)).toBeTruthy("Article with Published status not updated.");
        await browser.sleep(5000); // To Wait Until Retire Approval Status Change.
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID5, closedStatus)).toBeTruthy("Article with Closed status not updated.");

        //Create article in Canceled status
        articleData.title = title + "_" + canceledApprovalStatus;
        let knowledgeArticleData6 = await apiHelper.createKnowledgeArticle(articleData);
        let knowledgeArticleGUID6 = knowledgeArticleData6.id;
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID6, canceledApprovalStatus)).toBeTruthy("Article with Canceled status not updated.");
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    describe('[DRDMV-19569,DRDMV-19570,DRDMV-19571]:Verify the search functionality of knowledge articles console for Region', () => {
        let regionFieldColumn: string[] = ["Region"];
        let knowledgeGridColumnFields: string[] = ["Article ID", "Title", "Knowledge Set", "Status", "Assignee", "Company", "Template Name", "Reviewer", "Modified By", "Created Date", "Modified Date", "Flagged", "Region"];
        let knowledgeGridColumnFieldsWithoutRegion: string[] = ["Article ID", "Title", "Knowledge Set", "Status", "Assignee", "Company", "Template Name", "Reviewer", "Modified By", "Created Date", "Modified Date", "Flagged"];
        let regionVal: string = undefined;

        it('[DRDMV-19569,DRDMV-19570,DRDMV-19571]:Verify the search functionality of knowledge articles console for Region', async () => {
            await navigationPage.gotoKnowledgeConsole();
            await utilityGrid.clearFilter();
            await knowledgeConsole.addColumnOnGrid(regionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFields)).toBe(true);
            await utilityGrid.searchRecord(regionFieldVal);
            expect(await utilityGrid.isEntireColumnContainsSameValue(regionField, regionFieldVal)).toBeTruthy('Search results does not match');
            await knowledgeConsole.removeColumnOnGrid(regionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFieldsWithoutRegion)).toBe(true);
            await utilityGrid.searchRecord(regionFieldVal);
            regionVal = await knowledgeConsole.getSelectedGridRecordValue(regionField);
            expect(regionVal).toEqual(emptyStr);
            await navigationPage.signOut();

            await loginPage.login(caseManagerUser);
            await navigationPage.gotoKnowledgeConsole();
            await utilityGrid.clearFilter();
            await knowledgeConsole.addColumnOnGrid(regionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFields)).toBe(true);
            await utilityGrid.searchRecord(regionFieldVal);
            expect(await utilityGrid.isEntireColumnContainsSameValue(regionField, regionFieldVal)).toBeTruthy('Search results does not match');
            await knowledgeConsole.removeColumnOnGrid(regionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFieldsWithoutRegion)).toBe(true);
            await utilityGrid.searchRecord(regionFieldVal);
            regionVal = await knowledgeConsole.getSelectedGridRecordValue(regionField);
            expect(regionVal).toEqual(emptyStr);
            await navigationPage.signOut();
        });

        it('[DRDMV-19569,DRDMV-19570,DRDMV-19571]:Verify the search functionality of knowledge articles console for Region', async () => {
            await loginPage.login(caseAgentUser);
            await navigationPage.gotoKnowledgeConsole();
            await utilityGrid.clearFilter();
            await knowledgeConsole.addColumnOnGrid(regionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFields)).toBe(true);
            await utilityGrid.searchRecord(regionFieldVal);
            expect(await utilityGrid.isEntireColumnContainsSameValue(regionField, regionFieldVal)).toBeTruthy('Search results does not match');
            await knowledgeConsole.removeColumnOnGrid(regionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFieldsWithoutRegion)).toBe(true);
            await utilityGrid.searchRecord(regionFieldVal);
            regionVal = await knowledgeConsole.getSelectedGridRecordValue(regionField);
            expect(regionVal).toEqual(emptyStr);
            await navigationPage.signOut();

            await loginPage.login(knowledgeCandidateUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            await utilityGrid.clearFilter();
            await knowledgeConsole.addColumnOnGrid(regionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFields)).toBe(true);
            await utilityGrid.searchRecord(regionFieldVal);
            expect(await utilityGrid.isEntireColumnContainsSameValue(regionField, regionFieldVal)).toBeTruthy('Search results does not match');
            await knowledgeConsole.removeColumnOnGrid(regionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFieldsWithoutRegion)).toBe(true);
            await utilityGrid.searchRecord(regionFieldVal);
            regionVal = await knowledgeConsole.getSelectedGridRecordValue(regionField);
            expect(regionVal).toEqual(emptyStr);
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
        });

        it('[DRDMV-19569,DRDMV-19570,DRDMV-19571]:Verify the search functionality of knowledge articles console for Region', async () => {
            await loginPage.login(knowledgeContributorUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            await utilityGrid.clearFilter();
            await knowledgeConsole.addColumnOnGrid(regionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFields)).toBe(true);
            await utilityGrid.searchRecord(regionFieldVal);
            expect(await utilityGrid.isEntireColumnContainsSameValue(regionField, regionFieldVal)).toBeTruthy('Search results does not match');
            await knowledgeConsole.removeColumnOnGrid(regionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFieldsWithoutRegion)).toBe(true);
            await utilityGrid.searchRecord(regionFieldVal);
            regionVal = await knowledgeConsole.getSelectedGridRecordValue(regionField);
            expect(regionVal).toEqual(emptyStr);
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();

            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            await utilityGrid.clearFilter();
            await knowledgeConsole.addColumnOnGrid(regionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFields)).toBe(true);
            await utilityGrid.searchRecord(regionFieldVal);
            expect(await utilityGrid.isEntireColumnContainsSameValue(regionField, regionFieldVal)).toBeTruthy('Search results does not match');
            await knowledgeConsole.removeColumnOnGrid(regionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFieldsWithoutRegion)).toBe(true);
            await utilityGrid.searchRecord(regionFieldVal);
            regionVal = await knowledgeConsole.getSelectedGridRecordValue(regionField);
            expect(regionVal).toEqual(emptyStr);
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
        });

        it('[DRDMV-19569,DRDMV-19570,DRDMV-19571]:Verify the search functionality of knowledge articles console for Region', async () => {
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            await utilityGrid.clearFilter();
            await knowledgeConsole.addColumnOnGrid(regionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFields)).toBe(true);
            await utilityGrid.searchRecord(regionFieldVal);
            expect(await utilityGrid.isEntireColumnContainsSameValue(regionField, regionFieldVal)).toBeTruthy('Search results does not match');
            await knowledgeConsole.removeColumnOnGrid(regionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFieldsWithoutRegion)).toBe(true);
            await utilityGrid.searchRecord(regionFieldVal);
            regionVal = await knowledgeConsole.getSelectedGridRecordValue(regionField);
            expect(regionVal).toEqual(emptyStr);
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        });

        afterAll(async () => {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        });

    });

    describe('[DRDMV-19565,DRDMV-19567,DRDMV-19568]:Verify the Save functionality of Region and Site fields on Knowledge Articles Create / Edit screen', () => {
        let knowledgeDataFile = require("../../data/ui/knowledge/knowledgeArticle.ui.json");
        let knowledgeData = knowledgeDataFile['DRDMV-19020'];

        it('[DRDMV-19565,DRDMV-19567,DRDMV-19568]:Verify the Save functionality of Region and Site fields on Knowledge Articles Create / Edit screen', async () => {
            //* Check the Availability of Region with Case Business Analyst
            await navigationPage.gotoKnowledgeConsole();
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate(knowledgeData.TemplateName);
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeData.KnowledgeTitle);
            await createKnowledgePage.selectRegionDropDownOption(regionFieldVal);
            await createKnowledgePage.selectKnowledgeSet(knowledgeData.KnowledgeSet);
            await createKnowledgePage.clickAssignToMeButton();
            await createKnowledgePage.selectSiteDropDownOption(siteFieldVal);
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await previewKnowledgePo.clickGoToArticleButton();
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            expect(await editKnowledgePo.getSelectedFieldValue(regionField)).toBe(regionFieldVal);
            expect(await editKnowledgePo.getSelectedFieldValue(siteField)).toBe(siteFieldVal);
            await editKnowledgePo.selectRegionDropDownOption(regionFieldVal2);
            await editKnowledgePo.selectSiteDropDownOption(siteFieldVal1);
            await editKnowledgePo.saveKnowledgeMedataDataChanges();
            await navigationPage.signOut();

            //Create Knowledge article by Case Manager
            await loginPage.login('frieda');
            await navigationPage.gotoKnowledgeConsole();
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate(knowledgeData.TemplateName);
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeData.KnowledgeTitle);
            await createKnowledgePage.selectRegionDropDownOption(regionFieldVal);
            await createKnowledgePage.selectKnowledgeSet(knowledgeData.KnowledgeSet);
            await createKnowledgePage.clickAssignToMeButton();
            await createKnowledgePage.selectSiteDropDownOption(siteFieldVal);
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await previewKnowledgePo.clickGoToArticleButton();
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            expect(await editKnowledgePo.getSelectedFieldValue(regionField)).toBe(regionFieldVal);
            expect(await editKnowledgePo.getSelectedFieldValue(siteField)).toBe(siteFieldVal);
            await editKnowledgePo.selectRegionDropDownOption(regionFieldVal2);
            await editKnowledgePo.selectSiteDropDownOption(siteFieldVal1);
            await editKnowledgePo.saveKnowledgeMedataDataChanges();
            await navigationPage.signOut();
        });

        it('[DRDMV-19565,DRDMV-19567,DRDMV-19568]:Verify the Save functionality of Region and Site fields on Knowledge Articles Create / Edit screen', async () => {
            //Create Knowledge article by Case Agent
            await loginPage.login(caseAgentUser);
            await navigationPage.gotoKnowledgeConsole();
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate(knowledgeData.TemplateName);
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeData.KnowledgeTitle);
            await createKnowledgePage.selectRegionDropDownOption(regionFieldVal);
            await createKnowledgePage.selectKnowledgeSet(knowledgeData.KnowledgeSet);
            await createKnowledgePage.clickAssignToMeButton();
            await createKnowledgePage.selectSiteDropDownOption(siteFieldVal);
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await previewKnowledgePo.clickGoToArticleButton();
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            expect(await editKnowledgePo.getSelectedFieldValue(regionField)).toBe(regionFieldVal);
            expect(await editKnowledgePo.getSelectedFieldValue(siteField)).toBe(siteFieldVal);
            await editKnowledgePo.selectRegionDropDownOption(regionFieldVal2);
            await editKnowledgePo.selectSiteDropDownOption(siteFieldVal1);
            await editKnowledgePo.saveKnowledgeMedataDataChanges();
            await navigationPage.signOut();

            //Login with Knowledge Candidate
            await loginPage.login(knowledgeCandidateUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate(knowledgeData.TemplateName);
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeData.KnowledgeTitle);
            await createKnowledgePage.selectRegionDropDownOption(regionFieldVal);
            await createKnowledgePage.selectKnowledgeSet(knowledgeData.KnowledgeSet);
            await createKnowledgePage.clickAssignToMeButton();
            await createKnowledgePage.selectSiteDropDownOption(siteFieldVal);
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await previewKnowledgePo.clickGoToArticleButton();
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            expect(await editKnowledgePo.getSelectedFieldValue(regionField)).toBe(regionFieldVal);
            expect(await editKnowledgePo.getSelectedFieldValue(siteField)).toBe(siteFieldVal);
            await editKnowledgePo.selectRegionDropDownOption(regionFieldVal2);
            await editKnowledgePo.selectSiteDropDownOption(siteFieldVal1);
            await editKnowledgePo.saveKnowledgeMedataDataChanges();
            await navigationPage.signOut();
        });

        it('[DRDMV-19565,DRDMV-19567,DRDMV-19568]:Verify the Save functionality of Region and Site fields on Knowledge Articles Create / Edit screen', async () => {
            //Login with Knowledge Contributor
            await loginPage.login(knowledgeContributorUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate(knowledgeData.TemplateName);
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeData.KnowledgeTitle);
            await createKnowledgePage.selectRegionDropDownOption(regionFieldVal);
            await createKnowledgePage.selectKnowledgeSet(knowledgeData.KnowledgeSet);
            await createKnowledgePage.clickAssignToMeButton();
            await createKnowledgePage.selectSiteDropDownOption(siteFieldVal);
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await previewKnowledgePo.clickGoToArticleButton();
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            expect(await editKnowledgePo.getSelectedFieldValue(regionField)).toBe(regionFieldVal);
            expect(await editKnowledgePo.getSelectedFieldValue(siteField)).toBe(siteFieldVal);
            await editKnowledgePo.selectRegionDropDownOption(regionFieldVal2);
            await editKnowledgePo.selectSiteDropDownOption(siteFieldVal1);
            await editKnowledgePo.saveKnowledgeMedataDataChanges();
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();

            //Login with Knowledge Publisher
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate(knowledgeData.TemplateName);
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeData.KnowledgeTitle);
            await createKnowledgePage.selectRegionDropDownOption(regionFieldVal);
            await createKnowledgePage.selectKnowledgeSet(knowledgeData.KnowledgeSet);
            await createKnowledgePage.clickAssignToMeButton();
            await createKnowledgePage.selectSiteDropDownOption(siteFieldVal);
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await previewKnowledgePo.clickGoToArticleButton();
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            expect(await editKnowledgePo.getSelectedFieldValue(regionField)).toBe(regionFieldVal);
            expect(await editKnowledgePo.getSelectedFieldValue(siteField)).toBe(siteFieldVal);
            await editKnowledgePo.selectRegionDropDownOption(regionFieldVal2);
            await editKnowledgePo.selectSiteDropDownOption(siteFieldVal1);
            await editKnowledgePo.saveKnowledgeMedataDataChanges();
            await navigationPage.signOut();
        });

        it('[DRDMV-19565,DRDMV-19567,DRDMV-19568]:Verify the Save functionality of Region and Site fields on Knowledge Articles Create / Edit screen', async () => {
            //Login with Knowledge Coach
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate(knowledgeData.TemplateName);
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeData.KnowledgeTitle);
            await createKnowledgePage.selectRegionDropDownOption(regionFieldVal);
            await createKnowledgePage.selectKnowledgeSet(knowledgeData.KnowledgeSet);
            await createKnowledgePage.clickAssignToMeButton();
            await createKnowledgePage.selectSiteDropDownOption(siteFieldVal);
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await previewKnowledgePo.clickGoToArticleButton();
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            expect(await editKnowledgePo.getSelectedFieldValue(regionField)).toBe(regionFieldVal);
            expect(await editKnowledgePo.getSelectedFieldValue(siteField)).toBe(siteFieldVal);
            await editKnowledgePo.selectRegionDropDownOption(regionFieldVal2);
            await editKnowledgePo.selectSiteDropDownOption(siteFieldVal1);
            await editKnowledgePo.saveKnowledgeMedataDataChanges();
        });

        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        });
    });

    describe('[DRDMV-19574]:Verify the Save functionality of Region and Site fields on Document Library Create / Edit screen', () => {
        let caseAgentuserData = {
            "firstName": "caseAgent",
            "lastName": "user",
            "userId": "caseAgent",
            "userPermission": ["Case Agent","Foundation Read","Document Manager"]
        }
        let caseManageruserData = {
            "firstName": "caseManager",
            "lastName": "user",
            "userId": "caseManager",
            "userPermission": ["Case Manager","Foundation Read","Document Manager"]
        }
        let title = `Document-${new Date().valueOf()}`;

        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.createNewUser(caseAgentuserData);
            await apiHelper.associatePersonToCompany(caseAgentuserData.userId, "Petramco");

            await apiHelper.createNewUser(caseManageruserData);
            await apiHelper.associatePersonToCompany(caseManageruserData.userId, "Petramco");
        });

        it('[DRDMV-19574]:Verify the Save functionality of Region and Site fields on Document Library Create / Edit screen', async () => {
            //Create a document library
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Document Management--Library', 'Document Library Console - Business Workflows'))
                .toEqual('Document Library Console - Business Workflows');
            await createDocumentLibraryPage.openAddNewDocumentBlade();
            await createDocumentLibraryPage.addAttachment(filePath);
            await createDocumentLibraryPage.setTitle(title);
            await createDocumentLibraryPage.selectCompany(companyStr);
            await createDocumentLibraryPage.selectBusinessUnit(hrSupportStr);
            await createDocumentLibraryPage.selectOwnerGroup(ownerSupportGroup);
            await createDocumentLibraryPage.selectRegion(regionFieldVal);
            await createDocumentLibraryPage.selectSite(siteFieldVal);
            await createDocumentLibraryPage.saveNewDocument();
            await utilGrid.searchAndOpenHyperlink(title);
            expect(await editDocumentLibraryPo.getRegionSelectedValue(regionField)).toBe(regionFieldVal);
            expect(await editDocumentLibraryPo.getSiteSelectedValue(siteField)).toBe(siteFieldVal);
            await editDocumentLibraryPo.setRegion(regionFieldVal2);
            await editDocumentLibraryPo.setSite(siteFieldVal1);
            await editDocumentLibraryPo.selectStatus(documentLibraryStatus);
            await editDocumentLibraryPo.clickOnSaveButton();
            await navigationPage.signOut();
        });

        it('[DRDMV-19574]:Verify the Save functionality of Region and Site fields on Document Library Create / Edit screen', async () => {
            //Login with Case Manager
            await loginPage.login(caseManageruserData.userId + '@petramco.com', 'Password_1234');
            //Create a document library
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Document Management--Library', 'Document Library Console - Business Workflows'))
                .toEqual('Document Library Console - Business Workflows');
            await createDocumentLibraryPage.openAddNewDocumentBlade();
            await createDocumentLibraryPage.addAttachment(filePath);
            await createDocumentLibraryPage.setTitle(title);
            await createDocumentLibraryPage.selectCompany(companyStr);
            await createDocumentLibraryPage.selectBusinessUnit(hrSupportStr);
            await createDocumentLibraryPage.selectOwnerGroup(ownerSupportGroup);
            await createDocumentLibraryPage.selectRegion(regionFieldVal);
            await createDocumentLibraryPage.selectSite(siteFieldVal);
            await createDocumentLibraryPage.saveNewDocument();
            await utilGrid.searchAndOpenHyperlink(title);
            expect(await editDocumentLibraryPo.getRegionSelectedValue(regionField)).toBe(regionFieldVal);
            expect(await editDocumentLibraryPo.getSiteSelectedValue(siteField)).toBe(siteFieldVal);
            await editDocumentLibraryPo.setRegion(regionFieldVal2);
            await editDocumentLibraryPo.setSite(siteFieldVal1);
            await editDocumentLibraryPo.selectStatus(documentLibraryStatus);
            await editDocumentLibraryPo.clickOnSaveButton();
            await navigationPage.signOut();
        });

        it('[DRDMV-19574]:Verify the Save functionality of Region and Site fields on Document Library Create / Edit screen', async () => {
            //Login with Case Agent
            await loginPage.login(caseAgentuserData.userId + '@petramco.com', 'Password_1234');
            //Create a document library
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Document Management--Library', 'Document Library Console - Business Workflows'))
                .toEqual('Document Library Console - Business Workflows');
            await createDocumentLibraryPage.openAddNewDocumentBlade();
            await createDocumentLibraryPage.addAttachment(filePath);
            title = `Document-${new Date().valueOf()}`;
            await createDocumentLibraryPage.setTitle(title);
            await createDocumentLibraryPage.selectCompany(companyStr);
            await createDocumentLibraryPage.selectBusinessUnit(hrSupportStr);
            await createDocumentLibraryPage.selectOwnerGroup(ownerSupportGroup);
            await createDocumentLibraryPage.selectRegion(regionFieldVal);
            await createDocumentLibraryPage.selectSite(siteFieldVal);
            await createDocumentLibraryPage.saveNewDocument();
            await utilGrid.searchAndOpenHyperlink(title);
            expect(await editDocumentLibraryPo.getRegionSelectedValue(regionField)).toBe(regionFieldVal);
            expect(await editDocumentLibraryPo.getSiteSelectedValue(siteField)).toBe(siteFieldVal);
            await editDocumentLibraryPo.setRegion(regionFieldVal2);
            await editDocumentLibraryPo.setSite(siteFieldVal1);
            await editDocumentLibraryPo.selectStatus(documentLibraryStatus);
            await editDocumentLibraryPo.clickOnSaveButton();;
            await navigationPage.signOut();
        });

        afterAll(async () => {
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await utilityCommon.refresh();
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        });
    });

    describe('[DRDMV-19575]:Verify the search functionality of Document library console for Region', () => {
        let regionFields: string[] = ["Region"];
        let emptyStr = undefined;
        let caseAgentuserData = {
            "firstName": "caseAgent",
            "lastName": "user",
            "userId": "caseAgent",
            "userPermission": ["Case Agent", "Foundation Read", "Document Manager"]
        }
        let caseManageruserData = {
            "firstName": "caseManager",
            "lastName": "user",
            "userId": "caseManager",
            "userPermission": ["Case Manager", "Foundation Read", "Document Manager"]
        }

        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.createNewUser(caseAgentuserData);
            await apiHelper.associatePersonToCompany(caseAgentuserData.userId, "Petramco");
            await apiHelper.associatePersonToSupportGroup(caseAgentuserData.userId, ownerSupportGroup);
            await apiHelper.createNewUser(caseManageruserData);
            await apiHelper.associatePersonToCompany(caseManageruserData.userId, "Petramco");
            await apiHelper.associatePersonToSupportGroup(caseManageruserData.userId, ownerSupportGroup);
        });

        it('[DRDMV-19575]:Verify the search functionality of Document library console for Region', async () => {
            //*Create a document library
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Document Management--Library', 'Document Library Console - Business Workflows'))
                .toEqual('Document Library Console - Business Workflows');
            await createDocumentLibraryPage.openAddNewDocumentBlade();
            await createDocumentLibraryPage.addAttachment(filePath);
            let title = `Document-${new Date().valueOf()}`;
            await createDocumentLibraryPage.setTitle(title);
            await createDocumentLibraryPage.selectCompany(companyStr);
            await createDocumentLibraryPage.selectBusinessUnit('HR Support');
            await createDocumentLibraryPage.selectOwnerGroup(ownerSupportGroup);
            await createDocumentLibraryPage.selectRegion(regionFieldVal);
            await createDocumentLibraryPage.selectSite(siteFieldVal);
            await createDocumentLibraryPage.saveNewDocument();

            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Document Management--Library', 'Document Library Console - Business Workflows'))
                .toEqual('Document Library Console - Business Workflows');
            await documentLibraryPage.addColumnOnGrid(regionFields);
            await utilGrid.searchOnGridConsole(regionFieldVal);
            expect(await documentLibraryPage.getSelectedGridRecordValue(regionField)).toEqual(regionFieldVal);
            await documentLibraryPage.removeColumnOnGrid(regionFields);
            await utilGrid.searchOnGridConsole(regionFieldVal);
            expect(await documentLibraryPage.getSelectedGridRecordValue(regionField)).toEqual(emptyStr);
            await navigationPage.signOut();
        });

        it('[DRDMV-19575]:Verify the search functionality of Document library console for Region', async () => {
            //Login with Case Manager
            await loginPage.login(caseManageruserData.userId + '@petramco.com', 'Password_1234');
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Document Management--Library', 'Document Library Console - Business Workflows'))
                .toEqual('Document Library Console - Business Workflows');
            await documentLibraryPage.addColumnOnGrid(regionFields);
            await utilGrid.searchOnGridConsole(regionFieldVal);
            expect(await documentLibraryPage.getSelectedGridRecordValue(regionField)).toEqual(regionFieldVal);

            await documentLibraryPage.removeColumnOnGrid(regionFields);
            expect(await utilGrid.isGridRecordPresent(regionFieldVal)).toBeFalsy('Record is present')
            await navigationPage.signOut();

            //Login with Case Agent
            await loginPage.login(caseAgentuserData.userId + '@petramco.com', 'Password_1234');
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Document Management--Library', 'Document Library Console - Business Workflows'))
                .toEqual('Document Library Console - Business Workflows');
            await documentLibraryPage.addColumnOnGrid(regionFields);
            await utilGrid.searchOnGridConsole(regionFieldVal);
            expect(await documentLibraryPage.getSelectedGridRecordValue(regionField)).toEqual(regionFieldVal);

            await documentLibraryPage.removeColumnOnGrid(regionFields);
            expect(await utilGrid.isGridRecordPresent(regionFieldVal)).toBeFalsy('Record is present')
        });

        afterAll(async () => {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        });
    });

    describe('[DRDMV-19573]:Verify the document search based on Region and Site from attachments', () => {
        let caseSummary = `Case for Document Search-${new Date().valueOf()}`;
        let title = `Document-${new Date().valueOf()}`;

        beforeAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
        })

        it('[DRDMV-19573]:Verify the document search based on Region and Site from attachments', async () => {
            //Create a document library
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Document Management--Library', 'Document Library Console - Business Workflows'))
                .toEqual('Document Library Console - Business Workflows');
            await createDocumentLibraryPage.openAddNewDocumentBlade();
            await createDocumentLibraryPage.addAttachment(filePath);
            await createDocumentLibraryPage.setTitle(title);
            await createDocumentLibraryPage.selectCompany(companyStr);
            await createDocumentLibraryPage.selectBusinessUnit('Facilities Support');
            await createDocumentLibraryPage.selectOwnerGroup('Facilities');
            await createDocumentLibraryPage.selectRegion(regionFieldVal);
            await createDocumentLibraryPage.selectSite(siteFieldVal);
            await createDocumentLibraryPage.saveNewDocument();
            await utilGrid.searchAndOpenHyperlink(title);
            expect(await editDocumentLibraryPo.getRegionSelectedValue(regionField)).toBe(regionFieldVal);
            expect(await editDocumentLibraryPo.getSiteSelectedValue(siteField)).toBe(siteFieldVal);
            await createDocumentLibraryPage.selectStatus(documentLibraryStatus);
            await createDocumentLibraryPage.saveUpdatedDocument();
            await browser.sleep(30000); // To Wait For Document Library Record Updates And Display Console Page.
        });

        it('[DRDMV-19573]:Verify the document search based on Region and Site from attachments', async () => {
            //Navigate to Create case
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary(caseSummary);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            let caseId: string = await viewCasePage.getCaseID();
            await activityTabPo.clickActivityNoteTextBox();
            await activityTabPo.clickOnAttachLink();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(title);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            expect(await resources.isAdvancedSearchResultContainsRecord(title)).toBeTruthy();

            await resources.enterAdvancedSearchText(title);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            expect(await resources.isAdvancedSearchResultContainsRecord(title)).toBeTruthy();
            await utilityCommon.closeAllBlades();

            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            await viewCasePage.clickOnEmailLink();
            await composeMailPo.clickOnAttachmentLink();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(title);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            expect(await resources.isAdvancedSearchResultContainsRecord(title)).toBeTruthy();
            await resources.enterAdvancedSearchText(title);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            expect(await resources.isAdvancedSearchResultContainsRecord(title)).toBeTruthy();
            await utilityCommon.closeAllBlades();
            await composeMailPo.clickOnDiscardButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            await navigationPage.signOut();
        });

        it('[DRDMV-19573]:Verify the document search based on Region and Site from attachments', async () => {
            //Navigate to Create case
            await loginPage.login('frieda');
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary(caseSummary);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            let caseId: string = await viewCasePage.getCaseID();
            await activityTabPo.clickActivityNoteTextBox();
            await activityTabPo.clickOnAttachLink();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(title);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            expect(await resources.isAdvancedSearchResultContainsRecord(title)).toBeTruthy();
            await resources.enterAdvancedSearchText(title);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(title)).toEqual(title);
            await utilityCommon.closeAllBlades();

            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            await viewCasePage.clickOnEmailLink();
            await composeMailPo.clickOnAttachmentLink();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(title);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(title)).toEqual(title);
            await resources.enterAdvancedSearchText(title);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            expect(await resources.isAdvancedSearchResultContainsRecord(title)).toBeTruthy();
            await utilityCommon.closeAllBlades();
            await composeMailPo.clickOnDiscardButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            await navigationPage.signOut();
        });

        it('[DRDMV-19573]:Verify the document search based on Region and Site from attachments', async () => {
            //Navigate to Create case
            await loginPage.login('fabian');
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary(caseSummary);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            let caseId: string = await viewCasePage.getCaseID();
            await activityTabPo.clickActivityNoteTextBox();
            await activityTabPo.clickOnAttachLink();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(title);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            expect(await resources.isAdvancedSearchResultContainsRecord(title)).toBeTruthy();
            await resources.enterAdvancedSearchText(title);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            expect(await resources.isAdvancedSearchResultContainsRecord(title)).toBeTruthy();
            await utilityCommon.closeAllBlades();

            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            await viewCasePage.clickOnEmailLink();
            await composeMailPo.clickOnAttachmentLink();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(title);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            expect(await resources.isAdvancedSearchResultContainsRecord(title)).toBeTruthy();
            await resources.enterAdvancedSearchText(title);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            expect(await resources.isAdvancedSearchResultContainsRecord(title)).toBeTruthy();
        });

        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await composeMailPo.clickOnDiscardButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        });
    });

    describe('[DRDMV-19572]:Verify the knowledge articles search based on Region and Site on Quick case / Create case', () => {
        it('[DRDMV-19572]:Verify the knowledge articles search based on Region and Site on Quick case / Create case', async () => {
            await navigationPage.gotoQuickCase();
            await quickCase.selectRequesterName(caseAgentUser);
            await quickCase.setCaseSummary(articleInDraftStatus);
            //Search with knowledge article with draft status
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Draft");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInDraftStatus)).toEqual(articleInDraftStatus);
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Draft");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInDraftStatus)).toEqual(articleInDraftStatus);

            //Search with knowledge article with SMEReview status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "SME Review");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInSMEReviewStatus)).toEqual(articleInSMEReviewStatus);
            await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "SME Review");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInSMEReviewStatus)).toEqual(articleInSMEReviewStatus);

            //Search with knowledge article with Published status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInPublishedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Published");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInPublishedStatus)).toEqual(articleInPublishedStatus);
            await resources.enterAdvancedSearchText(articleInPublishedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Published");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInPublishedStatus)).toEqual(articleInPublishedStatus);
        });
        it('[DRDMV-19572]:Verify the knowledge articles search based on Region and Site on Quick case / Create case', async () => {
            //Search with knowledge article with Retired status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInRetiredStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Retired");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInRetiredStatus)).toEqual(articleInRetiredStatus);
            await resources.enterAdvancedSearchText(articleInRetiredStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Retired");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInRetiredStatus)).toEqual(articleInRetiredStatus);

            //Search with knowledge article with Closed status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInClosedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Closed");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInClosedStatus)).toEqual(articleInClosedStatus);
            await resources.enterAdvancedSearchText(articleInClosedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Closed");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInClosedStatus)).toEqual(articleInClosedStatus);

            //Search with knowledge article with Canceled status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInCanceledStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Canceled");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInCanceledStatus)).toEqual(articleInCanceledStatus);
            await resources.enterAdvancedSearchText(articleInCanceledStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Canceled");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInCanceledStatus)).toEqual(articleInCanceledStatus);
        });
        it('[DRDMV-19572]:Verify the knowledge articles search based on Region and Site on Quick case / Create case', async () => {
            //Navigate to Create case
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary(articleInDraftStatus);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePage.clickOnTab('Resources');

            //Search with knowledge article with draft status
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Draft");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInDraftStatus)).toEqual(articleInDraftStatus);
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Draft");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInDraftStatus)).toEqual(articleInDraftStatus);

            // Search with knowledge article with SMEReview status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "SME Review");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInSMEReviewStatus)).toEqual(articleInSMEReviewStatus);
            await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "SME Review");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInSMEReviewStatus)).toEqual(articleInSMEReviewStatus);

            //Search with knowledge article with Published status
            await resources.enterAdvancedSearchText(articleInPublishedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Published");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInPublishedStatus)).toEqual(articleInPublishedStatus);
            await resources.enterAdvancedSearchText(articleInPublishedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Published");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInPublishedStatus)).toEqual(articleInPublishedStatus);
        });
        it('[DRDMV-19572]:Verify the knowledge articles search based on Region and Site on Quick case / Create case', async () => {
            //Search with knowledge article with Retired status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInRetiredStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Retired");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInRetiredStatus)).toEqual(articleInRetiredStatus);
            await resources.enterAdvancedSearchText(articleInRetiredStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Retired");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInRetiredStatus)).toEqual(articleInRetiredStatus);

            //Search with knowledge article with Closed status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInClosedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Closed");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInClosedStatus)).toEqual(articleInClosedStatus);
            await resources.enterAdvancedSearchText(articleInClosedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Closed");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInClosedStatus)).toEqual(articleInClosedStatus);

            //Search with knowledge article with Canceled status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInCanceledStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Canceled");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInCanceledStatus)).toEqual(articleInCanceledStatus);
            await resources.enterAdvancedSearchText(articleInCanceledStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Canceled");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInCanceledStatus)).toEqual(articleInCanceledStatus);
        });
        it('[DRDMV-19572]:Verify the knowledge articles search based on Region and Site on Quick case / Create case', async () => {
            //Login with Case Manager
            await navigationPage.signOut();
            await loginPage.login(caseManagerUser);
            await navigationPage.gotoQuickCase();
            await quickCase.selectRequesterName(caseAgentUser);
            await quickCase.setCaseSummary(articleInDraftStatus);
            //Search with knowledge article with draft status
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Draft");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInDraftStatus)).toEqual(articleInDraftStatus);
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Draft");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInDraftStatus)).toEqual(articleInDraftStatus);
        });
        it('[DRDMV-19572]:Verify the knowledge articles search based on Region and Site on Quick case / Create case', async () => {
            // Search with knowledge article with SMEReview status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "SME Review");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInSMEReviewStatus)).toEqual(articleInSMEReviewStatus);
            await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "SME Review");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInSMEReviewStatus)).toEqual(articleInSMEReviewStatus);

            //Search with knowledge article with Published status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInPublishedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Published");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInPublishedStatus)).toEqual(articleInPublishedStatus);
            await resources.enterAdvancedSearchText(articleInPublishedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Published");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInPublishedStatus)).toEqual(articleInPublishedStatus);
        });
        it('[DRDMV-19572]:Verify the knowledge articles search based on Region and Site on Quick case / Create case', async () => {
            //Search with knowledge article with Retired status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInRetiredStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Retired");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInRetiredStatus)).toEqual(articleInRetiredStatus);
            await resources.enterAdvancedSearchText(articleInRetiredStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Retired");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInRetiredStatus)).toEqual(articleInRetiredStatus);

            //Search with knowledge article with Closed status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInClosedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Closed");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInClosedStatus)).toEqual(articleInClosedStatus);
            await resources.enterAdvancedSearchText(articleInClosedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Closed");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInClosedStatus)).toEqual(articleInClosedStatus);

            //Search with knowledge article with Canceled status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInCanceledStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Canceled");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInCanceledStatus)).toEqual(articleInCanceledStatus);
            await resources.enterAdvancedSearchText(articleInCanceledStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Canceled");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInCanceledStatus)).toEqual(articleInCanceledStatus);
        });
        it('[DRDMV-19572]:Verify the knowledge articles search based on Region and Site on Quick case / Create case', async () => {
            //Navigate to Create case
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary(articleInDraftStatus);
            await createCasePage.clickChangeAssignmentButton();
            await changeAssignmentBladePo.setAssignee('Petramco', 'Canada Support', 'CA Support 1', 'Qiang Du');
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePage.clickOnTab('Resources');

            //Search with knowledge article with draft status
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Draft");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInDraftStatus)).toEqual(articleInDraftStatus);
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Draft");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInDraftStatus)).toEqual(articleInDraftStatus);

            // Search with knowledge article with SMEReview status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "SME Review");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInSMEReviewStatus)).toEqual(articleInSMEReviewStatus);
            await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "SME Review");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInSMEReviewStatus)).toEqual(articleInSMEReviewStatus);

            //Search with knowledge article with Published status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInPublishedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Published");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInPublishedStatus)).toEqual(articleInPublishedStatus);
            await resources.enterAdvancedSearchText(articleInPublishedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Published");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInPublishedStatus)).toEqual(articleInPublishedStatus);
        });
        it('[DRDMV-19572]:Verify the knowledge articles search based on Region and Site on Quick case / Create case', async () => {
            //Search with knowledge article with Retired status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInRetiredStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Retired");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInRetiredStatus)).toEqual(articleInRetiredStatus);
            await resources.enterAdvancedSearchText(articleInRetiredStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Retired");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInRetiredStatus)).toEqual(articleInRetiredStatus);

            //Search with knowledge article with Closed status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInClosedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Closed");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInClosedStatus)).toEqual(articleInClosedStatus);
            await resources.enterAdvancedSearchText(articleInClosedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Closed");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInClosedStatus)).toEqual(articleInClosedStatus);

            //Search with knowledge article with Canceled status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInCanceledStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Canceled");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInCanceledStatus)).toEqual(articleInCanceledStatus);
            await resources.enterAdvancedSearchText(articleInCanceledStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Canceled");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInCanceledStatus)).toEqual(articleInCanceledStatus);
        });
        it('[DRDMV-19572]:Verify the knowledge articles search based on Region and Site on Quick case / Create case', async () => {
            //Login as Case Agent
            await navigationPage.signOut();
            await loginPage.login(caseAgentUser);
            await navigationPage.gotoQuickCase();
            await quickCase.selectRequesterName(caseManagerUser);
            await quickCase.setCaseSummary(articleInDraftStatus);
            //Search with knowledge article with draft status
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Draft");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInDraftStatus)).toEqual(articleInDraftStatus);
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Draft");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInDraftStatus)).toEqual(articleInDraftStatus);
        });
        it('[DRDMV-19572]:Verify the knowledge articles search based on Region and Site on Quick case / Create case', async () => {
            // Search with knowledge article with SMEReview status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "SME Review");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInSMEReviewStatus)).toEqual(articleInSMEReviewStatus);
            await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "SME Review");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInSMEReviewStatus)).toEqual(articleInSMEReviewStatus);

            //Search with knowledge article with Published status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInPublishedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Published");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInPublishedStatus)).toEqual(articleInPublishedStatus);
            await resources.enterAdvancedSearchText(articleInPublishedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Published");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInPublishedStatus)).toEqual(articleInPublishedStatus);
        });
        it('[DRDMV-19572]:Verify the knowledge articles search based on Region and Site on Quick case / Create case', async () => {
            //Search with knowledge article with Retired status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInRetiredStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Retired");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInRetiredStatus)).toEqual(articleInRetiredStatus);
            await resources.enterAdvancedSearchText(articleInRetiredStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Retired");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInRetiredStatus)).toEqual(articleInRetiredStatus);

            //Search with knowledge article with Closed status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInClosedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Closed");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInClosedStatus)).toEqual(articleInClosedStatus);
            await resources.enterAdvancedSearchText(articleInClosedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Closed");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInClosedStatus)).toEqual(articleInClosedStatus);

            //Search with knowledge article with Canceled status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInCanceledStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Canceled");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInCanceledStatus)).toEqual(articleInCanceledStatus);
            await resources.enterAdvancedSearchText(articleInCanceledStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Canceled");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInCanceledStatus)).toEqual(articleInCanceledStatus);
        });
        it('[DRDMV-19572]:Verify the knowledge articles search based on Region and Site on Quick case / Create case', async () => {
            //Navigate to Create case
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary(articleInDraftStatus);
            await createCasePage.clickChangeAssignmentButton();
            await changeAssignmentBladePo.setAssignee('Petramco', 'Canada Support', 'CA Support 1', 'Qiang Du');
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePage.clickOnTab('Resources');

            //Search with knowledge article with draft status
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Draft");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInDraftStatus)).toEqual(articleInDraftStatus);
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Draft");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInDraftStatus)).toEqual(articleInDraftStatus);

            // Search with knowledge article with SMEReview status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "SME Review");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInSMEReviewStatus)).toEqual(articleInSMEReviewStatus);
            await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "SME Review");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInSMEReviewStatus)).toEqual(articleInSMEReviewStatus);

            //Search with knowledge article with Published status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInPublishedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Published");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInPublishedStatus)).toEqual(articleInPublishedStatus);
            await resources.enterAdvancedSearchText(articleInPublishedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Published");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInPublishedStatus)).toEqual(articleInPublishedStatus);
        });
        it('[DRDMV-19572]:Verify the knowledge articles search based on Region and Site on Quick case / Create case', async () => {
            //Search with knowledge article with Retired status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInRetiredStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Retired");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInRetiredStatus)).toEqual(articleInRetiredStatus);
            await resources.enterAdvancedSearchText(articleInRetiredStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Retired");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInRetiredStatus)).toEqual(articleInRetiredStatus);

            //Search with knowledge article with Closed status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInClosedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Closed");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInClosedStatus)).toEqual(articleInClosedStatus);
            await resources.enterAdvancedSearchText(articleInClosedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Closed");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInClosedStatus)).toEqual(articleInClosedStatus);

            //Search with knowledge article with Canceled status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInCanceledStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Canceled");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInCanceledStatus)).toEqual(articleInCanceledStatus);
            await resources.enterAdvancedSearchText(articleInCanceledStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.selectAdvancedSearchFilterOption("Status", "Canceled");
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInCanceledStatus)).toEqual(articleInCanceledStatus);
        });
        afterAll(async () => {
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        });
    });

});
