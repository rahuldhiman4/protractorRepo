import { cloneDeep } from 'lodash';
import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import { SAMPLE_MENU_ITEM } from '../../data/ui/ticketing/menu.item.ui';
import caseConsolePo from '../../pageobject/case/case-console.po';
import editCasePo from '../../pageobject/case/edit-case.po';
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import viewCasePo from '../../pageobject/case/view-case.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import assignmentConfigConsolePo from '../../pageobject/settings/case-management/assignments-config-console.po';
import caseTemplateConsolePO from '../../pageobject/settings/case-management/console-casetemplate.po';
import readAccessConsolePo from '../../pageobject/settings/case-management/read-access-console.po';
import taskTemplateConsolePO from '../../pageobject/settings/task-management/console-tasktemplate.po';
import { BWF_BASE_URL, BWF_PAGE_TITLES } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from "../../utils/utility.grid";

describe('Case Console', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qfeng');
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    it('[5356]: [Case Console] - Sorting based on Source of case', async () => {
        let caseData = {
            "Description": "5356 Desc",
            "Requester": "qtao",
            "Summary": "5356-Summary",
            "Assigned Company": "Petramco",
            "Business Unit": "United States Support",
            "Support Group": "US Support 1",
            "Origin": "External"
        }

        await apiHelper.apiLogin('qfeng');
        for (let i = 0; i < 3; i++) {
            await apiHelper.createCase(caseData);
        }
        caseData.Origin = "Email";
        for (let i = 0; i < 3; i++) {
            await apiHelper.createCase(caseData);
        }
        caseData.Origin = "Agent";
        for (let i = 0; i < 3; i++) {
            await apiHelper.createCase(caseData);
        }

        await utilityGrid.clearFilter();
        await utilityGrid.addFilter('Summary', '5356-Summary', 'text');
        await utilityGrid.addGridColumn(['Source']);
        expect(await utilityGrid.isGridColumnSorted('Source', 'ascending')).toBeTruthy('Column is not sorted in ascending order');
        expect(await utilityGrid.isGridColumnSorted('Source', 'descending')).toBeTruthy('Column is not sorted in descending order');
        await utilityGrid.removeGridColumn(['Source']);
    });

    describe('[4424]: Verify Category Tier 4 and Label column is visible on console', () => {
        let randomStr: string = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let label;
        let caseCategoryTier4Str = 'Case Category Tier 4';
        let labelStr = 'Label';
        let taskCategoryTier4Str = 'Task Category Tier 4';
        let categoryTier4Str = 'Category Tier 4';
        let caseTemplateData, taskTemplateData, assignmentMappingData, readAccessMappingData;
        beforeAll(async () => {
            let menuItemData = cloneDeep(SAMPLE_MENU_ITEM);
            label = menuItemData.menuItemName + randomStr;
            menuItemData.menuItemName = label;
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createNewMenuItem(menuItemData);

            caseTemplateData = {
                "templateName": 'caseTemplateName' + randomStr,
                "templateSummary": 'caseTemplateSummary' + randomStr,
                "categoryTier1": "Employee Relations",
                "categoryTier2": "Compensation",
                "categoryTier3": "Bonus",
                "categoryTier4": "Retention Bonus",
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

            taskTemplateData = {
                "templateName": 'task template name ' + randomStr,
                "templateSummary": `task template summary ${randomStr}`,
                "templateStatus": "Active",
                "category1": "Employee Relations",
                "category2": "Compensation",
                "category3": "Bonus",
                "category4": "Retention Bonus",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3",
                "label": label
            }

            assignmentMappingData = {
                "assignmentMappingName": "Assignment mapping name" + randomStr,
                "company": "Petramco",
                "supportCompany": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qfeng",
                "categoryTier1": "Employee Relations",
                "categoryTier2": "Compensation",
                "categoryTier3": "Bonus",
                "categoryTier4": "Retention Bonus",
                "label": label
            }

            readAccessMappingData = {
                "configName": 'Read Access Mapping Name' + randomStr,
                "assignedCompany": 'Petramco',
                "businessUnit": 'HR Support',
                "supportGroup": 'Compensation and Benefits',
                "company": 'Petramco',
                "category1": "Employee Relations",
                "category2": "Compensation",
                "category3": "Bonus",
                "category4": "Retention Bonus",
                "label": label
            }

            await apiHelper.createCaseTemplate(caseTemplateData);
            await apiHelper.createManualTaskTemplate(taskTemplateData);
            await apiHelper.createCaseAssignmentMapping(assignmentMappingData);
            await apiHelper.createReadAccessMapping(readAccessMappingData);
        });

        it('[4424]: Verify Category Tier 4 and Label column is visible on console', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await caseTemplateConsolePO.addColumnOnGrid([labelStr, caseCategoryTier4Str]);
            await utilityGrid.searchRecordWithoutClearFilter(caseTemplateData.templateName);
            expect(await caseTemplateConsolePO.getFirstRecordValue(caseCategoryTier4Str)).toContain(caseTemplateData.categoryTier4);
            expect(await caseTemplateConsolePO.getFirstRecordValue(labelStr)).toContain(label);
            await caseTemplateConsolePO.removeColumnFromGrid([labelStr, caseCategoryTier4Str]);

            await navigationPage.gotoCaseConsole();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', BWF_PAGE_TITLES.TASK_MANAGEMENT.TEMPLATES);
            await taskTemplateConsolePO.addColumn([labelStr, taskCategoryTier4Str]);
            await utilityGrid.searchRecordWithoutClearFilter('task template name ' + randomStr);
            expect(await taskTemplateConsolePO.getFirstRecordValue(taskCategoryTier4Str)).toContain(taskTemplateData.category4);
            expect(await taskTemplateConsolePO.getFirstRecordValue(labelStr)).toContain(label);
            await taskTemplateConsolePO.removeColumn([labelStr, taskCategoryTier4Str]);

            await navigationPage.gotoCaseConsole();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', BWF_PAGE_TITLES.CASE_MANAGEMENT.ASSIGNMENTS);
            await assignmentConfigConsolePo.addColumns([labelStr, categoryTier4Str]);
            await utilityGrid.searchRecordWithoutClearFilter('Assignment mapping name' + randomStr);
            expect(await assignmentConfigConsolePo.getValueOnAssignmentConfigGrid(categoryTier4Str)).toContain(assignmentMappingData.categoryTier4);
            expect(await assignmentConfigConsolePo.getValueOnAssignmentConfigGrid(labelStr)).toContain(label);
            await assignmentConfigConsolePo.removeColumns([labelStr, categoryTier4Str]);

            await navigationPage.gotoCaseConsole();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Read Access', BWF_PAGE_TITLES.CASE_MANAGEMENT.READ_ACCESS);
            await readAccessConsolePo.addColumns([labelStr, categoryTier4Str]);
            await utilityGrid.searchRecordWithoutClearFilter('Read Access Mapping Name' + randomStr);
            expect(await readAccessConsolePo.getValueOnReadAccessConfigGrid(categoryTier4Str)).toContain(readAccessMappingData.category4);
            // expect(await readAccessConsolePo.getValueOnReadAccessConfigGrid(labelStr)).toContain(label); // removed Label column intentionally (as desinged - DRDMV-25208)
            await readAccessConsolePo.removeColumns([categoryTier4Str]);
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qfeng');
        });
    });

    describe('[5531]:[Case Workspace] Cases search using filters', async () => {
        let id, label, modifiedDateFormate, month, caseData1, newCase1, caseTemplateData1, caseData2, newCase2, caseTemplateData2, randomStr: string = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let arr1: string[] = ["Assignee Login Name", "Company", "Case Site", "Modified By", "ID"];
        let defaultCaseColumns: string[] = ["Assigned Group", "Assignee", "Category Tier 1", "Category Tier 2", "Category Tier 3", "Modified Date", "Priority", "Request ID", "Requester", "SLM Status", "Status", "Summary"];
        beforeAll(async () => {
            caseData1 = {
                "Requester": "qdu",
                "Summary": "CaseFilter1" + randomStr,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi",
            }
            caseTemplateData1 = {
                "templateName": `${randomStr}1Casetemplate`,
                "templateStatus": "Active",
                "templateSummary": `${randomStr}Summary`,
                "caseStatus": "New",
                "casePriority": "Low",
                "categoryTier1": "Employee Relations",
                "categoryTier2": "Compensation",
                "categoryTier3": "Bonus",
                "company": "Petramco",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
            }
            caseTemplateData2 = {
                "templateName": `${randomStr}2Casetemplate`,
                "templateStatus": "Active",
                "templateSummary": `${randomStr}2Summary`,
                "caseStatus": "New",
                "casePriority": "High",
                "categoryTier1": "Payroll",
                "categoryTier2": "Finance",
                "categoryTier3": "Cost Centers",
                "company": "Petramco",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 1",
                "assignee": "qtao",
            }
            await apiHelper.apiLogin('qkatawazi');
            newCase1 = await apiHelper.createCase(caseData1);
            await apiHelper.createCaseTemplate(caseTemplateData1);
            caseData1.Requester = "apavlik",
                caseData1.Summary = "CaseFilter2" + randomStr,
                newCase2 = await apiHelper.createCase(caseData1);
            await apiHelper.createCaseTemplate(caseTemplateData2);
            month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            let menuItemData = cloneDeep(SAMPLE_MENU_ITEM);
            label = "CaseLabel" + randomStr;
            menuItemData.menuItemName = label;
            await apiHelper.createNewMenuItem(menuItemData);
            id = newCase1.id;
        });
        it('[5531]:[Case Workspace] Cases search using filters 1', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(newCase1.displayId);
            await viewCasePo.clickEditCaseButton(); 

            await editCasePo.clickOnSelectCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateData1.templateName);
            await editCasePo.updateCaseSite('Austin');
            await editCasePo.updateSiteChangeReason('UpdatedSite' + randomStr);
            await editCasePo.updateLabel(label);
            await editCasePo.setResolutionDescription('Case Resolution Description');
            await editCasePo.clickSaveCase();
            let modifiedDate = new Date();
            let monthValue: string = month[modifiedDate.getMonth()];
            let modifiedMonthValue = monthValue.substring(0, 3);
            let time = modifiedDate.toLocaleTimeString();
            let diffTime = time.split(" ");
            let newTime = diffTime[0].split(":");
            let exactTime = newTime[0] + ":" + newTime[1] + " " + diffTime[1];
            modifiedDateFormate = modifiedMonthValue + " " + modifiedDate.getDate() + ", " + modifiedDate.getFullYear() + " " + exactTime;
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(newCase2.displayId);
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnSelectCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateData2.templateName);
            await editCasePo.setResolutionDescription('Case Resolution Description');
            await editCasePo.updateCaseSite('Atlanta');
            await editCasePo.updateSiteChangeReason('UpdatedSite2' + randomStr);
            await editCasePo.clickSaveCase();
        });
        it('[5531]:[Case Workspace] Cases search using filters 2', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.addColumns(defaultCaseColumns);
            await utilityGrid.searchRecord(newCase2.displayId);
            // await utilityGrid.addFilter('SLM Status', 'Within Time Limit', 'checkbox'); // SLM not configures so commented it
            await utilityGrid.addFilter('SLM Status', 'Service Targets Not Attached', 'checkbox');
            expect(await utilityGrid.isGridRecordPresent(newCase2.displayId)).toBeTruthy('Record is not filtered on the basis of SLM Status');
            await utilityGrid.searchRecord(newCase1.displayId);
            await utilityGrid.addFilter('Priority', 'Low', 'checkbox');
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeTruthy('Record1 is not filtered on the basis of Priority');
            expect(await utilityGrid.isGridRecordPresent(newCase2.displayId)).toBeFalsy('Record2 is not filtered on the basis of Priority');
            await utilityGrid.searchRecord(newCase1.displayId);
            await utilityGrid.addFilter('Status', 'Assigned', 'text');
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeTruthy('Record is not filtered on the basis of Status');
            await utilityGrid.searchRecord(newCase2.displayId);
            await utilityGrid.addFilter('Summary', "CaseFilter2" + randomStr, 'text');
            expect(await utilityGrid.isGridRecordPresent(newCase2.displayId)).toBeTruthy('Record1 is not filtered on the basis of Summary');
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeFalsy('Record2 is not filtered on the basis of Summary');
        });
        it('[5531]:[Case Workspace] Cases search using filters 3', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchRecord(newCase1.displayId);
            await utilityGrid.addFilter('Category Tier 1', "Employee Relations", 'text');
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeTruthy('Record1 is not filtered on the basis of Category Tier 1');
            expect(await utilityGrid.isGridRecordPresent(newCase2.displayId)).toBeFalsy('Record2 is not filtered on the basis of Category Tier 1');
            await utilityGrid.searchRecord(newCase2.displayId);
            await utilityGrid.addFilter('Category Tier 2', "Finance", 'text');
            expect(await utilityGrid.isGridRecordPresent(newCase2.displayId)).toBeTruthy('Record1 is not filtered on the basis of Category Tier 2');
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeFalsy('Record2 is not filtered on the basis of Category Tier 2');
            await utilityGrid.searchRecord(newCase1.displayId);
            await utilityGrid.addFilter('Category Tier 3', "Bonus", 'text');
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeTruthy('Record1 is not filtered on the basis of Category Tier 3');
            expect(await utilityGrid.isGridRecordPresent(newCase2.displayId)).toBeFalsy('Record2 is not filtered on the basis of Category Tier 3');
        });
        it('[5531]:[Case Workspace] Cases search using filters 4', async () => {
            await utilityGrid.searchRecord(newCase1.displayId);
            await utilityGrid.addFilter('Case ID', newCase1.displayId, 'text');
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeTruthy('Record1 is not filtered on the basis of Case Id');
            expect(await utilityGrid.isGridRecordPresent(newCase2.displayId)).toBeFalsy('Record2 is not filtered on the basis of Case Id');
            await utilityGrid.searchRecord(newCase2.displayId);
            await utilityGrid.addFilter('Assigned Group', "US Support 1", 'text');
            expect(await utilityGrid.isGridRecordPresent(newCase2.displayId)).toBeTruthy('Record1 is not filtered on the basis of Assigned Group');
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeFalsy('Record2 is not filtered on the basis of Assigned Group');
        });
        it('[5531]:[Case Workspace] Cases search using filters 4', async () => {
            await utilityGrid.searchRecord(newCase1.displayId);
            await utilityGrid.addFilter('Requester', 'Qiang Du', 'text');
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeTruthy('Record1 is not filtered on the basis of Requester');
            expect(await utilityGrid.isGridRecordPresent(newCase2.displayId)).toBeFalsy('Record2 is not filtered on the basis of Requester');
            await utilityGrid.searchRecord(newCase1.displayId);
            await utilityGrid.addFilter('Assignee', 'Qadim Katawazi', 'text');
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeTruthy('Record1 is not filtered on the basis of Assignee');
            expect(await utilityGrid.isGridRecordPresent(newCase2.displayId)).toBeFalsy('Record2 is not filtered on the basis of Assignee');
            await utilityGrid.clearFilter();
            await utilityGrid.typeInFilterExperssion("Modified Date:" + modifiedDateFormate);
            await utilityGrid.searchRecordWithoutClearFilter(newCase1.displayId);
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeTruthy('Record is not filtered on the basis of Modified date');
        });

        it('[5531]:[Case Workspace] Cases search using filters 5', async () => {
            await caseConsolePo.removeColumns(defaultCaseColumns);
            await caseConsolePo.addColumns(arr1);
            await utilityGrid.searchRecord(newCase1.displayId);
            await utilityGrid.addFilter('Company', 'Petramco', 'text');
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeTruthy('Record is not filtered on the basis of Company');
            await utilityGrid.searchRecord(newCase1.displayId);
            await utilityGrid.addFilter('Region', 'Americas', 'text');
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeTruthy('Record is not filtered on the basis of Region');
        });
        it('[5531]:[Case Workspace] Cases search using filters 5', async () => {
            await utilityGrid.searchRecord(newCase1.displayId);
            await utilityGrid.addFilter('Case Site', 'Austin', 'text');
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeTruthy('Record1 is not filtered on the basis of Case Site');
            expect(await utilityGrid.isGridRecordPresent(newCase2.displayId)).toBeFalsy('Record2 is not filtered on the basis of Case Site');
            await utilityGrid.searchRecord(newCase1.displayId);
            await utilityGrid.addFilter('Modified By', 'qkatawazi', 'text');
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeTruthy('Record is not filtered on the basis of Modified By');
            await utilityGrid.searchRecord(newCase1.displayId);
            await utilityGrid.addFilter('Assignee Login Name', 'qkatawazi', 'text');
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeTruthy('Record1 is not filtered on the basis of Assignee Login Name');
            expect(await utilityGrid.isGridRecordPresent(newCase2.displayId)).toBeFalsy('Record2 is not filtered on the basis of Assignee Login Name');
        });
        it('[5531]:[Case Workspace] Cases search using filters 6', async () => {
            await utilityGrid.searchRecord(newCase1.displayId);
            // await utilityGrid.addFilter('Label', "CaseLabel" + randomStr, 'text'); // removed Label column intentionally (as desinged - DRDMV-25208)
            // expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeTruthy('Record1 is not filtered on the basis of Label');
            // expect(await utilityGrid.isGridRecordPresent(newCase2.displayId)).toBeFalsy('Record2 is not filtered on the basis of Label');
            await utilityGrid.searchRecord(newCase1.displayId);
            await utilityGrid.addFilter("ID", id, "text");
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeTruthy('Record1 is not filtered on the basis of ID');
            expect(await utilityGrid.isGridRecordPresent(newCase2.displayId)).toBeFalsy('Record2 is not filtered on the basis of ID');
            await utilityGrid.searchRecord(newCase1.displayId);
            await utilityGrid.addFilter('Source', "External", 'text');
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeTruthy('Record is not filtered on the basis of Source');
            await utilityGrid.searchRecord(newCase1.displayId);
            await utilityGrid.addFilter('Status Value', "2000", 'text');
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeTruthy('Record is not filtered on the basis of Status Value');
            await caseConsolePo.removeColumns(arr1);
            await caseConsolePo.addColumns(defaultCaseColumns);
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });
});