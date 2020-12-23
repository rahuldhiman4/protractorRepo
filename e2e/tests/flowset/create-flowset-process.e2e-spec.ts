import { browser } from "protractor";
import apiCoreUtil from '../../api/api.core.util';
import apiHelper from '../../api/api.helper';
import { CASE_MANAGEMENT_LIB_PROCESS, SOCIAL_SERVICE_PROCESS } from '../../data/ui/flowset/process-for-flowset.data.ui';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import consoleFlowsetProcessLibrary from '../../pageobject/settings/manage-flowset/console-process-library-config.po';
import createFlowsetProcessLibrary from '../../pageobject/settings/manage-flowset/create-register-process-config.po';
import editFlowsetProcessLibrary from '../../pageobject/settings/manage-flowset/edit-register-process-config.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import consoleFlowsetConfigPage from '../../pageobject/settings/manage-flowset/console-flowset-config.po';
import createFlowsetPage from '../../pageobject/settings/manage-flowset/create-flowset-config.po';
import editFlowsetConfigPo from '../../pageobject/settings/manage-flowset/edit-flowset-config.po';
import utilCommon from '../../utils/util.common';
import createCaseTemplatePage from '../../pageobject/settings/case-management/create-casetemplate.po';
import consoleCasetemplatePage from '../../pageobject/settings/case-management/console-casetemplate.po';
import createCasePage from '../../pageobject/case/create-case.po';
import previewCasePage from '../../pageobject/case/case-preview.po';
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import viewCasePage from '../../pageobject/case/view-case.po';
import utilityGrid from '../../utils/utility.grid';
import utilGrid from '../../utils/util.grid';
import activityTabPage from '../../pageobject/social/activity-tab.po';
import statusBladePo from '../../pageobject/common/update.status.blade.po';
import composeEmailPo from '../../pageobject/email/compose-mail.po';
import { flowsetMandatoryFields, flowsetGlobalFields } from '../../data/ui/flowset/flowset.ui';
import { cloneDeep } from 'lodash';
let userData, userData1, userData2 = undefined;

describe('Create Process in Flowset', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
        await apiHelper.apiLogin('tadmin');

        userData1 = {
            "firstName": "caseBA",
            "lastName": "MultiLOB",
            "userId": "caseBAMultiLOB",
            "userPermission": ["Case Business Analyst", "Foundation Read", "Knowledge Coach", "Knowledge Publisher", "Knowledge Contributor", "Knowledge Candidate", "Case Catalog Administrator", "Person Activity Read", "Human Resource", "Facilities"]
        }
        await apiHelper.createNewUser(userData1);
        await apiHelper.associatePersonToCompany(userData1.userId, "Petramco");
        await apiHelper.associatePersonToSupportGroup(userData1.userId, "US Support 3");

        userData2 = {
            "firstName": "caseMngr",
            "lastName": "MultiLOB",
            "userId": "caseMngrMultiLOB",
            "userPermission": ["Case Manager", "Foundation Read", "Knowledge Coach", "Knowledge Publisher", "Knowledge Contributor", "Knowledge Candidate", "Case Catalog Administrator", "Person Activity Read", "Human Resource", "Facilities"]
        }
        await apiHelper.createNewUser(userData2);
        await apiHelper.associatePersonToCompany(userData2.userId, "Petramco");
        await apiHelper.associatePersonToSupportGroup(userData2.userId, "US Support 3");

    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //ankagraw

    describe('[DRDMV-6216]: [Flowsets] Create new Register Process', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let drpDownStatus: string[] = ['Draft', 'Active', 'Inactive'];
        let processName = undefined;
        let processLibConfData;
        let processAliasNameCaseHR = "case process HR" + randomStr;

        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            let case_management = CASE_MANAGEMENT_LIB_PROCESS;
            let case_Management_Process = case_management.name + randomStr;
            case_management.name = case_Management_Process;
            await apiCoreUtil.createProcess(case_management);

            await apiHelper.apiLogin('qkatawazi');
            processLibConfData = {
                applicationServicesLib: "com.bmc.dsm.case-lib",
                processName: case_Management_Process,
                processAliasName: processAliasNameCaseHR,
                company: "Petramco",
                description: `First Descritpion${randomStr}`,
                status: "Active",
                lineOfBusiness: "Human Resource"
            }

            await apiHelper.createProcessLibConfig(processLibConfData);
        });

        it('[DRDMV-6216]: [Flowsets] Create new Register Process', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Process Library', 'Process Library - Console - Business Workflows');

            await apiHelper.apiLogin('tadmin');
            let case_management = CASE_MANAGEMENT_LIB_PROCESS;
            let case_Management_Process = case_management.name + randomStr;
            case_management.name = case_Management_Process;
            await apiCoreUtil.createProcess(case_management);

            processName = case_Management_Process.split(':')[1];

            expect(await consoleFlowsetProcessLibrary.isRegisterProcessEnable()).toBeTruthy("Add flowset register Process is disabled");
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
            await createFlowsetProcessLibrary.setDescription("description" + randomStr);
            await createFlowsetProcessLibrary.selectStatus("Active");
            await createFlowsetProcessLibrary.selectProcessName(processName);
            await createFlowsetProcessLibrary.setAliasName(processName + randomStr);
            await createFlowsetProcessLibrary.clickSaveButton();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Process Library', 'Process Library - Console - Business Workflows');
            expect(await consoleFlowsetProcessLibrary.isAliasNamePresentOnGrid(processName + randomStr)).toBeTruthy(processName + randomStr + "name is not present");
        });

        it('[DRDMV-6216]: Verify if flowset register process is accessible to same LOB Case Manager', async () => {
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Process Library', 'Process Library - Console - Business Workflows');
            expect(await consoleFlowsetProcessLibrary.isAliasNamePresentOnGrid(processName + randomStr)).toBeTruthy(processName + randomStr + "name is not present");
        });

        it('[DRDMV-6216]: Verify if flowset register process is accessible to different LOB Case BA', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Process Library', 'Process Library - Console - Business Workflows');
            expect(await consoleFlowsetProcessLibrary.isAliasNamePresentOnGrid(processName + randomStr)).toBeFalsy(processName + randomStr + "register process is displayed for different LOB Case BA");
        });

        it('[DRDMV-6216]: Verify if flowset register process is accessible to different LOB Case Manager', async () => {
            await navigationPage.signOut();
            await loginPage.login('frieda');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Process Library', 'Process Library - Console - Business Workflows');
            expect(await consoleFlowsetProcessLibrary.isAliasNamePresentOnGrid(processName + randomStr)).toBeFalsy(processName + randomStr + "register process is displayed for different LOB Case manager");
        });

        it('[DRDMV-6216]: Verify if flowset register process is accessible to Case BA belonging to different company with same LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('gwixillian');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Process Library', 'Process Library - Console - Business Workflows');
            expect(await consoleFlowsetProcessLibrary.isAliasNamePresentOnGrid(processName + randomStr)).toBeTruthy(processName + randomStr + "register process is displayed for same LOB and different company Case BA");
        });

        it('[DRDMV-6216]: Verify if flowset register process is accessible to Case Manager user having access to multiple LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('caseMngrMultiLOB@petramco.com', 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Process Library', 'Process Library - Console - Business Workflows');
            await utilGrid.selectLineOfBusiness('Human Resource');
            expect(await consoleFlowsetProcessLibrary.isAliasNamePresentOnGrid(processName + randomStr)).toBeTruthy(processName + randomStr + "register process is displayed for different LOB Case manager");
            await utilGrid.selectLineOfBusiness('Facilities');
            expect(await consoleFlowsetProcessLibrary.isAliasNamePresentOnGrid(processName + randomStr)).toBeFalsy(processName + randomStr + "register process is not displayed for same LOB Case manager");
        });

        it('[DRDMV-6216]: Verify if flowset register process is accessible to Case BA user having access to multiple LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('caseBAMultiLOB@petramco.com', 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Process Library', 'Process Library - Console - Business Workflows');
            await utilGrid.selectLineOfBusiness('Human Resource');
            expect(await consoleFlowsetProcessLibrary.isAliasNamePresentOnGrid(processName + randomStr)).toBeTruthy(processName + randomStr + "register process is displayed for different LOB Case BA");
            await utilGrid.selectLineOfBusiness('Facilities');
            expect(await consoleFlowsetProcessLibrary.isAliasNamePresentOnGrid(processName + randomStr)).toBeFalsy(processName + randomStr + "register process is not displayed for same LOB Case BA");
            await utilGrid.selectLineOfBusiness('Human Resource');
            await consoleFlowsetProcessLibrary.searchAndSelectFlowset(processName + randomStr);
            await editFlowsetProcessLibrary.setAliasName('UpdateAlias' + randomStr);
            await editFlowsetProcessLibrary.setDescription('UpdataDescription' + randomStr);
            await editFlowsetProcessLibrary.selectStatus('Draft');
            await editFlowsetProcessLibrary.clickOnSaveButton();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Process Library', 'Process Library - Console - Business Workflows');
            expect(await consoleFlowsetProcessLibrary.isAliasNamePresentOnGrid('UpdateAlias' + randomStr)).toBeTruthy('UpdateAlias' + randomStr + "name is not present");
        });

        it('[DRDMV-6216]: Validate create new record with same name in same LOB', async () => {
            await consoleFlowsetProcessLibrary.clickOnRegisterProcess();
            await createFlowsetProcessLibrary.selectCompany('Petramco');
            await createFlowsetProcessLibrary.selectApplicationService("Case Management Service");
            await createFlowsetProcessLibrary.setDescription("description" + randomStr);
            await createFlowsetProcessLibrary.selectStatus("Active");
            await createFlowsetProcessLibrary.selectProcessName(processName);
            await createFlowsetProcessLibrary.setAliasName('UpdateAlias' + randomStr);
            await createFlowsetProcessLibrary.clickSaveButton();
            expect(await utilCommon.isPopUpMessagePresent('ERROR (22096): The process alias name already existsfor the line of business. Please select a different process alias name.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
            await createFlowsetProcessLibrary.clickCancelButton();
            await utilCommon.clickOnWarningOk();

            await consoleFlowsetProcessLibrary.searchAndSelectFlowset(processAliasNameCaseHR);
            await editFlowsetProcessLibrary.setAliasName('UpdateAlias' + randomStr);
            await editFlowsetProcessLibrary.setDescription('UpdataDescription' + randomStr);
            await editFlowsetProcessLibrary.selectStatus('Draft');
            await editFlowsetProcessLibrary.clickOnSaveButton();
            expect(await utilCommon.isPopUpMessagePresent('ERROR (22096): The process alias name already exists for the line of business. Please select a different process alias name.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
            await editFlowsetProcessLibrary.clickOnCancelButton();
            await utilCommon.clickOnWarningOk();
        });

        it('[DRDMV-6216]:  Validate create new record with same name in different LOB', async () => {
            await utilGrid.selectLineOfBusiness('Facilities');
            await consoleFlowsetProcessLibrary.clickOnRegisterProcess();
            await createFlowsetProcessLibrary.selectCompany('Petramco');
            await createFlowsetProcessLibrary.selectApplicationService("Case Management Service");
            await createFlowsetProcessLibrary.setDescription("description" + randomStr);
            await createFlowsetProcessLibrary.selectStatus("Active");
            await createFlowsetProcessLibrary.selectProcessName(processName);
            await createFlowsetProcessLibrary.setAliasName('UpdateAlias' + randomStr);
            await createFlowsetProcessLibrary.clickSaveButton();
            expect(await utilCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });


    });


    it('[DRDMV-1269,DRDMV-1295]: [Flowsets] Search Register Process on Console', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await apiHelper.apiLogin('tadmin');
        let social_Service = SOCIAL_SERVICE_PROCESS;
        let social_Service_Process = social_Service.name + randomStr;
        social_Service.name = social_Service_Process;
        await apiCoreUtil.createProcess(social_Service);

        let processLibConfData = {
            applicationServicesLib: "com.bmc.dsm.social-lib",
            processName: social_Service_Process,
            processAliasName: `Process${randomStr}`,
            company: "Petramco",
            description: `description${randomStr}`,
            status: "Active"
        }
        await apiHelper.createProcessLibConfig(processLibConfData);

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Process Library', 'Process Library - Console - Business Workflows');
        await consoleFlowsetProcessLibrary.searchAndSelectFlowset(processLibConfData.processAliasName);
        await editFlowsetProcessLibrary.setAliasName('UpdateAlias' + randomStr);
        await editFlowsetProcessLibrary.setDescription('UpdataDescription' + randomStr);
        await editFlowsetProcessLibrary.selectStatus('Draft');
        await editFlowsetProcessLibrary.clickOnSaveButton();
        await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Process Library', 'Process Library - Console - Business Workflows');
        expect(await consoleFlowsetProcessLibrary.isAliasNamePresentOnGrid('UpdateAlias' + randomStr)).toBeTruthy('UpdateAlias' + randomStr + "name is not present");
        expect(await editFlowsetProcessLibrary.getDescription('UpdataDescription' + randomStr)).toBe('UpdataDescription' + randomStr);
        expect(await consoleFlowsetProcessLibrary.isProcessPresentOnGrid('No Name Process')).toBeFalsy('Unnecessary register is not display');
        await apiHelper.apiLogin('tadmin');
        let processName = 'com.bmc.dsm.social-lib:Social - Sample Activity Update By User';
        await apiHelper.deleteFlowsetProcessLibConfig(processName);

    });

    //ankagraw
    describe('[DRDMV-7607]: [Permissions] Process Library access', () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let processLibConfData, alias = undefined;
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            let social_Service = SOCIAL_SERVICE_PROCESS;
            let social_Service_Process = social_Service.name + randomStr;
            social_Service.name = social_Service_Process;
            await apiCoreUtil.createProcess(social_Service);
            processLibConfData = {
                applicationServicesLib: "com.bmc.dsm.social-lib",
                processName: social_Service_Process,
                processAliasName: `Process${randomStr}`,
                company: "Petramco",
                lineOfBusiness: "Facilities",
                description: `description${randomStr}`,
                status: "Active"
            }
            await apiHelper.apiLogin('fritz');
            await apiHelper.createProcessLibConfig(processLibConfData);
        });

        it('[DRDMV-7607]: [Permissions] Process Library access', async () => {
            //login with same company Manager
            await navigationPage.signOut();
            await loginPage.login('frieda');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Process Library', 'Process Library - Console - Business Workflows');
            expect(await consoleFlowsetProcessLibrary.isRegisterProcessDisplayed()).toBeFalsy("Register Process Link button displayed for case manager.");
            expect(await consoleFlowsetProcessLibrary.isAliasNamePresentOnGrid(processLibConfData.processAliasName)).toBeTruthy(processLibConfData.processAliasName + " Name is not present");

            //login with same company CBA 
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Process Library', 'Process Library - Console - Business Workflows');
            await consoleFlowsetProcessLibrary.searchAndSelectFlowset(processLibConfData.processAliasName);
            await editFlowsetProcessLibrary.setDescription('UpdataDescription' + randomStr);
            alias = 'UpdateAlias' + randomStr;
            await editFlowsetProcessLibrary.setAliasName(alias);
            await editFlowsetProcessLibrary.clickOnSaveButton();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Process Library', 'Process Library - Console - Business Workflows');
            expect(await consoleFlowsetProcessLibrary.isAliasNamePresentOnGrid(alias)).toBeTruthy(alias + "Name is not present");
        });

        it('[DRDMV-7607]: [Permissions] Process Library access', async () => {
            //login with different company CBA
            await navigationPage.signOut();
            await loginPage.login('gwixillian');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Process Library', 'Process Library - Console - Business Workflows');
            expect(await consoleFlowsetProcessLibrary.isAliasNamePresentOnGrid(alias)).toBeFalsy(alias + "Name is present");

            //login with different company Manager
            await navigationPage.signOut();
            await loginPage.login('rrovnitov');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Process Library', 'Process Library - Console - Business Workflows');
            expect(await consoleFlowsetProcessLibrary.isAliasNamePresentOnGrid(alias)).toBeFalsy(alias + "Name is present");

            //login with same company Agent
            await navigationPage.signOut();
            await loginPage.login('fabian');
            await navigationPage.gotoSettingsPage();
            await expect(navigationPage.isSettingMenuPresent('Manage Flowsets')).toBeFalsy("Setting menu present");
            await apiHelper.apiLogin('tadmin');
            let processName = 'com.bmc.dsm.social-lib:Social - Sample Activity Update By User';
            await apiHelper.deleteFlowsetProcessLibConfig(processName);
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[DRDMV-1298]: [Flowsets] Flowsets Console verification', async () => {

        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let allHeaders: string[] = ['Application', 'Company', 'ID', 'Process Alias Name', 'Process Description', 'Process Name', 'Status'];
        let remainingHeaders: string[] = ['Application', 'Company', 'ID', 'Process Alias Name', 'Process Description', 'Status'];
        let social_Service = SOCIAL_SERVICE_PROCESS;
        let social_Service_Process = social_Service.name + randomStr;
        social_Service.name = social_Service_Process;
        let processLibConfData1 = undefined;

        it('[DRDMV-1298]: [Flowsets] Flowsets Console verification', async () => {
            await apiHelper.apiLogin('tadmin');
            await apiCoreUtil.createProcess(social_Service);
            processLibConfData1 = {
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
            await consoleFlowsetProcessLibrary.addColumn(["Application", "ID", "Process Name"]);
            expect(await consoleFlowsetProcessLibrary.isAllVisibleColumnPresent(allHeaders)).toBeTruthy("Available value is not present");
            await consoleFlowsetProcessLibrary.removeColumn(["Process Name"]);
            expect(await consoleFlowsetProcessLibrary.isAllVisibleColumnPresent(remainingHeaders)).toBeTruthy("Available value is not present");
            await consoleFlowsetProcessLibrary.searchAndSelectFlowset(`Process${randomStr}`);
            await editFlowsetProcessLibrary.setAliasName('UpdateAlias' + randomStr);
            await editFlowsetProcessLibrary.clickOnSaveButton();
            expect(await consoleFlowsetProcessLibrary.isAliasNamePresentOnGrid('UpdateAlias' + randomStr)).toBeTruthy('UpdateAlias' + randomStr + "name is not present");
            await consoleFlowsetProcessLibrary.clearSearchBox();
            await consoleFlowsetProcessLibrary.clickOnRefreshButton();
            expect(await consoleFlowsetProcessLibrary.getSortedValuesFromColumn("Process Alias Name")).toBeTruthy("Sorted not possible");
        });

        it('[DRDMV-1298]: Verify if flowset process is accessible to same LOB Case Manager', async () => {
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Process Library', 'Process Library - Console - Business Workflows');
            expect(await utilGrid.isGridRecordPresent('UpdateAlias' + randomStr)).toBeTruthy('Flowset process are not displayed to same LOB Case manager.');
        });

        it('[DRDMV-1298]: Verify if flowset process is accessible to different LOB Case BA', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Process Library', 'Process Library - Console - Business Workflows');
            expect(await utilGrid.isGridRecordPresent('UpdateAlias' + randomStr)).toBeFalsy('Flowset process is displayed to different LOB Case BA.');
        });

        it('[DRDMV-1298]: Verify if flowset process is accessible to different LOB Case Manager', async () => {
            await navigationPage.signOut();
            await loginPage.login('frieda');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Process Library', 'Process Library - Console - Business Workflows');
            expect(await utilGrid.isGridRecordPresent('UpdateAlias' + randomStr)).toBeFalsy('Flowset process is displayed to different LOB Case manager.');
        });

        it('[DRDMV-1298]: Verify if flowset process is accessible to Case BA belonging to different company with same LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('gwixillian');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Process Library', 'Process Library - Console - Business Workflows');
            expect(await utilGrid.isGridRecordPresent('UpdateAlias' + randomStr)).toBeTruthy('Flowset process is displayed to same LOB with different company Case BA.');
        });

        it('[DRDMV-1298]: Verify if flowset process is accessible to Case Manager user having access to multiple LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('caseMngrMultiLOB@petramco.com', 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Process Library', 'Process Library - Console - Business Workflows');
            await utilGrid.selectLineOfBusiness('Human Resource');
            expect(await utilGrid.isGridRecordPresent('UpdateAlias' + randomStr)).toBeTruthy('Flowset process is not displayed to Case manager havin access to multiple LOB.');
            await utilGrid.selectLineOfBusiness('Facilities');
            expect(await utilGrid.isGridRecordPresent('UpdateAlias' + randomStr)).toBeFalsy('Flowset process is displayed to Case manager havin access to multiple LOB');
        });

        it('[DRDMV-1298]: Verify if flowset process is accessible to Case BA user having access to multiple LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('caseBAMultiLOB@petramco.com', 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Process Library', 'Process Library - Console - Business Workflows');
            await utilGrid.selectLineOfBusiness('Human Resource');
            expect(await utilGrid.isGridRecordPresent('UpdateAlias' + randomStr)).toBeTruthy('Flowset process is not displayed to Case BA havin access to multiple LOB.');
            await utilGrid.selectLineOfBusiness('Facilities');
            expect(await utilGrid.isGridRecordPresent('UpdateAlias' + randomStr)).toBeFalsy('Flowset process is displayed to Case BA havin access to multiple LOB');
        });

        afterAll(async () => {
            await apiHelper.apiLogin('tadmin');
            let processName = 'com.bmc.dsm.social-lib:Social - Sample Activity Update By User';
            await apiHelper.deleteFlowsetProcessLibConfig(processName);

            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });

    });

    //asahitya
    describe('[DRDMV-11987]: [Case Creation] Verify able to create case with Global case template having flowset', () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseResponse = undefined;
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            let processName = `Agent Origin Global ${randomStr}`
            await apiHelper.createProcess(processName, 'AGENT_ORIGIN');

            //Register the Process
            await apiHelper.apiLogin('fritz');
            const registerProcessData = {
                applicationServicesLib: 'com.bmc.dsm.case-lib',
                processName: `com.bmc.dsm.case-lib:${processName}`,
                processAliasName: processName,
                company: '- Global -',
                lineOfBusiness: "Facilities",
                description: 'Desc ' + randomStr,
                status: 'Active'
            }
            let registeredProcessResponse = await apiHelper.createProcessLibConfig(registerProcessData);

            //Create new flowset
            let flowsetName: string = `DRDMV-11987 ${randomStr}`;
            let flowsetMandatoryFieldsData = cloneDeep(flowsetGlobalFields);
            flowsetMandatoryFieldsData.flowsetName = flowsetName;
            flowsetMandatoryFieldsData["lineOfBusiness"] = "Facilities";
            let flowsetResponse = await apiHelper.createNewFlowset(flowsetMandatoryFieldsData);
            //Map Process to Flowset
            let flowsetProcessMappingData = {
                function: 'Initialization',
                registeredProcessId: registeredProcessResponse.id,
                status: 'Active',
                flowsetId: flowsetResponse.id,
                company: 'Petramco'
            }
            await apiHelper.mapProcessToFlowset(flowsetProcessMappingData);

            //Create Case Template
            let caseTemplateData = {
                "templateName": 'DRDMV-11987 tname' + randomStr,
                "templateSummary": 'DRDMV-11987 Summary' + randomStr,
                "casePriority": "Medium",
                "templateStatus": "Active",
                "company": "- Global -",
                "lineOfBusiness": "Facilities",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Frieda",
                "ownerBU": "Facilities Support",
                "ownerGroup": "Facilities",
                "flowset": flowsetResponse.id
            }
            let caseTemplateResponse = await apiHelper.createCaseTemplate(caseTemplateData)

            //Create Case using above Case Template
            let caseData = {
                "Requester": "qkatawazi",
                "Summary": "DRDMV-11987 Create Case",
                "Line of Business": "Facilities",
                "Origin": "Agent",
                "Case Template ID": caseTemplateResponse.displayId
            }
            caseResponse = await apiHelper.createCase(caseData);
        });

        it('[DRDMV-11987]: [Case Creation] Verify able to create case with Global case template having flowset', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await utilityGrid.searchAndOpenHyperlink(caseResponse.displayId);
            expect(await viewCasePage.getPriorityValue()).toBe('Low');
            await apiHelper.apiLogin('tadmin');
            expect(await apiCoreUtil.getProcessRunCount('com.bmc.dsm.case-lib', `Agent Origin Global ${randomStr}`)).toEqual(1);
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    })

    //asahitya
    describe('[DRDMV-10034]: Initialization process execution for case origin Agent', () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        it('[DRDMV-10034]: Initialization process execution for case origin Agent', async () => {
            //Create a Process
            await apiHelper.apiLogin('tadmin');
            let processName = `Agent Origin ${randomStr}`
            await apiHelper.createProcess(processName, 'AGENT_ORIGIN');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Process Library', 'Process Library - Console - Business Workflows');
            await consoleFlowsetProcessLibrary.clickOnRegisterProcess();

            //Register Process
            await createFlowsetProcessLibrary.selectCompany('Petramco');
            await createFlowsetProcessLibrary.selectApplicationService("Case Management Service");
            await createFlowsetProcessLibrary.selectStatus("Active");
            await createFlowsetProcessLibrary.selectProcessName(processName);
            await createFlowsetProcessLibrary.setAliasName(processName);
            await createFlowsetProcessLibrary.setDescription("description" + randomStr);
            await createFlowsetProcessLibrary.clickSaveButton();

            //Create a Flowset
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Define Flowsets', 'Flowsets - Console - Business Workflows');
            await consoleFlowsetConfigPage.clickOnAddFlowset();
            await createFlowsetPage.selectCompany('Petramco');
            await createFlowsetPage.setFlowsetname('Flowset' + randomStr);
            await createFlowsetPage.setDescription("description" + randomStr);
            await createFlowsetPage.selectStatus("Active");
            await createFlowsetPage.clickSaveButton();
            await utilCommon.closeBladeOnSettings();

            await consoleFlowsetProcessLibrary.searchAndSelectFlowset('Flowset' + randomStr);
            await editFlowsetConfigPo.clickOnAddNewMappingBtn();
            await editFlowsetConfigPo.selectProcessName(processName);
            await editFlowsetConfigPo.selectFunction('Initialization');
            await editFlowsetConfigPo.selectProcessStatus('Active');
            await editFlowsetConfigPo.clickSaveBtnOnProcessMapping();
            await utilCommon.closeBladeOnSettings();
        });
        it('[DRDMV-10034]: Initialization process execution for case origin Agent', async () => {
            //Create a Case Template
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await consoleCasetemplatePage.clickOnCreateCaseTemplateButton();
            await createCaseTemplatePage.setTemplateName('DRDMV-10034 Tname ' + randomStr);
            await createCaseTemplatePage.setCompanyName('Petramco');
            await createCaseTemplatePage.setCaseSummary(`Summary ${randomStr}`);
            await createCaseTemplatePage.setFlowsetValue('Flowset' + randomStr);
            await createCaseTemplatePage.setOwnerCompanyValue('Petramco');
            await createCaseTemplatePage.setBusinessUnitDropdownValue('United States Support');
            await createCaseTemplatePage.setOwnerGroupDropdownValue('US Support 1');
            await createCaseTemplatePage.setTemplateStatusDropdownValue('Active');
            await createCaseTemplatePage.setPriorityValue('High');
            await createCaseTemplatePage.clickSaveCaseTemplate();
            //Create a case using above flowset
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('fritz');
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate('DRDMV-10034 Tname ' + randomStr);
            await createCasePage.clickSaveCaseButton();
            await previewCasePage.clickGoToCaseButton();
            expect(await viewCasePage.getPriorityValue()).toBe('Low');
            await apiHelper.apiLogin('tadmin');
            expect(await apiCoreUtil.getProcessRunCount('com.bmc.dsm.case-lib', `Agent Origin ${randomStr}`)).toEqual(1);
        });
    });

    //asahitya
    describe('[DRDMV-10327]: Initialization process execution for case origin Email', () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseResponse = undefined;

        beforeAll(async () => {
            //Create a Process
            await apiHelper.apiLogin('tadmin');
            let processName = `Email Origin ${randomStr}`
            await apiHelper.createProcess(processName, 'EMAIL_ORIGIN');

            //Register the Process
            await apiHelper.apiLogin('qkatawazi');
            const registerProcessData = {
                applicationServicesLib: 'com.bmc.dsm.case-lib',
                processName: 'com.bmc.dsm.case-lib:' + processName,
                processAliasName: processName,
                company: 'Petramco',
                description: 'Desc ' + randomStr,
                status: 'Active'
            }
            let registeredProcessResponse = await apiHelper.createProcessLibConfig(registerProcessData);

            //Create new flowset
            let flowsetName: string = `DRDMV-10327 ${randomStr}`;
            let flowsetMandatoryFieldsData = cloneDeep(flowsetMandatoryFields);
            flowsetMandatoryFieldsData.flowsetName = flowsetName;
            let flowsetResponse = await apiHelper.createNewFlowset(flowsetMandatoryFieldsData);

            //Map Process to Flowset
            let flowsetProcessMappingData = {
                function: 'Initialization',
                registeredProcessId: registeredProcessResponse.id,
                status: 'Active',
                flowsetId: flowsetResponse.id,
                company: 'Petramco'
            }
            await apiHelper.mapProcessToFlowset(flowsetProcessMappingData);

            //Create Case Template
            let caseTemplateData = {
                "templateName": 'DRDMV-10327 tname' + randomStr,
                "templateSummary": 'DRDMV-10327 Summary' + randomStr,
                "casePriority": "Medium",
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qfeng",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3",
                "flowset": flowsetResponse.id
            }
            let caseTemplateResponse = await apiHelper.createCaseTemplate(caseTemplateData)

            //Create Case using above Case Template
            let caseData = {
                "Requester": "fritz",
                "Summary": "DRDMV-10327 Create Case",
                "Origin": "Email",
                "Case Template ID": caseTemplateResponse.displayId
            }
            caseResponse = await apiHelper.createCase(caseData);
        });

        it('[DRDMV-10327]: Initialization process execution for case origin Agent', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseResponse.displayId);
            expect(await viewCasePage.getPriorityValue()).toBe('Critical');
            await apiHelper.apiLogin('tadmin');
            expect(await apiCoreUtil.getProcessRunCount('com.bmc.dsm.case-lib', `Email Origin ${randomStr}`)).toEqual(1);
        });
    });

    //asahitya
    describe('[DRDMV-1300]: [Flowsets] Filter menu verification on Register Process Console', () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let processName, processAliasName, registeredProcessResponse;
        beforeAll(async () => {
            //Create a Process
            await apiHelper.apiLogin('tadmin');
            processAliasName = `DRDMV-1300 ${randomStr}`
            await apiHelper.createProcess(processAliasName, 'EMAIL_ORIGIN');

            //Register the Process
            await apiHelper.apiLogin('qkatawazi');
            const registerProcessData = {
                applicationServicesLib: 'com.bmc.dsm.case-lib',
                processName: 'com.bmc.dsm.case-lib:' + processAliasName,
                processAliasName: processAliasName,
                company: 'Petramco',
                description: 'Desc ' + randomStr,
                status: 'Active'
            }
            registeredProcessResponse = await apiHelper.createProcessLibConfig(registerProcessData);
            processName = `com.bmc.dsm.case-lib:${processAliasName}`;
        });

        it('[DRDMV-1300]: [Flowsets] Filter menu verification on Register Process Console', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Process Library', 'Process Library - Console - Business Workflows');
            await consoleFlowsetProcessLibrary.addColumn(['Process Name', 'ID']);

            expect(await utilGrid.isAllFilterValueMatches(['Application', 'ID', 'Company', 'Process Alias Name', 'Process Description', 'Process Name', 'Status']));
            await utilGrid.addFilter('Process Name', processName, 'text');
            expect(await consoleFlowsetProcessLibrary.isColumnContainsSameValue('Process Name', processName)).toBeTruthy();
            await utilGrid.clearFilter();
            expect(await utilGrid.getNumberOfRecordsInGrid()).toBeGreaterThan(1);
            await utilGrid.searchOnGridConsole(processName);
            expect(await utilGrid.getNumberOfRecordsInGrid()).toEqual(1);
            expect(await consoleFlowsetProcessLibrary.getFirstValueOfColumn('Process Name')).toBe(processName);
            await utilGrid.clearGridSearchBox();

            await utilGrid.addFilter('Process Alias Name', processAliasName, 'text');
            expect(await consoleFlowsetProcessLibrary.isColumnContainsSameValue('Process Alias Name', processAliasName)).toBeTruthy();
            await utilGrid.clearFilter();
            expect(await utilGrid.getNumberOfRecordsInGrid()).toBeGreaterThan(1);
            await utilGrid.searchOnGridConsole(processAliasName);
            expect(await utilGrid.getNumberOfRecordsInGrid()).toEqual(1);
            expect(await consoleFlowsetProcessLibrary.getFirstValueOfColumn('Process Alias Name')).toBe(processAliasName);
            await utilGrid.clearGridSearchBox();

            await utilGrid.addFilter('Process Description', 'Desc ' + randomStr, 'text');
            expect(await consoleFlowsetProcessLibrary.isColumnContainsSameValue('Process Description', 'Desc ' + randomStr)).toBeTruthy();
            await utilGrid.clearFilter();
            expect(await utilGrid.getNumberOfRecordsInGrid()).toBeGreaterThan(1);
            await utilGrid.searchOnGridConsole('Desc ' + randomStr);
            expect(await utilGrid.getNumberOfRecordsInGrid()).toEqual(1);
            expect(await consoleFlowsetProcessLibrary.getFirstValueOfColumn('Process Description')).toBe('Desc ' + randomStr);
            await utilGrid.clearGridSearchBox();

            await utilGrid.addFilter('Company', 'Petramco', 'text');
            expect(await consoleFlowsetProcessLibrary.isColumnContainsSameValue('Company', 'Petramco')).toBeTruthy();
            await utilGrid.clearFilter();
            expect(await utilGrid.getNumberOfRecordsInGrid()).toBeGreaterThan(1);
            await utilGrid.searchOnGridConsole('Petramco');
            expect(await utilGrid.getNumberOfRecordsInGrid()).toBeGreaterThanOrEqual(1);
            expect(await consoleFlowsetProcessLibrary.isColumnContainsSameValue('Company', 'Petramco')).toBeTruthy();
            await utilGrid.clearGridSearchBox();

            await utilGrid.addFilter('Status', 'Active', 'checkbox');
            expect(await consoleFlowsetProcessLibrary.isColumnContainsSameValue('Status', 'Active')).toBeTruthy();
            await utilGrid.clearFilter();
            expect(await utilGrid.getNumberOfRecordsInGrid()).toBeGreaterThan(1);

            //Search with Active does not work
            // await utilGrid.searchOnGridConsole('Active');  
            // expect(await utilGrid.getNumberOfRecordsInGrid()).toBeGreaterThanOrEqual(1);
            // expect(await consoleFlowsetProcessLibrary.isColumnContainsSameValue('Status', 'Active')).toBeTruthy();
            // await utilGrid.clearGridSearchBox();

            await utilGrid.addFilter('ID', registeredProcessResponse.id, 'text');
            expect(await consoleFlowsetProcessLibrary.isColumnContainsSameValue('ID', registeredProcessResponse.id)).toBeTruthy();
            await utilGrid.clearFilter();
            expect(await utilGrid.getNumberOfRecordsInGrid()).toBeGreaterThan(1);
            await utilGrid.searchOnGridConsole(registeredProcessResponse.id);
            expect(await utilGrid.getNumberOfRecordsInGrid()).toEqual(1);
            expect(await consoleFlowsetProcessLibrary.getFirstValueOfColumn('ID')).toBe(registeredProcessResponse.id);
            await utilGrid.clearGridSearchBox();

            await consoleFlowsetProcessLibrary.removeColumn(['Process Name', 'ID']);
        });
    });

    describe('[DRDMV-10328,DRDMV-10023,DRDMV-10028]: User Activity Feeds process execution for post created by email', () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseResponse = undefined;
        let processName = undefined;
        beforeAll(async () => {
            //Create a Process
            await apiHelper.apiLogin('tadmin');
            processName = `Activity Feed Email ${randomStr}`
            await apiHelper.createProcess(processName, 'SOCIAL_ACTIVITY_FEED');

            //Register the Process
            await apiHelper.apiLogin('qkatawazi');
            const registerProcessData = {
                applicationServicesLib: "com.bmc.dsm.social-lib",
                processName: 'com.bmc.dsm.social-lib:' + processName,
                processAliasName: processName,
                company: 'Petramco',
                description: 'Desc ' + randomStr,
                status: 'Active'
            }
            let registeredProcessResponse = await apiHelper.createProcessLibConfig(registerProcessData);

            //Create new flowset
            let flowsetName: string = `DRDMV-10328 ${randomStr}`;
            let flowsetMandatoryFieldsData = cloneDeep(flowsetMandatoryFields);
            flowsetMandatoryFieldsData.flowsetName = flowsetName;
            let flowsetResponse = await apiHelper.createNewFlowset(flowsetMandatoryFieldsData);

            //Map Process to Flowset
            let flowsetProcessMappingData = {
                function: 'User Activity Feeds',
                registeredProcessId: registeredProcessResponse.id,
                status: 'Active',
                flowsetId: flowsetResponse.id,
                company: 'Petramco'
            }
            await apiHelper.mapProcessToFlowset(flowsetProcessMappingData);

            //Create Case Template
            let caseTemplateData = {
                "templateName": 'DRDMV-10328 tname' + randomStr,
                "templateSummary": 'DRDMV-10328 Summary' + randomStr,
                "casePriority": "Medium",
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qfeng",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3",
                "flowset": flowsetResponse.id
            }
            let caseTemplateResponse = await apiHelper.createCaseTemplate(caseTemplateData)
            await apiHelper.apiLogin('qfeng');

            //Create Case using above Case Template
            let caseData = {
                "Requester": "qtao",
                "Summary": "DRDMV-10328 Create Case",
                "Origin": "Email",
                "Case Template ID": caseTemplateResponse.displayId
            }
            caseResponse = await apiHelper.createCase(caseData);
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteAllEmailConfiguration();
            let response = await apiHelper.createEmailBox('outgoing');
            await apiHelper.createEmailProfile(response.id);
            await apiHelper.updateLOBWithEmailProfile("Human Resource", "Email Profile for Outgoing");
        });
        it('[DRDMV-10328,DRDMV-10023,DRDMV-10028]: User Activity Feeds process execution for post created by email', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseResponse.displayId);
            await viewCasePage.clickOnRequestersEmail();
            await composeEmailPo.setEmailBody('Text added for DRDMV-10328');
            await composeEmailPo.clickOnSendButton();
            await utilityCommon.closePopUpMessage();
            await activityTabPage.clickOnRefreshButton();
            await activityTabPage.clickOnShowMore();
            expect(await activityTabPage.getRecipientInTo()).toContain('To: Qianru Tao');
            expect(await activityTabPage.getEmailSubject()).toContain(caseResponse.displayId + ':DRDMV-10328 Create Case');
            expect(await activityTabPage.getEmailBody()).toContain('Text added for DRDMV-10328');
            await apiHelper.apiLogin('tadmin');
            expect(await apiCoreUtil.getProcessRunCount('com.bmc.dsm.social-lib', processName)).toEqual(1);
            await activityTabPage.addActivityNote("hello");
            await activityTabPage.clickOnPostButton();
            await browser.sleep(1000); //hardwait to complete process execution
            expect(await apiCoreUtil.getProcessRunCount('com.bmc.dsm.social-lib', processName)).toEqual(2);
            await statusBladePo.changeCaseStatus('In Progress');
            await statusBladePo.clickSaveStatus('In Progress');
            expect(await apiCoreUtil.getProcessRunCount('com.bmc.dsm.social-lib', processName)).toEqual(2);
        });
    });

    describe('[DRDMV-10024]: Flowset with multiple process mapping with different functions', () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseResponse = undefined;
        let processName1, processName2;
        beforeAll(async () => {
            //Create Process1
            await apiHelper.apiLogin('tadmin');
            processName1 = `Activity Feed Email DRDMV-10024 ${randomStr}`
            await apiHelper.createProcess(processName1, 'SOCIAL_ACTIVITY_FEED');

            //Create Process2
            processName2 = `Email Origin DRDMV-10024 ${randomStr}`
            await apiHelper.createProcess(processName2, 'EMAIL_ORIGIN');

            //Register the Process1
            await apiHelper.apiLogin('qkatawazi');
            const registerProcessData1 = {
                applicationServicesLib: "com.bmc.dsm.social-lib",
                processName: 'com.bmc.dsm.social-lib:' + processName1,
                processAliasName: processName1,
                company: 'Petramco',
                description: 'Desc ' + randomStr,
                status: 'Active'
            }
            let registeredProcessResponse1 = await apiHelper.createProcessLibConfig(registerProcessData1);

            //Register the Process2
            const registerProcessData2 = {
                applicationServicesLib: "com.bmc.dsm.case-lib",
                processName: 'com.bmc.dsm.case-lib:' + processName2,
                processAliasName: processName2,
                company: 'Petramco',
                description: 'Desc ' + randomStr,
                status: 'Active'
            }
            let registeredProcessResponse2 = await apiHelper.createProcessLibConfig(registerProcessData2);

            //Create new flowset
            let flowsetName: string = `DRDMV-10024 ${randomStr}`;
            let flowsetMandatoryFieldsData = cloneDeep(flowsetMandatoryFields);
            flowsetMandatoryFieldsData.flowsetName = flowsetName
            let flowsetResponse = await apiHelper.createNewFlowset(flowsetMandatoryFieldsData);

            //Map Process1 to Flowset
            let flowsetProcessMappingData1 = {
                function: 'User Activity Feeds',
                registeredProcessId: registeredProcessResponse1.id,
                status: 'Active',
                flowsetId: flowsetResponse.id,
                company: 'Petramco'
            }
            await apiHelper.mapProcessToFlowset(flowsetProcessMappingData1);

            //Map Process2 to Flowset
            let flowsetProcessMappingData2 = {
                function: 'Initialization',
                registeredProcessId: registeredProcessResponse2.id,
                status: 'Active',
                flowsetId: flowsetResponse.id,
                company: 'Petramco'
            }
            await apiHelper.mapProcessToFlowset(flowsetProcessMappingData2);

            //Create Case Template
            let caseTemplateData = {
                "templateName": 'DRDMV-10024 tname' + randomStr,
                "templateSummary": 'DRDMV-10024 Summary' + randomStr,
                "casePriority": "Medium",
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qfeng",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3",
                "flowset": flowsetResponse.id
            }
            let caseTemplateResponse = await apiHelper.createCaseTemplate(caseTemplateData)
            await apiHelper.apiLogin('qfeng');

            //Create Case using above Case Template
            let caseData = {
                "Requester": "qtao",
                "Summary": "DRDMV-10024 Create Case",
                "Origin": "Email",
                "Case Template ID": caseTemplateResponse.displayId
            }
            caseResponse = await apiHelper.createCase(caseData);
        });
        it('[DRDMV-10024]: Flowset with multiple process mapping with different functions', async () => {
            await apiHelper.apiLogin('tadmin');
            expect(await apiCoreUtil.getProcessRunCount('com.bmc.dsm.case-lib', `Email Origin DRDMV-10024 ${randomStr}`)).toEqual(1);
            expect(await apiCoreUtil.getProcessRunCount('com.bmc.dsm.social-lib', `Activity Feed Email DRDMV-10024 ${randomStr}`)).toEqual(0);
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseResponse.displayId);
            await activityTabPage.addActivityNote("hello");
            await activityTabPage.clickOnPostButton();
            await browser.sleep(1000); //hardwait to complete process execution
            expect(await apiCoreUtil.getProcessRunCount('com.bmc.dsm.case-lib', `Email Origin DRDMV-10024 ${randomStr}`)).toEqual(1);
            expect(await apiCoreUtil.getProcessRunCount('com.bmc.dsm.social-lib', `Activity Feed Email DRDMV-10024 ${randomStr}`)).toEqual(1);
        });
    });
});