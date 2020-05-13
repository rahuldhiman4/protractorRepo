import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import { ITaskTemplate } from '../../data/api/interface/task.template.interface.api';
import caseConsolePo from '../../pageobject/case/case-console.po';
import viewCasePo from '../../pageobject/case/view-case.po';
import linkPropertiesPo from '../../pageobject/common/ck-editor/link-properties.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import createKnowlegePo from '../../pageobject/knowledge/create-knowlege.po';
import editKnowledgePo from '../../pageobject/knowledge/edit-knowledge.po';
import previewKnowledgePo from '../../pageobject/knowledge/preview-knowledge.po';
import viewKnowledgeArticlePo from '../../pageobject/knowledge/view-knowledge-article.po';
import { default as activityTabPage } from '../../pageobject/social/activity-tab.po';
import manageTaskBladePo from '../../pageobject/task/manage-task-blade.po';
import viewTaskPo from '../../pageobject/task/view-task.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import caseAccessTabPo from '../../pageobject/common/case-access-tab.po';
import createCasePo from '../../pageobject/case/create-case.po';
import casePreviewPo from '../../pageobject/case/case-preview.po';
import changeAssignmentBladePo from '../../pageobject/common/change-assignment-blade.po';
describe('Case Activity', () => {

    const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    afterEach(async () => {
        await utilityCommon.refresh();
    });



    //kgaikwad
    it('[DRDMV-21617]:Verify the Availability and UI of new CK Editor', async () => {
        try {
            let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let addNoteBodyText = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');

            // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            // Create manual task template
            let manualTemplateData = {
                "templateName": "DRDMV-21617_task template" + summary,
                "templateSummary": "DRDMV-21617_Manual_task template summary" + summary,
                "templateStatus": "Active",
                "company": '- Global -'
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createManualTaskTemplate(manualTemplateData);

            // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            // Create automated task template
            let autoTemplateData = {
                "templateName": "DRDMV-21617 auto task template" + summary,
                "templateSummary": "DRDMV-21617 auto task template summary" + summary,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": `Case Process ${summary}`,
            }

            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createAutomatedTaskTemplate(autoTemplateData);


            // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            // For External
            let externalTemplateData: ITaskTemplate = {
                "templateName": "DRDMV-21617 external task template name" + summary,
                "templateSummary": "DRDMV-21617 external task template summary" + summary,
                "templateStatus": "Active",
            };

            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createExternalTaskTemplate(externalTemplateData);
            // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            // Create Case
            let caseData = {
                "Requester": "qtao",
                "Summary": "DRDMV-21617_TCasfd",
                "Support Group": "Compensation and Benefits",
                "Assignee": "qdu"
            }

            await apiHelper.apiLogin('qkatawazi');
            let newCase = await apiHelper.createCase(caseData);
            console.log('>>>>>>>>>>>',newCase.displayId);
            await caseConsolePo.searchAndOpenCase(newCase.displayId);

            // Adding Task
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.addTaskFromTaskTemplate(manualTemplateData.templateSummary);
            await manageTaskBladePo.addTaskFromTaskTemplate(autoTemplateData.templateSummary);
            await manageTaskBladePo.addTaskFromTaskTemplate(externalTemplateData.templateSummary);
            await manageTaskBladePo.clickOnCloseButton();

            await activityTabPage.addActivityNote(addNoteBodyText);
            //bold
            await activityTabPage.clickOnBoldIcon();
            //italic
            await activityTabPage.clickOnItalicIcon();
            //underline
            await activityTabPage.clickOnUnderLineIcon();
            //left Align
            await activityTabPage.clickOnLeftAlignIcon();
            //Right Align
            await activityTabPage.clickOnRightAlignIcon();
            //Center Align
            await activityTabPage.clickOnCenterAlignIcon();
            //set color
            await activityTabPage.selectColor('Strong Red');
            //checking number and bullot points and setting values for them
            await activityTabPage.setInsertRemoveNumberList('PlusOne');
            await activityTabPage.setInsertRemoveNumberList('PlusTwo');
            await activityTabPage.setInsertRemoveNumberList('PlusThree');

            // checking bullot points
            await activityTabPage.clearActivityNote();
            await activityTabPage.setInsertRemoveBulletedList('BulletOne');
            await activityTabPage.setInsertRemoveBulletedList('BulletTwo');
            await activityTabPage.setInsertRemoveBulletedList('BulletThree');

            // Link added
            await activityTabPage.clearActivityNote();
            await activityTabPage.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('Google', 0);
            await linkPropertiesPo.setValueOfLinkProperties('www.google.com', 1);
            await linkPropertiesPo.clickOnOkBtn();
            await activityTabPage.clickOnPostButton();

            await activityTabPage.addActivityNote(addNoteBodyText);
            await activityTabPage.clickMaximizeMinimizeIcon();
            await activityTabPage.clickMaximizeMinimizeIcon();
            await activityTabPage.clickPublicCheckbox();
            expect(await activityTabPage.isPublicCheckBoxToolTipIconDisplayed()).toBeTruthy('Public checkbox tool tip missing');
            await activityTabPage.clickOnCancelButton();

        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        // Profile View CK Editor
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await caseConsolePo.searchAndOpenCase(newCase.displayId);
            await activityTabPage.clickOnRefreshButton();
            await activityTabPage.clickOnHyperlinkFromActivity(2, 'Qadim Katawazi');

            await activityTabPage.addActivityNote(addNoteBodyText);
            //bold
            await activityTabPage.clickOnBoldIcon();
            //italic
            await activityTabPage.clickOnItalicIcon();
            //underline
            await activityTabPage.clickOnUnderLineIcon();
            //left Align
            await activityTabPage.clickOnLeftAlignIcon();
            //Right Align
            await activityTabPage.clickOnRightAlignIcon();
            //Center Align
            await activityTabPage.clickOnCenterAlignIcon();
            //set color
            await activityTabPage.selectColor('Strong Red');
            //checking number and bullot points and setting values for them
            await activityTabPage.setInsertRemoveNumberList('PlusOne');
            await activityTabPage.setInsertRemoveNumberList('PlusTwo');
            await activityTabPage.setInsertRemoveNumberList('PlusThree');

            // checking bullot points
            await activityTabPage.clearActivityNote();
            await activityTabPage.setInsertRemoveBulletedList('BulletOne');
            await activityTabPage.setInsertRemoveBulletedList('BulletTwo');
            await activityTabPage.setInsertRemoveBulletedList('BulletThree');

            // Link added
            await activityTabPage.clearActivityNote();
            await activityTabPage.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('Google', 0);
            await linkPropertiesPo.setValueOfLinkProperties('www.google.com', 1);
            await linkPropertiesPo.clickOnOkBtn();
            await activityTabPage.clickOnPostButton();

            await activityTabPage.addActivityNote(addNoteBodyText);
            await activityTabPage.clickMaximizeMinimizeIcon();
            await activityTabPage.clickMaximizeMinimizeIcon();
            await activityTabPage.clickOnCancelButton();

        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            // Goto Manual Task
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(newCase.displayId);
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickTaskLinkOnManageTask(manualTemplateData.templateSummary);
            await activityTabPage.addActivityNote(addNoteBodyText);
            //bold
            await activityTabPage.clickOnBoldIcon();
            //italic
            await activityTabPage.clickOnItalicIcon();
            //underline
            await activityTabPage.clickOnUnderLineIcon();
            //left Align
            await activityTabPage.clickOnLeftAlignIcon();
            //Right Align
            await activityTabPage.clickOnRightAlignIcon();
            //Center Align
            await activityTabPage.clickOnCenterAlignIcon();
            //set color
            await activityTabPage.selectColor('Strong Red');
            //checking number and bullot points and setting values for them
            await activityTabPage.setInsertRemoveNumberList('PlusOne');
            await activityTabPage.setInsertRemoveNumberList('PlusTwo');
            await activityTabPage.setInsertRemoveNumberList('PlusThree');
            // checking bullot points
            await activityTabPage.clearActivityNote();
            await activityTabPage.setInsertRemoveBulletedList('BulletOne');
            await activityTabPage.setInsertRemoveBulletedList('BulletTwo');
            await activityTabPage.setInsertRemoveBulletedList('BulletThree');
            // Link added
            await activityTabPage.clearActivityNote();
            await activityTabPage.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('Google', 0);
            await linkPropertiesPo.setValueOfLinkProperties('www.google.com', 1);
            await linkPropertiesPo.clickOnOkBtn();
            await activityTabPage.clickOnPostButton();

            await activityTabPage.addActivityNote(addNoteBodyText);
            await activityTabPage.clickMaximizeMinimizeIcon();
            await activityTabPage.clickMaximizeMinimizeIcon();
            await activityTabPage.clickPublicCheckbox();
            expect(await activityTabPage.isPublicCheckBoxToolTipIconDisplayed()).toBeTruthy('Public checkbox tool tip missing');
            await activityTabPage.clickOnCancelButton();
            await viewTaskPo.clickOnViewCase();
           
        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            // Goto Auto Task
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickTaskLinkOnManageTask(autoTemplateData.templateSummary);
            await browser.sleep(10000);
            await activityTabPage.addActivityNote(addNoteBodyText);
            //bold
            await activityTabPage.clickOnBoldIcon();
            //italic
            await activityTabPage.clickOnItalicIcon();
            //underline
            await activityTabPage.clickOnUnderLineIcon();
            //left Align
            await activityTabPage.clickOnLeftAlignIcon();
            //Right Align
            await activityTabPage.clickOnRightAlignIcon();
            //Center Align
            await activityTabPage.clickOnCenterAlignIcon();
            //set color
            await activityTabPage.selectColor('Strong Red');
            //checking number and bullot points and setting values for them
            await activityTabPage.setInsertRemoveNumberList('PlusOne');
            await activityTabPage.setInsertRemoveNumberList('PlusTwo');
            await activityTabPage.setInsertRemoveNumberList('PlusThree');
            // checking bullot points
            await activityTabPage.clearActivityNote();
            await activityTabPage.setInsertRemoveBulletedList('BulletOne');
            await activityTabPage.setInsertRemoveBulletedList('BulletTwo');
            await activityTabPage.setInsertRemoveBulletedList('BulletThree');
            // Link added
            await activityTabPage.clearActivityNote();
            await activityTabPage.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('Google', 0);
            await linkPropertiesPo.setValueOfLinkProperties('www.google.com', 1);
            await linkPropertiesPo.clickOnOkBtn();
            await activityTabPage.clickOnPostButton();

            await activityTabPage.addActivityNote(addNoteBodyText);
            await activityTabPage.clickMaximizeMinimizeIcon();
            await activityTabPage.clickMaximizeMinimizeIcon();
            await activityTabPage.clickPublicCheckbox();
            expect(await activityTabPage.isPublicCheckBoxToolTipIconDisplayed()).toBeTruthy('Public checkbox tool tip missing');
            await activityTabPage.clickOnCancelButton();
            await viewTaskPo.clickOnViewCase();

            // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            // Goto External Task
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickTaskLinkOnManageTask(externalTemplateData.templateSummary);
            await activityTabPage.addActivityNote(addNoteBodyText);
            //bold
            await activityTabPage.clickOnBoldIcon();
            //italic
            await activityTabPage.clickOnItalicIcon();
            //underline
            await activityTabPage.clickOnUnderLineIcon();
            //left Align
            await activityTabPage.clickOnLeftAlignIcon();
            //Right Align
            await activityTabPage.clickOnRightAlignIcon();
            //Center Align
            await activityTabPage.clickOnCenterAlignIcon();
            //set color
            await activityTabPage.selectColor('Strong Red');
            //checking number and bullot points and setting values for them
            await activityTabPage.setInsertRemoveNumberList('PlusOne');
            await activityTabPage.setInsertRemoveNumberList('PlusTwo');
            await activityTabPage.setInsertRemoveNumberList('PlusThree');
            // checking bullot points
            await activityTabPage.clearActivityNote();
            await activityTabPage.setInsertRemoveBulletedList('BulletOne');
            await activityTabPage.setInsertRemoveBulletedList('BulletTwo');
            await activityTabPage.setInsertRemoveBulletedList('BulletThree');
            // Link added
            await activityTabPage.clearActivityNote();
            await activityTabPage.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('Google', 0);
            await linkPropertiesPo.setValueOfLinkProperties('www.google.com', 1);
            await linkPropertiesPo.clickOnOkBtn();
            await activityTabPage.clickOnPostButton();

            await activityTabPage.addActivityNote(addNoteBodyText);
            await activityTabPage.clickMaximizeMinimizeIcon();
            await activityTabPage.clickMaximizeMinimizeIcon();
            await activityTabPage.clickPublicCheckbox();
            expect(await activityTabPage.isPublicCheckBoxToolTipIconDisplayed()).toBeTruthy('Public checkbox tool tip missing');
            await activityTabPage.clickOnCancelButton();

            // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            // Create knowledge Article task template
            await navigationPage.gotoCreateKnowledge();
            await expect(browser.getTitle()).toBe('Knowledge Article Templates Preview - Business Workflows'), 'Knowledge Article title is missing';
            await createKnowlegePo.clickOnTemplate('Reference');
            await createKnowlegePo.clickOnUseSelectedTemplateButton();
            await createKnowlegePo.addTextInKnowlegeTitleField('test case for DRDMV-16767');
            await createKnowlegePo.selectKnowledgeSet('HR');
            await createKnowlegePo.clickOnSaveKnowledgeButton();
            await previewKnowledgePo.clickOnViewArticleLink();
            await utilityCommon.switchToNewTab(1);
            expect(await viewKnowledgeArticlePo.isEditLinkDisplayedOnKA()).toBeTruthy('KA Edit link is missing')
            await editKnowledgePo.setKnowledgeStatus('Draft');
            await editKnowledgePo.setKnowledgeStatusWithoutSave('Publish Approval');
            await editKnowledgePo.clickAssignToMeReviewerBlade();
            await editKnowledgePo.clickSaveStatusBtn();
            await utilityCommon.waitUntilPopUpDisappear();

            await viewKnowledgeArticlePo.clickOnActivityTab();
            await activityTabPage.addActivityNote(addNoteBodyText);
            //bold
            await activityTabPage.clickOnBoldIcon();
            //italic
            await activityTabPage.clickOnItalicIcon();
            //underline
            await activityTabPage.clickOnUnderLineIcon();
            //left Align
            await activityTabPage.clickOnLeftAlignIcon();
            //Right Align
            await activityTabPage.clickOnRightAlignIcon();
            //Center Align
            await activityTabPage.clickOnCenterAlignIcon();
            //set color
            await activityTabPage.selectColor('Strong Red');
            //checking number and bullot points and setting values for them
            await activityTabPage.setInsertRemoveNumberList('PlusOne');
            await activityTabPage.setInsertRemoveNumberList('PlusTwo');
            await activityTabPage.setInsertRemoveNumberList('PlusThree');

            // checking bullot points
            await activityTabPage.clearActivityNote();
            await activityTabPage.setInsertRemoveBulletedList('BulletOne');
            await activityTabPage.setInsertRemoveBulletedList('BulletTwo');
            await activityTabPage.setInsertRemoveBulletedList('BulletThree');

            // Link added
            await activityTabPage.clearActivityNote();
            await activityTabPage.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('Google', 0);
            await linkPropertiesPo.setValueOfLinkProperties('www.google.com', 1);
            await linkPropertiesPo.clickOnOkBtn();
            await activityTabPage.clickOnPostButton();

            await activityTabPage.addActivityNote(addNoteBodyText);
            await activityTabPage.clickMaximizeMinimizeIcon();
            await activityTabPage.clickMaximizeMinimizeIcon();
            await activityTabPage.clickOnCancelButton();
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
        }, 900 * 1000);




})
