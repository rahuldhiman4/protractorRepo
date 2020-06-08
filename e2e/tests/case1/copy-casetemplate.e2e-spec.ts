import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import { ALL_FIELD, MANDATORY_FIELD } from '../../data/ui/case/casetemplate.data.ui';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import consoleCasetemplatePo from '../../pageobject/settings/case-management/console-casetemplate.po';
import copyCaseTemplate from "../../pageobject/settings/case-management/copy-casetemplate.po";
import createCaseTemplate from "../../pageobject/settings/case-management/create-casetemplate.po";
import editCaseTemplate from "../../pageobject/settings/case-management/edit-casetemplate.po";
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import viewCasetemplatePo from '../../pageobject/settings/case-management/view-casetemplate.po';
import utilGrid from '../../utils/util.grid';
import previewTaskTemplateCasesPo from '../../pageobject/settings/task-management/preview-task-template-cases.po';
import utilCommon from '../../utils/util.common';
import changeAssignmentOldPage from '../../pageobject/common/change-assignment-old-blade.po';
import apiCoreUtil from '../../api/api.core.util';

let caseTemplateAllFields = ALL_FIELD;
let caseTemplateRequiredFields = MANDATORY_FIELD;
let userData = undefined;

describe('Copy Case Template', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login("qkatawazi");
        await foundationData("Petramco");
        await apiHelper.apiLogin('tadmin');
        userData = {
            "firstName": "Petramco",
            "lastName": "withoutSG",
            "userId": "DRDMV-13550",
        }
        await apiHelper.createNewUser(userData);
        await apiHelper.associatePersonToCompany(userData.userId, "Petramco");
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    afterEach(async () => {
        await utilityCommon.refresh();
    });

    //ptidke
    it('[DRDMV-13551,DRDMV-13529]: Create a Copy of Case template where Company is copied properly', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        let caseTemplateName: string = caseTemplateAllFields.templateName + Math.floor(Math.random() * 100000);
        caseTemplateAllFields.templateName = caseTemplateName;
        await createCaseTemplate.createCaseTemplateWithAllFields(caseTemplateAllFields);
        let CasetemplateNew = await editCaseTemplate.getCaseTemplateID();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        await consoleCasetemplatePo.searchAndselectCaseTemplate(caseTemplateName);
        await consoleCasetemplatePo.clickOnCopyCaseTemplate();
        let copyCaseTemplateName: string = "copycasetemplate" + Math.floor(Math.random() * 10000000);
        await copyCaseTemplate.setTemplateName(copyCaseTemplateName);
        //verify all values copied from template 1 to template 2   
        expect(await copyCaseTemplate.isValueOfCasePriorityPresent(caseTemplateAllFields.casePriority)).toBeTruthy();
        expect(await copyCaseTemplate.getValueofCaseCategoryTier1()).toBe(caseTemplateAllFields.categoryTier1);
        expect(await copyCaseTemplate.getValueofCaseCategoryTier2()).toBe(caseTemplateAllFields.categoryTier2);
        expect(await copyCaseTemplate.getValueofCaseCategoryTier3()).toBe(caseTemplateAllFields.categoryTier3);
        expect(await copyCaseTemplate.getValueOfAllowReopen()).toBe(caseTemplateAllFields.allowCaseReopen);
        expect(await copyCaseTemplate.getValueOfFlowset()).toBe(caseTemplateAllFields.flowset);
        expect(await copyCaseTemplate.getValueOfCaseCompany()).toBe(caseTemplateAllFields.company);
        expect(await copyCaseTemplate.getValueOfOwnerCompany()).toBe(caseTemplateAllFields.ownerCompany);
        expect(await copyCaseTemplate.getValueOfOwnerGroup()).toContain('US Support 3');
        expect(await copyCaseTemplate.getValueOfAssignementMethod()).toBe(caseTemplateAllFields.assignmentMethod);
        expect(await copyCaseTemplate.getValueOfTaskFailureConfiguration()).toBe(caseTemplateAllFields.taskFailureConfiguration);
        expect(await copyCaseTemplate.getValueOfTemplateStatus()).toBe('Draft');
        expect(await copyCaseTemplate.getValueOfcaseStatus()).toBe(caseTemplateAllFields.caseStatus);
        expect(await copyCaseTemplate.getValueOfSupportCompany()).toBe(caseTemplateAllFields.company);
        expect(await copyCaseTemplate.getValueOfAssignee()).toBe(caseTemplateAllFields.assignee);
        expect(await copyCaseTemplate.getValueOfSupportGroup()).toBe(caseTemplateAllFields.supportGroup);
        await copyCaseTemplate.clickSaveCaseTemplate();
        expect(await copyCaseTemplate.getValueOfStatusReason()).toBe(caseTemplateAllFields.statusReason);
        expect(await copyCaseTemplate.getValueOfCaseDescription()).toContain(caseTemplateAllFields.templateDescription);
        expect(await copyCaseTemplate.getValueOfCaseSummary()).toBe(caseTemplateAllFields.templateSummary);
        let copiedCasetemplateFromNew = await editCaseTemplate.getCaseTemplateID();
        expect(copiedCasetemplateFromNew == CasetemplateNew).toBeFalsy();
        expect(await copyCaseTemplate.getValueOfResolutionCode()).toBe(caseTemplateAllFields.resolutionCode);
        expect(await copyCaseTemplate.getValueOfResolutionDescription()).toBe(caseTemplateAllFields.resolutionDescription);
    }, 350 * 1000);

    //ptidke
    it('[DRDMV-13543,DRDMV-13555]: Create a Copy of Case template by Case Business Analyst that belongs to Support Group,Case Template console grid should show Newly created copied template', async () => {
        try {
            await navigationPage.signOut();
            await loginPage.login("fritz");
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            let caseTemplateName: string = caseTemplateRequiredFields.templateName + Math.floor(Math.random() * 100000);
            caseTemplateRequiredFields.templateName = caseTemplateName;
            await createCaseTemplate.createCaseTemplateWithAllFields(caseTemplateRequiredFields);
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await consoleCasetemplatePo.searchAndselectCaseTemplate(caseTemplateName);
            await consoleCasetemplatePo.clickOnCopyCaseTemplate();
            let copyCaseTemplateName: string = "copycasetemplate" + Math.floor(Math.random() * 10000000);
            await copyCaseTemplate.setTemplateName(copyCaseTemplateName);
            //verify all values copied from template 1 to template 2
            expect(await copyCaseTemplate.isValueOfCasePriorityPresent(caseTemplateRequiredFields.casePriority)).toBeTruthy();
            expect(await copyCaseTemplate.getValueofCaseCategoryTier1()).toBe(caseTemplateRequiredFields.categoryTier1);
            expect(await copyCaseTemplate.getValueofCaseCategoryTier2()).toBe(caseTemplateRequiredFields.categoryTier2);
            expect(await copyCaseTemplate.getValueofCaseCategoryTier3()).toBe(caseTemplateRequiredFields.categoryTier3);
            expect(await copyCaseTemplate.getValueOfAllowReopen()).toBe(caseTemplateRequiredFields.allowCaseReopen);
            expect(await copyCaseTemplate.getValueOfFlowset()).toBe(caseTemplateRequiredFields.flowset);
            expect(await copyCaseTemplate.getValueOfCaseCompany()).toBe(caseTemplateRequiredFields.company);
            expect(await copyCaseTemplate.getValueOfOwnerCompany()).toBe(caseTemplateRequiredFields.ownerCompany);
            expect(await copyCaseTemplate.getValueOfOwnerGroup()).toContain('Facilities');
            expect(await copyCaseTemplate.getValueOfAssignementMethod()).toBe(caseTemplateRequiredFields.assignmentMethod);
            expect(await copyCaseTemplate.getValueOfTaskFailureConfiguration()).toBe(caseTemplateRequiredFields.taskFailureConfiguration);
            expect(await copyCaseTemplate.getValueOfTemplateStatus()).toBe('Draft');
            expect(await copyCaseTemplate.getValueOfcaseStatus()).toBe(caseTemplateRequiredFields.caseStatus);
            expect(await copyCaseTemplate.getValueOfSupportCompany()).toBe(caseTemplateRequiredFields.company);
            expect(await copyCaseTemplate.getValueOfAssignee()).toBe(caseTemplateRequiredFields.assignee);
            expect(await copyCaseTemplate.getValueOfSupportGroup()).toBe(caseTemplateRequiredFields.supportGroup);
            await copyCaseTemplate.clickSaveCaseTemplate();
            expect(await copyCaseTemplate.getValueOfStatusReason()).toBe(caseTemplateRequiredFields.statusReason);
            expect(await copyCaseTemplate.getValueOfCaseDescription()).toContain(caseTemplateRequiredFields.templateDescription);
            expect(await copyCaseTemplate.getValueOfCaseSummary()).toBe(caseTemplateRequiredFields.templateSummary);
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await consoleCasetemplatePo.searchAndselectCaseTemplate(copyCaseTemplateName);
            expect(await consoleCasetemplatePo.getCaseTemplateNamePresentOnGrid(copyCaseTemplateName)).toBe(copyCaseTemplateName);
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        }
    }, 420 * 1000);

    //ptidke
    it('[DRDMV-13550]: Create a Copy of Case template where Submitter do not belong to any Support Groups ', async () => {
        try {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            let caseTemplateName: string = caseTemplateRequiredFields.templateName + Math.floor(Math.random() * 100000);
            caseTemplateRequiredFields.templateName = caseTemplateName;
            await createCaseTemplate.createCaseTemplateWithAllFields(caseTemplateRequiredFields);
            await navigationPage.signOut();
            await loginPage.login(userData.userId + "@petramco.com", 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await consoleCasetemplatePo.searchAndselectCaseTemplate(caseTemplateName);
            await consoleCasetemplatePo.clickOnCopyCaseTemplate();
            let copyCaseTemplateName: string = "copycasetemplate" + Math.floor(Math.random() * 10000000);
            await copyCaseTemplate.setTemplateName(copyCaseTemplateName);
            //verify all values copied from template 1 to template 2
            expect(await copyCaseTemplate.isValueOfCasePriorityPresent(caseTemplateRequiredFields.casePriority)).toBeTruthy();
            expect(await copyCaseTemplate.getValueofCaseCategoryTier1()).toBe(caseTemplateRequiredFields.categoryTier1);
            expect(await copyCaseTemplate.getValueofCaseCategoryTier2()).toBe(caseTemplateRequiredFields.categoryTier2);
            expect(await copyCaseTemplate.getValueofCaseCategoryTier3()).toBe(caseTemplateRequiredFields.categoryTier3);
            expect(await copyCaseTemplate.getValueOfAllowReopen()).toBe(caseTemplateRequiredFields.allowCaseReopen);
            expect(await copyCaseTemplate.getValueOfFlowset()).toBe(caseTemplateRequiredFields.flowset);
            expect(await copyCaseTemplate.getValueOfCaseCompany()).toBe(caseTemplateRequiredFields.company);
            expect(await copyCaseTemplate.getValueOfAssignementMethod()).toBe(caseTemplateRequiredFields.assignmentMethod);
            expect(await copyCaseTemplate.getValueOfTaskFailureConfiguration()).toBe(caseTemplateRequiredFields.taskFailureConfiguration);
            expect(await copyCaseTemplate.getValueOfTemplateStatus()).toBe('Draft');
            expect(await copyCaseTemplate.getValueOfcaseStatus()).toBe(caseTemplateRequiredFields.caseStatus);
            expect(await copyCaseTemplate.getValueOfSupportCompany()).toBe(caseTemplateRequiredFields.company);
            expect(await copyCaseTemplate.getValueOfAssignee()).toBe(caseTemplateRequiredFields.assignee);
            expect(await copyCaseTemplate.getValueOfSupportGroup()).toBe(caseTemplateRequiredFields.supportGroup);
            expect(await copyCaseTemplate.isOwnerGroupEmpty()).toBeTruthy();
            expect(await copyCaseTemplate.isOwnerCompanyEmpty()).toBeTruthy();
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        }
    }, 400 * 1000);

    //ptidke
    it('[DRDMV-13815]: Instruction come Warning Message is displayed on Create Copy Case Template Page', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        let caseTemplateName: string = caseTemplateAllFields.templateName + Math.floor(Math.random() * 100000);
        caseTemplateAllFields.templateName = caseTemplateName;
        await createCaseTemplate.createCaseTemplateWithAllFields(caseTemplateAllFields);
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        await consoleCasetemplatePo.searchAndselectCaseTemplate(caseTemplateName);

        await consoleCasetemplatePo.clickOnCopyCaseTemplate();
        let copyCaseTemplateName: string = "copycasetemplate" + Math.floor(Math.random() * 10000000);
        await copyCaseTemplate.setTemplateName(copyCaseTemplateName);
        expect(await copyCaseTemplate.getCopyCaseTemplateInstruction()).toContain('Task templates associated with this case template are copied and assigned the case assignee. Please make sure you specify assignment.');
        expect(await copyCaseTemplate.getCopyCaseTemplateInstruction()).toContain('If you have changed the company:');
        expect(await copyCaseTemplate.getCopyCaseTemplateInstruction()).toContain('Task templates similar to the associated task templates are added.');
        expect(await copyCaseTemplate.getCopyCaseTemplateInstruction()).toContain('If no similar task templates are available, new task templates are automatically created.');
        expect(await copyCaseTemplate.getCopyCaseTemplateInstruction()).toContain('Assignment and ownership for new task templates are copied from new case template.');
    });

    it('[DRDMV-13588]: Create a Copy of Case template where Support Group belongs to Business Unit ', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateName1 = 'caseTemplateNameCase3' + randomStr;
        let casetemplatePetramco1 = {
            "templateName": caseTemplateName1,
            "templateSummary": caseTemplateName1,
            "templateStatus": "Active",
            "categoryTier1": "Purchasing Card",
            "categoryTier2": "Policies",
            "categoryTier3": "Card Issuance",
            "casePriority": "Low",
            "caseStatus": "New",
            "company": "Petramco",
            "businessUnit": "Facilities Support",
            "supportGroup": "Facilities",
            "assignee": "Fritz",
            "ownerBU": "Facilities Support",
            "ownerGroup": "Facilities"
        }
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createCaseTemplate(casetemplatePetramco1);
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        await consoleCasetemplatePo.searchAndselectCaseTemplate(caseTemplateName1);
        await consoleCasetemplatePo.clickOnCopyCaseTemplate();
        let copyCaseTemplateName: string = "copycasetemplate" + Math.floor(Math.random() * 10000000);
        await copyCaseTemplate.setTemplateName(copyCaseTemplateName);
        expect(await copyCaseTemplate.getValueOfTemplateStatus()).toBe('Draft');
        expect(await copyCaseTemplate.getValueOfAssignee()).toBe('Fritz Schulz');
        expect(await copyCaseTemplate.getValueOfSupportGroup()).toBe('Facilities');
        expect(await copyCaseTemplate.getValueOfBuisnessUnit()).toBe('Facilities Support');
    });
    
    async function foundationData(company: string) {
        const businessDataFile = require('../../data/ui/foundation/businessUnit.ui.json');
        const departmentDataFile = require('../../data/ui/foundation/department.ui.json');
        const supportGrpDataFile = require('../../data/ui/foundation/supportGroup.ui.json');
        const personDataFile = require('../../data/ui/foundation/person.ui.json');
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

    it('[DRDMV-13589]: Create a Copy of Case template where Support Group belongs to Department', async () => {
        const businessDataFile = require('../../data/ui/foundation/businessUnit.ui.json');
        const departmentDataFile = require('../../data/ui/foundation/department.ui.json');
        const supportGrpDataFile = require('../../data/ui/foundation/supportGroup.ui.json');
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let businessData = businessDataFile['BusinessUnitData'];
        let departmentData = departmentDataFile['DepartmentData'];
        let suppGrpData = supportGrpDataFile['SuppGrpData'];
        let caseTemplateName1 = "caseTemplateName" + randomStr;

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
        await createCaseTemplate.setTemplateName(caseTemplateName1);
        await createCaseTemplate.setCompanyName("Petramco");
        await createCaseTemplate.setCaseSummary("caseTemplateSummary1" + randomStr);
        await createCaseTemplate.setOwnerCompanyValue("Petramco");
        await createCaseTemplate.clickOnChangeAssignmentButton();
        await changeAssignmentOldPage.selectBusinessUnit(businessData.orgName);
        await changeAssignmentOldPage.selectDepartment(departmentData.orgName);
        await changeAssignmentOldPage.selectSupportGroup(suppGrpData.orgName);
        await changeAssignmentOldPage.selectAssignee('fnPerson lnPerson');
        await changeAssignmentOldPage.clickOnAssignButton();
        await createCaseTemplate.clickSaveCaseTemplate();
        await utilCommon.clickOnBackArrow();
        await consoleCasetemplatePo.searchAndselectCaseTemplate(caseTemplateName1);
        await consoleCasetemplatePo.clickOnCopyCaseTemplate();
        let copyCaseTemplateName: string = "copycasetemplate" + Math.floor(Math.random() * 10000000);
        await copyCaseTemplate.setTemplateName(copyCaseTemplateName);
        expect(await copyCaseTemplate.getValueOfTemplateStatus()).toBe('Draft');
        expect(await copyCaseTemplate.getValueOfAssignee()).toBe('fnPerson lnPerson');
        expect(await copyCaseTemplate.getValueOfSupportGroup()).toBe(suppGrpData.orgName);
        expect(await copyCaseTemplate.getValueOfBuisnessUnit()).toBe(businessData.orgName);
        expect(await copyCaseTemplate.getValueOfDepartement()).toBe(departmentData.orgName);
    });

    it('[DRDMV-13571]: Fields copied while creating copy of Case template which has linked task templates', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateName = 'caseTemplateName' + randomStr;
        let taskTemplateName = 'taskTemplateName' + randomStr;
        let taskTemplateDataSet = {
            "templateName": taskTemplateName,
            "templateSummary": taskTemplateName,
            "templateStatus": "Active",
            "taskCompany": "Petramco",
            "buisnessUnit": "Facilities Support",
            "supportGroup": "Facilities",
            "assignee": "Fritz",
            "ownerCompany": "Petramco",
            "ownerBusinessUnit": "Facilities Support",
            "ownerGroup": "Facilities"
        }
        let casetemplatePetramco = {
            "templateName": caseTemplateName,
            "templateSummary": caseTemplateName,
            "templateStatus": "Active",
            "categoryTier1": "Purchasing Card",
            "categoryTier2": "Policies",
            "categoryTier3": "Card Issuance",
            "casePriority": "Low",
            "caseStatus": "Assigned",
            "company": "Petramco",
            "businessUnit": "Facilities Support",
            "supportGroup": "Facilities",
            "assignee": "Fritz",
            "ownerBU": "Facilities Support",
            "ownerGroup": "Facilities",
        }
        await apiHelper.apiLogin('fritz');
        let newCaseTemplate1 = await apiHelper.createCaseTemplate(casetemplatePetramco);
        let manualTaskTemplate = await apiHelper.createManualTaskTemplate(taskTemplateDataSet);
        await apiHelper.associateCaseTemplateWithOneTaskTemplate(newCaseTemplate1.displayId, manualTaskTemplate.displayId);
        await navigationPage.signOut();
        await loginPage.login('fritz');
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        await utilGrid.searchAndOpenHyperlink(caseTemplateName);
        await editCaseTemplate.clickOnEditCaseTemplateMetadata();
        await editCaseTemplate.changeTemplateStatusDropdownValue('Draft');
        await editCaseTemplate.clickOnSaveCaseTemplateMetadata();
        await viewCasetemplatePo.clickOnEditCaseTemplateButton();
        await editCaseTemplate.changeIdentityValidationValue('Enforced');         
        await editCaseTemplate.setResolutionCodeRequired(true);
        await editCaseTemplate.setResolutionDescriptionRequired(true);
        await editCaseTemplate.clickSaveCaseTemplate();
        await utilCommon.clickOnBackArrow();
        await consoleCasetemplatePo.searchAndselectCaseTemplate(caseTemplateName);
        await consoleCasetemplatePo.clickOnCopyCaseTemplate();
        let copyCaseTemplateName: string = "copycasetemplate" + Math.floor(Math.random() * 10000000);
        await copyCaseTemplate.setTemplateName(copyCaseTemplateName);
        await copyCaseTemplate.clickSaveCaseTemplate();
        expect(await viewCasetemplatePo.getIdentityValdationValue()).toBe('Enforced');
        expect(await copyCaseTemplate.getValueOfResolutionCode()).toBe(caseTemplateAllFields.resolutionCode);
        expect(await copyCaseTemplate.getValueOfResolutionDescription()).toBe(caseTemplateAllFields.resolutionDescription);       
        await viewCasetemplatePo.clickOneTask();
        expect(await previewTaskTemplateCasesPo.getTaskTemplateName()).toBe(taskTemplateName);
        await previewTaskTemplateCasesPo.clickOnBackButton();
    });
});