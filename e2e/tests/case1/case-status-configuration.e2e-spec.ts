import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import caseConsolePo from '../../pageobject/case/case-console.po';
import previewCasePo from '../../pageobject/case/case-preview.po';
import createCasePo from '../../pageobject/case/create-case.po';
import viewCasePo from '../../pageobject/case/view-case.po';
import assignmentBladePO from '../../pageobject/common/change-assignment-blade.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import statusConfigPo from '../../pageobject/settings/common/status-config.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

describe('Case Status Configuration', () => {
    let flowsetData;
    let flowsetName: string;

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await apiHelper.apiLogin('tadmin');
        const personDataFile = require('../../data/ui/foundation/person.ui.json');
        let personData1 = personDataFile['PhytoCaseAdmin1'];
        await apiHelper.createNewUser(personData1);
        await apiHelper.associatePersonToSupportGroup(personData1.userId, 'Phyto Support Group1');
        await apiHelper.associatePersonToCompany(personData1.userId, 'Phyto');

        let personData2 = personDataFile['PhytoCaseAdmin2'];
        await apiHelper.createNewUser(personData2);
        await apiHelper.associatePersonToSupportGroup(personData2.userId, 'Phyto Support Group1');
        await apiHelper.associatePersonToCompany(personData2.userId, 'Phyto');

        let personData3 = personDataFile['PhytoKnowledgeUser'];
        await apiHelper.createNewUser(personData3);
        await apiHelper.associatePersonToSupportGroup(personData3.userId, 'Phyto Support Group1');
        await apiHelper.associatePersonToCompany(personData3.userId, 'Phyto');

        //Wait to reflect the user created above
        await browser.sleep(12000);
        await loginPage.login('anehra@petramco.com', 'Password_1234');
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //asahitya
    it('[DRDMV-13632]: Verify User not able to delete mandatory status for Knowledge', async () => {
        await navigationPage.signOut()
        await loginPage.login('stendulkar@petramco.com', 'Password_1234');
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Knowledge Management--Status Configuration', 'Configure Knowledge Status Transition - Business Workflows');
        await statusConfigPo.setCompanyDropdown('Phyto', 'knowledge');
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.addCustomStatus("In Progress", "Draft", "Custom");
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickEditStatus("Draft");
        expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickEditStatus("Progress");
        expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickEditStatus("SME"); //Need to change
        expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickEditStatus("Approval");
        expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickEditStatus("Closed");
        expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickEditStatus("Published");
        expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickEditStatus("Canceled");
        expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickEditStatus("Retired");
        expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickEditStatus("Custom");
        expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeTruthy();
        await statusConfigPo.clickOnDeleteButton();
        await utilCommon.clickOnWarningOk();
        await statusConfigPo.clickOnBackButton();
    }, 300 * 1000);

    //asahitya
    it('[DRDMV-13635]:Verify UI for Knowledge status configuration', async () => {
        try {
            await navigationPage.signOut()
            await loginPage.login('stendulkar@petramco.com', 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Status Configuration', 'Configure Knowledge Status Transition - Business Workflows');
            expect(await statusConfigPo.getTitleValue('knowledge')).toBe('Knowledge Status Configuration');
            expect(await statusConfigPo.isCompanyRequiredText('knowledge')).toBeTruthy();
            expect(await statusConfigPo.getDefaultCompanyValue()).toBe('- Global -');
            expect(await statusConfigPo.getStatusLifeCycle()).toBe('Status Lifecycle for - Global -');
            await statusConfigPo.setCompanyDropdown("Phyto", 'knowledge');
            expect(await statusConfigPo.isEditLifeCycleBtnDisabled()).toBeFalsy('Button is disabled');
            await statusConfigPo.clickEditLifeCycleLink();
            await statusConfigPo.clickEditStatus("Canceled");
            await statusConfigPo.clickOnCancelButton();
        }
        catch (ex) {
            throw ex;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('anehra@petramco.com', 'Password_1234');
        }
    });

    //asahitya
    it('[DRDMV-13617]: Verify User not able to delete mandatory status for case', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        flowsetData = require('../../data/ui/case/flowset.ui.json');
        flowsetName = await flowsetData['flowsetPhytoFields'].flowsetName + randomStr;
        flowsetData['flowsetPhytoFields'].flowsetName = flowsetName;
        await apiHelper.apiLoginWithCredential('anehra@petramco.com', 'Password_1234');
        await apiHelper.createNewFlowset(flowsetData['flowsetPhytoFields']);

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Status Configuration', 'Configure Case Status Transition - Business Workflows');
        await statusConfigPo.setCompanyDropdown('Phyto', 'case');
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickEditStatus("New");
        expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickEditStatus("Progress");
        expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickEditStatus("Assigned");
        expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickEditStatus("Resolved");
        expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickEditStatus("Closed");
        expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickEditStatus("Pending");
        expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickEditStatus("Canceled");
        expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
        await statusConfigPo.clickOnBackButton();

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Status Configuration', 'Configure Case Status Transition - Business Workflows');
        await statusConfigPo.setCompanyDropdown('Phyto', 'case');
        await statusConfigPo.selectFlowset(flowsetName);
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickEditStatus("New");
        expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickEditStatus("Progress");
        expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickEditStatus("Assigned");
        expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickEditStatus("Resolved");
        expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickEditStatus("Closed");
        expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickEditStatus("Pending");
        expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickEditStatus("Canceled");
        expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
        await statusConfigPo.clickOnBackButton();
        await utilityCommon.switchToDefaultWindowClosingOtherTabs();
    }, 340 * 1000);

    //asahitya
    it('[DRDMV-13615]:Verify UI for case status configuration', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Status Configuration', 'Configure Case Status Transition - Business Workflows');
        expect(await statusConfigPo.getTitleValue('case')).toBe('Case Status Configuration');
        expect(await statusConfigPo.isCompanyRequiredText('case')).toBeTruthy();
        expect(await statusConfigPo.getDefaultCompanyValue()).toBe('- Global -');
        expect(await statusConfigPo.getStatusLifeCycle()).toBe('Status Lifecycle for - Global -');
        await statusConfigPo.setCompanyDropdown("Phyto", 'case');
        await statusConfigPo.selectFlowset(flowsetName);
        expect(await statusConfigPo.getStatusLifeCycle()).toBe('Status Lifecycle for Phyto - ' + flowsetName);
        expect(await statusConfigPo.isEditLifeCycleBtnDisabled()).toBeFalsy('Button is disabled');
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickEditStatus("Canceled");
        await statusConfigPo.clickOnCancelButton();
        await utilityCommon.switchToDefaultWindowClosingOtherTabs();
    });

    //asahitya
    it('[DRDMV-13899]:Verify case created prior to label change will reflect new status label changes', async () => {
        await navigationPage.gotoCreateCase();
        await createCasePo.selectRequester('zkhan');
        await createCasePo.setSummary("DRDMV-13899 before configuration");
        await createCasePo.clickChangeAssignmentButton();
        await assignmentBladePO.selectCompany('Phyto');
        await assignmentBladePO.selectBusinessUnit('Phyto Support Org1');
        await assignmentBladePO.selectSupportGroup('Phyto Support Group1');
        await assignmentBladePO.selectAssignee('Zaheer Khan');
        await assignmentBladePO.clickOnAssignButton();
        await createCasePo.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        let caseId1 = await viewCasePo.getCaseID();

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Status Configuration', 'Configure Case Status Transition - Business Workflows');
        await statusConfigPo.setCompanyDropdown("Phyto", 'case');
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickEditStatus("Assigned");
        await statusConfigPo.renameExistingStatus('Staged');
        await utilityCommon.switchToDefaultWindowClosingOtherTabs();

        await navigationPage.gotoCreateCase();
        await createCasePo.selectRequester('zkhan');
        await createCasePo.setSummary("DRDMV-13899 after configuration");
        await createCasePo.clickAssignToMeButton();
        await createCasePo.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        expect(await viewCasePo.getTextOfStatus()).toBe("Staged");

        await navigationPage.gotoCaseConsole();
        await utilityGrid.clearFilter();
        await caseConsolePo.searchAndOpenCase(caseId1);
        expect(await viewCasePo.getTextOfStatus()).toBe("Staged");

        //back to default
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Status Configuration', 'Configure Case Status Transition - Business Workflows');
        await statusConfigPo.setCompanyDropdown("Phyto", 'case');
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickEditStatus("Staged");
        await statusConfigPo.renameExistingStatus('Assigned');
    }, 420 * 1000);

    //asahitya  
    it('[DRDMV-13631]: Verify User not able to delete mandatory status for task', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Status Configuration', 'Configure Task Status Tranistions - Business Workflows');
        await statusConfigPo.setCompanyDropdown('Phyto', 'task');
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.addCustomStatus("Staged", "Assigned", "customStatus");
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickEditStatus("Staged");
        expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy('Staged status delete button is enabled');
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickEditStatus("Progress");
        expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy('In Progress status delete button is enabled');
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickEditStatus("Assigned");
        expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy('Assigned status delete button is enabled');
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickEditStatus("Completed");
        expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy('Completed status delete button is enabled');
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickEditStatus("Closed");
        expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy('Closed status delete button is enabled');
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickEditStatus("Pending");
        expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy('Pending status delete button is enabled');
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickEditStatus("Canceled");
        expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy('Canceled status delete button is enabled');
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickEditStatus("Failed");
        expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy('Failed status delete button is enabled');
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickEditStatus("customStatus");
        expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeTruthy('customStatus status delete button is enabled');
        await statusConfigPo.clickOnDeleteButton();
        await utilCommon.clickOnWarningOk();
        await statusConfigPo.clickOnBackButton();
    }, 270 * 1000);

    //asahitya
    it('[DRDMV-13624]:Verify UI for Task status configuration', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Status Configuration', 'Configure Task Status Tranistions - Business Workflows');
        expect(await statusConfigPo.getTitleValue('task')).toBe('Task Status Configuration');
        expect(await statusConfigPo.isCompanyRequiredText('task')).toBeTruthy();
        expect(await statusConfigPo.getDefaultCompanyValue()).toBe('- Global -');
        expect(await statusConfigPo.getStatusLifeCycle()).toBe('Status Lifecycle for - Global -');
        await statusConfigPo.setCompanyDropdown("Phyto", 'task');
        expect(await statusConfigPo.isEditLifeCycleBtnDisabled()).toBeFalsy('Button is disabled');
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickEditStatus("Canceled");
        await statusConfigPo.clickOnCancelButton();
        await utilityCommon.switchToDefaultWindowClosingOtherTabs();
    });

    //asahitya
    it('[DRDMV-13639,DRDMV-13710]:Verify Custom status operations for case', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Status Configuration', 'Configure Case Status Transition - Business Workflows');
        await statusConfigPo.setCompanyDropdown("Phyto", 'case');
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.addCustomStatus("New", "Assigned", "customStatus");
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();

        await statusConfigPo.clickEditStatus("customStatus");
        await statusConfigPo.clickOnMandatoryCheckbox();
        await statusConfigPo.saveSetting();
        expect(await utilCommon.getAllPopupMsg()).toContain('The Status Reason Mandatory check box is selected. Add a status reason or clear the check box.');
        await statusConfigPo.setStatusReason("customStatus required");
        await statusConfigPo.clickOnBackButton();
        //delete custom status
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickEditStatus("customStatus");
        expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeTruthy();
        await statusConfigPo.clickOnDeleteButton();
        await utilCommon.clickOnWarningOk();
        await statusConfigPo.clickOnBackButton();

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Status Configuration', 'Configure Case Status Transition - Business Workflows');
        await statusConfigPo.setCompanyDropdown("Phyto", 'case');
        await statusConfigPo.selectFlowset(flowsetName);
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.addCustomStatus("New", "Assigned", "customStatus");
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickEditStatus("customStatus");
        await statusConfigPo.clickOnMandatoryCheckbox();
        await statusConfigPo.saveSetting();
        expect(await utilCommon.getAllPopupMsg()).toContain('The Status Reason Mandatory check box is selected. Add a status reason or clear the check box.');
        await statusConfigPo.setStatusReason("customStatus required");
        await statusConfigPo.clickOnBackButton();
        //delete custom status
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickEditStatus("customStatus");
        expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeTruthy();
        await statusConfigPo.clickOnDeleteButton();
        await utilCommon.clickOnWarningOk();
        await statusConfigPo.clickOnBackButton();
        await utilityCommon.switchToDefaultWindowClosingOtherTabs();
    }, 360 * 1000);

    it('[DRDMV-13625]:Verify Custom status operations for Task', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Status Configuration', 'Configure Task Status Tranistions - Business Workflows');
        await statusConfigPo.setCompanyDropdown('Phyto', 'task');
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.addCustomStatus("Assigned", "In Progress", "customStatus");
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickEditStatus("customStatus");
        await statusConfigPo.clickOnMandatoryCheckbox();
        await statusConfigPo.saveSetting();
        expect(await utilCommon.getAllPopupMsg()).toContain('The Status Reason Mandatory check box is selected. Add a status reason or clear the check box.');
        await statusConfigPo.setStatusReason("customStatus required");
        await statusConfigPo.clickOnBackButton();
        //delete Custom Status
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickEditStatus("customStatus");
        expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeTruthy();
        await statusConfigPo.clickOnDeleteButton();
        await utilCommon.clickOnWarningOk();
        await statusConfigPo.clickEditStatus("Staged");
        await statusConfigPo.updateExistingStatusName('Updated');
        await statusConfigPo.cancelSettingChange();
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickEditStatus("Staged");
        await statusConfigPo.renameExistingStatus('Update');
    });
});
