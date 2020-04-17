import { browser, protractor, ProtractorExpectedConditions } from "protractor";
import apiCoreUtil from '../../api/api.core.util';
import apiHelper from '../../api/api.helper';
import caseConsolePage from "../../pageobject/case/case-console.po";
import previewCasePo from '../../pageobject/case/case-preview.po';
import createCasePage from "../../pageobject/case/create-case.po";
import QuickCasePage from "../../pageobject/case/quick-case.po";
import { default as viewCasePage, default as viewCasePo } from "../../pageobject/case/view-case.po";
import caseAccessTabPo from '../../pageobject/common/case-access-tab.po';
import changeAssignmentPage from '../../pageobject/common/change-assignment-blade.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import AssignmentConfigConsolePage from "../../pageobject/settings/case-management/assignments-config-console.po";
import consoleCasetemplatePage from '../../pageobject/settings/case-management/console-casetemplate.po';
import AssignmentConfigCreatePage from "../../pageobject/settings/case-management/create-assignments-config.po";
import createCaseTemplate from '../../pageobject/settings/case-management/create-casetemplate.po';
import AssignmentConfigEditPage from "../../pageobject/settings/case-management/edit-assignments-config.po";
import viewCaseTemplate from '../../pageobject/settings/case-management/view-casetemplate.po';
import editDocumentLibraryPo from '../../pageobject/settings/document-management/edit-document-library.po';
import selectTaskTemplate from "../../pageobject/settings/task-management/console-tasktemplate.po";
import taskTemplate from "../../pageobject/settings/task-management/create-tasktemplate.po";
import viewTaskTemplate from "../../pageobject/settings/task-management/view-tasktemplate.po";
import adhoctaskTemplate from "../../pageobject/task/create-adhoc-task.po";
import editTaskPo from '../../pageobject/task/edit-task.po';
import { default as manageTask } from "../../pageobject/task/manage-task-blade.po";
import viewTask from "../../pageobject/task/view-task.po";
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilityCommon from '../../utils/utility.common';
import changeAssignmentOldPage from '../../pageobject/common/change-assignment-old-blade.po';

describe("Create Case Assignment Mapping", () => {
    const EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login("qkatawazi");
        await foundationData("Petramco");
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    afterEach(async () => {
        await utilityCommon.refresh();
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
        expect(await viewCasePage.getCaseSite()).toBe('Berlin');
    })

    //radhiman
    it('[DRDMV-1210]: Case Workspace table columns', async () => {
        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester('apavlik');
        await createCasePage.setSummary('DRDMV-1210 summary');
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        await navigationPage.gotoCaseConsole();
        await caseConsolePage.setCaseSearchBoxValue('DRDMV-1210 summary');
        let defaultCaseColumns: string[] = ["Case ID", "Request ID", "Priority", "Status", "Summary", "Assigned Group", "Assignee", "Requester", "Modified Date", "SLM Status"];
        expect(await caseConsolePage.areCaseGridColumnMatches(defaultCaseColumns)).toBeTruthy("Default columns are not matching");
        let caseLabelColumn: string[] = ["Label"];
        await caseConsolePage.addRequestedCaseGridColumn(caseLabelColumn);
        defaultCaseColumns.push("Label");
        expect(await caseConsolePage.areCaseGridColumnMatches(defaultCaseColumns)).toBeTruthy("Default And new columns added are not matching");
        await caseConsolePage.removeRequestedCaseGridColumn(caseLabelColumn);
        await defaultCaseColumns.splice(defaultCaseColumns.indexOf("Label"), 1);
        expect(await caseConsolePage.areCaseGridColumnMatches(defaultCaseColumns)).toBeTruthy("Default And remaining new columns are not matching");
    })

    //radhiman
    it('[DRDMV-15168]: Assignment mapping table columns', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', 'Configure Case Assignments - Business Workflows');
        await AssignmentConfigConsolePage.clearFilter();
        let defaultCaseAssignmentColumns: string[] = ["Assignment Name", "Case Priority", "Company", "Category Tier 1", "Category Tier 2", "Category Tier 3", "Region", "Site", "Support Company", "Support Group", "Default Mapping"];
        expect(await AssignmentConfigConsolePage.areCaseAssignmentGridColumnMatches(defaultCaseAssignmentColumns)).toBeTruthy("Default columns are not matching");
        let caseAssignmentLabelColumn: string[] = ["Label"];
        await AssignmentConfigConsolePage.addRequestedCaseAssignmentGridColumn(caseAssignmentLabelColumn);
        defaultCaseAssignmentColumns.push("Label");
        expect(await AssignmentConfigConsolePage.areCaseAssignmentGridColumnMatches(defaultCaseAssignmentColumns)).toBeTruthy("Default And new columns added are not matching");
        await AssignmentConfigConsolePage.removeRequestedCaseAssignmentGridColumn(caseAssignmentLabelColumn);
        await defaultCaseAssignmentColumns.splice(defaultCaseAssignmentColumns.indexOf("Label"), 1);
        expect(await AssignmentConfigConsolePage.areCaseAssignmentGridColumnMatches(defaultCaseAssignmentColumns)).toBeTruthy("Default And remaining new columns are not matching");
    })

    //radhiman
    it('[DRDMV-1242]: [Assignment Mapping] Add/Edit Assignment Mapping views (UI verification)', async () => {
        let assignmentFields: string[] = ["Assignment Mapping Name", "Company", "Flowset", "Category Tier 1", "Category Tier 2", "Category Tier 3", "Category Tier 4", "Priority", "Label", "Region", "Site", "Use as Default", "Support Company", "Business Unit", "Department", "Support Group", "Assignee"];
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let assignmentMappingName = "DRDMV-1242 " + randomStr;
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', 'Configure Case Assignments - Business Workflows');
        await AssignmentConfigConsolePage.clearFilter();
        await AssignmentConfigConsolePage.clickOnCreateAssignmentConfiguration();
        expect(await AssignmentConfigCreatePage.areAllFieldsPresentOnUI(assignmentFields)).toBeTruthy("Expected fields are not matching with actual fields present on Create Assignent UI");
        await AssignmentConfigCreatePage.setAssignmentMapName(assignmentMappingName);
        await AssignmentConfigCreatePage.setCompany("Petramco");
        await AssignmentConfigCreatePage.setSupportCompany("Petramco");
        await AssignmentConfigCreatePage.setSupportGroup("AU Support 1");
        await AssignmentConfigCreatePage.clickonSaveButton();
        await AssignmentConfigConsolePage.searchAndClickOnAssignmentConfig(assignmentMappingName);
        expect(await AssignmentConfigEditPage.areAllFieldsPresentOnUI(assignmentFields)).toBeTruthy("Expected fields are not matching with actual fields present on Edit Assignent UI");
    })

    //radhiman
    it('[DRDMV-11999]: [Assignment Mapping] Verify Global Company on Assignment Grid', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let assignmentMappingName = "DRDMV-11999 " + randomStr;
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', 'Configure Case Assignments - Business Workflows');
        await AssignmentConfigConsolePage.clearFilter();
        await AssignmentConfigConsolePage.clickOnCreateAssignmentConfiguration();
        await AssignmentConfigCreatePage.setAssignmentMapName(assignmentMappingName);
        await AssignmentConfigCreatePage.setCompany("- Global -");
        await AssignmentConfigCreatePage.setSupportCompany("Petramco");
        await AssignmentConfigCreatePage.setSupportGroup("AU Support 1");
        await AssignmentConfigCreatePage.clickonSaveButton();
        await AssignmentConfigConsolePage.searchAssignmentConfig(assignmentMappingName);
        expect(await AssignmentConfigConsolePage.getValueOnAssignmentConfigGrid("Company")).toBe("- Global -");
    })

    //radhiman
    it('[DRDMV-11964]: [Assignment Mapping] Verify Global Company on Assignment Grid', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let assignmentMappingName = "DRDMV-11964 " + randomStr;
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', 'Configure Case Assignments - Business Workflows');
        await AssignmentConfigConsolePage.clearFilter();
        await AssignmentConfigConsolePage.clickOnCreateAssignmentConfiguration();
        await AssignmentConfigCreatePage.setAssignmentMapName(assignmentMappingName);
        await AssignmentConfigCreatePage.setCompany("Petramco");
        await AssignmentConfigCreatePage.setSupportCompany("Petramco");
        await AssignmentConfigCreatePage.setSupportGroup("AU Support 1");
        await AssignmentConfigCreatePage.clickonSaveButton();
        await AssignmentConfigConsolePage.searchAndClickOnAssignmentConfig(assignmentMappingName);
        await AssignmentConfigEditPage.setCompany("- Global -")
        await AssignmentConfigEditPage.clickonSaveButton();
        await AssignmentConfigConsolePage.searchAndselectAssignmentConfig(assignmentMappingName);
        expect(await AssignmentConfigConsolePage.getValueOnAssignmentConfigGrid("Company")).toBe("- Global -");
        await AssignmentConfigConsolePage.clickDeleteButton();
        await utilCommon.clickOnWarningOk();
        //expect(await utilCommon.getPopUpMessage()).toBe('Record(s) deleted successfully.');
    })

    //radhiman
    it('[DRDMV-11963]: [Assignment Mapping] Global Assignment Mapping', async () => {
        try {
            const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let assignmentMappingName = "DRDMV-11963 " + randomStr;
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', 'Configure Case Assignments - Business Workflows');
            await AssignmentConfigConsolePage.clearFilter();
            await AssignmentConfigConsolePage.clickOnCreateAssignmentConfiguration();
            await AssignmentConfigCreatePage.setAssignmentMapName(assignmentMappingName);
            await AssignmentConfigCreatePage.setCompany("- Global -");
            await AssignmentConfigCreatePage.setFlowset("Facilities Management");
            await AssignmentConfigCreatePage.setCategoryTier1("Facilities");
            await AssignmentConfigCreatePage.setCategoryTier2("Cleaning");
            await AssignmentConfigCreatePage.setCategoryTier3("External");
            await AssignmentConfigCreatePage.setPriority("Low");
            await AssignmentConfigCreatePage.setSupportCompany("Petramco");
            await AssignmentConfigCreatePage.setSupportGroup("AU Support 1");
            await AssignmentConfigCreatePage.clickonSaveButton();
            await AssignmentConfigConsolePage.searchAssignmentConfig(assignmentMappingName);
            expect(await AssignmentConfigConsolePage.getValueOnAssignmentConfigGrid("Assignment Name")).toBe(assignmentMappingName);
            await navigationPage.signOut();
            await loginPage.login('gderuno');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', 'Configure Case Assignments - Business Workflows');
            await AssignmentConfigConsolePage.clearFilter();
            await AssignmentConfigConsolePage.searchAssignmentConfig(assignmentMappingName);
            expect(await AssignmentConfigConsolePage.getValueOnAssignmentConfigGrid("Assignment Name")).toBe(assignmentMappingName);
        }
        catch (error) {
            throw error;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 150 * 1000);

    //radhiman
    it('[DRDMV-12034]: [Assignment Mapping] Verify precedence will be given to company specific assignment mapping if we have global approval mapping with Same name', async () => {
        const randomStr1 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        const randomStr2 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let globalAssignmentMappingName = "DRDMV-12034 " + randomStr1;
        let companyAssignmentMappingName = "DRDMV-12034 " + randomStr2;
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', 'Configure Case Assignments - Business Workflows');
        await AssignmentConfigConsolePage.clearFilter();
        await AssignmentConfigConsolePage.clickOnCreateAssignmentConfiguration();
        await AssignmentConfigCreatePage.setAssignmentMapName(globalAssignmentMappingName);
        await AssignmentConfigCreatePage.setCompany("- Global -");
        await AssignmentConfigCreatePage.setCategoryTier1("Facilities");
        await AssignmentConfigCreatePage.setPriority("Low");
        await AssignmentConfigCreatePage.setSupportCompany("Petramco");
        await AssignmentConfigCreatePage.setSupportGroup("AU Support 1");
        await AssignmentConfigCreatePage.clickonSaveButton();
        await AssignmentConfigConsolePage.searchAssignmentConfig(globalAssignmentMappingName);
        expect(await AssignmentConfigConsolePage.getValueOnAssignmentConfigGrid("Assignment Name")).toBe(globalAssignmentMappingName);
        await AssignmentConfigConsolePage.clickOnCreateAssignmentConfiguration();
        await AssignmentConfigCreatePage.setAssignmentMapName(companyAssignmentMappingName);
        await AssignmentConfigCreatePage.setCompany("Petramco");
        await AssignmentConfigCreatePage.setCategoryTier1("Facilities");
        await AssignmentConfigCreatePage.setPriority("Low");
        await AssignmentConfigCreatePage.setSupportCompany("Petramco");
        await AssignmentConfigCreatePage.setSupportGroup("AU Support 2");
        await AssignmentConfigCreatePage.clickonSaveButton();
        await AssignmentConfigConsolePage.searchAssignmentConfig(companyAssignmentMappingName);
        expect(await AssignmentConfigConsolePage.getValueOnAssignmentConfigGrid("Assignment Name")).toBe(companyAssignmentMappingName);
        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary("DRDMV-12034 Case Summary");
        await createCasePage.setPriority("Low");
        await createCasePage.selectCategoryTier1("Facilities");
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        expect(await viewCasePage.getAssignedGroupText()).toBe("AU Support 2");
    }, 150 * 1000);

    //radhiman
    it('[DRDMV-12033]: [Assignment Mapping] Verify Global assignment mapping applied to case if assignment qualification matches', async () => {
        try {
            const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let assignmentMappingName = "DRDMV-12033 " + randomStr;
            await navigationPage.signOut();
            await loginPage.login('gwixillian');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', 'Configure Case Assignments - Business Workflows');
            await AssignmentConfigConsolePage.clearFilter();
            //Need to delete all Psilon related assignments, then only global can apply
            await AssignmentConfigConsolePage.addFilter('Company', 'Psilon', 'text');
            await AssignmentConfigConsolePage.clickDeleteButtonOnlyIfRecordsPresent();
            await AssignmentConfigConsolePage.clearFilter();
            await AssignmentConfigConsolePage.clickOnCreateAssignmentConfiguration();
            await AssignmentConfigCreatePage.setAssignmentMapName(assignmentMappingName);
            await AssignmentConfigCreatePage.setCompany("- Global -");
            await AssignmentConfigCreatePage.setCategoryTier1("Projectors");
            await AssignmentConfigCreatePage.setCategoryTier2("Repair");
            await AssignmentConfigCreatePage.setPriority("Medium");
            await AssignmentConfigCreatePage.setSupportCompany("Psilon");
            await AssignmentConfigCreatePage.setSupportGroup("Psilon Support Group2");
            await AssignmentConfigCreatePage.clickonSaveButton();
            await AssignmentConfigConsolePage.searchAssignmentConfig(assignmentMappingName);
            expect(await AssignmentConfigConsolePage.getValueOnAssignmentConfigGrid("Assignment Name")).toBe(assignmentMappingName);
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("gderuno");
            await createCasePage.setSummary("DRDMV-12033 Case Summary");
            await createCasePage.setPriority("Medium");
            await createCasePage.selectCategoryTier1("Projectors");
            await createCasePage.selectCategoryTier2("Repair");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePage.getAssignedGroupText()).toBe("Psilon Support Group2");
        }
        catch (error) {
            throw error;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 250 * 1000);

    //radhiman
    it('[DRDMV-1212]: [Assignment Mapping] Configuring an Assignment Mapping', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let assignmentMappingName = "DRDMV-1212 " + randomStr;
        let caseTemplateName = "DRDMV-1212 CT " + randomStr;
        var assignmentData =
        {
            "assignmentMappingName": assignmentMappingName,
            "company": "Petramco",
            "supportCompany": "Petramco",
            "supportGroup": "Employee Relations",
            "assignee": "qliu",
            "categoryTier1": "Purchasing Card",
            "categoryTier2": "Policies",
            "categoryTier3": "Card Issuance",
            "priority": "Low",
        }
        let templateData = {
            "templateName": caseTemplateName,
            "templateSummary": caseTemplateName,
            "categoryTier1": "Purchasing Card",
            "categoryTier2": "Policies",
            "categoryTier3": "Card Issuance",
            "casePriority": "Low",
            "templateStatus": "Active",
            "company": "Petramco",
        }
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createCaseTemplate(templateData);
        await apiHelper.createCaseAssignmentMapping(assignmentData);
        await navigationPage.gotoQuickCase();
        await QuickCasePage.selectRequesterName("adam");
        await browser.sleep(30000);
        await QuickCasePage.selectCaseTemplate(caseTemplateName);
        await QuickCasePage.saveCase();
        await QuickCasePage.gotoCaseButton();
        await expect(await viewCasePage.getAssignedGroupText()).toBe("Employee Relations");
        await expect(await viewCasePage.getAssigneeText()).toBe("Qiwei Liu");
    }, 360 * 1000);

    async function foundationData(company: string) {
        const businessDataFile = require('../../data/ui/foundation/businessUnit.ui.json');
        const departmentDataFile = require('../../data/ui/foundation/department.ui.json');
        const supportGrpDataFile = require('../../data/ui/foundation/supportGroup.ui.json');
        const personDataFile = require('../../data/ui/foundation/person.ui.json');
        await apiHelper.apiLogin('tadmin');
        let businessData = businessDataFile['BusinessUnitData11825'];
        let departmentData = departmentDataFile['DepartmentData11825'];
        let suppGrpData = supportGrpDataFile['SuppGrpData11825'];
        let personData = personDataFile['PersonData11825'];
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

    it('[DRDMV-11825,DRDMV-11826, DRDMV-11827, DRDMV-11828]: Verify Company and Support Group selection hierarchy.', async () => {
        const businessDataFile = require('../../data/ui/foundation/businessUnit.ui.json');
        const departmentDataFile = require('../../data/ui/foundation/department.ui.json');
        const supportGrpDataFile = require('../../data/ui/foundation/supportGroup.ui.json');
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let summary = 'Adhoc task' + Math.floor(Math.random() * 1000000);
        let businessData = businessDataFile['BusinessUnitData11825'];
        let departmentData = departmentDataFile['DepartmentData11825'];
        let suppGrpData = supportGrpDataFile['SuppGrpData11825'];
        //Case
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
        await utilityCommon.waitUntilPopUpDisappear();
        await previewCasePo.clickGoToCaseButton();
        expect(await viewCasePage.getAssignedGroupText()).toBe(suppGrpData.orgName, "Support Group Not Populated");
        expect(await viewCasePage.getAssigneeText()).toBe('fnPerson11825 lnPerson11825', "assignee is not available");
        expect(await viewCasePage.getBusinessUnitText()).toBe(businessData.orgName, "Buisness Unit is not available");
        expect(await viewCasePage.getDepartmentText()).toBe(departmentData.orgName, "Department is not available");
        expect(await viewCasePage.getAssignedCompanyText()).toBe("Petramco", "Company is not available");
        //task
        await viewCasePage.clickAddTaskButton();
        await manageTask.clickAddAdhocTaskButton();
        await adhoctaskTemplate.setSummary(summary);
        await adhoctaskTemplate.setDescription("Description");
        await adhoctaskTemplate.clickOnSaveAdhoctask();
        await manageTask.clickOnCloseButton();
        await viewCasePage.clickOnTaskLink(summary);
        await viewTask.clickOnEditTask();
        await editTaskPo.clickOnChangeAssignementButton();
        await changeAssignmentPage.selectBusinessUnit(businessData.orgName);
        await changeAssignmentPage.selectDepartment(departmentData.orgName);
        await changeAssignmentPage.selectSupportGroup(suppGrpData.orgName);
        await changeAssignmentPage.selectAssignee('fnPerson11825 lnPerson11825');
        await changeAssignmentPage.clickOnAssignButton();
        await editTaskPo.updateTaskSummary(summary);
        await editTaskPo.clickOnSaveButton();
        await utilCommon.waitUntilPopUpDisappear();
        await utilCommon.scrollUpOrDownTillElement(viewTask.selectors.assignedGroupValue);
        expect(await viewTask.getAssignedGroupText()).toBe(suppGrpData.orgName, "Support Group Not Populated");
        expect(await viewTask.getAssigneeText()).toContain('fnPerson11825 lnPerson11825', "assignee is not available");
        expect(await viewTask.getBusinessUnitText()).toBe(businessData.orgName, "Buisness Unit is not available");
        expect(await viewTask.getDepartmentText()).toBe(departmentData.orgName, "Department is not available");
        expect(await viewTask.getAssignedCompanyText()).toBe("Petramco", "Company is not available");
        //Case Template
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
        //Manual task Template
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
        await expect(viewTaskTemplate.getAssigneeBusinessUnitValue()).toBe(businessData.orgName);
        await expect(viewTaskTemplate.getAssigneeDepartmentValue()).toBe(departmentData.orgName);
        await expect(viewTaskTemplate.getBuisnessunitValue()).toBe(businessData.orgName);
        await expect(viewTaskTemplate.getDepartmentValue()).toBe(departmentData.orgName);
        await utilCommon.switchToDefaultWindowClosingOtherTabs();
    }, 400 * 1000);

    it('[DRDMV-12080]: Verify Company and Support Group selection hierarchy.', async () => {
        const businessDataFile = require('../../data/ui/foundation/businessUnit.ui.json');
        const departmentDataFile = require('../../data/ui/foundation/department.ui.json');
        const supportGrpDataFile = require('../../data/ui/foundation/supportGroup.ui.json');
        let businessData = businessDataFile['BusinessUnitData12080'];
        let departmentData = departmentDataFile['DepartmentData12080'];
        let suppGrpData = supportGrpDataFile['SuppGrpData12080'];

        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary("DRDMV-12080 Case Summary");
        await createCasePage.setPriority("Medium");
        await createCasePage.selectCategoryTier1("Projectors");
        await createCasePage.selectCategoryTier2("Repair");
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        await viewCasePo.clickOnTab('Case Access');
        await caseAccessTabPo.clickOnSupportGroupAccessORAgentAccessButton('Support Group Access');
        await caseAccessTabPo.selectCompany('Petramco');
        await caseAccessTabPo.selectBusinessUnit(businessData.orgName);
        await editDocumentLibraryPo.clickOnReadAccessAddButton('Add Business Unit');
        await utilCommon.waitUntilSpinnerToHide();
        await caseAccessTabPo.clickOnSupportGroupAccessORAgentAccessButton('Support Group Access');
        await caseAccessTabPo.selectCompany('Petramco');
        await caseAccessTabPo.selectBusinessUnit(businessData.orgName);
        await caseAccessTabPo.selectDepartment(departmentData.orgName);
        await editDocumentLibraryPo.clickOnReadAccessAddButton('Add Support Department');
        await utilCommon.waitUntilSpinnerToHide();
        await caseAccessTabPo.clickOnSupportGroupAccessORAgentAccessButton('Support Group Access');
        await caseAccessTabPo.selectCompany('Petramco');
        await caseAccessTabPo.selectBusinessUnit(businessData.orgName);
        await caseAccessTabPo.selectDepartment(departmentData.orgName);
        await caseAccessTabPo.selectSupportGroup(suppGrpData.orgName);
        await editDocumentLibraryPo.clickOnReadAccessAddButton('Add Support Group');
        await utilCommon.waitUntilSpinnerToHide();
        await caseAccessTabPo.clickOnSupportGroupAccessORAgentAccessButton('Agent Access');
        await caseAccessTabPo.selectAndAddAgent('fnPerson12080 lnPerson1182512080');
        await expect(await caseAccessTabPo.isAgentNameOrSupportGroupNameDisplayed('fnPerson11825 lnPerson11825')).toBeTruthy('Failuer: Quanah George Agent Name is missing');
    }, 300 * 1000);
});
