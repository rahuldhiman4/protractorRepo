import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import { default as serviceTargetBladePo, default as serviceTargetConfig } from '../../pageobject/settings/slm/service-target-blade.po';
import SlmExpressionBuilder from '../../pageobject/settings/slm/slm-expressionbuilder.pop.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilGrid from '../../utils/util.grid';
import utilityCommon from '../../utils/utility.common';
import createCasePo from '../../pageobject/case/create-case.po';
import serviceTargetInfoPage from '../../pageobject/slm/service-target-info.po';
import slmProgressBar from '../../pageobject/slm/slm-progressbar.po';
import caseConsolePo from '../../pageobject/case/case-console.po';
import previewCasePo from '../../pageobject/case/case-preview.po';
import viewCasePo, { default as viewCasePage } from '../../pageobject/case/view-case.po';
import changeAssignmentPage from '../../pageobject/common/change-assignment-blade.po';
import utilityGrid from '../../utils/utility.grid';
import editCasePo from '../../pageobject/case/edit-case.po';
import serviceTargetConsole from '../../pageobject/settings/slm/service-target-viewconsole.po';
import createConfigureDataSourceConfigPo from '../../pageobject/settings/slm/create-configure-data-source-config.po';
import approvalConfigurationPage from "../../pageobject/settings/approval/approval-configuration.po";
import configureDataSourceConsolePage from '../../pageobject/settings/slm/configure-data-source-config-console.po';
import milestoneConfig from '../../pageobject/settings/slm/slm-milestone.pop.po';
import activityTabPo from '../../pageobject/social/activity-tab.po';
import manageTaskBladePo from '../../pageobject/task/manage-task-blade.po';
import viewTaskPo from '../../pageobject/task/view-task.po';

let caseBAUser = 'qkatawazi';

describe('Service Target Configs', () => {
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
    describe('[DRDMV-2361]: SLM - Service Target - Save and Close buttons', async () => {
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteServiceTargets();
        });
        it('[DRDMV-2361]: Verify SVT when no data is entered', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            await serviceTargetConfig.clickCreateSVTButton();
            expect(await serviceTargetConfig.isSaveButtonEnabled()).toBeFalsy('Save SVT button is enabled when no mandatory fields are left empty.');
            expect(await serviceTargetConfig.isCloseButtonEnabled()).toBeTruthy('Close SVT button is disabled when no mandatory fields are left empty.');
            await serviceTargetConfig.clickCloseButton();
            expect(await serviceTargetConfig.isServiceTargetBladeDisplayed()).toBeTruthy('Service Target Blade is displayed.');
            await utilCommon.clickOnWarningOk();
            expect(await serviceTargetConfig.isServiceTargetBladeDisplayed()).toBeFalsy('Service Target Blade is displayed.');
        });
        it('[DRDMV-2361]: Verify SVT warning appears when optional fields entered', async () => {
            await serviceTargetConfig.clickCreateSVTButton();
            await serviceTargetConfig.selectGoalType('Case Response Time');
            await serviceTargetConfig.enterSVTDescription('Case for SVT Desc');
            expect(await serviceTargetConfig.isSaveButtonEnabled()).toBeFalsy('Save SVT button is enabled when no mandatory fields are left empty.');
            expect(await serviceTargetConfig.isCloseButtonEnabled()).toBeTruthy('Close SVT button is disabled when no mandatory fields are left empty.');
            await serviceTargetConfig.clickCloseButton();
            expect(await utilCommon.isWarningDialogBoxDisplayed()).toBeTruthy('Warning Dialog Box is not displayed.');
            expect(await utilCommon.getWarningDialogTitle()).toBe('Warning!');
            expect(await utilCommon.getWarningDialogMsg()).toBe('You have unsaved data. Do you want to continue?');
            await utilCommon.clickOnWarningOk();
            expect(await serviceTargetConfig.isServiceTargetBladeDisplayed()).toBeFalsy('Service Target Blade is displayed.');
        });
        it('[DRDMV-2361]: Verify SVT warning when optional fields entered', async () => {
            await serviceTargetConfig.clickCreateSVTButton();
            await serviceTargetConfig.selectGoalType('Case Response Time');
            await serviceTargetConfig.enterSVTDescription('Case for SVT Desc');
            expect(await serviceTargetConfig.isSaveButtonEnabled()).toBeFalsy('Save SVT button is enabled when no mandatory fields are left empty.');
            expect(await serviceTargetConfig.isCloseButtonEnabled()).toBeTruthy('Close SVT button is disabled when no mandatory fields are left empty.');
            await serviceTargetConfig.clickCloseButton();
            expect(await utilCommon.isWarningDialogBoxDisplayed()).toBeTruthy('Warning Dialog Box is not displayed.');
            await utilCommon.clickOnWarningCancel();
            expect(await serviceTargetConfig.isServiceTargetBladeDisplayed()).toBeTruthy('Service Target Blade is not displayed.');
            expect(await serviceTargetConfig.getGoalTypeSelectedValue('Case Response Time')).toBeTruthy('Goal Type field value is not matched.');
            await serviceTargetConfig.clickCloseButton();
            await utilCommon.clickOnWarningOk();
        });
        it('[DRDMV-2361]: Verify SVT with mandatory fields options', async () => {
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');
            await SlmExpressionBuilder.selectExpressionQualification('Priority', '=', 'SELECTION', 'High');
            await SlmExpressionBuilder.clickOnAddExpressionButton('SELECTION');
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("2");
            await serviceTargetConfig.selectMeasurement();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();
        });
        it('[DRDMV-2361]: Verify Edit SVT with no updates', async () => {
            await utilGrid.searchAndOpenHyperlink('SVT from Protractor');
            expect(await serviceTargetConfig.isServiceTargetBladeDisplayed()).toBeTruthy('Service Target Blade is displayed.');
            expect(await serviceTargetConfig.isSaveButtonEnabled()).toBeFalsy('Save SVT button is enabled when no mandatory fields are left empty.');
            expect(await serviceTargetConfig.isCloseButtonEnabled()).toBeTruthy('Close SVT button is disabled when no mandatory fields are left empty.');
            await serviceTargetConfig.clickCloseButton();
            expect(await serviceTargetConfig.isServiceTargetBladeDisplayed()).toBeFalsy('Service Target Blade is displayed.');
        });
        it('[DRDMV-2361]: Verify Edit SVT warning appears with optionals fields updated', async () => {
            await utilGrid.searchAndOpenHyperlink('SVT from Protractor');
            await serviceTargetConfig.enterSVTDescription('Case for Test SVT Desc');
            expect(await serviceTargetConfig.isSaveButtonEnabled()).toBeTruthy('Save SVT button is enabled when no mandatory fields are left empty.');
            expect(await serviceTargetConfig.isCloseButtonEnabled()).toBeTruthy('Close SVT button is disabled when no mandatory fields are left empty.');
            await serviceTargetConfig.clickCloseButton();
            expect(await utilCommon.isWarningDialogBoxDisplayed()).toBeTruthy('Warning Dialog Box is not displayed.');
            expect(await utilCommon.getWarningDialogTitle()).toBe('Warning!');
            expect(await utilCommon.getWarningDialogMsg()).toBe('You have unsaved data. Do you want to continue?');
            await utilCommon.clickOnWarningOk();
            expect(await serviceTargetConfig.isServiceTargetBladeDisplayed()).toBeFalsy('Service Target Blade is displayed.');
        });
        it('[DRDMV-2361]: Verify Edit SVT warning when fields updated', async () => {
            await utilGrid.searchAndOpenHyperlink('SVT from Protractor');
            await serviceTargetConfig.enterSVTDescription('Case for Test SVT Desc');
            expect(await serviceTargetConfig.isSaveButtonEnabled()).toBeTruthy('Save SVT button is enabled when no mandatory fields are left empty.');
            expect(await serviceTargetConfig.isCloseButtonEnabled()).toBeTruthy('Close SVT button is disabled when no mandatory fields are left empty.');
            expect(await serviceTargetConfig.isSaveButtonEnabled()).toBeTruthy('Save SVT button is enabled when no mandatory fields are left empty.');
            expect(await serviceTargetConfig.isCloseButtonEnabled()).toBeTruthy('Close SVT button is disabled when no mandatory fields are left empty.');
            await serviceTargetConfig.clickCloseButton();
            expect(await utilCommon.isWarningDialogBoxDisplayed()).toBeTruthy('Warning Dialog Box is not displayed.');
            await utilCommon.clickOnWarningCancel();
            expect(await serviceTargetConfig.isServiceTargetBladeDisplayed()).toBeTruthy('Service Target Blade is not displayed.');
            await serviceTargetConfig.clickCloseButton();
            await utilCommon.clickOnWarningOk();
        });
    });

    //skhobrag
    describe('[DRDMV-2360]: SLM - Service Target - Create/Edit with min/max information', async () => {
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteServiceTargets();
        });
        it('[DRDMV-2360]: Create SVT with mandatory fields', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            await serviceTargetConfig.createServiceTargetConfig('SVT with mandatory fields', 'Petramco', 'Case Management');
            await SlmExpressionBuilder.selectExpressionQualification('Priority', '=', 'SELECTION', 'High');
            await SlmExpressionBuilder.clickOnAddExpressionButton('SELECTION');
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("2");
            await serviceTargetConfig.selectMeasurement();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.clickOnSaveSVTButton();
            expect(await utilCommon.isPopUpMessagePresent('Record has been registered successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
        });
        it('[DRDMV-2360]: Create SVT with All Fields', async () => {
            await serviceTargetConfig.createServiceTargetConfig('SVT with all fields', 'Petramco', 'Case Management');
            await SlmExpressionBuilder.selectExpressionQualification('Priority', '=', 'SELECTION', 'High');
            await SlmExpressionBuilder.clickOnAddExpressionButton('SELECTION');
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoalType('Case Response Time');
            await serviceTargetConfig.enterSVTDescription('SVT with all fields Desc');
            await serviceTargetConfig.selectGoal("2");
            await serviceTargetConfig.selectMeasurement();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();
            expect(await utilCommon.isPopUpMessagePresent('Record has been registered successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
        });
        it('[DRDMV-2360]:Verify SVT updation', async () => {
            await utilGrid.searchAndOpenHyperlink('SVT with mandatory fields');
            // await browser.sleep(1000);
            await serviceTargetConfig.enterSVTDescription('Case for Test SVT Desc');
            await serviceTargetConfig.clickOnSaveSVTButton();
            expect(await utilCommon.isPopUpMessagePresent('Record has been updated successfully')).toBeTruthy('Record saved successfully confirmation message not displayed.');
            await utilGrid.searchAndOpenHyperlink('SVT with all fields');
            // await browser.sleep(1000);
            await serviceTargetConfig.clearSVTDescription();
            await serviceTargetConfig.clickOnSaveSVTButton();
            expect(await utilCommon.isPopUpMessagePresent('Record has been updated successfully')).toBeTruthy('Record saved successfully confirmation message not displayed.');
        });
    });

    //skhobrag
    describe('[DRDMV-5038]: "Terms and Condition" qualification is added on Service Target - Create View', async () => {
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteServiceTargets();
        });
        it('[DRDMV-5038]: Verify "Terms and Condition" qualification on Service Target - Create View', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            await serviceTargetConfig.clickCreateSVTButton();
            expect(await serviceTargetBladePo.isTermsAndConditionsFieldMandatory()).toBeTruthy('Terms and Conditions field is optional.');
            await serviceTargetConfig.enterSVTTitle('SVT from Protractor');
            await serviceTargetConfig.selectCompany('Petramco');
            await serviceTargetConfig.selectDataSource('Case Management');
            await serviceTargetConfig.selectGoal("2");
        });
        it('[DRDMV-5038]: Verify "Terms and Condition" qualification on Service Target - Create View', async () => {
            await serviceTargetConfig.selectMeasurement();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Resolved");
            expect(await serviceTargetConfig.isSaveButtonEnabled()).toBeFalsy('Save button is enabled when mandatory fields are left empty.');
            await serviceTargetConfig.clickBuildExpressionLink();
            await SlmExpressionBuilder.selectExpressionQualification('Priority', '=', 'SELECTION', 'High');
            await SlmExpressionBuilder.clickOnAddExpressionButton('SELECTION');
            let selectedExp: string = await SlmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Priority" + "'" + "=" + '"' + "High" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
        });
    });

    //skhobrag
    describe('[DRDMV-5039,DRDMV-17015]: "Terms and Condition" qualification is added on Service Target - Edit View', async () => {
        let selectedExp: string = '';
        let expectedSelectedExp = '';
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteServiceTargets();
        });
        it('[DRDMV-5039,DRDMV-17015]: Verify SVT Creation', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Global', 'Case Management');
            await SlmExpressionBuilder.selectExpressionQualification('Priority', '=', 'SELECTION', 'High');
            await SlmExpressionBuilder.clickOnAddExpressionButton('SELECTION');
            selectedExp = await SlmExpressionBuilder.getSelectedExpression();
            expectedSelectedExp = "'" + "Priority" + "'" + "=" + '"' + "High" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("2");
            await serviceTargetConfig.selectMeasurement();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.clickOnSaveSVTButton();
        });
        it('[DRDMV-5039,DRDMV-17015]: Verify "Terms and Condition" qualification on Service Target - Edit View', async () => {
            await utilGrid.searchAndOpenHyperlink('SVT from Protractor');
            expect(await serviceTargetConfig.isServiceTargetBladeDisplayed()).toBeTruthy('Edit Service Target Configuration blade is not displayed.');
            expect(await serviceTargetConfig.isSaveButtonEnabled()).toBeFalsy('Save button is enabled when mandatory fields are left empty. 1');
            expect(await serviceTargetBladePo.isTermsAndConditionsFieldMandatory()).toBeTruthy('Terms and Conditions field is optional.');
            await serviceTargetConfig.clickBuildExpressionLink();
            await SlmExpressionBuilder.clearSelectedExpression();
            await browser.sleep(1000);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await browser.sleep(1000);
            expect(await serviceTargetConfig.isSaveButtonEnabled()).toBeTruthy('Save button is enabled when mandatory fields are left empty. 2');
            await serviceTargetConfig.clickBuildExpressionLink();
            await SlmExpressionBuilder.clearSelectedExpression();
            await SlmExpressionBuilder.selectFirstLevelExpressionQualification('Requester', '=', 'PERSON', 'Qiang Du');
            await SlmExpressionBuilder.clickOnAddExpressionButton('PERSON');
            selectedExp = await SlmExpressionBuilder.getSelectedExpression();
            expectedSelectedExp = "'" + "Requester" + "'" + "=" + '"' + "Qiang Du" + '"'
            await expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.clickOnSaveSVTButton();
        });
    });

    //skhobrag
    describe('[DRDMV-2363]: SLM - Service Target - Measurement Build Expression', async () => {
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteServiceTargets();
        });
        it('[DRDMV-2363]: Create SVT', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            await serviceTargetConfig.createServiceTargetConfig('SVT with all fields', 'Petramco', 'Case Management');
            await SlmExpressionBuilder.selectExpressionQualification('Priority', '=', 'SELECTION', 'High');
            await SlmExpressionBuilder.clickOnAddExpressionButton('SELECTION');
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoalType('Case Response Time');
            await serviceTargetConfig.enterSVTDescription('SVT with all fields Desc');
            await serviceTargetConfig.selectGoal("2");
            await serviceTargetConfig.selectMeasurement();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();
            expect(await utilCommon.isPopUpMessagePresent('Record has been registered successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
        });
        it('[DRDMV-2363]: Verify SVT Updation', async () => {
            await utilGrid.searchAndOpenHyperlink('SVT with all fields');
            await browser.sleep(1000);
            await serviceTargetConfig.selectMeasurement();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "New");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "In Progress");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();
            expect(await utilCommon.isPopUpMessagePresent('Record has been updated successfully')).toBeTruthy('Record saved successfully confirmation message not displayed.');
        });
    });

    //skhobrag
    describe('[DRDMV-21723]: SLAs attached even though current user loose access to the current record', async () => {
        let caseId = undefined;
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteServiceTargets();
        });
        it('[DRDMV-21723]:Create a SVT', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Global', 'Case Management');
            await SlmExpressionBuilder.selectExpressionQualification('Category Tier 1', '=', 'NAMED_LIST', 'Applications');
            await SlmExpressionBuilder.clickOnAddExpressionButton('NAMED_LIST');
            let selectedExp: string = await SlmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Category Tier 1" + "'" + "=" + '"' + "Applications" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("6");
            await serviceTargetConfig.selectMeasurement();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.clickOnSaveSVTButton();
            browser.sleep(1000);
        });
        it('[DRDMV-21723]:Create a case', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('Mary');
            await createCasePo.setSummary('Case for SVT creation');
            await createCasePo.selectCategoryTier1('Applications');
            await createCasePo.clickAssignToMeButton();
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            caseId = await viewCasePage.getCaseID();
        });
        it('[DRDMV-21723]:Verify SVT attached to a Case', async () => {
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
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickChangeAssignmentButton();
            await changeAssignmentPage.selectBusinessUnit('United States Support');
            await changeAssignmentPage.selectSupportGroup('US Support 3');
            await changeAssignmentPage.selectAssignee('Qiao Feng');
            await changeAssignmentPage.clickOnAssignButton();
            await editCasePo.clickSaveCase();
            expect(await slmProgressBar.isSLAProgressBarInProcessIconDisplayed()).toBe(true); //green
        });
        it('[DRDMV-21723]:Verify if SVT is still attached to a case when case assignment is changed', async () => {
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await slmProgressBar.isSLAProgressBarInProcessIconDisplayed()).toBe(true); //green
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
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        });

    });

    //skhobrag
    describe('[DRDMV-2357]: SLM - Service Target - Error Messages', async () => {
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteServiceTargets();
        });
        it('[DRDMV-2357]:Verify Goal Time selection Valiation on Service Target', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Global', 'Case Management');
            await SlmExpressionBuilder.selectExpressionQualification('Category Tier 1', '=', 'NAMED_LIST', 'Applications');
            await SlmExpressionBuilder.clickOnAddExpressionButton('NAMED_LIST');
            let selectedExp: string = await SlmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Category Tier 1" + "'" + "=" + '"' + "Applications" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("60");
            expect(await utilCommon.isPopUpMessagePresent('Minutes can have max value of 59')).toBeTruthy('Error : Record definition does not exists error message is not displayed.');
            await serviceTargetConfig.selectGoal("366", "Days");
            expect(await utilCommon.isPopUpMessagePresent('Days can have max value of 365')).toBeTruthy('Error : Record definition does not exists error message is not displayed.');
            await serviceTargetConfig.selectGoal("24", "Hours");
            expect(await utilCommon.isPopUpMessagePresent('Hours can have max value of 23')).toBeTruthy('Error : Record definition does not exists error message is not displayed.');
            await serviceTargetConfig.selectGoal("-1");
            expect(await utilCommon.isPopUpMessagePresent('Minutes can have min value of 0')).toBeTruthy('Error : Record definition does not exists error message is not displayed.');
            await serviceTargetConfig.selectGoal("-1", "Hours");
            expect(await utilCommon.isPopUpMessagePresent('Hours can have min value of 0')).toBeTruthy('Error : Record definition does not exists error message is not displayed.');
            await serviceTargetConfig.selectGoal("-1", "Days");
            expect(await utilCommon.isPopUpMessagePresent('Days can have min value of 0')).toBeTruthy('Error : Record definition does not exists error message is not displayed.');
            await serviceTargetConfig.clickCloseButton();
            expect(await utilCommon.getWarningDialogMsg()).toBe('You have unsaved data. Do you want to continue?');
            await utilCommon.clickOnWarningOk();
        });

        it('[DRDMV-2357]: Verify SVT warning when data source is modified', async () => {
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Global', 'Case Management');
            await SlmExpressionBuilder.selectExpressionQualification('Category Tier 1', '=', 'NAMED_LIST', 'Applications');
            await SlmExpressionBuilder.clickOnAddExpressionButton('NAMED_LIST');
            let selectedExp: string = await SlmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Category Tier 1" + "'" + "=" + '"' + "Applications" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await browser.sleep(2000); // added hard wait to load Edit Data Source Blade
            await serviceTargetConfig.selectDataSource('Task Management');
            let expectedWarningMsg = `You are about to change the Data source for this service target. All parameters including 'Milestones', 'Measurements', 'Goal', and 'Measurement Criteria' will be switched to default values.Are you sure you want to continue ?`;
            expect(await utilCommon.getWarningDialogMsg()).toBe(expectedWarningMsg);
            await utilCommon.clickOnWarningOk();
        });

        afterAll(async () => {
            await utilityCommon.closeAllBlades();
        });

    });

    //skhobrag
    describe('[DRDMV-2362]: SLM - Service Target - Console', async () => {
        let caseSVTData, taskSVTData, serviceTargetGUID, serviceTargetID;
        let serviceTargetColumns: string[] = ["GUID"];
        let svtName = "Case for SVT creation";
        let svtDataSource = "Case Management";

        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteServiceTargets();
        });

        it('[DRDMV-2362]: Verify Service Target for Case Creation', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            await serviceTargetConfig.createServiceTargetConfig(svtName, 'Petramco', svtDataSource);
            await SlmExpressionBuilder.selectExpressionQualification('Priority', '=', 'SELECTION', 'High');
            await SlmExpressionBuilder.clickOnAddExpressionButton('SELECTION');
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoalType('Case Resolution Time');
            await serviceTargetConfig.enterSVTDescription('SVT with all fields Desc');
            await serviceTargetConfig.selectGoal("2");
            await serviceTargetConfig.selectMeasurement();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();
            expect(await utilCommon.isPopUpMessagePresent('Record has been registered successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
        });

        it('[DRDMV-2362]: Verify Service Target for Task Creation', async () => {
            await serviceTargetConfig.createServiceTargetConfig('task svt', 'Petramco', 'Task Management');
            await SlmExpressionBuilder.selectExpressionQualification('Task Type', '=', 'SELECTION', 'Automated');
            await SlmExpressionBuilder.clickOnAddExpressionButton('SELECTION');
            await SlmExpressionBuilder.clickOnSaveExpressionButtonForTask();
            await serviceTargetConfig.selectGoalType('Task Resolution Time');
            await serviceTargetConfig.selectStatus('Disabled');
            await serviceTargetConfig.selectGoal("2");
            await serviceTargetConfig.selectMeasurement();
            await serviceTargetConfig.selectExpressionForMeasurementForTask(0, "status", "=", "STATUS", "Staged");
            await serviceTargetConfig.selectExpressionForMeasurementForTask(1, "status", "=", "STATUS", "Completed");
            await serviceTargetConfig.selectExpressionForMeasurementForTask(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();
        });

        it('[DRDMV-2362]: Verify Service Target Console Fields Sort Order', async () => {
            await serviceTargetConsole.addColumns(serviceTargetColumns);
            await serviceTargetConsole.searchOnGridConsole(svtName);
            serviceTargetGUID = await serviceTargetConsole.getServiceTargetGUID();
            serviceTargetID = await serviceTargetConsole.getServiceTargetID();
            await utilGrid.clearFilter();
            await utilGrid.clearGridSearchBox();
            expect(await serviceTargetConsole.isGridColumnSorted('Service Target Title', 'asc')).toBeTruthy('Goal Type Name Column is not sorted in ascending order');
            expect(await serviceTargetConsole.isGridColumnSorted('Service Target Title', 'desc')).toBeTruthy('Goal Type Name Column is not sorted in descending order');
            await serviceTargetConsole.clickRefreshIcon();
            expect(await serviceTargetConsole.isGridColumnSorted('Data source', 'asc')).toBeTruthy('Status Column is not sorted in ascending order');
            expect(await serviceTargetConsole.isGridColumnSorted('Data source', 'desc')).toBeTruthy('Status Column is not sorted in descending order');
            await serviceTargetConsole.clickRefreshIcon();
            expect(await serviceTargetConsole.isGridColumnSorted('Service Target ID', 'asc')).toBeTruthy('Goal Type Column is not sorted in ascending order');
            expect(await serviceTargetConsole.isGridColumnSorted('Service Target ID', 'desc')).toBeTruthy('Goal Type Column is not sorted in descending order');
            await serviceTargetConsole.clickRefreshIcon();
            expect(await serviceTargetConsole.isGridColumnSorted('Goal Type', 'asc')).toBeTruthy('Status Column is not sorted in ascending order');
            expect(await serviceTargetConsole.isGridColumnSorted('Goal Type', 'desc')).toBeTruthy('Status Column is not sorted in descending order');
            await serviceTargetConsole.clickRefreshIcon();
            expect(await serviceTargetConsole.isGridColumnSorted('GUID', 'asc')).toBeTruthy('Status Column is not sorted in ascending order');
            expect(await serviceTargetConsole.isGridColumnSorted('GUID', 'desc')).toBeTruthy('Status Column is not sorted in descending order');
            await serviceTargetConsole.clickRefreshIcon();

            expect(await serviceTargetConsole.isGridRecordDisplayed(svtName)).toBeTruthy('Service Target Name record is not searched.');

            await serviceTargetConsole.clickRefreshIcon();
            expect(await serviceTargetConsole.isGridRecordDisplayed(svtDataSource)).toBeTruthy('Service Target Data Source record is not searched.');

            await serviceTargetConsole.clickRefreshIcon();
            expect(await serviceTargetConsole.isGridRecordDisplayed('Case Resolution Time')).toBeTruthy('SVT Goal Type record is not searched.');

            await serviceTargetConsole.clickRefreshIcon();
            expect(await serviceTargetConsole.isGridRecordDisplayed(serviceTargetID)).toBeTruthy('Service Target ID record is not searched.');

            await serviceTargetConsole.clickRefreshIcon();
            expect(await serviceTargetConsole.isGridRecordDisplayed(serviceTargetGUID)).toBeTruthy('Service Target ID record is not searched.');
        });

        it('[DRDMV-2362]: Verify Service Target Console Fields Search functionality', async () => {
            await utilGrid.clearGridSearchBox();
            await serviceTargetConsole.clickRefreshIcon();
            await utilGrid.addFilter('Service Target Title', svtName, 'text');
            expect(await serviceTargetConsole.isFilteredRecordDisplayed()).toBeTruthy('Service Target Title record is not searched.');

            await serviceTargetConsole.clearFilter();
            await serviceTargetConsole.clickRefreshIcon();
            await utilGrid.addFilter('Service Target ID', serviceTargetID, 'text');
            expect(await serviceTargetConsole.isFilteredRecordDisplayed()).toBeTruthy('Service Target ID record is not searched.');

            await serviceTargetConsole.clearFilter();
            await serviceTargetConsole.clickRefreshIcon();
            await utilGrid.addFilter('GUID', serviceTargetGUID, 'text');
            expect(await serviceTargetConsole.isFilteredRecordDisplayed()).toBeTruthy('Service Target GUID record is not searched.');

            await serviceTargetConsole.clearFilter();
            await serviceTargetConsole.clickRefreshIcon();
            await utilGrid.addFilter('Data source', svtDataSource, 'text');
            expect(await serviceTargetConsole.isFilteredRecordDisplayed()).toBeTruthy('Service Target Data Source record is not searched.');

            await serviceTargetConsole.clearFilter();
            await serviceTargetConsole.clickRefreshIcon();
            await utilGrid.addFilter('Goal Type', 'Case Resolution Time', 'text');
            expect(await serviceTargetConsole.isFilteredRecordDisplayed()).toBeTruthy('Service Target Data Source record is not searched.');

            await serviceTargetConsole.clearFilter();
            await serviceTargetConsole.clickRefreshIcon();
            await utilGrid.addFilter('Status', 'Enabled', 'checkbox');
            expect(await serviceTargetConsole.isFilteredRecordDisplayed()).toBeTruthy('Service Target Status record is not searched.');
            await serviceTargetConsole.clearFilter();
        });
    });

    //skhobrag
    describe('[DRDMV-2358,DRDMV-1376,DRDMV-1378,DRDMV-1387]: SLM - Service Target - Field Dependency (UI validations)', async () => {
        let dataSourceDisplayName = 'Case Data Source_Test';

        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteServiceTargets();
        });

        it('[DRDMV-2358,DRDMV-1376,DRDMV-1378,DRDMV-1387]: Create Data Source with All Fields', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Configure Data Source', 'Configure Data Source - Administration - Business Workflows');
            await configureDataSourceConsolePage.clickConfigDataSourceBtn();
            // await browser.sleep(2000);  // added hard wait to load Add Data Source Blade
            await createConfigureDataSourceConfigPo.setDataSourceDisplayName(dataSourceDisplayName);
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Application Name', 'Case Management Service');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Record Definition Name', 'com.bmc.dsm.case-lib:Case Detail');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Company Field', 'ASSIGNED COMPANY_ID Primary');
            expect(await createConfigureDataSourceConfigPo.isSaveBtnDisabled()).toBeFalsy('Save button is found disabled.');
            await createConfigureDataSourceConfigPo.clickDataSourceLink('Show Advanced Settings');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Association Name', 'com.bmc.dsm.case-lib:Case Approval Mapping Field - Company');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Create Qualification View', 'com.bmc.dsm.case-lib:Case Qualification Builder');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Edit Qualification View', 'com.bmc.dsm.case-lib:Case Qualification Builder');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Assigned Group', 'Assigned Group Primary');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Dynamic Business Entity', 'Assigned Business Unit Primary');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Dynamic Start Time Field', 'Created Date Primary');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Dynamic Goal Time Field', 'Assignee Primary');
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Category Field', 'Category Tier 1 Primary');
            await createConfigureDataSourceConfigPo.clickUseEndTimeCheckbox();
            await createConfigureDataSourceConfigPo.selectDataSourceFieldOption('Dynamic End Time Field', 'Created By Primary');
            await createConfigureDataSourceConfigPo.clickDataSourceLink('Build Expression');
            expect(await approvalConfigurationPage.isCreateNewApprovalFlowPopUpDisplayed()).toBeTruthy();
            expect(await approvalConfigurationPage.getCreateNewApprovalFlowPopUpTitle()).toContain('Create Expression');
            await browser.sleep(3000); // sleep added for expression builder loading time
            await approvalConfigurationPage.searchExpressionFieldOption('Assignee GUID Primary');
            await approvalConfigurationPage.clickRecordOption('Record Instance');
            await browser.sleep(2000); // sleep added for expression builder loading time
            await approvalConfigurationPage.selectExpressionFieldOption();
            await browser.sleep(2000); // sleep added for expression builder loading time
            await approvalConfigurationPage.selectExpressionOperator('=');
            await browser.sleep(1000); // sleep added for expression builder loading time
            await approvalConfigurationPage.setExpressionValueForParameter('"' + "Petramco" + '"');
            await createConfigureDataSourceConfigPo.clickRegularExpressionSaveButton();
            await createConfigureDataSourceConfigPo.clickSaveButton();
            expect(await utilCommon.isPopUpMessagePresent('Record has been registered successfully.')).toBeTruthy('Record saved successfully confirmation message is not displayed.');
        });

        it('[DRDMV-2358,DRDMV-1376,DRDMV-1378,DRDMV-1387]: Create SVT and check whether goal type and measurement details are disabled', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            await serviceTargetConfig.createServiceTargetConfig('SVT with mandatory fields', 'Petramco', 'Case Management');
            await SlmExpressionBuilder.selectExpressionQualification('Priority', '=', 'SELECTION', 'High');
            await SlmExpressionBuilder.clickOnAddExpressionButton('SELECTION');
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("2");
            expect(await serviceTargetConfig.isGoalCheckboxDisabled('Goal Time')).toBeTruthy('Goal Time field is enabled.');
            expect(await serviceTargetConfig.isGoalCheckboxDisabled('Business Entity')).toBeTruthy('Business Entity field is enabled.');
            expect(await serviceTargetConfig.isGoalCheckboxDisabled('Start Time')).toBeTruthy('Start Time field is enabled.');
            await serviceTargetConfig.selectMeasurement();
            expect(await serviceTargetConfig.isMeasurementCheckboxDisabled('Reset Goal for Same Request?')).toBeTruthy('Reset Goal for Same Request? field is enabled.');
            expect(await serviceTargetConfig.isMeasurementCheckboxDisabled('Allow Measurement to Re-Open?')).toBeTruthy('Allow Measurement to Re-Open? field is enabled.');
            expect(await serviceTargetConfig.isMeasurementCheckboxDisabled('Enable Team Tracking')).toBeTruthy('Enable Team Tracking field is enabled.');
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.clickCloseButton();
            expect(await utilCommon.isWarningDialogBoxDisplayed()).toBeTruthy('Warning Dialog Box is not displayed.');
            expect(await utilCommon.getWarningDialogTitle()).toBe('Warning!');
            expect(await utilCommon.getWarningDialogMsg()).toBe('You have unsaved data. Do you want to continue?');
            await utilCommon.clickOnWarningOk();
        });

        it('[DRDMV-2358,DRDMV-1376,DRDMV-1378,DRDMV-1387]: Verify the SVT details', async () => {
            await serviceTargetConfig.createServiceTargetConfig('SVT with mandatory fields', 'Petramco', dataSourceDisplayName);
            await SlmExpressionBuilder.selectExpressionQualification('Priority', '=', 'SELECTION', 'High');
            await SlmExpressionBuilder.clickOnAddExpressionButton('SELECTION');
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("2");
            expect(await serviceTargetConfig.isGoalCheckboxDisabled('Goal Time')).toBeFalsy('Goal Time field is disabled.');
            expect(await serviceTargetConfig.isGoalCheckboxDisabled('Business Entity')).toBeFalsy('Business Entity field is disabled.');
            expect(await serviceTargetConfig.isGoalCheckboxDisabled('Start Time')).toBeFalsy('Start Time field is disabled.');
            await serviceTargetConfig.selectGoalTypeCheckbox('Goal Time');

            await serviceTargetConfig.selectGoalTypeCheckbox('Business Entity');
            await serviceTargetConfig.selectGoalTypeCheckbox('Start Time');
            expect(await serviceTargetConfig.isBusinessEntityDisabled()).toBeTruthy('Business Entity field is disabled.');
            await serviceTargetConfig.selectMeasurement();
            expect(await serviceTargetConfig.isMeasurementCheckboxDisabled('Reset Goal for Same Request?')).toBeFalsy('Reset Goal for Same Request? field is disabled.');
            expect(await serviceTargetConfig.isMeasurementCheckboxDisabled('Allow Measurement to Re-Open?')).toBeFalsy('Allow Measurement to Re-Open? field is disabled.');
            expect(await serviceTargetConfig.isMeasurementCheckboxDisabled('Enable Team Tracking')).toBeFalsy('Enable Team Tracking field is disabled.');
            await serviceTargetConfig.selectMeasurementCheckbox('Reset Goal for Same Request?');
            await serviceTargetConfig.selectMeasurementCheckbox('Allow Measurement to Re-Open?');
            await serviceTargetConfig.selectMeasurementCheckbox('Enable Team Tracking');
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.clickOnSaveSVTButton();
            expect(await utilCommon.isPopUpMessagePresent('Record has been registered successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
            await serviceTargetConsole.searchServiceTarget("SVT with mandatory fields");
            await serviceTargetConfig.selectGoalTypeCheckbox('Business Entity');
            await serviceTargetConfig.selectGoalTypeCheckbox('Start Time');
            expect(await serviceTargetConfig.isGoalCheckboxDisabled('Goal Time')).toBeFalsy('Goal Time field is disabled.');
            expect(await serviceTargetConfig.isGoalCheckboxDisabled('Business Entity')).toBeFalsy('Business Entity field is disabled.');
            expect(await serviceTargetConfig.isGoalCheckboxDisabled('Start Time')).toBeFalsy('Start Time field is disabled.');
            expect(await serviceTargetConfig.isBusinessEntityDisabled()).toBeFalsy('Business Entity field is disabled.');
            expect(await serviceTargetConfig.isGoalTypeCountersDisabled('Days')).toBeTruthy('Days field is disabled.');
            expect(await serviceTargetConfig.isGoalTypeCountersDisabled('Hours')).toBeTruthy('Hours field is disabled.');
            expect(await serviceTargetConfig.isGoalTypeCountersDisabled('Minutes')).toBeTruthy('Minutes field is disabled.');
            await serviceTargetConfig.selectGoalTypeCheckbox('Goal Time');
            expect(await serviceTargetConfig.isGoalCheckboxDisabled('Goal Time')).toBeFalsy('Goal Time field is enabled.');
            await serviceTargetConfig.selectGoalTypeCheckbox('Goal Time');
            await serviceTargetConfig.selectMeasurement();
            expect(await serviceTargetConfig.isMeasurementCheckboxDisabled('Reset Goal for Same Request?')).toBeFalsy('Reset Goal for Same Request? field is disabled.');
            expect(await serviceTargetConfig.isMeasurementCheckboxDisabled('Allow Measurement to Re-Open?')).toBeFalsy('Allow Measurement to Re-Open? field is disabled.');
            expect(await serviceTargetConfig.isMeasurementCheckboxDisabled('Enable Team Tracking')).toBeFalsy('Enable Team Tracking field is disabled.');
            await serviceTargetConfig.clickCloseButton();
        });
    });

    //skhobrag
    describe('[DRDMV-6168]: UI Validation for Qualification Builder with Single company.', async () => {
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteServiceTargets();
        });
        it('[DRDMV-6168]: Verify SVT UI Fields', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            await serviceTargetConfig.createServiceTargetConfig('SVT with mandatory fields', 'Petramco', 'Case Management');
            expect(await serviceTargetConfig.isSaveButtonEnabled()).toBeFalsy('Save SVT button is enabled when no mandatory fields are left empty.');
            expect(await serviceTargetConfig.isCloseButtonEnabled()).toBeTruthy('Close SVT button is disabled when no mandatory fields are left empty.');
            expect(await serviceTargetConfig.isServiceTargetFieldRequired('Title')).toBeTruthy('Title field is marked as optional field');
            expect(await serviceTargetConfig.isServiceTargetFieldRequired('Company')).toBeTruthy('Company field is marked as optional field');
            expect(await serviceTargetConfig.isServiceTargetFieldRequired('Data source')).toBeTruthy('Data Source field is marked as optional field');
            expect(await serviceTargetConfig.isServiceTargetFieldRequired('Status')).toBeTruthy('Status field is marked as optional field');
            expect(await serviceTargetConfig.isServiceTargetFieldRequired('Goal Type')).toBeFalsy('Goal Type field is marked as required field');
            expect(await serviceTargetConfig.isServiceTargetFieldRequired('Effective From')).toBeTruthy('Effective From Field field is marked as optional field');
            expect(await serviceTargetConfig.isServiceTargetFieldRequired('Agreement Type')).toBeFalsy('Agreement Type field is marked as required field');
            expect(await serviceTargetConfig.isServiceTargetFieldRequired('Add to Group')).toBeFalsy('Add to Group Field field is marked as required field');
            expect(await serviceTargetConfig.isServiceTargetFieldRequired('Description')).toBeFalsy('Description Field field is marked as required field');
            expect(await serviceTargetConfig.isServiceTargetFieldRequired('Terms and Condition')).toBeTruthy('Terms and Condition field is marked as optional field');
            expect(await serviceTargetConfig.isServiceTargetFieldRequired('Goal Time')).toBeTruthy('Goal Time field is marked as optional field');
            expect(await serviceTargetConfig.isServiceTargetFieldRequired('Business Entity')).toBeFalsy('Business Entity field is marked as required field');
            expect(await serviceTargetConfig.isServiceTargetFieldRequired('Days')).toBeFalsy('Days field is marked as required field');
            expect(await serviceTargetConfig.isServiceTargetFieldRequired('Hours')).toBeFalsy('Hours field is marked as required field');
            expect(await serviceTargetConfig.isServiceTargetFieldRequired('Minutes')).toBeFalsy('Minutes field is marked as required field');
            expect(await serviceTargetConfig.isServiceTargetFieldRequired('Start Time')).toBeFalsy('Start Time field is marked as required field');
            await SlmExpressionBuilder.selectExpressionQualification('Priority', '=', 'SELECTION', 'High');
            await SlmExpressionBuilder.clickOnAddExpressionButton('SELECTION');
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("2");
            await serviceTargetConfig.selectMeasurement();
            expect(await serviceTargetConfig.isServiceTargetFieldRequired('Description')).toBeFalsy('Description field is marked as required field');
            expect(await serviceTargetConfig.isServiceTargetFieldRequired('Start When')).toBeTruthy('Start When field is marked as optional field');
            expect(await serviceTargetConfig.isServiceTargetFieldRequired('Stop When')).toBeTruthy('Stop When field is marked as optional field');
            expect(await serviceTargetConfig.isServiceTargetFieldRequired('Pause When')).toBeFalsy('Pause When field is marked as required field');
            expect(await serviceTargetConfig.isServiceTargetFieldRequired('Set Warning Status At(% of Goal)')).toBeTruthy('Set Warning Status At(% of Goal) field is marked as optional field');
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.clickOnSaveSVTButton();
            expect(await utilCommon.isPopUpMessagePresent('Record has been registered successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
        });
    });

    //skhobrag
    describe('[DRDMV-6148]: Create SVT for one line of Business with Milestone action', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let updatedCaseSummary = "Updating Case summary from SVT";
        let svttile = "SVT for Case fields" + randomStr;
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteServiceTargets();
        });

        it('[DRDMV-6148]: Verify Processing of Set field Milestone Action for Task SLA', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            await serviceTargetConfig.createServiceTargetConfig(svttile, 'Petramco', 'Case Management');
            await SlmExpressionBuilder.selectExpressionQualification('Priority', '=', 'SELECTION', 'High');
            await SlmExpressionBuilder.clickOnAddExpressionButton('SELECTION');
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoalType('Case Resolution Time');
            await serviceTargetConfig.enterSVTDescription('SVT with all fields Desc' + randomStr);
            await serviceTargetConfig.selectGoal("3");
            await serviceTargetConfig.selectMeasurement();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
        });

        it('[DRDMV-6148]: Add milestone to the service target and verify milestone details', async () => {
            await serviceTargetConfig.selectMilestone();
            await serviceTargetConfig.clickAddNewMileStoneBtn();
            expect(await milestoneConfig.isSLMMileStonePopUpDisplayed()).toBeTruthy("SLM Milestone Pop up window not displayed");
            await milestoneConfig.setMileStoneTitle("SVT Milestone" + randomStr);
            await milestoneConfig.setMileStoneDescription("SVT Milestone Desc" + randomStr);
            await milestoneConfig.setMileStonePercentage("10");
            await milestoneConfig.clickMileStoneExpression();
            await SlmExpressionBuilder.selectSecondLevelExpressionQualification('Requester', 'Email', "=", 'TEXT', "qdu@petramco1.com");
            let selectedExpx = await SlmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Requester > Email" + "'" + "=" + '"' + "qdu@petramco1.com" + '"';
            expect(selectedExpx).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await milestoneConfig.clickMileStoneActionsSegment();
            await milestoneConfig.clickAddNewMileStoneActionBtn();
            await milestoneConfig.selectMileStoneActionCondition("New Set Fields Action");
            expect(await milestoneConfig.isSetMileStoneActionPopUpDisplayed()).toBeTruthy("SLM Milestone Action Pop up window not displayed");
            await milestoneConfig.setMileStoneActionTitle("SVT Action" + randomStr);
            await milestoneConfig.selectMileStoneActionField("Summary");
            await milestoneConfig.setMileStoneActionFieldValue(updatedCaseSummary);
            await milestoneConfig.clickAddMileStoneActionBtn();
            await milestoneConfig.clickSaveMileStoneAction();
            await milestoneConfig.selectMileStoneAction();
            await milestoneConfig.clickSaveMileStone();
            await serviceTargetConfig.clickOnSaveSVTButton();
            expect(await utilCommon.isPopUpMessagePresent('Record has been registered successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
        });

        it('[DRDMV-6148]: Create a case and verify if the case is updated as per the milestone configurations', async () => {
            let caseData = {
                "Requester": "qdu",
                "Summary": "Summary_" + randomStr,
                "Source": "Agent",
                "Priority": "High",
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi",
            }

            await apiHelper.apiLogin('qkatawazi');
            let response = await apiHelper.createCase(caseData);
            let caseId = response.displayId;

            await browser.sleep(40000); // wait added for milestone to trigger and reflect the changes

            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned");
            expect(await slmProgressBar.isSLAProgressBarInProcessIconDisplayed()).toBe(true); //green
            expect(await viewCasePage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)'); //green
            expect(await viewCasePage.getCaseSummary()).toBe(updatedCaseSummary);
            await viewCasePo.clickOnTab('Activity');
            await activityTabPo.clickOnRefreshButton();
            expect(await activityTabPo.isTextPresentInActivityLog(updatedCaseSummary)).toBeTruthy('TemplateText is not available');
            expect(await activityTabPo.isTextPresentInActivityLog("Summary")).toBeTruthy('TemplateText is not available');
        });

        it('[DRDMV-6148]: Create a case wit mismatched qualifications and  verify if the case is updated as per the milestone configurations', async () => {
            let caseData = {
                "Requester": "qtao",
                "Summary": "Summary_" + randomStr,
                "Source": "Agent",
                "Priority": "High",
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi",
            }

            await apiHelper.apiLogin('qkatawazi');
            let response = await apiHelper.createCase(caseData);
            let caseId = response.displayId;

            await browser.sleep(30000); // wait added for milestone to trigger and reflect the changes
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId);
            expect(await viewCasePo.getTextOfStatus()).toBe("Assigned");
            expect(await slmProgressBar.isSLAProgressBarInProcessIconDisplayed()).toBe(true); //green
            expect(await viewCasePage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)'); //green
            expect(await viewCasePage.getCaseSummary()).toBe(caseData.Summary);
        });

    });

    //skhobrag
    describe('[DRDMV-2354]: Verify Processing of Set field Milestone Action for Task SLA', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let updatedTaskSummary = "Updating Task summary from SVT";
        let svttile = "SVT for Task fields" + randomStr;
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteServiceTargets();
        });

        it('[DRDMV-2354]: Verify Processing of Set field Milestone Action for Task SLA', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
            await serviceTargetConfig.createServiceTargetConfig(svttile, 'Petramco', 'Task Management');
            await SlmExpressionBuilder.selectExpressionQualification('Priority', '=', 'SELECTION', 'High');
            await SlmExpressionBuilder.clickOnAddExpressionButton('SELECTION');
            await SlmExpressionBuilder.clickOnSaveExpressionButtonForTask();
            await serviceTargetConfig.selectGoal("2");
            await serviceTargetConfig.selectMeasurement();
            await serviceTargetConfig.selectExpressionForMeasurementForTask(0, "status", "=", "STATUS", "Staged");
            await serviceTargetConfig.selectExpressionForMeasurementForTask(1, "status", "=", "STATUS", "Completed");
            await serviceTargetConfig.selectExpressionForMeasurementForTask(2, "status", "=", "STATUS", "Pending");
        });

        it('[DRDMV-2354]: Add milestone to the service target and verify milestone details', async () => {
            await serviceTargetConfig.selectMilestone();
            await serviceTargetConfig.clickAddNewMileStoneBtn();
            expect(await milestoneConfig.isSLMMileStonePopUpDisplayed()).toBeTruthy("SLM Milestone Pop up window not displayed");
            await milestoneConfig.setMileStoneTitle("SVT Milestone" + randomStr);
            await milestoneConfig.setMileStoneDescription("SVT Milestone Desc" + randomStr);
            await milestoneConfig.setMileStonePercentage("10");
            await milestoneConfig.clickMileStoneExpression();
            await SlmExpressionBuilder.selectExpressionQualification('Task Type', '=', 'SELECTION', 'Manual');
            await SlmExpressionBuilder.clickOnAddExpressionButton('SELECTION');
            let selectedExp: string = await SlmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Task Type" + "'" + "=" + '"' + "Manual" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButtonForTask();
            await milestoneConfig.clickMileStoneActionsSegment();
            await milestoneConfig.clickAddNewMileStoneActionBtn();
            await milestoneConfig.selectMileStoneActionCondition("New Set Fields Action");
            expect(await milestoneConfig.isSetMileStoneActionPopUpDisplayed()).toBeTruthy("SLM Milestone Action Pop up window not displayed");
            await milestoneConfig.setMileStoneActionTitle("SVT Action" + randomStr);
            await milestoneConfig.selectMileStoneActionField("Summary");
            await milestoneConfig.setMileStoneActionFieldValue(updatedTaskSummary);
            await milestoneConfig.clickAddMileStoneActionBtn();
            await milestoneConfig.clickSaveMileStoneAction();
            await milestoneConfig.selectMileStoneAction();
            await milestoneConfig.clickSaveMileStone();
            await serviceTargetConfig.clickOnSaveSVTButton();
            expect(await utilCommon.isPopUpMessagePresent('Record has been registered successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
        });

        it('[DRDMV-2354]: Create a task and verify if the case is updated as per the milestone configurations', async () => {
            let manualTemplateData = {
                "templateName": "manual_task template" + randomStr,
                "templateSummary": "Manual_task template summary" + randomStr,
                "templateStatus": "Active",
                "priority": 'High',
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createManualTaskTemplate(manualTemplateData);
            // 1st step: Login to BWFA as Case agent and open Manual Task from pre condition
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qdu');
            await createCasePo.setSummary('manual task test for svt milestone' + randomStr);
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();

            // On view case page.
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.addTaskFromTaskTemplate(manualTemplateData.templateSummary);
            let taskId = await manageTaskBladePo.getTaskDisplayId();
            await manageTaskBladePo.clickTaskLink(manualTemplateData.templateSummary);

            await browser.sleep(40000); // wait added for milestone to trigger and reflect the changes

            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(taskId);
            expect(await slmProgressBar.isSLAProgressBarInProcessIconDisplayed()).toBe(true); //green
            expect(await viewTaskPo.getTaskSummaryValue()).toBe(updatedTaskSummary);
            await activityTabPo.clickOnRefreshButton();
            expect(await activityTabPo.isTextPresentInActivityLog(updatedTaskSummary)).toBeTruthy('TemplateText is not available');
            expect(await activityTabPo.isTextPresentInActivityLog("Summary")).toBeTruthy('TemplateText is not available');
        });

        it('[DRDMV-2354]: Create a task wit mismatched qualifications and verify if the case is updated as per the milestone configurations', async () => {
            let automatedtemplateData = {
                "templateName": 'Automated task19011' + randomStr,
                "templateSummary": 'Automated task19011' + randomStr,
                "templateStatus": "Active",
                "priority": 'High',
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": 'Auto Proces' + randomStr,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
            }
            let automatedTaskTemplate = await apiHelper.createAutomatedTaskTemplate(automatedtemplateData);

            await apiHelper.apiLogin('qkatawazi');
            // 1st step: Login to BWFA as Case agent and open Manual Task from pre condition
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qdu');
            await createCasePo.setSummary('manual task test for svt milestone' + randomStr);
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();

            // On view case page.
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.addTaskFromTaskTemplate(automatedtemplateData.templateSummary);
            let taskId = await manageTaskBladePo.getTaskDisplayId();
            await manageTaskBladePo.clickTaskLink(automatedtemplateData.templateSummary);

            await browser.sleep(35000); // wait added for milestone to trigger and reflect the changes

            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(taskId);
            expect(await slmProgressBar.isSLAProgressBarInProcessIconDisplayed()).toBe(true); //green
            expect(await viewTaskPo.getTaskSummaryValue()).toBe(automatedtemplateData.templateSummary);
        });

    });

});
