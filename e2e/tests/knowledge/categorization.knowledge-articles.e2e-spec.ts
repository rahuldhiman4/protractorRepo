import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import previewCasePo from '../../pageobject/case/case-preview.po';
import createCasePage from '../../pageobject/case/create-case.po';
import editCasePage from '../../pageobject/case/edit-case.po';
import quickCase from '../../pageobject/case/quick-case.po';
import viewCasePage from "../../pageobject/case/view-case.po";
import attachDocumentBladePO from '../../pageobject/common/attach-document-blade.po';
import changeAssignmentBlade from "../../pageobject/common/change-assignment.po";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import resources from '../../pageobject/common/resources-tab.po';
import createKnowledgePage from "../../pageobject/knowledge/create-knowlege.po";
import editKnowledgePage from '../../pageobject/knowledge/edit-knowledge.po';
import knowledgeConsole from '../../pageobject/knowledge/knowledge-articles-console.po';
import previewKnowledgePo from '../../pageobject/knowledge/preview-knowledge.po';
import viewKnowledgeArticlePo from '../../pageobject/knowledge/view-knowledge-article.po';
import createDocumentLibraryPage from '../../pageobject/settings/document-management/create-document-library.po';
import documentLibraryConsolePage from '../../pageobject/settings/document-management/document-library-console.po';
import editDocumentLibraryPage from '../../pageobject/settings/document-management/edit-document-library.po';
import viewDocumentLibraryPo from '../../pageobject/settings/document-management/view-document-library.po';
import { BWF_BASE_URL, BWF_PAGE_TITLES, DropDownType } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from "../../utils/utility.grid";

let caseBAUser = 'qkatawazi';
let caseAgentUser = 'qtao';
let caseManagerUser = 'qdu';
let knowledgeCandidateUser = 'kayo';
let knowledgeContributorUser = 'kkohri';
let knowledgePublisherUser = 'kmills';
let knowledgeCoachUser = 'kWilliamson';
let categoryTier1 = 'Category Tier 1';
let categoryTier2 = 'Category Tier 2';
let categoryTier3 = 'Category Tier 3';
let categoryTier4 = 'Category Tier 4';
let categoryTier1FieldVal = 'Employee Relations';
let categoryTier2FieldVal = 'Compensation';
let categoryTier3FieldVal = 'Bonus';
let knowledgeManagementApp = "Knowledge Management";
let knowledgeArticlesTitleStr = "Knowledge Articles";
let advancedSearchOptionCategoryTier1 = "Operational Category Tier 1";
let advancedSearchOptionCategoryTier1ForDocumentLibrary = "Operational Category 1";
let applyBtn = "Apply";
let emptyStr = '';
let articleInDraftStatus = '3914 KnowledgeArticle_Draft';
let articleInSMEReviewStatus = '3914 KnowledgeArticle_SMEReview';
let articleInPublishedStatus = '3914 KnowledgeArticle_Published';
let articleInRetiredStatus = '3914 KnowledgeArticle_Retired';
let articleInClosedStatus = '3914 KnowledgeArticle_Closed';
let articleInCanceledStatus = '3914 KnowledgeArticle_Canceled';
let companyStr = "Petramco";
let documentLibraryStatus = "Published";
let draftStatus = "Draft";
let inProgressStatus = "In Progress";
let smeReviewStatus = "SMEReview";
let publishedStatus = "Published";
let retiredStatus = "Retired";
let closedStatus = "Closed";
let canceledStatus = "Canceled";
let title = "3914 KnowledgeArticle";

describe('Knowledge Articles - Categorization Tests', () => {
    const filePath = '../../../data/ui/attachment/articleStatus.png';
    const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
    const businessDataFile = require('../../data/ui/foundation/businessUnit.ui.json');
    const departmentDataFile = require('../../data/ui/foundation/department.ui.json');
    const supportGrpDataFile = require('../../data/ui/foundation/supportGroup.ui.json');
    const domainTagDataFile = require('../../data/ui/foundation/domainTag.ui.json');
    let knowledgeModule = 'Knowledge';

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login(caseBAUser);

        let articleData = {
            "knowledgeSet": "HR",
            "title": "KnowledgeArticle",
            "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
            "categoryTier1": "Employee Relations",
            "categoryTier2": "Compensation",
            "categoryTier3": "Bonus",
            "company": "Petramco",
            "region": "Australia",
            "site": "Canberra",
            "assignedCompany": "Petramco",
            "assigneeBusinessUnit": "United Kingdom Support",
            "assigneeSupportGroup": "GB Support 2",
            "assignee": "KMills"
        }
        await apiHelper.apiLogin('elizabeth');
        apiHelper.deleteApprovalMapping(knowledgeModule);

        await apiHelper.apiLogin(knowledgePublisherUser);
        // Create article in in progress status
        articleData.title = title + "_" + inProgressStatus;
        let knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
        //Create article in draft status
        articleData.title = title + "_" + draftStatus;
        knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
        let knowledgeArticleGUID = knowledgeArticleData.id;
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, draftStatus)).toBeTruthy("Article with Draft status not updated.");

        //Create article in SMEReview status
        articleData.title = title + "_" + smeReviewStatus;
        knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
        knowledgeArticleGUID = knowledgeArticleData.id;
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, draftStatus)).toBeTruthy("Article with Draft status not updated.");
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, smeReviewStatus, "KMills", 'GB Support 2', 'Petramco')).toBeTruthy("Article with SME Review status not updated.");

        //Create article in Published status
        articleData.title = title + "_" + publishedStatus;
        knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
        knowledgeArticleGUID = knowledgeArticleData.id;
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, draftStatus)).toBeTruthy("Article with Draft status not updated.");
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'PublishApproval', "KMills", 'GB Support 2', 'Petramco')).toBeTruthy("Article with Published status not updated.");

        //Create article in Retired status
        articleData.title = title + "_" + retiredStatus;
        knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
        knowledgeArticleGUID = knowledgeArticleData.id;
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, draftStatus)).toBeTruthy("Article with Draft status not updated.");
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'PublishApproval', "KMills", 'GB Support 2', 'Petramco')).toBeTruthy("Article with Published status not updated.");
        await browser.sleep(5000); //Takes time to update and reflect the status
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'RetireApproval', "KMills", 'GB Support 2', 'Petramco')).toBeTruthy("Article with Retired status not updated.");

        //Create article in Closed status
        articleData.title = title + "_" + closedStatus;
        knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
        knowledgeArticleGUID = knowledgeArticleData.id;
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, draftStatus)).toBeTruthy("Article with Draft status not updated.");
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'PublishApproval', "KMills", 'GB Support 2', 'Petramco')).toBeTruthy("Article with Published status not updated.");
        await browser.sleep(5000); //Takes time to update and reflect the status
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'RetireApproval', "KMills", 'GB Support 2', 'Petramco')).toBeTruthy("Article with Retired status not updated.");
        await browser.sleep(5000); //Takes time to update and reflect the status
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, closedStatus)).toBeTruthy("Article with Closed status not updated.");

        //Create article in Canceled status
        articleData.title = title + "_" + canceledStatus;
        knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
        knowledgeArticleGUID = knowledgeArticleData.id;
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'CancelApproval', "KMills", 'GB Support 2', 'Petramco')).toBeTruthy("Article with Canceled status not updated.");
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    async function foundationData2002(company: string) {
        await apiHelper.apiLogin('tadmin');
        let domainTagData = domainTagDataFile['DomainTagDataPsilon'];
        let businessData = (businessDataFile['BusinessUnitData2002']);
        let departmentData = departmentDataFile['DepartmentData2002'];
        let suppGrpData = supportGrpDataFile['SuppGrpData2002'];
        // let personData = personDataFile['PersonData2002'];
        let domainTag = await apiHelper.createDomainTag(domainTagData);
        businessData.relatedOrgId = company;
        let businessUnitId = await apiHelper.createBusinessUnit(businessData);
        departmentData.relatedOrgId = businessUnitId;
        await browser.sleep(5000); //waiting for data to be reflected on UI
        let depId = await apiHelper.createDepartment(departmentData);
        await browser.sleep(7000); //waiting for data to be reflected on UI
        suppGrpData.relatedOrgId = depId;
        await apiHelper.createSupportGroup(suppGrpData);
        await browser.sleep(9000); //waiting for data to be reflected on UI
        await apiHelper.associatePersonToSupportGroup('dbomei', suppGrpData.orgName);
        await apiHelper.associateCategoryUnderDomainTag('Applications', domainTag);
        await browser.sleep(2000); //waiting for data to be reflected on UI
    }
//Passed-Locally
    describe('[3918,3917,3916]:Verify the search functionality of knowledge articles console for category tiers 1,2 and 3', () => {
        let categoryTierFieldColumns: string[] = ["Category Tier 1", "Category Tier 2", "Category Tier 3"];
        let knowledgeGridColumnFields: string[] = ["Article ID", "Title", "Knowledge Set", "Status", "Assignee", "Company", "Template Name", "Reviewer", "Modified By", "Created Date", "Modified Date", "Flagged", "Category Tier 1", "Category Tier 2", "Category Tier 3"];
        let categoryTier1Val, categoryTier2Val, categoryTier3Val;
        it('[3918,3917,3916]:Verify the search functionality of knowledge articles console for category tiers 1,2 and 3', async () => {
            //* Login with Case BA
            await navigationPage.gotoKnowledgeConsole();
            await knowledgeConsole.addColumnOnGrid(categoryTierFieldColumns);
            expect(await knowledgeConsole.areGridColumnHeaderMatches(knowledgeGridColumnFields)).toBe(true);
            await knowledgeConsole.searchOnGridConsole(categoryTier1FieldVal);
            categoryTier1Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier1);
            await knowledgeConsole.searchOnGridConsole(categoryTier2FieldVal);
            categoryTier2Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier2);
            await knowledgeConsole.searchOnGridConsole(categoryTier3FieldVal);
            categoryTier3Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier3);

            expect(categoryTier1Val).toEqual(categoryTier1FieldVal);
            expect(categoryTier2Val).toEqual(categoryTier2FieldVal);
            expect(categoryTier3Val).toEqual(categoryTier3FieldVal);
            await knowledgeConsole.removeColumnOnGrid(categoryTierFieldColumns);
            expect(await knowledgeConsole.areGridColumnHeaderMatches(knowledgeGridColumnFields)).toBe(false);
            await knowledgeConsole.searchOnGridConsole(categoryTier1FieldVal);
            categoryTier1Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier1);
            await knowledgeConsole.searchOnGridConsole(categoryTier2FieldVal);
            categoryTier2Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier2);
            await knowledgeConsole.searchOnGridConsole(categoryTier3FieldVal);
            categoryTier3Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier3); expect(categoryTier1Val).toEqual(emptyStr);
            expect(categoryTier1Val).toEqual(emptyStr);
            expect(categoryTier2Val).toEqual(emptyStr);
            expect(categoryTier3Val).toEqual(emptyStr);
        });
        it('[3918,3917,3916]:Verify the search functionality of knowledge articles console for category tiers 1,2 and 3', async () => {
            //Login with case Manager
            await navigationPage.signOut();
            await loginPage.login(caseManagerUser);
            await navigationPage.gotoKnowledgeConsole();
            await knowledgeConsole.addColumnOnGrid(categoryTierFieldColumns);
            expect(await knowledgeConsole.areGridColumnHeaderMatches(knowledgeGridColumnFields)).toBe(true);
            await knowledgeConsole.searchOnGridConsole(categoryTier1FieldVal);
            categoryTier1Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier1);
            await knowledgeConsole.searchOnGridConsole(categoryTier2FieldVal);
            categoryTier2Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier2);
            await knowledgeConsole.searchOnGridConsole(categoryTier3FieldVal);
            categoryTier3Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier3);
            expect(categoryTier1Val).toEqual(categoryTier1FieldVal);
            expect(categoryTier2Val).toEqual(categoryTier2FieldVal);
            expect(categoryTier3Val).toEqual(categoryTier3FieldVal);
            await knowledgeConsole.removeColumnOnGrid(categoryTierFieldColumns);
            expect(await knowledgeConsole.areGridColumnHeaderMatches(knowledgeGridColumnFields)).toBe(false);
            await knowledgeConsole.searchOnGridConsole(categoryTier1FieldVal);
            categoryTier1Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier1);
            await knowledgeConsole.searchOnGridConsole(categoryTier2FieldVal);
            categoryTier2Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier2);
            await knowledgeConsole.searchOnGridConsole(categoryTier3FieldVal);
            categoryTier3Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier3);
            expect(categoryTier1Val).toEqual(emptyStr);
            expect(categoryTier2Val).toEqual(emptyStr);
            expect(categoryTier3Val).toEqual(emptyStr);
        });

        it('[3918,3917,3916]:Verify the search functionality of knowledge articles console for category tiers 1,2 and 3', async () => {
            //Login with Case Agent user
            await navigationPage.signOut();
            await loginPage.login(caseAgentUser);
            await navigationPage.gotoKnowledgeConsole();
            await knowledgeConsole.addColumnOnGrid(categoryTierFieldColumns);
            expect(await knowledgeConsole.areGridColumnHeaderMatches(knowledgeGridColumnFields)).toBe(true);
            await knowledgeConsole.searchOnGridConsole(categoryTier1FieldVal);
            let categoryTier1Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier1);
            await knowledgeConsole.searchOnGridConsole(categoryTier2FieldVal);
            let categoryTier2Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier2);
            await knowledgeConsole.searchOnGridConsole(categoryTier3FieldVal);
            let categoryTier3Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier3);
            expect(categoryTier1Val).toEqual(categoryTier1FieldVal);
            expect(categoryTier2Val).toEqual(categoryTier2FieldVal);
            expect(categoryTier3Val).toEqual(categoryTier3FieldVal);
            await knowledgeConsole.removeColumnOnGrid(categoryTierFieldColumns);
            expect(await knowledgeConsole.areGridColumnHeaderMatches(knowledgeGridColumnFields)).toBe(false);
            await knowledgeConsole.searchOnGridConsole(categoryTier1FieldVal);
            categoryTier1Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier1);
            await knowledgeConsole.searchOnGridConsole(categoryTier2FieldVal);
            categoryTier2Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier2);
            await knowledgeConsole.searchOnGridConsole(categoryTier3FieldVal);
            categoryTier3Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier3);
            expect(categoryTier1Val).toEqual(emptyStr);
            expect(categoryTier2Val).toEqual(emptyStr);
            expect(categoryTier3Val).toEqual(emptyStr);
        });
        it('[3918,3917,3916]:Verify the search functionality of knowledge articles console for category tiers 1,2 and 3', async () => {
            //Login with knowledge candidate user
            await navigationPage.signOut();
            await loginPage.login(knowledgeCandidateUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeConsole.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await knowledgeConsole.addColumnOnGrid(categoryTierFieldColumns);
            expect(await knowledgeConsole.areGridColumnHeaderMatches(knowledgeGridColumnFields)).toBe(true);
            await knowledgeConsole.searchOnGridConsole(categoryTier1FieldVal);
            categoryTier1Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier1);
            await knowledgeConsole.searchOnGridConsole(categoryTier2FieldVal);
            categoryTier2Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier2);
            await knowledgeConsole.searchOnGridConsole(categoryTier3FieldVal);
            categoryTier3Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier3);
            expect(categoryTier1Val).toEqual(categoryTier1FieldVal);
            expect(categoryTier2Val).toEqual(categoryTier2FieldVal);
            expect(categoryTier3Val).toEqual(categoryTier3FieldVal);
            await knowledgeConsole.removeColumnOnGrid(categoryTierFieldColumns);
            expect(await knowledgeConsole.areGridColumnHeaderMatches(knowledgeGridColumnFields)).toBe(false);
            await knowledgeConsole.searchOnGridConsole(categoryTier1FieldVal);
            categoryTier1Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier1);
            await knowledgeConsole.searchOnGridConsole(categoryTier2FieldVal);
            categoryTier2Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier2);
            await knowledgeConsole.searchOnGridConsole(categoryTier3FieldVal);
            categoryTier3Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier3);
            expect(categoryTier1Val).toEqual(emptyStr);
            expect(categoryTier2Val).toEqual(emptyStr);
            expect(categoryTier3Val).toEqual(emptyStr);
        });

        it('[3918,3917,3916]:Verify the search functionality of knowledge articles console for category tiers 1,2 and 3', async () => {
            //Login with knowledge contributor 
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login(knowledgeContributorUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeConsole.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await knowledgeConsole.addColumnOnGrid(categoryTierFieldColumns);
            expect(await knowledgeConsole.areGridColumnHeaderMatches(knowledgeGridColumnFields)).toBe(true);
            await knowledgeConsole.searchOnGridConsole(categoryTier1FieldVal);
            let categoryTier1Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier1);
            await knowledgeConsole.searchOnGridConsole(categoryTier2FieldVal);
            let categoryTier2Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier2);
            await knowledgeConsole.searchOnGridConsole(categoryTier3FieldVal);
            let categoryTier3Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier3);
            expect(categoryTier1Val).toEqual(categoryTier1FieldVal);
            expect(categoryTier2Val).toEqual(categoryTier2FieldVal);
            expect(categoryTier3Val).toEqual(categoryTier3FieldVal);
            await knowledgeConsole.removeColumnOnGrid(categoryTierFieldColumns);
            expect(await knowledgeConsole.areGridColumnHeaderMatches(knowledgeGridColumnFields)).toBe(false);
            await knowledgeConsole.searchOnGridConsole(categoryTier1FieldVal);
            categoryTier1Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier1);
            await knowledgeConsole.searchOnGridConsole(categoryTier2FieldVal);
            categoryTier2Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier2);
            await knowledgeConsole.searchOnGridConsole(categoryTier3FieldVal);
            categoryTier3Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier3);
            expect(categoryTier1Val).toEqual(emptyStr);
            expect(categoryTier2Val).toEqual(emptyStr);
            expect(categoryTier3Val).toEqual(emptyStr);
        });
        it('[3918,3917,3916]:Verify the search functionality of knowledge articles console for category tiers 1,2 and 3', async () => {
            //Login with knowledge Publisher
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeConsole.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await knowledgeConsole.addColumnOnGrid(categoryTierFieldColumns);
            expect(await knowledgeConsole.areGridColumnHeaderMatches(knowledgeGridColumnFields)).toBe(true);
            await knowledgeConsole.searchOnGridConsole(categoryTier1FieldVal);
            categoryTier1Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier1);
            await knowledgeConsole.searchOnGridConsole(categoryTier2FieldVal);
            categoryTier2Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier2);
            await knowledgeConsole.searchOnGridConsole(categoryTier3FieldVal);
            categoryTier3Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier3);
            expect(categoryTier1Val).toEqual(categoryTier1FieldVal);
            expect(categoryTier2Val).toEqual(categoryTier2FieldVal);
            expect(categoryTier3Val).toEqual(categoryTier3FieldVal);
            await knowledgeConsole.removeColumnOnGrid(categoryTierFieldColumns);
            expect(await knowledgeConsole.areGridColumnHeaderMatches(knowledgeGridColumnFields)).toBe(false);
            await knowledgeConsole.searchOnGridConsole(categoryTier1FieldVal);
            categoryTier1Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier1);
            await knowledgeConsole.searchOnGridConsole(categoryTier2FieldVal);
            categoryTier2Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier2);
            await knowledgeConsole.searchOnGridConsole(categoryTier3FieldVal);
            categoryTier3Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier3);
            expect(categoryTier1Val).toEqual(emptyStr);
            expect(categoryTier2Val).toEqual(emptyStr);
            expect(categoryTier3Val).toEqual(emptyStr);
        });

        it('[3918,3917,3916]:Verify the search functionality of knowledge articles console for category tiers 1,2 and 3', async () => {
            //Login with knowledge coach 
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeConsole.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await knowledgeConsole.addColumnOnGrid(categoryTierFieldColumns);
            expect(await knowledgeConsole.areGridColumnHeaderMatches(knowledgeGridColumnFields)).toBe(true);
            await knowledgeConsole.searchOnGridConsole(categoryTier1FieldVal);
            let categoryTier1Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier1);
            await knowledgeConsole.searchOnGridConsole(categoryTier2FieldVal);
            let categoryTier2Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier2);
            await knowledgeConsole.searchOnGridConsole(categoryTier3FieldVal);
            let categoryTier3Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier3);
            expect(categoryTier1Val).toEqual(categoryTier1FieldVal);
            expect(categoryTier2Val).toEqual(categoryTier2FieldVal);
            expect(categoryTier3Val).toEqual(categoryTier3FieldVal);
            await knowledgeConsole.removeColumnOnGrid(categoryTierFieldColumns);
            expect(await knowledgeConsole.areGridColumnHeaderMatches(knowledgeGridColumnFields)).toBe(false);
            await knowledgeConsole.searchOnGridConsole(categoryTier1FieldVal);
            categoryTier1Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier1);
            await knowledgeConsole.searchOnGridConsole(categoryTier2FieldVal);
            categoryTier2Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier2);
            await knowledgeConsole.searchOnGridConsole(categoryTier3FieldVal);
            categoryTier3Val = await knowledgeConsole.getSelectedGridRecordValue(categoryTier3);
            expect(categoryTier1Val).toEqual(emptyStr);
            expect(categoryTier2Val).toEqual(emptyStr);
            expect(categoryTier3Val).toEqual(emptyStr);
        });
        afterAll(async () => {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        });
    });
//Quick case issue
    describe('[3914]:Verify the knowledge articles search based on category tier on Quick case / Create case', () => {
        it('[3914]:Verify the knowledge articles search based on category tier on Quick case / Create case', async () => {
            //* Check the Availability of Category Tiers with Case BA
            await navigationPage.gotoQuickCase();
            await quickCase.selectRequesterName(caseAgentUser);
            await quickCase.setCaseSummary(articleInDraftStatus);
            //Search with knowledge article with draft status
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(advancedSearchOptionCategoryTier1, categoryTier1FieldVal, DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInDraftStatus)).toEqual(articleInDraftStatus);

            //Search with knowledge article with SMEReview status
            await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(advancedSearchOptionCategoryTier1, categoryTier1FieldVal, DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInSMEReviewStatus)).toEqual(articleInSMEReviewStatus);

            //Search with knowledge article with Published status
            await resources.enterAdvancedSearchText(articleInPublishedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(advancedSearchOptionCategoryTier1, categoryTier1FieldVal, DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInPublishedStatus)).toEqual(articleInPublishedStatus);

            //Search with knowledge article with Retired status
            await resources.enterAdvancedSearchText(articleInRetiredStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(advancedSearchOptionCategoryTier1, categoryTier1FieldVal, DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInRetiredStatus)).toEqual(articleInRetiredStatus);

            //Search with knowledge article with Closed status
            await resources.enterAdvancedSearchText(articleInClosedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(advancedSearchOptionCategoryTier1, categoryTier1FieldVal, DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInClosedStatus)).toEqual(articleInClosedStatus);

            //Search with knowledge article with Canceled status
            await resources.enterAdvancedSearchText(articleInCanceledStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(advancedSearchOptionCategoryTier1, categoryTier1FieldVal, DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInCanceledStatus)).toEqual(articleInCanceledStatus);
        });

        it('[3914]:Verify the knowledge articles search based on category tier on Quick case / Create case', async () => {
            //Navigate to Create case
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary(articleInDraftStatus);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePage.clickOnTab('Resources');

            //Search with knowledge article with draft status
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(advancedSearchOptionCategoryTier1, categoryTier1FieldVal, DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInDraftStatus)).toEqual(articleInDraftStatus);

            //Search with knowledge article with SMEReview status
            await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(advancedSearchOptionCategoryTier1, categoryTier1FieldVal, DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInSMEReviewStatus)).toEqual(articleInSMEReviewStatus);

            //Search with knowledge article with Published status
            await resources.enterAdvancedSearchText(articleInPublishedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(advancedSearchOptionCategoryTier1, categoryTier1FieldVal, DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInPublishedStatus)).toEqual(articleInPublishedStatus);

            //Search with knowledge article with Retired status
            await resources.enterAdvancedSearchText(articleInRetiredStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(advancedSearchOptionCategoryTier1, categoryTier1FieldVal, DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInRetiredStatus)).toEqual(articleInRetiredStatus);

            //Search with knowledge article with Closed status
            await resources.enterAdvancedSearchText(articleInClosedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(advancedSearchOptionCategoryTier1, categoryTier1FieldVal, DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInClosedStatus)).toEqual(articleInClosedStatus);

            //Search with knowledge article with Canceled status
            await resources.enterAdvancedSearchText(articleInCanceledStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(advancedSearchOptionCategoryTier1, categoryTier1FieldVal, DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInCanceledStatus)).toEqual(articleInCanceledStatus);
        });

        it('[3914]:Verify the knowledge articles search based on category tier on Quick case / Create case', async () => {
            //Login with Case Manager
            await navigationPage.signOut();
            await loginPage.login(caseManagerUser);
            await navigationPage.gotoQuickCase();
            await quickCase.selectRequesterName(caseAgentUser);
            await quickCase.setCaseSummary(articleInDraftStatus);
            //Search with knowledge article with draft status
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(advancedSearchOptionCategoryTier1, categoryTier1FieldVal, DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInDraftStatus)).toEqual(articleInDraftStatus);

            //Search with knowledge article with SMEReview status
            await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(advancedSearchOptionCategoryTier1, categoryTier1FieldVal, DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInSMEReviewStatus)).toEqual(articleInSMEReviewStatus);

            //Search with knowledge article with Published status
            await resources.enterAdvancedSearchText(articleInPublishedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(advancedSearchOptionCategoryTier1, categoryTier1FieldVal, DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInPublishedStatus)).toEqual(articleInPublishedStatus);

            //Search with knowledge article with Retired status
            await resources.enterAdvancedSearchText(articleInRetiredStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(advancedSearchOptionCategoryTier1, categoryTier1FieldVal, DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInRetiredStatus)).toEqual(articleInRetiredStatus);

            //Search with knowledge article with Closed status
            await resources.enterAdvancedSearchText(articleInClosedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(advancedSearchOptionCategoryTier1, categoryTier1FieldVal, DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInClosedStatus)).toEqual(articleInClosedStatus);

            //Search with knowledge article with Canceled status
            await resources.enterAdvancedSearchText(articleInCanceledStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(advancedSearchOptionCategoryTier1, categoryTier1FieldVal, DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInCanceledStatus)).toEqual(articleInCanceledStatus);
        });

        it('[3914]:Verify the knowledge articles search based on category tier on Quick case / Create case', async () => {
            //Navigate to Create case
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary(articleInDraftStatus);
            await changeAssignmentBlade.setAssignee('CA Support 1', 'Qiang Du');
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePage.clickOnTab('Resources');

            //Search with knowledge article with draft status
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(advancedSearchOptionCategoryTier1, categoryTier1FieldVal, DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInDraftStatus)).toEqual(articleInDraftStatus);

            //Search with knowledge article with SMEReview status
            await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(advancedSearchOptionCategoryTier1, categoryTier1FieldVal, DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInSMEReviewStatus)).toEqual(articleInSMEReviewStatus);

            //Search with knowledge article with Published status
            await resources.enterAdvancedSearchText(articleInPublishedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(advancedSearchOptionCategoryTier1, categoryTier1FieldVal, DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInPublishedStatus)).toEqual(articleInPublishedStatus);

            //Search with knowledge article with Retired status
            await resources.enterAdvancedSearchText(articleInRetiredStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(advancedSearchOptionCategoryTier1, categoryTier1FieldVal, DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInRetiredStatus)).toEqual(articleInRetiredStatus);

            //Search with knowledge article with Closed status
            await resources.enterAdvancedSearchText(articleInClosedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(advancedSearchOptionCategoryTier1, categoryTier1FieldVal, DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInClosedStatus)).toEqual(articleInClosedStatus);

            //Search with knowledge article with Canceled status
            await resources.enterAdvancedSearchText(articleInCanceledStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(advancedSearchOptionCategoryTier1, categoryTier1FieldVal, DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInCanceledStatus)).toEqual(articleInCanceledStatus);
        });

        it('[3914]:Verify the knowledge articles search based on category tier on Quick case / Create case', async () => {
            //Login with Case Agent
            await navigationPage.signOut();
            await loginPage.login(caseAgentUser);
            await navigationPage.gotoQuickCase();
            await quickCase.selectRequesterName(caseManagerUser);
            await quickCase.setCaseSummary(articleInDraftStatus);
            //Search with knowledge article with draft status
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(advancedSearchOptionCategoryTier1, categoryTier1FieldVal, DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInDraftStatus)).toEqual(articleInDraftStatus);

            //Search with knowledge article with SMEReview status
            await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(advancedSearchOptionCategoryTier1, categoryTier1FieldVal, DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInSMEReviewStatus)).toEqual(articleInSMEReviewStatus);

            //Search with knowledge article with Published status
            await resources.enterAdvancedSearchText(articleInPublishedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(advancedSearchOptionCategoryTier1, categoryTier1FieldVal, DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInPublishedStatus)).toEqual(articleInPublishedStatus);

            //Search with knowledge article with Retired status
            await resources.enterAdvancedSearchText(articleInRetiredStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(advancedSearchOptionCategoryTier1, categoryTier1FieldVal, DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInRetiredStatus)).toEqual(articleInRetiredStatus);

            //Search with knowledge article with Closed status
            await resources.enterAdvancedSearchText(articleInClosedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(advancedSearchOptionCategoryTier1, categoryTier1FieldVal, DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInClosedStatus)).toEqual(articleInClosedStatus);

            //Search with knowledge article with Canceled status
            await resources.enterAdvancedSearchText(articleInCanceledStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(advancedSearchOptionCategoryTier1, categoryTier1FieldVal, DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInCanceledStatus)).toEqual(articleInCanceledStatus);
        });

        it('[3914]:Verify the knowledge articles search based on category tier on Quick case / Create case', async () => {
            //Navigate to Create case
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester("adam");
            await createCasePage.setSummary(articleInDraftStatus);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePage.clickOnTab('Resources');

            //Search with knowledge article with draft status
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(articleInDraftStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(advancedSearchOptionCategoryTier1, categoryTier1FieldVal, DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInDraftStatus)).toEqual(articleInDraftStatus);

            //Search with knowledge article with SMEReview status
            await resources.enterAdvancedSearchText(articleInSMEReviewStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(advancedSearchOptionCategoryTier1, categoryTier1FieldVal, DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInSMEReviewStatus)).toEqual(articleInSMEReviewStatus);

            //Search with knowledge article with Published status
            await resources.enterAdvancedSearchText(articleInPublishedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(advancedSearchOptionCategoryTier1, categoryTier1FieldVal, DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInPublishedStatus)).toEqual(articleInPublishedStatus);

            //Search with knowledge article with Retired status
            await resources.enterAdvancedSearchText(articleInRetiredStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(advancedSearchOptionCategoryTier1, categoryTier1FieldVal, DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInRetiredStatus)).toEqual(articleInRetiredStatus);

            //Search with knowledge article with Closed status
            await resources.enterAdvancedSearchText(articleInClosedStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(advancedSearchOptionCategoryTier1, categoryTier1FieldVal, DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInClosedStatus)).toEqual(articleInClosedStatus);

            //Search with knowledge article with Canceled status
            await resources.enterAdvancedSearchText(articleInCanceledStatus);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(advancedSearchOptionCategoryTier1, categoryTier1FieldVal, DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(articleInCanceledStatus)).toEqual(articleInCanceledStatus);
        });

        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        });
    });
//Passed -Locally
    describe('[3913]:Verify the document search based on category tier from attachments', () => {
        let caseData = {
            "Requester": "qdu",
            "Summary": "3913",
            "Assigned Company": "Petramco",
            "Business Unit": "United States Support",
            "Support Group": "US Support 1",
            "Assignee": "qtao",
        }
        let title = `Document-${new Date().valueOf()}`;

        it('[3913]:Verify the document search based on category tier from attachments', async () => {
            //Create a document library
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Document Management--Library', BWF_PAGE_TITLES.DOCUMENT_MANAGEMENT.LIBRARY);
            title = randomStr + "3913Case_" + title;
            await createDocumentLibraryPage.openAddNewDocumentBlade();
            await createDocumentLibraryPage.addAttachment(filePath);
            await createDocumentLibraryPage.setTitle(title);
            await createDocumentLibraryPage.selectCompany(companyStr);
            await createDocumentLibraryPage.selectSupportOrg('United States Support');
            await createDocumentLibraryPage.selectOwnerGroup('US Support 1');
            await createDocumentLibraryPage.selectCategoryTier1(categoryTier1FieldVal);
            await createDocumentLibraryPage.selectCategoryTier2(categoryTier2FieldVal);
            await createDocumentLibraryPage.selectCategoryTier3(categoryTier3FieldVal);
            await createDocumentLibraryPage.saveNewDocument();
            await utilityCommon.closePopUpMessage();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Document Management--Library', BWF_PAGE_TITLES.DOCUMENT_MANAGEMENT.LIBRARY);
            await documentLibraryConsolePage.searchAndOpenDocumentLibrary(title);
            await viewDocumentLibraryPo.clickOnEditDocument();
            await editDocumentLibraryPage.selectStatus(documentLibraryStatus);
            await editDocumentLibraryPage.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
            await editDocumentLibraryPage.clickOnCancelButton();
        });

        it('[3913]:Verify the document search based on category tier from attachments', async () => {
            //Login with Case Manager
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await apiHelper.apiLogin('elizabeth');

            let response1 = await apiHelper.createCase(caseData);
            await utilityGrid.searchAndOpenHyperlink(response1.displayId);
            await viewCasePage.clickEditCaseButton();
            await editCasePage.clickOnAttachLink();
            await resources.clickOnAdvancedSearchOptions();
            await attachDocumentBladePO.searchRecord(title);
            await resources.enterAdvancedSearchText(title);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(advancedSearchOptionCategoryTier1ForDocumentLibrary, categoryTier1FieldVal, DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(title)).toEqual(title);
            await utilityCommon.closeAllBlades();
        });

        it('[3913]:Verify the document search based on category tier from attachments', async () => {
            //Login with Case Agent
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await apiHelper.apiLogin('elizabeth');
            let response2 = await apiHelper.createCase(caseData);
            await utilityGrid.searchAndOpenHyperlink(response2.displayId);
            await viewCasePage.clickEditCaseButton();
            await editCasePage.clickOnAttachLink();

            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(title);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(advancedSearchOptionCategoryTier1ForDocumentLibrary, categoryTier1FieldVal, DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(title)).toEqual(title);
            await utilityCommon.closeAllBlades();
        });

        it('[3913]:Verify the document search based on category tier from attachments', async () => {
            //Login with Case BA
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
            await apiHelper.apiLogin('elizabeth');
            let response3 = await apiHelper.createCase(caseData);
            await utilityGrid.searchAndOpenHyperlink(response3.displayId);
            await viewCasePage.clickEditCaseButton();
            await editCasePage.clickOnAttachLink();

            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(title);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown(advancedSearchOptionCategoryTier1ForDocumentLibrary, categoryTier1FieldVal, DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await expect(await resources.getAdvancedSearchResultForParticularSection(title)).toEqual(title);
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        });
    });
//knowledege set not visible for Psilon user
    it('[3860,3901]:Verify the domain configurations are honored while selecting category tiers on Knowledge articles and documents library', async () => {
        let knowledgeSetTitleStr = 'versionedKnowledgeSet_' + randomStr;
        let knowledgeSetData = {
            knowledgeSetTitle: `${knowledgeSetTitleStr}`,
            knowledgeSetDesc: `${knowledgeSetTitleStr}+'Desc'`,
            company: 'Psilon'
        }

        await apiHelper.apiLogin('tadmin');
        //await foundationData2002('Psilon');

        await apiHelper.apiLogin('gderuno');
        await apiHelper.createKnowledgeSet(knowledgeSetData);

        try {
            let businessData = businessDataFile['BusinessUnitData2002'];
            let departmentData = departmentDataFile['DepartmentData2002'];
            let suppGrpData = supportGrpDataFile['SuppGrpData2002'];
            let knowledgeDataFile = require("../../data/ui/knowledge/knowledgeArticle.ui.json")
            let knowledgeData = knowledgeDataFile['DRDMV-2002'];
            await navigationPage.signOut();
            await loginPage.login('werusha');
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate(knowledgeData.TemplateName);
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeData.KnowledgeTitle);
            await createKnowledgePage.setReferenceValue('Psilion User KM');
            await createKnowledgePage.selectKnowledgeSet('HR');
            expect(await createKnowledgePage.isCategoryTier1FieldLabelDisplayed(categoryTier1)).toBe(true);
            expect(await createKnowledgePage.isCategoryTier2FieldLabelDisplayed(categoryTier2)).toBe(true);
            expect(await createKnowledgePage.isCategoryTier3FieldLabelDisplayed(categoryTier3)).toBe(true);
            expect(await createKnowledgePage.isCategoryTier4FieldLabelDisplayed(categoryTier4)).toBe(true);
            await createKnowledgePage.selectCategoryTier1Option(categoryTier1FieldVal);
            await createKnowledgePage.selectCategoryTier2Option(categoryTier2FieldVal);
            await createKnowledgePage.selectCategoryTier3Option(categoryTier3FieldVal);
            await changeAssignmentBlade.setDropDownValue('AssignedGroup', 'Psilon Support Group1');
            await changeAssignmentBlade.setDropDownValue('Assignee', 'Doomi');
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await previewKnowledgePo.clickGoToArticleButton();
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            expect(await editKnowledgePage.getCategoryTier1SelectedValue()).toBe(categoryTier1FieldVal);
        }
        catch (error) {
            throw error;
        }
        finally {
            // await apiHelper.apiLogin('tadmin');
            // let domainTagData = domainTagDataFile['DomainTagDataPsilon'];
            // let domainTag = await apiHelper.createDomainTag(domainTagData);
            // await apiHelper.disableDomainTag(domainTag);
            await navigationPage.signOut();
            await loginPage.login(caseBAUser);
        }
    });
});
