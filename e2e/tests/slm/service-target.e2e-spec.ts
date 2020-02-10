import { browser } from "protractor";
import createCasePage from '../../pageobject/case/create-case.po';
import caseEditPage from '../../pageobject/case/edit-case.po';
import viewCasePage from '../../pageobject/case/view-case.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import serviceTargetConfig from '../../pageobject/settings/slm/service-target-blade.po';
import serviceTargetInfoPage from '../../pageobject/slm/service-target-info.po';
import SlmExpressionBuilder from '../../pageobject/settings/slm/slm-expressionbuilder.pop.po';
import slmProgressBar from '../../pageobject/slm/slm-progressbar.po';
import utilCommon from '../../utils/util.common';
import editCasePo from '../../pageobject/case/edit-case.po';
import apiHelper from '../../api/api.helper';
import adhoctaskTemplate from "../../pageobject/task/create-adhoc-task.po";
import { default as manageTask, default as manageTaskBladePo } from "../../pageobject/task/manage-task-blade.po";
import viewTask from "../../pageobject/task/view-task.po";
import caseTaskTab from '../../pageobject/case/case-task-tab.po';


var caseBAUser = 'qkatawazi';
var caseAgentUser = 'qtao';
var caseAgentUserPsilon = 'werusha';


describe('Service Taret Tests', () => {
    beforeAll(async () => {
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
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
    it('[DRDMV-17016]:Check if expression is build by using all available field with different relation', async () => {
        try {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Global', 'Case Management');
            await SlmExpressionBuilder.selectExpressionQualification('Category Tier 1', '=', 'ASSOCIATION', 'Applications');
            await SlmExpressionBuilder.clickOnAddExpressionButton('ASSOCIATION');
            let selectedExp: string = await SlmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Category Tier 1" + "'" + "=" + '"' + "Applications" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("2");
            await serviceTargetConfig.selectMileStone();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.clickOnSaveSVTButton();
            browser.sleep(3000);
            await navigationPage.gotCreateCase();
            await createCasePage.selectRequester('Mary');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.selectCategoryTier1('Applications');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await createCasePage.clickGoToCaseButton();
            expect(await slmProgressBar.isSLAProgressBarInProcessIconDisplayed()).toBe(true); //green
            expect(await caseEditPage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)'); //green
            await browser.sleep(100000);
            await browser.refresh();
            expect(await slmProgressBar.isSLAProgressBarWarningIconDisplayed()).toBe(true); //green
            // expect(await caseEditPage.getSlaBarColor()).toBe('rgba(255, 165, 0, 1)'); //orange
            await browser.sleep(40000);
            await browser.refresh();
            expect(await slmProgressBar.isSLAProgressBarMissedGoalIconDisplayed()).toBe(true); //green
            expect(await caseEditPage.getSlaBarColor()).toBe('rgba(248, 50, 0, 1)');
        }
        catch (error) {
            throw error;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        }

    });

    //skhobrag
    it('[DRDMV-11913]:[Global] Create a Case with global SVT', async () => {
        try {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Global', 'Case Management');
            await SlmExpressionBuilder.selectExpressionQualification('Priority', '=', 'SELECTION', 'High');
            await SlmExpressionBuilder.clickOnAddExpressionButton('SELECTION');
            let selectedExp: string = await SlmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Priority" + "'" + "=" + '"' + "High" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("2");
            await serviceTargetConfig.selectMileStone();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.clickOnSaveSVTButton();
            browser.sleep(3000);
            await navigationPage.gotCreateCase();
            await createCasePage.selectRequester('Mary');
            await createCasePage.setPriority('High');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.selectCategoryTier1('Employee Relations');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await createCasePage.clickGoToCaseButton();
            expect(await slmProgressBar.isSLAProgressBarInProcessIconDisplayed()).toBe(true); //green
            expect(await caseEditPage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)'); //green
            await browser.sleep(100000);
            await browser.refresh();
            expect(await slmProgressBar.isSLAProgressBarWarningIconDisplayed()).toBe(true); //green
            // expect(await caseEditPage.getSlaBarColor()).toBe('rgba(255, 165, 0, 1)'); //orange
            await browser.sleep(40000);
            await browser.refresh();
            expect(await slmProgressBar.isSLAProgressBarMissedGoalIconDisplayed()).toBe(true); //green
            expect(await caseEditPage.getSlaBarColor()).toBe('rgba(248, 50, 0, 1)');
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
    it('[DRDMV-2027]:Icons representing measurement status on SLA Progress Bar', async () => {
        try {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');
            await SlmExpressionBuilder.selectExpressionQualification('Requester', '=', 'PERSON', 'Qianru Tao');
            await SlmExpressionBuilder.clickOnAddExpressionButton('PERSON');
            let selectedExp: string = await SlmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Requester" + "'" + "=" + '"' + "Qianru Tao" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("2");
            await serviceTargetConfig.selectMileStone();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.clickOnSaveSVTButton();
            browser.sleep(3000);
            await navigationPage.gotCreateCase();
            await createCasePage.selectRequester('Qianru Tao');
            await createCasePage.setPriority('High');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.selectCategoryTier1('Employee Relations');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await createCasePage.clickGoToCaseButton();
            expect(await slmProgressBar.isSLAProgressBarInProcessIconDisplayed()).toBe(true); //green
            expect(await caseEditPage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)'); //green
            await browser.sleep(100000);
            await browser.refresh();
            expect(await slmProgressBar.isSLAProgressBarWarningIconDisplayed()).toBe(true); //green
            // expect(await caseEditPage.getSlaBarColor()).toBe('rgba(255, 165, 0, 1)'); //orange
            await browser.sleep(40000);
            await browser.refresh();
            expect(await slmProgressBar.isSLAProgressBarMissedGoalIconDisplayed()).toBe(true); //green
            expect(await caseEditPage.getSlaBarColor()).toBe('rgba(248, 50, 0, 1)');

            //Create Another SVT for Dual SVT check
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows'))
                .toEqual('Service Target - Administration - Business Workflows');
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');
            await SlmExpressionBuilder.selectExpressionQualification('Requester', '=', 'PERSON', 'Qianru Tao');
            await SlmExpressionBuilder.clickOnAddExpressionButton('PERSON');
            selectedExp = await SlmExpressionBuilder.getSelectedExpression();
            expectedSelectedExp = "'" + "Requester" + "'" + "=" + '"' + "Qianru Tao" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("2");
            await serviceTargetConfig.selectMileStone();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.clickOnSaveSVTButton();
            browser.sleep(3000);
            await navigationPage.gotCreateCase();
            await createCasePage.selectRequester('Qianru Tao');
            await createCasePage.setPriority('High');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.selectCategoryTier1('Employee Relations');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await createCasePage.clickGoToCaseButton();
            expect(await slmProgressBar.isSLAProgressBarDualSVTIconDisplayed()).toBe(true); //green
            expect(await caseEditPage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)'); //green
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
    it('[DRDMV-11914]:[Global] Both svt gets attached if we have Global and company specific SVTs', async () => {
        try {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            //Create Global SVT    
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Global', 'Case Management');
            await SlmExpressionBuilder.selectExpressionQualification('Requester', '=', 'PERSON', 'Qianru Tao');
            await SlmExpressionBuilder.clickOnAddExpressionButton('PERSON');
            let selectedExp: string = await SlmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Requester" + "'" + "=" + '"' + "Qianru Tao" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("2");
            await serviceTargetConfig.selectMileStone();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.clickOnSaveSVTButton();

            browser.sleep(5000);
            //Create company specific SVT
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');
            await SlmExpressionBuilder.selectExpressionQualification('Requester', '=', 'PERSON', 'Qianru Tao');
            await SlmExpressionBuilder.clickOnAddExpressionButton('PERSON');
            selectedExp = await SlmExpressionBuilder.getSelectedExpression();
            expectedSelectedExp = "'" + "Requester" + "'" + "=" + '"' + "Qianru Tao" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("2");
            await serviceTargetConfig.selectMileStone();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.clickOnSaveSVTButton();

            browser.sleep(3000);
            await navigationPage.gotCreateCase();
            await createCasePage.selectRequester('Qianru Tao');
            await createCasePage.setPriority('High');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.selectCategoryTier1('Employee Relations');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await createCasePage.clickGoToCaseButton();
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBe(true);
            expect(await slmProgressBar.isSLAProgressBarDualSVTIconDisplayed()).toBe(true); //green
            expect(await caseEditPage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)'); //green
            await browser.sleep(100000);
            await browser.refresh();
            expect(await slmProgressBar.isSLAProgressBarDualSVTIconDisplayed()).toBe(true); //green
            // expect(await caseEditPage.getSlaBarColor()).toBe('rgba(255, 165, 0, 1)'); //orange
            await browser.sleep(50000);
            await browser.refresh();
            expect(await slmProgressBar.isSLAProgressBarDualSVTIconDisplayed()).toBe(true); //green
            expect(await caseEditPage.getSlaBarColor()).toBe('rgba(248, 50, 0, 1)');
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
    it('[DRDMV-8365]:Verify the SLA Progress Bar change in color when single SVT attached', async () => {
        try {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            //Create a SVT    
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');
            await SlmExpressionBuilder.selectExpressionQualification('Priority', '=', 'SELECTION', 'Critical');
            await SlmExpressionBuilder.clickOnAddExpressionButton('SELECTION');
            let selectedExp = await SlmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Priority" + "'" + "=" + '"' + "Critical" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("2");
            await serviceTargetConfig.selectMileStone();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.clickOnSaveSVTButton();

            browser.sleep(3000);
            //Create a Case
            await navigationPage.gotCreateCase();
            await createCasePage.selectRequester('Qianru Tao');
            await createCasePage.setPriority('Critical');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.selectCategoryTier1('Employee Relations');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await createCasePage.clickGoToCaseButton();
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBe(true);
            expect(await slmProgressBar.isSLAProgressBarInProcessIconDisplayed()).toBe(true); //green
            expect(await caseEditPage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)'); //green

            //Change the case status to pending
            await viewCasePage.changeCaseStatus('Pending');
            await viewCasePage.setStatusReason('Customer Response');
            await viewCasePage.clickSaveStatus();
            expect(await slmProgressBar.isSLAProgressBarPausedIconDisplayed()).toBe(true); //green

            //Update the case status to In Progress
            await viewCasePage.changeCaseStatus('In Progress');
            await viewCasePage.clickSaveStatus();
            expect(await slmProgressBar.isSLAProgressBarInProcessIconDisplayed()).toBe(true); //green
            browser.sleep(95000);

            //Observe the warning bar on SLA
            expect(await slmProgressBar.isSLAProgressBarWarningIconDisplayed()).toBe(true); //green

            //Update the case status to Pending
            await viewCasePage.changeCaseStatus('Pending');
            await viewCasePage.setStatusReason('Customer Response');
            await viewCasePage.clickSaveStatus();
            expect(await slmProgressBar.isSLAProgressBarPausedIconDisplayed()).toBe(true); //green

            //Wait until SLA progress missed goal
            browser.sleep(40000);
            await viewCasePage.changeCaseStatus('In Progress');
            await viewCasePage.clickSaveStatus();
            expect(await slmProgressBar.isSLAProgressBarMissedGoalIconDisplayed()).toBe(true); //green

            //Update the case status to Pending
            await viewCasePage.changeCaseStatus('Pending');
            await viewCasePage.setStatusReason('Customer Response');
            await viewCasePage.clickSaveStatus();
            expect(await slmProgressBar.isSLAProgressBarPausedIconDisplayed()).toBe(true); //green

            //Update the case status to Resolved
            await viewCasePage.changeCaseStatus('Resolved');
            await viewCasePage.setStatusReason('Auto Resolved');
            await viewCasePage.clickSaveStatus();
            expect(await slmProgressBar.isSLAProgressBarMissedGoalIconDisplayed()).toBe(true);
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
    it('[DRDMV-2022]:Verify SLA Progress Bar timeline properties', async () => {
        try {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            //Create a SVT with 2 mins timeline    
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');
            await SlmExpressionBuilder.selectExpressionQualification('Priority', '=', 'SELECTION', 'Critical');
            await SlmExpressionBuilder.clickOnAddExpressionButton('SELECTION');
            let selectedExp: string = await SlmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Priority" + "'" + "=" + '"' + "Critical" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("2");
            await serviceTargetConfig.selectMileStone();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.clickOnSaveSVTButton();

            //Create a SVT with 4 mins timeline  
            browser.sleep(2000);
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');
            await SlmExpressionBuilder.selectExpressionQualification('Priority', '=', 'SELECTION', 'Critical');
            await SlmExpressionBuilder.clickOnAddExpressionButton('SELECTION');
            selectedExp = await SlmExpressionBuilder.getSelectedExpression();
            expectedSelectedExp = "'" + "Priority" + "'" + "=" + '"' + "Critical" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("4");
            await serviceTargetConfig.selectMileStone();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.clickOnSaveSVTButton();

            browser.sleep(3000);
            //Create a Case
            await navigationPage.gotCreateCase();
            await createCasePage.selectRequester('Qianru Tao');
            await createCasePage.setPriority('Critical');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.selectCategoryTier1('Employee Relations');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await createCasePage.clickGoToCaseButton();
            expect(await slmProgressBar.isMultipleSVTAttached()).toBe(true);
            expect(await slmProgressBar.isDueInTimeDisplayed()).toBe(true); //green
            expect(await slmProgressBar.getDueInTime()).toBe("Due in 2 min"); //green
        }
        catch (error) {
            throw error;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        }
    }, 200 * 1000);

    //skhobrag
    it('[DRDMV-7044]:[UI]Check the SLA Bar and check the details data on SLA blade', async () => {
        try {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            //Create a SVT with 2 mins timeline    
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');
            await SlmExpressionBuilder.selectExpressionQualification('Priority', '=', 'SELECTION', 'Critical');
            await SlmExpressionBuilder.clickOnAddExpressionButton('SELECTION');
            let selectedExp: string = await SlmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Priority" + "'" + "=" + '"' + "Critical" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("2");
            await serviceTargetConfig.selectMileStone();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();
            await navigationPage.signOut();
            await browser.refresh();

            //Create a Case
            await loginPage.login(caseAgentUser);
            await navigationPage.gotCreateCase();
            await createCasePage.selectRequester('Qiang Du');
            await createCasePage.setPriority('Critical');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.selectCategoryTier1('Employee Relations');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await createCasePage.clickGoToCaseButton();
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBeTruthy('SVT is not attached to case.');
            await slmProgressBar.clickOnSLAProgressBarInProcessIcon();
            expect(await serviceTargetInfoPage.isServiceTargetInformationBladeDisplayed()).toBeTruthy('Service Target Information Blade is not displayed.');
            expect(await serviceTargetInfoPage.getServiceTargetInformationBladeHeader()).toBe('Service Target Information');
            expect(await serviceTargetInfoPage.isServiceTargetInformationDetails('Service Target : ')).toBeTruthy('Service Target Label on SVT Info Blade is not displayed.');
            expect(await serviceTargetInfoPage.isServiceTargetInformationDetails('SVT from Protractor')).toBeTruthy('Service Target on SVT Info Blade is not displayed.');
            expect(await serviceTargetInfoPage.isServiceTargetInformationDetails('Due Date and Time : ')).toBeTruthy('Due Date Label on SVT Info Blade is not displayed.');
            expect(await serviceTargetInfoPage.isServiceTargetDueDateDisplayed()).toBeTruthy('Due Date on SVT Info Blade is not displayed.');
            expect(await serviceTargetInfoPage.isServiceTargetInformationInProcessIconDisplayed()).toBeTruthy('SVT In Process Icon on SVT Info Blade is not displayed.');
            expect(await serviceTargetInfoPage.getServiceTargetStatus()).toBe('InProcess');
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
    it('[DRDMV-6150]:If Company doesnt match, SVT is not applied', async () => {
        try {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            //Create a SVT with 2 mins timeline    
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');
            await SlmExpressionBuilder.selectFirstLevelExpressionQualification('Company', '=', 'NAMED_LIST', 'Petramco');
            await SlmExpressionBuilder.clickOnAddExpressionButton('NAMED_LIST');
            let selectedExp: string = await SlmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Company" + "'" + "=" + '"' + "Petramco" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("2");
            await serviceTargetConfig.selectMileStone();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();
            await navigationPage.signOut();
            await browser.refresh();

            //Create a Case
            await loginPage.login(caseAgentUserPsilon);
            await navigationPage.gotCreateCase();
            await createCasePage.selectRequester('Doomi Bomei');
            await createCasePage.setPriority('Critical');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await createCasePage.clickGoToCaseButton();
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBeFalsy('SVT is attached to case created by different company user.');
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
    it('[DRDMV-6311]:Create an Svt with Pause qualification and identity the SLA bar in different pause conditions', async () => {
        try {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            //Create a SVT with 2 mins timeline
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');
            await SlmExpressionBuilder.selectExpressionQualification('Priority', '=', 'SELECTION', 'High');
            await SlmExpressionBuilder.clickOnAddExpressionButton('SELECTION');
            let selectedExp: string = await SlmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Priority" + "'" + "=" + '"' + "High" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("2");
            await serviceTargetConfig.selectMileStone();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();
            await navigationPage.signOut();
            await browser.refresh();

            //Create a Case
            await loginPage.login(caseAgentUser);
            await navigationPage.gotCreateCase();
            await createCasePage.selectRequester('Qiang Du');
            await createCasePage.setPriority('High');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await createCasePage.clickGoToCaseButton();
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBeTruthy('SVT is not attached to case.');
            await viewCasePage.changeCaseStatus('In Progress');
            await viewCasePage.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('In Progress');
            await slmProgressBar.clickOnSLAProgressBarInProcessIcon();
            expect(await serviceTargetInfoPage.isServiceTargetInformationBladeDisplayed()).toBeTruthy('Service Target Information Blade is not displayed.');
            expect(await serviceTargetInfoPage.isServiceTargetInformationInProcessIconDisplayed()).toBeTruthy('SVT In Process Icon on SVT Info Blade is not displayed.');
            expect(await serviceTargetInfoPage.getServiceTargetStatus()).toBe('InProcess');
            await serviceTargetInfoPage.clickOnCloseButton();
            await viewCasePage.changeCaseStatus('Pending');
            await viewCasePage.setStatusReason('Customer Response');
            await viewCasePage.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Pending');
            await slmProgressBar.clickOnSLAProgressBarPausedIcon();
            expect(await serviceTargetInfoPage.isServiceTargetInformationBladeDisplayed()).toBeTruthy('Service Target Information Blade is not displayed.');
            expect(await serviceTargetInfoPage.isServiceTargetInformationPausedIconDisplayed()).toBeTruthy('SVT Pending Icon on SVT Info Blade is not displayed.');
            expect(await serviceTargetInfoPage.getServiceTargetStatus()).toBe('Pending');
            await serviceTargetInfoPage.clickOnCloseButton();
            await viewCasePage.changeCaseStatus('Assigned');
            await viewCasePage.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Assigned');
            await slmProgressBar.clickOnSLAProgressBarInProcessIcon();
            expect(await serviceTargetInfoPage.isServiceTargetInformationBladeDisplayed()).toBeTruthy('Service Target Information Blade is not displayed.');
            expect(await serviceTargetInfoPage.isServiceTargetInformationInProcessIconDisplayed()).toBeTruthy('SVT In Process Icon on SVT Info Blade is not displayed.');
            expect(await serviceTargetInfoPage.getServiceTargetStatus()).toBe('InProcess');
            await serviceTargetInfoPage.clickOnCloseButton();
            await browser.sleep(80000);
            await browser.refresh();
            await expect(slmProgressBar.isSLAProgressBarWarningIconDisplayed()).toBeTruthy('SLA Warning bar is not displayed');
            await viewCasePage.changeCaseStatus('Pending');
            await viewCasePage.setStatusReason('Customer Response');
            await viewCasePage.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Pending');
            await slmProgressBar.clickOnSLAProgressBarPausedIcon();
            expect(await serviceTargetInfoPage.isServiceTargetInformationBladeDisplayed()).toBeTruthy('Service Target Information Blade is not displayed.');
            expect(await serviceTargetInfoPage.isServiceTargetInformationPausedIconDisplayed()).toBeTruthy('SVT Warning Pending Icon on SVT Info Blade is not displayed.');
            expect(await serviceTargetInfoPage.getServiceTargetStatus()).toBe('Warning Pending');
            await serviceTargetInfoPage.clickOnCloseButton();
            await viewCasePage.changeCaseStatus('Assigned');
            await viewCasePage.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Assigned');
            await browser.sleep(20000);
            await browser.refresh();
            await expect(slmProgressBar.isSLAProgressBarMissedGoalIconDisplayed()).toBeTruthy('SLA Missed Goal bar is not displayed');
            await viewCasePage.changeCaseStatus('Pending');
            await viewCasePage.setStatusReason('Customer Response');
            await viewCasePage.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Pending');
            await slmProgressBar.clickOnSLAProgressBarPausedIcon();
            expect(await serviceTargetInfoPage.isServiceTargetInformationBladeDisplayed()).toBeTruthy('Service Target Information Blade is not displayed.');
            expect(await serviceTargetInfoPage.isServiceTargetInformationPausedIconDisplayed()).toBeTruthy('SVT Missed Goal Pending Icon on SVT Info Blade is not displayed.');
            expect(await serviceTargetInfoPage.getServiceTargetStatus()).toBe('Missed Goal Pending');
            await serviceTargetInfoPage.clickOnCloseButton();
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
    it('[DRDMV-8368]:Verify SLA Progress Bar change in color when multiple SVT attached and one SVT is missed', async () => {
        try {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            //Create a SVT with     
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');
            await SlmExpressionBuilder.selectFirstLevelExpressionQualification('Requester', '=', 'PERSON', 'Qiang Du');
            await SlmExpressionBuilder.clickOnAddExpressionButton('PERSON');
            let selectedExp: string = await SlmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Requester" + "'" + "=" + '"' + "Qiang Du" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("2");
            await serviceTargetConfig.selectMileStone();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();

            browser.sleep(5000);
            //Create company specific SVT
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');
            await SlmExpressionBuilder.selectFirstLevelExpressionQualification('Requester', '=', 'PERSON', 'Qiang Du');
            await SlmExpressionBuilder.clickOnAddExpressionButton('PERSON');
            selectedExp = await SlmExpressionBuilder.getSelectedExpression();
            expectedSelectedExp = "'" + "Requester" + "'" + "=" + '"' + "Qiang Du" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("4");
            await serviceTargetConfig.selectMileStone();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();
            await navigationPage.signOut();
            await browser.refresh();

            //Create a Case
            await loginPage.login(caseAgentUser);
            await navigationPage.gotCreateCase();
            await createCasePage.selectRequester('Qiang Du');
            await createCasePage.setPriority('High');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await createCasePage.clickGoToCaseButton();
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBeTruthy('SVT is not attached to case.');
            expect(await slmProgressBar.isDueInTimeDisplayed()).toBe(true);
            browser.sleep(130000);
            await browser.refresh();
            browser.sleep(20000);
            await browser.refresh();
            expect(await slmProgressBar.isSLAProgressBarMissedGoalIconDisplayed()).toBe(true); //green
            expect(await caseEditPage.getSlaBarColor()).toBe('rgba(248, 50, 0, 1)');
            await viewCasePage.changeCaseStatus('Pending');
            await viewCasePage.setStatusReason('Customer Response');
            await viewCasePage.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Pending');
            await slmProgressBar.clickOnSLAProgressBarPausedIcon();
            expect(await serviceTargetInfoPage.isServiceTargetInformationBladeDisplayed()).toBeTruthy('Service Target Information Blade is not displayed.');
            expect(await serviceTargetInfoPage.isServiceTargetInformationPausedIconDisplayed()).toBeTruthy('SVT Pending Icon on SVT Info Blade is not displayed.');
            expect(await serviceTargetInfoPage.getServiceTargetStatus()).toBe('Missed Goal Pending');
            await serviceTargetInfoPage.clickOnCloseButton();
            await viewCasePage.changeCaseStatus('Assigned');
            await viewCasePage.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Assigned');
            expect(await slmProgressBar.isSLAProgressBarMissedGoalIconDisplayed()).toBe(true); //green
            expect(await caseEditPage.getSlaBarColor()).toBe('rgba(248, 50, 0, 1)');
            await slmProgressBar.clickOnSLAProgressBarMissedGoalIcon();
            expect(await serviceTargetInfoPage.isServiceTargetInformationBladeDisplayed()).toBeTruthy('Service Target Information Blade is not displayed.');
            expect(await serviceTargetInfoPage.isServiceTargetInformationMissedGoalIconDisplayed()).toBeTruthy('SVT In Process Icon on SVT Info Blade is not displayed.');
            expect(await serviceTargetInfoPage.getServiceTargetStatus()).toBe('Missed Goal');
            await serviceTargetInfoPage.clickOnCloseButton();
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
    it('[DRDMV-8367]:Verify the SLA Progress Bar change in color when multiple SVT attached and all SVT are in Pause State', async () => {
        try {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            //Create a SVT with     
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');
            await SlmExpressionBuilder.selectFirstLevelExpressionQualification('Requester', '=', 'PERSON', 'Qiang Du');
            await SlmExpressionBuilder.clickOnAddExpressionButton('PERSON');
            let selectedExp: string = await SlmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Requester" + "'" + "=" + '"' + "Qiang Du" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("2");
            await serviceTargetConfig.selectMileStone();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();

            browser.sleep(5000);
            //Create company specific SVT
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');
            await SlmExpressionBuilder.selectFirstLevelExpressionQualification('Requester', '=', 'PERSON', 'Qiang Du');
            await SlmExpressionBuilder.clickOnAddExpressionButton('PERSON');
            selectedExp = await SlmExpressionBuilder.getSelectedExpression();
            expectedSelectedExp = "'" + "Requester" + "'" + "=" + '"' + "Qiang Du" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("4");
            await serviceTargetConfig.selectMileStone();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();
            await navigationPage.signOut();
            await browser.refresh();

            //Create a Case
            await loginPage.login(caseAgentUser);
            await navigationPage.gotCreateCase();
            await createCasePage.selectRequester('Qiang Du');
            await createCasePage.setPriority('High');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await createCasePage.clickGoToCaseButton();
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBeTruthy('SVT is not attached to case.');
            expect(await slmProgressBar.isDueInTimeDisplayed()).toBe(true);
            await viewCasePage.changeCaseStatus('Pending');
            await viewCasePage.setStatusReason('Customer Response');
            await viewCasePage.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Pending');
            await slmProgressBar.clickOnSLAProgressBarPausedIcon();
            expect(await serviceTargetInfoPage.isServiceTargetInformationBladeDisplayed()).toBeTruthy('Service Target Information Blade is not displayed.');
            expect(await serviceTargetInfoPage.isServiceTargetInformationPausedIconDisplayed()).toBeTruthy('SVT Pending Icon on SVT Info Blade is not displayed.');
            expect(await serviceTargetInfoPage.getServiceTargetStatus()).toBe('Pending');
            await serviceTargetInfoPage.clickOnCloseButton();
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
    it('[DRDMV-8366]:Verify the SLA Progress Bar change in color when multiple SVT attached and one SVT is Met', async () => {
        try {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            //Create a SVT with     
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');
            await SlmExpressionBuilder.selectFirstLevelExpressionQualification('Requester', '=', 'PERSON', 'Qiang Du');
            await SlmExpressionBuilder.clickOnAddExpressionButton('PERSON');
            let selectedExp: string = await SlmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Requester" + "'" + "=" + '"' + "Qiang Du" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("2");
            await serviceTargetConfig.selectMileStone();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "In Progress");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();

            browser.sleep(5000);
            //Create company specific SVT
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');
            await SlmExpressionBuilder.selectFirstLevelExpressionQualification('Requester', '=', 'PERSON', 'Qiang Du');
            await SlmExpressionBuilder.clickOnAddExpressionButton('PERSON');
            selectedExp = await SlmExpressionBuilder.getSelectedExpression();
            expectedSelectedExp = "'" + "Requester" + "'" + "=" + '"' + "Qiang Du" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("4");
            await serviceTargetConfig.selectMileStone();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();
            await navigationPage.signOut();
            await browser.refresh();

            // Create a Case
            await loginPage.login(caseAgentUser);
            await navigationPage.gotCreateCase();
            await createCasePage.selectRequester('Qiang Du');
            await createCasePage.setPriority('High');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await createCasePage.clickGoToCaseButton();
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBeTruthy('SVT is not attached to case.');
            expect(await slmProgressBar.isDueInTimeDisplayed()).toBe(true);
            await viewCasePage.changeCaseStatus('In Progress');
            await viewCasePage.clickSaveStatus();
            expect(await slmProgressBar.isSLAProgressBarSVTMetIconDisplayed()).toBeTruthy('Service Target Complete (Met) Icon is not displayed.');
            await slmProgressBar.clickOnSLAProgressBarSVTMetIcon();
            expect(await serviceTargetInfoPage.isServiceTargetInformationBladeDisplayed()).toBeTruthy('Service Target Information Blade is not displayed.');
            expect(await serviceTargetInfoPage.isServiceTargetInformationSVTMetIconDisplayed()).toBeTruthy('SVT Complete Icon on SVT Info Blade is not displayed.');
            expect(await serviceTargetInfoPage.getServiceTargetStatus()).toBe('Met');
            await serviceTargetInfoPage.clickOnCloseButton();
            expect(await caseEditPage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)');
            await viewCasePage.changeCaseStatus('Pending');
            await viewCasePage.setStatusReason('Customer Response');
            await viewCasePage.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Pending');
            await slmProgressBar.clickOnSLAProgressBarPausedIcon();
            expect(await serviceTargetInfoPage.isServiceTargetInformationBladeDisplayed()).toBeTruthy('Service Target Information Blade is not displayed.');
            expect(await serviceTargetInfoPage.isServiceTargetInformationPausedIconDisplayed()).toBeTruthy('SVT Pending Icon on SVT Info Blade is not displayed.');
            expect(await serviceTargetInfoPage.getServiceTargetStatus()).toBe('Pending');
            await serviceTargetInfoPage.clickOnCloseButton();
            await viewCasePage.changeCaseStatus('Assigned');
            await viewCasePage.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Assigned');
            await browser.sleep(190000);
            await browser.refresh();
            await expect(slmProgressBar.isSLAProgressBarWarningIconDisplayed()).toBeTruthy('SLA Warning bar is not displayed');
            await viewCasePage.changeCaseStatus('Pending');
            await viewCasePage.setStatusReason('Customer Response');
            await viewCasePage.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Pending');
            await slmProgressBar.clickOnSLAProgressBarPausedIcon();
            expect(await serviceTargetInfoPage.isServiceTargetInformationBladeDisplayed()).toBeTruthy('Service Target Information Blade is not displayed.');
            expect(await serviceTargetInfoPage.isServiceTargetInformationPausedIconDisplayed()).toBeTruthy('SVT Warning Pending Icon on SVT Info Blade is not displayed.');
            expect(await serviceTargetInfoPage.getServiceTargetStatus()).toBe('Warning Pending');
            await serviceTargetInfoPage.clickOnCloseButton();
            await viewCasePage.changeCaseStatus('Assigned');
            await viewCasePage.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Assigned');
            await browser.sleep(50000);
            await browser.refresh();
            await expect(slmProgressBar.isSLAProgressBarMissedGoalIconDisplayed()).toBeTruthy('SLA Missed Goal bar is not displayed');
            await viewCasePage.changeCaseStatus('Pending');
            await viewCasePage.setStatusReason('Customer Response');
            await viewCasePage.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Pending');
            await slmProgressBar.clickOnSLAProgressBarPausedIcon();
            expect(await serviceTargetInfoPage.isServiceTargetInformationBladeDisplayed()).toBeTruthy('Service Target Information Blade is not displayed.');
            expect(await serviceTargetInfoPage.isServiceTargetInformationPausedIconDisplayed()).toBeTruthy('SVT Missed Goal Pending Icon on SVT Info Blade is not displayed.');
            expect(await serviceTargetInfoPage.getServiceTargetStatus()).toBe('Missed Goal Pending');
            await serviceTargetInfoPage.clickOnCloseButton();
            expect(await caseEditPage.getSlaBarColor()).toBe('rgba(248, 50, 0, 1)');
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
    it('[DRDMV-8370]:Verify Visualization change when Status changes(In Process-> Pending)', async () => {
        try {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            //Create a SVT with 2 mins timeline
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');
            await SlmExpressionBuilder.selectExpressionQualification('Priority', '=', 'SELECTION', 'Critical');
            await SlmExpressionBuilder.clickOnAddExpressionButton('SELECTION');
            let selectedExp: string = await SlmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Priority" + "'" + "=" + '"' + "Critical" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("2");
            await serviceTargetConfig.selectMileStone();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();
            await navigationPage.signOut();
            await browser.refresh();

            // Create a Case
            await loginPage.login(caseAgentUser);
            await navigationPage.gotCreateCase();
            await createCasePage.selectRequester('Qiang Du');
            await createCasePage.setPriority('Critical');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await createCasePage.clickGoToCaseButton();
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBeTruthy('SVT is not attached to case.');
            expect(await slmProgressBar.isDueInTimeDisplayed()).toBe(true);
            expect(await caseEditPage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)');
            await viewCasePage.changeCaseStatus('Pending');
            await viewCasePage.setStatusReason('Customer Response');
            await viewCasePage.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Pending');
            await slmProgressBar.clickOnSLAProgressBarPausedIcon();
            expect(await serviceTargetInfoPage.isServiceTargetInformationBladeDisplayed()).toBeTruthy('Service Target Information Blade is not displayed.');
            expect(await serviceTargetInfoPage.isServiceTargetInformationPausedIconDisplayed()).toBeTruthy('SVT Pending Icon on SVT Info Blade is not displayed.');
            expect(await serviceTargetInfoPage.getServiceTargetStatus()).toBe('Pending');
            await serviceTargetInfoPage.clickOnCloseButton();
            expect(await caseEditPage.getSlaBarColor()).toBe('rgba(153, 153, 153, 1)');
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
    it('[DRDMV-8371]:Verify Visualization change when Status changes(In Process-> Met)', async () => {
        try {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            //Create a SVT with 2 mins timeline
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');
            await SlmExpressionBuilder.selectExpressionQualification('Priority', '=', 'SELECTION', 'Critical');
            await SlmExpressionBuilder.clickOnAddExpressionButton('SELECTION');
            let selectedExp: string = await SlmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Priority" + "'" + "=" + '"' + "Critical" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("2");
            await serviceTargetConfig.selectMileStone();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();
            await navigationPage.signOut();
            await browser.refresh();

            // Create a Case
            await loginPage.login(caseAgentUser);
            await navigationPage.gotCreateCase();
            await createCasePage.selectRequester('Qiang Du');
            await createCasePage.setPriority('Critical');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await createCasePage.clickGoToCaseButton();
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBeTruthy('SVT is not attached to case.');
            expect(await slmProgressBar.isDueInTimeDisplayed()).toBe(true);
            expect(await caseEditPage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)');
            await viewCasePage.changeCaseStatus('Resolved');
            await viewCasePage.setStatusReason('Auto Resolved');
            await viewCasePage.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Resolved');
            await slmProgressBar.clickOnSLAProgressBarSVTMetIcon();
            expect(await serviceTargetInfoPage.isServiceTargetInformationBladeDisplayed()).toBeTruthy('Service Target Information Blade is not displayed.');
            expect(await serviceTargetInfoPage.isServiceTargetInformationSVTMetIconDisplayed()).toBeTruthy('SVT Met Icon on SVT Info Blade is not displayed.');
            expect(await serviceTargetInfoPage.getServiceTargetStatus()).toBe('Met');
            await serviceTargetInfoPage.clickOnCloseButton();
            expect(await caseEditPage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)');
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
    it('[DRDMV-8372]:Verify Visualization change when Status changes(Warning-> Met)', async () => {
        try {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            //Create a SVT with 2 mins timeline
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');
            await SlmExpressionBuilder.selectExpressionQualification('Priority', '=', 'SELECTION', 'Critical');
            await SlmExpressionBuilder.clickOnAddExpressionButton('SELECTION');
            let selectedExp: string = await SlmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Priority" + "'" + "=" + '"' + "Critical" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("3");
            await serviceTargetConfig.selectMileStone();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();
            await navigationPage.signOut();
            await browser.refresh();

            // Create a Case
            await loginPage.login(caseAgentUser);
            await navigationPage.gotCreateCase();
            await createCasePage.selectRequester('Qiang Du');
            await createCasePage.setPriority('Critical');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await createCasePage.clickGoToCaseButton();
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBeTruthy('SVT is not attached to case.');
            expect(await slmProgressBar.isDueInTimeDisplayed()).toBe(true);
            expect(await caseEditPage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)');
            await browser.sleep(130000);
            await browser.refresh();
            expect(await slmProgressBar.isSLAProgressBarWarningIconDisplayed()).toBeTruthy('SVT Warning Icon is not attached to case.');
            await viewCasePage.changeCaseStatus('Resolved');
            await viewCasePage.setStatusReason('Auto Resolved');
            await viewCasePage.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Resolved');
            await slmProgressBar.clickOnSLAProgressBarSVTMetIcon();
            expect(await serviceTargetInfoPage.isServiceTargetInformationBladeDisplayed()).toBeTruthy('Service Target Information Blade is not displayed.');
            expect(await serviceTargetInfoPage.isServiceTargetInformationSVTMetIconDisplayed()).toBeTruthy('SVT Met Icon on SVT Info Blade is not displayed.');
            expect(await serviceTargetInfoPage.getServiceTargetStatus()).toBe('Met');
            await serviceTargetInfoPage.clickOnCloseButton();
            expect(await caseEditPage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)');
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
    it('[DRDMV-8373]:Verify Visualization change when Case is no longer match SVT configurations(In Process->Detached)', async () => {
        try {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            //Create a SVT with 2 mins timeline
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');
            await SlmExpressionBuilder.selectExpressionQualification('Priority', '=', 'SELECTION', 'Critical');
            await SlmExpressionBuilder.clickOnAddExpressionButton('SELECTION');
            let selectedExp: string = await SlmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Priority" + "'" + "=" + '"' + "Critical" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("3");
            await serviceTargetConfig.selectMileStone();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();
            await navigationPage.signOut();
            await browser.refresh();

            // Create a Case
            await loginPage.login(caseAgentUser);
            await navigationPage.gotCreateCase();
            await createCasePage.selectRequester('Qiang Du');
            await createCasePage.setPriority('Critical');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await createCasePage.clickGoToCaseButton();
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBeTruthy('SVT is not attached to case.');
            expect(await slmProgressBar.isDueInTimeDisplayed()).toBe(true);
            expect(await caseEditPage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)');
            await viewCasePage.clickEditCaseButton();
            await editCasePo.updateCasePriority('Low');
            await editCasePo.clickSaveCase();
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBeFalsy('SVT is not attached to case.');
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
    it('[DRDMV-8374]:No change is visualization after specified time passed', async () => {
        try {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            //Create a SVT with 2 mins timeline
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');
            await SlmExpressionBuilder.selectExpressionQualification('Priority', '=', 'SELECTION', 'Critical');
            await SlmExpressionBuilder.clickOnAddExpressionButton('SELECTION');
            let selectedExp: string = await SlmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Priority" + "'" + "=" + '"' + "Critical" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("3");
            await serviceTargetConfig.selectMileStone();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();
            await browser.sleep(2000);
            await navigationPage.signOut();
            await browser.refresh();

            // Create a Case
            await loginPage.login(caseAgentUser);
            await navigationPage.gotCreateCase();
            await createCasePage.selectRequester('Qiang Du');
            await createCasePage.setPriority('Critical');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await createCasePage.clickGoToCaseButton();
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBeTruthy('SVT is not attached to case.');
            expect(await slmProgressBar.isDueInTimeDisplayed()).toBe(true);
            expect(await caseEditPage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)');
            await browser.sleep(130000);
            await browser.refresh();
            expect(await slmProgressBar.isSLAProgressBarWarningIconDisplayed()).toBeTruthy('SVT Warning Icon is not attached to case.');
            await browser.sleep(59000);
            await browser.refresh();
            await expect(slmProgressBar.isSLAProgressBarMissedGoalIconDisplayed()).toBeTruthy('SLA Missed Goal bar is not displayed');
            expect(await caseEditPage.getSlaBarColor()).toBe('rgba(248, 50, 0, 1)');
        } catch (error) {
            throw error;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        }

    }, 300 * 1000);

    //skhobrag
    it('[DRDMV-2044]:Tooltip text & display allignment for measurements on SLA Progress Bar', async () => {
        try {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            //Create a SVT with 2 mins timeline
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');
            await SlmExpressionBuilder.selectExpressionQualification('Priority', '=', 'SELECTION', 'Critical');
            await SlmExpressionBuilder.clickOnAddExpressionButton('SELECTION');
            let selectedExp: string = await SlmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Priority" + "'" + "=" + '"' + "Critical" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("3");
            await serviceTargetConfig.selectMileStone();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();
            await browser.sleep(2000);
            await navigationPage.signOut();
            await browser.refresh();

            // Create a Case
            await loginPage.login(caseAgentUser);
            await navigationPage.gotCreateCase();
            await createCasePage.selectRequester('Qiang Du');
            await createCasePage.setPriority('Critical');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await createCasePage.clickGoToCaseButton();
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBeTruthy('SVT is not attached to case.');
            expect(await slmProgressBar.isDueInTimeDisplayed()).toBe(true);
            expect(await caseEditPage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)');
            expect(await slmProgressBar.isSVTToolTipTextDisplayed()).toBeTruthy("SVT ToolTip Text is not displayed.");
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('SVT from Protractor');
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('Status : InProcess');
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('due on');
            await viewCasePage.changeCaseStatus('Pending');
            await viewCasePage.setStatusReason('Customer Response');
            await viewCasePage.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Pending');
            expect(await slmProgressBar.isSVTToolTipTextDisplayed()).toBeTruthy("SVT ToolTip Text is not displayed.");
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('SVT from Protractor');
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('Status : Pending');
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('Paused on');
            await viewCasePage.changeCaseStatus('Assigned');
            await viewCasePage.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Assigned');
            expect(await slmProgressBar.isSVTToolTipTextDisplayed()).toBeTruthy("SVT ToolTip Text is not displayed.");
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('SVT from Protractor');
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('Status : InProcess');
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('due on');
            await viewCasePage.changeCaseStatus('Resolved');
            await viewCasePage.setStatusReason('Auto Resolved');
            await viewCasePage.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Resolved');
            expect(await slmProgressBar.isSVTToolTipTextDisplayed()).toBeTruthy("SVT ToolTip Text is not displayed.");
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('SVT from Protractor');
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('Status : Met');
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('due on');
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('met on');

            // Create a Case
            await navigationPage.gotCreateCase();
            await createCasePage.selectRequester('Qiang Du');
            await createCasePage.setPriority('Critical');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await createCasePage.clickGoToCaseButton();
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBeTruthy('SVT is not attached to case.');
            expect(await slmProgressBar.isDueInTimeDisplayed()).toBe(true);
            expect(await caseEditPage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)');
            await browser.sleep(130000);
            await browser.refresh();
            expect(await slmProgressBar.isSLAProgressBarWarningIconDisplayed()).toBeTruthy('SVT Warning Icon is not attached to case.');
            expect(await slmProgressBar.isSVTToolTipTextDisplayed()).toBeTruthy("SVT ToolTip Text is not displayed.");
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('SVT from Protractor');
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('Status : Warning');
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('due on');
            await browser.sleep(80000);
            await browser.refresh();
            await expect(slmProgressBar.isSLAProgressBarMissedGoalIconDisplayed()).toBeTruthy('SLA Missed Goal bar is not displayed');
            expect(await slmProgressBar.isSVTToolTipTextDisplayed()).toBeTruthy("SVT ToolTip Text is not displayed.");
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('SVT from Protractor');
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('Status : Missed Goal');
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('due on');
        }
        catch (error) {
            throw error;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        }

    }, 500 * 1000);

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
            await navigationPage.gotCreateCase();
            await createCasePage.selectRequester('Qiang Du');
            await createCasePage.setPriority('Critical');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await createCasePage.clickGoToCaseButton();
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
            await viewCasePage.changeCaseStatus('In Progress');
            await viewCasePage.clickSaveStatus();
            await manageTask.clickTaskLinkOnManageTask(summary);
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBe(true);
            expect(await slmProgressBar.isSLAProgressBarInProcessIconDisplayed()).toBe(true); //green
            expect(await caseEditPage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)');
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
            await navigationPage.gotCreateCase();
            await createCasePage.selectRequester('Qiang Du');
            await createCasePage.setPriority('Critical');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await createCasePage.clickGoToCaseButton();
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
            await viewCasePage.changeCaseStatus('In Progress');
            await viewCasePage.clickSaveStatus();
            await manageTask.clickTaskLinkOnManageTask(manualTaskTemp);
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBe(true);
            expect(await slmProgressBar.isSLAProgressBarInProcessIconDisplayed()).toBe(true); //green
            expect(await caseEditPage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)');
            expect(await slmProgressBar.isSVTToolTipTextDisplayed()).toBeTruthy("SVT ToolTip Text is not displayed.");
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('SVT from Protractor');
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('Status : InProcess');
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('due on');
            await viewTask.clickOnChangeStatus();
            await viewTask.changeTaskStatus('Completed');
            await viewCasePage.setStatusReason('Successful');
            await viewTask.clickOnSaveStatus();
            await viewTask.clickOnViewCase();
            await caseTaskTab.clickoncasetaskArrowtab();
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

    }, 400 * 1000);

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
            await navigationPage.gotCreateCase();
            await createCasePage.selectRequester('Qiang Du');
            await createCasePage.setPriority('Critical');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await createCasePage.clickGoToCaseButton();
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
            expect(await caseEditPage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)');
            expect(await slmProgressBar.isSVTToolTipTextDisplayed()).toBeTruthy("SVT ToolTip Text is not displayed.");
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('SVT from Protractor');
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('Status : InProcess');
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('due on');
            await browser.refresh();
            await viewTask.getTaskTypeValue();
            await viewTask.clickOnViewCase();
            await caseTaskTab.clickoncasetaskArrowtab();
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
            let firstLevelAssociationFields: string[] = ["Assigned Business Unit", "Assigned Department", "Assigned Group", "Category Tier 1", "Category Tier 2","Category Tier 3","Category Tier 4","Created Date","Label","Modified By","Priority","Status","Status Reason","Task Region","Task Type"];
            let secondLevelAssociationFields: string[] = ["Assigned Company", "Company", "Requester", "Site"];    
            let expressionOperatorFields: string[] = ["(", ")", ">", "<", "=","!=",">=","<=","LIKE","AND","OR","NOT","NEW VALUE","OLD VALUE"];

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
