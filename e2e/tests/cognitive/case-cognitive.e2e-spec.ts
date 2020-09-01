import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import viewCasePo from '../../pageobject/case/view-case.po';
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import createCasePo from '../../pageobject/case/create-case.po';
import caseTemplatePreview from '../../pageobject/settings/case-management/preview-case-template.po';
import casePreviewPo from '../../pageobject/case/case-preview.po';

describe('Case Cognitive', () => {
    const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
    let categName1 = 'DemoCateg1';
    let categName2 = 'DemoCateg2';
    let categName3 = 'DemoCateg3';
    let categName4 = 'DemoCateg4';
    let categoryDataSetMapping, templateDataSetMapping;
    let apiKey = "HnmJ6tOYmUheiH7hLbQdW6HHvIhUFYCq6NVo5acPY4Ww";
    let templateDataSet = "My Template Data Set";
    let categoryDataSet = "My Category Data Set";
    let caseTemplateResponse1,caseTemplateResponse2,caseTemplateResponse3,caseTemplateResponse4,caseTemplateResponse5;
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
        await apiHelper.apiLogin('tadmin');
        await createCategoryAssociation();
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteCognitiveDataSetMapping();
        await apiHelper.deleteCognitiveDataSet();
        await navigationPage.signOut();
    });

    async function createCategoryAssociation() {
        categName1 = 'DemoCateg1';
        categName2 = 'DemoCateg2';
        categName3 = 'DemoCateg3';
        categName4 = 'DemoCateg4';
        await apiHelper.createOperationalCategory(categName1);
        await apiHelper.createOperationalCategory(categName2);
        await apiHelper.createOperationalCategory(categName3);
        await apiHelper.createOperationalCategory(categName4);
        await apiHelper.associateCategoryToOrganization(categName1, 'Petramco');
        await apiHelper.associateCategoryToCategory(categName1, categName2);
        await apiHelper.associateCategoryToCategory(categName2, categName3);
        await apiHelper.associateCategoryToCategory(categName3, categName4);
    }

    async function createCognitiveConfig() {
        let created = await apiHelper.addWatsonAccount(apiKey);
        console.log("Watson Account Added ==> ", created);
        let dataSetMappingDeleted = await apiHelper.deleteCognitiveDataSetMapping();
        console.log("All DataSet Mapping Deleted ==> ", dataSetMappingDeleted);
        let dataSetDeleted = await apiHelper.deleteCognitiveDataSet();
        console.log("All DataSet Deleted ==> ", dataSetDeleted);
        let templateDataSetCreated = await apiHelper.createCognitiveDataSet("template", { name: templateDataSet });
        console.log("Template DataSet Created ==> ", templateDataSetCreated);
        let categoryDataSetCreated = await apiHelper.createCognitiveDataSet("category", { name: categoryDataSet });
        console.log("Category DataSet Created ==> ", categoryDataSetCreated);
    }

    async function trainCognitiveDataSet1() {   
        let templateDataSetTrained = await apiHelper.trainCognitiveDataSet(templateDataSet);
        console.log("Template DataSet Created ==> ", templateDataSetTrained);
    }    
    async function trainCognitiveDataSet2() {   
        let categoryDataSetTrained = await apiHelper.trainCognitiveDataSet(categoryDataSet);
        console.log("Category DataSet Created ==> ", categoryDataSetTrained);
    } 

    async function createCognitiveDataSetMapping() {   
        templateDataSetMapping = {
            name: "Petramco Template Dataset Mapping",
            company: "Petramco",
            enable: true,
            dataset: templateDataSet,
            confidenceLevelAutomatic: 60,
            confidenceLevelAgent: 70
        }
        let templateDataSetMappingStatus = await apiHelper.createCognitiveDataSetMapping("template", templateDataSetMapping);
        console.log("Template DataSet Mapping Created ==> ", templateDataSetMappingStatus);
        categoryDataSetMapping = {
            name: "Petramco Category Dataset Mapping",
            company: "Petramco",
            dataset: categoryDataSet,
            enable: false,
            confidenceLevelAutomatic: 90,
            confidenceLevelAgent: 80
        }
        let categoryDataSetMappingStatus = await apiHelper.createCognitiveDataSetMapping("category", categoryDataSetMapping);
        console.log("Category DataSet Mapping Created ==> ", categoryDataSetMappingStatus);
    }

    async function createCognitiveSearchData() {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await apiHelper.apiLogin('qkatawazi');
        let caseTemplateData = {
            "templateName": 'caseTemplateForCognitive1' + randomStr,
            "templateSummary": 'cognitive search',
            "categoryTier1": categName1,
            "categoryTier2": "",
            "categoryTier3": "",
            "categoryTier4": "",
            "casePriority": "Critical",
            "templateStatus": "Active",
            "company": "Petramco",
            "businessUnit": "United States Support",
            "supportGroup": "US Support 3",
            "assignee": "qkatawazi",
            "ownerBU": "United States Support",
            "ownerGroup": "US Support 3"
        }
        caseTemplateResponse1 = await apiHelper.createCaseTemplate(caseTemplateData);
        caseTemplateData.templateName = 'caseTemplateForCognitive3' + randomStr;
        caseTemplateData.categoryTier1 = categName1;
        caseTemplateData.categoryTier2 = categName2;
        caseTemplateResponse2 = await apiHelper.createCaseTemplate(caseTemplateData);
        caseTemplateData.templateName = 'caseTemplateForCognitive2' + randomStr;
        caseTemplateData.categoryTier1 = categName1;
        caseTemplateData.categoryTier2 = categName2;
        caseTemplateData.categoryTier3 = categName3;
        caseTemplateResponse3 = await apiHelper.createCaseTemplate(caseTemplateData);
        caseTemplateData.templateName = 'caseTemplateForCognitive4' + randomStr;
        caseTemplateData.categoryTier1 = categName1;
        caseTemplateData.categoryTier2 = categName2;
        caseTemplateData.categoryTier3 = categName3;
        caseTemplateData.categoryTier4 = categName4;
        caseTemplateResponse4 = await apiHelper.createCaseTemplate(caseTemplateData);
        caseTemplateData.templateName = 'caseTemplateForCognitive5' + randomStr;
        caseTemplateResponse5 = await apiHelper.createCaseTemplate(caseTemplateData);
        caseTemplateData.templateName = 'caseTemplateForCognitive6' + randomStr;
        await apiHelper.createCaseTemplate(caseTemplateData);
        caseTemplateData.templateName = 'caseTemplateForCognitive7' + randomStr;
        await apiHelper.createCaseTemplate(caseTemplateData);
        caseTemplateData.templateName = 'caseTemplateForCognitive8' + randomStr;
        await apiHelper.createCaseTemplate(caseTemplateData);
        caseTemplateData.templateName = 'caseTemplateForCognitive9' + randomStr;
        await apiHelper.createCaseTemplate(caseTemplateData);
        caseTemplateData.templateName = 'caseTemplateForCognitive10' + randomStr;
        await apiHelper.createCaseTemplate(caseTemplateData);
        caseTemplateData.templateName = 'caseTemplateForCognitive11' + randomStr;
        await apiHelper.createCaseTemplate(caseTemplateData);
    }

    async function createCaseData(){
        let caseData = {
            "Requester": "apavlik",
            "Summary": "SearchCateg4",
            "Origin": "Agent",
            "Case Template ID": caseTemplateResponse1.id
        }
        await apiHelper.createCase(caseData);
        caseData.Summary = "SearchCateg3";
        caseData["Case Template ID"] = caseTemplateResponse2.id;
        await apiHelper.createCase(caseData);
        caseData.Summary = "SearchCateg2";
        caseData["Case Template ID"] = caseTemplateResponse3.id;
        await apiHelper.createCase(caseData);
        caseData.Summary = "SearchCateg1";
        caseData["Case Template ID"] = caseTemplateResponse4.id;
        await apiHelper.createCase(caseData);
        caseData["Case Template ID"] = caseTemplateResponse5.id;
        await apiHelper.createCase(caseData);
        caseData["Case Template ID"] = caseTemplateResponse5.id;
        await apiHelper.createCase(caseData);
    }

    describe('[DRDMV-9023,DRDMV-8981]:[Case Workspace] Cases search using filters', async () => {
        beforeAll(async () => {
            await createCognitiveSearchData();
        });   
        it('[DRDMV-9023,DRDMV-8981]:Cognitive Config Creation', async () => {
            await createCaseData();
        });
        it('[DRDMV-9023,DRDMV-8981]:Cognitive Config Creation', async () => {
            await createCognitiveConfig();
        });
        it('[DRDMV-9023,DRDMV-8981]:Cognitive Config Creation', async () => {
            await trainCognitiveDataSet1();
        });
        it('[DRDMV-9023,DRDMV-8981]:Cognitive Config Creation', async () => {
            await trainCognitiveDataSet2();
        });
        it('[DRDMV-9023,DRDMV-8981]:Cognitive Config Creation', async () => {
            await createCognitiveDataSetMapping();
        });
        it('[DRDMV-9023,DRDMV-8981]:[Case Workspace] Cases search using filters', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('adam');
            await createCasePo.setSummary(randomStr + 'randomCaseSummary');
            await createCasePo.clickOnAutoCategorize();
            expect(await utilityCommon.isPopUpMessagePresent('Cognitive mapping is not configured.')).toBeTruthy();
        });
        it('[DRDMV-9023,DRDMV-8981]:[Case Workspace] Cases search using filters', async () => { 
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteCognitiveDataSetMapping();
            categoryDataSetMapping.enable = true;
            await apiHelper.createCognitiveDataSetMapping("category", categoryDataSetMapping);
            await apiHelper.createCognitiveDataSetMapping("template", templateDataSetMapping);
        });
        it('[DRDMV-9023,DRDMV-8981]:[Case Workspace] Cases search using filters', async () => {   
            await createCasePo.clearSummary();
            await createCasePo.setSummary(randomStr + 'randomCaseSummary');
            await createCasePo.clickOnAutoCategorize();
            expect(await utilityCommon.isPopUpMessagePresent('No results found for categories.')).toBeTruthy();
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[DRDMV-8937,DRDMV-8935,DRDMV-8938]:[Create Case] [Predict Template] - Recommended Template and All template selection behavior', async () => {
        it('[DRDMV-8937,DRDMV-8935,DRDMV-8938]:[Create Case] [Predict Template] - Recommended Template and All template selection behavior', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('adam');
            await createCasePo.setSummary('cognitive search');
            await createCasePo.clickSelectCaseTemplateButton();
            expect(await selectCasetemplateBladePo.isCaseSummaryPresentInRecommendedTemplates('cognitive search')).toBeTruthy('Template seach is not working');
            expect(await selectCasetemplateBladePo.isApplyButtonEnabled()).toBeFalsy("Apply button is Enabled");
            expect(await selectCasetemplateBladePo.isPaginationPresent()).toBeTruthy("Pagination is present");
            expect(await selectCasetemplateBladePo.getCountOfTemplates()).toBe(5);
            await selectCasetemplateBladePo.selectFirstRecommendedTemplate();
            expect(await selectCasetemplateBladePo.isApplyButtonEnabled()).toBeTruthy("Apply button is Enabled");
            await selectCasetemplateBladePo.selectFirstRecommendedTemplate();
            await selectCasetemplateBladePo.clickPaginationNext();
            expect(await selectCasetemplateBladePo.isApplyButtonEnabled()).toBeFalsy("Apply button is Enabled");
            await selectCasetemplateBladePo.selectFirstRecommendedTemplate();
            expect(await selectCasetemplateBladePo.isApplyButtonEnabled()).toBeTruthy("Apply button is Enabled");
            await selectCasetemplateBladePo.clickOnFirstRecommendedArrow();
            await browser.sleep(1000);
            expect(await caseTemplatePreview.getCaseSummary()).toBe('cognitive search');
            expect(await caseTemplatePreview.getCaseTemplateName()).toContain('caseTemplateForCognitive');
            expect(await caseTemplatePreview.getCaseCompanyValue()).toBe('Petramco');
            expect(await caseTemplatePreview.getCasePriority()).toBe('Critical');
            expect(await caseTemplatePreview.isCaseSummaryHeaderDisplayed('Case Summary')).toBeTruthy('Case Summary is not getting displayed');
            expect(await caseTemplatePreview.isCaseCompanyTitleDisplayed('Case Company')).toBeTruthy('Case Company is not getting displayed');
            expect(await caseTemplatePreview.isCaseStatusTitleDisplayed('Case Status')).toBeTruthy('Case Status is not getting displayed');
            expect(await caseTemplatePreview.isCasePriorityTitleDisplayed('Case Priority')).toBeTruthy('Case Priority is not getting displayed');
            expect(await caseTemplatePreview.isCaseCategoryTier1TitleDisplayed('Case Category Tier 1')).toBeTruthy('Case Category Tier 1 is not getting displayed');
            expect(await caseTemplatePreview.isCaseCategoryTier2TitleDisplayed('Case Category Tier 2')).toBeTruthy('Case Category Tier 2 is not getting displayed');
            expect(await caseTemplatePreview.isCaseCategoryTier3TitleDisplayed('Case Category Tier 3')).toBeTruthy('Case Category Tier 3 is not getting displayed');
            expect(await caseTemplatePreview.isCaseCategoryTier4TitleDisplayed('Case Category Tier 4')).toBeTruthy('Case Category Tier 4 is not getting displayed');
            expect(await caseTemplatePreview.isFlowsetTitleDisplayed('Flowset')).toBeTruthy('Flowset is not getting displayed');
            expect(await caseTemplatePreview.isLabelTitleDisplayed('Label')).toBeTruthy('Label is not getting displayed');
            expect(await caseTemplatePreview.isCaseDescriptionTitleDisplayed('Case Description')).toBeTruthy('Case Description is not getting displayed');
            expect(await caseTemplatePreview.isSupportCompanyTitleDisplayed('Support Company')).toBeTruthy('Support Company is not getting displayed');
            expect(await caseTemplatePreview.isSupportGroupTitleDisplayed('Support Group')).toBeTruthy('Support Group is not getting displayed');
            expect(await caseTemplatePreview.isAssigneeTitleDisplayed()).toBeTruthy('Assignee is not getting displayed');
            await caseTemplatePreview.clickOnBackButton();
            await selectCasetemplateBladePo.clickRecommendedCancelBtn();
        });
        it('[DRDMV-8937,DRDMV-8935,DRDMV-8938]:[Create Case] [Predict Template] - Recommended Template and All template selection behavior', async () => {
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectFirstRecommendedTemplate();
            await selectCasetemplateBladePo.clickRecommendedApplyBtn();
            await createCasePo.clickAssignToMeButton();
            await createCasePo.clickSaveCaseButton();
            await casePreviewPo.clickGoToCaseButton();
            expect(await viewCasePo.getPriorityValue()).toBe('Critical');
            expect(await viewCasePo.getCategoryTier1Value()).toBe(categName1);
            expect(await viewCasePo.getAssignedCompanyText()).toBe('Petramco');
            expect(await viewCasePo.getCaseSummary()).toBe('cognitive search');
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    it('[DRDMV-8980]:[Cognitive] - Auto Categorization button validation on Case Create screen', async () => {
        await navigationPage.gotoCreateCase();
        expect(await createCasePo.isAutoCategorizeButtonEnabled()).toBeFalsy("Button is Enabled");
        await createCasePo.selectRequester('adam');
        expect(await createCasePo.isAutoCategorizeButtonEnabled()).toBeFalsy("Button is Enabled");
        await createCasePo.setSummary('cognitive search');
        expect(await createCasePo.isAutoCategorizeButtonEnabled()).toBeTruthy("Button is Disable");
        await createCasePo.clickSelectCaseTemplateButton();
        await selectCasetemplateBladePo.selectFirstRecommendedTemplate();
        await selectCasetemplateBladePo.clickRecommendedApplyBtn();
        expect(await createCasePo.isAutoCategorizeButtonEnabled()).toBeFalsy("Button is Enabled");
        await createCasePo.clickClearTemplateButton();
        expect(await createCasePo.isAutoCategorizeButtonEnabled()).toBeTruthy("Button is Disable");
    });
});