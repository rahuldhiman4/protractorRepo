import { browser } from "protractor";
import apiCoreUtil from '../../api/api.core.util';
import apiHelper from '../../api/api.helper';
import previewCasePo from '../../pageobject/case/case-preview.po';
import createCasePage from '../../pageobject/case/create-case.po';
import quickCase from '../../pageobject/case/quick-case.po';
import viewCasePage from "../../pageobject/case/view-case.po";
import accessTabPo from '../../pageobject/common/access-tab.po';
import changeAssignmentBlade from "../../pageobject/common/change-assignment.po";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import resources from '../../pageobject/common/resources-tab.po';
import createKnowledgePage from "../../pageobject/knowledge/create-knowlege.po";
import editKnowledgePage from '../../pageobject/knowledge/edit-knowledge.po';
import flagUnflagKnowledgePo from '../../pageobject/knowledge/flag-unflag-knowledge.po';
import knowledgeConsole from '../../pageobject/knowledge/knowledge-articles-console.po';
import previewKnowledgePo from '../../pageobject/knowledge/preview-knowledge.po';
import reviewCommentsPo from '../../pageobject/knowledge/review-comments.po';
import statusBladeKnowledgeArticlePo from '../../pageobject/knowledge/status-blade-knowledge-article.po';
import viewKnowledgeArticlePo from '../../pageobject/knowledge/view-knowledge-article.po';
import statusConfigPO from '../../pageobject/settings/common/status-config.po';
import activityTabPo from '../../pageobject/social/activity-tab.po';
import { BWF_BASE_URL, BWF_PAGE_TITLES } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from "../../utils/utility.grid";

let caseBAUser = 'qkatawazi';
let caseAgentUser = 'qtao';
// let caseAgentUser = 'qyuan';
let caseManagerUser = 'qdu';
let knowledgeCandidateUser = 'kayo';
let knowledgeContributorUser = 'kkohri';
let knowledgePublisherUser = 'kmills';
let knowledgeCoachUser = 'kWilliamson';
let versionColumn = 'Version';
let knowledgeManagementApp = "Knowledge Management";
let knowledgeArticlesTitleStr = "Knowledge Articles";
let applyBtn = "Apply";
let emptyStr = '';
let articleInDraftStatus = '3914 KnowledgeArticle_Draft';
let minorEditOption = 'Minor Edit';
let majorEditOption = 'Major Edit';
let versionField = "Version";
let versionFieldVal = "1";
let resourcesTabStr = "Resources";
let activityTabStr = "Activity";

describe('Knowledge Articles - Versioning Tests', () => {
    const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
    const knowledgeSetTitleStrPetramco = 'versionedKnowledgeSetPetramco_' + randomStr;
    const knowledgeSetTitleStrPsilon = 'versionedKnowledgeSetPsilon_' + randomStr;
    const knowledgeSetTitleStrPhylum = 'versionedKnowledgeSetPhylum_' + randomStr;
    const knowledgeTemplateStr = 'VersionedArticleTemplate_' + randomStr;
    const attachmentFilePath = 'e2e/data/ui/attachment/articleStatus.png';
    const minorEditHelpText = `Submitting your changes will edit the existing Version 1`;
    const majorEditHelpText = `Submitting your changes will create Version 2`;

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login(caseBAUser);
        await apiHelper.apiLogin('gderuno');
        let knowledgeSetData = {
            knowledgeSetTitle: `${knowledgeSetTitleStrPetramco}`,
            knowledgeSetDesc: `${knowledgeSetTitleStrPetramco}_Desc`,
            company: 'Petramco'
        }
        let knowledgeSetDataPsilon = {
            knowledgeSetTitle: `${knowledgeSetTitleStrPsilon}`,
            knowledgeSetDesc: `${knowledgeSetTitleStrPsilon}_Desc`,
            company: 'Psilon'
        }
        await apiHelper.createKnowledgeSet(knowledgeSetDataPsilon);

        await apiHelper.apiLogin('elizabeth');
        await apiHelper.createKnowledgeSet(knowledgeSetData);

        let knowledgeArticleTemplateData = {
            templateName: knowledgeTemplateStr,
            sectionTitle: "articleSection",
            knowledgeSetTitle: knowledgeSetData.knowledgeSetTitle,
        }
        await apiHelper.createKnowledgeArticleTemplate(knowledgeArticleTemplateData);
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //skhobrag
    it('[3715]: Verify that the newly created article shows the article version', async () => {
        let knowledgeTitleStr = 'Versioning for article' + "_" + randomStr;
        let knowledgeRefStr = 'KnowledgeReference' + randomStr;
        await navigationPage.signOut();
        await loginPage.login('qtao');
        await navigationPage.gotoCreateKnowledge();
        await createKnowledgePage.clickOnTemplate('Reference');
        await createKnowledgePage.clickOnUseSelectedTemplateButton();
        await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeTitleStr);
        await createKnowledgePage.selectKnowledgeSet(knowledgeSetTitleStrPetramco);
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

    //skhobrag-Defect
    describe('[3708]: Verify the functionality of Edit article with Minor Edit button', () => {
        let knowledgeTitleStr = 'Versioning for article' + "_" + randomStr;
        let articleAccessPermission: string[] = ['GB Support 2', 'Petramco', 'Kane Williamson', 'Qianru Tao'];
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
                "knowledgeSet": `${knowledgeSetTitleStrPetramco}`,
                "title": `${knowledgeTitleStr}`,
                "templateId": `${knowledgeTemplateId}`,
                "categoryTier1": "Employee Relations",
                "categoryTier2": "Compensation",
                "categoryTier3": "Bonus",
                "region": "Americas",
                "siteGroup": "Marketing",
                "site": "Atlanta",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United Kingdom Support",
                "assigneeSupportGroup": "GB Support 2",
                "assignee": "KMills",
                "articleDesc": `${knowledgeTitleStr} Desc`
            }
            articleDetails = await apiHelper.createKnowledgeArticle(articleData, attachmentFilePath);
        });

        it('[3708]: Verify the functionality of Edit article with Minor Edit button', async () => {
            await navigationPage.signOut();
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeConsole.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
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
            await editKnowledgePage.setKnowledgeStatus('Draft');
            expect(await editKnowledgePage.getStatusValue()).toContain('Draft', 'Article is updated with Draft status.');
            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(minorEditOption)).toBeFalsy('Minor Edit Option is displayed for Draft Knowledge Article.');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(majorEditOption)).toBeFalsy('Major Edit Option is displayed for Draft Knowledge Article.');
            await editKnowledgePage.clickArticleCancelButton();
            await statusBladeKnowledgeArticlePo.setKnowledgeStatusWithReviewerDetails('SME Review', 'Petramco', 'Australia Support', 'AU Support 3', 'Kane Williamson');
        });

        it('[3708]: Verify the functionality of Edit article with Minor Edit button', async () => {
            await navigationPage.signOut();
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            await utilityGrid.searchAndOpenHyperlink(articleDetails.displayId);
            expect(await viewKnowledgeArticlePo.isReviewMessageDisplayed('Knowledge Article is in Review')).toBeTruthy();
            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(minorEditOption)).toBeFalsy('Minor Edit Option is displayed for SME Review Knowledge Article.');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(majorEditOption)).toBeFalsy('Major Edit Option is displayed for SME Review Knowledge Article.');
            await editKnowledgePage.clickArticleCancelButton();
            await viewKnowledgeArticlePo.clickReviewPendingLink();
            await reviewCommentsPo.setTextInTellUsMore(articleDetails.displayId);
            await reviewCommentsPo.clickApprovedButton();
            await browser.sleep(2000); //Hard wait to load the tab properly
            await utilityCommon.refresh(); // Refresh needed to reflect changes.
            await browser.sleep(2000); //Hard wait to load the tab properly
            expect(await editKnowledgePage.getStatusValue()).toContain('Published', 'Article is updated with Published status.');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.updateKnowledgeArticleViewAndHelpFulCounter(articleDetails.id, articleHelpFulCounterData);
            await utilityCommon.refresh(); // Refresh needed to reflect changes.
            console.log(await viewKnowledgeArticlePo.getKnowledgeArticleTitle());
            console.log(await viewKnowledgeArticlePo.getKnowledgeArticleDescription());
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleTitle()).toBe(knowledgeTitleStr);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleDescription()).toBe(articleData.articleDesc);
            expect(await viewKnowledgeArticlePo.getKnowledgeSet()).toBe(knowledgeSetTitleStrPetramco);
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

        it('[3708]: Verify the functionality of Edit article with Minor Edit button', async () => {
            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(minorEditOption)).toBeTruthy('Minor Edit Option is displayed for Published Knowledge Article.');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(majorEditOption)).toBeTruthy('Major Edit Option is displayed for Published Knowledge Article.');
            await editKnowledgePage.selectArticleEditOption(minorEditOption);
            expect(await editKnowledgePage.getHelpTextForMinorEditOptionDisplayed()).toBe(minorEditHelpText);
            await editKnowledgePage.updateKnowledgeArticleTitle(updatedArticleTitle);
            await editKnowledgePage.updateKnowledgeArticleDescription(updatedArticleDesc);
            await editKnowledgePage.clickOnSaveButtonOfKA();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy();
            await utilityCommon.refresh(); // Refresh needed to reflect version updates.
            expect(await viewKnowledgeArticlePo.getArticleVersion()).toBe(expectedVersion);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleTitle()).toBe(updatedArticleTitle);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleDescription()).toBe(updatedArticleDesc);
            expect(await viewKnowledgeArticlePo.getKnowledgeSet()).toBe(knowledgeSetTitleStrPetramco);
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
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        });

    });

    //skhobrag-log defect
    describe('[3705]: Verify the search based on version on knowledge article console', () => {
        let knowledgeTitleStr = 'Versioning for article' + "_" + randomStr;
        let versionFieldColumn: string[] = ["Version"];
        let knowledgeGridColumnFields: string[] = ["Article ID", "Title", "Knowledge Set", "Status", "Assignee", "Company", "Template Name", "Reviewer", "Modified By", "Created Date", "Modified Date", "Flagged", "Version"];
        let knowledgeGridColumnFieldsWithoutVersion: string[] = ["Article ID", "Title", "Knowledge Set", "Status", "Assignee", "Company", "Template Name", "Reviewer", "Modified By", "Created Date", "Modified Date", "Flagged"];
        let versionVal: string = undefined;

        beforeAll(async () => {
            await apiHelper.apiLogin(caseAgentUser);
            let knowledgeTemplateId = await apiCoreUtil.getKnowledgeTemplateGuid(knowledgeTemplateStr);

          let articleData = {
            "knowledgeSet": `${knowledgeSetTitleStrPetramco}`,
                "title": `${knowledgeTitleStr}`,
                "templateId": `${knowledgeTemplateId}`,
                "categoryTier1": "Employee Relations",
                "categoryTier2": "Compensation",
                "categoryTier3": "Bonus",
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

        it('[3705]: Verify the search based on version on knowledge article console', async () => {
            await navigationPage.gotoKnowledgeConsole();
            await knowledgeConsole.removeColumnOnGrid(['Region']);
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

        it('[3705]: Verify the search based on version on knowledge article console', async () => {
            await loginPage.login(caseAgentUser);
            await navigationPage.gotoKnowledgeConsole();
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
        });

        it('[3705]: Verify the search based on version on knowledge article console', async () => {
            await navigationPage.signOut();
            await loginPage.login(knowledgeContributorUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
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
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
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
        });

        it('[3705]: Verify the search based on version on knowledge article console', async () => {
            await navigationPage.signOut();
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
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
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        })

    });

    //skhobrag-pass
    describe('[3700]: Verify the search functionality of articles with versions from Case Edit > Resources screen', () => {
        beforeAll(async () => {
            let articleData1 = {
                "knowledgeSet": "HR",
                "title": articleInDraftStatus,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "categoryTier1": "Employee Relations",
                "categoryTier2": "Compensation",
                "categoryTier3": "Bonus",
                "region": "Australia",
                "site": "Canberra",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "Australia Support",
                "assigneeSupportGroup": "AU Support 3",
                "assignee": "KWilliamson"
            }
            await apiHelper.apiLogin('elizabeth');
            let knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData1);
            let knowledgeArticleGUID = knowledgeArticleData.id;
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'Draft')).toBeTruthy("Article with Draft status not updated.");
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'PublishApproval', "KMills", 'GB Support 2', 'Petramco')).toBeTruthy("Article with Published status not updated.");

        });

        it('[3700]: Verify the search functionality of articles with versions from Case Edit > Resources screen', async () => {
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


        it('[3700]: Verify the search functionality of articles with versions from Case Edit > Resources screen', async () => {
            //Login with Case Manager
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
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
            await utilityCommon.closePopUpMessage();
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

        it('[3700]: Verify the search functionality of articles with versions from Case Edit > Resources screen', async () => {
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
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        });

    });

    //skhobrag-defect
    describe('[3707,3712]: Verify the functionality of Edit article with Major Edit button', () => {
        let knowledgeTitleStr = 'Versioning for article' + "_" + randomStr;
        let articleAccessPermission: string[] = [
          "GB Support 2",
          "Petramco",
          "Kane Williamson",
          "Qianru Tao"
        ];
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
            "knowledgeSet": `${knowledgeSetTitleStrPetramco}`,
            "title": `${knowledgeTitleStr}`,
            "templateId": `${knowledgeTemplateId}`,
            "categoryTier1": "Employee Relations",
            "categoryTier2": "Compensation",
            "categoryTier3": "Bonus",
            "region": "Americas",
            "siteGroup": "Marketing",
            "site": "Atlanta",
            "assignedCompany": "Petramco",
            "assigneeBusinessUnit": "United Kingdom Support",
            "assigneeSupportGroup": "GB Support 2",
            "assignee": "KMills",
            "articleDesc": `${knowledgeTitleStr} Desc`
          }

            articleDetails = await apiHelper.createKnowledgeArticle(articleData, attachmentFilePath);
            articleKeywordsVal = ['MyKeyword', `${articleDetails.displayId}`];
        });

        it('[3707,3712]: Verify the functionality of Edit article with Major Edit button', async () => {
            await navigationPage.signOut();
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeConsole.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
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
            await editKnowledgePage.setKnowledgeStatus('Draft');
            expect(await editKnowledgePage.getStatusValue()).toContain('Draft', 'Article is updated with Draft status.');
            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(minorEditOption)).toBeFalsy('Minor Edit Option is displayed for Draft Knowledge Article.');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(majorEditOption)).toBeFalsy('Major Edit Option is displayed for Draft Knowledge Article.');
            await editKnowledgePage.clickArticleCancelButton();
            await statusBladeKnowledgeArticlePo.setKnowledgeStatusWithReviewerDetails('SME Review', 'Petramco', 'Australia Support', 'AU Support 3', 'Kane Williamson');
        });

        it('[3707,3712]: Verify the functionality of Edit article with Major Edit button', async () => {
            await navigationPage.signOut();
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeConsole.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilityGrid.searchAndOpenHyperlink(articleDetails.displayId);
            expect(await viewKnowledgeArticlePo.isReviewMessageDisplayed('Knowledge Article is in Review')).toBeTruthy();
            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(minorEditOption)).toBeFalsy('Minor Edit Option is displayed for SME Review Knowledge Article.');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(majorEditOption)).toBeFalsy('Major Edit Option is displayed for SME Review Knowledge Article.');
            await editKnowledgePage.clickArticleCancelButton();
            await viewKnowledgeArticlePo.clickReviewPendingLink();
            await reviewCommentsPo.setTextInTellUsMore(articleDetails.displayId);
            await reviewCommentsPo.clickApprovedButton();
            await navigationPage.gotoKnowledgeConsole(true);
            await utilityGrid.searchAndOpenHyperlink(articleDetails.displayId);
            expect(await editKnowledgePage.getStatusValue()).toContain('Published', 'Article is updated with Published status.');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.updateKnowledgeArticleViewAndHelpFulCounter(articleDetails.id, articleHelpFulCounterData);
            await utilityCommon.refresh(); // Refresh needed to reflect API changes.
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
            expect(await viewKnowledgeArticlePo.getKnowledgeSet()).toBe(knowledgeSetTitleStrPetramco);
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

        it('[3707,3712]: Verify the functionality of Edit article with Major Edit button', async () => {
            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(minorEditOption)).toBeTruthy('Minor Edit Option is displayed for Published Knowledge Article.');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(majorEditOption)).toBeTruthy('Major Edit Option is displayed for Published Knowledge Article.');
            await editKnowledgePage.selectArticleEditOption(majorEditOption);
            expect(await editKnowledgePage.getHelpTextForMajorEditOptionDisplayed()).toBe(majorEditHelpText);
            await editKnowledgePage.updateKnowledgeArticleTitle(updatedArticleTitle);
            await editKnowledgePage.updateKnowledgeArticleDescription(updatedArticleDesc);
            await editKnowledgePage.clickArticleMajorEditSaveButton();
            let updatedVersion = "Version " + "2" + " - " + actualDate;
            expect(await viewKnowledgeArticlePo.getArticleVersion()).toBe(updatedVersion);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleTitle()).toBe(updatedArticleTitle);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleDescription()).toBe(updatedArticleDesc);
            expect(await viewKnowledgeArticlePo.getKnowledgeSet()).toBe(knowledgeSetTitleStrPetramco);
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
            expect(await viewKnowledgeArticlePo.getKnowledgeSet()).toBe(knowledgeSetTitleStrPetramco);
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
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        });

    });

    //skhobrag-pass
    describe('[3706]: Verify the article status of previous version articles when the new versioned article is moved to Published status', () => {
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
                "knowledgeSet": 'HR',
                "title": `${knowledgeTitleStr}`,
                "templateId": `${knowledgeTemplateId}`,
                "categoryTier1": "Employee Relations",
                "categoryTier2": "Compensation",
                "categoryTier3": "Bonus",
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

        it('[3706]: Verify the article status of previous version articles when the new versioned article is moved to Published status', async () => {
            await navigationPage.signOut();
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeConsole.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
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
            await statusBladeKnowledgeArticlePo.setKnowledgeStatusWithReviewerDetails('SME Review', 'Petramco', 'Australia Support', 'AU Support 3', 'Kane Williamson');
            await navigationPage.signOut();
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeConsole.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilityGrid.searchAndOpenHyperlink(articleDetails.displayId);
            expect(await viewKnowledgeArticlePo.isReviewMessageDisplayed('Knowledge Article is in Review')).toBeTruthy();
            await viewKnowledgeArticlePo.clickReviewPendingLink();
            await reviewCommentsPo.setTextInTellUsMore(articleDetails.displayId);
            await reviewCommentsPo.clickApprovedButton();
            await utilityCommon.refresh(); // Refresh needed to reflect status changes.
            expect(await editKnowledgePage.getStatusValue()).toContain('Published', 'Article is updated with Published status.');
        });

        it('[3706]: Verify the article status of previous version articles when the new versioned article is moved to Published status', async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.updateKnowledgeArticleViewAndHelpFulCounter(articleDetails.id, articleHelpFulCounterData);
            await utilityCommon.refresh(); // Refresh needed to reflect API changes.
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
            await utilityCommon.refresh(); // Refresh needed to reflect version updates.
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
            await utilityCommon.refresh(); // Refresh needed to reflect status changes.
            await browser.sleep(4000); // Hard wait for browser tab to load properly
            expect(await editKnowledgePage.getStatusValue()).toContain('Published', 'Article is updated with Published status.');
            await viewKnowledgeArticlePo.selectArticleVersion('1');
            await browser.sleep(2000); // Hard wait to load the browser completely
            expect(await editKnowledgePage.getStatusValue()).toContain('Closed', 'Article is updated with Closed status.');
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        });
    });

    //skhobrag-pass
    describe('[3702]: Verify the behavior when the user who does not have access to view current article version and he tries to create or update existing version', () => {
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
                "knowledgeSet": 'HR',
                "title": `${knowledgeTitleStr}`,
                "templateId": `${knowledgeTemplateId}`,
                "categoryTier1": "Employee Relations",
                "categoryTier2": "Compensation",
                "categoryTier3": "Bonus",
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

        it('[3702]: Verify the behavior when the user who does not have access to view current article version and he tries to create or update existing version', async () => {
            await navigationPage.signOut();
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeConsole.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
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
            await statusBladeKnowledgeArticlePo.setKnowledgeStatusWithReviewerDetails('SME Review', 'Petramco', 'Australia Support', 'AU Support 3', 'Kane Williamson');
        });
        it('[3702]: Verify the behavior when the user who does not have access to view current article version and he tries to create or update existing version', async () => {
            await navigationPage.signOut();
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeConsole.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilityGrid.searchAndOpenHyperlink(articleDetails.displayId);
            expect(await viewKnowledgeArticlePo.isReviewMessageDisplayed('Knowledge Article is in Review')).toBeTruthy();
            await viewKnowledgeArticlePo.clickReviewPendingLink();
            await reviewCommentsPo.setTextInTellUsMore(articleDetails.displayId);
            await reviewCommentsPo.clickApprovedButton();
            await utilityCommon.refresh(); // Refresh needed to reflect changes.
            expect(await editKnowledgePage.getStatusValue()).toContain('Published', 'Article is updated with Published status.');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.updateKnowledgeArticleViewAndHelpFulCounter(articleDetails.id, articleHelpFulCounterData);
            await utilityCommon.refresh(); // Refresh needed to reflect status changes.
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
        it('[3702]: Verify the behavior when the user who does not have access to view current article version and he tries to create or update existing version', async () => {
            await viewKnowledgeArticlePo.clickEditKnowledgeAccess();
            await accessTabPo.clickToExpandAccessEntitiySearch('Support Group Access', 'Knowledge');
            await accessTabPo.selectAccessEntityDropDown('Petramco', 'Select Company');
            await accessTabPo.selectAccessEntityDropDown('Employee Relations', 'Select Support Group');
            await accessTabPo.clickAccessEntitiyAddButton('Support Group');
            await accessTabPo.clickCloseKnowledgeAccessBlade();
            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(minorEditOption)).toBeTruthy('Minor Edit Option is displayed for Published Knowledge Article.');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(majorEditOption)).toBeTruthy('Major Edit Option is displayed for Published Knowledge Article.');
            await editKnowledgePage.selectArticleEditOption(majorEditOption);
            expect(await editKnowledgePage.getHelpTextForMajorEditOptionDisplayed()).toBe(majorEditHelpText);
            await editKnowledgePage.updateKnowledgeArticleTitle(updatedArticleTitle);
            await editKnowledgePage.clickArticleMajorEditSaveButton();
            await browser.sleep(4000); // To Wait Until Edit Knowledge Changes Gets Saved KA Version Gets Change.
            await utilityCommon.refresh(); // Refresh needed to reflect version update.
            let updatedVersion = "Version " + "2" + " - " + actualDate;
            expect(await viewKnowledgeArticlePo.getArticleVersion()).toBe(updatedVersion);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleTitle()).toBe(updatedArticleTitle);

            await viewKnowledgeArticlePo.clickEditKnowledgeAccess();
            await accessTabPo.clickRemoveAccess('Petramco', true);
            await accessTabPo.clickAccessRemoveWarningBtn('Yes');
            await accessTabPo.clickRemoveAccess('Employee Relations', true);
            await accessTabPo.clickAccessRemoveWarningBtn('Yes');
            await accessTabPo.clickCloseKnowledgeAccessBlade();
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();

            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeConsole.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilityGrid.searchAndOpenHyperlink(articleData.title);

            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(minorEditOption)).toBeTruthy('Minor Edit Option is displayed for Published Knowledge Article.');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(majorEditOption)).toBeTruthy('Major Edit Option is displayed for Published Knowledge Article.');
            await editKnowledgePage.selectArticleEditOption(majorEditOption);
            await editKnowledgePage.updateKnowledgeArticleTitle(updatedArticleTitle + "_updated version");
            await editKnowledgePage.clickArticleMajorEditSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Draft version already created.', 1)).toBeTruthy();
            await browser.sleep(4000); // To Wait Until Edit Knowledge Changes Gets Saved KA Version Gets Change.
            await utilityCommon.refresh(); // Refresh needed to reflect version updates.
            expect(await viewKnowledgeArticlePo.getArticleVersion()).toBe(expectedVersion);
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        });

    });

    //skhobrag-pass
    describe('[3714]: Verify that the newly created article with version displays on knowledge grid console', () => {
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
            "knowledgeSet": "HR",
            "title": `${knowledgeTitleStr}`,
            "templateId": `${knowledgeTemplateId}`,
            "categoryTier1": "Employee Relations",
            "categoryTier2": "Compensation",
            "categoryTier3": "Bonus",
            "region": "Americas",
            "siteGroup": "Marketing",
            "site": "Atlanta",
            "assignedCompany": "Petramco",
            "assigneeBusinessUnit": "United Kingdom Support",
            "assigneeSupportGroup": "GB Support 2",
            "assignee": "KMills",
            "articleDesc": `${knowledgeTitleStr} Desc`
          }
            articleDetails = await apiHelper.createKnowledgeArticle(articleData, attachmentFilePath);
        });

        it('[3714]: Verify that the newly created article with version displays on knowledge grid console', async () => {
            await navigationPage.signOut();
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeConsole.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilityGrid.searchAndOpenHyperlink(articleDetails.displayId);
            expect(await viewKnowledgeArticlePo.isEditLinkDisplayedOnKA()).toBeTruthy('Article view screen is not displayed');
            expect(await viewKnowledgeArticlePo.isArticleVersionDisplayed()).toBeTruthy('Article version on View knowledge article is not displayed');
            let actualVersion = await viewKnowledgeArticlePo.getArticleVersion();
            actualDate = await viewKnowledgeArticlePo.formatDate();
            let expectedVersion = "Version " + "1" + " - " + actualDate;
            expect(actualVersion).toBe(expectedVersion);
            await editKnowledgePage.setKnowledgeStatus('Draft');
            await utilityCommon.closePopUpMessage();
            expect(await editKnowledgePage.getStatusValue()).toContain('Draft', 'Article is updated with Draft status.');
            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(minorEditOption)).toBeFalsy('Minor Edit Option is displayed for Draft Knowledge Article.');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(majorEditOption)).toBeFalsy('Major Edit Option is displayed for Draft Knowledge Article.');
            await editKnowledgePage.clickArticleCancelButton();
            await statusBladeKnowledgeArticlePo.setKnowledgeStatusWithReviewerDetails('SME Review', 'Petramco', 'Australia Support', 'AU Support 3', 'Kane Williamson');
            await navigationPage.signOut();
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeConsole.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilityGrid.searchAndOpenHyperlink(articleDetails.displayId);
            expect(await viewKnowledgeArticlePo.isReviewMessageDisplayed('Knowledge Article is in Review')).toBeTruthy();
            await viewKnowledgeArticlePo.clickReviewPendingLink();
            await reviewCommentsPo.setTextInTellUsMore(articleDetails.displayId);
            await reviewCommentsPo.clickApprovedButton();
            await utilityCommon.refresh(); // Refresh needed to reflect status changes.
            expect(await editKnowledgePage.getStatusValue()).toContain('Published', 'Article is updated with Published status.');
        });

        it('[3714]: Verify that the newly created article with version displays on knowledge grid console', async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.updateKnowledgeArticleViewAndHelpFulCounter(articleDetails.id, articleHelpFulCounterData);
            await utilityCommon.refresh(); // Refresh needed to reflect API changes.
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
            await utilityCommon.refresh(); // Refresh needed to reflect version updates.
            await browser.sleep(4000); // Hard wait to load the browser tab completely
            let updatedVersion = "Version " + "2" + " - " + actualDate;
            expect(await viewKnowledgeArticlePo.getArticleVersion()).toBe(updatedVersion);
            console.log(updatedVersion);
            console.log(await viewKnowledgeArticlePo.getArticleVersion());

            expect(await viewKnowledgeArticlePo.getKnowledgeArticleTitle()).toBe(updatedArticleTitle);

            await navigationPage.signOut();
            await loginPage.login('elizabeth');
            await navigationPage.gotoKnowledgeConsole();
            await browser.sleep(5000);// Hard wait to load the tab properly
            expect(await knowledgeConsole.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
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
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        });
    });

    //skhobrag-defect
    describe('[3701]: Verify the behavior when the article with current version is canceled and user tries to create a new version after canceled operation', () => {
        let knowledgeTitleStr = 'Versioning for article' + "_" + randomStr;
        let articleAccessPermission: string[] = ['GB Support 2', 'Petramco', 'Kane Williamson', 'Qianru Tao'];
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
            "knowledgeSet": `${knowledgeSetTitleStrPetramco}`,
            "title": `${knowledgeTitleStr}`,
            "templateId": `${knowledgeTemplateId}`,
            "categoryTier1": "Employee Relations",
            "categoryTier2": "Compensation",
            "categoryTier3": "Bonus",
            "region": "Americas",
            "siteGroup": "Marketing",
            "site": "Atlanta",
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

        it('[3701]: Verify the behavior when the article with current version is canceled and user tries to create a new version after canceled operation', async () => {
            await navigationPage.signOut();
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeConsole.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
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
            await editKnowledgePage.setKnowledgeStatus('Draft');
            expect(await editKnowledgePage.getStatusValue()).toContain('Draft', 'Article is updated with Draft status.');
            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(minorEditOption)).toBeFalsy('Minor Edit Option is displayed for Draft Knowledge Article.');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(majorEditOption)).toBeFalsy('Major Edit Option is displayed for Draft Knowledge Article.');
            await editKnowledgePage.clickArticleCancelButton();
        });
        it('[3701]: Verify the behavior when the article with current version is canceled and user tries to create a new version after canceled operation', async () => {
            await statusBladeKnowledgeArticlePo.setKnowledgeStatusWithReviewerDetails('SME Review', 'Petramco', 'Australia Support', 'AU Support 3', 'Kane Williamson');
            await navigationPage.signOut();
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeConsole.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilityGrid.searchAndOpenHyperlink(articleDetails.displayId);
            expect(await viewKnowledgeArticlePo.isReviewMessageDisplayed('Knowledge Article is in Review')).toBeTruthy();
            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(minorEditOption)).toBeFalsy('Minor Edit Option is displayed for SME Review Knowledge Article.');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(majorEditOption)).toBeFalsy('Major Edit Option is displayed for SME Review Knowledge Article.');
            await editKnowledgePage.clickArticleCancelButton();
            await viewKnowledgeArticlePo.clickReviewPendingLink();
            await reviewCommentsPo.setTextInTellUsMore(articleDetails.displayId);
            await reviewCommentsPo.clickApprovedButton();
            await utilityCommon.refresh(); // Refresh needed to reflect status changes.
            expect(await editKnowledgePage.getStatusValue()).toContain('Published', 'Article is updated with Published status.');
        });

        it('[3701]: Verify the behavior when the article with current version is canceled and user tries to create a new version after canceled operation', async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.updateKnowledgeArticleViewAndHelpFulCounter(articleDetails.id, articleHelpFulCounterData);
            await utilityCommon.refresh(); // Refresh needed to reflect API changes.
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
            expect(await viewKnowledgeArticlePo.getKnowledgeSet()).toBe(knowledgeSetTitleStrPetramco);
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
        it('[3701]: Verify the behavior when the article with current version is canceled and user tries to create a new version after canceled operation', async () => {
            //await utilityCommon.refresh(); // Refresh needed to reflect version update.
            await browser.sleep(2000);

            updatedVersion = "Version " + "2" + " - " + actualDate;
            expect(await viewKnowledgeArticlePo.getArticleVersion()).toBe(updatedVersion);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleTitle()).toBe(updatedArticleTitle);
            await viewKnowledgeArticlePo.clickEditKnowledgeAccess();
            await accessTabPo.clickToExpandAccessEntitiySearch('Support Group Access', 'Knowledge');
            await accessTabPo.selectAccessEntityDropDown('Petramco', 'Select Company');
            await accessTabPo.selectAccessEntityDropDown('HR Support', 'Select Business Unit');
            await accessTabPo.selectAccessEntityDropDown('Employee Relations', 'Select Support Group');
            await accessTabPo.clickAccessEntitiyAddButton('Support Group');
            await accessTabPo.clickCloseKnowledgeAccessBlade();
            await browser.sleep(2000);
            await utilityCommon.refresh(); // Refresh needed to reflect article updates.
            await browser.sleep(2000);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleDescription()).toBe(updatedArticleDesc);
            expect(await viewKnowledgeArticlePo.getKnowledgeSet()).toBe(knowledgeSetTitleStrPetramco);
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

        it('[3701]: Verify the behavior when the article with current version is canceled and user tries to create a new version after canceled operation', async () => {
            await editKnowledgePage.setKnowledgeStatus('Request Cancelation');
            await navigationPage.gotoKnowledgeConsole(true);
            await utilityGrid.searchAndOpenHyperlink(articleDetails.displayId);
            await browser.sleep(2000);
            await utilityCommon.refresh(); // Refresh needed to reflect status changes.
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
        it('[3701]: Verify the behavior when the article with current version is canceled and user tries to create a new version after canceled operation', async () => {
            updatedVersion = "Version " + "3" + " - " + actualDate;
            expect(await viewKnowledgeArticlePo.getArticleVersion()).toBe(updatedVersion);
            expect(await editKnowledgePage.getStatusValue()).toContain('Draft', 'Article is updated with Published status.');
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleTitle()).toBe(updatedArticleTitle + "_for Version 3");
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleDescription()).toBe(updatedArticleDesc + "_for Version 3");
            expect(await viewKnowledgeArticlePo.getKnowledgeSet()).toBe(knowledgeSetTitleStrPetramco);
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
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        });
    });

    //skhobrag-pass
    describe('[3704]:  Verify whether the user with appropriate knowledge permission roles can able to update the article with updated / new version', () => {
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
            "knowledgeSet": "HR",
            "title": `${knowledgeTitleStr}`,
            "templateId": `${knowledgeTemplateId}`,
            "categoryTier1": "Employee Relations",
            "categoryTier2": "Compensation",
            "categoryTier3": "Bonus",
            "region": "Americas",
            "siteGroup": "Marketing",
            "site": "Atlanta",
            "assignedCompany": "Petramco",
            "assigneeBusinessUnit": "United Kingdom Support",
            "assigneeSupportGroup": "GB Support 2",
            "assignee": "KMills",
            "articleDesc": `${knowledgeTitleStr} Desc`
          }
            articleDetails = await apiHelper.createKnowledgeArticle(articleData, attachmentFilePath);
        });

        it('[3704]:  Verify whether the user with appropriate knowledge permission roles can able to update the article with updated / new version', async () => {
            await navigationPage.signOut();
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeConsole.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
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
            await editKnowledgePage.setKnowledgeStatus('Draft');
            expect(await editKnowledgePage.getStatusValue()).toContain('Draft', 'Article is updated with Draft status.');
        });
        it('[3704]:  Verify whether the user with appropriate knowledge permission roles can able to update the article with updated / new version', async () => {
            await viewKnowledgeArticlePo.clickEditKnowledgeAccess();
            await accessTabPo.clickToExpandAccessEntitiySearch('Support Group Access', 'Knowledge');
            await accessTabPo.selectAccessEntityDropDown('Petramco', 'Select Company');
            await accessTabPo.selectAccessEntityDropDown('AU Support 1', 'Select Support Group');
            await accessTabPo.clickAccessEntitiyAddButton('Support Group');
            await accessTabPo.clickCloseKnowledgeAccessBlade();
        });
        it('[3704]:  Verify whether the user with appropriate knowledge permission roles can able to update the article with updated / new version', async () => {
            await viewKnowledgeArticlePo.clickEditKnowledgeAccess();
            await accessTabPo.clickToExpandAccessEntitiySearch('Support Group Access', 'Knowledge');
            await accessTabPo.selectAccessEntityDropDown('Petramco', 'Select Company');
            await accessTabPo.selectAccessEntityDropDown('IN Support 2', 'Select Support Group');
            await accessTabPo.clickAccessEntitiyAddButton('Support Group');
            await accessTabPo.clickCloseKnowledgeAccessBlade();
            await viewKnowledgeArticlePo.clickEditKnowledgeAccess();
            await accessTabPo.clickToExpandAccessEntitiySearch('Support Group Access', 'Knowledge');
            await accessTabPo.selectAccessEntityDropDown('Petramco', 'Select Company');
            await accessTabPo.selectAccessEntityDropDown('IN Support 3', 'Select Support Group');
            await accessTabPo.clickAccessEntitiyAddButton('Support Group');
            await accessTabPo.clickCloseKnowledgeAccessBlade();
            await viewKnowledgeArticlePo.clickEditKnowledgeAccess();
            await accessTabPo.clickToExpandAccessEntitiySearch('Support Group Access', 'Knowledge');
            await accessTabPo.selectAccessEntityDropDown('Petramco', 'Select Company');
            await accessTabPo.selectAccessEntityDropDown('US Support 1', 'Select Support Group');
            await accessTabPo.clickAccessEntitiyAddButton('Support Group');
            await accessTabPo.clickCloseKnowledgeAccessBlade();
            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(minorEditOption)).toBeFalsy('Minor Edit Option is displayed for Draft Knowledge Article.');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(majorEditOption)).toBeFalsy('Major Edit Option is displayed for Draft Knowledge Article.');
            await editKnowledgePage.clickArticleCancelButton();
            await statusBladeKnowledgeArticlePo.setKnowledgeStatusWithReviewerDetails('SME Review', 'Petramco', 'Australia Support', 'AU Support 3', 'Kane Williamson');
        });

        it('[3704]:  Verify whether the user with appropriate knowledge permission roles can able to update the article with updated / new version', async () => {
            await navigationPage.signOut();
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            await utilityGrid.searchAndOpenHyperlink(articleDetails.displayId);
            expect(await viewKnowledgeArticlePo.isReviewMessageDisplayed('Knowledge Article is in Review')).toBeTruthy();
            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(minorEditOption)).toBeFalsy('Minor Edit Option is displayed for SME Review Knowledge Article.');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed(majorEditOption)).toBeFalsy('Major Edit Option is displayed for SME Review Knowledge Article.');
            await editKnowledgePage.clickArticleCancelButton();
            await viewKnowledgeArticlePo.clickReviewPendingLink();
            await reviewCommentsPo.setTextInTellUsMore(articleDetails.displayId);
            await reviewCommentsPo.clickApprovedButton();
            await utilityCommon.refresh(); // Refresh needed to reflect status changes.
            expect(await editKnowledgePage.getStatusValue()).toContain('Published', 'Article is updated with Published status.');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.updateKnowledgeArticleViewAndHelpFulCounter(articleDetails.id, articleHelpFulCounterData);
            await utilityCommon.refresh(); // Refresh needed to reflect API changes.
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            await editKnowledgePage.selectIsExternalOption('Yes');
            await editKnowledgePage.enterKeyword(articleDetails.displayId);
            await editKnowledgePage.clickSaveKnowledgeMetadata();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy();
            await utilityCommon.closePopUpMessage();
            await viewKnowledgeArticlePo.clickOnFlagButton();
            await flagUnflagKnowledgePo.setTextInTellUsMore(articleDetails.displayId);
            await flagUnflagKnowledgePo.clickOnFlageButtonOnBlade();

            await navigationPage.signOut();
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
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
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        });

    });

    xdescribe('[3697]:  Verify the article versioning with respect to custom status configuration', () => {
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            const personDataFile = require('../../data/ui/foundation/person.ui.json');
            let personData1 = personDataFile['PhylumKnowledgeUser1'];
            await apiHelper.createNewUser(personData1);
            await apiHelper.associatePersonToSupportGroup(personData1.userId, 'Phylum Support Group1');
            await apiHelper.associatePersonToCompany(personData1.userId, 'Phylum');

            //KNowledge Set for Phylum
            let knowledgeSetDataPhylum = {
                knowledgeSetTitle: `${knowledgeSetTitleStrPhylum}`,
                knowledgeSetDesc: `${knowledgeSetTitleStrPhylum}_Desc`,
                company: 'Phylum',
                lineOfBusiness: "Finance"
            }
            await navigationPage.signOut();
            await loginPage.login("idphylumkuser@petramco.com", "Password_1234");
            await apiHelper.apiLogin("idphylumkuser@petramco.com", "Password_1234");
            await apiHelper.createKnowledgeSet(knowledgeSetDataPhylum);
        });
        xit('[3697]:  Verify the article versioning with respect to custom status configuration', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Status Configuration', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.STATUS_CONFIGURATION);
            await statusConfigPO.setCompanyDropdown('Phylum', 'knowledge');
            await statusConfigPO.clickEditLifeCycleLink();
            await statusConfigPO.clickEditStatus("Published");
            await statusConfigPO.renameExistingStatus('Released');
            await statusConfigPO.clickOnBackButton();
            await statusConfigPO.clickEditLifeCycleLink();
            await statusConfigPO.addCustomStatus('SME Review', 'Publish Approval', 'BeforePublished'); //this custom status already created in knowledge-preset-filter.e2e-spec
            await statusConfigPO.addCustomStatus('Released', 'Retire Approval', 'AfterPublished'); //which executes before this class
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.switchToApplication(knowledgeManagementApp);
        });

        xit('[3697]:  Verify the article versioning with respect to custom status configuration', async () => {
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate('Reference');
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField('3697 Title');
            await createKnowledgePage.setReferenceValue('3697 Reference data')
            await createKnowledgePage.selectKnowledgeSet(`${knowledgeSetTitleStrPhylum}`);
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await previewKnowledgePo.clickGoToArticleButton();
            await editKnowledgePage.setKnowledgeStatus('Draft');
            await utilityCommon.closePopUpMessage();
            await editKnowledgePage.setKnowledgeStatusWithoutSave('SME Review');
            await statusBladeKnowledgeArticlePo.clickChangeReviewerBtn();
            await changeAssignmentBlade.setDropDownValue('AssignedGroup', 'Phylum Support Group1');
            await changeAssignmentBlade.setDropDownValue('Assignee', 'phylumfnk1 phylumlnk1');
            await changeAssignmentBlade.clickOnAssignButton();
            await editKnowledgePage.clickSaveStatusBtn();
            await viewKnowledgeArticlePo.clickReviewPendingLink();
            let knowledgeArticleDisplayId = await previewKnowledgePo.getKnowledgeArticleID();
            await reviewCommentsPo.setTextInTellUsMore('Approved Article');
            await reviewCommentsPo.clickApprovedButton();
            await utilityCommon.closePopUpMessage();
            await navigationPage.gotoKnowledgeConsole(true);
            await utilityGrid.searchAndOpenHyperlink(knowledgeArticleDisplayId);
            expect(await viewKnowledgeArticlePo.getStatusValue()).toContain('BeforePublished', 'value is not matched with status');
            await viewKnowledgeArticlePo.clickOnEditLink();
            expect(await editKnowledgePage.isArticleEditOptionDisplayed('Major Edit')).toBeFalsy('Versions Edit is displayed');
            expect(await editKnowledgePage.isArticleEditOptionDisplayed('Minor Edit')).toBeFalsy('Versions Edit is displayed');
            await editKnowledgePage.clickArticleCancelButton();
            await editKnowledgePage.setKnowledgeStatus('Publish Approval');
            await utilityCommon.closePopUpMessage();
            await navigationPage.gotoKnowledgeConsole(true);
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
