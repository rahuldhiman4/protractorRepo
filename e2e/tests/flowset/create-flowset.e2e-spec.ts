import { browser } from "protractor";
import apiCoreUtil from '../../api/api.core.util';
import apiHelper from '../../api/api.helper';
import { CASE_MANAGEMENT_LIB_PROCESS, SOCIAL_SERVICE_PROCESS } from '../../data/ui/flowset/process-for-flowset.data.ui';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import consoleFlowset from '../../pageobject/settings/manage-flowset/console-flowset-config.po';
import createFlowset from '../../pageobject/settings/manage-flowset/create-flowset-config.po';
import editFlowset from '../../pageobject/settings/manage-flowset/edit-flowset-config.po';
import { BWF_BASE_URL, BWF_PAGE_TITLES } from '../../utils/constants';
import utilGrid from '../../utils/util.grid';
import utilityCommon from '../../utils/utility.common';
import { flowsetMandatoryFields, flowsetGlobalFields } from '../../data/ui/flowset/flowset.ui';
import { cloneDeep } from 'lodash';
import utilCommon from '../../utils/util.common';
let userData, userData1, userData2 = undefined;

describe('Create Flowset', () => {
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
    it('[5642,5568]: [Flowsets] Create new flowset configuration', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let drpDownStatus: string[] = ['Draft', 'Active', 'Inactive'];
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Define Flowsets', BWF_PAGE_TITLES.MANAGE_FLOWSETS.DEFINE_FLOWSETS);
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
    });

    //ankagraw
    it('[5638]: [Flowsets] Edit/Delete Flowsets', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        //API call to create the flowset
        await apiHelper.apiLogin('qkatawazi');

        let flowsetMandatoryFieldsData = cloneDeep(flowsetMandatoryFields);
        flowsetMandatoryFieldsData.flowsetName = flowsetMandatoryFieldsData.flowsetName + randomStr;
        await apiHelper.createNewFlowset(flowsetMandatoryFieldsData);

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Define Flowsets', BWF_PAGE_TITLES.MANAGE_FLOWSETS.DEFINE_FLOWSETS);
        await consoleFlowset.searchAndSelectFlowset(flowsetMandatoryFieldsData.flowsetName);
        await editFlowset.setFlowset("edit Flowset" + randomStr);
        await editFlowset.setDescription("edit description" + randomStr);
        await expect(editFlowset.getStatusvalue()).toBe("Active");
        await editFlowset.selectStatus("Draft");
        await editFlowset.clickSaveBtn();
        await consoleFlowset.searchAndSelectFlowset("edit Flowset" + randomStr);
        await expect(editFlowset.getStatusvalue()).toBe("Draft");
    });

    //ankagraw
    it('[5641]: [Flowsets] Search Flowsets on Console', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');

        //API call to create the flowset
        await apiHelper.apiLogin('qkatawazi');
        let flowsetMandatoryFieldsData = cloneDeep(flowsetMandatoryFields);
        flowsetMandatoryFieldsData.flowsetName = flowsetMandatoryFieldsData.flowsetName + randomStr;
        await apiHelper.createNewFlowset(flowsetMandatoryFieldsData);

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Define Flowsets', BWF_PAGE_TITLES.MANAGE_FLOWSETS.DEFINE_FLOWSETS);
        await expect(consoleFlowset.isFlowsetPresentOnGrid(flowsetMandatoryFieldsData.flowsetName)).toBeTruthy(" Flowset is not present ")
        await expect(consoleFlowset.isDecriptionPresentOnGrid('Test Flowset name description')).toBeTruthy(" description is not present ")
        await expect(consoleFlowset.isFlowsetPresentOnGrid("FlowsetHasNoName")).toBeFalsy(" Flowset is present ")
    });

    //ankagraw
    describe('[5326,5296,5328,5322]: Flowset Configuration with Process Mapping for Initialization function', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let processLibConfData, processLibConfData1, processLibConfDataFacilities, processLibConfDataFacilities1;
        let processAliasNameCaseHR = "case process HR" + randomStr;
        let processAliasNameSocialHR = "social process HR" + randomStr;
        let processAliasNameCaseFacilities = "case process Facilities" + randomStr;
        let processAliasNameSocialFacilities = "social process Facilities" + randomStr;
        let flowsetMandatoryFieldsData;
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            let case_management = CASE_MANAGEMENT_LIB_PROCESS;
            let case_Management_Process = case_management.name + randomStr;
            case_management.name = case_Management_Process;
            await apiCoreUtil.createProcess(case_management);

            let social_Service = SOCIAL_SERVICE_PROCESS;
            let social_Service_Process = social_Service.name + randomStr;
            social_Service.name = social_Service_Process;
            await apiCoreUtil.createProcess(social_Service);

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
            processLibConfData1 = {
                applicationServicesLib: "com.bmc.dsm.social-lib",
                processName: social_Service_Process,
                processAliasName: processAliasNameSocialHR,
                company: "Petramco",
                description: `Second description ${randomStr}`,
                status: "Active",
                lineOfBusiness: "Human Resource"
            }

            processLibConfDataFacilities = {
                applicationServicesLib: "com.bmc.dsm.case-lib",
                processName: case_Management_Process,
                processAliasName: processAliasNameCaseFacilities,
                company: "Petramco",
                description: `First Descritpion${randomStr}`,
                status: "Active",
                lineOfBusiness: "Facilities"
            }
            processLibConfDataFacilities1 = {
                applicationServicesLib: "com.bmc.dsm.social-lib",
                processName: social_Service_Process,
                processAliasName: processAliasNameSocialFacilities,
                company: "Petramco",
                description: `Second description ${randomStr}`,
                status: "Active",
                lineOfBusiness: "Facilities"
            }

            await apiHelper.createProcessLibConfig(processLibConfData);
            await apiHelper.createProcessLibConfig(processLibConfData1);
            //API call to create the flowset
            await apiHelper.apiLogin('qkatawazi');
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
            await editFlowset.clickOnSelectProcessDropDown();

            //validation of registred process filteration as per LOB
            expect(await editFlowset.isProcessNameOptionPresentInDropDown(processAliasNameCaseFacilities)).toBeFalsy();
            expect(await editFlowset.isProcessNameOptionPresentInDropDown(processAliasNameSocialFacilities)).toBeFalsy();
            expect(await editFlowset.isProcessNameOptionPresentInDropDown(processAliasNameCaseHR)).toBeTruthy();
            expect(await editFlowset.isProcessNameOptionPresentInDropDown(processAliasNameSocialHR)).toBeTruthy();
            await utilCommon.closeBladeOnSettings();

            await editFlowset.clickOnAddNewMappingBtn();
            await editFlowset.selectProcessName(processAliasNameCaseHR);
            await editFlowset.selectStatus("Active");
            await editFlowset.clickSaveBtnOnProcessMapping();
            await expect(editFlowset.searchProcessMappingName(processAliasNameCaseHR)).toBeTruthy(`First Process ${randomStr}` + "Processing mapping not visible");
            await expect(editFlowset.isProcessExecutionTypePresent('Additive')).toBeTruthy("Additive not present on grid");
            await editFlowset.clickOnAddNewMappingBtn();
            await editFlowset.selectFunction('Assignment');
            await editFlowset.selectProcessName(processAliasNameSocialHR);
            await editFlowset.clickSaveBtnOnProcessMapping();
            await expect(editFlowset.searchProcessMappingName(processAliasNameSocialHR)).toBeTruthy(`Second Process${randomStr}` + "Processing mapping not visible");
            await expect(editFlowset.isProcessExecutionTypePresent('Additive')).toBeTruthy("Additive not present on grid");
            await editFlowset.searchAndOpenProcessMapping(processAliasNameCaseHR);
            await editFlowset.selectProcessExecutionType('Exclusive');
            await editFlowset.clickSaveBtnOnEditProcessMapping();
            await expect(editFlowset.searchProcessMappingName(processAliasNameCaseHR)).toBeTruthy(`First Process ${randomStr}` + "Processing mapping not visible");
            await expect(editFlowset.isProcessExecutionTypePresent('Exclusive')).toBeTruthy("Exclusive not present on grid")
            await editFlowset.searchAndOpenProcessMapping(processAliasNameSocialHR);
            await editFlowset.selectProcessExecutionType('Exclusive');
            await editFlowset.clickSaveBtnOnEditProcessMapping();
            await expect(editFlowset.searchProcessMappingName(processAliasNameSocialHR)).toBeTruthy(`Second Process ${randomStr}` + "Processing mapping not visible");
            await expect(editFlowset.isProcessExecutionTypePresent('Exclusive')).toBeTruthy("Exclusive not present on grid")

            await apiHelper.apiLogin('tadmin');
            let processName = 'com.bmc.dsm.social-lib:Social - Sample Activity Update By User';
            let processName1 = 'com.bmc.dsm.case-lib:Case - Initialization';
            await apiHelper.deleteFlowsetProcessLibConfig(processName1);
            await apiHelper.deleteFlowsetProcessLibConfig(processName);
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
            await loginPage.login('caseMngrMultiLOB@petramco.com', 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Define Flowsets', BWF_PAGE_TITLES.MANAGE_FLOWSETS.DEFINE_FLOWSETS);
            await utilGrid.selectLineOfBusiness('Human Resource');
            await expect(consoleFlowset.isFlowsetPresentOnGrid(flowsetMandatoryFieldsData.flowsetName)).toBeFalsy(" Flowset is present ");
            await expect(consoleFlowset.isFlowsetPresentOnGrid(flowsetWithGlobalFieldsData.flowsetName)).toBeFalsy(" Flowset is present ");

            await utilGrid.selectLineOfBusiness('Facilities');
            await expect(consoleFlowset.isFlowsetPresentOnGrid(flowsetMandatoryFieldsData.flowsetName)).toBeTruthy("Flowset is not displayed to other LOB");
            await expect(consoleFlowset.isFlowsetPresentOnGrid(flowsetWithGlobalFieldsData.flowsetName)).toBeTruthy(" Flowset is not displayed to other LOB");
        });

        it('[6278]: Verify if flowset is accessible to Case BA user having access to multiple LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('caseBAMultiLOB@petramco.com', 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Define Flowsets', BWF_PAGE_TITLES.MANAGE_FLOWSETS.DEFINE_FLOWSETS);
            await utilGrid.selectLineOfBusiness('Human Resource');
            await expect(consoleFlowset.isFlowsetPresentOnGrid(flowsetMandatoryFieldsData.flowsetName)).toBeFalsy(" Flowset is present ");
            await expect(consoleFlowset.isFlowsetPresentOnGrid(flowsetWithGlobalFieldsData.flowsetName)).toBeFalsy(" Flowset is present ");

            await utilGrid.selectLineOfBusiness('Facilities');
            await expect(consoleFlowset.isFlowsetPresentOnGrid(flowsetMandatoryFieldsData.flowsetName)).toBeTruthy("Flowset is not displayed to other LOB");
            await expect(consoleFlowset.isFlowsetPresentOnGrid(flowsetWithGlobalFieldsData.flowsetName)).toBeTruthy(" Flowset is not displayed to other LOB");
        });

        it('[6278]: Validate create new record with same name in same LOB', async () => {
            await consoleFlowset.searchAndSelectFlowset(flowsetMandatoryFieldsData.flowsetName);
            await editFlowset.setFlowset(flowsetWithGlobalFieldsData.flowsetName);
            await editFlowset.clickSaveBtn();
            expect(await utilCommon.isPopUpMessagePresent('ERROR (222175): Flowset with the same name already exists. Specify a different name.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
            await editFlowset.clickCancelFlowsetBtn();
            await utilCommon.clickOnWarningOk();
            await consoleFlowset.clickOnAddFlowset();
            await createFlowset.selectCompany('Petramco');
            await createFlowset.setFlowsetname(flowsetMandatoryFieldsData.flowsetName);
            await createFlowset.setDescription("description" + randomStr);
            await createFlowset.selectStatus("Active");
            await createFlowset.clickSaveButton();
            expect(await utilCommon.isPopUpMessagePresent('ERROR (222175): Flowset with the same name already exists. Specify a different name.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
            await createFlowset.clickCancelButton();
            await utilCommon.clickOnWarningOk();    
        });

        it('[6278]:  Validate create new record with same name in different LOB', async () => {
            await utilGrid.selectLineOfBusiness('Human Resource');
            await consoleFlowset.clickOnAddFlowset();
            await createFlowset.selectCompany('Petramco');
            await createFlowset.setFlowsetname(flowsetMandatoryFieldsData.flowsetName);
            await createFlowset.setDescription("description" + randomStr);
            await createFlowset.selectStatus("Active");
            await createFlowset.clickSaveButton();
            expect(await utilCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //ankagraw
    describe('[5640]: [Flowsets] Flowsets Console verification', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let randomStr1 = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let availableValues: string[] = ['Company', 'Description', 'Display ID', 'Flowset Name', 'ID', 'Status'];

        it('[5640]: [Flowsets] Flowsets Console verification', async () => {

            //API call to create the flowset
            await apiHelper.apiLogin('qkatawazi');
            let flowsetMandatoryFieldsData = cloneDeep(flowsetMandatoryFields);
            flowsetMandatoryFieldsData.flowsetName = flowsetMandatoryFieldsData.flowsetName + randomStr;
            await apiHelper.createNewFlowset(flowsetMandatoryFieldsData);

            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Define Flowsets', BWF_PAGE_TITLES.MANAGE_FLOWSETS.DEFINE_FLOWSETS);
            await consoleFlowset.addColumn(["ID", 'Display ID']);
            await expect(consoleFlowset.isAllVisibleColumnPresent(availableValues)).toBeTruthy("Available value is not present");
            await consoleFlowset.searchAndSelectFlowset(flowsetMandatoryFieldsData.flowsetName);
            await editFlowset.setFlowset("edit Flowset" + randomStr);
            await editFlowset.clickSaveBtn();
            await consoleFlowset.clickGridRefreshButton();
            expect(await consoleFlowset.isFlowsetPresentOnGrid("edit Flowset" + randomStr)).toBeTruthy();
            await consoleFlowset.clearSearcBox();
            await consoleFlowset.clickGridRefreshButton();
            await expect(consoleFlowset.getSortedValuesFromColumn("Flowset Name")).toBeTruthy("Sorted not possible");
        });

        it('[5640]: Verify if flowset is accessible to same LOB Case Manager', async () => {
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Define Flowsets', BWF_PAGE_TITLES.MANAGE_FLOWSETS.DEFINE_FLOWSETS);
            expect(await consoleFlowset.isFlowsetPresentOnGrid("edit Flowset" + randomStr)).toBeTruthy('Flowset is not dispayed to same LOB case manager');
        });

        it('[5640]: Verify if flowset  is accessible to different LOB Case BA', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Define Flowsets', BWF_PAGE_TITLES.MANAGE_FLOWSETS.DEFINE_FLOWSETS);
            expect(await consoleFlowset.isFlowsetPresentOnGrid("edit Flowset" + randomStr)).toBeFalsy('Flowset is dispayed to different LOB case BA');
        });

        it('[5640]: Verify if flowset is accessible to different LOB Case Manager', async () => {
            await navigationPage.signOut();
            await loginPage.login('frieda');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Define Flowsets', BWF_PAGE_TITLES.MANAGE_FLOWSETS.DEFINE_FLOWSETS);
            expect(await consoleFlowset.isFlowsetPresentOnGrid("edit Flowset" + randomStr)).toBeFalsy('Flowset is dispayed to different LOB case manager');
        });

        it('[5640]: Verify if flowset is accessible to Case BA belonging to different company with same LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('gwixillian');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Define Flowsets', BWF_PAGE_TITLES.MANAGE_FLOWSETS.DEFINE_FLOWSETS);
            expect(await consoleFlowset.isFlowsetPresentOnGrid("edit Flowset" + randomStr)).toBeTruthy('Flowset is not dispayed to same LOB and different company case BA');
        });

        it('[5640]: Verify if flowset is accessible to Case Manager user having access to multiple LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('caseMngrMultiLOB@petramco.com', 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Define Flowsets', BWF_PAGE_TITLES.MANAGE_FLOWSETS.DEFINE_FLOWSETS);
            await utilGrid.selectLineOfBusiness('Human Resource');
            expect(await consoleFlowset.isFlowsetPresentOnGrid("edit Flowset" + randomStr)).toBeTruthy('Flowset is dispayed to user with multiple LOB case manager');
            await utilGrid.selectLineOfBusiness('Facilities');
            expect(await consoleFlowset.isFlowsetPresentOnGrid("edit Flowset" + randomStr)).toBeFalsy('Flowset is not dispayed to user with multiple LOB case manager');
        });

        it('[5640]: Verify if flowset is accessible to Case BA user having access to multiple LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('caseBAMultiLOB@petramco.com', 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Define Flowsets', BWF_PAGE_TITLES.MANAGE_FLOWSETS.DEFINE_FLOWSETS);
            await utilGrid.selectLineOfBusiness('Human Resource');
            expect(await consoleFlowset.isFlowsetPresentOnGrid("edit Flowset" + randomStr)).toBeTruthy('Flowset is dispayed to user with multiple LOB case manager');
            await utilGrid.selectLineOfBusiness('Facilities');
            expect(await consoleFlowset.isFlowsetPresentOnGrid("edit Flowset" + randomStr)).toBeFalsy('Flowset is not dispayed to user with multiple LOB case manager');
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
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
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Define Flowsets', BWF_PAGE_TITLES.MANAGE_FLOWSETS.DEFINE_FLOWSETS);
            await consoleFlowset.addColumn(["ID", 'Display ID']);
            await expect(consoleFlowset.isAllVisibleColumnPresent(availableValues)).toBeTruthy("Available value is not present");

            await utilGrid.addFilter("Flowset Name", flowsetMandatoryFieldsData.flowsetName, "text");
            expect(await utilGrid.isGridRecordPresent(flowsetMandatoryFieldsData.flowsetName)).toBeTruthy('flowsetName not present');
            await utilGrid.clearFilter();

            await utilGrid.addFilter("Description", "Test Flowset name description", "text");
            expect(await utilGrid.isGridRecordPresent('Test Flowset name description')).toBeTruthy('Test Flowset name description not present');
            await utilGrid.clearFilter();
        });

        it('[5639]: [Flowsets] Filter menu verification on Define Flowsets Console	', async () => {
            await utilGrid.addFilter("Company", "Petramco", "text");
            expect(await utilGrid.isGridRecordPresent('Petramco')).toBeTruthy('Petramco not present');
            await utilGrid.clearFilter();

            await utilGrid.addFilter("Status", "Active", "checkbox");
            expect(await utilGrid.isGridRecordPresent(flowsetMandatoryFieldsData.flowsetName)).toBeTruthy('Active not present');
            await utilGrid.clearFilter();

            await utilGrid.addFilter("Display ID", displayId, "text");
            expect(await utilGrid.isGridRecordPresent(displayId)).toBeTruthy(displayId + ' not present');
            await utilGrid.clearFilter();

            await utilGrid.addFilter("ID", id, "text");
            expect(await utilGrid.isGridRecordPresent(id)).toBeTruthy(id + ' not present');
            await utilGrid.clearFilter();

            await consoleFlowset.removeColumn(["ID", 'Display ID']);
        });
    });
});
