import { browser, protractor, ProtractorExpectedConditions } from "protractor";
import apiCoreUtil from '../../api/api.core.util';
import apiHelper from '../../api/api.helper';
import changeAssignmentBlade from "../../pageobject/common/change-assignment-blade.po";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import KnowledgeConsolePage from "../../pageobject/knowledge/console-knowledge.po";
import createKnowledgePage from "../../pageobject/knowledge/create-knowlege.po";
import editKnowledgePage from "../../pageobject/knowledge/edit-knowledge.po";
import utilCommon from '../../utils/util.common';
import viewKnowledgeArticlePo from '../../pageobject/knowledge/view-knowledge-article.po';
import feedbackBladeKnowledgeArticlePo from '../../pageobject/knowledge/feedback-blade-Knowledge-article.po';
import activityTabPo from '../../pageobject/social/activity-tab.po';
import utilGrid from '../../utils/util.grid';
import knowledgeArticlesConsolePo from '../../pageobject/knowledge/knowledge-articles-console.po';
import reviewCommentsPo from '../../pageobject/knowledge/review-comments.po';
import statusBladeKnowledgeArticlePo from '../../pageobject/knowledge/status-blade-knowledge-article.po';
import previewKnowledgePo from '../../pageobject/knowledge/preview-knowledge.po';

describe('Knowledge Article', () => {
    const EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    const businessDataFile = require('../../data/ui/foundation/businessUnit.ui.json');
    const departmentDataFile = require('../../data/ui/foundation/department.ui.json');
    const supportGrpDataFile = require('../../data/ui/foundation/supportGroup.ui.json');
    const personDataFile = require('../../data/ui/foundation/person.ui.json');
    const domainTagDataFile = require('../../data/ui/foundation/domainTag.ui.json');
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
        await foundationData('Petramco');
        await foundationData19501('Petramco');
        await foundationData19082('Petramco');
    });

    afterAll(async () => {
        await navigationPage.signOut();
        await apiHelper.apiLogin("tadmin");
        let domainTag = await apiHelper.createDomainTag(domainTagDataFile['DomainTagData']);
        await apiHelper.disableDomainTag(domainTag);
    });

    afterEach(async () => {
        await browser.refresh();
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
            await loginPage.loginWithCredentials(personData.userId + "@petramco.com", 'Password_1234');
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate(knowledgeData.TemplateName);
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeData.KnowledgeTitle);
            await createKnowledgePage.selectKnowledgeSet(knowledgeData.KnowledgeSet);
            await createKnowledgePage.clickAssignToMeButton();
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await createKnowledgePage.clickOnviewArticleLinkButton();
            await utilCommon.switchToNewWidnow(1);
            let assigneeFullName = personData.firstName + " " + personData.lastName;
            await editKnowledgePage.verifyKnowledgeMetadata('Assignee', assigneeFullName);
            await editKnowledgePage.verifyKnowledgeMetadata('Assigned Group', suppGrpData.orgName);
        }
        catch (error) {
            throw error;
        }
        finally {
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await browser.refresh();
            await utilCommon.waitUntilSpinnerToHide();
            await navigationPage.signOut();
            await loginPage.login('peter');
        }
    });

    it('[DRDMV-19079]: Change Reviewer blade should process properly on KA', async () => {
        try {
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
            await createKnowledgePage.clickOnviewArticleLinkButton();
            await utilCommon.switchToNewWidnow(1);
            await editKnowledgePage.setKnowledgeStatus(knowledgeData.DraftStatus);
            await utilCommon.waitUntilPopUpDisappear();
            await editKnowledgePage.setKnowledgeStatusWithoutSave(knowledgeData.ReviewStatus);
            expect(await editKnowledgePage.isReviewerCompanyFieldDisbaledOnStatusChangeBlade()).toBeTruthy();
            expect(await editKnowledgePage.isReviewerBusinessUnitFieldDisbaledOnStatusChangeBlade()).toBeTruthy();
            expect(await editKnowledgePage.isReviewerDepartmentfieldDisbaledOnStatusChangeBlade()).toBeTruthy();
            expect(await editKnowledgePage.isReviewerGrpFieldDisbaledOnStatusChangeBlade()).toBeTruthy();
            expect(await editKnowledgePage.isReviewerFieldDisbaledOnStatusChangeBlade()).toBeTruthy();
            expect(await editKnowledgePage.isChangeReviewerButtonPresent()).toBeTruthy();
            expect(await editKnowledgePage.isAssignToMeButtonPresent()).toBeTruthy();
            await editKnowledgePage.clickChangeReviewerBtn();
            await changeAssignmentBlade.selectCompany(knowledgeData.Company);
            await changeAssignmentBlade.selectBusinessUnit(businessData.orgName);
            await changeAssignmentBlade.selectDepartment(departmentData.orgName);
            await changeAssignmentBlade.selectSupportGroup(suppGrpData.orgName);
            await changeAssignmentBlade.selectAssignee(personData.firstName);
            await changeAssignmentBlade.clickOnAssignButton();
            await browser.sleep(1000);
            await editKnowledgePage.clickSaveStatusBtn();
            await utilCommon.waitUntilPopUpDisappear();
            await editKnowledgePage.isReviewPendingButtonDisplayed();
        }
        catch (error) {
            throw error;
        }
        finally {
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
        }
    });

    it('[DRDMV-19080]: On Edit KA, Change Assignment blade should process properly ', async () => {
        try {
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
            await createKnowledgePage.clickOnviewArticleLinkButton();
            await utilCommon.switchToNewWidnow(1);
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            await editKnowledgePage.clickChangeAssignmentButton();
            await changeAssignmentBlade.isAssignToMeCheckBoxPresent();
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
        }
        catch (error) {
            throw error;
        }
        finally {
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
        }
    });

    it('[DRDMV-19081]: Assignment fields is not available on Status Change blade except when Status= SME Review', async () => {
        try {
            let knowledgeDataFile = require("../../data/ui/knowledge/knowledgeArticle.ui.json")
            let knowledgeData = knowledgeDataFile['DRDMV-19081'];
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate(knowledgeData.TemplateName);
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeData.KnowledgeTitle);
            await createKnowledgePage.selectKnowledgeSet(knowledgeData.KnowledgeSet);
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await createKnowledgePage.clickOnviewArticleLinkButton();
            await utilCommon.switchToNewWidnow(1);
            await editKnowledgePage.setKnowledgeStatusAndVerifyAssignmentNotAppear(knowledgeData.DraftStatus);
            await editKnowledgePage.setKnowledgeStatusAndVerifyAssignmentNotAppear(knowledgeData.PublishedStatus);
            await editKnowledgePage.setKnowledgeStatusAndVerifyAssignmentNotAppear(knowledgeData.RetiredStatus);
            await editKnowledgePage.setKnowledgeStatusAndVerifyAssignmentNotAppear(knowledgeData.ClosedStatus);
        }
        catch (error) {
            throw error;
        }
        finally {
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
        }
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
        await changeAssignmentBlade.isAssignToMeCheckBoxPresent();
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
            await loginPage.loginWithCredentials(personData.userId + "@petramco.com", 'Password_1234');
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
        }
        catch (error) {
            throw error;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('peter');
        }
    }, (160 * 1000));

    async function foundationData19082(company: string) {
        await apiHelper.apiLogin('tadmin');
        let domainTagData = domainTagDataFile['DomainTagData'];
        let businessData = (businessDataFile['BusinessUnitData19082']);
        let departmentData = departmentDataFile['DepartmentData19082'];
        let suppGrpData = supportGrpDataFile['SuppGrpData19082'];
        let personData = personDataFile['PersonData19082'];
        await apiHelper.createDomainTag(domainTagData);
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

    it('[DRDMV-19082]: Domain config should be honored while Assigning Assignee and Reviewer', async () => {
        //All below BU, Dep and Supp grps are tagged to DomainName
        let businessData = businessDataFile['BusinessUnitData19082'];
        let departmentData = departmentDataFile['DepartmentData19082'];
        let suppGrpData = supportGrpDataFile['SuppGrpData19082'];
        let personData = personDataFile['PersonData19082'];
        let knowledgeDataFile = require("../../data/ui/knowledge/knowledgeArticle.ui.json")
        let knowledgeData = knowledgeDataFile['DRDMV-19082'];
        await navigationPage.gotoCreateKnowledge();
        await createKnowledgePage.clickOnTemplate(knowledgeData.TemplateName);
        await createKnowledgePage.clickOnUseSelectedTemplateButton();
        await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeData.KnowledgeTitle);
        await createKnowledgePage.selectKnowledgeSet(knowledgeData.KnowledgeSet);
        await createKnowledgePage.clickChangeAssignmentButton();
        await changeAssignmentBlade.selectCompany(knowledgeData.Company);
        await changeAssignmentBlade.selectBusinessUnit(businessData.orgName);
        await changeAssignmentBlade.selectDepartment(departmentData.orgName);
        await changeAssignmentBlade.selectSupportGroup(suppGrpData.orgName);
        await changeAssignmentBlade.selectAssignee(personData.firstName);
        await changeAssignmentBlade.clickOnAssignButton();
        await createKnowledgePage.clickOnSaveKnowledgeButton();
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
            await expect(createKnowledgePage.isAuthorRequired()).toBeTruthy("Required Text is not present in author");
            await expect(createKnowledgePage.isSaveButtonEnabled());
            await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeTitle);
            await createKnowledgePage.selectKnowledgeSet('HR');
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            var knowledgeIdValue: string = await createKnowledgePage.getKnowledgeId();
            await createKnowledgePage.clickBackButton();
            await navigationPage.gotoKnowledgeConsole();
            await KnowledgeConsolePage.searchKnowledgeArticle(knowledgeTitle);
            await expect(KnowledgeConsolePage.isArticleIdDisplayed(knowledgeIdValue)).toBeTruthy("Knowledge Article is not displayed");
        } catch (error) {
            throw error;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('peter');
        }
    });

    it('[DRDMV-2985]: Article creation and possible status changes - Knowledge Publisher & Coach', async () => {
        try {
            let knowledgeTitile = 'knowledge2985' + randomStr;
            await apiHelper.apiLogin(knowledgePublisherUser);
            let articleData = {
                "knowledgeSet": "HR",
                "title": `${knowledgeTitile}`,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignee": "KWilliamson",
                "assigneeSupportGroup": "AU Support 3",
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
            await statusBladeKnowledgeArticlePo.setKnowledgeStatusAsSMEReview('Petramco', 'AU Support 3', 'Kane Williamson')
            expect(await editKnowledgePage.getStatusValue()).toContain('SME Review', 'Status not Set');
            await navigationPage.gotoKnoweldgeConsoleFromKM();
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(KADetails.displayId);
            expect(await editKnowledgePage.getStatusValue()).toContain('SME Review', 'Status not Set');
            await viewKnowledgeArticlePo.clickOnKAUsefulYesButton();
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(KADetails.displayId);
            expect(await viewKnowledgeArticlePo.isReviewMessageDisplayed('Knowledge Article is in Review')).toBeTruthy();
            await viewKnowledgeArticlePo.clickReviewPendingLink();
            await reviewCommentsPo.setTextInTellUsMore(KADetails.displayId);
            await reviewCommentsPo.clickApprovedButton();
            await viewKnowledgeArticlePo.clickOnKAUsefulYesButton();
            expect(await editKnowledgePage.getStatusValue()).toContain('Published', 'Status not Set');
            await editKnowledgePage.setKnowledgeStatus('Retired');
            expect(await editKnowledgePage.getStatusValue()).toContain('Retired', 'Status not Set');
            await editKnowledgePage.setKnowledgeStatus('Closed');
            expect(await editKnowledgePage.getStatusValue()).toContain('Closed', 'Status not Set');
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            //login with coachlet
            let knowledgeTitileCoach = 'knowledgeCoach2985' + randomStr;
            await apiHelper.apiLogin(knowledgeCoachUser);
            let articleDataCoach = {
                "knowledgeSet": "HR",
                "title": `${knowledgeTitileCoach}`,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignee": "peter",
                "assigneeSupportGroup": "Compensation and Benefits",
                "company": "Petramco"
            }
            let KACoachDetails = await apiHelper.createKnowledgeArticle(articleDataCoach);
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(KACoachDetails.displayId);
            await editKnowledgePage.setKnowledgeStatus('Draft');
            expect(await editKnowledgePage.getStatusValue()).toContain('Draft', 'Status not Set');
            await navigationPage.gotoKnoweldgeConsoleFromKM();
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(KACoachDetails.displayId);
            expect(await editKnowledgePage.getStatusValue()).toContain('Draft', 'Status not Set');
            await statusBladeKnowledgeArticlePo.setKnowledgeStatusAsSMEReview('Petramco', 'Compensation and Benefits', 'Peter Kahn')
            expect(await editKnowledgePage.getStatusValue()).toContain('SME Review', 'Status not Set');
            await navigationPage.gotoKnoweldgeConsoleFromKM();
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(KACoachDetails.displayId);
            expect(await editKnowledgePage.getStatusValue()).toContain('SME Review', 'Status not Set');
            await viewKnowledgeArticlePo.clickOnKAUsefulYesButton();
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('peter');
            await navigationPage.gotoKnowledgeConsole();
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(KACoachDetails.displayId);
            await viewKnowledgeArticlePo.clickReviewPendingLink();
            await reviewCommentsPo.setTextInTellUsMore(KACoachDetails.displayId);
            await reviewCommentsPo.clickApprovedButton();
            await viewKnowledgeArticlePo.clickOnKAUsefulYesButton();
            expect(await editKnowledgePage.getStatusValue()).toContain('Published', 'Status not Set');
            await editKnowledgePage.setKnowledgeStatus('Retired');
            expect(await editKnowledgePage.getStatusValue()).toContain('Retired', 'Status not Set');
            await editKnowledgePage.setKnowledgeStatus('Closed');
            expect(await editKnowledgePage.getStatusValue()).toContain('Closed', 'Status not Set');
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

    it('[DRDMV-3542]: [Post Comments] Post Feedback on knowledge article', async () => {
        try {
            let knowledgeTitile = 'knowledge3542' + randomStr;
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
            await viewKnowledgeArticlePo.clickOnKAUsefulNoButton();
            expect(await feedbackBladeKnowledgeArticlePo.isTellUsMoreDisplayedWithReuqired()).toContain('required', 'required not present with comment box');
            expect(await feedbackBladeKnowledgeArticlePo.isSaveButtonDisplayed()).toBeTruthy('Save button not present');
            expect(await feedbackBladeKnowledgeArticlePo.isCancelButtonDisplayed()).toBeTruthy('Cancel button not present');
            expect(await feedbackBladeKnowledgeArticlePo.isFlagDisplayed()).toBeTruthy('Flag button not present');
            expect(await feedbackBladeKnowledgeArticlePo.isSaveButtonEnabled()).toBeFalsy('save button is enabled');
            await feedbackBladeKnowledgeArticlePo.clickCancelButtonOnFeedBack();
            await utilCommon.clickOnWarningCancel();
            await feedbackBladeKnowledgeArticlePo.clickCancelButtonOnFeedBack();
            await utilCommon.clickOnWarningOk();
            expect(await viewKnowledgeArticlePo.isKAUsefulYesButtonDisplayed()).toBeTruthy('Yes button is displayed');
            await viewKnowledgeArticlePo.clickOnKAUsefulNoButton();
            await feedbackBladeKnowledgeArticlePo.setTextInTellUsMore(knowledgeTitile);
            await feedbackBladeKnowledgeArticlePo.clickOnSaveButtonOnFeedBack();
            await viewKnowledgeArticlePo.clickOnActivityTab();
            await activityTabPo.clickOnRefreshButton();
            expect(await activityTabPo.getFirstPostContent()).toContain(knowledgeTitile, 'content not displaying on Activity');
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            //login with contributor
            await loginPage.login(knowledgeContributorUser);
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(displayID);
            await viewKnowledgeArticlePo.clickOnKAUsefulNoButton();
            expect(await feedbackBladeKnowledgeArticlePo.isTellUsMoreDisplayedWithReuqired()).toContain('required', 'required not present with comment box');
            expect(await feedbackBladeKnowledgeArticlePo.isSaveButtonDisplayed()).toBeTruthy('Save button not present');
            expect(await feedbackBladeKnowledgeArticlePo.isCancelButtonDisplayed()).toBeTruthy('Cancel button not present');
            expect(await feedbackBladeKnowledgeArticlePo.isFlagDisplayed()).toBeTruthy('Flag button not present');
            expect(await feedbackBladeKnowledgeArticlePo.isSaveButtonEnabled()).toBeFalsy('save button is enabled');
            await feedbackBladeKnowledgeArticlePo.clickCancelButtonOnFeedBack();
            await utilCommon.clickOnWarningCancel();
            await feedbackBladeKnowledgeArticlePo.clickCancelButtonOnFeedBack();
            await utilCommon.clickOnWarningOk();
            expect(await viewKnowledgeArticlePo.isKAUsefulYesButtonDisplayed()).toBeTruthy('Yes button is displayed');
            await viewKnowledgeArticlePo.clickOnKAUsefulNoButton();
            await feedbackBladeKnowledgeArticlePo.setTextInTellUsMore(knowledgeTitile);
            await feedbackBladeKnowledgeArticlePo.clickOnSaveButtonOnFeedBack();
            await viewKnowledgeArticlePo.clickOnActivityTab();
            await activityTabPo.clickOnRefreshButton();
            expect(await activityTabPo.getFirstPostContent()).toContain(knowledgeTitile, 'content not displaying on Activity');
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            //login with publisher
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(displayID);
            await viewKnowledgeArticlePo.clickOnKAUsefulNoButton();
            expect(await feedbackBladeKnowledgeArticlePo.isTellUsMoreDisplayedWithReuqired()).toContain('required', 'required not present with comment box');
            expect(await feedbackBladeKnowledgeArticlePo.isSaveButtonDisplayed()).toBeTruthy('Save button not present');
            expect(await feedbackBladeKnowledgeArticlePo.isCancelButtonDisplayed()).toBeTruthy('Cancel button not present');
            expect(await feedbackBladeKnowledgeArticlePo.isFlagDisplayed()).toBeTruthy('Flag button not present');
            expect(await feedbackBladeKnowledgeArticlePo.isSaveButtonEnabled()).toBeFalsy('save button is enabled');
            await feedbackBladeKnowledgeArticlePo.clickCancelButtonOnFeedBack();
            await utilCommon.clickOnWarningCancel();
            await feedbackBladeKnowledgeArticlePo.clickCancelButtonOnFeedBack();
            await utilCommon.clickOnWarningOk();
            expect(await viewKnowledgeArticlePo.isKAUsefulYesButtonDisplayed()).toBeTruthy('Yes button is displayed');
            await viewKnowledgeArticlePo.clickOnKAUsefulNoButton();
            await feedbackBladeKnowledgeArticlePo.setTextInTellUsMore(knowledgeTitile);
            await feedbackBladeKnowledgeArticlePo.clickOnSaveButtonOnFeedBack();
            await viewKnowledgeArticlePo.clickOnActivityTab();
            await activityTabPo.clickOnRefreshButton();
            expect(await activityTabPo.getFirstPostContent()).toContain(knowledgeTitile, 'content not displaying on Activity');
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            //login with publisher
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(displayID);
            await viewKnowledgeArticlePo.clickOnKAUsefulNoButton();
            expect(await feedbackBladeKnowledgeArticlePo.isTellUsMoreDisplayedWithReuqired()).toContain('required', 'required not present with comment box');
            expect(await feedbackBladeKnowledgeArticlePo.isSaveButtonDisplayed()).toBeTruthy('Save button not present');
            expect(await feedbackBladeKnowledgeArticlePo.isCancelButtonDisplayed()).toBeTruthy('Cancel button not present');
            expect(await feedbackBladeKnowledgeArticlePo.isFlagDisplayed()).toBeTruthy('Flag button not present');
            expect(await feedbackBladeKnowledgeArticlePo.isSaveButtonEnabled()).toBeFalsy('save button is enabled');
            await feedbackBladeKnowledgeArticlePo.clickCancelButtonOnFeedBack();
            await utilCommon.clickOnWarningCancel();
            await feedbackBladeKnowledgeArticlePo.clickCancelButtonOnFeedBack();
            await utilCommon.clickOnWarningOk();
            expect(await viewKnowledgeArticlePo.isKAUsefulYesButtonDisplayed()).toBeTruthy('Yes button is displayed');
            await viewKnowledgeArticlePo.clickOnKAUsefulNoButton();
            await feedbackBladeKnowledgeArticlePo.setTextInTellUsMore(knowledgeTitile);
            await feedbackBladeKnowledgeArticlePo.clickOnSaveButtonOnFeedBack();
            await viewKnowledgeArticlePo.clickOnActivityTab();
            await activityTabPo.clickOnRefreshButton();
            expect(await activityTabPo.getFirstPostContent()).toContain(knowledgeTitile, 'content not displaying on Activity');
        }
        catch (e) {
            throw e;
        }
        finally {
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('peter');
        }
    }, 300 * 1000);

    it('[DRDMV-5058]: Review article in SME Review status & Approve article', async () => {
        try {
            let knowledgeTitile = 'knowledge5058' + randomStr;
            await apiHelper.apiLogin(knowledgePublisherUser);
            let articleData = {
                "knowledgeSet": "HR",
                "title": `${knowledgeTitile}`,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignee": "kmills",
                "assigneeSupportGroup": "GB Support 2",
                "company": "Petramco"
            }
            let KADetails = await apiHelper.createKnowledgeArticle(articleData);
            expect(await apiHelper.updateKnowledgeArticleStatus(KADetails.id, "Draft")).toBeTruthy("Article with Draft status not updated.");
            expect(await apiHelper.updateKnowledgeArticleStatus(KADetails.id, "SMEReview", "KMills", "GB Support 2", "Petramco")).toBeTruthy("Article with SME Review status not updated.");
            await navigationPage.signOut();
            await loginPage.login('kmills');
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            await utilGrid.clearFilter();
            let knowledgeGridColumnFields: string[] = ["Review Status"];
            let columnName: string[] = ["Review Status"];
            await KnowledgeConsolePage.addAllcolumnOnKnowledgeConsole(knowledgeGridColumnFields)
            await utilGrid.addFilter('Review Status', 'Pending Review', 'checkbox');
            await utilGrid.searchAndOpenHyperlink(KADetails.displayId);
            expect(await viewKnowledgeArticlePo.isReviewMessageDisplayed('Knowledge Article is in Review')).toBeTruthy('article review not set');
            await viewKnowledgeArticlePo.clickReviewPendingLink();
            expect(await reviewCommentsPo.isCancelButtonDisplay()).toBeTruthy('Cancel button not present');
            expect(await reviewCommentsPo.isApprovedButtonDisplay()).toBeTruthy('Approved button not present');
            expect(await reviewCommentsPo.isRejectedButtonDisplay()).toBeTruthy('Rejected button not present');
            expect(await reviewCommentsPo.isTellUsMoreDisplayed()).toBeTruthy('Tell us more not present');
            await reviewCommentsPo.setTextInTellUsMore(knowledgeTitile);
            await reviewCommentsPo.clickApprovedButton();
            expect(await viewKnowledgeArticlePo.getStatusValue()).toContain('Published', 'value is not matched with status')
            await viewKnowledgeArticlePo.clickOnActivityTab();
            expect(await activityTabPo.getFirstPostContent()).toContain('Kyle Mills reviewed this article and provided this comment');
            expect(await activityTabPo.getFirstPostContent()).toContain(knowledgeTitile)
            await navigationPage.gotoKnoweldgeConsoleFromKM();
            await utilGrid.clearFilter();
            await utilGrid.searchRecord(KADetails.displayId);
            expect(await KnowledgeConsolePage.isValueDisplayedInGrid('Review Status')).toContain('Reviewed');
            await knowledgeArticlesConsolePo.removeColumnOnGrid(columnName);
        }
        catch (e) {
            throw e;
        }
        finally {
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('peter');
        }
    }, 150 * 1000);

    it('[DRDMV-5059]: Review article in SME Review status & Reject article', async () => {
        try {
            let knowledgeTitile = 'knowledge5059' + randomStr;
            await apiHelper.apiLogin(knowledgePublisherUser);
            let articleData = {
                "knowledgeSet": "HR",
                "title": `${knowledgeTitile}`,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignee": "kmills",
                "assigneeSupportGroup": "GB Support 2",
                "company": "Petramco"
            }
            let KADetails = await apiHelper.createKnowledgeArticle(articleData);
            expect(await apiHelper.updateKnowledgeArticleStatus(KADetails.id, "Draft")).toBeTruthy("Article with Draft status not updated.");
            expect(await apiHelper.updateKnowledgeArticleStatus(KADetails.id, "SMEReview", "KMills", "GB Support 2", "Petramco")).toBeTruthy("Article with SME Review status not updated.");
            await navigationPage.signOut();
            await loginPage.login('kmills');
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            await utilGrid.clearFilter();
            let knowledgeGridColumnFields: string[] = ["Review Status"];
            let columnName: string[] = ["Review Status"];
            await KnowledgeConsolePage.addAllcolumnOnKnowledgeConsole(knowledgeGridColumnFields)
            await utilGrid.addFilter('Review Status', 'Pending Review', 'checkbox');
            await utilGrid.searchAndOpenHyperlink(KADetails.displayId);
            expect(await viewKnowledgeArticlePo.isReviewMessageDisplayed('Knowledge Article is in Review')).toBeTruthy('article review not set');
            await viewKnowledgeArticlePo.clickReviewPendingLink();
            expect(await reviewCommentsPo.isCancelButtonDisplay()).toBeTruthy('Cancel button not present');
            expect(await reviewCommentsPo.isApprovedButtonDisplay()).toBeTruthy('Approved button not present');
            expect(await reviewCommentsPo.isRejectedButtonDisplay()).toBeTruthy('Rejected button not present');
            expect(await reviewCommentsPo.isTellUsMoreDisplayed()).toBeTruthy('Tell us more not present');
            await reviewCommentsPo.setTextInTellUsMore(knowledgeTitile);
            await reviewCommentsPo.clickRejectedButton();
            expect(await viewKnowledgeArticlePo.getStatusValue()).toContain('Draft', 'value is not matched with status')
            await viewKnowledgeArticlePo.clickOnActivityTab();
            expect(await activityTabPo.getFirstPostContent()).toContain('Kyle Mills reviewed this article and provided this comment');
            expect(await activityTabPo.getFirstPostContent()).toContain(knowledgeTitile)
            await navigationPage.gotoKnoweldgeConsoleFromKM();
            await utilGrid.clearFilter();
            await utilGrid.searchRecord(KADetails.displayId);
            expect(await KnowledgeConsolePage.isValueDisplayedInGrid('Review Status')).toContain('Reviewed');
            await knowledgeArticlesConsolePo.removeColumnOnGrid(knowledgeGridColumnFields);
        }
        catch (e) {
            throw e;
        }
        finally {
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('peter');
        }
    }, 150 * 1000);

    it('[DRDMV-2433]: Assign SME - Reviewer assignment UI validation', async () => {
        try {
            let knowledgeTitile = 'knowledge2433' + randomStr;
            await apiHelper.apiLogin(knowledgePublisherUser);
            let articleData = {
                "knowledgeSet": "HR",
                "title": `${knowledgeTitile}`,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignee": "kmills",
                "assigneeSupportGroup": "GB Support 2",
                "company": "Petramco"
            }
            let KADetails = await apiHelper.createKnowledgeArticle(articleData);
            expect(await apiHelper.updateKnowledgeArticleStatus(KADetails.id, "Draft")).toBeTruthy("Article with Draft status not updated.");
            await navigationPage.signOut();
            await loginPage.login('kmills');
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(KADetails.displayId);
            await statusBladeKnowledgeArticlePo.setKnowledgeStatusAsSMEReview('Petramco', 'Compensation and Benefits', 'Peter Kahn');
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            expect(await editKnowledgePage.getKnowledgeReviewHeader()).toContain('Knowledge Review');
            expect(await editKnowledgePage.isReviewerFieldDisabledInEdit()).toBeTruthy('Reviwer field is enabled');
            expect(await editKnowledgePage.isReviewerGroupFieldDisabledInEdit()).toBeTruthy('Reviwer Group field is enabled');
            await editKnowledgePage.clickChangeReviewerBtn();
            await changeAssignmentBlade.selectCompany('Petramco');
            await changeAssignmentBlade.selectSupportGroup('AU Support 3');
            await changeAssignmentBlade.selectAssignee('Kane Williamson');
            await changeAssignmentBlade.clickOnAssignButton();
            expect(await editKnowledgePage.getReviewerValue()).toContain('Kane Williamson', 'Reviewer not matched with expected');
            await editKnowledgePage.saveKnowledgeMedataDataChanges();
        }
        catch (e) {
            throw e;
        }
        finally {
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('peter');
        }
    }, 120* 1000);

    it('[DRDMV-1914]: [Article Creation] Ability to select the knowledge set during article creation', async () => {
        let knowledgeTitle = 'knowledgeCoachUser1914' + randomStr;
        await navigationPage.gotoKnowledgeConsole();
        await navigationPage.gotoCreateKnowledge();
        expect(await createKnowledgePage.isTemplatePresent('KCS')).toBeTruthy('Template is not present');
        expect(await createKnowledgePage.isTemplatePresent('Reference')).toBeTruthy('Template is not present');
        expect(await createKnowledgePage.isTemplatePresent('How To')).toBeTruthy('Template is not present');
        await createKnowledgePage.clickOnTemplate('Reference');
        await createKnowledgePage.clickOnUseSelectedTemplateButton();
        await createKnowledgePage.setReferenceValue('reference values are as follows');
        await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeTitle);
        await createKnowledgePage.selectRegionDropDownOption('Australia');
        await createKnowledgePage.selectSiteDropDownOption('Melbourne');
        await createKnowledgePage.selectCategoryTier1Option('Applications');
        await createKnowledgePage.selectCategoryTier2Option('Help Desk');
        await createKnowledgePage.selectCategoryTier3Option('Incident');
        expect(await createKnowledgePage.getKnowledgeArticleTitleValue()).toContain(knowledgeTitle, 'expected Value not present');
        expect(await createKnowledgePage.getValueOfCategoryTier1()).toContain('Applications', 'value not matched with expected');
        expect(await createKnowledgePage.getValueOfCategoryTier2()).toContain('Help Desk', 'value not matched with expected');
        expect(await createKnowledgePage.getValueOfCategoryTier3()).toContain('Incident', 'value not matched with expected');
        expect(await createKnowledgePage.isSaveButtonEnabled()).toBeFalsy('Save Button is enabled');
        await createKnowledgePage.selectKnowledgeSet('HR');
        expect(await createKnowledgePage.getKnowledgeSetValue()).toContain('HR', 'expected Value not present');
        expect(await createKnowledgePage.isSaveButtonEnabled()).toBeTruthy('Save Button is disabled');
        await createKnowledgePage.clickOnSaveKnowledgeButton();
        await previewKnowledgePo.clickOnBackButton();
        await navigationPage.gotoKnowledgeConsole();
        await utilGrid.clearFilter();
        await utilGrid.searchRecord(knowledgeTitle);
        expect(await KnowledgeConsolePage.isValueDisplayedInGrid('Knowledge Set')).toContain('HR', 'HR not display on Knowledge Console');
    });

    it('[DRDMV-1783]: [Knowledge Article] Access to the Create Knowledge view (Negative)', async () => {
        try {
            await navigationPage.signOut();
            await loginPage.login('sbadree');
            await navigationPage.switchToAnotherApplication(knowledgeManagementApp);
            await utilCommon.switchToNewWidnow(1);
            expect(KnowledgeConsolePage.getMessageOfAccess()).toContain('You do not have access to the Knowledge management application.');
        }
        catch (e) {
            throw e;
        }
        finally {
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('peter');
        }
    });

    it('[DRDMV-2887]: [Knowledge Article] Adding/Modifying location data while creating knowledge articles - site, region', async () => {
        try{
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
        await createKnowledgePage.clickOnviewArticleLinkButton();
        await utilCommon.switchToNewWidnow(1);
        expect(await viewKnowledgeArticlePo.getRegionValue()).toBe('Australia');
        expect(await viewKnowledgeArticlePo.getSiteValue()).toBe('Melbourne');
        await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
        await editKnowledgePage.selectRegionDropDownOption('EMEA');
        await editKnowledgePage.selectSiteDropDownOption('Barcelona 1');
        await editKnowledgePage.saveKnowledgeMedataDataChanges();
        expect(await viewKnowledgeArticlePo.getRegionValue()).toBe('EMEA');
        expect(await viewKnowledgeArticlePo.getSiteValue()).toBe('Barcelona 1');
        await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
        await editKnowledgePage.removeRegionValue();
        await editKnowledgePage.saveKnowledgeMedataDataChanges();
        expect(await viewKnowledgeArticlePo.getRegionValue()).toBe('');
        expect(await viewKnowledgeArticlePo.getSiteValue()).toBe('');
        await utilCommon.switchToDefaultWindowClosingOtherTabs();
        await previewKnowledgePo.clickOnBackButton();
        await navigationPage.gotoCreateKnowledge();
        await createKnowledgePage.clickOnTemplate('Reference');
        await createKnowledgePage.clickOnUseSelectedTemplateButton();
        let knowledgeNewTitle = 'knowledgeNew2887' + randomStr;
        await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeNewTitle);
        await createKnowledgePage.selectKnowledgeSet('HR');
        await createKnowledgePage.selectRegionDropDownOption('Australia');
        await createKnowledgePage.clickOnSaveKnowledgeButton();
        await createKnowledgePage.clickOnviewArticleLinkButton();
        await utilCommon.switchToNewWidnow(1);
        await viewKnowledgeArticlePo.isEditLinkDisplayedOnKA();
        expect(await viewKnowledgeArticlePo.getRegionValue()).toBe('Australia');
    }
    catch (e) {
        throw e;
    }
    finally {
        await utilCommon.switchToDefaultWindowClosingOtherTabs();
        await previewKnowledgePo.clickOnBackButton();
    }
},150*1000);
})
