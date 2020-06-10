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
import dynamicField from "../../pageobject/common/dynamic-fields.po";
import selectTaskTemplate from "../../pageobject/settings/task-management/console-tasktemplate.po";
import taskTemplate from "../../pageobject/settings/task-management/create-tasktemplate.po";
import viewTaskTemplate from "../../pageobject/settings/task-management/view-tasktemplate.po";
import copyTasktemplatePo from '../../pageobject/settings/task-management/copy-tasktemplate.po';
import viewTasktemplatePo from '../../pageobject/settings/task-management/view-tasktemplate.po';
import editTasktemplatePo from '../../pageobject/settings/task-management/edit-tasktemplate.po';
import consoleTasktemplatePo from '../../pageobject/settings/task-management/console-tasktemplate.po';

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
            "userId": "DRDMV13550User1",
            "userPermission": "AGGAA5V0GE9Z4AOR7DBBOQLAW74PH7",
        }
        await apiHelper.createNewUser(userData1);
        userData2 = {
            "firstName": "Petramco",
            "lastName": "SGUser2",
            "userId": "DRDMV13550User2",
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

    describe('[DRDMV-13557]:Permission Check to verify who can edit the Case/Task template', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let copyCaseTemplateName: string = "copycasetemplate" + randomStr;
        let copytaskTemplateName: string = "copyTasktemplate" + randomStr;
        let caseTemplateName = "caseTemplateName" + randomStr;
        it('Permission Check to verify who can edit the Case Template', async () => {
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
        it('Permission Check to verify who can edit the Case Template', async () => {
            await navigationPage.signOut();
            await loginPage.login(userData2.userId + "@petramco.com", 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(copyCaseTemplateName);
            await viewCasetemplatePo.clickOnMangeDynamicFieldLink();
            expect(await utilCommon.isPopUpMessagePresent('ERROR (222095): You do not have permission to perform this operation. Please contact your system administrator.')).toBeTruthy('Message of permission denined for group access remove not displayed');
            await utilCommon.closePopUpMessage();
            await navigationPage.signOut();
            await loginPage.login(userData1.userId + "@petramco.com", 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(copyCaseTemplateName);
            await viewCasetemplatePo.clickOnEditCaseTemplateButton();
            expect(await editCaseTemplate.isCaseSummaryReadOnly()).toBeFalsy("Copy Case Template is editable");
        });
        it('Permission Check to verify who can edit the Task Template', async () => {
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
        it('[DRDMV-13557]:Permission Check to verify who can edit the Task Template', async () => {
            await navigationPage.signOut();
            await loginPage.login(userData2.userId + "@petramco.com", 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.searchAndOpenTaskTemplate(copytaskTemplateName);
            await viewTaskTemplate.clickOnManageDynamicFieldLink();
            expect(await utilCommon.isPopUpMessagePresent('ERROR (222095): You do not have permission to perform this operation. Please contact your system administrator.')).toBeTruthy('Message of permission denined for group access remove not displayed');
            await utilCommon.closePopUpMessage();
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
        let dynamicFieldName1 = 'DRDMV13570FieldName1' + randomStr;
        let dynamicFieldName2 = 'DRDMV13570FieldName2' + randomStr;
        let dynamicFieldDescription1 = 'DRDMV13570FieldDescription1' + randomStr;
        let dynamicFieldDescription2 = 'DRDMV13570FieldDescription2' + randomStr;
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
        it('Add Dynamic Field', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(casetemplatePetramco.templateName);
            await viewCasetemplatePo.clickOnMangeDynamicFieldLink();
            await dynamicField.clickOnDynamicField();
            await dynamicField.setFieldName(dynamicFieldName1);
            await dynamicField.setDescriptionName(dynamicFieldDescription1);
            await dynamicField.clickSaveButton();
            await viewCasetemplatePo.clickOnMangeDynamicFieldLink();
            await dynamicField.clickOnDynamicField();
            await dynamicField.setFieldName(dynamicFieldName2);
            await dynamicField.setDescriptionName(dynamicFieldDescription2);
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
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed(dynamicFieldDescription1)).toBeTruthy(`${dynamicFieldDescription1} dynamic field not present`);
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed(dynamicFieldDescription2)).toBeTruthy(`${dynamicFieldDescription2} dynamic field not present`);
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
        });
    });

    //kgaikwad
    describe('[DRDMV-15256]: Verify For Copy template, Category Tier 4 and Label Data also get copied', async () => {
        let caseTemplateName: string = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let categName1: string = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let categName2: string = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let categName3: string = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let categName4: string = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let randomStr: string = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let copyCaseTemplateName: string = "copycasetemplate" + [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let copyManualTaskTemplateName: string = 'copyManualTask' + [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let copyAutomationTaskTemplateName: string = 'copyAutomationTask' + [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let copyExternalTaskTemplateName: string = 'copyExternalTask' + [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateId;
        let taskManualTemplateId;
        let taskAutomationTemplateId;
        let taskExternalTemplateId;
        let label;
        let manualTaskTemplateData;
        let automationTaskTemplateData;
        let externalTaskTemplateData;
        let caseTemplateData;

        beforeAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            // Create catergory tier
            await apiHelper.apiLogin('tadmin');
            await apiHelper.createOperationalCategory(categName1);
            await apiHelper.createOperationalCategory(categName2);
            await apiHelper.createOperationalCategory(categName3);
            await apiHelper.createOperationalCategory(categName4);
            await apiHelper.associateCategoryToOrganization(categName1, 'Petramco');
            await apiHelper.associateCategoryToCategory(categName1, categName2);
            await apiHelper.associateCategoryToCategory(categName2, categName3);
            await apiHelper.associateCategoryToCategory(categName3, categName4);

            // Create Menu item Label 
            await apiHelper.apiLogin('qkatawazi');
            let menuItemDataFile = require('../../data/ui/ticketing/menuItem.ui.json');
            label = await menuItemDataFile['sampleMenuItem'].menuItemName + randomStr;
            menuItemDataFile['sampleMenuItem'].menuItemName = label;
            await apiHelper.createNewMenuItem(menuItemDataFile['sampleMenuItem']);

            // Create Manual Task Template
            manualTaskTemplateData = {
                "templateName": `manualTaskTemplateActive ${randomStr}`,
                "templateSummary": `manualTaskTemplateActive ${randomStr}`,
                "templateStatus": "Draft",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            await apiHelper.createManualTaskTemplate(manualTaskTemplateData);

            // Create Automation Task Template
            automationTaskTemplateData = {
                "templateName": `AutomatedTaskTemplateActive ${randomStr}`,
                "templateSummary": `AutomatedTaskTemplateActive ${randomStr}`,
                "templateStatus": "Draft",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": `Case Process 1 ${randomStr}`,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities",
            }
            await apiHelper.createAutomatedTaskTemplate(automationTaskTemplateData);

            // Create External Task Template
            externalTaskTemplateData = {
                "templateName": "external task template name" + randomStr,
                "templateSummary": "external task template summary" + randomStr,
                "templateStatus": "Draft",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities",
            }
            await apiHelper.createExternalTaskTemplate(externalTaskTemplateData);

            // Create case template
            caseTemplateData = {
                "templateName": caseTemplateName,
                "templateSummary": caseTemplateName,
                "caseStatus": "New",
                "templateStatus": "Draft",
                "company": "Petramco",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "ownerBU": 'Facilities Support',
                "ownerGroup": "Facilities",
                "resolutionCode": "1",
                "resolutionDescription": "1"
            }
            await apiHelper.createCaseTemplate(caseTemplateData);
        });

        it('Edit Case Template and Add Label and Category 4 Tier', async () => {
            // Create Case template
            await navigationPage.gotoCaseConsole();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await consoleCasetemplatePo.searchAndClickOnCaseTemplate(caseTemplateName);
            await viewCasetemplatePo.clickOnEditCaseTemplateButton();
            await editCaseTemplate.changeLabelValue(label);
            await editCaseTemplate.changeCategoryTier1(categName1);
            await editCaseTemplate.changeCategoryTier2(categName2);
            await editCaseTemplate.changeCategoryTier3(categName3);
            await editCaseTemplate.changeCategoryTier4(categName4);
            await editCaseTemplate.clickSaveCaseTemplate();
            caseTemplateId = await viewCasetemplatePo.getCaseTemplateId();
            await viewCasetemplatePo.goToCaseTemplateConsole();
        });

        it('Verify Copy Case Template fields Values with Label and Category Tier 4', async () => {
            await consoleCasetemplatePo.searchAndselectCaseTemplate(caseTemplateName);
            await consoleCasetemplatePo.clickOnCopyCaseTemplate();
            await copyCaseTemplate.setTemplateName(copyCaseTemplateName);
            //verify all values copied from template 1 to template 2   
            expect(await copyCaseTemplate.isValueOfCasePriorityPresent('Medium')).toBeTruthy();
            expect(await copyCaseTemplate.getValueofCaseCategoryTier1()).toBe(categName1);
            expect(await copyCaseTemplate.getValueofCaseCategoryTier2()).toBe(categName2);
            expect(await copyCaseTemplate.getValueofCaseCategoryTier3()).toBe(categName3);
            expect(await copyCaseTemplate.getValueofCaseCategoryTier4()).toBe(categName4);
            expect(await copyCaseTemplate.getValueofLabel()).toBe(label);
            expect(await copyCaseTemplate.getValueOfAllowReopen()).toBe("Yes");
            expect(await copyCaseTemplate.getValueOfCaseCompany()).toBe(caseTemplateData.company);
            expect(await copyCaseTemplate.getValueOfOwnerCompany()).toBe(caseTemplateData.company);
            expect(await copyCaseTemplate.getValueOfOwnerGroup()).toContain('US Support 3');
            expect(await copyCaseTemplate.getValueOfTemplateStatus()).toBe('Draft');
            expect(await copyCaseTemplate.getValueOfcaseStatus()).toBe(caseTemplateData.caseStatus);
            expect(await copyCaseTemplate.getValueOfSupportCompany()).toBe(caseTemplateData.company);
            expect(await copyCaseTemplate.getValueOfAssignee()).toBe(caseTemplateAllFields.assignee);
            expect(await copyCaseTemplate.getValueOfSupportGroup()).toBe(caseTemplateAllFields.supportGroup);
            await copyCaseTemplate.clickSaveCaseTemplate();
            let copiedCasetemplateFromNew = await viewCasetemplatePo.getCaseTemplateId();
            expect(copiedCasetemplateFromNew == caseTemplateId).toBeFalsy();
            await viewCasetemplatePo.goToCaseTemplateConsole();
        });

        it('Edit Case Manual Task and Add Label and Category 4 Tier', async () => {
            // Create Manual Task Template 
            await navigationPage.gotoCaseConsole();
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows')).toEqual('Task Templates - Business Workflows');
            await consoleTasktemplatePo.searchAndOpenTaskTemplate(manualTaskTemplateData.templateName);
            await viewTasktemplatePo.clickOnEditLink();
            await editTasktemplatePo.selectLabel(label);
            await editTasktemplatePo.selectTaskCategoryTier1(categName1);
            await editTasktemplatePo.selectTaskCategoryTier2(categName2);
            await editTasktemplatePo.selectTaskCategoryTier3(categName3);
            await editTasktemplatePo.selectTaskCategoryTier4(categName4);
            await editTasktemplatePo.clickChangeAssignmentButton();
            await changeAssignmentOldPage.clickOnAssignToMeCheckBox();
            await changeAssignmentOldPage.clickOnAssignButton();
            await editTasktemplatePo.clickOnSaveButton();
            taskManualTemplateId = await viewTasktemplatePo.getTaskTemplateId();
            await viewTasktemplatePo.gotoTaskTemplateConsolePage();
        }, 1500 * 1000);

        it(' Verify Manual Copy Task Template fields Values with Label and Category Tier 4', async () => {
            await consoleTasktemplatePo.searchAndSelectTaskTemplate(manualTaskTemplateData.templateName);
            await consoleTasktemplatePo.clickOnCopyTaskTemplateButton();
            // Veriy copy Task Template
            await copyTasktemplatePo.setTemplateName(copyManualTaskTemplateName);
            expect(await copyTasktemplatePo.getTaskCompany()).toBe('Petramco', 'Copy manual Task  template Company name is missing');
            expect(await copyTasktemplatePo.getTaskPriority()).toBe('Medium', 'Copy manual Task  template Task prority name is missing');
            // expect(await copyTasktemplatePo.getLabel()).toBe(label, 'Copy manual Task  template task label  is missing');
            expect(await copyTasktemplatePo.getTaskCategoryTier1()).toBe(categName1, 'Copy manual Task  template CategoryTier1 is missing');
            expect(await copyTasktemplatePo.getTaskCategoryTier2()).toBe(categName2, 'Copy manual Task  template CategoryTier2 is missing');
            expect(await copyTasktemplatePo.getTaskCategoryTier3()).toBe(categName3, 'Copy manual Task  template CategoryTier3 is missing');
            expect(await copyTasktemplatePo.getTaskCategoryTier4()).toBe(categName4, 'Copy manual Task  template CategoryTier4 is missing');
            expect(await copyTasktemplatePo.getSupportCompany()).toBe(manualTaskTemplateData.taskCompany, 'Support Company name is missing');
            expect(await copyTasktemplatePo.getAssignee()).toBe('Qadim Katawazi', 'Copy manual Task  template Assignee name is missing');
            expect(await copyTasktemplatePo.getBussinessUnit()).toBe('United States Support', 'Copy manual Task  template Bussiness Unit is missing');
            expect(await copyTasktemplatePo.getTemplateStatus()).toBe('Draft', 'Copy manual Task  template Draft status is missing');
            expect(await copyTasktemplatePo.getOwnerCompany()).toBe('Petramco', 'Copy manual Task  template Owner company is missing');
            expect(await copyTasktemplatePo.getTemplateMetadataBussinessUnit()).toBe('United States Support', 'Copy manual Task  template TemplateMetadata Bussiness Unit is missing');
            expect(await copyTasktemplatePo.getOwnerGroup()).toBe('US Support 3', 'Copy manual Task  template Owner Group is missing');
            await copyTasktemplatePo.clickSaveCopytemplate();
            expect(await viewTasktemplatePo.gettaskSummaryValue()).toBe(manualTaskTemplateData.templateSummary, 'Copy manual Task  template Task Summary Value is missing');
            let copytaskManualTemplateId = await viewTasktemplatePo.getTaskTemplateId();
            expect(taskManualTemplateId == copytaskManualTemplateId).toBeFalsy('Copy manual Task  template template');
            await viewTasktemplatePo.gotoTaskTemplateConsolePage();
        });

        it('Edit Case Automation Task and Add Label and Category 4 Tier', async () => {
            await consoleTasktemplatePo.searchAndOpenTaskTemplate(automationTaskTemplateData.templateName);
            await viewTasktemplatePo.clickOnEditLink();
            await editTasktemplatePo.selectLabel(label);
            await editTasktemplatePo.selectTaskCategoryTier1(categName1);
            await editTasktemplatePo.selectTaskCategoryTier2(categName2);
            await editTasktemplatePo.selectTaskCategoryTier3(categName3);
            await editTasktemplatePo.selectTaskCategoryTier4(categName4);
            await editTasktemplatePo.clickOnSaveButton();
            taskAutomationTemplateId = await viewTasktemplatePo.getTaskTemplateId();
            await viewTasktemplatePo.gotoTaskTemplateConsolePage();

        }, 1500 * 1000);

        it('Verify Auomation Copy Task Template fields Values with Label and Category Tier 4', async () => {
            // Veriy copy Task Template
            let automationProcessName = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            await consoleTasktemplatePo.searchAndSelectTaskTemplate(automationTaskTemplateData.templateName);
            await consoleTasktemplatePo.clickOnCopyTaskTemplateButton();
            await copyTasktemplatePo.setTemplateName(copyAutomationTaskTemplateName);
            await copyTasktemplatePo.setNewProcessName(automationProcessName);
            expect(await copyTasktemplatePo.getTaskCompany()).toBe('Petramco', 'Copy automation task  template Company name is missing');
            expect(await copyTasktemplatePo.getTaskPriority()).toBe('Medium', 'Copy automation task  template Task prority name is missing');
            // expect(await copyTasktemplatePo.getLabel()).toBe(label, 'Copy automation task  template task label  is missing');
            expect(await copyTasktemplatePo.getTaskCategoryTier1()).toBe(categName1, 'Copy automation task  template CategoryTier1 is missing');
            expect(await copyTasktemplatePo.getTaskCategoryTier2()).toBe(categName2, 'Copy automation task  template CategoryTier2 is missing');
            expect(await copyTasktemplatePo.getTaskCategoryTier3()).toBe(categName3, 'Copy automation task  template CategoryTier3 is missing');
            expect(await copyTasktemplatePo.getTaskCategoryTier4()).toBe(categName4, 'Copy automation task  template CategoryTier4 is missing');
            expect(await copyTasktemplatePo.getTemplateStatus()).toBe('Draft', 'Copy automation task  template Draft status is missing');
            expect(await copyTasktemplatePo.getOwnerCompany()).toBe('Petramco', 'Copy automation task  template Owner company is missing');
            expect(await copyTasktemplatePo.getTemplateMetadataBussinessUnit()).toBe('United States Support', 'Copy automation task  template TemplateMetadata Bussiness Unit is missing');
            expect(await copyTasktemplatePo.getOwnerGroup()).toBe('US Support 3', 'Copy automation task  template Owner Group is missing');
            await copyTasktemplatePo.clickSaveCopytemplate();
            expect(await viewTasktemplatePo.gettaskSummaryValue()).toBe(automationTaskTemplateData.templateSummary, 'Copy automation task  template Task Summary Value is missing');
            let copyAutomationtaskTemplateId = await viewTasktemplatePo.getTaskTemplateId();
            expect(taskAutomationTemplateId == copyAutomationtaskTemplateId).toBeFalsy('Copy automation task  template template');
            await viewTasktemplatePo.gotoTaskTemplateConsolePage();
        });

        it('Edit External Task Template and Add Label and Category 4 Tier', async () => {
            // Create External Task Template 
            await consoleTasktemplatePo.searchAndOpenTaskTemplate(externalTaskTemplateData.templateName);
            await viewTasktemplatePo.clickOnEditLink();
            await editTasktemplatePo.clickChangeAssignmentButton();
            await changeAssignmentOldPage.clickOnAssignToMeCheckBox();
            await changeAssignmentOldPage.clickOnAssignButton();
            await editTasktemplatePo.selectLabel(label);
            await editTasktemplatePo.selectTaskCategoryTier1(categName1);
            await editTasktemplatePo.selectTaskCategoryTier2(categName2);
            await editTasktemplatePo.selectTaskCategoryTier3(categName3);
            await editTasktemplatePo.selectTaskCategoryTier4(categName4);
            await editTasktemplatePo.clickOnSaveButton();
            taskExternalTemplateId = await viewTasktemplatePo.getTaskTemplateId();
            await viewTasktemplatePo.gotoTaskTemplateConsolePage();
        }, 1500 * 1000);

        it('[DRDMV-15256]: Verify External Copy Task Template fields Values with Label and Category Tier 4', async () => {
            await consoleTasktemplatePo.searchAndSelectTaskTemplate(externalTaskTemplateData.templateName);
            await consoleTasktemplatePo.clickOnCopyTaskTemplateButton();
            // Veriy copy Task Template
            await copyTasktemplatePo.setTemplateName(copyExternalTaskTemplateName);
            expect(await copyTasktemplatePo.getTaskCompany()).toBe('Petramco', 'Copy external task  template Company name is missing');
            expect(await copyTasktemplatePo.getTaskPriority()).toBe('Medium', 'Copy external task  template Task prority name is missing');
            //   expect(await copyTasktemplatePo.getLabel()).toBe(label, 'Copy external task  template task label  is missing');
            expect(await copyTasktemplatePo.getTaskCategoryTier1()).toBe(categName1, 'Copy external task  template CategoryTier1 is missing');
            expect(await copyTasktemplatePo.getTaskCategoryTier2()).toBe(categName2, 'Copy external task  template CategoryTier2 is missing');
            expect(await copyTasktemplatePo.getTaskCategoryTier3()).toBe(categName3, 'Copy external task  template CategoryTier3 is missing');
            expect(await copyTasktemplatePo.getTaskCategoryTier4()).toBe(categName4, 'Copy external task  template CategoryTier4 is missing');
            expect(await copyTasktemplatePo.getSupportCompany()).toBe('Petramco', 'Support Company name is missing');
            expect(await copyTasktemplatePo.getAssignee()).toBe('Qadim Katawazi', 'Copy external task  template Assignee name is missing');
            expect(await copyTasktemplatePo.getBussinessUnit()).toBe('United States Support', 'Copy external task  template Bussiness Unit is missing');
            expect(await copyTasktemplatePo.getTemplateStatus()).toBe('Draft', 'Copy external task  template Draft status is missing');
            expect(await copyTasktemplatePo.getOwnerCompany()).toBe('Petramco', 'Copy external task  template Owner company is missing');
            expect(await copyTasktemplatePo.getTemplateMetadataBussinessUnit()).toBe('United States Support', 'Copy external task  template TemplateMetadata Bussiness Unit is missing');
            expect(await copyTasktemplatePo.getOwnerGroup()).toBe('US Support 3', 'Copy external task  template Owner Group is missing');
            await copyTasktemplatePo.clickSaveCopytemplate();
            expect(await viewTasktemplatePo.gettaskSummaryValue()).toBe(externalTaskTemplateData.templateSummary, 'Copy external task  template Task Summary Value is missing');
            let copyExternaltaskTemplateId = await viewTasktemplatePo.getTaskTemplateId();
            expect(taskExternalTemplateId == copyExternaltaskTemplateId).toBeFalsy('Copy external task  template template');
            await viewTasktemplatePo.gotoTaskTemplateConsolePage();
        });
    });
});