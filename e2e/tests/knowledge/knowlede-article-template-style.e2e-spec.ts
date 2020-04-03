import { browser } from "protractor";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import articleTemplateStylePo from '../../pageobject/settings/knowledge-management/article-template-style.po';
import consoleKnowledgeTemplatePo from '../../pageobject/settings/knowledge-management/console-knowledge-template.po';
import createKnowledgeArticleTemplatePo from '../../pageobject/settings/knowledge-management/create-knowledge-article-template.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
describe('KnowledgeArticlestyle', () => {
    const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
    var knowledgeCoachUser = 'kWilliamson';
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('peter');
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    afterEach(async () => {
        await browser.refresh();
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
            expect(await utilCommon.getPopUpMessage()).toContain('Saved successfully')
            await articleTemplateStylePo.clickDeleteButton();
            await articleTemplateStylePo.clickSaveButton()
            expect(await utilCommon.getPopUpMessage()).toContain('Saved successfully')
            expect(await articleTemplateStylePo.isAddedStyleDeleted(randomStr)).toBeFalsy();
            await browser.navigate().back();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Article Template Styles', 'Template Styles Configuration - Business Workflows');
            await articleTemplateStylePo.navigateToTemplateName('Global', "DRDMV-5019" + randomStr);
            expect(await articleTemplateStylePo.isDeleteStyleButtonPresent()).toBeFalsy('Delete Button should not be Present');
            await articleTemplateStylePo.clickAddNewStyle();
            await articleTemplateStylePo.setStyleName(randomStr);
            await articleTemplateStylePo.clickSaveButton()
            expect(await utilCommon.getPopUpMessage()).toContain('Saved successfully')
            await articleTemplateStylePo.clickDeleteButton();
            await articleTemplateStylePo.clickSaveButton()
            expect(await utilCommon.getPopUpMessage()).toContain('Saved successfully')
            expect(await articleTemplateStylePo.isAddedStyleDeleted(randomStr)).toBeFalsy('');
        }
        catch (e) {
            throw e;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('peter');
        }
    }, 150 * 1000);

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
        expect(await utilCommon.getPopUpMessage()).toContain('Saved successfully')
        await articleTemplateStylePo.clickDeleteButton();
        await articleTemplateStylePo.clickSaveButton();
        expect(await utilCommon.getPopUpMessage()).toContain('Saved successfully')
    });

    it('[DRDMV-5014,DRDMV-5022]: [Template Styles] Availability of default styles on custom templates', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Knowledge Management--Article Templates', 'Knowledge Article Templates - Business Workflows');
        await consoleKnowledgeTemplatePo.clickCreateNewKATemplate();
        await createKnowledgeArticleTemplatePo.setTemplateName("DRDMV-5014" + randomStr);
        await createKnowledgeArticleTemplatePo.clickOnAddSection();
        await createKnowledgeArticleTemplatePo.setKnowledgeSetValue('Global');
        await createKnowledgeArticleTemplatePo.setSectionTitle('NewThings' + randomStr);
        await createKnowledgeArticleTemplatePo.setDescription('DescriptionOFKA');
        await createKnowledgeArticleTemplatePo.clickOnSaveButton();
        await browser.navigate().back();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Knowledge Management--Article Template Styles', 'Template Styles Configuration - Business Workflows');
        await articleTemplateStylePo.navigateToTemplateName('Global', "DRDMV-5014" + randomStr);
        expect(await articleTemplateStylePo.getStyleOfAllTemplate()).toContain('Header 1');
        expect(await articleTemplateStylePo.getStyleOfAllTemplate()).toContain('Header 2');
        expect(await articleTemplateStylePo.getStyleOfAllTemplate()).toContain('Header 3');
        expect(await articleTemplateStylePo.getStyleOfAllTemplate()).toContain('Link');
        expect(await articleTemplateStylePo.getStyleOfAllTemplate()).toContain('Paragraph');
        expect(await articleTemplateStylePo.isAddNewStyleButtonDisplay()).toBeTruthy('Add new style button not displayed');
        await articleTemplateStylePo.clickAddNewStyle();
        await articleTemplateStylePo.setStyleName("DRDMV-5014" + randomStr);
        await articleTemplateStylePo.clickSaveButton();
        expect(await utilCommon.getPopUpMessage()).toContain('Saved successfully')
        await articleTemplateStylePo.clickAddNewStyle();
        await articleTemplateStylePo.setStyleName("DRDMV-5014" + randomStr);
        await articleTemplateStylePo.clickSaveButton();
        expect(await utilCommon.getPopUpMessage()).toContain('is already taken by another style. Please select a different name.');
    }, 500 * 1000);
})