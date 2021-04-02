import { browser } from "protractor";
import apiCoreUtil from '../../api/api.core.util';
import apiHelper from '../../api/api.helper';
import editCasePo from '../../pageobject/case/edit-case.po';
import quickCasePo from '../../pageobject/case/quick-case.po';
import viewCasePage from '../../pageobject/case/view-case.po';
import accessTabPo from '../../pageobject/common/access-tab.po';
import changeAssignmentBladePo from '../../pageobject/common/change-assignment.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import resources from '../../pageobject/common/resources-tab.po';
import { default as createKnowledgePage } from "../../pageobject/knowledge/create-knowlege.po";
import editKnowledgePage from "../../pageobject/knowledge/edit-knowledge.po";
import flagUnflagKnowledgePo from '../../pageobject/knowledge/flag-unflag-knowledge.po';
import { default as knowledgeArticlesConsolePo, default as knowledgeConsolePo } from '../../pageobject/knowledge/knowledge-articles-console.po';
import previewKnowledgePo from '../../pageobject/knowledge/preview-knowledge.po';
import viewKnowledgeArticlePo from '../../pageobject/knowledge/view-knowledge-article.po';
import consoleKnowledgeTemplatePo from '../../pageobject/settings/knowledge-management/console-knowledge-template.po';
import createKnowledgeArticleTemplatePo from '../../pageobject/settings/knowledge-management/create-knowledge-article-template.po';
import { BWF_BASE_URL, BWF_PAGE_TITLES, DropDownType } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

describe('Knowledge Create Search', () => {
    const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
    const businessDataFile = require('../../data/ui/foundation/businessUnit.ui.json');
    const departmentDataFile = require('../../data/ui/foundation/department.ui.json');
    const supportGrpDataFile = require('../../data/ui/foundation/supportGroup.ui.json');
    const personDataFile = require('../../data/ui/foundation/person.ui.json');
    let knowledgeCandidateUser = 'kayo';
    let knowledgeContributorUser = 'kkohri';
    let knowledgePublisherUser = 'kmills';
    let knowledgeCoachUser = 'kWilliamson';
    let knowledgeManagementApp = "Knowledge Management";
    let knowledgeArticlesTitleStr = "Knowledge Articles";
    let knowledgeModule = 'Knowledge';
    let kaDetails1, kaDetails2, kaDetails3, kaDetails4, kaDetails5, kaDetails6, kaDetails7, knowledgeTemplateId;
    let knowledgeSetTitleStr = 'KASet_' + randomStr;
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('peter');
        // await apiHelper.apiLogin('tadmin');
        // await apiHelper.setDefaultNotificationForUser("Peter", "Alert");
        //await foundationData('Petramco');
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    async function foundationData(company: string) {
        await apiHelper.apiLogin('tadmin');
        let businessData = businessDataFile['BusinessUnitData'];
        let departmentData = departmentDataFile['DepartmentData'];
        let suppGrpData = supportGrpDataFile['SuppGrpData'];
        let personData = personDataFile['PersonData'];
        businessData.relatedOrgId = company;
        let businessUnitId = await apiHelper.createBusinessUnit(businessData);
        departmentData.relatedOrgId = businessUnitId;
        let depId = await apiHelper.createDepartment(departmentData);
        suppGrpData.relatedOrgId = depId;
        await apiHelper.createSupportGroup(suppGrpData);
        await apiHelper.createNewUser(personData);
        await apiHelper.associatePersonToSupportGroup(personData.userId, suppGrpData.orgName);
        await apiHelper.associatePersonToCompany(personData.userId, company)
    }

    async function knowledgeConfigCreation() {
        let randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let knowledgeTemplateStr = 'KATemplate_' + randomStr;
        await apiHelper.apiLogin("tadmin");
        apiHelper.deleteApprovalMapping(knowledgeModule);
        await apiHelper.apiLogin('dbomei');
        let knowledgeSetData = {
            knowledgeSetTitle: `${knowledgeSetTitleStr}`,
            knowledgeSetDesc: `${knowledgeSetTitleStr}_Desc`,
            company: 'Petramco'
        }
        await apiHelper.apiLogin('elizabeth');
        await apiHelper.createKnowledgeSet(knowledgeSetData);

        let knowledgeArticleTemplateData = {
            templateName: knowledgeTemplateStr,
            sectionTitle: "articleSection",
            knowledgeSetTitle: knowledgeSetData.knowledgeSetTitle,
        }
        await apiHelper.createKnowledgeArticleTemplate(knowledgeArticleTemplateData);
        knowledgeTemplateId = await apiCoreUtil.getKnowledgeTemplateGuid(knowledgeTemplateStr);
    }

    //ptidke
    it('[4671,4663]: Create a Knowledge article and check Knowledge Preview', async () => {
        try {
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate('Reference');
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField('Knowledge' + randomStr);
            await createKnowledgePage.setReferenceValue('KnowledgeReference' + randomStr);
            await createKnowledgePage.selectKnowledgeSet('HR');
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            expect(await previewKnowledgePo.getKnowledgeArticleTitle()).toContain('Knowledge' + randomStr, 'title not correct');
            expect(await previewKnowledgePo.getKnowledgeArticleSection()).toContain('KnowledgeReference' + randomStr, 'section not correct');
            expect(await previewKnowledgePo.getKnowledgeArticleID()).toContain('KA-', 'article id is not as expected');
            expect(await previewKnowledgePo.isBackButtonDisplay()).toBeTruthy('back button not present');
            expect(await previewKnowledgePo.isStatusOfKADisplay()).toBeTruthy('Status not displaying');
            await previewKnowledgePo.clickOnBackButton();
        }
        catch (e) {
            throw e;
        }
    });

    //ptidke
    //Bug='DRDMV-21644
    it('[6016]: [Edit Knowledge Article] Article creation not possible by selecting disabled templates', async () => {
        try {
            await navigationPage.signOut();
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Article Templates', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.ARTICLE_TEMPLATES);
            await consoleKnowledgeTemplatePo.clickCreateNewKATemplate();
            await createKnowledgeArticleTemplatePo.setTemplateName(randomStr);
            await createKnowledgeArticleTemplatePo.clickOnDisableEnableCheckBox();
            await createKnowledgeArticleTemplatePo.clickOnAddSection();
            await createKnowledgeArticleTemplatePo.setSectionTitle('NewThings' + randomStr);
            await createKnowledgeArticleTemplatePo.setDescription('DescriptionOFKA');
            await createKnowledgeArticleTemplatePo.clickOnSaveButton();
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await navigationPage.gotoCreateKnowledge();
            expect(await createKnowledgePage.isTemplatePresent(randomStr)).toBeFalsy('Template is present');
        }
        catch (e) {
            throw e;
        }
        finally {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        }
    });

    //ptidke
    it('[6400,5988]: [Knowledge Article] [SearchArticle] Knowledge article search with article ID and title', async () => {
        let knowledgeGridColumnFields: string[] = ["Assigned Group", "Assignee Login Name", "Author", "GUID", "Region", "Review Status", "Category Tier 1", "Category Tier 2", "Category Tier 3"];
        let knowledgeTitle = 'knowledge774' + randomStr;
        await apiHelper.apiLogin('elizabeth');
        let articleData = {
            "knowledgeSet": 'HR',
            "title": `${knowledgeTitle}`,
            "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
            "assignedCompany": "Petramco",
            "assigneeBusinessUnit": "United Kingdom Support",
            "assigneeSupportGroup": "GB Support 2",
            "assignee": "KMills",
        }
        let knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
        await navigationPage.signOut();
        await loginPage.login(knowledgeCoachUser);
        await navigationPage.switchToApplication(knowledgeManagementApp);
        expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
        await knowledgeConsolePo.addColumnOnGrid(knowledgeGridColumnFields)
        await utilityGrid.searchRecord(knowledgeTitle);
        expect(await knowledgeConsolePo.isValueDisplayedInGrid('Title')).toContain(knowledgeTitle, 'KA not present1');
        await utilityGrid.searchRecord(knowledgeArticleData.displayId);
        expect(await knowledgeConsolePo.isValueDisplayedInGrid('Article ID')).toContain(knowledgeArticleData.displayId, 'KA not present2');
        await knowledgeConsolePo.removeColumnOnGrid(knowledgeGridColumnFields);
        await utilityCommon.switchToDefaultWindowClosingOtherTabs();
    });

    it('[6340,6406]: [Knowledge Article] [ArticleCreation] Closing the article without saving it', async () => {
        let knowledgeTitle = 'knowledge1186' + randomStr;
        await navigationPage.signOut();
        await loginPage.login(knowledgeCoachUser);
        await navigationPage.switchToApplication(knowledgeManagementApp);
        expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
        await navigationPage.gotoCreateKnowledge();
        expect(await createKnowledgePage.isTemplatePresent('KCS')).toBeTruthy('Template is not present');
        expect(await createKnowledgePage.isTemplatePresent('How To')).toBeTruthy('Template is not present');
        await createKnowledgePage.clickOnTemplate('Reference');
        expect(createKnowledgePage.isKnowledgeStyleTemplateDisplayed()).toBeTruthy('style is not present');
        await createKnowledgePage.clickOnUseSelectedTemplateButton();
        await createKnowledgePage.selectKnowledgeSet('HR');
        expect(await createKnowledgePage.isSaveButtonEnabled()).toBeFalsy('save button not disabled');
        await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeTitle);
        await createKnowledgePage.setReferenceValue('Refrence values');
        await createKnowledgePage.clickOnDiscardButton();
        await utilityCommon.clickOnApplicationWarningYesNoButton("No");
        expect(await createKnowledgePage.getKnowledgeSetValue()).toContain('HR', 'expected Value not present');
        expect(await createKnowledgePage.getKnowledgeArticleTitleValue()).toContain(knowledgeTitle, 'expected Value not present');
        await createKnowledgePage.clickOnDiscardButton();
        await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr, 'title not correct');
        await utilityGrid.searchRecord(knowledgeTitle);
        expect(await utilityGrid.getNumberOfRecordsInGrid()).toEqual(0);
        await utilityCommon.switchToDefaultWindowClosingOtherTabs();
    });

    describe('[5858,4934]:[Knowledge Article] Adding one or two or three level operational categorization while creating knowledge articles_Tier1, Tier2 & Tier3', async () => {
        it('[5858,4934]:[Knowledge Article] Adding one or two or three level operational categorization while creating knowledge articles_Tier1, Tier2 & Tier3', async () => {
            await navigationPage.signOut();
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate('Reference');
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField('Knowledge' + randomStr);
            await createKnowledgePage.setReferenceValue('KnowledgeReference' + randomStr)
            await createKnowledgePage.selectKnowledgeSet('HR');
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'Compensation and Benefits');
            await changeAssignmentBladePo.setDropDownValue('Assignee', 'Peter Kahn');
            await createKnowledgePage.selectCategoryTier1Option('Applications');
            await createKnowledgePage.selectCategoryTier2Option('Social');
            await createKnowledgePage.selectCategoryTier3Option('Chatter');
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await previewKnowledgePo.clickGoToArticleButton();
            expect(await viewKnowledgeArticlePo.getCategoryTier1Value()).toBe('Applications');
            expect(await viewKnowledgeArticlePo.getCategoryTier2Value()).toBe('Social');
            expect(await viewKnowledgeArticlePo.getCategoryTier3Value()).toBe('Chatter');
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            await editKnowledgePage.removeCategoryTier1();
            await editKnowledgePage.saveKnowledgeMedataDataChanges();
            await utilityCommon.closePopUpMessage();
            expect(await viewKnowledgeArticlePo.getCategoryTier1Value()).toBe('-');
            expect(await viewKnowledgeArticlePo.getCategoryTier2Value()).toBe('-');
            expect(await viewKnowledgeArticlePo.getCategoryTier3Value()).toBe('-');
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            await editKnowledgePage.setCategoryTier1('Employee Relations');
            await editKnowledgePage.setCategoryTier2('Compensation');
            await editKnowledgePage.saveKnowledgeMedataDataChanges();
            await utilityCommon.closePopUpMessage();
            expect(await viewKnowledgeArticlePo.getCategoryTier1Value()).toBe('Employee Relations');
            expect(await viewKnowledgeArticlePo.getCategoryTier2Value()).toBe('Compensation');
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            await editKnowledgePage.setCategoryTier1('Applications');
            await editKnowledgePage.saveKnowledgeMedataDataChanges();
            await utilityCommon.closePopUpMessage();
            expect(await viewKnowledgeArticlePo.getCategoryTier1Value()).toBe('Applications');
        });
        afterAll(async () => {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        });
    });

    it('[5987]:KA Console - Search Article by name, keywords', async () => {
        await apiHelper.apiLogin(knowledgeCoachUser);
        let articleData = {
            "knowledgeSet": "HR",
            "title": 'knowledge2746' + randomStr,
            "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
            "assignedCompany": "Petramco",
            "assigneeBusinessUnit": "United States Support",
            "assigneeSupportGroup": "US Support 1",
            "assignee": "kayo",
            "categoryTier1": "Applications",
            "categoryTier2": "Help Desk",
            "categoryTier3": "Incident",
            "region": "Australia",
            "site": "Canberra",
            "articleDesc": 'knowledge2746' + randomStr,
        }
        let kaDetails = await apiHelper.createKnowledgeArticle(articleData);
        await navigationPage.signOut();
        await loginPage.login(knowledgeCoachUser);
        await navigationPage.switchToApplication(knowledgeManagementApp);
        expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
        await utilityGrid.searchRecord(kaDetails.displayId);
        expect(await utilityGrid.isGridRecordPresent(kaDetails.displayId)).toBeTruthy(kaDetails.displayId + ' :Record is not available');
        await utilityGrid.searchRecord('HR');
        expect(await utilityGrid.isGridRecordPresent('HR')).toBeTruthy();
        await utilityGrid.searchRecord(articleData.title);
        expect(await utilityGrid.isGridRecordPresent(articleData.title)).toBeTruthy();
        await utilityGrid.searchRecord(articleData.assignedCompany);
        expect(await utilityGrid.isGridRecordPresent(articleData.assignedCompany)).toBeTruthy();
        await utilityCommon.switchToDefaultWindowClosingOtherTabs();
    });

    describe('[5949]:Create KA - with only required and with all fields populating', async () => {
        it('[5949]:Create KA - with only required and with all fields populating', async () => {
            await navigationPage.signOut();
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate('Reference');
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField('Knowledge' + randomStr);
            await createKnowledgePage.selectKnowledgeSet('HR');
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await utilityCommon.closePopUpMessage();
            await previewKnowledgePo.clickGoToArticleButton();
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleTitle()).toBe('Knowledge' + randomStr);
            expect(await viewKnowledgeArticlePo.getKnowledgeSet()).toBe('HR');
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            await editKnowledgePage.selectRegionDropDownOption('Americas');
            await editKnowledgePage.setCategoryTier1('Employee Relations');
            await editKnowledgePage.setCategoryTier2('Compensation');
            await editKnowledgePage.setCategoryTier3('Bonus');
            await editKnowledgePage.selectSiteGroupDropDownOption('Human Resources');
            await editKnowledgePage.selectSiteDropDownOption('Houston');
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'Compensation and Benefits');
            await changeAssignmentBladePo.setDropDownValue('Assignee', 'Peter Kahn');
            await editKnowledgePage.saveKnowledgeMedataDataChanges();
            await utilityCommon.closePopUpMessage();
            expect(await viewKnowledgeArticlePo.getCategoryTier1Value()).toBe('Employee Relations');
            expect(await viewKnowledgeArticlePo.getCategoryTier2Value()).toBe('Compensation');
            expect(await viewKnowledgeArticlePo.getCategoryTier3Value()).toBe('Bonus');
            expect(await viewKnowledgeArticlePo.getRegionValue()).toBe('Americas');
            expect(await viewKnowledgeArticlePo.getSiteGroupValue()).toBe('Human Resources');
            expect(await viewKnowledgeArticlePo.getSiteValue()).toBe('Houston');
            expect(await viewKnowledgeArticlePo.getAssigneeValue()).toContain('Peter Kahn');
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        });
        afterAll(async () => {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        });
    });

    it('[6341]:ArticleCreation_User assign knowledge article to a specific support group', async () => {
        let articleData = {
            "knowledgeSet": "HR",
            "title": 'knowledge2746' + randomStr,
            "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
            "assignedCompany": "Petramco",
            "assigneeBusinessUnit": "United States Support",
            "assigneeSupportGroup": "US Support 1",
            "assignee": "kayo",
            "categoryTier1": "Applications",
            "categoryTier2": "Help Desk",
            "categoryTier3": "Incident",
            "region": "Australia",
            "site": "Canberra",
            "articleDesc": 'knowledge2746' + randomStr,
        }
        await apiHelper.apiLogin(knowledgeCoachUser);
        let kaDetails = await apiHelper.createKnowledgeArticle(articleData);
        await navigationPage.signOut();
        await loginPage.login(knowledgeCoachUser);
        await navigationPage.switchToApplication(knowledgeManagementApp);
        expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
        await utilityGrid.searchAndOpenHyperlink(kaDetails.displayId);
        await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
        await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'Compensation and Benefits');
        await changeAssignmentBladePo.setDropDownValue('Assignee', 'Peter Kahn');
        await editKnowledgePage.saveKnowledgeMedataDataChanges();
        await utilityCommon.closePopUpMessage();
        expect(await viewKnowledgeArticlePo.getAssigneeValue()).toContain('Peter Kahn');
        await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        await navigationPage.signOut();
        await loginPage.login('peter');
        await navigationPage.switchToApplication(knowledgeManagementApp);
        expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
        await utilityGrid.searchAndOpenHyperlink(kaDetails.displayId);
        await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
        await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'Employee Relations');
        await changeAssignmentBladePo.setDropDownValue('Assignee', 'Elizabeth Peters');
        await editKnowledgePage.saveKnowledgeMedataDataChanges();
        await utilityCommon.closePopUpMessage();
        expect(await viewKnowledgeArticlePo.getAssigneeValue()).toContain('Elizabeth Peters');
        await utilityCommon.switchToDefaultWindowClosingOtherTabs();
    });

    describe('[5760,5759]:[Attachment] - Create article with maximum attachment - 30 attachments', async () => {
        let kaDetails1, kaDetails2, articleData1, articleData2;
        let fileName: string[] = ['bwfJpg.jpg', 'bwfJpg1.jpg', 'bwfJpg2.jpg', 'bwfJpg3.jpg', 'bwfJpg4.jpg', 'bwfJson1.json', 'bwfJson2.json', 'bwfJson3.json', 'bwfJson4.json', 'bwfJson5.json', 'bwfPdf.pdf', 'bwfPdf1.pdf', 'bwfPdf2.pdf', 'bwfPdf3.pdf', 'bwfPdf4.pdf', 'bwfWord1.rtf', 'bwfWord2.rtf', 'bwfWord3.rtf', 'bwfWord4.rtf', 'bwfWord5.rtf', 'articleStatus.png', 'bwfContact.contact', 'bwfXlsx.xlsx', 'bwfXlsx1.xlsx', 'bwfXsl.xsl', 'bwfXsl1.xsl', 'bwfXml.xml', 'bwfXml1.xml', 'demo.txt', 'demo1.txt'];
        beforeAll(async () => {
            await apiHelper.apiLogin(knowledgeCoachUser);
            articleData1 = {
                "knowledgeSet": "HR",
                "title": 'KA1' + randomStr,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United States Support",
                "assigneeSupportGroup": "US Support 1",
                "assignee": "kayo",
            }
            articleData2 = {
                "knowledgeSet": "HR",
                "title": 'KA2' + randomStr,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United States Support",
                "assigneeSupportGroup": "US Support 1",
                "assignee": "kayo",
            }
            kaDetails1 = await apiHelper.createKnowledgeArticle(articleData1);
            kaDetails2 = await apiHelper.createKnowledgeArticle(articleData2);
        });
        it('[5760,5759]:[Attachment] - Create article with maximum attachment - 30 attachments', async () => {
            await navigationPage.signOut();
            await loginPage.login(knowledgeCoachUser);
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilityGrid.searchAndOpenHyperlink(kaDetails1.displayId);
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            for (let i: number = 0; i < fileName.length; i++) {
                await editKnowledgePage.addAttachment([`../../data/ui/attachment/${fileName[i]}`]);
            }
            await editKnowledgePage.saveKnowledgeMedataDataChanges();
            await utilityCommon.closePopUpMessage();
            await viewKnowledgeArticlePo.clickShowMoreButton();
            expect(await viewKnowledgeArticlePo.getAttachmentCountFromKA()).toBe(30);
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            for (let i: number = 0; i < fileName.length; i++) {
                await editKnowledgePage.removeAttachment();
            }
            await editKnowledgePage.setCategoryTier1('Employee Relations');
            await editKnowledgePage.saveKnowledgeMedataDataChanges();
            await utilityCommon.closePopUpMessage();
            expect(await viewKnowledgeArticlePo.getAttachmentCountFromKA()).toBe(0);
        });
        it('[5760,5759]:[Attachment] - Create article with maximum attachment - 30 attachments', async () => {
            await navigationPage.gotoKnowledgeConsole(true);
            await utilityGrid.searchAndOpenHyperlink(kaDetails2.displayId);
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            await editKnowledgePage.addAttachment(['../../data/ui/attachment/bwfJpg.jpg']);
            await editKnowledgePage.setCategoryTier1('Total Rewards');
            await editKnowledgePage.saveKnowledgeMedataDataChanges();
            await utilityCommon.closePopUpMessage();
            expect(await viewKnowledgeArticlePo.isAttachedFileNamePresent('bwfJpg')).toBeTruthy();
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            await editKnowledgePage.setCategoryTier1('Employee Relations');
            await editKnowledgePage.removeAttachment();
            await editKnowledgePage.saveKnowledgeMedataDataChanges();
            expect(await viewKnowledgeArticlePo.isAttachedFileNamePresent('bwfJpg')).toBeFalsy();
        });
        afterAll(async () => {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[6286,6285,6309,5939]:[Knowledge Article Search] Knowledge Articles are searched based on Case Summary and  in the Resources tab', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let knowledgeArticleData1, knowledgeArticleData2, caseData, createCaseResponse;
        beforeAll(async () => {
            await apiHelper.apiLogin('elizabeth');
            let caseTemplateData = {
                "templateName": randomStr+'caseTemplateForSelfApprovalWithoutProcessWithCriticalPriority',
                "templateSummary": 'Automated One must Approval Case',
                "categoryTier1": 'Applications',
                "casePriority": "Critical",
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }
            let articleData = {
                "knowledgeSet": "HR",
                "title": "KnowledgeArticle",
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "categoryTier1": "Applications",
                "categoryTier2": "Help Desk",
                "categoryTier3": "Incident",
                "region": "Australia",
                "site": "Canberra",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United Kingdom Support",
                "assigneeSupportGroup": "GB Support 2",
                "assignee": "KMills"
            }
            let caseTemplateResponse = await apiHelper.createCaseTemplate(caseTemplateData);
            let caseTemplateDisplayId: string = caseTemplateResponse.displayId;
            articleData.title = randomStr + "_" +"bonus";
            knowledgeArticleData1 = await apiHelper.createKnowledgeArticle(articleData);
            articleData.title = randomStr + "_" +"compensation";
            knowledgeArticleData2 = await apiHelper.createKnowledgeArticle(articleData);
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData1.id, "Draft")).toBeTruthy("Article with Draft status not updated.");
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData1.id, 'PublishApproval', "KMills", 'GB Support 2', 'Petramco')).toBeTruthy("Article with Published status not updated.");
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData2.id, "Draft")).toBeTruthy("Article with Draft status not updated.");
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData2.id, 'PublishApproval', "KMills", 'GB Support 2', 'Petramco')).toBeTruthy("Article with Published status not updated.");
            caseData = {
                "Requester": "qdu",
                "Summary": randomStr + "_" +"bonus",
                "Case Template ID": caseTemplateDisplayId
            }
            createCaseResponse = await apiHelper.createCase(caseData);
            await browser.sleep(5000); // hardwait to populate resource tab data
        });
        it('[6286,6285,6309,5939]:[Knowledge Article Search] Knowledge Articles are searched based on Case Summary and  in the Resources tab', async () => {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(createCaseResponse.displayId);
            await viewCasePage.clickOnTab('Resources');
            await browser.sleep(7000); // hardwait to populate resource tab data
            expect(await resources.getAdvancedSearchResultForParticularSection(caseData.Summary)).toEqual(caseData.Summary);
            await resources.pinRecommendedKnowledgeArticles(1);
            expect(await resources.isFirstPinnedArticleDisplayed()).toBeTruthy();
            await viewCasePage.clickEditCaseButton();
            await editCasePo.setCaseSummary(randomStr+'Updated Summary');
            await editCasePo.clickSaveCase();
            expect(await resources.isFirstPinnedArticleDisplayed()).toBeTruthy();
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(createCaseResponse.displayId);
            await viewCasePage.clickOnTab('Resources');
            expect(await resources.isFirstPinnedArticleDisplayed()).toBeTruthy();
            await resources.unpinRecommendedKnowledgeArticles(1);
            expect(await resources.isFirstPinnedArticleDisplayed()).toBeFalsy();
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(createCaseResponse.displayId);
            await viewCasePage.clickOnTab('Resources');
            expect(await resources.isFirstPinnedArticleDisplayed()).toBeFalsy();
        });
        it('[6286,6285,6309,5939]:[Knowledge Article Search] Knowledge Articles are searched based on Case Summary and  in the Resources tab', async () => {
            await viewCasePage.clickEditCaseButton();
            await editCasePo.setCaseSummary(randomStr + "_" + "compensation");
            await editCasePo.clickSaveCase();
            await utilityCommon.closePopUpMessage();
            await utilityCommon.waitUntilPopUpDisappear();
            await viewCasePage.clickOnTab('Resources');
            expect(await resources.getAdvancedSearchResultForParticularSection(randomStr + "_" + "compensation")).toEqual(randomStr + "_" + "compensation");
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText("Knowledge Articles");
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.clickOnAdvancedSearchFiltersButton("Apply");
            await resources.pinRecommendedKnowledgeArticles(2);
            expect(await resources.getCountOfPinKnowledgeArticles()).toBe(2);
            await resources.clickPaginationNext();
            await resources.pinRecommendedKnowledgeArticles(2);
            expect(await resources.getCountOfPinKnowledgeArticles()).toBe(2);
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(randomStr + "_" + "compensation");
            await viewCasePage.clickOnTab('Resources');
            expect(await resources.getCountOfPinKnowledgeArticles()).toBe(4);
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        });
    });

    describe('[6434]: [Advanced Search] Advanced Search UI verification on the Knowledge Edit view', async () => {
        let articleData1, articleData2, articleData3, randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let currentDate = new Date();
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let dateFormateValue: string = months[currentDate.getMonth()];
        let dateFormate = dateFormateValue + " " + currentDate.getDate() + ", " + currentDate.getFullYear();
        let knowledgeArticleData1, knowledgeArticleData2, knowledgeArticleData3;
        beforeAll(async () => {
            await knowledgeConfigCreation();
        });
        it('[6434]: Advanced Search UI verification on the Quick Case view', async () => {
            articleData1 = {
                "knowledgeSet": `${knowledgeSetTitleStr}`,
                "title": randomStr + 'KA1',
                "templateId": `${knowledgeTemplateId}`,
                "categoryTier1": "Workforce Administration",
                "region": "Americas",
                "siteGroup": "Human Resources",
                "site": "Houston",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United Kingdom Support",
                "assigneeSupportGroup": "GB Support 2",
                "assignee": "KMills"
            }
            articleData2 = {
                "knowledgeSet": `${knowledgeSetTitleStr}`,
                "title": randomStr + 'KA2',
                "templateId": `${knowledgeTemplateId}`,
                "categoryTier1": "Workforce Administration",
                "region": "Europe",
                "siteGroup": "Sales",
                "site": "Barcelona 1",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United Kingdom Support",
                "assigneeSupportGroup": "GB Support 2",
                "assignee": "KMills"
            }
            articleData3 = {
                "knowledgeSet": `${knowledgeSetTitleStr}`,
                "title": randomStr + 'KA3',
                "templateId": `${knowledgeTemplateId}`,
                "categoryTier1": "Employee Relations",
                "region": "Asia-Pac",
                "siteGroup": "Engineering",
                "site": "Canberra",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United Kingdom Support",
                "assigneeSupportGroup": "GB Support 2",
                "assignee": "KMills"
            }
            await apiHelper.apiLogin('qtao');
            knowledgeArticleData1 = await apiHelper.createKnowledgeArticle(articleData1);
            knowledgeArticleData2 = await apiHelper.createKnowledgeArticle(articleData2);
            knowledgeArticleData3 = await apiHelper.createKnowledgeArticle(articleData3);
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData1.id, 'Draft')).toBeTruthy('Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData2.id, 'Draft')).toBeTruthy('Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData3.id, 'Draft')).toBeTruthy('Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData1.id, 'PublishApproval')).toBeTruthy('Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData2.id, 'PublishApproval')).toBeTruthy('Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData3.id, 'PublishApproval')).toBeTruthy('Status Not Set');
        });
        it('[6434]: Advanced Search UI verification on the Quick Case view', async () => {
            await navigationPage.signOut();
            await loginPage.login('kmills');
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilityGrid.searchAndOpenHyperlink(knowledgeArticleData1.displayId);
            await viewKnowledgeArticlePo.clickOnTab("Resources");
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText("Suggested Articles");
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            expect(await resources.isFilterAvailable('Status')).toBeTruthy();
            expect(await resources.isFilterAvailable('Knowledge Set')).toBeTruthy();
            expect(await resources.isFilterAvailable('Site')).toBeTruthy();
            expect(await resources.isFilterAvailable('Region')).toBeTruthy();
            expect(await resources.isFilterAvailable('Operational Category Tier 1')).toBeTruthy();
            let statusFieldValues: string[] = ["None", "Closed", "Retired", "Canceled", "In Progress", "Draft", "SME Review", "Published", "Publish Approval", "Retire Approval", "Request Cancelation"];
            expect(await resources.isAdvancedSearchFilterOptionDropDownValueDisplayed(statusFieldValues, 0)).toBeTruthy();
        });
        it('[6434]: [Advanced Search] Advanced Search UI verification on the Knowledge Edit view', async () => {
            await viewKnowledgeArticlePo.clickOnTab("Resources");
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.enterAdvancedSearchText(articleData2.title);
            await utilityCommon.selectDropDown('Status', 'Published', DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton('Apply');
            expect(await resources.getAdvancedSearchResultForParticularSection(articleData2.title)).toEqual(articleData2.title);
            await resources.clickOnAdvancedSearchFiltersButton('Clear');
            await resources.enterAdvancedSearchText(articleData3.title);
            await utilityCommon.selectDropDown('Knowledge Set', `${knowledgeSetTitleStr}`, DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton('Apply');
            expect(await resources.getAdvancedSearchResultForParticularSection(articleData3.title)).toEqual(articleData3.title);
            await resources.clickOnAdvancedSearchFiltersButton('Clear');
            await resources.enterAdvancedSearchText(articleData2.title);
            await utilityCommon.selectDropDown('Region', 'Europe', DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton('Apply');
            expect(await resources.getAdvancedSearchResultForParticularSection(articleData2.title)).toEqual(articleData2.title);
            await resources.clickOnAdvancedSearchFiltersButton('Clear');
            await resources.enterAdvancedSearchText(articleData3.title);
            await utilityCommon.selectDropDown('Site', 'Canberra', DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton('Apply');
            expect(await resources.getAdvancedSearchResultForParticularSection(articleData3.title)).toEqual(articleData3.title);
            await resources.clickOnAdvancedSearchFiltersButton('Clear');
            await resources.enterAdvancedSearchText(articleData3.title);
            await utilityCommon.selectDropDown('Operational Category Tier 1', 'Employee Relations', DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton('Apply');
            expect(await resources.getAdvancedSearchResultForParticularSection(articleData3.title)).toEqual(articleData3.title);
            expect(await resources.getKnowledgeArticleInfo()).toContain(dateFormate, 'Date not correct');
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await resources.clickArrowFirstRecommendedKnowledge('Suggested Articles');
            expect(await previewKnowledgePo.getKnowledgeArticleTitle()).toContain(articleData3.title);
            expect(await previewKnowledgePo.isBackButtonDisplay()).toBeTruthy('back button not present');
            expect(await previewKnowledgePo.isStatusOfKADisplay()).toBeTruthy('Status not displaying');
            expect(await previewKnowledgePo.getKnowledgeArticleID()).toContain('KA-', 'KA ID not correct');
            await previewKnowledgePo.clickOnBackButton();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[6433]: [Advanced Search] Advanced Search UI verification on the Case Edit view', async () => {
        let knowledgeArticleData, caseDisplayId: string, knowledgeArticleData1, articleData1, articleData2, articleData3, articleData4, articleData5, articleData6, randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let currentDate = new Date();
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let dateFormateValue: string = months[currentDate.getMonth()];
        let dateFormate = dateFormateValue + " " + currentDate.getDate() + ", " + currentDate.getFullYear();
        beforeAll(async () => {
            articleData1 = {
                "knowledgeSet": "HR",
                "title": randomStr + 'KA1',
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "categoryTier1": "Workforce Administration",
                "region": "Asia-Pac",
                "siteGroup": "Engineering",
                "site": "Canberra",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United Kingdom Support",
                "assigneeSupportGroup": "GB Support 2",
                "assignee": "KMills"
            }
            articleData2 = {
                "knowledgeSet": "HR",
                "title": randomStr + 'KA2',
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "categoryTier1": "Workforce Administration",
                "region": "Americas",
                "siteGroup": "Marketing",
                "site": "Mexico City",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United Kingdom Support",
                "assigneeSupportGroup": "GB Support 2",
                "assignee": "KMills"
            }
            articleData3 = {
                "knowledgeSet": "Benefits",
                "title": randomStr + 'KA3',
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "categoryTier1": "Workforce Administration",
                "region": "Asia-Pac",
                "siteGroup": "Engineering",
                "site": "Canberra",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United Kingdom Support",
                "assigneeSupportGroup": "GB Support 2",
                "assignee": "KMills"
            }
            articleData4 = {
                "knowledgeSet": "HR",
                "title": randomStr + 'KA4',
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "categoryTier1": "Workforce Administration",
                "region": "Europe",
                "siteGroup": "Sales",
                "site": "Barcelona 1",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United Kingdom Support",
                "assigneeSupportGroup": "GB Support 2",
                "assignee": "KMills"
            }
            articleData5 = {
                "knowledgeSet": "HR",
                "title": randomStr + 'KA5',
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "categoryTier1": "Employee Relations",
                "region": "Asia-Pac",
                "siteGroup": "Engineering",
                "site": "Canberra",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United Kingdom Support",
                "assigneeSupportGroup": "GB Support 2",
                "assignee": "KMills"
            }
            articleData6 = {
                "knowledgeSet": "HR",
                "title": randomStr + 'KA6',
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "categoryTier1": "Workforce Administration",
                "region": "Asia-Pac",
                "siteGroup": "Engineering",
                "site": "Canberra",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United Kingdom Support",
                "assigneeSupportGroup": "GB Support 2",
                "assignee": "KMills"
            }
            let caseData =
            {
                "Requester": "qtao",
                "Summary": randomStr + "caseName",
                "categoryTier1": "Purchasing Card",
                "categoryTier2": "Policies",
                "categoryTier3": "Card Issuance",
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
            }
            await apiHelper.apiLogin('qkatawazi');
            let newCase = await apiHelper.createCase(caseData);
            caseDisplayId = newCase.displayId;
            await apiHelper.apiLogin('elizabeth');
            await apiHelper.createKnowledgeArticle(articleData2);
            await apiHelper.createKnowledgeArticle(articleData3);
            await apiHelper.createKnowledgeArticle(articleData4);
            await apiHelper.createKnowledgeArticle(articleData5);
            knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData6);
            knowledgeArticleData1 = await apiHelper.createKnowledgeArticle(articleData1);
            let knowledgeArticleGUID = knowledgeArticleData1.id;
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'Draft')).toBeTruthy('Status Not Set');
        });
        it('[6433]: [Advanced Search] Advanced Search UI verification on the Case Edit view', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseDisplayId);
            await viewCasePage.clickOnTab("Resources");
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText("Suggested Articles");
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            expect(await resources.isFilterAvailable('Status')).toBeTruthy();
            expect(await resources.isFilterAvailable('Knowledge Set')).toBeTruthy();
            expect(await resources.isFilterAvailable('Site')).toBeTruthy();
            expect(await resources.isFilterAvailable('Region')).toBeTruthy();
            expect(await resources.isFilterAvailable('Operational Category Tier 1')).toBeTruthy();
            let statusFieldValues: string[] = ["None", "Closed", "Retired", "Canceled", "In Progress", "Draft", "SME Review", "Published", "Publish Approval", "Retire Approval", "Request Cancelation"];
            expect(await resources.isAdvancedSearchFilterOptionDropDownValueDisplayed(statusFieldValues, 0)).toBeTruthy();
        });
        it('[6433]: [Advanced Search] Advanced Search UI verification on the Case Edit view', async () => {
            await viewKnowledgeArticlePo.clickOnTab("Resources");
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.enterAdvancedSearchText(articleData1.title);
            await utilityCommon.selectDropDown('ArticleStatus', 'Draft', DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton('Apply');
            expect(await resources.getAdvancedSearchResultForParticularSection(articleData1.title)).toEqual(articleData1.title);
            await resources.clickOnAdvancedSearchFiltersButton('Clear');
            await resources.enterAdvancedSearchText(articleData3.title);
            await utilityCommon.selectDropDown('Knowledge Set', 'Benefits', DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton('Apply');
            expect(await resources.getAdvancedSearchResultForParticularSection(articleData3.title)).toEqual(articleData3.title);
            await resources.clickOnAdvancedSearchFiltersButton('Clear');
            await resources.enterAdvancedSearchText(articleData2.title);
            await utilityCommon.selectDropDown('Region', 'Americas', DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton('Apply');
            expect(await resources.getAdvancedSearchResultForParticularSection(articleData2.title)).toEqual(articleData2.title);
            await resources.clickOnAdvancedSearchFiltersButton('Clear');
            await resources.enterAdvancedSearchText(articleData4.title);
            await utilityCommon.selectDropDown('Site', 'Barcelona 1', DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton('Apply');
            expect(await resources.getAdvancedSearchResultForParticularSection(articleData4.title)).toEqual(articleData4.title);
            await resources.clickOnAdvancedSearchFiltersButton('Clear');
            await resources.enterAdvancedSearchText(articleData5.title);
            await utilityCommon.selectDropDown('Operational Category Tier 1', 'Employee Relations', DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton('Apply');
            expect(await resources.getAdvancedSearchResultForParticularSection(articleData5.title)).toEqual(articleData5.title);
            expect(await resources.getKnowledgeArticleInfo()).toContain(dateFormate, 'Date not correct');
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            await resources.clickArrowFirstRecommendedKnowledge('Knowledge Articles');
            expect(await previewKnowledgePo.getKnowledgeArticleTitle()).toContain(articleData5.title);
            expect(await previewKnowledgePo.isBackButtonDisplay()).toBeTruthy('back button not present');
            expect(await previewKnowledgePo.isStatusOfKADisplay()).toBeTruthy('Status not displaying');
            expect(await previewKnowledgePo.getKnowledgeArticleID()).toContain('KA-', 'KA ID not correct');
            await previewKnowledgePo.clickOnBackButton();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[6432]: Advanced Search UI verification on the Quick Case view', async () => {
        let articleData, kaDetails, randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let currentDate = new Date();
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let dateFormateValue: string = months[currentDate.getMonth()];
        let dateFormate = dateFormateValue + " " + currentDate.getDate() + ", " + currentDate.getFullYear();
        beforeAll(async () => {
            articleData = {
                "knowledgeSet": "HR",
                "title": 'knowledge3542' + randomStr,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "categoryTier1": "Workforce Administration",
                "region": "Asia-Pac",
                "siteGroup": "Engineering",
                "site": "Canberra",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United States Support",
                "assigneeSupportGroup": "US Support 1",
                "assignee": "kayo"
            }
            await apiHelper.apiLogin('qkatawazi');
            kaDetails = await apiHelper.createKnowledgeArticle(articleData);
            await apiHelper.createKnowledgeArticle(articleData);
            await apiHelper.createKnowledgeArticle(articleData);
            await apiHelper.createKnowledgeArticle(articleData);
            await apiHelper.createKnowledgeArticle(articleData);
            await apiHelper.createKnowledgeArticle(articleData);
        });
        it('[6432]: Advanced Search UI verification on the Quick Case view', async () => {
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName("qkatawazi");
            await quickCasePo.setCaseSummary(articleData.title);
            await resources.clickOnAdvancedSearchOptions();
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            expect(await resources.isFilterAvailable('Status')).toBeTruthy();
            expect(await resources.isFilterAvailable('Knowledge Set')).toBeTruthy();
            expect(await resources.isFilterAvailable('Site')).toBeTruthy();
            expect(await resources.isFilterAvailable('Region')).toBeTruthy();
            expect(await resources.isFilterAvailable('Operational Category Tier 1')).toBeTruthy();
            let statusFieldValues: string[] = ["None", "Closed", "Retired", "Canceled", "In Progress", "Draft", "SME Review", "Published", "Publish Approval", "Retire Approval", "Request Cancelation"];
            expect(await resources.isAdvancedSearchFilterOptionDropDownValueDisplayed(statusFieldValues, 0)).toBeTruthy();
            await utilityCommon.selectDropDown('Status', 'None', DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton('Apply');
        });
        it('[6432]: Advanced Search UI verification on the Quick Case view', async () => {
            await quickCasePo.clickStartOverButton();
            await quickCasePo.selectRequesterName("qkatawazi");
            await quickCasePo.setCaseSummary(articleData.title);
            await resources.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions();
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await utilityCommon.selectDropDown('Status', 'In Progress', DropDownType.Label);
            await utilityCommon.selectDropDown('Knowledge Set', 'HR', DropDownType.Label);
            await utilityCommon.selectDropDown('Operational Category Tier 1', 'Workforce Administration', DropDownType.Label);
            await utilityCommon.selectDropDown('Region', 'Asia-Pac', DropDownType.Label);
            await utilityCommon.selectDropDown('Site', 'Canberra', DropDownType.Label);
            await resources.clickOnAdvancedSearchFiltersButton('Apply');
            expect(await resources.getKnowledgeArticleInfo()).toContain(articleData.title, 'title not correct');
            expect(await resources.getKnowledgeArticleInfo()).toContain('Qadim Katawazi', 'Author not correct');
            expect(await resources.getKnowledgeArticleInfo()).toContain('In Progress', 'status not correct');
            expect(await resources.getKnowledgeArticleInfo()).toContain(dateFormate, 'KA ID not correct');
            await resources.clickArrowFirstRecommendedKnowledge('Recommended Knowledge');
            expect(await previewKnowledgePo.getKnowledgeArticleTitle()).toContain(articleData.title);
            expect(await previewKnowledgePo.isBackButtonDisplay()).toBeTruthy('back button not present');
            expect(await previewKnowledgePo.isStatusOfKADisplay()).toBeTruthy('Status not displaying');
            expect(await previewKnowledgePo.getKnowledgeArticleID()).toContain('KA-', 'KA ID not correct');
            await previewKnowledgePo.clickOnBackButton();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[5532]: [KM][Knowledge Article Console] Knowledge article search using filters', async () => {
        let knowledgeArticleData;
        let arr1: string[] = ["Assignee", "Assigned Group", "Template Name", "Knowledge Set", "Article ID"];
        let arr2: string[] = ["Company", "Reviewer", "GUID", "Author", "Review Status", "Article ID"];
        let arr3: string[] = ["Created Date", "Article ID", "Reviewer Group", "Title", "Status", "Flagged", "Modified Date"];
        beforeAll(async () => {
            await apiHelper.apiLogin('peter');
            let articleData = {
                "knowledgeSet": "HR",
                "title": "KnowledgeArticle",
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "categoryTier1": "Applications",
                "categoryTier2": "Help Desk",
                "categoryTier3": "Incident",
                "region": "Australia",
                "site": "Canberra",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United Kingdom Support",
                "assigneeSupportGroup": "GB Support 2",
                "assignee": "KMills"
            }
            knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData.id, "Draft")).toBeTruthy("Article with Draft status not updated.");
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData.id, "SMEReview", "KMills", 'GB Support 2', 'Petramco')).toBeTruthy("Article with SME Review status not updated.");
        });
        it('[5532]: [KM][Knowledge Article Console] Knowledge article search using filters', async () => {
            await navigationPage.signOut();
            await loginPage.login('peter');
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr, 'title not correct');
            await utilityGrid.clearFilter();
            await knowledgeArticlesConsolePo.addColumnOnGrid(arr1);
            await knowledgeArticlesConsolePo.applyFilter('Assignee', "Kyle Mills", 'text');
            await utilityGrid.searchRecordWithoutClearFilter(knowledgeArticleData.displayId);
            expect(await knowledgeArticlesConsolePo.getSelectedGridRecordValue('Assignee')).toContain("Kyle Mills", 'Filter Assignee is missing in column');
            await utilityGrid.clearFilter();
            await knowledgeArticlesConsolePo.applyFilter('Assigned Group', "GB Support 2", 'text');
            await utilityGrid.searchRecordWithoutClearFilter(knowledgeArticleData.displayId);
            expect(await knowledgeArticlesConsolePo.getSelectedGridRecordValue('Assigned Group')).toBe("GB Support 2", 'Filter Assigned Group is missing in column');
            await utilityGrid.clearFilter();
            await knowledgeArticlesConsolePo.applyFilter('Template Name', "How To", 'text');
            await utilityGrid.searchRecordWithoutClearFilter(knowledgeArticleData.displayId);
            expect(await knowledgeArticlesConsolePo.getSelectedGridRecordValue('Template Name')).toBe("How To", 'Filter Template Name is missing in column');
            await utilityGrid.clearFilter();
            await knowledgeArticlesConsolePo.applyFilter('Knowledge Set', "HR", 'text');
            await utilityGrid.searchRecordWithoutClearFilter(knowledgeArticleData.displayId);
            expect(await knowledgeArticlesConsolePo.getSelectedGridRecordValue('Knowledge Set')).toBe("HR", 'Filter Knowledge Set is missing in column');
        });
        it('[5532]: [KM][Knowledge Article Console] Knowledge article search using filters', async () => {
            await utilityGrid.clearFilter();
            await knowledgeArticlesConsolePo.removeColumnOnGrid(arr1);
            await knowledgeArticlesConsolePo.addColumnOnGrid(arr2);
            await knowledgeArticlesConsolePo.applyFilter('Company', "Petramco", 'text');
            await utilityGrid.searchRecordWithoutClearFilter(knowledgeArticleData.displayId);
            expect(await knowledgeArticlesConsolePo.getSelectedGridRecordValue('Company')).toBe("Petramco", 'Filter Company is missing in column');
            await utilityGrid.clearFilter();
            await knowledgeArticlesConsolePo.applyFilter('Reviewer', "Kyle Mills", 'text');
            await utilityGrid.searchRecordWithoutClearFilter(knowledgeArticleData.displayId);
            expect(await knowledgeArticlesConsolePo.getSelectedGridRecordValue('Reviewer')).toBe("Kyle Mills", 'Filter Reviewer is missing in column');
            await utilityGrid.clearFilter();
            await knowledgeArticlesConsolePo.applyFilter('Author', "Peter Kahn", 'text');
            await utilityGrid.searchRecordWithoutClearFilter(knowledgeArticleData.displayId);
            expect(await knowledgeArticlesConsolePo.getSelectedGridRecordValue('Author')).toBe("Peter Kahn", 'Filter Author is missing in column');
            await utilityGrid.clearFilter();
            await knowledgeArticlesConsolePo.applyFilter('Review Status', "Pending Review", 'checkbox');
            await utilityGrid.searchRecordWithoutClearFilter(knowledgeArticleData.displayId);
            expect(await knowledgeArticlesConsolePo.getSelectedGridRecordValue('Review Status')).toBe("Pending Review", 'Filter Review Status is missing in column');
        });
        it('[5532]: [KM][Knowledge Article Console] Knowledge article search using filters', async () => {
            let finalDate: string = await utilityCommon.getCurrentDate();
            let createdDate = new Date();
            let month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            let dateFormateValue: string = month[createdDate.getMonth()];
            let dateFormateNew: string = dateFormateValue.substring(0, 3);
            let dateFormate: string = dateFormateNew + " " + createdDate.getDate() + ", " + createdDate.getFullYear();
            await utilityGrid.clearFilter();
            await knowledgeArticlesConsolePo.removeColumnOnGrid(arr2);
            await knowledgeArticlesConsolePo.addColumnOnGrid(arr3);
            await knowledgeArticlesConsolePo.applyFilter('Article ID', knowledgeArticleData.displayId, 'text');
            await utilityGrid.searchRecordWithoutClearFilter(knowledgeArticleData.displayId);
            expect(await knowledgeArticlesConsolePo.getSelectedGridRecordValue('Article ID')).toBe(knowledgeArticleData.displayId, 'Filter Article ID is missing in column');
            await utilityGrid.clearFilter();
            await knowledgeArticlesConsolePo.applyFilter('Reviewer Group', "GB Support 2", 'text');
            await utilityGrid.searchRecordWithoutClearFilter(knowledgeArticleData.displayId);
            expect(await knowledgeArticlesConsolePo.getSelectedGridRecordValue('Reviewer Group')).toBe("GB Support 2", 'Filter Reviewer Group is missing in column');
            await utilityGrid.clearFilter();
            await knowledgeArticlesConsolePo.applyFilter('Title', "KnowledgeArticle", 'text');
            await utilityGrid.searchRecordWithoutClearFilter(knowledgeArticleData.displayId);
            expect(await knowledgeArticlesConsolePo.getSelectedGridRecordValue('Title')).toBe("KnowledgeArticle", 'Filter Title is missing in column');
            await utilityGrid.clearFilter();
            await knowledgeArticlesConsolePo.applyFilter('Status', "SME Review", 'text');
            await utilityGrid.searchRecordWithoutClearFilter(knowledgeArticleData.displayId);
            expect(await knowledgeArticlesConsolePo.getSelectedGridRecordValue('Status')).toBe("SME Review", 'Filter Status is missing in column');
            await utilityGrid.clearFilter();
            await knowledgeArticlesConsolePo.applyFilter('Created Date', finalDate, 'date');
            await utilityGrid.searchRecordWithoutClearFilter(knowledgeArticleData.displayId);
            expect(await knowledgeArticlesConsolePo.getSelectedGridRecordValue('Created Date')).toContain(dateFormate, 'Filter Created Date is missing in column');
            await utilityGrid.clearFilter();
            await knowledgeArticlesConsolePo.applyFilter('Modified Date', finalDate, 'date');
            await utilityGrid.searchRecordWithoutClearFilter(knowledgeArticleData.displayId);
            expect(await knowledgeArticlesConsolePo.getSelectedGridRecordValue('Modified Date')).toContain(dateFormate, 'Filter Modified Date is missing in column');
        });
        it('[5532]: [KM][Knowledge Article Console] Knowledge article search using filters', async () => {
            await utilityGrid.searchAndOpenHyperlink(knowledgeArticleData.displayId);
            expect(await viewKnowledgeArticlePo.isFlagArticleOptionDisplayed()).toBeTruthy('Flag Article option is displayed.');
            await viewKnowledgeArticlePo.clickOnFlagButton();
            await flagUnflagKnowledgePo.setTextInTellUsMore(knowledgeArticleData.displayId);
            await flagUnflagKnowledgePo.clickOnFlageButtonOnBlade();
            await utilityCommon.closePopUpMessage();
            await navigationPage.gotoKnowledgeConsole(true);
            await utilityGrid.clearFilter();
            await knowledgeArticlesConsolePo.applyFilter('Flagged', "Yes", 'checkbox');
            await utilityGrid.searchRecordWithoutClearFilter(knowledgeArticleData.displayId);
            expect(await knowledgeArticlesConsolePo.getSelectedGridRecordValue('Flagged')).toBe("Yes", 'Filter Flagged is missing in column');
        });
        afterAll(async () => {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        });
    });

    describe('[6408]: [Knowledge Article] Knowledge Article creation', async () => {
        let knowledgeArticleData;
        let articleData, randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            articleData = {
                "knowledgeSet": "HR",
                "title": "KnowledgeArticle" + randomStr,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "categoryTier1": "Employee Relations",
                "categoryTier2": "Compensation",
                "categoryTier3": "Bonus",
                "region": "Asia-Pac",
                "siteGroup": "Engineering",
                "site": "Canberra",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United Kingdom Support",
                "assigneeSupportGroup": "GB Support 2",
                "assignee": "KMills"
            }
            await apiHelper.apiLogin('kWilliamson');
            knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
        });
        it('[6408]:[Knowledge Article] Knowledge Article creation', async () => {
            await navigationPage.signOut();
            await loginPage.login('kWilliamson');
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr, 'title not correct');
            await utilityGrid.searchAndOpenHyperlink(knowledgeArticleData.displayId);
            await viewKnowledgeArticlePo.clickOnEditLink();
            await editKnowledgePage.changeKnowledgeTitle("UpdatedKnowledgeArticle" + randomStr);
            await editKnowledgePage.clickOnSaveButtonOfKA();
            await navigationPage.gotoKnowledgeConsole(true);
            await utilityGrid.searchAndOpenHyperlink("UpdatedKnowledgeArticle" + randomStr);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleTitle()).toContain("UpdatedKnowledgeArticle" + randomStr, 'title not correct');
            expect(await viewKnowledgeArticlePo.getKnowledgeSet()).toBe('HR');
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleAuthor()).toBe('Kane Williamson');
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleCompany()).toBe('Petramco');
            expect(await viewKnowledgeArticlePo.getCategoryTier1Value()).toBe(articleData.categoryTier1);
            expect(await viewKnowledgeArticlePo.getCategoryTier2Value()).toBe(articleData.categoryTier2);
            expect(await viewKnowledgeArticlePo.getCategoryTier3Value()).toBe(articleData.categoryTier3);
            expect(await viewKnowledgeArticlePo.getRegionValue()).toBe(articleData.region);
            expect(await viewKnowledgeArticlePo.getSiteValue()).toBe(articleData.site);
            expect(await viewKnowledgeArticlePo.getKnowledgeArticleAssigneeGroupValue()).toBe('GB Support 2');
        });
        afterAll(async () => {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        });
    });

    describe('[3577]:[UI] [KA Access] - UI behavior for adding/removing Access in knowledge article.', async () => {
        let knowledgeArticleData;
        let articleData, randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let businessData = businessDataFile['BusinessUnitData'];
        let departmentData = departmentDataFile['DepartmentData'];
        let suppGrpData = supportGrpDataFile['SuppGrpData'];
        beforeAll(async () => {
            articleData = {
                "knowledgeSet": "HR",
                "title": "KnowledgeArticle" + randomStr,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "categoryTier1": "Applications",
                "categoryTier2": "Help Desk",
                "categoryTier3": "Incident",
                "region": "Americas",
                "siteGroup":'Human Resources',
                "site": "Houston",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United Kingdom Support",
                "assigneeSupportGroup": "GB Support 2",
                "assignee": "KMills"
            }
            await apiHelper.apiLogin('kWilliamson');
            knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
        });
        it('[3577]:[UI] [KA Access] - UI behavior for adding/removing Access in knowledge article.', async () => {
            await navigationPage.signOut();
            await loginPage.login('kWilliamson');
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr, 'title not correct');
            await utilityGrid.searchAndOpenHyperlink(knowledgeArticleData.displayId);
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed("GB Support 2", 'Write')).toBeTruthy('FailuerMsg1: Support Group Name is missing');
            await viewKnowledgeArticlePo.clickEditKnowledgeAccess();
            await accessTabPo.clickToExpandAccessEntitiySearch('Support Group Access', 'Knowledge');
            await accessTabPo.selectAccessEntityDropDown('Petramco', 'Select Company');
            await accessTabPo.selectAccessEntityDropDown('GB Support 1', 'Select Support Group');
            await accessTabPo.clickAccessEntitiyAddButton('Support Group');
            await accessTabPo.clickCloseKnowledgeAccessBlade();
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('GB Support 1', 'Read')).toBeTruthy('FailuerMsg1: Support Group Name is missing');
            await viewKnowledgeArticlePo.clickEditKnowledgeAccess();
            await accessTabPo.clickToExpandAccessEntitiySearch('Agent Access', 'Knowledge');
            await accessTabPo.selectAgent('Qianru Tao', 'Agent');
            await accessTabPo.clickAccessEntitiyAddButton('Agent');
            await accessTabPo.clickCloseKnowledgeAccessBlade();
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('Qianru Tao', 'Read')).toBeTruthy('FailuerMsg1: Support Group Name is missing');
        });
        it('[3577]:[UI] [KA Access] - UI behavior for adding/removing Access in knowledge article.', async () => {
            await viewKnowledgeArticlePo.clickEditKnowledgeAccess();
            await accessTabPo.clickRemoveAccess('GB Support 1', true);
            await accessTabPo.clickAccessRemoveWarningBtn('Yes');
            await accessTabPo.clickCloseKnowledgeAccessBlade();
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('GB Support 1', 'Read')).toBeFalsy('FailuerMsg1: Support Group Name is missing');
        });
        it('[3577]:[UI] [KA Access] - UI behavior for adding/removing Access in knowledge article.', async () => {
            await viewKnowledgeArticlePo.clickEditKnowledgeAccess();
            await accessTabPo.clickToExpandAccessEntitiySearch('Support Group Access', 'Knowledge');
            await accessTabPo.selectAccessEntityDropDown('Petramco', 'Select Company');
            await accessTabPo.selectAccessEntityDropDown('GB Support 1', 'Select Support Group');
            await accessTabPo.clickAssignWriteAccessCheckbox("Support Group");
            await accessTabPo.clickAccessEntitiyAddButton('Support Group');
            await accessTabPo.clickCloseKnowledgeAccessBlade();
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('GB Support 1', 'Write')).toBeTruthy('FailuerMsg1: Support Group Name is missing');
            await viewKnowledgeArticlePo.clickEditKnowledgeAccess();
            await accessTabPo.clickToExpandAccessEntitiySearch('Agent Access', 'Knowledge');
            await accessTabPo.selectAgent('Qianru Tao', 'Agnet');
            await accessTabPo.clickAccessEntitiyAddButton('Agnet');
            await accessTabPo.clickCloseKnowledgeAccessBlade();
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('Qianru Tao', 'Read')).toBeTruthy('FailuerMsg1: Support Group Name is missing');
        });
        it('[3577]:[UI] [KA Access] - UI behavior for adding/removing Access in knowledge article.', async () => {
            await viewKnowledgeArticlePo.clickEditKnowledgeAccess();
            await accessTabPo.clickRemoveAccess('GB Support 1', true);
            await accessTabPo.clickAccessRemoveWarningBtn('Yes');
            await accessTabPo.clickCloseKnowledgeAccessBlade();
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed(suppGrpData.orgName, 'Write')).toBeFalsy('FailuerMsg1: Support Group Name is missing');
        });
        it('[3577]:[UI] [KA Access] - UI behavior for adding/removing Access in knowledge article.', async () => {
            await viewKnowledgeArticlePo.clickEditKnowledgeAccess();
            await accessTabPo.clickToExpandAccessEntitiySearch('Support Group Access', 'Knowledge');
            await accessTabPo.selectAccessEntityDropDown('Petramco', 'Select Company');
            await accessTabPo.selectAccessEntityDropDown('Compensation and Benefits', 'Select Support Group');
            await accessTabPo.clickAccessEntitiyAddButton('Support Group');
            await accessTabPo.clickToExpandAccessEntitiySearch('Agent Access', 'Knowledge');
            await accessTabPo.selectAgent('Peter Kahn', 'Agent');
            await accessTabPo.clickAccessEntitiyAddButton('Agent');
            await accessTabPo.clickCloseKnowledgeAccessBlade();
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('Peter Kahn', 'Read')).toBeTruthy('FailuerMsg1: Support Group Name is missing');
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('peter');
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr, 'title not correct');
            await utilityGrid.searchAndOpenHyperlink(knowledgeArticleData.displayId);
            await viewKnowledgeArticlePo.clickEditKnowledgeAccess();
            expect(await accessTabPo.isAccessEntityDisplayed('Support Group Access', 'Knowledge')).toBeFalsy('FailuerMsg1: Support Group Access is missing');
            expect(await accessTabPo.isAccessEntityDisplayed('Agent Access', 'Knowledge')).toBeFalsy('FailuerMsg1: Agent Access is missing');
            await accessTabPo.clickCloseKnowledgeAccessBlade();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        });
    });

    describe('[6418]:[Advanced Search] [Pin/Unpin] Relate Knowledge Article on Knowledge Edit view from Advanced search', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        const knowledgeSetTitleStrPetramco = 'versionedKnowledgeSetPetramco_' + randomStr;
        it('[6418]:[Advanced Search] Knowledge Creation', async () => {
            await apiHelper.apiLogin('qkatawazi');
            let knowledgeSetData = {
                knowledgeSetTitle: `${knowledgeSetTitleStrPetramco}`,
                knowledgeSetDesc: `${knowledgeSetTitleStrPetramco}_Desc`,
                company: 'Petramco'
            }
            await apiHelper.createKnowledgeSet(knowledgeSetData);
            let articleData = {
                "knowledgeSet": `${knowledgeSetTitleStrPetramco}`,
                "title": randomStr + 'DRDMV753KnowledgeArticleKA',
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United Kingdom Support",
                "assigneeSupportGroup": "GB Support 2",
                "assignee": "KMills"
            }
            kaDetails1 = await apiHelper.createKnowledgeArticle(articleData);
            let knowledgeArticleGUID1 = kaDetails1.id;
            articleData.title = randomStr + 'DRDMV753KnowledgeArticleKA';
            kaDetails2 = await apiHelper.createKnowledgeArticle(articleData);
            let knowledgeArticleGUID2 = kaDetails2.id;
            articleData.title = randomStr + 'DRDMV753KnowledgeArticleKA';
            kaDetails3 = await apiHelper.createKnowledgeArticle(articleData);
            let knowledgeArticleGUID3 = kaDetails3.id;
            articleData.title = randomStr + 'DRDMV753KnowledgeArticleKA';
            kaDetails4 = await apiHelper.createKnowledgeArticle(articleData);
            let knowledgeArticleGUID4 = kaDetails4.id;
            articleData.title = randomStr + 'DRDMV753KnowledgeArticleKA';
            kaDetails5 = await apiHelper.createKnowledgeArticle(articleData);
            let knowledgeArticleGUID5 = kaDetails5.id;
            articleData.title = randomStr + 'DRDMV753KnowledgeArticleKA';
            kaDetails6 = await apiHelper.createKnowledgeArticle(articleData);
            let knowledgeArticleGUID6 = kaDetails6.id;
            articleData.title = randomStr + 'DRDMV753KnowledgeArticleKA';
            kaDetails7 = await apiHelper.createKnowledgeArticle(articleData);
            let knowledgeArticleGUID7 = kaDetails7.id;
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID1, 'Draft')).toBeTruthy('Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID1, 'PublishApproval')).toBeTruthy('Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID2, 'Draft')).toBeTruthy('Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID2, 'PublishApproval')).toBeTruthy('Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID3, 'Draft')).toBeTruthy('Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID3, 'PublishApproval')).toBeTruthy('Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID4, 'Draft')).toBeTruthy('Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID4, 'PublishApproval')).toBeTruthy('Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID5, 'Draft')).toBeTruthy('Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID5, 'PublishApproval')).toBeTruthy('Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID6, 'Draft')).toBeTruthy('Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID6, 'PublishApproval')).toBeTruthy('Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID7, 'Draft')).toBeTruthy('Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID7, 'PublishApproval')).toBeTruthy('Status Not Set');
            await browser.sleep(10000); //Hard wait for KA Indexing
        });
        it('[6418]:[Advanced Search] [Pin/Unpin] Relate Knowledge Article on Knowledge Edit view from Advanced search', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.switchToApplication(knowledgeManagementApp);
            expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
            await utilityGrid.searchAndOpenHyperlink(kaDetails2.displayId);
            await viewKnowledgeArticlePo.clickOnTab('Resources');
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(randomStr + 'DRDMV753KnowledgeArticleKA');
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.clickOnAdvancedSearchFiltersButton("Apply");
            await resources.pinRecommendedKnowledgeArticles(1);
            expect(await resources.isFirstPinnedArticleDisplayed()).toBeTruthy();
        });
        it('[6418]:[Advanced Search] [Pin/Unpin] Relate Knowledge Article on Knowledge Edit view from Advanced search', async () => {
            await navigationPage.gotoKnowledgeConsole(true);
            await utilityGrid.searchAndOpenHyperlink(kaDetails2.displayId);
            await viewKnowledgeArticlePo.clickOnTab("Resources");
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(randomStr + 'DRDMV753KnowledgeArticleKA');
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.clickOnAdvancedSearchFiltersButton("Apply");
            expect(await resources.isFirstPinnedArticleDisplayed()).toBeTruthy();
            await resources.pinRecommendedKnowledgeArticles(2);
            expect(await resources.getCountOfPinKnowledgeArticles()).toBe(3);
        });
        it('[6418]:[Advanced Search] [Pin/Unpin] Relate Knowledge Article on Knowledge Edit view from Advanced search', async () => {
            await navigationPage.gotoKnowledgeConsole(true);
            await utilityGrid.searchAndOpenHyperlink(kaDetails2.displayId);
            await viewKnowledgeArticlePo.clickOnTab('Resources');
            expect(await resources.getCountOfPinKnowledgeArticles()).toBe(3);
            await viewKnowledgeArticlePo.clickOnTab('Activity');
            await viewKnowledgeArticlePo.clickOnTab('Resources');
            expect(await resources.getCountOfPinKnowledgeArticles()).toBe(3);
            await resources.unpinRecommendedKnowledgeArticles(1);
            expect(await resources.isFirstPinnedArticleDisplayed()).toBeTruthy();
            await resources.unpinRecommendedKnowledgeArticles(1);
            expect(await resources.isFirstPinnedArticleDisplayed()).toBeTruthy();
            await resources.unpinRecommendedKnowledgeArticles(1);
            expect(await resources.isFirstPinnedArticleDisplayed()).toBeFalsy();
        });
        it('[6418]:[Advanced Search] [Pin/Unpin] Relate Knowledge Article on Knowledge Edit view from Advanced search', async () => {
            await navigationPage.gotoKnowledgeConsole(true);
            await utilityGrid.searchAndOpenHyperlink(kaDetails2.displayId);
            await viewKnowledgeArticlePo.clickOnTab("Resources");
            await resources.clickOnAdvancedSearchOptions();
            await resources.enterAdvancedSearchText(randomStr + 'DRDMV753KnowledgeArticleKA');
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.clickOnAdvancedSearchFiltersButton("Apply");
            await resources.pinRecommendedKnowledgeArticles(2);
            expect(await resources.getCountOfPinKnowledgeArticles()).toBe(2);
            await resources.clickPaginationNext();
            await resources.pinRecommendedKnowledgeArticles(1);
            expect(await resources.getCountOfPinKnowledgeArticles()).toBe(1);
        });
        afterAll(async () => {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });
});


