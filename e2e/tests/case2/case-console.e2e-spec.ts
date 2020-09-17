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
    let categName1 = 'DemoCateg1';
    let categName2 = 'DemoCateg2';
    let categName3 = 'DemoCateg3';
    let categName4 = 'DemoCateg4';

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qfeng');
        await apiHelper.apiLogin('tadmin');
        await apiHelper.createOperationalCategory(categName1);
        await apiHelper.createOperationalCategory(categName2);
        await apiHelper.createOperationalCategory(categName3);
        await apiHelper.createOperationalCategory(categName4);
        await apiHelper.associateCategoryToOrganization(categName1, 'Petramco');
        await apiHelper.associateCategoryToCategory(categName1, categName2);
        await apiHelper.associateCategoryToCategory(categName2, categName3);
        await apiHelper.associateCategoryToCategory(categName3, categName4);
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    it('[DRDMV-9181]: [Case Console] - Sorting based on Source of case', async () => {
        let caseData = {
            "Description": "DRDMV-9181 Desc",
            "Requester": "qtao",
            "Summary": "DRDMV-9181-Summary",
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
        await utilityGrid.addFilter('Summary', 'DRDMV-9181-Summary', 'text');
        await utilityGrid.addGridColumn(['Source']);
        expect(await utilityGrid.isGridColumnSorted('Source', 'asc')).toBeTruthy('Column is not sorted in ascending order');
        expect(await utilityGrid.isGridColumnSorted('Source', 'desc')).toBeTruthy('Column is not sorted in descending order');
        await utilityGrid.removeGridColumn(['Source']);
    });

    describe('[DRDMV-15257]: Verify Category Tier 4 and Label column is visible on console', () => {
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
                "categoryTier1": categName1,
                "categoryTier2": categName2,
                "categoryTier3": categName3,
                "categoryTier4": categName4,
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
                "category1": categName1,
                "category2": categName2,
                "category3": categName3,
                "category4": categName4,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities",
                "label": label
            }

            assignmentMappingData = {
                "assignmentMappingName": "Assignment mapping name" + randomStr,
                "company": "Petramco",
                "supportCompany": "Petramco",
                "supportGroup": "Employee Relations",
                "assignee": "qliu",
                "categoryTier1": categName1,
                "categoryTier2": categName2,
                "categoryTier3": categName3,
                "categoryTier4": categName4,
                "label": label
            }

            readAccessMappingData = {
                "configName": 'Read Access Mapping Name' + randomStr,
                "assignedCompany": 'Petramco',
                "businessUnit": 'HR Support',
                "supportGroup": 'Compensation and Benefits',
                "company": 'Petramco',
                "category1": categName1,
                "category2": categName2,
                "category3": categName3,
                "category4": categName4,
                "label": label
            }

            await apiHelper.createCaseTemplate(caseTemplateData);
            await apiHelper.createManualTaskTemplate(taskTemplateData);
            await apiHelper.createCaseAssignmentMapping(assignmentMappingData);
            await apiHelper.createReadAccessMapping(readAccessMappingData);
        });

        it('[DRDMV-15257]: Verify Category Tier 4 and Label column is visible on console', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await caseTemplateConsolePO.addColumnOnGrid([labelStr, caseCategoryTier4Str]);
            await utilGrid.searchOnGridConsole('caseTemplateName' + randomStr);
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

    describe('[DRDMV-8280]:[Case Workspace] Cases search using filters', async () => {
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
                "categoryTier1": "Facilities",
                "categoryTier2": "Conference Room",
                "categoryTier3": "Furniture",
                "company": "Petramco",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
            }
            caseData2 = {
                "Requester": "apavlik",
                "Summary": "CaseFilter2" + randomStr,
                "Assigned Company": "Petramco",
                "Business Unit": "Facilities Support",
                "Support Group": "Facilities",
                "Assignee": "Fritz",
            }
            caseTemplateData2 = {
                "templateName": `${randomStr}2Casetemplate`,
                "templateStatus": "Active",
                "templateSummary": `${randomStr}2Summary`,
                "caseStatus": "New",
                "casePriority": "High",
                "categoryTier1": "Accounts Payable",
                "categoryTier2": "Invoices",
                "categoryTier3": "Payment",
                "company": "Petramco",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
            }
            await apiHelper.apiLogin('qkatawazi');
            newCase1 = await apiHelper.createCase(caseData1);
            await apiHelper.createCaseTemplate(caseTemplateData1);
            newCase2 = await apiHelper.createCase(caseData2);
            await apiHelper.createCaseTemplate(caseTemplateData2);
            month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            let menuItemData = cloneDeep(SAMPLE_MENU_ITEM);
            label = "CaseLabel" + randomStr;
            menuItemData.menuItemName = label;
            await apiHelper.createNewMenuItem(menuItemData);
            id = newCase1.id;
        });
        it('[DRDMV-8280]:[Case Workspace] Cases search using filters', async () => {
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
        it('[DRDMV-8280]:[Case Workspace] Cases search using filters', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.addColumns(defaultCaseColumns);
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('SLM Status', 'Service Targets Not Attached', 'checkbox');
            await utilityGrid.searchRecord(newCase1.displayId);
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeTruthy(newCase1.displayId);
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Priority', 'Low', 'checkbox');
            await utilityGrid.searchRecord(newCase1.displayId);
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeTruthy(newCase1.displayId);
            expect(await utilityGrid.isGridRecordPresent(newCase2.displayId)).toBeFalsy(newCase2.displayId);
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Status', 'Assigned', 'text');
            await utilityGrid.searchRecord(newCase1.displayId);
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeTruthy(newCase1.displayId);
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Summary', caseData2.Summary, 'text');
            await utilityGrid.searchRecord(newCase2.displayId);
            expect(await utilityGrid.isGridRecordPresent(newCase2.displayId)).toBeTruthy(newCase2.displayId);
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeFalsy(newCase1.displayId);
        });
        it('[DRDMV-8280]:[Case Workspace] Cases search using filters', async () => {
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Category Tier 1','Facilities', 'text');
            await utilityGrid.searchRecord(newCase1.displayId);
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeTruthy(newCase1.displayId);
            expect(await utilityGrid.isGridRecordPresent(newCase2.displayId)).toBeFalsy(newCase2.displayId);
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Category Tier 2', 'Invoices', 'text');
            await utilityGrid.searchRecord(newCase2.displayId);
            expect(await utilityGrid.isGridRecordPresent(newCase2.displayId)).toBeTruthy(newCase2.displayId);
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeFalsy(newCase1.displayId);
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Category Tier 3', 'Furniture', 'text');
            await utilityGrid.searchRecord(newCase1.displayId);
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeTruthy(newCase1.displayId);
            expect(await utilityGrid.isGridRecordPresent(newCase2.displayId)).toBeFalsy(newCase2.displayId);
        });
        it('[DRDMV-8280]:[Case Workspace] Cases search using filters', async () => {
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Case ID', newCase1.displayId, 'text');
            await utilityGrid.searchRecord(newCase1.displayId);
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeTruthy(newCase1.displayId);
            expect(await utilityGrid.isGridRecordPresent(newCase2.displayId)).toBeFalsy(newCase2.displayId);
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Assigned Group', 'Facilities', 'text');
            await utilityGrid.searchRecord(newCase2.displayId);
            expect(await utilityGrid.isGridRecordPresent(newCase2.displayId)).toBeTruthy(newCase2.displayId);
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeFalsy(newCase1.displayId);
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Requester', 'Qiang Du', 'text');
            await utilityGrid.searchRecord(newCase1.displayId);
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeTruthy(newCase1.displayId);
            expect(await utilityGrid.isGridRecordPresent(newCase2.displayId)).toBeFalsy(newCase2.displayId);
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Assignee', 'Qadim Katawazi', 'text');
            await utilityGrid.searchRecord(newCase1.displayId);
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeTruthy(newCase1.displayId);
            expect(await utilityGrid.isGridRecordPresent(newCase2.displayId)).toBeFalsy(newCase2.displayId);
            await utilityGrid.clearFilter();
            await utilityGrid.typeInFilterExperssion("Modified Date:" + modifiedDateFormate);
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeTruthy(newCase1.displayId);
        });
        it('[DRDMV-8280]:[Case Workspace] Cases search using filters', async () => {
            await caseConsolePo.removeColumns(defaultCaseColumns);
            await caseConsolePo.addColumns(arr1);
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Company', 'Petramco', 'text');
            await utilityGrid.searchRecord(newCase1.displayId);
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeTruthy(newCase1.displayId);
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Region', 'North America', 'text');
            await utilityGrid.searchRecord(newCase1.displayId);
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeTruthy(newCase1.displayId);
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Case Site', 'Austin', 'text');
            await utilityGrid.searchRecord(newCase1.displayId);
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeTruthy(newCase1.displayId);
            expect(await utilityGrid.isGridRecordPresent(newCase2.displayId)).toBeFalsy(newCase2.displayId);
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Modified By', 'qkatawazi', 'text');
            await utilityGrid.searchRecord(newCase1.displayId);
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeTruthy(newCase1.displayId);
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Assignee Login Name', 'qkatawazi', 'text');
            await utilityGrid.searchRecord(newCase1.displayId);
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeTruthy(newCase1.displayId);
            expect(await utilityGrid.isGridRecordPresent(newCase2.displayId)).toBeFalsy(newCase2.displayId);
        });
        it('[DRDMV-8280]:[Case Workspace] Cases search using filters', async () => { 
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Label', "CaseLabel" + randomStr, 'text');
            await utilityGrid.searchRecord(newCase1.displayId);
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeTruthy(newCase1.displayId);
            expect(await utilityGrid.isGridRecordPresent(newCase2.displayId)).toBeFalsy(newCase2.displayId);
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter("ID", id, "text");
            await utilityGrid.searchRecord(newCase1.displayId);
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeTruthy(newCase1.displayId);
            expect(await utilityGrid.isGridRecordPresent(newCase2.displayId)).toBeFalsy(newCase2.displayId);
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Source', "External", 'text');
            await utilityGrid.searchRecord(newCase1.displayId);
            expect(await utilityGrid.isGridRecordPresent(newCase1.displayId)).toBeTruthy(newCase1.displayId);
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Status Value', "2000", 'text');
            await utilityGrid.searchRecord(newCase1.displayId);
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