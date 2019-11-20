import { browser, ProtractorExpectedConditions, protractor } from "protractor";
import loginPage from "../../pageobject/login.po";
import navigationPage from "../../pageobject/navigation.po";
import SlmExpressionBuilder from '../../pageobject/settings/slm-expressionbuilder.pop.po';
import serviceTargetConfig from '../../pageobject/settings/service-target-blade.po';
import createCasePage from '../../pageobject/case/create-case.po';
import caseEditPage from '../../pageobject/case/edit-case.po';
import SlmProgressBar from '../../pageobject/case/slm-progressbar.po';

var caseBAUser = 'qkatawazi';

describe('DRDMV-17016:Check if expression is build by using all available field with different relation', () => {
    const EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    beforeAll(async () => {
        await browser.manage().window().maximize();
        await browser.get(`${browser.baseUrl}/innovationsuite/index.html#/com.bmc.dsm.bwfa`);
        browser.waitForAngularEnabled(false);
    });

    afterAll(async () => {
        browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
        await navigationPage.signOut();
    });

    it('should login correctly', async () => {
        await loginPage.login(caseBAUser);
    });

    it('should goto Service Target settings', async () => {
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', 'Service Target - Administration - Business Workflows'))
            .toEqual('Service Target - Administration - Business Workflows');
    });

    it('should create Service Target Config', async () => {
        await serviceTargetConfig.createServiceTargetConfig();
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
    });

    it('should create case to apply SVT', async () => {
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester('Mary');
        await createCasePage.setSummary('Case for SVT creation');
        await createCasePage.selectCategoryTier1('Employee Relations');
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        expect(await SlmProgressBar.isSLAProgressBarInProessIconDisplayed()).toBe(true); //green
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
})
