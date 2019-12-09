import { browser, protractor, ProtractorExpectedConditions } from "protractor";
import loginPage from "../../pageobject/login.po";
import navigationPage from "../../pageobject/navigation.po";
import changeAssignmentBlade from "../../pageobject/change-assignemet-blade.po";
import createKnowledgePage from "../../pageobject/knowledge/create-knowlege.po"
import apiHelper from '../../api/api.helper';
import apiCoreUtil from '../../api/api.core.util';

describe('Knowledge Article', () => {
    const EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    const businessDataFile = require('../../data/ui/foundation/businessUnit.ui.json');
    const departmentDataFile = require('../../data/ui/foundation/department.ui.json');
    const supportGrpDataFile = require('../../data/ui/foundation/supportGroup.ui.json');
    const personDataFile = require('../../data/ui/foundation/person.ui.json');

    beforeAll(async () => {
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
        await loginPage.login('qkatawazi');
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

    it('DRDMV-19020 - On Create KA, Change Assignment blade should process properly on KA', async () => {
        let businessData = businessDataFile['BusinessUnitData']; 
        let departmentData = departmentDataFile['DepartmentData'];
        let suppGrpData = supportGrpDataFile['SuppGrpData'];
        let personData = personDataFile['PersonData'];
        let knowledgeDataFile = require("../../data/ui/knowledge/knowledgeArticle.ui.json")
        let knowledgeData = knowledgeDataFile['DRDMV-19020'];
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
