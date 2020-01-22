import previewKnowledgePo from '../../pageobject/knowledge/preview-knowledge.po';
import { browser} from "protractor";
import apiHelper from '../../api/api.helper';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import KnowledgeConsolePage from "../../pageobject/knowledge/console-knowledge.po";
import { default as createKnowledgePage, default as createKnowlegePo } from "../../pageobject/knowledge/create-knowlege.po";
import editKnowledgePage from "../../pageobject/knowledge/edit-knowledge.po";
import knowledgeArticlesConsolePo from '../../pageobject/knowledge/knowledge-articles-console.po';
import consoleKnowledgeTemplatePo from '../../pageobject/settings/knowledge-management/console-knowledge-template.po';
import createKnowledgeArticleTemplatePo from '../../pageobject/settings/knowledge-management/create-knowledge-article-template.po';
import activityTabPo from '../../pageobject/social/activity-tab.po';
import utilCommon from '../../utils/util.common';
import utilGrid from '../../utils/util.grid';

describe('Knowledge Article', () => {
    const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
    var knowledgeCandidateUser = 'kayo';
    var knowledgeContributorUser = 'kkohri';
    var knowledgePublisherUser = 'kmills';
    var knowledgeCoachUser = 'kWilliamson';
    var knowledgeManagementApp = "Knowledge Management";
    var knowledgeArticlesTitleStr = "Knowledge Articles";
    beforeAll(async () => {
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
        await loginPage.login('peter');   
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    afterEach(async () => {
        await browser.refresh();
        await utilCommon.waitUntilSpinnerToHide();
    });

    //ptidke
    it('DRDMV-2604: [Flag an Article] Unflag a published artilcles by Asignee_Knowledge publisher', async () => {
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
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'Published')).toBeTruthy('Status Not Set');
            await apiHelper.flagAndUnflagKnowledgeArticle(knowledgeArticleGUID, knowledgeTitile, 1);
            await navigationPage.signOut();
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr,'title not correct');
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(knowledgeDisplayID);
            await editKnowledgePage.clickOnUnFlagButton();
            await editKnowledgePage.setTextInTellUsMore(knowledgeArticlesTitleStr + randomStr);
            await editKnowledgePage.clickOnUnFlageButtonOnBlade();
            await createKnowlegePo.clickOnActivityTab();
            expect(await activityTabPo.getUnFlagContent()).toContain(knowledgeArticlesTitleStr + randomStr,'content not displaying on Activity'),'content not displaying on Activity';
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
        }
        catch (e) {
            throw e;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('peter');
            await utilCommon.waitUntilSpinnerToHide();
        }
    },130*1000);

    //ptidke
    it('DRDMV-13646,DRDMV-13681: Create a Knowledge article and check Knowledge Preview', async () => {
        try {
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate('Reference');
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField('Knowledge'+randomStr);
            await createKnowledgePage.setReferenceValue('KnowledgeReference'+randomStr)
            await createKnowledgePage.selectKnowledgeSet('HR');
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            expect(await previewKnowledgePo.getKnowledgeArticleTitle()).toContain('Knowledge'+randomStr,'title not correct');
            expect(await previewKnowledgePo.getKnowledgeArticleSection()).toContain('KnowledgeReference'+randomStr,'section not correct');
            expect(await previewKnowledgePo.getKnowledgeArticleID()).toContain('KA-','article id is not as expected');
            expect(await previewKnowledgePo.isBackButtonDisplay()).toBeTruthy('back button not present');
            expect(await previewKnowledgePo.isViewArticleLInkDisplay()).toBeTruthy('viewArticle link Not peresent');
            expect(await previewKnowledgePo.isStatusOfKADisplay()).toBeTruthy('Status not displaying');
            await previewKnowledgePo.clickOnBackButton();
        }
        catch (e) {
            throw e;
        }
        finally {
            await browser.refresh();
            await utilCommon.waitUntilSpinnerToHide();
        }
    });

    //ptidke
    it('DRDMV-1164: PermissionModel_Knowledge Coach permission create knowledge articles', async () => {
        try {
            await navigationPage.signOut();
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr,'Not expected title');
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate('Reference');
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField('Knowledge1164'+randomStr);
            await createKnowledgePage.setReferenceValue('KnowledgeReference1164'+randomStr)
            await createKnowledgePage.selectKnowledgeSet('HR');
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            expect(await previewKnowledgePo.isViewArticleLInkDisplay()).toBeTruthy();
            await previewKnowledgePo.clickOnBackButton();
            await navigationPage.gotoKnoweldgeConsoleFromKM();
            await utilGrid.clearFilter();
            await utilGrid.searchRecord('Knowledge1164'+randomStr);
            expect(await KnowledgeConsolePage.isValueDisplayedInGrid('Title')).toContain('Knowledge1164'+randomStr,'value is not displaying in Grid');
        }
        catch (e) {
            throw e;
        }
        finally {
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('peter');
        }
    },90*1000);

    //ptidke
    it('DRDMV-2374: [Edit Knowledge Article] Article creation not possible by selecting disabled templates', async () => {
        try {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Article Templates', 'Knowledge Article Templates - Business Workflows');
            await consoleKnowledgeTemplatePo.clickCreateNewKATemplate();
            await createKnowledgeArticleTemplatePo.setTemplateName(randomStr);
            await createKnowledgeArticleTemplatePo.clickOnDisableEnableCheckBox();
            await createKnowledgeArticleTemplatePo.clickOnAddSection();
            await createKnowledgeArticleTemplatePo.setKnowledgeSetValue('Global');
            await createKnowledgeArticleTemplatePo.setSectionTitle('NewThings'+randomStr);
            await createKnowledgeArticleTemplatePo.setDescription('DescriptionOFKA');
            await createKnowledgeArticleTemplatePo.clickOnSaveButton();
            await navigationPage.gotoCreateKnowledge();
            expect(await createKnowledgePage.isTemplatePresent(randomStr)).toBeFalsy('Template is present');
        }
        catch (e) {
            throw e;
        }
        finally {
            await browser.refresh();
            await utilCommon.waitUntilSpinnerToHide();
        }
    });

    //ptidke
    it('DRDMV-774,DRDMV-2447: [Knowledge Article] [SearchArticle] Knowledge article search with article ID and title', async () => {
            let knowledgeGridColumnFields: string[] = ["Assigned Group", "Assignee Login Name", "Author", "GUID", "Region", "Review Status", "Category Tier 1", "Category Tier 2", "Category Tier 3"];
            let knowledgeTitle = 'knowledge774' + randomStr;
            await apiHelper.apiLogin('peter');
            let articleData = {
                "knowledgeSet": "HR",
                "title": `${knowledgeTitle}`,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
            }
            await apiHelper.createKnowledgeArticle(articleData);
            await navigationPage.gotoKnowledgeConsole();
            await KnowledgeConsolePage.addAllcolumnOnKnowledgeConsole(knowledgeGridColumnFields)
            await utilGrid.clearFilter();
            await utilGrid.searchRecord(knowledgeTitle);
            expect(await KnowledgeConsolePage.isValueDisplayedInGrid('Title')).toContain(knowledgeTitle,'KA not present');
            let knowledgeArticleID = await KnowledgeConsolePage.isValueDisplayedInGrid('Article ID')
            await utilGrid.clearGridSearchBox();
            await utilGrid.searchRecord(knowledgeArticleID)
            expect(await KnowledgeConsolePage.isValueDisplayedInGrid('Article ID')).toContain(knowledgeArticleID,'KA not present');
            await KnowledgeConsolePage.removeAddedColumns(knowledgeGridColumnFields);
    });

    //ptidke
    it('DRDMV-3095: Submitter can cancel the article from Draft status_Submitter is assignee', async () => {
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
            expect(await editKnowledgePage.getStatusValue()).toContain('Draft','Status Not set');
            await editKnowledgePage.setKnowledgeStatus('Canceled');
            expect(await editKnowledgePage.getStatusValue()).toContain('Canceled','Status Not set');
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
            expect(await editKnowledgePage.getStatusValue()).toContain('Draft','Status Not set');
            await editKnowledgePage.setKnowledgeStatus('Canceled');
            expect(await editKnowledgePage.getStatusValue()).toContain('Canceled','Status Not set');
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
            expect(await editKnowledgePage.getStatusValue()).toContain('Draft','Status Not set');
            await editKnowledgePage.setKnowledgeStatus('Canceled');
            expect(await editKnowledgePage.getStatusValue()).toContain('Canceled','Status Not set');
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
            expect(await editKnowledgePage.getStatusValue()).toContain('Draft','Status Not set');
            await editKnowledgePage.setKnowledgeStatus('Canceled');
            expect(await editKnowledgePage.getStatusValue()).toContain('Canceled','Status Not set');
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
    it('DRDMV-792: [KM-BWF integration] [Knowledge Article] Edit the knowledge article from the Knowledge Workspace', async () => {
            let knowledgeTitile = 'knowledge792' + randomStr;
            await apiHelper.apiLogin('peter');
            let articleData = {
                "knowledgeSet": "HR",
                "title": `${knowledgeTitile}`,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
            }
            let knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
            await navigationPage.gotoKnowledgeConsole();
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(knowledgeArticleData.displayId);
            await editKnowledgePage.clickOnEditLink();
            let updatedName = 'updatedName' + randomStr;
            await editKnowledgePage.changeKnowledgeTitle(updatedName);
            await editKnowledgePage.clickOnSaveButtonOfKA();
            await utilCommon.waitUntilPopUpDisappear();
            expect(await editKnowledgePage.isEditLinkDisplayedOnKA()).toBeTruthy('edit link is not present');
            await navigationPage.gotoKnowledgeConsole();
            await utilGrid.clearFilter();
            await utilGrid.searchRecord(knowledgeArticleData.displayId);
            expect(await KnowledgeConsolePage.isValueDisplayedInGrid('Title')).toContain(updatedName,'KA not present');
    });

    //ptidke
    it('DRDMV-3093: Submitter can cancel the article from In Progress status_Submitter is assignee', async () => {
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
            expect(await editKnowledgePage.getStatusValue()).toContain('Canceled','Status not Set');
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
            expect(await editKnowledgePage.getStatusValue()).toContain('Canceled','Status Not set');
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
            expect(await editKnowledgePage.getStatusValue()).toContain('Canceled','Status not set');
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
            await utilGrid.clearFilter() ;
            await utilGrid.searchAndOpenHyperlink(kWilliamsonId.displayId);
            await editKnowledgePage.setKnowledgeStatus('Canceled');
            expect(await editKnowledgePage.getStatusValue()).toContain('Canceled','Status not set');
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
    it('DRDMV-2586: [Flag an Article] Flag an article and post a comment', async () => {
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
            await editKnowledgePage.clickOnFlagButton();
            await editKnowledgePage.setTextInTellUsMore(KADetails.displayId);
            await editKnowledgePage.clickOnFlageButtonOnBlade();
            expect(await utilCommon.getPopUpMessage()).toContain('You have successfully flagged the article.','Article Not Flagged');
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
            await editKnowledgePage.clickOnFlagButton();
            await editKnowledgePage.setTextInTellUsMore(kkohriId.displayId);
            await editKnowledgePage.clickOnFlageButtonOnBlade();
            expect(await utilCommon.getPopUpMessage()).toContain('You have successfully flagged the article.','Article Not Flagged');
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
            await editKnowledgePage.clickOnFlagButton();
            await editKnowledgePage.setTextInTellUsMore(kmillsId.displayId);
            await editKnowledgePage.clickOnFlageButtonOnBlade();
            expect(await utilCommon.getPopUpMessage()).toContain('You have successfully flagged the article.','Article Not Flagged');
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
            await editKnowledgePage.clickOnFlagButton();
            await editKnowledgePage.setTextInTellUsMore(kWilliamsonId.displayId);
            await editKnowledgePage.clickOnFlageButtonOnBlade();
            expect(await utilCommon.getPopUpMessage()).toContain('You have successfully flagged the article.','Article Not Flagged');
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
})