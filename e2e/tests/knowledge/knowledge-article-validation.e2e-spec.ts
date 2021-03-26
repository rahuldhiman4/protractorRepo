import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import changeAssignmentBladePo from '../../pageobject/common/change-assignment.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import { default as createKnowledgePage } from "../../pageobject/knowledge/create-knowlege.po";
import editKnowledgePage from "../../pageobject/knowledge/edit-knowledge.po";
import feedbackBladeKnowledgeArticlePo from '../../pageobject/knowledge/feedback-blade-Knowledge-article.po';
import flagUnflagKnowledgePo from '../../pageobject/knowledge/flag-unflag-knowledge.po';
import { default as knowledgeArticlesConsolePo, default as knowledgeConsolePo } from '../../pageobject/knowledge/knowledge-articles-console.po';
import previewKnowledgePo from '../../pageobject/knowledge/preview-knowledge.po';
import reviewCommentsPo from '../../pageobject/knowledge/review-comments.po';
import statusBladeKnowledgeArticlePo from '../../pageobject/knowledge/status-blade-knowledge-article.po';
import viewKnowledgeArticlePo from '../../pageobject/knowledge/view-knowledge-article.po';
import notificationPo from '../../pageobject/notification/notification.po';
import imagePropertiesPo from '../../pageobject/settings/common/image-properties.po';
import consoleKnowledgeTemplatePo from '../../pageobject/settings/knowledge-management/console-knowledge-template.po';
import createKnowledgeArticleTemplatePo from '../../pageobject/settings/knowledge-management/create-knowledge-article-template.po';
import editKnowledgeArticleTemplatePo from '../../pageobject/settings/knowledge-management/edit-knowledge-article-template.po';
import activityTabPo from '../../pageobject/social/activity-tab.po';
import { BWF_BASE_URL, BWF_PAGE_TITLES, DropDownType } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

describe('Knowledge Article Validation', () => {
    const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
    let knowledgeCandidateUser = 'kayo';
    let knowledgeContributorUser = 'kkohri';
    let knowledgePublisherUser = 'kmills';
    let knowledgeCoachUser = 'kWilliamson';
    let knowledgeManagementApp = "Knowledge Management";
    let knowledgeArticlesTitleStr = "Knowledge Articles";
    let knowledgeModule = 'Knowledge';
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('peter');
        // await apiHelper.apiLogin('tadmin');
        // await apiHelper.setDefaultNotificationForUser("Peter", "Alert");
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //ptidke
    it('[5952]: [Flag an Article] Unflag a published artilcles by Asignee_Knowledge publisher', async () => {
        try {
            let knowledgeTitile = 'knowledge2604' + randomStr;
            await apiHelper.apiLogin('peter');
            let articleData = {
                "knowledgeSet": "HR",
                "title": `${knowledgeTitile}`,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United Kingdom Support",
                "assigneeSupportGroup": "GB Support 1",
                "assignee": "KMills"
            }
            let knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
            let knowledgeDisplayID = knowledgeArticleData.displayId;
            let knowledgeArticleGUID = knowledgeArticleData.id;
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'Draft')).toBeTruthy('Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'PublishApproval', "qkatawazi", "Compensation and Benefits")).toBeTruthy('Status Not Set');
            await apiHelper.flagAndUnflagKnowledgeArticle(knowledgeArticleGUID, knowledgeTitile, 1);
            await navigationPage.signOut();
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr, 'title not correct');
            await utilityGrid.searchAndOpenHyperlink(knowledgeDisplayID);
            await viewKnowledgeArticlePo.clickOnUnFlagButton();
            await flagUnflagKnowledgePo.setTextInTellUsMore(knowledgeArticlesTitleStr + randomStr);
            await flagUnflagKnowledgePo.clickOnUnFlageButtonOnBlade();
            await utilityCommon.closePopUpMessage();
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
        }
    });//, 140 * 1000);

    //ptidke
    it('[6344]: PermissionModel_Knowledge Coach permission create knowledge articles', async () => {
        try {
            await navigationPage.signOut();
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr, 'Not expected title');
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate('Reference');
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField('Knowledge1164' + randomStr);
            await createKnowledgePage.setReferenceValue('KnowledgeReference1164' + randomStr)
            await createKnowledgePage.selectKnowledgeSet('HR');
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await utilityCommon.closePopUpMessage();
            await previewKnowledgePo.clickOnBackButton();
            await navigationPage.gotoKnowledgeConsole(true);
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            await utilityGrid.searchRecord('Knowledge1164' + randomStr);
            expect(await knowledgeConsolePo.isValueDisplayedInGrid('Title')).toContain('Knowledge1164' + randomStr, 'value is not displaying in Grid');
        }
        catch (e) {
            throw e;
        }
        finally {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('peter');
        }
    });//, 200 * 1000);

    //ptidke
    describe('[5870]: Submitter can cancel the article from Draft status_Submitter is assignee', () => {
        let displayID = undefined;
        beforeAll(async () => {
            await apiHelper.apiLogin("tadmin");
            apiHelper.deleteApprovalMapping(knowledgeModule);
            let knowledgeTitile = 'knowledge3095' + randomStr;
            await apiHelper.apiLogin(knowledgeCandidateUser);
            let articleData = {
                "knowledgeSet": 'HR',
                "title": `${knowledgeTitile}`,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United States Support",
                "assigneeSupportGroup": "US Support 1",
                "assignee": "kayo"
            }
            let KADetails = await apiHelper.createKnowledgeArticle(articleData);
            displayID = KADetails.displayId;
        });

        it('[5870]: Submitter can cancel the article from Draft status_Submitter is assignee', async () => {
            await navigationPage.signOut();
            await loginPage.login(knowledgeCandidateUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilityGrid.searchAndOpenHyperlink(displayID);
            await editKnowledgePage.setKnowledgeStatus('Draft');
            await utilityCommon.closePopUpMessage();
            expect(await editKnowledgePage.getStatusValue()).toContain('Draft', 'Status Not set');
            await editKnowledgePage.setKnowledgeStatus('Request Cancelation');
            await navigationPage.gotoKnowledgeConsole(true);
            await utilityGrid.searchAndOpenHyperlink(displayID);
            expect(await editKnowledgePage.getStatusValue()).toContain('Canceled', 'Status Not set');
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
        });

        it('[5870]: Submitter can cancel the article from Draft status_Submitter is assignee', async () => {
            //login with contributor
            await loginPage.login(knowledgeContributorUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            let knowledgeTitile1 = 'knowledgeContributor3095' + randomStr;
            await apiHelper.apiLogin(knowledgeCandidateUser);
            let articleData1 = {
                "knowledgeSet": 'HR',
                "title": `${knowledgeTitile1}`,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United States Support",
                "assigneeSupportGroup": "US Support 1",
                "assignee": "kkohri"
            }
            let kkohriId = await apiHelper.createKnowledgeArticle(articleData1);
            await utilityGrid.searchAndOpenHyperlink(kkohriId.displayId);
            await editKnowledgePage.setKnowledgeStatus('Draft');
            await utilityCommon.closePopUpMessage();
            expect(await editKnowledgePage.getStatusValue()).toContain('Draft', 'Status Not set');
            await editKnowledgePage.setKnowledgeStatus('Request Cancelation');
            await navigationPage.gotoKnowledgeConsole(true);
            await utilityGrid.searchAndOpenHyperlink(kkohriId.displayId);
            expect(await editKnowledgePage.getStatusValue()).toContain('Canceled', 'Status Not set');
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
        });

        it('[5870]: Submitter can cancel the article from Draft status_Submitter is assignee', async () => {
            //login with publisher
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            let knowledgeTitile2 = 'knowledgePublisher3095' + randomStr;
            await apiHelper.apiLogin(knowledgePublisherUser);
            let articleData2 = {
                "knowledgeSet": 'HR',
                "title": `${knowledgeTitile2}`,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United Kingdom Support",
                "assigneeSupportGroup": "GB Support 2",
                "assignee": "KMills"
            }
            let kmillsId = await apiHelper.createKnowledgeArticle(articleData2);
            await utilityGrid.searchAndOpenHyperlink(kmillsId.displayId);
            await editKnowledgePage.setKnowledgeStatus('Draft');
            await utilityCommon.closePopUpMessage();
            expect(await editKnowledgePage.getStatusValue()).toContain('Draft', 'Status Not set');
            await editKnowledgePage.setKnowledgeStatus('Request Cancelation');
            await navigationPage.gotoKnowledgeConsole(true);
            await utilityGrid.searchAndOpenHyperlink(kmillsId.displayId);
            expect(await editKnowledgePage.getStatusValue()).toContain('Canceled', 'Status Not set');
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
        });

        it('[5870]: Submitter can cancel the article from Draft status_Submitter is assignee', async () => {
            //login with coach
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            let knowledgeTitile3 = 'knowledgeCoachUser3095' + randomStr;
            await apiHelper.apiLogin(knowledgeCoachUser);
            let articleData3 = {
                "knowledgeSet": 'HR',
                "title": `${knowledgeTitile3}`,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "Australia Support",
                "assigneeSupportGroup": "AU Support 3",
                "assignee": "KWilliamson"
            }
            let kWilliamsonId = await apiHelper.createKnowledgeArticle(articleData3);
            await utilityGrid.searchAndOpenHyperlink(kWilliamsonId.displayId);
            await editKnowledgePage.setKnowledgeStatus('Draft');
            await utilityCommon.closePopUpMessage();
            expect(await editKnowledgePage.getStatusValue()).toContain('Draft', 'Status Not set');
            await editKnowledgePage.setKnowledgeStatus('Request Cancelation');
            await navigationPage.gotoKnowledgeConsole(true);
            await utilityGrid.searchAndOpenHyperlink(kWilliamsonId.displayId);
            expect(await editKnowledgePage.getStatusValue()).toContain('Canceled', 'Status Not set');
        });

        afterAll(async () => {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('peter');
        });
    });

    //ptidke
    it('[6387]: [KM-BWF integration] [Knowledge Article] Edit the knowledge article from the Knowledge Workspace', async () => {
        let knowledgeTitile = 'knowledge792' + randomStr;
        await apiHelper.apiLogin('peter');
        let articleData = {
            "knowledgeSet": 'HR',
            "title": `${knowledgeTitile}`,
            "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
        }
        let knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
        await navigationPage.gotoKnowledgeConsole();
        await utilityGrid.searchAndOpenHyperlink(knowledgeArticleData.displayId);
        await viewKnowledgeArticlePo.clickOnEditLink();
        let updatedName = 'updatedName' + randomStr;
        await editKnowledgePage.changeKnowledgeTitle(updatedName);
        await editKnowledgePage.clickOnSaveButtonOfKA();
        await utilityCommon.closePopUpMessage();
        expect(await viewKnowledgeArticlePo.isEditLinkDisplayedOnKA()).toBeTruthy('edit link is not present');
        await navigationPage.gotoKnowledgeConsole();
        await utilityGrid.searchRecord(knowledgeArticleData.displayId);
        console.log(updatedName);
        expect(await knowledgeConsolePo.isValueDisplayedInGrid('Title')).toContain(updatedName, 'KA not present');
    });

    //ptidke
    describe('[5871]: Submitter can cancel the article from In Progress status_Submitter is assignee', () => {
        let KADetails = undefined;
        beforeAll(async () => {
            await apiHelper.apiLogin("elizabeth");
            apiHelper.deleteApprovalMapping(knowledgeModule);
            let knowledgeTitile = 'knowledge3093' + randomStr;
            await apiHelper.apiLogin(knowledgeCandidateUser);
            let articleData = {
                "knowledgeSet": "HR",
                "title": `${knowledgeTitile}`,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United States Support",
                "assigneeSupportGroup": "US Support 1",
                "assignee": "kayo"
            }
            KADetails = await apiHelper.createKnowledgeArticle(articleData);
        });

        it('[5871]: Submitter can cancel the article from In Progress status_Submitter is assignee', async () => {
            await navigationPage.signOut();
            await loginPage.login(knowledgeCandidateUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await browser.sleep(5000); //Time required for KA to be visible on Console 
            await utilityGrid.searchAndOpenHyperlink(KADetails.displayId);
            await editKnowledgePage.setKnowledgeStatus('Request Cancelation');
            await utilityCommon.refresh();  // Refresh needed to reflect status changes.
            expect(await editKnowledgePage.getStatusValue()).toContain('Canceled', 'Status not Set');
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            //login with contributor
            await loginPage.login(knowledgeContributorUser);
            let knowledgeTitile1 = 'knowledgeContributor3093' + randomStr;
            await apiHelper.apiLogin(knowledgeCandidateUser);
            let articleData1 = {
                "knowledgeSet": "HR",
                "title": `${knowledgeTitile1}`,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United States Support",
                "assigneeSupportGroup": "US Support 1",
                "assignee": "kkohri"
            }
            let kkohriId = await apiHelper.createKnowledgeArticle(articleData1);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilityGrid.searchAndOpenHyperlink(kkohriId.displayId);
            await editKnowledgePage.setKnowledgeStatus('Request Cancelation');
            await utilityCommon.refresh(); // Refresh needed to reflect status changes.
            expect(await editKnowledgePage.getStatusValue()).toContain('Canceled', 'Status Not set');
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
        });

        it('[5871]: Submitter can cancel the article from In Progress status_Submitter is assignee', async () => {
            //login with publisher
            await loginPage.login(knowledgePublisherUser);
            let knowledgeTitile2 = 'knowledgePublisher3093' + randomStr;
            await apiHelper.apiLogin(knowledgePublisherUser);
            let articleData2 = {
                "knowledgeSet": "HR",
                "title": `${knowledgeTitile2}`,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United Kingdom Support",
                "assigneeSupportGroup": "GB Support 1",
                "assignee": "KMills"
            }
            let kmillsId = await apiHelper.createKnowledgeArticle(articleData2);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilityGrid.searchAndOpenHyperlink(kmillsId.displayId);
            await editKnowledgePage.setKnowledgeStatus('Request Cancelation');
            await utilityCommon.refresh(); // Refresh needed to reflect status changes.
            expect(await editKnowledgePage.getStatusValue()).toContain('Canceled', 'Status not set');
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            //login with publisher
            await loginPage.login(knowledgeCoachUser);
            let knowledgeTitile3 = 'knowledgeCoachUser3093' + randomStr;
            await apiHelper.apiLogin(knowledgeCoachUser);
            let articleData3 = {
                "knowledgeSet": "HR",
                "title": `${knowledgeTitile3}`,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "Australia Support",
                "assigneeSupportGroup": "AU Support 3",
                "assignee": "KWilliamson"
            }
            let kWilliamsonId = await apiHelper.createKnowledgeArticle(articleData3);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilityGrid.searchAndOpenHyperlink(kWilliamsonId.displayId);
            await editKnowledgePage.setKnowledgeStatus('Request Cancelation');
            await utilityCommon.refresh(); // Refresh needed to reflect status changes.
            expect(await editKnowledgePage.getStatusValue()).toContain('Canceled', 'Status not set');
        });

        afterAll(async () => {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('peter');
        });
    });

    //ptidke
    describe('[5969]: [Flag an Article] Flag an article and post a comment', () => {
        let KADetails = undefined;
        beforeAll(async () => {
            let knowledgeTitile = 'knowledge2586' + randomStr;
            await apiHelper.apiLogin(knowledgeCandidateUser);
            let articleData = {
                "knowledgeSet": 'HR',
                "title": `${knowledgeTitile}`,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United States Support",
                "assigneeSupportGroup": "US Support 1",
                "assignee": "kayo",
            }
            KADetails = await apiHelper.createKnowledgeArticle(articleData);
        });

        it('[5969]: [Flag an Article] Flag an article and post a comment', async () => {
            await navigationPage.signOut();
            await loginPage.login(knowledgeCandidateUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await browser.sleep(5000); //Time required for KA to be visible on Console 
            await utilityGrid.searchAndOpenHyperlink(KADetails.displayId);
            await viewKnowledgeArticlePo.clickOnFlagButton();
            await flagUnflagKnowledgePo.setTextInTellUsMore(KADetails.displayId);
            await flagUnflagKnowledgePo.clickOnFlageButtonOnBlade();
            expect(await utilityCommon.isPopUpMessagePresent('You have successfully flagged the article.')).toBeTruthy('Article Not Flagged');
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            //login with contributor
            await loginPage.login(knowledgeContributorUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            let knowledgeTitile1 = 'knowledgeContributor2586' + randomStr;
            await apiHelper.apiLogin(knowledgeCandidateUser);
            let articleData1 = {
                "knowledgeSet": "HR",
                "title": `${knowledgeTitile1}`,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United States Support",
                "assigneeSupportGroup": "US Support 1",
                "assignee": "kkohri"
            }
            let kkohriId = await apiHelper.createKnowledgeArticle(articleData1);
            await utilityGrid.searchAndOpenHyperlink(kkohriId.displayId);
            await viewKnowledgeArticlePo.clickOnFlagButton();
            await flagUnflagKnowledgePo.setTextInTellUsMore(kkohriId.displayId);
            await flagUnflagKnowledgePo.clickOnFlageButtonOnBlade();
            expect(await utilityCommon.isPopUpMessagePresent('You have successfully flagged the article.')).toBeTruthy('Article Not Flagged');
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
        });

        it('[5969]: [Flag an Article] Flag an article and post a comment', async () => {
            //login with publisher
            await loginPage.login(knowledgePublisherUser);
            let knowledgeTitile2 = 'knowledgePublisher2586' + randomStr;
            await apiHelper.apiLogin(knowledgePublisherUser);
            let articleData2 = {
                "knowledgeSet": "HR",
                "title": `${knowledgeTitile2}`,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United Kingdom Support",
                "assigneeSupportGroup": "GB Support 1",
                "assignee": "KMills"
            }
            let kmillsId = await apiHelper.createKnowledgeArticle(articleData2);
            await browser.sleep(5000); //Time required for KA to be visible on Console 
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilityGrid.searchAndOpenHyperlink(kmillsId.displayId);
            await viewKnowledgeArticlePo.clickOnFlagButton();
            await flagUnflagKnowledgePo.setTextInTellUsMore(kmillsId.displayId);
            await flagUnflagKnowledgePo.clickOnFlageButtonOnBlade();
            expect(await utilityCommon.isPopUpMessagePresent('You have successfully flagged the article.')).toBeTruthy('Article Not Flagged');
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
        });

        it('[5969]: [Flag an Article] Flag an article and post a comment', async () => {
            //login with publisher
            await loginPage.login(knowledgeCoachUser);
            let knowledgeTitile3 = 'knowledgeCoachUser2586' + randomStr;
            await apiHelper.apiLogin(knowledgeCoachUser);
            let articleData3 = {
                "knowledgeSet": "HR",
                "title": `${knowledgeTitile3}`,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "Australia Support",
                "assigneeSupportGroup": "AU Support 3",
                "assignee": "KWilliamson"
            }
            let kWilliamsonId = await apiHelper.createKnowledgeArticle(articleData3);
            await browser.sleep(5000); //Time required for KA to be visible on Console 
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilityGrid.searchAndOpenHyperlink(kWilliamsonId.displayId);
            await viewKnowledgeArticlePo.clickOnFlagButton();
            await flagUnflagKnowledgePo.setTextInTellUsMore(kWilliamsonId.displayId);
            await flagUnflagKnowledgePo.clickOnFlageButtonOnBlade();
            expect(await utilityCommon.isPopUpMessagePresent('You have successfully flagged the article.')).toBeTruthy('Article Not Flagged');
        });

        afterAll(async () => {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('peter');
        });
    });

    it('[6373]:[Create Mode] Removing sections with the Remove button', async () => {
        try {
            await navigationPage.signOut();
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Article Templates', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.ARTICLE_TEMPLATES);
            await consoleKnowledgeTemplatePo.clickCreateNewKATemplate();
            await createKnowledgeArticleTemplatePo.setTemplateName('template1064' + randomStr);
            await createKnowledgeArticleTemplatePo.clickOnAddSection();
            await createKnowledgeArticleTemplatePo.setSectionTitle('First' + randomStr);
            await editKnowledgeArticleTemplatePo.clickOnCancelButton();
            expect(await utilityCommon.isWarningDialogBoxDisplayed()).toBeTruthy('Warning Dialog Box is not displayed.');
            expect(await utilityCommon.getWarningDialogTitle()).toBe('Warning!');
            expect(await utilityCommon.getWarningDialogMsg()).toBe('You have unsaved data. Do you want to continue?');
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            await consoleKnowledgeTemplatePo.clickCreateNewKATemplate();
            await createKnowledgeArticleTemplatePo.setTemplateName('template1064' + randomStr);
            await createKnowledgeArticleTemplatePo.clickOnAddSection();
            await createKnowledgeArticleTemplatePo.setDescription('DescriptionOFKA');
            await createKnowledgeArticleTemplatePo.setSectionTitle('Second' + randomStr);
            await createKnowledgeArticleTemplatePo.clickOnSaveButton();
            await utilityGrid.searchAndOpenHyperlink('template1064' + randomStr);
            expect(await editKnowledgeArticleTemplatePo.getSectionTitleValue('First' + randomStr)).toBeFalsy('removed section is Present');
            await editKnowledgeArticleTemplatePo.clickOnCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        }
        catch (e) {
            throw e;
        }
        finally {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        }
    });

    it('[5991]: KA Console - Article Navigation', async () => {
        let knowledgeTitile = 'knowledge2444' + randomStr;
        await apiHelper.apiLogin('peter');
        let articleData = {
            "knowledgeSet": "HR",
            "title": `${knowledgeTitile}`,
            "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
        }
        let knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
        let knowledgeDisplayID = knowledgeArticleData.displayId;
        await navigationPage.signOut();
        await loginPage.login(knowledgeCoachUser);
        await navigationPage.switchToApplication(knowledgeManagementApp);
        expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
        await utilityGrid.searchAndOpenHyperlink(knowledgeDisplayID);
        expect(await viewKnowledgeArticlePo.isEditLinkDisplayedOnKA()).toBeTruthy('Edit link is not displaying');
        await utilityCommon.switchToDefaultWindowClosingOtherTabs();
    });

    describe('[5681]: [Knowledge]-Assigning current user as the Assignee of an article', () => {
        it('[5681]: [Knowledge]-Assigning current user as the Assignee of an article', async () => {
            let knowledgeTitile = 'knowledge5193' + randomStr;
            await apiHelper.apiLogin(knowledgeCoachUser);
            let articleData = {
                "knowledgeSet": "HR",
                "title": `${knowledgeTitile}`,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "categoryTier1": "Applications",
                "categoryTier2": "Help Desk",
                "categoryTier3": "Incident",
                "region": "Australia",
                "site": "Canberra",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United Kingdom Support",
                "assigneeSupportGroup": "GB Support 2",
                "assignee": "KMills"
            }
            let knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
            await navigationPage.signOut();
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilityGrid.searchAndOpenHyperlink(knowledgeArticleData.displayId);
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            let assignedGroupList: string[] = await changeAssignmentBladePo.getAllDropDownValues("AssignedGroup");
            expect(await changeAssignmentBladePo.getDropDownValue("AssignedGroup")).toContain('GB Support 2');
            expect(await changeAssignmentBladePo.getDropDownValue("Assignee")).toContain('Kyle Mills');
            await editKnowledgePage.cancelKnowledgeMedataDataChanges();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            expect(await viewKnowledgeArticlePo.getAssigneeValue()).toContain('Kyle Mills');
        });
        afterAll(async () => {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        });
    });

    it('[5680]: [Knowledge]-Assigning the article using Assignment component', async () => {
        let knowledgeTitile = 'knowledge5195' + randomStr;
        await apiHelper.apiLogin(knowledgeCoachUser);
        let articleData = {
            "knowledgeSet": "HR",
            "title": `${knowledgeTitile}`,
            "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
            "categoryTier1": "Applications",
            "categoryTier2": "Help Desk",
            "categoryTier3": "Incident",
            "region": "Australia",
            "site": "Canberra",
            "assignedCompany": "Petramco",
            "assigneeBusinessUnit": "United Kingdom Support",
            "assigneeSupportGroup": "GB Support 2",
            "assignee": "KMills"
        }
        let knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
        await navigationPage.signOut();
        await loginPage.login(knowledgeCoachUser);
        await navigationPage.switchToApplication(knowledgeManagementApp);
        expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
        await utilityGrid.searchAndOpenHyperlink(knowledgeArticleData.displayId);
        await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
        expect(await changeAssignmentBladePo.isDropDownDisplayed("AssignedGroup")).toBeTruthy("SupportGroup dropdown not displayed");
        await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'Compensation and Benefits');
        await changeAssignmentBladePo.setDropDownValue('Assignee', 'Peter Kahn');
        await editKnowledgePage.saveKnowledgeMedataDataChanges();
        expect(await viewKnowledgeArticlePo.getAssigneeValue()).toContain('Peter Kahn');
        await utilityCommon.switchToDefaultWindowClosingOtherTabs();
    });

    it('[5684]: Click on thumbs up and thumbs down', async () => {
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
            "assignedCompany": "Petramco",
            "assigneeBusinessUnit": "United Kingdom Support",
            "assigneeSupportGroup": "GB Support 2",
            "assignee": "KMills"
        }
        let knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
        await navigationPage.signOut();
        await loginPage.login(knowledgeCoachUser);
        await navigationPage.switchToApplication(knowledgeManagementApp);
        expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
        await utilityGrid.searchAndOpenHyperlink(knowledgeArticleData.displayId);
        await viewKnowledgeArticlePo.clickOnKAUsefulNoButton();
        await feedbackBladeKnowledgeArticlePo.setTextInTellUsMore(knowledgeTitile);
        await feedbackBladeKnowledgeArticlePo.clickOnSaveButtonOnFeedBack();
        await utilityCommon.closePopUpMessage();
        let percentage: string = await viewKnowledgeArticlePo.getPercentageValue();
        await viewKnowledgeArticlePo.clickOnTab('Activity');
        await activityTabPo.clickOnRefreshButton();
        expect(await activityTabPo.getFirstPostContent()).toContain(knowledgeTitile, 'content not displaying on Activity');
        await viewKnowledgeArticlePo.clickOnTab('Information');
        await viewKnowledgeArticlePo.clickOnKAUsefulYesButton();
        expect(await viewKnowledgeArticlePo.getPercentageValue() == percentage).toBeFalsy('Percentage are equal to previous');
        await utilityCommon.switchToDefaultWindowClosingOtherTabs();
    });

    it('[5683]: [Knowledge]- Click on thumps down and enable the flag option.', async () => {
        let knowledgeTitile = 'knowledge5162' + randomStr;
        await apiHelper.apiLogin(knowledgeCoachUser);
        let articleData = {
            "knowledgeSet": "HR",
            "title": `${knowledgeTitile}`,
            "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
            "categoryTier1": "Applications",
            "categoryTier2": "Help Desk",
            "categoryTier3": "Incident",
            "region": "Australia",
            "site": "Canberra",
            "assignedCompany": "Petramco",
            "assigneeBusinessUnit": "United Kingdom Support",
            "assigneeSupportGroup": "GB Support 2",
            "assignee": "KMills"
        }
        let knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
        await navigationPage.signOut();
        await loginPage.login(knowledgeCoachUser);
        await navigationPage.switchToApplication(knowledgeManagementApp);
        expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
        await utilityGrid.searchAndOpenHyperlink(knowledgeArticleData.displayId);
        await viewKnowledgeArticlePo.clickOnKAUsefulNoButton();
        await feedbackBladeKnowledgeArticlePo.selectFlag(true);
        await feedbackBladeKnowledgeArticlePo.setTextInTellUsMore(knowledgeTitile);
        await feedbackBladeKnowledgeArticlePo.clickOnSaveButtonOnFeedBack();
        await utilityCommon.closePopUpMessage();
        expect(await viewKnowledgeArticlePo.isUnFlagButtonDisplayed()).toBeTruthy('Unflag Button is not present');
        await viewKnowledgeArticlePo.clickOnTab('Activity');
        await activityTabPo.clickOnRefreshButton();
        expect(await activityTabPo.getFirstPostContent()).toContain('Kane Williamson flagged the article', 'content not displaying on Activity');
        expect(await activityTabPo.getFirstPostContent()).toContain(knowledgeTitile, 'content not displaying on Activity');
        await utilityCommon.switchToDefaultWindowClosingOtherTabs();
    });

    describe('[4645]: Navigate an Article from Knowledge Create->Preview Knowledge Article->Article Full view', () => {
        it('[4645]: Navigate an Article from Knowledge Create->Preview Knowledge Article->Article Full view', async () => {
            await navigationPage.signOut();
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate('Reference');
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField('Knowledge' + randomStr);
            await createKnowledgePage.setReferenceValue('KnowledgeReference' + randomStr)
            await createKnowledgePage.selectKnowledgeSet('HR');
            await createKnowledgePage.selectCategoryTier1Option('Employee Relations');
            await createKnowledgePage.selectCategoryTier2Option('Compensation');
            await createKnowledgePage.selectCategoryTier3Option('Bonus');
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'Compensation and Benefits');
            await changeAssignmentBladePo.setDropDownValue('Assignee', 'Peter Kahn');
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await previewKnowledgePo.clickGoToArticleButton();
            expect(await viewKnowledgeArticlePo.isEditLinkDisplayedOnKA()).toBeTruthy('full view of article is not displayed');
        });
        afterAll(async () => {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('peter');
        });
    });

    describe('[5682]: Unflag the article', async () => {
        let knowledgeArticleData, knowledgeArticleDataSecond;
        let knowledgeTitile = 'knowledge5192' + randomStr;
        let knowledgeTitileSecond = 'knowledgeNewUnflag' + randomStr;
        beforeAll(async () => {
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
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United Kingdom Support",
                "assigneeSupportGroup": "GB Support 2",
                "assignee": "KMills"
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
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United Kingdom Support",
                "assigneeSupportGroup": "GB Support 2",
                "assignee": "KMills"
            }
            knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleDataFirst);
            knowledgeArticleDataSecond = await apiHelper.createKnowledgeArticle(articleDataSecond);
        });
        it('[5682]: Unflag the article', async () => {
            await navigationPage.gotoKnowledgeConsole();
            await utilityGrid.searchAndOpenHyperlink(knowledgeArticleData.displayId);
            await viewKnowledgeArticlePo.clickOnKAUsefulNoButton();
            await feedbackBladeKnowledgeArticlePo.selectFlag(true);
            await feedbackBladeKnowledgeArticlePo.setTextInTellUsMore(knowledgeTitile);
            await feedbackBladeKnowledgeArticlePo.clickOnSaveButtonOnFeedBack();
            await utilityCommon.closePopUpMessage();
            expect(await viewKnowledgeArticlePo.isUnFlagButtonDisplayed()).toBeTruthy('Unflag Button is not present');
            await viewKnowledgeArticlePo.clickOnTab('Activity');
            await activityTabPo.clickOnRefreshButton();
            expect(await activityTabPo.getFirstPostContent()).toContain('Peter Kahn flagged the article', 'content not displaying on Activity');
            expect(await activityTabPo.getFirstPostContent()).toContain(knowledgeTitile, 'content not displaying on Activity');
            await navigationPage.gotoKnowledgeConsole();
            await utilityGrid.searchAndOpenHyperlink(knowledgeArticleDataSecond.displayId);
            await viewKnowledgeArticlePo.clickOnFlagButton();
            await flagUnflagKnowledgePo.setTextInTellUsMore(knowledgeTitileSecond);
            await flagUnflagKnowledgePo.clickOnFlageButtonOnBlade();
            await utilityCommon.closePopUpMessage();
            await viewKnowledgeArticlePo.clickOnTab('Activity');
            await activityTabPo.clickOnRefreshButton();
            expect(activityTabPo.getFirstPostContent()).toContain(knowledgeTitileSecond, 'Post not present on activity');
        });
        it('[5682]: Unflag the article', async () => {
            await navigationPage.signOut();
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            await utilityGrid.searchAndOpenHyperlink(knowledgeArticleDataSecond.displayId);
            await viewKnowledgeArticlePo.clickOnUnFlagButton();
            await flagUnflagKnowledgePo.setTextInTellUsMore(knowledgeTitileSecond);
            await flagUnflagKnowledgePo.clickOnUnFlageButtonOnBlade();
            await utilityCommon.closePopUpMessage();
            await viewKnowledgeArticlePo.clickOnTab('Activity');
            await activityTabPo.clickOnRefreshButton();
            expect(await activityTabPo.getFirstPostContent()).toContain('Kyle Mills unflagged the article', 'content not displaying on Activity');
            expect(await activityTabPo.getFirstPostContent()).toContain(knowledgeTitileSecond, 'content not displaying on Activity');
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.switchToApplication(knowledgeManagementApp);
            await utilityGrid.searchAndOpenHyperlink(knowledgeArticleData.displayId);
            await viewKnowledgeArticlePo.clickOnUnFlagButton();
            await flagUnflagKnowledgePo.setTextInTellUsMore(knowledgeTitile);
            await flagUnflagKnowledgePo.clickOnUnFlageButtonOnBlade();
            await utilityCommon.closePopUpMessage();
            await viewKnowledgeArticlePo.clickOnTab('Activity');
            await activityTabPo.clickOnRefreshButton();
            expect(await activityTabPo.getFirstPostContent()).toContain('Kyle Mills unflagged the article', 'content not displaying on Activity');
            expect(await activityTabPo.getFirstPostContent()).toContain(knowledgeTitile, 'content not displaying on Activity');
        });
        afterAll(async () => {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('peter');
        });
    });
//refrence defect
    describe('[6075]: [Knowledge Article] Changing the template for the article', async () => {
        it('[6075]: [Knowledge Article] Changing the template for the article', async () => {
            try {
                let knowledgeTitile = 'knowledgeCoachUser1784' + randomStr;
                await navigationPage.gotoKnowledgeConsole();
                await navigationPage.gotoCreateKnowledge();
                expect(await createKnowledgePage.isTemplatePresent('KCS')).toBeTruthy('Template is not present');
                expect(await createKnowledgePage.isTemplatePresent('Reference')).toBeTruthy('Template is not present');
                expect(await createKnowledgePage.isTemplatePresent('How To')).toBeTruthy('Template is not present');
                await createKnowledgePage.clickOnTemplate('KCS');
                expect(createKnowledgePage.getTemplatePreviewText()).toContain('KCS', 'Preview is not present');
                expect(createKnowledgePage.isKnowledgeStyleTemplateDisplayed()).toBeTruthy('style is not present');
                await createKnowledgePage.clickOnSelectDifferentTemplate();
                await createKnowledgePage.clickOnTemplate('Reference');
                expect(createKnowledgePage.getTemplatePreviewText()).toContain('Reference', 'Preview is not present');
                expect(createKnowledgePage.isKnowledgeStyleTemplateDisplayed()).toBeTruthy('style is not present');
                await createKnowledgePage.clickOnUseSelectedTemplateButton();
                await createKnowledgePage.addTextInKnowlegeTitleField('Knowledge Template Reference');
                await createKnowledgePage.setReferenceValue('reference values are as follows');
                await createKnowledgePage.clickChangeTemplateButton();
                await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
                await createKnowledgePage.clickOnTemplate('How To');
                expect(createKnowledgePage.getTemplatePreviewText()).toContain('How To', 'Preview is not present');
                expect(createKnowledgePage.isKnowledgeStyleTemplateDisplayed()).toBeTruthy('style is not present');
                await createKnowledgePage.clickOnUseSelectedTemplateButton();
                await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeTitile);
                await createKnowledgePage.setReferenceValue('reference values are as follows');
                await createKnowledgePage.clickChangeTemplateButton();
                await utilityCommon.clickOnApplicationWarningYesNoButton("No");
                expect(await createKnowledgePage.getKnowledgeArticleTitleValue()).toContain(knowledgeTitile, 'expected Value not present');
                await createKnowledgePage.selectKnowledgeSet('HR');
                await createKnowledgePage.clickOnSaveKnowledgeButton();
                await utilityCommon.closePopUpMessage();
                await previewKnowledgePo.clickOnBackButton();
            }
            catch (e) {
                throw e;
            }
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('peter');
        });
    });

    describe('[6398]:[Edit Knowledge Article] Modify knowledge article by removing all optional data on edit article view', async () => {
        it('[6398]:[Edit Knowledge Article] Modify knowledge article by removing all optional data on edit article view', async () => {
            await apiHelper.apiLogin(knowledgeCoachUser);
            let articleData = {
                "knowledgeSet": "HR",
                "title": 'knowledge2746' + randomStr,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United States Support",
                "assigneeSupportGroup": "US Support 1",
                "assignee": "kayo",
                "categoryTier1": "Employee Relations",
                "categoryTier2": "Compensation",
                "categoryTier3": "Bonus",
                "region": "Australia",
                "site": "Canberra",
                "articleDesc": 'knowledge2746' + randomStr,
            }
            let kaDetails = await apiHelper.createKnowledgeArticle(articleData);
            await navigationPage.signOut();
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilityGrid.searchAndOpenHyperlink(kaDetails.displayId);
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            await editKnowledgePage.removeRegionValue();
            await editKnowledgePage.saveKnowledgeMedataDataChanges();
            expect(await viewKnowledgeArticlePo.getRegionValue()).toBe('-');
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleTitle()).toBe(articleData.title);
            expect(await viewKnowledgeArticlePo.getKnowledgeSet()).toBe(articleData.knowledgeSet);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleAuthor()).toBe('Kane Williamson');
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        });
        afterAll(async () => {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        });
    });

    describe('[6402,5761]:[Edit Knowledge Article] Modify Knowledge metadata on edit knowledge screen', async () => {
        it('[6402,5761]:[Edit Knowledge Article] Modify Knowledge metadata on edit knowledge screen', async () => {
            let fileName: string[] = [];
            fileName = ['bwfJpg.jpg', 'bwfXlsx.xlsx', 'bwfXml.xml', 'bwfPdf.pdf', 'bwfWord1.rtf', 'demo.txt'];
            await apiHelper.apiLogin(knowledgeCoachUser);
            let articleData = {
                "knowledgeSet": "HR",
                "title": 'knowledge2746' + randomStr,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United States Support",
                "assigneeSupportGroup": "US Support 1",
                "assignee": "kayo",
                "categoryTier1": "Applications",
                "categoryTier2": "Help Desk",
                "categoryTier3": "Incident",
                "region": "Americas",
                "siteGroup": "Human Resources",
                "site": "Houston",
                "articleDesc": 'knowledge2746' + randomStr,
            }
            let kaDetails = await apiHelper.createKnowledgeArticle(articleData);
            await navigationPage.signOut();
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilityGrid.searchAndOpenHyperlink(kaDetails.displayId);
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            await editKnowledgePage.setCategoryTier1('Employee Relations');
            await editKnowledgePage.setCategoryTier2('Compensation');
            await editKnowledgePage.setCategoryTier3('Final Pay');
            await editKnowledgePage.selectRegionDropDownOption('Europe');
            await editKnowledgePage.selectSiteGroupDropDownOption('Sales');
            await editKnowledgePage.selectSiteDropDownOption('Barcelona 1');
            await editKnowledgePage.addAttachment(['../../data/ui/attachment/bwfJpg.jpg']);
            await editKnowledgePage.saveKnowledgeMedataDataChanges();
            await utilityCommon.closePopUpMessage();
            expect(await viewKnowledgeArticlePo.getRegionValue()).toBe('Europe');
            expect(await viewKnowledgeArticlePo.getSiteValue()).toBe('Barcelona 1');
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleTitle()).toBe(articleData.title);
            expect(await viewKnowledgeArticlePo.getKnowledgeSet()).toBe(articleData.knowledgeSet);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleAuthor()).toBe('Kane Williamson');
            expect(await viewKnowledgeArticlePo.getCategoryTier1Value()).toBe('Employee Relations');
            expect(await viewKnowledgeArticlePo.getCategoryTier2Value()).toBe('Compensation');
            expect(await viewKnowledgeArticlePo.getCategoryTier3Value()).toBe('Final Pay');
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            await editKnowledgePage.removeAttachment();
            for (let i: number = 0; i < fileName.length; i++) {
                await editKnowledgePage.addAttachment([`../../data/ui/attachment/${fileName[i]}`]);
            }
            await editKnowledgePage.saveKnowledgeMedataDataChanges();
            await utilityCommon.closePopUpMessage();
            await viewKnowledgeArticlePo.clickShowMoreButton();
            expect(await viewKnowledgeArticlePo.isAttachedFileNamePresent('bwfJpg')).toBeTruthy();
            expect(await viewKnowledgeArticlePo.isAttachedFileNamePresent('bwfXlsx')).toBeTruthy();
            expect(await viewKnowledgeArticlePo.isAttachedFileNamePresent('bwfXml')).toBeTruthy();
            expect(await viewKnowledgeArticlePo.isAttachedFileNamePresent('bwfWord1')).toBeTruthy();
            expect(await viewKnowledgeArticlePo.isAttachedFileNamePresent('demo')).toBeTruthy();
        });
        afterAll(async () => {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        });
    });

    it('[5783]:CK Editor - Should be able to upload image using url', async () => {
        let uploadURL = "https://www.google.com/homepage/images/hero-dhp-chrome-win.jpg?mmfb=90bec8294f441f5c41987596ca1b8cff";
        let imageUrlFieldIndex = 0;
        await navigationPage.signOut();
        await loginPage.login(knowledgeCoachUser);
        await navigationPage.switchToApplication(knowledgeManagementApp);
        await navigationPage.gotoCreateKnowledge();
        await createKnowledgePage.clickOnTemplate('Reference');
        await createKnowledgePage.clickOnUseSelectedTemplateButton();
        await createKnowledgePage.addTextInKnowlegeTitleField('Knowledge' + randomStr);
        await createKnowledgePage.selectKnowledgeSet('HR');
        await createKnowledgePage.clickOnImageIcon();
        await imagePropertiesPo.setInputBoxValue(uploadURL, imageUrlFieldIndex);
        await imagePropertiesPo.clickOnOkButton();
        await createKnowledgePage.clickOnSaveKnowledgeButton();
        await previewKnowledgePo.clickGoToArticleButton();
        expect(await viewKnowledgeArticlePo.isImageDisplayedOnDescription(uploadURL)).toBeTruthy('Image is not displayed');
        await utilityCommon.switchToDefaultWindowClosingOtherTabs();
    });

    describe('[5698]: Article Reviewer Assignment notification for article moved to SME Review status', async () => {
        let knowledgeArticleData;
        beforeAll(async () => {
            let articleData = {
                "knowledgeSet": "HR",
                "title": "KnowledgeArticle",
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "categoryTier1": "Applications",
                "categoryTier2": "Help Desk",
                "categoryTier3": "Incident",
                "region": "Australia",
                "site": "Canberra",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United Kingdom Support",
                "assigneeSupportGroup": "GB Support 2",
                "assignee": "KMills"
            }
            await apiHelper.apiLogin('kWilliamson');
            knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData.id, "Draft")).toBeTruthy("Article with Draft status not updated.");
        });
        it('[5698]: Article Reviewer Assignment notification for article moved to SME Review status', async () => {
            await navigationPage.signOut();
            await loginPage.login('kWilliamson');
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr, 'title not correct');
            await utilityGrid.searchAndOpenHyperlink(knowledgeArticleData.displayId);
            expect(await editKnowledgePage.getStatusValue()).toContain('Draft', 'Status not Set');
            await statusBladeKnowledgeArticlePo.setKnowledgeStatusWithReviewerDetails('SME Review', 'Petramco', 'HR Support', 'Compensation and Benefits', 'Peter Kahn')
            expect(await editKnowledgePage.getStatusValue()).toContain('SME Review', 'Status not Set');
            expect(await viewKnowledgeArticlePo.isReviewMessageDisplayed('Knowledge Article is in Review')).toBeTruthy();
        });
        it('[5698]: Article Reviewer Assignment notification for article moved to SME Review status', async () => {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('peter');
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr, 'title not correct');
            await utilityGrid.searchAndOpenHyperlink(knowledgeArticleData.displayId);
            await viewKnowledgeArticlePo.clickReviewPendingLink();
            expect(await reviewCommentsPo.isCancelButtonDisplay()).toBeTruthy('Cancel button not present');
            expect(await reviewCommentsPo.isApprovedButtonDisplay()).toBeTruthy('Approved button not present');
            expect(await reviewCommentsPo.isRejectedButtonDisplay()).toBeTruthy('Rejected button not present');
            expect(await reviewCommentsPo.isTellUsMoreDisplayed()).toBeTruthy('Tell us more not present');
            await reviewCommentsPo.clickCancelButton();
            await notificationPo.clickOnNotificationIcon();
            expect(await notificationPo.isAlertPresent(`Knowledge article ${knowledgeArticleData.displayId} is assigned to you for Review.`)).toBeTruthy();
        });
        afterAll(async () => {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        });
    });
})