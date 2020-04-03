import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import { Knowledge } from '../../api/constant.api';
import previewCasePo from '../../pageobject/case/case-preview.po';
import createCasePage from '../../pageobject/case/create-case.po';
import previewCasePo from '../../pageobject/case/case-preview.po';
import quickCase from '../../pageobject/case/quick-case.po';
import viewCasePage from "../../pageobject/case/view-case.po";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import resources from '../../pageobject/common/resources-tab.po';
import composeMailPo from '../../pageobject/email/compose-mail.po';
import createKnowledgePage from "../../pageobject/knowledge/create-knowlege.po";
import editKnowledgePo from '../../pageobject/knowledge/edit-knowledge.po';
import knowledgeConsole from '../../pageobject/knowledge/knowledge-articles-console.po';
import viewKnowledgeArticlePo from '../../pageobject/knowledge/view-knowledge-article.po';
import createDocumentLibraryPage from '../../pageobject/settings/document-management/create-document-library.po';
import documentLibraryPage from '../../pageobject/settings/document-management/document-library-console.po';
import editDocumentLibraryPo from '../../pageobject/settings/document-management/edit-document-library.po';
import activityTabPo from '../../pageobject/social/activity-tab.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilGrid from "../../utils/util.grid";
let caseBAUser = 'qkatawazi';
let caseAgentUser = 'qtao';
let caseManagerUser = 'qdu';
let knowledgeCandidateUser = 'kayo';
let knowledgeContributorUser = 'kkohri';
let knowledgePublisherUser = 'kmills';
let knowledgeCoachUser = 'kWilliamson';
let emptyStr = undefined;
let articleInDraftStatus = 'DRDMV-19572 KnowledgeArticle_Draft';
let articleInSMEReviewStatus = 'DRDMV-19572 KnowledgeArticle_SMEReview';
let articleInPublishedStatus = 'DRDMV-19572 KnowledgeArticle_Published';
let articleInRetiredStatus = 'DRDMV-19572 KnowledgeArticle_Retired';
let articleInClosedStatus = 'DRDMV-19572 KnowledgeArticle_Closed';
let articleInCanceledStatus = 'DRDMV-19572 KnowledgeArticle_Canceled';
let regionField = "Region";
let siteField = "Site";
let regionFieldVal = "Australia";
let siteFieldVal = "Canberra";
let siteFieldVal2 = "Athens";
let regionFieldVal2 = "Central America";
let siteFieldVal1 = "Mexico City";
let knowledgeManagementApp = "Knowledge Management";
let companyStr = "Petramco";
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
let publishedStatus = "Published";
let retiredStatus = "Retired";
let closedStatus = "Closed";
let canceledStatus = "Canceled";
var title = "DRDMV-19572 KnowledgeArticle";

describe('Knowledge Articles - Location (Region / Site) Tests', () => {
    const draft: any = Knowledge.Draft;
    const smeReview: any = Knowledge.SMEReview;
    const published: any = Knowledge.Published;
    const retired: any = Knowledge.Retired;
    const closed: any = Knowledge.Closed;
    const canceled: any = Knowledge.Canceled;
    const filePath = '../../../data/ui/attachment/articleStatus.png';
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login(caseBAUser);
        await apiHelper.apiLogin(knowledgePublisherUser);
        var articleData = {
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
        var knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);

        //Create article in draft status
        articleData.title = title + "_" + draftStatus;
        var knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
        var knowledgeArticleGUID = knowledgeArticleData.id;
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, draftStatus)).toBeTruthy("Article with Draft status not updated.");

        //Create article in SMEReview status
        articleData.title = title + "_" + smeReviewStatus;
        var knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
        var knowledgeArticleGUID = knowledgeArticleData.id;
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, draftStatus)).toBeTruthy("Article with Draft status not updated.");
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, smeReviewStatus, "KMills", 'GB Support 2', 'Petramco')).toBeTruthy("Article with SME Review status not updated.");

        //Create article in Published status
        articleData.title = title + "_" + publishedStatus;
        var knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
        var knowledgeArticleGUID = knowledgeArticleData.id;
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, draftStatus)).toBeTruthy("Article with Draft status not updated.");
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, publishedStatus)).toBeTruthy("Article with Published status not updated.");

        //Create article in Retired status
        articleData.title = title + "_" + retiredStatus;
        var knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
        var knowledgeArticleGUID = knowledgeArticleData.id;
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, draftStatus)).toBeTruthy("Article with Draft status not updated.");
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, publishedStatus)).toBeTruthy("Article with Published status not updated.");
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, retiredStatus)).toBeTruthy("Article with Retired status not updated.");

        //Create article in Closed status
        articleData.title = title + "_" + closedStatus;
        var knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
        var knowledgeArticleGUID = knowledgeArticleData.id;
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, draftStatus)).toBeTruthy("Article with Draft status not updated.");
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, publishedStatus)).toBeTruthy("Article with Published status not updated.");
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, closedStatus)).toBeTruthy("Article with Closed status not updated.");

        //Create article in Canceled status
        articleData.title = title + "_" + canceledStatus;
        var knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
        var knowledgeArticleGUID = knowledgeArticleData.id;
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, canceledStatus)).toBeTruthy("Article with Canceled status not updated.");
    }, 3 * 60 * 1000);

    afterEach(async () => {
        await browser.refresh();
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    it('[DRDMV-19569,DRDMV-19570,DRDMV-19571]:Verify the search functionality of knowledge articles console for Region', async () => {
        try {
            let regionFieldColumn: string[] = ["Region"];
            let knowledgeGridColumnFields: string[] = ["Article ID", "Title", "Knowledge Set", "Status", "Assignee", "Company", "Template Name", "Reviewer", "Modified By", "Created Date", "Modified Date", "Flagged", "Region"];
            let knowledgeGridColumnFieldsWithoutRegion: string[] = ["Article ID", "Title", "Knowledge Set", "Status", "Assignee", "Company", "Template Name", "Reviewer", "Modified By", "Created Date", "Modified Date", "Flagged"];

            await navigationPage.gotoKnowledgeConsole();
            await utilGrid.clearFilter();
            await knowledgeConsole.addColumnOnGrid(regionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFields)).toBe(true);
            await utilGrid.searchOnGridConsole(regionFieldVal);
            let regionVal: string = await knowledgeConsole.getSelectedGridRecordValue(regionField);
            expect(regionVal).toEqual(regionFieldVal);

            await knowledgeConsole.removeColumnOnGrid(regionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFieldsWithoutRegion)).toBe(true);
            await utilGrid.searchOnGridConsole(regionFieldVal);
            regionVal = await knowledgeConsole.getSelectedGridRecordValue(regionField);
            expect(regionVal).toEqual(emptyStr);
            await navigationPage.signOut();

            await loginPage.login(caseManagerUser);
            await navigationPage.gotoKnowledgeConsole();
            await utilGrid.clearFilter();
            await knowledgeConsole.addColumnOnGrid(regionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFields)).toBe(true);
            await utilGrid.searchOnGridConsole(regionFieldVal);
            regionVal = await knowledgeConsole.getSelectedGridRecordValue(regionField);
            expect(regionVal).toEqual(regionFieldVal);

            await knowledgeConsole.removeColumnOnGrid(regionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFieldsWithoutRegion)).toBe(true);
            await utilGrid.searchOnGridConsole(regionFieldVal);
            regionVal = await knowledgeConsole.getSelectedGridRecordValue(regionField);
            expect(regionVal).toEqual(emptyStr);
            await navigationPage.signOut();

            await loginPage.login(caseAgentUser);
            await navigationPage.gotoKnowledgeConsole();
            await utilGrid.clearFilter();
            await knowledgeConsole.addColumnOnGrid(regionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFields)).toBe(true);
            await utilGrid.searchOnGridConsole(regionFieldVal);
            regionVal = await knowledgeConsole.getSelectedGridRecordValue(regionField);
            expect(regionVal).toEqual(regionFieldVal);
            await knowledgeConsole.removeColumnOnGrid(regionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFieldsWithoutRegion)).toBe(true);
            await utilGrid.searchOnGridConsole(regionFieldVal);
            regionVal = await knowledgeConsole.getSelectedGridRecordValue(regionField);
            expect(regionVal).toEqual(emptyStr);
            await navigationPage.signOut();

            await loginPage.login(knowledgeCandidateUser);
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            await utilGrid.clearFilter();
            await knowledgeConsole.addColumnOnGrid(regionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFields)).toBe(true);
            await utilGrid.searchOnGridConsole(regionFieldVal);
            regionVal = await knowledgeConsole.getSelectedGridRecordValue(regionField);
            expect(regionVal).toEqual(regionFieldVal);
            await knowledgeConsole.removeColumnOnGrid(regionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFieldsWithoutRegion)).toBe(true);
            await utilGrid.searchOnGridConsole(regionFieldVal);
            regionVal = await knowledgeConsole.getSelectedGridRecordValue(regionField);
            expect(regionVal).toEqual(emptyStr);
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();

            await loginPage.login(knowledgeContributorUser);
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            await utilGrid.clearFilter();
            await knowledgeConsole.addColumnOnGrid(regionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFields)).toBe(true);
            await utilGrid.searchOnGridConsole(regionFieldVal);
            regionVal = await knowledgeConsole.getSelectedGridRecordValue(regionField);
            expect(regionVal).toEqual(regionFieldVal);
            await knowledgeConsole.removeColumnOnGrid(regionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFieldsWithoutRegion)).toBe(true);
            await utilGrid.searchOnGridConsole(regionFieldVal);
            regionVal = await knowledgeConsole.getSelectedGridRecordValue(regionField);
            expect(regionVal).toEqual(emptyStr);
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();

            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            await utilGrid.clearFilter();
            await knowledgeConsole.addColumnOnGrid(regionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFields)).toBe(true);
            await utilGrid.searchOnGridConsole(regionFieldVal);
            regionVal = await knowledgeConsole.getSelectedGridRecordValue(regionField);
            expect(regionVal).toEqual(regionFieldVal);
            await knowledgeConsole.removeColumnOnGrid(regionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFieldsWithoutRegion)).toBe(true);
            await utilGrid.searchOnGridConsole(regionFieldVal);
            regionVal = await knowledgeConsole.getSelectedGridRecordValue(regionField);
            expect(regionVal).toEqual(emptyStr);
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();

            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            await utilGrid.clearFilter();
            await knowledgeConsole.addColumnOnGrid(regionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFields)).toBe(true);
            await utilGrid.searchOnGridConsole(regionFieldVal);
            regionVal = await knowledgeConsole.getSelectedGridRecordValue(regionField);
            expect(regionVal).toEqual(regionFieldVal);
            await knowledgeConsole.removeColumnOnGrid(regionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFieldsWithoutRegion)).toBe(true);
            await utilGrid.searchOnGridConsole(regionFieldVal);
            regionVal = await knowledgeConsole.getSelectedGridRecordValue(regionField);
            expect(regionVal).toEqual(emptyStr);
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

    }, 480 * 1000);

    it('[DRDMV-19565,DRDMV-19567,DRDMV-19568]:Verify the Save functionality of Region and Site fields on Knowledge Articles Create / Edit screen', async () => {
        let knowledgeDataFile = require("../../data/ui/knowledge/knowledgeArticle.ui.json");
        let knowledgeData = knowledgeDataFile['DRDMV-19020'];
        try {
            //* Check the Availability of Region with Case Business Analyst
            await navigationPage.gotoKnowledgeConsole();
            await utilCommon.waitUntilSpinnerToHide();
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate(knowledgeData.TemplateName);
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeData.KnowledgeTitle);
            await createKnowledgePage.selectKnowledgeSet(knowledgeData.KnowledgeSet);
            await createKnowledgePage.clickAssignToMeButton();
            await createKnowledgePage.selectRegionDropDownOption(regionFieldVal);
            await createKnowledgePage.selectSiteDropDownOption(siteFieldVal);
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await createKnowledgePage.clickOnviewArticleLinkButton();
            await utilCommon.switchToNewWidnow(1);
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            expect(await editKnowledgePo.getRegionSelectedValue(regionField)).toBe(regionFieldVal);
            expect(await editKnowledgePo.getSiteSelectedValue(siteField)).toBe(siteFieldVal);
            await editKnowledgePo.selectRegionDropDownOption(regionFieldVal2);
            await editKnowledgePo.selectSiteDropDownOption(siteFieldVal1);
            await editKnowledgePo.saveKnowledgeMedataDataChanges();
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();

            //Create Knowledge article by Case Manager
            await loginPage.login(caseManagerUser);
            await navigationPage.gotoKnowledgeConsole();
            await utilCommon.waitUntilSpinnerToHide();
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate(knowledgeData.TemplateName);
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeData.KnowledgeTitle);
            await createKnowledgePage.selectKnowledgeSet(knowledgeData.KnowledgeSet);
            await createKnowledgePage.clickAssignToMeButton();
            await createKnowledgePage.selectRegionDropDownOption(regionFieldVal);
            await createKnowledgePage.selectSiteDropDownOption(siteFieldVal);
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await createKnowledgePage.clickOnviewArticleLinkButton();
            await utilCommon.switchToNewWidnow(1);
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            expect(await editKnowledgePo.getRegionSelectedValue(regionField)).toBe(regionFieldVal);
            expect(await editKnowledgePo.getSiteSelectedValue(siteField)).toBe(siteFieldVal);
            await editKnowledgePo.selectRegionDropDownOption(regionFieldVal2);
            await editKnowledgePo.selectSiteDropDownOption(siteFieldVal1);
            await editKnowledgePo.saveKnowledgeMedataDataChanges();
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();

            //Create Knowledge article by Case Agent
            await loginPage.login(caseAgentUser);
            await navigationPage.gotoKnowledgeConsole();
            await utilCommon.waitUntilSpinnerToHide();
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate(knowledgeData.TemplateName);
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeData.KnowledgeTitle);
            await createKnowledgePage.selectKnowledgeSet(knowledgeData.KnowledgeSet);
            await createKnowledgePage.clickAssignToMeButton();
            await createKnowledgePage.selectRegionDropDownOption(regionFieldVal);
            await createKnowledgePage.selectSiteDropDownOption(siteFieldVal);
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await createKnowledgePage.clickOnviewArticleLinkButton();
            await utilCommon.switchToNewWidnow(1);
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            expect(await editKnowledgePo.getRegionSelectedValue(regionField)).toBe(regionFieldVal);
            expect(await editKnowledgePo.getSiteSelectedValue(siteField)).toBe(siteFieldVal);
            await editKnowledgePo.selectRegionDropDownOption(regionFieldVal2);
            await editKnowledgePo.selectSiteDropDownOption(siteFieldVal1);
            await editKnowledgePo.saveKnowledgeMedataDataChanges();
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();

            //Login with Knowledge Candidate
            await loginPage.login(knowledgeCandidateUser);
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            await utilCommon.waitUntilSpinnerToHide();
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate(knowledgeData.TemplateName);
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeData.KnowledgeTitle);
            await createKnowledgePage.selectKnowledgeSet(knowledgeData.KnowledgeSet);
            await createKnowledgePage.clickAssignToMeButton();
            await createKnowledgePage.selectRegionDropDownOption(regionFieldVal);
            await createKnowledgePage.selectSiteDropDownOption(siteFieldVal);
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await createKnowledgePage.clickOnviewArticleLinkButton();
            await utilCommon.switchToNewWidnow(2);
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            expect(await editKnowledgePo.getRegionSelectedValue(regionField)).toBe(regionFieldVal);
            expect(await editKnowledgePo.getSiteSelectedValue(siteField)).toBe(siteFieldVal);
            await editKnowledgePo.selectRegionDropDownOption(regionFieldVal2);
            await editKnowledgePo.selectSiteDropDownOption(siteFieldVal1);
            await editKnowledgePo.saveKnowledgeMedataDataChanges();
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();

            //Login with Knowledge Contributor
            await loginPage.login(knowledgeContributorUser);
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            await utilCommon.waitUntilSpinnerToHide();
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate(knowledgeData.TemplateName);
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeData.KnowledgeTitle);
            await createKnowledgePage.selectKnowledgeSet(knowledgeData.KnowledgeSet);
            await createKnowledgePage.clickAssignToMeButton();
            await createKnowledgePage.selectRegionDropDownOption(regionFieldVal);
            await createKnowledgePage.selectSiteDropDownOption(siteFieldVal);
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await createKnowledgePage.clickOnviewArticleLinkButton();
            await utilCommon.switchToNewWidnow(2);
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            expect(await editKnowledgePo.getRegionSelectedValue(regionField)).toBe(regionFieldVal);
            expect(await editKnowledgePo.getSiteSelectedValue(siteField)).toBe(siteFieldVal);
            await editKnowledgePo.selectRegionDropDownOption(regionFieldVal2);
            await editKnowledgePo.selectSiteDropDownOption(siteFieldVal1);
            await editKnowledgePo.saveKnowledgeMedataDataChanges();
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();

            //Login with Knowledge Publisher
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            await utilCommon.waitUntilSpinnerToHide();
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate(knowledgeData.TemplateName);
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeData.KnowledgeTitle);
            await createKnowledgePage.selectKnowledgeSet(knowledgeData.KnowledgeSet);
            await createKnowledgePage.clickAssignToMeButton();
            await createKnowledgePage.selectRegionDropDownOption(regionFieldVal);
            await createKnowledgePage.selectSiteDropDownOption(siteFieldVal);
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await createKnowledgePage.clickOnviewArticleLinkButton();
            await utilCommon.switchToNewWidnow(2);
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            expect(await editKnowledgePo.getRegionSelectedValue(regionField)).toBe(regionFieldVal);
            expect(await editKnowledgePo.getSiteSelectedValue(siteField)).toBe(siteFieldVal);
            await editKnowledgePo.selectRegionDropDownOption(regionFieldVal2);
            await editKnowledgePo.selectSiteDropDownOption(siteFieldVal1);
            await editKnowledgePo.saveKnowledgeMedataDataChanges();
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();

            //Login with Knowledge Coach
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            await utilCommon.waitUntilSpinnerToHide();
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate(knowledgeData.TemplateName);
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeData.KnowledgeTitle);
            await createKnowledgePage.selectKnowledgeSet(knowledgeData.KnowledgeSet);
            await createKnowledgePage.clickAssignToMeButton();
            await createKnowledgePage.selectRegionDropDownOption(regionFieldVal);
            await createKnowledgePage.selectSiteDropDownOption(siteFieldVal);
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await createKnowledgePage.clickOnviewArticleLinkButton();
            await utilCommon.switchToNewWidnow(2);
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            expect(await editKnowledgePo.getRegionSelectedValue(regionField)).toBe(regionFieldVal);
            expect(await editKnowledgePo.getSiteSelectedValue(siteField)).toBe(siteFieldVal);
            await editKnowledgePo.selectRegionDropDownOption(regionFieldVal2);
            await editKnowledgePo.selectSiteDropDownOption(siteFieldVal1);
            await editKnowledgePo.saveKnowledgeMedataDataChanges();
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
    }, 600 * 1000);

    it('[DRDMV-19574]:Verify the Save functionality of Region and Site fields on Document Library Create / Edit screen', async () => {
        try {
            await apiHelper.apiLogin('tadmin');
            var caseAgentuserData = {
                "firstName": "caseAgent",
                "lastName": "user",
                "userId": "caseAgent",
                "userPermission": "AGGAA5V0GE9Z4AOR0BXUOQ3ZT04EJA;AGGAA5V0GEON8AOZHHGIOY0UZNXGOR;AGGADG1AAO0VGAP8SXEGP7VU2U4ZS8",
            }
            var caseManageruserData = {
                "firstName": "caseManager",
                "lastName": "user",
                "userId": "caseManager",
                "userPermission": "AGGAA5V0GE9Z4AOR7CWOOQLASE4PHJ;AGGAA5V0GEON8AOZHHGIOY0UZNXGOR;AGGADG1AAO0VGAP8SXEGP7VU2U4ZS8",
            }

            await apiHelper.createNewUser(caseAgentuserData);
            await apiHelper.associatePersonToCompany(caseAgentuserData.userId, "Petramco");

            await apiHelper.createNewUser(caseManageruserData);
            await apiHelper.associatePersonToCompany(caseManageruserData.userId, "Petramco");

            //Create a document library
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Document Management--Library', 'Document Library Console - Business Workflows'))
                .toEqual('Document Library Console - Business Workflows');
            await createDocumentLibraryPage.openAddNewDocumentBlade();
            await createDocumentLibraryPage.addAttachment(filePath);
            let title = `Document-${new Date().valueOf()}`;
            await createDocumentLibraryPage.setTitle(title);
            await createDocumentLibraryPage.selectCompany(companyStr);
            await createDocumentLibraryPage.selectOwnerGroup(ownerSupportGroup);
            await createDocumentLibraryPage.selectRegion(regionFieldVal);
            await createDocumentLibraryPage.selectSite(siteFieldVal);
            await createDocumentLibraryPage.saveNewDocument();
            await utilGrid.searchOnGridConsole(title);
            await createDocumentLibraryPage.clickOnSelectedGridRecord(documentLibraryColumnHeader);
            expect(await editDocumentLibraryPo.getRegionSelectedValue(regionField)).toBe(regionFieldVal);
            expect(await editDocumentLibraryPo.getSiteSelectedValue(siteField)).toBe(siteFieldVal);
            await createDocumentLibraryPage.selectRegion(regionFieldVal2);
            await createDocumentLibraryPage.selectSite(siteFieldVal1);
            await createDocumentLibraryPage.selectStatus(documentLibraryStatus);
            await createDocumentLibraryPage.saveUpdatedDocument();
            await navigationPage.signOut();

            //Login with Case Manager
            await loginPage.login(caseManageruserData.userId);
            //Create a document library
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Document Management--Library', 'Document Library Console - Business Workflows'))
                .toEqual('Document Library Console - Business Workflows');
            await createDocumentLibraryPage.openAddNewDocumentBlade();
            await createDocumentLibraryPage.addAttachment(filePath);
            title = `Document-${new Date().valueOf()}`;
            await createDocumentLibraryPage.setTitle(title);
            await createDocumentLibraryPage.selectCompany(companyStr);
            await createDocumentLibraryPage.selectOwnerGroup(ownerSupportGroup);
            await createDocumentLibraryPage.selectRegion(regionFieldVal);
            await createDocumentLibraryPage.selectSite(siteFieldVal);
            await createDocumentLibraryPage.saveNewDocument();
            await utilGrid.searchOnGridConsole(title);
            await createDocumentLibraryPage.clickOnSelectedGridRecord(documentLibraryColumnHeader);
            expect(await editDocumentLibraryPo.getRegionSelectedValue(regionField)).toBe(regionFieldVal);
            expect(await editDocumentLibraryPo.getSiteSelectedValue(siteField)).toBe(siteFieldVal);
            await createDocumentLibraryPage.selectRegion(regionFieldVal2);
            await createDocumentLibraryPage.selectSite(siteFieldVal1);
            await createDocumentLibraryPage.selectStatus(documentLibraryStatus);
            await createDocumentLibraryPage.saveUpdatedDocument();
            await navigationPage.signOut();

            //Login with Case Agent
            await loginPage.login(caseAgentuserData.userId);
            //Create a document library
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Document Management--Library', 'Document Library Console - Business Workflows'))
                .toEqual('Document Library Console - Business Workflows');
            await createDocumentLibraryPage.openAddNewDocumentBlade();
            await createDocumentLibraryPage.addAttachment(filePath);
            title = `Document-${new Date().valueOf()}`;
            await createDocumentLibraryPage.setTitle(title);
            await createDocumentLibraryPage.selectCompany(companyStr);
            await createDocumentLibraryPage.selectOwnerGroup(ownerSupportGroup);
            await createDocumentLibraryPage.selectRegion(regionFieldVal);
            await createDocumentLibraryPage.selectSite(siteFieldVal);
            await createDocumentLibraryPage.saveNewDocument();
            await utilGrid.searchOnGridConsole(title);
            await createDocumentLibraryPage.clickOnSelectedGridRecord(documentLibraryColumnHeader);
            expect(await editDocumentLibraryPo.getRegionSelectedValue(regionField)).toBe(regionFieldVal);
            expect(await editDocumentLibraryPo.getSiteSelectedValue(siteField)).toBe(siteFieldVal);
            await createDocumentLibraryPage.selectRegion(regionFieldVal2);
            await createDocumentLibraryPage.selectSite(siteFieldVal1);
            await createDocumentLibraryPage.selectStatus(documentLibraryStatus);
            await createDocumentLibraryPage.saveUpdatedDocument();
            await navigationPage.signOut();
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
    }, 600 * 1000);

    it('[DRDMV-19575]:Verify the search functionality of Document library console for Region', async () => {
        try {
            await apiHelper.apiLogin('tadmin');
            var regionFields: string[] = ["Region"];
            var siteFields: string[] = ["Site"];

            var caseAgentuserData = {
                "firstName": "caseAgent",
                "lastName": "user",
                "userId": "caseAgent",
                "userPermission": "AGGAA5V0GE9Z4AOR0BXUOQ3ZT04EJA;AGGAA5V0GEON8AOZHHGIOY0UZNXGOR;AGGADG1AAO0VGAP8SXEGP7VU2U4ZS8",
            }
            var caseManageruserData = {
                "firstName": "caseManager",
                "lastName": "user",
                "userId": "caseManager",
                "userPermission": "AGGAA5V0GE9Z4AOR7CWOOQLASE4PHJ;AGGAA5V0GEON8AOZHHGIOY0UZNXGOR;AGGADG1AAO0VGAP8SXEGP7VU2U4ZS8",
            }
            await apiHelper.createNewUser(caseAgentuserData);
            await apiHelper.associatePersonToCompany(caseAgentuserData.userId, "Petramco");

            await apiHelper.createNewUser(caseManageruserData);
            await apiHelper.associatePersonToCompany(caseManageruserData.userId, "Petramco");

            //*Create a document library
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Document Management--Library', 'Document Library Console - Business Workflows'))
                .toEqual('Document Library Console - Business Workflows');
            await createDocumentLibraryPage.openAddNewDocumentBlade();
            await createDocumentLibraryPage.addAttachment(filePath);
            let title = `Document-${new Date().valueOf()}`;
            await createDocumentLibraryPage.setTitle(title);
            await createDocumentLibraryPage.selectCompany(companyStr);
            await createDocumentLibraryPage.selectOwnerGroup(ownerSupportGroup);
            await createDocumentLibraryPage.selectRegion(regionFieldVal);
            await createDocumentLibraryPage.selectSite(siteFieldVal);
            await createDocumentLibraryPage.saveNewDocument();

            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Document Management--Library', 'Document Library Console - Business Workflows'))
                .toEqual('Document Library Console - Business Workflows');
            await documentLibraryPage.addColumnOnGrid(regionFields);
            await utilGrid.searchOnGridConsole(regionFieldVal);
            let regionVal = await documentLibraryPage.getSelectedGridRecordValue(regionField);
            console.log(regionVal);
            expect(regionVal).toEqual(regionFieldVal);
            await documentLibraryPage.removeColumnOnGrid(regionFields);
            await utilGrid.searchOnGridConsole(regionFieldVal);
            regionVal = await documentLibraryPage.getSelectedGridRecordValue(regionField);
            expect(regionVal).toEqual(emptyStr);
            await navigationPage.signOut();

            //Login with Case Manager
            await loginPage.login(caseManageruserData.userId);
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Document Management--Library', 'Document Library Console - Business Workflows'))
                .toEqual('Document Library Console - Business Workflows');
            await documentLibraryPage.addColumnOnGrid(regionFields);
            await utilGrid.searchOnGridConsole(regionFieldVal);
            regionVal = await documentLibraryPage.getSelectedGridRecordValue(regionField);
            expect(regionVal).toEqual(regionFieldVal);

            await documentLibraryPage.removeColumnOnGrid(regionFields);
            await utilGrid.searchOnGridConsole(regionFieldVal);
            regionVal = await documentLibraryPage.getSelectedGridRecordValue(regionField);
            expect(regionVal).toEqual(emptyStr);
            await navigationPage.signOut();

            //Login with Case Agent
            await loginPage.login(caseAgentuserData.userId);
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Document Management--Library', 'Document Library Console - Business Workflows'))
                .toEqual('Document Library Console - Business Workflows');
            await documentLibraryPage.addColumnOnGrid(regionFields);
            await utilGrid.searchOnGridConsole(regionFieldVal);
            regionVal = await documentLibraryPage.getSelectedGridRecordValue(regionField);
            expect(regionVal).toEqual(regionFieldVal);

            await documentLibraryPage.removeColumnOnGrid(regionFields);
            await utilGrid.searchOnGridConsole(regionFieldVal);
            regionVal = await documentLibraryPage.getSelectedGridRecordValue(regionField);
            expect(regionVal).toEqual(emptyStr);
            await navigationPage.signOut();
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
    }, 420 * 1000);

    it('[DRDMV-19573]:Verify the document search based on Region and Site from attachments', async () => {
        try {
            let caseSummary = `Case for Document Search-${new Date().valueOf()}`;

            //Create a document library
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Document Management--Library', 'Document Library Console - Business Workflows'))
                .toEqual('Document Library Console - Business Workflows');
            await createDocumentLibraryPage.openAddNewDocumentBlade();
            await createDocumentLibraryPage.addAttachment(filePath);
            let title = `Document-${new Date().valueOf()}`;
            await createDocumentLibraryPage.setTitle(title);
            await createDocumentLibraryPage.selectCompany(companyStr);
            await createDocumentLibraryPage.selectOwnerGroup(ownerSupportGroup);
            await createDocumentLibraryPage.selectRegion(regionFieldVal);
            await createDocumentLibraryPage.selectSite(siteFieldVal);
            await createDocumentLibraryPage.saveNewDocument();
            await utilGrid.searchOnGridConsole(title);
            await createDocumentLibraryPage.clickOnSelectedGridRecord(documentLibraryColumnHeader);
            expect(await editDocumentLibraryPo.getRegionSelectedValue(regionField)).toBe(regionFieldVal);
            expect(await editDocumentLibraryPo.getSiteSelectedValue(siteField)).toBe(siteFieldVal);
            await createDocumentLibraryPage.selectStatus(documentLibraryStatus);
            await createDocumentLibraryPage.saveUpdatedDocument();
            await browser.sleep(30000);

            //Navigate to Create case
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary(caseSummary);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await activityTabPo.clickActivityNoteTextBox();
            await activityTabPo.clickOnAttachLink();
            await resources.clickOnAdvancedSearchOptions(documentLibraryStr);
            await resources.enterAdvancedSearchText(title);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(documentLibraryStr)).toEqual(title);
            await resources.enterAdvancedSearchText(title);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(documentLibraryStr)).toEqual(title);

            await viewCasePage.clickOnEmailLink();
            await composeMailPo.clickOnAttachmentLink();
            await resources.enterAdvancedSearchText(title);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(documentLibraryStr)).toEqual(title);
            await resources.enterAdvancedSearchText(title);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(documentLibraryStr)).toEqual(title);
            await navigationPage.signOut();

            //Navigate to Create case
            await loginPage.login(caseManagerUser);
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary(caseSummary);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await activityTabPo.clickActivityNoteTextBox();
            await activityTabPo.clickOnAttachLink();
            await resources.clickOnAdvancedSearchOptions(documentLibraryStr);
            await resources.enterAdvancedSearchText(title);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(documentLibraryStr)).toEqual(title);
            await resources.enterAdvancedSearchText(title);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(documentLibraryStr)).toEqual(title);

            await viewCasePage.clickOnEmailLink();
            await composeMailPo.clickOnAttachmentLink();
            await resources.enterAdvancedSearchText(title);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(documentLibraryStr)).toEqual(title);
            await resources.enterAdvancedSearchText(title);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(documentLibraryStr)).toEqual(title);
            await navigationPage.signOut();

            //Navigate to Create case
            await loginPage.login(caseAgentUser);
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary(caseSummary);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await activityTabPo.clickActivityNoteTextBox();
            await activityTabPo.clickOnAttachLink();
            await resources.clickOnAdvancedSearchOptions(documentLibraryStr);
            await resources.enterAdvancedSearchText(title);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(documentLibraryStr)).toEqual(title);
            await resources.enterAdvancedSearchText(title);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(documentLibraryStr)).toEqual(title);

            await viewCasePage.clickOnEmailLink();
            await composeMailPo.clickOnAttachmentLink();
            await resources.enterAdvancedSearchText(title);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(documentLibraryStr)).toEqual(title);
            await resources.enterAdvancedSearchText(title);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(documentLibraryStr)).toEqual(title);
            await navigationPage.signOut();
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
    }, 540 * 1000);

    it('[DRDMV-19572]:Verify the knowledge articles search based on Region and Site on Quick case / Create case', async () => {
        try {
            await navigationPage.gotoQuickCase();
            await quickCase.selectRequesterName(caseAgentUser);
            await quickCase.setCaseSummary(articleInDraftStatus);
            //Search with knowledge article with draft status
            await resources.clickOnAdvancedSearchOptions(RecommendedKnowledgeStr);
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(RecommendedKnowledgeStr)).toEqual(articleInDraftStatus);
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(RecommendedKnowledgeStr)).toEqual(articleInDraftStatus);

            //Search with knowledge article with SMEReview status
            await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
            await resources.clickOnAdvancedSearchOptions(RecommendedKnowledgeStr);
            await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(RecommendedKnowledgeStr)).toEqual(articleInSMEReviewStatus);
            await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(RecommendedKnowledgeStr)).toEqual(articleInSMEReviewStatus);

            //Search with knowledge article with Published status
            await resources.enterAdvancedSearchText(articleInPublishedStatus);
            await resources.clickOnAdvancedSearchOptions(RecommendedKnowledgeStr);
            await resources.enterAdvancedSearchText(articleInPublishedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(RecommendedKnowledgeStr)).toEqual(articleInPublishedStatus);
            await resources.enterAdvancedSearchText(articleInPublishedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(RecommendedKnowledgeStr)).toEqual(articleInPublishedStatus);

            //Search with knowledge article with Retired status
            await resources.enterAdvancedSearchText(articleInRetiredStatus);
            await resources.clickOnAdvancedSearchOptions(RecommendedKnowledgeStr);
            await resources.enterAdvancedSearchText(articleInRetiredStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(RecommendedKnowledgeStr)).toEqual(articleInRetiredStatus);
            await resources.enterAdvancedSearchText(articleInRetiredStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(RecommendedKnowledgeStr)).toEqual(articleInRetiredStatus);

            //Search with knowledge article with Closed status
            await resources.enterAdvancedSearchText(articleInClosedStatus);
            await resources.clickOnAdvancedSearchOptions(RecommendedKnowledgeStr);
            await resources.enterAdvancedSearchText(articleInClosedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(RecommendedKnowledgeStr)).toEqual(articleInClosedStatus);
            await resources.enterAdvancedSearchText(articleInClosedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(RecommendedKnowledgeStr)).toEqual(articleInClosedStatus);

            //Search with knowledge article with Canceled status
            await resources.enterAdvancedSearchText(articleInCanceledStatus);
            await resources.clickOnAdvancedSearchOptions(RecommendedKnowledgeStr);
            await resources.enterAdvancedSearchText(articleInCanceledStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(RecommendedKnowledgeStr)).toEqual(articleInCanceledStatus);
            await resources.enterAdvancedSearchText(articleInCanceledStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(RecommendedKnowledgeStr)).toEqual(articleInCanceledStatus);

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
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInDraftStatus);
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInDraftStatus);

            //Search with knowledge article with SMEReview status
            await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInSMEReviewStatus);
            await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInSMEReviewStatus);

            //Search with knowledge article with Published status
            await resources.enterAdvancedSearchText(articleInPublishedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInPublishedStatus);
            await resources.enterAdvancedSearchText(articleInPublishedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInPublishedStatus);

            //Search with knowledge article with Retired status
            await resources.enterAdvancedSearchText(articleInRetiredStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInRetiredStatus);
            await resources.enterAdvancedSearchText(articleInRetiredStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInRetiredStatus);

            //Search with knowledge article with Closed status
            await resources.enterAdvancedSearchText(articleInClosedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInClosedStatus);
            await resources.enterAdvancedSearchText(articleInClosedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInClosedStatus);

            //Search with knowledge article with Canceled status
            await resources.enterAdvancedSearchText(articleInCanceledStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInCanceledStatus);
            await resources.enterAdvancedSearchText(articleInCanceledStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
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
            await resources.clickOnAdvancedSearchOptions(RecommendedKnowledgeStr);
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(RecommendedKnowledgeStr)).toEqual(articleInDraftStatus);
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(RecommendedKnowledgeStr)).toEqual(articleInDraftStatus);

            //Search with knowledge article with SMEReview status
            await resources.clickOnAdvancedSearchOptions(RecommendedKnowledgeStr);
            await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(RecommendedKnowledgeStr)).toEqual(articleInSMEReviewStatus);
            await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(RecommendedKnowledgeStr)).toEqual(articleInSMEReviewStatus);

            //Search with knowledge article with Published status
            await resources.clickOnAdvancedSearchOptions(RecommendedKnowledgeStr);
            await resources.enterAdvancedSearchText(articleInPublishedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(RecommendedKnowledgeStr)).toEqual(articleInPublishedStatus);
            await resources.enterAdvancedSearchText(articleInPublishedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(RecommendedKnowledgeStr)).toEqual(articleInPublishedStatus);

            //Search with knowledge article with Retired status
            await resources.clickOnAdvancedSearchOptions(RecommendedKnowledgeStr);
            await resources.enterAdvancedSearchText(articleInRetiredStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(RecommendedKnowledgeStr)).toEqual(articleInRetiredStatus);
            await resources.enterAdvancedSearchText(articleInRetiredStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(RecommendedKnowledgeStr)).toEqual(articleInRetiredStatus);

            //Search with knowledge article with Closed status
            await resources.clickOnAdvancedSearchOptions(RecommendedKnowledgeStr);
            await resources.enterAdvancedSearchText(articleInClosedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(RecommendedKnowledgeStr)).toEqual(articleInClosedStatus);
            await resources.enterAdvancedSearchText(articleInClosedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(RecommendedKnowledgeStr)).toEqual(articleInClosedStatus);

            //Search with knowledge article with Canceled status
            await resources.clickOnAdvancedSearchOptions(RecommendedKnowledgeStr);
            await resources.enterAdvancedSearchText(articleInCanceledStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(RecommendedKnowledgeStr)).toEqual(articleInCanceledStatus);
            await resources.enterAdvancedSearchText(articleInCanceledStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(RecommendedKnowledgeStr)).toEqual(articleInCanceledStatus);

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
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInDraftStatus);
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInDraftStatus);

            //Search with knowledge article with SMEReview status
            await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInSMEReviewStatus);
            await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInSMEReviewStatus);

            //Search with knowledge article with Published status
            await resources.enterAdvancedSearchText(articleInPublishedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInPublishedStatus);
            await resources.enterAdvancedSearchText(articleInPublishedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInPublishedStatus);

            //Search with knowledge article with Retired status
            await resources.enterAdvancedSearchText(articleInRetiredStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInRetiredStatus);
            await resources.enterAdvancedSearchText(articleInRetiredStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInRetiredStatus);

            //Search with knowledge article with Closed status
            await resources.enterAdvancedSearchText(articleInClosedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInClosedStatus);
            await resources.enterAdvancedSearchText(articleInClosedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInClosedStatus);

            //Search with knowledge article with Canceled status
            await resources.enterAdvancedSearchText(articleInCanceledStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInCanceledStatus);
            await resources.enterAdvancedSearchText(articleInCanceledStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInCanceledStatus);
            await navigationPage.signOut();

            //Login as Case Agent
            await loginPage.login(caseManagerUser);
            await navigationPage.gotoQuickCase();
            await quickCase.selectRequesterName(caseAgentUser);
            await quickCase.setCaseSummary(articleInDraftStatus);
            //Search with knowledge article with draft status
            await resources.clickOnAdvancedSearchOptions(RecommendedKnowledgeStr);
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(RecommendedKnowledgeStr)).toEqual(articleInDraftStatus);
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(RecommendedKnowledgeStr)).toEqual(articleInDraftStatus);

            //Search with knowledge article with SMEReview status
            await resources.clickOnAdvancedSearchOptions(RecommendedKnowledgeStr);
            await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(RecommendedKnowledgeStr)).toEqual(articleInSMEReviewStatus);
            await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(RecommendedKnowledgeStr)).toEqual(articleInSMEReviewStatus);

            //Search with knowledge article with Published status
            await resources.clickOnAdvancedSearchOptions(RecommendedKnowledgeStr);
            await resources.enterAdvancedSearchText(articleInPublishedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(RecommendedKnowledgeStr)).toEqual(articleInPublishedStatus);
            await resources.enterAdvancedSearchText(articleInPublishedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(RecommendedKnowledgeStr)).toEqual(articleInPublishedStatus);

            //Search with knowledge article with Retired status
            await resources.clickOnAdvancedSearchOptions(RecommendedKnowledgeStr);
            await resources.enterAdvancedSearchText(articleInRetiredStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(RecommendedKnowledgeStr)).toEqual(articleInRetiredStatus);
            await resources.enterAdvancedSearchText(articleInRetiredStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(RecommendedKnowledgeStr)).toEqual(articleInRetiredStatus);

            //Search with knowledge article with Closed status
            await resources.clickOnAdvancedSearchOptions(RecommendedKnowledgeStr);
            await resources.enterAdvancedSearchText(articleInClosedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(RecommendedKnowledgeStr)).toEqual(articleInClosedStatus);
            await resources.enterAdvancedSearchText(articleInClosedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(RecommendedKnowledgeStr)).toEqual(articleInClosedStatus);

            //Search with knowledge article with Canceled status
            await resources.clickOnAdvancedSearchOptions(RecommendedKnowledgeStr);
            await resources.enterAdvancedSearchText(articleInCanceledStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(RecommendedKnowledgeStr)).toEqual(articleInCanceledStatus);
            await resources.enterAdvancedSearchText(articleInCanceledStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(RecommendedKnowledgeStr)).toEqual(articleInCanceledStatus);

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
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInDraftStatus);
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInDraftStatus);

            //Search with knowledge article with SMEReview status
            await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInSMEReviewStatus);
            await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInSMEReviewStatus);

            //Search with knowledge article with Published status
            await resources.enterAdvancedSearchText(articleInPublishedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInPublishedStatus);
            await resources.enterAdvancedSearchText(articleInPublishedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInPublishedStatus);

            //Search with knowledge article with Retired status
            await resources.enterAdvancedSearchText(articleInRetiredStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInRetiredStatus);
            await resources.enterAdvancedSearchText(articleInRetiredStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInRetiredStatus);

            //Search with knowledge article with Closed status
            await resources.enterAdvancedSearchText(articleInClosedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInClosedStatus);
            await resources.enterAdvancedSearchText(articleInClosedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInClosedStatus);

            //Search with knowledge article with Canceled status
            await resources.enterAdvancedSearchText(articleInCanceledStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInCanceledStatus);
            await resources.enterAdvancedSearchText(articleInCanceledStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInCanceledStatus);
            await navigationPage.signOut();
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
    }, 900 * 1000);
})