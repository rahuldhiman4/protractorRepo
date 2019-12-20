import { browser } from "protractor";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import emailPo from '../../pageobject/email/email.po';
import utilCommon from '../../utils/util.common';
import apiHelper from '../../api/api.helper';
import utilGrid from '../../utils/util.grid';
import activityTabPo from '../../pageobject/social/activity-tab.po';
import viewCasePage from "../../pageobject/case/view-case.po";
import viewTask from "../../pageobject/task/view-task.po";
import editTask from "../../pageobject/task/edit-task.po";
import manageTaskBladePo from '../../pageobject/task/manage-task-blade.po';

describe('Email', () => {
    beforeAll(async () => {
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
        loginPage.login("elizabeth");
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    it('DRDMV-19011: Automated task should not have email options but other type of task should have email option	',async ()=>{

        try {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            let taskTemplateName = 'Manual  task' + [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let manualTaskSummary = 'Summary' + [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            var templateData = {
                "templateName": `${taskTemplateName}`,
                "templateSummary": `${manualTaskSummary}`,
                "templateStatus": "Active",
            }
            await apiHelper.apiLogin('fritz');
            var manualTaskTemplate = await apiHelper.createManualTaskTemplate(templateData);

            let externalTaskTemplateName = 'External  task' + [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let externalTaskSummary = 'Summary' + [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            var externaltemplateData = {
                "templateName": `${externalTaskTemplateName}`,
                "templateSummary": `${externalTaskSummary}`,
                "templateStatus": "Active",
            }
            var externalTaskTemplate = await apiHelper.createExternalTaskTemplate(externaltemplateData);
            let automatedTaskTemplateName = 'Automated  task' + [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let automatedTaskSummary = 'Summary' + [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            var automatedtemplateData = {
                "templateName": `${automatedTaskTemplateName}`,
                "templateSummary": `${automatedTaskSummary}`,
                "templateStatus": "Active",
                "processBundle": "com.bmc.arsys.rx.approval",
                "processName": "Approval Process 1",
            }
            var autoTaskTemplate = await apiHelper.createAutomatedTaskTemplate(automatedtemplateData);
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
            await expect(emailPo.isEmailIconLinkPresent()).toBeFalsy();
            await browser.sleep(3000);
            await viewTask.clickOnViewCase();
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.clickTaskLinkOnManageTask(taskTemplateName);
            await expect(emailPo.isEmailIconLinkPresent()).toBeTruthy();
            let ManualtaskID =await viewTask.getTaskID();
            await emailPo.clickOnEmailIconLink();
            expect(await emailPo.getSubject()).toContain(displayId+':'+ManualtaskID);
            await emailPo.setEmailBody('This is new email from task');
            await expect(await emailPo.getEmailBody()).toContain('Regards');
            console.log('nee 1')
            await expect(await emailPo.getEmailBody()).toContain('Fritz Schulz');
            console.log('nee 2')
            await expect(await emailPo.getEmailBody()).toContain('fritz.schulz@petramco.com');
            console.log('nee 3')
            await emailPo.addAttachment();
            await emailPo.setToOrCCInputTetxboxPresent('To','fritz.schulz@petramco.com')
            await browser.sleep(3000);
            await emailPo.clickOnSendButton();
            await browser.sleep(2000);

        } catch (e) {
            console.log(e);
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        }


    },1200*1000)
    
    })
