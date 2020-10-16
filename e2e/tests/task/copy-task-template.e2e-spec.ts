import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import caseConsolePo from '../../pageobject/case/case-console.po';
import viewCasePage from "../../pageobject/case/view-case.po";
import dynamicField from "../../pageobject/common/dynamic-fields.po";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import updateStatusBladePo from '../../pageobject/common/update.status.blade.po';
import selectTaskTemplate from "../../pageobject/settings/task-management/console-tasktemplate.po";
import copyTemplatePage from "../../pageobject/settings/task-management/copy-tasktemplate.po";
import viewTaskTemplate from "../../pageobject/settings/task-management/view-tasktemplate.po";
import manageTask from "../../pageobject/task/manage-task-blade.po";
import viewTask from "../../pageobject/task/view-task.po";
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

describe('Copy Task Template', () => {
    let twoCompanyUser, userData13548;
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
        // user for DRDMV-13548
        userData13548 = {
            "firstName": "Fname13548",
            "lastName": "Lname13548",
            "userId": "DRDMV-13548",
            "emailId": "DRDMV-13548@petramco.com",
        }
        await apiHelper.apiLogin('tadmin');
        await apiHelper.createNewUser(userData13548);
        await apiHelper.associatePersonToCompany(userData13548.userId, "Petramco");
        // Petramco and Psilon user
        twoCompanyUser = {
            "firstName": "CopyTask",
            "lastName": "Psilon",
            "userId": "copytask",
            "emailId": "copytask@petramco.com",
        }
        await apiHelper.createNewUser(twoCompanyUser);
        await apiHelper.associatePersonToCompany(twoCompanyUser.userId, "Petramco");
        await apiHelper.associatePersonToCompany(twoCompanyUser.userId, "Psilon");
        await apiHelper.associatePersonToSupportGroup(twoCompanyUser.userId, "US Support 1");
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    describe('[DRDMV-14214]: Automated Task template Copy using existing Process', () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let automatedTaskTemplateName = 'DRDMV14214AutomationTask2' + randomStr;
        let templateData;
        beforeAll(async () => {
            templateData = {
                "templateName": `AutomatedTaskTemplateActive ${randomStr}`,
                "templateSummary": `AutomatedTaskTemplateActive ${randomStr}`,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": 'DRDMV14214ProcessName' + randomStr,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 1"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createAutomatedTaskTemplate(templateData);
        });
        it('[DRDMV-14214]: Create copy of task', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.searchAndOpenTaskTemplate(`AutomatedTaskTemplateActive ${randomStr}`);
            await viewTaskTemplate.clickOnCopyTemplate();
            expect(await copyTemplatePage.unSelectCopyExistingProcess()).toBeTruthy();
            expect(await copyTemplatePage.getProcessName()).toBe(templateData.processName);
            await copyTemplatePage.setTemplateName(automatedTaskTemplateName);
            await copyTemplatePage.selectTemplateStatus('Active');
            await copyTemplatePage.setTaskSummary(randomStr + 'Summary2')
            await copyTemplatePage.clickSaveCopytemplate();
            await utilCommon.clickOnWarningOk();
            await utilCommon.closePopUpMessage();
        });
        it('[DRDMV-14214]: Create a Copy an Automated Task template by using existing Process for it, Check Execution', async () => {
            await navigationPage.signOut();
            await loginPage.login('qtao');
            let caseData = {
                "Requester": "apavlik",
                "Summary": 'Summary' + automatedTaskTemplateName,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 1",
                "Assignee": "qtao"
            }
            await apiHelper.apiLogin('qtao');
            let newCase = await apiHelper.createCase(caseData);
            await caseConsolePo.searchAndOpenCase(newCase.displayId);
            await viewCasePage.clickAddTaskButton();
            await manageTask.addTaskFromTaskTemplate(templateData.templateSummary);
            await manageTask.clickCloseButton();
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(newCase.displayId);
            await updateStatusBladePo.changeCaseStatus("In Progress");
            await updateStatusBladePo.clickSaveStatus('In Progress');
            await utilityCommon.closePopUpMessage();
            await navigationPage.gotoTaskConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(templateData.templateSummary);
            expect(await viewTask.getTaskStatusValue()).toBe('Completed');
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        });
    });

    describe('[DRDMV-13548]: Create Copy of Task template Submitter not from any Support Group', () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateData;
        let newManualTaskTemplate = 'NewManualtaskDRDMV13548' + randomStr;
        beforeAll(async () => {
            templateData = {
                "templateName": 'DRDMV13548ManualTask1' + randomStr,
                "templateSummary": 'manualTaskTemplateSummary1' + randomStr,
                "templateStatus": "Active",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 1",
                "lineOfBusiness": "Human Resource"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createManualTaskTemplate(templateData);
        });
        it('[DRDMV-13548]: Create a Copy of Task template where Submitter do not belong to any Support Groups', async () => {
            await navigationPage.signOut();
            await loginPage.login(userData13548.userId + "@petramco.com", 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.searchAndOpenTaskTemplate(templateData.templateName);
            await viewTaskTemplate.clickOnCopyTemplate();
            await copyTemplatePage.setTemplateName(newManualTaskTemplate);
            expect(await copyTemplatePage.isOwnerGroupEmpty()).toBeTruthy();
            await copyTemplatePage.clickSaveCopytemplate();
            expect(await utilCommon.isPopUpMessagePresent('Resolve the field validation errors and then try again.')).toBeTruthy();
            await utilityCommon.closePopUpMessage();
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        });
    });

    describe('[DRDMV-14218,DRDMV-13573]: Automated Task template copy created across company', () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateData;
        let autoTemplate1 = 'AutomationTemplateDRDMV14218_1' + randomStr;
        let autoTemplate2 = 'AutomationTemplateDRDMV14218_2' + randomStr;
        let taskProcess1 = 'ProcessDRDMV14218_1' + randomStr;
        let taskProcess2 = 'ProcessDRDMV14218_2' + randomStr;
        beforeAll(async () => {
            templateData = {
                "templateName": 'DRDMV14218AutomationTemplate' + randomStr,
                "templateSummary": `AutomatedTaskTemplateSummary ${randomStr}`,
                "templateStatus": "Active",
                "description": randomStr,
                "category1": "Applications",
                "category2": "Social",
                "category3": "Chatter",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": `Case Process ${randomStr}`,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createAutomatedTaskTemplate(templateData);
        });
        it('[DRDMV-14218,DRDMV-13573]: Fields copied while creating copy of Automated Task template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.searchAndOpenTaskTemplate(templateData.templateName);
            await viewTaskTemplate.clickOnCopyTemplate();
            await copyTemplatePage.setTemplateName(autoTemplate2);
            await copyTemplatePage.setNewProcessName(taskProcess2);
            await copyTemplatePage.clickSaveCopytemplate();
            await utilCommon.closePopUpMessage();
            expect(await viewTaskTemplate.getTemplateStatus()).toBe('Draft');
            expect(await viewTaskTemplate.getSummaryValue()).toBe(templateData.templateSummary);
            expect(await viewTaskTemplate.getTaskTypeValue()).toBe('Automated');
            expect(await viewTaskTemplate.getTaskCompanyNameValue()).toBe('Petramco');
            expect(await viewTaskTemplate.getTaskDescriptionNameValue()).toBe(templateData.description);
            expect(await viewTaskTemplate.getCategoryTier1Value()).toBe('Applications');
            expect(await viewTaskTemplate.getCategoryTier2Value()).toBe('Social');
            expect(await viewTaskTemplate.getCategoryTier3Value()).toBe('Chatter');
        });
        it('[DRDMV-14218,DRDMV-13573]: User having Petramco and Psilon access', async () => {
            await navigationPage.signOut();
            await loginPage.login(twoCompanyUser.userId + "@petramco.com", 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.searchAndOpenTaskTemplate(templateData.templateName);
            await viewTaskTemplate.clickOnCopyTemplate();
            await copyTemplatePage.selectTaskCompany('Psilon')
            await copyTemplatePage.setTemplateName(autoTemplate1);
            await copyTemplatePage.setNewProcessName(taskProcess1);
            await copyTemplatePage.clickSaveCopytemplate();
            await utilCommon.closePopUpMessage();
            expect(await viewTaskTemplate.getProcessNameValue()).toBe('com.bmc.dsm.case-lib:' + taskProcess1);
        });
        it('[DRDMV-14218,DRDMV-13573]: Login through only Petramco User', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.searchAndOpenTaskTemplate(autoTemplate1);
            expect(await viewTaskTemplate.getProcessNameValue()).toBe('com.bmc.dsm.case-lib:' + taskProcess1);
        });
        it('[DRDMV-14218,DRDMV-13573]: The copy of Automated Task template is created across company and check the way to Edit the existing linked Process', async () => {
            //Login through only Psilon User
            await navigationPage.signOut();
            await loginPage.login('gwixillian');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.searchAndOpenTaskTemplate(autoTemplate1);
            expect(await viewTaskTemplate.getProcessNameValue()).toBe('com.bmc.dsm.case-lib:' + taskProcess1);
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login("fritz");
        });
    });

    it('[DRDMV-14217,DRDMV-13737]: Copy of Automated task template created across company and no new Process is created', async () => {
        try {
            const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            //let automationTaskTemplate = 'DRDMV14217Automationtask' + randomStr;
            let newAutomationTaskTemplate = 'NewAutomationtaskDRDMV14217' + randomStr;
            let templateData = {
                "templateName": 'DRDMV14217Automationtask' + randomStr,
                "templateSummary": `AutomatedTaskTemplateActive ${randomStr}`,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": `Case Process ${randomStr}`,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createAutomatedTaskTemplate(templateData);

            await navigationPage.signOut();
            await loginPage.login(twoCompanyUser.userId + "@petramco.com", 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.searchAndOpenTaskTemplate(templateData.templateName);
            await viewTaskTemplate.clickOnCopyTemplate();
            await copyTemplatePage.setTemplateName(newAutomationTaskTemplate);
            await copyTemplatePage.selectTaskCompany('Psilon')
            await copyTemplatePage.setNewProcessName(templateData.processName);
            await copyTemplatePage.clickSaveCopytemplate();// Failing due to defect (turned improvement DRDMV-21097)
            expect(await utilCommon.isPopUpMessagePresent(`ERROR (902): Duplicate process name ${templateData.processBundle}:${templateData.processName}`, 2)).toBeTruthy(); // ERROR (902): Duplicate process name
            await copyTemplatePage.clickCancelCopytemplate();
            await utilCommon.clickOnWarningOk();
            await utilCommon.clickOnBackArrow();
            await selectTaskTemplate.searchAndOpenTaskTemplate(templateData.templateName);
            expect(await viewTaskTemplate.getProcessNameValue()).toBe('com.bmc.dsm.case-lib:' + templateData.processName);
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('fritz');
        }
    });

    describe('[DRDMV-13540,DRDMV-13556]: Case Business Analyst can create a copy of Task Template type Manual', () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let newManualTaskTemplate = 'NewManualTaskDRDMV13540' + randomStr;
        let newmanualTaskSummary = 'NewSummaryDRDMV13540' + randomStr;
        let templateData;
        beforeAll(async () => {
            templateData = {
                "templateName": 'DRDMV13540ManualTask' + randomStr,
                "templateSummary": `manualTaskTemplateSummary1 ${randomStr}`,
                "templateStatus": "Active",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createManualTaskTemplate(templateData);
        });
        it('[DRDMV-13540,DRDMV-13556]: Create copy of task manual template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.searchAndSelectTaskTemplate(templateData.templateName);
            await selectTaskTemplate.clickOnCopyTaskTemplateButton();
            await copyTemplatePage.setTemplateName(newManualTaskTemplate);
            await copyTemplatePage.setTaskSummary(newmanualTaskSummary);
            await copyTemplatePage.clickSaveCopytemplate();
            await utilCommon.closePopUpMessage();
        });
        it('[DRDMV-13540,DRDMV-13556]: Case Business Analyst can create a copy of Task Template type Manual', async () => {
            expect(await viewTaskTemplate.getTemplateStatus()).toBe("Draft");
            expect(await viewTaskTemplate.getOwnerCompanyValue()).toBe("Petramco");
            expect(await viewTaskTemplate.getOwnerGroupValue()).toBe("Facilities");
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.searchAndOpenTaskTemplate(newManualTaskTemplate);
            expect(await viewTaskTemplate.getTemplateName()).toBe(newManualTaskTemplate);
        });
    });

    describe('[DRDMV-14215]: Create Copy of an automated Task and check execution', () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateData, newCase;
        let newProcessName = 'NewProcessDRDMV14215' + randomStr;
        let updatedTaskTemplate = 'UpdatedTaskDRDMV14215' + randomStr;
        let updatedTaskSummary = 'UpdatedSummaryDRDMV14215' + randomStr;
        beforeAll(async () => {
            templateData = {
                "templateName": 'DRDMV14215AutomationTask' + randomStr,
                "templateSummary": `AutomatedTaskTemplateActive ${randomStr}`,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": 'DRDMV14215Process' + randomStr,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            let caseData = {
                "Requester": "apavlik",
                "Summary": 'Summary ' + randomStr,
                "Assigned Company": "Petramco",
                "Business Unit": "Facilities Support",
                "Support Group": "Facilities",
                "Assignee": "Fritz"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createAutomatedTaskTemplate(templateData);
            newCase = await apiHelper.createCase(caseData);
        });
        it('[DRDMV-14215]: Create copy of task template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.searchAndOpenTaskTemplate(templateData.templateName);
            await viewTaskTemplate.clickOnCopyTemplate();
            expect(await copyTemplatePage.getSourceProcessName()).toBe('com.bmc.dsm.case-lib:' + templateData.processName);
            await copyTemplatePage.setTemplateName(updatedTaskTemplate);
            await copyTemplatePage.setTaskSummary(updatedTaskSummary);
            await copyTemplatePage.selectBundles("Case Management Service");
            await copyTemplatePage.setNewProcessName(newProcessName);
            await copyTemplatePage.selectTemplateStatus('Active');
            await copyTemplatePage.clickSaveCopytemplate();
            await utilCommon.closePopUpMessage();
        });
        it('[DRDMV-14215]: Create Copy of an automated Task and check execution', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(newCase.displayId);
            await viewCasePage.clickAddTaskButton();
            await manageTask.addTaskFromTaskTemplate(templateData.templateSummary);
            await manageTask.clickCloseButton();
            await updateStatusBladePo.changeCaseStatus("In Progress");
            await updateStatusBladePo.clickSaveStatus('In Progress');
            await utilityCommon.closePopUpMessage();
            await navigationPage.gotoTaskConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(templateData.templateSummary);
            expect(await viewTask.getTaskStatusValue()).toBe('Completed');
        });
    });

    describe('[DRDMV-14221]: Copy Automated template with same process Name and different field data', () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let updatedTaskTemplate = 'DRDMV14221UpdatedTask' + randomStr;
        let templateData;
        beforeAll(async () => {
            templateData = {
                "templateName": `AutomatedTaskTemplateActive ${randomStr}`,
                "templateSummary": `AutomatedTaskTemplateActive ${randomStr}`,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": 'DRDMV14221Process' + randomStr,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createAutomatedTaskTemplate(templateData);
        });
        it('[DRDMV-14221]: Copy Automated Task template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.searchAndOpenTaskTemplate(`AutomatedTaskTemplateActive ${randomStr}`);
            await viewTaskTemplate.clickOnCopyTemplate();
            await copyTemplatePage.setTemplateName(updatedTaskTemplate);
            await copyTemplatePage.setNewProcessName(templateData.processName);
            await copyTemplatePage.clickSaveCopytemplate();
            await utilCommon.closePopUpMessage();
        });
        it('[DRDMV-14221]: Check Error Message when trying to edit a process, where process is linked to Active Automated Task template', async () => {
            await copyTemplatePage.clickCancelCopytemplate();
            await utilCommon.clickOnWarningOk();
            await utilCommon.clickOnBackArrow();
            await selectTaskTemplate.searchAndOpenTaskTemplate(updatedTaskTemplate);
            await viewTaskTemplate.clickOnEditProcessLink();
            expect(await utilCommon.isPopUpMessagePresent(`WARNING (222062): Updates to dynamic fields or process affect the templates using the selected process :${templateData.templateSummary}`)).toBeTruthy("Popup message doesn't match");
            await utilCommon.closePopUpMessage();
        });
        afterAll(async () => {
            await navigationPage.gotoCaseConsole();
        });
    });

    describe('[DRDMV-13574,DRDMV-13553]: Fields copied while creating copy of External Task template', async () => {
        let randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateData, updatedTaskTemplate = 'DRDMV13574UpdatedTask' + randomStr;
        beforeAll(async () => {
            templateData = {
                "templateName": 'DRDMV13574ExternalTask' + randomStr,
                "templateSummary": 'DRDMV13574Summary' + randomStr,
                "templateStatus": "Active",
                "description": randomStr,
                "category1": "Applications",
                "category2": "Social",
                "category3": "Chatter",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            await apiHelper.apiLogin('fritz');
            await apiHelper.createExternalTaskTemplate(templateData);
        });
        it('[DRDMV-13574,DRDMV-13553]: Fields copied while creating copy of External Task template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.searchAndOpenTaskTemplate(templateData.templateName);
            await viewTaskTemplate.clickOnCopyTemplate();
            await copyTemplatePage.setTemplateName(updatedTaskTemplate);
            await copyTemplatePage.clickSaveCopytemplate();
            await utilCommon.closePopUpMessage();
            expect(await viewTaskTemplate.getTemplateStatus()).toBe('Draft');
            expect(await viewTaskTemplate.getSummaryValue()).toBe(templateData.templateSummary);
            expect(await viewTaskTemplate.getTaskTypeValue()).toBe('External');
            expect(await viewTaskTemplate.getTaskCompanyNameValue()).toBe('Petramco');
            expect(await viewTaskTemplate.getTaskDescriptionNameValue()).toBe(templateData.description);
            expect(await viewTaskTemplate.getCategoryTier1Value()).toBe('Applications');
            expect(await viewTaskTemplate.getCategoryTier2Value()).toBe('Social');
            expect(await viewTaskTemplate.getCategoryTier3Value()).toBe('Chatter');
            expect(await viewTaskTemplate.getOwnerCompanyValue()).toBe("Petramco");
            expect(await viewTaskTemplate.getOwnerGroupValue()).toBe("Facilities");
        });
    });

    it('[DRDMV-13547,DRDMV-13572]: Create a Copy of Task template by Case Business Analyst that belongs to Support Group', async () => {
        try {
            const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let taskTemplate = 'DRDMV13547TaskTemplate' + randomStr;
            let taskSummary = 'DRDMV13547Summary' + randomStr;
            let updatedTaskTemplate = 'DRDMV13547UpdatedName' + randomStr;

            let templateData = {
                "templateName": taskTemplate,
                "templateSummary": taskSummary,
                "templateStatus": "Active",
                "description": randomStr,
                "category1": "Applications",
                "category2": "Social",
                "category3": "Chatter",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createManualTaskTemplate(templateData);
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.searchAndOpenTaskTemplate(taskTemplate);
            await viewTaskTemplate.clickOnCopyTemplate();
            await copyTemplatePage.setTemplateName(updatedTaskTemplate);
            await copyTemplatePage.clickSaveCopytemplate();
            await utilCommon.closePopUpMessage();

            expect(await viewTaskTemplate.getTemplateStatus()).toBe('Draft');
            expect(await viewTaskTemplate.getSummaryValue()).toBe(templateData.templateSummary);
            expect(await viewTaskTemplate.getTaskTypeValue()).toBe('Manual');
            expect(await viewTaskTemplate.getTaskCompanyNameValue()).toBe('Petramco');
            expect(await viewTaskTemplate.getTaskDescriptionNameValue()).toBe(templateData.description);
            expect(await viewTaskTemplate.getCategoryTier1Value()).toBe('Applications');
            expect(await viewTaskTemplate.getCategoryTier2Value()).toBe('Social');
            expect(await viewTaskTemplate.getCategoryTier3Value()).toBe('Chatter');
            expect(await viewTaskTemplate.getOwnerCompanyValue()).toBe("Petramco");
            expect(await viewTaskTemplate.getBuisnessunitValue()).toBe('HR Support');
            expect(await viewTaskTemplate.getOwnerGroupValue()).toBe("Workforce Administration");
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('fritz');
        }
    });

    describe('[DRDMV-13569,DRDMV-14220]: Dynamic Field get copied upon creating copy of Task Template', () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let dynamicFieldName1 = 'DRDMV14220FieldName1' + randomStr;
        let dynamicFieldName2 = 'DRDMV14220FieldName2' + randomStr;
        let dynamicFieldDescription1 = 'DRDMV13569FieldDescription1' + randomStr;
        let dynamicFieldDescription2 = 'DRDMV13569FieldDescription2' + randomStr;
        let updatedTaskTemplate = 'UpdatedTaskDRDMV13569' + randomStr;
        let updatedTaskSummary = 'UpdatedSummaryDRDMV13569' + randomStr;
        let updateProcessName = 'UpdatedProcessDRDMV13569' + randomStr;
        let templateData;
        beforeAll(async () => {
            templateData = {
                "templateName": 'DRDMV13569AutomationTask' + randomStr,
                "templateSummary": `AutomatedTaskTemplateActive ${randomStr}`,
                "templateStatus": "Draft",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": `Case Process ${randomStr}`,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createAutomatedTaskTemplate(templateData);
        });
        it('[DRDMV-13569,DRDMV-14220]: Add Dynamic Field', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.searchAndOpenTaskTemplate(templateData.templateName);
            await viewTaskTemplate.clickOnManageDynamicFieldLink();
            await dynamicField.clickOnDynamicField();
            await dynamicField.setFieldName(dynamicFieldName1);
            await dynamicField.setDescriptionName(dynamicFieldDescription1);
            await dynamicField.clickSaveButton();
            await utilCommon.closePopUpMessage();
            await utilCommon.clickOnBackArrow();
        });
        it('[DRDMV-13569,DRDMV-14220]: Verify dynamic field is present', async () => {
            await selectTaskTemplate.searchAndOpenTaskTemplate(templateData.templateName);
            await viewTaskTemplate.clickOnCopyTemplate();
            await copyTemplatePage.setTemplateName(updatedTaskTemplate);
            await copyTemplatePage.setTaskSummary(updatedTaskSummary);
            await copyTemplatePage.selectBundles("Case Management Service");
            await copyTemplatePage.setNewProcessName(updateProcessName);
            await copyTemplatePage.clickSaveCopytemplate();
            await utilCommon.closePopUpMessage();
            expect(await viewTaskTemplate.isDynamicFieldPresent(dynamicFieldDescription1)).toBeTruthy(`${dynamicFieldDescription1} dynamic field not present`);
        });
        it('[DRDMV-13569,DRDMV-14220]: Verify Warning message when Dynamic fields are added to a Automated Task template', async () => {
            await viewTaskTemplate.clickOnManageDynamicFieldLink();
            await dynamicField.clickOnDynamicField();
            await dynamicField.setFieldName(dynamicFieldName2);
            await dynamicField.setDescriptionName(dynamicFieldDescription2);
            await dynamicField.clickSaveButton();
            await utilCommon.closePopUpMessage();// is it defect no warning message
            expect(await viewTaskTemplate.isDynamicFieldPresent(dynamicFieldDescription2)).toBeTruthy(`${dynamicFieldDescription2} dynamic field not present`);
        });
    });
});
