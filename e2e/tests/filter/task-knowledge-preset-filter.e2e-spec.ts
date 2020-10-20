import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import * as taskData from "../../data/ui/case/filter-combination.data.ui";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import statusConfig from "../../pageobject/settings/common/status-config.po";
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import dbConnectObj from '../../utils/utility.db-connect';
import utilityGrid from "../../utils/utility.grid";
import { SAMPLE_MENU_ITEM } from '../../data/ui/ticketing/menu.item.ui';
import { cloneDeep } from 'lodash';
import serviceTargetConfig from '../../pageobject/settings/slm/service-target-blade.po';
import slmProgressBar from '../../pageobject/slm/slm-progressbar.po';
import SlmExpressionBuilder from '../../pageobject/settings/slm/slm-expressionbuilder.pop.po';

describe('Task and Knowledge Console Filter Combinations', () => {
    const caseModule = 'Case';
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login("elizabeth");
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });
    describe('[DRDMV-23494]: Verify records are fetched on task console with Assignee, Assigned Group, Status combinations', () => {
        let taskId: string[] = [];
        beforeAll(async () => {

            await apiHelper.apiLogin('elizabeth');
            let response1 = await apiHelper.createCase(taskData.Case_InProgres_FILTER_3);
            await apiHelper.updateCaseStatus(response1.id, "InProgress");
            let response2 = await apiHelper.createAdhocTask(response1.id, taskData.TASK_DATA_Combination_1);
            taskId.push(response2.displayId);

            let response3 = await apiHelper.createCase(taskData.Case_Assigned_FILTER_2);
            let response4 = await apiHelper.createAdhocTask(response3.id, taskData.TASK_DATA_Combination_2);
            taskId.push(response4.displayId);

            let response5 = await apiHelper.createCase(taskData.Case_InProgres_FILTER_3);
            await apiHelper.updateCaseStatus(response5.id, "InProgress");
            let response6 = await apiHelper.createAdhocTask(response5.id, taskData.TASK_DATA_Combination_3);
            taskId.push(response6.displayId);

            let response7 = await apiHelper.createCase(taskData.Case_Assigned_FILTER_2);
            let response8 = await apiHelper.createAdhocTask(response7.id, taskData.TASK_DATA_Combination_4);
            taskId.push(response8.displayId);

            let response9 = await apiHelper.createCase(taskData.Case_InProgres_FILTER_3);
            await apiHelper.updateCaseStatus(response9.id, "InProgress");
            let response10 = await apiHelper.createAdhocTask(response9.id, taskData.TASK_DATA_Combination_5);
            taskId.push(response10.displayId);
            await apiHelper.updateTaskStatus(response10.id, 'Pending');
        });

        it('[DRDMV-23494]: Verify records are fetched on task console with Assignee, Assigned Group, Status combinations', async () => {
            await navigationPage.gotoTaskConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Assignee', 'Kita Williams', 'text');
            await utilityGrid.addFilter('Assigned Group', 'AU Support 1', 'text');
            await utilityGrid.addFilter('Status', 'Assigned', 'text');
            expect(await utilityGrid.isAppliedFilterMatches(['Assignee: Kita Williams', 'Assigned Group: AU Support 1', 'Status: Assigned'])).toBeTruthy();
            await utilityGrid.saveFilter('Filter1');
            await utilityGrid.clickRefreshIcon();

            for (let i: number = 0; i < 1; i++) {
                expect(await utilityGrid.isGridRecordPresent(taskId[i])).toBeTruthy(taskId[i] + ' :Record is not available');
            }
            for (let i: number = 1; i < 5; i++) {
                expect(await utilityGrid.isGridRecordPresent(taskId[i])).toBeFalsy(taskId[i] + ' :Record is available');
            }

            await utilityGrid.clearFilter();

            for (let i: number = 0; i < 5; i++) {
                expect(await utilityGrid.isGridRecordPresent(taskId[i])).toBeTruthy(taskId[i] + ' :Record is not available');
            }
        });
        it('[DRDMV-23494]: Verify records are fetched on task console with Assignee, Assigned Group, Status combinations', async () => {
            await navigationPage.gotoTaskConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Assigned Group', 'Employee Relations', 'text');
            await utilityGrid.addFilter('Status', 'Staged', 'text');
            await utilityGrid.clickRefreshIcon();
            for (let i: number = 1; i < 2; i++) {
                expect(await utilityGrid.isGridRecordPresent(taskId[i])).toBeTruthy(taskId[i] + ' :Record is not available');
            }

            for (let i: number = 2; i < 4; i++) {
                expect(await utilityGrid.isGridRecordPresent(taskId[i])).toBeFalsy(taskId[i] + ' :Record is available');
            }
            expect(await utilityGrid.isGridRecordPresent(taskId[0])).toBeFalsy(taskId[0] + ' :Record is available')
            expect(await utilityGrid.isGridRecordPresent(taskId[4])).toBeFalsy(taskId[4] + ' :Record is available')

        });
        it('[DRDMV-23494]: Verify records are fetched on task console with Assignee, Assigned Group, Status combinations', async () => {
            await navigationPage.gotoTaskConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Assigned Group', 'US Support 1', 'text');
            await utilityGrid.addFilter('Assigned Group', 'US Support 2', 'text');
            await utilityGrid.addFilter('Status', 'Assigned', 'text');
            await utilityGrid.addFilter('Status', 'Staged', 'text');
            await utilityGrid.clickRefreshIcon();
            for (let i: number = 2; i < 4; i++) {
                expect(await utilityGrid.isGridRecordPresent(taskId[i])).toBeTruthy(taskId[i] + ' :Record is not available');
            }

            for (let i: number = 0; i < 2; i++) {
                expect(await utilityGrid.isGridRecordPresent(taskId[i])).toBeFalsy(taskId[i] + ' :Record is available');
            }

            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Assigned Group', 'US Support 1', 'text');
            await utilityGrid.addFilter('Assigned Group', 'US Support 2', 'text');
            await utilityGrid.clickRefreshIcon();

            for (let i: number = 2; i < 4; i++) {
                expect(await utilityGrid.isGridRecordPresent(taskId[i])).toBeTruthy(taskId[i] + ' :Record is not available');
            }

            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Status', 'Assigned', 'text');
            await utilityGrid.addFilter('Status', 'Staged', 'text');
            await utilityGrid.clickRefreshIcon();

            for (let i: number = 2; i < 4; i++) {
                expect(await utilityGrid.isGridRecordPresent(taskId[i])).toBeTruthy(taskId[i] + ' :Record is not available');
            }
        });
        it('[DRDMV-23494]: Verify records are fetched on task console with Assignee, Assigned Group, Status combinations', async () => {
            await navigationPage.gotoTaskConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Assigned Group', 'Facilities', 'text');
            await utilityGrid.addFilter('Status', 'Pending', 'text');
            await utilityGrid.clickRefreshIcon();
            for (let i: number = 4; i < 5; i++) {
                expect(await utilityGrid.isGridRecordPresent(taskId[i])).toBeTruthy(taskId[i] + ' :Record is not available');
            }

            for (let i: number = 0; i < 4; i++) {
                expect(await utilityGrid.isGridRecordPresent(taskId[i])).toBeFalsy(taskId[i] + ' :Record is available');
            }
        });
        it('[DRDMV-23494]: Verify records are fetched on task console with Assignee, Assigned Group, Status combinations', async () => {
            await navigationPage.gotoTaskConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.clickRefreshIcon();
            expect(await utilityGrid.isGridColumnSorted('Task ID', 'asc')).toBeTruthy('Ascendigly not sorted');
            expect(await utilityGrid.isGridColumnSorted('Task ID', 'desc')).toBeTruthy('Descendigly not sorted');
            expect(await utilityGrid.isGridColumnSorted('Case ID', 'asc')).toBeTruthy('Ascendigly not sorted');
            expect(await utilityGrid.isGridColumnSorted('Case ID', 'desc')).toBeTruthy('Descendigly not sorted');
            expect(await utilityGrid.isGridColumnSorted('Status', 'asc')).toBeTruthy('Ascendigly not sorted');
            expect(await utilityGrid.isGridColumnSorted('Status', 'desc')).toBeTruthy('Descendigly not sorted');
            expect(await utilityGrid.isGridColumnSorted('Priority', 'asc')).toBeTruthy('Ascendigly not sorted');
            expect(await utilityGrid.isGridColumnSorted('Priority', 'desc')).toBeTruthy('Descendigly not sorted');
            expect(await utilityGrid.isGridColumnSorted('Modified Date', 'asc')).toBeTruthy('Ascendigly not sorted');
            expect(await utilityGrid.isGridColumnSorted('Modified Date', 'desc')).toBeTruthy('Descendigly not sorted');
        });
    });
    describe('[DRDMV-23495]: Verify records are fetched on task console with Assignee, Assigned Group, Category combinations', () => {
        let taskId: string[] = [];
        beforeAll(async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            await serviceTargetConfig.createServiceTargetConfig('SVT with mandatory fields', 'Petramco', 'Task Management');
            await SlmExpressionBuilder.selectExpressionQualification('Priority', '=', 'SELECTION', 'Critical');
            await SlmExpressionBuilder.clickOnAddExpressionButton('SELECTION');
            await SlmExpressionBuilder.clickOnSaveExpressionButtonForTask();
            await serviceTargetConfig.selectGoal("1");
            await serviceTargetConfig.selectMeasurement();
            await serviceTargetConfig.selectExpressionForMeasurementForTask(0, "status", "=", "STATUS", "Staged");
            await serviceTargetConfig.selectExpressionForMeasurementForTask(1, "status", "=", "STATUS", "Completed");
            await serviceTargetConfig.selectExpressionForMeasurementForTask(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();

            await apiHelper.apiLogin('elizabeth');

            let response1 = await apiHelper.createCase(taskData.Case_Assigned_FILTER_2);
            let response2 = await apiHelper.createAdhocTask(response1.id, taskData.TASK_DATA_Combination_2);
            taskId.push(response2.displayId);

            let response3 = await apiHelper.createCase(taskData.Case_InProgres_FILTER_3);
            let response4 = await apiHelper.createAdhocTask(response3.id, taskData.TASK_DATA_Combination_6);
            taskId.push(response4.displayId);

            let response5 = await apiHelper.createCase(taskData.Case_Assigned_FILTER_2);
            let response6 = await apiHelper.createAdhocTask(response5.id, taskData.TASK_DATA_Combination_7);
            taskId.push(response6.displayId);

            let response7 = await apiHelper.createCase(taskData.Case_Assigned_FILTER_2);
            let response8 = await apiHelper.createAdhocTask(response7.id, taskData.TASK_DATA_Combination_8);
            taskId.push(response8.displayId);

            let response9 = await apiHelper.createCase(taskData.Case_Assigned_FILTER_2);
            let response10 = await apiHelper.createAdhocTask(response9.id, taskData.TASK_DATA_Combination_4);
            taskId.push(response10.displayId);
        });

        it('[DRDMV-23495]: Verify records are fetched on task console with Assignee, Assigned Group, Category combinationss', async () => {
            await navigationPage.gotoTaskConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Assigned Group', 'Employee Relations', 'text');
            await utilityGrid.addFilter('Assigned Group', 'Workforce Administration', 'text');
            await utilityGrid.addFilter('Assigned Group', 'Compensation and Benefits', 'text');
            await utilityGrid.clickRefreshIcon();

            for (let i: number = 0; i < 3; i++) {
                expect(await utilityGrid.isGridRecordPresent(taskId[i])).toBeTruthy(taskId[i] + ' :Record is not available');
            }

            for (let i: number = 3; i < 5; i++) {
                expect(await utilityGrid.isGridRecordPresent(taskId[i])).toBeFalsy(taskId[i] + ' :Record is available');
            }
        });
        it('[DRDMV-23495]: Verify records are fetched on task console with Assignee, Assigned Group, Category combinations', async () => {
            await navigationPage.gotoTaskConsole();
            await utilityGrid.clearFilter();
            await browser.sleep(60000); // Time required for SLM Status to change
            await utilityGrid.addFilter('Assignee', 'Qianru Tao', 'text');
            await utilityGrid.addFilter('SLM Status', 'Breached', 'checkbox');
            await utilityGrid.clickRefreshIcon();

            for (let i: number = 3; i < 4; i++) {
                expect(await utilityGrid.isGridRecordPresent(taskId[i])).toBeTruthy(taskId[i] + ' :Record is not available');
            }

            for (let i: number = 0; i < 3; i++) {
                expect(await utilityGrid.isGridRecordPresent(taskId[i])).toBeFalsy(taskId[i] + ' :Record is available');
            }
            for (let i: number = 4; i < 5; i++) {
                expect(await utilityGrid.isGridRecordPresent(taskId[i])).toBeFalsy(taskId[i] + ' :Record is available');
            }
        });
        it('[DRDMV-23495]: Verify records are fetched on task console with Assignee, Assigned Group, Category combinations', async () => {
            await navigationPage.gotoTaskConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Assignee', 'Qianru Tao', 'text');
            await utilityGrid.addFilter('Assignee', 'Qiao Feng', 'text');
            await utilityGrid.addFilter('Priority', 'Critical', 'checkbox');
            await utilityGrid.clickRefreshIcon();

            for (let i: number = 3; i < 4; i++) {
                expect(await utilityGrid.isGridRecordPresent(taskId[i])).toBeTruthy(taskId[i] + ' :Record is not available');
            }

            for (let i: number = 4; i < 5; i++) {
                expect(await utilityGrid.isGridRecordPresent(taskId[i])).toBeFalsy(taskId[i] + ' :Record is available');
            }
            for (let i: number = 0; i < 3; i++) {
                expect(await utilityGrid.isGridRecordPresent(taskId[i])).toBeFalsy(taskId[i] + ' :Record is available');
            }
        });
        it('[DRDMV-23495]: Verify records are fetched on task console with Assignee, Assigned Group, Category combinations', async () => {
            await navigationPage.gotoTaskConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Assigned Group', 'Compensation and Benefits', 'text');
            await utilityGrid.addFilter('Category Tier 1', 'IT', 'text');
            await utilityGrid.addFilter('Category Tier 2', 'Service', 'text');
            await utilityGrid.addFilter('Category Tier 3', 'Email', 'text');
            await utilityGrid.clickRefreshIcon();
            for (let i: number = 1; i < 2; i++) {
                expect(await utilityGrid.isGridRecordPresent(taskId[i])).toBeTruthy(taskId[i] + ' :Record is not available');
            }

            for (let i: number = 2; i < 5; i++) {
                expect(await utilityGrid.isGridRecordPresent(taskId[i])).toBeFalsy(taskId[i] + ' :Record is available');
            }
            for (let i: number = 0; i < 1; i++) {
                expect(await utilityGrid.isGridRecordPresent(taskId[i])).toBeFalsy(taskId[i] + ' :Record is available');
            }
        });
    });
    describe('[DRDMV-23497]: Verify records are fetched on task console with Task Type, Priority and status combinations', () => {
        let randomStr: string = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let taskId: string[] = [];
        let label;
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            let menuItemData = cloneDeep(SAMPLE_MENU_ITEM);
            label = menuItemData.menuItemName + randomStr;
            menuItemData.menuItemName = label;
            await apiHelper.apiLogin('elizabeth');
            await apiHelper.createNewMenuItem(menuItemData);

            let response1 = await apiHelper.createCase(taskData.Case_New_FILTER_5);
            let response2 = await apiHelper.createAdhocTask(response1.id, taskData.TASK_DATA_Combination_9);
            taskId.push(response2.displayId);

            let response3 = await apiHelper.createCase(taskData.Case_InProgres_FILTER_3);
            let response4 = await apiHelper.createAdhocTask(response3.id, taskData.TASK_DATA_Combination_3);
            taskId.push(response4.displayId);
            await apiHelper.updateTaskStatus(response4.id, 'Assigned');

            let response5 = await apiHelper.createCase(taskData.Case_InProgres_FILTER_3);
            let response6 = await apiHelper.createAdhocTask(response5.id, taskData.TASK_DATA_Combination_5);
            taskId.push(response6.displayId);
            await apiHelper.updateTaskStatus(response6.id, 'Pending');

            let response7 = await apiHelper.createCase(taskData.Case_InProgres_FILTER_3);
            let response8 = await apiHelper.createAdhocTask(response7.id, taskData.TASK_DATA_Combination_8);
            taskId.push(response8.displayId);
            await apiHelper.updateTaskStatus(response8.id, 'InProgress');

            taskData.TASK_DATA_Combination_10.label = menuItemData.menuItemName;
            let response9 = await apiHelper.createCase(taskData.Case_InProgres_FILTER_3);
            let response10 = await apiHelper.createAdhocTask(response9.id, taskData.TASK_DATA_Combination_10);
            taskId.push(response10.displayId);
            await apiHelper.updateTaskStatus(response10.id, 'Canceled');
        });

        it('[DRDMV-23497]: Verify records are fetched on task console with Task Type, Priority and status combinationss', async () => {
            await navigationPage.gotoTaskConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Task Type', 'Manual', 'checkbox');
            await utilityGrid.addFilter('Status', 'Staged', 'text');
            await utilityGrid.addFilter('Status', 'Assigned', 'text');
            await utilityGrid.addFilter('Status', 'Pending', 'text');
            await utilityGrid.addFilter('Status', 'In Progress', 'text');
            await utilityGrid.clickRefreshIcon();
            for (let i: number = 0; i < 4; i++) {
                expect(await utilityGrid.isGridRecordPresent(taskId[i])).toBeTruthy(taskId[i] + ' :Record is not available');
            }
            for (let i: number = 4; i < 5; i++) {
                expect(await utilityGrid.isGridRecordPresent(taskId[i])).toBeFalsy(taskId[i] + ' :Record is available');
            }
        });
        it('[DRDMV-23497]: Verify records are fetched on task console with Task Type, Priority and status combinations', async () => {
            await navigationPage.gotoTaskConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Task Type', 'Manual', 'checkbox');
            await utilityGrid.addFilter('Status', 'Staged', 'text');
            await utilityGrid.addFilter('Priority', 'Critical', 'checkbox');
            await utilityGrid.clickRefreshIcon();

            for (let i: number = 0; i < 1; i++) {
                expect(await utilityGrid.isGridRecordPresent(taskId[i])).toBeTruthy(taskId[i] + ' :Record is not available');
            }
            for (let i: number = 1; i < 5; i++) {
                expect(await utilityGrid.isGridRecordPresent(taskId[i])).toBeFalsy(taskId[i] + ' :Record is available');
            }
        });
        it('[DRDMV-23497]: Verify records are fetched on task console with Task Type, Priority and status combinations', async () => {
            await navigationPage.gotoTaskConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Assigned Group', 'US Support 3', 'text');
            await utilityGrid.addFilter('Label', label, 'text');
            await utilityGrid.clickRefreshIcon();

            for (let i: number = 4; i < 5; i++) {
                expect(await utilityGrid.isGridRecordPresent(taskId[i])).toBeTruthy(taskId[i] + ' :Record is not available');
            }
            for (let i: number = 0; i < 4; i++) {
                expect(await utilityGrid.isGridRecordPresent(taskId[i])).toBeFalsy(taskId[i] + ' :Record is not available');
            }
        });
    });
    //Knowledge Preset filter combinations    
    describe('[DRDMV-23515]: Verify records are fetched on knowledge console Author, Status, Assignee & Flag combinations', () => {
        let knowledgeId: string[] = [];
        beforeAll(async () => {
            await apiHelper.apiLogin('elizabeth');

            let knowledgeArticleData1 = await apiHelper.createKnowledgeArticle(taskData.ARTICLE_DATA_Combination1);
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData1.id, 'Draft');
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData1.id, 'PublishApproval');
            knowledgeId.push(knowledgeArticleData1.displayId);
            await apiHelper.flagAndUnflagKnowledgeArticle(knowledgeArticleData1.id, "FlagComment1", 1);

            let knowledgeArticleData2 = await apiHelper.createKnowledgeArticle(taskData.ARTICLE_DATA_Combination2);
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData2.id, 'Draft');
            knowledgeId.push(knowledgeArticleData2.displayId);

            let knowledgeArticleData3 = await apiHelper.createKnowledgeArticle(taskData.ARTICLE_DATA_Combination3);
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData3.id, 'Draft');

            knowledgeId.push(knowledgeArticleData3.displayId);

        });

        it('[DRDMV-23515]: Verify records are fetched on knowledge console Author, Status, Assignee & Flag combinations', async () => {
            await navigationPage.gotoKnowledgeConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Status', 'Published', 'text');
            await utilityGrid.addFilter('Author', 'Elizabeth Peters', 'text');
            await utilityGrid.clickRefreshIcon();

            for (let i: number = 0; i < 1; i++) {
                expect(await utilityGrid.isGridRecordPresent(knowledgeId[i])).toBeTruthy(knowledgeId[i] + ' :Record is not available');
            }
            for (let i: number = 1; i < 3; i++) {
                expect(await utilityGrid.isGridRecordPresent(knowledgeId[i])).toBeFalsy(knowledgeId[i] + ' :Record is not available');
            }
        });
        it('[DRDMV-23515]: Verify records are fetched on knowledge console Author, Status, Assignee & Flag combinations', async () => {
            await navigationPage.gotoKnowledgeConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Assignee', 'Kadeem Hardison', 'text');
            await utilityGrid.addFilter('Status', 'Draft', 'text');
            await utilityGrid.clickRefreshIcon();

            for (let i: number = 2; i < 3; i++) {
                expect(await utilityGrid.isGridRecordPresent(knowledgeId[i])).toBeTruthy(knowledgeId[i] + ' :Record is not available');
            }
            for (let i: number = 0; i < 2; i++) {
                expect(await utilityGrid.isGridRecordPresent(knowledgeId[i])).toBeFalsy(knowledgeId[i] + ' :Record is not available');
            }
        });
        it('[DRDMV-23515]: Verify records are fetched on knowledge console Author, Status, Assignee & Flag combinations', async () => {
            await navigationPage.gotoKnowledgeConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Flagged', 'Yes', 'checkbox');
            await utilityGrid.clickRefreshIcon();

            for (let i: number = 0; i < 1; i++) {
                expect(await utilityGrid.isGridRecordPresent(knowledgeId[i])).toBeTruthy(knowledgeId[i] + ' :Record is not available');
            }
            for (let i: number = 1; i < 3; i++) {
                expect(await utilityGrid.isGridRecordPresent(knowledgeId[i])).toBeFalsy(knowledgeId[i] + ' :Record is not available');
            }
        });
    });
    describe('[DRDMV-23516]: Verify records are fetched on knowledge console Status, Reviewer& Review Status combinations', () => {
        let knowledgeId: string[] = [];
        beforeAll(async () => {
            await apiHelper.apiLogin('sasadmin');
            await apiHelper.updateReviewDueDateRule();
            await apiHelper.apiLogin('tadmin');
            await apiHelper.addCommonConfig('NEXT_REVIEW_PERIOD', ['1_MINUTE'], 'Petramco');
            await apiHelper.deleteApprovalMapping('Knowledge');
            await apiHelper.apiLogin('elizabeth');

            let knowledgeArticleData1 = await apiHelper.createKnowledgeArticle(taskData.ARTICLE_DATA_Combination4);
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData1.id, 'Draft');
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData1.id, 'PublishApproval');
            knowledgeId.push(knowledgeArticleData1.displayId);
            await apiHelper.flagAndUnflagKnowledgeArticle(knowledgeArticleData1.id, "FlagComment1", 1);

            let knowledgeArticleData2 = await apiHelper.createKnowledgeArticle(taskData.ARTICLE_DATA_Combination2);
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData2.id, 'Draft');
            knowledgeId.push(knowledgeArticleData2.displayId);
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData2.id, 'SMEReview', 'khardison', 'CA Support 3', 'Petramco');
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData2.id, 'PublishApproval', 'khardison', 'CA Support 3', 'Petramco');
        });

        it('[DRDMV-23516]: Verify records are fetched on knowledge console Status, Reviewer& Review Status combinations', async () => {
            await navigationPage.gotoKnowledgeConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Reviewer', 'Kadeem Hardison', 'text');
            await utilityGrid.addFilter('Review Status', 'Due Review Date', 'checkbox');
            await utilityGrid.clickRefreshIcon();
            for (let i: number = 1; i < 2; i++) {
                expect(await utilityGrid.isGridRecordPresent(knowledgeId[i])).toBeTruthy(knowledgeId[i] + ' :Record is not available');
            }
            for (let i: number = 0; i < 1; i++) {
                expect(await utilityGrid.isGridRecordPresent(knowledgeId[i])).toBeFalsy(knowledgeId[i] + ' :Record is not available');
            }
        });
        it('[DRDMV-23516]: Verify records are fetched on knowledge console Status, Reviewer& Review Status combinations', async () => {
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Flagged', 'Yes', 'checkbox');
            await utilityGrid.addFilter('Assigned Group', 'CA Support 1', 'text');
            await utilityGrid.clickRefreshIcon();

            for (let i: number = 0; i < 1; i++) {
                expect(await utilityGrid.isGridRecordPresent(knowledgeId[i])).toBeTruthy(knowledgeId[i] + ' :Record is not available');
            }
            for (let i: number = 1; i < 2; i++) {
                expect(await utilityGrid.isGridRecordPresent(knowledgeId[i])).toBeFalsy(knowledgeId[i] + ' :Record is not available');
            }

        });
        it('[DRDMV-23516]: Verify records are fetched on knowledge console Status, Reviewer& Review Status combinations', async () => {
            await navigationPage.gotoKnowledgeConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Reviewer', 'Kadeem Hardison', 'text');
            await utilityGrid.addFilter('Review Status', 'Overdue Review Date', 'checkbox');
            await utilityGrid.clickRefreshIcon();
            await browser.sleep(60000); // Time required for Review Status to change
            for (let i: number = 1; i < 2; i++) {
                expect(await utilityGrid.isGridRecordPresent(knowledgeId[i])).toBeTruthy(knowledgeId[i] + ' :Record is not available');
            }
            for (let i: number = 0; i < 1; i++) {
                expect(await utilityGrid.isGridRecordPresent(knowledgeId[i])).toBeFalsy(knowledgeId[i] + ' :Record is not available');
            }
        });
    });
})