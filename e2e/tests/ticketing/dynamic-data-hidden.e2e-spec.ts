import caseConsolePo from '../../pageobject/case/case-console.po';
import updateStatusBladePo from '../../pageobject/common/update.status.blade.po';
import createDynamicGroupLibraryConfigPo from '../../pageobject/settings/application-config/create-dynamic-group-library-config.po';
import dynamicGroupLibraryConfigConsolePo from '../../pageobject/settings/application-config/dynamic-group-library-config-console.po';
import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import { default as previewCasePo } from '../../pageobject/case/case-preview.po';
import { default as createCasePage } from '../../pageobject/case/create-case.po';
import editCasePo from '../../pageobject/case/edit-case.po';
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import viewCasePo, { default as viewCasePage } from "../../pageobject/case/view-case.po";
import { default as dynamicFieldsPage } from '../../pageobject/common/dynamic-fields.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import createDynamicFieldLibraryConfigPo from '../../pageobject/settings/application-config/create-dynamic-field-library-config.po';
import dynamicFieldLibraryConfigConsolePo from '../../pageobject/settings/application-config/dynamic-field-library-config-console.po';
import editCasetemplatePo from '../../pageobject/settings/case-management/edit-casetemplate.po';
import viewCasetemplatePo from '../../pageobject/settings/case-management/view-casetemplate.po';
import selectTaskTemplate from "../../pageobject/settings/task-management/console-tasktemplate.po";
import createTaskTemplate from "../../pageobject/settings/task-management/create-tasktemplate.po";
import editTaskTemplate from "../../pageobject/settings/task-management/edit-tasktemplate.po";
import viewTaskTemplate from "../../pageobject/settings/task-management/view-tasktemplate.po";
import editTaskPo from '../../pageobject/task/edit-task.po';
import { default as manageTask } from "../../pageobject/task/manage-task-blade.po";
import viewTaskPo from '../../pageobject/task/view-task.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilGrid from '../../utils/util.grid';
import utilityCommon from '../../utils/utility.common';
import quickCasePo from '../../pageobject/case/quick-case.po';



describe('Case Data Store', () => {
    const randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    afterEach(async () => {
        await utilityCommon.refresh();
    });

    //ankagraw
    it('[DRDMV-13168]: [Dynamic Data] [UI] - Automated Task Template UI on create and on Edit', async () => {
        try {
            //Automation Task template
            await navigationPage.gotoCaseConsole();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.clickOnAutomationTaskTemplateButton();
            await expect(createTaskTemplate.isAddTaskTemplateTitleDisplayed('Add Task Template')).toBeTruthy('Add Task Template Title not displayed');
            await expect(createTaskTemplate.isTemplateMetadataTitleDisplayed('Template Metadata')).toBeTruthy('Template Metadata Title not displayed');
            await expect(createTaskTemplate.isTemplateNameRequiredText()).toBeTruthy("Template Name Required text Not Present");
            await expect(createTaskTemplate.isCreateNewProcessRequiredText()).toBeTruthy("CreateNewProcess Required text Not Present");
            await expect(createTaskTemplate.isNewProcessNameRequiredText()).toBeTruthy("NewProcessName Required text Not Present");
            await expect(createTaskTemplate.isProcessBundleIdRequiredText()).toBeTruthy("ProcessBundleId Required text Not Present");
            await expect(createTaskTemplate.isTaskSummaryRequiredText()).toBeTruthy("Task Summary Required text Not Present");
            await expect(createTaskTemplate.isTaskPriorityRequiredText()).toBeTruthy("Task Priority Required text Not Present");
            await expect(createTaskTemplate.isTemplateStatusRequiredText()).toBeTruthy('Template Status Required text Not Present');
            await expect(createTaskTemplate.isOwnerComapnyRequiredText()).toBeTruthy('Owner Company Required text Not Present');
            await expect(createTaskTemplate.isOwnerGroupRequiredText()).toBeTruthy('Owner Group Required text Not Present');
            await expect(createTaskTemplate.isTaskDescriptionTitlePresent('Task Description')).toBeTruthy('Task Description not present');
            await expect(createTaskTemplate.isTaskCategoryTier1TitlePresent('Task Category Tier 1')).toBeTruthy('Task Category Tier 1 not present');
            await expect(createTaskTemplate.isTaskCategoryTier2TitlePresent('Task Category Tier 2')).toBeTruthy('Task Category Tier 2 not present');
            await expect(createTaskTemplate.isTaskCategoryTier3TitlePresent('Task Category Tier 3')).toBeTruthy('Task Category Tier 3 not present');
            await expect(createTaskTemplate.isTaskCategoryTier4TitlePresent('Task Category Tier 4')).toBeTruthy('Task Category Tier 4 not present');
            await createTaskTemplate.setcreateNewProcess(false);
            await expect(createTaskTemplate.isProcessTitlePresent("New Process Name")).toBeFalsy("New Process Title Present");
            const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let automatedTaskTemplate1 = 'Automation Task1 ' + randomStr;
            let automatedTaskSummary1 = 'Automation Summary1 ' + randomStr;
            let processName = 'Process Name ' + randomStr;
            await createTaskTemplate.setTemplateName(automatedTaskTemplate1);
            await createTaskTemplate.setTaskSummary(automatedTaskSummary1);
            await createTaskTemplate.setTaskDescription('Description in manual task');
            await createTaskTemplate.selectCompanyByName('Petramco');
            await createTaskTemplate.setNewProcessName('Business Workflows', processName);
            // await createTaskTemplate.selectTemplateStatus('Active');
            await createTaskTemplate.clickOnSaveTaskTemplate();
            await utilCommon.waitUntilPopUpDisappear();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.searchAndOpenTaskTemplate(automatedTaskTemplate1);
            await expect(viewTaskTemplate.isEditProcessLinkDisplayed()).toBeTruthy(" Edit link in not displayed");
            await expect(viewTaskTemplate.isManageDynamicFieldLinkDisplayed()).toBeTruthy(" Manage link not present");
            await viewTaskTemplate.clickOnEditLink();
            await expect(viewTaskTemplate.isEditProcessLinkDisplayed()).toBeFalsy(" Edit link is displayed");
            await expect(editTaskTemplate.getTaskTypeValueAttribute('disabled')).toBeTruthy(" Attribute value is disabled");
            await expect(editTaskTemplate.isManageProcessLinkDisplayed()).toBeTruthy(" Manage process link present");
        } catch (error) {
            throw error;
        } finally {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        }
    });//, 230 * 1000);

    //ankagraw
    it('[DRDMV-13169]: [Dynamic Data] [UI] - Automated Task UI on Edit view', async () => {
        try {
            let manualTaskSummary = 'Summary' + Math.floor(Math.random() * 1000000);
            let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let templateData4 = {
                "templateName": `AutomatedTaskTemplateActive ${randomStr}`,
                "templateSummary": `AutomatedTaskTemplateActive ${randomStr}`,
                "templateStatus": "Draft",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": `Case Process 1 ${randomStr}`,
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createAutomatedTaskTemplate(templateData4);
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.searchAndOpenTaskTemplate(`AutomatedTaskTemplateActive ${randomStr}`);
            await viewTaskTemplate.clickOnManageDynamicFieldLink();
            await dynamicFieldsPage.clickOnDynamicField();
            await dynamicFieldsPage.setFieldName('Field Name');
            await dynamicFieldsPage.setDescriptionName('Field Description');
            await dynamicFieldsPage.clickSaveButton();
            await editTaskTemplate.clickOnEditMetadataLink();
            await editTaskTemplate.selectTemplateStatus("Active");
            await editTaskTemplate.clickOnSaveMetadata();
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary('Summary ' + manualTaskSummary);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePage.clickAddTaskButton();
            await manageTask.addTaskFromTaskTemplate(`AutomatedTaskTemplateActive ${randomStr}`)
            await manageTask.clickTaskLinkOnManageTask(`AutomatedTaskTemplateActive ${randomStr}`);
            await expect(viewTaskPo.isDynamicFieldPresent('Field Description')).toBeTruthy('Field Description');
            await expect(viewTaskPo.isAssignmentSectionDisplayed()).toBeFalsy('Assignment Section is present');
            await viewTaskPo.clickOnEditTask();
            await expect(editTaskPo.isAssignmentSectionDisplayed()).toBeFalsy('Assignment Section is present');
            await editTaskPo.clickOnCancelButton();
        } catch (error) {
            throw error;
        } finally {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        }
    }, 350 * 1000);

    //ankagraw
    it('[DRDMV-21405,DRDMV-21406]: Verify hidden radio button should not present in dynamic field library', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Application Configuration--Dynamic Field Library', 'Field Management Console - Business Workflows');
        await dynamicFieldLibraryConfigConsolePo.clickAddDynamicFieldButton();
        expect(await createDynamicFieldLibraryConfigPo.verifyTitle("Hidden")).toBeFalsy();
        await createDynamicFieldLibraryConfigPo.cancelButton();
        await navigationPage.gotoSettingsMenuItem('Application Configuration--Dynamic Group Library', 'Group Management Console - Business Workflows');
        await dynamicGroupLibraryConfigConsolePo.clickAddDynamicGroupButton();
        await createDynamicGroupLibraryConfigPo.clickOnAddDynamicField();
        expect(await createDynamicGroupLibraryConfigPo.verifyTitle("Hidden")).toBeFalsy();
    });

    //ankagraw
    it('[DRDMV-21451]: Verify the behaviour when add required dynamic field and hidden dynamic field', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateData1 = {
            "templateName": `manualTaskTemplate1 ${randomStr}`,
            "templateSummary": `manualTaskTemplateSummary1 ${randomStr}`,
            "templateStatus": "Active",
        }
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDynamicFieldAndGroup();
        await apiHelper.apiLogin('qkatawazi');
        let taskTemplate = await apiHelper.createManualTaskTemplate(templateData1);
        await apiHelper.createDynamicDataOnTemplate(taskTemplate.id, 'RequiredHiddenDRDMV21451');

        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester('fritz');
        await createCasePage.setSummary('Summary' + randomStr);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        await viewCasePage.getCaseID()
        await viewCasePage.clickAddTaskButton();
        await manageTask.addTaskFromTaskTemplate(`manualTaskTemplate1 ${randomStr}`);
        await manageTask.clickTaskLinkOnManageTask(`manualTaskTemplateSummary1 ${randomStr}`);
        await viewTaskPo.clickOnViewCase();
        expect(await viewCasePage.isDynamicFieldDisplayed('Field1OutsideDRDMV21451')).toBeFalsy();
        await updateStatusBladePo.changeCaseStatus("In Progress");
        await updateStatusBladePo.clickSaveStatus();
        await updateStatusBladePo.changeCaseStatus("Resolved");
        await updateStatusBladePo.setStatusReason('Auto Resolved');
        await updateStatusBladePo.clickSaveStatus();
        expect(await utilityCommon.isPopUpMessagePresent("Required fields not entered hidden")).toBeTruthy();
        await updateStatusBladePo.clickCancelButton();
        await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        let casTemplateSummary = 'CaseSummaryName' + randomStr;
        let caseTemplateName = randomStr + 'caseTemplateName';
        let CaseTemplateData = {
            "templateName": caseTemplateName,
            "templateSummary": casTemplateSummary,
            "caseStatus": "InProgress",
            "templateStatus": "Active",
            "assignee": "Fritz",
            "company": "Petramco",
            "supportGroup": "Facilities",
            "ownerGroup": "Facilities"
        }
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDynamicFieldAndGroup();
        await apiHelper.apiLogin('fritz');
        let CaseTemplate = await apiHelper.createCaseTemplate(CaseTemplateData);
        await apiHelper.createDynamicDataOnTemplate(CaseTemplate.id, 'RequiredHiddenDRDMV21451');

        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester('fritz');
        await createCasePage.setSummary('Summary' + randomStr);
        await createCasePage.clickSelectCaseTemplateButton();
        await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        expect(await viewCasePage.isDynamicFieldDisplayed('Field1OutsideDRDMV21451')).toBeFalsy();
        await updateStatusBladePo.changeCaseStatus("Resolved");
        await updateStatusBladePo.setStatusReason('Auto Resolved');
        await updateStatusBladePo.clickSaveStatus();
        expect(await utilityCommon.isPopUpMessagePresent("Required fields not entered hidden")).toBeTruthy();
    }, 280 * 1000);

    it('[DRDMV-21452]: Verify the behaviour when add confidential dynamic field and hidden dynamic field', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateData1 = {
            "templateName": 'manualTaskTemplate1' + randomStr,
            "templateSummary": 'manualTaskTemplateSummary1' + randomStr,
            "templateStatus": "Active",
        }
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDynamicFieldAndGroup();
        await apiHelper.apiLogin('qkatawazi');
        let taskTemplate = await apiHelper.createManualTaskTemplate(templateData1);
        await apiHelper.createDynamicDataOnTemplate(taskTemplate.id, 'ConfidentialsHiddenDRDMV21452');

        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester('fritz');
        await createCasePage.setSummary('Summary' + randomStr);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        await viewCasePage.getCaseID()
        await viewCasePage.clickAddTaskButton();
        await manageTask.addTaskFromTaskTemplate('manualTaskTemplate1' + randomStr);
        await manageTask.clickTaskLinkOnManageTask('manualTaskTemplateSummary1' + randomStr);
        await viewTaskPo.clickOnViewCase();
        expect(await viewCasePage.isDynamicFieldDisplayed('Field1OutsideDRDMV21452')).toBeFalsy();

        let casTemplateSummary = 'CaseSummaryName' + randomStr;
        let caseTemplateName = randomStr + 'caseTemplateName';
        let CaseTemplateData = {
            "templateName": caseTemplateName,
            "templateSummary": casTemplateSummary,
            "caseStatus": "InProgress",
            "templateStatus": "Active",
            "assignee": "Fritz",
            "company": "Petramco",
            "supportGroup": "Facilities",
            "ownerGroup": "Facilities"
        }
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDynamicFieldAndGroup();
        await apiHelper.apiLogin('fritz');
        let CaseTemplate = await apiHelper.createCaseTemplate(CaseTemplateData);
        await apiHelper.createDynamicDataOnTemplate(CaseTemplate.id, 'ConfidentialsHiddenDRDMV21452');

        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester('fritz');
        await createCasePage.setSummary('Summary' + randomStr);
        await createCasePage.clickSelectCaseTemplateButton();
        await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        expect(await viewCasePage.isDynamicFieldDisplayed('Field1OutsideDRDMV21452')).toBeFalsy();
    }, 280 * 1000);

    //ankagraw
    it('[DRDMV-21422,DRDMV-21414]: create a case with task template having hidden fields, if the field is later updated to show field, then cases created earlier should not show up earlier the hidden fields.', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateData1 = {
            "templateName": `manualTaskTemplate ${randomStr}`,
            "templateSummary": `manualTaskTemplateSummary ${randomStr}`,
            "templateStatus": "Active",
        }
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDynamicFieldAndGroup();
        await apiHelper.apiLogin('qkatawazi');
        let newCaseTemplate = await apiHelper.createManualTaskTemplate(templateData1);
        await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'hiddenField');
        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester('fritz');
        await createCasePage.setSummary('Summary' + randomStr);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        let CaseId = await viewCasePage.getCaseID();
        await viewCasePage.clickAddTaskButton();
        await manageTask.addTaskFromTaskTemplate(`manualTaskTemplate ${randomStr}`);
        await manageTask.clickTaskLinkOnManageTask(`manualTaskTemplateSummary ${randomStr}`);
        await viewTaskPo.clickOnViewCase();
        expect(await viewCasePage.isDynamicFieldDisplayed('Field1OutsideDRDMV21415' + randomStr)).toBeFalsy();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await selectTaskTemplate.searchAndOpenTaskTemplate(`manualTaskTemplate ${randomStr}`);
        await viewTaskTemplate.clickOnEditMetaData();
        await editTaskTemplate.selectTemplateStatus("Draft");
        await editTaskTemplate.clickOnSaveMetadata();
        await viewTaskTemplate.clickOnManageDynamicFieldLink();
        await dynamicFieldsPage.clickOnDownArrow();
        expect(await dynamicFieldsPage.isEnabledTextPresent("Hidden"));
        await dynamicFieldsPage.clickDisabledHiddenRadioButton();
        await dynamicFieldsPage.clickSaveButton();
        await viewTaskTemplate.clickOnEditMetaData();
        await editTaskTemplate.selectTemplateStatus("Active");
        await editTaskTemplate.clickOnSaveMetadata();
        await navigationPage.gotoCaseConsole();
        await caseConsolePo.searchAndOpenCase(CaseId);
        expect(await viewCasePage.getCaseID()).toBe(CaseId);
        expect(await viewCasePage.isDynamicFieldDisplayed('Field1OutsideDRDMV21415')).toBeTruthy();
        await viewCasePage.clickEditCaseButton();
        await editCasePo.setDynamicFieldValue('Field1OutsideDRDMV21415', 'test 1');
        await editCasePo.clickSaveCase();
        expect(await viewCasePage.getValueOfDynamicFields('Field1OutsideDRDMV21415')).toBe('test 1');
    });

    //ankagraw
    it('[DRDMV-21421,DRDMV-21415,DRDMV-21401]:create a case with case template having hidden fields, if the field is later updated to show field, then cases created earlier should not show up earlier the hidden fields.', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDynamicFieldAndGroup();
        let casTemplateSummary = 'CaseSummaryName' + randomStr;
        let caseTemplateName = randomStr + 'caseTemplateName';
        let CaseTemplateData = {
            "templateName": caseTemplateName,
            "templateSummary": casTemplateSummary,
            "caseStatus": "InProgress",
            "templateStatus": "Active",
            "assignee": "qkatawazi",
            "company": "Petramco",
            "supportGroup": "Compensation and Benefits",
            "ownerGroup": "Compensation and Benefits"
        }

        await apiHelper.apiLogin('fritz');
        let newCaseTemplate = await apiHelper.createCaseTemplate(CaseTemplateData);
        await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'hiddenField');
        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester('fritz');
        await createCasePage.setSummary('Summary' + randomStr);
        await createCasePage.clickSelectCaseTemplateButton();
        await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        let CaseId = await viewCasePage.getCaseID();
        expect(await viewCasePage.isDynamicFieldDisplayed('Field1OutsideDRDMV21415' + randomStr)).toBeFalsy("hidden");

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        await utilGrid.searchAndOpenHyperlink(caseTemplateName);
        await viewCasetemplatePo.clickEditTemplateMetaData();
        await editCasetemplatePo.changeTemplateStatusDropdownValue('Draft');
        await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
        await viewCasetemplatePo.clickOnMangeDynamicFieldLink();
        await dynamicFieldsPage.clickOnDownArrow();
        expect(await dynamicFieldsPage.isEnabledTextPresent("Hidden"));
        await dynamicFieldsPage.clickDisabledHiddenRadioButton();
        await dynamicFieldsPage.clickSaveButton();
        await viewCasetemplatePo.clickEditTemplateMetaData();
        await editCasetemplatePo.changeTemplateStatusDropdownValue('Active');
        await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
        await navigationPage.gotoCaseConsole();
        await caseConsolePo.searchAndOpenCase(CaseId);
        expect(await viewCasePage.getCaseID()).toBe(CaseId);
        expect(await viewCasePage.isDynamicFieldDisplayed('Field1OutsideDRDMV21415')).toBeTruthy();
        await viewCasePage.clickEditCaseButton();
        await editCasePo.setDynamicFieldValue('Field1OutsideDRDMV21415', 'test 1');
        await editCasePo.clickSaveCase();
        expect(await viewCasePage.getValueOfDynamicFields('Field1OutsideDRDMV21415')).toBe('test 1');
    });

    //ankagraw
    it('[DRDMV-21404,DRDMV-21416]:Verify hidden dynamic group field should not refect in case via task template', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateData1 = {
            "templateName": `manualTaskTemplate1 ${randomStr}`,
            "templateSummary": `manualTaskTemplateSummary1 ${randomStr}`,
            "templateStatus": "Active",
        }
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDynamicFieldAndGroup();
        await apiHelper.apiLogin('qkatawazi');
        let newCaseTemplate = await apiHelper.createManualTaskTemplate(templateData1);
        await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'DynamicGroupContainsHiddenFieldDRDMV21416');
        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester('fritz');
        await createCasePage.setSummary('Summary' + randomStr);
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        await viewCasePage.getCaseID();
        await viewCasePage.clickAddTaskButton();
        await manageTask.addTaskFromTaskTemplate(`manualTaskTemplate1 ${randomStr}`);
        await manageTask.clickTaskLinkOnManageTask(`manualTaskTemplateSummary1 ${randomStr}`);
        await viewTaskPo.clickOnViewCase();
        let CaseId = await viewCasePage.getCaseID();
        expect(await viewCasePage.isDynamicFieldDisplayed('FieldGroup1')).toBeFalsy();

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await selectTaskTemplate.searchAndOpenTaskTemplate(`manualTaskTemplate1 ${randomStr}`);
        await viewTaskTemplate.clickOnEditMetaData();
        await editTaskTemplate.selectTemplateStatus("Draft");
        await editTaskTemplate.clickOnSaveMetadata();
        await viewTaskTemplate.clickOnManageDynamicFieldLink();
        await dynamicFieldsPage.clickOnDownArrow();
        await dynamicFieldsPage.clickOnDownArrow();
        expect(await dynamicFieldsPage.isEnabledTextPresent("Hidden"));
        await dynamicFieldsPage.clickDisabledHiddenRadioButton();
        await dynamicFieldsPage.clickSaveButton();
        await viewTaskTemplate.clickOnEditMetaData();
        await editTaskTemplate.selectTemplateStatus("Active");
        await editTaskTemplate.clickOnSaveMetadata();
        await navigationPage.gotoCaseConsole();
        await caseConsolePo.searchAndOpenCase(CaseId);
        expect(await viewCasePage.getCaseID()).toBe(CaseId);
        expect(await viewCasePage.isDynamicFieldDisplayed('FieldGroup1')).toBeTruthy();
        await viewCasePage.clickEditCaseButton();
        await editCasePo.setDynamicFieldValue('FieldGroup1', 'test 1');
        await editCasePo.clickOnAssignToMe();
        await editCasePo.clickSaveCase();
        expect(await viewCasePage.getValueOfDynamicFields('FieldGroup1')).toBe('test 1');
    });

    //ankagraw
    it('[DRDMV-21417]:Verify hidden dynamic group field should not refect in case via case template', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDynamicFieldAndGroup();
        let casTemplateSummary = 'CaseSummaryName' + randomStr;
        let caseTemplateName = randomStr + 'caseTemplateName';
        let CaseTemplateData = {
            "templateName": caseTemplateName,
            "templateSummary": casTemplateSummary,
            "caseStatus": "InProgress",
            "templateStatus": "Active",
            "assignee": "Fritz",
            "company": "Petramco",
            "supportGroup": "Facilities",
            "ownerGroup": "Facilities"
        }

        await apiHelper.apiLogin('fritz');
        let newCaseTemplate = await apiHelper.createCaseTemplate(CaseTemplateData);
        await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'DynamicGroupContainsHiddenFieldDRDMV21416');
        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester('fritz');
        await createCasePage.setSummary('Summary' + randomStr);
        await createCasePage.clickSelectCaseTemplateButton();
        await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        let CaseId = await viewCasePage.getCaseID();
        expect(await viewCasePage.isDynamicFieldDisplayed('FieldGroup1')).toBeFalsy();

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        await utilGrid.searchAndOpenHyperlink(caseTemplateName);
        await viewCasetemplatePo.clickEditTemplateMetaData();
        await editCasetemplatePo.changeTemplateStatusDropdownValue('Draft');
        await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
        await viewCasetemplatePo.clickOnMangeDynamicFieldLink();
        await dynamicFieldsPage.clickOnDownArrow();
        await dynamicFieldsPage.clickOnDownArrow();
        expect(await dynamicFieldsPage.isEnabledTextPresent("Hidden"));
        await dynamicFieldsPage.clickDisabledHiddenRadioButton();
        await dynamicFieldsPage.clickSaveButton();
        await viewCasetemplatePo.clickEditTemplateMetaData();
        await editCasetemplatePo.changeTemplateStatusDropdownValue('Active');
        await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
        await navigationPage.gotoCaseConsole();
        await caseConsolePo.searchAndOpenCase(CaseId);
        expect(await viewCasePage.getCaseID()).toBe(CaseId);
        expect(await viewCasePage.isDynamicFieldDisplayed('Field1OutsideDRDMV21415')).toBeTruthy();
        await viewCasePage.clickEditCaseButton();
        await editCasePo.setDynamicFieldValue('Field1OutsideDRDMV21415', 'test 1');
        await editCasePo.clickSaveCase();
        expect(await viewCasePage.getValueOfDynamicFields('Field1OutsideDRDMV21415')).toBe('test 1');
    });

    //ankagraw
    it('[DRDMV-21515]:Verify hidden dynamic field with multiple attributes in case via case template', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDynamicFieldAndGroup();
        let casTemplateSummary = 'CaseSummaryName' + randomStr;
        let caseTemplateName = randomStr + 'caseTemplateName';
        let CaseTemplateData = {
            "templateName": caseTemplateName,
            "templateSummary": casTemplateSummary,
            "caseStatus": "InProgress",
            "templateStatus": "Active",
            "assignee": "Fritz",
            "company": "Petramco",
            "supportGroup": "Facilities",
            "ownerGroup": "Facilities"
        }

        await apiHelper.apiLogin('fritz');
        let newCaseTemplate = await apiHelper.createCaseTemplate(CaseTemplateData);
        await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'AllSourceAndTypeDRDMV21515');
        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester('fritz');
        await createCasePage.setSummary('Summary' + randomStr);
        await createCasePage.clickSelectCaseTemplateButton();
        await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        await viewCasePage.getCaseID();
        expect(await viewCasePage.isDynamicFieldDisplayed('Number Field')).toBeFalsy();
        expect(await viewCasePage.isDynamicFieldDisplayed('Date Field')).toBeFalsy();
        expect(await viewCasePage.isDynamicFieldDisplayed('Boolean Field')).toBeFalsy();
        expect(await viewCasePage.isDynamicFieldDisplayed('List Field')).toBeFalsy();
        expect(await viewCasePage.isDynamicFieldDisplayed('Attachment Field')).toBeFalsy();
        expect(await viewCasePage.isDynamicFieldDisplayed('Date and Time')).toBeFalsy();
        expect(await viewCasePage.isDynamicFieldDisplayed('Time')).toBeFalsy();

        expect(await viewCasePage.isDynamicFieldDisplayed('Number1 field')).toBeTruthy();
        expect(await viewCasePage.isDynamicFieldDisplayed('Date1 field')).toBeTruthy();
        expect(await viewCasePage.isDynamicFieldDisplayed('Boolean1 field')).toBeTruthy();
        expect(await viewCasePage.isDynamicFieldDisplayed('List1 Field')).toBeTruthy();
        expect(await viewCasePage.isDynamicFieldDisplayed('Attachment1 Field')).toBeTruthy();
        expect(await viewCasePage.isDynamicFieldDisplayed('Date1 and time1')).toBeTruthy();
        expect(await viewCasePage.isDynamicFieldDisplayed('time1')).toBeTruthy();
    });

    //ankagraw
    it('[DRDMV-21418]:Hidden property of case get priority when Dynamic field with same name but one contains hidden property and another without hidden created a case through caseTemplate and task template', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDynamicFieldAndGroup();
        let casTemplateSummary = 'CaseSummaryName' + randomStr;
        let caseTemplateName = randomStr + 'caseTemplateName';
        let CaseTemplateData = {
            "templateName": caseTemplateName,
            "templateSummary": casTemplateSummary,
            "caseStatus": "InProgress",
            "templateStatus": "Active",
            "assignee": "Fritz",
            "company": "Petramco",
            "supportGroup": "Facilities",
            "ownerGroup": "Facilities"
        }
        let templateData1 = {
            "templateName": `manualTaskTemplate1 ${randomStr}`,
            "templateSummary": `manualTaskTemplateSummary1 ${randomStr}`,
            "templateStatus": "Active",
        }
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDynamicFieldAndGroup();
        await apiHelper.apiLogin('fritz');
        let newCaseTemplate = await apiHelper.createCaseTemplate(CaseTemplateData);
        let newtaskTemplate = await apiHelper.createManualTaskTemplate(templateData1);
        await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'DuplicateOFhiddenFieldDRDMV21418');
        await apiHelper.createDynamicDataOnTemplate(newtaskTemplate.id, 'hiddenField');
        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester('fritz');
        await createCasePage.setSummary('Summary' + randomStr);
        await createCasePage.clickSelectCaseTemplateButton();
        await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        await viewCasePage.getCaseID();
        expect(await viewCasePage.isDynamicFieldDisplayed('Field1OutsideDRDMV21415')).toBeTruthy();
        await viewCasePage.clickAddTaskButton();
        await manageTask.addTaskFromTaskTemplate(`manualTaskTemplate1 ${randomStr}`);
        await manageTask.clickTaskLinkOnManageTask(`manualTaskTemplateSummary1 ${randomStr}`);
        await viewTaskPo.clickOnViewCase();
        await viewCasePage.getCaseID();
        expect(await viewCasePage.isDynamicFieldDisplayed('Field1OutsideDRDMV21415')).toBeTruthy();
    });

    //ptidke
    it('[DRDMV-13136]:[-ve] [Dynamic Data] - Case with large no. of Dynamic fields', async () => {
        try {
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            let caseTemplateName = randomStr + 'caseTemplateDRDMV-13136';
            let caseTemaplateSummary = randomStr + 'caseTemplateDRDMV-13136';
            let casetemplateData = {
                "templateName": `${caseTemplateName}`,
                "templateSummary": `${caseTemaplateSummary}`,
                "templateStatus": "Active",
            }
            await apiHelper.apiLogin('fritz');
            let newCaseTemplate = await apiHelper.createCaseTemplate(casetemplateData);
            await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'CASE_TEMPLATE_EACH_15_FIELD');
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('qkatawazi');
            await quickCasePo.selectCaseTemplate(caseTemplateName);
            await quickCasePo.createCaseButton();
            await quickCasePo.gotoCaseButton();
            //verify fields shoule be empty values on case view
            let arr: string[] = ['text1', 'text2', 'text3', 'text3', 'text4', 'text5', 'text6', 'text7', 'text8', 'text9', 'text10', 'text11', 'text12', 'text13', 'text14', 'attachment1', 'attachment2', 'attachment3', 'attachment4', 'attachment5', 'attachment6', 'attachment7', 'attachment8', 'attachment9', 'attachment10', 'boolean1', 'boolean2', 'boolean3', 'boolean4', 'boolean4', 'boolean5', 'boolean6', 'boolean7', 'boolean8', 'boolean9', 'boolean10', 'date1', 'date2', 'date3', 'date4', 'date5', 'date6', 'date7', 'date8', 'date9', 'date10', 'date11', 'date12', 'date13', 'date14', 'date15', 'datetime1', 'datetime2', 'datetime3', 'datetime4', 'datetime5', 'datetime6', 'datetime7', 'datetime8', 'datetime9', 'datetime10', 'datetime11', 'datetime12', 'datetime13', 'datetime14', 'datetime15', 'time1', 'time2', 'time3', 'time4', 'time5', 'time6', 'time7', 'time8', 'time9', 'time10', 'number1', 'number2', 'number3', 'number4', 'number5', 'number6', 'number7', 'number8', 'number9', 'number10', 'number11', 'number12', 'number13', 'number14', 'number15', 'attachment1', 'attachment2', 'attachment3', 'attachment4', 'attachment5', 'attachment6', 'attachment7', 'attachment8', 'attachment9', 'attachment10', 'attachment11', 'attachment12', 'attachment13', 'attachment14', 'attachment15', 'dynamicList', 'datetime1', 'datetime2', 'datetime3', 'datetime4', 'datetime5', 'datetime6', 'datetime7', 'datetime8', 'datetime9', 'datetime10', 'datetime11', 'datetime12', 'datetime13', 'datetime14', 'datetime15'];
            for (let i = 0; i < arr.length; i++) {
                expect(await viewCasePo.getValueOfDynamicFields(arr[i])).toBeTruthy('field not present');
            }
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
            let arr1: string[] = ['text6', 'text7', 'text8', 'text9', 'text10', 'text11', 'text12', 'text13', 'text14', 'attachment1', 'attachment2', 'attachment3', 'attachment4', 'attachment5', 'attachment6', 'attachment7', 'attachment8', 'attachment9', 'attachment10', 'boolean1', 'boolean2', 'boolean3', 'boolean4', 'boolean4', 'boolean5', 'boolean6', 'boolean7', 'boolean8', 'boolean9', 'boolean10', 'date1', 'date2', 'date3', 'date4', 'date5', 'date6', 'date7', 'date8', 'date9', 'date10', 'date11', 'date12', 'date13', 'date14', 'date15', 'datetime1', 'datetime2', 'datetime3', 'datetime4', 'datetime5', 'datetime6', 'datetime7', 'datetime8', 'datetime9', 'datetime10', 'datetime11', 'datetime12', 'datetime13', 'datetime14', 'datetime15', 'time1', 'time2', 'time3', 'time4', 'time5', 'time6', 'time7', 'time8', 'time9', 'time10', 'number6', 'number7', 'number8', 'number9', 'number10', 'number11', 'number12', 'number13', 'number14', 'number15', 'attachment1', 'attachment2', 'attachment3', 'attachment4', 'attachment5', 'attachment6', 'attachment7', 'attachment8', 'attachment9', 'attachment10', 'attachment11', 'attachment12', 'attachment13', 'attachment14', 'attachment15', 'dynamicList', 'datetime1', 'datetime2', 'datetime3', 'datetime4', 'datetime5', 'datetime6', 'datetime7', 'datetime8', 'datetime9', 'datetime10', 'datetime11', 'datetime12', 'datetime13', 'datetime14', 'datetime15'];
            for (let i = 0; i < arr1.length; i++) {
                expect(await viewCasePo.getValueOfDynamicFields(arr1[i])).toBeTruthy('field not present');
            }
        } catch (e) { throw e }
        finally {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        }
    });//, 220 * 1000);

})