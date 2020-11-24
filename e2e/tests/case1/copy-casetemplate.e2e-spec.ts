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
import previewTaskTemplateCasesPo from '../../pageobject/settings/task-management/preview-task-template.po';
import { default as viewTaskTemplate, default as viewTasktemplatePo } from "../../pageobject/settings/task-management/view-tasktemplate.po";
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilGrid from '../../utils/util.grid';
import utilityCommon from '../../utils/utility.common';
import { SAMPLE_MENU_ITEM } from '../../data/ui/ticketing/menu.item.ui';
import { cloneDeep } from 'lodash';

let caseTemplateAllFields = ALL_FIELD;
let caseTemplateRequiredFields = MANDATORY_FIELD;
let userData1, userData2;
let businessData, departmentData, suppGrpData;

describe('Copy Case Template', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login("qkatawazi");
        await createNewUsers();
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    async function createNewUsers() {
        await apiHelper.apiLogin('tadmin');
        userData1 = {
            "firstName": "Petramco",
            "lastName": "SGUser1",
            "userId": "13550User1",
            "userPermission": ["Case Business Analyst", "Human Resource"]
        }
        await apiHelper.createNewUser(userData1);
        userData2 = {
            "firstName": "Petramco",
            "lastName": "SGUser2",
            "userId": "13550User2",
            "userPermission": ["Case Business Analyst", "Human Resource"]
        }
        await apiHelper.createNewUser(userData2);
        await apiHelper.associatePersonToCompany(userData1.userId, "Petramco");
        await apiHelper.associatePersonToCompany(userData1.userId, "- Global -");
        await apiHelper.associatePersonToCompany(userData1.userId, "Psilon");
        await apiHelper.associatePersonToSupportGroup(userData1.userId, "Psilon Support Group1");
        await browser.sleep(3000); // timeout requried to reflect data on UI
        await apiHelper.associatePersonToCompany(userData2.userId, "Psilon");
        await apiHelper.associatePersonToSupportGroup(userData2.userId, "Psilon Support Group2");
        await browser.sleep(3000); // timeout requried to reflect data on UI
    }

    async function foundationData(company: string) {
        const businessDataFile = require('../../data/ui/foundation/businessUnit.ui.json');
        const departmentDataFile = require('../../data/ui/foundation/department.ui.json');
        const supportGrpDataFile = require('../../data/ui/foundation/supportGroup.ui.json');
        const personDataFile = require('../../data/ui/foundation/person.ui.json');
        await apiHelper.apiLogin('tadmin');
        let personData = personDataFile['PersonData'];
        businessData = businessDataFile['BusinessUnitData'];
        departmentData = departmentDataFile['DepartmentData'];
        suppGrpData = supportGrpDataFile['SuppGrpData'];
        await apiHelper.createNewUser(personData);
        let orgId = await apiCoreUtil.getOrganizationGuid(company);
        businessData.relatedOrgId = orgId;
        let businessUnitId = await apiHelper.createBusinessUnit(businessData);
        await browser.sleep(3000); // timeout requried to reflect data on UI
        departmentData.relatedOrgId = businessUnitId;
        let depId = await apiHelper.createDepartment(departmentData);
        await browser.sleep(3000); // timeout requried to reflect data on UI
        suppGrpData.relatedOrgId = depId;
        await apiHelper.createSupportGroup(suppGrpData);
        await browser.sleep(3000); // timeout requried to reflect data on UI
        await apiHelper.associatePersonToSupportGroup(personData.userId, suppGrpData.orgName);
        await apiHelper.associatePersonToCompany(personData.userId, company);
    }

    //ptidke
    describe('[DRDMV-13551,DRDMV-13529]: Create a Copy of Case template where Company is copied properly', async () => {
        let casetemplateNew, caseTemplateName: string = caseTemplateAllFields.templateName + Math.floor(Math.random() * 100000);
        let copyCaseTemplateName: string = "copycasetemplate" + Math.floor(Math.random() * 10000000);
        it('[DRDMV-13551,DRDMV-13529]: Create a Copy of Case template where Company is copied properly', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            caseTemplateAllFields.templateName = caseTemplateName;
            await createCaseTemplate.createCaseTemplateWithAllFields(caseTemplateAllFields);
            casetemplateNew = await editCaseTemplate.getCaseTemplateID();
        });
        it('[DRDMV-13551,DRDMV-13529]: Create a Copy of Case template where Company is copied properly', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await consoleCasetemplatePo.searchAndselectCaseTemplate(caseTemplateName);
            await consoleCasetemplatePo.clickOnCopyCaseTemplate();
            await copyCaseTemplate.setTemplateName(copyCaseTemplateName);
            //verify all values copied from template 1 to template 2   
            expect(await copyCaseTemplate.isValueOfCasePriorityPresent(caseTemplateAllFields.casePriority)).toBeTruthy();
            expect(await copyCaseTemplate.getValueofCaseCategoryTier1()).toBe(caseTemplateAllFields.categoryTier1);
            expect(await copyCaseTemplate.getValueofCaseCategoryTier2()).toBe(caseTemplateAllFields.categoryTier2);
            expect(await copyCaseTemplate.getValueofCaseCategoryTier3()).toBe(caseTemplateAllFields.categoryTier3);
            expect(await copyCaseTemplate.getValueOfAllowReopen()).toBe(caseTemplateAllFields.allowCaseReopen);
            expect(await copyCaseTemplate.getValueOfFlowset()).toBe(caseTemplateName);
            expect(await copyCaseTemplate.getValueOfCaseCompany()).toBe(caseTemplateAllFields.company);
            expect(await copyCaseTemplate.getValueOfAssignementMethod()).toBe(caseTemplateAllFields.assignmentMethod);
            expect(await copyCaseTemplate.getValueOfTaskFailureConfiguration()).toBe(caseTemplateAllFields.taskFailureConfiguration);
            expect(await copyCaseTemplate.getValueOfTemplateStatus()).toBe('Draft');
            expect(await copyCaseTemplate.getValueOfcaseStatus()).toBe(caseTemplateAllFields.caseStatus);
            expect(await copyCaseTemplate.getValueOfSupportCompany()).toBe(caseTemplateAllFields.company);
            expect(await copyCaseTemplate.getValueOfAssignee()).toBe(caseTemplateAllFields.assignee);
            expect(await copyCaseTemplate.getValueOfSupportGroup()).toBe(caseTemplateAllFields.supportGroup);
            expect(await copyCaseTemplate.getValueOfOwnerCompany()).toBe(caseTemplateAllFields.ownerCompany);
            expect(await copyCaseTemplate.getValueOfOwnerGroup()).toContain(caseTemplateAllFields.supportGroup);
            await copyCaseTemplate.clickSaveCaseTemplate();
            expect(await copyCaseTemplate.getValueOfStatusReason()).toBe(caseTemplateAllFields.statusReason);
            expect(await copyCaseTemplate.getValueOfCaseDescription()).toContain(caseTemplateAllFields.templateDescription);
            expect(await copyCaseTemplate.getValueOfCaseSummary()).toBe(caseTemplateAllFields.templateSummary);
            let copiedCasetemplateFromNew = await editCaseTemplate.getCaseTemplateID();
            expect(copiedCasetemplateFromNew == casetemplateNew).toBeFalsy();
            expect(await copyCaseTemplate.getValueOfResolutionCode()).toBe(caseTemplateAllFields.resolutionCode);
            expect(await copyCaseTemplate.getValueOfResolutionDescription()).toBe(caseTemplateAllFields.resolutionDescription);
        });
    });

    //ptidke
    describe('[DRDMV-13543,DRDMV-13555]: Create a Copy of Case template by Case Business Analyst that belongs to Support Group,Case Template console grid should show Newly created copied template', async () => {
        it('[DRDMV-13543,DRDMV-13555]: Create a Copy of Case template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            let caseTemplateName: string = caseTemplateRequiredFields.templateName + Math.floor(Math.random() * 100000);
            caseTemplateRequiredFields.templateName = caseTemplateName;
            await createCaseTemplate.createCaseTemplateWithAllFields(caseTemplateRequiredFields);
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await consoleCasetemplatePo.searchAndselectCaseTemplate(caseTemplateName);
        });
        it('[DRDMV-13543,DRDMV-13555]: Create a Copy of Case template', async () => {
            await consoleCasetemplatePo.clickOnCopyCaseTemplate();
            let copyCaseTemplateName: string = "copycasetemplate" + Math.floor(Math.random() * 10000000);
            await copyCaseTemplate.setTemplateName(copyCaseTemplateName);
            //verify all values copied from template 1 to template 2
            expect(await copyCaseTemplate.isValueOfCasePriorityPresent(caseTemplateRequiredFields.casePriority)).toBeTruthy();
            expect(await copyCaseTemplate.getValueofCaseCategoryTier1()).toBe(caseTemplateRequiredFields.categoryTier1);
            expect(await copyCaseTemplate.getValueofCaseCategoryTier2()).toBe(caseTemplateRequiredFields.categoryTier2);
            expect(await copyCaseTemplate.getValueofCaseCategoryTier3()).toBe(caseTemplateRequiredFields.categoryTier3);
            expect(await copyCaseTemplate.getValueOfAllowReopen()).toBe(caseTemplateRequiredFields.allowCaseReopen);
            expect(await copyCaseTemplate.getValueOfFlowset()).toBe(caseTemplateRequiredFields.templateName);
            expect(await copyCaseTemplate.getValueOfCaseCompany()).toBe(caseTemplateRequiredFields.company);
            expect(await copyCaseTemplate.getValueOfOwnerCompany()).toBe(caseTemplateRequiredFields.ownerCompany);
            expect(await copyCaseTemplate.getValueOfOwnerGroup()).toContain('US Support 3');
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
        });
    });

    //ptidke
    describe('[DRDMV-13550]: Create a Copy of Case template where Submitter do not belong to any Support Groups ', async () => {
        it('[DRDMV-13550]: Create a Copy of Case template where Submitter do not belong to any Support Groups ', async () => {
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
        });
        it('[DRDMV-13550]: Create a Copy of Case template where Submitter do not belong to any Support Groups ', async () => {
            let copyCaseTemplateName: string = "copycasetemplate" + Math.floor(Math.random() * 10000000);
            await copyCaseTemplate.setTemplateName(copyCaseTemplateName);
            //verify all values copied from template 1 to template 2
            expect(await copyCaseTemplate.isValueOfCasePriorityPresent(caseTemplateRequiredFields.casePriority)).toBeTruthy();
            expect(await copyCaseTemplate.getValueofCaseCategoryTier1()).toBe(caseTemplateRequiredFields.categoryTier1);
            expect(await copyCaseTemplate.getValueofCaseCategoryTier2()).toBe(caseTemplateRequiredFields.categoryTier2);
            expect(await copyCaseTemplate.getValueofCaseCategoryTier3()).toBe(caseTemplateRequiredFields.categoryTier3);
            expect(await copyCaseTemplate.getValueOfAllowReopen()).toBe(caseTemplateRequiredFields.allowCaseReopen);
            expect(await copyCaseTemplate.getValueOfFlowset()).toBe(caseTemplateRequiredFields.templateName);
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
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        });
    });

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
            "categoryTier1": "Employee Relations",
            "categoryTier2": "Compensation",
            "categoryTier3": "Bonus",
            "businessUnit": "United States Support",
            "supportGroup": "US Support 3",
            "assignee": "qkatawazi",
            "casePriority": "Low",
            "caseStatus": "New",
            "company": "Petramco",
            "ownerGroup": "US Support 3",
            "ownerBusinessUnit": "United States Support",
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
        expect(await copyCaseTemplate.getValueOfAssignee()).toBe('Qadim Katawazi');
        expect(await copyCaseTemplate.getValueOfSupportGroup()).toBe('US Support 3');
        expect(await copyCaseTemplate.getValueOfBuisnessUnit()).toBe('United States Support');
    });

    describe('[DRDMV-13589]: Create a Copy of Case template where Support Group belongs to Department', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateName1 = "caseTemplateName" + randomStr;
        beforeAll(async () => {
            await foundationData("Petramco");
        });
        it('[DRDMV-13589]: Create a Copy of Case template where Support Group belongs to Department', async () => {
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
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
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
    });

    describe('[DRDMV-13571]: Fields copied while creating copy of Case template which has linked task templates', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let taskTemplateDataSet, casetemplatePetramco, newCaseTemplate1, manualTaskTemplate;
        beforeAll(async () => {
            taskTemplateDataSet = {
                "templateName": 'taskTemplateName' + randomStr,
                "templateSummary": 'taskTemplateSummary' + randomStr,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "buisnessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            casetemplatePetramco = {
                "templateName": 'caseTemplateName' + randomStr,
                "templateSummary": 'caseTemplateSummary' + randomStr,
                "templateStatus": "Active",
                "categoryTier1": "Employee Relations",
                "categoryTier2": "Compensation",
                "categoryTier3": "Bonus",
                "casePriority": "Low",
                "caseStatus": "Assigned",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3",
                "lineOfBuisness": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            newCaseTemplate1 = await apiHelper.createCaseTemplate(casetemplatePetramco);
            manualTaskTemplate = await apiHelper.createManualTaskTemplate(taskTemplateDataSet);
            await browser.sleep(3000); // hardwait to reflect manual task template
        });
        it('[DRDMV-13571]: Fields copied while creating copy of Case template which has linked task templates', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await apiHelper.associateCaseTemplateWithOneTaskTemplate(newCaseTemplate1.displayId, manualTaskTemplate.displayId);
            await utilGrid.searchAndOpenHyperlink(casetemplatePetramco.templateName);
            await editCaseTemplate.clickOnEditCaseTemplateMetadata();
            await editCaseTemplate.changeTemplateStatusDropdownValue('Draft');
            await editCaseTemplate.clickOnSaveCaseTemplateMetadata();
            await viewCasetemplatePo.clickOnEditCaseTemplateButton();
            await editCaseTemplate.changeIdentityValidationValue('Enforced');
            await editCaseTemplate.setResolutionCodeRequired(true);
            await editCaseTemplate.setResolutionDescriptionRequired(true);
            await editCaseTemplate.clickSaveCaseTemplate();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await consoleCasetemplatePo.searchAndselectCaseTemplate(casetemplatePetramco.templateName);
            await consoleCasetemplatePo.clickOnCopyCaseTemplate();
            let copyCaseTemplateName: string = "copycasetemplate" + Math.floor(Math.random() * 10000000);
            await copyCaseTemplate.setTemplateName(copyCaseTemplateName);
            await copyCaseTemplate.clickSaveCaseTemplate();
            expect(await viewCasetemplatePo.getIdentityValdationValue()).toBe('Enforced');
            expect(await copyCaseTemplate.getValueOfResolutionCode()).toBe(caseTemplateAllFields.resolutionCode);
            expect(await copyCaseTemplate.getValueOfResolutionDescription()).toBe(caseTemplateAllFields.resolutionDescription);
            await viewCasetemplatePo.clickOneTask();
            expect(await previewTaskTemplateCasesPo.getTaskTemplateName()).toBe(taskTemplateDataSet.templateName);
        });
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
            await createCaseTemplate.setOwnerCompanyValue('Psilon');
            await createCaseTemplate.setBusinessUnitDropdownValue("Psilon Support Org2");
            await createCaseTemplate.setOwnerGroupDropdownValue("Psilon Support Group2");
            await createCaseTemplate.clickSaveCaseTemplate();
            await editCaseTemplate.clickOnCopyCaseTemplate();
            await copyCaseTemplate.setTemplateName(copyCaseTemplateName);
            await createCaseTemplate.setOwnerCompanyValue('Psilon');
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
            expect(await editCaseTemplate.isCaseSummaryReadOnly()).toBeTruthy("Copy Case Template is non editable");
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
            await copyTasktemplatePo.selectOwnerCompany('Psilon');
            await copyTasktemplatePo.selectOwnerBusinessUnit("Psilon Support Org1");
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
            expect(await editTasktemplatePo.isCaseSummaryReadOnly()).toBeTruthy("Copy Case Template is editable");
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
            await loginPage.login('qkatawazi');
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
                "categoryTier1": "Employee Relations",
                "categoryTier2": "Compensation",
                "categoryTier3": "Bonus",
                "casePriority": "Low",
                "caseStatus": "New",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createCaseTemplate(casetemplatePetramco);
        });
        it('[DRDMV-13570]: Add Dynamic Field', async () => {
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
    });

    describe('[DRDMV-13807,DRDMV-13798]: Copy a Case Template for Company not same as Original Template, Where all Tasks belongs Same Company', async () => {
        const randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let casetemplatePetramco, newCaseTemplate, templateData, externaltemplateData, automatedtemplateData, copyCaseTemplateName: string = "copycaseTemplateName" + randomStr;
        beforeAll(async () => {
            await apiHelper.apiLogin(userData1.userId + '@petramco.com', 'Password_1234');
            casetemplatePetramco = {
                "templateName": 'caseTemplateName' + randomStr,
                "templateSummary": 'caseTemplateName' + randomStr,
                "templateStatus": "Draft",
                "categoryTier1": "Employee Relations",
                "categoryTier2": "Compensation",
                "categoryTier3": "Bonus",
                "casePriority": "Low",
                "caseStatus": "New",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
                "ownerCompany": "Petramco",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }
            newCaseTemplate = await apiHelper.createCaseTemplate(casetemplatePetramco);
            templateData = {
                "templateName": 'Manual task19011' + randomStr,
                "templateSummary": 'Manual task19011' + randomStr,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
            }
            let manualTaskTemplate = await apiHelper.createManualTaskTemplate(templateData);
            externaltemplateData = {
                "templateName": 'External task19011' + randomStr,
                "templateSummary": 'External task19011' + randomStr,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
            }
            let externalTaskTemplate = await apiHelper.createExternalTaskTemplate(externaltemplateData);
            automatedtemplateData = {
                "templateName": 'Automated task19011' + randomStr,
                "templateSummary": 'Automated task19011' + randomStr,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": 'Auto Proces' + randomStr,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
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
            await createCaseTemplate.setOwnerCompanyValue('Psilon');
            await createCaseTemplate.setBusinessUnitDropdownValue("Psilon Support Org1");
            await copyCaseTemplate.setOwnerGroupDropdownValue("Psilon Support Group1");
            await copyCaseTemplate.clickSaveCaseTemplate();
            await utilCommon.closePopUpMessage();
            await viewCasetemplatePo.clickOnTaskBox(templateData.templateName);
            expect(await previewTaskTemplateCasesPo.getTaskSummary()).toBe(templateData.templateSummary);
            expect(await previewTaskTemplateCasesPo.getTaskCompany()).toBe('Psilon');
            expect(await previewTaskTemplateCasesPo.getAssigneeText()).toBe('Glit Deruno');
            await previewTaskTemplateCasesPo.clickOnBackButton();
            await viewCasetemplatePo.clickOnTaskBox(automatedtemplateData.templateName);
            expect(await previewTaskTemplateCasesPo.getTaskSummary()).toBe(automatedtemplateData.templateSummary);
            expect(await previewTaskTemplateCasesPo.getTaskCompany()).toBe('Psilon');
            await previewTaskTemplateCasesPo.clickOnBackButton();
            await viewCasetemplatePo.clickOnTaskBox(externaltemplateData.templateName);
            expect(await previewTaskTemplateCasesPo.getTaskSummary()).toBe(externaltemplateData.templateSummary);
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
            await createCaseTemplate.setOwnerCompanyValue('Psilon');
            await createCaseTemplate.setBusinessUnitDropdownValue("Psilon Support Org1");
            await copyCaseTemplate.setOwnerGroupDropdownValue("Psilon Support Group1");
            await copyCaseTemplate.clickSaveCaseTemplate();
            expect(await utilCommon.isPopupMsgsMatches(['ERROR (222112): The selected Assignee does not have access to Psilon. Please select a different Assignee or contact System Administrator to grant access.'])).toBeTruthy('Message of permission denined for group access remove not displayed');
            await utilCommon.closePopUpMessage();
            await copyCaseTemplate.clickCancelCaseTemplate();
            await utilCommon.clickOnWarningOk();
            await consoleCasetemplatePo.removeColumnFromGrid(column1);
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[DRDMV-13814,DRDMV-13818]: Copy a Case Template for Company not same as Original Template, Where Same Task is present for different Company', async () => {
        const randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplatePetramco, manualTemplateData, automatedTemplateData, externalTemplateData;
        let copyCaseTemplateName: string = "copycaseTemplateName" + randomStr;
        beforeAll(async () => {
            await apiHelper.apiLogin(userData1.userId + '@petramco.com', 'Password_1234');
            caseTemplatePetramco = {
                "templateName": 'caseTemplateName' + randomStr,
                "templateSummary": 'caseTemplateName' + randomStr,
                "templateStatus": "Draft",
                "categoryTier1": "Employee Relations",
                "categoryTier2": "Compensation",
                "categoryTier3": "Bonus",
                "casePriority": "Low",
                "caseStatus": "New",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }
            let newCaseTemplate = await apiHelper.createCaseTemplate(caseTemplatePetramco);
            manualTemplateData = {
                "templateName": 'Manual DRDMV13814' + randomStr,
                "templateSummary": 'Manual DRDMV13814' + randomStr,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
            }
            let manualTaskTemplate = await apiHelper.createManualTaskTemplate(manualTemplateData);
            externalTemplateData = {
                "templateName": 'External DRDMV13814' + randomStr,
                "templateSummary": 'External DRDMV13814' + randomStr,
                "templateStatus": "Active",
                "taskCompany": "Psilon",
                "ownerCompany": "Psilon",
                "ownerBusinessUnit": "Psilon Support Org1",
                "ownerGroup": "Psilon Support Group1",
                "businessUnit": "Psilon Support Org1",
                "supportGroup": "Psilon Support Group1",
                "assignee": "gderuno",
            }
            let externalTaskTemplate = await apiHelper.createExternalTaskTemplate(externalTemplateData);
            automatedTemplateData = {
                "templateName": 'Automated DRDMV13814' + randomStr,
                "templateSummary": 'Automated DRDMV13814' + randomStr,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": 'Auto Proces' + randomStr,
                "taskCompany": "- Global -",
                "ownerCompany": "Psilon",
                "ownerBusinessUnit": "Psilon Support Org1",
                "ownerGroup": "Psilon Support Group1",
                "businessUnit": "Psilon Support Org1",
                "supportGroup": "Psilon Support Group1",
                "assignee": "gderuno",
            }
            let automatedTaskTemplate = await apiHelper.createAutomatedTaskTemplate(automatedTemplateData);
            await apiHelper.associateCaseTemplateWithThreeTaskTemplate(newCaseTemplate.displayId, manualTaskTemplate.displayId, externalTaskTemplate.displayId, automatedTaskTemplate.displayId);
        });
        it('[DRDMV-13814,DRDMV-13818]: Copy a Case Template for Company not same as Original Template, Where Same Task is present for different Company', async () => {
            await navigationPage.signOut();
            await loginPage.login(userData1.userId + "@petramco.com", 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await consoleCasetemplatePo.searchAndselectCaseTemplate(caseTemplatePetramco.templateName);
            await consoleCasetemplatePo.clickOnCopyCaseTemplate();
            await copyCaseTemplate.setTemplateName(copyCaseTemplateName);
            await copyCaseTemplate.setCompanyName('Psilon');
            await createCaseTemplate.setOwnerCompanyValue('Psilon');
            await createCaseTemplate.setBusinessUnitDropdownValue("Psilon Support Org1");
            await copyCaseTemplate.setOwnerGroupDropdownValue("Psilon Support Group1");
            await createCaseTemplate.clickOnChangeAssignmentButton();
            await changeAssignmentOldPage.selectCompany('Psilon');
            await changeAssignmentOldPage.selectBusinessUnit('Psilon Support Org1');
            await changeAssignmentOldPage.selectSupportGroup('Psilon Support Group1');
            await changeAssignmentOldPage.selectAssignee('Glit Deruno');
            await changeAssignmentOldPage.clickOnAssignButton();
            await copyCaseTemplate.clickSaveCaseTemplate();
            await utilCommon.closePopUpMessage();
            await viewCasetemplatePo.clickOnTaskBox(manualTemplateData.templateName);
            expect(await previewTaskTemplateCasesPo.getTaskSummary()).toBe(manualTemplateData.templateSummary);
            expect(await previewTaskTemplateCasesPo.getTaskCompany()).toBe('Psilon');
            expect(await previewTaskTemplateCasesPo.getAssigneeText()).toBe('Glit Deruno');
            await previewTaskTemplateCasesPo.clickOnBackButton();
            await viewCasetemplatePo.clickOnTaskBox(automatedTemplateData.templateName);
            expect(await previewTaskTemplateCasesPo.getTaskSummary()).toBe(automatedTemplateData.templateSummary);
            expect(await previewTaskTemplateCasesPo.getTaskCompany()).toBe('- Global -');
            await previewTaskTemplateCasesPo.clickOnBackButton();
        });
        it('[DRDMV-13814,DRDMV-13818]: Copy a Case Template for Company not same as Original Template, Where Same Task is present for different Company', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await utilGrid.searchOnGridConsole('DRDMV13814' + randomStr);
            expect(await consoleCasetemplatePo.getTemplateCountFromGrid()).toBe(4);
            await utilGrid.searchOnGridConsole(manualTemplateData.templateName);
            expect(await consoleCasetemplatePo.getTemplateCountFromGrid()).toBe(2);
            await utilGrid.searchOnGridConsole(automatedTemplateData.templateName);
            expect(await consoleCasetemplatePo.getTemplateCountFromGrid()).toBe(1);
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[DRDMV-13808]: Copy a Case Template for Company not same as Original Template, Where Tasks are Global', async () => {
        const randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let casetemplatePetramco, templateData, externaltemplateData, automatedtemplateData;
        let copyCaseTemplateName: string = "copycasetemplate" + Math.floor(Math.random() * 10000000);
        beforeAll(async () => {
            await apiHelper.apiLogin(userData1.userId + '@petramco.com', 'Password_1234');
            casetemplatePetramco = {
                "templateName": 'caseTemplateName' + randomStr,
                "templateSummary": 'caseTemplateName' + randomStr,
                "templateStatus": "Draft",
                "categoryTier1": "Employee Relations",
                "categoryTier2": "Compensation",
                "categoryTier3": "Bonus",
                "casePriority": "Low",
                "caseStatus": "New",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }
            let newCaseTemplate = await apiHelper.createCaseTemplate(casetemplatePetramco);
            templateData = {
                "templateName": 'Manual DRDMV13808' + randomStr,
                "templateSummary": 'Manual DRDMV13808' + randomStr,
                "templateStatus": "Active",
                "taskCompany": "- Global -",
                "ownerCompany": "- Global -",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
            }
            let manualTaskTemplate = await apiHelper.createManualTaskTemplate(templateData);
            externaltemplateData = {
                "templateName": 'External DRDMV13808' + randomStr,
                "templateSummary": 'External DRDMV13808' + randomStr,
                "templateStatus": "Active",
                "taskCompany": "- Global -",
                "ownerCompany": "- Global -",
                "ownerBusinessUnit": "Psilon Support Org1",
                "ownerGroup": "Psilon Support Group1",
                "businessUnit": "Psilon Support Org1",
                "supportGroup": "Psilon Support Group1",
                "assignee": "gderuno",
            }
            let externalTaskTemplate = await apiHelper.createExternalTaskTemplate(externaltemplateData);
            automatedtemplateData = {
                "templateName": 'Automated DRDMV13808' + randomStr,
                "templateSummary": 'Automated DRDMV13808' + randomStr,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": 'Auto Proces' + randomStr,
                "taskCompany": "- Global -",
                "ownerCompany": "Psilon",
                "ownerBusinessUnit": "Psilon Support Org1",
                "ownerGroup": "Psilon Support Group1",
                "businessUnit": "Psilon Support Org1",
                "supportGroup": "Psilon Support Group1",
                "assignee": "gderuno",
            }
            let automatedTaskTemplate = await apiHelper.createAutomatedTaskTemplate(automatedtemplateData);
            await apiHelper.associateCaseTemplateWithThreeTaskTemplate(newCaseTemplate.displayId, manualTaskTemplate.displayId, externalTaskTemplate.displayId, automatedTaskTemplate.displayId);
        });
        it('[DRDMV-13808]: Copy a Case Template for Company not same as Original Template, Where Tasks are Global', async () => {
            await navigationPage.signOut();
            await loginPage.login(userData1.userId + "@petramco.com", 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await consoleCasetemplatePo.searchAndselectCaseTemplate(casetemplatePetramco.templateName);
            await consoleCasetemplatePo.clickOnCopyCaseTemplate();
            await copyCaseTemplate.setTemplateName(copyCaseTemplateName);
            await copyCaseTemplate.setCompanyName('Psilon');
            await createCaseTemplate.setOwnerCompanyValue('Psilon');
            await createCaseTemplate.setBusinessUnitDropdownValue("Psilon Support Org1");
            await copyCaseTemplate.setOwnerGroupDropdownValue("Psilon Support Group1");
            await createCaseTemplate.clickOnChangeAssignmentButton();
            await changeAssignmentOldPage.selectCompany('Psilon');
            await changeAssignmentOldPage.selectBusinessUnit('Psilon Support Org1');
            await changeAssignmentOldPage.selectSupportGroup('Psilon Support Group1');
            await changeAssignmentOldPage.selectAssignee('Glit Deruno');
            await changeAssignmentOldPage.clickOnAssignButton();
            await copyCaseTemplate.clickSaveCaseTemplate();
            await utilCommon.closePopUpMessage();
            await viewCasetemplatePo.clickOnTaskBox(templateData.templateName);
            expect(await previewTaskTemplateCasesPo.getTaskTemplateName()).toBe(templateData.templateName);
            expect(await previewTaskTemplateCasesPo.getTaskCompany()).toBe('- Global -');
            await previewTaskTemplateCasesPo.clickOnBackButton();
            await viewCasetemplatePo.clickOnTaskBox(automatedtemplateData.templateName);
            expect(await previewTaskTemplateCasesPo.getTaskTemplateName()).toBe(automatedtemplateData.templateName);
            expect(await previewTaskTemplateCasesPo.getTaskCompany()).toBe('- Global -');
            await previewTaskTemplateCasesPo.clickOnBackButton();
            await viewCasetemplatePo.clickOnTaskBox(externaltemplateData.templateName);
            expect(await previewTaskTemplateCasesPo.getTaskTemplateName()).toBe(externaltemplateData.templateName);
            expect(await previewTaskTemplateCasesPo.getTaskCompany()).toBe('- Global -');
            await previewTaskTemplateCasesPo.clickOnBackButton();
        });
        it('[DRDMV-13808]: Copy a Case Template for Company not same as Original Template, Where Tasks are Global', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await utilGrid.searchOnGridConsole('DRDMV13808' + randomStr);
            expect(await consoleCasetemplatePo.getTemplateCountFromGrid()).toBe(3);
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[DRDMV-13847]: Execution of Automated task for Copy Case Template when Company is changed while creating Copy of Case Template', async () => {
        const randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let copyCaseTemplateName: string = "copycasetemplate_DRDMV-13847" + randomStr;
        let casetemplatePetramco, automatedtemplateData;
        beforeAll(async () => {
            casetemplatePetramco = {
                "templateName": 'caseTemplateName' + randomStr,
                "templateSummary": 'caseTemplateName' + randomStr,
                "templateStatus": "Draft",
                "categoryTier1": "Employee Relations",
                "categoryTier2": "Compensation",
                "categoryTier3": "Bonus",
                "casePriority": "Low",
                "caseStatus": "New",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }
            automatedtemplateData = {
                "templateName": 'Automated DRDMV13847' + randomStr,
                "templateSummary": 'Automated DRDMV13847' + randomStr,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": 'Auto Proces' + randomStr,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin(userData1.userId + '@petramco.com', 'Password_1234');
            let newCaseTemplate = await apiHelper.createCaseTemplate(casetemplatePetramco);
            let automatedTaskTemplate = await apiHelper.createAutomatedTaskTemplate(automatedtemplateData);
            await apiHelper.associateCaseTemplateWithOneTaskTemplate(newCaseTemplate.displayId, automatedTaskTemplate.displayId);
        });
        it('[DRDMV-13847]: Execution of Automated task for Copy Case Template when Company is changed while creating Copy of Case Template', async () => {
            await navigationPage.signOut();
            await loginPage.login(userData1.userId + "@petramco.com", 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await consoleCasetemplatePo.searchAndselectCaseTemplate(casetemplatePetramco.templateName);
            await consoleCasetemplatePo.clickOnCopyCaseTemplate();
            await copyCaseTemplate.setTemplateName(copyCaseTemplateName);
            await copyCaseTemplate.setCompanyName('Psilon');
            await createCaseTemplate.setOwnerCompanyValue('Psilon');
            await createCaseTemplate.setBusinessUnitDropdownValue("Psilon Support Org1");
            await copyCaseTemplate.setOwnerGroupDropdownValue("Psilon Support Group1");
            await createCaseTemplate.clickOnChangeAssignmentButton();
            await changeAssignmentOldPage.selectCompany('Psilon');
            await changeAssignmentOldPage.selectBusinessUnit('Psilon Support Org1');
            await changeAssignmentOldPage.selectSupportGroup('Psilon Support Group1');
            await changeAssignmentOldPage.selectAssignee('Glit Deruno');
            await changeAssignmentOldPage.clickOnAssignButton();
            await copyCaseTemplate.clickSaveCaseTemplate();
            await utilCommon.closePopUpMessage();
            await viewCasetemplatePo.clickOnTaskBox(automatedtemplateData.templateName);
            expect(await previewTaskTemplateCasesPo.getTaskTemplateName()).toBe(automatedtemplateData.templateName);
            expect(await previewTaskTemplateCasesPo.getTaskCompany()).toBe('Psilon');
            await previewTaskTemplateCasesPo.clickOnBackButton();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await utilGrid.searchOnGridConsole('DRDMV13847' + randomStr);
            expect(await consoleCasetemplatePo.getTemplateCountFromGrid()).toBe(2);
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[DRDMV-15256]: Verify For Copy template, Category Tier 4 and Label Data also get copied', () => {
        let randomStr: string = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateData, taskTemplateData, label: string = undefined;
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            let menuItemData = cloneDeep(SAMPLE_MENU_ITEM);
            label = await menuItemData.menuItemName + randomStr;
            menuItemData.menuItemName = label;
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createNewMenuItem(menuItemData);
            caseTemplateData = {
                "templateName": 'caseTemplateName' + randomStr,
                "templateSummary": 'caseTemplateSummary' + randomStr,
                "categoryTier1": 'Employee Relations',
                "categoryTier2": 'Compensation',
                "categoryTier3": 'Bonus',
                "categoryTier4": 'Retention Bonus',
                "casePriority": "Low",
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qfeng",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3",
                "label": label
            }
            await apiHelper.createCaseTemplate(caseTemplateData);
            taskTemplateData = {
                "templateName": 'task template name ' + randomStr,
                "templateSummary": `task template summary ${randomStr}`,
                "templateStatus": "Active",
                "category1": 'Employee Relations',
                "category2": 'Compensation',
                "category3": 'Bonus',
                "category4": 'Retention Bonus',
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3",
                "label": label
            }
            await apiHelper.createManualTaskTemplate(taskTemplateData)
        });
        it('[DRDMV-15256]: Verify For Copy template, Category Tier 4 and Label Data also get copied', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await consoleCasetemplatePo.searchAndselectCaseTemplate('caseTemplateName' + randomStr);
            await consoleCasetemplatePo.clickOnCopyCaseTemplate();
            await createCaseTemplate.setTemplateName('caseTemplateName1' + randomStr);
            await createCaseTemplate.clickSaveCaseTemplate();
            expect(await viewCasetemplatePo.getCategoryTier4()).toBe(caseTemplateData.categoryTier4);
            expect(await viewCasetemplatePo.getLabelValue()).toBe(label);
            await utilCommon.clickOnBackArrow();

            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.searchAndSelectTaskTemplate('task template name ' + randomStr);
            await selectTaskTemplate.clickOnCopyTaskTemplateButton();
            await taskTemplate.setTemplateName('Copied Task Template' + randomStr);
            await taskTemplate.clickOnSaveTaskTemplate();
            expect(await viewTasktemplatePo.getCategoryTier4Value()).toBe(taskTemplateData.category4);
            expect(await viewTasktemplatePo.getLabelValue()).toBe(label);
            await utilCommon.clickOnBackArrow();
        });
    });
});