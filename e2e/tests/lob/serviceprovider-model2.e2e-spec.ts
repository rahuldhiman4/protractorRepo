import { cloneDeep } from 'lodash';
import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import { flowsetGlobalFields, flowsetMandatoryFields } from '../../data/ui/flowset/flowset.ui';
import casePreviewPo from '../../pageobject/case/case-preview.po';
import editCasePo from '../../pageobject/case/edit-case.po';
import quickCasePo from '../../pageobject/case/quick-case.po';
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import viewCasePo from '../../pageobject/case/view-case.po';
import changeAssignmentOldBladePo from '../../pageobject/common/change-assignment-old-blade.po';
import changeAssignmentBladePo from '../../pageobject/common/change-assignment.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import createKnowledgePage from "../../pageobject/knowledge/create-knowlege.po";
import editKnowledgePo from '../../pageobject/knowledge/edit-knowledge.po';
import previewKnowledgePo from '../../pageobject/knowledge/preview-knowledge.po';
import statusBladeKnowledgeArticlePo from '../../pageobject/knowledge/status-blade-knowledge-article.po';
import viewKnowledgeArticlePo from '../../pageobject/knowledge/view-knowledge-article.po';
import consoleCasetemplatePo from '../../pageobject/settings/case-management/console-casetemplate.po';
import createCasetemplatePo from '../../pageobject/settings/case-management/create-casetemplate.po';
import editCasetemplatePo from '../../pageobject/settings/case-management/edit-casetemplate.po';
import previewCaseTemplateCasesPo from '../../pageobject/settings/case-management/preview-case-template.po';
import viewCasetemplatePo from '../../pageobject/settings/case-management/view-casetemplate.po';
import statusConfigPo from '../../pageobject/settings/common/status-config.po';
import { BWF_BASE_URL, BWF_PAGE_TITLES } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

xdescribe('Service Provider Model Tests Extended', () => {
    let kingstoneUserName = 'smoran';
    let oracleUserName = 'umiguelde';
    let kingstonAndOracleUserName = 'jstuart';
    let kingstonLegalUserName = 'yhenny';

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login(kingstoneUserName);
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //ankagraw
    describe('[12035,12031,12018,12022]: [Service Provider Model] [Knowledge] Verify the Knowledge Article Creation with respect to Line of Business when user has access to single Line of Business', () => {
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
                "lineOfBusiness": "KingstonOracle Finance",
            }
            //Creating an Article Template from API
            knowledgeArticleTemplateData = {
                templateName: "KnowledgetemplateName" + randomStr,
                sectionTitle: "articleSection",
                lineOfBusiness: "Kingston Legal",
                knowledgeSetTitle: knowledgeSetDataKingstanLegal.knowledgeSetTitle,
            }

            await apiHelper.apiLogin(kingstoneUserName);
            await apiHelper.createKnowledgeArticleTemplate(knowledgeArticleTemplateData);
            await apiHelper.apiLogin(kingstoneUserName);
            await apiHelper.createKnowledgeSet(knowledgeSetDataKingstan);
            await apiHelper.apiLogin(oracleUserName);
            await apiHelper.createKnowledgeSet(knowledgeSetDataOracle);
            await apiHelper.apiLogin(kingstonAndOracleUserName);
            await apiHelper.createKnowledgeSet(knowledgeSetDataFinance);
            knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
            await apiHelper.apiLogin(kingstonLegalUserName);
            await apiHelper.createKnowledgeSet(knowledgeSetDataKingstanLegal);
            await apiHelper.createKnowledgeSet(knowledgeSetDataKingstanLegalWithKingstanCompany);
            await apiHelper.createKnowledgeArticleTemplate(knowledgeArticleTemplateData);
        });
        it('[12035,12031,12018,12022]: [Service Provider Model] [Knowledge] Verify the Knowledge Article Creation with respect to Line of Business when user has access to single Line of Business', async () => {
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
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            knowledgeKingstanID = await previewKnowledgePo.getKnowledgeArticleID();
            expect(await previewKnowledgePo.getKnowledgeArticleTitle()).toContain('Knowledge' + randomStr, 'title not correct');
            expect(await previewKnowledgePo.getKnowledgeArticleSection()).toContain('KnowledgeReference' + randomStr, 'section not correct');
            await previewKnowledgePo.clickGoToArticleButton();
        });
        it('[12035,12031,12018,12022]: [Service Provider Model] [Knowledge] Verify the Knowledge Article Creation with respect to Line of Business when user has access to single Line of Business', async () => {
            expect(await viewKnowledgeArticlePo.getCategoryTier1Value()).toBe('Applications');
            expect(await viewKnowledgeArticlePo.getCategoryTier2Value()).toBe('Social');
            expect(await viewKnowledgeArticlePo.getCategoryTier3Value()).toBe('Chatter');
            await viewKnowledgeArticlePo.isEditLinkDisplayedOnKA
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            await editKnowledgePo.clickChangeAssignmentButton();
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'Kingston AskHR');
            await changeAssignmentBladePo.setDropDownValue('Assignee', 'Jack Torrance');
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
        it('[12035,12031,12018,12022]: [Service Provider Model] [Knowledge] Verify the Knowledge Article Creation with respect to Line of Business when user has access to single Line of Business', async () => {
            await navigationPage.signOut();
            await loginPage.login(oracleUserName);
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
        it('[12035,12031,12018,12022]: [Service Provider Model] [Knowledge] Verify the Knowledge Article Creation with respect to Line of Business when user has access to single Line of Business', async () => {
            await navigationPage.signOut();
            await loginPage.login(kingstonAndOracleUserName);
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

        it('[12035,12031,12018,12022]: [Service Provider Model] [Knowledge] Verify the Knowledge Article Creation with respect to Line of Business when user has access to single Line of Business', async () => {
            await navigationPage.signOut();
            await loginPage.login(kingstonLegalUserName);
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
        it('[12035,12031,12018,12022]: [Service Provider Model] [Knowledge] Verify the Knowledge Article Creation with respect to Line of Business when user has access to single Line of Business', async () => {
            await navigationPage.signOut();
            await loginPage.login(kingstoneUserName);
            await navigationPage.gotoKnowledgeConsole();
            expect(await utilityGrid.isGridRecordPresent(knowledgeKingstanLegalID)).toBeFalsy();
            await navigationPage.signOut();
            await loginPage.login(oracleUserName);
            await navigationPage.gotoKnowledgeConsole();
            expect(await utilityGrid.isGridRecordPresent(knowledgeKingstanLegalID)).toBeFalsy();

            await loginPage.login(kingstonAndOracleUserName);
            await navigationPage.gotoKnowledgeConsole();
            expect(await utilityGrid.isGridRecordPresent(knowledgeKingstanLegalID)).toBeFalsy();
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login(kingstoneUserName);
        });
    });

    //ankagraw
    describe('[12037,12023,12019]: [Service Provider Model][Quick Case]: Verify the behavior when the case agent from service provider company is able to create a case for requester company', () => {
        let response1, response2, response3, caseDataKingston, caseDataOracle, caseDataGlobal, templateDataPhytoCompany, newCaseTemplateKingston, newCaseTemplateOracle, newCaseTemplateGlobal, templateDataGlobalCompany, templateDataKingstanCompany, templateDataOracleCompany, newCaseTemplatePhyto, randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseId, response11, response21, response31, caseDataKingston1, caseDataOracle1, caseDataGlobal1, newCaseTemplatePhyto1, templateDataPhytoCompany1, newCaseTemplateKingston1, newCaseTemplateOracle1, newCaseTemplateGlobal1, templateDataGlobalCompany1, templateDataKingstanCompany1, templateDataOracleCompany1;
        beforeAll(async () => {
            templateDataPhytoCompany = {
                "templateName": randomStr + "CaseTemplateDRDMV23674",
                "templateSummary": randomStr + "SummaryDRDMV23674",
                "templateStatus": 'Active',
                "company": 'Phyto',
                "businessUnit": "Kingston HR",
                "supportGroup": "Kingston AskHR",
                "assignee": "smoran",
                "ownerBU": 'Kingston HR',
                "ownerGroup": "Kingston AskHR",
                "lineOfBusiness": "Kingston HR"
            }
            templateDataKingstanCompany = {
                "templateName": randomStr + "CaseTemplate1DRDMV23674",
                "templateSummary": randomStr + "Summary1DRDMV23674",
                "templateStatus": 'Active',
                "company": 'Kingston',
                "businessUnit": "Kingston HR",
                "supportGroup": "Kingston AskHR",
                "assignee": "smoran",
                "ownerBU": 'Kingston HR',
                "ownerGroup": "Kingston AskHR",
                "lineOfBusiness": "Kingston HR"
            }
            templateDataOracleCompany = {
                "templateName": randomStr + "CaseTemplate2DRDMV23674",
                "templateSummary": randomStr + "Summary2DRDMV23674",
                "templateStatus": 'Active',
                "company": 'Oracle',
                "businessUnit": "Kingston HR",
                "supportGroup": "Kingston AskHR",
                "assignee": "smoran",
                "ownerBU": 'Kingston HR',
                "ownerGroup": "Kingston AskHR",
                "lineOfBusiness": "Kingston HR"
            }
            templateDataGlobalCompany = {
                "templateName": randomStr + "CaseTemplate3DRDMV23674",
                "templateSummary": randomStr + "Summary3 DRDMV23674",
                "templateStatus": 'Active',
                "company": '- Global -',
                "businessUnit": "Kingston HR",
                "supportGroup": "Kingston AskHR",
                "assignee": "smoran",
                "ownerBU": 'Kingston HR',
                "ownerGroup": "Kingston AskHR",
                "lineOfBusiness": "Kingston HR"
            }
            await apiHelper.apiLogin(kingstoneUserName);
            newCaseTemplatePhyto = await apiHelper.createCaseTemplate(templateDataPhytoCompany);
            newCaseTemplateKingston = await apiHelper.createCaseTemplate(templateDataKingstanCompany);
            newCaseTemplateOracle = await apiHelper.createCaseTemplate(templateDataOracleCompany);
            newCaseTemplateGlobal = await apiHelper.createCaseTemplate(templateDataGlobalCompany);

            caseDataKingston = {
                "Requester": "dkramer",
                "Summary": "Automated Manager Level Approval" + randomStr,
                "Case Template ID": newCaseTemplateKingston.id
            }

            caseDataOracle = {
                "Requester": "dkramer",
                "Summary": "Automated Manager Level Approval" + randomStr,
                "Case Template ID": newCaseTemplateOracle.id
            }

            caseDataGlobal = {
                "Requester": "dkramer",
                "Summary": "Automated Manager Level Approval" + randomStr,
                "Case Template ID": newCaseTemplateGlobal.id
            }
            await apiHelper.apiLogin(kingstoneUserName);
            response1 = await apiHelper.createCase(caseDataKingston);
            response2 = await apiHelper.createCase(caseDataOracle);
            response3 = await apiHelper.createCase(caseDataGlobal);

            templateDataPhytoCompany1 = {
                "templateName": "CaseTemplate DRDMV23674" + randomStr,
                "templateSummary": "Summary DRDMV23674" + randomStr,
                "templateStatus": 'Active',
                "company": 'Phyto',
                "businessUnit": "Oracle HR",
                "supportGroup": "Oracle AskHR",
                "assignee": "umiguelde",
                "ownerBU": 'Oracle HR',
                "ownerGroup": "Oracle AskHR",
                "lineOfBusiness": "Oracle HR"
            }
            templateDataKingstanCompany1 = {
                "templateName": "CaseTemplate1 DRDMV23674" + randomStr,
                "templateSummary": "Summary1 DRDMV23674" + randomStr,
                "templateStatus": 'Active',
                "company": 'Kingston',
                "businessUnit": "Oracle HR",
                "supportGroup": "Oracle AskHR",
                "assignee": "umiguelde",
                "ownerBU": 'Oracle HR',
                "ownerGroup": "Oracle AskHR",
                "lineOfBusiness": "Oracle HR"
            }
            templateDataOracleCompany1 = {
                "templateName": "CaseTemplate2 DRDMV23674" + randomStr,
                "templateSummary": "Summary2 DRDMV23674" + randomStr,
                "templateStatus": 'Active',
                "company": 'Oracle',
                "businessUnit": "Oracle HR",
                "supportGroup": "Oracle AskHR",
                "assignee": "umiguelde",
                "ownerBU": 'Oracle HR',
                "ownerGroup": "Oracle AskHR",
                "lineOfBusiness": "Oracle HR"
            }
            templateDataGlobalCompany1 = {
                "templateName": "CaseTemplate3 DRDMV23674 " + randomStr,
                "templateSummary": "Summary3 DRDMV23674" + randomStr,
                "templateStatus": 'Active',
                "company": '- Global -',
                "businessUnit": "Oracle HR",
                "supportGroup": "Oracle AskHR",
                "assignee": "umiguelde",
                "ownerBU": 'Oracle HR',
                "ownerGroup": "Oracle AskHR",
                "lineOfBusiness": "Oracle HR"
            }
            await apiHelper.apiLogin(oracleUserName);
            newCaseTemplatePhyto1 = await apiHelper.createCaseTemplate(templateDataPhytoCompany);
            newCaseTemplateKingston1 = await apiHelper.createCaseTemplate(templateDataKingstanCompany);
            newCaseTemplateOracle1 = await apiHelper.createCaseTemplate(templateDataOracleCompany);
            newCaseTemplateGlobal1 = await apiHelper.createCaseTemplate(templateDataGlobalCompany);

            caseDataKingston1 = {
                "Requester": "jstuart",
                "Summary": "Automated Manager Level Approval" + randomStr,
                "Origin": "Agent",
                "Case Template ID": newCaseTemplateKingston1.displayId
            }

            caseDataOracle1 = {
                "Requester": "jstuart",
                "Summary": "Automated Manager Level Approval" + randomStr,
                "Origin": "Agent",
                "Case Template ID": newCaseTemplateOracle1.displayId
            }

            caseDataGlobal1 = {
                "Requester": "jstuart",
                "Summary": "Automated Manager Level Approval" + randomStr,
                "Origin": "Agent",
                "Case Template ID": newCaseTemplateGlobal1.displayId
            }
            await apiHelper.apiLogin(oracleUserName);
            response11 = await apiHelper.createCase(caseDataKingston1);
            response21 = await apiHelper.createCase(caseDataOracle1);
            response31 = await apiHelper.createCase(caseDataGlobal1);
        });
        it('[12037,12023,12019]: [Service Provider Model][Quick Case]: Verify the behavior when the case agent from service provider company is able to create a case for requester company', async () => {
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('David Kramer');
            await quickCasePo.setCaseSummary(templateDataPhytoCompany.templateName);
            await browser.sleep(10000); // sleep added to reflect case templates
            expect(await quickCasePo.isCaseSummaryPresentInRecommendedCases(templateDataPhytoCompany.templateName)).toBeTruthy();
            await quickCasePo.isRecommendedKnowledgeEmpty();
            await quickCasePo.clickArrowFirstRecommendedCaseTemplate();
            expect(await previewCaseTemplateCasesPo.getCaseTemplateName()).toBe(templateDataPhytoCompany.templateName);
            expect(await previewCaseTemplateCasesPo.getLineOfBusinessValue()).toBe("Kingston HR");
            await previewCaseTemplateCasesPo.clickOnBackButton();

            await navigationPage.gotoCaseConsole();
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('David Kramer');
            await quickCasePo.selectCaseTemplate(templateDataPhytoCompany.templateName);
            await quickCasePo.saveCase();
            await casePreviewPo.clickGoToCaseButton();

            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('David Kramer');
            await browser.sleep(10000); // sleep added to reflect case templates
            await quickCasePo.selectCaseTemplate(newCaseTemplatePhyto.templateName);
            await quickCasePo.getRecommendedTemplateHeaderValue("Kingston HR");
            await quickCasePo.clickArrowFirstRecommendedCaseTemplate();
            expect(await previewCaseTemplateCasesPo.getCaseTemplateName()).toBe(templateDataPhytoCompany.templateName);
            expect(await previewCaseTemplateCasesPo.getLineOfBusinessValue()).toBe("Kingston HR");
            await previewCaseTemplateCasesPo.clickOnBackButton();
            await quickCasePo.saveCase();

        });
        it('[12037,12023,12019]: [Service Provider Model][Quick Case]: Verify the behavior when the case agent from service provider company is able to create a case for requester company', async () => {
            await casePreviewPo.clickGoToCaseButton();
            expect(await viewCasePo.getLineOfBusinessValue()).toBe("Kingston HR");
            await viewCasePo.clickEditCaseButton();
            expect(await editCasePo.isLineOfBusinessReadOnly()).toBeTruthy();
            await editCasePo.updateCaseCategoryTier1("Applications");
            await editCasePo.updateCaseCategoryTier2("Social");
            await editCasePo.clickOnChangeCaseTemplate();
            expect(await selectCasetemplateBladePo.isRecordPresent(templateDataKingstanCompany1.templateName)).toBeFalsy();
            expect(await selectCasetemplateBladePo.isRecordPresent(templateDataOracleCompany1.templateName)).toBeFalsy();
            expect(await selectCasetemplateBladePo.isRecordPresent(templateDataGlobalCompany1.templateName)).toBeFalsy();
            expect(await selectCasetemplateBladePo.isRecordPresent(templateDataKingstanCompany.templateName)).toBeTruthy();
            expect(await selectCasetemplateBladePo.isRecordPresent(templateDataOracleCompany.templateName)).toBeTruthy();
            expect(await selectCasetemplateBladePo.isRecordPresent(templateDataKingstanCompany1.templateName)).toBeTruthy();
            await selectCasetemplateBladePo.selectCaseTemplate(templateDataGlobalCompany.templateName);
            await editCasePo.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'Oracle AskHR')).toBeFalsy();
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'Kingston AskHR');
            expect(await changeAssignmentBladePo.isPersonAvailableOnAssignBlade('Unamuno Miguel de')).toBeTruthy('User is not present on Assignment blade');
            await changeAssignmentBladePo.setDropDownValue('Assignee', 'David Kramer');
            await changeAssignmentBladePo.clickOnAssignButton();
            await editCasePo.clickSaveCase();
            caseId = await viewCasePo.getCaseID();
            expect(await viewCasePo.getRequesterName()).toBe('David Kramer');
        });
        it('[12037,12023,12019]: [Service Provider Model][Quick Case]: Verify the behavior when the case agent from service provider company is able to create a case for requester company', async () => {
            await navigationPage.gotoCaseConsole();
            expect(await utilityGrid.isGridRecordPresent(response1.displayId)).toBeTruthy();
            expect(await utilityGrid.isGridRecordPresent(response2.displayId)).toBeTruthy();
            expect(await utilityGrid.isGridRecordPresent(response3.displayId)).toBeTruthy();
            expect(await utilityGrid.isGridRecordPresent(response11.displayId)).toBeFalsy();
            expect(await utilityGrid.isGridRecordPresent(response21.displayId)).toBeFalsy();
            expect(await utilityGrid.isGridRecordPresent(response31.displayId)).toBeFalsy();

        });
        it('[12037,12023,12019]: [Service Provider Model][Quick Case]: Verify the behavior when the case agent from service provider company is able to create a case for requester company', async () => {
            await navigationPage.signOut();
            await loginPage.login(oracleUserName);
            await navigationPage.gotoCaseConsole();
            expect(await utilityGrid.isGridRecordPresent(caseId)).toBeFalsy();
            expect(await utilityGrid.isGridRecordPresent(response1.displayId)).toBeFalsy();
            expect(await utilityGrid.isGridRecordPresent(response2.displayId)).toBeFalsy();
            expect(await utilityGrid.isGridRecordPresent(response3.displayId)).toBeFalsy();
            expect(await utilityGrid.isGridRecordPresent(response11.displayId)).toBeTruthy();
            expect(await utilityGrid.isGridRecordPresent(response21.displayId)).toBeTruthy();
            expect(await utilityGrid.isGridRecordPresent(response31.displayId)).toBeTruthy();
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login(kingstoneUserName);
        });
    });

    //ankagraw
    describe('[3942]: Flowset in existing template can be changed and other dependent fields respond correctly.', () => {
        let flowsetHumanResourceData, flowsetHumanResourceData1, flowsetHumanResourceGlobalData, flowsetFacilitiesData, randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');

            // Create Data with Human Resource LOB
            flowsetHumanResourceData = cloneDeep(flowsetMandatoryFields);
            flowsetHumanResourceData.flowsetName = flowsetHumanResourceData.flowsetName + "Human" + randomStr;
            await apiHelper.apiLogin('tadmin');
            flowsetHumanResourceData["lineOfBusiness"] = "Human Resource";
            await apiHelper.createNewFlowset(flowsetHumanResourceData);

            // Create Data with Human Resource LOB with Global Company
            flowsetHumanResourceGlobalData = cloneDeep(flowsetGlobalFields);
            flowsetHumanResourceGlobalData.flowsetName = flowsetHumanResourceGlobalData.flowsetName + "GlobalHuman" + randomStr;
            await apiHelper.apiLogin('tadmin');
            flowsetHumanResourceData["lineOfBusiness"] = "Human Resource";
            await apiHelper.createNewFlowset(flowsetHumanResourceGlobalData);

            // Create Data with Human Resource LOB
            flowsetHumanResourceData1 = cloneDeep(flowsetMandatoryFields);
            flowsetHumanResourceData1.flowsetName = flowsetHumanResourceData1.flowsetName + randomStr + "Human";
            await apiHelper.apiLogin('tadmin');
            flowsetHumanResourceData["lineOfBusiness"] = "Human Resource";
            await apiHelper.createNewFlowset(flowsetHumanResourceData1);

            //Create Data with Facilities LOB
            flowsetFacilitiesData = cloneDeep(flowsetMandatoryFields);
            flowsetFacilitiesData.flowsetName = flowsetFacilitiesData.flowsetName + "Facility" + randomStr;
            await apiHelper.apiLogin('tadmin');
            flowsetFacilitiesData["lineOfBusiness"] = "Facilities";
            await apiHelper.createNewFlowset(flowsetFacilitiesData);
        });
        it('[3942]: Flowset in existing template can be changed and other dependent fields respond correctly.', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Status Configuration', BWF_PAGE_TITLES.CASE_MANAGEMENT.STATUS_CONFIGURATION);
            await statusConfigPo.setCompanyDropdown("Petramco", 'case');
            await statusConfigPo.selectFlowset(flowsetHumanResourceData.flowsetName);
            await statusConfigPo.clickEditLifeCycleLink();
            await statusConfigPo.addCustomStatus("New", "Assigned", "customStatus");
            await statusConfigPo.clickOnBackButton();
        });
        it('[3942]: Flowset in existing template can be changed and other dependent fields respond correctly.', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
            await createCasetemplatePo.setTemplateName("CaseTemplate" + randomStr);
            await createCasetemplatePo.setCompanyName("- Global -");
            expect(await createCasetemplatePo.flowsetOptionsPresent([flowsetHumanResourceData.flowsetName])).toBeFalsy();
            await createCasetemplatePo.setCompanyName("- Global -");
            expect(await createCasetemplatePo.flowsetOptionsPresent(['Benefits', flowsetHumanResourceGlobalData.flowsetName])).toBeTruthy();
            await createCasetemplatePo.setCompanyName("Petramco");
            await createCasetemplatePo.setCategoryTier1("Applications");
            expect(await createCasetemplatePo.flowsetOptionsPresent([flowsetFacilitiesData.flowsetName])).toBeFalsy();
            await createCasetemplatePo.setCompanyName("Petramco");
            expect(await createCasetemplatePo.flowsetOptionsPresent(['Human Resources', 'Benefits', flowsetHumanResourceData.flowsetName, flowsetHumanResourceData1.flowsetName, flowsetHumanResourceGlobalData.flowsetName])).toBeTruthy();
            await createCasetemplatePo.setCompanyName("Petramco");
            await createCasetemplatePo.setFlowsetValue(flowsetHumanResourceData.flowsetName);
            await createCasetemplatePo.clickOnChangeAssignmentButton();
            await changeAssignmentOldBladePo.clickOnAssignToMeCheckBox();
            await changeAssignmentOldBladePo.clickOnAssignButton();
            await createCasetemplatePo.setCaseSummary("CaseSummary" + randomStr);
            await createCasetemplatePo.setCaseStatusValue('customStatus');
            await createCasetemplatePo.clickSaveCaseTemplate();
        });
        it('[3942]: Flowset in existing template can be changed and other dependent fields respond correctly.', async () => {
            expect(await viewCasetemplatePo.getCategoryTier1()).toBe("Applications");
            expect(await viewCasetemplatePo.getCaseStatusValue()).toBe("customStatus");
            await viewCasetemplatePo.clickOnEditCaseTemplateButton();
            await editCasetemplatePo.changePriorityValue('High');
            expect(await editCasetemplatePo.isFlowsetPresentInDropDown([flowsetFacilitiesData.flowsetName])).toBeFalsy();
            await editCasetemplatePo.changePriorityValue('Medium');
            await editCasetemplatePo.changeFlowsetValue(flowsetHumanResourceData1.flowsetName);
            await editCasetemplatePo.clickSaveCaseTemplate();
            expect(await viewCasetemplatePo.getCategoryTier1()).toBe("Applications");
            expect(await viewCasetemplatePo.getCaseStatusValue()).toBe("New");
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await utilityGrid.selectLineOfBusiness('Facilities');
        });
        it('[3942]: Flowset in existing template can be changed and other dependent fields respond correctly.', async () => {
            await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
            await createCasetemplatePo.setTemplateName("CaseTemplateFacilities" + randomStr);
            await createCasetemplatePo.setCompanyName("Petramco");
            await createCasetemplatePo.setCaseSummary("CaseSummary" + randomStr);
            await createCasetemplatePo.setCategoryTier1("Facilities");
            await createCasetemplatePo.setOwnerCompanyValue("Petramco");
            await createCasetemplatePo.setOwnerOrgDropdownValue('Facilities Support');
            await createCasetemplatePo.setOwnerGroupDropdownValue('Facilities');
            expect(await createCasetemplatePo.flowsetOptionsPresent([flowsetHumanResourceData.flowsetName, flowsetHumanResourceData1.flowsetName])).toBeFalsy();
            await createCasetemplatePo.setCompanyName("Petramco");
            await createCasetemplatePo.setFlowsetValue(flowsetFacilitiesData.flowsetName);
            await createCasetemplatePo.clickOnChangeAssignmentButton();
            await changeAssignmentOldBladePo.clickOnAssignToMeCheckBox();
            await changeAssignmentOldBladePo.clickOnAssignButton();
            expect(await createCasetemplatePo.isValuePresentInDropdown("caseStatus", "customStatus")).toBeFalsy();
            await createCasetemplatePo.clickSaveCaseTemplate();
            expect(await viewCasetemplatePo.getCategoryTier1()).toBe("Facilities");
        });
    });
});
