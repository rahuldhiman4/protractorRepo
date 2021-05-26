import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import viewCasePo from "../../pageobject/case/view-case.po";
import changeAssignmentBladePo from '../../pageobject/common/change-assignment.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import composeMailPo from '../../pageobject/email/compose-mail.po';
import emailTemplateBladePo from '../../pageobject/email/select-email-template-blade.po';
import editAcknowledgmentTemplatePo from '../../pageobject/settings/email/edit-acknowledgment-template.po';
import activityTabPo from '../../pageobject/social/activity-tab.po';
import editTask from "../../pageobject/task/edit-task.po";
import manageTaskBladePo from '../../pageobject/task/manage-task-blade.po';
import viewTaskPo from "../../pageobject/task/view-task.po";
import { BWF_BASE_URL, BWF_PAGE_TITLES } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

describe('Email Task', () => {
    beforeAll(async () => {
        let emailConfig = {
            email: "bmctemptestemail@gmail.com",
            incomingMailBoxName: "IncomingMail",
        }

        await browser.get(BWF_BASE_URL);
        await loginPage.login("qkatawazi");
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteAllEmailConfiguration();
        await apiHelper.createEmailBox('incoming');
        await apiHelper.createEmailBox('outgoing');
        await apiHelper.createEmailConfiguration(emailConfig);
    });

    afterAll(async () => {
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteAllEmailConfiguration();
        await utilityCommon.closeAllBlades();
        await composeMailPo.clickOnDiscardButton();
        await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        await navigationPage.signOut();
    });

    describe('[3907]: Automated task should not have email options but other type of task should have email option	', async () => {
        const randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let taskTemplateName = 'Manual task19011' + randomStr;
        let manualTaskSummary = 'ManualSummary19011' + randomStr;
        let externalTaskTemplateName = 'External task19011' + randomStr;
        let externalTaskSummary = 'ExternalSummary19011' + randomStr;
        let automatedTaskTemplateName = 'Automated task19011' + randomStr;
        let automatedTaskSummary = 'AutomatedSummary19011' + randomStr;
        let automatedTaskProcess = 'Auto Proces' + randomStr;
        let displayId;
        beforeAll(async () => {
            let templateData = {
                "templateName": `${taskTemplateName}`,
                "templateSummary": `${manualTaskSummary}`,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createManualTaskTemplate(templateData);
            let externaltemplateData = {
                "templateName": `${externalTaskTemplateName}`,
                "templateSummary": `${externalTaskSummary}`,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.createExternalTaskTemplate(externaltemplateData);
            let automatedtemplateData = {
                "templateName": `${automatedTaskTemplateName}`,
                "templateSummary": `${automatedTaskSummary}`,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": `${automatedTaskProcess}`,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.createAutomatedTaskTemplate(automatedtemplateData);

            let caseData = {
                "Requester": "qtao",
                "Company": "Petramco",
                "Summary": "Create case for me postman1",
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
            }
            await apiHelper.apiLogin('qkatawazi');
            let newCaseTemplate = await apiHelper.createCase(caseData);
            displayId = newCaseTemplate.displayId;
        });
        it('[3907]: Automated task should not have email options but other type of task should have email option	', async () => {
            await utilityGrid.searchAndOpenHyperlink(displayId);
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.addTaskFromTaskTemplate(manualTaskSummary);
            await manageTaskBladePo.addTaskFromTaskTemplate(automatedTaskSummary);
            await manageTaskBladePo.addTaskFromTaskTemplate(externalTaskSummary);
            await manageTaskBladePo.clickTaskLink(automatedTaskSummary);
            await expect(composeMailPo.isEmailIconLinkPresent()).toBeTruthy();
            await viewTaskPo.clickEmailLink();
            await composeMailPo.clickOnDiscardButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            await viewTaskPo.clickOnViewCase();
        });
        it('[3907]: Automated task should not have email options but other type of task should have email option	', async () => {
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickTaskLink(manualTaskSummary);
            await expect(composeMailPo.isEmailIconLinkPresent()).toBeTruthy();
            await viewTaskPo.clickEmailLink();
            await composeMailPo.clickOnDiscardButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            await viewTaskPo.clickOnViewCase();
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickTaskLink(externalTaskSummary);
            await expect(composeMailPo.isEmailIconLinkPresent()).toBeTruthy();
            await viewTaskPo.clickEmailLink();
            await composeMailPo.clickOnDiscardButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });
    });

    //Failed due to application issue...defect logged DRDMV-21883
    describe('[3910]: Email icon and Requester email link should open compose email dialog in Task', async () => {
        const randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let taskTemplateName = 'Manual task19008' + randomStr;
        let manualTaskSummary = 'ManualSummary19008' + randomStr;
        let ExternaltaskID, displayId;
        let externalTaskTemplateName = 'Externaltask19008' + randomStr;
        let ManualtaskID, externalTaskSummary = 'ExternalSummary19008' + randomStr;
        beforeAll(async () => {
            let templateData = {
                "templateName": `${taskTemplateName}`,
                "templateSummary": `${manualTaskSummary}`,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createManualTaskTemplate(templateData);
            let externaltemplateData = {
                "templateName": `${externalTaskTemplateName}`,
                "templateSummary": `${externalTaskSummary}`,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.createExternalTaskTemplate(externaltemplateData);
            let caseData = {
                "Requester": "qtao",
                "Company": "Petramco",
                "Summary": "Create case for me postman1",
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
            }
            await apiHelper.apiLogin('qkatawazi');
            let newCaseTemplate = await apiHelper.createCase(caseData);
            displayId = newCaseTemplate.displayId;
        });
        it('[3910]: Email icon and Requester email link should open compose email dialog in Task', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(displayId);
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.addTaskFromTaskTemplate(manualTaskSummary);
            await manageTaskBladePo.addTaskFromTaskTemplate(externalTaskSummary);
            await manageTaskBladePo.clickTaskLink(manualTaskSummary);
            await browser.sleep(2000);// To wait until view task page gets load corrrectly.
            await expect(await composeMailPo.isEmailIconLinkPresent()).toBeTruthy();
            ManualtaskID = await viewTaskPo.getTaskID();
            await viewTaskPo.clickEmailLink();
            expect(await composeMailPo.getSubject()).toContain(displayId + ':' + ManualtaskID);
            //story changes
            // await expect(await emailPo.getEmailBody()).toContain('Regards');
            // await expect(await emailPo.getEmailBody()).toContain('Fritz Schulz');
            // await expect(await emailPo.getEmailBody()).toContain('fritz.schulz@petramco.com');
            expect(await composeMailPo.searchPerson('To', 'fri')).toBe(2);
            expect(await composeMailPo.searchPerson('Cc', 'fri')).toBe(2);
            await composeMailPo.clickOnDiscardButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            await viewTaskPo.clickOnRequesterEmail();
        });
        it('[3910]: Email icon and Requester email link should open compose email dialog in Task', async () => {
            //story changes
            // await expect(await emailPo.getEmailBody()).toContain('Regards');
            // await expect(await emailPo.getEmailBody()).toContain('Fritz Schulz');
            // await expect(await emailPo.getEmailBody()).toContain('fritz.schulz@petramco.com');
            expect(await composeMailPo.searchPerson('To', 'fri')).toBe(2);
            expect(await composeMailPo.searchPerson('Cc', 'fri')).toBe(2);
            await composeMailPo.setToOrCCInputTextbox('To', 'fritz.schulz@petramco.com');
            expect(await composeMailPo.getSubject()).toContain(displayId + ':' + ManualtaskID);
            //verify activity email post
            await composeMailPo.clickOnSendButton();
            expect(await activityTabPo.getEmailTitle()).toContain('Qadim Katawazi sent an email');
            await viewTaskPo.clickOnViewCase();
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickTaskLink(externalTaskSummary);
            await expect(composeMailPo.isEmailIconLinkPresent()).toBeTruthy();
            ExternaltaskID = await viewTaskPo.getTaskID();
            await viewTaskPo.clickEmailLink();
            expect(await composeMailPo.getSubject()).toContain(displayId + ':' + ExternaltaskID);
            // await expect(await emailPo.getEmailBody()).toContain('Regards');
            // await expect(await emailPo.getEmailBody()).toContain('Fritz Schulz');
            // await expect(await emailPo.getEmailBody()).toContain('fritz.schulz@petramco.com');
            expect(await composeMailPo.searchPerson('To', 'fri')).toBe(2);
            expect(await composeMailPo.searchPerson('Cc', 'fri')).toBe(2);
            await composeMailPo.clickOnDiscardButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            await viewTaskPo.clickOnRequesterEmail();
        });
        it('[3910]: Email icon and Requester email link should open compose email dialog in Task', async () => {
            // await expect(await emailPo.getEmailBody()).toContain('Regards');
            // await expect(await emailPo.getEmailBody()).toContain('Fritz Schulz');
            // await expect(await emailPo.getEmailBody()).toContain('fritz.schulz@petramco.com');
            expect(await composeMailPo.searchPerson('To', 'fri')).toBe(2);
            expect(await composeMailPo.searchPerson('Cc', 'fri')).toBe(2);
            await composeMailPo.setToOrCCInputTextbox('To', 'fritz.schulz@petramco.com');
            expect(await composeMailPo.getSubject()).toContain(displayId + ':' + ExternaltaskID);
            //verify activity email post
            await composeMailPo.clickOnSendButton();
            expect(await activityTabPo.getEmailTitle()).toContain('Qadim Katawazi sent an email');
        });
    });

    describe('[3909]: Verify Subject of Email from Task Compose email', async () => {
        const randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let displayId;
        let taskTemplateName = 'Manual  task19009' + randomStr;
        let manualTaskSummary = 'ManualSummary19009' + randomStr;
        let ManualtaskID, externalTaskTemplateName = 'External  task19009' + randomStr;
        let ExternaltaskID, externalTaskSummary = 'ExternalSummary19009' + randomStr;
        beforeAll(async () => {
            let templateData = {
                "templateName": `${taskTemplateName}`,
                "templateSummary": `${manualTaskSummary}`,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createManualTaskTemplate(templateData);
            let externaltemplateData = {
                "templateName": `${externalTaskTemplateName}`,
                "templateSummary": `${externalTaskSummary}`,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.createExternalTaskTemplate(externaltemplateData);
            let caseData = {
                "Requester": "qtao",
                "Company": "Petramco",
                "Summary": "Create case for me postman1",
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
            }
            await apiHelper.apiLogin('qkatawazi');
            let newCaseTemplate = await apiHelper.createCase(caseData);
            displayId = newCaseTemplate.displayId;
        });
        it('[3909]: Verify Subject of Email from Task Compose email', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(displayId);
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.addTaskFromTaskTemplate(manualTaskSummary);
            await manageTaskBladePo.addTaskFromTaskTemplate(externalTaskSummary);
            await manageTaskBladePo.clickTaskLink(manualTaskSummary);
            await browser.sleep(2000); // To wait until view task page gets load correctly.
            await viewTaskPo.clickOnEditTask();
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'CA Support 3');
            await changeAssignmentBladePo.setDropDownValue('Assignee', 'Quigley Heroux');
            await editTask.clickOnSaveButton();
            await expect(composeMailPo.isEmailIconLinkPresent()).toBeTruthy();
            ManualtaskID = await viewTaskPo.getTaskID();
            await viewTaskPo.clickEmailLink();
            expect(await composeMailPo.getSubject()).toContain(displayId + ':' + ManualtaskID);
            await composeMailPo.clickOnDiscardButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            await viewTaskPo.clickOnViewCase();
        });
        it('[3909]: Verify Subject of Email from Task Compose email', async () => {
            await viewCasePo.clickAddTaskButton();
            //verify activity email post
            await manageTaskBladePo.clickTaskLink(externalTaskSummary);
            await viewTaskPo.clickOnEditTask();
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'CA Support 3');
            await changeAssignmentBladePo.setDropDownValue('Assignee', 'Quigley Heroux');
            await editTask.clickOnSaveButton();
            await expect(composeMailPo.isEmailIconLinkPresent()).toBeTruthy();
            ExternaltaskID = await viewTaskPo.getTaskID();
            await viewTaskPo.clickEmailLink();
            expect(await composeMailPo.getSubject()).toContain(displayId + ':' + ExternaltaskID);
            await composeMailPo.clickOnDiscardButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });
        it('[3909]: Verify Subject of Email from Task Compose email', async () => {
            await navigationPage.signOut();
            await loginPage.login('qheroux');
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(ExternaltaskID);
            await viewTaskPo.clickEmailLink();
            expect(await composeMailPo.getSubject()).toContain(displayId + ':' + ExternaltaskID);
            await composeMailPo.clickOnDiscardButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(ManualtaskID);
            await viewTaskPo.clickEmailLink();
            expect(await composeMailPo.getSubject()).toContain(displayId + ':' + ManualtaskID);
            await composeMailPo.clickOnDiscardButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    it('[3841]: Verify social notes other than email should not have reply and reply all options', async () => {
        const randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let taskTemplateName = 'Manualtask123' + randomStr;
        let manualTaskSummary = 'ManualSummary123' + randomStr;
        let templateData = {
            "templateName": taskTemplateName,
            "templateSummary": manualTaskSummary,
            "templateStatus": "Active",
            "taskCompany": "Petramco",
            "ownerCompany": "Petramco",
            "ownerBusinessUnit": "United States Support",
            "ownerGroup": "US Support 3"
        }
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createManualTaskTemplate(templateData);
        let caseData = {
            "Requester": "qtao",
            "Company": "Petramco",
            "Summary": "Create case for me postman1",
            "Assigned Company": "Petramco",
            "Business Unit": "United States Support",
            "Support Group": "US Support 3",
            "Assignee": "qkatawazi"
        }
        let newCase = await apiHelper.createCase(caseData);
        let displayId: string = newCase.displayId;
        await navigationPage.gotoCaseConsole();
        await utilityGrid.searchAndOpenHyperlink(displayId);
        await activityTabPo.addActivityNote('This is case notes templates');
        await activityTabPo.clickOnPostButton();
        await expect(activityTabPo.getActivityReplyNotesText('Reply')).toBeFalsy();
        await expect(activityTabPo.getActivityReplyAllNotesText('Reply all')).toBeFalsy();
        await viewCasePo.clickAddTaskButton();
        await manageTaskBladePo.addTaskFromTaskTemplate(taskTemplateName);
        await manageTaskBladePo.clickTaskLink(manualTaskSummary);
        await activityTabPo.addActivityNote('This is case notes templates');
        await activityTabPo.clickOnPostButton();
        await expect(activityTabPo.getActivityReplyNotesText('Reply')).toBeFalsy();
        await expect(activityTabPo.getActivityReplyAllNotesText('Reply all')).toBeFalsy();
    });

    //Failed due to application issue...defect logged DRDMV-21883
    describe('[3843]: Reply / Reply All earlier email context should be copied as part of email composition on Task', async () => {
        const randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let taskTemplateName = 'Manual  task' + randomStr;
        let manualTaskSummary = 'ManualSummary' + randomStr;
        let externalTaskTemplateName = 'External  task' + randomStr;
        let ManualtaskID, displayId, externalTaskSummary = 'ExternalSummary' + randomStr;
        beforeAll(async () => {
            let templateData = {
                "templateName": `${taskTemplateName}`,
                "templateSummary": `${manualTaskSummary}`,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createManualTaskTemplate(templateData);
            let externaltemplateData = {
                "templateName": `${externalTaskTemplateName}`,
                "templateSummary": `${externalTaskSummary}`,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.createExternalTaskTemplate(externaltemplateData);
            let caseData = {
                "Requester": "qtao",
                "Company": "Petramco",
                "Summary": "Create case for me postman1",
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
            }
            await apiHelper.apiLogin('qkatawazi');
            let newCaseTemplate = await apiHelper.createCase(caseData);
            displayId = newCaseTemplate.displayId;
        });
        it('[3843]: Reply / Reply All earlier email context should be copied as part of email composition on Task', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(displayId);
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.addTaskFromTaskTemplate(manualTaskSummary);
            await manageTaskBladePo.addTaskFromTaskTemplate(externalTaskSummary);
            await manageTaskBladePo.clickTaskLink(manualTaskSummary);
            await browser.sleep(2000); // To wait until view task page gets load corrrectly.
            ManualtaskID = await viewTaskPo.getTaskID();
            await viewTaskPo.clickEmailLink();
            await composeMailPo.clickOnSelectEmailTemplateLink();
            await emailTemplateBladePo.clickOnCancelButton();
            await composeMailPo.setEmailBody('this is new email sending frist time to the user');
            await composeMailPo.setToOrCCInputTextbox('To', 'fritz.schulz@petramco.com');
            await composeMailPo.setToOrCCInputTextbox('Cc', 'qkatawazi@petramco.com');
            await composeMailPo.addAttachment(['../../data/ui/attachment/demo.txt']);
            await composeMailPo.clickOnSendButton();
        });
        it('[3843]: Reply / Reply All earlier email context should be copied as part of email composition on Task', async () => {
            expect(await activityTabPo.getEmailTitle()).toContain('Qadim Katawazi sent an email');
            expect(await activityTabPo.getRecipientInTo()).toContain('To: Fritz Schulz');
            expect(await activityTabPo.getEmailSubject()).toContain(displayId + ':' + ManualtaskID + ':' + manualTaskSummary);
            await activityTabPo.clickShowMoreLinkInActivity(1);
            expect(await activityTabPo.getEmailBody()).toContain('this is new email sending frist time to the user');
            await activityTabPo.clickOnReplyAll();
            await composeMailPo.isComposeEmailUIDisplay();
            expect(await composeMailPo.getToEmailPerson()).toContain('Fritz Schulz');
            expect(await composeMailPo.getCcEmailPerson()).toContain('Qadim Katawazi');
            expect(await composeMailPo.getEmailBody()).toContain('this is new email sending frist time to the user');
            expect(await composeMailPo.getEmailBody()).toContain('------ While replying, please do not add information below this line -----');
            await composeMailPo.setEmailBody('this is second reply to all');
            await composeMailPo.clickOnSendButton();
            await activityTabPo.clickShowMoreLinkInActivity(1);
            expect(await activityTabPo.getEmailBody()).toContain('this is second reply to all');
            await activityTabPo.clickOnReply();
            expect(await composeMailPo.getToEmailPerson()).toContain('Qadim Katawazi');
            expect(await activityTabPo.getEmailBody()).toContain('this is second reply to all');
            await composeMailPo.setEmailBody('this is third reply');
            await composeMailPo.clickOnSendButton();
            await viewTaskPo.clickOnViewCase();
        });
        it('[3843]: Reply / Reply All earlier email context should be copied as part of email composition on Task', async () => {
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickTaskLink(externalTaskSummary);
            let externaltaskID = await viewTaskPo.getTaskID();
            await viewTaskPo.clickEmailLink();
            await composeMailPo.addAttachment(['../../data/ui/attachment/demo.txt']);
            await composeMailPo.setToOrCCInputTextbox('To', 'fritz.schulz@petramco.com');
            await composeMailPo.setToOrCCInputTextbox('Cc', 'qkatawazi@petramco.com')
            await composeMailPo.setEmailBody('this is new email sending frist time to the user');
            await composeMailPo.clickOnSendButton();
            expect(await activityTabPo.getEmailTitle()).toContain('Qadim Katawazi sent an email');
            expect(await activityTabPo.getRecipientInTo()).toContain('To: Fritz Schulz');
            expect(await activityTabPo.getEmailSubject()).toContain(displayId + ':' + externaltaskID + ':' + externalTaskSummary);
            await activityTabPo.clickShowMoreLinkInActivity(1);
            expect(await activityTabPo.getEmailBody()).toContain('this is new email sending frist time to the user', "460");
            await activityTabPo.clickShowLessLinkInActivity(1);
            await activityTabPo.clickOnReplyAll();
            await composeMailPo.isComposeEmailUIDisplay();
        });
        it('[3843]: Reply / Reply All earlier email context should be copied as part of email composition on Task', async () => {
            expect(await composeMailPo.getToEmailPerson()).toContain('Fritz Schulz');
            expect(await composeMailPo.getCcEmailPerson()).toContain('Qadim Katawazi');
            expect(await composeMailPo.getEmailBody()).toContain('------ While replying, please do not add information below this line -----');
            expect(await composeMailPo.getEmailBody()).toContain('this is new email sending frist time to the user');
            await composeMailPo.setEmailBody('this is second reply to all');
            await composeMailPo.clickOnSendButton();
            await activityTabPo.clickOnRefreshButton();
            await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.getEmailBody()).toContain('this is second reply to all');
            await activityTabPo.clickOnReply();
            expect(await composeMailPo.getToEmailPerson()).toContain('Qadim Katawazi');
            expect(await composeMailPo.getEmailBody()).toContain('this is second reply to all');
            await composeMailPo.setEmailBody('this is third reply');
            await composeMailPo.clickOnSendButton();
            await activityTabPo.clickOnRefreshButton();
            await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.getEmailBody()).toContain('this is third reply', "477");
        });
    });

    it('[3842]: For Reply / Reply All earlier email context should be copied as part of email composition on Case', async () => {
        let caseData = {
            "Requester": "qtao",
            "Company": "Petramco",
            "Summary": "Create case for Email Test",
            "Assigned Company": "Petramco",
            "Business Unit": "United States Support",
            "Support Group": "US Support 3",
            "Assignee": "qkatawazi"
        }
        await apiHelper.apiLogin('qkatawazi');
        let newCaseTemplate = await apiHelper.createCase(caseData);
        let displayId: string = newCaseTemplate.displayId;
        await navigationPage.gotoCaseConsole();
        await utilityGrid.searchAndOpenHyperlink(displayId);
        await viewCasePo.clickOnEmailLink();
        await composeMailPo.clickOnSelectEmailTemplateLink();
        await emailTemplateBladePo.clickOnCancelButton();
        await composeMailPo.setToOrCCInputTextbox('To', 'fritz.schulz@petramco.com');
        await composeMailPo.setToOrCCInputTextbox('Cc', 'qkatawazi@petramco.com');
        await composeMailPo.setEmailBody('this is new email sending frist time to the user');
        await composeMailPo.addAttachment(['../../data/ui/attachment/demo.txt']);
        await composeMailPo.clickOnSendButton();
        expect(await activityTabPo.getEmailTitle()).toContain('Qadim Katawazi sent an email');
        expect(await activityTabPo.getRecipientInTo()).toContain('To: Fritz Schulz');
        expect(await activityTabPo.getEmailSubject()).toContain(displayId + ':' + 'Create case for Email Test');
        await activityTabPo.clickOnShowMore();
        expect(await activityTabPo.getEmailBody()).toContain('this is new email sending frist time to the user');
        await activityTabPo.clickOnReplyAll();
        await composeMailPo.isComposeEmailUIDisplay();
        expect(await composeMailPo.getToEmailPerson()).toContain('Fritz Schulz');
        expect(await composeMailPo.getCcEmailPerson()).toContain('Qadim Katawazi');
        expect(await composeMailPo.getEmailBody()).toContain('this is new email sending frist time to the user');
        expect(await composeMailPo.getEmailBody()).toContain('While replying, please do not add information below this line');
        await composeMailPo.setEmailBody('this is second reply to all');
        await composeMailPo.clickOnSendButton();
        await activityTabPo.clickShowMoreLinkInActivity(1);
        expect(await activityTabPo.getEmailBody()).toContain('this is second reply to all');
        await activityTabPo.clickOnReply();
        expect(await composeMailPo.getToEmailPerson()).toContain('Qadim Katawazi');
        expect(await composeMailPo.getEmailBody()).toContain('this is second reply to all');
        await composeMailPo.setEmailBody('this is third reply');
        await composeMailPo.clickOnSendButton();
    });

    describe('[3844]: In Case of Reply/Reply All if we select new Email template then previous contents should not be erased.', async () => {
        const randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let emailTemplateDataForTest1, emailTemplateDataForTest2;
        let taskTemplateName = 'Manual task19555' + randomStr;
        let manualTaskSummary = 'ManualSummary19555' + randomStr;
        let externalTaskTemplateName = 'Externaltask19555' + randomStr;
        let displayId, externalTaskSummary = 'ExternalSummary19555' + randomStr;

        beforeAll(async () => {
            let emailTemplateData = require('../../data/ui/email/email.template.api.json');
            emailTemplateDataForTest1 = await emailTemplateData['emailTemplateWithMandatoryField'];
            emailTemplateDataForTest1.TemplateName = 'TemplateWithMandatoryField' + randomStr;
            emailTemplateDataForTest2 = await emailTemplateData['emailTemplateForSalary'];
            emailTemplateDataForTest2.TemplateName = 'TemplateForSalary' + randomStr;
            let templateData = {
                "templateName": `${taskTemplateName}`,
                "templateSummary": `${manualTaskSummary}`,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }

            let externaltemplateData = {
                "templateName": `${externalTaskTemplateName}`,
                "templateSummary": `${externalTaskSummary}`,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            let caseData = {
                "Requester": "qdu",
                "Company": "Petramco",
                "Summary": "Create case for me postman19555",
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createEmailTemplate(emailTemplateDataForTest1);
            await apiHelper.createEmailTemplate(emailTemplateDataForTest2);
            await apiHelper.createManualTaskTemplate(templateData);
            await apiHelper.createExternalTaskTemplate(externaltemplateData);
            let newCaseTemplate = await apiHelper.createCase(caseData);
            displayId = newCaseTemplate.displayId;
        });
        it('[3844]: In Case of Reply/Reply All if we select new Email template then previous contents should not be erased.', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(displayId);
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.addTaskFromTaskTemplate(manualTaskSummary);
            await manageTaskBladePo.addTaskFromTaskTemplate(externalTaskSummary);
            await manageTaskBladePo.clickTaskLink(manualTaskSummary);
            await viewTaskPo.clickOnEditTask();
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'US Support 3');
            await changeAssignmentBladePo.setDropDownValue('Assignee', "Qadim Katawazi");
            await editTask.clickOnSaveButton();
            await viewTaskPo.clickOnRequesterEmail();
            await composeMailPo.clickOnSelectTempalteButton();
            await emailTemplateBladePo.searchAndSelectEmailTemplate(emailTemplateDataForTest1.TemplateName);
            await emailTemplateBladePo.clickOnApplyButton();
            await composeMailPo.clickOnSendButton();
        });
        it('[3844]: In Case of Reply/Reply All if we select new Email template then previous contents should not be erased.', async () => {
            expect(await activityTabPo.getEmailTitle()).toContain('Qadim Katawazi sent an email');
            expect(await activityTabPo.getRecipientInTo()).toContain('To: Qiang Du');
            await activityTabPo.clickOnReply();
            expect(await composeMailPo.getToEmailPerson()).toContain("Qadim Katawazi");
            expect(await composeMailPo.getEmailBody()).toContain('Hi Team ,\n\nI am taking leave today.\n\nThanks.');
            await composeMailPo.clickOnSelectTempalteButton();
            await emailTemplateBladePo.searchAndSelectEmailTemplate(emailTemplateDataForTest2.TemplateName);
            await emailTemplateBladePo.clickOnApplyButton();
            expect(await composeMailPo.getEmailBody()).toContain('Hi Team ,\n\nI am taking leave today.\n\nThanks.');
            await composeMailPo.clickOnSendButton();
            await viewTaskPo.clickOnViewCase();
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickTaskLink(externalTaskSummary);
            await viewTaskPo.clickOnEditTask();
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'US Support 3');
            await changeAssignmentBladePo.setDropDownValue('Assignee', 'Qadim Katawazi');
            await editTask.clickOnSaveButton();
        });
        it('[3844]: In Case of Reply/Reply All if we select new Email template then previous contents should not be erased.', async () => {
            await viewTaskPo.clickOnRequesterEmail();
            await composeMailPo.setToOrCCInputTextbox('To', 'fritz.schulz@petramco.com');
            await composeMailPo.clickOnSelectTempalteButton();
            await emailTemplateBladePo.searchAndSelectEmailTemplate(emailTemplateDataForTest1.TemplateName);
            await emailTemplateBladePo.clickOnApplyButton();
            await composeMailPo.clickOnSendButton();
            await browser.sleep(2000); // After sent email wait until email log gets displayed on actvity.
            await activityTabPo.clickOnReply();
            expect(await composeMailPo.getToEmailPerson()).toContain('Qadim Katawazi');
            expect(await composeMailPo.getEmailBody()).toContain('Hi Team ,\n\nI am taking leave today.\n\nThanks.');
            await composeMailPo.clickOnSelectTempalteButton();
            await emailTemplateBladePo.searchAndSelectEmailTemplate(emailTemplateDataForTest2.TemplateName);
            await emailTemplateBladePo.clickOnApplyButton();
            expect(await composeMailPo.getEmailBody()).toContain('Hi Team ,\n\nI am taking leave today.\n\nThanks.');
            await composeMailPo.clickOnSendButton();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            //workaround for email template issue
            await composeMailPo.clickOnDiscardButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });

    });

    it('[3845]: Verify task acknowledgement template are listed in Email Acknowledgement template and In Email Configuration', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Email--Acknowledgment Templates', BWF_PAGE_TITLES.EMAIL.ACKNOWLEDGMENT_TEMPLATES);
        await utilityGrid.searchAndOpenHyperlink('Task Update Ack Template');
        expect(await editAcknowledgmentTemplatePo.getCompanyName()).toContain('- Global -');
        expect(await editAcknowledgmentTemplatePo.getModuleName()).toContain('Tasks');
        expect(await editAcknowledgmentTemplatePo.getStatusValue()).toContain('Active');
        expect(await editAcknowledgmentTemplatePo.getTemplateName()).toContain('Task Update Ack Template');
        expect(await editAcknowledgmentTemplatePo.getDescription()).toContain('Task Update Acknowledgement Template when task got updated via email');
        expect(await editAcknowledgmentTemplatePo.getBodyMessageValue()).toContain('<p>This is to acknowledge that the information provided by you for Task $1$ has been updated successfully.</p><p>HR Department</p>');
        expect(await editAcknowledgmentTemplatePo.getSubjectMessageValue()).toContain('Task $1$ :$450000029$ Successfully updated');
        await editAcknowledgmentTemplatePo.clickOnCancelButton();
    });

    describe('[3846]: Email Templates option driven by Task assignee permission for case', async () => {
        const randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let displayId, ManualtaskID, taskTemplateName = 'Manual  task19550' + randomStr;
        let manualTaskSummary = 'ManualSummary19550' + randomStr;
        let externalTaskTemplateName = 'External  task19550' + randomStr;
        let externalTaskSummary = 'ExternalSummary19550' + randomStr;
        beforeAll(async () => {
            let templateData = {
                "templateName": `${taskTemplateName}`,
                "templateSummary": `${manualTaskSummary}`,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }

            let externaltemplateData = {
                "templateName": `${externalTaskTemplateName}`,
                "templateSummary": `${externalTaskSummary}`,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createManualTaskTemplate(templateData);
            await apiHelper.createExternalTaskTemplate(externaltemplateData);
            let caseData = {
                "Requester": "qtao",
                "Company": "Petramco",
                "Summary": "Create case for me postman1",
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
            }
            await apiHelper.apiLogin('qkatawazi');
            let newCaseTemplate = await apiHelper.createCase(caseData);
            displayId = newCaseTemplate.displayId;
        });
        it('[3846]: Email Templates option driven by Task assignee permission for case', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(displayId);
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.addTaskFromTaskTemplate(manualTaskSummary);
            await manageTaskBladePo.addTaskFromTaskTemplate(externalTaskSummary);
            await manageTaskBladePo.clickTaskLink(manualTaskSummary);
            await viewTaskPo.clickOnEditTask();
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'CA Support 3');
            await changeAssignmentBladePo.setDropDownValue('Assignee', 'Quigley Heroux');
            await editTask.clickOnSaveButton();
            ManualtaskID = await viewTaskPo.getTaskID();
            await viewTaskPo.clickOnViewCase();
        });
        it('[3846]: Email Templates option driven by Task assignee permission for case', async () => {
            await viewCasePo.clickAddTaskButton();
            //verify activity email post
            await manageTaskBladePo.clickTaskLink(externalTaskSummary);
            await viewTaskPo.clickOnEditTask();
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'CA Support 3');
            await changeAssignmentBladePo.setDropDownValue('Assignee', 'Quigley Heroux');
            await editTask.clickOnSaveButton();
            await viewTaskPo.clickOnRequesterEmail();
            expect(await composeMailPo.isSelectEmailTemplateButtonPresent()).toBeTruthy('Email template link not present');
            await composeMailPo.clickOnDiscardButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });
        it('[3846]: Email Templates option driven by Task assignee permission for case', async () => {
            await navigationPage.signOut();
            await loginPage.login('qheroux');
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(ManualtaskID);
            await viewTaskPo.clickOnRequesterEmail();
            await browser.sleep(2000); // Wait until Email Pop up gets display.
            expect(await composeMailPo.isSelectEmailTemplateButtonPresent()).toBeFalsy("Email template button visible to task assignee having no case access");
            await composeMailPo.clickOnDiscardButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });
    });
});
