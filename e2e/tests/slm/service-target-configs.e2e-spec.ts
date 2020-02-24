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
import utilGrid from '../../utils/util.grid';
import serviceTargetBladePo from '../../pageobject/settings/slm/service-target-blade.po';
import slmExpressionbuilderPopPo from '../../pageobject/settings/slm/slm-expressionbuilder.pop.po';

var caseBAUser = 'qkatawazi';
var caseAgentUser = 'qtao';
var caseAgentUserPsilon = 'werusha';


describe('Service Target Tests', () => {
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
    it('[DRDMV-2361]:SLM - Service Target - Save and Close buttons', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');

        //when no data is entered
        await serviceTargetConfig.clickCreateSVTButton();
        expect(await serviceTargetConfig.isSaveButtonEnabled()).toBeFalsy('Save SVT button is enabled when no mandatory fields are left empty.');
        expect(await serviceTargetConfig.isCloseButtonEnabled()).toBeTruthy('Close SVT button is disabled when no mandatory fields are left empty.');
        await serviceTargetConfig.clickCloseButton();
        expect(await serviceTargetConfig.isServiceTargetBladeDisplayed()).toBeTruthy('Service Target Blade is displayed.');
        await utilCommon.clickOnWarningOk();
        expect(await serviceTargetConfig.isServiceTargetBladeDisplayed()).toBeFalsy('Service Target Blade is displayed.');

        //when optional field data is entered and click on Ok Warning button
        await serviceTargetConfig.clickCreateSVTButton();
        await serviceTargetConfig.selectGoalType('Case Response Time');
        await serviceTargetConfig.enterSVTDescription('Case for SVT Desc');
        expect(await serviceTargetConfig.isSaveButtonEnabled()).toBeFalsy('Save SVT button is enabled when no mandatory fields are left empty.');
        expect(await serviceTargetConfig.isCloseButtonEnabled()).toBeTruthy('Close SVT button is disabled when no mandatory fields are left empty.');
        await serviceTargetConfig.clickCloseButton();
        expect(await utilCommon.isWarningDialogBoxDisplayed()).toBeTruthy('Warning Dialog Box is not displayed.');
        expect(await utilCommon.getWarningMessagegText()).toBe('Warning!');
        expect(await utilCommon.getWarningDialogMsg()).toBe('You have unsaved data. Do you want to continue?');
        await utilCommon.clickOnWarningOk();
        expect(await serviceTargetConfig.isServiceTargetBladeDisplayed()).toBeFalsy('Service Target Blade is displayed.');

        //when optional field data is entered and click on Cancel Warning button
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

        await utilGrid.searchAndOpenHyperlink('SVT from Protractor');
        await browser.sleep(3000);

        //when no data is entered
        expect(await serviceTargetConfig.isServiceTargetBladeDisplayed()).toBeTruthy('Service Target Blade is displayed.');
        expect(await serviceTargetConfig.isSaveButtonEnabled()).toBeFalsy('Save SVT button is enabled when no mandatory fields are left empty.');
        expect(await serviceTargetConfig.isCloseButtonEnabled()).toBeTruthy('Close SVT button is disabled when no mandatory fields are left empty.');
        await serviceTargetConfig.clickCloseButton();
        expect(await serviceTargetConfig.isServiceTargetBladeDisplayed()).toBeFalsy('Service Target Blade is displayed.');

        await utilGrid.searchAndOpenHyperlink('SVT from Protractor');
        await browser.sleep(3000);

        //when optional field data is entered and click on Ok Warning button
        await serviceTargetConfig.enterSVTDescription('Case for Test SVT Desc');
        expect(await serviceTargetConfig.isSaveButtonEnabled()).toBeTruthy('Save SVT button is enabled when no mandatory fields are left empty.');
        expect(await serviceTargetConfig.isCloseButtonEnabled()).toBeTruthy('Close SVT button is disabled when no mandatory fields are left empty.');
        await serviceTargetConfig.clickCloseButton();
        expect(await utilCommon.isWarningDialogBoxDisplayed()).toBeTruthy('Warning Dialog Box is not displayed.');
        expect(await utilCommon.getWarningMessagegText()).toBe('Warning!');
        expect(await utilCommon.getWarningDialogMsg()).toBe('You have unsaved data. Do you want to continue?');
        await utilCommon.clickOnWarningOk();
        expect(await serviceTargetConfig.isServiceTargetBladeDisplayed()).toBeFalsy('Service Target Blade is displayed.');

        await utilGrid.searchAndOpenHyperlink('SVT from Protractor');
        await browser.sleep(3000);


        //when optional field data is entered and click on Cancel Warning button
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
    }, 300 * 1000);

    //skhobrag
    it('[DRDMV-2360]:SLM - Service Target - Create/Edit with min/max information', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');

        //when SVT created with only mandatory details
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

        //when SVT created with both mandatory and optional details
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

        await utilGrid.searchAndOpenHyperlink('SVT with mandatory fields');
        await browser.sleep(1000);
        await serviceTargetConfig.enterSVTDescription('Case for Test SVT Desc');
        await serviceTargetConfig.clickOnSaveSVTButton();
        expect(await utilCommon.isPopUpMessagePresent('Record has been updated successfully')).toBeTruthy('Record saved successfully confirmation message not displayed.');
        await browser.sleep(2000);

        await utilGrid.searchAndOpenHyperlink('SVT with all fields');
        await browser.sleep(1000);
        await serviceTargetConfig.clearSVTDescription();
        await serviceTargetConfig.clickOnSaveSVTButton();
        await browser.sleep(2000);
        expect(await utilCommon.isPopUpMessagePresent('Record has been updated successfully')).toBeTruthy('Record saved successfully confirmation message not displayed.');
    }, 300 * 1000);

    //skhobrag
    it('[DRDMV-5038]:"Terms and Condition" qualification is added on Service Target - Create View', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');
        await serviceTargetConfig.clickCreateSVTButton();
        expect(await serviceTargetBladePo.isTermsAndConditionsFieldMandatory()).toBeTruthy('Terms and Conditions field is optional.');
        await serviceTargetConfig.enterSVTTitle('SVT from Protractor');
        await serviceTargetConfig.selectCompany('Petramco');
        await serviceTargetConfig.selectDataSource('Case Management');
        await serviceTargetConfig.selectGoal("2");
        await serviceTargetConfig.selectMileStone();
        await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
        await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Pending");
        await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Resolved");
        expect(await serviceTargetConfig.isSaveButtonEnabled()).toBeTruthy('Save button is enabled when mandatory fields are left empty.');
        await serviceTargetConfig.clickBuildExpressionLink();
        await SlmExpressionBuilder.selectExpressionQualification('Priority', '=', 'SELECTION', 'High');
        await SlmExpressionBuilder.clickOnAddExpressionButton('SELECTION');
        let selectedExp: string = await SlmExpressionBuilder.getSelectedExpression();
        let expectedSelectedExp = "'" + "Priority" + "'" + "=" + '"' + "High" + '"'
        expect(selectedExp).toEqual(expectedSelectedExp);
        await SlmExpressionBuilder.clickOnSaveExpressionButton();
    }, 300 * 1000);


    //skhobrag
    it('[DRDMV-5039]:"Terms and Condition" qualification is added on Service Target - Edit View', async () => {
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
            await utilGrid.searchAndOpenHyperlink('SVT from Protractor');
            expect(await serviceTargetConfig.isServiceTargetBladeDisplayed()).toBeTruthy('Edit Service Target Configuration blade is not displayed.');
            expect(await serviceTargetConfig.isSaveButtonEnabled()).toBeTruthy('Save button is enabled when mandatory fields are left empty. 1');
            expect(await serviceTargetBladePo.isTermsAndConditionsFieldMandatory()).toBeTruthy('Terms and Conditions field is optional.');
            await serviceTargetConfig.clickBuildExpressionLink();
            await SlmExpressionBuilder.clearSelectedExpression();
            await browser.sleep(1000);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await browser.sleep(1000);
            expect(await serviceTargetConfig.isSaveButtonEnabled()).toBeFalsy('Save button is enabled when mandatory fields are left empty. 2');
            await serviceTargetConfig.clickBuildExpressionLink();
            await SlmExpressionBuilder.clearSelectedExpression();
            await SlmExpressionBuilder.selectFirstLevelExpressionQualification('Requester', '=', 'PERSON', 'Qiang Du');
            await SlmExpressionBuilder.clickOnAddExpressionButton('PERSON');
            selectedExp = await SlmExpressionBuilder.getSelectedExpression();
            expectedSelectedExp = "'" + "Requester" + "'" + "=" + '"' + "Qiang Du" + '"'
            await expect(selectedExp).toEqual(expectedSelectedExp);
            await SlmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.clickOnSaveSVTButton();
        }catch( error){
            throw error;
        }
        }, 300 * 1000);

    //skhobrag
    it('[DRDMV-2363]:SLM - Service Target - Measurement Build Expression', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');

        //when SVT created with both mandatory and optional details
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

        await utilGrid.searchAndOpenHyperlink('SVT with all fields');
        await browser.sleep(1000);
        await serviceTargetConfig.selectMileStone();
        await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "New");
        await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "In Progress");
        await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
        await serviceTargetConfig.clickOnSaveSVTButton();
        expect(await utilCommon.isPopUpMessagePresent('Record has been updated successfully')).toBeTruthy('Record saved successfully confirmation message not displayed.');
     }, 300 * 1000);


})
