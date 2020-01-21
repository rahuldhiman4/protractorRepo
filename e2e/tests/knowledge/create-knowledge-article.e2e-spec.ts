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

describe('Knowledge Article', () => {
    const EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    const businessDataFile = require('../../data/ui/foundation/businessUnit.ui.json');
    const departmentDataFile = require('../../data/ui/foundation/department.ui.json');
    const supportGrpDataFile = require('../../data/ui/foundation/supportGroup.ui.json');
    const personDataFile = require('../../data/ui/foundation/person.ui.json');
    const domainTagDataFile = require('../../data/ui/foundation/domainTag.ui.json');

    beforeAll(async () => {
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
        await loginPage.login('peter');
        await foundationData('Petramco');
        await foundationData19501('Petramco');
        await foundationData19082('Petramco');
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    afterEach(async () => {
        await browser.refresh();
        await utilCommon.waitUntilSpinnerToHide();
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
        catch (Error) {
            console.log(Error);
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
        catch (Error) {
            console.log(Error);
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
            await editKnowledgePage.editKnowledgeMedataData();
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
        catch (Error) {
            console.log(Error);
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
        catch (Error) {
            console.log(Error);
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
            await createKnowledgePage.verifyAssignmentFieldsPresentAndDisabled('Assigned Company');
            await createKnowledgePage.verifyAssignmentFieldsPresentAndDisabled('Business Unit');
            await createKnowledgePage.verifyAssignmentFieldsPresentAndDisabled('Department');
            await createKnowledgePage.verifyAssignmentFieldsPresentAndDisabled('Assigned Group');
            await createKnowledgePage.verifyAssignmentFieldsPresentAndDisabled('Assigned To');
            await createKnowledgePage.clickAssignToMeButton();
            await changeAssignmentBlade.verifyMultipleSupportGrpMessageDisplayed();
            await changeAssignmentBlade.selectCompany(knowledgeData.Company);
            await changeAssignmentBlade.selectBusinessUnit(businessData2.orgName);
            await changeAssignmentBlade.selectDepartment(departmentData2.orgName);
            await changeAssignmentBlade.selectSupportGroup(suppGrpData2.orgName);
            await changeAssignmentBlade.clickOnAssignButton();
            await createKnowledgePage.clickOnSaveKnowledgeButton();
        }
        catch (Error) {
            console.log(Error);
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

        } catch (Error) {
            console.log(Error);
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('peter');
        }
    });
})
