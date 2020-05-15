import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import viewCasePo from "../../pageobject/case/view-case.po";
import changeAssignmentBladePo from '../../pageobject/common/change-assignment-blade.po';
import changeAssignmentOldBladePo from '../../pageobject/common/change-assignment-old-blade.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import emailPo from '../../pageobject/email/compose-mail.po';
import emailTemplateBladePo from '../../pageobject/email/select-email-template-blade.po';
import editAcknowledgmentTemplatePo from '../../pageobject/settings/email/edit-acknowledgment-template.po';
import activityTabPo from '../../pageobject/social/activity-tab.po';
import editTask from "../../pageobject/task/edit-task.po";
import manageTaskBladePo from '../../pageobject/task/manage-task-blade.po';
import viewTaskPo from "../../pageobject/task/view-task.po";
import { BWF_BASE_URL } from '../../utils/constants';
import utilGrid from '../../utils/util.grid';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

describe('Email', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        loginPage.login("fritz");
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    afterEach(async () => {
        await utilityCommon.refresh();
    });

    it('[DRDMV-19011]: Automated task should not have email options but other type of task should have email option	', async () => {
        const randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let taskTemplateName = 'Manual task19011' + randomStr;
        let manualTaskSummary = 'ManualSummary19011' + randomStr;
        var templateData = {
            "templateName": `${taskTemplateName}`,
            "templateSummary": `${manualTaskSummary}`,
            "templateStatus": "Active",
        }
        await apiHelper.apiLogin('fritz');
        await apiHelper.createManualTaskTemplate(templateData);

        let externalTaskTemplateName = 'External task19011' + randomStr;
        let externalTaskSummary = 'ExternalSummary19011' + randomStr;
        var externaltemplateData = {
            "templateName": `${externalTaskTemplateName}`,
            "templateSummary": `${externalTaskSummary}`,
            "templateStatus": "Active",
        }
        await apiHelper.createExternalTaskTemplate(externaltemplateData);

        let automatedTaskTemplateName = 'Automated task19011' + randomStr;
        let automatedTaskSummary = 'AutomatedSummary19011' + randomStr;
        var automatedtemplateData = {
            "templateName": `${automatedTaskTemplateName}`,
            "templateSummary": `${automatedTaskSummary}`,
            "templateStatus": "Active",
            "processBundle": "com.bmc.dsm.case-lib",
            "processName": "Auto Process",
        }
        await apiHelper.createAutomatedTaskTemplate(automatedtemplateData);

        var caseData = {
            "Requester": "qtao",
            "Company": "Petramco",
            "Summary": "Create case for me postman1",
            "Assigned Company": "Petramco",
            "Business Unit": "United States Support",
            "Support Group": "US Support 3",
            "Assignee": "Qadim Katawazi"
        }
        await apiHelper.apiLogin('fritz');
        var newCaseTemplate = await apiHelper.createCase(caseData);
        var displayId: string = newCaseTemplate.displayId;
        await utilityGrid.clearFilter();
        await utilityGrid.searchAndOpenHyperlink(displayId);
        await viewCasePo.clickAddTaskButton();
        await manageTaskBladePo.addTaskFromTaskTemplate(manualTaskSummary);
        await manageTaskBladePo.addTaskFromTaskTemplate(automatedTaskSummary);
        await manageTaskBladePo.addTaskFromTaskTemplate(externalTaskSummary);
        await manageTaskBladePo.clickTaskLinkOnManageTask(automatedTaskSummary);
        await expect(emailPo.isEmailIconLinkPresent()).toBeTruthy();
        await viewTaskPo.clickEmailLink();
        await emailPo.clickOnDiscardButton();
        await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        await viewTaskPo.clickOnViewCase();
        await viewCasePo.clickAddTaskButton();
        await manageTaskBladePo.clickTaskLinkOnManageTask(manualTaskSummary);
        await expect(emailPo.isEmailIconLinkPresent()).toBeTruthy();
        await viewTaskPo.clickEmailLink();
        await emailPo.clickOnDiscardButton();
        await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        await viewTaskPo.clickOnViewCase();
        await viewCasePo.clickAddTaskButton();
        await manageTaskBladePo.clickTaskLinkOnManageTask(externalTaskSummary);
        await expect(emailPo.isEmailIconLinkPresent()).toBeTruthy();
        await viewTaskPo.clickEmailLink();
        await emailPo.clickOnDiscardButton();
        await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
    });

    it('[DRDMV-19008]: Email icon and Requester email link should open compose email dialog in Task', async () => {
        const randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let taskTemplateName = 'Manual task19008' + randomStr;
        let manualTaskSummary = 'ManualSummary19008' + randomStr;
        var templateData = {
            "templateName": `${taskTemplateName}`,
            "templateSummary": `${manualTaskSummary}`,
            "templateStatus": "Active",
        }
        await apiHelper.apiLogin('fritz');
        await apiHelper.createManualTaskTemplate(templateData);

        let externalTaskTemplateName = 'Externaltask19008' + randomStr;
        let externalTaskSummary = 'ExternalSummary19008' + randomStr;
        var externaltemplateData = {
            "templateName": `${externalTaskTemplateName}`,
            "templateSummary": `${externalTaskSummary}`,
            "templateStatus": "Active",
        }
        await apiHelper.createExternalTaskTemplate(externaltemplateData);
        var caseData = {
            "Requester": "qtao",
            "Company": "Petramco",
            "Summary": "Create case for me postman1",
            "Assigned Company": "Petramco",
            "Business Unit": "United States Support",
            "Support Group": "US Support 3",
            "Assignee": "Qadim Katawazi"
        }
        await apiHelper.apiLogin('fritz');
        var newCaseTemplate = await apiHelper.createCase(caseData);
        var displayId: string = newCaseTemplate.displayId;
        await navigationPage.gotoCaseConsole();
        await utilityGrid.clearFilter();
        await utilityGrid.searchAndOpenHyperlink(displayId);
        await viewCasePo.clickAddTaskButton();
        await manageTaskBladePo.addTaskFromTaskTemplate(manualTaskSummary);
        await manageTaskBladePo.addTaskFromTaskTemplate(externalTaskSummary);
        await manageTaskBladePo.clickTaskLinkOnManageTask(manualTaskSummary);
        await browser.sleep(2000);
        await expect(await emailPo.isEmailIconLinkPresent()).toBeTruthy();
        let ManualtaskID = await viewTaskPo.getTaskID();
        await viewTaskPo.clickEmailLink();
        expect(await emailPo.getSubject()).toContain(displayId + ':' + ManualtaskID);
        //story changes
        // await expect(await emailPo.getEmailBody()).toContain('Regards');
        // await expect(await emailPo.getEmailBody()).toContain('Fritz Schulz');
        // await expect(await emailPo.getEmailBody()).toContain('fritz.schulz@petramco.com');
        expect(await emailPo.searchPerson('To', 'fri')).toBe(3);
        expect(await emailPo.searchPerson('Cc', 'fri')).toBe(3);
        await emailPo.clickOnDiscardButton();
        await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        await viewTaskPo.clickOnRequesterEmail();
        //story changes
        // await expect(await emailPo.getEmailBody()).toContain('Regards');
        // await expect(await emailPo.getEmailBody()).toContain('Fritz Schulz');
        // await expect(await emailPo.getEmailBody()).toContain('fritz.schulz@petramco.com');
        expect(await emailPo.searchPerson('To', 'fri')).toBe(3);
        expect(await emailPo.searchPerson('Cc', 'fri')).toBe(3);
        await emailPo.setToOrCCInputTetxbox('To', 'fritz.schulz@petramco.com');
        expect(await emailPo.getSubject()).toContain(displayId + ':' + ManualtaskID);
        //verify activity email post
        await emailPo.clickOnSendButton();
        expect(await activityTabPo.getEmailTitle()).toContain('Fritz Schulz sent an email');
        await viewTaskPo.clickOnViewCase();
        await viewCasePo.clickAddTaskButton();
        await manageTaskBladePo.clickTaskLinkOnManageTask(externalTaskSummary);
        await expect(emailPo.isEmailIconLinkPresent()).toBeTruthy();
        let ExternaltaskID = await viewTaskPo.getTaskID();
        await viewTaskPo.clickEmailLink();
        expect(await emailPo.getSubject()).toContain(displayId + ':' + ExternaltaskID);
        // await expect(await emailPo.getEmailBody()).toContain('Regards');
        // await expect(await emailPo.getEmailBody()).toContain('Fritz Schulz');
        // await expect(await emailPo.getEmailBody()).toContain('fritz.schulz@petramco.com');
        expect(await emailPo.searchPerson('To', 'fri')).toBe(3);
        expect(await emailPo.searchPerson('Cc', 'fri')).toBe(3);
        await emailPo.clickOnDiscardButton();
        await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        await viewTaskPo.clickOnRequesterEmail();
        // await expect(await emailPo.getEmailBody()).toContain('Regards');
        // await expect(await emailPo.getEmailBody()).toContain('Fritz Schulz');
        // await expect(await emailPo.getEmailBody()).toContain('fritz.schulz@petramco.com');
        expect(await emailPo.searchPerson('To', 'fri')).toBe(3);
        expect(await emailPo.searchPerson('Cc', 'fri')).toBe(3);
        await emailPo.setToOrCCInputTetxbox('To', 'fritz.schulz@petramco.com');
        expect(await emailPo.getSubject()).toContain(displayId + ':' + ExternaltaskID);
        //verify activity email post
        await emailPo.clickOnSendButton();
        expect(await activityTabPo.getEmailTitle()).toContain('Fritz Schulz sent an email');
    }, 300 * 1000);

    it('[DRDMV-19009]: Verify Subject of Email from Task Compose email', async () => {
        const randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        try {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            let taskTemplateName = 'Manual  task19009' + randomStr;
            let manualTaskSummary = 'ManualSummary19009' + randomStr;
            var templateData = {
                "templateName": `${taskTemplateName}`,
                "templateSummary": `${manualTaskSummary}`,
                "templateStatus": "Active",
            }
            await apiHelper.apiLogin('fritz');
            await apiHelper.createManualTaskTemplate(templateData);

            let externalTaskTemplateName = 'External  task19009' + randomStr;
            let externalTaskSummary = 'ExternalSummary19009' + randomStr;
            var externaltemplateData = {
                "templateName": `${externalTaskTemplateName}`,
                "templateSummary": `${externalTaskSummary}`,
                "templateStatus": "Active",
            }
            await apiHelper.createExternalTaskTemplate(externaltemplateData);
            var caseData = {
                "Requester": "qtao",
                "Company": "Petramco",
                "Summary": "Create case for me postman1",
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "Qadim Katawazi"
            }
            await apiHelper.apiLogin('qkatawazi');
            var newCaseTemplate = await apiHelper.createCase(caseData);
            var displayId: string = newCaseTemplate.displayId;
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(displayId);
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.addTaskFromTaskTemplate(manualTaskSummary);
            await manageTaskBladePo.addTaskFromTaskTemplate(externalTaskSummary);
            await manageTaskBladePo.clickTaskLinkOnManageTask(manualTaskSummary);
            await browser.sleep(2000);
            await viewTaskPo.clickOnEditTask();
            await editTask.clickOnChangeAssignementButton();
            await changeAssignmentBladePo.selectBusinessUnit('Facilities Support');
            await changeAssignmentBladePo.selectSupportGroup('Facilities');
            await changeAssignmentBladePo.selectAssignee('Fritz Schulz');
            await changeAssignmentBladePo.clickOnAssignButton();
            await editTask.clickOnSaveButton();
            await expect(emailPo.isEmailIconLinkPresent()).toBeTruthy();
            let ManualtaskID = await viewTaskPo.getTaskID();
            await viewTaskPo.clickEmailLink();
            expect(await emailPo.getSubject()).toContain(displayId + ':' + ManualtaskID);
            await emailPo.clickOnDiscardButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            await viewTaskPo.clickOnViewCase();
            await viewCasePo.clickAddTaskButton();
            //verify activity email post
            await manageTaskBladePo.clickTaskLinkOnManageTask(externalTaskSummary);
            await viewTaskPo.clickOnEditTask();
            await editTask.clickOnChangeAssignementButton();
            await changeAssignmentBladePo.selectBusinessUnit('Facilities Support');
            await changeAssignmentBladePo.selectSupportGroup('Facilities');
            await changeAssignmentBladePo.selectAssignee('Fritz Schulz');
            await changeAssignmentBladePo.clickOnAssignButton();
            await editTask.clickOnSaveButton();
            await expect(emailPo.isEmailIconLinkPresent()).toBeTruthy();
            let ExternaltaskID = await viewTaskPo.getTaskID();
            await viewTaskPo.clickEmailLink();
            expect(await emailPo.getSubject()).toContain(displayId + ':' + ExternaltaskID);
            await emailPo.clickOnDiscardButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoTaskConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(ExternaltaskID);
            await viewTaskPo.clickEmailLink();
            expect(await emailPo.getSubject()).toContain(displayId + ':' + ExternaltaskID);
            await emailPo.clickOnDiscardButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(ManualtaskID);
            await viewTaskPo.clickEmailLink();
            expect(await emailPo.getSubject()).toContain(displayId + ':' + ManualtaskID);
            await emailPo.clickOnDiscardButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        } catch (e) {
            throw e;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('fritz');
        }
    }, 520 * 1000);

    it('[DRDMV-19558]: Verify social notes other than email should not have reply and reply all options', async () => {
        const randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let taskTemplateName = 'Manual  task' + randomStr;
        let manualTaskSummary = 'ManualSummary' + randomStr;
        var templateData = {
            "templateName": `${taskTemplateName}`,
            "templateSummary": `${manualTaskSummary}`,
            "templateStatus": "Active",
        }
        await apiHelper.apiLogin('fritz');
        await apiHelper.createManualTaskTemplate(templateData);
        var caseData = {
            "Requester": "qtao",
            "Company": "Petramco",
            "Summary": "Create case for me postman1",
            "Assigned Company": "Petramco",
            "Business Unit": "United States Support",
            "Support Group": "US Support 3",
            "Assignee": "Qadim Katawazi"
        }
        await apiHelper.apiLogin('fritz');
        var newCaseTemplate = await apiHelper.createCase(caseData);
        var displayId: string = newCaseTemplate.displayId;
        await navigationPage.gotoCaseConsole();
        await utilityGrid.clearFilter();
        await utilityGrid.searchAndOpenHyperlink(displayId);
        await activityTabPo.addActivityNote('This is case notes templates');
        await activityTabPo.clickOnPostButton();
        await expect(activityTabPo.getActivityNotesText('Reply')).toBeFalsy();
        await expect(activityTabPo.getActivityNotesText('Reply all')).toBeFalsy();
        await viewCasePo.clickAddTaskButton();
        await manageTaskBladePo.addTaskFromTaskTemplate(manualTaskSummary);
        await manageTaskBladePo.clickTaskLinkOnManageTask(manualTaskSummary);
        await activityTabPo.addActivityNote('This is case notes templates');
        await activityTabPo.clickOnPostButton();
        await expect(activityTabPo.getActivityNotesText('Reply')).toBeFalsy();
        await expect(activityTabPo.getActivityNotesText('Reply all')).toBeFalsy();
    });

    it('[DRDMV-19556]: Reply / Reply All earlier email context should be copied as part of email composition on Task', async () => {
        const randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let taskTemplateName = 'Manual  task' + randomStr;
        let manualTaskSummary = 'ManualSummary' + randomStr;
        var templateData = {
            "templateName": `${taskTemplateName}`,
            "templateSummary": `${manualTaskSummary}`,
            "templateStatus": "Active",
        }
        await apiHelper.apiLogin('fritz');
        await apiHelper.createManualTaskTemplate(templateData);
        let externalTaskTemplateName = 'External  task' + randomStr;
        let externalTaskSummary = 'ExternalSummary' + randomStr;
        var externaltemplateData = {
            "templateName": `${externalTaskTemplateName}`,
            "templateSummary": `${externalTaskSummary}`,
            "templateStatus": "Active",
        }
        await apiHelper.createExternalTaskTemplate(externaltemplateData);
        var caseData = {
            "Requester": "qtao",
            "Company": "Petramco",
            "Summary": "Create case for me postman1",
            "Assigned Company": "Petramco",
            "Business Unit": "United States Support",
            "Support Group": "US Support 3",
            "Assignee": "Qadim Katawazi"
        }
        await apiHelper.apiLogin('fritz');
        var newCaseTemplate = await apiHelper.createCase(caseData);
        var displayId: string = newCaseTemplate.displayId;
        await navigationPage.gotoCaseConsole();
        await utilityGrid.clearFilter();
        await utilityGrid.searchAndOpenHyperlink(displayId);
        await viewCasePo.clickAddTaskButton();
        await manageTaskBladePo.addTaskFromTaskTemplate(manualTaskSummary);
        await manageTaskBladePo.addTaskFromTaskTemplate(externalTaskSummary);
        await manageTaskBladePo.clickTaskLinkOnManageTask(manualTaskSummary);
        await browser.sleep(2000);
        var ManualtaskID = await viewTaskPo.getTaskID();
        await viewTaskPo.clickEmailLink();
        await emailPo.addAttachment(['../../data/ui/attachment/demo.txt']);
        await emailPo.setToOrCCInputTetxbox('To', 'fritz.schulz@petramco.com');
        await emailPo.setToOrCCInputTetxbox('Cc', 'qkatawazi@petramco.com')
        await emailPo.setEmailBody('this is new email sending frist time to the user');
        await emailPo.clickOnSendButton();
        expect(await activityTabPo.getEmailTitle()).toContain('Fritz Schulz sent an email');
        expect(await activityTabPo.getRecipientInTo()).toContain('To: Fritz Schulz');
        expect(await activityTabPo.getEmailSubject()).toContain(displayId + ':' + ManualtaskID + ':' + manualTaskSummary);
        expect(await activityTabPo.getEmailBody()).toContain('this is new email sending frist time to the user');
        await activityTabPo.clickOnReplyAll();
        await emailPo.isComposeEmailUIDisplay();
        expect(await emailPo.getToEmailPerson()).toContain('Fritz Schulz');
        expect(await emailPo.getCcEmailPerson()).toContain('Qadim Katawazi');
        expect(await emailPo.getEmailBody()).toContain('this is new email sending frist time to the user');
        expect(await emailPo.getEmailBody()).toContain('While replying, please do not add information below this line');
        await emailPo.setEmailBody('this is second reply to all');
        await emailPo.clickOnSendButton();
        expect(await activityTabPo.getEmailBody()).toContain('this is second reply to all');
        await activityTabPo.clickOnReply();
        expect(await emailPo.getToEmailPerson()).toContain('Fritz Schulz');
        expect(await activityTabPo.getEmailBody()).toContain('this is second reply to all');
        await emailPo.setEmailBody('this is third reply');
        await emailPo.clickOnSendButton();
        await viewTaskPo.clickOnViewCase();
        await viewCasePo.clickAddTaskButton();
        await manageTaskBladePo.clickTaskLinkOnManageTask(externalTaskSummary);
        var externaltaskID = await viewTaskPo.getTaskID();
        await viewTaskPo.clickEmailLink();
        await emailPo.addAttachment(['../../data/ui/attachment/demo.txt']);
        await emailPo.setToOrCCInputTetxbox('To', 'fritz.schulz@petramco.com');
        await emailPo.setToOrCCInputTetxbox('Cc', 'qkatawazi@petramco.com')
        await emailPo.setEmailBody('this is new email sending frist time to the user');
        await emailPo.clickOnSendButton();
        expect(await activityTabPo.getEmailTitle()).toContain('Fritz Schulz sent an email');
        expect(await activityTabPo.getRecipientInTo()).toContain('To: Fritz Schulz');
        expect(await activityTabPo.getEmailSubject()).toContain(displayId + ':' + externaltaskID + ':' + externalTaskSummary);
        expect(await activityTabPo.getEmailBody()).toContain('this is new email sending frist time to the user');
        await activityTabPo.clickOnReplyAll();
        await emailPo.isComposeEmailUIDisplay();
        expect(await emailPo.getToEmailPerson()).toContain('Fritz Schulz');
        expect(await emailPo.getCcEmailPerson()).toContain('Qadim Katawazi');
        expect(await emailPo.getEmailBody()).toContain('While replying, please do not add information below this line');
        expect(await emailPo.getEmailBody()).toContain('this is new email sending frist time to the user');
        await emailPo.setEmailBody('this is second reply to all');
        await emailPo.clickOnSendButton();
        expect(await activityTabPo.getEmailBody()).toContain('this is second reply to all');
        await activityTabPo.clickOnReply();
        expect(await emailPo.getToEmailPerson()).toContain('Fritz Schulz');
        expect(await activityTabPo.getEmailBody()).toContain('this is second reply to all');
        await emailPo.setEmailBody('this is third reply');
        await emailPo.clickOnSendButton();
        expect(await activityTabPo.getEmailBody()).toContain('this is third reply');
    });//, 200 * 1000);

    it('[DRDMV-19557]: For Reply / Reply All earlier email context should be copied as part of email composition on Case', async () => {
        var caseData = {
            "Requester": "qtao",
            "Company": "Petramco",
            "Summary": "Create case for Email Test",
            "Assigned Company": "Petramco",
            "Business Unit": "United States Support",
            "Support Group": "US Support 3",
            "Assignee": "Qadim Katawazi"
        }
        await apiHelper.apiLogin('fritz');
        var newCaseTemplate = await apiHelper.createCase(caseData);
        var displayId: string = newCaseTemplate.displayId;
        await navigationPage.gotoCaseConsole();
        await utilityGrid.clearFilter();
        await utilityGrid.searchAndOpenHyperlink(displayId);
        await viewCasePo.clickOnEmailLink();
        await emailPo.addAttachment(['../../data/ui/attachment/demo.txt']);
        await emailPo.setToOrCCInputTetxbox('To', 'fritz.schulz@petramco.com');
        await emailPo.setToOrCCInputTetxbox('Cc', 'qkatawazi@petramco.com')
        await emailPo.setEmailBody('this is new email sending frist time to the user');
        await emailPo.clickOnSendButton();
        expect(await activityTabPo.getEmailTitle()).toContain('Fritz Schulz sent an email');
        expect(await activityTabPo.getRecipientInTo()).toContain('To: Fritz Schulz');
        expect(await activityTabPo.getEmailSubject()).toContain(displayId + ':' + 'Create case for Email Test');
        expect(await activityTabPo.getEmailBody()).toContain('this is new email sending frist time to the user');
        await activityTabPo.clickOnReplyAll();
        await emailPo.isComposeEmailUIDisplay();
        expect(await emailPo.getToEmailPerson()).toContain('Fritz Schulz');
        expect(await emailPo.getCcEmailPerson()).toContain('Qadim Katawazi');
        expect(await emailPo.getEmailBody()).toContain('this is new email sending frist time to the user');
        expect(await emailPo.getEmailBody()).toContain('While replying, please do not add information below this line');
        await emailPo.setEmailBody('this is second reply to all');
        await emailPo.clickOnSendButton();
        expect(await activityTabPo.getEmailBody()).toContain('this is second reply to all');
        await activityTabPo.clickOnReply();
        expect(await emailPo.getToEmailPerson()).toContain('Fritz Schulz');
        expect(await activityTabPo.getEmailBody()).toContain('this is second reply to all');
        await emailPo.setEmailBody('this is third reply');
        await emailPo.clickOnSendButton();
    });//, 200 * 1000);

    it('[DRDMV-19555]: In Case of Reply/Reply All  if we select new Email template then previous contents should not be erased.', async () => {
        const randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await apiHelper.apiLogin('tadmin');
        let emailTemplateData = require('../../data/ui/email/email.template.api.json');
        let emailTemplateName: string = await emailTemplateData['emailTemplateWithMandatoryField'].TemplateName + randomStr;
        emailTemplateData['emailTemplateWithMandatoryField'].TemplateName = emailTemplateName;
        //second email template
        await apiHelper.createEmailTemplate(emailTemplateData['emailTemplateWithMandatoryField']);
        let emailSalaryTemplate: string = await emailTemplateData['emailTemplateForSalary'].TemplateName + randomStr;
        emailTemplateData['emailTemplateForSalary'].TemplateName = emailSalaryTemplate;
        await apiHelper.createEmailTemplate(emailTemplateData['emailTemplateForSalary']);
        let taskTemplateName = 'Manual task19555' + randomStr;
        let manualTaskSummary = 'ManualSummary19555' + randomStr;
        var templateData = {
            "templateName": `${taskTemplateName}`,
            "templateSummary": `${manualTaskSummary}`,
            "templateStatus": "Active",
        }
        await apiHelper.apiLogin('fritz');
        await apiHelper.createManualTaskTemplate(templateData);
        let externalTaskTemplateName = 'Externa task19555' + randomStr;
        let externalTaskSummary = 'ExternalSummary19555' + randomStr;
        var externaltemplateData = {
            "templateName": `${externalTaskTemplateName}`,
            "templateSummary": `${externalTaskSummary}`,
            "templateStatus": "Active",
        }
        await apiHelper.createExternalTaskTemplate(externaltemplateData);
        var caseData = {
            "Requester": "qdu",
            "Company": "Petramco",
            "Summary": "Create case for me postman19555",
            "Assigned Company": "Petramco",
            "Business Unit": "United States Support",
            "Support Group": "US Support 3",
            "Assignee": "Qadim Katawazi"
        }
        await apiHelper.apiLogin('fritz');
        var newCaseTemplate = await apiHelper.createCase(caseData);
        var displayId: string = newCaseTemplate.displayId;
        await navigationPage.gotoCaseConsole();
        await utilityGrid.clearFilter();
        await utilityGrid.searchAndOpenHyperlink(displayId);
        await viewCasePo.clickAddTaskButton();
        await manageTaskBladePo.addTaskFromTaskTemplate(manualTaskSummary);
        await manageTaskBladePo.addTaskFromTaskTemplate(externalTaskSummary);
        await manageTaskBladePo.clickTaskLinkOnManageTask(manualTaskSummary);
        await viewTaskPo.clickOnEditTask();
        await editTask.clickOnChangeAssignementButton();
        await changeAssignmentBladePo.selectBusinessUnit('Facilities Support');
        await changeAssignmentBladePo.selectSupportGroup('Facilities');
        await changeAssignmentBladePo.selectAssignee('Fritz Schulz');
        await changeAssignmentBladePo.clickOnAssignButton();
        await editTask.clickOnSaveButton();
        await viewTaskPo.clickOnRequesterEmail();
        await emailPo.clickOnSelectTempalteButton();
        await emailTemplateBladePo.searchAndSelectEmailTemplate(emailTemplateName);
        await emailTemplateBladePo.clickOnApplyButton();
        await emailPo.clickOnSendButton();
        await utilityCommon.refresh();
        expect(await activityTabPo.getEmailTitle()).toContain('Fritz Schulz sent an email');
        expect(await activityTabPo.getRecipientInTo()).toContain('To: Qiang Du');
        await activityTabPo.clickOnReply();
        expect(await emailPo.getToEmailPerson()).toContain('Fritz Schulz');
        expect(await emailPo.getEmailBody()).toContain('Hi Team ,\n\nI am taking leave today.\n\nThanks.');
        await emailPo.clickOnSelectTempalteButton();
        await emailTemplateBladePo.searchAndSelectEmailTemplate(emailSalaryTemplate);
        await emailTemplateBladePo.clickOnApplyButton();
        expect(await emailPo.getEmailBody()).toContain('Hi Team ,\n\nI am taking leave today.\n\nThanks.');
        await emailPo.clickOnSendButton();
        await viewTaskPo.clickOnViewCase();
        await viewCasePo.clickAddTaskButton();
        await manageTaskBladePo.clickTaskLinkOnManageTask(externalTaskSummary);
        await viewTaskPo.clickOnEditTask();
        await editTask.clickOnChangeAssignementButton();
        await changeAssignmentBladePo.selectBusinessUnit('Facilities Support');
        await changeAssignmentBladePo.selectSupportGroup('Facilities');
        await changeAssignmentBladePo.selectAssignee('Fritz Schulz');
        await changeAssignmentBladePo.clickOnAssignButton();
        await editTask.clickOnSaveButton();
        await viewTaskPo.clickOnRequesterEmail();
        await emailPo.setToOrCCInputTetxbox('To', 'fritz.schulz@petramco.com');
        await emailPo.clickOnSelectTempalteButton();
        await emailTemplateBladePo.searchAndSelectEmailTemplate(emailTemplateName);
        await emailTemplateBladePo.clickOnApplyButton();
        await emailPo.clickOnSendButton();
        await utilityCommon.refresh();
        await browser.sleep(2000);
        await activityTabPo.clickOnReply();
        expect(await emailPo.getToEmailPerson()).toContain('Fritz Schulz');
        expect(await emailPo.getEmailBody()).toContain('Hi Team ,\n\nI am taking leave today.\n\nThanks.');
        await emailPo.clickOnSelectTempalteButton();
        await emailTemplateBladePo.searchAndSelectEmailTemplate(emailSalaryTemplate);
        await emailTemplateBladePo.clickOnApplyButton();
        expect(await emailPo.getEmailBody()).toContain('Hi Team ,\n\nI am taking leave today.\n\nThanks.');
        await emailPo.clickOnSendButton();
    }, 330 * 1000);

    it('[DRDMV-19552]: Verify task acknowledgement template are listed in Email Acknowledgement template and In Email Configuration', async () => {
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Email--Acknowledgment Templates', 'Email Ack Template Console - Business Workflows')).toEqual('Email Ack Template Console - Business Workflows');
        await utilGrid.searchAndOpenHyperlink('Task Update Ack Template');
        expect(await editAcknowledgmentTemplatePo.getCompanyName()).toContain('- Global -');
        expect(await editAcknowledgmentTemplatePo.getModuleName()).toContain('Tasks');
        expect(await editAcknowledgmentTemplatePo.getStatusValue()).toContain('Active');
        expect(await editAcknowledgmentTemplatePo.getTemplateName()).toContain('Task Update Ack Template');
        expect(await editAcknowledgmentTemplatePo.getDescription()).toContain('Task Update Acknowledgement Template when task got updated via email');
        expect(await editAcknowledgmentTemplatePo.getBodyMessageValue()).toContain('<p>This is to acknowledge that the information provided by you for Task $1$ has been updated successfully.</p><p>HR Department</p>');
        expect(await editAcknowledgmentTemplatePo.getSubjectMessageValue()).toContain('Task $1$ :$450000029$ Successfully updated');
    });

    it('[DRDMV-19550]: Email Templates option driven by Task assignee permission for case', async () => {
        const randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        try {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            let taskTemplateName = 'Manual  task19550' + randomStr;
            let manualTaskSummary = 'ManualSummary19550' + randomStr;
            var templateData = {
                "templateName": `${taskTemplateName}`,
                "templateSummary": `${manualTaskSummary}`,
                "templateStatus": "Active",
            }
            await apiHelper.apiLogin('fritz');
            await apiHelper.createManualTaskTemplate(templateData);
            let externalTaskTemplateName = 'External  task19550' + randomStr;
            let externalTaskSummary = 'ExternalSummary19550' + randomStr;
            var externaltemplateData = {
                "templateName": `${externalTaskTemplateName}`,
                "templateSummary": `${externalTaskSummary}`,
                "templateStatus": "Active",
            }
            await apiHelper.createExternalTaskTemplate(externaltemplateData);
            var caseData = {
                "Requester": "qtao",
                "Company": "Petramco",
                "Summary": "Create case for me postman1",
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "Qadim Katawazi"
            }
            await apiHelper.apiLogin('qkatawazi');
            var newCaseTemplate = await apiHelper.createCase(caseData);
            var displayId: string = newCaseTemplate.displayId;
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(displayId);
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.addTaskFromTaskTemplate(manualTaskSummary);
            await manageTaskBladePo.addTaskFromTaskTemplate(externalTaskSummary);
            await manageTaskBladePo.clickTaskLinkOnManageTask(manualTaskSummary);
            await viewTaskPo.clickOnEditTask();
            await editTask.clickOnChangeAssignementButton();
            await changeAssignmentBladePo.selectBusinessUnit('Facilities Support');
            await changeAssignmentBladePo.selectSupportGroup('Facilities');
            await changeAssignmentBladePo.selectAssignee('Fritz Schulz');
            await changeAssignmentBladePo.clickOnAssignButton();
            await editTask.clickOnSaveButton();
            let ManualtaskID = await viewTaskPo.getTaskID();
            await viewTaskPo.clickOnViewCase();
            await viewCasePo.clickAddTaskButton();
            //verify activity email post
            await manageTaskBladePo.clickTaskLinkOnManageTask(externalTaskSummary);
            await viewTaskPo.clickOnEditTask();
            await editTask.clickOnChangeAssignementButton();
            await changeAssignmentBladePo.selectBusinessUnit('Facilities Support');
            await changeAssignmentBladePo.selectSupportGroup('Compensation and Benefits');
            await changeAssignmentBladePo.selectAssignee('Qadim Katawazi');
            await changeAssignmentBladePo.clickOnAssignButton();
            await editTask.clickOnSaveButton();
            await viewTaskPo.clickOnRequesterEmail();
            expect(await emailPo.isSelectEmailTemplateButtonPresent()).toBeTruthy('Email template link not present');
            await emailPo.clickOnDiscardButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoTaskConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(ManualtaskID);
            await viewTaskPo.clickOnRequesterEmail();
            expect(await emailPo.isSelectEmailTemplateButtonPresent()).toBeFalsy();
            await emailPo.clickOnDiscardButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        } catch (e) {
            throw e;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        }
    }, 380 * 1000);
})
