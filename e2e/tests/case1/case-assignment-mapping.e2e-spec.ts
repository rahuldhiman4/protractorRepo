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
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import editAssignmentsConfigPo from '../../pageobject/settings/case-management/edit-assignments-config.po';
import { SAMPLE_MENU_ITEM } from '../../data/ui/ticketing/menu.item.ui';
import { cloneDeep } from 'lodash';

describe("Create Case Assignment Mapping", () => {
    const businessDataFile = require('../../data/ui/foundation/businessUnit.ui.json');
    const departmentDataFile = require('../../data/ui/foundation/department.ui.json');
    const supportGrpDataFile = require('../../data/ui/foundation/supportGroup.ui.json');
    const personDataFile = require('../../data/ui/foundation/person.ui.json');
    let categName1, categName2, categName3, categName4;
    let userData = undefined, userData1 = undefined;
    const userId1 = "idphylum4@petramco.com";
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login("qkatawazi");
        await foundationData("Petramco");
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
        await browser.sleep(5000); // timeout requried to reflect data on UI
    }

    async function foundationData2(company: string, businessUnit: string, department: string, supportGroup: string, person: string) {
        await apiHelper.apiLogin('tadmin');
        let businessData = businessDataFile[businessUnit];
        let departmentData = departmentDataFile[department];
        let suppGrpData = supportGrpDataFile[supportGroup];
        let personData = personDataFile[person];
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

    async function createCategoryAssociation() {
        categName1 = 'DemoCateg1';
        categName2 = 'DemoCateg2';
        categName3 = 'DemoCateg3';
        categName4 = 'DemoCateg4';
        await apiHelper.apiLogin('tadmin');
        await apiHelper.createOperationalCategory(categName1);
        await apiHelper.createOperationalCategory(categName2);
        await apiHelper.createOperationalCategory(categName3);
        await apiHelper.createOperationalCategory(categName4);
        await apiHelper.associateCategoryToOrganization(categName1, 'Petramco');
        await apiHelper.associateCategoryToOrganization(categName1, 'Phylum');
        await apiHelper.associateCategoryToCategory(categName1, categName2);
        await apiHelper.associateCategoryToCategory(categName2, categName3);
        await apiHelper.associateCategoryToCategory(categName3, categName4);
        await apiHelper.associateCategoryToOrganization(categName1, '- Global -');
    }

    async function createNewUsers() {
        userData = {
            "firstName": "Multiple",
            "lastName": "Company",
            "userId": "nosg",
            "emailId": "nosg@petramco.com",
            "userPermission": ["Case Agent","Foundation Read","Document Manager","Case Business Analyst"]
        }
        userData1 = {
            "firstName": "Petramco",
            "lastName": "SGUser1",
            "userId": "13550User1",
            "userPermission": ["Case Business Analyst"]
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
        let allCaseColumns: string[] = ["Assigned Group", "Assignee","Assignee Login Name","Case ID","Case Site","Category Tier 1","Category Tier 2","Category Tier 3","Company","Created Date","ID","Label","Modified By", "Modified Date", "Priority","Region", "Request ID",  "Requester", "SLM Status","Source", "Status","Status Value","Summary", "Target Date"];
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
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteReadAccessOrAssignmentMapping(assignmentMappingName);
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

    describe('[DRDMV-12080]: Verify Company, Business Unit , Department and Support group selection hierarchy in Case  Access.', async () => {
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
        it('[DRDMV-12080]:Verify Company, Business Unit , Department and Support group selection hierarchy in Case  Access.', async () => {
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
        let assignmentData, randomStr: string = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');

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

    describe('[DRDMV-15181]:[Permissions] Location based assignment with multiple companies', async () => {
        let randomStr: string = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let assignmentMappingName = "DRDMV-15181 " + randomStr;
        beforeAll(async () => {
            await createNewUsers();
            await createCategoryAssociation();
        });
        it('[DRDMV-15181]:[Permissions] Location based assignment with multiple companies', async () => {
            await navigationPage.signOut();
            await loginPage.login(userData.emailId, 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', 'Configure Case Assignments - Business Workflows');
            await assignmentConfigConsolePage.clickOnCreateAssignmentConfiguration();
            await assignmentConfigCreatePage.setAssignmentMapName(assignmentMappingName);
            await assignmentConfigCreatePage.setCategoryTier1(categName1);
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
            await assignmentConfigCreatePage.setCategoryTier1(categName1);
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
            await createCasePage.selectCategoryTier1(categName1);
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getAssignedGroupText()).toBe('Psilon Support Group1');
            expect(await viewCasePo.getAssigneeText()).toBe('Glit Deruno');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.associatePersonToCompany(userData1.userId, "Phylum");
        });
        it('[DRDMV-15181]:[Permissions] Location based assignment with multiple companies', async () => {
            await navigationPage.signOut();
            await loginPage.login('13550User1@petramco.com', 'Password_1234');
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary("DRDMV-8968 Case Summary1");
            await createCasePage.setPriority('Critical');
            await createCasePage.selectSite('Canberra');
            await createCasePage.selectCategoryTier1(categName1);
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

    describe('[DRDMV-15170]: Assignment mapping search using filters', async () => {
        let assignmentMapping1, id, label, assignmentData1, assignmentData2, randomStr: string = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let arr1: string[] = ["Department", "Flowset", "Business Unit", "Label", "Category Tier 4", "ID"];
        let defaultCaseAssignmentColumns: string[] = ["Case Priority", "Company", "Category Tier 1", "Category Tier 2", "Category Tier 3", "Region", "Site", "Support Company", "Support Group", "Default Mapping"];
        let businessData,departmentData,suppGrpData;
        beforeAll(async () => {
            await foundationData2('Phylum', 'BusinessUnitDataPhylum1', 'DepartmentDataPhylum1', 'SuppGrpDataPhylum1', 'PhylumCaseAgent4');
            businessData = businessDataFile['BusinessUnitDataPhylum1'];
            departmentData = departmentDataFile['DepartmentDataPhylum1'];
            suppGrpData = supportGrpDataFile['SuppGrpDataPhylum1'];
            await createNewUsers();
            await createCategoryAssociation();
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
                "categoryTier1": categName1,
                "categoryTier2": categName2,
                "categoryTier3": categName3,
                "categoryTier4": categName4,
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
                "categoryTier1": "Accounts Payable",
                "categoryTier2": "Invoices",
                "categoryTier3": "Payment",
                "priority": "High",
                "region": "North America",
                "site": "Phylum Site2",
                "label": label
            }
            await apiHelper.apiLoginWithCredential(userId1, "Password_1234");
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
            await assignmentConfigEditPage.setDefaultToggleButton(true);
            await assignmentConfigEditPage.clickonSaveButton();
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
            expect(await assignmentConfigConsolePage.getSelectedGridRecordValue('Default Mapping')).toBe("True", 'Filter Default Mapping is missing in column');
        });
        it('[DRDMV-15170]: Assignment mapping search using filters', async () => {
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.addFilter('Assignment Name', assignmentData2.assignmentMappingName, 'text');
            await utilGrid.searchRecord(assignmentData2.assignmentMappingName);
            expect(await utilGrid.isGridRecordPresent(assignmentData1.assignmentMappingName)).toBeFalsy(assignmentData1.assignmentMappingName);
            expect(await utilGrid.isGridRecordPresent(assignmentData2.assignmentMappingName)).toBeTruthy(assignmentData2.assignmentMappingName);
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.addFilter('Category Tier 1', categName1, 'text');
            await utilGrid.searchRecord(assignmentData1.assignmentMappingName);
            expect(await utilGrid.isGridRecordPresent(assignmentData1.assignmentMappingName)).toBeTruthy(assignmentData1.assignmentMappingName);
            expect(await utilGrid.isGridRecordPresent(assignmentData2.assignmentMappingName)).toBeFalsy(assignmentData2.assignmentMappingName);
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.addFilter('Category Tier 2', 'Invoices', 'text');
            await utilGrid.searchRecord(assignmentData2.assignmentMappingName);
            expect(await utilGrid.isGridRecordPresent(assignmentData1.assignmentMappingName)).toBeFalsy(assignmentData1.assignmentMappingName);
            expect(await utilGrid.isGridRecordPresent(assignmentData2.assignmentMappingName)).toBeTruthy(assignmentData2.assignmentMappingName);
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.addFilter('Category Tier 3', categName3, 'text');
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
            expect(await assignmentConfigConsolePage.getSelectedGridRecordValue('Label')).toBe("MappingLabel" + randomStr, 'Filter Flowset is missing in column');
            await utilGrid.clearFilter();
            await utilGrid.addFilter("ID", id, "text");
            await utilGrid.searchRecord(assignmentData1.assignmentMappingName);
            expect(await utilGrid.isGridRecordPresent(id)).toBeTruthy(id + ' not present');
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.addFilter('Category Tier 4', categName4, 'text');
            await utilGrid.searchRecord(assignmentData1.assignmentMappingName);
            expect(await utilGrid.isGridRecordPresent(assignmentData1.assignmentMappingName)).toBeTruthy(assignmentData1.assignmentMappingName);
            assignmentData1.assignmentMappingName = randomStr + "3DRDMV8968";
            assignmentData1.flowset = "Facilities Management";
            await apiHelper.createCaseAssignmentMapping(assignmentData1);
            await assignmentConfigConsolePage.clearFilter();
            await assignmentConfigConsolePage.addFilter('Flowset', 'Facilities Management', 'text');
            await utilGrid.searchRecord(randomStr + "3DRDMV8968");
            expect(await assignmentConfigConsolePage.getSelectedGridRecordValue('Flowset')).toBe("Facilities Management", 'Filter Flowset is missing in column');
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

    describe('[DRDMV-8968]:[Assignment Mapping] Categories partial match', () => {
        let randomStr: string = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
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
            await assignmentConfigCreatePage.setCategoryTier1("Facilities");
            await assignmentConfigCreatePage.setSupportCompany("Phylum");
            await assignmentConfigCreatePage.setBusinessUnit('Phylum Support Org1');
            await assignmentConfigCreatePage.setSupportGroup("Phylum Support Group1");
            await assignmentConfigCreatePage.setAssignee("phylumfn1 phylumln1");
            await assignmentConfigCreatePage.clickonSaveButton();     
            await utilCommon.closePopUpMessage();      
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("Anna");
            await createCasePage.setSummary("DRDMV-8968 Case Summary1");
            await createCasePage.setPriority("Critical");
            await createCasePage.selectCategoryTier1("Facilities");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getAssignedGroupText()).toBe("Phylum Support Group1");
            expect(await viewCasePo.getAssigneeText()).toBe("phylumfn1 phylumln1");
        });
        it('[DRDMV-8968]:[Assignment Mapping] Categories partial match', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', 'Configure Case Assignments - Business Workflows');
            await assignmentConfigConsolePage.searchAndClickOnAssignmentConfig("1DRDMV8968 " + randomStr);
            await editAssignmentsConfigPo.setCategoryTier2("Conference Room");
            await editAssignmentsConfigPo.clickonSaveButton(); 
            await utilCommon.closePopUpMessage();      
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("Anna");
            await createCasePage.setSummary("DRDMV-8968 Case Summary2");
            await createCasePage.setPriority("Critical");
            await createCasePage.selectCategoryTier1("Facilities");
            await createCasePage.selectCategoryTier2("Conference Room");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getAssignedGroupText()).toBe("Phylum Support Group1");
            expect(await viewCasePo.getAssigneeText()).toBe("phylumfn1 phylumln1");
        });
        it('[DRDMV-8968]:[Assignment Mapping] Categories partial match', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', 'Configure Case Assignments - Business Workflows');
            await assignmentConfigConsolePage.searchAndClickOnAssignmentConfig("1DRDMV8968 " + randomStr);
            await editAssignmentsConfigPo.setCategoryTier3("Furniture");
            await editAssignmentsConfigPo.clickonSaveButton(); 
            await utilCommon.closePopUpMessage();                          
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("Anna");
            await createCasePage.setSummary("DRDMV-8968 Case Summary3");
            await createCasePage.setPriority("Critical");
            await createCasePage.selectCategoryTier1("Facilities");
            await createCasePage.selectCategoryTier2("Conference Room");
            await createCasePage.selectCategoryTier3("Furniture");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getAssignedGroupText()).toBe("Phylum Support Group1");
            expect(await viewCasePo.getAssigneeText()).toBe("phylumfn1 phylumln1");
        });
        afterAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteReadAccessOrAssignmentMapping("1DRDMV8968 " + randomStr);
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[DRDMV-9103]:[Assignment Mapping] Partially matching Assignment mapping with Flowset', () => {
        let assignmentData, caseTemplateData, randomStr: string = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            await createNewUsers();
            caseTemplateData = {
                "templateName": `${randomStr}Casetemplate`,
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
            await apiHelper.apiLoginWithCredential(userId1, "Password_1234");
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
            await assignmentConfigCreatePage.setFlowset("Facilities Management");
            await assignmentConfigCreatePage.setCategoryTier1("Facilities");
            await assignmentConfigCreatePage.setCategoryTier2("Conference Room");
            await assignmentConfigCreatePage.setSupportCompany("Phylum");
            await assignmentConfigCreatePage.setBusinessUnit('Phylum Support Org1');
            await assignmentConfigCreatePage.setSupportGroup("Phylum Support Group1");
            await assignmentConfigCreatePage.setAssignee("phylumfn1 phylumln1");
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
            await editCasetemplatePo.changeFlowsetValue('Facilities Management');
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
            expect(await viewCasePo.getAssignedGroupText()).toBe("Phylum Support Group1");
            expect(await viewCasePo.getAssigneeText()).toBe('phylumfn1 phylumln1');
        });
        afterAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteReadAccessOrAssignmentMapping("1DRDMV8968 " + randomStr);
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[DRDMV-1206,DRDMV-1208]:[Assignment Mapping] Applying Assignment Mappings to cases with partial match', () => {
        let assignmentData, caseTemplateData, caseTemplateData1, randomStr: string = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let businessData1, businessData2, businessData3, businessData4, businessData5, businessData6;
        let departmentData1, departmentData2, departmentData3, departmentData4, departmentData5, departmentData6;
        let suppGrpData1, suppGrpData2, suppGrpData3, suppGrpData4, suppGrpData5, suppGrpData6;
        beforeAll(async () => {
            await createCategoryAssociation();
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
            await apiHelper.apiLoginWithCredential(userId1, "Password_1234");
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
            await assignmentConfigEditPage.setDefaultToggleButton(true);
            await assignmentConfigEditPage.clickonSaveButton();
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
            assignmentData.flowset = "Facilities Management";
            await apiHelper.createCaseAssignmentMapping(assignmentData);
            assignmentData.assignmentMappingName = randomStr + '3DRDMV1206';
            assignmentData.categoryTier1 = "Facilities";
            assignmentData.categoryTier2 = "Conference Room";
            assignmentData.flowset = "Facilities Management";
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
            await editCasetemplatePo.changeFlowsetValue('Facilities Management');
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
            await editCasetemplatePo.changeFlowsetValue('Facilities Management');
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
            await assignmentConfigEditPage.setDefaultToggleButton(true);
            await assignmentConfigEditPage.clickonSaveButton();
            expect(await utilCommon.isPopUpMessagePresent('ERROR (10000): Only one default record is allowed for a company. Please change the default flag and save the record.')).toBeTruthy('Message Not Present');
            await assignmentConfigEditPage.clickOnCancelButton();
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
            await createCasePage.selectCategoryTier1(categName1);
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
