import { cloneDeep } from 'lodash';
import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import * as caseData from "../../data/ui/case/filter-combination.data.ui";
import { SAMPLE_MENU_ITEM } from '../../data/ui/ticketing/menu.item.ui';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import serviceTargetConfig from '../../pageobject/settings/slm/service-target-blade.po';
import SlmExpressionBuilder from '../../pageobject/settings/slm/slm-expressionbuilder.pop.po';
import { BWF_BASE_URL, BWF_PAGE_TITLES } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from "../../utils/utility.grid";

describe('Case Console Filter Combinations', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login("elizabeth");
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    describe('[12089]: Verify records are fetched on case console with Assignee, Assigned Group, Status combinations', () => {
        let caseId: string[] = [];

        beforeAll(async () => {

            await apiHelper.apiLogin('elizabeth');

            let response1 = await apiHelper.createCase(caseData.Case_Assigned_FILTER_1);
            caseId.push(response1.displayId);

            let response2 = await apiHelper.createCase(caseData.Case_Assigned_FILTER_2);
            caseId.push(response2.displayId);

            let response3 = await apiHelper.createCase(caseData.Case_InProgres_FILTER_3);
            caseId.push(response3.displayId);

            let response4 = await apiHelper.createCase(caseData.Case_Assigned_FILTER_4);
            caseId.push(response4.displayId);

            let response5 = await apiHelper.createCase(caseData.Case_New_FILTER_5);
            caseId.push(response5.displayId);

            let response6 = await apiHelper.createCase(caseData.Case_INProgress_FILTER_6);
            caseId.push(response6.displayId);

            let response7 = await apiHelper.createCase(caseData.Case_Pending_FILTER_7);
            caseId.push(response7.displayId);

            let response8 = await apiHelper.createCase(caseData.Case_Pending_FILTER_8);
            caseId.push(response8.displayId);
        });

        it('[12089]: Verify records are fetched on case console with Assignee, Assigned Group, Status combinations', async () => {
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Assignee', 'Elizabeth Peters', 'text');
            await utilityGrid.addFilter('Status', 'Assigned', 'text');
            await utilityGrid.addFilter('Assigned Group', 'Employee Relations', 'text');
            expect(await utilityGrid.isAppliedFilterMatches(['Assignee: Elizabeth Peters', 'Assigned Group: Employee Relations', 'Status: Assigned'])).toBeTruthy();
            await utilityGrid.saveFilter('Filter1');
            await utilityGrid.clickRefreshIcon();

            for (let i: number = 0; i < 2; i++) {
                expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeTruthy(caseId[i] + ' :Record is not available');
            }

            for (let i: number = 2; i < 4; i++) {
                expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeFalsy(caseId[i] + ' :Record is available');
            }
        });
        it('[12089]: Verify records are fetched on case console with Assignee, Assigned Group, Status combinations', async () => {
            await utilityGrid.clearFilter();

            for (let i: number = 0; i < 8; i++) {
                expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeTruthy(caseId[i] + ' :Record is not available');
            }
        });

        it('[12089]: Verify records are fetched on case console with Assignee, Assigned Group, Status combinations', async () => {
            //Verify the fetched records with filter Assigned Group = "Employee Relations" and Status = "New"
            await navigationPage.gotoCaseConsole();
            await utilityGrid.addFilter('Assigned Group', 'Employee Relations', 'text');
            await utilityGrid.addFilter('Status', 'New', 'text');
            await utilityGrid.clickRefreshIcon();
            for (let i: number = 4; i < 5; i++) {
                expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeTruthy(caseId[i] + ' :Record is not available');
            }
        });
        it('[12089]: Verify records are fetched on case console with Assignee, Assigned Group, Status combinations', async () => {
            for (let i: number = 0; i < 4; i++) {
                expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeFalsy(caseId[i] + ' :Record is available');
            }
            for (let i: number = 5; i < 8; i++) {
                expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeFalsy(caseId[i] + ' :Record is available');
            }
        });
        it('[12089]: Verify records are fetched on case console with Assignee, Assigned Group, Status combinations', async () => {
            //Verify all the fetched records with Assignee = NULL "$NULL$"
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Assignee', '$NULL$', 'text');
            await utilityGrid.clickRefreshIcon();
            for (let i: number = 4; i < 5; i++) {
                expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeTruthy(caseId[i] + ' :Record is not available');
            }
            for (let i: number = 0; i < 4; i++) {
                expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeFalsy(caseId[i] + ' :Record is available');
            }
        });
        it('[12089]: Verify records are fetched on case console with Assignee, Assigned Group, Status combinations', async () => {
            for (let i: number = 5; i < 8; i++) {
                expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeFalsy(caseId[i] + ' :Record is available');
            }
        });

        it('[12089]: Verify records are fetched on case console with Assignee, Assigned Group, Status combinations', async () => {

            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Assigned Group', 'US Support 1', 'text');
            await utilityGrid.addFilter('Assigned Group\n(1 selected)', 'US Support 2', 'text');
            await utilityGrid.addFilter('Status', 'Pending', 'text');
            await utilityGrid.addFilter('Status\n(1 selected)', 'In Progress', 'text');
            await utilityGrid.clickRefreshIcon();

            for (let i: number = 5; i < 7; i++) {
                expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeTruthy(caseId[i] + ' :Record is not available');
            }

            for (let i: number = 0; i < 5; i++) {
                expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeFalsy(caseId[i] + ' :Record is available');
            }
        });
        it('[12089]: Verify records are fetched on case console with Assignee, Assigned Group, Status combinations', async () => {
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Assigned Group', 'US Support 1', 'text');
            await utilityGrid.addFilter('Assigned Group\n(1 selected)', 'US Support 2', 'text');
            await utilityGrid.clickRefreshIcon();

            for (let i: number = 5; i < 7; i++) {
                expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeTruthy(caseId[i] + ' :Record is not available');
            }

            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Status', 'Pending', 'text');
            await utilityGrid.addFilter('Status\n(1 selected)', 'In Progress', 'text');
            await utilityGrid.clickRefreshIcon();

            for (let i: number = 5; i < 7; i++) {
                expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeTruthy(caseId[i] + ' :Record is not available');
            }
        });

        it('[12089]: Verify records are fetched on case console with Assignee, Assigned Group, Status combinations', async () => {

            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Assigned Group', 'IN Support 1', 'text');
            await utilityGrid.addFilter('Status', 'Pending', 'text');
            await utilityGrid.clickRefreshIcon()

            for (let i: number = 7; i < 8; i++) {
                expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeTruthy(caseId[i] + ' :Record is not available');
            }
        });
        it('[12089]: Verify records are fetched on case console with Assignee, Assigned Group, Status combinations', async () => {
            for (let i: number = 0; i < 7; i++) {
                expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeFalsy(caseId[i] + ' :Record is available');
            }
        });

        it('[12089]: Verify records are fetched on case console with Assignee, Assigned Group, Status combinations', async () => {
            await utilityGrid.clearSearchBox();
            await utilityGrid.clearFilter();
            expect(await utilityGrid.isGridColumnSorted('Case ID', 'ascending')).toBeTruthy('Ascendigly not sorted');
            expect(await utilityGrid.isGridColumnSorted('Case ID', 'descending')).toBeTruthy('Descendingly not sorted');
            expect(await utilityGrid.isGridColumnSorted('Status', 'ascending')).toBeTruthy('Ascendigly not sorted');
            expect(await utilityGrid.isGridColumnSorted('Status', 'descending')).toBeTruthy('Descendingly not sorted');
            expect(await utilityGrid.isGridColumnSorted('Request ID', 'ascending')).toBeTruthy('Ascendigly not sorted');
            expect(await utilityGrid.isGridColumnSorted('Request ID', 'descending')).toBeTruthy('Descendingly not sorted');
            expect(await utilityGrid.isGridColumnSorted('Requester', 'ascending')).toBeTruthy('Ascendigly not sorted');
            expect(await utilityGrid.isGridColumnSorted('Requester', 'descending')).toBeTruthy('Descendingly not sorted');
            expect(await utilityGrid.isGridColumnSorted('Assignee', 'ascending')).toBeTruthy('Ascendigly not sorted');
            expect(await utilityGrid.isGridColumnSorted('Assignee', 'descending')).toBeTruthy('Descendingly not sorted');
        });
        afterAll(async () => {
            await utilityGrid.clearFilter();
        });
    });
    describe('[12088]:Verify records are fetched on case console with case Site, Region, Status combinations', () => {
        let caseId: string[] = [];
        beforeAll(async () => {
            await apiHelper.apiLogin('elizabeth');

            let response1 = await apiHelper.createCase(caseData.Case_Assigned_FILTER_1);
            caseId.push(response1.displayId);

            let response2 = await apiHelper.createCase(caseData.Case_InProgres_FILTER_3);
            caseId.push(response2.displayId);

            let response3 = await apiHelper.createCase(caseData.Case_New_FILTER_9);
            caseId.push(response3.displayId);

            let response4 = await apiHelper.createCase(caseData.Case_Pending_FILTER_10);
            caseId.push(response4.displayId);

            let response5 = await apiHelper.createCase(caseData.Case_Pending_FILTER_8);
            caseId.push(response5.displayId);
        });

        it('[12088]:Verify records are fetched on case console with case Site, Region, Status combinations', async () => {
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Status', 'New', 'text');
            await utilityGrid.addFilter('Status\n(1 selected)', 'Assigned', 'text');
            await utilityGrid.addFilter('Case Site', 'Pune', 'text');
            await utilityGrid.addFilter('Status\n(2 selected)', 'Pending', 'text');
            await utilityGrid.addFilter('Status\n(3 selected)', 'In Progress', 'text');
            await utilityGrid.clickRefreshIcon();
            for (let i: number = 0; i < 4; i++) {
                expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeTruthy(caseId[i] + ' :Record is not available');
            }

            for (let i: number = 4; i < 5; i++) {
                expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeFalsy(caseId[i] + ' :Record is available');
            }
        });
        it('[12088]:Verify records are fetched on case console with Source and Assignee combinations', async () => {
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Region', 'Asia-Pac', 'text');
            await utilityGrid.clickRefreshIcon()
            for (let i: number = 0; i < 4; i++) {
                expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeTruthy(caseId[i] + ' :Record is not available');
            }

            for (let i: number = 4; i < 5; i++) {
                expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeFalsy(caseId[i] + ' :Record is available');
            }
        });
        it('[12088]:Verify records are fetched on case console with Source and Assignee combinations', async () => {
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Company', 'Petramco', 'text');
            await utilityGrid.addFilter('Region', 'Americas', 'text');
            await utilityGrid.clickRefreshIcon()
            for (let i: number = 4; i < 5; i++) {
                expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeTruthy(caseId[i] + ' :Record is not available');
            }

            for (let i: number = 0; i < 4; i++) {
                expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeFalsy(caseId[i] + ' :Record is available');
            }
        });
        it('[12088]:Verify records are fetched on case console with Source and Assignee combinations', async () => {
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Company', 'Petramco', 'text');
            await utilityGrid.addFilter('Case Site', 'Petramco Site1', 'text');
            for (let i: number = 4; i < 5; i++) {
                expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeTruthy(caseId[i] + ' :Record is not available');
            }

            for (let i: number = 0; i < 4; i++) {
                expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeFalsy(caseId[i] + ' :Record is available');
            }
        });
        afterAll(async () => {
            await utilityGrid.clearFilter();
        });
    });
    describe('[12078]:Verify records are fetched on case console with Label and Assigned group combinations', () => {
        let randomStr: string = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseId: string[] = [];
        let label = "Benefits";
        beforeAll(async () => {
            await apiHelper.apiLogin('elizabeth');
            let response1 = await apiHelper.createCase(caseData.Case_Assigned_FILTER_1);
            caseId.push(response1.displayId);

            let response2 = await apiHelper.createCase(caseData.Case_Pending_FILTER_11);
            caseId.push(response2.displayId);

            let response3 = await apiHelper.createCase(caseData.Case_Pending_FILTER_12);
            caseId.push(response3.displayId);

            caseData.Case_Pending_FILTER_13.Label = label;
            let response4 = await apiHelper.createCase(caseData.Case_Pending_FILTER_13);
            caseId.push(response4.displayId);
        });
        it('[12078]:Verify records are fetched on case console with Label and Assigned group combinations', async () => {
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Assigned Group', 'Employee Relations', 'text');
            await utilityGrid.addFilter('Assigned Group\n(1 selected)', 'Workforce Administration', 'text');
            await utilityGrid.addFilter('Assigned Group\n(2 selected)', 'Compensation and Benefits', 'text');
            await utilityGrid.clickRefreshIcon();
            for (let i: number = 0; i < 3; i++) {
                expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeTruthy(caseId[i] + ' :Record is not available');
            }

            for (let i: number = 3; i < 4; i++) {
                expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeFalsy(caseId[i] + ' :Record is available');
            }
        });
        it('[12078]:Verify records are fetched on case console with Label and Assigned group combinations', async () => {
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Assigned Group', 'US Support 3', 'text');
            await utilityGrid.clickRefreshIcon();
            for (let i: number = 3; i < 4; i++) {
                expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeTruthy(caseId[i] + ' :Record is not available');
            }

            for (let i: number = 0; i < 2; i++) {
                expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeFalsy(caseId[i] + ' :Record is available');
            }
        });
        it('[12078]:Verify records are fetched on case console with Label and Assigned group combinations', async () => {
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Assigned Group', 'Compensation and Benefits', 'text');
            await utilityGrid.addFilter('Category Tier 1', 'Payroll', 'text');
            await utilityGrid.addFilter('Category Tier 2', 'Finance', 'text');
            await utilityGrid.addFilter('Category Tier 3', 'Reporting', 'text');
            await utilityGrid.clickRefreshIcon();
            for (let i: number = 2; i < 3; i++) {
                expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeTruthy(caseId[i] + ' :Record is not available');
            }

            for (let i: number = 0; i < 2; i++) {
                expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeFalsy(caseId[i] + ' :Record is available');
            }
            for (let i: number = 3; i < 4; i++) {
                expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeFalsy(caseId[i] + ' :Record is available');
            }
        });
        afterAll(async () => {
            await utilityGrid.clearFilter();
        });
    });
    describe('[12087]:Verify records are fetched on case console with Source and Assignee combinations', () => {
        let caseId: string[] = [];
        beforeAll(async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', BWF_PAGE_TITLES.SERVICE_LEVEL_MANAGEMENT.SERVICE_TARGET);
            await serviceTargetConfig.createServiceTargetConfig('SVT with mandatory fields', 'Petramco', 'Case Management');
            await SlmExpressionBuilder.selectExpressionQualification('Priority', '=', 'Critical', 'Direct');
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("1");
            await serviceTargetConfig.selectMeasurement();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "Status", "=", "Pending", "Direct");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "Status", "=", "Resolved", "Direct");
            await serviceTargetConfig.clickOnSaveSVTButton();

            await apiHelper.apiLogin('elizabeth');

            let response1 = await apiHelper.createCase(caseData.Case_Assigned_FILTER_1);
            caseId.push(response1.displayId);

            let response2 = await apiHelper.createCase(caseData.Case_InProgres_FILTER_3);
            caseId.push(response2.displayId);

            let response3 = await apiHelper.createCase(caseData.Case_New_FILTER_5);
            caseId.push(response3.displayId);

            let response4 = await apiHelper.createCase(caseData.Case_Pending_FILTER_7);
            caseId.push(response4.displayId);

            let response5 = await apiHelper.createCase(caseData.Case_Pending_FILTER_8);
            caseId.push(response5.displayId);

        });
        it('[12087]:Verify records are fetched on case console with Source and Assignee combinations', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Status', 'New', 'text');
            await utilityGrid.addFilter('Status\n(1 selected)', 'Assigned', 'text');
            await utilityGrid.addFilter('Source', 'Live Chat', 'text');
            await utilityGrid.addFilter('Status\n(2 selected)', 'Pending', 'text');
            await utilityGrid.addFilter('Status\n(3 selected)', 'In Progress', 'text');
            await utilityGrid.clickRefreshIcon();
            for (let i: number = 0; i < 4; i++) {
                expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeTruthy(caseId[i] + ' :Record is not available');
            }

            for (let i: number = 4; i < 5; i++) {
                expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeFalsy(caseId[i] + ' :Record is available');
            }
        });
        it('[12087]:Verify records are fetched on case console with Source and Assignee combinations', async () => {
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Requester', 'Harry Potter', 'text');
            await utilityGrid.addFilter('Source', 'Agent', 'text');
            await utilityGrid.clickRefreshIcon();
            for (let i: number = 0; i < 4; i++) {
                expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeFalsy(caseId[i] + ' :Record is available');
            }

            for (let i: number = 4; i < 5; i++) {
                expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeTruthy(caseId[i] + ' :Record is not available');
            }
        });
        it('[12087]:Verify records are fetched on case console with Source and Assignee combinations', async () => {
            await utilityGrid.clearFilter();
            await browser.sleep(60000); // Time required for SLM Status to move in Breach 
            await utilityGrid.addFilter('SLM Status', 'Breached', 'checkbox');
            await utilityGrid.addFilter('Assignee', 'Qiao Feng', 'text');
            await utilityGrid.clickRefreshIcon();
            for (let i: number = 3; i < 4; i++) {
                expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeTruthy(caseId[i] + ' :Record is not available');
            }

            for (let i: number = 0; i < 3; i++) {
                expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeFalsy(caseId[i] + ' :Record is available');
            }
            for (let i: number = 4; i < 5; i++) {
                expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeFalsy(caseId[i] + ' :Record is available');
            }
        });
        it('[12087]:Verify records are fetched on case console with Source and Assignee combinations', async () => {
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Priority', 'Critical', 'checkbox');
            await utilityGrid.addFilter('Assignee', 'Anju Joshi', 'text');
            await utilityGrid.addFilter('Assignee\n(1 selected)', 'Qiao Feng', 'text');
            await utilityGrid.clickRefreshIcon();
            for (let i: number = 3; i < 4; i++) {
                expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeTruthy(caseId[i] + ' :Record is not available');
            }

            for (let i: number = 4; i < 5; i++) {
                expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeFalsy(caseId[i] + ' :Record is available');
            }
            for (let i: number = 0; i < 3; i++) {
                expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeFalsy(caseId[i] + ' :Record is available');
            }
        });
        afterAll(async () => {
            await utilityGrid.clearFilter();
        });
    });
})


