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
            let month = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "September", "Oct", "Nov", "Dec"];
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
            let date:string[]=[dateFormate];
            expect(await utilityGrid.isAppliedFilterMatches(date)).toBeTruthy();

            //2nd Validation for differnt date with current time
            await utilityGrid.clearFilter();
            await utilityGrid.clickFilterField("Created Date");
            await dateTimeSelectorPo.clickEndDateTab();
            await dateTimeSelectorPo.selectPreviousMonthUsingAngularIcon("August");
            await dateTimeSelectorPo.selectPreviousYearUsingAngularIcon(2017);
            await dateTimeSelectorPo.selectDateOnCalender(23);
            await $('body').sendKeys(protractor.Key.ESCAPE);
            let endDate = new Date();
            let endDatetime = endDate.toLocaleTimeString();
            let endDatetimediffTime = endDatetime.split(" ");
            let endDateTime1 = endDatetimediffTime[0].split(":");
            let endDateexactTime = endDateTime1[0] + ":" + endDateTime1[1] + " " + endDatetimediffTime[1];
            let completeEndDate = 'Created Date: Aug 23, 2017 ' + endDateexactTime;
            let date1:string[]=[completeEndDate];
            expect(await utilityGrid.isAppliedFilterMatches(date1)).toBeTruthy();
        });
        it('[DRDMV-23499,DRDMV-23511]: Validation for modified date, created date and target date', async () => {
            await navigationPage.gotoCaseConsole();
            // Validate start and End date
            await utilityGrid.clearFilter();
            await utilityGrid.clickFilterField("Modified Date");
            await dateTimeSelectorPo.selectPreviousMonthUsingAngularIcon("September");
            await dateTimeSelectorPo.selectPreviousYearUsingAngularIcon(2015);
            await dateTimeSelectorPo.selectDateOnCalender(26);
            let endDate = new Date();
            let endDatetime = endDate.toLocaleTimeString();
            let endDatetimediffTime = endDatetime.split(" ");
            let endDateTime1 = endDatetimediffTime[0].split(":");
            let endDateexactTime = endDateTime1[0] + ":" + endDateTime1[1] + " " + endDatetimediffTime[1];
            let completeEndDate = 'Modified Date: Sep 26, 2015 ' + endDateexactTime;
            await dateTimeSelectorPo.clickEndDateTab();
            await dateTimeSelectorPo.selectNextMonthUsingAngularIcon("September");
            await dateTimeSelectorPo.selectNextYearUsingAngularIcon(2017);
            await dateTimeSelectorPo.selectDateOnCalender(11);
            await $('body').sendKeys(protractor.Key.ESCAPE);
            let endDate1 = new Date();
            let endDatetime1 = endDate1.toLocaleTimeString();
            let endDatetimediffTime1 = endDatetime1.split(" ");
            let endDateTime11 = endDatetimediffTime1[0].split(":");
            let endDateexactTime1 = endDateTime1[0] + ":" + endDateTime11[1] + " " + endDatetimediffTime1[1];
            let completeEndDate1 = ' - Sep 11, 2017 ' + endDateexactTime1;
            let date2:string[]=[completeEndDate + completeEndDate1];
            expect(await utilityGrid.isAppliedFilterMatches(date2)).toBeTruthy();

        });
        it('[DRDMV-23499,DRDMV-23511]: Validation for modified date, created date and target date', async () => {
            await navigationPage.gotoCaseConsole();
            // Validate start date with Time
            await utilityGrid.clearFilter();
            await utilityGrid.clickFilterField("Target Date");
            await dateTimeSelectorPo.selectPreviousMonthUsingAngularIcon("September");
            await dateTimeSelectorPo.selectPreviousYearUsingAngularIcon(2015);
            await dateTimeSelectorPo.selectDateOnCalender(17);
            await dateTimeSelectorPo.selectTimeToggle();
            expect(await dateTimeSelectorPo.getActiveTimeUnit()).toBe('HH');
            await dateTimeSelectorPo.setHour('08');
            await dateTimeSelectorPo.setMinute(23);
            await dateTimeSelectorPo.clickMeridianValue("AM");
            await $('body').sendKeys(protractor.Key.ESCAPE);
            let date2:string[]=["Target Date: Sep 17, 2015 8:23 AM"];
            expect(await utilityGrid.isAppliedFilterMatches(date2)).toBeTruthy();
            // Validate end date with Time
            await utilityGrid.clearFilter();
            await utilityGrid.clickFilterField("Target Date");
            await dateTimeSelectorPo.clickEndDateTab();
            await dateTimeSelectorPo.selectPreviousMonthUsingAngularIcon("February");
            await dateTimeSelectorPo.selectPreviousYearUsingAngularIcon(2016);
            await dateTimeSelectorPo.selectDateOnCalender(21);
            await dateTimeSelectorPo.selectTimeToggle();
            expect(await dateTimeSelectorPo.getActiveTimeUnit()).toBe('HH');
            await dateTimeSelectorPo.setHour('03');
            await dateTimeSelectorPo.setMinute(28);
            await dateTimeSelectorPo.clickMeridianValue("AM");
            await $('body').sendKeys(protractor.Key.ESCAPE);
            let date3:string[]=["Target Date: Feb 21, 2016 3:28 AM"];
            expect(await utilityGrid.isAppliedFilterMatches(date3)).toBeTruthy();
        });
        it('[DRDMV-23499,DRDMV-23511]: Validation for modified date, created date and target date', async () => {
            await navigationPage.gotoCaseConsole();
            // Validate start and End date with Time
            await utilityGrid.clearFilter();
            await utilityGrid.clickFilterField("Created Date");
            await dateTimeSelectorPo.selectPreviousMonthUsingAngularIcon("September");
            await dateTimeSelectorPo.selectPreviousYearUsingAngularIcon(2015);
            await dateTimeSelectorPo.selectDateOnCalender(17);
            await dateTimeSelectorPo.selectTimeToggle();
            expect(await dateTimeSelectorPo.getActiveTimeUnit()).toBe('HH');
            await dateTimeSelectorPo.setHour('08');
            await dateTimeSelectorPo.setMinute(23);
            await dateTimeSelectorPo.clickMeridianValue("AM");
            await dateTimeSelectorPo.selectTimeToggle();
            await await dateTimeSelectorPo.clickEndDateTab();
            await dateTimeSelectorPo.selectPreviousMonthUsingAngularIcon("February");
            await dateTimeSelectorPo.selectNextYearUsingAngularIcon(2016);
            await dateTimeSelectorPo.selectDateOnCalender(17);
            await dateTimeSelectorPo.selectTimeToggle();
            expect(await dateTimeSelectorPo.getActiveTimeUnit()).toBe('HH');
            await dateTimeSelectorPo.setHour('03');
            await dateTimeSelectorPo.setMinute(28);
            await dateTimeSelectorPo.clickMeridianValue("AM");
            await $('body').sendKeys(protractor.Key.ESCAPE);
            let date4:string[]=["Created Date: Sep 17, 2015 8:23 AM - Feb 17, 2016 3:28 AM"];
            expect(await utilityGrid.isAppliedFilterMatches(date4)).toBeTruthy();
        });
        it('[DRDMV-23499,DRDMV-23511]: Validation for modified date, created date and target date', async () => {
            await navigationPage.gotoCaseConsole();
            // Validate start and End date with Time
            await utilityGrid.clearFilter();
            await utilityGrid.clickFilterField("Created Date");
            await dateTimeSelectorPo.selectPreviousMonthUsingAngularIcon("September");
            await dateTimeSelectorPo.selectPreviousYearUsingAngularIcon(2015);
            await dateTimeSelectorPo.selectDateOnCalender(17);
            await dateTimeSelectorPo.selectTimeToggle();
            expect(await dateTimeSelectorPo.getActiveTimeUnit()).toBe('HH');
            await dateTimeSelectorPo.setHour('08');
            await dateTimeSelectorPo.setMinute(23);
            await dateTimeSelectorPo.clickMeridianValue("AM");
            await dateTimeSelectorPo.selectTimeToggle();
            await await dateTimeSelectorPo.clickEndDateTab();
            await dateTimeSelectorPo.selectPreviousMonthUsingAngularIcon("September");
            await dateTimeSelectorPo.selectPreviousYearUsingAngularIcon(2015);
            await dateTimeSelectorPo.selectDateOnCalender(17);
            await dateTimeSelectorPo.selectTimeToggle();
            expect(await dateTimeSelectorPo.getActiveTimeUnit()).toBe('HH');
            await dateTimeSelectorPo.setHour('7');
            await dateTimeSelectorPo.setMinute(11);
            await dateTimeSelectorPo.clickMeridianValue("AM");
            expect(await utilityGrid.isNoFilterAppliedError()).toBeTruthy();
        });
    });

    describe('[DRDMV-23517,DRDMV-23518]: Verify records are fetched on knowledge console Knowledge set, Version, template Name and Assigned group combinations', async () => {
        it('[DRDMV-23517,DRDMV-23518]: Verify records are fetched on knowledge console Knowledge set, Version, template Name and Assigned group combinations', async () => {
            await navigationPage.gotoKnowledgeConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter("Assignee", "Al Allbrook", 'test');
            await utilityGrid.addFilter("Status", "Published", 'test');
            await utilityGrid.addFilter("Created Date", "Jan 19, 2020, 6:52:03 PM", 'date');
            await utilityGrid.clickFilterField("Created Date");
            await dateTimeSelectorPo.selectPreviousMonthUsingAngularIcon("January");
            await dateTimeSelectorPo.selectPreviousYearUsingAngularIcon(2020);
            await dateTimeSelectorPo.selectDateOnCalender(19);
            await dateTimeSelectorPo.selectTimeToggle();
            expect(await dateTimeSelectorPo.getActiveTimeUnit()).toBe('HH');
            await dateTimeSelectorPo.setHour('06');
            await dateTimeSelectorPo.setMinute(52);
            await dateTimeSelectorPo.clickMeridianValue("AM");
            expect(await utilityGrid.isGridRecordPresent('KA-000000000016')).toBeTruthy('KA-000000000016');

        });

        it('[DRDMV-23517,DRDMV-23518]: Verify records are fetched on knowledge console Knowledge set, Version, template Name and Assigned group combinations', async () => {
            await navigationPage.gotoKnowledgeConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter("Assigned Group", "Facilities", 'test');
            await utilityGrid.addFilter("Category Tier 1", "Facilities", 'test');
            await utilityGrid.addFilter("Category Tier 2", "Cleaning", 'test');
            await utilityGrid.addFilter("Category Tier 3", "Internal", 'test');
            expect(await utilityGrid.isGridRecordPresent('KA-000000000023')).toBeTruthy('KA-000000000023');

            await utilityGrid.clearFilter();
            await utilityGrid.addFilter("Template Name", "How To", 'test');
            expect(await utilityGrid.isGridRecordPresent('KA-000000000013')).toBeTruthy('KA-000000000013');

            await utilityGrid.clearFilter();
            await utilityGrid.addFilter("Knowledge Set", "Finance", 'test');
            expect(await utilityGrid.isGridRecordPresent('KA-000000000045')).toBeTruthy('KA-000000000045');

            await utilityGrid.clearFilter();
            await utilityGrid.addFilter("Version", "1-2", 'counter');
            await utilityGrid.addFilter("Status", "Published", 'test');
            expect(await utilityGrid.isGridRecordPresent('KA-000000000016')).toBeTruthy('KA-000000000016');
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
                "Category Tier 1": "Applications",
                "Category Tier 2": "Social",
                "Category Tier 3": "Chatter",
                "Priority": "Low",
                "Contact": "qfeng",
                "Status": "2000",
                "Source": "Agent",
                "Origin": "Agent",
                "Label": menuItemName,
                "Target Date": "2020-10-13T11:44:00.000Z",
            }

            caseDataDWp =
            {
                "requester": "qtao",
                "summary": "Testing case creation with minimal input data"
            }

            await apiHelper.apiLogin("qkatawazi")
            caseId = await apiHelper.createCase(caseData);
            caseIdForDWP = await apiHelper.createCaseFromDwp(caseDataDWp);
        });
        it('[DRDMV-23493]: Verify records are fetched on case console Target date and Request ID combinations', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter("Request ID","121","test");
            expect(await utilityGrid.isGridRecordPresent(caseDataDWp.displayId)).toBeTruthy();
            await utilityGrid.clearFilter();
            await utilityGrid.clickFilterField("Target Date");
            await dateTimeSelectorPo.selectPreviousMonthUsingAngularIcon("october");
            await dateTimeSelectorPo.selectPreviousYearUsingAngularIcon(2020);
            await dateTimeSelectorPo.selectDateOnCalender(13);
            await dateTimeSelectorPo.selectTimeToggle();
            await dateTimeSelectorPo.setHour('05');
            await dateTimeSelectorPo.setMinute(14);
            await dateTimeSelectorPo.clickMeridianValue("PM");
            await $('body').sendKeys(protractor.Key.ESCAPE);
            await utilityGrid.addFilter("Priority", "Low", "test");
            expect(await utilityGrid.isGridRecordPresent(caseId.displayId)).toBeTruthy();
        });
        it('[DRDMV-23493]: Verify records are fetched on case console Target date and Request ID combinations', async () => {
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter("Category Tier 1", "Applications", "test");
            await utilityGrid.addFilter("Category Tier 2", "Social", "test");
            await utilityGrid.addFilter("Category Tier 3", "Chatter", "test");
            await utilityGrid.addFilter("Company", "Petramco", "test");
            await utilityGrid.addFilter("Status", "Assigned", "test");
            await utilityGrid.addFilter("Priority", "Low", "checkbox");
            await utilityGrid.addFilter("Summary", "Test123", "test");
            await utilityGrid.addFilter("Assigned Group", "US Support 3", "test");
            await utilityGrid.addFilter("Assignee", "Qadim Katawazi", "test");

        });
        it('[DRDMV-23493]: Verify records are fetched on case console Target date and Request ID combinations', async () => {
            await utilityGrid.addFilter("Requester", "Qianru Tao", "test");
            await utilityGrid.addFilter("Source", "Agent", "test");
            await utilityGrid.addFilter("Label", menuItemName, "test");
            await utilityGrid.addFilter("SLM Status", "Service Targets Not Attached", "checkbox");
            await utilityGrid.addFilter("Assignee Login Name", "qkatawazi", "test");
            await utilityGrid.addFilter("Region", "North America", "test");
            await utilityGrid.addFilter("Case Site", "Austin", "test");
            await utilityGrid.addFilter("ID", caseId.id, "test");
            expect(await utilityGrid.isGridRecordPresent(caseId.displayId)).toBeTruthy();
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
                "category1": "Applications",
                "category2": "Social",
                "category3": "Chatter",
                "targetDate": "2020-10-13T11:44:00.000Z",
            };
            let caseData1 = {
                "Requester": "Fritz",
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
            await dateTimeSelectorPo.selectPreviousMonthUsingAngularIcon("october");
            await dateTimeSelectorPo.selectPreviousYearUsingAngularIcon(2020);
            await dateTimeSelectorPo.selectDateOnCalender(13);
            await dateTimeSelectorPo.selectTimeToggle();
            await dateTimeSelectorPo.setHour('05');
            await dateTimeSelectorPo.setMinute(14);
            await dateTimeSelectorPo.clickMeridianValue("PM");
            await $('body').sendKeys(protractor.Key.ESCAPE);
        });
        it('[DRDMV-23496]: Verify records are fetched on task console with Targeted Date, Priority and status combinations', async () => {
            expect(await utilityGrid.isGridRecordPresent(tempIdMedium.displayId)).toBeTruthy();
            await utilityGrid.addFilter("Priority", 'Medium', "checkbox");
            await utilityGrid.addFilter("Status", 'Pending', "test");
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
            await utilityGrid.addFilter("Category Tier 1", "Applications", "test");
            await utilityGrid.addFilter("Category Tier 2", "Social", "test");
            await utilityGrid.addFilter("Category Tier 3", "Chatter", "test");
            await utilityGrid.addFilter("ID", tempIdLow.id, "test");
            await utilityGrid.addFilter("Assignee Login Name", "qkatawazi", "test");
            expect(await utilityGrid.isGridRecordPresent(tempIdMedium.displayId)).toBeTruthy();
        });
    });
});  