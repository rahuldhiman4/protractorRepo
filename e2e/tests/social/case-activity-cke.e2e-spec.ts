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
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import adhoctaskTemplate from "../../pageobject/task/create-adhoc-task.po";
import viewTaskPo from '../../pageobject/task/view-task.po';
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
    it('[DRDMV-21617,DRDMV-21618]:Verify the Availability and UI of new CK Editor', async () => {
        try {
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
                "Summary": "DRDMV-21617_TC",
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
            await manageTaskBladePo.clickOnCloseButton();

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
            await activityTabPage.setInsertRemoveNumberList('PlusOne');
            expect(await activityTabPage.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('Text is not center Align In Ck Editor');
            await activityTabPage.clickOnCenterAlignIcon();
            await activityTabPage.clearActivityNote();
            // checking bullot points
            await activityTabPage.setInsertRemoveBulletedList('BulletOne');
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
            expect(await activityTabPage.getTextCkEditorTextArea()).toBe('           ');


            // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            // Profile View CK Editor
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await caseConsolePo.searchAndOpenCase(newCase.displayId);
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
            await activityTabPage.setInsertRemoveNumberList('PlusOne');
            expect(await activityTabPage.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('Text is not center Align In Ck Editor');
            await activityTabPage.clickOnCenterAlignIcon();
            await activityTabPage.clearActivityNote();
            // checking bullot points
            await activityTabPage.setInsertRemoveBulletedList('BulletOne');
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
            expect(await activityTabPage.getTextCkEditorTextArea()).toBe('           ');

            // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            // Goto Manual Task
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(newCase.displayId);
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickTaskLinkOnManageTask(manualTemplateData.templateSummary);
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
            await activityTabPage.setInsertRemoveNumberList('PlusOne');
            expect(await activityTabPage.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('Text is not center Align In Ck Editor');
            await activityTabPage.clickOnCenterAlignIcon();
            await activityTabPage.clearActivityNote();
            // checking bullot points
            await activityTabPage.setInsertRemoveBulletedList('BulletOne');
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
            expect(await activityTabPage.getTextCkEditorTextArea()).toBe('           ');
            await viewTaskPo.clickOnViewCase();
            // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            // Goto Automated Task
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickTaskLinkOnManageTask(autoTemplateData.templateSummary);
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
            await activityTabPage.setInsertRemoveNumberList('PlusOne');
            expect(await activityTabPage.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('Text is not center Align In Ck Editor');
            await activityTabPage.clickOnCenterAlignIcon();
            await activityTabPage.clearActivityNote();
            // checking bullot points
            await activityTabPage.setInsertRemoveBulletedList('BulletOne');
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
            expect(await activityTabPage.getTextCkEditorTextArea()).toBe('           ');
            await viewTaskPo.clickOnViewCase();
            // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            // Goto External Task
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickTaskLinkOnManageTask(externalTemplateData.templateSummary);
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
            await activityTabPage.setInsertRemoveNumberList('PlusOne');
            expect(await activityTabPage.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('Text is not center Align In Ck Editor');
            await activityTabPage.clickOnCenterAlignIcon();
            await activityTabPage.clearActivityNote();
            // checking bullot points
            await activityTabPage.setInsertRemoveBulletedList('BulletOne');
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
            expect(await activityTabPage.getTextCkEditorTextArea()).toBe('           ');
            await viewTaskPo.clickOnViewCase();

            // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            // Goto Adhoc Task
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickAddAdhocTaskButton();
            expect(await adhoctaskTemplate.isAttachmentButtonDisplayed()).toBeTruthy();
            await adhoctaskTemplate.setSummary(adhocTaskSummary);
            await adhoctaskTemplate.setDescription("Description");
            await adhoctaskTemplate.clickOnSaveAdhoctask();
            await manageTaskBladePo.clickOnCloseButton();
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickTaskLinkOnManageTask(adhocTaskSummary);
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
            await activityTabPage.setInsertRemoveNumberList('PlusOne');
            expect(await activityTabPage.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('Text is not center Align In Ck Editor');
            await activityTabPage.clickOnCenterAlignIcon();
            await activityTabPage.clearActivityNote();
            // checking bullot points
            await activityTabPage.setInsertRemoveBulletedList('BulletOne');
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
            expect(await activityTabPage.getTextCkEditorTextArea()).toBe('           ');

            // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            // Create knowledge Article task template
            await navigationPage.gotoCreateKnowledge();
            expect(browser.getTitle()).toBe('Knowledge Article Templates Preview - Business Workflows'), 'Knowledge Article title is missing';
            await createKnowlegePo.clickOnTemplate('Reference');
            await createKnowlegePo.clickOnUseSelectedTemplateButton();
            await createKnowlegePo.addTextInKnowlegeTitleField('test case for DRDMV-21617');
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
            await activityTabPage.setInsertRemoveNumberList('PlusOne');
            expect(await activityTabPage.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('Text is not center Align In Ck Editor');
            await activityTabPage.clickOnCenterAlignIcon();
            await activityTabPage.clearActivityNote();
            // checking bullot points
            await activityTabPage.setInsertRemoveBulletedList('BulletOne');
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
            expect(await activityTabPage.getTextCkEditorTextArea()).toBe('           ');
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 2000 * 1000);
})