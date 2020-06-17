import { browser } from "protractor";
import apiCoreUtil from '../../api/api.core.util';
import apiHelper from '../../api/api.helper';
import { ALL_FIELD, MANDATORY_FIELD } from '../../data/ui/case/casetemplate.data.ui';
import changeAssignmentOldPage from '../../pageobject/common/change-assignment-old-blade.po';
import dynamicField from "../../pageobject/common/dynamic-fields.po";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import consoleCasetemplatePo from '../../pageobject/settings/case-management/console-casetemplate.po';
import copyCaseTemplate from "../../pageobject/settings/case-management/copy-casetemplate.po";
import createCaseTemplate from "../../pageobject/settings/case-management/create-casetemplate.po";
import editCaseTemplate from "../../pageobject/settings/case-management/edit-casetemplate.po";
import viewCasetemplatePo from '../../pageobject/settings/case-management/view-casetemplate.po';
import selectTaskTemplate from "../../pageobject/settings/task-management/console-tasktemplate.po";
import copyTasktemplatePo from '../../pageobject/settings/task-management/copy-tasktemplate.po';
import taskTemplate from "../../pageobject/settings/task-management/create-tasktemplate.po";
import editTasktemplatePo from '../../pageobject/settings/task-management/edit-tasktemplate.po';
import previewTaskTemplateCasesPo from '../../pageobject/settings/task-management/preview-task-template-cases.po';
import { default as viewTaskTemplate, default as viewTasktemplatePo } from "../../pageobject/settings/task-management/view-tasktemplate.po";
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilGrid from '../../utils/util.grid';
import utilityCommon from '../../utils/utility.common';

let caseTemplateAllFields = ALL_FIELD;
let caseTemplateRequiredFields = MANDATORY_FIELD;
let userData1 = undefined;
let userData2 = undefined;

describe('Copy Case Template', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login("qkatawazi");
        await foundationData("Petramco");
        await apiHelper.apiLogin('tadmin');
        userData1 = {
            "firstName": "Petramco",
            "lastName": "SGUser1",
            "userId": "13550User1",
            "userPermission": "AGGAA5V0GE9Z4AOR7DBBOQLAW74PH7",
        }
        await apiHelper.createNewUser(userData1);
        userData2 = {
            "firstName": "Petramco",
            "lastName": "SGUser2",
            "userId": "13550User2",
            "userPermission": "AGGAA5V0GE9Z4AOR7DBBOQLAW74PH7",
        }
        await apiHelper.createNewUser(userData2);
        await apiHelper.associatePersonToCompany(userData1.userId, "Petramco");
        await apiHelper.associatePersonToCompany(userData1.userId, "- Global -");
        await apiHelper.associatePersonToCompany(userData1.userId, "Psilon");
        await apiHelper.associatePersonToSupportGroup(userData1.userId, "Psilon Support Group1");
        await apiHelper.associatePersonToCompany(userData2.userId, "Psilon");
        await apiHelper.associatePersonToSupportGroup(userData2.userId, "Psilon Support Group2");
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
            await loginPage.login(userData1.userId + "@petramco.com", 'Password_1234');
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
            "buisnessUnit": "Facilities Support",
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

    describe('[DRDMV-13557]: Permission Check to verify who can edit the Case/Task template', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let copyCaseTemplateName: string = "copycasetemplate" + randomStr;
        let copytaskTemplateName: string = "copyTasktemplate" + randomStr;
        let caseTemplateName = "caseTemplateName" + randomStr;
        it('[DRDMV-13557]: Permission Check to verify who can edit the Case Template', async () => {
            await navigationPage.signOut();
            await loginPage.login(userData1.userId + "@petramco.com", 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
            await createCaseTemplate.setTemplateName(caseTemplateName);
            await createCaseTemplate.setCompanyName("Psilon");
            await createCaseTemplate.setCaseSummary("caseTemplateSummary1" + randomStr);
            await createCaseTemplate.setBusinessUnitDropdownValue("Psilon Support Org2");
            await createCaseTemplate.setOwnerGroupDropdownValue("Psilon Support Group2");
            await createCaseTemplate.clickSaveCaseTemplate();
            await editCaseTemplate.clickOnCopyCaseTemplate();
            await copyCaseTemplate.setTemplateName(copyCaseTemplateName);
            await createCaseTemplate.setBusinessUnitDropdownValue("Psilon Support Org1");
            await copyCaseTemplate.setOwnerGroupDropdownValue("Psilon Support Group1");
            await copyCaseTemplate.clickSaveCaseTemplate();
            await utilCommon.closePopUpMessage();
        });
        it('[DRDMV-13557]: Permission Check to verify who can edit the Case Template', async () => {
            await navigationPage.signOut();
            await loginPage.login(userData2.userId + "@petramco.com", 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(copyCaseTemplateName);
            await viewCasetemplatePo.clickOnMangeDynamicFieldLink();
            expect(await utilCommon.isPopUpMessagePresent('ERROR (222095): You do not have permission to perform this operation. Please contact your system administrator.')).toBeTruthy('Message of permission denined for group access remove not displayed');
            await utilCommon.closePopUpMessage();
            await viewCasetemplatePo.clickOnEditCaseTemplateButton();
            expect(await editCaseTemplate.isCaseSummaryReadOnly()).toBeTruthy("Copy Case Template is non editable");
            await navigationPage.signOut();
            await loginPage.login(userData1.userId + "@petramco.com", 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(copyCaseTemplateName);
            await viewCasetemplatePo.clickOnEditCaseTemplateButton();
            expect(await editCaseTemplate.isCaseSummaryReadOnly()).toBeFalsy("Copy Case Template is editable");
        });
        it('[DRDMV-13557]: Permission Check to verify who can edit the Task Template', async () => {
            await navigationPage.signOut();
            await loginPage.login(userData1.userId + "@petramco.com", 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.clickOnManualTaskTemplateButton();
            await taskTemplate.setTemplateName('manualTaskTemplate' + randomStr);
            await taskTemplate.setTaskSummary('manualTaskSummary' + randomStr);
            await taskTemplate.selectCompanyByName('Psilon');
            await taskTemplate.selectOwnerCompany("Psilon");
            await taskTemplate.selectBuisnessUnit("Psilon Support Org2");
            await taskTemplate.selectOwnerGroup("Psilon Support Group2");
            await taskTemplate.clickOnSaveTaskTemplate();
            await viewTaskTemplate.clickOnCopyTemplate();
            await copyTasktemplatePo.setTemplateName(copytaskTemplateName);
            await copyTasktemplatePo.selectBuisnessUnitGroup("Psilon Support Org1");
            await copyTasktemplatePo.selectOwnerGroup("Psilon Support Group1");
            await copyTasktemplatePo.clickSaveCopytemplate();
            await utilCommon.closePopUpMessage();
        });
        it('[DRDMV-13557]: Permission Check to verify who can edit the Task Template', async () => {
            await navigationPage.signOut();
            await loginPage.login(userData2.userId + "@petramco.com", 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.searchAndOpenTaskTemplate(copytaskTemplateName);
            await viewTaskTemplate.clickOnManageDynamicFieldLink();
            expect(await utilCommon.isPopUpMessagePresent('ERROR (222095): You do not have permission to perform this operation. Please contact your system administrator.')).toBeTruthy('Message of permission denined for group access remove not displayed');
            await utilCommon.closePopUpMessage();
            await viewTaskTemplate.clickOnEditLink();
            expect(await editTasktemplatePo.isCaseSummaryReadOnly()).toBeTruthy("Copy Case Template is editable");
            await navigationPage.signOut();
            await loginPage.login(userData1.userId + "@petramco.com", 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(copytaskTemplateName);
            await viewTaskTemplate.clickOnEditLink();
            await editTasktemplatePo.setSummary("UpdatedTaskSummary");
            await editTasktemplatePo.clickOnSaveButton();
            expect(await viewTasktemplatePo.getSummaryValue()).toBe('UpdatedTaskSummary');
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
        });
    });

    describe('[DRDMV-13570]: Dynamic Field get copied upon creating copy of Case Template', () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let updatedCaseTemplate = 'UpdatedCaseDRDMV13570' + randomStr;
        let casetemplatePetramco, caseTemplateName1 = 'caseTemplateName' + randomStr;
        beforeAll(async () => {
            casetemplatePetramco = {
                "templateName": caseTemplateName1,
                "templateSummary": caseTemplateName1,
                "templateStatus": "Draft",
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
            await apiHelper.apiLogin('fritz');
            await apiHelper.createCaseTemplate(casetemplatePetramco);
        });
        it('[DRDMV-13570]: Add Dynamic Field', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(casetemplatePetramco.templateName);
            await viewCasetemplatePo.clickOnMangeDynamicFieldLink();
            await dynamicField.clickOnDynamicField();
            await dynamicField.setFieldName('news16' + randomStr);
            await dynamicField.setDescriptionName('newDescri16' + randomStr);
            await dynamicField.selectFieldValueType('DATE');
            await dynamicField.selectInfromationSource('Requester');
            await dynamicField.clickOnDynamicField();
            await dynamicField.setFieldName('news17' + randomStr);
            await dynamicField.setDescriptionName('newDescri17' + randomStr);
            await dynamicField.selectFieldValueType('NUMBER');
            await dynamicField.selectInfromationSource('System');
            await dynamicField.clickOnDynamicField();
            await dynamicField.setFieldName('news18' + randomStr);
            await dynamicField.setDescriptionName('newDescri18' + randomStr);
            await dynamicField.selectFieldValueType('BOOLEAN');
            await dynamicField.selectInfromationSource('Task Assignee');
            await dynamicField.clickOnDynamicField();
            await dynamicField.setFieldName('news19' + randomStr);
            await dynamicField.setDescriptionName('newDescri19' + randomStr);
            await dynamicField.selectFieldValueType('ATTACHMENT');
            await dynamicField.selectInfromationSource('Agent');
            await dynamicField.clickOnDynamicField();
            await dynamicField.setFieldName('news20' + randomStr);
            await dynamicField.setDescriptionName('newDescri20' + randomStr);
            await dynamicField.selectFieldValueType('TEXT');
            await dynamicField.selectInfromationSource('Agent');
            await dynamicField.clickSaveButton();
            await utilCommon.closePopUpMessage();
            await utilCommon.clickOnBackArrow();
        });
        it('[DRDMV-13570]: Dynamic Field get copied upon creating copy of Case Template', async () => {
            await consoleCasetemplatePo.searchAndselectCaseTemplate(casetemplatePetramco.templateName);
            await consoleCasetemplatePo.clickOnCopyCaseTemplate();
            await copyCaseTemplate.setTemplateName(updatedCaseTemplate);
            await copyCaseTemplate.clickSaveCaseTemplate();
            await utilCommon.closePopUpMessage();
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed('newDescri16' + randomStr)).toBeTruthy('field not present');
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed('newDescri17' + randomStr)).toBeTruthy('field not present');
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed('newDescri18' + randomStr)).toBeTruthy('field not present');
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed('newDescri19' + randomStr)).toBeTruthy('field not present');
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed('newDescri20' + randomStr)).toBeTruthy('field not present');
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
        });
    });

    describe('[DRDMV-13807,DRDMV-13798]: Copy a Case Template for Company not same as Original Template, Where all Tasks belongs Same Company', async () => {
        const randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let casetemplatePetramco,newCaseTemplate,templateData, externaltemplateData, automatedtemplateData, copyCaseTemplateName: string = "copycaseTemplateName" + randomStr;
        beforeAll(async () => {
            await apiHelper.apiLoginWithCredential('13550User1@petramco.com', 'Password_1234');
            casetemplatePetramco = {
                "templateName": 'caseTemplateName' + randomStr,
                "templateSummary": 'caseTemplateName' + randomStr,
                "templateStatus": "Draft",
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
            newCaseTemplate = await apiHelper.createCaseTemplate(casetemplatePetramco);
            templateData = {
                "templateName": 'Manual task19011' + randomStr,
                "templateSummary": 'Manual task19011' + randomStr,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
            }
            let manualTaskTemplate = await apiHelper.createManualTaskTemplate(templateData);
            externaltemplateData = {
                "templateName": 'External task19011' + randomStr,
                "templateSummary": 'External task19011' + randomStr,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
            }
            let externalTaskTemplate = await apiHelper.createExternalTaskTemplate(externaltemplateData);
            automatedtemplateData = {
                "templateName": 'Automated task19011' + randomStr,
                "templateSummary": 'Automated task19011' + randomStr,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": 'Auto Proces' + randomStr,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
            }
            let automatedTaskTemplate = await apiHelper.createAutomatedTaskTemplate(automatedtemplateData);
            await apiHelper.associateCaseTemplateWithThreeTaskTemplate(newCaseTemplate.displayId, manualTaskTemplate.displayId, externalTaskTemplate.displayId, automatedTaskTemplate.displayId);
        });
        it('[DRDMV-13807,DRDMV-13798]: Copy a Case Template for Company not same as Original Template, Where all Tasks belongs Same Company', async () => {
            await navigationPage.signOut();
            await loginPage.login(userData1.userId + "@petramco.com", 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await consoleCasetemplatePo.searchAndselectCaseTemplate(casetemplatePetramco.templateName);
            await consoleCasetemplatePo.clickOnCopyCaseTemplate();
            await copyCaseTemplate.setTemplateName(copyCaseTemplateName);
            await copyCaseTemplate.setCompanyName('Psilon');
            await createCaseTemplate.clickOnChangeAssignmentButton();
            await changeAssignmentOldPage.selectCompany('Psilon');
            await changeAssignmentOldPage.selectBusinessUnit('Psilon Support Org1');
            await changeAssignmentOldPage.selectSupportGroup('Psilon Support Group1');
            await changeAssignmentOldPage.selectAssignee('Glit Deruno');
            await changeAssignmentOldPage.clickOnAssignButton();
            await copyCaseTemplate.clickSaveCaseTemplate();
            await viewCasetemplatePo.clickOnTask(templateData.templateName);
            expect(await previewTaskTemplateCasesPo.getTaskTemplateName()).toBe(templateData.templateName);
            expect(await previewTaskTemplateCasesPo.getTaskCompany()).toBe('Psilon');
            expect(await previewTaskTemplateCasesPo.getAssigneeText()).toBe('Glit Deruno');
            await previewTaskTemplateCasesPo.clickOnBackButton();
            await viewCasetemplatePo.clickOnTask(automatedtemplateData.templateName);
            expect(await previewTaskTemplateCasesPo.getTaskTemplateName()).toBe(automatedtemplateData.templateName);
            expect(await previewTaskTemplateCasesPo.getTaskCompany()).toBe('Psilon');
            await previewTaskTemplateCasesPo.clickOnBackButton();
            await viewCasetemplatePo.clickOnTask(externaltemplateData.templateName);
            expect(await previewTaskTemplateCasesPo.getTaskTemplateName()).toBe(externaltemplateData.templateName);
            expect(await previewTaskTemplateCasesPo.getTaskCompany()).toBe('Psilon');
            expect(await previewTaskTemplateCasesPo.getAssigneeText()).toBe('Glit Deruno');
            await previewTaskTemplateCasesPo.clickOnBackButton();
        });
        it('[DRDMV-13807,DRDMV-13798]: Copy a Case Template for Company not same as Original Template, Where all Tasks belongs Same Company', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await utilGrid.searchOnGridConsole(casetemplatePetramco.templateName);
            expect(await consoleCasetemplatePo.getTemplateCountFromGrid()).toBe(2);
            let column1: string[] = ["Display ID"];
            await consoleCasetemplatePo.addColumnOnGrid(column1);
            await consoleCasetemplatePo.searchAndselectCaseTemplate(newCaseTemplate.displayId);
            await consoleCasetemplatePo.clickOnCopyCaseTemplate();
            await copyCaseTemplate.setTemplateName("copycaseTemplateForOtherCompany");
            await copyCaseTemplate.setCompanyName('Psilon');
            await copyCaseTemplate.setOwnerGroupDropdownValue('Psilon Support Group1');
            await copyCaseTemplate.clickSaveCaseTemplate();
            expect(await utilCommon.isPopupMsgsMatches(['ERROR (222112): The selected Assignee does not have access to Psilon. Please select a different Assignee or contact System Administrator to grant access.'])).toBeTruthy('Message of permission denined for group access remove not displayed');
            await utilCommon.closePopUpMessage();
            await copyCaseTemplate.clickCancelCaseTemplate();
            await utilCommon.clickOnWarningOk();
            await consoleCasetemplatePo.removeColumnFromGrid(column1);
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
        });
    });
});
