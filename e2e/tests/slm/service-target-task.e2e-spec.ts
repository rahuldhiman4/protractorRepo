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
import { BWF_BASE_URL } from '../../utils/constants';
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
    describe('[DRDMV-13055]: Create a SVT for tasks type= Manual, Verify Task SLM for Manual Task and Automated Task', async () => {
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
        it('[DRDMV-13055]: Create SVT', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            //Create a SVT with 2 mins timeline
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Task Management');
            await slmExpressionBuilder.selectExpressionQualification('Task Type', '=', 'SELECTION', 'Manual');
            await slmExpressionBuilder.clickOnAddExpressionButton('SELECTION');
            let selectedExp: string = await slmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Task Type" + "'" + "=" + '"' + "Manual" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await slmExpressionBuilder.clickOnSaveExpressionButtonForTask();
            await serviceTargetConfig.selectGoal("2");
            await serviceTargetConfig.selectMeasurement();
            await serviceTargetConfig.selectExpressionForMeasurementForTask(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurementForTask(1, "status", "=", "STATUS", "Completed");
            await serviceTargetConfig.selectExpressionForMeasurementForTask(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();
        });
        it('[DRDMV-13055]: Create a Case', async () => {
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
        it('[DRDMV-13055]: Add Tasks into Case', async () => {
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
        it('[DRDMV-13055]:Verify SVT applied on Manual Task', async () => {
            await updateStatusBladePo.changeCaseStatus('In Progress');
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
            await updateStatusBladePo.setStatusReason('Successful');
            await updateStatusBladePo.clickSaveStatus();
            await viewTask.clickOnViewCase();
            await viewCasePage.openTaskCard(1);
            await viewCasePage.clickOnTaskLink(automatedTaskTemp);
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBe(false);
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        });
    });

    //skhobrag
    describe('[DRDMV-13056]: Create a SVT for tasks type= Automated, verify Manual Task and Automated Task', async () => {
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
        it('[DRDMV-13056]: Create a SVT', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Task Management');
            await slmExpressionBuilder.selectExpressionQualification('Task Type', '=', 'SELECTION', 'Automated');
            await slmExpressionBuilder.clickOnAddExpressionButton('SELECTION');
            let selectedExp: string = await slmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Task Type" + "'" + "=" + '"' + "Automated" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await slmExpressionBuilder.clickOnSaveExpressionButtonForTask();
            await serviceTargetConfig.selectGoal("2");
            await serviceTargetConfig.selectMeasurement();
            await serviceTargetConfig.selectExpressionForMeasurementForTask(0, "status", "=", "STATUS", "Staged");
            await serviceTargetConfig.selectExpressionForMeasurementForTask(1, "status", "=", "STATUS", "Completed");
            await serviceTargetConfig.selectExpressionForMeasurementForTask(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();
        });
        it('[DRDMV-13056]: Create a Case', async () => {
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
        it('[DRDMV-13056]: Add tasks to case', async () => {
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
        it('[DRDMV-13056]: Verify SVT attached on Automated task', async () => {
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
            await viewCasePage.openTaskCard(1);
            await viewCasePage.clickOnTaskLink(manualTaskTemp);
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBe(false);
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        });
    });

    //skhobrag
    describe('[DRDMV-13064]: UI Validation for Qualification builder for Task SVT', async () => {
        let firstLevelAssociationFields: string[] = ["Assigned Business Unit", "Assigned Department", "Assigned Group", "Category Tier 1", "Category Tier 2", "Category Tier 3", "Category Tier 4", "Created Date", "Label", "Modified By", "Priority", "Status", "Status Reason", "Task Region", "Task Type"];
        let secondLevelAssociationFields: string[] = ["Assigned Company", "Company", "Requester", "Site"];
        let expressionOperatorFields: string[] = ["(", ")", ">", "<", "=", "!=", ">=", "<=", "LIKE", "AND", "OR", "NOT", "NEW VALUE", "OLD VALUE"];
        it('[DRDMV-13064]: Verify Qualification Builder UI for Task SVT', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            //Create a SVT with 2 mins timeline
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Task Management');
            let expressionFieldsVal1 = await slmExpressionBuilder.getExpressionFieldAvailableAll(firstLevelAssociationFields);
            expect(expressionFieldsVal1).toBeTruthy('Expression Builder fields does not matches.');
            let expressionFieldsVal2 = await slmExpressionBuilder.getFirstLevelExpressionFieldAll(secondLevelAssociationFields);
            expect(expressionFieldsVal2).toBeTruthy('First Level Expression Builder fields does not matches.');
            let expressionOperatorsVal = await slmExpressionBuilder.getExpressionFieldOperatorAvailableAll(expressionOperatorFields);
            expect(expressionOperatorsVal).toBeTruthy('Expression Builder Operators does not matches.');
        });
    });

    //skhobrag
    describe('[DRDMV-13029,DRDMV-13035,DRDMV-13065]: Task SLA Progress bar shows status like In Process/Warning/Missed-Goal//Missed and check Console Overall status with respect to Task SLA status', async () => {
        let summary = 'Adhoc task' + Math.floor(Math.random() * 1000000);
        let taskId: string = '';
        let slmStatusWithinTimeLimitArr: string[] = ["Within Time Limit"];
        let slmStatusWarningArr: string[] = ["Warning"];
        let slmStatusBreachedArr: string[] = ["Breached"];
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteServiceTargets();
        });
        it('[DRDMV-13029,DRDMV-13035,DRDMV-13065]: Create SVT', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Task Management');
            await slmExpressionBuilder.selectExpressionQualification('Priority', '=', 'SELECTION', 'Critical');
            await slmExpressionBuilder.clickOnAddExpressionButton('SELECTION');
            let selectedExp: string = await slmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Priority" + "'" + "=" + '"' + "Critical" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await slmExpressionBuilder.clickOnSaveExpressionButtonForTask();
            await serviceTargetConfig.selectGoal("4");
            await serviceTargetConfig.selectMeasurement();
            await serviceTargetConfig.selectExpressionForMeasurementForTask(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurementForTask(1, "status", "=", "STATUS", "Completed");
            await serviceTargetConfig.selectExpressionForMeasurementForTask(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();
        });
        it('[DRDMV-13029,DRDMV-13035,DRDMV-13065]: Create a Case', async () => {
            await browser.sleep(1000);
            await navigationPage.signOut();
            await loginPage.login(caseAgentUser);
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Qiang Du');
            await createCasePage.setPriority('Critical');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
        });
        it('[DRDMV-13029,DRDMV-13035,DRDMV-13065]: Create Adhoc Task', async () => {
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
        it('[DRDMV-13029,DRDMV-13035,DRDMV-13065]: Verify SVT status on task console when SVT condition is Met', async () => {
            await updateStatusBladePo.changeCaseStatus('In Progress');
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
            await utilityGrid.clearFilter();
            await utilityGrid.searchRecord(taskId);
            expect(await utilityGrid.getAllValuesFromColumn('SLM Status')).toEqual(slmStatusWithinTimeLimitArr);
            await utilityGrid.searchAndOpenHyperlink(taskId);
            await viewTask.clickOnChangeStatus();
            await viewTask.changeTaskStatus('Pending');
            await updateStatusBladePo.clickSaveStatus();
            expect(await slmProgressBar.isSLAProgressBarPausedIconDisplayed()).toBe(true); //green
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchRecord(taskId);
            expect(await utilityGrid.getAllValuesFromColumn('SLM Status')).toEqual(slmStatusWithinTimeLimitArr);
            await utilityGrid.searchAndOpenHyperlink(taskId);
            await viewTask.clickOnChangeStatus();
            await viewTask.changeTaskStatus('Completed');
            await updateStatusBladePo.setStatusReason('Successful');
            await updateStatusBladePo.clickSaveStatus();
            expect(await slmProgressBar.isSLAProgressBarSVTMetIconDisplayed()).toBe(true); //green
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchRecord(taskId);
            expect(await utilityGrid.getAllValuesFromColumn('SLM Status')).toEqual(slmStatusWithinTimeLimitArr);
        });
        it('[DRDMV-13029,DRDMV-13035,DRDMV-13065]: Create another case with adhoc task', async () => {
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
        it('[DRDMV-13029,DRDMV-13035,DRDMV-13065]: Change the status of Case to trigger SVT on Task', async () => {
            await browser.sleep(32000);
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            await viewCasePage.clickOnTaskLink(summary);
            taskId = await viewTask.getTaskID();
            await browser.sleep(70000);
        })
        it('[DRDMV-13029,DRDMV-13035,DRDMV-13065]: Verify Task SLM Status "Warning" on Task Console', async () => {
            await browser.sleep(70000);
            await navigationPage.gotoTaskConsole();
            await taskConsolePage.searchAndOpenTask(taskId);
            expect(await slmProgressBar.isSLAProgressBarWarningIconDisplayed()).toBe(true);
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchRecord(taskId);
            expect(await utilityGrid.getAllValuesFromColumn('SLM Status')).toEqual(slmStatusWarningArr);
            await utilityGrid.searchAndOpenHyperlink(taskId);
        });
        it('[DRDMV-13029,DRDMV-13035,DRDMV-13065]: Verify Task SLM Status "Warning Pending" on Task Console', async () => {
            await viewTask.clickOnChangeStatus();
            await viewTask.changeTaskStatus('Pending');
            await updateStatusBladePo.clickSaveStatus();
            expect(await slmProgressBar.isSLAProgressBarPausedIconDisplayed()).toBe(true); //green
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchRecord(taskId);
            expect(await utilityGrid.getAllValuesFromColumn('SLM Status')).toEqual(slmStatusWarningArr);
            await utilityGrid.searchAndOpenHyperlink(taskId);
        });
        it('[DRDMV-13029,DRDMV-13035,DRDMV-13065]: Verify Task SLM Status "Missed Goal" on Task Console ', async () => {
            await viewTask.clickOnChangeStatus();
            await viewTask.changeTaskStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            await browser.sleep(90000);
            await navigationPage.gotoTaskConsole();
            await taskConsolePage.searchAndOpenTask(taskId);
            expect(await slmProgressBar.isSLAProgressBarMissedGoalIconDisplayed()).toBe(true);
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchRecord(taskId);
            expect(await utilityGrid.getAllValuesFromColumn('SLM Status')).toEqual(slmStatusBreachedArr);
            await utilityGrid.searchAndOpenHyperlink(taskId);
        });
        it('[DRDMV-13029,DRDMV-13035,DRDMV-13065]: Verify Task SLM Status "Missed Goal" on Task Console ', async () => {
            await viewTask.clickOnChangeStatus();
            await viewTask.changeTaskStatus('Pending');
            await updateStatusBladePo.clickSaveStatus();
            expect(await slmProgressBar.isSLAProgressBarPausedIconDisplayed()).toBe(true); //green
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchRecord(taskId);
            expect(await utilityGrid.getAllValuesFromColumn('SLM Status')).toEqual(slmStatusBreachedArr);
        })
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        });
    });

    describe('[DRDMV-13058]: Create a SVT for Task where build expression has Custom Status', async () => {
        let summary = 'Adhoc task' + Math.floor(Math.random() * 1000000);
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteServiceTargets();
        });
        it('[DRDMV-13058]: Create Custom Status configuration for Task', async () => {
            await navigationPage.signOut();
            await loginPage.login(psilonCaseBAUser);
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Status Configuration', 'Configure Task Status Tranistions - Business Workflows');
            await statusConfig.setCompanyDropdown('Psilon', 'task');
            await statusConfig.clickEditLifeCycleLink();
            await statusConfig.addCustomStatus('Staged', 'Assigned', 'Planning');
            await statusConfig.addCustomStatus('In Progress', 'Completed', 'BeforeCompleted');
        });
        it('[DRDMV-13058]: Create SVT', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Psilon', 'Task Management');
            await slmExpressionBuilder.selectExpressionQualification('Priority', '=', 'SELECTION', 'Critical');
            await slmExpressionBuilder.clickOnAddExpressionButton('SELECTION');
            let selectedExp: string = await slmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Priority" + "'" + "=" + '"' + "Critical" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await slmExpressionBuilder.clickOnSaveExpressionButtonForTask();
            await serviceTargetConfig.selectGoal("3");
            await serviceTargetConfig.selectMeasurement();
            await serviceTargetConfig.selectExpressionForMeasurementForTask(0, "status", "=", "STATUS", "Planning");
            await serviceTargetConfig.selectExpressionForMeasurementForTask(1, "status", "=", "STATUS", "BeforeCompleted");
            await serviceTargetConfig.selectExpressionForMeasurementForTask(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();
        });
        it('[DRDMV-13058]: Create a Case', async () => {
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
        it('[DRDMV-13058]: Create Adhoc Task', async () => {
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
        it('[DRDMV-13058]:Create a SVT for Task where build expression has Custom Status', async () => {
            await updateStatusBladePo.changeCaseStatus('In Progress');
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
