import { browser } from "protractor";
import apiCoreUtil from '../../api/api.core.util';
import apiHelper from '../../api/api.helper';
import caseConsolePage from "../../pageobject/case/case-console.po";
import previewCasePo from '../../pageobject/case/case-preview.po';
import createCasePage from "../../pageobject/case/create-case.po";
import QuickCasePage from "../../pageobject/case/quick-case.po";
import viewCasePo from "../../pageobject/case/view-case.po";
import caseAccessTabPo from '../../pageobject/common/case-access-tab.po';
import changeAssignmentPage from '../../pageobject/common/change-assignment-blade.po';
import changeAssignmentOldPage from '../../pageobject/common/change-assignment-old-blade.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import assignmentConfigConsolePage from "../../pageobject/settings/case-management/assignments-config-console.po";
import consoleCasetemplatePage from '../../pageobject/settings/case-management/console-casetemplate.po';
import assignmentConfigCreatePage from "../../pageobject/settings/case-management/create-assignments-config.po";
import createCaseTemplate from '../../pageobject/settings/case-management/create-casetemplate.po';
import assignmentConfigEditPage from "../../pageobject/settings/case-management/edit-assignments-config.po";
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
import editCasetemplatePo from '../../pageobject/settings/case-management/edit-casetemplate.po';

describe("Create Case Assignment Mapping", () => {
    const businessDataFile = require('../../data/ui/foundation/businessUnit.ui.json');
    const departmentDataFile = require('../../data/ui/foundation/department.ui.json');
    const supportGrpDataFile = require('../../data/ui/foundation/supportGroup.ui.json');
    const personDataFile = require('../../data/ui/foundation/person.ui.json');

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login("qkatawazi");
        await foundationData("Petramco");
        await browser.sleep(5000);
    });

    async function foundationData(company: string) {
        await apiHelper.apiLogin('tadmin');
        let businessData = businessDataFile['BusinessUnitData11825'];
        let departmentData = departmentDataFile['DepartmentData11825'];
        let suppGrpData = supportGrpDataFile['SuppGrpData11825'];
        let personData = personDataFile['PersonData11825'];
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
    }

    afterAll(async () => {
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
    it('[DRDMV-1242]: [Assignment Mapping] Add/Edit Assignment Mapping views (UI verification)', async () => {
        let assignmentFields: string[] = ["Assignment Mapping Name", "Company", "Flowset", "Category Tier 1", "Category Tier 2", "Category Tier 3", "Category Tier 4", "Priority", "Label", "Region", "Site", "Use as Default", "Support Company", "Business Unit", "Department", "Support Group", "Assignee"];
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let assignmentMappingName = "DRDMV-1242 " + randomStr;
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', 'Configure Case Assignments - Business Workflows');
        await assignmentConfigConsolePage.clearFilter();
        await assignmentConfigConsolePage.clickOnCreateAssignmentConfiguration();
        expect(await assignmentConfigCreatePage.areAllFieldsPresentOnUI(assignmentFields)).toBeTruthy("Expected fields are not matching with actual fields present on Create Assignent UI");
        await assignmentConfigCreatePage.setAssignmentMapName(assignmentMappingName);
        await assignmentConfigCreatePage.setCompany("Petramco");
        await assignmentConfigCreatePage.setSupportCompany("Petramco");
        await assignmentConfigCreatePage.setBusinessUnit('Australia Support');
        await assignmentConfigCreatePage.setSupportGroup("AU Support 1");
        await assignmentConfigCreatePage.clickonSaveButton();
        await assignmentConfigConsolePage.searchAndClickOnAssignmentConfig(assignmentMappingName);
        expect(await assignmentConfigEditPage.areAllFieldsPresentOnUI(assignmentFields)).toBeTruthy("Expected fields are not matching with actual fields present on Edit Assignent UI");
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
        expect(await assignmentConfigConsolePage.getValueOnAssignmentConfigGrid("Company")).toBe("- Global -");
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
        await assignmentConfigEditPage.setCompany("- Global -");
        await assignmentConfigEditPage.clickonSaveButton();
        await assignmentConfigConsolePage.searchAndselectAssignmentConfig(assignmentMappingName);
        expect(await assignmentConfigConsolePage.getValueOnAssignmentConfigGrid("Company")).toBe("- Global -");
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
            await assignmentConfigCreatePage.setFlowset("Facilities Management");
            await assignmentConfigCreatePage.setCategoryTier1("Facilities");
            await assignmentConfigCreatePage.setCategoryTier2("Cleaning");
            await assignmentConfigCreatePage.setCategoryTier3("External");
            await assignmentConfigCreatePage.setPriority("Low");
            await assignmentConfigCreatePage.setSupportCompany("Petramco");
            await assignmentConfigCreatePage.setBusinessUnit('Australia Support');
            await assignmentConfigCreatePage.setSupportGroup("AU Support 1");
            await assignmentConfigCreatePage.clickonSaveButton();
        });
        it('[DRDMV-11963]: [Assignment Mapping] Global Assignment Mapping', async () => {
            await assignmentConfigConsolePage.searchAssignmentConfig(assignmentMappingName);
            expect(await assignmentConfigConsolePage.getValueOnAssignmentConfigGrid("Assignment Name")).toBe(assignmentMappingName);
            await navigationPage.signOut();
            await loginPage.login('gderuno');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', 'Configure Case Assignments - Business Workflows');
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.searchAssignmentConfig(assignmentMappingName);
            expect(await assignmentConfigConsolePage.getValueOnAssignmentConfigGrid("Assignment Name")).toBe(assignmentMappingName);
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
            await assignmentConfigCreatePage.setCategoryTier1("Facilities");
            await assignmentConfigCreatePage.setPriority("Low");
            await assignmentConfigCreatePage.setSupportCompany("Petramco");
            await assignmentConfigCreatePage.setBusinessUnit('Australia Support');
            await assignmentConfigCreatePage.setSupportGroup("AU Support 1");
            await assignmentConfigCreatePage.clickonSaveButton();
            await assignmentConfigConsolePage.searchAssignmentConfig(globalAssignmentMappingName);
            expect(await assignmentConfigConsolePage.getValueOnAssignmentConfigGrid("Assignment Name")).toBe(globalAssignmentMappingName);
        });
        it('[DRDMV-12034]: [Assignment Mapping] Verify precedence will be given to company specific assignment mapping if we have global approval mapping with Same name', async () => {
            await assignmentConfigConsolePage.clickOnCreateAssignmentConfiguration();
            await assignmentConfigCreatePage.setAssignmentMapName(companyAssignmentMappingName);
            await assignmentConfigCreatePage.setCompany("Petramco");
            await assignmentConfigCreatePage.setCategoryTier1("Facilities");
            await assignmentConfigCreatePage.setPriority("Low");
            await assignmentConfigCreatePage.setSupportCompany("Petramco");
            await assignmentConfigCreatePage.setBusinessUnit('Australia Support');
            await assignmentConfigCreatePage.setSupportGroup("AU Support 2");
            await assignmentConfigCreatePage.clickonSaveButton();
            await assignmentConfigConsolePage.searchAssignmentConfig(companyAssignmentMappingName);
            expect(await assignmentConfigConsolePage.getValueOnAssignmentConfigGrid("Assignment Name")).toBe(companyAssignmentMappingName);
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary("DRDMV-12034 Case Summary");
            await createCasePage.setPriority("Low");
            await createCasePage.selectCategoryTier1("Facilities");
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
            await assignmentConfigCreatePage.setCategoryTier1("Projectors");
            await assignmentConfigCreatePage.setCategoryTier2("Repair");
            await assignmentConfigCreatePage.setPriority("Medium");
            await assignmentConfigCreatePage.setSupportCompany("Psilon");
            await assignmentConfigCreatePage.setBusinessUnit('Psilon Support Org2')
            await assignmentConfigCreatePage.setSupportGroup("Psilon Support Group2");
            await assignmentConfigCreatePage.clickonSaveButton();
        });
        it('[DRDMV-12033]: [Assignment Mapping] Verify Global assignment mapping applied to case if assignment qualification matches', async () => {
            await assignmentConfigConsolePage.searchAssignmentConfig(assignmentMappingName);
            expect(await assignmentConfigConsolePage.getValueOnAssignmentConfigGrid("Assignment Name")).toBe(assignmentMappingName);
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("gderuno");
            await createCasePage.setSummary("DRDMV-12033 Case Summary");
            await createCasePage.setPriority("Medium");
            await createCasePage.selectCategoryTier1("Projectors");
            await createCasePage.selectCategoryTier2("Repair");
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
        beforeAll(async () => {
            templateData = {
                "templateName": 'caseTemplateName' + randomStr,
                "templateSummary": 'caseTemplateSummary' + randomStr,
                "categoryTier1": "Purchasing Card",
                "categoryTier2": "Policies",
                "categoryTier3": "Card Issuance",
                "casePriority": "Low",
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "ownerBU": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createCaseTemplate(templateData);
        });
        it('[DRDMV-1212]: [Assignment Mapping] Configuring an Assignment Mapping', async () => {
            await navigationPage.gotoQuickCase();
            await QuickCasePage.selectRequesterName("adam");
            await QuickCasePage.selectCaseTemplate(templateData.templateName);
            await QuickCasePage.saveCase();
            await QuickCasePage.gotoCaseButton();
            expect(await viewCasePo.getAssignedGroupText()).toBe("Facilities");
            expect(await viewCasePo.getAssigneeText()).toBe("Fritz Schulz");
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
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[DRDMV-12080]: Verify Company and Support Group selection hierarchy.', async () => {
        let businessData = businessDataFile['BusinessUnitData11825'];
        let departmentData = departmentDataFile['DepartmentData11825'];
        let suppGrpData = supportGrpDataFile['SuppGrpData11825'];
        it('[DRDMV-12080]: Create case', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary("DRDMV-12080 Case Summary");
            await createCasePage.setPriority("Medium");
            await createCasePage.selectCategoryTier1("Projectors");
            await createCasePage.selectCategoryTier2("Repair");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePo.clickOnTab('Case Access');
        });
        it('[DRDMV-12080]: Verify Company and Support Group selection hierarchy.', async () => {
            await caseAccessTabPo.clickOnSupportGroupAccessORAgentAccessButton('Support Group Access');
            await caseAccessTabPo.selectCompany('Petramco', 'Select Company');
            await caseAccessTabPo.selectBusinessUnit(businessData.orgName, 'Select Business Unit');
            await caseAccessTabPo.clickOnReadAccessAddButton('Add Business Unit');
            await caseAccessTabPo.selectCompany('Petramco', 'Select Company');
            await caseAccessTabPo.selectBusinessUnit(businessData.orgName, 'Select Business Unit');
            await caseAccessTabPo.selectDepartment(departmentData.orgName, 'Select Department');
            await caseAccessTabPo.clickOnReadAccessAddButton('Add Support Department');
            await caseAccessTabPo.selectCompany('Petramco', 'Select Company');
            await caseAccessTabPo.selectBusinessUnit(businessData.orgName, 'Select Business Unit');
            await caseAccessTabPo.selectDepartment(departmentData.orgName, 'Select Department');
            await caseAccessTabPo.selectSupportGroup(suppGrpData.orgName, 'Select Support Group');
            await caseAccessTabPo.clickOnReadAccessAddButton('Add Support Group');
            await caseAccessTabPo.clickOnSupportGroupAccessORAgentAccessButton('Agent Access');
            await caseAccessTabPo.selectAndAddAgent('fnPerson11825 lnPerson11825');
            expect(await caseAccessTabPo.isCaseAccessEntityAdded('fnPerson11825 lnPerson11825')).toBeTruthy('Failuer: Agent Name is missing');
        });
    });

    describe('[DRDMV-1495]: [Permissions] Case Assignment Mapping access', () => {
        let assignmentData,randomStr: string = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');

        beforeAll(async () => {
            assignmentData = {
                "assignmentMappingName": "DRDMV-1495" + randomStr,
                "company": "Petramco",
                "supportCompany": "Petramco",
                "businessUnit": "HR Support",
                "supportGroup": "Employee Relations",
                "assignee": "Elizabeth",
                "categoryTier1": "Purchasing Card",
                "categoryTier2": "Policies",
                "categoryTier3": "Card Issuance",
                "priority": "Low",
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createCaseAssignmentMapping(assignmentData);
        });

        it('[DRDMV-1495]: [Permissions] Case Assignment Mapping access', async () => {
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
            await assignmentConfigEditPage.setAssignmentMappingName("Assignement Mapping_updated " + randomStr);
            await assignmentConfigEditPage.clickonSaveButton();
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
            expect(await utilGrid.isGridRecordPresent("DRDMV-1495" + randomStr)).toBeFalsy('Record is available');

            //Login with Psilon Case Admin and verify the access
            await navigationPage.signOut();
            await loginPage.login('gwixillian');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', 'Configure Case Assignments - Business Workflows');
            expect(await utilGrid.isGridRecordPresent("DRDMV-1495" + randomStr)).toBeFalsy('Record is available');
        });

        afterAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteReadAccessOrAssignmentMapping(assignmentData.assignmentMappingName);
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[DRDMV-8968]:[Assignment Mapping] Categories partial match', () => {
        let assignmentData1, assignmentData2, assignmentData3, randomStr: string = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            assignmentData1 = {
                "assignmentMappingName": randomStr + "1DRDMV8968",
                "company": "Petramco",
                "supportCompany": "Petramco",
                "businessUnit": "HR Support",
                "supportGroup": "Employee Relations",
                "assignee": "Elizabeth",
                "categoryTier1": "Talent Management",
                "priority": "Critical",
            }
            assignmentData2 = {
                "assignmentMappingName": randomStr + "2DRDMV8968",
                "company": "Petramco",
                "supportCompany": "Petramco",
                "businessUnit": "HR Support",
                "supportGroup": "Staffing",
                "assignee": "Peter",
                "categoryTier1": "Talent Management",
                "categoryTier2": "Learning and Development",
                "priority": "Critical",
            }
            assignmentData3 = {
                "assignmentMappingName": randomStr + "3DRDMV8968",
                "company": "Petramco",
                "supportCompany": "Petramco",
                "businessUnit": "HR Support",
                "supportGroup": "Training and Development",
                "assignee": "Elizabeth",
                "categoryTier1": "Talent Management",
                "categoryTier2": "Learning and Development",
                "categoryTier3": "Certifications",
                "priority": "Critical",
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createCaseAssignmentMapping(assignmentData1);
            await apiHelper.createCaseAssignmentMapping(assignmentData2);
            await apiHelper.createCaseAssignmentMapping(assignmentData3);
        });
        it('[DRDMV-8968]:[Assignment Mapping] Categories partial match', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary("DRDMV-8968 Case Summary1");
            await createCasePage.setPriority(assignmentData1.priority);
            await createCasePage.selectCategoryTier1("Talent Management");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getAssignedGroupText()).toBe(assignmentData1.supportGroup);
            expect(await viewCasePo.getAssigneeText()).toBe('Elizabeth Peters');
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary("DRDMV-8968 Case Summary2");
            await createCasePage.setPriority(assignmentData2.priority);
            await createCasePage.selectCategoryTier1("Talent Management");
            await createCasePage.selectCategoryTier2("Learning and Development");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getAssignedGroupText()).toBe(assignmentData2.supportGroup);
            expect(await viewCasePo.getAssigneeText()).toBe('Peter Kahn');
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary("DRDMV-8968 Case Summary3");
            await createCasePage.setPriority(assignmentData3.priority);
            await createCasePage.selectCategoryTier1("Talent Management");
            await createCasePage.selectCategoryTier2("Learning and Development");
            await createCasePage.selectCategoryTier3("Certifications");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getAssignedGroupText()).toBe(assignmentData3.supportGroup);
            expect(await viewCasePo.getAssigneeText()).toBe('Elizabeth Peters');
        });
        afterAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteReadAccessOrAssignmentMapping(assignmentData1.assignmentMappingName);
            await apiHelper.deleteReadAccessOrAssignmentMapping(assignmentData2.assignmentMappingName);
            await apiHelper.deleteReadAccessOrAssignmentMapping(assignmentData3.assignmentMappingName);
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[DRDMV-9103]:[Assignment Mapping] Partially matching Assignment mapping with Flowset', () => {
        let assignmentData, caseTemplateData, randomStr: string = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            assignmentData = {
                "assignmentMappingName": randomStr + "1DRDMV8968",
                "company": "Petramco",
                "supportCompany": "Petramco",
                "businessUnit": "HR Support",
                "supportGroup": "Employee Relations",
                "assignee": "Elizabeth",
                "categoryTier1": "Employee Relations",
                "categoryTier2": "Compensation",
                "priority": "Low",
                "flowset": "Human Resources",
            }
            caseTemplateData = {
                "templateName": `${randomStr}Casetemplate`,
                "templateStatus": "Draft",
                "templateSummary": `${randomStr}Summary`,
                "caseStatus": "New",
                "casePriority": "Low",
                "categoryTier1": "Employee Relations",
                "categoryTier2": "Compensation",
                "categoryTier3": "Bonus",
                "company": "Petramco",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createCaseAssignmentMapping(assignmentData);
            await apiHelper.createCaseTemplate(caseTemplateData);
        });
        it('[DRDMV-9103]:[Assignment Mapping] Partially matching Assignment mapping with Flowset', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(caseTemplateData.templateName);
            await viewCaseTemplate.clickOnEditCaseTemplateButton();
            await editCasetemplatePo.changeFlowsetValue('Human Resources');
            await editCasetemplatePo.clickSaveCaseTemplate();
            await utilCommon.closePopUpMessage();
            await editCasetemplatePo.clickOnEditCaseTemplateMetadata();
            await editCasetemplatePo.changeTemplateStatusDropdownValue('Active');
            await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
            await utilCommon.closePopUpMessage();
            await navigationPage.gotoQuickCase();
            await QuickCasePage.selectRequesterName("adam");
            await QuickCasePage.setCaseSummary(caseTemplateData.templateName);
            await QuickCasePage.selectCaseTemplate(caseTemplateData.templateName);
            await QuickCasePage.saveCase();
            await QuickCasePage.gotoCaseButton();
            expect(await viewCasePo.getAssignedGroupText()).toBe(assignmentData.supportGroup);
            expect(await viewCasePo.getAssigneeText()).toBe('Elizabeth Peters');
        });
        afterAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteReadAccessOrAssignmentMapping(assignmentData.assignmentMappingName);
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[DRDMV-15170]: Assignment mapping search using filters', async () => {
        let assignmentData, randomStr: string = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let arr1: string[] = ["Department", "Flowset", "Business Unit"];
        let defaultCaseAssignmentColumns: string[] = ["Case Priority", "Company", "Category Tier 1", "Category Tier 2", "Category Tier 3", "Region", "Site", "Support Company", "Support Group", "Default Mapping"];
        let businessData = businessDataFile['BusinessUnitData11825'];
        let departmentData = departmentDataFile['DepartmentData11825'];
        let suppGrpData = supportGrpDataFile['SuppGrpData11825'];       
        beforeAll(async () => {
            assignmentData = {
                "assignmentMappingName": randomStr + "1DRDMV8968",
                "company": "Petramco",
                "supportCompany": "Petramco",
                "businessUnit": businessData.orgName,
                "department": departmentData.orgName,
                "supportGroup": suppGrpData.orgName ,
                "categoryTier1": "Employee Relations",
                "categoryTier2": "Compensation",
                "categoryTier3": "Bonus",
                "priority": "Low",
                "flowset": "Human Resources",
                "region": "Australia",
                "site": "Canberra",
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createCaseAssignmentMapping(assignmentData);
        });
        it('[DRDMV-15170]: Assignment mapping search using filters', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', 'Configure Case Assignments - Business Workflows');
            await assignmentConfigConsolePage.deleteDefaultAssignmentConfig();
            await assignmentConfigConsolePage.searchAndClickOnAssignmentConfig(assignmentData.assignmentMappingName);
            await assignmentConfigEditPage.setDefaultToggleButton(true);
            await assignmentConfigEditPage.clickonSaveButton();
            await utilCommon.closePopUpMessage();
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.addFilter('Company', 'Petramco', 'text');
            await utilGrid.searchRecord(assignmentData.assignmentMappingName);
            expect(await assignmentConfigConsolePage.getSelectedGridRecordValue('Company')).toBe("Petramco", 'Filter Company is missing in column');
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.addFilter('Support Company', 'Petramco', 'text');
            await utilGrid.searchRecord(assignmentData.assignmentMappingName);
            expect(await assignmentConfigConsolePage.getSelectedGridRecordValue('Support Company')).toBe("Petramco", 'Filter Support Company is missing in column');
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.addFilter('Region', 'Australia', 'text');
            await utilGrid.searchRecord(assignmentData.assignmentMappingName);
            expect(await assignmentConfigConsolePage.getSelectedGridRecordValue('Region')).toBe("Australia", 'Filter Region is missing in column');
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.addFilter('Site', 'Canberra', 'text');
            await utilGrid.searchRecord(assignmentData.assignmentMappingName);
            expect(await assignmentConfigConsolePage.getSelectedGridRecordValue('Site')).toBe("Canberra", 'Filter Site is missing in column');
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.addFilter('Case Priority', 'Low', 'checkbox');
            await utilGrid.searchRecord(assignmentData.assignmentMappingName);
            expect(await assignmentConfigConsolePage.getSelectedGridRecordValue('Case Priority')).toBe("Low", 'Filter Case Priority is missing in column');
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.addFilter('Default Mapping', 'True', 'checkbox');
            await utilGrid.searchRecord(assignmentData.assignmentMappingName);
            expect(await assignmentConfigConsolePage.getSelectedGridRecordValue('Default Mapping')).toBe("True", 'Filter Default Mapping is missing in column');
        });
        it('[DRDMV-15170]: Assignment mapping search using filters', async () => {
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.addFilter('Assignment Name', assignmentData.assignmentMappingName, 'text');
            await utilGrid.searchRecord(assignmentData.assignmentMappingName);
            expect(await assignmentConfigConsolePage.getSelectedGridRecordValue('Assignment Name')).toBe(assignmentData.assignmentMappingName, 'Filter Assignment Name is missing in column');
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.addFilter('Category Tier 1', 'Employee Relations', 'text');
            await utilGrid.searchRecord(assignmentData.assignmentMappingName);
            expect(await assignmentConfigConsolePage.getSelectedGridRecordValue('Category Tier 1')).toBe('Employee Relations', 'Filter Category Tier 1 is missing in column');
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.addFilter('Category Tier 2', 'Compensation', 'text');
            await utilGrid.searchRecord(assignmentData.assignmentMappingName);
            expect(await assignmentConfigConsolePage.getSelectedGridRecordValue('Category Tier 2')).toBe('Compensation', 'Filter Category Tier 2 is missing in column');
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.addFilter('Category Tier 3', 'Bonus', 'text');
            await utilGrid.searchRecord(assignmentData.assignmentMappingName);
            expect(await assignmentConfigConsolePage.getSelectedGridRecordValue('Category Tier 3')).toBe('Bonus', 'Filter Category Tier 3 is missing in column');
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.addFilter('Support Group', suppGrpData.orgName, 'text');
            await utilGrid.searchRecord(assignmentData.assignmentMappingName);
            expect(await assignmentConfigConsolePage.getSelectedGridRecordValue('Support Group')).toBe(suppGrpData.orgName, 'Filter Support Group is missing in column');
        });
        it('[DRDMV-15170]: Assignment mapping search using filters', async () => {
            await assignmentConfigConsolePage.removeColumns(defaultCaseAssignmentColumns);
            await assignmentConfigConsolePage.addColumns(arr1);
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.addFilter('Department',departmentData.orgName, 'text');
            await utilGrid.searchRecord(assignmentData.assignmentMappingName);
            expect(await assignmentConfigConsolePage.getSelectedGridRecordValue('Department')).toBe(departmentData.orgName, 'Filter Department is missing in column');
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.addFilter('Business Unit',businessData.orgName, 'text');
            await utilGrid.searchRecord(assignmentData.assignmentMappingName);
            expect(await assignmentConfigConsolePage.getSelectedGridRecordValue('Business Unit')).toBe(businessData.orgName, 'Filter Business Unit is missing in column');
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.addFilter('Flowset', 'Human Resources', 'text');
            await utilGrid.searchRecord(assignmentData.assignmentMappingName);
            expect(await assignmentConfigConsolePage.getSelectedGridRecordValue('Flowset')).toBe("Human Resources", 'Filter Flowset is missing in column');
            await assignmentConfigConsolePage.addColumns(defaultCaseAssignmentColumns);
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });
});
