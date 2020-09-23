import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import changeAssignmentBladePo from '../../pageobject/common/change-assignment-blade.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import resources from '../../pageobject/common/resources-tab.po';
import { default as createKnowledgePage } from "../../pageobject/knowledge/create-knowlege.po";
import editKnowledgePage from "../../pageobject/knowledge/edit-knowledge.po";
import feedbackBladeKnowledgeArticlePo from '../../pageobject/knowledge/feedback-blade-Knowledge-article.po';
import flagUnflagKnowledgePo from '../../pageobject/knowledge/flag-unflag-knowledge.po';
import { default as knowledgeArticlesConsolePo, default as knowledgeConsolePo } from '../../pageobject/knowledge/knowledge-articles-console.po';
import previewKnowledgePo from '../../pageobject/knowledge/preview-knowledge.po';
import viewKnowledgeArticlePo from '../../pageobject/knowledge/view-knowledge-article.po';
import imagePropertiesPo from '../../pageobject/settings/common/image-properties.po';
import consoleKnowledgeTemplatePo from '../../pageobject/settings/knowledge-management/console-knowledge-template.po';
import createKnowledgeArticleTemplatePo from '../../pageobject/settings/knowledge-management/create-knowledge-article-template.po';
import editKnowledgeArticleTemplatePo from '../../pageobject/settings/knowledge-management/edit-knowledge-article-template.po';
import activityTabPo from '../../pageobject/social/activity-tab.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilGrid from '../../utils/util.grid';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';
import knowledgeAccessPage from '../../pageobject/knowledge/knowledge-access-tab.po';
import viewCasePage from '../../pageobject/case/view-case.po';
import editCasePo from '../../pageobject/case/edit-case.po';
import quickCasePo from '../../pageobject/case/quick-case.po';
import statusBladeKnowledgeArticlePo from '../../pageobject/knowledge/status-blade-knowledge-article.po';
import reviewCommentsPo from '../../pageobject/knowledge/review-comments.po';
import notificationPo from '../../pageobject/notification/notification.po';
import apiCoreUtil from '../../api/api.core.util';

describe('Knowledge Article', () => {
    const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
    const businessDataFile = require('../../data/ui/foundation/businessUnit.ui.json');
    const departmentDataFile = require('../../data/ui/foundation/department.ui.json');
    const supportGrpDataFile = require('../../data/ui/foundation/supportGroup.ui.json');
    const personDataFile = require('../../data/ui/foundation/person.ui.json');
    let knowledgeCandidateUser = 'kayo';
    let knowledgeContributorUser = 'kkohri';
    let knowledgePublisherUser = 'kmills';
    let knowledgeCoachUser = 'kWilliamson';
    let knowledgeManagementApp = "Knowledge Management";
    let knowledgeArticlesTitleStr = "Knowledge Articles";
    let knowledgeModule = 'Knowledge';
    let kaDetails1, kaDetails2, kaDetails3,kaDetails4,kaDetails5,kaDetails6,kaDetails7, knowledgeTemplateId;
    let knowledgeSetTitleStr = 'KASet_' + randomStr;
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('peter');
        await apiHelper.apiLogin('tadmin');
        await apiHelper.setDefaultNotificationForUser("Peter", "Alert");
        await foundationData('Petramco');
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    afterEach(async () => {
        await utilityCommon.refresh();
    });

    async function foundationData(company: string) {
        await apiHelper.apiLogin('tadmin');
        let businessData = businessDataFile['BusinessUnitData'];
        let departmentData = departmentDataFile['DepartmentData'];
        let suppGrpData = supportGrpDataFile['SuppGrpData'];
        let personData = personDataFile['PersonData'];
        let orgId = await apiCoreUtil.getOrganizationGuid(company);
        businessData.relatedOrgId = orgId;
        let businessUnitId = await apiHelper.createBusinessUnit(businessData);
        departmentData.relatedOrgId = businessUnitId;
        let depId = await apiHelper.createDepartment(departmentData);
        suppGrpData.relatedOrgId = depId;
        await apiHelper.createSupportGroup(suppGrpData);
        await apiHelper.createNewUser(personData);
        await apiHelper.associatePersonToSupportGroup(personData.userId, suppGrpData.orgName);
        await apiHelper.associatePersonToCompany(personData.userId, company)
    }

    async function knowledgeConfigCreation() {
        let randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let knowledgeTemplateStr = 'KATemplate_' + randomStr;
        await apiHelper.apiLogin("tadmin");
        apiHelper.deleteApprovalMapping(knowledgeModule);
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
        await apiHelper.apiLogin('elizabeth');
        let knowledgeSet = await apiHelper.createKnowledgeSet(knowledgeSetData);
        await apiHelper.createKnowledgeArticleTemplate(knowledgeSetData.knowledgeSetTitle, knowledgeSet.id, knowledgeArticleTemplateData);
        knowledgeTemplateId = await apiCoreUtil.getKnowledgeTemplateGuid(knowledgeTemplateStr);
    }

    //ptidke
    it('[DRDMV-2604]: [Flag an Article] Unflag a published artilcles by Asignee_Knowledge publisher', async () => {
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
            await utilityGrid.clearFilter();
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
            expect(await previewKnowledgePo.isStatusOfKADisplay()).toBeTruthy('Status not displaying');
            await previewKnowledgePo.clickOnBackButton();
        }
        catch (e) {
            throw e;
        }
    });

    //ptidke
    it('[DRDMV-1164]: PermissionModel_Knowledge Coach permission create knowledge articles', async () => {
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
            await utilityGrid.clearFilter();
            await utilityGrid.searchRecord('Knowledge1164' + randomStr);
            expect(await knowledgeConsolePo.isValueDisplayedInGrid('Title')).toContain('Knowledge1164' + randomStr, 'value is not displaying in Grid');
        }
        catch (e) {
            throw e;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('peter');
        }
    });//, 200 * 1000);

    //ptidke
    //Bug='DRDMV-21644
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
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
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
    describe('[DRDMV-3095]: Submitter can cancel the article from Draft status_Submitter is assignee', () => {
        let displayID = undefined;
        beforeAll(async () => {
            await apiHelper.apiLogin("tadmin");
            apiHelper.deleteApprovalMapping(knowledgeModule);
            let knowledgeTitile = 'knowledge3095' + randomStr;
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
            let KADetails = await apiHelper.createKnowledgeArticle(articleData);
            displayID = KADetails.displayId;
        });

        it('[DRDMV-3095]: Submitter can cancel the article from Draft status_Submitter is assignee', async () => {
            await navigationPage.signOut();
            await loginPage.login(knowledgeCandidateUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(displayID);
            await editKnowledgePage.setKnowledgeStatus('Draft');
            await utilityCommon.closePopUpMessage();
            expect(await editKnowledgePage.getStatusValue()).toContain('Draft', 'Status Not set');
            await editKnowledgePage.setKnowledgeStatus('Request Cancelation');
            await navigationPage.gotoKnowledgeConsole(true);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(displayID);
            expect(await editKnowledgePage.getStatusValue()).toContain('Canceled', 'Status Not set');
            await navigationPage.signOut();
        });

        it('[DRDMV-3095]: Submitter can cancel the article from Draft status_Submitter is assignee', async () => {
            //login with contributor
            await loginPage.login(knowledgeContributorUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            let knowledgeTitile1 = 'knowledgeContributor3095' + randomStr;
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
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(kkohriId.displayId);
            await editKnowledgePage.setKnowledgeStatus('Draft');
            await utilityCommon.closePopUpMessage();
            expect(await editKnowledgePage.getStatusValue()).toContain('Draft', 'Status Not set');
            await editKnowledgePage.setKnowledgeStatus('Request Cancelation');
            await navigationPage.gotoKnowledgeConsole(true);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(kkohriId.displayId);
            expect(await editKnowledgePage.getStatusValue()).toContain('Canceled', 'Status Not set');
            await navigationPage.signOut();
        });

        it('[DRDMV-3095]: Submitter can cancel the article from Draft status_Submitter is assignee', async () => {
            //login with publisher
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            let knowledgeTitile2 = 'knowledgePublisher3095' + randomStr;
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
            console.log(kmillsId);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(kmillsId.displayId);
            await editKnowledgePage.setKnowledgeStatus('Draft');
            await utilityCommon.closePopUpMessage();
            expect(await editKnowledgePage.getStatusValue()).toContain('Draft', 'Status Not set');
            await editKnowledgePage.setKnowledgeStatus('Request Cancelation');
            await navigationPage.gotoKnowledgeConsole(true);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(kmillsId.displayId);
            expect(await editKnowledgePage.getStatusValue()).toContain('Canceled', 'Status Not set');
            await navigationPage.signOut();
        });

        it('[DRDMV-3095]: Submitter can cancel the article from Draft status_Submitter is assignee', async () => {
            //login with coach
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            let knowledgeTitile3 = 'knowledgeCoachUser3095' + randomStr;
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
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(kWilliamsonId.displayId);
            await editKnowledgePage.setKnowledgeStatus('Draft');
            await utilityCommon.closePopUpMessage();
            expect(await editKnowledgePage.getStatusValue()).toContain('Draft', 'Status Not set');
            await editKnowledgePage.setKnowledgeStatus('Request Cancelation');
            await navigationPage.gotoKnowledgeConsole(true);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(kWilliamsonId.displayId);
            expect(await editKnowledgePage.getStatusValue()).toContain('Canceled', 'Status Not set');
        });
        
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('peter');
        });
    });

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
        await utilityCommon.closePopUpMessage();
        expect(await viewKnowledgeArticlePo.isEditLinkDisplayedOnKA()).toBeTruthy('edit link is not present');
        await navigationPage.gotoKnowledgeConsole();
        await utilityGrid.clearFilter();
        await utilityGrid.searchRecord(knowledgeArticleData.displayId);
        console.log(updatedName);
        expect(await knowledgeConsolePo.isValueDisplayedInGrid('Title')).toContain(updatedName, 'KA not present');
    });

    //ptidke
    describe('[DRDMV-3093]: Submitter can cancel the article from In Progress status_Submitter is assignee', () => {
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

        it('[DRDMV-3093]: Submitter can cancel the article from In Progress status_Submitter is assignee', async () => {
            await navigationPage.signOut();
            await loginPage.login(knowledgeCandidateUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(KADetails.displayId);
            await editKnowledgePage.setKnowledgeStatus('Request Cancelation');
            await utilityCommon.refresh();
            expect(await editKnowledgePage.getStatusValue()).toContain('Canceled', 'Status not Set');
            await navigationPage.signOut();
            //login with contributor
            await loginPage.login(knowledgeContributorUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
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
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(kkohriId.displayId);
            await editKnowledgePage.setKnowledgeStatus('Request Cancelation');
            await utilityCommon.refresh();
            expect(await editKnowledgePage.getStatusValue()).toContain('Canceled', 'Status Not set');
            await navigationPage.signOut();
        });

        it('[DRDMV-3093]: Submitter can cancel the article from In Progress status_Submitter is assignee', async () => {
            //login with publisher
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
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
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(kmillsId.displayId);
            await editKnowledgePage.setKnowledgeStatus('Request Cancelation');
            await utilityCommon.refresh();
            expect(await editKnowledgePage.getStatusValue()).toContain('Canceled', 'Status not set');
            await navigationPage.signOut();
            //login with publisher
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
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
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(kWilliamsonId.displayId);
            await editKnowledgePage.setKnowledgeStatus('Request Cancelation');
            await utilityCommon.refresh();
            expect(await editKnowledgePage.getStatusValue()).toContain('Canceled', 'Status not set');
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('peter');
        });
    });

    //ptidke
    describe('[DRDMV-2586]: [Flag an Article] Flag an article and post a comment', () => {
        let KADetails = undefined;
        beforeAll(async () => {
            let knowledgeTitile = 'knowledge2586' + randomStr;
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

        it('[DRDMV-2586]: [Flag an Article] Flag an article and post a comment', async () => {
            await navigationPage.signOut();
            await loginPage.login(knowledgeCandidateUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(KADetails.displayId);
            await viewKnowledgeArticlePo.clickOnFlagButton();
            await flagUnflagKnowledgePo.setTextInTellUsMore(KADetails.displayId);
            await flagUnflagKnowledgePo.clickOnFlageButtonOnBlade();
            expect(await utilityCommon.isPopUpMessagePresent('You have successfully flagged the article.')).toBeTruthy('Article Not Flagged');
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
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(kkohriId.displayId);
            await viewKnowledgeArticlePo.clickOnFlagButton();
            await flagUnflagKnowledgePo.setTextInTellUsMore(kkohriId.displayId);
            await flagUnflagKnowledgePo.clickOnFlageButtonOnBlade();
            expect(await utilityCommon.isPopUpMessagePresent('You have successfully flagged the article.')).toBeTruthy('Article Not Flagged');
            await navigationPage.signOut();
        });

        it('[DRDMV-2586]: [Flag an Article] Flag an article and post a comment', async () => {
            //login with publisher
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
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
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(kmillsId.displayId);
            await viewKnowledgeArticlePo.clickOnFlagButton();
            await flagUnflagKnowledgePo.setTextInTellUsMore(kmillsId.displayId);
            await flagUnflagKnowledgePo.clickOnFlageButtonOnBlade();
            expect(await utilityCommon.isPopUpMessagePresent('You have successfully flagged the article.')).toBeTruthy('Article Not Flagged');
            await navigationPage.signOut();
        });

        it('[DRDMV-2586]: [Flag an Article] Flag an article and post a comment', async () => {
            //login with publisher
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
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
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(kWilliamsonId.displayId);
            await viewKnowledgeArticlePo.clickOnFlagButton();
            await flagUnflagKnowledgePo.setTextInTellUsMore(kWilliamsonId.displayId);
            await flagUnflagKnowledgePo.clickOnFlageButtonOnBlade();
            expect(await utilityCommon.isPopUpMessagePresent('You have successfully flagged the article.')).toBeTruthy('Article Not Flagged');
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('peter');
        });
    });

    it('[DRDMV-1064]:[Create Mode] Removing sections with the Remove button', async () => {
        try {
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
        }
        catch (e) {
            throw e;
        }
        finally {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        }
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
        expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
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
            "assignedCompany": "Petramco",
            "assigneeBusinessUnit": "United Kingdom Support",
            "assigneeSupportGroup": "GB Support 1",
            "assignee": "KMills"
        }
        let knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
        await navigationPage.gotoKnowledgeConsole();
        await utilityGrid.clearFilter();
        await utilityGrid.searchAndOpenHyperlink(knowledgeArticleData.displayId);
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
            "assignedCompany": "Petramco",
            "assigneeBusinessUnit": "United Kingdom Support",
            "assigneeSupportGroup": "GB Support 1",
            "assignee": "KMills"
        }
        let knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
        await navigationPage.gotoKnowledgeConsole();
        await utilityGrid.clearFilter();
        await utilityGrid.searchAndOpenHyperlink(knowledgeArticleData.displayId);
        await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
        await editKnowledgePage.clickChangeAssignmentButton();
        expect(await changeAssignmentBladePo.isCompanyDrpDwnDisplayed()).toBeTruthy("Company dropdown not displayed");
        expect(await changeAssignmentBladePo.isSupportGroupDrpDwnDisplayed()).toBeTruthy("SupportGroup dropdown not displayed");
        expect(await changeAssignmentBladePo.isSearchInputBoxPresent()).toBeTruthy("Search Box not present");
        expect(await changeAssignmentBladePo.isAssignToMeCheckBoxSelected()).toBeFalsy("AssignToMe checkbox shouldbe unchecked");
        await changeAssignmentBladePo.selectCompany('Petramco');
        await changeAssignmentBladePo.selectBusinessUnit('HR Support');
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
        expect(createKnowledgePage.isKnowledgeStyleTemplateDisplayed()).toBeTruthy('style is not present');
        await createKnowledgePage.clickOnUseSelectedTemplateButton();
        await createKnowledgePage.selectKnowledgeSet('HR');
        expect(await createKnowledgePage.isSaveButtonEnabled()).toBeFalsy('save button not disabled');
        await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeTitle);
        await createKnowledgePage.setReferenceValue('Refrence values');
        await createKnowledgePage.clickOnDiscardButton();
        await utilityCommon.clickOnApplicationWarningYesNoButton("No");
        expect(await createKnowledgePage.getKnowledgeSetValue()).toContain('HR', 'expected Value not present');
        expect(await createKnowledgePage.getKnowledgeArticleTitleValue()).toContain(knowledgeTitle, 'expected Value not present');
        await createKnowledgePage.clickOnDiscardButton();
        await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr, 'title not correct');
        await utilityGrid.clearFilter();
        await utilityGrid.searchRecord(knowledgeTitle);
        expect(await utilityGrid.getNumberOfRecordsInGrid()).toEqual(0);
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
            "assignedCompany": "Petramco",
            "assigneeBusinessUnit": "United Kingdom Support",
            "assigneeSupportGroup": "GB Support 1",
            "assignee": "KMills"
        }
        let knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
        await navigationPage.gotoKnowledgeConsole();
        await utilityGrid.clearFilter();
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
            "assignedCompany": "Petramco",
            "assigneeBusinessUnit": "United Kingdom Support",
            "assigneeSupportGroup": "GB Support 1",
            "assignee": "KMills"
        }
        let knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
        await navigationPage.gotoKnowledgeConsole();
        await utilityGrid.clearFilter();
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
    });

    describe('[DRDMV-13707]: Navigate an Article from Knowledge Create->Preview Knowledge Article->Article Full view', () => {
        it('[DRDMV-13707]: Navigate an Article from Knowledge Create->Preview Knowledge Article->Article Full view', async () => {
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
            await previewKnowledgePo.clickGoToArticleButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            expect(await viewKnowledgeArticlePo.isEditLinkDisplayedOnKA()).toBeTruthy('full view of article is not displayed');
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('peter');
        });
    });

    describe('[DRDMV-5192]: Unflag the article', async () => {
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
                "assigneeSupportGroup": "GB Support 1",
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
                "assigneeSupportGroup": "GB Support 1",
                "assignee": "KMills"
            }
            knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleDataFirst);
            knowledgeArticleDataSecond = await apiHelper.createKnowledgeArticle(articleDataSecond);
        });
        it('[DRDMV-5192]: Unflag the article', async () => {
            await navigationPage.gotoKnowledgeConsole()
            await utilityGrid.clearFilter();
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
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(knowledgeArticleDataSecond.displayId);
            await viewKnowledgeArticlePo.clickOnFlagButton();
            await flagUnflagKnowledgePo.setTextInTellUsMore(knowledgeTitileSecond);
            await flagUnflagKnowledgePo.clickOnFlageButtonOnBlade();
            await utilityCommon.closePopUpMessage();
            await viewKnowledgeArticlePo.clickOnTab('Activity');
            await activityTabPo.clickOnRefreshButton();
            expect(activityTabPo.getFirstPostContent()).toContain(knowledgeTitileSecond, 'Post not present on activity');
        });
        it('[DRDMV-5192]: Unflag the article', async () => {
            await navigationPage.signOut();
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            await utilityGrid.clearFilter();
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
            await utilityGrid.clearFilter();
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
            await navigationPage.signOut();
            await loginPage.login('peter');
        });
    });

    describe('[DRDMV-2746]: Article status transition - In Progress->Draft->Published->Closed', async () => {
        let KADetails, KACoachDetails;
        beforeAll(async () => {
            await apiHelper.apiLogin("elizabeth");
            apiHelper.deleteApprovalMapping(knowledgeModule);
            let knowledgeTitile = 'knowledge2746' + randomStr;
            await apiHelper.apiLogin(knowledgePublisherUser);
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
            await apiHelper.apiLogin(knowledgeCoachUser);
            let articleDataCoach = {
                "knowledgeSet": "HR",
                "title": `${knowledgeTitile}`,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignee": "kayo",
                "assigneeSupportGroup": "US Support 1",
                "company": "Petramco"
            }
            KACoachDetails = await apiHelper.createKnowledgeArticle(articleDataCoach);
        });
        it('[DRDMV-2746]: Article status transition - In Progress->Draft->Published->Closed', async () => {
            await navigationPage.signOut();
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(KADetails.displayId);
            await editKnowledgePage.setKnowledgeStatus('Draft');
            expect(await editKnowledgePage.getStatusValue()).toContain('Draft', 'Status not Set');
            await navigationPage.gotoKnowledgeConsole(true);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(KADetails.displayId);
            expect(await editKnowledgePage.getStatusValue()).toContain('Draft', 'Status not Set');
            await editKnowledgePage.setKnowledgeStatus('Publish Approval');
            await navigationPage.gotoKnowledgeConsole(true);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(KADetails.displayId);
            expect(await editKnowledgePage.getStatusValue()).toContain('Published', 'Status not Set');
            await editKnowledgePage.setKnowledgeStatus('Retire Approval');
            await navigationPage.gotoKnowledgeConsole(true);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(KADetails.displayId);
            expect(await editKnowledgePage.getStatusValue()).toContain('Retired', 'Status not Set');
            await editKnowledgePage.setClosedKnowledgeStatus('Closed');
            expect(await editKnowledgePage.getStatusValue()).toContain('Closed', 'Status not Set');
            await navigationPage.gotoKnowledgeConsole(true);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(KADetails.displayId);
            expect(await editKnowledgePage.getStatusValue()).toContain('Closed', 'Status not Set');
            expect(await viewKnowledgeArticlePo.isStatusChangeBladePresent()).toBeFalsy('status changes blade is peresent');
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        });
        it('[DRDMV-2746]: Article status transition - In Progress->Draft->Published->Closed', async () => {
            await navigationPage.signOut();
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(KACoachDetails.displayId);
            await editKnowledgePage.setKnowledgeStatus('Draft');
            expect(await editKnowledgePage.getStatusValue()).toContain('Draft', 'Status not Set');
            await navigationPage.gotoKnowledgeConsole(true);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(KACoachDetails.displayId);
            expect(await editKnowledgePage.getStatusValue()).toContain('Draft', 'Status not Set');
            await editKnowledgePage.setKnowledgeStatus('Publish Approval');
            await navigationPage.gotoKnowledgeConsole(true);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(KACoachDetails.displayId);
            expect(await editKnowledgePage.getStatusValue()).toContain('Published', 'Status not Set');
            await editKnowledgePage.setKnowledgeStatus('Retire Approval');
            await navigationPage.gotoKnowledgeConsole(true);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(KACoachDetails.displayId);
            expect(await editKnowledgePage.getStatusValue()).toContain('Retired', 'Status not Set');
            await editKnowledgePage.setClosedKnowledgeStatus('Closed');
            await navigationPage.gotoKnowledgeConsole(true);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(KACoachDetails.displayId);
            expect(await editKnowledgePage.getStatusValue()).toContain('Closed', 'Status not Set');
            expect(await viewKnowledgeArticlePo.isStatusChangeBladePresent()).toBeFalsy('status changes blade is peresent');
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        });
    });

    it('[DRDMV-1784]: [Knowledge Article] Changing the template for the article', async () => {
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
    });

    it('[DRDMV-777]:[Edit Knowledge Article] Modify knowledge article by removing all optional data on edit article view', async () => {
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
            "region": "Australia",
            "site": "Canberra",
            "articleDesc": 'knowledge2746' + randomStr,
        }
        let kaDetails = await apiHelper.createKnowledgeArticle(articleData);
        await navigationPage.signOut();
        await loginPage.login(knowledgeCoachUser);
        await navigationPage.switchToApplication(knowledgeManagementApp);
        expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
        await utilityGrid.clearFilter();
        await utilityGrid.searchAndOpenHyperlink(kaDetails.displayId);
        await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
        await editKnowledgePage.removeRegionValue();
        await editKnowledgePage.saveKnowledgeMedataDataChanges();
        expect(await viewKnowledgeArticlePo.getRegionValue()).toBe('-');
        expect(await viewKnowledgeArticlePo.getKnowledgeArticleTitle()).toBe(articleData.title);
        expect(await viewKnowledgeArticlePo.getKnowledgeSet()).toBe(articleData.knowledgeSet);
        expect(await viewKnowledgeArticlePo.getKnowledgeArticleAuthor()).toBe('Kane Williamson');
    });

    it('[DRDMV-772,DRDMV-4264]:[Edit Knowledge Article] Modify Knowledge metadata on edit knowledge screen', async () => {
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
            "region": "Australia",
            "site": "Canberra",
            "articleDesc": 'knowledge2746' + randomStr,
        }
        let kaDetails = await apiHelper.createKnowledgeArticle(articleData);
        await navigationPage.signOut();
        await loginPage.login(knowledgeCoachUser);
        await navigationPage.switchToApplication(knowledgeManagementApp);
        expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
        await utilityGrid.clearFilter();
        await utilityGrid.searchAndOpenHyperlink(kaDetails.displayId);
        await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
        await editKnowledgePage.setCategoryTier1('Employee Relations');
        await editKnowledgePage.setCategoryTier2('Compensation');
        await editKnowledgePage.setCategoryTier3('Final Pay');
        await editKnowledgePage.selectRegionDropDownOption('EMEA');
        await editKnowledgePage.selectSiteDropDownOption('Barcelona 1');
        await editKnowledgePage.addAttachment(['../../data/ui/attachment/bwfJpg.jpg']);
        await editKnowledgePage.saveKnowledgeMedataDataChanges();
        await utilityCommon.closePopUpMessage();
        expect(await viewKnowledgeArticlePo.getRegionValue()).toBe('EMEA');
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

    it('[DRDMV-3461,DRDMV-12610]:[Knowledge Article] Adding one or two or three level operational categorization while creating knowledge articles_Tier1, Tier2 & Tier3', async () => {
        await navigationPage.signOut();
        await loginPage.login(knowledgeCoachUser);
        await navigationPage.switchToApplication(knowledgeManagementApp);
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
        await previewKnowledgePo.clickGoToArticleButton();
        expect(await viewKnowledgeArticlePo.getCategoryTier1Value()).toBe('Accounts Payable');
        expect(await viewKnowledgeArticlePo.getCategoryTier2Value()).toBe('Invoices');
        expect(await viewKnowledgeArticlePo.getCategoryTier3Value()).toBe('Payment');
        await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
        await editKnowledgePage.removeCategoryTier1();
        await editKnowledgePage.removeCategoryTier2();
        await editKnowledgePage.removeCategoryTier3();
        await editKnowledgePage.saveKnowledgeMedataDataChanges();
        await utilityCommon.closePopUpMessage();
        expect(await viewKnowledgeArticlePo.getCategoryTier1Value()).toBe('-');
        expect(await viewKnowledgeArticlePo.getCategoryTier2Value()).toBe('-');
        expect(await viewKnowledgeArticlePo.getCategoryTier3Value()).toBe('-');
        await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
        await editKnowledgePage.setCategoryTier1('Employee Relations');
        await editKnowledgePage.setCategoryTier2('Compensation');
        await editKnowledgePage.saveKnowledgeMedataDataChanges();
        await utilityCommon.closePopUpMessage();
        expect(await viewKnowledgeArticlePo.getCategoryTier1Value()).toBe('Employee Relations');
        expect(await viewKnowledgeArticlePo.getCategoryTier2Value()).toBe('Compensation');
        await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
        await editKnowledgePage.setCategoryTier1('Accounts Payable');
        await editKnowledgePage.saveKnowledgeMedataDataChanges();
        await utilityCommon.closePopUpMessage();
        expect(await viewKnowledgeArticlePo.getCategoryTier1Value()).toBe('Accounts Payable');
    });

    it('[DRDMV-2448]:KA Console - Search Article by name, keywords', async () => {
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
            "region": "Australia",
            "site": "Canberra",
            "articleDesc": 'knowledge2746' + randomStr,
        }
        let kaDetails = await apiHelper.createKnowledgeArticle(articleData);
        await navigationPage.signOut();
        await loginPage.login(knowledgeCoachUser);
        await navigationPage.switchToApplication(knowledgeManagementApp);
        expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
        await utilityGrid.clearFilter();
        await utilityGrid.searchRecord(kaDetails.displayId);
        expect(await utilityGrid.isGridRecordPresent(kaDetails.displayId)).toBeTruthy(kaDetails.displayId + ' :Record is not available');
        await utilityGrid.searchRecord('HR');
        expect(await utilityGrid.isGridRecordPresent('HR')).toBeTruthy();
        await utilityGrid.searchRecord(articleData.title);
        expect(await utilityGrid.isGridRecordPresent(articleData.title)).toBeTruthy();
        await utilityGrid.searchRecord(articleData.assignedCompany);
        expect(await utilityGrid.isGridRecordPresent(articleData.assignedCompany)).toBeTruthy();
    });

    it('[DRDMV-2608]:Create KA - with only required and with all fields populating', async () => {
        await navigationPage.signOut();
        await loginPage.login(knowledgeCoachUser);
        await navigationPage.switchToApplication(knowledgeManagementApp);
        await navigationPage.gotoCreateKnowledge();
        await createKnowledgePage.clickOnTemplate('Reference');
        await createKnowledgePage.clickOnUseSelectedTemplateButton();
        await createKnowledgePage.addTextInKnowlegeTitleField('Knowledge' + randomStr);
        await createKnowledgePage.selectKnowledgeSet('HR');
        await createKnowledgePage.clickOnSaveKnowledgeButton();
        await utilityCommon.closePopUpMessage();
        await previewKnowledgePo.clickGoToArticleButton();
        expect(await viewKnowledgeArticlePo.getKnowledgeArticleTitle()).toBe('Knowledge' + randomStr);
        expect(await viewKnowledgeArticlePo.getKnowledgeSet()).toBe('HR');
        await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
        await editKnowledgePage.selectRegionDropDownOption('EMEA');
        await editKnowledgePage.setCategoryTier1('Employee Relations');
        await editKnowledgePage.setCategoryTier2('Compensation');
        await editKnowledgePage.setCategoryTier3('Bonus');
        await editKnowledgePage.selectSiteDropDownOption('Barcelona 1');
        await editKnowledgePage.clickChangeAssignmentButton();
        await changeAssignmentBladePo.selectCompany('Petramco');
        await changeAssignmentBladePo.selectBusinessUnit('HR Support');
        await changeAssignmentBladePo.selectSupportGroup('Compensation and Benefits');
        await changeAssignmentBladePo.selectAssignee('Peter Kahn');
        await changeAssignmentBladePo.clickOnAssignButton();
        await editKnowledgePage.saveKnowledgeMedataDataChanges();
        await utilityCommon.closePopUpMessage();
        expect(await viewKnowledgeArticlePo.getCategoryTier1Value()).toBe('Employee Relations');
        expect(await viewKnowledgeArticlePo.getCategoryTier2Value()).toBe('Compensation');
        expect(await viewKnowledgeArticlePo.getCategoryTier3Value()).toBe('Bonus');
        expect(await viewKnowledgeArticlePo.getRegionValue()).toBe('EMEA');
        expect(await viewKnowledgeArticlePo.getSiteValue()).toBe('Barcelona 1');
        expect(await viewKnowledgeArticlePo.getAssigneeValue()).toContain('Peter Kahn');
    });

    it('[DRDMV-1182]:ArticleCreation_User assign knowledge article to a specific support group', async () => {
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
            "region": "Australia",
            "site": "Canberra",
            "articleDesc": 'knowledge2746' + randomStr,
        }
        await apiHelper.apiLogin(knowledgeCoachUser);
        let kaDetails = await apiHelper.createKnowledgeArticle(articleData);
        await navigationPage.signOut();
        await loginPage.login(knowledgeCoachUser);
        await navigationPage.switchToApplication(knowledgeManagementApp);
        expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
        await utilityGrid.clearFilter();
        await utilityGrid.searchAndOpenHyperlink(kaDetails.displayId);
        await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
        await editKnowledgePage.clickChangeAssignmentButton();
        await changeAssignmentBladePo.selectCompany('Petramco');
        await changeAssignmentBladePo.selectBusinessUnit('HR Support');
        await changeAssignmentBladePo.selectSupportGroup('Compensation and Benefits');
        await changeAssignmentBladePo.selectAssignee('Peter Kahn');
        await changeAssignmentBladePo.clickOnAssignButton();
        await editKnowledgePage.saveKnowledgeMedataDataChanges();
        await utilityCommon.closePopUpMessage();
        expect(await viewKnowledgeArticlePo.getAssigneeValue()).toContain('Peter Kahn');
        await navigationPage.signOut();
        await loginPage.login('peter');
        await navigationPage.switchToApplication(knowledgeManagementApp);
        expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
        await utilityGrid.clearFilter();
        await utilityGrid.searchAndOpenHyperlink(kaDetails.displayId);
        await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
        await editKnowledgePage.clickChangeAssignmentButton();
        await changeAssignmentBladePo.selectCompany('Petramco');
        await changeAssignmentBladePo.selectBusinessUnit('HR Support');
        await changeAssignmentBladePo.selectSupportGroup('Employee Relations');
        await changeAssignmentBladePo.selectAssignee('Elizabeth Peters');
        await changeAssignmentBladePo.clickOnAssignButton();
        await editKnowledgePage.saveKnowledgeMedataDataChanges();
        await utilityCommon.closePopUpMessage();
        expect(await viewKnowledgeArticlePo.getAssigneeValue()).toContain('Elizabeth Peters');
    });

    describe('[DRDMV-4266,DRDMV-4267]:[Attachment] - Create article with maximum attachment - 30 attachments', async () => {
        let kaDetails1, kaDetails2, articleData1, articleData2;
        let fileName: string[] = ['bwfJpg.jpg', 'bwfJpg1.jpg', 'bwfJpg2.jpg', 'bwfJpg3.jpg', 'bwfJpg4.jpg', 'bwfJson1.json', 'bwfJson2.json', 'bwfJson3.json', 'bwfJson4.json', 'bwfJson5.json', 'bwfPdf.pdf', 'bwfPdf1.pdf', 'bwfPdf2.pdf', 'bwfPdf3.pdf', 'bwfPdf4.pdf', 'bwfWord1.rtf', 'bwfWord2.rtf', 'bwfWord3.rtf', 'bwfWord4.rtf', 'bwfWord5.rtf', 'articleStatus.png', 'bwfContact.contact', 'bwfXlsx.xlsx', 'bwfXlsx1.xlsx', 'bwfXsl.xsl', 'bwfXsl1.xsl', 'bwfXml.xml', 'bwfXml1.xml', 'demo.txt', 'demo1.txt'];
        beforeAll(async () => {
            await apiHelper.apiLogin(knowledgeCoachUser);
            articleData1 = {
                "knowledgeSet": "HR",
                "title": 'KA1' + randomStr,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United States Support",
                "assigneeSupportGroup": "US Support 1",
                "assignee": "kayo",
            }
            articleData2 = {
                "knowledgeSet": "HR",
                "title": 'KA2' + randomStr,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United States Support",
                "assigneeSupportGroup": "US Support 1",
                "assignee": "kayo",
            }
            kaDetails1 = await apiHelper.createKnowledgeArticle(articleData1);
            kaDetails2 = await apiHelper.createKnowledgeArticle(articleData2);
        });
        it('[DRDMV-4266,DRDMV-4267]:[Attachment] - Create article with maximum attachment - 30 attachments', async () => {
            await navigationPage.signOut();
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(kaDetails1.displayId);
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            for (let i: number = 0; i < fileName.length; i++) {
                await editKnowledgePage.addAttachment([`../../data/ui/attachment/${fileName[i]}`]);
            }
            await editKnowledgePage.saveKnowledgeMedataDataChanges();
            await utilityCommon.closePopUpMessage();
            await viewKnowledgeArticlePo.clickShowMoreButton();
            expect(await viewKnowledgeArticlePo.getAttachmentCountFromKA()).toBe(30);
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            for (let i: number = 0; i < fileName.length; i++) {
                await editKnowledgePage.removeAttachment();
            }
            await editKnowledgePage.setCategoryTier1('Applications');
            await editKnowledgePage.saveKnowledgeMedataDataChanges();
            await utilityCommon.closePopUpMessage();
            expect(await viewKnowledgeArticlePo.getAttachmentCountFromKA()).toBe(0);
        });
        it('[DRDMV-4266,DRDMV-4267]:[Attachment] - Create article with maximum attachment - 30 attachments', async () => {
            await navigationPage.gotoKnowledgeConsole(true);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(kaDetails2.displayId);
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            await editKnowledgePage.addAttachment(['../../data/ui/attachment/bwfJpg.jpg']);
            await editKnowledgePage.setCategoryTier1('Applications');
            await editKnowledgePage.saveKnowledgeMedataDataChanges();
            await utilityCommon.closePopUpMessage();
            expect(await viewKnowledgeArticlePo.isAttachedFileNamePresent('bwfJpg')).toBeTruthy();
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            await editKnowledgePage.setCategoryTier1('Employee Relations');
            await editKnowledgePage.removeAttachment();
            await editKnowledgePage.saveKnowledgeMedataDataChanges();
            expect(await viewKnowledgeArticlePo.isAttachedFileNamePresent('bwfJpg')).toBeFalsy();
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    it('[DRDMV-4018]:CK Editor - Should be able to upload image using url', async () => {
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
    });

    describe('[DRDMV-21679,DRDMV-21681]:Tiggered the Approval on Article and check KA screen by Approver should show Approval component', async () => {
        let knowledgeSetTitle = undefined, title = "DRDMV-21679 KnowledgeArticle", knowledgeArticleGUID, knowledgeArticleData;
        beforeAll(async () => {
            await apiHelper.apiLogin('elizabeth');
            let knowledgeSetData = {
                "knowledgeSetTitle": "Knowledge Set Petramco",
                "knowledgeSetDesc": "Knowledge Description Petramco",
                "company": "Petramco"
            }
            let knowledgeApprovalFlowData = {
                "flowName": "Preset Filter",
                "approver": "KMills",
                "qualification": "'Operational Category Tier 1' = ${recordInstanceContext._recordinstance.com.bmc.arsys.rx.foundation:Operational Category.cddc9f6098ac421a1aa40ec9be503abb0fda61530bc9dbb22e7049cba9c5839018ba7205a392cd9f37141091bbe33e28405caff795929e4d805fa787dfea2c0c.304405421}"
            }
            let knowledgeApprovalMappingData = {
                "mappingName": "Approval Config Name",
                "company": "Petramco",
                "publishApproval": "PublishApproval",
                "requestCancelation": "CancelApproval",
                "retireApproval": "RetireApproval"
            }
            //Create Knowledge Configuraton
            const randomStr = [...Array(2)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            knowledgeSetTitle = knowledgeSetData.knowledgeSetTitle + randomStr;
            knowledgeSetData.knowledgeSetTitle = knowledgeSetTitle;
            await apiHelper.createKnowledgeSet(knowledgeSetData);
            let approvalConfigGlobalTitle = knowledgeApprovalFlowData.flowName + randomStr;
            knowledgeApprovalFlowData.flowName = approvalConfigGlobalTitle;
            await apiHelper.createApprovalFlow(knowledgeApprovalFlowData, knowledgeModule);
            await apiHelper.createApprovalMapping(knowledgeModule, knowledgeApprovalMappingData);
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
                "assigneeSupportGroup": "GB Support 1",
                "assignee": "KMills"
            }
            // Create article in in progress status
            articleData.title = title + "_" + "In Progress";
            knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
            //Create article in Published status
            articleData.title = title + "_" + "Published";
            knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
            knowledgeArticleGUID = knowledgeArticleData.id;
        });
        it('[DRDMV-21679,DRDMV-21681]:Tiggered the Approval on Article and check KA screen by Approver should show Approval component', async () => {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr, 'title not correct');
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(knowledgeArticleData.displayId);
            expect(await viewKnowledgeArticlePo.isApprovalButtonsPresent("Approve")).toBeFalsy();
            expect(await viewKnowledgeArticlePo.isApprovalButtonsPresent("Reject")).toBeFalsy();
            await viewKnowledgeArticlePo.clickEditKnowledgeAccess();
            await knowledgeAccessPage.clickOnAccessButton('Agent Access');
            await knowledgeAccessPage.selectAgent('kayo');
            await knowledgeAccessPage.clickCloseKnowledgeAccessBlade();
        });
        it('[DRDMV-21679,DRDMV-21681]:Tiggered the Approval on Article and check KA screen by Approver should show Approval component', async () => {
            await apiHelper.apiLogin('elizabeth');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, "Draft")).toBeTruthy("Article with Draft status not updated.");
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'PublishApproval', "KMills", 'GB Support 2', 'Petramco')).toBeTruthy("Article with Published status not updated.");
            await navigationPage.signOut();
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr, 'title not correct');
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(knowledgeArticleData.displayId);
            expect(await viewKnowledgeArticlePo.isApprovalButtonsPresent("Approve")).toBeTruthy();
            expect(await viewKnowledgeArticlePo.isApprovalButtonsPresent("Reject")).toBeTruthy();
        });
        it('[DRDMV-21679,DRDMV-21681]:Tiggered the Approval on Article and check KA screen by Approver should show Approval component', async () => {
            await navigationPage.signOut();
            await loginPage.login('kayo');
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr, 'title not correct');
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(knowledgeArticleData.displayId);
            expect(await viewKnowledgeArticlePo.isApprovalButtonsPresent("Approve")).toBeFalsy();
            expect(await viewKnowledgeArticlePo.isApprovalButtonsPresent("Reject")).toBeFalsy();
        });
        afterAll(async () => {
            await apiHelper.apiLogin('elizabeth');
            apiHelper.deleteApprovalMapping(knowledgeModule);
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[DRDMV-20944]:UI- Knowledge Article functioning for  Approval phases such as Publish, Retire and Cancel', async () => {
        let articleData, knowledgeSetTitle = undefined, title = "DRDMV-20944 KnowledgeArticle" + randomStr, knowledgeArticleGUID, knowledgeArticleData;
        beforeAll(async () => {
            await apiHelper.apiLogin('elizabeth');
            let knowledgeSetData = {
                "knowledgeSetTitle": "Knowledge Set Petramco",
                "knowledgeSetDesc": "Knowledge Description Petramco",
                "company": "Petramco"
            }
            let knowledgeApprovalFlowData = {
                "flowName": "Preset Filter",
                "approver": "KMills",
                "qualification": "'Operational Category Tier 1' = ${recordInstanceContext._recordinstance.com.bmc.arsys.rx.foundation:Operational Category.cddc9f6098ac421a1aa40ec9be503abb0fda61530bc9dbb22e7049cba9c5839018ba7205a392cd9f37141091bbe33e28405caff795929e4d805fa787dfea2c0c.304405421}"
            }
            let knowledgeApprovalMappingData = {
                "mappingName": "Approval Config Name",
                "company": "Petramco",
                "publishApproval": "PublishApproval",
                "requestCancelation": "CancelApproval",
                "retireApproval": "RetireApproval"
            }
            //Create Knowledge Configuraton
            const randomStr = [...Array(2)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            knowledgeSetTitle = knowledgeSetData.knowledgeSetTitle + randomStr;
            knowledgeSetData.knowledgeSetTitle = knowledgeSetTitle;
            await apiHelper.createKnowledgeSet(knowledgeSetData);
            let approvalConfigGlobalTitle = knowledgeApprovalFlowData.flowName + randomStr;
            knowledgeApprovalFlowData.flowName = approvalConfigGlobalTitle;
            await apiHelper.createApprovalFlow(knowledgeApprovalFlowData,knowledgeModule);
            await apiHelper.createApprovalMapping(knowledgeModule,knowledgeApprovalMappingData);
            articleData = {
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
                "assigneeSupportGroup": "GB Support 1",
                "assignee": "KMills"
            }
            // Create article in in progress status
            articleData.title = title + "_" + "In Progress";
            knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
            knowledgeArticleGUID = knowledgeArticleData.id;
        });
        it('[DRDMV-20944]:UI- Knowledge Article functioning for  Approval phases such as Publish, Retire and Cancel', async () => {
            await apiHelper.apiLogin('elizabeth');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, "Draft")).toBeTruthy("Article with Draft status not updated.");
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'PublishApproval', "KMills", 'GB Support 2', 'Petramco')).toBeTruthy("Article with Published status not updated.");
            await navigationPage.signOut();
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr, 'title not correct');
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(knowledgeArticleData.displayId);
            expect(await viewKnowledgeArticlePo.isApprovalButtonsPresent("Reject")).toBeTruthy();
            await viewKnowledgeArticlePo.clickOnRejectLink();
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr, 'title not correct');
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(knowledgeArticleData.displayId);
            expect(await viewKnowledgeArticlePo.getStatusValue()).toBe("Draft", 'Status is not updated');
            await editKnowledgePage.setKnowledgeStatus('Request Cancelation');
            expect(await editKnowledgePage.getStatusValue()).toContain('Request Cancelation', 'Status Not set');
        });
        it('[DRDMV-20944]:UI- Knowledge Article functioning for  Approval phases such as Publish, Retire and Cancel', async () => {
            await navigationPage.signOut();
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr, 'title not correct');
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(knowledgeArticleData.displayId);
            expect(await viewKnowledgeArticlePo.isApprovalButtonsPresent("Reject")).toBeTruthy();
            await viewKnowledgeArticlePo.clickOnRejectLink();
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr, 'title not correct');
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(knowledgeArticleData.displayId);
            expect(await viewKnowledgeArticlePo.getStatusValue()).toBe("Draft", 'Status is not updated');
            await editKnowledgePage.setKnowledgeStatus('Publish Approval');
            expect(await editKnowledgePage.getStatusValue()).toContain('Publish Approval', 'Status Not set');
        });
        it('[DRDMV-20944]:UI- Knowledge Article functioning for  Approval phases such as Publish, Retire and Cancel', async () => {
            await navigationPage.signOut();
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr, 'title not correct');
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(knowledgeArticleData.displayId);
            expect(await viewKnowledgeArticlePo.isApprovalButtonsPresent("Approve")).toBeTruthy();
            await viewKnowledgeArticlePo.clickOnApproveLink();
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr, 'title not correct');
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(knowledgeArticleData.displayId);
            expect(await viewKnowledgeArticlePo.getStatusValue()).toBe("Published", 'Status is not updated');
            await editKnowledgePage.setKnowledgeStatus('Retire Approval');
            expect(await editKnowledgePage.getStatusValue()).toContain('Retire Approval', 'Status Not set');
        });
        it('[DRDMV-20944]:UI- Knowledge Article functioning for  Approval phases such as Publish, Retire and Cancel', async () => {
            await navigationPage.signOut();
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr, 'title not correct');
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(knowledgeArticleData.displayId);
            expect(await viewKnowledgeArticlePo.isApprovalButtonsPresent("Approve")).toBeTruthy();
            await viewKnowledgeArticlePo.clickOnApproveLink();
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr, 'title not correct');
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(knowledgeArticleData.displayId);
            expect(await viewKnowledgeArticlePo.getStatusValue()).toBe("Retired", 'Status is not updated');
        });
        afterAll(async () => {
            await apiHelper.apiLogin('elizabeth');
            apiHelper.deleteApprovalMapping(knowledgeModule);
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[DRDMV-1249,DRDMV-1250,DRDMV-1225,DRDMV-2695]:[Knowledge Article Search] Knowledge Articles are searched based on Case Summary and  in the Resources tab', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let knowledgeArticleData1, knowledgeArticleData2, caseData, createCaseResponse;
        beforeAll(async () => {
            await apiHelper.apiLogin('elizabeth');
            let caseTemplateData = {
                "templateName": 'caseTemplateForSelfApprovalWithoutProcessWithCriticalPriority' + randomStr,
                "templateSummary": 'Automated One must Approval Case',
                "categoryTier1": 'Applications',
                "casePriority": "Critical",
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }
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
                "assigneeSupportGroup": "GB Support 1",
                "assignee": "KMills"
            }
            let caseTemplateResponse = await apiHelper.createCaseTemplate(caseTemplateData);
            let caseTemplateDisplayId: string = caseTemplateResponse.displayId;
            articleData.title = "bonus" + "_" + randomStr;
            knowledgeArticleData1 = await apiHelper.createKnowledgeArticle(articleData);
            articleData.title = "compensation" + "_" + randomStr;
            knowledgeArticleData2 = await apiHelper.createKnowledgeArticle(articleData);
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData1.id, "Draft")).toBeTruthy("Article with Draft status not updated.");
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData1.id, 'PublishApproval', "KMills", 'GB Support 2', 'Petramco')).toBeTruthy("Article with Published status not updated.");
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData2.id, "Draft")).toBeTruthy("Article with Draft status not updated.");
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData2.id, 'PublishApproval', "KMills", 'GB Support 2', 'Petramco')).toBeTruthy("Article with Published status not updated.");
            caseData = {
                "Requester": "qdu",
                "Summary": "bonus" + "_" + randomStr,
                "Case Template ID": caseTemplateDisplayId
            }
            createCaseResponse = await apiHelper.createCase(caseData);
            await browser.sleep(2000); // hardwait to populate resource tab data
        });
        it('[DRDMV-1249,DRDMV-1250,DRDMV-1225,DRDMV-2695]:[Knowledge Article Search] Knowledge Articles are searched based on Case Summary and  in the Resources tab', async () => {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(createCaseResponse.displayId);
            await viewCasePage.clickOnTab('Resources');
            await browser.sleep(2000); // hardwait to populate resource tab data
            expect(await resources.getAdvancedSearchResultForParticularSection(caseData.Summary)).toEqual(caseData.Summary);
            await resources.pinRecommendedKnowledgeArticles(1);
            expect(await resources.isFirstPinnedArticleDisplayed()).toBeTruthy();
            await viewCasePage.clickEditCaseButton();
            await editCasePo.setCaseSummary('Updated Summary' + randomStr);
            await editCasePo.clickSaveCase();
            expect(await resources.isFirstPinnedArticleDisplayed()).toBeTruthy();
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(createCaseResponse.displayId);
            await viewCasePage.clickOnTab('Resources');
            expect(await resources.isFirstPinnedArticleDisplayed()).toBeTruthy();
            await resources.unpinRecommendedKnowledgeArticles(1);
            expect(await resources.isFirstPinnedArticleDisplayed()).toBeFalsy();
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(createCaseResponse.displayId);
            await viewCasePage.clickOnTab('Resources');
            expect(await resources.isFirstPinnedArticleDisplayed()).toBeFalsy();
        });
        it('[DRDMV-1249,DRDMV-1250,DRDMV-1225,DRDMV-2695]:[Knowledge Article Search] Knowledge Articles are searched based on Case Summary and  in the Resources tab', async () => {
            await viewCasePage.clickEditCaseButton();
            await editCasePo.setCaseSummary("compensation" + "_" + randomStr);
            await editCasePo.clickSaveCase();
            await utilityCommon.closePopUpMessage();
            await viewCasePage.clickOnTab('Resources');
            expect(await resources.getAdvancedSearchResultForParticularSection("compensation" + "_" + randomStr)).toEqual("compensation" + "_" + randomStr);
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText("Knowledge Articles");
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.clickOnAdvancedSearchFiltersButton("Apply");
            await resources.pinRecommendedKnowledgeArticles(2);
            expect(await resources.getCountOfPinKnowledgeArticles()).toBe(2);
            await resources.clickPaginationNext();
            await resources.pinRecommendedKnowledgeArticles(2);
            expect(await resources.getCountOfPinKnowledgeArticles()).toBe(2);
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink("compensation" + "_" + randomStr);
            await viewCasePage.clickOnTab('Resources');
            expect(await resources.getCountOfPinKnowledgeArticles()).toBe(4);
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        });
    });

    describe('[DRDMV-620]: [Advanced Search] Advanced Search UI verification on the Knowledge Edit view', async () => {
        let articleData1, articleData2, articleData3, randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let currentDate = new Date();
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let dateFormateValue: string = months[currentDate.getMonth()];
        let dateFormate = dateFormateValue + " " + currentDate.getDate() + ", " + currentDate.getFullYear();
        let knowledgeArticleData1, knowledgeArticleData2, knowledgeArticleData3;
        beforeAll(async () => {
            await knowledgeConfigCreation();
        });
        it('[DRDMV-620]: Advanced Search UI verification on the Quick Case view', async () => {
            articleData1 = {
                "knowledgeSet": `${knowledgeSetTitleStr}`,
                "title": randomStr + 'KA1',
                "templateId": `${knowledgeTemplateId}`,
                "categoryTier1": "Workforce Administration",
                "region": "Central America",
                "site": "Mexico City",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United Kingdom Support",
                "assigneeSupportGroup": "GB Support 1",
                "assignee": "KMills"
            }
            articleData2 = {
                "knowledgeSet": `${knowledgeSetTitleStr}`,
                "title": randomStr + 'KA2',
                "templateId": `${knowledgeTemplateId}`,
                "categoryTier1": "Workforce Administration",
                "region": "EMEA",
                "site": "Barcelona 1",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United Kingdom Support",
                "assigneeSupportGroup": "GB Support 1",
                "assignee": "KMills"
            }
            articleData3 = {
                "knowledgeSet": `${knowledgeSetTitleStr}`,
                "title": randomStr + 'KA3',
                "templateId": `${knowledgeTemplateId}`,
                "categoryTier1": "Employee Relations",
                "region": "Australia",
                "site": "Canberra",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United Kingdom Support",
                "assigneeSupportGroup": "GB Support 1",
                "assignee": "KMills"
            }
            await apiHelper.apiLogin('qtao');
            knowledgeArticleData1 = await apiHelper.createKnowledgeArticle(articleData1);
            knowledgeArticleData2 = await apiHelper.createKnowledgeArticle(articleData2);
            knowledgeArticleData3 = await apiHelper.createKnowledgeArticle(articleData3);
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData1.id, 'Draft')).toBeTruthy('Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData2.id, 'Draft')).toBeTruthy('Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData3.id, 'Draft')).toBeTruthy('Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData1.id, 'PublishApproval')).toBeTruthy('Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData2.id, 'PublishApproval')).toBeTruthy('Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData3.id, 'PublishApproval')).toBeTruthy('Status Not Set');
        });
        it('[DRDMV-620]: Advanced Search UI verification on the Quick Case view', async () => {
            await navigationPage.signOut();
            await loginPage.login('kmills');
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(knowledgeArticleData1.displayId);
            await viewKnowledgeArticlePo.clickOnTab("Resources");
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText("Suggested Articles");
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            expect(await resources.isFilterAvailable('Status')).toBeTruthy();
            expect(await resources.isFilterAvailable('Knowledge Set')).toBeTruthy();
            expect(await resources.isFilterAvailable('Site')).toBeTruthy();
            expect(await resources.isFilterAvailable('Region')).toBeTruthy();
            expect(await resources.isFilterAvailable('Operational Category Tier 1')).toBeTruthy();
            let statusFieldValues: string[] = ["None", "Closed", "Retired", "Canceled", "In Progress", "Draft", "SME Review", "Published", "Publish Approval", "Retire Approval", "Request Cancelation"];
            expect(await resources.isAdvancedSearchFilterOptionDropDownValueDisplayed(statusFieldValues, 0)).toBeTruthy();
        });
        it('[DRDMV-620]: [Advanced Search] Advanced Search UI verification on the Knowledge Edit view', async () => {
            await viewKnowledgeArticlePo.clickOnTab("Resources");
            await resources.clickOnAdvancedSearchOptions();
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.enterAdvancedSearchText(articleData2.title);
            await resources.selectAdvancedSearchFilterOption('ArticleStatus', 'Published');
            await resources.clickOnAdvancedSearchFiltersButton('Apply');
            expect(await resources.getAdvancedSearchResultForParticularSection(articleData2.title)).toEqual(articleData2.title);
            await resources.clickOnAdvancedSearchFiltersButton('Clear');
            await resources.enterAdvancedSearchText(articleData3.title);
            await resources.selectAdvancedSearchFilterOption('Knowledge Set', `${knowledgeSetTitleStr}`);
            await resources.clickOnAdvancedSearchFiltersButton('Apply');
            expect(await resources.getAdvancedSearchResultForParticularSection(articleData3.title)).toEqual(articleData3.title);
            await resources.clickOnAdvancedSearchFiltersButton('Clear');
            await resources.enterAdvancedSearchText(articleData2.title);
            await resources.selectAdvancedSearchFilterOption('Region', 'EMEA');
            await resources.clickOnAdvancedSearchFiltersButton('Apply');
            expect(await resources.getAdvancedSearchResultForParticularSection(articleData2.title)).toEqual(articleData2.title);
            await resources.clickOnAdvancedSearchFiltersButton('Clear');
            await resources.enterAdvancedSearchText(articleData3.title);
            await resources.selectAdvancedSearchFilterOption('Site', 'Canberra');
            await resources.clickOnAdvancedSearchFiltersButton('Apply');
            expect(await resources.getAdvancedSearchResultForParticularSection(articleData3.title)).toEqual(articleData3.title);
            await resources.clickOnAdvancedSearchFiltersButton('Clear');
            await resources.enterAdvancedSearchText(articleData3.title);
            await resources.selectAdvancedSearchFilterOption('Operational Category Tier 1', 'Employee Relations');
            await resources.clickOnAdvancedSearchFiltersButton('Apply');
            expect(await resources.getAdvancedSearchResultForParticularSection(articleData3.title)).toEqual(articleData3.title);
            expect(await resources.getKnowledgeArticleInfo()).toContain(dateFormate, 'Date not correct');
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await resources.clickArrowFirstRecommendedKnowledge('Suggested Articles');
            expect(await previewKnowledgePo.getKnowledgeArticleTitle()).toContain(articleData3.title);
            expect(await previewKnowledgePo.isBackButtonDisplay()).toBeTruthy('back button not present');
            expect(await previewKnowledgePo.isStatusOfKADisplay()).toBeTruthy('Status not displaying');
            expect(await previewKnowledgePo.getKnowledgeArticleID()).toContain('KA-', 'KA ID not correct');
            await previewKnowledgePo.clickOnBackButton();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[DRDMV-623]: [Advanced Search] Advanced Search UI verification on the Case Edit view', async () => {
        let knowledgeArticleData, caseDisplayId: string, knowledgeArticleData1, articleData1, articleData2, articleData3, articleData4, articleData5, articleData6, randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let currentDate = new Date();
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let dateFormateValue: string = months[currentDate.getMonth()];
        let dateFormate = dateFormateValue + " " + currentDate.getDate() + ", " + currentDate.getFullYear();
        beforeAll(async () => {
            articleData1 = {
                "knowledgeSet": "HR",
                "title": randomStr + 'KA1',
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "categoryTier1": "Workforce Administration",
                "region": "Australia",
                "site": "Canberra",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United Kingdom Support",
                "assigneeSupportGroup": "GB Support 1",
                "assignee": "KMills"
            }
            articleData2 = {
                "knowledgeSet": "HR",
                "title": randomStr + 'KA2',
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "categoryTier1": "Workforce Administration",
                "region": "Central America",
                "site": "Mexico City",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United Kingdom Support",
                "assigneeSupportGroup": "GB Support 1",
                "assignee": "KMills"
            }
            articleData3 = {
                "knowledgeSet": "Benefits",
                "title": randomStr + 'KA3',
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "categoryTier1": "Workforce Administration",
                "region": "Australia",
                "site": "Canberra",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United Kingdom Support",
                "assigneeSupportGroup": "GB Support 1",
                "assignee": "KMills"
            }
            articleData4 = {
                "knowledgeSet": "HR",
                "title": randomStr + 'KA4',
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "categoryTier1": "Workforce Administration",
                "region": "EMEA",
                "site": "Barcelona 1",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United Kingdom Support",
                "assigneeSupportGroup": "GB Support 1",
                "assignee": "KMills"
            }
            articleData5 = {
                "knowledgeSet": "HR",
                "title": randomStr + 'KA5',
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "categoryTier1": "Employee Relations",
                "region": "Australia",
                "site": "Canberra",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United Kingdom Support",
                "assigneeSupportGroup": "GB Support 1",
                "assignee": "KMills"
            }
            articleData6 = {
                "knowledgeSet": "HR",
                "title": randomStr + 'KA6',
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "categoryTier1": "Workforce Administration",
                "region": "Australia",
                "site": "Canberra",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United Kingdom Support",
                "assigneeSupportGroup": "GB Support 1",
                "assignee": "KMills"
            }
            let caseData =
            {
                "Requester": "qtao",
                "Summary": randomStr + "caseName",
                "categoryTier1": "Purchasing Card",
                "categoryTier2": "Policies",
                "categoryTier3": "Card Issuance",
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
            }
            await apiHelper.apiLogin('qkatawazi');
            let newCase = await apiHelper.createCase(caseData);
            caseDisplayId = newCase.displayId;
            await apiHelper.apiLogin('elizabeth');
            await apiHelper.createKnowledgeArticle(articleData2);
            await apiHelper.createKnowledgeArticle(articleData3);
            await apiHelper.createKnowledgeArticle(articleData4);
            await apiHelper.createKnowledgeArticle(articleData5);
            knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData6);
            knowledgeArticleData1 = await apiHelper.createKnowledgeArticle(articleData1);
            let knowledgeArticleGUID = knowledgeArticleData1.id;
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'Draft')).toBeTruthy('Status Not Set');
        });
        it('[DRDMV-623]: [Advanced Search] Advanced Search UI verification on the Case Edit view', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseDisplayId);
            await viewCasePage.clickOnTab("Resources");
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText("Suggested Articles");
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            expect(await resources.isFilterAvailable('Status')).toBeTruthy();
            expect(await resources.isFilterAvailable('Knowledge Set')).toBeTruthy();
            expect(await resources.isFilterAvailable('Site')).toBeTruthy();
            expect(await resources.isFilterAvailable('Region')).toBeTruthy();
            expect(await resources.isFilterAvailable('Operational Category Tier 1')).toBeTruthy();
            let statusFieldValues: string[] = ["None", "Closed", "Retired", "Canceled", "In Progress", "Draft", "SME Review", "Published", "Publish Approval", "Retire Approval", "Request Cancelation"];
            expect(await resources.isAdvancedSearchFilterOptionDropDownValueDisplayed(statusFieldValues, 0)).toBeTruthy();
        });
        it('[DRDMV-623]: [Advanced Search] Advanced Search UI verification on the Case Edit view', async () => {
            await viewKnowledgeArticlePo.clickOnTab("Resources");
            await resources.clickOnAdvancedSearchOptions();
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.enterAdvancedSearchText(articleData1.title);
            await resources.selectAdvancedSearchFilterOption('ArticleStatus', 'Draft');
            await resources.clickOnAdvancedSearchFiltersButton('Apply');
            expect(await resources.getAdvancedSearchResultForParticularSection(articleData1.title)).toEqual(articleData1.title);
            await resources.clickOnAdvancedSearchFiltersButton('Clear');
            await resources.enterAdvancedSearchText(articleData3.title);
            await resources.selectAdvancedSearchFilterOption('Knowledge Set', 'Benefits');
            await resources.clickOnAdvancedSearchFiltersButton('Apply');
            expect(await resources.getAdvancedSearchResultForParticularSection(articleData3.title)).toEqual(articleData3.title);
            await resources.clickOnAdvancedSearchFiltersButton('Clear');
            await resources.enterAdvancedSearchText(articleData2.title);
            await resources.selectAdvancedSearchFilterOption('Region', 'Central America');
            await resources.clickOnAdvancedSearchFiltersButton('Apply');
            expect(await resources.getAdvancedSearchResultForParticularSection(articleData2.title)).toEqual(articleData2.title);
            await resources.clickOnAdvancedSearchFiltersButton('Clear');
            await resources.enterAdvancedSearchText(articleData4.title);
            await resources.selectAdvancedSearchFilterOption('Site', 'Barcelona 1');
            await resources.clickOnAdvancedSearchFiltersButton('Apply');
            expect(await resources.getAdvancedSearchResultForParticularSection(articleData4.title)).toEqual(articleData4.title);
            await resources.clickOnAdvancedSearchFiltersButton('Clear');
            await resources.enterAdvancedSearchText(articleData5.title);
            await resources.selectAdvancedSearchFilterOption('Operational Category Tier 1', 'Employee Relations');
            await resources.clickOnAdvancedSearchFiltersButton('Apply');
            expect(await resources.getAdvancedSearchResultForParticularSection(articleData5.title)).toEqual(articleData5.title);
            expect(await resources.getKnowledgeArticleInfo()).toContain(dateFormate, 'Date not correct');
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await resources.clickArrowFirstRecommendedKnowledge('Knowledge Articles');
            expect(await previewKnowledgePo.getKnowledgeArticleTitle()).toContain(articleData5.title);
            expect(await previewKnowledgePo.isBackButtonDisplay()).toBeTruthy('back button not present');
            expect(await previewKnowledgePo.isStatusOfKADisplay()).toBeTruthy('Status not displaying');
            expect(await previewKnowledgePo.getKnowledgeArticleID()).toContain('KA-', 'KA ID not correct');
            await previewKnowledgePo.clickOnBackButton();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[DRDMV-624]: Advanced Search UI verification on the Quick Case view', async () => {
        let articleData, kaDetails, randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let currentDate = new Date();
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let dateFormateValue: string = months[currentDate.getMonth()];
        let dateFormate = dateFormateValue + " " + currentDate.getDate() + ", " + currentDate.getFullYear();
        beforeAll(async () => {
            articleData = {
                "knowledgeSet": "HR",
                "title": 'knowledge3542' + randomStr,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "categoryTier1": "Workforce Administration",
                "region": "Australia",
                "site": "Canberra",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United States Support",
                "assigneeSupportGroup": "US Support 1",
                "assignee": "kayo"
            }
            await apiHelper.apiLogin('fritz');
            kaDetails = await apiHelper.createKnowledgeArticle(articleData);
            await apiHelper.createKnowledgeArticle(articleData);
            await apiHelper.createKnowledgeArticle(articleData);
            await apiHelper.createKnowledgeArticle(articleData);
            await apiHelper.createKnowledgeArticle(articleData);
            await apiHelper.createKnowledgeArticle(articleData);
        });
        it('[DRDMV-624]: Advanced Search UI verification on the Quick Case view', async () => {
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName("fritz");
            await quickCasePo.setCaseSummary(articleData.title);
            await utilCommon.waitUntilSpinnerToHide();
            await resources.clickOnAdvancedSearchOptions();
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            expect(await resources.isFilterAvailable('Status')).toBeTruthy();
            expect(await resources.isFilterAvailable('Knowledge Set')).toBeTruthy();
            expect(await resources.isFilterAvailable('Site')).toBeTruthy();
            expect(await resources.isFilterAvailable('Region')).toBeTruthy();
            expect(await resources.isFilterAvailable('Operational Category Tier 1')).toBeTruthy();
            let statusFieldValues: string[] = ["None", "Closed", "Retired", "Canceled", "In Progress", "Draft", "SME Review", "Published", "Publish Approval", "Retire Approval", "Request Cancelation"];
            expect(await resources.isAdvancedSearchFilterOptionDropDownValueDisplayed(statusFieldValues, 0)).toBeTruthy();
            await resources.clickOnAdvancedSearchFiltersButton('Apply');
        });
        it('[DRDMV-624]: Advanced Search UI verification on the Quick Case view', async () => {
            await quickCasePo.selectRequesterName("fritz");
            await quickCasePo.setCaseSummary(articleData.title);
            await utilCommon.waitUntilSpinnerToHide();
            await resources.clickOnAdvancedSearchOptions();
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.selectAdvancedSearchFilterOption('Status', 'In Progress');
            await resources.selectAdvancedSearchFilterOption('Knowledge Set', 'HR');
            await resources.selectAdvancedSearchFilterOption('Operational Category Tier 1', 'Workforce Administration');
            await resources.selectAdvancedSearchFilterOption('Region', 'Australia');
            await resources.selectAdvancedSearchFilterOption('Site', 'Canberra');
            await resources.clickOnAdvancedSearchFiltersButton('Apply');
            expect(await resources.getKnowledgeArticleInfo()).toContain(articleData.title, 'title not correct');
            expect(await resources.getKnowledgeArticleInfo()).toContain('Fritz Schulz', 'Author not correct');
            expect(await resources.getKnowledgeArticleInfo()).toContain('In Progress', 'status not correct');
            expect(await resources.getKnowledgeArticleInfo()).toContain(dateFormate, 'KA ID not correct');
            await resources.clickArrowFirstRecommendedKnowledge('Recommended Knowledge');
            expect(await previewKnowledgePo.getKnowledgeArticleTitle()).toContain(articleData.title);
            expect(await previewKnowledgePo.isBackButtonDisplay()).toBeTruthy('back button not present');
            expect(await previewKnowledgePo.isStatusOfKADisplay()).toBeTruthy('Status not displaying');
            expect(await previewKnowledgePo.getKnowledgeArticleID()).toContain('KA-', 'KA ID not correct');
            await previewKnowledgePo.clickOnBackButton();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[DRDMV-5064]: Article Reviewer Assignment notification for article moved to SME Review status', async () => {
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
                "assigneeSupportGroup": "GB Support 1",
                "assignee": "KMills"
            }
            await apiHelper.apiLogin('kWilliamson');
            knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData.id, "Draft")).toBeTruthy("Article with Draft status not updated.");
        });
        it('[DRDMV-5064]: Article Reviewer Assignment notification for article moved to SME Review status', async () => {
            await navigationPage.signOut();
            await loginPage.login('kWilliamson');
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr, 'title not correct');
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(knowledgeArticleData.displayId);
            expect(await editKnowledgePage.getStatusValue()).toContain('Draft', 'Status not Set');
            await statusBladeKnowledgeArticlePo.setKnowledgeStatusWithReviewerDetails('SME Review', 'Petramco', 'HR Support', 'Compensation and Benefits', 'Peter Kahn')
            expect(await editKnowledgePage.getStatusValue()).toContain('SME Review', 'Status not Set');
            expect(await viewKnowledgeArticlePo.isReviewMessageDisplayed('Knowledge Article is in Review')).toBeTruthy();
        });
        it('[DRDMV-5064]: Article Reviewer Assignment notification for article moved to SME Review status', async () => {
            await navigationPage.signOut();
            await loginPage.login('peter');
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr, 'title not correct');
            await utilityGrid.clearFilter();
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
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        });
    });

    describe('[DRDMV-8167]: [KM][Knowledge Article Console] Knowledge article search using filters', async () => {
        let knowledgeArticleData;
        let arr1: string[] = ["Assignee", "Assigned Group", "Template Name", "Knowledge Set", "Article ID"];
        let arr2: string[] = ["Company", "Reviewer", "GUID", "Author", "Review Status", "Article ID"];
        let arr3: string[] = ["Created Date", "Article ID", "Reviewer Group", "Title", "Status", "Flagged", "Modified Date"];
        beforeAll(async () => {
            await apiHelper.apiLogin('peter');
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
                "assigneeSupportGroup": "GB Support 1",
                "assignee": "KMills"
            }
            knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData.id, "Draft")).toBeTruthy("Article with Draft status not updated.");
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData.id, "SMEReview", "KMills", 'GB Support 2', 'Petramco')).toBeTruthy("Article with SME Review status not updated.");
        });
        it('[DRDMV-8167]: [KM][Knowledge Article Console] Knowledge article search using filters', async () => {
            await navigationPage.signOut();
            await loginPage.login('peter');
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr, 'title not correct');
            await utilityGrid.clearFilter();
            await knowledgeArticlesConsolePo.addColumnOnGrid(arr1);
            await knowledgeArticlesConsolePo.applyFilter('Assignee', "Kyle Mills", 'text');
            await utilityGrid.searchRecord(knowledgeArticleData.displayId);
            expect(await knowledgeArticlesConsolePo.getSelectedGridRecordValue('Assignee')).toContain("Kyle Mills", 'Filter Assignee is missing in column');
            await utilityGrid.clearFilter();
            await knowledgeArticlesConsolePo.applyFilter('Assigned Group', "GB Support 1", 'text');
            await utilityGrid.searchRecord(knowledgeArticleData.displayId);
            expect(await knowledgeArticlesConsolePo.getSelectedGridRecordValue('Assigned Group')).toBe("GB Support 1", 'Filter Assigned Group is missing in column');
            await utilityGrid.clearFilter();
            await knowledgeArticlesConsolePo.applyFilter('Template Name', "How To", 'text');
            await utilityGrid.searchRecord(knowledgeArticleData.displayId);
            expect(await knowledgeArticlesConsolePo.getSelectedGridRecordValue('Template Name')).toBe("How To", 'Filter Template Name is missing in column');
            await utilityGrid.clearFilter();
            await knowledgeArticlesConsolePo.applyFilter('Knowledge Set', "HR", 'text');
            await utilityGrid.searchRecord(knowledgeArticleData.displayId);
            expect(await knowledgeArticlesConsolePo.getSelectedGridRecordValue('Knowledge Set')).toBe("HR", 'Filter Knowledge Set is missing in column');
        });
        it('[DRDMV-8167]: [KM][Knowledge Article Console] Knowledge article search using filters', async () => {
            await utilityGrid.clearFilter();
            await knowledgeArticlesConsolePo.removeColumnOnGrid(arr1);
            await knowledgeArticlesConsolePo.addColumnOnGrid(arr2);
            await knowledgeArticlesConsolePo.applyFilter('Company', "Petramco", 'text');
            await utilityGrid.searchRecord(knowledgeArticleData.displayId);
            expect(await knowledgeArticlesConsolePo.getSelectedGridRecordValue('Company')).toBe("Petramco", 'Filter Company is missing in column');
            await utilityGrid.clearFilter();
            await knowledgeArticlesConsolePo.applyFilter('Reviewer', "Kyle Mills", 'text');
            await utilityGrid.searchRecord(knowledgeArticleData.displayId);
            expect(await knowledgeArticlesConsolePo.getSelectedGridRecordValue('Reviewer')).toBe("Kyle Mills", 'Filter Reviewer is missing in column');
            await utilityGrid.clearFilter();
            await knowledgeArticlesConsolePo.applyFilter('Author', "Peter Kahn", 'text');
            await utilityGrid.searchRecord(knowledgeArticleData.displayId);
            expect(await knowledgeArticlesConsolePo.getSelectedGridRecordValue('Author')).toBe("Peter Kahn", 'Filter Author is missing in column');
            await utilityGrid.clearFilter();
            await knowledgeArticlesConsolePo.applyFilter('Review Status', "Pending Review", 'checkbox');
            await utilityGrid.searchRecord(knowledgeArticleData.displayId);
            expect(await knowledgeArticlesConsolePo.getSelectedGridRecordValue('Review Status')).toBe("Pending Review", 'Filter Review Status is missing in column');
        });
        it('[DRDMV-8167]: [KM][Knowledge Article Console] Knowledge article search using filters', async () => {
            let finalDate: string = await utilCommon.getCurrentDate();
            let createdDate = new Date();
            let month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            let dateFormateValue: string = month[createdDate.getMonth()];
            let dateFormateNew: string = dateFormateValue.substring(0, 3);
            let dateFormate: string = dateFormateNew + " " + createdDate.getDate() + ", " + createdDate.getFullYear();
            await utilityGrid.clearFilter();
            await knowledgeArticlesConsolePo.removeColumnOnGrid(arr2);
            await knowledgeArticlesConsolePo.addColumnOnGrid(arr3);
            await knowledgeArticlesConsolePo.applyFilter('Article ID', knowledgeArticleData.displayId, 'text');
            await utilityGrid.searchRecord(knowledgeArticleData.displayId);
            expect(await knowledgeArticlesConsolePo.getSelectedGridRecordValue('Article ID')).toBe(knowledgeArticleData.displayId, 'Filter Article ID is missing in column');
            await utilityGrid.clearFilter();
            await knowledgeArticlesConsolePo.applyFilter('Reviewer Group', "GB Support 2", 'text');
            await utilityGrid.searchRecord(knowledgeArticleData.displayId);
            expect(await knowledgeArticlesConsolePo.getSelectedGridRecordValue('Reviewer Group')).toBe("GB Support 2", 'Filter Reviewer Group is missing in column');
            await utilityGrid.clearFilter();
            await knowledgeArticlesConsolePo.applyFilter('Title', "KnowledgeArticle", 'text');
            await utilityGrid.searchRecord(knowledgeArticleData.displayId);
            expect(await knowledgeArticlesConsolePo.getSelectedGridRecordValue('Title')).toBe("KnowledgeArticle", 'Filter Title is missing in column');
            await utilityGrid.clearFilter();
            await knowledgeArticlesConsolePo.applyFilter('Status', "SME Review", 'text');
            await utilityGrid.searchRecord(knowledgeArticleData.displayId);
            expect(await knowledgeArticlesConsolePo.getSelectedGridRecordValue('Status')).toBe("SME Review", 'Filter Status is missing in column');
            await utilityGrid.clearFilter();
            await knowledgeArticlesConsolePo.applyFilter('Created Date', finalDate, 'date');
            await utilityGrid.searchRecord(knowledgeArticleData.displayId);
            expect(await knowledgeArticlesConsolePo.getSelectedGridRecordValue('Created Date')).toContain(dateFormate, 'Filter Created Date is missing in column');
            await utilityGrid.clearFilter();
            await knowledgeArticlesConsolePo.applyFilter('Modified Date', finalDate, 'date');
            await utilityGrid.searchRecord(knowledgeArticleData.displayId);
            expect(await knowledgeArticlesConsolePo.getSelectedGridRecordValue('Modified Date')).toContain(dateFormate, 'Filter Modified Date is missing in column');
            await utilityGrid.searchAndOpenHyperlink(knowledgeArticleData.displayId);
            expect(await viewKnowledgeArticlePo.isFlagArticleOptionDisplayed()).toBeTruthy('Flag Article option is displayed.');
            await viewKnowledgeArticlePo.clickOnFlagButton();
            await flagUnflagKnowledgePo.setTextInTellUsMore(knowledgeArticleData.displayId);
            await flagUnflagKnowledgePo.clickOnFlageButtonOnBlade();
            await utilityCommon.closePopUpMessage();
            await navigationPage.gotoKnowledgeConsole(true);
            await utilityGrid.clearFilter();
            await knowledgeArticlesConsolePo.applyFilter('Flagged', "Yes", 'checkbox');
            await utilityGrid.searchRecord(knowledgeArticleData.displayId);
            expect(await knowledgeArticlesConsolePo.getSelectedGridRecordValue('Flagged')).toBe("Yes", 'Filter Flagged is missing in column');
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        });
    });

    describe('[DRDMV-766]: [Knowledge Article] Knowledge Article creation', async () => {
        let knowledgeArticleData;
        let articleData,randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            articleData = {
                "knowledgeSet": "HR",
                "title": "KnowledgeArticle" + randomStr,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "categoryTier1": "Applications",
                "categoryTier2": "Help Desk",
                "categoryTier3": "Incident",
                "region": "Australia",
                "site": "Canberra",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United Kingdom Support",
                "assigneeSupportGroup": "GB Support 1",
                "assignee": "KMills"
            }
            await apiHelper.apiLogin('kWilliamson');
            knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
        });
        it('[DRDMV-766]:[Knowledge Article] Knowledge Article creation', async () => {
            await navigationPage.signOut();
            await loginPage.login('kWilliamson');
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr, 'title not correct');
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(knowledgeArticleData.displayId);
            await viewKnowledgeArticlePo.clickOnEditLink();
            await editKnowledgePage.changeKnowledgeTitle("UpdatedKnowledgeArticle" + randomStr);
            await editKnowledgePage.clickOnSaveButtonOfKA();
            await navigationPage.gotoKnowledgeConsole(true);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink("UpdatedKnowledgeArticle" + randomStr);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleTitle()).toContain("UpdatedKnowledgeArticle" + randomStr, 'title not correct');
            expect(await viewKnowledgeArticlePo.getKnowledgeSet()).toBe('HR');
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleAuthor()).toBe('Kane Williamson');
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleCompany()).toBe('Petramco');
            expect(await viewKnowledgeArticlePo.getCategoryTier1Value()).toBe(articleData.categoryTier1);
            expect(await viewKnowledgeArticlePo.getCategoryTier2Value()).toBe(articleData.categoryTier2);
            expect(await viewKnowledgeArticlePo.getCategoryTier3Value()).toBe(articleData.categoryTier3);
            expect(await viewKnowledgeArticlePo.getRegionValue()).toBe(articleData.region);
            expect(await viewKnowledgeArticlePo.getSiteValue()).toBe(articleData.site);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleAssigneeGroupValue()).toBe('GB Support 1');
        });       
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        });
    });

    describe('[DRDMV-21674]:[UI] [KA Access] - UI behavior for adding/removing Access in knowledge article.', async () => {
        let knowledgeArticleData;
        let articleData,randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let businessData = businessDataFile['BusinessUnitData'];
        let departmentData = departmentDataFile['DepartmentData'];
        let suppGrpData = supportGrpDataFile['SuppGrpData'];
        beforeAll(async () => {
            articleData = {
                "knowledgeSet": "HR",
                "title": "KnowledgeArticle" + randomStr,
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
        });
        it('[DRDMV-21674]:[UI] [KA Access] - UI behavior for adding/removing Access in knowledge article.', async () => {
            await navigationPage.signOut();
            await loginPage.login('kWilliamson');
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr, 'title not correct');
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(knowledgeArticleData.displayId);
            expect(await knowledgeAccessPage.isKnowledgeAccessEntityAdded("GB Support 2")).toBeTruthy('FailuerMsg1: Support Group Name is missing');
            expect(await knowledgeAccessPage.isSupportGroupWriteAccessDisplayed("GB Support 2")).toBeTruthy('FailuerMsg1: Support Group Name is missing');
            await viewKnowledgeArticlePo.clickEditKnowledgeAccess();
            await knowledgeAccessPage.clickOnAccessButton('Support Group Access');
            await knowledgeAccessPage.selectCompany('Petramco');
            await knowledgeAccessPage.selectBusinessUnit(businessData.orgName);
            await knowledgeAccessPage.clickOnReadAccessAddButton("Add Business Unit");
            await knowledgeAccessPage.clickCloseKnowledgeAccessBlade();
            expect(await knowledgeAccessPage.isKnowledgeAccessEntityAdded(businessData.orgName)).toBeTruthy('FailuerMsg1: Support Group Name is missing');
            expect(await knowledgeAccessPage.isSupportGroupReadAccessDisplayed(businessData.orgName)).toBeTruthy('FailuerMsg1: Support Group Name is missing');
            await viewKnowledgeArticlePo.clickEditKnowledgeAccess();
            await knowledgeAccessPage.clickOnAccessButton('Support Group Access');
            await knowledgeAccessPage.selectCompany('Petramco');
            await knowledgeAccessPage.selectBusinessUnit(businessData.orgName);
            await knowledgeAccessPage.selectDepartment(departmentData.orgName);
            await knowledgeAccessPage.clickOnReadAccessAddButton("Add Support Department");    
            await knowledgeAccessPage.clickCloseKnowledgeAccessBlade();
            expect(await knowledgeAccessPage.isKnowledgeAccessEntityAdded(departmentData.orgName)).toBeTruthy('FailuerMsg1: Support Group Name is missing');
            expect(await knowledgeAccessPage.isSupportGroupReadAccessDisplayed(departmentData.orgName)).toBeTruthy('FailuerMsg1: Support Group Name is missing');
            await viewKnowledgeArticlePo.clickEditKnowledgeAccess();
            await knowledgeAccessPage.clickOnAccessButton('Support Group Access');
            await knowledgeAccessPage.selectCompany('Petramco');
            await knowledgeAccessPage.selectBusinessUnit(businessData.orgName);
            await knowledgeAccessPage.selectDepartment(departmentData.orgName);
            await knowledgeAccessPage.selectSupportGroup(suppGrpData.orgName);
            await knowledgeAccessPage.clickAddSupportGroupAccessButton();
            await knowledgeAccessPage.clickCloseKnowledgeAccessBlade();
            expect(await knowledgeAccessPage.isKnowledgeAccessEntityAdded(suppGrpData.orgName)).toBeTruthy('FailuerMsg1: Support Group Name is missing');
            expect(await knowledgeAccessPage.isSupportGroupReadAccessDisplayed(suppGrpData.orgName)).toBeTruthy('FailuerMsg1: Support Group Name is missing');
            await viewKnowledgeArticlePo.clickEditKnowledgeAccess();
            await knowledgeAccessPage.clickOnAccessButton('Agent Access');
            await knowledgeAccessPage.selectAgent('fnPerson lnPerson');
            await knowledgeAccessPage.clickCloseKnowledgeAccessBlade();
            expect(await knowledgeAccessPage.isKnowledgeAccessEntityAdded('fnPerson lnPerson')).toBeTruthy('FailuerMsg1: Support Group Name is missing');
            expect(await knowledgeAccessPage.isSupportGroupReadAccessDisplayed('fnPerson lnPerson')).toBeTruthy('FailuerMsg1: Support Group Name is missing');
        });
        it('[DRDMV-21674]:[UI] [KA Access] - UI behavior for adding/removing Access in knowledge article.', async () => {
            await viewKnowledgeArticlePo.clickEditKnowledgeAccess();
            await knowledgeAccessPage.clickRemoveKnowledgeAccess(businessData.orgName);
            await knowledgeAccessPage.clickKnowledgeAccessYesOption();
            await knowledgeAccessPage.clickRemoveKnowledgeAccess(departmentData.orgName);
            await knowledgeAccessPage.clickKnowledgeAccessYesOption();
            await knowledgeAccessPage.clickRemoveKnowledgeAccess(suppGrpData.orgName);
            await knowledgeAccessPage.clickKnowledgeAccessYesOption();
            await knowledgeAccessPage.clickCloseKnowledgeAccessBlade();
            expect(await knowledgeAccessPage.isKnowledgeAccessEntityAdded(businessData.orgName)).toBeFalsy('FailuerMsg1: Support Group Name is missing');
            expect(await knowledgeAccessPage.isKnowledgeAccessEntityAdded(departmentData.orgName)).toBeFalsy('FailuerMsg1: Support Group Name is missing');
            expect(await knowledgeAccessPage.isKnowledgeAccessEntityAdded(suppGrpData.orgName)).toBeFalsy('FailuerMsg1: Support Group Name is missing');
        });
        it('[DRDMV-21674]:[UI] [KA Access] - UI behavior for adding/removing Access in knowledge article.', async () => {           
            await viewKnowledgeArticlePo.clickEditKnowledgeAccess();
            await knowledgeAccessPage.clickOnAccessButton('Support Group Access');
            await knowledgeAccessPage.selectCompany('Petramco');
            await knowledgeAccessPage.selectBusinessUnit(businessData.orgName);
            await knowledgeAccessPage.clickOnWriteAccessAddButton("Add Business Unit");
            await knowledgeAccessPage.clickCloseKnowledgeAccessBlade();
            expect(await knowledgeAccessPage.isKnowledgeAccessEntityAdded(businessData.orgName)).toBeTruthy('FailuerMsg1: Support Group Name is missing');
            expect(await knowledgeAccessPage.isSupportGroupWriteAccessDisplayed(businessData.orgName)).toBeTruthy('FailuerMsg1: Support Group Name is missing');
            await viewKnowledgeArticlePo.clickEditKnowledgeAccess();
            await knowledgeAccessPage.clickOnAccessButton('Support Group Access');
            await knowledgeAccessPage.selectCompany('Petramco');
            await knowledgeAccessPage.selectBusinessUnit(businessData.orgName);
            await knowledgeAccessPage.selectDepartment(departmentData.orgName);
            await knowledgeAccessPage.clickOnWriteAccessAddButton("Add Support Department");    
            await knowledgeAccessPage.clickCloseKnowledgeAccessBlade();
            expect(await knowledgeAccessPage.isKnowledgeAccessEntityAdded(departmentData.orgName)).toBeTruthy('FailuerMsg1: Support Group Name is missing');
            expect(await knowledgeAccessPage.isSupportGroupWriteAccessDisplayed(departmentData.orgName)).toBeTruthy('FailuerMsg1: Support Group Name is missing');
            await viewKnowledgeArticlePo.clickEditKnowledgeAccess();
            await knowledgeAccessPage.clickOnAccessButton('Support Group Access');
            await knowledgeAccessPage.selectCompany('Petramco');
            await knowledgeAccessPage.selectBusinessUnit(businessData.orgName);
            await knowledgeAccessPage.selectDepartment(departmentData.orgName);
            await knowledgeAccessPage.selectSupportGroup(suppGrpData.orgName);
            await knowledgeAccessPage.clickOnWriteAccessAddButton("Add Support Group");
            await knowledgeAccessPage.clickCloseKnowledgeAccessBlade();
            expect(await knowledgeAccessPage.isKnowledgeAccessEntityAdded(suppGrpData.orgName)).toBeTruthy('FailuerMsg1: Support Group Name is missing');
            expect(await knowledgeAccessPage.isSupportGroupWriteAccessDisplayed(suppGrpData.orgName)).toBeTruthy('FailuerMsg1: Support Group Name is missing');
            await viewKnowledgeArticlePo.clickEditKnowledgeAccess();
            await knowledgeAccessPage.clickOnAccessButton('Agent Access');
            await knowledgeAccessPage.selectAgent('fnPerson lnPerson');
            await knowledgeAccessPage.clickCloseKnowledgeAccessBlade();
            expect(await knowledgeAccessPage.isKnowledgeAccessEntityAdded('fnPerson lnPerson')).toBeTruthy('FailuerMsg1: Support Group Name is missing');
            expect(await knowledgeAccessPage.isSupportGroupReadAccessDisplayed('fnPerson lnPerson')).toBeTruthy('FailuerMsg1: Support Group Name is missing');
        });
        it('[DRDMV-21674]:[UI] [KA Access] - UI behavior for adding/removing Access in knowledge article.', async () => {
            await viewKnowledgeArticlePo.clickEditKnowledgeAccess();
            await knowledgeAccessPage.clickRemoveKnowledgeAccess(businessData.orgName);
            await knowledgeAccessPage.clickKnowledgeAccessYesOption();
            await knowledgeAccessPage.clickRemoveKnowledgeAccess(departmentData.orgName);
            await knowledgeAccessPage.clickKnowledgeAccessYesOption();
            await knowledgeAccessPage.clickRemoveKnowledgeAccess(suppGrpData.orgName);
            await knowledgeAccessPage.clickKnowledgeAccessYesOption();
            await knowledgeAccessPage.clickCloseKnowledgeAccessBlade();
            expect(await knowledgeAccessPage.isKnowledgeAccessEntityAdded(businessData.orgName)).toBeFalsy('FailuerMsg1: Support Group Name is missing');
            expect(await knowledgeAccessPage.isKnowledgeAccessEntityAdded(departmentData.orgName)).toBeFalsy('FailuerMsg1: Support Group Name is missing');
            expect(await knowledgeAccessPage.isKnowledgeAccessEntityAdded(suppGrpData.orgName)).toBeFalsy('FailuerMsg1: Support Group Name is missing');
        });
        it('[DRDMV-21674]:[UI] [KA Access] - UI behavior for adding/removing Access in knowledge article.', async () => {
            await viewKnowledgeArticlePo.clickEditKnowledgeAccess();
            await knowledgeAccessPage.clickOnAccessButton('Support Group Access');
            await knowledgeAccessPage.selectCompany('Petramco');
            await knowledgeAccessPage.selectBusinessUnit('HR Support');
            await knowledgeAccessPage.selectSupportGroup('Employee Relations');
            await knowledgeAccessPage.clickOnAccessButton('Agent Access');
            await knowledgeAccessPage.selectAgent('Peter Kahn');
            await knowledgeAccessPage.clickCloseKnowledgeAccessBlade();
            expect(await knowledgeAccessPage.isKnowledgeAccessEntityAdded('Peter Kahn')).toBeTruthy('FailuerMsg1: Support Group Name is missing');
            await navigationPage.signOut();
            await loginPage.login('peter');
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr, 'title not correct');
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(knowledgeArticleData.displayId);
            await viewKnowledgeArticlePo.clickEditKnowledgeAccess();
            expect(await knowledgeAccessPage.isAccessBtnDisplayed('Support Group Access')).toBeFalsy('FailuerMsg1: Support Group Access is missing');
            expect(await knowledgeAccessPage.isAccessBtnDisplayed('Agent Access')).toBeFalsy('FailuerMsg1: Agent Access is missing');
            await knowledgeAccessPage.clickCloseKnowledgeAccessBlade();
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        });
    });

    describe('[DRDMV-753]:[Advanced Search] [Pin/Unpin] Relate Knowledge Article on Knowledge Edit view from Advanced search', async () => {
        it('[DRDMV-753]:[Advanced Search] Knowledge Creation', async () => {
            await apiHelper.apiLogin('qkatawazi');
            let articleData = {
                "knowledgeSet": "HR",
                "title": 'DRDMV-753 KnowledgeArticle_KA ' + randomStr,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United Kingdom Support",
                "assigneeSupportGroup": "GB Support 1",
                "assignee": "KMills"
            }
            kaDetails1 = await apiHelper.createKnowledgeArticle(articleData);
            let knowledgeArticleGUID1 = kaDetails1.id;
            articleData.title = 'DRDMV-753 KnowledgeArticle_KA ' + randomStr;
            kaDetails2 = await apiHelper.createKnowledgeArticle(articleData);
            let knowledgeArticleGUID2 = kaDetails2.id;
            articleData.title = 'DRDMV-753 KnowledgeArticle_KA ' + randomStr;
            kaDetails3 = await apiHelper.createKnowledgeArticle(articleData);
            let knowledgeArticleGUID3 = kaDetails3.id;
            articleData.title = 'DRDMV-753 KnowledgeArticle_KA ' + randomStr;
            kaDetails4 = await apiHelper.createKnowledgeArticle(articleData);
            let knowledgeArticleGUID4 = kaDetails4.id;
            articleData.title = 'DRDMV-753 KnowledgeArticle_KA ' + randomStr;
            kaDetails5 = await apiHelper.createKnowledgeArticle(articleData);
            let knowledgeArticleGUID5 = kaDetails5.id;
            articleData.title = 'DRDMV-753 KnowledgeArticle_KA ' + randomStr;
            kaDetails6 = await apiHelper.createKnowledgeArticle(articleData);
            let knowledgeArticleGUID6 = kaDetails6.id;
            articleData.title = 'DRDMV-753 KnowledgeArticle_KA ' + randomStr;
            kaDetails7 = await apiHelper.createKnowledgeArticle(articleData);
            let knowledgeArticleGUID7 = kaDetails7.id;
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID1, 'Draft')).toBeTruthy('Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID1, 'PublishApproval')).toBeTruthy('Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID2, 'Draft')).toBeTruthy('Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID2, 'PublishApproval')).toBeTruthy('Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID3, 'Draft')).toBeTruthy('Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID3, 'PublishApproval')).toBeTruthy('Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID4, 'Draft')).toBeTruthy('Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID4, 'PublishApproval')).toBeTruthy('Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID5, 'Draft')).toBeTruthy('Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID5, 'PublishApproval')).toBeTruthy('Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID6, 'Draft')).toBeTruthy('Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID6, 'PublishApproval')).toBeTruthy('Status Not Set');            
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID7, 'Draft')).toBeTruthy('Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID7, 'PublishApproval')).toBeTruthy('Status Not Set');            
            await browser.sleep(2000); // hardwait to populate resource tab data
        });
        it('[DRDMV-753]:[Advanced Search] [Pin/Unpin] Relate Knowledge Article on Knowledge Edit view from Advanced search', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(kaDetails2.displayId);
            await viewKnowledgeArticlePo.clickOnTab('Resources');
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText("DRDMV-753 KnowledgeArticle_KA");
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.clickOnAdvancedSearchFiltersButton("Apply");
            await resources.pinRecommendedKnowledgeArticles(1);
            expect(await resources.isFirstPinnedArticleDisplayed()).toBeTruthy();
        });
        it('[DRDMV-753]:[Advanced Search] [Pin/Unpin] Relate Knowledge Article on Knowledge Edit view from Advanced search', async () => {
            await navigationPage.gotoKnowledgeConsole(true);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(kaDetails2.displayId);
            await viewKnowledgeArticlePo.clickOnTab("Resources");
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText("DRDMV-753 KnowledgeArticle_KA");
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.clickOnAdvancedSearchFiltersButton("Apply");
            expect(await resources.isFirstPinnedArticleDisplayed()).toBeTruthy();
            await resources.pinRecommendedKnowledgeArticles(2);
            expect(await resources.getCountOfPinKnowledgeArticles()).toBe(3);
        });
        it('[DRDMV-753]:[Advanced Search] [Pin/Unpin] Relate Knowledge Article on Knowledge Edit view from Advanced search', async () => {
            await navigationPage.gotoKnowledgeConsole(true);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(kaDetails2.displayId);
            await viewKnowledgeArticlePo.clickOnTab('Resources');
            expect(await resources.getCountOfPinKnowledgeArticles()).toBe(3);
            await viewKnowledgeArticlePo.clickOnTab('Activity');
            await viewKnowledgeArticlePo.clickOnTab('Resources');
            expect(await resources.getCountOfPinKnowledgeArticles()).toBe(3);
            await resources.unpinRecommendedKnowledgeArticles(1);
            expect(await resources.isFirstPinnedArticleDisplayed()).toBeTruthy();
            await resources.unpinRecommendedKnowledgeArticles(1);
            expect(await resources.isFirstPinnedArticleDisplayed()).toBeTruthy();
            await resources.unpinRecommendedKnowledgeArticles(1);
            expect(await resources.isFirstPinnedArticleDisplayed()).toBeFalsy();
        });
        it('[DRDMV-753]:[Advanced Search] [Pin/Unpin] Relate Knowledge Article on Knowledge Edit view from Advanced search', async () => {
            await navigationPage.gotoKnowledgeConsole(true);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(kaDetails2.displayId);
            await viewKnowledgeArticlePo.clickOnTab("Resources");
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText("DRDMV-753 KnowledgeArticle_KA");
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.clickOnAdvancedSearchFiltersButton("Apply");
            await resources.pinRecommendedKnowledgeArticles(2);
            expect(await resources.getCountOfPinKnowledgeArticles()).toBe(2);
            await resources.clickPaginationNext();
            await resources.pinRecommendedKnowledgeArticles(1);
            expect(await resources.getCountOfPinKnowledgeArticles()).toBe(1);
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });
});

          