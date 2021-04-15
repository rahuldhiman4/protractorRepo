import { cloneDeep } from 'lodash';
import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import { flowsetMandatoryFields } from '../../data/ui/flowset/flowset.ui';
import { NOTES_TEMPLATE_MANDATORY_FIELD } from '../../data/ui/Social/notesTemplate.api';
import { SAMPLE_MENU_ITEM } from '../../data/ui/ticketing/menu.item.ui';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import menuItemEditPage from "../../pageobject/settings/application-config/edit-menu-items-config.po";
import menuItemsConfigConsole from "../../pageobject/settings/application-config/menu-items-config-console.po";
import approvalMappingConsolePO from '../../pageobject/settings/case-management/approval-mapping-console.po';
import assignmentConfigConsole from "../../pageobject/settings/case-management/assignments-config-console.po";
import caseTemplateConsolePage from '../../pageobject/settings/case-management/console-casetemplate.po';
import editApprovalMappingPage from '../../pageobject/settings/case-management/edit-approval-mapping.po';
import assignmentConfigEditPage from "../../pageobject/settings/case-management/edit-assignments-config.po";
import editCaseTemplatePage from '../../pageobject/settings/case-management/edit-casetemplate.po';
import caseReadAccessConfigEditPage from "../../pageobject/settings/case-management/edit-read-access-config.po";
import caseReadAccessConfigConsole from "../../pageobject/settings/case-management/read-access-console.po";
import viewCasetemplatePo from '../../pageobject/settings/case-management/view-casetemplate.po';
import notesTemplateConsole from "../../pageobject/settings/common/console-notestemplate.po";
import editNotesTemplateConfig from "../../pageobject/settings/common/edit-notestemplate.po";
import statusConfig from "../../pageobject/settings/common/status-config.po";
import documentTemplateConsolePo from '../../pageobject/settings/document-management/document-template-console.po';
import editDocumentTemplatePage from '../../pageobject/settings/document-management/edit-document-template.po';
import acknowledgementTemplateConsolePage from "../../pageobject/settings/email/console-acknowledgment-template.po";
import emailConfigurationConsole from '../../pageobject/settings/email/console-email-configuration.po';
import emailTemplateConsolePage from "../../pageobject/settings/email/console-email-template.po";
import editAcknowledementTemplatePage from "../../pageobject/settings/email/edit-acknowledgment-template.po";
import editEmailConfiguration from '../../pageobject/settings/email/edit-email-config.po';
import editEmailTemplatePage from "../../pageobject/settings/email/edit-email-template.po";
import flowsetConsole from "../../pageobject/settings/manage-flowset/console-flowset-config.po";
import flowsetEditPage from "../../pageobject/settings/manage-flowset/edit-flowset-config.po";
import notificationTemplateConsolePage from '../../pageobject/settings/notification-config/console-notification-template.po';
import editNotificationTemplatePage from '../../pageobject/settings/notification-config/edit-notification-template.po';
import relationshipsConfigsPage from "../../pageobject/settings/relationship/relationships-configs.po";
import configureDataSourceConfigConsole from "../../pageobject/settings/slm/configure-data-source-config-console.po";
import configureDataSourceEditPage from "../../pageobject/settings/slm/edit-configure-data-source-config.po";
import goalTypeEditPage from "../../pageobject/settings/slm/edit-goal-type.po";
import editServiceTargetConfigPage from '../../pageobject/settings/slm/edit-service-target-config.po';
import editServiceTargetGroupPage from '../../pageobject/settings/slm/edit-service-target-group-config.po';
import goalTypeConfigConsole from "../../pageobject/settings/slm/goal-type-config-console.po";
import serviceTargetGroupConsole from '../../pageobject/settings/slm/service-target-group-console.po';
import serviceTargetConsolePage from '../../pageobject/settings/slm/service-target-viewconsole.po';
import taskTemplateConsolePage from '../../pageobject/settings/task-management/console-tasktemplate.po';
import editTaskTemplatePage from '../../pageobject/settings/task-management/edit-tasktemplate.po';
import viewTaskTemplatePage from '../../pageobject/settings/task-management/view-tasktemplate.po';
import { BWF_BASE_URL, BWF_PAGE_TITLES } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from "../../utils/utility.grid";

describe('Case Manager Read-only Config', () => {
    let caseModule = 'Case';

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qdu');
    });

    afterEach(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.gotoCaseConsole();
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    // asahitya
    it('[4020]: Check Case manager is not able to perform Create Update Delete operation on Case Assignment Mapping', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let assignmentMappingData = {
            "assignmentMappingName": "Assignment mapping name" + randomStr,
            "company": "Petramco",
            "supportCompany": "Petramco",
            "businessUnit": "United States Support",
            "supportGroup": "US Support 3",
            "assignee": "qfeng",
            "categoryTier1": "Employee Relations",
            "categoryTier2": "Compensation",
            "categoryTier3": "Bonus"
        }
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoSettingsPage();
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createCaseAssignmentMapping(assignmentMappingData);
        await navigationPage.gotoSettingsMenuItem('Case Management--Assignments', BWF_PAGE_TITLES.CASE_MANAGEMENT.ASSIGNMENTS);
        expect(await assignmentConfigConsole.isAddAssignmentsBtnDisplayed()).toBeFalsy();
        await utilityGrid.searchRecord(assignmentMappingData.assignmentMappingName);
        await utilityGrid.selectAllCheckBox();
        expect(await assignmentConfigConsole.isDeleteAssignmentConfigBtnDisplayed()).toBeFalsy();
        await utilityGrid.searchAndOpenHyperlink(assignmentMappingData.assignmentMappingName);
        expect(await assignmentConfigEditPage.isEditAssignmentNameDisabled()).toBeTruthy();
        expect(await assignmentConfigEditPage.isDefaultToggleBtnDisabled()).toBeTruthy();
        expect(await assignmentConfigEditPage.isSaveBtnDisabled()).toBeTruthy();
    });

    // asahitya
    describe('[4018]: Check Case manager is not able to perform Create Update Delete operation on Read Access mapping', async () => {
        let readAccessMappingData, randomStr: string = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            readAccessMappingData = {
                "configName": 'Read Access Mapping Name' + randomStr,
                "assignedCompany": 'Petramco',
                "businessUnit": 'HR Support',
                "supportGroup": 'Compensation and Benefits',
                "company": 'Petramco',
                "category1": "Employee Relations"
            }

            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createReadAccessMapping(readAccessMappingData);
        });
        it('[4018]: Check Case manager is not able to perform Create Update Delete operation on Read Access mapping', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Read Access', BWF_PAGE_TITLES.CASE_MANAGEMENT.READ_ACCESS);
            expect(await caseReadAccessConfigConsole.isAddButtonDisplayed()).toBeFalsy();
            await utilityGrid.searchRecord('Read Access Mapping Name' + randomStr);
            await utilityGrid.selectAllCheckBox();
            expect(await caseReadAccessConfigConsole.isDeleteButtonDisplayed()).toBeFalsy();
            await utilityGrid.searchAndOpenHyperlink('Read Access Mapping Name' + randomStr);
            expect(await caseReadAccessConfigEditPage.isAccessMappingNameDisabled()).toBeTruthy();
            expect(await caseReadAccessConfigEditPage.isDefaultToggleBtnDisabled()).toBeTruthy();
            expect(await caseReadAccessConfigEditPage.isSaveBtnDisabled()).toBeTruthy();
        });
    });

    // asahitya
    describe('[4003]: Check Case manager is not able to perform Create Update operation on Menu Items', async () => {
        let randomStr: string = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let label;
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            let menuItemData = cloneDeep(SAMPLE_MENU_ITEM);
            label = menuItemData.menuItemName + randomStr;
            menuItemData.menuItemName = label;
            await apiHelper.apiLogin('elizabeth');
            await apiHelper.createNewMenuItem(menuItemData);
        });
        it('[4003]: Check Case manager is not able to perform Create Update operation on Menu Items', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Menu Items', BWF_PAGE_TITLES.APPLICATION_CONFIGURATIONS.MENU_ITEMS);
            expect(await menuItemsConfigConsole.isAddButtonDisplayed()).toBeFalsy();
            await utilityGrid.searchAndOpenHyperlink(label);
            expect(await menuItemEditPage.isMenuItemsStatusDisabled()).toBeTruthy("Status field is enabled");
            expect(await menuItemEditPage.isDefaultToggleBtnDisabled()).toBeTruthy("Default Toggle is enabled");
            expect(await menuItemEditPage.isSaveButtonDisabled()).toBeTruthy("Save button is enabled");
        });
    });

    // asahitya-log defect
    it('[4017]: Check Case manager is not able to perform Create Update Delete operation on Case-> Status Configuration', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Status Configuration', BWF_PAGE_TITLES.CASE_MANAGEMENT.STATUS_CONFIGURATION);
        await statusConfig.setCompanyDropdown("Petramco", 'case');
        expect(await statusConfig.isEditLifeCycleBtnDisabled()).toBeTruthy("Edit Life Cycle button is enabled");
    });

    // asahitya-log defect
    it('[4007]: Check Case manager is not able to perform Create Update Delete operation on Task->Status Configuration', async () => {
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Status Configuration', BWF_PAGE_TITLES.TASK_MANAGEMENT.STATUS_CONFIGURATION);
        await statusConfig.setCompanyDropdown("Petramco", 'task');
        expect(await statusConfig.isEditLifeCycleBtnDisabled()).toBeTruthy("Edit Life Cycle button is enabled");
    });

    // asahitya
    it('[3964]: Check Case manager is not able to perform Create Update operation on Goal Type', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let goalTypeInactive = {
            "svtGoalTypeName": "Goal Type Inactive HR" + randomStr,
            "status": 1,
            "lineOfBusiness": "Human Resource"
        }
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createSVTGoalType(goalTypeInactive);
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Service Level Management--Goal Type', BWF_PAGE_TITLES.SERVICE_LEVEL_MANAGEMENT.GOAL_TYPE);
        expect(await goalTypeConfigConsole.isAddGoalTypeBtnDisplayed()).toBeFalsy("Add button is enabled");
        await utilityGrid.searchAndOpenHyperlink(goalTypeInactive.svtGoalTypeName);
        expect(await goalTypeEditPage.isStatusFieldDisabled()).toBeTruthy("Status field is enabled");
        expect(await goalTypeEditPage.isSaveButtonDisabled()).toBeTruthy("Save button is enabled");
    });

    // asahitya-passing locally
    it('[3993]: Check Case manager is not able to perform Create Update operation on Configure Data Source', async () => {
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Service Level Management--Configure Data Source', BWF_PAGE_TITLES.SERVICE_LEVEL_MANAGEMENT.CONFIGURE_DATA_SOURCE);
        expect(await configureDataSourceConfigConsole.isConfigDataSourceBtnVisible()).toBeFalsy("Add button is visible");
        await utilityGrid.searchAndOpenHyperlink("Case Management");
        await configureDataSourceEditPage.clickDataSourceLink('Show Advanced Settings');
        expect(await configureDataSourceEditPage.isAssociationNameDisabled()).toBeTruthy("Association Name is enabled");
        expect(await configureDataSourceEditPage.isBuildExpressionBtnDisabled()).toBeTruthy("Build Expression button is enabled");
        expect(await configureDataSourceEditPage.isSaveBtnDisabled()).toBeTruthy("Save button is enabled");
    });

    // asahitya
    it('[4019]: Check Case manager is not able to perform Create Update Delete operation on Note template', async () => {
        //API call to create the case notes template
        await apiHelper.apiLogin('qkatawazi');
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        NOTES_TEMPLATE_MANDATORY_FIELD.templateName = NOTES_TEMPLATE_MANDATORY_FIELD.templateName + randomStr;
        await apiHelper.createNotesTemplate("Case", NOTES_TEMPLATE_MANDATORY_FIELD);

        await navigationPage.gotoCreateCase();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Notes Template', BWF_PAGE_TITLES.CASE_MANAGEMENT.NOTES_TEMPLATES);
        expect(await notesTemplateConsole.isAddNotesTemplateBtnDisplayed()).toBeFalsy("Add notes template button is enabled");
        await utilityGrid.searchAndSelectGridRecord(NOTES_TEMPLATE_MANDATORY_FIELD.templateName);
        expect(await notesTemplateConsole.isDeleteNotesTemplateBtnDisplayed()).toBeFalsy("Delete notes template button is enabled");
        await utilityGrid.searchAndOpenHyperlink(NOTES_TEMPLATE_MANDATORY_FIELD.templateName);
        expect(await editNotesTemplateConfig.isStatusFieldDisabled()).toBeTruthy("Status field is enabled");
        expect(await editNotesTemplateConfig.isDescriptionFieldDisabled()).toBeTruthy("Description field is enabled");
    });

    // asahitya
    it('[4008]: Check Case manager is not able to perform Create Update Delete operation on Task->Note Template', async () => {
        //API call to create the case notes template
        await apiHelper.apiLogin('qkatawazi');
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        NOTES_TEMPLATE_MANDATORY_FIELD.templateName = NOTES_TEMPLATE_MANDATORY_FIELD.templateName + randomStr;
        await apiHelper.createNotesTemplate("Task", NOTES_TEMPLATE_MANDATORY_FIELD);

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Notes Template', BWF_PAGE_TITLES.TASK_MANAGEMENT.NOTES_TEMPLATES);
        expect(await notesTemplateConsole.isAddNotesTemplateBtnDisplayed()).toBeFalsy("Add notes template button is enabled");
        await utilityGrid.searchAndSelectGridRecord(NOTES_TEMPLATE_MANDATORY_FIELD.templateName);
        expect(await notesTemplateConsole.isDeleteNotesTemplateBtnDisplayed()).toBeFalsy("Delete notes template button is enabled");
        await utilityGrid.searchAndOpenHyperlink(NOTES_TEMPLATE_MANDATORY_FIELD.templateName);
        expect(await editNotesTemplateConfig.isStatusFieldDisabled()).toBeTruthy("Status field is enabled");
        expect(await editNotesTemplateConfig.isDescriptionFieldDisabled()).toBeTruthy("Description field is enabled");
    });

    // asahitya
    it('[4015]: Check Case manager is not able to perform Create Update Delete operation on People->Note Template', async () => {
        //API call to create the case notes template
        await apiHelper.apiLogin('qkatawazi');
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        NOTES_TEMPLATE_MANDATORY_FIELD.templateName = NOTES_TEMPLATE_MANDATORY_FIELD.templateName + randomStr;
        await apiHelper.createNotesTemplate("People", NOTES_TEMPLATE_MANDATORY_FIELD);

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('People--Notes Template', BWF_PAGE_TITLES.PEOPLE.NOTES_TEMPLATES);
        expect(await notesTemplateConsole.isAddNotesTemplateBtnDisplayed()).toBeFalsy("Add notes template button is enabled");
        await utilityGrid.searchAndSelectGridRecord(NOTES_TEMPLATE_MANDATORY_FIELD.templateName);
        expect(await notesTemplateConsole.isDeleteNotesTemplateBtnDisplayed()).toBeFalsy("Delete notes template button is enabled");
        await utilityGrid.searchAndOpenHyperlink(NOTES_TEMPLATE_MANDATORY_FIELD.templateName);
        expect(await editNotesTemplateConfig.isStatusFieldDisabled()).toBeTruthy("Status field is enabled");
        expect(await editNotesTemplateConfig.isDescriptionFieldDisabled()).toBeTruthy("Description field is enabled");
    });

    // asahitya
    it('[DRDMV-18071]: Check Case manager is not able to perform Create Update operation on Define Flowset configuration', async () => {
        //API call to create the flowset
        await apiHelper.apiLogin('qkatawazi');
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let flowsetMandatoryFieldsData = cloneDeep(flowsetMandatoryFields);
        flowsetMandatoryFieldsData.flowsetName = flowsetMandatoryFieldsData.flowsetName + randomStr;
        await apiHelper.createNewFlowset(flowsetMandatoryFieldsData);

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Define Flowsets', BWF_PAGE_TITLES.MANAGE_FLOWSETS.DEFINE_FLOWSETS);
        expect(await flowsetConsole.isAddFlowsetButtonDisplayed()).toBeFalsy("Add button is enabled");
        await utilityGrid.searchAndOpenHyperlink(flowsetMandatoryFieldsData.flowsetName);
        expect(await flowsetEditPage.isFlowsetNameDisabled()).toBeTruthy("Flowset name  is enabled");
        expect(await flowsetEditPage.isStatusFieldDisabled()).toBeTruthy("Add Associate Category button is enabled");
        expect(await flowsetEditPage.isSaveBtnDisabled()).toBeTruthy("Add Associate Category button is enabled");
        expect(await flowsetEditPage.isAddNewMappingBtnDisabled()).toBeTruthy("Add Associate Mapping button is enabled");
    });

    // asahitya-passing locally
    it('[DRDMV-18077]: Check Case manager is not able to perform Create Update operation on Case to Case Relationship', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Relationships--Case to Case', BWF_PAGE_TITLES.RELATIONSHIPS.CASE_TO_CASE);
        await relationshipsConfigsPage.clickFirstCardTitle();
        await relationshipsConfigsPage.clickFirstCardTitle();
        expect(await relationshipsConfigsPage.isAddRelationButtonDisabled()).toBeTruthy('Add Button is enabled');
        expect(await relationshipsConfigsPage.isRelationshipNameFieldEnabled('Parent')).toBeFalsy('Parent name is enabled');
        expect(await relationshipsConfigsPage.isSaveButtonEnabled()).toBeFalsy('Save button is enabled');
    });

    // asahitya-passing locally
    it('[DRDMV-18078]: Check Case manager is not able to perform Create Update operation on Case to Person Relationship', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Relationships--Case to Person', BWF_PAGE_TITLES.RELATIONSHIPS.CASE_TO_PERSON);
        await relationshipsConfigsPage.clickFirstCardTitle();
        await relationshipsConfigsPage.clickFirstCardTitle();
        expect(await relationshipsConfigsPage.isAddRelationButtonDisabled()).toBeTruthy('Add Button is enabled');
        expect(await relationshipsConfigsPage.isRelationshipNameFieldEnabled('Witness')).toBeFalsy('Witness name is enabled');
        expect(await relationshipsConfigsPage.isSaveButtonEnabled()).toBeFalsy('Save button is enabled');
    });

    // asahitya-passing locally
    it('[DRDMV-18079]: Check Case manager is not able to perform Create Update operation on Person to Person Relationship', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Relationships--Person to Person', BWF_PAGE_TITLES.RELATIONSHIPS.PERSON_TO_PERSON);
        await relationshipsConfigsPage.clickFirstCardTitle();
        await relationshipsConfigsPage.clickFirstCardTitle();
        expect(await relationshipsConfigsPage.isAddRelationButtonDisabled()).toBeTruthy('Add Button is enabled');
        expect(await relationshipsConfigsPage.isRelationshipNameFieldEnabled('Former Manager')).toBeFalsy('Former Manager name is enabled');
        expect(await relationshipsConfigsPage.isSaveButtonEnabled()).toBeFalsy('Save button is enabled');
    });

    //asahitya
    it('[DRDMV-18063]: Check Case manager is not able to perform Create Update Delete operation on Email->Template', async () => {
        await apiHelper.apiLogin('qkatawazi');
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let emailTemplateData = require('../../data/ui/email/email.template.api.json');
        let emailTemplateName: string = await emailTemplateData['emailTemplateWithMandatoryField'].TemplateName + randomStr;
        emailTemplateData['emailTemplateWithMandatoryField'].TemplateName = emailTemplateName;
        await apiHelper.createEmailTemplate(emailTemplateData['emailTemplateWithMandatoryField']);

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Email--Templates', BWF_PAGE_TITLES.EMAIL.TEMPLATES);
        expect(await emailTemplateConsolePage.isAddEmailTemplateButtonDisplayed()).toBeFalsy('Add Email Template Button is enabled');
        await utilityGrid.searchRecord(emailTemplateName);
        await utilityGrid.searchAndSelectGridRecord(emailTemplateName);
        expect(await emailTemplateConsolePage.isDeleteEmailTemplateButtonDisplayed()).toBeFalsy('Delete Template Button is enabled');
        await utilityGrid.searchAndOpenHyperlink(emailTemplateName);
        expect(await editEmailTemplatePage.isTemplateNameEnabled()).toBeFalsy('Template Name is enabled');
        expect(await editEmailTemplatePage.isStatusFieldEnabled()).toBeFalsy('Status field is enabled');
        expect(await editEmailTemplatePage.isLocalizedMessageButtonEnabled()).toBeFalsy('Localized Message button is enabled');
        await editEmailTemplatePage.clickOnBodyCheckbox();
        expect(await editEmailTemplatePage.isEditButtonEnabled()).toBeFalsy('Edit Body button is enabled');
        await editEmailTemplatePage.clickOnSubjectCheckbox();
        expect(await editEmailTemplatePage.isEditButtonEnabled()).toBeFalsy('Edit Subject button is enabled');
    });

    //asahitya
    it('[DRDMV-18061]: Check Case manager is not able to perform Create Update and Delete operation on Email->Acknowledgement template', async () => {
        await apiHelper.apiLogin('qkatawazi');
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let emailTemplateData = require('../../data/ui/email/email.template.api.json');
        let emailTemplateName: string = await emailTemplateData['emailTemplateWithMandatoryField'].TemplateName + randomStr;
        emailTemplateData['emailTemplateWithMandatoryField'].TemplateName = emailTemplateName;
        await apiHelper.createEmailAcknowledgementTemplate(emailTemplateData['emailTemplateWithMandatoryField']);

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Email--Acknowledgment Templates', BWF_PAGE_TITLES.EMAIL.ACKNOWLEDGMENT_TEMPLATES);
        expect(await acknowledgementTemplateConsolePage.isAddAcknowledgeTemplateButtonDisplayed()).toBeFalsy('Add Email Template Button is enabled');
        await utilityGrid.searchRecord(emailTemplateName);
        await utilityGrid.searchAndSelectGridRecord(emailTemplateName);
        expect(await acknowledgementTemplateConsolePage.isDeleteAcknowledgementTemplateButtonDisplayed()).toBeFalsy('Delete Template Button is enabled');
        await utilityGrid.searchAndOpenHyperlink(emailTemplateName);
        expect(await editAcknowledementTemplatePage.isTemplateNameEnabled()).toBeFalsy('Template Name is enabled');
        expect(await editAcknowledementTemplatePage.isStatusFieldEnabled()).toBeFalsy('Status field is enabled');
        expect(await editAcknowledementTemplatePage.isLocalizedMessageButtonEnabled()).toBeFalsy('Localized Message button is enabled');
        await editAcknowledementTemplatePage.clickOnBodyCheckbox();
        expect(await editAcknowledementTemplatePage.isEditButtonEnabled()).toBeFalsy('Edit Body button is enabled');
        await editAcknowledementTemplatePage.clickOnSubjectCheckbox();
        expect(await editAcknowledementTemplatePage.isEditButtonEnabled()).toBeFalsy('Edit Subject button is enabled');
    });

    //asahitya-tell anant about expect conditions
    it('[3963]: Check Case manager is not able to perform Create Update operation on Service Target', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await apiHelper.apiLogin('qkatawazi');
        const svtData = {
            "terms": "'1000000063'=\"cb500f4763edeb302d4644e2d5cf22372543dedda74717135ffc927758066570c1a59648f541d5392790876c312fcf2a0501a76d13290562cce65a69c48e7356\"",
            "readableTerms": "'Company'=\"Petramco\"",
            "startWhen": "'450000021'=\"5000\"",
            "readableStartWhen": "'Status'=\"Resolved\"",
            "stopWhen": "'450000021'=\"7000\"",
            "readableStopWhen": "'Status'=\"Closed\"",
            "goalTimeMinutes": "4",
            "dataSource": "Case Management",
            "company": "Petramco",
            "svtName": "DRDMV18170"
        }
        svtData.svtName = "DRDMV18170" + randomStr;
        await apiHelper.createSVT(svtData);
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target', BWF_PAGE_TITLES.SERVICE_LEVEL_MANAGEMENT.SERVICE_TARGET);
        expect(await serviceTargetConsolePage.isAddSVTButtonVisible()).toBeFalsy('Add SVT button is enabled');
        await browser.sleep(3000); // hardwait for SVT to appear, may not be removed
        await utilityGrid.searchAndOpenHyperlink("DRDMV18170" + randomStr);
        expect(await editServiceTargetConfigPage.isStatusFieldDisabled()).toBeTruthy('Status field is enabled');
        expect(await editServiceTargetConfigPage.isBuildExpressionButtonDisabled()).toBeTruthy('Build Expression button is enabled');
        expect(await editServiceTargetConfigPage.isDescriptionFieldDisabled()).toBeTruthy('Description field is enabled');
        expect(await editServiceTargetConfigPage.isGoalDaysFieldEnabled()).toBeFalsy('Goal Days field is enabled');
        expect(await editServiceTargetConfigPage.isGoalHoursFieldEnabled()).toBeFalsy('Goal Hours field is enabled');
        expect(await editServiceTargetConfigPage.isGoalMinutesFieldEnabled()).toBeFalsy('Goal Minutes field is enabled');
        await editServiceTargetConfigPage.expandSection('Measurement');
        expect(await editServiceTargetConfigPage.isSetWarningstatusFieldEnabled()).toBeFalsy('Set Warning status field is enabled');
        expect(await editServiceTargetConfigPage.isStartWhenBuildExpressionButtonEnabled()).toBeFalsy('Build Expression button on Start when is enabled');
        await editServiceTargetConfigPage.expandSection('Milestones');
        expect(await editServiceTargetConfigPage.isAddMilestoneButtonDisabled()).toBeTruthy('Add Milestone button is enabled');
        expect(await editServiceTargetConfigPage.isEditMilestoneButtonDisabled()).toBeTruthy('Edit Milestone button is enabled');
        expect(await editServiceTargetConfigPage.isDeleteMilestoneButtonDisabled()).toBeTruthy('Delete Milestone button is enabled');
        expect(await editServiceTargetConfigPage.isSaveButtonEnabled()).toBeFalsy('Save button is enabled');
    });

    it('[3962]: Check Case manager is not able to perform Create Update Delete operation on Service Target Group', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let svtGrpName = '3962' + randomStr;
        await apiHelper.apiLogin('qkatawazi');
        const svtData = {
            "terms": "'1000000063'=\"cb500f4763edeb302d4644e2d5cf22372543dedda74717135ffc927758066570c1a59648f541d5392790876c312fcf2a0501a76d13290562cce65a69c48e7356\"",
            "readableTerms": "'Company'=\"Petramco\"",
            "startWhen": "'450000021'=\"5000\"",
            "readableStartWhen": "'Status'=\"Resolved\"",
            "stopWhen": "'450000021'=\"7000\"",
            "readableStopWhen": "'Status'=\"Closed\"",
            "goalTimeMinutes": "4",
            "dataSource": "Case Management",
            "company": "Petramco",
            "svtName": "3962"
        }
        let svtGropuData = {
            "svtGroupName": svtGrpName,
            "dataSource": "Case Management",
        }
        svtData.svtName = "3962" + randomStr;
        await apiHelper.createSVT(svtData);
        await apiHelper.createServiceTargetGroup(svtGropuData);
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Service Level Management--Service Target Group', BWF_PAGE_TITLES.SERVICE_LEVEL_MANAGEMENT.SERVICE_TARGET_GROUP);
        expect(await serviceTargetGroupConsole.isAddServiceTargetGroupBtnVisible()).toBeFalsy('Add Button is enabled');
        await utilityGrid.searchAndOpenHyperlink(svtGrpName);
        expect(await editServiceTargetGroupPage.isSVTGroupNameDisabled()).toBeTruthy('SVT Group name is enabled');
        expect(await editServiceTargetGroupPage.isSVTSelectRadioBtnDisabled()).toBeTruthy('SVT Selection is enabled');
        expect(await editServiceTargetGroupPage.isSaveBtnEnabled()).toBeFalsy('Save button is enabled');
        await editServiceTargetGroupPage.clickcancel();
        await utilityGrid.searchAndSelectGridRecord(svtGrpName);
        expect(await serviceTargetGroupConsole.isDeleteButtonPresent()).toBeFalsy('Delete Button is enabled');
    });

    //asahitya,Raised DRDMV-25315
    it('[DRDMV-18041]: Check Case manager is not able to perform Create Update Delete operation on Notification Configuration', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Notification Configuration--Manage Templates', BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_TEMPLATES);
        expect(await notificationTemplateConsolePage.isAddNotificationTemplateBtnDisplayed()).toBeFalsy('Add Button is enabled');
        await utilityGrid.searchAndSelectGridRecord('Cancel Template');
        expect(await notificationTemplateConsolePage.isDeleteNotificationTemplateBtnDisplayed()).toBeFalsy('Delete Button is enabled');
        await utilityGrid.searchAndOpenHyperlink('Cancel Template');
        expect(await editNotificationTemplatePage.isDescriptionFieldDisabled()).toBeTruthy('Description field is enabled');
        expect(await editNotificationTemplatePage.isEventDropdownDisabled()).toBeTruthy('Event dropdown is enabled');
        expect(await editNotificationTemplatePage.isAddLocalizedButtonEnabled()).toBeFalsy('Add Localized button is enabled');
        expect(await editNotificationTemplatePage.isAddRecipientButtonEnabled()).toBeFalsy('Add Recipients button is enabled');
        expect(await editNotificationTemplatePage.isSaveButtonEnabled()).toBeFalsy('Save button is enabled');
        await editNotificationTemplatePage.openAlertEditMessageText();
        expect(await editNotificationTemplatePage.isAlertSubjectMessageDisabled()).toBeTruthy('Alert textbox is enabled');
        await editNotificationTemplatePage.cancelAlertMessageText();
        await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        await editNotificationTemplatePage.clickOnEmailTab();
        await editNotificationTemplatePage.openEmailBodyEditMessageText();
        expect(await editNotificationTemplatePage.isEmailBodyMessageDisabled()).toBeTruthy('Email body textbox is enabled');
        await editNotificationTemplatePage.cancelEmailBodyBlade();
        await editNotificationTemplatePage.openEmailSubjectEditMessageText();
        expect(await editNotificationTemplatePage.isEmailSubjectMessageDisabled()).toBeTruthy('Email subject textbox is enabled');
        await editNotificationTemplatePage.cancelEmailSubjectBlade();
    });

    //asahitya
    it('[4021]: Check Case manager is not able to perform Create Update Delete operation on Case Approval Mapping', async () => {
        //Create Approval Mapping
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');

        await apiHelper.apiLogin('qkatawazi');
        let approvalMappingData = {
            "triggerStatus": "InProgress",
            "errorStatus": "Canceled",
            "approvedStatus": "Resolved",
            "noApprovalFoundStatus": "Pending",
            "rejectStatus": "Canceled",
            "company": "Petramco",
            "mappingName": "Approval Mapping Name" + randomStr
        }
        await apiHelper.deleteApprovalMapping(caseModule);
        await apiHelper.createApprovalMapping(caseModule, approvalMappingData);

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Approval Mappings', BWF_PAGE_TITLES.CASE_MANAGEMENT.APPROVALS);
        expect(await approvalMappingConsolePO.isAddApprovalMappingBtnDisplayed()).toBeFalsy('Add Config button is displayed');
        await utilityGrid.searchAndOpenHyperlink("Approval Mapping Name" + randomStr);
        expect(await editApprovalMappingPage.isApprovalMappingNameDisabled()).toBeTruthy('Approval Mapping Name is editable');
        expect(await editApprovalMappingPage.isDropdownDisabled('StatusTrigger')).toBeTruthy('StatusTrigger dropdown is editable');
        expect(await editApprovalMappingPage.isCasesCreatedWithoutTemplateToggleDisabled()).toBeTruthy('CasesCreatedWithoutTemplateToggleButton is editable');
        await utilityCommon.closeAllBlades();
        await utilityGrid.searchAndSelectGridRecord("Approval Mapping Name" + randomStr);
        expect(await approvalMappingConsolePO.isDeleteApprovalMappingBtnDisplayed()).toBeFalsy('Delete button is displayed');
        //Case Template selection disabled part is covered in test case 6267
    });

    //asahitya
    it('[DRDMV-18062]: Check Case manager is not able to perform Create Update Delete operation on Email->Configuration', async () => {
        try {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteAllEmailConfiguration();
            await apiHelper.createEmailConfiguration();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', BWF_PAGE_TITLES.EMAIL.CONFIGURATION);
            await utilityGrid.searchAndSelectGridRecord('test@gmail.com');
            expect(await emailConfigurationConsole.isDeleteBtnDisplayed()).toBeFalsy('Delete Button is displayed');
            await utilityGrid.searchAndOpenHyperlink('test@gmail.com');
            await browser.sleep(50000);
            expect(await editEmailConfiguration.isDefaultCaseTemplateToUseBtnDisabled()).toBeTruthy('Default Case Template field is enabled');
            expect(await editEmailConfiguration.isAddNewRuleBtnDisabled()).toBeTruthy('Add New Rule button is enabled');
            expect(await editEmailConfiguration.isAddAvailableGlobalSubjectBtnDisabled()).toBeTruthy('Add available Global Subject button is enabled');
            await utilityGrid.searchAndSelectGridRecord('Out Of Office');
            expect(await editEmailConfiguration.isDeleteExlusionSubjectDisabled()).toBeTruthy('Remove Exclusion Subject button is enabled');
            expect(await editEmailConfiguration.isEditExlusiceSubjectDisabled()).toBeTruthy('Edit Exclusive Subject button is enabled');
            await editEmailConfiguration.selectTab("Acknowledgment Templates");
            await editEmailConfiguration.searchAndClickCheckboxOnAcknowledgementTemplateGrid('Task Update Ack Template');
            expect(await editEmailConfiguration.isAcknowledgementTemplateEditBtnEnabled()).toBeFalsy('Acknowledge Template Edit button is enabled');
            await editEmailConfiguration.selectTab("Trusted Email");
            expect(await editEmailConfiguration.isAddNewRuleBtnDisabled()).toBeTruthy('Add Trusted Email button is enabled');
            await editEmailConfiguration.selectTab("Blocked Email");
            expect(await editEmailConfiguration.isBlockedEmailBtnEnabled()).toBeFalsy('Add Blocked Email button is enabled');
        }
        catch (ex) { throw ex; }
        finally {
            await utilityCommon.closeAllBlades();
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteAllEmailConfiguration();
        }
    });

    //asahitya
    it('[4016]: Check Case manager is not able to perform Create operation on Case template', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateData = {
            "templateName": '4016 Name' + randomStr,
            "templateSummary": '4016 Summary' + randomStr,
            "templateStatus": "Draft",
            "company": "Petramco",
            "businessUnit": "United States Support",
            "supportGroup": "US Support 3",
            "ownerBU": "United States Support",
            "ownerGroup": "US Support 3"
        }
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createCaseTemplate(caseTemplateData);

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
        expect(await caseTemplateConsolePage.isAddCaseTemplateBtnDisplayed()).toBeFalsy('Add Case Template button is displayed');
        await caseTemplateConsolePage.searchAndselectCaseTemplate('4016 Name' + randomStr);
        expect(await caseTemplateConsolePage.isCopyCaseTemplateBtnDisplayed()).toBeFalsy('Copy Case Template button is displayed');
        await utilityGrid.searchAndOpenHyperlink('4016 Name' + randomStr);
        await editCaseTemplatePage.clickEditCaseTemplate();
        expect(await editCaseTemplatePage.isCaseStatusFieldDisabled()).toBeTruthy('Case status field is enabled');
        expect(await editCaseTemplatePage.isCaseSummaryFieldDisabled()).toBeTruthy('Case summary field is enabled');
        expect(await editCaseTemplatePage.isCopyTemplateBtnDisplayed()).toBeFalsy('Copy template button is displayed');
        expect(await editCaseTemplatePage.isSaveTemplateBtnEnabled()).toBeFalsy('Save button is enabled');
        await editCaseTemplatePage.clickOnEditCaseTemplateMetadata();
        expect(await editCaseTemplatePage.isTemplateStatusDisabled()).toBeTruthy('Template status field is enabled');
        expect(await editCaseTemplatePage.isSaveMetadataBtnEnabled()).toBeFalsy('Save metadata button is enabled');
        await editCaseTemplatePage.clickOnCancelButton();
        await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        await viewCasetemplatePo.clickBackArrowBtn();
    });

    //asahitya
    it('[4005]: Check Case manager is not able to perform Create operation on Task template', async () => {
        let taskTemplateName = '4005' + [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let taskTemplateData = {
            "templateName": taskTemplateName,
            "templateSummary": taskTemplateName,
            "templateStatus": "Draft",
            "taskCompany": "Petramco",
            "buisnessUnit": "HR Support",
            "supportGroup": "Compensation and Benefits",
            "ownerCompany": "Petramco",
            "ownerBusinessUnit": "HR Support",
            "ownerGroup": "Compensation and Benefits"
        }

        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createManualTaskTemplate(taskTemplateData);
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', BWF_PAGE_TITLES.TASK_MANAGEMENT.TEMPLATES);
        expect(await taskTemplateConsolePage.isAddManualTaskTemplateBtnDisplayed()).toBeFalsy('Add Manual Task Template button is displayed');
        expect(await taskTemplateConsolePage.isAddAutomatedTaskTemplateBtnDisplayed()).toBeFalsy('Add Automated Task Template button is displayed');
        expect(await taskTemplateConsolePage.isAddExternalTaskTemplateBtnDisplayed()).toBeFalsy('Add External Task Template button is displayed');
        await taskTemplateConsolePage.searchAndSelectTaskTemplate(taskTemplateName);
        expect(await taskTemplateConsolePage.isCopyTaskTemplateBtnDisplayed()).toBeFalsy('Copy Task Template button is displayed');
        await utilityGrid.searchAndOpenHyperlink(taskTemplateName);
        expect(await viewTaskTemplatePage.isCopyTaskButtonEnabled()).toBeFalsy('Copy task template button is enabled');
        await viewTaskTemplatePage.clickOnEditLink();
        expect(await editTaskTemplatePage.isTaskSummaryFieldDisabled()).toBeTruthy('Task Summary field is enabled');
        expect(await editTaskTemplatePage.isSaveTemplateBtnEnabled()).toBeFalsy('Task template save button is enabled');
        await editTaskTemplatePage.clickOnEditMetadataLink();
        expect(await editTaskTemplatePage.isTemplateStatusDisabled()).toBeTruthy('Template status field is enabled');
        expect(await editTaskTemplatePage.isSaveTemplateMetadataBtnEnabled()).toBeFalsy('Task template metadata save button is enabled');
        await editTaskTemplatePage.clickOnCancelButton();
        await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        await viewTaskTemplatePage.clickBackArrowBtn();
    });

    it('[DRDMV-18076]: Check Case manager is not able to perform Create Update Delete operation on Document Template', async () => {
        let documentTemplateName = 'DRDMV-18076' + [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let documentTemplateData = {
            "templateName": documentTemplateName,
            "description": documentTemplateName + "desc",
            "messageBody": "Message Body",
            "company": "Petramco",
        }

        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createDocumentTemplate(documentTemplateData);
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Document Management--Templates', BWF_PAGE_TITLES.DOCUMENT_MANAGEMENT.TEMPLATES);
        expect(await documentTemplateConsolePo.isAddDocumentTemplateBtnDisplayed()).toBeFalsy('Add Document template button is displayed');
        await utilityGrid.searchAndSelectGridRecord(documentTemplateName);
        expect(await documentTemplateConsolePo.isDeleteDocumentTemplateBtnDisplayed()).toBeFalsy('Delete Document template button is displayed');
        await utilityGrid.searchAndOpenHyperlink(documentTemplateName);
        expect(await editDocumentTemplatePage.isDescriptionFieldDisabled()).toBeTruthy('Description Field is enabled');
        expect(await editDocumentTemplatePage.isSaveButtonEnabled()).toBeFalsy('Status button is enabled');
    });
});
