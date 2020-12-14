import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import apiCoreUtil from '../../api/api.core.util';
import createKnowledgePage from "../../pageobject/knowledge/create-knowlege.po";
import changeAssignmentBladePo from '../../pageobject/common/change-assignment-blade.po';
import previewKnowledgePo from '../../pageobject/knowledge/preview-knowledge.po';
import viewKnowledgeArticlePo from '../../pageobject/knowledge/view-knowledge-article.po';
import editKnowledgePo from '../../pageobject/knowledge/edit-knowledge.po';
import knowledgeArticlesConsolePo from '../../pageobject/knowledge/knowledge-articles-console.po';
import statusBladeKnowledgeArticlePo from '../../pageobject/knowledge/status-blade-knowledge-article.po';
import utilityGrid from '../../utils/utility.grid';

describe('Knowledge Article Creation', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    describe('[DRDMV-23597]: [Operating Organization] [Knowledge] Verify the Knowledge Article Creation with respect to Line of Business when user has access to single Line of Business', () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let knowledgeSetTitle = 'KnowledgeSet_' + randomStr, articleData, articleDetails;
        const knowledgeTemplateStr = 'ArticleTemplate_' + randomStr;
        beforeAll(async () => {
            // Knowledge set under LOB HR
            let knowledgeSetData = {
                knowledgeSetTitle: `${knowledgeSetTitle}`,
                knowledgeSetDesc: `${knowledgeSetTitle}_Desc`,
                company: 'Petramco'
            }
            await apiHelper.apiLogin('elizabeth');
            await apiHelper.createKnowledgeSet(knowledgeSetData);
            // Knowledge Template under LOB HR
            let knowledgeArticleTemplateData = {
                templateName: knowledgeTemplateStr,
                sectionTitle: "articleSection"
            }
            await apiHelper.createKnowledgeArticleTemplate(knowledgeArticleTemplateData);
            let knowledgeTemplateId = await apiCoreUtil.getKnowledgeTemplateGuid(knowledgeTemplateStr);
        });
        it('[DRDMV-23597]: [Operating Organization] [Knowledge] Verify the Knowledge Article Creation with respect to Line of Business when user has access to single Line of Business', async () => {
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate(knowledgeTemplateStr);
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            expect(await createKnowledgePage.getValueOfLineOFBusiness()).toContain('Human Resource', 'value not matched with expected');
            await expect(createKnowledgePage.isLineOfBusinessDisable());
            expect(await createKnowledgePage.isValuePresentInDropdown('Knowledge Set', knowledgeSetTitle)).toBeTruthy('Failure: Knowledge Set is missing');
            expect(await createKnowledgePage.isValuePresentInDropdown('Category Tier 1', 'Employee Relations')).toBeTruthy('Failure: Operational Category 1 is missing');

            //Verify Knowledge set and category belonging to LOB Finanace are not visible
            expect(await createKnowledgePage.isValuePresentInDropdown('Knowledge Set', 'Facilities')).toBeFalsy('Failure: Knowledge Set is available');
            expect(await createKnowledgePage.isValuePresentInDropdown('Category Tier 1', 'Facilties')).toBeFalsy('Failure: Operational Category 1 is missing');

            //Knowledge creation
            await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeSetTitle);
            await createKnowledgePage.selectKnowledgeSet(knowledgeSetTitle);
            await createKnowledgePage.selectCategoryTier1Option('Employee Relations');
            await createKnowledgePage.selectCategoryTier2Option('Compensation');
            await createKnowledgePage.selectCategoryTier3Option('Bonus');
            await createKnowledgePage.clickChangeAssignmentButton();
            await changeAssignmentBladePo.selectCompany('Petramco');
            // Need to add validation to verify Business unit , support group, Agent are visible as per logged in user LOB - Human Resource on create knowledge article
            await changeAssignmentBladePo.selectBusinessUnit('United States Support')
            await changeAssignmentBladePo.selectSupportGroup('US Support 3');
            await changeAssignmentBladePo.selectAssignee('Qadim Katawazi');
            await changeAssignmentBladePo.clickOnAssignButton();
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await previewKnowledgePo.clickGoToArticleButton();
        });
        it('[DRDMV-23597]: [Operating Organization] [Knowledge] Verify the Knowledge Article Creation with respect to Line of Business when user has access to single Line of Business', async () => {
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            expect(await editKnowledgePo.getLineOfBusinessValue()).toBe('Human Resource');
            expect(await editKnowledgePo.getCategoryTier1SelectedValue()).toBe('Employee Relations');
            expect(await editKnowledgePo.isValuePresentInDropdown('Category Tier 1', 'Facilities')).toBeFalsy('Failure: Operational Category 1 is missing');
            await editKnowledgePo.cancelKnowledgeMedataDataChanges();
            // Need to add validation to verify Business unit , support group, Agent are visible as per logged in user LOB - Human Resource on edit Knowledge article
            await editKnowledgePo.setKnowledgeStatus('Draft');
            await utilityCommon.closePopUpMessage();
            await editKnowledgePo.setKnowledgeStatusWithoutSave('SME Review');
            await statusBladeKnowledgeArticlePo.clickChangeReviewerBtn();
            await changeAssignmentBladePo.selectCompany('Petramco');
            // Need to add validation to verify Business unit , support group, Agent are visible as per logged in user LOB - Human Resource on SME Review blade
            await changeAssignmentBladePo.selectBusinessUnit('United States Support');
            await changeAssignmentBladePo.selectSupportGroup('US Support 3');
            await changeAssignmentBladePo.selectAssignee('Qadim Katawazi');
            await changeAssignmentBladePo.clickOnAssignButton();
            await editKnowledgePo.clickSaveStatusBtn();
        });
        it('[DRDMV-23597]: [Operating Organization] [Knowledge] Verify the Knowledge Article Creation with respect to Line of Business when user has access to single Line of Business', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoKnowledgeConsole();
            await utilityGrid.clearFilter();
            expect(await knowledgeArticlesConsolePo.isGridRecordPresent(knowledgeSetTitle)).toBeFalsy('Artcile is present');
        });
    });
})
