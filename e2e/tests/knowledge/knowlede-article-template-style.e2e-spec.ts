import { browser } from "protractor";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import articleTemplateStylePo from '../../pageobject/settings/knowledge-management/article-template-style.po';
import consoleKnowledgeTemplatePo from '../../pageobject/settings/knowledge-management/console-knowledge-template.po';
import createKnowledgeArticleTemplatePo from '../../pageobject/settings/knowledge-management/create-knowledge-article-template.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilityCommon from '../../utils/utility.common';

describe('KnowledgeArticlestyle', () => {
    const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
    let knowledgeCoachUser = 'kWilliamson';
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('peter');
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    afterEach(async () => {
        await utilityCommon.refresh();
    });

    it('[DRDMV-5013]: [Template Styles] Availability of default styles on OOB templates', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Knowledge Management--Article Template Styles', 'Template Styles Configuration - Business Workflows');
        await articleTemplateStylePo.navigateToTemplateName('Global', 'Reference');
        expect(await articleTemplateStylePo.getStyleOfAllTemplate()).toContain('Header 1');
        expect(await articleTemplateStylePo.getStyleOfAllTemplate()).toContain('Header 2');
        expect(await articleTemplateStylePo.getStyleOfAllTemplate()).toContain('Header 3');
        expect(await articleTemplateStylePo.getStyleOfAllTemplate()).toContain('Link');
        expect(await articleTemplateStylePo.getStyleOfAllTemplate()).toContain('Paragraph');
    });

    it('[DRDMV-5019]: [Template Styles] Deletion of template styles - OOB/Custom Templates', async () => {
        try {
            await navigationPage.signOut();
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Article Templates', 'Knowledge Article Templates - Business Workflows');
            await consoleKnowledgeTemplatePo.clickCreateNewKATemplate();
            await createKnowledgeArticleTemplatePo.setTemplateName("DRDMV-5019" + randomStr);
            await createKnowledgeArticleTemplatePo.clickOnAddSection();
            await createKnowledgeArticleTemplatePo.setKnowledgeSetValue('Global');
            await createKnowledgeArticleTemplatePo.setSectionTitle('NewThings' + randomStr);
            await createKnowledgeArticleTemplatePo.setDescription('DescriptionOFKA');
            await createKnowledgeArticleTemplatePo.clickOnSaveButton();
            await browser.navigate().back();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Article Template Styles', 'Template Styles Configuration - Business Workflows');
            await articleTemplateStylePo.navigateToTemplateName('Global', 'Reference');
            expect(await articleTemplateStylePo.isDefaultTemplateDisplayed('KCS')).toBeTruthy();
            expect(await articleTemplateStylePo.isDefaultTemplateDisplayed('How To')).toBeTruthy();
            expect(await articleTemplateStylePo.isDeleteStyleButtonPresent()).toBeFalsy('Delete Button should not be Present');
            await articleTemplateStylePo.clickAddNewStyle();
            await articleTemplateStylePo.setStyleName(randomStr);
            await articleTemplateStylePo.clickSaveButton()
            expect(await utilCommon.isPopUpMessagePresent('Saved successfully')).toBeTruthy();
            await articleTemplateStylePo.clickDeleteButton();
            await articleTemplateStylePo.clickSaveButton()
            expect(await utilCommon.isPopUpMessagePresent('Saved successfully')).toBeTruthy();
            expect(await articleTemplateStylePo.isAddedStyleDeleted(randomStr)).toBeFalsy();
            await browser.navigate().back();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Article Template Styles', 'Template Styles Configuration - Business Workflows');
            await articleTemplateStylePo.navigateToTemplateName('Global', "DRDMV-5019" + randomStr);
            expect(await articleTemplateStylePo.isDeleteStyleButtonPresent()).toBeFalsy('Delete Button should not be Present');
            await articleTemplateStylePo.clickAddNewStyle();
            await articleTemplateStylePo.setStyleName(randomStr);
            await articleTemplateStylePo.clickSaveButton()
            expect(await utilCommon.isPopUpMessagePresent('Saved successfully')).toBeTruthy();
            await articleTemplateStylePo.clickDeleteButton();
            await articleTemplateStylePo.clickSaveButton()
            expect(await utilCommon.isPopUpMessagePresent('Saved successfully')).toBeTruthy();
            expect(await articleTemplateStylePo.isAddedStyleDeleted(randomStr)).toBeFalsy('');
        }
        catch (e) {
            throw e;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('peter');
        }
    }, 300 * 1000);

    it('[DRDMV-5020]: [Article Styles] Mandatory field validation on template styles', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Knowledge Management--Article Template Styles', 'Template Styles Configuration - Business Workflows');
        await articleTemplateStylePo.navigateToTemplateName('Global', 'KCS');
        expect(await articleTemplateStylePo.isDefaultTemplateDisplayed('KCS')).toBeTruthy();
        expect(await articleTemplateStylePo.isDefaultTemplateDisplayed('How To')).toBeTruthy();
        expect(await articleTemplateStylePo.isDeleteStyleButtonPresent()).toBeFalsy('Delete Button should not be Present');
        await articleTemplateStylePo.clickAddNewStyle();
        expect(await articleTemplateStylePo.isSaveButtonEnabled()).toBeFalsy('Save Button enabled');
        expect(await articleTemplateStylePo.getStyleNameFieldRequiredValue()).toContain('required', 'Field is not reuqired');
        await articleTemplateStylePo.setStyleName(randomStr);
        await articleTemplateStylePo.clickCancelButton();
        expect(await utilCommon.getWarningMessageTextKnowledgeStyle()).toContain('You have unsaved data. Do you want to continue?');
        utilCommon.clickOnWarningCancel();
        await articleTemplateStylePo.clickSaveButton();
        expect(await utilCommon.isPopUpMessagePresent('Saved successfully')).toBeTruthy();
        await articleTemplateStylePo.clickDeleteButton();
        await articleTemplateStylePo.clickSaveButton();
        expect(await utilCommon.isPopUpMessagePresent('Saved successfully')).toBeTruthy();
    });

    it('[DRDMV-5014,DRDMV-5022]: [Template Styles] Availability of default styles on custom templates', async () => {
        let styleName: string = "DRDMV-5014" + randomStr;
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Knowledge Management--Article Templates', 'Knowledge Article Templates - Business Workflows');
        await consoleKnowledgeTemplatePo.clickCreateNewKATemplate();
        await createKnowledgeArticleTemplatePo.setTemplateName(styleName);
        await createKnowledgeArticleTemplatePo.clickOnAddSection();
        await createKnowledgeArticleTemplatePo.setKnowledgeSetValue('Global');
        await createKnowledgeArticleTemplatePo.setSectionTitle('NewThings' + randomStr);
        await createKnowledgeArticleTemplatePo.setDescription('DescriptionOFKA');
        await createKnowledgeArticleTemplatePo.clickOnSaveButton();
        await browser.navigate().back();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Knowledge Management--Article Template Styles', 'Template Styles Configuration - Business Workflows');
        await articleTemplateStylePo.navigateToTemplateName('Global', styleName);
        expect(await articleTemplateStylePo.getStyleOfAllTemplate()).toContain('Header 1');
        expect(await articleTemplateStylePo.getStyleOfAllTemplate()).toContain('Header 2');
        expect(await articleTemplateStylePo.getStyleOfAllTemplate()).toContain('Header 3');
        expect(await articleTemplateStylePo.getStyleOfAllTemplate()).toContain('Link');
        expect(await articleTemplateStylePo.getStyleOfAllTemplate()).toContain('Paragraph');
        expect(await articleTemplateStylePo.isAddNewStyleButtonDisplay()).toBeTruthy('Add new style button not displayed');
        await articleTemplateStylePo.clickAddNewStyle();
        await articleTemplateStylePo.setStyleName(styleName);
        await articleTemplateStylePo.clickSaveButton();
        expect(await utilCommon.isPopUpMessagePresent('Saved successfully')).toBeTruthy("Save Message is not present");
        await articleTemplateStylePo.clickAddNewStyle();
        await articleTemplateStylePo.setStyleName(styleName);
        await articleTemplateStylePo.clickSaveButton();
        expect(await utilCommon.isPopUpMessagePresent(`The style name ${styleName} is already taken by another style. Please select a different name.`)).toBeTruthy("Duplicate style Message is not present");
    }, 500 * 1000);

    describe('[DRDMV-5023,DRDMV-5018,DRDMV-5015]: [Template Styles] Add/Modify New Style - OOB/Custom Templates', async () => {
        it('[DRDMV-5023,DRDMV-5018,DRDMV-5015]: [Template Styles] Add/Modify New Style - OOB/Custom Templates', async () => {
            await navigationPage.signOut();
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Article Template Styles', 'Template Styles Configuration - Business Workflows');
            await articleTemplateStylePo.navigateToTemplateName('Global', 'Reference');
            expect(await articleTemplateStylePo.isDefaultTemplateDisplayed('KCS')).toBeTruthy();
            expect(await articleTemplateStylePo.isDefaultTemplateDisplayed('How To')).toBeTruthy();
            await articleTemplateStylePo.clickAddNewStyle();
            expect(await articleTemplateStylePo.isDeleteStyleButtonPresent()).toBeTruthy('Delete Button should not be Present');
            expect(await articleTemplateStylePo.isSectionTitlePresent('Please specify the Style Name...')).toBeTruthy('Section Title not be Present');
            await articleTemplateStylePo.setStyleName(randomStr);
            await articleTemplateStylePo.clickOnBoldIcon();
            expect(await articleTemplateStylePo.isTextDisplayedInPreviewBox('Bold')).toBeTruthy('Text Displayed in Bold');
            await articleTemplateStylePo.clickOnBoldIcon();
            await articleTemplateStylePo.clickOnItalicIcon();
            expect(await articleTemplateStylePo.isTextDisplayedInPreviewBox('Italic')).toBeTruthy('Text Displayed in Italic');
            await articleTemplateStylePo.clickOnItalicIcon();
            await articleTemplateStylePo.clickOnUnderLineIcon();
            expect(await articleTemplateStylePo.isTextDisplayedInPreviewBox('Underline')).toBeTruthy('Text Displayed in Underline');
            await articleTemplateStylePo.clickOnUnderLineIcon();
            await articleTemplateStylePo.clickOnStrikeOutIcon();
            expect(await articleTemplateStylePo.isTextDisplayedInPreviewBox('Strikethrough')).toBeTruthy('Text Displayed in Strikethrough');
            await articleTemplateStylePo.clickOnStrikeOutIcon();
            await articleTemplateStylePo.clickOnLeftAlignIcon();
            expect(await articleTemplateStylePo.isTextDisplayedInPreviewBox('Align Left')).toBeTruthy('Text Displayed in Align Left');
            await articleTemplateStylePo.clickOnRightAlignIcon();
            expect(await articleTemplateStylePo.isTextDisplayedInPreviewBox('Align Right')).toBeTruthy('Text Displayed in Align Right');
            await articleTemplateStylePo.clickOnCenterAlignIcon();
            expect(await articleTemplateStylePo.isTextDisplayedInPreviewBox('Align Center')).toBeTruthy('Text Displayed in Align Center');
            await articleTemplateStylePo.clickSaveButton();
            await articleTemplateStylePo.clickDeleteButton();
            await articleTemplateStylePo.clickSaveButton();
            expect(await articleTemplateStylePo.isAddedStyleDeleted(randomStr)).toBeFalsy('');
            
            await articleTemplateStylePo.clickAddNewStyle();
            await articleTemplateStylePo.selectFont("Times");
            expect(await articleTemplateStylePo.isFontStylDetailsDisplayed("Font Family","times")).toBeTruthy('Text Displayed in Font Family');
            await articleTemplateStylePo.clickCancelButton();
            await utilCommon.clickOnWarningOk();

            await articleTemplateStylePo.clickAddNewStyle();
            await articleTemplateStylePo.selectTextColor("#ef8282");
            expect(await articleTemplateStylePo.isFontStylDetailsDisplayed("Text Color","rgb(239, 130, 130)")).toBeTruthy('Text Displayed in Text Color');
            await articleTemplateStylePo.clickCancelButton();
            await utilCommon.clickOnWarningOk();

            await articleTemplateStylePo.clickAddNewStyle();
            await articleTemplateStylePo.selectBackgroundColor("#ef8282");
            expect(await articleTemplateStylePo.isFontStylDetailsDisplayed("Background Color","rgb(239, 130, 130)")).toBeTruthy('Text Displayed in Background Color');
            await articleTemplateStylePo.clickCancelButton();
            await utilCommon.clickOnWarningOk();
        });
        it('[DRDMV-5023,DRDMV-5018,DRDMV-5015]: [Template Styles] Add/Modify New Style - OOB/Custom Templates', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Article Templates', 'Knowledge Article Templates - Business Workflows');
            await consoleKnowledgeTemplatePo.clickCreateNewKATemplate();
            await createKnowledgeArticleTemplatePo.setTemplateName("DRDMV-5023" + randomStr);
            await createKnowledgeArticleTemplatePo.clickOnAddSection();
            await createKnowledgeArticleTemplatePo.setKnowledgeSetValue('Global');
            await createKnowledgeArticleTemplatePo.setSectionTitle('NewThings' + randomStr);
            await createKnowledgeArticleTemplatePo.setDescription('DescriptionOFKA');
            await createKnowledgeArticleTemplatePo.clickOnSaveButton();
            await browser.navigate().back();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Article Template Styles', 'Template Styles Configuration - Business Workflows');
            await articleTemplateStylePo.navigateToTemplateName('Global', "DRDMV-5023" + randomStr);
            expect(await articleTemplateStylePo.isDeleteStyleButtonPresent()).toBeFalsy('Delete Button should not be Present');
            await articleTemplateStylePo.clickAddNewStyle();
            await articleTemplateStylePo.setStyleName(randomStr);
            await articleTemplateStylePo.clickOnBoldIcon();
            expect(await articleTemplateStylePo.isTextDisplayedInPreviewBox('Bold')).toBeTruthy('Text Displayed in Bold');
            await articleTemplateStylePo.clickOnBoldIcon();
            await articleTemplateStylePo.clickOnItalicIcon();
            expect(await articleTemplateStylePo.isTextDisplayedInPreviewBox('Italic')).toBeTruthy('Text Displayed in Italic');
            await articleTemplateStylePo.clickOnItalicIcon();
            await articleTemplateStylePo.clickOnUnderLineIcon();
            expect(await articleTemplateStylePo.isTextDisplayedInPreviewBox('Underline')).toBeTruthy('Text Displayed in Underline');
            await articleTemplateStylePo.clickOnUnderLineIcon();
            await articleTemplateStylePo.clickOnStrikeOutIcon();
            expect(await articleTemplateStylePo.isTextDisplayedInPreviewBox('Strikethrough')).toBeTruthy('Text Displayed in Strikethrough');
            await articleTemplateStylePo.clickOnStrikeOutIcon();
            await articleTemplateStylePo.clickOnLeftAlignIcon();
            expect(await articleTemplateStylePo.isTextDisplayedInPreviewBox('Align Left')).toBeTruthy('Text Displayed in Align Left');
            await articleTemplateStylePo.clickOnRightAlignIcon();
            expect(await articleTemplateStylePo.isTextDisplayedInPreviewBox('Align Right')).toBeTruthy('Text Displayed in Align Right');
            await articleTemplateStylePo.clickOnCenterAlignIcon();
            expect(await articleTemplateStylePo.isTextDisplayedInPreviewBox('Align Center')).toBeTruthy('Text Displayed in Align Center');
            await articleTemplateStylePo.clickSaveButton();
            await articleTemplateStylePo.clickDeleteButton();
            await articleTemplateStylePo.clickSaveButton();
            expect(await articleTemplateStylePo.isAddedStyleDeleted(randomStr)).toBeFalsy('');

            await articleTemplateStylePo.clickAddNewStyle();
            await articleTemplateStylePo.selectFont("Times");
            expect(await articleTemplateStylePo.isFontStylDetailsDisplayed("Font Family","times")).toBeTruthy('Text Displayed in Font Family');
            await articleTemplateStylePo.clickCancelButton();
            await utilCommon.clickOnWarningOk();

            await articleTemplateStylePo.clickAddNewStyle();
            await articleTemplateStylePo.selectTextColor("#ef8282");
            expect(await articleTemplateStylePo.isFontStylDetailsDisplayed("Text Color","rgb(239, 130, 130)")).toBeTruthy('Text Displayed in Text Color');
            await articleTemplateStylePo.clickCancelButton();
            await utilCommon.clickOnWarningOk();

            await articleTemplateStylePo.clickAddNewStyle();
            await articleTemplateStylePo.selectBackgroundColor("#ef8282");
            expect(await articleTemplateStylePo.isFontStylDetailsDisplayed("Background Color","rgb(239, 130, 130)")).toBeTruthy('Text Displayed in Background Color');
            await articleTemplateStylePo.clickCancelButton();
            await utilCommon.clickOnWarningOk();
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        });
    });
});
