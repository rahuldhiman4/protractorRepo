import { browser } from "protractor";
import createCasePage from '../../pageobject/case/create-case.po';
import { default as viewCasePage, default as viewCasePo } from "../../pageobject/case/view-case.po";
import changeAssignmentBlade from '../../pageobject/common/change-assignment-blade.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import activitytab from "../../pageobject/social/activity-tab.po";
import taskConsole from "../../pageobject/task/console-task.po";
import selectTaskTemplate from "../../pageobject/settings/task-management/console-tasktemplate.po";
import adhoctaskTemplate from "../../pageobject/task/create-adhoc-task.po";
import taskTemplate from "../../pageobject/settings/task-management/create-tasktemplate.po";
import { default as manageTask, default as manageTaskBladePo } from "../../pageobject/task/manage-task-blade.po";
import viewTask from "../../pageobject/task/view-task.po";
import utilCommon from '../../utils/util.common';

describe('Create Adhoc task', () => {
    beforeAll(async () => {
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
        await loginPage.login('qtao');
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    it('DRDMV-3820, DRDMV-1239: Adhoc Task Create view (UI verification)', async () => {
        let summary = 'Adhoc task' + Math.floor(Math.random() * 1000000);
        //Create Case
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();

        //Adhoc task validation
        await viewCasePage.clickAddTaskButton();
        await manageTask.clickAddAdhocTaskButton();
        await expect(await adhoctaskTemplate.getTaskSummaryRequiredText('required')).toBeTruthy();
        await expect(await adhoctaskTemplate.getPriorityRequiredText('required')).toBeTruthy();
        // await expect(await adhoctaskTemplate.getAssignedCompanyRequiredText('required')).toBeTruthy();
        // await expect(await adhoctaskTemplate.getAssignedGroupRequiredText('required')).toBeTruthy();

        await expect(await adhoctaskTemplate.getSaveButtonAttribute('ng-disabled')).toBeTruthy();
        await expect(adhoctaskTemplate.getStatusAttribute()).toBeTruthy();
        await expect(adhoctaskTemplate.getAssignCompanyAttribute()).toBeTruthy();
        await expect(adhoctaskTemplate.getBuisnessUnitAttribute()).toBeTruthy();
        await expect(adhoctaskTemplate.getAssigneeAttribute()).toBeTruthy();
        await expect(adhoctaskTemplate.getDepartmentAttribute()).toBeTruthy();
        await expect(adhoctaskTemplate.getAssignedGroupAttribute()).toBeTruthy();
        await expect(adhoctaskTemplate.getchangeAssignmentButtonText()).toBeTruthy();
        await expect(adhoctaskTemplate.isAssignToMeButtonDisplayd()).toBeTruthy();
        await expect(adhoctaskTemplate.ischangeAssignmentButtonDisplayed()).toBeTruthy();
        await adhoctaskTemplate.setSummary(summary);
        await adhoctaskTemplate.setDescription("Description");
        await adhoctaskTemplate.selectPriority('High');
        await adhoctaskTemplate.selectCategoryTier1('Applications');
        await adhoctaskTemplate.selectCategoryTier2('Social');
        await adhoctaskTemplate.selectCategoryTier3('Chatter');
        await adhoctaskTemplate.clickOnSaveAdhoctask();
        await expect(manageTask.isTaskLinkOnManageTask(summary)).toBeTruthy();
    });

    it('DRDMV-3821: Adhoc Task details view (UI verification))', async () => {
        let summary = 'Adhoc task' + Math.floor(Math.random() * 1000000);
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();

        //Adhoc task validation
        await viewCasePage.clickAddTaskButton();
        await manageTask.clickAddAdhocTaskButton();
        await adhoctaskTemplate.setSummary(summary);
        await adhoctaskTemplate.setDescription("Description");
        await adhoctaskTemplate.selectPriority('High');
        await adhoctaskTemplate.selectCategoryTier1('Applications');
        await adhoctaskTemplate.selectCategoryTier2('Social');
        await adhoctaskTemplate.selectCategoryTier3('Chatter');
        //await adhoctaskTemplate.selectLabel('test');
        await adhoctaskTemplate.clickOnSaveAdhoctask();

        await manageTask.clickTaskLinkOnManageTask(summary);
        await expect(viewTask.isTaskSummaryDisplayed()).toBeTruthy();
        await expect(viewTask.isTaskIdTextDisplayed).toBeTruthy();
        await expect(viewTask.isTaskIconDisplayed).toBeTruthy();
        await expect(viewTask.isTaskPriorityDisplayed()).toBeTruthy();
        await expect(viewTask.isTaskTimeDetailsDisplayed()).toBeTruthy();
        await expect(viewTask.isCaseSummaryDisplayed()).toBeTruthy();
        await expect(viewTask.isRequesterNameDisplayed()).toBeTruthy();
        await expect(viewTask.isRequesterContactDisplayed()).toBeTruthy();
        await expect(viewTask.isRequesterMailDisplayed()).toBeTruthy();
        await expect(viewTask.isEditLinkDisplayed()).toBeTruthy();
        await expect(viewTask.isCategoryTier1ValueDisplayed()).toBeTruthy();
        await expect(viewTask.isCategoryTier2ValueDisplayed()).toBeTruthy();
        await expect(viewTask.isCategoryTier3ValueDisplayed()).toBeTruthy();
        await expect(viewTask.isAssigneeNameDisplayed()).toBeTruthy();
        await expect(viewTask.isAssignCompanyDisplayed()).toBeTruthy();
        await expect(viewTask.isAssignGroupTextDisplayed()).toBeTruthy();
        await expect(activitytab.isActivityTextPresent()).toBeTruthy();
        await expect(activitytab.isActivityTextPresent()).toBeTruthy();
    });


    it('DRDMV-7130: [Automatic Task] - Create Ad hoc Task', async () => {
        let summary = 'Adhoc task' + Math.floor(Math.random() * 1000000);
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();

        //Adhoc task validation
        await viewCasePage.clickAddTaskButton();
        await manageTask.clickAddAdhocTaskButton();
        await adhoctaskTemplate.setSummary(summary);
        await expect(adhoctaskTemplate.isProcessFieldPresent()).toBeFalsy();
        await adhoctaskTemplate.setDescription("Description")
        await adhoctaskTemplate.clickOnSaveAdhoctask();

        await manageTask.clickTaskLinkOnManageTask(summary);
        await expect(viewTask.getTaskTypeValue()).toBe('Manual');
        await expect(viewTask.isProcessNameValue()).toBeTruthy();
    });

    it('DRDMV-1580, DRDMV-12243: Adhoc Task details view (UI verification))', async () => {
        let summary = 'Adhoc task' + Math.floor(Math.random() * 1000000);
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + summary);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();

        //Adhoc task validation
        await viewCasePage.clickAddTaskButton();
        await manageTask.clickAddAdhocTaskButton();
        await expect(adhoctaskTemplate.isAttachmentButtonDisplayed()).toBeTruthy();
        await adhoctaskTemplate.setSummary(summary);
        await adhoctaskTemplate.setDescription("Description");
        await adhoctaskTemplate.selectPriority('High');
        await adhoctaskTemplate.clickOnSaveAdhoctask();

        await manageTask.clickTaskLinkOnManageTask(summary);
        await expect(viewTask.isCaseSummaryDisplayed()).toBeTruthy("case summary is displayed ");
        await expect(viewTask.isRequesterNameDisplayed()).toBeTruthy("requester name is displayed ");
        await expect(viewTask.isRequesterContactDisplayed()).toBeTruthy("requester contact is displayed ");
        await expect(viewTask.isRequesterMailDisplayed()).toBeTruthy("requester mail is displayed ");
        await expect(viewTask.isEditLinkDisplayed()).toBeTruthy("edit link is displayed ");
        await expect(viewTask.isViewCaseLinkDisplayed()).toBeTruthy("view case link is displayed ");
        await viewTask.clickOnViewCase();
        await expect(viewCasePo.getCaseSummary()).toBe('Summary ' + summary);
    }, 120 * 1000);

    it('DRDMV-1500: [Permissions] Navigating to case from the task', async () => {

        await navigationPage.signOut();
        await loginPage.login('qkatawazi');

        //Automation Task template
        let manualTaskTemplate = 'Manual  task' + Math.floor(Math.random() * 1000000);
        let manualTaskSummary = 'Summary' + Math.floor(Math.random() * 1000000);
        //Manual task Template
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows'))
            .toEqual('Task Templates - Business Workflows');
        await selectTaskTemplate.clickOnManualTaskTemplateButton();
        await taskTemplate.setTemplateName(manualTaskTemplate);
        await taskTemplate.setTaskSummary(manualTaskSummary);
        await taskTemplate.setTaskDescription('Description in manual task');
        await taskTemplate.selectCompanyByName('Petramco');
        await taskTemplate.clickOnAssignment();
        await changeAssignmentBlade.selectCompany('Petramco');
        await changeAssignmentBlade.selectSupportGroup('Employee Relations');
        await changeAssignmentBlade.selectAssignee('Qiwei Liu');
        await changeAssignmentBlade.clickOnAssignButton();
        await browser.sleep(2000);
        await taskTemplate.selectTemplateStatus('Active');
        await taskTemplate.selectOwnerGroup('Employee Relations');
        await taskTemplate.clickOnSaveTaskTemplate();
        await utilCommon.waitUntilPopUpDisappear();

        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("adam");
        await createCasePage.setSummary('Summary ' + manualTaskSummary);
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        await viewCasePage.clickAddTaskButton();

        //Add Manual task and Automation Task in Case
        await viewCasePage.addTaskFromTaskTemplate(manualTaskTemplate);
        browser.sleep(2000);
        await manageTaskBladePo.clickOnCloseButton();
        await browser.sleep(2000);
        await viewCasePage.changeCaseStatus('In Progress');
        await viewCasePage.clickSaveStatus();


        //different user
        await navigationPage.signOut();
        await loginPage.login('qliu');
        await navigationPage.gotoTaskConsole();
        await taskConsole.setTaskSearchBoxValue(manualTaskSummary);
        await expect(taskConsole.isCaseIdLinkIsPresent()).toBeFalsy(" Case Id Displayed in Task console");
        await taskConsole.clickFirstLinkInTaskTemplateSearchGrid();
        await expect(viewTask.isCaseViewLinkDisplayed()).toBeFalsy('Case View Link is displayed');

        await navigationPage.signOut();
        await loginPage.login('qkatawazi');
        await navigationPage.gotoTaskConsole();
        await taskConsole.setTaskSearchBoxValue(manualTaskSummary);
        await expect(taskConsole.isCaseIdLinkIsPresent()).toBeTruthy('Case Id is not Displayed in Task console');
        await taskConsole.clickFirstLinkInTaskTemplateSearchGrid();
        await expect(viewTask.isCaseViewLinkDisplayed()).toBeTruthy('Case View Link is not displayed');
        await navigationPage.signOut();
        await loginPage.login('qtao');
    }, 180 * 1000);
});
