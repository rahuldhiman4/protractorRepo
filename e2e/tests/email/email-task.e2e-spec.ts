import { browser } from "protractor";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import emailPo from '../../pageobject/email/compose-mail.po';
import socialActivity from '../../pageobject/social/activity-tab.po'
import utilCommon from '../../utils/util.common';
import apiHelper from '../../api/api.helper';
import utilGrid from '../../utils/util.grid';
import activityTabPo from '../../pageobject/social/activity-tab.po';
import viewCasePage from "../../pageobject/case/view-case.po";
import viewTask from "../../pageobject/task/view-task.po";
import editTask from "../../pageobject/task/edit-task.po";
import manageTaskBladePo from '../../pageobject/task/manage-task-blade.po';
import changeAssignmentBladePo from '../../pageobject/common/change-assignment-blade.po';
import viewCasePo from '../../pageobject/case/view-case.po';
import emailTemplateBladePo from '../../pageobject/email/email-template-blade.po';
import editAcknowledgmentTemplatePo from '../../pageobject/email/edit-acknowledgment-template.po';

describe('Email', () => {
    const randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
    beforeAll(async () => {
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
        loginPage.login("fritz");
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    afterEach(async () => {
        await browser.refresh();
        await utilCommon.waitUntilSpinnerToHide();
    });

    it('DRDMV-19011: Automated task should not have email options but other type of task should have email option	', async () => {
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

        let automatedTaskTemplateName = 'Automated  task' + randomStr;
        let automatedTaskSummary = 'AutomatedSummary' + randomStr;
        var automatedtemplateData = {
            "templateName": `${automatedTaskTemplateName}`,
            "templateSummary": `${automatedTaskSummary}`,
            "templateStatus": "Active",
            "processBundle": "com.bmc.arsys.rx.approval",
            "processName": "Approval Process 1",
        }
        await apiHelper.createAutomatedTaskTemplate(automatedtemplateData);

        var caseData = {
            "Requester": "qtao",
            "Company": "Petramco",
            "Summary": "Create case for me postman1",
            "Support Group": "Compensation and Benefits",
            "Assignee": "Qadim Katawazi"
        }
        await apiHelper.apiLogin('fritz');
        var newCaseTemplate = await apiHelper.createCase(caseData);
        var displayId: string = newCaseTemplate.displayId;
        await utilGrid.clearFilter();
        await utilGrid.searchAndOpenHyperlink(displayId);
        await viewCasePage.clickAddTaskButton();
        await viewCasePage.addTaskFromTaskTemplate(taskTemplateName);
        await browser.sleep(2000);
        await viewCasePage.addTaskFromTaskTemplate(automatedTaskTemplateName);
        await browser.sleep(2000);
        await viewCasePage.addTaskFromTaskTemplate(externalTaskTemplateName);
        await browser.sleep(2000);
        await manageTaskBladePo.clickTaskLinkOnManageTask(automatedTaskSummary);
        await expect(emailPo.isEmailIconLinkPresent()).toBeTruthy();
        await emailPo.clickOnEmailIconLink();
        await expect(await emailPo.getEmailBody()).toContain('Regards');
        await expect(await emailPo.getEmailBody()).toContain('Fritz Schulz');
        await expect(await emailPo.getEmailBody()).toContain('fritz.schulz@petramco.com');
        await emailPo.clickOnDiscardButton();
        await utilCommon.clickOnWarningOk();
        await viewTask.clickOnViewCase();
        await viewCasePage.clickAddTaskButton();
        await manageTaskBladePo.clickTaskLinkOnManageTask(manualTaskSummary);
        await expect(emailPo.isEmailIconLinkPresent()).toBeTruthy();
        await emailPo.clickOnEmailIconLink();
        await expect(await emailPo.getEmailBody()).toContain('Regards');
        await expect(await emailPo.getEmailBody()).toContain('Fritz Schulz');
        await expect(await emailPo.getEmailBody()).toContain('fritz.schulz@petramco.com');
        await emailPo.clickOnDiscardButton();
        await utilCommon.clickOnWarningOk();
        await viewTask.clickOnViewCase();
        await viewCasePage.clickAddTaskButton();
        await manageTaskBladePo.clickTaskLinkOnManageTask(externalTaskSummary);
        await expect(emailPo.isEmailIconLinkPresent()).toBeTruthy();
        await emailPo.clickOnEmailIconLink();
        await expect(await emailPo.getEmailBody()).toContain('Regards');
        await expect(await emailPo.getEmailBody()).toContain('Fritz Schulz');
        await expect(await emailPo.getEmailBody()).toContain('fritz.schulz@petramco.com');
        await emailPo.clickOnDiscardButton();
        await utilCommon.clickOnWarningOk();

    }, 1200 * 1000)

    it('DRDMV-19008: Email icon and Requester email link should open compose email dialog in Task', async () => {
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
            "Support Group": "Compensation and Benefits",
            "Assignee": "Qadim Katawazi"
        }
        await apiHelper.apiLogin('fritz');
        var newCaseTemplate = await apiHelper.createCase(caseData);
        var displayId: string = newCaseTemplate.displayId;
        await utilGrid.clearFilter();
        await utilGrid.searchAndOpenHyperlink(displayId);
        await viewCasePage.clickAddTaskButton();
        await viewCasePage.addTaskFromTaskTemplate(taskTemplateName);
        await browser.sleep(2000);
        await viewCasePage.addTaskFromTaskTemplate(externalTaskTemplateName);
        await browser.sleep(2000);
        await manageTaskBladePo.clickTaskLinkOnManageTask(manualTaskSummary);
        await browser.sleep(2000);
        await expect(emailPo.isEmailIconLinkPresent()).toBeTruthy();
        let ManualtaskID = await viewTask.getTaskID();
        await emailPo.clickOnEmailIconLink();
        expect(await emailPo.getSubject()).toContain(displayId + ':' + ManualtaskID);
        await expect(await emailPo.getEmailBody()).toContain('Regards');
        await expect(await emailPo.getEmailBody()).toContain('Fritz Schulz');
        await expect(await emailPo.getEmailBody()).toContain('fritz.schulz@petramco.com');
        expect(await emailPo.countOfPersonsOnEntered3Char('To', 'fri')).toBe(3);
        expect(await emailPo.countOfPersonsOnEntered3Char('Cc', 'fri')).toBe(3);
        await emailPo.clickOnDiscardButton();
        await utilCommon.clickOnWarningOk();
        await viewTask.clickOnRequesterEmail();
        await expect(await emailPo.getEmailBody()).toContain('Regards');
        await expect(await emailPo.getEmailBody()).toContain('Fritz Schulz');
        await expect(await emailPo.getEmailBody()).toContain('fritz.schulz@petramco.com');
        expect(await emailPo.countOfPersonsOnEntered3Char('To', 'fri')).toBe(3);
        expect(await emailPo.countOfPersonsOnEntered3Char('Cc', 'fri')).toBe(3);
        await emailPo.setToOrCCInputTetxbox('To', 'fritz.schulz@petramco.com');
        expect(await emailPo.getSubject()).toContain(displayId + ':' + ManualtaskID);
        //verify activity email post
        await emailPo.clickOnSendButton();
        expect(await activityTabPo.getemailContent()).toContain('Fritz Schulz sent an email');
        await viewTask.clickOnViewCase();
        await viewCasePage.clickAddTaskButton();
        await manageTaskBladePo.clickTaskLinkOnManageTask(externalTaskSummary);
        await expect(emailPo.isEmailIconLinkPresent()).toBeTruthy();
        let ExternaltaskID = await viewTask.getTaskID();
        await emailPo.clickOnEmailIconLink();
        expect(await emailPo.getSubject()).toContain(displayId + ':' + ExternaltaskID);
        await expect(await emailPo.getEmailBody()).toContain('Regards');
        await expect(await emailPo.getEmailBody()).toContain('Fritz Schulz');
        await expect(await emailPo.getEmailBody()).toContain('fritz.schulz@petramco.com');
        expect(await emailPo.countOfPersonsOnEntered3Char('To', 'fri')).toBe(3);
        expect(await emailPo.countOfPersonsOnEntered3Char('Cc', 'fri')).toBe(3);
        await emailPo.clickOnDiscardButton();
        await utilCommon.clickOnWarningOk();
        await viewTask.clickOnRequesterEmail();
        await expect(await emailPo.getEmailBody()).toContain('Regards');
        await expect(await emailPo.getEmailBody()).toContain('Fritz Schulz');
        await expect(await emailPo.getEmailBody()).toContain('fritz.schulz@petramco.com');
        expect(await emailPo.countOfPersonsOnEntered3Char('To', 'fri')).toBe(3);
        expect(await emailPo.countOfPersonsOnEntered3Char('Cc', 'fri')).toBe(3);
        await emailPo.setToOrCCInputTetxbox('To', 'fritz.schulz@petramco.com');
        expect(await emailPo.getSubject()).toContain(displayId + ':' + ExternaltaskID);
        //verify activity email post
        await emailPo.clickOnSendButton();
        expect(await activityTabPo.getemailContent()).toContain('Fritz Schulz sent an email');
    })

    it('DRDMV-19009: Verify Subject of Email from Task Compose email', async () => {
        try {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
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
                "Support Group": "Compensation and Benefits",
                "Assignee": "Qadim Katawazi"
            }
            await apiHelper.apiLogin('qkatawazi');
            var newCaseTemplate = await apiHelper.createCase(caseData);
            var displayId: string = newCaseTemplate.displayId;
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(displayId);
            await viewCasePage.clickAddTaskButton();
            await viewCasePage.addTaskFromTaskTemplate(taskTemplateName);
            await browser.sleep(2000);
            await viewCasePage.addTaskFromTaskTemplate(externalTaskTemplateName);
            await browser.sleep(2000);
            await manageTaskBladePo.clickTaskLinkOnManageTask(manualTaskSummary);
            await browser.sleep(2000);
            await viewTask.clickOnEditTask();
            await editTask.clickOnChangeAssignementButton();
            await changeAssignmentBladePo.selectSupportGroup('Facilities');
            await changeAssignmentBladePo.selectAssignee('Fritz Schulz');
            await changeAssignmentBladePo.clickOnAssignButton();
            await editTask.clickOnSaveButton();
            await expect(emailPo.isEmailIconLinkPresent()).toBeTruthy();
            let ManualtaskID = await viewTask.getTaskID();
            await emailPo.clickOnEmailIconLink();
            expect(await emailPo.getSubject()).toContain(displayId + ':' + ManualtaskID);
            await emailPo.clickOnDiscardButton();
            await utilCommon.clickOnWarningOk();
            await viewTask.clickOnViewCase();
            await viewCasePo.clickAddTaskButton();
            //verify activity email post
            await manageTaskBladePo.clickTaskLinkOnManageTask(externalTaskSummary);
            await viewTask.clickOnEditTask();
            await editTask.clickOnChangeAssignementButton();
            await changeAssignmentBladePo.selectSupportGroup('Facilities');
            await changeAssignmentBladePo.selectAssignee('Fritz Schulz');
            await changeAssignmentBladePo.clickOnAssignButton();
            await editTask.clickOnSaveButton();
            await expect(emailPo.isEmailIconLinkPresent()).toBeTruthy();
            let ExternaltaskID = await viewTask.getTaskID();
            await emailPo.clickOnEmailIconLink();
            expect(await emailPo.getSubject()).toContain(displayId + ':' + ExternaltaskID);
            await emailPo.clickOnDiscardButton();
            await utilCommon.clickOnWarningOk();
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoTaskConsole();
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(ExternaltaskID);
            await emailPo.clickOnEmailIconLink();
            expect(await emailPo.getSubject()).toContain(displayId + ':' + ExternaltaskID);
            await emailPo.clickOnDiscardButton();
            await utilCommon.clickOnWarningOk();
            await navigationPage.gotoTaskConsole();
            await utilGrid.searchAndOpenHyperlink(ManualtaskID);
            await emailPo.clickOnEmailIconLink();
            expect(await emailPo.getSubject()).toContain(displayId + ':' + ManualtaskID);
            await emailPo.clickOnDiscardButton();
            await utilCommon.clickOnWarningOk();
        } catch (e) {
            expect(true).toBeFalsy();
            console.log(e);
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        }
    }, 1200 * 1000)

    it('DRDMV-19558: Verify social notes other than email should not have reply and reply all options', async () => {
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
            "Support Group": "Compensation and Benefits",
            "Assignee": "Qadim Katawazi"
        }
        await apiHelper.apiLogin('fritz');
        var newCaseTemplate = await apiHelper.createCase(caseData);
        var displayId: string = newCaseTemplate.displayId;
        await utilGrid.clearFilter();
        await utilGrid.searchAndOpenHyperlink(displayId);
        await socialActivity.addActivityNote('This is case notes templates');
        await socialActivity.clickOnPostButton();
        await expect(socialActivity.getActivityNotesText('Reply')).toBeFalsy();
        await expect(socialActivity.getActivityNotesText('Reply all')).toBeFalsy();
        await viewCasePage.clickAddTaskButton();
        await viewCasePage.addTaskFromTaskTemplate(taskTemplateName);
        await manageTaskBladePo.clickTaskLinkOnManageTask(manualTaskSummary);
        await socialActivity.addActivityNote('This is case notes templates');
        await socialActivity.clickOnPostButton();
        await expect(socialActivity.getActivityNotesText('Reply')).toBeFalsy();
        await expect(socialActivity.getActivityNotesText('Reply all')).toBeFalsy();
    })

    it('DRDMV-19556: Reply / Reply All earlier email context should be copied as part of email composition on Task', async () => {
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
            "Support Group": "Compensation and Benefits",
            "Assignee": "Qadim Katawazi"
        }
        await apiHelper.apiLogin('fritz');
        var newCaseTemplate = await apiHelper.createCase(caseData);
        var displayId: string = newCaseTemplate.displayId;
        await utilGrid.clearFilter();
        await utilGrid.searchAndOpenHyperlink(displayId);
        await viewCasePage.clickAddTaskButton();
        await viewCasePage.addTaskFromTaskTemplate(taskTemplateName);
        await viewCasePage.addTaskFromTaskTemplate(externalTaskTemplateName);
        await browser.sleep(2000);
        await manageTaskBladePo.clickTaskLinkOnManageTask(manualTaskSummary);
        await browser.sleep(2000);
        var ManualtaskID = await viewTask.getTaskID();
        await emailPo.clickOnEmailIconLink();
        await emailPo.addAttachment();
        await emailPo.setToOrCCInputTetxbox('To', 'fritz.schulz@petramco.com');
        await emailPo.setToOrCCInputTetxbox('Cc', 'qkatawazi@petramco.com')
        await emailPo.setEmailBody('this is new email sending frist time to the user');
        await emailPo.clickOnSendButton();
        expect(await activityTabPo.getemailContent()).toContain('Fritz Schulz sent an email');
        expect(await activityTabPo.getemailContent()).toContain('To: Fritz Schulz');
        expect(await activityTabPo.getemailContent()).toContain(displayId + ':' + ManualtaskID + ':' + manualTaskSummary);
        expect(await activityTabPo.getemailContent()).toContain('this is new email sending frist time to the user');
        await activityTabPo.clickOnReplyAll();
        await emailPo.isComposeEmailUIDisplay();
        expect(await emailPo.getToEmailPerson()).toContain('Fritz Schulz');
        expect(await emailPo.getCcEmailPerson()).toContain('Qadim Katawazi');
        expect(await emailPo.getEmailBody()).toContain('this is new email sending frist time to the user');
        expect(await emailPo.getEmailBody()).toContain('While replying, please do not add information below this line');
        await emailPo.setEmailBody('this is second reply to all');
        await emailPo.clickOnSendButton();
        expect(await activityTabPo.getemailContent()).toContain('this is second reply to all');
        await activityTabPo.clickOnReply();
        expect(await emailPo.getToEmailPerson()).toContain('Fritz Schulz');
        expect(await activityTabPo.getemailContent()).toContain('this is second reply to all');
        await emailPo.setEmailBody('this is third reply');
        await emailPo.clickOnSendButton();
        await viewTask.clickOnViewCase();
        await viewCasePage.clickAddTaskButton();
        await manageTaskBladePo.clickTaskLinkOnManageTask(externalTaskSummary);
        var externaltaskID = await viewTask.getTaskID();
        await emailPo.clickOnEmailIconLink();
        await emailPo.addAttachment();
        await emailPo.setToOrCCInputTetxbox('To', 'fritz.schulz@petramco.com');
        await emailPo.setToOrCCInputTetxbox('Cc', 'qkatawazi@petramco.com')
        await emailPo.setEmailBody('this is new email sending frist time to the user');
        await emailPo.clickOnSendButton();
        expect(await activityTabPo.getemailContent()).toContain('Fritz Schulz sent an email');
        expect(await activityTabPo.getemailContent()).toContain('To: Fritz Schulz');
        expect(await activityTabPo.getemailContent()).toContain(displayId + ':' + externaltaskID + ':' + externalTaskSummary);
        expect(await activityTabPo.getemailContent()).toContain('this is new email sending frist time to the user');
        await activityTabPo.clickOnReplyAll();
        await emailPo.isComposeEmailUIDisplay();
        expect(await emailPo.getToEmailPerson()).toContain('Fritz Schulz');
        expect(await emailPo.getCcEmailPerson()).toContain('Qadim Katawazi');
        expect(await emailPo.getEmailBody()).toContain('While replying, please do not add information below this line');
        expect(await emailPo.getEmailBody()).toContain('this is new email sending frist time to the user');
        await emailPo.setEmailBody('this is second reply to all');
        await emailPo.clickOnSendButton();
        expect(await activityTabPo.getemailContent()).toContain('this is second reply to all');
        await activityTabPo.clickOnReply();
        expect(await emailPo.getToEmailPerson()).toContain('Fritz Schulz');
        expect(await activityTabPo.getemailContent()).toContain('this is second reply to all');
        await emailPo.setEmailBody('this is third reply');
        await emailPo.clickOnSendButton();
        expect(await activityTabPo.getemailContent()).toContain('this is third reply');
    }, 200 * 1000)

    it('DRDMV-19557: For Reply / Reply All earlier email context should be copied as part of email composition on Case', async () => {
        var caseData = {
            "Requester": "qtao",
            "Company": "Petramco",
            "Summary": "Create case for Email Test",
            "Support Group": "Compensation and Benefits",
            "Assignee": "Qadim Katawazi"
        }
        await apiHelper.apiLogin('fritz');
        var newCaseTemplate = await apiHelper.createCase(caseData);
        var displayId: string = newCaseTemplate.displayId;
        await utilGrid.clearFilter();
        await utilGrid.searchAndOpenHyperlink(displayId);
        await emailPo.clickOnEmailIconLink();
        await emailPo.addAttachment();
        await emailPo.setToOrCCInputTetxbox('To', 'fritz.schulz@petramco.com');
        await emailPo.setToOrCCInputTetxbox('Cc', 'qkatawazi@petramco.com')
        await emailPo.setEmailBody('this is new email sending frist time to the user');
        await emailPo.clickOnSendButton();
        expect(await activityTabPo.getemailContent()).toContain('Fritz Schulz sent an email');
        expect(await activityTabPo.getemailContent()).toContain('To: Fritz Schulz');
        expect(await activityTabPo.getemailContent()).toContain(displayId + ':' + 'Create case for Email Test');
        expect(await activityTabPo.getemailContent()).toContain('this is new email sending frist time to the user');
        await activityTabPo.clickOnReplyAll();
        await emailPo.isComposeEmailUIDisplay();
        expect(await emailPo.getToEmailPerson()).toContain('Fritz Schulz');
        expect(await emailPo.getCcEmailPerson()).toContain('Qadim Katawazi');
        expect(await emailPo.getEmailBody()).toContain('this is new email sending frist time to the user');
        expect(await emailPo.getEmailBody()).toContain('While replying, please do not add information below this line');
        await emailPo.setEmailBody('this is second reply to all');
        await emailPo.clickOnSendButton();
        expect(await activityTabPo.getemailContent()).toContain('this is second reply to all');
        await activityTabPo.clickOnReply();
        expect(await emailPo.getToEmailPerson()).toContain('Fritz Schulz');
        expect(await activityTabPo.getemailContent()).toContain('this is second reply to all');
        await emailPo.setEmailBody('this is third reply');
        await emailPo.clickOnSendButton();
    }, 200 * 1000)


    it('DRDMV-19555: In Case of Reply/Reply All  if we select new Email template then previous contents should not be erased.', async () => {
        await apiHelper.apiLogin('tadmin');
        let emailTemplateData = require('../../data/ui/email/email.template.api.json');
        let emailTemplateName: string = await emailTemplateData['emailTemplateWithMandatoryField'].TemplateName + randomStr;
        emailTemplateData['emailTemplateWithMandatoryField'].TemplateName = emailTemplateName;
        //second email template
        await apiHelper.createEmailTemplate(emailTemplateData['emailTemplateWithMandatoryField']);
        let emailSalaryTemplate: string = await emailTemplateData['emailTemplateForSalary'].TemplateName + randomStr;
        emailTemplateData['emailTemplateForSalary'].TemplateName = emailSalaryTemplate;
        await apiHelper.createEmailTemplate(emailTemplateData['emailTemplateForSalary']);
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
            "Requester": "Fritz",
            "Company": "Petramco",
            "Summary": "Create case for me postman1",
            "Support Group": "Compensation and Benefits",
            "Assignee": "Qadim Katawazi"
        }
        await apiHelper.apiLogin('fritz');
        var newCaseTemplate = await apiHelper.createCase(caseData);
        var displayId: string = newCaseTemplate.displayId;
        await utilGrid.clearFilter();
        await utilGrid.searchAndOpenHyperlink(displayId);
        await viewCasePage.clickAddTaskButton();
        await viewCasePage.addTaskFromTaskTemplate(taskTemplateName);
        await viewCasePage.addTaskFromTaskTemplate(externalTaskTemplateName);
        await browser.sleep(2000);
        await manageTaskBladePo.clickTaskLinkOnManageTask(manualTaskSummary);
        await viewTask.clickOnEditTask();
        await editTask.clickOnChangeAssignementButton();
        await changeAssignmentBladePo.selectSupportGroup('Facilities');
        await changeAssignmentBladePo.selectAssignee('Fritz Schulz');
        await changeAssignmentBladePo.clickOnAssignButton();
        await editTask.clickOnSaveButton();
        await viewTask.clickOnRequesterEmail();
        await emailPo.clickOnSelectTempalteButton();
        await emailTemplateBladePo.searchAndSelectEmailTemplate(emailTemplateName);
        await emailTemplateBladePo.clickOnApplyButton();
        await emailPo.clickOnSendButton();
        await browser.refresh();
        expect(await activityTabPo.getemailContent()).toContain('Fritz Schulz sent an email');
        expect(await activityTabPo.getemailContent()).toContain('To: Fritz Schulz');
        await activityTabPo.clickOnReply();
        expect(await emailPo.getToEmailPerson()).toContain('Fritz Schulz');
        expect(await emailPo.getEmailBody()).toContain('Hi Team ,\n\n\n\nI am taking leave today.\n\n\n\nThanks.');
        await emailPo.clickOnSelectTempalteButton();
        await emailTemplateBladePo.searchAndSelectEmailTemplate(emailSalaryTemplate);
        await emailTemplateBladePo.clickOnApplyButton();
        //defect -Bug DRDMV-19619
        //expect(await emailPo.getEmailBody()).toContain('Hi Team ,\n\n\n\nI am taking leave today.\n\n\n\nThanks.');
        await emailPo.clickOnSendButton();
        await viewTask.clickOnViewCase();
        await viewCasePage.clickAddTaskButton();
        await manageTaskBladePo.clickTaskLinkOnManageTask(externalTaskSummary);
        await viewTask.clickOnEditTask();
        await editTask.clickOnChangeAssignementButton();
        await changeAssignmentBladePo.selectSupportGroup('Facilities');
        await changeAssignmentBladePo.selectAssignee('Fritz Schulz');
        await changeAssignmentBladePo.clickOnAssignButton();
        await editTask.clickOnSaveButton();
        await viewTask.clickOnRequesterEmail();
        await emailPo.setToOrCCInputTetxbox('To', 'fritz.schulz@petramco.com');
        await emailPo.clickOnSelectTempalteButton();
        await emailTemplateBladePo.searchAndSelectEmailTemplate(emailTemplateName);
        await emailTemplateBladePo.clickOnApplyButton();
        await emailPo.clickOnSendButton();
        await browser.refresh();
        await browser.sleep(2000);
        await activityTabPo.clickOnReply();
        expect(await emailPo.getToEmailPerson()).toContain('Fritz Schulz');
        expect(await emailPo.getEmailBody()).toContain('Hi Team ,\n\n\n\nI am taking leave today.\n\n\n\nThanks.');
        await emailPo.clickOnSelectTempalteButton();
        await emailTemplateBladePo.searchAndSelectEmailTemplate(emailSalaryTemplate);
        await emailTemplateBladePo.clickOnApplyButton();
        // defect -Bug DRDMV-19619
        //expect(await emailPo.getEmailBody()).toContain('Hi Team ,\n\n\n\nI am taking leave today.\n\n\n\nThanks.');
        await emailPo.clickOnSendButton();
    }, 200 * 1000)

    it('DRDMV-19552: Verify task acknowledgement template are listed in Email Acknowledgement template and In Email Configuration', async () => {
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
    })

    it('DRDMV-19550: Email Templates option driven by Task assignee permission for case', async () => {
        try {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
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
                "Support Group": "Compensation and Benefits",
                "Assignee": "Qadim Katawazi"
            }
            await apiHelper.apiLogin('qkatawazi');
            var newCaseTemplate = await apiHelper.createCase(caseData);
            var displayId: string = newCaseTemplate.displayId;
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(displayId);
            await viewCasePage.clickAddTaskButton();
            await viewCasePage.addTaskFromTaskTemplate(taskTemplateName);
            await browser.sleep(2000);
            await viewCasePage.addTaskFromTaskTemplate(externalTaskTemplateName);
            await browser.sleep(2000);
            await manageTaskBladePo.clickTaskLinkOnManageTask(manualTaskSummary);
            await viewTask.clickOnEditTask();
            await editTask.clickOnChangeAssignementButton();
            await changeAssignmentBladePo.selectSupportGroup('Facilities');
            await changeAssignmentBladePo.selectAssignee('Fritz Schulz');
            await changeAssignmentBladePo.clickOnAssignButton();
            await editTask.clickOnSaveButton();
            let ManualtaskID = await viewTask.getTaskID();
            await viewTask.clickOnViewCase();
            await viewCasePo.clickAddTaskButton();
            //verify activity email post
            await manageTaskBladePo.clickTaskLinkOnManageTask(externalTaskSummary);
            let ExternaltaskID = await viewTask.getTaskID();
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoTaskConsole();
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(ExternaltaskID);
            await viewTask.clickOnRequesterEmail(); 
            // https://jira.bmc.com/browse/DRDMV-19670  defect
            expect(await emailPo.isSelectEmailTemplateButtonPresent()).toBeFalsy();
            await emailPo.clickOnDiscardButton();
            await utilCommon.clickOnWarningOk();
            await navigationPage.gotoTaskConsole();
            await utilGrid.searchAndOpenHyperlink(ManualtaskID);
            await viewTask.clickOnRequesterEmail();
            // https://jira.bmc.com/browse/DRDMV-19670  defect
            expect(await emailPo.isSelectEmailTemplateButtonPresent()).toBeFalsy();
            await emailPo.clickOnDiscardButton();
            await utilCommon.clickOnWarningOk();
        } catch (e) {
            expect(true).toBeFalsy();
            console.log(e);
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        }
    }, 200 * 1000)

})
