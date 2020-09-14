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
import quickCasePo from '../../pageobject/case/quick-case.po';
import resourcesTabPo from '../../pageobject/common/resources-tab.po';
import previewCasePo from '../../pageobject/case/case-preview.po';
import utilityGrid from '../../utils/utility.grid';

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
    let caseTemplateData, caseData, caseTemplateResponse1, caseTemplateResponse2, caseTemplateResponse3, caseTemplateResponse4, caseTemplateResponse5, caseTemplateResponse6, caseTemplateResponse7;
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
            confidenceLevelAutomatic: 70,
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
            confidenceLevelAutomatic: 70,
            confidenceLevelAgent: 70
        }
        let categoryDataSetMappingStatus = await apiHelper.createCognitiveDataSetMapping("category", categoryDataSetMapping);
        console.log("Category DataSet Mapping Created ==> ", categoryDataSetMappingStatus);
    }

    async function createCognitiveSearchData() {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await apiHelper.apiLogin('qkatawazi');
        caseTemplateData = {
            "templateName": 'caseTemplateForCognitive1' + randomStr,
            "templateSummary": 'Employee asked requested for ergonomics assessment change',
            "categoryTier1": "",
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
        caseTemplateData.templateName = 'caseTemplateForCognitive2' + randomStr;
        caseTemplateData.templateSummary = 'New Joinee is looking for assessment for his workplace change';
        caseTemplateData.categoryTier1 = 'Applications';
        caseTemplateData.categoryTier2 = 'Help Desk';
        caseTemplateResponse2 = await apiHelper.createCaseTemplate(caseTemplateData);
        caseTemplateData.templateName = 'caseTemplateForCognitive3' + randomStr;
        caseTemplateData.templateSummary = 'Employee ergonomic assessment is requested change';
        caseTemplateData.categoryTier1 = 'Accounts Payable';
        caseTemplateData.categoryTier2 = 'Invoices';
        caseTemplateData.categoryTier3 = 'Payment';
        caseTemplateResponse3 = await apiHelper.createCaseTemplate(caseTemplateData);
        caseTemplateData.templateName = 'caseTemplateForCognitive4' + randomStr;
        caseTemplateData.templateSummary = 'Employee needs an employment verification letter bonus';
        caseTemplateData.categoryTier1 = 'Accounts Payable';
        caseTemplateData.categoryTier2 = 'Invoices';
        caseTemplateData.categoryTier3 = 'Payment';
        caseTemplateResponse4 = await apiHelper.createCaseTemplate(caseTemplateData);
        caseTemplateData.templateName = 'caseTemplateForCognitive5' + randomStr;
        caseTemplateData.templateSummary = 'Employee is looking for supplemental life insurance options bonus';
        caseTemplateData.categoryTier1 = 'Applications';
        caseTemplateResponse5 = await apiHelper.createCaseTemplate(caseTemplateData);
        caseTemplateData.templateName = 'caseTemplateForCognitive6' + randomStr;
        caseTemplateData.templateSummary = 'Employee is looking for supplemental life insurance options bonus';
        caseTemplateData.categoryTier1 = categName1;
        caseTemplateData.categoryTier2 = categName2;
        caseTemplateData.categoryTier3 = categName3;
        caseTemplateData.categoryTier4 = categName4;
        caseTemplateResponse6 = await apiHelper.createCaseTemplate(caseTemplateData);
        caseTemplateData.templateName = 'caseTemplateForCognitive8' + randomStr;
        await apiHelper.createCaseTemplate(caseTemplateData);
        caseTemplateData.templateName = 'caseTemplateForCognitive9' + randomStr;
        await apiHelper.createCaseTemplate(caseTemplateData);
        caseTemplateData.templateName = 'caseTemplateForCognitive10' + randomStr;
        await apiHelper.createCaseTemplate(caseTemplateData);
        caseTemplateData.templateName = 'caseTemplateForCognitive11' + randomStr;
        await apiHelper.createCaseTemplate(caseTemplateData);
    }

    async function createCaseDataPart1() {
        caseData = {
            "Requester": "apavlik",
            "Origin": "Agent",
        }
        await apiHelper.apiLogin('qkatawazi');
        for (let a = 1; a <= 2; a++) {
            caseData["Case Template ID"] = caseTemplateResponse1.id;
            await apiHelper.createCase(caseData);
        }
        for (let a = 1; a <= 2; a++) {
            caseData["Case Template ID"] = caseTemplateResponse2.id;
            await apiHelper.createCase(caseData);
        }
        for (let a = 1; a <= 2; a++) {
            caseData["Case Template ID"] = caseTemplateResponse3.id;
            await apiHelper.createCase(caseData);
        }
    }

    async function createCaseDataPar2() {
        caseData = {
            "Requester": "apavlik",
            "Origin": "Agent",
        }
        await apiHelper.apiLogin('qkatawazi');
        for (let a = 1; a <= 2; a++) {
            caseData["Case Template ID"] = caseTemplateResponse4.id;
            await apiHelper.createCase(caseData);
        }
        await apiHelper.apiLogin('qkatawazi');
        for (let a = 1; a <= 2; a++) {
            caseData["Case Template ID"] = caseTemplateResponse5.id;
            await apiHelper.createCase(caseData);
        }
        await apiHelper.apiLogin('qkatawazi');
        for (let a = 1; a <= 2; a++) {
            caseData["Case Template ID"] = caseTemplateResponse6.id;
            await apiHelper.createCase(caseData);
        }
    }

    describe('[DRDMV-9023,DRDMV-8981]:[Case Workspace] Cases search using filters', async () => {
        beforeAll(async () => {
            await createCognitiveSearchData();
        });
        it('[DRDMV-9023,DRDMV-8981]:Cognitive Config Creation', async () => {
            await createCaseDataPart1();
        });
        it('[DRDMV-9023,DRDMV-8981]:Cognitive Config Creation', async () => {
            await createCaseDataPar2();
        });
        it('[DRDMV-9023,DRDMV-8981]:Cognitive Config Creation', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.setSummary('Cognitive summary2');
            await createCasePo.selectCategoryTier1(categName1);
            await createCasePo.selectCategoryTier2(categName2);
            await createCasePo.selectCategoryTier3(categName3);
            await createCasePo.selectCategoryTier4(categName4);
            await createCasePo.clickAssignToMeButton();
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
        });
        it('[DRDMV-9023,DRDMV-8981]:Cognitive Config Creation', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('qtao');
            await createCasePo.setSummary('Cognitive summary2');
            await createCasePo.selectCategoryTier1(categName1);
            await createCasePo.selectCategoryTier2(categName2);
            await createCasePo.selectCategoryTier3(categName3);
            await createCasePo.selectCategoryTier4(categName4);
            await createCasePo.clickAssignToMeButton();
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
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
        it('[DRDMV-9023,DRDMV-8981]:Cognitive Config Creation', async () => {
            caseTemplateData.templateName = 'caseTemplateForCognitive7' + randomStr;
            caseTemplateData.templateSummary = 'Employee asked requested for ergonomics assessment after training';
            caseTemplateData.categoryTier1 = 'Accounts Payable';
            caseTemplateData.categoryTier2 = 'Invoices';
            caseTemplateData.categoryTier3 = 'Payment';
            await apiHelper.apiLogin('qkatawazi');
            caseTemplateResponse7 = await apiHelper.createCaseTemplate(caseTemplateData);
            for (let a = 1; a <= 2; a++) {
                caseData["Case Template ID"] = caseTemplateResponse7.id;
                await apiHelper.createCase(caseData);
            }
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
        it('[DRDMV-9023,DRDMV-8981]:[Case Workspace] Cases search using filters', async () => {
            await navigationPage.gotoCaseConsole();
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('adam');
            await quickCasePo.setCaseSummary('Employee asked requested bonus');
            expect(await resourcesTabPo.getCountOfHeading('Recommended Templates')).toBe(1, 'heading Count is not correct');
        });
        it('[DRDMV-9023,DRDMV-8981]:[Case Workspace] Cases search using filters', async () => {
            await navigationPage.gotoCaseConsole();
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('adam');
            await quickCasePo.setCaseSummary('Employee asked requested change');
            expect(await resourcesTabPo.getCountOfHeading('Recommended Templates')).toBe(1, 'heading Count is not correct');
        });
        it('[DRDMV-9023,DRDMV-8981]:[Case Workspace] Cases search using filters', async () => {
            await navigationPage.signOut();
            await loginPage.login('tadmin');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Cognitive--Template', 'Template Configuration - Business Workflows');
            await utilGrid.searchAndOpenHyperlink("Petramco Template Dataset Mapping");
            await editCognitiveTemplateMappingPo.updateValueOfCasesCreatedAutomatically("90");
            await editCognitiveTemplateMappingPo.updateConfidentialsLevelByAgent("90");
            await editCognitiveTemplateMappingPo.clickSaveButton();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
        it('[DRDMV-9023,DRDMV-8981]:[Case Workspace] Cases search using filters', async () => {
            await navigationPage.gotoCaseConsole();
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('adam');
            await quickCasePo.setCaseSummary('Employee asked requested bonus');
            expect(await resourcesTabPo.getCountOfHeading('Recommended Templates')).toBeGreaterThan(1, 'heading Count is not correct');
        });
        it('[DRDMV-9023,DRDMV-8981]:[Case Workspace] Cases search using filters', async () => {
            await navigationPage.gotoCaseConsole();
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('adam');
            await quickCasePo.setCaseSummary('Employee asked requested change');
            expect(await resourcesTabPo.getCountOfHeading('Recommended Templates')).toBeGreaterThan(1, 'heading Count is not correct');
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
            await createCasePo.setSummary('Employee looking supplemental insurance options bonus');
            await createCasePo.clickOnAutoCategorize();
            expect(await createCasePo.getCategoryTier1Value()).toBe("Applications");
            expect(await createCasePo.getCategoryTier2Value()).toBe('Select');
            expect(await createCasePo.getCategoryTier3Value()).toBe('Select');
            expect(await createCasePo.getCategoryTier4Value()).toBe('Select');
            await createCasePo.clearSummary();
            await createCasePo.setSummary('Employee asked requested change');
            await createCasePo.clickOnAutoCategorize();
            expect(await utilityCommon.isPopUpMessagePresent('No results found for categories.')).toBeTruthy();
            expect(await createCasePo.getCategoryTier1Value()).toBe("Applications");
            expect(await createCasePo.getCategoryTier2Value()).toBe('Select');
            expect(await createCasePo.getCategoryTier3Value()).toBe('Select');
            expect(await createCasePo.getCategoryTier4Value()).toBe('Select');
            await createCasePo.clearSummary();
            await createCasePo.setSummary('New Joinee assessment workplace change');
            await createCasePo.clickOnAutoCategorize();
            expect(await createCasePo.getCategoryTier1Value()).toBe("Applications");
            expect(await createCasePo.getCategoryTier2Value()).toBe('Help Desk');
            expect(await createCasePo.getCategoryTier3Value()).toBe('Select');
            expect(await createCasePo.getCategoryTier4Value()).toBe('Select');
        });
        it('[DRDMV-8985,DRDMV-8987]:[Cognitive] - Auto categorization when cognitive search return only tier 1, tier 1,2 and tier 1,2,3 values', async () => {
            await createCasePo.clearSummary();
            await createCasePo.setSummary('Employee needs an employment');
            await createCasePo.clickOnAutoCategorize();
            expect(await createCasePo.getCategoryTier1Value()).toBe("Accounts Payable");
            expect(await createCasePo.getCategoryTier2Value()).toBe("Invoices");
            expect(await createCasePo.getCategoryTier3Value()).toBe('Payment');
            expect(await createCasePo.getCategoryTier4Value()).toBe('Select');
            await createCasePo.selectCategoryTier1("Facilities");
            await createCasePo.selectCategoryTier2("Conference Room");
            await createCasePo.selectCategoryTier3("Furniture");
            expect(await createCasePo.getCategoryTier1Value()).toBe("Facilities");
            expect(await createCasePo.getCategoryTier2Value()).toBe("Conference Room");
            expect(await createCasePo.getCategoryTier3Value()).toBe("Furniture");
            await createCasePo.clearSummary();
            await createCasePo.setSummary('supplemental life insurance options bonus');
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

    //ankagraw
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
        it('[DRDMV-8973,DRDMV-8971,DRDMV-8972,DRDMV-8977,DRDMV-8974,DRDMV-8975]:[Cognitive] - Add Data Set Mapping for Categorization', async () => {
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
        it('[DRDMV-8973,DRDMV-8971,DRDMV-8972,DRDMV-8977,DRDMV-8974,DRDMV-8975]:[Cognitive] - Add Data Set Mapping for Categorization', async () => {
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
        it('[DRDMV-8973,DRDMV-8971,DRDMV-8972,DRDMV-8977,DRDMV-8974,DRDMV-8975]:[Cognitive] - Add Data Set Mapping for Categorization', async () => {
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
        it('[DRDMV-8973,DRDMV-8971,DRDMV-8972,DRDMV-8977,DRDMV-8974,DRDMV-8975]:[Cognitive] - Add Data Set Mapping for Categorization', async () => {
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

        it('[DRDMV-8973,DRDMV-8971,DRDMV-8972,DRDMV-8977,DRDMV-8974,DRDMV-8975]:[Cognitive] - Add Data Set Mapping for Categorization', async () => {
            await consoleCognitivePo.clickAddDataSetMapping();
            await createCognitiveCategorizationMappingPo.setMappingName("Add Mapping Group " + randomStr);
            await createCognitiveCategorizationMappingPo.selectCompany("Petramco");
            await createCognitiveCategorizationMappingPo.selectDataSet("Trained Category Data Set");
            await createCognitiveCategorizationMappingPo.setConfidentialsLevelOfCategorization("20");
            await createCognitiveCategorizationMappingPo.setConfidentialsLevelByAgent("10");
            await createCognitiveCategorizationMappingPo.clickSaveButton();
            expect(await utilCommon.isPopUpMessagePresent('ERROR (382): The value(s) for this entry violate a unique index that has been defined for this record definition.')).toBeTruthy();
            await utilCommon.closePopUpMessage();
            await createCognitiveCategorizationMappingPo.clickEnabledMapping(false);
            await createCognitiveCategorizationMappingPo.clickSaveButton();
            expect(await utilCommon.isPopUpMessagePresent('ERROR (382): The value(s) for this entry violate a unique index that has been defined for this record definition.')).toBeTruthy();
            await utilCommon.closePopUpMessage();
            await createCognitiveCategorizationMappingPo.selectCompany("Psilon");
            await createCognitiveCategorizationMappingPo.clickSaveButton();
        });
        it('[DRDMV-8973,DRDMV-8971,DRDMV-8972,DRDMV-8977,DRDMV-8974,DRDMV-8975]:[Cognitive] - Add Data Set Mapping for Categorization', async () => {
            await consoleCognitivePo.clickAddDataSetMapping();
            await createCognitiveCategorizationMappingPo.setMappingName("Add Mapping Psilon" + randomStr);
            await createCognitiveCategorizationMappingPo.selectCompany("Psilon");
            await createCognitiveCategorizationMappingPo.selectDataSet("Trained Category Data Set");
            await createCognitiveCategorizationMappingPo.setConfidentialsLevelOfCategorization("20");
            await createCognitiveCategorizationMappingPo.setConfidentialsLevelByAgent("10");
            await createCognitiveCategorizationMappingPo.clickSaveButton();
            expect(await utilCommon.isPopUpMessagePresent('ERROR (382): The value(s) for this entry violate a unique index that has been defined for this record definition.')).toBeTruthy();
            await utilCommon.closePopUpMessage();
            await createCognitiveCategorizationMappingPo.clickCancelButton();
            await utilCommon.clickOnWarningOk();
        });
        //ankagraw
        it('[DRDMV-8973,DRDMV-8971,DRDMV-8972,DRDMV-8977,DRDMV-8974,DRDMV-8975]:[Cognitive] - Add Data Set Mapping for Categorization', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Cognitive--Categorization', 'Categorization Configuration - Business Workflows');
            let column: string[] = ["Mapping Status"];
            await consoleCognitivePo.addColumnOnCategorization(column);
            await utilGrid.addFilter("Mapping Name", "Add Mapping Group " + randomStr, "text");
            expect(await consoleCognitivePo.isRecordPresentOnCategorization("Add Mapping Group " + randomStr)).toBeTruthy();
            await utilGrid.clearFilter();
            await utilGrid.addFilter("Company", "Psilon", "text");
            expect(await consoleCognitivePo.isRecordPresentOnCategorization("Add Mapping Group " + randomStr)).toBeTruthy();
            await utilGrid.clearFilter();
            await utilGrid.addFilter("Mapping Type", "Categorization", "checkbox");
            expect(await consoleCognitivePo.isRecordPresentOnCategorization("Add Mapping Group " + randomStr)).toBeTruthy();
            await utilGrid.clearFilter();
            await utilGrid.addFilter("Data Set Name", trainedCategoryDataSet, "text");
            expect(await consoleCognitivePo.isRecordPresentOnCategorization("Add Mapping Group " + randomStr)).toBeTruthy();
            await utilGrid.clearFilter();
            await utilGrid.addFilter("Mapping Status", "False", "checkbox");
            expect(await consoleCognitivePo.isRecordPresentOnCategorization("Add Mapping Group " + randomStr)).toBeTruthy();
            await utilGrid.clearFilter();
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
    //ankagraw
    describe('[DRDMV-8454,DRDMV-8453,DRDMV-8464,DRDMV-8455,DRDMV-8456]:[Cognitive] - Data Set Mapping for Templates UI validation', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let trainedTemplateDataSet = "Trained Templates Data Set";
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteCognitiveDataSetMapping();
            await apiHelper.deleteCognitiveDataSet();

            // add watson account
            let apiKey = "2fVs7RMM9IuTvZyB3qD1eXnFzUR4KGJNqd5tF0XMwz4J";
            await apiHelper.addWatsonAccount(apiKey);

            // trained data set
            await apiHelper.createCognitiveDataSet("category", { name: trainedTemplateDataSet });
            await apiHelper.trainCognitiveDataSet(trainedTemplateDataSet);
        });
        it('[DRDMV-8454,DRDMV-8453,DRDMV-8464,DRDMV-8455,DRDMV-8456]:[Cognitive] - Data Set Mapping for Templates UI validation', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Cognitive--Template', 'Template Configuration - Business Workflows');
            await consoleCognitivePo.clickAddDataSetMapping();
            expect(await createCognitiveTemplateMappingPo.isMappingRequiredTextPresent()).toBeTruthy();
            expect(await createCognitiveTemplateMappingPo.isCompanyTextPresent()).toBeTruthy();
            expect(await createCognitiveTemplateMappingPo.isDatasetTextPresent()).toBeTruthy();
            expect(await createCognitiveTemplateMappingPo.isEnableMappingRequiredTextPresent()).toBe("true");
            expect(await createCognitiveTemplateMappingPo.isConfidentialsLevelOfCategorizationTextPresent()).toBeTruthy();
            expect(await createCognitiveTemplateMappingPo.isConfidentialsLevelByAgentRequiredTextPresent()).toBeTruthy();
            expect(await createCognitiveTemplateMappingPo.isSaveButtonDisabled()).toBe("true");
            await createCognitiveTemplateMappingPo.setMappingName("Add Mapping" + randomStr);
            await createCognitiveTemplateMappingPo.selectCompany("Petramco");
            await createCognitiveTemplateMappingPo.selectDataSet(trainedTemplateDataSet);
            await createCognitiveTemplateMappingPo.setConfidentialsLevelOfCategorization("20");
            await createCognitiveTemplateMappingPo.setConfidentialsLevelByAgent("10");
            await createCognitiveTemplateMappingPo.clickCancelButton();
            await utilCommon.clickOnWarningCancel();
            await createCognitiveTemplateMappingPo.clickCancelButton();
            await utilCommon.clickOnWarningOk();
        });
        it('[DRDMV-8454,DRDMV-8453,DRDMV-8464,DRDMV-8455,DRDMV-8456]:[Cognitive] - Data Set Mapping for Templates UI validation', async () => {
            await consoleCognitivePo.clickAddDataSetMapping();
            await createCognitiveTemplateMappingPo.setMappingName("Add Mapping" + randomStr);
            await createCognitiveTemplateMappingPo.selectCompany("Petramco");
            await createCognitiveTemplateMappingPo.selectDataSet(trainedTemplateDataSet);
            await createCognitiveTemplateMappingPo.setConfidentialsLevelOfCategorization("200");
            expect(await createCognitiveTemplateMappingPo.getMaximumValueErrorMessage()).toContain("Maximum value is 100.");
            await createCognitiveTemplateMappingPo.setConfidentialsLevelOfCategorization("20");
            await createCognitiveTemplateMappingPo.setConfidentialsLevelByAgent("101");
            expect(await createCognitiveTemplateMappingPo.getMaximumValueErrorMessage()).toContain("Maximum value is 100.");
            await createCognitiveTemplateMappingPo.setConfidentialsLevelByAgent("10");
            await createCognitiveTemplateMappingPo.clickSaveButton();
        });
        it('[DRDMV-8454,DRDMV-8453,DRDMV-8464,DRDMV-8455,DRDMV-8456]:[Cognitive] - Data Set Mapping for Templates UI validation', async () => {
            await utilGrid.searchAndOpenHyperlink("Add Mapping" + randomStr);
            expect(await editCognitiveTemplateMappingPo.isMappingRequiredTextPresent()).toBeTruthy();
            expect(await editCognitiveTemplateMappingPo.isCompanyTextPresent()).toBeTruthy();
            expect(await editCognitiveTemplateMappingPo.isDatasetTextPresent()).toBeTruthy();
            expect(await editCognitiveTemplateMappingPo.isEnableMappingRequiredTextPresent()).toBe("true");
            expect(await editCognitiveTemplateMappingPo.isConfidentialsLevelOfCategorizationTextPresent()).toBeTruthy();
            expect(await editCognitiveTemplateMappingPo.isConfidentialsLevelByAgentRequiredTextPresent()).toBeTruthy();
            await editCognitiveTemplateMappingPo.updateMappingName("update Mapping" + randomStr);
            await editCognitiveTemplateMappingPo.updateValueOfCasesCreatedAutomatically("40");
            await editCognitiveTemplateMappingPo.updateConfidentialsLevelByAgent("40");
            await editCognitiveTemplateMappingPo.clickCancelButton();
            await utilCommon.clickOnWarningCancel();
            await editCognitiveTemplateMappingPo.clickCancelButton();
            await utilCommon.clickOnWarningOk();
        });
        it('[DRDMV-8454,DRDMV-8453,DRDMV-8464,DRDMV-8455,DRDMV-8456]:[Cognitive] - Data Set Mapping for Templates UI validation', async () => {
            await utilGrid.searchAndOpenHyperlink("Add Mapping" + randomStr);
            await editCognitiveTemplateMappingPo.updateMappingName("update Mapping" + randomStr);
            await editCognitiveTemplateMappingPo.updateValueOfCasesCreatedAutomatically("400");
            expect(await editCognitiveTemplateMappingPo.getMaximumValueErrorMessage()).toContain("Maximum value is 100.");
            await editCognitiveTemplateMappingPo.updateValueOfCasesCreatedAutomatically("40");
            await editCognitiveTemplateMappingPo.updateConfidentialsLevelByAgent("400");
            expect(await editCognitiveTemplateMappingPo.getMaximumValueErrorMessage()).toContain("Maximum value is 100.");
            await editCognitiveTemplateMappingPo.updateConfidentialsLevelByAgent("40");
            await editCognitiveTemplateMappingPo.clickSaveButton();
        });

        it('[DRDMV-8454,DRDMV-8453,DRDMV-8464,DRDMV-8455,DRDMV-8456]:[Cognitive] - Data Set Mapping for Templates UI validation', async () => {
            await consoleCognitivePo.clickAddDataSetMapping();
            await createCognitiveTemplateMappingPo.setMappingName("Add Mapping Group " + randomStr);
            await createCognitiveTemplateMappingPo.selectCompany("Petramco");
            await createCognitiveTemplateMappingPo.selectDataSet(trainedTemplateDataSet);
            await createCognitiveTemplateMappingPo.setConfidentialsLevelOfCategorization("20");
            await createCognitiveTemplateMappingPo.setConfidentialsLevelByAgent("10");
            await createCognitiveTemplateMappingPo.clickSaveButton();
            expect(await utilCommon.isPopUpMessagePresent('ERROR (382): The value(s) for this entry violate a unique index that has been defined for this record definition.')).toBeTruthy();
            await utilCommon.closePopUpMessage();
            await createCognitiveTemplateMappingPo.clickEnabledMapping(false);
            await createCognitiveTemplateMappingPo.clickSaveButton();
            expect(await utilCommon.isPopUpMessagePresent('ERROR (382): The value(s) for this entry violate a unique index that has been defined for this record definition.')).toBeTruthy();
            await utilCommon.closePopUpMessage();
            await createCognitiveTemplateMappingPo.selectCompany("Psilon");
            await createCognitiveTemplateMappingPo.clickSaveButton();
        });
        it('[DRDMV-8454,DRDMV-8453,DRDMV-8464,DRDMV-8455,DRDMV-8456]:[Cognitive] - Data Set Mapping for Templates UI validation', async () => {
            await consoleCognitivePo.clickAddDataSetMapping();
            await createCognitiveTemplateMappingPo.setMappingName("Add Mapping Psilon" + randomStr);
            await createCognitiveTemplateMappingPo.selectCompany("Psilon");
            await createCognitiveTemplateMappingPo.selectDataSet(trainedTemplateDataSet);
            await createCognitiveTemplateMappingPo.setConfidentialsLevelOfCategorization("20");
            await createCognitiveTemplateMappingPo.setConfidentialsLevelByAgent("10");
            await createCognitiveTemplateMappingPo.clickSaveButton();
            expect(await utilCommon.isPopUpMessagePresent('ERROR (382): The value(s) for this entry violate a unique index that has been defined for this record definition.')).toBeTruthy();
            await utilCommon.closePopUpMessage();
            await createCognitiveTemplateMappingPo.clickCancelButton();
            await utilCommon.clickOnWarningOk();
        });
        it('[DRDMV-8457]: [Cognitive] - Template Data Set Mapping Grid validation', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Cognitive--Template', 'Template Configuration - Business Workflows');
            let column: string[] = ["Mapping Status"];
            await consoleCognitivePo.addColumnOnTemplate(column);
            await utilGrid.addFilter("Mapping Name", "Add Mapping Group " + randomStr, "text");
            expect(await consoleCognitivePo.isRecordPresentOnTemplate("Add Mapping Group " + randomStr)).toBeTruthy();
            await utilGrid.clearFilter();
            await utilGrid.addFilter("Company", "Psilon", "text");
            expect(await consoleCognitivePo.isRecordPresentOnTemplate("Add Mapping Group " + randomStr)).toBeTruthy();
            await utilGrid.clearFilter();
            await utilGrid.addFilter("Mapping Type", "Template", "checkbox");
            expect(await consoleCognitivePo.isRecordPresentOnTemplate("Add Mapping Group " + randomStr)).toBeTruthy();
            await utilGrid.clearFilter();
            await utilGrid.addFilter("Data Set Name", trainedTemplateDataSet, "text");
            expect(await consoleCognitivePo.isRecordPresentOnTemplate("Add Mapping Group " + randomStr)).toBeTruthy();
            await utilGrid.clearFilter();
            await utilGrid.addFilter("Mapping Status", "False", "checkbox");
            expect(await consoleCognitivePo.isRecordPresentOnTemplate("Add Mapping Group " + randomStr)).toBeTruthy();
            await utilGrid.clearFilter();
            expect(await consoleCognitivePo.isColumnSortedOnTemplate("Mapping Name", "asc")).toBeTruthy();
            expect(await consoleCognitivePo.isColumnSortedOnTemplate("Mapping Name", "desc")).toBeTruthy();
            expect(await consoleCognitivePo.isColumnSortedOnTemplate("Company", "asc")).toBeTruthy();
            expect(await consoleCognitivePo.isColumnSortedOnTemplate("Company", "desc")).toBeTruthy();
            expect(await consoleCognitivePo.isColumnSortedOnTemplate("Data Set Name", "asc")).toBeTruthy();
            expect(await consoleCognitivePo.isColumnSortedOnTemplate("Data Set Name", "desc")).toBeTruthy();
            expect(await consoleCognitivePo.isColumnSortedOnTemplate("Mapping Type", "asc")).toBeTruthy();
            expect(await consoleCognitivePo.isColumnSortedOnTemplate("Mapping Type", "desc")).toBeTruthy();
        });
    });
});