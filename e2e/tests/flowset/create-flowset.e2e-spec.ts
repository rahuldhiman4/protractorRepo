import { browser } from "protractor";
import apiCoreUtil from '../../api/api.core.util';
import apiHelper from '../../api/api.helper';
import { CASE_MANAGEMENT_LIB_PROCESS, SOCIAL_SERVICE_PROCESS } from '../../data/ui/flowset/process-for-flowset.data.ui';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import consoleFlowset from '../../pageobject/flowset/console-flowset-config.po';
import createFlowset from '../../pageobject/flowset/create-flowset-config.po';
import editFlowset from '../../pageobject/flowset/edit-flowset-config.po';

describe('Create Flowset', () => {
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
    it('[DRDMV-6211,DRDMV-7128]: [Flowsets] Create new flowset configuration', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let drpDownStatus: string[] = ['Draft', 'Active', 'Inactive'];
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Define Flowsets', 'Flowsets - Console - Business Workflows');
        await expect(consoleFlowset.isAddFlowsetButtonDisabled()).toBeFalsy("Add flowset is disabled");
        await consoleFlowset.clickOnAddFlowset();

        //verify the Titles
        await expect(createFlowset.isCompanyTitleDisplayed('Company')).toBeTruthy(" Company Title is not present");
        await expect(createFlowset.isFlowsetNameTitleDisplayed('Flowset Name')).toBeTruthy(" Flowset Name Title is not present");
        await expect(createFlowset.isDescriptionTitleDisplayed('Description')).toBeTruthy(" Description Title is not present");
        await expect(createFlowset.isStatusTitleDisplayed('Status')).toBeTruthy(" Status Title is not present");
        await createFlowset.clickOnStatus();
        await expect(createFlowset.statusDropDownValuesDisplayed(drpDownStatus)).toBeTruthy("Given value os not present");
        //verify the Required Fields
        await expect(createFlowset.isCompanyRequiredTextDisplayed()).toBe("required", " Company Required text not present ");
        await expect(createFlowset.isFlowsetRequiredTextDisplayed()).toBe("required", " Flowset Name Required text not present ");
        await expect(createFlowset.isDescriptionRequiredTextDisplayed()).toBe("required", " Description Required text not present ");
        await expect(createFlowset.isStatusRequiredTextDisplayed()).toBe("required", " Status Required text not present ");

        //add Flowsets
        await createFlowset.selectCompany('Petramco');
        await createFlowset.setFlowsetname('Flowset' + randomStr);
        await createFlowset.setDescription("description" + randomStr);
        await createFlowset.selectStatus("Active");
        await createFlowset.clickSaveButton();
        await expect(editFlowset.getComapanyValue()).toBe('Petramco');
    });

    //ankagraw
    it('[DRDMV-6215]: [Flowsets] Edit/Delete Flowsets', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        //API call to create the flowset
        await apiHelper.apiLogin('qkatawazi');
        let flowsetData = require('../../data/ui/case/flowset.ui.json');
        let flowsetName: string = await flowsetData['flowsetMandatoryFields'].flowsetName + randomStr;
        flowsetData['flowsetMandatoryFields'].flowsetName = flowsetName;
        await apiHelper.createNewFlowset(flowsetData['flowsetMandatoryFields']);

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Define Flowsets', 'Flowsets - Console - Business Workflows');
        await consoleFlowset.searchAndSelectFlowset(flowsetName);
        await editFlowset.setFlowset("edit Flowset" + randomStr);
        await editFlowset.setDescription("edit description" + randomStr);
        await expect(editFlowset.getStatusvalue()).toBe("Active");
        await editFlowset.selectStatus("Draft");
        await editFlowset.clickSaveBtn();
        await consoleFlowset.searchAndSelectFlowset("edit Flowset" + randomStr);
        await expect(editFlowset.getStatusvalue()).toBe("Draft");
    });

    //ankagraw
    it('[DRDMV-6212]: [Flowsets] Search Flowsets on Console', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');

        //API call to create the flowset
        await apiHelper.apiLogin('qkatawazi');
        let flowsetData = require('../../data/ui/case/flowset.ui.json');
        let flowsetName: string = await flowsetData['flowsetMandatoryFields'].flowsetName + randomStr;
        flowsetData['flowsetMandatoryFields'].flowsetName = flowsetName;
        await apiHelper.createNewFlowset(flowsetData['flowsetMandatoryFields']);

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Define Flowsets', 'Flowsets - Console - Business Workflows');
        await expect(consoleFlowset.isFlowsetPresentOnGrid(flowsetName)).toBeTruthy(" Flowset is not present ")
        await expect(consoleFlowset.isDecriptionPresentOnGrid('Test Flowset name description')).toBeTruthy(" description is not present ")
        await expect(consoleFlowset.isFlowsetPresentOnGrid("FlowsetHasNoName")).toBeFalsy(" Flowset is present ")
    });

    //ankagraw
    it('[DRDMV-10022,DRDMV-10325,DRDMV-10005,DRDMV-10027]: Flowset Configuration with Process Mapping for Initialization function', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');

        await apiHelper.apiLogin('tadmin');
        let case_management = CASE_MANAGEMENT_LIB_PROCESS;
        let case_Management_Process = case_management.name + randomStr;
        case_management.name = case_Management_Process;
        await apiCoreUtil.createProcess(case_management);
        // console.log("Case Process created...", newProcessName1);
        // console.log("Case Process Name created...", newProcessName1.split(':')[1]);

        let social_Service = SOCIAL_SERVICE_PROCESS;
        let social_Service_Process = social_Service.name + randomStr;
        social_Service.name = social_Service_Process;
        await apiCoreUtil.createProcess(social_Service);
        // let processGuid1 = newProcessName2.split(':')[1]
        // console.log("Social Process created...", newProcessName2);
        // console.log("Social Process Name created...", newProcessName2.split(':')[1]);

        await apiHelper.apiLogin('qkatawazi');
        let processLibConfData = {
            applicationServicesLib: "com.bmc.dsm.case-lib",
            processName: case_Management_Process,
            processAliasName: `First Process ${randomStr}`,
            company: "Petramco",
            description: `First Descritpion${randomStr}`,
            status: "Active"
        }
        let processLibConfData1 = {
            applicationServicesLib: "com.bmc.dsm.social-lib",
            processName: social_Service_Process,
            processAliasName: `Second Process${randomStr}`,
            company: "Petramco",
            description: `Second description${randomStr}`,
            status: "Active"
        }
        await apiHelper.createProcessLibConfig(processLibConfData);
        await apiHelper.createProcessLibConfig(processLibConfData1);
        //API call to create the flowset
        await apiHelper.apiLogin('qkatawazi');
        let flowsetData = require('../../data/ui/case/flowset.ui.json');
        let flowsetName: string = await flowsetData['flowsetMandatoryFields'].flowsetName + randomStr;
        flowsetData['flowsetMandatoryFields'].flowsetName = flowsetName;
        await apiHelper.createNewFlowset(flowsetData['flowsetMandatoryFields']);

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Define Flowsets', 'Flowsets - Console - Business Workflows');
        await consoleFlowset.searchAndSelectFlowset(flowsetName);
        await editFlowset.navigateToProcessTab();
        await editFlowset.clickOnAddNewMappingBtn();
        await editFlowset.selectProcessName(`First Process ${randomStr}`);
        await editFlowset.clickSaveBtnOnProcessMapping();
        await expect(editFlowset.isFlowsetPresent('`First Process ${randomStr}`')).toBeTruthy(`First Process ${randomStr}` + "Processing mapping not visible");
        await expect(editFlowset.isProcessExecutionTypePresent('Additive')).toBeTruthy("Additive not present on grid");
        await editFlowset.clickOnAddNewMappingBtn();
        await editFlowset.selectFunction('Assignment');
        await editFlowset.selectProcessName(`Second Process ${randomStr}`);
        await editFlowset.clickSaveBtnOnProcessMapping();
        await expect(editFlowset.isFlowsetPresent(`Second Process ${randomStr}`)).toBeTruthy(`Second Process${randomStr}` + "Processing mapping not visible");
        await expect(editFlowset.isProcessExecutionTypePresent('Additive')).toBeTruthy("Additive not present on grid");
        await editFlowset.searchAndOpenFlowset('`First Process ${randomStr}`');
        await editFlowset.selectProcessExecutionType('Exclusive');
        await editFlowset.clickSaveBtnOnEditProcessMapping();
        await expect(editFlowset.isFlowsetPresent('`First Process ${randomStr}`')).toBeTruthy(`First Process ${randomStr}` + "Processing mapping not visible");
        await expect(editFlowset.isProcessExecutionTypePresent('Exclusive')).toBeTruthy("Exclusive not present on grid")
        await editFlowset.searchAndOpenFlowset(`Second Process ${randomStr}`);
        await editFlowset.selectProcessExecutionType('Exclusive');
        await editFlowset.clickSaveBtnOnEditProcessMapping();
        await expect(editFlowset.isFlowsetPresent(`Second Process ${randomStr}`)).toBeTruthy(`Second Process ${randomStr}` + "Processing mapping not visible");
        await expect(editFlowset.isProcessExecutionTypePresent('Exclusive')).toBeTruthy("Exclusive not present on grid")

        await apiHelper.apiLogin('tadmin');
        let processName = 'com.bmc.dsm.social-lib:Social - Sample Activity Update By User';
        let processName1 = 'com.bmc.dsm.case-lib:Case - Initialization';
        await apiHelper.deleteFlowsetProcessLibConfig(processName1);
        await apiHelper.deleteFlowsetProcessLibConfig(processName);
    });

    //ankagraw
    it('[DRDMV-1259]: [Permissions] Flowsets access', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');

        //API call to create the flowset
        await apiHelper.apiLogin('qkatawazi');
        let flowsetData = require('../../data/ui/case/flowset.ui.json');
        let flowsetName: string = await flowsetData['flowsetMandatoryFields'].flowsetName + randomStr;
        flowsetData['flowsetMandatoryFields'].flowsetName = flowsetName;
        await apiHelper.createNewFlowset(flowsetData['flowsetMandatoryFields']);

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Define Flowsets', 'Flowsets - Console - Business Workflows');
        await consoleFlowset.searchAndSelectFlowset(flowsetName);
        await editFlowset.setDescription("edit description" + randomStr);
        await editFlowset.clickSaveBtn();
        await expect(consoleFlowset.isFlowsetPresentOnGrid(flowsetName)).toBeTruthy(" Flowset is not present ");
        await navigationPage.signOut();
        await loginPage.login('gwixillian');
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Define Flowsets', 'Flowsets - Console - Business Workflows');
        await expect(consoleFlowset.isFlowsetPresentOnGrid(flowsetName)).toBeFalsy(" Flowset is present ");
        await navigationPage.signOut();
        await loginPage.login('qtao');
        await navigationPage.gotoSettingsPage();
        await expect(navigationPage.isSettingMenuPresent('Manage Flowsets')).toBeFalsy("Setting menu present");
    });

    //ankagraw
    it('[DRDMV-6213]: [Flowsets] Flowsets Console verification', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let randomStr1 = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let availableValues: string[] = ['Company', 'Description', 'Display ID', 'Flowset Name', 'ID', 'Status'];

        //API call to create the flowset
        await apiHelper.apiLogin('qkatawazi');
        let flowsetData = require('../../data/ui/case/flowset.ui.json');
        let flowsetName: string = await flowsetData['flowsetMandatoryFields'].flowsetName + randomStr;
        flowsetData['flowsetMandatoryFields'].flowsetName = flowsetName;
        await apiHelper.createNewFlowset(flowsetData['flowsetMandatoryFields']);

        await apiHelper.apiLogin('qkatawazi');
        let flowsetData1 = require('../../data/ui/case/flowset.ui.json');
        let flowsetName1: string = await flowsetData['flowsetMandatoryFields'].flowsetName1 + randomStr1;
        flowsetData['flowsetMandatoryFields'].flowsetName1 = flowsetName1;
        await apiHelper.createNewFlowset(flowsetData1['flowsetMandatoryFields']);

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Define Flowsets', 'Flowsets - Console - Business Workflows');
        await consoleFlowset.addColumn(["ID", 'Display ID']);
        await expect(consoleFlowset.isAllVisibleColumnPresent(availableValues)).toBeTruthy("Available value is not present");
        await consoleFlowset.searchAndSelectFlowset(flowsetName);
        await editFlowset.setFlowset("edit Flowset" + randomStr);
        await editFlowset.clickSaveBtn();
        await consoleFlowset.clickGridRefreshButton();
        await consoleFlowset.isFlowsetPresentOnGrid("edit Flowset" + randomStr);
        await consoleFlowset.clearSearcBox();
        await consoleFlowset.clickGridRefreshButton();
        await expect(consoleFlowset.getSortedValuesFromColumn("Flowset Name")).toBeTruthy("Sorted not possible");
    });
});