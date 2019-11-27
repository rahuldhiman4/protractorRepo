import { browser, ProtractorExpectedConditions, protractor } from "protractor";
import loginPage from "../../pageobject/login.po";
import navigationPage from "../../pageobject/navigation.po";
import activityTabPage from '../../pageobject/activity-tab.po';
import createCase from '../../pageobject/case/create-case.po';
import viewCasePo from '../../pageobject/case/view-case.po';
import manageTaskBladePo from '../../pageobject/task/manage-task-blade.po';
import viewTaskPo from '../../pageobject/task/view-task.po';
import createKnowlegePo from '../../pageobject/knowledge/create-knowlege.po';
import utilCommon from '../../utils/ui/util.common';

describe('case activity', () => {
    beforeAll(async () => {
        await browser.get(`${browser.baseUrl}/innovationsuite/index.html#/com.bmc.dsm.bwfa`);
        await browser.waitForAngularEnabled(false);
        await loginPage.login('qkatawazi');
    });

    beforeEach(async () => {
        await browser.get(`${browser.baseUrl}/innovationsuite/index.html#/com.bmc.dsm.bwfa`);
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    it('DRDMV-18048: While adding a note on Case one or more agent can be tagged in Comment', async () => {
        await navigationPage.gotCreateCase();
        await createCase.selectRequester('Al Allbrook');
        await createCase.selectContact('Angelina Jolie');
        await createCase.setSummary('test case for DRDMV-18048');
        await createCase.clickSaveCaseButton();
        await createCase.clickGoToCaseButton();
        var personPopupCount: number = await activityTabPage.getPersonCount('Hi hello @Allen');
        await expect(personPopupCount).toBeGreaterThan(3);
        await activityTabPage.clearActivityNote();
        await activityTabPage.addPersonInActivityNote('Angelina');//FirstName
        await activityTabPage.addPersonInActivityNote('Steyn');//LastName
        await activityTabPage.addPersonInActivityNote('aborder@petramco.com');//Email
        await activityTabPage.addPersonInActivityNote('qtao');//Login ID
        await activityTabPage.clickOnPostButton();
        var firstName: boolean = await activityTabPage.isLinkedTextPresentInBodyOfFirstActivity('Angelina Jolie');
        await expect(firstName).toBeTruthy("FirstName user is not present");
        var lastName: boolean = await activityTabPage.isLinkedTextPresentInBodyOfFirstActivity('Dale Steyn');
        await expect(lastName).toBeTruthy("LastName user is not present");
        var emailId: boolean = await activityTabPage.isLinkedTextPresentInBodyOfFirstActivity('Allen Border');
        await expect(emailId).toBeTruthy("EmailID user is not present");
        var loginId: boolean = await activityTabPage.isLinkedTextPresentInBodyOfFirstActivity('Qianru Tao');
        await expect(loginId).toBeTruthy("LoginID user is not present");
    });

    it('DRDMV-16754: Drill Down to different screens from Activities', async () => {
        // 1st step Login
        var caseBodyText = "This is unique caseActivity text " + Math.floor(Math.random() * 1000000);
        var taskBodyText = "This is unique TaskActivity text " + Math.floor(Math.random() * 1000000);
        var knowledgeBodyText = "This is unique KnowledgeActivity text " + Math.floor(Math.random() * 1000000);
        await navigationPage.gotCreateCase();
        await createCase.selectRequester('Al Allbrook');
        await createCase.setSummary('test case for DRDMV-16754');
        await createCase.clickSaveCaseButton();
        await createCase.clickGoToCaseButton();

        // On view case page.
        // 2nd step verification From Case Activities, click on Different person names and inspect behavior
        await activityTabPage.addActivityNote(caseBodyText);
        await activityTabPage.clickOnPostButton();
        var caseIdText: string = await viewCasePo.getCaseID();
        // Redirect on person profile
        await activityTabPage.clickOnHyperlinkFromActivity(caseBodyText, 'Qadim Katawazi');
        await expect(browser.getTitle()).toBe('Person Profile - Business Workflows');
        await activityTabPage.clickOnHyperlinkFromActivity(caseBodyText, caseIdText);

        // 3nd step verification, From Case > Activity > Task related note > Click on Person name
        await viewCasePo.clickAddTaskButton();
        await viewCasePo.addTaskFromTaskTemplate('File Report');
        await manageTaskBladePo.clickTaskLinkOnManageTask('File Report');

        // View task page
        await expect(browser.getTitle()).toBe('Task Edit - Business Workflows');
        console.log('this is view task title', browser.getTitle());
        await activityTabPage.addActivityNote(taskBodyText);
        await activityTabPage.clickOnPostButton();
        var taskId: string = await viewTaskPo.getTaskID();
        console.log(taskId);

        // View Case Page
        await viewTaskPo.clickOnViewCase();
        await activityTabPage.clickOnHyperlinkFromActivity(taskBodyText, 'Qadim Katawazi');
        await activityTabPage.clickOnHyperlinkFromActivity(caseBodyText, caseIdText);

        // 4th step From Case > Activity > Click on Task ID from Task comment
        await activityTabPage.clickOnHyperlinkFromActivity(taskBodyText, taskId);

        // 5th step verification Open Task > Click on Person Name from Activity
        await activityTabPage.clickOnHyperlinkFromActivity(taskBodyText, 'Qadim Katawazi');

        // 6th step verification
        // Open KA > Click on Person Name from Activity, On Crate Knowlege Page
        await navigationPage.gotoKnowledge();
        await expect(browser.getTitle()).toBe('Knowledge Article Templates Preview - Business Workflows');
        await createKnowlegePo.clickOnTemplate('Reference');
        await createKnowlegePo.clickOnUseSelectedTemplateButton('Use selected Template');
        await createKnowlegePo.addTextInKnowlegeTitleField('test case for DRDMV-16754');
        await createKnowlegePo.selectKnowledgeSet('HR');
        await createKnowlegePo.clickOnUseSaveKnowledgeButton();
        await createKnowlegePo.clickOnviewArticleLinkButton();

        // View Knowledege Page
        await utilCommon.switchToNewWidnow();
        await createKnowlegePo.clickOnActivityTab();
        await activityTabPage.addActivityNote(knowledgeBodyText);
        await activityTabPage.clickOnPostButton();
        await activityTabPage.clickOnHyperlinkFromActivity(knowledgeBodyText, 'Qadim Katawazi');
    }, 120 * 1000);
})
