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
import { BWF_BASE_URL, BWF_PAGE_TITLES, DropDownType } from '../../utils/constants';
import utilityGrid from "../../utils/utility.grid";
import utilityCommon from '../../utils/utility.common';
import changeAssignmentBladePo from '../../pageobject/common/change-assignment.po';


let caseBAUser = 'qkatawazi';
let caseAgentUser = 'qtao';
let caseManagerUser = 'qdu';
let knowledgeCandidateUser = 'kayo';
let knowledgeContributorUser = 'kkohri';
let knowledgePublisherUser = 'kmills';
let knowledgeCoachUser = 'kWilliamson';
let emptyStr = "";
let articleInDraftStatus = '3834 KnowledgeArticle_Draft';
let articleInSMEReviewStatus = '3834 KnowledgeArticle_SME Review';
let articleInPublishedStatus = '3834 KnowledgeArticle_PublishApproval';
let articleInRetiredStatus = '3834 KnowledgeArticle_RetireApproval';
let articleInClosedStatus = '3834 KnowledgeArticle_Closed';
let articleInCanceledStatus = '3834 KnowledgeArticle_CancelApproval';
let regionField = "Region";
let siteField = "Site";
let siteGrpField = "Site Group";

let regionFieldVal = "Asia-Pac"; //In place of australia
let siteGroupVal = "Engineering";
let siteFieldVal = "Canberra";

let regionFieldVal2 = "Americas"; // In Place of Central America
let siteGroupVal2 = "Marketing";
let siteFieldVal2 = "Mexico City"; 

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
let title = "3834 KnowledgeArticle";

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
            "region": "Asia-Pac", //in place of australia
            "siteGroup": "Engineering",
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

    describe('[3837,3836,3835]:Verify the search functionality of knowledge articles console for Region', () => {
        let regionFieldColumn: string[] = ["Region"];
        let knowledgeGridColumnFields: string[] = ["Article ID", "Title", "Knowledge Set", "Status", "Assignee", "Company", "Template Name", "Reviewer", "Modified By", "Created Date", "Modified Date", "Flagged", "Region"];
        let knowledgeGridColumnFieldsWithoutRegion: string[] = ["Article ID", "Title", "Knowledge Set", "Status", "Assignee", "Company", "Template Name", "Reviewer", "Modified By", "Created Date", "Modified Date", "Flagged"];
        let regionVal: string = undefined;

        it('[3837,3836,3835]:Verify the search functionality of knowledge articles console for Region', async () => {
            await navigationPage.gotoKnowledgeConsole();
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

        it('[3837,3836,3835]:Verify the search functionality of knowledge articles console for Region', async () => {
            await loginPage.login(caseAgentUser);
            await navigationPage.gotoKnowledgeConsole();
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
            await knowledgeConsole.addColumnOnGrid(regionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFields)).toBe(true);
            await utilityGrid.searchRecord(regionFieldVal);
            expect(await utilityGrid.isEntireColumnContainsSameValue(regionField, regionFieldVal)).toBeTruthy('Search results does not match');
            await knowledgeConsole.removeColumnOnGrid(regionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFieldsWithoutRegion)).toBe(true);
            await utilityGrid.searchRecord(regionFieldVal);
            regionVal = await knowledgeConsole.getSelectedGridRecordValue(regionField);
            expect(regionVal).toEqual(emptyStr);
        });

        it('[3837,3836,3835]:Verify the search functionality of knowledge articles console for Region', async () => {
            await navigationPage.signOut();
            await loginPage.login(knowledgeContributorUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
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

        it('[3837,3836,3835]:Verify the search functionality of knowledge articles console for Region', async () => {
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
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

    describe('[3840,3839,3838]:Verify the Save functionality of Region and Site fields on Knowledge Articles Create / Edit screen', () => {
        let knowledgeDataFile = require("../../data/ui/knowledge/knowledgeArticle.ui.json");
        let knowledgeData = knowledgeDataFile['3905'];

        it('[3840,3839,3838]:Verify the Save functionality of Region and Site fields on Knowledge Articles Create / Edit screen', async () => {
            //* Check the Availability of Region with Case Business Analyst
            await navigationPage.gotoKnowledgeConsole();
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate(knowledgeData.TemplateName);
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeData.KnowledgeTitle);
            await createKnowledgePage.selectKnowledgeSet(knowledgeData.KnowledgeSet);
            await createKnowledgePage.selectRegionDropDownOption(regionFieldVal);
            await createKnowledgePage.clickAssignToMeButton();
            await createKnowledgePage.selectSiteGroupDropDownOption(siteGroupVal)
            await createKnowledgePage.selectSiteDropDownOption(siteFieldVal);
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await utilityCommon.closePopUpMessage();
            await previewKnowledgePo.clickGoToArticleButton();
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            expect(await editKnowledgePo.getSelectedFieldValue(regionField)).toBe(regionFieldVal);
            expect(await editKnowledgePo.getSelectedFieldValue(siteField)).toBe(siteFieldVal);
            expect(await editKnowledgePo.getSelectedFieldValue(siteGrpField)).toBe(siteGroupVal);
            await editKnowledgePo.selectRegionDropDownOption(regionFieldVal2);
            await editKnowledgePo.selectSiteGroupDropDownOption(siteGroupVal2)
            await editKnowledgePo.selectSiteDropDownOption(siteFieldVal2);
            await editKnowledgePo.saveKnowledgeMedataDataChanges();
            await utilityCommon.closePopUpMessage();
            await navigationPage.signOut();

            //Create Knowledge article by Case Manager
            await loginPage.login('qdu');
            await navigationPage.gotoKnowledgeConsole();
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate(knowledgeData.TemplateName);
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeData.KnowledgeTitle);
            await createKnowledgePage.selectKnowledgeSet(knowledgeData.KnowledgeSet);
            await createKnowledgePage.selectRegionDropDownOption(regionFieldVal);
            await createKnowledgePage.clickAssignToMeButton();
            await createKnowledgePage.selectSiteGroupDropDownOption(siteGroupVal);
            await createKnowledgePage.selectSiteDropDownOption(siteFieldVal);
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await utilityCommon.closePopUpMessage();
            await previewKnowledgePo.clickGoToArticleButton();
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            expect(await editKnowledgePo.getSelectedFieldValue(regionField)).toBe(regionFieldVal);
            expect(await editKnowledgePo.getSelectedFieldValue(siteGrpField)).toBe(siteGroupVal);
            expect(await editKnowledgePo.getSelectedFieldValue(siteField)).toBe(siteFieldVal);
            await editKnowledgePo.selectRegionDropDownOption(regionFieldVal2);
            await editKnowledgePo.selectSiteGroupDropDownOption(siteGroupVal2);
            await editKnowledgePo.selectSiteDropDownOption(siteFieldVal2);
            await editKnowledgePo.saveKnowledgeMedataDataChanges();
            await utilityCommon.closePopUpMessage();
            await navigationPage.signOut();
        });

        it('[3840,3839,3838]:Verify the Save functionality of Region and Site fields on Knowledge Articles Create / Edit screen', async () => {
            //Create Knowledge article by Case Agent
            await loginPage.login(caseAgentUser);
            await navigationPage.gotoKnowledgeConsole();
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate(knowledgeData.TemplateName);
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeData.KnowledgeTitle);
            await createKnowledgePage.selectKnowledgeSet(knowledgeData.KnowledgeSet);
            await createKnowledgePage.selectRegionDropDownOption(regionFieldVal);
            await createKnowledgePage.clickAssignToMeButton();
            await createKnowledgePage.selectSiteGroupDropDownOption(siteGroupVal);
            await createKnowledgePage.selectSiteDropDownOption(siteFieldVal);
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await previewKnowledgePo.clickGoToArticleButton();
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            expect(await editKnowledgePo.getSelectedFieldValue(regionField)).toBe(regionFieldVal);
            expect(await editKnowledgePo.getSelectedFieldValue(siteGrpField)).toBe(siteGroupVal);
            expect(await editKnowledgePo.getSelectedFieldValue(siteField)).toBe(siteFieldVal);
            await editKnowledgePo.selectRegionDropDownOption(regionFieldVal2);
            await editKnowledgePo.selectSiteGroupDropDownOption(siteGroupVal2);
            await editKnowledgePo.selectSiteDropDownOption(siteFieldVal2);
            await editKnowledgePo.saveKnowledgeMedataDataChanges();
            await navigationPage.signOut();

            //Login with Knowledge Candidate
            await loginPage.login(knowledgeCandidateUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate(knowledgeData.TemplateName);
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeData.KnowledgeTitle);
            await createKnowledgePage.selectKnowledgeSet(knowledgeData.KnowledgeSet);
            await createKnowledgePage.selectRegionDropDownOption(regionFieldVal);
            await createKnowledgePage.clickAssignToMeButton();
            await createKnowledgePage.selectSiteGroupDropDownOption(siteGroupVal);
            await createKnowledgePage.selectSiteDropDownOption(siteFieldVal);
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await previewKnowledgePo.clickGoToArticleButton();
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            expect(await editKnowledgePo.getSelectedFieldValue(regionField)).toBe(regionFieldVal);
            expect(await editKnowledgePo.getSelectedFieldValue(siteGrpField)).toBe(siteGroupVal);
            expect(await editKnowledgePo.getSelectedFieldValue(siteField)).toBe(siteFieldVal);
            await editKnowledgePo.selectRegionDropDownOption(regionFieldVal2);
            await editKnowledgePo.selectSiteGroupDropDownOption(siteGroupVal2);
            await editKnowledgePo.selectSiteDropDownOption(siteFieldVal2);
            await editKnowledgePo.saveKnowledgeMedataDataChanges();
            await navigationPage.signOut();
        });

        it('[3840,3839,3838]:Verify the Save functionality of Region and Site fields on Knowledge Articles Create / Edit screen', async () => {
            //Login with Knowledge Contributor
            await loginPage.login(knowledgeContributorUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate(knowledgeData.TemplateName);
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeData.KnowledgeTitle);
            await createKnowledgePage.selectKnowledgeSet(knowledgeData.KnowledgeSet);
            await createKnowledgePage.selectRegionDropDownOption(regionFieldVal);
            await createKnowledgePage.clickAssignToMeButton();
            await createKnowledgePage.selectSiteGroupDropDownOption(siteGroupVal);
            await createKnowledgePage.selectSiteDropDownOption(siteFieldVal);
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await previewKnowledgePo.clickGoToArticleButton();
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            expect(await editKnowledgePo.getSelectedFieldValue(regionField)).toBe(regionFieldVal);
            expect(await editKnowledgePo.getSelectedFieldValue(siteGrpField)).toBe(siteGroupVal);
            expect(await editKnowledgePo.getSelectedFieldValue(siteField)).toBe(siteFieldVal);
            await editKnowledgePo.selectRegionDropDownOption(regionFieldVal2);
            await editKnowledgePo.selectSiteGroupDropDownOption(siteGroupVal2);
            await editKnowledgePo.selectSiteDropDownOption(siteFieldVal2);
            await editKnowledgePo.saveKnowledgeMedataDataChanges();
            await navigationPage.signOut();

            //Login with Knowledge Publisher
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate(knowledgeData.TemplateName);
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeData.KnowledgeTitle);
            await createKnowledgePage.selectKnowledgeSet(knowledgeData.KnowledgeSet);
            await createKnowledgePage.selectRegionDropDownOption(regionFieldVal);
            await createKnowledgePage.clickAssignToMeButton();
            await createKnowledgePage.selectSiteGroupDropDownOption(siteGroupVal);
            await createKnowledgePage.selectSiteDropDownOption(siteFieldVal);
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await previewKnowledgePo.clickGoToArticleButton();
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            expect(await editKnowledgePo.getSelectedFieldValue(regionField)).toBe(regionFieldVal);
            expect(await editKnowledgePo.getSelectedFieldValue(siteGrpField)).toBe(siteGroupVal);
            expect(await editKnowledgePo.getSelectedFieldValue(siteField)).toBe(siteFieldVal);
            await editKnowledgePo.selectRegionDropDownOption(regionFieldVal2);
            await editKnowledgePo.selectSiteGroupDropDownOption(siteGroupVal2);
            await editKnowledgePo.selectSiteDropDownOption(siteFieldVal2);
            await editKnowledgePo.saveKnowledgeMedataDataChanges();
            await navigationPage.signOut();
        });

        it('[3840,3839,3838]:Verify the Save functionality of Region and Site fields on Knowledge Articles Create / Edit screen', async () => {
            //Login with Knowledge Coach
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate(knowledgeData.TemplateName);
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeData.KnowledgeTitle);
            await createKnowledgePage.selectKnowledgeSet(knowledgeData.KnowledgeSet);
            await createKnowledgePage.selectRegionDropDownOption(regionFieldVal);
            await createKnowledgePage.clickAssignToMeButton();
            await createKnowledgePage.selectSiteGroupDropDownOption(siteGroupVal);
            await createKnowledgePage.selectSiteDropDownOption(siteFieldVal);
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await previewKnowledgePo.clickGoToArticleButton();
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            expect(await editKnowledgePo.getSelectedFieldValue(regionField)).toBe(regionFieldVal);
            expect(await editKnowledgePo.getSelectedFieldValue(siteGrpField)).toBe(siteGroupVal);
            expect(await editKnowledgePo.getSelectedFieldValue(siteField)).toBe(siteFieldVal);
            await editKnowledgePo.selectRegionDropDownOption(regionFieldVal2);
            await editKnowledgePo.selectSiteGroupDropDownOption(siteGroupVal2);
            await editKnowledgePo.selectSiteDropDownOption(siteFieldVal2);
            await editKnowledgePo.saveKnowledgeMedataDataChanges();
        });

        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        });
    });

    describe('[3832]:Verify the Save functionality of Region and Site fields on Document Library Create / Edit screen', () => {
        let caseAgentuserData = {
            "firstName": "caseAgent",
            "lastName": "user",
            "userId": "caseAgent",
            "userPermission": ["Case Agent","Foundation Read","Document Manager","Human Resource"]
        }
        let caseManageruserData = {
            "firstName": "caseManager",
            "lastName": "user",
            "userId": "caseManager",
            "userPermission": ["Case Manager","Foundation Read","Document Manager","Human Resource"]
        }
        let title = `Document_${new Date().valueOf()}`;
        let title1 = `Document1_${new Date().valueOf()}`;
        beforeAll(async () => {
            // await apiHelper.apiLogin('tadmin');
            // await apiHelper.createNewUser(caseAgentuserData);
            // await apiHelper.associatePersonToCompany(caseAgentuserData.userId, "Petramco");

            // await apiHelper.createNewUser(caseManageruserData);
            // await apiHelper.associatePersonToCompany(caseManageruserData.userId, "Petramco");
        });

        it('[3832]:Verify the Save functionality of Region and Site fields on Document Library Create / Edit screen', async () => {
            //Create a document library
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Document Management--Library', BWF_PAGE_TITLES.DOCUMENT_MANAGEMENT.LIBRARY);
            await createDocumentLibraryPage.openAddNewDocumentBlade();
            await createDocumentLibraryPage.addAttachment(filePath);
            await createDocumentLibraryPage.setTitle(title);
            await createDocumentLibraryPage.selectCompany(companyStr);
            await createDocumentLibraryPage.selectSupportOrg(hrSupportStr);
            await createDocumentLibraryPage.selectOwnerGroup(ownerSupportGroup);
            await createDocumentLibraryPage.selectRegion(regionFieldVal);
            await createDocumentLibraryPage.selectSiteGroup(siteGroupVal);
            await createDocumentLibraryPage.selectSite(siteFieldVal);
            await createDocumentLibraryPage.saveNewDocument();
            await browser.sleep(3000); //Time required for Document library to be visible on console 
            await utilityCommon.closePopUpMessage();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Document Management--Library', BWF_PAGE_TITLES.DOCUMENT_MANAGEMENT.LIBRARY);
            await utilityGrid.searchAndOpenHyperlink(title);
            await editDocumentLibraryPo.clickOnEditButton();
            expect(await editDocumentLibraryPo.getRegionSelectedValue()).toBe(regionFieldVal);
            expect(await editDocumentLibraryPo.getSiteGrpSelectedValue()).toBe(siteGroupVal);
            expect(await editDocumentLibraryPo.getSiteSelectedValue()).toBe(siteFieldVal);
            await editDocumentLibraryPo.setRegion(regionFieldVal2);
            await editDocumentLibraryPo.setSiteGrp(siteGroupVal2);
            await editDocumentLibraryPo.setSite(siteFieldVal2);
            await editDocumentLibraryPo.selectStatus(documentLibraryStatus);
            await editDocumentLibraryPo.clickOnSaveButton();
            await editDocumentLibraryPo.clickOnCancelButton();
        });

        it('[3832]:Verify the Save functionality of Region and Site fields on Document Library Create / Edit screen', async () => {
            //Login with Case Manager
            await navigationPage.signOut();
            await loginPage.login('qdu');
            //Create a document library
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Document Management--Library', BWF_PAGE_TITLES.DOCUMENT_MANAGEMENT.LIBRARY);
            await createDocumentLibraryPage.openAddNewDocumentBlade();
            await createDocumentLibraryPage.addAttachment(filePath);
            await createDocumentLibraryPage.setTitle(title1);
            await createDocumentLibraryPage.selectCompany(companyStr);
            await createDocumentLibraryPage.selectSupportOrg(hrSupportStr);
            await createDocumentLibraryPage.selectOwnerGroup(ownerSupportGroup);
            await createDocumentLibraryPage.selectRegion(regionFieldVal);
            await createDocumentLibraryPage.selectSiteGroup(siteGroupVal);
            await createDocumentLibraryPage.selectSite(siteFieldVal);
            await createDocumentLibraryPage.saveNewDocument();
            await utilityGrid.searchAndOpenHyperlink(title1);
            await editDocumentLibraryPo.clickOnEditButton();
            expect(await editDocumentLibraryPo.getRegionSelectedValue()).toBe(regionFieldVal);
            expect(await editDocumentLibraryPo.getSiteGrpSelectedValue()).toBe(siteGroupVal);
            expect(await editDocumentLibraryPo.getSiteSelectedValue()).toBe(siteFieldVal);
            await editDocumentLibraryPo.setRegion(regionFieldVal2);
            await editDocumentLibraryPo.setSiteGrp(siteGroupVal2);
            await editDocumentLibraryPo.setSite(siteFieldVal2);
            await editDocumentLibraryPo.selectStatus(documentLibraryStatus);
            await editDocumentLibraryPo.clickOnSaveButton();
            await editDocumentLibraryPo.clickOnCancelButton();
        });

        it('[3832]:Verify the Save functionality of Region and Site fields on Document Library Create / Edit screen', async () => {
            //Login with Case Agent
            await navigationPage.signOut();
            await loginPage.login('qgeorge');
            //Create a document library
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Document Management--Library', BWF_PAGE_TITLES.DOCUMENT_MANAGEMENT.LIBRARY);
            await createDocumentLibraryPage.openAddNewDocumentBlade();
            await createDocumentLibraryPage.addAttachment(filePath);
            let title2 = `Document2_${new Date().valueOf()}`;
            await createDocumentLibraryPage.setTitle(title2);
            await createDocumentLibraryPage.selectCompany(companyStr);
            await createDocumentLibraryPage.selectSupportOrg(hrSupportStr);
            await createDocumentLibraryPage.selectOwnerGroup(ownerSupportGroup);
            await createDocumentLibraryPage.selectRegion(regionFieldVal);
            await createDocumentLibraryPage.selectSiteGroup(siteGroupVal);
            await createDocumentLibraryPage.selectSite(siteFieldVal);
            await createDocumentLibraryPage.saveNewDocument();
            await utilityGrid.searchAndOpenHyperlink(title2);
            await editDocumentLibraryPo.clickOnEditButton();
            expect(await editDocumentLibraryPo.getRegionSelectedValue()).toBe(regionFieldVal);
            expect(await editDocumentLibraryPo.getSiteGrpSelectedValue()).toBe(siteGroupVal);
            expect(await editDocumentLibraryPo.getSiteSelectedValue()).toBe(siteFieldVal);
            await editDocumentLibraryPo.setRegion(regionFieldVal2);
            await editDocumentLibraryPo.setSiteGrp(siteGroupVal2);
            await editDocumentLibraryPo.setSite(siteFieldVal2);
            await editDocumentLibraryPo.selectStatus(documentLibraryStatus);
            await editDocumentLibraryPo.clickOnSaveButton();
            await editDocumentLibraryPo.clickOnCancelButton();
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        });
    });
//done
    describe('[3831]:Verify the search functionality of Document library console for Region', () => {
        let regionFields: string[] = ["Region"];
        let caseAgentuserData = {
            "firstName": "caseAgent",
            "lastName": "user",
            "userId": "caseAgent",
            "userPermission": ["Case Agent", "Foundation Read", "Document Manager","Human Resource"]
        }
        let caseManageruserData = {
            "firstName": "caseManager",
            "lastName": "user",
            "userId": "caseManager",
            "userPermission": ["Case Manager", "Foundation Read", "Document Manager","Human Resource"]
        }

        beforeAll(async () => {
            // await apiHelper.apiLogin('tadmin');
            // await apiHelper.createNewUser(caseAgentuserData);
            // await apiHelper.associatePersonToCompany(caseAgentuserData.userId, "Petramco");
            // await apiHelper.associatePersonToSupportGroup(caseAgentuserData.userId, ownerSupportGroup);
            // await apiHelper.createNewUser(caseManageruserData);
            // await apiHelper.associatePersonToCompany(caseManageruserData.userId, "Petramco");
            // await apiHelper.associatePersonToSupportGroup(caseManageruserData.userId, ownerSupportGroup);
        });

        it('[3831]:Verify the search functionality of Document library console for Region', async () => {
            //*Create a document library
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Document Management--Library', BWF_PAGE_TITLES.DOCUMENT_MANAGEMENT.LIBRARY);
            await createDocumentLibraryPage.openAddNewDocumentBlade();
            await createDocumentLibraryPage.addAttachment(filePath);
            let title = `Document-${new Date().valueOf()}`;
            await createDocumentLibraryPage.setTitle(title);
            await createDocumentLibraryPage.selectCompany(companyStr);
            await createDocumentLibraryPage.selectSupportOrg('HR Support');
            await createDocumentLibraryPage.selectOwnerGroup(ownerSupportGroup);
            await createDocumentLibraryPage.selectRegion(regionFieldVal);
            await createDocumentLibraryPage.selectSiteGroup(siteGroupVal);
            await createDocumentLibraryPage.selectSite(siteFieldVal);
            await createDocumentLibraryPage.saveNewDocument();

            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Document Management--Library', BWF_PAGE_TITLES.DOCUMENT_MANAGEMENT.LIBRARY);
            await documentLibraryPage.addColumnOnGrid(regionFields);
            await utilityGrid.searchRecord(regionFieldVal);
            expect(await documentLibraryPage.getSelectedGridRecordValue(regionField)).toEqual(regionFieldVal);
            await documentLibraryPage.removeColumnOnGrid(regionFields);
            await utilityGrid.searchRecord(regionFieldVal);
            expect(await utilityGrid.isGridRecordPresent(regionFieldVal)).toBeFalsy('Record is present');
            await navigationPage.signOut();
        });

        it('[3831]:Verify the search functionality of Document library console for Region', async () => {
            //Login with Case Manager
            await loginPage.login('qdu');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Document Management--Library', BWF_PAGE_TITLES.DOCUMENT_MANAGEMENT.LIBRARY);
            await documentLibraryPage.addColumnOnGrid(regionFields);
            await utilityGrid.searchRecord(regionFieldVal);
            expect(await documentLibraryPage.getSelectedGridRecordValue(regionField)).toEqual(regionFieldVal);

            await documentLibraryPage.removeColumnOnGrid(regionFields);
            expect(await utilityGrid.isGridRecordPresent(regionFieldVal)).toBeFalsy('Record is present');
            await navigationPage.signOut();

            //Login with Case Agent
            await loginPage.login('qgeorge');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Document Management--Library', BWF_PAGE_TITLES.DOCUMENT_MANAGEMENT.LIBRARY);
            await documentLibraryPage.addColumnOnGrid(regionFields);
            await utilityGrid.searchRecord(regionFieldVal);
            expect(await documentLibraryPage.getSelectedGridRecordValue(regionField)).toEqual(regionFieldVal);

            await documentLibraryPage.removeColumnOnGrid(regionFields);
            expect(await utilityGrid.isGridRecordPresent(regionFieldVal)).toBeFalsy('Record is present');
        });

        afterAll(async () => {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        });
    });
//done
    describe('[3833]:Verify the document search based on Region and Site from attachments', () => {
        let caseSummary = `${new Date().valueOf()}Case for Document Search`;
        let title = `${new Date().valueOf()}Document`;

        beforeAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
        })

        it('[3833]:Verify the document search based on Region and Site from attachments', async () => {
            //Create a document library
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Document Management--Library', BWF_PAGE_TITLES.DOCUMENT_MANAGEMENT.LIBRARY);
            await createDocumentLibraryPage.openAddNewDocumentBlade();
            await createDocumentLibraryPage.addAttachment(filePath);
            await createDocumentLibraryPage.setTitle(title);
            await createDocumentLibraryPage.selectCompany(companyStr);
            await createDocumentLibraryPage.selectSupportOrg('Facilities Support');
            await createDocumentLibraryPage.selectOwnerGroup('Facilities');
            await createDocumentLibraryPage.selectRegion(regionFieldVal);
            await createDocumentLibraryPage.selectSiteGroup(siteGroupVal);
            await createDocumentLibraryPage.selectSite(siteFieldVal);
            await createDocumentLibraryPage.saveNewDocument();
            await utilityGrid.searchAndOpenHyperlink(title);
            await editDocumentLibraryPo.clickOnEditButton();
            expect(await editDocumentLibraryPo.getRegionSelectedValue()).toBe(regionFieldVal);
            expect(await editDocumentLibraryPo.getSiteGrpSelectedValue()).toBe(siteGroupVal);
            expect(await editDocumentLibraryPo.getSiteSelectedValue()).toBe(siteFieldVal);
            await editDocumentLibraryPo.selectStatus(documentLibraryStatus);
            await editDocumentLibraryPo.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
            await editDocumentLibraryPo.clickOnCancelButton();
            await browser.sleep(30000); // To Wait For Document Library Record Updates And Display Console Page.
        });

        it('[3833]:Verify the document search based on Region and Site from attachments', async () => {
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
            await utilityCommon.selectDropDown(regionField, regionFieldVal, DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            expect(await resources.isAdvancedSearchResultContainsRecord(title)).toBeTruthy();

            await resources.enterAdvancedSearchText(title);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(siteField, siteFieldVal, DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            expect(await resources.isAdvancedSearchResultContainsRecord(title)).toBeTruthy();
            await utilityCommon.closeAllBlades();

            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            await viewCasePage.clickOnEmailLink();
            await composeMailPo.clickOnAttachmentLink();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(title);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(regionField, regionFieldVal, DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            expect(await resources.isAdvancedSearchResultContainsRecord(title)).toBeTruthy();
            await resources.enterAdvancedSearchText(title);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(siteField, siteFieldVal, DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            expect(await resources.isAdvancedSearchResultContainsRecord(title)).toBeTruthy();
            await utilityCommon.closeAllBlades();
            await composeMailPo.clickOnDiscardButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            await navigationPage.signOut();
        });

        it('[3833]:Verify the document search based on Region and Site from attachments', async () => {
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
            await utilityCommon.selectDropDown(regionField, regionFieldVal, DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            expect(await resources.isAdvancedSearchResultContainsRecord(title)).toBeTruthy();
            await resources.enterAdvancedSearchText(title);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(siteField, siteFieldVal, DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(title)).toEqual(title);
            await utilityCommon.closeAllBlades();

            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            await viewCasePage.clickOnEmailLink();
            await composeMailPo.clickOnAttachmentLink();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(title);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(regionField, regionFieldVal, DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(title)).toEqual(title);
            await resources.enterAdvancedSearchText(title);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(siteField, siteFieldVal, DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            expect(await resources.isAdvancedSearchResultContainsRecord(title)).toBeTruthy();
            await utilityCommon.closeAllBlades();
            await composeMailPo.clickOnDiscardButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            await navigationPage.signOut();
        });

        it('[3833]:Verify the document search based on Region and Site from attachments', async () => {
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
            await utilityCommon.selectDropDown(regionField, regionFieldVal, DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            expect(await resources.isAdvancedSearchResultContainsRecord(title)).toBeTruthy();
            await resources.enterAdvancedSearchText(title);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(siteField, siteFieldVal, DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            expect(await resources.isAdvancedSearchResultContainsRecord(title)).toBeTruthy();
            await utilityCommon.closeAllBlades();

            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            await viewCasePage.clickOnEmailLink();
            await composeMailPo.clickOnAttachmentLink();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(title);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(regionField, regionFieldVal, DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            expect(await resources.isAdvancedSearchResultContainsRecord(title)).toBeTruthy();
            await resources.enterAdvancedSearchText(title);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(siteField, siteFieldVal, DropDownType.Label);
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
//done
    describe('[3834]:Verify the knowledge articles search based on Region and Site on Quick case / Create case', () => {
        it('[3834]:Verify the knowledge articles search based on Region and Site on Quick case / Create case', async () => {
            await navigationPage.gotoQuickCase();
            await quickCase.selectRequesterName(caseAgentUser);
            await quickCase.setCaseSummary(articleInDraftStatus);
            await utilityCommon.closePopUpMessage();
            //Search with knowledge article with draft status
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(regionField, regionFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Draft", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInDraftStatus)).toEqual(articleInDraftStatus);
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(siteField, siteFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Draft", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInDraftStatus)).toEqual(articleInDraftStatus);

            //Search with knowledge article with SMEReview status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(regionField, regionFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "SME Review", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInSMEReviewStatus)).toEqual(articleInSMEReviewStatus);
            await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(siteField, siteFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "SME Review", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInSMEReviewStatus)).toEqual(articleInSMEReviewStatus);

            //Search with knowledge article with Published status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInPublishedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(regionField, regionFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Published", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInPublishedStatus)).toEqual(articleInPublishedStatus);
            await resources.enterAdvancedSearchText(articleInPublishedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(siteField, siteFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Published", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInPublishedStatus)).toEqual(articleInPublishedStatus);
        });
        it('[3834]:Verify the knowledge articles search based on Region and Site on Quick case / Create case', async () => {
            //Search with knowledge article with Retired status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInRetiredStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(regionField, regionFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Retired", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInRetiredStatus)).toEqual(articleInRetiredStatus);
            await resources.enterAdvancedSearchText(articleInRetiredStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(siteField, siteFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Retired", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInRetiredStatus)).toEqual(articleInRetiredStatus);

            //Search with knowledge article with Closed status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInClosedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(regionField, regionFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Closed", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInClosedStatus)).toEqual(articleInClosedStatus);
            await resources.enterAdvancedSearchText(articleInClosedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(siteField, siteFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Closed", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInClosedStatus)).toEqual(articleInClosedStatus);

            //Search with knowledge article with Canceled status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInCanceledStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(regionField, regionFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Canceled", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInCanceledStatus)).toEqual(articleInCanceledStatus);
            await resources.enterAdvancedSearchText(articleInCanceledStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(siteField, siteFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Canceled", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInCanceledStatus)).toEqual(articleInCanceledStatus);
        });
        it('[3834]:Verify the knowledge articles search based on Region and Site on Quick case / Create case', async () => {
            //Navigate to Create case
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary(articleInDraftStatus);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await utilityCommon.closePopUpMessage();
            await viewCasePage.clickOnTab('Resources');

            //Search with knowledge article with draft status
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(regionField, regionFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Draft", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInDraftStatus)).toEqual(articleInDraftStatus);
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(siteField, siteFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Draft", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInDraftStatus)).toEqual(articleInDraftStatus);

            // Search with knowledge article with SMEReview status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(regionField, regionFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "SME Review", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInSMEReviewStatus)).toEqual(articleInSMEReviewStatus);
            await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(siteField, siteFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "SME Review", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInSMEReviewStatus)).toEqual(articleInSMEReviewStatus);

            //Search with knowledge article with Published status
            await resources.enterAdvancedSearchText(articleInPublishedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(regionField, regionFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Published", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInPublishedStatus)).toEqual(articleInPublishedStatus);
            await resources.enterAdvancedSearchText(articleInPublishedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(siteField, siteFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Published", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInPublishedStatus)).toEqual(articleInPublishedStatus);
        });
        it('[3834]:Verify the knowledge articles search based on Region and Site on Quick case / Create case', async () => {
            //Search with knowledge article with Retired status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInRetiredStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(regionField, regionFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Retired", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInRetiredStatus)).toEqual(articleInRetiredStatus);
            await resources.enterAdvancedSearchText(articleInRetiredStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(siteField, siteFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Retired", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInRetiredStatus)).toEqual(articleInRetiredStatus);

            //Search with knowledge article with Closed status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInClosedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(regionField, regionFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Closed", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInClosedStatus)).toEqual(articleInClosedStatus);
            await resources.enterAdvancedSearchText(articleInClosedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(siteField, siteFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Closed", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInClosedStatus)).toEqual(articleInClosedStatus);

            //Search with knowledge article with Canceled status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInCanceledStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(regionField, regionFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Canceled", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInCanceledStatus)).toEqual(articleInCanceledStatus);
            await resources.enterAdvancedSearchText(articleInCanceledStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(siteField, siteFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Canceled", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInCanceledStatus)).toEqual(articleInCanceledStatus);
        });
        it('[3834]:Verify the knowledge articles search based on Region and Site on Quick case / Create case', async () => {
            //Login with Case Manager
            await navigationPage.signOut();
            await loginPage.login(caseManagerUser);
            await navigationPage.gotoQuickCase();
            await quickCase.selectRequesterName(caseAgentUser);
            await quickCase.setCaseSummary(articleInDraftStatus);
            await utilityCommon.closePopUpMessage();
            //Search with knowledge article with draft status
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(regionField, regionFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Draft", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInDraftStatus)).toEqual(articleInDraftStatus);
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(siteField, siteFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Draft", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInDraftStatus)).toEqual(articleInDraftStatus);
        });
        it('[3834]:Verify the knowledge articles search based on Region and Site on Quick case / Create case', async () => {
            // Search with knowledge article with SMEReview status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(regionField, regionFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "SME Review", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInSMEReviewStatus)).toEqual(articleInSMEReviewStatus);
            await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(siteField, siteFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "SME Review", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInSMEReviewStatus)).toEqual(articleInSMEReviewStatus);

            //Search with knowledge article with Published status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInPublishedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(regionField, regionFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Published", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInPublishedStatus)).toEqual(articleInPublishedStatus);
            await resources.enterAdvancedSearchText(articleInPublishedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(siteField, siteFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Published", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInPublishedStatus)).toEqual(articleInPublishedStatus);
        });
        it('[3834]:Verify the knowledge articles search based on Region and Site on Quick case / Create case', async () => {
            //Search with knowledge article with Retired status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInRetiredStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(regionField, regionFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Retired", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInRetiredStatus)).toEqual(articleInRetiredStatus);
            await resources.enterAdvancedSearchText(articleInRetiredStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(siteField, siteFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Retired", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInRetiredStatus)).toEqual(articleInRetiredStatus);

            //Search with knowledge article with Closed status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInClosedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(regionField, regionFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Closed", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInClosedStatus)).toEqual(articleInClosedStatus);
            await resources.enterAdvancedSearchText(articleInClosedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(siteField, siteFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Closed", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInClosedStatus)).toEqual(articleInClosedStatus);

            //Search with knowledge article with Canceled status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInCanceledStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(regionField, regionFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Canceled", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInCanceledStatus)).toEqual(articleInCanceledStatus);
            await resources.enterAdvancedSearchText(articleInCanceledStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(siteField, siteFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Canceled", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInCanceledStatus)).toEqual(articleInCanceledStatus);
        });
        it('[3834]:Verify the knowledge articles search based on Region and Site on Quick case / Create case', async () => {
            //Navigate to Create case
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary(articleInDraftStatus);
            await changeAssignmentBladePo.setAssignee('CA Support 1', 'Qiang Du');
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await utilityCommon.closePopUpMessage();
            await viewCasePage.clickOnTab('Resources');

            //Search with knowledge article with draft status
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(regionField, regionFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Draft", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInDraftStatus)).toEqual(articleInDraftStatus);
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(siteField, siteFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Draft", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInDraftStatus)).toEqual(articleInDraftStatus);

            // Search with knowledge article with SMEReview status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(regionField, regionFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "SME Review", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInSMEReviewStatus)).toEqual(articleInSMEReviewStatus);
            await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(siteField, siteFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "SME Review", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInSMEReviewStatus)).toEqual(articleInSMEReviewStatus);

            //Search with knowledge article with Published status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInPublishedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(regionField, regionFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Published", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInPublishedStatus)).toEqual(articleInPublishedStatus);
            await resources.enterAdvancedSearchText(articleInPublishedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(siteField, siteFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Published", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInPublishedStatus)).toEqual(articleInPublishedStatus);
        });
        it('[3834]:Verify the knowledge articles search based on Region and Site on Quick case / Create case', async () => {
            //Search with knowledge article with Retired status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInRetiredStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(regionField, regionFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Retired", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInRetiredStatus)).toEqual(articleInRetiredStatus);
            await resources.enterAdvancedSearchText(articleInRetiredStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(siteField, siteFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Retired", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInRetiredStatus)).toEqual(articleInRetiredStatus);

            //Search with knowledge article with Closed status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInClosedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(regionField, regionFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Closed", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInClosedStatus)).toEqual(articleInClosedStatus);
            await resources.enterAdvancedSearchText(articleInClosedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(siteField, siteFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Closed", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInClosedStatus)).toEqual(articleInClosedStatus);

            //Search with knowledge article with Canceled status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInCanceledStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(regionField, regionFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Canceled", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInCanceledStatus)).toEqual(articleInCanceledStatus);
            await resources.enterAdvancedSearchText(articleInCanceledStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(siteField, siteFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Canceled", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInCanceledStatus)).toEqual(articleInCanceledStatus);
        });
        it('[3834]:Verify the knowledge articles search based on Region and Site on Quick case / Create case', async () => {
            //Login as Case Agent
            await navigationPage.signOut();
            await loginPage.login(caseAgentUser);
            await navigationPage.gotoQuickCase();
            await quickCase.selectRequesterName(caseManagerUser);
            await quickCase.setCaseSummary(articleInDraftStatus);
            await utilityCommon.closePopUpMessage();
            //Search with knowledge article with draft status
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(regionField, regionFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Draft", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInDraftStatus)).toEqual(articleInDraftStatus);
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(siteField, siteFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Draft", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInDraftStatus)).toEqual(articleInDraftStatus);
        });
        it('[3834]:Verify the knowledge articles search based on Region and Site on Quick case / Create case', async () => {
            // Search with knowledge article with SMEReview status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(regionField, regionFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "SME Review", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInSMEReviewStatus)).toEqual(articleInSMEReviewStatus);
            await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(siteField, siteFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "SME Review", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInSMEReviewStatus)).toEqual(articleInSMEReviewStatus);

            //Search with knowledge article with Published status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInPublishedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(regionField, regionFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Published", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInPublishedStatus)).toEqual(articleInPublishedStatus);
            await resources.enterAdvancedSearchText(articleInPublishedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(siteField, siteFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Published", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInPublishedStatus)).toEqual(articleInPublishedStatus);
        });
        it('[3834]:Verify the knowledge articles search based on Region and Site on Quick case / Create case', async () => {
            //Search with knowledge article with Retired status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInRetiredStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(regionField, regionFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Retired", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInRetiredStatus)).toEqual(articleInRetiredStatus);
            await resources.enterAdvancedSearchText(articleInRetiredStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(siteField, siteFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Retired", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInRetiredStatus)).toEqual(articleInRetiredStatus);

            //Search with knowledge article with Closed status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInClosedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(regionField, regionFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Closed", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInClosedStatus)).toEqual(articleInClosedStatus);
            await resources.enterAdvancedSearchText(articleInClosedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(siteField, siteFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Closed", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInClosedStatus)).toEqual(articleInClosedStatus);

            //Search with knowledge article with Canceled status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInCanceledStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(regionField, regionFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Canceled", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInCanceledStatus)).toEqual(articleInCanceledStatus);
            await resources.enterAdvancedSearchText(articleInCanceledStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(siteField, siteFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Canceled", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInCanceledStatus)).toEqual(articleInCanceledStatus);
        });
        it('[3834]:Verify the knowledge articles search based on Region and Site on Quick case / Create case', async () => {
            //Navigate to Create case
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary(articleInDraftStatus);
            await changeAssignmentBladePo.setAssignee('CA Support 1', 'Qiang Du');
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePage.clickOnTab('Resources');
            await utilityCommon.closePopUpMessage();

            //Search with knowledge article with draft status
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(regionField, regionFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Draft", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInDraftStatus)).toEqual(articleInDraftStatus);
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(siteField, siteFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Draft", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInDraftStatus)).toEqual(articleInDraftStatus);

            // Search with knowledge article with SMEReview status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(regionField, regionFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "SME Review", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInSMEReviewStatus)).toEqual(articleInSMEReviewStatus);
            await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(siteField, siteFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "SME Review", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInSMEReviewStatus)).toEqual(articleInSMEReviewStatus);

            //Search with knowledge article with Published status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInPublishedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(regionField, regionFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Published", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInPublishedStatus)).toEqual(articleInPublishedStatus);
            await resources.enterAdvancedSearchText(articleInPublishedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(siteField, siteFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Published", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInPublishedStatus)).toEqual(articleInPublishedStatus);
        });
        it('[3834]:Verify the knowledge articles search based on Region and Site on Quick case / Create case', async () => {
            //Search with knowledge article with Retired status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInRetiredStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(regionField, regionFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Retired", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInRetiredStatus)).toEqual(articleInRetiredStatus);
            await resources.enterAdvancedSearchText(articleInRetiredStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(siteField, siteFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Retired", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInRetiredStatus)).toEqual(articleInRetiredStatus);

            //Search with knowledge article with Closed status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInClosedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(regionField, regionFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Closed", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInClosedStatus)).toEqual(articleInClosedStatus);
            await resources.enterAdvancedSearchText(articleInClosedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(siteField, siteFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Closed", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInClosedStatus)).toEqual(articleInClosedStatus);

            //Search with knowledge article with Canceled status
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInCanceledStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(regionField, regionFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Canceled", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInCanceledStatus)).toEqual(articleInCanceledStatus);
            await resources.enterAdvancedSearchText(articleInCanceledStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(siteField, siteFieldVal, DropDownType.Label);
            await utilityCommon.selectDropDown("Status", "Canceled", DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInCanceledStatus)).toEqual(articleInCanceledStatus);
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        });
    });

});
