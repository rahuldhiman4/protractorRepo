import updateStatusBladePo from '../../pageobject/common/update.status.blade.po';
import { cloneDeep } from 'lodash';
import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import * as notesTemplateData from '../../data/ui/Social/notesTemplate.api';
import addRelatedPopupPage from '../../pageobject/case/add-relation-pop.po';
import caseConsolePo from '../../pageobject/case/case-console.po';
import casePreviewPo from '../../pageobject/case/case-preview.po';
import createCasePo from '../../pageobject/case/create-case.po';
import viewCasePage from "../../pageobject/case/view-case.po";
import accessTabPo from '../../pageobject/common/access-tab.po';
import addFieldPo from '../../pageobject/common/add-fields-pop.po';
import changeAssignmentBladePo from '../../pageobject/common/change-assignment.po';
import ckeditorOpsPo from '../../pageobject/common/ck-editor/ckeditor-ops.po';
import ckeditorValidationPo from '../../pageobject/common/ck-editor/ckeditor-validation.po';
import linkPropertiesPo from '../../pageobject/common/ck-editor/link-properties.po';
import tablePropertiesPo from '../../pageobject/common/ck-editor/table-properties.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import personProfilePo from '../../pageobject/common/person-profile.po';
import relatedTabPage from '../../pageobject/common/related-person-tab.po';
import createKnowlegePo from '../../pageobject/knowledge/create-knowlege.po';
import knowledgeArticlesConsolePo from '../../pageobject/knowledge/knowledge-articles-console.po';
import previewKnowledgePo from '../../pageobject/knowledge/preview-knowledge.po';
import viewKnowledgeArticlePo from '../../pageobject/knowledge/view-knowledge-article.po';
import consoleNotesTemplatePo from '../../pageobject/settings/common/console-notestemplate.po';
import createNotesTemplate from '../../pageobject/settings/common/create-notestemplate.po';
import editNotetemplate from '../../pageobject/settings/common/edit-notestemplate.po';
import activityTabPo from '../../pageobject/social/activity-tab.po';
import notesTemplateUsage from '../../pageobject/social/note-template-usage.po';
import createAdhocTaskPo from '../../pageobject/task/create-adhoc-task.po';
import manageTask from "../../pageobject/task/manage-task-blade.po";
import viewTaskPo from '../../pageobject/task/view-task.po';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';
import { BWF_BASE_URL, BWF_PAGE_TITLES } from '../../utils/constants';
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import navigationPo from '../../pageobject/common/navigation.po';
import changeAssignmentPo from '../../pageobject/common/change-assignment.po';
import viewCasePo from '../../pageobject/case/view-case.po';

let tableRowFieldIndex = 0;
let tableColumnFieldIndex = 1;
let tableWidthFieldIndex = 3;
let tableHeightFieldIndex = 4;
let cellCaption: number = 7;
let cellSummary: number = 8;
let imageUrlFieldIndex = 0;
let imageWidthFieldIndex = 2;
let linkDisplayTextFieldIndex = 0;
let linkUrlFieldIndex = 1;
let linkTargetDropDownIndex = 4;
let boldText = "this is text bold";
let lefAlignText = "this is text left align";
let centerAlignText = "this is text center align";
let rightAlignText = "this is text right align";
let italicText = "this is text italic";
let underLineText = "this is text underline";
let redColorText = "this is text red";
let formatText = "this is text Styles";
let fontText = "this is text Font";
let justifyAlignText = "this is text Justify align";
let strikeThroughText = "this is text strikeThrough ";
let imageSource, imageSource1, imageSource2;
let uploadURL = "https://www.google.com/homepage/images/hero-dhp-chrome-win.jpg?mmfb=90bec8294f441f5c41987596ca1b8cff";

describe('Notes template', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login("elizabeth");
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //ptidke
    it('[4363]: [Design Time] Verify case Business analyst is able create, edit and delete Knowledge Notes template', async () => {
        let templateName: string = "activityNotesTemplate" + Math.floor(Math.random() * 100000);
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Knowledge Management--Notes Template', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.NOTES_TEMPLATES);
        await consoleNotesTemplatePo.clickOnCreateNotesTemplate();
        await createNotesTemplate.setTemplateName(templateName);
        await createNotesTemplate.setStatusValue('Active');
        await createNotesTemplate.setCompanyValue('- Global -');
        await createNotesTemplate.setLanguageValue('English (United States)');
        await createNotesTemplate.clickOnInsertFieldLink();
        await addFieldPo.setValueOfField('Knowledge Article', 'Assignee');
        await addFieldPo.clickOnOkButtonOfEditor();
        await createNotesTemplate.setBody("this is new actiivty notes template");
        await createNotesTemplate.clickOnSaveButton();
        await consoleNotesTemplatePo.searchAndClickOnNotesTemplate(templateName);
        let updateBody: string = "UpdateNotesTemplate" + Math.floor(Math.random() * 100000);
        await editNotetemplate.changeStatusValue('Inactive');
        await editNotetemplate.updateBody(updateBody);
        await editNotetemplate.clickOnSaveButton();
        await consoleNotesTemplatePo.searchAndClickOnNotesTemplate(templateName);
        expect(await editNotetemplate.getStatusValue()).toContain('Inactive');
        expect(await editNotetemplate.getBodyValue()).toContain(updateBody);
        await editNotetemplate.clickOnCancelButton();
        await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        await utilityGrid.deleteGridRecord(templateName);
        await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        expect(await utilityCommon.isPopupMsgsMatches(['Record deleted successfully.'])).toBeTruthy('Record deleted successfully. pop up message missing');
    });

    //ptidke
    describe('[4372]: [Design Time] Verify that case Business analyst is able create ,edit and delete case Notes template', async () => {

        let templateName: string = "activityNotesTemplate" + Math.floor(Math.random() * 100000);

        it('[4372]: [Design Time] Verify that case Business analyst is able create ,edit and delete case Notes template', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Notes Template', BWF_PAGE_TITLES.CASE_MANAGEMENT.NOTES_TEMPLATES);
            await consoleNotesTemplatePo.clickOnCreateNotesTemplate();
            await createNotesTemplate.setTemplateName(templateName);
            await createNotesTemplate.setStatusValue('Active');
            await createNotesTemplate.setCompanyValue('Petramco');
            await createNotesTemplate.setLanguageValue('English (United States)');
            await createNotesTemplate.clickOnInsertFieldLink();
            await addFieldPo.setValueOfField('Case', 'Company');
            await addFieldPo.clickOnOkButtonOfEditor();
            await createNotesTemplate.setBody("this is new actiivty notes template");
            await createNotesTemplate.clickOnSaveButton();
        });

        it('[4372]: Verify case notes template is accessible to other Line of business Case BA', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Notes Template', BWF_PAGE_TITLES.CASE_MANAGEMENT.NOTES_TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(templateName)).toBeFalsy('case notes template for Facilities LOB are displayed to Human Resource LOB User.');
        });

        it('[4372]: Verify case notes template is accessible to different company user with same Line of business Case BA', async () => {
            await navigationPage.signOut();
            await loginPage.login('gwixillian');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Notes Template', BWF_PAGE_TITLES.CASE_MANAGEMENT.NOTES_TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(templateName)).toBeFalsy('case notes template for Facilities LOB are displayed to Human Resource LOB User.');
        });

        it('[4372]: Verify case notes template is accessible to other Line of business Case Manager', async () => {
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Notes Template', BWF_PAGE_TITLES.CASE_MANAGEMENT.NOTES_TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(templateName)).toBeFalsy('case notes template for Facilities LOB are displayed to Human Resource LOB User.');
        });

        it('[4372]: Verify case notes template are accessible to Case Manager user who has access to multiple (HR,Facilities) LOBs', async () => {
            await navigationPage.signOut();
            await loginPage.login('qyuan');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Notes Template', BWF_PAGE_TITLES.CASE_MANAGEMENT.NOTES_TEMPLATES);
            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(templateName)).toBeFalsy('case notes template for Facilities LOB are displayed to Human Resource LOB User.');

            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await utilityGrid.isGridRecordPresent(templateName)).toBeTruthy('case notes template for Facilities LOB are not displayed to Human Resource LOB User.');
        });

        it('[4372]: Verify case notes template are accessible to Case BA user who has access to multiple (HR,Facilities) LOBs', async () => {
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Notes Template', BWF_PAGE_TITLES.CASE_MANAGEMENT.NOTES_TEMPLATES);
            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(templateName)).toBeFalsy('case notes template for Facilities LOB are displayed to Human Resource LOB User.');

            await utilityGrid.selectLineOfBusiness('Facilities');
            await navigationPage.gotoSettingsMenuItem('Case Management--Notes Template', BWF_PAGE_TITLES.CASE_MANAGEMENT.NOTES_TEMPLATES);
            await consoleNotesTemplatePo.searchAndClickOnNotesTemplate(templateName);
            let updateBody: string = "UpdateNotesTemplate" + Math.floor(Math.random() * 100000);
            await editNotetemplate.changeStatusValue('Inactive');
            await editNotetemplate.updateBody(updateBody);
            await editNotetemplate.clickOnSaveButton();
            await consoleNotesTemplatePo.searchAndClickOnNotesTemplate(templateName);
            expect(await editNotetemplate.getStatusValue()).toContain('Inactive');
            expect(await editNotetemplate.getBodyValue()).toContain(updateBody);
            await editNotetemplate.clickOnCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            await utilityGrid.deleteGridRecord(templateName);
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            expect(await utilityCommon.isPopUpMessagePresent('Record deleted successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
        });

        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        });
    });

    //ptidke
    describe('[4361]: [Design Time] Verify case Business analyst is able create ,edit and delete People Notes template', async () => {
        let templateName: string = "activityNotesTemplate" + Math.floor(Math.random() * 100000);

        it('[4361]: [Design Time] Verify case Business analyst is able create ,edit and delete People Notes template', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('People--Notes Template', BWF_PAGE_TITLES.PEOPLE.NOTES_TEMPLATES);
            await consoleNotesTemplatePo.clickOnCreateNotesTemplate();
            await createNotesTemplate.setTemplateName(templateName);
            await createNotesTemplate.setStatusValue('Active');
            await createNotesTemplate.setCompanyValue('Petramco');
            await createNotesTemplate.setLanguageValue('English (United States)');
            await createNotesTemplate.clickOnInsertFieldLink();
            await addFieldPo.setValueOfField('Person', 'Agent');
            await addFieldPo.clickOnOkButtonOfEditor();
            await createNotesTemplate.setBody("this is new actiivty notes template");
            await createNotesTemplate.clickOnSaveButton();
        });

        it('[4361]: Verify people notes template is accessible to other Line of business Case BA', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoCaseConsole();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('People--Notes Template', BWF_PAGE_TITLES.PEOPLE.NOTES_TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(templateName)).toBeFalsy('people notes template for Facilities LOB are displayed to Human Resource LOB User.');
        });

        it('[4361]: Verify people notes template is accessible to different company user with same Line of business Case BA', async () => {
            await navigationPage.signOut();
            await loginPage.login('gwixillian');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('People--Notes Template', BWF_PAGE_TITLES.PEOPLE.NOTES_TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(templateName)).toBeFalsy('people notes template for Facilities LOB are displayed to Human Resource LOB User.');
        });

        it('[4361]: Verify people notes template is accessible to other Line of business Case Manager', async () => {
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('People--Notes Template', BWF_PAGE_TITLES.PEOPLE.NOTES_TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(templateName)).toBeFalsy('people notes template for Facilities LOB are displayed to Human Resource LOB User.');
        });

        it('[4361]: Verify people notes template are accessible to Case Manager user who has access to multiple (HR,Facilities) LOBs', async () => {
            await navigationPage.signOut();
            await loginPage.login('qyuan');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('People--Notes Template', BWF_PAGE_TITLES.PEOPLE.NOTES_TEMPLATES);
            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(templateName)).toBeFalsy('people notes template for Facilities LOB are displayed to Human Resource LOB User.');

            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await utilityGrid.isGridRecordPresent(templateName)).toBeTruthy('people notes template for Facilities LOB are not displayed to Human Resource LOB User.');
        });

        it('[4361]: Verify people notes template are accessible to Case BA user who has access to multiple (HR,Facilities) LOBs', async () => {
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('People--Notes Template', BWF_PAGE_TITLES.PEOPLE.NOTES_TEMPLATES);
            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(templateName)).toBeFalsy('people notes template for Facilities LOB are displayed to Human Resource LOB User.');

            await utilityGrid.selectLineOfBusiness('Facilities');
            await navigationPage.gotoSettingsMenuItem('People--Notes Template', BWF_PAGE_TITLES.PEOPLE.NOTES_TEMPLATES);
            await consoleNotesTemplatePo.searchAndClickOnNotesTemplate(templateName);
            let updateBody: string = "UpdateNotesTemplate" + Math.floor(Math.random() * 100000);
            await editNotetemplate.changeStatusValue('Inactive');
            await editNotetemplate.updateBody(updateBody);
            await editNotetemplate.clickOnSaveButton();
            await consoleNotesTemplatePo.searchAndClickOnNotesTemplate(templateName);
            expect(await editNotetemplate.getStatusValue()).toContain('Inactive');
            expect(await editNotetemplate.getBodyValue()).toContain(updateBody);
            await editNotetemplate.clickOnCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            await utilityGrid.deleteGridRecord(templateName);
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            expect(await utilityCommon.isPopUpMessagePresent('Record deleted successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        });
    });

    //ptidke
    describe('[4362]: [Design Time] Verify case Business analyst is able create, edit and delete Task Notes template', async () => {
        let templateName: string = "activityNotesTemplate" + Math.floor(Math.random() * 100000);

        it('[4362]: [Design Time] Verify case Business analyst is able create, edit and delete Task Notes template', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Notes Template', BWF_PAGE_TITLES.TASK_MANAGEMENT.NOTES_TEMPLATES);
            await consoleNotesTemplatePo.clickOnCreateNotesTemplate();
            await createNotesTemplate.setTemplateName(templateName);
            await createNotesTemplate.setStatusValue('Active');
            await createNotesTemplate.setCompanyValue('- Global -');
            await createNotesTemplate.setLanguageValue('English (United States)');
            await createNotesTemplate.clickOnInsertFieldLink();
            await addFieldPo.setValueOfField('Task', 'Assignee');
            await addFieldPo.clickOnOkButtonOfEditor();
            await createNotesTemplate.setBody("this is new actiivty notes template");
            await createNotesTemplate.clickOnSaveButton();
        });

        it('[4362]: Verify task notes template is accessible to other Line of business Case BA', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Notes Template', BWF_PAGE_TITLES.TASK_MANAGEMENT.NOTES_TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(templateName)).toBeFalsy('task notes template for Facilities LOB are displayed to Human Resource LOB User.');

        });

        it('[4362]: Verify task notes template is accessible to different company user with same Line of business Case BA', async () => {
            await navigationPage.signOut();
            await loginPage.login('gwixillian');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Notes Template', BWF_PAGE_TITLES.TASK_MANAGEMENT.NOTES_TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(templateName)).toBeFalsy('task notes template for Facilities LOB are displayed to Human Resource LOB User.');
        });

        it('[4362]: Verify task notes template is accessible to other Line of business Case Manager', async () => {
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Notes Template', BWF_PAGE_TITLES.TASK_MANAGEMENT.NOTES_TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(templateName)).toBeFalsy('task notes template for Facilities LOB are displayed to Human Resource LOB User.');
        });

        it('[4362]: Verify task notes template are accessible to Case Manager user who has access to multiple (HR,Facilities) LOBs', async () => {
            await navigationPage.signOut();
            await loginPage.login('qyuan');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Notes Template', BWF_PAGE_TITLES.TASK_MANAGEMENT.NOTES_TEMPLATES);
            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(templateName)).toBeFalsy('task notes template for Facilities LOB are displayed to Human Resource LOB User.');

            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await utilityGrid.isGridRecordPresent(templateName)).toBeTruthy('task notes template for Facilities LOB are not displayed to Human Resource LOB User.');
        });

        it('[4362]: Verify task notes template are accessible to Case BA user who has access to multiple (HR,Facilities) LOBs', async () => {
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Notes Template', BWF_PAGE_TITLES.TASK_MANAGEMENT.NOTES_TEMPLATES);
            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(templateName)).toBeFalsy('people notes template for Facilities LOB are displayed to Human Resource LOB User.');

            await utilityGrid.selectLineOfBusiness('Facilities');
            await navigationPage.gotoSettingsMenuItem('Task Management--Notes Template', BWF_PAGE_TITLES.TASK_MANAGEMENT.NOTES_TEMPLATES);
            await consoleNotesTemplatePo.searchAndClickOnNotesTemplate(templateName);
            let updateBody: string = "UpdateNotesTemplate" + Math.floor(Math.random() * 100000);
            await editNotetemplate.changeStatusValue('Inactive');
            await editNotetemplate.updateBody(updateBody);
            await editNotetemplate.clickOnSaveButton();
            await consoleNotesTemplatePo.searchAndClickOnNotesTemplate(templateName);
            expect(await editNotetemplate.getStatusValue()).toContain('Inactive');
            expect(await editNotetemplate.getBodyValue()).toContain(updateBody);
            await editNotetemplate.clickOnCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            await utilityGrid.deleteGridRecord(templateName);
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            expect(await utilityCommon.isPopUpMessagePresent('Record deleted successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        });

    });

    //ptidke
    describe('[4287]: [Design Time] Knowledge user is able to create, edit and Delete Knowledge Notes Template', async () => {
        let templateName: string = "activityNotesTemplate" + Math.floor(Math.random() * 100000);
        let globalNotesTemplateName: string = "GlobalActivityNotesTemplate" + Math.floor(Math.random() * 100000);

        it('[4287]: [Design Time] Knowledge user is able to create, edit and Delete Knowledge Notes Template', async () => {
            await navigationPage.signOut();
            await loginPage.login("khardison");
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Notes Template', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.NOTES_TEMPLATES);
            await consoleNotesTemplatePo.clickOnCreateNotesTemplate();
            await createNotesTemplate.setTemplateName(templateName);
            await createNotesTemplate.setStatusValue('Active');
            await createNotesTemplate.setCompanyValue('Petramco');
            await createNotesTemplate.setLanguageValue('English (United States)');
            await createNotesTemplate.clickOnInsertFieldLink();
            await addFieldPo.setValueOfField('Knowledge Article', 'Knowledge Set');
            await addFieldPo.clickOnOkButtonOfEditor();
            await createNotesTemplate.setBody("this is new actiivty notes template");
            await createNotesTemplate.clickOnSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');

            await consoleNotesTemplatePo.clickOnCreateNotesTemplate();
            await createNotesTemplate.setTemplateName(globalNotesTemplateName);
            await createNotesTemplate.setStatusValue('Active');
            await createNotesTemplate.setCompanyValue('- Global -');
            await createNotesTemplate.setLanguageValue('English (United States)');
            await createNotesTemplate.clickOnInsertFieldLink();
            await addFieldPo.setValueOfField('Knowledge Article', 'Knowledge Set');
            await addFieldPo.clickOnOkButtonOfEditor();
            await createNotesTemplate.setBody("this is new actiivty notes template");
            await createNotesTemplate.clickOnSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
        });

        it('[4287]: Verify Knowledge Article Notes Template is accessible to other Line of business Case BA', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Notes Template', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.NOTES_TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(templateName)).toBeFalsy('Knowledge Article Notes Template for Facilities LOB are displayed to Human Resource LOB User.');
            expect(await utilityGrid.isGridRecordPresent(globalNotesTemplateName)).toBeFalsy('Global Knowledge Article Notes Template for Facilities LOB are displayed to Human Resource LOB User.');
        });

        it('[4287]: Verify Knowledge Article Notes Template are accessible to Case Manager user who has access to multiple (HR,Facilities) LOBs', async () => {
            await navigationPage.signOut();
            await loginPage.login('qyuan');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Notes Template', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.NOTES_TEMPLATES);
            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await utilityGrid.isGridRecordPresent(templateName)).toBeFalsy('Knowledge Article Notes Template for Facilities LOB are displayed to Human Resource LOB User.');
            expect(await utilityGrid.isGridRecordPresent(globalNotesTemplateName)).toBeFalsy('Global Knowledge Article Notes Template for Facilities LOB are displayed to Human Resource LOB User.');

            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(templateName)).toBeTruthy('Knowledge Article Notes Template for Human Resource LOB are not displayed to Facilities LOB User.');
            expect(await utilityGrid.isGridRecordPresent(globalNotesTemplateName)).toBeTruthy('Knowledge Article Notes Template for Human Resource LOB are not displayed to Facilities LOB User.');
        });

        it('[4287]: Verify Knowledge Article Notes Template are accessible to Case BA from different company with same LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('gwixillian');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Notes Template', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.NOTES_TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(templateName)).toBeTruthy('Knowledge Article Notes Template for Human Resource LOB are not displayed to Facilities LOB User.');
            expect(await utilityGrid.isGridRecordPresent(globalNotesTemplateName)).toBeTruthy('Global Knowledge Article Notes Template for Human Resource LOB are displayed to Facilities LOB User.');
        });

        it('[4287]: Verify Knowledge Article Notes Template are accessible to Case BA user who has access to multiple (HR,Facilities) LOBs', async () => {
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Notes Template', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.NOTES_TEMPLATES);
            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await utilityGrid.isGridRecordPresent(templateName)).toBeFalsy('Knowledge Article Notes Template for Facilities LOB are displayed to Human Resource LOB User.');
            expect(await utilityGrid.isGridRecordPresent(globalNotesTemplateName)).toBeFalsy(' Global Knowledge Article Notes Template for Facilities LOB are displayed to Human Resource LOB User.');

            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(templateName)).toBeTruthy('Knowledge Article Notes Template for Facilities LOB are not displayed to Human Resource LOB User.');
            expect(await utilityGrid.isGridRecordPresent(globalNotesTemplateName)).toBeTruthy('Global Knowledge Article Notes Template for Facilities LOB are not displayed to Human Resource LOB User.');

            await consoleNotesTemplatePo.searchAndClickOnNotesTemplate(templateName);
            let updateBody: string = "UpdateNotesTemplate" + Math.floor(Math.random() * 100000);
            await editNotetemplate.changeStatusValue('Inactive');
            await editNotetemplate.updateBody(updateBody);
            await editNotetemplate.clickOnSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
            await consoleNotesTemplatePo.searchAndClickOnNotesTemplate(templateName);
            expect(await editNotetemplate.getStatusValue()).toContain('Inactive');
            expect(await editNotetemplate.getBodyValue()).toContain(updateBody);
            await editNotetemplate.clickOnCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            await utilityGrid.deleteGridRecord(templateName);
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            expect(await utilityCommon.isPopUpMessagePresent('Record deleted successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login("elizabeth");
        });
    });

    //ptidke
    it('[4377]: [DesignTime] Verify Notes templates UI should be displayed as per prototype(mockups)', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Notes Template', BWF_PAGE_TITLES.CASE_MANAGEMENT.NOTES_TEMPLATES);
        expect(await consoleNotesTemplatePo.isNotesTemplateUIConsolePresent()).toBeTruthy();
        await consoleNotesTemplatePo.clickOnCreateNotesTemplate();
        expect(await createNotesTemplate.isSaveButtonDisabled()).toBeFalsy();
        expect(await createNotesTemplate.isCreateNotesTemplateUIPresent()).toBeTruthy();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('People--Notes Template', BWF_PAGE_TITLES.PEOPLE.NOTES_TEMPLATES);
        expect(await consoleNotesTemplatePo.isNotesTemplateUIConsolePresent()).toBeTruthy();
        await consoleNotesTemplatePo.clickOnCreateNotesTemplate();
        expect(await createNotesTemplate.isSaveButtonDisabled()).toBeFalsy();
        expect(await createNotesTemplate.isCreateNotesTemplateUIPresent()).toBeTruthy();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Notes Template', BWF_PAGE_TITLES.TASK_MANAGEMENT.NOTES_TEMPLATES);
        expect(await consoleNotesTemplatePo.isNotesTemplateUIConsolePresent()).toBeTruthy();
        await consoleNotesTemplatePo.clickOnCreateNotesTemplate();
        expect(await createNotesTemplate.isSaveButtonDisabled()).toBeFalsy();
        expect(await createNotesTemplate.isCreateNotesTemplateUIPresent()).toBeTruthy();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Knowledge Management--Notes Template', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.NOTES_TEMPLATES);
        expect(await consoleNotesTemplatePo.isNotesTemplateUIConsolePresent()).toBeTruthy();
        await consoleNotesTemplatePo.clickOnCreateNotesTemplate();
        expect(await createNotesTemplate.isSaveButtonDisabled()).toBeFalsy();
        expect(await createNotesTemplate.isCreateNotesTemplateUIPresent()).toBeTruthy();
    });

    //ptidke
    describe('[4299]: [Design Time] Verify warning Message for locale values', async () => {
        let caseNotesTemplate, peopleNotesTemplate, taskNotesTemplate, knowledgeNotesTemplate;
        it('[4299]: Case and People Notes template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Notes Template', BWF_PAGE_TITLES.CASE_MANAGEMENT.NOTES_TEMPLATES);
            caseNotesTemplate = await createNotesTemplate.createNotesTemplate('Petramco');
            await consoleNotesTemplatePo.searchAndClickOnNotesTemplate(caseNotesTemplate);
            await editNotetemplate.changeLanguageValue('German (Germany)');
            expect(await editNotetemplate.getLocaleNotPresentMessage()).toContain('Please add the required localized message.');
            await editNotetemplate.clickOnCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });
        it('[4299]: Case and People Notes template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('People--Notes Template', BWF_PAGE_TITLES.PEOPLE.NOTES_TEMPLATES);
            expect (await consoleNotesTemplatePo.isCreateNotesTemplateEnabled()).toBeTruthy('Create notes template is enabled');
            await browser.sleep(2000)// wait untile people page open
            peopleNotesTemplate = await createNotesTemplate.createNotesTemplate('Petramco');
            await consoleNotesTemplatePo.searchAndClickOnNotesTemplate(peopleNotesTemplate);
            await editNotetemplate.changeLanguageValue('German (Germany)');
            expect(await editNotetemplate.getLocaleNotPresentMessage()).toContain('Please add the required localized message.')
            await editNotetemplate.clickOnCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });
        it('[4299]: [Design Time] Verify warning Message for locale values if template message is not configured against that locale value', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Notes Template', BWF_PAGE_TITLES.TASK_MANAGEMENT.NOTES_TEMPLATES);
            taskNotesTemplate = await createNotesTemplate.createNotesTemplate('Petramco');
            await consoleNotesTemplatePo.searchAndClickOnNotesTemplate(taskNotesTemplate);
            await editNotetemplate.changeLanguageValue('German (Germany)');
            expect(await editNotetemplate.getLocaleNotPresentMessage()).toContain('Please add the required localized message.');
            await editNotetemplate.clickOnCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });
        it('[4299]: [Design Time] Verify warning Message for locale values if template message is not configured against that locale value', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Notes Template', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.NOTES_TEMPLATES);
            knowledgeNotesTemplate = await createNotesTemplate.createNotesTemplate('Petramco');
            await consoleNotesTemplatePo.searchAndClickOnNotesTemplate(knowledgeNotesTemplate);
            await editNotetemplate.changeLanguageValue('German (Germany)');
            expect(await editNotetemplate.getLocaleNotPresentMessage()).toContain('Please add the required localized message.');
            await editNotetemplate.clickOnCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });
        it('[4299]: Case Notes template create same name record in same LOB', async () => {
            //create same name record in same LOB
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Notes Template', BWF_PAGE_TITLES.CASE_MANAGEMENT.NOTES_TEMPLATES);
            await utilityGrid.selectLineOfBusiness('Human Resource');
            await consoleNotesTemplatePo.clickOnCreateNotesTemplate();
            await createNotesTemplate.setTemplateName(caseNotesTemplate);
            await createNotesTemplate.setCompanyValue('Petramco');
            await createNotesTemplate.setBody("This is new notes template");
            await createNotesTemplate.clickOnSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent(`Template with the given name already exists:${caseNotesTemplate}`)).toBeTruthy("Error message absent");
            await createNotesTemplate.clickCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });
        it('[4299]: People Notes template create same name record in same LOB', async () => {
            //create same name record in same LOB
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('People--Notes Template', BWF_PAGE_TITLES.PEOPLE.NOTES_TEMPLATES);
            expect (await consoleNotesTemplatePo.isCreateNotesTemplateEnabled()).toBeTruthy('Create notes template is enabled');
            await browser.sleep(2000)// wait untile people page open
            await consoleNotesTemplatePo.clickOnCreateNotesTemplate();
            await createNotesTemplate.setTemplateName(peopleNotesTemplate);
            await createNotesTemplate.setCompanyValue('Petramco');
            await createNotesTemplate.setBody("This is new notes template");
            await createNotesTemplate.clickOnSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent(`Template with the given name already exists:${peopleNotesTemplate}`)).toBeTruthy("Error message absent");
            await createNotesTemplate.clickCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });
        it('[4299]: Task Notes template create same name record in same LOB', async () => {
            //create same name record in same LOB
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Notes Template', BWF_PAGE_TITLES.TASK_MANAGEMENT.NOTES_TEMPLATES);
            await consoleNotesTemplatePo.clickOnCreateNotesTemplate();
            await createNotesTemplate.setTemplateName(taskNotesTemplate);
            await createNotesTemplate.setCompanyValue('Petramco');
            await createNotesTemplate.setBody("This is new notes template");
            await createNotesTemplate.clickOnSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent(`Template with the given name already exists:${taskNotesTemplate}`)).toBeTruthy("Error message absent");
            await createNotesTemplate.clickCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });
        it('[4299]: Knowledge Notes template create same name record in same LOB', async () => {
            //create same name record in same LOB
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Notes Template', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.NOTES_TEMPLATES);
            await consoleNotesTemplatePo.clickOnCreateNotesTemplate();
            await createNotesTemplate.setTemplateName(knowledgeNotesTemplate);
            await createNotesTemplate.setCompanyValue('Petramco');
            await createNotesTemplate.setBody("This is new notes template");
            await createNotesTemplate.clickOnSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent(`Template with the given name already exists:${knowledgeNotesTemplate}`)).toBeTruthy("Error message absent");
            await createNotesTemplate.clickCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });
        it('[4299]: Case Notes template create same name record in different LOB', async () => {
            //create same name record in different LOB
            await utilityCommon.closePopUpMessage();
            await utilityGrid.selectLineOfBusiness('Facilities');
            await consoleNotesTemplatePo.clickOnCreateNotesTemplate();
            await createNotesTemplate.setTemplateName(caseNotesTemplate);
            await createNotesTemplate.setCompanyValue('Petramco');
            await createNotesTemplate.setBody("This is new notes template");
            // verify LOB is there
            expect(await createNotesTemplate.getLobValue()).toBe("Facilities");
            await createNotesTemplate.clickOnSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy("Success message absent");
            // open the record and verify LOB is on edit screen
            await consoleNotesTemplatePo.searchAndClickOnNotesTemplate(caseNotesTemplate);
            expect(await editNotetemplate.getLobValue()).toBe("Facilities");
            await editNotetemplate.clickOnCancelButton();
        });
        it('[4299]: People Notes template create same name record in different LOB', async () => {
            //create same name record in different LOB
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('People--Notes Template', BWF_PAGE_TITLES.PEOPLE.NOTES_TEMPLATES);
            expect (await consoleNotesTemplatePo.isCreateNotesTemplateEnabled()).toBeTruthy('Create notes template is enabled');
            await browser.sleep(2000)// wait untile people page open
            await consoleNotesTemplatePo.clickOnCreateNotesTemplate();
            await createNotesTemplate.setTemplateName(peopleNotesTemplate);
            await createNotesTemplate.setCompanyValue('Petramco');
            await createNotesTemplate.setBody("This is new notes template");
            // verify LOB is there
            expect(await createNotesTemplate.getLobValue()).toBe("Facilities");
            await createNotesTemplate.clickOnSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy("Success message absent");
            // open the record and verify LOB is on edit screen
            await consoleNotesTemplatePo.searchAndClickOnNotesTemplate(peopleNotesTemplate);
            expect(await editNotetemplate.getLobValue()).toBe("Facilities");
            await editNotetemplate.clickOnCancelButton();
        });
        it('[4299]: Task Notes template create same name record in different LOB', async () => {
            //create same name record in different LOB
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Notes Template', BWF_PAGE_TITLES.TASK_MANAGEMENT.NOTES_TEMPLATES);
            await consoleNotesTemplatePo.clickOnCreateNotesTemplate();
            await createNotesTemplate.setTemplateName(taskNotesTemplate);
            await createNotesTemplate.setCompanyValue('Petramco');
            await createNotesTemplate.setBody("This is new notes template");
            // verify LOB is there
            expect(await createNotesTemplate.getLobValue()).toBe("Facilities");
            await createNotesTemplate.clickOnSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy("Success message absent");
            // open the record and verify LOB is on edit screen
            await consoleNotesTemplatePo.searchAndClickOnNotesTemplate(taskNotesTemplate);
            expect(await editNotetemplate.getLobValue()).toBe("Facilities");
            await editNotetemplate.clickOnCancelButton();
        });
        it('[4299]: Knowledge Notes template create same name record in different LOB', async () => {
            //create same name record in different LOB
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Notes Template', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.NOTES_TEMPLATES);
            await consoleNotesTemplatePo.clickOnCreateNotesTemplate();
            await createNotesTemplate.setTemplateName(knowledgeNotesTemplate);
            await createNotesTemplate.setCompanyValue('Petramco');
            await createNotesTemplate.setBody("This is new notes template");
            // verify LOB is there
            expect(await createNotesTemplate.getLobValue()).toBe("Facilities");
            await createNotesTemplate.clickOnSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy("Success message absent");
            // open the record and verify LOB is on edit screen
            await consoleNotesTemplatePo.searchAndClickOnNotesTemplate(knowledgeNotesTemplate);
            expect(await editNotetemplate.getLobValue()).toBe("Facilities");
            await editNotetemplate.clickOnCancelButton();
            await utilityGrid.selectLineOfBusiness('Human Resource');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login("elizabeth");
        });
    });

    //ptidke
    describe('[4351]: [Run Time] Verify that case BA is able to consume more than one Enabled case notes templates on case (one at a time can post)', async () => {
        let newCase, notesTemplateName, notesTemplateName1, notesTemplateBody, notesTemplateBody1, notesTemplateName2, notesTemplateBody2, notesTemplateName3, notesTemplateBody3;
        beforeAll(async () => {
            //task template 1
            await apiHelper.apiLogin('qkatawazi');
            let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let tempNotesTemplateData1 = cloneDeep(notesTemplateData.NOTES_TEMPLATE_MANDATORY_FIELD);
            notesTemplateName = tempNotesTemplateData1.templateName + randomStr;
            notesTemplateBody = tempNotesTemplateData1.body + randomStr;
            tempNotesTemplateData1.body = notesTemplateBody;
            tempNotesTemplateData1.templateName = notesTemplateName;
            await apiHelper.createNotesTemplate("Case", tempNotesTemplateData1);
            //task template 2
            let randomStr1 = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let tempNotesTemplateData2 = cloneDeep(notesTemplateData.NOTES_TEMPLATE_MANDATORY_FIELD);
            notesTemplateName1 = tempNotesTemplateData2.templateName + randomStr1;
            notesTemplateBody1 = tempNotesTemplateData2.body + randomStr1;
            tempNotesTemplateData2.body = notesTemplateBody1;
            tempNotesTemplateData2.templateName = notesTemplateName1;
            await apiHelper.createNotesTemplate("Case", tempNotesTemplateData2);
            //task template 3
            let randomStr2 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let tempNotesTemplateData3 = cloneDeep(notesTemplateData.NOTES_TEMPLATE_MANDATORY_FIELD);
            notesTemplateName2 = tempNotesTemplateData3.templateName + randomStr2;
            notesTemplateBody2 = tempNotesTemplateData3.body + randomStr2;
            tempNotesTemplateData3.body = notesTemplateBody2;
            tempNotesTemplateData3.templateName = notesTemplateName2;
            await apiHelper.createNotesTemplate("Case", tempNotesTemplateData3);
            //task template 4
            let randomStr3 = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let tempNotesTemplateData4 = cloneDeep(notesTemplateData.NOTES_TEMPLATE_MANDATORY_FIELD);
            notesTemplateName3 = tempNotesTemplateData4.templateName + randomStr3;
            notesTemplateBody3 = tempNotesTemplateData4.body + randomStr3;
            tempNotesTemplateData4.body = notesTemplateBody3;
            tempNotesTemplateData4.templateName = notesTemplateName3;
            await apiHelper.createNotesTemplate("Case", tempNotesTemplateData4);
            let caseData = {
                "Requester": "qkatawazi",
                "Summary": "4351 Summary",
                "Assigned Company": "Petramco",
                "Business Unit": "HR Support",
                "Support Group": "Compensation and Benefits"
            };
            await apiHelper.apiLogin('qtao');
            newCase = await apiHelper.createCase(caseData);
        });

        it('[4351]: [Run Time] Verify that case BA is able to consume more than one Enabled case notes templates on case (one at a time can post)', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(newCase.displayId);

            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(notesTemplateName);
            await activityTabPo.clickOnPostButton();
            expect(await activityTabPo.isTextPresentInNote(notesTemplateBody)).toBeTruthy();

            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(notesTemplateName1);
            await activityTabPo.clickOnPostButton();
            expect(await activityTabPo.isTextPresentInNote(notesTemplateBody1)).toBeTruthy();
        });
        it('[4351]: [Run Time] Verify that case BA is able to consume more than one Enabled case notes templates on case (one at a time can post)', async () => {
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(notesTemplateName2);
            await activityTabPo.clickOnPostButton();
            expect(await activityTabPo.isTextPresentInNote(notesTemplateBody2)).toBeTruthy();

            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(notesTemplateName3);
            await activityTabPo.clickOnPostButton();
            expect(await activityTabPo.isTextPresentInNote(notesTemplateBody3)).toBeTruthy();
        });
    });

    //ptidke
    describe('[4256]: Consume People Notes Template in People profile', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let newCase1, newCase2;
        let tempNotesTemplateData = cloneDeep(notesTemplateData.NOTES_TEMPLATE_MANDATORY_FIELD);
        beforeAll(async () => {
            tempNotesTemplateData.templateName = tempNotesTemplateData.templateName + randomStr;
            tempNotesTemplateData.body = tempNotesTemplateData.body + randomStr;
            let caseData1 = {
                "Requester": "qdu",
                "Summary": "Testing case creation with minimal input data",
                "Assigned Company": "Petramco",
                "Business Unit": "Canada Support",
                "Support Group": "CA Support 3",
                "Assignee": "qheroux",
            };
            let caseData2 = {
                "Requester": "qtao",
                "Summary": "Testing case creation with minimal input data",
                "Assigned Company": "Petramco",
                "Business Unit": "Canada Support",
                "Support Group": "CA Support 3",
                "Assignee": "qheroux",
            };
            // create People notes template
            await apiHelper.apiLogin('elizabeth');
            await apiHelper.createNotesTemplate("People", tempNotesTemplateData);
            // create case1 & case2
            await apiHelper.apiLogin('qheroux');
            newCase1 = await apiHelper.createCase(caseData1);
            await apiHelper.apiLogin('qdu');
            newCase2 = await apiHelper.createCase(caseData2);
        });
        it('[4256]: Case Agent consume People Notes Template in People profile', async () => {
            await navigationPage.signOut();
            await loginPage.login('qheroux');
            await utilityGrid.searchAndOpenHyperlink(newCase1.displayId);
            await viewCasePage.clickRequsterName();
            await browser.sleep(3000); // Wait unilt profile page gets open
            await utilityCommon.switchToNewTab(1);
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(tempNotesTemplateData.templateName);
            await activityTabPo.clickOnPostButton();
            expect(await activityTabPo.isTextPresentInActivityLog(tempNotesTemplateData.body)).toBeTruthy();
        });
        it('[4256]: Case Agent/Case Manger Should be able to consume People Notes Template in People profile', async () => {
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await utilityGrid.searchAndOpenHyperlink(newCase2.displayId);
            await viewCasePage.clickRequsterName();
            await utilityCommon.switchToNewTab(1);
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(tempNotesTemplateData.templateName);
            await activityTabPo.clickOnPostButton();
            expect(await activityTabPo.isTextPresentInActivityLog(tempNotesTemplateData.body)).toBeTruthy();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qheroux');
        });
    });

    //ptidke
    describe('[4346]: [Run Time] Verify case BA is able to select and utilize Active Task notes templates in Activity for Manual Task', async () => {
        let randomStr: string = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let tempNotesTemplateData, templateManualData, templateManualData1, templateAutomatedData, templateAutomatedData1, templateExternalData, caseResponse1, caseResponse2, caseData, adhocTaskData, notesTemplateGlobalData, notesTemplatePsilonlData, templateExternalData1, caseData1;
        beforeAll(async () => {
            // create task notes template
            tempNotesTemplateData = cloneDeep(notesTemplateData.NOTES_TEMPLATE_MANDATORY_FIELD);
            tempNotesTemplateData.templateName = tempNotesTemplateData.templateName + randomStr + '123';
            tempNotesTemplateData.body = tempNotesTemplateData.body + randomStr + '123';
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createNotesTemplate("Task", tempNotesTemplateData);

            //Creating Global task notes Template
            notesTemplateGlobalData = cloneDeep(notesTemplateData.NOTES_TEMPLATE_MANDATORY_FIELD_GLOBAL);
            notesTemplateGlobalData.templateName = notesTemplateGlobalData.templateName + randomStr + '456';
            notesTemplateGlobalData.body = notesTemplateGlobalData.body + randomStr + '456';
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createNotesTemplate("Task", notesTemplateGlobalData);

            //Creating Global task notes Template
            notesTemplatePsilonlData = cloneDeep(notesTemplateData.NOTES_TEMPLATE_PSILON);
            notesTemplatePsilonlData.templateName = notesTemplatePsilonlData.templateName + randomStr + '789';
            notesTemplatePsilonlData.body = notesTemplatePsilonlData.body + randomStr + '789';
            await apiHelper.apiLogin('gderuno');
            await apiHelper.createNotesTemplate("Task", notesTemplatePsilonlData);

            await apiHelper.apiLogin('qheroux');

            // create manual task template
            templateManualData = {
                "templateName": 'ManualTask' + randomStr,
                "templateSummary": 'Manualtask Summary' + randomStr,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Canada Support",
                "ownerGroup": "CA Support 3",
                "businessUnit": "Canada Support",
                "supportGroup": "CA Support 3",
                "assignee": "qheroux",
            }
            await apiHelper.createManualTaskTemplate(templateManualData);

            templateManualData1 = {
                "templateName": 'ManualTask1' + randomStr,
                "templateSummary": 'Manualtask Summary1' + randomStr,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Canada Support",
                "ownerGroup": "CA Support 3",
            }
            await apiHelper.createManualTaskTemplate(templateManualData1);

            // create Automated task template
            templateAutomatedData = {
                "templateName": 'AutomatedTask' + randomStr,
                "templateSummary": 'AutomatedTask Summary' + randomStr,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": 'Auto Proces' + randomStr,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Canada Support",
                "ownerGroup": "CA Support 3",
                "businessUnit": "Canada Support",
                "supportGroup": "CA Support 3",
                "assignee": "qheroux",
            }
            await apiHelper.createAutomatedTaskTemplate(templateAutomatedData);

            templateAutomatedData1 = {
                "templateName": 'AutomatedTask1' + randomStr,
                "templateSummary": 'AutomatedTask Summary1' + randomStr,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": 'Auto Process1' + randomStr,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Canada Support",
                "ownerGroup": "CA Support 3",
            }
            await apiHelper.createAutomatedTaskTemplate(templateAutomatedData1);

            // create External task template
            templateExternalData = {
                "templateName": 'ExternalTask' + randomStr,
                "templateSummary": 'ExternalTask Summary' + randomStr,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Canada Support",
                "ownerGroup": "CA Support 3",
                "businessUnit": "Canada Support",
                "supportGroup": "CA Support 3",
                "assignee": "qheroux",
            }
            await apiHelper.createExternalTaskTemplate(templateExternalData);

            templateExternalData1 = {
                "templateName": 'ExternalTask1' + randomStr,
                "templateSummary": 'ExternalTask Summary1' + randomStr,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Canada Support",
                "ownerGroup": "CA Support 3",
            }
            await apiHelper.createExternalTaskTemplate(templateExternalData1);

            caseData = {
                "Requester": "qtao",
                "Company": "Petramco",
                "Summary": "Create case for me postman1",
                "Assigned Company": "Petramco",
                "Business Unit": "Canada Support",
                "Support Group": "CA Support 3",
                "Assignee": "qheroux"
            }
            caseResponse1 = await apiHelper.createCase(caseData);

            caseData1 = {
                "Requester": "qtao",
                "Company": "Petramco",
                "Summary": "Create case for me postman1",
                "Assigned Company": "Petramco",
                "Business Unit": "Canada Support",
                "Support Group": "CA Support 3",
                "Assignee": "qheroux"
            }

            caseResponse2 = await apiHelper.createCase(caseData1);

            const automatedTaskData = {
                "company": "Petramco",
                "requesterId": "qtao",
                "templateName": templateAutomatedData.templateName
            }
            await apiHelper.addTaskToCase(automatedTaskData, caseResponse1.id);

            const manualTaskData = {
                "company": "Petramco",
                "requesterId": "qtao",
                "templateName": templateManualData.templateName
            }
            await apiHelper.addTaskToCase(manualTaskData, caseResponse1.id);

            const externalTaskData = {
                "company": "Petramco",
                "requesterId": "qtao",
                "templateName": templateExternalData.templateName
            }

            await apiHelper.addTaskToCase(externalTaskData, caseResponse1.id);

            const automatedTaskData1 = {
                "company": "Petramco",
                "requesterId": "qtao",
                "templateName": templateAutomatedData1.templateName
            }
            await apiHelper.addTaskToCase(automatedTaskData1, caseResponse2.id);

            const manualTaskData1 = {
                "company": "Petramco",
                "requesterId": "qtao",
                "templateName": templateManualData1.templateName
            }
            await apiHelper.addTaskToCase(manualTaskData1, caseResponse2.id);

            const externalTaskData1 = {
                "company": "Petramco",
                "requesterId": "qtao",
                "templateName": templateExternalData1.templateName
            }
            await apiHelper.addTaskToCase(externalTaskData1, caseResponse2.id);

            await apiHelper.updateCaseStatus(caseResponse1.id, 'InProgress');
            await apiHelper.updateCaseStatus(caseResponse2.id, 'InProgress');
        });

        it('[4346]: [Run Time] Verify case BA is able to select and utilize Active Task notes templates in Activity for Manual Task', async () => {
            await utilityGrid.searchAndOpenHyperlink(caseResponse2.displayId);
            await viewCasePage.clickAddTaskButton();
            await manageTask.waitUntilNumberOfTaskLinkAppear(3);
            await manageTask.clickTaskLink(templateManualData1.templateSummary);
            await activityTabPo.clickActivityNoteTextBox();
            await activityTabPo.clickOnNotesTemplate();
            expect(await notesTemplateUsage.isTemplatePresent(tempNotesTemplateData.templateName)).toBeTruthy(); // Notes Template of Petramco visible
            expect(await notesTemplateUsage.isTemplatePresent(notesTemplateGlobalData.templateName)).toBeTruthy();
        });
        it('[4346]: [Run Time] Verify case BA is able to select and utilize Active Task notes templates in Activity for Manual Task', async () => {
            expect(await notesTemplateUsage.isTemplatePresent(notesTemplatePsilonlData.templateName)).toBeFalsy();//Notes Template of Psilon not visible
            await notesTemplateUsage.clickOnCancelBtn();
            await activityTabPo.clickOnCancelButton();

            await viewTaskPo.clickOnChangeStatus();
            await viewTaskPo.changeTaskStatus('Completed');
            await updateStatusBladePo.selectStatusReason('Successful');
            await updateStatusBladePo.clickSaveStatus();

        });
        it('[4346]: [Run Time] Verify case BA is able to select and utilize Active Task notes templates in Activity for Manual Task', async () => {
            await viewTaskPo.clickOnViewCase();
            await viewCasePage.clickAddTaskButton();
            await manageTask.waitUntilNumberOfTaskLinkAppear(3);
            await manageTask.clickTaskLink(templateExternalData1.templateSummary);
            await activityTabPo.clickActivityNoteTextBox();
            await activityTabPo.clickOnNotesTemplate();
            expect(await notesTemplateUsage.isTemplatePresent(tempNotesTemplateData.templateName)).toBeTruthy(); // Notes Template of Petramco not visible
            expect(await notesTemplateUsage.isTemplatePresent(notesTemplateGlobalData.templateName)).toBeTruthy();
        });
        it('[4346]: [Run Time] Verify case BA is able to select and utilize Active Task notes templates in Activity for Manual Task', async () => {
            expect(await notesTemplateUsage.isTemplatePresent(notesTemplatePsilonlData.templateName)).toBeFalsy();//Notes Template of Psilon not visible
            await notesTemplateUsage.clickOnCancelBtn();
            await activityTabPo.clickOnCancelButton();
        });
        it('[4346]: [Run Time] Verify case BA is able to select and utilize Active Task notes templates in Activity for Manual Task', async () => {
            await viewTaskPo.clickOnViewCase();
            await viewCasePage.clickAddTaskButton();
            await manageTask.waitUntilNumberOfTaskLinkAppear(3);
            await manageTask.clickTaskLink(templateAutomatedData1.templateSummary);
            await activityTabPo.clickActivityNoteTextBox();
            await activityTabPo.clickOnNotesTemplate();
            expect(await notesTemplateUsage.isTemplatePresent(tempNotesTemplateData.templateName)).toBeTruthy(); // Notes Template of Petramco not visible
            expect(await notesTemplateUsage.isTemplatePresent(notesTemplateGlobalData.templateName)).toBeTruthy();
        });
        it('[4346]: [Run Time] Verify case BA is able to select and utilize Active Task notes templates in Activity for Manual Task', async () => {
            expect(await notesTemplateUsage.isTemplatePresent(notesTemplatePsilonlData.templateName)).toBeFalsy();//Notes Template of Psilon not visible
            await notesTemplateUsage.clickOnCancelBtn();
            await activityTabPo.clickOnCancelButton();
        });
        it('[4346]: [Run Time] Verify case BA is able to select and utilize Active Task notes templates in Activity for Manual Task', async () => {
            await apiHelper.updateCaseStatus(caseResponse2.id, 'InProgress');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseResponse2.displayId);
            await viewCasePage.clickAddTaskButton();
            await manageTask.waitUntilNumberOfTaskLinkAppear(3);
            await manageTask.clickTaskLink(templateManualData1.templateSummary);
            await activityTabPo.clickActivityNoteTextBox();
            await activityTabPo.clickOnNotesTemplate();
            expect(await notesTemplateUsage.isTemplatePresent(tempNotesTemplateData.templateName)).toBeTruthy(); // Notes Template of Petramco not visible
            expect(await notesTemplateUsage.isTemplatePresent(notesTemplateGlobalData.templateName)).toBeTruthy();
        });
        it('[4346]: [Run Time] Verify case BA is able to select and utilize Active Task notes templates in Activity for Manual Task', async () => {
            expect(await notesTemplateUsage.isTemplatePresent(notesTemplatePsilonlData.templateName)).toBeFalsy();
            await notesTemplateUsage.clickOnCancelBtn();
            await activityTabPo.clickOnCancelButton();
        });
        it('[4346]: [Run Time] Verify case BA is able to select and utilize Active Task notes templates in Activity for Manual Task', async () => {
            await viewTaskPo.clickOnViewCase();
            await viewCasePage.clickAddTaskButton();
            await manageTask.waitUntilNumberOfTaskLinkAppear(3);
            await manageTask.clickTaskLink(templateAutomatedData1.templateSummary);
            await activityTabPo.clickActivityNoteTextBox();
            await activityTabPo.clickOnNotesTemplate();
            expect(await notesTemplateUsage.isTemplatePresent(tempNotesTemplateData.templateName)).toBeTruthy(); // Notes Template of Petramco not visible
            expect(await notesTemplateUsage.isTemplatePresent(notesTemplateGlobalData.templateName)).toBeTruthy();
        });
        it('[4346]: [Run Time] Verify case BA is able to select and utilize Active Task notes templates in Activity for Manual Task', async () => {
            expect(await notesTemplateUsage.isTemplatePresent(notesTemplatePsilonlData.templateName)).toBeFalsy();//Notes Template of Psilon not visible
            await notesTemplateUsage.clickOnCancelBtn();
            await activityTabPo.clickOnCancelButton();
        });
        it('[4346]: [Run Time] Verify case BA is able to select and utilize Active Task notes templates in Activity for Manual Task', async () => {
            await viewTaskPo.clickOnViewCase();
            await viewCasePage.clickAddTaskButton();
            await manageTask.waitUntilNumberOfTaskLinkAppear(3);
            await manageTask.clickTaskLink(templateExternalData1.templateSummary);
            await activityTabPo.clickActivityNoteTextBox();
            await activityTabPo.clickOnNotesTemplate();
            expect(await notesTemplateUsage.isTemplatePresent(tempNotesTemplateData.templateName)).toBeTruthy(); // Notes Template of Petramco not visible
            expect(await notesTemplateUsage.isTemplatePresent(notesTemplateGlobalData.templateName)).toBeTruthy();
        });
        it('[4346]: [Run Time] Verify case BA is able to select and utilize Active Task notes templates in Activity for Manual Task', async () => {
            expect(await notesTemplateUsage.isTemplatePresent(notesTemplatePsilonlData.templateName)).toBeFalsy();//Notes Template of Psilon not visible
            await notesTemplateUsage.clickOnCancelBtn();
            await activityTabPo.clickOnCancelButton();
        });

        it('[4346]: [Run Time] Verify case BA is able to select and utilize Active Task notes templates in Activity for Manual Task', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseResponse1.displayId);
            await viewCasePage.clickAddTaskButton();
            await manageTask.waitUntilNumberOfTaskLinkAppear(3);
            await manageTask.clickTaskLink(templateManualData.templateSummary);
            await activityTabPo.clickActivityNoteTextBox();
            await activityTabPo.clickOnNotesTemplate();
            expect(await notesTemplateUsage.isTemplatePresent(tempNotesTemplateData.templateName)).toBeTruthy();
            expect(await notesTemplateUsage.isTemplatePresent(notesTemplateGlobalData.templateName)).toBeTruthy();
        });
        it('[4346]: [Run Time] Verify case BA is able to select and utilize Active Task notes templates in Activity for Manual Task', async () => {
            expect(await notesTemplateUsage.isTemplatePresent(notesTemplatePsilonlData.templateName)).toBeFalsy();
            await notesTemplateUsage.clickOnCancelBtn();
            await activityTabPo.clickOnCancelButton();
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(tempNotesTemplateData.templateName);// notes template not shown
            await activityTabPo.addActivityNote('ManualTemplateData');
            await activityTabPo.clickOnPostButton();
            expect(await activityTabPo.isTextPresentInActivityLog('ManualTemplateData' + tempNotesTemplateData.body)).toBeTruthy();
            //Change Task status
            await viewTaskPo.clickOnChangeStatus();
            await viewTaskPo.changeTaskStatus('Completed');
            await updateStatusBladePo.selectStatusReason('Successful');
            await updateStatusBladePo.clickSaveStatus();

        });
        it('[4346]: [Run Time] Verify case BA is able to select and utilize Active Task notes templates in Activity for Manual Task', async () => {
            await viewTaskPo.clickOnViewCase();
            await viewCasePage.clickAddTaskButton();
            await manageTask.waitUntilNumberOfTaskLinkAppear(3);
            await manageTask.clickTaskLink(templateAutomatedData.templateSummary);
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(tempNotesTemplateData.templateName);// notes template not shown
            await activityTabPo.addActivityNote('AutomatedTemplateData');
            await activityTabPo.clickOnPostButton();
            expect(await activityTabPo.isTextPresentInActivityLog('AutomatedTemplateData' + tempNotesTemplateData.body)).toBeTruthy();

            await viewTaskPo.clickOnViewCase();
            await viewCasePage.clickAddTaskButton();
            await manageTask.waitUntilNumberOfTaskLinkAppear(3);
            await manageTask.clickTaskLink(templateExternalData.templateSummary);
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(tempNotesTemplateData.templateName);// notes template not shown
            await activityTabPo.addActivityNote('ExternalTemplateData');
            await activityTabPo.clickOnPostButton();
            expect(await activityTabPo.isTextPresentInActivityLog('ExternalTemplateData' + tempNotesTemplateData.body)).toBeTruthy();
            //Change task status
            await viewTaskPo.clickOnChangeStatus();
            await viewTaskPo.changeTaskStatus('Completed');
            await updateStatusBladePo.selectStatusReason('Successful');
            await updateStatusBladePo.clickSaveStatus();

        });
        it('[4346]: [Run Time] Verify case BA is able to select and utilize Active Task notes templates in Activity for Manual Task', async () => {
            await viewTaskPo.clickOnViewCase();
            await viewCasePage.clickAddTaskButton();
            await manageTask.waitUntilNumberOfTaskLinkAppear(3);
            await manageTask.clickAddAdhocTaskButton();
            await createAdhocTaskPo.setSummary('AdhocTask_DRDMV_16045');
            await createAdhocTaskPo.setDescription("Description");
            await createAdhocTaskPo.selectPriority('Low');
            await createAdhocTaskPo.clickAssignToMeButton();
            await createAdhocTaskPo.clickSaveAdhoctask();
            await utilityCommon.closePopUpMessage();
            await utilityCommon.closeAllBlades();
            await viewCasePage.clickAddTaskButton();
            await manageTask.waitUntilNumberOfTaskLinkAppear(4);
            await manageTask.clickTaskLink('AdhocTask_DRDMV_16045');
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(tempNotesTemplateData.templateName);// notes template not shown
            await activityTabPo.addActivityNote('AdhocTemplateData');
            await activityTabPo.clickOnPostButton();
            expect(await activityTabPo.isTextPresentInActivityLog('AdhocTemplateData' + tempNotesTemplateData.body)).toBeTruthy();
        });
        it('[4346]: [Run Time] Verify case BA is able to select and utilize Active Task notes templates in Activity for Manual Task', async () => {
            await navigationPage.gotoPersonProfile();
            expect(await activityTabPo.isTextPresentInActivityLog('AdhocTemplateData' + tempNotesTemplateData.body)).toBeTruthy();
            expect(await activityTabPo.isTextPresentInActivityLog('AutomatedTemplateData' + tempNotesTemplateData.body)).toBeTruthy();
        });
        it('[4346]: [Run Time] Verify case BA is able to select and utilize Active Task notes templates in Activity for Manual Task', async () => {
            expect(await activityTabPo.isTextPresentInActivityLog('ManualTemplateData' + tempNotesTemplateData.body)).toBeTruthy();
            expect(await activityTabPo.isTextPresentInActivityLog('ExternalTemplateData' + tempNotesTemplateData.body)).toBeTruthy();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        });
    });

    //ptidke
    it('[4345]: [Run Time] Validate that case BA is able to select and utilize Active Knowledge notes templates in Knowledge Article ', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let tempNotesTemplateData = cloneDeep(notesTemplateData.NOTES_TEMPLATE_MANDATORY_FIELD);
        tempNotesTemplateData.templateName = tempNotesTemplateData.templateName + randomStr;
        tempNotesTemplateData.body = tempNotesTemplateData.body + randomStr;
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createNotesTemplate("Knowledge", tempNotesTemplateData);
        //create Knowledge
        await navigationPage.gotoCreateKnowledge();
        expect(await browser.getTitle()).toBe('Knowledge Article Templates Preview - Business Workflows');
        await createKnowlegePo.clickOnTemplate('Reference');
        await createKnowlegePo.clickOnUseSelectedTemplateButton();
        await createKnowlegePo.addTextInKnowlegeTitleField('test case for 4230');
        await createKnowlegePo.selectKnowledgeSet('HR');
        await createKnowlegePo.clickOnSaveKnowledgeButton();
        await previewKnowledgePo.clickGoToArticleButton();

        // View Knowledege Page
        await utilityCommon.closePopUpMessage();
        await viewKnowledgeArticlePo.clickOnTab('Activity');
        await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(tempNotesTemplateData.templateName);
        await activityTabPo.clickOnPostButton();
        expect(await activityTabPo.isTextPresentInActivityLog(tempNotesTemplateData.body)).toBeTruthy();
    });
    //asahitya
    describe('[4373]: [DesignTime] Verify "Case Notes templates", grid operation searching , sorting columns and filter on company', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let notesTemplateInactiveData;
        let notesTemplatePetramcoData;
        let notesTemplateGlobalData;
        let notesTemplateWithLabelData;
        let templateGuid;
        beforeAll(async () => {
            //Creating Petramco Template
            notesTemplatePetramcoData = cloneDeep(notesTemplateData.NOTES_TEMPLATE_MANDATORY_FIELD);
            notesTemplatePetramcoData.templateName = notesTemplatePetramcoData.templateName + randomStr + '123';
            notesTemplatePetramcoData.body = notesTemplatePetramcoData.body + randomStr + '123';
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createNotesTemplate("Case", notesTemplatePetramcoData);

            //Creating Global Template
            notesTemplateGlobalData = cloneDeep(notesTemplateData.NOTES_TEMPLATE_MANDATORY_FIELD_GLOBAL);
            notesTemplateGlobalData.templateName = notesTemplateGlobalData.templateName + randomStr + '456';
            notesTemplateGlobalData.body = notesTemplateGlobalData.body + randomStr + '456';
            await apiHelper.createNotesTemplate("Case", notesTemplateGlobalData);

            //Creating Inactive Template
            notesTemplateInactiveData = cloneDeep(notesTemplateData.NOTES_TEMPLATE_CASE_INACTIVE);
            notesTemplateInactiveData.templateName = notesTemplateInactiveData.templateName + randomStr + '789';
            await apiHelper.createNotesTemplate("Case", notesTemplateInactiveData);

            notesTemplateWithLabelData = {
                "templateName": "Notes template with label",
                "company": "Petramco",
                "templateStatus": 2,
                "body": "this is template description",
                "label": "Payroll"
            }
            //Creating Template with Label
            notesTemplateWithLabelData.templateName = notesTemplateWithLabelData.templateName + randomStr;
            await apiHelper.createNotesTemplate("Case", notesTemplateWithLabelData);
        });
        it('[4373]: [DesignTime] Verify "Case Notes templates", grid operation searching , sorting columns and filter on company', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Notes Template', BWF_PAGE_TITLES.CASE_MANAGEMENT.NOTES_TEMPLATES);

            let columnNameArray:string[] =['Label', 'ID'];
            await consoleNotesTemplatePo.addColumns(columnNameArray);
            await utilityGrid.searchRecord(notesTemplateInactiveData.templateName);
            expect(await utilityGrid.getNumberOfRecordsInGrid()).toEqual(1);
            templateGuid = await consoleNotesTemplatePo.getGuidValue();
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Company', 'Petramco', 'text');
            expect(await utilityGrid.isGridRecordPresent(notesTemplatePetramcoData.templateName)).toBeTruthy('Petramco Company Filter is not applied');
            expect(await utilityGrid.isGridRecordPresent(notesTemplateGlobalData.templateName)).toBeFalsy('Petramco Company Filter is not applied');
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Company', '- Global -', 'text');
            expect(await utilityGrid.isGridRecordPresent(notesTemplatePetramcoData.templateName)).toBeFalsy('Global Company Filter is not applied');
            expect(await utilityGrid.isGridRecordPresent(notesTemplateGlobalData.templateName)).toBeTruthy('Global Company Filter is not applied');
        });
        it('[4373]: [DesignTime] Verify "Case Notes templates", grid operation searching , sorting columns and filter on company', async () => {
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Status', 'Inactive', 'checkbox');
            expect(await utilityGrid.isGridRecordPresent(notesTemplatePetramcoData.templateName)).toBeFalsy('Status Filter is not applied');
            expect(await utilityGrid.isGridRecordPresent(notesTemplateInactiveData.templateName)).toBeTruthy('Status Filter is not applied');
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Template Name', notesTemplatePetramcoData.templateName, 'text');
            expect(await utilityGrid.isGridRecordPresent(notesTemplatePetramcoData.templateName)).toBeTruthy('Template Name Filter is not applied');
            expect(await utilityGrid.isGridRecordPresent(notesTemplateInactiveData.templateName)).toBeFalsy('Template Name Filter is not applied');
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Label','Payroll', 'text');
            expect(await utilityGrid.isGridRecordPresent(notesTemplateWithLabelData.templateName)).toBeTruthy('Label Filter is not applied');
            expect(await utilityGrid.isGridRecordPresent(notesTemplateInactiveData.templateName)).toBeFalsy('Label Filter is not applied');
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('ID', templateGuid, 'text');
            expect(await utilityGrid.isGridRecordPresent(notesTemplateInactiveData.templateName)).toBeTruthy('ID Filter is not applied');
            expect(await utilityGrid.isGridRecordPresent(notesTemplateWithLabelData.templateName)).toBeFalsy('ID Filter is not applied');
            await consoleNotesTemplatePo.removeColumns(['Label', 'ID']);
        });
        it('[4373]: [DesignTime] Verify "Case Notes templates", grid operation searching , sorting columns and filter on company', async () => {
            await utilityGrid.clearSearchBox();
            await utilityGrid.clearFilter();
            expect(await consoleNotesTemplatePo.isGridColumnSorted('Status')).toBeTruthy('Column is not sorted');
            expect(await consoleNotesTemplatePo.isGridColumnSorted('Template Name')).toBeTruthy('Column is not sorted');
        });
        afterAll(async () => {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await utilityCommon.closeAllBlades();
            await navigationPage.gotoCaseConsole();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //asahitya
    describe('[4342,4370]: Verify People notes template / Task Note template should not be displayed on case in activity template and vice versa for all other', () => {
        let response1 = undefined;
        let response2 = undefined;
        let response3 = undefined;
        let caseActiveTemplateName: string = undefined;
        let taskActiveTemplateName: string = undefined;
        let peopleActiveTemplateName: string = undefined;
        let knowledgeActiveTemplateName: string = undefined;
        let caseInactiveTemplateName: string = undefined;
        let taskInactiveTemplateName: string = undefined;
        let peopleInactiveTemplateName: string = undefined;
        let knowledgeInactiveTemplateName: string = undefined;

        beforeAll(async () => {
            let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            //Creating Active Case Notes Template
            let activeCaseTemplateData = cloneDeep(notesTemplateData.NOTES_TEMPLATE_MANDATORY_FIELD);
            caseActiveTemplateName = activeCaseTemplateData.templateName + randomStr + 'Case';
            activeCaseTemplateData.templateName = caseActiveTemplateName;
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createNotesTemplate("Case", activeCaseTemplateData);

            //Creating Active Task Notes Template
            let activeTaskTemplateData = cloneDeep(notesTemplateData.NOTES_TEMPLATE_TASK);
            taskActiveTemplateName = activeTaskTemplateData.templateName + randomStr + 'Task';
            activeTaskTemplateData.templateName = taskActiveTemplateName;
            await apiHelper.createNotesTemplate("Task", activeTaskTemplateData);

            //Creating Active Knowledge Notes Template
            let activeKnowledgeTemplateData = cloneDeep(notesTemplateData.NOTES_TEMPLATE_KNOWLEDGE_ARTICLE);
            knowledgeActiveTemplateName = activeKnowledgeTemplateData.templateName + randomStr + 'Article';
            activeKnowledgeTemplateData.templateName = knowledgeActiveTemplateName;
            await apiHelper.createNotesTemplate("Knowledge", activeKnowledgeTemplateData);

            //Creating Active People Notes Template
            let activePeopleTemplateData = cloneDeep(notesTemplateData.NOTES_TEMPLATE_PEOPLE);
            peopleActiveTemplateName = activePeopleTemplateData.templateName + randomStr + 'People';
            activePeopleTemplateData.templateName = peopleActiveTemplateName;
            await apiHelper.createNotesTemplate("People", activePeopleTemplateData);

            //Creating Inactive Case Notes Template
            let inactiveCaseTemplateData = cloneDeep(notesTemplateData.NOTES_TEMPLATE_CASE_INACTIVE);
            caseInactiveTemplateName = inactiveCaseTemplateData.templateName + randomStr + 'Case';
            inactiveCaseTemplateData.templateName = caseInactiveTemplateName;
            await apiHelper.createNotesTemplate("Case", inactiveCaseTemplateData);

            //Creating Inactive Task Notes Template
            let inactiveTaskTemplateData = cloneDeep(notesTemplateData.NOTES_TEMPLATE_TASK_INACTIVE);
            taskInactiveTemplateName = inactiveTaskTemplateData.templateName + randomStr + 'Task';
            inactiveTaskTemplateData.templateName = taskInactiveTemplateName;
            await apiHelper.createNotesTemplate("Task", inactiveTaskTemplateData);

            //Creating Inactive Knowledge Notes Template
            let inactiveKnowledgeTemplateData = cloneDeep(notesTemplateData.NOTES_TEMPLATE_KNOWLEDGE_INACTIVE);
            knowledgeInactiveTemplateName = inactiveKnowledgeTemplateData.templateName + randomStr + 'Article';
            inactiveKnowledgeTemplateData.templateName = knowledgeInactiveTemplateName;
            await apiHelper.createNotesTemplate("Knowledge", inactiveKnowledgeTemplateData);

            //Creating Inactive People Notes Template
            let inactivePeopleTemplateData = cloneDeep(notesTemplateData.NOTES_TEMPLATE_PEOPLE_INACTIVE);
            peopleInactiveTemplateName = inactivePeopleTemplateData.templateName + randomStr + 'People';
            inactivePeopleTemplateData.templateName = peopleInactiveTemplateName;
            await apiHelper.createNotesTemplate("People", inactivePeopleTemplateData);

            //Creating the Run time data
            let caseData = require('../../data/ui/case/case.ui.json');
            response1 = await apiHelper.createCase(caseData['simpleCase']);
            let taskData = {
                "taskName": "4342",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qfeng"
            }
            response2 = await apiHelper.createAdhocTask(response1.id, taskData);
            let articleData = {
                "knowledgeSet": "HR",
                "title": '4342',
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United States Support",
                "assigneeSupportGroup": "US Support 1",
                "assignee": "kayo"
            }
            response3 = await apiHelper.createKnowledgeArticle(articleData);
        });

        it('[4342,4370]: Verify People notes template / Task Note template should not be displayed on case in activity template and vice versa for all other', async () => {
            //Validating the Case Notes
            await utilityGrid.searchAndOpenHyperlink(response1.displayId);
            await activityTabPo.clickActivityNoteTextBox();
            await activityTabPo.clickOnNotesTemplate();
        });
        it('[4342,4370]: Verify People notes template / Task Note template should not be displayed on case in activity template and vice versa for all other', async () => {
            expect(await notesTemplateUsage.isTemplatePresent(taskActiveTemplateName)).toBeFalsy();
            expect(await notesTemplateUsage.isTemplatePresent(knowledgeActiveTemplateName)).toBeFalsy();
        });
        it('[4342,4370]: Verify People notes template / Task Note template should not be displayed on case in activity template and vice versa for all other', async () => {
            expect(await notesTemplateUsage.isTemplatePresent(peopleActiveTemplateName)).toBeFalsy();
            expect(await notesTemplateUsage.isTemplatePresent(caseInactiveTemplateName)).toBeFalsy();
            await notesTemplateUsage.clickOnCancelBtn();
        });

        it('[4342,4370]: Verify People notes template / Task Note template should not be displayed on case in activity template and vice versa for all other', async () => {
            //Validating the Task Notes
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(response2.displayId);
            await activityTabPo.clickActivityNoteTextBox();
            await activityTabPo.clickOnNotesTemplate();
        });
        it('[4342,4370]: Verify People notes template / Task Note template should not be displayed on case in activity template and vice versa for all other', async () => {
            expect(await notesTemplateUsage.isTemplatePresent(caseActiveTemplateName)).toBeFalsy();
            expect(await notesTemplateUsage.isTemplatePresent(knowledgeActiveTemplateName)).toBeFalsy();
        });
        it('[4342,4370]: Verify People notes template / Task Note template should not be displayed on case in activity template and vice versa for all other', async () => {
            expect(await notesTemplateUsage.isTemplatePresent(peopleActiveTemplateName)).toBeFalsy();
            expect(await notesTemplateUsage.isTemplatePresent(taskInactiveTemplateName)).toBeFalsy();
            await notesTemplateUsage.clickOnCancelBtn();
        });

        it('[4342,4370]: Verify People notes template / Task Note template should not be displayed on case in activity template and vice versa for all other', async () => {
            //Validating the People Notes
            await navigationPage.gotoQuickCase();
            await navigationPage.gotoPersonProfile();
            await relatedTabPage.addRelatedPerson();
            await addRelatedPopupPage.addPerson('qdu', 'Manager');
            await relatedTabPage.clickRelatedPersonName('Qiang Du');
            await utilityCommon.switchToNewTab(1);
            await browser.sleep(3000); //Wait untile redirect to  person profile page
            await activityTabPo.clickActivityNoteTextBox();
            await activityTabPo.clickOnNotesTemplate();
        });
        it('[4342,4370]: Verify People notes template / Task Note template should not be displayed on case in activity template and vice versa for all other', async () => {
            expect(await notesTemplateUsage.isTemplatePresent(caseActiveTemplateName)).toBeFalsy();
            expect(await notesTemplateUsage.isTemplatePresent(taskActiveTemplateName)).toBeFalsy();
        });
        it('[4342,4370]: Verify People notes template / Task Note template should not be displayed on case in activity template and vice versa for all other', async () => {
            expect(await notesTemplateUsage.isTemplatePresent(knowledgeActiveTemplateName)).toBeFalsy();
            expect(await notesTemplateUsage.isTemplatePresent(peopleInactiveTemplateName)).toBeFalsy();
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        });

        it('[4342,4370]: Verify People notes template / Task Note template should not be displayed on case in activity template and vice versa for all other', async () => {
            //Validating the Knowledge Notes
            await navigationPage.gotoKnowledgeConsole();
            await utilityGrid.searchAndOpenHyperlink(response3.displayId);
            await viewKnowledgeArticlePo.clickOnTab('Activity');
            await activityTabPo.clickActivityNoteTextBox();
            await activityTabPo.clickOnNotesTemplate();
        });
        it('[4342,4370]: Verify People notes template / Task Note template should not be displayed on case in activity template and vice versa for all other', async () => {
            expect(await notesTemplateUsage.isTemplatePresent(caseActiveTemplateName)).toBeFalsy();
            expect(await notesTemplateUsage.isTemplatePresent(taskActiveTemplateName)).toBeFalsy();
        });
        it('[4342,4370]: Verify People notes template / Task Note template should not be displayed on case in activity template and vice versa for all other', async () => {
            expect(await notesTemplateUsage.isTemplatePresent(peopleActiveTemplateName)).toBeFalsy();
            expect(await notesTemplateUsage.isTemplatePresent(knowledgeInactiveTemplateName)).toBeFalsy();
            await notesTemplateUsage.clickOnCancelBtn();
        });

        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        });
    });

    //asahitya
    describe('[4298]: Verify Case Notes template is displayed as per to be assignee company(operating organisation)', () => {
        let petramcoTemplateName = undefined;
        let psilonTemplateName = undefined;
        let globalTemplateName = undefined;
        let petramcoCaseResponse = undefined;
        let psilonCaseResponse = undefined;

        beforeAll(async () => {
            await apiHelper.apiLogin('qheroux');
            let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let petramcoNotesTemplateData = cloneDeep(notesTemplateData.NOTES_TEMPLATE_MANDATORY_FIELD);
            petramcoTemplateName = petramcoNotesTemplateData.templateName + randomStr + 'Petramco';
            petramcoNotesTemplateData.templateName = petramcoTemplateName;
            await apiHelper.createNotesTemplate('Case', petramcoNotesTemplateData);

            let psilonNotesTemplateData = cloneDeep(notesTemplateData.NOTES_TEMPLATE_PSILON);
            psilonTemplateName = psilonNotesTemplateData.templateName + randomStr + 'Psilon';
            psilonNotesTemplateData.templateName = psilonTemplateName;
            await apiHelper.createNotesTemplate('Case', psilonNotesTemplateData);

            let globalNotesTemplateData = cloneDeep(notesTemplateData.NOTES_TEMPLATE_MANDATORY_FIELD_GLOBAL);
            globalTemplateName = globalNotesTemplateData.templateName + randomStr + 'Global';
            globalNotesTemplateData.templateName = globalTemplateName;
            await apiHelper.createNotesTemplate('Case', globalNotesTemplateData);

            let caseDataPetramco = {
                "Description": "4298 Petramco",
                "Requester": "qkatawazi",
                "Summary": "4298 Petramco",
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qfeng"
            }
            petramcoCaseResponse = await apiHelper.createCase(caseDataPetramco);

            let caseDataPsilon = {
                "Description": "4298 Psilon",
                "Requester": "gderuno",
                "Summary": "4298 Psilon",
                "Assigned Company": "Psilon",
                "Business Unit": "Psilon Support Org2",
                "Support Group": "Psilon Support Group2",
                "Assignee": "gwixillian"
            }
            psilonCaseResponse = await apiHelper.createCase(caseDataPsilon);
        });

        it('[4298]: Verify Case Notes template is displayed as per to be assignee company(operating organisation)', async () => {
            await navigationPage.signOut();
            await loginPage.login('qheroux');
            await utilityGrid.searchAndOpenHyperlink(petramcoCaseResponse.displayId);
            await activityTabPo.clickActivityNoteTextBox();
            await activityTabPo.clickOnNotesTemplate();
        });
        it('[4298]: Verify Case Notes template is displayed as per to be assignee company(operating organisation)', async () => {
            expect(await notesTemplateUsage.isTemplatePresent(psilonTemplateName)).toBeFalsy();
            await notesTemplateUsage.clickOnCancelBtn();
            await activityTabPo.clickOnCancelButton();
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(petramcoTemplateName);
            await activityTabPo.clickOnPostButton();
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(globalTemplateName);
            await activityTabPo.clickOnPostButton();
        });
        it('[4298]: Verify Case Notes template is displayed as per to be assignee company(operating organisation)', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(psilonCaseResponse.displayId);
            await activityTabPo.clickActivityNoteTextBox();
            await activityTabPo.clickOnNotesTemplate();
        });
        it('[4298]: Verify Case Notes template is displayed as per to be assignee company(operating organisation)', async () => {
            expect(await notesTemplateUsage.isTemplatePresent(petramcoTemplateName)).toBeFalsy();
            await notesTemplateUsage.clickOnCancelBtn();
            await activityTabPo.clickOnCancelButton();
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(psilonTemplateName);
            await activityTabPo.clickOnPostButton();
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(globalTemplateName);
            await activityTabPo.clickOnPostButton();
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        });
    });

    describe('[3445,3441,3437]: Verify CKE functionality on Create and Edit Case Notes template', async () => {
        let templateName: string, newCase, readAccessMappingData, randomString = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            let caseData = {
                "Requester": "qtao",
                "Company": "Petramco",
                "Summary": "Create case for me postman1" + randomString,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "Qiao Feng",
                "priority": "Low",
            };
            readAccessMappingData = {
                "configName": randomString + '1ReadAccessMappingName',
                "assignedCompany": 'Petramco',
                "businessUnit": 'Australia Support',
                "supportGroup": 'AU Support 1',
                "company": 'Petramco',
                "priority": "Low",
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createReadAccessMapping(readAccessMappingData);
            newCase = await apiHelper.createCase(caseData);
        });
        it('[3445,3441,3437]: Verify CKE functionality on Create and Edit Case Notes template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Notes Template', BWF_PAGE_TITLES.CASE_MANAGEMENT.NOTES_TEMPLATES);
            await consoleNotesTemplatePo.clickOnCreateNotesTemplate();
            templateName = "caseNotesTemplate" + Math.floor(Math.random() * 100000);
            await createNotesTemplate.setTemplateName(templateName);
            await createNotesTemplate.setStatusValue('Active');
            await createNotesTemplate.setCompanyValue('Petramco');
            await createNotesTemplate.setBody("this is new actiivty notes template");
            // bold
            await ckeditorOpsPo.updateDescription("this is text ");
            await ckeditorOpsPo.clickOnBoldIcon();
            await ckeditorOpsPo.updateDescription(boldText);
            expect(await ckeditorValidationPo.isBoldTextDisplayedInCkEditorTextArea(boldText)).toBeTruthy('Text is not get Bold In Ck Editor');
            await ckeditorOpsPo.clickOnBoldIcon();
            //italic
            await ckeditorOpsPo.clickOnItalicIcon();
            await ckeditorOpsPo.updateDescription(italicText+'\n');
            expect(await ckeditorValidationPo.isItalicTextDisplayedInCkEditorTextArea(italicText)).toBeTruthy('Text is not Italic In Ck Editor');
            await ckeditorOpsPo.clickOnItalicIcon();
            //StrikeThrough
            await ckeditorOpsPo.clickOnStrikeThroughIcon();
            await ckeditorOpsPo.updateDescription(strikeThroughText+'\n');
            expect(await ckeditorValidationPo.isStrikeThroughTextDisplayedInCkEditorTextArea(strikeThroughText)).toBeTruthy('Text is not Strike Through In Ck Editor');
            await ckeditorOpsPo.clickOnStrikeThroughIcon();
            //underline
            await ckeditorOpsPo.clickOnUnderLineIcon();
            await ckeditorOpsPo.updateDescription(underLineText);
            expect(await ckeditorValidationPo.isUnderlineTextDisplayedInCkEditorTextArea(underLineText)).toBeTruthy('Text is not Underline In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnUnderLineIcon();
        });
        it('[3445,3441,3437]: Verify CKE functionality on Create and Edit Case Notes template', async () => {
            //left Align
            await ckeditorOpsPo.clickOnLeftAlignIcon();
            await ckeditorOpsPo.updateDescription(lefAlignText);
            expect(await ckeditorValidationPo.isTextLeftAlignInCkEditorTextArea(lefAlignText)).toBeTruthy('Text is not Left Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnLeftAlignIcon();
            //Right Align
            await ckeditorOpsPo.clickOnRightAlignIcon();
            await ckeditorOpsPo.updateDescription(rightAlignText);
            expect(await ckeditorValidationPo.isTextRightAlignInCkEditorTextArea(rightAlignText)).toBeTruthy('Text is not right Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnRightAlignIcon();
            //Center Align
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            await ckeditorOpsPo.updateDescription(centerAlignText);
            expect(await ckeditorValidationPo.isTextCenterAlignInCkEditorTextArea(centerAlignText)).toBeTruthy('Text is not center Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            //Justify Align
            await ckeditorOpsPo.clickOnJustifyAlignIcon();
            await ckeditorOpsPo.updateDescription(justifyAlignText);
            expect(await ckeditorValidationPo.isTextJustifyAlignInCkEditorTextArea(justifyAlignText)).toBeTruthy('Text is not justify Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnJustifyAlignIcon();
            //set color
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.selectColor('Strong Red');
            await ckeditorOpsPo.updateDescription(redColorText);
            expect(await ckeditorValidationPo.isColorTextDisplayedInCkEditorTextArea(redColorText, 'color:#c0392b;')).toBeTruthy('Color is not set In Ck Editor');
            //checking number list
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.setNumberList(['PlusOne']);
            expect(await ckeditorValidationPo.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('Number List is not In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            // checking bullot points
            await ckeditorOpsPo.setBulletList(['BulletOne']);
            expect(await ckeditorValidationPo.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('Bulleted List is not In Ck Editor');
            expect(await ckeditorValidationPo.getTextCkEditorMinimizeOrMiximize()).toBe('Maximize');
            await ckeditorOpsPo.clickMaximizeMinimizeIcon();
            expect(await ckeditorValidationPo.getTextCkEditorMinimizeOrMiximize()).toBe('Minimize');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickMaximizeMinimizeIcon();
        });
        it('[3445,3441,3437]: Verify CKE functionality on Create and Edit Case Notes template', async () => {
            //add style
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.updateDescription(formatText);
            await ckeditorOpsPo.selectStyles('Heading 2');
            expect(await ckeditorValidationPo.isStyleApplied(formatText, 'h2')).toBeTruthy('Heading not set');
            //add Font Size 
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.updateDescription(fontText);
            await ckeditorOpsPo.selectFont('11');
            expect(await ckeditorValidationPo.isFontApplied(11, 'span')).toBeTruthy('Font not set');
            //upload image with URL
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnImageIcon();
            await ckeditorOpsPo.imageUploadWithURL(uploadURL, imageUrlFieldIndex, imageWidthFieldIndex, '100');
            expect(await ckeditorValidationPo.isImageDisplayedInCKE(uploadURL)).toBeTruthy('Image with URL not uploaded');
            //upload image with Local
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnImageIcon();
            imageSource = await ckeditorOpsPo.uploadImageFromLocal('Upload', '../../../data/ui/attachment/articleStatus.png', imageWidthFieldIndex, imageUrlFieldIndex, '50');
            expect(await ckeditorValidationPo.isImageDisplayedInCKE(imageSource)).toBeTruthy();
            // Link added
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('Google', linkDisplayTextFieldIndex);
            await linkPropertiesPo.setValueOfLinkProperties('www.google.com', linkUrlFieldIndex);
            await linkPropertiesPo.clickOnTargetTab();
            await linkPropertiesPo.selectDropDown('_blank', linkTargetDropDownIndex);
            await linkPropertiesPo.clickOnOkBtn();
            expect(await ckeditorValidationPo.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('Link is not In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            //add table
            await ckeditorOpsPo.clickOnTableIcon();
            await tablePropertiesPo.setValueOfTableProperties('4', tableRowFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('10', tableColumnFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('500', tableWidthFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('200', tableHeightFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('new' + randomString, cellCaption);
            await tablePropertiesPo.setValueOfTableProperties('tableSummary', cellSummary);
            await tablePropertiesPo.clickOnOkButton();
            await ckeditorOpsPo.clickInTableCell(2, 2, 'tableSummary');
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            await ckeditorOpsPo.setDataInTable(2, 2, randomString, 'tableSummary');
            await ckeditorOpsPo.clickInTableCell(1, 2, 'tableSummary');
            await ckeditorOpsPo.clickOnRightAlignIcon();
            await ckeditorOpsPo.setDataInTable(1, 2, randomString, 'tableSummary');
            expect(await ckeditorValidationPo.getTableCellAlignText("text-align: center;")).toContain(randomString);
            await createNotesTemplate.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
        });
        it('[3445,3441,3437]: Verify CKE functionality on Create and Edit Case Notes template', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await utilityGrid.searchAndOpenHyperlink(newCase.displayId);
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(templateName);
            await activityTabPo.addActivityNote(randomString);
            await utilityCommon.closePopUpMessage();
            await activityTabPo.clickOnRefreshButton();
            expect(await ckeditorValidationPo.isBoldTextDisplayedInCkEditorTextArea(boldText)).toBeTruthy('Text is not get Bold In Ck Editor');
            expect(await ckeditorValidationPo.isItalicTextDisplayedInCkEditorTextArea(italicText)).toBeTruthy('Text is not Italic In Ck Editor');
            expect(await ckeditorValidationPo.isUnderlineTextDisplayedInCkEditorTextArea(underLineText)).toBeTruthy('Text is not Underline In Ck Editor');
            expect(await ckeditorValidationPo.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('Text is not center Align In Ck Editor');
            expect(await ckeditorValidationPo.isTextLeftAlignInCkEditorTextArea(lefAlignText)).toBeTruthy('Text is not Left Align In Ck Editor');
            expect(await ckeditorValidationPo.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('Text is not center Align In Ck Editor');
            expect(await ckeditorValidationPo.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('Text is not center Align In Ck Editor');
            await activityTabPo.clickOnPostButton();
            await utilityCommon.closePopUpMessage();
            await activityTabPo.clickOnRefreshButton();
            await activityTabPo.clickShowMoreLinkInActivity(1);
            expect(await activityTabPo.isBoldTextDisplayedInActivity(boldText, 1)).toBeTruthy('FailureMsg Bold Text is missing in Activity');
            expect(await activityTabPo.isItalicTextDisplayedInActivity(italicText, 1)).toBeTruthy('FailureMsg Italic Text is missing In Activity');
            expect(await activityTabPo.isUnderlineTextDisplayedInActivity(underLineText, 1)).toBeTruthy('FailureMsg Underline Text is missing In Activity');
            expect(await activityTabPo.isRightAlignTextDisplayedInActivity(rightAlignText, 1)).toBeTruthy('FailureMsg Right Align Text is missing In Activity');
            expect(await activityTabPo.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 1)).toBeTruthy('FailureMsg Link Text is missing In Activity');
            expect(await activityTabPo.isNumberListTextDisplayedInActivity('PlusOne', 1)).toBeTruthy('FailureMsg Number List Text is missing In Activity');
            expect(await activityTabPo.isBulletListTextDisplayedInActivity('BulletOne', 1)).toBeTruthy('FailureMsg Bullet List Text is missing In Activity');
            expect(await ckeditorValidationPo.isTableCaptionDisplayedInCkEditorTextArea('tableSummary', 'new' + randomString)).toBeTruthy('Text is not Left Align In Ck Editor');
            expect(await ckeditorValidationPo.isTableSummaryDisplayedInCkEditorTextArea('tableSummary')).toBeTruthy('Text is not Left Align In Ck Editor');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.setSummary('NotesTemplateCase1' + randomString);
            await createCasePo.setPriority('Low');
            await createCasePo.clickAssignToMeButton();
            await createCasePo.clickSaveCaseButton();
            await casePreviewPo.clickGoToCaseButton();
            await viewCasePage.clickOnTab('Case Access');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('US Support 3', 'Write')).toBeTruthy('Support Group does not have read access');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('AU Support 1', 'Read')).toBeTruthy('Support Group does not have read access');
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(templateName);
            await activityTabPo.addActivityNote(randomString);
            await activityTabPo.clickOnPostButton();
            await utilityCommon.closePopUpMessage();
            await activityTabPo.clickOnRefreshButton();
            await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.isBoldTextDisplayedInActivity(boldText, 1)).toBeTruthy('FailureMsg Bold Text is missing in Activity');
            expect(await activityTabPo.isItalicTextDisplayedInActivity(italicText, 1)).toBeTruthy('FailureMsg Italic Text is missing In Activity');
            expect(await activityTabPo.isUnderlineTextDisplayedInActivity(underLineText, 1)).toBeTruthy('FailureMsg Underline Text is missing In Activity');
            expect(await activityTabPo.isRightAlignTextDisplayedInActivity(rightAlignText, 1)).toBeTruthy('FailureMsg Right Align Text is missing In Activity');
            expect(await activityTabPo.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 1)).toBeTruthy('FailureMsg Link Text is missing In Activity');
            expect(await activityTabPo.isNumberListTextDisplayedInActivity('PlusOne', 1)).toBeTruthy('FailureMsg Number List Text is missing In Activity');
            expect(await activityTabPo.isBulletListTextDisplayedInActivity('BulletOne', 1)).toBeTruthy('FailureMsg Bullet List Text is missing In Activity');
            expect(await ckeditorValidationPo.isTableCaptionDisplayedInCkEditorTextArea('tableSummary', 'new' + randomString)).toBeTruthy('Text is not Left Align In Ck Editor');
            expect(await ckeditorValidationPo.isTableSummaryDisplayedInCkEditorTextArea('tableSummary')).toBeTruthy('Text is not Left Align In Ck Editor');

            await viewCasePage.clickOnTab('Case Access');
            await accessTabPo.clickToExpandAccessEntitiySearch('Support Group Access', 'Case');
            await accessTabPo.selectAccessEntityDropDown('GB Support 2', 'Select Support Group');
            await accessTabPo.clickAssignWriteAccessCheckbox('Support Group');
            await accessTabPo.clickAccessEntitiyAddButton('Support Group');
        });
        it('[3445,3441,3437]: Verify CKE functionality on Create and Edit Case Notes template', async () => {
            await navigationPage.signOut();
            await loginPage.login('qliu');
            await utilityGrid.searchAndOpenHyperlink('NotesTemplateCase1' + randomString);
            await utilityCommon.closePopUpMessage();
            await activityTabPo.clickOnRefreshButton();
            await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.isBoldTextDisplayedInActivity(boldText, 3)).toBeTruthy('FailureMsg1: Bold Text is missing in Activity');
            expect(await activityTabPo.isItalicTextDisplayedInActivity(italicText, 3)).toBeTruthy('FailureMsg2: Italic Text is missing In Activity');
            expect(await activityTabPo.isUnderlineTextDisplayedInActivity(underLineText, 3)).toBeTruthy('FailureMsg3: Underline Text is missing In Activity');
            expect(await activityTabPo.isRightAlignTextDisplayedInActivity(rightAlignText,3)).toBeTruthy('FailureMsg4: Right Align Text is missing In Activity');
            expect(await activityTabPo.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 3)).toBeTruthy('FailureMsg5: Link Text is missing In Activity');
            expect(await activityTabPo.isNumberListTextDisplayedInActivity('PlusOne', 3)).toBeTruthy('FailureMsg6: Number List Text is missing In Activity');
            expect(await activityTabPo.isBulletListTextDisplayedInActivity('BulletOne', 3)).toBeTruthy('FailureMsg7: Bullet List Text is missing In Activity');
            expect(await ckeditorValidationPo.isTableCaptionDisplayedInCkEditorTextArea('tableSummary', 'new' + randomString)).toBeTruthy('FailureMsg8: Text is not Left Align In Ck Editor');
            expect(await ckeditorValidationPo.isTableSummaryDisplayedInCkEditorTextArea('tableSummary')).toBeTruthy('FailureMsg9: Text is not Left Align In Ck Editor');

        });
        it('[3445,3441,3437]: Verify CKE functionality on Create and Edit Case Notes template', async () => {
            await navigationPage.signOut();
            await loginPage.login('qstrong');
            await utilityGrid.searchAndOpenHyperlink('NotesTemplateCase1' + randomString);
            await utilityCommon.closePopUpMessage();
            await activityTabPo.clickOnRefreshButton();
            await activityTabPo.clickShowMoreLinkInActivity(4);
            expect(await activityTabPo.isBoldTextDisplayedInActivity(boldText, 4)).toBeTruthy('FailureMsg10: Bold Text is missing in Activity');
            expect(await activityTabPo.isItalicTextDisplayedInActivity(italicText, 4)).toBeTruthy('FailureMsg11: Italic Text is missing In Activity');
            expect(await activityTabPo.isUnderlineTextDisplayedInActivity(underLineText, 4)).toBeTruthy('FailureMsg12: Underline Text is missing In Activity');
            expect(await activityTabPo.isRightAlignTextDisplayedInActivity(rightAlignText, 4)).toBeTruthy('FailureMsg13: Right Align Text is missing In Activity');
            expect(await activityTabPo.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 4)).toBeTruthy('FailureMsg13: Link Text is missing In Activity');
            expect(await activityTabPo.isNumberListTextDisplayedInActivity('PlusOne', 4)).toBeTruthy('FailureMsg14: Number List Text is missing In Activity');
            expect(await activityTabPo.isBulletListTextDisplayedInActivity('BulletOne', 4)).toBeTruthy('FailureMsg15: Bullet List Text is missing In Activity');
            expect(await ckeditorValidationPo.isTableCaptionDisplayedInCkEditorTextArea('tableSummary', 'new' + randomString)).toBeTruthy('FailureMsg16: Text is not Left Align In Ck Editor');
            expect(await ckeditorValidationPo.isTableSummaryDisplayedInCkEditorTextArea('tableSummary')).toBeTruthy('FailureMsg17: Text is not Left Align In Ck Editor');
        });

        it('[3445,3441,3437]: Verify if case notes templates are accessible to same LOB Case Manager', async () => {
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Notes Template', BWF_PAGE_TITLES.CASE_MANAGEMENT.NOTES_TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(templateName)).toBeTruthy('Human Resources LOB case notes template is not visible to same LOB case manager');
        });

        it('[3445,3441,3437]: Verify if case notes templates are accessible to different LOB Case BA', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Notes Template', BWF_PAGE_TITLES.CASE_MANAGEMENT.NOTES_TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(templateName)).toBeFalsy('Human Resources LOB case notes template is not visible to different LOB case BA');
        });

        it('[3445,3441,3437]: Verify if case notes templates are accessible to different LOB Case Manager', async () => {
            await navigationPage.signOut();
            await loginPage.login('frieda');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Notes Template', BWF_PAGE_TITLES.CASE_MANAGEMENT.NOTES_TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(templateName)).toBeFalsy('Human Resources LOB case notes template is not visible to different LOB case manager');
        });

        it('[3445,3441,3437]: Verify if case notes templates are accessible to Case BA belonging to different company with same LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('gwixillian');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Notes Template', BWF_PAGE_TITLES.CASE_MANAGEMENT.NOTES_TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(templateName)).toBeTruthy('Human Resources LOB case notes template is not visible to same LOB with different case BA');
        });

        it('[3445,3441,3437]: Verify if case notes templates are accessible to Case Manager user having access to multiple LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('qyuan');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Notes Template', BWF_PAGE_TITLES.CASE_MANAGEMENT.NOTES_TEMPLATES);
            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(templateName)).toBeTruthy('Human Resources LOB case notes template is not visible to case manager with multiple LOB access');

            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await utilityGrid.isGridRecordPresent(templateName)).toBeFalsy('Human Resources LOB case notes template is visible to case manager with multiple LOB access');
        });

        it('[3445,3441,3437]: Verify if case notes templates are accessible to Case BA user having access to multiple LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Notes Template', BWF_PAGE_TITLES.CASE_MANAGEMENT.NOTES_TEMPLATES);
            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await utilityGrid.isGridRecordPresent(templateName)).toBeFalsy('Human Resources LOB case notes template is visible to case BA with multiple LOB access');
            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(templateName)).toBeTruthy('Human Resources LOB case notes template is not visible to case BA with multiple LOB access');
            await utilityGrid.searchAndOpenHyperlink(templateName);
            await editNotetemplate.changeStatusValue('Inactive');
            await editNotetemplate.clickOnSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[3447,3443,3439]: Verify CKE functionality on Create and Edit Knowledge Notes template', async () => {
        let templateName: string, randomString = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        it('[3447,3443,3439]: Verify CKE functionality on Create and Edit Knowledge Notes template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Notes Template', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.NOTES_TEMPLATES);
            await consoleNotesTemplatePo.clickOnCreateNotesTemplate();
            templateName = "knowledgeNotesTemplate" + Math.floor(Math.random() * 100000);
            await createNotesTemplate.setTemplateName(templateName);
            await createNotesTemplate.setStatusValue('Active');
            await createNotesTemplate.setCompanyValue('Petramco');
            await createNotesTemplate.setBody("this is new actiivty notes template ");
            //Right Align
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnRightAlignIcon();
            await ckeditorOpsPo.updateDescription(rightAlignText);
            expect(await ckeditorValidationPo.isTextRightAlignInCkEditorTextArea(rightAlignText)).toBeTruthy('Text is not right Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnRightAlignIcon();
            //Center Align
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            await ckeditorOpsPo.updateDescription(centerAlignText);
            expect(await ckeditorValidationPo.isTextCenterAlignInCkEditorTextArea(centerAlignText)).toBeTruthy('Text is not center Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            //Justify Align
            await ckeditorOpsPo.clickOnJustifyAlignIcon();
            await ckeditorOpsPo.updateDescription(justifyAlignText);
            expect(await ckeditorValidationPo.isTextJustifyAlignInCkEditorTextArea(justifyAlignText)).toBeTruthy('Text is not justify Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnJustifyAlignIcon();
            //left Align
            await ckeditorOpsPo.clickOnLeftAlignIcon();
            await ckeditorOpsPo.updateDescription(lefAlignText);
            expect(await ckeditorValidationPo.isTextLeftAlignInCkEditorTextArea(lefAlignText)).toBeTruthy('Text is not Left Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnLeftAlignIcon();
            // bold
            await ckeditorOpsPo.updateDescription("this is text ");
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnBoldIcon();
            await ckeditorOpsPo.updateDescription(boldText);
            expect(await ckeditorValidationPo.isBoldTextDisplayedInCkEditorTextArea(boldText)).toBeTruthy('Text is not get Bold In Ck Editor');
            await ckeditorOpsPo.clickOnBoldIcon();
            //italic
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnItalicIcon();
            await ckeditorOpsPo.updateDescription(italicText);
            expect(await ckeditorValidationPo.isItalicTextDisplayedInCkEditorTextArea(italicText)).toBeTruthy('Text is not Italic In Ck Editor');
            await ckeditorOpsPo.clickOnItalicIcon();
            //strikethrough
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnStrikeThroughIcon();
            await ckeditorOpsPo.updateDescription(strikeThroughText);
            expect(await ckeditorValidationPo.isStrikeThroughTextDisplayedInCkEditorTextArea(strikeThroughText)).toBeTruthy('Text is not Strike Through In Ck Editor');
            await ckeditorOpsPo.clickOnStrikeThroughIcon();
            //underline
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnUnderLineIcon();
            await ckeditorOpsPo.updateDescription(underLineText);
            expect(await ckeditorValidationPo.isUnderlineTextDisplayedInCkEditorTextArea(underLineText)).toBeTruthy('Text is not Underline In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnUnderLineIcon();
        });
        it('[3447,3443,3439]: Verify CKE functionality on Create and Edit Knowledge Notes template', async () => {
            //set color
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.selectColor('Strong Red');
            await ckeditorOpsPo.updateDescription(redColorText);
            expect(await ckeditorValidationPo.isColorTextDisplayedInCkEditorTextArea(redColorText, 'color:#c0392b;')).toBeTruthy('Color is not set In Ck Editor');
            //checking number list
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.setNumberList(['PlusOne']);
            expect(await ckeditorValidationPo.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('Number List is not In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            // checking bullot points
            await ckeditorOpsPo.setBulletList(['BulletOne']);
            expect(await ckeditorValidationPo.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('Bulleted List is not In Ck Editor');
            expect(await ckeditorValidationPo.getTextCkEditorMinimizeOrMiximize()).toBe('Maximize');
            await ckeditorOpsPo.clickMaximizeMinimizeIcon();
            expect(await ckeditorValidationPo.getTextCkEditorMinimizeOrMiximize()).toBe('Minimize');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickMaximizeMinimizeIcon();
        });
        it('[3447,3443,3439]: Verify CKE functionality on Create and Edit Knowledge Notes template', async () => {
            //add style
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.updateDescription(formatText);
            await ckeditorOpsPo.selectStyles('Heading 2');
            expect(await ckeditorValidationPo.isStyleApplied(formatText, 'h2')).toBeTruthy('Heading not set');
            //add Font Size 
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.selectFont("11");
            await ckeditorOpsPo.updateDescription(fontText);
            expect(await ckeditorValidationPo.isFontApplied(11, 'span')).toBeTruthy('Font not set');
            //upload image with URL
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnImageIcon();
            await ckeditorOpsPo.imageUploadWithURL(uploadURL, imageUrlFieldIndex, imageWidthFieldIndex, '100');
            expect(await ckeditorValidationPo.isImageDisplayedInCKE(uploadURL)).toBeTruthy('Image with URL not uploaded');
            //upload image with Local
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnImageIcon();
            imageSource = await ckeditorOpsPo.uploadImageFromLocal('Upload', '../../../data/ui/attachment/articleStatus.png', imageWidthFieldIndex, imageUrlFieldIndex, '50');
            expect(await ckeditorValidationPo.isImageDisplayedInCKE(imageSource)).toBeTruthy();
            // Link added
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('Google', linkDisplayTextFieldIndex);
            await linkPropertiesPo.setValueOfLinkProperties('www.google.com', linkUrlFieldIndex);
            await linkPropertiesPo.clickOnTargetTab();
            await linkPropertiesPo.selectDropDown('_blank', linkTargetDropDownIndex);
            await linkPropertiesPo.clickOnOkBtn();
            expect(await ckeditorValidationPo.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('Link is not In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            //add table
            await ckeditorOpsPo.clickOnTableIcon();
            await tablePropertiesPo.setValueOfTableProperties('4', tableRowFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('10', tableColumnFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('500', tableWidthFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('200', tableHeightFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('new' + randomString, cellCaption);
            await tablePropertiesPo.setValueOfTableProperties('tableSummary', cellSummary);
            await tablePropertiesPo.clickOnOkButton();
            await ckeditorOpsPo.clickInTableCell(2, 2, 'tableSummary');
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            await ckeditorOpsPo.setDataInTable(2, 2, randomString, 'tableSummary');
            await ckeditorOpsPo.clickInTableCell(1, 2, 'tableSummary');
            await ckeditorOpsPo.clickOnRightAlignIcon();
            await ckeditorOpsPo.setDataInTable(1, 2, randomString, 'tableSummary');
            await createNotesTemplate.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
        });
        it('[3447,3443,3439]: Verify CKE functionality on Create and Edit Knowledge Notes template', async () => {
            await navigationPage.gotoCreateKnowledge();
            await createKnowlegePo.clickOnTemplate("Reference");
            await createKnowlegePo.clickOnUseSelectedTemplateButton();
            await createKnowlegePo.addTextInKnowlegeTitleField("KnowledgeTitle_" + randomString);
            await createKnowlegePo.selectKnowledgeSet("HR");
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'CA Support 3');
            await changeAssignmentBladePo.setDropDownValue('Assignee', 'Quigley Heroux');

            await createKnowlegePo.clickOnSaveKnowledgeButton();
            await previewKnowledgePo.clickGoToArticleButton();
            await viewKnowledgeArticlePo.clickEditKnowledgeAccess();
            await accessTabPo.clickToExpandAccessEntitiySearch('Support Group Access', 'Knowledge');
            await accessTabPo.selectAccessEntityDropDown('Petramco', 'Select Company');
            await accessTabPo.selectAccessEntityDropDown('AU Support 3', 'Select Support Group');
            await accessTabPo.clickAccessEntitiyAddButton('Support Group');
            await accessTabPo.clickCloseKnowledgeAccessBlade();
            await utilityCommon.closePopUpMessage();

            await viewKnowledgeArticlePo.clickOnTab('Activity');
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(templateName);
            expect(await ckeditorValidationPo.isBoldTextDisplayedInCkEditorTextArea(boldText)).toBeTruthy('Text is not get Bold In Ck Editor');
            expect(await ckeditorValidationPo.isItalicTextDisplayedInCkEditorTextArea(italicText)).toBeTruthy('Text is not Italic In Ck Editor');
            expect(await ckeditorValidationPo.isUnderlineTextDisplayedInCkEditorTextArea(underLineText)).toBeTruthy('Text is not Underline In Ck Editor');
            expect(await ckeditorValidationPo.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('Text is not center Align In Ck Editor');
            expect(await ckeditorValidationPo.isTextLeftAlignInCkEditorTextArea(lefAlignText)).toBeTruthy('Text is not Left Align In Ck Editor');
            expect(await ckeditorValidationPo.isTableCaptionDisplayedInCkEditorTextArea('tableSummary', 'new' + randomString)).toBeTruthy('Text is not Left Align In Ck Editor');
            expect(await ckeditorValidationPo.isTableSummaryDisplayedInCkEditorTextArea('tableSummary')).toBeTruthy('Text is not Left Align In Ck Editor');
            await activityTabPo.clickOnPostButton();
            await navigationPage.gotoKnowledgeConsole();
            await utilityGrid.searchAndOpenHyperlink("KnowledgeTitle_" + randomString);
            await viewKnowledgeArticlePo.clickOnTab('Activity');
            await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.isBoldTextDisplayedInActivity(boldText, 1)).toBeTruthy('FailureMsg Bold Text is missing in Activity');
            expect(await activityTabPo.isItalicTextDisplayedInActivity(italicText, 1)).toBeTruthy('FailureMsg Italic Text is missing In Activity');
            expect(await activityTabPo.isUnderlineTextDisplayedInActivity(underLineText, 1)).toBeTruthy('FailureMsg Underline Text is missing In Activity');
            expect(await activityTabPo.isRightAlignTextDisplayedInActivity(rightAlignText, 1)).toBeTruthy('FailureMsg Right Align Text is missing In Activity');
            expect(await activityTabPo.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 1)).toBeTruthy('FailureMsg Link Text is missing In Activity');
            expect(await activityTabPo.isNumberListTextDisplayedInActivity('PlusOne', 1)).toBeTruthy('FailureMsg Number List Text is missing In Activity');
            expect(await activityTabPo.isBulletListTextDisplayedInActivity('BulletOne', 1)).toBeTruthy('FailureMsg Bullet List Text is missing In Activity');
            expect(await ckeditorValidationPo.isTableCaptionDisplayedInCkEditorTextArea('tableSummary', 'new' + randomString)).toBeTruthy('Text is not Left Align In Ck Editor');
            expect(await ckeditorValidationPo.isTableSummaryDisplayedInCkEditorTextArea('tableSummary')).toBeTruthy('Text is not Left Align In Ck Editor');
        });
        it('[3447,3443,3439]: Verify CKE functionality on Create and Edit Knowledge Notes template', async () => {
            await navigationPage.signOut();
            await loginPage.login('kWilliamson');
            await navigationPage.switchToApplication("Knowledge Management");
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual("Knowledge Articles", 'title not correct');
            await utilityGrid.searchAndOpenHyperlink("KnowledgeTitle_" + randomString);
            await viewKnowledgeArticlePo.clickOnTab('Activity');
            await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.isBoldTextDisplayedInActivity(boldText, 1)).toBeTruthy('FailureMsg Bold Text is missing in Activity');
            expect(await activityTabPo.isItalicTextDisplayedInActivity(italicText, 1)).toBeTruthy('FailureMsg Italic Text is missing In Activity');
            expect(await activityTabPo.isUnderlineTextDisplayedInActivity(underLineText, 1)).toBeTruthy('FailureMsg Underline Text is missing In Activity');
            expect(await activityTabPo.isRightAlignTextDisplayedInActivity(rightAlignText, 1)).toBeTruthy('FailureMsg Right Align Text is missing In Activity');
            expect(await activityTabPo.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 1)).toBeTruthy('FailureMsg Link Text is missing In Activity');
            expect(await activityTabPo.isNumberListTextDisplayedInActivity('PlusOne', 1)).toBeTruthy('FailureMsg Number List Text is missing In Activity');
            expect(await activityTabPo.isBulletListTextDisplayedInActivity('BulletOne', 1)).toBeTruthy('FailureMsg Bullet List Text is missing In Activity');
            expect(await ckeditorValidationPo.isTableCaptionDisplayedInCkEditorTextArea('tableSummary', 'new' + randomString)).toBeTruthy('Text is not Left Align In Ck Editor');
            expect(await ckeditorValidationPo.isTableSummaryDisplayedInCkEditorTextArea('tableSummary')).toBeTruthy('Text is not Left Align In Ck Editor');
            await navigationPage.signOut();
            await loginPage.login('qheroux');
            await navigationPage.gotoKnowledgeConsole();
            await utilityGrid.searchAndOpenHyperlink("KnowledgeTitle_" + randomString);
            await viewKnowledgeArticlePo.clickOnTab('Activity');
            await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.isBoldTextDisplayedInActivity(boldText, 1)).toBeTruthy('FailureMsg Bold Text is missing in Activity');
            expect(await activityTabPo.isItalicTextDisplayedInActivity(italicText, 1)).toBeTruthy('FailureMsg Italic Text is missing In Activity');
            expect(await activityTabPo.isUnderlineTextDisplayedInActivity(underLineText, 1)).toBeTruthy('FailureMsg Underline Text is missing In Activity');
            expect(await activityTabPo.isRightAlignTextDisplayedInActivity(rightAlignText, 1)).toBeTruthy('FailureMsg Right Align Text is missing In Activity');
            expect(await activityTabPo.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 1)).toBeTruthy('FailureMsg Link Text is missing In Activity');
            expect(await activityTabPo.isNumberListTextDisplayedInActivity('PlusOne', 1)).toBeTruthy('FailureMsg Number List Text is missing In Activity');
            expect(await activityTabPo.isBulletListTextDisplayedInActivity('BulletOne', 1)).toBeTruthy('FailureMsg Bullet List Text is missing In Activity');
            expect(await ckeditorValidationPo.isTableCaptionDisplayedInCkEditorTextArea('tableSummary', 'new' + randomString)).toBeTruthy('Text is not Left Align In Ck Editor');
            expect(await ckeditorValidationPo.isTableSummaryDisplayedInCkEditorTextArea('tableSummary')).toBeTruthy('Text is not Left Align In Ck Editor');
        });
        afterAll(async () => {
            await accessTabPo.clickCloseKnowledgeAccessBlade();
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });
    
    describe('[3448,3444,3440]: Verify CKE functionality on Create and Edit People Notes template', async () => {
        let templateName: string, caseData, caseID, randomString = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        it('[3448,3444,3440]: Verify CKE functionality on Create and Edit People Notes template', async () => {
            await navigationPo.gotoCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.setSummary('Test case for inProgress task');
            await changeAssignmentPo.setAssignee("US Support 3", "qfeng");
            await createCasePo.clickSaveCaseButton();
            await casePreviewPo.clickGoToCaseButton();
            caseID = await viewCasePo.getCaseID();
        });
        it('[3448,3444,3440]: Verify CKE functionality on Create and Edit People Notes template', async () => {
            await viewCasePage.clickOnTab('Case Access');
            await accessTabPo.clickToExpandAccessEntitiySearch('Support Group Access', 'Case');
            await accessTabPo.selectAccessEntityDropDown('CA Support 3', 'Select Support Group');
            await accessTabPo.clickAssignWriteAccessCheckbox('Support Group');
            await accessTabPo.clickAccessEntitiyAddButton('Support Group');

            await accessTabPo.selectAccessEntityDropDown('IN Support 2', 'Select Support Group');
            await accessTabPo.clickAssignWriteAccessCheckbox('Support Group');
            await accessTabPo.clickAccessEntitiyAddButton('Support Group');

            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('People--Notes Template', BWF_PAGE_TITLES.PEOPLE.NOTES_TEMPLATES);
            await consoleNotesTemplatePo.clickOnCreateNotesTemplate();
            templateName = "PeopleNotesTemplate" + Math.floor(Math.random() * 100000);

            await createNotesTemplate.setTemplateName(templateName);
            await createNotesTemplate.setStatusValue('Active');
            await createNotesTemplate.setCompanyValue('Petramco');
            await createNotesTemplate.setBody("this is new actiivty notes template ");
            //left Align
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnLeftAlignIcon();
            await ckeditorOpsPo.updateDescription(lefAlignText);
            expect(await ckeditorValidationPo.isTextLeftAlignInCkEditorTextArea(lefAlignText)).toBeTruthy('Text is not Left Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnLeftAlignIcon();
            //Right Align
            await ckeditorOpsPo.clickOnRightAlignIcon();
            await ckeditorOpsPo.updateDescription(rightAlignText);
            expect(await ckeditorValidationPo.isTextRightAlignInCkEditorTextArea(rightAlignText)).toBeTruthy('Text is not right Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnRightAlignIcon();
            //Center Align
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            await ckeditorOpsPo.updateDescription(centerAlignText);
            expect(await ckeditorValidationPo.isTextCenterAlignInCkEditorTextArea(centerAlignText)).toBeTruthy('Text is not center Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            //Justify Align
            await ckeditorOpsPo.clickOnJustifyAlignIcon();
            await ckeditorOpsPo.updateDescription(justifyAlignText);
            expect(await ckeditorValidationPo.isTextJustifyAlignInCkEditorTextArea(justifyAlignText)).toBeTruthy('Text is not justify Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnJustifyAlignIcon();

            // bold
            await ckeditorOpsPo.updateDescription("this is text ");
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnBoldIcon();
            await ckeditorOpsPo.updateDescription(boldText);
            expect(await ckeditorValidationPo.isBoldTextDisplayedInCkEditorTextArea(boldText)).toBeTruthy('Text is not get Bold In Ck Editor');
            await ckeditorOpsPo.clickOnBoldIcon();
            //italic
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnItalicIcon();
            await ckeditorOpsPo.updateDescription(italicText);
            expect(await ckeditorValidationPo.isItalicTextDisplayedInCkEditorTextArea(italicText)).toBeTruthy('Text is not Italic In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnItalicIcon();
            //strikethrough
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnStrikeThroughIcon();
            await ckeditorOpsPo.updateDescription(strikeThroughText);
            expect(await ckeditorValidationPo.isStrikeThroughTextDisplayedInCkEditorTextArea(strikeThroughText)).toBeTruthy('Text is not Strike Through In Ck Editor');
            await ckeditorOpsPo.clickOnStrikeThroughIcon();
            //underline
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnUnderLineIcon();
            await ckeditorOpsPo.updateDescription(underLineText);
            expect(await ckeditorValidationPo.isUnderlineTextDisplayedInCkEditorTextArea(underLineText)).toBeTruthy('Text is not Underline In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnUnderLineIcon();
        });
        it('[3448,3444,3440]: Verify CKE functionality on Create and Edit People Notes template', async () => {
            //set color
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.selectColor('Strong Red');
            await ckeditorOpsPo.updateDescription(redColorText);
            expect(await ckeditorValidationPo.isColorTextDisplayedInCkEditorTextArea(redColorText, 'color:#c0392b;')).toBeTruthy('Color is not set In Ck Editor');
            //checking number list
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.setNumberList(['PlusOne']);
            expect(await ckeditorValidationPo.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('Number List is not In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            // checking bullot points
            await ckeditorOpsPo.setBulletList(['BulletOne']);
            expect(await ckeditorValidationPo.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('Bulleted List is not In Ck Editor');
            expect(await ckeditorValidationPo.getTextCkEditorMinimizeOrMiximize()).toBe('Maximize');
            await ckeditorOpsPo.clickMaximizeMinimizeIcon();
            expect(await ckeditorValidationPo.getTextCkEditorMinimizeOrMiximize()).toBe('Minimize');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickMaximizeMinimizeIcon();
        });
        it('[3448,3444,3440]: Verify CKE functionality on Create and Edit People Notes template', async () => {
            //add style
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.updateDescription(formatText);
            await ckeditorOpsPo.selectStyles('Heading 2');
            expect(await ckeditorValidationPo.isStyleApplied(formatText, 'h2')).toBeTruthy('Heading not set');
            //add Font Size 
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.selectFont("11");
            await ckeditorOpsPo.updateDescription(fontText);
            expect(await ckeditorValidationPo.isFontApplied(11, 'span')).toBeTruthy('Font not set');
            //upload image with URL
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnImageIcon();
            await ckeditorOpsPo.imageUploadWithURL(uploadURL, imageUrlFieldIndex, imageWidthFieldIndex, '100');
            expect(await ckeditorValidationPo.isImageDisplayedInCKE(uploadURL)).toBeTruthy('Image with URL not uploaded');
            //upload image with Local
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnImageIcon();
            imageSource1 = await ckeditorOpsPo.uploadImageFromLocal('Upload', '../../../data/ui/attachment/articleStatus.png', imageWidthFieldIndex, imageUrlFieldIndex, '50');
            expect(await ckeditorValidationPo.isImageDisplayedInCKE(imageSource1)).toBeTruthy();
            // Link added
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('Google', linkDisplayTextFieldIndex);
            await linkPropertiesPo.setValueOfLinkProperties('www.google.com', linkUrlFieldIndex);
            await linkPropertiesPo.clickOnTargetTab();
            await linkPropertiesPo.selectDropDown('_blank', linkTargetDropDownIndex);
            await linkPropertiesPo.clickOnOkBtn();
            expect(await ckeditorValidationPo.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('Link is not In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            //add table
            await ckeditorOpsPo.clickOnTableIcon();
            await tablePropertiesPo.setValueOfTableProperties('4', tableRowFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('10', tableColumnFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('500', tableWidthFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('200', tableHeightFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('new' + randomString, cellCaption);
            await tablePropertiesPo.setValueOfTableProperties('tableSummary', cellSummary);
            await tablePropertiesPo.clickOnOkButton();
            await ckeditorOpsPo.clickInTableCell(2, 2, 'tableSummary');
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            await ckeditorOpsPo.setDataInTable(2, 2, randomString, 'tableSummary');
            await ckeditorOpsPo.clickInTableCell(1, 2, 'tableSummary');
            await ckeditorOpsPo.clickOnRightAlignIcon();
            await ckeditorOpsPo.setDataInTable(1, 2, randomString, 'tableSummary');
            //upload image with Local
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnImageIcon();
            imageSource2 = await ckeditorOpsPo.uploadImageFromLocal('Upload', '../../../data/ui/attachment/bwfJpg.jpg', imageWidthFieldIndex, imageUrlFieldIndex, '50');
            expect(await ckeditorValidationPo.isImageDisplayedInCKE(imageSource2)).toBeTruthy();
            //upload image with URL
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnImageIcon();
            await ckeditorOpsPo.imageUploadWithURL(uploadURL, imageUrlFieldIndex, imageWidthFieldIndex, '100');
            expect(await ckeditorValidationPo.isImageDisplayedInCKE(uploadURL)).toBeTruthy('Image with URL not uploaded');
            //upload image with Local
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnImageIcon();
            imageSource1 = await ckeditorOpsPo.uploadImageFromLocal('Upload', '../../../data/ui/attachment/articleStatus.png', imageWidthFieldIndex, imageUrlFieldIndex, '50');
            expect(await ckeditorValidationPo.isImageDisplayedInCKE(imageSource1)).toBeTruthy();
            await createNotesTemplate.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
        });
        it('[3448,3444,3440]: Verify CKE functionality on Create and Edit People Notes template', async () => {
            await navigationPage.signOut();
            await loginPage.login('qheroux');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseID);
            await viewCasePage.clickAssigneeLink();
            await utilityCommon.switchToNewTab(1);
            await browser.sleep(2000); // wait untile person profile page load.
            await personProfilePo.clickOnTab('Related Cases');

            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(templateName);
            expect(await ckeditorValidationPo.isBoldTextDisplayedInCkEditorTextArea(boldText)).toBeTruthy('Text is not get Bold In Ck Editor');
            expect(await ckeditorValidationPo.isItalicTextDisplayedInCkEditorTextArea(italicText)).toBeTruthy('Text is not Italic In Ck Editor');
            expect(await ckeditorValidationPo.isUnderlineTextDisplayedInCkEditorTextArea(underLineText)).toBeTruthy('Text is not Underline In Ck Editor');
            expect(await ckeditorValidationPo.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('Text is not center Align In Ck Editor');
            expect(await ckeditorValidationPo.isTextLeftAlignInCkEditorTextArea(lefAlignText)).toBeTruthy('Text is not Left Align In Ck Editor');
            expect(await ckeditorValidationPo.isTableSummaryDisplayedInCkEditorTextArea('tableSummary')).toBeTruthy('Text is not Left Align In Ck Editor');
            await activityTabPo.clickOnPostButton();
            await activityTabPo.clickOnRefreshButton();
            await browser.sleep(2000);//wait untile show more button visible
            await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.isBoldTextDisplayedInActivity(boldText, 1)).toBeTruthy('FailureMsg Bold Text is missing in Activity');
            expect(await activityTabPo.isItalicTextDisplayedInActivity(italicText, 1)).toBeTruthy('FailureMsg Italic Text is missing In Activity');
            expect(await activityTabPo.isUnderlineTextDisplayedInActivity(underLineText, 1)).toBeTruthy('FailureMsg Underline Text is missing In Activity');
            expect(await activityTabPo.isRightAlignTextDisplayedInActivity(rightAlignText, 1)).toBeTruthy('FailureMsg Right Align Text is missing In Activity');
            expect(await activityTabPo.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 1)).toBeTruthy('FailureMsg Link Text is missing In Activity');
            expect(await activityTabPo.isNumberListTextDisplayedInActivity('PlusOne', 1)).toBeTruthy('FailureMsg Number List Text is missing In Activity');
            expect(await activityTabPo.isBulletListTextDisplayedInActivity('BulletOne', 1)).toBeTruthy('FailureMsg Bullet List Text is missing In Activity');
            expect(await ckeditorValidationPo.isTableSummaryDisplayedInCkEditorTextArea('tableSummary')).toBeTruthy('Text is not Left Align In Ck Editor');
            expect(await activityTabPo.isCKImageDisplayedInActivity(imageSource1)).toBeTruthy('Image is not displayed');
            expect(await activityTabPo.isCKImageDisplayedInActivity(imageSource2)).toBeTruthy('Image is not displayed');
            expect(await activityTabPo.isCKImageDisplayedInActivity(uploadURL)).toBeTruthy('Image is not displayed');
        });
        it('[3448,3444,3440]: Verify CKE functionality on Create and Edit People Notes template', async () => {
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.selectLineOfBusiness('Human Resource');
            await utilityGrid.searchAndOpenHyperlink(caseID);
            await viewCasePage.clickAssigneeLink();
            await utilityCommon.switchToNewTab(1);
            await browser.sleep(2000);//Wait untile person profile page loaded
            await activityTabPo.clickOnRefreshButton();
            await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.isBoldTextDisplayedInActivity(boldText, 1)).toBeTruthy('FailureMsg Bold Text is missing in Activity');
            expect(await activityTabPo.isItalicTextDisplayedInActivity(italicText, 1)).toBeTruthy('FailureMsg Italic Text is missing In Activity');
            expect(await activityTabPo.isUnderlineTextDisplayedInActivity(underLineText, 1)).toBeTruthy('FailureMsg Underline Text is missing In Activity');
            expect(await activityTabPo.isRightAlignTextDisplayedInActivity(rightAlignText, 1)).toBeTruthy('FailureMsg Right Align Text is missing In Activity');
            expect(await activityTabPo.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 1)).toBeTruthy('FailureMsg Link Text is missing In Activity');
            expect(await activityTabPo.isNumberListTextDisplayedInActivity('PlusOne', 1)).toBeTruthy('FailureMsg Number List Text is missing In Activity');
            expect(await activityTabPo.isBulletListTextDisplayedInActivity('BulletOne', 1)).toBeTruthy('FailureMsg Bullet List Text is missing In Activity');
            expect(await ckeditorValidationPo.isTableSummaryDisplayedInCkEditorTextArea('tableSummary')).toBeTruthy('Text is not Left Align In Ck Editor');
            expect(await activityTabPo.isCKImageDisplayedInActivity(imageSource1)).toBeTruthy('Image is not displayed');
            expect(await activityTabPo.isCKImageDisplayedInActivity(uploadURL)).toBeTruthy('Image is not displayed');
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        });
    });
    
    describe('[3436]: Verify access of notes template to Case BA of Support group 2 which is created by other SG case BA', async () => {
        let updateBody: string, caseTemplateName: string, knowledgeTemplateName: string, peopleTemplateName: string, taskTemplateName: string, randomString = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        //Case
        it('[3436]: Verify access of notes template to Case BA of Support group 2 which is created by other SG case BA', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Notes Template', BWF_PAGE_TITLES.CASE_MANAGEMENT.NOTES_TEMPLATES);
            await consoleNotesTemplatePo.clickOnCreateNotesTemplate();
            caseTemplateName = "caseNotesTemplate" + Math.floor(Math.random() * 100000);
            await createNotesTemplate.setTemplateName(caseTemplateName);
            await createNotesTemplate.setStatusValue('Active');
            await createNotesTemplate.setCompanyValue('Petramco');
            await createNotesTemplate.setBody("this is new actiivty notes template");
            // bold
            await ckeditorOpsPo.updateDescription("this is text ");
            await ckeditorOpsPo.clickOnBoldIcon();
            await ckeditorOpsPo.updateDescription(boldText);
            expect(await ckeditorValidationPo.isBoldTextDisplayedInCkEditorTextArea(boldText)).toBeTruthy('Text is not get Bold In Ck Editor');
            await ckeditorOpsPo.clickOnBoldIcon();
            //italic
            await ckeditorOpsPo.clickOnItalicIcon();
            await ckeditorOpsPo.updateDescription(italicText);
            expect(await ckeditorValidationPo.isItalicTextDisplayedInCkEditorTextArea(italicText)).toBeTruthy('Text is not Italic In Ck Editor');
            await ckeditorOpsPo.clickOnItalicIcon();
            //StrikeThrough
            await ckeditorOpsPo.clickOnStrikeThroughIcon();
            await ckeditorOpsPo.updateDescription(strikeThroughText);
            expect(await ckeditorValidationPo.isStrikeThroughTextDisplayedInCkEditorTextArea(strikeThroughText)).toBeTruthy('Text is not Strike Through In Ck Editor');
            await ckeditorOpsPo.clickOnStrikeThroughIcon();
            //underline
            await ckeditorOpsPo.clickOnUnderLineIcon();
            await ckeditorOpsPo.updateDescription(underLineText);
            expect(await ckeditorValidationPo.isUnderlineTextDisplayedInCkEditorTextArea(underLineText)).toBeTruthy('Text is not Underline In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnUnderLineIcon();
        });
        it('[3436]: Verify access of notes template to Case BA of Support group 2 which is created by other SG case BA', async () => {
            //left Align
            await ckeditorOpsPo.clickOnLeftAlignIcon();
            await ckeditorOpsPo.updateDescription(lefAlignText);
            expect(await ckeditorValidationPo.isTextLeftAlignInCkEditorTextArea(lefAlignText)).toBeTruthy('Text is not Left Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnLeftAlignIcon();
            //Right Align
            await ckeditorOpsPo.clickOnRightAlignIcon();
            await ckeditorOpsPo.updateDescription(rightAlignText);
            expect(await ckeditorValidationPo.isTextRightAlignInCkEditorTextArea(rightAlignText)).toBeTruthy('Text is not right Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnRightAlignIcon();
            //Center Align
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            await ckeditorOpsPo.updateDescription(centerAlignText);
            expect(await ckeditorValidationPo.isTextCenterAlignInCkEditorTextArea(centerAlignText)).toBeTruthy('Text is not center Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            //Justify Align
            await ckeditorOpsPo.clickOnJustifyAlignIcon();
            await ckeditorOpsPo.updateDescription(justifyAlignText);
            expect(await ckeditorValidationPo.isTextJustifyAlignInCkEditorTextArea(justifyAlignText)).toBeTruthy('Text is not justify Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnJustifyAlignIcon();
            //set color
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.selectColor('Strong Red');
            await ckeditorOpsPo.updateDescription(redColorText);
            expect(await ckeditorValidationPo.isColorTextDisplayedInCkEditorTextArea(redColorText, 'color:#c0392b;')).toBeTruthy('Color is not set In Ck Editor');
            //checking number list
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.setNumberList(['PlusOne']);
            expect(await ckeditorValidationPo.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('Number List is not In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            // checking bullot points
            await ckeditorOpsPo.setBulletList(['BulletOne']);
            expect(await ckeditorValidationPo.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('Bulleted List is not In Ck Editor');
            expect(await ckeditorValidationPo.getTextCkEditorMinimizeOrMiximize()).toBe('Maximize');
            await ckeditorOpsPo.clickMaximizeMinimizeIcon();
            expect(await ckeditorValidationPo.getTextCkEditorMinimizeOrMiximize()).toBe('Minimize');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickMaximizeMinimizeIcon();
        });
        it('[3436]: Verify access of notes template to Case BA of Support group 2 which is created by other SG case BA', async () => {
            //add style
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.updateDescription(formatText);
            await ckeditorOpsPo.selectStyles('Heading 2');
            expect(await ckeditorValidationPo.isStyleApplied(formatText, 'h2')).toBeTruthy('Heading not set');
            //add Font Size 
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.updateDescription(fontText);
            await ckeditorOpsPo.selectFont('11');
            expect(await ckeditorValidationPo.isFontApplied(11, 'span')).toBeTruthy('Font not set');
            //upload image with URL
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnImageIcon();
            await ckeditorOpsPo.imageUploadWithURL(uploadURL, imageUrlFieldIndex, imageWidthFieldIndex, '100');
            expect(await ckeditorValidationPo.isImageDisplayedInCKE(uploadURL)).toBeTruthy('Image with URL not uploaded');
            //upload image with Local
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnImageIcon();
            imageSource = await ckeditorOpsPo.uploadImageFromLocal('Upload', '../../../data/ui/attachment/articleStatus.png', imageWidthFieldIndex, imageUrlFieldIndex, '50');
            expect(await ckeditorValidationPo.isImageDisplayedInCKE(imageSource)).toBeTruthy();
            // Link added
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('Google', linkDisplayTextFieldIndex);
            await linkPropertiesPo.setValueOfLinkProperties('www.google.com', linkUrlFieldIndex);
            await linkPropertiesPo.clickOnTargetTab();
            await linkPropertiesPo.selectDropDown('_blank', linkTargetDropDownIndex);
            await linkPropertiesPo.clickOnOkBtn();
            expect(await ckeditorValidationPo.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('Link is not In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            //add table
            await ckeditorOpsPo.clickOnTableIcon();
            await tablePropertiesPo.setValueOfTableProperties('4', tableRowFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('10', tableColumnFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('500', tableWidthFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('200', tableHeightFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('new' + randomString, cellCaption);
            await tablePropertiesPo.setValueOfTableProperties('tableSummary', cellSummary);
            await tablePropertiesPo.clickOnOkButton();
            await ckeditorOpsPo.clickInTableCell(2, 2, 'tableSummary');
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            await ckeditorOpsPo.setDataInTable(2, 2, randomString, 'tableSummary');
            await ckeditorOpsPo.clickInTableCell(1, 2, 'tableSummary');
            await ckeditorOpsPo.clickOnRightAlignIcon();
            await ckeditorOpsPo.setDataInTable(1, 2, randomString, 'tableSummary');
            expect(await ckeditorValidationPo.getTableCellAlignText("text-align: center;")).toContain(randomString);
            await createNotesTemplate.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
        });
        //Knowledge
        it('[3436]: Verify access of notes template to Case BA of Support group 2 which is created by other SG case BA', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Notes Template', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.NOTES_TEMPLATES);
            await consoleNotesTemplatePo.clickOnCreateNotesTemplate();
            knowledgeTemplateName = "knowledgeNotesTemplate" + Math.floor(Math.random() * 100000);
            await createNotesTemplate.setTemplateName(knowledgeTemplateName);
            await createNotesTemplate.setStatusValue('Active');
            await createNotesTemplate.setCompanyValue('Petramco');
            await createNotesTemplate.setBody("this is new actiivty notes template");
            // bold
            await ckeditorOpsPo.updateDescription("this is text ");
            await ckeditorOpsPo.clickOnBoldIcon();
            await ckeditorOpsPo.updateDescription(boldText);
            expect(await ckeditorValidationPo.isBoldTextDisplayedInCkEditorTextArea(boldText)).toBeTruthy('Text is not get Bold In Ck Editor');
            await ckeditorOpsPo.clickOnBoldIcon();
            //italic
            await ckeditorOpsPo.clickOnItalicIcon();
            await ckeditorOpsPo.updateDescription(italicText);
            expect(await ckeditorValidationPo.isItalicTextDisplayedInCkEditorTextArea(italicText)).toBeTruthy('Text is not Italic In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnItalicIcon();
            //strikethrough
            await ckeditorOpsPo.clickOnStrikeThroughIcon();
            await ckeditorOpsPo.updateDescription(strikeThroughText);
            expect(await ckeditorValidationPo.isStrikeThroughTextDisplayedInCkEditorTextArea(strikeThroughText)).toBeTruthy('Text is not Strike Through In Ck Editor');
            await ckeditorOpsPo.clickOnStrikeThroughIcon();
            //underline
            await ckeditorOpsPo.clickOnUnderLineIcon();
            await ckeditorOpsPo.updateDescription(underLineText);
            expect(await ckeditorValidationPo.isUnderlineTextDisplayedInCkEditorTextArea(underLineText)).toBeTruthy('Text is not Underline In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnUnderLineIcon();
        });
        it('[3436]: Verify access of notes template to Case BA of Support group 2 which is created by other SG case BA', async () => {
            //left Align
            await ckeditorOpsPo.clickOnLeftAlignIcon();
            await ckeditorOpsPo.updateDescription(lefAlignText);
            expect(await ckeditorValidationPo.isTextLeftAlignInCkEditorTextArea(lefAlignText)).toBeTruthy('Text is not Left Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnLeftAlignIcon();
            //Right Align
            await ckeditorOpsPo.clickOnRightAlignIcon();
            await ckeditorOpsPo.updateDescription(rightAlignText);
            expect(await ckeditorValidationPo.isTextRightAlignInCkEditorTextArea(rightAlignText)).toBeTruthy('Text is not right Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnRightAlignIcon();
            //Center Align
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            await ckeditorOpsPo.updateDescription(centerAlignText);
            expect(await ckeditorValidationPo.isTextCenterAlignInCkEditorTextArea(centerAlignText)).toBeTruthy('Text is not center Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            //Justify Align
            await ckeditorOpsPo.clickOnJustifyAlignIcon();
            await ckeditorOpsPo.updateDescription(justifyAlignText);
            expect(await ckeditorValidationPo.isTextJustifyAlignInCkEditorTextArea(justifyAlignText)).toBeTruthy('Text is not justify Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnJustifyAlignIcon();
            //set color
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.selectColor('Strong Red');
            await ckeditorOpsPo.updateDescription(redColorText);
            expect(await ckeditorValidationPo.isColorTextDisplayedInCkEditorTextArea(redColorText, 'color:#c0392b;')).toBeTruthy('Color is not set In Ck Editor');
            //checking number list
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.setNumberList(['PlusOne']);
            expect(await ckeditorValidationPo.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('Number List is not In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            // checking bullot points
            await ckeditorOpsPo.setBulletList(['BulletOne']);
            expect(await ckeditorValidationPo.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('Bulleted List is not In Ck Editor');
            expect(await ckeditorValidationPo.getTextCkEditorMinimizeOrMiximize()).toBe('Maximize');
            await ckeditorOpsPo.clickMaximizeMinimizeIcon();
            expect(await ckeditorValidationPo.getTextCkEditorMinimizeOrMiximize()).toBe('Minimize');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickMaximizeMinimizeIcon();
        });
        it('[3436]: Verify access of notes template to Case BA of Support group 2 which is created by other SG case BA', async () => {
            //add style
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.updateDescription(formatText);
            await ckeditorOpsPo.selectStyles('Heading 2');
            expect(await ckeditorValidationPo.isStyleApplied(formatText, 'h2')).toBeTruthy('Heading not set');
            //add Font Size 
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.selectFont("11");
            await ckeditorOpsPo.updateDescription(fontText);
            expect(await ckeditorValidationPo.isFontApplied(11, 'span')).toBeTruthy('Font not set');
            //upload image with URL
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnImageIcon();
            await ckeditorOpsPo.imageUploadWithURL(uploadURL, imageUrlFieldIndex, imageWidthFieldIndex, '100');
            expect(await ckeditorValidationPo.isImageDisplayedInCKE(uploadURL)).toBeTruthy('Image with URL not uploaded');
            //upload image with Local
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnImageIcon();
            imageSource = await ckeditorOpsPo.uploadImageFromLocal('Upload', '../../../data/ui/attachment/articleStatus.png', imageWidthFieldIndex, imageUrlFieldIndex, '50');
            expect(await ckeditorValidationPo.isImageDisplayedInCKE(imageSource)).toBeTruthy();
            // Link added
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('Google', linkDisplayTextFieldIndex);
            await linkPropertiesPo.setValueOfLinkProperties('www.google.com', linkUrlFieldIndex);
            await linkPropertiesPo.clickOnTargetTab();
            await linkPropertiesPo.selectDropDown('_blank', linkTargetDropDownIndex);
            await linkPropertiesPo.clickOnOkBtn();
            expect(await ckeditorValidationPo.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('Link is not In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            //add table
            await ckeditorOpsPo.clickOnTableIcon();
            await tablePropertiesPo.setValueOfTableProperties('4', tableRowFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('10', tableColumnFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('500', tableWidthFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('200', tableHeightFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('new' + randomString, cellCaption);
            await tablePropertiesPo.setValueOfTableProperties('tableSummary', cellSummary);
            await tablePropertiesPo.clickOnOkButton();
            await ckeditorOpsPo.clickInTableCell(2, 2, 'tableSummary');
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            await ckeditorOpsPo.setDataInTable(2, 2, randomString, 'tableSummary');
            await ckeditorOpsPo.clickInTableCell(1, 2, 'tableSummary');
            await ckeditorOpsPo.clickOnRightAlignIcon();
            await ckeditorOpsPo.setDataInTable(1, 2, randomString, 'tableSummary');
            await createNotesTemplate.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
        });
        //Pepole
        it('[3436]: Verify access of notes template to Case BA of Support group 2 which is created by other SG case BA', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('People--Notes Template', BWF_PAGE_TITLES.PEOPLE.NOTES_TEMPLATES);
            await consoleNotesTemplatePo.clickOnCreateNotesTemplate();
            peopleTemplateName = "PeopleNotesTemplate" + Math.floor(Math.random() * 100000);
            await createNotesTemplate.setTemplateName(peopleTemplateName);
            await createNotesTemplate.setStatusValue('Active');
            await createNotesTemplate.setCompanyValue('Petramco');
            await createNotesTemplate.setBody("this is new actiivty notes template");
            // bold
            await ckeditorOpsPo.updateDescription("this is text ");
            await ckeditorOpsPo.clickOnBoldIcon();
            await ckeditorOpsPo.updateDescription(boldText);
            expect(await ckeditorValidationPo.isBoldTextDisplayedInCkEditorTextArea(boldText)).toBeTruthy('Text is not get Bold In Ck Editor');
            await ckeditorOpsPo.clickOnBoldIcon();
            //italic
            await ckeditorOpsPo.clickOnItalicIcon();
            await ckeditorOpsPo.updateDescription(italicText);
            expect(await ckeditorValidationPo.isItalicTextDisplayedInCkEditorTextArea(italicText)).toBeTruthy('Text is not Italic In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnItalicIcon();
            //strikethrough
            await ckeditorOpsPo.clickOnStrikeThroughIcon();
            await ckeditorOpsPo.updateDescription(strikeThroughText);
            expect(await ckeditorValidationPo.isStrikeThroughTextDisplayedInCkEditorTextArea(strikeThroughText)).toBeTruthy('Text is not Strike Through In Ck Editor');
            await ckeditorOpsPo.clickOnStrikeThroughIcon();
            //underline
            await ckeditorOpsPo.clickOnUnderLineIcon();
            await ckeditorOpsPo.updateDescription(underLineText);
            expect(await ckeditorValidationPo.isUnderlineTextDisplayedInCkEditorTextArea(underLineText)).toBeTruthy('Text is not Underline In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnUnderLineIcon();
        });
        it('[3436]: Verify access of notes template to Case BA of Support group 2 which is created by other SG case BA', async () => {
            //left Align
            await ckeditorOpsPo.clickOnLeftAlignIcon();
            await ckeditorOpsPo.updateDescription(lefAlignText);
            expect(await ckeditorValidationPo.isTextLeftAlignInCkEditorTextArea(lefAlignText)).toBeTruthy('Text is not Left Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnLeftAlignIcon();
            //Right Align
            await ckeditorOpsPo.clickOnRightAlignIcon();
            await ckeditorOpsPo.updateDescription(rightAlignText);
            expect(await ckeditorValidationPo.isTextRightAlignInCkEditorTextArea(rightAlignText)).toBeTruthy('Text is not right Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnRightAlignIcon();
            //Center Align
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            await ckeditorOpsPo.updateDescription(centerAlignText);
            expect(await ckeditorValidationPo.isTextCenterAlignInCkEditorTextArea(centerAlignText)).toBeTruthy('Text is not center Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            //Justify Align
            await ckeditorOpsPo.clickOnJustifyAlignIcon();
            await ckeditorOpsPo.updateDescription(justifyAlignText);
            expect(await ckeditorValidationPo.isTextJustifyAlignInCkEditorTextArea(justifyAlignText)).toBeTruthy('Text is not justify Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnJustifyAlignIcon();
            //set color
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.selectColor('Strong Red');
            await ckeditorOpsPo.updateDescription(redColorText);
            expect(await ckeditorValidationPo.isColorTextDisplayedInCkEditorTextArea(redColorText, 'color:#c0392b;')).toBeTruthy('Color is not set In Ck Editor');
            //checking number list
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.setNumberList(['PlusOne']);
            expect(await ckeditorValidationPo.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('Number List is not In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            // checking bullot points
            await ckeditorOpsPo.setBulletList(['BulletOne']);
            expect(await ckeditorValidationPo.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('Bulleted List is not In Ck Editor');
            expect(await ckeditorValidationPo.getTextCkEditorMinimizeOrMiximize()).toBe('Maximize');
            await ckeditorOpsPo.clickMaximizeMinimizeIcon();
            expect(await ckeditorValidationPo.getTextCkEditorMinimizeOrMiximize()).toBe('Minimize');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickMaximizeMinimizeIcon();
        });
        it('[3436]: Verify access of notes template to Case BA of Support group 2 which is created by other SG case BA', async () => {
            //add style
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.updateDescription(formatText);
            await ckeditorOpsPo.selectStyles('Heading 2');
            expect(await ckeditorValidationPo.isStyleApplied(formatText, 'h2')).toBeTruthy('Heading not set');
            //add Font Size 
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.selectFont("11");
            await ckeditorOpsPo.updateDescription(fontText);
            expect(await ckeditorValidationPo.isFontApplied(11, 'span')).toBeTruthy('Font not set');
            //upload image with URL
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnImageIcon();
            await ckeditorOpsPo.imageUploadWithURL(uploadURL, imageUrlFieldIndex, imageWidthFieldIndex, '100');
            expect(await ckeditorValidationPo.isImageDisplayedInCKE(uploadURL)).toBeTruthy('Image with URL not uploaded');
            //upload image with Local
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnImageIcon();
            imageSource1 = await ckeditorOpsPo.uploadImageFromLocal('Upload', '../../../data/ui/attachment/articleStatus.png', imageWidthFieldIndex, imageUrlFieldIndex, '50');
            expect(await ckeditorValidationPo.isImageDisplayedInCKE(imageSource1)).toBeTruthy();
            // Link added
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('Google', linkDisplayTextFieldIndex);
            await linkPropertiesPo.setValueOfLinkProperties('www.google.com', linkUrlFieldIndex);
            await linkPropertiesPo.clickOnTargetTab();
            await linkPropertiesPo.selectDropDown('_blank', linkTargetDropDownIndex);
            await linkPropertiesPo.clickOnOkBtn();
            expect(await ckeditorValidationPo.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('Link is not In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            //add table
            await ckeditorOpsPo.clickOnTableIcon();
            await tablePropertiesPo.setValueOfTableProperties('4', tableRowFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('10', tableColumnFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('500', tableWidthFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('200', tableHeightFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('new' + randomString, cellCaption);
            await tablePropertiesPo.setValueOfTableProperties('tableSummary', cellSummary);
            await tablePropertiesPo.clickOnOkButton();
            await ckeditorOpsPo.clickInTableCell(2, 2, 'tableSummary');
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            await ckeditorOpsPo.setDataInTable(2, 2, randomString, 'tableSummary');
            await ckeditorOpsPo.clickInTableCell(1, 2, 'tableSummary');
            await ckeditorOpsPo.clickOnRightAlignIcon();
            await ckeditorOpsPo.setDataInTable(1, 2, randomString, 'tableSummary');
            //upload image with Local
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnImageIcon();
            imageSource2 = await ckeditorOpsPo.uploadImageFromLocal('Upload', '../../../data/ui/attachment/bwfJpg.jpg', imageWidthFieldIndex, imageUrlFieldIndex, '50');
            expect(await ckeditorValidationPo.isImageDisplayedInCKE(imageSource2)).toBeTruthy();
            await createNotesTemplate.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
        });
        //Task
        it('[3436]: Verify access of notes template to Case BA of Support group 2 which is created by other SG case BA', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Notes Template', BWF_PAGE_TITLES.TASK_MANAGEMENT.NOTES_TEMPLATES);
            await consoleNotesTemplatePo.clickOnCreateNotesTemplate();
            taskTemplateName = "taskNotesTemplate" + Math.floor(Math.random() * 100000);
            await createNotesTemplate.setTemplateName(taskTemplateName);
            await createNotesTemplate.setStatusValue('Active');
            await createNotesTemplate.setCompanyValue('Petramco');
            await createNotesTemplate.setBody("this is new actiivty notes template");
            // bold
            await ckeditorOpsPo.updateDescription("this is text ");
            await ckeditorOpsPo.clickOnBoldIcon();
            await ckeditorOpsPo.updateDescription(boldText);
            expect(await ckeditorValidationPo.isBoldTextDisplayedInCkEditorTextArea(boldText)).toBeTruthy('Text is not get Bold In Ck Editor');
            await ckeditorOpsPo.clickOnBoldIcon();
            //italic
            await ckeditorOpsPo.clickOnItalicIcon();
            await ckeditorOpsPo.updateDescription(italicText);
            expect(await ckeditorValidationPo.isItalicTextDisplayedInCkEditorTextArea(italicText)).toBeTruthy('Text is not Italic In Ck Editor');
            await ckeditorOpsPo.clickOnItalicIcon();
            //underline
            await ckeditorOpsPo.clickOnUnderLineIcon();
            await ckeditorOpsPo.updateDescription(underLineText);
            expect(await ckeditorValidationPo.isUnderlineTextDisplayedInCkEditorTextArea(underLineText)).toBeTruthy('Text is not Underline In Ck Editor');
        });
        it('[3436]: Verify access of notes template to Case BA of Support group 2 which is created by other SG case BA', async () => {
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnUnderLineIcon();
            //left Align
            await ckeditorOpsPo.clickOnLeftAlignIcon();
            await ckeditorOpsPo.updateDescription(lefAlignText);
            expect(await ckeditorValidationPo.isTextLeftAlignInCkEditorTextArea(lefAlignText)).toBeTruthy('Text is not Left Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnLeftAlignIcon();
            //Right Align
            await ckeditorOpsPo.clickOnRightAlignIcon();
            await ckeditorOpsPo.updateDescription(rightAlignText);
            expect(await ckeditorValidationPo.isTextRightAlignInCkEditorTextArea(rightAlignText)).toBeTruthy('Text is not right Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnRightAlignIcon();
            //Center Align
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            await ckeditorOpsPo.updateDescription(centerAlignText);
            expect(await ckeditorValidationPo.isTextCenterAlignInCkEditorTextArea(centerAlignText)).toBeTruthy('Text is not center Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            //set color
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.selectColor('Strong Red');
            await ckeditorOpsPo.updateDescription(redColorText);
            expect(await ckeditorValidationPo.isColorTextDisplayedInCkEditorTextArea(redColorText, 'color:#c0392b;')).toBeTruthy('Color is not set In Ck Editor');
            //checking number list
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.setNumberList(['PlusOne']);
            expect(await ckeditorValidationPo.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('Number List is not In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            // checking bullot points
            await ckeditorOpsPo.setBulletList(['BulletOne']);
            expect(await ckeditorValidationPo.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('Bulleted List is not In Ck Editor');
            expect(await ckeditorValidationPo.getTextCkEditorMinimizeOrMiximize()).toBe('Maximize');
            await ckeditorOpsPo.clickMaximizeMinimizeIcon();
            expect(await ckeditorValidationPo.getTextCkEditorMinimizeOrMiximize()).toBe('Minimize');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickMaximizeMinimizeIcon();
        });
        it('[3436]: Verify access of notes template to Case BA of Support group 2 which is created by other SG case BA', async () => {
            //add style
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.updateDescription(formatText);
            await ckeditorOpsPo.selectStyles('Heading 2');
            expect(await ckeditorValidationPo.isStyleApplied(formatText, 'h2')).toBeTruthy('Heading not set');
            //upload image with URL
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnImageIcon();
            await ckeditorOpsPo.imageUploadWithURL(uploadURL, imageUrlFieldIndex, imageWidthFieldIndex, '100');
            expect(await ckeditorValidationPo.isImageDisplayedInCKE(uploadURL)).toBeTruthy('Image with URL not uploaded');
            //upload image with Local
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnImageIcon();
            imageSource = await ckeditorOpsPo.uploadImageFromLocal('Upload', '../../../data/ui/attachment/articleStatus.png', imageWidthFieldIndex, imageUrlFieldIndex, '50');
            expect(await ckeditorValidationPo.isImageDisplayedInCKE(imageSource)).toBeTruthy();
            // Link added
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('Google', linkDisplayTextFieldIndex);
            await linkPropertiesPo.setValueOfLinkProperties('www.google.com', linkUrlFieldIndex);
            await linkPropertiesPo.clickOnTargetTab();
            await linkPropertiesPo.selectDropDown('_blank', linkTargetDropDownIndex);
            await linkPropertiesPo.clickOnOkBtn();
            expect(await ckeditorValidationPo.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('Link is not In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            //add table
            await ckeditorOpsPo.clickOnTableIcon();
            await tablePropertiesPo.setValueOfTableProperties('4', tableRowFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('10', tableColumnFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('500', tableWidthFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('200', tableHeightFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('new' + randomString, cellCaption);
            await tablePropertiesPo.setValueOfTableProperties('tableSummary', cellSummary);
            await tablePropertiesPo.clickOnOkButton();
            await ckeditorOpsPo.clickInTableCell(2, 2, 'tableSummary');
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            await ckeditorOpsPo.setDataInTable(2, 2, randomString, 'tableSummary');
            await ckeditorOpsPo.clickInTableCell(1, 2, 'tableSummary');
            await ckeditorOpsPo.clickOnRightAlignIcon();
            await ckeditorOpsPo.setDataInTable(1, 2, randomString, 'tableSummary');
            await createNotesTemplate.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
        });

        it('[3436]: Verify access of notes template to Case BA With Task', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Notes Template', BWF_PAGE_TITLES.TASK_MANAGEMENT.NOTES_TEMPLATES);
            await consoleNotesTemplatePo.searchAndClickOnNotesTemplate(taskTemplateName);
            updateBody = "UpdateTaskNotesTemplate" + Math.floor(Math.random() * 100000);
            await editNotetemplate.changeStatusValue('Inactive');
            await editNotetemplate.updateBody(updateBody);
            await editNotetemplate.clickOnSaveButton();
            await consoleNotesTemplatePo.searchAndClickOnNotesTemplate(taskTemplateName);
            expect(await editNotetemplate.getBodyValue()).toContain(updateBody);
            await editNotetemplate.clickOnCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });
        it('[3436]: Verify access of notes template to Case BA With People', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('People--Notes Template', BWF_PAGE_TITLES.PEOPLE.NOTES_TEMPLATES);
            await consoleNotesTemplatePo.searchAndClickOnNotesTemplate(peopleTemplateName);
            updateBody = "UpdatePeopleNotesTemplate" + Math.floor(Math.random() * 100000);
            await editNotetemplate.changeStatusValue('Inactive');
            await editNotetemplate.updateBody(updateBody);
            await editNotetemplate.clickOnSaveButton();
            await consoleNotesTemplatePo.searchAndClickOnNotesTemplate(peopleTemplateName);
            expect(await editNotetemplate.getBodyValue()).toContain(updateBody);
            await editNotetemplate.clickOnCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });
        it('[3436]: Verify access of notes template to Case BA With Knowledge', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Notes Template', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.NOTES_TEMPLATES);
            await consoleNotesTemplatePo.searchAndClickOnNotesTemplate(knowledgeTemplateName);
            updateBody = "UpdateKnowledgeNotesTemplate" + Math.floor(Math.random() * 100000);
            await editNotetemplate.changeStatusValue('Inactive');
            await editNotetemplate.updateBody(updateBody);
            await editNotetemplate.clickOnSaveButton();
            await consoleNotesTemplatePo.searchAndClickOnNotesTemplate(knowledgeTemplateName);
            expect(await editNotetemplate.getBodyValue()).toContain(updateBody);
            await editNotetemplate.clickOnCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });
        it('[3436]: Verify access of notes template to Case BA With Case', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Notes Template', BWF_PAGE_TITLES.CASE_MANAGEMENT.NOTES_TEMPLATES);
            await consoleNotesTemplatePo.searchAndClickOnNotesTemplate(caseTemplateName);
            updateBody = "UpdateCaseNotesTemplate" + Math.floor(Math.random() * 100000);
            await editNotetemplate.changeStatusValue('Inactive');
            await editNotetemplate.updateBody(updateBody);
            await editNotetemplate.clickOnSaveButton();
            await consoleNotesTemplatePo.searchAndClickOnNotesTemplate(caseTemplateName);
            expect(await editNotetemplate.getBodyValue()).toContain(updateBody);
            await editNotetemplate.clickOnCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });

        it('[3436]: Verify Case / Task Notes Templates are accessible to other Line of business Case BA', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Notes Template', BWF_PAGE_TITLES.CASE_MANAGEMENT.NOTES_TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateName)).toBeFalsy('Case Notes Template for Human Resource LOB are displayed to Facilities LOB User.');

            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Notes Template', BWF_PAGE_TITLES.TASK_MANAGEMENT.NOTES_TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(taskTemplateName)).toBeFalsy('Task Notes Template for Human Resource LOB are displayed to Facilities LOB User.');
        });

        it('[3436]: Verify Person / Knowledge Notes Templates are accessible to other Line of business Case BA', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('People--Notes Template', BWF_PAGE_TITLES.PEOPLE.NOTES_TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(peopleTemplateName)).toBeFalsy('Person Notes Template for Human Resource LOB are displayed to Facilities LOB User.');

            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Notes Template', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.NOTES_TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(knowledgeTemplateName)).toBeFalsy('Knowledge Article Notes Template for Human Resource LOB are displayed to Facilities LOB User.');
        });

        it('[3436]: Verify Case / Task / Knowledge / Person Notes Templates are accessible to other Line of business Case Manager user', async () => {
            await navigationPage.signOut();
            await loginPage.login('qyuan');
            await utilityGrid.selectLineOfBusiness('Facilities');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Notes Template', BWF_PAGE_TITLES.CASE_MANAGEMENT.NOTES_TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateName)).toBeFalsy('Case Notes Template for Human Resource LOB are displayed to Facilities LOB User.');

            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Notes Template', BWF_PAGE_TITLES.TASK_MANAGEMENT.NOTES_TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(taskTemplateName)).toBeFalsy('Task Notes Template for Human Resource LOB are displayed to Facilities LOB User.');
        });

        it('[3436]: Verify Knowledge / Person Notes Templates are accessible to other Line of business Case Manager user', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('People--Notes Template', BWF_PAGE_TITLES.PEOPLE.NOTES_TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(peopleTemplateName)).toBeFalsy('Person Notes Template for Human Resource LOB are displayed to Facilities LOB User.');
            
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Notes Template', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.NOTES_TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(knowledgeTemplateName)).toBeFalsy('Knowledge Article Notes Template for Human Resource LOB are displayed to Facilities LOB User.');
        });

        it('[3436]: Verify Case / Task Notes Templates are accessible to Case BA user who has access to multiple (HR,Finance) LOBs', async () => {
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Notes Template', BWF_PAGE_TITLES.CASE_MANAGEMENT.NOTES_TEMPLATES);
            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateName)).toBeFalsy('Case Notes Template for Human Resource LOB are displayed to Facilities LOB User.');

            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Notes Template', BWF_PAGE_TITLES.TASK_MANAGEMENT.NOTES_TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(taskTemplateName)).toBeFalsy('Task Notes Template for Human Resource LOB are displayed to Facilities LOB User.');
        });

        it('[3436]: Verify Person / Knowledge Notes Templates are accessible to Case BA user who has access to multiple (HR,Finance) LOBs', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('People--Notes Template', BWF_PAGE_TITLES.PEOPLE.NOTES_TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(peopleTemplateName)).toBeFalsy('Person Notes Template for Human Resource LOB are displayed to Facilities LOB User.');

            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Notes Template', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.NOTES_TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(knowledgeTemplateName)).toBeFalsy('Knowledge Article Notes Template for Human Resource LOB are displayed to Facilities LOB User.');
        });

        it('[3436]: Verify Case / Task / Knowledge / Person Notes Templates are accessible to Case BA user who has access to multiple (HR,Finance) LOBs', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Notes Template', BWF_PAGE_TITLES.CASE_MANAGEMENT.NOTES_TEMPLATES);
            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateName)).toBeTruthy('Case Notes Template for Human Resource LOB are displayed to Facilities LOB User.');

            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Notes Template', BWF_PAGE_TITLES.TASK_MANAGEMENT.NOTES_TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(taskTemplateName)).toBeTruthy('Task Notes Template for Human Resource LOB are displayed to Facilities LOB User.');

            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('People--Notes Template', BWF_PAGE_TITLES.PEOPLE.NOTES_TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(peopleTemplateName)).toBeTruthy('Person Notes Template for Human Resource LOB are displayed to Facilities LOB User.');

            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Notes Template', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.NOTES_TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(knowledgeTemplateName)).toBeTruthy('Knowledge Article Notes Template for Human Resource LOB are displayed to Facilities LOB User.');
        });

        it('[3436]: Verify Case / Task / Knowledge / Person Notes Templates are accessible to Case Manager user who has access to multiple (HR,Finance) LOBs', async () => {
            await navigationPage.signOut();
            await loginPage.login('qyuan');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Notes Template', BWF_PAGE_TITLES.CASE_MANAGEMENT.NOTES_TEMPLATES);
            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateName)).toBeFalsy('Case Notes Template for Human Resource LOB are displayed to Facilities LOB User.');

            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Notes Template', BWF_PAGE_TITLES.TASK_MANAGEMENT.NOTES_TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(taskTemplateName)).toBeFalsy('Task Notes Template for Human Resource LOB are displayed to Facilities LOB User.');
        });

        it('[3436]: Verify Knowledge / Person Notes Templates are accessible to Case Manager user who has access to multiple (HR,Finance) LOBs', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('People--Notes Template', BWF_PAGE_TITLES.PEOPLE.NOTES_TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(peopleTemplateName)).toBeFalsy('Person Notes Template for Human Resource LOB are displayed to Facilities LOB User.');

            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Notes Template', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.NOTES_TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(knowledgeTemplateName)).toBeFalsy('Knowledge Article Notes Template for Human Resource LOB are displayed to Facilities LOB User.');
        });

        it('[3436]: Verify Case / Task / Knowledge / Person Notes Templates are accessible to Case Manager user who has access to multiple (HR,Finance) LOBs', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Notes Template', BWF_PAGE_TITLES.CASE_MANAGEMENT.NOTES_TEMPLATES);

            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateName)).toBeTruthy('Case Notes Template for Human Resource LOB are displayed to Facilities LOB User.');

            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Notes Template', BWF_PAGE_TITLES.TASK_MANAGEMENT.NOTES_TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(taskTemplateName)).toBeTruthy('Task Notes Template for Human Resource LOB are displayed to Facilities LOB User.');

            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('People--Notes Template', BWF_PAGE_TITLES.PEOPLE.NOTES_TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(peopleTemplateName)).toBeTruthy('Person Notes Template for Human Resource LOB are displayed to Facilities LOB User.');

            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Notes Template', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.NOTES_TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(knowledgeTemplateName)).toBeTruthy('Knowledge Article Notes Template for Human Resource LOB are displayed to Facilities LOB User.');
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        });
    });
    
    describe('[3446,3442,3438]: Verify CKE functionality on Create and Edit Task Notes template', async () => {
        let templateName: string, manualTaskTemplateData, casetemplatePetramco, externaltemplateData, newCaseTemplate, automatedtemplateData, readAccessMappingData, caseId, randomString = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            casetemplatePetramco = {
                "templateName": 'caseTemplateName' + randomString,
                "templateSummary": 'caseTemplateName' + randomString,
                "templateStatus": "Active",
                "categoryTier1": "Total Rewards",
                "categoryTier2": "Leave",
                "casePriority": "Low",
                "caseStatus": "New",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }
            newCaseTemplate = await apiHelper.createCaseTemplate(casetemplatePetramco);
            manualTaskTemplateData = {
                "templateName": 'Manual task' + randomString,
                "templateSummary": 'Manual task' + randomString,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
            }
            let manualTaskTemplate = await apiHelper.createManualTaskTemplate(manualTaskTemplateData);
            externaltemplateData = {
                "templateName": 'External task' + randomString,
                "templateSummary": 'External task' + randomString,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
            }
            let externalTaskTemplate = await apiHelper.createExternalTaskTemplate(externaltemplateData);
            automatedtemplateData = {
                "templateName": 'Automated task' + randomString,
                "templateSummary": 'Automated task' + randomString,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": 'Auto Proces' + randomString,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
            }
            readAccessMappingData = {
                "configName": randomString + '1ReadAccessMappingName',
                "category1": "Total Rewards",
                "category2": "Leave",
                "assignedCompany": 'Petramco',
                "businessUnit": 'Canada Support',
                "supportGroup": 'CA Support 3',
                "company": 'Petramco',
                "priority": "Low",
            }
            await apiHelper.createReadAccessMapping(readAccessMappingData);
            let automatedTaskTemplate = await apiHelper.createAutomatedTaskTemplate(automatedtemplateData);
            await apiHelper.associateCaseTemplateWithThreeTaskTemplate(newCaseTemplate.displayId, manualTaskTemplate.displayId, externalTaskTemplate.displayId, automatedTaskTemplate.displayId);
        });
        it('[3446,3442,3438]: Verify CKE functionality on Create and Edit Task Notes template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Notes Template', BWF_PAGE_TITLES.TASK_MANAGEMENT.NOTES_TEMPLATES);
            await consoleNotesTemplatePo.clickOnCreateNotesTemplate();
            templateName = "taskNotesTemplate" + Math.floor(Math.random() * 100000);
            await createNotesTemplate.setTemplateName(templateName);
            await createNotesTemplate.setStatusValue('Active');
            await createNotesTemplate.setCompanyValue('Petramco');
            await createNotesTemplate.setBody("this is new actiivty notes template ");
            //left Align
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnLeftAlignIcon();
            await ckeditorOpsPo.updateDescription(lefAlignText);
            expect(await ckeditorValidationPo.isTextLeftAlignInCkEditorTextArea(lefAlignText)).toBeTruthy('Text is not Left Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnLeftAlignIcon();
            //Right Align
            await ckeditorOpsPo.clickOnRightAlignIcon();
            await ckeditorOpsPo.updateDescription(rightAlignText);
            expect(await ckeditorValidationPo.isTextRightAlignInCkEditorTextArea(rightAlignText)).toBeTruthy('Text is not right Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnRightAlignIcon();
            //Center Align
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            await ckeditorOpsPo.updateDescription(centerAlignText);
            expect(await ckeditorValidationPo.isTextCenterAlignInCkEditorTextArea(centerAlignText)).toBeTruthy('Text is not center Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            // bold
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.updateDescription("this is text ");
            await ckeditorOpsPo.clickOnBoldIcon();
            await ckeditorOpsPo.updateDescription(boldText);
            expect(await ckeditorValidationPo.isBoldTextDisplayedInCkEditorTextArea(boldText)).toBeTruthy('Text is not get Bold In Ck Editor');
            await ckeditorOpsPo.clickOnBoldIcon();
            //italic
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnItalicIcon();
            await ckeditorOpsPo.updateDescription(italicText);
            expect(await ckeditorValidationPo.isItalicTextDisplayedInCkEditorTextArea(italicText)).toBeTruthy('Text is not Italic In Ck Editor');
            await ckeditorOpsPo.clickOnItalicIcon();
            //underline
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnUnderLineIcon();
            await ckeditorOpsPo.updateDescription(underLineText);
            expect(await ckeditorValidationPo.isUnderlineTextDisplayedInCkEditorTextArea(underLineText)).toBeTruthy('Text is not Underline In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnUnderLineIcon();
        });
        it('[3446,3442,3438]: Verify CKE functionality on Create and Edit Task Notes template', async () => {
            //set color
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.selectColor('Strong Red');
            await ckeditorOpsPo.updateDescription(redColorText);
            expect(await ckeditorValidationPo.isColorTextDisplayedInCkEditorTextArea(redColorText, 'color:#c0392b;')).toBeTruthy('Color is not set In Ck Editor');
            //checking number list
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.setNumberList(['PlusOne']);
            expect(await ckeditorValidationPo.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('Number List is not In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            // checking bullot points
            await ckeditorOpsPo.setBulletList(['BulletOne']);
            expect(await ckeditorValidationPo.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('Bulleted List is not In Ck Editor');
            expect(await ckeditorValidationPo.getTextCkEditorMinimizeOrMiximize()).toBe('Maximize');
            await ckeditorOpsPo.clickMaximizeMinimizeIcon();
            expect(await ckeditorValidationPo.getTextCkEditorMinimizeOrMiximize()).toBe('Minimize');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickMaximizeMinimizeIcon();
        });
        it('[3446,3442,3438]: Verify CKE functionality on Create and Edit Task Notes template', async () => {
            //add style
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.updateDescription(formatText);
            await ckeditorOpsPo.selectStyles('Heading 2');
            expect(await ckeditorValidationPo.isStyleApplied(formatText, 'h2')).toBeTruthy('Heading not set');
            //upload image with URL
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnImageIcon();
            await ckeditorOpsPo.imageUploadWithURL(uploadURL, imageUrlFieldIndex, imageWidthFieldIndex, '100');
            expect(await ckeditorValidationPo.isImageDisplayedInCKE(uploadURL)).toBeTruthy('Image with URL not uploaded');
            //upload image with Local
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnImageIcon();
            imageSource = await ckeditorOpsPo.uploadImageFromLocal('Upload', '../../../data/ui/attachment/articleStatus.png', imageWidthFieldIndex, imageUrlFieldIndex, '50');
            expect(await ckeditorValidationPo.isImageDisplayedInCKE(imageSource)).toBeTruthy();
            // Link added
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('Google', linkDisplayTextFieldIndex);
            await linkPropertiesPo.setValueOfLinkProperties('www.google.com', linkUrlFieldIndex);
            await linkPropertiesPo.clickOnTargetTab();
            await linkPropertiesPo.selectDropDown('_blank', linkTargetDropDownIndex);
            await linkPropertiesPo.clickOnOkBtn();
            expect(await ckeditorValidationPo.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('Link is not In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            //add table
            await ckeditorOpsPo.clickOnTableIcon();
            await tablePropertiesPo.setValueOfTableProperties('4', tableRowFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('10', tableColumnFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('500', tableWidthFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('200', tableHeightFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('new' + randomString, cellCaption);
            await tablePropertiesPo.setValueOfTableProperties('tableSummary', cellSummary);
            await tablePropertiesPo.clickOnOkButton();
            await ckeditorOpsPo.clickInTableCell(2, 2, 'tableSummary');
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            await ckeditorOpsPo.setDataInTable(2, 2, randomString, 'tableSummary');
            await ckeditorOpsPo.clickInTableCell(1, 2, 'tableSummary');
            await ckeditorOpsPo.clickOnRightAlignIcon();
            await ckeditorOpsPo.setDataInTable(1, 2, randomString, 'tableSummary');
            await createNotesTemplate.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
        });
        it('[3446,3442,3438]: Verify CKE functionality on Create and Edit Task Notes template', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('adam');
            await createCasePo.setSummary("CaseSummary" + randomString);
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(casetemplatePetramco.templateName);
            await createCasePo.clickSaveCaseButton();
            await casePreviewPo.clickGoToCaseButton();
            caseId = await viewCasePage.getCaseID();
            await updateStatusBladePo.changeStatus('In Progress');
            await updateStatusBladePo.clickSaveStatus();

            await viewCasePage.clickOnTab('Case Access');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('CA Support 3', 'Read')).toBeTruthy('FailuerMsg1: Support Group Name is missing');
            await viewCasePage.clickOnTab('Tasks');
            await viewCasePage.clickOnTaskLink(manualTaskTemplateData.templateSummary);
            await viewTaskPo.clickOnChangeStatus();
            await viewTaskPo.changeTaskStatus('Completed');
            await updateStatusBladePo.selectStatusReason('Successful');
            await updateStatusBladePo.clickSaveStatus();
            await utilityCommon.closePopUpMessage();
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(templateName);
            await activityTabPo.addActivityNote(randomString);
            expect(await ckeditorValidationPo.isBoldTextDisplayedInCkEditorTextArea(boldText)).toBeTruthy('Text is not get Bold In Ck Editor');
            expect(await ckeditorValidationPo.isItalicTextDisplayedInCkEditorTextArea(italicText)).toBeTruthy('Text is not Italic In Ck Editor');
            expect(await ckeditorValidationPo.isUnderlineTextDisplayedInCkEditorTextArea(underLineText)).toBeTruthy('Text is not Underline In Ck Editor');
            expect(await ckeditorValidationPo.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('Text is not center Align In Ck Editor');
            expect(await ckeditorValidationPo.isTextLeftAlignInCkEditorTextArea(lefAlignText)).toBeTruthy('Text is not Left Align In Ck Editor');
            expect(await ckeditorValidationPo.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('Text is not center Align In Ck Editor');
            expect(await ckeditorValidationPo.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('Text is not center Align In Ck Editor');
            await activityTabPo.clickOnPostButton();
            await utilityCommon.closePopUpMessage();
            await activityTabPo.clickOnRefreshButton();
            await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.isBoldTextDisplayedInActivity(boldText, 1)).toBeTruthy('FailureMsg Bold Text is missing in Activity');
            expect(await activityTabPo.isItalicTextDisplayedInActivity(italicText, 1)).toBeTruthy('FailureMsg Italic Text is missing In Activity');
            expect(await activityTabPo.isUnderlineTextDisplayedInActivity(underLineText, 1)).toBeTruthy('FailureMsg Underline Text is missing In Activity');
            expect(await activityTabPo.isRightAlignTextDisplayedInActivity(rightAlignText, 1)).toBeTruthy('FailureMsg Right Align Text is missing In Activity');
            expect(await activityTabPo.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 1)).toBeTruthy('FailureMsg Link Text is missing In Activity');
            expect(await activityTabPo.isNumberListTextDisplayedInActivity('PlusOne', 1)).toBeTruthy('FailureMsg Number List Text is missing In Activity');
            expect(await activityTabPo.isBulletListTextDisplayedInActivity('BulletOne', 1)).toBeTruthy('FailureMsg Bullet List Text is missing In Activity');
        });
        it('[3446,3442,3438]: Verify CKE functionality on Create and Edit Task Notes template', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            await viewCasePage.clickOnTaskLink(externaltemplateData.templateSummary);
            await viewTaskPo.clickOnChangeStatus();
            await viewTaskPo.changeTaskStatus('Completed');
            await updateStatusBladePo.selectStatusReason('Successful');
            await updateStatusBladePo.clickSaveStatus();
            await utilityCommon.closePopUpMessage();
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(templateName);
            await activityTabPo.addActivityNote(randomString);
            expect(await ckeditorValidationPo.isBoldTextDisplayedInCkEditorTextArea(boldText)).toBeTruthy('Text is not get Bold In Ck Editor');
            expect(await ckeditorValidationPo.isItalicTextDisplayedInCkEditorTextArea(italicText)).toBeTruthy('Text is not Italic In Ck Editor');
            expect(await ckeditorValidationPo.isUnderlineTextDisplayedInCkEditorTextArea(underLineText)).toBeTruthy('Text is not Underline In Ck Editor');
            expect(await ckeditorValidationPo.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('Text is not center Align In Ck Editor');
            expect(await ckeditorValidationPo.isTextLeftAlignInCkEditorTextArea(lefAlignText)).toBeTruthy('Text is not Left Align In Ck Editor');
            expect(await ckeditorValidationPo.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('Text is not center Align In Ck Editor');
            expect(await ckeditorValidationPo.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('Text is not center Align In Ck Editor');
            await activityTabPo.clickOnPostButton();
            await utilityCommon.closePopUpMessage();
            await activityTabPo.clickOnRefreshButton();
            await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.isBoldTextDisplayedInActivity(boldText, 1)).toBeTruthy('FailureMsg Bold Text is missing in Activity');
            expect(await activityTabPo.isItalicTextDisplayedInActivity(italicText, 1)).toBeTruthy('FailureMsg Italic Text is missing In Activity');
            expect(await activityTabPo.isUnderlineTextDisplayedInActivity(underLineText, 1)).toBeTruthy('FailureMsg Underline Text is missing In Activity');
            expect(await activityTabPo.isRightAlignTextDisplayedInActivity(rightAlignText, 1)).toBeTruthy('FailureMsg Right Align Text is missing In Activity');
            expect(await activityTabPo.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 1)).toBeTruthy('FailureMsg Link Text is missing In Activity');
            expect(await activityTabPo.isNumberListTextDisplayedInActivity('PlusOne', 1)).toBeTruthy('FailureMsg Number List Text is missing In Activity');
            expect(await activityTabPo.isBulletListTextDisplayedInActivity('BulletOne', 1)).toBeTruthy('FailureMsg Bullet List Text is missing In Activity');
        });
        it('[3446,3442,3438]: Verify CKE functionality on Create and Edit Task Notes template', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            await viewCasePage.clickOnTaskLink(automatedtemplateData.templateSummary);
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(templateName);
            await activityTabPo.addActivityNote(randomString);
            expect(await ckeditorValidationPo.isBoldTextDisplayedInCkEditorTextArea(boldText)).toBeTruthy('Text is not get Bold In Ck Editor');
            expect(await ckeditorValidationPo.isItalicTextDisplayedInCkEditorTextArea(italicText)).toBeTruthy('Text is not Italic In Ck Editor');
            expect(await ckeditorValidationPo.isUnderlineTextDisplayedInCkEditorTextArea(underLineText)).toBeTruthy('Text is not Underline In Ck Editor');
            expect(await ckeditorValidationPo.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('Text is not center Align In Ck Editor');
            expect(await ckeditorValidationPo.isTextLeftAlignInCkEditorTextArea(lefAlignText)).toBeTruthy('Text is not Left Align In Ck Editor');
            expect(await ckeditorValidationPo.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('Text is not center Align In Ck Editor');
            expect(await ckeditorValidationPo.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('Text is not center Align In Ck Editor');
            await activityTabPo.clickOnPostButton();
            await utilityCommon.closePopUpMessage();
            await activityTabPo.clickOnRefreshButton();
            await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.isBoldTextDisplayedInActivity(boldText, 1)).toBeTruthy('FailureMsg Bold Text is missing in Activity');
            expect(await activityTabPo.isItalicTextDisplayedInActivity(italicText, 1)).toBeTruthy('FailureMsg Italic Text is missing In Activity');
            expect(await activityTabPo.isUnderlineTextDisplayedInActivity(underLineText, 1)).toBeTruthy('FailureMsg Underline Text is missing In Activity');
            expect(await activityTabPo.isRightAlignTextDisplayedInActivity(rightAlignText, 1)).toBeTruthy('FailureMsg Right Align Text is missing In Activity');
            expect(await activityTabPo.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 1)).toBeTruthy('FailureMsg Link Text is missing In Activity');
            expect(await activityTabPo.isNumberListTextDisplayedInActivity('PlusOne', 1)).toBeTruthy('FailureMsg Number List Text is missing In Activity');
            expect(await activityTabPo.isBulletListTextDisplayedInActivity('BulletOne', 1)).toBeTruthy('FailureMsg Bullet List Text is missing In Activity');
        });
        it('[3446,3442,3438]: Verify CKE functionality on Create and Edit Task Notes template', async () => {
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await utilityGrid.searchAndOpenHyperlink(caseId);
            await viewCasePage.clickOnTaskLink(manualTaskTemplateData.templateSummary);
            await utilityCommon.closePopUpMessage();
            await activityTabPo.clickOnRefreshButton();
            await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.isBoldTextDisplayedInActivity(boldText, 1)).toBeTruthy('FailureMsg Bold Text is missing in Activity');
            expect(await activityTabPo.isItalicTextDisplayedInActivity(italicText, 1)).toBeTruthy('FailureMsg Italic Text is missing In Activity');
            expect(await activityTabPo.isUnderlineTextDisplayedInActivity(underLineText, 1)).toBeTruthy('FailureMsg Underline Text is missing In Activity');
            expect(await activityTabPo.isRightAlignTextDisplayedInActivity(rightAlignText, 1)).toBeTruthy('FailureMsg Right Align Text is missing In Activity');
            expect(await activityTabPo.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 1)).toBeTruthy('FailureMsg Link Text is missing In Activity');
            expect(await activityTabPo.isNumberListTextDisplayedInActivity('PlusOne', 1)).toBeTruthy('FailureMsg Number List Text is missing In Activity');
            expect(await activityTabPo.isBulletListTextDisplayedInActivity('BulletOne', 1)).toBeTruthy('FailureMsg Bullet List Text is missing In Activity');
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            await viewCasePage.clickOnTaskLink(automatedtemplateData.templateSummary);
            await activityTabPo.clickOnRefreshButton();
            await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.isBoldTextDisplayedInActivity(boldText, 1)).toBeTruthy('FailureMsg Bold Text is missing in Activity');
            expect(await activityTabPo.isItalicTextDisplayedInActivity(italicText, 1)).toBeTruthy('FailureMsg Italic Text is missing In Activity');
            expect(await activityTabPo.isUnderlineTextDisplayedInActivity(underLineText, 1)).toBeTruthy('FailureMsg Underline Text is missing In Activity');
            expect(await activityTabPo.isRightAlignTextDisplayedInActivity(rightAlignText, 1)).toBeTruthy('FailureMsg Right Align Text is missing In Activity');
            expect(await activityTabPo.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 1)).toBeTruthy('FailureMsg Link Text is missing In Activity');
            expect(await activityTabPo.isNumberListTextDisplayedInActivity('PlusOne', 1)).toBeTruthy('FailureMsg Number List Text is missing In Activity');
            expect(await activityTabPo.isBulletListTextDisplayedInActivity('BulletOne', 1)).toBeTruthy('FailureMsg Bullet List Text is missing In Activity');
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            await viewCasePage.clickOnTaskLink(externaltemplateData.templateSummary);
            await activityTabPo.clickOnRefreshButton();
            await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.isBoldTextDisplayedInActivity(boldText, 1)).toBeTruthy('FailureMsg Bold Text is missing in Activity');
            expect(await activityTabPo.isItalicTextDisplayedInActivity(italicText, 1)).toBeTruthy('FailureMsg Italic Text is missing In Activity');
            expect(await activityTabPo.isUnderlineTextDisplayedInActivity(underLineText, 1)).toBeTruthy('FailureMsg Underline Text is missing In Activity');
            expect(await activityTabPo.isRightAlignTextDisplayedInActivity(rightAlignText, 1)).toBeTruthy('FailureMsg Right Align Text is missing In Activity');
            expect(await activityTabPo.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 1)).toBeTruthy('FailureMsg Link Text is missing In Activity');
            expect(await activityTabPo.isNumberListTextDisplayedInActivity('PlusOne', 1)).toBeTruthy('FailureMsg Number List Text is missing In Activity');
            expect(await activityTabPo.isBulletListTextDisplayedInActivity('BulletOne', 1)).toBeTruthy('FailureMsg Bullet List Text is missing In Activity');
        });
        it('[3446,3442,3438]: Verify CKE functionality on Create and Edit Task Notes template', async () => {
            await navigationPage.signOut();
            await loginPage.login('qheroux');
            await utilityGrid.searchAndOpenHyperlink(caseId);
            await viewCasePage.clickOnTaskLink(manualTaskTemplateData.templateSummary);
            await activityTabPo.clickOnRefreshButton();
            await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.isBoldTextDisplayedInActivity(boldText, 1)).toBeTruthy('FailureMsg Bold Text is missing in Activity');
            expect(await activityTabPo.isItalicTextDisplayedInActivity(italicText, 1)).toBeTruthy('FailureMsg Italic Text is missing In Activity');
            expect(await activityTabPo.isUnderlineTextDisplayedInActivity(underLineText, 1)).toBeTruthy('FailureMsg Underline Text is missing In Activity');
            expect(await activityTabPo.isRightAlignTextDisplayedInActivity(rightAlignText, 1)).toBeTruthy('FailureMsg Right Align Text is missing In Activity');
            expect(await activityTabPo.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 1)).toBeTruthy('FailureMsg Link Text is missing In Activity');
            expect(await activityTabPo.isNumberListTextDisplayedInActivity('PlusOne', 1)).toBeTruthy('FailureMsg Number List Text is missing In Activity');
            expect(await activityTabPo.isBulletListTextDisplayedInActivity('BulletOne', 1)).toBeTruthy('FailureMsg Bullet List Text is missing In Activity');
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            await viewCasePage.clickOnTaskLink(automatedtemplateData.templateSummary);
            await activityTabPo.clickOnRefreshButton();
            await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.isBoldTextDisplayedInActivity(boldText, 1)).toBeTruthy('FailureMsg Bold Text is missing in Activity');
            expect(await activityTabPo.isItalicTextDisplayedInActivity(italicText, 1)).toBeTruthy('FailureMsg Italic Text is missing In Activity');
            expect(await activityTabPo.isUnderlineTextDisplayedInActivity(underLineText, 1)).toBeTruthy('FailureMsg Underline Text is missing In Activity');
            expect(await activityTabPo.isRightAlignTextDisplayedInActivity(rightAlignText, 1)).toBeTruthy('FailureMsg Right Align Text is missing In Activity');
            expect(await activityTabPo.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 1)).toBeTruthy('FailureMsg Link Text is missing In Activity');
            expect(await activityTabPo.isNumberListTextDisplayedInActivity('PlusOne', 1)).toBeTruthy('FailureMsg Number List Text is missing In Activity');
            expect(await activityTabPo.isBulletListTextDisplayedInActivity('BulletOne', 1)).toBeTruthy('FailureMsg Bullet List Text is missing In Activity');
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            await viewCasePage.clickOnTaskLink(externaltemplateData.templateSummary);
            await activityTabPo.clickOnRefreshButton();
            await activityTabPo.clickOnShowMore();
            expect(await activityTabPo.isBoldTextDisplayedInActivity(boldText, 1)).toBeTruthy('FailureMsg Bold Text is missing in Activity');
            expect(await activityTabPo.isItalicTextDisplayedInActivity(italicText, 1)).toBeTruthy('FailureMsg Italic Text is missing In Activity');
            expect(await activityTabPo.isUnderlineTextDisplayedInActivity(underLineText, 1)).toBeTruthy('FailureMsg Underline Text is missing In Activity');
            expect(await activityTabPo.isRightAlignTextDisplayedInActivity(rightAlignText, 1)).toBeTruthy('FailureMsg Right Align Text is missing In Activity');
            expect(await activityTabPo.isHyperLinkLTextDisplayedInActivity('http://www.google.com', 'Google', 1)).toBeTruthy('FailureMsg Link Text is missing In Activity');
            expect(await activityTabPo.isNumberListTextDisplayedInActivity('PlusOne', 1)).toBeTruthy('FailureMsg Number List Text is missing In Activity');
            expect(await activityTabPo.isBulletListTextDisplayedInActivity('BulletOne', 1)).toBeTruthy('FailureMsg Bullet List Text is missing In Activity');
        });
    });
});
