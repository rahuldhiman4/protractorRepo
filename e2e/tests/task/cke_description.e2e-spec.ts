import { browser } from "protractor";
import { ALL_FIELD } from '../../data/ui/case/casetemplate.data.ui';
import casePreviewPo from '../../pageobject/case/case-preview.po';
import createCasePo from '../../pageobject/case/create-case.po';
import editCasePo from '../../pageobject/case/edit-case.po';
import quickCasePo from '../../pageobject/case/quick-case.po';
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import viewCasePo from '../../pageobject/case/view-case.po';
import ckeditorOpsPo from '../../pageobject/common/ck-editor/ckeditor-ops.po';
import ckeditorValidationPo from '../../pageobject/common/ck-editor/ckeditor-validation.po';
import linkPropertiesPo from '../../pageobject/common/ck-editor/link-properties.po';
import tablePropertiesPo from '../../pageobject/common/ck-editor/table-properties.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import consoleCasetemplatePo from '../../pageobject/settings/case-management/console-casetemplate.po';
import copyCasetemplatePo from '../../pageobject/settings/case-management/copy-casetemplate.po';
import createCaseTemplate from "../../pageobject/settings/case-management/create-casetemplate.po";
import editCasetemplatePo from '../../pageobject/settings/case-management/edit-casetemplate.po';
import previewCaseTemplateCasesPo from '../../pageobject/settings/case-management/preview-case-template.po';
import viewCaseTemplate from "../../pageobject/settings/case-management/view-casetemplate.po";
import consoleTasktemplatePo from '../../pageobject/settings/task-management/console-tasktemplate.po';
import copyTasktemplatePo from '../../pageobject/settings/task-management/copy-tasktemplate.po';
import createTasktemplatePo from '../../pageobject/settings/task-management/create-tasktemplate.po';
import editTasktemplatePo from '../../pageobject/settings/task-management/edit-tasktemplate.po';
import previewTaskTemplatePo from '../../pageobject/settings/task-management/preview-task-template.po';
import viewTasktemplatePo from '../../pageobject/settings/task-management/view-tasktemplate.po';
import createAdhocTaskPo from '../../pageobject/task/create-adhoc-task.po';
import editTaskPo from '../../pageobject/task/edit-task.po';
import manageTaskBladePo from '../../pageobject/task/manage-task-blade.po';
import viewTaskPo from '../../pageobject/task/view-task.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilGrid from '../../utils/util.grid';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

let uploadURL = "https://www.google.com/homepage/images/hero-dhp-chrome-win.jpg?mmfb=90bec8294f441f5c41987596ca1b8cff";
let caseTemplateAllFields = ALL_FIELD;
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
let imageSource;

describe('CKE Description', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login("qkatawazi");
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //ptidke
    describe('[DRDMV-22089,DRDMV-22090,DRDMV-22094,DRDMV-22102,DRDMV-22097,DRDMV-22101 ]: Verify case description field after Copy case template', async () => {
        let randomString = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateName;
        let copyCasetemplate = 'copyCaseTemplate' + randomString;
        it('[DRDMV-22089,DRDMV-22090,DRDMV-22094,DRDMV-22102,DRDMV-22097,DRDMV-22101] Create case template bold , italic and underline with CKE', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            caseTemplateName = caseTemplateAllFields.templateName + randomString;
            caseTemplateAllFields.templateName = caseTemplateName;
            await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
            await createCaseTemplate.setTemplateName(caseTemplateName);
            await createCaseTemplate.setCompanyName(caseTemplateAllFields.company);
            await createCaseTemplate.setCaseSummary(caseTemplateAllFields.templateSummary);
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
            await ckeditorOpsPo.enterNewLineInCKE();
            //Center Align
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            await ckeditorOpsPo.updateDescription(centerAlignText);
            expect(await ckeditorValidationPo.isTextCenterAlignInCkEditorTextArea(centerAlignText)).toBeTruthy('Text is not center Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnCenterAlignIcon();
        });
        it('[DRDMV-22089,DRDMV-22090,DRDMV-22094,DRDMV-22102,DRDMV-22097,DRDMV-22101] Alignment,Bullet Point and Maximum / Minimum with CKE', async () => {
            //left Align
            await ckeditorOpsPo.clickOnUnderLineIcon();
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
            //set color
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.selectColor('Strong Red');
            await ckeditorOpsPo.updateDescription(redColorText);
            expect(await ckeditorValidationPo.isColorTextDisplayedInCkEditorTextArea(redColorText, 'color:#c0392b;')).toBeTruthy('Color is not set In Ck Editor');
            //checking number list
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.setNumberList(['PlusOne']);
            expect(await ckeditorValidationPo.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('Text is not center Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            // checking bullot points
            await ckeditorOpsPo.setBulletList(['BulletOne']);
            expect(await ckeditorValidationPo.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('Text is not center Align In Ck Editor');
            expect(await ckeditorValidationPo.getTextCkEditorMinimizeOrMiximize()).toBe('Maximize');
            await ckeditorOpsPo.clickMaximizeMinimizeIcon();
            expect(await ckeditorValidationPo.getTextCkEditorMinimizeOrMiximize()).toBe('Minimize');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickMaximizeMinimizeIcon();
        });
        it('[DRDMV-22089,DRDMV-22090,DRDMV-22094,DRDMV-22102,DRDMV-22097,DRDMV-22101] Upload image with URL and local , Style text, Insert Link and Table', async () => {
            //add style
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.updateDescription(formatText);
            await ckeditorOpsPo.selectStyles('Heading 2');
            expect(await ckeditorValidationPo.isStyleApplied(formatText, 'h2')).toBeTruthy('Heading not set');
            //upload image with URL
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnImageIcon();
            await ckeditorOpsPo.imageUploadWithURL(uploadURL, imageUrlFieldIndex, imageWidthFieldIndex, '200');
            expect(await ckeditorValidationPo.isImageDisplayedInCKE(uploadURL)).toBeTruthy('Image with URL not uploaded');
            //upload image with Local
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnImageIcon();
            imageSource = await ckeditorOpsPo.uploadImageFromLocal('Upload', '../../../data/ui/attachment/articleStatus.png', imageWidthFieldIndex, imageUrlFieldIndex, '200');
            expect(await ckeditorValidationPo.isImageDisplayedInCKE(imageSource)).toBeTruthy();
            // Link added
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('Google', linkDisplayTextFieldIndex);
            await linkPropertiesPo.setValueOfLinkProperties('www.google.com', linkUrlFieldIndex);
            await linkPropertiesPo.clickOnTargetTab();
            await linkPropertiesPo.selectDropDown('_blank', linkTargetDropDownIndex);
            await linkPropertiesPo.clickOnOkBtn();
            expect(await ckeditorValidationPo.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('Text is not center Align In Ck Editor');
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
            await createCaseTemplate.setPriorityValue(caseTemplateAllFields.casePriority);
            await createCaseTemplate.setBusinessUnitDropdownValue("United States Support");
            await createCaseTemplate.setOwnerGroupDropdownValue("US Support 3");
            await createCaseTemplate.setTemplateStatusDropdownValue(caseTemplateAllFields.templateStatus);
            await createCaseTemplate.clickSaveCaseTemplate();
        });
        it('[DRDMV-22089,DRDMV-22090,DRDMV-22094,DRDMV-22102,DRDMV-22097,DRDMV-22101] Verify detail on view case template', async () => {
            await viewCaseTemplate.clickShowMoreDescriptionLink();
            expect(await ckeditorValidationPo.isBoldTextDisplayed(boldText)).toBeTruthy();
            expect(await ckeditorValidationPo.isUnderLineTextDisplayed(underLineText)).toBeTruthy();
            expect(await ckeditorValidationPo.isItalicTextDisplayed(italicText)).toBeTruthy();
            expect(await ckeditorValidationPo.isColorTextDisplayed('color:#c0392b;')).toBeTruthy();
            expect(await ckeditorValidationPo.isImageDisplayed(uploadURL)).toBeTruthy();
            expect(await ckeditorValidationPo.isImageDisplayed(imageSource)).toBeTruthy();
            expect(await ckeditorValidationPo.getColorFontStyleOfText("text-align: right;")).toContain(rightAlignText);
            expect(await ckeditorValidationPo.getColorFontStyleOfText("text-align: center;")).toContain(centerAlignText);
            expect(await ckeditorValidationPo.getTableCellAlignText("text-align: center;")).toContain(randomString);
            expect(await ckeditorValidationPo.isFormatedTextDisplayed(formatText, "h2")).toBeTruthy();
            await ckeditorValidationPo.clickLinkInCKE('www.google.com');
            await browser.waitForAngularEnabled(false);
            await utilityCommon.switchToNewTab(2);
            expect(await ckeditorValidationPo.isTitleDisplayed('Google')).toBeTruthy();
            await browser.waitForAngularEnabled(true);
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        });
        it('[DRDMV-22089,DRDMV-22090,DRDMV-22094,DRDMV-22102,DRDMV-22097,DRDMV-22101] Verify detail on COPY case template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await utilGrid.searchAndSelectGridRecord(caseTemplateName);
            await consoleCasetemplatePo.clickOnCopyCaseTemplate();
            //verify detail on copy case template screen
            await copyCasetemplatePo.setTemplateName(copyCasetemplate);
            expect(await ckeditorValidationPo.isBoldTextDisplayedInCkEditorTextArea(boldText)).toBeTruthy('Text is not get Bold In Ck Editor');
            expect(await ckeditorValidationPo.isColorTextDisplayedInCkEditorTextArea(redColorText, 'color:#c0392b;')).toBeTruthy('Color is not set In Ck Editor');
            expect(await ckeditorValidationPo.isItalicTextDisplayedInCkEditorTextArea(italicText)).toBeTruthy('Text is not Italic In Ck Editor');
            expect(await ckeditorValidationPo.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('Text is not center Align In Ck Editor');
            expect(await ckeditorValidationPo.isTextLeftAlignInCkEditorTextArea(lefAlignText)).toBeTruthy('Text is not Left Align In Ck Editor');
            expect(await ckeditorValidationPo.isTextRightAlignInCkEditorTextArea(rightAlignText)).toBeTruthy('Text is not right Align In Ck Editor');
            expect(await ckeditorValidationPo.isTextCenterAlignInCkEditorTextArea(centerAlignText)).toBeTruthy('Text is not center Align In Ck Editor');
            expect(await ckeditorValidationPo.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('Text is not center Align In Ck Editor');
            expect(await ckeditorValidationPo.isImageDisplayedInCKE(imageSource)).toBeTruthy();
            expect(await ckeditorValidationPo.isImageDisplayedInCKE(uploadURL)).toBeTruthy();
            expect(await ckeditorValidationPo.isStyleApplied(formatText, 'h2')).toBeTruthy();
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('youtube', linkDisplayTextFieldIndex);
            await linkPropertiesPo.setValueOfLinkProperties('www.youtube.com', linkUrlFieldIndex);
            await linkPropertiesPo.clickOnOkBtn();
            expect(await ckeditorValidationPo.isLinkDisplayedInCkEditorTextArea('youtube')).toBeTruthy('Link Text not ipresent');
            await copyCasetemplatePo.clickSaveCaseTemplate();
            await editCasetemplatePo.clickOnEditCaseTemplateMetadata();
            await editCasetemplatePo.changeTemplateStatusDropdownValue('Active');
            await editCasetemplatePo.clickOnSaveCaseTemplateMetadata();
            await viewCaseTemplate.clickShowMoreDescriptionLink();
            expect(await ckeditorValidationPo.getTableCellAlignText("text-align: center;")).toContain(randomString);
            expect(await ckeditorValidationPo.isLinkDisplayedInCKE('youtube')).toBeTruthy('Link Text not present');
        });

        it('[DRDMV-22089,DRDMV-22090,DRDMV-22094,DRDMV-22102,DRDMV-22097,DRDMV-22101] Verify case description on case if we change case template from template1 to template2', async () => {
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('qdu');
            await quickCasePo.selectCaseTemplate(caseTemplateName);
            await quickCasePo.createCaseButton();
            //Case Preview
            await casePreviewPo.clickOnShowMoreDescription();
            expect(await ckeditorValidationPo.isLinkDisplayedInCKE('Google')).toBeTruthy('google link');
            expect(await ckeditorValidationPo.isBoldTextDisplayed(boldText)).toBeTruthy('text is not bold');
            expect(await ckeditorValidationPo.isUnderLineTextDisplayed(underLineText)).toBeTruthy('text is not underline');
            expect(await ckeditorValidationPo.isItalicTextDisplayed(italicText)).toBeTruthy('text is not italic');
            expect(await ckeditorValidationPo.isColorTextDisplayed('color:#c0392b;')).toBeTruthy('text is not color');
            expect(await ckeditorValidationPo.isImageDisplayed(uploadURL)).toBeTruthy('image URL is not uploaded');
            expect(await ckeditorValidationPo.getColorFontStyleOfText("text-align: right;")).toContain(rightAlignText);
            expect(await ckeditorValidationPo.getColorFontStyleOfText("text-align: center;")).toContain(centerAlignText);
            expect(await ckeditorValidationPo.getTableCellAlignText("text-align: center;")).toContain(randomString);
            await ckeditorValidationPo.clickLinkInCKE('www.google.com');
            await browser.waitForAngularEnabled(false);
            await utilityCommon.switchToNewTab(1);
            expect(await ckeditorValidationPo.isTitleDisplayed('Google')).toBeTruthy('google');
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await browser.waitForAngularEnabled(true);
            await casePreviewPo.clickGoToCaseButton();
            await browser.sleep(5000);
            await viewCasePo.clickDescriptionShowMore();
            expect(await ckeditorValidationPo.isLinkDisplayedInCKE('Google')).toBeTruthy();
            expect(await ckeditorValidationPo.isBoldTextDisplayed(boldText)).toBeTruthy();
            expect(await ckeditorValidationPo.isUnderLineTextDisplayed(underLineText)).toBeTruthy();
            expect(await ckeditorValidationPo.isItalicTextDisplayed(italicText)).toBeTruthy();
            expect(await ckeditorValidationPo.isColorTextDisplayed('color:#c0392b;')).toBeTruthy();
            expect(await ckeditorValidationPo.isImageDisplayed(uploadURL)).toBeTruthy();
            expect(await ckeditorValidationPo.getColorFontStyleOfText("text-align: right;")).toContain(rightAlignText);
            expect(await ckeditorValidationPo.getColorFontStyleOfText("text-align: center;")).toContain(centerAlignText);
            expect(await ckeditorValidationPo.getTableCellAlignText("text-align: center;")).toContain(randomString);
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnChangeCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(copyCasetemplate);
            await editCasePo.clickSaveCase();
            await viewCasePo.clickDescriptionShowMore();
            expect(await viewCasePo.getCaseTemplateText()).toContain(copyCasetemplate);
            expect(await ckeditorValidationPo.isLinkDisplayedInCKE('Google')).toBeTruthy();
        });

        it('[DRDMV-22089,DRDMV-22090,DRDMV-22094,DRDMV-22102,DRDMV-22097,DRDMV-22101] Verify case description field on Case Template Preview', async () => {
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('qdu');
            await quickCasePo.selectCaseTemplate(caseTemplateName);
            await quickCasePo.clickOnCaseTemplate(caseTemplateName);
            await previewCaseTemplateCasesPo.clickShowMoreDescriptionLink();
            expect(await ckeditorValidationPo.isBoldTextDisplayed(boldText)).toBeTruthy();
            expect(await ckeditorValidationPo.isUnderLineTextDisplayed(underLineText)).toBeTruthy();
            expect(await ckeditorValidationPo.isItalicTextDisplayed(italicText)).toBeTruthy();
            expect(await ckeditorValidationPo.isColorTextDisplayed('color:#c0392b;')).toBeTruthy();
            expect(await ckeditorValidationPo.isImageDisplayed(uploadURL)).toBeTruthy();
            expect(await ckeditorValidationPo.isImageDisplayed(imageSource)).toBeTruthy();
            expect(await ckeditorValidationPo.getColorFontStyleOfText("text-align: center;")).toContain(centerAlignText);
            expect(await ckeditorValidationPo.getColorFontStyleOfText("text-align: right;")).toContain(rightAlignText);
            expect(await ckeditorValidationPo.getTableCellAlignText("text-align: center;")).toContain(randomString);
            expect(await ckeditorValidationPo.isLinkDisplayedInCKE('Google')).toBeTruthy();
            await ckeditorValidationPo.clickLinkInCKE('www.google.com');
            await browser.waitForAngularEnabled(false);
            await utilityCommon.switchToNewTab(1);
            expect(await ckeditorValidationPo.isTitleDisplayed('Google')).toBeTruthy('title not matched');
            await browser.waitForAngularEnabled(true);
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await previewCaseTemplateCasesPo.clickOnBackButton();
        });

        it('[DRDMV-22089,DRDMV-22090,DRDMV-22094,DRDMV-22102,DRDMV-22097,DRDMV-22101] Verify case description with login Case Manger', async () => {
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(caseTemplateName);
            await viewCaseTemplate.clickShowMoreDescriptionLink();
            expect(await ckeditorValidationPo.isBoldTextDisplayed(boldText)).toBeTruthy();
            expect(await ckeditorValidationPo.isUnderLineTextDisplayed(underLineText)).toBeTruthy();
            expect(await ckeditorValidationPo.isItalicTextDisplayed(italicText)).toBeTruthy();
            expect(await ckeditorValidationPo.isColorTextDisplayed('color:#c0392b;')).toBeTruthy();
            expect(await ckeditorValidationPo.isImageDisplayed(uploadURL)).toBeTruthy();
            expect(await ckeditorValidationPo.isImageDisplayed(imageSource)).toBeTruthy();
            expect(await ckeditorValidationPo.getColorFontStyleOfText("text-align: right;")).toContain(rightAlignText);
            expect(await ckeditorValidationPo.getColorFontStyleOfText("text-align: center;")).toContain(centerAlignText);
            expect(await ckeditorValidationPo.getTableCellAlignText("text-align: center;")).toContain(randomString);
            await ckeditorValidationPo.clickLinkInCKE('www.google.com');
            await browser.waitForAngularEnabled(false);
            await utilityCommon.switchToNewTab(2);
            expect(await ckeditorValidationPo.isTitleDisplayed('Google')).toBeTruthy();
            await browser.waitForAngularEnabled(true);
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //ptidke
    describe('[DRDMV-22091,DRDMV-22092,DRDMV-22093,DRDMV-22103]: Verify task description field with CK editor functionality on Manual task template', async () => {
        let randomString = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        it('[DRDMV-22091,DRDMV-22092,DRDMV-22093,DRDMV-22103] Create task template bold , italic and underline with CKE', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await consoleTasktemplatePo.clickOnManualTaskTemplateButton();
            await createTasktemplatePo.setTemplateName('taskTemplateNameDRDMV-22091' + randomString);
            await createTasktemplatePo.setTaskSummary('taskTemplateSummaryDRDMV-22091' + randomString);
            await createTasktemplatePo.selectCompanyByName('Petramco');
            // bold
            await createTasktemplatePo.updateTaskDescription("this is text");
            await ckeditorOpsPo.clickOnBoldIcon();
            await createTasktemplatePo.updateTaskDescription(boldText);
            expect(await ckeditorValidationPo.isBoldTextDisplayedInCkEditorTextArea(boldText)).toBeTruthy('Text is not get Bold In Ck Editor');
            await ckeditorOpsPo.clickOnBoldIcon();
            //italic
            await ckeditorOpsPo.clickOnItalicIcon();
            await createTasktemplatePo.updateTaskDescription(italicText);
            expect(await ckeditorValidationPo.isItalicTextDisplayedInCkEditorTextArea(italicText)).toBeTruthy('Text is not Italic In Ck Editor');
            await ckeditorOpsPo.clickOnItalicIcon();
            //underline
            await ckeditorOpsPo.clickOnUnderLineIcon();
            await createTasktemplatePo.updateTaskDescription(underLineText);
            expect(await ckeditorValidationPo.isUnderlineTextDisplayedInCkEditorTextArea(underLineText)).toBeTruthy('Text is not Underline In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            //Center Align
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            await createTasktemplatePo.updateTaskDescription(centerAlignText);
            expect(await ckeditorValidationPo.isTextCenterAlignInCkEditorTextArea(centerAlignText)).toBeTruthy('Text is not center Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnCenterAlignIcon();
        });
        it('[DRDMV-22091,DRDMV-22092,DRDMV-22093,DRDMV-22103] Alignment,Bullet Point and Maximum / Minimum with CKE', async () => {
            //left Align
            await ckeditorOpsPo.clickOnUnderLineIcon();
            await ckeditorOpsPo.clickOnLeftAlignIcon();
            await createTasktemplatePo.updateTaskDescription(lefAlignText);
            expect(await ckeditorValidationPo.isTextLeftAlignInCkEditorTextArea(lefAlignText)).toBeTruthy('Text is not Left Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnLeftAlignIcon();
            //Right Align
            await ckeditorOpsPo.clickOnRightAlignIcon();
            await createTasktemplatePo.updateTaskDescription(rightAlignText);
            expect(await ckeditorValidationPo.isTextRightAlignInCkEditorTextArea(rightAlignText)).toBeTruthy('Text is not right Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnRightAlignIcon();
            //set color
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.selectColor('Strong Red');
            await createTasktemplatePo.updateTaskDescription(redColorText);
            expect(await ckeditorValidationPo.isColorTextDisplayedInCkEditorTextArea(redColorText, 'color:#c0392b;')).toBeTruthy('Color is not set In Ck Editor');
            //checking number list
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.setNumberList(['PlusOne']);
            expect(await ckeditorValidationPo.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('Text is not center Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            // checking bullot points
            await ckeditorOpsPo.setBulletList(['BulletOne']);
            expect(await ckeditorValidationPo.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('Text is not center Align In Ck Editor');
            expect(await ckeditorValidationPo.getTextCkEditorMinimizeOrMiximize()).toBe('Maximize');
            await ckeditorOpsPo.clickMaximizeMinimizeIcon();
            expect(await ckeditorValidationPo.getTextCkEditorMinimizeOrMiximize()).toBe('Minimize');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickMaximizeMinimizeIcon();
        });
        it('[DDRDMV-22091,DRDMV-22092,DRDMV-22093,DRDMV-22103] Upload image with URL and local , Style text, Insert Link and Table', async () => {
            //upload image with URL
            await ckeditorOpsPo.clickOnImageIcon();
            await ckeditorOpsPo.imageUploadWithURL(uploadURL, imageUrlFieldIndex, imageWidthFieldIndex, '200');
            expect(await ckeditorValidationPo.isImageDisplayedInCKE(uploadURL)).toBeTruthy();
            //add style
            await ckeditorOpsPo.enterNewLineInCKE();
            await createTasktemplatePo.updateTaskDescription(formatText);
            await ckeditorOpsPo.selectStyles('Heading 2');
            expect(await ckeditorValidationPo.isStyleApplied(formatText, 'h2')).toBeTruthy();
            //upload image with Local
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnImageIcon();
            imageSource = await ckeditorOpsPo.uploadImageFromLocal('Upload', '../../../data/ui/attachment/articleStatus.png', imageWidthFieldIndex, imageUrlFieldIndex, '200');
            expect(await ckeditorValidationPo.isImageDisplayedInCKE(imageSource)).toBeTruthy();
            // Link added
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('Google', linkDisplayTextFieldIndex);
            await linkPropertiesPo.setValueOfLinkProperties('www.google.com', linkUrlFieldIndex);
            await linkPropertiesPo.clickOnTargetTab();
            await linkPropertiesPo.selectDropDown('_blank', linkTargetDropDownIndex);
            await linkPropertiesPo.clickOnOkBtn();
            expect(await ckeditorValidationPo.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('Text is not center Align In Ck Editor');
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
            await createTasktemplatePo.selectTemplateStatus('Active')
            await createTasktemplatePo.clickOnSaveTaskTemplate();
        });
        it('[DRDMV-22091,DRDMV-22092,DRDMV-22093,DRDMV-22103] Verify detail on view task template', async () => {
            await viewTasktemplatePo.clickShowMoreDescriptionLink();
            expect(await viewTasktemplatePo.isBoldTextDisplayed(boldText)).toBeTruthy('text is not bold');
            expect(await viewTasktemplatePo.isUnderLineTextDisplayed(underLineText)).toBeTruthy('text is not underline');
            expect(await viewTasktemplatePo.isItalicTextDisplayed(italicText)).toBeTruthy('text is not underline');
            expect(await viewTasktemplatePo.isColorTextDisplayed('color:#c0392b;')).toBeTruthy('text is not colored');
            expect(await viewTasktemplatePo.isImageDisplayed(uploadURL)).toBeTruthy('image not displayed on task');
            expect(await viewTasktemplatePo.isImageDisplayed(imageSource)).toBeTruthy('image not displayed');
            expect(await viewTasktemplatePo.isFormatedTextDisplayed(formatText, "h2")).toBeTruthy('heading h2 not set');
            expect(await viewTasktemplatePo.getColorFontStyleOfText("text-align: right;")).toContain(rightAlignText);
            expect(await viewTasktemplatePo.getColorFontStyleOfText("text-align: center;")).toContain(centerAlignText);
            expect(await viewTasktemplatePo.getTableCellAlignText("text-align: center;")).toContain(randomString);
            await ckeditorValidationPo.clickLinkInCKE('www.google.com');
            await browser.waitForAngularEnabled(false);
            await utilityCommon.switchToNewTab(2);
            expect(await ckeditorValidationPo.isTitleDisplayed('Google')).toBeTruthy();
            await browser.waitForAngularEnabled(true);
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        });
        it('[DRDMV-22091,DRDMV-22092,DRDMV-22093,DRDMV-22103] Verify detail on COPY task template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await utilGrid.searchAndOpenHyperlink('taskTemplateNameDRDMV-22091' + randomString);
            await viewTasktemplatePo.clickOnCopyTemplate();
            //verify detail on copy task template screen
            await copyTasktemplatePo.setTemplateName(randomString);
            expect(await ckeditorValidationPo.isBoldTextDisplayedInCkEditorTextArea(boldText)).toBeTruthy('Text is not get Bold In Ck Editor');
            expect(await ckeditorValidationPo.isColorTextDisplayedInCkEditorTextArea(redColorText, 'color:#c0392b;')).toBeTruthy('Color is not set In Ck Editor');
            expect(await ckeditorValidationPo.isItalicTextDisplayedInCkEditorTextArea(italicText)).toBeTruthy('Text is not Italic In Ck Editor');
            expect(await ckeditorValidationPo.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('Text is not center Align In Ck Editor');
            expect(await ckeditorValidationPo.isTextLeftAlignInCkEditorTextArea(lefAlignText)).toBeTruthy('Text is not Left Align In Ck Editor');
            expect(await ckeditorValidationPo.isTextRightAlignInCkEditorTextArea(rightAlignText)).toBeTruthy('Text is not right Align In Ck Editor');
            expect(await ckeditorValidationPo.isTextCenterAlignInCkEditorTextArea(centerAlignText)).toBeTruthy('Text is not center Align In Ck Editor');
            expect(await ckeditorValidationPo.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('Text is not center Align In Ck Editor');
            expect(await editTasktemplatePo.isImageDisplayedInCKE(imageSource)).toBeTruthy('image is not displayed in CKE');
            expect(await editTasktemplatePo.isImageDisplayedInCKE(uploadURL)).toBeTruthy('Image is not displayed in CKE');
            expect(await ckeditorValidationPo.isStyleApplied(formatText, 'h2')).toBeTruthy('Style not set');
            expect(await ckeditorValidationPo.getTableCellAlignText("text-align: center;")).toContain(randomString);
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('youtube', linkDisplayTextFieldIndex);
            await linkPropertiesPo.setValueOfLinkProperties('www.youtube.com', linkUrlFieldIndex);
            await linkPropertiesPo.clickOnOkBtn();
            expect(await ckeditorValidationPo.isLinkDisplayedInCkEditorTextArea('youtube')).toBeTruthy('Link Text not ipresent');
            await copyTasktemplatePo.clickSaveCopytemplate();
            await copyTasktemplatePo.clickShowMoreDescriptionLink();
            expect(await viewTasktemplatePo.isLinkDisplayedInCKE('http://www.youtube.com')).toBeTruthy('Link Text not present');
        });
        it('[DRDMV-22091,DRDMV-22092,DRDMV-22093,DRDMV-22103 Verify task description on task template preview', async () => {
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('qdu');
            await quickCasePo.setCaseSummary('quick case 22091');
            await quickCasePo.createCaseButton();
            await casePreviewPo.clickGoToCaseButton();
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickAddTaskFromTemplateButton();
            await utilityGrid.searchAndOpenHyperlink('taskTemplateNameDRDMV-22091' + randomString);
            //task Preview
            await previewTaskTemplatePo.clickShowMoreDescriptionLink();
            expect(await ckeditorValidationPo.isBoldTextDisplayed(boldText)).toBeTruthy();
            expect(await ckeditorValidationPo.isUnderLineTextDisplayed(underLineText)).toBeTruthy();
            expect(await ckeditorValidationPo.isItalicTextDisplayed(italicText)).toBeTruthy();
            expect(await ckeditorValidationPo.isColorTextDisplayed('color:#c0392b;')).toBeTruthy();
            expect(await ckeditorValidationPo.isImageDisplayed(uploadURL)).toBeTruthy();
            expect(await ckeditorValidationPo.getColorFontStyleOfText("text-align: right;")).toContain(rightAlignText);
            expect(await ckeditorValidationPo.getColorFontStyleOfText("text-align: center;")).toContain(centerAlignText);
            expect(await ckeditorValidationPo.getTableCellAlignText("text-align: center;")).toContain(randomString);
            await ckeditorValidationPo.clickLinkInCKE('www.google.com');
            await browser.waitForAngularEnabled(false);
            await utilityCommon.switchToNewTab(1);
            expect(await ckeditorValidationPo.isTitleDisplayed('Google')).toBeTruthy();
            await browser.waitForAngularEnabled(true);
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await previewTaskTemplatePo.clickOnBackButton();
            await utilityGrid.searchAndSelectGridRecord('taskTemplateNameDRDMV-22091' + randomString);
            await manageTaskBladePo.clickTaskGridSaveButton();
            await manageTaskBladePo.clickTaskLink('taskTemplateSummaryDRDMV-22091' + randomString);
        });
        it('[[DRDMV-22091,DRDMV-22092,DRDMV-22093,DRDMV-22103] Verify task description field on Task', async () => {
            await viewTaskPo.clickShowMoreTaskDescription();
            expect(await ckeditorValidationPo.isLinkDisplayedInCKE('Google')).toBeTruthy();
            expect(await ckeditorValidationPo.isBoldTextDisplayed(boldText)).toBeTruthy();
            expect(await ckeditorValidationPo.isUnderLineTextDisplayed(underLineText)).toBeTruthy();
            expect(await ckeditorValidationPo.isItalicTextDisplayed(italicText)).toBeTruthy();
            expect(await ckeditorValidationPo.isColorTextDisplayed('color:#c0392b;')).toBeTruthy();
            expect(await ckeditorValidationPo.isImageDisplayed(uploadURL)).toBeTruthy();
            expect(await ckeditorValidationPo.getColorFontStyleOfText("text-align: right;")).toContain(rightAlignText);
            expect(await ckeditorValidationPo.getColorFontStyleOfText("text-align: center;")).toContain(centerAlignText);
            expect(await ckeditorValidationPo.getTableCellAlignText("text-align: center;")).toContain(randomString);
            await viewTaskPo.clickOnEditTask();
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('youtube', linkDisplayTextFieldIndex);
            await linkPropertiesPo.setValueOfLinkProperties('www.youtube.com', linkUrlFieldIndex);
            await linkPropertiesPo.clickOnOkBtn();
            expect(await ckeditorValidationPo.isLinkDisplayedInCkEditorTextArea('youtube')).toBeTruthy('Link Text not ipresent');
            await editTaskPo.clickOnAssignToMe();
            await editTaskPo.clickOnSaveButton();
        });
        it('[DRDMV-22091,DRDMV-22092,DRDMV-22093,DRDMV-22103] Verify case description with login Case Manger', async () => {
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await utilGrid.searchAndOpenHyperlink('taskTemplateNameDRDMV-22091' + randomString);
            await viewTasktemplatePo.clickShowMoreDescriptionLink();
            expect(await viewTasktemplatePo.isBoldTextDisplayed(boldText)).toBeTruthy();
            expect(await viewTasktemplatePo.isUnderLineTextDisplayed(underLineText)).toBeTruthy();
            expect(await viewTasktemplatePo.isItalicTextDisplayed(italicText)).toBeTruthy();
            expect(await viewTasktemplatePo.isColorTextDisplayed('color:#c0392b;')).toBeTruthy();
            expect(await viewTasktemplatePo.isImageDisplayed(uploadURL)).toBeTruthy();
            expect(await viewTasktemplatePo.isImageDisplayed(imageSource)).toBeTruthy();
            expect(await viewTasktemplatePo.getTableCellAlignText("text-align: center;")).toContain(randomString);
            expect(await viewTasktemplatePo.getColorFontStyleOfText("text-align: right;")).toContain(rightAlignText);
            expect(await viewTasktemplatePo.getColorFontStyleOfText("text-align: center;")).toContain(centerAlignText);
            await ckeditorValidationPo.clickLinkInCKE('www.google.com');
            await browser.waitForAngularEnabled(false);
            await utilityCommon.switchToNewTab(2);
            expect(await ckeditorValidationPo.isTitleDisplayed('Google')).toBeTruthy();
            await browser.waitForAngularEnabled(true);
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[DRDMV-22095]:Verify case description field with CK editor functionality on Case', async () => {
        let randomString = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        it('[DRDMV-22095] Create case bold , italic and underline with CKE', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qdu');
            await createCasePo.setSummary('new case summary1');
            //   await createCasePo.clickSaveCaseButton();
            //   await casePreviewPo.clickGoToCaseButton();
            // bold
            await createCasePo.updateCaseDescription("this is text");
            await ckeditorOpsPo.clickOnBoldIcon();
            await createCasePo.updateCaseDescription(boldText);
            expect(await ckeditorValidationPo.isBoldTextDisplayedInCkEditorTextArea(boldText)).toBeTruthy('Text is not get Bold In Ck Editor');
            await ckeditorOpsPo.clickOnBoldIcon();
            //italic
            await ckeditorOpsPo.clickOnItalicIcon();
            await createCasePo.updateCaseDescription(italicText);
            expect(await ckeditorValidationPo.isItalicTextDisplayedInCkEditorTextArea(italicText)).toBeTruthy('Text is not Italic In Ck Editor');
            await ckeditorOpsPo.clickOnItalicIcon();
            //underline
            await ckeditorOpsPo.clickOnUnderLineIcon();
            await createCasePo.updateCaseDescription(underLineText);
            expect(await ckeditorValidationPo.isUnderlineTextDisplayedInCkEditorTextArea(underLineText)).toBeTruthy('Text is not Underline In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
        });
        it('[DRDMV-22095] Alignment,Bullet Point and Maximum / Minimum with CKE', async () => {
            //left Align
            await ckeditorOpsPo.clickOnUnderLineIcon();
            await ckeditorOpsPo.clickOnLeftAlignIcon();
            await createCasePo.updateCaseDescription(lefAlignText);
            expect(await ckeditorValidationPo.isTextLeftAlignInCkEditorTextArea(lefAlignText)).toBeTruthy('Text is not Left Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnLeftAlignIcon();
            //Right Align
            await ckeditorOpsPo.clickOnRightAlignIcon();
            await createCasePo.updateCaseDescription(rightAlignText);
            expect(await ckeditorValidationPo.isTextRightAlignInCkEditorTextArea(rightAlignText)).toBeTruthy('Text is not right Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnRightAlignIcon();
            //Center Align
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            await createCasePo.updateCaseDescription(centerAlignText);
            expect(await ckeditorValidationPo.isTextCenterAlignInCkEditorTextArea(centerAlignText)).toBeTruthy('Text is not center Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            //set color
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.selectColor('Strong Red');
            await createCasePo.updateCaseDescription(redColorText);
            expect(await ckeditorValidationPo.isColorTextDisplayedInCkEditorTextArea(redColorText, 'color:#c0392b;')).toBeTruthy('Color is not set In Ck Editor');
            //checking number list
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.setNumberList(['PlusOne']);
            expect(await ckeditorValidationPo.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('Text is not center Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            // checking bullot points
            await ckeditorOpsPo.setBulletList(['BulletOne']);
            expect(await ckeditorValidationPo.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('Text is not center Align In Ck Editor');
            expect(await ckeditorValidationPo.getTextCkEditorMinimizeOrMiximize()).toBe('Maximize');
            await ckeditorOpsPo.clickMaximizeMinimizeIcon();
            expect(await ckeditorValidationPo.getTextCkEditorMinimizeOrMiximize()).toBe('Minimize');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickMaximizeMinimizeIcon();
        });
        it('[DRDMV-22095] Upload image with URL and local , Style text, Insert Link and Table', async () => {
            //add style
            await createCasePo.updateCaseDescription(formatText);
            await ckeditorOpsPo.selectStyles('Heading 2');
            expect(await ckeditorValidationPo.isStyleApplied(formatText, 'h2')).toBeTruthy('heading not set');
            await ckeditorOpsPo.enterNewLineInCKE();
            //upload image with URL
            await ckeditorOpsPo.clickOnImageIcon();
            await ckeditorOpsPo.imageUploadWithURL(uploadURL, imageUrlFieldIndex, imageWidthFieldIndex, '200');
            expect(await ckeditorValidationPo.isImageDisplayedInCKE(uploadURL)).toBeTruthy('Image not uploaded');
            //upload image with Local
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnImageIcon();
            imageSource = await ckeditorOpsPo.uploadImageFromLocal('Upload', '../../../data/ui/attachment/articleStatus.png', imageWidthFieldIndex, imageUrlFieldIndex, '200');
            expect(await ckeditorValidationPo.isImageDisplayedInCKE(imageSource)).toBeTruthy('Image not uploaded from local');
            // Link added
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('Google', linkDisplayTextFieldIndex);
            await linkPropertiesPo.setValueOfLinkProperties('www.google.com', linkUrlFieldIndex);
            await linkPropertiesPo.clickOnTargetTab();
            await linkPropertiesPo.selectDropDown('_blank', linkTargetDropDownIndex);
            await linkPropertiesPo.clickOnOkBtn();
            expect(await ckeditorValidationPo.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('Text is not center Align In Ck Editor');
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
            await createCasePo.clickSaveCaseButton();
            await casePreviewPo.clickGoToCaseButton();
        });
        it('[DRDMV-22095] Verify case description field on case', async () => {
            await viewCasePo.clickDescriptionShowMore();
            expect(await ckeditorValidationPo.isLinkDisplayedInCKE('Google')).toBeTruthy();
            expect(await ckeditorValidationPo.isBoldTextDisplayed(boldText)).toBeTruthy();
            expect(await ckeditorValidationPo.isUnderLineTextDisplayed(underLineText)).toBeTruthy();
            expect(await ckeditorValidationPo.isItalicTextDisplayed(italicText)).toBeTruthy();
            expect(await ckeditorValidationPo.isColorTextDisplayed('color:#c0392b;')).toBeTruthy();
            expect(await ckeditorValidationPo.isImageDisplayed(uploadURL)).toBeTruthy();
            expect(await ckeditorValidationPo.getColorFontStyleOfText("text-align: right;")).toContain(rightAlignText);
            expect(await ckeditorValidationPo.getColorFontStyleOfText("text-align: center;")).toContain(centerAlignText);
            expect(await ckeditorValidationPo.getTableCellAlignText("text-align: center;")).toContain(randomString);
            await viewCasePo.clickEditCaseButton();
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('youtube', linkDisplayTextFieldIndex);
            await linkPropertiesPo.setValueOfLinkProperties('www.youtube.com', linkUrlFieldIndex);
            await linkPropertiesPo.clickOnOkBtn();
            expect(await ckeditorValidationPo.isLinkDisplayedInCkEditorTextArea('youtube')).toBeTruthy('Link Text not ipresent');
            await editCasePo.clickOnAssignToMe();
            await editCasePo.clickSaveCase();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //ptidke
    describe('[DRDMV-22096]:Verify Task description fields with CK editor functionality on Adhoc task	', async () => {
        let randomString = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        it('[DRDMV-22096] Create task template bold , italic and underline with CKE', async () => {
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('qdu');
            await quickCasePo.setCaseSummary('new case summary1');
            await quickCasePo.createCaseButton();
            await casePreviewPo.clickGoToCaseButton();
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickAddAdhocTaskButton();
            await createAdhocTaskPo.setSummary(randomString)
            // bold
            await createAdhocTaskPo.updateTaskDescription("this is text");
            await createAdhocTaskPo.clickOnBoldIcon();
            await createAdhocTaskPo.updateTaskDescription(boldText);
            expect(await ckeditorValidationPo.isBoldTextDisplayedInCkEditorTextArea(boldText)).toBeTruthy('Text is not get Bold In Ck Editor');
            await createAdhocTaskPo.clickOnBoldIcon();
            //italic
            await createAdhocTaskPo.clickOnItalicIcon();
            await createAdhocTaskPo.updateTaskDescription(italicText);
            expect(await ckeditorValidationPo.isItalicTextDisplayedInCkEditorTextArea(italicText)).toBeTruthy('Text is not Italic In Ck Editor');
            await createAdhocTaskPo.clickOnItalicIcon();
            //underline
            await createAdhocTaskPo.clickOnUnderLineIcon();
            await createAdhocTaskPo.updateTaskDescription(underLineText);
            expect(await ckeditorValidationPo.isUnderlineTextDisplayedInCkEditorTextArea(underLineText)).toBeTruthy('Text is not Underline In Ck Editor');
            await createAdhocTaskPo.enterNewLineInCKE();
            await createAdhocTaskPo.clickOnUnderLineIcon();
        });
        it('[DRDMV-22096] Alignment,Bullet Point and Maximum / Minimum with CKE', async () => {
            //left Align
            await createAdhocTaskPo.enterNewLineInCKE();
            await createAdhocTaskPo.clickOnLeftAlignIcon();
            await createAdhocTaskPo.updateTaskDescription(lefAlignText);
            expect(await createAdhocTaskPo.isTextLeftAlignInCkEditorTextArea(lefAlignText)).toBeTruthy('Text is not Left Align In Ck Editor');
            await createAdhocTaskPo.clickOnLeftAlignIcon();
            //Right Align
            await createAdhocTaskPo.enterNewLineInCKE();
            await createAdhocTaskPo.clickOnRightAlignIcon();
            await createAdhocTaskPo.updateTaskDescription(rightAlignText);
            expect(await ckeditorValidationPo.isTextRightAlignInCkEditorTextArea(rightAlignText)).toBeTruthy('Text is not right Align In Ck Editor');
            await createAdhocTaskPo.enterNewLineInCKE();
            await createAdhocTaskPo.clickOnRightAlignIcon();
            //Center Align
            await createAdhocTaskPo.enterNewLineInCKE();
            await createAdhocTaskPo.clickOnCenterAlignIcon();
            await createAdhocTaskPo.updateTaskDescription(centerAlignText);
            expect(await ckeditorValidationPo.isTextCenterAlignInCkEditorTextArea(centerAlignText)).toBeTruthy('Text is not center Align In Ck Editor');
            await createAdhocTaskPo.enterNewLineInCKE();
            await createAdhocTaskPo.clickOnCenterAlignIcon();
            //set color
            await createAdhocTaskPo.enterNewLineInCKE();
            await createAdhocTaskPo.selectColor('Strong Red');
            await createAdhocTaskPo.updateTaskDescription(redColorText);
            expect(await ckeditorValidationPo.isColorTextDisplayedInCkEditorTextArea(redColorText, 'color:#c0392b;')).toBeTruthy('Color is not set In Ck Editor');
            //checking number list
            await createAdhocTaskPo.enterNewLineInCKE();
            await createAdhocTaskPo.setInsertRemoveNumberList('PlusOne');
            expect(await ckeditorValidationPo.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('Text is not center Align In Ck Editor');
            await createAdhocTaskPo.enterNewLineInCKE();
            // checking bullot points
            await createAdhocTaskPo.setInsertRemoveBulletedList('BulletOne');
            expect(await ckeditorValidationPo.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('Text is not center Align In Ck Editor');
            expect(await ckeditorValidationPo.getTextCkEditorMinimizeOrMiximize()).toBe('Maximize');
            await createAdhocTaskPo.clickMaximizeMinimizeIcon();
            expect(await ckeditorValidationPo.getTextCkEditorMinimizeOrMiximize()).toBe('Maximize');
            await createAdhocTaskPo.enterNewLineInCKE();
            await createAdhocTaskPo.clickMaximizeMinimizeIcon();
        });
        it('[DRDMV-22096] Upload image with URL and local , Style text, Insert Link and Table', async () => {
            //upload image with URL
            await ckeditorOpsPo.clickOnImageIcon();
            await ckeditorOpsPo.imageUploadWithURL(uploadURL, imageUrlFieldIndex, imageWidthFieldIndex, '50');
            expect(await ckeditorValidationPo.isImageDisplayedInCKE(uploadURL)).toBeTruthy();
            //add style
            await createAdhocTaskPo.enterNewLineInCKE();
            await createAdhocTaskPo.updateTaskDescription(formatText);
            await ckeditorOpsPo.selectStyles('Heading 2');
            expect(await ckeditorValidationPo.isStyleApplied(formatText, 'h2')).toBeTruthy();
            // Link added
            await createAdhocTaskPo.enterNewLineInCKE();
            await createAdhocTaskPo.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('Google', linkDisplayTextFieldIndex);
            await linkPropertiesPo.setValueOfLinkProperties('www.google.com', linkUrlFieldIndex);
            await linkPropertiesPo.clickOnTargetTab();
            await linkPropertiesPo.selectDropDown('_blank', linkTargetDropDownIndex);
            await linkPropertiesPo.clickOnOkBtn();
            expect(await ckeditorValidationPo.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('Text is not center Align In Ck Editor');
            await createAdhocTaskPo.enterNewLineInCKE();
            //add table
            await createAdhocTaskPo.clickOnTableIcon();
            await tablePropertiesPo.setValueOfTableProperties('4', tableRowFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('10', tableColumnFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('500', tableWidthFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('200', tableHeightFieldIndex);
            await tablePropertiesPo.setValueOfTableProperties('new' + randomString, cellCaption);
            await tablePropertiesPo.setValueOfTableProperties('tableSummary', cellSummary);
            await tablePropertiesPo.clickOnOkButton();
            await ckeditorOpsPo.clickInTableCell(2, 2, 'tableSummary');
            await createAdhocTaskPo.clickOnCenterAlignIcon();
            await ckeditorOpsPo.setDataInTable(2, 2, randomString, 'tableSummary');
            await ckeditorOpsPo.clickInTableCell(1, 2, 'tableSummary');
            await createAdhocTaskPo.clickOnRightAlignIcon();
            await ckeditorOpsPo.setDataInTable(1, 2, randomString, 'tableSummary');
            //upload image with Local
            await createAdhocTaskPo.enterNewLineInCKE();
            await createAdhocTaskPo.clickOnImageIcon();
            imageSource = await ckeditorOpsPo.uploadImageFromLocal('Upload', '../../../data/ui/attachment/articleStatus.png', imageWidthFieldIndex, imageUrlFieldIndex, '50');
            expect(await ckeditorValidationPo.isImageDisplayedInCKE(imageSource)).toBeTruthy();
            await createAdhocTaskPo.clickSaveAdhoctask()
            await manageTaskBladePo.clickTaskLink(randomString);
        });
        it('[DRDMV-22096] Verify task description field on Task', async () => {
            await viewTaskPo.clickShowMoreTaskDescription();
            expect(await ckeditorValidationPo.isLinkDisplayedInCKE('Google')).toBeTruthy();
            expect(await ckeditorValidationPo.isBoldTextDisplayed(boldText)).toBeTruthy();
            expect(await ckeditorValidationPo.isUnderLineTextDisplayed(underLineText)).toBeTruthy();
            expect(await ckeditorValidationPo.isItalicTextDisplayed(italicText)).toBeTruthy();
            expect(await ckeditorValidationPo.isColorTextDisplayed('color:#c0392b;')).toBeTruthy();
            expect(await ckeditorValidationPo.isImageDisplayed(uploadURL)).toBeTruthy();
            expect(await ckeditorValidationPo.getColorFontStyleOfText("text-align: right;")).toContain(rightAlignText);
            expect(await ckeditorValidationPo.getColorFontStyleOfText("text-align: center;")).toContain(centerAlignText);
            expect(await ckeditorValidationPo.getTableCellAlignText("text-align: center;")).toContain(randomString);
            await viewTaskPo.clickOnEditTask();
            await editTaskPo.enterNewLineInCKE();
            await editTaskPo.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('youtube', linkDisplayTextFieldIndex);
            await linkPropertiesPo.setValueOfLinkProperties('www.youtube.com', linkUrlFieldIndex);
            await linkPropertiesPo.clickOnOkBtn();
            expect(await ckeditorValidationPo.isLinkDisplayedInCkEditorTextArea('youtube')).toBeTruthy('Link Text not ipresent');
            await editTaskPo.clickOnAssignToMe();
            await editTaskPo.clickOnSaveButton();
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });
})