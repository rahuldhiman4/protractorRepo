import { cloneDeep } from 'lodash';
import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import { SAMPLE_MENU_ITEM } from '../../data/ui/ticketing/menu.item.ui';
import caseConsolePage from '../../pageobject/case/case-console.po';
import previewCasePo from '../../pageobject/case/case-preview.po';
import createCasePage from '../../pageobject/case/create-case.po';
import editCasePo from '../../pageobject/case/edit-case.po';
import quickCase from "../../pageobject/case/quick-case.po";
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import viewCasePage from "../../pageobject/case/view-case.po";
import changeAssignmentBladePo from '../../pageobject/common/change-assignment.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import personProfilePo from '../../pageobject/common/person-profile.po';
import updateStatusBladePo from '../../pageobject/common/update.status.blade.po';
import composeMailPo from '../../pageobject/email/compose-mail.po';
import selectTaskTemplate from "../../pageobject/settings/task-management/console-tasktemplate.po";
import taskTemplate from "../../pageobject/settings/task-management/create-tasktemplate.po";
import editTaskTemplate from "../../pageobject/settings/task-management/edit-tasktemplate.po";
import viewTasktemplatePo from "../../pageobject/settings/task-management/view-tasktemplate.po";
import consoleTask from "../../pageobject/task/console-task.po";
import adhoctaskTemplate from "../../pageobject/task/create-adhoc-task.po";
import editTask from "../../pageobject/task/edit-task.po";
import manageTaskBladePo from '../../pageobject/task/manage-task-blade.po';
import viewTask from "../../pageobject/task/view-task.po";
import { BWF_BASE_URL, BWF_PAGE_TITLES } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

describe('Create Case Task', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //ankagraw
    describe('[5552,5560]: Update Task Type field for any task', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let manualTaskTemplateData, autoTaskTemplateData, caseID = "";
        beforeAll(async () => {
            manualTaskTemplateData = {
                "templateName": `manualTaskTemplateDraft ${randomStr}`,
                "templateSummary": `manualTaskTemplateDraft ${randomStr}`,
                "templateStatus": "Active",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 1"
            }
            autoTaskTemplateData = {
                "templateName": `AutomatedTaskTemplateActive ${randomStr}`,
                "templateSummary": `AutomatedTaskTemplateActive ${randomStr}`,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": `Case Process 1 ${randomStr}`,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 1"
            }
            let caseData1 = {
                "Requester": "apavlik",
                "Summary": "Test case for inProgress task",
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
            }
            await apiHelper.apiLogin('qtao');
            let newCase = await apiHelper.createCase(caseData1);
            caseID = newCase.displayId;
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createAutomatedTaskTemplate(autoTaskTemplateData);
            await apiHelper.createManualTaskTemplate(manualTaskTemplateData);
        });
        it('[5552,5560]: added task on created case', async () => {
            //open create case
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotoCaseConsole();
            await caseConsolePage.searchAndOpenCase(caseID);
            await viewCasePage.clickAddTaskButton();

            //Add Manual task and Automation Task in Case
            await manageTaskBladePo.addTaskFromTaskTemplate(manualTaskTemplateData.templateSummary);
            await manageTaskBladePo.addTaskFromTaskTemplate(autoTaskTemplateData.templateSummary);
            await manageTaskBladePo.waitUntilNumberOfTaskLinkAppear(2);
            expect(await manageTaskBladePo.isTaskLinkPresent(manualTaskTemplateData.templateSummary)).toBeTruthy(manualTaskTemplateData.templateSummary + ' Task is not added to case');
            expect(await manageTaskBladePo.isTaskLinkPresent(autoTaskTemplateData.templateSummary)).toBeTruthy(autoTaskTemplateData.templateSummary + ' Task is not added to case');
        });
        it('[5552,5560]: Update Task Type field for any task', async () => {
            //validate Manual Template
            await manageTaskBladePo.clickTaskLink(manualTaskTemplateData.templateSummary);
            await viewTask.clickOnEditTask();
            expect(await editTask.getTaskTypeValue()).toBe('Manual');
            expect(await editTask.getTaskTypeValueAttribute('class')).toContain("disabled");
            expect(await editTask.processNamePresentInTask()).toBeFalsy();
            await editTask.clickOnCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");

            //validate Automation Template
            await viewTask.clickOnViewCase();
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.clickTaskLink(autoTaskTemplateData.templateSummary);
            await viewTask.clickOnEditTask();
            expect(await editTask.getTaskTypeValue()).toBe('Automated');
            expect(await editTask.getTaskTypeValueAttribute('class')).toContain("disabled");
            expect(await editTask.processNamePresentInTask()).toBeTruthy();
            await editTask.clickOnCancelButton();
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        });
    });

    // categ2 not populated
    describe('[5559,5565,6425,6386]: Automatic Task data validation once Task is created', async () => {
        let menuItem, randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let autmationTaskTemplateWithRequiredData = 'Automatic task With Required Field' + Math.floor(Math.random() * 1000000);
        let autmationTaskSummaryWithRequiredData = 'Automatic task Summary With Required Field' + Math.floor(Math.random() * 1000000);
        let automationTaskTemplateWithallField = 'Automation task with All field' + Math.floor(Math.random() * 1000000);
        let automationTaskSummaryWithallField = 'Automation task Summary with All field' + Math.floor(Math.random() * 1000000) + 1;
        beforeAll(async () => {
            menuItem = cloneDeep(SAMPLE_MENU_ITEM);
            menuItem.menuItemName = "TestMenuItemName" + randomStr;
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createNewMenuItem(menuItem);
        });
        it('[5559,5565,6425,6386]: Create manual task template', async () => {
            //Automated task Template with Required Data
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', BWF_PAGE_TITLES.TASK_MANAGEMENT.TEMPLATES);
            await selectTaskTemplate.clickOnAutomationTaskTemplateButton();
            await taskTemplate.setTemplateName(autmationTaskTemplateWithRequiredData);
            await taskTemplate.setTaskSummary(autmationTaskSummaryWithRequiredData);
            await taskTemplate.selectCompanyByName('Petramco')
            await taskTemplate.setNewProcessName(`Get Request Status Data1 ${randomStr}`);
            await taskTemplate.selectTemplateStatus('Active');
            await taskTemplate.selectBuisnessUnit('United States Support');
            await taskTemplate.selectOwnerGroup('US Support 1');
            await taskTemplate.clickOnSaveTaskTemplate();
            expect(await viewTasktemplatePo.getTaskCompanyNameValue()).toBe("Petramco");
            await viewTasktemplatePo.clickBackArrowBtn();
        });
        it('[5559,5565,6425,6386]: Create manual task template', async () => {
            //Automation Task template
            await selectTaskTemplate.clickOnAutomationTaskTemplateButton();
            await taskTemplate.setTemplateName(automationTaskTemplateWithallField);
            await taskTemplate.setTaskSummary(automationTaskSummaryWithallField);
            await taskTemplate.setTaskDescription('All field get added in this task template');
            await taskTemplate.selectCompanyByName('Petramco');
            await taskTemplate.setNewProcessName(`Get Request Status Data2 ${randomStr}`);
            await taskTemplate.selectLabel(menuItem.menuItemName);
            await taskTemplate.selectTaskCategoryTier1('Employee Relations');
            await taskTemplate.selectTaskCategoryTier2('Compensation');
            await taskTemplate.selectTaskCategoryTier3('Bonus');
            await taskTemplate.selectTaskCategoryTier4('Retention Bonus');
            await taskTemplate.selectTemplateStatus('Active');
            await taskTemplate.selectBuisnessUnit('United States Support');
            await taskTemplate.selectOwnerGroup('US Support 1');
            await taskTemplate.clickOnSaveTaskTemplate();
            expect(await viewTasktemplatePo.getTaskCompanyNameValue()).toBe("Petramco");
            await viewTasktemplatePo.clickBackArrowBtn();
        });
        it('[5559,5565,6425,6386]: Create case and add tasks on it task template', async () => {
            //case create
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary('Summary ' + automationTaskSummaryWithallField);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.addTaskFromTaskTemplate(autmationTaskTemplateWithRequiredData);
            await manageTaskBladePo.addTaskFromTaskTemplate(automationTaskTemplateWithallField);

            //Add Automation Task templates in Case
            expect(await manageTaskBladePo.isTaskLinkPresent(autmationTaskSummaryWithRequiredData)).toBeTruthy(autmationTaskTemplateWithRequiredData + ' Task is not added to case');
            expect(await manageTaskBladePo.isTaskLinkPresent(automationTaskSummaryWithallField)).toBeTruthy(automationTaskTemplateWithallField + ' Task is not added to case');
        });
        it('[5559,5565,6425,6386]: Validate manual task', async () => {
            await manageTaskBladePo.clickTaskLink(automationTaskSummaryWithallField);
            expect(await viewTask.getTaskTypeValue()).toBe('Automated');
            expect(await viewTask.getProcessNameValue()).toBe(`com.petramco.human-resource:Get Request Status Data2 ${randomStr}`);
            expect((await viewTask.getDescriptionValue()).trim()).toBe('All field get added in this task template');
            expect(await viewTask.getLabelValue()).toBe(menuItem.menuItemName);
            expect(await viewTask.getCategoryTier1Value()).toBe('Employee Relations');
            expect(await viewTask.getCategoryTier2Value()).toBe('Compensation');
            expect(await viewTask.getCategoryTier3Value()).toBe('Bonus');
            expect(await viewTask.getCategoryTier4Value()).toBe('Retention Bonus');
        });
        it('[5559,5565,6425,6386]: Automatic Task data validation once Task is created', async () => {
            //validate Automation Template
            await viewTask.clickOnViewCase();
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.clickTaskLink(autmationTaskSummaryWithRequiredData);
            expect(await viewTask.getTaskTypeValue()).toBe('Automated');
            expect(await viewTask.getProcessNameValue()).toBe(`com.petramco.human-resource:Get Request Status Data1 ${randomStr}`);
            expect(await viewTask.getDescriptionValue()).toBe('-', "getDescriptionValue");
            expect(await viewTask.getLabelValue()).toBe('-', "getLabelValue");
            expect(await viewTask.getCategoryTier1Value()).toBe('-', "getCategoryTier1Value");
            expect(await viewTask.getCategoryTier2Value()).toBe('-', "getCategoryTier2Value");
            expect(await viewTask.getCategoryTier3Value()).toBe('-', "getCategoryTier3Value");
            expect(await viewTask.getCategoryTier4Value()).toBe('-', "getCategoryTier4Value");
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        });
    });

    //ankagraw
    describe('[5569]: [Automatic Task] - Task Template UI in Edit mode: New fields validations', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            let templateData = {
                "templateName": randomStr + 'manualTaskTemplateActive',
                "templateSummary": randomStr + 'manualTaskTemplateActive',
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 1"
            }
            let templateData1 = {
                "templateName": randomStr + 'manualTaskTemplateInActive',
                "templateSummary": randomStr + 'manualTaskTemplateInActive',
                "templateStatus": "Inactive",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 1"
            }
            let templateData2 = {
                "templateName": randomStr + 'manualTaskTemplateDraft',
                "templateSummary": randomStr + 'manualTaskTemplateDraft',
                "templateStatus": "Draft",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 1"
            }
            let templateData4 = {
                "templateName": randomStr + 'AutomatedTaskTemplateActive',
                "templateSummary": randomStr + 'AutomatedTaskTemplateActive',
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": `Case Process 1 ${randomStr}`,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 1"
            }
            let templateData5 = {
                "templateName": randomStr + 'AutomatedTaskTemplateInActive',
                "templateSummary": randomStr + 'AutomatedTaskTemplateInActive',
                "templateStatus": "Inactive",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": `Case Process 2 ${randomStr}`,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 1"
            }
            let templateData6 = {
                "templateName": randomStr + 'AutomatedTaskTemplateDraft',
                "templateSummary": randomStr + 'AutomatedTaskTemplateDraft',
                "templateStatus": "Draft",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": `Case Process 3 ${randomStr}`,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 1"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createManualTaskTemplate(templateData);
            await apiHelper.createManualTaskTemplate(templateData1);
            await apiHelper.createManualTaskTemplate(templateData2);
            await apiHelper.createAutomatedTaskTemplate(templateData4);
            await apiHelper.createAutomatedTaskTemplate(templateData5);
            await apiHelper.createAutomatedTaskTemplate(templateData6);
        });
        it('[5569]: Verify the manual Active task template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', BWF_PAGE_TITLES.TASK_MANAGEMENT.TEMPLATES);
            await selectTaskTemplate.searchAndOpenTaskTemplate(randomStr + 'manualTaskTemplateActive');
            expect(await viewTasktemplatePo.getTaskTypeValue()).toBe('Manual');
            await viewTasktemplatePo.clickOnEditLink();
            expect(await editTaskTemplate.getTaskTypeValue()).toBe('Manual');
            expect(await editTaskTemplate.getTaskTypeValueAttribute("aria-disabled")).toBeTruthy();
            expect(await editTaskTemplate.isProcessNamePresentInTask()).toBeFalsy();
            await editTaskTemplate.clickOnCancelButton();
        });
        it('[5569]: Verify the manual inActive task template ', async () => {
            await viewTasktemplatePo.clickBackArrowBtn();
            await selectTaskTemplate.searchAndOpenTaskTemplate(randomStr + 'manualTaskTemplateInActive');
            expect(await viewTasktemplatePo.getTaskTypeValue()).toBe('Manual');
            await viewTasktemplatePo.clickOnEditLink();
            expect(await editTaskTemplate.getTaskTypeValue()).toBe('Manual');
            expect(await editTaskTemplate.getTaskTypeValueAttribute("aria-disabled")).toBeTruthy();
            expect(await editTaskTemplate.isProcessNamePresentInTask()).toBeFalsy();
            await editTaskTemplate.clickOnCancelButton();
        });
        it('[5569]: Verify the manual Draft task template', async () => {
            await viewTasktemplatePo.clickBackArrowBtn();
            await selectTaskTemplate.searchAndOpenTaskTemplate(randomStr + 'manualTaskTemplateDraft');
            expect(await viewTasktemplatePo.getTaskTypeValue()).toBe('Manual');
            await viewTasktemplatePo.clickOnEditLink();
            expect(await editTaskTemplate.getTaskTypeValue()).toBe('Manual');
            expect(await editTaskTemplate.getTaskTypeValueAttribute("aria-disabled")).toBeTruthy();
            expect(await editTaskTemplate.isProcessNamePresentInTask()).toBeFalsy();
            await editTaskTemplate.clickOnCancelButton();
        });
        it('[5569]: Verify the Automation Active task template', async () => {
            await viewTasktemplatePo.clickBackArrowBtn();
            await selectTaskTemplate.searchAndOpenTaskTemplate(randomStr + 'AutomatedTaskTemplateActive');
            expect(await viewTasktemplatePo.getTaskTypeValue()).toBe('Automated');
            await viewTasktemplatePo.clickOnEditLink();
            expect(await editTaskTemplate.getTaskTypeValue()).toBe('Automated');
            expect(await editTaskTemplate.getTaskTypeValueAttribute("aria-disabled")).toBeTruthy();
            expect(await editTaskTemplate.isProcessNamePresentInTask()).toBeTruthy();
            await editTaskTemplate.clickOnCancelButton();
        });
        it('[5569]: Verify the Automation inActive task template', async () => {
            await viewTasktemplatePo.clickBackArrowBtn();
            await selectTaskTemplate.searchAndOpenTaskTemplate(randomStr + 'AutomatedTaskTemplateInActive');
            expect(await viewTasktemplatePo.getTaskTypeValue()).toBe('Automated');
            await viewTasktemplatePo.clickOnEditLink();
            expect(await editTaskTemplate.getTaskTypeValue()).toBe('Automated');
            expect(await editTaskTemplate.getTaskTypeValueAttribute("aria-disabled")).toBeTruthy();
            expect(await editTaskTemplate.isProcessNamePresentInTask()).toBeTruthy();
            await editTaskTemplate.clickOnCancelButton();
        });
        it('[5569]: [Automatic Task] - Task Template UI in Edit mode: New fields validations', async () => {
            await viewTasktemplatePo.clickBackArrowBtn();
            await selectTaskTemplate.searchAndOpenTaskTemplate(randomStr + 'AutomatedTaskTemplateDraft');
            expect(await viewTasktemplatePo.getTaskTypeValue()).toBe('Automated');
            await viewTasktemplatePo.clickOnEditLink();
            expect(await editTaskTemplate.getTaskTypeValue()).toBe('Automated');
            expect(await editTaskTemplate.getTaskTypeValueAttribute("aria-disabled")).toBeTruthy();
            expect(await editTaskTemplate.isProcessNamePresentInTask()).toBeTruthy();
            await editTaskTemplate.clickOnCancelButton();
            await viewTasktemplatePo.clickBackArrowBtn();
        });
    });

    // categ2 not populated
    fdescribe('[5015,5014,5020,4997]: [ Task ] - Verify Associated menu for Task will show global configuration values as well', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let TaskTemplate = 'Manual task' + randomStr;
        let TaskSummary = 'Summary' + randomStr;
        let manualSummary = 'Summary' + randomStr;
        it('[5015,5014,5020,4997]: Create Manual task with global category ', async () => {
            //manual Task template
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', BWF_PAGE_TITLES.TASK_MANAGEMENT.TEMPLATES);
            await selectTaskTemplate.clickOnManualTaskTemplateButton();
            await taskTemplate.setTemplateName(TaskTemplate);
            await taskTemplate.setTaskSummary(TaskSummary);
            await taskTemplate.setTaskDescription('Description');
            await taskTemplate.selectCompanyByName('Global');
            await taskTemplate.selectTaskCategoryTier1('Employee Relations');
            await taskTemplate.selectTaskCategoryTier2('Compensation');
            await taskTemplate.selectTaskCategoryTier3('Bonus');
            await taskTemplate.selectTemplateStatus('Active');
            await taskTemplate.selectBuisnessUnit('United States Support');
            await taskTemplate.selectOwnerGroup('US Support 1');
            await taskTemplate.clickOnSaveTaskTemplate();
            await utilityCommon.closePopUpMessage();
            expect(await viewTasktemplatePo.getCategoryTier1Value()).toBe('Employee Relations');
            expect(await viewTasktemplatePo.getCategoryTier2Value()).toBe('Compensation');
            expect(await viewTasktemplatePo.getCategoryTier3Value()).toBe('Bonus');
            expect(await viewTasktemplatePo.getTaskCompanyNameValue()).toBe('- Global -');
            await viewTasktemplatePo.clickBackArrowBtn();

        });
        it('[5015,5014,5020,4997]: Create case with above task template ', async () => {
            //Create a Case
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary('Summary ' + manualSummary);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.selectCategoryTier1('Employee Relations');
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await utilityCommon.closePopUpMessage();
            expect(await viewCasePage.getCategoryTier1Value()).toBe('Employee Relations', "Employee Category Not Present");
        });
        it('[5015,5014,5020,4997]: [ Task ] - Verify Associated menu for Task will show global configuration values as well', async () => {
            //Got To Another Case
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary('Summary 123 ' + manualSummary);
            await createCasePage.selectCategoryTier1('Employee Relations');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePage.getCategoryTier1Value()).toBe('Employee Relations', "Applications Category Not Present");
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    // categ2 not populated
    fdescribe('[4941]: Task Template submitter from different company of owner group can edit the template', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let TaskTemplate = randomStr + 'Manual task';
        let TaskSummary = randomStr + 'Summary';
        let description = 'description' + randomStr;

        beforeAll(async () => {
        });
        it('[4941]: Login with Psilon user', async () => {
            await navigationPage.signOut();
            await loginPage.login('qheroux');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', BWF_PAGE_TITLES.TASK_MANAGEMENT.TEMPLATES);
            await selectTaskTemplate.clickOnManualTaskTemplateButton();
            await taskTemplate.setTemplateName(TaskTemplate);
            await taskTemplate.setTaskSummary(TaskSummary);
            await taskTemplate.selectCompanyByName('Psilon');
            await taskTemplate.selectOwnerCompany('Psilon');
            await taskTemplate.selectBuisnessUnit('Psilon Support Org1');
            await taskTemplate.selectOwnerGroup('Psilon Support Group1');
            await taskTemplate.clickOnSaveTaskTemplate();
            expect(await viewTasktemplatePo.getTaskTypeValue()).toBe('Manual');
            await utilityCommon.closePopUpMessage();
        });
        it('[4941]: Edit the above template', async () => {
            //search above template
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', BWF_PAGE_TITLES.TASK_MANAGEMENT.TEMPLATES);
            await selectTaskTemplate.searchAndOpenTaskTemplate(TaskTemplate);
            await viewTasktemplatePo.clickOnEditLink();
            await editTaskTemplate.selectTaskCategoryTier1('Employee Relations');
            await editTaskTemplate.selectTaskCategoryTier2('Compensation');
            await editTaskTemplate.selectTaskCategoryTier3('Bonus');
            await editTaskTemplate.setDescription(description);
            await editTaskTemplate.clickOnSaveButton();
        });
        it('[4941]: Edit the above template', async () => {
            await utilityCommon.closePopUpMessage();
            expect(await viewTasktemplatePo.getTaskDescriptionNameValue()).toBe(description, 'description is not present');
            expect(await viewTasktemplatePo.getCategoryTier1Value()).toBe('Employee Relations', 'Employee Relations is not present');
            expect(await viewTasktemplatePo.getCategoryTier2Value()).toBe('Compensation', 'Compensation is not present');
            expect(await viewTasktemplatePo.getCategoryTier3Value()).toBe('Bonus', 'Bonus is not present');
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi")
        });
    });

    // owner group permission not honored in template
    fdescribe('[4935]: Task Template access when owner group from different company is applied', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let TaskTemplate = 'Manualtask' + randomStr;
        let TaskSummary = 'Summary' + randomStr;
        let description = 'description' + randomStr;
        beforeAll(async () => {
            let templateData1 = {
                "templateName": TaskTemplate,
                "templateSummary": TaskSummary,
                "templateStatus": "Active",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Canada Support",
                "ownerGroup": "CA Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createManualTaskTemplate(templateData1);
        });
        //search above template
        it('[4935]: Login with psilon user and update the task template', async () => {
            await navigationPage.signOut();
            await loginPage.login('qheroux');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', BWF_PAGE_TITLES.TASK_MANAGEMENT.TEMPLATES);
            await selectTaskTemplate.searchAndOpenTaskTemplate(TaskTemplate);
            await editTaskTemplate.clickOnEditMetadataLink();
            await editTaskTemplate.selectTemplateStatus('Draft');
            await editTaskTemplate.clickOnSaveMetadata();
            await editTaskTemplate.clickOnEditMetadataLink();
            await editTaskTemplate.selectOwnerCompany('Psilon');
            await editTaskTemplate.selectBusinessUnit('Psilon Support Org2');
            await editTaskTemplate.selectOwnerGroup('Psilon Support Group2');
            await editTaskTemplate.clickOnSaveMetadata();
            await viewTasktemplatePo.clickOnEditLink();
            await editTaskTemplate.setDescription(description);
            await editTaskTemplate.clickOnSaveButton();
            expect(await viewTasktemplatePo.getTaskDescriptionNameValue()).toBe(description, "Unable to find the description");
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //ankagraw
    fdescribe('[5558]: [Automatic Task] - Automated Task Status transition validation', async () => {
        let randomStr = Math.floor(Math.random() * 1000000);
        let automationTaskTemplate = 'Automatic task' + randomStr;
        let automationTaskSummary = 'Summary' + randomStr;
        let createCase = 'Create Case task' + randomStr;
        let processName = 'process' + randomStr;
        let status: string[] = ["Completed", "Canceled", "Closed"];
        beforeAll(async () => {
            let templateData = {
                "templateName": automationTaskTemplate,
                "templateSummary": automationTaskSummary,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": processName,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 1"
            }
            //Automation Task template
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createAutomatedTaskTemplate(templateData);
        });
        it('[5558]: Create case and add task on it', async () => {
            //case create
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary('Summary ' + createCase);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.addTaskFromTaskTemplate(automationTaskSummary);
            await manageTaskBladePo.clickCloseButton();
        });
        it('[5558]: Verify the task status', async () => {
            await viewCasePage.clickOnRefreshTaskList();
            await updateStatusBladePo.changeCaseStatus("In Progress");
            await updateStatusBladePo.clickSaveStatus();
            //validate Automation Template With Required Field
            await utilityCommon.closePopUpMessage();
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.clickTaskLink(automationTaskSummary);
            await viewTask.clickOnChangeStatus();
            expect(await updateStatusBladePo.allStatusOptionsPresent(status)).toBeTruthy("Staus Not Found");
            await updateStatusBladePo.clickCancelButton();
            await viewTask.clickOnChangeStatus();
            await viewTask.changeTaskStatus('Closed');
            await updateStatusBladePo.clickSaveStatus();
            await utilityCommon.closePopUpMessage();
            expect(await viewTask.getTaskStatusValue()).toBe('Closed');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //ankagraw
    it('[5571]: [Automatic Task] - Task Template Console: Verify Task Type column, filter ', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', BWF_PAGE_TITLES.TASK_MANAGEMENT.TEMPLATES);
        await utilityGrid.clearFilter();
        expect(await selectTaskTemplate.clickOnColumnAndIsColumnSortedAsending('Task Type')).toBeTruthy();
        expect(await selectTaskTemplate.clickOnColumnAndIsColumnSortedDescending('Task Type')).toBeTruthy();
        await utilityGrid.addFilter('Task Type', 'Manual', "checkbox");
        expect(await selectTaskTemplate.isTaskTypeFilterValue('Manual')).toBeTruthy();
        await utilityGrid.clearFilter();
        await utilityGrid.addFilter('Task Type', 'Automated', "checkbox");
        expect(await selectTaskTemplate.isTaskTypeFilterValue('Automated')).toBeTruthy();
        await utilityGrid.clearFilter();
    });

    //ankagraw
    it('[5803]: [Task Template Console] Task Template Console verification', async () => {
        let addColoumn: string[] = ['Label'];
        let allColoumn: string[] = ['Template Name', 'Template Status', 'Task Type', 'Task Category Tier 1', 'Task Category Tier 2', 'Assignee', 'Support Group', 'Modified Date', 'Task Company'];
        let updateAllColoumn: string[] = ['Template Name', 'Template Status', 'Task Type', 'Task Category Tier 1', 'Task Category Tier 2', 'Assignee', 'Support Group', 'Modified Date', 'Task Company', 'Label'];
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', BWF_PAGE_TITLES.TASK_MANAGEMENT.TEMPLATES);
        expect(await selectTaskTemplate.isAllColumnTitleDisplayed(allColoumn)).toBeTruthy("All Coloumn is not present");
        await selectTaskTemplate.addColumn(addColoumn);
        expect(await selectTaskTemplate.isAllColumnTitleDisplayed(updateAllColoumn)).toBeTruthy("Updated All Coloumn is not present");
        await selectTaskTemplate.removeColumn(addColoumn);
    });

    //ankagraw
    it('[5546]: [Automatic Task] - Task Console: Task Type column and filter validation', async () => {
        await navigationPage.gotoTaskConsole();
        await utilityGrid.clearFilter();
        expect(await utilityGrid.isGridColumnSorted('Task ID', 'ascending')).toBeTruthy('Ascendigly not sorted');
        expect(await utilityGrid.isGridColumnSorted('Task ID', 'descending')).toBeTruthy('Descendigly not sorted');
        await utilityGrid.addFilter('Task Type', 'Manual', "checkbox");
        expect(await consoleTask.isTaskTypeFilterValue('Manual')).toBeTruthy('Task filter not applied');
        await utilityGrid.clearFilter();
        await utilityGrid.addFilter('Task Type', 'Automated', "checkbox");
        expect(await consoleTask.isTaskTypeFilterValue('Automated')).toBeTruthy('Task type filter not applied');
        await utilityGrid.clearFilter();
    });

    //ankagraw
    describe('[5564,5570]: [Automatic Task] - Task template selection Console: Verify Task Type column, filter', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            let templateData1 = {
                "templateName": `manualTaskTemplateActive ${randomStr}`,
                "templateSummary": `manualTaskTemplateActive ${randomStr}`,
                "templateStatus": "Active",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 1"
            }
            let templateData2 = {
                "templateName": `AutomatedTaskTemplateActive ${randomStr}`,
                "templateSummary": `AutomatedTaskTemplateActive ${randomStr}`,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": `Case Process 1 ${randomStr}`,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 1"
            }

            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createAutomatedTaskTemplate(templateData2);
            await apiHelper.createManualTaskTemplate(templateData1);
        });
        it('[5564,5570]: Create case and add task on it', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('set summary');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.clickAddTaskFromTemplateButton();
            await utilityGrid.clearFilter();
        });
        it('[5564,5570]: Verify the console of select task template', async () => {
            await utilityGrid.addGridColumn(['Display ID']);
            expect(await utilityGrid.isGridColumnSorted('Display ID', 'ascending')).toBeTruthy('Ascendigly not sorted');
            expect(await utilityGrid.isGridColumnSorted('Display ID', 'descending')).toBeTruthy('Descendigly not sorted');
            await utilityGrid.removeGridColumn(['Display ID']);
            await utilityGrid.addFilter('Task Type', 'Manual', "checkbox");
            expect(await manageTaskBladePo.getFilterValue('Manual')).toBeTruthy();
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Task Type', 'Automated', 'checkbox');
            expect(await manageTaskBladePo.getFilterValue('Automated')).toBeTruthy();
            await utilityGrid.clearFilter();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //ankagraw
    describe('[5984]: [Permissions] Settings menu for Case Functional Roles', async () => {
        let caseManagementList: string[] = ['Case Management', 'Approvals', 'Assignments', 'Automated Status Transition', 'Notes Template', 'Read Access', 'Status Configuration', 'Templates'];
        let manageFlowsetList: string[] = ['Manage Flowsets', 'Define Flowsets'];
        let serviceLevelManagementList: string[] = ['Service Level Management', 'Configure Data Source', 'Goal Type', 'Service Target', 'Service Target Group'];
        let taskManagementList: string[] = ['Task Management', 'Approvals', 'Notes Template', 'Status Configuration', 'Templates'];
        let emailtList: string[] = ['Email', 'Acknowledgment Templates', 'Configuration', 'Templates'];
        let notificationConfigurationList: string[] = ['Notification Configuration', 'Manage Events', 'Manage Templates'];
        it('[5984]: Verify Permissions role of CBA', async () => {
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.isSettingSubMenusMatches("Case Management", caseManagementList)).toBeTruthy("Case Management");
            expect(await navigationPage.isSettingSubMenusMatches("Manage Flowsets", manageFlowsetList)).toBeTruthy("Manage Flowsets");
            expect(await navigationPage.isSettingSubMenusMatches("Service Level Management", serviceLevelManagementList)).toBeTruthy("Service Level Management");
            expect(await navigationPage.isSettingSubMenusMatches("Task Management", taskManagementList)).toBeTruthy("Task Management");
            expect(await navigationPage.isSettingSubMenusMatches("Email", emailtList)).toBeTruthy("Email");
            expect(await navigationPage.isSettingSubMenusMatches("Notification Configuration", notificationConfigurationList)).toBeTruthy("Notification Configuration");
        });
        it('[5984]: Verify permission from manger role and agent role', async () => {
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.isSettingSubMenusMatches("Case Management", caseManagementList)).toBeTruthy("Case Management");
            expect(await navigationPage.isSettingSubMenusMatches("Manage Flowsets", manageFlowsetList)).toBeTruthy("Manage Flowsets");
            expect(await navigationPage.isSettingSubMenusMatches("Service Level Management", serviceLevelManagementList)).toBeTruthy("Service Level Management");
            expect(await navigationPage.isSettingSubMenusMatches("Task Management", taskManagementList)).toBeTruthy("Task Management");
            expect(await navigationPage.isSettingMenuPresent('Knowledge Management')).toBeFalsy('Knowledge Management');

            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.isSettingMenuPresent('Case Management')).toBeFalsy();
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //ankagraw
    describe('[5800]: [Task Template] Task Template Status changes', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            let templateDataDraft1 = {
                "templateName": `manualTaskTemplateDraft1 ${randomStr}`,
                "templateSummary": `manualTaskTemplateDraft1 ${randomStr}`,
                "templateStatus": "Draft",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 1"
            }
            let templateDataActive = {
                "templateName": `manualTaskTemplateActive ${randomStr}`,
                "templateSummary": `manualTaskTemplateActive ${randomStr}`,
                "templateStatus": "Active",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 1"
            }

            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createManualTaskTemplate(templateDataDraft1);
            await apiHelper.createManualTaskTemplate(templateDataActive);
        });
        it('[5800]: Verify the task template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', BWF_PAGE_TITLES.TASK_MANAGEMENT.TEMPLATES);
            await selectTaskTemplate.searchAndOpenTaskTemplate(`manualTaskTemplateDraft1 ${randomStr}`);
            expect(await viewTasktemplatePo.getTaskTypeValue()).toBe('Manual');
            await editTaskTemplate.clickOnEditMetadataLink();
            await editTaskTemplate.selectTemplateStatus("Active");
            await editTaskTemplate.clickOnSaveMetadata();
            await utilityCommon.closePopUpMessage();
            expect(await viewTasktemplatePo.getTemplateStatus()).toBe('Active');
            await editTaskTemplate.clickOnEditMetadataLink();
            await editTaskTemplate.selectTemplateStatus("Inactive");
            await editTaskTemplate.clickOnSaveMetadata();
            await utilityCommon.closePopUpMessage();
            expect(await viewTasktemplatePo.getTemplateStatus()).toBe('Inactive');
            await editTaskTemplate.clickOnEditMetadataLink();
            await editTaskTemplate.selectTemplateStatus("Draft");
            await editTaskTemplate.clickOnSaveMetadata();
            await utilityCommon.closePopUpMessage();
            expect(await viewTasktemplatePo.getTemplateStatus()).toBe('Draft');
            await viewTasktemplatePo.clickBackArrowBtn();

        });
        it('[5800]: Update the task template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', BWF_PAGE_TITLES.TASK_MANAGEMENT.TEMPLATES);
            await selectTaskTemplate.searchAndOpenTaskTemplate(`manualTaskTemplateActive ${randomStr}`);
            await editTaskTemplate.clickOnEditMetadataLink();
            await editTaskTemplate.selectTemplateStatus("Inactive");
            await editTaskTemplate.clickOnSaveMetadata();
            await utilityCommon.closePopUpMessage();
            expect(await viewTasktemplatePo.getTemplateStatus()).toBe('Inactive');
            await editTaskTemplate.clickOnEditMetadataLink();
            await editTaskTemplate.selectTemplateStatus("Draft");
            await editTaskTemplate.clickOnSaveMetadata();
            await utilityCommon.closePopUpMessage();
            expect(await viewTasktemplatePo.getTemplateStatus()).toBe('Draft');
            await viewTasktemplatePo.clickBackArrowBtn();
        });
    });

    // Extra error message on create case page
    describe('[5544]: Automated Task] - Automated Task Activation behavior when Case is created in In Progress status via Case template having Task templates in it', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateName = randomStr + 'caseTemplateName';
        let casTemplateSummary = 'CaseSummaryName' + randomStr;
        beforeAll(async () => {
            let templateData = {
                "templateName": `AutomatedTaskTemplateActive ${randomStr}`,
                "templateSummary": `AutomatedTaskTemplateActive ${randomStr}`,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": `Case Process 1 ${randomStr}`,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "assignee": "qtao",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 1",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 1"
            }
            let caseTemplateData = {
                "templateName": caseTemplateName,
                "templateSummary": casTemplateSummary,
                "caseStatus": "InProgress",
                "templateStatus": "Active",
                "assignee": "qkatawazi",
                "ownerCompany": "Petramco",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3",
            }
            await apiHelper.apiLogin('qkatawazi');
            let newCaseTemplate = await apiHelper.createCaseTemplate(caseTemplateData);
            let automationTaskTemplate = await apiHelper.createAutomatedTaskTemplate(templateData);
            await apiHelper.associateCaseTemplateWithOneTaskTemplate(newCaseTemplate.displayId, automationTaskTemplate.displayId);
        });
        it('[5544]: Create case and add task on it', async () => {
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('qtao');
            await createCasePage.setSummary('Summary');
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateName);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await utilityCommon.closePopUpMessage();
            await viewCasePage.clickOnTaskLink(`AutomatedTaskTemplateActive ${randomStr}`);
            expect(await viewTask.getTaskStatusValue()).toBe("Completed");
        });
        it('[5544]: create case and add task on it', async () => {
            //Quick Case 
            await navigationPage.gotoQuickCase();
            await quickCase.selectRequesterName('adam');
            await quickCase.selectCaseTemplate(`${caseTemplateName}`);
            await quickCase.createCaseButton();
            await quickCase.gotoCaseButton();
            await utilityCommon.closePopUpMessage();
            await viewCasePage.clickOnRefreshTaskList();
            await viewCasePage.clickOnTaskLink(`AutomatedTaskTemplateActive ${randomStr}`);
            expect(await viewTask.getTaskStatusValue()).toBe("Completed");
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //ankagraw.. fixed??
    it('[5554]: [Automatic Task] - When Case is Cancelled while there are Automatic Tasks which are in Staged, Assigned, Resolved, Closed state', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateData = {
            "templateName": `AutomatedTaskTemplateActive ${randomStr}`,
            "templateSummary": `AutomatedTaskTemplateActive ${randomStr}`,
            "templateStatus": "Active",
            "processBundle": "com.bmc.dsm.case-lib",
            "processName": `Case Process 1 ${randomStr}`,
            "taskCompany": "Petramco",
            "ownerCompany": "Petramco",
            "ownerBusinessUnit": "United States Support",
            "ownerGroup": "US Support 1"
        }
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createAutomatedTaskTemplate(templateData);
        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester('qtao');
        await createCasePage.setSummary('Summary' + randomStr);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        await viewCasePage.clickAddTaskButton();
        await manageTaskBladePo.addTaskFromTaskTemplate(templateData.templateSummary);
        await manageTaskBladePo.clickCloseButton();
        await viewCasePage.clickOnRefreshTaskList();
        await updateStatusBladePo.changeCaseStatus('Pending');
        await updateStatusBladePo.setStatusReason('Customer Response');
        await updateStatusBladePo.clickSaveStatus();
        await updateStatusBladePo.changeCaseStatus('Canceled');
        await updateStatusBladePo.setStatusReason('Customer Canceled');
        await updateStatusBladePo.clickSaveStatus();
        await utilityCommon.closePopUpMessage();
        await viewCasePage.clickOnTaskLink(`AutomatedTaskTemplateActive ${randomStr}`);
        expect(await viewTask.getTaskStatusValue()).toBe("Canceled");
    });

    //ankagraw
    describe('[5555,5556]: [Automatic Task] - Task Activation when multiple Tasks are on same sequence', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            let templateData = {
                "templateName": `FirstAutomatedTaskTemplateActive ${randomStr}`,
                "templateSummary": `AutomatedTaskTemplateSummaryActive ${randomStr}`,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": 'case_Management_Process' + randomStr,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 1"
            }
            let templateData1 = {
                "templateName": `SecondAutomatedTaskTemplateActive1 ${randomStr}`,
                "templateSummary": `SecondAutomatedTaskTemplateSummaryActive1 ${randomStr}`,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": 'case_Management_Process123' + randomStr,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 1"
            }

            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createAutomatedTaskTemplate(templateData);
            await apiHelper.createAutomatedTaskTemplate(templateData1);
        });
        it('[5555,5556]: Create a case and assign task on it', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('qtao');
            await createCasePage.setSummary('Summary' + randomStr);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await utilityCommon.closePopUpMessage();
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.addTaskFromTaskTemplate(`FirstAutomatedTaskTemplateActive ${randomStr}`);
            await manageTaskBladePo.addTaskFromTaskTemplate(`SecondAutomatedTaskTemplateActive1 ${randomStr}`);
            await manageTaskBladePo.clickCloseButton();
            await viewCasePage.clickOnRefreshTaskList();
            await viewCasePage.openTaskCard(1);
            await manageTaskBladePo.clickTaskLink(`AutomatedTaskTemplateSummaryActive ${randomStr}`);
            expect(await viewTask.getTaskStatusValue()).toBe("Staged");
            await viewTask.clickOnViewCase();
        });
        it('[5555,5556]: Verify first task on it', async () => {
            await viewCasePage.openTaskCard(1);
            await manageTaskBladePo.clickTaskLink(`SecondAutomatedTaskTemplateSummaryActive1 ${randomStr}`);
            expect(await viewTask.getTaskStatusValue()).toBe("Staged");
            await viewTask.clickOnViewCase();
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            await utilityCommon.closePopUpMessage();
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.clickTaskLink(`AutomatedTaskTemplateSummaryActive ${randomStr}`);
            expect(await viewTask.getTaskStatusValue()).toBe("Completed");
            expect(await viewTask.getStatusReason()).toBe("Successful");
            await viewTask.clickOnViewCase();
        });
        it('[5555,5556]: Verify second task on it', async () => {
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.clickTaskLink(`SecondAutomatedTaskTemplateSummaryActive1 ${randomStr}`);
            expect(await viewTask.getTaskStatusValue()).toBe("Completed");
        });
    });

    //ankagraw..not fixed
    describe('[5561]: [Automatic task] - Task Activation based on its sequence no.', async () => {
        let templateData1, templateData2, templateData3, randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            templateData1 = {
                "templateName": 'manualTaskTemplate1' + randomStr,
                "templateSummary": 'manualTaskTemplateSummary1' + randomStr,
                "templateStatus": "Active",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 1"
            }

            templateData2 = {
                "templateName": 'manualTaskTemplate2' + randomStr,
                "templateSummary": 'manualTaskTemplateSummary2' + randomStr,
                "templateStatus": "Active",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 1"
            }

            templateData3 = {
                "templateName": 'manualTaskTemplate3' + randomStr,
                "templateSummary": 'manualTaskTemplateSummary3' + randomStr,
                "templateStatus": "Active",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 1"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createManualTaskTemplate(templateData1);
            await apiHelper.createManualTaskTemplate(templateData2);
            await apiHelper.createManualTaskTemplate(templateData3);
        });
        it('[5561]: Create a case add task on it', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('qtao');
            await createCasePage.setSummary('Summary' + randomStr);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await utilityCommon.closePopUpMessage();
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.addTaskFromTaskTemplate(templateData1.templateName);
            await manageTaskBladePo.addTaskFromTaskTemplate(templateData2.templateName);
            await manageTaskBladePo.addTaskFromTaskTemplate(templateData3.templateName);
            await manageTaskBladePo.clickCloseButton();
            await viewCasePage.clickOnRefreshTaskList();
        });
        it('[5561]: Verify primary status of task', async () => {
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.clickTaskLink(templateData1.templateSummary);
            expect(await viewTask.getTaskStatusValue()).toBe("Staged");
            await viewTask.clickOnViewCase();
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.clickTaskLink(templateData2.templateSummary);
            expect(await viewTask.getTaskStatusValue()).toBe("Staged");
            await viewTask.clickOnViewCase();
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.clickTaskLink(templateData3.templateSummary);
            expect(await viewTask.getTaskStatusValue()).toBe("Staged");
            await viewTask.clickOnViewCase();
        });
        it('[5561]: Verify status of task after updating of case', async () => {
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            await utilityCommon.closePopUpMessage();
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.clickTaskLink(templateData1.templateSummary);
            await viewTask.clickOnChangeStatus();
            expect(await viewTask.getTaskStatusValue()).toBe("Assigned");
            await viewTask.changeTaskStatus('Completed');
            await updateStatusBladePo.setStatusReason('Successful');
            await updateStatusBladePo.clickSaveStatus();
            await utilityCommon.closePopUpMessage();
            await viewTask.clickOnViewCase();
        });
        it('[5561]: verify second and third status of task', async () => {
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.clickTaskLink(templateData2.templateSummary);
            expect(await viewTask.getTaskStatusValue()).toBe("Assigned");
            await viewTask.clickOnViewCase();
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.clickTaskLink(templateData3.templateSummary);
            expect(await viewTask.getTaskStatusValue()).toBe("Staged");
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
        });
    });

    //ankagraw
    describe('[5563,5562]: [Automatic Task] - Task Activation behaviour immediately after creation when Task is at seq 1', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let inProgress, pending, resolved, closed, canceled;
        beforeAll(async () => {
            let templateData = {
                "templateName": `AutomatedTaskTemplateActive ${randomStr}`,
                "templateSummary": `AutomatedTaskTemplateActive ${randomStr}`,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": 'case_Management_Process' + randomStr,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createAutomatedTaskTemplate(templateData);
            let caseWithInprogressStatus = {
                "Status": "3000",
                "Company": "Petramco",
                "Description": "This case was created by java integration tests",
                "Requester": "qkatawazi",
                "Summary": "create case is inProgress Status" + randomStr,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
            }

            let caseWithPendingStatus = {
                "Status": "4000",
                "Company": "Petramco",
                "Description": "This case was created by java integration tests",
                "Requester": "qkatawazi",
                "Summary": "create case is in Pending Status" + randomStr,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
            }

            let caseWithResolvedStatus = {
                "Status": "5000",
                "Company": "Petramco",
                "Description": "This case was created by java integration tests",
                "Requester": "qkatawazi",
                "Summary": "create case is in Resolved Status" + randomStr,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
            }

            let caseWithClosedStatus = {
                "Status": "7000",
                "Company": "Petramco",
                "Description": "This case was created by java integration tests",
                "Requester": "qkatawazi",
                "Summary": "create case is in Closed Status" + randomStr,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
            }

            let caseWithCanceledStatus = {
                "Status": "6000",
                "Company": "Petramco",
                "Description": "This case was created by java integration tests",
                "Requester": "qkatawazi",
                "Summary": "create case is in Canceled Status" + randomStr,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
            }
            await apiHelper.apiLogin('qtao');
            let inProgressCase = await apiHelper.createCase(caseWithInprogressStatus);
            let PendingCase = await apiHelper.createCase(caseWithPendingStatus);
            let resolvedCase = await apiHelper.createCase(caseWithResolvedStatus);
            let closedCase = await apiHelper.createCase(caseWithClosedStatus);
            let CanceledCase = await apiHelper.createCase(caseWithCanceledStatus);

            inProgress = inProgressCase.displayId;
            pending = PendingCase.displayId;
            resolved = resolvedCase.displayId;
            closed = closedCase.displayId;
            canceled = CanceledCase.displayId;
        });
        it('[5563,5562]: Create new status case and assign task on it', async () => {
            //Verify New Case
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary("New case" + randomStr);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await utilityCommon.closePopUpMessage();
            expect(await viewCasePage.isAddtaskButtonDisplayed()).toBeTruthy("Add task button not Visible")
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.addTaskFromTaskTemplate(`AutomatedTaskTemplateActive ${randomStr}`);
            await manageTaskBladePo.clickCloseButton();
            await viewCasePage.clickOnRefreshTaskList();
            await viewCasePage.openTaskCard(1);
            await manageTaskBladePo.clickTaskLink(`AutomatedTaskTemplateActive ${randomStr}`);
            expect(await viewTask.getTaskStatusValue()).toBe("Staged");
        });
        it('[5563,5562]: Create Assigned status case and assign task on it', async () => {
            //Verify Assigned Case
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary("Assigned case" + randomStr);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await utilityCommon.closePopUpMessage();
            expect(await viewCasePage.isAddtaskButtonDisplayed()).toBeTruthy("Add task button not Visible")
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.addTaskFromTaskTemplate(`AutomatedTaskTemplateActive ${randomStr}`);
            await manageTaskBladePo.clickCloseButton();
            await viewCasePage.clickOnRefreshTaskList();
            await viewCasePage.openTaskCard(1);
            await manageTaskBladePo.clickTaskLink(`AutomatedTaskTemplateActive ${randomStr}`);
            expect(await viewTask.getTaskStatusValue()).toBe("Staged");
        });
        it('[5563,5562]: Create InProgress status case and assign task on it', async () => {
            //Verify In_progress Case
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await caseConsolePage.searchAndOpenCase(inProgress);
            expect(await viewCasePage.isAddtaskButtonDisplayed()).toBeTruthy("Add task button not Visible")
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.addTaskFromTaskTemplate(`AutomatedTaskTemplateActive ${randomStr}`);
            await manageTaskBladePo.clickCloseButton();
            await viewCasePage.clickOnRefreshTaskList();
            await viewCasePage.openTaskCard(1);
            await manageTaskBladePo.clickTaskLink(`AutomatedTaskTemplateActive ${randomStr}`);
            expect(await viewTask.getTaskStatusValue()).toBe("Completed");
        });
        it('[5563,5562]: Create Pending status case and assign task on it', async () => {
            //Verify Pending Case
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await caseConsolePage.searchAndOpenCase(pending);
            expect(await viewCasePage.isAddtaskButtonDisplayed()).toBeTruthy("Add task button not Visible")
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.addTaskFromTaskTemplate(`AutomatedTaskTemplateActive ${randomStr}`);
            await manageTaskBladePo.clickCloseButton();
            await viewCasePage.clickOnRefreshTaskList();
            await viewCasePage.openTaskCard(1);
            await manageTaskBladePo.clickTaskLink(`AutomatedTaskTemplateActive ${randomStr}`);
            expect(await viewTask.getTaskStatusValue()).toBe("Staged");
        });
        it('[5563,5562]: Create resolved status case and assign task on it', async () => {
            //Verify Resolved Case
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await caseConsolePage.searchAndOpenCase(resolved);
            expect(await viewCasePage.isAddtaskButtonDisplayed()).toBeFalsy("Add task button Visible");
        });
        it('[5563,5562]: Create closed status case', async () => {
            //Verify Closed Case
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await caseConsolePage.searchAndOpenCase(closed);
            expect(await viewCasePage.isAddtaskButtonDisplayed()).toBeFalsy("Add task button Visible");

            //Verify Canceled Case
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await caseConsolePage.searchAndOpenCase(canceled);
            expect(await viewCasePage.isAddtaskButtonDisplayed()).toBeFalsy("Add task button Visible");
        });
    });

    // need to discuss this observation
    describe('[5784,5672]: [Task Status] Task Status change from Completed', async () => {
        let templateData3, casetemplatePetramco, randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let statusDropdown1: string[] = ["Completed", "Canceled", "Closed"];
        beforeAll(async () => {
            let templateData1 = {
                "templateName": `manualTaskTemplate1 ${randomStr}`,
                "templateSummary": `manualTaskTemplateSummary1 ${randomStr}`,
                "templateStatus": "Active",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3",
                "assignee": "qkatawazi",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
            }
            let templateData2 = {
                "templateName": `manualTaskTemplate2 ${randomStr}`,
                "templateSummary": `manualTaskTemplateSummary2 ${randomStr}`,
                "templateStatus": "Active",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3",
                "assignee": "qkatawazi",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
            }
            templateData3 = {
                "templateName": `manualTaskTemplate3 ${randomStr}`,
                "templateSummary": `manualTaskTemplateSummary3 ${randomStr}`,
                "templateStatus": "Active",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3",
                "assignee": "qkatawazi",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
            }
            await apiHelper.apiLogin('qkatawazi');
            let template1 = await apiHelper.createManualTaskTemplate(templateData1);
            let template2 = await apiHelper.createManualTaskTemplate(templateData2);
            await apiHelper.createManualTaskTemplate(templateData3);
            casetemplatePetramco = {
                "templateName": 'caseTemplateName' + randomStr,
                "templateSummary": 'caseTemplateName' + randomStr,
                "templateStatus": "Active",
                "categoryTier1": "Employee Relations",
                "categoryTier2": "Compensation",
                "categoryTier3": "Bonus",
                "casePriority": "Low",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 1",
                "assignee": "qtao",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }
            console.log('caseTemplateName' + randomStr);

            let newCaseTemplate = await apiHelper.createCaseTemplate(casetemplatePetramco);
            await apiHelper.associateCaseTemplateWithTwoTaskTemplate(newCaseTemplate.displayId, template1.displayId, template2.displayId, "parallel");
        });
        it('[5784,5672]: [Task Status] Task Status change from Completed', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('qtao');
            await createCasePage.setSummary('DRDMV3880Summary' + randomStr);
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(casetemplatePetramco.templateName);
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
        });
        it('[5784,5672]: [Task Status] Task Status change from Completed', async () => {
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(`manualTaskTemplateSummary1 ${randomStr}`);
            expect(await viewTask.getTaskStatusValue()).toBe("Staged");
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(`manualTaskTemplateSummary2 ${randomStr}`);
            expect(await viewTask.getTaskStatusValue()).toBe("Staged");
            await viewTask.clickOnViewCase();
        });
        it('[5784,5672]: [Task Status] Task Status change from Completed', async () => {
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.addTaskFromTaskTemplate(`manualTaskTemplate3 ${randomStr}`);
            await manageTaskBladePo.clickCloseButton();
            await viewCasePage.clickOnRefreshTaskList();
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            await utilityCommon.closePopUpMessage();
            await navigationPage.gotoCaseConsole();
            await caseConsolePage.searchAndOpenCase('DRDMV3880Summary' + randomStr);
            await viewCasePage.clickOnTaskLink(`manualTaskTemplateSummary1 ${randomStr}`);
            expect(await viewTask.getTaskStatusValue()).toBe("Assigned");
            await viewTask.clickOnViewCase();
            await viewCasePage.clickOnTaskLink(`manualTaskTemplateSummary2 ${randomStr}`);
            expect(await viewTask.getTaskStatusValue()).toBe("Assigned");
            await viewTask.clickOnViewCase();
            await viewCasePage.clickOnTaskLink(`manualTaskTemplateSummary3 ${randomStr}`);
            expect(await viewTask.getTaskStatusValue()).toBe("Staged");
            await viewTask.clickOnViewCase();
        });
        it('[5784,5672]: [Task Status] Task Status change from Completed', async () => {
            await viewCasePage.clickOnTaskLink(`manualTaskTemplateSummary1 ${randomStr}`);
            await viewTask.clickOnChangeStatus();
            await updateStatusBladePo.allStatusOptionsPresent(statusDropdown1);
            await updateStatusBladePo.clickCancelButton();
            await viewTask.clickOnChangeStatus();
            await viewTask.changeTaskStatus('Completed');
            await updateStatusBladePo.setStatusReason('Successful');
            await updateStatusBladePo.clickSaveStatus();
            await utilityCommon.closePopUpMessage();
            expect(await viewTask.getTaskStatusValue()).toBe("Completed");
            await viewTask.clickOnChangeStatus();
            await viewTask.changeTaskStatus('Canceled');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewTask.getTaskStatusValue()).toBe("Canceled");
            expect(await viewTask.isChangeStatusButtonDisabled()).toBeTruthy("Button is Enabled");
            await navigationPage.gotoTaskConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter("Status", "Canceled", "text");
            expect(await utilityGrid.isGridRecordPresent(`manualTaskTemplateSummary1 ${randomStr}`)).toBeTruthy(`manualTaskTemplateSummary1 ${randomStr}`);
        });
        it('[5784,5672]: [Task Status] Task Status change from Completed', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsolePage.searchAndOpenCase('DRDMV3880Summary' + randomStr);
            await viewCasePage.clickOnTaskLink(`manualTaskTemplateSummary2 ${randomStr}`);
            await viewTask.clickOnChangeStatus();
            await viewTask.changeTaskStatus('Completed');
            await updateStatusBladePo.setStatusReason('Successful');
            await updateStatusBladePo.clickSaveStatus();
            await utilityCommon.closePopUpMessage();
            await viewTask.clickOnChangeStatus();
            await viewTask.changeTaskStatus('Closed');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewTask.getTaskStatusValue()).toBe("Closed");
            expect(await viewTask.isChangeStatusButtonDisabled()).toBeTruthy("Button is Enabled");
            await navigationPage.gotoTaskConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter("Status", "Closed", "text");
            expect(await utilityGrid.isGridRecordPresent(`manualTaskTemplateSummary2 ${randomStr}`)).toBeTruthy(`manualTaskTemplateSummary2 ${randomStr}`);
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
        });
    });

    //ankagraw..not fixed
    describe('[5575]:[Add Adhoc Task] [Assignment] Changing the Assignment on Add Adhoc Task by the member of one Support Group', async () => {
        const randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let casetemplatePetramco;
        beforeAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            casetemplatePetramco = {
                "templateName": 'caseTemplateName' + randomStr,
                "templateSummary": 'caseTemplateName' + randomStr,
                "templateStatus": "Active",
                "categoryTier1": "Employee Relations",
                "categoryTier2": "Compensation",
                "categoryTier3": "Bonus",
                "casePriority": "Low",
                // "caseStatus": "New",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 1",
                "assignee": "qtao",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.createCaseTemplate(casetemplatePetramco);
        });
        it('[5575]:[Add Adhoc Task] [Assignment] Changing the Assignment on Add Adhoc Task by the member of one Support Group', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('Summary' + randomStr);
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(casetemplatePetramco.templateName);
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            //Adhoc task validation
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.clickAddAdhocTaskButton();
            await adhoctaskTemplate.setSummary("Summary1" + randomStr);
            await adhoctaskTemplate.setDescription("Description");
            await adhoctaskTemplate.selectPriority('High');
            await adhoctaskTemplate.selectCategoryTier1('Employee Relations');
            await adhoctaskTemplate.selectCategoryTier2('Compensation');
            await adhoctaskTemplate.selectCategoryTier3('Bonus');
            await adhoctaskTemplate.clickAssignToMeButton();
            await adhoctaskTemplate.clickSaveAdhoctask();
            await utilityCommon.closePopUpMessage();
            await manageTaskBladePo.clickTaskLink("Summary1" + randomStr);
            expect(await viewTask.getAssignedGroupText()).toBe('US Support 3');
            expect(await viewTask.getAssigneeText()).toBe('Qadim Katawazi');
        });
        it('[5575]:[Add Adhoc Task] [Assignment] Changing the Assignment on Add Adhoc Task by the member of one Support Group', async () => {
            await viewTask.clickOnEditTask();
            await changeAssignmentBladePo.setDropDownValue('Company', 'Petramco')
            await changeAssignmentBladePo.setDropDownValue('SupportOrg', 'United States Support');
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'US Support 1');
            await changeAssignmentBladePo.setDropDownValue('Assignee', 'Qiao Feng');
            await editTask.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
            expect(await viewTask.getAssignedGroupText()).toBe('US Support 1');
            expect(await viewTask.getAssigneeText()).toBe('Qiao Feng');
            await viewTask.clickOnViewCase();
        });
        it('[5575]:[Add Adhoc Task] [Assignment] Changing the Assignment on Add Adhoc Task by the member of one Support Group', async () => {
            await viewCasePage.clickEditCaseButton();
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'US Support 1');
            await editCasePo.clickSaveCase();
            await utilityCommon.closePopUpMessage();
            expect(await viewCasePage.getAssignedGroupValue()).toBe('US Support 1');
            expect(await viewCasePage.getAssigneeText()).toBe('None', 'Assignee name is missing');
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.clickAddAdhocTaskButton();
            await adhoctaskTemplate.setSummary("Summary2" + randomStr);
            await adhoctaskTemplate.setDescription("Description");
            await adhoctaskTemplate.selectPriority('High');
            await adhoctaskTemplate.selectCategoryTier1('Employee Relations');
            await adhoctaskTemplate.selectCategoryTier2('Compensation');
            await adhoctaskTemplate.selectCategoryTier3('Bonus');
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'US Support 1');
            await adhoctaskTemplate.clickSaveAdhoctask();
            await utilityCommon.closePopUpMessage();
            await manageTaskBladePo.clickTaskLink("Summary2" + randomStr);
            expect(await viewTask.getAssignedGroupText()).toBe('US Support 1');
            expect(await viewTask.getAssigneeText()).toBe('None', 'None assignee Text is missing');
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //ankagraw..not fixed
    describe('[6088]: [Edit Task] Update summary, status, description and assignment', async () => {
        const randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let casetemplatePetramco, templateData, externaltemplateData, automatedtemplateData;
        let month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        beforeAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            casetemplatePetramco = {
                "templateName": 'caseTemplateName' + randomStr,
                "templateSummary": 'caseTemplateName' + randomStr,
                "templateStatus": "Active",
                "categoryTier1": "Employee Relations",
                "categoryTier2": "Compensation",
                "categoryTier3": "Bonus",
                "casePriority": "Low",
                "caseStatus": "New",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 1",
                "assignee": "qtao",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }
            let newCaseTemplate = await apiHelper.createCaseTemplate(casetemplatePetramco);
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
            let manualTaskTemplate = await apiHelper.createManualTaskTemplate(templateData);
            externaltemplateData = {
                "templateName": 'External task19011' + randomStr,
                "templateSummary": 'External task19011' + randomStr,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 1",
                "assignee": "qtao",
            }
            let externalTaskTemplate = await apiHelper.createExternalTaskTemplate(externaltemplateData);
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
            let automatedTaskTemplate = await apiHelper.createAutomatedTaskTemplate(automatedtemplateData);
            await apiHelper.associateCaseTemplateWithThreeTaskTemplate(newCaseTemplate.displayId, manualTaskTemplate.displayId, externalTaskTemplate.displayId, automatedTaskTemplate.displayId);
        });
        it('[6088]: [Edit Task] Update summary, status, description and assignment', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('qtao');
            await createCasePage.setSummary('DRDMV1579Summary' + randomStr);
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(casetemplatePetramco.templateName);
            await createCasePage.setContactName('Elizabeth Peters');
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            //Adhoc task validation
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.clickAddAdhocTaskButton();
            expect(await adhoctaskTemplate.isAttachmentButtonDisplayed()).toBeTruthy();
            expect(await adhoctaskTemplate.isTaskSummaryRequiredTextPresent()).toBeTruthy("Summary");
            expect(await adhoctaskTemplate.isPriorityRequiredTextPresent()).toBeTruthy("priority");
            expect(await adhoctaskTemplate.isAssignedCompanyRequiredTextPresent()).toBeTruthy("company");
            expect(await adhoctaskTemplate.isAssignedGroupRequiredTextPresent()).toBeTruthy("assigned group");
            await adhoctaskTemplate.setSummary("Summary" + randomStr);
            await adhoctaskTemplate.setDescription("Description");
            await adhoctaskTemplate.selectPriority('High');
            await adhoctaskTemplate.selectCategoryTier1(casetemplatePetramco.categoryTier1);
            await adhoctaskTemplate.selectCategoryTier2(casetemplatePetramco.categoryTier2);
            await adhoctaskTemplate.selectCategoryTier3(casetemplatePetramco.categoryTier3);
            await adhoctaskTemplate.clickAssignToMeButton();
            await adhoctaskTemplate.clickSaveAdhoctask();
            await utilityCommon.closePopUpMessage();
            await manageTaskBladePo.clickCloseButton();
        });
        it('[6088]: [Edit Task] Update summary, status, description and assignment', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsolePage.searchAndOpenCase('DRDMV1579Summary' + randomStr);
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.clickTaskLink("Summary" + randomStr);
            await viewTask.clickOnEditTask();
            expect(await editTask.isFieldsDisplyed('Assignment Section')).toBeTruthy();
            expect(await editTask.isRequesterNameDisplayed('Qianru Tao')).toBeTruthy();
            expect(await editTask.isFieldsDisplyed('Requester Mail')).toBeTruthy();
            expect(await editTask.isFieldsDisplyed('CategoryTier1Value')).toBeTruthy();
            expect(await editTask.isFieldsDisplyed('CategoryTier2Value')).toBeTruthy();
            expect(await editTask.isFieldsDisplyed('CategoryTier3Value')).toBeTruthy();
            expect(await editTask.isFieldsDisplyed('Assignee Name')).toBeTruthy();
            expect(await editTask.isFieldsDisplyed('Assign Company')).toBeTruthy();
            expect(await editTask.isRequiredTextPresent('Task Summary')).toBeTruthy();
            expect(await editTask.isRequiredTextPresent('Priority')).toBeTruthy();
            expect(await editTask.isRequiredTextPresent('Assigned Group')).toBeTruthy();
            expect(await editTask.isRequiredTextPresent('Assigned Company')).toBeTruthy();
            await editTask.clickOnCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });
        it('[6088]: [Edit Task] Update summary, status, description and assignment', async () => {
            await viewTask.clickOnEditTask();
            await editTask.selectTaskCategoryTier1('Payroll');
            await editTask.selectTaskCategoryTier2('Finance');
            await editTask.selectTaskCategoryTier3('Reporting');
            await editTask.selectPriorityValue('Low');
            await editTask.updateTaskSummary('UpdatedSummary' + randomStr);
            await editTask.setDescription('Description' + randomStr);
            await editTask.clickOnChangeAssignementButton();
            await changeAssignmentBladePo.setDropDownValue('SupportOrg', 'HR Support');
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'Workforce Administration');
            await changeAssignmentBladePo.setDropDownValue('Assignee', 'Peter Kahn');
            await changeAssignmentBladePo.clickOnAssignButton();
            await editTask.clickOnCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            await navigationPage.gotoCaseConsole();
            await caseConsolePage.searchAndOpenCase('DRDMV1579Summary' + randomStr);
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.clickTaskLink("Summary" + randomStr);
            expect((await viewTask.getDescriptionValue()).trim()).toBe("Description");
            expect(await viewTask.getCategoryTier1Value()).toBe(casetemplatePetramco.categoryTier1);
            expect(await viewTask.getCategoryTier2Value()).toBe(casetemplatePetramco.categoryTier2);
            expect(await viewTask.getCategoryTier3Value()).toBe(casetemplatePetramco.categoryTier3);
            expect(await viewTask.getTaskSummaryValue()).toBe('Summary' + randomStr);
            expect(await viewTask.getAssignedGroupText()).toBe(casetemplatePetramco.ownerGroup);
            expect(await viewTask.getAssigneeText()).toBe('Qadim Katawazi');
        });
        it('[6088]: [Edit Task] Update summary, status, description and assignment', async () => {
            await viewTask.clickOnEditTask();
            await editTask.selectTaskCategoryTier1('Payroll');
            await editTask.selectTaskCategoryTier2('Finance');
            await editTask.selectTaskCategoryTier3('Reporting');
            await editTask.selectPriorityValue('Low');
            await editTask.updateTaskSummary('UpdatedSummary' + randomStr);
            await editTask.setDescription('UpdatedDescription' + randomStr);
            await editTask.clickOnChangeAssignementButton();
            await changeAssignmentBladePo.setDropDownValue('SupportOrg', 'HR Support');
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'Workforce Administration');
            await changeAssignmentBladePo.setDropDownValue('Assignee', 'Peter Kahn');
            await changeAssignmentBladePo.clickOnAssignButton();
            await editTask.clickOnSaveButton();
            let modifiedDate = new Date();
            let monthValue: string = month[modifiedDate.getMonth()];
            let modifiedMonthValue = monthValue.substring(0, 3);
            let time = modifiedDate.toLocaleTimeString();
            let diffTime = time.split(" ");
            let newTime = diffTime[0].split(":");
            let exactTime = newTime[0] + ":" + newTime[1] + " " + diffTime[1];
            let modifiedDateFormate = modifiedMonthValue + " " + modifiedDate.getDate() + ", " + modifiedDate.getFullYear() + " " + exactTime;
            expect((await viewTask.getDescriptionValue()).trim()).toBe('UpdatedDescription' + randomStr);
            expect(await viewTask.getCategoryTier1Value()).toBe('Payroll');
            expect(await viewTask.getCategoryTier2Value()).toBe('Finance');
            expect(await viewTask.getCategoryTier3Value()).toBe('Reporting');
            expect(await viewTask.getTaskSummaryValue()).toBe('UpdatedSummary' + randomStr);
            expect(await viewTask.getAssignedGroupText()).toBe('Workforce Administration');
            expect(await viewTask.getAssigneeText()).toBe('Peter Kahn');
            await viewTask.clickOnViewCase();
            await navigationPage.gotoTaskConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.typeInFilterExperssion("Modified Date:" + modifiedDateFormate);
            expect(await utilityGrid.isGridRecordPresent('UpdatedSummary' + randomStr)).toBeTruthy('UpdatedSummary' + randomStr);
        });
        it('[6088]: [Edit Task] Update summary, status, description and assignment', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsolePage.searchAndOpenCase('DRDMV1579Summary' + randomStr);
            await expect(viewCasePage.getRequesterName()).toBe('Qianru Tao');
            await viewCasePage.clickOnContactPersonerDrpDwn();
            await expect(viewCasePage.getContactPersonName()).toBe('Elizabeth Peters');
            await viewCasePage.clickEditCaseButton();
            await editCasePo.clickChangeAssignmentButton();
            await changeAssignmentBladePo.setDropDownValue('SupportOrg', 'United States Support');
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'US Support 2');
            await changeAssignmentBladePo.setDropDownValue('Assignee', 'Qiao Feng');
            await changeAssignmentBladePo.clickOnAssignButton();
            await editCasePo.clickSaveCase();
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.clickAddAdhocTaskButton();
            await adhoctaskTemplate.setSummary("AdHocSummary" + randomStr);
            await adhoctaskTemplate.clickSaveAdhoctask();
            await manageTaskBladePo.clickTaskLink("AdHocSummary" + randomStr);
            await expect(viewTask.getRequesterName()).toBe('Qianru Tao');
            await expect(viewTask.getContactPersonName()).toBe('Elizabeth Peters');
            expect(await viewTask.getAssignedGroupText()).toBe('US Support 2');
            expect(await viewTask.getAssigneeText()).toBe('Qiao Feng');
            await viewTask.clickOnEmailAddress('qtao@petramco.com');
            await composeMailPo.clickOnDiscardButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            await viewTask.clickOnRequesterName();
            await utilityCommon.switchToNewTab(1);
            await expect(personProfilePo.getPersonName()).toBe('Qianru Tao');
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        });
        it('[6088]: [Edit Task] Update summary, status, description and assignment', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsolePage.searchAndOpenCase('DRDMV1579Summary' + randomStr);
            await updateStatusBladePo.changeCaseStatus("In Progress");
            await updateStatusBladePo.clickSaveStatus();
            await utilityCommon.closePopUpMessage();
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(templateData.templateName);
            await viewTask.clickOnContactName();
            await utilityCommon.switchToNewTab(1);
            await expect(personProfilePo.getPersonName()).toBe('Elizabeth Peters');
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await viewTask.clickOnEditTask();
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'US Support 2');
            await editTask.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
            expect(await viewTask.getAssignedGroupText()).toBe(templateData.supportGroup);
            expect(await viewTask.getAssigneeText()).toBe('None', 'None assignee Text is missing');
            await viewTask.clickOnChangeStatus();
            await viewTask.changeTaskStatus('In Progress');
            expect(await viewTask.getErrorMsgOfInprogressStatus()).toBe('Assignee is required for this task status.  Please select an assignee. ');
            await updateStatusBladePo.clickCancelButton();
        });
        it('[6088]: [Edit Task] Update summary, status, description and assignment', async () => {
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(externaltemplateData.templateName);
            await viewTask.clickOnEditTask();
            expect(await editTask.isRequesterNameDisplayed('Qianru Tao')).toBeTruthy();
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink("AdHocSummary" + randomStr);
            await viewTask.clickOnEditTask();
            expect(await editTask.isRequesterNameDisplayed('Qianru Tao')).toBeTruthy();
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });
    //12124 test case is not valid after 21.02
});
