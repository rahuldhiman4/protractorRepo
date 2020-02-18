import { browser, protractor, ProtractorExpectedConditions } from "protractor";
import apiHelper from '../../api/api.helper';
import caseConsolePage from "../../pageobject/case/case-console.po";
import createCasePage from "../../pageobject/case/create-case.po";
import QuickCasePage from "../../pageobject/case/quick-case.po";
import viewCasePage from "../../pageobject/case/view-case.po";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import AssignmentConfigConsolePage from "../../pageobject/settings/case-management/assignments-config-console.po";
import AssignmentConfigCreatePage from "../../pageobject/settings/case-management/create-assignments-config.po";
import AssignmentConfigEditPage from "../../pageobject/settings/case-management/edit-assignments-config.po";
import utilCommon from '../../utils/util.common';

describe("Create Case", () => {
    const EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    beforeAll(async () => {
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
        await loginPage.login("qkatawazi");
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    afterEach(async () => {
        await browser.refresh();
    });

    //radhiman
    it('[DRDMV-15014]: Verify Case agent can change the Site field once it is populated according to requesters primary location on create case view', async () => {
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester('qtao');
        await createCasePage.selectSite('Berlin');
        await createCasePage.setSummary('DRDMV-15014 summary');
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        expect(await viewCasePage.getCaseSite()).toBe('Berlin');
    })

    //radhiman
    it('[DRDMV-1210]: Case Workspace table columns', async () => {
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester('apavlik');
        await createCasePage.setSummary('DRDMV-1210 summary');
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
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
    }, 90 * 1000)

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
    }, 150 * 1000)

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
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary("DRDMV-12034 Case Summary");
        await createCasePage.setPriority("Low");
        await createCasePage.selectCategoryTier1("Facilities");
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        expect(await viewCasePage.getAssignedGroupText()).toBe("AU Support 2");
    }, 150 * 1000)

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
            await navigationPage.gotCreateCase();
            await createCasePage.selectRequester("gderuno");
            await createCasePage.setSummary("DRDMV-12033 Case Summary");
            await createCasePage.setPriority("Medium");
            await createCasePage.selectCategoryTier1("Projectors");
            await createCasePage.selectCategoryTier2("Repair");
            await createCasePage.clickSaveCaseButton();
            await createCasePage.clickGoToCaseButton();
            expect(await viewCasePage.getAssignedGroupText()).toBe("Psilon Support Group2");
        }
        catch (error) {
            throw error;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 150 * 1000)

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
        await QuickCasePage.selectCaseTemplate(caseTemplateName);
        await QuickCasePage.createCaseButton();
        await QuickCasePage.gotoCaseButton();
        await expect(await viewCasePage.getAssignedGroupText()).toBe("Employee Relations");
        await expect(await viewCasePage.getAssigneeText()).toBe("Qiwei Liu");
    }, 150 * 1000)
});
