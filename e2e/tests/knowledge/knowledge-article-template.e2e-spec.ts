import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import loginPage from '../../pageobject/common/login.po';
import navigationPage from '../../pageobject/common/navigation.po';
import createKnowledgePage from '../../pageobject/knowledge/create-knowlege.po';
import consoleKnowledgeTemplatePo from '../../pageobject/settings/knowledge-management/console-knowledge-template.po';
import createKnowledgeArticleTemplatePo from '../../pageobject/settings/knowledge-management/create-knowledge-article-template.po';
import editKnowledgeTemplatePo from '../../pageobject/settings/knowledge-management/edit-knowledge-article-template.po';
import { BWF_BASE_URL, BWF_PAGE_TITLES } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

describe('Knowledge Article Template', () => {

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteArticleTemplate('Template Name DRDMV_1088');
        await loginPage.login('kWilliamson');
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Knowledge Management--Article Templates', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.ARTICLE_TEMPLATES);
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    it('[6375]: [Create Mode] Article template is not saved when user goes away from Create new Knowledge Article Template', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await consoleKnowledgeTemplatePo.clickCreateNewKATemplate();
        await createKnowledgeArticleTemplatePo.setTemplateName('template1062' + randomStr);
        await createKnowledgeArticleTemplatePo.clickCancelBtn();
        expect(await utilityCommon.getWarningDialogMsg()).toBe('You have unsaved data. Do you want to continue?');
        await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        expect(await utilityGrid.isGridRecordPresent('template1062' + randomStr)).toBeFalsy('Record should not be created');
    });

    describe('[6360]: [Create Mode] Unable to create the duplicate template', () => {
        it('[6360]: [Create Mode] Unable to create the duplicate template', async () => {
            let templateName = 'Template Name DRDMV_1088';
            let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let knowledgeSetData = {
                knowledgeSetTitle: 'KASetPetramco' + randomStr,
                knowledgeSetDesc: 'KAPetramco_Desc' + randomStr,
                company: 'Petramco'
            }
            //Creating an Article Template from API
            let knowledgeArticleTemplateData = {
                templateName: templateName,
                sectionTitle: "articleSection",
                // lineOfBusiness: "Human Resource",
                knowledgeSetTitle: knowledgeSetData.knowledgeSetTitle,
            }
            await apiHelper.apiLogin('jbarnes');
            await apiHelper.createKnowledgeArticleTemplate(knowledgeArticleTemplateData);

            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Article Templates', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.ARTICLE_TEMPLATES);
            //Creating the Article Template with same name and set from UI
            await utilityGrid.selectLineOfBusiness('Human Resource');
            await consoleKnowledgeTemplatePo.clickCreateNewKATemplate();
            await createKnowledgeArticleTemplatePo.setTemplateName(templateName);
            await createKnowledgeArticleTemplatePo.clickOnAddSection();
            await createKnowledgeArticleTemplatePo.setSectionTitle('Section Title');
            await createKnowledgeArticleTemplatePo.clickOnSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Template already exists.')).toBeTruthy();
            await utilityCommon.closePopUpMessage();
            await createKnowledgeArticleTemplatePo.clickCancelBtn();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');

            //Creating the Article Template with same name but different LOB
            await utilityGrid.selectLineOfBusiness('Facilities');
            await consoleKnowledgeTemplatePo.clickCreateNewKATemplate();
            await createKnowledgeArticleTemplatePo.setTemplateName(templateName);
            await createKnowledgeArticleTemplatePo.clickOnAddSection();
            await createKnowledgeArticleTemplatePo.setSectionTitle('Section Title');
            // verify LOB is on create screen
            expect(await createKnowledgeArticleTemplatePo.getLobValue()).toBe("Facilities");
            await createKnowledgeArticleTemplatePo.clickOnSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent(`Knowledge Template : ${templateName} has been successfully created`)).toBeTruthy();
            // verify LOB is on edit screen
            await utilityGrid.searchAndOpenHyperlink(templateName);
            expect(await editKnowledgeTemplatePo.getLobValue()).toBe("Facilities");
            await editKnowledgeTemplatePo.clickOnCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            await utilityGrid.selectLineOfBusiness('Human Resource');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('kWilliamson');
        });
    });

    describe('[6435,6372,6342]: [Create Mode] Create a template for Knowledge article', () => {
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            let knowledgeSetData = {
                knowledgeSetTitle: 'Knowledge Set Petramco Title',
                knowledgeSetDesc: 'Knowledge Set Petramco_Desc',
                company: 'Petramco'
            }

            await apiHelper.deleteArticleTemplate('DRDMV1065');
            await apiHelper.deleteArticleTemplate('DRDMV619');
            await apiHelper.deleteArticleTemplate('Article Template Name Petramco');
            await apiHelper.deleteKnowledgeSet('Knowledge Set Petramco Title');
            await apiHelper.createKnowledgeSet(knowledgeSetData);

            let knowledgeArticleTemplateData = {
                templateName: 'Article Template Name Petramco',
                sectionTitle: "articleSection",
                knowledgeSetTitle: knowledgeSetData.knowledgeSetTitle,
            }
            await apiHelper.createKnowledgeArticleTemplate(knowledgeArticleTemplateData);
        });

        it('[6435,6372,6342]: Create templates for Knowledge article', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Article Templates', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.ARTICLE_TEMPLATES);
            await consoleKnowledgeTemplatePo.clickCreateNewKATemplate();
            await createKnowledgeArticleTemplatePo.setTemplateName('DRDMV1065');
            await createKnowledgeArticleTemplatePo.clickOnAddSection();
            expect(await createKnowledgeArticleTemplatePo.getfieldLabel('Section Title')).toBeTruthy('Section Title');
            await createKnowledgeArticleTemplatePo.setSectionTitle('Section Title1');
            await createKnowledgeArticleTemplatePo.clickOnAddSection();
            await createKnowledgeArticleTemplatePo.setSectionTitle('Section Title2', 2);
            await createKnowledgeArticleTemplatePo.clickOnAddSection();
            await createKnowledgeArticleTemplatePo.setSectionTitle('Section Title3', 3);
            await createKnowledgeArticleTemplatePo.clickOnAddSection();
            await createKnowledgeArticleTemplatePo.setSectionTitle('Section Title4', 4);
            await createKnowledgeArticleTemplatePo.collapseFirstSection();
            expect(await createKnowledgeArticleTemplatePo.isSectionVisible(1)).toBeFalsy('First section is visible');
            await createKnowledgeArticleTemplatePo.expandFirstSection();
            expect(await createKnowledgeArticleTemplatePo.isSectionVisible(1)).toBeTruthy('First section is not visible');

            await createKnowledgeArticleTemplatePo.clickCollapseAll();
            expect(await createKnowledgeArticleTemplatePo.isSectionVisible(1)).toBeFalsy('First section is visible');
            expect(await createKnowledgeArticleTemplatePo.isSectionVisible(2)).toBeFalsy('Second section is visible');
            expect(await createKnowledgeArticleTemplatePo.isSectionVisible(3)).toBeFalsy('Third section is visible');
            expect(await createKnowledgeArticleTemplatePo.isSectionVisible(4)).toBeFalsy('Fourth section is visible');

            await createKnowledgeArticleTemplatePo.clickExpandAll();
            expect(await createKnowledgeArticleTemplatePo.isSectionVisible(1)).toBeTruthy('First section is not visible');
            expect(await createKnowledgeArticleTemplatePo.isSectionVisible(2)).toBeTruthy('Second section is not visible');
            expect(await createKnowledgeArticleTemplatePo.isSectionVisible(3)).toBeTruthy('Third section is not visible');
            expect(await createKnowledgeArticleTemplatePo.isSectionVisible(4)).toBeTruthy('Fourth section is not visible');

            expect(await createKnowledgeArticleTemplatePo.getfieldLabel('Template Name')).toBeTruthy('Template Name');
            expect(await createKnowledgeArticleTemplatePo.getfieldLabel('Template Description')).toBeTruthy('Template Description');

            expect(await utilityCommon.isButtonVisible('Add Section')).toBeTruthy('Add Section button is not visible');
            expect(await utilityCommon.isButtonVisible('Expand All')).toBeTruthy('Expand All button is not visible');
            expect(await utilityCommon.isButtonVisible('Collapse All')).toBeTruthy('Collapse All button is not visible');
            expect(await utilityCommon.isButtonVisible('Save')).toBeTruthy('Save button is not visible');
            expect(await utilityCommon.isButtonVisible('Cancel')).toBeTruthy('Cancel button is not visible');

            await createKnowledgeArticleTemplatePo.clickOnSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Knowledge Template : DRDMV1065 has been successfully created')).toBeTruthy('Success message does not match');

            await consoleKnowledgeTemplatePo.clickCreateNewKATemplate();
            await createKnowledgeArticleTemplatePo.setTemplateName('DRDMV619');
            await createKnowledgeArticleTemplatePo.clickOnAddSection();
            await createKnowledgeArticleTemplatePo.setSectionTitle('Section Title_1');
            await createKnowledgeArticleTemplatePo.clickOnSaveButton();
            expect(await utilityGrid.isGridRecordPresent('DRDMV1065')).toBeTruthy('Record does not exist');
            expect(await utilityGrid.isGridRecordPresent('DRDMV619')).toBeTruthy('Record does not exist');
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.switchToApplication("Knowledge Management");
            await navigationPage.gotoCreateKnowledge();
        });

        it('[6435,6372,6342]: [Create Mode] Create a template for Knowledge article', async () => {
            expect(await createKnowledgePage.isTemplatePresent('DRDMV1065')).toBeTruthy('Template DRDMV1065 is not present');
            expect(await createKnowledgePage.isTemplatePresent('DRDMV619')).toBeTruthy('Template DRDMV619 is not present');

            expect(await createKnowledgePage.isTemplateDescriptionPresent('KCS Template')).toBeTruthy('Template Description is missing');
            expect(await createKnowledgePage.isSectionTitleVisibleOnPreview('Problem')).toBeTruthy('Section title is missing');
            expect(await createKnowledgePage.isSectionTitleVisibleOnPreview('Environment')).toBeTruthy('Section title is missing');
            expect(await createKnowledgePage.isSectionTitleVisibleOnPreview('Resolution')).toBeTruthy('Section title is missing');

            await createKnowledgePage.clickOnTemplate('KCS');
            expect(await createKnowledgePage.isKnowledgeStyleTemplateDisplayed()).toBeTruthy('style is not present');
            expect(await createKnowledgePage.isTemplatePreviewPresent()).toBeTruthy('Template Preview is not present');

            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField('Article Title KCS');
            await createKnowledgePage.selectKnowledgeSet('HR');
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await createKnowledgePage.clickBackBtn();
            await utilityCommon.closeAllBlades();
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate('DRDMV619');
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField('Article Title 619');
            await createKnowledgePage.selectKnowledgeSet('Policy');
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await createKnowledgePage.clickBackBtn();
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoCreateKnowledge();
            expect(await createKnowledgePage.isTemplatePresent('Article Template Name Petramco')).toBeFalsy('Template Article Template Name Petramco is present');
            await navigationPage.signOut();
            await loginPage.login('kWilliamson');
            await navigationPage.switchToApplication("Knowledge Management");
            await utilityGrid.clearFilter();
            expect(await utilityGrid.isGridRecordPresent('Article Title KCS')).toBeTruthy('Article1 is not present');
            await utilityGrid.clearFilter();
            expect(await utilityGrid.isGridRecordPresent('Article Title 619')).toBeTruthy('Article2 is not present');
        })
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        });
    });
});
