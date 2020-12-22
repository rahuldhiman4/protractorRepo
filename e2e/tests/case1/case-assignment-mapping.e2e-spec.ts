import { cloneDeep } from 'lodash';
import { browser } from "protractor";
import apiCoreUtil from '../../api/api.core.util';
import apiHelper from '../../api/api.helper';
import { flowsetGlobalFields } from '../../data/ui/flowset/flowset.ui';
import { SAMPLE_MENU_ITEM } from '../../data/ui/ticketing/menu.item.ui';
import caseConsolePage from "../../pageobject/case/case-console.po";
import previewCasePo from '../../pageobject/case/case-preview.po';
import createCasePage from "../../pageobject/case/create-case.po";
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import viewCasePo from "../../pageobject/case/view-case.po";
import accessTabPo from '../../pageobject/common/access-tab.po';
import changeAssignmentPage from '../../pageobject/common/change-assignment-blade.po';
import changeAssignmentOldPage from '../../pageobject/common/change-assignment-old-blade.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import assignmentConfigConsolePage from "../../pageobject/settings/case-management/assignments-config-console.po";
import consoleCasetemplatePage from '../../pageobject/settings/case-management/console-casetemplate.po';
import assignmentConfigCreatePage from "../../pageobject/settings/case-management/create-assignments-config.po";
import createCaseTemplate from '../../pageobject/settings/case-management/create-casetemplate.po';
import editAssignmentsConfigPo from "../../pageobject/settings/case-management/edit-assignments-config.po";
import editCasetemplatePo from '../../pageobject/settings/case-management/edit-casetemplate.po';
import viewCaseTemplate from '../../pageobject/settings/case-management/view-casetemplate.po';
import selectTaskTemplate from "../../pageobject/settings/task-management/console-tasktemplate.po";
import taskTemplate from "../../pageobject/settings/task-management/create-tasktemplate.po";
import viewTaskTemplate from "../../pageobject/settings/task-management/view-tasktemplate.po";
import adhoctaskTemplate from "../../pageobject/task/create-adhoc-task.po";
import editTaskPo from '../../pageobject/task/edit-task.po';
import manageTaskPo from "../../pageobject/task/manage-task-blade.po";
import viewTask from "../../pageobject/task/view-task.po";
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilGrid from '../../utils/util.grid';
import utilityCommon from '../../utils/utility.common';

describe("Create Case Assignment Mapping", () => {
    const businessDataFile = require('../../data/ui/foundation/businessUnit.ui.json');
    const departmentDataFile = require('../../data/ui/foundation/department.ui.json');
    const supportGrpDataFile = require('../../data/ui/foundation/supportGroup.ui.json');
    const personDataFile = require('../../data/ui/foundation/person.ui.json');
    let userData = undefined, userData1 = undefined, userData2 = undefined;
    const userId1 = "idphylum4@petramco.com";
    let flowsetGlobalFieldsData = undefined;
    beforeAll(async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await browser.get(BWF_BASE_URL);
        await loginPage.login("qkatawazi");
        await foundationData("Petramco");
        await apiHelper.apiLogin('qkatawazi');
        flowsetGlobalFieldsData = cloneDeep(flowsetGlobalFields);
        flowsetGlobalFieldsData.flowsetName = flowsetGlobalFieldsData.flowsetName = randomStr;
        await apiHelper.createNewFlowset(flowsetGlobalFieldsData);
    });

    async function foundationData(company: string) {
        await apiHelper.apiLogin('tadmin');
        let businessData = businessDataFile['BusinessUnitData11825'];
        let departmentData = departmentDataFile['DepartmentData11825'];
        let suppGrpData = supportGrpDataFile['SuppGrpData11825'];
        let personData = personDataFile['PersonData11825'];
        personData.userPermission = ["Case Business Analyst", "Human Resource"]
        let orgId = await apiCoreUtil.getOrganizationGuid(company);
        businessData.relatedOrgId = orgId;
        let businessUnitId = await apiHelper.createBusinessUnit(businessData);
        await browser.sleep(5000); // timeout requried to reflect data on UI
        departmentData.relatedOrgId = businessUnitId;
        let depId = await apiHelper.createDepartment(departmentData);
        await browser.sleep(7000); // timeout requried to reflect data on UI
        suppGrpData.relatedOrgId = depId;
        await apiHelper.createSupportGroup(suppGrpData);
        await browser.sleep(5000); // timeout requried to reflect data on UI
        await apiHelper.createNewUser(personData);
        await apiHelper.associatePersonToSupportGroup(personData.userId, suppGrpData.orgName);
        await apiHelper.associatePersonToCompany(personData.userId, company);
        await browser.sleep(5000); // timeout requried to reflect data on UI
    }

    async function foundationData2(company: string, businessUnit: string, department: string, supportGroup: string, person: string) {
        await apiHelper.apiLogin('tadmin');
        let businessData = businessDataFile[businessUnit];
        let departmentData = departmentDataFile[department];
        let suppGrpData = supportGrpDataFile[supportGroup];
        let personData = personDataFile[person];
        personData.userPermission = ["Case Business Analyst", "Human Resource"];
        await apiHelper.createNewUser(personData);
        await apiHelper.associatePersonToCompany(personData.userId, company);
        let orgId = await apiCoreUtil.getOrganizationGuid(company);
        businessData.relatedOrgId = orgId;
        let businessUnitId = await apiHelper.createBusinessUnit(businessData);
        await browser.sleep(5000); // timeout requried to reflect data on UI
        departmentData.relatedOrgId = businessUnitId;
        let depId = await apiHelper.createDepartment(departmentData);
        await browser.sleep(7000); // timeout requried to reflect data on UI
        suppGrpData.relatedOrgId = depId;
        await apiHelper.createSupportGroup(suppGrpData);
        await browser.sleep(5000); // timeout requried to reflect data on UI
        await apiHelper.associatePersonToSupportGroup(personData.userId, suppGrpData.orgName);
    }

    async function createNewUsers() {
        userData = {
            "firstName": "Multiple",
            "lastName": "Company",
            "userId": "nosg",
            "emailId": "nosg@petramco.com",
            "userPermission": ["Case Agent", "Foundation Read", "Document Manager", "Case Business Analyst", "Human Resource"]
        }
        userData1 = {
            "firstName": "Petramco",
            "lastName": "SGUser1",
            "userId": "13550User1",
            "userPermission": ["Case Business Analyst", "Human Resource"]
        }
        await apiHelper.apiLogin('tadmin');
        await apiHelper.createNewUser(userData);
        await apiHelper.createNewUser(userData1);
        await apiHelper.associatePersonToCompany(userData.userId, "Petramco");
        await apiHelper.associatePersonToCompany(userData.userId, "Psilon");
        await apiHelper.associatePersonToCompany(userData1.userId, "Petramco");
        await apiHelper.associatePersonToCompany(userData1.userId, "Psilon");
        await apiHelper.associatePersonToCompany(userData.userId, "Phylum");
        let personData1 = personDataFile['PhylumCaseAgent1'];
        await apiHelper.createNewUser(personData1);
        await apiHelper.associatePersonToSupportGroup(personData1.userId, 'Phylum Support Group1');
        await apiHelper.associatePersonToCompany(personData1.userId, 'Phylum');
        await apiHelper.associatePersonToCompany('gderuno', 'Petramco');
        userData2 = {
            "firstName": "caseBA",
            "lastName": "MultiLOB",
            "userId": "caseBAMultiLOB",
            "userPermission": ["Case Business Analyst", "Foundation Read", "Knowledge Coach", "Knowledge Publisher", "Knowledge Contributor", "Knowledge Candidate", "Case Catalog Administrator", "Person Activity Read", "Human Resource", "Facilities"]
        }
        await apiHelper.createNewUser(userData2);
        await apiHelper.associatePersonToCompany(userData2.userId, "Petramco");
        await apiHelper.associatePersonToSupportGroup(userData2.userId, "US Support 3");
    }

    afterAll(async () => {
        await apiHelper.apiLogin('tadmin');
        await apiHelper.disassociatePersonFromCompany('gderuno', 'Petramco');
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //radhiman
    it('[DRDMV-15014]: Verify Case agent can change the Site field once it is populated according to requesters primary location on create case view', async () => {
        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester('qtao');
        await createCasePage.selectSite('Berlin');
        await createCasePage.setSummary('DRDMV-15014 summary');
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        expect(await viewCasePo.getCaseSite()).toBe('Berlin');
    });

    //radhiman
    it('[DRDMV-1210]: Case Workspace table columns', async () => {
        let allCaseColumns: string[] = ["Assigned Group", "Assignee", "Assignee Login Name", "Case ID", "Case Site", "Category Tier 1", "Category Tier 2", "Category Tier 3", "Company", "Created Date", "ID", "Label", "Modified By", "Modified Date", "Priority", "Region", "Request ID", "Requester", "SLM Status", "Source", "Status", "Status Value", "Summary", "Target Date"];
        let defaultCaseColumns: string[] = ["Case ID", "Request ID", "Priority", "Status", "Summary", "Assigned Group", "Assignee", "Requester", "Modified Date", "SLM Status"];
        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester('apavlik');
        await createCasePage.setSummary('DRDMV-1210 summary');
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        await navigationPage.gotoCaseConsole();
        await caseConsolePage.removeColumns(allCaseColumns);
        await caseConsolePage.addColumns(defaultCaseColumns);
        await caseConsolePage.setCaseSearchBoxValue('DRDMV-1210 summary');
        expect(await caseConsolePage.areCaseGridColumnMatches(defaultCaseColumns)).toBeTruthy("Default columns are not matching");
        let caseLabelColumn: string[] = ["Label"];
        await caseConsolePage.addRequestedCaseGridColumn(caseLabelColumn);
        defaultCaseColumns.push("Label");
        expect(await caseConsolePage.areCaseGridColumnMatches(defaultCaseColumns)).toBeTruthy("Default And new columns added are not matching");
        await caseConsolePage.removeRequestedCaseGridColumn(caseLabelColumn);
        await defaultCaseColumns.splice(defaultCaseColumns.indexOf("Label"), 1);
        expect(await caseConsolePage.areCaseGridColumnMatches(defaultCaseColumns)).toBeTruthy("Default And remaining new columns are not matching");
    });

    //radhiman
    it('[DRDMV-15168]: Assignment mapping table columns', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', 'Configure Case Assignments - Business Workflows');
        await assignmentConfigConsolePage.clearFilter();
        let defaultCaseAssignmentColumns: string[] = ["Assignment Name", "Case Priority", "Company", "Category Tier 1", "Category Tier 2", "Category Tier 3", "Region", "Site", "Support Company", "Support Group", "Default Mapping"];
        expect(await assignmentConfigConsolePage.areCaseAssignmentGridColumnMatches(defaultCaseAssignmentColumns)).toBeTruthy("Default columns are not matching");
        let caseAssignmentLabelColumn: string[] = ["Label"];
        await assignmentConfigConsolePage.addColumns(caseAssignmentLabelColumn);
        defaultCaseAssignmentColumns.push("Label");
        expect(await assignmentConfigConsolePage.areCaseAssignmentGridColumnMatches(defaultCaseAssignmentColumns)).toBeTruthy("Default And new columns added are not matching");
        await assignmentConfigConsolePage.removeColumns(caseAssignmentLabelColumn);
        await defaultCaseAssignmentColumns.splice(defaultCaseAssignmentColumns.indexOf("Label"), 1);
        expect(await assignmentConfigConsolePage.areCaseAssignmentGridColumnMatches(defaultCaseAssignmentColumns)).toBeTruthy("Default And remaining new columns are not matching");
    });

    //radhiman
    describe('[DRDMV-1242]: [Assignment Mapping] Add/Edit Assignment Mapping views (UI verification)', async () => {
        let assignmentFields: string[] = ["Assignment Mapping Name", "Line of Business", "Company", "Flowset", "Category Tier 1", "Category Tier 2", "Category Tier 3", "Category Tier 4", "Priority", "Label", "Region", "Site", "Use as Default", "Support Company", "Business Unit", "Department", "Support Group", "Assignee"];
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let assignmentMappingName = "DRDMV1242 " + randomStr;
        it('[DRDMV-1242]: [Assignment Mapping] Add/Edit Assignment Mapping views (UI verification)', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', 'Configure Case Assignments - Business Workflows');
            await assignmentConfigConsolePage.clickOnCreateAssignmentConfiguration();
            expect(await assignmentConfigCreatePage.areAllFieldsPresentOnUI(assignmentFields)).toBeTruthy("Expected fields are not matching with actual fields present on Create Assignent UI");
            await assignmentConfigCreatePage.setAssignmentMapName(assignmentMappingName);
            await assignmentConfigCreatePage.setCompany("Petramco");
            await assignmentConfigCreatePage.setSupportCompany("Petramco");
            await assignmentConfigCreatePage.setBusinessUnit('Australia Support');
            await assignmentConfigCreatePage.setSupportGroup("AU Support 1");
            await assignmentConfigCreatePage.clickonSaveButton();
            await assignmentConfigConsolePage.searchAndClickOnAssignmentConfig(assignmentMappingName);
            expect(await editAssignmentsConfigPo.areAllFieldsPresentOnUI(assignmentFields)).toBeTruthy("Expected fields are not matching with actual fields present on Edit Assignent UI");
        });
        it('[DRDMV-1242]: create same name record in same LOB', async () => {
            //create same name record in same LOB
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', 'Configure Case Assignments - Business Workflows');
            await utilGrid.selectLineOfBusiness('Human Resource');
            await assignmentConfigConsolePage.clickOnCreateAssignmentConfiguration();
            await assignmentConfigCreatePage.setAssignmentMapName(assignmentMappingName);
            await assignmentConfigCreatePage.setCompany("Petramco");
            await assignmentConfigCreatePage.setSupportCompany("Petramco");
            await assignmentConfigCreatePage.setBusinessUnit("Australia Support");
            await assignmentConfigCreatePage.setSupportGroup("AU Support 1");
            await assignmentConfigCreatePage.clickonSaveButton();
            expect(await utilCommon.isPopUpMessagePresent('ERROR (222099): The Assignment Mapping Name already exists. Please select a different name.')).toBeTruthy("Error message absent");
            await assignmentConfigCreatePage.clickOnCancelButton();
            await utilCommon.clickOnWarningOk();
        });
        it('[DRDMV-1242]: create same name record in different LOB', async () => {
            //create same name record in different LOB
            await utilGrid.selectLineOfBusiness('Facilities');
            await assignmentConfigConsolePage.clickOnCreateAssignmentConfiguration();
            await assignmentConfigCreatePage.setAssignmentMapName(assignmentMappingName);
            await assignmentConfigCreatePage.setCompany("Petramco");
            // verify categ1, BU and SG as per LOB
            await utilCommon.isDrpDownvalueDisplayed(assignmentConfigCreatePage.selectors.catTier1DrpDwn, ['Applications', 'Facilities', 'Fixed Assets', 'Phones', 'Projectors', 'Purchasing Card']);
            await assignmentConfigCreatePage.setSupportCompany("Petramco");
            await utilCommon.isDrpDownvalueDisplayed(assignmentConfigCreatePage.selectors.businessUnitDrpDwn, ['Facilities', 'Facilities Support']);
            await assignmentConfigCreatePage.setSupportCompany("Petramco");
            await assignmentConfigCreatePage.setBusinessUnit('Facilities Support');
            await utilCommon.isDrpDownvalueDisplayed(assignmentConfigCreatePage.selectors.supportGrpDrpDwn, ['Facilities', 'Pantry Service']);
            await assignmentConfigCreatePage.setBusinessUnit('Facilities Support');
            await assignmentConfigCreatePage.setSupportGroup('Facilities');
            // verify LOB is there
            expect(await assignmentConfigCreatePage.getLobValue()).toBe("Facilities");
            await assignmentConfigCreatePage.clickonSaveButton();
            expect(await utilCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy("Success message absent");
            // open the record and verify LOB is on edit screen
            await assignmentConfigConsolePage.searchAndClickOnAssignmentConfig(assignmentMappingName);
            expect(await editAssignmentsConfigPo.getLobValue()).toBe("Facilities");
            await editAssignmentsConfigPo.clickOnCancelButton();
            await utilGrid.selectLineOfBusiness('Human Resource');
        });
        afterAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteReadAccessOrAssignmentMapping(assignmentMappingName);
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        });
    });

    //radhiman
    it('[DRDMV-11999]: [Assignment Mapping] Verify Global Company on Assignment Grid', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let assignmentMappingName = "DRDMV-11999 " + randomStr;
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', 'Configure Case Assignments - Business Workflows');
        await assignmentConfigConsolePage.clearFilter();
        await assignmentConfigConsolePage.clickOnCreateAssignmentConfiguration();
        await assignmentConfigCreatePage.setAssignmentMapName(assignmentMappingName);
        await assignmentConfigCreatePage.setCompany("- Global -");
        await assignmentConfigCreatePage.setSupportCompany("Petramco");
        await assignmentConfigCreatePage.setBusinessUnit('Australia Support');
        await assignmentConfigCreatePage.setSupportGroup("AU Support 1");
        await assignmentConfigCreatePage.clickonSaveButton();
        await assignmentConfigConsolePage.searchAssignmentConfig(assignmentMappingName);
        expect(await assignmentConfigConsolePage.getValueOnAssignmentConfigGrid("Company")).toContain("- Global -");
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteReadAccessOrAssignmentMapping(assignmentMappingName);
    });

    //radhiman
    it('[DRDMV-11964]: [Assignment Mapping] Verify Global Company on Assignment Grid', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let assignmentMappingName = "DRDMV-11964 " + randomStr;
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', 'Configure Case Assignments - Business Workflows');
        await assignmentConfigConsolePage.clearFilter();
        await assignmentConfigConsolePage.clickOnCreateAssignmentConfiguration();
        await assignmentConfigCreatePage.setAssignmentMapName(assignmentMappingName);
        await assignmentConfigCreatePage.setCompany("Petramco");
        await assignmentConfigCreatePage.setSupportCompany("Petramco");
        await assignmentConfigCreatePage.setBusinessUnit('Australia Support');
        await assignmentConfigCreatePage.setSupportGroup("AU Support 1");
        await assignmentConfigCreatePage.clickonSaveButton();
        await assignmentConfigConsolePage.searchAndClickOnAssignmentConfig(assignmentMappingName);
        await editAssignmentsConfigPo.setCompany("- Global -");
        await editAssignmentsConfigPo.clickonSaveButton();
        await assignmentConfigConsolePage.searchAndselectAssignmentConfig(assignmentMappingName);
        expect(await assignmentConfigConsolePage.getValueOnAssignmentConfigGrid("Company")).toContain("- Global -");
        await assignmentConfigConsolePage.clickDeleteButton();
        await utilCommon.clickOnWarningOk();
        //expect(await utilCommon.isPopUpMessagePresent('Record(s) deleted successfully.').tobeTruthy();
    });

    //radhiman
    describe('[DRDMV-11963]: [Assignment Mapping] Global Assignment Mapping', async () => {
        let assignmentMappingName = "DRDMV-11963 " + [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        it('[DRDMV-11963]: Global Assignment Mapping', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', 'Configure Case Assignments - Business Workflows');
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.clickOnCreateAssignmentConfiguration();
            await assignmentConfigCreatePage.setAssignmentMapName(assignmentMappingName);
            await assignmentConfigCreatePage.setCompany("- Global -");
            await assignmentConfigCreatePage.setFlowset(flowsetGlobalFieldsData.flowsetName);
            await assignmentConfigCreatePage.setCategoryTier1("Employee Relations");
            await assignmentConfigCreatePage.setCategoryTier2("Compensation");
            await assignmentConfigCreatePage.setCategoryTier3("Bonus");
            await assignmentConfigCreatePage.setPriority("Low");
            await assignmentConfigCreatePage.setSupportCompany("Petramco");
            await assignmentConfigCreatePage.setBusinessUnit('Australia Support');
            await assignmentConfigCreatePage.setSupportGroup("AU Support 1");
            await assignmentConfigCreatePage.clickonSaveButton();
        });
        it('[DRDMV-11963]: [Assignment Mapping] Global Assignment Mapping', async () => {
            await assignmentConfigConsolePage.searchAssignmentConfig(assignmentMappingName);
            expect(await assignmentConfigConsolePage.getValueOnAssignmentConfigGrid("Assignment Name")).toContain(assignmentMappingName);
            await navigationPage.signOut();
            await loginPage.login('gderuno');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', 'Configure Case Assignments - Business Workflows');
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.searchAssignmentConfig(assignmentMappingName);
            expect(await assignmentConfigConsolePage.getValueOnAssignmentConfigGrid("Assignment Name")).toContain(assignmentMappingName);
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //radhiman
    describe('[DRDMV-12034]: [Assignment Mapping] Verify precedence will be given to company specific assignment mapping if we have global approval mapping with Same name', async () => {
        let globalAssignmentMappingName = "DRDMV-12034 " + [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let companyAssignmentMappingName = "DRDMV-12034 " + [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        it('[DRDMV-12034]: Precedence will be given to company specific assignment mapping', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', 'Configure Case Assignments - Business Workflows');
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.clickOnCreateAssignmentConfiguration();
            await assignmentConfigCreatePage.setAssignmentMapName(globalAssignmentMappingName);
            await assignmentConfigCreatePage.setCompany("- Global -");
            await assignmentConfigCreatePage.setCategoryTier1("Employee Relations");
            await assignmentConfigCreatePage.setPriority("Low");
            await assignmentConfigCreatePage.setSupportCompany("Petramco");
            await assignmentConfigCreatePage.setBusinessUnit('Australia Support');
            await assignmentConfigCreatePage.setSupportGroup("AU Support 1");
            await assignmentConfigCreatePage.clickonSaveButton();
            await assignmentConfigConsolePage.searchAssignmentConfig(globalAssignmentMappingName);
            expect(await assignmentConfigConsolePage.getValueOnAssignmentConfigGrid("Assignment Name")).toContain(globalAssignmentMappingName);
        });
        it('[DRDMV-12034]: [Assignment Mapping] Verify precedence will be given to company specific assignment mapping if we have global approval mapping with Same name', async () => {
            await assignmentConfigConsolePage.clickOnCreateAssignmentConfiguration();
            await assignmentConfigCreatePage.setAssignmentMapName(companyAssignmentMappingName);
            await assignmentConfigCreatePage.setCompany("Petramco");
            await assignmentConfigCreatePage.setCategoryTier1("Employee Relations");
            await assignmentConfigCreatePage.setPriority("Low");
            await assignmentConfigCreatePage.setSupportCompany("Petramco");
            await assignmentConfigCreatePage.setBusinessUnit('Australia Support');
            await assignmentConfigCreatePage.setSupportGroup("AU Support 2");
            await assignmentConfigCreatePage.clickonSaveButton();
            await assignmentConfigConsolePage.searchAssignmentConfig(companyAssignmentMappingName);
            expect(await assignmentConfigConsolePage.getValueOnAssignmentConfigGrid("Assignment Name")).toContain(companyAssignmentMappingName);
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary("DRDMV-12034 Case Summary");
            await createCasePage.setPriority("Low");
            await createCasePage.selectCategoryTier1("Employee Relations");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getAssignedGroupText()).toBe("AU Support 2");
        });
    });

    //radhiman
    describe('[DRDMV-12033]: [Assignment Mapping] Verify Global assignment mapping applied to case if assignment qualification matches', async () => {
        let assignmentMappingName = "DRDMV-12033 " + [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        it('[DRDMV-12033]: Global assignment mapping applied to case if assignment qualification matches', async () => {
            await navigationPage.signOut();
            await loginPage.login('gwixillian');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', 'Configure Case Assignments - Business Workflows');
            await assignmentConfigConsolePage.clearFilter();
            //Need to delete all Psilon related assignments, then only global can apply
            await assignmentConfigConsolePage.addFilter('Company', 'Psilon', 'text');
            await assignmentConfigConsolePage.clickDeleteButtonOnlyIfRecordsPresent();
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.clickOnCreateAssignmentConfiguration();
            await assignmentConfigCreatePage.setAssignmentMapName(assignmentMappingName);
            await assignmentConfigCreatePage.setCompany("- Global -");
            await assignmentConfigCreatePage.setCategoryTier1("Employee Relations");
            await assignmentConfigCreatePage.setCategoryTier2("Compensation");
            await assignmentConfigCreatePage.setPriority("Medium");
            await assignmentConfigCreatePage.setSupportCompany("Psilon");
            await assignmentConfigCreatePage.setBusinessUnit('Psilon Support Org2')
            await assignmentConfigCreatePage.setSupportGroup("Psilon Support Group2");
            await assignmentConfigCreatePage.clickonSaveButton();
        });
        it('[DRDMV-12033]: [Assignment Mapping] Verify Global assignment mapping applied to case if assignment qualification matches', async () => {
            await assignmentConfigConsolePage.searchAssignmentConfig(assignmentMappingName);
            expect(await assignmentConfigConsolePage.getValueOnAssignmentConfigGrid("Assignment Name")).toContain(assignmentMappingName);
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("gderuno");
            await createCasePage.setSummary("DRDMV-12033 Case Summary");
            await createCasePage.setPriority("Medium");
            await createCasePage.selectCategoryTier1("Employee Relations");
            await createCasePage.selectCategoryTier2("Compensation");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getAssignedGroupText()).toBe("Psilon Support Group2");
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //radhiman
    describe('[DRDMV-1212]: [Assignment Mapping] Configuring an Assignment Mapping', async () => {
        let templateData, randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let globalAssignmentMappingName = "GlobalDRDMV-1212_CaseAssignmentMapping_" + randomStr;
        let companyAssignmentMappingName = "PetramcoDRDMV-1212_CaseAssignmentMapping_" + randomStr;
        let facilitiesAssignmentMappingName = "FacilitiesDRDMV-1212_CaseAssignmentMapping_" + randomStr;

        beforeAll(async () => {
            templateData = {
                "templateName": 'caseTemplateName' + randomStr,
                "templateSummary": 'caseTemplateSummary' + randomStr,
                "categoryTier1": "Employee Relations",
                "templateStatus": "Active",
                "company": "Petramco",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            await createNewUsers();
            await apiHelper.createCaseTemplate(templateData);
        });

        it('[DRDMV-1212]: [Assignment Mapping] Configuring an Assignment Mapping for Human Resource Line of Business', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', 'Configure Case Assignments - Business Workflows');
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.clickOnCreateAssignmentConfiguration();
            await assignmentConfigCreatePage.setAssignmentMapName(globalAssignmentMappingName);
            await assignmentConfigCreatePage.setCompany("- Global -");
            await assignmentConfigCreatePage.setCategoryTier1("Applications");
            await assignmentConfigCreatePage.setSupportCompany("Petramco");
            await assignmentConfigCreatePage.setBusinessUnit('Australia Support');
            await assignmentConfigCreatePage.setSupportGroup("AU Support 2");
            await assignmentConfigCreatePage.clickonSaveButton();
            expect(await utilCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');

            await assignmentConfigConsolePage.clickOnCreateAssignmentConfiguration();
            await assignmentConfigCreatePage.setAssignmentMapName(companyAssignmentMappingName);
            await assignmentConfigCreatePage.setCompany("Petramco");
            await assignmentConfigCreatePage.setCategoryTier1("Applications");
            await assignmentConfigCreatePage.setSupportCompany("Petramco");
            await assignmentConfigCreatePage.setBusinessUnit('Australia Support');
            await assignmentConfigCreatePage.setSupportGroup("AU Support 3");
            await assignmentConfigCreatePage.clickonSaveButton();
            expect(await utilCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
        });

        it('[DRDMV-1212]: Verify if case assignment mapping is accessible to same LOB Case Manager', async () => {
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', 'Configure Case Assignments - Business Workflows');
            expect(await utilGrid.isGridRecordPresent(globalAssignmentMappingName)).toBeTruthy('Case Assignment Mapping are not displayed to same LOB Case manager.');
            expect(await utilGrid.isGridRecordPresent(companyAssignmentMappingName)).toBeTruthy('Case Assignment Mapping are not displayed to same LOB Case manager.');
        });

        it('[DRDMV-1212]: Verify if case assignment mapping is accessible to different LOB Case BA', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', 'Configure Case Assignments - Business Workflows');
            expect(await utilGrid.isGridRecordPresent(globalAssignmentMappingName)).toBeFalsy('Case Assignment Mapping are displayed to different LOB Case BA.');
            expect(await utilGrid.isGridRecordPresent(companyAssignmentMappingName)).toBeFalsy('Case Assignment Mapping are displayed to different LOB Case BA.');
            await assignmentConfigConsolePage.clickOnCreateAssignmentConfiguration();
            await assignmentConfigCreatePage.setAssignmentMapName(facilitiesAssignmentMappingName);
            await assignmentConfigCreatePage.setCompany("Petramco");
            await assignmentConfigCreatePage.setCategoryTier1("Applications");
            await assignmentConfigCreatePage.setSupportCompany("Petramco");
            await assignmentConfigCreatePage.setBusinessUnit('Facilities Support');
            await assignmentConfigCreatePage.setSupportGroup("Facilities");
            await assignmentConfigCreatePage.clickonSaveButton();
            expect(await utilCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
        });

        it('[DRDMV-1212]: Verify if case assignment mapping is accessible to different LOB Case Manager', async () => {
            await navigationPage.signOut();
            await loginPage.login('frieda');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', 'Configure Case Assignments - Business Workflows');
            expect(await utilGrid.isGridRecordPresent(globalAssignmentMappingName)).toBeFalsy('Case Assignment Mapping are displayed to different LOB Case Manager.');
            expect(await utilGrid.isGridRecordPresent(companyAssignmentMappingName)).toBeFalsy('Case Assignment Mapping are displayed to different LOB Case Manager.');
            expect(await utilGrid.isGridRecordPresent(facilitiesAssignmentMappingName)).toBeTruthy('Case Assignment Mapping are displayed to same LOB Case Manager.');
        });

        it('[DRDMV-1212]: Verify if case assignment mapping is accessible to Case BA belonging to different company with same LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('gwixillian');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', 'Configure Case Assignments - Business Workflows');
            expect(await utilGrid.isGridRecordPresent(globalAssignmentMappingName)).toBeTruthy('Case Assignment Mapping are not displayed to same LOB Case BA.');
            expect(await utilGrid.isGridRecordPresent(companyAssignmentMappingName)).toBeTruthy('Case Assignment Mapping are not displayed to same LOB Case BA.');
        });

        it('[DRDMV-1212]: Verify if case assignment mapping is accessible to Case Manager user having access to multiple LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('caseMngrMultiLOB@petramco.com', 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', 'Configure Case Assignments - Business Workflows');
            await utilGrid.selectLineOfBusiness('Human Resource');
            expect(await utilGrid.isGridRecordPresent(globalAssignmentMappingName)).toBeTruthy('Case Assignment Mapping are not displayed to multiple LOB Case manager.');
            expect(await utilGrid.isGridRecordPresent(companyAssignmentMappingName)).toBeTruthy('Case Assignment Mapping are not displayed to multiple LOB Case manager.');
            expect(await utilGrid.isGridRecordPresent(facilitiesAssignmentMappingName)).toBeFalsy('Case Assignment Mapping are displayed to multiple LOB Case Manager.');
            await utilGrid.selectLineOfBusiness('Facilities');
            expect(await utilGrid.isGridRecordPresent(globalAssignmentMappingName)).toBeFalsy('Case Assignment Mapping are displayed to multiple LOB Case Manager.');
            expect(await utilGrid.isGridRecordPresent(companyAssignmentMappingName)).toBeFalsy('Case Assignment Mapping are displayed to multiple LOB Case Manager.');
            expect(await utilGrid.isGridRecordPresent(facilitiesAssignmentMappingName)).toBeTruthy('Case Assignment Mapping are not displayed to multiple LOB Case Manager.');
        });

        it('[DRDMV-1212]: Verify if case assignment mapping is accessible to Case BA user having access to multiple LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('caseBAMultiLOB@petramco.com', 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', 'Configure Case Assignments - Business Workflows');
            await utilGrid.selectLineOfBusiness('Facilities');
            expect(await utilGrid.isGridRecordPresent(globalAssignmentMappingName)).toBeFalsy('Case Assignment Mapping are displayed to multiple LOB Case BA.');
            expect(await utilGrid.isGridRecordPresent(companyAssignmentMappingName)).toBeFalsy('Case Assignment Mapping are displayed to multiple LOB Case BA.');
            expect(await utilGrid.isGridRecordPresent(facilitiesAssignmentMappingName)).toBeTruthy('Case Assignment Mapping are not displayed to multiple LOB Case BA.');

            await utilGrid.selectLineOfBusiness('Human Resource');
            expect(await utilGrid.isGridRecordPresent(globalAssignmentMappingName)).toBeTruthy('Case Assignment Mapping are not displayed to multiple LOB Case BA.');
            expect(await utilGrid.isGridRecordPresent(companyAssignmentMappingName)).toBeTruthy('Case Assignment Mapping are not displayed to multiple LOB Case BA.');
            expect(await utilGrid.isGridRecordPresent(facilitiesAssignmentMappingName)).toBeFalsy('Case Assignment Mapping are displayed to multiple LOB Case BA.');
            await assignmentConfigConsolePage.searchAndClickOnAssignmentConfig(companyAssignmentMappingName);
            await editAssignmentsConfigPo.setAssignee('RA3 Liu');
            await editAssignmentsConfigPo.clickonSaveButton();
            expect(await utilCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
        });

        it('[DRDMV-1212]: Verify if case assignment mapping is applied to the case created', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary("DRDMV-1212 Case Summary");
            await createCasePage.selectCategoryTier1("Applications");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePo.clickOnTab('Case Access');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('caseBA MultiLOB', 'Write')).toBeTruthy('FailuerMsg1: Agent Name is missing');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('AU Support 3', 'Write')).toBeTruthy('Support Group does not have write access');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteReadAccessOrAssignmentMapping(companyAssignmentMappingName);
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary("DRDMV-1212 Case Summary");
            await createCasePage.selectCategoryTier1("Applications");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePo.clickOnTab('Case Access');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('Workforce Administration', 'Write')).toBeTruthy('Support Group does not have write access');
        });

        afterAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteReadAccessOrAssignmentMapping(globalAssignmentMappingName);
            await apiHelper.deleteReadAccessOrAssignmentMapping(facilitiesAssignmentMappingName);
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });


    });

    describe('[DRDMV-11825,DRDMV-11826,DRDMV-11827,DRDMV-11828,DRDMV-11978]: Verify Company and Support Group selection hierarchy.', async () => {
        let randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let businessData = businessDataFile['BusinessUnitData11825'];
        let departmentData = departmentDataFile['DepartmentData11825'];
        let suppGrpData = supportGrpDataFile['SuppGrpData11825'];
        let summary = 'Adhoc task ' + randomStr;

        it('[DRDMV-11825,DRDMV-11826,DRDMV-11827,DRDMV-11828,DRDMV-11978]: Case Company and Support Group selection hierarchy', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary("DRDMV-11825 Case Summary");
            await createCasePage.setPriority("Medium");
            await createCasePage.clickChangeAssignmentButton();
            await changeAssignmentPage.selectBusinessUnit(businessData.orgName);
            await changeAssignmentPage.selectDepartment(departmentData.orgName);
            await changeAssignmentPage.selectSupportGroup(suppGrpData.orgName);
            await changeAssignmentPage.selectAssignee('fnPerson11825 lnPerson11825');
            await changeAssignmentPage.clickOnAssignButton();
            await createCasePage.clickSaveCaseButton();
            await utilityCommon.closePopUpMessage();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getAssignedGroupText()).toBe(suppGrpData.orgName, "Support Group Not Populated");
            expect(await viewCasePo.getAssigneeText()).toBe('fnPerson11825 lnPerson11825', "assignee is not available");
            expect(await viewCasePo.getBusinessUnitText()).toBe(businessData.orgName, "Buisness Unit is not available");
            expect(await viewCasePo.getDepartmentText()).toBe(departmentData.orgName, "Department is not available");
            expect(await viewCasePo.getAssignedCompanyText()).toBe("Petramco", "Company is not available");
        });
        it('[DRDMV-11825,DRDMV-11826,DRDMV-11827,DRDMV-11828,DRDMV-11978]: Task Company and Support Group selection hierarchy', async () => {
            await viewCasePo.clickAddTaskButton();
            await manageTaskPo.clickAddAdhocTaskButton();
            await adhoctaskTemplate.setSummary(summary);
            await adhoctaskTemplate.setDescription("Description");
            await adhoctaskTemplate.clickSaveAdhoctask();
            await utilityCommon.closePopUpMessage();
            await manageTaskPo.clickTaskLink(summary);
            await viewTask.clickOnEditTask();
            await editTaskPo.updateTaskSummary(summary + "new");
            await editTaskPo.clickOnChangeAssignementButton();
            await changeAssignmentPage.selectBusinessUnit(businessData.orgName);
            await changeAssignmentPage.selectDepartment(departmentData.orgName);
            await changeAssignmentPage.selectSupportGroup(suppGrpData.orgName);
            await changeAssignmentPage.selectAssignee('fnPerson11825 lnPerson11825');
            await changeAssignmentPage.clickOnAssignButton();
            await editTaskPo.clickOnSaveButton();
            await utilCommon.closePopUpMessage();
            expect(await viewTask.getAssignedGroupText()).toBe(suppGrpData.orgName, "Support Group Not Populated");
            expect(await viewTask.getAssigneeText()).toContain('fnPerson11825 lnPerson11825', "assignee is not available");
            expect(await viewTask.getBusinessUnitText()).toBe(businessData.orgName, "Buisness Unit is not available");
            expect(await viewTask.getDepartmentText()).toBe(departmentData.orgName, "Department is not available");
            expect(await viewTask.getAssignedCompanyText()).toBe("Petramco", "Company is not available");
        });
        it('[DRDMV-11825,DRDMV-11826,DRDMV-11827,DRDMV-11828,DRDMV-11978]: Case Template Company and Support Group selection hierarchy', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await consoleCasetemplatePage.clickOnCreateCaseTemplateButton();
            await createCaseTemplate.setTemplateName("caseTemplateName" + randomStr);
            await createCaseTemplate.setCompanyName("Petramco");
            await createCaseTemplate.setCaseSummary("caseTemplateSummary1" + randomStr);
            await createCaseTemplate.setOwnerCompanyValue("Petramco");
            await createCaseTemplate.setBusinessUnitDropdownValue(businessData.orgName);
            await createCaseTemplate.setDepartmentDropdownValue(departmentData.orgName);
            await createCaseTemplate.setOwnerGroupDropdownValue(suppGrpData.orgName);
            await createCaseTemplate.clickOnChangeAssignmentButton();
            await changeAssignmentOldPage.selectBusinessUnit(businessData.orgName);
            await changeAssignmentOldPage.selectDepartment(departmentData.orgName);
            await changeAssignmentOldPage.selectSupportGroup(suppGrpData.orgName);
            await changeAssignmentOldPage.selectAssignee('fnPerson11825 lnPerson11825');
            await changeAssignmentOldPage.clickOnAssignButton();
            await createCaseTemplate.clickSaveCaseTemplate();
            expect(await viewCaseTemplate.getAssigneeText()).toContain('fnPerson11825 lnPerson11825', "assignee is not available");
            expect(await viewCaseTemplate.getAssigneeBusinessUnitValue()).toBe(businessData.orgName);
            expect(await viewCaseTemplate.getAssigneeDepartmentValue()).toBe(departmentData.orgName);
            expect(await viewCaseTemplate.getBuisnessUnitValue()).toBe(businessData.orgName);
            expect(await viewCaseTemplate.getDepartmentValue()).toBe(departmentData.orgName);
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
        });
        it('[DRDMV-11825,DRDMV-11826,DRDMV-11827,DRDMV-11828,DRDMV-11978]: Verify Company and Support Group selection hierarchy.', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.clickOnManualTaskTemplateButton();
            await taskTemplate.setTemplateName('manualTaskTemplate' + randomStr);
            await taskTemplate.setTaskSummary('manualTaskSummary' + randomStr);
            await taskTemplate.setTaskDescription('Description in manual task');
            await taskTemplate.selectCompanyByName('Petramco');
            await taskTemplate.selectOwnerCompany("Petramco");
            await taskTemplate.selectBuisnessUnit(businessData.orgName);
            await taskTemplate.selectDepartment(departmentData.orgName);
            await taskTemplate.selectOwnerGroup(suppGrpData.orgName);
            await taskTemplate.clickOnAssignment();
            await changeAssignmentOldPage.selectBusinessUnit(businessData.orgName);
            await changeAssignmentOldPage.selectDepartment(departmentData.orgName);
            await changeAssignmentOldPage.selectSupportGroup(suppGrpData.orgName);
            await changeAssignmentOldPage.selectAssignee('fnPerson11825 lnPerson11825');
            await changeAssignmentOldPage.clickOnAssignButton();
            await taskTemplate.clickOnSaveTaskTemplate();
            expect(await viewTaskTemplate.getAssigneeText()).toBe('fnPerson11825 lnPerson11825', "assignee is not available");
            expect(viewTaskTemplate.getAssigneeBusinessUnitValue()).toBe(businessData.orgName);
            expect(viewTaskTemplate.getAssigneeDepartmentValue()).toBe(departmentData.orgName);
            expect(viewTaskTemplate.getBuisnessunitValue()).toBe(businessData.orgName);
            expect(viewTaskTemplate.getDepartmentValue()).toBe(departmentData.orgName);
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[DRDMV-12080]: Verify Company, Business Unit , Department and Support group selection hierarchy in Case  Access.', async () => {
        let businessData = businessDataFile['BusinessUnitData11825'];
        let departmentData = departmentDataFile['DepartmentData11825'];
        let suppGrpData = supportGrpDataFile['SuppGrpData11825'];
        it('[DRDMV-12080]: Create case', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary("DRDMV-12080 Case Summary");
            await createCasePage.setPriority("Medium");
            await createCasePage.selectCategoryTier1("Employee Relations");
            await createCasePage.selectCategoryTier2("Compensation");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePo.clickOnTab('Case Access');
        });
        it('[DRDMV-12080]:Verify Company, Business Unit , Department and Support group selection hierarchy in Case  Access.', async () => {
            await accessTabPo.clickToExpandAccessEntitiySearch('Support Group Access', 'Case');
            await accessTabPo.selectAccessEntityDropDown('Petramco', 'Select Company');
            await accessTabPo.selectAccessEntityDropDown(businessData.orgName, 'Select Business Unit');
            await accessTabPo.clickAccessEntitiyAddButton('Business Unit');
            await accessTabPo.selectAccessEntityDropDown('Petramco', 'Select Company');
            await accessTabPo.selectAccessEntityDropDown(businessData.orgName, 'Select Business Unit');
            await accessTabPo.selectAccessEntityDropDown(departmentData.orgName, 'Select Department');
            await accessTabPo.clickAccessEntitiyAddButton('Department');
            await accessTabPo.selectAccessEntityDropDown('Petramco', 'Select Company');
            await accessTabPo.selectAccessEntityDropDown(businessData.orgName, 'Select Business Unit');
            await accessTabPo.selectAccessEntityDropDown(departmentData.orgName, 'Select Department');
            await accessTabPo.selectAccessEntityDropDown(suppGrpData.orgName, 'Select Support Group');
            await accessTabPo.clickAccessEntitiyAddButton('Support Group');
            await accessTabPo.clickToExpandAccessEntitiySearch('Agent Access', 'Case');
            await accessTabPo.selectAgent('fnPerson11825 lnPerson11825', 'Agent');
            await accessTabPo.clickAccessEntitiyAddButton('Agent');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('fnPerson11825 lnPerson11825', 'Read')).toBeTruthy('Failuer: Agent Name is missing');
        });
    });

    describe('[DRDMV-1495]: [Permissions] Case Assignment Mapping access', () => {
        let randomStr: string = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let personData = personDataFile['PersonData11825'];
        it('[DRDMV-1495]: [Permissions] Case Assignment Mapping access', async () => {
            await navigationPage.signOut();
            await loginPage.login(personData.userId + "@petramco.com", 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', 'Configure Case Assignments - Business Workflows');

            //Create Assignment mapping
            await assignmentConfigConsolePage.clickOnCreateAssignmentConfiguration();
            expect(await assignmentConfigCreatePage.isCompanyDropdownValueMatches(['- Global -', 'Petramco'])).toBeTruthy('Dropdown values do not match');
            await utilCommon.closeBladeOnSettings();
            await assignmentConfigConsolePage.clickOnCreateAssignmentConfiguration();
            await assignmentConfigCreatePage.setAssignmentMapName('Assignement Mapping' + randomStr);
            await assignmentConfigCreatePage.setCompany("- Global -");
            await assignmentConfigCreatePage.setSupportCompany("Petramco");
            await assignmentConfigCreatePage.setBusinessUnit('Australia Support');
            await assignmentConfigCreatePage.setSupportGroup("AU Support 1");
            await assignmentConfigCreatePage.clickonSaveButton();
            expect(await utilCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Successfull message is not appeared');

            //Update assignment mapping
            await utilGrid.searchAndOpenHyperlink('Assignement Mapping' + randomStr);
            await editAssignmentsConfigPo.setAssignmentMappingName("Assignement Mapping_updated " + randomStr);
            await editAssignmentsConfigPo.clickonSaveButton();
            expect(await utilCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Successfull message is not appeared');

            //Delete Assignment mapping
            await utilGrid.searchAndSelectAllCheckBoxWOGrid("Assignement Mapping_updated " + randomStr);
            await assignmentConfigConsolePage.clickDeleteButton();
            await utilCommon.clickOnWarningOk();
            expect(await utilCommon.isPopUpMessagePresent('Record(s) deleted successfully.')).toBeTruthy('Successfull message is not appeared');
        });

        it('[DRDMV-1495]: [Permissions] Case Assignment Mapping access of different company user', async () => {
            //Login with Psilon Case Manager and verify the access

            await navigationPage.signOut();
            await loginPage.login('rrovnitov');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', 'Configure Case Assignments - Business Workflows');
            expect(await utilGrid.isGridRecordPresent("Assignement Mapping_updated " + randomStr)).toBeFalsy('Record is available');

            //Login with Psilon Case Admin and verify the access
            await navigationPage.signOut();
            await loginPage.login('gwixillian');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', 'Configure Case Assignments - Business Workflows');
            expect(await utilGrid.isGridRecordPresent("Assignement Mapping_updated " + randomStr)).toBeFalsy('Record is available');
        });

        afterAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteReadAccessOrAssignmentMapping("Assignement Mapping_updated " + randomStr);
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[DRDMV-15181]:[Permissions] Location based assignment with multiple companies', async () => {
        let randomStr: string = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let assignmentMappingName = "DRDMV-15181 " + randomStr;
        beforeAll(async () => {
            await createNewUsers();
        });
        it('[DRDMV-15181]:[Permissions] Location based assignment with multiple companies', async () => {
            await navigationPage.signOut();
            await loginPage.login(userData.userId + "@petramco.com", 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', 'Configure Case Assignments - Business Workflows');
            await assignmentConfigConsolePage.clickOnCreateAssignmentConfiguration();
            await assignmentConfigCreatePage.setAssignmentMapName(assignmentMappingName);
            await assignmentConfigCreatePage.setCategoryTier1("Employee Relations");
            await assignmentConfigCreatePage.setCompany("Petramco");
            await assignmentConfigCreatePage.setPriority('Critical');
            await assignmentConfigCreatePage.setRegion('Australia');
            await assignmentConfigCreatePage.setSupportCompany("Psilon");
            await assignmentConfigCreatePage.setSite('Canberra');
            await assignmentConfigCreatePage.setBusinessUnit('Psilon Support Org1');
            await assignmentConfigCreatePage.setSupportGroup("Psilon Support Group1");
            await assignmentConfigCreatePage.setAssignee("Glit Deruno");
            await assignmentConfigCreatePage.clickonSaveButton();
            await utilityCommon.closePopUpMessage();
        });
        it('[DRDMV-15181]:[Permissions] Location based assignment with multiple companies', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', 'Configure Case Assignments - Business Workflows');
            await assignmentConfigConsolePage.clickOnCreateAssignmentConfiguration();
            await assignmentConfigCreatePage.setAssignmentMapName(assignmentMappingName);
            await assignmentConfigCreatePage.setCategoryTier1("Employee Relations");
            await assignmentConfigCreatePage.setCompany("- Global -");
            await assignmentConfigCreatePage.setPriority('Critical');
            await assignmentConfigCreatePage.setRegion('Australia');
            await assignmentConfigCreatePage.setSupportCompany("Psilon");
            await assignmentConfigCreatePage.setSite('Canberra');
            await assignmentConfigCreatePage.setBusinessUnit('Psilon Support Org1');
            await assignmentConfigCreatePage.setSupportGroup("Psilon Support Group1");
            await assignmentConfigCreatePage.setAssignee("Glit Deruno");
            await assignmentConfigCreatePage.clickonSaveButton();
            await utilityCommon.closePopUpMessage();
        });
        it('[DRDMV-15181]:[Permissions] Location based assignment with multiple companies', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary("DRDMV-8968 Case Summary1");
            await createCasePage.setPriority('Critical');
            await createCasePage.selectSite('Canberra');
            await createCasePage.selectCategoryTier1("Employee Relations");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getAssignedGroupText()).toBe('Psilon Support Group1');
            expect(await viewCasePo.getAssigneeText()).toBe('Glit Deruno');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.associatePersonToCompany(userData1.userId, "Phylum");
        });
        it('[DRDMV-15181]:[Permissions] Location based assignment with multiple companies', async () => {
            await navigationPage.signOut();
            await loginPage.login(userData1.userId + "@petramco.com", 'Password_1234');
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary("DRDMV-8968 Case Summary1");
            await createCasePage.setPriority('Critical');
            await createCasePage.selectSite('Canberra');
            await createCasePage.selectCategoryTier1("Employee Relations");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getAssignedGroupText()).toBe('Psilon Support Group1');
            expect(await viewCasePo.getAssigneeText()).toBe('Glit Deruno');
        });
        afterAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteReadAccessOrAssignmentMapping(assignmentMappingName);
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[DRDMV-14935]:Verify the values belonging to a perticular company for the fields Region and Site are according to logged in user permission', async () => {
        let randomStr: string = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let region: string[] = ['AMER', 'APAC', 'Australia', 'Caribbean', 'Central America', 'Central Asia', 'China', 'Chūbu', 'Chūgoku', 'EMEA', 'East Asia', 'Hokkaidō', 'Japan', 'Kansai', 'Kantō', 'Kyūshū', 'North America', 'Shikoku', 'South America', 'South Asia', 'Southeast Asia', 'Tōhoku'];
        let site: string[] = [' ', 'Canberra', 'Macquarie Park', 'Melbourne', 'Wellington'];
        it('[DRDMV-14935]:Verify the values belonging to a perticular company for the fields Region and Site are according to logged in user permission', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', 'Configure Case Assignments - Business Workflows');
            await assignmentConfigConsolePage.clickOnCreateAssignmentConfiguration();
            await assignmentConfigCreatePage.setAssignmentMapName("1DRDMV14935 " + randomStr);
            await assignmentConfigCreatePage.setCompany("Petramco");
            expect(await assignmentConfigCreatePage.isRegionAllDropDownValuesMatches(region)).toBeTruthy('FailureMsg: Region options mismatch');
            await assignmentConfigCreatePage.setSupportCompany("Petramco");
            await assignmentConfigCreatePage.setRegion('Australia');
            expect(await assignmentConfigCreatePage.isSiteAllDropDownValuesMatches(site)).toBeTruthy('FailureMsg: Site options mismatch');
            await assignmentConfigCreatePage.setPriority('Critical');
            await assignmentConfigCreatePage.setSite('Canberra');
            await assignmentConfigCreatePage.setBusinessUnit('Australia Support');
            await assignmentConfigCreatePage.setSupportGroup("AU Support 1");
            await assignmentConfigCreatePage.clickonSaveButton();
        });
        it('[DRDMV-14935]:Verify the values belonging to a perticular company for the fields Region and Site are according to logged in user permission', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', 'Configure Case Assignments - Business Workflows');
            await assignmentConfigConsolePage.clickOnCreateAssignmentConfiguration();
            await assignmentConfigCreatePage.setAssignmentMapName("2DRDMV14935 " + randomStr);
            await assignmentConfigCreatePage.setCompany("- Global -");
            expect(await assignmentConfigCreatePage.isRegionAllDropDownValuesMatches(region)).toBeTruthy('FailureMsg: Region options mismatch');
            await assignmentConfigCreatePage.setSupportCompany("Petramco");
            await assignmentConfigCreatePage.setRegion('Australia');
            expect(await assignmentConfigCreatePage.isSiteAllDropDownValuesMatches(site)).toBeTruthy('FailureMsg: Site options mismatch');
            await assignmentConfigCreatePage.setPriority('Critical');
            await assignmentConfigCreatePage.setSite('Canberra');
            await assignmentConfigCreatePage.setBusinessUnit('Australia Support');
            await assignmentConfigCreatePage.setSupportGroup("AU Support 1");
            await assignmentConfigCreatePage.clickonSaveButton();
        });
        afterAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteReadAccessOrAssignmentMapping("1DRDMV14935 " + randomStr);
            await apiHelper.deleteReadAccessOrAssignmentMapping("2DRDMV14935 " + randomStr);
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    xdescribe('[DRDMV-15170]: Assignment mapping search using filters', async () => {
        let assignmentMapping1, id, label, assignmentData1, assignmentData2, randomStr: string = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let arr1: string[] = ["Department", "Flowset", "Business Unit", "Label", "Category Tier 4", "ID"];
        let defaultCaseAssignmentColumns: string[] = ["Case Priority", "Company", "Category Tier 1", "Category Tier 2", "Category Tier 3", "Region", "Site", "Support Company", "Support Group", "Default Mapping"];
        let businessData, departmentData, suppGrpData;
        beforeAll(async () => {
            await foundationData2('Phylum', 'BusinessUnitDataPhylum1', 'DepartmentDataPhylum1', 'SuppGrpDataPhylum1', 'PhylumCaseAgent4');
            businessData = businessDataFile['BusinessUnitDataPhylum1'];
            departmentData = departmentDataFile['DepartmentDataPhylum1'];
            suppGrpData = supportGrpDataFile['SuppGrpDataPhylum1'];
            await createNewUsers();
            let menuItemData = cloneDeep(SAMPLE_MENU_ITEM);
            label = "MappingLabel" + randomStr;
            menuItemData.menuItemName = label;
            assignmentData1 = {
                "assignmentMappingName": randomStr + "1DRDMV8968",
                "company": "Phylum",
                "supportCompany": "Phylum",
                "businessUnit": businessData.orgName,
                "department": departmentData.orgName,
                "supportGroup": suppGrpData.orgName,
                "categoryTier1": "Employee Relations",
                "categoryTier2": "Compensation",
                "categoryTier3": "Bonus",
                "categoryTier4": "Retention Bonus",
                "priority": "Low",
                "region": "North America",
                "site": "Phylum Site1",
                "label": label
            }
            assignmentData2 = {
                "assignmentMappingName": randomStr + "2DRDMV8968",
                "company": "Phylum",
                "supportCompany": "Phylum",
                "businessUnit": businessData.orgName,
                "department": departmentData.orgName,
                "supportGroup": suppGrpData.orgName,
                "categoryTier1": "Payroll",
                "categoryTier2": "Finance",
                "categoryTier3": "Cost Centers",
                "priority": "High",
                "region": "North America",
                "site": "Phylum Site2",
                "label": label
            }
            await apiHelper.apiLogin(userId1, "Password_1234");
            await apiHelper.createNewMenuItem(menuItemData);
            assignmentMapping1 = await apiHelper.createCaseAssignmentMapping(assignmentData1);
            await apiHelper.createCaseAssignmentMapping(assignmentData2);
            id = assignmentMapping1.id;
        });
        it('[DRDMV-15170]: Assignment mapping search using filters', async () => {
            await navigationPage.signOut();
            await loginPage.login(userId1, 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', 'Configure Case Assignments - Business Workflows');
            await assignmentConfigConsolePage.deleteDefaultAssignmentConfig();
            await assignmentConfigConsolePage.searchAndClickOnAssignmentConfig(assignmentData1.assignmentMappingName);
            await editAssignmentsConfigPo.setDefaultToggleButton(true);
            await editAssignmentsConfigPo.clickonSaveButton();
            await utilCommon.closePopUpMessage();
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.addFilter('Company', 'Phylum', 'text');
            await utilGrid.searchRecord(assignmentData1.assignmentMappingName);
            expect(await utilGrid.isGridRecordPresent(assignmentData1.assignmentMappingName)).toBeTruthy(assignmentData1.assignmentMappingName);
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.addFilter('Support Company', 'Phylum', 'text');
            await utilGrid.searchRecord(assignmentData1.assignmentMappingName);
            expect(await utilGrid.isGridRecordPresent(assignmentData1.assignmentMappingName)).toBeTruthy(assignmentData1.assignmentMappingName);
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.addFilter('Region', 'North America', 'text');
            await utilGrid.searchRecord(assignmentData1.assignmentMappingName);
            expect(await utilGrid.isGridRecordPresent(assignmentData1.assignmentMappingName)).toBeTruthy(assignmentData1.assignmentMappingName);
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.addFilter('Site', 'Phylum Site2', 'text');
            await utilGrid.searchRecord(assignmentData2.assignmentMappingName);
            expect(await utilGrid.isGridRecordPresent(assignmentData1.assignmentMappingName)).toBeFalsy(assignmentData1.assignmentMappingName);
            expect(await utilGrid.isGridRecordPresent(assignmentData2.assignmentMappingName)).toBeTruthy(assignmentData2.assignmentMappingName);
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.addFilter('Case Priority', 'Low', 'checkbox');
            await utilGrid.searchRecord(assignmentData1.assignmentMappingName);
            expect(await utilGrid.isGridRecordPresent(assignmentData1.assignmentMappingName)).toBeTruthy(assignmentData1.assignmentMappingName);
            expect(await utilGrid.isGridRecordPresent(assignmentData2.assignmentMappingName)).toBeFalsy(assignmentData2.assignmentMappingName);
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.addFilter('Default Mapping', 'True', 'checkbox');
            await utilGrid.searchRecord(assignmentData1.assignmentMappingName);
            expect(await assignmentConfigConsolePage.getSelectedGridRecordValue('Default Mapping')).toContain("True", 'Filter Default Mapping is missing in column');
        });
        it('[DRDMV-15170]: Assignment mapping search using filters', async () => {
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.addFilter('Assignment Name', assignmentData2.assignmentMappingName, 'text');
            await utilGrid.searchRecord(assignmentData2.assignmentMappingName);
            expect(await utilGrid.isGridRecordPresent(assignmentData1.assignmentMappingName)).toBeFalsy(assignmentData1.assignmentMappingName);
            expect(await utilGrid.isGridRecordPresent(assignmentData2.assignmentMappingName)).toBeTruthy(assignmentData2.assignmentMappingName);
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.addFilter('Category Tier 1', "Employee Relations", 'text');
            await utilGrid.searchRecord(assignmentData1.assignmentMappingName);
            expect(await utilGrid.isGridRecordPresent(assignmentData1.assignmentMappingName)).toBeTruthy(assignmentData1.assignmentMappingName);
            expect(await utilGrid.isGridRecordPresent(assignmentData2.assignmentMappingName)).toBeFalsy(assignmentData2.assignmentMappingName);
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.addFilter('Category Tier 2', 'Finance', 'text');
            await utilGrid.searchRecord(assignmentData2.assignmentMappingName);
            expect(await utilGrid.isGridRecordPresent(assignmentData1.assignmentMappingName)).toBeFalsy(assignmentData1.assignmentMappingName);
            expect(await utilGrid.isGridRecordPresent(assignmentData2.assignmentMappingName)).toBeTruthy(assignmentData2.assignmentMappingName);
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.addFilter('Category Tier 3', "Bonus", 'text');
            await utilGrid.searchRecord(assignmentData1.assignmentMappingName);
            expect(await utilGrid.isGridRecordPresent(assignmentData1.assignmentMappingName)).toBeTruthy(assignmentData1.assignmentMappingName);
            expect(await utilGrid.isGridRecordPresent(assignmentData2.assignmentMappingName)).toBeFalsy(assignmentData2.assignmentMappingName);
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.addFilter('Support Group', suppGrpData.orgName, 'text');
            await utilGrid.searchRecord(assignmentData1.assignmentMappingName);
            expect(await utilGrid.isGridRecordPresent(assignmentData1.assignmentMappingName)).toBeTruthy(assignmentData1.assignmentMappingName);
            expect(await utilGrid.isGridRecordPresent(assignmentData2.assignmentMappingName)).toBeTruthy(assignmentData2.assignmentMappingName);
        });
        it('[DRDMV-15170]: Assignment mapping search using filters', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', 'Configure Case Assignments - Business Workflows');
            await assignmentConfigConsolePage.removeColumns(defaultCaseAssignmentColumns);
            await assignmentConfigConsolePage.addColumns(arr1);
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.addFilter('Department', departmentData.orgName, 'text');
            await utilGrid.searchRecord(assignmentData2.assignmentMappingName);
            expect(await utilGrid.isGridRecordPresent(assignmentData2.assignmentMappingName)).toBeTruthy(assignmentData2.assignmentMappingName);
            expect(await utilGrid.isGridRecordPresent(assignmentData1.assignmentMappingName)).toBeTruthy(assignmentData1.assignmentMappingName);
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.addFilter('Business Unit', businessData.orgName, 'text');
            await utilGrid.searchRecord(assignmentData1.assignmentMappingName);
            expect(await utilGrid.isGridRecordPresent(assignmentData1.assignmentMappingName)).toBeTruthy(assignmentData1.assignmentMappingName);
            expect(await utilGrid.isGridRecordPresent(assignmentData2.assignmentMappingName)).toBeTruthy(assignmentData2.assignmentMappingName);
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.addFilter('Label', "MappingLabel" + randomStr, 'text');
            await utilGrid.searchRecord(assignmentData1.assignmentMappingName);
            expect(await assignmentConfigConsolePage.getSelectedGridRecordValue('Label')).toContain("MappingLabel" + randomStr, 'Filter Flowset is missing in column');
            await utilGrid.clearFilter();
            await utilGrid.addFilter("ID", id, "text");
            await utilGrid.searchRecord(assignmentData1.assignmentMappingName);
            expect(await utilGrid.isGridRecordPresent(id)).toBeTruthy(id + ' not present');
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.addFilter('Category Tier 4', "Retention Bonus", 'text');
            await utilGrid.searchRecord(assignmentData1.assignmentMappingName);
            expect(await utilGrid.isGridRecordPresent(assignmentData1.assignmentMappingName)).toBeTruthy(assignmentData1.assignmentMappingName);
            assignmentData1.assignmentMappingName = randomStr + "3DRDMV8968";
            assignmentData1.flowset = flowsetGlobalFieldsData.flowsetName;
            await apiHelper.createCaseAssignmentMapping(assignmentData1);
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.addFilter('Flowset', flowsetGlobalFieldsData.flowsetName, 'text');
            await utilGrid.searchRecord(randomStr + "3DRDMV8968");
            expect(await assignmentConfigConsolePage.getSelectedGridRecordValue('Flowset')).toContain(flowsetGlobalFieldsData.flowsetName, 'Filter Flowset is missing in column');
            await assignmentConfigConsolePage.removeColumns(arr1);
            await assignmentConfigConsolePage.addColumns(defaultCaseAssignmentColumns);
        });
        afterAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteReadAccessOrAssignmentMapping(assignmentData1.assignmentMappingName);
            await apiHelper.deleteReadAccessOrAssignmentMapping(assignmentData2.assignmentMappingName);
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    xdescribe('[DRDMV-8968]:[Assignment Mapping] Categories partial match', () => {
        let randomStr: string = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let businessData = businessDataFile['BusinessUnitDataPhylum1'];
        let departmentData = departmentDataFile['DepartmentDataPhylum1'];
        let suppGrpData = supportGrpDataFile['SuppGrpDataPhylum1'];
        it('[DRDMV-8968]:[Assignment Mapping] Categories partial match', async () => {
            await navigationPage.signOut();
            await loginPage.login(userId1, 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', 'Configure Case Assignments - Business Workflows');
            await assignmentConfigConsolePage.deleteDefaultAssignmentConfig();
            await assignmentConfigConsolePage.clickOnCreateAssignmentConfiguration();
            await assignmentConfigCreatePage.setAssignmentMapName("1DRDMV8968 " + randomStr);
            await assignmentConfigCreatePage.setCompany("Phylum");
            await assignmentConfigCreatePage.setPriority("Critical");
            await assignmentConfigCreatePage.setCategoryTier1("Employee Relations");
            await assignmentConfigCreatePage.setSupportCompany("Phylum");
            await assignmentConfigCreatePage.setBusinessUnit(businessData.orgName);
            await assignmentConfigCreatePage.setDepartement(departmentData.orgName);
            await assignmentConfigCreatePage.setSupportGroup(suppGrpData.orgName);
            await assignmentConfigCreatePage.setAssignee("phylumfn4 phylumln4");
            await assignmentConfigCreatePage.clickonSaveButton();
            await utilCommon.closePopUpMessage();
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("Anna");
            await createCasePage.setSummary("DRDMV-8968 Case Summary1");
            await createCasePage.setPriority("Critical");
            await createCasePage.selectCategoryTier1("Employee Relations");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getAssignedGroupText()).toBe(suppGrpData.orgName);
            expect(await viewCasePo.getAssigneeText()).toBe("phylumfn4 phylumln4");
        });
        it('[DRDMV-8968]:[Assignment Mapping] Categories partial match', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', 'Configure Case Assignments - Business Workflows');
            await assignmentConfigConsolePage.searchAndClickOnAssignmentConfig("1DRDMV8968 " + randomStr);
            await editAssignmentsConfigPo.setCategoryTier2("Compensation");
            await editAssignmentsConfigPo.clickonSaveButton();
            await utilCommon.closePopUpMessage();
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("Anna");
            await createCasePage.setSummary("DRDMV-8968 Case Summary2");
            await createCasePage.setPriority("Critical");
            await createCasePage.selectCategoryTier1("Employee Relations");
            await createCasePage.selectCategoryTier2("Compensation");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getAssignedGroupText()).toBe(suppGrpData.orgName);
            expect(await viewCasePo.getAssigneeText()).toBe("phylumfn4 phylumln4");
        });
        it('[DRDMV-8968]:[Assignment Mapping] Categories partial match', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', 'Configure Case Assignments - Business Workflows');
            await assignmentConfigConsolePage.searchAndClickOnAssignmentConfig("1DRDMV8968 " + randomStr);
            await editAssignmentsConfigPo.setCategoryTier3("Bonus");
            await editAssignmentsConfigPo.clickonSaveButton();
            await utilCommon.closePopUpMessage();
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("Anna");
            await createCasePage.setSummary("DRDMV-8968 Case Summary3");
            await createCasePage.setPriority("Critical");
            await createCasePage.selectCategoryTier1("Employee Relations");
            await createCasePage.selectCategoryTier2("Compensation");
            await createCasePage.selectCategoryTier3("Bonus");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getAssignedGroupText()).toBe(suppGrpData.orgName);
            expect(await viewCasePo.getAssigneeText()).toBe("phylumfn4 phylumln4");
        });
        afterAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteReadAccessOrAssignmentMapping("1DRDMV8968 " + randomStr);
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    xdescribe('[DRDMV-9103]:[Assignment Mapping] Partially matching Assignment mapping with Flowset', () => {
        let assignmentData, caseTemplateData, randomStr: string = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let businessData = businessDataFile['BusinessUnitDataPhylum1'];
        let departmentData = departmentDataFile['DepartmentDataPhylum1'];
        let suppGrpData = supportGrpDataFile['SuppGrpDataPhylum1'];
        beforeAll(async () => {
            await createNewUsers();
            caseTemplateData = {
                "templateName": `${randomStr}Casetemplate`,
                "templateStatus": "Draft",
                "templateSummary": `${randomStr}Summary`,
                "caseStatus": "New",
                "casePriority": "Low",
                "categoryTier1": "Employee Relations",
                "categoryTier2": "Compensation",
                "categoryTier3": "Bonus",
                "company": "Phylum",
                "ownerBU": businessData.orgName,
                "ownerGroup": "Phylum Support Group1"
            }
            await apiHelper.apiLogin(userId1, "Password_1234");
            await apiHelper.createCaseTemplate(caseTemplateData);
        });
        it('[DRDMV-9103]:[Assignment Mapping] Partially matching Assignment mapping with Flowset', async () => {
            await navigationPage.signOut();
            await loginPage.login(userId1, 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', 'Configure Case Assignments - Business Workflows');
            await assignmentConfigConsolePage.deleteDefaultAssignmentConfig();
            await assignmentConfigConsolePage.clickOnCreateAssignmentConfiguration();
            await assignmentConfigCreatePage.setAssignmentMapName("1DRDMV8968 " + randomStr);
            await assignmentConfigCreatePage.setCompany("Phylum");
            await assignmentConfigCreatePage.setPriority("Low");
            await assignmentConfigCreatePage.setFlowset(flowsetGlobalFieldsData.flowsetName);
            await assignmentConfigCreatePage.setCategoryTier1("Employee Relations");
            await assignmentConfigCreatePage.setCategoryTier2("Compensation");
            await assignmentConfigCreatePage.setSupportCompany("Phylum");
            await assignmentConfigCreatePage.setBusinessUnit(businessData.orgName);
            await assignmentConfigCreatePage.setDepartement(departmentData.orgName);
            await assignmentConfigCreatePage.setSupportGroup(suppGrpData.orgName);
            await assignmentConfigCreatePage.setAssignee("phylumfn4 phylumln4");
            await assignmentConfigCreatePage.clickonSaveButton();
            await utilCommon.closePopUpMessage();
        });
        it('[DRDMV-9103]:[Assignment Mapping] Partially matching Assignment mapping with Flowset', async () => {
            await navigationPage.signOut();
            await loginPage.login(userId1, 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(caseTemplateData.templateName);
            await viewCaseTemplate.clickOnEditCaseTemplateButton();
            await editCasetemplatePo.changeFlowsetValue(flowsetGlobalFieldsData.flowsetName);
            await editCasetemplatePo.clickSaveCaseTemplate();
            await utilCommon.closePopUpMessage();
            await editCasetemplatePo.clickOnEditCaseTemplateMetadata();
            await editCasetemplatePo.changeTemplateStatusDropdownValue('Active');
            await editCasetemplatePo.changeOwnerCompanyValue('Phylum');
            await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
            await utilCommon.closePopUpMessage();
        });
        it('[DRDMV-9103]:[Assignment Mapping] Partially matching Assignment mapping with Flowset', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Anna');
            await createCasePage.setSummary('Summary');
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateData.templateName);
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getAssignedGroupText()).toBe(suppGrpData.orgName);
            expect(await viewCasePo.getAssigneeText()).toBe("phylumfn4 phylumln4");
        });
        afterAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteReadAccessOrAssignmentMapping("1DRDMV8968 " + randomStr);
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    xdescribe('[DRDMV-1206,DRDMV-1208]:[Assignment Mapping] Applying Assignment Mappings to cases with partial match', () => {
        let assignmentData, caseTemplateData, caseTemplateData1, randomStr: string = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let businessData1, businessData2, businessData3, businessData4, businessData5, businessData6;
        let departmentData1, departmentData2, departmentData3, departmentData4, departmentData5, departmentData6;
        let suppGrpData1, suppGrpData2, suppGrpData3, suppGrpData4, suppGrpData5, suppGrpData6;
        beforeAll(async () => {
            await foundationData2('Phylum', 'BusinessUnitDataPhylum1', 'DepartmentDataPhylum1', 'SuppGrpDataPhylum1', 'PhylumCaseAgent4');
            await foundationData2('Phylum', 'BusinessUnitDataPhylum2', 'DepartmentDataPhylum2', 'SuppGrpDataPhylum2', 'PhylumCaseAgent5');
            await foundationData2('Phylum', 'BusinessUnitDataPhylum3', 'DepartmentDataPhylum3', 'SuppGrpDataPhylum3', 'PhylumCaseAgent6');
            await foundationData2('Phylum', 'BusinessUnitDataPhylum4', 'DepartmentDataPhylum4', 'SuppGrpDataPhylum4', 'PhylumCaseAgent7');
            await foundationData2('Phylum', 'BusinessUnitDataPhylum5', 'DepartmentDataPhylum5', 'SuppGrpDataPhylum5', 'PhylumCaseAgent8');
            await foundationData2('Phylum', 'BusinessUnitDataPhylum6', 'DepartmentDataPhylum6', 'SuppGrpDataPhylum6', 'PhylumCaseAgent9');
            businessData1 = businessDataFile['BusinessUnitDataPhylum1'];
            departmentData1 = departmentDataFile['DepartmentDataPhylum1'];
            suppGrpData1 = supportGrpDataFile['SuppGrpDataPhylum1'];
            businessData2 = businessDataFile['BusinessUnitDataPhylum2'];
            departmentData2 = departmentDataFile['DepartmentDataPhylum2'];
            suppGrpData2 = supportGrpDataFile['SuppGrpDataPhylum2'];
            businessData3 = businessDataFile['BusinessUnitDataPhylum3'];
            departmentData3 = departmentDataFile['DepartmentDataPhylum3'];
            suppGrpData3 = supportGrpDataFile['SuppGrpDataPhylum3'];
            businessData4 = businessDataFile['BusinessUnitDataPhylum4'];
            departmentData4 = departmentDataFile['DepartmentDataPhylum4'];
            suppGrpData4 = supportGrpDataFile['SuppGrpDataPhylum4'];
            businessData5 = businessDataFile['BusinessUnitDataPhylum5'];
            departmentData5 = departmentDataFile['DepartmentDataPhylum5'];
            suppGrpData5 = supportGrpDataFile['SuppGrpDataPhylum5'];
            businessData6 = businessDataFile['BusinessUnitDataPhylum6'];
            departmentData6 = departmentDataFile['DepartmentDataPhylum6'];
            suppGrpData6 = supportGrpDataFile['SuppGrpDataPhylum6'];
            assignmentData = {
                "assignmentMappingName": randomStr + "1DRDMV1206",
                "company": "Phylum",
                "supportCompany": "Phylum",
                "businessUnit": businessData1.orgName,
                "department": departmentData1.orgName,
                "supportGroup": suppGrpData1.orgName,
                "assignee": "idphylum4"
            }
            caseTemplateData = {
                "templateName": `${randomStr}1Casetemplate`,
                "templateStatus": "Draft",
                "templateSummary": `${randomStr}Summary`,
                "caseStatus": "New",
                "casePriority": "Low",
                "categoryTier1": "Facilities",
                "categoryTier2": "Conference Room",
                "categoryTier3": "Furniture",
                "company": "Phylum",
                "ownerBU": "Phylum Support Org1",
                "ownerGroup": "Phylum Support Group1"
            }
            caseTemplateData1 = {
                "templateName": `${randomStr}2Casetemplate`,
                "templateStatus": "Draft",
                "templateSummary": `${randomStr}Summary`,
                "caseStatus": "New",
                "casePriority": "Low",
                "categoryTier1": "Facilities",
                "company": "Phylum",
                "ownerBU": "Phylum Support Org1",
                "ownerGroup": "Phylum Support Group1"
            }
        });
        it('[DRDMV-1206,DRDMV-1208]:[Assignment Mapping] Applying Assignment Mappings to cases with partial match', async () => {
            await apiHelper.apiLogin(userId1, "Password_1234");
            await apiHelper.createCaseAssignmentMapping(assignmentData);
            await apiHelper.createCaseTemplate(caseTemplateData);
            await apiHelper.createCaseTemplate(caseTemplateData1);
        });
        it('[DRDMV-1206,DRDMV-1208]:[Assignment Mapping] Applying Assignment Mappings to cases with partial match', async () => {
            await navigationPage.signOut();
            await loginPage.login(userId1, 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', 'Configure Case Assignments - Business Workflows');
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.addFilter('Category Tier 1', 'Facilities', 'text');
            await assignmentConfigConsolePage.deleteFilteredAssignmentConfig();
            await assignmentConfigConsolePage.deleteDefaultAssignmentConfig();
            await assignmentConfigConsolePage.searchAndClickOnAssignmentConfig(assignmentData.assignmentMappingName);
            await editAssignmentsConfigPo.setDefaultToggleButton(true);
            await editAssignmentsConfigPo.clickonSaveButton();
            await utilCommon.closePopUpMessage();
        });
        it('[DRDMV-1206,DRDMV-1208]:[Assignment Mapping] Applying Assignment Mappings to cases with partial match', async () => {
            assignmentData.assignmentMappingName = randomStr + '4DRDMV1206';
            assignmentData.categoryTier1 = "IT";
            assignmentData.businessUnit = "Phylum Support Org1",
                assignmentData.supportGroup = "Phylum Support Group1";
            await apiHelper.createCaseAssignmentMapping(assignmentData);
            assignmentData.assignmentMappingName = randomStr + '5DRDMV1206';
            assignmentData.categoryTier1 = "Facilities";
            assignmentData.categoryTier2 = "Kitchen";
            assignmentData.businessUnit = "Phylum Support Org1",
                assignmentData.supportGroup = "Phylum Support Group1";
            await apiHelper.createCaseAssignmentMapping(assignmentData);
            assignmentData.assignmentMappingName = randomStr + '6DRDMV1206';
            assignmentData.categoryTier1 = "Facilities";
            assignmentData.businessUnit = businessData2.orgName,
                assignmentData.department = departmentData2.orgName,
                assignmentData.supportGroup = suppGrpData2.orgName,
                assignmentData.priority = "High";
            assignmentData.assignee = "idphylum5";
            await apiHelper.createCaseAssignmentMapping(assignmentData);
        });
        it('[DRDMV-1206,DRDMV-1208]:[Assignment Mapping] Applying Assignment Mappings to cases with partial match', async () => {
            assignmentData.assignmentMappingName = randomStr + '7DRDMV1206';
            assignmentData.categoryTier1 = "Facilities";
            assignmentData.categoryTier2 = "Conference Room";
            assignmentData.categoryTier3 = "Furniture";
            assignmentData.businessUnit = businessData3.orgName,
                assignmentData.department = departmentData3.orgName,
                assignmentData.supportGroup = suppGrpData3.orgName,
                assignmentData.assignee = "idphylum6";
            await apiHelper.createCaseAssignmentMapping(assignmentData);
            assignmentData.assignmentMappingName = randomStr + '8DRDMV1206';
            assignmentData.categoryTier1 = "Facilities";
            assignmentData.categoryTier2 = "Conference Room";
            assignmentData.categoryTier3 = "Furniture";
            assignmentData.businessUnit = businessData4.orgName,
                assignmentData.department = departmentData4.orgName,
                assignmentData.supportGroup = suppGrpData4.orgName,
                assignmentData.assignee = "idphylum7";
            await apiHelper.createCaseAssignmentMapping(assignmentData);
            assignmentData.assignmentMappingName = randomStr + '9DRDMV1206';
        });
        it('[DRDMV-1206,DRDMV-1208]:[Assignment Mapping] Applying Assignment Mappings to cases with partial match', async () => {
            assignmentData.categoryTier1 = "Facilities";
            assignmentData.categoryTier2 = "Conference Room";
            assignmentData.categoryTier3 = "Furniture";
            assignmentData.businessUnit = businessData5.orgName,
                assignmentData.department = departmentData5.orgName,
                assignmentData.supportGroup = suppGrpData5.orgName,
                assignmentData.assignee = "idphylum8";
            assignmentData.priority = "Low";
            await apiHelper.createCaseAssignmentMapping(assignmentData);
            assignmentData.assignmentMappingName = randomStr + '2DRDMV1206';
            assignmentData.categoryTier1 = "Facilities";
            assignmentData.categoryTier2 = "Conference Room";
            assignmentData.categoryTier3 = "Furniture";
            assignmentData.businessUnit = businessData6.orgName,
                assignmentData.department = departmentData6.orgName,
                assignmentData.supportGroup = suppGrpData6.orgName,
                assignmentData.assignee = "idphylum9";
            assignmentData.priority = "Low";
            assignmentData.flowset = flowsetGlobalFieldsData.flowsetName;
            await apiHelper.createCaseAssignmentMapping(assignmentData);
            assignmentData.assignmentMappingName = randomStr + '3DRDMV1206';
            assignmentData.categoryTier1 = "Facilities";
            assignmentData.categoryTier2 = "Conference Room";
            assignmentData.flowset = flowsetGlobalFieldsData.flowsetName;
            assignmentData.businessUnit = businessData1.orgName,
                assignmentData.department = departmentData1.orgName,
                assignmentData.supportGroup = suppGrpData1.orgName,
                assignmentData.assignee = "idphylum4";
            await apiHelper.createCaseAssignmentMapping(assignmentData);
        });
        it('[DRDMV-1206,DRDMV-1208]:[Assignment Mapping] Applying Assignment Mappings to cases with partial match', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(caseTemplateData.templateName);
            await viewCaseTemplate.clickOnEditCaseTemplateButton();
            await editCasetemplatePo.changeFlowsetValue(flowsetGlobalFieldsData.flowsetName);
            await editCasetemplatePo.clickSaveCaseTemplate();
            await utilCommon.closePopUpMessage();
            await editCasetemplatePo.clickOnEditCaseTemplateMetadata();
            await editCasetemplatePo.changeTemplateStatusDropdownValue('Active');
            await editCasetemplatePo.changeOwnerCompanyValue('Phylum');
            await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
            await utilCommon.closePopUpMessage();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(caseTemplateData1.templateName);
            await viewCaseTemplate.clickOnEditCaseTemplateButton();
            await editCasetemplatePo.changeFlowsetValue(flowsetGlobalFieldsData.flowsetName);
            await editCasetemplatePo.clickSaveCaseTemplate();
            await utilCommon.closePopUpMessage();
            await editCasetemplatePo.clickOnEditCaseTemplateMetadata();
            await editCasetemplatePo.changeTemplateStatusDropdownValue('Active');
            await editCasetemplatePo.changeOwnerCompanyValue('Phylum');
            await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
            await utilCommon.closePopUpMessage();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', 'Configure Case Assignments - Business Workflows');
            await assignmentConfigConsolePage.searchAndClickOnAssignmentConfig(assignmentData.assignmentMappingName);
            await editAssignmentsConfigPo.setDefaultToggleButton(true);
            await editAssignmentsConfigPo.clickonSaveButton();
            expect(await utilCommon.isPopUpMessagePresent('ERROR (10000): Only one default record is allowed for a company. Please change the default flag and save the record.')).toBeTruthy('Message Not Present');
            await editAssignmentsConfigPo.clickOnCancelButton();
            await utilCommon.clickOnWarningOk();
        });
        it('[DRDMV-1206,DRDMV-1208]:[Assignment Mapping] Applying Assignment Mappings to cases with partial match', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Anna');
            await createCasePage.setSummary('Summary1');
            await createCasePage.setPriority("Low");
            await createCasePage.selectCategoryTier1("Facilities");
            await createCasePage.selectCategoryTier2("Conference Room");
            await createCasePage.selectCategoryTier3("Furniture");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getAssignedGroupText()).toBe(suppGrpData5.orgName);
            expect(await viewCasePo.getAssigneeText()).toBe("phylumfn8 phylumln8");
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Anna');
            await createCasePage.setSummary('Summary2');
            await createCasePage.selectCategoryTier1("Facilities");
            await createCasePage.selectCategoryTier2("Conference Room");
            await createCasePage.selectCategoryTier3("Furniture");
            await createCasePage.setPriority("High");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getAssignedGroupText()).toBe(suppGrpData3.orgName);
            expect(await viewCasePo.getAssigneeText()).toBe("phylumfn6 phylumln6");
        });
        it('[DRDMV-1206,DRDMV-1208]:[Assignment Mapping] Applying Assignment Mappings to cases with partial match', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Anna');
            await createCasePage.setSummary('Summary3');
            await createCasePage.selectCategoryTier1("Facilities");
            await createCasePage.selectCategoryTier2("Conference Room");
            await createCasePage.selectCategoryTier3("Phone");
            await createCasePage.setPriority("Low");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getAssignedGroupText()).toBe(suppGrpData1.orgName);
            expect(await viewCasePo.getAssigneeText()).toBe("phylumfn4 phylumln4");
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Anna');
            await createCasePage.setSummary('Summary4');
            await createCasePage.setPriority("Low");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getAssignedGroupText()).toBe(suppGrpData1.orgName);
            expect(await viewCasePo.getAssigneeText()).toBe("phylumfn4 phylumln4");
        });
        it('[DRDMV-1206,DRDMV-1208]:[Assignment Mapping] Applying Assignment Mappings to cases with partial match', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Anna');
            await createCasePage.setSummary('Summary5');
            await createCasePage.setPriority("Low");
            await createCasePage.selectCategoryTier1("Employee Relations");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getAssignedGroupText()).toBe(suppGrpData1.orgName);
            expect(await viewCasePo.getAssigneeText()).toBe("phylumfn4 phylumln4");
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Anna');
            await createCasePage.setSummary('Summary6');
            await createCasePage.setPriority("Low");
            await createCasePage.selectCategoryTier1("Facilities");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getAssignedGroupText()).toBe(suppGrpData1.orgName);
            expect(await viewCasePo.getAssigneeText()).toBe("phylumfn4 phylumln4");
        });
        it('[DRDMV-1206,DRDMV-1208]:[Assignment Mapping] Applying Assignment Mappings to cases with partial match', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Anna');
            await createCasePage.setSummary('Summary7');
            await createCasePage.selectCategoryTier1("Facilities");
            await createCasePage.selectCategoryTier2("Kitchen");
            await createCasePage.setPriority("Medium");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getAssignedGroupText()).toBe(suppGrpData1.orgName);
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Anna');
            await createCasePage.setSummary('Summary8');
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateData.templateName);
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getAssignedGroupText()).toBe(suppGrpData6.orgName);
            expect(await viewCasePo.getAssigneeText()).toBe("phylumfn9 phylumln9");
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Anna');
            await createCasePage.setSummary('Summary9');
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateData1.templateName);
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getAssignedGroupText()).toBe(suppGrpData1.orgName);
            expect(await viewCasePo.getAssigneeText()).toBe("phylumfn4 phylumln4");
        });
        it('[DRDMV-1206,DRDMV-1208]:[Assignment Mapping] Applying Assignment Mappings to cases with partial match', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Anna');
            await createCasePage.setSummary('Summary10');
            await createCasePage.setPriority("High");
            await createCasePage.selectCategoryTier1("Facilities");
            await createCasePage.selectCategoryTier2("Kitchen");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getAssignedGroupText()).toBe(suppGrpData2.orgName);
            expect(await viewCasePo.getAssigneeText()).toBe("phylumfn5 phylumln5");
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Anna');
            await createCasePage.setSummary('Summary11');
            await createCasePage.setPriority("Low");
            await createCasePage.selectCategoryTier1("Facilities");
            await createCasePage.selectCategoryTier2("Mechanical & Electrical");
            await createCasePage.selectCategoryTier3("Lights");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getAssignedGroupText()).toBe(suppGrpData1.orgName);
            expect(await viewCasePo.getAssigneeText()).toBe("phylumfn4 phylumln4");
        });
        afterAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteReadAccessOrAssignmentMapping(randomStr + '1DRDMV1206');
            await apiHelper.deleteReadAccessOrAssignmentMapping(randomStr + '2DRDMV1206');
            await apiHelper.deleteReadAccessOrAssignmentMapping(randomStr + '3DRDMV1206');
            await apiHelper.deleteReadAccessOrAssignmentMapping(randomStr + '4DRDMV1206');
            await apiHelper.deleteReadAccessOrAssignmentMapping(randomStr + '5DRDMV1206');
            await apiHelper.deleteReadAccessOrAssignmentMapping(randomStr + '6DRDMV1206');
            await apiHelper.deleteReadAccessOrAssignmentMapping(randomStr + '7DRDMV1206');
            await apiHelper.deleteReadAccessOrAssignmentMapping(randomStr + '8DRDMV1206');
            await apiHelper.deleteReadAccessOrAssignmentMapping(randomStr + '9DRDMV1206');
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });
});
