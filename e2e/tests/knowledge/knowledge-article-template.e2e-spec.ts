import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import loginPage from '../../pageobject/common/login.po';
import navigationPage from '../../pageobject/common/navigation.po';
import createKnowledgePage from '../../pageobject/knowledge/create-knowlege.po';
import consoleKnowledgeTemplatePo from '../../pageobject/settings/knowledge-management/console-knowledge-template.po';
import createKnowledgeArticleTemplatePo from '../../pageobject/settings/knowledge-management/create-knowledge-article-template.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilGrid from '../../utils/util.grid';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

describe('Knowledge Article Template', () => {

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteArticleTemplate('Template Name DRDMV-1088');
        await loginPage.login('kWilliamson');
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Knowledge Management--Article Templates', 'Knowledge Article Templates');
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    it('[DRDMV-1062]: [Create Mode] Article template is not saved when user goes away from Create new Knowledge Article Template', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await consoleKnowledgeTemplatePo.clickCreateNewKATemplate();
        await createKnowledgeArticleTemplatePo.setTemplateName('template1062' + randomStr);
        await createKnowledgeArticleTemplatePo.setKnowledgeSetValue('HR');
        await createKnowledgeArticleTemplatePo.clickCancelBtn();
        expect(await utilCommon.getWarningDialogMsg()).toBe('You have unsaved data. Do you want to continue?');
        await utilCommon.clickOnWarningOk();
        expect(await utilGrid.isGridRecordPresent('template1062' + randomStr)).toBeFalsy('Record should not be created');
    });

    it('[DRDMV-1088]: [Create Mode] Unable to create the duplicate template', async () => {
        let templateName = 'Template Name DRDMV-1088';

        //Creating an Article Template from API
        let knowledgeArticleTemplateData = {
            templateName: `${templateName}`,
            company: "Petramco",
            knowledgeSetId: "AGGADGG8ECDC0AQGPUJ1QFRW9RZH4E",
            title: "articleSection"
        }
        await apiHelper.apiLogin('kWilliamson');
        await apiHelper.createKnowledgeArticleTemplate('Policy', 'AGGAA5V0GENSZAOO2YJBON6YXXU1R6', knowledgeArticleTemplateData);

        //Creating the Article Template with same name and set from UI
        await consoleKnowledgeTemplatePo.clickCreateNewKATemplate();
        await createKnowledgeArticleTemplatePo.setTemplateName(templateName);
        await createKnowledgeArticleTemplatePo.setKnowledgeSetValue('Policy');
        await createKnowledgeArticleTemplatePo.clickOnAddSection();
        await createKnowledgeArticleTemplatePo.setSectionTitle('Section Title');
        await createKnowledgeArticleTemplatePo.clickOnSaveButton();
        expect(await utilCommon.isPopUpMessagePresent('ERROR (222061): Template already exists.')).toBeTruthy();
        await utilCommon.closePopUpMessage();
        await createKnowledgeArticleTemplatePo.clickCancelBtn();
        await utilCommon.clickOnWarningOk();

        //Creating the Article Template with same name but different set from UI
        await consoleKnowledgeTemplatePo.clickCreateNewKATemplate();
        await createKnowledgeArticleTemplatePo.setTemplateName(templateName);
        await createKnowledgeArticleTemplatePo.setKnowledgeSetValue('Global');
        await createKnowledgeArticleTemplatePo.clickOnAddSection();
        await createKnowledgeArticleTemplatePo.setSectionTitle('Section Title');
        await createKnowledgeArticleTemplatePo.clickOnSaveButton();
        expect(await utilCommon.isPopUpMessagePresent('Knowledge Template : Template Name DRDMV-1088 has been successfully created')).toBeTruthy();
    });

    describe('[DRDMV-619,DRDMV-1065,DRDMV-1180]: [Create Mode] Create a template for Knowledge article', () => {
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            let knowledgeSetData = {
                knowledgeSetTitle: 'Knowledge Set Psilon Title',
                knowledgeSetDesc: 'Knowledge Set Psilon_Desc',
                company: 'Psilon'
            }

            let knowledgeArticleTemplateData = {
                templateName: 'Article Template Name Psilon',
                company: "Psilon",
                knowledgeSetId: 'AGGADGG8ECDC0AQGPUJ1QFRW9RZH4E',
                title: "articleSection"
            }

            await apiHelper.deleteArticleTemplate('DRDMV-1065');
            await apiHelper.deleteArticleTemplate('DRDMV-619');
            await apiHelper.deleteArticleTemplate('Article Template Name Psilon');
            await apiHelper.deleteKnowledgeSet('Knowledge Set Psilon Title');

            let knowledgeSet = await apiHelper.createKnowledgeSet(knowledgeSetData);
            await apiHelper.createKnowledgeArticleTemplate(knowledgeSetData.knowledgeSetTitle, knowledgeSet.id, knowledgeArticleTemplateData);
        });

        it('[DRDMV-619,DRDMV-1065,DRDMV-1180]: Create templates for Knowledge article', async () => {
            await consoleKnowledgeTemplatePo.clickCreateNewKATemplate();
            await createKnowledgeArticleTemplatePo.setTemplateName('DRDMV-1065');
            await createKnowledgeArticleTemplatePo.setKnowledgeSetValue('Global');
            await createKnowledgeArticleTemplatePo.clickOnAddSection();
            expect(await createKnowledgeArticleTemplatePo.getfieldLabel('Section Title')).toBe('Section Title');
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

            expect(await createKnowledgeArticleTemplatePo.getfieldLabel('Template Name')).toBe('Template Name');
            expect(await createKnowledgeArticleTemplatePo.getfieldLabel('Template Description')).toBe('Template Description');
            expect(await createKnowledgeArticleTemplatePo.getfieldLabel('Knowledge Set')).toBe('Knowledge Set');

            expect(await utilCommon.isButtonVisible('Add Section')).toBeTruthy('Add Section button is not visible');
            expect(await utilCommon.isButtonVisible('Expand All')).toBeTruthy('Expand All button is not visible');
            expect(await utilCommon.isButtonVisible('Collapse All')).toBeTruthy('Collapse All button is not visible');
            expect(await utilCommon.isButtonVisible('Save')).toBeTruthy('Save button is not visible');
            expect(await utilCommon.isButtonVisible('Cancel')).toBeTruthy('Cancel button is not visible');

            await createKnowledgeArticleTemplatePo.clickOnSaveButton();
            expect(await utilCommon.isPopUpMessagePresent('Knowledge Template : DRDMV-1065 has been successfully created')).toBeTruthy('Success message does not match');

            await consoleKnowledgeTemplatePo.clickCreateNewKATemplate();
            await createKnowledgeArticleTemplatePo.setTemplateName('DRDMV-619');
            await createKnowledgeArticleTemplatePo.setKnowledgeSetValue('HR');
            await createKnowledgeArticleTemplatePo.clickOnAddSection();
            await createKnowledgeArticleTemplatePo.setSectionTitle('Section Title_1');
            await createKnowledgeArticleTemplatePo.clickOnSaveButton();
            expect(await utilGrid.isGridRecordPresent('DRDMV-1065')).toBeTruthy('Record does not exist');
            expect(await utilGrid.isGridRecordPresent('DRDMV-619')).toBeTruthy('Record does not exist');
            await utilCommon.switchToNewWidnow(1);
            await navigationPage.switchToApplication("Knowledge Management");
            await navigationPage.gotoCreateKnowledge();
        });

        it('[DRDMV-619,DRDMV-1065,DRDMV-1180]: [Create Mode] Create a template for Knowledge article', async () => {
            expect(await createKnowledgePage.isTemplatePresent('DRDMV-1065')).toBeTruthy('Template DRDMV-1065 is not present');
            expect(await createKnowledgePage.isTemplatePresent('DRDMV-619')).toBeTruthy('Template DRDMV-619 is not present');
            expect(await createKnowledgePage.isTemplatePresent('Article Template Name Psilon')).toBeFalsy('Template Article Template Name Psilon is present');

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

            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate('DRDMV-619');
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField('Article Title 619');
            await createKnowledgePage.selectKnowledgeSet('Policy');
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await createKnowledgePage.clickBackBtn();

            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.switchToApplication("Knowledge Management");
            await utilityGrid.clearFilter();
            expect(await utilityGrid.isGridRecordPresent('Article Title KCS')).toBeTruthy('Article is not present');
            expect(await utilityGrid.isGridRecordPresent('Article Title 619')).toBeTruthy('Article is not present');
        })
    });
});
