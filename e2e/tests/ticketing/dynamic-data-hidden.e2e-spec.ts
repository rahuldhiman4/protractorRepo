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
import manageTask from "../../pageobject/task/manage-task-blade.po";
import viewTaskPo from '../../pageobject/task/view-task.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilGrid from '../../utils/util.grid';
import utilityCommon from '../../utils/utility.common';
import applicationConfigPo from '../../pageobject/common/common-services/application-config.po';

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
    describe('[DRDMV-13168]: [Dynamic Data] [UI] - Automated Task Template UI on create and on Edit', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let automatedTaskTemplate1 = 'Automation Task1 ' + randomStr;
        let automatedTaskSummary1 = 'Automation Summary1 ' + randomStr;
        let processName = 'Process Name ' + randomStr;
        it('[DRDMV-13168]: Validate Automated Task Template ', async () => {
            //Automation Task template
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.clickOnAutomationTaskTemplateButton();
            expect(await createTaskTemplate.isAddTaskTemplateTitleDisplayed('Add Task Template')).toBeTruthy('Add Task Template Title not displayed');
            expect(await createTaskTemplate.isTemplateMetadataTitleDisplayed('Template Metadata')).toBeTruthy('Template Metadata Title not displayed');
            expect(await createTaskTemplate.isTemplateNameRequiredText()).toBeTruthy("Template Name Required text Not Present");
            expect(await createTaskTemplate.isCreateNewProcessRequiredText()).toBeTruthy("CreateNewProcess Required text Not Present");
            expect(await createTaskTemplate.isNewProcessNameRequiredText()).toBeTruthy("NewProcessName Required text Not Present");
            expect(await createTaskTemplate.isProcessBundleIdRequiredText()).toBeTruthy("ProcessBundleId Required text Not Present");
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
            await createTaskTemplate.setcreateNewProcess(false);
            expect(await createTaskTemplate.isProcessTitlePresent("New Process Name")).toBeFalsy("New Process Title Present");
        });
        it('[DRDMV-13168]: Create a template', async () => {
            await createTaskTemplate.setTemplateName(automatedTaskTemplate1);
            await createTaskTemplate.setTaskSummary(automatedTaskSummary1);
            await createTaskTemplate.setTaskDescription('Description in manual task');
            await createTaskTemplate.selectCompanyByName('Petramco');
            await createTaskTemplate.setNewProcessName('Business Workflows', processName);
            await createTaskTemplate.clickOnSaveTaskTemplate();
            await utilCommon.closePopUpMessage();
        });
        it('[DRDMV-13168]: [Dynamic Data] [UI] - Automated Task Template UI on create and on Edit', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.searchAndOpenTaskTemplate(automatedTaskTemplate1);
            expect(await viewTaskTemplate.isEditProcessLinkDisplayed()).toBeTruthy(" Edit link in not displayed");
            expect(await viewTaskTemplate.isManageDynamicFieldLinkDisplayed()).toBeTruthy(" Manage link not present");
            await viewTaskTemplate.clickOnEditLink();
            expect(await viewTaskTemplate.isEditProcessLinkDisplayed()).toBeFalsy(" Edit link is displayed");
            expect(await editTaskTemplate.getTaskTypeValueAttribute('disabled')).toBeTruthy(" Attribute value is disabled");
            expect(await editTaskTemplate.isManageProcessLinkDisplayed()).toBeTruthy(" Manage process link present");
        });
    });

    //ankagraw
    describe('[DRDMV-13169]: [Dynamic Data] [UI] - Automated Task UI on Edit view', async () => {
        let templateData, randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            templateData = {
                "templateName": `AutomatedTaskTemplateActive ${randomStr}`,
                "templateSummary": `AutomatedTaskTemplateSummaryActive ${randomStr}`,
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
        it('[DRDMV-13169]: Add Dynamic on above task template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
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
        it('[DRDMV-13169]: Create a case', async () => {
            await loginPage.login('qtao');
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary('Summary ' + randomStr);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePo.clickAddTaskButton();
        });
        it('[DRDMV-13169]: Add above task template and verify above dynamic field', async () => {
            await manageTask.addTaskFromTaskTemplate(templateData.templateName)
            await manageTask.clickTaskLink(templateData.templateSummary);
            expect(await viewTaskPo.isDynamicFieldPresent('Field Description')).toBeTruthy('Field Description');
            expect(await viewTaskPo.isAssignmentSectionDisplayed()).toBeFalsy('Assignment Section is present');
            await viewTaskPo.clickOnEditTask();
            expect(await editTaskPo.isFieldsDisplyed('Assignment Section')).toBeFalsy('Assignment Section is present');
            await editTaskPo.clickOnCancelButton();
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        });
    });

    //ankagraw
    it('[DRDMV-21405,DRDMV-21406]: Verify hidden radio button should not present in dynamic field library', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Application Configuration--Dynamic Field Library', 'Field Management Console - Business Workflows');
        await dynamicFieldLibraryConfigConsolePo.clickAddDynamicFieldButton();
        expect(await createDynamicFieldLibraryConfigPo.isHiddenFieldPresent("Hidden")).toBeFalsy();
        await createDynamicFieldLibraryConfigPo.clickCancelButton();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Application Configuration--Dynamic Group Library', 'Group Management Console - Business Workflows');
        await dynamicGroupLibraryConfigConsolePo.clickAddDynamicGroupButton();
        await createDynamicGroupLibraryConfigPo.clickOnAddDynamicField();
        expect(await createDynamicGroupLibraryConfigPo.verifyTitle("Hidden")).toBeFalsy();
    });

    //ankagraw
    describe('[DRDMV-21451]: Verify the behaviour when add required dynamic field and hidden dynamic field', async () => {
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
        it('[DRDMV-21451]: Create a case and add task on it', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('fritz');
            await createCasePage.setSummary('Summary' + randomStr);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePo.getCaseID()
            await viewCasePo.clickAddTaskButton();
            await manageTask.addTaskFromTaskTemplate(templateData.templateName);
            await manageTask.clickTaskLink(templateData.templateSummary);
            await viewTaskPo.clickOnViewCase();
        });
        it('[DRDMV-21451]: Validate dynamic field and change the status', async () => {
            expect(await viewCasePo.isDynamicFieldDisplayed('Field1OutsideDRDMV21451')).toBeFalsy();
            await updateStatusBladePo.changeCaseStatus("In Progress");
            await updateStatusBladePo.clickSaveStatus();
            await updateStatusBladePo.changeCaseStatus("Resolved");
            await updateStatusBladePo.setStatusReason('Auto Resolved');
            await updateStatusBladePo.clickSaveStatus();
            expect(await utilityCommon.isPopUpMessagePresent("Message not found, [bundleId = Ticketing-AppID, messageNum = 930] Required fields not entered Field1OutsideDRDMV21451")).toBeTruthy();
            await updateStatusBladePo.clickCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });
        it('[DRDMV-21451]: Create a case and add task on it', async () => {
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
        it('[DRDMV-21451]: Validate dynamic field and change the status', async () => {
            expect(await viewCasePo.isDynamicFieldDisplayed('Field1OutsideDRDMV21451')).toBeFalsy('Field1OutsideDRDMV21451 displayed');
            await updateStatusBladePo.changeCaseStatus("Resolved");
            await updateStatusBladePo.setStatusReason('Auto Resolved');
            await updateStatusBladePo.clickSaveStatus();
            expect(await utilityCommon.isPopUpMessagePresent("Message not found, [bundleId = Ticketing-AppID, messageNum = 930] Required fields not entered Field1OutsideDRDMV21451")).toBeTruthy();
            await updateStatusBladePo.clickCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });
    });

    describe('[DRDMV-21452]: Verify the behaviour when add confidential dynamic field and hidden dynamic field', async () => {
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
        it('[DRDMV-21452]: Create a case and add task on it', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('Summary' + randomStr);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePo.getCaseID()
            await viewCasePo.clickAddTaskButton();
            await manageTask.addTaskFromTaskTemplate(templateData.templateName);
            await manageTask.clickTaskLink(templateData.templateSummary);
            await viewTaskPo.clickOnViewCase();
            expect(await viewCasePo.isDynamicFieldDisplayed('Field1OutsideDRDMV21452')).toBeFalsy();
        });
        it('[DRDMV-21452]: Create a case and add case template on it', async () => {
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
    });

    //ankagraw
    describe('[DRDMV-21422,DRDMV-21414]: create a case with task template having hidden fields, if the field is later updated to show field, then cases created earlier should not show up earlier the hidden fields.', async () => {
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
        it('[DRDMV-21422,DRDMV-21414]: Create a case and add task on it', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('fritz');
            await createCasePage.setSummary('Summary' + randomStr);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            caseId = await viewCasePo.getCaseID();
            await viewCasePo.clickAddTaskButton();
            await manageTask.addTaskFromTaskTemplate(templateData.templateName);
            await manageTask.clickTaskLink(templateData.templateSummary);
            await viewTaskPo.clickOnViewCase();
        });
        it('[DRDMV-21422,DRDMV-21414]: Validate dynamic field and change the it teask template status', async () => {
            expect(await viewCasePo.isDynamicFieldDisplayed('Field1OutsideDRDMV21415' + randomStr)).toBeFalsy();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.searchAndOpenTaskTemplate(templateData.templateName);
            await viewTaskTemplate.clickOnEditMetaData();
            await editTaskTemplate.selectTemplateStatus("Draft");
            await editTaskTemplate.clickOnSaveMetadata();
        });
        it('[DRDMV-21422,DRDMV-21414]: Disable the hidden field and change the status', async () => {
            await viewTaskTemplate.clickOnManageDynamicFieldLink();
            await dynamicFieldsPage.clickOnDownArrow();
            expect(await dynamicFieldsPage.isEnabledTextPresent("Hidden"));
            await dynamicFieldsPage.clickDisabledHiddenRadioButton();
            await dynamicFieldsPage.clickSaveButton();
            await viewTaskTemplate.clickOnEditMetaData();
            await editTaskTemplate.selectTemplateStatus("Active");
            await editTaskTemplate.clickOnSaveMetadata();
        });
        it('[DRDMV-21422,DRDMV-21414]: Validate dynamic field is visisble', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            expect(await viewCasePo.getCaseID()).toBe(caseId);
            expect(await viewCasePo.isDynamicFieldDisplayed('Field1OutsideDRDMV21415')).toBeTruthy();
            await viewCasePo.clickEditCaseButton();
            await editCasePo.setDynamicFieldValue('Field1OutsideDRDMV21415', 'test 1');
            await editCasePo.clickSaveCase();
            expect(await viewCasePo.getValueOfDynamicFields('Field1OutsideDRDMV21415')).toBe('test 1');
        });
    });

    //ankagraw
    describe('[DRDMV-21421,DRDMV-21415,DRDMV-21401]: Create a case with case template having hidden fields, if the field is later updated to show field, then cases created earlier should not show up earlier the hidden fields.', async () => {
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
        it('[DRDMV-21421,DRDMV-21415,DRDMV-21401]: Create a case and add case template on it', async () => {
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
        it('[DRDMV-21421,DRDMV-21415,DRDMV-21401]: Change the status of case template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(caseTemplateData.templateName);
            await viewCasetemplatePo.clickEditTemplateMetaData();
            await editCasetemplatePo.changeTemplateStatusDropdownValue('Draft');
            await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
            await utilCommon.closePopUpMessage();
            await viewCasetemplatePo.clickOnMangeDynamicFieldLink();
        });
        it('[DRDMV-21421,DRDMV-21415,DRDMV-21401]: Make dymanic field as visible', async () => {
            await dynamicFieldsPage.clickOnDownArrow();
            expect(await dynamicFieldsPage.isEnabledTextPresent("Hidden"));
            await dynamicFieldsPage.clickDisabledHiddenRadioButton();
            await dynamicFieldsPage.clickSaveButton();
            await viewCasetemplatePo.clickEditTemplateMetaData();
            await editCasetemplatePo.changeTemplateStatusDropdownValue('Active');
            await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
        });
        it('[DRDMV-21421,DRDMV-21415,DRDMV-21401]: Verify dynamic field is visible on case', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            expect(await viewCasePo.getCaseID()).toBe(caseId);
            expect(await viewCasePo.isDynamicFieldDisplayed('Field1OutsideDRDMV21415')).toBeTruthy();
            await viewCasePo.clickEditCaseButton();
            await editCasePo.setDynamicFieldValue('Field1OutsideDRDMV21415', 'test 1');
            await editCasePo.clickSaveCase();
            expect(await viewCasePo.getValueOfDynamicFields('Field1OutsideDRDMV21415')).toBe('test 1');
        });
    });

    //ankagraw
    describe('[DRDMV-21404,DRDMV-21416]: Verify hidden dynamic group field should not refect in case via task template', async () => {
        let caseId, templateData, randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
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
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            await apiHelper.apiLogin('qkatawazi');
            let newCaseTemplate = await apiHelper.createManualTaskTemplate(templateData);
            await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'DynamicGroupContainsHiddenFieldDRDMV21416');
        });
        it('[DRDMV-21404,DRDMV-21416]: Create a case and add task on it', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('fritz');
            await createCasePage.setSummary('Summary' + randomStr);
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePo.clickAddTaskButton();
            await manageTask.addTaskFromTaskTemplate(templateData.templateName);
            await manageTask.clickTaskLink(templateData.templateSummary);
            await viewTaskPo.clickOnViewCase();
            caseId = await viewCasePo.getCaseID();
            expect(await viewCasePo.isDynamicFieldDisplayed('FieldGroup1')).toBeFalsy();
        });
        it('[DRDMV-21404,DRDMV-21416]: Change the status of the task', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.searchAndOpenTaskTemplate(templateData.templateName);
            await viewTaskTemplate.clickOnEditMetaData();
            await editTaskTemplate.selectTemplateStatus("Draft");
            await editTaskTemplate.clickOnSaveMetadata();
        });
        it('[DRDMV-21404,DRDMV-21416]: Make dynamic field as visible', async () => {
            await viewTaskTemplate.clickOnManageDynamicFieldLink();
            await dynamicFieldsPage.clickOnDownArrow();
            await dynamicFieldsPage.clickOnDownArrow();
            expect(await dynamicFieldsPage.isEnabledTextPresent("Hidden"));
            await dynamicFieldsPage.clickDisabledHiddenRadioButton();
            await dynamicFieldsPage.clickSaveButton();
            await viewTaskTemplate.clickOnEditMetaData();
            await editTaskTemplate.selectTemplateStatus("Active");
            await editTaskTemplate.clickOnSaveMetadata();
        });
        it('[DRDMV-21404,DRDMV-21416]: Validate dynamic field is visible', async () => {
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
    });
    //ankagraw
    describe('[DRDMV-21417]: Verify hidden dynamic group field should not refect in case via case template', async () => {
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
        it('[DRDMV-21417]: Create a case and add case template on it', async () => {
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
        it('[DRDMV-21417]: Change the status of case template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(caseTemplateData.templateName);
            await viewCasetemplatePo.clickEditTemplateMetaData();
            await editCasetemplatePo.changeTemplateStatusDropdownValue('Draft');
            await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
            await viewCasetemplatePo.clickOnMangeDynamicFieldLink();
        });
        it('[DRDMV-21417]: Update the dymanic field', async () => {
            await dynamicFieldsPage.clickOnDownArrow();
            await dynamicFieldsPage.clickOnDownArrow();
            expect(await dynamicFieldsPage.isEnabledTextPresent("Hidden"));
            await dynamicFieldsPage.clickDisabledHiddenRadioButton();
            await dynamicFieldsPage.clickSaveButton();
            await viewCasetemplatePo.clickEditTemplateMetaData();
            await editCasetemplatePo.changeTemplateStatusDropdownValue('Active');
            await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
        });
        it('[DRDMV-21417]: Validate the dynamic field', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            expect(await viewCasePo.getCaseID()).toBe(caseId);
            expect(await viewCasePo.isDynamicFieldDisplayed('FieldGroup1')).toBeTruthy();
            await viewCasePo.clickEditCaseButton();
            await editCasePo.setDynamicFieldValue('FieldGroup1', 'test 1');
            await editCasePo.clickSaveCase();
            expect(await viewCasePo.getValueOfDynamicFields('FieldGroup1')).toBe('test 1');
        });
    });

    //ankagraw
    describe('[DRDMV-21515]: Verify hidden dynamic field with multiple attributes in case via case template', async () => {
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
        it('[DRDMV-21515]: Create a case and add case template on it', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('fritz');
            await createCasePage.setSummary('Summary' + randomStr);
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateData.templateName);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
        });
        it('DRDMV-21515]: Validate the fields', async () => {
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
    });

    //ankagraw
    describe('[DRDMV-21418]: Hidden property of case get priority when Dynamic field with same name but one contains hidden property and another without hidden created a case through caseTemplate and task template', async () => {
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
        it('[DRDMV-21418]: Create a case and add case template on it', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('fritz');
            await createCasePage.setSummary('Summary' + randomStr);
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateData.templateName);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePo.getCaseID();
        });
        it('[DRDMV-21418]: Validate dynamic field ', async () => {
            expect(await viewCasePo.isDynamicFieldDisplayed('Field1OutsideDRDMV21415')).toBeTruthy();
            await viewCasePo.clickAddTaskButton();
            await manageTask.addTaskFromTaskTemplate(`manualTaskTemplate1 ${randomStr}`);
            await manageTask.clickTaskLink(`manualTaskTemplateSummary1 ${randomStr}`);
            await viewTaskPo.clickOnViewCase();
            await viewCasePo.getCaseID();
            expect(await viewCasePo.isDynamicFieldDisplayed('Field1OutsideDRDMV21415')).toBeTruthy();
        });
    });

    //ankagraw
    describe('[DRDMV-18004,DRDMV-18058,DRDMV-13133]: verify dynamic group fields on Copy case template', async () => {
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
        it('[DRDMV-18004,DRDMV-18058,DRDMV-13133]: verify dynamic group fields on Copy case template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await consoleCasetemplatePo.searchAndselectCaseTemplate(randomStr + 'caseTemplateName');
            await consoleCasetemplatePo.clickOnCopyCaseTemplate();
            await copyCasetemplatePo.setTemplateName('copyCaseTemplateName' + randomStr);
            await copyCasetemplatePo.clickSaveCaseTemplate();
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
        it('[DRDMV-18004,DRDMV-18058,DRDMV-13133]: verify dynamic group fields on Copy case template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Document Management--Templates', 'Document Templates - Business Workflows');
            await createDocumentTemplatePo.clickOnAddTemplate();
            await createDocumentTemplatePo.setTemplateName("Document" + randomStr);
            await createDocumentTemplatePo.setCompany("Petramco");
            await createDocumentTemplatePo.clickOnInsertFieldOfDocumentBody();
            await addFieldsPopPo.navigateToDynamicFieldInCaseTemplate(randomStr + 'caseTemplateName');
            expect(await addFieldsPopPo.isAssocitionDisplayed('GroupOne')).toBeTruthy("Group");
            await addFieldsPopPo.clickOnGroupName('GroupOne');
            expect(await addFieldsPopPo.isDynamicFieldPresentInTemplate('FieldGroup1')).toBeTruthy("Field");
            await addFieldsPopPo.selectDynamicField('FieldGroup1');
            await addFieldsPopPo.clickOnOkButtonOfEditor();
            await createDocumentTemplatePo.setDescription("Description");
            expect(await createDocumentTemplatePo.getDynamicFieldOnBody()).toContain('FieldGroup1');
            await createDocumentTemplatePo.clickOnSaveButton();
            await utilGrid.searchAndOpenHyperlink('Document' + randomStr);
            expect(await editDocumentTemplatePo.getDynamicFieldOnBody()).toContain('FieldGroup1');
        });
        it('[DRDMV-18004,DRDMV-18058,DRDMV-13133]: verify dynamic group fields on Copy case template', async () => {
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
        it('[DRDMV-18004,DRDMV-18058,DRDMV-13133]: verify dynamic group fields on Copy case template', async () => {
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
            expect(await activityTabPo.getAllTaskActivity("TextFieldlistvalues ")).toBeTruthy();
            expect(await activityTabPo.getAllTaskActivity("333")).toBeTruthy();
            expect(await activityTabPo.getAllTaskActivity("2:00 AM")).toBeTruthy();
            expect(await activityTabPo.getAllTaskActivity("listvalues")).toBeTruthy();
            expect(await activityTabPo.getAllTaskActivity("Yes")).toBeTruthy();
            expect(await activityTabPo.getAllTaskActivity("demo.txt")).toBeTruthy();
            await viewCasePo.clickEditCaseButton();
            await editCasePo.setDynamicFieldValue('FieldGroupOutside', 'TextField123');
            await editCasePo.setDynamicFieldValue('externalNumber', '5555555');
            await editCasePo.clickSaveCase();
            expect(await activityTabPo.isTextPresentInActivityLog("TextField123")).toBeTruthy();
            expect(await activityTabPo.isTextPresentInActivityLog("5555555")).toBeTruthy();
            expect(await activityTabPo.isTextPresentInActivityLog("FieldGroupOutside1")).toBeFalsy();

        });
    });

    //ankagraw
    describe('[DRDMV-18006]: verify dynamic fields group on Copy Task template', async () => {
        let templateData, randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            templateData = {
                "templateName": `manualTaskTemplate1 ${randomStr}`,
                "templateSummary": `manualTaskTemplateSummary1 ${randomStr}`,
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
        it('[DRDMV-18006]: verify dynamic fields group on Copy Task template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
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
    });

    //ankagraw
    describe('[DRDMV-13129]: [Dynamic Data] - Change Case Template having dynamic fields and groups from Case', async () => {
        let casetemplateData, randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();

            casetemplateData = {
                "templateName": randomStr + 'caseTemplateDRDMV-13129',
                "templateSummary": randomStr + 'caseTemplateSummaryDRDMV-13129',
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
            let newCaseTemplate = await apiHelper.createCaseTemplate(casetemplateData);
            await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'DynamicGroupFieldDRDMV13129Data1');
            casetemplateData.templateName = randomStr + '13129';
            let newCaseTemplate1 = await apiHelper.createCaseTemplate(casetemplateData);
            await apiHelper.createDynamicDataOnTemplate(newCaseTemplate1.id, 'DynamicGroupFieldDRDMV13129Data2');
        });
        it('[DRDMV-13129]: [Dynamic Data] - Change Case Template having dynamic fields and groups from Case', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary("test the DRDMV-13129");
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.isDynamicFieldDisplayed('FieldGroup1')).toBeFalsy();
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnSelectCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(randomStr + 'caseTemplateDRDMV-13129');
            await editCasePo.clickOnAssignToMe();
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
        it('[DRDMV-13129]: [Dynamic Data] - Change Case Template having dynamic fields and groups from Case', async () => {
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnChangeCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(randomStr + '13129');
            await editCasePo.clickOnAssignToMe();
            await editCasePo.clickSaveCase();
            expect(await viewCasePo.isDynamicFieldDisplayed('FieldGroup1')).toBeTruthy();
            expect(await viewCasePo.isDynamicFieldDisplayed('externalDate')).toBeTruthy();
            expect(await viewCasePo.isDynamicFieldDisplayed('externalBoolean')).toBeTruthy();
            expect(await viewCasePo.isDynamicFieldDisplayed('externalDateTime')).toBeTruthy();
            expect(await viewCasePo.isDynamicFieldDisplayed('externalTime')).toBeTruthy();
            expect(await viewCasePo.isDynamicFieldDisplayed('dynamicList')).toBeTruthy();
            expect(await viewCasePo.isDynamicFieldDisplayed('externalAttachment1')).toBeTruthy();
        });
    });

    //ankagraw
    describe('[DRDMV-17916]: [Dynamic Data] [UI] - Update Dynamic Fields UI from Case Template', async () => {
        let casetemplateData, randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            casetemplateData = {
                "templateName": randomStr + 'caseTemplateDRDMV-17916',
                "templateSummary": randomStr + 'caseTemplateSummaryDRDMV-17916',
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
        it('[DRDMV-17916]: [Dynamic Data] [UI] - Update Dynamic Fields UI from Case Template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(casetemplateData.templateName);
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed('FieldGroup1')).toBeTruthy();
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed('Field2Group1')).toBeTruthy();
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed('Field2Group2')).toBeTruthy();
            expect(await viewCasetemplatePo.isDynamicFieldDisplayed('FieldGroup2')).toBeTruthy();
            await viewCasetemplatePo.clickOnMangeDynamicFieldLink();
            expect(await dynamicFieldsPage.isDynamicFieldDisplayed()).toBeTruthy();
            expect(await dynamicFieldsPage.isAddDynamicGroupDisplayed()).toBeTruthy();
        });
        it('[DRDMV-17916]: [Dynamic Data] [UI] - Update Dynamic Fields UI from Case Template', async () => {
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
        });
    });

    //ankagraw
    describe('[DRDMV-13139]: [Dynamic Data]- Add Dynamic Fields and Groups to Task Template', async () => {
        let templateData, randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            templateData = {
                "templateName": `manualTaskTemplate1 ${randomStr}`,
                "templateSummary": `manualTaskTemplateSummary1 ${randomStr}`,
                "templateStatus": "Draft",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            let newTaskTemplate = await apiHelper.createManualTaskTemplate(templateData);
            await apiHelper.createDynamicDataOnTemplate(newTaskTemplate.id, 'CASE_TEMPLATE_WITH_REQUESTER');
            templateData.templateName = `manualTaskTemplateActive ${randomStr}`;
            templateData.templateStatus = "Active";
            await apiHelper.createManualTaskTemplate(templateData);
        });
        it('[DRDMV-13139]: [Dynamic Data]- Add Dynamic Fields and Groups to Task Template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.searchAndOpenTaskTemplate(templateData.templateName);
            expect(await viewTaskTemplate.isManageDynamicFieldLinkDisplayed()).toBeFalsy();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.searchAndOpenTaskTemplate(`manualTaskTemplate1 ${randomStr}`);
            expect(await viewTaskTemplate.isDynamicFieldPresent('FieldGroup1')).toBeTruthy();
            expect(await viewTaskTemplate.isDynamicFieldPresent('Field2Group1')).toBeTruthy();
            expect(await viewTaskTemplate.isDynamicFieldPresent('Field2Group2')).toBeTruthy();
            expect(await viewTaskTemplate.isDynamicFieldPresent('FieldGroup2')).toBeTruthy();
            await viewTaskTemplate.clickOnManageDynamicFieldLink();
            expect(await dynamicFieldsPage.isDynamicFieldDisplayed()).toBeTruthy();
            expect(await dynamicFieldsPage.isAddDynamicGroupDisplayed()).toBeTruthy();
        });
        it('[DRDMV-13139]: [Dynamic Data]- Add Dynamic Fields and Groups to Task Template', async () => {
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
        });
    });

    //ankagraw
    describe('[DRDMV-22354]: [PDF Config] - Date Time common config are available OOB and BA can add remove config', async () => {
        it('[DRDMV-22354]: [PDF Config] - Date Time common config are available OOB and BA can add remove config', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Common Configurations', 'Common Configurations - Business Workflows');
            await applicationConfigPo.clickApplicationConfiguration('DATE_TIME_FORMAT');
            expect(await applicationConfigPo.getconfigurationHeaderValue()).toContain('DATE_TIME_FORMAT');
            await applicationConfigPo.clickConfigurationDropDownArrow();
            expect(await applicationConfigPo.getColoumnValue()).toContain('dd MMM yyyy hh:mm:ss a');
            await applicationConfigPo.clickAddConfigurationValue();
            await applicationConfigPo.setConfigurationValueText("test 1");
            await applicationConfigPo.selectCompany('Petramco');
            await applicationConfigPo.clickSaveButton();
        });
        it('[DRDMV-22354]: [PDF Config] - Date Time common config are available OOB and BA can add remove config', async () => {
            expect(await applicationConfigPo.getColoumnValue()).toContain('test 1');
            await applicationConfigPo.clickRemoveButton();
            await utilCommon.clickOnWarningOk();
            await applicationConfigPo.clickAddConfigurationValue();
            await applicationConfigPo.setConfigurationValueText("test 2");
            await applicationConfigPo.selectCompany('- Global -');
            await applicationConfigPo.clickSaveButton();
            expect(await applicationConfigPo.getColoumnValue()).toContain('test 2');
            await applicationConfigPo.clickRemoveButton();
            await utilCommon.clickOnWarningOk();
        });

        it('[DRDMV-22354]: [PDF Config] - Date Time common config are available OOB and BA can add remove config', async () => {
            await applicationConfigPo.clickApplicationConfiguration('DATE_FORMAT');
            expect(await applicationConfigPo.getconfigurationHeaderValue()).toContain('DATE_FORMAT');
            await applicationConfigPo.clickConfigurationDropDownArrow();
            expect(await applicationConfigPo.getColoumnValue()).toContain('dd MMM yyyy');
            await applicationConfigPo.clickAddConfigurationValue();
            await applicationConfigPo.setConfigurationValueText("test 1");
            await applicationConfigPo.selectCompany('Petramco');
            await applicationConfigPo.clickSaveButton();
        });
        it('[DRDMV-22354]: [PDF Config] - Date Time common config are available OOB and BA can add remove config', async () => {
            expect(await applicationConfigPo.getColoumnValue()).toContain('test 1');
            await applicationConfigPo.clickRemoveButton();
            await utilCommon.clickOnWarningOk();
            await applicationConfigPo.clickAddConfigurationValue();
            await applicationConfigPo.setConfigurationValueText("test 2");
            await applicationConfigPo.selectCompany('- Global -');
            await applicationConfigPo.clickSaveButton();
            expect(await applicationConfigPo.getColoumnValue()).toContain('test 2');
            await applicationConfigPo.clickRemoveButton();
            await utilCommon.clickOnWarningOk();
        });

        it('[DRDMV-22354]: [PDF Config] - Date Time common config are available OOB and BA can add remove config', async () => {
            await applicationConfigPo.clickApplicationConfiguration('ZONE_ID');
            expect(await applicationConfigPo.getconfigurationHeaderValue()).toContain('ZONE_ID');
            await applicationConfigPo.clickConfigurationDropDownArrow();
            expect(await applicationConfigPo.getColoumnValue()).toContain('UTC');
            await applicationConfigPo.clickAddConfigurationValue();
            await applicationConfigPo.setConfigurationValueText("test 1");
            await applicationConfigPo.selectCompany('Petramco');
            await applicationConfigPo.clickSaveButton();
        });
        it('[DRDMV-22354]: [PDF Config] - Date Time common config are available OOB and BA can add remove config', async () => {
            expect(await applicationConfigPo.getColoumnValue()).toContain('test 1');
            await applicationConfigPo.clickRemoveButton();
            await utilCommon.clickOnWarningOk();
            await applicationConfigPo.clickAddConfigurationValue();
            await applicationConfigPo.setConfigurationValueText("test 2");
            await applicationConfigPo.selectCompany('- Global -');
            await applicationConfigPo.clickSaveButton();
            expect(await applicationConfigPo.getColoumnValue()).toContain('test 2');
            await applicationConfigPo.clickRemoveButton();
            await utilCommon.clickOnWarningOk();
        });
    });

    //ptidke
    describe('[DRDMV-13136]: [-ve] [Dynamic Data] - Case with large no. of Dynamic fields', async () => {
        let casetemplateData, randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();

            casetemplateData = {
                "templateName": randomStr + 'caseTemplateDRDMV-13136',
                "templateSummary": randomStr + 'caseTemplateSummaryDRDMV-13136',
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
        it('[DRDMV-13136]: Create a case and add cae template on it', async () => {
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('qkatawazi');
            await quickCasePo.selectCaseTemplate(casetemplateData.templateName);
            await quickCasePo.createCaseButton();
            await quickCasePo.gotoCaseButton();
        });
        it('[DRDMV-13136]: Validate the dymaic field with values', async () => {
            //verify fields shoule be empty values on case view
            let arr: string[] = ['text1', 'text2', 'text3', 'text3', 'text4', 'text5', 'text6', 'text7', 'text8', 'text9', 'text10', 'text11', 'text12', 'text13', 'text14','text15', 'attachment1', 'attachment2', 'attachment3', 'attachment4', 'attachment5', 'attachment6', 'attachment7', 'attachment8', 'attachment9', 'attachment10'];
            for (let i = 0; i < arr.length; i++) {
                expect(await viewCasePo.isDynamicFieldDisplayed(arr[i])).toBeTruthy('field not present');
            }
        });
        it('[DRDMV-13136]: Validate the dymaic field with values', async () => {
            //verify fields shoule be empty values on case view
            let arr: string[] = ['boolean1', 'boolean2', 'boolean3', 'boolean4', 'boolean4', 'boolean5', 'boolean6', 'boolean7', 'boolean8', 'boolean9', 'boolean10','boolean12','boolean12','boolean13','boolean14','boolean15', 'time1', 'time2', 'time3', 'time4', 'time5', 'time6', 'time7', 'time8', 'time9', 'time10'];
            for (let i = 0; i < arr.length; i++) {
                expect(await viewCasePo.isDynamicFieldDisplayed(arr[i])).toBeTruthy(arr[i]+'field not present');
            }

        });
        it('[DRDMV-13136]: Validate the dymaic field with values', async () => {
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
        it('[DRDMV-13136]: Validate the dymaic field with values', async () => {
            //verify fields shoule be empty values on case view
            let arr: string[] = ['date1', 'date2', 'date3', 'date4', 'date5', 'date6', 'date7', 'date8', 'date9', 'date10', 'date11', 'date12', 'date13', 'date14', 'date15', 'datetime1', 'datetime2', 'datetime3', 'datetime4', 'datetime5', 'datetime6', 'datetime7', 'datetime8', 'datetime9', 'datetime10', 'datetime11', 'datetime12', 'datetime13', 'datetime14', 'datetime15'];
            for (let i = 0; i < arr.length; i++) {
                expect(await viewCasePo.isDynamicFieldDisplayed(arr[i])).toBeTruthy(arr[i]+'field not present');
            }
        });
        it('[DRDMV-13136]: Validate the dymaic field with values', async () => {
            //verify fields shoule be empty values on case view
            let arr: string[] = ['number1', 'number2', 'number3', 'number4', 'number5', 'number6', 'number7', 'number8', 'number9', 'number10', 'number11', 'number12', 'number13', 'number14', 'number15'];
            for (let i = 0; i < arr.length; i++) {
                expect(await viewCasePo.isDynamicFieldDisplayed(arr[i])).toBeTruthy(arr[i]+'field not present');
            }
        });
        it('[DRDMV-13136]: Validate the dymaic field with values', async () => {
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