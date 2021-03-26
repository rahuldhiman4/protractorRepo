import {$, browser} from 'protractor';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import articleTemplateStylePo from '../../pageobject/settings/knowledge-management/article-template-style.po';
import consoleKnowledgeTemplatePo from '../../pageobject/settings/knowledge-management/console-knowledge-template.po';
import createKnowledgeArticleTemplatePo from '../../pageobject/settings/knowledge-management/create-knowledge-article-template.po';
import { BWF_BASE_URL, BWF_PAGE_TITLES } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';

describe('Knowledge article template style', () => {
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

    it('[5723]: [Template Styles] Availability of default styles on OOB templates', async () => {
        await navigationPage.signOut();
        await loginPage.login(knowledgeCoachUser);
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Knowledge Management--Article Template Styles', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.ARTICLE_TEMPLATE_STYLE);
        await articleTemplateStylePo.navigateToTemplateName('Global', 'Reference');
        expect(await articleTemplateStylePo.getStyleOfAllTemplate()).toContain('Header 1');
        expect(await articleTemplateStylePo.getStyleOfAllTemplate()).toContain('Header 2');
        expect(await articleTemplateStylePo.getStyleOfAllTemplate()).toContain('Header 3');
        expect(await articleTemplateStylePo.getStyleOfAllTemplate()).toContain('Link');
        expect(await articleTemplateStylePo.getStyleOfAllTemplate()).toContain('Paragraph');
    });

    describe('[5719]: [Template Styles] Deletion of template styles - OOB/Custom Templates', () => {
        it('[5719]: [Template Styles] Deletion of template styles - OOB/Custom Templates', async () => {
            await navigationPage.signOut();
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Article Templates', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.ARTICLE_TEMPLATES);
            await consoleKnowledgeTemplatePo.clickCreateNewKATemplate();
            await createKnowledgeArticleTemplatePo.setTemplateName("5719" + randomStr);
            await createKnowledgeArticleTemplatePo.clickOnAddSection();
            await createKnowledgeArticleTemplatePo.setSectionTitle('NewThings' + randomStr);
            await createKnowledgeArticleTemplatePo.setDescription('DescriptionOFKA');
            await createKnowledgeArticleTemplatePo.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
            await browser.navigate().back();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Article Template Styles', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.ARTICLE_TEMPLATE_STYLE);
            await articleTemplateStylePo.navigateToTemplateName('Global', 'Reference');
            expect(await articleTemplateStylePo.isDefaultTemplateDisplayed('KCS')).toBeTruthy();
            expect(await articleTemplateStylePo.isDefaultTemplateDisplayed('How To')).toBeTruthy();
            expect(await articleTemplateStylePo.isDeleteStyleButtonPresent()).toBeFalsy('Delete Button should not be Present');
            await articleTemplateStylePo.clickAddNewStyle();
            await articleTemplateStylePo.setStyleName(randomStr);
            await articleTemplateStylePo.clickSaveButton()
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully')).toBeTruthy();
            await utilityCommon.closePopUpMessage();
            await articleTemplateStylePo.clickDeleteButton(randomStr);
            await articleTemplateStylePo.clickSaveButton()
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully')).toBeTruthy();
            await utilityCommon.closePopUpMessage();
            expect(await articleTemplateStylePo.isAddedStyleDeleted(randomStr)).toBeFalsy();
            await browser.navigate().back();
        });

        it('[5719]: [Template Styles] Deletion of template styles - OOB/Custom Templates', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Article Template Styles', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.ARTICLE_TEMPLATE_STYLE);
            await articleTemplateStylePo.navigateToTemplateName('Human Resource', "5719" + randomStr); // Custom Template is getting created under LOB , cc: @tus
            expect(await articleTemplateStylePo.isDeleteStyleButtonPresent()).toBeFalsy('Delete Button should not be Present');
            await articleTemplateStylePo.clickAddNewStyle();
            await articleTemplateStylePo.setStyleName(randomStr);
            await articleTemplateStylePo.clickSaveButton()
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully')).toBeTruthy();
            await utilityCommon.closePopUpMessage();
            await articleTemplateStylePo.clickDeleteButton(randomStr);
            await articleTemplateStylePo.clickSaveButton()
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully')).toBeTruthy();
            await utilityCommon.closePopUpMessage();
            expect(await articleTemplateStylePo.isAddedStyleDeleted(randomStr)).toBeFalsy('');
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('peter');
        });
    });
//DRDMV-25329, DRDMV-25333
    it('[5718]: [Article Styles] Mandatory field validation on template styles', async () => {  
        await navigationPage.signOut();
        await loginPage.login(knowledgeCoachUser);
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Knowledge Management--Article Template Styles', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.ARTICLE_TEMPLATE_STYLE);
        await articleTemplateStylePo.navigateToTemplateName('Global', 'KCS');
        expect(await articleTemplateStylePo.isDefaultTemplateDisplayed('KCS')).toBeTruthy();
        expect(await articleTemplateStylePo.isDefaultTemplateDisplayed('How To')).toBeTruthy();
        expect(await articleTemplateStylePo.isDeleteStyleButtonPresent()).toBeFalsy('Delete Button should not be Present');
        await articleTemplateStylePo.clickAddNewStyle();
        expect(await articleTemplateStylePo.isSaveButtonEnabled()).toBeFalsy('Save Button enabled');
        expect(await articleTemplateStylePo.isStyleNameFieldRequired()).toBeTruthy('Field is not reuqired');
        await articleTemplateStylePo.setStyleName(randomStr);
        await articleTemplateStylePo.clickCancelButton();
        expect(await utilityCommon.getWarningDialogMsg()).toContain('You have unsaved data. Do you want to continue?');
        utilityCommon.clickOnApplicationWarningYesNoButton('No');
        await articleTemplateStylePo.clickSaveButton();
        expect(await utilityCommon.isPopUpMessagePresent('Saved successfully')).toBeTruthy();
        await utilityCommon.closePopUpMessage();
        await articleTemplateStylePo.clickDeleteButton(randomStr);
        await articleTemplateStylePo.clickSaveButton();
        expect(await utilityCommon.isPopUpMessagePresent('Saved successfully')).toBeTruthy();
        await utilityCommon.closePopUpMessage();
    });

    describe('[5722,5717]: [Template Styles] Availability of default styles on custom templates', () => {
        let styleName: string = "5722" + randomStr;
        it('[5722,5717]: [Template Styles] Availability of default styles on custom templates', async () => {
            await navigationPage.signOut();
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Article Templates', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.ARTICLE_TEMPLATES);
            await consoleKnowledgeTemplatePo.clickCreateNewKATemplate();
            await createKnowledgeArticleTemplatePo.setTemplateName(styleName);
            await createKnowledgeArticleTemplatePo.clickOnAddSection();
            await createKnowledgeArticleTemplatePo.setSectionTitle('NewThings' + randomStr);
            await createKnowledgeArticleTemplatePo.setDescription('DescriptionOFKA');
            await createKnowledgeArticleTemplatePo.clickOnSaveButton();
            await browser.navigate().back();
        });

        it('[5722,5717]: [Template Styles] Availability of default styles on custom templates', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Article Template Styles', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.ARTICLE_TEMPLATE_STYLE);
            await articleTemplateStylePo.navigateToTemplateName('Human Resource', styleName);
            expect(await articleTemplateStylePo.getStyleOfAllTemplate()).toContain('Header 1');
            expect(await articleTemplateStylePo.getStyleOfAllTemplate()).toContain('Header 2');
            expect(await articleTemplateStylePo.getStyleOfAllTemplate()).toContain('Header 3');
            expect(await articleTemplateStylePo.getStyleOfAllTemplate()).toContain('Link');
            expect(await articleTemplateStylePo.getStyleOfAllTemplate()).toContain('Paragraph');
            expect(await articleTemplateStylePo.isAddNewStyleButtonDisplay()).toBeTruthy('Add new style button not displayed');
            await articleTemplateStylePo.clickAddNewStyle();
            await articleTemplateStylePo.setStyleName(styleName);
            await articleTemplateStylePo.clickSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully')).toBeTruthy("Save Message is not present");
            await articleTemplateStylePo.clickAddNewStyle();
            await articleTemplateStylePo.setStyleName(styleName);
            await articleTemplateStylePo.clickSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent(`The style name ${styleName} is already taken by another style. Please select a different name.`)).toBeTruthy("Duplicate style Message is not present");
        });
    });
//DRDMV-25334
    describe('[5716,5720,5721]: [Template Styles] Add/Modify New Style - OOB/Custom Templates', async () => {
        it('[5716,5720,5721]: [Template Styles] Add/Modify New Style - OOB/Custom Templates', async () => {
            await navigationPage.signOut();
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Article Template Styles', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.ARTICLE_TEMPLATE_STYLE);
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
            await articleTemplateStylePo.clickDeleteButton(randomStr);
            await articleTemplateStylePo.clickSaveButton();
            expect(await articleTemplateStylePo.isAddedStyleDeleted(randomStr)).toBeFalsy('');

            await articleTemplateStylePo.clickAddNewStyle();
            await articleTemplateStylePo.selectFont("Times");
            expect(await articleTemplateStylePo.isFontStylDetailsDisplayed("Font Family", "Times")).toBeTruthy('Text Displayed in Font Family');
            await articleTemplateStylePo.clickCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');

            await articleTemplateStylePo.clickAddNewStyle();
            await articleTemplateStylePo.selectTextColor("#ef8282");
            expect(await articleTemplateStylePo.isFontStylDetailsDisplayed("Text Color", "rgb(239, 130, 130)")).toBeTruthy('Text Displayed in Text Color');
            await articleTemplateStylePo.clickCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');

            await articleTemplateStylePo.clickAddNewStyle();
            await articleTemplateStylePo.selectBackgroundColor("#ef8282");
            expect(await articleTemplateStylePo.isFontStylDetailsDisplayed("Background Color", "rgb(239, 130, 130)")).toBeTruthy('Text Displayed in Background Color');
            await articleTemplateStylePo.clickCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });
        it('[5716,5720,5721]: [Template Styles] Add/Modify New Style - OOB/Custom Templates', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Article Templates', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.ARTICLE_TEMPLATES);
            await consoleKnowledgeTemplatePo.clickCreateNewKATemplate();
            await createKnowledgeArticleTemplatePo.setTemplateName("5716" + randomStr);
            await createKnowledgeArticleTemplatePo.clickOnAddSection();
            await createKnowledgeArticleTemplatePo.setSectionTitle('NewThings' + randomStr);
            await createKnowledgeArticleTemplatePo.setDescription('DescriptionOFKA');
            await createKnowledgeArticleTemplatePo.clickOnSaveButton();
            await browser.navigate().back();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Article Template Styles', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.ARTICLE_TEMPLATE_STYLE);
            await articleTemplateStylePo.navigateToTemplateName('Human Resource', "5716" + randomStr);
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
            await articleTemplateStylePo.clickDeleteButton(randomStr);
            await articleTemplateStylePo.clickSaveButton();
            expect(await articleTemplateStylePo.isAddedStyleDeleted(randomStr)).toBeFalsy('');

            await articleTemplateStylePo.clickAddNewStyle();
            await articleTemplateStylePo.selectFont("Times");
            expect(await articleTemplateStylePo.isFontStylDetailsDisplayed("Font Family", "Times")).toBeTruthy('Text Displayed in Font Family');
            await articleTemplateStylePo.clickCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');

            await articleTemplateStylePo.clickAddNewStyle();
            await articleTemplateStylePo.selectTextColor("#ef8282");
            expect(await articleTemplateStylePo.isFontStylDetailsDisplayed("Text Color", "rgb(239, 130, 130)")).toBeTruthy('Text Displayed in Text Color');
            await articleTemplateStylePo.clickCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');

            await articleTemplateStylePo.clickAddNewStyle();
            await articleTemplateStylePo.selectBackgroundColor("#ef8282");
            expect(await articleTemplateStylePo.isFontStylDetailsDisplayed("Background Color", "rgb(239, 130, 130)")).toBeTruthy('Text Displayed in Background Color');
            await articleTemplateStylePo.clickCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        });
    });
});
