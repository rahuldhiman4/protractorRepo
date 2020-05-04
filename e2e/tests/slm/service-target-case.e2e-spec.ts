import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import previewCasePo from '../../pageobject/case/case-preview.po';
import createCasePage from '../../pageobject/case/create-case.po';
import editCasePo from '../../pageobject/case/edit-case.po';
import { default as viewCasePage, default as viewCasePo } from '../../pageobject/case/view-case.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import updateStatusBladePo from '../../pageobject/common/update.status.blade.po';
import serviceTargetConfig from '../../pageobject/settings/slm/service-target-blade.po';
import SlmExpressionBuilder from '../../pageobject/settings/slm/slm-expressionbuilder.pop.po';
import serviceTargetInfoPage from '../../pageobject/slm/service-target-info.po';
import slmProgressBar from '../../pageobject/slm/slm-progressbar.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon, { Utility } from '../../utils/utility.common';

let caseBAUser = 'qkatawazi';
let caseAgentUser = 'qtao';
let caseAgentUserPsilon = 'werusha';

describe('Service Target Tests for Cases', () => {
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
        await utilityCommon.refresh();
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
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Mary');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.selectCategoryTier1('Applications');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await slmProgressBar.isSLAProgressBarInProcessIconDisplayed()).toBe(true); //green
            expect(await viewCasePo.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)'); //green
            await browser.sleep(100000);
            await utilityCommon.refresh();
            expect(await slmProgressBar.isSLAProgressBarWarningIconDisplayed()).toBe(true); //green
            // expect(await viewCasePo.getSlaBarColor()).toBe('rgba(255, 165, 0, 1)'); //orange
            await browser.sleep(50000);
            await utilityCommon.refresh();
            expect(await slmProgressBar.isSLAProgressBarMissedGoalIconDisplayed()).toBe(true); //green
            expect(await viewCasePo.getSlaBarColor()).toBe('rgba(248, 50, 0, 1)');
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
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();
            browser.sleep(3000);
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Mary');
            await createCasePage.setPriority('High');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.selectCategoryTier1('Employee Relations');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await slmProgressBar.isSLAProgressBarInProcessIconDisplayed()).toBe(true);
            expect(await viewCasePage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)'); //green
            await browser.sleep(100000);
            await utilityCommon.refresh();
            expect(await slmProgressBar.isSLAProgressBarWarningIconDisplayed()).toBe(true);
            // expect(await viewCasePage.getSlaBarColor()).toBe('rgba(255, 165, 0, 1)'); //orange
            await browser.sleep(40000);
            await utilityCommon.refresh();
            expect(await slmProgressBar.isSLAProgressBarMissedGoalIconDisplayed()).toBe(true);
            expect(await viewCasePo.getSlaBarColor()).toBe('rgba(248, 50, 0, 1)'); //red
        }
        catch (error) {
            throw error;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        }

    }, 530 * 1000);

    //skhobrag
    it('[DRDMV-2027]:Icons representing measurement status on SLA Progress Bar', async () => {
        try {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');
            await SlmExpressionBuilder.selectFirstLevelExpressionQualification('Requester', '=', 'PERSON', 'Qianru Tao');
            await SlmExpressionBuilder.clickOnAddExpressionButton('PERSON');
            let selectedExp: string = await SlmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Requester" + "'" + "=" + '"' + "Qianru Tao" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("2");
            await serviceTargetConfig.selectMileStone();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();
            browser.sleep(3000);
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Qianru Tao');
            await createCasePage.setPriority('High');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.selectCategoryTier1('Employee Relations');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await slmProgressBar.isSLAProgressBarInProcessIconDisplayed()).toBe(true); //green
            expect(await viewCasePo.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)'); //green
            await browser.sleep(90000);
            await utilityCommon.refresh();
            expect(await slmProgressBar.isSLAProgressBarWarningIconDisplayed()).toBe(true); //green
            expect(await viewCasePo.getSlaBarColor()).toBe('rgba(241, 181, 33, 1)'); //orange
            await browser.sleep(50000);
            await utilityCommon.refresh();
            expect(await slmProgressBar.isSLAProgressBarMissedGoalIconDisplayed()).toBe(true); //green
            expect(await viewCasePo.getSlaBarColor()).toBe('rgba(248, 50, 0, 1)');

            //Create Another SVT for Dual SVT check
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows'))
                .toEqual('Service Target - Administration - Business Workflows');
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');
            await SlmExpressionBuilder.selectFirstLevelExpressionQualification('Requester', '=', 'PERSON', 'Qianru Tao');
            await SlmExpressionBuilder.clickOnAddExpressionButton('PERSON');
            selectedExp = await SlmExpressionBuilder.getSelectedExpression();
            expectedSelectedExp = "'" + "Requester" + "'" + "=" + '"' + "Qianru Tao" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("2");
            await serviceTargetConfig.selectMileStone();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();
            browser.sleep(3000);
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Qianru Tao');
            await createCasePage.setPriority('High');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.selectCategoryTier1('Employee Relations');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await slmProgressBar.isSLAProgressBarDualSVTIconDisplayed()).toBe(true); //green
            expect(await viewCasePo.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)'); //green
        }
        catch (error) {
            throw error;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        }

    }, 420 * 1000);

    //skhobrag   
    it('[DRDMV-11914]:[Global] Both svt gets attached if we have Global and company specific SVTs', async () => {
        try {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            //Create Global SVT    
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Global', 'Case Management');
            await SlmExpressionBuilder.selectFirstLevelExpressionQualification('Requester', '=', 'PERSON', 'Qianru Tao');
            await SlmExpressionBuilder.clickOnAddExpressionButton('PERSON');
            let selectedExp: string = await SlmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Requester" + "'" + "=" + '"' + "Qianru Tao" + '"'
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
            await SlmExpressionBuilder.selectFirstLevelExpressionQualification('Requester', '=', 'PERSON', 'Qianru Tao');
            await SlmExpressionBuilder.clickOnAddExpressionButton('PERSON');
            selectedExp = await SlmExpressionBuilder.getSelectedExpression();
            expectedSelectedExp = "'" + "Requester" + "'" + "=" + '"' + "Qianru Tao" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("2");
            await serviceTargetConfig.selectMileStone();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();

            await browser.sleep(3000);
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Qianru Tao');
            await createCasePage.setPriority('High');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.selectCategoryTier1('Employee Relations');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBe(true);
            expect(await slmProgressBar.isSLAProgressBarDualSVTIconDisplayed()).toBe(true); //green
            expect(await viewCasePo.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)'); //green
            await browser.sleep(90000);
            await utilityCommon.refresh();
            expect(await slmProgressBar.isSLAProgressBarDualSVTIconDisplayed()).toBe(true); //green
            expect(await viewCasePo.getSlaBarColor()).toBe('rgba(241, 181, 33, 1)'); //orange
            await browser.sleep(50000);
            await utilityCommon.refresh();
            expect(await slmProgressBar.isSLAProgressBarDualSVTIconDisplayed()).toBe(true); //green
            expect(await viewCasePo.getSlaBarColor()).toBe('rgba(248, 50, 0, 1)');
        }
        catch (error) {
            throw error;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        }

    }, 370 * 1000);

    //Failing application issue
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
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();

            browser.sleep(3000);
            //Create a Case
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Qianru Tao');
            await createCasePage.setPriority('Critical');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.selectCategoryTier1('Employee Relations');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBe(true);
            expect(await slmProgressBar.isSLAProgressBarInProcessIconDisplayed()).toBe(true); //green
            expect(await viewCasePo.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)'); //green

            //Change the case status to pending
            await updateStatusBladePo.changeCaseStatus('Pending');
            await updateStatusBladePo.setStatusReason('Customer Response');
            await updateStatusBladePo.clickSaveStatus();
            await browser.sleep(2000);
            await utilityCommon.refresh();
            expect(await slmProgressBar.isSLAProgressBarPausedIconDisplayed()).toBe(true); //green

            //Update the case status to In Progress
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            expect(await slmProgressBar.isSLAProgressBarInProcessIconDisplayed()).toBe(true); //green
            browser.sleep(95000);

            //Observe the warning bar on SLA
            expect(await slmProgressBar.isSLAProgressBarWarningIconDisplayed()).toBe(true); //green

            //Update the case status to Pending
            await updateStatusBladePo.changeCaseStatus('Pending');
            await updateStatusBladePo.setStatusReason('Customer Response');
            await updateStatusBladePo.clickSaveStatus();
            expect(await slmProgressBar.isSLAProgressBarPausedIconDisplayed()).toBe(true); //green

            //Wait until SLA progress missed goal
            browser.sleep(40000);
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            expect(await slmProgressBar.isSLAProgressBarMissedGoalIconDisplayed()).toBe(true); //green

            //Update the case status to Pending
            await updateStatusBladePo.changeCaseStatus('Pending');
            await updateStatusBladePo.setStatusReason('Customer Response');
            await updateStatusBladePo.clickSaveStatus();
            expect(await slmProgressBar.isSLAProgressBarPausedIconDisplayed()).toBe(true); //green

            //Update the case status to Resolved
            await updateStatusBladePo.changeCaseStatus('Resolved');
            await updateStatusBladePo.setStatusReason('Auto Resolved');
            await updateStatusBladePo.clickSaveStatus();
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
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
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
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();

            browser.sleep(3000);
            //Create a Case
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Qianru Tao');
            await createCasePage.setPriority('Critical');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.selectCategoryTier1('Employee Relations');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
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
    }, 330 * 1000);
    
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
            await utilityCommon.refresh();

            //Create a Case
            await loginPage.login(caseAgentUser);
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Qiang Du');
            await createCasePage.setPriority('Critical');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.selectCategoryTier1('Employee Relations');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBeTruthy('SVT is not attached to case.');
            await slmProgressBar.clickOnSLAProgressBarInProcessIcon();
            expect(await serviceTargetInfoPage.isServiceTargetInformationBladeDisplayed()).toBeTruthy('Service Target Information Blade is not displayed.');
            expect(await serviceTargetInfoPage.getServiceTargetInformationBladeHeader()).toBe('Service Target Information');
            expect(await serviceTargetInfoPage.isServiceTargetInformationDetails('Service Target: ')).toBeTruthy('Service Target Label on SVT Info Blade is not displayed.');
            expect(await serviceTargetInfoPage.isServiceTargetInformationFieldValues('SVT from Protractor ')).toBeTruthy('Service Target on SVT Info Blade is not displayed.');
            expect(await serviceTargetInfoPage.isServiceTargetInformationDetails('Due Date and Time: ')).toBeTruthy('Due Date Label on SVT Info Blade is not displayed.');
            expect(await serviceTargetInfoPage.isServiceTargetDueDateDisplayed()).toBeTruthy('Due Date on SVT Info Blade is not displayed.');
            //await browser.sleep(120000);
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
            await utilityCommon.refresh();

            //Create a Case
            await loginPage.login(caseAgentUserPsilon);
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Doomi Bomei');
            await createCasePage.setPriority('Critical');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
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
            await utilityCommon.refresh();

            //Create a Case
            await loginPage.login(caseAgentUser);
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Qiang Du');
            await createCasePage.setPriority('High');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBeTruthy('SVT is not attached to case.');
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('In Progress');
            await slmProgressBar.clickOnSLAProgressBarInProcessIcon();
            expect(await serviceTargetInfoPage.isServiceTargetInformationBladeDisplayed()).toBeTruthy('Service Target Information Blade is not displayed.');
            expect(await serviceTargetInfoPage.isServiceTargetInformationInProcessIconDisplayed()).toBeTruthy('SVT In Process Icon on SVT Info Blade is not displayed.');
            expect(await serviceTargetInfoPage.getServiceTargetStatus()).toBe('InProcess');
            await serviceTargetInfoPage.clickOnCloseButton();
            await updateStatusBladePo.changeCaseStatus('Pending');
            await updateStatusBladePo.setStatusReason('Customer Response');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Pending');
            await slmProgressBar.clickOnSLAProgressBarPausedIcon();
            expect(await serviceTargetInfoPage.isServiceTargetInformationBladeDisplayed()).toBeTruthy('Service Target Information Blade is not displayed.');
            expect(await serviceTargetInfoPage.isServiceTargetInformationPausedIconDisplayed()).toBeTruthy('SVT Pending Icon on SVT Info Blade is not displayed.');
            expect(await serviceTargetInfoPage.getServiceTargetStatus()).toBe('Pending');
            await serviceTargetInfoPage.clickOnCloseButton();
            await updateStatusBladePo.changeCaseStatus('Assigned');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Assigned');
            await slmProgressBar.clickOnSLAProgressBarInProcessIcon();
            expect(await serviceTargetInfoPage.isServiceTargetInformationBladeDisplayed()).toBeTruthy('Service Target Information Blade is not displayed.');
            expect(await serviceTargetInfoPage.isServiceTargetInformationInProcessIconDisplayed()).toBeTruthy('SVT In Process Icon on SVT Info Blade is not displayed.');
            expect(await serviceTargetInfoPage.getServiceTargetStatus()).toBe('InProcess');
            await serviceTargetInfoPage.clickOnCloseButton();
            await browser.sleep(80000);
            await utilityCommon.refresh();
            await expect(slmProgressBar.isSLAProgressBarWarningIconDisplayed()).toBeTruthy('SLA Warning bar is not displayed');
            await updateStatusBladePo.changeCaseStatus('Pending');
            await updateStatusBladePo.setStatusReason('Customer Response');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Pending');
            await slmProgressBar.clickOnSLAProgressBarPausedIcon();
            expect(await serviceTargetInfoPage.isServiceTargetInformationBladeDisplayed()).toBeTruthy('Service Target Information Blade is not displayed.');
            expect(await serviceTargetInfoPage.isServiceTargetInformationPausedIconDisplayed()).toBeTruthy('SVT Warning Pending Icon on SVT Info Blade is not displayed.');
            expect(await serviceTargetInfoPage.getServiceTargetStatus()).toBe('Warning Pending');
            await serviceTargetInfoPage.clickOnCloseButton();
            await updateStatusBladePo.changeCaseStatus('Assigned');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Assigned');
            await browser.sleep(60000);
            await utilityCommon.refresh();
            await expect(slmProgressBar.isSLAProgressBarMissedGoalIconDisplayed()).toBeTruthy('SLA Missed Goal bar is not displayed');
            await updateStatusBladePo.changeCaseStatus('Pending');
            await updateStatusBladePo.setStatusReason('Customer Response');
            await updateStatusBladePo.clickSaveStatus();
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

    }, 600 * 1000);

    //Failed
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
            await utilityCommon.refresh();

            //Create a Case
            await loginPage.login(caseAgentUser);
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Qiang Du');
            await createCasePage.setPriority('High');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBeTruthy('SVT is not attached to case.');
            expect(await slmProgressBar.isDueInTimeDisplayed()).toBe(true);
            browser.sleep(160000);
            await utilityCommon.refresh();
            expect(await slmProgressBar.isSLAProgressBarMissedGoalIconDisplayed()).toBe(true); //green
            expect(await viewCasePo.getSlaBarColor()).toBe('rgba(248, 50, 0, 1)');
            await updateStatusBladePo.changeCaseStatus('Pending');
            await updateStatusBladePo.setStatusReason('Customer Response');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Pending');
            await utilityCommon.refresh();
            await slmProgressBar.clickOnSLAProgressBarPausedIcon();
            expect(await serviceTargetInfoPage.isServiceTargetInformationBladeDisplayed()).toBeTruthy('Service Target Information Blade is not displayed.');
            expect(await serviceTargetInfoPage.isServiceTargetInformationPausedIconDisplayed()).toBeTruthy('SVT Pending Icon on SVT Info Blade is not displayed.');
            expect(await serviceTargetInfoPage.getServiceTargetStatus()).toBe('Missed Goal Pending');
            await serviceTargetInfoPage.clickOnCloseButton();
            await updateStatusBladePo.changeCaseStatus('Assigned');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Assigned');
            expect(await slmProgressBar.isSLAProgressBarMissedGoalIconDisplayed()).toBe(true); //green
            expect(await viewCasePo.getSlaBarColor()).toBe('rgba(248, 110, 0, 1)');
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

    }, 410 * 1000);

    //Failed due to application error
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
            await utilityCommon.refresh();

            //Create a Case
            await loginPage.login(caseAgentUser);
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Qiang Du');
            await createCasePage.setPriority('High');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBeTruthy('SVT is not attached to case.');
            expect(await slmProgressBar.isDueInTimeDisplayed()).toBe(true);
            await updateStatusBladePo.changeCaseStatus('Pending');
            await updateStatusBladePo.setStatusReason('Customer Response');
            await updateStatusBladePo.clickSaveStatus();
            await utilityCommon.refresh();
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

            browser.sleep(2000);
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
            browser.sleep(2000);
            await navigationPage.signOut();
            await utilityCommon.refresh();

            // Create a Case
            await loginPage.login(caseAgentUser);
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Qiang Du');
            await createCasePage.setPriority('High');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBeTruthy('SVT is not attached to case.');
            expect(await slmProgressBar.isDueInTimeDisplayed()).toBe(true);
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            expect(await slmProgressBar.isSLAProgressBarSVTMetIconDisplayed()).toBeTruthy('Service Target Complete (Met) Icon is not displayed.');
            await slmProgressBar.clickOnSLAProgressBarSVTMetIcon();
            expect(await serviceTargetInfoPage.isServiceTargetInformationBladeDisplayed()).toBeTruthy('Service Target Information Blade is not displayed.');
            expect(await serviceTargetInfoPage.isServiceTargetInformationSVTMetIconDisplayed()).toBeTruthy('SVT Complete Icon on SVT Info Blade is not displayed.');
            expect(await serviceTargetInfoPage.getServiceTargetStatus()).toBe('Met');
            await serviceTargetInfoPage.clickOnCloseButton();
            expect(await viewCasePo.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)');
            await updateStatusBladePo.changeCaseStatus('Pending');
            await updateStatusBladePo.setStatusReason('Customer Response');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Pending');
            await slmProgressBar.clickOnSLAProgressBarPausedIcon();
            expect(await serviceTargetInfoPage.isServiceTargetInformationBladeDisplayed()).toBeTruthy('Service Target Information Blade is not displayed.');
            expect(await serviceTargetInfoPage.isServiceTargetInformationPausedIconDisplayed()).toBeTruthy('SVT Pending Icon on SVT Info Blade is not displayed.');
            expect(await serviceTargetInfoPage.getServiceTargetStatus()).toBe('Pending');
            await serviceTargetInfoPage.clickOnCloseButton();
            await updateStatusBladePo.changeCaseStatus('Assigned');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Assigned');
            await browser.sleep(190000);
            await utilityCommon.refresh();
            await expect(slmProgressBar.isSLAProgressBarWarningIconDisplayed()).toBeTruthy('SLA Warning bar is not displayed');
            await updateStatusBladePo.changeCaseStatus('Pending');
            await updateStatusBladePo.setStatusReason('Customer Response');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Pending');
            await slmProgressBar.clickOnSLAProgressBarPausedIcon();
            expect(await serviceTargetInfoPage.isServiceTargetInformationBladeDisplayed()).toBeTruthy('Service Target Information Blade is not displayed.');
            expect(await serviceTargetInfoPage.isServiceTargetInformationPausedIconDisplayed()).toBeTruthy('SVT Warning Pending Icon on SVT Info Blade is not displayed.');
            expect(await serviceTargetInfoPage.getServiceTargetStatus()).toBe('Warning Pending');
            await serviceTargetInfoPage.clickOnCloseButton();
            await updateStatusBladePo.changeCaseStatus('Assigned');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Assigned');
            await browser.sleep(80000);
            await utilityCommon.refresh();
            await expect(slmProgressBar.isSLAProgressBarMissedGoalIconDisplayed()).toBeTruthy('SLA Missed Goal bar is not displayed');
            await updateStatusBladePo.changeCaseStatus('Pending');
            await updateStatusBladePo.setStatusReason('Customer Response');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Pending');
            await slmProgressBar.clickOnSLAProgressBarPausedIcon();
            expect(await serviceTargetInfoPage.isServiceTargetInformationBladeDisplayed()).toBeTruthy('Service Target Information Blade is not displayed.');
            expect(await serviceTargetInfoPage.isServiceTargetInformationPausedIconDisplayed()).toBeTruthy('SVT Missed Goal Pending Icon on SVT Info Blade is not displayed.');
            expect(await serviceTargetInfoPage.getServiceTargetStatus()).toBe('Missed Goal Pending');
            await serviceTargetInfoPage.clickOnCloseButton();
            expect(await viewCasePo.getSlaBarColor()).toBe('rgba(248, 50, 0, 1)');
        }
        catch (error) {
            throw error;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        }
    }, 620 * 1000);

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
            await utilityCommon.refresh();

            // Create a Case
            await loginPage.login(caseAgentUser);
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Qiang Du');
            await createCasePage.setPriority('Critical');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBeTruthy('SVT is not attached to case.');
            expect(await slmProgressBar.isDueInTimeDisplayed()).toBe(true);
            expect(await viewCasePo.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)');
            await updateStatusBladePo.changeCaseStatus('Pending');
            await updateStatusBladePo.setStatusReason('Customer Response');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Pending');
            await slmProgressBar.clickOnSLAProgressBarPausedIcon();
            expect(await serviceTargetInfoPage.isServiceTargetInformationBladeDisplayed()).toBeTruthy('Service Target Information Blade is not displayed.');
            expect(await serviceTargetInfoPage.isServiceTargetInformationPausedIconDisplayed()).toBeTruthy('SVT Pending Icon on SVT Info Blade is not displayed.');
            expect(await serviceTargetInfoPage.getServiceTargetStatus()).toBe('Pending');
            await serviceTargetInfoPage.clickOnCloseButton();
            expect(await viewCasePo.getSlaBarColor()).toBe('rgba(153, 153, 153, 1)');
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
            await utilityCommon.refresh();

            // Create a Case
            await loginPage.login(caseAgentUser);
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Qiang Du');
            await createCasePage.setPriority('Critical');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBeTruthy('SVT is not attached to case.');
            expect(await slmProgressBar.isDueInTimeDisplayed()).toBe(true);
            expect(await viewCasePo.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)');
            await updateStatusBladePo.changeCaseStatus('Resolved');
            await updateStatusBladePo.setStatusReason('Auto Resolved');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Resolved');
            await slmProgressBar.clickOnSLAProgressBarSVTMetIcon();
            expect(await serviceTargetInfoPage.isServiceTargetInformationBladeDisplayed()).toBeTruthy('Service Target Information Blade is not displayed.');
            expect(await serviceTargetInfoPage.isServiceTargetInformationSVTMetIconDisplayed()).toBeTruthy('SVT Met Icon on SVT Info Blade is not displayed.');
            expect(await serviceTargetInfoPage.getServiceTargetStatus()).toBe('Met');
            await serviceTargetInfoPage.clickOnCloseButton();
            expect(await viewCasePo.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)');
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
            await utilityCommon.refresh();

            // Create a Case
            await loginPage.login(caseAgentUser);
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Qiang Du');
            await createCasePage.setPriority('Critical');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBeTruthy('SVT is not attached to case.');
            expect(await slmProgressBar.isDueInTimeDisplayed()).toBe(true);
            expect(await viewCasePage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)');
            await browser.sleep(130000);
            await utilityCommon.refresh();
            expect(await slmProgressBar.isSLAProgressBarWarningIconDisplayed()).toBeTruthy('SVT Warning Icon is not attached to case.');
            await updateStatusBladePo.changeCaseStatus('Resolved');
            await updateStatusBladePo.setStatusReason('Auto Resolved');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Resolved');
            await slmProgressBar.clickOnSLAProgressBarSVTMetIcon();
            expect(await serviceTargetInfoPage.isServiceTargetInformationBladeDisplayed()).toBeTruthy('Service Target Information Blade is not displayed.');
            expect(await serviceTargetInfoPage.isServiceTargetInformationSVTMetIconDisplayed()).toBeTruthy('SVT Met Icon on SVT Info Blade is not displayed.');
            expect(await serviceTargetInfoPage.getServiceTargetStatus()).toBe('Met');
            await serviceTargetInfoPage.clickOnCloseButton();
            expect(await viewCasePage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)');
        }
        catch (error) {
            throw error;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        }

    }, 380 * 1000);

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
            await utilityCommon.refresh();

            // Create a Case
            await loginPage.login(caseAgentUser);
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Qiang Du');
            await createCasePage.setPriority('Critical');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBeTruthy('SVT is not attached to case.');
            expect(await slmProgressBar.isDueInTimeDisplayed()).toBe(true);
            expect(await viewCasePage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)');
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
            await utilityCommon.refresh();

            // Create a Case
            await loginPage.login(caseAgentUser);
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Qiang Du');
            await createCasePage.setPriority('Critical');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBeTruthy('SVT is not attached to case.');
            expect(await slmProgressBar.isDueInTimeDisplayed()).toBe(true);
            expect(await viewCasePage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)');
            await browser.sleep(130000);
            await utilityCommon.refresh();
            expect(await slmProgressBar.isSLAProgressBarWarningIconDisplayed()).toBeTruthy('SVT Warning Icon is not attached to case.');
            await browser.sleep(60000);
            await utilityCommon.refresh();
            await expect(slmProgressBar.isSLAProgressBarMissedGoalIconDisplayed()).toBeTruthy('SLA Missed Goal bar is not displayed');
            expect(await viewCasePage.getSlaBarColor()).toBe('rgba(248, 50, 0, 1)');
        } catch (error) {
            throw error;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        }

    }, 520 * 1000);

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
            await utilityCommon.refresh();

            // Create a Case
            await loginPage.login(caseAgentUser);
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Qiang Du');
            await createCasePage.setPriority('Critical');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBeTruthy('SVT is not attached to case.');
            expect(await slmProgressBar.isDueInTimeDisplayed()).toBe(true);
            expect(await viewCasePage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)');
            expect(await slmProgressBar.isSVTToolTipTextDisplayed()).toBeTruthy("SVT ToolTip Text is not displayed.");
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('SVT from Protractor');
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('Status : InProcess');
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('due on');
            await updateStatusBladePo.changeCaseStatus('Pending');
            await updateStatusBladePo.setStatusReason('Customer Response');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Pending');
            expect(await slmProgressBar.isSVTToolTipTextDisplayed()).toBeTruthy("SVT ToolTip Text is not displayed.");
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('SVT from Protractor');
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('Status : Pending');
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('Paused on');
            await updateStatusBladePo.changeCaseStatus('Assigned');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Assigned');
            expect(await slmProgressBar.isSVTToolTipTextDisplayed()).toBeTruthy("SVT ToolTip Text is not displayed.");
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('SVT from Protractor');
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('Status : InProcess');
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('due on');
            await updateStatusBladePo.changeCaseStatus('Resolved');
            await updateStatusBladePo.setStatusReason('Auto Resolved');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Resolved');
            expect(await slmProgressBar.isSVTToolTipTextDisplayed()).toBeTruthy("SVT ToolTip Text is not displayed.");
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('SVT from Protractor');
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('Status : Met');
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('due on');
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('met on');

            // Create a Case
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Qiang Du');
            await createCasePage.setPriority('Critical');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBeTruthy('SVT is not attached to case.');
            expect(await slmProgressBar.isDueInTimeDisplayed()).toBe(true);
            expect(await viewCasePage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)');
            await browser.sleep(130000);
            await utilityCommon.refresh();
            expect(await slmProgressBar.isSLAProgressBarWarningIconDisplayed()).toBeTruthy('SVT Warning Icon is not attached to case.');
            expect(await slmProgressBar.isSVTToolTipTextDisplayed()).toBeTruthy("SVT ToolTip Text is not displayed.");
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('SVT from Protractor');
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('Status : Warning');
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('due on');
            await browser.sleep(80000);
            await utilityCommon.refresh();
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

    }, 610 * 1000);

})
