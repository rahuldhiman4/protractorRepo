import { browser, protractor, ProtractorExpectedConditions } from "protractor";
import apiCoreUtil from '../../api/api.core.util';
import apiHelper from '../../api/api.helper';
import changeAssignmentBlade from "../../pageobject/common/change-assignment.po";
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
        // await foundationData('Petramco');
        // await foundationData19501('Petramco');
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

    async function foundationData(company: string) {
        await apiHelper.apiLogin('tadmin');
        let businessData = businessDataFile['BusinessUnitData'];
        let departmentData = departmentDataFile['DepartmentData'];
        let suppGrpData = supportGrpDataFile['SuppGrpData'];
        let personData = personDataFile['PersonData'];
        businessData.relatedOrgId = company;
        let businessUnitId = await apiHelper.createBusinessUnit(businessData);
        departmentData.relatedOrgId = businessUnitId;
        let depId = await apiHelper.createDepartment(departmentData);
        suppGrpData.relatedOrgId = depId;
        await apiHelper.createSupportGroup(suppGrpData);
        await apiHelper.createNewUser(personData);
        await apiHelper.associatePersonToSupportGroup(personData.userId, suppGrpData.orgName);
        await apiHelper.associatePersonToCompany(personData.userId, company)
    }

    it('[3905]: On Create KA, Assign to me button should process properly on KA', async () => {
        try {
            let knowledgeDataFile = require("../../data/ui/knowledge/knowledgeArticle.ui.json")
            let knowledgeData = knowledgeDataFile['3905'];
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
            expect(await editKnowledgePage.getKnowledgeMetaDataValue('Assignee')).toBe('Qadim Katawazi');
            expect(await editKnowledgePage.getKnowledgeMetaDataValue('Assigned Group')).toBe('US Support 3');
        }
        catch (error) {
            throw error;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('peter');
        }
    });
   
    describe('[3904]: Change Reviewer blade should process properly on KA', async () => {
        it('[3904]: Change Reviewer blade should process properly on KA', async () => {
            let businessData = businessDataFile['BusinessUnitData'];
            let departmentData = departmentDataFile['DepartmentData'];
            let suppGrpData = supportGrpDataFile['SuppGrpData'];
            let personData = personDataFile['PersonData'];
            let knowledgeDataFile = require("../../data/ui/knowledge/knowledgeArticle.ui.json")
            let knowledgeData = knowledgeDataFile['3904'];
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
            expect(await editKnowledgePage.isReviewerFieldDisbaledOnStatusChangeBlade()).toBeTruthy(); //done status
            await changeAssignmentBlade.setDropDownValue('AssignedGroup', 'US Support 3');
            await changeAssignmentBlade.setDropDownValue('Assignee', 'Qadim Katawazi');
            await editKnowledgePage.clickSaveStatusBtn();
            await utilityCommon.closePopUpMessage();
            await editKnowledgePage.isReviewPendingButtonDisplayed();
        })
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
        });
    });
   
    describe('[3903]: On Edit KA, Change Assignment blade should process properly ', async () => {
        it('[3903]: On Edit KA, Change Assignment blade should process properly ', async () => {
            let businessData = businessDataFile['BusinessUnitData'];
            let departmentData = departmentDataFile['DepartmentData'];
            let suppGrpData = supportGrpDataFile['SuppGrpData'];
            let personData = personDataFile['PersonData'];
            let knowledgeDataFile = require("../../data/ui/knowledge/knowledgeArticle.ui.json")
            let knowledgeData = knowledgeDataFile['3903'];
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate(knowledgeData.TemplateName);
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeData.KnowledgeTitle);
            await createKnowledgePage.selectKnowledgeSet(knowledgeData.KnowledgeSet);
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await previewKnowledgePo.clickGoToArticleButton();
            expect(await viewKnowledgeArticlePo.isEditLinkDisplayedOnKA()).toBeTruthy();
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            await changeAssignmentBlade.setDropDownValue('AssignedGroup', 'US Support 3');
            await changeAssignmentBlade.setDropDownValue('Assignee', "Qadim Katawazi");
            await editKnowledgePage.saveKnowledgeMedataDataChanges();
            //let assigneeFullName = personData.firstName + " " + personData.lastName;
            expect(await editKnowledgePage.getKnowledgeMetaDataValue('Assignee')).toBe("Qadim Katawazi");
            expect(await editKnowledgePage.getKnowledgeMetaDataValue('Assigned Group')).toBe("US Support 3");
        });
        afterAll(async () => {
            await utilityCommon.closePopUpMessage();
            await utilityCommon.closeAllBlades();
        });
    });

    it('[3902]: Assignment fields is not available on Status Change blade except when Status= SME Review', async () => {
        await navigationPage.gotoKnowledgeConsole();
        await navigationPage.signOut();
        await loginPage.login('elizabeth');
        let knowledgeDataFile = require("../../data/ui/knowledge/knowledgeArticle.ui.json")
        let knowledgeData = knowledgeDataFile['3902'];
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
    
    it('[3852]: On Create KA, Change Assignment blade should process properly', async () => {
        await navigationPage.signOut();
        await loginPage.login('peter');
        let businessData = businessDataFile['BusinessUnitData'];
        let suppGrpData = supportGrpDataFile['SuppGrpData'];
        let personData = personDataFile['PersonData'];
        let knowledgeDataFile = require("../../data/ui/knowledge/knowledgeArticle.ui.json")
        let knowledgeData = knowledgeDataFile['3852'];
        await navigationPage.gotoCreateKnowledge();
        await createKnowledgePage.clickOnTemplate(knowledgeData.TemplateName);
        await createKnowledgePage.clickOnUseSelectedTemplateButton();
        await createKnowledgePage.selectKnowledgeSet('HR');
        expect(await changeAssignmentBlade.isDropDownDisplayed("AssignedGroup")).toBeTruthy("SupportGroup dropdown not displayed");
        await changeAssignmentBlade.setDropDownValue('AssignedGroup', 'US Support 3');
        await changeAssignmentBlade.setDropDownValue('Assignee', 'Qadim Katawazi');
    });

    async function foundationData19501(company: string) {
        await apiHelper.apiLogin('tadmin');
        let businessData = businessDataFile['BusinessUnitData19501'];
        let departmentData = departmentDataFile['DepartmentData19501'];
        let suppGrpData = supportGrpDataFile['SuppGrpData19501'];
        let personData = personDataFile['PersonData'];   //Associate the existing person to new orgs
        businessData.relatedOrgId = company;
        let businessUnitId = await apiHelper.createBusinessUnit(businessData);
        departmentData.relatedOrgId = businessUnitId;
        let depId = await apiHelper.createDepartment(departmentData);
        suppGrpData.relatedOrgId = depId;
        await apiHelper.createSupportGroup(suppGrpData);
        await apiHelper.associatePersonToSupportGroup(personData.userId, suppGrpData.orgName);
        await apiHelper.associatePersonToCompany(personData.userId, company)
    }
    
    describe('[3853]: On Create KA, Agent having access to multiple support groups on "Assign to me" click should process properly on KA', async () => {
        it('[3853]: On Create KA, Agent having access to multiple support groups on "Assign to me" click should process properly on KA', async () => {
            let businessData2 = businessDataFile['BusinessUnitData19501'];
            let departmentData2 = departmentDataFile['DepartmentData19501'];
            let suppGrpData2 = supportGrpDataFile['SuppGrpData19501'];
            let personData = personDataFile['PersonData'];  //This person is associated to 2 given support grps as created is beforeall method
            let knowledgeDataFile = require("../../data/ui/knowledge/knowledgeArticle.ui.json")
            let knowledgeData = knowledgeDataFile['3853'];
            await navigationPage.signOut();
            await loginPage.login('awarlock');
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate(knowledgeData.TemplateName);
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeData.KnowledgeTitle);
            await createKnowledgePage.selectKnowledgeSet(knowledgeData.KnowledgeSet);
            expect(await createKnowledgePage.isAssignmentFieldDisabled('Assigned Company')).toBeFalsy('Assign Field is enabled');
            expect(await createKnowledgePage.isAssignmentFieldDisabled('Business Unit')).toBeFalsy('Assign Field is enabled');
            expect(await createKnowledgePage.isAssignmentFieldDisabled('Assigned Group')).toBeFalsy('Assign Field is enabled');
            expect(await createKnowledgePage.isAssignedToFieldDisabled('Assigned To')).toBeFalsy('Assign Field is enabled');
            await createKnowledgePage.clickAssignToMeButton();
            let assignedGroupList: string[] = await changeAssignmentBlade.getAllDropDownValues("AssignedGroup");
            expect(assignedGroupList.length).toBeGreaterThanOrEqual(2);
            await changeAssignmentBlade.setDropDownValue('AssignedGroup', 'AU Support 4');
            await changeAssignmentBlade.setDropDownValue('Assignee', 'Adam Warlock')
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await previewKnowledgePo.clickGoToArticleButton();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('peter');
        });
    });

    it('[6380,6390]: [KM-BWF integration] [Knowledge Article] Mandatory fields of the Create Knowledge Article view', async () => {
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
            let knowledgeIdValue: string = await previewKnowledgePo.getKnowledgeArticleID();
            await previewKnowledgePo.clickOnBackButton();
            await navigationPage.gotoKnowledgeConsole();
            await utilityGrid.clearFilter();
            await browser.sleep(50000); //time required for article to be visible on knowledge console
            await knowledgeArticlesConsolePo.searchKnowledgeArticle(knowledgeTitle);
            await expect(utilityGrid.isGridRecordPresent(knowledgeIdValue.trim())).toBeTruthy(`${knowledgeIdValue.trim()} is not present`);
        } catch (error) {
            throw error;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('peter');
        }
    });
    //defect-  DRDMV-24965
    it('[5702]: Review article in SME Review status & Approve article', async () => {
        try {
            let knowledgeTitile = 'knowledge5058' + randomStr;
            await apiHelper.apiLogin(knowledgePublisherUser);
            let articleData = {
                "knowledgeSet": "HR",
                "title": `${knowledgeTitile}`,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United Kingdom Support",
                "assigneeSupportGroup": "GB Support 2",
                "assignee": "KMills"
            }
            let KADetails = await apiHelper.createKnowledgeArticle(articleData);
            expect(await apiHelper.updateKnowledgeArticleStatus(KADetails.id, "Draft")).toBeTruthy("Article with Draft status not updated.");
            expect(await apiHelper.updateKnowledgeArticleStatus(KADetails.id, "SMEReview", "KMills", "GB Support 2", "Petramco")).toBeTruthy("Article with SME Review status not updated.");
            await navigationPage.signOut();
            await loginPage.login('kmills');
            await navigationPage.switchToApplication(knowledgeManagementApp);
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
            await navigationPage.gotoKnowledgeConsole(true);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(KADetails.displayId);
            expect(await viewKnowledgeArticlePo.getStatusValue()).toContain('Published', 'value is not matched with status');
            await viewKnowledgeArticlePo.clickOnTab('Activity');
            expect(await activityTabPo.getFirstPostContent()).toContain('Kyle Mills reviewed this article and provided this comment');
            expect(await activityTabPo.getFirstPostContent()).toContain(knowledgeTitile)
            await navigationPage.gotoKnowledgeConsole(true);
            await utilityGrid.clearFilter();
            await utilityGrid.searchRecord(KADetails.displayId);
            expect(await knowledgeArticlesConsolePo.isValueDisplayedInGrid('Review Status')).toContain('Reviewed');
            await knowledgeArticlesConsolePo.removeColumnOnGrid(columnName);
        }
        catch (e) {
            throw e;
        }
        finally {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('peter');
        }
    });

    it('[5701]: Review article in SME Review status & Reject article', async () => {
        try {
            let knowledgeTitile = 'knowledge5059' + randomStr;
            await apiHelper.apiLogin(knowledgePublisherUser);
            let articleData = {
                "knowledgeSet": "HR",
                "title": `${knowledgeTitile}`,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United Kingdom Support",
                "assigneeSupportGroup": "GB Support 2",
                "assignee": "KMills"
            }
            let KADetails = await apiHelper.createKnowledgeArticle(articleData);
            expect(await apiHelper.updateKnowledgeArticleStatus(KADetails.id, "Draft")).toBeTruthy("Article with Draft status not updated.");
            expect(await apiHelper.updateKnowledgeArticleStatus(KADetails.id, "SMEReview", "KMills", "GB Support 2", "Petramco")).toBeTruthy("Article with SME Review status not updated.");
            await navigationPage.signOut();
            await loginPage.login('kmills');
            await navigationPage.switchToApplication(knowledgeManagementApp);
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
            await navigationPage.gotoKnowledgeConsole(true);
            await utilityGrid.clearFilter();
            await utilityGrid.searchRecord(KADetails.displayId);
            expect(await knowledgeArticlesConsolePo.isValueDisplayedInGrid('Review Status')).toContain('Reviewed');
            await knowledgeArticlesConsolePo.removeColumnOnGrid(knowledgeGridColumnFields);
        }
        catch (e) {
            throw e;
        }
        finally {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('peter');
        }
    });

    it('[6000]: Assign SME - Reviewer assignment UI validation', async () => {
        try {
            let knowledgeTitile = 'knowledge2433' + randomStr;
            await apiHelper.apiLogin(knowledgePublisherUser);
            let articleData = {
                "knowledgeSet": "HR",
                "title": `${knowledgeTitile}`,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United Kingdom Support",
                "assigneeSupportGroup": "GB Support 2",
                "assignee": "KMills"
            }
            let KADetails = await apiHelper.createKnowledgeArticle(articleData);
            expect(await apiHelper.updateKnowledgeArticleStatus(KADetails.id, "Draft")).toBeTruthy("Article with Draft status not updated.");
            await navigationPage.signOut();
            await loginPage.login('kmills');
            await navigationPage.switchToApplication(knowledgeManagementApp);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(KADetails.displayId);
            await statusBladeKnowledgeArticlePo.setKnowledgeStatusWithReviewerDetails('SME Review', 'Petramco', 'HR Support', 'Compensation and Benefits', 'Peter Kahn');
            await utilityCommon.closePopUpMessage();
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            expect(await editKnowledgePage.getKnowledgeReviewHeader()).toContain('Knowledge Review');
            await changeAssignmentBlade.setDropDownValue('AssignedGroup', 'AU Support 3', changeAssignmentBlade.selectors.knowledgeReviewGuid);
            await changeAssignmentBlade.setDropDownValue('Assignee', 'Kane Williamson', changeAssignmentBlade.selectors.knowledgeReviewGuid);
            expect(await editKnowledgePage.getReviewerValue()).toContain('Kane Williamson', 'Reviewer not matched with expected');
            await editKnowledgePage.saveKnowledgeMedataDataChanges();
            await utilityCommon.closePopUpMessage();
        }
        catch (e) {
            throw e;
        }
        finally {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('peter');
        }
    });
    //DRDMV-25171
    it('[6069]: [Article Creation] Ability to select the knowledge set during article creation', async () => {
        let knowledgeTitle = 'knowledgeCoachUser1914' + randomStr;
        await navigationPage.gotoKnowledgeConsole();
        await navigationPage.gotoCreateKnowledge();
        expect(await createKnowledgePage.isTemplatePresent('KCS')).toBeTruthy('Template is not present');
        expect(await createKnowledgePage.isTemplatePresent('Reference')).toBeTruthy('Template is not present');
        expect(await createKnowledgePage.isTemplatePresent('How To')).toBeTruthy('Template is not present');
        await createKnowledgePage.clickOnTemplate('Reference');
        await createKnowledgePage.clickOnUseSelectedTemplateButton();
        await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeTitle);
        await createKnowledgePage.selectCategoryTier1Option('Employee Relations');
        await createKnowledgePage.selectCategoryTier2Option('Compensation');
        await createKnowledgePage.selectCategoryTier3Option('Bonus');
        expect(await createKnowledgePage.isSaveButtonEnabled()).toBeFalsy('Save Button is enabled');
        await createKnowledgePage.selectKnowledgeSet('HR');
        await createKnowledgePage.selectRegionDropDownOption('Americas');
        await createKnowledgePage.selectSiteGroupDropDownOption('Human Resources')
        await createKnowledgePage.selectSiteDropDownOption('Houston');
        await createKnowledgePage.setReferenceValue('reference values are as follows');
        expect(await createKnowledgePage.getKnowledgeArticleTitleValue()).toContain(knowledgeTitle, 'expected Value not present');
        expect(await createKnowledgePage.getValueOfCategoryTier1()).toContain('Employee Relations', 'value not matched with expected');
        expect(await createKnowledgePage.getValueOfCategoryTier2()).toContain('Compensation', 'value not matched with expected');
        expect(await createKnowledgePage.getValueOfCategoryTier3()).toContain('Bonus', 'value not matched with expected');
        expect(await createKnowledgePage.getKnowledgeSetValue()).toContain('HR', 'expected Value not present');
        expect(await createKnowledgePage.isSaveButtonEnabled()).toBeTruthy('Save Button is disabled');
        await createKnowledgePage.clickOnSaveKnowledgeButton();
        await previewKnowledgePo.clickOnBackButton();
        await navigationPage.gotoKnowledgeConsole();
        await utilityGrid.clearFilter();
        await utilityGrid.searchRecord(knowledgeTitle);
        await utilityGrid.addGridColumn(["Knowledge Set"]);
        expect(await knowledgeArticlesConsolePo.isValueDisplayedInGrid('Knowledge Set')).toContain('HR', 'HR not display on Knowledge Console');
    });

    it('[6076]: [Knowledge Article] Access to the Create Knowledge view (Negative)', async () => {
        try {
            await navigationPage.signOut();
            await loginPage.login('sbadree');
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getMessageOfAccess()).toContain('You do not have access to the Knowledge management application.');
        }
        catch (e) {
            throw e;
        }
        finally {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('peter');
        }
    });
//DRDMV-25260
    it('[5899]: [Knowledge Article] Adding/Modifying location data while creating knowledge articles - site, region', async () => {
        try {
            let knowledgeTitle = 'knowledge2887' + randomStr;
            await navigationPage.gotoKnowledgeConsole();
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate('Reference');
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeTitle);
            await createKnowledgePage.selectKnowledgeSet('HR');
            await createKnowledgePage.selectRegionDropDownOption('Americas');
            await createKnowledgePage.selectSiteGroupDropDownOption('Human Resources');
            await createKnowledgePage.selectSiteDropDownOption('Houston');
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await previewKnowledgePo.clickGoToArticleButton();
            expect(await viewKnowledgeArticlePo.getRegionValue()).toBe('Americas');
            expect(await viewKnowledgeArticlePo.getSiteGroupValue()).toBe('Human Resources');
            expect(await viewKnowledgeArticlePo.getSiteValue()).toBe('Houston');
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            await editKnowledgePage.selectRegionDropDownOption('Asia-Pac');
            await editKnowledgePage.selectSiteGroupDropDownOption('Engineering')
            await editKnowledgePage.selectSiteDropDownOption('Canberra');
            await editKnowledgePage.saveKnowledgeMedataDataChanges();
            await utilityCommon.closePopUpMessage();
            expect(await viewKnowledgeArticlePo.getRegionValue()).toBe('Asia-Pac');
            expect(await viewKnowledgeArticlePo.getSiteValue()).toBe('Canberra');
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            await editKnowledgePage.removeRegionValue();
            await editKnowledgePage.removeSiteValue();
            await editKnowledgePage.saveKnowledgeMedataDataChanges();
            await utilityCommon.closePopUpMessage();
            expect(await viewKnowledgeArticlePo.getRegionValue()).toBe('-');
            expect(await viewKnowledgeArticlePo.getSiteValueAfterClear()).toBe('-');
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate('Reference');
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            let knowledgeNewTitle = 'knowledgeNew2887' + randomStr;
            await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeNewTitle);
            await createKnowledgePage.selectKnowledgeSet('HR');
            await createKnowledgePage.selectRegionDropDownOption('Americas');
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await previewKnowledgePo.clickGoToArticleButton();
            await viewKnowledgeArticlePo.isEditLinkDisplayedOnKA();
            expect(await viewKnowledgeArticlePo.getRegionValue()).toBe('Americas');
        }
        catch (e) {
            throw e;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('peter');
        }
    });

    describe('[6350]: [Permissions] Settings menu for Knowledge Functional Roles', () => {
        it('[6350]: [Permissions] Settings menu for Knowledge Functional Roles', async () => {
            //Validation of Knowledge Coach Settings Permission
            await navigationPage.signOut();
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToApplication('Knowledge Management');
            await navigationPage.gotoSettingsPage();
            let knowledgeManagementList: string[] = ['Approvals', 'Article Template Styles', 'Article Templates', 'Knowledge Sets', 'Notes Template', 'Status Configuration', 'Knowledge Management'];
            expect(await navigationPage.isSettingSubMenusMatches("Knowledge Management", knowledgeManagementList)).toBeTruthy("Sub menu items not matching");
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.switchToApplication('Knowledge Management');
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.isSettingSubMenusMatches("Knowledge Management", knowledgeManagementList)).toBeTruthy("Sub menu items not matching");
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();

            //Validation of Knowledge Publisher Settings Permission
            await navigationPage.signOut();
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.isSettingPanelTextMatches(" No matches found ")).toBeTruthy();
            await navigationPage.switchToApplication('Knowledge Management');
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.isSettingPanelTextMatches(" No matches found ")).toBeTruthy();
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        });

        it('[6350]: [Permissions] Settings menu for Knowledge Functional Roles', async () => {
            //Validation of Knowledge Contributor Settings Permission
            await navigationPage.signOut();
            await loginPage.login(knowledgeContributorUser);
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.isSettingPanelTextMatches(" No matches found ")).toBeTruthy();
            await navigationPage.switchToApplication('Knowledge Management');
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.isSettingPanelTextMatches(" No matches found ")).toBeTruthy();
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();

            //Validation of Knowledge Candidate Settings Permission
            await navigationPage.signOut();
            await loginPage.login(knowledgeCandidateUser);
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.isSettingPanelTextMatches(" No matches found ")).toBeTruthy();
            await navigationPage.switchToApplication('Knowledge Management');
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.isSettingPanelTextMatches(" No matches found ")).toBeTruthy();
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        });
    });

    describe('[5882]: Article creation and possible status changes - Knowledge Publisher & Coach', async () => {
        let KADetails, KACoachDetails, articleDataCoach;
        beforeAll(async () => {
            await apiHelper.apiLogin("elizabeth");
            apiHelper.deleteApprovalMapping(knowledgeModule);
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
                "assigneeBusinessUnit": "United Kingdom Support",
                "assigneeSupportGroup": "GB Support 2",
                "assignee": "KMills",
            }
            await apiHelper.apiLogin("elizabeth");
            KACoachDetails = await apiHelper.createKnowledgeArticle(articleDataCoach);
        });
        it('[5882]: Article creation and possible status changes - Knowledge Publisher & Coach', async () => {
            await navigationPage.signOut();
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(KADetails.displayId);
            await editKnowledgePage.setKnowledgeStatus('Draft');
            await utilityCommon.closePopUpMessage();
            expect(await editKnowledgePage.getStatusValue()).toContain('Draft', 'Status not Set');
            await navigationPage.gotoKnowledgeConsole(true);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(KADetails.displayId);
            expect(await editKnowledgePage.getStatusValue()).toContain('Draft', 'Status not Set');
            await statusBladeKnowledgeArticlePo.setKnowledgeStatusWithReviewerDetails('SME Review', 'Petramco', 'Australia Support', 'AU Support 3', 'Kane Williamson')
            await utilityCommon.closePopUpMessage();
            expect(await editKnowledgePage.getStatusValue()).toContain('SME Review', 'Status not Set');
            await navigationPage.gotoKnowledgeConsole(true);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(KADetails.displayId);
            expect(await editKnowledgePage.getStatusValue()).toContain('SME Review', 'Status not Set');
            await viewKnowledgeArticlePo.clickOnKAUsefulYesButton();
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        });
        it('[5882]: Article creation and possible status changes - Knowledge Publisher & Coach', async () => {
            await navigationPage.signOut();
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(KADetails.displayId);
            expect(await viewKnowledgeArticlePo.isReviewMessageDisplayed('Knowledge Article is in Review')).toBeTruthy();
            await viewKnowledgeArticlePo.clickReviewPendingLink();
            await reviewCommentsPo.setTextInTellUsMore(KADetails.displayId);
            await reviewCommentsPo.clickApprovedButton();
            await utilityCommon.closePopUpMessage();
            await utilityCommon.closePopUpMessage();
            await viewKnowledgeArticlePo.clickOnKAUsefulYesButton();
            expect(await editKnowledgePage.getStatusValue()).toContain('Published', 'Status not Set');
            await editKnowledgePage.setKnowledgeStatus('Retire Approval');
            await utilityCommon.closePopUpMessage();
            await utilityCommon.closePopUpMessage();
            await navigationPage.gotoKnowledgeConsole(true);
            await utilityGrid.searchAndOpenHyperlink(KADetails.displayId);
            expect(await editKnowledgePage.getStatusValue()).toContain('Retired', 'Status not Set');
            await editKnowledgePage.setClosedKnowledgeStatus('Closed');
            await utilityCommon.closePopUpMessage();
            expect(await editKnowledgePage.getStatusValue()).toContain('Closed', 'Status not Set');
        });
        it('[5882]: Article creation and possible status changes - Knowledge Publisher & Coach', async () => {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(KACoachDetails.displayId);
            await editKnowledgePage.setKnowledgeStatus('Draft');
            await utilityCommon.closePopUpMessage();
            expect(await editKnowledgePage.getStatusValue()).toContain('Draft', 'Status not Set');
            await navigationPage.gotoKnowledgeConsole(true);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(KACoachDetails.displayId);
            expect(await editKnowledgePage.getStatusValue()).toContain('Draft', 'Status not Set');
            await statusBladeKnowledgeArticlePo.setKnowledgeStatusWithReviewerDetails('SME Review', 'Petramco', 'HR Support', 'Compensation and Benefits', 'Elizabeth Peters')
            await utilityCommon.closePopUpMessage();
            expect(await editKnowledgePage.getStatusValue()).toContain('SME Review', 'Status not Set');
            await navigationPage.gotoKnowledgeConsole(true);
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(KACoachDetails.displayId);
            expect(await editKnowledgePage.getStatusValue()).toContain('SME Review', 'Status not Set');
            await viewKnowledgeArticlePo.clickOnKAUsefulYesButton();
        });
        it('[5882]: Article creation and possible status changes - Knowledge Publisher & Coach', async () => {
            await navigationPage.gotoKnowledgeConsole(true);
            await utilityGrid.searchAndOpenHyperlink(KACoachDetails.displayId);
            await viewKnowledgeArticlePo.clickReviewPendingLink();
            await reviewCommentsPo.setTextInTellUsMore(KACoachDetails.displayId);
            await reviewCommentsPo.clickApprovedButton();
            await utilityCommon.closePopUpMessage();
            await utilityCommon.closePopUpMessage();
            await viewKnowledgeArticlePo.clickOnKAUsefulYesButton();
            expect(await editKnowledgePage.getStatusValue()).toContain('Published', 'Status not Set');
            await editKnowledgePage.setKnowledgeStatus('Retire Approval');
            await utilityCommon.closePopUpMessage();
            await utilityCommon.closePopUpMessage();
            await navigationPage.gotoKnowledgeConsole(true);
            await utilityGrid.searchAndOpenHyperlink(KACoachDetails.displayId);
            expect(await editKnowledgePage.getStatusValue()).toContain('Retired', 'Status not Set');
            await editKnowledgePage.setClosedKnowledgeStatus('Closed');
            await utilityCommon.closePopUpMessage();
            expect(await editKnowledgePage.getStatusValue()).toContain('Closed', 'Status not Set');
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('peter');
        });
    });

    describe('[5842]: [Post Comments] Post Feedback on knowledge article', async () => {
        let displayID, knowledgeTitile;
        beforeAll(async () => {
            knowledgeTitile = 'knowledge3542' + randomStr;
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
        it('[5842]: [Post Comments] Post Feedback on knowledge article', async () => {
            await navigationPage.signOut();
            await loginPage.login(knowledgeCandidateUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
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
        it('[5842]: [Post Comments] Post Feedback on knowledge article', async () => {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            //login with contributor
            await loginPage.login(knowledgeContributorUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
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
        it('[5842]: [Post Comments] Post Feedback on knowledge article', async () => {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            //login with publisher
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
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
        it('[5842]: [Post Comments] Post Feedback on knowledge article', async () => {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            //login with publisher
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
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
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('peter');
        });
    });
})
