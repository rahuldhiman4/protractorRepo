import { browser } from "protractor";
import apiCoreUtil from '../../api/api.core.util';
import apiHelper from '../../api/api.helper';
import previewCasePo from '../../pageobject/case/case-preview.po';
import createCasePage from '../../pageobject/case/create-case.po';
import quickCase from '../../pageobject/case/quick-case.po';
import viewCasePage from "../../pageobject/case/view-case.po";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import resources from '../../pageobject/common/resources-tab.po';
import createKnowledgePage from "../../pageobject/knowledge/create-knowlege.po";
import knowledgeAccessPage from '../../pageobject/knowledge/knowledge-access-tab.po';
import editKnowledgePage from '../../pageobject/knowledge/edit-knowledge.po';
import flagUnflagKnowledgePo from '../../pageobject/knowledge/flag-unflag-knowledge.po';
import knowledgeConsole from '../../pageobject/knowledge/knowledge-articles-console.po';
import previewKnowledgePo from '../../pageobject/knowledge/preview-knowledge.po';
import reviewCommentsPo from '../../pageobject/knowledge/review-comments.po';
import statusBladeKnowledgeArticlePo from '../../pageobject/knowledge/status-blade-knowledge-article.po';
import viewKnowledgeArticlePo from '../../pageobject/knowledge/view-knowledge-article.po';
import activityTabPo from '../../pageobject/social/activity-tab.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from "../../utils/utility.grid";
import statusConfigPO from '../../pageobject/settings/common/status-config.po';
import changeAssignmentBlade from "../../pageobject/common/change-assignment-blade.po";

let caseBAUser = 'qkatawazi';
let caseAgentUser = 'qtao';
let caseManagerUser = 'qdu';
let knowledgeCandidateUser = 'kayo';
let knowledgeContributorUser = 'kkohri';
let knowledgePublisherUser = 'kmills';
let knowledgeCoachUser = 'kWilliamson';
let versionColumn = 'Version';
let knowledgeManagementApp = "Knowledge Management";
let knowledgeArticlesTitleStr = "Knowledge Articles";
let knowledgeArticlesStr = "Knowledge Articles ";
let applyBtn = "Apply";
let emptyStr = '';
let articleInDraftStatus = 'DRDMV-19004 KnowledgeArticle_Draft';
let minorEditOption = 'Minor Edit';
let majorEditOption = 'Major Edit';
let versionField = "Version";
let versionFieldVal = "1";
let RecommendedKnowledgeStr = "Recommended Knowledge ";
let resourcesTabStr = "Resources";
let activityTabStr = "Activity";

describe('Knowledge Articles - Versioning Tests', () => {
    const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
    const knowledgeSetTitleStr = 'versionedKnowledgeSet_' + randomStr;
    const knowledgeTemplateStr = 'VersionedArticleTemplate_' + randomStr;
    const attachmentFilePath = 'e2e/data/ui/attachment/articleStatus.png';
    const minorEditHelpText = `Submitting your changes will edit the existing Version 1`;
    const majorEditHelpText = `Submitting your changes will create Version 2`;

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login(caseBAUser);
        await apiHelper.apiLogin('dbomei');
        let knowledgeSetData = {
            knowledgeSetTitle: `${knowledgeSetTitleStr}`,
            knowledgeSetDesc: `${knowledgeSetTitleStr}_Desc`,
            company: 'Petramco'
        }
        let knowledgeArticleTemplateData = {
            templateName: `${knowledgeTemplateStr}`,
            company: "Petramco",
            knowledgeSetId: "AGGADGG8ECDC0AQGPUJ1QFRW9RZH4E",
            title: "articleSection"
        }
        let knowledgeSetDataPsilon = {
            knowledgeSetTitle: `${knowledgeSetTitleStr}`,
            knowledgeSetDesc: `${knowledgeSetTitleStr}_Desc`,
            company: 'Psilon'
        }
        await apiHelper.createKnowledgeSet(knowledgeSetDataPsilon);

        await apiHelper.apiLogin('elizabeth');
        let knowledgeSet = await apiHelper.createKnowledgeSet(knowledgeSetData);
        await apiHelper.createKnowledgeArticleTemplate(knowledgeSetData.knowledgeSetTitle, knowledgeSet.id, knowledgeArticleTemplateData);
    });

    afterEach(async () => {
        await utilityCommon.refresh();
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //skhobrag
    it('[DRDMV-20656]: Verify that the newly created article shows the article version', async () => {
        let knowledgeTitleStr = 'Versioning for article' + "_" + randomStr;
        let knowledgeRefStr = 'KnowledgeReference' + randomStr;
        await navigationPage.signOut();
        await loginPage.login('qtao');
        await navigationPage.gotoCreateKnowledge();
        await createKnowledgePage.clickOnTemplate('Reference');
        await createKnowledgePage.clickOnUseSelectedTemplateButton();
        await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeTitleStr);
        await createKnowledgePage.setReferenceValue(knowledgeRefStr)
        await createKnowledgePage.selectKnowledgeSet('HR');
        await createKnowledgePage.clickOnSaveKnowledgeButton();
        expect(await previewKnowledgePo.getKnowledgeArticleTitle()).toContain(knowledgeTitleStr, 'Article title not matched.');
        await previewKnowledgePo.clickGoToArticleButton();
        expect(await viewKnowledgeArticlePo.isEditLinkDisplayedOnKA()).toBeTruthy('Article view screen is not displayed');
        expect(await viewKnowledgeArticlePo.isArticleVersionDisplayed()).toBeTruthy('Article version on View knowledge article is not displayed');
        let actualVersion = await viewKnowledgeArticlePo.getArticleVersion();
        let actualDate = await viewKnowledgeArticlePo.formatDate();
        console.log(actualDate);
        let expectedVersion = "Version " + "1" + " - " + actualDate;
        expect(actualVersion).toBe(expectedVersion);
    });

    //skhobrag
    describe('[DRDMV-20742]: Verify the functionality of Edit article with Minor Edit button', () => {
        let knowledgeTitleStr = 'Versioning for article' + "_" + randomStr;
        let articleAccessPermission: string[] = ['GB Support 2', 'Petramco', 'Kane Williamson'];
        let articleAttachments = ['articleStatus.png'];
        let articleAccessPermissionUser: string[] = ['Kane Williamson'];
        let updatedArticleTitle = "updated article title" + "_" + randomStr;
        let updatedArticleDesc = "updated article description";
        let articleData = undefined;
        let articleHelpFulCounterData = {
            linkedCounter: 182,
            helpfulPercentage: 81,
            helpfulCounter: 110,
            viewCounter: 56,
            notHelpfulCounter: 12
        }
        let articleDetails = undefined;
        let expectedVersion = undefined;

        beforeAll(async () => {
            let knowledgeTemplateId = await apiCoreUtil.getKnowledgeTemplateGuid(knowledgeTemplateStr);
            await apiHelper.apiLogin(caseAgentUser);

            articleData = {
                "knowledgeSet": `${knowledgeSetTitleStr}`,
                "title": `${knowledgeTitleStr}`,
                "templateId": `${knowledgeTemplateId}`,
                "categoryTier1": "Applications",
                "categoryTier2": "Help Desk",
                "categoryTier3": "Incident",
                "region": "Australia",
                "site": "Canberra",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United Kingdom Support",
                "assigneeSupportGroup": "GB Support 2",
                "assignee": "KMills",
                "articleDesc": `${knowledgeTitleStr} Desc`
            }
            articleDetails = await apiHelper.createKnowledgeArticle(articleData, attachmentFilePath);
        });

        it('[DRDMV-20742]: Verify the functionality of Edit article with Minor Edit button', async () => {
            await navigationPage.signOut();
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            expect(await knowledgeConsole.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(articleDetails.displayId);
            expect(await viewKnowledgeArticlePo.isEditLinkDisplayedOnKA()).toBeTruthy('Article view screen is not displayed');
            expect(await viewKnowledgeArticlePo.isArticleVersionDisplayed()).toBeTruthy('Article version on View knowledge article is not displayed');
            let actualVersion = await viewKnowledgeArticlePo.getArticleVersion();
            let actualDate = await viewKnowledgeArticlePo.formatDate();
            expectedVersion = "Version " + "1" + " - " + actualDate;
            expect(actualVersion).toBe(expectedVersion);
            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(minorEditOption)).toBeFalsy('Minor Edit Option is displayed for In Progress Knowledge Article.');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(majorEditOption)).toBeFalsy('Major Edit Option is displayed for In Progress Knowledge Article.');
            await editKnowledgePage.clickArticleCancelButton();
            await utilCommon.clickOnWarningOk();
            await editKnowledgePage.setKnowledgeStatus('Draft');
            expect(await editKnowledgePage.getStatusValue()).toContain('Draft', 'Article is updated with Draft status.');
            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(minorEditOption)).toBeFalsy('Minor Edit Option is displayed for Draft Knowledge Article.');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(majorEditOption)).toBeFalsy('Major Edit Option is displayed for Draft Knowledge Article.');
            await editKnowledgePage.clickArticleCancelButton();
            await utilCommon.clickOnWarningOk();
            await statusBladeKnowledgeArticlePo.setKnowledgeStatusWithReviewerDetails('SME Review', 'Petramco', 'Australia Support', 'AU Support 3', 'Kane Williamson');
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
        });

        it('[DRDMV-20742]: Verify the functionality of Edit article with Minor Edit button', async () => {
            await navigationPage.signOut();
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            await browser.sleep(2000); //Hard wait to load the new tab properly
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(articleDetails.displayId);
            expect(await viewKnowledgeArticlePo.isReviewMessageDisplayed('Knowledge Article is in Review')).toBeTruthy();
            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(minorEditOption)).toBeFalsy('Minor Edit Option is displayed for SME Review Knowledge Article.');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(majorEditOption)).toBeFalsy('Major Edit Option is displayed for SME Review Knowledge Article.');
            await editKnowledgePage.clickArticleCancelButton();
            await utilCommon.clickOnWarningOk();
            await viewKnowledgeArticlePo.clickReviewPendingLink();
            await reviewCommentsPo.setTextInTellUsMore(articleDetails.displayId);
            await reviewCommentsPo.clickApprovedButton();
            await browser.sleep(2000); //Hard wait to load the tab properly
            await utilityCommon.refresh();
            await browser.sleep(2000); //Hard wait to load the tab properly
            expect(await editKnowledgePage.getStatusValue()).toContain('Published', 'Article is updated with Published status.');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.updateKnowledgeArticleViewAndHelpFulCounter(articleDetails.id, articleHelpFulCounterData);
            await utilityCommon.refresh();
            console.log(await viewKnowledgeArticlePo.getKnowledgeArticleTitle());
            console.log(await viewKnowledgeArticlePo.getKnowledgeArticleDescription());
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleTitle()).toBe(knowledgeTitleStr);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleDescription()).toBe(articleData.articleDesc);
            expect(await viewKnowledgeArticlePo.getKnowledgeSet()).toBe(knowledgeSetTitleStr);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleCompany()).toBe(articleData.assignedCompany);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleAuthor()).toBe('Qianru Tao');
            expect(await viewKnowledgeArticlePo.getCategoryTier1Value()).toBe(articleData.categoryTier1);
            expect(await viewKnowledgeArticlePo.getCategoryTier2Value()).toBe(articleData.categoryTier2);
            expect(await viewKnowledgeArticlePo.getCategoryTier3Value()).toBe(articleData.categoryTier3);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleAssigneeGroupValue()).toBe(articleData.assigneeSupportGroup);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleAccessPermissionGroupDetails()).toEqual(articleAccessPermission);
            expect(await viewKnowledgeArticlePo.getArticleViewCounter()).toContain(articleHelpFulCounterData.viewCounter.toString());
            expect(await viewKnowledgeArticlePo.getArticleHelpfulCounter()).toContain(articleHelpFulCounterData.helpfulPercentage.toString());
            expect(await viewKnowledgeArticlePo.getRegionValue()).toBe(articleData.region);
            expect(await viewKnowledgeArticlePo.getSiteValue()).toBe(articleData.site);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleLocalValue()).toBe('English');
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleAttachments()).toEqual(articleAttachments);
            expect(await viewKnowledgeArticlePo.getAssigneeValue()).toBe('Kyle Mills');
            expect(await viewKnowledgeArticlePo.getArticleReviewerUser()).toBe('Kane Williamson');
            expect(await viewKnowledgeArticlePo.getArticleReviewerGroup()).toBe('AU Support 3');
        });

        it('[DRDMV-20742]: Verify the functionality of Edit article with Minor Edit button', async () => {
            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(minorEditOption)).toBeTruthy('Minor Edit Option is displayed for Published Knowledge Article.');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(majorEditOption)).toBeTruthy('Major Edit Option is displayed for Published Knowledge Article.');
            await editKnowledgePage.selectArticleEditOption(minorEditOption);
            expect(await editKnowledgePage.getHelpTextForMinorEditOptionDisplayed()).toBe(minorEditHelpText);
            await editKnowledgePage.updateKnowledgeArticleTitle(updatedArticleTitle);
            await editKnowledgePage.updateKnowledgeArticleDescription(updatedArticleDesc);
            await editKnowledgePage.clickOnSaveButtonOfKA();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy();
            await utilityCommon.refresh();
            expect(await viewKnowledgeArticlePo.getArticleVersion()).toBe(expectedVersion);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleTitle()).toBe(updatedArticleTitle);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleDescription()).toBe(updatedArticleDesc);
            expect(await viewKnowledgeArticlePo.getKnowledgeSet()).toBe(knowledgeSetTitleStr);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleCompany()).toBe(articleData.assignedCompany);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleAuthor()).toBe('Qianru Tao');
            expect(await viewKnowledgeArticlePo.getCategoryTier1Value()).toBe(articleData.categoryTier1);
            expect(await viewKnowledgeArticlePo.getCategoryTier2Value()).toBe(articleData.categoryTier2);
            expect(await viewKnowledgeArticlePo.getCategoryTier3Value()).toBe(articleData.categoryTier3);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleAssigneeGroupValue()).toBe(articleData.assigneeSupportGroup);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleAccessPermissionGroupDetails()).toEqual(articleAccessPermission);
            expect(await viewKnowledgeArticlePo.getArticleViewCounter()).toContain(articleHelpFulCounterData.viewCounter.toString());
            expect(await viewKnowledgeArticlePo.getArticleHelpfulCounter()).toContain(articleHelpFulCounterData.helpfulPercentage.toString());
            expect(await viewKnowledgeArticlePo.getRegionValue()).toBe(articleData.region);
            expect(await viewKnowledgeArticlePo.getSiteValue()).toBe(articleData.site);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleLocalValue()).toBe('English');
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleAttachments()).toEqual(articleAttachments);
            expect(await viewKnowledgeArticlePo.getAssigneeValue()).toBe('Kyle Mills');
            expect(await viewKnowledgeArticlePo.getArticleReviewerUser()).toBe('Kane Williamson');
            expect(await viewKnowledgeArticlePo.getArticleReviewerGroup()).toBe('AU Support 3');
            expect(await viewKnowledgeArticlePo.getArticleLastReviewDate()).toBe(await viewKnowledgeArticlePo.getArticleLastReviewDate());
            expect(await viewKnowledgeArticlePo.getArticleNextReviewDate()).toBe(await viewKnowledgeArticlePo.getArticleNextReviewDate());
        });

        afterAll(async () => {
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        });

    });

    //skhobrag
    describe('[DRDMV-20746]: Verify the search based on version on knowledge article console', () => {
        let knowledgeTitleStr = 'Versioning for article' + "_" + randomStr;
        let versionFieldColumn: string[] = ["Version"];
        let knowledgeGridColumnFields: string[] = ["Article ID", "Title", "Knowledge Set", "Status", "Assignee", "Company", "Template Name", "Reviewer", "Modified By", "Created Date", "Modified Date", "Flagged", "Version"];
        let knowledgeGridColumnFieldsWithoutVersion: string[] = ["Article ID", "Title", "Knowledge Set", "Status", "Assignee", "Company", "Template Name", "Reviewer", "Modified By", "Created Date", "Modified Date", "Flagged"];
        let versionVal: string = undefined;

        beforeAll(async () => {
            await apiHelper.apiLogin(caseAgentUser);
            let knowledgeTemplateId = await apiCoreUtil.getKnowledgeTemplateGuid(knowledgeTemplateStr);
            let articleData = {
                "knowledgeSet": `${knowledgeSetTitleStr}`,
                "title": `${knowledgeTitleStr}`,
                "templateId": `${knowledgeTemplateId}`,
                "categoryTier1": "Applications",
                "categoryTier2": "Help Desk",
                "categoryTier3": "Incident",
                "region": "Australia",
                "site": "Canberra",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United Kingdom Support",
                "assigneeSupportGroup": "GB Support 1",
                "assignee": "KMills",
                "articleDesc": `${knowledgeTitleStr} Desc`
            }
            await apiHelper.createKnowledgeArticle(articleData, attachmentFilePath);
        });

        it('[DRDMV-20746]: Verify the search based on version on knowledge article console', async () => {
            await navigationPage.gotoKnowledgeConsole();
            await utilityGrid.clearFilter();
            await knowledgeConsole.addColumnOnGrid(versionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFields)).toBe(true);
            await utilityGrid.searchRecord(versionFieldVal);
            versionVal = await knowledgeConsole.getSelectedGridRecordValue(versionField);
            expect(versionVal).toEqual(versionFieldVal);
            await knowledgeConsole.removeColumnOnGrid(versionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFieldsWithoutVersion)).toBe(true);
            await utilityGrid.searchRecord(versionFieldVal);
            versionVal = await knowledgeConsole.getSelectedGridRecordValue(versionField);
            expect(versionVal).toEqual(emptyStr);
            await utilityGrid.addFilter(versionField, versionFieldVal, 'counter');
            expect(await utilityGrid.isGridRecordPresent(knowledgeTitleStr)).toBeTruthy();
            await navigationPage.signOut();

            await loginPage.login(caseManagerUser);
            await navigationPage.gotoKnowledgeConsole();
            await utilityGrid.clearFilter();
            await knowledgeConsole.addColumnOnGrid(versionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFields)).toBe(true);
            await utilityGrid.searchRecord(versionFieldVal);
            versionVal = await knowledgeConsole.getSelectedGridRecordValue(versionField);
            expect(versionVal).toEqual(versionFieldVal);
            await knowledgeConsole.removeColumnOnGrid(versionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFieldsWithoutVersion)).toBe(true);
            await utilityGrid.searchRecord(versionFieldVal);
            versionVal = await knowledgeConsole.getSelectedGridRecordValue(versionField);
            expect(versionVal).toEqual(emptyStr);
            await utilityGrid.addFilter(versionField, versionFieldVal, 'counter');
            expect(await utilityGrid.isGridRecordPresent(knowledgeTitleStr)).toBeTruthy();
            await navigationPage.signOut();
        });

        it('[DRDMV-20746]: Verify the search based on version on knowledge article console', async () => {
            await loginPage.login(caseAgentUser);
            await navigationPage.gotoKnowledgeConsole();
            await utilityGrid.clearFilter();
            await knowledgeConsole.addColumnOnGrid(versionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFields)).toBe(true);
            await utilityGrid.searchRecord(versionFieldVal);
            versionVal = await knowledgeConsole.getSelectedGridRecordValue(versionField);
            expect(versionVal).toEqual(versionFieldVal);
            await knowledgeConsole.removeColumnOnGrid(versionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFieldsWithoutVersion)).toBe(true);
            await utilityGrid.searchRecord(versionFieldVal);
            versionVal = await knowledgeConsole.getSelectedGridRecordValue(versionField);
            expect(versionVal).toEqual(emptyStr);
            await utilityGrid.addFilter(versionField, versionFieldVal, 'counter');
            expect(await utilityGrid.isGridRecordPresent(knowledgeTitleStr)).toBeTruthy();
            await navigationPage.signOut();

            await loginPage.login(knowledgeCandidateUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            await utilityCommon.switchToNewTab(1);
            await browser.sleep(2000) //Hard wait to load the new tab
            await utilityGrid.clearFilter();
            await knowledgeConsole.addColumnOnGrid(versionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFields)).toBe(true);
            await utilityGrid.searchRecord(versionFieldVal);
            versionVal = await knowledgeConsole.getSelectedGridRecordValue(versionField);
            expect(versionVal).toEqual(versionFieldVal);
            await knowledgeConsole.removeColumnOnGrid(versionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFieldsWithoutVersion)).toBe(true);
            await utilityGrid.searchRecord(versionFieldVal);
            versionVal = await knowledgeConsole.getSelectedGridRecordValue(versionField);
            expect(versionVal).toEqual(emptyStr);
            await utilityGrid.addFilter(versionField, versionFieldVal, 'counter');
            expect(await utilityGrid.isGridRecordPresent(knowledgeTitleStr)).toBeTruthy();
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
        });

        it('[DRDMV-20746]: Verify the search based on version on knowledge article console', async () => {
            await loginPage.login(knowledgeContributorUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            await utilityCommon.switchToNewTab(1);
            await browser.sleep(2000) //Hard wait to load the new tab
            await utilityGrid.clearFilter();
            await knowledgeConsole.addColumnOnGrid(versionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFields)).toBe(true);
            await utilityGrid.searchRecord(versionFieldVal);
            versionVal = await knowledgeConsole.getSelectedGridRecordValue(versionField);
            expect(versionVal).toEqual(versionFieldVal);
            await knowledgeConsole.removeColumnOnGrid(versionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFieldsWithoutVersion)).toBe(true);
            await utilityGrid.searchRecord(versionFieldVal);
            versionVal = await knowledgeConsole.getSelectedGridRecordValue(versionField);
            expect(versionVal).toEqual(emptyStr);
            await utilityGrid.addFilter(versionField, versionFieldVal, 'counter');
            expect(await utilityGrid.isGridRecordPresent(knowledgeTitleStr)).toBeTruthy();
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();

            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            await utilityCommon.switchToNewTab(1);
            await browser.sleep(2000) //Hard wait to load the new tab
            await utilityGrid.clearFilter();
            await knowledgeConsole.addColumnOnGrid(versionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFields)).toBe(true);
            await utilityGrid.searchRecord(versionFieldVal);
            versionVal = await knowledgeConsole.getSelectedGridRecordValue(versionField);
            expect(versionVal).toEqual(versionFieldVal);
            await knowledgeConsole.removeColumnOnGrid(versionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFieldsWithoutVersion)).toBe(true);
            await utilityGrid.searchRecord(versionFieldVal);
            versionVal = await knowledgeConsole.getSelectedGridRecordValue(versionField);
            expect(versionVal).toEqual(emptyStr);
            await utilityGrid.addFilter(versionField, versionFieldVal, 'counter');
            expect(await utilityGrid.isGridRecordPresent(knowledgeTitleStr)).toBeTruthy();
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
        });

        it('[DRDMV-20746]: Verify the search based on version on knowledge article console', async () => {
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            await utilityCommon.switchToNewTab(1);
            await browser.sleep(2000) //Hard wait to load the new tab
            await utilityGrid.clearFilter();
            await knowledgeConsole.addColumnOnGrid(versionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFields)).toBe(true);
            await utilityGrid.searchRecord(versionFieldVal);
            versionVal = await knowledgeConsole.getSelectedGridRecordValue(versionField);
            expect(versionVal).toEqual(versionFieldVal);
            await knowledgeConsole.removeColumnOnGrid(versionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFieldsWithoutVersion)).toBe(true);
            await utilityGrid.searchRecord(versionFieldVal);
            versionVal = await knowledgeConsole.getSelectedGridRecordValue(versionField);
            expect(versionVal).toEqual(emptyStr);
            await utilityGrid.addFilter(versionField, versionFieldVal, 'counter');
            expect(await utilityGrid.isGridRecordPresent(knowledgeTitleStr)).toBeTruthy();
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
        });

        afterAll(async () => {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        })

    });

    //skhobrag
    describe('[DRDMV-20754]: Verify the search functionality of articles with versions from Case Edit > Resources screen', () => {
        beforeAll(async () => {
            let articleData1 = {
                "knowledgeSet": "HR",
                "title": articleInDraftStatus,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "categoryTier1": "Applications",
                "categoryTier2": "Help Desk",
                "categoryTier3": "Incident",
                "region": "Australia",
                "site": "Canberra",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "Australia Support",
                "assigneeSupportGroup": "AU Support 3",
                "assignee": "KWilliamson"
            }
            await apiHelper.apiLogin('fritz');
            let knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData1);
            let knowledgeArticleGUID = knowledgeArticleData.id;
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'Draft')).toBeTruthy("Article with Draft status not updated.");
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'PublishApproval', "KMills", 'GB Support 2', 'Petramco')).toBeTruthy("Article with Published status not updated.");

        });

        it('[DRDMV-20754]: Verify the search functionality of articles with versions from Case Edit > Resources screen', async () => {
            await navigationPage.gotoQuickCase();
            await quickCase.selectRequesterName(caseAgentUser);
            await quickCase.setCaseSummary(articleInDraftStatus);

            //Search with knowledge article with published status and different versions   
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInDraftStatus)).toEqual(articleInDraftStatus);

            //Navigate to Create case
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary(articleInDraftStatus);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePage.clickOnTab(resourcesTabStr);

            //Search with knowledge article with published status and different versions
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInDraftStatus)).toEqual(articleInDraftStatus);
        });


        it('[DRDMV-20754]: Verify the search functionality of articles with versions from Case Edit > Resources screen', async () => {
            //Login with Case Manager
            await navigationPage.signOut();
            await loginPage.login('frieda');
            await navigationPage.gotoQuickCase();
            await quickCase.selectRequesterName(caseAgentUser);
            await quickCase.setCaseSummary(articleInDraftStatus);

            //Search with knowledge article with published status and different versions            
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInDraftStatus)).toEqual(articleInDraftStatus);

            //Navigate to Create case
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary(articleInDraftStatus);
            await createCasePage.clickAssignToMeButton();
            await browser.sleep(3000); // To Wait Until Assignee Displayed On Page.
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePage.clickOnTab(resourcesTabStr);

            //Search with knowledge article with published status and different versions
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInDraftStatus)).toEqual(articleInDraftStatus);
        });

        it('[DRDMV-20754]: Verify the search functionality of articles with versions from Case Edit > Resources screen', async () => {
            //Login as Case Agent
            await navigationPage.signOut();
            await loginPage.login(caseAgentUser);
            await navigationPage.gotoQuickCase();
            await quickCase.selectRequesterName(caseManagerUser);
            await quickCase.setCaseSummary(articleInDraftStatus);

            //Search with knowledge article with published status and different versions
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInDraftStatus)).toEqual(articleInDraftStatus);

            //Navigate to Create case
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary(articleInDraftStatus);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePage.clickOnTab(resourcesTabStr);

            //Search with knowledge article with published status and different versions
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInDraftStatus)).toEqual(articleInDraftStatus);
        });

        afterAll(async () => {
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        });

    });

    //skhobrag
    describe('[DRDMV-20743,DRDMV-20735]: Verify the functionality of Edit article with Major Edit button', () => {
        let knowledgeTitleStr = 'Versioning for article' + "_" + randomStr;
        let articleAccessPermission: string[] = ['GB Support 2', 'Petramco', 'Kane Williamson'];
        let articleAttachments = ['articleStatus.png'];
        let articleAccessPermissionUser: string[] = ['Kane Williamson'];
        let updatedArticleTitle = "updated article title" + "_" + randomStr;
        let updatedArticleDesc = "updated article description";
        let articleKeywordsVal: string[] = undefined;
        let articleDetails = undefined;
        let articleData = undefined;
        let actualDate = undefined;
        let articleHelpFulCounterData = {
            linkedCounter: 182,
            helpfulPercentage: 81,
            helpfulCounter: 110,
            viewCounter: 56,
            notHelpfulCounter: 12
        }


        beforeAll(async () => {
            await apiHelper.apiLogin(caseAgentUser);
            let knowledgeTemplateId = await apiCoreUtil.getKnowledgeTemplateGuid(knowledgeTemplateStr);

            articleData = {
                "knowledgeSet": `${knowledgeSetTitleStr}`,
                "title": `${knowledgeTitleStr}`,
                "templateId": `${knowledgeTemplateId}`,
                "categoryTier1": "Applications",
                "categoryTier2": "Help Desk",
                "categoryTier3": "Incident",
                "region": "Australia",
                "site": "Canberra",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United Kingdom Support",
                "assigneeSupportGroup": "GB Support 2",
                "assignee": "KMills",
                "articleDesc": `${knowledgeTitleStr} Desc`
            }

            articleDetails = await apiHelper.createKnowledgeArticle(articleData, attachmentFilePath);
            articleKeywordsVal = ['MyKeyword', `${articleDetails.displayId}`];
        });

        it('[DRDMV-20743,DRDMV-20735]: Verify the functionality of Edit article with Major Edit button', async () => {
            await navigationPage.signOut();
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            expect(await knowledgeConsole.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await browser.sleep(5000); //Hard wait to load the new tab properly
            expect(await knowledgeConsole.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(articleDetails.displayId);
            expect(await viewKnowledgeArticlePo.isEditLinkDisplayedOnKA()).toBeTruthy('Article view screen is not displayed');
            expect(await viewKnowledgeArticlePo.isArticleVersionDisplayed()).toBeTruthy('Article version on View knowledge article is not displayed');
            let actualVersion = await viewKnowledgeArticlePo.getArticleVersion();
            actualDate = await viewKnowledgeArticlePo.formatDate();
            let expectedVersion = "Version " + "1" + " - " + actualDate;
            expect(actualVersion).toBe(expectedVersion);
            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(minorEditOption)).toBeFalsy('Minor Edit Option is displayed for In Progress Knowledge Article.');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(majorEditOption)).toBeFalsy('Major Edit Option is displayed for In Progress Knowledge Article.');
            await editKnowledgePage.clickArticleCancelButton();
            await utilCommon.clickOnWarningOk();
            await editKnowledgePage.setKnowledgeStatus('Draft');
            expect(await editKnowledgePage.getStatusValue()).toContain('Draft', 'Article is updated with Draft status.');
            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(minorEditOption)).toBeFalsy('Minor Edit Option is displayed for Draft Knowledge Article.');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(majorEditOption)).toBeFalsy('Major Edit Option is displayed for Draft Knowledge Article.');
            await editKnowledgePage.clickArticleCancelButton();
            await utilCommon.clickOnWarningOk();
            await statusBladeKnowledgeArticlePo.setKnowledgeStatusWithReviewerDetails('SME Review', 'Petramco', 'Australia Support', 'AU Support 3', 'Kane Williamson');
        });

        it('[DRDMV-20743,DRDMV-20735]: Verify the functionality of Edit article with Major Edit button', async () => {
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            await browser.sleep(5000); //Hard wait to load the new tab properly
            expect(await knowledgeConsole.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(articleDetails.displayId);
            expect(await viewKnowledgeArticlePo.isReviewMessageDisplayed('Knowledge Article is in Review')).toBeTruthy();
            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(minorEditOption)).toBeFalsy('Minor Edit Option is displayed for SME Review Knowledge Article.');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(majorEditOption)).toBeFalsy('Major Edit Option is displayed for SME Review Knowledge Article.');
            await editKnowledgePage.clickArticleCancelButton();
            await utilCommon.clickOnWarningOk();
            await viewKnowledgeArticlePo.clickReviewPendingLink();
            await reviewCommentsPo.setTextInTellUsMore(articleDetails.displayId);
            await reviewCommentsPo.clickApprovedButton();
            await navigationPage.gotoKnoweldgeConsoleFromKM();
            await utilityGrid.searchAndOpenHyperlink(articleDetails.displayId);
            expect(await editKnowledgePage.getStatusValue()).toContain('Published', 'Article is updated with Published status.');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.updateKnowledgeArticleViewAndHelpFulCounter(articleDetails.id, articleHelpFulCounterData);
            await utilityCommon.refresh();
            await browser.sleep(3000); //hard wait to load tab completely
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            await editKnowledgePage.selectIsExternalOption('Yes');
            await editKnowledgePage.enterKeyword(articleDetails.displayId);
            await editKnowledgePage.clickSaveKnowledgeMetadata();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy();
            await utilityCommon.closePopUpMessage();
            await viewKnowledgeArticlePo.clickOnFlagButton();
            await flagUnflagKnowledgePo.setTextInTellUsMore(articleDetails.displayId);
            await flagUnflagKnowledgePo.clickOnFlageButtonOnBlade();
            expect(await utilityCommon.isPopUpMessagePresent('You have successfully flagged the article.')).toBeTruthy('Article Not Flagged');
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleTitle()).toBe(knowledgeTitleStr);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleDescription()).toBe(articleData.articleDesc);
            expect(await viewKnowledgeArticlePo.getKnowledgeSet()).toBe(knowledgeSetTitleStr);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleCompany()).toBe(articleData.assignedCompany);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleAuthor()).toBe('Qianru Tao');
            expect(await viewKnowledgeArticlePo.getCategoryTier1Value()).toBe(articleData.categoryTier1);
            expect(await viewKnowledgeArticlePo.getCategoryTier2Value()).toBe(articleData.categoryTier2);
            expect(await viewKnowledgeArticlePo.getCategoryTier3Value()).toBe(articleData.categoryTier3);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleAssigneeGroupValue()).toBe(articleData.assigneeSupportGroup);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleAccessPermissionGroupDetails()).toEqual(articleAccessPermission);
            expect(await viewKnowledgeArticlePo.getArticleViewCounter()).toContain(articleHelpFulCounterData.viewCounter.toString());
            expect(await viewKnowledgeArticlePo.getArticleHelpfulCounter()).toContain(articleHelpFulCounterData.helpfulPercentage.toString());
            expect(await viewKnowledgeArticlePo.getRegionValue()).toBe(articleData.region);
            expect(await viewKnowledgeArticlePo.getSiteValue()).toBe(articleData.site);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleLocalValue()).toBe('English');
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleAttachments()).toEqual(articleAttachments);
            expect(await viewKnowledgeArticlePo.getAssigneeValue()).toBe('Kyle Mills');
            expect(await viewKnowledgeArticlePo.getArticleReviewerUser()).toBe('Kane Williamson');
            expect(await viewKnowledgeArticlePo.getArticleReviewerGroup()).toBe('AU Support 3');
            expect(await viewKnowledgeArticlePo.getArticleIsExternalValue()).toBe('Yes');
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleKeywords()).toEqual(articleKeywordsVal);
            expect(await viewKnowledgeArticlePo.isFlagArticleOptionDisplayed()).toBeFalsy('Flag Article option is displayed.');
            expect(await viewKnowledgeArticlePo.isUnFlagArticleOptionDisplayed()).toBeTruthy('UnFlag Article option is displayed.');
        });

        it('[DRDMV-20743,DRDMV-20735]: Verify the functionality of Edit article with Major Edit button', async () => {
            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(minorEditOption)).toBeTruthy('Minor Edit Option is displayed for Published Knowledge Article.');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(majorEditOption)).toBeTruthy('Major Edit Option is displayed for Published Knowledge Article.');
            await editKnowledgePage.selectArticleEditOption(majorEditOption);
            expect(await editKnowledgePage.getHelpTextForMajorEditOptionDisplayed()).toBe(majorEditHelpText);
            await editKnowledgePage.updateKnowledgeArticleTitle(updatedArticleTitle);
            await editKnowledgePage.updateKnowledgeArticleDescription(updatedArticleDesc);
            await editKnowledgePage.clickArticleMajorEditSaveButton();
            await navigationPage.gotoKnoweldgeConsoleFromKM();
            await utilityGrid.sortGridColumn('Created Date', 'desc');
            await utilityGrid.searchAndOpenHyperlink(articleDetails.displayId);
            let updatedVersion = "Version " + "2" + " - " + actualDate;
            expect(await viewKnowledgeArticlePo.getArticleVersion()).toBe(updatedVersion);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleTitle()).toBe(updatedArticleTitle);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleDescription()).toBe(updatedArticleDesc);
            expect(await viewKnowledgeArticlePo.getKnowledgeSet()).toBe(knowledgeSetTitleStr);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleCompany()).toBe(articleData.assignedCompany);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleAuthor()).toBe('Kane Williamson');
            expect(await viewKnowledgeArticlePo.getCategoryTier1Value()).toBe(articleData.categoryTier1);
            expect(await viewKnowledgeArticlePo.getCategoryTier2Value()).toBe(articleData.categoryTier2);
            expect(await viewKnowledgeArticlePo.getCategoryTier3Value()).toBe(articleData.categoryTier3);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleAssigneeGroupValue()).toBe(articleData.assigneeSupportGroup);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleAccessPermissionGroupDetails()).toEqual(articleAccessPermission);
            expect(await viewKnowledgeArticlePo.getArticleViewCounter()).toContain(articleHelpFulCounterData.viewCounter.toString());
            expect(await viewKnowledgeArticlePo.getArticleHelpfulCounter()).toContain(articleHelpFulCounterData.helpfulPercentage.toString());
            expect(await viewKnowledgeArticlePo.getRegionValue()).toBe(articleData.region);
            expect(await viewKnowledgeArticlePo.getSiteValue()).toBe(articleData.site);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleLocalValue()).toBe('English');
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleAttachments()).toEqual(articleAttachments);
            expect(await viewKnowledgeArticlePo.getAssigneeValue()).toBe('Kyle Mills');
            expect(await viewKnowledgeArticlePo.isArticleReviewerUserDisplayed()).toBeFalsy('Article Reviewer user is displayed on new version of an article.');
            expect(await viewKnowledgeArticlePo.isArticleReviewerGroupDisplayed()).toBeFalsy('Article Reviewer Group is displayed on new version of an article.');
            expect(await viewKnowledgeArticlePo.isArticleLastReviewDateDisplayed()).toBeFalsy('Article Last Review Date is displayed on new version of an article.');
            expect(await viewKnowledgeArticlePo.isArticleNextReviewDateDisplayed()).toBeFalsy('Article Next Review Date  is displayed on new version of an article.');
            expect(await viewKnowledgeArticlePo.isArticleIsExternalValueDisplayed()).toBeFalsy('Article IsExternal Flag is displayed on new Draft version of an article.');
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleKeywords()).toEqual(articleKeywordsVal);
            expect(await viewKnowledgeArticlePo.isFlagArticleOptionDisplayed()).toBeFalsy('Flag Article option is displayed.');
            expect(await viewKnowledgeArticlePo.isUnFlagArticleOptionDisplayed()).toBeTruthy('UnFlag Article option is displayed.');
            await viewKnowledgeArticlePo.clickOnTab(activityTabStr);
            await activityTabPo.clickOnRefreshButton();
            expect(await activityTabPo.getFirstPostContent()).toContain('Kane Williamson created a new version.', 'content not displaying on Activity');
            await viewKnowledgeArticlePo.selectArticleVersion('1');
            expect(await editKnowledgePage.getStatusValue()).toContain('Published', 'Article is updated with Published status.');
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleTitle()).toBe(knowledgeTitleStr);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleDescription()).toBe(articleData.articleDesc);
            expect(await viewKnowledgeArticlePo.getKnowledgeSet()).toBe(knowledgeSetTitleStr);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleCompany()).toBe(articleData.assignedCompany);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleAuthor()).toBe('Qianru Tao');
            expect(await viewKnowledgeArticlePo.getCategoryTier1Value()).toBe(articleData.categoryTier1);
            expect(await viewKnowledgeArticlePo.getCategoryTier2Value()).toBe(articleData.categoryTier2);
            expect(await viewKnowledgeArticlePo.getCategoryTier3Value()).toBe(articleData.categoryTier3);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleAssigneeGroupValue()).toBe(articleData.assigneeSupportGroup);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleAccessPermissionGroupDetails()).toEqual(articleAccessPermission);
            expect(await viewKnowledgeArticlePo.getArticleViewCounter()).toContain(articleHelpFulCounterData.viewCounter.toString());
            expect(await viewKnowledgeArticlePo.getArticleHelpfulCounter()).toContain(articleHelpFulCounterData.helpfulPercentage.toString());
            expect(await viewKnowledgeArticlePo.getRegionValue()).toBe(articleData.region);
            expect(await viewKnowledgeArticlePo.getSiteValue()).toBe(articleData.site);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleLocalValue()).toBe('English');
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleAttachments()).toEqual(articleAttachments);
            expect(await viewKnowledgeArticlePo.getAssigneeValue()).toBe('Kyle Mills');
            expect(await viewKnowledgeArticlePo.getArticleReviewerUser()).toBe('Kane Williamson');
            expect(await viewKnowledgeArticlePo.getArticleReviewerGroup()).toBe('AU Support 3');
            await viewKnowledgeArticlePo.clickOnTab(activityTabStr);
            await activityTabPo.clickOnRefreshButton();
            expect(await activityTabPo.getFirstPostContent()).toContain('Kane Williamson flagged the article', 'content not displaying on Activity');
        });

        afterAll(async () => {
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await utilityCommon.refresh();
            await utilCommon.waitUntilSpinnerToHide();
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        });

    });

    //skhobrag
    describe('[DRDMV-20744]: Verify the article status of previous version articles when the new versioned article is moved to Published status', () => {
        let knowledgeTitleStr = 'Versioning for article' + "_" + randomStr;
        let updatedArticleTitle = "updated article title" + "_" + randomStr;
        let articleData = undefined;
        let articleHelpFulCounterData = {
            linkedCounter: 182,
            helpfulPercentage: 81,
            helpfulCounter: 110,
            viewCounter: 56,
            notHelpfulCounter: 12
        }
        let articleDetails = undefined;
        let actualDate = undefined;

        beforeAll(async () => {
            let knowledgeTemplateId = await apiCoreUtil.getKnowledgeTemplateGuid(knowledgeTemplateStr);
            await apiHelper.apiLogin(caseAgentUser);
            articleData = {
                "knowledgeSet": `${knowledgeSetTitleStr}`,
                "title": `${knowledgeTitleStr}`,
                "templateId": `${knowledgeTemplateId}`,
                "categoryTier1": "Applications",
                "categoryTier2": "Help Desk",
                "categoryTier3": "Incident",
                "region": "Australia",
                "site": "Canberra",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United Kingdom Support",
                "assigneeSupportGroup": "GB Support 2",
                "assignee": "KMills",
                "articleDesc": `${knowledgeTitleStr} Desc`
            }
            articleDetails = await apiHelper.createKnowledgeArticle(articleData, attachmentFilePath);
        });

        it('[DRDMV-20744]: Verify the article status of previous version articles when the new versioned article is moved to Published status', async () => {
            await navigationPage.signOut();
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            await browser.sleep(2000); //Hard wait to load the new tab properly
            expect(await knowledgeConsole.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(articleDetails.displayId);
            expect(await viewKnowledgeArticlePo.isEditLinkDisplayedOnKA()).toBeTruthy('Article view screen is not displayed');
            expect(await viewKnowledgeArticlePo.isArticleVersionDisplayed()).toBeTruthy('Article version on View knowledge article is not displayed');
            let actualVersion = await viewKnowledgeArticlePo.getArticleVersion();
            actualDate = await viewKnowledgeArticlePo.formatDate();
            let expectedVersion = "Version " + "1" + " - " + actualDate;
            expect(actualVersion).toBe(expectedVersion);
            await editKnowledgePage.setKnowledgeStatus('Draft');
            expect(await editKnowledgePage.getStatusValue()).toContain('Draft', 'Article is updated with Draft status.');
            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(minorEditOption)).toBeFalsy('Minor Edit Option is displayed for Draft Knowledge Article.');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(majorEditOption)).toBeFalsy('Major Edit Option is displayed for Draft Knowledge Article.');
            await editKnowledgePage.clickArticleCancelButton();
            await utilCommon.clickOnWarningOk();
            await statusBladeKnowledgeArticlePo.setKnowledgeStatusWithReviewerDetails('SME Review', 'Petramco', 'Australia Support', 'AU Support 3', 'Kane Williamson');
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            await browser.sleep(5000); //Hard wait to load the new tab properly
            expect(await knowledgeConsole.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(articleDetails.displayId);
            expect(await viewKnowledgeArticlePo.isReviewMessageDisplayed('Knowledge Article is in Review')).toBeTruthy();
            await viewKnowledgeArticlePo.clickReviewPendingLink();
            await reviewCommentsPo.setTextInTellUsMore(articleDetails.displayId);
            await reviewCommentsPo.clickApprovedButton();
            await utilityCommon.refresh();
            expect(await editKnowledgePage.getStatusValue()).toContain('Published', 'Article is updated with Published status.');
        });

        it('[DRDMV-20744]: Verify the article status of previous version articles when the new versioned article is moved to Published status', async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.updateKnowledgeArticleViewAndHelpFulCounter(articleDetails.id, articleHelpFulCounterData);
            await utilityCommon.refresh();
            await browser.sleep(3000); // Hard wait for browser tab to load properly
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            await editKnowledgePage.selectIsExternalOption('Yes');
            await editKnowledgePage.enterKeyword(articleDetails.displayId);
            await editKnowledgePage.clickSaveKnowledgeMetadata();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy();
            await utilityCommon.closePopUpMessage();
            await viewKnowledgeArticlePo.clickOnFlagButton();
            await flagUnflagKnowledgePo.setTextInTellUsMore(articleDetails.displayId);
            await flagUnflagKnowledgePo.clickOnFlageButtonOnBlade();
            expect(await utilityCommon.isPopUpMessagePresent('You have successfully flagged the article.')).toBeTruthy('Article Not Flagged');
            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(minorEditOption)).toBeTruthy('Minor Edit Option is displayed for Published Knowledge Article.');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(majorEditOption)).toBeTruthy('Major Edit Option is displayed for Published Knowledge Article.');
            await editKnowledgePage.selectArticleEditOption(majorEditOption);
            expect(await editKnowledgePage.getHelpTextForMajorEditOptionDisplayed()).toBe(majorEditHelpText);
            await editKnowledgePage.updateKnowledgeArticleTitle(updatedArticleTitle);
            await editKnowledgePage.clickArticleMajorEditSaveButton();
            await browser.sleep(4000); // Hard wait for browser tab to load properly
            await utilityCommon.refresh();
            await browser.sleep(4000);// Hard wait for browser tab to load properly
            let updatedVersion = "Version " + "2" + " - " + actualDate;
            expect(await viewKnowledgeArticlePo.getArticleVersion()).toBe(updatedVersion);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleTitle()).toBe(updatedArticleTitle);
            await statusBladeKnowledgeArticlePo.setKnowledgeStatusWithReviewerDetails('SME Review', 'Petramco', 'Australia Support', 'AU Support 3', 'Kane Williamson');
            expect(await editKnowledgePage.getStatusValue()).toContain('SME Review', 'Article is updated with SME Review status.');
            expect(await viewKnowledgeArticlePo.isReviewMessageDisplayed('Knowledge Article is in Review')).toBeTruthy();
            await viewKnowledgeArticlePo.clickReviewPendingLink();
            await reviewCommentsPo.setTextInTellUsMore(articleDetails.displayId);
            await reviewCommentsPo.clickApprovedButton();
            await browser.sleep(4000); // Hard wait for browser tab to load properly
            await utilityCommon.refresh();
            await browser.sleep(4000); // Hard wait for browser tab to load properly
            expect(await editKnowledgePage.getStatusValue()).toContain('Published', 'Article is updated with Published status.');
            await viewKnowledgeArticlePo.selectArticleVersion('1');
            await browser.sleep(2000); // Hard wait to load the browser completely
            expect(await editKnowledgePage.getStatusValue()).toContain('Closed', 'Article is updated with Closed status.');
        });

        afterAll(async () => {
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        });
    });

    //skhobrag
    describe('[DRDMV-20752]: Verify the behavior when the user who does not have access to view current article version and he tries to create or update existing version', () => {
        let knowledgeTitleStr = 'Versioning for article' + "_" + randomStr;
        let updatedArticleTitle = "updated article title" + "_" + randomStr;
        let articleData = undefined;
        let articleHelpFulCounterData = {
            linkedCounter: 182,
            helpfulPercentage: 81,
            helpfulCounter: 110,
            viewCounter: 56,
            notHelpfulCounter: 12
        }
        let articleDetails = undefined;
        let actualDate = undefined;
        let expectedVersion = undefined;

        beforeAll(async () => {
            await apiHelper.apiLogin(caseAgentUser);
            let knowledgeTemplateId = await apiCoreUtil.getKnowledgeTemplateGuid(knowledgeTemplateStr);

            articleData = {
                "knowledgeSet": `${knowledgeSetTitleStr}`,
                "title": `${knowledgeTitleStr}`,
                "templateId": `${knowledgeTemplateId}`,
                "categoryTier1": "Applications",
                "categoryTier2": "Help Desk",
                "categoryTier3": "Incident",
                "region": "Australia",
                "site": "Canberra",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United Kingdom Support",
                "assigneeSupportGroup": "GB Support 2",
                "assignee": "KMills",
                "articleDesc": `${knowledgeTitleStr} Desc`
            }
            articleDetails = await apiHelper.createKnowledgeArticle(articleData, attachmentFilePath);
        });

        it('[DRDMV-20752]: Verify the behavior when the user who does not have access to view current article version and he tries to create or update existing version', async () => {
            await navigationPage.signOut();
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            await browser.sleep(2000); //Hard wait to laod the tab completely
            expect(await knowledgeConsole.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(articleDetails.displayId);
            expect(await viewKnowledgeArticlePo.isEditLinkDisplayedOnKA()).toBeTruthy('Article view screen is not displayed');
            expect(await viewKnowledgeArticlePo.isArticleVersionDisplayed()).toBeTruthy('Article version on View knowledge article is not displayed');
            let actualVersion = await viewKnowledgeArticlePo.getArticleVersion();
            actualDate = await viewKnowledgeArticlePo.formatDate();
            expectedVersion = "Version " + "1" + " - " + actualDate;
            expect(actualVersion).toBe(expectedVersion);
            await editKnowledgePage.setKnowledgeStatus('Draft');
            expect(await editKnowledgePage.getStatusValue()).toContain('Draft', 'Article is updated with Draft status.');
            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(minorEditOption)).toBeFalsy('Minor Edit Option is displayed for Draft Knowledge Article.');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(majorEditOption)).toBeFalsy('Major Edit Option is displayed for Draft Knowledge Article.');
            await editKnowledgePage.clickArticleCancelButton();
            await utilCommon.clickOnWarningOk();
            await statusBladeKnowledgeArticlePo.setKnowledgeStatusWithReviewerDetails('SME Review', 'Petramco', 'Australia Support', 'AU Support 3', 'Kane Williamson');
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
        });
        it('[DRDMV-20752]: Verify the behavior when the user who does not have access to view current article version and he tries to create or update existing version', async () => {
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            await browser.sleep(3000); //Hard wait to laod the tab completely
            expect(await knowledgeConsole.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(articleDetails.displayId);
            expect(await viewKnowledgeArticlePo.isReviewMessageDisplayed('Knowledge Article is in Review')).toBeTruthy();
            await viewKnowledgeArticlePo.clickReviewPendingLink();
            await reviewCommentsPo.setTextInTellUsMore(articleDetails.displayId);
            await reviewCommentsPo.clickApprovedButton();
            await browser.sleep(2000); // Hard wait to load tab completely
            await utilityCommon.refresh();
            await browser.sleep(2000); // Hard wait to load tab completely
            expect(await editKnowledgePage.getStatusValue()).toContain('Published', 'Article is updated with Published status.');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.updateKnowledgeArticleViewAndHelpFulCounter(articleDetails.id, articleHelpFulCounterData);
            await browser.sleep(2000); // Hard wait to load tab completely
            await utilityCommon.refresh();
            await browser.sleep(2000); // Hard wait to load tab completely
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            await editKnowledgePage.selectIsExternalOption('Yes');
            await editKnowledgePage.enterKeyword(articleDetails.displayId);
            await editKnowledgePage.clickSaveKnowledgeMetadata();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy();
            await utilityCommon.closePopUpMessage();
            await viewKnowledgeArticlePo.clickOnFlagButton();
            await flagUnflagKnowledgePo.setTextInTellUsMore(articleDetails.displayId);
            await flagUnflagKnowledgePo.clickOnFlageButtonOnBlade();
            expect(await utilityCommon.isPopUpMessagePresent('You have successfully flagged the article.')).toBeTruthy('Article Not Flagged');
        });
        it('[DRDMV-20752]: Verify the behavior when the user who does not have access to view current article version and he tries to create or update existing version', async () => {
            await viewKnowledgeArticlePo.clickEditKnowledgeAccess();
            await knowledgeAccessPage.clickOnAccessButton('Support Group Access');
            await knowledgeAccessPage.selectCompany('Petramco');
            await knowledgeAccessPage.selectBusinessUnit('HR Support');
            await knowledgeAccessPage.selectSupportGroup('Employee Relations');
            await knowledgeAccessPage.selectSupportGroupWriteAccess();
            await knowledgeAccessPage.clickAddSupportGroupAccessButton();
            await knowledgeAccessPage.clickCloseKnowledgeAccessBlade();
            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(minorEditOption)).toBeTruthy('Minor Edit Option is displayed for Published Knowledge Article.');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(majorEditOption)).toBeTruthy('Major Edit Option is displayed for Published Knowledge Article.');
            await editKnowledgePage.selectArticleEditOption(majorEditOption);
            expect(await editKnowledgePage.getHelpTextForMajorEditOptionDisplayed()).toBe(majorEditHelpText);
            await editKnowledgePage.updateKnowledgeArticleTitle(updatedArticleTitle);
            await editKnowledgePage.clickArticleMajorEditSaveButton();
            await browser.sleep(4000); // To Wait Until Edit Knowledge Changes Gets Saved KA Version Gets Change.
            await utilityCommon.refresh();
            let updatedVersion = "Version " + "2" + " - " + actualDate;
            expect(await viewKnowledgeArticlePo.getArticleVersion()).toBe(updatedVersion);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleTitle()).toBe(updatedArticleTitle);

            await viewKnowledgeArticlePo.clickEditKnowledgeAccess();
            await knowledgeAccessPage.clickRemoveKnowledgeAccess('Petramco');
            await knowledgeAccessPage.clickKnowledgeAccessYesOption();
            await knowledgeAccessPage.clickRemoveKnowledgeAccess('Employee Relations');
            await knowledgeAccessPage.clickKnowledgeAccessYesOption();
            await knowledgeAccessPage.clickCloseKnowledgeAccessBlade();
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();

            await loginPage.login('peter');
            await navigationPage.gotoKnowledgeConsole();
            await browser.sleep(2000); //Hard wait to laod the tab completely
            expect(await knowledgeConsole.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(articleDetails.displayId);
            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(minorEditOption)).toBeTruthy('Minor Edit Option is displayed for Published Knowledge Article.');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(majorEditOption)).toBeTruthy('Major Edit Option is displayed for Published Knowledge Article.');
            await editKnowledgePage.selectArticleEditOption(majorEditOption);
            await editKnowledgePage.updateKnowledgeArticleTitle(updatedArticleTitle + "_updated version");
            await editKnowledgePage.clickArticleMajorEditSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Draft version already created.')).toBeTruthy();
            await browser.sleep(4000); // To Wait Until Edit Knowledge Changes Gets Saved KA Version Gets Change.
            await utilityCommon.refresh();
            expect(await viewKnowledgeArticlePo.getArticleVersion()).toBe(expectedVersion);
        });

        afterAll(async () => {
            await utilityCommon.refresh();
            await utilCommon.waitUntilSpinnerToHide();
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        });

    });

    //skhobrag
    describe('[DRDMV-20718]: Verify that the newly created article with version displays on knowledge grid console', () => {
        let knowledgeTitleStr = 'Versioning for article' + "_" + randomStr;
        let updatedArticleTitle = "updated article title" + "_" + randomStr;
        let versionFieldColumns: string[] = ["Version"];
        let knowledgeGridColumnFields: string[] = ["Article ID", "Title", "Knowledge Set", "Status", "Assignee", "Company", "Template Name", "Reviewer", "Modified By", "Created Date", "Modified Date", "Flagged", "Version"];
        let expectedPreviousVersionNum = '1';
        let expectedUpdatedVersionNum = '2';
        let articleData = undefined;
        let articleHelpFulCounterData = {
            linkedCounter: 182,
            helpfulPercentage: 81,
            helpfulCounter: 110,
            viewCounter: 56,
            notHelpfulCounter: 12
        }
        let articleDetails = undefined;
        let actualDate = undefined;

        beforeAll(async () => {
            await apiHelper.apiLogin(caseAgentUser);
            let knowledgeTemplateId = await apiCoreUtil.getKnowledgeTemplateGuid(knowledgeTemplateStr);
            articleData = {
                "knowledgeSet": `${knowledgeSetTitleStr}`,
                "title": `${knowledgeTitleStr}`,
                "templateId": `${knowledgeTemplateId}`,
                "categoryTier1": "Applications",
                "categoryTier2": "Help Desk",
                "categoryTier3": "Incident",
                "region": "Australia",
                "site": "Canberra",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United Kingdom Support",
                "assigneeSupportGroup": "GB Support 2",
                "assignee": "KMills",
                "articleDesc": `${knowledgeTitleStr} Desc`
            }
            articleDetails = await apiHelper.createKnowledgeArticle(articleData, attachmentFilePath);
        });

        it('[DRDMV-20718]: Verify that the newly created article with version displays on knowledge grid console', async () => {
            await navigationPage.signOut();
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            expect(await knowledgeConsole.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(articleDetails.displayId);
            expect(await viewKnowledgeArticlePo.isEditLinkDisplayedOnKA()).toBeTruthy('Article view screen is not displayed');
            expect(await viewKnowledgeArticlePo.isArticleVersionDisplayed()).toBeTruthy('Article version on View knowledge article is not displayed');
            let actualVersion = await viewKnowledgeArticlePo.getArticleVersion();
            actualDate = await viewKnowledgeArticlePo.formatDate();
            let expectedVersion = "Version " + "1" + " - " + actualDate;
            expect(actualVersion).toBe(expectedVersion);
            await editKnowledgePage.setKnowledgeStatus('Draft');
            expect(await editKnowledgePage.getStatusValue()).toContain('Draft', 'Article is updated with Draft status.');
            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(minorEditOption)).toBeFalsy('Minor Edit Option is displayed for Draft Knowledge Article.');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(majorEditOption)).toBeFalsy('Major Edit Option is displayed for Draft Knowledge Article.');
            await editKnowledgePage.clickArticleCancelButton();
            await utilCommon.clickOnWarningOk();
            await statusBladeKnowledgeArticlePo.setKnowledgeStatusWithReviewerDetails('SME Review', 'Petramco', 'Australia Support', 'AU Support 3', 'Kane Williamson');
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            await browser.sleep(5000); // Hard wait to load the tab properly
            expect(await knowledgeConsole.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(articleDetails.displayId);
            expect(await viewKnowledgeArticlePo.isReviewMessageDisplayed('Knowledge Article is in Review')).toBeTruthy();
            await viewKnowledgeArticlePo.clickReviewPendingLink();
            await reviewCommentsPo.setTextInTellUsMore(articleDetails.displayId);
            await reviewCommentsPo.clickApprovedButton();
            await browser.sleep(3000); //Hard ward to load tab completely
            await utilityCommon.refresh();
            await browser.sleep(3000); //Hard ward to load tab completely
            expect(await editKnowledgePage.getStatusValue()).toContain('Published', 'Article is updated with Published status.');
        });

        it('[DRDMV-20718]: Verify that the newly created article with version displays on knowledge grid console', async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.updateKnowledgeArticleViewAndHelpFulCounter(articleDetails.id, articleHelpFulCounterData);
            await utilityCommon.refresh();
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            await editKnowledgePage.selectIsExternalOption('Yes');
            await editKnowledgePage.enterKeyword(articleDetails.displayId);
            await editKnowledgePage.clickSaveKnowledgeMetadata();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy();
            await utilityCommon.closePopUpMessage();
            await viewKnowledgeArticlePo.clickOnFlagButton();
            await flagUnflagKnowledgePo.setTextInTellUsMore(articleDetails.displayId);
            await flagUnflagKnowledgePo.clickOnFlageButtonOnBlade();
            expect(await utilityCommon.isPopUpMessagePresent('You have successfully flagged the article.')).toBeTruthy('Article Not Flagged');
            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(minorEditOption)).toBeTruthy('Minor Edit Option is displayed for Published Knowledge Article.');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(majorEditOption)).toBeTruthy('Major Edit Option is displayed for Published Knowledge Article.');
            await editKnowledgePage.selectArticleEditOption(majorEditOption);
            expect(await editKnowledgePage.getHelpTextForMajorEditOptionDisplayed()).toBe(majorEditHelpText);
            await editKnowledgePage.updateKnowledgeArticleTitle(updatedArticleTitle);
            await editKnowledgePage.clickArticleMajorEditSaveButton();
            await browser.sleep(4000); // Hard wait to load the browser tab completely
            await utilityCommon.refresh();
            await browser.sleep(4000); // Hard wait to load the browser tab completely
            let updatedVersion = "Version " + "2" + " - " + actualDate;
            expect(await viewKnowledgeArticlePo.getArticleVersion()).toBe(updatedVersion);
            console.log(updatedVersion);
            console.log(await viewKnowledgeArticlePo.getArticleVersion());

            expect(await viewKnowledgeArticlePo.getKnowledgeArticleTitle()).toBe(updatedArticleTitle);
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();

            await loginPage.login('elizabeth');
            await navigationPage.gotoKnowledgeConsole();
            await browser.sleep(5000);// Hard wait to load the tab properly
            expect(await knowledgeConsole.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilityGrid.clearFilter();
            await knowledgeConsole.addColumnOnGrid(versionFieldColumns);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFields)).toBe(true);
            await knowledgeConsole.searchOnGridConsole(updatedArticleTitle);
            let updatedVersionNum = await knowledgeConsole.getSelectedGridRecordValue(versionColumn);
            expect(updatedVersionNum).toBe(expectedUpdatedVersionNum);
            await knowledgeConsole.searchOnGridConsole(knowledgeTitleStr);
            let previousVersionNum = await knowledgeConsole.getSelectedGridRecordValue(versionColumn);
            expect(previousVersionNum).toBe(expectedPreviousVersionNum);
            await knowledgeConsole.removeColumnOnGrid(versionFieldColumns);
        });

        afterAll(async () => {
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        });
    });

    //skhobrag
    describe('[DRDMV-20753]: Verify the behavior when the article with current version is canceled and user tries to create a new version after canceled operation', () => {
        let knowledgeTitleStr = 'Versioning for article' + "_" + randomStr;
        let articleAccessPermission: string[] = ['GB Support 2', 'Petramco', 'Kane Williamson'];
        let updatedArticleAccessPermission: string[] = ['GB Support 2', 'Employee Relations', 'Petramco', 'Kane Williamson'];
        let articleAttachments = ['articleStatus.png'];
        let articleAccessPermissionUser: string[] = ['Kane Williamson'];
        let updatedArticleTitle = "updated article title" + "_" + randomStr;
        let updatedArticleDesc = "updated article description";
        let articleData = undefined;
        let articleHelpFulCounterData = {
            linkedCounter: 182,
            helpfulPercentage: 81,
            helpfulCounter: 110,
            viewCounter: 56,
            notHelpfulCounter: 12
        }
        let articleDetails = undefined;
        let articleKeywordsVal: string[] = undefined;
        let updatedVersion = undefined;
        let actualDate = undefined;

        beforeAll(async () => {
            await apiHelper.apiLogin(caseAgentUser);
            let knowledgeTemplateId = await apiCoreUtil.getKnowledgeTemplateGuid(knowledgeTemplateStr);
            articleData = {
                "knowledgeSet": `${knowledgeSetTitleStr}`,
                "title": `${knowledgeTitleStr}`,
                "templateId": `${knowledgeTemplateId}`,
                "categoryTier1": "Applications",
                "categoryTier2": "Help Desk",
                "categoryTier3": "Incident",
                "region": "Australia",
                "site": "Canberra",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United Kingdom Support",
                "assigneeSupportGroup": "GB Support 2",
                "assignee": "KMills",
                "articleDesc": `${knowledgeTitleStr} Desc`
            }
            articleDetails = await apiHelper.createKnowledgeArticle(articleData, attachmentFilePath);
            articleKeywordsVal = ['MyKeyword', `${articleDetails.displayId}`];
            console.log('Article Id:', articleDetails.displayId);

        });

        it('[DRDMV-20753]: Verify the behavior when the article with current version is canceled and user tries to create a new version after canceled operation', async () => {
            await navigationPage.signOut();
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            expect(await knowledgeConsole.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(articleDetails.displayId);
            expect(await viewKnowledgeArticlePo.isEditLinkDisplayedOnKA()).toBeTruthy('Article view screen is not displayed');
            expect(await viewKnowledgeArticlePo.isArticleVersionDisplayed()).toBeTruthy('Article version on View knowledge article is not displayed');
            let actualVersion = await viewKnowledgeArticlePo.getArticleVersion();
            actualDate = await viewKnowledgeArticlePo.formatDate();
            let expectedVersion = "Version " + "1" + " - " + actualDate;
            expect(actualVersion).toBe(expectedVersion);
            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(minorEditOption)).toBeFalsy('Minor Edit Option is displayed for In Progress Knowledge Article.');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(majorEditOption)).toBeFalsy('Major Edit Option is displayed for In Progress Knowledge Article.');
            await editKnowledgePage.clickArticleCancelButton();
            await utilCommon.clickOnWarningOk();
            await editKnowledgePage.setKnowledgeStatus('Draft');
            expect(await editKnowledgePage.getStatusValue()).toContain('Draft', 'Article is updated with Draft status.');
            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(minorEditOption)).toBeFalsy('Minor Edit Option is displayed for Draft Knowledge Article.');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(majorEditOption)).toBeFalsy('Major Edit Option is displayed for Draft Knowledge Article.');
            await editKnowledgePage.clickArticleCancelButton();
            await utilCommon.clickOnWarningOk();
        });
        it('[DRDMV-20753]: Verify the behavior when the article with current version is canceled and user tries to create a new version after canceled operation', async () => {
            await statusBladeKnowledgeArticlePo.setKnowledgeStatusWithReviewerDetails('SME Review', 'Petramco', 'Australia Support', 'AU Support 3', 'Kane Williamson');
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            await browser.sleep(4000); // Hard wait for page load
            expect(await knowledgeConsole.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(articleDetails.displayId);
            expect(await viewKnowledgeArticlePo.isReviewMessageDisplayed('Knowledge Article is in Review')).toBeTruthy();
            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(minorEditOption)).toBeFalsy('Minor Edit Option is displayed for SME Review Knowledge Article.');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(majorEditOption)).toBeFalsy('Major Edit Option is displayed for SME Review Knowledge Article.');
            await editKnowledgePage.clickArticleCancelButton();
            await utilCommon.clickOnWarningOk();
            await viewKnowledgeArticlePo.clickReviewPendingLink();
            await reviewCommentsPo.setTextInTellUsMore(articleDetails.displayId);
            await reviewCommentsPo.clickApprovedButton();
            await browser.sleep(2000);
            await utilityCommon.refresh();
            await browser.sleep(2000);
            expect(await editKnowledgePage.getStatusValue()).toContain('Published', 'Article is updated with Published status.');
        });

        it('[DRDMV-20753]: Verify the behavior when the article with current version is canceled and user tries to create a new version after canceled operation', async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.updateKnowledgeArticleViewAndHelpFulCounter(articleDetails.id, articleHelpFulCounterData);
            await utilityCommon.refresh();
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            await editKnowledgePage.selectIsExternalOption('Yes');
            await editKnowledgePage.enterKeyword(articleDetails.displayId);
            await editKnowledgePage.clickSaveKnowledgeMetadata();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy();
            await utilityCommon.closePopUpMessage();
            await viewKnowledgeArticlePo.clickOnFlagButton();
            await flagUnflagKnowledgePo.setTextInTellUsMore(articleDetails.displayId);
            await flagUnflagKnowledgePo.clickOnFlageButtonOnBlade();
            expect(await utilityCommon.isPopUpMessagePresent('You have successfully flagged the article.')).toBeTruthy('Article Not Flagged');
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleTitle()).toBe(knowledgeTitleStr);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleDescription()).toBe(articleData.articleDesc);
            expect(await viewKnowledgeArticlePo.getKnowledgeSet()).toBe(knowledgeSetTitleStr);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleCompany()).toBe(articleData.assignedCompany);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleAuthor()).toBe('Qianru Tao');
            expect(await viewKnowledgeArticlePo.getCategoryTier1Value()).toBe(articleData.categoryTier1);
            expect(await viewKnowledgeArticlePo.getCategoryTier2Value()).toBe(articleData.categoryTier2);
            expect(await viewKnowledgeArticlePo.getCategoryTier3Value()).toBe(articleData.categoryTier3);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleAssigneeGroupValue()).toBe(articleData.assigneeSupportGroup);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleAccessPermissionGroupDetails()).toEqual(articleAccessPermission);
            expect(await viewKnowledgeArticlePo.getArticleViewCounter()).toContain(articleHelpFulCounterData.viewCounter.toString());
            expect(await viewKnowledgeArticlePo.getArticleHelpfulCounter()).toContain(articleHelpFulCounterData.helpfulPercentage.toString());
            expect(await viewKnowledgeArticlePo.getRegionValue()).toBe(articleData.region);
            expect(await viewKnowledgeArticlePo.getSiteValue()).toBe(articleData.site);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleLocalValue()).toBe('English');
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleAttachments()).toEqual(articleAttachments);
            expect(await viewKnowledgeArticlePo.getAssigneeValue()).toBe('Kyle Mills');
            expect(await viewKnowledgeArticlePo.getArticleReviewerUser()).toBe('Kane Williamson');
            expect(await viewKnowledgeArticlePo.getArticleReviewerGroup()).toBe('AU Support 3');
            expect(await viewKnowledgeArticlePo.getArticleIsExternalValue()).toBe('Yes');
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleKeywords()).toEqual(articleKeywordsVal);
            expect(await viewKnowledgeArticlePo.isFlagArticleOptionDisplayed()).toBeFalsy('Flag Article option is displayed.');
            expect(await viewKnowledgeArticlePo.isUnFlagArticleOptionDisplayed()).toBeTruthy('UnFlag Article option is displayed.');

            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(minorEditOption)).toBeTruthy('Minor Edit Option is displayed for Published Knowledge Article.');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(majorEditOption)).toBeTruthy('Major Edit Option is displayed for Published Knowledge Article.');
            await editKnowledgePage.selectArticleEditOption(majorEditOption);
            expect(await editKnowledgePage.getHelpTextForMajorEditOptionDisplayed()).toBe(majorEditHelpText);
            await editKnowledgePage.updateKnowledgeArticleTitle(updatedArticleTitle);
            await editKnowledgePage.updateKnowledgeArticleDescription(updatedArticleDesc);
            await editKnowledgePage.clickArticleMajorEditSaveButton();
        });
        it('[DRDMV-20753]: Verify the behavior when the article with current version is canceled and user tries to create a new version after canceled operation', async () => {
            await navigationPage.gotoKnoweldgeConsoleFromKM();
            await utilityGrid.sortGridColumn('Created Date', 'desc');
            await utilityGrid.searchAndOpenHyperlink(articleDetails.displayId);
            //await utilityCommon.refresh();
            await browser.sleep(2000);

            updatedVersion = "Version " + "2" + " - " + actualDate;
            expect(await viewKnowledgeArticlePo.getArticleVersion()).toBe(updatedVersion);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleTitle()).toBe(updatedArticleTitle);
            await viewKnowledgeArticlePo.clickEditKnowledgeAccess();
            await knowledgeAccessPage.clickOnAccessButton('Support Group Access');
            await knowledgeAccessPage.selectCompany('Petramco');
            await knowledgeAccessPage.selectBusinessUnit('HR Support');
            await knowledgeAccessPage.selectSupportGroup('Employee Relations');
            await knowledgeAccessPage.selectSupportGroupWriteAccess();
            await knowledgeAccessPage.clickAddSupportGroupAccessButton();
            await knowledgeAccessPage.clickCloseKnowledgeAccessBlade();
            await browser.sleep(2000);
            await utilityCommon.refresh();
            await browser.sleep(2000);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleDescription()).toBe(updatedArticleDesc);
            expect(await viewKnowledgeArticlePo.getKnowledgeSet()).toBe(knowledgeSetTitleStr);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleCompany()).toBe(articleData.assignedCompany);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleAuthor()).toBe('Kane Williamson');
            expect(await viewKnowledgeArticlePo.getCategoryTier1Value()).toBe(articleData.categoryTier1);
            expect(await viewKnowledgeArticlePo.getCategoryTier2Value()).toBe(articleData.categoryTier2);
            expect(await viewKnowledgeArticlePo.getCategoryTier3Value()).toBe(articleData.categoryTier3);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleAssigneeGroupValue()).toBe(articleData.assigneeSupportGroup);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleAccessPermissionGroupDetails()).toEqual(updatedArticleAccessPermission);
            expect(await viewKnowledgeArticlePo.getArticleViewCounter()).toContain(articleHelpFulCounterData.viewCounter.toString());
            expect(await viewKnowledgeArticlePo.getArticleHelpfulCounter()).toContain(articleHelpFulCounterData.helpfulPercentage.toString());
            expect(await viewKnowledgeArticlePo.getRegionValue()).toBe(articleData.region);
            expect(await viewKnowledgeArticlePo.getSiteValue()).toBe(articleData.site);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleLocalValue()).toBe('English');
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleAttachments()).toEqual(articleAttachments);
            expect(await viewKnowledgeArticlePo.getAssigneeValue()).toBe('Kyle Mills');
            expect(await viewKnowledgeArticlePo.isArticleReviewerUserDisplayed()).toBeFalsy('Article Reviewer user is displayed on new version of an article.');
            expect(await viewKnowledgeArticlePo.isArticleReviewerGroupDisplayed()).toBeFalsy('Article Reviewer Group is displayed on new version of an article.');
            expect(await viewKnowledgeArticlePo.isArticleLastReviewDateDisplayed()).toBeFalsy('Article Last Review Date is displayed on new version of an article.');
            expect(await viewKnowledgeArticlePo.isArticleNextReviewDateDisplayed()).toBeFalsy('Article Next Review Date  is displayed on new version of an article.');
            expect(await viewKnowledgeArticlePo.isArticleIsExternalValueDisplayed()).toBeFalsy('Article IsExternal Flag is displayed on new Draft version of an article.');
            expect(await viewKnowledgeArticlePo.isArticleIsExternalValueDisplayed()).toBeFalsy('External Field is visible');
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleKeywords()).toEqual(articleKeywordsVal);
            expect(await viewKnowledgeArticlePo.isFlagArticleOptionDisplayed()).toBeFalsy('Flag Article option is displayed.');
            expect(await viewKnowledgeArticlePo.isUnFlagArticleOptionDisplayed()).toBeTruthy('UnFlag Article option is displayed.');
            await viewKnowledgeArticlePo.clickOnTab(activityTabStr);
            await activityTabPo.clickOnRefreshButton();
            expect(await activityTabPo.getFirstPostContent()).toContain('Kane Williamson created a new version.', 'content not displaying on Activity');
        });

        it('[DRDMV-20753]: Verify the behavior when the article with current version is canceled and user tries to create a new version after canceled operation', async () => {
            await editKnowledgePage.setKnowledgeStatus('Request Cancelation');
            await navigationPage.gotoKnoweldgeConsoleFromKM();
            await utilityGrid.searchAndOpenHyperlink(articleDetails.displayId);
            await browser.sleep(2000);
            await utilityCommon.refresh();
            await browser.sleep(2000);
            expect(await editKnowledgePage.getStatusValue()).toContain('Canceled', 'Article is updated with Draft status.');
            await viewKnowledgeArticlePo.selectArticleVersion('1');
            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(minorEditOption)).toBeTruthy('Minor Edit Option is displayed for Published Knowledge Article.');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(majorEditOption)).toBeTruthy('Major Edit Option is displayed for Published Knowledge Article.');
            await editKnowledgePage.selectArticleEditOption(majorEditOption);
            await editKnowledgePage.updateKnowledgeArticleTitle(updatedArticleTitle + "_for Version 3");
            await editKnowledgePage.updateKnowledgeArticleDescription(updatedArticleDesc + "_for Version 3");
            await editKnowledgePage.clickArticleMajorEditSaveButton();
            await browser.sleep(2000);
        });
        it('[DRDMV-20753]: Verify the behavior when the article with current version is canceled and user tries to create a new version after canceled operation', async () => {
            await navigationPage.gotoKnoweldgeConsoleFromKM();
            await utilityGrid.searchAndOpenHyperlink(articleDetails.displayId);
            updatedVersion = "Version " + "3" + " - " + actualDate;
            expect(await viewKnowledgeArticlePo.getArticleVersion()).toBe(updatedVersion);
            expect(await editKnowledgePage.getStatusValue()).toContain('Draft', 'Article is updated with Published status.');
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleTitle()).toBe(updatedArticleTitle + "_for Version 3");
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleDescription()).toBe(updatedArticleDesc + "_for Version 3");
            expect(await viewKnowledgeArticlePo.getKnowledgeSet()).toBe(knowledgeSetTitleStr);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleCompany()).toBe(articleData.assignedCompany);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleAuthor()).toBe('Kane Williamson');
            expect(await viewKnowledgeArticlePo.getCategoryTier1Value()).toBe(articleData.categoryTier1);
            expect(await viewKnowledgeArticlePo.getCategoryTier2Value()).toBe(articleData.categoryTier2);
            expect(await viewKnowledgeArticlePo.getCategoryTier3Value()).toBe(articleData.categoryTier3);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleAssigneeGroupValue()).toBe(articleData.assigneeSupportGroup);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleAccessPermissionGroupDetails()).toEqual(articleAccessPermission);
            expect(await viewKnowledgeArticlePo.getArticleViewCounter()).toContain(articleHelpFulCounterData.viewCounter.toString());
            expect(await viewKnowledgeArticlePo.getArticleHelpfulCounter()).toContain(articleHelpFulCounterData.helpfulPercentage.toString());
            expect(await viewKnowledgeArticlePo.getRegionValue()).toBe(articleData.region);
            expect(await viewKnowledgeArticlePo.getSiteValue()).toBe(articleData.site);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleLocalValue()).toBe('English');
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleAttachments()).toEqual(articleAttachments);
            expect(await viewKnowledgeArticlePo.isArticleReviewerUserDisplayed()).toBeFalsy('Article Reviewer user is displayed on new version of an article.');
            expect(await viewKnowledgeArticlePo.isArticleReviewerGroupDisplayed()).toBeFalsy('Article Reviewer Group is displayed on new version of an article.');
            expect(await viewKnowledgeArticlePo.isArticleLastReviewDateDisplayed()).toBeFalsy('Article Last Review Date is displayed on new version of an article.');
            expect(await viewKnowledgeArticlePo.isArticleNextReviewDateDisplayed()).toBeFalsy('Article Next Review Date  is displayed on new version of an article.');
            expect(await viewKnowledgeArticlePo.isArticleIsExternalValueDisplayed()).toBeFalsy('Article IsExternal Flag is displayed on new Draft version of an article.')
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleKeywords()).toEqual(articleKeywordsVal);
            expect(await viewKnowledgeArticlePo.getAssigneeValue()).toBe('Kyle Mills');
            expect(await viewKnowledgeArticlePo.isFlagArticleOptionDisplayed()).toBeFalsy('Flag Article option is displayed.');
            expect(await viewKnowledgeArticlePo.isUnFlagArticleOptionDisplayed()).toBeTruthy('UnFlag Article option is displayed.');
            await viewKnowledgeArticlePo.clickOnTab(activityTabStr);
            await activityTabPo.clickOnRefreshButton();
            expect(await activityTabPo.getFirstPostContent()).toContain('Kane Williamson created a new version.', 'content not displaying on Activity');
        });

        afterAll(async () => {
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        });
    });

    //skhobrag
    describe('[DRDMV-20748]:  Verify whether the user with appropriate knowledge permission roles can able to update the article with updated / new version', () => {
        let knowledgeTitleStr = 'Versioning for article' + "_" + randomStr;
        let articleData = undefined;
        let articleHelpFulCounterData = {
            linkedCounter: 182,
            helpfulPercentage: 81,
            helpfulCounter: 110,
            viewCounter: 56,
            notHelpfulCounter: 12
        }
        let articleDetails = undefined;

        beforeAll(async () => {
            await apiHelper.apiLogin(caseAgentUser);
            let knowledgeTemplateId = await apiCoreUtil.getKnowledgeTemplateGuid(knowledgeTemplateStr);
            articleData = {
                "knowledgeSet": `${knowledgeSetTitleStr}`,
                "title": `${knowledgeTitleStr}`,
                "templateId": `${knowledgeTemplateId}`,
                "categoryTier1": "Applications",
                "categoryTier2": "Help Desk",
                "categoryTier3": "Incident",
                "region": "Australia",
                "site": "Canberra",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United Kingdom Support",
                "assigneeSupportGroup": "GB Support 2",
                "assignee": "KMills",
                "articleDesc": `${knowledgeTitleStr} Desc`
            }
            articleDetails = await apiHelper.createKnowledgeArticle(articleData, attachmentFilePath);
        });

        it('[DRDMV-20748]:  Verify whether the user with appropriate knowledge permission roles can able to update the article with updated / new version', async () => {
            await navigationPage.signOut();
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            expect(await knowledgeConsole.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(articleDetails.displayId);
            expect(await viewKnowledgeArticlePo.isEditLinkDisplayedOnKA()).toBeTruthy('Article view screen is not displayed');
            expect(await viewKnowledgeArticlePo.isArticleVersionDisplayed()).toBeTruthy('Article version on View knowledge article is not displayed');
            let actualVersion = await viewKnowledgeArticlePo.getArticleVersion();
            let actualDate = await viewKnowledgeArticlePo.formatDate();
            let expectedVersion = "Version " + "1" + " - " + actualDate;
            expect(actualVersion).toBe(expectedVersion);
            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(minorEditOption)).toBeFalsy('Minor Edit Option is displayed for In Progress Knowledge Article.');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(majorEditOption)).toBeFalsy('Major Edit Option is displayed for In Progress Knowledge Article.');
            await editKnowledgePage.clickArticleCancelButton();
            await utilCommon.clickOnWarningOk();
            await editKnowledgePage.setKnowledgeStatus('Draft');
            expect(await editKnowledgePage.getStatusValue()).toContain('Draft', 'Article is updated with Draft status.');
        });
        it('[DRDMV-20748]:  Verify whether the user with appropriate knowledge permission roles can able to update the article with updated / new version', async () => {
            await viewKnowledgeArticlePo.clickEditKnowledgeAccess();
            await knowledgeAccessPage.clickOnAccessButton('Support Group Access');
            await knowledgeAccessPage.selectCompany('Petramco');
            await knowledgeAccessPage.selectBusinessUnit('Australia Support');
            await knowledgeAccessPage.selectSupportGroup('AU Support 1');
            await knowledgeAccessPage.selectSupportGroupWriteAccess();
            await knowledgeAccessPage.clickAddSupportGroupAccessButton();
            await knowledgeAccessPage.clickCloseKnowledgeAccessBlade();
        });
        it('[DRDMV-20748]:  Verify whether the user with appropriate knowledge permission roles can able to update the article with updated / new version', async () => {
            await viewKnowledgeArticlePo.clickEditKnowledgeAccess();
            await knowledgeAccessPage.clickOnAccessButton('Support Group Access');
            await knowledgeAccessPage.selectCompany('Petramco');
            await knowledgeAccessPage.selectBusinessUnit('India Support');
            await knowledgeAccessPage.selectSupportGroup('IN Support 2');
            await knowledgeAccessPage.clickAddSupportGroupAccessButton();
            await knowledgeAccessPage.clickCloseKnowledgeAccessBlade();
            await viewKnowledgeArticlePo.clickEditKnowledgeAccess();
            await knowledgeAccessPage.clickOnAccessButton('Support Group Access');
            await knowledgeAccessPage.selectCompany('Petramco');
            await knowledgeAccessPage.selectBusinessUnit('India Support');
            await knowledgeAccessPage.selectSupportGroup('IN Support 3');
            await knowledgeAccessPage.clickAddSupportGroupAccessButton();
            await knowledgeAccessPage.clickCloseKnowledgeAccessBlade();

            await viewKnowledgeArticlePo.clickEditKnowledgeAccess();
            await knowledgeAccessPage.clickOnAccessButton('Support Group Access');
            await knowledgeAccessPage.selectCompany('Petramco');
            await knowledgeAccessPage.selectBusinessUnit('United States Support');
            await knowledgeAccessPage.selectSupportGroup('US Support 1');
            await knowledgeAccessPage.clickAddSupportGroupAccessButton();
            await knowledgeAccessPage.clickCloseKnowledgeAccessBlade();

            await utilityCommon.refresh();

            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(minorEditOption)).toBeFalsy('Minor Edit Option is displayed for Draft Knowledge Article.');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(majorEditOption)).toBeFalsy('Major Edit Option is displayed for Draft Knowledge Article.');
            await editKnowledgePage.clickArticleCancelButton();
            await utilCommon.clickOnWarningOk();
            await statusBladeKnowledgeArticlePo.setKnowledgeStatusWithReviewerDetails('SME Review', 'Petramco', 'Australia Support', 'AU Support 3', 'Kane Williamson');
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
        });

        it('[DRDMV-20748]:  Verify whether the user with appropriate knowledge permission roles can able to update the article with updated / new version', async () => {
            await navigationPage.signOut();
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(articleDetails.displayId);
            expect(await viewKnowledgeArticlePo.isReviewMessageDisplayed('Knowledge Article is in Review')).toBeTruthy();
            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(minorEditOption)).toBeFalsy('Minor Edit Option is displayed for SME Review Knowledge Article.');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(majorEditOption)).toBeFalsy('Major Edit Option is displayed for SME Review Knowledge Article.');
            await editKnowledgePage.clickArticleCancelButton();
            await utilCommon.clickOnWarningOk();
            await viewKnowledgeArticlePo.clickReviewPendingLink();
            await reviewCommentsPo.setTextInTellUsMore(articleDetails.displayId);
            await reviewCommentsPo.clickApprovedButton();
            await browser.sleep(2000); //Hard ward to load tab completely
            await utilityCommon.refresh();
            await browser.sleep(2000); //Hard ward to load tab completely
            expect(await editKnowledgePage.getStatusValue()).toContain('Published', 'Article is updated with Published status.');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.updateKnowledgeArticleViewAndHelpFulCounter(articleDetails.id, articleHelpFulCounterData);
            await browser.sleep(2000); //Hard ward to load tab completely
            await utilityCommon.refresh();
            await browser.sleep(2000); //Hard ward to load tab completely
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            await editKnowledgePage.selectIsExternalOption('Yes');
            await editKnowledgePage.enterKeyword(articleDetails.displayId);
            await editKnowledgePage.clickSaveKnowledgeMetadata();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy();
            await utilityCommon.closePopUpMessage();
            await viewKnowledgeArticlePo.clickOnFlagButton();
            await flagUnflagKnowledgePo.setTextInTellUsMore(articleDetails.displayId);
            await flagUnflagKnowledgePo.clickOnFlageButtonOnBlade();

            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(articleDetails.displayId);
            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(minorEditOption)).toBeTruthy('Minor Edit Option is displayed for Published Knowledge Article.');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(majorEditOption)).toBeTruthy('Major Edit Option is displayed for Published Knowledge Article.');
            await editKnowledgePage.selectArticleEditOption(majorEditOption);
            expect(await editKnowledgePage.isHelpTextForMajorEditOptionDisplayed()).toBeTruthy('Major Edit Option helptext for knowledge publisher user with write access is not displayed.');
            expect(await editKnowledgePage.isMajorEditSaveButtonDisabled()).toBeFalsy('Major Edit Option is disabled for Knowledge publisher user with write access.');
            await editKnowledgePage.selectArticleEditOption(minorEditOption);
            expect(await editKnowledgePage.isHelpTextMinorEditOptionDisplayed()).toBeTruthy('Minor Edit Option helptext for knowledge publisher user with write access is not displayed.');
            expect(await editKnowledgePage.isMinorEditSaveButtonDisabled()).toBeFalsy('Minor Edit Option is disabled for Knowledge publisher user with write access.');
        });

        afterAll(async () => {
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        });

    });

    describe('[DRDMV-20758]:  Verify the article versioning with respect to custom status configuration', () => {

        beforeAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('dbomei');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Status Configuration', 'Configure Knowledge Status Transition - Business Workflows');
            await statusConfigPO.setCompanyDropdown('Psilon', 'knowledge');
            await statusConfigPO.clickEditLifeCycleLink();
            await statusConfigPO.clickEditStatus("Published");
            await statusConfigPO.renameExistingStatus('Released');
            await statusConfigPO.clickOnBackButton();
            await statusConfigPO.clickEditLifeCycleLink();
            await statusConfigPO.addCustomStatus('SME Review', 'Publish Approval', 'BeforePublished');
            await statusConfigPO.addCustomStatus('Released', 'Retire Approval', 'AfterPublished');
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.switchToApplication(knowledgeManagementApp);
            await utilityCommon.switchToNewTab(1);
        });

        it('[DRDMV-20758]:  Verify the article versioning with respect to custom status configuration', async () => {
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate('Reference');
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField('DRDMV-20758 Title');
            await createKnowledgePage.setReferenceValue('DRDMV-20758 Reference data')
            await createKnowledgePage.selectKnowledgeSet(knowledgeSetTitleStr);
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await previewKnowledgePo.clickGoToArticleButton();
            await editKnowledgePage.setKnowledgeStatus('Draft');
            await utilityCommon.closePopUpMessage();
            await editKnowledgePage.setKnowledgeStatusWithoutSave('SME Review');
            await statusBladeKnowledgeArticlePo.clickChangeReviewerBtn();
            await changeAssignmentBlade.selectCompany('Psilon');
            await changeAssignmentBlade.selectBusinessUnit('Psilon Support Org1');
            await changeAssignmentBlade.selectSupportGroup('Psilon Support Group1');
            await changeAssignmentBlade.selectAssignee('Doomi Bomei');
            await changeAssignmentBlade.clickOnAssignButton();
            await editKnowledgePage.clickSaveStatusBtn();
            await viewKnowledgeArticlePo.clickReviewPendingLink();
            let knowledgeArticleDisplayId = await previewKnowledgePo.getKnowledgeArticleID();
            await reviewCommentsPo.setTextInTellUsMore('Approved Article');
            await reviewCommentsPo.clickApprovedButton();
            await utilityCommon.closePopUpMessage();
            await navigationPage.gotoKnoweldgeConsoleFromKM();
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(knowledgeArticleDisplayId);
            expect(await viewKnowledgeArticlePo.getStatusValue()).toContain('BeforePublished', 'value is not matched with status');
            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed('Major Edit')).toBeFalsy('Versions Edit is displayed');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed('Minor Edit')).toBeFalsy('Versions Edit is displayed');
            await editKnowledgePage.clickArticleCancelButton();
            await editKnowledgePage.setKnowledgeStatus('Publish Approval');
            await utilityCommon.closePopUpMessage();
            await navigationPage.gotoKnoweldgeConsoleFromKM();
            await utilityGrid.searchAndOpenHyperlink(knowledgeArticleDisplayId);
            expect(await viewKnowledgeArticlePo.getStatusValue()).toContain('Released', 'value is not matched with status');
            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed('Major Edit')).toBeTruthy('Versions Edit is displayed');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed('Minor Edit')).toBeTruthy('Versions Edit is displayed');
            await editKnowledgePage.clickArticleCancelButton();
            await editKnowledgePage.setKnowledgeStatus('AfterPublished');
            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed('Major Edit')).toBeFalsy('Versions Edit is displayed');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed('Minor Edit')).toBeFalsy('Versions Edit is displayed');
            await editKnowledgePage.clickArticleCancelButton();
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi')
        });
    });
});
