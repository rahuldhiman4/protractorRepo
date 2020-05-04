import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import changeAssignmentBladePo from '../../pageobject/common/change-assignment-blade.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import { default as createKnowledgePage } from "../../pageobject/knowledge/create-knowlege.po";
import editKnowledgePage from "../../pageobject/knowledge/edit-knowledge.po";
import feedbackBladeKnowledgeArticlePo from '../../pageobject/knowledge/feedback-blade-Knowledge-article.po';
import flagUnflagKnowledgePo from '../../pageobject/knowledge/flag-unflag-knowledge.po';
import { default as knowledgeArticlesConsolePo, default as knowledgeConsolePo } from '../../pageobject/knowledge/knowledge-articles-console.po';
import previewKnowledgePo from '../../pageobject/knowledge/preview-knowledge.po';
import viewKnowledgeArticlePo from '../../pageobject/knowledge/view-knowledge-article.po';
import consoleKnowledgeTemplatePo from '../../pageobject/settings/knowledge-management/console-knowledge-template.po';
import createKnowledgeArticleTemplatePo from '../../pageobject/settings/knowledge-management/create-knowledge-article-template.po';
import editKnowledgeArticleTemplatePo from '../../pageobject/settings/knowledge-management/edit-knowledge-article-template.po';
import activityTabPo from '../../pageobject/social/activity-tab.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilGrid from '../../utils/util.grid';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

describe('Knowledge Article', () => {
    const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
    var knowledgeCandidateUser = 'kayo';
    var knowledgeContributorUser = 'kkohri';
    var knowledgePublisherUser = 'kmills';
    var knowledgeCoachUser = 'kWilliamson';
    var knowledgeManagementApp = "Knowledge Management";
    var knowledgeArticlesTitleStr = "Knowledge Articles";
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('peter');
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    afterEach(async () => {
        await utilityCommon.refresh();
    });

    //ptidke
    it('[DRDMV-2604]: [Flag an Article] Unflag a published artilcles by Asignee_Knowledge publisher', async () => {
        try {
            let knowledgeTitile = 'knowledge2604' + randomStr;
            await apiHelper.apiLogin('peter');
            let articleData = {
                "knowledgeSet": "HR",
                "title": `${knowledgeTitile}`,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignee": "KMills",
                "assigneeSupportGroup": "AU Support 3",
                "company": "Petramco"
            }
            let knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
            let knowledgeDisplayID = knowledgeArticleData.displayId;
            let knowledgeArticleGUID = knowledgeArticleData.id;
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'Draft')).toBeTruthy('Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'PublishApproval', "qkatawazi", "Compensation and Benefits")).toBeTruthy('Status Not Set');
            await apiHelper.flagAndUnflagKnowledgeArticle(knowledgeArticleGUID, knowledgeTitile, 1);
            await navigationPage.signOut();
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilityCommon.switchToNewTab(1);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr, 'title not correct');
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(knowledgeDisplayID);
            await viewKnowledgeArticlePo.clickOnUnFlagButton();
            await flagUnflagKnowledgePo.setTextInTellUsMore(knowledgeArticlesTitleStr + randomStr);
            await flagUnflagKnowledgePo.clickOnUnFlageButtonOnBlade();
            await viewKnowledgeArticlePo.clickOnTab('Activity');
            expect(await activityTabPo.getFirstPostContent()).toContain(knowledgeArticlesTitleStr + randomStr, 'content not displaying on Activity'), 'content not displaying on Activity';
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        }
        catch (e) {
            throw e;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('peter');
            await utilCommon.waitUntilSpinnerToHide();
        }
    });//, 140 * 1000);

    //ptidke
    it('[DRDMV-13646,DRDMV-13681]: Create a Knowledge article and check Knowledge Preview', async () => {
        try {
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate('Reference');
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField('Knowledge' + randomStr);
            await createKnowledgePage.setReferenceValue('KnowledgeReference' + randomStr);
            await createKnowledgePage.selectKnowledgeSet('HR');
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            expect(await previewKnowledgePo.getKnowledgeArticleTitle()).toContain('Knowledge' + randomStr, 'title not correct');
            expect(await previewKnowledgePo.getKnowledgeArticleSection()).toContain('KnowledgeReference' + randomStr, 'section not correct');
            expect(await previewKnowledgePo.getKnowledgeArticleID()).toContain('KA-', 'article id is not as expected');
            expect(await previewKnowledgePo.isBackButtonDisplay()).toBeTruthy('back button not present');
            expect(await previewKnowledgePo.isViewArticleLInkDisplay()).toBeTruthy('viewArticle link Not peresent');
            expect(await previewKnowledgePo.isStatusOfKADisplay()).toBeTruthy('Status not displaying');
            await previewKnowledgePo.clickOnBackButton();
        }
        catch (e) {
            throw e;
        }
        finally {
            await utilityCommon.refresh();
            await utilCommon.waitUntilSpinnerToHide();
        }
    });

    //ptidke
    it('[DRDMV-1164]: PermissionModel_Knowledge Coach permission create knowledge articles', async () => {
        try {
            await navigationPage.signOut();
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilityCommon.switchToNewTab(1);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr, 'Not expected title');
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate('Reference');
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField('Knowledge1164' + randomStr);
            await createKnowledgePage.setReferenceValue('KnowledgeReference1164' + randomStr)
            await createKnowledgePage.selectKnowledgeSet('HR');
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await utilityCommon.waitUntilPopUpDisappear();
            expect(await previewKnowledgePo.isViewArticleLInkDisplay()).toBeTruthy();
            await previewKnowledgePo.clickOnBackButton();
            await navigationPage.gotoKnoweldgeConsoleFromKM();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            await utilityGrid.clearFilter();
            await utilityGrid.searchRecord('Knowledge1164' + randomStr);
            expect(await knowledgeConsolePo.isValueDisplayedInGrid('Title')).toContain('Knowledge1164' + randomStr, 'value is not displaying in Grid');
        }
        catch (e) {
            throw e;
        }
        finally {
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('peter');
        }
    });//, 200 * 1000);

    //ptidke
    it('[DRDMV-2374]: [Edit Knowledge Article] Article creation not possible by selecting disabled templates', async () => {
        try {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Article Templates', 'Knowledge Article Templates - Business Workflows');
            await consoleKnowledgeTemplatePo.clickCreateNewKATemplate();
            await createKnowledgeArticleTemplatePo.setTemplateName(randomStr);
            await createKnowledgeArticleTemplatePo.clickOnDisableEnableCheckBox();
            await createKnowledgeArticleTemplatePo.clickOnAddSection();
            await createKnowledgeArticleTemplatePo.setKnowledgeSetValue('Global');
            await createKnowledgeArticleTemplatePo.setSectionTitle('NewThings' + randomStr);
            await createKnowledgeArticleTemplatePo.setDescription('DescriptionOFKA');
            await createKnowledgeArticleTemplatePo.clickOnSaveButton();
            await navigationPage.gotoCreateKnowledge();
            expect(await createKnowledgePage.isTemplatePresent(randomStr)).toBeFalsy('Template is present');
        }
        catch (e) {
            throw e;
        }
        finally {
            await utilityCommon.refresh();
            await utilCommon.waitUntilSpinnerToHide();
        }
    });

    //ptidke
    it('[DRDMV-774,DRDMV-2447]: [Knowledge Article] [SearchArticle] Knowledge article search with article ID and title', async () => {
        let knowledgeGridColumnFields: string[] = ["Assigned Group", "Assignee Login Name", "Author", "GUID", "Region", "Review Status", "Category Tier 1", "Category Tier 2", "Category Tier 3"];
        let knowledgeTitle = 'knowledge774' + randomStr;
        await apiHelper.apiLogin('peter');
        let articleData = {
            "knowledgeSet": "HR",
            "title": `${knowledgeTitle}`,
            "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
        }
        let knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
        await navigationPage.gotoKnowledgeConsole();
        await knowledgeConsolePo.addColumnOnGrid(knowledgeGridColumnFields)
        await utilityGrid.clearFilter();
        await utilityGrid.searchRecord(knowledgeTitle);
        expect(await knowledgeConsolePo.isValueDisplayedInGrid('Title')).toContain(knowledgeTitle, 'KA not present1');
        await utilityGrid.searchRecord(knowledgeArticleData.displayId);
        expect(await knowledgeConsolePo.isValueDisplayedInGrid('Article ID')).toContain(knowledgeArticleData.displayId, 'KA not present2');
        await knowledgeConsolePo.removeColumnOnGrid(knowledgeGridColumnFields);
    });

    //ptidke
    it('[DRDMV-3095]: Submitter can cancel the article from Draft status_Submitter is assignee', async () => {
        try {
            let knowledgeTitile = 'knowledge3095' + randomStr;
            await apiHelper.apiLogin(knowledgeCandidateUser);
            let articleData = {
                "knowledgeSet": "HR",
                "title": `${knowledgeTitile}`,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignee": "kayo",
                "assigneeSupportGroup": "US Support 1",
                "company": "Petramco"
            }
            let KADetails = await apiHelper.createKnowledgeArticle(articleData);
            let displayID = KADetails.displayId;
            await navigationPage.signOut();
            await loginPage.login(knowledgeCandidateUser);
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(displayID);
            await editKnowledgePage.setKnowledgeStatus('Draft');
            expect(await editKnowledgePage.getStatusValue()).toContain('Draft', 'Status Not set');
            await editKnowledgePage.setKnowledgeStatus('Canceled');
            expect(await editKnowledgePage.getStatusValue()).toContain('Canceled', 'Status Not set');
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            //login with contributor
            await loginPage.login(knowledgeContributorUser);
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            let knowledgeTitile1 = 'knowledgeContributor3095' + randomStr;
            await apiHelper.apiLogin(knowledgeCandidateUser);
            let articleData1 = {
                "knowledgeSet": "HR",
                "title": `${knowledgeTitile1}`,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignee": "kkohri",
                "assigneeSupportGroup": "GB Support 1",
                "company": "Petramco"
            }
            let kkohriId = await apiHelper.createKnowledgeArticle(articleData1);
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(kkohriId.displayId);
            await editKnowledgePage.setKnowledgeStatus('Draft');
            expect(await editKnowledgePage.getStatusValue()).toContain('Draft', 'Status Not set');
            await editKnowledgePage.setKnowledgeStatus('Canceled');
            expect(await editKnowledgePage.getStatusValue()).toContain('Canceled', 'Status Not set');
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            //login with publisher
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            let knowledgeTitile2 = 'knowledgePublisher3095' + randomStr;
            await apiHelper.apiLogin(knowledgePublisherUser);
            let articleData2 = {
                "knowledgeSet": "HR",
                "title": `${knowledgeTitile2}`,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignee": "KMills",
                "assigneeSupportGroup": "GB Support 2",
                "company": "Petramco"
            }
            let kmillsId = await apiHelper.createKnowledgeArticle(articleData2);
            console.log(kmillsId);
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(kmillsId.displayId);
            await editKnowledgePage.setKnowledgeStatus('Draft');
            expect(await editKnowledgePage.getStatusValue()).toContain('Draft', 'Status Not set');
            await editKnowledgePage.setKnowledgeStatus('Canceled');
            expect(await editKnowledgePage.getStatusValue()).toContain('Canceled', 'Status Not set');
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            //login with publisher
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            let knowledgeTitile3 = 'knowledgeCoachUser3095' + randomStr;
            await apiHelper.apiLogin(knowledgeCoachUser);
            let articleData3 = {
                "knowledgeSet": "HR",
                "title": `${knowledgeTitile3}`,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignee": "KWilliamson",
                "assigneeSupportGroup": "AU Support 3",
                "company": "Petramco"
            }
            let kWilliamsonId = await apiHelper.createKnowledgeArticle(articleData3);
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(kWilliamsonId.displayId);
            await editKnowledgePage.setKnowledgeStatus('Draft');
            expect(await editKnowledgePage.getStatusValue()).toContain('Draft', 'Status Not set');
            await editKnowledgePage.setKnowledgeStatus('Canceled');
            expect(await editKnowledgePage.getStatusValue()).toContain('Canceled', 'Status Not set');
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
        }
        catch (e) {
            throw e;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('peter');
        }
    }, 450 * 1000);

    //ptidke
    it('[DRDMV-792]: [KM-BWF integration] [Knowledge Article] Edit the knowledge article from the Knowledge Workspace', async () => {
        let knowledgeTitile = 'knowledge792' + randomStr;
        await apiHelper.apiLogin('peter');
        let articleData = {
            "knowledgeSet": "HR",
            "title": `${knowledgeTitile}`,
            "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
        }
        let knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
        await navigationPage.gotoKnowledgeConsole();
        await utilityGrid.clearFilter();
        await utilityGrid.searchAndOpenHyperlink(knowledgeArticleData.displayId);
        await viewKnowledgeArticlePo.clickOnEditLink();
        let updatedName = 'updatedName' + randomStr;
        await editKnowledgePage.changeKnowledgeTitle(updatedName);
        await editKnowledgePage.clickOnSaveButtonOfKA();
        await utilityCommon.waitUntilPopUpDisappear();
        expect(await viewKnowledgeArticlePo.isEditLinkDisplayedOnKA()).toBeTruthy('edit link is not present');
        await navigationPage.gotoKnowledgeConsole();
        await utilityGrid.clearFilter();
        await utilityGrid.searchRecord(knowledgeArticleData.displayId);
        console.log(updatedName);
        expect(await knowledgeConsolePo.isValueDisplayedInGrid('Title')).toContain(updatedName, 'KA not present');
    });

    //ptidke
    it('[DRDMV-3093]: Submitter can cancel the article from In Progress status_Submitter is assignee', async () => {
        try {
            let knowledgeTitile = 'knowledge3093' + randomStr;
            await apiHelper.apiLogin(knowledgeCandidateUser);
            let articleData = {
                "knowledgeSet": "HR",
                "title": `${knowledgeTitile}`,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignee": "kayo",
                "assigneeSupportGroup": "US Support 1",
                "company": "Petramco"
            }
            let KADetails = await apiHelper.createKnowledgeArticle(articleData);
            await navigationPage.signOut();
            await loginPage.login(knowledgeCandidateUser);
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(KADetails.displayId);
            await editKnowledgePage.setKnowledgeStatus('Canceled');
            expect(await editKnowledgePage.getStatusValue()).toContain('Canceled', 'Status not Set');
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            //login with contributor
            await loginPage.login(knowledgeContributorUser);
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            let knowledgeTitile1 = 'knowledgeContributor3093' + randomStr;
            await apiHelper.apiLogin(knowledgeCandidateUser);
            let articleData1 = {
                "knowledgeSet": "HR",
                "title": `${knowledgeTitile1}`,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignee": "kkohri",
                "assigneeSupportGroup": "US Support 1",
                "company": "Petramco"
            }
            let kkohriId = await apiHelper.createKnowledgeArticle(articleData1);
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(kkohriId.displayId);
            await editKnowledgePage.setKnowledgeStatus('Canceled');
            expect(await editKnowledgePage.getStatusValue()).toContain('Canceled', 'Status Not set');
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            //login with publisher
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            let knowledgeTitile2 = 'knowledgePublisher3093' + randomStr;
            await apiHelper.apiLogin(knowledgePublisherUser);
            let articleData2 = {
                "knowledgeSet": "HR",
                "title": `${knowledgeTitile2}`,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignee": "KMills",
                "assigneeSupportGroup": "GB Support 2",
                "company": "Petramco"
            }
            let kmillsId = await apiHelper.createKnowledgeArticle(articleData2);
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(kmillsId.displayId);
            await editKnowledgePage.setKnowledgeStatus('Canceled');
            expect(await editKnowledgePage.getStatusValue()).toContain('Canceled', 'Status not set');
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            //login with publisher
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            let knowledgeTitile3 = 'knowledgeCoachUser3093' + randomStr;
            await apiHelper.apiLogin(knowledgeCoachUser);
            let articleData3 = {
                "knowledgeSet": "HR",
                "title": `${knowledgeTitile3}`,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignee": "KWilliamson",
                "assigneeSupportGroup": "AU Support 3",
                "company": "Petramco"
            }
            let kWilliamsonId = await apiHelper.createKnowledgeArticle(articleData3);
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(kWilliamsonId.displayId);
            await editKnowledgePage.setKnowledgeStatus('Canceled');
            expect(await editKnowledgePage.getStatusValue()).toContain('Canceled', 'Status not set');
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
        }
        catch (e) {
            throw e;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('peter');
        }
    }, 380 * 1000);

    //ptidke
    it('[DRDMV-2586]: [Flag an Article] Flag an article and post a comment', async () => {
        try {
            let knowledgeTitile = 'knowledge2586' + randomStr;
            await apiHelper.apiLogin(knowledgeCandidateUser);
            let articleData = {
                "knowledgeSet": "HR",
                "title": `${knowledgeTitile}`,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignee": "kayo",
                "assigneeSupportGroup": "US Support 1",
                "company": "Petramco"
            }
            let KADetails = await apiHelper.createKnowledgeArticle(articleData);
            await navigationPage.signOut();
            await loginPage.login(knowledgeCandidateUser);
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(KADetails.displayId);
            await viewKnowledgeArticlePo.clickOnFlagButton();
            await flagUnflagKnowledgePo.setTextInTellUsMore(KADetails.displayId);
            await flagUnflagKnowledgePo.clickOnFlageButtonOnBlade();
            expect(await utilCommon.isPopUpMessagePresent('You have successfully flagged the article.')).toBeTruthy('Article Not Flagged');
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            //login with contributor
            await loginPage.login(knowledgeContributorUser);
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            let knowledgeTitile1 = 'knowledgeContributor2586' + randomStr;
            await apiHelper.apiLogin(knowledgeCandidateUser);
            let articleData1 = {
                "knowledgeSet": "HR",
                "title": `${knowledgeTitile1}`,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignee": "kkohri",
                "assigneeSupportGroup": "US Support 1",
                "company": "Petramco"
            }
            let kkohriId = await apiHelper.createKnowledgeArticle(articleData1);
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(kkohriId.displayId);
            await viewKnowledgeArticlePo.clickOnFlagButton();
            await flagUnflagKnowledgePo.setTextInTellUsMore(kkohriId.displayId);
            await flagUnflagKnowledgePo.clickOnFlageButtonOnBlade();
            expect(await utilCommon.isPopUpMessagePresent('You have successfully flagged the article.')).toBeTruthy('Article Not Flagged');
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            //login with publisher
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            let knowledgeTitile2 = 'knowledgePublisher2586' + randomStr;
            await apiHelper.apiLogin(knowledgePublisherUser);
            let articleData2 = {
                "knowledgeSet": "HR",
                "title": `${knowledgeTitile2}`,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignee": "kmills",
                "assigneeSupportGroup": "US Support 1",
                "company": "Petramco"
            }
            let kmillsId = await apiHelper.createKnowledgeArticle(articleData2);
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(kmillsId.displayId);
            await viewKnowledgeArticlePo.clickOnFlagButton();
            await flagUnflagKnowledgePo.setTextInTellUsMore(kmillsId.displayId);
            await flagUnflagKnowledgePo.clickOnFlageButtonOnBlade();
            expect(await utilCommon.isPopUpMessagePresent('You have successfully flagged the article.')).toBeTruthy('Article Not Flagged');
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            //login with publisher
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            let knowledgeTitile3 = 'knowledgeCoachUser2586' + randomStr;
            await apiHelper.apiLogin(knowledgeCoachUser);
            let articleData3 = {
                "knowledgeSet": "HR",
                "title": `${knowledgeTitile3}`,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignee": "kWilliamson",
                "assigneeSupportGroup": "US Support 1",
                "company": "Petramco"
            }
            let kWilliamsonId = await apiHelper.createKnowledgeArticle(articleData3);
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(kWilliamsonId.displayId);
            await viewKnowledgeArticlePo.clickOnFlagButton();
            await flagUnflagKnowledgePo.setTextInTellUsMore(kWilliamsonId.displayId);
            await flagUnflagKnowledgePo.clickOnFlageButtonOnBlade();
            expect(await utilCommon.isPopUpMessagePresent('You have successfully flagged the article.')).toBeTruthy('Article Not Flagged');
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
        }
        catch (e) {
            throw e;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('peter');
        }
    }, 300 * 1000);

    it('[DRDMV-1064]:[Create Mode] Removing sections with the Remove button', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Knowledge Management--Article Templates', 'Knowledge Article Templates');
        await consoleKnowledgeTemplatePo.clickCreateNewKATemplate();
        await createKnowledgeArticleTemplatePo.setTemplateName('template1064' + randomStr);
        await createKnowledgeArticleTemplatePo.clickOnAddSection();
        await createKnowledgeArticleTemplatePo.setKnowledgeSetValue('Global');
        await createKnowledgeArticleTemplatePo.setSectionTitle('First' + randomStr);
        await editKnowledgeArticleTemplatePo.clickOnCancelButton();
        expect(await utilCommon.isWarningDialogBoxDisplayed()).toBeTruthy('Warning Dialog Box is not displayed.');
        expect(await utilCommon.getWarningDialogTitle()).toBe('Warning!');
        expect(await utilCommon.getWarningDialogMsg()).toBe('You have unsaved data. Do you want to continue?');
        await utilCommon.clickOnWarningOk();
        await consoleKnowledgeTemplatePo.clickCreateNewKATemplate();
        await createKnowledgeArticleTemplatePo.setTemplateName('template1064' + randomStr);
        await createKnowledgeArticleTemplatePo.setKnowledgeSetValue('Global');
        await createKnowledgeArticleTemplatePo.clickOnAddSection();
        await createKnowledgeArticleTemplatePo.setDescription('DescriptionOFKA');
        await createKnowledgeArticleTemplatePo.setSectionTitle('Second' + randomStr);
        await createKnowledgeArticleTemplatePo.clickOnSaveButton();
        await utilGrid.searchAndOpenHyperlink('template1064' + randomStr);
        expect(await editKnowledgeArticleTemplatePo.getSectionTitleValue('First' + randomStr)).toBeFalsy('removed section is Present');
    });

    it('[DRDMV-2444]: KA Console - Article Navigation', async () => {
        let knowledgeTitile = 'knowledge2444' + randomStr;
        await apiHelper.apiLogin('peter');
        let articleData = {
            "knowledgeSet": "HR",
            "title": `${knowledgeTitile}`,
            "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
        }
        let knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
        let knowledgeDisplayID = knowledgeArticleData.displayId;
        await navigationPage.gotoKnowledgeConsole();
        await utilityGrid.clearFilter();
        expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
        await utilityGrid.clearFilter();
        await utilityGrid.searchAndOpenHyperlink(knowledgeDisplayID);
        expect(await viewKnowledgeArticlePo.isEditLinkDisplayedOnKA()).toBeTruthy();
        await navigationPage.gotoKnowledgeConsole();
        await utilityGrid.clearFilter();
        await utilityGrid.searchAndOpenHyperlink(knowledgeDisplayID);
        expect(await viewKnowledgeArticlePo.isEditLinkDisplayedOnKA()).toBeTruthy('Edit link is not displaying');
    });

    it('[DRDMV-5193]: [Knowledge]-Assigning current user as the Assignee of an article', async () => {
        let knowledgeTitile = 'knowledge5193' + randomStr;
        await apiHelper.apiLogin('peter');
        let articleData = {
            "knowledgeSet": "HR",
            "title": `${knowledgeTitile}`,
            "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
            "categoryTier1": "Applications",
            "categoryTier2": "Help Desk",
            "categoryTier3": "Incident",
            "region": "Australia",
            "site": "Canberra",
            "assignee": "KMills",
            "assigneeSupportGroup": "GB Support 2"
        }
        let knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
        await navigationPage.gotoKnowledgeConsole();
        await utilGrid.clearFilter();
        await utilGrid.searchAndOpenHyperlink(knowledgeArticleData.displayId);
        await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
        await editKnowledgePage.clickChangeAssignmentButton();
        await changeAssignmentBladePo.clickOnAssignToMeCheckBox();
        expect(await changeAssignmentBladePo.getCountOfSupportGroup()).toBeGreaterThan(2);
        expect(await changeAssignmentBladePo.getTextOfSupportGroup('Compensation and Benefits')).toContain('Peter Kahn');
        expect(await changeAssignmentBladePo.getTextOfSupportGroup('Compensation and Benefits')).toContain('Petramco');
        await changeAssignmentBladePo.clickOnSupportGroup('Compensation and Benefits');
        await changeAssignmentBladePo.clickOnAssignButton();
        await editKnowledgePage.saveKnowledgeMedataDataChanges();
        expect(await viewKnowledgeArticlePo.getAssigneeValue()).toContain('Peter Kahn');
    });

    it('[DRDMV-5195]: [Knowledge]-Assigning the article using Assignment component', async () => {
        let knowledgeTitile = 'knowledge5195' + randomStr;
        await apiHelper.apiLogin('peter');
        let articleData = {
            "knowledgeSet": "HR",
            "title": `${knowledgeTitile}`,
            "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
            "categoryTier1": "Applications",
            "categoryTier2": "Help Desk",
            "categoryTier3": "Incident",
            "region": "Australia",
            "site": "Canberra",
            "assignee": "KMills",
            "assigneeSupportGroup": "GB Support 2"
        }
        let knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
        await navigationPage.gotoKnowledgeConsole();
        await utilGrid.clearFilter();
        await utilGrid.searchAndOpenHyperlink(knowledgeArticleData.displayId);
        await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
        await editKnowledgePage.clickChangeAssignmentButton();
        expect(await changeAssignmentBladePo.isCompanyDrpDwnDisplayed()).toBeTruthy();
        expect(await changeAssignmentBladePo.isAssignToMeCheckBoxPresent()).toBeTruthy();
        expect(await changeAssignmentBladePo.isSupportGroupDrpDwnDisplayed()).toBeTruthy();
        expect(await changeAssignmentBladePo.isSearchInputBoxPresent()).toBeTruthy();
        await changeAssignmentBladePo.selectCompany('Petramco');
        await changeAssignmentBladePo.selectSupportGroup('Compensation and Benefits');
        await changeAssignmentBladePo.selectAssignee('Peter Kahn');
        await changeAssignmentBladePo.clickOnAssignButton();
        await editKnowledgePage.saveKnowledgeMedataDataChanges();
        expect(await viewKnowledgeArticlePo.getAssigneeValue()).toContain('Peter Kahn');
    });

    it('[DRDMV-1186,DRDMV-768]: [Knowledge Article] [ArticleCreation] Closing the article without saving it', async () => {
        let knowledgeTitle = 'knowledge1186' + randomStr;
        await navigationPage.gotoCreateKnowledge();
        expect(await createKnowledgePage.isTemplatePresent('KCS')).toBeTruthy('Template is not present');
        expect(await createKnowledgePage.isTemplatePresent('How To')).toBeTruthy('Template is not present');
        await createKnowledgePage.clickOnTemplate('Reference');
        expect(createKnowledgePage.isKnoledgeSetTemplateIsDisplayed()).toBeTruthy('style is not present');
        await createKnowledgePage.clickOnUseSelectedTemplateButton();
        await createKnowledgePage.selectKnowledgeSet('HR');
        expect(await createKnowledgePage.isSaveButtonEnabled()).toBeFalsy('save button not disabled');
        await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeTitle);
        await createKnowledgePage.setReferenceValue('Refrence values');
        await createKnowledgePage.clickOnDiscardButton();
        await utilCommon.clickOnWarningCancel();
        expect(await createKnowledgePage.getKnowledgeSetValue()).toContain('HR', 'expected Value not present');
        expect(await createKnowledgePage.getKnowledgeArticleTitleValue()).toContain(knowledgeTitle, 'expected Value not present');
        await createKnowledgePage.clickOnDiscardButton();
        await utilCommon.clickOnWarningOk();
        expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr, 'title not correct');
        await utilGrid.clearFilter();
        await utilGrid.searchRecord(knowledgeTitle);
        expect(await knowledgeConsolePo.isValueDisplayedInGrid('Title') == knowledgeTitle).toBeFalsy('KA is present');
    });

    it('[DRDMV-5158]: Click on thumbs up and thumbs down', async () => {
        let knowledgeTitile = 'knowledge5158' + randomStr;
        await apiHelper.apiLogin('peter');
        let articleData = {
            "knowledgeSet": "HR",
            "title": `${knowledgeTitile}`,
            "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
            "categoryTier1": "Applications",
            "categoryTier2": "Help Desk",
            "categoryTier3": "Incident",
            "region": "Australia",
            "site": "Canberra",
            "assignee": "KMills",
            "assigneeSupportGroup": "GB Support 2"
        }
        let knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
        await navigationPage.gotoKnowledgeConsole();
        await utilityGrid.clearFilter();
        await utilityGrid.searchAndOpenHyperlink(knowledgeArticleData.displayId);
        await viewKnowledgeArticlePo.clickOnKAUsefulNoButton();
        await feedbackBladeKnowledgeArticlePo.setTextInTellUsMore(knowledgeTitile);
        await feedbackBladeKnowledgeArticlePo.clickOnSaveButtonOnFeedBack();
        let percentage: string = await viewKnowledgeArticlePo.getPercentageValue();
        await viewKnowledgeArticlePo.clickOnTab('Activity');
        await activityTabPo.clickOnRefreshButton();
        expect(await activityTabPo.getFirstPostContent()).toContain(knowledgeTitile, 'content not displaying on Activity');
        await viewKnowledgeArticlePo.clickOnTab('Information');
        await viewKnowledgeArticlePo.clickOnKAUsefulYesButton();
        expect(await viewKnowledgeArticlePo.getPercentageValue() == percentage).toBeFalsy('Percentage are equal to previous');
    });

    it('[DRDMV-5162]: [Knowledge]- Click on thumps down and enable the flag option.', async () => {
        let knowledgeTitile = 'knowledge5162' + randomStr;
        await apiHelper.apiLogin('peter');
        let articleData = {
            "knowledgeSet": "HR",
            "title": `${knowledgeTitile}`,
            "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
            "categoryTier1": "Applications",
            "categoryTier2": "Help Desk",
            "categoryTier3": "Incident",
            "region": "Australia",
            "site": "Canberra",
            "assignee": "KMills",
            "assigneeSupportGroup": "GB Support 2"
        }
        let knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
        await navigationPage.gotoKnowledgeConsole();
        await utilGrid.clearFilter();
        await utilGrid.searchAndOpenHyperlink(knowledgeArticleData.displayId);
        await viewKnowledgeArticlePo.clickOnKAUsefulNoButton();
        await feedbackBladeKnowledgeArticlePo.selectFlag(true);
        await feedbackBladeKnowledgeArticlePo.setTextInTellUsMore(knowledgeTitile);
        await feedbackBladeKnowledgeArticlePo.clickOnSaveButtonOnFeedBack();
        expect(await viewKnowledgeArticlePo.isUnFlagButtonDisplayed()).toBeTruthy('Unflag Button is not present');
        await viewKnowledgeArticlePo.clickOnTab('Activity');
        await activityTabPo.clickOnRefreshButton();
        expect(await activityTabPo.getFirstPostContent()).toContain('Peter Kahn flagged the article', 'content not displaying on Activity');
        expect(await activityTabPo.getFirstPostContent()).toContain(knowledgeTitile, 'content not displaying on Activity');
    });

    it('[DRDMV-13707]: Navigate an Article from Knowledge Create->Preview Knowledge Article->Article Full view', async () => {
        try {
            await navigationPage.signOut();
            await loginPage.login('franz');
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate('Reference');
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField('Knowledge' + randomStr);
            await createKnowledgePage.setReferenceValue('KnowledgeReference' + randomStr)
            await createKnowledgePage.selectKnowledgeSet('HR');
            await createKnowledgePage.clickAssignToMeButton();
            await createKnowledgePage.selectCategoryTier1Option('Accounts Payable');
            await createKnowledgePage.selectCategoryTier2Option('Invoices');
            await createKnowledgePage.selectCategoryTier3Option('Payment');
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await previewKnowledgePo.clickOnViewArticleLink();
            await utilCommon.switchToNewWidnow(1);
            expect(await viewKnowledgeArticlePo.isEditLinkDisplayedOnKA()).toBeTruthy('full view of article is not displayed');
        }
        catch (e) {
            throw e;
        }
        finally {
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('peter');
        }
    });//, 170 * 1000);

    it('[DRDMV-5192]: Unflag the article', async () => {
        try {
            let knowledgeTitile = 'knowledge5192' + randomStr;
            let knowledgeTitileSecond = 'knowledgeNewUnflag' + randomStr;
            await apiHelper.apiLogin('peter');
            let articleDataFirst = {
                "knowledgeSet": "HR",
                "title": `${knowledgeTitile}`,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "categoryTier1": "Applications",
                "categoryTier2": "Help Desk",
                "categoryTier3": "Incident",
                "region": "Australia",
                "site": "Canberra",
                "assignee": "KMills",
                "assigneeSupportGroup": "GB Support 2"
            }
            let articleDataSecond = {
                "knowledgeSet": "HR",
                "title": `${knowledgeTitileSecond}`,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "categoryTier1": "Applications",
                "categoryTier2": "Help Desk",
                "categoryTier3": "Incident",
                "region": "Australia",
                "site": "Canberra",
                "assignee": "KMills",
                "assigneeSupportGroup": "GB Support 2"
            }

            let knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleDataFirst);
            let knowledgeArticleDataSecond = await apiHelper.createKnowledgeArticle(articleDataSecond);
            await navigationPage.gotoKnowledgeConsole()
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(knowledgeArticleData.displayId);
            await viewKnowledgeArticlePo.clickOnKAUsefulNoButton();
            await feedbackBladeKnowledgeArticlePo.selectFlag(true);
            await feedbackBladeKnowledgeArticlePo.setTextInTellUsMore(knowledgeTitile);
            await feedbackBladeKnowledgeArticlePo.clickOnSaveButtonOnFeedBack();
            expect(await viewKnowledgeArticlePo.isUnFlagButtonDisplayed()).toBeTruthy('Unflag Button is not present');
            await viewKnowledgeArticlePo.clickOnTab('Activity');
            await activityTabPo.clickOnRefreshButton();
            expect(await activityTabPo.getFirstPostContent()).toContain('Peter Kahn flagged the article', 'content not displaying on Activity');
            expect(await activityTabPo.getFirstPostContent()).toContain(knowledgeTitile, 'content not displaying on Activity');
            await navigationPage.gotoKnowledgeConsole();
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(knowledgeArticleDataSecond.displayId);
            await viewKnowledgeArticlePo.clickOnFlagButton();
            await flagUnflagKnowledgePo.setTextInTellUsMore(knowledgeTitileSecond);
            await flagUnflagKnowledgePo.clickOnFlageButtonOnBlade();
            await viewKnowledgeArticlePo.clickOnTab('Activity');
            await activityTabPo.clickOnRefreshButton();
            expect(activityTabPo.getFirstPostContent()).toContain(knowledgeTitileSecond, 'Post not present on activity');
            await navigationPage.signOut();
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(knowledgeArticleDataSecond.displayId);
            await viewKnowledgeArticlePo.clickOnUnFlagButton();
            await flagUnflagKnowledgePo.setTextInTellUsMore(knowledgeTitileSecond);
            await flagUnflagKnowledgePo.clickOnUnFlageButtonOnBlade();
            await viewKnowledgeArticlePo.clickOnTab('Activity');
            await activityTabPo.clickOnRefreshButton();
            expect(await activityTabPo.getFirstPostContent()).toContain('Kyle Mills unflagged the article', 'content not displaying on Activity');
            expect(await activityTabPo.getFirstPostContent()).toContain(knowledgeTitileSecond, 'content not displaying on Activity');
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(knowledgeArticleData.displayId);
            await viewKnowledgeArticlePo.clickOnUnFlagButton();
            await flagUnflagKnowledgePo.setTextInTellUsMore(knowledgeTitile);
            await flagUnflagKnowledgePo.clickOnUnFlageButtonOnBlade();
            await viewKnowledgeArticlePo.clickOnTab('Activity');
            await activityTabPo.clickOnRefreshButton();
            expect(await activityTabPo.getFirstPostContent()).toContain('Kyle Mills unflagged the article', 'content not displaying on Activity');
            expect(await activityTabPo.getFirstPostContent()).toContain(knowledgeTitile, 'content not displaying on Activity');
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
        } catch (e) {
            throw e;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('peter');
        }
    });//, 240 * 1000);

    //ptidke
    it('[DRDMV-2746]: Article status transition - In Progress->Draft->Published->Closed', async () => {
        try {
            let knowledgeTitile = 'knowledge2746' + randomStr;
            await apiHelper.apiLogin(knowledgePublisherUser);
            let articleData = {
                "knowledgeSet": "HR",
                "title": `${knowledgeTitile}`,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignee": "kayo",
                "assigneeSupportGroup": "US Support 1",
                "company": "Petramco"
            }
            let KADetails = await apiHelper.createKnowledgeArticle(articleData);
            await navigationPage.signOut();
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(KADetails.displayId);
            await editKnowledgePage.setKnowledgeStatus('Draft');
            expect(await editKnowledgePage.getStatusValue()).toContain('Draft', 'Status not Set');
            await navigationPage.gotoKnoweldgeConsoleFromKM();
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(KADetails.displayId);
            expect(await editKnowledgePage.getStatusValue()).toContain('Draft', 'Status not Set');
            await editKnowledgePage.setKnowledgeStatus('Published');
            expect(await editKnowledgePage.getStatusValue()).toContain('Published', 'Status not Set');
            await navigationPage.gotoKnoweldgeConsoleFromKM();
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(KADetails.displayId);
            expect(await editKnowledgePage.getStatusValue()).toContain('Published', 'Status not Set');
            await editKnowledgePage.setKnowledgeStatus('Closed');
            expect(await editKnowledgePage.getStatusValue()).toContain('Closed', 'Status not Set');
            await navigationPage.gotoKnoweldgeConsoleFromKM();
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(KADetails.displayId);
            expect(await editKnowledgePage.getStatusValue()).toContain('Closed', 'Status not Set');
            expect(await viewKnowledgeArticlePo.isStatusChangeBladePresent()).toBeFalsy('status changes blade is peresent');
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            //login with coach
            let knowledgeTitilecoach = 'knowledge2746' + randomStr;
            await apiHelper.apiLogin(knowledgeCoachUser);
            let articleDataCoach = {
                "knowledgeSet": "HR",
                "title": `${knowledgeTitile}`,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignee": "kayo",
                "assigneeSupportGroup": "US Support 1",
                "company": "Petramco"
            }
            let KACoachDetails = await apiHelper.createKnowledgeArticle(articleDataCoach);
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(KACoachDetails.displayId);
            await editKnowledgePage.setKnowledgeStatus('Draft');
            expect(await editKnowledgePage.getStatusValue()).toContain('Draft', 'Status not Set');
            await navigationPage.gotoKnoweldgeConsoleFromKM();
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(KACoachDetails.displayId);
            expect(await editKnowledgePage.getStatusValue()).toContain('Draft', 'Status not Set');

            await editKnowledgePage.setKnowledgeStatus('Published');
            expect(await editKnowledgePage.getStatusValue()).toContain('Published', 'Status not Set');
            await navigationPage.gotoKnoweldgeConsoleFromKM();
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(KACoachDetails.displayId);
            expect(await editKnowledgePage.getStatusValue()).toContain('Published', 'Status not Set');

            await editKnowledgePage.setKnowledgeStatus('Closed');
            expect(await editKnowledgePage.getStatusValue()).toContain('Closed', 'Status not Set');
            await navigationPage.gotoKnoweldgeConsoleFromKM();
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(KACoachDetails.displayId);
            expect(await editKnowledgePage.getStatusValue()).toContain('Closed', 'Status not Set');
            expect(await viewKnowledgeArticlePo.isStatusChangeBladePresent()).toBeFalsy('status changes blade is peresent');
        }
        catch (e) {
            throw e;
        }
        finally {
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('peter');
        }
    }, 380 * 1000);

    it('[DRDMV-1784]: [Knowledge Article] Changing the template for the article', async () => {
        let knowledgeTitile = 'knowledgeCoachUser1784' + randomStr;
        await navigationPage.gotoKnowledgeConsole();
        await navigationPage.gotoCreateKnowledge();
        expect(await createKnowledgePage.isTemplatePresent('KCS')).toBeTruthy('Template is not present');
        expect(await createKnowledgePage.isTemplatePresent('Reference')).toBeTruthy('Template is not present');
        expect(await createKnowledgePage.isTemplatePresent('How To')).toBeTruthy('Template is not present');
        await createKnowledgePage.clickOnTemplate('Environment');
        expect(createKnowledgePage.getTemplatePreviewText()).toContain('Environment', 'Preview is not present');
        expect(createKnowledgePage.isKnoledgeSetTemplateIsDisplayed()).toBeTruthy('style is not present');
        await createKnowledgePage.clickOnSelectDifferentTemplate();
        await createKnowledgePage.clickOnTemplate('Reference');
        expect(createKnowledgePage.getTemplatePreviewText()).toContain('Reference', 'Preview is not present');
        expect(createKnowledgePage.isKnoledgeSetTemplateIsDisplayed()).toBeTruthy('style is not present');
        await createKnowledgePage.clickOnUseSelectedTemplateButton();
        await createKnowledgePage.setReferenceValue('reference values are as follows');
        await createKnowledgePage.clickChangeTemplateButton();
        await utilCommon.clickOnWarningOk();
        await createKnowledgePage.clickOnTemplate('Question');
        expect(createKnowledgePage.getTemplatePreviewText()).toContain('Question', 'Preview is not present');
        expect(createKnowledgePage.isKnoledgeSetTemplateIsDisplayed()).toBeTruthy('style is not present');
        await createKnowledgePage.clickOnUseSelectedTemplateButton();
        await createKnowledgePage.setValueInRTF('Question', 'frist values are as follows');
        await createKnowledgePage.clickChangeTemplateButton();
        await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeTitile);
        await utilCommon.clickOnWarningCancel();
        expect(await createKnowledgePage.getKnowledgeArticleTitleValue()).toContain(knowledgeTitile, 'expected Value not present');
        await createKnowledgePage.selectKnowledgeSet('HR');
        await createKnowledgePage.clickOnSaveKnowledgeButton();
    });
})
