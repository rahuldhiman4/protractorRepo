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

let caseBAUser = 'qkatawazi';

describe('Service Target Tests', () => {
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
            await serviceTargetConfig.selectMileStone();
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
            await serviceTargetConfig.selectMileStone();
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
            await serviceTargetConfig.selectMileStone();
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
            await serviceTargetConfig.selectMileStone();
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
            await serviceTargetConfig.selectMileStone();
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
            await serviceTargetConfig.selectMileStone();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();
            expect(await utilCommon.isPopUpMessagePresent('Record has been registered successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
        });
        it('[DRDMV-2363]: Verify SVT Updation', async () => {
            await utilGrid.searchAndOpenHyperlink('SVT with all fields');
            await browser.sleep(1000);
            await serviceTargetConfig.selectMileStone();
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
            await SlmExpressionBuilder.selectExpressionQualification('Category Tier 1', '=', 'ASSOCIATION', 'Applications');
            await SlmExpressionBuilder.clickOnAddExpressionButton('ASSOCIATION');
            let selectedExp: string = await SlmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Category Tier 1" + "'" + "=" + '"' + "Applications" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("6");
            await serviceTargetConfig.selectMileStone();
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
            await changeAssignmentPage.selectBusinessUnit('Facilities Support');
            await changeAssignmentPage.selectSupportGroup('Facilities');
            await changeAssignmentPage.selectAssignee('Fritz Schulz');
            await changeAssignmentPage.clickOnAssignButton();
            await editCasePo.clickSaveCase();
            expect(await slmProgressBar.isSLAProgressBarInProcessIconDisplayed()).toBe(true); //green
        });
        it('[DRDMV-21723]:Verify if SVT is still attached to a case when case assignment is changed', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await utilityGrid.clearFilter();
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
            await SlmExpressionBuilder.selectExpressionQualification('Category Tier 1', '=', 'ASSOCIATION', 'Applications');
            await SlmExpressionBuilder.clickOnAddExpressionButton('ASSOCIATION');
            let selectedExp: string = await SlmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Category Tier 1" + "'" + "=" + '"' + "Applications" + '"'
            expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("60");
            expect(await utilCommon.isPopUpMessagePresent('Minutes can have max value of 59')).toBeTruthy('Error : Record definition does not exists error message is not displayed.');
            await serviceTargetConfig.selectGoal("-1");
            expect(await utilCommon.isPopUpMessagePresent('Minutes can have min value of 0')).toBeTruthy('Error : Record definition does not exists error message is not displayed.');
            await serviceTargetConfig.selectGoal("24", "Hours");
            expect(await utilCommon.isPopUpMessagePresent('Hours can have max value of 23')).toBeTruthy('Error : Record definition does not exists error message is not displayed.');
            await serviceTargetConfig.selectGoal("-1", "Hours");
            expect(await utilCommon.isPopUpMessagePresent('Hours can have min value of 0')).toBeTruthy('Error : Record definition does not exists error message is not displayed.');
            await serviceTargetConfig.selectGoal("366", "Days");
            expect(await utilCommon.isPopUpMessagePresent('Days can have max value of 365')).toBeTruthy('Error : Record definition does not exists error message is not displayed.');
            await serviceTargetConfig.selectGoal("-1", "Days");
            expect(await utilCommon.isPopUpMessagePresent('Days can have min value of 0')).toBeTruthy('Error : Record definition does not exists error message is not displayed.');
            await serviceTargetConfig.clickCloseButton();
            expect(await utilCommon.getWarningDialogMsg()).toBe('You have unsaved data. Do you want to continue?');
            await utilCommon.clickOnWarningOk();
        });

        it('[DRDMV-2357]: Verify SVT warning when data source is modified', async () => {
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Global', 'Case Management');
            await SlmExpressionBuilder.selectExpressionQualification('Category Tier 1', '=', 'ASSOCIATION', 'Applications');
            await SlmExpressionBuilder.clickOnAddExpressionButton('ASSOCIATION');
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


});
