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
import editKnowledgeAccessPage from '../../pageobject/knowledge/edit-knowledge-access.po';
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
import utilGrid from "../../utils/util.grid";
import utilityCommon from '../../utils/utility.common';

let caseBAUser = 'qkatawazi';
let caseAgentUser = 'qtao';
let caseManagerUser = 'qdu';
let knowledgeCandidateUser = 'kayo';
let knowledgeContributorUser = 'kkohri';
let knowledgePublisherUser = 'kmills';
let knowledgeCoachUser = 'kWilliamson';
let versionColumn = 'Version';
let categoryTier1FieldVal = 'Applications';
let knowledgeManagementApp = "Knowledge Management";
let knowledgeArticlesTitleStr = "Knowledge Articles";
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
let minorEditOption = 'Minor Edit';
let majorEditOption = 'Major Edit';
let versionField = "Version";
let versionFieldVal = "1";
let RecommendedKnowledgeStr = "Recommended Knowledge ";
let resourcesTabStr = "Resources";
let activityTabStr = "Activity";
let knowledgeCandidateUserReadAccess = "kdiva";
let knowledgeContributorUserReadAccess = "kwilson";
let knowledgePublisherUserReadAccess = "kjenner";
let knowledgeCoachUserReadAccess = "kbell";
let knowledgeCandidateUserWriteAccess = "kwethington";
let knowledgeContributorUserWriteAccess = "kwilliams";

describe('Knowledge Articles - Versioning Tests', () => {
    const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
    let versionNum = [...Array(1)].map(i => (~~(Math.random() * 2)));

    const knowledgeSetTitleStr = 'versionedKnowledgeSet_' + randomStr;
    const knowledgeTemplateStr = 'VersionedArticleTemplate_' + randomStr;
    const attachmentFilePath = 'e2e/data/ui/attachment/articleStatus.png';
    const minorEditHelpText = `Submitting your changes will edit the existing Version 1`;
    const majorEditHelpText = `Submitting your changes will create Version 2`;
    const majorEditHelpTextForUpdatedVersion = `Submitting your changes will create Version 3`;

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login(caseBAUser);
        await apiHelper.apiLogin(knowledgeCoachUser);
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

        await apiHelper.apiLogin('elizabeth');
        let knowledgeSet = await apiHelper.createKnowledgeSet(knowledgeSetData);
        await apiHelper.createKnowledgeArticleTemplate(knowledgeSetData.knowledgeSetTitle, knowledgeSet.id, knowledgeArticleTemplateData);
    });
    afterEach(async () => {
        await utilityCommon.refresh();
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    //skhobrag
    it('[DRDMV-20656]: Verify that the newly created article shows the article version', async () => {
        let knowledgeTitleStr = 'Versioning for article' + "_" + randomStr;
        let knowledgeRefStr = 'KnowledgeReference' + randomStr;
        try {
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
            await previewKnowledgePo.clickOnViewArticleLink();
            await utilityCommon.switchToNewTab(1);
            expect(await viewKnowledgeArticlePo.isEditLinkDisplayedOnKA()).toBeTruthy('Article view screen is not displayed');
            expect(await viewKnowledgeArticlePo.isArticleVersionDisplayed()).toBeTruthy('Article version on View knowledge article is not displayed');
            let actualVersion = await viewKnowledgeArticlePo.getArticleVersion();
            let actualDate = await viewKnowledgeArticlePo.formatDate();
            console.log(actualDate);
            let expectedVersion = "Version " + "1" + " - " + actualDate;
            expect(actualVersion).toBe(expectedVersion);
        }
        catch (e) {
            throw e;
        }
        finally {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await utilityCommon.refresh();
            await utilCommon.waitUntilSpinnerToHide();
        }
    });//, 150 * 1000);

    //skhobrag
    it('[DRDMV-20742]: Verify the functionality of Edit article with Minor Edit button', async () => {
        let knowledgeTitleStr = 'Versioning for article' + "_" + randomStr;
        let knowledgeTemplateId = await apiCoreUtil.getKnowledgeTemplateGuid(knowledgeTemplateStr);
        let articleAccessPermission: string[] = ['GB Support 2', 'Petramco'];
        let articleAttachments = ['articleStatus.png'];
        let articleAccessPermissionUser: string[] = ['Kane Williamson'];
        let updatedArticleTitle = "updated article title" + "_" + randomStr;
        let updatedArticleDesc = "updated article description";

        await apiHelper.apiLogin(caseAgentUser);
        let articleData = {
            "knowledgeSet": `${knowledgeSetTitleStr}`,
            "title": `${knowledgeTitleStr}`,
            "templateId": `${knowledgeTemplateId}`,
            "categoryTier1": "Applications",
            "categoryTier2": "Help Desk",
            "categoryTier3": "Incident",
            "region": "Australia",
            "site": "Canberra",
            "assignedCompany":"Petramco",
            "assigneeBusinessUnit":"United Kingdom Support",
            "assigneeSupportGroup":"GB Support 1",
            "assignee": "KMills",
            "articleDesc": `${knowledgeTitleStr} Desc`
        }
        let articleHelpFulCounterData = {
            linkedCounter: 182,
            helpfulPercentage: 81,
            helpfulCounter: 110,
            viewCounter: 56,
            notHelpfulCounter: 12
        }

        let articleDetails = await apiHelper.createKnowledgeArticle(articleData, attachmentFilePath);

        try {
            await navigationPage.signOut();
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            expect(await knowledgeConsole.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(articleDetails.displayId);
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
            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(minorEditOption)).toBeFalsy('Minor Edit Option is displayed for Draft Knowledge Article.');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(majorEditOption)).toBeFalsy('Major Edit Option is displayed for Draft Knowledge Article.');
            await editKnowledgePage.clickArticleCancelButton();
            await utilCommon.clickOnWarningOk();
            await statusBladeKnowledgeArticlePo.setKnowledgeStatusWithReviewerDetails('SME Review', 'Petramco', 'Australia support', 'AU Support 3', 'Kane Williamson');
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(articleDetails.displayId);
            expect(await viewKnowledgeArticlePo.isReviewMessageDisplayed('Knowledge Article is in Review')).toBeTruthy();
            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(minorEditOption)).toBeFalsy('Minor Edit Option is displayed for SME Review Knowledge Article.');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(majorEditOption)).toBeFalsy('Major Edit Option is displayed for SME Review Knowledge Article.');
            await editKnowledgePage.clickArticleCancelButton();
            await utilCommon.clickOnWarningOk();
            await viewKnowledgeArticlePo.clickReviewPendingLink();
            await reviewCommentsPo.setTextInTellUsMore(articleDetails.displayId);
            await reviewCommentsPo.clickApprovedButton();
            await utilityCommon.refresh();
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
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleAccessPermissionUsersDetails()).toEqual(articleAccessPermissionUser);
            expect(await viewKnowledgeArticlePo.getArticleViewCounter()).toContain(articleHelpFulCounterData.viewCounter.toString());
            expect(await viewKnowledgeArticlePo.getArticleHelpfulCounter()).toContain(articleHelpFulCounterData.helpfulPercentage.toString());
            expect(await viewKnowledgeArticlePo.getRegionValue()).toBe(articleData.region);
            expect(await viewKnowledgeArticlePo.getSiteValue()).toBe(articleData.site);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleLocalValue()).toBe('English');
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleAttachments()).toEqual(articleAttachments);
            expect(await viewKnowledgeArticlePo.getAssigneeValue()).toBe('Kyle Mills');
            expect(await viewKnowledgeArticlePo.getArticleReviewerUser()).toBe('Kane Williamson');
            expect(await viewKnowledgeArticlePo.getArticleReviewerGroup()).toBe('AU Support 3');
            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(minorEditOption)).toBeTruthy('Minor Edit Option is displayed for Published Knowledge Article.');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(majorEditOption)).toBeTruthy('Major Edit Option is displayed for Published Knowledge Article.');
            await editKnowledgePage.selectArticleEditOption(minorEditOption);
            expect(await editKnowledgePage.getHelpTextForMinorEditOptionDisplayed()).toBe(minorEditHelpText);
            await editKnowledgePage.updateKnowledgeArticleTitle(updatedArticleTitle);
            await editKnowledgePage.updateKnowledgeArticleDescription(updatedArticleDesc);
            await editKnowledgePage.clickOnSaveButtonOfKA();
            expect(await utilCommon.isPopUpMessagePresent('Saved successfully')).toBeTruthy();
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
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleAccessPermissionUsersDetails()).toEqual(articleAccessPermissionUser);
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

        }
        catch (e) {
            throw e;
        }
        finally {
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await utilityCommon.refresh();
            await utilCommon.waitUntilSpinnerToHide();
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        }
    }, 500 * 1000);

    //skhobrag
    it('[DRDMV-20746]: Verify the search based on version on knowledge article console', async () => {
        try {
            let knowledgeTitleStr = 'Versioning for article' + "_" + randomStr;
            let knowledgeTemplateId = await apiCoreUtil.getKnowledgeTemplateGuid(knowledgeTemplateStr);

            await apiHelper.apiLogin(caseAgentUser);
            let articleData = {
                "knowledgeSet": `${knowledgeSetTitleStr}`,
                "title": `${knowledgeTitleStr}`,
                "templateId": `${knowledgeTemplateId}`,
                "categoryTier1": "Applications",
                "categoryTier2": "Help Desk",
                "categoryTier3": "Incident",
                "region": "Australia",
                "site": "Canberra",
                "assignedCompany":"Petramco",
                "assigneeBusinessUnit":"United Kingdom Support",
                "assigneeSupportGroup":"GB Support 1",
                "assignee": "KMills",
                "articleDesc": `${knowledgeTitleStr} Desc`
            }

            let articleDetails = await apiHelper.createKnowledgeArticle(articleData, attachmentFilePath);

            let versionFieldColumn: string[] = ["Version"];
            let knowledgeGridColumnFields: string[] = ["Article ID", "Title", "Knowledge Set", "Status", "Assignee", "Company", "Template Name", "Reviewer", "Modified By", "Created Date", "Modified Date", "Flagged", "Version"];
            let knowledgeGridColumnFieldsWithoutVersion: string[] = ["Article ID", "Title", "Knowledge Set", "Status", "Assignee", "Company", "Template Name", "Reviewer", "Modified By", "Created Date", "Modified Date", "Flagged"];

            await navigationPage.gotoKnowledgeConsole();
            await utilGrid.clearFilter();
            await knowledgeConsole.addColumnOnGrid(versionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFields)).toBe(true);
            await utilGrid.searchOnGridConsole(versionFieldVal);
            let versionVal: string = await knowledgeConsole.getSelectedGridRecordValue(versionField);
            expect(versionVal).toEqual(versionFieldVal);
            await knowledgeConsole.removeColumnOnGrid(versionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFieldsWithoutVersion)).toBe(true);
            await utilGrid.searchOnGridConsole(versionFieldVal);
            versionVal = await knowledgeConsole.getSelectedGridRecordValue(versionField);
            expect(versionVal).toEqual(emptyStr);
            await utilGrid.addFilter(versionField, versionFieldVal, 'counter');
            expect(await utilGrid.isGridRecordPresent(knowledgeTitleStr)).toBeTruthy();
            await utilGrid.clearGridSearchBox();
            await navigationPage.signOut();

            await loginPage.login(caseManagerUser);
            await navigationPage.gotoKnowledgeConsole();
            await utilGrid.clearFilter();
            await knowledgeConsole.addColumnOnGrid(versionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFields)).toBe(true);
            await utilGrid.searchOnGridConsole(versionFieldVal);
            versionVal = await knowledgeConsole.getSelectedGridRecordValue(versionField);
            expect(versionVal).toEqual(versionFieldVal);
            await knowledgeConsole.removeColumnOnGrid(versionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFieldsWithoutVersion)).toBe(true);
            await utilGrid.searchOnGridConsole(versionFieldVal);
            versionVal = await knowledgeConsole.getSelectedGridRecordValue(versionField);
            expect(versionVal).toEqual(emptyStr);
            await utilGrid.addFilter(versionField, versionFieldVal, 'counter');
            expect(await utilGrid.isGridRecordPresent(knowledgeTitleStr)).toBeTruthy();
            await utilGrid.clearGridSearchBox();
            await navigationPage.signOut();

            await loginPage.login(caseAgentUser);
            await navigationPage.gotoKnowledgeConsole();
            await utilGrid.clearFilter();
            await knowledgeConsole.addColumnOnGrid(versionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFields)).toBe(true);
            await utilGrid.searchOnGridConsole(versionFieldVal);
            versionVal = await knowledgeConsole.getSelectedGridRecordValue(versionField);
            expect(versionVal).toEqual(versionFieldVal);
            await knowledgeConsole.removeColumnOnGrid(versionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFieldsWithoutVersion)).toBe(true);
            await utilGrid.searchOnGridConsole(versionFieldVal);
            versionVal = await knowledgeConsole.getSelectedGridRecordValue(versionField);
            expect(versionVal).toEqual(emptyStr);
            await utilGrid.addFilter(versionField, versionFieldVal, 'counter');
            expect(await utilGrid.isGridRecordPresent(knowledgeTitleStr)).toBeTruthy();
            await utilGrid.clearGridSearchBox();
            await navigationPage.signOut();

            await loginPage.login(knowledgeCandidateUser);
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            await utilGrid.clearFilter();
            await knowledgeConsole.addColumnOnGrid(versionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFields)).toBe(true);
            await utilGrid.searchOnGridConsole(versionFieldVal);
            versionVal = await knowledgeConsole.getSelectedGridRecordValue(versionField);
            expect(versionVal).toEqual(versionFieldVal);
            await knowledgeConsole.removeColumnOnGrid(versionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFieldsWithoutVersion)).toBe(true);
            await utilGrid.searchOnGridConsole(versionFieldVal);
            versionVal = await knowledgeConsole.getSelectedGridRecordValue(versionField);
            expect(versionVal).toEqual(emptyStr);
            await utilGrid.addFilter(versionField, versionFieldVal, 'counter');
            expect(await utilGrid.isGridRecordPresent(knowledgeTitleStr)).toBeTruthy();
            await utilGrid.clearGridSearchBox();
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();

            await loginPage.login(knowledgeContributorUser);
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            await utilGrid.clearFilter();
            await knowledgeConsole.addColumnOnGrid(versionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFields)).toBe(true);
            await utilGrid.searchOnGridConsole(versionFieldVal);
            versionVal = await knowledgeConsole.getSelectedGridRecordValue(versionField);
            expect(versionVal).toEqual(versionFieldVal);
            await knowledgeConsole.removeColumnOnGrid(versionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFieldsWithoutVersion)).toBe(true);
            await utilGrid.searchOnGridConsole(versionFieldVal);
            versionVal = await knowledgeConsole.getSelectedGridRecordValue(versionField);
            expect(versionVal).toEqual(emptyStr);
            await utilGrid.addFilter(versionField, versionFieldVal, 'counter');
            expect(await utilGrid.isGridRecordPresent(knowledgeTitleStr)).toBeTruthy();
            await utilGrid.clearGridSearchBox();
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();

            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            await utilGrid.clearFilter();
            await knowledgeConsole.addColumnOnGrid(versionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFields)).toBe(true);
            await utilGrid.searchOnGridConsole(versionFieldVal);
            versionVal = await knowledgeConsole.getSelectedGridRecordValue(versionField);
            expect(versionVal).toEqual(versionFieldVal);
            await knowledgeConsole.removeColumnOnGrid(versionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFieldsWithoutVersion)).toBe(true);
            await utilGrid.searchOnGridConsole(versionFieldVal);
            versionVal = await knowledgeConsole.getSelectedGridRecordValue(versionField);
            expect(versionVal).toEqual(emptyStr);
            await utilGrid.addFilter(versionField, versionFieldVal, 'counter');
            expect(await utilGrid.isGridRecordPresent(knowledgeTitleStr)).toBeTruthy();
            await utilGrid.clearGridSearchBox();
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();

            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            await utilGrid.clearFilter();
            await knowledgeConsole.addColumnOnGrid(versionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFields)).toBe(true);
            await utilGrid.searchOnGridConsole(versionFieldVal);
            versionVal = await knowledgeConsole.getSelectedGridRecordValue(versionField);
            expect(versionVal).toEqual(versionFieldVal);
            await knowledgeConsole.removeColumnOnGrid(versionFieldColumn);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFieldsWithoutVersion)).toBe(true);
            await utilGrid.searchOnGridConsole(versionFieldVal);
            versionVal = await knowledgeConsole.getSelectedGridRecordValue(versionField);
            expect(versionVal).toEqual(emptyStr);
            await utilGrid.addFilter(versionField, versionFieldVal, 'counter');
            expect(await utilGrid.isGridRecordPresent(knowledgeTitleStr)).toBeTruthy();
            await utilGrid.clearGridSearchBox();
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
        }
        catch (error) {
            throw error;
        }
        finally {
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await utilityCommon.refresh();
            await utilCommon.waitUntilSpinnerToHide();
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        }
    }, 400 * 1000);

    //skhobrag
    it('[DRDMV-20754]: Verify the search functionality of articles with versions from Case Edit > Resources screen', async () => {
        try {
            await navigationPage.gotoQuickCase();
            await quickCase.selectRequesterName(caseAgentUser);
            await quickCase.setCaseSummary(articleInDraftStatus);

            //Search with knowledge article with published status and different versions   
            await resources.clickOnAdvancedSearchOptions(RecommendedKnowledgeStr);
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(RecommendedKnowledgeStr)).toEqual(articleInDraftStatus);

            //Navigate to Create case
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary(articleInDraftStatus);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePage.clickOnTab(resourcesTabStr);

            //Search with knowledge article with published status and different versions
            await resources.clickOnAdvancedSearchOptions(knowledgeArticlesStr);
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInDraftStatus);
            await navigationPage.signOut();

            //Login with Case Manager
            await loginPage.login(caseManagerUser);
            await navigationPage.gotoQuickCase();
            await quickCase.selectRequesterName(caseAgentUser);
            await quickCase.setCaseSummary(articleInDraftStatus);

            //Search with knowledge article with published status and different versions            
            await resources.clickOnAdvancedSearchOptions(RecommendedKnowledgeStr);
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(RecommendedKnowledgeStr)).toEqual(articleInDraftStatus);

            //Navigate to Create case
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary(articleInDraftStatus);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePage.clickOnTab(resourcesTabStr);

            //Search with knowledge article with published status and different versions
            await resources.clickOnAdvancedSearchOptions(knowledgeArticlesStr);
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInDraftStatus);
            await navigationPage.signOut();

            //Login as Case Agent
            await loginPage.login(caseAgentUser);
            await navigationPage.gotoQuickCase();
            await quickCase.selectRequesterName(caseManagerUser);
            await quickCase.setCaseSummary(articleInDraftStatus);

            //Search with knowledge article with published status and different versions
            await resources.clickOnAdvancedSearchOptions(RecommendedKnowledgeStr);
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(RecommendedKnowledgeStr)).toEqual(articleInDraftStatus);

            //Navigate to Create case
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary(articleInDraftStatus);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePage.clickOnTab(resourcesTabStr);

            //Search with knowledge article with published status and different versions
            await resources.clickOnAdvancedSearchOptions(knowledgeArticlesStr);
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(knowledgeArticlesStr)).toEqual(articleInDraftStatus);
            await navigationPage.signOut();
        }
        catch (error) {
            throw error;
        }
        finally {
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await utilityCommon.refresh();
            await utilCommon.waitUntilSpinnerToHide();
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        }
    });

    //skhobrag
    it('[DRDMV-20743,DRDMV-20735]: Verify the functionality of Edit article with Major Edit button', async () => {
        let knowledgeTitleStr = 'Versioning for article' + "_" + randomStr;
        let knowledgeTemplateId = await apiCoreUtil.getKnowledgeTemplateGuid(knowledgeTemplateStr);
        let articleAccessPermission: string[] = ['GB Support 2', 'Petramco'];
        let articleAttachments = ['articleStatus.png'];
        let articleAccessPermissionUser: string[] = ['Kane Williamson'];
        let updatedArticleTitle = "updated article title" + "_" + randomStr;
        let updatedArticleDesc = "updated article description";

        await apiHelper.apiLogin(caseAgentUser);
        let articleData = {
            "knowledgeSet": `${knowledgeSetTitleStr}`,
            "title": `${knowledgeTitleStr}`,
            "templateId": `${knowledgeTemplateId}`,
            "categoryTier1": "Applications",
            "categoryTier2": "Help Desk",
            "categoryTier3": "Incident",
            "region": "Australia",
            "site": "Canberra",
            "assignedCompany":"Petramco",
            "assigneeBusinessUnit":"United Kingdom Support",
            "assigneeSupportGroup":"GB Support 1",
            "assignee": "KMills",
            "articleDesc": `${knowledgeTitleStr} Desc`
        }
        let articleHelpFulCounterData = {
            linkedCounter: 182,
            helpfulPercentage: 81,
            helpfulCounter: 110,
            viewCounter: 56,
            notHelpfulCounter: 12
        }
        let articleDetails = await apiHelper.createKnowledgeArticle(articleData, attachmentFilePath);
        let articleKeywordsVal: string[] = [`${articleDetails.displayId}`];

        try {
            await navigationPage.signOut();
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            expect(await knowledgeConsole.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(articleDetails.displayId);
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
            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(minorEditOption)).toBeFalsy('Minor Edit Option is displayed for Draft Knowledge Article.');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(majorEditOption)).toBeFalsy('Major Edit Option is displayed for Draft Knowledge Article.');
            await editKnowledgePage.clickArticleCancelButton();
            await utilCommon.clickOnWarningOk();
            await statusBladeKnowledgeArticlePo.setKnowledgeStatusWithReviewerDetails('SME Review', 'Petramco', 'Australia Support', 'AU Support 3', 'Kane Williamson');
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(articleDetails.displayId);
            expect(await viewKnowledgeArticlePo.isReviewMessageDisplayed('Knowledge Article is in Review')).toBeTruthy();
            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(minorEditOption)).toBeFalsy('Minor Edit Option is displayed for SME Review Knowledge Article.');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(majorEditOption)).toBeFalsy('Major Edit Option is displayed for SME Review Knowledge Article.');
            await editKnowledgePage.clickArticleCancelButton();
            await utilCommon.clickOnWarningOk();
            await viewKnowledgeArticlePo.clickReviewPendingLink();
            await reviewCommentsPo.setTextInTellUsMore(articleDetails.displayId);
            await reviewCommentsPo.clickApprovedButton();
            await utilityCommon.refresh();
            expect(await editKnowledgePage.getStatusValue()).toContain('Published', 'Article is updated with Published status.');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.updateKnowledgeArticleViewAndHelpFulCounter(articleDetails.id, articleHelpFulCounterData);
            await utilityCommon.refresh();
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            await editKnowledgePage.selectIsExternalOption('Yes');
            await editKnowledgePage.enterKeyword(articleDetails.displayId);
            await editKnowledgePage.clickSaveKnowledgeMetadata();
            await viewKnowledgeArticlePo.clickOnFlagButton();
            await flagUnflagKnowledgePo.setTextInTellUsMore(articleDetails.displayId);
            await flagUnflagKnowledgePo.clickOnFlageButtonOnBlade();
            expect(await utilCommon.isPopUpMessagePresent('You have successfully flagged the article.')).toBeTruthy('Article Not Flagged');
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
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleAccessPermissionUsersDetails()).toEqual(articleAccessPermissionUser);
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
            await browser.sleep(4000);
            await utilityCommon.refresh();
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
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleAccessPermissionUsersDetails()).toEqual(articleAccessPermissionUser);
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
            expect(await viewKnowledgeArticlePo.getArticleIsExternalValue()).toBe('');
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
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleAccessPermissionUsersDetails()).toEqual(articleAccessPermissionUser);
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
        }
        catch (e) {
            throw e;
        }
        finally {
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await utilityCommon.refresh();
            await utilCommon.waitUntilSpinnerToHide();
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        }
    }, 350 * 1000);

    //skhobrag
    it('[DRDMV-20744]: Verify the article status of previous version articles when the new versioned article is moved to Published status', async () => {
        let knowledgeTitleStr = 'Versioning for article' + "_" + randomStr;
        let knowledgeTemplateId = await apiCoreUtil.getKnowledgeTemplateGuid(knowledgeTemplateStr);
        let updatedArticleTitle = "updated article title" + "_" + randomStr;

        await apiHelper.apiLogin(caseAgentUser);
        let articleData = {
            "knowledgeSet": `${knowledgeSetTitleStr}`,
            "title": `${knowledgeTitleStr}`,
            "templateId": `${knowledgeTemplateId}`,
            "categoryTier1": "Applications",
            "categoryTier2": "Help Desk",
            "categoryTier3": "Incident",
            "region": "Australia",
            "site": "Canberra",
            "assignedCompany":"Petramco",
            "assigneeBusinessUnit":"United Kingdom Support",
            "assigneeSupportGroup":"GB Support 1",
            "assignee": "KMills",
            "articleDesc": `${knowledgeTitleStr} Desc`
        }
        let articleHelpFulCounterData = {
            linkedCounter: 182,
            helpfulPercentage: 81,
            helpfulCounter: 110,
            viewCounter: 56,
            notHelpfulCounter: 12
        }
        let articleDetails = await apiHelper.createKnowledgeArticle(articleData, attachmentFilePath);

        try {
            await navigationPage.signOut();
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            expect(await knowledgeConsole.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(articleDetails.displayId);
            expect(await viewKnowledgeArticlePo.isEditLinkDisplayedOnKA()).toBeTruthy('Article view screen is not displayed');
            expect(await viewKnowledgeArticlePo.isArticleVersionDisplayed()).toBeTruthy('Article version on View knowledge article is not displayed');
            let actualVersion = await viewKnowledgeArticlePo.getArticleVersion();
            let actualDate = await viewKnowledgeArticlePo.formatDate();
            let expectedVersion = "Version " + "1" + " - " + actualDate;
            expect(actualVersion).toBe(expectedVersion);
            await editKnowledgePage.setKnowledgeStatus('Draft');
            expect(await editKnowledgePage.getStatusValue()).toContain('Draft', 'Article is updated with Draft status.');
            await statusBladeKnowledgeArticlePo.setKnowledgeStatusWithReviewerDetails('SME Review', 'Petramco', 'Australia Support', 'AU Support 3', 'Kane Williamson');
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(articleDetails.displayId);
            expect(await viewKnowledgeArticlePo.isReviewMessageDisplayed('Knowledge Article is in Review')).toBeTruthy();
            await viewKnowledgeArticlePo.clickReviewPendingLink();
            await reviewCommentsPo.setTextInTellUsMore(articleDetails.displayId);
            await reviewCommentsPo.clickApprovedButton();
            await utilityCommon.refresh();
            expect(await editKnowledgePage.getStatusValue()).toContain('Published', 'Article is updated with Published status.');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.updateKnowledgeArticleViewAndHelpFulCounter(articleDetails.id, articleHelpFulCounterData);
            await utilityCommon.refresh();
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            await editKnowledgePage.selectIsExternalOption('Yes');
            await editKnowledgePage.enterKeyword(articleDetails.displayId);
            await editKnowledgePage.clickSaveKnowledgeMetadata();
            await viewKnowledgeArticlePo.clickOnFlagButton();
            await flagUnflagKnowledgePo.setTextInTellUsMore(articleDetails.displayId);
            await flagUnflagKnowledgePo.clickOnFlageButtonOnBlade();
            expect(await utilCommon.isPopUpMessagePresent('You have successfully flagged the article.')).toBeTruthy('Article Not Flagged');
            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(minorEditOption)).toBeTruthy('Minor Edit Option is displayed for Published Knowledge Article.');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(majorEditOption)).toBeTruthy('Major Edit Option is displayed for Published Knowledge Article.');
            await editKnowledgePage.selectArticleEditOption(majorEditOption);
            expect(await editKnowledgePage.getHelpTextForMajorEditOptionDisplayed()).toBe(majorEditHelpText);
            await editKnowledgePage.updateKnowledgeArticleTitle(updatedArticleTitle);
            await editKnowledgePage.clickArticleMajorEditSaveButton();
            await browser.sleep(4000);
            await utilityCommon.refresh();
            let updatedVersion = "Version " + "2" + " - " + actualDate;
            expect(await viewKnowledgeArticlePo.getArticleVersion()).toBe(updatedVersion);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleTitle()).toBe(updatedArticleTitle);
            await statusBladeKnowledgeArticlePo.setKnowledgeStatusWithReviewerDetails('SME Review', 'Petramco', 'Australia Support', 'AU Support 3', 'Kane Williamson');
            expect(await editKnowledgePage.getStatusValue()).toContain('SME Review', 'Article is updated with SME Review status.');
            expect(await viewKnowledgeArticlePo.isReviewMessageDisplayed('Knowledge Article is in Review')).toBeTruthy();
            await viewKnowledgeArticlePo.clickReviewPendingLink();
            await reviewCommentsPo.setTextInTellUsMore(articleDetails.displayId);
            await reviewCommentsPo.clickApprovedButton();
            await utilityCommon.refresh();
            expect(await editKnowledgePage.getStatusValue()).toContain('Published', 'Article is updated with Published status.');
            await viewKnowledgeArticlePo.selectArticleVersion('1');
            expect(await editKnowledgePage.getStatusValue()).toContain('Closed', 'Article is updated with Closed status.');
        }
        catch (e) {
            throw e;
        }
        finally {
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await utilityCommon.refresh();
            await utilCommon.waitUntilSpinnerToHide();
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        }
    }, 350 * 1000);

    //skhobrag
    it('[DRDMV-20752]: Verify the behavior when the user who does not have access to view current article version and he tries to create or update existing version', async () => {
        let knowledgeTitleStr = 'Versioning for article' + "_" + randomStr;
        let knowledgeTemplateId = await apiCoreUtil.getKnowledgeTemplateGuid(knowledgeTemplateStr);
        let updatedArticleTitle = "updated article title" + "_" + randomStr;

        await apiHelper.apiLogin(caseAgentUser);
        let articleData = {
            "knowledgeSet": `${knowledgeSetTitleStr}`,
            "title": `${knowledgeTitleStr}`,
            "templateId": `${knowledgeTemplateId}`,
            "categoryTier1": "Applications",
            "categoryTier2": "Help Desk",
            "categoryTier3": "Incident",
            "region": "Australia",
            "site": "Canberra",
            "assignedCompany":"Petramco",
            "assigneeBusinessUnit":"United Kingdom Support",
            "assigneeSupportGroup":"GB Support 1",
            "assignee": "KMills",
            "articleDesc": `${knowledgeTitleStr} Desc`
        }
        let articleHelpFulCounterData = {
            linkedCounter: 182,
            helpfulPercentage: 81,
            helpfulCounter: 110,
            viewCounter: 56,
            notHelpfulCounter: 12
        }
        let articleDetails = await apiHelper.createKnowledgeArticle(articleData, attachmentFilePath);

        try {
            await navigationPage.signOut();
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            expect(await knowledgeConsole.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(articleDetails.displayId);
            expect(await viewKnowledgeArticlePo.isEditLinkDisplayedOnKA()).toBeTruthy('Article view screen is not displayed');
            expect(await viewKnowledgeArticlePo.isArticleVersionDisplayed()).toBeTruthy('Article version on View knowledge article is not displayed');
            let actualVersion = await viewKnowledgeArticlePo.getArticleVersion();
            let actualDate = await viewKnowledgeArticlePo.formatDate();
            let expectedVersion = "Version " + "1" + " - " + actualDate;
            expect(actualVersion).toBe(expectedVersion);
            await editKnowledgePage.setKnowledgeStatus('Draft');
            expect(await editKnowledgePage.getStatusValue()).toContain('Draft', 'Article is updated with Draft status.');
            await statusBladeKnowledgeArticlePo.setKnowledgeStatusWithReviewerDetails('SME Review', 'Petramco', 'Australia Support', 'AU Support 3', 'Kane Williamson');
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(articleDetails.displayId);
            expect(await viewKnowledgeArticlePo.isReviewMessageDisplayed('Knowledge Article is in Review')).toBeTruthy();
            await viewKnowledgeArticlePo.clickReviewPendingLink();
            await reviewCommentsPo.setTextInTellUsMore(articleDetails.displayId);
            await reviewCommentsPo.clickApprovedButton();
            await utilityCommon.refresh();
            expect(await editKnowledgePage.getStatusValue()).toContain('Published', 'Article is updated with Published status.');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.updateKnowledgeArticleViewAndHelpFulCounter(articleDetails.id, articleHelpFulCounterData);
            await utilityCommon.refresh();
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            await editKnowledgePage.selectIsExternalOption('Yes');
            await editKnowledgePage.enterKeyword(articleDetails.displayId);
            await editKnowledgePage.clickSaveKnowledgeMetadata();
            await viewKnowledgeArticlePo.clickOnFlagButton();
            await flagUnflagKnowledgePo.setTextInTellUsMore(articleDetails.displayId);
            await flagUnflagKnowledgePo.clickOnFlageButtonOnBlade();
            expect(await utilCommon.isPopUpMessagePresent('You have successfully flagged the article.')).toBeTruthy('Article Not Flagged');
            await viewKnowledgeArticlePo.clickEditKnowledgeAccess();
            await editKnowledgeAccessPage.clickOnSupportGroupAccessORAgentAccessButton('Support Group Access');
            await editKnowledgeAccessPage.selectCompany('Petramco');
            await editKnowledgeAccessPage.selectBusinessUnit('HR Support');
            await editKnowledgeAccessPage.selectSupportGroup('Employee Relations');
            await editKnowledgeAccessPage.selectSupportGroupWriteAccess();
            await editKnowledgeAccessPage.clickAddSupportGroupAccessButton();
            await editKnowledgeAccessPage.clickCloseKnowledgeAccessBlade();
            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(minorEditOption)).toBeTruthy('Minor Edit Option is displayed for Published Knowledge Article.');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(majorEditOption)).toBeTruthy('Major Edit Option is displayed for Published Knowledge Article.');
            await editKnowledgePage.selectArticleEditOption(majorEditOption);
            expect(await editKnowledgePage.getHelpTextForMajorEditOptionDisplayed()).toBe(majorEditHelpText);
            await editKnowledgePage.updateKnowledgeArticleTitle(updatedArticleTitle);
            await editKnowledgePage.clickArticleMajorEditSaveButton();
            await browser.sleep(4000);
            await utilityCommon.refresh();
            let updatedVersion = "Version " + "2" + " - " + actualDate;
            expect(await viewKnowledgeArticlePo.getArticleVersion()).toBe(updatedVersion);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleTitle()).toBe(updatedArticleTitle);

            await viewKnowledgeArticlePo.clickEditKnowledgeAccess();
            await editKnowledgeAccessPage.clickRemoveKnowledgeAccess('Petramco');
            await editKnowledgeAccessPage.clickKnowledgeAccessYesOption();
            await editKnowledgeAccessPage.clickRemoveKnowledgeAccess('Employee Relations');
            await editKnowledgeAccessPage.clickKnowledgeAccessYesOption();
            await editKnowledgeAccessPage.clickCloseKnowledgeAccessBlade();
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();

            await loginPage.login('qgeorge');
            await navigationPage.gotoKnowledgeConsole();
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(articleDetails.displayId);
            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(minorEditOption)).toBeTruthy('Minor Edit Option is displayed for Published Knowledge Article.');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(majorEditOption)).toBeTruthy('Major Edit Option is displayed for Published Knowledge Article.');
            await editKnowledgePage.selectArticleEditOption(majorEditOption);
            await editKnowledgePage.updateKnowledgeArticleTitle(updatedArticleTitle + "_updated version");
            await editKnowledgePage.clickArticleMajorEditSaveButton();
            expect(await utilCommon.isPopUpMessagePresent('ERROR (170250): Draft version already created.')).toBeTruthy('Already Draft version is present message is not displayed.');
            await browser.sleep(4000);
            await utilityCommon.refresh();
            expect(await viewKnowledgeArticlePo.getArticleVersion()).toBe(expectedVersion);
        }
        catch (e) {
            throw e;
        }
        finally {
            await utilityCommon.refresh();
            await utilCommon.waitUntilSpinnerToHide();
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        }
    }, 350 * 1000);

    //skhobrag
    it('[DRDMV-20718]: Verify that the newly created article with version displays on knowledge grid console', async () => {
        let knowledgeTitleStr = 'Versioning for article' + "_" + randomStr;
        let knowledgeTemplateId = await apiCoreUtil.getKnowledgeTemplateGuid(knowledgeTemplateStr);
        let updatedArticleTitle = "updated article title" + "_" + randomStr;
        let versionFieldColumns: string[] = ["Version"];
        let knowledgeGridColumnFields: string[] = ["Article ID", "Title", "Knowledge Set", "Status", "Assignee", "Company", "Template Name", "Reviewer", "Modified By", "Created Date", "Modified Date", "Flagged", "Version"];
        let expectedPreviousVersionNum = '1';
        let expectedUpdatedVersionNum = '2';

        await apiHelper.apiLogin(caseAgentUser);
        let articleData = {
            "knowledgeSet": `${knowledgeSetTitleStr}`,
            "title": `${knowledgeTitleStr}`,
            "templateId": `${knowledgeTemplateId}`,
            "categoryTier1": "Applications",
            "categoryTier2": "Help Desk",
            "categoryTier3": "Incident",
            "region": "Australia",
            "site": "Canberra",
            "assignedCompany":"Petramco",
            "assigneeBusinessUnit":"United Kingdom Support",
            "assigneeSupportGroup":"GB Support 1",
            "assignee": "KMills",
            "articleDesc": `${knowledgeTitleStr} Desc`
        }
        let articleHelpFulCounterData = {
            linkedCounter: 182,
            helpfulPercentage: 81,
            helpfulCounter: 110,
            viewCounter: 56,
            notHelpfulCounter: 12
        }
        let articleDetails = await apiHelper.createKnowledgeArticle(articleData, attachmentFilePath);

        try {
            await navigationPage.signOut();
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            expect(await knowledgeConsole.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(articleDetails.displayId);
            expect(await viewKnowledgeArticlePo.isEditLinkDisplayedOnKA()).toBeTruthy('Article view screen is not displayed');
            expect(await viewKnowledgeArticlePo.isArticleVersionDisplayed()).toBeTruthy('Article version on View knowledge article is not displayed');
            let actualVersion = await viewKnowledgeArticlePo.getArticleVersion();
            let actualDate = await viewKnowledgeArticlePo.formatDate();
            let expectedVersion = "Version " + "1" + " - " + actualDate;
            expect(actualVersion).toBe(expectedVersion);
            await editKnowledgePage.setKnowledgeStatus('Draft');
            expect(await editKnowledgePage.getStatusValue()).toContain('Draft', 'Article is updated with Draft status.');
            await statusBladeKnowledgeArticlePo.setKnowledgeStatusWithReviewerDetails('SME Review', 'Petramco', 'Australia Support','AU Support 3', 'Kane Williamson');
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(articleDetails.displayId);
            expect(await viewKnowledgeArticlePo.isReviewMessageDisplayed('Knowledge Article is in Review')).toBeTruthy();
            await viewKnowledgeArticlePo.clickReviewPendingLink();
            await reviewCommentsPo.setTextInTellUsMore(articleDetails.displayId);
            await reviewCommentsPo.clickApprovedButton();
            await utilityCommon.refresh();
            expect(await editKnowledgePage.getStatusValue()).toContain('Published', 'Article is updated with Published status.');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.updateKnowledgeArticleViewAndHelpFulCounter(articleDetails.id, articleHelpFulCounterData);
            await utilityCommon.refresh();
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            await editKnowledgePage.selectIsExternalOption('Yes');
            await editKnowledgePage.enterKeyword(articleDetails.displayId);
            await editKnowledgePage.clickSaveKnowledgeMetadata();
            await viewKnowledgeArticlePo.clickOnFlagButton();
            await flagUnflagKnowledgePo.setTextInTellUsMore(articleDetails.displayId);
            await flagUnflagKnowledgePo.clickOnFlageButtonOnBlade();
            expect(await utilCommon.isPopUpMessagePresent('You have successfully flagged the article.')).toBeTruthy('Article Not Flagged');
            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(minorEditOption)).toBeTruthy('Minor Edit Option is displayed for Published Knowledge Article.');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(majorEditOption)).toBeTruthy('Major Edit Option is displayed for Published Knowledge Article.');
            await editKnowledgePage.selectArticleEditOption(majorEditOption);
            expect(await editKnowledgePage.getHelpTextForMajorEditOptionDisplayed()).toBe(majorEditHelpText);
            await editKnowledgePage.updateKnowledgeArticleTitle(updatedArticleTitle);
            await editKnowledgePage.clickArticleMajorEditSaveButton();
            await browser.sleep(4000);
            await utilityCommon.refresh();
            let updatedVersion = "Version " + "2" + " - " + actualDate;
            expect(await viewKnowledgeArticlePo.getArticleVersion()).toBe(updatedVersion);
            console.log(updatedVersion);
            console.log(await viewKnowledgeArticlePo.getArticleVersion());

            expect(await viewKnowledgeArticlePo.getKnowledgeArticleTitle()).toBe(updatedArticleTitle);
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();

            await loginPage.login('elizabeth');
            await navigationPage.gotoKnowledgeConsole();
            await utilGrid.clearFilter();
            await knowledgeConsole.addColumnOnGrid(versionFieldColumns);
            expect(await knowledgeConsole.isSelectedFilterOptionDisplayedOnGridConsole(knowledgeGridColumnFields)).toBe(true);
            await knowledgeConsole.searchOnGridConsole(updatedArticleTitle);
            let updatedVersionNum = await knowledgeConsole.getSelectedGridRecordValue(versionColumn);
            expect(updatedVersionNum).toBe(expectedUpdatedVersionNum);
            await knowledgeConsole.searchOnGridConsole(knowledgeTitleStr);
            let previousVersionNum = await knowledgeConsole.getSelectedGridRecordValue(versionColumn);
            expect(previousVersionNum).toBe(expectedPreviousVersionNum);
            await knowledgeConsole.removeColumnOnGrid(versionFieldColumns);

            await utilGrid.clearFilter();
        }
        catch (e) {
            throw e;
        }
        finally {
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await utilityCommon.refresh();
            await utilCommon.waitUntilSpinnerToHide();
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        }
    }, 350 * 1000);

    //skhobrag
    it('[DRDMV-20753]: Verify the behavior when the article with current version is canceled and user tries to create a new version after canceled operation', async () => {
        let knowledgeTitleStr = 'Versioning for article' + "_" + randomStr;
        let knowledgeTemplateId = await apiCoreUtil.getKnowledgeTemplateGuid(knowledgeTemplateStr);
        let articleAccessPermission: string[] = ['GB Support 2', 'Petramco'];
        let updatedArticleAccessPermission: string[] = ['Employee Relations', 'GB Support 2', 'Petramco'];
        let articleAttachments = ['articleStatus.png'];
        let articleAccessPermissionUser: string[] = ['Kane Williamson'];
        let updatedArticleTitle = "updated article title" + "_" + randomStr;
        let updatedArticleDesc = "updated article description";

        await apiHelper.apiLogin(caseAgentUser);
        let articleData = {
            "knowledgeSet": `${knowledgeSetTitleStr}`,
            "title": `${knowledgeTitleStr}`,
            "templateId": `${knowledgeTemplateId}`,
            "categoryTier1": "Applications",
            "categoryTier2": "Help Desk",
            "categoryTier3": "Incident",
            "region": "Australia",
            "site": "Canberra",
            "assignedCompany":"Petramco",
            "assigneeBusinessUnit":"United Kingdom Support",
            "assigneeSupportGroup":"GB Support 1",
            "assignee": "KMills",
            "articleDesc": `${knowledgeTitleStr} Desc`
        }
        let articleHelpFulCounterData = {
            linkedCounter: 182,
            helpfulPercentage: 81,
            helpfulCounter: 110,
            viewCounter: 56,
            notHelpfulCounter: 12
        }
        let articleDetails = await apiHelper.createKnowledgeArticle(articleData, attachmentFilePath);
        let articleKeywordsVal: string[] = [`${articleDetails.displayId}`];

        try {
            await navigationPage.signOut();
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            expect(await knowledgeConsole.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(articleDetails.displayId);
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
            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(minorEditOption)).toBeFalsy('Minor Edit Option is displayed for Draft Knowledge Article.');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(majorEditOption)).toBeFalsy('Major Edit Option is displayed for Draft Knowledge Article.');
            await editKnowledgePage.clickArticleCancelButton();
            await utilCommon.clickOnWarningOk();
            await statusBladeKnowledgeArticlePo.setKnowledgeStatusWithReviewerDetails('SME Review', 'Petramco', 'Australia Support', 'AU Support 3', 'Kane Williamson');
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(articleDetails.displayId);
            expect(await viewKnowledgeArticlePo.isReviewMessageDisplayed('Knowledge Article is in Review')).toBeTruthy();
            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(minorEditOption)).toBeFalsy('Minor Edit Option is displayed for SME Review Knowledge Article.');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(majorEditOption)).toBeFalsy('Major Edit Option is displayed for SME Review Knowledge Article.');
            await editKnowledgePage.clickArticleCancelButton();
            await utilCommon.clickOnWarningOk();
            await viewKnowledgeArticlePo.clickReviewPendingLink();
            await reviewCommentsPo.setTextInTellUsMore(articleDetails.displayId);
            await reviewCommentsPo.clickApprovedButton();
            await utilityCommon.refresh();
            expect(await editKnowledgePage.getStatusValue()).toContain('Published', 'Article is updated with Published status.');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.updateKnowledgeArticleViewAndHelpFulCounter(articleDetails.id, articleHelpFulCounterData);
            await utilityCommon.refresh();
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            await editKnowledgePage.selectIsExternalOption('Yes');
            await editKnowledgePage.enterKeyword(articleDetails.displayId);
            await editKnowledgePage.clickSaveKnowledgeMetadata();
            await viewKnowledgeArticlePo.clickOnFlagButton();
            await flagUnflagKnowledgePo.setTextInTellUsMore(articleDetails.displayId);
            await flagUnflagKnowledgePo.clickOnFlageButtonOnBlade();
            expect(await utilCommon.isPopUpMessagePresent('You have successfully flagged the article.')).toBeTruthy('Article Not Flagged');
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
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleAccessPermissionUsersDetails()).toEqual(articleAccessPermissionUser);
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
            await browser.sleep(4000);
            await utilityCommon.refresh();
            let updatedVersion = "Version " + "2" + " - " + actualDate;
            expect(await viewKnowledgeArticlePo.getArticleVersion()).toBe(updatedVersion);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleTitle()).toBe(updatedArticleTitle);
            await viewKnowledgeArticlePo.clickEditKnowledgeAccess();
            await editKnowledgeAccessPage.clickOnSupportGroupAccessORAgentAccessButton('Support Group Access');
            await editKnowledgeAccessPage.selectCompany('Petramco');
            await editKnowledgeAccessPage.selectBusinessUnit('HR Support');
            await editKnowledgeAccessPage.selectSupportGroup('Employee Relations');
            await editKnowledgeAccessPage.selectSupportGroupWriteAccess();
            await editKnowledgeAccessPage.clickAddSupportGroupAccessButton();
            await editKnowledgeAccessPage.clickCloseKnowledgeAccessBlade();
            await utilityCommon.refresh();
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleDescription()).toBe(updatedArticleDesc);
            expect(await viewKnowledgeArticlePo.getKnowledgeSet()).toBe(knowledgeSetTitleStr);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleCompany()).toBe(articleData.assignedCompany);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleAuthor()).toBe('Kane Williamson');
            expect(await viewKnowledgeArticlePo.getCategoryTier1Value()).toBe(articleData.categoryTier1);
            expect(await viewKnowledgeArticlePo.getCategoryTier2Value()).toBe(articleData.categoryTier2);
            expect(await viewKnowledgeArticlePo.getCategoryTier3Value()).toBe(articleData.categoryTier3);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleAssigneeGroupValue()).toBe(articleData.assigneeSupportGroup);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleAccessPermissionGroupDetails()).toEqual(updatedArticleAccessPermission);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleAccessPermissionUsersDetails()).toEqual(articleAccessPermissionUser);
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
            expect(await viewKnowledgeArticlePo.getArticleIsExternalValue()).toBe('');
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleKeywords()).toEqual(articleKeywordsVal);
            expect(await viewKnowledgeArticlePo.isFlagArticleOptionDisplayed()).toBeFalsy('Flag Article option is displayed.');
            expect(await viewKnowledgeArticlePo.isUnFlagArticleOptionDisplayed()).toBeTruthy('UnFlag Article option is displayed.');
            await viewKnowledgeArticlePo.clickOnTab(activityTabStr);
            await activityTabPo.clickOnRefreshButton();
            expect(await activityTabPo.getFirstPostContent()).toContain('Kane Williamson created a new version.', 'content not displaying on Activity');

            await editKnowledgePage.setKnowledgeStatus('Cancel Approval');
            await browser.sleep(2000);
            await utilityCommon.refresh();
            expect(await editKnowledgePage.getStatusValue()).toContain('Canceled', 'Article is updated with Draft status.');
            await browser.sleep(2000);
            await viewKnowledgeArticlePo.selectArticleVersion('1');
            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(minorEditOption)).toBeTruthy('Minor Edit Option is displayed for Published Knowledge Article.');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(majorEditOption)).toBeTruthy('Major Edit Option is displayed for Published Knowledge Article.');
            await editKnowledgePage.selectArticleEditOption(majorEditOption);
            await editKnowledgePage.updateKnowledgeArticleTitle(updatedArticleTitle + "_for Version 3");
            await editKnowledgePage.updateKnowledgeArticleDescription(updatedArticleDesc + "_for Version 3");
            await editKnowledgePage.clickArticleMajorEditSaveButton();
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
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleAccessPermissionUsersDetails()).toEqual(articleAccessPermissionUser);
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
            expect(await viewKnowledgeArticlePo.isArticleIsExternalValueDisplayed()).toBeFalsy('Article IsExternal Flag is displayed on new Draft version of an article.');
            expect(await viewKnowledgeArticlePo.getArticleIsExternalValue()).toBe('');
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleKeywords()).toEqual(articleKeywordsVal);
            expect(await viewKnowledgeArticlePo.getAssigneeValue()).toBe('Kyle Mills');
            expect(await viewKnowledgeArticlePo.isFlagArticleOptionDisplayed()).toBeFalsy('Flag Article option is displayed.');
            expect(await viewKnowledgeArticlePo.isUnFlagArticleOptionDisplayed()).toBeTruthy('UnFlag Article option is displayed.');
            await viewKnowledgeArticlePo.clickOnTab(activityTabStr);
            await activityTabPo.clickOnRefreshButton();
            expect(await activityTabPo.getFirstPostContent()).toContain('Kane Williamson created a new version.', 'content not displaying on Activity');

        }
        catch (e) {
            throw e;
        }
        finally {
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await utilityCommon.refresh();
            await utilCommon.waitUntilSpinnerToHide();
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        }
    }, 400 * 1000);

    //skhobrag
    it('[DRDMV-20748]:  Verify whether the user with appropriate knowledge permission roles can able to update the article with updated / new version', async () => {
        let knowledgeTitleStr = 'Versioning for article' + "_" + randomStr;
        let knowledgeTemplateId = await apiCoreUtil.getKnowledgeTemplateGuid(knowledgeTemplateStr);

        await apiHelper.apiLogin(caseAgentUser);
        let articleData = {
            "knowledgeSet": `${knowledgeSetTitleStr}`,
            "title": `${knowledgeTitleStr}`,
            "templateId": `${knowledgeTemplateId}`,
            "categoryTier1": "Applications",
            "categoryTier2": "Help Desk",
            "categoryTier3": "Incident",
            "region": "Australia",
            "site": "Canberra",
            "assignedCompany":"Petramco",
            "assigneeBusinessUnit":"United Kingdom Support",
            "assigneeSupportGroup":"GB Support 1",
            "assignee": "KMills",
            "articleDesc": `${knowledgeTitleStr} Desc`
        }
        let articleHelpFulCounterData = {
            linkedCounter: 182,
            helpfulPercentage: 81,
            helpfulCounter: 110,
            viewCounter: 56,
            notHelpfulCounter: 12
        }
        let articleDetails = await apiHelper.createKnowledgeArticle(articleData, attachmentFilePath);

        try {
            await navigationPage.signOut();
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            expect(await knowledgeConsole.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(articleDetails.displayId);
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

            await viewKnowledgeArticlePo.clickEditKnowledgeAccess();
            await editKnowledgeAccessPage.clickOnSupportGroupAccessORAgentAccessButton('Support Group Access');
            await editKnowledgeAccessPage.selectCompany('Petramco');
            await editKnowledgeAccessPage.selectBusinessUnit('Australia Support');
            await editKnowledgeAccessPage.selectSupportGroup('AU Support 1');
            await editKnowledgeAccessPage.selectSupportGroupWriteAccess();
            await editKnowledgeAccessPage.clickAddSupportGroupAccessButton();
            await editKnowledgeAccessPage.clickCloseKnowledgeAccessBlade();

            await viewKnowledgeArticlePo.clickEditKnowledgeAccess();
            await editKnowledgeAccessPage.clickOnSupportGroupAccessORAgentAccessButton('Support Group Access');
            await editKnowledgeAccessPage.selectCompany('Petramco');
            await editKnowledgeAccessPage.selectBusinessUnit('India Support');
            await editKnowledgeAccessPage.selectSupportGroup('IN Support 2');
            await editKnowledgeAccessPage.clickAddSupportGroupAccessButton();
            await editKnowledgeAccessPage.clickCloseKnowledgeAccessBlade();
            await viewKnowledgeArticlePo.clickEditKnowledgeAccess();
            await editKnowledgeAccessPage.clickOnSupportGroupAccessORAgentAccessButton('Support Group Access');
            await editKnowledgeAccessPage.selectCompany('Petramco');
            await editKnowledgeAccessPage.selectBusinessUnit('India Support');
            await editKnowledgeAccessPage.selectSupportGroup('IN Support 3');
            await editKnowledgeAccessPage.clickAddSupportGroupAccessButton();
            await editKnowledgeAccessPage.clickCloseKnowledgeAccessBlade();

            await viewKnowledgeArticlePo.clickEditKnowledgeAccess();
            await editKnowledgeAccessPage.clickOnSupportGroupAccessORAgentAccessButton('Support Group Access');
            await editKnowledgeAccessPage.selectCompany('Petramco');
            await editKnowledgeAccessPage.selectBusinessUnit('United States Support');
            await editKnowledgeAccessPage.selectSupportGroup('US Support 1');
            await editKnowledgeAccessPage.clickAddSupportGroupAccessButton();
            await editKnowledgeAccessPage.clickCloseKnowledgeAccessBlade();

            await utilityCommon.refresh();

            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(minorEditOption)).toBeFalsy('Minor Edit Option is displayed for Draft Knowledge Article.');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(majorEditOption)).toBeFalsy('Major Edit Option is displayed for Draft Knowledge Article.');
            await editKnowledgePage.clickArticleCancelButton();
            await utilCommon.clickOnWarningOk();
            await statusBladeKnowledgeArticlePo.setKnowledgeStatusWithReviewerDetails('SME Review', 'Petramco', 'Australia Support', 'AU Support 3', 'Kane Williamson');
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(articleDetails.displayId);
            expect(await viewKnowledgeArticlePo.isReviewMessageDisplayed('Knowledge Article is in Review')).toBeTruthy();
            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(minorEditOption)).toBeFalsy('Minor Edit Option is displayed for SME Review Knowledge Article.');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(majorEditOption)).toBeFalsy('Major Edit Option is displayed for SME Review Knowledge Article.');
            await editKnowledgePage.clickArticleCancelButton();
            await utilCommon.clickOnWarningOk();
            await viewKnowledgeArticlePo.clickReviewPendingLink();
            await reviewCommentsPo.setTextInTellUsMore(articleDetails.displayId);
            await reviewCommentsPo.clickApprovedButton();
            await utilityCommon.refresh();
            expect(await editKnowledgePage.getStatusValue()).toContain('Published', 'Article is updated with Published status.');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.updateKnowledgeArticleViewAndHelpFulCounter(articleDetails.id, articleHelpFulCounterData);
            await utilityCommon.refresh();
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            await editKnowledgePage.selectIsExternalOption('Yes');
            await editKnowledgePage.enterKeyword(articleDetails.displayId);
            await editKnowledgePage.clickSaveKnowledgeMetadata();
            await viewKnowledgeArticlePo.clickOnFlagButton();
            await flagUnflagKnowledgePo.setTextInTellUsMore(articleDetails.displayId);
            await flagUnflagKnowledgePo.clickOnFlageButtonOnBlade();

            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(articleDetails.displayId);
            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(minorEditOption)).toBeTruthy('Minor Edit Option is displayed for Published Knowledge Article.');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(majorEditOption)).toBeTruthy('Major Edit Option is displayed for Published Knowledge Article.');
            await editKnowledgePage.selectArticleEditOption(majorEditOption);
            expect(await editKnowledgePage.isHelpTextForMajorEditOptionDisplayed()).toBeTruthy('Major Edit Option helptext for knowledge publisher user with write access is not displayed.');
            expect(await editKnowledgePage.isMajorEditSaveButtonEnabled()).toBeTruthy('Major Edit Option is disabled for Knowledge publisher user with write access.');
            await editKnowledgePage.selectArticleEditOption(minorEditOption);
            expect(await editKnowledgePage.isHelpTextMinorEditOptionDisplayed()).toBeTruthy('Minor Edit Option helptext for knowledge publisher user with write access is not displayed.');
            expect(await editKnowledgePage.isMinorEditSaveButtonEnabled()).toBeTruthy('Minor Edit Option is disabled for Knowledge publisher user with write access.');
        }
        catch (e) {
            throw e;
        }
        finally {
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await utilityCommon.refresh();
            await utilCommon.waitUntilSpinnerToHide();
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        }
    }, 400 * 1000);



})