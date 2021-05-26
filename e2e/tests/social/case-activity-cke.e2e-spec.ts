import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import { NOTES_TEMPLATE_KNOWLEDGE_ARTICLE, NOTES_TEMPLATE_MANDATORY_FIELD, NOTES_TEMPLATE_PEOPLE, NOTES_TEMPLATE_TASK } from '../../data/ui/Social/notesTemplate.api';
import caseConsolePo from '../../pageobject/case/case-console.po';
import viewCasePo from '../../pageobject/case/view-case.po';
import ckeditorOpsPo from '../../pageobject/common/ck-editor/ckeditor-ops.po';
import ckeditorValidationPo from '../../pageobject/common/ck-editor/ckeditor-validation.po';
import linkPropertiesPo from '../../pageobject/common/ck-editor/link-properties.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import updateStatusBladePo from '../../pageobject/common/update.status.blade.po';
import knowledgeArticlesConsolePo from '../../pageobject/knowledge/knowledge-articles-console.po';
import viewKnowledgeArticlePo from '../../pageobject/knowledge/view-knowledge-article.po';
import activityTabPage from '../../pageobject/social/activity-tab.po';
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
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //kgaikwad
    describe('[3580]: Verify the Comments posted in activity without notes template', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');

        let addNoteBodyText = 'addNoteBodyTextDRDMV21619' + randomStr;
        let adhocTaskSummary = 'adhocTaskSummaryDRDMV21619' + randomStr;
        let knowledgeArticle = 'knowledgeArticleDRDMV21619' + randomStr;
        let manualTemplateData;
        let autoTemplateData;
        let externalTemplateData;
        let knowledgeArticleData;
        let newCase;

        beforeAll(async () => {
            // Create manual task template
            manualTemplateData = {
                "templateName": "DRDMV21619TaskTemplate" + randomStr,
                "templateSummary": "DRDMV21619ManualTaskTemplateSummary" + randomStr,
                "templateStatus": "Active",
                "taskCompany": '- Global -',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Canada Support",
                "ownerGroup": "CA Support 1"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createManualTaskTemplate(manualTemplateData);

            // Create automated task template
            autoTemplateData = {
                "templateName": "DRDMV21619AutoTaskTemplate" + randomStr,
                "templateSummary": "DRDMV21619AutoTaskTemplateSummary" + randomStr,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": `Case Process ${randomStr}`,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Canada Support",
                "ownerGroup": "CA Support 1"
            }
            await apiHelper.createAutomatedTaskTemplate(autoTemplateData);

            // For External
            externalTemplateData = {
                "templateName": "DRDMV21619ExternalTaskTemplateName" + randomStr,
                "templateSummary": "DRDMV21619ExternalTaskTemplateSummary" + randomStr,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Canada Support",
                "ownerGroup": "CA Support 1"
            }
            await apiHelper.createExternalTaskTemplate(externalTemplateData);

            // Create Case
            let caseData = {
                "Requester": "qtao",
                "Summary": "DRDMV21619TC2",
                "Assigned Company": "Petramco",
                "Business Unit": "Canada Support",
                "Support Group": "CA Support 1",
                "Assignee": "qdu"
            }
            newCase = await apiHelper.createCase(caseData);

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
            knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
            let knowledgeArticleGUID = knowledgeArticleData.id;
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'Draft')).toBeTruthy('FailureMsg Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'PublishApproval', 'qdu', 'CA Support 1', 'Petramco')).toBeTruthy('FailureMsg Status Not Set');
        });

        it('[3580]: Open Case And Add Task Into', async () => {
            await caseConsolePo.searchAndOpenCase(newCase.displayId);
            // Adding Task
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.addTaskFromTaskTemplate(manualTemplateData.templateSummary,1);
            expect (await manageTaskBladePo.isTaskLinkPresent(manualTemplateData.templateSummary)).toBeTruthy(`${manualTemplateData.templateSummary} missing task link`);
            await manageTaskBladePo.addTaskFromTaskTemplate(autoTemplateData.templateSummary,2);
            expect (await manageTaskBladePo.isTaskLinkPresent(autoTemplateData.templateSummary)).toBeTruthy(`${manualTemplateData.templateSummary} missing task link`);
            await manageTaskBladePo.addTaskFromTaskTemplate(externalTemplateData.templateSummary,3);
            await utilityCommon.closePopUpMessage();
            expect (await manageTaskBladePo.isTaskLinkPresent(externalTemplateData.templateSummary)).toBeTruthy(`${manualTemplateData.templateSummary} missing task link`);
            await manageTaskBladePo.clickCloseButton();
        });

        it('[3580]: Verify Comment Posted In Activity For Case', async () => {
            await activityTabPage.addActivityNote(addNoteBodyText);
            await activityTabPage.clearActivityNote();
            //bold
            await ckeditorOpsPo.clickOnBoldIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await ckeditorValidationPo.isBoldTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Bold Text is not get Bold In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isBoldTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Bold Text is missing in Activity');
            //italic
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.clickOnItalicIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await ckeditorValidationPo.isItalicTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not Italic In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isItalicTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Italic Text is missing In Activity');
            //underline
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.clickOnUnderLineIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await ckeditorValidationPo.isUnderlineTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not Underline In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isUnderlineTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Underline Text is missing In Activity');
            // left Align
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.clickOnLeftAlignIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await ckeditorValidationPo.isTextLeftAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not Left Align In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isLeftAlignTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Lefit Align Text is missing In Activity');
            //Right Align
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.clickOnRightAlignIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await ckeditorValidationPo.isTextRightAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not right Align In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isRightAlignTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Right Align Text is missing In Activity');
            //Center Align
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await ckeditorValidationPo.isTextCenterAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not center Align In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isCenterAlignTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Center Align is missing In Activity');
            //set color
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.selectColor('Strong Red');
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await ckeditorValidationPo.isColorTextDisplayedInCkEditorTextArea(addNoteBodyText, 'color:#c0392b;')).toBeTruthy('FailureMsg Color Text is missing in Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isColorTextDisplayedInActivity('color:#c0392b;', addNoteBodyText, 1)).toBeTruthy('FailureMsg Color Text is missing in Activity');
            //checking number list
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.setNumberList(['PlusOne']);
            expect(await ckeditorValidationPo.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('FailureMsg Number list is missing in Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isNumberListTextDisplayedInActivity('PlusOne', 1)).toBeTruthy('FailureMsg Number List Text is missing In Activity');
            // checking bullot points
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.setBulletList(['BulletOne']);
            expect(await ckeditorValidationPo.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('FailureMsg Text is not center Align In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isBulletListTextDisplayedInActivity('BulletOne', 1)).toBeTruthy('FailureMsg Bullet List Text is missing In Activity');
            // Link added
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('Google', 0);
            await linkPropertiesPo.setValueOfLinkProperties('www.google.com', 1);
            await linkPropertiesPo.clickOnOkBtn();
            expect(await ckeditorValidationPo.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('FailureMsg Link is missing in Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 1)).toBeTruthy('FailureMsg Link Text is missing In Activity');
            // Attach Image
            await activityTabPage.addActivityNote(addNoteBodyText);
            await activityTabPage.addAttachment(['../../data/ui/attachment/bwfPdf.pdf']);
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isAttachedFileNameDisplayed('bwfPdf.pdf')).toBeTruthy('FailureMsg Image missing in activity tab');
        });

        it('[3580]: Verify Comment Posted In Activity For Manual Task', async () => {
            // Goto Manual Task
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickTaskLink(manualTemplateData.templateSummary);
            await activityTabPage.addActivityNote(addNoteBodyText);
            await activityTabPage.clearActivityNote();
            //bold
            await ckeditorOpsPo.clickOnBoldIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await ckeditorValidationPo.isBoldTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Bold Text is not get Bold In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isBoldTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Bold Text is missing in Activity');
            //italic
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.clickOnItalicIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await ckeditorValidationPo.isItalicTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not Italic In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isItalicTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Italic Text is missing In Activity');
            //underline
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.clickOnUnderLineIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await ckeditorValidationPo.isUnderlineTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not Underline In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isUnderlineTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Underline Text is missing In Activity');
            // left Align
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.clickOnLeftAlignIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await ckeditorValidationPo.isTextLeftAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not Left Align In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isLeftAlignTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Lefit Align Text is missing In Activity');
            //Right Align
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.clickOnRightAlignIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await ckeditorValidationPo.isTextRightAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not right Align In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isRightAlignTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Right Align Text is missing In Activity');
            //Center Align
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await ckeditorValidationPo.isTextCenterAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not center Align In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isCenterAlignTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Center Align is missing In Activity');
            //set color
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.selectColor('Strong Red');
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await ckeditorValidationPo.isColorTextDisplayedInCkEditorTextArea(addNoteBodyText, 'color:#c0392b;')).toBeTruthy('FailureMsg Color Text is missing in Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isColorTextDisplayedInActivity('color:#c0392b;', addNoteBodyText, 1)).toBeTruthy('FailureMsg Color Text is missing in Activity');
            //checking number list
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.setNumberList(['PlusOne']);
            expect(await ckeditorValidationPo.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('FailureMsg Number list is missing in Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isNumberListTextDisplayedInActivity('PlusOne', 1)).toBeTruthy('FailureMsg Number List Text is missing In Activity');
            // checking bullot points
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.setBulletList(['BulletOne']);
            expect(await ckeditorValidationPo.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('FailureMsg Text is not center Align In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isBulletListTextDisplayedInActivity('BulletOne', 1)).toBeTruthy('FailureMsg Bullet List Text is missing In Activity');
            // Link added
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('Google', 0);
            await linkPropertiesPo.setValueOfLinkProperties('www.google.com', 1);
            await linkPropertiesPo.clickOnOkBtn();
            expect(await ckeditorValidationPo.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('FailureMsg Link is missing in Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 1)).toBeTruthy('FailureMsg Link Text is missing In Activity');
            // Attach Image
            await activityTabPage.addActivityNote(addNoteBodyText);
            await activityTabPage.addAttachment(['../../data/ui/attachment/bwfPdf.pdf']);
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isAttachedFileNameDisplayed('bwfPdf.pdf')).toBeTruthy('FailureMsg Image missing in activity tab');
            await viewTaskPo.clickOnViewCase();
        });

        it('[3580]: Verify Comment Posted In Activity For Automated Task', async () => {
            // Goto Automated Task
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickTaskLink(autoTemplateData.templateSummary);
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await ckeditorValidationPo.isCkEditorDisplayed()).toBeTruthy('FailureMsg CkEditor is missing');
            await activityTabPage.clearActivityNote();
            //bold
            await ckeditorOpsPo.clickOnBoldIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await ckeditorValidationPo.isBoldTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Bold Text is not get Bold In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isBoldTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Bold Text is missing in Activity');
            //italic
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.clickOnItalicIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await ckeditorValidationPo.isItalicTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not Italic In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isItalicTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Italic Text is missing In Activity');
            //underline
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.clickOnUnderLineIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await ckeditorValidationPo.isUnderlineTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not Underline In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isUnderlineTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Underline Text is missing In Activity');
            // left Align
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.clickOnLeftAlignIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await ckeditorValidationPo.isTextLeftAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not Left Align In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isLeftAlignTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Lefit Align Text is missing In Activity');
            //Right Align
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.clickOnRightAlignIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await ckeditorValidationPo.isTextRightAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not right Align In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isRightAlignTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Right Align Text is missing In Activity');
            //Center Align
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await ckeditorValidationPo.isTextCenterAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not center Align In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isCenterAlignTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Center Align is missing In Activity');
            //set color
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.selectColor('Strong Red');
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await ckeditorValidationPo.isColorTextDisplayedInCkEditorTextArea(addNoteBodyText, 'color:#c0392b;')).toBeTruthy('FailureMsg Color Text is missing in Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isColorTextDisplayedInActivity('color:#c0392b;', addNoteBodyText, 1)).toBeTruthy('FailureMsg Color Text is missing in Activity');
            //checking number list
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.setNumberList(['PlusOne']);
            expect(await ckeditorValidationPo.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('FailureMsg Number list is missing in Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isNumberListTextDisplayedInActivity('PlusOne', 1)).toBeTruthy('FailureMsg Number List Text is missing In Activity');
            // checking bullot points
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.setBulletList(['BulletOne']);
            expect(await ckeditorValidationPo.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('FailureMsg Text is not center Align In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isBulletListTextDisplayedInActivity('BulletOne', 1)).toBeTruthy('FailureMsg Bullet List Text is missing In Activity');
            // Link added
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('Google', 0);
            await linkPropertiesPo.setValueOfLinkProperties('www.google.com', 1);
            await linkPropertiesPo.clickOnOkBtn();
            expect(await ckeditorValidationPo.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('FailureMsg Link is missing in Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 1)).toBeTruthy('FailureMsg Link Text is missing In Activity');
            // Attach Image
            await activityTabPage.addActivityNote(addNoteBodyText);
            await activityTabPage.addAttachment(['../../data/ui/attachment/bwfPdf.pdf']);
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isAttachedFileNameDisplayed('bwfPdf.pdf')).toBeTruthy('FailureMsg Image missing in activity tab');
            await viewTaskPo.clickOnViewCase();
        });

        it('[3580]: Verify Comment Posted In Activity For External Task', async () => {
            // Goto External Task
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickTaskLink(externalTemplateData.templateSummary);
            await activityTabPage.addActivityNote(addNoteBodyText);
            await activityTabPage.clearActivityNote();
            //bold
            await ckeditorOpsPo.clickOnBoldIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await ckeditorValidationPo.isBoldTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Bold Text is not get Bold In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isBoldTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Bold Text is missing in Activity');
            //italic
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.clickOnItalicIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await ckeditorValidationPo.isItalicTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not Italic In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isItalicTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Italic Text is missing In Activity');
            //underline
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.clickOnUnderLineIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await ckeditorValidationPo.isUnderlineTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not Underline In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isUnderlineTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Underline Text is missing In Activity');
            // left Align
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.clickOnLeftAlignIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await ckeditorValidationPo.isTextLeftAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not Left Align In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isLeftAlignTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Lefit Align Text is missing In Activity');
            //Right Align
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.clickOnRightAlignIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await ckeditorValidationPo.isTextRightAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not right Align In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isRightAlignTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Right Align Text is missing In Activity');
            //Center Align
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await ckeditorValidationPo.isTextCenterAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not center Align In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isCenterAlignTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Center Align is missing In Activity');
            //set color
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.selectColor('Strong Red');
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await ckeditorValidationPo.isColorTextDisplayedInCkEditorTextArea(addNoteBodyText, 'color:#c0392b;')).toBeTruthy('FailureMsg Color Text is missing in Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isColorTextDisplayedInActivity('color:#c0392b;', addNoteBodyText, 1)).toBeTruthy('FailureMsg Color Text is missing in Activity');
            //checking number list
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.setNumberList(['PlusOne']);
            expect(await ckeditorValidationPo.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('FailureMsg Number list is missing in Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isNumberListTextDisplayedInActivity('PlusOne', 1)).toBeTruthy('FailureMsg Number List Text is missing In Activity');
            // checking bullot points
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.setBulletList(['BulletOne']);
            expect(await ckeditorValidationPo.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('FailureMsg Text is not center Align In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isBulletListTextDisplayedInActivity('BulletOne', 1)).toBeTruthy('FailureMsg Bullet List Text is missing In Activity');
            // Link added
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('Google', 0);
            await linkPropertiesPo.setValueOfLinkProperties('www.google.com', 1);
            await linkPropertiesPo.clickOnOkBtn();
            expect(await ckeditorValidationPo.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('FailureMsg Link is missing in Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 1)).toBeTruthy('FailureMsg Link Text is missing In Activity');
            // Attach Image
            await activityTabPage.addActivityNote(addNoteBodyText);
            await activityTabPage.addAttachment(['../../data/ui/attachment/bwfPdf.pdf']);
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isAttachedFileNameDisplayed('bwfPdf.pdf')).toBeTruthy('FailureMsg Image missing in activity tab');
            await viewTaskPo.clickOnViewCase();
        });

        it('[3580]: Verify Comment Posted In Activity For Adhoc Task', async () => {
            // Goto Adhoc Task
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickAddAdhocTaskButton();
            expect(await adhoctaskTemplate.isAttachmentButtonDisplayed()).toBeTruthy();
            await adhoctaskTemplate.setSummary(adhocTaskSummary);
            await adhoctaskTemplate.setDescription("Description");
            await adhoctaskTemplate.clickAssignToMeButton();
            await adhoctaskTemplate.clickSaveAdhoctask();
            await utilityCommon.closePopUpMessage();
            await manageTaskBladePo.clickCloseButton();
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickTaskLink(adhocTaskSummary);
            await activityTabPage.addActivityNote(addNoteBodyText);
            await activityTabPage.clearActivityNote();
            //bold
            await ckeditorOpsPo.clickOnBoldIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await ckeditorValidationPo.isBoldTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Bold Text is not get Bold In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isBoldTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Bold Text is missing in Activity');
            //italic
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.clickOnItalicIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await ckeditorValidationPo.isItalicTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not Italic In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isItalicTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Italic Text is missing In Activity');
            //underline
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.clickOnUnderLineIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await ckeditorValidationPo.isUnderlineTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not Underline In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isUnderlineTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Underline Text is missing In Activity');
            // left Align
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.clickOnLeftAlignIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await ckeditorValidationPo.isTextLeftAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not Left Align In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isLeftAlignTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Lefit Align Text is missing In Activity');
            //Right Align
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.clickOnRightAlignIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await ckeditorValidationPo.isTextRightAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not right Align In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isRightAlignTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Right Align Text is missing In Activity');
            //Center Align
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await ckeditorValidationPo.isTextCenterAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not center Align In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isCenterAlignTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Center Align is missing In Activity');
            //set color
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.selectColor('Strong Red');
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await ckeditorValidationPo.isColorTextDisplayedInCkEditorTextArea(addNoteBodyText, 'color:#c0392b;')).toBeTruthy('FailureMsg Color Text is missing in Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isColorTextDisplayedInActivity('color:#c0392b;', addNoteBodyText, 1)).toBeTruthy('FailureMsg Color Text is missing in Activity');
            //checking number list
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.setNumberList(['PlusOne']);
            expect(await ckeditorValidationPo.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('FailureMsg Number list is missing in Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isNumberListTextDisplayedInActivity('PlusOne', 1)).toBeTruthy('FailureMsg Number List Text is missing In Activity');
            // checking bullot points
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.setBulletList(['BulletOne']);
            expect(await ckeditorValidationPo.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('FailureMsg Text is not center Align In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isBulletListTextDisplayedInActivity('BulletOne', 1)).toBeTruthy('FailureMsg Bullet List Text is missing In Activity');
            // Link added
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('Google', 0);
            await linkPropertiesPo.setValueOfLinkProperties('www.google.com', 1);
            await linkPropertiesPo.clickOnOkBtn();
            expect(await ckeditorValidationPo.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('FailureMsg Link is missing in Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 1)).toBeTruthy('FailureMsg Link Text is missing In Activity');
            // Attach Image
            await activityTabPage.addActivityNote(addNoteBodyText);
            await activityTabPage.addAttachment(['../../data/ui/attachment/bwfPdf.pdf']);
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isAttachedFileNameDisplayed('bwfPdf.pdf')).toBeTruthy('FailureMsg Image missing in activity tab');
        });

        it('[3580]: Verify Comment Posted In Activity For knowledge Article', async () => {
            // Create knowledge Article task template
            await navigationPage.gotoKnowledgeConsole();
            await knowledgeArticlesConsolePo.searchAndOpenKnowledgeArticle(knowledgeArticleData.displayId);
            expect(await viewKnowledgeArticlePo.isEditLinkDisplayedOnKA()).toBeTruthy('FailureMsg KA Edit link is missing');

            await viewKnowledgeArticlePo.clickOnActivityTab();
            await activityTabPage.addActivityNote(addNoteBodyText);
            await activityTabPage.clearActivityNote();
            //bold
            await ckeditorOpsPo.clickOnBoldIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await ckeditorValidationPo.isBoldTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Bold Text is not get Bold In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isBoldTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Bold Text is missing in Activity');
            //italic
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.clickOnItalicIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await ckeditorValidationPo.isItalicTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not Italic In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isItalicTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Italic Text is missing In Activity');
            //underline
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.clickOnUnderLineIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await ckeditorValidationPo.isUnderlineTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not Underline In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isUnderlineTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Underline Text is missing In Activity');
            // left Align
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.clickOnLeftAlignIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await ckeditorValidationPo.isTextLeftAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not Left Align In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isLeftAlignTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Lefit Align Text is missing In Activity');
            //Right Align
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.clickOnRightAlignIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await ckeditorValidationPo.isTextRightAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not right Align In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isRightAlignTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Right Align Text is missing In Activity');
            //Center Align
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await ckeditorValidationPo.isTextCenterAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not center Align In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isCenterAlignTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Center Align is missing In Activity');
            //set color
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.selectColor('Strong Red');
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await ckeditorValidationPo.isColorTextDisplayedInCkEditorTextArea(addNoteBodyText, 'color:#c0392b;')).toBeTruthy('FailureMsg Color Text is missing in Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isColorTextDisplayedInActivity('color:#c0392b;', addNoteBodyText, 1)).toBeTruthy('FailureMsg Color Text is missing in Activity');
            //checking number list
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.setNumberList(['PlusOne']);
            expect(await ckeditorValidationPo.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('FailureMsg Number list is missing in Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isNumberListTextDisplayedInActivity('PlusOne', 1)).toBeTruthy('FailureMsg Number List Text is missing In Activity');
            // checking bullot points
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.setBulletList(['BulletOne']);
            expect(await ckeditorValidationPo.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('FailureMsg Text is not center Align In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isBulletListTextDisplayedInActivity('BulletOne', 1)).toBeTruthy('FailureMsg Bullet List Text is missing In Activity');
            // Link added
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('Google', 0);
            await linkPropertiesPo.setValueOfLinkProperties('www.google.com', 1);
            await linkPropertiesPo.clickOnOkBtn();
            expect(await ckeditorValidationPo.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('FailureMsg Link is missing in Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 1)).toBeTruthy('FailureMsg Link Text is missing In Activity');
            // Attach Image
            await activityTabPage.addActivityNote(addNoteBodyText);
            await activityTabPage.addAttachment(['../../data/ui/attachment/bwfPdf.pdf']);
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isAttachedFileNameDisplayed('bwfPdf.pdf')).toBeTruthy('FailureMsg Image missing in activity tab');
        });

        it('[3580]: Login in with Assignee User And Navigate to Person Profile', async () => {
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await caseConsolePo.searchAndOpenCase(newCase.displayId);
            expect(await viewCasePo.getCaseID()).toBe(newCase.displayId, 'Case Id is missing');
            // Profile View CK Editor
            await utilityCommon.closePopUpMessage();
            await activityTabPage.clickOnRefreshButton();
            await activityTabPage.clickOnHyperlinkFromActivity(2, 'Qadim Katawazi');
            await browser.sleep(2000); // wait until page navigate to person profile in new tab
            await utilityCommon.closePopUpMessage();
        });

        it('[3580]: Verify Comment Posted In Activity For Person Profile', async () => {
            await activityTabPage.addActivityNote(addNoteBodyText);
            await activityTabPage.clearActivityNote();
            //bold
            await ckeditorOpsPo.clickOnBoldIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await ckeditorValidationPo.isBoldTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Bold Text is not get Bold In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isBoldTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Bold Text is missing in Activity');
            //italic
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.clickOnItalicIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await ckeditorValidationPo.isItalicTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not Italic In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isItalicTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Italic Text is missing In Activity');
            //underline
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.clickOnUnderLineIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await ckeditorValidationPo.isUnderlineTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not Underline In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isUnderlineTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Underline Text is missing In Activity');
            // left Align
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.clickOnLeftAlignIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await ckeditorValidationPo.isTextLeftAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not Left Align In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isLeftAlignTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Lefit Align Text is missing In Activity');
            //Right Align
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.clickOnRightAlignIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await ckeditorValidationPo.isTextRightAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not right Align In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isRightAlignTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Right Align Text is missing In Activity');
            //Center Align
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await ckeditorValidationPo.isTextCenterAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('FailureMsg Text is not center Align In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isCenterAlignTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg Center Align is missing In Activity');
            //set color
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.selectColor('Strong Red');
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await ckeditorValidationPo.isColorTextDisplayedInCkEditorTextArea(addNoteBodyText, 'color:#c0392b;')).toBeTruthy('FailureMsg Color Text is missing in Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isColorTextDisplayedInActivity('color:#c0392b;', addNoteBodyText, 1)).toBeTruthy('FailureMsg Color Text is missing in Activity');
            //checking number list
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.setNumberList(['PlusOne']);
            expect(await ckeditorValidationPo.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('FailureMsg Number list is missing in Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isNumberListTextDisplayedInActivity('PlusOne', 1)).toBeTruthy('FailureMsg Number List Text is missing In Activity');
            // checking bullot points
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.setBulletList(['BulletOne']);
            expect(await ckeditorValidationPo.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('FailureMsg Text is not center Align In Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isBulletListTextDisplayedInActivity('BulletOne', 1)).toBeTruthy('FailureMsg Bullet List Text is missing In Activity');
            // Link added
            await activityTabPage.clickActivityNoteTextBox();
            await ckeditorOpsPo.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('Google', 0);
            await linkPropertiesPo.setValueOfLinkProperties('www.google.com', 1);
            await linkPropertiesPo.clickOnOkBtn();
            expect(await ckeditorValidationPo.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('FailureMsg Link is missing in Ck Editor');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 1)).toBeTruthy('FailureMsg Link Text is missing In Activity');
            // Attach Image
            await activityTabPage.addActivityNote(addNoteBodyText);
            await activityTabPage.addAttachment(['../../data/ui/attachment/bwfPdf.pdf']);
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isAttachedFileNameDisplayed('bwfPdf.pdf')).toBeTruthy('FailureMsg Image missing in activity tab');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //kgaikwad
    describe('[3579]: Verify the Comments posted in activity with notes template', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let notesTemplateNameRandStr = 'notesTemplateDRDMV21620' + randomStr;
        let adhocTaskSummary = 'adhocTaskSummaryDRDMV21620' + randomStr;
        let knowledgeArticle = 'knowledgeArticleDRDMV21620' + randomStr;
        let manualTemplateData;
        let autoTemplateData;
        let externalTemplateData;
        let knowledgeArticleData;
        let notesTemplateCaseData;
        let notesTemplateTaskData;
        let notesTemplatePeopleData;
        let notesTemplateKnowledgeData;
        let newCase;

        beforeAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            // Create manual task template
            manualTemplateData = {
                "templateName": "DRDMV21620Template" + randomStr,
                "templateSummary": "DRDMV21620ManualTaskTemplateSummary" + randomStr,
                "templateStatus": "Active",
                "taskCompany": '- Global -',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Canada Support",
                "ownerGroup": "CA Support 1"

            }
            await apiHelper.createManualTaskTemplate(manualTemplateData);

            // Create automated task template
            autoTemplateData = {
                "templateName": "DRDMV21620AutoTaskTemplate" + randomStr,
                "templateSummary": "DRDMV21620AutoTaskTemplateSummary" + randomStr,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": `Case Process ${randomStr}`,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Canada Support",
                "ownerGroup": "CA Support 1"
            }
            await apiHelper.createAutomatedTaskTemplate(autoTemplateData);

            // For External
            externalTemplateData = {
                "templateName": "DRDMV21620ExternalTaskTemplateName" + randomStr,
                "templateSummary": "DRDMV21620ExternalTaskTemplateSummary" + randomStr,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Canada Support",
                "ownerGroup": "CA Support 1"
            }
            await apiHelper.createExternalTaskTemplate(externalTemplateData);

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
            knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
            let knowledgeArticleGUID = knowledgeArticleData.id;
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'Draft')).toBeTruthy('FailureMsg Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'PublishApproval', 'qdu', 'CA Support 1', 'Petramco')).toBeTruthy('FailureMsg Status Not Set');

            // Create Case Notes Template
            notesTemplateCaseData = NOTES_TEMPLATE_MANDATORY_FIELD;
            notesTemplateTaskData = NOTES_TEMPLATE_TASK;
            notesTemplatePeopleData = NOTES_TEMPLATE_PEOPLE;
            notesTemplateKnowledgeData = NOTES_TEMPLATE_KNOWLEDGE_ARTICLE;

            notesTemplateCaseData.body = notesTemplateCaseData.body + randomStr;
            notesTemplateCaseData.templateName = notesTemplateCaseData.templateName + notesTemplateNameRandStr;
            await apiHelper.createNotesTemplate("Case", notesTemplateCaseData);
            console.log('Case', notesTemplateCaseData.templateName);
            // Create people Notes Template
            notesTemplatePeopleData.body = notesTemplatePeopleData.body + randomStr;
            notesTemplatePeopleData.templateName = notesTemplatePeopleData.templateName + notesTemplateNameRandStr;
            await apiHelper.createNotesTemplate("People", notesTemplatePeopleData);
            console.log('People', notesTemplatePeopleData.templateName);
            // Create Task Notes Template
            notesTemplateTaskData.body = notesTemplateTaskData.body + randomStr;
            notesTemplateTaskData.templateName = notesTemplateTaskData.templateName + notesTemplateNameRandStr;
            await apiHelper.createNotesTemplate("Task", notesTemplateTaskData);
            console.log('Task', notesTemplateTaskData.templateName);
            // Create knowledge Notes Template
            notesTemplateKnowledgeData.body = notesTemplateKnowledgeData.body + randomStr;
            notesTemplateKnowledgeData.templateName = notesTemplateKnowledgeData.templateName + notesTemplateNameRandStr;
            await apiHelper.createNotesTemplate("Knowledge", notesTemplateKnowledgeData);
            console.log('Knowledge', notesTemplateKnowledgeData.templateName);

            // Create Case
            let caseData = {
                "Requester": "qtao",
                "Summary": "3579_TC",
                "Assigned Company": "Petramco",
                "Business Unit": "Canada Support",
                "Support Group": "CA Support 1",
                "Assignee": "qdu"
            }
            newCase = await apiHelper.createCase(caseData);
            await apiHelper.updateCaseStatus(newCase.id, 'InProgress');
        });

        it('[3579]: Open Case And Add Task Into', async () => {
            await caseConsolePo.searchAndOpenCase(newCase.displayId);
            expect(await viewCasePo.getTextOfStatus()).toBe('In Progress');
            // Adding Task
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.addTaskFromTaskTemplate(manualTemplateData.templateSummary,1);
            expect (await manageTaskBladePo.isTaskLinkPresent(manualTemplateData.templateSummary)).toBeTruthy(`${manualTemplateData.templateSummary} missing task link`);
            await manageTaskBladePo.addTaskFromTaskTemplate(autoTemplateData.templateSummary,2);
            expect (await manageTaskBladePo.isTaskLinkPresent(autoTemplateData.templateSummary)).toBeTruthy(`${autoTemplateData.templateSummary} missing task link`);
            await manageTaskBladePo.addTaskFromTaskTemplate(externalTemplateData.templateSummary,3);
            await utilityCommon.closePopUpMessage();
            expect (await manageTaskBladePo.isTaskLinkPresent(externalTemplateData.templateSummary)).toBeTruthy(`${externalTemplateData.templateSummary} missing task link`);
            await manageTaskBladePo.clickCloseButton();
        });
        it('[3579]: Verify the Comments posted in activity with notes template For Case ', async () => {
            // Verify Case Notes Template
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(notesTemplateCaseData.templateName);
            expect(await ckeditorValidationPo.getTextCkEditorTextArea()).toContain(notesTemplateCaseData.body);
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isTextPresentInNote(notesTemplateCaseData.body)).toBeTruthy('FailureMsg Note Template is missing in activity');
        });

        it('[3579]: Verify the Comments posted in activity with notes template For Person Profile ', async () => {
            // Profile View CK Editor
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await caseConsolePo.searchAndOpenCase(newCase.displayId);
            await activityTabPage.clickOnRefreshButton();
            await activityTabPage.clickOnHyperlinkFromActivity(2, 'Qadim Katawazi');
            await browser.sleep(2000); // wait until page navigate to person profile in new tab
            await utilityCommon.closePopUpMessage();
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(notesTemplatePeopleData.templateName);
            expect(await ckeditorValidationPo.getTextCkEditorTextArea()).toContain(notesTemplatePeopleData.body);
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isTextPresentInNote(notesTemplatePeopleData.body)).toBeTruthy('FailureMsg Note Template is missing in activity');
        });
        it('[3579]: Verify the Comments posted in activity with notes template For Manual Task ', async () => {
            // Goto Manual Task
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(newCase.displayId);
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickTaskLink(manualTemplateData.templateSummary);
            await viewTaskPo.clickOnChangeStatus();
            await viewTaskPo.changeTaskStatus('Completed');
            await updateStatusBladePo.selectStatusReason('Successful');
            await updateStatusBladePo.clickSaveStatus();
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(notesTemplateTaskData.templateName);
            expect(await ckeditorValidationPo.getTextCkEditorTextArea()).toContain(notesTemplateTaskData.body);
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isTextPresentInNote(notesTemplateTaskData.body)).toBeTruthy('FailureMsg Note Template is missing in activity');
            await viewTaskPo.clickOnViewCase();
        });
        it('[3579]: Verify the Comments posted in activity with notes template For Automated Task ', async () => {
            // Goto Automated Task
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickTaskLink(autoTemplateData.templateSummary);
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(notesTemplateTaskData.templateName);
            expect(await ckeditorValidationPo.getTextCkEditorTextArea()).toContain(notesTemplateTaskData.body);
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isTextPresentInNote(notesTemplateTaskData.body)).toBeTruthy('FailureMsg Note Template is missing in activity');
            await viewTaskPo.clickOnViewCase();
        });
        it('[3579]: Verify the Comments posted in activity with notes template For External Task ', async () => {
            // Goto External Task
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickTaskLink(externalTemplateData.templateSummary);
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(notesTemplateTaskData.templateName);
            expect(await ckeditorValidationPo.getTextCkEditorTextArea()).toContain(notesTemplateTaskData.body);
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isTextPresentInNote(notesTemplateTaskData.body)).toBeTruthy('FailureMsg Note Template is missing in activity');
            await viewTaskPo.clickOnViewCase();
        });
        it('[3579]: Verify the Comments posted in activity with notes template For Adhoc Task ', async () => {
            // Goto Adhoc Task
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickAddAdhocTaskButton();
            expect(await adhoctaskTemplate.isAttachmentButtonDisplayed()).toBeTruthy();
            await adhoctaskTemplate.setSummary(adhocTaskSummary);
            await adhoctaskTemplate.setDescription("Description");
            await adhoctaskTemplate.clickAssignToMeButton();
            await adhoctaskTemplate.clickSaveAdhoctask();
            await utilityCommon.closePopUpMessage();
            await manageTaskBladePo.waitUntilNumberOfTaskLinkAppear(4);
            await manageTaskBladePo.clickTaskLink(adhocTaskSummary);

            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(notesTemplateTaskData.templateName);
            expect(await ckeditorValidationPo.getTextCkEditorTextArea()).toContain(notesTemplateTaskData.body);
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isTextPresentInNote(notesTemplateTaskData.body)).toBeTruthy('FailureMsg Note Template is missing in activity');
        });
        it('[3579]: Verify the Comments posted in activity with notes template For knowledge Article ', async () => {
            // Create knowledge Article task template
            await navigationPage.gotoKnowledgeConsole();
            await utilityGrid.searchAndOpenHyperlink(knowledgeArticleData.displayId);
            expect(await viewKnowledgeArticlePo.isEditLinkDisplayedOnKA()).toBeTruthy('FailureMsg KA Edit link is missing');
            await viewKnowledgeArticlePo.clickOnActivityTab();

            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(notesTemplateKnowledgeData.templateName);
            expect(await ckeditorValidationPo.getTextCkEditorTextArea()).toContain(notesTemplateKnowledgeData.body);
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isTextPresentInNote(notesTemplateKnowledgeData.body)).toBeTruthy('FailureMsg Note Template is missing in activity');
        });
    });
});
