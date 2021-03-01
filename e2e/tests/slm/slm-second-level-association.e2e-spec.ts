import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import caseConsolePage from '../../pageobject/case/case-console.po';
import previewCasePo from '../../pageobject/case/case-preview.po';
import createCasePage from '../../pageobject/case/create-case.po';
import viewCasePage from '../../pageobject/case/view-case.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import serviceTargetConfig from '../../pageobject/settings/slm/service-target-blade.po';
import slmExpressionBuilder from '../../pageobject/settings/slm/slm-expressionbuilder.pop.po';
import slmProgressBar from '../../pageobject/slm/slm-progressbar.po';
import { BWF_BASE_URL, BWF_PAGE_TITLES } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

let caseBAUser = 'qkatawazi';

xdescribe('Service Target - Second Level Association Tests', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login(caseBAUser);
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    describe('[3816]:UI Validation to check how associations are displayed on build expression blade', async () => {

        let assignedCompanySecondLevelAssociation: string[] = ["Abbreviation", "Type"];
        let caseSiteSecondLevelAssociation: string[] = ["Address", "Country", "State", "Type", "Zip or Postal Code"];
        let requesterSecondLevelAssociation: string[] = ["Corporate ID", "Cost Centre", "Email", "Full Name", "Functional Roles", "Job Title", "Type", "VIP"];

        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteServiceTargets();
        });

        it('[3816]:Verify second level association of Service Target', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', BWF_PAGE_TITLES.SERVICE_LEVEL_MANAGEMENT.SERVICE_TARGET);
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
        })
    });

    describe('[3815]:SVT created with multiple associations and SVT gets attach to a Case', async () => {
        let caseId = undefined;
        let expectedSelectedExp = undefined;
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteServiceTargets();
        });

        it('[3815]:Create a SVT with second level association', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', BWF_PAGE_TITLES.SERVICE_LEVEL_MANAGEMENT.SERVICE_TARGET);
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor first', 'Petramco', 'Case Management');

            //Verify second level association for Assigned Company
            await slmExpressionBuilder.selectSecondLevelExpressionQualification('Requester', 'Full Name', "=", 'NAMED_LIST', "Qiang Du");
            let selectedExpx = await slmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Requester > Full Name" + "'" + "=" + '"' + "Qiang Du" + '"'
            expect(selectedExpx).toEqual(expectedSelectedExp);
            await slmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("3");
            await serviceTargetConfig.selectMeasurement();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
        });

        it('[3815]:Create a Case and observe if SVT is attached to the Case', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Qiang');
            await createCasePage.setSummary('Case for SVT creation first');
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

        it('[3815]:Verify SVT with different SVT statuses', async () => {
            await browser.sleep(15000);
            await navigationPage.gotoCaseConsole();
            await caseConsolePage.searchAndOpenCase(caseId);
            expect(await slmProgressBar.isSLAProgressBarWarningIconDisplayed()).toBe(true); //green
            expect(await viewCasePage.getSlaBarColor()).toBe('rgba(241, 181, 33, 1)'); //orange
            await browser.sleep(40000);
            await navigationPage.gotoCaseConsole();
            await caseConsolePage.searchAndOpenCase(caseId);
            expect(await slmProgressBar.isSLAProgressBarMissedGoalIconDisplayed()).toBe(true); //green
            expect(await viewCasePage.getSlaBarColor()).toBe('rgba(248, 50, 0, 1)');
        });

        it('[3815]:Create a Case and check if svt is not attached', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('qtao');
            await createCasePage.setSummary('Case for SVT creation first');
            await createCasePage.selectCategoryTier1('Employee Relations');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            caseId = await viewCasePage.getCaseID();
            await browser.sleep(2000);
            expect(await slmProgressBar.isSLAProgressBarInProcessIconDisplayed()).toBe(false); //green
        });

        it('[3815]:Create another SVT', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', BWF_PAGE_TITLES.SERVICE_LEVEL_MANAGEMENT.SERVICE_TARGET);
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor second', 'Petramco', 'Case Management');

            await slmExpressionBuilder.selectSecondLevelExpressionQualification('Requester', 'Functional Roles', "like", 'NAMED_LIST', "Case Agent");
            let selectedExpx = await slmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Requester > Functional Roles" + "'" + "LIKE" + '"%' + "Case Agent" + '%"';
            expect(selectedExpx).toEqual(expectedSelectedExp);
            await slmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("3");
            await serviceTargetConfig.selectMeasurement();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "status", "=", "STATUS", "Assigned");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "status", "=", "STATUS", "Resolved");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "status", "=", "STATUS", "Pending");
            await serviceTargetConfig.clickOnSaveSVTButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
        });

        it('[3815]:Create a Case and check if second svt is attached', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('qtao');
            await createCasePage.setSummary('Case for SVT creation second');
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

        it('[3815]:Create a Case and check if second svt is attached', async () => {
            await browser.sleep(15000);
            await navigationPage.gotoCaseConsole();
            await caseConsolePage.searchAndOpenCase(caseId);
            expect(await slmProgressBar.isSLAProgressBarWarningIconDisplayed()).toBe(true); //green
            expect(await viewCasePage.getSlaBarColor()).toBe('rgba(241, 181, 33, 1)'); //orange
            await browser.sleep(40000);
            await navigationPage.gotoCaseConsole();
            await caseConsolePage.searchAndOpenCase(caseId);
            expect(await slmProgressBar.isSLAProgressBarMissedGoalIconDisplayed()).toBe(true); //green
            expect(await viewCasePage.getSlaBarColor()).toBe('rgba(248, 50, 0, 1)');
        });

        it('[3815]:Create a Case and check if svt is not attached', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('frieda');
            await createCasePage.setSummary('Case for SVT creation second');
            await createCasePage.selectCategoryTier1('Employee Relations');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            caseId = await viewCasePage.getCaseID();
            await browser.sleep(2000);
            expect(await slmProgressBar.isSLAProgressBarInProcessIconDisplayed()).toBe(false); //green
        });

    });

    describe('[3820]:SVT created for Company associations and SVT get links to a Case', async () => {
        let caseId = undefined;
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteServiceTargets();
        });

        it('[3820]:Create a SVT for second level association "Company" ', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', BWF_PAGE_TITLES.SERVICE_LEVEL_MANAGEMENT.SERVICE_TARGET);
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');

            //Verify second level association for Company
            await slmExpressionBuilder.selectSecondLevelExpressionQualification('Company', 'Type', "like", "Operating Organization","Direct");
            let selectedExpx = await slmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Company > Type" + "'" + "LIKE" + '"%' + "Operating Organization" + '%"'
            expect(selectedExpx).toEqual(expectedSelectedExp);
            await slmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("3");
            await serviceTargetConfig.selectMeasurement();
            await slmExpressionBuilder.clickOnAddExpressionButton('SELECTION');
            await serviceTargetConfig.selectExpressionForMeasurement(0, "Status", "=","Assigned", "Direct");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "Status", "=","Resolved", "Direct");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "Status", "=","Pending", "Direct");
            await serviceTargetConfig.clickOnSaveSVTButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
        });

        it('[3820]:Create a case and verify if SVT is attached to the case', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Qiang');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.selectCategoryTier1('Employee Relations');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await browser.sleep(31000);
            caseId = await viewCasePage.getCaseID();
            expect(await slmProgressBar.isSLAProgressBarInProcessIconDisplayed()).toBe(true); //green
            expect(await viewCasePage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)'); //green
            await browser.sleep(90000);
        });

        it('[3820]:verify different SVT statuses to the case', async () => {
            await browser.sleep(15000);
            await navigationPage.gotoCaseConsole();
            await caseConsolePage.searchAndOpenCase(caseId);
            expect(await slmProgressBar.isSLAProgressBarWarningIconDisplayed()).toBe(true); //green
            await browser.sleep(40000);
            await navigationPage.gotoCaseConsole();
            await caseConsolePage.searchAndOpenCase(caseId);
            expect(await slmProgressBar.isSLAProgressBarMissedGoalIconDisplayed()).toBe(true); //green
            expect(await viewCasePage.getSlaBarColor()).toBe('rgba(248, 50, 0, 1)');
        });
    });

    describe('[3819]:SVT created for Case Site associations and SVT get links to a Case', async () => {
        let caseId = undefined;
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteServiceTargets();
        });

        it('[3819]:Create a SVT for second level association "Case Site" ', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', BWF_PAGE_TITLES.SERVICE_LEVEL_MANAGEMENT.SERVICE_TARGET);
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');
            await slmExpressionBuilder.selectSecondLevelExpressionQualification('Case Site', 'Country', "=", "Canada","Search");
            let selectedExpx = await slmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Case Site > Country" + "'" + "=" + '"' + "Canada" + '"'
            console.log(selectedExpx);
            expect(selectedExpx).toEqual(expectedSelectedExp);
            await slmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("3");
            await serviceTargetConfig.selectMeasurement();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "Status", "=","Assigned", "Direct");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "Status", "=","Resolved", "Direct");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "Status", "=","Pending", "Direct");
            await serviceTargetConfig.clickOnSaveSVTButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
        });

        it('[3819]:Create a case and verify if SVT attached to the case', async () => {
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
            await browser.sleep(90000);
        });

        it('[3819]:Verify different SVT statuses attached to the case', async () => {
            await navigationPage.gotoCaseConsole();
            await browser.sleep(35000);
            await caseConsolePage.searchAndOpenCase(caseId);
            expect(await slmProgressBar.isSLAProgressBarWarningIconDisplayed()).toBe(true); //green
            await browser.sleep(30000);
            await navigationPage.gotoCaseConsole();
            await caseConsolePage.searchAndOpenCase(caseId);
            expect(await slmProgressBar.isSLAProgressBarMissedGoalIconDisplayed()).toBe(true); //green
            expect(await viewCasePage.getSlaBarColor()).toBe('rgba(248, 50, 0, 1)');
        });

        it('[3819]:Create a case and verify if SVT is not attached to the case', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('qtao');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.selectCategoryTier1('Employee Relations');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            caseId = await viewCasePage.getCaseID();
            expect(await slmProgressBar.isSLAProgressBarInProcessIconDisplayed()).toBe(false); //green
        });
    });

    describe('[3818]:SVT created for Assigned Company associations and SVT get links to a Case', async () => {
        let caseId = undefined;
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            let organizationData = {
                "abbreviation": "ptramco"
            }
            await apiHelper.updateFoundationEntity('Organization', 'Petramco', organizationData);
            await apiHelper.deleteServiceTargets();
        });

        it('[3818]:Create a SVT for second level association "Assigned Company" ', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', BWF_PAGE_TITLES.SERVICE_LEVEL_MANAGEMENT.SERVICE_TARGET);
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');
            await slmExpressionBuilder.selectSecondLevelExpressionQualification('Assigned Company', 'Abbreviation', "=", 'TEXT', "ptramco");
            let selectedExpx = await slmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Assigned Company > Abbreviation" + "'" + "=" + '"' + "ptramco" + '"'
            expect(selectedExpx).toEqual(expectedSelectedExp);
            await slmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("3");
            await serviceTargetConfig.selectMeasurement();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "Status", "=","Assigned", "Direct");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "Status", "=","Resolved", "Direct");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "Status", "=","Pending", "Direct");
            await serviceTargetConfig.clickOnSaveSVTButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
        });

        it('[3818]:Create a case and verify if SVT attached to the case', async () => {
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
            await browser.sleep(90000);
        });

        it('[3818]:Verify different SVT statuses attached to the case', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsolePage.searchAndOpenCase(caseId);
            expect(await slmProgressBar.isSLAProgressBarWarningIconDisplayed()).toBe(true); //green
            expect(await viewCasePage.getSlaBarColor()).toBe('rgba(241, 181, 33, 1)'); //orange
            await browser.sleep(65000);
            await navigationPage.gotoCaseConsole();
            await caseConsolePage.searchAndOpenCase(caseId);
            expect(await slmProgressBar.isSLAProgressBarMissedGoalIconDisplayed()).toBe(true); //green
            expect(await viewCasePage.getSlaBarColor()).toBe('rgba(248, 50, 0, 1)');
        });
    });

    describe('[3817]:SVT created for Requester associations and SVT get links to a Case', async () => {
        let caseId = undefined;
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteServiceTargets();
        });

        it('[3817]:Create a SVT for Second level association "Requester"', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', BWF_PAGE_TITLES.SERVICE_LEVEL_MANAGEMENT.SERVICE_TARGET);
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');
            await slmExpressionBuilder.selectSecondLevelExpressionQualification('Requester', 'Email', "=", 'TEXT', "qdu@petramco1.com");
            let selectedExpx = await slmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Requester > Email" + "'" + "=" + '"' + "qdu@petramco1.com" + '"';
            expect(selectedExpx).toEqual(expectedSelectedExp);
            await slmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("3");
            await serviceTargetConfig.selectMeasurement();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "Status", "=","Assigned", "Direct");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "Status", "=","Resolved", "Direct");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "Status", "=","Pending", "Direct");
            await serviceTargetConfig.clickOnSaveSVTButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
        });

        it('[3817]:Create a case and verify if SVT is attached to the case', async () => {
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
            await browser.sleep(90000);
        });

        it('[3817]:Verify different SVT statuses attached to the case', async () => {
            await browser.sleep(30000);
            await navigationPage.gotoCaseConsole();
            await caseConsolePage.searchAndOpenCase(caseId);
            expect(await slmProgressBar.isSLAProgressBarWarningIconDisplayed()).toBe(true); //green
            expect(await viewCasePage.getSlaBarColor()).toBe('rgba(241, 181, 33, 1)'); //orange
            await browser.sleep(40000);
            await navigationPage.gotoCaseConsole();
            await caseConsolePage.searchAndOpenCase(caseId);
            expect(await slmProgressBar.isSLAProgressBarMissedGoalIconDisplayed()).toBe(true); //green
            expect(await viewCasePage.getSlaBarColor()).toBe('rgba(248, 50, 0, 1)');
        });
    });

    describe('[3814]:Check SVT is attached to a Case and later Associations are updated', async () => {
        let caseId = undefined;
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteServiceTargets();
        });

        it('[3814]:Create a SVT for Second level association "Requester"', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', BWF_PAGE_TITLES.SERVICE_LEVEL_MANAGEMENT.SERVICE_TARGET);
            await serviceTargetConfig.createServiceTargetConfig('SVT from Protractor', 'Petramco', 'Case Management');
            await slmExpressionBuilder.selectSecondLevelExpressionQualification('Requester', 'Email', "=", 'TEXT', "qdu@petramco1.com");
            let selectedExpx = await slmExpressionBuilder.getSelectedExpression();
            let expectedSelectedExp = "'" + "Requester > Email" + "'" + "=" + '"' + "qdu@petramco1.com" + '"'
            expect(selectedExpx).toEqual(expectedSelectedExp);
            await slmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.selectGoal("3");
            await serviceTargetConfig.selectMeasurement();
            await serviceTargetConfig.selectExpressionForMeasurement(0, "Status", "=","Assigned", "Direct");
            await serviceTargetConfig.selectExpressionForMeasurement(1, "Status", "=","Resolved", "Direct");
            await serviceTargetConfig.selectExpressionForMeasurement(2, "Status", "=","Pending", "Direct");
            await serviceTargetConfig.clickOnSaveSVTButton();
            expect(await utilityCommon.isPopUpMessagePresent('Record has been registered successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
        });

        it('[3814]:Create a case and verify if SVT attached to the case', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('Qiang');
            await createCasePage.setSummary('Case for SVT creation');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            caseId = await viewCasePage.getCaseID();
            expect(await slmProgressBar.isSLAProgressBarInProcessIconDisplayed()).toBe(true); //green
            expect(await viewCasePage.getSlaBarColor()).toBe('rgba(137, 195, 65, 1)'); //green    
        });

        it('[3814]:SVT Configurations are updated once SVT attached to the case', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', BWF_PAGE_TITLES.SERVICE_LEVEL_MANAGEMENT.SERVICE_TARGET);
            await utilityGrid.searchAndOpenHyperlink('SVT from Protractor');
            await serviceTargetConfig.clickBuildExpressionLink();
            await slmExpressionBuilder.selectOperator('and');
            await slmExpressionBuilder.selectExpressionQualification('Priority', '=','Low',"Direct");
            await slmExpressionBuilder.clickOnSaveExpressionButton();
            await serviceTargetConfig.clickOnSaveSVTButton();
            expect(await utilityCommon.isPopUpMessagePresent('Record has been updated successfully')).toBeTruthy('Record saved successfully confirmation message not displayed.');
        });

        it('[3814]:Create a case and verify if SVT attached to the case', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsolePage.searchAndOpenCase(caseId);
            expect(await slmProgressBar.isSLAProgressBarDisplayed()).toBe(true); //green
        });
    });
});
