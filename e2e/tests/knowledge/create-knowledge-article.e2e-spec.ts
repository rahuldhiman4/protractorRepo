import { browser, protractor, ProtractorExpectedConditions } from "protractor";
import loginPage from "../../pageobject/login.po";
import navigationPage from "../../pageobject/navigation.po";
import changeAssignmentBlade from "../../pageobject/change-assignemet-blade.po";
import createKnowledgePage from "../../pageobject/knowledge/create-knowlege.po"
import editKnowledgePage from "../../pageobject/knowledge/edit-knowledge.po";
import apiHelper from '../../api/api.helper';
import apiCoreUtil from '../../api/api.core.util';
import utilCommon from '../../utils/ui/util.common';

describe('Knowledge Article', () => {
    const EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    const businessDataFile = require('../../data/ui/foundation/businessUnit.ui.json');
    const departmentDataFile = require('../../data/ui/foundation/department.ui.json');
    const supportGrpDataFile = require('../../data/ui/foundation/supportGroup.ui.json');
    const personDataFile = require('../../data/ui/foundation/person.ui.json');

    beforeAll(async () => {
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
        await loginPage.login('peter');
        await foundationData('Petramco');
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    afterEach(async()=>{
        await browser.refresh();
    });

    async function foundationData(company:string){
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
        await apiHelper.associatePersonToSupportGroup(personData.userId,suppGrpData.orgName);
        await apiHelper.associatePersonToCompany(personData.userId,company)
    }

    it('DRDMV-19020 - On Create KA, Assign to me button should process properly on KA', async () => {
        try{
        let suppGrpData = supportGrpDataFile['SuppGrpData'];
        let personData = personDataFile['PersonData'];
        let knowledgeDataFile = require("../../data/ui/knowledge/knowledgeArticle.ui.json")
        let knowledgeData = knowledgeDataFile['DRDMV-19020'];
        await navigationPage.signOut();
        await loginPage.login(personData.userId);
        await navigationPage.gotoCreateKnowledge();
        await createKnowledgePage.clickOnTemplate(knowledgeData.TemplateName);
        await createKnowledgePage.clickOnUseSelectedTemplateButton();
        await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeData.KnowledgeTitle);
        await createKnowledgePage.selectKnowledgeSet(knowledgeData.KnowledgeSet);
        await createKnowledgePage.clickAssignToMeButton();
        await createKnowledgePage.clickOnSaveKnowledgeButton();
        await createKnowledgePage.clickOnviewArticleLinkButton();
        await utilCommon.switchToNewWidnow(1);
        let assigneeFullName = personData.firstName+" "+personData.lastName;
        await editKnowledgePage.verifyKnowledgeMetadata('Assignee',assigneeFullName);
        await editKnowledgePage.verifyKnowledgeMetadata('Assigned Group',suppGrpData.orgName);
        }
        catch(Error){
            console.log(Error);}
            finally{
                await utilCommon.switchToDefaultWindowClosingOtherTabs();
                await browser.refresh();
                await navigationPage.signOut();
                await loginPage.login('peter');
            }
    });

    it('DRDMV-19079 - Change Reviewer blade should process properly on KA', async () => {
        try{
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
        await utilCommon.waitUntilSuccessMessageDisappear();
        await editKnowledgePage.setKnowledgeStatusWithoutSave(knowledgeData.ReviewStatus);
        expect (await editKnowledgePage.isReviewerCompanyFieldDisbaledOnStatusChangeBlade()).toBeTruthy();
        expect (await editKnowledgePage.isReviewerBusinessUnitFieldDisbaledOnStatusChangeBlade()).toBeTruthy();
        expect (await editKnowledgePage.isReviewerDepartmentfieldDisbaledOnStatusChangeBlade()).toBeTruthy();
        expect (await editKnowledgePage.isReviewerGrpFieldDisbaledOnStatusChangeBlade()).toBeTruthy();
        expect (await editKnowledgePage.isReviewerFieldDisbaledOnStatusChangeBlade()).toBeTruthy();
        expect (await editKnowledgePage.isChangeReviewerButtonPresent()).toBeTruthy();
        expect (await editKnowledgePage.isAssignToMeButtonPresent()).toBeTruthy();
        await editKnowledgePage.clickChangeReviewerBtn();
        await changeAssignmentBlade.selectCompany(knowledgeData.Company);
        await changeAssignmentBlade.selectBusinessUnit(businessData.orgName);
        await changeAssignmentBlade.selectDepartment(departmentData.orgName);
        await changeAssignmentBlade.selectSupportGroup(suppGrpData.orgName);
        await changeAssignmentBlade.selectAssignee(personData.firstName);
        await changeAssignmentBlade.clickOnAssignButton();
        await browser.sleep(1000);
        await editKnowledgePage.clickSaveStatusBtn();
        await utilCommon.waitUntilSuccessMessageDisappear();
        await editKnowledgePage.isReviewPendingButtonDisplayed();
        }
        catch(Error){
            console.log(Error);}
            finally{
                await utilCommon.switchToDefaultWindowClosingOtherTabs();
            }
    });

    it('DRDMV-19080 - On Edit KA, Change Assignment blade should process properly ', async () => {
        try{
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
        let assigneeFullName = personData.firstName+" "+personData.lastName;
        await editKnowledgePage.verifyKnowledgeMetadata('Assignee',assigneeFullName);
        await editKnowledgePage.verifyKnowledgeMetadata('Assigned Group',suppGrpData.orgName);
        }
        catch(Error){
            console.log(Error);}
            finally{
                await utilCommon.switchToDefaultWindowClosingOtherTabs();
            }
    });

    it('DRDMV-19081 - Assignment fields is not available on Status Change blade except when Status= SME Review', async () => {
        try{
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
        catch(Error){
            console.log(Error);}
            finally{
                await utilCommon.switchToDefaultWindowClosingOtherTabs();
            }
    });

    it('DRDMV-19508 - On Create KA, Change Assignment blade should process properly', async () => {
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

    it('DRDMV-19081 - Assignment fields is not available on Status Change blade except when Status= SME Review', async () => {
        let knowledgeDataFile = require("../../data/ui/knowledge/knowledgeArticle.ui.json")
        let knowledgeData = knowledgeDataFile['DRDMV-19081'];
        await navigationPage.gotoCreateKnowledge();
        await createKnowledgePage.clickOnTemplate(knowledgeData.TemplateName);
        await createKnowledgePage.clickOnUseSelectedTemplateButton();
        await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeData.KnowledgeTitle);
        await createKnowledgePage.selectKnowledgeSet(knowledgeData.KnowledgeSet);
    });
})
