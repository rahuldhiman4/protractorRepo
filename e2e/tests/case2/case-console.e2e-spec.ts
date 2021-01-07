import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import assignmentConfigConsolePo from '../../pageobject/settings/case-management/assignments-config-console.po';
import caseTemplateConsolePO from '../../pageobject/settings/case-management/console-casetemplate.po';
import readAccessConsolePo from '../../pageobject/settings/case-management/read-access-console.po';
import taskTemplateConsolePO from '../../pageobject/settings/task-management/console-tasktemplate.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilGrid from '../../utils/util.grid';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from "../../utils/utility.grid";
import viewCasePo from '../../pageobject/case/view-case.po';
import editCasePo from '../../pageobject/case/edit-case.po';
import caseConsolePo from '../../pageobject/case/case-console.po';
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import { SAMPLE_MENU_ITEM } from '../../data/ui/ticketing/menu.item.ui';
import { cloneDeep } from 'lodash';

describe('Case Console', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qfeng');
        await apiHelper.apiLogin('tadmin');
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
        expect(await utilityGrid.isGridColumnSorted('Source', 'asc')).toBeTruthy('Column is not sorted in ascending order');
        expect(await utilityGrid.isGridColumnSorted('Source', 'desc')).toBeTruthy('Column is not sorted in descending order');
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
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await caseTemplateConsolePO.addColumnOnGrid([labelStr, caseCategoryTier4Str]);
            await utilGrid.searchOnGridConsole(caseTemplateData.templateName);
            expect(await caseTemplateConsolePO.getFirstRecordValue(caseCategoryTier4Str)).toContain(caseTemplateData.categoryTier4);
            expect(await caseTemplateConsolePO.getFirstRecordValue(labelStr)).toContain(label);
            await caseTemplateConsolePO.removeColumnFromGrid([labelStr, caseCategoryTier4Str]);

            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await taskTemplateConsolePO.addColumn([labelStr, taskCategoryTier4Str]);
            await utilGrid.searchOnGridConsole('task template name ' + randomStr);
            expect(await taskTemplateConsolePO.getFirstRecordValue(taskCategoryTier4Str)).toContain(taskTemplateData.category4);
            expect(await taskTemplateConsolePO.getFirstRecordValue(labelStr)).toContain(label);
            await taskTemplateConsolePO.removeColumn([labelStr, taskCategoryTier4Str]);

            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', 'Configure Case Assignments - Business Workflows');
            await assignmentConfigConsolePo.addColumns([labelStr, categoryTier4Str]);
            await utilGrid.searchOnGridConsole('Assignment mapping name' + randomStr);
            expect(await assignmentConfigConsolePo.getValueOnAssignmentConfigGrid(categoryTier4Str)).toContain(assignmentMappingData.categoryTier4);
            expect(await assignmentConfigConsolePo.getValueOnAssignmentConfigGrid(labelStr)).toContain(label);
            await assignmentConfigConsolePo.removeColumns([labelStr, categoryTier4Str]);

            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Read Access', 'Case Read Access Configuration - Business Workflows');
            await readAccessConsolePo.addColumns([labelStr, categoryTier4Str]);
            await utilGrid.searchOnGridConsole('Read Access Mapping Name' + randomStr);
            expect(await readAccessConsolePo.getValueOnReadAccessConfigGrid(categoryTier4Str)).toContain(readAccessMappingData.category4);
            expect(await readAccessConsolePo.getValueOnReadAccessConfigGrid(labelStr)).toContain(label);
            await readAccessConsolePo.removeColumns([labelStr, categoryTier4Str]);
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qfeng');
        });
    });

    describe('[5531]:[Case Workspace] Cases search using filters', async () => {
        let id, label, modifiedDateFormate, month, caseData1, newCase1, caseTemplateData1, caseData2, newCase2, caseTemplateData2, randomStr: string = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let arr1: string[] = ["Assignee Login Name", "Company", "Case Site", "Modified By", "Label", "ID"];
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
            caseData1.Summary =  "CaseFilter2" + randomStr,
            newCase2 = await apiHelper.createCase(caseData1);
            await apiHelper.createCaseTemplate(caseTemplateData2);
            month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            let menuItemData = cloneDeep(SAMPLE_MENU_ITEM);
            label = "CaseLabel" + randomStr;
            menuItemData.menuItemName = label;
            await apiHelper.createNewMenuItem(menuItemData);
            id = newCase1.id;
        });
        it('[5531]:[Case Workspace] Cases search using filters', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(newCase1.displayId);
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnSelectCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateData1.templateName);
            await editCasePo.setResolutionDescription('Case Resolution Description');
            await editCasePo.updateCaseSite('Austin');
            await editCasePo.updateSiteChangeReason('UpdatedSite' + randomStr);
            await editCasePo.updateLabel(label);
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
        it('[5531]:[Case Workspace] Cases search using filters', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.addColumns(defaultCaseColumns);
            await utilityGrid.searchRecord(newCase2.displayId);
            await utilityGrid.addFilter('SLM Status', 'Within Time Limit', 'checkbox');
            expect(await utilityGrid.isGridRecordPresent(newCase2.displayId)).toBeTruthy(newCase2.displayId);
            await utilityGrid.searchRecord(newCase1.displayId);
            await utilityGrid.addFilter('Priority', 'Low', 'checkbox');
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeTruthy(newCase1.displayId);
            expect(await utilityGrid.isGridRecordPresent(newCase2.displayId)).toBeFalsy(newCase2.displayId);
            await utilityGrid.searchRecord(newCase1.displayId);
            await utilityGrid.addFilter('Status', 'Assigned', 'text');
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeTruthy(newCase1.displayId);
            await utilityGrid.searchRecord(newCase2.displayId);
            await utilityGrid.addFilter('Summary', "CaseFilter2" + randomStr, 'text');
            expect(await utilityGrid.isGridRecordPresent(newCase2.displayId)).toBeTruthy(newCase2.displayId);
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeFalsy(newCase1.displayId);
        });
        it('[5531]:[Case Workspace] Cases search using filters', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchRecord(newCase1.displayId);
            await utilityGrid.addFilter('Category Tier 1',"Employee Relations", 'text');
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeTruthy(newCase1.displayId);
            expect(await utilityGrid.isGridRecordPresent(newCase2.displayId)).toBeFalsy(newCase2.displayId);
            await utilityGrid.searchRecord(newCase2.displayId);
            await utilityGrid.addFilter('Category Tier 2', "Finance", 'text');
            expect(await utilityGrid.isGridRecordPresent(newCase2.displayId)).toBeTruthy(newCase2.displayId);
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeFalsy(newCase1.displayId);
            await utilityGrid.searchRecord(newCase1.displayId);
            await utilityGrid.addFilter('Category Tier 3', "Bonus", 'text');
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeTruthy(newCase1.displayId);
            expect(await utilityGrid.isGridRecordPresent(newCase2.displayId)).toBeFalsy(newCase2.displayId);
        });
        it('[5531]:[Case Workspace] Cases search using filters', async () => {
            await utilityGrid.searchRecord(newCase1.displayId);
            await utilityGrid.addFilter('Case ID', newCase1.displayId, 'text');
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeTruthy(newCase1.displayId);
            expect(await utilityGrid.isGridRecordPresent(newCase2.displayId)).toBeFalsy(newCase2.displayId);
            await utilityGrid.searchRecord(newCase2.displayId);
            await utilityGrid.addFilter('Assigned Group', "US Support 1", 'text');
            expect(await utilityGrid.isGridRecordPresent(newCase2.displayId)).toBeTruthy(newCase2.displayId);
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeFalsy(newCase1.displayId);
            await utilityGrid.searchRecord(newCase1.displayId);
            await utilityGrid.addFilter('Requester', 'Qiang Du', 'text');
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeTruthy(newCase1.displayId);
            expect(await utilityGrid.isGridRecordPresent(newCase2.displayId)).toBeFalsy(newCase2.displayId);
            await utilityGrid.searchRecord(newCase1.displayId);
            await utilityGrid.addFilter('Assignee', 'Qadim Katawazi', 'text');
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeTruthy(newCase1.displayId);
            expect(await utilityGrid.isGridRecordPresent(newCase2.displayId)).toBeFalsy(newCase2.displayId);
            await utilityGrid.clearFilter();
            await utilityGrid.typeInFilterExperssion("Modified Date:" + modifiedDateFormate);
            await utilityGrid.searchRecordWithoutFilter(newCase1.displayId);
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeTruthy(newCase1.displayId);
        });
        it('[5531]:[Case Workspace] Cases search using filters', async () => {
            await caseConsolePo.removeColumns(defaultCaseColumns);
            await caseConsolePo.addColumns(arr1);
            await utilityGrid.searchRecord(newCase1.displayId);
            await utilityGrid.addFilter('Company', 'Petramco', 'text');
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeTruthy(newCase1.displayId);
            await utilityGrid.searchRecord(newCase1.displayId);
            await utilityGrid.addFilter('Region', 'North America', 'text');
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeTruthy(newCase1.displayId);
            await utilityGrid.searchRecord(newCase1.displayId);
            await utilityGrid.addFilter('Case Site', 'Austin', 'text');
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeTruthy(newCase1.displayId);
            expect(await utilityGrid.isGridRecordPresent(newCase2.displayId)).toBeFalsy(newCase2.displayId);
            await utilityGrid.searchRecord(newCase1.displayId);
            await utilityGrid.addFilter('Modified By', 'qkatawazi', 'text');
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeTruthy(newCase1.displayId);
            await utilityGrid.searchRecord(newCase1.displayId);
            await utilityGrid.addFilter('Assignee Login Name', 'qkatawazi', 'text');
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeTruthy(newCase1.displayId);
            expect(await utilityGrid.isGridRecordPresent(newCase2.displayId)).toBeFalsy(newCase2.displayId);
        });
        it('[5531]:[Case Workspace] Cases search using filters', async () => { 
            await utilityGrid.searchRecord(newCase1.displayId);
            await utilityGrid.addFilter('Label', "CaseLabel" + randomStr, 'text');
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeTruthy(newCase1.displayId);
            expect(await utilityGrid.isGridRecordPresent(newCase2.displayId)).toBeFalsy(newCase2.displayId);
            await utilityGrid.searchRecord(newCase1.displayId);
            await utilityGrid.addFilter("ID", id, "text");
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeTruthy(newCase1.displayId);
            expect(await utilityGrid.isGridRecordPresent(newCase2.displayId)).toBeFalsy(newCase2.displayId);
            await utilityGrid.searchRecord(newCase1.displayId);
            await utilityGrid.addFilter('Source', "External", 'text');
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeTruthy(newCase1.displayId);
            await utilityGrid.searchRecord(newCase1.displayId);
            await utilityGrid.addFilter('Status Value', "2000", 'text');
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeTruthy(newCase1.displayId);
            await caseConsolePo.removeColumns(arr1);
            await caseConsolePo.addColumns(defaultCaseColumns);
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });
});