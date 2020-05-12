import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import { default as casePreviewPo, default as previewCasePo } from '../../pageobject/case/case-preview.po';
import { default as createCasePage, default as createCasePo } from '../../pageobject/case/create-case.po';
import editCasePo from '../../pageobject/case/edit-case.po';
import quickCasePo from '../../pageobject/case/quick-case.po';
import requesterResponseBladePo from '../../pageobject/case/requester-response-blade.po';
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import { default as viewCasePage, default as viewCasePo } from "../../pageobject/case/view-case.po";
import { default as dynamicFieldsPage, default as dynamicFieldsPo } from '../../pageobject/common/dynamic-fields.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import editCasetemplatePo from '../../pageobject/settings/case-management/edit-casetemplate.po';
import previewCaseTemplateCasesPo from '../../pageobject/settings/case-management/preview-case-template-cases.po';
import viewCasetemplatePo from '../../pageobject/settings/case-management/view-casetemplate.po';
import selectTaskTemplate from "../../pageobject/settings/task-management/console-tasktemplate.po";
import createTaskTemplate from "../../pageobject/settings/task-management/create-tasktemplate.po";
import editTaskTemplate from "../../pageobject/settings/task-management/edit-tasktemplate.po";
import viewTaskTemplate from "../../pageobject/settings/task-management/view-tasktemplate.po";
import editTaskPo from '../../pageobject/task/edit-task.po';
import manageTask from "../../pageobject/task/manage-task-blade.po";
import viewTaskPo from '../../pageobject/task/view-task.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilGrid from '../../utils/util.grid';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';
import manageTaskBladePo from '../../pageobject/task/manage-task-blade.po';
import previewTaskTemplateCasesPo from '../../pageobject/settings/task-management/preview-task-template-cases.po';

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

    //ptidke
    it('[DRDMV-13123]:[Dynamic Data] [UI] - Dynamic Fields display on Case Edit view UI', async () => {
        try {
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            let caseTemplateName = randomStr + 'caseTemplateDRDMV-13123';
            let caseTemaplateSummary = randomStr + 'caseTemplateDRDMV-13123';
            let casetemplateData = {
                "templateName": `${caseTemplateName}`,
                "templateSummary": `${caseTemaplateSummary}`,
                "templateStatus": "Active",
            }
            await apiHelper.apiLogin('fritz');
            let newCaseTemplate = await apiHelper.createCaseTemplate(casetemplateData);
            await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'CASE_TEMPLATE_DYNAMIC_FIELDS');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qkatawazi');
            await createCasePo.setSummary('new cases');
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.isDynamicFieldDisplayed('temp')).toBeTruthy('temp dynamic fields not present');
            expect(await viewCasePo.isDynamicFieldDisplayed('temp1')).toBeTruthy('temp1 dynamic fields not present');
            expect(await viewCasePo.isDynamicFieldDisplayed('temp2')).toBeTruthy('temp2 dynamic fields not present');
            expect(await viewCasePo.isDynamicFieldDisplayed('temp3')).toBeTruthy('temp3 dynamic fields not present');
            expect(await viewCasePo.isDynamicFieldDisplayed('temp4')).toBeTruthy('temp4 dynamic fields not present');
            expect(await viewCasePo.isDynamicFieldDisplayed('temp5')).toBeTruthy('temp5 dynamic fields not present');
            expect(await viewCasePo.isDynamicFieldDisplayed('attachment1')).toBeTruthy('attachment1 dynamic fields not present');
            expect(await viewCasePo.isDynamicFieldDisplayed('attachment2')).toBeTruthy('attachment2 dynamic fields not present');
            expect(await viewCasePo.isDynamicFieldDisplayed('attachment3')).toBeTruthy('attachment3 dynamic fields not present');
            expect(await viewCasePo.isDynamicFieldDisplayed('dynamicList')).toBeTruthy('dynamicList dynamic fields not present');
            await viewCasePo.clickEditCaseButton();
            expect(await editCasePo.isDynamicFieldDisplayed('temp')).toBeTruthy('temp dynamic fields not present');
            expect(await editCasePo.isDynamicFieldDisplayed('temp1')).toBeTruthy('temp1 dynamic fields not present');
            expect(await editCasePo.isDynamicFieldDisplayed('temp2')).toBeTruthy('temp2 dynamic fields not present');
            expect(await editCasePo.isDynamicFieldDisplayed('temp3')).toBeTruthy('temp3 dynamic fields not present');
            expect(await editCasePo.isDynamicFieldDisplayed('temp4')).toBeTruthy('temp4 dynamic fields not present');
            expect(await editCasePo.isDynamicFieldDisplayed('temp5')).toBeTruthy('temp5 dynamic fields not present');
            expect(await editCasePo.isDynamicFieldDisplayed('attachment1')).toBeTruthy('attachment1 dynamic fields not present');
            expect(await editCasePo.isDynamicFieldDisplayed('attachment2')).toBeTruthy('attachment2 dynamic fields not present');
            expect(await editCasePo.isDynamicFieldDisplayed('attachment3')).toBeTruthy('attachment3 dynamic fields not present');
            expect(await editCasePo.isDynamicFieldDisplayed('dynamicList')).toBeTruthy('dynamicList dynamic fields not present');
            await editCasePo.clickOnCancelCaseButton();
            await navigationPage.gotoCaseConsole();
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        }
    }, 250 * 1000);

    //ptidke
    it('[DRDMV-13126]:[Dynamic Data] - Create Case from Quick Case with Template having dynamic fields and also have field with source as Requester', async () => {
        try {
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            let caseTemplateName = randomStr + 'caseTemplateDRDMV-13126';
            let caseTemaplateSummary = randomStr + 'caseTemplateDRDMV-13126';
            let casetemplateData = {
                "templateName": `${caseTemplateName}`,
                "templateSummary": `${caseTemaplateSummary}`,
                "templateStatus": "Active",
            }
            await apiHelper.apiLogin('fritz');
            let newCaseTemplate = await apiHelper.createCaseTemplate(casetemplateData);
            await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'CASE_TEMPLATE_REQUESTER_DYNAMIC_FIELDS');
            await navigationPage.gotoCaseConsole();
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qkatawazi');
            await createCasePo.setSummary('new cases');
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
            await createCasePo.clickSaveCaseButton();
            expect(await requesterResponseBladePo.getBladeHeading()).toContain("Requester's Response");
            expect(await requesterResponseBladePo.isDynamicFieldDisplayed('temp')).toBeTruthy('field not present');
            expect(await requesterResponseBladePo.isDynamicFieldDisplayed('temp1')).toBeTruthy('field not present');
            expect(await requesterResponseBladePo.isDynamicFieldDisplayed('temp2')).toBeTruthy('field not present');
            expect(await requesterResponseBladePo.isDynamicFieldDisplayed('temp3')).toBeTruthy('field not present');
            expect(await requesterResponseBladePo.isDynamicFieldDisplayed('temp4')).toBeTruthy('field not present');
            expect(await requesterResponseBladePo.isDynamicFieldDisplayed('temp5')).toBeTruthy('field not present');
            expect(await requesterResponseBladePo.isDynamicFieldDisplayed('dynamicList')).toBeTruthy('field not present');
            expect(await requesterResponseBladePo.isDynamicFieldDisplayed('attachment1')).toBeFalsy('field is present');
            expect(await requesterResponseBladePo.isDynamicFieldDisplayed('temp6')).toBeTruthy('field not present');
            expect(await requesterResponseBladePo.isDynamicFieldDisplayed('temp7')).toBeTruthy('field not present');
            expect(await requesterResponseBladePo.isDynamicFieldDisplayed('temp8')).toBeTruthy('field not present');
            expect(await requesterResponseBladePo.isDynamicFieldDisplayed('temp9')).toBeTruthy('field not present');
            expect(await requesterResponseBladePo.isDynamicFieldDisplayed('temp10')).toBeTruthy('field not present');
            expect(await requesterResponseBladePo.isDynamicFieldDisplayed('temp11')).toBeTruthy('field not present');
            expect(await requesterResponseBladePo.isDynamicFieldDisplayed('temp12')).toBeTruthy('field not present');
            await requesterResponseBladePo.clickOkButton();
            await quickCasePo.gotoCaseButton();
            //verify fields shoule be empty values on case view
            //https://jira.bmc.com/browse/DRDMV-21677
            expect(await viewCasePo.getValueOfDynamicFields('temp')).toBe('-');
            expect(await viewCasePo.getValueOfDynamicFields('temp1')).toBe('-');
            expect(await viewCasePo.getValueOfDynamicFields('temp2')).toBe('-');
            expect(await viewCasePo.getValueOfDynamicFields('temp4')).toBe('-');
            expect(await viewCasePo.getValueOfDynamicFields('temp3')).toBe('-');
            expect(await viewCasePo.getValueOfDynamicFields('temp5')).toBe('-');
            expect(await viewCasePo.getValueOfDynamicFields('dynamicList')).toBe('-');
            expect(await viewCasePo.getValueOfDynamicFields('attachment1')).toBe('-');
            expect(await viewCasePo.getValueOfDynamicFields('temp6')).toBe('-');
            expect(await viewCasePo.getValueOfDynamicFields('temp7')).toBe('-');
            expect(await viewCasePo.getValueOfDynamicFields('temp8')).toBe('-');
            expect(await viewCasePo.getValueOfDynamicFields('temp9')).toBe('-');
            expect(await viewCasePo.getValueOfDynamicFields('temp10')).toBe('-');
            expect(await viewCasePo.getValueOfDynamicFields('temp11')).toBe('-');
            expect(await viewCasePo.getValueOfDynamicFields('temp12')).toBe('-');
        } catch (e) { throw e }
        finally {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        }
    }, 290 * 1000);

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

    //ptidke
    it('[DRDMV-13115]:[Dynamic Data] - Update Dynamic fields in Existing Case Template by replacing old fields with new Fields', async () => {
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDynamicFieldAndGroup();
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateName = 'caseTemplateName13115' + randomStr;
        let casTemplateSummary = 'CaseSummarySummary13115' + randomStr;
        let templateData = {
            "templateName": `${caseTemplateName}`,
            "templateSummary": `${casTemplateSummary}`,
            "templateStatus": "Draft",
            "resolveCaseonLastTaskCompletion": "1",
            "assignee": "Fritz",
            "company": "Petramco",
            "supportGroup": "Facilities",
            "ownerGroup": "Facilities"
        }
        await apiHelper.apiLogin('qkatawazi');
        let newCaseTemplate = await apiHelper.createCaseTemplate(templateData);
        await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'CASE_TEMPLATE_REMOVE_FIELDS');
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        await utilGrid.searchAndOpenHyperlink(caseTemplateName);
        await viewCasetemplatePo.clickOnMangeDynamicFieldLink();
        //field in right section
        expect(await dynamicFieldsPo.isFieldDisplayedInFieldSection('temp')).toBeTruthy();
        expect(await dynamicFieldsPo.isFieldDisplayedInFieldSection('temp1')).toBeTruthy();
        expect(await dynamicFieldsPo.isFieldDisplayedInFieldSection('temp2')).toBeTruthy();
        //remove field
        await dynamicFieldsPo.removeField('temp');
        await dynamicFieldsPo.removeField('temp1');
        await dynamicFieldsPo.removeField('temp2');
        await dynamicFieldsPo.clickSaveButton();
        //add new fields
        await viewCasetemplatePo.clickOnMangeDynamicFieldLink();
        await dynamicFieldsPo.clickOnDynamicField();
        await dynamicFieldsPo.setFieldName('news12' + randomStr);
        await dynamicFieldsPo.setDescriptionName('newDescri12' + randomStr);
        await dynamicFieldsPo.clickOnDynamicField();
        await dynamicFieldsPo.setFieldName('news13' + randomStr);
        await dynamicFieldsPo.setDescriptionName('newDescri13' + randomStr);
        await dynamicFieldsPo.clickOnDynamicField();
        await dynamicFieldsPo.setFieldName('news14' + randomStr);
        await dynamicFieldsPo.setDescriptionName('newDescri14' + randomStr);
        await dynamicFieldsPo.clickSaveButton();
        expect(await viewCasetemplatePo.isDynamicFieldDisplayed('newDescri12' + randomStr)).toBeTruthy();
        expect(await viewCasetemplatePo.isDynamicFieldDisplayed('newDescri13' + randomStr)).toBeTruthy();
        expect(await viewCasetemplatePo.isDynamicFieldDisplayed('newDescri14' + randomStr)).toBeTruthy();
    });//, 180 * 1000);

    //ptidke
    it('[DRDMV-13118]:[Dynamic Data] - Case Template and Case UI with dynamic fields and groups having long title', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateName = 'caseTemplateName13118' + randomStr;
        let casTemplateSummary = 'CaseSummarySummary13118' + randomStr;
        let groupName = 'GroupLocalCaseTemplateGroupLocalCaseTemplateLocalCaseTemplate';
        let field1InGroup = 'LocalNonConfidentialDescLocalNonConfidentialDescLocalNonConfidentialDesc';
        let field2InGroup = 'LocalConfidentialDescLocalConfidentialDescLocalNonConfidentialDesc';
        let field1OutSideGroup = 'theautomatedDynamicFieldsIsgettingMouseOveredMouseOvered';
        let field2OutSideGroup = 'theSecondautomatedDynamicFieldsIsgettingMouseOveredMouseOvered';
        let field3OutSideGroup = 'theThirdDynamicautomatedFieldsIsgettingMouseOveredMouseOvered';
        let field4OutSideGroup = 'temp1theNewautomatedDynamicFieldsIsgettingMouseOveredMouseOvered';
        let templateData = {
            "templateName": `${caseTemplateName}`,
            "templateSummary": `${casTemplateSummary}`,
            "templateStatus": "Draft",
            "resolveCaseonLastTaskCompletion": "1",
            "assignee": "Fritz",
            "company": "Petramco",
            "supportGroup": "Facilities",
            "ownerGroup": "Facilities"
        }
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDynamicFieldAndGroup();
        await apiHelper.apiLogin('qkatawazi');
        let newCaseTemplate = await apiHelper.createCaseTemplate(templateData);
        await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'CASE_TEMPLATE_LONG_FIELDS');
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        await utilGrid.searchAndOpenHyperlink(caseTemplateName);
        expect(await viewCasetemplatePo.isGroupDisplayed(groupName)).toBeTruthy('Group Not found');
        expect(await viewCasetemplatePo.isDynamicFieldDisplayed(field1InGroup)).toBeTruthy();
        expect(await viewCasetemplatePo.isDynamicFieldDisplayed(field2InGroup)).toBeTruthy();
        expect(await viewCasetemplatePo.isDynamicFieldDisplayed(field1OutSideGroup)).toBeTruthy();
        expect(await viewCasetemplatePo.isDynamicFieldDisplayed(field2OutSideGroup)).toBeTruthy();
        expect(await viewCasetemplatePo.isDynamicFieldDisplayed(field3OutSideGroup)).toBeTruthy();
        expect(await viewCasetemplatePo.isDynamicFieldDisplayed(field4OutSideGroup)).toBeTruthy();
        //active template 
        await viewCasetemplatePo.clickEditTemplateMetaData();
        await editCasetemplatePo.changeTemplateStatusDropdownValue('Active');
        await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
        await navigationPage.gotoCreateCase();
        await createCasePo.selectRequester('qtao');
        await createCasePo.setSummary('Summary');
        await createCasePo.clickSelectCaseTemplateButton();
        await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
        await createCasePo.clickAssignToMeButton();
        await createCasePo.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        await utilityCommon.waitUntilPopUpDisappear();
        //edit case
        await viewCasePo.clickEditCaseButton();
        await editCasePo.setDynamicFieldValue(field1InGroup, 'New values for field 1 group');
        await editCasePo.setDynamicFieldValue(field2InGroup, '8888899');
        await editCasePo.clickOnTrueValueOfDynamicField();
        await editCasePo.setDynamicFieldValue(field1OutSideGroup, 'field1 outside group');
        await editCasePo.setDynamicFieldValue(field2OutSideGroup, '809888');
        await editCasePo.clickSaveCase();
        //field on case profile
        expect(await viewCasePo.isDynamicFieldDisplayed(field4OutSideGroup)).toBeTruthy('field not present');
        expect(await viewCasePo.isDynamicFieldDisplayed(field3OutSideGroup)).toBeTruthy('field not present');
        expect(await viewCasePo.isDynamicFieldDisplayed(field2OutSideGroup)).toBeTruthy('field not present');
        expect(await viewCasePo.isDynamicFieldDisplayed(field1OutSideGroup)).toBeTruthy('field not present');
        expect(await viewCasePo.isGroupNameDisplayed(groupName)).toBeTruthy('group not present');
        expect(await viewCasePo.isDynamicFieldDisplayed(field1InGroup)).toBeTruthy('field not present');
        expect(await viewCasePo.isDynamicFieldDisplayed(field2InGroup)).toBeTruthy('field not present');
        //entered field validation
        expect(await viewCasePo.getValueOfDynamicFields(field1InGroup)).toBe('New values for field 1 group');
        expect(await viewCasePo.getValueOfDynamicFields(field2InGroup)).toBe('8888899');
        expect(await viewCasePo.getValueOfDynamicFields(field4OutSideGroup)).toBe('True');
        expect(await viewCasePo.getValueOfDynamicFields(field1OutSideGroup)).toBe('field1 outside group');
        expect(await viewCasePo.getValueOfDynamicFields(field2OutSideGroup)).toBe('809888');
    }, 300 * 1000);

    //ptidke
    it('[DRDMV-13140]:[Dynamic Data] [UI] -Dynamic Fields display on Task Template Edit view UI', async () => {
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDynamicFieldAndGroup();
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let arr: string[] = ['temp', 'temp1', 'temp2', 'temp3', 'temp4', 'temp5', 'attachment1', 'attachment2', 'attachment3']
        //Draft to active
        let taskTemplateNameDraft = 'ManualtaskDraftDRDMV-13940' + randomStr;
        let manualTaskSummaryDraft = 'ManualSummaryDraftDRDMV-13940' + randomStr;
        let templateData = {
            "templateName": `${taskTemplateNameDraft}`,
            "templateSummary": `${manualTaskSummaryDraft}`,
            "templateStatus": "Draft",
        }
        await apiHelper.apiLogin('qkatawazi');
        let tasktemplate = await apiHelper.createManualTaskTemplate(templateData);
        await apiHelper.createDynamicDataOnTemplate(tasktemplate.id, 'TASK_TEMPLATE__DYNAMIC_FIELDS');
        //Inactive
        let taskTemplateNameOne = 'ManualtaskInactiveDRDMV-13940' + randomStr;
        let manualTaskSummaryOne = 'ManualSummaryInactiveDRDMV-13940' + randomStr;
        let templateDataInactive = {
            "templateName": `${taskTemplateNameOne}`,
            "templateSummary": `${manualTaskSummaryOne}`,
            "templateStatus": "Inactive",
        }
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDynamicFieldAndGroup();
        await apiHelper.apiLogin('qkatawazi');
        let tasktemplateInactive = await apiHelper.createManualTaskTemplate(templateDataInactive);
        await apiHelper.createDynamicDataOnTemplate(tasktemplateInactive.id, 'TASK_TEMPLATE__DYNAMIC_FIELDS');
        //Draft only
        let taskTemplateNameDraftOnly = 'ManualtaskDraftOnlyDRDMV-13940' + randomStr;
        let manualTaskSummaryDraftOnly = 'ManualSummaryDraftOnlyDRDMV-13940' + randomStr;
        let templateDataDraft = {
            "templateName": `${taskTemplateNameDraftOnly}`,
            "templateSummary": `${manualTaskSummaryDraftOnly}`,
            "templateStatus": "Draft",
        }
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDynamicFieldAndGroup();
        await apiHelper.apiLogin('qkatawazi');
        let tasktemplateDraft = await apiHelper.createManualTaskTemplate(templateDataDraft);
        await apiHelper.createDynamicDataOnTemplate(tasktemplateDraft.id, 'TASK_TEMPLATE__DYNAMIC_FIELDS');
        //active
        let taskTemplateName = 'ManualtaskActiveDRDMV-13940' + randomStr;
        let manualTaskSummary = 'ManualSummaryActiveDRDMV-13940' + randomStr;
        let templateDataActive = {
            "templateName": `${taskTemplateName}`,
            "templateSummary": `${manualTaskSummary}`,
            "templateStatus": "Active",
        }
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDynamicFieldAndGroup();
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createManualTaskTemplate(templateDataActive);
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await utilGrid.searchAndOpenHyperlink(taskTemplateName);
        expect(await viewTaskPo.isDynamicFieldSectionPresent()).toBeFalsy('fields are present');
        //draft to active
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await utilGrid.searchAndOpenHyperlink(taskTemplateNameDraft);
        await viewTaskTemplate.clickOnEditMetaData();
        await editTaskTemplate.selectTemplateStatus('Active');
        await editTaskTemplate.clickOnSaveMetadata();
        for (let i = 0; i < arr.length; i++) {
            expect(await viewTaskTemplate.isDynamicFieldPresent(arr[i])).toBeTruthy('field is not present');
        }
        expect(await viewTaskTemplate.isManageDynamicFieldLinkDisplayed()).toBeFalsy('Link is present');
        //draft only
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await utilGrid.searchAndOpenHyperlink(taskTemplateNameDraftOnly);
        for (let i = 0; i < arr.length; i++) {
            expect(await viewTaskTemplate.isDynamicFieldPresent(arr[i])).toBeTruthy('field is not present');
        }
        expect(await viewTaskTemplate.isManageDynamicFieldLinkDisplayed()).toBeTruthy('Link is not present');
        //edit
        await viewTaskTemplate.clickOnEditLink();
        expect(await editTaskTemplate.isMangeDynamicFieldLinkDisplayed()).toBeTruthy('link not present');
        for (let i = 0; i < arr.length; i++) {
            expect(await editTaskTemplate.isDynamicFieldPresent(arr[i])).toBeTruthy('field is not present');
        }
        //Inactive
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await utilGrid.searchAndOpenHyperlink(taskTemplateNameOne);
        for (let i = 0; i < arr.length; i++) {
            expect(await viewTaskTemplate.isDynamicFieldPresent(arr[i])).toBeTruthy('field is not present');
        }
        expect(await viewTaskTemplate.isManageDynamicFieldLinkDisplayed()).toBeTruthy('Link is not present');
        //edit
        await viewTaskTemplate.clickOnEditLink();
        expect(await editTaskTemplate.isMangeDynamicFieldLinkDisplayed()).toBeTruthy('link not present');
        for (let i = 0; i < arr.length; i++) {
            expect(await editTaskTemplate.isDynamicFieldPresent(arr[i])).toBeTruthy('field is not present');
        }
    }, 360 * 1000);

    //ptidke
    it('[DRDMV-13122]:[Dynamic Data] [UI] - Dynamic fields and groups display on Case Template preview', async () => {
        try {
            let group1 = 'GroupLocalCaseTemplate';
            let group2 = 'PulishCaseTemplateData';
            let dynamicFields: string[] = ['LocalNonConfidentialDesc', 'LocalConfidentialDesc', 'nonConfidentialPulicDesc', 'confidentialPublicDesc', 'OuterNonConfidentialDesc', 'ListOfDataNameDesc', 'OuterConfidentialDesc'];
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            let caseTemplateName = randomStr + 'caseTemplateDRDMV-13122';
            let caseTemaplateSummary = randomStr + 'caseTemplateDRDMV-13122';
            let casetemplateData = {
                "templateName": `${caseTemplateName}`,
                "templateSummary": `${caseTemaplateSummary}`,
                "templateStatus": "Active",
            }
            await apiHelper.apiLogin('fritz');
            let newCaseTemplate = await apiHelper.createCaseTemplate(casetemplateData);
            await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'CASE_TEMPLATE_WITH_CONFIDENTIAL');
            //qucik case preview
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('qkatawazi');
            await quickCasePo.selectCaseTemplate(caseTemplateName);
            await quickCasePo.clickOnCaseTemplate(caseTemplateName);
            expect(await previewCaseTemplateCasesPo.isGroupDisplayed(group1)).toBeTruthy('group is not present');
            expect(await previewCaseTemplateCasesPo.isGroupDisplayed(group2)).toBeTruthy('group is not present');
            for (let i = 0; i < dynamicFields.length; i++) {
                expect(await previewCaseTemplateCasesPo.isDynamicFieldDisplayed(dynamicFields[i])).toBeTruthy('field not present ' + dynamicFields[i]);
            }
            await previewCaseTemplateCasesPo.clickOnBackButton();
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qkatawazi');
            await createCasePo.setSummary(caseTemaplateSummary);
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.clickOnCaseTemplate(caseTemplateName);
            //verify dynmaic groups and fields
            expect(await previewCaseTemplateCasesPo.isGroupDisplayed(group1)).toBeTruthy('group is not present');
            expect(await previewCaseTemplateCasesPo.isGroupDisplayed(group2)).toBeTruthy('group is not present');
            for (let i = 0; i < dynamicFields.length; i++) {
                expect(await previewCaseTemplateCasesPo.isDynamicFieldDisplayed(dynamicFields[i])).toBeTruthy('field not present ' + dynamicFields[i]);
            }
            await previewCaseTemplateCasesPo.clickOnBackButton();
            await selectCasetemplateBladePo.clickOnAllTemplateTab();
            await utilityGrid.searchAndOpenHyperlink(caseTemplateName);
            //verify dynmaic groups and fields
            expect(await previewCaseTemplateCasesPo.isGroupDisplayed(group1)).toBeTruthy('group is not present');
            expect(await previewCaseTemplateCasesPo.isGroupDisplayed(group2)).toBeTruthy('group is not present');
            for (let i = 0; i < dynamicFields.length; i++) {
                expect(await previewCaseTemplateCasesPo.isDynamicFieldDisplayed(dynamicFields[i])).toBeTruthy('field not present ' + dynamicFields[i]);
            }
            await previewCaseTemplateCasesPo.clickOnBackButton();
            await utilityCommon.refresh();
            await navigationPage.gotoCaseConsole();
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        }
    }, 360 * 1000);

    //ptidke
    it('[DRDMV-13131]:[Dynamic Data] [UI] - Dynamic Fields and Groups display on Case and Similar Cases preview', async () => {
        try {
            let group1 = 'GroupLocalCaseTemplate';
            let group2 = 'PulishCaseTemplateData';
            let dynamicFields: string[] = ['LocalNonConfidentialDesc', 'LocalConfidentialDesc', 'nonConfidentialPulicDesc', 'confidentialPublicDesc', 'OuterNonConfidentialDesc', 'ListOfDataNameDesc', 'OuterConfidentialDesc'];
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            let caseTemplateName = randomStr + 'caseTemplateDRDMV-13131';
            let caseTemaplateSummary = randomStr + 'caseTemplateSummaryDRDMV-13131';
            let casetemplateData = {
                "templateName": `${caseTemplateName}`,
                "templateSummary": `${caseTemaplateSummary}`,
                "templateStatus": "Active",
            }
            await apiHelper.apiLogin('fritz');
            let newCaseTemplate = await apiHelper.createCaseTemplate(casetemplateData);
            await apiHelper.createDynamicDataOnTemplate(newCaseTemplate.id, 'CASE_TEMPLATE_WITH_CONFIDENTIAL');
            //qucik case preview
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('qkatawazi');
            await quickCasePo.selectCaseTemplate(caseTemplateName);
            await quickCasePo.createCaseButton();
            //case preview
            // await utilityCommon.waitUntilSpinnerToHide();
            expect(await casePreviewPo.isGroupDisplayed(group1)).toBeTruthy('group is not present');
            expect(await casePreviewPo.isGroupDisplayed(group2)).toBeTruthy('group is not present');
            for (let i = 0; i < dynamicFields.length; i++) {
                expect(await casePreviewPo.isDynamicFieldDisplayed(dynamicFields[i])).toBeTruthy('field not present ' + dynamicFields[i]);
            }
            await quickCasePo.gotoCaseButton();
            let caseID = await viewCasePo.getCaseID();
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('qkatawazi');
            await quickCasePo.setSummaryAndClickOnRecommandedCase(caseID, caseTemplateName);
            //case preview
            // await utilCommon.waitUntilSpinnerToHide();
            expect(await casePreviewPo.isGroupDisplayed(group1)).toBeTruthy('group is not present');
            expect(await casePreviewPo.isGroupDisplayed(group2)).toBeTruthy('group is not present');
            for (let i = 0; i < dynamicFields.length; i++) {
                expect(await casePreviewPo.isDynamicFieldDisplayed(dynamicFields[i])).toBeTruthy('field not present ' + dynamicFields[i]);
            }
            await casePreviewPo.clickBackButton();
            // requester case template
            let caseTemplateNameWithRequester = randomStr + 'caseTemplateReqDRDMV-13131';
            let caseTemaplateSummaryRequester = randomStr + 'caseTemplateReqDRDMV-13131';
            let casetemplateDataRequester = {
                "templateName": `${caseTemplateNameWithRequester}`,
                "templateSummary": `${caseTemaplateSummaryRequester}`,
                "templateStatus": "Active",
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();
            await apiHelper.apiLogin('fritz');
            let newCaseTemplateReq = await apiHelper.createCaseTemplate(casetemplateDataRequester);
            await apiHelper.createDynamicDataOnTemplate(newCaseTemplateReq.id, 'CASE_TEMPLATE_WITH_REQUESTER');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qkatawazi');
            await createCasePo.setSummary('new cases');
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateNameWithRequester);
            await createCasePo.clickSaveCaseButton();
            expect(await requesterResponseBladePo.getBladeHeading()).toContain("Requester's Response");
            expect(requesterResponseBladePo.isDynamicGroupDisplayed('GroupOne'));
            expect(requesterResponseBladePo.isDynamicGroupDisplayed('GroupTwo'));
            let dynamicFieldsReqester: string[] = ['FieldGroup1', 'Field2Group1', 'FieldGroup2', 'Field2Group2', 'Field1Outside'];
            for (let i = 0; i < dynamicFieldsReqester.length; i++) {
                expect(await requesterResponseBladePo.isDynamicFieldDisplayed(dynamicFieldsReqester[i])).toBeTruthy(dynamicFieldsReqester[i] + 'field not present');
            }
            await requesterResponseBladePo.clickOkButton();
            await utilCommon.waitUntilSpinnerToHide();
            //requester case preview

            expect(await casePreviewPo.isGroupDisplayed('GroupTwo')).toBeTruthy('group is not present');
            expect(await casePreviewPo.isGroupDisplayed('GroupOne')).toBeTruthy('group is not present');
            for (let i = 0; i < dynamicFieldsReqester.length; i++) {
                expect(await casePreviewPo.isDynamicFieldDisplayed(dynamicFieldsReqester[i])).toBeTruthy('field not present ' + dynamicFieldsReqester[i]);
            }
            await casePreviewPo.clickGoToCaseButton();
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        }
    }, 350 * 1000);

    //ptidke
    it('[DRDMV-13114]:[Dynamic Data] - Add all type of dynamic fields in Case Template', async () => {
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDynamicFieldAndGroup();
        let caseTemplateName = randomStr + 'caseTemplateDRDMV-13114';
        let caseTemaplateSummary = randomStr + 'caseTemplateDRDMV-13114';
        let casetemplateData = {
            "templateName": `${caseTemplateName}`,
            "templateSummary": `${caseTemaplateSummary}`,
            "templateStatus": "Draft",
        }
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createCaseTemplate(casetemplateData);
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        await utilGrid.searchAndOpenHyperlink(caseTemplateName);
        await utilCommon.waitUntilSpinnerToHide();
        await viewCasetemplatePo.clickOnMangeDynamicFieldLink();
        await dynamicFieldsPo.clickOnDynamicField();
        await dynamicFieldsPo.setFieldName('news16' + randomStr);
        await dynamicFieldsPo.setDescriptionName('newDescri16' + randomStr);
        await dynamicFieldsPo.selectFieldValueType('DATE');
        await dynamicFieldsPo.selectInfromationSource('Requester');
        await dynamicFieldsPo.clickOnDynamicField();
        await dynamicFieldsPo.setFieldName('news17' + randomStr);
        await dynamicFieldsPo.setDescriptionName('newDescri17' + randomStr);
        await dynamicFieldsPo.selectFieldValueType('NUMBER');
        await dynamicFieldsPo.selectInfromationSource('System');
        await dynamicFieldsPo.clickOnDynamicField();
        await dynamicFieldsPo.setFieldName('news18' + randomStr);
        await dynamicFieldsPo.setDescriptionName('newDescri18' + randomStr);
        await dynamicFieldsPo.selectFieldValueType('BOOLEAN');
        await dynamicFieldsPo.selectInfromationSource('Task Assignee');
        await dynamicFieldsPo.clickOnDynamicField();
        await dynamicFieldsPo.setFieldName('news19' + randomStr);
        await dynamicFieldsPo.setDescriptionName('newDescri19' + randomStr);
        await dynamicFieldsPo.selectFieldValueType('ATTACHMENT');
        await dynamicFieldsPo.selectInfromationSource('Agent');
        await dynamicFieldsPo.clickOnDynamicField();
        await dynamicFieldsPo.setFieldName('news20' + randomStr);
        await dynamicFieldsPo.setDescriptionName('newDescri20' + randomStr);
        await dynamicFieldsPo.selectFieldValueType('TEXT');
        await dynamicFieldsPo.selectInfromationSource('Agent');
        await dynamicFieldsPo.clickSaveButton();
        expect(await viewCasetemplatePo.isDynamicFieldDisplayed('newDescri16' + randomStr)).toBeTruthy('field not present');
        expect(await viewCasetemplatePo.isDynamicFieldDisplayed('newDescri17' + randomStr)).toBeTruthy('field not present');
        expect(await viewCasetemplatePo.isDynamicFieldDisplayed('newDescri18' + randomStr)).toBeTruthy('field not present');
        expect(await viewCasetemplatePo.isDynamicFieldDisplayed('newDescri19' + randomStr)).toBeTruthy('field not present');
        expect(await viewCasetemplatePo.isDynamicFieldDisplayed('newDescri20' + randomStr)).toBeTruthy('field not present');
    });//, 240 * 1000);

    //ptidke
    it('[DRDMV-13610]:[UI] [-ve] Update Automated Task Template Process and Task Type', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateData = {
            "templateName": `Automate13610${randomStr}`,
            "templateSummary": `Automate13610${randomStr}`,
            "templateStatus": "Draft",
            "processBundle": "com.bmc.dsm.case-lib",
            "processName": `Case Process 1 ${randomStr}`,
        }
        console.log(`Automate13610${randomStr}`);
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createAutomatedTaskTemplate(templateData);
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await utilGrid.searchAndOpenHyperlink(`Automate13610${randomStr}`);
        await viewTaskTemplate.clickOnEditLink();
        expect(await editTaskTemplate.isAutomatedTaskTypeDisabled()).toBeTruthy('not disabled');
        expect(await editTaskTemplate.isProcessNameDisabled()).toBeTruthy('not disabled');
        await editTaskTemplate.selectTaskCategoryTier1('Accounts Receivable');
        await editTaskTemplate.setSummary('update' + randomStr);
        await editTaskTemplate.selectPriorityValue('High');
        await editTaskTemplate.clickOnSaveButton();
        expect(await viewTaskTemplate.getCategoryTier1Value()).toBe('Accounts Receivable');
        expect(await viewTaskTemplate.getSummaryValue()).toBe('update' + randomStr);
        expect(await viewTaskTemplate.getPriorityValue()).toBe('High');
    });//, 240 * 1000);

    it('[DRDMV-13153]: [Dynamic Data] [UI] - Dynamic fields and groups display on Task Template preview	', async () => {
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDynamicFieldAndGroup();
        let taskTemplateName = 'ManualtaskDRDMV-13153' + randomStr;
        let manualTaskSummary = 'ManualSummaryDRDMV-13153' + randomStr;
        let templateData = {
            "templateName": `${taskTemplateName}`,
            "templateSummary": `${manualTaskSummary}`,
            "templateStatus": "Active",
        }
        let tasktemplate = await apiHelper.createManualTaskTemplate(templateData);
        await apiHelper.createDynamicDataOnTemplate(tasktemplate.id, 'TASK_TEMPLATE_WITH_CONFIDENTIAL');
        await navigationPage.gotoCreateCase();
        await createCasePo.selectRequester('qkatawazi');
        await createCasePo.setSummary('new cases');
        await createCasePo.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        await viewCasePo.clickAddTaskButton();
        await manageTaskBladePo.clickAddTaskFromTemplateButton();
        await utilGrid.searchRecord(taskTemplateName);
        await utilGrid.gridHyperLink(taskTemplateName);
        expect(await previewTaskTemplateCasesPo.isDynamicGroupDisplayed('TaskGroupLocalCaseTemplate')).toBeTruthy();
        expect(await previewTaskTemplateCasesPo.isDynamicGroupDisplayed('TaskPulishCaseTemplateData')).toBeTruthy();
        expect(await previewTaskTemplateCasesPo.isDynamicGroupDisplayed('TaskLocalNonConfidentialDesc')).toBeTruthy();
        expect(await previewTaskTemplateCasesPo.isDynamicGroupDisplayed('TaskLocalConfidentialDesc')).toBeTruthy();
        expect(await previewTaskTemplateCasesPo.isDynamicGroupDisplayed('TasknonConfidentialPulicDesc')).toBeTruthy();
        expect(await previewTaskTemplateCasesPo.isDynamicGroupDisplayed('TaskconfidentialPublicDesc')).toBeTruthy();
        expect(await previewTaskTemplateCasesPo.isDynamicFieldDisplayed('TaskOuterNonConfidentialDesc')).toBeTruthy();
        expect(await previewTaskTemplateCasesPo.isDynamicFieldDisplayed('TaskListOfDataNameDesc')).toBeTruthy();
        expect(await previewTaskTemplateCasesPo.isDynamicFieldDisplayed('TaskOuterConfidentialDesc')).toBeTruthy();

        let caseTemplateName = 'caseTemplateNameDRDMV-13153' + randomStr;
        let casTemplateSummary = 'CaseSummaryNameDRDMV-13153' + randomStr;
        let caseTemplateData = {
            "templateName": `${caseTemplateName}`,
            "templateSummary": `${casTemplateSummary}`,
            "templateStatus": "Draft",
            "resolveCaseonLastTaskCompletion": "1",
            "assignee": "Fritz",
            "company": "Petramco",
            "supportGroup": "Facilities",
            "ownerGroup": "Facilities"
        }
        await apiHelper.apiLogin('fritz');
        let casetemplateddetails = await apiHelper.createCaseTemplate(caseTemplateData);
        await navigationPage.gotoSettingsPage();
        await apiHelper.associateCaseTemplateWithOneTaskTemplate(casetemplateddetails.id, tasktemplate.id);
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        await utilGrid.searchAndOpenHyperlink(caseTemplateName);
        await viewCasetemplatePo.clickOneTask();
        //defect -https://jira.bmc.com/browse/DRDMV-21774
        expect(await previewTaskTemplateCasesPo.isDynamicGroupDisplayed('TaskGroupLocalCaseTemplate')).toBeTruthy();
        expect(await previewTaskTemplateCasesPo.isDynamicGroupDisplayed('TaskPulishCaseTemplateData')).toBeTruthy();
        expect(await previewTaskTemplateCasesPo.isDynamicGroupDisplayed('TaskLocalNonConfidentialDesc')).toBeTruthy();
        expect(await previewTaskTemplateCasesPo.isDynamicGroupDisplayed('TaskLocalConfidentialDesc')).toBeTruthy();
        expect(await previewTaskTemplateCasesPo.isDynamicGroupDisplayed('TasknonConfidentialPulicDesc')).toBeTruthy();
        expect(await previewTaskTemplateCasesPo.isDynamicGroupDisplayed('TaskconfidentialPublicDesc')).toBeTruthy();
        expect(await previewTaskTemplateCasesPo.isDynamicFieldDisplayed('TaskOuterNonConfidentialDesc')).toBeTruthy();
        expect(await previewTaskTemplateCasesPo.isDynamicFieldDisplayed('TaskListOfDataNameDesc')).toBeTruthy();
        expect(await previewTaskTemplateCasesPo.isDynamicFieldDisplayed('TaskOuterConfidentialDesc')).toBeTruthy();
    });
})