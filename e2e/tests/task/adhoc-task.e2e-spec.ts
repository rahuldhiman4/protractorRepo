import { browser } from "protractor";
import activitytab from "../../pageobject/activity-tab.po";
import createCasePage from '../../pageobject/case/create-case.po';
import { default as viewCasePage, default as viewCasePo } from "../../pageobject/case/view-case.po";
import loginPage from "../../pageobject/login.po";
import navigationPage from "../../pageobject/navigation.po";
import adhoctaskTemplate from "../../pageobject/task/create-adhoc-task.po";
import manageTask from "../../pageobject/task/manage-task-blade.po";
import viewTask from "../../pageobject/task/view-task.po";

describe('create Task template', () => {
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
        console.log(viewTask.getTaskTypeValue() + ": task type");
        await expect(viewTask.isProcessNameValue()).toBeTruthy();
    });

    it('DRDMV-1580: Adhoc Task details view (UI verification))', async () => {
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
        await adhoctaskTemplate.clickOnSaveAdhoctask();

        await manageTask.clickTaskLinkOnManageTask(summary);
        await expect(viewTask.isCaseSummaryDisplayed()).toBeTruthy();
        await expect(viewTask.isRequesterNameDisplayed()).toBeTruthy();
        await expect(viewTask.isRequesterContactDisplayed()).toBeTruthy();
        await expect(viewTask.isRequesterMailDisplayed()).toBeTruthy();
        await expect(viewTask.isEditLinkDisplayed()).toBeTruthy();
        await expect(viewTask.isViewCaseLinkDisplayed()).toBeTruthy();
        await expect(viewTask.isCaseIdDisplayed()).toBeTruthy();
        await viewTask.clickOnViewCase();
        await expect(viewCasePo.getCaseSummary()).toBe('Summary ' + summary);
    });
});
