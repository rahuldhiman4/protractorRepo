import { browser, protractor, ProtractorExpectedConditions } from "protractor";
import createCasePage from "../../pageobject/case/create-case.po";
import viewCasePage from "../../pageobject/case/view-case.po";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import caseConsolePage from "../../pageobject/case/case-console.po";
import AssignmentConfigConsolePage from "../../pageobject/settings/case-management/assignments-config-console.po";
import AssignmentConfigCreatePage from "../../pageobject/settings/case-management/create-assignments-config.po";
import AssignmentConfigEditPage from "../../pageobject/settings/case-management/edit-assignments-config.po";

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
        let allRequestedCaseColumns: string[] = ["Label"];
        await caseConsolePage.addRequestedCaseGridColumn(allRequestedCaseColumns);
        defaultCaseColumns.push("Label");
        expect(await caseConsolePage.areCaseGridColumnMatches(defaultCaseColumns)).toBeTruthy("Default And new columns added are not matching");
        await caseConsolePage.removeRequestedCaseGridColumn(allRequestedCaseColumns);
        await defaultCaseColumns.splice(defaultCaseColumns.indexOf("Label"),1);
        expect(await caseConsolePage.areCaseGridColumnMatches(defaultCaseColumns)).toBeTruthy("Default And remaining new columns are not matching");
    })

    it('[DRDMV-15168]: Assignment mapping table columns', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', 'Configure Case Assignments - Business Workflows');
        let defaultCaseAssignmentColumns: string[] = ["Assignment Name", "Case Priority", "Company", "Category Tier 1", "Category Tier 2", "Category Tier 3", "Region", "Site", "Support Company", "Support Group", "Default Mapping"];
        expect(await AssignmentConfigConsolePage.areCaseAssignmentGridColumnMatches(defaultCaseAssignmentColumns)).toBeTruthy("Default columns are not matching");
        let allRequestedCaseAssignmentColumns: string[] = ["Label"];
        await AssignmentConfigConsolePage.addRequestedCaseAssignmentGridColumn(allRequestedCaseAssignmentColumns);
        defaultCaseAssignmentColumns.push("Label");
        expect(await AssignmentConfigConsolePage.areCaseAssignmentGridColumnMatches(defaultCaseAssignmentColumns)).toBeTruthy("Default And new columns added are not matching");
        await AssignmentConfigConsolePage.removeRequestedCaseAssignmentGridColumn(allRequestedCaseAssignmentColumns);
        await defaultCaseAssignmentColumns.splice(defaultCaseAssignmentColumns.indexOf("Label"),1);
        expect(await AssignmentConfigConsolePage.areCaseAssignmentGridColumnMatches(defaultCaseAssignmentColumns)).toBeTruthy("Default And remaining new columns are not matching");
    })

    it('[DRDMV-1242]: [Assignment Mapping] Add/Edit Assignment Mapping views (UI verification)', async () => {
        let assignmentFields: string[] = ["Assignment Mapping Name", "Company", "Flowset", "Category Tier 1", "Category Tier 2", "Category Tier 3", "Category Tier 4", "Priority", "Label", "Region", "Site", "Use as Default", "Support Company", "Business Unit", "Department", "Support Group", "Assignee"];
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let assignmentMappingName = "DRDMV-1242 " + randomStr;
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', 'Configure Case Assignments - Business Workflows');
        await AssignmentConfigConsolePage.clickOnCreateAssignmentConfiguration();
        expect (await AssignmentConfigCreatePage.areAllFieldsPresentOnUI(assignmentFields)).toBeTruthy("Expected fields are not matching with actual fields present on Create Assignent UI");
        await AssignmentConfigCreatePage.setAssignmentMapName(assignmentMappingName);
        await AssignmentConfigCreatePage.setCompany("Petramco");
        await AssignmentConfigCreatePage.setSupportCompany("Petramco");
        await AssignmentConfigCreatePage.setSupportGroup("AU Support 1");
        await AssignmentConfigCreatePage.clickonSaveButton();
        await AssignmentConfigConsolePage.searchAndClickOnAssignmentConfig(assignmentMappingName);
        expect (await AssignmentConfigEditPage.areAllFieldsPresentOnUI(assignmentFields)).toBeTruthy("Expected fields are not matching with actual fields present on Edit Assignent UI");
    })

    it('[DRDMV-11999]: [Assignment Mapping] Verify Global Company on Assignment Grid', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let assignmentMappingName = "DRDMV-11999 " + randomStr;
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', 'Configure Case Assignments - Business Workflows');
        await AssignmentConfigConsolePage.clickOnCreateAssignmentConfiguration();
        await AssignmentConfigCreatePage.setAssignmentMapName(assignmentMappingName);
        await AssignmentConfigCreatePage.setCompany("- Global -");
        await AssignmentConfigCreatePage.setSupportCompany("Petramco");
        await AssignmentConfigCreatePage.setSupportGroup("AU Support 1");
        await AssignmentConfigCreatePage.clickonSaveButton();
        await AssignmentConfigConsolePage.searchAssignmentConfig(assignmentMappingName);
        expect (await AssignmentConfigConsolePage.getValueOnAssignmentConfigGrid("Company")).toBe("- Global -");
    })
});
