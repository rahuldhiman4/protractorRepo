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
            let menuItemDataFile = require('../../data/ui/ticketing/menuItem.ui.json');
            label = await menuItemDataFile['sampleMenuItem'].menuItemName + randomStr;
            menuItemDataFile['sampleMenuItem'].menuItemName = label;
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createNewMenuItem(menuItemDataFile['sampleMenuItem']);

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
});