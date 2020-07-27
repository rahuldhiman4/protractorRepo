import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import previewCasePo from '../../pageobject/case/case-preview.po';
import createCasePage from '../../pageobject/case/create-case.po';
import viewCasePage from '../../pageobject/case/view-case.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import serviceTargetConfig from '../../pageobject/settings/slm/service-target-blade.po';
import slmExpressionBuilder from '../../pageobject/settings/slm/slm-expressionbuilder.pop.po';
import slmProgressBar from '../../pageobject/slm/slm-progressbar.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import caseConsolePage from '../../pageobject/case/case-console.po';

let caseBAUser = 'qkatawazi';

describe('Service Target - Second Level Association Tests', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login(caseBAUser);
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    beforeEach(async () => {
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteServiceTargets();
    });

    afterEach(async () => {
        await utilityCommon.refresh();
    });

    it('[DRDMV-19665]:UI Validation to check how associations are displayed on build expression blade', async () => {
        let assignedCompanySecondLevelAssociation: string[] = ["Abbreviation", "Type"];
        let caseSiteSecondLevelAssociation: string[] = ["Address", "Country", "State", "Type", "Zip or Postal Code"];
        let requesterSecondLevelAssociation: string[] = ["Corporate ID", "Cost Centre", "Email", "Full Name", "Functional Roles", "Job Title", "Type", "VIP"];

        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows'))
            .toEqual('Service Target - Administration - Business Workflows');
        await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');
        //Verify second level association for Assigned Company
        let firstLevelExpression = await slmExpressionBuilder.getFirstLevelExpressionField('Assigned Company');
        expect(firstLevelExpression).toBe('Assigned Company');
        //await slmExpressionBuilder.selectSecondLevelExpressionField('Assigned Company', 'Abbreviation');
        let secondLevelExpression: boolean = await slmExpressionBuilder.areSecondLevelExpressionFieldsMatches('Assigned Company', assignedCompanySecondLevelAssociation);
        expect(secondLevelExpression).toBeTruthy('Assigned Company second level association fields does not matches.');

        //Verify second level association for Case Site
        firstLevelExpression = await slmExpressionBuilder.getFirstLevelExpressionField('Case Site');
        expect(firstLevelExpression).toBe('Case Site');
        //await slmExpressionBuilder.selectSecondLevelExpressionField('Case Site', 'Address');
        secondLevelExpression = await slmExpressionBuilder.areSecondLevelExpressionFieldsMatches('Case Site', caseSiteSecondLevelAssociation);
        expect(secondLevelExpression).toBeTruthy('Case Site second level association fields does not matches.');

        //Verify second level association for Company
        firstLevelExpression = await slmExpressionBuilder.getFirstLevelExpressionField('Company');
        //await slmExpressionBuilder.selectSecondLevelExpressionField('Company', 'Type');
        secondLevelExpression = await slmExpressionBuilder.areSecondLevelExpressionFieldsMatches('Company', assignedCompanySecondLevelAssociation);
        expect(secondLevelExpression).toBeTruthy('Company second level association fields does not matches.');

        //Verify second level association for Requester
        firstLevelExpression = await slmExpressionBuilder.getFirstLevelExpressionField('Requester');
        expect(firstLevelExpression).toBe('Requester');
        //await slmExpressionBuilder.selectSecondLevelExpressionField('Requester', 'Email');
        secondLevelExpression = await slmExpressionBuilder.areSecondLevelExpressionFieldsMatches('Requester', requesterSecondLevelAssociation);
        expect(secondLevelExpression).toBeTruthy('Requester second level association fields does not matches.');
    });

    it('[DRDMV-19667]:SVT created with multiple associations and SVT gets attach to a Case', async () => {
        let caseId = undefined;
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows'); expect(await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows'))
            .toEqual('Service Target - Administration - Business Workflows');
        await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');

        //Verify second level association for Assigned Company
        await slmExpressionBuilder.selectFirstLevelExpressionQualification('Requester', "=", 'PERSON', "Qiang Du");
        let selectedExpx = await slmExpressionBuilder.getSelectedExpression();
        let expectedSelectedExp = "'" + "Requester" + "'" + "=" + '"' + "Qiang Du" + '"'
        console.log(selectedExpx);
        expect(selectedExpx).toEqual(expectedSelectedExp);
        await slmExpressionBuilder.clickOnSaveExpressionButton();
        await serviceTargetConfig.selectGoal("4");
        await serviceTargetConfig.selectMileStone();
        await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
        await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
        await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
        await serviceTargetConfig.clickOnSaveSVTButton();
        browser.sleep(3000);
        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester('Qiang');
        await createCasePage.setSummary('Case for SVT creation');
        await createCasePage.selectCategoryTier1('Employee Relations');
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        caseId = await viewCasePage.getCaseID();
        await browser.sleep(31000);
        expect(await slmProgressBar.isSLAProgressBarInProcessIconDisplayed()).toBe(true); //green
        expect(await viewCasePage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)'); //green
        await browser.sleep(170000);
        await navigationPage.gotoCaseConsole();
        await caseConsolePage.searchAndOpenCase(caseId);
        expect(await slmProgressBar.isSLAProgressBarWarningIconDisplayed()).toBe(true); //green
        expect(await viewCasePage.getSlaBarColor()).toBe('rgba(241, 181, 33, 1)'); //orange
        await browser.sleep(70000);
        await navigationPage.gotoCaseConsole();
        await caseConsolePage.searchAndOpenCase(caseId);
        expect(await slmProgressBar.isSLAProgressBarMissedGoalIconDisplayed()).toBe(true); //green
        expect(await viewCasePage.getSlaBarColor()).toBe('rgba(248, 50, 0, 1)');

        //Create another SVT with second level association
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows'))
            .toEqual('Service Target - Administration - Business Workflows');
        await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');

        //Verify second level association for Assigned Company
        await slmExpressionBuilder.selectFirstLevelExpressionQualification('Requester', '=', 'PERSON', 'Qianru Tao');
        await slmExpressionBuilder.clickOnAddExpressionButton('PERSON');
        let selectedExp: string = await slmExpressionBuilder.getSelectedExpression();
        expectedSelectedExp = "'" + "Requester" + "'" + "=" + '"' + "Qianru Tao" + '"';
        expect(selectedExp).toEqual(expectedSelectedExp);
        await slmExpressionBuilder.clickOnSaveExpressionButton();
        await serviceTargetConfig.selectGoal("4");
        await serviceTargetConfig.selectMileStone();
        await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
        await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
        await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
        await serviceTargetConfig.clickOnSaveSVTButton();
        browser.sleep(3000);
        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester('Qiang');
        await createCasePage.setSummary('Case for SVT creation');
        await createCasePage.selectCategoryTier1('Employee Relations');
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        caseId = await viewCasePage.getCaseID();
        await browser.sleep(31000);
        expect(await slmProgressBar.isSLAProgressBarInProcessIconDisplayed()).toBe(true); //green
        expect(await viewCasePage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)'); //green
        await browser.sleep(170000);
        await navigationPage.gotoCaseConsole();
        await caseConsolePage.searchAndOpenCase(caseId);
        expect(await slmProgressBar.isSLAProgressBarWarningIconDisplayed()).toBe(true); //green
        expect(await viewCasePage.getSlaBarColor()).toBe('rgba(241, 181, 33, 1)'); //orange
        await browser.sleep(70000);
        await navigationPage.gotoCaseConsole();
        await caseConsolePage.searchAndOpenCase(caseId);
        expect(await slmProgressBar.isSLAProgressBarMissedGoalIconDisplayed()).toBe(true); //green
        expect(await viewCasePage.getSlaBarColor()).toBe('rgba(248, 50, 0, 1)');
    }, 820 * 1000);

    //Application issue...
    it('[DRDMV-19660]:SVT created for Company associations and SVT get links to a Case', async () => {
        let caseId = undefined;
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows'); expect(await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows'))
            .toEqual('Service Target - Administration - Business Workflows');
        await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');

        //Verify second level association for Company
        await slmExpressionBuilder.selectSecondLevelExpressionQualification('Company', 'Type', "like", 'NAMED_LIST', "Operating Organization");
        let selectedExpx = await slmExpressionBuilder.getSelectedExpression();
        let expectedSelectedExp = "'" + "Company > Type" + "'" + "LIKE" + '"%' + "Operating Organization" + '%"'
        expect(selectedExpx).toEqual(expectedSelectedExp);
        await slmExpressionBuilder.clickOnSaveExpressionButton();
        await serviceTargetConfig.selectGoal("3");
        await serviceTargetConfig.selectMileStone();
        await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
        await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
        await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
        await serviceTargetConfig.clickOnSaveSVTButton();
        browser.sleep(3000);
        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester('Qiang');
        await createCasePage.setSummary('Case for SVT creation');
        await createCasePage.selectCategoryTier1('Employee Relations');
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        await browser.sleep(31000);
        caseId = viewCasePage.getCaseID();
        expect(await slmProgressBar.isSLAProgressBarInProcessIconDisplayed()).toBe(true); //green
        expect(await viewCasePage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)'); //green
        await browser.sleep(130000);
        await navigationPage.gotoCaseConsole();
        await caseConsolePage.searchAndOpenCase(caseId);
        expect(await slmProgressBar.isSLAProgressBarWarningIconDisplayed()).toBe(true); //green
        expect(await viewCasePage.getSlaBarColor()).toBe('rgba(241, 181, 33, 1)'); //orange
        await browser.sleep(50000);
        await navigationPage.gotoCaseConsole();
        await caseConsolePage.searchAndOpenCase(caseId);
        expect(await slmProgressBar.isSLAProgressBarMissedGoalIconDisplayed()).toBe(true); //green
        expect(await viewCasePage.getSlaBarColor()).toBe('rgba(248, 50, 0, 1)');
    }, 750 * 1000);

    it('[DRDMV-19662]:SVT created for Case Site associations and SVT get links to a Case', async () => {
        let caseId = undefined;
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows'))
            .toEqual('Service Target - Administration - Business Workflows');
        await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');

        //Verify second level association for Case Site
        await slmExpressionBuilder.selectSecondLevelExpressionQualification('Case Site', 'Country', "=", 'NAMED_LIST', "Canada");
        let selectedExpx = await slmExpressionBuilder.getSelectedExpression();
        let expectedSelectedExp = "'" + "Case Site > Country" + "'" + "=" + '"' + "Canada" + '"'
        console.log(selectedExpx);
        expect(selectedExpx).toEqual(expectedSelectedExp);
        await slmExpressionBuilder.clickOnSaveExpressionButton();
        await serviceTargetConfig.selectGoal("4");
        await serviceTargetConfig.selectMileStone();
        await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
        await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
        await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
        await serviceTargetConfig.clickOnSaveSVTButton();
        browser.sleep(3000);
        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester('Qiang');
        await createCasePage.setSummary('Case for SVT creation');
        await createCasePage.selectCategoryTier1('Employee Relations');
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        caseId = viewCasePage.getCaseID();
        await browser.sleep(31000);
        expect(await slmProgressBar.isSLAProgressBarInProcessIconDisplayed()).toBe(true); //green
        expect(await viewCasePage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)'); //green
        await browser.sleep(170000);
        await navigationPage.gotoCaseConsole();
        await caseConsolePage.searchAndOpenCase(caseId);
        expect(await slmProgressBar.isSLAProgressBarWarningIconDisplayed()).toBe(true); //green
        expect(await viewCasePage.getSlaBarColor()).toBe('rgba(241, 181, 33, 1)'); //orange
        await browser.sleep(70000);
        await navigationPage.gotoCaseConsole();
        await caseConsolePage.searchAndOpenCase(caseId);
        expect(await slmProgressBar.isSLAProgressBarMissedGoalIconDisplayed()).toBe(true); //green
        expect(await viewCasePage.getSlaBarColor()).toBe('rgba(248, 50, 0, 1)');
    }, 820 * 1000);

    //Application issue...
    it('[DRDMV-19663]:SVT created for Assigned Company associations and SVT get links to a Case', async () => {
        let caseId = undefined;
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows'))
            .toEqual('Service Target - Administration - Business Workflows');
        await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');

        //Verify second level association for Assigned Company
        await slmExpressionBuilder.selectSecondLevelExpressionQualification('Assigned Company', 'Abbreviation', "=", 'TEXT', "ptramco");
        let selectedExpx = await slmExpressionBuilder.getSelectedExpression();
        let expectedSelectedExp = "'" + "Assigned Company > Abbreviation" + "'" + "=" + '"' + "ptramco" + '"'
        expect(selectedExpx).toEqual(expectedSelectedExp);
        await slmExpressionBuilder.clickOnSaveExpressionButton();
        await serviceTargetConfig.selectGoal("3");
        await serviceTargetConfig.selectMileStone();
        await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
        await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
        await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
        await serviceTargetConfig.clickOnSaveSVTButton();
        browser.sleep(3000);
        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester('Qiang');
        await createCasePage.setSummary('Case for SVT creation');
        await createCasePage.selectCategoryTier1('Employee Relations');
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        caseId = await viewCasePage.getCaseID();
        await browser.sleep(31000);
        expect(await slmProgressBar.isSLAProgressBarInProcessIconDisplayed()).toBe(true); //green
        expect(await viewCasePage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)'); //green
        await browser.sleep(130000);
        await navigationPage.gotoCaseConsole();
        await caseConsolePage.searchAndOpenCase(caseId);
        expect(await slmProgressBar.isSLAProgressBarWarningIconDisplayed()).toBe(true); //green
        expect(await viewCasePage.getSlaBarColor()).toBe('rgba(241, 181, 33, 1)'); //orange
        await browser.sleep(50000);
        await navigationPage.gotoCaseConsole();
        await caseConsolePage.searchAndOpenCase(caseId);
        expect(await slmProgressBar.isSLAProgressBarMissedGoalIconDisplayed()).toBe(true); //green
        expect(await viewCasePage.getSlaBarColor()).toBe('rgba(248, 50, 0, 1)');

    }, 750 * 1000);

    it('[DRDMV-19664]:SVT created for Requester associations and SVT get links to a Case', async () => {
        let caseId = undefined;
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows'))
            .toEqual('Service Target - Administration - Business Workflows');
        await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');

        //Verify second level association for Requester
        await slmExpressionBuilder.selectSecondLevelExpressionQualification('Requester', 'Email', "=", 'TEXT', "qdu@petramco.com1");
        let selectedExpx = await slmExpressionBuilder.getSelectedExpression();
        let expectedSelectedExp = "'" + "Requester > Email" + "'" + "=" + '"' + "qdu@petramco.com1" + '"';
        expect(selectedExpx).toEqual(expectedSelectedExp);
        await slmExpressionBuilder.clickOnSaveExpressionButton();
        await serviceTargetConfig.selectGoal("3");
        await serviceTargetConfig.selectMileStone();
        await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
        await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
        await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
        await serviceTargetConfig.clickOnSaveSVTButton();
        browser.sleep(3000);
        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester('Qiang');
        await createCasePage.setSummary('Case for SVT creation');
        await createCasePage.selectCategoryTier1('Employee Relations');
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        caseId = viewCasePage.getCaseID();
        await browser.sleep(31000);
        expect(await slmProgressBar.isSLAProgressBarInProcessIconDisplayed()).toBe(true); //green
        expect(await viewCasePage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)'); //green
        await browser.sleep(130000);
        await navigationPage.gotoCaseConsole();
        await caseConsolePage.searchAndOpenCase(caseId);
        expect(await slmProgressBar.isSLAProgressBarWarningIconDisplayed()).toBe(true); //green
        expect(await viewCasePage.getSlaBarColor()).toBe('rgba(241, 181, 33, 1)'); //orange
        await browser.sleep(50000);
        await navigationPage.gotoCaseConsole();
        await caseConsolePage.searchAndOpenCase(caseId);
        expect(await slmProgressBar.isSLAProgressBarMissedGoalIconDisplayed()).toBe(true); //green
        expect(await viewCasePage.getSlaBarColor()).toBe('rgba(248, 50, 0, 1)');
    }, 750 * 1000);

    it('[DRDMV-19668]:Check SVT is attached to a Case and later Associations are updated', async () => {
        let caseId = undefined;
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows'))
            .toEqual('Service Target - Administration - Business Workflows');
        await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');

        //Verify second level association for Requester
        await slmExpressionBuilder.selectSecondLevelExpressionQualification('Requester', 'Email', "=", 'TEXT', "qdu@petramco1.com");
        let selectedExpx = await slmExpressionBuilder.getSelectedExpression();
        let expectedSelectedExp = "'" + "Requester > Email" + "'" + "=" + '"' + "qdu@petramco1.com" + '"'
        expect(selectedExpx).toEqual(expectedSelectedExp);
        await slmExpressionBuilder.clickOnSaveExpressionButton();
        await serviceTargetConfig.selectGoal("3");
        await serviceTargetConfig.selectMileStone();
        await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
        await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
        await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
        await serviceTargetConfig.clickOnSaveSVTButton();
        browser.sleep(3000);
        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester('Qiang');
        await createCasePage.setSummary('Case for SVT creation');
        await createCasePage.selectCategoryTier1('Employee Relations');
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        caseId = await viewCasePage.getCaseID();
        await browser.sleep(31000);
        expect(await slmProgressBar.isSLAProgressBarInProcessIconDisplayed()).toBe(true); //green
        expect(await viewCasePage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)'); //green
        await browser.sleep(130000);
        await navigationPage.gotoCaseConsole();
        await caseConsolePage.searchAndOpenCase(caseId);
        expect(await slmProgressBar.isSLAProgressBarWarningIconDisplayed()).toBe(true); //green
        expect(await viewCasePage.getSlaBarColor()).toBe('rgba(241, 181, 33, 1)'); //orange
        await browser.sleep(50000);
        await navigationPage.gotoCaseConsole();
        await caseConsolePage.searchAndOpenCase(caseId);
        expect(await slmProgressBar.isSLAProgressBarMissedGoalIconDisplayed()).toBe(true); //green
        expect(await viewCasePage.getSlaBarColor()).toBe('rgba(248, 50, 0, 1)');
    }, 750 * 1000);
});
