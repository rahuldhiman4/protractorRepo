import { browser } from "protractor";
import apiCoreUtil from '../../api/api.core.util';
import apiHelper from '../../api/api.helper';
import { CASE_MANAGEMENT_LIB_PROCESS, SOCIAL_SERVICE_PROCESS } from '../../data/ui/flowset/process-for-flowset.data.ui';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import consoleFlowsetProcessLibrary from '../../pageobject/flowset/console-process-library-config.po';
import createFlowsetProcessLibrary from '../../pageobject/flowset/create-register-process-config.po';
import editFlowsetProcessLibrary from '../../pageobject/flowset/edit-register-process-config.po';

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
    });

    //ankagraw
    it('[DRDMV-6216]: [Flowsets] Create new Register Process', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let drpDownStatus: string[] = ['Draft', 'Active', 'Inactive'];

        await apiHelper.apiLogin('tadmin');
        let case_management = CASE_MANAGEMENT_LIB_PROCESS;
        let case_Management_Process = case_management.name + randomStr;
        case_management.name = case_Management_Process;
        await apiCoreUtil.createProcess(case_management);

        let processName = case_Management_Process.split(':')[1];

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
        await expect(createFlowsetProcessLibrary.isCompanyRequiredTextDisplayed()).toBeTruthy(" Company Required text not present ");
        await expect(createFlowsetProcessLibrary.isProcessRequiredTextDisplayed()).toBeTruthy(" Process Name Required text not present ");
        await expect(createFlowsetProcessLibrary.isDescriptionRequiredTextDisplayed()).toBeTruthy(" Description Required text not present ");
        await expect(createFlowsetProcessLibrary.isStatusRequiredTextDisplayed()).toBeTruthy(" Status Required text not present ");
        await expect(createFlowsetProcessLibrary.isProcessAliasRequiredTextDisplayed()).toBeTruthy(" Process Alias Required text not present ");
        await createFlowsetProcessLibrary.clickSaveButton();
        await expect(createFlowsetProcessLibrary.isErrorMsgPresent()).toBeTruthy("Error msg not present");

        //add Flowsets
        await createFlowsetProcessLibrary.selectCompany('Petramco');
        await createFlowsetProcessLibrary.selectApplicationService("Case Management Service");
        await createFlowsetProcessLibrary.selectProcessName(processName);
        await createFlowsetProcessLibrary.setAliasName("Alias" + randomStr);
        await createFlowsetProcessLibrary.setDescription("description" + randomStr);
        await createFlowsetProcessLibrary.selectStatus("Active");
        await createFlowsetProcessLibrary.clickSaveButton();
        await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Process Library', 'Process Library - Console - Business Workflows');
        await expect(consoleFlowsetProcessLibrary.isAliasNamePresentOnGrid("Alias" + randomStr)).toBeTruthy("Alias" + randomStr + "name is not present");
    });

    it('[DRDMV-1269,DRDMV-1295]: [Flowsets] Search Register Process on Console', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        try {
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
            await expect(consoleFlowsetProcessLibrary.isAliasNamePresentOnGrid('UpdateAlias' + randomStr)).toBeTruthy('UpdateAlias' + randomStr + "name is not present");
            await expect(editFlowsetProcessLibrary.getDescription('UpdataDescription' + randomStr)).toBe('UpdataDescription' + randomStr);
            await expect(consoleFlowsetProcessLibrary.isProcessPresentOnGrid('No Name Process')).toBeFalsy('Unnecessary register is not display');
            await apiHelper.apiLogin('tadmin');
            let processName = 'com.bmc.dsm.social-lib:Social - Sample Activity Update By User';
            await apiHelper.deleteFlowsetProcessLibConfig(processName);
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });

    //ankagraw
    it('[DRDMV-7607]: [Permissions] Process Library access', async () => {
        try {
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
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createProcessLibConfig(processLibConfData1);

            //login with same company Manager
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Process Library', 'Process Library - Console - Business Workflows');
            await expect(consoleFlowsetProcessLibrary.isAliasNamePresentOnGrid(`Process${randomStr}`)).toBeTruthy(`Process${randomStr}` + "Name is not present");

            //login with same company CBA 
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Process Library', 'Process Library - Console - Business Workflows');
            await consoleFlowsetProcessLibrary.searchAndSelectFlowset(`Process${randomStr}`);
            await editFlowsetProcessLibrary.setDescription('UpdataDescription' + randomStr);
            await editFlowsetProcessLibrary.clickOnSaveButton();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Process Library', 'Process Library - Console - Business Workflows');
            await expect(consoleFlowsetProcessLibrary.isAliasNamePresentOnGrid('UpdateAliasvbv5')).toBeTruthy('UpdateAliasvbv5' + "Name is not present");

            //login with different company CBA
            await navigationPage.signOut();
            await loginPage.login('gwixillian');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Process Library', 'Process Library - Console - Business Workflows');
            await expect(consoleFlowsetProcessLibrary.isAliasNamePresentOnGrid('UpdateAliasvbv5')).toBeFalsy('UpdateAliasvbv5' + "Name is present");

            //login with different company Manager
            await navigationPage.signOut();
            await loginPage.login('rrovnitov');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Process Library', 'Process Library - Console - Business Workflows');
            await expect(consoleFlowsetProcessLibrary.isAliasNamePresentOnGrid('UpdateAliasvbv5')).toBeFalsy('UpdateAliasvbv5' + "Name is present");

            //login with same company Agent
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotoSettingsPage();
            await expect(navigationPage.isSettingMenuPresent('Manage Flowsets')).toBeFalsy("Setting menu present");
            await apiHelper.apiLogin('tadmin');
            let processName = 'com.bmc.dsm.social-lib:Social - Sample Activity Update By User';
            await apiHelper.deleteFlowsetProcessLibConfig(processName);
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });

    it('[DRDMV-1298]: [Flowsets] Flowsets Console verification', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let allHeaders: string[] = ['Application', 'Company', 'ID', 'Process Alias Name', 'Process Description', 'Process Name', 'Status'];
        let remainingHeaders: string[] = ['Application', 'Company', 'ID', 'Process Alias Name', 'Process Description', 'Status'];
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
        await expect(consoleFlowsetProcessLibrary.isAllVisibleColumnPresent(allHeaders)).toBeTruthy("Available value is not present");
        await consoleFlowsetProcessLibrary.removeColumn(["Process Name"]);
        await expect(consoleFlowsetProcessLibrary.isAllVisibleColumnPresent(remainingHeaders)).toBeTruthy("Available value is not present");
        await consoleFlowsetProcessLibrary.searchAndSelectFlowset(`Process${randomStr}`);
        await editFlowsetProcessLibrary.setAliasName('UpdateAlias' + randomStr);
        await editFlowsetProcessLibrary.clickOnSaveButton();
        await expect(consoleFlowsetProcessLibrary.isAliasNamePresentOnGrid('UpdateAlias' + randomStr)).toBeTruthy('UpdateAlias' + randomStr + "name is not present");
        await consoleFlowsetProcessLibrary.clearSearcBox();
        await consoleFlowsetProcessLibrary.clickOnRefreshButton();
        await expect(consoleFlowsetProcessLibrary.getSortedValuesFromColumn("Process Alias Name")).toBeTruthy("Sorted not possible");
        await apiHelper.apiLogin('tadmin');
        let processName = 'com.bmc.dsm.social-lib:Social - Sample Activity Update By User';
        await apiHelper.deleteFlowsetProcessLibConfig(processName);
    });

    //ankagraw
    xit('[DRDMV-11987]: [Case Creation] Verify able to create case with Global case template having flowset', async () => {
        // incomplete test case... create process which changes case priority to low, register process with flowset
        // create global template, set case priority as high and use flowset
        // create case using template with medium priority, and verify priority changes to low
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplate1 = 'Case Template 1' + randomStr;
        let globalCategName = 'DemoCateg1';
        let categName2 = 'DemoCateg2';
        let categName3 = 'DemoCateg3';
        await apiHelper.apiLogin('tadmin');
        await apiHelper.createOperationalCategory(globalCategName, true);
        await apiHelper.createOperationalCategory(categName2);
        await apiHelper.createOperationalCategory(categName3);
        await apiHelper.associateCategoryToCategory(globalCategName, categName2);
        await apiHelper.associateCategoryToCategory(categName2, categName3);
        let caseTemplateSummary1 = 'Summary 1' + randomStr;

        await apiHelper.apiLogin('qkatawazi');
        let flowsetData = require('../../data/ui/case/flowset.ui.json');
        let flowsetName: string = await flowsetData['flowsetGlobalFields'].flowsetName + randomStr;
        flowsetData['flowsetGlobalFields'].flowsetName = flowsetName;
        await apiHelper.createNewFlowset(flowsetData['flowsetGlobalFields']);

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
    }, 180 * 1000);
});