import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import previewCasePo from '../../pageobject/case/case-preview.po';
import createCasePage from '../../pageobject/case/create-case.po';
import { default as viewCasePage, default as viewCasePo } from '../../pageobject/case/view-case.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import updateStatusBladePo from '../../pageobject/common/update.status.blade.po';
import statusConfig from "../../pageobject/settings/common/status-config.po";
import serviceTargetConfig from '../../pageobject/settings/slm/service-target-blade.po';
import slmExpressionBuilder from '../../pageobject/settings/slm/slm-expressionbuilder.pop.po';
import slmProgressBar from '../../pageobject/slm/slm-progressbar.po';
import adhoctaskTemplate from "../../pageobject/task/create-adhoc-task.po";
import { default as manageTask, default as manageTaskBladePo } from "../../pageobject/task/manage-task-blade.po";
import viewTask from "../../pageobject/task/view-task.po";
import taskConsolePage from "../../pageobject/task/console-task.po";
import { BWF_BASE_URL, BWF_PAGE_TITLES } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';


let caseBAUser = 'qkatawazi';
let caseAgentUser = 'qtao';
let psilonCaseBAUser = 'gderuno';
let psilonCaseAgentUser = 'werusha';

describe('Service Target Tests for Tasks', () => {
    const caseModule = 'Case';

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login(caseBAUser);
        await apiHelper.apiLogin(caseBAUser);
        await apiHelper.deleteApprovalMapping(caseModule);
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //skhobrag
    describe('[4907]: Create a SVT for tasks type= Manual, Verify Task SLM for Manual Task and Automated Task', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let manualTaskTemp = `manualTaskTemplateActive ${randomStr}`;
        let automatedTaskTemp = `AutomatedTaskTemplateActive ${randomStr}`;
        beforeAll(async () => {
            let templateData = {
                "templateName": `manualTaskTemplateActive ${randomStr}`,
                "templateSummary": `manualTaskTemplateActive ${randomStr}`,
                "templateStatus": "Active",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            let templateData1 = {
                "templateName": `AutomatedTaskTemplateActive ${randomStr}`,
                "templateSummary": `AutomatedTaskTemplateActive ${randomStr}`,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": `Case Process 1 ${randomStr}`,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }

            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createAutomatedTaskTemplate(templateData1);
            await apiHelper.createManualTaskTemplate(templateData);
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteServiceTargets();
        });
        it('[4907]: Create SVT', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', BWF_PAGE_TITLES.SERVICE_LEVEL_MANAGEMENT.SERVICE_TARGET);
            //Create a SVT with 2 mins timeline
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Task Management');
            await slmExpressionBuilder.selectExpressionQualificationForTask('Task Type', '=','Manual',"Direct");
            let selectedExp: string = await slmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Task Type" + "'" + "=" + '"' + "Manual" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await slmExpressionBuilder.clickOnSaveExpressionButtonForTask();
            await serviceTargetConfig.selectGoal("2");
            await serviceTargetConfig.selectMeasurement();
            await serviceTargetConfig.selectExpressionForMeasurementForTask(0, "Status", "=", "Assigned","Direct");
            await serviceTargetConfig.selectExpressionForMeasurementForTask(1, "Status", "=", "Completed","Direct");
            await serviceTargetConfig.selectExpressionForMeasurementForTask(2, "Status", "=", "Pending","Direct");
            await serviceTargetConfig.clickOnSaveSVTButton();
        });
        it('[4907]: Create a Case', async () => {
            // Create a Case
            await browser.sleep(1000);
            await navigationPage.signOut();
            await loginPage.login(caseAgentUser);
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Qiang Du');
            await createCasePage.setPriority('Critical');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
        });
        it('[4907]: Add Tasks into Case', async () => {
            await viewCasePage.clickAddTaskButton();
            //Add Manual task and Automation Task in Case
            await manageTask.addTaskFromTaskTemplate(manualTaskTemp);
            await manageTask.waitUntilNumberOfTaskLinkAppear(1);
            await manageTask.addTaskFromTaskTemplate(automatedTaskTemp);
            await manageTask.waitUntilNumberOfTaskLinkAppear(2);
            expect(await manageTask.isTaskLinkPresent(manualTaskTemp)).toBeTruthy(manualTaskTemp + ' Task is not added to case');
            expect(await manageTask.isTaskLinkPresent(automatedTaskTemp)).toBeTruthy(automatedTaskTemp + ' Task is not added to case');
            await manageTaskBladePo.clickCloseButton();
            await browser.sleep(32000);
        });
        it('[4907]:Verify SVT applied on Manual Task', async () => {
            await updateStatusBladePo.changeStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            await viewCasePage.clickOnTaskLink(manualTaskTemp);
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBe(true);
            expect(await slmProgressBar.isSLAProgressBarInProcessIconDisplayed()).toBe(true); //green
            expect(await viewCasePo.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)');
            expect(await slmProgressBar.isSVTToolTipTextDisplayed()).toBeTruthy("SVT ToolTip Text is not displayed.");
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('SVT from Protractor');
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('Status : InProcess');
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('due on');
            await viewTask.clickOnChangeStatus();
            await viewTask.changeTaskStatus('Completed');
            await updateStatusBladePo.selectStatusReason('Successful');
            await updateStatusBladePo.clickSaveStatus();
            await viewTask.clickOnViewCase();
            await navigationPage.gotoTaskConsole();
            await taskConsolePage.searchAndOpenTask(automatedTaskTemp);
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBe(false);
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        });
    });

    //skhobrag
    describe('[4906]: Create a SVT for tasks type= Automated, verify Manual Task and Automated Task', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let manualTaskTemp = `manualTaskTemplateActive ${randomStr}`;
        let automatedTaskTemp = `AutomatedTaskTemplateActive ${randomStr}`;
        beforeAll(async () => {
            let templateData = {
                "templateName": `manualTaskTemplateActive ${randomStr}`,
                "templateSummary": `manualTaskTemplateActive ${randomStr}`,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            let templateData1 = {
                "templateName": `AutomatedTaskTemplateActive ${randomStr}`,
                "templateSummary": `AutomatedTaskTemplateActive ${randomStr}`,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": `Case Process 1 ${randomStr}`,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }

            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createAutomatedTaskTemplate(templateData1);
            await apiHelper.createManualTaskTemplate(templateData);
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteServiceTargets();
        });
        it('[4906]: Create a SVT', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', BWF_PAGE_TITLES.SERVICE_LEVEL_MANAGEMENT.SERVICE_TARGET);
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Task Management');
            await slmExpressionBuilder.selectExpressionQualification('Task Type', '=', 'Automated',"Direct");
            let selectedExp: string = await slmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Task Type" + "'" + "=" + '"' + "Automated" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await slmExpressionBuilder.clickOnSaveExpressionButtonForTask();
            await serviceTargetConfig.selectGoal("2");
            await serviceTargetConfig.selectMeasurement();
            await serviceTargetConfig.selectExpressionForMeasurementForTask(0, "Status", "=", "Staged","Direct");
            await serviceTargetConfig.selectExpressionForMeasurementForTask(1, "Status", "=", "Completed","Direct");
            await serviceTargetConfig.selectExpressionForMeasurementForTask(2, "Status", "=", "Pending","Direct");
            await serviceTargetConfig.clickOnSaveSVTButton();
        });
        it('[4906]: Create a Case', async () => {
            await browser.sleep(1000);
            await navigationPage.signOut();
            await loginPage.login(caseAgentUser);
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Qiang Du');
            await createCasePage.setPriority('Critical');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
        });
        it('[4906]: Add tasks to case', async () => {
            await viewCasePage.clickAddTaskButton();
            await manageTask.addTaskFromTaskTemplate(automatedTaskTemp);
            await manageTask.waitUntilNumberOfTaskLinkAppear(1);
            await manageTask.addTaskFromTaskTemplate(manualTaskTemp);
            await manageTask.waitUntilNumberOfTaskLinkAppear(2);
            expect(await manageTask.isTaskLinkPresent(manualTaskTemp)).toBeTruthy(manualTaskTemp + ' Task is not added to case');
            expect(await manageTask.isTaskLinkPresent(automatedTaskTemp)).toBeTruthy(automatedTaskTemp + ' Task is not added to case');
            await manageTaskBladePo.clickCloseButton();
            await browser.sleep(32000);
        });
        it('[4906]: Verify SVT attached on Automated task', async () => {
            await viewCasePage.clickOnTaskLink(automatedTaskTemp);
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBe(true);
            expect(await slmProgressBar.isSLAProgressBarInProcessIconDisplayed()).toBe(true); //green
            expect(await viewCasePo.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)');
            expect(await slmProgressBar.isSVTToolTipTextDisplayed()).toBeTruthy("SVT ToolTip Text is not displayed.");
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('SVT from Protractor');
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('Status : InProcess');
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('due on');
            await viewTask.getTaskTypeValue();
            await viewTask.clickOnViewCase();
            await navigationPage.gotoTaskConsole();
            await taskConsolePage.searchAndOpenTask(manualTaskTemp);
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBe(false);
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        });
    });

    //skhobrag
    describe('[4900]: UI Validation for Qualification builder for Task SVT', async () => {
        let firstLevelAssociationFields: string[] = ["Assigned Company", "Assigned Group", "Assigned Support Organization","Category Tier 1", "Category Tier 2", "Category Tier 3", "Category Tier 4","Company", "Label", "Priority","Requester","Site","State", "Status", "Status Reason","Target Date", "Task Region", "Task Type"];
        let expressionOperatorFields: string[] = ["(", ")", ">", "<", "=", "!=", ">=", "<=", "LIKE", "AND", "OR", "NOT", "NEW VALUE", "OLD VALUE"];

        it('[4900]: Verify Qualification Builder UI for Task SVT', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', BWF_PAGE_TITLES.SERVICE_LEVEL_MANAGEMENT.SERVICE_TARGET);
            //Create a SVT with 2 mins timeline
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Task Management');
            let expressionFieldsVal1 = await slmExpressionBuilder.getExpressionFieldAvailableAll(firstLevelAssociationFields);
            expect(expressionFieldsVal1).toBeTruthy('Expression Builder fields does not matches.');
            let expressionOperatorsVal = await slmExpressionBuilder.getExpressionFieldOperatorAvailableAll(expressionOperatorFields);
            expect(expressionOperatorsVal).toBeTruthy('Expression Builder Operators does not matches.');
        });

        afterAll(async () => {
            await utilityCommon.closeAllBlades();
        });

    });

    //skhobrag
    //Some Lines commented for grid console search since search is not returning desired results
    describe('[4920,4919,4899]: Task SLA Progress bar shows status like In Process/Warning/Missed-Goal//Missed and check Console Overall status with respect to Task SLA status', async () => {
        let summary = 'Adhoc task' + Math.floor(Math.random() * 1000000);
        let taskId: string = '';
        let slmStatusWithinTimeLimitArr: string[] = ["Within Time Limit"];
        let slmStatusWarningArr: string[] = ["Warning"];
        let slmStatusBreachedArr: string[] = ["Breached"];
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteServiceTargets();
        });
        it('[4920,4919,4899]: Create SVT', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', BWF_PAGE_TITLES.SERVICE_LEVEL_MANAGEMENT.SERVICE_TARGET);
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Task Management');
            await slmExpressionBuilder.selectExpressionQualification('Priority', '=', 'Critical',"Direct");
            let selectedExp: string = await slmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Priority" + "'" + "=" + '"' + "Critical" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await slmExpressionBuilder.clickOnSaveExpressionButtonForTask();
            await serviceTargetConfig.selectGoal("4");
            await serviceTargetConfig.selectMeasurement();
            await serviceTargetConfig.selectExpressionForMeasurementForTask(0, "Status", "=", "Assigned","Direct");
            await serviceTargetConfig.selectExpressionForMeasurementForTask(1, "Status", "=", "Completed","Direct");
            await serviceTargetConfig.selectExpressionForMeasurementForTask(2, "Status", "=", "Pending","Direct");
            await serviceTargetConfig.clickOnSaveSVTButton();
        });
        it('[4920,4919,4899]: Create a Case', async () => {
            await browser.sleep(1000);
            await navigationPage.signOut();
            await loginPage.login(caseAgentUser);
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Qiang Du');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.setPriority('Critical');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
        });
        it('[4920,4919,4899]: Create Adhoc Task', async () => {
            await previewCasePo.clickGoToCaseButton();
            await browser.sleep(2000);
            await viewCasePage.clickAddTaskButton();
            await manageTask.clickAddAdhocTaskButton();
            await adhoctaskTemplate.setSummary(summary);
            await adhoctaskTemplate.setDescription("Description");
            await adhoctaskTemplate.selectPriority('Critical');
            await adhoctaskTemplate.selectCategoryTier1('Applications');
            await adhoctaskTemplate.selectCategoryTier2('Social');
            await adhoctaskTemplate.selectCategoryTier3('Chatter');
            await adhoctaskTemplate.clickSaveAdhoctask();
            await utilityCommon.closePopUpMessage();
            await manageTaskBladePo.clickCloseButton();
            await browser.sleep(32000);
        });
        it('[4920,4919,4899]: Verify SVT status on task console when SVT condition is Met', async () => {
            await updateStatusBladePo.changeStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            await viewCasePage.clickOnTaskLink(summary);
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBe(true);
            expect(await slmProgressBar.isSLAProgressBarInProcessIconDisplayed()).toBe(true); //green
            expect(await viewCasePo.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)');
            expect(await slmProgressBar.isSVTToolTipTextDisplayed()).toBeTruthy("SVT ToolTip Text is not displayed.");
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('SVT from Protractor');
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('Status : InProcess');
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('due on');
            taskId = await viewTask.getTaskID();
            await navigationPage.gotoTaskConsole();
            // await utilityGrid.searchRecord(taskId);
            // expect(await utilityGrid.getAllValuesFromColumn('SLM Status')).toEqual(slmStatusWithinTimeLimitArr);
            await utilityGrid.searchAndOpenHyperlink(taskId);
            await viewTask.clickOnChangeStatus();
            await viewTask.changeTaskStatus('Pending');
            await updateStatusBladePo.clickSaveStatus();
            expect(await slmProgressBar.isSLAProgressBarPausedIconDisplayed()).toBe(true); //green
            await navigationPage.gotoTaskConsole();
            // await utilityGrid.searchRecord(taskId);
            // expect(await utilityGrid.getAllValuesFromColumn('SLM Status')).toEqual(slmStatusWithinTimeLimitArr);
            await utilityGrid.searchAndOpenHyperlink(taskId);
            await viewTask.clickOnChangeStatus();
            await viewTask.changeTaskStatus('Completed');
            await updateStatusBladePo.selectStatusReason('Successful');
            await updateStatusBladePo.clickSaveStatus();
            expect(await slmProgressBar.isSLAProgressBarSVTMetIconDisplayed()).toBe(true); //green
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchRecord(taskId);
            // expect(await utilityGrid.getAllValuesFromColumn('SLM Status')).toEqual(slmStatusWithinTimeLimitArr);
        });
        it('[4920,4919,4899]: Create another case with adhoc task', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Qiang Du');
            await createCasePage.setPriority('Critical');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await browser.sleep(2000);
            await viewCasePage.clickAddTaskButton();
            await manageTask.clickAddAdhocTaskButton();
            await adhoctaskTemplate.setSummary(summary);
            await adhoctaskTemplate.setDescription("Description");
            await adhoctaskTemplate.selectPriority('Critical');
            await adhoctaskTemplate.selectCategoryTier1('Applications');
            await adhoctaskTemplate.selectCategoryTier2('Social');
            await adhoctaskTemplate.selectCategoryTier3('Chatter');
            await adhoctaskTemplate.clickSaveAdhoctask();
            await utilityCommon.closePopUpMessage();
            await manageTaskBladePo.clickCloseButton();
        });
        it('[4920,4919,4899]: Change the status of Case to trigger SVT on Task', async () => {
            await browser.sleep(32000);
            await updateStatusBladePo.changeStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            await viewCasePage.clickOnTaskLink(summary);
            taskId = await viewTask.getTaskID();
            await browser.sleep(70000);  // sleep added to track SVT bar progress
        })
        it('[4920,4919,4899]: Verify Task SLM Status "Warning" on Task Console', async () => {
            await browser.sleep(80000); // sleep added to track SVT bar progress
            await navigationPage.gotoTaskConsole();
            await taskConsolePage.searchAndOpenTask(taskId);
            expect(await slmProgressBar.isSLAProgressBarWarningIconDisplayed()).toBe(true);
            await navigationPage.gotoTaskConsole();
            // await utilityGrid.searchRecord(taskId);
            // await utilityGrid.searchRecord(taskId);
            // expect(await utilityGrid.getAllValuesFromColumn('SLM Status')).toEqual(slmStatusWarningArr);
            await utilityGrid.searchAndOpenHyperlink(taskId);
        });
        it('[4920,4919,4899]: Verify Task SLM Status "Warning Pending" on Task Console', async () => {
            await viewTask.clickOnChangeStatus();
            await viewTask.changeTaskStatus('Pending');
            await updateStatusBladePo.clickSaveStatus();
            expect(await slmProgressBar.isSLAProgressBarPausedIconDisplayed()).toBe(true); //green
            await navigationPage.gotoTaskConsole();
            // await utilityGrid.searchRecord(taskId);
            // expect(await utilityGrid.getAllValuesFromColumn('SLM Status')).toEqual(slmStatusWarningArr);
            await utilityGrid.searchAndOpenHyperlink(taskId);
        });
        it('[4920,4919,4899]: Verify Task SLM Status "Missed Goal" on Task Console ', async () => {
            await viewTask.clickOnChangeStatus();
            await viewTask.changeTaskStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            await browser.sleep(80000);  // sleep added to track SVT bar progress
            await navigationPage.gotoTaskConsole();
            await taskConsolePage.searchAndOpenTask(taskId);
            expect(await slmProgressBar.isSLAProgressBarMissedGoalIconDisplayed()).toBe(true);
            await navigationPage.gotoTaskConsole();
            // await utilityGrid.searchRecord(taskId);
            // expect(await utilityGrid.getAllValuesFromColumn('SLM Status')).toEqual(slmStatusBreachedArr);
            await utilityGrid.searchAndOpenHyperlink(taskId);
        });
        it('[4920,4919,4899]: Verify Task SLM Status "Missed Goal" on Task Console ', async () => {
            await viewTask.clickOnChangeStatus();
            await viewTask.changeTaskStatus('Pending');
            await updateStatusBladePo.clickSaveStatus();
            expect(await slmProgressBar.isSLAProgressBarPausedIconDisplayed()).toBe(true); //green
            await navigationPage.gotoTaskConsole();
            // await utilityGrid.searchRecord(taskId);
            // expect(await utilityGrid.getAllValuesFromColumn('SLM Status')).toEqual(slmStatusBreachedArr);
        })
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        });
    });

    //defect 60046    
    describe('[4905]: Create a SVT for Task where build expression has Custom Status', async () => {
        let summary = 'Adhoc task' + Math.floor(Math.random() * 1000000);
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteServiceTargets();
        });
        it('[4905]: Create Custom Status configuration for Task', async () => {
            await navigationPage.signOut();
            await loginPage.login(psilonCaseBAUser);
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Status Configuration', BWF_PAGE_TITLES.TASK_MANAGEMENT.STATUS_CONFIGURATION);
            await statusConfig.setCompanyDropdown('Psilon', 'task');
            await statusConfig.clickEditLifeCycleLink();
            await statusConfig.addCustomStatus('Staged', 'Assigned', 'Planning');
            await statusConfig.clickEditLifeCycleLink();
            await statusConfig.addCustomStatus('In Progress', 'Completed', 'BeforeCompleted');
        });
        it('[4905]: Create SVT', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', BWF_PAGE_TITLES.SERVICE_LEVEL_MANAGEMENT.SERVICE_TARGET);
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Psilon', 'Task Management');
            await slmExpressionBuilder.selectExpressionQualification('Priority', '=', 'Critical',"Direct");
            let selectedExp: string = await slmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Priority" + "'" + "=" + '"' + "Critical" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await slmExpressionBuilder.clickOnSaveExpressionButtonForTask();
            await serviceTargetConfig.selectGoal("3");
            await serviceTargetConfig.selectMeasurement();
            await serviceTargetConfig.selectExpressionForMeasurementForTask(0, "Status", "=", "Planning","Direct");
            await serviceTargetConfig.selectExpressionForMeasurementForTask(1, "Status", "=", "BeforeCompleted","Direct");
            await serviceTargetConfig.selectExpressionForMeasurementForTask(2, "Status", "=", "Pending","Direct");
            await serviceTargetConfig.clickOnSaveSVTButton();
        });
        it('[4905]: Create a Case', async () => {
            await browser.sleep(1000);
            await navigationPage.signOut();
            await loginPage.login(psilonCaseAgentUser);
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Doomi Bomei');
            await createCasePage.setPriority('Critical');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
        });
        it('[4905]: Create Adhoc Task', async () => {
            await previewCasePo.clickGoToCaseButton();
            await browser.sleep(2000);
            await viewCasePage.clickAddTaskButton();
            await manageTask.clickAddAdhocTaskButton();
            await adhoctaskTemplate.setSummary(summary);
            await adhoctaskTemplate.setDescription("Description");
            await adhoctaskTemplate.selectPriority('Critical');
            await adhoctaskTemplate.selectCategoryTier1('Applications');
            await adhoctaskTemplate.selectCategoryTier2('Social');
            await adhoctaskTemplate.selectCategoryTier3('Chatter');
            await adhoctaskTemplate.clickSaveAdhoctask();
            await utilityCommon.closePopUpMessage();
            await manageTask.waitUntilNumberOfTaskLinkAppear(1);
            await manageTaskBladePo.clickCloseButton();
            await browser.sleep(32000);
        });
        it('[4905]:Create a SVT for Task where build expression has Custom Status', async () => {
            await updateStatusBladePo.changeStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            await viewCasePage.clickOnTaskLink(summary);
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBe(true);
            expect(await slmProgressBar.isSLAProgressBarInProcessIconDisplayed()).toBe(true); //green
            expect(await viewCasePo.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)');
            expect(await slmProgressBar.isSVTToolTipTextDisplayed()).toBeTruthy("SVT ToolTip Text is not displayed.");
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('SVT from Protractor');
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('Status : InProcess');
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('due on');
            await viewTask.clickOnChangeStatus();
            await viewTask.changeTaskStatus('Assigned');
            await updateStatusBladePo.clickSaveStatus();
            expect(await slmProgressBar.isSLAProgressBarInProcessIconDisplayed()).toBe(true); //green
            await viewTask.clickOnChangeStatus();
            await viewTask.changeTaskStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            expect(await slmProgressBar.isSLAProgressBarInProcessIconDisplayed()).toBe(true); //green
            await viewTask.clickOnChangeStatus();
            await viewTask.changeTaskStatus('BeforeCompleted');
            await updateStatusBladePo.clickSaveStatus();
            expect(await slmProgressBar.isSLAProgressBarSVTMetIconDisplayed()).toBe(true); //green
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        });
    });
});
