import { browser, ProtractorExpectedConditions, protractor } from "protractor";
import loginPage from "../../pageobject/login.po";
import navigationPage from "../../pageobject/navigation.po";
import SlmExpressionBuilder from '../../pageobject/settings/slm-expressionbuilder.pop.po';
import serviceTargetConfig from '../../pageobject/settings/service-target-blade.po';
import createCasePage from '../../pageobject/case/create-case.po';
import caseEditPage from '../../pageobject/case/edit-case.po';
import SlmProgressBar from '../../pageobject/case/slm-progressbar.po';

var caseBAUser = 'qkatawazi';

describe('Service Taret Tests', () => {
    const EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    beforeAll(async () => {
        await browser.manage().window().maximize();
        await browser.get(`${browser.baseUrl}/innovationsuite/index.html#/com.bmc.dsm.bwfa`);
        browser.waitForAngularEnabled(false);
        await loginPage.login(caseBAUser);
    });

    beforeEach(async () => {
        await browser.get(`${browser.baseUrl}/innovationsuite/index.html#/com.bmc.dsm.bwfa`);
    });

    afterAll(async () => {
        browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
        await navigationPage.signOut();
    });

    it('DRDMV-17016:Check if expression is build by using all available field with different relation', async () => {
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows'))
            .toEqual('Service Target - Administration - Business Workflows');
        await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Global', 'Case Management');
        await SlmExpressionBuilder.selectExpressionQualification('Category Tier 1', '=', 'ASSOCIATION', 'Employee Relations');
        await SlmExpressionBuilder.clickOnAddExpressionButton('ASSOCIATION');
        var selectedExp: string = await SlmExpressionBuilder.getSelectedExpression();
        var expectedSelectedExp = "'" + "Category Tier 1" + "'" + "=" + '"' + "Employee Relations" + '"'
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
        await createCasePage.selectCategoryTier1('Employee Relations');
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        expect(await SlmProgressBar.isSLAProgressBarInProcessIconDisplayed()).toBe(true); //green
        expect(await caseEditPage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)'); //green
        await browser.sleep(100000);
        await browser.refresh();
        expect(await SlmProgressBar.isSLAProgressBarWarningIconDisplayed()).toBe(true); //green
        // expect(await caseEditPage.getSlaBarColor()).toBe('rgba(255, 165, 0, 1)'); //orange
        await browser.sleep(40000);
        await browser.refresh();
        expect(await SlmProgressBar.isSLAProgressBarMissedGoalIconDisplayed()).toBe(true); //green
        expect(await caseEditPage.getSlaBarColor()).toBe('rgba(248, 50, 0, 1)');
    });

    it('DRDMV-11913:[Global] Create a Case with global SVT', async () => {
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows'))
            .toEqual('Service Target - Administration - Business Workflows');
        await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Global', 'Case Management');
        await SlmExpressionBuilder.selectExpressionQualification('Priority', '=', 'SELECTION', 'High');
        await SlmExpressionBuilder.clickOnAddExpressionButton('SELECTION');
        var selectedExp: string = await SlmExpressionBuilder.getSelectedExpression();
        var expectedSelectedExp = "'" + "Priority" + "'" + "=" + '"' + "High" + '"'
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
        expect(await SlmProgressBar.isSLAProgressBarInProcessIconDisplayed()).toBe(true); //green
        expect(await caseEditPage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)'); //green
        await browser.sleep(100000);
        await browser.refresh();
        expect(await SlmProgressBar.isSLAProgressBarWarningIconDisplayed()).toBe(true); //green
        // expect(await caseEditPage.getSlaBarColor()).toBe('rgba(255, 165, 0, 1)'); //orange
        await browser.sleep(40000);
        await browser.refresh();
        expect(await SlmProgressBar.isSLAProgressBarMissedGoalIconDisplayed()).toBe(true); //green
        expect(await caseEditPage.getSlaBarColor()).toBe('rgba(248, 50, 0, 1)');
    }, 300 * 1000);

    it('DRDMV-2027:Icons representing measurement status on SLA Progress Bar', async () => {
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows'))
            .toEqual('Service Target - Administration - Business Workflows');
        await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');
        await SlmExpressionBuilder.selectExpressionQualification('Requester', '=', 'PERSON', 'Qianru Tao');
        await SlmExpressionBuilder.clickOnAddExpressionButton('PERSON');
        var selectedExp: string = await SlmExpressionBuilder.getSelectedExpression();
        var expectedSelectedExp = "'" + "Requester" + "'" + "=" + '"' + "Qianru Tao" + '"'
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
        expect(await SlmProgressBar.isSLAProgressBarInProcessIconDisplayed()).toBe(true); //green
        expect(await caseEditPage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)'); //green
        await browser.sleep(100000);
        await browser.refresh();
        expect(await SlmProgressBar.isSLAProgressBarWarningIconDisplayed()).toBe(true); //green
        // expect(await caseEditPage.getSlaBarColor()).toBe('rgba(255, 165, 0, 1)'); //orange
        await browser.sleep(40000);
        await browser.refresh();
        expect(await SlmProgressBar.isSLAProgressBarMissedGoalIconDisplayed()).toBe(true); //green
        expect(await caseEditPage.getSlaBarColor()).toBe('rgba(248, 50, 0, 1)');

        //Create Another SVT for Dual SVT check
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows'))
            .toEqual('Service Target - Administration - Business Workflows');
        await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');
        await SlmExpressionBuilder.selectExpressionQualification('Requester', '=', 'PERSON', 'Qianru Tao');
        await SlmExpressionBuilder.clickOnAddExpressionButton('PERSON');
        var selectedExp: string = await SlmExpressionBuilder.getSelectedExpression();
        var expectedSelectedExp = "'" + "Requester" + "'" + "=" + '"' + "Qianru Tao" + '"'
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
        expect(await SlmProgressBar.isSLAProgressBarDualSVTIconDisplayed()).toBe(true); //green
        expect(await caseEditPage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)'); //green
    }, 400 * 1000);

    it('DRDMV-11914:[Global] Both svt gets attached if we have Global and company specific SVTs', async () => {
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows'))
            .toEqual('Service Target - Administration - Business Workflows');
        //Create Global SVT    
        await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Global', 'Case Management');
        await SlmExpressionBuilder.selectExpressionQualification('Requester', '=', 'PERSON', 'Qianru Tao');
        await SlmExpressionBuilder.clickOnAddExpressionButton('PERSON');
        var selectedExp: string = await SlmExpressionBuilder.getSelectedExpression();
        var expectedSelectedExp = "'" + "Requester" + "'" + "=" + '"' + "Qianru Tao" + '"'
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
        var selectedExp: string = await SlmExpressionBuilder.getSelectedExpression();
        var expectedSelectedExp = "'" + "Requester" + "'" + "=" + '"' + "Qianru Tao" + '"'
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
        expect(await SlmProgressBar.isSLAProgressBarDisplayed()).toBe(true);
        expect(await SlmProgressBar.isSLAProgressBarDualSVTIconDisplayed()).toBe(true); //green
        expect(await caseEditPage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)'); //green
        await browser.sleep(100000);
        await browser.refresh();
        expect(await SlmProgressBar.isSLAProgressBarDualSVTIconDisplayed()).toBe(true); //green
        // expect(await caseEditPage.getSlaBarColor()).toBe('rgba(255, 165, 0, 1)'); //orange
        await browser.sleep(50000);
        await browser.refresh();
        expect(await SlmProgressBar.isSLAProgressBarDualSVTIconDisplayed()).toBe(true); //green
        expect(await caseEditPage.getSlaBarColor()).toBe('rgba(248, 50, 0, 1)');
    }, 300 * 1000);

    it('DRDMV-8365:Verify the SLA Progress Bar change in color when single SVT attached', async () => {
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows'))
            .toEqual('Service Target - Administration - Business Workflows');
        //Create a SVT    
        await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');
        await SlmExpressionBuilder.selectExpressionQualification('Priority', '=', 'SELECTION', 'Critical');
        await SlmExpressionBuilder.clickOnAddExpressionButton('SELECTION');
        var selectedExp: string = await SlmExpressionBuilder.getSelectedExpression();
        var expectedSelectedExp = "'" + "Priority" + "'" + "=" + '"' + "Critical" + '"'
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
        expect(await SlmProgressBar.isSLAProgressBarDisplayed()).toBe(true);
        expect(await SlmProgressBar.isSLAProgressBarInProcessIconDisplayed()).toBe(true); //green
        expect(await caseEditPage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)'); //green

        //Change the case status to pending
        await caseEditPage.changeCaseStatus('Pending');
        await caseEditPage.setStatusReason('Customer Response');
        await caseEditPage.clickSaveStatus();
        expect(await SlmProgressBar.isSLAProgressBarPausedIconDisplayed()).toBe(true); //green

        //Update the case status to In Progress
        await caseEditPage.changeCaseStatus('In Progress');
        await caseEditPage.clickSaveStatus();
        expect(await SlmProgressBar.isSLAProgressBarInProcessIconDisplayed()).toBe(true); //green
        browser.sleep(95000);

        //Observe the warning bar on SLA
        expect(await SlmProgressBar.isSLAProgressBarWarningIconDisplayed()).toBe(true); //green

        //Update the case status to Pending
        await caseEditPage.changeCaseStatus('Pending');
        await caseEditPage.setStatusReason('Customer Response');
        await caseEditPage.clickSaveStatus();
        expect(await SlmProgressBar.isSLAProgressBarPausedIconDisplayed()).toBe(true); //green

        //Wait until SLA progress missed goal
        browser.sleep(40000);
        await caseEditPage.changeCaseStatus('In Progress');
        await caseEditPage.clickSaveStatus();
        expect(await SlmProgressBar.isSLAProgressBarMissedGoalIconDisplayed()).toBe(true); //green

        //Update the case status to Pending
        await caseEditPage.changeCaseStatus('Pending');
        await caseEditPage.setStatusReason('Customer Response');
        await caseEditPage.clickSaveStatus();
        expect(await SlmProgressBar.isSLAProgressBarPausedIconDisplayed()).toBe(true); //green

        //Update the case status to Resolved
        await caseEditPage.changeCaseStatus('Resolved');
        await caseEditPage.setStatusReason('Auto Resolved');
        await caseEditPage.clickSaveStatus();
        expect(await SlmProgressBar.isSLAProgressBarMissedGoalIconDisplayed()).toBe(true);
    }, 400 * 1000);

    it('DRDMV-2022:Verify SLA Progress Bar timeline properties', async () => {
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows'))
            .toEqual('Service Target - Administration - Business Workflows');
        //Create a SVT with 2 mins timeline    
        await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');
        await SlmExpressionBuilder.selectExpressionQualification('Priority', '=', 'SELECTION', 'Critical');
        await SlmExpressionBuilder.clickOnAddExpressionButton('SELECTION');
        var selectedExp: string = await SlmExpressionBuilder.getSelectedExpression();
        var expectedSelectedExp = "'" + "Priority" + "'" + "=" + '"' + "Critical" + '"'
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
        var selectedExp: string = await SlmExpressionBuilder.getSelectedExpression();
        var expectedSelectedExp = "'" + "Priority" + "'" + "=" + '"' + "Critical" + '"'
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
        expect(await SlmProgressBar.isMultipleSVTAttached()).toBe(true);
        expect(await SlmProgressBar.isDueInTimeDisplayed()).toBe(true); //green
        expect(await SlmProgressBar.getDueInTime()).toBe("Due in 2 min"); //green
    }, 200 * 1000);
})
