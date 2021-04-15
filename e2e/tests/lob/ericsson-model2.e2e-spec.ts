import { browser } from "protractor";
import coreApi from '../../api/api.core.util';
import apiHelper from '../../api/api.helper';
import caseConsolePo from "../../pageobject/case/case-console.po";
import casePreviewPo from '../../pageobject/case/case-preview.po';
import createCasePage from '../../pageobject/case/create-case.po';
import editCasePo from '../../pageobject/case/edit-case.po';
import quickCasePo from '../../pageobject/case/quick-case.po';
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import viewCasePage from '../../pageobject/case/view-case.po';
import accessTabPo from '../../pageobject/common/access-tab.po';
import changeAssignmentBladePo from '../../pageobject/common/change-assignment.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import resourcesTabPo from '../../pageobject/common/resources-tab.po';
import createKnowledgePage from "../../pageobject/knowledge/create-knowlege.po";
import editKnowledgePo from '../../pageobject/knowledge/edit-knowledge.po';
import previewKnowledgePo from '../../pageobject/knowledge/preview-knowledge.po';
import statusBladeKnowledgeArticlePo from '../../pageobject/knowledge/status-blade-knowledge-article.po';
import viewKnowledgeArticlePo from '../../pageobject/knowledge/view-knowledge-article.po';
import caseTemplatePreviewPo from '../../pageobject/settings/case-management/preview-case-template.po';
import createAdhocTaskPo from "../../pageobject/task/create-adhoc-task.po";
import manageTaskBladePo from "../../pageobject/task/manage-task-blade.po";
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

xdescribe('Ericsson Model Test Extended', () => {
    let supportGroupDataHR, supportGroupDataFacilities, supportGroupDataEricssonHR, supportGroupDataEricssonSAM, userData3, userData4;
    let ericssonHRAndSamLOBUserName = 'sbruce@petramco.com';
    let password = 'Password_1234';

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('rwillie');

        userData3 = {
            "firstName": "ercsn hr tst",
            "lastName": "usr",
            "userId": "ercsnhrusr",
            "userPermission": ["Case Agent", "Ericsson HR", "Case Business Analyst", "Knowledge Publisher"]
        }

        userData4 = {
            "firstName": "ercsn sam tst",
            "lastName": "usr",
            "userId": "ercsnsamusr",
            "userPermission": ["Case Agent", "Ericsson SAM", "Case Business Analyst", "Knowledge Publisher"]
        }

        await apiHelper.createNewUser(userData3);
        await apiHelper.createNewUser(userData4);
        let orgId1 = await coreApi.getBusinessUnitGuid('Ericsson HR Support');
        supportGroupDataHR.relatedOrgId = orgId1;
        supportGroupDataFacilities.relatedOrgId = orgId1;
        await apiHelper.createSupportGroup(supportGroupDataEricssonHR);
        await apiHelper.createSupportGroup(supportGroupDataEricssonSAM);
        await apiHelper.associatePersonToCompany(userData3.userId, "Ericsson HR");
        await apiHelper.associatePersonToSupportGroup(userData3.userId, "US Support 2");
        await apiHelper.associatePersonToCompany(userData4.userId, "Ericsson HR");
        await apiHelper.associatePersonToSupportGroup(userData4.userId, "US Support 2");
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    describe('[60194]:[Ericsson Model][Quick Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
        let ericssonSAMcaseTemplateData, caseTemplateDataEricssonSAMGlobal;
        let articleData, caseTemplateDataGlobal, ericssonGlobalcaseTemplateData, ericssonHRcaseTemplateData, randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let commonName = randomStr + "Case DRDMV23488";
        let commonNameForOtherLoB = randomStr + "ericssonSAMDRDMV23488";
        beforeAll(async () => {
            ericssonHRcaseTemplateData = {
                "templateName": commonName,
                "templateSummary": randomStr + 'Summary DRDMV23488',
                "caseStatus": "Assigned",
                "templateStatus": "Active",
                "company": "Ericsson HR",
                "businessUnit": "Ericsson United States Support",
                "supportGroup": "US Support 1",
                "assignee": "rwillie",
                "casePriority": "Low",
                "ownerCompany": "Ericsson HR",
                "ownerBusinessUnit": "Ericsson United States Support",
                "ownerGroup": "US Support 1",
                "lineOfBusiness": "Ericsson HR"
            };
            ericssonGlobalcaseTemplateData = {
                "templateName": commonName,
                "templateSummary": randomStr + 'Summary DRDMV23488',
                "caseStatus": "Assigned",
                "templateStatus": "Active",
                "company": "Ericsson Global",
                "casePriority": "Low",
                "ownerCompany": "Ericsson HR",
                "ownerBusinessUnit": "Ericsson United States Support",
                "ownerGroup": "US Support 1",
                "lineOfBusiness": "Ericsson HR"
            };
            caseTemplateDataGlobal = {
                "templateName": commonName,
                "templateSummary": randomStr + 'Summary DRDMV23488',
                "caseStatus": "Assigned",
                "templateStatus": "Active",
                "company": "- Global -",
                "casePriority": "Low",
                "ownerCompany": "Ericsson HR",
                "ownerBusinessUnit": "Ericsson United States Support",
                "ownerGroup": "US Support 1",
                "lineOfBusiness": "Ericsson HR"
            };
            await apiHelper.apiLogin('tadmin');
            let categoryTier1Guid = await coreApi.getCategoryGuid('Employee Relations');
            let categoryTier2Guid = await coreApi.getCategoryGuid('Compensation');
            let categoryTier3Guid = await coreApi.getCategoryGuid('Bonus');
            let caseData = {
                "Requester": "rdonald",
                "Summary": commonName,
                "Assigned Company": "Ericsson HR",
                "Business Unit": "Ericsson United States Support",
                "Support Group": "US Support 1",
                "categoryTier1": categoryTier1Guid,
                "categoryTier2": categoryTier2Guid,
                "categoryTier3": categoryTier3Guid,
                "Assignee": "rdustin",
                "Line Of Business": "Ericsson HR"
            };
            let knowledgeSetData = {
                knowledgeSetTitle: 'KnowledgeSet_' + randomStr,
                knowledgeSetDesc: 'KnowledgeSetDesc' + randomStr,
                company: 'Ericsson HR',
                lineOfBusiness: "Ericsson HR"
            }
            await apiHelper.apiLogin('rwillie');
            await apiHelper.createKnowledgeSet(knowledgeSetData);
            articleData = {
                "knowledgeSet": knowledgeSetData.knowledgeSetTitle,
                "title": commonName,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Ericsson HR",
                "assigneeBusinessUnit": "Ericsson United States Support",
                "assigneeSupportGroup": "US Support 1",
                "assignee": "rdustin",
                "lineOfBusiness": "Ericsson HR"
            };
            await apiHelper.apiLogin('rwillie');
            await apiHelper.createCaseTemplate(ericssonHRcaseTemplateData);
            await apiHelper.createCaseTemplate(ericssonGlobalcaseTemplateData);
            await apiHelper.createCaseTemplate(caseTemplateDataGlobal);
            await apiHelper.createCase(caseData);
            let knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
            let knowledgeArticleGUID = knowledgeArticleData.id;
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'Draft')).toBeTruthy('Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'SMEReview', 'rwillie', 'US Support 1', 'Ericsson HR')).toBeTruthy("Article with SME Review status not updated.");
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'PublishApproval', 'rwillie', 'US Support 1', 'Ericsson HR')).toBeTruthy('Status Not Set');
            ericssonSAMcaseTemplateData = {
                "templateName": commonNameForOtherLoB,
                "templateStatus": "Active",
                "templateSummary": `Summary1${randomStr}`,
                "caseStatus": "New",
                "casePriority": "Medium",
                "ownerComapny": "Ericsson SAM",
                "ownerBU": "Ericsson Asset Management - USA",
                "ownerGroup": "Asset Disposal",
                "company": "Ericsson SAM",
                "lineOfBusiness": "Ericsson SAM",
            }
            caseTemplateDataEricssonSAMGlobal = {
                "templateName": commonNameForOtherLoB,
                "templateSummary": randomStr + 'Summary DRDMV23488',
                "caseStatus": "Assigned",
                "templateStatus": "Active",
                "company": "Ericsson Global",
                "casePriority": "Low",
                "ownerComapny": "Ericsson SAM",
                "ownerBU": "Ericsson Asset Management - USA",
                "ownerGroup": "Asset Disposal",
                "lineOfBusiness": "Ericsson SAM",
            };
            await apiHelper.apiLogin('sbruce');
            await apiHelper.createCaseTemplate(ericssonSAMcaseTemplateData);
            await apiHelper.createCaseTemplate(caseTemplateDataEricssonSAMGlobal);
        });
        it('[60194]:[Ericsson Model][Quick Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('rdustin');
            expect(await quickCasePo.selectCaseTemplate(ericssonSAMcaseTemplateData.templateName)).toBeFalsy('template is present');
            expect(await quickCasePo.selectCaseTemplate(caseTemplateDataEricssonSAMGlobal.templateName)).toBeFalsy('template is present');
            await quickCasePo.selectCaseTemplate(ericssonHRcaseTemplateData.templateName);
            await quickCasePo.clickArrowFirstRecommendedCaseTemplate();
            expect(await caseTemplatePreviewPo.getLineOfBusinessValue()).toBe('Ericsson HR');
            await caseTemplatePreviewPo.clickOnBackButton();
        });
        it('[60194]:[Ericsson Model][Quick Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await browser.sleep(7000); //Hard wait for KA Indexing
            expect(await resourcesTabPo.getKnowledgeArticleInfo()).toContain('Ericsson HR', 'LOB is not correct');
            await resourcesTabPo.clickOnAdvancedSearchOptions();
            await resourcesTabPo.enterAdvancedSearchText(articleData.title);
            await resourcesTabPo.clickOnAdvancedSearchSettingsIconToOpen();
            await resourcesTabPo.clickOnAdvancedSearchFiltersButton('Apply');
            await resourcesTabPo.clickOnAdvancedSearchSettingsIconToClose();
            expect(await resourcesTabPo.getKnowledgeArticleInfo()).toContain('Ericsson HR', 'LOB is not correct');
            await quickCasePo.clickFirstRecommendedCases();
            expect(await casePreviewPo.getLineOfBusinessValue()).toBe('Ericsson HR');
            await casePreviewPo.clickBackButton();
            await quickCasePo.createCaseButton();
            await casePreviewPo.clickGoToCaseButton();
        });
        it('[60194]:[Ericsson Model][Quick Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await viewCasePage.clickEditCaseButton();
            expect(await editCasePo.isValuePresentInDropdown("Category Tier 1", 'Fixed Assets')).toBeFalsy('Value is present in  Category Tier 1 drop down');
            expect(await editCasePo.isLineOfBusinessReadOnly()).toBeTruthy('Field is enabled');
            await editCasePo.updateCasePriority('High');
            await editCasePo.updateCaseCategoryTier1('Employee Relations');
            await editCasePo.updateCaseCategoryTier2('Compensation');
            await editCasePo.updateCaseCategoryTier3('Bonus');
            await editCasePo.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'Ericsson Asset Management - India')).toBeFalsy();
            await changeAssignmentBladePo.clickOnCancelButton();
            await editCasePo.clickChangeAssignmentButton();
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'US Support 2');
            await changeAssignmentBladePo.setDropDownValue('Assignee', 'Rudner Rita');
            await changeAssignmentBladePo.clickOnAssignButton();
            await editCasePo.clickSaveCase();
            expect(await viewCasePage.getCategoryTier1Value()).toBe('Employee Relations');
            expect(await viewCasePage.getCategoryTier2Value()).toBe('Compensation');
            expect(await viewCasePage.getCategoryTier3Value()).toBe('Bonus');
            expect(await viewCasePage.getAssignedGroupValue()).toBe("US Support 2");
            expect(await viewCasePage.getAssigneeText()).toBe("Rudner Rita");
        });
        it('[60194]:[Ericsson Model][Quick Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await viewCasePage.clickEditCaseButton();
            await editCasePo.clickOnChangeCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(ericssonGlobalcaseTemplateData.templateName);
            await editCasePo.clickSaveCase();
            await utilityCommon.closePopUpMessage();
            await navigationPage.gotoCaseConsole();
            expect(await utilityGrid.isGridRecordPresent(ericssonGlobalcaseTemplateData.templateName)).toBeTruthy(ericssonGlobalcaseTemplateData.templateName);
            await navigationPage.signOut();
            await loginPage.login('ttristan');
            await utilityGrid.clearFilter();
            expect(await utilityGrid.isGridRecordPresent(ericssonGlobalcaseTemplateData.templateName)).toBeFalsy(ericssonGlobalcaseTemplateData.templateName);
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('tkenneth');
            await quickCasePo.setCaseSummary('new case');
            await quickCasePo.createCaseButton();
            await utilityCommon.closePopUpMessage();
            expect(await casePreviewPo.getLineOfBusinessValue()).toBe('Ericsson SAM');
            await casePreviewPo.clickGoToCaseButton();
            await viewCasePage.clickEditCaseButton();
            expect(await editCasePo.isValuePresentInDropdown("Category Tier 1", 'Employee Relations')).toBeFalsy('Value is present in  Category Tier 1 drop down');
            expect(await editCasePo.isLineOfBusinessReadOnly()).toBeTruthy('Field is enabled');
            await editCasePo.updateCasePriority('High');
            await editCasePo.updateCaseCategoryTier1('Fixed Assets');
            await editCasePo.updateCaseCategoryTier2('Impairment');
            await editCasePo.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'Ericsson United States Support')).toBeFalsy();
            await changeAssignmentBladePo.clickOnCancelButton();
            await editCasePo.clickChangeAssignmentButton();
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'Old Asset Management');
            await changeAssignmentBladePo.setDropDownValue('Assignee', 'Tynan Kenneth');
            await changeAssignmentBladePo.clickOnAssignButton();
            await editCasePo.clickSaveCase();
            expect(await viewCasePage.getCategoryTier1Value()).toBe('Fixed Assets');
            expect(await viewCasePage.getCategoryTier2Value()).toBe('Impairment');
            expect(await viewCasePage.getCategoryTier3Value()).toBe('Bonus');
            expect(await viewCasePage.getAssignedGroupValue()).toBe("Old Asset Management");
            expect(await viewCasePage.getAssigneeText()).toBe("Tynan Kenneth");
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('tkenneth');
            await quickCasePo.selectCaseTemplate(ericssonSAMcaseTemplateData.templateName);
            await quickCasePo.createCaseButton();
            await utilityCommon.closePopUpMessage();
            expect(await casePreviewPo.getLineOfBusinessValue()).toBe('Ericsson SAM');
            await casePreviewPo.clickGoToCaseButton();
        });
        it('[60194]:[Ericsson Model][Quick Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('tkenneth');
            await quickCasePo.selectCaseTemplate(caseTemplateDataEricssonSAMGlobal.templateName);
            await quickCasePo.clickArrowFirstRecommendedCaseTemplate();
            expect(await caseTemplatePreviewPo.getLineOfBusinessValue()).toBe('Ericsson SAM');
            await caseTemplatePreviewPo.clickOnBackButton();
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('tkenneth');
            expect(await quickCasePo.selectCaseTemplate(caseTemplateDataGlobal.templateName)).toBeFalsy('template is present');
            await quickCasePo.setCaseSummary('new case');
            await resourcesTabPo.clickOnAdvancedSearchOptions();
            await resourcesTabPo.enterAdvancedSearchText(articleData.title);
            await resourcesTabPo.clickOnAdvancedSearchSettingsIconToOpen();
            await resourcesTabPo.clickOnAdvancedSearchFiltersButton('Apply');
            await resourcesTabPo.clickOnAdvancedSearchSettingsIconToClose();
            expect(await resourcesTabPo.isRecommendedKnowledgePresent(articleData.title)).toBeFalsy();
            await quickCasePo.clickStartOverButton();
            await quickCasePo.selectRequesterName('tkenneth');
            expect(await quickCasePo.selectCaseTemplate(ericssonGlobalcaseTemplateData.templateName)).toBeFalsy('template is present');
            expect(await quickCasePo.selectCaseTemplate(ericssonHRcaseTemplateData.templateName)).toBeFalsy('template is present');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
        });
    });

    //kiran
    describe('[12043]: [Service Provider Model][Create Case]: Verify the behavior when the case agent is able to create a case when it has access to multiple LOB', () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateDataGlobalEricssonGlobalSAM, knowledgeSetDataEricssonHR, caseTemplateDataGlobalEricssonHR, caseTemplateDataEricssonHR, caseIdEricssonHR, caseIdEricssonSAM, caseTemplateDataEricssonSAM, caseTemplateDataGlobalEricssonSAM, caseTemplateDataGlobalEricssonGlobalHR;
        let knowledgeTitle = "knowledgeTitleDRDMV23664" + randomStr;
        let summary = "DRDMV23664CaseSummary" + randomStr;

        beforeAll(async () => {
            // Create Data with Ericsson HR LOB
            await apiHelper.apiLogin('tadmin');
            await apiHelper.associatePersonToCompany('sbruce', "Ericsson HR");
            await apiHelper.apiLogin(ericssonHRAndSamLOBUserName, password);

            caseTemplateDataGlobalEricssonHR = {
                "templateName": 'GlobalcaseTemplateNameEricssonHR' + randomStr,
                "templateSummary": 'GlobalCaseTemplateSummaryEricssonHR' + randomStr,
                "categoryTier1": 'Employee Relations',
                "categoryTier2": 'Compensation',
                "categoryTier3": 'Bonus',
                "casePriority": "Low",
                "templateStatus": "Active",
                "company": "- Global -",
                "ownerComapny": "Ericsson HR",
                "businessUnit": "Ericsson United States Support",
                "supportGroup": "US Support 1",
                "assignee": "rwillie",
                "ownerBU": "Ericsson United States Support",
                "ownerGroup": "US Support 1",
                "lineOfBusiness": "Ericsson HR"
            }
            await apiHelper.createCaseTemplate(caseTemplateDataGlobalEricssonHR);

            caseTemplateDataGlobalEricssonGlobalHR = {
                "templateName": 'GlobalcaseTemplateNameEricssonGlobalHR' + randomStr,
                "templateSummary": 'GlobalCaseTemplateSummaryEricssonGlobalHR' + randomStr,
                "categoryTier1": 'Workforce Administration',
                "categoryTier2": 'HR Operations',
                "categoryTier3": 'Adjustments',
                "casePriority": "High",
                "templateStatus": "Active",
                "company": "Ericsson Global",
                "ownerComapny": "Ericsson HR",
                "businessUnit": "Ericsson United States Support",
                "supportGroup": "US Support 1",
                "assignee": "rrichard",
                "ownerBU": "Ericsson United States Support",
                "ownerGroup": "US Support 1",
                "lineOfBusiness": "Ericsson HR"
            }
            await apiHelper.createCaseTemplate(caseTemplateDataGlobalEricssonGlobalHR);

            caseTemplateDataEricssonHR = {
                "templateName": 'CaseTemplateNameEricssonHR' + randomStr,
                "templateSummary": 'CaseTemplateNameEricssonHR' + randomStr,
                "categoryTier1": 'Workforce Administration',
                "categoryTier2": 'HR Operations',
                "categoryTier3": 'Adjustments',
                "casePriority": "High",
                "templateStatus": "Active",
                "company": "Ericsson HR",
                "ownerComapny": "Ericsson HR",
                "businessUnit": "Ericsson United States Support",
                "supportGroup": "US Support 1",
                "assignee": "rlouis",
                "ownerBU": "Ericsson United States Support",
                "ownerGroup": "US Support 1",
                "lineOfBusiness": "Ericsson HR"
            }
            await apiHelper.createCaseTemplate(caseTemplateDataEricssonHR);

            // Create data knowledge set for Ericsson HR 
            knowledgeSetDataEricssonHR = {
                'knowledgeSetTitle': 'KASetEricssonHR' + randomStr,
                'knowledgeSetDesc': 'EricssonHR_Desc' + randomStr,
                'company': 'Ericsson HR',
                "lineOfBusiness": "Ericsson HR"
            }
            await apiHelper.createKnowledgeSet(knowledgeSetDataEricssonHR);

            // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            // Create data with Ericsson SAM Data
            caseTemplateDataGlobalEricssonSAM = {
                "templateName": 'GlobalcaseTemplateNameEricssonSAM' + randomStr,
                "templateSummary": 'GlobalCaseTemplateSummaryEricssonSAM' + randomStr,
                "categoryTier1": 'Purchasing Card',
                "categoryTier2": 'Auditing',
                "categoryTier3": 'Card Activity',
                "casePriority": "Low",
                "templateStatus": "Active",
                "company": "- Global -",
                "ownerComapny": "Ericsson SAM",
                "businessUnit": "Ericsson Asset Management - USA",
                "supportGroup": "Asset Disposal",
                "assignee": "sbruce",
                "ownerBU": "Ericsson Asset Management - USA",
                "ownerGroup": "Asset Disposal",
                "lineOfBusiness": "Ericsson SAM"
            }
            await apiHelper.createCaseTemplate(caseTemplateDataGlobalEricssonSAM);

            caseTemplateDataGlobalEricssonGlobalSAM = {
                "templateName": 'GlobalcaseTemplateNameEricssonGlobalSAM' + randomStr,
                "templateSummary": 'GlobalCaseTemplateSummaryEricssonGlobalSAM' + randomStr,
                "categoryTier1": 'Fixed Assets',
                "categoryTier2": 'Capitalization',
                "casePriority": "Low",
                "templateStatus": "Active",
                "company": "Ericsson Global",
                "ownerComapny": "Ericsson SAM",
                "businessUnit": "Ericsson Asset Management - USA",
                "supportGroup": "Asset Disposal",
                "assignee": "sbruce",
                "ownerBU": "Ericsson Asset Management - USA",
                "ownerGroup": "Asset Disposal",
                "lineOfBusiness": "Ericsson SAM"
            }
            await apiHelper.createCaseTemplate(caseTemplateDataGlobalEricssonGlobalSAM);

            caseTemplateDataEricssonSAM = {
                "templateName": 'CaseTemplateNameEricssonSAM' + randomStr,
                "templateSummary": 'CaseTemplateNameEricssonSAM' + randomStr,
                "categoryTier1": 'Fixed Assets',
                "categoryTier2": 'Capitalization',
                "casePriority": "High",
                "templateStatus": "Active",
                "company": "Ericsson SAM",
                "ownerComapny": "Ericsson SAM",
                "businessUnit": "Ericsson Asset Management - USA",
                "supportGroup": "Asset Disposal",
                "assignee": "ssteven",
                "ownerBU": "Ericsson Asset Management - USA",
                "ownerGroup": "Asset Disposal",
                "lineOfBusiness": "Ericsson SAM"
            }
            await apiHelper.createCaseTemplate(caseTemplateDataEricssonSAM);
        });

        it('[12043]: Verify Negative Scenrio between Ericsson HR and Ericsson SAM with Global Requester', async () => {
            await navigationPage.signOut();
            await loginPage.login(ericssonHRAndSamLOBUserName, password);
            await utilityGrid.selectLineOfBusiness('Ericsson HR');

            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('tted');
            expect(await createCasePage.getCompany()).toBe('Ericsson Global');
            expect(await createCasePage.getLineOfBusinessValue()).toBe('Ericsson HR');

            await createCasePage.setSummary(summary);
            // Verify negative scenario for Ericsson HR and Ericsson SAM LOB case template should not display
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.clickOnAllTemplateTab();
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalEricssonGlobalSAM.templateName)).toBeFalsy(`${caseTemplateDataGlobalEricssonGlobalSAM} caseTemplateDataGlobalEricssonGlobalSAM.templateName is missing`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalEricssonGlobalHR.templateName)).toBeTruthy(`${caseTemplateDataGlobalEricssonGlobalHR} caseTemplateDataGlobalEricssonGlobalHR.templateName is missing`);

            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataEricssonSAM.templateName)).toBeFalsy(`${caseTemplateDataEricssonSAM} caseTemplateDataEricssonSAM.templateName is missing`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalEricssonSAM.templateName)).toBeFalsy(`${caseTemplateDataGlobalEricssonSAM} caseTemplateDataGlobalEricssonSAM.templateName is missing`);

            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataEricssonHR.templateName)).toBeFalsy(`${caseTemplateDataEricssonHR} caseTemplateDataEricssonHR is missing`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalEricssonHR.templateName)).toBeTruthy(`${caseTemplateDataGlobalEricssonHR} caseTemplateDataGlobalEricssonHR is missing`);

            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateDataGlobalEricssonHR.templateName);

            expect(await createCasePage.getCategoryTier1Value()).toBe('Employee Relations');
            expect(await createCasePage.getCategoryTier2Value()).toBe('Compensation');
            expect(await createCasePage.getCategoryTier3Value()).toBe('Bonus');
            expect(await createCasePage.getAssigneeBusinessUnitValue()).toBe('Ericsson United States Support');
            expect(await createCasePage.getAssigneeGroupValue()).toBe('US Support 1');
            expect(await createCasePage.getAssigneeValue()).toBe('Rushton Willie');

            // verify negative scenario for categoryTier1 with Ericsson LOB
            expect(await createCasePage.isCategoryTier1DropDownValueDisplayed('Fixed Assets')).toBeFalsy('Fixed Assets CategoryTier1 drop down value displayed');
            expect(await createCasePage.isCategoryTier1DropDownValueDisplayed('Purchasing Card')).toBeFalsy('Purchasing Card CategoryTier1 drop down value displayed');

            await createCasePage.clickChangeAssignmentButton();
            // Verify negative scenario for Ericsson SAM LOB for change assignment
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'Asset Disposal')).toBeFalsy('Support Group is displayed');
            await changeAssignmentBladePo.clickOnCancelButton();

            await createCasePage.clickChangeAssignmentButton();
            await changeAssignmentBladePo.setAssignee('US Support 1', 'Rumsfeld Donald');
            expect(await createCasePage.getAssigneeValue()).toBe('Rumsfeld Donald');

            // Change verify with change LOB and should be clear all selected values
            await createCasePage.selectLineOfBusiness('Ericsson SAM');

            expect(await createCasePage.getCategoryTier1Value()).toBe('Select');
            expect(await createCasePage.getCategoryTier2Value()).toBe('Select');
            expect(await createCasePage.getCategoryTier3Value()).toBe('Select');

            expect(await createCasePage.getAssigneeBusinessUnitValue()).toBe('');
            expect(await createCasePage.getAssigneeBusinessUnitValue()).toBe('');
            expect(await createCasePage.getAssigneeValue()).toBe('Select');

            expect(await createCasePage.isCategoryTier1DropDownValueDisplayed('Employee Relations')).toBeFalsy('General Ledger CategoryTier1 drop down value missing');

            // Verify negative scenario for Ericsson HR LOB for change assignment
            await createCasePage.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'US Support 1')).toBeFalsy('Support Group is displayed');
            await changeAssignmentBladePo.clickOnCancelButton();
        });

        it('[12043]: Create case without case template', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.selectLineOfBusiness('Ericsson HR');
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('tted');
            await createCasePage.selectLineOfBusiness('Ericsson HR');
            await createCasePage.setSummary(summary);
            await createCasePage.selectCategoryTier1('Employee Relations');
            await createCasePage.selectCategoryTier2('Compensation');
            await createCasePage.selectCategoryTier3('Bonus');
            await createCasePage.clickChangeAssignmentButton();
            await changeAssignmentBladePo.setAssignee('US Support 1', 'Rumbold Richard');

            expect(await createCasePage.getCategoryTier1Value()).toBe('Employee Relations');
            expect(await createCasePage.getCategoryTier2Value()).toBe('Compensation');
            expect(await createCasePage.getCategoryTier3Value()).toBe('Bonus');
            expect(await createCasePage.getAssigneeBusinessUnitValue()).toBe('Ericsson United States Support');
            expect(await createCasePage.getAssigneeGroupValue()).toBe('US Support 1');
            expect(await createCasePage.getAssigneeValue()).toBe('Rumbold Richard');

            await createCasePage.clickSaveCaseButton();

            expect(await casePreviewPo.getLineOfBusinessValue()).toBe('Ericsson HR');
            await casePreviewPo.clickOncreateNewCaseButton();
        });

        it('[12043]: Create case with case template', async () => {
            await createCasePage.selectRequester('tted');
            expect(await createCasePage.getLineOfBusinessValue()).toBe('Ericsson HR');
            await createCasePage.setSummary(summary);

            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.clickOnAllTemplateTab();

            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalEricssonGlobalSAM.templateName)).toBeFalsy(`${caseTemplateDataGlobalEricssonGlobalSAM} caseTemplateDataGlobalEricssonGlobalSAM.templateName is missing`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalEricssonGlobalHR.templateName)).toBeTruthy(`${caseTemplateDataGlobalEricssonGlobalHR} caseTemplateDataGlobalEricssonGlobalHR.templateName is missing`);

            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataEricssonSAM.templateName)).toBeFalsy(`${caseTemplateDataEricssonSAM} caseTemplateDataEricssonSAM.templateName is missing`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalEricssonSAM.templateName)).toBeFalsy(`${caseTemplateDataGlobalEricssonSAM} caseTemplateDataGlobalEricssonSAM.templateName is missing`);

            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataEricssonHR.templateName)).toBeFalsy(`${caseTemplateDataEricssonHR} caseTemplateDataEricssonHR is missing`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalEricssonHR.templateName)).toBeTruthy(`${caseTemplateDataGlobalEricssonHR} caseTemplateDataGlobalEricssonHR is missing`);

            await selectCasetemplateBladePo.searchAndOpenCaseTemplate(caseTemplateDataGlobalEricssonHR.templateName);
            expect(await caseTemplatePreviewPo.isLabelTitleDisplayed('Case Summary')).toBeTruthy('Case Summary label is missing');
            await caseTemplatePreviewPo.clickOnBackButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateDataGlobalEricssonHR.templateName);

            expect(await createCasePage.getCategoryTier1Value()).toBe('Employee Relations');
            expect(await createCasePage.getCategoryTier2Value()).toBe('Compensation');
            expect(await createCasePage.getCategoryTier3Value()).toBe('Bonus');
            expect(await createCasePage.getAssigneeBusinessUnitValue()).toBe('Ericsson United States Support');
            expect(await createCasePage.getAssigneeGroupValue()).toBe('US Support 1');
            expect(await createCasePage.getAssigneeValue()).toBe('Rushton Willie');

            await createCasePage.clickChangeAssignmentButton();
            await changeAssignmentBladePo.setAssignee('US Support 1', 'Rumbold Richard');


            await createCasePage.clickSaveCaseButton();
            await casePreviewPo.clickGoToCaseButton();
            caseIdEricssonHR = await viewCasePage.getCaseID();
        });

        it('[12043]: Verify Edit Case Page', async () => {
            await viewCasePage.clickEditCaseButton();
            expect(await editCasePo.isLineOfBusinessReadOnly()).toBeTruthy('Line of business is not readonly');
            await editCasePo.updateCaseCategoryTier1('Total Rewards');
            await editCasePo.updateCaseCategoryTier2('Benefits');
            await editCasePo.updateCaseCategoryTier3('Beneficiaries');

            await editCasePo.clickOnChangeCaseTemplate();
            await selectCasetemplateBladePo.clickOnAllTemplateTab();
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalEricssonGlobalSAM.templateName)).toBeFalsy(`${caseTemplateDataGlobalEricssonGlobalSAM} caseTemplateDataGlobalEricssonGlobalSAM.templateName is missing`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalEricssonGlobalHR.templateName)).toBeTruthy(`${caseTemplateDataGlobalEricssonGlobalHR} caseTemplateDataGlobalEricssonGlobalHR.templateName is missing`);

            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataEricssonSAM.templateName)).toBeFalsy(`${caseTemplateDataEricssonSAM} caseTemplateDataEricssonSAM.templateName is missing`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalEricssonSAM.templateName)).toBeFalsy(`${caseTemplateDataGlobalEricssonSAM} caseTemplateDataGlobalEricssonSAM.templateName is missing`);

            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataEricssonHR.templateName)).toBeFalsy(`${caseTemplateDataEricssonHR} caseTemplateDataEricssonHR is missing`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalEricssonHR.templateName)).toBeTruthy(`${caseTemplateDataGlobalEricssonHR} caseTemplateDataGlobalEricssonHR is missing`);
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateDataGlobalEricssonGlobalHR.templateName);

            expect(await editCasePo.getCategoryTier1()).toBe('Workforce Administration');
            expect(await editCasePo.getCategoryTier2()).toBe('HR Operations');
            expect(await editCasePo.getCategoryTier3()).toBe('Adjustments');
            expect(await editCasePo.getAssigneeValue()).toBe('Rumbold Richard');

            await editCasePo.clickChangeAssignmentButton();
            await changeAssignmentBladePo.setAssignee('US Support 1', 'Rukeyser Louis');
            expect(await editCasePo.getAssigneeValue()).toBe('Rukeyser Louis');
            await editCasePo.clickChangeAssignmentButton();

            // Verify negative scenario for Ericsson SAM LOB for change assignment
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'Asset Disposal')).toBeFalsy('Support Group is displayed');
            await changeAssignmentBladePo.clickOnCancelButton();
            await editCasePo.clickSaveCase();

            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.clickAddAdhocTaskButton();
            await createAdhocTaskPo.setSummary('adhocTask')
            expect(await createAdhocTaskPo.getLineOfBussinessValue()).toBe('Ericsson HR');
            await createAdhocTaskPo.clickSaveAdhoctask();
            await manageTaskBladePo.clickCloseButton();
            await viewCasePage.clickOnTaskLink('adhocTask');
        });

        it('[12043]: create knowledge article and verify with Resources Tab', async () => {
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate('Reference');
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeTitle);
            await createKnowledgePage.selectKnowledgeSet(knowledgeSetDataEricssonHR.knowledgeSetTitle);
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await previewKnowledgePo.clickGoToArticleButton();
            await editKnowledgePo.setKnowledgeStatus('Draft');
            await editKnowledgePo.setKnowledgeStatus('Publish Approval');

            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseIdEricssonHR);

            await viewCasePage.clickOnTab('Resources');
            await resourcesTabPo.clickOnAdvancedSearchOptions();
            await resourcesTabPo.searchTextAndEnter(knowledgeTitle);
            await resourcesTabPo.searchTextAndEnter(knowledgeTitle);
            await expect(await resourcesTabPo.getAdvancedSearchResultForParticularSection(knowledgeTitle)).toEqual(knowledgeTitle);
            await expect(await resourcesTabPo.getAdvancedSearchResultForParticularSection(summary)).toEqual(summary);
        });

        it('[12043]: Create case With Ericsson SAM User and verify data', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.selectLineOfBusiness('Ericsson SAM');
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('tted');
            expect(await createCasePage.getLineOfBusinessValue()).toBe('Ericsson SAM');
            await createCasePage.setSummary(summary);
            expect(await createCasePage.isCategoryTier1DropDownValueDisplayed('Total Rewards')).toBeFalsy('General Ledger CategoryTier1 drop down value displayed');

            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.clickOnAllTemplateTab();
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalEricssonGlobalSAM.templateName)).toBeTruthy(`${caseTemplateDataGlobalEricssonGlobalSAM} caseTemplateDataGlobalEricssonGlobalSAM.templateName is missing`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalEricssonGlobalHR.templateName)).toBeFalsy(`${caseTemplateDataGlobalEricssonGlobalHR} caseTemplateDataGlobalEricssonGlobalHR.templateName is missing`);

            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataEricssonHR.templateName)).toBeFalsy(`${caseTemplateDataEricssonHR} caseTemplateDataEricssonHR is missing`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalEricssonHR.templateName)).toBeFalsy(`${caseTemplateDataGlobalEricssonHR} caseTemplateDataGlobalEricssonHR is missing`);

            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataEricssonSAM.templateName)).toBeFalsy(`${caseTemplateDataEricssonSAM} caseTemplateDataEricssonSAM.templateName is missing`);
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalEricssonSAM.templateName)).toBeTruthy(`${caseTemplateDataGlobalEricssonSAM} caseTemplateDataGlobalEricssonSAM.templateName is missing`);

            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateDataGlobalEricssonSAM.templateName);

            expect(await createCasePage.getCategoryTier1Value()).toBe('Purchasing Card');
            expect(await createCasePage.getCategoryTier2Value()).toBe('Auditing');
            expect(await createCasePage.getCategoryTier3Value()).toBe('Card Activity');
            expect(await createCasePage.getAssigneeValue()).toBe('Springsteen Bruce');

            await createCasePage.selectCategoryTier1('Fixed Assets');
            await createCasePage.selectCategoryTier2('Capitalization');

            await createCasePage.clickChangeAssignmentButton();
            await changeAssignmentBladePo.setAssignee('Asset Disposal', 'Spolsky Joel');

            // Verify negative scenario for Ericsson HR LOB for change assignment
            await createCasePage.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'US Support 1')).toBeFalsy('Support Group is displayed');
            await changeAssignmentBladePo.clickOnCancelButton();

            await createCasePage.clickSaveCaseButton();
            await casePreviewPo.clickGoToCaseButton();
            caseIdEricssonSAM = await viewCasePage.getCaseID();
        });

        it('[12043]: Verify Knowledge Article and case with Resources Tab', async () => {
            await viewCasePage.clickOnTab('Resources');
            await resourcesTabPo.clickOnAdvancedSearchOptions();
            await resourcesTabPo.searchTextAndEnter(knowledgeTitle);
            await browser.sleep(3000); // wait untile result gets reflect
            await expect(await resourcesTabPo.getAdvancedSearchResultForParticularSection(knowledgeTitle)).toEqual(undefined);
            await expect(await resourcesTabPo.getAdvancedSearchResultForParticularSection(summary)).toEqual(undefined);
        });

        it('[12043]: Verify case access between Ericsson HR and Ericsson SAM LOB', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            expect(await utilityGrid.isGridRecordPresent(caseIdEricssonSAM)).toBeTruthy('caseIdEricssonSAM Missing on grid');
            expect(await utilityGrid.isGridRecordPresent(caseIdEricssonHR)).toBeFalsy('caseIdEricssonHR Missing on grid');

            await utilityGrid.selectLineOfBusiness('Ericsson HR');
            await utilityGrid.clearFilter();
            expect(await utilityGrid.isGridRecordPresent(caseIdEricssonSAM)).toBeFalsy('caseIdEricssonSAM Missing on grid');
            expect(await utilityGrid.isGridRecordPresent(caseIdEricssonHR)).toBeTruthy('caseIdEricssonHR Missing on grid');
        });

        afterAll(async () => {
            await utilityCommon.closeAllBlades();
        });
    });

    //kiran
    describe('[12042]: [Ericsson Model][Quick Case]: Verify the behavior when the case agent is able to create a case when it has access to multiple LOB', () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateDataGlobalEricssonGlobalSAM, caseTemplateDataGlobalEricssonGlobalHR, knowledgeSetDataEricssonSAM, knowledgeSetDataEricssonHR, caseTemplateDataGlobalEricssonSAM, caseTemplateDataEricssonSAM, caseTemplateDataGlobalEricssonHR, caseTemplateDataEricssonHR, caseIdKingstoneHR, caseIdOracleHR;

        let caseSummaryEricssonHR = "1caseSummaryEricssonHR" + randomStr;
        let articleEricssonHR = "1articleEricssonHR" + randomStr;

        let caseSummaryEricssonSAM = "2caseSummarySamHR" + randomStr;
        let articleEricssonSAM = "2articleSamHR" + randomStr;

        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.associatePersonToCompany('sbruce', "Ericsson HR");

            // Create Data with Ericsson HR LOB
            await apiHelper.apiLogin(ericssonHRAndSamLOBUserName, password);
            caseTemplateDataGlobalEricssonHR = {
                "templateName": 'GlobalcaseTemplateNameEricssonHR' + randomStr,
                "templateSummary": 'GlobalCaseTemplateSummaryEricssonHR' + randomStr,
                "categoryTier1": 'Employee Relations',
                "categoryTier2": 'Compensation',
                "categoryTier3": 'Bonus',
                "casePriority": "Low",
                "templateStatus": "Active",
                "company": "- Global -",
                "ownerComapny": "Ericsson HR",
                "businessUnit": "Ericsson United States Support",
                "supportGroup": "US Support 1",
                "assignee": "rwillie",
                "ownerBU": "Ericsson United States Support",
                "ownerGroup": "US Support 1",
                "lineOfBusiness": "Ericsson HR"
            }
            await apiHelper.createCaseTemplate(caseTemplateDataGlobalEricssonHR);

            caseTemplateDataGlobalEricssonGlobalHR = {
                "templateName": 'GlobalcaseTemplateNameEricssonGlobalHR' + randomStr,
                "templateSummary": 'GlobalCaseTemplateSummaryEricssonGlobalHR' + randomStr,
                "categoryTier1": 'Employee Relations',
                "categoryTier2": 'Compensation',
                "categoryTier3": 'Bonus',
                "casePriority": "Low",
                "templateStatus": "Active",
                "company": "Ericsson Global",
                "ownerComapny": "Ericsson HR",
                "businessUnit": "Ericsson United States Support",
                "supportGroup": "US Support 1",
                "assignee": "rwillie",
                "ownerBU": "Ericsson United States Support",
                "ownerGroup": "US Support 1",
                "lineOfBusiness": "Ericsson HR"
            }
            await apiHelper.createCaseTemplate(caseTemplateDataGlobalEricssonGlobalHR);

            caseTemplateDataEricssonHR = {
                "templateName": 'CaseTemplateNameEricssonHR' + randomStr,
                "templateSummary": 'CaseTemplateNameEricssonHR' + randomStr,
                "categoryTier1": 'Workforce Administration',
                "categoryTier2": 'HR Operations',
                "categoryTier3": 'Adjustments',
                "casePriority": "High",
                "templateStatus": "Active",
                "company": "Ericsson HR",
                "ownerComapny": "Ericsson HR",
                "businessUnit": "Ericsson United States Support",
                "supportGroup": "US Support 1",
                "assignee": "rlouis",
                "ownerBU": "Ericsson United States Support",
                "ownerGroup": "US Support 1",
                "lineOfBusiness": "Ericsson HR"
            }
            await apiHelper.createCaseTemplate(caseTemplateDataEricssonHR);

            // Create case for Ericsson HR 
            let caseDataEricssonHR = {
                "Requester": "rwillie",
                "Summary": caseSummaryEricssonHR,
                "Assigned Company": "Ericsson HR",
                "Business Unit": "Ericsson United States Support",
                "Support Group": "US Support 1",
                "Assignee": "rlouis",
                "Line of Business": "Ericsson HR"
            };
            await apiHelper.createCase(caseDataEricssonHR);

            // Create data knowledge set for Ericsson HR 
            knowledgeSetDataEricssonHR = {
                'knowledgeSetTitle': 'KASetEricssonHR' + randomStr,
                'knowledgeSetDesc': 'EricssonHR_Desc' + randomStr,
                'company': 'Ericsson HR',
                "lineOfBusiness": "Ericsson HR"
            }
            await apiHelper.createKnowledgeSet(knowledgeSetDataEricssonHR);

            // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            // Create data with Ericsson SAM Data

            // Create data knowledge set for Ericsson SAM 
            knowledgeSetDataEricssonSAM = {
                'knowledgeSetTitle': 'KASetEricssonSAM' + randomStr,
                'knowledgeSetDesc': 'KAEricssonSAM_Desc' + randomStr,
                'company': 'Ericsson SAM',
                "lineOfBusiness": "Ericsson SAM"
            }
            await apiHelper.createKnowledgeSet(knowledgeSetDataEricssonSAM);

            caseTemplateDataGlobalEricssonSAM = {
                "templateName": 'GlobalcaseTemplateNameEricssonSAM' + randomStr,
                "templateSummary": 'GlobalCaseTemplateSummaryEricssonSAM' + randomStr,
                "categoryTier1": 'Purchasing Card',
                "categoryTier2": 'Auditing',
                "categoryTier3": 'Card Activity',
                "casePriority": "Low",
                "templateStatus": "Active",
                "company": "- Global -",
                "ownerComapny": "Ericsson SAM",
                "businessUnit": "Ericsson Asset Management - USA",
                "supportGroup": "Asset Disposal",
                "assignee": "sbruce",
                "ownerBU": "Ericsson Asset Management - USA",
                "ownerGroup": "Asset Disposal",
                "lineOfBusiness": "Ericsson SAM"
            }
            await apiHelper.createCaseTemplate(caseTemplateDataGlobalEricssonSAM);

            caseTemplateDataGlobalEricssonGlobalSAM = {
                "templateName": 'GlobalcaseTemplateNameEricssonGlobalSAM' + randomStr,
                "templateSummary": 'GlobalCaseTemplateSummaryEricssonGlobalSAM' + randomStr,
                "categoryTier1": 'Purchasing Card',
                "categoryTier2": 'Auditing',
                "categoryTier3": 'Card Activity',
                "casePriority": "Low",
                "templateStatus": "Active",
                "company": "Ericsson Global",
                "ownerComapny": "Ericsson SAM",
                "businessUnit": "Ericsson Asset Management - USA",
                "supportGroup": "Asset Disposal",
                "assignee": "sbruce",
                "ownerBU": "Ericsson Asset Management - USA",
                "ownerGroup": "Asset Disposal",
                "lineOfBusiness": "Ericsson SAM"
            }
            await apiHelper.createCaseTemplate(caseTemplateDataGlobalEricssonGlobalSAM);

            caseTemplateDataEricssonSAM = {
                "templateName": 'CaseTemplateNameEricssonSAM' + randomStr,
                "templateSummary": 'CaseTemplateNameEricssonSAM' + randomStr,
                "categoryTier1": 'Fixed Assets',
                "categoryTier2": 'Capitalization',
                "casePriority": "High",
                "templateStatus": "Active",
                "company": "Ericsson SAM",
                "ownerComapny": "Ericsson SAM",
                "businessUnit": "Ericsson Asset Management - USA",
                "supportGroup": "Asset Disposal",
                "assignee": "ssteven",
                "ownerBU": "Ericsson Asset Management - USA",
                "ownerGroup": "Asset Disposal",
                "lineOfBusiness": "Ericsson SAM"
            }
            await apiHelper.createCaseTemplate(caseTemplateDataEricssonSAM);

            // Create case for Ericsson HR 
            let caseDataEricssonSAM = {
                "Requester": "sjoel",
                "Summary": caseSummaryEricssonSAM,
                "Assigned Company": "Ericsson SAM",
                "Business Unit": "Ericsson Asset Management - USA",
                "Support Group": "Asset Disposal",
                "Assignee": "sbenjamin",
                "Line of Business": "Ericsson SAM"
            };
            await apiHelper.createCase(caseDataEricssonSAM);

        });

        it('[12042]: Create Article Data For Ericsson HR', async () => {
            //Create Knowledge Article Ericsson HR
            await navigationPage.gotoCaseConsole();
            await utilityGrid.selectLineOfBusiness('Ericsson HR');

            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate('Reference');
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField(articleEricssonHR);
            await createKnowledgePage.selectKnowledgeSet(knowledgeSetDataEricssonHR.knowledgeSetTitle);
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await previewKnowledgePo.clickGoToArticleButton();
            await editKnowledgePo.setKnowledgeStatus('Draft');
            await editKnowledgePo.setKnowledgeStatus('Publish Approval');
        });

        it('[12042]: Create Article Data For Ericsson SAM', async () => {
            //Create Knowledge Article Ericsson SAM
            await navigationPage.gotoCaseConsole();
            await utilityGrid.selectLineOfBusiness('Ericsson SAM');

            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate('Reference');
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField(articleEricssonSAM);
            await createKnowledgePage.selectKnowledgeSet(knowledgeSetDataEricssonSAM.knowledgeSetTitle);
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await previewKnowledgePo.clickGoToArticleButton();
            await editKnowledgePo.setKnowledgeStatus('Draft');
            await editKnowledgePo.setKnowledgeStatus('Publish Approval');
        });

        it('[12042]: Create Quick Case Negative scenario With Ericsson HR', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.selectLineOfBusiness('Ericsson HR');
            await navigationPage.gotoQuickCase();

            await quickCasePo.selectRequesterName('tted');
            await quickCasePo.setCaseSummary(caseSummaryEricssonSAM);
            expect(await resourcesTabPo.isRecommendedCasePresent(caseSummaryEricssonSAM)).toBeTruthy(`${caseSummaryEricssonSAM} caseSummaryEricssonSAM displayed in Recommended Knowledge`);
            await quickCasePo.clickStartOverButton();

            await quickCasePo.selectRequesterName('tted');
            await quickCasePo.setCaseSummary(caseTemplateDataGlobalEricssonGlobalSAM.templateName);
            expect(await resourcesTabPo.isRecommendedTemplatePresent(caseTemplateDataGlobalEricssonGlobalSAM.templateName)).toBeTruthy(`${caseTemplateDataGlobalEricssonGlobalSAM.templateName} caseTemplateDataGlobalEricssonGlobalSAM missing in Recommended Template Global`);
            await quickCasePo.clickStartOverButton();

            await quickCasePo.selectRequesterName('tted');
            await quickCasePo.setCaseSummary(caseTemplateDataGlobalEricssonSAM.templateName);
            expect(await resourcesTabPo.isRecommendedTemplatePresent(caseTemplateDataGlobalEricssonSAM.templateName)).toBeTruthy(`${caseTemplateDataGlobalEricssonSAM.templateName} caseTemplateDataGlobalEricssonSAM display in Recommended Knowledge`);
            await quickCasePo.clickStartOverButton();

            await quickCasePo.selectRequesterName('tted');
            await quickCasePo.setCaseSummary(articleEricssonSAM);
            expect(await resourcesTabPo.isRecommendedKnowledgePresent(articleEricssonSAM)).toBeTruthy(`${articleEricssonSAM} articleEricssonSAM missing in Recommended Knowledge`);
            await quickCasePo.clickStartOverButton();

            await quickCasePo.selectRequesterName('tted');
            await quickCasePo.setCaseSummary(caseTemplateDataEricssonSAM.templateName);
            expect(await resourcesTabPo.isRecommendedTemplatePresent(caseTemplateDataEricssonSAM.templateName)).toBeFalsy(`${caseTemplateDataEricssonSAM.templateName} caseTemplateDataEricssonSAM display in Recommended Knowledge`);
            await quickCasePo.clickStartOverButton();


        });

        it('[12042]: Create Quick Case without template and verify Ericsson HR in recommended data', async () => {
            await quickCasePo.selectRequesterName('tted');
            await quickCasePo.setCaseSummary(caseSummaryEricssonHR);
            expect(await resourcesTabPo.isRecommendedCasePresent(caseSummaryEricssonHR)).toBeTruthy(`${caseSummaryEricssonHR} caseSummaryEricssonHR displayed in Recommended Knowledge`);
            await quickCasePo.clickStartOverButton();

            await quickCasePo.selectRequesterName('tted');
            await quickCasePo.setCaseSummary(caseTemplateDataGlobalEricssonGlobalHR.templateName);
            expect(await resourcesTabPo.isRecommendedTemplatePresent(caseTemplateDataGlobalEricssonGlobalHR.templateName)).toBeTruthy(`${caseTemplateDataGlobalEricssonGlobalHR.templateName} caseTemplateDataGlobalEricssonGlobalHR missing in Recommended Template Global`);
            await quickCasePo.clickStartOverButton();

            await quickCasePo.selectRequesterName('tted');
            await quickCasePo.setCaseSummary(articleEricssonHR);
            await quickCasePo.clickStartOverButton();
            await quickCasePo.selectRequesterName('tted');
            await quickCasePo.setCaseSummary(articleEricssonHR);
            expect(await resourcesTabPo.isRecommendedKnowledgePresent(articleEricssonHR)).toBeTruthy(`${articleEricssonHR} articleKingstoneHR1 displayed in Recommended Knowledge`);
            await quickCasePo.clickStartOverButton();

            await quickCasePo.selectRequesterName('tted');
            await quickCasePo.setCaseSummary(caseTemplateDataGlobalEricssonHR.templateName);
            expect(await resourcesTabPo.isRecommendedTemplatePresent(caseTemplateDataGlobalEricssonHR.templateName)).toBeTruthy(`${caseTemplateDataGlobalEricssonHR.templateName} caseTemplateDataGlobalEricssonHR.templateName displayed in Recommended Template`);
            await quickCasePo.clickStartOverButton();

            await quickCasePo.selectRequesterName('tted');
            await quickCasePo.setCaseSummary(caseTemplateDataEricssonHR.templateName);
            expect(await resourcesTabPo.isRecommendedTemplatePresent(caseTemplateDataEricssonHR.templateName)).toBeFalsy(`${caseTemplateDataEricssonHR.templateName} caseTemplateDataEricssonHR.templateName displayed in Recommended Template`);
            await quickCasePo.clickStartOverButton();

        });

        it('[12042]: Create Quick Case without case template', async () => {
            await quickCasePo.clickStartOverButton();
            await quickCasePo.selectRequesterName('tted');
            await quickCasePo.setCaseSummary(caseSummaryEricssonHR);
            await quickCasePo.saveCase();
            expect(await casePreviewPo.getLineOfBusinessValue()).toBe('Ericsson HR');
            await casePreviewPo.clickOncreateNewCaseButton();
        });

        it('[12042]: Create Quick Case with case template', async () => {
            await quickCasePo.selectRequesterName('rwillie');
            await quickCasePo.selectCaseTemplate(caseTemplateDataEricssonHR.templateName);
            await quickCasePo.saveCase();
            await casePreviewPo.clickGoToCaseButton();
        });

        it('[12042]: Verify Edit Case Page', async () => {
            await viewCasePage.clickEditCaseButton();
            expect(await editCasePo.isLineOfBusinessReadOnly()).toBeTruthy('Line of business is not readonly');
            expect(await editCasePo.getLobValue()).toBe('Ericsson HR');

            expect(await editCasePo.getCategoryTier1()).toBe('Workforce Administration');
            expect(await editCasePo.getCategoryTier2()).toBe('HR Operations');
            expect(await editCasePo.getCategoryTier3()).toBe('Adjustments');

            expect(await editCasePo.getAssigneeValue()).toBe('Rukeyser Louis');

            await editCasePo.updateCaseCategoryTier1('Total Rewards');
            await editCasePo.updateCaseCategoryTier2('Benefits');
            await editCasePo.updateCaseCategoryTier3('Beneficiaries');

            await editCasePo.clickOnChangeCaseTemplate();
            await selectCasetemplateBladePo.clickOnAllTemplateTab();
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalEricssonSAM.templateName)).toBeFalsy('caseTemplateDataGlobalOracleHR is display');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataEricssonSAM.templateName)).toBeFalsy('caseTemplateDataGlobalOracleHR is display');

            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataEricssonHR.templateName)).toBeTruthy('caseTemplateDataKingstoneHR is missing');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalEricssonHR.templateName)).toBeTruthy('caseTemplateDataGlobalKingstonHR is missing');

            await selectCasetemplateBladePo.searchAndOpenCaseTemplate(caseTemplateDataGlobalEricssonHR.templateName);
            expect(await caseTemplatePreviewPo.isLabelTitleDisplayed('Case Summary')).toBeTruthy('Case Summary label is missing');
            await caseTemplatePreviewPo.clickOnBackButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateDataGlobalEricssonHR.templateName);

            expect(await editCasePo.getCategoryTier1()).toBe('Employee Relations');
            expect(await editCasePo.getCategoryTier2()).toBe('Compensation');
            expect(await editCasePo.getCategoryTier3()).toBe('Bonus');
            expect(await editCasePo.getAssigneeValue()).toBe('Rushton Willie');

            await editCasePo.clickChangeAssignmentButton();
            await changeAssignmentBladePo.setAssignee('US Support 1', 'Rumsfeld Donald');
            expect(await editCasePo.getAssigneeValue()).toBe('Rumsfeld Donald');

            // Verify CategorTIer of Ericsson SAM LOB which don't have access to Ericsson HR
            expect(await editCasePo.isValuePresentInCategoryTier1('Purchasing Card')).toBeFalsy('Purchasing Card CategoryTier1 drop down value displayed');
            expect(await editCasePo.isValuePresentInCategoryTier1('Fixed Assets')).toBeFalsy('Fixed Assets CategoryTier1 drop down value displayed');

            // Verify negative scenario for Ericsson SAM LOB for change assignment
            await editCasePo.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'Asset Disposal')).toBeFalsy('SG is displayed');
            await changeAssignmentBladePo.clickOnCancelButton();
            await editCasePo.clickSaveCase();
        });

        it('[12042]: Verify Adhoc Task With Ericsson HR', async () => {
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.clickAddAdhocTaskButton();
            await createAdhocTaskPo.setSummary('adhocTask')
            expect(await createAdhocTaskPo.getLineOfBussinessValue()).toBe('Ericsson HR');
            await createAdhocTaskPo.clickSaveAdhoctask();
            await manageTaskBladePo.clickCloseButton();
            await viewCasePage.clickOnTaskLink('adhocTask');
        });

        it('[12042]: Create Quick Case without case template with Ericson HR Requester', async () => {
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('rwillie');
            await quickCasePo.setCaseSummary('DRDMV23665TestCaseSummaryEricssonHR');
            await quickCasePo.saveCase();
            expect(await casePreviewPo.getLineOfBusinessValue()).toBe('Ericsson HR');
            await casePreviewPo.clickGoToCaseButton();
        });

        it('[12042]: Verify Edit Case Page with Ericson HR', async () => {
            await viewCasePage.clickEditCaseButton();
            expect(await editCasePo.isLineOfBusinessReadOnly()).toBeTruthy('Line of business is not readonly');
            expect(await editCasePo.getLobValue()).toBe('Ericsson HR');

            await editCasePo.updateCaseCategoryTier1('Total Rewards');
            await editCasePo.updateCaseCategoryTier2('Benefits');
            await editCasePo.updateCaseCategoryTier3('Beneficiaries');

            await editCasePo.clickChangeAssignmentButton();
            await changeAssignmentBladePo.setAssignee('US Support 1', 'Rumsfeld Donald');

            expect(await editCasePo.getCategoryTier1()).toBe('Total Rewards');
            expect(await editCasePo.getCategoryTier2()).toBe('Benefits');
            expect(await editCasePo.getCategoryTier3()).toBe('Beneficiaries');
            expect(await editCasePo.getAssigneeValue()).toBe('Rumsfeld Donald');

            // Verify CategorTIer of Ericsson SAM LOB which don't have access to Ericsson HR
            expect(await editCasePo.isValuePresentInCategoryTier1('Purchasing Card')).toBeFalsy('Purchasing Card CategoryTier1 drop down value displayed');
            expect(await editCasePo.isValuePresentInCategoryTier1('Fixed Assets')).toBeFalsy('Fixed Assets CategoryTier1 drop down value displayed');

            // Verify negative scenario for Ericsson SAM LOB for change assignment
            await editCasePo.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'Asset Disposal')).toBeFalsy('SG is displayed');
            await changeAssignmentBladePo.clickOnCancelButton();
            await editCasePo.clickSaveCase();
        });

        it('[12042]: Create Quick Case scenario With Ericsson SAM', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.selectLineOfBusiness('Ericsson SAM');
            await navigationPage.gotoQuickCase();

            await quickCasePo.selectRequesterName('tted');
            await quickCasePo.setCaseSummary(caseSummaryEricssonHR);
            expect(await resourcesTabPo.isRecommendedCasePresent(caseSummaryEricssonHR)).toBeTruthy(`${caseSummaryEricssonHR} caseSummaryEricssonHR displayed in Recommended Knowledge`);
            await quickCasePo.clickStartOverButton();

            await quickCasePo.selectRequesterName('tted');
            await quickCasePo.setCaseSummary(caseTemplateDataGlobalEricssonGlobalHR.templateName);
            expect(await resourcesTabPo.isRecommendedTemplatePresent(caseTemplateDataGlobalEricssonGlobalHR.templateName)).toBeTruthy(`${caseTemplateDataGlobalEricssonGlobalHR.templateName} caseTemplateDataGlobalEricssonGlobalHR missing in Recommended Template Global`);
            await quickCasePo.clickStartOverButton();

            await quickCasePo.selectRequesterName('tted');
            await quickCasePo.setCaseSummary(caseTemplateDataGlobalEricssonHR.templateName);
            expect(await resourcesTabPo.isRecommendedTemplatePresent(caseTemplateDataGlobalEricssonHR.templateName)).toBeTruthy(`${caseTemplateDataGlobalEricssonHR.templateName} caseTemplateDataGlobalEricssonHR missing in Recommended Knowledge`);
            await quickCasePo.clickStartOverButton();

            await quickCasePo.selectRequesterName('tted');
            await quickCasePo.setCaseSummary(articleEricssonHR);
            expect(await resourcesTabPo.isRecommendedKnowledgePresent(articleEricssonHR)).toBeTruthy(`${articleEricssonHR} articleEricssonHR displayed in Recommended Knowledge`);
            await quickCasePo.clickStartOverButton();

            await quickCasePo.selectRequesterName('tted');
            await quickCasePo.setCaseSummary(caseTemplateDataEricssonHR.templateName);
            expect(await resourcesTabPo.isRecommendedTemplatePresent(caseTemplateDataEricssonHR.templateName)).toBeFalsy(`${caseTemplateDataEricssonHR.templateName} caseTemplateDataEricssonHR missing in Recommended Knowledge`);
            await quickCasePo.clickStartOverButton();

        });

        it('[12042]: Create Quick Case without template and verify Ericsson SAM in recommended data ', async () => {
            await quickCasePo.selectRequesterName('tted');
            await quickCasePo.setCaseSummary(caseSummaryEricssonSAM);
            expect(await resourcesTabPo.isRecommendedCasePresent(caseSummaryEricssonSAM)).toBeTruthy(`${caseSummaryEricssonSAM} caseSummaryEricssonSAM displayed in Recommended Knowledge`);
            await quickCasePo.clickStartOverButton();

            await quickCasePo.selectRequesterName('tted');
            await quickCasePo.setCaseSummary(caseTemplateDataGlobalEricssonGlobalSAM.templateName);
            expect(await resourcesTabPo.isRecommendedTemplatePresent(caseTemplateDataGlobalEricssonGlobalSAM.templateName)).toBeTruthy(`${caseTemplateDataGlobalEricssonGlobalSAM.templateName} caseTemplateDataGlobalEricssonGlobalSAM missing in Recommended Template Global`);
            await quickCasePo.clickStartOverButton();

            await quickCasePo.selectRequesterName('tted');
            await quickCasePo.setCaseSummary(caseTemplateDataEricssonSAM.templateName);
            expect(await resourcesTabPo.isRecommendedTemplatePresent(caseTemplateDataEricssonSAM.templateName)).toBeFalsy(`${caseTemplateDataEricssonSAM.templateName} caseTemplateDataEricssonSAM.templateName displayed in Recommended Knowledge`);
            await quickCasePo.clickStartOverButton();

            await quickCasePo.selectRequesterName('tted');
            await quickCasePo.setCaseSummary(caseTemplateDataGlobalEricssonSAM.templateName);
            expect(await resourcesTabPo.isRecommendedTemplatePresent(caseTemplateDataGlobalEricssonSAM.templateName)).toBeTruthy(`${caseTemplateDataGlobalEricssonSAM.templateName} caseTemplateDataGlobalEricssonSAM.templateName displayed in Recommended Knowledge`);
            await quickCasePo.clickStartOverButton();

            await quickCasePo.selectRequesterName('tted');
            await quickCasePo.setCaseSummary(articleEricssonSAM);
            expect(await resourcesTabPo.isRecommendedKnowledgePresent(articleEricssonSAM)).toBeTruthy(`${articleEricssonSAM} articleEricssonSAM displayed in Recommended Knowledge`);
            await quickCasePo.clickStartOverButton();

            await quickCasePo.clickStartOverButton();
            await quickCasePo.selectRequesterName('tted');
            await quickCasePo.setCaseSummary(caseSummaryEricssonSAM);
            await quickCasePo.saveCase();
            expect(await casePreviewPo.getLineOfBusinessValue()).toBe('Ericsson HR');
            await casePreviewPo.clickOncreateNewCaseButton();
        });

        it('[12042]: Create Quick Case with case template Ericsson SAM', async () => {
            await quickCasePo.selectRequesterName('sbenjamin');
            await quickCasePo.selectCaseTemplate(caseTemplateDataEricssonSAM.templateName);
            await quickCasePo.saveCase();
            await casePreviewPo.clickGoToCaseButton();
        });

        it('[12042]: Verify Edit Case Page for Ericsson SAM', async () => {
            await viewCasePage.clickEditCaseButton();
            expect(await editCasePo.isLineOfBusinessReadOnly()).toBeTruthy('Line of business is not readonly');
            expect(await editCasePo.getLobValue()).toBe('Ericsson SAM');

            expect(await editCasePo.getCategoryTier1()).toBe('Fixed Assets');
            expect(await editCasePo.getCategoryTier2()).toBe('Capitalization');
            expect(await editCasePo.getAssigneeValue()).toBe('Spielberg Steven');

            await editCasePo.updateCaseCategoryTier1('Facilities');
            await editCasePo.updateCaseCategoryTier2('Catering');
            await editCasePo.updateCaseCategoryTier3('General');

            await editCasePo.clickOnChangeCaseTemplate();
            await selectCasetemplateBladePo.clickOnAllTemplateTab();

            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataEricssonHR.templateName)).toBeFalsy('caseTemplateDataKingstoneHR is missing');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalEricssonHR.templateName)).toBeFalsy('caseTemplateDataGlobalKingstonHR is missing');

            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataGlobalEricssonSAM.templateName)).toBeTruthy('caseTemplateDataGlobalOracleHR is display');
            expect(await utilityGrid.isGridRecordPresent(caseTemplateDataEricssonSAM.templateName)).toBeTruthy('caseTemplateDataGlobalOracleHR is display');

            await selectCasetemplateBladePo.searchAndOpenCaseTemplate(caseTemplateDataEricssonSAM.templateName);
            expect(await caseTemplatePreviewPo.isLabelTitleDisplayed('Case Summary')).toBeTruthy('Case Summary label is missing');
            await caseTemplatePreviewPo.clickOnBackButton();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateDataGlobalEricssonSAM.templateName);

            expect(await editCasePo.getCategoryTier1()).toBe('Purchasing Card');
            expect(await editCasePo.getCategoryTier2()).toBe('Auditing');
            expect(await editCasePo.getAssigneeValue()).toBe('Springsteen Bruce');

            await editCasePo.clickChangeAssignmentButton();

            await changeAssignmentBladePo.setAssignee('Asset Disposal', 'Spielberg Steven');
            expect(await editCasePo.getAssigneeValue()).toBe('Spielberg Steven');


            // Verify CategorTIer of Ericsson SAM LOB which don't have access to Ericsson HR
            expect(await editCasePo.isValuePresentInCategoryTier1('Employee Relations')).toBeFalsy('Employee Relations CategoryTier1 drop down value displayed');
            expect(await editCasePo.isValuePresentInCategoryTier1('Total Rewards')).toBeFalsy('Total Rewards CategoryTier1 drop down value displayed');

            // Verify negative scenario for Ericsson SAM LOB for change assignment
            await editCasePo.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'US Support 1')).toBeFalsy('SG is displayed');
            await changeAssignmentBladePo.clickOnCancelButton();
            await editCasePo.clickSaveCase();
        });

        it('[12042]: Verify Edit Case Page for Ericsson SAM', async () => {
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.clickAddAdhocTaskButton();
            await createAdhocTaskPo.setSummary('adhocTask2')
            expect(await createAdhocTaskPo.getLineOfBussinessValue()).toBe('Ericsson SAM');
            await createAdhocTaskPo.clickSaveAdhoctask();
            await manageTaskBladePo.clickCloseButton();
            await viewCasePage.clickOnTaskLink('adhocTask2');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
        });
    });

    describe('[60196]: [Ericsson Model] [Knowledge] Verify the Knowledge Article Creation with respect to Line of Business when user has access to single Line of Business', () => {
        let randomStr = [...Array(7)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let knowledgeSetDataEricssonHR, knowledgeSetDataEricssonSAM, articleId, knowledgeArticleDataDiffLOB, knowledgeArticleTemplateDataHR, knowledgeArticleTemplateDataSAM, knowledgeSetDataEricssonGlobal, knowledgeArticleTemplateDataGlobal, knowledgeArticleDataDiffLOBGlobal;

        beforeAll(async () => {
            knowledgeArticleTemplateDataHR = {
                templateName: `tname HR ${randomStr}`,
                sectionTitle: "articleSection",
                lineOfBusiness: "Ericsson HR"
            }

            knowledgeArticleTemplateDataSAM = {
                templateName: `tname HR ${randomStr}`,
                sectionTitle: "articleSection",
                lineOfBusiness: "Ericsson SAM"
            }

            knowledgeArticleTemplateDataGlobal = {
                templateName: `tname Global ${randomStr}`,
                sectionTitle: "articleSection",
                lineOfBusiness: "Ericsson Global"
            }

            knowledgeSetDataEricssonHR = {
                knowledgeSetTitle: `60196 ER HR ${randomStr}`,
                knowledgeSetDesc: `${randomStr}_Desc_ER_HR`,
                company: 'Ericsson HR',
                lineOfBusiness: 'Ericsson HR',
            }

            knowledgeSetDataEricssonSAM = {
                knowledgeSetTitle: `60196 ER SAM ${randomStr}`,
                knowledgeSetDesc: `${randomStr}_Desc_ER_SAM`,
                company: 'Ericsson SAM',
                lineOfBusiness: 'Ericsson SAM'
            }

            knowledgeSetDataEricssonGlobal = {
                knowledgeSetTitle: `60196 Global SAM ${randomStr}`,
                knowledgeSetDesc: `${randomStr}_Desc_ER_Global`,
                company: 'Ericsson Global',
                lineOfBusiness: 'Ericsson Global'
            }

            knowledgeArticleDataDiffLOBGlobal = {
                "knowledgeSet": `${knowledgeSetDataEricssonGlobal.knowledgeSetTitle}`,
                "title": `${randomStr} title Diff LOB`,
                "templateId": "AGGAA5V0HGVMIAOK04TZO94MC355RA",
                "assignee": "Smith",
                "lineOfBusiness": "Ericsson SAM"
            }

            knowledgeArticleDataDiffLOB = {
                "knowledgeSet": `${knowledgeSetDataEricssonSAM.knowledgeSetTitle}`,
                "title": `${randomStr} title Diff LOB`,
                "templateId": "AGGAA5V0HGVMIAOK04TZO94MC355RA",
                "assignedCompany": "Ericsson SAM",
                "assigneeBusinessUnit": "Ericsson Asset Management - India",
                "assigneeSupportGroup": "New Asset Management",
                "assignee": "Smith",
                "lineOfBusiness": "Ericsson SAM"
            }

            await apiHelper.apiLogin('tadmin');
            await apiHelper.createKnowledgeArticleTemplate(knowledgeArticleTemplateDataHR);
            await apiHelper.createKnowledgeArticleTemplate(knowledgeArticleTemplateDataSAM);
            await apiHelper.createKnowledgeArticleTemplate(knowledgeArticleTemplateDataGlobal);
            await apiHelper.createKnowledgeSet(knowledgeSetDataEricssonHR);
            await apiHelper.createKnowledgeSet(knowledgeSetDataEricssonSAM);
            await apiHelper.createKnowledgeSet(knowledgeSetDataEricssonGlobal);
            await apiHelper.createKnowledgeArticle(knowledgeArticleDataDiffLOB);
            await apiHelper.createKnowledgeArticle(knowledgeArticleDataDiffLOBGlobal);
        });

        it('[60196]: [Ericsson Model] [Knowledge] Verify the Knowledge Article Creation with respect to Line of Business when user has access to single Line of Business', async () => {
            await navigationPage.signOut();
            await loginPage.login('rwillie');
            await navigationPage.gotoCreateKnowledge();
            expect(await createKnowledgePage.isTemplatePresent(knowledgeArticleTemplateDataHR.templateName)).toBeTruthy('Template is not present');
            expect(await createKnowledgePage.isTemplatePresent(knowledgeArticleTemplateDataSAM.templateName)).toBeFalsy('Template is present');
            expect(await createKnowledgePage.isTemplatePresent(knowledgeArticleTemplateDataGlobal.templateName)).toBeFalsy('Template is present');
            await createKnowledgePage.clickOnTemplate('Reference');
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            expect(await createKnowledgePage.getValueOfLineOFBusiness()).toBe('Ericsson HR');
            expect(await createKnowledgePage.isLineOfBusinessDisable()).toBeTruthy();
            expect(await createKnowledgePage.isValuePresentInDropdown('Knowledge Set', knowledgeSetDataEricssonHR.knowledgeSetTitle)).toBeTruthy('Failure: Knowledge Set is missing');
            expect(await createKnowledgePage.isValuePresentInDropdown('Knowledge Set', knowledgeSetDataEricssonSAM.knowledgeSetTitle)).toBeFalsy('Failure: Knowledge Set is available');
            expect(await createKnowledgePage.isValuePresentInDropdown('Knowledge Set', knowledgeSetDataEricssonGlobal.knowledgeSetTitle)).toBeFalsy('Failure: Knowledge Set is available');

            expect(await createKnowledgePage.isValuePresentInDropdown('Category Tier 1', 'Applications')).toBeTruthy('Failure: Operational Category 1 is missing');
            expect(await createKnowledgePage.isValuePresentInDropdown('Category Tier 1', 'Facilties')).toBeFalsy('Failure: Operational Category 1 is present');

            await createKnowledgePage.addTextInKnowlegeTitleField(`DRDMV23636 Title ${randomStr}`);
            await createKnowledgePage.selectKnowledgeSet(knowledgeSetDataEricssonHR.knowledgeSetTitle);
            await createKnowledgePage.selectCategoryTier1Option('Applications');

            //Validating Assignment fields
            await createKnowledgePage.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'EricssonCo HR')).toBeTruthy();
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'EricssonCo SAM')).toBeFalsy();
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'US Support 2');
            expect(await changeAssignmentBladePo.isPersonAvailableOnAssignBlade(`${userData3.firstName} ${userData3.lastName}`)).toBeTruthy('User is not present on Assignment blade');
            expect(await changeAssignmentBladePo.isPersonAvailableOnAssignBlade(`${userData4.firstName} ${userData4.lastName}`)).toBeTruthy('User is present on Assignment blade');
            await changeAssignmentBladePo.clickOnCancelButton();

            //Saving the Article
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await previewKnowledgePo.clickGoToArticleButton();
            articleId = await viewKnowledgeArticlePo.getKnowledgeArticleId();
        });

        it('[60196]: [Ericsson Model] [Knowledge] Verify the Knowledge Article Creation with respect to Line of Business when user has access to single Line of Business', async () => {
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            expect(await editKnowledgePo.getLineOfBusinessValue()).toBe('Ericsson HR');
            expect(await editKnowledgePo.isLobSectionEnabled()).toBeTruthy();
            await editKnowledgePo.cancelKnowledgeMedataDataChanges();
            await viewKnowledgeArticlePo.clickEditKnowledgeAccess();
            await accessTabPo.clickToExpandAccessEntitiySearch('Support Group Access', 'Knowledge');
            expect(await accessTabPo.isValuePresentInDropdown('Support Group', 'Petramco HR')).toBeTruthy();
            expect(await accessTabPo.isValuePresentInDropdown('Support Group', 'Petramco Facilities')).toBeFalsy();

            await accessTabPo.clickToExpandAccessEntitiySearch('Agent Access', 'Knowledge');
            expect(await accessTabPo.isAgentPresent(userData3.firstName)).toBeTruthy('User is not Present');
            expect(await accessTabPo.isAgentPresent(userData4.firstName)).toBeFalsy('User is Present');
            await accessTabPo.clickCloseKnowledgeAccessBlade();

            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            expect(await createKnowledgePage.isValuePresentInDropdown('Category Tier 1', 'Applications')).toBeTruthy('Failure: Operational Category 1 is missing');
            expect(await createKnowledgePage.isValuePresentInDropdown('Category Tier 1', 'Facilties')).toBeFalsy('Failure: Operational Category 1 is present');
            await editKnowledgePo.setCategoryTier1('Total Rewards');
            await editKnowledgePo.saveKnowledgeMedataDataChanges();
            expect(await viewKnowledgeArticlePo.getCategoryTier1Value()).toBe('Total Rewards');

            await editKnowledgePo.setKnowledgeStatus('Draft');
            await editKnowledgePo.setKnowledgeStatusWithoutSave('SME Review');
            await statusBladeKnowledgeArticlePo.clickChangeReviewerBtn();
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'EricssonCo HR')).toBeTruthy();
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'EricssonCo SAM')).toBeFalsy();
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'US Support 2');
            expect(await changeAssignmentBladePo.isPersonAvailableOnAssignBlade(`${userData3.firstName} ${userData3.lastName}`)).toBeTruthy('User is not present on Assignment blade');
            expect(await changeAssignmentBladePo.isPersonAvailableOnAssignBlade(`${userData4.firstName} ${userData4.lastName}`)).toBeTruthy('User is present on Assignment blade');
            await changeAssignmentBladePo.clickOnCancelButton();

            await navigationPage.gotoKnowledgeConsole();
            expect(await utilityGrid.isGridRecordPresent(knowledgeArticleDataDiffLOB.title)).toBeFalsy('Record is present');
            expect(await utilityGrid.isGridRecordPresent(knowledgeArticleDataDiffLOBGlobal.title)).toBeFalsy('Record is present');

            await navigationPage.signOut();
            await loginPage.login('sbruce');
            await navigationPage.gotoKnowledgeConsole();
            expect(await utilityGrid.isGridRecordPresent(articleId)).toBeFalsy(articleId + ' Record is present');
        });

        it('[60196]: [Ericsson Model] [Knowledge] Verify the Knowledge Article Creation with respect to Line of Business when user has access to single Line of Business', async () => {
            await editKnowledgePo.setKnowledgeStatus('Draft');
            await editKnowledgePo.setKnowledgeStatusWithoutSave('SME Review');
            await statusBladeKnowledgeArticlePo.clickChangeReviewerBtn();
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'EricssonCo HR')).toBeTruthy();
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'EricssonCo SAM')).toBeFalsy();
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'US Support 2');
            expect(await changeAssignmentBladePo.isPersonAvailableOnAssignBlade(`${userData3.firstName} ${userData3.lastName}`)).toBeTruthy('User is not present on Assignment blade');
            expect(await changeAssignmentBladePo.isPersonAvailableOnAssignBlade(`${userData4.firstName} ${userData4.lastName}`)).toBeTruthy('User is present on Assignment blade');
            await changeAssignmentBladePo.clickOnCancelButton();

            await navigationPage.gotoKnowledgeConsole();
            expect(await utilityGrid.isGridRecordPresent(knowledgeArticleDataDiffLOB.title)).toBeFalsy('Record is present');

            await navigationPage.signOut();
            await loginPage.login('sbruce');
            await navigationPage.gotoKnowledgeConsole();
            expect(await utilityGrid.isGridRecordPresent(articleId)).toBeFalsy(articleId + ' Record is present');
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('rwillie');
        });
    });

    describe('[12041]: [Ericsson Model] [Knowledge] Verify the Knowledge Article Creation with respect to Line of Business when user has access to multiple Line of Business', () => {
        let randomStr = [...Array(7)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let knowledgeSetDataEricssonHR, knowledgeSetDataEricssonSAM, articleId, knowledgeArticleDataDiffLOB, knowledgeArticleTemplateDataHR, knowledgeArticleTemplateDataSAM, knowledgeArticleTemplateDataGlobal, knowledgeSetDataEricssonGlobal, knowledgeArticleDataDiffLOBGlobal;

        beforeAll(async () => {
            knowledgeArticleTemplateDataHR = {
                templateName: `tname HR ${randomStr}`,
                sectionTitle: "articleSection",
                lineOfBusiness: "Ericsson HR"
            }

            knowledgeArticleTemplateDataSAM = {
                templateName: `tname HR ${randomStr}`,
                sectionTitle: "articleSection",
                lineOfBusiness: "Ericsson SAM"
            }

            knowledgeArticleTemplateDataGlobal = {
                templateName: `tname Global ${randomStr}`,
                sectionTitle: "articleSection",
                lineOfBusiness: "Ericsson Global"
            }

            knowledgeSetDataEricssonHR = {
                knowledgeSetTitle: `60196 ER HR ${randomStr}`,
                knowledgeSetDesc: `${randomStr}_Desc_ER_HR`,
                company: 'Ericsson HR',
                lineOfBusiness: 'Ericsson HR'
            }

            knowledgeSetDataEricssonSAM = {
                knowledgeSetTitle: `60196 ER SAM ${randomStr}`,
                knowledgeSetDesc: `${randomStr}_Desc_ER_SAM`,
                company: 'Ericsson SAM',
                lineOfBusiness: 'Ericsson SAM'
            }

            knowledgeSetDataEricssonGlobal = {
                knowledgeSetTitle: `60196 Global SAM ${randomStr}`,
                knowledgeSetDesc: `${randomStr}_Desc_ER_Global`,
                company: 'Ericsson Global',
                lineOfBusiness: 'Ericsson Global'
            }

            knowledgeArticleDataDiffLOBGlobal = {
                "knowledgeSet": `${knowledgeSetDataEricssonGlobal.knowledgeSetTitle} 1`,
                "title": `${randomStr} title Diff LOB`,
                "templateId": "AGGAA5V0HGVMIAOK04TZO94MC355RA",
                "assignee": "Smith",
                "lineOfBusiness": "Ericsson SAM"
            }

            knowledgeArticleDataDiffLOB = {
                "knowledgeSet": `${knowledgeSetDataEricssonSAM.knowledgeSetTitle}`,
                "title": `${randomStr} title Diff LOB`,
                "templateId": "AGGAA5V0HGVMIAOK04TZO94MC355RA",
                "assignedCompany": "Ericsson SAM",
                "assigneeBusinessUnit": "Ericsson Asset Management - India",
                "assigneeSupportGroup": "New Asset Management",
                "assignee": "Smith",
                "lineOfBusiness": "Ericsson SAM"
            }

            await apiHelper.apiLogin('tadmin');
            await apiHelper.createKnowledgeArticleTemplate(knowledgeArticleTemplateDataHR);
            await apiHelper.createKnowledgeArticleTemplate(knowledgeArticleTemplateDataSAM);
            await apiHelper.createKnowledgeArticleTemplate(knowledgeArticleTemplateDataGlobal);
            await apiHelper.createKnowledgeSet(knowledgeSetDataEricssonHR);
            await apiHelper.createKnowledgeSet(knowledgeSetDataEricssonSAM);
            await apiHelper.createKnowledgeSet(knowledgeSetDataEricssonGlobal);
            await apiHelper.createKnowledgeArticle(knowledgeArticleDataDiffLOB);
            await apiHelper.createKnowledgeArticle(knowledgeArticleDataDiffLOBGlobal);
        });

        it('[12041]: [Ericsson Model] [Knowledge] Verify the Knowledge Article Creation with respect to Line of Business when user has access to multiple Line of Business', async () => {
            await navigationPage.signOut();
            await loginPage.login('sbruce');
            await navigationPage.gotoCreateKnowledge();
            await utilityGrid.selectLineOfBusiness('Ericsson HR');
            expect(await createKnowledgePage.isTemplatePresent(knowledgeArticleTemplateDataHR.templateName)).toBeTruthy('Template is not present');
            expect(await createKnowledgePage.isTemplatePresent(knowledgeArticleTemplateDataSAM.templateName)).toBeFalsy('Template is present');
            expect(await createKnowledgePage.isTemplatePresent(knowledgeArticleTemplateDataGlobal.templateName)).toBeFalsy('Template is present');
            await createKnowledgePage.clickOnTemplate('Reference');
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await utilityGrid.selectLineOfBusiness('Ericsson SAM');
            expect(await createKnowledgePage.isTemplatePresent(knowledgeArticleTemplateDataSAM.templateName)).toBeTruthy('Template is not present');
            expect(await createKnowledgePage.isTemplatePresent(knowledgeArticleTemplateDataHR.templateName)).toBeFalsy('Template is present');
            expect(await createKnowledgePage.isTemplatePresent(knowledgeArticleTemplateDataGlobal.templateName)).toBeFalsy('Template is present');
            expect(await createKnowledgePage.getValueOfLineOFBusiness()).toBe('Ericsson SAM');
            expect(await createKnowledgePage.isValuePresentInDropdown('Knowledge Set', knowledgeSetDataEricssonSAM.knowledgeSetTitle)).toBeTruthy('Failure: Knowledge Set is missing');
            expect(await createKnowledgePage.isValuePresentInDropdown('Knowledge Set', knowledgeSetDataEricssonHR.knowledgeSetTitle)).toBeFalsy('Failure: Knowledge Set is available');
            expect(await createKnowledgePage.isTemplatePresent(knowledgeArticleTemplateDataGlobal.templateName)).toBeFalsy('Template is present');

            expect(await createKnowledgePage.isValuePresentInDropdown('Category Tier 1', 'Facilities')).toBeTruthy('Failure: Operational Category 1 is missing');
            expect(await createKnowledgePage.isValuePresentInDropdown('Category Tier 1', 'Employee Relations')).toBeFalsy('Failure: Operational Category 1 is present');

            await navigationPage.gotoKnowledgeConsole();
            await createKnowledgePage.clickOnTemplate('Reference');
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await utilityGrid.selectLineOfBusiness('Ericsson HR');

            //Validating Assignment fields
            await createKnowledgePage.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'EricssonCo HR')).toBeTruthy();
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'EricssonCo SAM')).toBeFalsy();
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'US Support 2');
            expect(await changeAssignmentBladePo.isPersonAvailableOnAssignBlade(`${userData3.firstName} ${userData3.lastName}`)).toBeTruthy('User is not present on Assignment blade');
            expect(await changeAssignmentBladePo.isPersonAvailableOnAssignBlade(`${userData4.firstName} ${userData4.lastName}`)).toBeTruthy('User is present on Assignment blade');
            await changeAssignmentBladePo.clickOnCancelButton();

            //Saving the Article
            await createKnowledgePage.addTextInKnowlegeTitleField(`DRDMV23666 Title ${randomStr}`);
            await createKnowledgePage.selectKnowledgeSet(knowledgeSetDataEricssonHR.knowledgeSetTitle);
            await createKnowledgePage.selectCategoryTier1Option('Applications');

            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await previewKnowledgePo.clickGoToArticleButton();
            articleId = await viewKnowledgeArticlePo.getKnowledgeArticleId();
        });

        it('[12041]: [Ericsson Model] [Knowledge] Verify the Knowledge Article Creation with respect to Line of Business when user has access to multiple Line of Business', async () => {
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            expect(await editKnowledgePo.getLineOfBusinessValue()).toBe('Ericsson HR');
            expect(await editKnowledgePo.isLobSectionEnabled()).toBeFalsy();
            await editKnowledgePo.cancelKnowledgeMedataDataChanges();
            await viewKnowledgeArticlePo.clickEditKnowledgeAccess();
            await accessTabPo.clickToExpandAccessEntitiySearch('Support Group Access', 'Knowledge');
            expect(await accessTabPo.isValuePresentInDropdown('Support Group', 'Petramco HR')).toBeTruthy();
            expect(await accessTabPo.isValuePresentInDropdown('Support Group', 'Petramco Facilities')).toBeFalsy();

            await accessTabPo.clickToExpandAccessEntitiySearch('Agent Access', 'Knowledge');
            expect(await accessTabPo.isAgentPresent(userData3.firstName)).toBeTruthy('User is not Present');
            expect(await accessTabPo.isAgentPresent(userData4.firstName)).toBeFalsy('User is Present');
            await accessTabPo.clickCloseKnowledgeAccessBlade();

            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            expect(await createKnowledgePage.isValuePresentInDropdown('Category Tier 1', 'Applications')).toBeTruthy('Failure: Operational Category 1 is missing');
            expect(await createKnowledgePage.isValuePresentInDropdown('Category Tier 1', 'Facilties')).toBeFalsy('Failure: Operational Category 1 is present');
            await editKnowledgePo.setCategoryTier1('Total Rewards');
            await editKnowledgePo.saveKnowledgeMedataDataChanges();
            expect(await viewKnowledgeArticlePo.getCategoryTier1Value()).toBe('Total Rewards');

            await editKnowledgePo.setKnowledgeStatus('Draft');
            await editKnowledgePo.setKnowledgeStatusWithoutSave('SME Review');
            await statusBladeKnowledgeArticlePo.clickChangeReviewerBtn();
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'EricssonCo HR')).toBeTruthy();
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'EricssonCo SAM')).toBeFalsy();
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'US Support 2');
            expect(await changeAssignmentBladePo.isPersonAvailableOnAssignBlade(`${userData3.firstName} ${userData3.lastName}`)).toBeTruthy('User is not present on Assignment blade');
            expect(await changeAssignmentBladePo.isPersonAvailableOnAssignBlade(`${userData4.firstName} ${userData4.lastName}`)).toBeTruthy('User is present on Assignment blade');
            await changeAssignmentBladePo.clickOnCancelButton();

            await navigationPage.gotoKnowledgeConsole();
            expect(await utilityGrid.isGridRecordPresent(knowledgeArticleDataDiffLOB.title)).toBeFalsy('Record is present');
            expect(await utilityGrid.isGridRecordPresent(knowledgeArticleDataDiffLOBGlobal.title)).toBeFalsy('Record is present');

            await navigationPage.signOut();
            await loginPage.login('sherbert');
            await navigationPage.gotoKnowledgeConsole();
            expect(await utilityGrid.isGridRecordPresent(articleId)).toBeFalsy(articleId + ' Record is present');
        });
    });
});
