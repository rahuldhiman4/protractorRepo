import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import casePreviewPo from '../../pageobject/case/case-preview.po';
import createCasePo from '../../pageobject/case/create-case.po';
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import viewCasePo from '../../pageobject/case/view-case.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import caseTemplatePreview from '../../pageobject/settings/case-management/preview-case-template.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import consoleCognitivePo from './../../pageobject/settings/case-management/console-cognitive.po';
import createCognitiveCategorizationMappingPo from '../../pageobject/settings/case-management/create-cognitive-categorization-mapping.po';
import utilCommon from '../../utils/util.common';
import utilGrid from '../../utils/util.grid';
import editCognitiveCategorizationMappingPo from '../../pageobject/settings/case-management/edit-cognitive-categorization-mapping.po';
import createCognitiveTemplateMappingPo from '../../pageobject/settings/case-management/create-cognitive-template-mapping.po';
import editCognitiveTemplateMappingPo from '../../pageobject/settings/case-management/edit-cognitive-template-mapping.po';

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
    let caseTemplateResponse1, caseTemplateResponse2, caseTemplateResponse3, caseTemplateResponse4, caseTemplateResponse5;
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
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
        await apiHelper.apiLogin('tadmin');
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
        await apiHelper.apiLogin('tadmin');
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

    async function trainTemplateDataSet() {
        await apiHelper.apiLogin('tadmin');
        let templateDataSetTrained = await apiHelper.trainCognitiveDataSet(templateDataSet);
        console.log("Template DataSet Created ==> ", templateDataSetTrained);
    }

    async function trainCategoryDataSet() {
        await apiHelper.apiLogin('tadmin');
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
        await apiHelper.apiLogin('tadmin');
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

    async function createCaseData() {
        let caseData = {
            "Requester": "apavlik",
            "Summary": "SearchCateg4",
            "Origin": "Agent",
            "Case Template ID": caseTemplateResponse1.id
        }
        await apiHelper.apiLogin('qkatawazi');
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
            await trainTemplateDataSet();
        });
        it('[DRDMV-9023,DRDMV-8981]:Cognitive Config Creation', async () => {
            await trainCategoryDataSet();
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
            await navigationPage.gotoCaseConsole();
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('adam');
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

    //Created Bug - DRDMV-23210
    describe('[DRDMV-8985,DRDMV-8987]:[Cognitive] - Auto categorization when cognitive search return only tier 1, tier 1,2 and tier 1,2,3 values', async () => {
        it('[DRDMV-8985,DRDMV-8987]:[Cognitive] - Auto categorization when cognitive search return only tier 1, tier 1,2 and tier 1,2,3 values', async () => {
            await navigationPage.gotoCaseConsole();
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('adam');
            await createCasePo.setSummary('SearchCateg4');
            await createCasePo.clickOnAutoCategorize();
            expect(await createCasePo.getCategoryTier1Value()).toBe(categName1);
            expect(await createCasePo.getCategoryTier2Value()).toBe('Select');
            expect(await createCasePo.getCategoryTier3Value()).toBe('Select');
            expect(await createCasePo.getCategoryTier4Value()).toBe('Select');
            await createCasePo.setSummary('SearchCat');
            await createCasePo.clickOnAutoCategorize();
            expect(await utilityCommon.isPopUpMessagePresent('No results found for categories.')).toBeTruthy();
            expect(await createCasePo.getCategoryTier1Value()).toBe(categName1);
            expect(await createCasePo.getCategoryTier2Value()).toBe('Select');
            expect(await createCasePo.getCategoryTier3Value()).toBe('Select');
            expect(await createCasePo.getCategoryTier4Value()).toBe('Select');
            await createCasePo.clearSummary();
            await createCasePo.setSummary('SearchCateg3');
            await createCasePo.clickOnAutoCategorize();
            expect(await createCasePo.getCategoryTier1Value()).toBe(categName1);
            expect(await createCasePo.getCategoryTier2Value()).toBe(categName2);
            expect(await createCasePo.getCategoryTier3Value()).toBe('Select');
            expect(await createCasePo.getCategoryTier4Value()).toBe('Select');
        });
        it('[DRDMV-8985,DRDMV-8987]:[Cognitive] - Auto categorization when cognitive search return only tier 1, tier 1,2 and tier 1,2,3 values', async () => {
            await createCasePo.clearSummary();
            await createCasePo.setSummary('SearchCateg2');
            await createCasePo.clickOnAutoCategorize();
            expect(await createCasePo.getCategoryTier1Value()).toBe(categName1);
            expect(await createCasePo.getCategoryTier2Value()).toBe(categName2);
            expect(await createCasePo.getCategoryTier3Value()).toBe('Select');
            expect(await createCasePo.getCategoryTier4Value()).toBe('Select');
            await createCasePo.selectCategoryTier1("Facilities");
            await createCasePo.selectCategoryTier2("Conference Room");
            await createCasePo.selectCategoryTier3("Furniture");
            expect(await createCasePo.getCategoryTier1Value()).toBe("Facilities");
            expect(await createCasePo.getCategoryTier2Value()).toBe("Conference Room");
            expect(await createCasePo.getCategoryTier3Value()).toBe("Furniture");
            await createCasePo.clearSummary();
            await createCasePo.setSummary('SearchCateg1');
            await createCasePo.clickOnAutoCategorize();
            expect(await createCasePo.getCategoryTier1Value()).toBe(categName1);
            expect(await createCasePo.getCategoryTier2Value()).toBe(categName2);
            expect(await createCasePo.getCategoryTier3Value()).toBe(categName3);
            expect(await createCasePo.getCategoryTier4Value()).toBe(categName4);
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[DRDMV-8973,DRDMV-8971,DRDMV-8972,DRDMV-8977,DRDMV-8974]:[Cognitive] - Add Data Set Mapping for Categorization', async () => {
        let trainedCategoryDataSet, randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('tadmin');
            trainedCategoryDataSet = "Trained Category Data Set";
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteCognitiveDataSetMapping();
            await apiHelper.deleteCognitiveDataSet();

            // add watson account
            let apiKey = "2fVs7RMM9IuTvZyB3qD1eXnFzUR4KGJNqd5tF0XMwz4J";
            await apiHelper.addWatsonAccount(apiKey);

            // trained data set
            await apiHelper.createCognitiveDataSet("category", { name: trainedCategoryDataSet });
            await apiHelper.trainCognitiveDataSet(trainedCategoryDataSet);
        });
        it('[DRDMV-8973,DRDMV-8971,DRDMV-8972,DRDMV-8977,DRDMV-8974]:[Cognitive] - Add Data Set Mapping for Categorization', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Cognitive--Categorization', 'Categorization Configuration - Business Workflows');
            await consoleCognitivePo.clickAddDataSetMapping();
            expect(await createCognitiveCategorizationMappingPo.isMappingRequiredTextPresent()).toBeTruthy();
            expect(await createCognitiveCategorizationMappingPo.isCompanyTextPresent()).toBeTruthy();
            expect(await createCognitiveCategorizationMappingPo.isDatasetTextPresent()).toBeTruthy();
            expect(await createCognitiveCategorizationMappingPo.isEnableMappingRequiredTextPresent()).toBe("true");
            expect(await createCognitiveCategorizationMappingPo.isConfidentialsLevelOfCategorizationTextPresent()).toBeTruthy();
            expect(await createCognitiveCategorizationMappingPo.isConfidentialsLevelByAgentRequiredTextPresent()).toBeTruthy();
            expect(await createCognitiveCategorizationMappingPo.isSaveButtonDisabled()).toBe("true");
            await createCognitiveCategorizationMappingPo.setMappingName("Add Mapping" + randomStr);
            await createCognitiveCategorizationMappingPo.selectCompany("Petramco");
            await createCognitiveCategorizationMappingPo.selectDataSet("Trained Category Data Set");
            await createCognitiveCategorizationMappingPo.setConfidentialsLevelOfCategorization("20");
            await createCognitiveCategorizationMappingPo.setConfidentialsLevelByAgent("10");
            await createCognitiveCategorizationMappingPo.clickCancelButton();
            await utilCommon.clickOnWarningCancel();
            await createCognitiveCategorizationMappingPo.clickCancelButton();
            await utilCommon.clickOnWarningOk();
        });
        it('[DRDMV-8973,DRDMV-8971,DRDMV-8972,DRDMV-8977,DRDMV-8974]:[Cognitive] - Add Data Set Mapping for Categorization', async () => {
            await consoleCognitivePo.clickAddDataSetMapping();
            await createCognitiveCategorizationMappingPo.setMappingName("Add Mapping" + randomStr);
            await createCognitiveCategorizationMappingPo.selectCompany("Petramco");
            await createCognitiveCategorizationMappingPo.selectDataSet("Trained Category Data Set");
            await createCognitiveCategorizationMappingPo.setConfidentialsLevelOfCategorization("200");
            expect(await createCognitiveCategorizationMappingPo.getMaximumValueErrorMessage()).toContain("Maximum value is 100.");
            await createCognitiveCategorizationMappingPo.setConfidentialsLevelOfCategorization("20");
            await createCognitiveCategorizationMappingPo.setConfidentialsLevelByAgent("101");
            expect(await createCognitiveCategorizationMappingPo.getMaximumValueErrorMessage()).toContain("Maximum value is 100.");
            await createCognitiveCategorizationMappingPo.setConfidentialsLevelByAgent("10");
            await createCognitiveCategorizationMappingPo.clickSaveButton();
        });
        it('[DRDMV-8973,DRDMV-8971,DRDMV-8972,DRDMV-8977,DRDMV-8974]:[Cognitive] - Add Data Set Mapping for Categorization', async () => {
            await utilGrid.searchAndOpenHyperlink("Add Mapping" + randomStr);
            expect(await editCognitiveCategorizationMappingPo.isMappingRequiredTextPresent()).toBeTruthy();
            expect(await editCognitiveCategorizationMappingPo.isCompanyTextPresent()).toBeTruthy();
            expect(await editCognitiveCategorizationMappingPo.isDatasetTextPresent()).toBeTruthy();
            expect(await editCognitiveCategorizationMappingPo.isEnableMappingRequiredTextPresent()).toBe("true");
            expect(await editCognitiveCategorizationMappingPo.isConfidentialsLevelOfCategorizationTextPresent()).toBeTruthy();
            expect(await editCognitiveCategorizationMappingPo.isConfidentialsLevelByAgentRequiredTextPresent()).toBeTruthy();
            await editCognitiveCategorizationMappingPo.updateMappingName("update Mapping" + randomStr);
            await editCognitiveCategorizationMappingPo.updateConfidentialsLevelOfCategorization("40");
            await editCognitiveCategorizationMappingPo.updateConfidentialsLevelByAgent("40");
            await editCognitiveCategorizationMappingPo.clickCancelButton();
            await utilCommon.clickOnWarningCancel();
            await editCognitiveCategorizationMappingPo.clickCancelButton();
            await utilCommon.clickOnWarningOk();
        });
        it('[DRDMV-8973,DRDMV-8971,DRDMV-8972,DRDMV-8977,DRDMV-8974]:[Cognitive] - Add Data Set Mapping for Categorization', async () => {
            await utilGrid.searchAndOpenHyperlink("Add Mapping" + randomStr);
            await editCognitiveCategorizationMappingPo.updateMappingName("update Mapping" + randomStr);
            await editCognitiveCategorizationMappingPo.updateConfidentialsLevelOfCategorization("400");
            expect(await editCognitiveCategorizationMappingPo.getMaximumValueErrorMessage()).toContain("Maximum value is 100.");
            await editCognitiveCategorizationMappingPo.updateConfidentialsLevelOfCategorization("40");
            await editCognitiveCategorizationMappingPo.updateConfidentialsLevelByAgent("400");
            expect(await editCognitiveCategorizationMappingPo.getMaximumValueErrorMessage()).toContain("Maximum value is 100.");
            await editCognitiveCategorizationMappingPo.updateConfidentialsLevelByAgent("40");
            await editCognitiveCategorizationMappingPo.clickSaveButton();
        });

        it('[DRDMV-8973,DRDMV-8971,DRDMV-8972,DRDMV-8977,DRDMV-8974]:[Cognitive] - Add Data Set Mapping for Categorization', async () => {
            await consoleCognitivePo.clickAddDataSetMapping();
            await createCognitiveCategorizationMappingPo.setMappingName("Add Mapping Group " + randomStr);
            await createCognitiveCategorizationMappingPo.selectCompany("Petramco");
            await createCognitiveCategorizationMappingPo.selectDataSet("Trained Category Data Set");
            await createCognitiveCategorizationMappingPo.setConfidentialsLevelOfCategorization("20");
            await createCognitiveCategorizationMappingPo.setConfidentialsLevelByAgent("10");
            await createCognitiveCategorizationMappingPo.clickSaveButton();
            expect(await utilCommon.isPopUpMessagePresent("ERROR (382): The value(s) for this entry violate a unique index ")).toBeTruthy();
            await createCognitiveCategorizationMappingPo.clickEnabledMapping(false);
            await createCognitiveCategorizationMappingPo.clickSaveButton();
            expect(await utilCommon.isPopUpMessagePresent("ERROR (382): The value(s) for this entry violate a unique index ")).toBeTruthy();
            await createCognitiveCategorizationMappingPo.selectCompany("Psilon");
            await createCognitiveCategorizationMappingPo.clickSaveButton();
        });
        it('[DRDMV-8973,DRDMV-8971,DRDMV-8972,DRDMV-8977,DRDMV-8974]:[Cognitive] - Add Data Set Mapping for Categorization', async () => {
            await consoleCognitivePo.clickAddDataSetMapping();
            await createCognitiveCategorizationMappingPo.setMappingName("Add Mapping Psilon" + randomStr);
            await createCognitiveCategorizationMappingPo.selectCompany("Psilon");
            await createCognitiveCategorizationMappingPo.selectDataSet("Trained Category Data Set");
            await createCognitiveCategorizationMappingPo.setConfidentialsLevelOfCategorization("20");
            await createCognitiveCategorizationMappingPo.setConfidentialsLevelByAgent("10");
            await createCognitiveCategorizationMappingPo.clickSaveButton();
            expect(await utilCommon.isPopUpMessagePresent("ERROR (382): The value(s) for this entry violate a unique index ")).toBeTruthy();
            await editCognitiveCategorizationMappingPo.clickCancelButton();
            await utilCommon.clickOnWarningOk();
        });
    });
    it('[DRDMV-8975]:[Cognitive] - Category Data Set Mapping Grid validation', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Cognitive--Categorization', 'Categorization Configuration - Business Workflows');
        await consoleCognitivePo.addFilterOnCategorization("Mapping Name","Add Mapping Group " + randomStr,"text");
        expect(await consoleCognitivePo.isRecordPresentOnCategorization("Add Mapping Group " + randomStr)).toBeTruthy();
        await consoleCognitivePo.addFilterOnCategorization("Company","Petramco","text");
        expect(await consoleCognitivePo.isRecordPresentOnCategorization("update Mapping" + randomStr)).toBeTruthy();
        await consoleCognitivePo.addFilterOnCategorization("Mapping Type","Categorization","text");
        expect(await consoleCognitivePo.isRecordPresentOnCategorization("update Mapping" + randomStr)).toBeTruthy();
        expect(await consoleCognitivePo.isColumnSortedOnCategorization("Mapping Name", "asc")).toBeTruthy();
        expect(await consoleCognitivePo.isColumnSortedOnCategorization("Mapping Name", "desc")).toBeTruthy();
        expect(await consoleCognitivePo.isColumnSortedOnCategorization("Company", "asc")).toBeTruthy();
        expect(await consoleCognitivePo.isColumnSortedOnCategorization("Company", "desc")).toBeTruthy();
        expect(await consoleCognitivePo.isColumnSortedOnCategorization("Data Set Name", "asc")).toBeTruthy();
        expect(await consoleCognitivePo.isColumnSortedOnCategorization("Data Set Name", "desc")).toBeTruthy();
        expect(await consoleCognitivePo.isColumnSortedOnCategorization("Mapping Type", "asc")).toBeTruthy();
        expect(await consoleCognitivePo.isColumnSortedOnCategorization("Mapping Type", "desc")).toBeTruthy();
    });
});