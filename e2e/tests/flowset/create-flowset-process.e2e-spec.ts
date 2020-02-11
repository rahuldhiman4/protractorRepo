import { browser } from "protractor";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import consoleFlowsetProcessLibrary from '../../pageobject/flowset/console-process-library-config.po';
import createFlowsetProcessLibrary from '../../pageobject/flowset/create-register-process-config.po';
import editFlowsetProcessLibrary from '../../pageobject/flowset/edit-register-process-config.po';
import utilCommon from '../../utils/util.common';
import consoleCasetemplatePo from '../../pageobject/settings/case-management/console-casetemplate.po';
import createCaseTemplate from "../../pageobject/settings/case-management/create-casetemplate.po";
import viewCaseTemplate from "../../pageobject/settings/case-management/view-casetemplate.po";
import isWorkSpace from '../../pageobject/common/is.workspace.po';
import apiHelper from 'e2e/api/api.helper';
import { SOCIAL_SERVICE_PROCESS } from 'e2e/data/ui/flowset/process-for-flowset.data.ui';
import apiCoreUtil from 'e2e/api/api.core.util';
var CaseManagementService = "Case Management Service";
describe('Create Process in Flowset', () => {
    beforeAll(async () => {
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    afterEach(async () => {
        await browser.refresh();
        await utilCommon.waitUntilSpinnerToHide();
    });

    //ankagraw
    it('[DRDMV-6216]: [Flowsets] Create new Register Process', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let drpDownStatus: string[] = ['Draft', 'Active', 'Inactive'];
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Process Library', 'Process Library - Console - Business Workflows');
        await expect(consoleFlowsetProcessLibrary.isRegisterProcessEnable()).toBeTruthy("Add flowset register Process is disabled");
        await consoleFlowsetProcessLibrary.clickOnRegisterProcess();

        //verify the Titles
        await expect(createFlowsetProcessLibrary.isCompanyTitleDisplayed('Company')).toBeTruthy(" Company Title is not present");
        await expect(createFlowsetProcessLibrary.isProcessNameTitleDisplayed('Process Name')).toBeTruthy(" Process Name Title is not present");
        await expect(createFlowsetProcessLibrary.isDescriptionTitleDisplayed('Description')).toBeTruthy(" Description Title is not present");
        await expect(createFlowsetProcessLibrary.isStatusTitleDisplayed('Status')).toBeTruthy(" Status Title is not present");
        await expect(createFlowsetProcessLibrary.isProcessAliasTitleDisplayed('Process Alias Name')).toBeTruthy(" Process Alias Title is not present");
        await expect(createFlowsetProcessLibrary.isApplicationTitleDisplayed('Application Services Library')).toBeTruthy(" Application Service Title is not present");
        await createFlowsetProcessLibrary.clickOnStatus();
        await createFlowsetProcessLibrary.statusDropDownValuesDisplayed(drpDownStatus);

        //verify the Required Fields
        await expect(createFlowsetProcessLibrary.isCompanyRequiredTextDisplayed()).toBe("required", " Company Required text not present ");
        await expect(createFlowsetProcessLibrary.isProcessRequiredTextDisplayed()).toBe("required", " Process Name Required text not present ");
        await expect(createFlowsetProcessLibrary.isDescriptionRequiredTextDisplayed()).toBe("required", " Description Required text not present ");
        await expect(createFlowsetProcessLibrary.isStatusRequiredTextDisplayed()).toBe("required", " Status Required text not present ");
        await expect(createFlowsetProcessLibrary.isProcessAliasRequiredTextDisplayed()).toBe("required", " Process Alias Required text not present ");
        await expect(createFlowsetProcessLibrary.isApplicationServiceRequiredTextDisplayed()).toBe("required", " Application Required text not present ");
        await createFlowsetProcessLibrary.clickSaveButton();
        await expect(createFlowsetProcessLibrary.isErrorMsgPresent()).toBeTruthy("Error msg not present");

        //add Flowsets
        await createFlowsetProcessLibrary.selectCompany('Petramco');
        await createFlowsetProcessLibrary.selectApplicationService("Assignment");
        await createFlowsetProcessLibrary.selectProcessName('Assignment Process');
        await createFlowsetProcessLibrary.setAliasName("Alias" + randomStr);
        await createFlowsetProcessLibrary.setDescription("description" + randomStr);
        await createFlowsetProcessLibrary.selectStatus("Active");
        await createFlowsetProcessLibrary.clickSaveButton();
    });

    it('[DRDMV-1269,DRDMV-1295]: [Flowsets] Search Register Process on Console', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');

        await apiHelper.apiLogin('tadmin');
        let social_Service = SOCIAL_SERVICE_PROCESS;
        let social_Service_Process = social_Service.name + randomStr;
        social_Service.name = social_Service_Process;
        await apiCoreUtil.createProcess(social_Service);
        
        let processLibConfData1 = {
            applicationServicesLib: "com.bmc.dsm.social-lib",
            processName: social_Service_Process,
            processAliasName: `Process${randomStr}`,
            company: "Petramco",
            description: `description${randomStr}`,
            status: "Active"
        }
        await apiHelper.createProcessLibConfig(processLibConfData1);
        
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Process Library', 'Process Library - Console - Business Workflows');
        await consoleFlowsetProcessLibrary.searchAndSelectFlowset(`Process${randomStr}`);
        await editFlowsetProcessLibrary.setAliasName('UpdateAlias' + randomStr);
        await editFlowsetProcessLibrary.setDescription('UpdataDescription' + randomStr);
        await editFlowsetProcessLibrary.selectStatus('Draft');
        await editFlowsetProcessLibrary.clickOnSaveButton();
        await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Process Library', 'Process Library - Console - Business Workflows');
        await expect(editFlowsetProcessLibrary.isAliasNamePresentOnGrid('UpdateAlias' + randomStr)).toBeTruthy('UpdateAlias' + randomStr + "name is not present");
        await expect(editFlowsetProcessLibrary.getDescription('UpdataDescription' + randomStr)).toBe('UpdataDescription' + randomStr);
        await expect(editFlowsetProcessLibrary.isProcessPresentOnGrid('pbbkbk')).toBeTruthy('Unnecessary register is not display');
        await apiHelper.apiLogin('tadmin');
        let processName = 'com.bmc.dsm.social-lib:Social - Sample Activity Update By User';
        await apiHelper.deleteFlowsetProcessLibConfig(processName);
    });

    //ankagraw
    it('[DRDMV-7607]: [Permissions] Process Library access', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await apiHelper.apiLogin('tadmin');
        let social_Service = SOCIAL_SERVICE_PROCESS;
        let social_Service_Process = social_Service.name + randomStr;
        social_Service.name = social_Service_Process;
        await apiCoreUtil.createProcess(social_Service);
        let processLibConfData1 = {
            applicationServicesLib: "com.bmc.dsm.social-lib",
            processName: social_Service_Process,
            processAliasName: `Process${randomStr}`,
            company: "Petramco",
            description: `description${randomStr}`,
            status: "Active"
        }
        await apiHelper.createProcessLibConfig(processLibConfData1);

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Process Library', 'Process Library - Console - Business Workflows');
        await consoleFlowsetProcessLibrary.searchAndSelectFlowset(`Process${randomStr}`);
        await editFlowsetProcessLibrary.setDescription('UpdataDescription' + randomStr);
        await editFlowsetProcessLibrary.clickOnSaveButton();
        await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Process Library', 'Process Library - Console - Business Workflows');
        await expect(editFlowsetProcessLibrary.isAliasNamePresentOnGrid('UpdateAliasvbv5')).toBeTruthy('UpdateAliasvbv5' + "Name is not present");
        await navigationPage.signOut();
        await loginPage.login('gwixillian');
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Process Library', 'Process Library - Console - Business Workflows');
        await expect(editFlowsetProcessLibrary.isAliasNamePresentOnGrid('UpdateAliasvbv5')).toBeFalsy('UpdateAliasvbv5' + "Name is present");
        await navigationPage.signOut();
        await loginPage.login('qtao');
        await navigationPage.gotoSettingsPage();
        await expect(navigationPage.isSettingMenuPresent('Manage Flowsets')).toBeFalsy("Setting menu present");
        await apiHelper.apiLogin('tadmin');
		let processName = 'com.bmc.dsm.social-lib:Social - Sample Activity Update By User';
        await apiHelper.deleteFlowsetProcessLibConfig(processName);
    });

    it('[DRDMV-6214]: [Flowsets] Flowsets Console verification', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let availableValues: string[] = ['Application', 'Company', 'ID', 'Process Alias Name', 'Process Description', 'Process Name', 'Status'];
        await apiHelper.apiLogin('tadmin');
        let social_Service = SOCIAL_SERVICE_PROCESS;
        let social_Service_Process = social_Service.name + randomStr;
        social_Service.name = social_Service_Process;
        await apiCoreUtil.createProcess(social_Service);
        let processLibConfData1 = {
            applicationServicesLib: "com.bmc.dsm.social-lib",
            processName: social_Service_Process,
            processAliasName: `Process${randomStr}`,
            company: "Petramco",
            description: `description${randomStr}`,
            status: "Active"
        }
        await apiHelper.createProcessLibConfig(processLibConfData1);

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Process Library', 'Process Library - Console - Business Workflows');
        await consoleFlowsetProcessLibrary.addColumn(["ID", "Process Name"]);
        await expect(consoleFlowsetProcessLibrary.isAllVisibleColumnPresent(availableValues)).toBeTruthy("Available value is not present");
        await consoleFlowsetProcessLibrary.searchAndSelectFlowset(`Process${randomStr}`);
        await editFlowsetProcessLibrary.setAliasName('UpdateAlias' + randomStr);
        await editFlowsetProcessLibrary.clickOnSaveButton();
        await expect(editFlowsetProcessLibrary.isAliasNamePresentOnGrid('UpdateAlias' + randomStr)).toBeTruthy('UpdateAlias' + randomStr + "name is not present");
        await consoleFlowsetProcessLibrary.clearSearcBox();
        await consoleFlowsetProcessLibrary.clickOnRefreshButton();
        await expect(consoleFlowsetProcessLibrary.getSortedValuesFromColumn("Process Alias Name")).toBeTruthy("Sorted not possible");
        await apiHelper.apiLogin('tadmin');
		let processName = 'com.bmc.dsm.social-lib:Social - Sample Activity Update By User';
        await apiHelper.deleteFlowsetProcessLibConfig(processName);
    });
});