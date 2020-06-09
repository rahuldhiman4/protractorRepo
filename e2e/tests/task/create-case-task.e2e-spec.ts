import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import caseConsolePage from '../../pageobject/case/case-console.po';
import previewCasePo from '../../pageobject/case/case-preview.po';
import createCasePage from '../../pageobject/case/create-case.po';
import quickCase from "../../pageobject/case/quick-case.po";
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import viewCasePage from "../../pageobject/case/view-case.po";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import updateStatusBladePo from '../../pageobject/common/update.status.blade.po';
import selectTaskTemplate from "../../pageobject/settings/task-management/console-tasktemplate.po";
import taskTemplate from "../../pageobject/settings/task-management/create-tasktemplate.po";
import editTaskTemplate from "../../pageobject/settings/task-management/edit-tasktemplate.po";
import viewTasktemplatePo from "../../pageobject/settings/task-management/view-tasktemplate.po";
import consoleTask from "../../pageobject/task/console-task.po";
import editTask from "../../pageobject/task/edit-task.po";
import manageTask from "../../pageobject/task/manage-task-blade.po";
import viewTask from "../../pageobject/task/view-task.po";
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilGrid from '../../utils/util.grid';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';
import manageTaskBladePo from '../../pageobject/task/manage-task-blade.po';

let menuItemDataFile = require('../../data/ui/ticketing/menuItem.ui.json');

describe('Create Case Task', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    //ankagraw
    describe('[DRDMV-7165,DRDMV-7147]: Update Task Type field for any task', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseID = "";
        beforeAll(async () => {
            let manualTaskTemplateData = {
                "templateName": `manualTaskTemplateDraft ${randomStr}`,
                "templateSummary": `manualTaskTemplateDraft ${randomStr}`,
                "templateStatus": "Active",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            let autoTaskTemplateData = {
                "templateName": `AutomatedTaskTemplateActive ${randomStr}`,
                "templateSummary": `AutomatedTaskTemplateActive ${randomStr}`,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": `Case Process 1 ${randomStr}`,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            let caseData1 = {
                "Requester": "Fritz",
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
        it('added task on created case', async () => {
            //open create case
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotoCaseConsole();
            await caseConsolePage.searchAndOpenCase(caseID);
            await viewCasePage.clickAddTaskButton();

            //Add Manual task and Automation Task in Case
            await manageTask.addTaskFromTaskTemplate(`AutomatedTaskTemplateActive ${randomStr}`);
            await manageTask.addTaskFromTaskTemplate(`manualTaskTemplateDraft ${randomStr}`)
            expect(await manageTask.isTaskLinkPresent(`manualTaskTemplateDraft ${randomStr}`)).toBeTruthy(`manualTaskTemplateDraft ${randomStr}` + ' Task is not added to case');
            expect(await manageTask.isTaskLinkPresent(`AutomatedTaskTemplateActive ${randomStr}`)).toBeTruthy(`AutomatedTaskTemplateActive ${randomStr}` + ' Task is not added to case');
        });
        it('[DRDMV-7165,DRDMV-7147]: Update Task Type field for any task', async () => {
            //validate Manual Template
            await manageTask.clickTaskLink(`manualTaskTemplateDraft ${randomStr}`);
            await viewTask.clickOnEditTask();
            expect(await editTask.getTaskTypeValue()).toBe('Manual');
            expect(await editTask.getTaskTypeValueAttribute('disabled')).toBeTruthy();
            expect(await editTask.processNamePresentInTask()).toBeFalsy();

            //validate Automation Template
            await editTask.clickOnCancelButton();
            await viewTask.clickOnViewCase();
            await viewCasePage.openTaskCard(1);
            await manageTask.clickTaskLink(`AutomatedTaskTemplateActive ${randomStr}`);
            await viewTask.clickOnEditTask();
            expect(await editTask.getTaskTypeValue()).toBe('Automated');
            expect(await editTask.getTaskTypeValueAttribute('disabled')).toBeTruthy();
            expect(await editTask.processNamePresentInTask()).toBeTruthy();

        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        });
    });

    //ankagraw
    describe('[DRDMV-7148,DRDMV-7140,DRDMV-745,DRDMV-793]: Automatic Task data validation once Task is created', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let menuItemName: string = await menuItemDataFile['sampleMenuItem'].menuItemName + randomStr;
        let autmationTaskTemplateWithRequiredData = 'Automatic task With Required Field' + Math.floor(Math.random() * 1000000);
        let autmationTaskSummaryWithRequiredData = 'Automatic task Summary With Required Field' + Math.floor(Math.random() * 1000000);
        let automationTaskTemplateWithallField = 'Automation task with All field' + Math.floor(Math.random() * 1000000);
        let automationTaskSummaryWithallField = 'Automation task Summary with All field' + Math.floor(Math.random() * 1000000) + 1;
        beforeAll(async () => {
            menuItemDataFile['sampleMenuItem'].menuItemName = menuItemName;
            await apiHelper.apiLogin('tadmin');
            await apiHelper.associateCategoryToCategory('Chatter', 'Failure');
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createNewMenuItem(menuItemDataFile['sampleMenuItem']);
        });
        it('create manual task template', async () => {
            //Automated task Template with Required Data
            await navigationPage.gotoCaseConsole();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.clickOnAutomationTaskTemplateButton();
            await taskTemplate.setTemplateName(autmationTaskTemplateWithRequiredData);
            await taskTemplate.setTaskSummary(autmationTaskSummaryWithRequiredData);
            await taskTemplate.selectCompanyByName('Petramco')
            await taskTemplate.setNewProcessName('Business Workflows', `Get Request Status Data1 ${randomStr}`);
            await taskTemplate.selectTemplateStatus('Active');
            await taskTemplate.clickOnSaveTaskTemplate();
            expect(await viewTasktemplatePo.getTaskCompanyNameValue()).toBe("Petramco");
            //await utilCommon.closePopUpMessage();
        });
        it('create manual task template', async () => {
            //Automation Task template
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.clickOnAutomationTaskTemplateButton();
            await taskTemplate.setTemplateName(automationTaskTemplateWithallField);
            await taskTemplate.setTaskSummary(automationTaskSummaryWithallField);
            await taskTemplate.setTaskDescription('All field get added in this task template');
            await taskTemplate.selectCompanyByName('Petramco');
            await taskTemplate.setNewProcessName('Business Workflows', `Get Request Status Data2 ${randomStr}`);
            await taskTemplate.selectLabel(menuItemName);
            await taskTemplate.selectTaskCategoryTier1('Applications');
            await taskTemplate.selectTaskCategoryTier2('Social');
            await taskTemplate.selectTaskCategoryTier3('Chatter');
            await taskTemplate.selectTaskCategoryTier4('Failure');
            await taskTemplate.selectTemplateStatus('Active');
            await taskTemplate.clickOnSaveTaskTemplate();
            expect(await viewTasktemplatePo.getTaskCompanyNameValue()).toBe("Petramco");
            await utilityCommon.closePopUpMessage();
        });
        it('create case and add tasks on it task template', async () => {
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
            await manageTask.addTaskFromTaskTemplate(autmationTaskTemplateWithRequiredData);
            await manageTask.addTaskFromTaskTemplate(automationTaskTemplateWithallField);

            //Add Automation Task templates in Case
            expect(await manageTask.isTaskLinkPresent(autmationTaskSummaryWithRequiredData)).toBeTruthy(autmationTaskTemplateWithRequiredData + ' Task is not added to case');
            expect(await manageTask.isTaskLinkPresent(automationTaskSummaryWithallField)).toBeTruthy(automationTaskTemplateWithallField + ' Task is not added to case');
        });
        it('Validate manual task', async () => {
            //validate Automation Template With Required Field
            await manageTask.clickTaskLink(automationTaskSummaryWithallField);
            expect(await viewTask.getTaskTypeValue()).toBe('Automated');
            expect(await viewTask.getProcessNameValue()).toBe(`com.bmc.dsm.bwfa:Get Request Status Data2 ${randomStr}`);
            expect((await viewTask.getDescriptionValue()).trim()).toBe('All field get added in this task template');
            expect(await viewTask.getLabelValue()).toBe(menuItemName);
            expect(await viewTask.getCategoryTier1Value()).toBe('Applications');
            expect(await viewTask.getCategoryTier2Value()).toBe('Social');
            expect(await viewTask.getCategoryTier3Value()).toBe('Chatter');
            expect(await viewTask.getCategoryTier4Value()).toBe('Failure');
        });
        it('[DRDMV-7148,DRDMV-7140,DRDMV-745,DRDMV-793]: Automatic Task data validation once Task is created', async () => {
            //validate Automation Template
            await viewTask.clickOnViewCase();
            await viewCasePage.openTaskCard(1);
            await manageTask.clickTaskLink(autmationTaskSummaryWithRequiredData);
            expect(await viewTask.getTaskTypeValue()).toBe('Automated');
            expect(await viewTask.getProcessNameValue()).toBe(`com.bmc.dsm.bwfa:Get Request Status Data1 ${randomStr}`);
            expect(await viewTask.getDescriptionValue()).toBe(' - ', "getDescriptionValue");
            expect(await viewTask.getLabelValue()).toBe('-', "getLabelValue");
            expect(await viewTask.getCategoryTier1Value()).toBe('-', "getCategoryTier1Value");
            expect(await viewTask.getCategoryTier2Value()).toBe('-', "getCategoryTier2Value");
            expect(await viewTask.getCategoryTier3Value()).toBe('-', "getCategoryTier3Value");
            expect(await viewTask.getCategoryTier4Value()).toBe('-', "getCategoryTier4Value");
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        });
    });

    //ankagraw
    describe('[DRDMV-7124]: [Automatic Task] - Task Template UI in Edit mode: New fields validations', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            let templateData = {
                "templateName": `manualTaskTemplateActive ${randomStr}`,
                "templateSummary": `manualTaskTemplateActive ${randomStr}`,
                "templateStatus": "Active",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            let templateData1 = {
                "templateName": `manualTaskTemplateInActive ${randomStr}`,
                "templateSummary": `manualTaskTemplateInActive ${randomStr}`,
                "templateStatus": "Inactive",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            let templateData2 = {
                "templateName": `manualTaskTemplateDraft ${randomStr}`,
                "templateSummary": `manualTaskTemplateDraft ${randomStr}`,
                "templateStatus": "Draft",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }

            let templateData4 = {
                "templateName": `AutomatedTaskTemplateActive ${randomStr}`,
                "templateSummary": `AutomatedTaskTemplateActive ${randomStr}`,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": `Case Process 1 ${randomStr}`,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }

            let templateData5 = {
                "templateName": `AutomatedTaskTemplateInActive ${randomStr}`,
                "templateSummary": `AutomatedTaskTemplateInActive ${randomStr}`,
                "templateStatus": "Inactive",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": `Case Process 2 ${randomStr}`,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }

            let templateData6 = {
                "templateName": `AutomatedTaskTemplateDraft ${randomStr}`,
                "templateSummary": `AutomatedTaskTemplateDraft ${randomStr}`,
                "templateStatus": "Draft",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": `Case Process 3 ${randomStr}`,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }

            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createAutomatedTaskTemplate(templateData4);
            await apiHelper.createAutomatedTaskTemplate(templateData5);
            await apiHelper.createAutomatedTaskTemplate(templateData6);
            await apiHelper.createManualTaskTemplate(templateData);
            await apiHelper.createManualTaskTemplate(templateData1);
            await apiHelper.createManualTaskTemplate(templateData2);
        });
        it('Verify the manual Active task template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.searchAndOpenTaskTemplate(`manualTaskTemplateActive ${randomStr}`);
            expect(await viewTasktemplatePo.getTaskTypeValue()).toBe('Manual');
            await viewTasktemplatePo.clickOnEditLink();
            expect(await editTaskTemplate.getTaskTypeValue()).toBe('Manual');
            expect(await editTaskTemplate.getTaskTypeValueAttribute("disabled")).toBeTruthy();
            expect(await editTaskTemplate.isProcessNamePresentInTask()).toBeFalsy();
        });
        it('Verify the manual inActive task template ', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.searchAndOpenTaskTemplate(`manualTaskTemplateInActive ${randomStr}`);
            expect(await viewTasktemplatePo.getTaskTypeValue()).toBe('Manual');
            await viewTasktemplatePo.clickOnEditLink();
            expect(await editTaskTemplate.getTaskTypeValue()).toBe('Manual');
            expect(await editTaskTemplate.getTaskTypeValueAttribute("disabled")).toBeTruthy();
            expect(await editTaskTemplate.isProcessNamePresentInTask()).toBeFalsy();
        });
        it('Verify the manual Draft task template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.searchAndOpenTaskTemplate(`manualTaskTemplateDraft ${randomStr}`);
            expect(await viewTasktemplatePo.getTaskTypeValue()).toBe('Manual');
            await viewTasktemplatePo.clickOnEditLink();
            expect(await editTaskTemplate.getTaskTypeValue()).toBe('Manual');
            expect(await editTaskTemplate.getTaskTypeValueAttribute("disabled")).toBeTruthy();
            expect(await editTaskTemplate.isProcessNamePresentInTask()).toBeFalsy();
        });
        it('Verify the Automation Active task template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.searchAndOpenTaskTemplate(`AutomatedTaskTemplateActive ${randomStr}`);
            expect(await viewTasktemplatePo.getTaskTypeValue()).toBe('Automated');
            await viewTasktemplatePo.clickOnEditLink();
            expect(await editTaskTemplate.getTaskTypeValue()).toBe('Automated');
            expect(await editTaskTemplate.getTaskTypeValueAttribute("disabled")).toBeTruthy();
            expect(await editTaskTemplate.isProcessNamePresentInTask()).toBeTruthy();
        });
        it('Verify the Automation inActive task template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.searchAndOpenTaskTemplate(`AutomatedTaskTemplateInActive ${randomStr}`);
            expect(await viewTasktemplatePo.getTaskTypeValue()).toBe('Automated');
            await viewTasktemplatePo.clickOnEditLink();
            expect(await editTaskTemplate.getTaskTypeValue()).toBe('Automated');
            expect(await editTaskTemplate.getTaskTypeValueAttribute("disabled")).toBeTruthy();
            expect(await editTaskTemplate.isProcessNamePresentInTask()).toBeTruthy();
        });
        it('[DRDMV-7124]: [Automatic Task] - Task Template UI in Edit mode: New fields validations', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.searchAndOpenTaskTemplate(`AutomatedTaskTemplateDraft ${randomStr}`);
            expect(await viewTasktemplatePo.getTaskTypeValue()).toBe('Automated');
            await viewTasktemplatePo.clickOnEditLink();
            expect(await editTaskTemplate.getTaskTypeValue()).toBe('Automated');
            expect(await editTaskTemplate.getTaskTypeValueAttribute("disabled")).toBeTruthy();
            expect(await editTaskTemplate.isProcessNamePresentInTask()).toBeTruthy();
        });
    });

    //ankagraw
    describe('[DRDMV-12039,DRDMV-12040,DRDMV-12009,DRDMV-12084]: [ Task ] - Verify Associated menu for Task will show global configuration values as well	 ', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let globalCategName = 'MyDemoCateg1';
        let categName2 = 'MyDemoCateg2';
        let categName3 = 'MyDemoCateg3';
        let TaskTemplate = 'Manual task' + randomStr;
        let TaskSummary = 'Summary' + randomStr;
        let manualSummary = 'Summary' + randomStr;
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.createOperationalCategory(globalCategName, true);
            await apiHelper.createOperationalCategory(categName2);
            await apiHelper.createOperationalCategory(categName3);
            await apiHelper.associateCategoryToCategory(globalCategName, categName2);
            await apiHelper.associateCategoryToCategory(categName2, categName3);
        });
        it('Create Manual task with global category ', async () => {
            //manual Task template
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.clickOnManualTaskTemplateButton();
            await taskTemplate.setTemplateName(TaskTemplate);
            await taskTemplate.setTaskSummary(TaskSummary);
            await taskTemplate.setTaskDescription('Description');
            await taskTemplate.selectCompanyByName('Global');
            await taskTemplate.selectTaskCategoryTier1(globalCategName);
            await taskTemplate.selectTaskCategoryTier2(categName2);
            await taskTemplate.selectTaskCategoryTier3(categName3);
            await taskTemplate.selectTemplateStatus('Active');
            await taskTemplate.clickOnSaveTaskTemplate();
            await utilCommon.closePopUpMessage();
            expect(await viewTasktemplatePo.getCategoryTier1Value()).toBe(globalCategName);
            expect(await viewTasktemplatePo.getCategoryTier2Value()).toBe(categName2);
            expect(await viewTasktemplatePo.getCategoryTier3Value()).toBe(categName3);
            expect(await viewTasktemplatePo.getTaskCompanyNameValue()).toBe('- Global -')
        });
        it('Create case with above task template ', async () => {
            //Create a Case
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary('Summary ' + manualSummary);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.selectCategoryTier1(globalCategName);
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await utilityCommon.closePopUpMessage();
            expect(await viewCasePage.getCategoryTier1Value()).toBe(globalCategName, "Global Category Not Present");
        });
        it('[DRDMV-12039,DRDMV-12040,DRDMV-12009,DRDMV-12084]: [ Task ] - Verify Associated menu for Task will show global configuration values as well', async () => {
            //Got To Another Case
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary('Summary 123 ' + manualSummary);
            await createCasePage.selectCategoryTier1('Applications');
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePage.getCategoryTier1Value()).toBe('Applications', "Applications Category Not Present");
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });

    });

    //ankagraw
    describe('[DRDMV-12558]: Task Template submitter from different company of owner group can edit the template', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let TaskTemplate = 'Manual task' + randomStr;
        let TaskSummary = 'Summary' + randomStr;
        let description = 'description' + randomStr;
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            let userData = {
                "firstName": "Petramco",
                "lastName": "Psilon",
                "userId": "DRDMV-12558",
            }
            await apiHelper.createNewUser(userData);
            await apiHelper.associatePersonToCompany(userData.userId, "Petramco");
            await apiHelper.associatePersonToCompany(userData.userId, "Psilon");
            await apiHelper.associatePersonToSupportGroup(userData.userId, "Psilon Support Group2");
        });
        it('Login with Psilon user', async () => {
            await navigationPage.signOut();
            await loginPage.login("DRDMV-12558" + "@petramco.com", 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.clickOnManualTaskTemplateButton();
            await taskTemplate.setTemplateName(TaskTemplate);
            await taskTemplate.setTaskSummary(TaskSummary);
            await taskTemplate.selectCompanyByName('Psilon');
            await taskTemplate.selectOwnerCompany('Psilon');
            await taskTemplate.clickOnSaveTaskTemplate();
            expect(await viewTasktemplatePo.getTaskTypeValue()).toBe('Manual');
            await utilCommon.closePopUpMessage();
        });
        it('[DRDMV-12558]: Edit the above template', async () => {
            //search above template
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.searchAndOpenTaskTemplate(TaskTemplate);
            await viewTasktemplatePo.clickOnEditLink();
            await editTaskTemplate.setDescription(description);
            await editTaskTemplate.selectTaskCategoryTier1('Applications');
            await editTaskTemplate.selectTaskCategoryTier2('Social');
            await editTaskTemplate.selectTaskCategoryTier3('Chatter');
            await editTaskTemplate.clickOnSaveButton();
            await utilCommon.closePopUpMessage();
            expect(await viewTasktemplatePo.getTaskDescriptionNameValue()).toBe(description, 'description is not present');
            expect(await viewTasktemplatePo.getCategoryTier1Value()).toBe('Applications', 'Applications is not present');
            expect(await viewTasktemplatePo.getCategoryTier2Value()).toBe('Social', 'Social is not present');
            expect(await viewTasktemplatePo.getCategoryTier3Value()).toBe('Chatter', 'Chatter is not present');
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi")
        });

    });

    //ankagraw
    describe('[DRDMV-12582]: Task Template access when owner group from different company is applied', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let TaskTemplate = 'Manual task' + randomStr;
        let TaskSummary = 'Summary' + randomStr;
        let description = 'description' + randomStr;
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            let userData = {
                "firstName": "Petramco",
                "lastName": "Psilon",
                "userId": "DRDMV-12582",
            }
            await apiHelper.createNewUser(userData);
            await apiHelper.associatePersonToCompany(userData.userId, "Petramco");
            await apiHelper.associatePersonToCompany(userData.userId, "Psilon");
            await apiHelper.associatePersonToSupportGroup(userData.userId, "Facilities");
            await apiHelper.associatePersonToSupportGroup(userData.userId, "Psilon Support Group2");

            let templateData1 = {
                "templateName": TaskTemplate,
                "templateSummary": TaskSummary,
                "templateStatus": "Active",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createManualTaskTemplate(templateData1);
        });
        //search above template
        it('[DRDMV-12582]: Login with psilon user and update the task template', async () => {
            await navigationPage.signOut();
            await loginPage.login("DRDMV-12582" + "@petramco.com", 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
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
    });

    //ankagraw
    describe('[DRDMV-7149]: [Automatic Task] - Automated Task Status transition validation', async () => {
        let automationTaskTemplate = 'Automatic task' + Math.floor(Math.random() * 1000000);
        let automationTaskSummary = 'Summary' + Math.floor(Math.random() * 1000000);
        let createCase = 'Create Case task' + Math.floor(Math.random() * 1000000);
        let processName = 'process' + Math.floor(Math.random() * 1000000);
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
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            //Automation Task template
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createAutomatedTaskTemplate(templateData);
        });
        it('Create case and add task on it', async () => {
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
            await manageTask.addTaskFromTaskTemplate(automationTaskTemplate);
            await manageTask.clickCloseButton();
        });
        it('[DRDMV-7149]: Verify the task status', async () => {
            //validate Automation Template With Required Field
            await updateStatusBladePo.changeCaseStatus("In Progress");
            await updateStatusBladePo.clickSaveStatus();
            // await utilCommon.closePopUpMessage();
            await viewCasePage.clickAddTaskButton();
            await manageTask.clickTaskLink(automationTaskSummary);
            await viewTask.clickOnChangeStatus();
            await viewTask.clickOnUpdateStatusDrpdown();
            expect(await viewTask.allTaskOptionsPresent(status)).toBeTruthy("Staus Not Found");
            await viewTask.clickOnCancelStatus();
            await viewTask.clickOnChangeStatus();
            await viewTask.changeTaskStatus('Closed');
            await viewTask.clickOnSaveStatus();
            await utilityCommon.closePopUpMessage();
            expect(await viewTask.getTaskStatusValue()).toBe('Closed');
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //ankagraw
    it('[DRDMV-7121]: [Automatic Task] - Task Template Console: Verify Task Type column, filter ', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await utilGrid.clearFilter();
        expect(await selectTaskTemplate.clickOnColumnAndIsColumnSortedAsending('Task Type')).toBeTruthy();
        expect(await selectTaskTemplate.clickOnColumnAndIsColumnSortedDescending('Task Type')).toBeTruthy();
        await selectTaskTemplate.clickOnApplyFilter('Task Type', 'Manual');
        expect(await selectTaskTemplate.isTaskTypeFilterValue('Manual')).toBeTruthy();
        await utilGrid.clearFilter();
        await selectTaskTemplate.clickOnApplyFilter('Task Type', 'Automated');
        //await utilCommon.waitUntilSpinnerToHide();
        expect(await selectTaskTemplate.isTaskTypeFilterValue('Automated')).toBeTruthy();
        await utilGrid.clearFilter();
        await utilCommon.waitUntilSpinnerToHide();
    });

    //ankagraw
    it('[DRDMV-3766]: [Task Template Console] Task Template Console verification', async () => {
        let addColoumn: string[] = ['Label'];
        let allColoumn: string[] = ['Template Name', 'Template Status', 'Task Type', 'Task Category Tier 1', 'Task Category Tier 2', 'Assignee', 'Support Group', 'Modified Date', 'Task Company'];
        let updateAllColoumn: string[] = ['Template Name', 'Template Status', 'Task Type', 'Task Category Tier 1', 'Task Category Tier 2', 'Assignee', 'Support Group', 'Modified Date', 'Task Company', 'Label'];
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        expect(await selectTaskTemplate.isAllColumnTitleDisplayed(allColoumn)).toBeTruthy("All Coloumn is not present");
        await selectTaskTemplate.addColumn(addColoumn);
        expect(await selectTaskTemplate.isAllColumnTitleDisplayed(updateAllColoumn)).toBeTruthy("Updated All Coloumn is not present");
        await selectTaskTemplate.removeColumn(addColoumn);
    });

    //ankagraw
    it('[DRDMV-7201]: [Automatic Task] - Task Console: Task Type column and filter validation', async () => {
        await navigationPage.gotoTaskConsole();
        await utilityGrid.clearFilter();
        expect(await consoleTask.clickOnColumnAndIsColumnSortedAsending('Task Type')).toBeTruthy();
        expect(await consoleTask.clickOnColumnAndIsColumnSortedDescending('Task Type')).toBeTruthy();
        await utilityGrid.addFilter('Task Type', 'Manual', "checkbox");
        expect(await consoleTask.isTaskTypeFilterValue('Manual')).toBeTruthy();
        await utilityGrid.clearFilter();
        await utilityGrid.addFilter('Task Type', 'Automated', "checkbox");
        expect(await consoleTask.isTaskTypeFilterValue('Automated')).toBeTruthy();
        await utilityGrid.clearFilter();
    });

    //ankagraw
    describe('[DRDMV-7141,DRDMV-7122]: [Automatic Task] - Task template selection Console: Verify Task Type column, filter', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            let templateData1 = {
                "templateName": `manualTaskTemplateActive ${randomStr}`,
                "templateSummary": `manualTaskTemplateActive ${randomStr}`,
                "templateStatus": "Active",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            let templateData2 = {
                "templateName": `AutomatedTaskTemplateActive ${randomStr}`,
                "templateSummary": `AutomatedTaskTemplateActive ${randomStr}`,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": `Case Process 1 ${randomStr}`,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }

            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createAutomatedTaskTemplate(templateData2);
            await apiHelper.createManualTaskTemplate(templateData1);
        });
        it('Create case and add task on it', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('set summary');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePage.clickAddTaskButton();
            await manageTask.clickAddTaskFromTemplateButton();
            await utilityGrid.clearFilter();
        });
        it('[DRDMV-7141,DRDMV-7122]: Verify the console of select task template', async () => {
            await manageTask.clickGridColumnHeader('Task Type');
            expect(await utilityGrid.isGridColumnSorted('Task Type', 'asc')).toBeTruthy();
            await manageTask.clickGridColumnHeader('Task Type');
            expect(await utilityGrid.isGridColumnSorted('Task Type', 'desc')).toBeTruthy();
            await utilityGrid.addFilter('Task Type', 'Manual', 'checkbox');
            expect(await manageTask.getFilterValue('Manual')).toBeTruthy();
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Task Type', 'Automated', 'checkbox');
            //await utilCommon.waitUntilSpinnerToHide();
            expect(await manageTask.getFilterValue('Automated')).toBeTruthy();
            await utilityGrid.clearFilter();
            manageTaskBladePo.clickTaskGridCancelButton();
            await manageTask.clickCloseButton();
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //ankagraw
    describe('[DRDMV-2475]: [Permissions] Settings menu for Case Functional Roles', async () => {
        let caseManagementList: string[] = ['Case Management', 'Approvals', 'Assignments', 'Automated Status Transition', 'Notes Template', 'Read Access', 'Status Configuration', 'Templates'];
        let manageFlowsetList: string[] = ['Manage Flowsets', 'Define Flowsets', 'Process Library'];
        let serviceLevelManagementList: string[] = ['Service Level Management', 'Business Time Segment', 'Business Time Shared Entity', 'Configure Data Source', 'Goal Type', 'Service Target', 'Service Target Group'];
        let taskManagementList: string[] = ['Task Management', 'Approvals', 'Notes Template', 'Status Configuration', 'Templates'];
        let emailtList: string[] = ['Email', 'Acknowledgment Templates', 'Configuration', 'Templates'];
        let notificationConfigurationList: string[] = ['Notification Configuration', 'Manage Events', 'Manage Templates'];
        it('Verify Permissions role of CBA', async () => {
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.isSettingSubMenusMatches("Case Management", caseManagementList)).toBeTruthy("Case Management");
            expect(await navigationPage.isSettingSubMenusMatches("Manage Flowsets", manageFlowsetList)).toBeTruthy("Manage Flowsets");
            expect(await navigationPage.isSettingSubMenusMatches("Service Level Management", serviceLevelManagementList)).toBeTruthy("Service Level Management");
            expect(await navigationPage.isSettingSubMenusMatches("Task Management", taskManagementList)).toBeTruthy("Task Management");
            expect(await navigationPage.isSettingSubMenusMatches("Email", emailtList)).toBeTruthy("Email");
            expect(await navigationPage.isSettingSubMenusMatches("Notification Configuration", notificationConfigurationList)).toBeTruthy("Notification Configuration");
        });
        it('[DRDMV-2475]: Verify permission from manger role and agent role', async () => {
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.isSettingSubMenusMatches("Case Management", caseManagementList)).toBeTruthy();
            expect(await navigationPage.isSettingSubMenusMatches("Manage Flowsets", manageFlowsetList)).toBeTruthy();
            expect(await navigationPage.isSettingSubMenusMatches("Service Level Management", serviceLevelManagementList)).toBeTruthy();
            expect(await navigationPage.isSettingSubMenusMatches("Task Management", taskManagementList)).toBeTruthy();

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
    describe('[DRDMV-3795]: [Task Template] Task Template Status changes', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            let templateDataDraft1 = {
                "templateName": `manualTaskTemplateDraft1 ${randomStr}`,
                "templateSummary": `manualTaskTemplateDraft1 ${randomStr}`,
                "templateStatus": "Draft",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            let templateDataActive = {
                "templateName": `manualTaskTemplateActive ${randomStr}`,
                "templateSummary": `manualTaskTemplateActive ${randomStr}`,
                "templateStatus": "Active",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }

            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createManualTaskTemplate(templateDataDraft1);
            await apiHelper.createManualTaskTemplate(templateDataActive);
        });
        it('Verify the task template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.searchAndOpenTaskTemplate(`manualTaskTemplateDraft1 ${randomStr}`);
            expect(await viewTasktemplatePo.getTaskTypeValue()).toBe('Manual');
            await editTaskTemplate.clickOnEditMetadataLink();
            await editTaskTemplate.selectTemplateStatus("Active");
            await editTaskTemplate.clickOnSaveMetadata();
            await utilCommon.closePopUpMessage();
            expect(await viewTasktemplatePo.getTemplateStatus()).toBe('Active');
            await editTaskTemplate.clickOnEditMetadataLink();
            await editTaskTemplate.selectTemplateStatus("Inactive");
            await editTaskTemplate.clickOnSaveMetadata();
            await utilCommon.closePopUpMessage();
            expect(await viewTasktemplatePo.getTemplateStatus()).toBe('Inactive');
            await editTaskTemplate.clickOnEditMetadataLink();
            await editTaskTemplate.selectTemplateStatus("Draft");
            await editTaskTemplate.clickOnSaveMetadata();
            await utilCommon.closePopUpMessage();
            expect(await viewTasktemplatePo.getTemplateStatus()).toBe('Draft');
        });
        it('[DRDMV-3795]: Update the task template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.searchAndOpenTaskTemplate(`manualTaskTemplateActive ${randomStr}`);
            await editTaskTemplate.clickOnEditMetadataLink();
            await editTaskTemplate.selectTemplateStatus("Inactive");
            await editTaskTemplate.clickOnSaveMetadata();
            await utilCommon.closePopUpMessage();
            expect(await viewTasktemplatePo.getTemplateStatus()).toBe('Inactive');
            await editTaskTemplate.clickOnEditMetadataLink();
            await editTaskTemplate.selectTemplateStatus("Draft");
            await editTaskTemplate.clickOnSaveMetadata();
            await utilCommon.closePopUpMessage();
            expect(await viewTasktemplatePo.getTemplateStatus()).toBe('Draft');
        });
    });

    //ankagraw
    describe('[DRDMV-7254]: Automated Task] - Automated Task Activation behavior when Case is created in In Progress status via Case template having Task templates in it', async () => {
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
                "assignee": "Fritz",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            let CaseTemplateData = {
                "templateName": caseTemplateName,
                "templateSummary": casTemplateSummary,
                "caseStatus": "InProgress",
                "templateStatus": "Active",
                "assignee": "Fritz",
                "ownerCompany": "Petramco",
                "ownerBU": "Facilities Support",
                "ownerGroup": "Facilities",
            }
            await apiHelper.apiLogin('fritz');
            let newCaseTemplate = await apiHelper.createCaseTemplate(CaseTemplateData);
            let automationTaskTemplate = await apiHelper.createAutomatedTaskTemplate(templateData);
            await apiHelper.associateCaseTemplateWithOneTaskTemplate(newCaseTemplate.displayId, automationTaskTemplate.displayId);
        });
        it('create case and add task on it', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('fritz');
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
        it('[DRDMV-7254]: create case and add task on it', async () => {
            //Quick Case 
            await navigationPage.gotoQuickCase();
            await quickCase.selectRequesterName('adam');
            await quickCase.selectCaseTemplate(`${caseTemplateName}`);
            await quickCase.createCaseButton();
            await quickCase.gotoCaseButton();
            await utilityCommon.closePopUpMessage();
            await viewCasePage.clickOnTaskLink(`AutomatedTaskTemplateActive ${randomStr}`);
            expect(await viewTask.getTaskStatusValue()).toBe("Completed");
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //ankagraw
    it('[DRDMV-7158]: [Automatic Task] - When Case is Cancelled while there are Automatic Tasks which are in Staged, Assigned, Resolved, Closed state', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateData = {
            "templateName": `AutomatedTaskTemplateActive ${randomStr}`,
            "templateSummary": `AutomatedTaskTemplateActive ${randomStr}`,
            "templateStatus": "Active",
            "processBundle": "com.bmc.dsm.case-lib",
            "processName": `Case Process 1 ${randomStr}`,
            "taskCompany": "Petramco",
            "ownerCompany": "Petramco",
            "ownerBusinessUnit": "Facilities Support",
            "ownerGroup": "Facilities"
        }
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createAutomatedTaskTemplate(templateData);
        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester('fritz');
        await createCasePage.setSummary('Summary' + randomStr);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        await viewCasePage.clickAddTaskButton();
        await manageTask.addTaskFromTaskTemplate(`AutomatedTaskTemplateActive ${randomStr}`);
        await manageTask.clickCloseButton();
        await updateStatusBladePo.changeCaseStatus('Pending');
        await updateStatusBladePo.setStatusReason('Customer Response');
        await updateStatusBladePo.clickSaveStatus();
        await updateStatusBladePo.changeCaseStatus('Canceled');
        await updateStatusBladePo.setStatusReason('Customer Canceled');
        await updateStatusBladePo.clickSaveStatus();
        await utilityCommon.closePopUpMessage();
        await viewCasePage.clickOnTaskLink(` AutomatedTaskTemplateActive ${randomStr} `);
        expect(await viewTask.getTaskStatusValue()).toBe("Canceled");
    });

    //ankagraw
    describe('[DRDMV-7154,DRDMV-7153]: [Automatic Task] - Task Activation when multiple Tasks are on same sequence', async () => {
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
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            let templateData1 = {
                "templateName": `SecondAutomatedTaskTemplateActive1 ${randomStr}`,
                "templateSummary": `SecondAutomatedTaskTemplateSummaryActive1 ${randomStr}`,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": 'case_Management_Process123' + randomStr,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }

            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createAutomatedTaskTemplate(templateData);
            await apiHelper.createAutomatedTaskTemplate(templateData1);
        });
        it('create a case and assign task on it', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('fritz');
            await createCasePage.setSummary('Summary' + randomStr);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await utilityCommon.closePopUpMessage();
            await viewCasePage.clickAddTaskButton();
            await manageTask.addTaskFromTaskTemplate(`FirstAutomatedTaskTemplateActive ${randomStr}`);
            await manageTask.addTaskFromTaskTemplate(`SecondAutomatedTaskTemplateActive1 ${randomStr}`);
            await manageTask.clickCloseButton();
            await viewCasePage.openTaskCard(1);
            await manageTask.clickTaskLink(`AutomatedTaskTemplateSummaryActive ${randomStr}`);
            expect(await viewTask.getTaskStatusValue()).toBe("Staged");
            await viewTask.clickOnViewCase();
        });
        it('Verify first task on it', async () => {
            await viewCasePage.openTaskCard(1);
            await manageTask.clickTaskLink(`SecondAutomatedTaskTemplateSummaryActive1 ${randomStr}`);
            expect(await viewTask.getTaskStatusValue()).toBe("Staged");
            await viewTask.clickOnViewCase();
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            await utilityCommon.closePopUpMessage();
            await viewCasePage.clickAddTaskButton();
            await manageTask.clickTaskLink(`AutomatedTaskTemplateSummaryActive ${randomStr}`);
            expect(await viewTask.getTaskStatusValue()).toBe("Completed");
            expect(await viewTask.getStatusReason()).toBe("Successful")
            await viewTask.clickOnViewCase();
        });
        it('[DRDMV-7154,DRDMV-7153]: Verify second task on it', async () => {
            await viewCasePage.clickAddTaskButton();
            await manageTask.clickTaskLink(`SecondAutomatedTaskTemplateSummaryActive1 ${randomStr}`);
            expect(await viewTask.getTaskStatusValue()).toBe("Completed");
        });
    });

    //ankagraw
    describe('[DRDMV-7145]: [Automatic task] - Task Activation based on its sequence no.', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            let templateData1 = {
                "templateName": `manualTaskTemplate1 ${randomStr}`,
                "templateSummary": `manualTaskTemplateSummary1 ${randomStr}`,
                "templateStatus": "Active",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }

            let templateData2 = {
                "templateName": `manualTaskTemplate2 ${randomStr}`,
                "templateSummary": `manualTaskTemplateSummary2 ${randomStr}`,
                "templateStatus": "Active",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }

            let templateData3 = {
                "templateName": `manualTaskTemplate3 ${randomStr}`,
                "templateSummary": `manualTaskTemplateSummary3 ${randomStr}`,
                "templateStatus": "Active",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createManualTaskTemplate(templateData1);
            await apiHelper.createManualTaskTemplate(templateData2);
            await apiHelper.createManualTaskTemplate(templateData3);
        });
        it('Create a case add task on it', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('fritz');
            await createCasePage.setSummary('Summary' + randomStr);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await utilityCommon.closePopUpMessage();
            await viewCasePage.clickAddTaskButton();
            await manageTask.addTaskFromTaskTemplate(`manualTaskTemplate1 ${randomStr}`);
            await manageTask.addTaskFromTaskTemplate(`manualTaskTemplate2 ${randomStr}`);
            await manageTask.addTaskFromTaskTemplate(`manualTaskTemplate3 ${randomStr}`);
            await manageTask.clickCloseButton();
        });
        it('verify primary status of task', async () => {
            await viewCasePage.openTaskCard(1);
            await manageTask.clickTaskLink(`manualTaskTemplateSummary1 ${randomStr}`);
            expect(await viewTask.getTaskStatusValue()).toBe("Staged");
            await viewTask.clickOnViewCase();
            await viewCasePage.openTaskCard(1);
            await manageTask.clickTaskLink(`manualTaskTemplateSummary2 ${randomStr}`);
            expect(await viewTask.getTaskStatusValue()).toBe("Staged");
            await viewTask.clickOnViewCase();
            await viewCasePage.openTaskCard(1);
            await manageTask.clickTaskLink(`manualTaskTemplateSummary3 ${randomStr}`);
            expect(await viewTask.getTaskStatusValue()).toBe("Staged");
            await viewTask.clickOnViewCase();
        });
        it('verify status of task after updating of case', async () => {
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            await utilityCommon.closePopUpMessage();
            await viewCasePage.clickAddTaskButton();
            await manageTask.clickTaskLink(`manualTaskTemplateSummary1 ${randomStr}`);
            await viewTask.clickOnChangeStatus();
            expect(await viewTask.getTaskStatusValue()).toBe("Assigned");
            await viewTask.changeTaskStatus('Completed');
            await updateStatusBladePo.setStatusReason('Successful');
            await viewTask.clickOnSaveStatus();
            await utilityCommon.closePopUpMessage();
            await viewTask.clickOnViewCase();
        });
        it('[DRDMV-7145]: verify second and third status of task', async () => {
            await viewCasePage.clickAddTaskButton();
            await manageTask.clickTaskLink(`manualTaskTemplateSummary2 ${randomStr}`);
            expect(await viewTask.getTaskStatusValue()).toBe("Assigned");
            await viewTask.clickOnViewCase();
            await viewCasePage.clickAddTaskButton();
            await manageTask.clickTaskLink(`manualTaskTemplateSummary3 ${randomStr}`);
            expect(await viewTask.getTaskStatusValue()).toBe("Staged");
        });
    });

    //ankagraw
    describe('[DRDMV-7143,DRDMV-7144]: [Automatic Task] - Task Activation behaviour immediately after creation when Task is at seq 1', async () => {
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
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            await apiHelper.apiLogin('fritz');
            await apiHelper.createAutomatedTaskTemplate(templateData);
            var caseWithInprogressStatus = {
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

            var caseWithPendingStatus = {
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

            var caseWithResolvedStatus = {
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

            var caseWithClosedStatus = {
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

            var caseWithCanceledStatus = {
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
        it('Create new status case and assign task on it', async () => {
            //Verify New Case
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary("New case" + randomStr);
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await utilityCommon.closePopUpMessage();
            expect(await viewCasePage.isAddtaskButtonDisplayed()).toBeTruthy("Add task button not Visible")
            await viewCasePage.clickAddTaskButton();
            await manageTask.addTaskFromTaskTemplate(`AutomatedTaskTemplateActive ${randomStr}`);
            await manageTask.clickCloseButton();
            await viewCasePage.openTaskCard(1);
            await manageTask.clickTaskLink(`AutomatedTaskTemplateActive ${randomStr}`);
            expect(await viewTask.getTaskStatusValue()).toBe("Staged");
        });
        it('Create Assigned status case and assign task on it', async () => {
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
            await manageTask.addTaskFromTaskTemplate(`AutomatedTaskTemplateActive ${randomStr}`);
            await manageTask.clickCloseButton();
            await viewCasePage.openTaskCard(1);
            await manageTask.clickTaskLink(`AutomatedTaskTemplateActive ${randomStr}`);
            expect(await viewTask.getTaskStatusValue()).toBe("Staged");
        });
        it('Create InProgress status case and assign task on it', async () => {
            //Verify In_progress Case
            await navigationPage.gotoCaseConsole();
            await utilGrid.clearFilter();
            await caseConsolePage.searchAndOpenCase(inProgress);
            expect(await viewCasePage.isAddtaskButtonDisplayed()).toBeTruthy("Add task button not Visible")
            await viewCasePage.clickAddTaskButton();
            await manageTask.addTaskFromTaskTemplate(`AutomatedTaskTemplateActive ${randomStr}`);
            await manageTask.clickCloseButton();
            await viewCasePage.openTaskCard(1);
            await manageTask.clickTaskLink(`AutomatedTaskTemplateActive ${randomStr}`);
            expect(await viewTask.getTaskStatusValue()).toBe("Completed");
        });
        it('Create Pending status case and assign task on it', async () => {
            //Verify Pending Case
            await navigationPage.gotoCaseConsole();
            await utilGrid.clearFilter();
            await caseConsolePage.searchAndOpenCase(pending);
            expect(await viewCasePage.isAddtaskButtonDisplayed()).toBeTruthy("Add task button not Visible")
            await viewCasePage.clickAddTaskButton();
            await manageTask.addTaskFromTaskTemplate(`AutomatedTaskTemplateActive ${randomStr}`);
            await manageTask.clickCloseButton();
            await viewCasePage.openTaskCard(1);
            await manageTask.clickTaskLink(`AutomatedTaskTemplateActive ${randomStr}`);
            expect(await viewTask.getTaskStatusValue()).toBe("Staged");
        });
        it('Create resolved status case and assign task on it', async () => {
            //Verify Resolved Case
            await navigationPage.gotoCaseConsole();
            await utilGrid.clearFilter();
            await caseConsolePage.searchAndOpenCase(resolved);
            expect(await viewCasePage.isAddtaskButtonDisplayed()).toBeFalsy("Add task button Visible");
        });
        it('[DRDMV-7143,DRDMV-7144]: Create closed status case', async () => {
            //Verify Closed Case
            await navigationPage.gotoCaseConsole();
            await utilGrid.clearFilter();
            await caseConsolePage.searchAndOpenCase(closed);
            expect(await viewCasePage.isAddtaskButtonDisplayed()).toBeFalsy("Add task button Visible");

            //Verify Canceled Case
            await navigationPage.gotoCaseConsole();
            await utilGrid.clearFilter();
            await caseConsolePage.searchAndOpenCase(canceled);
            expect(await viewCasePage.isAddtaskButtonDisplayed()).toBeFalsy("Add task button Visible");
        });
    });
});