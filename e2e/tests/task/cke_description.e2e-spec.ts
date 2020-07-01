import { browser } from "protractor";
import { ALL_FIELD, MANDATORY_FIELD } from '../../data/ui/case/casetemplate.data.ui';
import casePreviewPo from '../../pageobject/case/case-preview.po';
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
import previewCaseTemplateCasesPo from '../../pageobject/settings/case-management/preview-case-template.po';
import viewCaseTemplate from "../../pageobject/settings/case-management/view-casetemplate.po";
import activityTabPo from '../../pageobject/social/activity-tab.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilGrid from '../../utils/util.grid';
import utilityCommon from '../../utils/utility.common';
import consoleTasktemplatePo from '../../pageobject/settings/task-management/console-tasktemplate.po';
import createTasktemplatePo from '../../pageobject/settings/task-management/create-tasktemplate.po';
import viewTasktemplatePo from '../../pageobject/settings/task-management/view-tasktemplate.po';
import consoleTaskPo from '../../pageobject/task/console-task.po';
import copyTasktemplatePo from '../../pageobject/settings/task-management/copy-tasktemplate.po';
import manageTaskBladePo from '../../pageobject/task/manage-task-blade.po';
import utilCommon from '../../utils/util.common';
import utilityGrid from '../../utils/utility.grid';
import previewTaskTemplatePo from '../../pageobject/settings/task-management/preview-task-template.po';
import viewTaskPo from '../../pageobject/task/view-task.po';
import editTaskPo from '../../pageobject/task/edit-task.po';
import createAdhocTaskPo from '../../pageobject/task/create-adhoc-task.po';
let uploadURL = "https://www.google.com/homepage/images/hero-dhp-chrome-win.jpg?mmfb=90bec8294f441f5c41987596ca1b8cff";
let caseTemplateAllFields = ALL_FIELD;
let caseTemplateRequiredFields = MANDATORY_FIELD;
let userData;
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
            await createCaseTemplate.updateDescription("this is text ");
            await ckeditorOpsPo.clickOnBoldIcon();
            await createCaseTemplate.updateDescription(boldText);
            expect(await ckeditorOpsPo.isBoldTextDisplayedInCkEditorTextArea(boldText)).toBeTruthy('Text is not get Bold In Ck Editor');
            await ckeditorOpsPo.clickOnBoldIcon();
            //italic
            await ckeditorOpsPo.clickOnItalicIcon();
            await createCaseTemplate.updateDescription(italicText);
            expect(await ckeditorOpsPo.isItalicTextDisplayedInCkEditorTextArea(italicText)).toBeTruthy('Text is not Italic In Ck Editor');
            await ckeditorOpsPo.clickOnItalicIcon();
            //underline
            await ckeditorOpsPo.clickOnUnderLineIcon();
            await createCaseTemplate.updateDescription(underLineText);
            expect(await ckeditorOpsPo.isUnderlineTextDisplayedInCkEditorTextArea(underLineText)).toBeTruthy('Text is not Underline In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
        });
        it('[DRDMV-22089,DRDMV-22090,DRDMV-22094,DRDMV-22102,DRDMV-22097,DRDMV-22101] Alignment,Bullet Point and Maximum / Minimum with CKE', async () => {
            //left Align
            await ckeditorOpsPo.clickOnUnderLineIcon();
            await ckeditorOpsPo.clickOnLeftAlignIcon();
            await createCaseTemplate.updateDescription(lefAlignText);
            expect(await ckeditorOpsPo.isTextLeftAlignInCkEditorTextArea(lefAlignText)).toBeTruthy('Text is not Left Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnLeftAlignIcon();
            //Right Align
            await ckeditorOpsPo.clickOnRightAlignIcon();
            await createCaseTemplate.updateDescription(rightAlignText);
            expect(await ckeditorOpsPo.isTextRightAlignInCkEditorTextArea(rightAlignText)).toBeTruthy('Text is not right Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnRightAlignIcon();
            //Center Align
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            await createCaseTemplate.updateDescription(centerAlignText);
            expect(await ckeditorOpsPo.isTextCenterAlignInCkEditorTextArea(centerAlignText)).toBeTruthy('Text is not center Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnCenterAlignIcon();
            //set color
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.selectColor('Strong Red');
            await createCaseTemplate.updateDescription(redColorText);
            expect(await ckeditorOpsPo.isColorTextDisplayedInCkEditorTextArea(redColorText, 'color:#c0392b;')).toBeTruthy('Color is not set In Ck Editor');
            //checking number list
            await ckeditorOpsPo.enterNewLineInCKE();
            await activityTabPo.setInsertRemoveNumberList('PlusOne');
            expect(await ckeditorOpsPo.isNumberListDisplayedInCkEditorTextArea('PlusOne')).toBeTruthy('Text is not center Align In Ck Editor');
            await ckeditorOpsPo.enterNewLineInCKE();
            // checking bullot points
            await activityTabPo.setInsertRemoveBulletedList('BulletOne');
            expect(await activityTabPo.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('Text is not center Align In Ck Editor');
            expect(await ckeditorOpsPo.getTextCkEditorMinimizeOrMiximize()).toBe('Maximize');
            await ckeditorOpsPo.clickMaximizeMinimizeIcon();
            expect(await ckeditorOpsPo.getTextCkEditorMinimizeOrMiximize()).toBe('Minimize');
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickMaximizeMinimizeIcon();
        });
        it('[DRDMV-22089,DRDMV-22090,DRDMV-22094,DRDMV-22102,DRDMV-22097,DRDMV-22101] Upload image with URL and local , Style text, Insert Link and Table', async () => {
            //upload image with URL
            await ckeditorOpsPo.clickOnImageIcon();
            await ckeditorOpsPo.imageUploadWithURL(uploadURL, imageUrlFieldIndex, imageWidthFieldIndex, '200');
            expect(await ckeditorOpsPo.isImageDisplayedInCKE(uploadURL)).toBeTruthy();
            //add style
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.selectStyles('Heading 2');
            await createCaseTemplate.updateDescription(formatText);
            expect(await ckeditorOpsPo.isStyleApplied(formatText, 'h2')).toBeTruthy();
            //upload image with Local
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnImageIcon();
            imageSource = await ckeditorOpsPo.uploadImageFromLocal('Upload', '../../../data/ui/attachment/articleStatus.png', imageWidthFieldIndex, imageUrlFieldIndex, '200');
            expect(await ckeditorOpsPo.isImageDisplayedInCKE(imageSource)).toBeTruthy();
            // Link added
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('Google', linkDisplayTextFieldIndex);
            await linkPropertiesPo.setValueOfLinkProperties('www.google.com', linkUrlFieldIndex);
            await linkPropertiesPo.clickOnTargetTab();
            await linkPropertiesPo.selectDropDown('_blank', linkTargetDropDownIndex);
            await linkPropertiesPo.clickOnOkBtn();
            expect(await ckeditorOpsPo.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('Text is not center Align In Ck Editor');
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
            await createCaseTemplate.setBusinessUnitDropdownValue(caseTemplateAllFields.ownerBusinessUnit);
            await createCaseTemplate.setOwnerGroupDropdownValue(caseTemplateAllFields.ownerGroup);
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
            expect(await ckeditorValidationPo.isFormatedTextDisplayed(formatText, "h2")).toBeTruthy();
            await ckeditorValidationPo.clickLinkInCKE('www.google.com');
            expect(await ckeditorValidationPo.isTitleDisplayed('Google')).toBeTruthy();
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            expect(await ckeditorValidationPo.getColorFontStyleOfText("text-align: right;")).toContain(rightAlignText);
            expect(await ckeditorValidationPo.getColorFontStyleOfText("text-align: center;")).toContain(rightAlignText);
        });
        it('[DRDMV-22089,DRDMV-22090,DRDMV-22094,DRDMV-22102,DRDMV-22097,DRDMV-22101] Verify detail on COPY case template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await utilGrid.searchAndSelectGridRecord(caseTemplateName);
            await consoleCasetemplatePo.clickOnCopyCaseTemplate();
            //verify detail on copy case template screen
            await copyCasetemplatePo.setTemplateName(randomString);
            expect(await ckeditorOpsPo.isBoldTextDisplayedInCkEditorTextArea(boldText)).toBeTruthy('Text is not get Bold In Ck Editor');
            expect(await ckeditorOpsPo.isColorTextDisplayedInCkEditorTextArea(redColorText, 'color:#c0392b;')).toBeTruthy('Color is not set In Ck Editor');
            expect(await ckeditorOpsPo.isItalicTextDisplayedInCkEditorTextArea(italicText)).toBeTruthy('Text is not Italic In Ck Editor');
            expect(await activityTabPo.isBulletListDisplayedInCkEditorTextArea('BulletOne')).toBeTruthy('Text is not center Align In Ck Editor');
            expect(await ckeditorOpsPo.isTextLeftAlignInCkEditorTextArea(lefAlignText)).toBeTruthy('Text is not Left Align In Ck Editor');
            expect(await ckeditorOpsPo.isTextRightAlignInCkEditorTextArea(rightAlignText)).toBeTruthy('Text is not right Align In Ck Editor');
            expect(await ckeditorOpsPo.isTextCenterAlignInCkEditorTextArea(centerAlignText)).toBeTruthy('Text is not center Align In Ck Editor');
            expect(await ckeditorOpsPo.isLinkDisplayedInCkEditorTextArea('Google')).toBeTruthy('Text is not center Align In Ck Editor');
            expect(await ckeditorOpsPo.isImageDisplayedInCKE(imageSource)).toBeTruthy();
            expect(await ckeditorOpsPo.isImageDisplayedInCKE(uploadURL)).toBeTruthy();
            expect(await ckeditorOpsPo.isStyleApplied(formatText, 'h2')).toBeTruthy();
            await ckeditorOpsPo.enterNewLineInCKE();
            await ckeditorOpsPo.clickOnLinkIcon();
            await linkPropertiesPo.setValueOfLinkProperties('youtube', linkDisplayTextFieldIndex);
            await linkPropertiesPo.setValueOfLinkProperties('www.youtube.com', linkUrlFieldIndex);
            await linkPropertiesPo.clickOnOkBtn();
            expect(await ckeditorOpsPo.isLinkDisplayedInCkEditorTextArea('youtube')).toBeTruthy('Link Text not ipresent');
            await copyCasetemplatePo.clickSaveCaseTemplate();
            await viewCaseTemplate.clickShowMoreDescriptionLink();
            expect(await ckeditorValidationPo.isLinkDisplayedInCKE('youtube')).toBeTruthy('Link Text not present');
        });

        it('[DRDMV-22089,DRDMV-22090,DRDMV-22094,DRDMV-22102,DRDMV-22097,DRDMV-22101] Verify case description on case if we change case template from template1 to template2', async () => {
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('qdu');
            await quickCasePo.selectCaseTemplate(caseTemplateName);
            await quickCasePo.createCaseButton();
            //Case Preview
            await viewCasePo.clickShowMoreShowLessLink();
            expect(await ckeditorValidationPo.isLinkDisplayedInCKE('Google')).toBeTruthy();
            expect(await ckeditorValidationPo.isBoldTextDisplayed(boldText)).toBeTruthy();
            expect(await ckeditorValidationPo.isUnderLineTextDisplayed(underLineText)).toBeTruthy();
            expect(await ckeditorValidationPo.isItalicTextDisplayed(italicText)).toBeTruthy();
            expect(await ckeditorValidationPo.isColorTextDisplayed('color:#c0392b;')).toBeTruthy();
            expect(await ckeditorValidationPo.isImageDisplayed(uploadURL)).toBeTruthy();
            expect(await ckeditorValidationPo.getColorFontStyleOfText("text-align: right;")).toContain(rightAlignText);
            expect(await ckeditorValidationPo.getColorFontStyleOfText("text-align: center;")).toContain(centerAlignText);
            await ckeditorValidationPo.clickLinkInCKE('www.google.com');
            expect(await ckeditorValidationPo.isTitleDisplayed('Google')).toBeTruthy();
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await casePreviewPo.clickGoToCaseButton();
            await viewCasePo.clickShowMoreShowLessLink();
            expect(await ckeditorValidationPo.isLinkDisplayedInCKE('Google')).toBeTruthy();
            expect(await ckeditorValidationPo.isBoldTextDisplayed(boldText)).toBeTruthy();
            expect(await ckeditorValidationPo.isUnderLineTextDisplayed(underLineText)).toBeTruthy();
            expect(await ckeditorValidationPo.isItalicTextDisplayed(italicText)).toBeTruthy();
            expect(await ckeditorValidationPo.isColorTextDisplayed('color:#c0392b;')).toBeTruthy();
            expect(await ckeditorValidationPo.isImageDisplayed(uploadURL)).toBeTruthy();
            expect(await ckeditorValidationPo.getColorFontStyleOfText("text-align: right;")).toContain(rightAlignText);
            expect(await ckeditorValidationPo.getColorFontStyleOfText("text-align: center;")).toContain(centerAlignText);
            await viewCasePo.clickEditCaseButton();
            await editCasePo.clickOnChangeCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(randomString);
            await editCasePo.clickSaveCase();
            await viewCasePo.clickDescriptionShowMore();
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
            await ckeditorValidationPo.clickLinkInCKE('www.google.com');
            expect(await ckeditorValidationPo.isTitleDisplayed('Google')).toBeTruthy();
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            expect(await ckeditorValidationPo.isLinkDisplayedInCKE('Google')).toBeTruthy();
            expect(await ckeditorValidationPo.getColorFontStyleOfText("text-align: right;")).toContain(rightAlignText);
            expect(await ckeditorValidationPo.getColorFontStyleOfText("text-align: center;")).toContain(centerAlignText);
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
            await ckeditorValidationPo.clickLinkInCKE('www.google.com');
            expect(await ckeditorValidationPo.isTitleDisplayed('Google')).toBeTruthy();
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            expect(await ckeditorValidationPo.getColorFontStyleOfText("text-align: right;")).toContain(rightAlignText);
            expect(await ckeditorValidationPo.getColorFontStyleOfText("text-align: center;")).toContain(centerAlignText);
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });  
})