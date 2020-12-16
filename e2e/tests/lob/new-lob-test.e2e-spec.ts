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
import { flowsetGlobalFields, flowsetGlobalInActiveFields } from '../../data/ui/flowset/flowset.ui';
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
let emailTemplateData = require('../../data/ui/email/email.template.api.json');
import { RESOLUTION_CODE_ACTIVE_ON_UI } from '../../data/ui/ticketing/menu.item.ui';
import * as notesTemplateData from '../../data/ui/Social/notesTemplate.api';
import composeMailPo from '../../pageobject/email/compose-mail.po';
import selectEmailTemplateBladePo from '../../pageobject/email/select-email-template-blade.po';
import activityTabPo from '../../pageobject/social/activity-tab.po';
import manageTaskBladePo from '../../pageobject/task/manage-task-blade.po';
import notesTemplateUsage from '../../pageobject/social/note-template-usage.po';
import ckeditorValidationPo from '../../pageobject/common/ck-editor/ckeditor-validation.po';
import updateStatusBladePo from '../../pageobject/common/update.status.blade.po';

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
        xit('[DRDMV-17555]: create same name record in same LOB', async () => {
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
        xit('[DRDMV-17555]: create same name record in different LOB', async () => {
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
            let flowsetValues: string[] = [flowsetName1, flowsetName2, flowsetName3];
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

    describe('[DRDMV-23488]:[Operating Organization][Quick Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
        let facilitiescaseData, facilitiesarticleData, caseTemplateDataGlobal, caseTemplateData, facilitiesTemplateData, randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let commonName = randomStr + "Case DRDMV23488";
        let commonNameForOtherLoB = randomStr + "FacilitiesDRDMV23488";
        beforeAll(async () => {
            caseTemplateData = {
                "templateName": commonName,
                "templateSummary": randomStr + 'Summary DRDMV23488',
                "caseStatus": "Assigned",
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
                "casePriority": "Low",
            };
            caseTemplateDataGlobal = {
                "templateName": commonName,
                "templateSummary": randomStr + 'Summary DRDMV23488',
                "caseStatus": "Assigned",
                "templateStatus": "Active",
                "company": "- Global -",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
                "casePriority": "Low",
            };
            let caseData = {
                "Requester": "qtao",
                "Summary": commonName,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "categoryTier1": "Purchasing Card",
                "categoryTier2": "Policies",
                "categoryTier3": "Card Issuance",
                "Assignee": "qfeng"
            };
            let articleData = {
                "knowledgeSet": "HR",
                "title": commonName,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "Australia Support",
                "assigneeSupportGroup": "AU Support 3",
                "assignee": "KWilliamson"
            };
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createCaseTemplate(caseTemplateData);
            await apiHelper.createCaseTemplate(caseTemplateDataGlobal);
            await apiHelper.createCase(caseData);
            let knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
            let knowledgeArticleGUID = knowledgeArticleData.id;
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'Draft')).toBeTruthy('Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'SMEReview', 'qkatawazi', 'Compensation and Benefits', 'Petramco')).toBeTruthy("Article with SME Review status not updated.");
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'PublishApproval', 'qkatawazi', 'Compensation and Benefits', 'Petramco')).toBeTruthy('Status Not Set');
            facilitiesTemplateData = {
                "templateName": commonNameForOtherLoB,
                "templateSummary": randomStr + "FacilitiesDRDMV23488",
                "caseStatus": "Assigned",
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "casePriority": "Low",
            };
            facilitiescaseData = {
                "Requester": "qtao",
                "Summary": commonNameForOtherLoB,
                "Assigned Company": "Petramco",
                "Business Unit": "Facilities Support",
                "Support Group": "Facilities",
                "categoryTier1": "Phones",
                "categoryTier2": "Cellular Phones",
                "categoryTier3": "Service",
                "Assignee": "Frieda"
            };
            facilitiesarticleData = {
                "knowledgeSet": "HR",
                "title": commonNameForOtherLoB,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "Facilities Support",
                "assigneeSupportGroup": "Facilities",
                "assignee": "Fritz"
            };
            await apiHelper.apiLogin('fritz');
            await apiHelper.createCaseTemplate(facilitiesTemplateData);
            await apiHelper.createCase(caseData);
            let knowledgeArticleData1 = await apiHelper.createKnowledgeArticle(articleData);
            let knowledgeArticleGUID1 = knowledgeArticleData1.id;
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID1, 'Draft')).toBeTruthy('Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID1, 'SMEReview', 'qkatawazi', 'Compensation and Benefits', 'Petramco')).toBeTruthy("Article with SME Review status not updated.");
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID1, 'PublishApproval', 'qkatawazi', 'Compensation and Benefits', 'Petramco')).toBeTruthy('Status Not Set');
        });
        it('[DRDMV-23488]:[Operating Organization][Quick Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('adam');
            await quickCasePo.selectCaseTemplate(caseTemplateData.templateName);
            await quickCasePo.clickArrowFirstRecommendedCaseTemplate();
            expect(await previewCaseTemplateCasesPo.getLineOfBusinessValue()).toBe('Human Resource');
            await previewCaseTemplateCasesPo.clickOnBackButton();
        });
        it('[DRDMV-23488]:[Operating Organization][Quick Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await browser.sleep(7000); //Hard wait for KA Indexing
            expect(await resourcesPo.getKnowledgeArticleInfo()).toContain('Human Resource', 'LOB is not correct');
            await resourcesPo.clickOnAdvancedSearchOptions();
            await resourcesPo.enterAdvancedSearchText(caseTemplateData.templateName);
            await resourcesPo.clickOnAdvancedSearchSettingsIconToOpen();
            await resourcesPo.clickOnAdvancedSearchFiltersButton('Apply');
            await resourcesPo.clickOnAdvancedSearchSettingsIconToClose();
            expect(await resourcesPo.getKnowledgeArticleInfo()).toContain('Human Resource', 'LOB is not correct');
            await quickCasePo.clickFirstRecommendedCases();
            expect(await previewCasePage.getLineOfBusinessValue()).toBe('Human Resource');
            await previewCasePage.clickBackButton();
            await quickCasePo.createCaseButton();
            await previewCasePage.clickGoToCaseButton();
        });
        it('[DRDMV-23488]:[Operating Organization][Quick Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await viewCasePage.clickEditCaseButton();
            expect(await editCasePo.isValuePresentInDropdown("Category Tier 1", 'Phones')).toBeFalsy('Value is present in  Category Tier 1 drop down');
            expect(await editCasePo.isLineOfBusinessReadOnly()).toBeTruthy('Field is enabled');
            await editCasePo.updateCasePriority('High');
            await editCasePo.updateCaseCategoryTier1('Employee Relations');
            await editCasePo.updateCaseCategoryTier2('Compensation');
            await editCasePo.updateCaseCategoryTier3('Bonus');
            await editCasePo.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.businessUnitOptionsPresent('Facilities Support')).toBeFalsy();
            await changeAssignmentBladePo.clickOnCancelButton();
            await editCasePo.clickChangeAssignmentButton();
            await changeAssignmentBladePo.selectBusinessUnit('Australia Support');
            await changeAssignmentBladePo.selectSupportGroup('AU Support 1');
            await changeAssignmentBladePo.selectAssignee('RA3 Liu');
            await changeAssignmentBladePo.clickOnAssignButton();
            await editCasePo.clickSaveCase();
            expect(await viewCasePage.getCategoryTier1Value()).toBe('Employee Relations');
            expect(await viewCasePage.getCategoryTier2Value()).toBe('Compensation');
            expect(await viewCasePage.getCategoryTier3Value()).toBe('Bonus');
            expect(await viewCasePage.getAssignedGroupText()).toBe("AU Support 1");
            expect(await viewCasePage.getAssigneeText()).toBe("RA3 Liu");
        });
        it('[DRDMV-23488]:[Operating Organization][Quick Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await apiHelper.apiLogin('qkatawazi');
            caseTemplateData.templateName = randomStr + "2Case DRDMV23488";
            await apiHelper.createCaseTemplate(caseTemplateData);
            await viewCasePage.clickEditCaseButton();
            await editCasePo.clickOnChangeCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(randomStr + "2Case DRDMV23488");
            await editCasePo.clickSaveCase();
            await utilityCommon.closePopUpMessage();
            await utilityCommon.closePopUpMessage();
            await navigationPage.gotoCaseConsole();
            expect(await utilityGrid.isGridRecordPresent(randomStr + "2Case DRDMV23488")).toBeTruthy('DRDMV-23519Summary' + randomStr);
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await utilityGrid.clearFilter();
            expect(await utilityGrid.isGridRecordPresent(randomStr + "2Case DRDMV23488")).toBeFalsy('DRDMV-23519Summary' + randomStr);
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('adam');
            await quickCasePo.setCaseSummary('new case');
            await quickCasePo.createCaseButton();
            await utilityCommon.closePopUpMessage();
            expect(await previewCasePage.getLineOfBusinessValue()).toBe('Human Resource');
            await quickCasePo.gotoCaseButton();
            await viewCasePage.clickEditCaseButton();
            expect(await editCasePo.isValuePresentInDropdown("Category Tier 1", 'Phones')).toBeFalsy('Value is present in  Category Tier 1 drop down');
            expect(await editCasePo.isLineOfBusinessReadOnly()).toBeTruthy('Field is enabled');
            await editCasePo.updateCasePriority('High');
            await editCasePo.updateCaseCategoryTier1('Employee Relations');
            await editCasePo.updateCaseCategoryTier2('Compensation');
            await editCasePo.updateCaseCategoryTier3('Bonus');
            await editCasePo.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.businessUnitOptionsPresent('Facilities Support')).toBeFalsy();
            await changeAssignmentBladePo.clickOnCancelButton();
            await editCasePo.clickChangeAssignmentButton();
            await changeAssignmentBladePo.selectBusinessUnit('Australia Support');
            await changeAssignmentBladePo.selectSupportGroup('AU Support 1');
            await changeAssignmentBladePo.selectAssignee('RA3 Liu');
            await changeAssignmentBladePo.clickOnAssignButton();
            await editCasePo.clickSaveCase();
            expect(await viewCasePage.getCategoryTier1Value()).toBe('Employee Relations');
            expect(await viewCasePage.getCategoryTier2Value()).toBe('Compensation');
            expect(await viewCasePage.getCategoryTier3Value()).toBe('Bonus');
            expect(await viewCasePage.getAssignedGroupText()).toBe("AU Support 1");
            expect(await viewCasePage.getAssigneeText()).toBe("RA3 Liu");
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('adam');
            await quickCasePo.selectCaseTemplate(facilitiesTemplateData.templateName);
            await quickCasePo.createCaseButton();
            await utilityCommon.closePopUpMessage();
            expect(await previewCasePage.getLineOfBusinessValue()).toBe('Facilities');
            await quickCasePo.gotoCaseButton();
        });
        it('[DRDMV-23488]:[Operating Organization][Quick Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('adam');
            await quickCasePo.selectCaseTemplate(caseTemplateDataGlobal.templateName);
            await quickCasePo.clickArrowFirstRecommendedCaseTemplate();
            expect(await previewCaseTemplateCasesPo.getLineOfBusinessValue()).toBe('Human Resource');
            await previewCaseTemplateCasesPo.clickOnBackButton();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('adam');
            expect(await quickCasePo.selectCaseTemplate(facilitiesTemplateData.templateName)).toBeFalsy('template is present');
            await quickCasePo.setCaseSummary('new case');
            await resourcesPo.clickOnAdvancedSearchOptions();
            await resourcesPo.enterAdvancedSearchText(facilitiesarticleData.title);
            await resourcesPo.clickOnAdvancedSearchSettingsIconToOpen();
            await resourcesPo.clickOnAdvancedSearchFiltersButton('Apply');
            await resourcesPo.clickOnAdvancedSearchSettingsIconToClose();
            expect(await resourcesPo.isRecommendedKnowledgePresent(facilitiesarticleData.title)).toBeFalsy();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[DRDMV-23624,DRDMV-23614]:[Operating Organization][Quick Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB with diff Company', async () => {
        let caseTemplateData, facilitiesTemplateData, caseTemplateDataPsilon, randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let commonName = randomStr + "Case DRDMV23488";
        beforeAll(async () => {
            caseTemplateData = {
                "templateName": commonName,
                "templateSummary": randomStr + 'Summary DRDMV23488',
                "caseStatus": "Assigned",
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
                "casePriority": "Low",
            };
            let caseData = {
                "Requester": "qtao",
                "Summary": commonName,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "categoryTier1": "Purchasing Card",
                "categoryTier2": "Policies",
                "categoryTier3": "Card Issuance",
                "Assignee": "qkatawazi"
            };
            let articleData = {
                "knowledgeSet": "HR",
                "title": commonName,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "Australia Support",
                "assigneeSupportGroup": "AU Support 3",
                "assignee": "KWilliamson"
            };
            caseTemplateDataPsilon = {
                "templateName": `psilonDraftCaseTemplate${randomStr}`,
                "templateSummary": `psilonDraftCaseTemplate${randomStr}`,
                "caseStatus": "Assigned",
                "templateStatus": "Active",
                "company": "Psilon",
                "businessUnit": "Psilon Support Org1",
                "supportGroup": "Psilon Support Group1",
                "ownerBU": "Psilon Support Org1",
                "ownerGroup": "Psilon Support Group1"
            }
            await apiHelper.apiLogin(userData1.userId + '@petramco.com', 'Password_1234');
            await apiHelper.createCaseTemplate(caseTemplateData);
            await apiHelper.createCaseTemplate(caseTemplateDataPsilon);
            await apiHelper.createCase(caseData);
            let knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
            let knowledgeArticleGUID = knowledgeArticleData.id;
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'Draft')).toBeTruthy('Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'SMEReview', 'qkatawazi', 'Compensation and Benefits', 'Petramco')).toBeTruthy("Article with SME Review status not updated.");
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'PublishApproval', 'qkatawazi', 'Compensation and Benefits', 'Petramco')).toBeTruthy('Status Not Set');
            facilitiesTemplateData = {
                "templateName": randomStr + "FacilitiesDRDMV23488",
                "templateSummary": randomStr + "FacilitiesDRDMV23488",
                "caseStatus": "Assigned",
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "casePriority": "Low",
            };
            await apiHelper.apiLogin('fritz');
            await apiHelper.createCaseTemplate(facilitiesTemplateData);
        });
        it('[DRDMV-23624,DRDMV-23614]:[Operating Organization][Quick Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB with diff Company', async () => {
            await navigationPage.signOut();
            await loginPage.login(userData1.userId + "@petramco.com", 'Password_1234');
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('adam');
            await quickCasePo.setCaseSummary('PetramcoCaseSummary' + randomStr);
            await quickCasePo.selectCaseTemplate(caseTemplateData.templateName);
            await quickCasePo.clickArrowFirstRecommendedCaseTemplate();
            expect(await previewCaseTemplateCasesPo.getLineOfBusinessValue()).toBe('Human Resource');
            await previewCaseTemplateCasesPo.clickOnBackButton();
        });
        it('[DRDMV-23624,DRDMV-23614]:[Operating Organization][Quick Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB with diff Company', async () => {
            await browser.sleep(5000); //Hard wait for KA Indexing
            expect(await resourcesPo.getKnowledgeArticleInfo()).toContain('Human Resource', 'LOB is not correct');
            await resourcesPo.clickOnAdvancedSearchOptions();
            await resourcesPo.enterAdvancedSearchText(caseTemplateData.templateName);
            await resourcesPo.clickOnAdvancedSearchSettingsIconToOpen();
            await resourcesPo.clickOnAdvancedSearchFiltersButton('Apply');
            await resourcesPo.clickOnAdvancedSearchSettingsIconToClose();
            expect(await resourcesPo.getKnowledgeArticleInfo()).toContain('Human Resource', 'LOB is not correct');
            await quickCasePo.clickFirstRecommendedCases();
            expect(await previewCasePage.getLineOfBusinessValue()).toBe('Human Resource');
            await previewCasePage.clickBackButton();
            await quickCasePo.createCaseButton();
            await previewCasePage.clickGoToCaseButton();
        });
        it('[DRDMV-23624,DRDMV-23614]:[Operating Organization][Quick Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB with diff Company', async () => {
            await viewCasePage.clickEditCaseButton();
            expect(await editCasePo.isValuePresentInDropdown("Category Tier 1", 'Phones')).toBeFalsy('Value is present in  Category Tier 1 drop down');
            expect(await editCasePo.isLineOfBusinessReadOnly()).toBeTruthy('Field is enabled');
            await editCasePo.updateCasePriority('High');
            await editCasePo.updateCaseCategoryTier1('Employee Relations');
            await editCasePo.updateCaseCategoryTier2('Compensation');
            await editCasePo.updateCaseCategoryTier3('Bonus');
            await editCasePo.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.businessUnitOptionsPresent('Facilities Support')).toBeFalsy();
            await changeAssignmentBladePo.clickOnCancelButton();
            await editCasePo.clickChangeAssignmentButton();
            await changeAssignmentBladePo.selectBusinessUnit('Australia Support');
            await changeAssignmentBladePo.selectSupportGroup('AU Support 1');
            await changeAssignmentBladePo.selectAssignee('RA3 Liu');
            await changeAssignmentBladePo.clickOnAssignButton();
            await editCasePo.clickSaveCase();
            expect(await viewCasePage.getCategoryTier1Value()).toBe('Employee Relations');
            expect(await viewCasePage.getCategoryTier2Value()).toBe('Compensation');
            expect(await viewCasePage.getCategoryTier3Value()).toBe('Bonus');
            expect(await viewCasePage.getAssignedGroupText()).toBe("AU Support 1");
            expect(await viewCasePage.getAssigneeText()).toBe("RA3 Liu");
        });
        it('[DRDMV-23624,DRDMV-23614]:[Operating Organization][Quick Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB with diff Company', async () => {
            await apiHelper.apiLogin(userData1.userId + '@petramco.com', 'Password_1234');
            caseTemplateData.templateName = randomStr + "2Case DRDMV23488";
            await apiHelper.createCaseTemplate(caseTemplateData);
            await viewCasePage.clickEditCaseButton();
            await editCasePo.clickOnChangeCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(randomStr + "2Case DRDMV23488");
            await editCasePo.clickSaveCase();
            await utilityCommon.closePopUpMessage();
            await utilityCommon.closePopUpMessage();
            await navigationPage.gotoCaseConsole();
            expect(await utilityGrid.isGridRecordPresent(randomStr + "2Case DRDMV23488")).toBeTruthy('DRDMV-23519Summary' + randomStr);
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await utilityGrid.clearFilter();
            expect(await utilityGrid.isGridRecordPresent(randomStr + "2Case DRDMV23488")).toBeFalsy('DRDMV-23519Summary' + randomStr);
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('adam');
            await quickCasePo.setCaseSummary('new case');
            await quickCasePo.createCaseButton();
            await utilityCommon.closePopUpMessage();
            expect(await previewCasePage.getLineOfBusinessValue()).toBe('Human Resource');
            await quickCasePo.gotoCaseButton();
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('adam');
            await quickCasePo.selectCaseTemplate(randomStr + "FacilitiesDRDMV23488");
            expect(await quickCasePo.selectCaseTemplate(randomStr + "2Case DRDMV23488")).toBeTruthy('template is present');
            await quickCasePo.createCaseButton();
            await utilityCommon.closePopUpMessage();
            expect(await previewCasePage.getLineOfBusinessValue()).toBe('Facilities');
            await quickCasePo.gotoCaseButton();
        });
        it('[DRDMV-23624,DRDMV-23614]:[Operating Organization][Quick Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB with diff Company', async () => {
            await navigationPage.signOut();
            await loginPage.login(userData1.userId + "@petramco.com", 'Password_1234');
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('adam');
            await quickCasePo.setCaseSummary('PsilonCaseSummary' + randomStr);
            await quickCasePo.selectCaseTemplate(caseTemplateDataPsilon.templateName);
            await quickCasePo.createCaseButton();
            await utilityCommon.closePopUpMessage();
            expect(await previewCasePage.getLineOfBusinessValue()).toBe('Human Resource');
            await quickCasePo.gotoCaseButton();
            await navigationPage.signOut();
            await loginPage.login('idphylum1@petramco.com', 'Password_1234');
            await utilityGrid.clearFilter();
            expect(await utilityGrid.isGridRecordPresent('PetramcoCaseSummary' + randomStr)).toBeFalsy('PetramcoCaseSummary' + randomStr);
            expect(await utilityGrid.isGridRecordPresent('PsilonCaseSummary' + randomStr)).toBeFalsy('PsilonCaseSummary' + randomStr);
        });
        it('[DRDMV-23624,DRDMV-23614]:[Operating Organization][Quick Case]: Verify the behavior when the case agent is able to create a case when it has Multiple LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await utilityGrid.clearFilter();
            await utilGrid.selectLineOfBusiness("Human Resource");
            expect(await utilityGrid.isGridRecordPresent(randomStr + "2Case DRDMV23488")).toBeTruthy('DRDMV-23519Summary' + randomStr);
            await viewCasePage.clickEditCaseButton();
            expect(await editCasePo.isLineOfBusinessReadOnly()).toBeFalsy('Field is enabled');
            expect(await editCasePo.isValuePresentInDropdown("Category Tier 1", 'Phones')).toBeFalsy('Value is present in  Category Tier 1 drop down');
            await utilGrid.selectLineOfBusiness("Facilities");
            expect(await editCasePo.isValuePresentInDropdown("Category Tier 1", 'Phones')).toBeTruthy('Value is present in  Category Tier 1 drop down');
            await utilGrid.selectLineOfBusiness("Human Resource");
            expect(await editCasePo.isValuePresentInDropdown("Category Tier 1", 'Employee Relations')).toBeTruthy('Value is present in  Category Tier 1 drop down');
            await editCasePo.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.businessUnitOptionsPresent('Facilities Support')).toBeFalsy();
            await changeAssignmentBladePo.clickOnCancelButton();
            await utilGrid.selectLineOfBusiness("Facilities");
            await editCasePo.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.businessUnitOptionsPresent('Facilities Support')).toBeTruthy();
            await changeAssignmentBladePo.clickOnCancelButton();
            await utilGrid.selectLineOfBusiness("Human Resource");
            await editCasePo.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.businessUnitOptionsPresent('Australia Support')).toBeFalsy();
            await changeAssignmentBladePo.clickOnCancelButton();
            await editCasePo.clickOnChangeCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateData.templateName);
            await editCasePo.clickSaveCase();
            expect(await viewCasePage.getLineOfBusinessValue()).toBe('Human Resource');
            await navigationPage.gotoCaseConsole();
            await utilGrid.selectLineOfBusiness("Facilities");
            expect(await utilityGrid.isGridRecordPresent(caseTemplateData.templateName)).toBeFalsy('DRDMV-23519Summary' + randomStr);
            await utilGrid.selectLineOfBusiness("Human Resource");
            expect(await utilityGrid.isGridRecordPresent(caseTemplateData.templateName)).toBeTruthy('DRDMV-23519Summary' + randomStr);
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[DRDMV-23617]:[Operating Organization] [Cases] : Verify the behavior where Email Templates, Task Templates, Resolution Codes, Notes templates are filtered / displayed based on the Line of Business on Cases.', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let response, notesTemplate2, emailTemplateOraclePsilon, templateData2, tempNotesTemplateData1, templateData, externaltemplateData, automatedtemplateData, emailTemplateName, emailTemplateName1, notesTemplateName, notesTemplateBody, notesTemplateName1, notesTemplateBody1;
        let resolutionCode = 'resolutionCode' + randomStr;
        beforeAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            templateData = {
                "templateName": 'Manual task19011' + randomStr,
                "templateSummary": 'Manual task19011' + randomStr,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
            }
            await apiHelper.createManualTaskTemplate(templateData);
            externaltemplateData = {
                "templateName": 'External task19011' + randomStr,
                "templateSummary": 'External task19011' + randomStr,
                "templateStatus": "Active",
                "taskCompany": '- Global -',
                "ownerCompany": '- Global -',
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 1",
                "assignee": "qtao",
            }
            await apiHelper.createExternalTaskTemplate(externaltemplateData);
            automatedtemplateData = {
                "templateName": 'Automated task19011' + randomStr,
                "templateSummary": 'Automated task19011' + randomStr,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": 'Auto Proces' + randomStr,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 1",
                "assignee": "qtao",
            }
            await apiHelper.createAutomatedTaskTemplate(automatedtemplateData);
            //create an email template 
            emailTemplateName = await emailTemplateData['emailTemplateToComposeEmail'].TemplateName + randomStr;
            emailTemplateData['emailTemplateToComposeEmail'].TemplateName = emailTemplateName;
            await apiHelper.createEmailTemplate(emailTemplateData['emailTemplateToComposeEmail']);
            emailTemplateName1 = await emailTemplateData['emailTemplateToComposeEmailGlobal'].TemplateName + randomStr;
            emailTemplateData['emailTemplateToComposeEmailGlobal'].TemplateName = emailTemplateName1;
            await apiHelper.createEmailTemplate(emailTemplateData['emailTemplateToComposeEmailGlobal']);

            // Create Resoution code
            await apiHelper.apiLogin('qkatawazi');
            let resolutionCodeActiveOnUIData = cloneDeep(RESOLUTION_CODE_ACTIVE_ON_UI)
            resolutionCode = resolutionCodeActiveOnUIData.menuItemName + randomStr;
            resolutionCodeActiveOnUIData.menuItemName = resolutionCode;
            await apiHelper.createNewMenuItem(resolutionCodeActiveOnUIData);

            // Create Notes Template
            tempNotesTemplateData1 = cloneDeep(notesTemplateData.NOTES_TEMPLATE_MANDATORY_FIELD);
            notesTemplateName = tempNotesTemplateData1.templateName + randomStr;
            notesTemplateBody = tempNotesTemplateData1.body + randomStr;
            tempNotesTemplateData1.body = notesTemplateBody;
            tempNotesTemplateData1.templateName = notesTemplateName;
            await apiHelper.createNotesTemplate("Case", tempNotesTemplateData1);

            let tempNotesTemplateData2 = cloneDeep(notesTemplateData.NOTES_TEMPLATE_MANDATORY_FIELD_GLOBAL);
            notesTemplateName1 = tempNotesTemplateData2.templateName + randomStr;
            notesTemplateBody1 = tempNotesTemplateData2.body + randomStr;
            tempNotesTemplateData2.body = notesTemplateBody1;
            tempNotesTemplateData2.templateName = notesTemplateName1;
            await apiHelper.createNotesTemplate("Case", tempNotesTemplateData2);
            let caseData = {
                "Requester": "qtao",
                "Summary": "Summary" + randomStr,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "categoryTier1": "Purchasing Card",
                "categoryTier2": "Policies",
                "categoryTier3": "Card Issuance",
                "Assignee": "qfeng"
            };
            response = await apiHelper.createCase(caseData);
            await apiHelper.apiLogin('gderuno');
            templateData2 = {
                "templateName": "PsilonName" + randomStr,
                "templateSummary": "PsilonSummary" + randomStr,
                "templateStatus": "Active",
                "taskCompany": "Psilon",
                "ownerCompany": "Psilon",
                "ownerBusinessUnit": "Psilon Support Org1",
                "ownerGroup": "Psilon Support Group1",
                "businessUnit": "Psilon Support Org1",
                "supportGroup": "Psilon Support Group1",
                "assignee": "gwixillian",
            }
            await apiHelper.createManualTaskTemplate(templateData2);
            notesTemplate2 = {
                "templateName": "notesTemplatePsilon" + randomStr,
                "company": "Psilon",
                "templateStatus": 1,
                "body": "this is notes template description Oracle",
            }
            await apiHelper.createNotesTemplate("Case", notesTemplate2);
            emailTemplateOraclePsilon = {
                "TemplateName": "PsilonEmail" + randomStr,
                "Company": "Psilon",
                "Status": 1,
                "Description": "Leave details",
                "EmailMessageSubject": "Leave summary",
                "EmailMessageBody": "Hello testing Global Oracle",
            }
            await apiHelper.createEmailTemplate(emailTemplateOraclePsilon);
        });
        it('[DRDMV-23617]:[Operating Organization] [Cases] : Verify the behavior where Email Templates, Task Templates, Resolution Codes, Notes templates are filtered / displayed based on the Line of Business on Cases.', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await utilityGrid.searchAndOpenHyperlink(response.displayId);
            await viewCasePage.clickOnEmailLink();
            await composeMailPo.clickOnSelectEmailTemplateLink();
            await selectEmailTemplateBladePo.searchEmailTemplate(emailTemplateName);
            expect(await selectEmailTemplateBladePo.getGridRecordValue("Template Name")).toBe(emailTemplateName);
            await selectEmailTemplateBladePo.searchEmailTemplate(emailTemplateName1);
            expect(await selectEmailTemplateBladePo.getGridRecordValue("Template Name")).toBe(emailTemplateName1);
            await selectEmailTemplateBladePo.searchEmailTemplate(emailTemplateOraclePsilon.TemplateName);
            expect(await selectEmailTemplateBladePo.getGridRecordValue("Template Name")).toBe(emailTemplateOraclePsilon.TemplateName);
            await selectEmailTemplateBladePo.clickOnCancelButton();
            await composeMailPo.clickOnSelectEmailTemplateLink();
            await selectEmailTemplateBladePo.searchAndSelectEmailTemplate(emailTemplateName);
            await selectEmailTemplateBladePo.clickOnApplyButton();
            await composeMailPo.setToOrCCInputTextbox('To', 'fritz.schulz@petramco.com');
            await composeMailPo.clickOnSendButton();
            await utilityCommon.closePopUpMessage();
        });
        it('[DRDMV-23617]:[Operating Organization] [Cases] : Verify the behavior where Email Templates, Task Templates, Resolution Codes, Notes templates are filtered / displayed based on the Line of Business on Cases.', async () => {
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.clickAddTaskFromTemplateButton();
            await manageTaskBladePo.searchTaskTemplate(templateData.templateSummary);
            expect(await manageTaskBladePo.getGridRecordValue("Template Name")).toBe(templateData.templateSummary);
            await manageTaskBladePo.searchTaskTemplate(automatedtemplateData.templateSummary);
            expect(await manageTaskBladePo.getGridRecordValue("Template Name")).toBe(automatedtemplateData.templateSummary);
            await manageTaskBladePo.searchTaskTemplate(externaltemplateData.templateSummary);
            expect(await manageTaskBladePo.getGridRecordValue("Template Name")).toBe(externaltemplateData.templateSummary);
            await manageTaskBladePo.searchTaskTemplate(templateData2.TemplateName);
            expect(await manageTaskBladePo.getGridRecordValue("Template Name")).toBe(templateData2.TemplateName);
            await manageTaskBladePo.clickTaskGridCancelButton();
            await manageTaskBladePo.addTaskFromTaskTemplate(templateData.templateSummary);
            await manageTaskBladePo.addTaskFromTaskTemplate(automatedtemplateData.templateSummary);
            await manageTaskBladePo.addTaskFromTaskTemplate(externaltemplateData.templateSummary);
            await manageTaskBladePo.clickCloseButton();
        });
        it('[DRDMV-23617]:[Operating Organization] [Cases] : Verify the behavior where Email Templates, Task Templates, Resolution Codes, Notes templates are filtered / displayed based on the Line of Business on Cases.', async () => {
            // Verify Case Notes Template
            await activityTabPo.clickActivityNoteTextBox();
            await activityTabPo.clickOnNotesTemplate();
            expect(await notesTemplateUsage.isTemplatePresent(notesTemplateName)).toBeTruthy();
            expect(await notesTemplateUsage.isTemplatePresent(notesTemplateName1)).toBeTruthy();
            expect(await notesTemplateUsage.isTemplatePresent(notesTemplate2.templateName)).toBeTruthy();
            await notesTemplateUsage.clickOnCancelBtn();
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(response.displayId);
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(notesTemplateName);
            expect(await ckeditorValidationPo.getTextCkEditorTextArea()).toContain(notesTemplateBody);
            await activityTabPo.clickOnPostButton();
            expect(await activityTabPo.isTextPresentInActivityLog(tempNotesTemplateData1.body)).toBeTruthy();
        });
        it('[DRDMV-23617]:[Operating Organization] [Cases] : Verify the behavior where Email Templates, Task Templates, Resolution Codes, Notes templates are filtered / displayed based on the Line of Business on Cases.', async () => {
            // Verify Resolution Code
            await viewCasePage.clickEditCaseButton();
            await editCasePo.updateResolutionCode(resolutionCode);
            await editCasePo.setResolutionDescription(resolutionCode);
            await editCasePo.clickSaveCase();
            await utilityCommon.closePopUpMessage();
            expect(await viewCasePage.getResolutionCodeValue()).toBe(resolutionCode);
            expect(await viewCasePage.getResolutionDescription()).toBe(resolutionCode);
            await updateStatusBladePo.changeCaseStatus('Resolved');
            await updateStatusBladePo.setStatusReason('Auto Resolved');
            await updateStatusBladePo.clickSaveStatus();
            await utilityCommon.closePopUpMessage();
            expect(await viewCasePage.getTextOfStatus()).toBe('Resolved');
            expect(await viewCasePage.getResolutionCodeValue()).toBe(resolutionCode);
            expect(await viewCasePage.getResolutionDescription()).toBe(resolutionCode);
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[DRDMV-23629]:[Ericsson Model][Create Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
        let randomStr = Math.floor(Math.random() * 1000000);
        let caseTemplateData, caseTemplateDataGlobal, caseTemplateDataEricssonGlobal,ericssonSAMcaseTemplateData,caseTemplateDataEricssonSAMGlobal;
        beforeAll(async () => {
            caseTemplateData = {
                "templateName": `Casetemplate1${randomStr}`,
                "templateStatus": "Active",
                "templateSummary": `Summary1${randomStr}`,
                "caseStatus": "New",
                "casePriority": "Medium",
                "ownerComapny": "Ericsson HR",
                "ownerBU": "Ericsson United States Support",
                "ownerGroup": "US Support 1",
                "company": "Ericsson HR",
                "lineOfBusiness": "Ericsson HR",
            }
            caseTemplateDataEricssonGlobal = {
                "templateName": `Casetemplate2${randomStr}`,
                "templateSummary": randomStr + 'Summary DRDMV23488',
                "caseStatus": "Assigned",
                "templateStatus": "Active",
                "company": "Ericsson Global",
                "casePriority": "Low",
                "ownerComapny": "Ericsson HR",
                "ownerBU": "Ericsson United States Support",
                "ownerGroup": "US Support 1",
                "lineOfBusiness": "Ericsson HR",
            };
            caseTemplateDataGlobal = {
                "templateName": `Casetemplate3${randomStr}`,
                "templateSummary": randomStr + 'Summary DRDMV23488',
                "caseStatus": "Assigned",
                "templateStatus": "Active",
                "company": "- Global -",
                "casePriority": "Low",
                "ownerComapny": "Ericsson HR",
                "ownerBU": "Ericsson United States Support",
                "ownerGroup": "US Support 1",
                "lineOfBusiness": "Ericsson HR",
            };
            ericssonSAMcaseTemplateData = {
                "templateName": `Casetemplate4${randomStr}`,
                "templateStatus": "Active",
                "templateSummary": `Summary1${randomStr}`,
                "caseStatus": "New",
                "casePriority": "Medium",
                "ownerComapny": "Ericsson SAM",
                "ownerBU": "Ericsson Asset Management - USA",
                "ownerGroup": "Asset Disposal",
                "company": "Ericsson SAM",
                "lineOfBusiness": "Ericsson SAM",
            }
            caseTemplateDataEricssonSAMGlobal = {
                "templateName": `Casetemplate5${randomStr}`,
                "templateSummary": randomStr + 'Summary DRDMV23488',
                "caseStatus": "Assigned",
                "templateStatus": "Active",
                "company": "Ericsson Global",
                "casePriority": "Low",
                "ownerComapny": "Ericsson SAM",
                "ownerBU": "Ericsson Asset Management - USA",
                "ownerGroup": "Asset Disposal",
                "lineOfBusiness": "Ericsson SAM",
            };
            await apiHelper.apiLogin('rwillie');
            await apiHelper.createCaseTemplate(caseTemplateData);
            await apiHelper.createCaseTemplate(caseTemplateDataEricssonGlobal);
            await apiHelper.createCaseTemplate(caseTemplateDataGlobal);
            await apiHelper.apiLogin('sbruce');
            await apiHelper.createCaseTemplate(ericssonSAMcaseTemplateData);
            await apiHelper.createCaseTemplate(caseTemplateDataEricssonSAMGlobal);
        });
        it('[DRDMV-23629]:[Ericsson Model][Create Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('rwillie');
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('syakov');
            expect(await createCasePage.isLineOfBusinessDisabled()).toBeTruthy('Line of Buisness Field is Enabled');
            expect(await createCasePage.getLineOfBusinessValue()).toBe('Ericsson HR', 'Line of Buisness Field is Enabled');
            await createCasePage.setSummary('DRDMV-23629Summary' + randomStr);
            expect(await createCasePage.isValuePresentInDropdown("Category Tier 1", 'Purchasing Card')).toBeFalsy('Value is present in  Category Tier 1 drop down');
            await createCasePage.clickAssignToMeButton();
            expect(await createCasePage.isValuePresentInDropdown("Category Tier 1", 'Employee Relations')).toBeTruthy('Value is present in  Category Tier 1 drop down');
            await createCasePage.setPriority('Low');
            await createCasePage.selectCategoryTier1("Employee Relations");
            await createCasePage.selectCategoryTier2("Compensation");
            await createCasePage.selectCategoryTier3("Bonus");
            expect(await createCasePo.getCategoryTier1Value()).toBe('Employee Relations');
            expect(await createCasePo.getCategoryTier2Value()).toBe('Compensation');
            expect(await createCasePo.getCategoryTier3Value()).toBe('Bonus');
        });
        it('[DRDMV-23629]:[Ericsson Model][Create Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await createCasePage.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.businessUnitOptionsPresent('Ericsson Asset Management - USA')).toBeFalsy();
            await changeAssignmentBladePo.clickOnCancelButton();
            await createCasePage.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.businessUnitOptionsPresent('Ericsson United States Support')).toBeTruthy();
            await changeAssignmentBladePo.clickOnCancelButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePage.clickGoToCaseButton();
            await viewCasePage.clickEditCaseButton();
            await editCasePo.clickOnSelectCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateData.templateName);
            await editCasePo.clickSaveCase();
            expect(await viewCasePage.getCaseTemplateText()).toBe(caseTemplateData.templateName);
            expect(await viewCasePage.getLineOfBusinessValue()).toBe('Ericsson HR');
        });
        it('[DRDMV-23629]:[Ericsson Model][Create Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await viewCasePage.clickEditCaseButton();
            expect(await editCasePo.isValuePresentInDropdown("Category Tier 1", 'Fixed Assets')).toBeFalsy('Value is present in  Category Tier 1 drop down');
            expect(await editCasePo.isLineOfBusinessReadOnly()).toBeTruthy('Field is enabled');
            await editCasePo.updateCasePriority('High');
            await editCasePo.updateCaseCategoryTier1('Applications');
            await editCasePo.updateCaseCategoryTier2('Help Desk');
            await editCasePo.updateCaseCategoryTier3('Incident');
            await editCasePo.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.businessUnitOptionsPresent('Ericsson Asset Management - India')).toBeFalsy();
            await changeAssignmentBladePo.clickOnCancelButton();
            await editCasePo.clickChangeAssignmentButton();
            await changeAssignmentBladePo.selectBusinessUnit('Ericsson United States Support');
            await changeAssignmentBladePo.selectSupportGroup('US Support 2');
            await changeAssignmentBladePo.selectAssignee('Rudner Rita');
            await changeAssignmentBladePo.clickOnAssignButton();
            await editCasePo.clickSaveCase();
            expect(await viewCasePage.getCategoryTier1Value()).toBe('Applications');
            expect(await viewCasePage.getCategoryTier2Value()).toBe('Help Desk');
            expect(await viewCasePage.getCategoryTier3Value()).toBe('Incident');
            expect(await viewCasePage.getAssignedGroupText()).toBe("US Support 2");
            expect(await viewCasePage.getAssigneeText()).toBe("Rudner Rita");
        });
        it('[DRDMV-23629]:[Ericsson Model][Create Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await viewCasePage.clickOnTab('Case Access');
            await accessTabPo.clickToExpandAccessEntitiySearch('Support Group Access', 'Case');
            await accessTabPo.selectAccessEntityDropDown('Ericsson HR', 'Select Company');
            expect(await accessTabPo.isOptionsPresent('Ericsson Asset Management - India', 'Select Business Unit')).toBeFalsy();
            await accessTabPo.clickToExpandAccessEntitiySearch('Support Group Access', 'Case');
            await accessTabPo.clickToExpandAccessEntitiySearch('Support Group Access', 'Case');
            await accessTabPo.selectAccessEntityDropDown('Ericsson HR Support', 'Select Business Unit');
            await accessTabPo.clickAccessEntitiyAddButton('Business Unit');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('Ericsson HR Support', 'Read')).toBeTruthy('FailuerMsg1: Agent Name is missing');
        });
        it('[DRDMV-23629]:[Ericsson Model][Create Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('rdustin');
            await createCasePage.setSummary('New Case 3');
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateDataEricssonGlobal.templateName);
            await createCasePage.clickSaveCaseButton();
            await previewCasePage.clickGoToCaseButton();
            expect(await viewCasePage.getLineOfBusinessValue()).toBe('Ericsson HR');
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('rdustin');
            await createCasePage.setSummary('New Case 3');
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateDataGlobal.templateName);
            await createCasePage.clickSaveCaseButton();
            await previewCasePage.clickGoToCaseButton();
            expect(await viewCasePage.getLineOfBusinessValue()).toBe('Ericsson HR');
            await viewCasePage.clickEditCaseButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateData.templateName);
            await editCasePo.clickSaveCase();
            expect(await viewCasePage.getLineOfBusinessValue()).toBe('Ericsson HR');
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('rdustin');
            await createCasePage.setSummary('New Case 3');
            await createCasePage.clickSelectCaseTemplateButton();
            expect(await selectCasetemplateBladePo.isRecordPresent(ericssonSAMcaseTemplateData.templateName)).toBeFalsy();
            expect(await selectCasetemplateBladePo.isRecordPresent(caseTemplateDataEricssonSAMGlobal.templateName)).toBeFalsy();
            await selectCasetemplateBladePo.clickOnCancelButton();
        });
        it('[DRDMV-23629]:[Ericsson Model][Create Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('rwillie');
            await quickCasePo.selectCaseTemplate(caseTemplateDataEricssonGlobal.templateName);
            await quickCasePo.clickArrowFirstRecommendedCaseTemplate();
            expect(await previewCaseTemplateCasesPo.getLineOfBusinessValue()).toBe('Ericsson HR');
            await previewCaseTemplateCasesPo.clickOnBackButton();
            await quickCasePo.createCaseButton();
            await utilityCommon.closePopUpMessage();
            expect(await previewCasePage.getLineOfBusinessValue()).toBe('Ericsson HR');
            await quickCasePo.gotoCaseButton();
            await viewCasePage.clickEditCaseButton();
            await editCasePo.clickOnChangeCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateData.templateName);
            await editCasePo.clickSaveCase();
            await utilityCommon.closePopUpMessage();
            expect(await viewCasePage.getLineOfBusinessValue()).toBe('Ericsson HR');
        });
        it('[DRDMV-23629]:[Ericsson Model][Create Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('sbruce');
            await utilityGrid.clearFilter();
            await utilityGrid.searchRecord('DRDMV-23629Summary' + randomStr);
            expect(await utilityGrid.isGridRecordPresent('DRDMV-23629Summary' + randomStr)).toBeFalsy('DRDMV-23629Summary' + randomStr);
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('sjoel');
            await quickCasePo.setCaseSummary('new case');
            await quickCasePo.createCaseButton();
            await utilityCommon.closePopUpMessage();
            await quickCasePo.gotoCaseButton();
            await viewCasePage.clickOnTab('Case Access');
            await accessTabPo.clickToExpandAccessEntitiySearch('Support Group Access', 'Case');
            await accessTabPo.selectAccessEntityDropDown('Ericsson HR', 'Select Company');
            expect(await accessTabPo.isOptionsPresent('Ericsson Asset Management - India', 'Select Business Unit')).toBeTruthy();
            await accessTabPo.clickToExpandAccessEntitiySearch('Support Group Access', 'Case');
            await accessTabPo.clickToExpandAccessEntitiySearch('Support Group Access', 'Case');
            await accessTabPo.selectAccessEntityDropDown('Ericsson Asset Management - India', 'Select Business Unit');
            await accessTabPo.clickAccessEntitiyAddButton('Business Unit');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('Ericsson Asset Management - India', 'Read')).toBeTruthy('FailuerMsg1: Agent Name is missing');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[DRDMV-23635]:[Ericsson Model] [Cases] : Verify the behavior where Email Templates, Task Templates, Resolution Codes, Notes templates are filtered / displayed based on the Line of Business on Cases.', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let response, notesTemplate, templateData, externaltemplateData, automatedtemplateData, emailTemplateDataEricsson;
        let notesTemplateSAM, templateDataSAM, externaltemplateDataSAM, automatedtemplateDataSAM, emailTemplateDataEricssonSAM;
        let resolutionCode = 'resolutionCode' + randomStr;
        beforeAll(async () => {
            await apiHelper.apiLogin('rwillie');
            templateData = {
                "templateName": 'Manual task19011' + randomStr,
                "templateSummary": 'Manual task19011' + randomStr,
                "templateStatus": "Active",
                "taskCompany": "Ericsson HR",
                "ownerCompany": "Ericsson HR",
                "ownerBusinessUnit": "Ericsson United States Support",
                "ownerGroup": "US Support 1",
                "businessUnit": "Ericsson United States Support",
                "supportGroup": "US Support 1",
                "assignee": "rwillie",
                "lineOfBusiness": "Ericsson HR"
            }
            await apiHelper.createManualTaskTemplate(templateData);
            externaltemplateData = {
                "templateName": 'External task19011' + randomStr,
                "templateSummary": 'External task19011' + randomStr,
                "templateStatus": "Active",
                "taskCompany": 'Ericsson Global',
                "ownerCompany": 'Ericsson HR',
                "ownerBusinessUnit": "Ericsson United States Support",
                "ownerGroup": "US Support 1",
                "lineOfBusiness": "Ericsson HR"
            }
            await apiHelper.createExternalTaskTemplate(externaltemplateData);
            automatedtemplateData = {
                "templateName": 'Automated task19011' + randomStr,
                "templateSummary": 'Automated task19011' + randomStr,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": 'Auto Proces' + randomStr,
                "taskCompany": "Ericsson HR",
                "ownerCompany": "Ericsson HR",
                "ownerBusinessUnit": "Ericsson United States Support",
                "ownerGroup": "US Support 1",
                "businessUnit": "Ericsson United States Support",
                "supportGroup": "US Support 1",
                "assignee": "rwillie",
                "lineOfBusiness": "Ericsson HR"
            }
            await apiHelper.createAutomatedTaskTemplate(automatedtemplateData);
            emailTemplateDataEricsson = {
                "TemplateName": "ericssonEmailTemplateName" + randomStr,
                "Company": "Ericsson HR",
                "Status": 1,
                "Description": "Leave details",
                "EmailMessageSubject": "Leave summary",
                "EmailMessageBody": "Hello testing",
                "lineOfBusiness": "Ericsson HR"
            }
            //create an email template 
            await apiHelper.createEmailTemplate(emailTemplateDataEricsson);
            emailTemplateDataEricsson.TemplateName = "ericssonGlobalEmailTemplate" + randomStr;
            emailTemplateDataEricsson.Company = 'Ericsson Global';
            await apiHelper.createEmailTemplate(emailTemplateDataEricsson);
            // Create Resoution code
            await apiHelper.apiLogin('rwillie');
            let resolutionCodeActiveOnUIData = {
                "menuItemName": "resolutionCodeNameEricsson" + randomStr,
                "menuItemStatus": "Active",
                "menuType": "Resolution Code",
                "lineOfBusiness": "Ericsson HR"
            }
            await apiHelper.createNewMenuItem(resolutionCodeActiveOnUIData);
            notesTemplate = {
                "templateName": "notesTemplateEricssonHR" + randomStr,
                "company": "Ericsson HR",
                "templateStatus": 1,
                "body": "this is notes template description Oracle",
                "lineOfBusiness": "Ericsson HR"
            }
            await apiHelper.createNotesTemplate("Case", notesTemplate);
            // Create Global Notes Template
            notesTemplate.templateName = "notesTemplateEricssonGlobal" + randomStr;
            notesTemplate.company = "Ericsson Global";
            await apiHelper.createNotesTemplate("Case", notesTemplate);
            let caseData = {
                "Requester": "rdustin",
                "Summary": "Summary" + randomStr,
                "Assigned Company": "Ericsson HR",
                "Business Unit": "Ericsson HR Support",
                "Support Group": "Compensation and Benefits",
                "Assignee": "syakov",
                "Line of Business": "Ericsson HR"
            };
            response = await apiHelper.createCase(caseData);
        });
        it('[DRDMV-23635]:Create Ericsson SAM data', async () => {
            await apiHelper.apiLogin('ttristan');
            templateDataSAM = {
                "templateName": 'Manual taskSAM' + randomStr,
                "templateSummary": 'Manual taskSAM' + randomStr,
                "templateStatus": "Active",
                "taskCompany": "Ericsson SAM",
                "ownerCompany": "Ericsson SAM",
                "ownerBusinessUnit": "Ericsson Asset Management - India",
                "ownerGroup": "Old Asset Management",
                "businessUnit": "Ericsson Asset Management - India",
                "supportGroup": "Old Asset Management",
                "assignee": "ttristan",
                "lineOfBusiness": "Ericsson SAM"
            }
            await apiHelper.createManualTaskTemplate(templateDataSAM);
            externaltemplateDataSAM = {
                "templateName": 'External taskSAM' + randomStr,
                "templateSummary": 'External taskSAM' + randomStr,
                "templateStatus": "Active",
                "taskCompany": 'Ericsson Global',
                "ownerCompany": 'Ericsson SAM',
                "ownerBusinessUnit": "Ericsson Asset Management - India",
                "ownerGroup": "Old Asset Management",
                "lineOfBusiness": "Ericsson SAM"
            }
            await apiHelper.createExternalTaskTemplate(externaltemplateDataSAM);
            automatedtemplateDataSAM = {
                "templateName": 'Automated taskSAM' + randomStr,
                "templateSummary": 'Automated taskSAM' + randomStr,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": 'Auto Proces' + randomStr,
                "taskCompany": "Ericsson SAM",
                "ownerCompany": "Ericsson SAM",
                "ownerBusinessUnit": "Ericsson Asset Management - India",
                "ownerGroup": "Old Asset Management",
                "businessUnit": "Ericsson Asset Management - India",
                "supportGroup": "Old Asset Management",
                "assignee": "ttristan",
                "lineOfBusiness": "Ericsson SAM"
            }
            await apiHelper.createAutomatedTaskTemplate(automatedtemplateDataSAM);
            emailTemplateDataEricssonSAM = {
                "TemplateName": "ericssonSAMEmailTemplateName" + randomStr,
                "Company": "Ericsson SAM",
                "Status": 1,
                "Description": "Leave details",
                "EmailMessageSubject": "Leave summary",
                "EmailMessageBody": "Hello testing",
                "lineOfBusiness": "Ericsson SAM"
            }
            //create an email template 
            await apiHelper.createEmailTemplate(emailTemplateDataEricssonSAM);
            emailTemplateDataEricsson.TemplateName = "ericssonGlobalEmailTemplate2" + randomStr;
            emailTemplateDataEricsson.Company = 'Ericsson Global';
            await apiHelper.createEmailTemplate(emailTemplateDataEricsson);
            notesTemplateSAM = {
                "templateName": "notesTemplateEricssonSAM" + randomStr,
                "company": "Ericsson SAM",
                "templateStatus": 1,
                "body": "this is notes template description",
                "lineOfBusiness": "Ericsson SAM"
            }
            await apiHelper.createNotesTemplate("Case", notesTemplateSAM);
            notesTemplate.templateName = "notesTemplateEricssonGlobal2" + randomStr;
            notesTemplate.company = "Ericsson Global";
            await apiHelper.createNotesTemplate("Case", notesTemplate);
        });
        it('[DRDMV-23635]:[Ericsson Model] [Cases] : Verify the behavior where Email Templates, Task Templates, Resolution Codes, Notes templates are filtered / displayed based on the Line of Business on Cases.', async () => {
            await navigationPage.signOut();
            await loginPage.login('rwillie');
            await utilityGrid.searchAndOpenHyperlink(response.displayId);
            await viewCasePage.clickOnEmailLink();
            await composeMailPo.clickOnSelectEmailTemplateLink();
            await selectEmailTemplateBladePo.searchEmailTemplate("ericssonEmailTemplateName" + randomStr);
            expect(await selectEmailTemplateBladePo.getGridRecordValue("Template Name")).toBe("ericssonEmailTemplateName" + randomStr);
            await selectEmailTemplateBladePo.searchEmailTemplate("ericssonGlobalEmailTemplate" + randomStr);
            expect(await selectEmailTemplateBladePo.getGridRecordValue("Template Name")).toBe("ericssonGlobalEmailTemplate" + randomStr);
            await selectEmailTemplateBladePo.searchEmailTemplate(emailTemplateDataEricssonSAM.TemplateName);
            expect(await selectEmailTemplateBladePo.isRecordPresent(emailTemplateDataEricssonSAM.TemplateName)).toBeFalsy();
            await selectEmailTemplateBladePo.searchEmailTemplate("ericssonGlobalEmailTemplate2" + randomStr);
            expect(await selectEmailTemplateBladePo.isRecordPresent("ericssonGlobalEmailTemplate2" + randomStr)).toBeFalsy();
            await selectEmailTemplateBladePo.clickOnCancelButton();
            await composeMailPo.clickOnSelectEmailTemplateLink();
            await selectEmailTemplateBladePo.searchAndSelectEmailTemplate("ericssonEmailTemplateName" + randomStr);
            await selectEmailTemplateBladePo.clickOnApplyButton();
            await composeMailPo.setToOrCCInputTextbox('To', 'fritz.schulz@petramco.com');
            await composeMailPo.clickOnSendButton();
            await utilityCommon.closePopUpMessage();
        });
        it('[DRDMV-23635]:[Ericsson Model] [Cases] : Verify the behavior where Email Templates, Task Templates, Resolution Codes, Notes templates are filtered / displayed based on the Line of Business on Cases.', async () => {
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.clickAddTaskFromTemplateButton();
            await manageTaskBladePo.searchTaskTemplate(templateData.templateSummary);
            expect(await manageTaskBladePo.getGridRecordValue("Template Name")).toBe(templateData.templateSummary);
            await manageTaskBladePo.searchTaskTemplate(automatedtemplateData.templateSummary);
            expect(await manageTaskBladePo.getGridRecordValue("Template Name")).toBe(automatedtemplateData.templateSummary);
            await manageTaskBladePo.searchTaskTemplate(externaltemplateData.templateSummary);
            expect(await manageTaskBladePo.getGridRecordValue("Template Name")).toBe(externaltemplateData.templateSummary);
            await manageTaskBladePo.searchTaskTemplate(externaltemplateDataSAM.templateSummary);
            expect(await manageTaskBladePo.isRecordPresent(externaltemplateDataSAM.templateSummary)).toBeFalsy();
            await manageTaskBladePo.searchTaskTemplate(templateDataSAM.templateSummary);
            expect(await manageTaskBladePo.isRecordPresent(templateDataSAM.templateSummary)).toBeFalsy();
            await manageTaskBladePo.clickTaskGridCancelButton();
            await manageTaskBladePo.addTaskFromTaskTemplate(templateData.templateSummary);
            await manageTaskBladePo.addTaskFromTaskTemplate(automatedtemplateData.templateSummary);
            await manageTaskBladePo.addTaskFromTaskTemplate(externaltemplateData.templateSummary);
            await manageTaskBladePo.clickCloseButton();
        });
        it('[DRDMV-23635]:[Ericsson Model] [Cases] : Verify the behavior where Email Templates, Task Templates, Resolution Codes, Notes templates are filtered / displayed based on the Line of Business on Cases.', async () => {
            // Verify Case Notes Template
            await activityTabPo.clickActivityNoteTextBox();
            await activityTabPo.clickOnNotesTemplate();
            expect(await notesTemplateUsage.isTemplatePresent("notesTemplateEricssonHR" + randomStr)).toBeTruthy();
            expect(await notesTemplateUsage.isTemplatePresent("notesTemplateEricssonGlobal" + randomStr)).toBeTruthy();
            expect(await notesTemplateUsage.isTemplatePresent(notesTemplateSAM.templateName)).toBeFalsy();
            expect(await notesTemplateUsage.isTemplatePresent("notesTemplateEricssonGlobal2" + randomStr)).toBeFalsy();
            await notesTemplateUsage.clickOnCancelBtn();
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(response.displayId);
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate("notesTemplateEricssonHR" + randomStr);
            expect(await ckeditorValidationPo.getTextCkEditorTextArea()).toContain(notesTemplate.body);
            await activityTabPo.clickOnPostButton();
            expect(await activityTabPo.isTextPresentInActivityLog(notesTemplate.body)).toBeTruthy();
        });
        it('[DRDMV-23635]:[Ericsson Model] [Cases] : Verify the behavior where Email Templates, Task Templates, Resolution Codes, Notes templates are filtered / displayed based on the Line of Business on Cases.', async () => {
            // Verify Resolution Code
            await viewCasePage.clickEditCaseButton();
            await editCasePo.updateResolutionCode(resolutionCode);
            await editCasePo.setResolutionDescription(resolutionCode);
            await editCasePo.clickSaveCase();
            await utilityCommon.closePopUpMessage();
            expect(await viewCasePage.getResolutionCodeValue()).toBe(resolutionCode);
            expect(await viewCasePage.getResolutionDescription()).toBe(resolutionCode);
            await updateStatusBladePo.changeCaseStatus('Resolved');
            await updateStatusBladePo.setStatusReason('Auto Resolved');
            await updateStatusBladePo.clickSaveStatus();
            await utilityCommon.closePopUpMessage();
            expect(await viewCasePage.getTextOfStatus()).toBe('Resolved');
            expect(await viewCasePage.getResolutionCodeValue()).toBe(resolutionCode);
            expect(await viewCasePage.getResolutionDescription()).toBe(resolutionCode);
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });
});