import { browser, protractor, ProtractorExpectedConditions } from "protractor";
import apiCoreUtil from '../../api/api.core.util';
import apiHelper from '../../api/api.helper';
import changeAssignmentBlade from "../../pageobject/common/change-assignment-blade.po";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import createKnowledgePage from "../../pageobject/knowledge/create-knowlege.po";
import editKnowledgePage from "../../pageobject/knowledge/edit-knowledge.po";
import feedbackBladeKnowledgeArticlePo from '../../pageobject/knowledge/feedback-blade-Knowledge-article.po';
import knowledgeArticlesConsolePo from '../../pageobject/knowledge/knowledge-articles-console.po';
import previewKnowledgePo from '../../pageobject/knowledge/preview-knowledge.po';
import reviewCommentsPo from '../../pageobject/knowledge/review-comments.po';
import statusBladeKnowledgeArticlePo from '../../pageobject/knowledge/status-blade-knowledge-article.po';
import viewKnowledgeArticlePo from '../../pageobject/knowledge/view-knowledge-article.po';
import activityTabPo from '../../pageobject/social/activity-tab.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

describe('Knowledge Article', () => {
    const EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    const businessDataFile = require('../../data/ui/foundation/businessUnit.ui.json');
    const departmentDataFile = require('../../data/ui/foundation/department.ui.json');
    const supportGrpDataFile = require('../../data/ui/foundation/supportGroup.ui.json');
    const personDataFile = require('../../data/ui/foundation/person.ui.json');
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
        await foundationData('Petramco');
        await foundationData19501('Petramco');
    });

    afterAll(async () => {
        // await apiHelper.apiLogin("tadmin");
        // let domainTag = await apiHelper.createDomainTag(domainTagDataFile['DomainTagData']);
        // await apiHelper.disableDomainTag(domainTag);
        // let domainTagPsilon = await apiHelper.createDomainTag(domainTagDataFile['DomainTagDataPsilon']);
        // await apiHelper.disableDomainTag(domainTagPsilon);
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

    it('[DRDMV-19020]: On Create KA, Assign to me button should process properly on KA', async () => {
        try {
            let suppGrpData = supportGrpDataFile['SuppGrpData'];
            let personData = personDataFile['PersonData'];
            let knowledgeDataFile = require("../../data/ui/knowledge/knowledgeArticle.ui.json")
            let knowledgeData = knowledgeDataFile['DRDMV-19020'];
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate(knowledgeData.TemplateName);
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeData.KnowledgeTitle);
            await createKnowledgePage.selectKnowledgeSet(knowledgeData.KnowledgeSet);
            await createKnowledgePage.clickAssignToMeButton();
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await previewKnowledgePo.clickGoToArticleButton();
            await editKnowledgePage.verifyKnowledgeMetadata('Assignee', 'Qadim Katawazi');
            await editKnowledgePage.verifyKnowledgeMetadata('Assigned Group', 'Compensation and Benefits');
        }
        catch (error) {
            throw error;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('peter');
        }
    });//, 190 * 1000);

    it('[DRDMV-19079]: Change Reviewer blade should process properly on KA', async () => {
        let businessData = businessDataFile['BusinessUnitData'];
        let departmentData = departmentDataFile['DepartmentData'];
        let suppGrpData = supportGrpDataFile['SuppGrpData'];
        let personData = personDataFile['PersonData'];
        let knowledgeDataFile = require("../../data/ui/knowledge/knowledgeArticle.ui.json")
        let knowledgeData = knowledgeDataFile['DRDMV-19079'];
        await navigationPage.gotoCreateKnowledge();
        await createKnowledgePage.clickOnTemplate(knowledgeData.TemplateName);
        await createKnowledgePage.clickOnUseSelectedTemplateButton();
        await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeData.KnowledgeTitle);
        await createKnowledgePage.selectKnowledgeSet(knowledgeData.KnowledgeSet);
        await createKnowledgePage.clickOnSaveKnowledgeButton();
        await previewKnowledgePo.clickGoToArticleButton();
        expect(await viewKnowledgeArticlePo.isEditLinkDisplayedOnKA()).toBeTruthy();
        await editKnowledgePage.setKnowledgeStatus(knowledgeData.DraftStatus);
        await utilityCommon.closePopUpMessage();
        await editKnowledgePage.setKnowledgeStatusWithoutSave(knowledgeData.ReviewStatus);
        await utilityCommon.closePopUpMessage();
        expect(await editKnowledgePage.isReviewerCompanyFieldDisbaledOnStatusChangeBlade()).toBeTruthy();
        expect(await editKnowledgePage.isReviewerBusinessUnitFieldDisbaledOnStatusChangeBlade()).toBeTruthy();
        expect(await editKnowledgePage.isReviewerDepartmentfieldDisbaledOnStatusChangeBlade()).toBeTruthy();
        expect(await editKnowledgePage.isReviewerGrpFieldDisbaledOnStatusChangeBlade()).toBeTruthy();
        expect(await editKnowledgePage.isReviewerFieldDisbaledOnStatusChangeBlade()).toBeTruthy();
        expect(await statusBladeKnowledgeArticlePo.isChangeReviewerButtonPresent()).toBeTruthy();
        expect(await editKnowledgePage.isAssignToMeReviewerBladePresent()).toBeTruthy();
        await statusBladeKnowledgeArticlePo.clickChangeReviewerBtn();
        await changeAssignmentBlade.selectCompany(knowledgeData.Company);
        await changeAssignmentBlade.selectBusinessUnit(businessData.orgName);
        await changeAssignmentBlade.selectDepartment(departmentData.orgName);
        await changeAssignmentBlade.selectSupportGroup(suppGrpData.orgName);
        await changeAssignmentBlade.selectAssignee(personData.firstName);
        await changeAssignmentBlade.clickOnAssignButton();
        await editKnowledgePage.clickSaveStatusBtn();
        await utilityCommon.closePopUpMessage();
        await editKnowledgePage.isReviewPendingButtonDisplayed();
    });

    it('[DRDMV-19080]: On Edit KA, Change Assignment blade should process properly ', async () => {
        let businessData = businessDataFile['BusinessUnitData'];
        let departmentData = departmentDataFile['DepartmentData'];
        let suppGrpData = supportGrpDataFile['SuppGrpData'];
        let personData = personDataFile['PersonData'];
        let knowledgeDataFile = require("../../data/ui/knowledge/knowledgeArticle.ui.json")
        let knowledgeData = knowledgeDataFile['DRDMV-19080'];
        await navigationPage.gotoCreateKnowledge();
        await createKnowledgePage.clickOnTemplate(knowledgeData.TemplateName);
        await createKnowledgePage.clickOnUseSelectedTemplateButton();
        await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeData.KnowledgeTitle);
        await createKnowledgePage.selectKnowledgeSet(knowledgeData.KnowledgeSet);
        await createKnowledgePage.clickOnSaveKnowledgeButton();
        await previewKnowledgePo.clickGoToArticleButton();
        expect(await viewKnowledgeArticlePo.isEditLinkDisplayedOnKA()).toBeTruthy();
        await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
        await editKnowledgePage.clickChangeAssignmentButton();
        await changeAssignmentBlade.isCompanyDrpDwnDisplayed();
        await changeAssignmentBlade.isBuisnessUnitDrpDwnDisplayed();
        await changeAssignmentBlade.isDepartmentDrpDwnDisplayed();
        await expect(changeAssignmentBlade.isAssignButtonDisabled()).toBeTruthy();
        await changeAssignmentBlade.selectCompany(knowledgeData.Company);
        await changeAssignmentBlade.selectBusinessUnit(businessData.orgName);
        await changeAssignmentBlade.selectDepartment(departmentData.orgName);
        await changeAssignmentBlade.selectSupportGroup(suppGrpData.orgName);
        await changeAssignmentBlade.selectAssignee(personData.firstName);
        await changeAssignmentBlade.clickOnAssignButton();
        await editKnowledgePage.saveKnowledgeMedataDataChanges();
        let assigneeFullName = personData.firstName + " " + personData.lastName;
        await editKnowledgePage.verifyKnowledgeMetadata('Assignee', assigneeFullName);
        await editKnowledgePage.verifyKnowledgeMetadata('Assigned Group', suppGrpData.orgName);
    });//, 240 * 1000);

    it('[DRDMV-19081]: Assignment fields is not available on Status Change blade except when Status= SME Review', async () => {
        let knowledgeDataFile = require("../../data/ui/knowledge/knowledgeArticle.ui.json")
        let knowledgeData = knowledgeDataFile['DRDMV-19081'];
        await navigationPage.gotoCreateKnowledge();
        await createKnowledgePage.clickOnTemplate(knowledgeData.TemplateName);
        await createKnowledgePage.clickOnUseSelectedTemplateButton();
        await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeData.KnowledgeTitle);
        await createKnowledgePage.selectKnowledgeSet(knowledgeData.KnowledgeSet);
        await createKnowledgePage.clickOnSaveKnowledgeButton();
        await previewKnowledgePo.clickGoToArticleButton();
        expect(await viewKnowledgeArticlePo.isEditLinkDisplayedOnKA()).toBeTruthy();
        await editKnowledgePage.setKnowledgeStatusWithoutSave('Draft');
        expect(await editKnowledgePage.isAssignToMeReviewerBladePresent()).toBeFalsy();
        await editKnowledgePage.clickSaveStatusBtn();
        await utilityCommon.closePopUpMessage();
        await editKnowledgePage.setKnowledgeStatusWithoutSave('SME Review');
        expect(await editKnowledgePage.isAssignToMeReviewerBladePresent()).toBeTruthy();
        await editKnowledgePage.clickCancelStatusBtn();
        await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        await editKnowledgePage.setKnowledgeStatus('Publish Approval');
        await utilityCommon.closePopUpMessage();
        await utilityCommon.closePopUpMessage();
        await editKnowledgePage.setKnowledgeStatusWithoutSave('Published');
        expect(await editKnowledgePage.isAssignToMeReviewerBladePresent()).toBeFalsy();
        await editKnowledgePage.clickCancelStatusBtn();
        await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        await editKnowledgePage.setKnowledgeStatus('Retire Approval');
        await utilityCommon.closePopUpMessage();
        await utilityCommon.closePopUpMessage();
        await editKnowledgePage.setClosedKnowledgeStatusWithoutSave('Retired');
        expect(await editKnowledgePage.isAssignToMeReviewerBladePresent()).toBeFalsy();
        await editKnowledgePage.clickCancelStatusBtn();
        await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        await editKnowledgePage.setClosedKnowledgeStatusWithoutSave('Closed');
        expect(await editKnowledgePage.isAssignToMeReviewerBladePresent()).toBeFalsy();
        await editKnowledgePage.clickCancelStatusBtn();
        await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
    });

    it('[DRDMV-19508]: On Create KA, Change Assignment blade should process properly', async () => {
        let businessData = businessDataFile['BusinessUnitData'];
        let departmentData = departmentDataFile['DepartmentData'];
        let suppGrpData = supportGrpDataFile['SuppGrpData'];
        let personData = personDataFile['PersonData'];
        let knowledgeDataFile = require("../../data/ui/knowledge/knowledgeArticle.ui.json")
        let knowledgeData = knowledgeDataFile['DRDMV-19508'];
        await navigationPage.gotoCreateKnowledge();
        await createKnowledgePage.clickOnTemplate(knowledgeData.TemplateName);
        await createKnowledgePage.clickOnUseSelectedTemplateButton();
        await createKnowledgePage.clickChangeAssignmentButton();
        expect(await changeAssignmentBlade.isCompanyDrpDwnDisplayed()).toBeTruthy("Company dropdown not displayed");
        expect(await changeAssignmentBlade.isSupportGroupDrpDwnDisplayed()).toBeTruthy("SupportGroup dropdown not displayed");
        expect(await changeAssignmentBlade.isSearchInputBoxPresent()).toBeTruthy("Search Box not present");
        expect(await changeAssignmentBlade.isAssignToMeCheckBoxSelected()).toBeFalsy("AssignToMe checkbox shouldbe unchecked");
        await expect(changeAssignmentBlade.isAssignButtonDisabled()).toBeTruthy();
        await changeAssignmentBlade.selectCompany(knowledgeData.Company);
        await changeAssignmentBlade.selectBusinessUnit(businessData.orgName);
        await changeAssignmentBlade.selectDepartment(departmentData.orgName);
        await changeAssignmentBlade.selectSupportGroup(suppGrpData.orgName);
        await changeAssignmentBlade.selectAssignee(personData.firstName);
        await changeAssignmentBlade.clickOnAssignButton();
    });

    async function foundationData19501(company: string) {
        await apiHelper.apiLogin('tadmin');
        let businessData = businessDataFile['BusinessUnitData19501'];
        let departmentData = departmentDataFile['DepartmentData19501'];
        let suppGrpData = supportGrpDataFile['SuppGrpData19501'];
        let personData = personDataFile['PersonData'];   //Associate the existing person to new orgs
        let orgId = await apiCoreUtil.getOrganizationGuid(company);
        businessData.relatedOrgId = orgId;
        let businessUnitId = await apiHelper.createBusinessUnit(businessData);
        departmentData.relatedOrgId = businessUnitId;
        let depId = await apiHelper.createDepartment(departmentData);
        suppGrpData.relatedOrgId = depId;
        await apiHelper.createSupportGroup(suppGrpData);
        await apiHelper.associatePersonToSupportGroup(personData.userId, suppGrpData.orgName);
        await apiHelper.associatePersonToCompany(personData.userId, company)
    }

    it('[DRDMV-19501]: On Create KA, Agent having access to multiple support groups on "Assign to me" click should process properly on KA', async () => {
        try {
            let businessData2 = businessDataFile['BusinessUnitData19501'];
            let departmentData2 = departmentDataFile['DepartmentData19501'];
            let suppGrpData2 = supportGrpDataFile['SuppGrpData19501'];
            let personData = personDataFile['PersonData'];  //This person is associated to 2 given support grps as created is beforeall method
            let knowledgeDataFile = require("../../data/ui/knowledge/knowledgeArticle.ui.json")
            let knowledgeData = knowledgeDataFile['DRDMV-19501'];
            await navigationPage.signOut();
            await loginPage.login(personData.userId + "@petramco.com", 'Password_1234');
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate(knowledgeData.TemplateName);
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeData.KnowledgeTitle);
            await createKnowledgePage.selectKnowledgeSet(knowledgeData.KnowledgeSet);
            expect(await createKnowledgePage.isAssignmentFieldDisabled('Assigned Company')).toBeTruthy('Assign Field is enabled');
            expect(await createKnowledgePage.isAssignmentFieldDisabled('Business Unit')).toBeTruthy('Assign Field is enabled');
            expect(await createKnowledgePage.isAssignmentFieldDisabled('Department')).toBeTruthy('Assign Field is enabled');
            expect(await createKnowledgePage.isAssignmentFieldDisabled('Assigned Group')).toBeTruthy('Assign Field is enabled');
            expect(await createKnowledgePage.isAssignmentFieldDisabled('Assigned To')).toBeTruthy('Assign Field is enabled');
            await createKnowledgePage.clickAssignToMeButton();
            expect(await changeAssignmentBlade.getCountOfSupportGroup()).toBeGreaterThanOrEqual(2);
            await changeAssignmentBlade.clickOnSupportGroup('UI-SupportGroup-19501');
            await changeAssignmentBlade.clickOnAssignButton();
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await previewKnowledgePo.clickGoToArticleButton();
        }
        catch (error) {
            throw error;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('peter');
        }
    });

    it('[DRDMV-799,DRDMV-788]: [KM-BWF integration] [Knowledge Article] Mandatory fields of the Create Knowledge Article view', async () => {
        try {
            const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let knowledgeTitle: string = 'Knowledge Template' + randomStr;
            await navigationPage.signOut();
            await loginPage.login('peter');
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate('Reference');
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await expect(createKnowledgePage.isKnowledgeTitleRequired()).toBeTruthy(" Required Text is not present in knowledge title");
            await expect(createKnowledgePage.isKnowledgeSetRequired()).toBeTruthy("Required Text is not present in knowledge Set");
            await expect(createKnowledgePage.isSaveButtonEnabled());
            await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeTitle);
            await createKnowledgePage.selectKnowledgeSet('HR');
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            var knowledgeIdValue: string = await previewKnowledgePo.getKnowledgeArticleID();
            await utilityCommon.refresh();
            await navigationPage.gotoKnowledgeConsole();
            await utilityGrid.clearFilter();
            await knowledgeArticlesConsolePo.searchKnowledgeArticle(knowledgeTitle);
            await expect(knowledgeArticlesConsolePo.isArticleIdDisplayed(knowledgeIdValue.trim())).toBeTruthy("Knowledge Article is not displayed");
        } catch (error) {
            throw error;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('peter');
        }
    });//, 170 * 1000);
   
    it('[DRDMV-5058]: Review article in SME Review status & Approve article', async () => {
        try {
            let knowledgeTitile = 'knowledge5058' + randomStr;
            await apiHelper.apiLogin(knowledgePublisherUser);
            let articleData = {
                "knowledgeSet": "HR",
                "title": `${knowledgeTitile}`,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United Kingdom Support",
                "assigneeSupportGroup": "GB Support 1",
                "assignee": "KMills"
            }
            let KADetails = await apiHelper.createKnowledgeArticle(articleData);
            expect(await apiHelper.updateKnowledgeArticleStatus(KADetails.id, "Draft")).toBeTruthy("Article with Draft status not updated.");
            expect(await apiHelper.updateKnowledgeArticleStatus(KADetails.id, "SMEReview", "KMills", "GB Support 2", "Petramco")).toBeTruthy("Article with SME Review status not updated.");
            await navigationPage.signOut();
            await loginPage.login('kmills');
            await navigationPage.switchToApplication(knowledgeManagementApp);
            await utilityCommon.switchToNewTab(1);
            await utilityGrid.clearFilter();
            let knowledgeGridColumnFields: string[] = ["Review Status"];
            let columnName: string[] = ["Review Status"];
            await knowledgeArticlesConsolePo.addColumnOnGrid(knowledgeGridColumnFields)
            await utilityGrid.addFilter('Review Status', 'Pending Review', 'checkbox');
            await utilityGrid.searchAndOpenHyperlink(KADetails.displayId);
            expect(await viewKnowledgeArticlePo.isReviewMessageDisplayed('Knowledge Article is in Review')).toBeTruthy('article review not set');
            await viewKnowledgeArticlePo.clickReviewPendingLink();
            expect(await reviewCommentsPo.isCancelButtonDisplay()).toBeTruthy('Cancel button not present');
            expect(await reviewCommentsPo.isApprovedButtonDisplay()).toBeTruthy('Approved button not present');
            expect(await reviewCommentsPo.isRejectedButtonDisplay()).toBeTruthy('Rejected button not present');
            expect(await reviewCommentsPo.isTellUsMoreDisplayed()).toBeTruthy('Tell us more not present');
            await reviewCommentsPo.setTextInTellUsMore(knowledgeTitile);
            await reviewCommentsPo.clickApprovedButton();
            await utilityCommon.closePopUpMessage();
            await utilityCommon.closePopUpMessage();
            expect(await viewKnowledgeArticlePo.getStatusValue()).toContain('Published', 'value is not matched with status')
            await viewKnowledgeArticlePo.clickOnTab('Activity');
            expect(await activityTabPo.getFirstPostContent()).toContain('Kyle Mills reviewed this article and provided this comment');
            expect(await activityTabPo.getFirstPostContent()).toContain(knowledgeTitile)
            await navigationPage.gotoKnoweldgeConsoleFromKM();
            await utilityGrid.clearFilter();
            await utilityGrid.searchRecord(KADetails.displayId);
            expect(await knowledgeArticlesConsolePo.isValueDisplayedInGrid('Review Status')).toContain('Reviewed');
            await knowledgeArticlesConsolePo.removeColumnOnGrid(columnName);
        }
        catch (e) {
            throw e;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('peter');
        }
    });//, 150 * 1000);

    it('[DRDMV-5059]: Review article in SME Review status & Reject article', async () => {
        try {
            let knowledgeTitile = 'knowledge5059' + randomStr;
            await apiHelper.apiLogin(knowledgePublisherUser);
            let articleData = {
                "knowledgeSet": "HR",
                "title": `${knowledgeTitile}`,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United Kingdom Support",
                "assigneeSupportGroup": "GB Support 1",
                "assignee": "KMills"
            }
            let KADetails = await apiHelper.createKnowledgeArticle(articleData);
            expect(await apiHelper.updateKnowledgeArticleStatus(KADetails.id, "Draft")).toBeTruthy("Article with Draft status not updated.");
            expect(await apiHelper.updateKnowledgeArticleStatus(KADetails.id, "SMEReview", "KMills", "GB Support 2", "Petramco")).toBeTruthy("Article with SME Review status not updated.");
            await navigationPage.signOut();
            await loginPage.login('kmills');
            await navigationPage.switchToApplication(knowledgeManagementApp);
            await utilityCommon.switchToNewTab(1);
            await utilityGrid.clearFilter();
            let knowledgeGridColumnFields: string[] = ["Review Status"];
            let columnName: string[] = ["Review Status"];
            await knowledgeArticlesConsolePo.addColumnOnGrid(knowledgeGridColumnFields)
            await utilityGrid.addFilter('Review Status', 'Pending Review', 'checkbox');
            await utilityGrid.searchAndOpenHyperlink(KADetails.displayId);
            expect(await viewKnowledgeArticlePo.isReviewMessageDisplayed('Knowledge Article is in Review')).toBeTruthy('article review not set');
            await viewKnowledgeArticlePo.clickReviewPendingLink();
            expect(await reviewCommentsPo.isCancelButtonDisplay()).toBeTruthy('Cancel button not present');
            expect(await reviewCommentsPo.isApprovedButtonDisplay()).toBeTruthy('Approved button not present');
            expect(await reviewCommentsPo.isRejectedButtonDisplay()).toBeTruthy('Rejected button not present');
            expect(await reviewCommentsPo.isTellUsMoreDisplayed()).toBeTruthy('Tell us more not present');
            await reviewCommentsPo.setTextInTellUsMore(knowledgeTitile);
            await reviewCommentsPo.clickRejectedButton();
            await utilityCommon.closePopUpMessage();
            expect(await viewKnowledgeArticlePo.getStatusValue()).toContain('Draft', 'value is not matched with status')
            await viewKnowledgeArticlePo.clickOnTab('Activity');
            expect(await activityTabPo.getFirstPostContent()).toContain('Kyle Mills reviewed this article and provided this comment');
            expect(await activityTabPo.getFirstPostContent()).toContain(knowledgeTitile)
            await navigationPage.gotoKnoweldgeConsoleFromKM();
            await utilityGrid.clearFilter();
            await utilityGrid.searchRecord(KADetails.displayId);
            expect(await knowledgeArticlesConsolePo.isValueDisplayedInGrid('Review Status')).toContain('Reviewed');
            await knowledgeArticlesConsolePo.removeColumnOnGrid(knowledgeGridColumnFields);
        }
        catch (e) {
            throw e;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('peter');
        }
    });//, 150 * 1000);

    it('[DRDMV-2433]: Assign SME - Reviewer assignment UI validation', async () => {
        try {
            let knowledgeTitile = 'knowledge2433' + randomStr;
            await apiHelper.apiLogin(knowledgePublisherUser);
            let articleData = {
                "knowledgeSet": "HR",
                "title": `${knowledgeTitile}`,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United Kingdom Support",
                "assigneeSupportGroup": "GB Support 1",
                "assignee": "KMills"
            }
            let KADetails = await apiHelper.createKnowledgeArticle(articleData);
            expect(await apiHelper.updateKnowledgeArticleStatus(KADetails.id, "Draft")).toBeTruthy("Article with Draft status not updated.");
            await navigationPage.signOut();
            await loginPage.login('kmills');
            await navigationPage.switchToApplication(knowledgeManagementApp);
            await utilityCommon.switchToNewTab(1);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(KADetails.displayId);
            await statusBladeKnowledgeArticlePo.setKnowledgeStatusWithReviewerDetails('SME Review', 'Petramco', 'HR Support', 'Compensation and Benefits', 'Peter Kahn');
            await utilityCommon.closePopUpMessage();
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            expect(await editKnowledgePage.getKnowledgeReviewHeader()).toContain('Knowledge Review');
            expect(await editKnowledgePage.isReviewerFieldDisabledInEdit()).toBeTruthy('Reviwer field is enabled');
            expect(await editKnowledgePage.isReviewerGroupFieldDisabledInEdit()).toBeTruthy('Reviwer Group field is enabled');
            await editKnowledgePage.clickChangeReviewerBtn();
            await changeAssignmentBlade.selectCompany('Petramco');
            await changeAssignmentBlade.selectBusinessUnit('Australia Support');
            await changeAssignmentBlade.selectSupportGroup('AU Support 3');
            await changeAssignmentBlade.selectAssignee('Kane Williamson');
            await changeAssignmentBlade.clickOnAssignButton();
            expect(await editKnowledgePage.getReviewerValue()).toContain('Kane Williamson', 'Reviewer not matched with expected');
            await editKnowledgePage.saveKnowledgeMedataDataChanges();
            await utilityCommon.closePopUpMessage();
        }
        catch (e) {
            throw e;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('peter');
        }
    });

    it('[DRDMV-1914]: [Article Creation] Ability to select the knowledge set during article creation', async () => {
        let knowledgeTitle = 'knowledgeCoachUser1914' + randomStr;
        await navigationPage.gotoKnowledgeConsole();
        await navigationPage.gotoCreateKnowledge();
        expect(await createKnowledgePage.isTemplatePresent('KCS')).toBeTruthy('Template is not present');
        expect(await createKnowledgePage.isTemplatePresent('Reference')).toBeTruthy('Template is not present');
        expect(await createKnowledgePage.isTemplatePresent('How To')).toBeTruthy('Template is not present');
        await createKnowledgePage.clickOnTemplate('Reference');
        await createKnowledgePage.clickOnUseSelectedTemplateButton();
        await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeTitle);
        await createKnowledgePage.selectRegionDropDownOption('Australia');
        await createKnowledgePage.selectSiteDropDownOption('Melbourne');
        await createKnowledgePage.selectCategoryTier1Option('Applications');
        await createKnowledgePage.selectCategoryTier2Option('Help Desk');
        await createKnowledgePage.selectCategoryTier3Option('Incident');
        await createKnowledgePage.setReferenceValue('reference values are as follows');
        expect(await createKnowledgePage.getKnowledgeArticleTitleValue()).toContain(knowledgeTitle, 'expected Value not present');
        expect(await createKnowledgePage.getValueOfCategoryTier1()).toContain('Applications', 'value not matched with expected');
        expect(await createKnowledgePage.getValueOfCategoryTier2()).toContain('Help Desk', 'value not matched with expected');
        expect(await createKnowledgePage.getValueOfCategoryTier3()).toContain('Incident', 'value not matched with expected');
        expect(await createKnowledgePage.isSaveButtonEnabled()).toBeFalsy('Save Button is enabled');
        await createKnowledgePage.selectKnowledgeSet('HR');
        expect(await createKnowledgePage.getKnowledgeSetValue()).toContain('HR', 'expected Value not present');
        expect(await createKnowledgePage.isSaveButtonEnabled()).toBeTruthy('Save Button is disabled');
        await createKnowledgePage.clickOnSaveKnowledgeButton();
        await utilityCommon.refresh();
        await navigationPage.gotoKnowledgeConsole();
        await utilityGrid.clearFilter();
        await utilityGrid.searchRecord(knowledgeTitle);
        expect(await knowledgeArticlesConsolePo.isValueDisplayedInGrid('Knowledge Set')).toContain('HR', 'HR not display on Knowledge Console');
    });

    it('[DRDMV-1783]: [Knowledge Article] Access to the Create Knowledge view (Negative)', async () => {
        try {
            await navigationPage.signOut();
            await loginPage.login('sbadree');
            await navigationPage.switchToApplication(knowledgeManagementApp);
            await utilityCommon.switchToNewTab(1);
            expect(await knowledgeArticlesConsolePo.getMessageOfAccess()).toContain('You do not have access to the Knowledge management application.');
        }
        catch (e) {
            throw e;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('peter');
        }
    });//, 160 * 1000);

    it('[DRDMV-2887]: [Knowledge Article] Adding/Modifying location data while creating knowledge articles - site, region', async () => {
        try {
            let knowledgeTitle = 'knowledge2887' + randomStr;
            await navigationPage.gotoKnowledgeConsole();
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate('Reference');
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeTitle);
            await createKnowledgePage.selectKnowledgeSet('HR');
            await createKnowledgePage.selectRegionDropDownOption('Australia');
            await createKnowledgePage.selectSiteDropDownOption('Melbourne');
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await previewKnowledgePo.clickGoToArticleButton();
            expect(await viewKnowledgeArticlePo.getRegionValue()).toBe('Australia');
            expect(await viewKnowledgeArticlePo.getSiteValue()).toBe('Melbourne');
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            await editKnowledgePage.selectRegionDropDownOption('EMEA');
            await editKnowledgePage.selectSiteDropDownOption('Barcelona 1');
            await editKnowledgePage.saveKnowledgeMedataDataChanges();
            await utilityCommon.closePopUpMessage();
            expect(await viewKnowledgeArticlePo.getRegionValue()).toBe('EMEA');
            expect(await viewKnowledgeArticlePo.getSiteValue()).toBe('Barcelona 1');
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            await editKnowledgePage.removeRegionValue();
            await editKnowledgePage.removeSiteValue();
            await editKnowledgePage.saveKnowledgeMedataDataChanges();
            expect(await viewKnowledgeArticlePo.getRegionValue()).toBe('-');
            expect(await viewKnowledgeArticlePo.getSiteValueAfterClear()).toBe('-');
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate('Reference');
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            let knowledgeNewTitle = 'knowledgeNew2887' + randomStr;
            await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeNewTitle);
            await createKnowledgePage.selectKnowledgeSet('HR');
            await createKnowledgePage.selectRegionDropDownOption('Australia');
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await previewKnowledgePo.clickGoToArticleButton();
            await viewKnowledgeArticlePo.isEditLinkDisplayedOnKA();
            expect(await viewKnowledgeArticlePo.getRegionValue()).toBe('Australia');
        }
        catch (e) {
            throw e;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('peter');
        }
    });//, 150 * 1000);

    describe('[DRDMV-1152]: [Permissions] Settings menu for Knowledge Functional Roles', () => {
        it('[DRDMV-1152]: [Permissions] Settings menu for Knowledge Functional Roles', async () => {
            //Validation of Knowledge Coach Settings Permission
            await navigationPage.signOut();
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            await navigationPage.gotoSettingsPage();
            let knowledgeManagementList: string[] = ['Approvals', 'Article Template Styles', 'Article Templates', 'Knowledge Sets', 'Notes Template', 'Status Configuration', 'Knowledge Management'];
            expect(await navigationPage.isSettingSubMenusMatches("Knowledge Management", knowledgeManagementList)).toBeTruthy("Sub menu items not matching");
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.isSettingSubMenusMatches("Knowledge Management", knowledgeManagementList)).toBeTruthy("Sub menu items not matching");

            //Validation of Knowledge Publisher Settings Permission
            await navigationPage.signOut();
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.isSettingPanelTextMatches("Configuration options not created for these settings.")).toBeTruthy();
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.isSettingPanelTextMatches("Configuration options not created for these settings.")).toBeTruthy();
        });

        it('[DRDMV-1152]: [Permissions] Settings menu for Knowledge Functional Roles', async () => {
            //Validation of Knowledge Contributor Settings Permission
            await navigationPage.signOut();
            await loginPage.login(knowledgeContributorUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.isSettingPanelTextMatches("Configuration options not created for these settings.")).toBeTruthy();
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.isSettingPanelTextMatches("Configuration options not created for these settings.")).toBeTruthy();

            //Validation of Knowledge Candidate Settings Permission
            await navigationPage.signOut();
            await loginPage.login(knowledgeCandidateUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.isSettingPanelTextMatches("Configuration options not created for these settings.")).toBeTruthy();
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.isSettingPanelTextMatches("Configuration options not created for these settings.")).toBeTruthy();
        });
    });

    describe('[DRDMV-2985]: Article creation and possible status changes - Knowledge Publisher & Coach', async () => {
        let KADetails, KACoachDetails,articleDataCoach;
        beforeAll(async () => {
            await apiHelper.apiLogin("tadmin");
            await apiHelper.deleteKnowledgeApprovalMapping();
            let knowledgeTitile = 'knowledge2985' + randomStr;
            let articleData = {
                "knowledgeSet": "HR",
                "title": `${knowledgeTitile}`,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "Australia Support",
                "assigneeSupportGroup": "AU Support 3",
                "assignee": "KWilliamson",
            }
            await apiHelper.apiLogin(knowledgePublisherUser);
            KADetails = await apiHelper.createKnowledgeArticle(articleData);
            let knowledgeTitileCoach = 'knowledgeCoach2985' + randomStr;
            articleDataCoach = {
                "knowledgeSet": "HR",
                "title": `${knowledgeTitileCoach}`,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "HR Support",
                "assigneeSupportGroup": "Compensation and Benefits",
                "assignee": "peter"
            }
        });
        it('[DRDMV-2985]: Article creation and possible status changes - Knowledge Publisher & Coach', async () => {
            await navigationPage.signOut();
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            await utilityCommon.switchToNewTab(1);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(KADetails.displayId);
            await editKnowledgePage.setKnowledgeStatus('Draft');
            await utilityCommon.closePopUpMessage();
            expect(await editKnowledgePage.getStatusValue()).toContain('Draft', 'Status not Set');
            await navigationPage.gotoKnoweldgeConsoleFromKM();
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(KADetails.displayId);
            expect(await editKnowledgePage.getStatusValue()).toContain('Draft', 'Status not Set');
            await statusBladeKnowledgeArticlePo.setKnowledgeStatusWithReviewerDetails('SME Review', 'Petramco', 'Australia Support', 'AU Support 3', 'Kane Williamson')
            await utilityCommon.closePopUpMessage();
            expect(await editKnowledgePage.getStatusValue()).toContain('SME Review', 'Status not Set');
            await navigationPage.gotoKnoweldgeConsoleFromKM();
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(KADetails.displayId);
            expect(await editKnowledgePage.getStatusValue()).toContain('SME Review', 'Status not Set');
            await viewKnowledgeArticlePo.clickOnKAUsefulYesButton();
        });
        it('[DRDMV-2985]: Article creation and possible status changes - Knowledge Publisher & Coach', async () => {
            await navigationPage.signOut();
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            await utilityCommon.switchToNewTab(1);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(KADetails.displayId);
            expect(await viewKnowledgeArticlePo.isReviewMessageDisplayed('Knowledge Article is in Review')).toBeTruthy();
            await viewKnowledgeArticlePo.clickReviewPendingLink();
            await reviewCommentsPo.setTextInTellUsMore(KADetails.displayId);
            await reviewCommentsPo.clickApprovedButton();
            await utilityCommon.closePopUpMessage();
            await viewKnowledgeArticlePo.clickOnKAUsefulYesButton();
            expect(await editKnowledgePage.getStatusValue()).toContain('Published', 'Status not Set');
            await editKnowledgePage.setKnowledgeStatus('Retire Approval');
            await utilityCommon.closePopUpMessage();
            await utilityCommon.closePopUpMessage();
            expect(await editKnowledgePage.getStatusValue()).toContain('Retired', 'Status not Set');
            await editKnowledgePage.setClosedKnowledgeStatus('Closed');
            await utilityCommon.closePopUpMessage();
            expect(await editKnowledgePage.getStatusValue()).toContain('Closed', 'Status not Set');
        }); 
        it('[DRDMV-2985]: Article creation and possible status changes - Knowledge Publisher & Coach', async () => {
            await apiHelper.apiLogin(knowledgeCoachUser);
            KACoachDetails = await apiHelper.createKnowledgeArticle(articleDataCoach);
            await navigationPage.signOut();
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            await utilityCommon.switchToNewTab(1);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(KACoachDetails.displayId);
            await editKnowledgePage.setKnowledgeStatus('Draft');
            await utilityCommon.closePopUpMessage();
            expect(await editKnowledgePage.getStatusValue()).toContain('Draft', 'Status not Set');
            await navigationPage.gotoKnoweldgeConsoleFromKM();
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(KACoachDetails.displayId);
            expect(await editKnowledgePage.getStatusValue()).toContain('Draft', 'Status not Set');
            await statusBladeKnowledgeArticlePo.setKnowledgeStatusWithReviewerDetails('SME Review', 'Petramco', 'HR Support', 'Compensation and Benefits', 'Peter Kahn')
            await utilityCommon.closePopUpMessage();
            expect(await editKnowledgePage.getStatusValue()).toContain('SME Review', 'Status not Set');
            await navigationPage.gotoKnoweldgeConsoleFromKM();
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(KACoachDetails.displayId);
            expect(await editKnowledgePage.getStatusValue()).toContain('SME Review', 'Status not Set');
            await viewKnowledgeArticlePo.clickOnKAUsefulYesButton();
        });
        it('[DRDMV-2985]: Article creation and possible status changes - Knowledge Publisher & Coach', async () => {
            await navigationPage.signOut();
            await loginPage.login('peter');
            await navigationPage.gotoKnowledgeConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(KACoachDetails.displayId);
            await viewKnowledgeArticlePo.clickReviewPendingLink();
            await reviewCommentsPo.setTextInTellUsMore(KACoachDetails.displayId);
            await reviewCommentsPo.clickApprovedButton();
            await utilityCommon.closePopUpMessage();
            await viewKnowledgeArticlePo.clickOnKAUsefulYesButton();
            expect(await editKnowledgePage.getStatusValue()).toContain('Published', 'Status not Set');
            await editKnowledgePage.setKnowledgeStatus('Retire Approval');
            await utilityCommon.closePopUpMessage();
            await utilityCommon.closePopUpMessage();
            expect(await editKnowledgePage.getStatusValue()).toContain('Retired', 'Status not Set');
            await editKnowledgePage.setClosedKnowledgeStatus('Closed');
            await utilityCommon.closePopUpMessage();
            expect(await editKnowledgePage.getStatusValue()).toContain('Closed', 'Status not Set');
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('peter');
        });
    });

    describe('[DRDMV-3542]: [Post Comments] Post Feedback on knowledge article', async () => {
        let displayID,knowledgeTitile;
        beforeAll(async () => {
            knowledgeTitile = 'knowledge3542' + randomStr;
            await apiHelper.apiLogin(knowledgeCandidateUser);
            let articleData = {
                "knowledgeSet": "HR",
                "title": `${knowledgeTitile}`,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United Kingdom Support",
                "assigneeSupportGroup": "US Support 1",
                "assignee": "kayo"
            }
            let KADetails = await apiHelper.createKnowledgeArticle(articleData);
            displayID = KADetails.displayId;
        });
        it('[DRDMV-3542]: [Post Comments] Post Feedback on knowledge article', async () => {
            await navigationPage.signOut();
            await loginPage.login(knowledgeCandidateUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            await utilityCommon.switchToNewTab(1);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(displayID);
            await viewKnowledgeArticlePo.clickOnKAUsefulNoButton();
            expect(await feedbackBladeKnowledgeArticlePo.isTellUsMoreDisplayedWithReuqired()).toContain('required', 'required not present with comment box');
            expect(await feedbackBladeKnowledgeArticlePo.isSaveButtonDisplayed()).toBeTruthy('Save button not present');
            expect(await feedbackBladeKnowledgeArticlePo.isCancelButtonDisplayed()).toBeTruthy('Cancel button not present');
            expect(await feedbackBladeKnowledgeArticlePo.isFlagDisplayed()).toBeTruthy('Flag button not present');
            expect(await feedbackBladeKnowledgeArticlePo.isSaveButtonEnabled()).toBeFalsy('save button is enabled');
            await feedbackBladeKnowledgeArticlePo.clickCancelButtonOnFeedBack();
            expect(await viewKnowledgeArticlePo.isKAUsefulYesButtonDisplayed()).toBeTruthy('Yes button is displayed');
            await viewKnowledgeArticlePo.clickOnKAUsefulNoButton();
            await feedbackBladeKnowledgeArticlePo.setTextInTellUsMore(knowledgeTitile);
            await feedbackBladeKnowledgeArticlePo.clickOnSaveButtonOnFeedBack();
            await utilityCommon.closePopUpMessage();
            await viewKnowledgeArticlePo.clickOnTab('Activity');
            await activityTabPo.clickOnRefreshButton();
            expect(await activityTabPo.getFirstPostContent()).toContain(knowledgeTitile, 'content not displaying on Activity');
        });
        it('[DRDMV-3542]: [Post Comments] Post Feedback on knowledge article', async () => {
            await navigationPage.signOut();
            //login with contributor
            await loginPage.login(knowledgeContributorUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            await utilityCommon.switchToNewTab(1);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(displayID);
            await viewKnowledgeArticlePo.clickOnKAUsefulNoButton();
            expect(await feedbackBladeKnowledgeArticlePo.isTellUsMoreDisplayedWithReuqired()).toContain('required', 'required not present with comment box');
            expect(await feedbackBladeKnowledgeArticlePo.isSaveButtonDisplayed()).toBeTruthy('Save button not present');
            expect(await feedbackBladeKnowledgeArticlePo.isCancelButtonDisplayed()).toBeTruthy('Cancel button not present');
            expect(await feedbackBladeKnowledgeArticlePo.isFlagDisplayed()).toBeTruthy('Flag button not present');
            expect(await feedbackBladeKnowledgeArticlePo.isSaveButtonEnabled()).toBeFalsy('save button is enabled');
            await feedbackBladeKnowledgeArticlePo.clickCancelButtonOnFeedBack();
            expect(await viewKnowledgeArticlePo.isKAUsefulYesButtonDisplayed()).toBeTruthy('Yes button is displayed');
            await viewKnowledgeArticlePo.clickOnKAUsefulNoButton();
            await feedbackBladeKnowledgeArticlePo.setTextInTellUsMore(knowledgeTitile);
            await feedbackBladeKnowledgeArticlePo.clickOnSaveButtonOnFeedBack();
            await utilityCommon.closePopUpMessage();
            await viewKnowledgeArticlePo.clickOnTab('Activity');
            await activityTabPo.clickOnRefreshButton();
            expect(await activityTabPo.getFirstPostContent()).toContain(knowledgeTitile, 'content not displaying on Activity');
        }); 
        it('[DRDMV-3542]: [Post Comments] Post Feedback on knowledge article', async () => {
            await navigationPage.signOut();
            //login with publisher
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            await utilityCommon.switchToNewTab(1);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(displayID);
            await viewKnowledgeArticlePo.clickOnKAUsefulNoButton();
            expect(await feedbackBladeKnowledgeArticlePo.isTellUsMoreDisplayedWithReuqired()).toContain('required', 'required not present with comment box');
            expect(await feedbackBladeKnowledgeArticlePo.isSaveButtonDisplayed()).toBeTruthy('Save button not present');
            expect(await feedbackBladeKnowledgeArticlePo.isCancelButtonDisplayed()).toBeTruthy('Cancel button not present');
            expect(await feedbackBladeKnowledgeArticlePo.isFlagDisplayed()).toBeTruthy('Flag button not present');
            expect(await feedbackBladeKnowledgeArticlePo.isSaveButtonEnabled()).toBeFalsy('save button is enabled');
            await feedbackBladeKnowledgeArticlePo.clickCancelButtonOnFeedBack();
            expect(await viewKnowledgeArticlePo.isKAUsefulYesButtonDisplayed()).toBeTruthy('Yes button is displayed');
            await viewKnowledgeArticlePo.clickOnKAUsefulNoButton();
            await feedbackBladeKnowledgeArticlePo.setTextInTellUsMore(knowledgeTitile);
            await feedbackBladeKnowledgeArticlePo.clickOnSaveButtonOnFeedBack();
            await utilityCommon.closePopUpMessage();
            await viewKnowledgeArticlePo.clickOnTab('Activity');
            await activityTabPo.clickOnRefreshButton();
            expect(await activityTabPo.getFirstPostContent()).toContain(knowledgeTitile, 'content not displaying on Activity');
        });
        it('[DRDMV-3542]: [Post Comments] Post Feedback on knowledge article', async () => {
            await navigationPage.signOut();
            //login with publisher
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            await utilityCommon.switchToNewTab(1);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(displayID);
            await viewKnowledgeArticlePo.clickOnKAUsefulNoButton();
            expect(await feedbackBladeKnowledgeArticlePo.isTellUsMoreDisplayedWithReuqired()).toContain('required', 'required not present with comment box');
            expect(await feedbackBladeKnowledgeArticlePo.isSaveButtonDisplayed()).toBeTruthy('Save button not present');
            expect(await feedbackBladeKnowledgeArticlePo.isCancelButtonDisplayed()).toBeTruthy('Cancel button not present');
            expect(await feedbackBladeKnowledgeArticlePo.isFlagDisplayed()).toBeTruthy('Flag button not present');
            expect(await feedbackBladeKnowledgeArticlePo.isSaveButtonEnabled()).toBeFalsy('save button is enabled');
            await feedbackBladeKnowledgeArticlePo.clickCancelButtonOnFeedBack();
            expect(await viewKnowledgeArticlePo.isKAUsefulYesButtonDisplayed()).toBeTruthy('Yes button is displayed');
            await viewKnowledgeArticlePo.clickOnKAUsefulNoButton();
            await feedbackBladeKnowledgeArticlePo.setTextInTellUsMore(knowledgeTitile);
            await feedbackBladeKnowledgeArticlePo.clickOnSaveButtonOnFeedBack();
            await utilityCommon.closePopUpMessage();
            await viewKnowledgeArticlePo.clickOnTab('Activity');
            await activityTabPo.clickOnRefreshButton();
            expect(await activityTabPo.getFirstPostContent()).toContain(knowledgeTitile, 'content not displaying on Activity');
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('peter');
        });
    });
})
