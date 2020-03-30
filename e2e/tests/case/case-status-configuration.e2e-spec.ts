import { browser } from "protractor";
import createCasePo from '../../pageobject/case/create-case.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import statusConfigPo from '../../pageobject/settings/common/status-config.po';
import viewCasePo from '../../pageobject/case/view-case.po';
import caseConsolePo from '../../pageobject/case/case-console.po';
import utilCommon from '../../utils/util.common';
import apiHelper from '../../api/api.helper';

describe('Case Status Configuration', () => {
    let flowsetData;
    let flowsetName: string;

    beforeAll(async () => {
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
        await loginPage.login('qkatawazi');
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        flowsetData = require('../../data/ui/case/flowset.ui.json');
        flowsetName = await flowsetData['flowsetGlobalFields'].flowsetName + randomStr;
        flowsetData['flowsetGlobalFields'].flowsetName = flowsetName;
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createNewFlowset(flowsetData['flowsetGlobalFields']);
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    afterEach(async () => {
        await browser.refresh();
    });

    //ankagraw
    it('[DRDMV-13617]: Verify User not able to delete mandatory status for case', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Status Configuration', 'Configure Case Status Transition - Business Workflows');
        await statusConfigPo.setCompanyDropdown('Petramco', 'case');
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickonEditStatus("New");
        expect(statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickonEditStatus("Progress");
        expect(statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickonEditStatus("Assigned");
        expect(statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickonEditStatus("Resolved");
        expect(statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickonEditStatus("Closed");
        expect(statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickonEditStatus("Pending");
        expect(statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickonEditStatus("Canceled");
        expect(statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
        await statusConfigPo.clickOnBackButton();

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Status Configuration', 'Configure Case Status Transition - Business Workflows');
        await statusConfigPo.setCompanyDropdown('Petramco', 'case');
        await statusConfigPo.selectFlowset(flowsetName);
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickonEditStatus("New");
        expect(statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickonEditStatus("Progress");
        expect(statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickonEditStatus("Assigned");
        expect(statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickonEditStatus("Resolved");
        expect(statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickonEditStatus("Closed");
        expect(statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickonEditStatus("Pending");
        expect(statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickonEditStatus("Canceled");
        expect(statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
        await statusConfigPo.clickOnBackButton();
    }, 180 * 1000);

    //ankagraw
    it('[DRDMV-13615]:Verify UI for case status configuration', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Status Configuration', 'Configure Case Status Transition - Business Workflows');
        expect(await statusConfigPo.getTitleValue('case')).toBe('Case Status Configuration');
        expect(await statusConfigPo.isCompanyRequiredText('case')).toBeTruthy();
        expect(await statusConfigPo.getDefaultCompanyValue()).toBe('- Global -');
        expect(await statusConfigPo.getStatusLifeCycle()).toBe('Status Lifecycle for - Global -');
        await statusConfigPo.setCompanyDropdown("Petramco", 'case');
        await statusConfigPo.selectFlowset(flowsetName);
        expect(await statusConfigPo.getStatusLifeCycle()).toBe('Status Lifecycle for Petramco - ' + flowsetName);
        expect(await statusConfigPo.isEditLifeCycleBtnDisabled()).toBeFalsy('Button is disabled');
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickonEditStatus("Canceled");
        await statusConfigPo.clickOnCancelButton();
    });

    //ankagraw
    it('[DRDMV-13899]:Verify case created prior to label change will reflect new status label changes', async () => {
        await navigationPage.gotCreateCase();
        await createCasePo.selectRequester('adam');
        await createCasePo.setSummary("DRDMV-13899 before configuration");
        await createCasePo.clickSaveCaseButton();
        await createCasePo.clickGoToCaseButton();
        let caseId1 = await viewCasePo.getCaseID();

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Status Configuration', 'Configure Case Status Transition - Business Workflows');
        await statusConfigPo.setCompanyDropdown("Petramco", 'case');
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickonEditStatus("Assigned");
        await statusConfigPo.renameExistingStatus('Staged');

        await navigationPage.gotCreateCase();
        await createCasePo.selectRequester('adam');
        await createCasePo.setSummary("DRDMV-13899 after configuration");
        await createCasePo.clickSaveCaseButton();
        await createCasePo.clickGoToCaseButton();
        expect(await viewCasePo.getTextOfStatus()).toBe("Staged");

        await navigationPage.gotoCaseConsole();
        await caseConsolePo.searchAndOpenCase(caseId1);
        expect(await viewCasePo.getTextOfStatus()).toBe("Staged");

        //back to default
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Status Configuration', 'Configure Case Status Transition - Business Workflows');
        await statusConfigPo.setCompanyDropdown("Petramco", 'case');
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickonEditStatus("Staged");
        await statusConfigPo.renameExistingStatus('Assigned');
    });

    //ankagraw
    it('[DRDMV-13631]: Verify User not able to delete mandatory status for task', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Status Configuration', 'Configure Task Status Tranistions - Business Workflows');
        await statusConfigPo.setCompanyDropdown('Petramco', 'task');
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.addCustomStatus("Staged", "Assigned", "customStatus");
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickonEditStatus("Staged");
        expect(statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickonEditStatus("Progress");
        expect(statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickonEditStatus("Assigned");
        expect(statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickonEditStatus("Completed");
        expect(statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickonEditStatus("Closed");
        expect(statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickonEditStatus("Pending");
        expect(statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickonEditStatus("Canceled");
        expect(statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickonEditStatus("Failed");
        expect(statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickonEditStatus("customStatus");
        expect(statusConfigPo.isDeleteButtonDisplayed()).toBeTruthy();
        await statusConfigPo.clickOnDeleteButton();
        await utilCommon.clickOnWarningOk();
        await statusConfigPo.clickOnBackButton();
    });
});