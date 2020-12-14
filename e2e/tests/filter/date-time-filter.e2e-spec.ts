import apiHelper from '../../api/api.helper';
import { browser, $, protractor } from "protractor";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import dateTimeSelectorPo from '../../pageobject/settings/common/date-time-selector.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

describe('Date and Time Preset Filter', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    describe('[DRDMV-23499,DRDMV-23511]: Validation for modified date, created date and target date', async () => {
        it('[DRDMV-23499,DRDMV-23511]: Validation for modified date, created date and target date', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.clickFilterField("Created Date");

            //Validating and Selecting Default Date
            expect(await dateTimeSelectorPo.getSelectedStartDateTimestamp()).toBe('Not selected');
            expect(await dateTimeSelectorPo.getSelectedEndDateTimestamp()).toBe('Not selected');
            let createdDate = new Date();
            let month = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
            let monthValue: string = month[createdDate.getMonth()];
            expect(await dateTimeSelectorPo.getMonthFromCaleder()).toBe(monthValue);
            expect(await dateTimeSelectorPo.isAllDaysPresentInWeek()).toBeTruthy();
            await dateTimeSelectorPo.selectDateOnCalender(createdDate.getDate());

            //Validating and Selecting Default Time
            expect(await dateTimeSelectorPo.getSelectedTimeValue('tet')).toBe('');
            let systemDate = new Date();
            let monthsValue = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            let dateFormateValue: string = monthsValue[systemDate.getMonth()];
            let dateFormateNew: string = dateFormateValue.substring(0, 3);

            let time1 = systemDate.toLocaleTimeString();
            let diffTime1 = time1.split(" ");
            let newTime1 = diffTime1[0].split(":");
            let exactTime1 = newTime1[0] + ":" + newTime1[1] + " " + diffTime1[1];
            let dateFormate: string = "Created Date: " + dateFormateNew + " " + systemDate.getDate() + ", " + systemDate.getFullYear() + " " + exactTime1;
            await $('body').sendKeys(protractor.Key.ESCAPE);
            let date: string[] = [dateFormate];
            expect(await utilityGrid.isAppliedFilterMatches(date)).toBeTruthy();

            expect(await utilityGrid.isAppliedFilterMatches(date)).toBeTruthy("Create Date fail");

            //2nd Validation for differnt date with current time
            await utilityGrid.clearFilter();
            await utilityGrid.clickFilterField("Created Date");
            await dateTimeSelectorPo.clickEndDateTab();
            await dateTimeSelectorPo.selectPreviousMonthUsingAngularIcon("Aug");
            await dateTimeSelectorPo.selectPreviousYearUsingAngularIcon(2017);
            await dateTimeSelectorPo.selectDateOnCalender(23);
            await $('body').sendKeys(protractor.Key.ESCAPE);
            let endDate = new Date();
            let endDatetime = endDate.toLocaleTimeString();
            let endDatetimediffTime = endDatetime.split(" ");
            let endDateTime1 = endDatetimediffTime[0].split(":");
            let endDateexactTime = endDateTime1[0] + ":" + endDateTime1[1] + " " + endDatetimediffTime[1];
            let completeEndDate = 'Created Date: Aug 23, 2017 ' + endDateexactTime;
            let date1: string[] = [completeEndDate];
            expect(await utilityGrid.isAppliedFilterMatches(date1)).toBeTruthy(" date1");
        });
        it('[DRDMV-23499,DRDMV-23511]: Validation for modified date, created date and target date', async () => {
            await navigationPage.gotoCaseConsole();
            // Validate start and End date
            await utilityGrid.clearFilter();
            await utilityGrid.clickFilterField("Modified Date");
            await dateTimeSelectorPo.selectPreviousMonthUsingAngularIcon("Sep");
            await dateTimeSelectorPo.selectPreviousYearUsingAngularIcon(2015);
            await dateTimeSelectorPo.selectDateOnCalender(26);
            let endDate = new Date();
            let endDatetime = endDate.toLocaleTimeString();
            let endDatetimediffTime = endDatetime.split(" ");
            let endDateTime1 = endDatetimediffTime[0].split(":");
            let endDateexactTime = endDateTime1[0] + ":" + endDateTime1[1] + " " + endDatetimediffTime[1];
            let completeEndDate = 'Modified Date: Sep 26, 2015 ' + endDateexactTime;
            await dateTimeSelectorPo.clickEndDateTab();
            await dateTimeSelectorPo.selectNextMonthUsingAngularIcon("Sep");
            await dateTimeSelectorPo.selectNextYearUsingAngularIcon(2017);
            await dateTimeSelectorPo.selectDateOnCalender(11);
            await $('body').sendKeys(protractor.Key.ESCAPE);
            let endDate1 = new Date();
            let endDatetime1 = endDate1.toLocaleTimeString();
            let endDatetimediffTime1 = endDatetime1.split(" ");
            let endDateTime11 = endDatetimediffTime1[0].split(":");
            let endDateexactTime1 = endDateTime1[0] + ":" + endDateTime11[1] + " " + endDatetimediffTime1[1];
            let completeEndDate1 = ' - Sep 11, 2017 ' + endDateexactTime1;
            let date2: string[] = [completeEndDate + completeEndDate1];
            expect(await utilityGrid.isAppliedFilterMatches(date2)).toBeTruthy(" Expected Date:" + date2);

        });
        it('[DRDMV-23499,DRDMV-23511]: Validation for modified date, created date and target date', async () => {
            await navigationPage.gotoCaseConsole();
            // Validate start and end date with Time
            await utilityGrid.clearFilter();
            await utilityGrid.clickFilterField("Target Date");
            await dateTimeSelectorPo.selectPreviousMonthUsingAngularIcon("Feb");
            await dateTimeSelectorPo.selectNextYearUsingAngularIcon(2022);
            await dateTimeSelectorPo.selectDateOnCalender(21);
            await dateTimeSelectorPo.selectTimeToggle();
            expect(await dateTimeSelectorPo.getActiveTimeUnit()).toBe('HH');
            await dateTimeSelectorPo.setHour('02');
            await dateTimeSelectorPo.setMinute(0);
            await dateTimeSelectorPo.clickMeridianValue("AM");
            await dateTimeSelectorPo.selectTimeToggle();

            await dateTimeSelectorPo.clickEndDateTab();
            await dateTimeSelectorPo.selectPreviousMonthUsingAngularIcon("Feb");
            await dateTimeSelectorPo.selectNextYearUsingAngularIcon(2022);
            await dateTimeSelectorPo.selectDateOnCalender(21);
            await dateTimeSelectorPo.selectTimeToggle();
            expect(await dateTimeSelectorPo.getActiveTimeUnit()).toBe('HH');
            await dateTimeSelectorPo.setHour('03');
            await dateTimeSelectorPo.setMinute(0);
            await dateTimeSelectorPo.clickMeridianValue("AM");
            await $('body').sendKeys(protractor.Key.ESCAPE);
            let date3: string[] = ["Target Date: Feb 21, 2022 2:00 AM - Feb 21, 2022 3:00 AM"];
            expect(await utilityGrid.isAppliedFilterMatches(date3)).toBeTruthy();
        });
        it('[DRDMV-23499,DRDMV-23511]: Validation for modified date, created date and target date', async () => {
            await navigationPage.gotoCaseConsole();
            // Validate start and End date with Time
            await utilityGrid.clearFilter();
            await utilityGrid.clickFilterField("Created Date");
            await dateTimeSelectorPo.selectPreviousMonthUsingAngularIcon("Sep");
            await dateTimeSelectorPo.selectPreviousYearUsingAngularIcon(2015);
            await dateTimeSelectorPo.selectDateOnCalender(17);
            await dateTimeSelectorPo.selectTimeToggle();
            expect(await dateTimeSelectorPo.getActiveTimeUnit()).toBe('HH');
            await dateTimeSelectorPo.setHour('08');
            await dateTimeSelectorPo.setMinute(0);
            await dateTimeSelectorPo.clickMeridianValue("AM");
            await dateTimeSelectorPo.selectTimeToggle();
            await await dateTimeSelectorPo.clickEndDateTab();
            await dateTimeSelectorPo.selectPreviousMonthUsingAngularIcon("Feb");
            await dateTimeSelectorPo.selectNextYearUsingAngularIcon(2016);
            await dateTimeSelectorPo.selectDateOnCalender(17);
            await dateTimeSelectorPo.selectTimeToggle();
            expect(await dateTimeSelectorPo.getActiveTimeUnit()).toBe('HH');
            await dateTimeSelectorPo.setHour('03');
            await dateTimeSelectorPo.setMinute(0);
            await dateTimeSelectorPo.clickMeridianValue("AM");
            await $('body').sendKeys(protractor.Key.ESCAPE);
            let date4: string[] = ["Created Date: Sep 17, 2015 8:00 AM - Feb 17, 2016 3:00 AM"];
            expect(await utilityGrid.isAppliedFilterMatches(date4)).toBeTruthy();
        });
        it('[DRDMV-23499,DRDMV-23511]: Validation for modified date, created date and target date', async () => {
            await navigationPage.gotoCaseConsole();
            // Validate start and End date with Time
            await utilityGrid.clearFilter();
            await utilityGrid.clickFilterField("Created Date");
            await dateTimeSelectorPo.selectPreviousMonthUsingAngularIcon("Sep");
            await dateTimeSelectorPo.selectPreviousYearUsingAngularIcon(2015);
            await dateTimeSelectorPo.selectDateOnCalender(17);
            await dateTimeSelectorPo.selectTimeToggle();
            expect(await dateTimeSelectorPo.getActiveTimeUnit()).toBe('HH');
            await dateTimeSelectorPo.setHour('08');
            await dateTimeSelectorPo.setMinute(23);
            await dateTimeSelectorPo.clickMeridianValue("AM");
            await dateTimeSelectorPo.selectTimeToggle();
            await await dateTimeSelectorPo.clickEndDateTab();
            await dateTimeSelectorPo.selectPreviousMonthUsingAngularIcon("Sep");
            await dateTimeSelectorPo.selectPreviousYearUsingAngularIcon(2015);
            await dateTimeSelectorPo.selectDateOnCalender(17);
            await dateTimeSelectorPo.selectTimeToggle();
            expect(await dateTimeSelectorPo.getActiveTimeUnit()).toBe('HH');
            await dateTimeSelectorPo.setHour('07');
            await dateTimeSelectorPo.setMinute(11);
            await dateTimeSelectorPo.clickMeridianValue("AM");
            expect(await utilityGrid.isNoFilterAppliedError()).toBeTruthy();
        });
        afterAll(async () => {
            await utilityGrid.clearFilter();
        });
    });
    //contains KA
    describe('[DRDMV-23517,DRDMV-23518]: Verify records are fetched on knowledge console Knowledge set, Version, template Name and Assigned group combinations', async () => {
        it('[DRDMV-23517,DRDMV-23518]: Verify records are fetched on knowledge console Knowledge set, Version, template Name and Assigned group combinations', async () => {
            await navigationPage.gotoKnowledgeConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter("Assignee", "Al Allbrook", 'test');
            await utilityGrid.addFilter("Status", "Published", 'test');
            await utilityGrid.clickFilterField("Created Date");
            await dateTimeSelectorPo.selectPreviousMonthUsingAngularIcon("Jan");
            await dateTimeSelectorPo.selectPreviousYearUsingAngularIcon(2020);
            await dateTimeSelectorPo.selectDateOnCalender(19);
            await dateTimeSelectorPo.selectTimeToggle();
            expect(await dateTimeSelectorPo.getActiveTimeUnit()).toBe('HH');
            await dateTimeSelectorPo.setHour('05');
            await dateTimeSelectorPo.setMinute(0);
            await dateTimeSelectorPo.clickMeridianValue("PM");

            await dateTimeSelectorPo.selectTimeToggle();
            await dateTimeSelectorPo.clickEndDateTab();
            await dateTimeSelectorPo.selectPreviousMonthUsingAngularIcon("Jan");
            await dateTimeSelectorPo.selectPreviousYearUsingAngularIcon(2020);
            await dateTimeSelectorPo.selectDateOnCalender(20);
            await dateTimeSelectorPo.selectTimeToggle();
            expect(await dateTimeSelectorPo.getActiveTimeUnit()).toBe('HH');
            await dateTimeSelectorPo.setHour('07');
            await dateTimeSelectorPo.setMinute(0);
            await dateTimeSelectorPo.clickMeridianValue("PM");
            await $('body').sendKeys(protractor.Key.ESCAPE);
            await utilityGrid.clickRefreshIcon();
            await utilityGrid.searchRecordWithoutFilter('KA-000000000016');
            expect(await utilityGrid.isGridRecordPresent('KA-000000000016')).toBeTruthy('KA-000000000016');
        });

        it('[DRDMV-23517,DRDMV-23518]: Verify records are fetched on knowledge console Knowledge set, Version, template Name and Assigned group combinations', async () => {
            await navigationPage.gotoKnowledgeConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter("Assigned Group", "Employee Relations", 'text');
            await utilityGrid.addFilter("Category Tier 1", "Total Rewards", 'text');
            await utilityGrid.addFilter("Category Tier 2", "Benefits", 'text');
            await utilityGrid.addFilter("Category Tier 3", "Transportation", 'text');
            expect(await utilityGrid.isGridRecordPresent('KA-000000000005')).toBeTruthy('KA-000000000023');

            await utilityGrid.clearFilter();
            await utilityGrid.addFilter("Template Name", "How To", 'test');
            expect(await utilityGrid.isGridRecordPresent('KA-000000000013')).toBeTruthy('KA-000000000013');

            await utilityGrid.clearFilter();
            await utilityGrid.addFilter("Knowledge Set", "HR", 'test');
            expect(await utilityGrid.isGridRecordPresent('KA-000000000040')).toBeTruthy('KA-000000000045');

            await utilityGrid.clearFilter();
            await utilityGrid.addFilter("Version", "1-2", 'counter');
            await utilityGrid.addFilter("Status", "Published", 'test');
            expect(await utilityGrid.isGridRecordPresent('KA-000000000016')).toBeTruthy('KA-000000000016');
        });
        afterAll(async () => {
            await utilityGrid.clearFilter();
        });
    });

    describe('[DRDMV-23493]: Verify records are fetched on case console Target date and Request ID combinations', async () => {
        let caseData, caseDataDWp, caseIdForDWP, caseId, randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let menuItemName: string;
        beforeAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            let menuItemDataFile = require('../../data/ui/ticketing/menu.item.ui');
            menuItemName = await menuItemDataFile['SAMPLE_MENU_ITEM'].menuItemName + randomStr;
            menuItemDataFile['SAMPLE_MENU_ITEM'].menuItemName = menuItemName;
            await apiHelper.createNewMenuItem(menuItemDataFile['SAMPLE_MENU_ITEM']);
            caseData = {
                "Requester": "qtao",
                "Summary": "Test123",
                "Description": "test description",
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi",
                "Category Tier 1": "Employee Relations",
                "Category Tier 2": "Compensation",
                "Category Tier 3": "Bonus",
                "Priority": "Low",
                "Contact": "qfeng",
                "Status": "2000",
                "Source": "Agent",
                "Origin": "Agent",
                "Label": menuItemName,
                "Target Date": "2020-12-16T18:25:00.000Z",
            }

            caseDataDWp =
            {
                "requester": "qtao",
                "summary": "Testing case creation with minimal input data, Human Resource"
            }

            await apiHelper.apiLogin("qkatawazi");
            caseId = await apiHelper.createCase(caseData);
            caseIdForDWP = await apiHelper.createCaseFromDwp(caseDataDWp);
        });
        it('[DRDMV-23493]: Verify records are fetched on case console Target date and Request ID combinations', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter("Request ID", "121", "test");
            expect(await utilityGrid.isGridRecordPresent(caseIdForDWP.displayId)).toBeTruthy();
            await utilityGrid.clearFilter();
            await utilityGrid.clickFilterField("Target Date");
            await dateTimeSelectorPo.selectPreviousMonthUsingAngularIcon("Dec");
            await dateTimeSelectorPo.selectPreviousYearUsingAngularIcon(2020);
            await dateTimeSelectorPo.selectDateOnCalender(16);
            await dateTimeSelectorPo.selectTimeToggle();
            await dateTimeSelectorPo.setHour('11');
            await dateTimeSelectorPo.setMinute(55);
            await dateTimeSelectorPo.clickMeridianValue("PM");
            await $('body').sendKeys(protractor.Key.ESCAPE);
            await utilityGrid.clickRefreshIcon();
            await utilityGrid.addFilter("Priority", "Low", "checkbox");
            expect(await utilityGrid.isGridRecordPresent(caseId.displayId)).toBeTruthy();
        });
        it('[DRDMV-23493]: Verify records are fetched on case console Target date and Request ID combinations', async () => {
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter("Category Tier 1", "Employee Relations", "text");
            await utilityGrid.addFilter("Category Tier 2", "Compensation", "text");
            await utilityGrid.addFilter("Category Tier 3", "Bonus", "text");
            await utilityGrid.addFilter("Company", "Petramco", "text");
            await utilityGrid.addFilter("Status", "Assigned", "text");
            await utilityGrid.addFilter("Priority", "Low", "checkbox");
            await utilityGrid.addFilter("Summary", "Test123", "test");
            await utilityGrid.addFilter("Assigned Group", "US Support 3", "text");
            await utilityGrid.addFilter("Assignee", "Qadim Katawazi", "text");

        });
        it('[DRDMV-23493]: Verify records are fetched on case console Target date and Request ID combinations', async () => {
            await utilityGrid.addFilter("Requester", "Qianru Tao", "text");
            await utilityGrid.addFilter("Source", "Agent", "text");
            await utilityGrid.addFilter("Label", menuItemName, "text");
            await utilityGrid.addFilter("SLM Status", "Service Targets Not Attached", "checkbox");
            await utilityGrid.addFilter("Assignee Login Name", "qkatawazi", "text");
            await utilityGrid.addFilter("Region", "North America", "text");
            await utilityGrid.addFilter("Case Site", "Austin", "text");
            await utilityGrid.addFilter("ID", caseId.id, "test");
            expect(await utilityGrid.isGridRecordPresent(caseId.displayId)).toBeTruthy();
        });
        afterAll(async () => {
            await utilityGrid.clearFilter();
        });
    });
    
    describe('[DRDMV-23496]: Verify records are fetched on task console with Targeted Date, Priority and status combinations', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let newCase1, tempIdLow, tempIdMedium;

        beforeAll(async () => {
            let adhocTaskData = {
                "taskName": 'manualTaskTemplate' + randomStr,
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
                "priority": "Low",
                "category1": "Employee Relations",
                "category2": "Compensation",
                "category3": "Bonus",
                "targetDate": "2020-10-13T18:25:00.000Z",
            };
            let caseData1 = {
                "Requester": "qdu",
                "Summary": "Test case for inProgress task",
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
            }
            await apiHelper.apiLogin('qkatawazi');
            newCase1 = await apiHelper.createCase(caseData1);
            tempIdLow = await apiHelper.createAdhocTask(newCase1.id, adhocTaskData);
            adhocTaskData.priority = "Medium";
            tempIdMedium = await apiHelper.createAdhocTask(newCase1.id, adhocTaskData);
            await apiHelper.updateCaseStatus(newCase1.id, 'InProgress');
            await apiHelper.updateTaskStatus(tempIdMedium.id, 'Pending');

        });
        it('[DRDMV-23496]: Verify records are fetched on task console with Targeted Date, Priority and status combinations', async () => {
            await navigationPage.gotoTaskConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.clickFilterField("Target Date");
            await dateTimeSelectorPo.selectPreviousMonthUsingAngularIcon("Oct");
            await dateTimeSelectorPo.selectPreviousYearUsingAngularIcon(2020);
            await dateTimeSelectorPo.selectDateOnCalender(13);
            await dateTimeSelectorPo.selectTimeToggle();
            await dateTimeSelectorPo.setHour('11');
            await dateTimeSelectorPo.setMinute(55);
            await dateTimeSelectorPo.clickMeridianValue("PM");

            await dateTimeSelectorPo.selectTimeToggle();
            await dateTimeSelectorPo.clickEndDateTab();
            await dateTimeSelectorPo.selectPreviousMonthUsingAngularIcon("Oct");
            await dateTimeSelectorPo.selectPreviousYearUsingAngularIcon(2020);
            await dateTimeSelectorPo.selectDateOnCalender(13);
            await dateTimeSelectorPo.selectTimeToggle();
            await dateTimeSelectorPo.setHour('11');
            await dateTimeSelectorPo.setMinute(59);
            await dateTimeSelectorPo.clickMeridianValue("PM");
            await $('body').sendKeys(protractor.Key.ESCAPE);
            await utilityGrid.clickRefreshIcon();
        });
        it('[DRDMV-23496]: Verify records are fetched on task console with Targeted Date, Priority and status combinations', async () => {
            await utilityGrid.searchRecordWithoutFilter(tempIdMedium.displayId);
            expect(await utilityGrid.isGridRecordPresent(tempIdMedium.displayId)).toBeTruthy();
            await utilityGrid.addFilter("Priority", 'Medium', "checkbox");
            await utilityGrid.addFilter("Status", 'Pending', "test");
            await utilityGrid.searchRecordWithoutFilter(tempIdMedium.displayId);
            expect(await utilityGrid.isGridRecordPresent(tempIdMedium.displayId)).toBeTruthy();
            await utilityGrid.addFilter("Task ID", tempIdMedium.displayId, "test");
            await utilityGrid.addFilter("Case ID", newCase1.displayId, "test");
            await utilityGrid.addFilter("Task Type", 'Manual', "checkbox");
            await utilityGrid.addFilter("Summary", 'manualTaskTemplate' + randomStr, "test");
            await utilityGrid.addFilter("Assignee", 'Qadim Katawazi', "test");
        });
        it('[DRDMV-23496]: Verify records are fetched on task console with Targeted Date, Priority and status combinations', async () => {
            await utilityGrid.addFilter("Assigned Group", 'US Support 3', "test");
            await utilityGrid.addFilter("SLM Status", 'Service Targets Not Attached', "checkbox");
            await utilityGrid.addFilter("Category Tier 1", "Employee Relations", "test");
            await utilityGrid.addFilter("Category Tier 2", "Compensation", "test");
            await utilityGrid.addFilter("Category Tier 3", "Bonus", "test");
            await utilityGrid.addFilter("Assignee Login Name", "qkatawazi", "test");
            await utilityGrid.searchRecordWithoutFilter(tempIdMedium.displayId);
            expect(await utilityGrid.isGridRecordPresent(tempIdMedium.displayId)).toBeTruthy();
        });
        afterAll(async () => {
            await utilityGrid.clearFilter();
        });
    });
});  