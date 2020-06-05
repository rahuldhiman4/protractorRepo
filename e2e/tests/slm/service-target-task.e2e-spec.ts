import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import previewCasePo from '../../pageobject/case/case-preview.po';
import createCasePage from '../../pageobject/case/create-case.po';
import { default as viewCasePage, default as viewCasePo } from '../../pageobject/case/view-case.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import updateStatusBladePo from '../../pageobject/common/update.status.blade.po';
import serviceTargetConfig from '../../pageobject/settings/slm/service-target-blade.po';
import SlmExpressionBuilder from '../../pageobject/settings/slm/slm-expressionbuilder.pop.po';
import slmProgressBar from '../../pageobject/slm/slm-progressbar.po';
import adhoctaskTemplate from "../../pageobject/task/create-adhoc-task.po";
import { default as manageTask, default as manageTaskBladePo } from "../../pageobject/task/manage-task-blade.po";
import viewTask from "../../pageobject/task/view-task.po";
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';

let caseBAUser = 'qkatawazi';
let caseAgentUser = 'qtao';

describe('Service Target Tests for Tasks', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login(caseBAUser);
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteApprovalMapping();
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    //skhobrag
    describe('[DRDMV-13029]:Create a SVT for Tasks- Create Task and Check SLA progress Bar', async () => {
        let summary = 'Adhoc task' + Math.floor(Math.random() * 1000000);

        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteServiceTargets();
        });

        it('Create SVT', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Task Management');
            await SlmExpressionBuilder.selectExpressionQualification('Priority', '=', 'SELECTION', 'Critical');
            await SlmExpressionBuilder.clickOnAddExpressionButton('SELECTION');
            let selectedExp: string = await SlmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Priority" + "'" + "=" + '"' + "Critical" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButtonForTask();
            await serviceTargetConfig.selectGoal("2");
            await serviceTargetConfig.selectMileStone();
            await serviceTargetConfig.selectExpressionForMeasurementForTask(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurementForTask(1, "status", "=", "STATUS", "Completed");
            await serviceTargetConfig.selectExpressionForMeasurementForTask(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();
        });

        it('Create a Case', async () => {
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

        it('Create Adhoc Task', async () => {
            await previewCasePo.clickGoToCaseButton();
            await viewCasePage.clickAddTaskButton();
            await manageTask.clickAddAdhocTaskButton();
            await adhoctaskTemplate.setSummary(summary);
            await adhoctaskTemplate.setDescription("Description");
            await adhoctaskTemplate.selectPriority('Critical');
            await adhoctaskTemplate.selectCategoryTier1('Applications');
            await adhoctaskTemplate.selectCategoryTier2('Social');
            await adhoctaskTemplate.selectCategoryTier3('Chatter');
            await adhoctaskTemplate.clickSaveAdhoctask();
            await manageTaskBladePo.clickCloseButton();
        });

        it('[DRDMV-13029]:Verify SVT attached on task', async () => {
            await browser.sleep(32000);
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
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        });

    });

    //skhobrag
    describe('[DRDMV-13055]:Create a SVT for tasks type= Manual, Verify Task SLM for Manual Task and Automated Task', async () => {
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

        it('Create SVT', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            //Create a SVT with 2 mins timeline
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Task Management');
            await SlmExpressionBuilder.selectExpressionQualification('Task Type', '=', 'SELECTION', 'Manual');
            await SlmExpressionBuilder.clickOnAddExpressionButton('SELECTION');
            let selectedExp: string = await SlmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Task Type" + "'" + "=" + '"' + "Manual" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButtonForTask();
            await serviceTargetConfig.selectGoal("2");
            await serviceTargetConfig.selectMileStone();
            await serviceTargetConfig.selectExpressionForMeasurementForTask(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurementForTask(1, "status", "=", "STATUS", "Completed");
            await serviceTargetConfig.selectExpressionForMeasurementForTask(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();
        });

        it('Create a Case', async () => {
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

        it('Add Tasks into Case', async () => {
            await viewCasePage.clickAddTaskButton();
            //Add Manual task and Automation Task in Case
            await manageTask.addTaskFromTaskTemplate(manualTaskTemp)
            await manageTask.addTaskFromTaskTemplate(automatedTaskTemp);
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
            await viewTask.clickOnSaveStatus();
            await viewTask.clickOnViewCase();
            await viewCasePage.openTaskCard(1);
            await viewCasePage.clickOnTaskLink(automatedTaskTemp);
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBe(false);
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        });
    });

    //skhobrag
    describe('[DRDMV-13056]:Create a SVT for tasks type= Automated, verify Manual Task and Automated Task', async () => {
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

        it('Create a SVT', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Task Management');
            await SlmExpressionBuilder.selectExpressionQualification('Task Type', '=', 'SELECTION', 'Automated');
            await SlmExpressionBuilder.clickOnAddExpressionButton('SELECTION');
            let selectedExp: string = await SlmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Task Type" + "'" + "=" + '"' + "Automated" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButtonForTask();
            await serviceTargetConfig.selectGoal("2");
            await serviceTargetConfig.selectMileStone();
            await serviceTargetConfig.selectExpressionForMeasurementForTask(0, "status", "=", "STATUS", "Staged");
            await serviceTargetConfig.selectExpressionForMeasurementForTask(1, "status", "=", "STATUS", "Completed");
            await serviceTargetConfig.selectExpressionForMeasurementForTask(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();
            // await utilityCommon.refresh();
        });

        it('Create a Case', async () => {
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

        it('Add tasks to case', async () => {
            await viewCasePage.clickAddTaskButton();
            await manageTask.addTaskFromTaskTemplate(automatedTaskTemp)
            await manageTask.addTaskFromTaskTemplate(manualTaskTemp);
            expect(await manageTask.isTaskLinkPresent(manualTaskTemp)).toBeTruthy(manualTaskTemp + ' Task is not added to case');
            expect(await manageTask.isTaskLinkPresent(automatedTaskTemp)).toBeTruthy(automatedTaskTemp + ' Task is not added to case');
            await manageTaskBladePo.clickCloseButton();
            await browser.sleep(32000);
        });

        it('[DRDMV-13056]:Verify SVT attached on Automated task', async () => {
            await viewCasePage.clickOnTaskLink(automatedTaskTemp);
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBe(true);
            expect(await slmProgressBar.isSLAProgressBarInProcessIconDisplayed()).toBe(true); //green
            expect(await viewCasePo.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)');
            expect(await slmProgressBar.isSVTToolTipTextDisplayed()).toBeTruthy("SVT ToolTip Text is not displayed.");
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('SVT from Protractor');
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('Status : InProcess');
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('due on');
            await utilityCommon.refresh();
            await viewTask.getTaskTypeValue();
            await viewTask.clickOnViewCase();
            await viewCasePage.openTaskCard(1);
            await viewCasePage.clickOnTaskLink(manualTaskTemp);
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBe(false);
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        });
    });

    //skhobrag
    describe('[DRDMV-13064]:UI Validation for Qualification builder for Task SVT', async () => {
        let firstLevelAssociationFields: string[] = ["Assigned Business Unit", "Assigned Department", "Assigned Group", "Category Tier 1", "Category Tier 2", "Category Tier 3", "Category Tier 4", "Created Date", "Label", "Modified By", "Priority", "Status", "Status Reason", "Task Region", "Task Type"];
        let secondLevelAssociationFields: string[] = ["Assigned Company", "Company", "Requester", "Site"];
        let expressionOperatorFields: string[] = ["(", ")", ">", "<", "=", "!=", ">=", "<=", "LIKE", "AND", "OR", "NOT", "NEW VALUE", "OLD VALUE"];

        it('[DRDMV-13064]:Verify Qualification Builder UI for Task SVT', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            //Create a SVT with 2 mins timeline
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Task Management');
            let expressionFieldsVal1 = await SlmExpressionBuilder.getExpressionFieldAvailableAll(firstLevelAssociationFields);
            expect(expressionFieldsVal1).toBeTruthy('Expression Builder fields does not matches.');
            let expressionFieldsVal2 = await SlmExpressionBuilder.getFirstLevelExpressionFieldAll(secondLevelAssociationFields);
            expect(expressionFieldsVal2).toBeTruthy('First Level Expression Builder fields does not matches.');
            let expressionOperatorsVal = await SlmExpressionBuilder.getExpressionFieldOperatorAvailableAll(expressionOperatorFields);
            expect(expressionOperatorsVal).toBeTruthy('Expression Builder Operators does not matches.');
        });

    });

    describe('[DRDMV-13035]:Task SLA Progress bar shows status like In Process/Warning/Missed-Goal//Missed and check Console Overall status with respect to Task SLA status', async () => {
        let summary = 'Adhoc task' + Math.floor(Math.random() * 1000000);

        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteServiceTargets();
        });

        it('Create SVT', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Task Management');
            await SlmExpressionBuilder.selectExpressionQualification('Priority', '=', 'SELECTION', 'Critical');
            await SlmExpressionBuilder.clickOnAddExpressionButton('SELECTION');
            let selectedExp: string = await SlmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Priority" + "'" + "=" + '"' + "Critical" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButtonForTask();
            await serviceTargetConfig.selectGoal("4");
            await serviceTargetConfig.selectMileStone();
            await serviceTargetConfig.selectExpressionForMeasurementForTask(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurementForTask(1, "status", "=", "STATUS", "Completed");
            await serviceTargetConfig.selectExpressionForMeasurementForTask(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();
        });

        it('Create a Case', async () => {
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

        it('Create Adhoc Task', async () => {
            await previewCasePo.clickGoToCaseButton();
            await browser.sleep(5000);
            let caseId:string = await viewCasePage.getCaseID();
            await viewCasePage.clickAddTaskButton();
            await manageTask.clickAddAdhocTaskButton();
            await adhoctaskTemplate.setSummary(summary);
            await adhoctaskTemplate.setDescription("Description");
            await adhoctaskTemplate.selectPriority('Critical');
            await adhoctaskTemplate.selectCategoryTier1('Applications');
            await adhoctaskTemplate.selectCategoryTier2('Social');
            await adhoctaskTemplate.selectCategoryTier3('Chatter');
            await adhoctaskTemplate.clickSaveAdhoctask();
            await manageTaskBladePo.clickCloseButton();           
        });

        it('[DRDMV-13035]:Verify SVT attached on task', async () => {
            await browser.sleep(32000);
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            await viewCasePage.clickOnTaskLink(summary);
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBe(true);
            expect(await slmProgressBar.isSLAProgressBarInProcessIconDisplayed()).toBe(true); //green
            await viewTask.clickOnChangeStatus();
            await viewTask.changeTaskStatus('Pending');
            await viewTask.clickOnSaveStatus();
            expect(await slmProgressBar.isSLAProgressBarPausedIconDisplayed()).toBe(true); //green
            await viewTask.clickOnChangeStatus();
            await viewTask.changeTaskStatus('In Progress');
            await viewTask.clickOnSaveStatus();
            await browser.sleep(180000);
            expect(await slmProgressBar.isSLAProgressBarWarningIconDisplayed()).toBe(true);
            await browser.sleep(40000);
            await utilityCommon.refresh();
            expect(await slmProgressBar.isSLAProgressBarMissedGoalIconDisplayed()).toBe(true);


        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        });
    });

})
