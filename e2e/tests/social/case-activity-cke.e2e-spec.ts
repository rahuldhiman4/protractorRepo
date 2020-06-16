import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import { NOTES_TEMPLATE_KNOWLEDGE_ARTICLE, NOTES_TEMPLATE_MANDATORY_FIELD, NOTES_TEMPLATE_PEOPLE, NOTES_TEMPLATE_TASK } from '../../data/ui/Social/notesTemplate.api';
import caseConsolePo from '../../pageobject/case/case-console.po';
import viewCasePo from '../../pageobject/case/view-case.po';
import linkPropertiesPo from '../../pageobject/common/ck-editor/link-properties.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import updateStatusBladePo from '../../pageobject/common/update.status.blade.po';
import knowledgeArticlesConsolePo from '../../pageobject/knowledge/knowledge-articles-console.po';
import viewKnowledgeArticlePo from '../../pageobject/knowledge/view-knowledge-article.po';
import { default as activityTabPage } from '../../pageobject/social/activity-tab.po';
import notesTemplateUsage from '../../pageobject/social/note-template-usage.po';
import adhoctaskTemplate from "../../pageobject/task/create-adhoc-task.po";
import manageTaskBladePo from '../../pageobject/task/manage-task-blade.po';
import viewTaskPo from '../../pageobject/task/view-task.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

describe('Case Activity CKE', () => {

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
    it('[DRDMV-21619]:1_Verify the Comments posted in activity without notes template', async () => {
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let addNoteBodyText = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let adhocTaskSummary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        // Create manual task template
        let manualTemplateData = {
            "templateName": "DRDMV-21617_task template" + summary,
            "templateSummary": "DRDMV-21617_Manual_task template summary" + summary,
            "templateStatus": "Active",
            "taskCompany": '- Global -',
            "ownerCompany": "Petramco",
            "ownerBusinessUnit": "Facilities Support",
            "ownerGroup": "Facilities"
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
            "taskCompany": "Petramco",
            "ownerCompany": "Petramco",
            "ownerBusinessUnit": "Facilities Support",
            "ownerGroup": "Facilities"
        }
        await apiHelper.createAutomatedTaskTemplate(autoTemplateData);
        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        // For External
        let externalTemplateData = {
            "templateName": "DRDMV-21617 external task template name" + summary,
            "templateSummary": "DRDMV-21617 external task template summary" + summary,
            "templateStatus": "Active",
            "taskCompany": "Petramco",
            "ownerCompany": "Petramco",
            "ownerBusinessUnit": "Facilities Support",
            "ownerGroup": "Facilities"
        }
        await apiHelper.createExternalTaskTemplate(externalTemplateData);

        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        // Create Case
        let caseData = {
            "Requester": "qtao",
            "Summary": "DRDMV-21617_TC_2",
            "Assigned Company": "Petramco",
            "Business Unit": "Canada Support",
            "Support Group": "CA Support 1",
            "Assignee": "qdu"
        }
        let newCase = await apiHelper.createCase(caseData);
        await caseConsolePo.searchAndOpenCase(newCase.displayId);
        // Adding Task
        await viewCasePo.clickAddTaskButton();
        await manageTaskBladePo.addTaskFromTaskTemplate(manualTemplateData.templateSummary);
        await manageTaskBladePo.addTaskFromTaskTemplate(autoTemplateData.templateSummary);
        await manageTaskBladePo.addTaskFromTaskTemplate(externalTemplateData.templateSummary);
        await manageTaskBladePo.clickCloseButton();

        await activityTabPage.addActivityNote(addNoteBodyText);
        await activityTabPage.clearActivityNote();
        //bold
        await activityTabPage.clickOnBoldIcon();
        await activityTabPage.addActivityNote(addNoteBodyText);
        expect(await activityTabPage.isBoldTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Bold Text is not get Bold In Ck Editor');
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isBoldTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Bold Text is missing in Activity');
        //italic
        await activityTabPage.clickActivityNoteTextBox();
        await activityTabPage.clickOnItalicIcon();
        await activityTabPage.addActivityNote(addNoteBodyText);
        expect(await activityTabPage.isItalicTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not Italic In Ck Editor');
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isItalicTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Italic Text is missing In Activity');
        //underline
        await activityTabPage.clickActivityNoteTextBox();
        await activityTabPage.clickOnUnderLineIcon();
        await activityTabPage.addActivityNote(addNoteBodyText);
        expect(await activityTabPage.isUnderlineTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not Underline In Ck Editor');
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isUnderlineTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Underline Text is missing In Activity');
        // left Align
        await activityTabPage.clickActivityNoteTextBox();
        await activityTabPage.clickOnLeftAlignIcon();
        await activityTabPage.addActivityNote(addNoteBodyText);
        expect(await activityTabPage.isTextLeftAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not Left Align In Ck Editor');
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isLeftAlignTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Lefit Align Text is missing In Activity');
        //Right Align
        await activityTabPage.clickActivityNoteTextBox();
        await activityTabPage.clickOnRightAlignIcon();
        await activityTabPage.addActivityNote(addNoteBodyText);
        expect(await activityTabPage.isTextRightAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not right Align In Ck Editor');
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isRightAlignTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Right Align Text is missing In Activity');
        //Center Align
        await activityTabPage.clickActivityNoteTextBox();
        await activityTabPage.clickOnCenterAlignIcon();
        await activityTabPage.addActivityNote(addNoteBodyText);
        expect(await activityTabPage.isTextCenterAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not center Align In Ck Editor');
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isCenterAlignTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Center Align is missing In Activity');
        //set color
        await activityTabPage.clickActivityNoteTextBox();
        await activityTabPage.selectColor('Strong Red');
        await activityTabPage.addActivityNote(addNoteBodyText);
        expect(await activityTabPage.isColorTextDisplayedInCkEditorTextArea('color:#c0392b;', addNoteBodyText)).toBeTruthy('FailureMsg Color Text is missing in Ck Editor');
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isColorTextDisplayedInActivity('color:#c0392b;', addNoteBodyText, 1)).toBeTruthy('FailureMsg Color Text is missing in Activity');
        //checking number list
        await activityTabPage.clickActivityNoteTextBox();
        await activityTabPage.setInsertRemoveNumberList('PlusOne');
        expect(await activityTabPage.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('FailureMsg Number list is missing in Ck Editor');
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isNumberListTextDisplayedInActivity('PlusOne', 1)).toBeTruthy('FailureMsg Number List Text is missing In Activity');
        // checking bullot points
        await activityTabPage.clickActivityNoteTextBox();
        await activityTabPage.setInsertRemoveBulletedList('BulletOne');
        expect(await activityTabPage.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('FailureMsg Text is not center Align In Ck Editor');
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isBulletListTextDisplayedInActivity('BulletOne', 1)).toBeTruthy('FailureMsg Bullet List Text is missing In Activity');
        // Link added
        await activityTabPage.clickActivityNoteTextBox();
        await activityTabPage.clickOnLinkIcon();
        await linkPropertiesPo.setValueOfLinkProperties('Google', 0);
        await linkPropertiesPo.setValueOfLinkProperties('www.google.com', 1);
        await linkPropertiesPo.clickOnOkBtn();
        expect(await activityTabPage.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('FailureMsg Link is missing in Ck Editor');
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 1)).toBeTruthy('FailureMsg Link Text is missing In Activity');
        // Attach Image
        await activityTabPage.addActivityNote(addNoteBodyText);
        await activityTabPage.addAttachment(['../../data/ui/attachment/bwfPdf.pdf']);
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isAttachedFileNameDisplayed('bwfPdf.pdf')).toBeTruthy('FailureMsg Image missing in activity tab');

        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        // Goto Manual Task
        await viewCasePo.clickAddTaskButton();
        await manageTaskBladePo.clickTaskLink(manualTemplateData.templateSummary);
        await activityTabPage.addActivityNote(addNoteBodyText);
        await activityTabPage.clearActivityNote();
        //bold
        await activityTabPage.clickOnBoldIcon();
        await activityTabPage.addActivityNote(addNoteBodyText);
        expect(await activityTabPage.isBoldTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Bold Text is not get Bold In Ck Editor');
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isBoldTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Bold Text is missing in Activity');
        //italic
        await activityTabPage.clickActivityNoteTextBox();
        await activityTabPage.clickOnItalicIcon();
        await activityTabPage.addActivityNote(addNoteBodyText);
        expect(await activityTabPage.isItalicTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not Italic In Ck Editor');
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isItalicTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Italic Text is missing In Activity');
        //underline
        await activityTabPage.clickActivityNoteTextBox();
        await activityTabPage.clickOnUnderLineIcon();
        await activityTabPage.addActivityNote(addNoteBodyText);
        expect(await activityTabPage.isUnderlineTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not Underline In Ck Editor');
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isUnderlineTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Underline Text is missing In Activity');
        // left Align
        await activityTabPage.clickActivityNoteTextBox();
        await activityTabPage.clickOnLeftAlignIcon();
        await activityTabPage.addActivityNote(addNoteBodyText);
        expect(await activityTabPage.isTextLeftAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not Left Align In Ck Editor');
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isLeftAlignTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Lefit Align Text is missing In Activity');
        //Right Align
        await activityTabPage.clickActivityNoteTextBox();
        await activityTabPage.clickOnRightAlignIcon();
        await activityTabPage.addActivityNote(addNoteBodyText);
        expect(await activityTabPage.isTextRightAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not right Align In Ck Editor');
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isRightAlignTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Right Align Text is missing In Activity');
        //Center Align
        await activityTabPage.clickActivityNoteTextBox();
        await activityTabPage.clickOnCenterAlignIcon();
        await activityTabPage.addActivityNote(addNoteBodyText);
        expect(await activityTabPage.isTextCenterAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not center Align In Ck Editor');
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isCenterAlignTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Center Align is missing In Activity');
        //set color
        await activityTabPage.clickActivityNoteTextBox();
        await activityTabPage.selectColor('Strong Red');
        await activityTabPage.addActivityNote(addNoteBodyText);
        expect(await activityTabPage.isColorTextDisplayedInCkEditorTextArea('color:#c0392b;', addNoteBodyText)).toBeTruthy('FailureMsg Color Text is missing in Ck Editor');
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isColorTextDisplayedInActivity('color:#c0392b;', addNoteBodyText, 1)).toBeTruthy('FailureMsg Color Text is missing in Activity');
        //checking number list
        await activityTabPage.clickActivityNoteTextBox();
        await activityTabPage.setInsertRemoveNumberList('PlusOne');
        expect(await activityTabPage.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('FailureMsg Number list is missing in Ck Editor');
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isNumberListTextDisplayedInActivity('PlusOne', 1)).toBeTruthy('FailureMsg Number List Text is missing In Activity');
        // checking bullot points
        await activityTabPage.clickActivityNoteTextBox();
        await activityTabPage.setInsertRemoveBulletedList('BulletOne');
        expect(await activityTabPage.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('FailureMsg Text is not center Align In Ck Editor');
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isBulletListTextDisplayedInActivity('BulletOne', 1)).toBeTruthy('FailureMsg Bullet List Text is missing In Activity');
        // Link added
        await activityTabPage.clickActivityNoteTextBox();
        await activityTabPage.clickOnLinkIcon();
        await linkPropertiesPo.setValueOfLinkProperties('Google', 0);
        await linkPropertiesPo.setValueOfLinkProperties('www.google.com', 1);
        await linkPropertiesPo.clickOnOkBtn();
        expect(await activityTabPage.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('FailureMsg Link is missing in Ck Editor');
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 1)).toBeTruthy('FailureMsg Link Text is missing In Activity');
        // Attach Image
        await activityTabPage.addActivityNote(addNoteBodyText);
        await activityTabPage.addAttachment(['../../data/ui/attachment/bwfPdf.pdf']);
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isAttachedFileNameDisplayed('bwfPdf.pdf')).toBeTruthy('FailureMsg Image missing in activity tab');
        await viewTaskPo.clickOnViewCase();
        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        // Goto Automated Task
        await viewCasePo.clickAddTaskButton();
        await manageTaskBladePo.clickTaskLink(autoTemplateData.templateSummary);
        await activityTabPage.addActivityNote(addNoteBodyText);
        expect(await activityTabPage.isCkEditorDisplayed()).toBeTruthy('FailureMsg CkEditor is missing');
        await activityTabPage.clearActivityNote();
        //bold
        await activityTabPage.clickOnBoldIcon();
        await activityTabPage.addActivityNote(addNoteBodyText);
        expect(await activityTabPage.isBoldTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Bold Text is not get Bold In Ck Editor');
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isBoldTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Bold Text is missing in Activity');
        //italic
        await activityTabPage.clickActivityNoteTextBox();
        await activityTabPage.clickOnItalicIcon();
        await activityTabPage.addActivityNote(addNoteBodyText);
        expect(await activityTabPage.isItalicTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not Italic In Ck Editor');
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isItalicTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Italic Text is missing In Activity');
        //underline
        await activityTabPage.clickActivityNoteTextBox();
        await activityTabPage.clickOnUnderLineIcon();
        await activityTabPage.addActivityNote(addNoteBodyText);
        expect(await activityTabPage.isUnderlineTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not Underline In Ck Editor');
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isUnderlineTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Underline Text is missing In Activity');
        // left Align
        await activityTabPage.clickActivityNoteTextBox();
        await activityTabPage.clickOnLeftAlignIcon();
        await activityTabPage.addActivityNote(addNoteBodyText);
        expect(await activityTabPage.isTextLeftAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not Left Align In Ck Editor');
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isLeftAlignTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Lefit Align Text is missing In Activity');
        //Right Align
        await activityTabPage.clickActivityNoteTextBox();
        await activityTabPage.clickOnRightAlignIcon();
        await activityTabPage.addActivityNote(addNoteBodyText);
        expect(await activityTabPage.isTextRightAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not right Align In Ck Editor');
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isRightAlignTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Right Align Text is missing In Activity');
        //Center Align
        await activityTabPage.clickActivityNoteTextBox();
        await activityTabPage.clickOnCenterAlignIcon();
        await activityTabPage.addActivityNote(addNoteBodyText);
        expect(await activityTabPage.isTextCenterAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not center Align In Ck Editor');
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isCenterAlignTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Center Align is missing In Activity');
        //set color
        await activityTabPage.clickActivityNoteTextBox();
        await activityTabPage.selectColor('Strong Red');
        await activityTabPage.addActivityNote(addNoteBodyText);
        expect(await activityTabPage.isColorTextDisplayedInCkEditorTextArea('color:#c0392b;', addNoteBodyText)).toBeTruthy('FailureMsg Color Text is missing in Ck Editor');
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isColorTextDisplayedInActivity('color:#c0392b;', addNoteBodyText, 1)).toBeTruthy('FailureMsg Color Text is missing in Activity');
        //checking number list
        await activityTabPage.clickActivityNoteTextBox();
        await activityTabPage.setInsertRemoveNumberList('PlusOne');
        expect(await activityTabPage.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('FailureMsg Number list is missing in Ck Editor');
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isNumberListTextDisplayedInActivity('PlusOne', 1)).toBeTruthy('FailureMsg Number List Text is missing In Activity');
        // checking bullot points
        await activityTabPage.clickActivityNoteTextBox();
        await activityTabPage.setInsertRemoveBulletedList('BulletOne');
        expect(await activityTabPage.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('FailureMsg Text is not center Align In Ck Editor');
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isBulletListTextDisplayedInActivity('BulletOne', 1)).toBeTruthy('FailureMsg Bullet List Text is missing In Activity');
        // Link added
        await activityTabPage.clickActivityNoteTextBox();
        await activityTabPage.clickOnLinkIcon();
        await linkPropertiesPo.setValueOfLinkProperties('Google', 0);
        await linkPropertiesPo.setValueOfLinkProperties('www.google.com', 1);
        await linkPropertiesPo.clickOnOkBtn();
        expect(await activityTabPage.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('FailureMsg Link is missing in Ck Editor');
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 1)).toBeTruthy('FailureMsg Link Text is missing In Activity');
        // Attach Image
        await activityTabPage.addActivityNote(addNoteBodyText);
        await activityTabPage.addAttachment(['../../data/ui/attachment/bwfPdf.pdf']);
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isAttachedFileNameDisplayed('bwfPdf.pdf')).toBeTruthy('FailureMsg Image missing in activity tab');
        await viewTaskPo.clickOnViewCase();
        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        // Goto External Task
        await viewCasePo.clickAddTaskButton();
        await manageTaskBladePo.clickTaskLink(externalTemplateData.templateSummary);
        await activityTabPage.addActivityNote(addNoteBodyText);
        await activityTabPage.clearActivityNote();
        //bold
        await activityTabPage.clickOnBoldIcon();
        await activityTabPage.addActivityNote(addNoteBodyText);
        expect(await activityTabPage.isBoldTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Bold Text is not get Bold In Ck Editor');
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isBoldTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Bold Text is missing in Activity');
        //italic
        await activityTabPage.clickActivityNoteTextBox();
        await activityTabPage.clickOnItalicIcon();
        await activityTabPage.addActivityNote(addNoteBodyText);
        expect(await activityTabPage.isItalicTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not Italic In Ck Editor');
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isItalicTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Italic Text is missing In Activity');
        //underline
        await activityTabPage.clickActivityNoteTextBox();
        await activityTabPage.clickOnUnderLineIcon();
        await activityTabPage.addActivityNote(addNoteBodyText);
        expect(await activityTabPage.isUnderlineTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not Underline In Ck Editor');
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isUnderlineTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Underline Text is missing In Activity');
        // left Align
        await activityTabPage.clickActivityNoteTextBox();
        await activityTabPage.clickOnLeftAlignIcon();
        await activityTabPage.addActivityNote(addNoteBodyText);
        expect(await activityTabPage.isTextLeftAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not Left Align In Ck Editor');
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isLeftAlignTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Lefit Align Text is missing In Activity');
        //Right Align
        await activityTabPage.clickActivityNoteTextBox();
        await activityTabPage.clickOnRightAlignIcon();
        await activityTabPage.addActivityNote(addNoteBodyText);
        expect(await activityTabPage.isTextRightAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not right Align In Ck Editor');
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isRightAlignTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Right Align Text is missing In Activity');
        //Center Align
        await activityTabPage.clickActivityNoteTextBox();
        await activityTabPage.clickOnCenterAlignIcon();
        await activityTabPage.addActivityNote(addNoteBodyText);
        expect(await activityTabPage.isTextCenterAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not center Align In Ck Editor');
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isCenterAlignTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Center Align is missing In Activity');
        //set color
        await activityTabPage.clickActivityNoteTextBox();
        await activityTabPage.selectColor('Strong Red');
        await activityTabPage.addActivityNote(addNoteBodyText);
        expect(await activityTabPage.isColorTextDisplayedInCkEditorTextArea('color:#c0392b;', addNoteBodyText)).toBeTruthy('FailureMsg Color Text is missing in Ck Editor');
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isColorTextDisplayedInActivity('color:#c0392b;', addNoteBodyText, 1)).toBeTruthy('FailureMsg Color Text is missing in Activity');
        //checking number list
        await activityTabPage.clickActivityNoteTextBox();
        await activityTabPage.setInsertRemoveNumberList('PlusOne');
        expect(await activityTabPage.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('FailureMsg Number list is missing in Ck Editor');
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isNumberListTextDisplayedInActivity('PlusOne', 1)).toBeTruthy('FailureMsg Number List Text is missing In Activity');
        // checking bullot points
        await activityTabPage.clickActivityNoteTextBox();
        await activityTabPage.setInsertRemoveBulletedList('BulletOne');
        expect(await activityTabPage.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('FailureMsg Text is not center Align In Ck Editor');
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isBulletListTextDisplayedInActivity('BulletOne', 1)).toBeTruthy('FailureMsg Bullet List Text is missing In Activity');
        // Link added
        await activityTabPage.clickActivityNoteTextBox();
        await activityTabPage.clickOnLinkIcon();
        await linkPropertiesPo.setValueOfLinkProperties('Google', 0);
        await linkPropertiesPo.setValueOfLinkProperties('www.google.com', 1);
        await linkPropertiesPo.clickOnOkBtn();
        expect(await activityTabPage.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('FailureMsg Link is missing in Ck Editor');
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 1)).toBeTruthy('FailureMsg Link Text is missing In Activity');
        // Attach Image
        await activityTabPage.addActivityNote(addNoteBodyText);
        await activityTabPage.addAttachment(['../../data/ui/attachment/bwfPdf.pdf']);
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isAttachedFileNameDisplayed('bwfPdf.pdf')).toBeTruthy('FailureMsg Image missing in activity tab');
        await viewTaskPo.clickOnViewCase();

        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        // Goto Adhoc Task
        await viewCasePo.clickAddTaskButton();
        await manageTaskBladePo.clickAddAdhocTaskButton();
        expect(await adhoctaskTemplate.isAttachmentButtonDisplayed()).toBeTruthy();
        await adhoctaskTemplate.setSummary(adhocTaskSummary);
        await adhoctaskTemplate.setDescription("Description");
        await adhoctaskTemplate.clickSaveAdhoctask();
        await manageTaskBladePo.clickCloseButton();
        await viewCasePo.clickAddTaskButton();
        await manageTaskBladePo.clickTaskLink(adhocTaskSummary);
        await activityTabPage.addActivityNote(addNoteBodyText);
        await activityTabPage.clearActivityNote();
        //bold
        await activityTabPage.clickOnBoldIcon();
        await activityTabPage.addActivityNote(addNoteBodyText);
        expect(await activityTabPage.isBoldTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Bold Text is not get Bold In Ck Editor');
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isBoldTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Bold Text is missing in Activity');
        //italic
        await activityTabPage.clickActivityNoteTextBox();
        await activityTabPage.clickOnItalicIcon();
        await activityTabPage.addActivityNote(addNoteBodyText);
        expect(await activityTabPage.isItalicTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not Italic In Ck Editor');
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isItalicTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Italic Text is missing In Activity');
        //underline
        await activityTabPage.clickActivityNoteTextBox();
        await activityTabPage.clickOnUnderLineIcon();
        await activityTabPage.addActivityNote(addNoteBodyText);
        expect(await activityTabPage.isUnderlineTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not Underline In Ck Editor');
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isUnderlineTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Underline Text is missing In Activity');
        // left Align
        await activityTabPage.clickActivityNoteTextBox();
        await activityTabPage.clickOnLeftAlignIcon();
        await activityTabPage.addActivityNote(addNoteBodyText);
        expect(await activityTabPage.isTextLeftAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not Left Align In Ck Editor');
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isLeftAlignTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Lefit Align Text is missing In Activity');
        //Right Align
        await activityTabPage.clickActivityNoteTextBox();
        await activityTabPage.clickOnRightAlignIcon();
        await activityTabPage.addActivityNote(addNoteBodyText);
        expect(await activityTabPage.isTextRightAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not right Align In Ck Editor');
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isRightAlignTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Right Align Text is missing In Activity');
        //Center Align
        await activityTabPage.clickActivityNoteTextBox();
        await activityTabPage.clickOnCenterAlignIcon();
        await activityTabPage.addActivityNote(addNoteBodyText);
        expect(await activityTabPage.isTextCenterAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not center Align In Ck Editor');
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isCenterAlignTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Center Align is missing In Activity');
        //set color
        await activityTabPage.clickActivityNoteTextBox();
        await activityTabPage.selectColor('Strong Red');
        await activityTabPage.addActivityNote(addNoteBodyText);
        expect(await activityTabPage.isColorTextDisplayedInCkEditorTextArea('color:#c0392b;', addNoteBodyText)).toBeTruthy('FailureMsg Color Text is missing in Ck Editor');
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isColorTextDisplayedInActivity('color:#c0392b;', addNoteBodyText, 1)).toBeTruthy('FailureMsg Color Text is missing in Activity');
        //checking number list
        await activityTabPage.clickActivityNoteTextBox();
        await activityTabPage.setInsertRemoveNumberList('PlusOne');
        expect(await activityTabPage.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('FailureMsg Number list is missing in Ck Editor');
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isNumberListTextDisplayedInActivity('PlusOne', 1)).toBeTruthy('FailureMsg Number List Text is missing In Activity');
        // checking bullot points
        await activityTabPage.clickActivityNoteTextBox();
        await activityTabPage.setInsertRemoveBulletedList('BulletOne');
        expect(await activityTabPage.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('FailureMsg Text is not center Align In Ck Editor');
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isBulletListTextDisplayedInActivity('BulletOne', 1)).toBeTruthy('FailureMsg Bullet List Text is missing In Activity');
        // Link added
        await activityTabPage.clickActivityNoteTextBox();
        await activityTabPage.clickOnLinkIcon();
        await linkPropertiesPo.setValueOfLinkProperties('Google', 0);
        await linkPropertiesPo.setValueOfLinkProperties('www.google.com', 1);
        await linkPropertiesPo.clickOnOkBtn();
        expect(await activityTabPage.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('FailureMsg Link is missing in Ck Editor');
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 1)).toBeTruthy('FailureMsg Link Text is missing In Activity');
        // Attach Image
        await activityTabPage.addActivityNote(addNoteBodyText);
        await activityTabPage.addAttachment(['../../data/ui/attachment/bwfPdf.pdf']);
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isAttachedFileNameDisplayed('bwfPdf.pdf')).toBeTruthy('FailureMsg Image missing in activity tab');
    }, 1100 * 1000);

    //kgaikwad
    it('[DRDMV-21619]:2_Verify the Comments posted in activity without notes template', async () => {
        try {
            let addNoteBodyText = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let knowledgeArticle = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let url = 'http://www.google.com ';

            await apiHelper.apiLogin('qkatawazi');
            // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            // Create Case
            let caseData = {
                "Requester": "qtao",
                "Summary": "DRDMV-21617_TC_2",
                "Assigned Company": "Petramco",
                "Business Unit": "Canada Support",
                "Support Group": "CA Support 1",
                "Assignee": "qdu"
            }
            let newCase = await apiHelper.createCase(caseData);
            // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            // Create knowledge Article task template
            let articleData = {
                "knowledgeSet": "HR",
                "title": `${knowledgeArticle}`,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "Canada Support",
                "assigneeSupportGroup": "CA Support 1",
                "assignee": "qdu"
            }
            let knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
            let knowledgeArticleGUID = knowledgeArticleData.id;
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'Draft')).toBeTruthy('FailureMsg Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'PublishApproval', 'qdu', 'CA Support 1', 'Petramco')).toBeTruthy('FailureMsg Status Not Set');
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await caseConsolePo.searchAndOpenCase(newCase.displayId);
            expect(await viewCasePo.getCaseID()).toBe(newCase.displayId, 'Case Id is missing');

            // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            // Create knowledge Article task template
            await navigationPage.gotoKnowledgeConsole();
            await knowledgeArticlesConsolePo.searchAndOpenKnowledgeArticle(knowledgeArticleData.displayId);
            expect(await viewKnowledgeArticlePo.isEditLinkDisplayedOnKA()).toBeTruthy('FailureMsg KA Edit link is missing')

            await viewKnowledgeArticlePo.clickOnActivityTab();
            await activityTabPage.addActivityNote(addNoteBodyText);
            await activityTabPage.clearActivityNote();
            //bold
            await activityTabPage.clickOnBoldIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isBoldTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Bold Text is not get Bold In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isBoldTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Bold Text is missing in Activity');
            //italic
            await activityTabPage.clickActivityNoteTextBox();
            await activityTabPage.clickOnItalicIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isItalicTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not Italic In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isItalicTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Italic Text is missing In Activity');
            //underline
            await activityTabPage.clickActivityNoteTextBox();
            await activityTabPage.clickOnUnderLineIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isUnderlineTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not Underline In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isUnderlineTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Underline Text is missing In Activity');
            // left Align
            await activityTabPage.clickActivityNoteTextBox();
            await activityTabPage.clickOnLeftAlignIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isTextLeftAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not Left Align In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isLeftAlignTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Lefit Align Text is missing In Activity');
            //Right Align
            await activityTabPage.clickActivityNoteTextBox();
            await activityTabPage.clickOnRightAlignIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isTextRightAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not right Align In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isRightAlignTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Right Align Text is missing In Activity');
            //Center Align
            await activityTabPage.clickActivityNoteTextBox();
            await activityTabPage.clickOnCenterAlignIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isTextCenterAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not center Align In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isCenterAlignTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Center Align is missing In Activity');
            //set color
            await activityTabPage.clickActivityNoteTextBox();
            await activityTabPage.selectColor('Strong Red');
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isColorTextDisplayedInCkEditorTextArea('color:#c0392b;', addNoteBodyText)).toBeTruthy('FailureMsg Color Text is missing in Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isColorTextDisplayedInActivity('color:#c0392b;', addNoteBodyText, 1)).toBeTruthy('FailureMsg Color Text is missing in Activity');
            //checking number list
            await activityTabPage.clickActivityNoteTextBox();
            await activityTabPage.setInsertRemoveNumberList('PlusOne');
            expect(await activityTabPage.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('FailureMsg Number list is missing in Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isNumberListTextDisplayedInActivity('PlusOne', 1)).toBeTruthy('FailureMsg Number List Text is missing In Activity');
            // checking bullot points
            await activityTabPage.clickActivityNoteTextBox();
            await activityTabPage.setInsertRemoveBulletedList('BulletOne');
            expect(await activityTabPage.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('FailureMsg Text is not center Align In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isBulletListTextDisplayedInActivity('BulletOne', 1)).toBeTruthy('FailureMsg Bullet List Text is missing In Activity');
            // Link added
            await activityTabPage.clickActivityNoteTextBox();
            await activityTabPage.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('Google', 0);
            await linkPropertiesPo.setValueOfLinkProperties('www.google.com', 1);
            await linkPropertiesPo.clickOnOkBtn();
            expect(await activityTabPage.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('FailureMsg Link is missing in Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 1)).toBeTruthy('FailureMsg Link Text is missing In Activity');
            // Attach Image
            await activityTabPage.addActivityNote(addNoteBodyText);
            await activityTabPage.addAttachment(['../../data/ui/attachment/bwfPdf.pdf']);
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isAttachedFileNameDisplayed('bwfPdf.pdf')).toBeTruthy('FailureMsg Image missing in activity tab');
            // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            // Profile View CK Editor
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(newCase.displayId);
            await activityTabPage.clickOnRefreshButton();
            await activityTabPage.clickOnHyperlinkFromActivity(2, 'Qadim Katawazi');

            await activityTabPage.addActivityNote(addNoteBodyText);
            await activityTabPage.clearActivityNote();
            //bold
            await activityTabPage.clickOnBoldIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isBoldTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Bold Text is not get Bold In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isBoldTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Bold Text is missing in Activity');
            //italic
            await activityTabPage.clickActivityNoteTextBox();
            await activityTabPage.clickOnItalicIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isItalicTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not Italic In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isItalicTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Italic Text is missing In Activity');
            //underline
            await activityTabPage.clickActivityNoteTextBox();
            await activityTabPage.clickOnUnderLineIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isUnderlineTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not Underline In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isUnderlineTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Underline Text is missing In Activity');
            // left Align
            await activityTabPage.clickActivityNoteTextBox();
            await activityTabPage.clickOnLeftAlignIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isTextLeftAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not Left Align In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isLeftAlignTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Lefit Align Text is missing In Activity');
            //Right Align
            await activityTabPage.clickActivityNoteTextBox();
            await activityTabPage.clickOnRightAlignIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isTextRightAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not right Align In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isRightAlignTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Right Align Text is missing In Activity');
            //Center Align
            await activityTabPage.clickActivityNoteTextBox();
            await activityTabPage.clickOnCenterAlignIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isTextCenterAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not center Align In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isCenterAlignTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Center Align is missing In Activity');
            //set color
            await activityTabPage.clickActivityNoteTextBox();
            await activityTabPage.selectColor('Strong Red');
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isColorTextDisplayedInCkEditorTextArea('color:#c0392b;', addNoteBodyText)).toBeTruthy('FailureMsg Color Text is missing in Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isColorTextDisplayedInActivity('color:#c0392b;', addNoteBodyText, 1)).toBeTruthy('FailureMsg Color Text is missing in Activity');
            //checking number list
            await activityTabPage.clickActivityNoteTextBox();
            await activityTabPage.setInsertRemoveNumberList('PlusOne');
            expect(await activityTabPage.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('FailureMsg Number list is missing in Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isNumberListTextDisplayedInActivity('PlusOne', 1)).toBeTruthy('FailureMsg Number List Text is missing In Activity');
            // checking bullot points
            await activityTabPage.clickActivityNoteTextBox();
            await activityTabPage.setInsertRemoveBulletedList('BulletOne');
            expect(await activityTabPage.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('FailureMsg Text is not center Align In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isBulletListTextDisplayedInActivity('BulletOne', 1)).toBeTruthy('FailureMsg Bullet List Text is missing In Activity');
            // Link added
            await activityTabPage.clickActivityNoteTextBox();
            await activityTabPage.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('Google', 0);
            await linkPropertiesPo.setValueOfLinkProperties('www.google.com', 1);
            await linkPropertiesPo.clickOnOkBtn();
            expect(await activityTabPage.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('FailureMsg Link is missing in Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 1)).toBeTruthy('FailureMsg Link Text is missing In Activity');
            // Attach Image
            await activityTabPage.addActivityNote(addNoteBodyText);
            await activityTabPage.addAttachment(['../../data/ui/attachment/bwfPdf.pdf']);
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isAttachedFileNameDisplayed('bwfPdf.pdf')).toBeTruthy('FailureMsg Image missing in activity tab');

        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 660 * 1000);

    //kgaikwad
    it('[DRDMV-21620]:Verify the Comments posted in activity with notes template.', async () => {
        try {
            let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let adhocTaskSummary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let knowledgeArticle = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let randomStr1 = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');

            await navigationPage.gotoCaseConsole();
            await apiHelper.apiLogin('qkatawazi');
            // Create manual task template
            let manualTemplateData = {
                "templateName": "DRDMV-21620 template" + summary,
                "templateSummary": "DRDMV-21620_Manual_task template summary" + summary,
                "templateStatus": "Active",
                "taskCompany": '- Global -',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            await apiHelper.createManualTaskTemplate(manualTemplateData);

            // Create automated task template
            let autoTemplateData = {
                "templateName": "DRDMV-21620 auto task template" + summary,
                "templateSummary": "DRDMV-21620 auto task template summary" + summary,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": `Case Process ${summary}`,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            await apiHelper.createAutomatedTaskTemplate(autoTemplateData);

            // For External
            let externalTemplateData = {
                "templateName": "DRDMV-21620 external task template name" + summary,
                "templateSummary": "DRDMV-21620 external task template summary" + summary,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            await apiHelper.createExternalTaskTemplate(externalTemplateData);
            // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            // Create knowledge Article task template
            let articleData = {
                "knowledgeSet": "HR",
                "title": `${knowledgeArticle}`,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "Canada Support",
                "assigneeSupportGroup": "CA Support 1",
                "assignee": "qdu"
            }


            let knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
            let knowledgeArticleGUID = knowledgeArticleData.id;
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'Draft')).toBeTruthy('FailureMsg Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'PublishApproval', 'qdu', 'CA Support 1', 'Petramco')).toBeTruthy('FailureMsg Status Not Set');
            // Create Case Notes Template
            let notesTemplateCaseData = NOTES_TEMPLATE_MANDATORY_FIELD;
            let notesTemplateTaskData = NOTES_TEMPLATE_TASK;
            let notesTemplatePeopleData = NOTES_TEMPLATE_PEOPLE;
            let notesTemplateKnowledgeData = NOTES_TEMPLATE_KNOWLEDGE_ARTICLE;

            notesTemplateCaseData.body = notesTemplateCaseData.body + randomStr;
            notesTemplateCaseData.templateName = notesTemplateCaseData.templateName + randomStr1;
            await apiHelper.createNotesTemplate("Case", notesTemplateCaseData);
            console.log('Case', notesTemplateCaseData.templateName);
            // Create people Notes Template
            notesTemplatePeopleData.body = notesTemplatePeopleData.body + randomStr;
            notesTemplatePeopleData.templateName = notesTemplatePeopleData.templateName + randomStr1;
            await apiHelper.createNotesTemplate("People", notesTemplatePeopleData);
            console.log('People', notesTemplatePeopleData.templateName);
            // Create Task Notes Template
            notesTemplateTaskData.body = notesTemplateTaskData.body + randomStr;
            notesTemplateTaskData.templateName = notesTemplateTaskData.templateName + randomStr1;
            await apiHelper.createNotesTemplate("Task", notesTemplateTaskData);
            console.log('Task', notesTemplateTaskData.templateName);
            // Create knowledge Notes Template
            notesTemplateKnowledgeData.body = notesTemplateKnowledgeData.body + randomStr;
            notesTemplateKnowledgeData.templateName = notesTemplateKnowledgeData.templateName + randomStr1;
            await apiHelper.createNotesTemplate("Knowledge", notesTemplateKnowledgeData);
            console.log('Knowledge', notesTemplateKnowledgeData.templateName);
            // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            // Create Case
            let caseData = {
                "Requester": "qtao",
                "Summary": "DRDMV-21617_TC",
                "Assigned Company": "Petramco",
                "Business Unit": "Canada Support",
                "Support Group": "CA Support 1",
                "Assignee": "qdu"
            }
            let newCase = await apiHelper.createCase(caseData);
            await caseConsolePo.searchAndOpenCase(newCase.displayId);
            await updateStatusBladePo.changeCaseStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewCasePo.getTextOfStatus()).toBe('In Progress');

            // Adding Task
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.addTaskFromTaskTemplate(manualTemplateData.templateSummary);
            await manageTaskBladePo.addTaskFromTaskTemplate(autoTemplateData.templateSummary);
            await manageTaskBladePo.addTaskFromTaskTemplate(externalTemplateData.templateSummary);
            await manageTaskBladePo.clickCloseButton();

            // Verify Case Notes Template
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(notesTemplateCaseData.templateName);
            expect(await activityTabPage.getTextCkEditorTextArea()).toContain(notesTemplateCaseData.body)
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isTextPresentInNote(notesTemplateCaseData.body)).toBeTruthy('FailureMsg Note Template is missing in activity');

            // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            // Profile View CK Editor
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await caseConsolePo.searchAndOpenCase(newCase.displayId);
            await activityTabPage.clickOnRefreshButton();
            await activityTabPage.clickOnHyperlinkFromActivity(2, 'Qadim Katawazi');
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(notesTemplatePeopleData.templateName);
            expect(await activityTabPage.getTextCkEditorTextArea()).toContain(notesTemplatePeopleData.body)
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isTextPresentInNote(notesTemplatePeopleData.body)).toBeTruthy('FailureMsg Note Template is missing in activity');

            // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            // Goto Manual Task
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(newCase.displayId);
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickTaskLink(manualTemplateData.templateSummary);
            await viewTaskPo.clickOnChangeStatus();
            await viewTaskPo.changeTaskStatus('Completed');
            await updateStatusBladePo.setStatusReason('Successful');
            await viewTaskPo.clickOnSaveStatus();
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(notesTemplateTaskData.templateName);
            expect(await activityTabPage.getTextCkEditorTextArea()).toContain(notesTemplateTaskData.body)
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isTextPresentInNote(notesTemplateTaskData.body)).toBeTruthy('FailureMsg Note Template is missing in activity');
            await viewTaskPo.clickOnViewCase();

            // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            // Goto Automated Task
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickTaskLink(autoTemplateData.templateSummary);
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(notesTemplateTaskData.templateName);
            expect(await activityTabPage.getTextCkEditorTextArea()).toContain(notesTemplateTaskData.body)
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isTextPresentInNote(notesTemplateTaskData.body)).toBeTruthy('FailureMsg Note Template is missing in activity');
            await viewTaskPo.clickOnViewCase();
            // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            // Goto External Task
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickTaskLink(externalTemplateData.templateSummary);
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(notesTemplateTaskData.templateName);
            expect(await activityTabPage.getTextCkEditorTextArea()).toContain(notesTemplateTaskData.body)
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isTextPresentInNote(notesTemplateTaskData.body)).toBeTruthy('FailureMsg Note Template is missing in activity');
            await viewTaskPo.clickOnViewCase();

            // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            // Goto Adhoc Task
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickAddAdhocTaskButton();
            expect(await adhoctaskTemplate.isAttachmentButtonDisplayed()).toBeTruthy();
            await adhoctaskTemplate.setSummary(adhocTaskSummary);
            await adhoctaskTemplate.setDescription("Description");
            await adhoctaskTemplate.clickSaveAdhoctask();
            await manageTaskBladePo.clickCloseButton();
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickTaskLink(adhocTaskSummary);

            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(notesTemplateTaskData.templateName);
            expect(await activityTabPage.getTextCkEditorTextArea()).toContain(notesTemplateTaskData.body)
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isTextPresentInNote(notesTemplateTaskData.body)).toBeTruthy('FailureMsg Note Template is missing in activity');

            // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            // Create knowledge Article task template
            await navigationPage.gotoKnowledgeConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(knowledgeArticleData.displayId);
            expect(await viewKnowledgeArticlePo.isEditLinkDisplayedOnKA()).toBeTruthy('FailureMsg KA Edit link is missing')
            await viewKnowledgeArticlePo.clickOnActivityTab();

            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(notesTemplateKnowledgeData.templateName);
            expect(await activityTabPage.getTextCkEditorTextArea()).toContain(notesTemplateKnowledgeData.body)
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isTextPresentInNote(notesTemplateKnowledgeData.body)).toBeTruthy('FailureMsg Note Template is missing in activity');
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 1100 * 1000);
});
