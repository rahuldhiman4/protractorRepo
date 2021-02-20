import { cloneDeep } from 'lodash';
import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import { flowsetGlobalFields } from '../../data/ui/flowset/flowset.ui';
import { SAMPLE_MENU_ITEM } from '../../data/ui/ticketing/menu.item.ui';
import caseConsolePage from "../../pageobject/case/case-console.po";
import previewCasePo from '../../pageobject/case/case-preview.po';
import createCasePage from "../../pageobject/case/create-case.po";
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import viewCasePo from "../../pageobject/case/view-case.po";
import accessTabPo from '../../pageobject/common/access-tab.po';
import changeAssignmentPage from '../../pageobject/common/change-assignment.po';
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
import { BWF_BASE_URL, BWF_PAGE_TITLES } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

describe("Create Case Assignment Mapping", () => {
    const businessDataFile = require('../../data/ui/foundation/businessUnit.ui.json');
    const departmentDataFile = require('../../data/ui/foundation/department.ui.json');
    const supportGrpDataFile = require('../../data/ui/foundation/supportGroup.ui.json');
    const personDataFile = require('../../data/ui/foundation/person.ui.json');
    const userId1 = "idphylum4@petramco.com";
    let flowsetGlobalFieldsData = undefined;
    beforeAll(async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await browser.get(BWF_BASE_URL);
        await loginPage.login("qkatawazi");
        //await foundationData("Petramco");
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
        businessData.relatedOrgId = company;
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
        businessData.relatedOrgId = company;
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
        await apiHelper.apiLogin('tadmin');
        let personData1 = personDataFile['PhylumCaseAgent1'];
        await apiHelper.createNewUser(personData1);
        await apiHelper.associatePersonToSupportGroup(personData1.userId, 'Phylum Support Group1');
        await apiHelper.associatePersonToCompany(personData1.userId, 'Phylum');
    }

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //radhiman
    it('[4491]: Verify Case agent can change the Site field once it is populated according to requesters primary location on create case view', async () => {
        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester('qtao');
        await createCasePage.selectSite('Berlin');
        await createCasePage.setSummary('4491 summary');
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        expect(await viewCasePo.getCaseSite()).toBe('Berlin');
    });

    //radhiman
    it('[6321]: Case Workspace table columns', async () => {
        let allCaseColumns: string[] = ["Assigned Group", "Assignee", "Assignee Login Name", "Case ID", "Case Site", "Category Tier 1", "Category Tier 2", "Category Tier 3", "Company", "Created Date", "ID", "Label", "Modified By", "Modified Date", "Priority", "Region", "Request ID", "Requester", "SLM Status", "Source", "Status", "Status Value", "Summary", "Target Date"];
        let defaultCaseColumns: string[] = ["Case ID", "Request ID", "Priority", "Status", "Summary", "Assigned Group", "Assignee", "Requester", "Modified Date", "SLM Status"];
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester('apavlik');
        await createCasePage.setSummary('6321 summary');
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        await navigationPage.gotoCaseConsole();
        await caseConsolePage.removeColumns(allCaseColumns);
        await caseConsolePage.addColumns(defaultCaseColumns);
        await caseConsolePage.setCaseSearchBoxValue('6321 summary');
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
    it('[4451]: Assignment mapping table columns', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', BWF_PAGE_TITLES.CASE_MANAGEMENT.ASSIGNMENTS);
        await assignmentConfigConsolePage.clearFilter();
        let defaultCaseAssignmentColumns: string[] = ["Assignment Name", "Company", "Category Tier 1", "Category Tier 2", "Support Company", "Support Group", "Default Mapping"];
        expect(await assignmentConfigConsolePage.areCaseAssignmentGridColumnMatches(defaultCaseAssignmentColumns)).toBeTruthy("Default columns are not matching");
        let caseAssignmentRemainingColumns: string[] = ["Label", "Case Priority", "Category Tier 3", "Category Tier 4", "Flowset", "ID", "Modified By", "Region", "Site", "Site Group", "Support Organization"];
        await assignmentConfigConsolePage.addColumns(caseAssignmentRemainingColumns);
        let allColumns: string[] = ["Assignment Name", "Company", "Category Tier 1", "Category Tier 2", "Support Company", "Support Group", "Default Mapping", "Label", "Case Priority", "Category Tier 3", "Category Tier 4", "Flowset", "ID", "Modified By", "Region", "Site", "Site Group", "Support Organization"];
        expect(await assignmentConfigConsolePage.areCaseAssignmentGridColumnMatches(allColumns)).toBeTruthy("Default And new columns added are not matching");
        await assignmentConfigConsolePage.removeColumns(caseAssignmentRemainingColumns);
        expect(await assignmentConfigConsolePage.areCaseAssignmentGridColumnMatches(defaultCaseAssignmentColumns)).toBeTruthy("Default And remaining new columns are not matching");
    });

    //radhiman
    describe('[6293]: [Assignment Mapping] Add/Edit Assignment Mapping views (UI verification)', async () => {
        let assignmentFields: string[] = ["Assignment Mapping Name", "Line of Business", "Company", "Flowset", "Category Tier 1", "Category Tier 2", "Category Tier 3", "Category Tier 4", "Priority", "Label", "Region", "Site", "Use as Default", "Support Company", "Business Unit", "Department", "Support Group", "Assignee"];
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let assignmentMappingName = "DRDMV1242 " + randomStr;
        it('[6293]: [Assignment Mapping] Add/Edit Assignment Mapping views (UI verification)', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', BWF_PAGE_TITLES.CASE_MANAGEMENT.ASSIGNMENTS);
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
        it('[6293]: create same name record in same LOB', async () => {
            //create same name record in same LOB
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', BWF_PAGE_TITLES.CASE_MANAGEMENT.ASSIGNMENTS);
            await utilityGrid.selectLineOfBusiness('Human Resource');
            await assignmentConfigConsolePage.clickOnCreateAssignmentConfiguration();
            await assignmentConfigCreatePage.setAssignmentMapName(assignmentMappingName);
            await assignmentConfigCreatePage.setCompany("Petramco");
            await assignmentConfigCreatePage.setSupportCompany("Petramco");
            await assignmentConfigCreatePage.setBusinessUnit("Australia Support");
            await assignmentConfigCreatePage.setSupportGroup("AU Support 1");
            await assignmentConfigCreatePage.clickonSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('The Assignment Mapping Name already exists. Please select a different name.')).toBeTruthy("Error message absent");
            await assignmentConfigCreatePage.clickOnCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });
        it('[6293]: create same name record in different LOB', async () => {
            //create same name record in different LOB
            await utilityGrid.selectLineOfBusiness('Facilities');
            await assignmentConfigConsolePage.clickOnCreateAssignmentConfiguration();
            await assignmentConfigCreatePage.setAssignmentMapName(assignmentMappingName);
            await assignmentConfigCreatePage.setCompany("Petramco");
            // verify categ1, BU and SG as per LOB
            await utilityCommon.isAllDropDownValuesMatches(assignmentConfigCreatePage.selectors.catTier1DrpDwn, ['Applications', 'Facilities', 'Fixed Assets', 'Phones', 'Projectors', 'Purchasing Card']);
            await assignmentConfigCreatePage.setSupportCompany("Petramco");
            await utilityCommon.isAllDropDownValuesMatches(assignmentConfigCreatePage.selectors.businessUnitDrpDwn, ['Facilities', 'Facilities Support']);
            await assignmentConfigCreatePage.setSupportCompany("Petramco");
            await assignmentConfigCreatePage.setBusinessUnit('Facilities Support');
            await utilityCommon.isAllDropDownValuesMatches(assignmentConfigCreatePage.selectors.supportGrpDrpDwn, ['Facilities', 'Pantry Service']);
            await assignmentConfigCreatePage.setBusinessUnit('Facilities Support');
            await assignmentConfigCreatePage.setSupportGroup('Facilities');
            // verify LOB is there
            expect(await assignmentConfigCreatePage.getLobValue()).toBe("Facilities");
            await assignmentConfigCreatePage.clickonSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy("Success message absent");
            // open the record and verify LOB is on edit screen
            await assignmentConfigConsolePage.searchAndClickOnAssignmentConfig(assignmentMappingName);
            expect(await editAssignmentsConfigPo.getLobValue()).toBe("Facilities");
            await editAssignmentsConfigPo.clickOnCancelButton();
            await utilityGrid.selectLineOfBusiness('Human Resource');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteReadAccessOrAssignmentMapping(assignmentMappingName);
        });
    });

    //radhiman
    it('[5022]: [Assignment Mapping] Verify Global Company on Assignment Grid', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let assignmentMappingName = "5022 " + randomStr;
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', BWF_PAGE_TITLES.CASE_MANAGEMENT.ASSIGNMENTS);
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
    it('[5028]: [Assignment Mapping] Verify Global Company on Assignment Grid', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let assignmentMappingName = "5028 " + randomStr;
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', BWF_PAGE_TITLES.CASE_MANAGEMENT.ASSIGNMENTS);
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
        await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        //expect(await utilityCommon.isPopUpMessagePresent('Record(s) deleted successfully.').tobeTruthy();
    });

    //radhiman
    describe('[5029]: [Assignment Mapping] Global Assignment Mapping', async () => {
        let assignmentMappingName = "5029 " + [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        it('[5029]: Global Assignment Mapping', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', BWF_PAGE_TITLES.CASE_MANAGEMENT.ASSIGNMENTS);
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
        it('[5029]: [Assignment Mapping] Global Assignment Mapping', async () => {
            await assignmentConfigConsolePage.searchAssignmentConfig(assignmentMappingName);
            expect(await assignmentConfigConsolePage.getValueOnAssignmentConfigGrid("Assignment Name")).toContain(assignmentMappingName);
            await navigationPage.signOut();
            await loginPage.login('gderuno');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', BWF_PAGE_TITLES.CASE_MANAGEMENT.ASSIGNMENTS);
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
    describe('[5016]: [Assignment Mapping] Verify precedence will be given to company specific assignment mapping if we have global approval mapping with Same name', async () => {
        let globalAssignmentMappingName = "5016 " + [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let companyAssignmentMappingName = "5016 " + [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        it('[5016]: Precedence will be given to company specific assignment mapping', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', BWF_PAGE_TITLES.CASE_MANAGEMENT.ASSIGNMENTS);
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
        it('[5016]: [Assignment Mapping] Verify precedence will be given to company specific assignment mapping if we have global approval mapping with Same name', async () => {
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
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary("5016 Case Summary");
            await createCasePage.setPriority("Low");
            await createCasePage.selectCategoryTier1("Employee Relations");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getAssignedGroupValue()).toBe("AU Support 2");
        });
    });

    //radhiman
    describe('[5017]: [Assignment Mapping] Verify Global assignment mapping applied to case if assignment qualification matches', async () => {
        let assignmentMappingName = "5017 " + [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        it('[5017]: Global assignment mapping applied to case if assignment qualification matches', async () => {
            await navigationPage.signOut();
            await loginPage.login('gwixillian');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', BWF_PAGE_TITLES.CASE_MANAGEMENT.ASSIGNMENTS);
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
        it('[5017]: [Assignment Mapping] Verify Global assignment mapping applied to case if assignment qualification matches', async () => {
            await assignmentConfigConsolePage.searchAssignmentConfig(assignmentMappingName);
            expect(await assignmentConfigConsolePage.getValueOnAssignmentConfigGrid("Assignment Name")).toContain(assignmentMappingName);
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("gderuno");
            await createCasePage.setSummary("5017 Case Summary");
            await createCasePage.setPriority("Medium");
            await createCasePage.selectCategoryTier1("Employee Relations");
            await createCasePage.selectCategoryTier2("Compensation");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getAssignedGroupValue()).toBe("Psilon Support Group2");
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //radhiman
    describe('[6319]: [Assignment Mapping] Configuring an Assignment Mapping', async () => {
        let templateData, randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let globalAssignmentMappingName = "Global6319_CaseAssignmentMapping_" + randomStr;
        let companyAssignmentMappingName = "Petramco6319_CaseAssignmentMapping_" + randomStr;
        let facilitiesAssignmentMappingName = "Facilities6319_CaseAssignmentMapping_" + randomStr;

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
            //await createNewUsers();
            await apiHelper.createCaseTemplate(templateData);
        });

        it('[6319]: [Assignment Mapping] Configuring an Assignment Mapping for Human Resource Line of Business', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', BWF_PAGE_TITLES.CASE_MANAGEMENT.ASSIGNMENTS);
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.clickOnCreateAssignmentConfiguration();
            await assignmentConfigCreatePage.setAssignmentMapName(globalAssignmentMappingName);
            await assignmentConfigCreatePage.setCompany("- Global -");
            await assignmentConfigCreatePage.setCategoryTier1("Applications");
            await assignmentConfigCreatePage.setSupportCompany("Petramco");
            await assignmentConfigCreatePage.setBusinessUnit('Australia Support');
            await assignmentConfigCreatePage.setSupportGroup("AU Support 2");
            await assignmentConfigCreatePage.clickonSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');

            await assignmentConfigConsolePage.clickOnCreateAssignmentConfiguration();
            await assignmentConfigCreatePage.setAssignmentMapName(companyAssignmentMappingName);
            await assignmentConfigCreatePage.setCompany("Petramco");
            await assignmentConfigCreatePage.setCategoryTier1("Applications");
            await assignmentConfigCreatePage.setSupportCompany("Petramco");
            await assignmentConfigCreatePage.setBusinessUnit('Australia Support');
            await assignmentConfigCreatePage.setSupportGroup("AU Support 3");
            await assignmentConfigCreatePage.clickonSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
        });

        it('[6319]: Verify if case assignment mapping is accessible to same LOB Case Manager', async () => {
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', BWF_PAGE_TITLES.CASE_MANAGEMENT.ASSIGNMENTS);
            expect(await utilityGrid.isGridRecordPresent(globalAssignmentMappingName)).toBeTruthy('Case Assignment Mapping are not displayed to same LOB Case manager.');
            expect(await utilityGrid.isGridRecordPresent(companyAssignmentMappingName)).toBeTruthy('Case Assignment Mapping are not displayed to same LOB Case manager.');
        });

        it('[6319]: Verify if case assignment mapping is accessible to different LOB Case BA', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', BWF_PAGE_TITLES.CASE_MANAGEMENT.ASSIGNMENTS);
            expect(await utilityGrid.isGridRecordPresent(globalAssignmentMappingName)).toBeFalsy('Case Assignment Mapping are displayed to different LOB Case BA.');
            expect(await utilityGrid.isGridRecordPresent(companyAssignmentMappingName)).toBeFalsy('Case Assignment Mapping are displayed to different LOB Case BA.');
            await assignmentConfigConsolePage.clickOnCreateAssignmentConfiguration();
            await assignmentConfigCreatePage.setAssignmentMapName(facilitiesAssignmentMappingName);
            await assignmentConfigCreatePage.setCompany("Petramco");
            await assignmentConfigCreatePage.setCategoryTier1("Applications");
            await assignmentConfigCreatePage.setSupportCompany("Petramco");
            await assignmentConfigCreatePage.setBusinessUnit('Facilities Support');
            await assignmentConfigCreatePage.setSupportGroup("Facilities");
            await assignmentConfigCreatePage.clickonSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
        });

        it('[6319]: Verify if case assignment mapping is accessible to different LOB Case Manager', async () => {
            await navigationPage.signOut();
            await loginPage.login('frieda');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', BWF_PAGE_TITLES.CASE_MANAGEMENT.ASSIGNMENTS);
            expect(await utilityGrid.isGridRecordPresent(globalAssignmentMappingName)).toBeFalsy('Case Assignment Mapping are displayed to different LOB Case Manager.');
            expect(await utilityGrid.isGridRecordPresent(companyAssignmentMappingName)).toBeFalsy('Case Assignment Mapping are displayed to different LOB Case Manager.');
            expect(await utilityGrid.isGridRecordPresent(facilitiesAssignmentMappingName)).toBeTruthy('Case Assignment Mapping are displayed to same LOB Case Manager.');
        });

        it('[6319]: Verify if case assignment mapping is accessible to Case BA belonging to different company with same LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('gwixillian');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', BWF_PAGE_TITLES.CASE_MANAGEMENT.ASSIGNMENTS);
            expect(await utilityGrid.isGridRecordPresent(globalAssignmentMappingName)).toBeTruthy('Case Assignment Mapping are not displayed to same LOB Case BA.');
            expect(await utilityGrid.isGridRecordPresent(companyAssignmentMappingName)).toBeTruthy('Case Assignment Mapping are not displayed to same LOB Case BA.');
        });

        it('[6319]: Verify if case assignment mapping is accessible to Case Manager user having access to multiple LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('qyuan');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', BWF_PAGE_TITLES.CASE_MANAGEMENT.ASSIGNMENTS);
            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(globalAssignmentMappingName)).toBeTruthy('Case Assignment Mapping are not displayed to multiple LOB Case manager.');
            expect(await utilityGrid.isGridRecordPresent(companyAssignmentMappingName)).toBeTruthy('Case Assignment Mapping are not displayed to multiple LOB Case manager.');
            expect(await utilityGrid.isGridRecordPresent(facilitiesAssignmentMappingName)).toBeFalsy('Case Assignment Mapping are displayed to multiple LOB Case Manager.');
            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await utilityGrid.isGridRecordPresent(globalAssignmentMappingName)).toBeFalsy('Case Assignment Mapping are displayed to multiple LOB Case Manager.');
            expect(await utilityGrid.isGridRecordPresent(companyAssignmentMappingName)).toBeFalsy('Case Assignment Mapping are displayed to multiple LOB Case Manager.');
            expect(await utilityGrid.isGridRecordPresent(facilitiesAssignmentMappingName)).toBeTruthy('Case Assignment Mapping are not displayed to multiple LOB Case Manager.');
        });

        it('[6319]: Verify if case assignment mapping is accessible to Case BA user having access to multiple LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', BWF_PAGE_TITLES.CASE_MANAGEMENT.ASSIGNMENTS);
            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await utilityGrid.isGridRecordPresent(globalAssignmentMappingName)).toBeFalsy('Case Assignment Mapping are displayed to multiple LOB Case BA.');
            expect(await utilityGrid.isGridRecordPresent(companyAssignmentMappingName)).toBeFalsy('Case Assignment Mapping are displayed to multiple LOB Case BA.');
            expect(await utilityGrid.isGridRecordPresent(facilitiesAssignmentMappingName)).toBeTruthy('Case Assignment Mapping are not displayed to multiple LOB Case BA.');

            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(globalAssignmentMappingName)).toBeTruthy('Case Assignment Mapping are not displayed to multiple LOB Case BA.');
            expect(await utilityGrid.isGridRecordPresent(companyAssignmentMappingName)).toBeTruthy('Case Assignment Mapping are not displayed to multiple LOB Case BA.');
            expect(await utilityGrid.isGridRecordPresent(facilitiesAssignmentMappingName)).toBeFalsy('Case Assignment Mapping are displayed to multiple LOB Case BA.');
            await assignmentConfigConsolePage.searchAndClickOnAssignmentConfig(companyAssignmentMappingName);
            await editAssignmentsConfigPo.setAssignee('RA3 Liu');
            await editAssignmentsConfigPo.clickonSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
        });

        it('[6319]: Verify if case assignment mapping is applied to the case created', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary("6319 Case Summary");
            await createCasePage.selectCategoryTier1("Applications");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePo.clickOnTab('Case Access');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('James Barnes', 'Write')).toBeTruthy('FailuerMsg1: Agent Name is missing');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('AU Support 3', 'Write')).toBeTruthy('Support Group does not have write access');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteReadAccessOrAssignmentMapping(companyAssignmentMappingName);
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary("6319 Case Summary");
            await createCasePage.selectCategoryTier1("Applications");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePo.clickOnTab('Case Access');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('Workforce Administration', 'Write')).toBeTruthy('Support Group does not have write access');
        });

        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteReadAccessOrAssignmentMapping(globalAssignmentMappingName);
            await apiHelper.deleteReadAccessOrAssignmentMapping(facilitiesAssignmentMappingName);
        });


    });

    // failing because of adapt dropdown space issue
    describe('[5047,5046,5045,5044,5027]: Verify Company and Support Group selection hierarchy.', async () => {
        let randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let businessUnitUSSupport = 'United States Support';
        let suppGrpUSSupport1 = 'US Support 1';
        let assigneeQfeng = 'Qiao Feng';
        let summary = 'Adhoc task ' + randomStr;

        it('[5047,5046,5045,5044,5027]: Case Company and Support Group selection hierarchy', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary("5047 Case Summary");
            await createCasePage.setPriority("Medium");
            await changeAssignmentPage.setDropDownValue('Company', 'Petramco');
            await changeAssignmentPage.setDropDownValue('SupportOrg', businessUnitUSSupport);
            await changeAssignmentPage.setDropDownValue('AssignedGroup', suppGrpUSSupport1);
            await changeAssignmentPage.setDropDownValue('Assignee', assigneeQfeng);
            await createCasePage.clickSaveCaseButton();
            await utilityCommon.closePopUpMessage();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getAssignedGroupValue()).toBe(suppGrpUSSupport1, "Support Group Not Populated");
            expect(await viewCasePo.getAssigneeText()).toBe(assigneeQfeng, "assignee is not available");
            expect(await viewCasePo.getBusinessUnitText()).toBe(businessUnitUSSupport, "Buisness Unit is not available");
            expect(await viewCasePo.getAssignedCompanyValue()).toBe("Petramco", "Company is not available");
        });
        it('[5047,5046,5045,5044,5027]: Task Company and Support Group selection hierarchy', async () => {
            await viewCasePo.clickAddTaskButton();
            await manageTaskPo.clickAddAdhocTaskButton();
            await adhoctaskTemplate.setSummary(summary);
            await adhoctaskTemplate.setDescription("Description");
            await adhoctaskTemplate.clickSaveAdhoctask();
            await utilityCommon.closePopUpMessage();
            await manageTaskPo.clickTaskLink(summary);
            await viewTask.clickOnEditTask();
            await editTaskPo.updateTaskSummary(summary + "new");
            await changeAssignmentPage.setDropDownValue('SupportOrg', businessUnitUSSupport);
            await changeAssignmentPage.setDropDownValue('AssignedGroup', suppGrpUSSupport1);
            await changeAssignmentPage.setDropDownValue('Assignee', assigneeQfeng);
            await editTaskPo.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
            expect(await changeAssignmentPage.getAssignedGroupText()).toBe(suppGrpUSSupport1, "Support Group Not Populated");
            expect(await changeAssignmentPage.getAssigneeValue()).toContain(assigneeQfeng, "assignee is not available");
            expect(await changeAssignmentPage.getSupportOrgText()).toBe(businessUnitUSSupport, "Buisness Unit is not available");
            expect(await changeAssignmentPage.getAssignedCompanyText()).toBe("Petramco", "Company is not available");
        });
        it('[5047,5046,5045,5044,5027]: Case Template Company and Support Group selection hierarchy', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await consoleCasetemplatePage.clickOnCreateCaseTemplateButton();
            await createCaseTemplate.setTemplateName("caseTemplateName" + randomStr);
            await createCaseTemplate.setCompanyName("Petramco");
            await createCaseTemplate.setCaseSummary("caseTemplateSummary1" + randomStr);
            await createCaseTemplate.setOwnerCompanyValue("Petramco");
            await createCaseTemplate.setOwnerOrgDropdownValue(businessUnitUSSupport);
            await createCaseTemplate.setOwnerGroupDropdownValue(suppGrpUSSupport1);
            await changeAssignmentPage.setDropDownValue('SupportOrg', businessUnitUSSupport);
            await changeAssignmentPage.setDropDownValue('AssignedGroup', suppGrpUSSupport1);
            await changeAssignmentPage.setDropDownValue('Assignee', assigneeQfeng);
            await createCaseTemplate.clickSaveCaseTemplate();
            expect(await changeAssignmentPage.getAssigneeValue()).toContain(assigneeQfeng, "assignee is not available");
            expect(await changeAssignmentPage.getSupportOrgText()).toBe(businessUnitUSSupport);
            expect(await changeAssignmentPage.getAssignedGroupText()).toBe(suppGrpUSSupport1);
            await viewCaseTemplate.clickBackArrowBtn();
        });
        it('[5047,5046,5045,5044,5027]: Verify Company and Support Group selection hierarchy.', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', BWF_PAGE_TITLES.TASK_MANAGEMENT.TEMPLATES);
            await selectTaskTemplate.clickOnManualTaskTemplateButton();
            await taskTemplate.setTemplateName('manualTaskTemplate' + randomStr);
            await taskTemplate.setTaskSummary('manualTaskSummary' + randomStr);
            await taskTemplate.setTaskDescription('Description in manual task');
            await taskTemplate.selectCompanyByName('Petramco');
            await taskTemplate.selectOwnerCompany("Petramco");
            await taskTemplate.selectBuisnessUnit(businessUnitUSSupport);
            await taskTemplate.selectOwnerGroup(suppGrpUSSupport1);
            await changeAssignmentPage.setDropDownValue('SupportOrg', businessUnitUSSupport);
            await changeAssignmentPage.setDropDownValue('AssignedGroup', suppGrpUSSupport1);
            await changeAssignmentPage.setDropDownValue('Assignee', assigneeQfeng);
            await taskTemplate.clickOnSaveTaskTemplate();
            expect(await changeAssignmentPage.getAssigneeValue()).toBe(assigneeQfeng, "assignee is not available");
            expect(changeAssignmentPage.getSupportOrgText()).toBe(businessUnitUSSupport);
            expect(changeAssignmentPage.getAssignedGroupText()).toBe(suppGrpUSSupport1);
            await viewTaskTemplate.clickBackArrowBtn();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[5001]: Verify Company, Business Unit , Department and Support group selection hierarchy in Case  Access.', async () => {
        let businessData = businessDataFile['BusinessUnitData11825'];
        let departmentData = departmentDataFile['DepartmentData11825'];
        let suppGrpData = supportGrpDataFile['SuppGrpData11825'];
        it('[5001]: Create case', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary("5001 Case Summary");
            await createCasePage.setPriority("Medium");
            await createCasePage.selectCategoryTier1("Employee Relations");
            await createCasePage.selectCategoryTier2("Compensation");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePo.clickOnTab('Case Access');
        });
        it('[5001]:Verify Company, Business Unit , Department and Support group selection hierarchy in Case  Access.', async () => {
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

    describe('[6109]: [Permissions] Case Assignment Mapping access', () => {
        let randomStr: string = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let personData = personDataFile['PersonData11825'];
        it('[6109]: [Permissions] Case Assignment Mapping access', async () => {
            await navigationPage.signOut();
            await loginPage.login(personData.userId + "@petramco.com", 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', BWF_PAGE_TITLES.CASE_MANAGEMENT.ASSIGNMENTS);

            //Create Assignment mapping
            await assignmentConfigConsolePage.clickOnCreateAssignmentConfiguration();
            expect(await assignmentConfigCreatePage.isCompanyDropdownValueMatches(['- Global -', 'Petramco'])).toBeTruthy('Dropdown values do not match');
            await utilityCommon.closeAllBlades();
            await assignmentConfigConsolePage.clickOnCreateAssignmentConfiguration();
            await assignmentConfigCreatePage.setAssignmentMapName('Assignement Mapping' + randomStr);
            await assignmentConfigCreatePage.setCompany("- Global -");
            await assignmentConfigCreatePage.setSupportCompany("Petramco");
            await assignmentConfigCreatePage.setBusinessUnit('Australia Support');
            await assignmentConfigCreatePage.setSupportGroup("AU Support 1");
            await assignmentConfigCreatePage.clickonSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Successfull message is not appeared');

            //Update assignment mapping
            await utilityGrid.searchAndOpenHyperlink('Assignement Mapping' + randomStr);
            await editAssignmentsConfigPo.setAssignmentMappingName("Assignement Mapping_updated " + randomStr);
            await editAssignmentsConfigPo.clickonSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Successfull message is not appeared');

            //Delete Assignment mapping
            await utilityGrid.searchRecord("Assignement Mapping_updated " + randomStr);
            await utilityGrid.selectAllCheckBox();
            await assignmentConfigConsolePage.clickDeleteButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            expect(await utilityCommon.isPopUpMessagePresent('Record(s) deleted successfully.')).toBeTruthy('Successfull message is not appeared');
        });

        it('[6109]: [Permissions] Case Assignment Mapping access of different company user', async () => {
            //Login with Psilon Case Manager and verify the access

            await navigationPage.signOut();
            await loginPage.login('rrovnitov');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', BWF_PAGE_TITLES.CASE_MANAGEMENT.ASSIGNMENTS);
            expect(await utilityGrid.isGridRecordPresent("Assignement Mapping_updated " + randomStr)).toBeFalsy('Record is available');

            //Login with Psilon Case Admin and verify the access
            await navigationPage.signOut();
            await loginPage.login('gwixillian');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', BWF_PAGE_TITLES.CASE_MANAGEMENT.ASSIGNMENTS);
            expect(await utilityGrid.isGridRecordPresent("Assignement Mapping_updated " + randomStr)).toBeFalsy('Record is available');
        });

        afterAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteReadAccessOrAssignmentMapping("Assignement Mapping_updated " + randomStr);
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[4444]:[Permissions] Location based assignment with multiple companies', async () => {
        let randomStr: string = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let assignmentMappingName = "4444 " + randomStr;
        beforeAll(async () => {
            await createNewUsers();
        });
        it('[4444]:[Permissions] Location based assignment with multiple companies', async () => {
            await navigationPage.signOut();
            await loginPage.login('morwenna');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', BWF_PAGE_TITLES.CASE_MANAGEMENT.ASSIGNMENTS);
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
        it('[4444]:[Permissions] Location based assignment with multiple companies', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', BWF_PAGE_TITLES.CASE_MANAGEMENT.ASSIGNMENTS);
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
        it('[4444]:[Permissions] Location based assignment with multiple companies', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary("5418 Case Summary1");
            await createCasePage.setPriority('Critical');
            await createCasePage.selectSite('Canberra');
            await createCasePage.selectCategoryTier1("Employee Relations");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getAssignedGroupValue()).toBe('Psilon Support Group1');
            expect(await viewCasePo.getAssigneeText()).toBe('Glit Deruno');
        });
        it('[4444]:[Permissions] Location based assignment with multiple companies', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary("5418 Case Summary1");
            await createCasePage.setPriority('Critical');
            await createCasePage.selectSite('Canberra');
            await createCasePage.selectCategoryTier1("Employee Relations");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getAssignedGroupValue()).toBe('Psilon Support Group1');
            expect(await viewCasePo.getAssigneeText()).toBe('Glit Deruno');
        });
        afterAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteReadAccessOrAssignmentMapping(assignmentMappingName);
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[4525]:Verify the values belonging to a perticular company for the fields Region and Site are according to logged in user permission', async () => {
        let randomStr: string = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let region: string[] = ['AMER', 'APAC', 'Australia', 'Caribbean', 'Central America', 'Central Asia', 'China', 'Chūbu', 'Chūgoku', 'EMEA', 'East Asia', 'Hokkaidō', 'Japan', 'Kansai', 'Kantō', 'Kyūshū', 'North America', 'Shikoku', 'South America', 'South Asia', 'Southeast Asia', 'Tōhoku'];
        let site: string[] = [' ', 'Canberra', 'Macquarie Park', 'Melbourne', 'Wellington'];
        it('[4525]:Verify the values belonging to a perticular company for the fields Region and Site are according to logged in user permission', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', BWF_PAGE_TITLES.CASE_MANAGEMENT.ASSIGNMENTS);
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
        it('[4525]:Verify the values belonging to a perticular company for the fields Region and Site are according to logged in user permission', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', BWF_PAGE_TITLES.CASE_MANAGEMENT.ASSIGNMENTS);
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

    xdescribe('[4449]: Assignment mapping search using filters', async () => {
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
        it('[4449]: Assignment mapping search using filters', async () => {
            await navigationPage.signOut();
            await loginPage.login(userId1, 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', BWF_PAGE_TITLES.CASE_MANAGEMENT.ASSIGNMENTS);
            await assignmentConfigConsolePage.deleteDefaultAssignmentConfig();
            await assignmentConfigConsolePage.searchAndClickOnAssignmentConfig(assignmentData1.assignmentMappingName);
            await editAssignmentsConfigPo.setDefaultToggleButton(true);
            await editAssignmentsConfigPo.clickonSaveButton();
            await utilityCommon.closePopUpMessage();
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.addFilter('Company', 'Phylum', 'text');
            await utilityGrid.searchRecord(assignmentData1.assignmentMappingName);
            expect(await utilityGrid.isGridRecordPresent(assignmentData1.assignmentMappingName)).toBeTruthy(assignmentData1.assignmentMappingName);
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.addFilter('Support Company', 'Phylum', 'text');
            await utilityGrid.searchRecord(assignmentData1.assignmentMappingName);
            expect(await utilityGrid.isGridRecordPresent(assignmentData1.assignmentMappingName)).toBeTruthy(assignmentData1.assignmentMappingName);
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.addFilter('Region', 'North America', 'text');
            await utilityGrid.searchRecord(assignmentData1.assignmentMappingName);
            expect(await utilityGrid.isGridRecordPresent(assignmentData1.assignmentMappingName)).toBeTruthy(assignmentData1.assignmentMappingName);
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.addFilter('Site', 'Phylum Site2', 'text');
            await utilityGrid.searchRecord(assignmentData2.assignmentMappingName);
            expect(await utilityGrid.isGridRecordPresent(assignmentData1.assignmentMappingName)).toBeFalsy(assignmentData1.assignmentMappingName);
            expect(await utilityGrid.isGridRecordPresent(assignmentData2.assignmentMappingName)).toBeTruthy(assignmentData2.assignmentMappingName);
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.addFilter('Case Priority', 'Low', 'checkbox');
            await utilityGrid.searchRecord(assignmentData1.assignmentMappingName);
            expect(await utilityGrid.isGridRecordPresent(assignmentData1.assignmentMappingName)).toBeTruthy(assignmentData1.assignmentMappingName);
            expect(await utilityGrid.isGridRecordPresent(assignmentData2.assignmentMappingName)).toBeFalsy(assignmentData2.assignmentMappingName);
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.addFilter('Default Mapping', 'True', 'checkbox');
            await utilityGrid.searchRecord(assignmentData1.assignmentMappingName);
            expect(await assignmentConfigConsolePage.getSelectedGridRecordValue('Default Mapping')).toContain("True", 'Filter Default Mapping is missing in column');
        });
        it('[4449]: Assignment mapping search using filters', async () => {
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.addFilter('Assignment Name', assignmentData2.assignmentMappingName, 'text');
            await utilityGrid.searchRecord(assignmentData2.assignmentMappingName);
            expect(await utilityGrid.isGridRecordPresent(assignmentData1.assignmentMappingName)).toBeFalsy(assignmentData1.assignmentMappingName);
            expect(await utilityGrid.isGridRecordPresent(assignmentData2.assignmentMappingName)).toBeTruthy(assignmentData2.assignmentMappingName);
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.addFilter('Category Tier 1', "Employee Relations", 'text');
            await utilityGrid.searchRecord(assignmentData1.assignmentMappingName);
            expect(await utilityGrid.isGridRecordPresent(assignmentData1.assignmentMappingName)).toBeTruthy(assignmentData1.assignmentMappingName);
            expect(await utilityGrid.isGridRecordPresent(assignmentData2.assignmentMappingName)).toBeFalsy(assignmentData2.assignmentMappingName);
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.addFilter('Category Tier 2', 'Finance', 'text');
            await utilityGrid.searchRecord(assignmentData2.assignmentMappingName);
            expect(await utilityGrid.isGridRecordPresent(assignmentData1.assignmentMappingName)).toBeFalsy(assignmentData1.assignmentMappingName);
            expect(await utilityGrid.isGridRecordPresent(assignmentData2.assignmentMappingName)).toBeTruthy(assignmentData2.assignmentMappingName);
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.addFilter('Category Tier 3', "Bonus", 'text');
            await utilityGrid.searchRecord(assignmentData1.assignmentMappingName);
            expect(await utilityGrid.isGridRecordPresent(assignmentData1.assignmentMappingName)).toBeTruthy(assignmentData1.assignmentMappingName);
            expect(await utilityGrid.isGridRecordPresent(assignmentData2.assignmentMappingName)).toBeFalsy(assignmentData2.assignmentMappingName);
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.addFilter('Support Group', suppGrpData.orgName, 'text');
            await utilityGrid.searchRecord(assignmentData1.assignmentMappingName);
            expect(await utilityGrid.isGridRecordPresent(assignmentData1.assignmentMappingName)).toBeTruthy(assignmentData1.assignmentMappingName);
            expect(await utilityGrid.isGridRecordPresent(assignmentData2.assignmentMappingName)).toBeTruthy(assignmentData2.assignmentMappingName);
        });
        it('[4449]: Assignment mapping search using filters', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', BWF_PAGE_TITLES.CASE_MANAGEMENT.ASSIGNMENTS);
            await assignmentConfigConsolePage.removeColumns(defaultCaseAssignmentColumns);
            await assignmentConfigConsolePage.addColumns(arr1);
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.addFilter('Department', departmentData.orgName, 'text');
            await utilityGrid.searchRecord(assignmentData2.assignmentMappingName);
            expect(await utilityGrid.isGridRecordPresent(assignmentData2.assignmentMappingName)).toBeTruthy(assignmentData2.assignmentMappingName);
            expect(await utilityGrid.isGridRecordPresent(assignmentData1.assignmentMappingName)).toBeTruthy(assignmentData1.assignmentMappingName);
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.addFilter('Business Unit', businessData.orgName, 'text');
            await utilityGrid.searchRecord(assignmentData1.assignmentMappingName);
            expect(await utilityGrid.isGridRecordPresent(assignmentData1.assignmentMappingName)).toBeTruthy(assignmentData1.assignmentMappingName);
            expect(await utilityGrid.isGridRecordPresent(assignmentData2.assignmentMappingName)).toBeTruthy(assignmentData2.assignmentMappingName);
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.addFilter('Label', "MappingLabel" + randomStr, 'text');
            await utilityGrid.searchRecord(assignmentData1.assignmentMappingName);
            expect(await assignmentConfigConsolePage.getSelectedGridRecordValue('Label')).toContain("MappingLabel" + randomStr, 'Filter Flowset is missing in column');
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter("ID", id, "text");
            await utilityGrid.searchRecord(assignmentData1.assignmentMappingName);
            expect(await utilityGrid.isGridRecordPresent(id)).toBeTruthy(id + ' not present');
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.addFilter('Category Tier 4', "Retention Bonus", 'text');
            await utilityGrid.searchRecord(assignmentData1.assignmentMappingName);
            expect(await utilityGrid.isGridRecordPresent(assignmentData1.assignmentMappingName)).toBeTruthy(assignmentData1.assignmentMappingName);
            assignmentData1.assignmentMappingName = randomStr + "3DRDMV8968";
            assignmentData1.flowset = flowsetGlobalFieldsData.flowsetName;
            await apiHelper.createCaseAssignmentMapping(assignmentData1);
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.addFilter('Flowset', flowsetGlobalFieldsData.flowsetName, 'text');
            await utilityGrid.searchRecord(randomStr + "3DRDMV8968");
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

    xdescribe('[5418]:[Assignment Mapping] Categories partial match', () => {
        let randomStr: string = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let businessData = businessDataFile['BusinessUnitDataPhylum1'];
        let departmentData = departmentDataFile['DepartmentDataPhylum1'];
        let suppGrpData = supportGrpDataFile['SuppGrpDataPhylum1'];
        it('[5418]:[Assignment Mapping] Categories partial match', async () => {
            await navigationPage.signOut();
            await loginPage.login(userId1, 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', BWF_PAGE_TITLES.CASE_MANAGEMENT.ASSIGNMENTS);
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
            await utilityCommon.closePopUpMessage();
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("Anna");
            await createCasePage.setSummary("5418 Case Summary1");
            await createCasePage.setPriority("Critical");
            await createCasePage.selectCategoryTier1("Employee Relations");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getAssignedGroupValue()).toBe(suppGrpData.orgName);
            expect(await viewCasePo.getAssigneeText()).toBe("phylumfn4 phylumln4");
        });
        it('[5418]:[Assignment Mapping] Categories partial match', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', BWF_PAGE_TITLES.CASE_MANAGEMENT.ASSIGNMENTS);
            await assignmentConfigConsolePage.searchAndClickOnAssignmentConfig("1DRDMV8968 " + randomStr);
            await editAssignmentsConfigPo.setCategoryTier2("Compensation");
            await editAssignmentsConfigPo.clickonSaveButton();
            await utilityCommon.closePopUpMessage();
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("Anna");
            await createCasePage.setSummary("5418 Case Summary2");
            await createCasePage.setPriority("Critical");
            await createCasePage.selectCategoryTier1("Employee Relations");
            await createCasePage.selectCategoryTier2("Compensation");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getAssignedGroupValue()).toBe(suppGrpData.orgName);
            expect(await viewCasePo.getAssigneeText()).toBe("phylumfn4 phylumln4");
        });
        it('[5418]:[Assignment Mapping] Categories partial match', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', BWF_PAGE_TITLES.CASE_MANAGEMENT.ASSIGNMENTS);
            await assignmentConfigConsolePage.searchAndClickOnAssignmentConfig("1DRDMV8968 " + randomStr);
            await editAssignmentsConfigPo.setCategoryTier3("Bonus");
            await editAssignmentsConfigPo.clickonSaveButton();
            await utilityCommon.closePopUpMessage();
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("Anna");
            await createCasePage.setSummary("5418 Case Summary3");
            await createCasePage.setPriority("Critical");
            await createCasePage.selectCategoryTier1("Employee Relations");
            await createCasePage.selectCategoryTier2("Compensation");
            await createCasePage.selectCategoryTier3("Bonus");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getAssignedGroupValue()).toBe(suppGrpData.orgName);
            expect(await viewCasePo.getAssigneeText()).toBe("phylumfn4 phylumln4");
        });
        afterAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteReadAccessOrAssignmentMapping("1DRDMV8968 " + randomStr);
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    xdescribe('[5365]:[Assignment Mapping] Partially matching Assignment mapping with Flowset', () => {
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
        it('[5365]:[Assignment Mapping] Partially matching Assignment mapping with Flowset', async () => {
            await navigationPage.signOut();
            await loginPage.login(userId1, 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', BWF_PAGE_TITLES.CASE_MANAGEMENT.ASSIGNMENTS);
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
            await utilityCommon.closePopUpMessage();
        });
        it('[5365]:[Assignment Mapping] Partially matching Assignment mapping with Flowset', async () => {
            await navigationPage.signOut();
            await loginPage.login(userId1, 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await utilityGrid.searchAndOpenHyperlink(caseTemplateData.templateName);
            await viewCaseTemplate.clickOnEditCaseTemplateButton();
            await editCasetemplatePo.changeFlowsetValue(flowsetGlobalFieldsData.flowsetName);
            await editCasetemplatePo.clickSaveCaseTemplate();
            await utilityCommon.closePopUpMessage();
            await editCasetemplatePo.clickOnEditCaseTemplateMetadata();
            await editCasetemplatePo.changeTemplateStatusDropdownValue('Active');
            await editCasetemplatePo.changeOwnerCompanyValue('Phylum');
            await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
            await utilityCommon.closePopUpMessage();
        });
        it('[5365]:[Assignment Mapping] Partially matching Assignment mapping with Flowset', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Anna');
            await createCasePage.setSummary('Summary');
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateData.templateName);
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getAssignedGroupValue()).toBe(suppGrpData.orgName);
            expect(await viewCasePo.getAssigneeText()).toBe("phylumfn4 phylumln4");
        });
        afterAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteReadAccessOrAssignmentMapping("1DRDMV8968 " + randomStr);
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    xdescribe('[6324,6323]:[Assignment Mapping] Applying Assignment Mappings to cases with partial match', () => {
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
        it('[6324,6323]:[Assignment Mapping] Applying Assignment Mappings to cases with partial match', async () => {
            await apiHelper.apiLogin(userId1, "Password_1234");
            await apiHelper.createCaseAssignmentMapping(assignmentData);
            await apiHelper.createCaseTemplate(caseTemplateData);
            await apiHelper.createCaseTemplate(caseTemplateData1);
        });
        it('[6324,6323]:[Assignment Mapping] Applying Assignment Mappings to cases with partial match', async () => {
            await navigationPage.signOut();
            await loginPage.login(userId1, 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', BWF_PAGE_TITLES.CASE_MANAGEMENT.ASSIGNMENTS);
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.addFilter('Category Tier 1', 'Facilities', 'text');
            await assignmentConfigConsolePage.deleteFilteredAssignmentConfig();
            await assignmentConfigConsolePage.deleteDefaultAssignmentConfig();
            await assignmentConfigConsolePage.searchAndClickOnAssignmentConfig(assignmentData.assignmentMappingName);
            await editAssignmentsConfigPo.setDefaultToggleButton(true);
            await editAssignmentsConfigPo.clickonSaveButton();
            await utilityCommon.closePopUpMessage();
        });
        it('[6324,6323]:[Assignment Mapping] Applying Assignment Mappings to cases with partial match', async () => {
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
        it('[6324,6323]:[Assignment Mapping] Applying Assignment Mappings to cases with partial match', async () => {
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
        it('[6324,6323]:[Assignment Mapping] Applying Assignment Mappings to cases with partial match', async () => {
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
        it('[6324,6323]:[Assignment Mapping] Applying Assignment Mappings to cases with partial match', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await utilityGrid.searchAndOpenHyperlink(caseTemplateData.templateName);
            await viewCaseTemplate.clickOnEditCaseTemplateButton();
            await editCasetemplatePo.changeFlowsetValue(flowsetGlobalFieldsData.flowsetName);
            await editCasetemplatePo.clickSaveCaseTemplate();
            await utilityCommon.closePopUpMessage();
            await editCasetemplatePo.clickOnEditCaseTemplateMetadata();
            await editCasetemplatePo.changeTemplateStatusDropdownValue('Active');
            await editCasetemplatePo.changeOwnerCompanyValue('Phylum');
            await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
            await utilityCommon.closePopUpMessage();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await utilityGrid.searchAndOpenHyperlink(caseTemplateData1.templateName);
            await viewCaseTemplate.clickOnEditCaseTemplateButton();
            await editCasetemplatePo.changeFlowsetValue(flowsetGlobalFieldsData.flowsetName);
            await editCasetemplatePo.clickSaveCaseTemplate();
            await utilityCommon.closePopUpMessage();
            await editCasetemplatePo.clickOnEditCaseTemplateMetadata();
            await editCasetemplatePo.changeTemplateStatusDropdownValue('Active');
            await editCasetemplatePo.changeOwnerCompanyValue('Phylum');
            await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
            await utilityCommon.closePopUpMessage();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', BWF_PAGE_TITLES.CASE_MANAGEMENT.ASSIGNMENTS);
            await assignmentConfigConsolePage.searchAndClickOnAssignmentConfig(assignmentData.assignmentMappingName);
            await editAssignmentsConfigPo.setDefaultToggleButton(true);
            await editAssignmentsConfigPo.clickonSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Only one default record is allowed for a company. Please change the default flag and save the record.')).toBeTruthy('Message Not Present');
            await editAssignmentsConfigPo.clickOnCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });
        it('[6324,6323]:[Assignment Mapping] Applying Assignment Mappings to cases with partial match', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Anna');
            await createCasePage.setSummary('Summary1');
            await createCasePage.setPriority("Low");
            await createCasePage.selectCategoryTier1("Facilities");
            await createCasePage.selectCategoryTier2("Conference Room");
            await createCasePage.selectCategoryTier3("Furniture");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getAssignedGroupValue()).toBe(suppGrpData5.orgName);
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
            expect(await viewCasePo.getAssignedGroupValue()).toBe(suppGrpData3.orgName);
            expect(await viewCasePo.getAssigneeText()).toBe("phylumfn6 phylumln6");
        });
        it('[6324,6323]:[Assignment Mapping] Applying Assignment Mappings to cases with partial match', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Anna');
            await createCasePage.setSummary('Summary3');
            await createCasePage.selectCategoryTier1("Facilities");
            await createCasePage.selectCategoryTier2("Conference Room");
            await createCasePage.selectCategoryTier3("Phone");
            await createCasePage.setPriority("Low");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getAssignedGroupValue()).toBe(suppGrpData1.orgName);
            expect(await viewCasePo.getAssigneeText()).toBe("phylumfn4 phylumln4");
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Anna');
            await createCasePage.setSummary('Summary4');
            await createCasePage.setPriority("Low");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getAssignedGroupValue()).toBe(suppGrpData1.orgName);
            expect(await viewCasePo.getAssigneeText()).toBe("phylumfn4 phylumln4");
        });
        it('[6324,6323]:[Assignment Mapping] Applying Assignment Mappings to cases with partial match', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Anna');
            await createCasePage.setSummary('Summary5');
            await createCasePage.setPriority("Low");
            await createCasePage.selectCategoryTier1("Employee Relations");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getAssignedGroupValue()).toBe(suppGrpData1.orgName);
            expect(await viewCasePo.getAssigneeText()).toBe("phylumfn4 phylumln4");
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Anna');
            await createCasePage.setSummary('Summary6');
            await createCasePage.setPriority("Low");
            await createCasePage.selectCategoryTier1("Facilities");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getAssignedGroupValue()).toBe(suppGrpData1.orgName);
            expect(await viewCasePo.getAssigneeText()).toBe("phylumfn4 phylumln4");
        });
        it('[6324,6323]:[Assignment Mapping] Applying Assignment Mappings to cases with partial match', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Anna');
            await createCasePage.setSummary('Summary7');
            await createCasePage.selectCategoryTier1("Facilities");
            await createCasePage.selectCategoryTier2("Kitchen");
            await createCasePage.setPriority("Medium");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getAssignedGroupValue()).toBe(suppGrpData1.orgName);
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Anna');
            await createCasePage.setSummary('Summary8');
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateData.templateName);
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getAssignedGroupValue()).toBe(suppGrpData6.orgName);
            expect(await viewCasePo.getAssigneeText()).toBe("phylumfn9 phylumln9");
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Anna');
            await createCasePage.setSummary('Summary9');
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateData1.templateName);
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getAssignedGroupValue()).toBe(suppGrpData1.orgName);
            expect(await viewCasePo.getAssigneeText()).toBe("phylumfn4 phylumln4");
        });
        it('[6324,6323]:[Assignment Mapping] Applying Assignment Mappings to cases with partial match', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Anna');
            await createCasePage.setSummary('Summary10');
            await createCasePage.setPriority("High");
            await createCasePage.selectCategoryTier1("Facilities");
            await createCasePage.selectCategoryTier2("Kitchen");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getAssignedGroupValue()).toBe(suppGrpData2.orgName);
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
            expect(await viewCasePo.getAssignedGroupValue()).toBe(suppGrpData1.orgName);
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
