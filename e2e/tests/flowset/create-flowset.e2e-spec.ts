import { cloneDeep } from 'lodash';
import { browser } from "protractor";
import apiCoreUtil from '../../api/api.core.util';
import apiHelper from '../../api/api.helper';
import { flowsetGlobalFields, flowsetMandatoryFields } from '../../data/ui/flowset/flowset.ui';
import { CASE_MANAGEMENT_LIB_PROCESS, SOCIAL_SERVICE_PROCESS } from '../../data/ui/flowset/process-for-flowset.data.ui';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import consoleFlowset from '../../pageobject/settings/manage-flowset/console-flowset-config.po';
import createFlowset from '../../pageobject/settings/manage-flowset/create-flowset-config.po';
import editFlowset from '../../pageobject/settings/manage-flowset/edit-flowset-config.po';
import { BWF_BASE_URL, BWF_PAGE_TITLES } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

describe('Create Flowset', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Define Flowsets', BWF_PAGE_TITLES.MANAGE_FLOWSETS.DEFINE_FLOWSETS);
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //ankagraw
    it('[5642,5568]: [Flowsets] Create new flowset configuration', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let drpDownStatus: string[] = ['Draft', 'Active', 'Inactive'];
        await expect(consoleFlowset.isAddFlowsetButtonDisplayed()).toBeTruthy("Add flowset is disabled");
        await consoleFlowset.clickOnAddFlowset();

        //verify the Titles
        await expect(createFlowset.isCompanyTitleDisplayed('Company')).toBeTruthy(" Company Title is not present");
        await expect(createFlowset.isFlowsetNameTitleDisplayed('Flowset Name')).toBeTruthy(" Flowset Name Title is not present");
        await expect(createFlowset.isDescriptionTitleDisplayed('Description')).toBeTruthy(" Description Title is not present");
        await expect(createFlowset.isStatusTitleDisplayed('Status')).toBeTruthy(" Status Title is not present");
        await createFlowset.clickOnStatus();
        await expect(createFlowset.statusDropDownValuesDisplayed(drpDownStatus)).toBeTruthy("Given value os not present");
        //verify the Required Fields
        await expect(createFlowset.isCompanyRequiredTextDisplayed()).toBeTruthy(" Company Required text not present ");
        await expect(createFlowset.isFlowsetRequiredTextDisplayed()).toBeTruthy(" Flowset Name Required text not present ");
        await expect(createFlowset.isDescriptionRequiredTextDisplayed()).toBeTruthy(" Description Required text not present ");
        await expect(createFlowset.isStatusRequiredTextDisplayed()).toBeTruthy(" Status Required text not present ");

        //add Flowsets
        await createFlowset.selectCompany('Petramco');
        await createFlowset.setFlowsetname('Flowset' + randomStr);
        await createFlowset.setDescription("description" + randomStr);
        await createFlowset.selectStatus("Active");
        await createFlowset.clickSaveButton();
        await expect(editFlowset.getComapanyValue()).toBe('Petramco');
        await editFlowset.clickCancelFlowsetBtn();
    });

    //ankagraw
    it('[5638,5641]: [Flowsets] Edit/Delete Flowsets', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        //API call to create the flowset
        await apiHelper.apiLogin('qkatawazi');

        let flowsetMandatoryFieldsData = cloneDeep(flowsetMandatoryFields);
        flowsetMandatoryFieldsData.flowsetName = flowsetMandatoryFieldsData.flowsetName + randomStr;
        await apiHelper.createNewFlowset(flowsetMandatoryFieldsData);

        // await navigationPage.gotoSettingsPage();
        // await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Define Flowsets', BWF_PAGE_TITLES.MANAGE_FLOWSETS.DEFINE_FLOWSETS);
        await consoleFlowset.searchAndSelectFlowset(flowsetMandatoryFieldsData.flowsetName);
        await expect(consoleFlowset.isFlowsetPresentOnGrid(flowsetMandatoryFieldsData.flowsetName)).toBeTruthy(" Flowset is not present ");
        await expect(consoleFlowset.isDecriptionPresentOnGrid('Test Flowset name description')).toBeTruthy(" description is not present ");
        await expect(consoleFlowset.isFlowsetPresentOnGrid("FlowsetHasNoName")).toBeFalsy(" Flowset is present ");

        await editFlowset.setDescription("edit description" + randomStr);
        await expect(editFlowset.getStatusvalue()).toBe("Active");
        await editFlowset.selectFlowsetConfigStatus("Draft");
        await editFlowset.clickSaveBtn();
        await consoleFlowset.searchAndSelectFlowset(flowsetMandatoryFieldsData.flowsetName);
        await expect(editFlowset.getStatusvalue()).toBe("Draft");
        await editFlowset.clickCancelFlowsetBtn();
    });

    //ankagraw
    describe('[5326,5296,5328,5322]: Flowset Configuration with Process Mapping for Initialization function', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let processLibConfData, processLibConfData1, processLibConfDataFacilities, processLibConfDataFacilities1;
        let processNameCaseHR = randomStr + "CaseprocessHR";
        let processNameSocialHR = randomStr + "SocialprocessHR";
        let processNameCaseFacilities = randomStr + "CaseprocessFacilities";
        let processNameSocialFacilities = randomStr + "SocialProcessFacilities";
        let flowsetMandatoryFieldsData;
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            let case_management_HR = cloneDeep(CASE_MANAGEMENT_LIB_PROCESS);
            let case_Management_Process_HR = case_management_HR.name + processNameCaseHR;
            case_management_HR.name = case_Management_Process_HR;
            await apiCoreUtil.createProcess(case_management_HR);

            let social_Service_HR = cloneDeep(SOCIAL_SERVICE_PROCESS);
            let social_Service_Process_HR = social_Service_HR.name + processNameSocialHR;
            social_Service_HR.name = social_Service_Process_HR;
            await apiCoreUtil.createProcess(social_Service_HR);

            let case_management_Facility = cloneDeep(CASE_MANAGEMENT_LIB_PROCESS);
            let case_Management_Process_Facility = case_management_Facility.name + processNameCaseFacilities;
            case_management_Facility.name = case_Management_Process_Facility;
            await apiCoreUtil.createProcess(case_management_Facility);

            let social_Service_Facility = cloneDeep(SOCIAL_SERVICE_PROCESS);
            let social_Service_Process_Facility = social_Service_Facility.name + processNameSocialFacilities;
            social_Service_Facility.name = social_Service_Process_Facility;
            await apiCoreUtil.createProcess(social_Service_Facility);

            processLibConfData = {
                applicationServicesLib: "com.bmc.dsm.case-lib",
                processName: case_Management_Process_HR,
                processAliasName: processNameCaseHR,
                company: "Petramco",
                description: `First Descritpion${randomStr}`,
                status: "Active",
                lineOfBusiness: "Human Resource"
            }
            processLibConfData1 = {
                applicationServicesLib: "com.bmc.dsm.social-lib",
                processName: social_Service_Process_HR,
                processAliasName: processNameSocialHR,
                company: "Petramco",
                description: `Second description ${randomStr}`,
                status: "Active",
                lineOfBusiness: "Human Resource"
            }

            processLibConfDataFacilities = {
                applicationServicesLib: "com.bmc.dsm.case-lib",
                processName: case_Management_Process_Facility,
                processAliasName: processNameCaseFacilities,
                company: "Petramco",
                description: `First Descritpion${randomStr}`,
                status: "Active",
                lineOfBusiness: "Facilities"
            }
            processLibConfDataFacilities1 = {
                applicationServicesLib: "com.bmc.dsm.social-lib",
                processName: social_Service_Process_Facility,
                processAliasName: processNameSocialFacilities,
                company: "Petramco",
                description: `Second description ${randomStr}`,
                status: "Active",
                lineOfBusiness: "Facilities"
            }

            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createProcessLibConfig(processLibConfData);
            await apiHelper.createProcessLibConfig(processLibConfData1);
            //API call to create the flowset
            flowsetMandatoryFieldsData = cloneDeep(flowsetMandatoryFields);
            flowsetMandatoryFieldsData.flowsetName = flowsetMandatoryFieldsData.flowsetName + randomStr;
            await apiHelper.createNewFlowset(flowsetMandatoryFieldsData);

            await apiHelper.apiLogin('fritz');
            await apiHelper.createProcessLibConfig(processLibConfDataFacilities);
            await apiHelper.createProcessLibConfig(processLibConfDataFacilities1);
        });

        it('[5326,5296,5328,5322]: Flowset Configuration with Process Mapping for Initialization function', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Define Flowsets', BWF_PAGE_TITLES.MANAGE_FLOWSETS.DEFINE_FLOWSETS);
            await consoleFlowset.searchAndSelectFlowset(flowsetMandatoryFieldsData.flowsetName);
            await editFlowset.clickOnAddNewMappingBtn();

            //validation of registred process filteration as per LOB
            expect(await editFlowset.isProcessPresent(processNameCaseFacilities)).toBeTruthy(); // Process getting created in RD so other LOB process can be seen
            expect(await editFlowset.isProcessPresent(processNameSocialFacilities)).toBeTruthy(); // Process getting created in RD so other LOB process can be seen
            expect(await editFlowset.isProcessPresent(processNameCaseHR)).toBeTruthy();
            expect(await editFlowset.isProcessPresent(processNameSocialHR)).toBeTruthy();

            await editFlowset.selectProcess(processNameCaseHR);
            await editFlowset.selectProcessMapingStatus("Active");
            await editFlowset.clickSaveBtnOnProcessMapping();
            await expect(editFlowset.isProcessPresentOnGrid(processNameCaseHR)).toBeTruthy(`First Process ${randomStr}` + "Processing mapping not visible"); // False
            await expect(editFlowset.isProcessExecutionTypePresent('Additive')).toBeTruthy("Additive not present on grid"); // False
            await editFlowset.clickOnAddNewMappingBtn();
            await editFlowset.selectFunction('Assignment');
            await editFlowset.selectProcess(processNameSocialHR);
            await editFlowset.clickSaveBtnOnProcessMapping();
            await expect(editFlowset.isProcessPresentOnGrid(processNameSocialHR)).toBeTruthy(`Second Process${randomStr}` + "Processing mapping not visible"); // False
            await expect(editFlowset.isProcessExecutionTypePresent('Additive')).toBeTruthy("Additive not present on grid"); // False
            await editFlowset.searchAndOpenProcessMapping(processNameCaseHR);
            await editFlowset.selectProcessExecutionType('Exclusive');
            await editFlowset.clickSaveBtnOnEditProcessMapping();
            await expect(editFlowset.isProcessPresentOnGrid(processNameCaseHR)).toBeTruthy(`First Process ${randomStr}` + "Processing mapping not visible"); // False
            await expect(editFlowset.isProcessExecutionTypePresent('Exclusive')).toBeTruthy("Exclusive not present on grid"); // False
            await editFlowset.searchAndOpenProcessMapping(processNameSocialHR);
            await editFlowset.selectProcessExecutionType('Exclusive');
            await editFlowset.clickSaveBtnOnEditProcessMapping();
            await expect(editFlowset.isProcessPresentOnGrid(processNameSocialHR)).toBeTruthy(`Second Process ${randomStr}` + "Processing mapping not visible"); // False
            await expect(editFlowset.isProcessExecutionTypePresent('Exclusive')).toBeTruthy("Exclusive not present on grid"); // False
        });

        afterAll(async () => {
            await editFlowset.clickCancelFlowsetBtn();
            await apiHelper.apiLogin('tadmin');
            let processName = 'com.bmc.dsm.social-lib:Social - Sample Activity Update By User';
            let processName1 = 'com.bmc.dsm.case-lib:Case - Initialization';
            await apiHelper.deleteFlowsetProcessLibConfig(processName1);
            await apiHelper.deleteFlowsetProcessLibConfig(processName);
            await utilityCommon.closeAllBlades();
        });
    });

    //ankagraw
    describe('[6278]: [Permissions] Flowsets access', () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let flowsetMandatoryFieldsData, flowsetWithGlobalFieldsData = undefined;

        beforeAll(async () => {
            //API call to create the flowset
            await apiHelper.apiLogin('fritz');
            flowsetMandatoryFieldsData = cloneDeep(flowsetMandatoryFields);
            flowsetMandatoryFieldsData.flowsetName = flowsetMandatoryFieldsData.flowsetName + randomStr;
            flowsetMandatoryFieldsData["lineOfBusiness"] = "Facilities";
            await apiHelper.createNewFlowset(flowsetMandatoryFieldsData);

            flowsetWithGlobalFieldsData = cloneDeep(flowsetGlobalFields);
            flowsetWithGlobalFieldsData.flowsetName = flowsetWithGlobalFieldsData.flowsetName + randomStr;
            flowsetWithGlobalFieldsData["lineOfBusiness"] = "Facilities";
            await apiHelper.createNewFlowset(flowsetWithGlobalFieldsData);
        });

        it('[6278]: [Permissions] Flowsets access', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Define Flowsets', BWF_PAGE_TITLES.MANAGE_FLOWSETS.DEFINE_FLOWSETS);
            await consoleFlowset.searchAndSelectFlowset(flowsetMandatoryFieldsData.flowsetName);
            await editFlowset.setDescription("edit description" + randomStr);
            await editFlowset.clickSaveBtn();
            await expect(consoleFlowset.isFlowsetPresentOnGrid(flowsetMandatoryFieldsData.flowsetName)).toBeTruthy(" Flowset is not present ");
            await navigationPage.signOut();
            await loginPage.login('gwixillian');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Define Flowsets', BWF_PAGE_TITLES.MANAGE_FLOWSETS.DEFINE_FLOWSETS);
            await expect(consoleFlowset.isFlowsetPresentOnGrid(flowsetMandatoryFieldsData.flowsetName)).toBeFalsy(" Flowset is present ");
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotoSettingsPage();
            await expect(navigationPage.isSettingMenuPresent('Manage Flowsets')).toBeFalsy("Setting menu present");
        });

        it('[6278]: Verify if flowset is accessible to Case Manager user having access to multiple LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('qyuan');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Define Flowsets', BWF_PAGE_TITLES.MANAGE_FLOWSETS.DEFINE_FLOWSETS);
            await utilityGrid.selectLineOfBusiness('Human Resource');
            await expect(consoleFlowset.isFlowsetPresentOnGrid(flowsetMandatoryFieldsData.flowsetName)).toBeFalsy(" Flowset is present ");
            await expect(consoleFlowset.isFlowsetPresentOnGrid(flowsetWithGlobalFieldsData.flowsetName)).toBeFalsy(" Flowset is present ");

            await utilityGrid.selectLineOfBusiness('Facilities');
            await expect(consoleFlowset.isFlowsetPresentOnGrid(flowsetMandatoryFieldsData.flowsetName)).toBeTruthy("Flowset is not displayed to other LOB");
            await expect(consoleFlowset.isFlowsetPresentOnGrid(flowsetWithGlobalFieldsData.flowsetName)).toBeTruthy(" Flowset is not displayed to other LOB");
        });

        it('[6278]: Verify if flowset is accessible to Case BA user having access to multiple LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Define Flowsets', BWF_PAGE_TITLES.MANAGE_FLOWSETS.DEFINE_FLOWSETS);
            await utilityGrid.selectLineOfBusiness('Human Resource');
            await expect(consoleFlowset.isFlowsetPresentOnGrid(flowsetMandatoryFieldsData.flowsetName)).toBeFalsy(" Flowset is present ");
            await expect(consoleFlowset.isFlowsetPresentOnGrid(flowsetWithGlobalFieldsData.flowsetName)).toBeFalsy(" Flowset is present ");

            await utilityGrid.selectLineOfBusiness('Facilities');
            await expect(consoleFlowset.isFlowsetPresentOnGrid(flowsetMandatoryFieldsData.flowsetName)).toBeTruthy("Flowset is not displayed to other LOB");
            await expect(consoleFlowset.isFlowsetPresentOnGrid(flowsetWithGlobalFieldsData.flowsetName)).toBeTruthy(" Flowset is not displayed to other LOB");
        });
        it('[6278]: Validate create new record with same name in same LOB', async () => {
            await consoleFlowset.clickOnAddFlowset();
            await createFlowset.selectCompany('Petramco');
            await createFlowset.setFlowsetname(flowsetMandatoryFieldsData.flowsetName);
            await createFlowset.setDescription("description" + randomStr);
            await createFlowset.selectStatus("Active");
            await createFlowset.clickSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Flowset with the same name already exists. Specify a different name.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
            await utilityCommon.closePopUpMessage();
            await createFlowset.clickCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });

        it('[6278]:  Validate create new record with same name in different LOB', async () => {
            await utilityGrid.selectLineOfBusiness('Human Resource');
            await consoleFlowset.clickOnAddFlowset();
            await createFlowset.selectCompany('Petramco');
            await createFlowset.setFlowsetname(flowsetMandatoryFieldsData.flowsetName);
            await createFlowset.setDescription("description" + randomStr);
            await createFlowset.selectStatus("Active");
            await createFlowset.clickSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
        });

        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Define Flowsets', BWF_PAGE_TITLES.MANAGE_FLOWSETS.DEFINE_FLOWSETS);
        });
    });

    //ankagraw
    describe('[5640]: [Flowsets] Flowsets Console verification', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let availableValues: string[] = ['Company', 'Description', 'Display ID', 'Flowset Name', 'ID', 'Status'];
        let flowsetName;
        beforeAll(async () => {
            //API call to create the flowset
            await apiHelper.apiLogin('qkatawazi');
            let flowsetMandatoryFieldsData = cloneDeep(flowsetMandatoryFields);
            flowsetName = flowsetMandatoryFieldsData.flowsetName = flowsetMandatoryFieldsData.flowsetName + randomStr;
            await apiHelper.createNewFlowset(flowsetMandatoryFieldsData);
        });
        it('[5640]: [Flowsets] Flowsets Console verification', async () => {
            await consoleFlowset.addColumn(["ID", 'Display ID']);
            await expect(consoleFlowset.isAllVisibleColumnPresent(availableValues)).toBeTruthy("Available value is not present");
            await consoleFlowset.clickGridRefreshButton();
            expect(await consoleFlowset.isFlowsetPresentOnGrid(flowsetName)).toBeTruthy();
            await consoleFlowset.clearSearcBox();
            await consoleFlowset.clickGridRefreshButton();
            await expect(consoleFlowset.getSortedValuesFromColumn("Flowset Name")).toBeTruthy("Sorted not possible");
        });

        it('[5640]: Verify if flowset is accessible to same LOB Case Manager', async () => {
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Define Flowsets', BWF_PAGE_TITLES.MANAGE_FLOWSETS.DEFINE_FLOWSETS);
            expect(await consoleFlowset.isFlowsetPresentOnGrid(flowsetName)).toBeTruthy('Flowset is not dispayed to same LOB case manager');
        });

        it('[5640]: Verify if flowset  is accessible to different LOB Case BA', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Define Flowsets', BWF_PAGE_TITLES.MANAGE_FLOWSETS.DEFINE_FLOWSETS);
            expect(await consoleFlowset.isFlowsetPresentOnGrid(flowsetName)).toBeFalsy('Flowset is dispayed to different LOB case BA');
        });

        it('[5640]: Verify if flowset is accessible to different LOB Case Manager', async () => {
            await navigationPage.signOut();
            await loginPage.login('frieda');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Define Flowsets', BWF_PAGE_TITLES.MANAGE_FLOWSETS.DEFINE_FLOWSETS);
            expect(await consoleFlowset.isFlowsetPresentOnGrid(flowsetName)).toBeFalsy('Flowset is dispayed to different LOB case manager');
        });

        it('[5640]: Verify if flowset is accessible to Case BA belonging to different company with same LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('gwixillian');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Define Flowsets', BWF_PAGE_TITLES.MANAGE_FLOWSETS.DEFINE_FLOWSETS);
            expect(await consoleFlowset.isFlowsetPresentOnGrid(flowsetName)).toBeTruthy('Flowset is not dispayed to same LOB and different company case BA');
        });

        it('[5640]: Verify if flowset is accessible to Case Manager user having access to multiple LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('qyuan');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Define Flowsets', BWF_PAGE_TITLES.MANAGE_FLOWSETS.DEFINE_FLOWSETS);
            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await consoleFlowset.isFlowsetPresentOnGrid(flowsetName)).toBeTruthy('Flowset is dispayed to user with multiple LOB case manager');
            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await consoleFlowset.isFlowsetPresentOnGrid(flowsetName)).toBeFalsy('Flowset is not dispayed to user with multiple LOB case manager');
        });

        it('[5640]: Verify if flowset is accessible to Case BA user having access to multiple LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Define Flowsets', BWF_PAGE_TITLES.MANAGE_FLOWSETS.DEFINE_FLOWSETS);
            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await consoleFlowset.isFlowsetPresentOnGrid(flowsetName)).toBeTruthy('Flowset is dispayed to user with multiple LOB case manager');
            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await consoleFlowset.isFlowsetPresentOnGrid(flowsetName)).toBeFalsy('Flowset is not dispayed to user with multiple LOB case manager');
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Define Flowsets', BWF_PAGE_TITLES.MANAGE_FLOWSETS.DEFINE_FLOWSETS);
        });


    });

    //ankagraw
    describe('[5639]: [Flowsets] Filter menu verification on Define Flowsets Console	', () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let availableValues: string[] = ['Company', 'Description', 'Display ID', 'Flowset Name', 'ID', 'Status'];
        let id, displayId, flowsetMandatoryFieldsData;
        beforeAll(async () => {
            //API call to create the flowset
            await apiHelper.apiLogin('qkatawazi');
            flowsetMandatoryFieldsData = cloneDeep(flowsetMandatoryFields);
            flowsetMandatoryFieldsData.flowsetName = flowsetMandatoryFieldsData.flowsetName + randomStr;
            let flowset = await apiHelper.createNewFlowset(flowsetMandatoryFieldsData);
            id = flowset.id;
            displayId = flowset.displayId;
        });

        it('[5639]: [Flowsets] Filter menu verification on Define Flowsets Console	', async () => {
            await consoleFlowset.addColumn(["ID", 'Display ID']);
            await expect(consoleFlowset.isAllVisibleColumnPresent(availableValues)).toBeTruthy("Available value is not present");

            await utilityGrid.addFilter("Flowset Name", flowsetMandatoryFieldsData.flowsetName, "text");
            expect(await utilityGrid.isGridRecordPresent(flowsetMandatoryFieldsData.flowsetName)).toBeTruthy('flowsetName not present');
            await utilityGrid.clearFilter();

            await utilityGrid.addFilter("Description", "Test Flowset name description", "text");
            expect(await utilityGrid.isGridRecordPresent('Test Flowset name description')).toBeTruthy('Test Flowset name description not present');
            await utilityGrid.clearFilter();
        });

        it('[5639]: [Flowsets] Filter menu verification on Define Flowsets Console	', async () => {
            await utilityGrid.addFilter("Company", "Petramco", "text");
            expect(await utilityGrid.isGridRecordPresent('Petramco')).toBeTruthy('Petramco not present');
            await utilityGrid.clearFilter();

            await utilityGrid.addFilter("Status", "Active", "checkbox");
            expect(await utilityGrid.isGridRecordPresent(flowsetMandatoryFieldsData.flowsetName)).toBeTruthy('Active not present');
            await utilityGrid.clearFilter();

            await utilityGrid.addFilter("Display ID", displayId, "text");
            expect(await utilityGrid.isGridRecordPresent(displayId)).toBeTruthy(displayId + ' not present');
            await utilityGrid.clearFilter();

            await utilityGrid.addFilter("ID", id, "text");
            expect(await utilityGrid.isGridRecordPresent(id)).toBeTruthy(id + ' not present');
            await utilityGrid.clearFilter();

            await consoleFlowset.removeColumn(["ID", 'Display ID']);
        });
    });
});
