import { browser } from "protractor";
import createCasePage from '../../pageobject/case/create-case.po';
import caseEditPage from '../../pageobject/case/edit-case.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import serviceTargetConfig from '../../pageobject/settings/slm/service-target-blade.po';
import slmExpressionBuilder from '../../pageobject/settings/slm/slm-expressionbuilder.pop.po';
import slmProgressBar from '../../pageobject/slm/slm-progressbar.po';
import utilCommon from '../../utils/util.common';

var caseBAUser = 'qkatawazi';

describe('Service Taret Tests', () => {
    beforeAll(async () => {
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
        await loginPage.login(caseBAUser);
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    afterEach(async () => {
        await browser.refresh();
        await utilCommon.waitUntilSpinnerToHide();
    });

    it('DRDMV-19665:UI Validation to check how associations are displayed on build expression blade', async () => {
        let assignedCompanySecondLevelAssociation: string[] = ["Abbreviation", "Type"];
        let caseSiteSecondLevelAssociation: string[] = ["Address", "Country", "State","Type","Zip or Postal Code"];
        let requesterSecondLevelAssociation: string[] = ["Corporate ID", "Cost Centre","Email", "Full Name","Functional Roles","Job Title","Type","VIP"];
  
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows'))
            .toEqual('Service Target - Administration - Business Workflows');
        await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');
        //Verify second level association for Assigned Company
        let firstLevelExpression = await slmExpressionBuilder.getFirstLevelExpressionField('Assigned Company');
        expect(firstLevelExpression).toBe('Assigned Company');
        await slmExpressionBuilder.selectSecondLevelExpressionField('Assigned Company','Abbreviation');
        let secondLevelExpression:boolean = await slmExpressionBuilder.getSecondLevelExpressionField('Assigned Company',assignedCompanySecondLevelAssociation);
        expect(secondLevelExpression).toBeTruthy('Assigned Company second level association fields does not matches.');

        //Verify second level association for Case Site
        firstLevelExpression = await slmExpressionBuilder.getFirstLevelExpressionField('Case Site');
        expect(firstLevelExpression).toBe('Case Site');
        await slmExpressionBuilder.selectSecondLevelExpressionField('Case Site','Address');
        secondLevelExpression = await slmExpressionBuilder.getSecondLevelExpressionField('Case Site',caseSiteSecondLevelAssociation);
        expect(secondLevelExpression).toBeTruthy('Case Site second level association fields does not matches.');

        //Verify second level association for Company
        firstLevelExpression = await slmExpressionBuilder.getFirstLevelExpressionField('Company');
        expect(firstLevelExpression).toBe('Company');
        await slmExpressionBuilder.selectSecondLevelExpressionField('Company','Type');
        secondLevelExpression = await slmExpressionBuilder.getSecondLevelExpressionField('Company',assignedCompanySecondLevelAssociation);
        expect(secondLevelExpression).toBeTruthy('Company second level association fields does not matches.');

        //Verify second level association for Requester
        firstLevelExpression = await slmExpressionBuilder.getFirstLevelExpressionField('Requester');
        expect(firstLevelExpression).toBe('Requester');
        await slmExpressionBuilder.selectSecondLevelExpressionField('Requester','Email');
        secondLevelExpression = await slmExpressionBuilder.getSecondLevelExpressionField('Requester',requesterSecondLevelAssociation);
        expect(secondLevelExpression).toBeTruthy('Requester second level association fields does not matches.');
    });

    it('DRDMV-19667:SVT created with multiple associations and SVT gets attach to a Case', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows');        expect(await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows'))
            .toEqual('Service Target - Administration - Business Workflows');
        await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');

        //Verify second level association for Assigned Company
        await slmExpressionBuilder.selectFirstLevelExpressionQualification('Requester',"=",'PERSON',"Qiang Du");
        let selectedExpx = await slmExpressionBuilder.getSelectedExpression();
        var expectedSelectedExp = "'" + "Requester" + "'" + "=" + '"' + "Qiang Du" + '"'
        console.log(selectedExpx);
        expect(selectedExpx).toEqual(expectedSelectedExp);
        await slmExpressionBuilder.clickOnSaveExpressionButton();
        await serviceTargetConfig.selectGoal("2");
        await serviceTargetConfig.selectMileStone();
        await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
        await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
        await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
        await serviceTargetConfig.clickOnSaveSVTButton();
        browser.sleep(3000);
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester('Qiang');
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

        //Create another SVT with second level association
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows'))
            .toEqual('Service Target - Administration - Business Workflows');
        await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');

        //Verify second level association for Assigned Company
        await slmExpressionBuilder.selectSecondLevelExpressionQualification('Requester','Email',"=",'TEXT',"qdu@petramco.com");
        selectedExpx = await slmExpressionBuilder.getSelectedExpression();
        var expectedSelectedExp = "'" + "Requester > Email" + "'" + "=" + '"' + "Qiang Du" + '"'
        console.log(selectedExpx);
        expect(selectedExpx).toEqual(expectedSelectedExp);
        await slmExpressionBuilder.clickOnSaveExpressionButton();
        await serviceTargetConfig.selectGoal("2");
        await serviceTargetConfig.selectMileStone();
        await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
        await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
        await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
        await serviceTargetConfig.clickOnSaveSVTButton();
        browser.sleep(3000);
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester('Qiang');
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

    },600*1000);

    it('DRDMV-19660:SVT created for Company associations and SVT get links to a Case', async () => {
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows'))
            .toEqual('Service Target - Administration - Business Workflows');
        await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');

        //Verify second level association for Company
        await slmExpressionBuilder.selectSecondLevelExpressionQualification('Company','Abbreviation',"=",'TEXT',"ptramco");
        let selectedExpx = await slmExpressionBuilder.getSelectedExpression();
        var expectedSelectedExp = "'" + "Company > Abbreviation" + "'" + "=" + '"' + "ptramco" + '"'
        expect(selectedExpx).toEqual(expectedSelectedExp);
        await slmExpressionBuilder.clickOnSaveExpressionButton();
        await serviceTargetConfig.selectGoal("2");
        await serviceTargetConfig.selectMileStone();
        await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
        await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
        await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
        await serviceTargetConfig.clickOnSaveSVTButton();
        browser.sleep(3000);
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester('Qiang');
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

    },600*1000);

    it('DRDMV-19662:SVT created for Case Site associations and SVT get links to a Case', async () => {
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows'))
            .toEqual('Service Target - Administration - Business Workflows');
        await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');

        //Verify second level association for Case Site
        await slmExpressionBuilder.selectSecondLevelExpressionQualification('Case Site','Country',"=",'NAMED_LIST',"Canada");
        let selectedExpx = await slmExpressionBuilder.getSelectedExpression();
        var expectedSelectedExp = "'" + "Case Site > Country" + "'" + "=" + '"' + "Canada" + '"'
        console.log(selectedExpx);
        expect(selectedExpx).toEqual(expectedSelectedExp);
        await slmExpressionBuilder.clickOnSaveExpressionButton();
        await serviceTargetConfig.selectGoal("2");
        await serviceTargetConfig.selectMileStone();
        await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
        await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
        await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
        await serviceTargetConfig.clickOnSaveSVTButton();
        browser.sleep(3000);
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester('Qiang');
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
    },600*1000);

    it('DRDMV-19663:SVT created for Assigned Company associations and SVT get links to a Case', async () => {
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows'))
            .toEqual('Service Target - Administration - Business Workflows');
        await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');

        //Verify second level association for Assigned Company
        await slmExpressionBuilder.selectSecondLevelExpressionQualification('Assigned Company','Abbreviation',"=",'TEXT',"ptramco");
        let selectedExpx = await slmExpressionBuilder.getSelectedExpression();
        var expectedSelectedExp = "'" + "Assigned Company > Abbreviation" + "'" + "=" + '"' + "ptramco" + '"'
        expect(selectedExpx).toEqual(expectedSelectedExp);
        await slmExpressionBuilder.clickOnSaveExpressionButton();
        await serviceTargetConfig.selectGoal("2");
        await serviceTargetConfig.selectMileStone();
        await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
        await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
        await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
        await serviceTargetConfig.clickOnSaveSVTButton();
        browser.sleep(3000);
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester('Qiang');
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

    },600*1000);

    it('DRDMV-19664:SVT created for Requester associations and SVT get links to a Case', async () => {
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows'))
            .toEqual('Service Target - Administration - Business Workflows');
        await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');

        //Verify second level association for Requester
        await slmExpressionBuilder.selectSecondLevelExpressionQualification('Requester','Email',"=",'TEXT',"qdu@petramco.com");
        let selectedExpx = await slmExpressionBuilder.getSelectedExpression();
        var expectedSelectedExp = "'" + "Requester > Email" + "'" + "=" + '"' + "qdu@petramco.com" + '"'
        expect(selectedExpx).toEqual(expectedSelectedExp);
        await slmExpressionBuilder.clickOnSaveExpressionButton();
        await serviceTargetConfig.selectGoal("2");
        await serviceTargetConfig.selectMileStone();
        await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
        await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
        await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
        await serviceTargetConfig.clickOnSaveSVTButton();
        browser.sleep(3000);
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester('Qiang');
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
    },600*1000);

    it('DRDMV-19668:Check SVT is attached to a Case and later Associations are updated', async () => {
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows'))
            .toEqual('Service Target - Administration - Business Workflows');
        await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');

        //Verify second level association for Requester
        await slmExpressionBuilder.selectSecondLevelExpressionQualification('Requester','Email',"=",'TEXT',"qdu@petramco.com");
        let selectedExpx = await slmExpressionBuilder.getSelectedExpression();
        var expectedSelectedExp = "'" + "Requester > Email" + "'" + "=" + '"' + "qdu@petramco.com" + '"'
        expect(selectedExpx).toEqual(expectedSelectedExp);
        await slmExpressionBuilder.clickOnSaveExpressionButton();
        await serviceTargetConfig.selectGoal("2");
        await serviceTargetConfig.selectMileStone();
        await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
        await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
        await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
        await serviceTargetConfig.clickOnSaveSVTButton();
        browser.sleep(3000);
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester('Qiang');
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
    },600*1000);

})

