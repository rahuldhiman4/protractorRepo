import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import previewCasePo from '../../pageobject/case/case-preview.po';
import createCasePage from '../../pageobject/case/create-case.po';
import editCasePo from '../../pageobject/case/edit-case.po';
import { default as viewCasePage } from '../../pageobject/case/view-case.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import updateStatusBladePo from '../../pageobject/common/update.status.blade.po';
import serviceTargetConfig from '../../pageobject/settings/slm/service-target-blade.po';
import SlmExpressionBuilder from '../../pageobject/settings/slm/slm-expressionbuilder.pop.po';
import serviceTargetInfoPage from '../../pageobject/slm/service-target-info.po';
import slmProgressBar from '../../pageobject/slm/slm-progressbar.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import caseConsolePo from '../../pageobject/case/case-console.po';

let caseBAUser = 'qkatawazi';
let caseAgentUser = 'qtao';
let caseAgentUserPsilon = 'werusha';

describe('Service Target Tests for Cases', () => {
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
    describe('[DRDMV-17016,DRDMV-7044]: Check if expression is build by using all available field with different relation', async () => {
        let caseId=undefined;
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteServiceTargets();
        });
        it('[DRDMV-17016,DRDMV-7044]:Create a SVT', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Global', 'Case Management');
            await SlmExpressionBuilder.selectExpressionQualification('Category Tier 1', '=', 'ASSOCIATION', 'Applications');
            await SlmExpressionBuilder.clickOnAddExpressionButton('ASSOCIATION');
            let selectedExp: string = await SlmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Category Tier 1" + "'" + "=" + '"' + "Applications" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("3");
            await serviceTargetConfig.selectMeasurement();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.clickOnSaveSVTButton();
            browser.sleep(1000);
        });
        it('[DRDMV-17016,DRDMV-7044]:Create a case', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Mary');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.selectCategoryTier1('Applications');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            caseId = await viewCasePage.getCaseID();
            await browser.sleep(32000);
        });
        it('[DRDMV-17016,DRDMV-7044]:Verify SVT attached to a Case', async () => {
            expect(await slmProgressBar.isSLAProgressBarInProcessIconDisplayed()).toBe(true); //green
            expect(await viewCasePage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)'); //green
            await slmProgressBar.clickOnSLAProgressBarInProcessIcon();
            expect(await serviceTargetInfoPage.isServiceTargetInformationBladeDisplayed()).toBeTruthy('Service Target Information Blade is not displayed.');
            expect(await serviceTargetInfoPage.getServiceTargetInformationBladeHeader()).toBe('Service Target Information');
            expect(await serviceTargetInfoPage.isServiceTargetInformationDetails('Service Target: ')).toBeTruthy('Service Target Label on SVT Info Blade is not displayed.');
            expect(await serviceTargetInfoPage.isServiceTargetInformationFieldValues('SVT from Protractor ')).toBeTruthy('Service Target on SVT Info Blade is not displayed.');
            expect(await serviceTargetInfoPage.isServiceTargetInformationDetails('Due Date and Time: ')).toBeTruthy('Due Date Label on SVT Info Blade is not displayed.');
            expect(await serviceTargetInfoPage.isServiceTargetDueDateDisplayed()).toBeTruthy('Due Date on SVT Info Blade is not displayed.');
            expect(await serviceTargetInfoPage.isServiceTargetInformationInProcessIconDisplayed()).toBeTruthy('SVT In Process Icon on SVT Info Blade is not displayed.');
            expect(await serviceTargetInfoPage.getServiceTargetStatus()).toBe('InProcess');
            await serviceTargetInfoPage.clickOnCloseButton();
            await browser.sleep(90000);
        });
        it('[DRDMV-17016,DRDMV-7044]:Check if expression is build by using all available field with different relation', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            expect(await slmProgressBar.isSLAProgressBarWarningIconDisplayed()).toBe(true); //green
            await browser.sleep(60000);
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            expect(await slmProgressBar.isSLAProgressBarMissedGoalIconDisplayed()).toBe(true); //green
            expect(await viewCasePage.getSlaBarColor()).toBe('rgba(248, 50, 0, 1)');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
        });

    });

    //skhobrag
    describe('[DRDMV-11913]: [Global] Create a Case with global SVT', async () => {
        let caseId=undefined;
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteServiceTargets();
        });
        it('[DRDMV-11913]: Create a Global SVT', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Global', 'Case Management');
            await SlmExpressionBuilder.selectExpressionQualification('Priority', '=', 'SELECTION', 'High');
            await SlmExpressionBuilder.clickOnAddExpressionButton('SELECTION');
            let selectedExp: string = await SlmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Priority" + "'" + "=" + '"' + "High" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("3");
            await serviceTargetConfig.selectMeasurement();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();
            browser.sleep(1000);
        });
        it('[DRDMV-11913]: Create a Case', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Mary');
            await createCasePage.setPriority('High');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.selectCategoryTier1('Employee Relations');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            caseId = await viewCasePage.getCaseID();
            await browser.sleep(32000);
        });
        it('[DRDMV-11913]: Verify SVT attached to a Case', async () => {
            expect(await slmProgressBar.isSLAProgressBarInProcessIconDisplayed()).toBe(true); //green
            expect(await viewCasePage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)'); //green
            await browser.sleep(90000);
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
        });
        it('[DRDMV-11913]: [Global] Create a Case with global SVT', async () => {
            expect(await slmProgressBar.isSLAProgressBarWarningIconDisplayed()).toBe(true); //green
            await browser.sleep(70000);
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            expect(await slmProgressBar.isSLAProgressBarMissedGoalIconDisplayed()).toBe(true); //green
            expect(await viewCasePage.getSlaBarColor()).toBe('rgba(248, 50, 0, 1)');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
        });
    });

    //skhobrag
    describe('[DRDMV-2027]: Icons representing measurement status on SLA Progress Bar', async () => {
        let selectedExp = '';
        let expectedSelectedExp = '';
        let caseId=undefined;
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteServiceTargets();
        });
        it('[DRDMV-2027]: Create a SVT', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');
            await SlmExpressionBuilder.selectFirstLevelExpressionQualification('Requester', '=', 'PERSON', 'Qianru Tao');
            await SlmExpressionBuilder.clickOnAddExpressionButton('PERSON');
            let selectedExp: string = await SlmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Requester" + "'" + "=" + '"' + "Qianru Tao" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("3");
            await serviceTargetConfig.selectMeasurement();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();
            browser.sleep(1000);
        });
        it('[DRDMV-2027]: Create a Case and verify SVT attached to case', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Qianru Tao');
            await createCasePage.setPriority('High');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.selectCategoryTier1('Employee Relations');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            caseId = await viewCasePage.getCaseID();
            await browser.sleep(31000);
            expect(await slmProgressBar.isSLAProgressBarInProcessIconDisplayed()).toBe(true); //green
            expect(await viewCasePage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)'); //green
            await browser.sleep(90000);
        });
        it('[DRDMV-2027]: Verify SVT warning and missed goal status', async () => {
            await browser.sleep(30000);
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            expect(await slmProgressBar.isSLAProgressBarWarningIconDisplayed()).toBe(true); //green
            expect(await viewCasePage.getSlaBarColor()).toBe('rgba(241, 181, 33, 1)'); //orange
            await browser.sleep(50000);
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            expect(await slmProgressBar.isSLAProgressBarMissedGoalIconDisplayed()).toBe(true); //green
            expect(await viewCasePage.getSlaBarColor()).toBe('rgba(248, 50, 0, 1)');
        });
        it('[DRDMV-2027]: Create another svt', async () => {
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
            await serviceTargetConfig.selectGoal("3");
            await serviceTargetConfig.selectMeasurement();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();
            browser.sleep(1000);
        });
        it('[DRDMV-2027]: Verify new SVT created on case', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Qianru Tao');
            await createCasePage.setPriority('High');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.selectCategoryTier1('Employee Relations');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await browser.sleep(31000);
            expect(await slmProgressBar.isSLAProgressBarDualSVTIconDisplayed()).toBe(true); //green
            expect(await viewCasePage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)'); //green
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
        });

    });

    //skhobrag   
    describe('[DRDMV-11914]: [Global] Both svt gets attached if we have Global and company specific SVTs', async () => {
        let selectedExp = '';
        let expectedSelectedExp = '';
        let caseId=undefined;
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteServiceTargets();
        });
        it('[DRDMV-11914]: Create Global SVT', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Global', 'Case Management');
            await SlmExpressionBuilder.selectFirstLevelExpressionQualification('Requester', '=', 'PERSON', 'Qianru Tao');
            await SlmExpressionBuilder.clickOnAddExpressionButton('PERSON');
            selectedExp = await SlmExpressionBuilder.getSelectedExpression();
            expectedSelectedExp = "'" + "Requester" + "'" + "=" + '"' + "Qianru Tao" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("4");
            await serviceTargetConfig.selectMeasurement();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();
            browser.sleep(2000);
        });
        it('[DRDMV-11914]: Create company specific SVT', async () => {
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');
            await SlmExpressionBuilder.selectFirstLevelExpressionQualification('Requester', '=', 'PERSON', 'Qianru Tao');
            await SlmExpressionBuilder.clickOnAddExpressionButton('PERSON');
            selectedExp = await SlmExpressionBuilder.getSelectedExpression();
            expectedSelectedExp = "'" + "Requester" + "'" + "=" + '"' + "Qianru Tao" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("4");
            await serviceTargetConfig.selectMeasurement();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();
            await browser.sleep(1000);
        });
        it('[DRDMV-11914]: Create a case to attach both Global and Company specific SVT', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Qianru Tao');
            await createCasePage.setPriority('High');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.selectCategoryTier1('Employee Relations');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            caseId = await viewCasePage.getCaseID();
            await browser.sleep(31000);
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBe(true);
            expect(await slmProgressBar.isSLAProgressBarDualSVTIconDisplayed()).toBe(true); //green
            expect(await viewCasePage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)'); //green
            await browser.sleep(40000);
        });
        it('[DRDMV-11914]: Verify Dual SVT in SLA Warning state', async () => {
            await browser.sleep(90000);
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            expect(await slmProgressBar.isSLAProgressBarDualSVTIconDisplayed()).toBe(true); //green
            expect(await viewCasePage.getSlaBarColor()).toBe('rgba(241, 181, 33, 1)'); //orange
        });
        it('[DRDMV-11914]: Verify Dual SVT in SLA Missed Goal state', async () => {
            await browser.sleep(90000);
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            expect(await slmProgressBar.isSLAProgressBarDualSVTIconDisplayed()).toBe(true); //green
            expect(await viewCasePage.getSlaBarColor()).toBe('rgba(248, 50, 0, 1)');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        });
    });

    //skhobrag
    describe('[DRDMV-8365]: Verify the SLA Progress Bar change in color when single SVT attached', async () => {
        let caseId=undefined;
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteServiceTargets();
        });
        it('[DRDMV-8365]: Create SVT', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');
            await SlmExpressionBuilder.selectExpressionQualification('Priority', '=', 'SELECTION', 'Critical');
            await SlmExpressionBuilder.clickOnAddExpressionButton('SELECTION');
            let selectedExp = await SlmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Priority" + "'" + "=" + '"' + "Critical" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("4");
            await serviceTargetConfig.selectMeasurement();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();
        });
        it('[DRDMV-8365]: Create a case and verify SVT attached to a case', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Qianru Tao');
            await createCasePage.setPriority('Critical');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.selectCategoryTier1('Employee Relations');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            caseId = await viewCasePage.getCaseID();
            await browser.sleep(31000);
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBe(true);
            expect(await slmProgressBar.isSLAProgressBarInProcessIconDisplayed()).toBe(true); //green
            expect(await viewCasePage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)'); //green
        });
        it('[DRDMV-8365]: Verify SVT status when case is in Pending status', async () => {
            await updateStatusBladePo.changeCaseStatus('Pending');
            await updateStatusBladePo.setStatusReason('Customer Response');
            await updateStatusBladePo.clickSaveStatus();
            await browser.sleep(2000);
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            expect(await slmProgressBar.isSLAProgressBarPausedIconDisplayed()).toBe(true); //green
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            await browser.sleep(2000);
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            expect(await slmProgressBar.isSLAProgressBarInProcessIconDisplayed()).toBe(true); //green
            await browser.sleep(80000);
        });
        it('[DRDMV-8365]: Verify SVT when its in Warning Pending status', async () => {
            await browser.sleep(40000);
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            expect(await slmProgressBar.isSLAProgressBarWarningIconDisplayed()).toBe(true); //green
            await updateStatusBladePo.changeCaseStatus('Pending');
            await updateStatusBladePo.setStatusReason('Customer Response');
            await updateStatusBladePo.clickSaveStatus();
            await browser.sleep(2000);
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            expect(await slmProgressBar.isSLAProgressBarPausedIconDisplayed()).toBe(true); //green
        });
        it('[DRDMV-8365]: Verify SVT in Missed goal status', async () => {
            browser.sleep(40000);
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            await browser.sleep(60000);
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            expect(await slmProgressBar.isSLAProgressBarMissedGoalIconDisplayed()).toBe(true); //green
            await updateStatusBladePo.changeCaseStatus('Pending');
            await updateStatusBladePo.setStatusReason('Customer Response');
            await updateStatusBladePo.clickSaveStatus();
            await browser.sleep(2000);
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            expect(await slmProgressBar.isSLAProgressBarPausedIconDisplayed()).toBe(true); //green
            await updateStatusBladePo.changeCaseStatus('Resolved');
            await updateStatusBladePo.setStatusReason('Auto Resolved');
            await updateStatusBladePo.clickSaveStatus();
            await browser.sleep(2000);
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            expect(await slmProgressBar.isSLAProgressBarMissedGoalIconDisplayed()).toBe(true);
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
        });
    });

    //skhobrag
    describe('[DRDMV-2022]: Verify SLA Progress Bar timeline properties', async () => {
        let selectedExp = '';
        let expectedSelectedExp = '';
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteServiceTargets();
        });
        it('[DRDMV-2022]: Create a SVT with 2 min timeline', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');
            await SlmExpressionBuilder.selectExpressionQualification('Priority', '=', 'SELECTION', 'Critical');
            await SlmExpressionBuilder.clickOnAddExpressionButton('SELECTION');
            let selectedExp = await SlmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Priority" + "'" + "=" + '"' + "Critical" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("2");
            await serviceTargetConfig.selectMeasurement();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();
            await browser.sleep(2000);
        });
        it('[DRDMV-2022]: Create a SVT with 4 mins timeline', async () => {
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');
            await SlmExpressionBuilder.selectExpressionQualification('Priority', '=', 'SELECTION', 'Critical');
            await SlmExpressionBuilder.clickOnAddExpressionButton('SELECTION');
            selectedExp = await SlmExpressionBuilder.getSelectedExpression();
            expectedSelectedExp = "'" + "Priority" + "'" + "=" + '"' + "Critical" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("4");
            await serviceTargetConfig.selectMeasurement();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();
            browser.sleep(2000);
        });
        it('[DRDMV-2022]: Create a case', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Qianru Tao');
            await createCasePage.setPriority('Critical');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.selectCategoryTier1('Employee Relations');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
        });
        it('[DRDMV-2022]: Verify Multiple SVT attached on Case', async () => {
            await browser.sleep(31000);
            expect(await slmProgressBar.isMultipleSVTAttached()).toBe(true);
            expect(await slmProgressBar.isDueInTimeDisplayed()).toBe(true); //green
            expect(await slmProgressBar.getDueInTime()).toBe("Due in 2 min"); //green            
        });

        afterAll(async () => {
            await utilityCommon.closeAllBlades();
        });

    });

    //skhobrag
    describe('[DRDMV-6150]: If Company doesnt match, SVT is not applied', async () => {
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteServiceTargets();
        });
        it('[DRDMV-6150]: Create a SVT', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');
            await SlmExpressionBuilder.selectFirstLevelExpressionQualification('Company', '=', 'NAMED_LIST', 'Petramco');
            await SlmExpressionBuilder.clickOnAddExpressionButton('NAMED_LIST');
            let selectedExp: string = await SlmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Company" + "'" + "=" + '"' + "Petramco" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("2");
            await serviceTargetConfig.selectMeasurement();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();
            await navigationPage.signOut();
        });
        it('[DRDMV-6150]: Verify if SVT attached to a case created through different company user', async () => {
            await loginPage.login(caseAgentUserPsilon);
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Doomi Bomei');
            await createCasePage.setPriority('Critical');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBeFalsy('SVT is attached to case created by different company user.');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        });
    });

    //skhobrag
    describe('[DRDMV-6311]: Create an Svt with Pause qualification and identity the SLA bar in different pause conditions', async () => {
        let caseId = undefined;
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteServiceTargets();
        });
        it('[DRDMV-6311]: Create SVT', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');
            await SlmExpressionBuilder.selectExpressionQualification('Priority', '=', 'SELECTION', 'High');
            await SlmExpressionBuilder.clickOnAddExpressionButton('SELECTION');
            let selectedExp: string = await SlmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Priority" + "'" + "=" + '"' + "High" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("4");
            await serviceTargetConfig.selectMeasurement();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();
            await browser.sleep(1000);
            await navigationPage.signOut();
        });
        it('[DRDMV-6311]: Create a case and verify SVT attached to case', async () => {
            await loginPage.login(caseAgentUser);
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Qiang Du');
            await createCasePage.setPriority('High');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            caseId = await viewCasePage.getCaseID();
            await browser.sleep(31000);
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBeTruthy('SVT is not attached to case.');
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('In Progress');
            await slmProgressBar.clickOnSLAProgressBarInProcessIcon();
            expect(await serviceTargetInfoPage.isServiceTargetInformationBladeDisplayed()).toBeTruthy('Service Target Information Blade is not displayed.');
            expect(await serviceTargetInfoPage.isServiceTargetInformationInProcessIconDisplayed()).toBeTruthy('SVT In Process Icon on SVT Info Blade is not displayed.');
            expect(await serviceTargetInfoPage.getServiceTargetStatus()).toBe('InProcess');
            await serviceTargetInfoPage.clickOnCloseButton();
        });
        it('[DRDMV-6311]: Verify SVT in pending status', async () => {
            await updateStatusBladePo.changeCaseStatus('Pending');
            await updateStatusBladePo.setStatusReason('Customer Response');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Pending');
            await browser.sleep(2000);
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
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
            await browser.sleep(70000);
        });
        it('[DRDMV-6311]: Verify svt in warning status', async () => {
            await browser.sleep(55000);
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            await expect(slmProgressBar.isSLAProgressBarWarningIconDisplayed()).toBeTruthy('SLA Warning bar is not displayed');
            await updateStatusBladePo.changeCaseStatus('Pending');
            await updateStatusBladePo.setStatusReason('Customer Response');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Pending');
            await browser.sleep(2000);
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            await slmProgressBar.clickOnSLAProgressBarPausedIcon();
        });
        it('[DRDMV-6311]: Verify SVT with missed goal status', async () => {
            expect(await serviceTargetInfoPage.isServiceTargetInformationBladeDisplayed()).toBeTruthy('Service Target Information Blade is not displayed.');
            expect(await serviceTargetInfoPage.isServiceTargetInformationPausedIconDisplayed()).toBeTruthy('SVT Warning Pending Icon on SVT Info Blade is not displayed.');
            expect(await serviceTargetInfoPage.getServiceTargetStatus()).toBe('Warning Pending');
            await serviceTargetInfoPage.clickOnCloseButton();
            await updateStatusBladePo.changeCaseStatus('Assigned');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Assigned');
            await browser.sleep(70000);
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            await expect(slmProgressBar.isSLAProgressBarMissedGoalIconDisplayed()).toBeTruthy('SLA Missed Goal bar is not displayed');
            await updateStatusBladePo.changeCaseStatus('Pending');
            await updateStatusBladePo.setStatusReason('Customer Response');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Pending');
            await browser.sleep(2000);
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            await slmProgressBar.clickOnSLAProgressBarPausedIcon();
            expect(await serviceTargetInfoPage.isServiceTargetInformationBladeDisplayed()).toBeTruthy('Service Target Information Blade is not displayed.');
            expect(await serviceTargetInfoPage.isServiceTargetInformationPausedIconDisplayed()).toBeTruthy('SVT Missed Goal Pending Icon on SVT Info Blade is not displayed.');
            expect(await serviceTargetInfoPage.getServiceTargetStatus()).toBe('Missed Goal Pending');
            await serviceTargetInfoPage.clickOnCloseButton();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        });
    });

    //skhobrag
    describe('[DRDMV-8368]: Verify SLA Progress Bar change in color when multiple SVT attached and one SVT is missed', async () => {
        let selectedExp = '';
        let expectedSelectedExp = '';
        let caseId = undefined;
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteServiceTargets();
        });
        it('[DRDMV-8368]: Create a SVT', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');
            await SlmExpressionBuilder.selectFirstLevelExpressionQualification('Requester', '=', 'PERSON', 'Qiang Du');
            await SlmExpressionBuilder.clickOnAddExpressionButton('PERSON');
            selectedExp = await SlmExpressionBuilder.getSelectedExpression();
            expectedSelectedExp = "'" + "Requester" + "'" + "=" + '"' + "Qiang Du" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("3");
            await serviceTargetConfig.selectMeasurement();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();
        });
        it('[DRDMV-8368]: Create another SVT', async () => {
            browser.sleep(2000);
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');
            await SlmExpressionBuilder.selectFirstLevelExpressionQualification('Requester', '=', 'PERSON', 'Qiang Du');
            await SlmExpressionBuilder.clickOnAddExpressionButton('PERSON');
            selectedExp = await SlmExpressionBuilder.getSelectedExpression();
            expectedSelectedExp = "'" + "Requester" + "'" + "=" + '"' + "Qiang Du" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("5");
            await serviceTargetConfig.selectMeasurement();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();
            await browser.sleep(1000);
            await navigationPage.signOut();
        });
        it('[DRDMV-8368]: Create a case and verify SVT attached to a case', async () => {
            await loginPage.login(caseAgentUser);
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Qiang Du');
            await createCasePage.setPriority('High');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            caseId = await viewCasePage.getCaseID();
            await browser.sleep(31000);
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBeTruthy('SVT is not attached to case.');
            expect(await slmProgressBar.isDueInTimeDisplayed()).toBe(true);
            browser.sleep(100000);
        });
        it('[DRDMV-8368]: Verify SVT missed goal pending status', async () => {
            browser.sleep(120000);
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            expect(await slmProgressBar.isSLAProgressBarMissedGoalIconDisplayed()).toBe(true); //green
            expect(await viewCasePage.getSlaBarColor()).toBe('rgba(248, 50, 0, 1)');
            browser.sleep(60000);
        });
        it('[DRDMV-8368]: Verify SVT Missed Goal Status', async () => {
            await updateStatusBladePo.changeCaseStatus('Pending');
            await updateStatusBladePo.setStatusReason('Customer Response');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Pending');
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            await slmProgressBar.clickOnSLAProgressBarPausedIcon();
            expect(await serviceTargetInfoPage.isServiceTargetInformationBladeDisplayed()).toBeTruthy('Service Target Information Blade is not displayed.');
            expect(await serviceTargetInfoPage.isServiceTargetInformationPausedIconDisplayed()).toBeTruthy('SVT Pending Icon on SVT Info Blade is not displayed.');
            expect(await serviceTargetInfoPage.getServiceTargetStatus()).toBe('Missed Goal Pending');
            await serviceTargetInfoPage.clickOnCloseButton();
            await updateStatusBladePo.changeCaseStatus('Assigned');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Assigned');
            await browser.sleep(20000);
            expect(await slmProgressBar.isSLAProgressBarMissedGoalIconDisplayed()).toBe(true); //green
            await browser.sleep(2000);
            expect(await viewCasePage.getSlaBarColor()).toBe('rgba(248, 50, 0, 1)');
            await slmProgressBar.clickOnSLAProgressBarMissedGoalIcon();
            expect(await serviceTargetInfoPage.isServiceTargetInformationBladeDisplayed()).toBeTruthy('Service Target Information Blade is not displayed.');
            expect(await serviceTargetInfoPage.isServiceTargetInformationMissedGoalIconDisplayed()).toBeTruthy('SVT In Process Icon on SVT Info Blade is not displayed.');
            expect(await serviceTargetInfoPage.getServiceTargetStatus()).toBe('Missed Goal');
            await serviceTargetInfoPage.clickOnCloseButton();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        });
    });

    //skhobrag
    describe('[DRDMV-8367]: Verify the SLA Progress Bar change in color when multiple SVT attached and all SVT are in Pause State', async () => {
        let selectedExp = '';
        let expectedSelectedExp = '';
        let caseId = undefined;
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteServiceTargets();
        });
        it('[DRDMV-8367]: Create a SVT', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');
            await SlmExpressionBuilder.selectFirstLevelExpressionQualification('Requester', '=', 'PERSON', 'Qiang Du');
            await SlmExpressionBuilder.clickOnAddExpressionButton('PERSON');
            selectedExp = await SlmExpressionBuilder.getSelectedExpression();
            expectedSelectedExp = "'" + "Requester" + "'" + "=" + '"' + "Qiang Du" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("3");
            await serviceTargetConfig.selectMeasurement();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();
            browser.sleep(2000);
        });
        it('[DRDMV-8367]: Create another SVT', async () => {
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');
            await SlmExpressionBuilder.selectFirstLevelExpressionQualification('Requester', '=', 'PERSON', 'Qiang Du');
            await SlmExpressionBuilder.clickOnAddExpressionButton('PERSON');
            selectedExp = await SlmExpressionBuilder.getSelectedExpression();
            expectedSelectedExp = "'" + "Requester" + "'" + "=" + '"' + "Qiang Du" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("5");
            await serviceTargetConfig.selectMeasurement();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();
            await browser.sleep(1000);
            await navigationPage.signOut();
        });
        it('[DRDMV-8367]: Create a case and verify SVT attached to case', async () => {
            await loginPage.login(caseAgentUser);
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Qiang Du');
            await createCasePage.setPriority('High');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            caseId = await viewCasePage.getCaseID();
            await browser.sleep(31000);
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBeTruthy('SVT is not attached to case.');
            expect(await slmProgressBar.isDueInTimeDisplayed()).toBe(true);
        });
        it('[DRDMV-8367]: Verify the SLA Progress Bar change in color when multiple SVT attached and all SVT are in Pause State', async () => {
            await browser.sleep(2000);
            await updateStatusBladePo.changeCaseStatus('Pending');
            await updateStatusBladePo.setStatusReason('Customer Response');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Pending');
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            await slmProgressBar.clickOnSLAProgressBarPausedIcon();
            expect(await serviceTargetInfoPage.isServiceTargetInformationBladeDisplayed()).toBeTruthy('Service Target Information Blade is not displayed.');
            expect(await serviceTargetInfoPage.isServiceTargetInformationPausedIconDisplayed()).toBeTruthy('SVT Pending Icon on SVT Info Blade is not displayed.');
            expect(await serviceTargetInfoPage.getServiceTargetStatus()).toBe('Pending');
            await serviceTargetInfoPage.clickOnCloseButton();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        });
    });

    //skhobrag
    describe('[DRDMV-8366]: Verify the SLA Progress Bar change in color when multiple SVT attached and one SVT is Met', async () => {
        let selectedExp = '';
        let expectedSelectedExp = '';
        let caseId = undefined;
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteServiceTargets();
        });
        it('[DRDMV-8366]: Create a SVT', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');
            await SlmExpressionBuilder.selectFirstLevelExpressionQualification('Requester', '=', 'PERSON', 'Qiang Du');
            await SlmExpressionBuilder.clickOnAddExpressionButton('PERSON');
            selectedExp = await SlmExpressionBuilder.getSelectedExpression();
            expectedSelectedExp = "'" + "Requester" + "'" + "=" + '"' + "Qiang Du" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("3");
            await serviceTargetConfig.selectMeasurement();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "In Progress");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();
            browser.sleep(1000);
        });
        it('[DRDMV-8366]: Create another SVT', async () => {
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');
            await SlmExpressionBuilder.selectFirstLevelExpressionQualification('Requester', '=', 'PERSON', 'Qiang Du');
            await SlmExpressionBuilder.clickOnAddExpressionButton('PERSON');
            selectedExp = await SlmExpressionBuilder.getSelectedExpression();
            expectedSelectedExp = "'" + "Requester" + "'" + "=" + '"' + "Qiang Du" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("5");
            await serviceTargetConfig.selectMeasurement();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();
            browser.sleep(1000);
            await navigationPage.signOut();
        });
        it('[DRDMV-8366]: Create case and verify SVT attached to case', async () => {
            await loginPage.login(caseAgentUser);
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Qiang Du');
            await createCasePage.setPriority('High');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            caseId = await viewCasePage.getCaseID();
            await browser.sleep(31000);
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBeTruthy('SVT is not attached to case.');
            expect(await slmProgressBar.isDueInTimeDisplayed()).toBe(true);
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            expect(await slmProgressBar.isSLAProgressBarSVTMetIconDisplayed()).toBeTruthy('Service Target Complete (Met) Icon is not displayed.');
            await slmProgressBar.clickOnSLAProgressBarSVTMetIcon();
            expect(await serviceTargetInfoPage.isServiceTargetInformationBladeDisplayed()).toBeTruthy('Service Target Information Blade is not displayed.');
            expect(await serviceTargetInfoPage.isServiceTargetInformationSVTMetIconDisplayed()).toBeTruthy('SVT Complete Icon on SVT Info Blade is not displayed.');
            expect(await serviceTargetInfoPage.getServiceTargetStatus()).toBe('Met');
            await serviceTargetInfoPage.clickOnCloseButton();
            expect(await viewCasePage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)');
        });
        it('[DRDMV-8366]: Verify SLA Warning status', async () => {
            await updateStatusBladePo.changeCaseStatus('Pending');
            await updateStatusBladePo.setStatusReason('Customer Response');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Pending');
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            await slmProgressBar.clickOnSLAProgressBarPausedIcon();
            expect(await serviceTargetInfoPage.isServiceTargetInformationBladeDisplayed()).toBeTruthy('Service Target Information Blade is not displayed.');
            expect(await serviceTargetInfoPage.isServiceTargetInformationPausedIconDisplayed()).toBeTruthy('SVT Pending Icon on SVT Info Blade is not displayed.');
            expect(await serviceTargetInfoPage.getServiceTargetStatus()).toBe('Pending');
            await serviceTargetInfoPage.clickOnCloseButton();
            await updateStatusBladePo.changeCaseStatus('Assigned');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Assigned');
            await browser.sleep(80000);
        });
        it('[DRDMV-8366]: Change case status to pending and verify SVT in Paused condition', async () => {
            await browser.sleep(70000);
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            await expect(slmProgressBar.isSLAProgressBarWarningIconDisplayed()).toBeTruthy('SLA Warning bar is not displayed');
            await updateStatusBladePo.changeCaseStatus('Pending');
            await updateStatusBladePo.setStatusReason('Customer Response');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Pending');
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
        });
        it('[DRDMV-8366]: Verify the SLA Progress Bar change in color when multiple SVT attached and one SVT is Met', async () => {
            await slmProgressBar.clickOnSLAProgressBarPausedIcon();
            expect(await serviceTargetInfoPage.isServiceTargetInformationBladeDisplayed()).toBeTruthy('Service Target Information Blade is not displayed.');
            expect(await serviceTargetInfoPage.isServiceTargetInformationPausedIconDisplayed()).toBeTruthy('SVT Warning Pending Icon on SVT Info Blade is not displayed.');
            expect(await serviceTargetInfoPage.getServiceTargetStatus()).toBe('Warning Pending');
            await serviceTargetInfoPage.clickOnCloseButton();
            await updateStatusBladePo.changeCaseStatus('Assigned');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Assigned');
            await browser.sleep(70000);
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
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
            expect(await viewCasePage.getSlaBarColor()).toBe('rgba(248, 50, 0, 1)');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        });
    });

    //skhobrag
    describe('[DRDMV-8370]: Verify Visualization change when Status changes(In Process-> Pending)', async () => {
        let caseId = undefined;
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteServiceTargets();
        });
        it('[DRDMV-8370]: Create a SVT', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');
            await SlmExpressionBuilder.selectExpressionQualification('Priority', '=', 'SELECTION', 'Critical');
            await SlmExpressionBuilder.clickOnAddExpressionButton('SELECTION');
            let selectedExp: string = await SlmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Priority" + "'" + "=" + '"' + "Critical" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("2");
            await serviceTargetConfig.selectMeasurement();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();
            await browser.sleep(1000);
            await navigationPage.signOut();
        });
        it('[DRDMV-8370]: Create a Case', async () => {
            await loginPage.login(caseAgentUser);
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Qiang Du');
            await createCasePage.setPriority('Critical');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            caseId = await viewCasePage.getCaseID();
        });
        it('[DRDMV-8370]: Verify Visualization change when Status changes(In Process-> Pending)', async () => {
            await browser.sleep(31000);
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBeTruthy('SVT is not attached to case.');
            expect(await slmProgressBar.isDueInTimeDisplayed()).toBe(true);
            expect(await viewCasePage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)');
            await updateStatusBladePo.changeCaseStatus('Pending');
            await updateStatusBladePo.setStatusReason('Customer Response');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Pending');
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            await slmProgressBar.clickOnSLAProgressBarPausedIcon();
            expect(await serviceTargetInfoPage.isServiceTargetInformationBladeDisplayed()).toBeTruthy('Service Target Information Blade is not displayed.');
            expect(await serviceTargetInfoPage.isServiceTargetInformationPausedIconDisplayed()).toBeTruthy('SVT Pending Icon on SVT Info Blade is not displayed.');
            expect(await serviceTargetInfoPage.getServiceTargetStatus()).toBe('Pending');
            await serviceTargetInfoPage.clickOnCloseButton();
            expect(await viewCasePage.getSlaBarColor()).toBe('rgba(149, 152, 153, 1)');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        });
    });

    //skhobrag
    describe('[DRDMV-8371]: Verify Visualization change when Status changes(In Process-> Met)', async () => {
        let caseId = undefined;
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteServiceTargets();
        });
        it('[DRDMV-8371]: Create a SVT', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');
            await SlmExpressionBuilder.selectExpressionQualification('Priority', '=', 'SELECTION', 'Critical');
            await SlmExpressionBuilder.clickOnAddExpressionButton('SELECTION');
            let selectedExp: string = await SlmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Priority" + "'" + "=" + '"' + "Critical" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("2");
            await serviceTargetConfig.selectMeasurement();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();
            await browser.sleep(1000);
            await navigationPage.signOut();
        });
        it('[DRDMV-8371]: Create a Case', async () => {
            await loginPage.login(caseAgentUser);
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Qiang Du');
            await createCasePage.setPriority('Critical');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            caseId = await viewCasePage.getCaseID();
            await browser.sleep(31000);
        });
        it('[DRDMV-8371]: Verify Visualization change when Status changes(In Process-> Met)', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBeTruthy('SVT is not attached to case.');
            expect(await slmProgressBar.isDueInTimeDisplayed()).toBe(true);
            expect(await viewCasePage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)');
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
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        });
    });

    //skhobrag
    describe('[DRDMV-8372]: Verify Visualization change when Status changes(Warning-> Met)', async () => {
        let caseId = undefined;
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteServiceTargets();
        });
        it('[DRDMV-8372]: Create a SVT', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');
            await SlmExpressionBuilder.selectExpressionQualification('Priority', '=', 'SELECTION', 'Critical');
            await SlmExpressionBuilder.clickOnAddExpressionButton('SELECTION');
            let selectedExp: string = await SlmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Priority" + "'" + "=" + '"' + "Critical" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("3");
            await serviceTargetConfig.selectMeasurement();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();
            await browser.sleep(1000);
            await navigationPage.signOut();
        });
        it('[DRDMV-8372]: Create a case', async () => {
            await loginPage.login(caseAgentUser);
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Qiang Du');
            await createCasePage.setPriority('Critical');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            caseId = await viewCasePage.getCaseID();
            await browser.sleep(31000);
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBeTruthy('SVT is not attached to case.');
            expect(await slmProgressBar.isDueInTimeDisplayed()).toBe(true);
            expect(await viewCasePage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)');
            await browser.sleep(70000);
        });
        it('[DRDMV-8372]: Verify Visualization change when Status changes(Warning-> Met)', async () => {
            await browser.sleep(20000);
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            expect(await slmProgressBar.isSLAProgressBarWarningIconDisplayed()).toBeTruthy('SVT Warning Icon is not attached to case.');
            await updateStatusBladePo.changeCaseStatus('Resolved');
            await updateStatusBladePo.setStatusReason('Auto Resolved');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Resolved');
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            expect(await slmProgressBar.isSLAProgressBarSVTMetIconDisplayed()).toBeTruthy('SVT Met Icon is not attached to case.');
            await slmProgressBar.clickOnSLAProgressBarSVTMetIcon();
            expect(await serviceTargetInfoPage.isServiceTargetInformationBladeDisplayed()).toBeTruthy('Service Target Information Blade is not displayed.');
            expect(await serviceTargetInfoPage.isServiceTargetInformationSVTMetIconDisplayed()).toBeTruthy('SVT Met Icon on SVT Info Blade is not displayed.');
            expect(await serviceTargetInfoPage.getServiceTargetStatus()).toBe('Met');
            await serviceTargetInfoPage.clickOnCloseButton();
            expect(await viewCasePage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        });
    });

    //skhobrag
    describe('[DRDMV-8373]: Verify Visualization change when Case is no longer match SVT configurations(In Process->Detached)', async () => {
        let caseId = '';
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteServiceTargets();
        });
        it('[DRDMV-8373]: Create a SVT', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');
            await SlmExpressionBuilder.selectExpressionQualification('Priority', '=', 'SELECTION', 'Critical');
            await SlmExpressionBuilder.clickOnAddExpressionButton('SELECTION');
            let selectedExp: string = await SlmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Priority" + "'" + "=" + '"' + "Critical" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("3");
            await serviceTargetConfig.selectMeasurement();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();
            await navigationPage.signOut();
            await browser.sleep(1000);
        });
        it('[DRDMV-8373]: Verify SVT dettached when case is updated to not match SVT condition', async () => {
            await loginPage.login(caseAgentUser);
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Qiang Du');
            await createCasePage.setPriority('Critical');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await browser.sleep(31000);
            caseId = await viewCasePage.getCaseID();
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBeTruthy('SVT is not attached to case.');
            expect(await slmProgressBar.isDueInTimeDisplayed()).toBe(true);
            expect(await viewCasePage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)');
            await viewCasePage.clickEditCaseButton();
            await editCasePo.updateCasePriority('Low');
            await editCasePo.clickSaveCase();
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBeFalsy('SVT is not attached to case.');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        });
    });

    //skhobrag
    describe('[DRDMV-8374]: No change is visualization after specified time passed', async () => {
        let caseId = undefined;
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteServiceTargets();
        });
        it('[DRDMV-8374]: Create a SVT', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');
            await SlmExpressionBuilder.selectExpressionQualification('Priority', '=', 'SELECTION', 'Critical');
            await SlmExpressionBuilder.clickOnAddExpressionButton('SELECTION');
            let selectedExp: string = await SlmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Priority" + "'" + "=" + '"' + "Critical" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("3");
            await serviceTargetConfig.selectMeasurement();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();
            await browser.sleep(1000);
            await navigationPage.signOut();
        });
        it('[DRDMV-8374]: Create a case', async () => {
            await loginPage.login(caseAgentUser);
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Qiang Du');
            await createCasePage.setPriority('Critical');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            caseId = await viewCasePage.getCaseID();
            await browser.sleep(32000);
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBeTruthy('SVT is not attached to case.');
            expect(await slmProgressBar.isDueInTimeDisplayed()).toBe(true);
            expect(await viewCasePage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)');
            await browser.sleep(70000);
        });
        it('[DRDMV-8374]: No change is visualization after specified time passed', async () => {
            await browser.sleep(20000);
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            expect(await slmProgressBar.isSLAProgressBarWarningIconDisplayed()).toBeTruthy('SVT Warning Icon is not attached to case.');
            await browser.sleep(70000);
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            await expect(slmProgressBar.isSLAProgressBarMissedGoalIconDisplayed()).toBeTruthy('SLA Missed Goal bar is not displayed');
            expect(await viewCasePage.getSlaBarColor()).toBe('rgba(248, 50, 0, 1)');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        });
    });

    //skhobrag
    describe('[DRDMV-2044]: Tooltip text & display allignment for measurements on SLA Progress Bar', async () => {
        let caseId = undefined;
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteServiceTargets();
        });
        it('[DRDMV-2044]: Create a SVT', async () => {
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
            await serviceTargetConfig.selectMeasurement();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();
            await browser.sleep(1000);
            await navigationPage.signOut();
        });
        it('[DRDMV-2044]: Create a case and verify SVT attached to the case', async () => {
            await loginPage.login(caseAgentUser);
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Qiang Du');
            await createCasePage.setPriority('Critical');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            caseId = await viewCasePage.getCaseID();
            await browser.sleep(31000);
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBeTruthy('SVT is not attached to case.');
            expect(await slmProgressBar.isDueInTimeDisplayed()).toBe(true);
            expect(await viewCasePage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)');
            expect(await slmProgressBar.isSVTToolTipTextDisplayed()).toBeTruthy("SVT ToolTip Text is not displayed.");
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('SVT from Protractor');
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('Status : InProcess');
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('due on');
        });
        it('[DRDMV-2044]: Update case status to and verify SVT status ', async () => {
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
        });
        it('[DRDMV-2044]: update case status to resolved and verify SVT status', async () => {
            await updateStatusBladePo.changeCaseStatus('Resolved');
            await updateStatusBladePo.setStatusReason('Auto Resolved');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePage.getTextOfStatus()).toBe('Resolved');
            expect(await slmProgressBar.isSVTToolTipTextDisplayed()).toBeTruthy("SVT ToolTip Text is not displayed.");
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('SVT from Protractor');
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('Status : Met');
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('due on');
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('met on');
        });
        it('[DRDMV-2044]: Create another case to verify SVT warning and missed goal status', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Qiang Du');
            await createCasePage.setPriority('Critical');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            caseId = await viewCasePage.getCaseID();
            await browser.sleep(31000);
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBeTruthy('SVT is not attached to case.');
            expect(await slmProgressBar.isDueInTimeDisplayed()).toBe(true);
            expect(await viewCasePage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)');
            await browser.sleep(70000);
        });
        it('[DRDMV-2044]: Verify SVT with Warning status', async () => {
            await browser.sleep(20000);
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            expect(await slmProgressBar.isSLAProgressBarWarningIconDisplayed()).toBeTruthy('SVT Warning Icon is not attached to case.');
            expect(await slmProgressBar.isSVTToolTipTextDisplayed()).toBeTruthy("SVT ToolTip Text is not displayed.");
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('SVT from Protractor');
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('Status : Warning');
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('due on');
        });
        it('[DRDMV-2044]: Verify SVT with Missed Goal Status', async () => {
            await browser.sleep(70000);
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            await expect(slmProgressBar.isSLAProgressBarMissedGoalIconDisplayed()).toBeTruthy('SLA Missed Goal bar is not displayed');
            expect(await slmProgressBar.isSVTToolTipTextDisplayed()).toBeTruthy("SVT ToolTip Text is not displayed.");
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('SVT from Protractor');
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('Status : Missed Goal');
            expect(await slmProgressBar.getServiceTargetToolTipText()).toContain('due on');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
        });
    });
});
