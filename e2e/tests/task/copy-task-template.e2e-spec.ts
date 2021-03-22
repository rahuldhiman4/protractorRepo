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
import { BWF_BASE_URL, BWF_PAGE_TITLES } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

describe('Copy Task Template', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    describe('[4570]: Automated Task template Copy using existing Process', () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let automatedTaskTemplateName = randomStr + 'DRDMV14214AutomationTask2';
        let templateData;
        beforeAll(async () => {
            templateData = {
                "templateName": `${randomStr}AutomatedTaskTemplateActive`,
                "templateSummary": `${randomStr}AutomatedTaskTemplateActive`,
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
        it('[4570]: Create copy of task', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', BWF_PAGE_TITLES.TASK_MANAGEMENT.TEMPLATES);
            await selectTaskTemplate.searchAndSelectTaskTemplate(templateData.templateName);
            await selectTaskTemplate.clickOnCopyTaskTemplateButton();
            expect(await copyTemplatePage.unSelectCopyExistingProcess()).toBeTruthy();
            expect(await copyTemplatePage.getProcessName()).toBe(templateData.processName);
            await copyTemplatePage.setTemplateName(automatedTaskTemplateName);
            await copyTemplatePage.selectTemplateStatus('Active');
            await copyTemplatePage.setTaskSummary(randomStr + 'Summary2')
            await copyTemplatePage.clickSaveCopytemplate();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            await utilityCommon.closePopUpMessage();
            await viewTaskTemplate.clickBackArrowBtn();
        });
        it('[4570]: Create a Copy an Automated Task template by using existing Process for it, Check Execution', async () => {
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
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(newCase.displayId);
            await viewCasePage.clickAddTaskButton();
            await manageTask.addTaskFromTaskTemplate(templateData.templateName);
            let taskId = await manageTask.getTaskDisplayId();
            await manageTask.clickCloseButton();
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(newCase.displayId);
            await updateStatusBladePo.changeStatus("In Progress");
            await updateStatusBladePo.clickSaveStatus('In Progress');
            await utilityCommon.closePopUpMessage();
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(taskId);
            expect(await viewTask.getTaskStatusValue()).toBe('Completed');
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        });
    });

    // qliu belongs to SG - need test data
    describe('[4737]: Create Copy of Task template Submitter not from any Support Group', () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateData;
        let newManualTaskTemplate = randomStr + 'NewManualtaskDRDMV13548';
        beforeAll(async () => {
            templateData = {
                "templateName": randomStr + 'DRDMV13548ManualTask1',
                "templateSummary": randomStr + 'manualTaskTemplateSummary1',
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
        it('[4737]: Create a Copy of Task template where Submitter do not belong to any Support Groups', async () => {
            await navigationPage.signOut();
            await loginPage.login('qliu');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', BWF_PAGE_TITLES.TASK_MANAGEMENT.TEMPLATES);
            await selectTaskTemplate.searchAndSelectTaskTemplate(templateData.templateName);
            await selectTaskTemplate.clickOnCopyTaskTemplateButton();
            await copyTemplatePage.setTemplateName(newManualTaskTemplate);
            expect(await copyTemplatePage.isOwnerGroupEmpty()).toBeTruthy();
            await copyTemplatePage.clickSaveCopytemplate();
            expect(await utilityCommon.isPopUpMessagePresent('Resolve the field validation errors and then try again.')).toBeTruthy();
            await utilityCommon.closePopUpMessage();
            await viewTaskTemplate.clickBackArrowBtn();
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        });
    });

    //Done
    describe('[4566,4715]: Automated Task template copy created across company', () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateData;
        let autoTemplate1 = randomStr + 'AutomationTemplateDRDMV14218_1';
        let autoTemplate2 = randomStr + 'AutomationTemplateDRDMV14218_2';
        let taskProcess1 = 'ProcessDRDMV14218_1' + randomStr;
        let taskProcess2 = 'ProcessDRDMV14218_2' + randomStr;
        beforeAll(async () => {
            templateData = {
                "templateName": randomStr + 'DRDMV14218AutomationTemplate',
                "templateSummary": `${randomStr} AutomatedTaskTemplateSummary`,
                "templateStatus": "Active",
                "description": randomStr,
                "category1": "Employee Relations",
                "category2": "Compensation",
                "category3": "Bonus",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": `Case Process ${randomStr}`,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 1"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createAutomatedTaskTemplate(templateData);
        });
        it('[4566,4715]: Fields copied while creating copy of Automated Task template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', BWF_PAGE_TITLES.TASK_MANAGEMENT.TEMPLATES);
            await selectTaskTemplate.searchAndSelectTaskTemplate(templateData.templateName);
            await selectTaskTemplate.clickOnCopyTaskTemplateButton();
            await copyTemplatePage.setTemplateName(autoTemplate2);
            await copyTemplatePage.setNewProcessName(taskProcess2);
            await copyTemplatePage.clickSaveCopytemplate();
            await utilityCommon.closePopUpMessage();
            expect(await viewTaskTemplate.getTemplateStatus()).toBe('Draft');
            expect(await viewTaskTemplate.getSummaryValue()).toBe(templateData.templateSummary);
            expect(await viewTaskTemplate.getTaskTypeValue()).toBe('Automated');
            expect(await viewTaskTemplate.getTaskCompanyNameValue()).toBe('Petramco');
            expect(await viewTaskTemplate.getTaskDescriptionNameValue()).toBe(templateData.description);
            expect(await viewTaskTemplate.getCategoryTier1Value()).toBe('Employee Relations');
            expect(await viewTaskTemplate.getCategoryTier2Value()).toBe('Compensation');
            expect(await viewTaskTemplate.getCategoryTier3Value()).toBe('Bonus');
            await viewTaskTemplate.clickBackArrowBtn();
        });
        it('[4566,4715]: User having Petramco and Psilon access', async () => {
            await navigationPage.signOut();
            await loginPage.login('qheroux');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', BWF_PAGE_TITLES.TASK_MANAGEMENT.TEMPLATES);
            await selectTaskTemplate.searchAndSelectTaskTemplate(templateData.templateName);
            await selectTaskTemplate.clickOnCopyTaskTemplateButton();
            await copyTemplatePage.selectTaskCompany('Psilon')
            await copyTemplatePage.setTemplateName(autoTemplate1);
            await copyTemplatePage.setNewProcessName(taskProcess1);
            await copyTemplatePage.selectOwnerCompany('Petramco');
            await copyTemplatePage.selectOwnerBusinessUnit('United States Support');
            await copyTemplatePage.selectOwnerGroup('US Support 3');
            await copyTemplatePage.clickSaveCopytemplate();
            await utilityCommon.closePopUpMessage();
            expect(await viewTaskTemplate.getProcessNameValue()).toBe('com.bmc.dsm.lob.human-resource:' + taskProcess1);
            await viewTaskTemplate.clickBackArrowBtn();
        });
        it('[4566,4715]: Login through only Petramco User', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', BWF_PAGE_TITLES.TASK_MANAGEMENT.TEMPLATES);
            await selectTaskTemplate.searchAndOpenTaskTemplate(autoTemplate1);
            expect(await viewTaskTemplate.getProcessNameValue()).toBe('com.bmc.dsm.lob.human-resource:' + taskProcess1);
            await viewTaskTemplate.clickBackArrowBtn();
        });
        it('[4566,4715]: The copy of Automated Task template is created across company and check the way to Edit the existing linked Process', async () => {
            //Login through only Psilon User
            await navigationPage.signOut();
            await loginPage.login('gwixillian');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', BWF_PAGE_TITLES.TASK_MANAGEMENT.TEMPLATES);
            await selectTaskTemplate.searchAndOpenTaskTemplate(autoTemplate1);
            expect(await viewTaskTemplate.getProcessNameValue()).toBe('com.bmc.dsm.lob.human-resource:' + taskProcess1);
            await viewTaskTemplate.clickBackArrowBtn();
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        });
    });

    // Duplicate process name error absent
    describe('[4567,4636]: Copy of Automated task template created across company and no new Process is created', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateData, newAutomationTaskTemplate = 'NewAutomationtaskDRDMV14217' + randomStr;
        beforeAll(async () => {
            templateData = {
                "templateName": randomStr + 'DRDMV14217Automationtask',
                "templateSummary": randomStr + 'AutomatedTaskTemplateDRDMV14217',
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": `Case Process ${randomStr}`,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 1"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createAutomatedTaskTemplate(templateData);
        });
        it('[4567,4636]: Copy of Automated task template created across company and no new Process is created', async () => {
            await navigationPage.signOut();
            await loginPage.login('qheroux');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', BWF_PAGE_TITLES.TASK_MANAGEMENT.TEMPLATES);
            await selectTaskTemplate.searchAndSelectTaskTemplate(templateData.templateName);
            await selectTaskTemplate.clickOnCopyTaskTemplateButton();
            await copyTemplatePage.setTemplateName(newAutomationTaskTemplate);
            await copyTemplatePage.selectTaskCompany('Psilon');
            await copyTemplatePage.setNewProcessName(templateData.processName);
            await copyTemplatePage.selectOwnerCompany('Petramco');
            await copyTemplatePage.selectOwnerBusinessUnit('United States Support');
            await copyTemplatePage.selectOwnerGroup('US Support 3');
            await copyTemplatePage.clickSaveCopytemplate();// Failing due to defect (turned improvement DRDMV-21097)
            expect(await utilityCommon.isPopUpMessagePresent(`Duplicate process name ${templateData.processBundle}:${templateData.processName}`, 2)).toBeTruthy('Duplicate process name error absent');
            await copyTemplatePage.clickCancelCopytemplate();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            await viewTaskTemplate.clickBackArrowBtn();
            await selectTaskTemplate.searchAndOpenTaskTemplate(templateData.templateName);
            expect(await viewTaskTemplate.getProcessNameValue()).toBe('com.bmc.dsm.case-lib:' + templateData.processName);
        });
        afterAll(async () => {
            await viewTaskTemplate.clickBackArrowBtn();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[4742,4731]: Case Business Analyst can create a copy of Task Template type Manual', () => {
        const randomStr = [...Array(30)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let manualTaskTemplateName2 = randomStr + 'Name2';
        let manualTaskTemplateSummary2 = randomStr + 'Summary2';
        let templateData;
        beforeAll(async () => {
            templateData = {
                "templateName": randomStr + 'Name1',
                "templateSummary": randomStr + 'Summary1',
                "templateStatus": "Active",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createManualTaskTemplate(templateData);
        });
        it('[4742,4731]: Create copy of task manual template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', BWF_PAGE_TITLES.TASK_MANAGEMENT.TEMPLATES);
            await selectTaskTemplate.searchAndSelectTaskTemplate(templateData.templateName);
            await selectTaskTemplate.clickOnCopyTaskTemplateButton();
            await copyTemplatePage.setTemplateName(manualTaskTemplateName2);
            await copyTemplatePage.setTaskSummary(manualTaskTemplateSummary2);
            await copyTemplatePage.clickSaveCopytemplate();
            await utilityCommon.closePopUpMessage();
        });
        it('[4742,4731]: Case Business Analyst can create a copy of Task Template type Manual', async () => {
            expect(await viewTaskTemplate.getTemplateStatus()).toBe("Draft");
            expect(await viewTaskTemplate.getTemplateName()).toBe(manualTaskTemplateName2);
            expect(await viewTaskTemplate.getOwnerCompanyValue()).toBe("Petramco");
            expect(await viewTaskTemplate.getOwnerGroupValue()).toBe("US Support 3");
            await viewTaskTemplate.clickBackArrowBtn();
            await utilityGrid.searchAndOpenHyperlink(manualTaskTemplateName2);
            expect(await viewTaskTemplate.getTemplateName()).toBe(manualTaskTemplateName2);
            await viewTaskTemplate.clickBackArrowBtn();
        });
    });

    //Done
    describe('[4569]: Create Copy of an automated Task and check execution', () => {
        const randomStr = [...Array(30)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateData, newCase;
        let newProcessName = randomStr + 'NewProcess';
        let updatedTaskTemplate = randomStr + 'UpdatedTask';
        let updatedTaskSummary = randomStr + 'UpdatedSummary';
        beforeAll(async () => {
            templateData = {
                "templateName": randomStr + 'TaskName',
                "templateSummary": randomStr + 'TaskSummary',
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": randomStr + 'DRDMV14215Process',
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 1"
            }
            let caseData = {
                "Requester": "apavlik",
                "Summary": randomStr + 'Summary',
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 1",
                "Assignee": "qtao"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createAutomatedTaskTemplate(templateData);
            newCase = await apiHelper.createCase(caseData);
        });
        it('[4569]: Create copy of task template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', BWF_PAGE_TITLES.TASK_MANAGEMENT.TEMPLATES);
            await selectTaskTemplate.searchAndSelectTaskTemplate(templateData.templateName);
            await selectTaskTemplate.clickOnCopyTaskTemplateButton();
            expect(await copyTemplatePage.getSourceProcessName()).toBe('com.bmc.dsm.case-lib:' + templateData.processName);
            await copyTemplatePage.setTemplateName(updatedTaskTemplate);
            await copyTemplatePage.setTaskSummary(updatedTaskSummary);
            await copyTemplatePage.setNewProcessName(newProcessName);
            await copyTemplatePage.selectTemplateStatus('Active');
            await copyTemplatePage.clickSaveCopytemplate();
            await utilityCommon.closePopUpMessage();
            await viewTaskTemplate.clickBackArrowBtn();
        });
        it('[4569]: Create Copy of an automated Task and check execution', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(newCase.displayId);
            await viewCasePage.clickAddTaskButton();
            await manageTask.addTaskFromTaskTemplate(templateData.templateName);
            let taskId = await manageTask.getTaskDisplayId();
            await manageTask.clickCloseButton();
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(newCase.displayId);
            await updateStatusBladePo.changeStatus("In Progress");
            await updateStatusBladePo.clickSaveStatus('In Progress'); // when case status is changed its not automatically reflected on case view
            await utilityCommon.closePopUpMessage();
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(taskId);
            expect(await viewTask.getTaskStatusValue()).toBe('Completed');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
        });
    });

    // skipped: click edit process link opens Discover Innovation Studio video
    xdescribe('[4563]: Check Error Message when trying to edit a process, where process is linked to Active Automated Task template', () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let updatedTaskTemplate = randomStr + 'DRDMV14221UpdatedTask';
        let templateData;
        beforeAll(async () => {
            templateData = {
                "templateName": `${randomStr}AutomatedTaskTemplateActive`,
                "templateSummary": `${randomStr}AutomatedTaskTemplateActive`,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": 'DRDMV14221Process' + randomStr,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createAutomatedTaskTemplate(templateData);
        });
        it('[4563]: Copy Automated Task template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', BWF_PAGE_TITLES.TASK_MANAGEMENT.TEMPLATES);
            await selectTaskTemplate.searchAndSelectTaskTemplate(templateData.templateName)
            await selectTaskTemplate.clickOnCopyTaskTemplateButton();
            await copyTemplatePage.setTemplateName(updatedTaskTemplate);
            await copyTemplatePage.setNewProcessName(templateData.processName);
            await copyTemplatePage.clickSaveCopytemplate();
            await utilityCommon.closePopUpMessage();
        });
        it('[4563]: Check Error Message when trying to edit a process, where process is linked to Active Automated Task template', async () => {
            await viewTaskTemplate.clickBackArrowBtn();
            await selectTaskTemplate.searchAndOpenTaskTemplate(updatedTaskTemplate);
            await viewTaskTemplate.clickOnEditProcessLink();
            expect(await utilityCommon.isPopUpMessagePresent(`Updates to dynamic fields or process affect the templates using the selected process :${templateData.templateSummary}`)).toBeTruthy("Popup message doesn't match");
            await utilityCommon.closePopUpMessage();
        });
        afterAll(async () => {
            await viewTaskTemplate.clickBackArrowBtn();
            await navigationPage.gotoCaseConsole();
        });
    });

    //Done
    describe('[4714,4734]: Fields copied while creating copy of External Task template', async () => {
        let randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateData, updatedTaskTemplate = randomStr + 'DRDMV13574UpdatedTask';
        beforeAll(async () => {
            templateData = {
                "templateName": randomStr + 'DRDMV13574ExternalTask',
                "templateSummary": randomStr + 'DRDMV13574Summary',
                "templateStatus": "Active",
                "description": randomStr,
                "category1": "Employee Relations",
                "category2": "Compensation",
                "category3": "Bonus",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createExternalTaskTemplate(templateData);
        });
        it('[4714,4734]: Fields copied while creating copy of External Task template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', BWF_PAGE_TITLES.TASK_MANAGEMENT.TEMPLATES);
            await selectTaskTemplate.searchAndSelectTaskTemplate(templateData.templateName);
            await selectTaskTemplate.clickOnCopyTaskTemplateButton();
            await copyTemplatePage.setTemplateName(updatedTaskTemplate);
            await copyTemplatePage.clickSaveCopytemplate();
            await utilityCommon.closePopUpMessage();
            expect(await viewTaskTemplate.getTemplateStatus()).toBe('Draft');
            expect(await viewTaskTemplate.getSummaryValue()).toBe(templateData.templateSummary);
            expect(await viewTaskTemplate.getTaskTypeValue()).toBe('External');
            expect(await viewTaskTemplate.getTaskCompanyNameValue()).toBe('Petramco');
            expect(await viewTaskTemplate.getTaskDescriptionNameValue()).toBe(templateData.description);
            expect(await viewTaskTemplate.getCategoryTier1Value()).toBe('Employee Relations');
            expect(await viewTaskTemplate.getCategoryTier2Value()).toBe('Compensation');
            expect(await viewTaskTemplate.getCategoryTier3Value()).toBe('Bonus');
            expect(await viewTaskTemplate.getOwnerCompanyValue()).toBe("Petramco");
            expect(await viewTaskTemplate.getOwnerGroupValue()).toBe("US Support 3");
        });
        afterAll(async () => {
            await viewTaskTemplate.clickBackArrowBtn();
        });
    });

    //Done
    it('[4738,4716]: Create a Copy of Task template by Case Business Analyst that belongs to Support Group', async () => {
        try {
            const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let taskTemplate = randomStr + 'DRDMV13547TaskTemplate';
            let taskSummary = randomStr + 'DRDMV13547Summary';
            let updatedTaskTemplate = randomStr + 'DRDMV13547UpdatedName';

            let templateData = {
                "templateName": taskTemplate,
                "templateSummary": taskSummary,
                "templateStatus": "Active",
                "description": randomStr,
                "category1": "Employee Relations",
                "category2": "Compensation",
                "category3": "Bonus",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createManualTaskTemplate(templateData);
            await navigationPage.signOut();
            await loginPage.login('qliu');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', BWF_PAGE_TITLES.TASK_MANAGEMENT.TEMPLATES);
            await selectTaskTemplate.searchAndSelectTaskTemplate(taskTemplate);
            await selectTaskTemplate.clickOnCopyTaskTemplateButton();
            await copyTemplatePage.setTemplateName(updatedTaskTemplate);
            await copyTemplatePage.clickSaveCopytemplate();
            await utilityCommon.closePopUpMessage();
            await viewTaskTemplate.clickBackArrowBtn();
            await utilityGrid.searchAndOpenHyperlink(updatedTaskTemplate);

            expect(await viewTaskTemplate.getTemplateStatus()).toBe('Draft');
            expect(await viewTaskTemplate.getSummaryValue()).toBe(templateData.templateSummary);
            expect(await viewTaskTemplate.getTaskTypeValue()).toBe('Manual');
            expect(await viewTaskTemplate.getTaskCompanyNameValue()).toBe('Petramco');
            expect(await viewTaskTemplate.getTaskDescriptionNameValue()).toBe(templateData.description);
            expect(await viewTaskTemplate.getCategoryTier1Value()).toBe('Employee Relations');
            expect(await viewTaskTemplate.getCategoryTier2Value()).toBe('Compensation');
            expect(await viewTaskTemplate.getCategoryTier3Value()).toBe('Bonus');
            expect(await viewTaskTemplate.getOwnerCompanyValue()).toBe("Petramco");
            expect(await viewTaskTemplate.getBuisnessunitValue()).toBe('Australia Support');
            expect(await viewTaskTemplate.getOwnerGroupValue()).toBe("AU Support 3");
        } catch (e) {
            throw e;
        } finally {
            await viewTaskTemplate.clickBackArrowBtn();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });

    describe('[4719,4564]: Dynamic Field get copied upon creating copy of Task Template', () => {
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
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createAutomatedTaskTemplate(templateData);
        });
        it('[4719,4564]: Add Dynamic Field', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', BWF_PAGE_TITLES.TASK_MANAGEMENT.TEMPLATES);
            await selectTaskTemplate.searchAndOpenTaskTemplate(templateData.templateName);
            await viewTaskTemplate.clickOnManageDynamicFieldLink();
            await dynamicField.clickOnDynamicField();
            await dynamicField.setFieldName(dynamicFieldName1);
            await dynamicField.setDescriptionName(dynamicFieldDescription1);
            await dynamicField.clickSaveButton();
            await utilityCommon.closePopUpMessage();
            await viewTaskTemplate.clickBackArrowBtn();
        });
        it('[4719,4564]: Verify dynamic field is present', async () => {
            await selectTaskTemplate.searchAndSelectTaskTemplate(templateData.templateName);
            await selectTaskTemplate.clickOnCopyTaskTemplateButton();
            await copyTemplatePage.setTemplateName(updatedTaskTemplate);
            await copyTemplatePage.setTaskSummary(updatedTaskSummary);
            await copyTemplatePage.setNewProcessName(updateProcessName);
            await copyTemplatePage.clickSaveCopytemplate();
            await utilityCommon.closePopUpMessage();
            expect(await viewTaskTemplate.isDynamicFieldPresent(dynamicFieldDescription1)).toBeTruthy(`${dynamicFieldDescription1} dynamic field not present`);
        });
        it('[4719,4564]: Verify Warning message when Dynamic fields are added to a Automated Task template', async () => {
            await viewTaskTemplate.clickOnManageDynamicFieldLink();
            await dynamicField.clickOnDynamicField();
            await dynamicField.setFieldName(dynamicFieldName2);
            await dynamicField.setDescriptionName(dynamicFieldDescription2);
            await dynamicField.clickSaveButton();
            expect(await viewTaskTemplate.isDynamicFieldPresent(dynamicFieldDescription2)).toBeTruthy(`${dynamicFieldDescription2} dynamic field not present`);
        });
        afterAll(async () => {
            await viewTaskTemplate.clickBackArrowBtn();
        });
    });
});
