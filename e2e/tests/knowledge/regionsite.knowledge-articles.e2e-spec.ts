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
import documentLibraryPage from '../../pageobject/settings/document-management/document-library-console.po';
import createDocumentLibraryPage from '../../pageobject/settings/document-management/create-document-library.po';
import utilGrid from "../../utils/util.grid";
import viewCasePage from "../../pageobject/case/view-case.po";
import createKnowledgePage from "../../pageobject/knowledge/create-knowlege.po";
import { Knowledge } from '../../api/constant.api';
import activityTabPo from '../../pageobject/social/activity-tab.po';
import composeMailPo from '../../pageobject/email/compose-mail.po';
import editKnowledgePo from '../../pageobject/knowledge/edit-knowledge.po';
import editDocumentLibraryPo from '../../pageobject/settings/document-management/edit-document-library.po';

var caseBAUser = 'qkatawazi';
var caseAgentUser = 'qtao';
var caseManagerUser = 'qdu';
var knowledgeCandidateUser = 'kayo';
var knowledgeContributorUser = 'kkohri';
var knowledgePublisherUser = 'kmills';
var knowledgeCoachUser = 'kWilliamson';
var emptyStr = '';
var articleInDraftStatus = 'Knowledge Article_Draft';
var articleInSMEReviewStatus = 'Knowledge Article_SMEReview';
var articleInPublishedStatus = 'Knowledge Article_Published';
var articleInRetiredStatus = 'Knowledge Article_Retired';
var articleInClosedStatus = 'Knowledge Article_Closed';
var articleInCanceledStatus = 'Knowledge Article_Canceled';
var regionField = "Region";
var siteField = "Site";
var regionFieldVal = "Australia";
var siteFieldVal = "Canberra";
var siteFieldVal2 = "Athens";
var regionFieldVal2 = "Central America";
var siteFieldVal1 = "Mexico City";
var knowledgeManagementApp = "Knowledge Management";
var companyStr = "Petramco";
var ownerSupportGroup = "Compensation and Benefits";
var documentLibraryColumnHeader = "Title";
var applyBtn = "Apply";
var documentLibraryStr = "Document Library ";
var RecommendedKnowledgeStr = "Recommended Knowledge ";
var successMsg = "Saved successfully.";
var documentLibraryStatus = "Published";
var knowledgeArticlesStr = "Knowledge Articles ";
var draftStatus = "Draft";
var inProgressStatus = "In Progress";
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

    it('DRDMV-19569,DRDMV-19570,DRDMV-19571:Verify the search functionality of knowledge articles console for Region', async () => {
        let regionFieldColumn:string[] = ["Region"];
        let knowledgeGridColumnFields:string[] = ["Article ID","Title","Knowledge Set","Status","Assignee","Company","Template Name","Reviewer","Modified By","Created Date","Modified Date","Flagged","Region"];
        let knowledgeGridColumnFieldsWithoutRegion:string[] = ["Article ID","Title","Knowledge Set","Status","Assignee","Company","Template Name","Reviewer","Modified By","Created Date","Modified Date","Flagged"];
        
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
        await navigationPage.signOut();
    }, 400 * 1000),

    it('DRDMV-19565,DRDMV-19567,DRDMV-19568:Verify the Save functionality of Region and Site fields on Knowledge Articles Create / Edit screen', async () => {
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
                await editKnowledgePo.editKnowledgeMedataData();
                expect(await editKnowledgePo.getRegionSelectedValue(regionField)).toBe(regionFieldVal);
                expect(await editKnowledgePo.getSiteSelectedValue(siteField)).toBe(siteFieldVal);
                await createKnowledgePage.selectRegionDropDownOption(regionFieldVal2);
                await createKnowledgePage.selectSiteDropDownOption(siteFieldVal1);
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
                await editKnowledgePo.editKnowledgeMedataData();
                expect(await editKnowledgePo.getRegionSelectedValue(regionField)).toBe(regionFieldVal);
                expect(await editKnowledgePo.getSiteSelectedValue(siteField)).toBe(siteFieldVal);
                await createKnowledgePage.selectRegionDropDownOption(regionFieldVal2);
                await createKnowledgePage.selectSiteDropDownOption(siteFieldVal1);
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
                await editKnowledgePo.editKnowledgeMedataData();
                expect(await editKnowledgePo.getRegionSelectedValue(regionField)).toBe(regionFieldVal);
                expect(await editKnowledgePo.getSiteSelectedValue(siteField)).toBe(siteFieldVal);
                await createKnowledgePage.selectRegionDropDownOption(regionFieldVal2);
                await createKnowledgePage.selectSiteDropDownOption(siteFieldVal1);
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
                await editKnowledgePo.editKnowledgeMedataData();
                expect(await editKnowledgePo.getRegionSelectedValue(regionField)).toBe(regionFieldVal);
                expect(await editKnowledgePo.getSiteSelectedValue(siteField)).toBe(siteFieldVal);
                await createKnowledgePage.selectRegionDropDownOption(regionFieldVal2);
                await createKnowledgePage.selectSiteDropDownOption(siteFieldVal1);
                await editKnowledgePo.saveKnowledgeMedataDataChanges();
                await utilCommon.switchToDefaultWindowClosingOtherTabs();
                await navigationPage.signOut();

                //Login with Knowledge Candidate
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
                await editKnowledgePo.editKnowledgeMedataData();
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
                await editKnowledgePo.editKnowledgeMedataData();
                expect(await editKnowledgePo.getRegionSelectedValue(regionField)).toBe(regionFieldVal);
                expect(await editKnowledgePo.getSiteSelectedValue(siteField)).toBe(siteFieldVal);
                await editKnowledgePo.selectRegionDropDownOption(regionFieldVal2);
                await editKnowledgePo.selectSiteDropDownOption(siteFieldVal1);
                await editKnowledgePo.saveKnowledgeMedataDataChanges();
                await utilCommon.switchToDefaultWindowClosingOtherTabs();
                await navigationPage.signOut();

                //Login with Knowledge Candidate
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
                await editKnowledgePo.editKnowledgeMedataData();
                expect(await editKnowledgePo.getRegionSelectedValue(regionField)).toBe(regionFieldVal);
                expect(await editKnowledgePo.getSiteSelectedValue(siteField)).toBe(siteFieldVal);
                await editKnowledgePo.selectRegionDropDownOption(regionFieldVal2);
                await editKnowledgePo.selectSiteDropDownOption(siteFieldVal1);
                await editKnowledgePo.saveKnowledgeMedataDataChanges();
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
            }
    }, 400 * 1000)

    it('DRDMV-19574:Verify the Save functionality of Region and Site fields on Document Library Create / Edit screen', async () => {
        await apiHelper.apiLogin('tadmin');
        var caseAgentuserData = {
            "firstName": "caseAgent",
            "lastName": "user",
            "userId": "caseAgent",
            "userPermission" : "AGGAA5V0GE9Z4AOR0BXUOQ3ZT04EJA;AGGAA5V0GEON8AOZHHGIOY0UZNXGOR;AGGADG1AAO0VGAP8SXEGP7VU2U4ZS8",
        }
        var caseManageruserData = {
            "firstName": "caseManager",
            "lastName": "user",
            "userId": "caseManager",
            "userPermission" : "AGGAA5V0GE9Z4AOR7CWOOQLASE4PHJ;AGGAA5V0GEON8AOZHHGIOY0UZNXGOR;AGGADG1AAO0VGAP8SXEGP7VU2U4ZS8",
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
    }, 400 * 1000)

    it('DRDMV-19575:Verify the search functionality of Document library console for Region', async () => {
        await apiHelper.apiLogin('tadmin');
        var regionFields:string[] = ["Region"];
        var siteFields:string[] = ["Site"];

        var caseAgentuserData = {
            "firstName": "caseAgent",
            "lastName": "user",
            "userId": "caseAgent",
            "userPermission" : "AGGAA5V0GE9Z4AOR0BXUOQ3ZT04EJA;AGGAA5V0GEON8AOZHHGIOY0UZNXGOR;AGGADG1AAO0VGAP8SXEGP7VU2U4ZS8",
        }
        var caseManageruserData = {
            "firstName": "caseManager",
            "lastName": "user",
            "userId": "caseManager",
            "userPermission" : "AGGAA5V0GE9Z4AOR7CWOOQLASE4PHJ;AGGAA5V0GEON8AOZHHGIOY0UZNXGOR;AGGADG1AAO0VGAP8SXEGP7VU2U4ZS8",
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
        await createDocumentLibraryPage.selectRegion( regionFieldVal);
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
    }, 400 * 1000)

    it('DRDMV-19573:Verify the document search based on Region and Site from attachments', async () => {
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
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary(caseSummary);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        await activityTabPo.clickActivityNoteTextBox();
        await activityTabPo.clickOnAttachLink();
        await resources.clickOnAdvancedSearchOptions(documentLibraryStr);
        await resources.enterAdvancedSearchText(title);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(title);
        await resources.enterAdvancedSearchText(title);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(title);

        await viewCasePage.clickOnEmailLink();
        await composeMailPo.clickOnAttachmentLink();
        await resources.enterAdvancedSearchText(title);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(title);
        await resources.enterAdvancedSearchText(title);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(title);
        await navigationPage.signOut();

        //Navigate to Create case
        await loginPage.login(caseManagerUser);
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary(caseSummary);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        await activityTabPo.clickActivityNoteTextBox();
        await activityTabPo.clickOnAttachLink();
        await resources.clickOnAdvancedSearchOptions(documentLibraryStr);
        await resources.enterAdvancedSearchText(title);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(title);
        await resources.enterAdvancedSearchText(title);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(title);

        await viewCasePage.clickOnEmailLink();
        await composeMailPo.clickOnAttachmentLink();
        await resources.enterAdvancedSearchText(title);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(title);
        await resources.enterAdvancedSearchText(title);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(title);
        await navigationPage.signOut();

        //Navigate to Create case
        await loginPage.login(caseAgentUser);
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary(caseSummary);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        await activityTabPo.clickActivityNoteTextBox();
        await activityTabPo.clickOnAttachLink();
        await resources.clickOnAdvancedSearchOptions(documentLibraryStr);
        await resources.enterAdvancedSearchText(title);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(title);
        await resources.enterAdvancedSearchText(title);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(title);

        await viewCasePage.clickOnEmailLink();
        await composeMailPo.clickOnAttachmentLink();
        await resources.enterAdvancedSearchText(title);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(title);
        await resources.enterAdvancedSearchText(title);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(title);
        await navigationPage.signOut();
    }, 400 * 1000)

    it('DRDMV-19572:Verify the knowledge articles search based on Region and Site on Quick case / Create case', async () => {
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
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInDraftStatus);
        await resources.enterAdvancedSearchText(articleInDraftStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInDraftStatus);

        //Search with knowledge article with SMEReview status
        await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
        await resources.clickOnAdvancedSearchOptions(RecommendedKnowledgeStr);
        await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInSMEReviewStatus);
        await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInSMEReviewStatus);

        //Search with knowledge article with Published status
        await resources.enterAdvancedSearchText(articleInPublishedStatus);
        await resources.clickOnAdvancedSearchOptions(RecommendedKnowledgeStr);
        await resources.enterAdvancedSearchText(articleInPublishedStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInPublishedStatus);
        await resources.enterAdvancedSearchText(articleInPublishedStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInPublishedStatus);

        //Search with knowledge article with Retired status
        await resources.enterAdvancedSearchText(articleInRetiredStatus);
        await resources.clickOnAdvancedSearchOptions(RecommendedKnowledgeStr);
        await resources.enterAdvancedSearchText(articleInRetiredStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInRetiredStatus);
        await resources.enterAdvancedSearchText(articleInRetiredStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInRetiredStatus);

        //Search with knowledge article with Closed status
        await resources.enterAdvancedSearchText(articleInClosedStatus);
        await resources.clickOnAdvancedSearchOptions(RecommendedKnowledgeStr);
        await resources.enterAdvancedSearchText(articleInClosedStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInClosedStatus);
        await resources.enterAdvancedSearchText(articleInClosedStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInClosedStatus);

        //Search with knowledge article with Canceled status
        await resources.enterAdvancedSearchText(articleInCanceledStatus);
        await resources.clickOnAdvancedSearchOptions(RecommendedKnowledgeStr);
        await resources.enterAdvancedSearchText(articleInCanceledStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInCanceledStatus);
        await resources.enterAdvancedSearchText(articleInCanceledStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
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
        await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInDraftStatus);
        await resources.enterAdvancedSearchText(articleInDraftStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInDraftStatus);

        //Search with knowledge article with SMEReview status
        await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInSMEReviewStatus);
        await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInSMEReviewStatus);

        //Search with knowledge article with Published status
        await resources.enterAdvancedSearchText(articleInPublishedStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInPublishedStatus);
        await resources.enterAdvancedSearchText(articleInPublishedStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInPublishedStatus);

        //Search with knowledge article with Retired status
        await resources.enterAdvancedSearchText(articleInRetiredStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInRetiredStatus);
        await resources.enterAdvancedSearchText(articleInRetiredStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInRetiredStatus);

        //Search with knowledge article with Closed status
        await resources.enterAdvancedSearchText(articleInClosedStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInClosedStatus);
        await resources.enterAdvancedSearchText(articleInClosedStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInClosedStatus);

        //Search with knowledge article with Canceled status
        await resources.enterAdvancedSearchText(articleInCanceledStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInCanceledStatus);
        await resources.enterAdvancedSearchText(articleInCanceledStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInCanceledStatus);
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
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInDraftStatus);
        await resources.enterAdvancedSearchText(articleInDraftStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInDraftStatus);

        //Search with knowledge article with SMEReview status
        await resources.clickOnAdvancedSearchOptions(RecommendedKnowledgeStr);
        await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInSMEReviewStatus);
        await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInSMEReviewStatus);

        //Search with knowledge article with Published status
        await resources.clickOnAdvancedSearchOptions(RecommendedKnowledgeStr);
        await resources.enterAdvancedSearchText(articleInPublishedStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInPublishedStatus);
        await resources.enterAdvancedSearchText(articleInPublishedStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInPublishedStatus);

        //Search with knowledge article with Retired status
        await resources.clickOnAdvancedSearchOptions(RecommendedKnowledgeStr);
        await resources.enterAdvancedSearchText(articleInRetiredStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInRetiredStatus);
        await resources.enterAdvancedSearchText(articleInRetiredStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInRetiredStatus);

        //Search with knowledge article with Closed status
        await resources.clickOnAdvancedSearchOptions(RecommendedKnowledgeStr);
        await resources.enterAdvancedSearchText(articleInClosedStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInClosedStatus);
        await resources.enterAdvancedSearchText(articleInClosedStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInClosedStatus);

        //Search with knowledge article with Canceled status
        await resources.clickOnAdvancedSearchOptions(RecommendedKnowledgeStr);
        await resources.enterAdvancedSearchText(articleInCanceledStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInCanceledStatus);
        await resources.enterAdvancedSearchText(articleInCanceledStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
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
        await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInDraftStatus);
        await resources.enterAdvancedSearchText(articleInDraftStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInDraftStatus);

        //Search with knowledge article with SMEReview status
        await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInSMEReviewStatus);
        await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInSMEReviewStatus);

        //Search with knowledge article with Published status
        await resources.enterAdvancedSearchText(articleInPublishedStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInPublishedStatus);
        await resources.enterAdvancedSearchText(articleInPublishedStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInPublishedStatus);

        //Search with knowledge article with Retired status
        await resources.enterAdvancedSearchText(articleInRetiredStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInRetiredStatus);
        await resources.enterAdvancedSearchText(articleInRetiredStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInRetiredStatus);

        //Search with knowledge article with Closed status
        await resources.enterAdvancedSearchText(articleInClosedStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInClosedStatus);
        await resources.enterAdvancedSearchText(articleInClosedStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInClosedStatus);

        //Search with knowledge article with Canceled status
        await resources.enterAdvancedSearchText(articleInCanceledStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInCanceledStatus);
        await resources.enterAdvancedSearchText(articleInCanceledStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInCanceledStatus);
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
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInDraftStatus);
        await resources.enterAdvancedSearchText(articleInDraftStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInDraftStatus);

        //Search with knowledge article with SMEReview status
        await resources.clickOnAdvancedSearchOptions(RecommendedKnowledgeStr);
        await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInSMEReviewStatus);
        await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInSMEReviewStatus);

        //Search with knowledge article with Published status
        await resources.clickOnAdvancedSearchOptions(RecommendedKnowledgeStr);
        await resources.enterAdvancedSearchText(articleInPublishedStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInPublishedStatus);
        await resources.enterAdvancedSearchText(articleInPublishedStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInPublishedStatus);

        //Search with knowledge article with Retired status
        await resources.clickOnAdvancedSearchOptions(RecommendedKnowledgeStr);
        await resources.enterAdvancedSearchText(articleInRetiredStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInRetiredStatus);
        await resources.enterAdvancedSearchText(articleInRetiredStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInRetiredStatus);

        //Search with knowledge article with Closed status
        await resources.clickOnAdvancedSearchOptions(RecommendedKnowledgeStr);
        await resources.enterAdvancedSearchText(articleInClosedStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInClosedStatus);
        await resources.enterAdvancedSearchText(articleInClosedStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInClosedStatus);

        //Search with knowledge article with Canceled status
        await resources.clickOnAdvancedSearchOptions(RecommendedKnowledgeStr);
        await resources.enterAdvancedSearchText(articleInCanceledStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInCanceledStatus);
        await resources.enterAdvancedSearchText(articleInCanceledStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
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
        await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInDraftStatus);
        await resources.enterAdvancedSearchText(articleInDraftStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInDraftStatus);

        //Search with knowledge article with SMEReview status
        await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInSMEReviewStatus);
        await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInSMEReviewStatus);

        //Search with knowledge article with Published status
        await resources.enterAdvancedSearchText(articleInPublishedStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInPublishedStatus);
        await resources.enterAdvancedSearchText(articleInPublishedStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInPublishedStatus);

        //Search with knowledge article with Retired status
        await resources.enterAdvancedSearchText(articleInRetiredStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInRetiredStatus);
        await resources.enterAdvancedSearchText(articleInRetiredStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInRetiredStatus);

        //Search with knowledge article with Closed status
        await resources.enterAdvancedSearchText(articleInClosedStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInClosedStatus);
        await resources.enterAdvancedSearchText(articleInClosedStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInClosedStatus);

        //Search with knowledge article with Canceled status
        await resources.enterAdvancedSearchText(articleInCanceledStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(regionField, regionFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInCanceledStatus);
        await resources.enterAdvancedSearchText(articleInCanceledStatus);
        await resources.clickOnAdvancedSearchSettingsIconToOpen();
        await resources.selectAdvancedSearchFilterOption(siteField, siteFieldVal);
        await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
        await resources.clickOnAdvancedSearchSettingsIconToClose();
        await expect(await resources.getAdvancedSearchResult()).toEqual(articleInCanceledStatus);
        await navigationPage.signOut();    }, 400 * 1000)


})