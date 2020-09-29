import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import caseConsolePo from '../../pageobject/case/case-console.po';
import viewCasePo from '../../pageobject/case/view-case.po';
import linkPropertiesPo from '../../pageobject/common/ck-editor/link-properties.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import knowledgeArticlesConsolePo from '../../pageobject/knowledge/knowledge-articles-console.po';
import viewKnowledgeArticlePo from '../../pageobject/knowledge/view-knowledge-article.po';
import { default as activityTabPage } from '../../pageobject/social/activity-tab.po';
import adhoctaskTemplate from "../../pageobject/task/create-adhoc-task.po";
import manageTaskBladePo from '../../pageobject/task/manage-task-blade.po';
import viewTaskPo from '../../pageobject/task/view-task.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';

describe('Case Activity CKE Styling', () => {

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    describe('[DRDMV-21617,DRDMV-21618]: Search and UI Validation of document library search view', async () => {
        let randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');

        let summary = 'summaryDRDMV21617' + randomStr;
        let addNoteBodyText = 'addNoteBodyTextDRDMV21617' + randomStr;
        let adhocTaskSummary = 'adhocTaskSummaryDRDMV21617' + randomStr;
        let knowledgeArticle = 'knowledgeArticleDRDMV21617' + randomStr;
        let manualTemplateData;
        let autoTemplateData;
        let externalTemplateData;
        let knowledgeArticleData;
        let newCase;

        beforeAll(async () => {
            // Create manual task template
            manualTemplateData = {
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

            // Create automated task template
            autoTemplateData = {
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

            // For External
            externalTemplateData = {
                "templateName": "DRDMV-21617 external task template name" + summary,
                "templateSummary": "DRDMV-21617 external task template summary" + summary,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            await apiHelper.createExternalTaskTemplate(externalTemplateData);

            // Create Case
            let caseData = {
                "Requester": "qtao",
                "Summary": "DRDMV-21617_TC",
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
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'Draft')).toBeTruthy('Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'PublishApproval', 'qdu', 'CA Support 1', 'Petramco')).toBeTruthy('Status Not Set');
        });
        it('[DRDMV-21617,DRDMV-21618]: Open Case And Add Tasks From Case', async () => {
            await caseConsolePo.searchAndOpenCase(newCase.displayId);
            // Adding Task
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.addTaskFromTaskTemplate(manualTemplateData.templateSummary);
            await manageTaskBladePo.addTaskFromTaskTemplate(autoTemplateData.templateSummary);
            await manageTaskBladePo.addTaskFromTaskTemplate(externalTemplateData.templateSummary);
            await manageTaskBladePo.clickCloseButton();
        });

        it('[DRDMV-21617,DRDMV-21618]: Verify CkEditor On Case With Activity Tab', async () => {
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isCkEditorDisplayed()).toBeTruthy('CkEditor is missing');
            await activityTabPage.clearActivityNote();
            // bold
            await activityTabPage.clickOnBoldIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isBoldTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('Text is not get Bold In Ck Editor');
            await activityTabPage.clickOnBoldIcon();
            await activityTabPage.clearActivityNote();
            //italic
            await activityTabPage.clickOnItalicIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isItalicTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('Text is not Italic In Ck Editor');
            await activityTabPage.clickOnItalicIcon();
            await activityTabPage.clearActivityNote();
            //underline
            await activityTabPage.clickOnUnderLineIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isUnderlineTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('Text is not Underline In Ck Editor');
            await activityTabPage.clickOnUnderLineIcon();
            await activityTabPage.clearActivityNote();
            //left Align
            await activityTabPage.clickOnLeftAlignIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isTextLeftAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('Text is not Left Align In Ck Editor');
            await activityTabPage.clearActivityNote();
            //Right Align
            await activityTabPage.clickOnRightAlignIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isTextRightAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('Text is not right Align In Ck Editor');
            await activityTabPage.clickOnRightAlignIcon();
            await activityTabPage.clearActivityNote();
            //Center Align
            await activityTabPage.clickOnCenterAlignIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isTextCenterAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('Text is not center Align In Ck Editor');
            await activityTabPage.clickOnCenterAlignIcon();
            await activityTabPage.clearActivityNote();
            //set color
            await activityTabPage.selectColor('Strong Red');
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isColorTextDisplayedInCkEditorTextArea('color:#c0392b;', addNoteBodyText)).toBeTruthy('Color is not set In Ck Editor');
            await activityTabPage.clearActivityNote();
            //checking number list
            await activityTabPage.setNumberList('PlusOne');
            expect(await activityTabPage.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('Text is not center Align In Ck Editor');
            await activityTabPage.clickOnCenterAlignIcon();
            await activityTabPage.clearActivityNote();
            // checking bullot points
            await activityTabPage.setBulletList('BulletOne');
            expect(await activityTabPage.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('Text is not center Align In Ck Editor');
            await activityTabPage.clearActivityNote();
            // Link added
            await activityTabPage.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('Google', 0);
            await linkPropertiesPo.setValueOfLinkProperties('www.google.com', 1);
            await linkPropertiesPo.clickOnOkBtn();
            expect(await activityTabPage.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('Text is not center Align In Ck Editor');
            await activityTabPage.clickOnPostButton();

            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.getTextCkEditorMinimizeOrMiximize()).toBe('Maximize');
            await activityTabPage.clickMaximizeMinimizeIcon();
            expect(await activityTabPage.getTextCkEditorMinimizeOrMiximize()).toBe('Minimize');
            await activityTabPage.clickMaximizeMinimizeIcon();
            await activityTabPage.clickPublicCheckbox();
            expect(await activityTabPage.isPublicCheckBoxToolTipIconDisplayed()).toBeTruthy('Public checkbox tool tip missing');
            await activityTabPage.clickOnCancelButton();
            await activityTabPage.clickActivityNoteTextBox();
            expect(await activityTabPage.getTextCkEditorTextArea()).toBe('');
        });

        it('[DRDMV-21617,DRDMV-21618]: Verify CkEditor On Manual Task With Activity Tab', async () => {
            // Goto Manual Task
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(newCase.displayId);
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickTaskLink(manualTemplateData.templateSummary);
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isCkEditorDisplayed()).toBeTruthy('CkEditor is missing');
            //bold
            await activityTabPage.clickOnBoldIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isBoldTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('Text is not get Bold In Ck Editor');
            await activityTabPage.clickOnBoldIcon();
            await activityTabPage.clearActivityNote();
            //italic
            await activityTabPage.clickOnItalicIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isItalicTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('Text is not Italic In Ck Editor');
            await activityTabPage.clickOnItalicIcon();
            await activityTabPage.clearActivityNote();
            //underline
            await activityTabPage.clickOnUnderLineIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isUnderlineTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('Text is not Underline In Ck Editor');
            await activityTabPage.clickOnUnderLineIcon();
            await activityTabPage.clearActivityNote();
            //left Align
            await activityTabPage.clickOnLeftAlignIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isTextLeftAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('Text is not Left Align In Ck Editor');
            await activityTabPage.clearActivityNote();
            //Right Align
            await activityTabPage.clickOnRightAlignIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isTextRightAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('Text is not right Align In Ck Editor');
            await activityTabPage.clickOnRightAlignIcon();
            await activityTabPage.clearActivityNote();
            //Center Align
            await activityTabPage.clickOnCenterAlignIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isTextCenterAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('Text is not center Align In Ck Editor');
            await activityTabPage.clickOnCenterAlignIcon();
            await activityTabPage.clearActivityNote();
            //set color
            await activityTabPage.selectColor('Strong Red');
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isColorTextDisplayedInCkEditorTextArea('color:#c0392b;', addNoteBodyText)).toBeTruthy('Text is not center Align In Ck Editor');
            await activityTabPage.clearActivityNote();
            //checking number list
            await activityTabPage.setNumberList('PlusOne');
            expect(await activityTabPage.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('Text is not center Align In Ck Editor');
            await activityTabPage.clickOnCenterAlignIcon();
            await activityTabPage.clearActivityNote();
            // checking bullot points
            await activityTabPage.setBulletList('BulletOne');
            expect(await activityTabPage.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('Text is not center Align In Ck Editor');
            await activityTabPage.clearActivityNote();
            // Link added
            await activityTabPage.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('Google', 0);
            await linkPropertiesPo.setValueOfLinkProperties('www.google.com', 1);
            await linkPropertiesPo.clickOnOkBtn();
            expect(await activityTabPage.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('Text is not center Align In Ck Editor');
            await activityTabPage.clickOnPostButton();

            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.getTextCkEditorMinimizeOrMiximize()).toBe('Maximize');
            await activityTabPage.clickMaximizeMinimizeIcon();
            expect(await activityTabPage.getTextCkEditorMinimizeOrMiximize()).toBe('Minimize');
            await activityTabPage.clickMaximizeMinimizeIcon();
            await activityTabPage.clickPublicCheckbox();
            expect(await activityTabPage.isPublicCheckBoxToolTipIconDisplayed()).toBeTruthy('Public checkbox tool tip missing');
            await activityTabPage.clickOnCancelButton();
            await activityTabPage.clickActivityNoteTextBox();
            expect(await activityTabPage.getTextCkEditorTextArea()).toBe('');
            await viewTaskPo.clickOnViewCase();
        });

        it('[DRDMV-21617,DRDMV-21618]: Verify CkEditor On Automated Task With Activity Tab', async () => {
            // Goto Automated Task
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickTaskLink(autoTemplateData.templateSummary);
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isCkEditorDisplayed()).toBeTruthy('CkEditor is missing');
            //bold
            await activityTabPage.clickOnBoldIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isBoldTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('Text is not get Bold In Ck Editor');
            await activityTabPage.clickOnBoldIcon();
            await activityTabPage.clearActivityNote();
            //italic
            await activityTabPage.clickOnItalicIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isItalicTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('Text is not Italic In Ck Editor');
            await activityTabPage.clickOnItalicIcon();
            await activityTabPage.clearActivityNote();
            //underline
            await activityTabPage.clickOnUnderLineIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isUnderlineTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('Text is not Underline In Ck Editor');
            await activityTabPage.clickOnUnderLineIcon();
            await activityTabPage.clearActivityNote();
            //left Align
            await activityTabPage.clickOnLeftAlignIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isTextLeftAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('Text is not Left Align In Ck Editor');
            await activityTabPage.clearActivityNote();
            //Right Align
            await activityTabPage.clickOnRightAlignIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isTextRightAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('Text is not right Align In Ck Editor');
            await activityTabPage.clickOnRightAlignIcon();
            await activityTabPage.clearActivityNote();
            //Center Align
            await activityTabPage.clickOnCenterAlignIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isTextCenterAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('Text is not center Align In Ck Editor');
            await activityTabPage.clickOnCenterAlignIcon();
            await activityTabPage.clearActivityNote();
            //set color
            await activityTabPage.selectColor('Strong Red');
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isColorTextDisplayedInCkEditorTextArea('color:#c0392b;', addNoteBodyText)).toBeTruthy('Text is not center Align In Ck Editor');
            await activityTabPage.clearActivityNote();
            //checking number list
            await activityTabPage.setNumberList('PlusOne');
            expect(await activityTabPage.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('Text is not center Align In Ck Editor');
            await activityTabPage.clickOnCenterAlignIcon();
            await activityTabPage.clearActivityNote();
            // checking bullot points
            await activityTabPage.setBulletList('BulletOne');
            expect(await activityTabPage.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('Text is not center Align In Ck Editor');
            await activityTabPage.clearActivityNote();
            // Link added
            await activityTabPage.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('Google', 0);
            await linkPropertiesPo.setValueOfLinkProperties('www.google.com', 1);
            await linkPropertiesPo.clickOnOkBtn();
            expect(await activityTabPage.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('Text is not center Align In Ck Editor');
            await activityTabPage.clickOnPostButton();

            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.getTextCkEditorMinimizeOrMiximize()).toBe('Maximize');
            await activityTabPage.clickMaximizeMinimizeIcon();
            expect(await activityTabPage.getTextCkEditorMinimizeOrMiximize()).toBe('Minimize');
            await activityTabPage.clickMaximizeMinimizeIcon();
            await activityTabPage.clickPublicCheckbox();
            expect(await activityTabPage.isPublicCheckBoxToolTipIconDisplayed()).toBeTruthy('Public checkbox tool tip missing');
            await activityTabPage.clickOnCancelButton();
            await activityTabPage.clickActivityNoteTextBox();
            expect(await activityTabPage.getTextCkEditorTextArea()).toBe('');
            await viewTaskPo.clickOnViewCase();
        });

        it('[DRDMV-21617,DRDMV-21618]: Verify CkEditor On External Task With Activity Tab', async () => {
            // Goto External Task
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickTaskLink(externalTemplateData.templateSummary);
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isCkEditorDisplayed()).toBeTruthy('CkEditor is missing');
            //bold
            await activityTabPage.clickOnBoldIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isBoldTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('Text is not get Bold In Ck Editor');
            await activityTabPage.clickOnBoldIcon();
            await activityTabPage.clearActivityNote();
            //italic
            await activityTabPage.clickOnItalicIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isItalicTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('Text is not Italic In Ck Editor');
            await activityTabPage.clickOnItalicIcon();
            await activityTabPage.clearActivityNote();
            //underline
            await activityTabPage.clickOnUnderLineIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isUnderlineTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('Text is not Underline In Ck Editor');
            await activityTabPage.clickOnUnderLineIcon();
            await activityTabPage.clearActivityNote();
            //left Align
            await activityTabPage.clickOnLeftAlignIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isTextLeftAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('Text is not Left Align In Ck Editor');
            await activityTabPage.clearActivityNote();
            //Right Align
            await activityTabPage.clickOnRightAlignIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isTextRightAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('Text is not right Align In Ck Editor');
            await activityTabPage.clickOnRightAlignIcon();
            await activityTabPage.clearActivityNote();
            //Center Align
            await activityTabPage.clickOnCenterAlignIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isTextCenterAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('Text is not center Align In Ck Editor');
            await activityTabPage.clickOnCenterAlignIcon();
            await activityTabPage.clearActivityNote();
            //set color
            await activityTabPage.selectColor('Strong Red');
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isColorTextDisplayedInCkEditorTextArea('color:#c0392b;', addNoteBodyText)).toBeTruthy('Text is not center Align In Ck Editor');
            await activityTabPage.clearActivityNote();
            //checking number list
            await activityTabPage.setNumberList('PlusOne');
            expect(await activityTabPage.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('Text is not center Align In Ck Editor');
            await activityTabPage.clickOnCenterAlignIcon();
            await activityTabPage.clearActivityNote();
            // checking bullot points
            await activityTabPage.setBulletList('BulletOne');
            expect(await activityTabPage.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('Text is not center Align In Ck Editor');
            await activityTabPage.clearActivityNote();
            // Link added
            await activityTabPage.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('Google', 0);
            await linkPropertiesPo.setValueOfLinkProperties('www.google.com', 1);
            await linkPropertiesPo.clickOnOkBtn();
            expect(await activityTabPage.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('Text is not center Align In Ck Editor');
            await activityTabPage.clickOnPostButton();

            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.getTextCkEditorMinimizeOrMiximize()).toBe('Maximize');
            await activityTabPage.clickMaximizeMinimizeIcon();
            expect(await activityTabPage.getTextCkEditorMinimizeOrMiximize()).toBe('Minimize');
            await activityTabPage.clickMaximizeMinimizeIcon();
            await activityTabPage.clickPublicCheckbox();
            expect(await activityTabPage.isPublicCheckBoxToolTipIconDisplayed()).toBeTruthy('Public checkbox tool tip missing');
            await activityTabPage.clickOnCancelButton();
            await activityTabPage.clickActivityNoteTextBox();
            expect(await activityTabPage.getTextCkEditorTextArea()).toBe('');
            await viewTaskPo.clickOnViewCase();
        });

        it('[DRDMV-21617,DRDMV-21618]: Verify CkEditor On Adhoc Task With Activity Tab', async () => {
            // Goto Adhoc Task
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickAddAdhocTaskButton();
            expect(await adhoctaskTemplate.isAttachmentButtonDisplayed()).toBeTruthy();
            await adhoctaskTemplate.setSummary(adhocTaskSummary);
            await adhoctaskTemplate.setDescription("Description");
            await adhoctaskTemplate.clickSaveAdhoctask();
            await utilityCommon.closePopUpMessage();
            await manageTaskBladePo.clickCloseButton();
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickTaskLink(adhocTaskSummary);
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isCkEditorDisplayed()).toBeTruthy('CkEditor is missing');
            //bold
            await activityTabPage.clickOnBoldIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isBoldTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('Text is not get Bold In Ck Editor');
            await activityTabPage.clickOnBoldIcon();
            await activityTabPage.clearActivityNote();
            //italic
            await activityTabPage.clickOnItalicIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isItalicTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('Text is not Italic In Ck Editor');
            await activityTabPage.clickOnItalicIcon();
            await activityTabPage.clearActivityNote();
            //underline
            await activityTabPage.clickOnUnderLineIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isUnderlineTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('Text is not Underline In Ck Editor');
            await activityTabPage.clickOnUnderLineIcon();
            await activityTabPage.clearActivityNote();
            //left Align
            await activityTabPage.clickOnLeftAlignIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isTextLeftAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('Text is not Left Align In Ck Editor');
            await activityTabPage.clearActivityNote();
            //Right Align
            await activityTabPage.clickOnRightAlignIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isTextRightAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('Text is not right Align In Ck Editor');
            await activityTabPage.clickOnRightAlignIcon();
            await activityTabPage.clearActivityNote();
            //Center Align
            await activityTabPage.clickOnCenterAlignIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isTextCenterAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('Text is not center Align In Ck Editor');
            await activityTabPage.clickOnCenterAlignIcon();
            await activityTabPage.clearActivityNote();
            //set color
            await activityTabPage.selectColor('Strong Red');
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isColorTextDisplayedInCkEditorTextArea('color:#c0392b;', addNoteBodyText)).toBeTruthy('Text is not center Align In Ck Editor');
            await activityTabPage.clearActivityNote();
            //checking number list
            await activityTabPage.setNumberList('PlusOne');
            expect(await activityTabPage.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('Text is not center Align In Ck Editor');
            await activityTabPage.clickOnCenterAlignIcon();
            await activityTabPage.clearActivityNote();
            // checking bullot points
            await activityTabPage.setBulletList('BulletOne');
            expect(await activityTabPage.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('Text is not center Align In Ck Editor');
            await activityTabPage.clearActivityNote();
            // Link added
            await activityTabPage.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('Google', 0);
            await linkPropertiesPo.setValueOfLinkProperties('www.google.com', 1);
            await linkPropertiesPo.clickOnOkBtn();
            expect(await activityTabPage.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('Text is not center Align In Ck Editor');
            await activityTabPage.clickOnPostButton();

            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.getTextCkEditorMinimizeOrMiximize()).toBe('Maximize');
            await activityTabPage.clickMaximizeMinimizeIcon();
            expect(await activityTabPage.getTextCkEditorMinimizeOrMiximize()).toBe('Minimize');
            await activityTabPage.clickMaximizeMinimizeIcon();
            await activityTabPage.clickPublicCheckbox();
            expect(await activityTabPage.isPublicCheckBoxToolTipIconDisplayed()).toBeTruthy('Public checkbox tool tip missing');
            await activityTabPage.clickOnCancelButton();
            await activityTabPage.clickActivityNoteTextBox();
            expect(await activityTabPage.getTextCkEditorTextArea()).toBe('');
        });

        it('[DRDMV-21617,DRDMV-21618]: Verify CkEditor On Knowledge Article With Activity Tab', async () => {
            // Verify knowledge Article task template
            await navigationPage.gotoKnowledgeConsole();
            await knowledgeArticlesConsolePo.searchAndOpenKnowledgeArticle(knowledgeArticleData.displayId);

            expect(await viewKnowledgeArticlePo.isEditLinkDisplayedOnKA()).toBeTruthy('KA Edit link is missing')
            await viewKnowledgeArticlePo.clickOnActivityTab();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isCkEditorDisplayed()).toBeTruthy('CkEditor is missing');
            //bold
            await activityTabPage.clickOnBoldIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isBoldTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('Text is not get Bold In Ck Editor');
            await activityTabPage.clickOnBoldIcon();
            await activityTabPage.clearActivityNote();
            //italic
            await activityTabPage.clickOnItalicIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isItalicTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('Text is not Italic In Ck Editor');
            await activityTabPage.clickOnItalicIcon();
            await activityTabPage.clearActivityNote();
            //underline
            await activityTabPage.clickOnUnderLineIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isUnderlineTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('Text is not Underline In Ck Editor');
            await activityTabPage.clickOnUnderLineIcon();
            await activityTabPage.clearActivityNote();
            //left Align
            await activityTabPage.clickOnLeftAlignIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isTextLeftAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('Text is not Left Align In Ck Editor');
            await activityTabPage.clearActivityNote();
            //Right Align
            await activityTabPage.clickOnRightAlignIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isTextRightAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('Text is not right Align In Ck Editor');
            await activityTabPage.clickOnRightAlignIcon();
            await activityTabPage.clearActivityNote();
            //Center Align
            await activityTabPage.clickOnCenterAlignIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isTextCenterAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('Text is not center Align In Ck Editor');
            await activityTabPage.clickOnCenterAlignIcon();
            await activityTabPage.clearActivityNote();
            //set color
            await activityTabPage.selectColor('Strong Red');
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isColorTextDisplayedInCkEditorTextArea('color:#c0392b;', addNoteBodyText)).toBeTruthy('Text is not center Align In Ck Editor');
            await activityTabPage.clearActivityNote();
            //checking number list
            await activityTabPage.setNumberList('PlusOne');
            expect(await activityTabPage.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('Text is not center Align In Ck Editor');
            await activityTabPage.clickOnCenterAlignIcon();
            await activityTabPage.clearActivityNote();
            // checking bullot points
            await activityTabPage.setBulletList('BulletOne');
            expect(await activityTabPage.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('Text is not center Align In Ck Editor');
            await activityTabPage.clearActivityNote();
            // Link added
            await activityTabPage.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('Google', 0);
            await linkPropertiesPo.setValueOfLinkProperties('www.google.com', 1);
            await linkPropertiesPo.clickOnOkBtn();
            expect(await activityTabPage.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('Text is not center Align In Ck Editor');
            await activityTabPage.clickOnPostButton();

            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.getTextCkEditorMinimizeOrMiximize()).toBe('Maximize');
            await activityTabPage.clickMaximizeMinimizeIcon();
            expect(await activityTabPage.getTextCkEditorMinimizeOrMiximize()).toBe('Minimize');
            await activityTabPage.clickMaximizeMinimizeIcon();
            await activityTabPage.clickOnCancelButton();
            await activityTabPage.clickActivityNoteTextBox();
            expect(await activityTabPage.getTextCkEditorTextArea()).toBe('');
        });

        it('[DRDMV-21617,DRDMV-21618]: Verify CkEditor On Person Profile With Activity Tab', async () => {
            // Profile View CK Editor
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await caseConsolePo.searchAndOpenCase(newCase.displayId);
            expect(await viewCasePo.getCaseID()).toBe(newCase.displayId, 'Case Id is missing.');
            await activityTabPage.clickOnRefreshButton();
            await activityTabPage.clickOnHyperlinkFromActivity(2, 'Qadim Katawazi');
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isCkEditorDisplayed()).toBeTruthy('CkEditor is missing');
            //bold
            await activityTabPage.clickOnBoldIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isBoldTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('Text is not get Bold In Ck Editor');
            await activityTabPage.clickOnBoldIcon();
            await activityTabPage.clearActivityNote();
            //italic
            await activityTabPage.clickOnItalicIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isItalicTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('Text is not Italic In Ck Editor');
            await activityTabPage.clickOnItalicIcon();
            await activityTabPage.clearActivityNote();
            //underline
            await activityTabPage.clickOnUnderLineIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isUnderlineTextDisplayedInCkEditorTextArea(addNoteBodyText)).toBeTruthy('Text is not Underline In Ck Editor');
            await activityTabPage.clickOnUnderLineIcon();
            await activityTabPage.clearActivityNote();
            //left Align
            await activityTabPage.clickOnLeftAlignIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isTextLeftAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('Text is not Left Align In Ck Editor');
            await activityTabPage.clearActivityNote();
            //Right Align
            await activityTabPage.clickOnRightAlignIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isTextRightAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('Text is not right Align In Ck Editor');
            await activityTabPage.clickOnRightAlignIcon();
            await activityTabPage.clearActivityNote();
            //Center Align
            await activityTabPage.clickOnCenterAlignIcon();
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isTextCenterAlignInCkEditorTextArea(addNoteBodyText)).toBeTruthy('Text is not center Align In Ck Editor');
            await activityTabPage.clickOnCenterAlignIcon();
            await activityTabPage.clearActivityNote();
            //set color
            await activityTabPage.selectColor('Strong Red');
            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.isColorTextDisplayedInCkEditorTextArea('color:#c0392b;', addNoteBodyText)).toBeTruthy('Text is not center Align In Ck Editor');
            await activityTabPage.clearActivityNote();
            //checking number list
            await activityTabPage.setNumberList('PlusOne');
            expect(await activityTabPage.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('Text is not center Align In Ck Editor');
            await activityTabPage.clickOnCenterAlignIcon();
            await activityTabPage.clearActivityNote();
            // checking bullot points
            await activityTabPage.setBulletList('BulletOne');
            expect(await activityTabPage.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('Text is not center Align In Ck Editor');
            await activityTabPage.clearActivityNote();
            // Link added
            await activityTabPage.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('Google', 0);
            await linkPropertiesPo.setValueOfLinkProperties('www.google.com', 1);
            await linkPropertiesPo.clickOnOkBtn();
            expect(await activityTabPage.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('Text is not center Align In Ck Editor');
            await activityTabPage.clickOnPostButton();

            await activityTabPage.addActivityNote(addNoteBodyText);
            expect(await activityTabPage.getTextCkEditorMinimizeOrMiximize()).toBe('Maximize');
            await activityTabPage.clickMaximizeMinimizeIcon();
            expect(await activityTabPage.getTextCkEditorMinimizeOrMiximize()).toBe('Minimize');
            await activityTabPage.clickMaximizeMinimizeIcon();
            await activityTabPage.clickOnCancelButton();
            await activityTabPage.clickActivityNoteTextBox();
            expect(await activityTabPage.getTextCkEditorTextArea()).toBe('');
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });
});
