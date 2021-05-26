import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import caseConsolePo from '../../pageobject/case/case-console.po';
import previewCasePo from '../../pageobject/case/case-preview.po';
import createCasePage from '../../pageobject/case/create-case.po';
import editCasePo from '../../pageobject/case/edit-case.po';
import quickCasePo from '../../pageobject/case/quick-case.po';
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import viewCasePo from "../../pageobject/case/view-case.po";
import addFieldsPopPo from '../../pageobject/common/add-fields-pop.po';
import applicationConfigPo from '../../pageobject/settings/application-config/application-config.po';
import dynamicFieldsPage from '../../pageobject/common/dynamic-fields.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import updateStatusBladePo from '../../pageobject/common/update.status.blade.po';
import createDynamicFieldLibraryConfigPo from '../../pageobject/settings/application-config/create-dynamic-field-library-config.po';
import createDynamicGroupLibraryConfigPo from '../../pageobject/settings/application-config/create-dynamic-group-library-config.po';
import dynamicFieldLibraryConfigConsolePo from '../../pageobject/settings/application-config/dynamic-field-library-config-console.po';
import dynamicGroupLibraryConfigConsolePo from '../../pageobject/settings/application-config/dynamic-group-library-config-console.po';
import consoleCasetemplatePo from '../../pageobject/settings/case-management/console-casetemplate.po';
import copyCasetemplatePo from '../../pageobject/settings/case-management/copy-casetemplate.po';
import editCasetemplatePo from '../../pageobject/settings/case-management/edit-casetemplate.po';
import viewCasetemplatePo from '../../pageobject/settings/case-management/view-casetemplate.po';
import createDocumentTemplatePo from '../../pageobject/settings/document-management/create-document-template.po';
import editDocumentTemplatePo from '../../pageobject/settings/document-management/edit-document-template.po';
import selectTaskTemplate from "../../pageobject/settings/task-management/console-tasktemplate.po";
import copyTasktemplatePo from '../../pageobject/settings/task-management/copy-tasktemplate.po';
import createTaskTemplate from "../../pageobject/settings/task-management/create-tasktemplate.po";
import editTaskTemplate from "../../pageobject/settings/task-management/edit-tasktemplate.po";
import viewTaskTemplate from "../../pageobject/settings/task-management/view-tasktemplate.po";
import activityTabPo from '../../pageobject/social/activity-tab.po';
import editTaskPo from '../../pageobject/task/edit-task.po';
import manageTaskBladePo from "../../pageobject/task/manage-task-blade.po";
import viewTaskPo from '../../pageobject/task/view-task.po';
import { BWF_BASE_URL, BWF_PAGE_TITLES } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';
import changeAssignmentPo from '../../pageobject/common/change-assignment.po';
import casePreviewPo from '../../pageobject/case/case-preview.po';

describe('Dynamic Hidden Data', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //ankagraw
    describe('[4820]: [Dynamic Data] [UI] - Automated Task Template UI on create and on Edit', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let automatedTaskTemplate1 = 'Automation Task1 ' + randomStr;
        let automatedTaskSummary1 = 'Automation Summary1 ' + randomStr;
        let processName = 'Process Name ' + randomStr;
        it('[4820]: Validate Automated Task Template ', async () => {
            //Automation Task template
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', BWF_PAGE_TITLES.TASK_MANAGEMENT.TEMPLATES);
            await selectTaskTemplate.clickOnAutomationTaskTemplateButton();
            expect(await createTaskTemplate.isAddTaskTemplateTitleDisplayed('Create Task Template')).toBeTruthy('Add Task Template Title not displayed');
            expect(await createTaskTemplate.isTemplateMetadataTitleDisplayed('Template Metadata')).toBeTruthy('Template Metadata Title not displayed');
            expect(await createTaskTemplate.isTemplateNameRequiredText()).toBeTruthy("Template Name Required text Not Present");
            expect(await createTaskTemplate.isCreateNewProcessRequiredText()).toBeTruthy("CreateNewProcess Required text Not Present");
            expect(await createTaskTemplate.isNewProcessNameRequiredText()).toBeTruthy("NewProcessName Required text Not Present");
            expect(await createTaskTemplate.isTaskSummaryRequiredText()).toBeTruthy("Task Summary Required text Not Present");
            expect(await createTaskTemplate.isTaskPriorityRequiredText()).toBeTruthy("Task Priority Required text Not Present");
            expect(await createTaskTemplate.isTemplateStatusRequiredText()).toBeTruthy('Template Status Required text Not Present');
            expect(await createTaskTemplate.isOwnerComapnyRequiredText()).toBeTruthy('Owner Company Required text Not Present');
            expect(await createTaskTemplate.isOwnerGroupRequiredText()).toBeTruthy('Owner Group Required text Not Present');
            expect(await createTaskTemplate.isTaskDescriptionTitlePresent('Task Description')).toBeTruthy('Task Description not present');
            expect(await createTaskTemplate.isTaskCategoryTier1TitlePresent('Task Category Tier 1')).toBeTruthy('Task Category Tier 1 not present');
            expect(await createTaskTemplate.isTaskCategoryTier2TitlePresent('Task Category Tier 2')).toBeTruthy('Task Category Tier 2 not present');
            expect(await createTaskTemplate.isTaskCategoryTier3TitlePresent('Task Category Tier 3')).toBeTruthy('Task Category Tier 3 not present');
            expect(await createTaskTemplate.isTaskCategoryTier4TitlePresent('Task Category Tier 4')).toBeTruthy('Task Category Tier 4 not present');
        });
        it('[4820]: Create a template', async () => {
            await createTaskTemplate.setTemplateName(automatedTaskTemplate1);
            await createTaskTemplate.setTaskSummary(automatedTaskSummary1);
            await createTaskTemplate.setTaskDescription('Description in manual task');
            await createTaskTemplate.selectCompanyByName('Petramco');
            await createTaskTemplate.setExistingProcessName('A Failing Process');
            expect(await createTaskTemplate.isNewProcessNamePresent()).toBeFalsy("New Process Title Present");
            await createTaskTemplate.selectBuisnessUnit('United States Support');
            await createTaskTemplate.selectOwnerGroup('US Support 3');
            await createTaskTemplate.clickOnSaveTaskTemplate();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            await utilityCommon.closePopUpMessage();
            await viewTaskTemplate.clickBackArrowBtn();
        });
        it('[4820]: [Dynamic Data] [UI] - Automated Task Template UI on create and on Edit', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', BWF_PAGE_TITLES.TASK_MANAGEMENT.TEMPLATES);
            await selectTaskTemplate.searchAndOpenTaskTemplate(automatedTaskTemplate1);
            expect(await viewTaskTemplate.isEditProcessLinkDisplayed()).toBeTruthy(" Edit link in not displayed");
            expect(await viewTaskTemplate.isManageDynamicFieldLinkDisplayed()).toBeTruthy(" Manage link not present");
            await viewTaskTemplate.clickOnEditLink();
            expect(await viewTaskTemplate.isEditProcessLinkDisplayed()).toBeFalsy(" Edit link is displayed");
            expect(await editTaskTemplate.getTaskTypeValueAttribute('aria-disabled')).toBeTruthy(" Attribute value is disabled");
            expect(await editTaskTemplate.isManageProcessLinkDisplayed()).toBeTruthy(" Manage process link present");
            await editTaskTemplate.clickOnCancelButton();
            await viewTaskTemplate.clickBackArrowBtn();
        });
        it('[4820]: create same name record in same LOB', async () => {
            //create same name record in same LOB
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', BWF_PAGE_TITLES.TASK_MANAGEMENT.TEMPLATES);
            await utilityGrid.selectLineOfBusiness('Human Resource');
            await selectTaskTemplate.clickOnAutomationTaskTemplateButton();
            await createTaskTemplate.setTemplateName(automatedTaskTemplate1);
            await createTaskTemplate.setTaskSummary(automatedTaskSummary1);
            await createTaskTemplate.selectCompanyByName('Petramco');
            await createTaskTemplate.setNewProcessName('Process' + randomStr);
            await createTaskTemplate.clickOnSaveTaskTemplate();
            expect(await utilityCommon.isPopUpMessagePresent('The Template Name already exists. Please select a different name.')).toBeTruthy("Error message absent");
            await utilityCommon.closePopUpMessage();
            await createTaskTemplate.clickOnCancelTaskTemplate();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });
        it('[4820]: create same name record in different LOB', async () => {
            //create same name record in different LOB
            await utilityGrid.selectLineOfBusiness('Facilities');
            await selectTaskTemplate.clickOnManualTaskTemplateButton();
            await createTaskTemplate.setTemplateName(automatedTaskTemplate1);
            await createTaskTemplate.setTaskSummary(automatedTaskSummary1);
            await createTaskTemplate.setTaskDescription('Description in manual task');
            await createTaskTemplate.selectCompanyByName('Petramco');

            // verify categ1, BU and SG as per LOB
            expect(await utilityCommon.isAllDropDownValuesMatches(createTaskTemplate.selectors.taskCategoryDrpDown1, ['None', 'Facilities', 'Fixed Assets', 'Phones', 'Projectors', 'Purchasing Card','Talent Management'])).toBeTruthy("Category 1");
            await createTaskTemplate.selectOwnerCompany('Petramco');
            expect(await utilityCommon.isAllDropDownValuesMatches(createTaskTemplate.selectors.buisnessUnit, ['None','Facilities Support', 'India Support'])).toBeTruthy('SupportOrg');
            await createTaskTemplate.selectOwnerCompany('Petramco');
            await createTaskTemplate.selectBuisnessUnit('Facilities Support');
            expect(await utilityCommon.isAllDropDownValuesMatches(createTaskTemplate.selectors.ownerGroup, ['None','Facilities', 'Pantry Service'])).toBeTruthy('Owner Group');
            await createTaskTemplate.selectBuisnessUnit('Facilities Support');
            await createTaskTemplate.selectOwnerGroup('Facilities');
            // verify LOB is there
            expect(await createTaskTemplate.getLobValue()).toBe("Facilities");
            await changeAssignmentPo.setDropDownValue("AssignedGroup", 'Facilities');
            await createTaskTemplate.clickOnSaveTaskTemplate();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy("Success message absent");
            await utilityCommon.closePopUpMessage();
            // open the record and verify LOB is on edit screen
            await viewTaskTemplate.clickBackArrowBtn();
            await selectTaskTemplate.searchAndOpenTaskTemplate(automatedTaskTemplate1);
            expect(await viewTaskTemplate.getLobValue()).toBe("Facilities");
        });
        afterAll(async () => {
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await utilityGrid.selectLineOfBusiness('Human Resource');
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');           
        });
    });

    //ankagraw
    describe('[4819]: [Dynamic Data] [UI] - Automated Task UI on Edit view', async () => {
        let templateData, randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            templateData = {
                "templateName": randomStr + 'AutomatedTaskTemplateActive',
                "templateSummary": randomStr + 'AutomatedTaskTemplateSummaryActive',
                "templateStatus": "Draft",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": `Case Process 1 ${randomStr}`,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createAutomatedTaskTemplate(templateData);
        });
        it('[4819]: Add Dynamic on above task template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', BWF_PAGE_TITLES.TASK_MANAGEMENT.TEMPLATES);
            await selectTaskTemplate.searchAndOpenTaskTemplate(templateData.templateName);
            await viewTaskTemplate.clickOnManageDynamicFieldLink();
            await dynamicFieldsPage.clickOnDynamicField();
            await dynamicFieldsPage.setFieldName('Field Name');
            await dynamicFieldsPage.setDescriptionName('Field Description');
            await dynamicFieldsPage.clickSaveButton();
            await editTaskTemplate.clickOnEditMetadataLink();
            await editTaskTemplate.selectTemplateStatus("Active");
            await editTaskTemplate.clickOnSaveMetadata();
            await navigationPage.signOut();
        });
        it('[4819]: Create a case', async () => {
            await loginPage.login('qtao');
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary('Summary ' + randomStr);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePo.clickAddTaskButton();
        });
        it('[4819]: Add above task template and verify above dynamic field', async () => {
            await manageTaskBladePo.addTaskFromTaskTemplate(templateData.templateName)
            await manageTaskBladePo.clickTaskLink(templateData.templateSummary);
            expect(await viewTaskPo.isDynamicFieldPresent('Field Description')).toBeTruthy('Field Description');
            expect(await viewTaskPo.isAssignmentSectionDisplayed()).toBeFalsy('Assignment Section is present');
            await viewTaskPo.clickOnEditTask();
            expect(await editTaskPo.isFieldsDisplyed('Assignment Section')).toBeFalsy('Assignment Section is present');
            await editTaskPo.clickOnCancelButton();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        });
    });

    //ankagraw
    it('[3621,3620]: Verify hidden radio button should not present in dynamic field library', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Application Configuration--Dynamic Field Library', BWF_PAGE_TITLES.APPLICATION_CONFIGURATIONS.DYNAMIC_FILED_LIBRARY);
        await dynamicFieldLibraryConfigConsolePo.clickAddDynamicFieldButton();
        expect(await createDynamicFieldLibraryConfigPo.isHiddenFieldPresent("Hidden")).toBeFalsy();
        await createDynamicFieldLibraryConfigPo.clickCancelButton();
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Application Configuration--Dynamic Group Library', BWF_PAGE_TITLES.APPLICATION_CONFIGURATIONS.DYNAMIC_GROUP_LIBRARY);
        await dynamicGroupLibraryConfigConsolePo.clickAddDynamicGroupButton();
        await createDynamicGroupLibraryConfigPo.clickOnAddDynamicField();
        expect(await createDynamicGroupLibraryConfigPo.verifyTitle("Hidden")).toBeFalsy();
        await createDynamicGroupLibraryConfigPo.clickOnDynamicGroupCancelButton();
    });

    //ankagraw
    describe('[3605]: Verify the behaviour when add required dynamic field and hidden dynamic field', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateData, templateData;
        beforeAll(async () => {
            templateData = {
                "templateName": `manualTaskTemplate1 ${randomStr}`,
                "templateSummary": `manualTaskTemplateSummary1 ${randomStr}`,
                "templateStatus": "Active",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            caseTemplateData = {
                "templateName": randomStr + 'caseTemplateName',
                "templateSummary": 'CaseSummaryName' + randomStr,
                "caseStatus": "InProgress",
                "templateStatus": "Active",
                "assignee": "qkatawazi",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "ownerBU": "United States Support",
                "supportGroup": "US Support 3",
                "ownerGroup": "US Support 3"
            }

            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            await apiHelper.apiLogin('qkatawazi');
            let taskTemplate = await apiHelper.createManualTaskTemplate(templateData);
            await apiHelper.createDynamicDataOnTemplate(taskTemplate.id, 'RequiredHiddenDRDMV21451');
        });
        it('[3605]: Create a case and add task on it', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('fritz');
            await createCasePage.setSummary('Summary' + randomStr);
            await changeAssignmentPo.setAssignee("US Support 3", "Qadim Katawazi");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePo.getCaseID();
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.addTaskFromTaskTemplate(templateData.templateName);
            await manageTaskBladePo.clickTaskLink(templateData.templateSummary);
            await viewTaskPo.clickOnViewCase();
        });
        it('[3605]: Validate dynamic field and change the status', async () => {
            expect(await viewCasePo.isDynamicFieldDisplayed('Field1OutsideDRDMV21451')).toBeFalsy();
            await updateStatusBladePo.changeStatus("In Progress");
            await updateStatusBladePo.clickSaveStatus();
            await updateStatusBladePo.changeStatus("Resolved");
            await updateStatusBladePo.selectStatusReason('Auto Resolved');
            await updateStatusBladePo.clickSaveStatus();
            expect(await utilityCommon.isPopUpMessagePresent("Message not found, [bundleId = Ticketing-AppID, messageNum = 930] Required fields not entered Field1OutsideDRDMV21451", 1)).toBeTruthy();
            await updateStatusBladePo.clickCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });
        it('[3605]: Create a case and add task on it', async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            await apiHelper.apiLogin('qkatawazi');
            let CaseTemplate = await apiHelper.createCaseTemplate(caseTemplateData);
            await apiHelper.createDynamicDataOnTemplate(CaseTemplate.id, 'RequiredHiddenDRDMV21451');
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('Summary' + randomStr);
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateData.templateName);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
        });
        it('[3605]: Validate dynamic field and change the status', async () => {
            expect(await viewCasePo.isDynamicFieldDisplayed('Field1OutsideDRDMV21451')).toBeFalsy('Field1OutsideDRDMV21451 displayed');
            await updateStatusBladePo.changeStatus("Resolved");
            await updateStatusBladePo.selectStatusReason('Auto Resolved');
            await updateStatusBladePo.clickSaveStatus();
            expect(await utilityCommon.isPopUpMessagePresent("Message not found, [bundleId = Ticketing-AppID, messageNum = 930] Required fields not entered Field1OutsideDRDMV21451", 1)).toBeTruthy();
            await updateStatusBladePo.clickCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
        });
    });

    describe('[3604]: Verify the behaviour when add confidential dynamic field and hidden dynamic field', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateData, templateData;
        beforeAll(async () => {
            templateData = {
                "templateName": 'manualTaskTemplate1' + randomStr,
                "templateSummary": 'manualTaskTemplateSummary1' + randomStr,
                "templateStatus": "Active",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }

            caseTemplateData = {
                "templateName": randomStr + 'caseTemplateName',
                "templateSummary": 'CaseSummaryName' + randomStr,
                "caseStatus": "InProgress",
                "templateStatus": "Active",
                "assignee": "qkatawazi",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "ownerBU": "United States Support",
                "supportGroup": "US Support 3",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            await apiHelper.apiLogin('qkatawazi');
            let taskTemplate = await apiHelper.createManualTaskTemplate(templateData);
            await apiHelper.createDynamicDataOnTemplate(taskTemplate.id, 'ConfidentialsHiddenDRDMV21452');
        });
        it('[3604]: Create a case and add task on it', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('Summary' + randomStr);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePo.getCaseID();
            await viewCasePo.clickAddTaskButton();
            await browser.sleep(2000);
            await manageTaskBladePo.addTaskFromTaskTemplate(templateData.templateName);
            await manageTaskBladePo.clickTaskLink(templateData.templateSummary);
            await viewTaskPo.clickOnViewCase();
            expect(await viewCasePo.isDynamicFieldDisplayed('Field1OutsideDRDMV21452')).toBeFalsy();
        });
        it('[3604]: Create a case and add case template on it', async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            await apiHelper.apiLogin('qkatawazi');
            let CaseTemplate = await apiHelper.createCaseTemplate(caseTemplateData);
            await apiHelper.createDynamicDataOnTemplate(CaseTemplate.id, 'ConfidentialsHiddenDRDMV21452');
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('Summary' + randomStr);
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateData.templateName);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.isDynamicFieldDisplayed('Field1OutsideDRDMV21452')).toBeFalsy();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
        });
    });

    //ankagraw
    describe('[3607,3613]: create a case with task template having hidden fields, if the field is later updated to show field, then cases created earlier should not show up earlier the hidden fields.', async () => {
        let caseId, templateData, randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            templateData = {
                "templateName": `manualTaskTemplate ${randomStr}`,
                "templateSummary": `manualTaskTemplateSummary ${randomStr}`,
                "templateStatus": "Active",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            await apiHelper.apiLogin('qkatawazi');
            let newCaseTemplate = await apiHelper.createManualTaskTemplate(templateData);
            await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'hiddenField');
        });
        it('[3607,3613]: Create a case and add task on it', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('Summary' + randomStr);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            caseId = await viewCasePo.getCaseID();
            await viewCasePo.clickAddTaskButton();
            await browser.sleep(2000);
            await manageTaskBladePo.addTaskFromTaskTemplate(templateData.templateName);
            await manageTaskBladePo.clickTaskLink(templateData.templateSummary);
            await viewTaskPo.clickOnViewCase();
        });
        it('[3607,3613]: Validate dynamic field and change the it teask template status', async () => {
            expect(await viewCasePo.isDynamicFieldDisplayed('Field1OutsideDRDMV21415')).toBeFalsy();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', BWF_PAGE_TITLES.TASK_MANAGEMENT.TEMPLATES);
            await selectTaskTemplate.searchAndOpenTaskTemplate(templateData.templateName);
            await viewTaskTemplate.clickOnEditMetaData();
            await editTaskTemplate.selectTemplateStatus("Draft");
            await editTaskTemplate.clickOnSaveMetadata();
        });
        it('[3607,3613]: Disable the hidden field and change the status', async () => {
            await viewTaskTemplate.clickOnManageDynamicFieldLink();
            await dynamicFieldsPage.clickOnDownArrow();
            expect(await dynamicFieldsPage.isEnabledTextPresent("Hidden"));
            await dynamicFieldsPage.clickDisabledHiddenRadioButton();
            await dynamicFieldsPage.clickSaveButton();
            await viewTaskTemplate.clickOnEditMetaData();
            await editTaskTemplate.selectTemplateStatus("Active");
            await editTaskTemplate.clickOnSaveMetadata();
            await viewTaskTemplate.clickBackArrowBtn();
        });
        it('[3607,3613]: Validate dynamic field is visible', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            expect(await viewCasePo.getCaseID()).toBe(caseId);
            expect(await viewCasePo.isDynamicFieldDisplayed('Field1OutsideDRDMV21415')).toBeTruthy();
            await viewCasePo.clickEditCaseButton();
            await editCasePo.setDynamicFieldValue('Field1OutsideDRDMV21415', 'test 1');
            await editCasePo.clickSaveCase();
            expect(await viewCasePo.getValueOfDynamicFields('Field1OutsideDRDMV21415')).toBe('test 1');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
        });
    });

    //ankagraw
    describe('[3608,3612,3623]: Create a case with case template having hidden fields, if the field is later updated to show field, then cases created earlier should not show up earlier the hidden fields.', async () => {
        let caseId, caseTemplateData, randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            caseTemplateData = {
                "templateName": randomStr + 'caseTemplateName',
                "templateSummary": 'CaseSummaryName' + randomStr,
                "caseStatus": "InProgress",
                "templateStatus": "Active",
                "assignee": "qkatawazi",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            await apiHelper.apiLogin('qkatawazi');
            let newCaseTemplate = await apiHelper.createCaseTemplate(caseTemplateData);
            await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'hiddenField');
        });
        it('[3608,3612,3623]: Create a case and add case template on it', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('fritz');
            await createCasePage.setSummary('Summary' + randomStr);
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateData.templateName);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            caseId = await viewCasePo.getCaseID();
            expect(await viewCasePo.isDynamicFieldDisplayed('Field1OutsideDRDMV21415' + randomStr)).toBeFalsy("hidden");
        });
        it('[3608,3612,3623]: Change the status of case template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await utilityGrid.searchAndOpenHyperlink(caseTemplateData.templateName);
            await viewCasetemplatePo.clickEditTemplateMetaData();
            await editCasetemplatePo.changeTemplateStatusDropdownValue('Draft');
            await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
            await utilityCommon.closePopUpMessage();
            await viewCasetemplatePo.clickOnMangeDynamicFieldLink();
        });
        it('[3608,3612,3623]: Make dymanic field as visible', async () => {
            await dynamicFieldsPage.clickOnDownArrow();
            expect(await dynamicFieldsPage.isEnabledTextPresent("Hidden")).toBeTruthy();
            await dynamicFieldsPage.clickDisabledHiddenRadioButton();
            await dynamicFieldsPage.clickSaveButton();
            await viewCasetemplatePo.clickEditTemplateMetaData();
            await editCasetemplatePo.changeTemplateStatusDropdownValue('Active');
            await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
            await viewCasetemplatePo.clickBackArrowBtn();
        });
        it('[3608,3612,3623]: Verify dynamic field is visible on case', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            expect(await viewCasePo.getCaseID()).toBe(caseId);
            expect(await viewCasePo.isDynamicFieldDisplayed('Field1OutsideDRDMV21415')).toBeTruthy();
            await viewCasePo.clickEditCaseButton();
            await editCasePo.setDynamicFieldValue('Field1OutsideDRDMV21415', 'test 1');
            await editCasePo.clickSaveCase();
            expect(await viewCasePo.getValueOfDynamicFields('Field1OutsideDRDMV21415')).toBe('test 1');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
        });
    });

    //ankagraw
    describe('[3622,3611]: Verify hidden dynamic group field should not refect in case via task template', async () => {
        let caseId, templateData, randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            templateData = {
                "templateName": randomStr + 'manualTaskTemplate1',
                "templateSummary": randomStr + 'manualTaskTemplateSummary1',
                "templateStatus": "Active",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            await apiHelper.apiLogin('qkatawazi');
            let newCaseTemplate = await apiHelper.createManualTaskTemplate(templateData);
            await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'DynamicGroupContainsHiddenFieldDRDMV21416');
        });
        it('[3622,3611]: Create a case and add task on it', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('fritz');
            await createCasePage.setSummary('Summary' + randomStr);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePo.clickAddTaskButton();
            await browser.sleep(2000);
            await manageTaskBladePo.addTaskFromTaskTemplate(templateData.templateName);
            await manageTaskBladePo.clickTaskLink(templateData.templateSummary);
            await viewTaskPo.clickOnViewCase();
            caseId = await viewCasePo.getCaseID();
            expect(await viewCasePo.isDynamicFieldDisplayed('FieldGroup1')).toBeFalsy();
        });
        it('[3622,3611]: Change the status of the task', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', BWF_PAGE_TITLES.TASK_MANAGEMENT.TEMPLATES);
            await selectTaskTemplate.searchAndOpenTaskTemplate(templateData.templateName);
            await viewTaskTemplate.clickOnEditMetaData();
            await editTaskTemplate.selectTemplateStatus("Draft");
            await editTaskTemplate.clickOnSaveMetadata();
        });
        it('[3622,3611]: Make dynamic field as visible', async () => {
            await viewTaskTemplate.clickOnManageDynamicFieldLink();
            await dynamicFieldsPage.clickOnDownArrow();
            await dynamicFieldsPage.clickOnDownArrow();
            expect(await dynamicFieldsPage.isEnabledTextPresent("Hidden"));
            await dynamicFieldsPage.clickDisabledHiddenRadioButton();
            await dynamicFieldsPage.clickSaveButton();
            await viewTaskTemplate.clickOnEditMetaData();
            await editTaskTemplate.selectTemplateStatus("Active");
            await editTaskTemplate.clickOnSaveMetadata();
            await viewTaskTemplate.clickBackArrowBtn();
        });
        it('[3622,3611]: Validate dynamic field is visible', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            expect(await viewCasePo.getCaseID()).toBe(caseId);
            expect(await viewCasePo.isDynamicFieldDisplayed('FieldGroup1')).toBeTruthy();
            await viewCasePo.clickEditCaseButton();
            await editCasePo.setDynamicFieldValue('FieldGroup1', 'test 1');
            await editCasePo.clickOnAssignToMe();
            await editCasePo.clickSaveCase();
            expect(await viewCasePo.getValueOfDynamicFields('FieldGroup1')).toBe('test 1');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
        });
    });

    //ankagraw
    describe('[3610]: Verify hidden dynamic group field should not refect in case via case template', async () => {
        let caseTemplateData, caseId, randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            caseTemplateData = {
                "templateName": randomStr + 'caseTemplateName',
                "templateSummary": 'CaseSummaryName' + randomStr,
                "caseStatus": "InProgress",
                "templateStatus": "Active",
                "assignee": "qkatawazi",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            await apiHelper.apiLogin('qkatawazi');
            let newCaseTemplate = await apiHelper.createCaseTemplate(caseTemplateData);
            await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'DynamicGroupContainsHiddenFieldDRDMV21416');
        });
        it('[3610]: Create a case and add case template on it', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('fritz');
            await createCasePage.setSummary('Summary' + randomStr);
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateData.templateName);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            caseId = await viewCasePo.getCaseID();
            expect(await viewCasePo.isDynamicFieldDisplayed('FieldGroup1')).toBeFalsy();
        });
        it('[3610]: Change the status of case template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await utilityGrid.searchAndOpenHyperlink(caseTemplateData.templateName);
            await viewCasetemplatePo.clickEditTemplateMetaData();
            await editCasetemplatePo.changeTemplateStatusDropdownValue('Draft');
            await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
            await viewCasetemplatePo.clickOnMangeDynamicFieldLink();
        });
        it('[3610]: Update the dymanic field', async () => {
            await dynamicFieldsPage.clickOnDownArrow();
            await dynamicFieldsPage.clickOnDownArrow();
            expect(await dynamicFieldsPage.isEnabledTextPresent("Hidden"));
            await dynamicFieldsPage.clickDisabledHiddenRadioButton();
            await dynamicFieldsPage.clickSaveButton();
            await viewCasetemplatePo.clickEditTemplateMetaData();
            await editCasetemplatePo.changeTemplateStatusDropdownValue('Active');
            await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
            await viewCasetemplatePo.clickBackArrowBtn();
        });
        it('[3610]: Validate the dynamic field', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            expect(await viewCasePo.getCaseID()).toBe(caseId);
            expect(await viewCasePo.isDynamicFieldDisplayed('FieldGroup1')).toBeTruthy();
            await viewCasePo.clickEditCaseButton();
            await editCasePo.setDynamicFieldValue('FieldGroup1', 'test 1');
            await editCasePo.clickSaveCase();
            expect(await viewCasePo.getValueOfDynamicFields('FieldGroup1')).toBe('test 1');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
        });
    });

    //ankagraw
    describe('[3594]: Verify hidden dynamic field with multiple attributes in case via case template', async () => {
        let caseTemplateData, randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            caseTemplateData = {
                "templateName": randomStr + 'caseTemplateName',
                "templateSummary": 'CaseSummaryName' + randomStr,
                "caseStatus": "InProgress",
                "templateStatus": "Active",
                "assignee": "qkatawazi",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "ownerBU": "United States Support",
                "supportGroup": "US Support 3",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            await apiHelper.apiLogin('qkatawazi');
            let newCaseTemplate = await apiHelper.createCaseTemplate(caseTemplateData);
            await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'AllSourceAndTypeDRDMV21515');
        });
        it('[3594]: Create a case and add case template on it', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('fritz');
            await createCasePage.setSummary('Summary' + randomStr);
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateData.templateName);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
        });
        it('[3594]: Validate the fields', async () => {
            expect(await viewCasePo.isDynamicFieldDisplayed('Number Field')).toBeFalsy();
            expect(await viewCasePo.isDynamicFieldDisplayed('Date Field')).toBeFalsy();
            expect(await viewCasePo.isDynamicFieldDisplayed('Boolean Field')).toBeFalsy();
            expect(await viewCasePo.isDynamicFieldDisplayed('List Field')).toBeFalsy();
            expect(await viewCasePo.isDynamicFieldDisplayed('Attachment Field')).toBeFalsy();
            expect(await viewCasePo.isDynamicFieldDisplayed('Date and Time')).toBeFalsy();
            expect(await viewCasePo.isDynamicFieldDisplayed('Time')).toBeFalsy();
            expect(await viewCasePo.isDynamicFieldDisplayed('Number1 field')).toBeTruthy();
            expect(await viewCasePo.isDynamicFieldDisplayed('Date1 field')).toBeTruthy();
            expect(await viewCasePo.isDynamicFieldDisplayed('Boolean1 field')).toBeTruthy();
            expect(await viewCasePo.isDynamicFieldDisplayed('List1 Field')).toBeTruthy();
            expect(await viewCasePo.isDynamicFieldDisplayed('Attachment1 Field')).toBeTruthy();
            expect(await viewCasePo.isDynamicFieldDisplayed('Date1 and time1')).toBeTruthy();
            expect(await viewCasePo.isDynamicFieldDisplayed('time1')).toBeTruthy();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
        });
    });

    //ankagraw
    describe('[3609]: Hidden property of case get priority when Dynamic field with same name but one contains hidden property and another without hidden created a case through caseTemplate and task template', async () => {
        let templateData, caseTemplateData, randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            caseTemplateData = {
                "templateName": randomStr + 'caseTemplateName',
                "templateSummary": 'CaseSummaryName' + randomStr,
                "caseStatus": "InProgress",
                "templateStatus": "Active",
                "assignee": "qkatawazi",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "ownerBU": "United States Support",
                "supportGroup": "US Support 3",
                "ownerGroup": "US Support 3"
            }
            templateData = {
                "templateName": `manualTaskTemplate1 ${randomStr}`,
                "templateSummary": `manualTaskTemplateSummary1 ${randomStr}`,
                "templateStatus": "Active",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            await apiHelper.apiLogin('qkatawazi');
            let newCaseTemplate = await apiHelper.createCaseTemplate(caseTemplateData);
            let newtaskTemplate = await apiHelper.createManualTaskTemplate(templateData);
            await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'DuplicateOFhiddenFieldDRDMV21418');
            await apiHelper.createDynamicDataOnTemplate(newtaskTemplate.id, 'hiddenField');
        });
        it('[3609]: Create a case and add case template on it', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('fritz');
            await createCasePage.setSummary('Summary' + randomStr);
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateData.templateName);
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
        });
        it('[3609]: Validate dynamic field ', async () => {
            expect(await viewCasePo.isDynamicFieldDisplayed('Field1OutsideDRDMV21415')).toBeTruthy();
            let caseid = await viewCasePo.getCaseID();
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.addTaskFromTaskTemplate(`manualTaskTemplate1 ${randomStr}`);
            await manageTaskBladePo.clickCloseButton();
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseid);
            expect(await viewCasePo.isDynamicFieldDisplayed('Field1OutsideDRDMV21415')).toBeTruthy();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
        });
    });

    //ankagraw
    describe('[4033,4006,4849]: verify dynamic group fields on Copy case template', async () => {
        let caseTemplateData, randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            caseTemplateData = {
                "templateName": randomStr + 'caseTemplateName',
                "templateSummary": 'CaseSummaryName' + randomStr,
                "caseStatus": "InProgress",
                "templateStatus": "Active",
                "assignee": "qkatawazi",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "ownerBU": "United States Support",
                "supportGroup": "US Support 3",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            await apiHelper.apiLogin('qkatawazi');
            let newCaseTemplate = await apiHelper.createCaseTemplate(caseTemplateData);
            await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'DynamicGroupField');
        });
        it('[4033,4006,4849]: verify dynamic group fields on Copy case template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await consoleCasetemplatePo.searchAndselectCaseTemplate(randomStr + 'caseTemplateName');
            await consoleCasetemplatePo.clickOnCopyCaseTemplate();
            await copyCasetemplatePo.setTemplateName('copyCaseTemplateName' + randomStr);
            await copyCasetemplatePo.clickSaveCaseTemplate();
            await utilityCommon.closePopUpMessage();
            expect(await viewCasetemplatePo.isGroupDisplayed("GroupOne")).toBeTruthy();
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed("FieldGroup1")).toBeTruthy();
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed("externalNumber")).toBeTruthy();
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed("externalDate")).toBeTruthy();
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed("externalBoolean")).toBeTruthy();
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed("externalDateTime")).toBeTruthy();
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed("externalTime")).toBeTruthy();
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed("externalAttachment1")).toBeTruthy();
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed("dynamicList")).toBeTruthy();
        });
        it('[4033,4006,4849]: verify dynamic group fields on Copy case template', async () => {
            await viewCasetemplatePo.clickBackArrowBtn();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Document Management--Templates', BWF_PAGE_TITLES.DOCUMENT_MANAGEMENT.TEMPLATES);
            await createDocumentTemplatePo.clickOnAddTemplate();
            await createDocumentTemplatePo.setTemplateName("Document" + randomStr);
            await createDocumentTemplatePo.setCompany("Petramco");
            await createDocumentTemplatePo.clickOnInsertFieldOfDocumentBody();
            await browser.sleep(1000);
            await addFieldsPopPo.navigateToDynamicFieldInCaseTemplate(randomStr + 'caseTemplateName');
            expect(await addFieldsPopPo.isAssocitionDisplayed('GroupOne')).toBeTruthy("Group");
            await addFieldsPopPo.clickOnGroupName('GroupOne');
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('FieldGroup1')).toBeTruthy("Field");
            await addFieldsPopPo.selectDynamicField('FieldGroup1');
            await addFieldsPopPo.clickOnOkButtonOfEditor();
            await createDocumentTemplatePo.setDescription("Description");
            expect(await createDocumentTemplatePo.getDynamicFieldOnBody()).toContain('FieldGroup1');
            await createDocumentTemplatePo.clickOnSaveButton();
            await utilityGrid.searchAndOpenHyperlink('Document' + randomStr);
            expect(await editDocumentTemplatePo.getDynamicFieldOnBody()).toContain('FieldGroup1');
            await editDocumentTemplatePo.clickOnCancelButton();
        });
        it('[4033,4006,4849]: verify dynamic group fields on Copy case template', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('fritz');
            await createCasePage.setSummary('Summary');
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateData.templateName);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await utilityCommon.closePopUpMessage();
            expect(await activityTabPo.isTextPresentInActivityLog("FieldGroup1")).toBeFalsy();
        });
        it('[4033,4006,4849]: verify dynamic group fields on Copy case template', async () => {
            await viewCasePo.clickEditCaseButton();
            await editCasePo.setTimeInDynamicField('2:00 AM');
            await editCasePo.setDynamicFieldValue('FieldGroup1', 'TextField');
            await editCasePo.setDynamicFieldValue('externalNumber', '333');
            await editCasePo.setDateValueInDynamicField('2020-03-01');
            await editCasePo.clickOnTrueValueOfDynamicField();
            await editCasePo.selectValueFromList('dynamicList', 'listvalues');
            await editCasePo.addAttachment('externalAttachment1', ['../../data/ui/attachment/demo.txt']);
            await editCasePo.clickSaveCase();
            await activityTabPo.clickShowMoreLinkInActivity(1);
            expect(await activityTabPo.getAllTaskActivity("TextFieldlistvalues")).toBe('TextFieldlistvalues');
            expect(await activityTabPo.getAllTaskActivity("333")).toBe("333");
            expect(await activityTabPo.getAllTaskActivity("2:00 AM")).toBe("2:00 AM");
            expect(await activityTabPo.getAllTaskActivity("listvalues")).toBe("listvalues");
            expect(await activityTabPo.getAllTaskActivity("Yes")).toBe("Yes");
            expect(await activityTabPo.getAllTaskActivity("demo.txt(+)")).toBe("demo.txt(+)");
            await viewCasePo.clickEditCaseButton();
            await editCasePo.setDynamicFieldValue('FieldGroupOutside', 'TextField123');
            await editCasePo.setDynamicFieldValue('externalNumber', '5555555');
            await editCasePo.clickSaveCase();
            expect(await activityTabPo.isTextPresentInActivityLog("TextField123")).toBeTruthy();
            expect(await activityTabPo.isTextPresentInActivityLog("5555555")).toBeTruthy();
            expect(await activityTabPo.isTextPresentInActivityLog("FieldGroupOutside1")).toBeFalsy();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
        });
    });

    //ankagraw
    describe('[4032]: verify dynamic fields group on Copy Task template', async () => {
        let templateData, randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            templateData = {
                "templateName": randomStr + 'manualTaskTemplate1',
                "templateSummary": randomStr + 'manualTaskTemplateSummary1',
                "templateStatus": "Active",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            let newtaskTemplate = await apiHelper.createManualTaskTemplate(templateData);
            await apiHelper.createDynamicDataOnTemplate(newtaskTemplate.id, 'DynamicGroupField');
        });
        it('[4032]: verify dynamic fields group on Copy Task template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', BWF_PAGE_TITLES.TASK_MANAGEMENT.TEMPLATES);
            await selectTaskTemplate.searchAndOpenTaskTemplate(templateData.templateName);
            await viewTaskTemplate.clickOnCopyTemplate();
            await copyTasktemplatePo.setTemplateName("New One" + randomStr);
            await copyTasktemplatePo.clickSaveCopytemplate();
            expect(await viewTaskTemplate.isGroupDisplayed("GroupOne")).toBeTruthy();
            expect(await viewTaskTemplate.isDynamicFieldPresent("FieldGroup1")).toBeTruthy();
            expect(await viewTaskTemplate.isDynamicFieldPresent("externalNumber")).toBeTruthy();
            expect(await viewTaskTemplate.isDynamicFieldPresent("externalDate")).toBeTruthy();
            expect(await viewTaskTemplate.isDynamicFieldPresent("externalBoolean")).toBeTruthy();
            expect(await viewTaskTemplate.isDynamicFieldPresent("externalDateTime")).toBeTruthy();
            expect(await viewTaskTemplate.isDynamicFieldPresent("externalTime")).toBeTruthy();
            expect(await viewTaskTemplate.isDynamicFieldPresent("externalAttachment1")).toBeTruthy();
            expect(await viewTaskTemplate.isDynamicFieldPresent("dynamicList")).toBeTruthy();
        });
        afterAll(async () => {
            await viewTaskTemplate.clickBackArrowBtn();
        });
    });

    //ankagraw
    describe('[4852]: [Dynamic Data] - Change Case Template having dynamic fields and groups from Case', async () => {
        let casetemplateData, randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplate1 = randomStr + 'FirstCaseTemplateDRDMV13129';
        let caseTemplate2 = randomStr + 'SecondCaseTemplateDRDMV13129';
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();

            casetemplateData = {
                "templateName": caseTemplate1,
                "templateSummary": caseTemplate1 + ' summary',
                "templateStatus": "Active",
                "caseStatus": "InProgress",
                "assignee": "qkatawazi",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "ownerBU": "United States Support",
                "supportGroup": "US Support 3",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            let newCaseTemplate1 = await apiHelper.createCaseTemplate(casetemplateData);
            await apiHelper.createDynamicDataOnTemplate(newCaseTemplate1.id, 'DynamicGroupFieldDRDMV13129Data1');
            casetemplateData.templateName = caseTemplate2;
            casetemplateData.templateSummary = caseTemplate2 + ' summary';
            let newCaseTemplate2 = await apiHelper.createCaseTemplate(casetemplateData);
            await apiHelper.createDynamicDataOnTemplate(newCaseTemplate2.id, 'DynamicGroupFieldDRDMV13129Data2');
        });
        it('[4852]: [Dynamic Data] - Change Case Template having dynamic fields and groups from Case', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary("test the 4852");
            await changeAssignmentPo.setAssignee("US Support 3", "Qadim Katawazi");
            await createCasePage.clickSaveCaseButton();
            await utilityCommon.closePopUpMessage();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.isDynamicFieldDisplayed('FieldGroup1')).toBeFalsy();
            await viewCasePo.clickEditCaseButton();
            await browser.sleep(1000);
            await editCasePo.clickOnSelectCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplate1);
            await changeAssignmentPo.setAssignee("US Support 3", "Qadim Katawazi");
            await editCasePo.clickSaveCase();
            expect(await viewCasePo.isDynamicFieldDisplayed('FieldGroup1')).toBeTruthy();
            expect(await viewCasePo.isDynamicFieldDisplayed('externalNumber')).toBeTruthy();
            expect(await viewCasePo.isDynamicFieldDisplayed('externalDate')).toBeTruthy();
            expect(await viewCasePo.isDynamicFieldDisplayed('externalBoolean')).toBeTruthy();
            expect(await viewCasePo.isDynamicFieldDisplayed('externalDateTime')).toBeTruthy();
            expect(await viewCasePo.isDynamicFieldDisplayed('FieldGroupOutside')).toBeTruthy();
            await viewCasePo.clickEditCaseButton();
            await editCasePo.setDynamicFieldValue('FieldGroup1', 'test');
            await editCasePo.clickSaveCase();
        });
        it('[4852]: [Dynamic Data] - Change Case Template having dynamic fields and groups from Case', async () => {
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnChangeCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplate2);
            await changeAssignmentPo.setAssignee("US Support 3", "Qadim Katawazi");
            await editCasePo.clickSaveCase();
            expect(await viewCasePo.isDynamicFieldDisplayed('FieldGroup1')).toBeTruthy();
            expect(await viewCasePo.isDynamicFieldDisplayed('externalDate')).toBeTruthy();
            expect(await viewCasePo.isDynamicFieldDisplayed('externalBoolean')).toBeTruthy();
            expect(await viewCasePo.isDynamicFieldDisplayed('externalDateTime')).toBeTruthy();
            expect(await viewCasePo.isDynamicFieldDisplayed('externalTime')).toBeTruthy();
            expect(await viewCasePo.isDynamicFieldDisplayed('dynamicList')).toBeTruthy();
            expect(await viewCasePo.isDynamicFieldDisplayed('externalAttachment1')).toBeTruthy();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
        });
    });

    //ankagraw
    describe('[4065]: [Dynamic Data] [UI] - Update Dynamic Fields UI from Case Template', async () => {
        let casetemplateData, randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            casetemplateData = {
                "templateName": randomStr + 'caseTemplateDRDMV17916',
                "templateSummary": randomStr + 'caseTemplateSummaryDRDMV17916',
                "caseStatus": "InProgress",
                "templateStatus": "Draft",
                "assignee": "qkatawazi",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "ownerBU": "United States Support",
                "supportGroup": "US Support 3",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            let newCaseTemplate = await apiHelper.createCaseTemplate(casetemplateData);
            await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'CASE_TEMPLATE_WITH_REQUESTER');
        });
        it('[4065]: [Dynamic Data] [UI] - Update Dynamic Fields UI from Case Template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await utilityGrid.searchAndOpenHyperlink(casetemplateData.templateName);
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed('FieldGroup1')).toBeTruthy();
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed('Field2Group1')).toBeTruthy();
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed('Field2Group2')).toBeTruthy();
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed('FieldGroup2')).toBeTruthy();
            await viewCasetemplatePo.clickOnMangeDynamicFieldLink();
            expect(await dynamicFieldsPage.isDynamicFieldDisplayed()).toBeTruthy();
            expect(await dynamicFieldsPage.isAddDynamicGroupDisplayed()).toBeTruthy();
        });
        it('[4065]: [Dynamic Data] [UI] - Update Dynamic Fields UI from Case Template', async () => {
            await dynamicFieldsPage.clickOnAddDynamicGroup();
            expect(await dynamicFieldsPage.isGroupNameDisplayed()).toBeTruthy();
            expect(await dynamicFieldsPage.isGroupDescriptionDisplay()).toBeTruthy();
            expect(await dynamicFieldsPage.isEnabledPublishInLibraryButtonDisplayed()).toBeTruthy();
            await dynamicFieldsPage.clickCancelButton();
            await dynamicFieldsPage.clickOnDeleteField();
            await dynamicFieldsPage.clickSaveButton();
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed('FieldGroup1')).toBeFalsy();
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed('Field2Group1')).toBeFalsy();
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed('Field2Group2')).toBeTruthy();
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed('FieldGroup2')).toBeTruthy();
            await viewCasetemplatePo.clickBackArrowBtn();
        });
    });

    //ankagraw
    describe('[4843]: [Dynamic Data]- Add Dynamic Fields and Groups to Task Template', async () => {
        let templateData, randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let manualTemplate1 = randomStr + 'manualTaskTemplateDraft';
        let manualTemplate2 = randomStr + 'manualTaskTemplateActive';
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            templateData = {
                "templateName": manualTemplate1,
                "templateSummary": randomStr + 'manualTaskTemplateSummary1',
                "templateStatus": "Draft",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            let newTaskTemplate = await apiHelper.createManualTaskTemplate(templateData);
            await apiHelper.createDynamicDataOnTemplate(newTaskTemplate.id, 'CASE_TEMPLATE_WITH_REQUESTER');
            templateData.templateName = manualTemplate2;
            templateData.templateStatus = "Active";
            await apiHelper.createManualTaskTemplate(templateData);
        });
        it('[4843]: [Dynamic Data]- Add Dynamic Fields and Groups to Task Template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', BWF_PAGE_TITLES.TASK_MANAGEMENT.TEMPLATES);
            await selectTaskTemplate.searchAndOpenTaskTemplate(manualTemplate2);
            expect(await viewTaskTemplate.isManageDynamicFieldLinkDisplayed()).toBeFalsy();
            await viewTaskTemplate.clickBackArrowBtn();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', BWF_PAGE_TITLES.TASK_MANAGEMENT.TEMPLATES);
            await selectTaskTemplate.searchAndOpenTaskTemplate(manualTemplate1);
            expect(await viewTaskTemplate.isDynamicFieldPresent('FieldGroup1')).toBeTruthy();
            expect(await viewTaskTemplate.isDynamicFieldPresent('Field2Group1')).toBeTruthy();
            expect(await viewTaskTemplate.isDynamicFieldPresent('Field2Group2')).toBeTruthy();
            expect(await viewTaskTemplate.isDynamicFieldPresent('FieldGroup2')).toBeTruthy();
            await viewTaskTemplate.clickOnManageDynamicFieldLink();
            expect(await dynamicFieldsPage.isDynamicFieldDisplayed()).toBeTruthy();
            expect(await dynamicFieldsPage.isAddDynamicGroupDisplayed()).toBeTruthy();
        });
        it('[4843]: [Dynamic Data]- Add Dynamic Fields and Groups to Task Template', async () => {
            await dynamicFieldsPage.clickOnAddDynamicGroup();
            expect(await dynamicFieldsPage.isGroupNameDisplayed()).toBeTruthy();
            expect(await dynamicFieldsPage.isGroupDescriptionDisplay()).toBeTruthy();
            expect(await dynamicFieldsPage.isEnabledPublishInLibraryButtonDisplayed()).toBeTruthy();
            await dynamicFieldsPage.clickCancelButton();
            await dynamicFieldsPage.clickOnDeleteField();
            await dynamicFieldsPage.clickSaveButton();
            expect(await viewTaskTemplate.isDynamicFieldPresent('FieldGroup1')).toBeFalsy();
            expect(await viewTaskTemplate.isDynamicFieldPresent('Field2Group1')).toBeFalsy();
            expect(await viewTaskTemplate.isDynamicFieldPresent('Field2Group2')).toBeTruthy();
            expect(await viewTaskTemplate.isDynamicFieldPresent('FieldGroup2')).toBeTruthy();
            await viewTaskTemplate.clickBackArrowBtn();
        });
    });

    //ankagraw
    xdescribe('[3486]: [PDF Config] - Date Time common config are available OOB and BA can add remove config', async () => {
        it('[3486]: [PDF Config] - Date Time common config are available OOB and BA can add remove config', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Common Configurations', BWF_PAGE_TITLES.APPLICATION_CONFIGURATIONS.COMMON_CONFIGURATION);
            await applicationConfigPo.clickApplicationConfiguration('DATE_TIME_FORMAT');
            expect(await applicationConfigPo.getconfigurationHeaderValue()).toContain('DATE_TIME_FORMAT');
            await applicationConfigPo.clickConfigurationDropDownArrow();
            expect(await applicationConfigPo.getColoumnValue()).toContain('dd MMM yyyy hh:mm:ss a');
            await applicationConfigPo.clickAddConfigurationValue();
            await applicationConfigPo.setConfigurationValueText("yyyy-mm-dd hh:mm:ss.s");
            await applicationConfigPo.selectCompany('Petramco');
            await applicationConfigPo.clickSaveButton();
        });
        it('[3486]: [PDF Config] - Date Time common config are available OOB and BA can add remove config', async () => {
            expect(await applicationConfigPo.getColoumnValue()).toContain('yyyy-mm-dd hh:mm:ss.s');
            await applicationConfigPo.clickAddConfigurationValue();
            await applicationConfigPo.setConfigurationValueText("yyyy-mm-dd hh:mm");
            await applicationConfigPo.selectCompany('- Global -');
            await applicationConfigPo.clickSaveButton();
            expect(await applicationConfigPo.getColoumnValue()).toContain('yyyy-mm-dd hh:mm');
        });

        it('[3486]: [PDF Config] - Date Time common config are available OOB and BA can add remove config', async () => {
            await applicationConfigPo.clickApplicationConfiguration('DATE_FORMAT');
            expect(await applicationConfigPo.getconfigurationHeaderValue()).toContain('DATE_FORMAT');
            await applicationConfigPo.clickConfigurationDropDownArrow();
            expect(await applicationConfigPo.getColoumnValue()).toContain('dd MMM yyyy');
            await applicationConfigPo.clickAddConfigurationValue();
            await applicationConfigPo.setConfigurationValueText("yyyy/mm/dd");
            await applicationConfigPo.selectCompany('Petramco');
            await applicationConfigPo.clickSaveButton();
        });
        it('[3486]: [PDF Config] - Date Time common config are available OOB and BA can add remove config', async () => {
            expect(await applicationConfigPo.getColoumnValue()).toContain('yyyy/mm/dd');
            await applicationConfigPo.clickAddConfigurationValue();
            await applicationConfigPo.setConfigurationValueText("yy/mm/dd");
            await applicationConfigPo.selectCompany('- Global -');
            await applicationConfigPo.clickSaveButton();
            expect(await applicationConfigPo.getColoumnValue()).toContain('yy/mm/dd');
        });

        it('[3486]: [PDF Config] - Date Time common config are available OOB and BA can add remove config', async () => {
            await applicationConfigPo.clickApplicationConfiguration('ZONE_ID');
            expect(await applicationConfigPo.getconfigurationHeaderValue()).toContain('ZONE_ID');
            await applicationConfigPo.clickConfigurationDropDownArrow();
            expect(await applicationConfigPo.getColoumnValue()).toContain('UTC');
            await applicationConfigPo.clickAddConfigurationValue();
            await applicationConfigPo.setConfigurationValueText("IST");
            await applicationConfigPo.selectCompany('Petramco');
            await applicationConfigPo.clickSaveButton();
        });
        it('[3486]: [PDF Config] - Date Time common config are available OOB and BA can add remove config', async () => {
            expect(await applicationConfigPo.getColoumnValue()).toContain('IST');
            await applicationConfigPo.clickAddConfigurationValue();
            await applicationConfigPo.setConfigurationValueText("GMT");
            await applicationConfigPo.selectCompany('- Global -');
            await applicationConfigPo.clickSaveButton();
            expect(await applicationConfigPo.getColoumnValue()).toContain('GMT');
        });

        it('[3486]: Verify PDF Configs - Date Time Format are accessible to other Line of business Case BA', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Common Configurations', BWF_PAGE_TITLES.APPLICATION_CONFIGURATIONS.COMMON_CONFIGURATION);
            await applicationConfigPo.clickApplicationConfiguration('DATE_TIME_FORMAT');
            expect(await applicationConfigPo.getconfigurationHeaderValue()).toContain('DATE_TIME_FORMAT');
            expect(await applicationConfigPo.isConfigValuesDisplayed('dd MMM yyyy hh:mm:ss a')).toBeTruthy();
            expect(await applicationConfigPo.isConfigValuesDisplayed('yyyy-mm-dd hh:mm:ss.s')).toBeTruthy();
            expect(await applicationConfigPo.isConfigValuesDisplayed('yyyy-mm-dd hh:mm')).toBeTruthy();

            await applicationConfigPo.clickApplicationConfiguration('DATE_FORMAT');
            expect(await applicationConfigPo.getconfigurationHeaderValue()).toContain('DATE_FORMAT');
            expect(await applicationConfigPo.isConfigValuesDisplayed('dd MMM yyyy')).toBeTruthy();
            expect(await applicationConfigPo.isConfigValuesDisplayed('yyyy/mm/dd')).toBeTruthy();
            expect(await applicationConfigPo.isConfigValuesDisplayed('yy/mm/dd')).toBeTruthy();

            await applicationConfigPo.clickApplicationConfiguration('ZONE_ID');
            expect(await applicationConfigPo.getconfigurationHeaderValue()).toContain('ZONE_ID');
            expect(await applicationConfigPo.isConfigValuesDisplayed('UTC')).toBeTruthy();
            expect(await applicationConfigPo.isConfigValuesDisplayed('IST')).toBeTruthy();
            expect(await applicationConfigPo.isConfigValuesDisplayed('GMT')).toBeTruthy();
        });
        it('[3486]:  Verify PDF Configs - Date Time Format are accessible to multiple (HR,Finance) LOBs', async () => {
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Common Configurations', BWF_PAGE_TITLES.APPLICATION_CONFIGURATIONS.COMMON_CONFIGURATION);
            await applicationConfigPo.clickApplicationConfiguration('DATE_TIME_FORMAT');
            expect(await applicationConfigPo.getconfigurationHeaderValue()).toContain('DATE_TIME_FORMAT');
            expect(await applicationConfigPo.isConfigValuesDisplayed('dd MMM yyyy hh:mm:ss a')).toBeTruthy();
            expect(await applicationConfigPo.isConfigValuesDisplayed('yyyy-mm-dd hh:mm:ss.s')).toBeTruthy();
            expect(await applicationConfigPo.isConfigValuesDisplayed('yyyy-mm-dd hh:mm')).toBeTruthy();
            await applicationConfigPo.clickRemoveButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            await applicationConfigPo.clickRemoveButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');

            await applicationConfigPo.clickApplicationConfiguration('DATE_FORMAT');
            expect(await applicationConfigPo.getconfigurationHeaderValue()).toContain('DATE_FORMAT');
            expect(await applicationConfigPo.isConfigValuesDisplayed('dd MMM yyyy')).toBeTruthy();
            expect(await applicationConfigPo.isConfigValuesDisplayed('yyyy/mm/dd')).toBeTruthy();
            expect(await applicationConfigPo.isConfigValuesDisplayed('yy/mm/dd')).toBeTruthy();
            await applicationConfigPo.clickRemoveButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            await applicationConfigPo.clickRemoveButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');

            await applicationConfigPo.clickApplicationConfiguration('ZONE_ID');
            expect(await applicationConfigPo.getconfigurationHeaderValue()).toContain('ZONE_ID');
            expect(await applicationConfigPo.isConfigValuesDisplayed('UTC')).toBeTruthy();
            expect(await applicationConfigPo.isConfigValuesDisplayed('IST')).toBeTruthy();
            expect(await applicationConfigPo.isConfigValuesDisplayed('GMT')).toBeTruthy();
            await applicationConfigPo.clickRemoveButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            await applicationConfigPo.clickRemoveButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
        });
    
    });

    //ptidke
    describe('[4846]: [-ve] [Dynamic Data] - Case with large no. of Dynamic fields', async () => {
        let casetemplateData, randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();

            casetemplateData = {
                "templateName": randomStr + 'caseTemplateDRDMV13136',
                "templateSummary": randomStr + 'caseTemplateSummaryDRDMV13136',
                "templateStatus": "Active",
                "caseStatus": "InProgress",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            let newCaseTemplate = await apiHelper.createCaseTemplate(casetemplateData);
            await browser.sleep(2000); // hardwait to reflect case template
            await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'CASE_TEMPLATE_EACH_15_FIELD');
        });
        it('[4846]: Create a case and add cae template on it', async () => {
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('qkatawazi');
            await quickCasePo.selectCaseTemplate(casetemplateData.templateName);
            await quickCasePo.createCaseButton();
            await casePreviewPo.clickGoToCaseButton();
        });
        it('[4846]: Validate the dymaic field with values', async () => {
            //verify fields shoule be empty values on case view
            let arr: string[] = ['text1', 'text2', 'text3', 'text3', 'text4', 'text5', 'text6', 'text7', 'text8', 'text9', 'text10', 'text11', 'text12', 'text13', 'text14', 'text15', 'attachment1', 'attachment2', 'attachment3', 'attachment4', 'attachment5', 'attachment6', 'attachment7', 'attachment8', 'attachment9', 'attachment10'];
            for (let i = 0; i < arr.length; i++) {
                expect(await viewCasePo.isDynamicFieldDisplayed(arr[i])).toBeTruthy('field not present');
            }
        });
        it('[4846]: Validate the dymaic field with values', async () => {
            //verify fields shoule be empty values on case view
            let arr: string[] = ['boolean1', 'boolean2', 'boolean3', 'boolean4', 'boolean4', 'boolean5', 'boolean6', 'boolean7', 'boolean8', 'boolean9', 'boolean10', 'boolean12', 'boolean12', 'boolean13', 'boolean14', 'boolean15', 'time1', 'time2', 'time3', 'time4', 'time5', 'time6', 'time7', 'time8', 'time9', 'time10'];
            for (let i = 0; i < arr.length; i++) {
                expect(await viewCasePo.isDynamicFieldDisplayed(arr[i])).toBeTruthy(arr[i] + 'field not present');
            }

        });
        it('[4846]: Validate the dymaic field with values', async () => {
            await viewCasePo.clickEditCaseButton();
            await editCasePo.setDynamicFieldValue('text1', 'newtemp1');
            await editCasePo.setDynamicFieldValue('number1', '33');
            await editCasePo.setDynamicFieldValue('text2', 'newtemp2');
            await editCasePo.setDynamicFieldValue('number2', '3330');
            await editCasePo.setDynamicFieldValue('text3', 'newtemp3');
            await editCasePo.setDynamicFieldValue('number3', '3331');
            await editCasePo.setDynamicFieldValue('text4', 'newtemp4');
            await editCasePo.setDynamicFieldValue('number4', '3332');
            await editCasePo.setDynamicFieldValue('text5', 'newtemp5');
            await editCasePo.setDynamicFieldValue('number5', '3334');
            await editCasePo.clickSaveCase();
        });
        it('[4846]: Validate the dymaic field with values', async () => {
            //verify fields shoule be empty values on case view
            let arr: string[] = ['date1', 'date2', 'date3', 'date4', 'date5', 'date6', 'date7', 'date8', 'date9', 'date10', 'date11', 'date12', 'date13', 'date14', 'date15', 'datetime1', 'datetime2', 'datetime3', 'datetime4', 'datetime5', 'datetime6', 'datetime7', 'datetime8', 'datetime9', 'datetime10', 'datetime11', 'datetime12', 'datetime13', 'datetime14', 'datetime15'];
            for (let i = 0; i < arr.length; i++) {
                expect(await viewCasePo.isDynamicFieldDisplayed(arr[i])).toBeTruthy(arr[i] + 'field not present');
            }
        });
        it('[4846]: Validate the dymaic field with values', async () => {
            //verify fields shoule be empty values on case view
            let arr: string[] = ['number1', 'number2', 'number3', 'number4', 'number5', 'number6', 'number7', 'number8', 'number9', 'number10', 'number11', 'number12', 'number13', 'number14', 'number15'];
            for (let i = 0; i < arr.length; i++) {
                expect(await viewCasePo.isDynamicFieldDisplayed(arr[i])).toBeTruthy(arr[i] + 'field not present');
            }
        });
        it('[4846]: Validate the dymaic field with values', async () => {
            //verify field fill data on case profile.
            expect(await viewCasePo.getValueOfDynamicFields('text1')).toBe('newtemp1');
            expect(await viewCasePo.getValueOfDynamicFields('text2')).toBe('newtemp2');
            expect(await viewCasePo.getValueOfDynamicFields('text3')).toBe('newtemp3');
            expect(await viewCasePo.getValueOfDynamicFields('text4')).toBe('newtemp4');
            expect(await viewCasePo.getValueOfDynamicFields('text5')).toBe('newtemp5');
            expect(await viewCasePo.getValueOfDynamicFields('number1')).toBe('33');
            expect(await viewCasePo.getValueOfDynamicFields('number2')).toBe('3330');
            expect(await viewCasePo.getValueOfDynamicFields('number3')).toBe('3331');
            expect(await viewCasePo.getValueOfDynamicFields('number4')).toBe('3332');
            expect(await viewCasePo.getValueOfDynamicFields('number5')).toBe('3334');
        });
    });
});