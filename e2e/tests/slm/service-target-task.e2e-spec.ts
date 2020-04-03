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

    beforeEach(async () => {
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteServiceTargets();
    });

    afterEach(async () => {
        await browser.refresh();
    });

    //skhobrag
    it('[DRDMV-13029]:Create a SVT for Tasks- Create Task and Check SLA progress Bar', async () => {
        try {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            //Create a SVT with 2 mins timeline
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

            await browser.sleep(2000);
            await navigationPage.signOut();
            await browser.refresh();

            // Create a Case
            await loginPage.login(caseAgentUser);
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Qiang Du');
            await createCasePage.setPriority('Critical');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            let summary = 'Adhoc task' + Math.floor(Math.random() * 1000000);
            await viewCasePage.clickAddTaskButton();
            await manageTask.clickAddAdhocTaskButton();
            await adhoctaskTemplate.setSummary(summary);
            await adhoctaskTemplate.setDescription("Description");
            await adhoctaskTemplate.selectPriority('Critical');
            await adhoctaskTemplate.selectCategoryTier1('Applications');
            await adhoctaskTemplate.selectCategoryTier2('Social');
            await adhoctaskTemplate.selectCategoryTier3('Chatter');
            //await adhoctaskTemplate.selectLabel('test');
            await adhoctaskTemplate.clickOnSaveAdhoctask();
            //Update the case status to In Progress
            await manageTaskBladePo.clickOnCloseButton();
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            await manageTask.clickTaskLinkOnManageTask(summary);
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBe(true);
            expect(await slmProgressBar.isSLAProgressBarInProcessIconDisplayed()).toBe(true); //green
            expect(await viewCasePo.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)');
            expect(await slmProgressBar.isSVTToolTipTextDisplayed()).toBeTruthy("SVT ToolTip Text is not displayed.");
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('SVT from Protractor');
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('Status : InProcess');
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('due on');
        }
        catch (error) {
            throw error;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        }

    }, 300 * 1000);

    //skhobrag
    it('[DRDMV-13055]:Create a SVT for tasks type= Manual, Verify Task SLM for Manual Task and Automated Task', async () => {
        try {
            let manualTaskTemplate = 'Manual task' + Math.floor(Math.random() * 1000000);
            let manualTaskSummary = 'Summary' + Math.floor(Math.random() * 1000000);
            let automationTaskTemplate = 'Automation task' + Math.floor(Math.random() * 1000000);
            let automationTaskSummary = 'Summary' + Math.floor(Math.random() * 1000000);
            let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');

            let templateData = {
                "templateName": `manualTaskTemplateActive ${randomStr}`,
                "templateSummary": `manualTaskTemplateActive ${randomStr}`,
                "templateStatus": "Active",
            }
            let templateData1 = {
                "templateName": `AutomatedTaskTemplateActive ${randomStr}`,
                "templateSummary": `AutomatedTaskTemplateActive ${randomStr}`,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": `Case Process 1 ${randomStr}`,
            }

            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createAutomatedTaskTemplate(templateData1);
            await apiHelper.createManualTaskTemplate(templateData);

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
            await browser.sleep(2000);
            await navigationPage.signOut();
            await browser.refresh();

            // Create a Case
            await loginPage.login(caseAgentUser);
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Qiang Du');
            await createCasePage.setPriority('Critical');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePage.clickAddTaskButton();

            let manualTaskTemp = `manualTaskTemplateActive ${randomStr}`;
            let automatedTaskTemp = `AutomatedTaskTemplateActive ${randomStr}`;

            //Add Manual task and Automation Task in Case
            await manageTask.addTaskFromTaskTemplate(manualTaskTemp)
            await manageTask.addTaskFromTaskTemplate(automatedTaskTemp);
            expect(await manageTask.isTaskLinkOnManageTask(manualTaskTemp)).toBeTruthy(manualTaskTemp + ' Task is not added to case');
            expect(await manageTask.isTaskLinkOnManageTask(automatedTaskTemp)).toBeTruthy(automatedTaskTemp + ' Task is not added to case');
            await manageTaskBladePo.clickOnCloseButton();

            //Update the case status to In Progress
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            await manageTask.clickTaskLinkOnManageTask(manualTaskTemp);
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
            await manageTask.clickTaskLinkOnManageTask(automatedTaskTemp);
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBe(false);
        }
        catch (error) {
            throw error;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        }

    }, 480 * 1000);

    //skhobrag
    it('[DRDMV-13056]:Create a SVT for tasks type= Automated, verify Manual Task and Automated Task', async () => {
        try {
            let manualTaskTemplate = 'Manual task' + Math.floor(Math.random() * 1000000);
            let manualTaskSummary = 'Summary' + Math.floor(Math.random() * 1000000);
            let automationTaskTemplate = 'Automation task' + Math.floor(Math.random() * 1000000);
            let automationTaskSummary = 'Summary' + Math.floor(Math.random() * 1000000);
            let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');

            let templateData = {
                "templateName": `manualTaskTemplateActive ${randomStr}`,
                "templateSummary": `manualTaskTemplateActive ${randomStr}`,
                "templateStatus": "Active",
            }
            let templateData1 = {
                "templateName": `AutomatedTaskTemplateActive ${randomStr}`,
                "templateSummary": `AutomatedTaskTemplateActive ${randomStr}`,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": `Case Process 1 ${randomStr}`,
            }

            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createAutomatedTaskTemplate(templateData1);
            await apiHelper.createManualTaskTemplate(templateData);

            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            //Create a SVT with 2 mins timeline
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
            await browser.sleep(2000);
            await navigationPage.signOut();
            await browser.refresh();

            // Create a Case
            await loginPage.login(caseAgentUser);
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Qiang Du');
            await createCasePage.setPriority('Critical');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePage.clickAddTaskButton();

            let manualTaskTemp = `manualTaskTemplateActive ${randomStr}`;
            let automatedTaskTemp = `AutomatedTaskTemplateActive ${randomStr}`;

            //Add Manual task and Automation Task in Case
            await manageTask.addTaskFromTaskTemplate(automatedTaskTemp)
            await manageTask.addTaskFromTaskTemplate(manualTaskTemp);
            expect(await manageTask.isTaskLinkOnManageTask(manualTaskTemp)).toBeTruthy(manualTaskTemp + ' Task is not added to case');
            expect(await manageTask.isTaskLinkOnManageTask(automatedTaskTemp)).toBeTruthy(automatedTaskTemp + ' Task is not added to case');
            await manageTaskBladePo.clickOnCloseButton();

            //Update the case status to In Progress
            await manageTask.clickTaskLinkOnManageTask(automatedTaskTemp);
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBe(true);
            expect(await slmProgressBar.isSLAProgressBarInProcessIconDisplayed()).toBe(true); //green
            expect(await viewCasePo.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)');
            expect(await slmProgressBar.isSVTToolTipTextDisplayed()).toBeTruthy("SVT ToolTip Text is not displayed.");
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('SVT from Protractor');
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('Status : InProcess');
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('due on');
            await browser.refresh();
            await viewTask.getTaskTypeValue();
            await viewTask.clickOnViewCase();
            await viewCasePage.openTaskCard(1);
            await manageTask.clickTaskLinkOnManageTask(manualTaskTemp);
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBe(false);
        }
        catch (error) {
            throw error;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        }

    }, 400 * 1000);

    //skhobrag
    it('[DRDMV-13064]:UI Validation for Qualification builder for Task SVT', async () => {
        try {
            let firstLevelAssociationFields: string[] = ["Assigned Business Unit", "Assigned Department", "Assigned Group", "Category Tier 1", "Category Tier 2", "Category Tier 3", "Category Tier 4", "Created Date", "Label", "Modified By", "Priority", "Status", "Status Reason", "Task Region", "Task Type"];
            let secondLevelAssociationFields: string[] = ["Assigned Company", "Company", "Requester", "Site"];
            let expressionOperatorFields: string[] = ["(", ")", ">", "<", "=", "!=", ">=", "<=", "LIKE", "AND", "OR", "NOT", "NEW VALUE", "OLD VALUE"];

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
        }
        catch (error) {
            throw error;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        }
    }, 400 * 1000);

})
