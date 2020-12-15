import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import consoleFlowsetConfigPage from '../../pageobject/settings/manage-flowset/console-flowset-config.po';
import editFlowsetConfigPo from '../../pageobject/settings/manage-flowset/edit-flowset-config.po';
import createCaseTemplatePage from '../../pageobject/settings/case-management/create-casetemplate.po';
import consoleCasetemplatePage from '../../pageobject/settings/case-management/console-casetemplate.po';
import createCasePage from '../../pageobject/case/create-case.po';
import previewCasePage from '../../pageobject/case/case-preview.po';
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import viewCasePage from '../../pageobject/case/view-case.po';
import utilGrid from '../../utils/util.grid';
import {flowsetGlobalFields, flowsetGlobalInActiveFields} from '../../data/ui/flowset/flowset.ui';
import { cloneDeep } from 'lodash';
import { ALL_FIELD } from '../../data/ui/case/casetemplate.data.ui';
import createCasetemplatePo from '../../pageobject/settings/case-management/create-casetemplate.po';
import { AUTO_STATUS_TRANSITION_MANDATORY_FIELDS } from '../../data/ui/case/automated-status-transition.data.ui';
import automatedStatusTransitionConsole from "../../pageobject/settings/case-management/automated-status-transition-console.po";
import automatedStatusTransitionCreatePage from "../../pageobject/settings/case-management/create-automated-status-config.po";
import automatedStatusTransitionEditPage from "../../pageobject/settings/case-management/edit-automated-status-config.po";
import utilCommon from '../../utils/util.common';
import consoleEmailTemplatePo from '../../pageobject/settings/email/console-email-template.po';
import createEmailTemplatePo from '../../pageobject/settings/email/create-email-template.po';
import createAcknowledgmentTemplatesPo from '../../pageobject/settings/email/create-acknowledgment-template.po';
import consoleAcknowledgmentTemplatePo from '../../pageobject/settings/email/console-acknowledgment-template.po';
import createCasePo from '../../pageobject/case/create-case.po';
import changeAssignmentBladePo from '../../pageobject/common/change-assignment-blade.po';
import editCasePo from '../../pageobject/case/edit-case.po';
import utilityGrid from '../../utils/utility.grid';
import quickCasePo from '../../pageobject/case/quick-case.po';
import previewCaseTemplateCasesPo from '../../pageobject/settings/case-management/preview-case-template.po';
import previewKnowledgePo from '../../pageobject/knowledge/preview-knowledge.po';
import resourcesPo from '../../pageobject/common/resources-tab.po';
import accessTabPo from '../../pageobject/common/access-tab.po';

let userData1;
describe('Create Process in Flowset', () => {
    let personDataFile = require('../../data/ui/foundation/person.ui.json');
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
        await createNewUsers();
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    async function createNewUsers() {
        await apiHelper.apiLogin('tadmin');
        userData1 = {
            "firstName": "Petramco",
            "lastName": "SGUser1",
            "userId": "13550User1",
            "userPermission": ["Case Business Analyst", "Human Resource"]
        }
        await apiHelper.createNewUser(userData1);
        await apiHelper.associatePersonToCompany(userData1.userId, "Petramco");
        await apiHelper.associatePersonToCompany(userData1.userId, "- Global -");
        await apiHelper.associatePersonToCompany(userData1.userId, "Psilon");
        await apiHelper.associatePersonToSupportGroup(userData1.userId, "Psilon Support Group1");
        await browser.sleep(3000); // timeout requried to reflect data on UI
        let personData1 = personDataFile['PhylumCaseAgent1'];
        await apiHelper.createNewUser(personData1);
        await apiHelper.associatePersonToSupportGroup(personData1.userId, 'Phylum Support Group1');
        await apiHelper.associatePersonToCompany(personData1.userId, 'Phylum');
    }

    //apurva
    describe('[DRDMV-17555]: Create new automatic case status transition rule for one line of Business', async () => {
        let tempData, configName1, randomStr = [...Array(7)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        it('[DRDMV-17555]: Create record', async () => {
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.deleteAutomatedCaseStatusTransition();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Automated Status Transition', 'Configure Automated Status Transitions - Business Workflows');
            //Create first Record
            configName1 = AUTO_STATUS_TRANSITION_MANDATORY_FIELDS.name = 'ConfigName1' + randomStr;
            AUTO_STATUS_TRANSITION_MANDATORY_FIELDS.changeStatusAfter = Math.floor(Math.random() * 180) + 1;
            await automatedStatusTransitionConsole.clickAddAutomatedStatusTransitionBtn();
            await automatedStatusTransitionCreatePage.createAutomatedStatusTransition(AUTO_STATUS_TRANSITION_MANDATORY_FIELDS);
        });
        it('[DRDMV-17555]: Create new automatic case status transition rule for one line of Business', async () => {
            await utilGrid.clearGridSearchBox();
            expect(await utilGrid.isGridRecordPresent(configName1)).toBeTruthy();
            await navigationPage.signOut();
            await loginPage.login('qliu');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Automated Status Transition', 'Configure Automated Status Transitions - Business Workflows');
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(configName1);
            await automatedStatusTransitionEditPage.updateConfigurationName('UpdatedConfigName1' + randomStr);
            await automatedStatusTransitionEditPage.saveConfiguration();
            await utilGrid.clearGridSearchBox();
            expect(await utilGrid.isGridRecordPresent('UpdatedConfigName1' + randomStr)).toBeTruthy();
        });
        it('[DRDMV-17555]: Create new automatic case status transition rule for one line of Business', async () => {
            await navigationPage.signOut();
            await loginPage.login('frieda');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Automated Status Transition', 'Configure Automated Status Transitions - Business Workflows');
            await utilGrid.clearFilter();
            expect(await utilGrid.isGridRecordPresent('UpdatedConfigName1' + randomStr)).toBeFalsy();
        });
        it('[DRDMV-17555]: Create new automatic case status transition rule for one line of Business', async () => {
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Automated Status Transition', 'Configure Automated Status Transitions - Business Workflows');
            await utilGrid.selectLineOfBusiness("Human Resource");
            await utilGrid.clearFilter();
            expect(await utilGrid.isGridRecordPresent('UpdatedConfigName1' + randomStr)).toBeTruthy();
            await utilGrid.selectLineOfBusiness("Facilities");
            await utilGrid.clearFilter();
            expect(await utilGrid.isGridRecordPresent('UpdatedConfigName1' + randomStr)).toBeFalsy();
        });
        it('[DRDMV-17555]: create same name record in same LOB', async () => {
            //create same name record in same LOB
            tempData = cloneDeep(AUTO_STATUS_TRANSITION_MANDATORY_FIELDS);
            tempData.name = 'UpdatedConfigName1' + randomStr;
            tempData.changeStatusAfter = 3;
            tempData.fromStatus = "In Progress";
            tempData.toStatus = "Pending";
            await utilGrid.selectLineOfBusiness('Human Resource');
            await automatedStatusTransitionConsole.clickAddAutomatedStatusTransitionBtn();
            await automatedStatusTransitionCreatePage.createAutomatedStatusTransition(tempData);
            expect(await utilCommon.isPopUpMessagePresent('ERROR (10000): Automated Status Configuration with same name already exists. Please select a different name.')).toBeTruthy("Error message absent");
            await automatedStatusTransitionCreatePage.clickCancelBtn();
            await utilCommon.clickOnWarningOk();
        });
        it('[DRDMV-17555]: create same name record in different LOB', async () => {
            //create same name record in different LOB
            await utilGrid.selectLineOfBusiness('Facilities');
            await automatedStatusTransitionConsole.clickAddAutomatedStatusTransitionBtn();
            // await automatedStatusTransitionCreatePage.setName(tempData.name);
            // await automatedStatusTransitionCreatePage.setCompany(tempData.company);
            // await automatedStatusTransitionCreatePage.setFromStatus(tempData.fromStatus);
            // await automatedStatusTransitionCreatePage.setToStatus(tempData.toStatus);
            // await automatedStatusTransitionCreatePage.setChangeStatusAfter(tempData.changeStatusAfter.toString());
            // verify LOB is there
            // await automatedStatusTransitionCreatePage.saveConfig();
            expect(await utilCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy("Success message absent");
            // open the record and verify LOB is on edit screen
            await utilGrid.selectLineOfBusiness('Human Resource');
        });
        afterAll(async () => {
            await utilCommon.closeBladeOnSettings();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //apurva
    describe('[DRDMV-1357]: [Flowsets] Case Template creation with Flowset', () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let flowsetName1: string, flowsetName2: string, flowsetName3: string;
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            let processName = `Agent Origin Global ${randomStr}`
            await apiHelper.createProcess(processName, 'AGENT_ORIGIN');

            //Register the Process
            await apiHelper.apiLogin('jbarnes');
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
            flowsetName1 = `DRDMV-1357 ${randomStr} Active`;
            let flowsetMandatoryFieldsData1 = cloneDeep(flowsetGlobalFields);
            flowsetMandatoryFieldsData1.flowsetName = flowsetName1;
            flowsetMandatoryFieldsData1["lineOfBusiness"] = "Facilities";
            let flowsetResponse1 = await apiHelper.createNewFlowset(flowsetMandatoryFieldsData1);

            //Create new flowset
            flowsetName2 = `DRDMV-1357 ${randomStr} InActive`;
            let flowsetMandatoryFieldsData2 = cloneDeep(flowsetGlobalInActiveFields);
            flowsetMandatoryFieldsData2.flowsetName = flowsetName2;
            flowsetMandatoryFieldsData2["lineOfBusiness"] = "Facilities";
            let flowsetResponse2 = await apiHelper.createNewFlowset(flowsetMandatoryFieldsData2);

            //Create new flowset
            flowsetName3 = `DRDMV-1357 ${randomStr} Draft`;
            let flowsetMandatoryFieldsData3 = cloneDeep(flowsetGlobalFields);
            flowsetMandatoryFieldsData3.flowsetName = flowsetName3;
            flowsetMandatoryFieldsData3["lineOfBusiness"] = "Facilities";
            let flowsetResponse3 = await apiHelper.createNewFlowset(flowsetMandatoryFieldsData3);

            //Map Process to Flowset
            let flowsetProcessMappingData = {
                function: 'Initialization',
                registeredProcessId: registeredProcessResponse.id,
                status: 'Active',
                flowsetId: flowsetResponse1.id,
                company: 'Petramco'
            }
            await apiHelper.mapProcessToFlowset(flowsetProcessMappingData);
        });

        it('[DRDMV-1357]: [Flowsets] Case Template creation with Flowset', async () => {
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Define Flowsets', 'Flowsets - Console - Business Workflows');
            await utilGrid.selectLineOfBusiness('Facilities');
            await consoleFlowsetConfigPage.searchAndSelectFlowset(flowsetName3);
            await editFlowsetConfigPo.setFlowset("edit Flowset" + randomStr);
            await editFlowsetConfigPo.setDescription("edit description" + randomStr);
            await expect(editFlowsetConfigPo.getStatusvalue()).toBe("Active");
            await editFlowsetConfigPo.selectStatus("Draft");
            await editFlowsetConfigPo.clickSaveBtn();
        });
        it('[DRDMV-1357]: [Flowsets] Case Template creation with Flowset', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await utilGrid.selectLineOfBusiness('Facilities');
            ALL_FIELD.templateName = ALL_FIELD.templateName + Math.floor(Math.random() * 100000);
            await consoleCasetemplatePage.clickOnCreateCaseTemplateButton();
            await createCaseTemplatePage.setTemplateName(ALL_FIELD.templateName);
            await createCaseTemplatePage.setCompanyName(ALL_FIELD.company);
            await createCaseTemplatePage.setCaseSummary(ALL_FIELD.templateSummary);
            await createCaseTemplatePage.setPriorityValue(ALL_FIELD.casePriority);
            await createCaseTemplatePage.setOwnerCompanyValue('Petramco')
            await createCaseTemplatePage.setBusinessUnitDropdownValue('Facilities Support');
            await createCaseTemplatePage.setOwnerGroupDropdownValue('Facilities');
            await createCaseTemplatePage.setTemplateStatusDropdownValue(ALL_FIELD.templateStatus);
            let flowsetValues: string[] = [flowsetName2, flowsetName3];
            expect(await createCasetemplatePo.flowsetOptionsPresent(flowsetValues)).toBeFalsy('Status in dropdown does not match');
            await createCaseTemplatePage.setCompanyName(ALL_FIELD.company);
            await createCaseTemplatePage.setFlowsetValue(flowsetName1);
            await createCaseTemplatePage.clickSaveCaseTemplate();
        });
        it('[DRDMV-1357]: [Flowsets] Case Template creation with Flowset', async () => {
            //Create a case using above casetemplate
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('fritz');
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(ALL_FIELD.templateName);
            await createCasePage.clickSaveCaseButton();
            await previewCasePage.clickGoToCaseButton();
            expect(await viewCasePage.getFlowsetValue()).toBe(flowsetName1);
        });
        it('[DRDMV-1357]: [Flowsets] Case Template creation with Flowset', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Define Flowsets', 'Flowsets - Console - Business Workflows');
            await utilGrid.selectLineOfBusiness('Human Resource');
            expect(await utilGrid.isGridRecordPresent(flowsetName1)).toBeFalsy();
            expect(await utilGrid.isGridRecordPresent(flowsetName2)).toBeFalsy();
            expect(await utilGrid.isGridRecordPresent(flowsetName3)).toBeFalsy();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await utilGrid.selectLineOfBusiness('Human Resource');
            await consoleCasetemplatePage.clickOnCreateCaseTemplateButton();
            let flowsetValues: string[] = [flowsetName1,flowsetName2,flowsetName3];
            expect(await createCasetemplatePo.flowsetOptionsPresent(flowsetValues)).toBeFalsy('Status in dropdown does not match');
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //apurva
    describe('[DRDMV-23519]: LOB updates for agent must reflect permissions on Email Configurations.', async () => {
        let randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateName = 'Private' + randomStr;
        let templateName1 = 'TemplateName1' + randomStr;
        let emailID = "bmctemptestemail@gmail.com";
        beforeAll(async () => {
            let incomingEmail = {
                'mailBoxName': 'testEmail@gmail.com'
            }
            let emailConfigFacilities = {
                email: emailID,
                incomingMailBoxName: incomingEmail.mailBoxName,
                lineOfBusiness: "Facilities"
            }
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteAllEmailConfiguration();
            await apiHelper.createEmailBox('incoming', incomingEmail);
            await apiHelper.apiLogin('jbarnes');
            await apiHelper.createEmailConfiguration(emailConfigFacilities);
        });
        it('[DRDMV-23519]: LOB updates for agent must reflect permissions on Email Configurations.', async () => {
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Email--Configuration', 'Email Box Console - Business Workflows'));
            await utilGrid.selectLineOfBusiness('Facilities');
            expect(await utilGrid.isGridRecordPresent(emailID)).toBeTruthy();
            await utilGrid.selectLineOfBusiness('Human Resource');
            expect(await utilGrid.isGridRecordPresent(emailID)).toBeFalsy();
        });
        it('[DRDMV-23519]: LOB updates for agent must reflect permissions on Email Configurations.', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Acknowledgment Templates', 'Email Ack Template Console - Business Workflows');
            await utilGrid.selectLineOfBusiness('Facilities');
            await consoleAcknowledgmentTemplatePo.clickOnAddAcknowlegeTemplateButton();
            await createAcknowledgmentTemplatesPo.setTemplateName(templateName);
            await createAcknowledgmentTemplatesPo.selectCompanyDropDown('Petramco');
            await createAcknowledgmentTemplatesPo.selectStatusDropDown('Active');
            await createAcknowledgmentTemplatesPo.setDescription(templateName);
            await createAcknowledgmentTemplatesPo.setSubject(templateName);
            await createAcknowledgmentTemplatesPo.setBody(templateName);
            await createAcknowledgmentTemplatesPo.clickOnSaveButton();
            await utilCommon.closePopUpMessage();
            await utilGrid.selectLineOfBusiness('Human Resource');
            expect(await utilGrid.isGridRecordPresent(templateName)).toBeFalsy();
        });
        it('[DRDMV-23519]: LOB updates for agent must reflect permissions on Email Configurations.', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Templates', 'Email Template Console - Business Workflows');
            await utilGrid.selectLineOfBusiness('Facilities');
            await consoleEmailTemplatePo.clickOnAddEmailTemplateButton();
            await createEmailTemplatePo.setTemplateName(templateName1);
            await createEmailTemplatePo.selectCompany('Petramco');
            await createEmailTemplatePo.selectStatusDropDown('Active');
            await createEmailTemplatePo.setDescription(templateName1);
            await createEmailTemplatePo.setSubject(templateName1);
            await createEmailTemplatePo.setBody(templateName1);
            await createEmailTemplatePo.clickOnSaveButton();
            await utilCommon.closePopUpMessage();
            await utilGrid.selectLineOfBusiness('Human Resource');
            expect(await utilGrid.isGridRecordPresent(templateName1)).toBeFalsy();
        });
        it('[DRDMV-23519]: LOB updates for agent must reflect permissions on Email Configurations.', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Templates', 'Email Template Console - Business Workflows');
            expect(await utilGrid.isGridRecordPresent(templateName1)).toBeTruthy();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Acknowledgment Templates', 'Email Ack Template Console - Business Workflows');
            expect(await utilGrid.isGridRecordPresent(templateName)).toBeTruthy();
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Email--Configuration', 'Email Box Console - Business Workflows'));
            expect(await utilGrid.isGridRecordPresent(emailID)).toBeTruthy();          
            await apiHelper.apiLogin('tadmin');
            await apiHelper.updateFoundationEntity('Person', 'Fritz', { functionalRole: "Facilities" });
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Templates', 'Email Template Console - Business Workflows');
            expect(await utilGrid.isGridRecordPresent(templateName1)).toBeFalsy();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Acknowledgment Templates', 'Email Ack Template Console - Business Workflows');
            expect(await utilGrid.isGridRecordPresent(templateName)).toBeFalsy();
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Email--Configuration', 'Email Box Console - Business Workflows'));
            expect(await utilGrid.isGridRecordPresent(emailID)).toBeFalsy();
            await apiHelper.apiLogin('tadmin');
            await apiHelper.updateFoundationEntity('Person', 'Fritz', { functionalRole: "Facilities" });
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //apurva
    describe('[DRDMV-23486]:[Operating Organization][Create Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
        let randomStr = Math.floor(Math.random() * 1000000);
        let caseTemplateDataFacilities;
        let confidentialSupportGroup = "Employee Relations Sensitive Data Access";
        beforeAll(async () => {
            caseTemplateDataFacilities = {
                "templateName": `Casetemplate1${randomStr}`,
                "templateStatus": "Active",
                "templateSummary": `Summary1${randomStr}`,
                "caseStatus": "New",
                "casePriority": "Medium",
                "ownerBU": "Facilities Support",
                "ownerGroup": "Facilities",
                "lineOfBusiness": "Facilities"
            }
            await apiHelper.apiLogin('fritz');
            await apiHelper.createCaseTemplate(caseTemplateDataFacilities);
        });
        it('[DRDMV-23486]:[Operating Organization][Create Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            expect(await createCasePage.isLineOfBusinessDisabled()).toBeTruthy('Line of Buisness Field is Enabled');
            expect(await createCasePage.getLineOfBusinessValue()).toBe('Facilities', 'Line of Buisness Field is Enabled');
            await createCasePage.setSummary('DRDMV-23519Summary' + randomStr);
            expect(await createCasePage.isValuePresentInDropdown("Category Tier 1", 'Employee Relations')).toBeFalsy('Value is present in  Category Tier 1 drop down');
            await createCasePage.clickAssignToMeButton();
            expect(await createCasePage.isValuePresentInDropdown("Category Tier 1", 'Facilities')).toBeTruthy('Value is present in  Category Tier 1 drop down');
            await createCasePage.setPriority('Low');
            await createCasePage.selectCategoryTier1("Facilities");
            await createCasePage.selectCategoryTier2("Conference Room");
            await createCasePage.selectCategoryTier3("Furniture");
            await createCasePage.selectCategoryTier4("Chair");
            expect(await createCasePo.getCategoryTier1Value()).toBe('Facilities');
            expect(await createCasePo.getCategoryTier2Value()).toBe('Conference Room');
            expect(await createCasePo.getCategoryTier3Value()).toBe('Furniture');
            expect(await createCasePo.getCategoryTier4Value()).toBe('Chair');
        });
        it('[DRDMV-23486]:[Operating Organization][Create Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await createCasePage.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.businessUnitOptionsPresent('United States Support')).toBeFalsy();
            await changeAssignmentBladePo.clickOnCancelButton();
            await createCasePage.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.businessUnitOptionsPresent('Facilities Support')).toBeTruthy();
            await changeAssignmentBladePo.clickOnCancelButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePage.clickGoToCaseButton();
            await viewCasePage.clickEditCaseButton();
            await editCasePo.clickOnSelectCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateDataFacilities.templateName);
            await editCasePo.clickSaveCase();
            expect(await viewCasePage.getCaseTemplateText()).toBe(caseTemplateDataFacilities.templateName);
            expect(await viewCasePage.getLineOfBusinessValue()).toBe('Facilities');
        });
        it('[DRDMV-23486]:[Operating Organization][Create Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await viewCasePage.clickEditCaseButton();
            expect(await createCasePage.isValuePresentInDropdown("Category Tier 1", 'Employee Relations')).toBeFalsy('Value is present in  Category Tier 1 drop down');
            expect(await editCasePo.isLineOfBusinessReadOnly()).toBeTruthy('Field is enabled');
            await editCasePo.updateCasePriority('High');
            await editCasePo.updateCaseCategoryTier1('Phones');
            await editCasePo.updateCaseCategoryTier2('Cellular Phones');
            await editCasePo.updateCaseCategoryTier3('Service');
            await editCasePo.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.businessUnitOptionsPresent('United States Support')).toBeFalsy();
            await changeAssignmentBladePo.clickOnCancelButton();
            await createCasePage.clickChangeAssignmentButton();
            await changeAssignmentBladePo.selectBusinessUnit('Facilities Support');
            await changeAssignmentBladePo.selectSupportGroup('Pantry Service');
            await changeAssignmentBladePo.selectAssignee('Qing Yuan');
            await changeAssignmentBladePo.clickOnAssignButton();
            await editCasePo.clickSaveCase();
            expect(await viewCasePage.getCategoryTier1Value()).toBe('Phones');
            expect(await viewCasePage.getCategoryTier2Value()).toBe('Cellular Phones');
            expect(await viewCasePage.getCategoryTier3Value()).toBe('Service');
            expect(await viewCasePage.getAssignedGroupText()).toBe("Pantry Service");
            expect(await viewCasePage.getAssigneeText()).toBe("Qing Yuan");
        });
        it('[DRDMV-23486]:[Operating Organization][Create Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await viewCasePage.clickOnTab('Case Access');
            await accessTabPo.clickToExpandAccessEntitiySearch('Support Group Access', 'Case');
            await accessTabPo.selectAccessEntityDropDown('Petramco', 'Select Company');
            expect(await accessTabPo.isOptionsPresent('United States Support', 'Select Business Unit')).toBeFalsy();
            await accessTabPo.clickToExpandAccessEntitiySearch('Support Group Access', 'Case');
            await accessTabPo.clickToExpandAccessEntitiySearch('Support Group Access', 'Case');
            await accessTabPo.selectAccessEntityDropDown('Facilities Support', 'Select Business Unit');
            await accessTabPo.clickAccessEntitiyAddButton('Business Unit');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('Facilities Support', 'Read')).toBeTruthy('FailuerMsg1: Agent Name is missing');
            await accessTabPo.clickToExpandAccessEntitiySearch('Support Group Access', 'Confidential Group');
            expect(await accessTabPo.isOptionsPresent(confidentialSupportGroup, 'Select Support Group', true)).toBeFalsy();
        });
        it('[DRDMV-23486]:[Operating Organization][Create Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await utilityGrid.clearFilter();
            await utilityGrid.searchRecord('DRDMV-23519Summary' + randomStr);
            expect(await utilityGrid.isGridRecordPresent('DRDMV-23519Summary' + randomStr)).toBeFalsy('DRDMV-23519Summary' + randomStr);
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('adam');
            await quickCasePo.setCaseSummary('new case');
            await quickCasePo.createCaseButton();
            await utilityCommon.closePopUpMessage();
            await quickCasePo.gotoCaseButton();
            await viewCasePage.clickOnTab('Case Access');
            await accessTabPo.clickToExpandAccessEntitiySearch('Support Group Access', 'Confidential Group');
            expect(await accessTabPo.isOptionsPresent(confidentialSupportGroup, 'Select Support Group', true)).toBeTruthy();
        });
        it('[DRDMV-23486]:[Operating Organization][Create Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.updateFoundationEntity('Person', 'Fritz', { functionalRole: "Facilities" });
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await utilityGrid.clearFilter();
            await utilityGrid.searchRecord('DRDMV-23519Summary' + randomStr);
            expect(await utilityGrid.isGridRecordPresent('DRDMV-23519Summary' + randomStr)).toBeFalsy('DRDMV-23519Summary' + randomStr);
            await apiHelper.apiLogin('tadmin');
            await apiHelper.updateFoundationEntity('Person', 'Fritz', { functionalRole: "Facilities" });
            await utilityGrid.clearFilter();
            await utilityGrid.searchRecord('DRDMV-23519Summary' + randomStr);
            expect(await utilityGrid.isGridRecordPresent('DRDMV-23519Summary' + randomStr)).toBeTruthy('DRDMV-23519Summary' + randomStr);
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });
});