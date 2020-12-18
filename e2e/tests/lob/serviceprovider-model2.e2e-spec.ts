import quickCasePo from '../../pageobject/case/quick-case.po';
import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import changeAssignmentBladePo from '../../pageobject/common/change-assignment-blade.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import { default as createKnowledgePage } from "../../pageobject/knowledge/create-knowlege.po";
import editKnowledgePo from '../../pageobject/knowledge/edit-knowledge.po';
import previewKnowledgePo from '../../pageobject/knowledge/preview-knowledge.po';
import viewKnowledgeArticlePo from '../../pageobject/knowledge/view-knowledge-article.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';
import casePreviewPo from '../../pageobject/case/case-preview.po';
import editCasePo from '../../pageobject/case/edit-case.po';
import viewCasePo from '../../pageobject/case/view-case.po';
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import previewCaseTemplateCasesPo from '../../pageobject/settings/case-management/preview-case-template.po';
import statusBladeKnowledgeArticlePo from '../../pageobject/knowledge/status-blade-knowledge-article.po';
describe('Service Provider Model Tests Extended', () => {
    let kingstoneUserName = 'smoran@petramco.com';
    let oracleUserName = 'umiguelde@petramco.com';
    let kingstonAndOracleUserName = 'jstuart@petramco.com';
    let kingstonLegalUserName = 'yhenny@petramco.com';

    let password = 'Password_1234';
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //ankagraw
    describe('[DRDMV-23678,DRDMV-23683,DRDMV-23762,DRDMV-23746]: [Service Provider Model] [Knowledge] Verify the Knowledge Article Creation with respect to Line of Business when user has access to single Line of Business', () => {
        let knowledgeArticleTemplateData, knowledgeSetDataKingstanLegalWithKingstanCompany, knowledgeSetDataKingstanLegal, knowledgeKingstanLegalID, knowledgeArticleData, knowledgeSetDataKingstan, articleData, knowledgeSetDataFinance, knowledgeOrcleID, knowledgeKingstanID, knowledgeSetDataOracle, randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            // Create Data with Kingston HR LOB

            knowledgeSetDataKingstan = {
                knowledgeSetTitle: "Knowledge Set kingston" + randomStr,
                knowledgeSetDesc: "Knowledge description kingston" + randomStr,
                company: 'Phyto',
                lineOfBusiness: "Kingston HR"
            }

            knowledgeSetDataOracle = {
                knowledgeSetTitle: "Knowledge Set Oracle" + randomStr,
                knowledgeSetDesc: "Knowledge description Oracle" + randomStr,
                company: 'Phyto',
                lineOfBusiness: "Oracle HR"
            }

            knowledgeSetDataFinance = {
                knowledgeSetTitle: "KnowledgeSetFinance" + randomStr,
                knowledgeSetDesc: "Knowledge description Finance" + randomStr,
                company: 'Phyto',
                lineOfBusiness: "KingstonOracle Finance"
            }

            knowledgeSetDataKingstanLegal = {
                knowledgeSetTitle: "KnowledgeSetKingstanLegalPhyto" + randomStr,
                knowledgeSetDesc: "Knowledge description Finance" + randomStr,
                company: 'Phyto',
                lineOfBusiness: "Kingston Legal"
            }

            knowledgeSetDataKingstanLegalWithKingstanCompany = {
                knowledgeSetTitle: "KnowledgeSetkingstanLegalWithKingstan" + randomStr,
                knowledgeSetDesc: "KnowledgedescriptionKingstanCompany" + randomStr,
                company: 'Kingston',
                lineOfBusiness: "Kingston Legal"
            }

            articleData = {
                "knowledgeSet": knowledgeSetDataFinance.knowledgeSetTitle,
                "title": "knowledgeArticle" + randomStr,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Phyto",
                "assigneeBusinessUnit": "Finance Back Office",
                "assigneeSupportGroup": "Finance Back Support",
                "assignee": "jstuart",
            }
            //Creating an Article Template from API
             knowledgeArticleTemplateData = {
                templateName: "KnowledgetemplateName" + randomStr,
                sectionTitle: "articleSection",
                lineOfBusiness: "Kingston Legal"

            }

            await apiHelper.apiLogin('jbarnes');
            await apiHelper.createKnowledgeArticleTemplate(knowledgeArticleTemplateData);
            await apiHelper.apiLogin(kingstoneUserName, password);
            await apiHelper.createKnowledgeSet(knowledgeSetDataKingstan);
            await apiHelper.apiLogin(oracleUserName, password);
            await apiHelper.createKnowledgeSet(knowledgeSetDataOracle);
            await apiHelper.apiLogin(kingstonAndOracleUserName, password);
            await apiHelper.createKnowledgeSet(knowledgeSetDataFinance);
            knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
            await apiHelper.apiLogin(kingstonLegalUserName, password);
            await apiHelper.createKnowledgeSet(knowledgeSetDataKingstanLegal);
            await apiHelper.createKnowledgeSet(knowledgeSetDataKingstanLegalWithKingstanCompany);
            await apiHelper.createKnowledgeArticleTemplate(knowledgeArticleTemplateData);
        });
        it('[DRDMV-23678,DRDMV-23683,DRDMV-23762,DRDMV-23746]: [Service Provider Model] [Knowledge] Verify the Knowledge Article Creation with respect to Line of Business when user has access to single Line of Business', async () => {
            await navigationPage.gotoCreateKnowledge();
            expect(await createKnowledgePage.isTemplatePresent(knowledgeArticleTemplateData.templateName)).toBeFalsy();
            await createKnowledgePage.clickOnTemplate('Reference');
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            expect(await createKnowledgePage.getValueOfLineOFBusiness()).toBe('Kingston HR');
            expect(await createKnowledgePage.isLineOfBusinessDisable()).toBeTruthy();
            await createKnowledgePage.addTextInKnowlegeTitleField('Knowledge' + randomStr);
            await createKnowledgePage.setReferenceValue('KnowledgeReference' + randomStr);
            expect(await createKnowledgePage.isValuePresentInDropdown('Knowledge Set', knowledgeSetDataOracle.knowledgeSetTitle)).toBeFalsy('Failure: knowledgeSetDataOracle is visible');
            expect(await createKnowledgePage.isValuePresentInDropdown('Knowledge Set', knowledgeSetDataFinance.knowledgeSetTitle)).toBeFalsy('Failure: knowledgeSetDataFinance is visible');
            expect(await createKnowledgePage.isValuePresentInDropdown('Knowledge Set', knowledgeSetDataKingstanLegalWithKingstanCompany.knowledgeSetTitle)).toBeFalsy('Failure: knowledgeSetDataFinance is visible');
            await createKnowledgePage.selectKnowledgeSet(knowledgeSetDataKingstan.knowledgeSetTitle);
            await createKnowledgePage.selectCategoryTier1Option('Applications');
            await createKnowledgePage.selectCategoryTier2Option('Social');
            await createKnowledgePage.selectCategoryTier3Option('Chatter');
            await createKnowledgePage.clickAssignToMeButton();
            await createKnowledgePage.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.getCompanyDefaultValue()).toBe('Phyto');
            expect(await changeAssignmentBladePo.getSupportGroupDefaultValue()).toBe('Kingston AskHR');
            await changeAssignmentBladePo.clickOnCancelButton();
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            knowledgeKingstanID = await previewKnowledgePo.getKnowledgeArticleID();
            expect(await previewKnowledgePo.getKnowledgeArticleTitle()).toContain('Knowledge' + randomStr, 'title not correct');
            expect(await previewKnowledgePo.getKnowledgeArticleSection()).toContain('KnowledgeReference' + randomStr, 'section not correct');
            await previewKnowledgePo.clickGoToArticleButton();
        });
        it('[DRDMV-23678,DRDMV-23683,DRDMV-23762,DRDMV-23746]: [Service Provider Model] [Knowledge] Verify the Knowledge Article Creation with respect to Line of Business when user has access to single Line of Business', async () => {
            expect(await viewKnowledgeArticlePo.getCategoryTier1Value()).toBe('Applications');
            expect(await viewKnowledgeArticlePo.getCategoryTier2Value()).toBe('Social');
            expect(await viewKnowledgeArticlePo.getCategoryTier3Value()).toBe('Chatter');
            await viewKnowledgeArticlePo.isEditLinkDisplayedOnKA
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            await editKnowledgePo.clickChangeAssignmentButton();
            await changeAssignmentBladePo.selectCompany('Phyto');
            await changeAssignmentBladePo.selectBusinessUnit('Kingston HR');
            await changeAssignmentBladePo.selectSupportGroup('Kingston AskHR');
            await changeAssignmentBladePo.selectAssignee('Jack Torrance');
            await changeAssignmentBladePo.clickOnAssignButton();
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            await editKnowledgePo.setCategoryTier1('Employee Relations');
            await editKnowledgePo.setCategoryTier2('Compensation');
            await editKnowledgePo.saveKnowledgeMedataDataChanges();
            expect(await viewKnowledgeArticlePo.getCategoryTier1Value()).toBe('Employee Relations');
            expect(await viewKnowledgeArticlePo.getCategoryTier2Value()).toBe('Compensation');
            await editKnowledgePo.setKnowledgeStatus('Draft');
            await statusBladeKnowledgeArticlePo.setKnowledgeStatusWithReviewerDetails('SME Review', 'Phyto', 'Kingston HR', 'Kingston AskHR', 'David Kramer')
            expect(await editKnowledgePo.getStatusValue()).toContain('SME Review', 'Status not Set');
            await navigationPage.gotoKnowledgeConsole();
            await utilityGrid.clearFilter();
            expect(await utilityGrid.isGridRecordPresent(knowledgeArticleData.displayId)).toBeFalsy();
        });
        it('[DRDMV-23678,DRDMV-23683,DRDMV-23762,DRDMV-23746]: [Service Provider Model] [Knowledge] Verify the Knowledge Article Creation with respect to Line of Business when user has access to single Line of Business', async () => {
            await navigationPage.signOut();
            await loginPage.login(oracleUserName, password);
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate('Reference');
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            expect(await createKnowledgePage.getValueOfLineOFBusiness()).toBe('Oracle HR');
            await createKnowledgePage.addTextInKnowlegeTitleField('KnowledgeOracle' + randomStr);
            await createKnowledgePage.setReferenceValue('KnowledgeOracle' + randomStr);
            await createKnowledgePage.selectKnowledgeSet(knowledgeSetDataOracle.knowledgeSetTitle);
            await createKnowledgePage.clickAssignToMeButton();
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            knowledgeOrcleID = await previewKnowledgePo.getKnowledgeArticleID();
            await previewKnowledgePo.clickGoToArticleButton();
            await navigationPage.gotoKnowledgeConsole();
            await utilityGrid.clearFilter();
            expect(await utilityGrid.isGridRecordPresent(knowledgeKingstanID)).toBeFalsy();
            expect(await utilityGrid.isGridRecordPresent(knowledgeArticleData.displayId)).toBeFalsy();
            expect(await utilityGrid.isGridRecordPresent(knowledgeOrcleID)).toBeTruthy();
        });
        it('[DRDMV-23678,DRDMV-23683,DRDMV-23762,DRDMV-23746]: [Service Provider Model] [Knowledge] Verify the Knowledge Article Creation with respect to Line of Business when user has access to single Line of Business', async () => {
            await navigationPage.signOut();
            await loginPage.login(kingstonAndOracleUserName, password);
            await navigationPage.gotoKnowledgeConsole();
            await utilityGrid.selectLineOfBusiness('Kingston HR');
            await utilityGrid.clearFilter();
            expect(await utilityGrid.isGridRecordPresent(knowledgeKingstanID)).toBeTruthy();
            await utilityGrid.selectLineOfBusiness('Oracle HR');
            await utilityGrid.clearFilter();
            expect(await utilityGrid.isGridRecordPresent(knowledgeOrcleID)).toBeTruthy();
            await utilityGrid.selectLineOfBusiness('KingstonOracle Finance');
            await utilityGrid.clearFilter();
            expect(await utilityGrid.isGridRecordPresent(knowledgeArticleData.displayId)).toBeTruthy();
            expect(await utilityGrid.isGridRecordPresent(knowledgeOrcleID)).toBeFalsy();
            expect(await utilityGrid.isGridRecordPresent(knowledgeKingstanID)).toBeFalsy();
        });

        it('[DRDMV-23678,DRDMV-23683,DRDMV-23762,DRDMV-23746]: [Service Provider Model] [Knowledge] Verify the Knowledge Article Creation with respect to Line of Business when user has access to single Line of Business', async () => {
            await navigationPage.signOut();
            await loginPage.login(kingstonLegalUserName, password);
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate(knowledgeArticleTemplateData.templateName);
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            expect(await createKnowledgePage.getValueOfLineOFBusiness()).toBe('Kingston HR');
            expect(await createKnowledgePage.isLineOfBusinessDisable()).toBeTruthy();
            await createKnowledgePage.addTextInKnowlegeTitleField('Knowledge Kingstan Legal' + randomStr);
            await createKnowledgePage.setReferenceValue('KnowledgeReference' + randomStr);
            expect(await createKnowledgePage.isValuePresentInDropdown('Knowledge Set', knowledgeSetDataOracle.knowledgeSetTitle)).toBeFalsy('Failure: knowledgeSetDataOracle is visible');
            expect(await createKnowledgePage.isValuePresentInDropdown('Knowledge Set', knowledgeSetDataFinance.knowledgeSetTitle)).toBeFalsy('Failure: knowledgeSetDataFinance is visible');
            expect(await createKnowledgePage.isValuePresentInDropdown('Knowledge Set', knowledgeSetDataKingstan.knowledgeSetTitle)).toBeFalsy('Failure: knowledgeSetDatakingstan is visible');
            expect(await createKnowledgePage.isValuePresentInDropdown('Knowledge Set', knowledgeSetDataKingstanLegalWithKingstanCompany.knowledgeSetTitle)).toBeTruthy('Failure: knowledgeSetDatakingstan is visible');
            await createKnowledgePage.selectKnowledgeSet(knowledgeSetDataKingstanLegal.knowledgeSetTitle);
            await createKnowledgePage.clickAssignToMeButton();
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            knowledgeKingstanLegalID = await previewKnowledgePo.getKnowledgeArticleID();
            await navigationPage.gotoKnowledgeConsole();
            expect(await utilityGrid.isGridRecordPresent(knowledgeKingstanLegalID)).toBeTruthy();
            expect(await utilityGrid.isGridRecordPresent(knowledgeArticleData.displayId)).toBeFalsy();
            expect(await utilityGrid.isGridRecordPresent(knowledgeOrcleID)).toBeFalsy();
            expect(await utilityGrid.isGridRecordPresent(knowledgeKingstanID)).toBeFalsy();
        });
        it('[DRDMV-23678,DRDMV-23683,DRDMV-23762,DRDMV-23746]: [Service Provider Model] [Knowledge] Verify the Knowledge Article Creation with respect to Line of Business when user has access to single Line of Business', async () => {
            await navigationPage.signOut();
            await loginPage.login(kingstoneUserName, password);
            await navigationPage.gotoKnowledgeConsole();
            expect(await utilityGrid.isGridRecordPresent(knowledgeKingstanLegalID)).toBeFalsy();
            await navigationPage.signOut();
            await loginPage.login(oracleUserName, password);
            await navigationPage.gotoKnowledgeConsole();
            expect(await utilityGrid.isGridRecordPresent(knowledgeKingstanLegalID)).toBeFalsy();

            await loginPage.login(kingstonAndOracleUserName, password);
            await navigationPage.gotoKnowledgeConsole();
            expect(await utilityGrid.isGridRecordPresent(knowledgeKingstanLegalID)).toBeFalsy();
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login(kingstoneUserName, password);
        });
    });
})
